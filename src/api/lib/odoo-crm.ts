export type OdooEnv = {
  ODOO_URL?: string;
  ODOO_DB?: string;
  ODOO_LOGIN?: string;
  ODOO_API_KEY?: string;
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

function buildLeadTitle(lead: WebsiteLead): string {
  if (lead.project) return `Website — ${lead.project}`;
  if (lead.source) return `Website — ${lead.source}`;
  return "Website lead";
}

function buildDescription(lead: WebsiteLead): string {
  const lines = [
    lead.budget ? `Budget: ${lead.budget}` : null,
    lead.message ? `Message: ${lead.message}` : null,
    lead.project ? `Project: ${lead.project}` : null,
    lead.source ? `Source: ${lead.source}` : null,
    lead.page ? `Page: ${lead.page}` : null,
    `Submitted: ${new Date().toISOString()}`,
  ].filter(Boolean);
  return lines.join("\n");
}

/** Create a CRM lead in Odoo via JSON-2 API. */
export async function createOdooLead(
  lead: WebsiteLead,
  env: OdooEnv,
): Promise<number> {
  const baseUrl = normalizeBaseUrl(env.ODOO_URL || DEFAULT_ODOO_URL);
  const db = env.ODOO_DB || DEFAULT_ODOO_DB;
  const apiKey = env.ODOO_API_KEY;

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
          type: "lead",
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
