/** Minimal Telegram Bot HTTP API used by the Sitbo webhook. */

export const TELEGRAM_API = "https://api.telegram.org";

export type TelegramUser = {
  id: number;
  is_bot?: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
};

export type TelegramChat = {
  id: number;
  type: string;
  title?: string;
  username?: string;
  first_name?: string;
};

export type TelegramMessage = {
  message_id: number;
  from?: TelegramUser;
  chat: TelegramChat;
  date?: number;
  text?: string;
  caption?: string;
  reply_to_message?: TelegramMessage;
};

export type TelegramCallbackQuery = {
  id: string;
  from: TelegramUser;
  message?: TelegramMessage;
  data?: string;
};

export type TelegramUpdate = {
  update_id: number;
  message?: TelegramMessage;
  edited_message?: TelegramMessage;
  callback_query?: TelegramCallbackQuery;
};

export type InlineKeyboardButton = {
  text: string;
  callback_data?: string;
  url?: string;
};

export type InlineKeyboardMarkup = {
  inline_keyboard: InlineKeyboardButton[][];
};

export type TelegramReplyMarkup =
  | InlineKeyboardMarkup
  | { force_reply: true; selective?: boolean };

async function telegramCall<T>(
  token: string,
  method: string,
  body: Record<string, unknown>,
): Promise<T> {
  const res = await fetch(`${TELEGRAM_API}/bot${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = (await res.json()) as { ok: boolean; result?: T; description?: string };
  if (!res.ok || !json.ok) {
    throw new Error(`telegram ${method}: ${json.description || res.status}`);
  }
  return json.result as T;
}

export function sendMessage(
  token: string,
  payload: {
    chat_id: number;
    text: string;
    parse_mode?: "HTML";
    reply_markup?: TelegramReplyMarkup;
    disable_web_page_preview?: boolean;
  },
) {
  return telegramCall(token, "sendMessage", payload);
}

export function sendPhoto(
  token: string,
  payload: {
    chat_id: number;
    photo: string;
    caption?: string;
    parse_mode?: "HTML";
    reply_markup?: TelegramReplyMarkup;
  },
) {
  return telegramCall(token, "sendPhoto", payload);
}

export function editMessageText(
  token: string,
  payload: {
    chat_id: number;
    message_id: number;
    text: string;
    parse_mode?: "HTML";
    reply_markup?: TelegramReplyMarkup;
    disable_web_page_preview?: boolean;
  },
) {
  return telegramCall(token, "editMessageText", payload);
}

export function answerCallbackQuery(
  token: string,
  payload: { callback_query_id: string; text?: string },
) {
  return telegramCall(token, "answerCallbackQuery", payload);
}

export function setWebhook(
  token: string,
  payload: {
    url: string;
    secret_token: string;
    allowed_updates?: string[];
    drop_pending_updates?: boolean;
  },
) {
  return telegramCall(token, "setWebhook", payload);
}

export function setMyCommands(
  token: string,
  commands: { command: string; description: string }[],
  languageCode?: string,
) {
  return telegramCall(token, "setMyCommands", {
    commands,
    ...(languageCode ? { language_code: languageCode } : {}),
  });
}

export function getWebhookInfo(token: string) {
  return telegramCall<{ url: string; pending_update_count: number; last_error_message?: string }>(
    token,
    "getWebhookInfo",
    {},
  );
}

export function getMe(token: string) {
  return telegramCall<TelegramUser & { username?: string }>(token, "getMe", {});
}

/** Telegram secret_token allows A-Za-z0-9_- (1–256 chars). */
export async function webhookSecretFromToken(botToken: string): Promise<string> {
  const data = new TextEncoder().encode(`sitbo-telegram-webhook:${botToken}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  const hex = [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `sitbo_${hex.slice(0, 40)}`;
}
