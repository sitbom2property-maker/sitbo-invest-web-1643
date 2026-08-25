/**
 * WhatsApp assistant routing.
 *
 * Every website request is created in Odoo CRM (via `POST /api/leads`) and, in
 * parallel, handed off to WhatsApp: the lead's details are pre-filled into a
 * chat with the destination number so the conversation continues in the
 * messenger. The hand-off is a `wa.me` deep link, so it needs no WhatsApp
 * Business API key.
 */

/** Default business WhatsApp number in E.164 digits (no `+`), matching the site's `wa.me` links. */
export const WHATSAPP_NUMBER = "995555505288";

/** Default opening line used across the main site forms. */
export const DEFAULT_WHATSAPP_INTRO = "Здравствуйте! Оставляю заявку с сайта SITBO.";

/** Amina blogger landing (`/amina`): requests go to her assistant's WhatsApp. */
export const AMINA_WHATSAPP_NUMBER = "995510002722";
export const AMINA_WHATSAPP_INTRO =
  "Здравствуйте! Я пришёл(а) от Амины. Хочу записаться на консультацию / сопровождение.";

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

export type WhatsAppOptions = {
  /** Destination number in E.164 digits (no `+`). Defaults to {@link WHATSAPP_NUMBER}. */
  number?: string;
  /** Opening line of the message. Defaults to {@link DEFAULT_WHATSAPP_INTRO}. */
  intro?: string;
};

/** Russian labels to match the sales team's language and the Odoo lead description. */
const LABELS = {
  name: "Имя",
  contact: "Контакт",
  phone: "Телефон",
  email: "Email",
  budget: "Бюджет",
  project: "Проект",
  message: "Сообщение",
  source: "Форма",
} as const;

export function buildWhatsAppMessage(
  lead: WhatsAppLead,
  intro: string = DEFAULT_WHATSAPP_INTRO,
): string {
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
  return [intro, "", ...lines].join("\n").trim();
}

export function buildWhatsAppLink(
  lead: WhatsAppLead,
  options: WhatsAppOptions = {},
): string {
  const { number = WHATSAPP_NUMBER, intro } = options;
  return `https://wa.me/${number}?text=${encodeURIComponent(buildWhatsAppMessage(lead, intro))}`;
}

/**
 * Opens WhatsApp with the lead pre-filled so the request lands in the destination
 * inbox. Call this synchronously inside a user gesture (e.g. a form submit,
 * before awaiting the CRM request) so the browser does not treat the new tab as
 * a blocked popup. Returns the opened window, or `null` when blocked / on the server.
 */
export function openWhatsApp(
  lead: WhatsAppLead,
  options: WhatsAppOptions = {},
): Window | null {
  if (typeof window === "undefined") return null;
  return window.open(buildWhatsAppLink(lead, options), "_blank", "noopener,noreferrer");
}
