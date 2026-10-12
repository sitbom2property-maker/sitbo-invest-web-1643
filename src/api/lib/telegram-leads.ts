import type { WebsiteLead } from "./odoo-crm";

/**
 * Sitbo lead bot: posts every website lead to a Telegram chat (a group of
 * managers), lets them move it through statuses with inline buttons, reminds
 * about untouched leads and sends a daily summary. State lives in the LEADS KV
 * namespace; without it the bot still posts leads, just without statuses.
 */

export type Attribution = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  gclid?: string;
  fbclid?: string;
  referrer?: string;
  landing?: string;
};

export type BotEnv = {
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
  TELEGRAM_WEBHOOK_SECRET?: string;
  LEADS?: KVNamespace;
};

export type CrmResult = { ok: true; odooId: number | string } | { ok: false; error: string };

export type StatusCode = "new" | "take" | "contact" | "zoom" | "deposit" | "deal" | "lost";

export const STATUSES: Record<StatusCode, { emoji: string; label: string }> = {
  new: { emoji: "🆕", label: "Новая" },
  take: { emoji: "🙋", label: "В работе" },
  contact: { emoji: "📞", label: "Связались" },
  zoom: { emoji: "🎥", label: "Zoom назначен" },
  deposit: { emoji: "💰", label: "Бронь внесена" },
  deal: { emoji: "✅", label: "Сделка" },
  lost: { emoji: "❌", label: "Отказ" },
};

const STATUS_ROWS: StatusCode[][] = [
  ["take", "contact"],
  ["zoom", "deposit"],
  ["deal", "lost"],
];

export type StoredLead = {
  id: string;
  lead: WebsiteLead;
  attribution?: Attribution;
  crm: CrmResult;
  createdAt: number;
  status: StatusCode;
  history: { status: StatusCode; by: string; at: number }[];
  chatId?: string;
  messageId?: number;
  reminders: number;
  /** Manager responsible for the lead (set by the team or the AI agent). */
  assignee?: string;
  /** Comments: replies to the lead card and notes added through the agent. */
  notes?: { text: string; by: string; at: number }[];
};

export const SITE_URL = "https://sitboinvest.ge";
const TTL = 60 * 60 * 24 * 120; // keep leads for 120 days
/** Reminder thresholds after the lead arrived, while it is still "new". */
export const REMINDER_AFTER_MS = [15 * 60_000, 2 * 60 * 60_000];

type Fetch = typeof fetch;

// ───────────────────────── formatting ─────────────────────────

export function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const TZ = "Asia/Tbilisi";

export function tbilisiDate(ts: number): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(ts);
}

export function tbilisiTime(ts: number, withDate = true): string {
  return new Intl.DateTimeFormat("ru-RU", {
    timeZone: TZ,
    ...(withDate ? { day: "2-digit", month: "2-digit" } : {}),
    hour: "2-digit",
    minute: "2-digit",
  }).format(ts);
}

/** WhatsApp / Telegram / email hints extracted from the contact fields. */
export function contactLinks(lead: WebsiteLead): { phoneDigits?: string; telegram?: string; email?: string } {
  const values = [lead.contact, lead.phone, lead.email].filter((v): v is string => !!v && !!v.trim());
  const out: { phoneDigits?: string; telegram?: string; email?: string } = {};
  for (const raw of values) {
    const v = raw.trim();
    const tg = v.match(/^(?:@|https?:\/\/t\.me\/|t\.me\/)([A-Za-z0-9_]{4,32})$/);
    if (tg) out.telegram ??= tg[1];
    else if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) out.email ??= v;
    else if (/^[+\d][\d\s()\-.]{6,}$/.test(v)) {
      const digits = v.replace(/\D/g, "");
      if (digits.length >= 8) out.phoneDigits ??= digits;
    }
  }
  return out;
}

function pageUrl(page?: string): string | undefined {
  if (!page) return undefined;
  if (/^https?:\/\//.test(page)) return page;
  return SITE_URL + (page.startsWith("/") ? page : `/${page}`);
}

function sourceLine(s: StoredLead): string {
  const a = s.attribution ?? {};
  const utm = [a.utm_source, a.utm_medium, a.utm_campaign].filter(Boolean).join(" / ");
  const click = a.gclid ? "Google Ads" : a.fbclid ? "Facebook / Instagram Ads" : "";
  const parts = [s.lead.source, utm || click, !utm && !click && a.referrer ? `с ${a.referrer}` : ""].filter(Boolean);
  return parts.join(" · ");
}

/** Short label used to group leads by channel in summaries. */
export function channelOf(s: StoredLead): string {
  const a = s.attribution ?? {};
  if (a.utm_source) return [a.utm_source, a.utm_medium].filter(Boolean).join(" / ");
  if (a.gclid) return "Google Ads";
  if (a.fbclid) return "Facebook / Instagram Ads";
  if (a.referrer) {
    try {
      return new URL(a.referrer).hostname.replace(/^www\./, "");
    } catch {
      return a.referrer;
    }
  }
  return "Напрямую / без UTM";
}

export function renderLead(s: StoredLead): string {
  const { lead } = s;
  const st = STATUSES[s.status];
  const title = lead.project ? ` · ${escapeHtml(lead.project)}` : "";
  const lines: string[] = [`🔥 <b>Новая заявка</b>${title}`, ""];
  lines.push(`👤 <b>${escapeHtml(lead.name)}</b>`);
  for (const v of [lead.contact, lead.phone, lead.email]) {
    if (v && v.trim()) lines.push(`📱 <code>${escapeHtml(v.trim())}</code>`);
  }
  if (lead.budget && lead.budget !== lead.project) lines.push(`💵 ${escapeHtml(lead.budget)}`);
  if (lead.message && lead.message.trim()) lines.push(`💬 <i>${escapeHtml(lead.message.trim())}</i>`);
  lines.push("");
  const url = pageUrl(lead.page);
  if (url) lines.push(`🌐 ${escapeHtml(url)}`);
  const src = sourceLine(s);
  if (src) lines.push(`📣 ${escapeHtml(src)}`);
  lines.push(`🕐 ${tbilisiTime(s.createdAt)} (Тбилиси)`);
  lines.push(
    s.crm.ok
      ? `🗂 Odoo: ✅ #${escapeHtml(String(s.crm.odooId))}`
      : `🗂 Odoo: ⚠️ не сохранено — заявка только здесь`,
  );
  lines.push("", `📌 <b>Статус: ${st.emoji} ${st.label}</b>`);
  if (s.assignee) lines.push(`🧑‍💼 Ответственный: <b>${escapeHtml(s.assignee)}</b>`);
  for (const h of s.history) {
    const hs = STATUSES[h.status];
    lines.push(`   ${hs.emoji} ${hs.label} — ${escapeHtml(h.by)}, ${tbilisiTime(h.at)}`);
  }
  const notes = s.notes ?? [];
  if (notes.length) {
    lines.push("", `🗒 <b>Комментарии (${notes.length})</b>`);
    for (const n of notes.slice(-3)) {
      const text = n.text.length > 160 ? `${n.text.slice(0, 157)}…` : n.text;
      lines.push(`   ${escapeHtml(text)} — ${escapeHtml(n.by)}, ${tbilisiTime(n.at)}`);
    }
  }
  lines.push(`<i>#${s.id}</i>`);
  return lines.join("\n");
}

type Button = { text: string; url?: string; callback_data?: string };

export function leadKeyboard(s: StoredLead, withStatuses: boolean): { inline_keyboard: Button[][] } {
  const links = contactLinks(s.lead);
  const linkRow: Button[] = [];
  if (links.phoneDigits) linkRow.push({ text: "💬 WhatsApp", url: `https://wa.me/${links.phoneDigits}` });
  if (links.telegram) linkRow.push({ text: "✈️ Telegram", url: `https://t.me/${links.telegram}` });
  const url = pageUrl(s.lead.page);
  if (url) linkRow.push({ text: "🌐 Страница", url });
  const rows: Button[][] = [];
  if (linkRow.length) rows.push(linkRow);
  if (withStatuses) {
    for (const row of STATUS_ROWS) {
      rows.push(
        row.map((code) => ({
          text: `${s.status === code ? "• " : ""}${STATUSES[code].emoji} ${STATUSES[code].label}`,
          callback_data: `s:${s.id}:${code}`,
        })),
      );
    }
  }
  return { inline_keyboard: rows };
}

// ───────────────────────── Telegram API ─────────────────────────

export async function tg(
  env: BotEnv,
  method: string,
  payload: Record<string, unknown>,
  fetchImpl: Fetch = fetch,
): Promise<{ ok: boolean; result?: any; description?: string }> {
  const token = env.TELEGRAM_BOT_TOKEN?.trim();
  if (!token) return { ok: false, description: "no token" };
  try {
    const res = await fetchImpl(`https://api.telegram.org/bot${token}/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await res.json().catch(() => ({ ok: false }))) as { ok: boolean; result?: any; description?: string };
    if (!data.ok) console.error(`[Telegram] ${method} failed:`, res.status, data.description);
    return data;
  } catch (err) {
    console.error(`[Telegram] ${method} error:`, err);
    return { ok: false, description: String(err) };
  }
}

// ───────────────────────── storage ─────────────────────────

const leadKey = (id: string) => `lead:${id}`;
const dayKey = (date: string, id: string) => `day:${date}:${id}`;
const pendingKey = (id: string) => `pending:${id}`;

export async function saveLead(kv: KVNamespace, s: StoredLead): Promise<void> {
  await kv.put(leadKey(s.id), JSON.stringify(s), { expirationTtl: TTL });
}

export async function loadLead(kv: KVNamespace, id: string): Promise<StoredLead | null> {
  const raw = await kv.get(leadKey(id));
  return raw ? (JSON.parse(raw) as StoredLead) : null;
}

export async function listKeys(kv: KVNamespace, prefix: string): Promise<string[]> {
  const names: string[] = [];
  let cursor: string | undefined;
  do {
    const page = await kv.list({ prefix, cursor });
    names.push(...page.keys.map((k) => k.name));
    cursor = page.list_complete ? undefined : page.cursor;
  } while (cursor);
  return names;
}

export async function loadMany(kv: KVNamespace, keys: string[], idFrom: (key: string) => string): Promise<StoredLead[]> {
  const leads = await Promise.all(keys.map((k) => loadLead(kv, idFrom(k))));
  return leads.filter((l): l is StoredLead => !!l).sort((a, b) => a.createdAt - b.createdAt);
}

function newId(): string {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 8);
}

// ───────────────────────── flows ─────────────────────────

/** Store the lead and post it to the managers' chat. Never throws. */
export async function postNewLead(
  lead: WebsiteLead,
  attribution: Attribution | undefined,
  crm: CrmResult,
  env: BotEnv,
  now = Date.now(),
  fetchImpl: Fetch = fetch,
): Promise<boolean> {
  const chatId = env.TELEGRAM_CHAT_ID?.trim();
  if (!env.TELEGRAM_BOT_TOKEN?.trim() || !chatId) return false;
  const s: StoredLead = {
    id: newId(),
    lead,
    attribution,
    crm,
    createdAt: now,
    status: "new",
    history: [],
    chatId,
    reminders: 0,
  };
  try {
    const res = await tg(
      env,
      "sendMessage",
      {
        chat_id: chatId,
        text: renderLead(s),
        parse_mode: "HTML",
        disable_web_page_preview: true,
        reply_markup: leadKeyboard(s, !!env.LEADS),
      },
      fetchImpl,
    );
    if (!res.ok) return false;
    s.messageId = res.result?.message_id;
    if (env.LEADS) {
      await saveLead(env.LEADS, s);
      await env.LEADS.put(dayKey(tbilisiDate(now), s.id), "1", { expirationTtl: TTL });
      await env.LEADS.put(pendingKey(s.id), String(now));
    }
    return true;
  } catch (err) {
    console.error("[LeadBot] postNewLead error:", err);
    return false;
  }
}

export function personName(from: { first_name?: string; last_name?: string; username?: string } | undefined): string {
  if (!from) return "—";
  const name = [from.first_name, from.last_name].filter(Boolean).join(" ");
  return name || (from.username ? `@${from.username}` : "—");
}

async function setStatus(
  env: BotEnv,
  callback: { id: string; data?: string; from?: any; message?: { chat: { id: number }; message_id: number } },
  now: number,
  fetchImpl: Fetch,
): Promise<void> {
  const m = callback.data?.match(/^s:([a-z0-9]+):([a-z]+)$/);
  const kv = env.LEADS;
  if (!m || !kv || !(m[2] in STATUSES)) {
    await tg(env, "answerCallbackQuery", { callback_query_id: callback.id }, fetchImpl);
    return;
  }
  const s = await loadLead(kv, m[1]);
  if (!s) {
    await tg(env, "answerCallbackQuery", { callback_query_id: callback.id, text: "Заявка не найдена (старше 120 дней?)" }, fetchImpl);
    return;
  }
  const code = m[2] as StatusCode;
  if (s.status !== code) {
    s.status = code;
    s.history.push({ status: code, by: personName(callback.from), at: now });
    // Whoever takes the lead becomes responsible for it, unless someone already is.
    if (code === "take" && !s.assignee) s.assignee = personName(callback.from);
    await saveLead(kv, s);
    if (code !== "new") await kv.delete(pendingKey(s.id));
  }
  const chatId = callback.message?.chat.id ?? s.chatId;
  const messageId = callback.message?.message_id ?? s.messageId;
  if (chatId && messageId) {
    await tg(
      env,
      "editMessageText",
      {
        chat_id: chatId,
        message_id: messageId,
        text: renderLead(s),
        parse_mode: "HTML",
        disable_web_page_preview: true,
        reply_markup: leadKeyboard(s, true),
      },
      fetchImpl,
    );
  }
  await tg(
    env,
    "answerCallbackQuery",
    { callback_query_id: callback.id, text: `${STATUSES[code].emoji} ${STATUSES[code].label}` },
    fetchImpl,
  );
}

function statusCounts(leads: StoredLead[]): string {
  const counts = new Map<StatusCode, number>();
  for (const l of leads) counts.set(l.status, (counts.get(l.status) ?? 0) + 1);
  return (Object.keys(STATUSES) as StatusCode[])
    .filter((c) => counts.get(c))
    .map((c) => `${STATUSES[c].emoji} ${counts.get(c)}`)
    .join("  ");
}

function groupLines(leads: StoredLead[], keyOf: (l: StoredLead) => string): string[] {
  const counts = new Map<string, number>();
  for (const l of leads) counts.set(keyOf(l), (counts.get(keyOf(l)) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([k, n]) => `   • ${escapeHtml(k)} — ${n}`);
}

export function renderSummary(title: string, leads: StoredLead[], pending: StoredLead[]): string {
  if (!leads.length) {
    const tail = pending.length ? `\n\n⏳ Без ответа всего: <b>${pending.length}</b> — /pending` : "";
    return `📊 <b>${title}</b>\n\nЗаявок не было.${tail}`;
  }
  const lines = [`📊 <b>${title}</b>`, "", `Заявок: <b>${leads.length}</b>   ${statusCounts(leads)}`, ""];
  lines.push("🏠 <b>Проекты</b>", ...groupLines(leads, (l) => l.lead.project || "Без проекта"), "");
  lines.push("📣 <b>Каналы</b>", ...groupLines(leads, channelOf), "");
  if (pending.length) {
    lines.push(`⏳ <b>Без ответа: ${pending.length}</b>`);
    for (const p of pending.slice(0, 10)) {
      lines.push(`   • ${escapeHtml(p.lead.name)} — ${escapeHtml(p.lead.project || "—")}, ${tbilisiTime(p.createdAt)} #${p.id}`);
    }
    if (pending.length > 10) lines.push(`   … и ещё ${pending.length - 10} — /pending`);
  } else {
    lines.push("✨ Все заявки в работе.");
  }
  return lines.join("\n");
}

export async function pendingLeads(kv: KVNamespace): Promise<StoredLead[]> {
  const leads = await loadMany(kv, await listKeys(kv, "pending:"), (k) => k.slice("pending:".length));
  return leads.filter((l) => l.status === "new");
}

export async function leadsOfDay(kv: KVNamespace, date: string): Promise<StoredLead[]> {
  return loadMany(kv, await listKeys(kv, `day:${date}:`), (k) => k.split(":")[2]);
}

export function formatDay(date: string): string {
  const [y, m, d] = date.split("-");
  return `${d}.${m}.${y}`;
}

const HELP = [
  "🤖 <b>Sitbo Leads</b> — заявки с sitboinvest.ge",
  "",
  "Каждая заявка приходит сюда с кнопками статусов. Нажмите «🙋 В работе», чтобы взять её — остальные увидят, кто взял.",
  "Если заявку никто не взял, бот напомнит через 15 минут и через 2 часа. Каждое утро в 9:00 — сводка за вчера.",
  "",
  "🧠 <b>ИИ-помощник</b>: пишите в чат как обычно (в режиме /chat он сам поймёт, что вопрос к нему), упомяните бота через @ или ответьте на его сообщение — он найдёт и обновит заявку, расскажет про проекты, напишет текст клиенту, поставит напоминание. Ответ (Reply) на карточку заявки без упоминания сохраняется как комментарий.",
  "",
  "/ai вопрос — спросить ИИ-помощника",
  "/chat — ИИ читает весь чат и отвечает без @ · /quiet — только по @",
  "/today — заявки за сегодня",
  "/pending — заявки без ответа",
  "/id — ID этого чата",
].join("\n");

async function handleCommand(
  env: BotEnv,
  message: { chat: { id: number; type?: string; title?: string }; text?: string; message_id: number },
  now: number,
  fetchImpl: Fetch,
): Promise<void> {
  const cmd = (message.text ?? "").trim().split(/\s+/)[0].split("@")[0].toLowerCase();
  const reply = (text: string) =>
    tg(env, "sendMessage", { chat_id: message.chat.id, text, parse_mode: "HTML", disable_web_page_preview: true }, fetchImpl);

  if (cmd === "/id") {
    await reply(`🆔 ID этого чата: <code>${message.chat.id}</code>`);
    return;
  }
  if (cmd === "/start" || cmd === "/help") {
    await reply(HELP);
    return;
  }
  // Lead data is only shown in the configured managers' chat.
  if (String(message.chat.id) !== env.TELEGRAM_CHAT_ID?.trim()) return;
  const kv = env.LEADS;
  if (!kv) return;
  if (cmd === "/today") {
    const date = tbilisiDate(now);
    const leads = await leadsOfDay(kv, date);
    await reply(renderSummary(`Сегодня, ${formatDay(date)}`, leads, leads.filter((l) => l.status === "new")));
  } else if (cmd === "/pending") {
    const pending = await pendingLeads(kv);
    if (!pending.length) {
      await reply("✨ Заявок без ответа нет.");
      return;
    }
    const lines = [`⏳ <b>Без ответа: ${pending.length}</b>`, ""];
    for (const p of pending.slice(0, 30)) {
      lines.push(`• <b>${escapeHtml(p.lead.name)}</b> — ${escapeHtml(p.lead.project || "—")}, ${tbilisiTime(p.createdAt)} #${p.id}`);
    }
    await reply(lines.join("\n"));
  }
}

/** Re-render the lead card in the chat after its data changed. */
export async function refreshLeadCard(env: BotEnv, s: StoredLead, fetchImpl: Fetch = fetch): Promise<void> {
  if (!s.chatId || !s.messageId) return;
  await tg(
    env,
    "editMessageText",
    {
      chat_id: s.chatId,
      message_id: s.messageId,
      text: renderLead(s),
      parse_mode: "HTML",
      disable_web_page_preview: true,
      reply_markup: leadKeyboard(s, true),
    },
    fetchImpl,
  );
}

/** Move a lead to a status on someone's behalf (used by the AI agent). The caller saves it. */
export async function applyStatus(kv: KVNamespace, s: StoredLead, code: StatusCode, by: string, now: number): Promise<void> {
  if (s.status === code) return;
  s.status = code;
  s.history.push({ status: code, by, at: now });
  if (code === "take" && !s.assignee) s.assignee = by;
  if (code !== "new") await kv.delete(pendingKey(s.id));
}

/** Telegram webhook entry point. */
export async function handleUpdate(update: any, env: BotEnv, now = Date.now(), fetchImpl: Fetch = fetch): Promise<void> {
  if (update?.callback_query) {
    await setStatus(env, update.callback_query, now, fetchImpl);
  } else if (update?.message?.text?.startsWith("/")) {
    await handleCommand(env, update.message, now, fetchImpl);
  }
}

/** Cron: nudge the chat about leads nobody has taken yet. */
export async function runReminders(env: BotEnv, now = Date.now(), fetchImpl: Fetch = fetch): Promise<number> {
  const kv = env.LEADS;
  if (!kv || !env.TELEGRAM_BOT_TOKEN) return 0;
  let sent = 0;
  for (const key of await listKeys(kv, "pending:")) {
    const s = await loadLead(kv, key.slice("pending:".length));
    if (!s || s.status !== "new") {
      await kv.delete(key);
      continue;
    }
    const due = REMINDER_AFTER_MS[s.reminders];
    if (due === undefined) {
      await kv.delete(key);
      continue;
    }
    if (now - s.createdAt < due) continue;
    const minutes = Math.round((now - s.createdAt) / 60_000);
    const age = minutes >= 60 ? `${Math.floor(minutes / 60)} ч ${minutes % 60} мин` : `${minutes} мин`;
    await tg(
      env,
      "sendMessage",
      {
        chat_id: s.chatId ?? env.TELEGRAM_CHAT_ID,
        text: `⏰ <b>Заявка ждёт ответа ${age}</b>\n${escapeHtml(s.lead.name)} — ${escapeHtml(s.lead.project || "—")}\nНажмите «🙋 В работе» под заявкой.`,
        parse_mode: "HTML",
        ...(s.messageId ? { reply_parameters: { message_id: s.messageId, allow_sending_without_reply: true } } : {}),
      },
      fetchImpl,
    );
    s.reminders += 1;
    await saveLead(kv, s);
    if (s.reminders >= REMINDER_AFTER_MS.length) await kv.delete(key);
    sent += 1;
  }
  return sent;
}

/** Cron (09:00 Tbilisi): summary of the previous day. */
export async function sendDailySummary(env: BotEnv, now = Date.now(), fetchImpl: Fetch = fetch): Promise<boolean> {
  const kv = env.LEADS;
  const chatId = env.TELEGRAM_CHAT_ID?.trim();
  if (!kv || !chatId) return false;
  const yesterday = tbilisiDate(now - 24 * 60 * 60_000);
  const [leads, pending] = await Promise.all([leadsOfDay(kv, yesterday), pendingLeads(kv)]);
  const res = await tg(
    env,
    "sendMessage",
    { chat_id: chatId, text: renderSummary(`Сводка за ${formatDay(yesterday)}`, leads, pending), parse_mode: "HTML" },
    fetchImpl,
  );
  return res.ok;
}

/** One-off: point Telegram at our webhook and register the command menu. */
export async function setupWebhook(env: BotEnv, origin: string, fetchImpl: Fetch = fetch) {
  const hook = await tg(
    env,
    "setWebhook",
    {
      url: `${origin}/api/telegram/webhook`,
      secret_token: env.TELEGRAM_WEBHOOK_SECRET,
      allowed_updates: ["message", "callback_query"],
      drop_pending_updates: true,
    },
    fetchImpl,
  );
  const commands = await tg(
    env,
    "setMyCommands",
    {
      commands: [
        { command: "ai", description: "Спросить ИИ-помощника" },
        { command: "chat", description: "ИИ отвечает без @" },
        { command: "quiet", description: "ИИ отвечает только по @" },
        { command: "today", description: "Заявки за сегодня" },
        { command: "pending", description: "Заявки без ответа" },
        { command: "id", description: "ID этого чата" },
        { command: "help", description: "Как работает бот" },
      ],
    },
    fetchImpl,
  );
  return { webhook: hook.ok, commands: commands.ok, description: hook.description };
}

export function parseAttribution(value: unknown): Attribution | undefined {
  if (!value || typeof value !== "object") return undefined;
  const out: Attribution = {};
  const keys: (keyof Attribution)[] = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
    "gclid",
    "fbclid",
    "referrer",
    "landing",
  ];
  for (const k of keys) {
    const v = (value as Record<string, unknown>)[k];
    if (typeof v === "string" && v.trim()) out[k] = v.trim().slice(0, 200);
  }
  return Object.keys(out).length ? out : undefined;
}
