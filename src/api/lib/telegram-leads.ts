import type { WebsiteLead } from "./odoo-crm";

export type TelegramEnv = {
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
};

export type CrmResult = { ok: true; odooId: number | string } | { ok: false; error: string };

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Plain-text-safe HTML message for a website lead. */
export function formatLeadMessage(lead: WebsiteLead, crm: CrmResult): string {
  const rows: [string, string | undefined][] = [
    ["Name", lead.name],
    ["Contact", lead.contact],
    ["Phone", lead.phone],
    ["Email", lead.email],
    ["Project", lead.project],
    ["Budget", lead.budget && lead.budget !== lead.project ? lead.budget : undefined],
    ["Message", lead.message],
    ["Source", lead.source],
    ["Page", lead.page],
  ];
  const lines = rows
    .filter(([, v]) => v && v.trim())
    .map(([k, v]) => `<b>${k}:</b> ${escapeHtml(v!.trim())}`);
  const status = crm.ok
    ? `✅ Saved in Odoo (id ${crm.odooId})`
    : `⚠️ NOT saved in Odoo — ${escapeHtml(crm.error.slice(0, 200))}`;
  return [`🆕 <b>New website lead</b>`, ...lines, "", status].join("\n");
}

/**
 * Sends the lead to a Telegram chat. Never throws: the website form must
 * keep working even if Telegram is down or not configured.
 */
export async function notifyTelegram(
  lead: WebsiteLead,
  crm: CrmResult,
  env: TelegramEnv,
  fetchImpl: typeof fetch = fetch,
): Promise<boolean> {
  const token = env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = env.TELEGRAM_CHAT_ID?.trim();
  if (!token || !chatId) return false;
  try {
    const res = await fetchImpl(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: formatLeadMessage(lead, crm),
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });
    if (!res.ok) {
      console.error("[Telegram] sendMessage failed:", res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("[Telegram] sendMessage error:", err);
    return false;
  }
}
