/**
 * WhatsApp assistant routing.
 *
 * Every website request is created in Odoo CRM (via `POST /api/leads`) and, in
 * parallel, handed off to WhatsApp: the lead's details are pre-filled into a
 * chat with the business number so the conversation continues in the messenger.
 * The hand-off is a `wa.me` deep link, so it needs no WhatsApp Business API key.
 */

/** Business WhatsApp number in E.164 digits (no `+`), matching the site's `wa.me` links. */
export const WHATSAPP_NUMBER = "995555505288";

export type WhatsAppLead = {
  name?: string;
  contact?: string;
  phone?: string;
  email?: string;
  budget?: string;
  message?: string;
  source?: string;
  project?: string;
};

/** Russian labels to match the sales team's language and the Odoo lead description. */
const LABELS = {
  intro: "Здравствуйте! Оставляю заявку с сайта SITBO.",
  name: "Имя",
  contact: "Контакт",
  phone: "Телефон",
  email: "Email",
  budget: "Бюджет",
  project: "Проект",
  message: "Сообщение",
  source: "Форма",
} as const;

export function buildWhatsAppMessage(lead: WhatsAppLead): string {
  const rows: Array<[string, string | undefined]> = [
    [LABELS.name, lead.name],
    [LABELS.contact, lead.contact],
    [LABELS.phone, lead.phone],
    [LABELS.email, lead.email],
    [LABELS.budget, lead.budget],
    [LABELS.project, lead.project],
    [LABELS.message, lead.message],
    [LABELS.source, lead.source],
  ];
  const lines = rows
    .filter(([, value]) => value && value.trim())
    .map(([label, value]) => `${label}: ${value!.trim()}`);
  return [LABELS.intro, "", ...lines].join("\n");
}

export function buildWhatsAppLink(
  lead: WhatsAppLead,
  number: string = WHATSAPP_NUMBER,
): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(buildWhatsAppMessage(lead))}`;
}

/**
 * Opens WhatsApp with the lead pre-filled so the request lands in the business
 * inbox. Call this synchronously inside a user gesture (e.g. a form submit,
 * before awaiting the CRM request) so the browser does not treat the new tab as
 * a blocked popup. Returns the opened window, or `null` when blocked / on the server.
 */
export function openWhatsApp(
  lead: WhatsAppLead,
  number: string = WHATSAPP_NUMBER,
): Window | null {
  if (typeof window === "undefined") return null;
  return window.open(buildWhatsAppLink(lead, number), "_blank", "noopener,noreferrer");
}
