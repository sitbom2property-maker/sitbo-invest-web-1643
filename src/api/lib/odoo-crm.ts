export type OdooEnv = {
  ODOO_URL?: string;
  ODOO_DB?: string;
  ODOO_LOGIN?: string;
  ODOO_API_KEY?: string;
  ODOO_USER_ID?: string;
  ODOO_TEAM_ID?: string;
  ODOO_STAGE_ID?: string;
  ODOO_SOURCE_ID?: string;
  ODOO_MEDIUM_ID?: string;
  ODOO_TAG_IDS?: string;
};

export type WebsiteLead = {
  name: string;
  contact?: string;
  phone?: string;
  email?: string;
  budget?: string;
  message?: string;
  source?: string;
  project?: string;
  page?: string;
};

const DEFAULT_ODOO_URL = "https://sitboinvest.odoo.com";
const DEFAULT_ODOO_DB = "sitboinvest";
/** Fallback until Cloudflare secret ODOO_API_KEY is set. Rotate after moving to secrets. */
const DEFAULT_ODOO_API_KEY = "a5885446b10319f45065c0c8d5bc8bf7a0fa6095";
/** Salesperson: Артур Арутюнян */
const DEFAULT_ODOO_USER_ID = 2;
/** Team: SITBO Sales */
const DEFAULT_ODOO_TEAM_ID = 1;
/** Stage: Новый */
const DEFAULT_ODOO_STAGE_ID = 1;
/** UTM source: Website Sitbo */
const DEFAULT_ODOO_SOURCE_ID = 16;
/** UTM medium: Website form */
const DEFAULT_ODOO_MEDIUM_ID = 7;
/** Tags: Website */
const DEFAULT_ODOO_TAG_IDS = [1];

function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, "");
}

function looksLikeEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function splitContact(contact?: string): { email?: string; phone?: string } {
  if (!contact?.trim()) return {};
  const value = contact.trim();
  if (looksLikeEmail(value)) return { email: value };
  return { phone: value };
}

function parseIdList(value: string | undefined, fallback: number[]): number[] {
  if (!value?.trim()) return fallback;
  return value
    .split(",")
    .map((part) => Number(part.trim()))
    .filter((n) => Number.isFinite(n) && n > 0);
}

function buildLeadTitle(lead: WebsiteLead): string {
  if (lead.project) return `Сайт — ${lead.project}`;
  if (lead.source) return `Сайт — ${lead.source}`;
  return "Сайт — заявка";
}

function buildDescription(lead: WebsiteLead): string {
  const lines = [
    lead.budget ? `Бюджет: ${lead.budget}` : null,
    lead.message ? `Сообщение: ${lead.message}` : null,
    lead.project ? `Проект: ${lead.project}` : null,
    lead.source ? `Источник формы: ${lead.source}` : null,
    lead.page ? `Страница: ${lead.page}` : null,
    `Отправлено: ${new Date().toISOString()}`,
  ].filter(Boolean);
  return lines.join("\n");
}

/** Create a CRM opportunity in Odoo (shows in Pipeline / Воронка). */
export async function createOdooLead(
  lead: WebsiteLead,
  env: OdooEnv,
): Promise<number> {
  const baseUrl = normalizeBaseUrl(env.ODOO_URL || DEFAULT_ODOO_URL);
  const db = env.ODOO_DB || DEFAULT_ODOO_DB;
  const apiKey = env.ODOO_API_KEY || DEFAULT_ODOO_API_KEY;
  const userId = Number(env.ODOO_USER_ID || DEFAULT_ODOO_USER_ID) || DEFAULT_ODOO_USER_ID;
  const teamId = Number(env.ODOO_TEAM_ID || DEFAULT_ODOO_TEAM_ID) || DEFAULT_ODOO_TEAM_ID;
  const stageId = Number(env.ODOO_STAGE_ID || DEFAULT_ODOO_STAGE_ID) || DEFAULT_ODOO_STAGE_ID;
  const sourceId = Number(env.ODOO_SOURCE_ID || DEFAULT_ODOO_SOURCE_ID) || DEFAULT_ODOO_SOURCE_ID;
  const mediumId = Number(env.ODOO_MEDIUM_ID || DEFAULT_ODOO_MEDIUM_ID) || DEFAULT_ODOO_MEDIUM_ID;
  const tagIds = parseIdList(env.ODOO_TAG_IDS, DEFAULT_ODOO_TAG_IDS);

  if (!apiKey) throw new Error("ODOO_API_KEY not configured");

  const fromContact = splitContact(lead.contact);
  const email = lead.email?.trim() || fromContact.email;
  const phone = lead.phone?.trim() || fromContact.phone;

  const res = await fetch(`${baseUrl}/json/2/crm.lead/create`, {
    method: "POST",
    headers: {
      Authorization: `bearer ${apiKey}`,
      "X-Odoo-Database": db,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      vals_list: [
        {
          name: buildLeadTitle(lead),
          contact_name: lead.name.trim(),
          email_from: email || false,
          phone: phone || false,
          description: buildDescription(lead),
          type: "opportunity",
          user_id: userId,
          team_id: teamId,
          stage_id: stageId,
          source_id: sourceId,
          medium_id: mediumId,
          tag_ids: [[6, 0, tagIds]],
        },
      ],
    }),
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`odoo-crm ${res.status}: ${text}`);
  }

  const ids = JSON.parse(text) as number[];
  const id = ids[0];
  if (!id) throw new Error("odoo-crm: empty lead id");
  return id;
}
