import { Hono } from "hono";
import { createOdooLead, type OdooEnv } from "../lib/odoo-crm";
import {
  answerCallbackQuery,
  editMessageText,
  getMe,
  getWebhookInfo,
  sendMessage,
  sendPhoto,
  setMyCommands,
  setWebhook,
  webhookSecretFromToken,
  type TelegramUpdate,
} from "../lib/telegram";
import {
  BOT_COMMANDS_EN,
  BOT_COMMANDS_RU,
  planUpdate,
  type BotAction,
} from "../lib/telegram-bot";

export type TelegramEnv = OdooEnv & {
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_ADMIN_CHAT_ID?: string;
};

const telegram = new Hono<{ Bindings: TelegramEnv }>();

function publicOrigin(request: Request): string {
  const url = new URL(request.url);
  const forwarded = request.headers.get("x-forwarded-proto");
  if (forwarded) url.protocol = `${forwarded.split(",")[0].trim()}:`;
  if (url.hostname === "sitboinvest.ge" || url.hostname === "www.sitboinvest.ge") {
    return "https://sitboinvest.ge";
  }
  return url.origin;
}

async function executeActions(token: string, env: TelegramEnv, actions: BotAction[]): Promise<void> {
  for (const action of actions) {
    if (action.type === "answerCallback") {
      await answerCallbackQuery(token, {
        callback_query_id: action.id,
        text: action.text,
      }).catch((err) => console.error("[telegram] answerCallback", err));
      continue;
    }
    if (action.type === "sendMessage") {
      await sendMessage(token, {
        chat_id: action.chatId,
        text: action.text,
        parse_mode: action.parseMode,
        reply_markup: action.replyMarkup,
        disable_web_page_preview: true,
      });
      continue;
    }
    if (action.type === "editMessage") {
      try {
        await editMessageText(token, {
          chat_id: action.chatId,
          message_id: action.messageId,
          text: action.text,
          parse_mode: action.parseMode,
          reply_markup: action.replyMarkup,
          disable_web_page_preview: true,
        });
      } catch (err) {
        console.warn("[telegram] editMessage fallback to send", err);
        await sendMessage(token, {
          chat_id: action.chatId,
          text: action.text,
          parse_mode: action.parseMode,
          reply_markup: action.replyMarkup,
          disable_web_page_preview: true,
        });
      }
      continue;
    }
    if (action.type === "sendPhoto") {
      try {
        await sendPhoto(token, {
          chat_id: action.chatId,
          photo: action.photo,
          caption: action.caption,
          parse_mode: action.parseMode,
          reply_markup: action.replyMarkup,
        });
      } catch (err) {
        console.warn("[telegram] sendPhoto fallback to text", err);
        await sendMessage(token, {
          chat_id: action.chatId,
          text: action.caption,
          parse_mode: action.parseMode,
          reply_markup: action.replyMarkup,
          disable_web_page_preview: false,
        });
      }
      continue;
    }
    if (action.type === "createLead") {
      try {
        const id = await createOdooLead(action.lead, env);
        console.log("[telegram] Odoo lead", id);
      } catch (err) {
        console.error("[telegram] Odoo lead failed", err);
      }
      continue;
    }
    if (action.type === "notifyAdmin") {
      const adminId = Number(env.TELEGRAM_ADMIN_CHAT_ID);
      if (!Number.isFinite(adminId) || adminId === 0) continue;
      await sendMessage(token, {
        chat_id: adminId,
        text: action.text,
        disable_web_page_preview: true,
      }).catch((err) => console.error("[telegram] admin notify", err));
    }
  }
}

telegram.get("/health", (c) =>
  c.json({
    ok: true,
    configured: Boolean(c.env.TELEGRAM_BOT_TOKEN),
  }),
);

telegram.post("/webhook", async (c) => {
  const token = c.env.TELEGRAM_BOT_TOKEN;
  if (!token) return c.json({ error: "Telegram bot is not configured" }, 503);

  const expected = await webhookSecretFromToken(token);
  const header = c.req.header("x-telegram-bot-api-secret-token");
  if (header !== expected) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  let update: TelegramUpdate;
  try {
    update = await c.req.json<TelegramUpdate>();
  } catch {
    return c.json({ error: "Invalid JSON" }, 400);
  }

  try {
    const actions = planUpdate(update);
    await executeActions(token, c.env, actions);
  } catch (err) {
    console.error("[telegram] update failed", err);
  }

  return c.json({ ok: true });
});

telegram.post("/setup", async (c) => {
  const token = c.env.TELEGRAM_BOT_TOKEN;
  if (!token) return c.json({ error: "TELEGRAM_BOT_TOKEN is not set" }, 503);

  const auth = c.req.header("authorization") || "";
  const bearer = auth.toLowerCase().startsWith("bearer ") ? auth.slice(7).trim() : "";
  if (bearer !== token) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const origin = publicOrigin(c.req.raw);
  const webhookUrl = `${origin}/api/telegram/webhook`;
  const secret = await webhookSecretFromToken(token);

  const me = await getMe(token);
  await setMyCommands(token, BOT_COMMANDS_EN);
  await setMyCommands(token, BOT_COMMANDS_RU, "ru");
  await setWebhook(token, {
    url: webhookUrl,
    secret_token: secret,
    allowed_updates: ["message", "callback_query"],
    drop_pending_updates: true,
  });
  const info = await getWebhookInfo(token);

  return c.json({
    ok: true,
    bot: { id: me.id, username: me.username, first_name: me.first_name },
    webhook: info,
  });
});

export default telegram;
