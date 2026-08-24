import { projects } from "../../web/data/projects";
import { localizeCityLabel, localizeProject } from "../../web/data/projects-locale";
import type { WebsiteLead } from "./odoo-crm";
import type {
  InlineKeyboardMarkup,
  TelegramCallbackQuery,
  TelegramMessage,
  TelegramReplyMarkup,
  TelegramUpdate,
  TelegramUser,
} from "./telegram";

export const SITE_URL = "https://sitboinvest.ge";
export const WHATSAPP_URL = "https://wa.me/995555505288";
export const EMAIL = "sitboinvest@gmail.com";

export const LEAD_MARKER_RU = "Напишите одним сообщением имя и телефон";
export const LEAD_MARKER_EN = "Send your name and phone number in one message";

export type BotLocale = "ru" | "en";

export type BotAction =
  | {
      type: "sendMessage";
      chatId: number;
      text: string;
      replyMarkup?: TelegramReplyMarkup;
      parseMode?: "HTML";
    }
  | {
      type: "editMessage";
      chatId: number;
      messageId: number;
      text: string;
      replyMarkup?: TelegramReplyMarkup;
      parseMode?: "HTML";
    }
  | {
      type: "sendPhoto";
      chatId: number;
      photo: string;
      caption: string;
      replyMarkup?: TelegramReplyMarkup;
      parseMode?: "HTML";
    }
  | { type: "answerCallback"; id: string; text?: string }
  | { type: "createLead"; lead: WebsiteLead }
  | { type: "notifyAdmin"; text: string };

export function botLocale(languageCode?: string): BotLocale {
  if (!languageCode) return "ru";
  return languageCode.toLowerCase().startsWith("en") ? "en" : "ru";
}

export function displayName(user?: TelegramUser): string {
  if (!user) return "";
  return [user.first_name, user.last_name].filter(Boolean).join(" ").trim();
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function chunk<T>(items: T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += size) rows.push(items.slice(i, i + size));
  return rows;
}

function catalog(locale: BotLocale) {
  return projects.map((p) => localizeProject(p, locale));
}

function projectBySlug(slug: string, locale: BotLocale) {
  const found = projects.find((p) => p.slug === slug);
  return found ? localizeProject(found, locale) : undefined;
}

function mainKeyboard(locale: BotLocale): InlineKeyboardMarkup {
  return {
    inline_keyboard: [
      [
        {
          text: locale === "ru" ? "Проекты" : "Projects",
          callback_data: "projects",
        },
      ],
      [
        {
          text: locale === "ru" ? "Оставить заявку" : "Request a call",
          callback_data: "lead",
        },
      ],
      [
        {
          text: locale === "ru" ? "Почему Грузия" : "Why Georgia",
          callback_data: "why",
        },
        {
          text: locale === "ru" ? "Связаться" : "Contact",
          callback_data: "contact",
        },
      ],
    ],
  };
}

function backKeyboard(locale: BotLocale): InlineKeyboardMarkup {
  return {
    inline_keyboard: [
      [
        {
          text: locale === "ru" ? "← Меню" : "← Menu",
          callback_data: "menu",
        },
      ],
    ],
  };
}

function projectsKeyboard(locale: BotLocale): InlineKeyboardMarkup {
  const buttons = catalog(locale).map((p) => ({
    text: p.name,
    callback_data: `p:${p.slug}`,
  }));
  return {
    inline_keyboard: [
      ...chunk(buttons, 1),
      [
        {
          text: locale === "ru" ? "← Меню" : "← Menu",
          callback_data: "menu",
        },
      ],
    ],
  };
}

function projectKeyboard(slug: string, locale: BotLocale): InlineKeyboardMarkup {
  return {
    inline_keyboard: [
      [
        {
          text: locale === "ru" ? "Заявка по этому проекту" : "Enquire about this project",
          callback_data: `lead:${slug}`,
        },
      ],
      [
        {
          text: locale === "ru" ? "Открыть на сайте" : "Open on the website",
          url: `${SITE_URL}/project/${slug}`,
        },
      ],
      [
        {
          text: locale === "ru" ? "← Все проекты" : "← All projects",
          callback_data: "projects",
        },
        {
          text: locale === "ru" ? "Меню" : "Menu",
          callback_data: "menu",
        },
      ],
    ],
  };
}

export function welcomeText(locale: BotLocale, firstName?: string): string {
  const name = firstName ? `, ${escapeHtml(firstName)}` : "";
  if (locale === "ru") {
    return [
      `<b>Артур Арутюнян</b>${name}.`,
      "Частный консультант по недвижимости в Грузии.",
      "",
      "Я отсеиваю 85% рынка, чтобы вы видели только объекты, которые стоит держать. Честные цифры, юридическая защита, без давления.",
      "",
      "Что хотите сделать?",
    ].join("\n");
  }
  return [
    `<b>Arthur Arutyunyan</b>${name}.`,
    "Private property advisor in Georgia.",
    "",
    "I filter out 85% of the market so you only see properties worth holding. Honest numbers, legal protection, no pressure.",
    "",
    "What would you like to do?",
  ].join("\n");
}

function projectsText(locale: BotLocale): string {
  if (locale === "ru") {
    return "<b>Избранные проекты</b>\nОтобраны лично. Нажмите, чтобы открыть карточку.";
  }
  return "<b>Selected projects</b>\nPersonally curated. Tap a name to open the card.";
}

function whyText(locale: BotLocale): string {
  if (locale === "ru") {
    return [
      "<b>Почему инвесторы выбирают Грузию</b>",
      "",
      "• 0% налог при покупке жилья",
      "• ВНЖ от квалифицирующей инвестиции",
      "• Доходность аренды до 13–16% на первой линии",
      "• Прозрачный земельный реестр",
      "• Рынок открыт для иностранцев — купить можно удалённо",
      "",
      `Подробнее: ${SITE_URL}/invest`,
    ].join("\n");
  }
  return [
    "<b>Why investors choose Georgia</b>",
    "",
    "• 0% tax on residential purchase",
    "• Residency from a qualifying investment",
    "• Rental yields up to 13–16% on the first line",
    "• Transparent land registry",
    "• Open to foreigners — you can buy remotely",
    "",
    `Read more: ${SITE_URL}/invest`,
  ].join("\n");
}

function contactText(locale: BotLocale): string {
  if (locale === "ru") {
    return [
      "<b>Связаться с Артуром</b>",
      "",
      `WhatsApp: ${WHATSAPP_URL}`,
      `Email: ${EMAIL}`,
      `Сайт: ${SITE_URL}`,
      "",
      "Или оставьте заявку в боте — Артур ответит в течение 24 часов.",
    ].join("\n");
  }
  return [
    "<b>Contact Arthur</b>",
    "",
    `WhatsApp: ${WHATSAPP_URL}`,
    `Email: ${EMAIL}`,
    `Website: ${SITE_URL}`,
    "",
    "Or leave a request here — Arthur replies within 24 hours.",
  ].join("\n");
}

function helpText(locale: BotLocale): string {
  if (locale === "ru") {
    return [
      "<b>Команды</b>",
      "/start — главное меню",
      "/projects — избранные проекты",
      "/consult — оставить заявку",
      "/why — почему Грузия",
      "/contact — контакты",
    ].join("\n");
  }
  return [
    "<b>Commands</b>",
    "/start — main menu",
    "/projects — selected projects",
    "/consult — request a call",
    "/why — why Georgia",
    "/contact — contact details",
  ].join("\n");
}

function projectCaption(slug: string, locale: BotLocale): string | null {
  const p = projectBySlug(slug, locale);
  if (!p) return null;
  const city = localizeCityLabel(p.city, locale);
  const desc = p.desc.length > 360 ? `${p.desc.slice(0, 357).trim()}…` : p.desc;
  const features = (p.features || []).slice(0, 4).map((f) => `• ${f}`).join("\n");
  const yieldLabel = locale === "ru" ? "Доходность" : "Yield";
  const doneLabel = locale === "ru" ? "Сдача" : "Handover";
  return [
    `<b>${escapeHtml(p.name)}</b>`,
    `${escapeHtml(city)} · ${escapeHtml(p.tag)}`,
    "",
    `${escapeHtml(p.priceFrom)} · ${yieldLabel} ${escapeHtml(p.yield)}`,
    `${doneLabel}: ${escapeHtml(p.completion)} · ${escapeHtml(p.area)}`,
    p.installment ? escapeHtml(p.installment) : "",
    "",
    escapeHtml(desc),
    features ? `\n${escapeHtml(features)}` : "",
  ]
    .filter((line) => line !== "")
    .join("\n");
}

function leadPrompt(locale: BotLocale, projectName?: string): string {
  if (locale === "ru") {
    const head = projectName
      ? `Заявка по проекту <b>${escapeHtml(projectName)}</b>.`
      : "Оставьте заявку — Артур свяжется лично в течение 24 часов.";
    return [
      head,
      "",
      LEAD_MARKER_RU + ".",
      "Например: Анна +995 555 00 00 00",
      "Можно добавить бюджет.",
    ].join("\n");
  }
  const head = projectName
    ? `Enquiry for <b>${escapeHtml(projectName)}</b>.`
    : "Leave a request — Arthur will come back to you personally within 24 hours.";
  return [
    head,
    "",
    LEAD_MARKER_EN + ".",
    "For example: Anna +995 555 00 00 00",
    "You can add a budget.",
  ].join("\n");
}

export function isLeadPrompt(text?: string): boolean {
  if (!text) return false;
  return text.includes(LEAD_MARKER_RU) || text.includes(LEAD_MARKER_EN);
}

export function projectNameFromLeadPrompt(text: string, locale: BotLocale): string | undefined {
  const ru = text.match(/Заявка по проекту\s+(.+?)\./);
  const en = text.match(/Enquiry for\s+(.+?)\./);
  const raw = (ru?.[1] || en?.[1] || "").replace(/<\/?b>/g, "").trim();
  if (!raw) return undefined;
  const match = catalog(locale).find((p) => p.name === raw);
  return match?.name || raw;
}

const PHONE_RE = /(?:\+|00)?\d[\d\s().-]{6,}\d/;

export type ParsedLead = {
  name: string;
  phone: string;
  budget?: string;
};

export function parseLeadMessage(text: string, fallbackName: string): ParsedLead | null {
  const raw = text.replace(/^\s*\/\S+\s*/, "").trim();
  if (!raw) return null;

  const phoneMatch = raw.match(PHONE_RE);
  let phone: string | undefined;
  let rest = raw;
  if (phoneMatch) {
    const digits = phoneMatch[0].replace(/\D/g, "");
    if (digits.length >= 8) {
      const plus = phoneMatch[0].trim().startsWith("+") || phoneMatch[0].trim().startsWith("00");
      phone = plus ? `+${digits.replace(/^00/, "")}` : digits;
      rest = `${raw.slice(0, phoneMatch.index)} ${raw.slice((phoneMatch.index || 0) + phoneMatch[0].length)}`;
    }
  }

  let budget: string | undefined;
  const budgetMatch = rest.match(/(?:бюджет|budget)\s*[:—-]?\s*(.+)$/i);
  if (budgetMatch) {
    budget = budgetMatch[1].replace(/[.,;]+$/, "").trim();
    rest = rest.slice(0, budgetMatch.index);
  } else {
    const money = rest.match(/[$€]\s?[\d.,\s]+(?:\s*[kкmм]|[тыс]|000)?/i);
    if (money) {
      budget = money[0].replace(/\s+/g, " ").trim();
      rest = `${rest.slice(0, money.index)} ${rest.slice((money.index || 0) + money[0].length)}`;
    }
  }

  const name = rest
    .replace(/[,;|/]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const resolvedName = name || fallbackName.trim();
  if (!resolvedName || !phone) return null;

  return { name: resolvedName, phone, budget };
}

function leadThanks(locale: BotLocale): string {
  if (locale === "ru") {
    return "Заявка получена. Артур свяжется с вами в течение 24 часов.";
  }
  return "Request received. Arthur will contact you within 24 hours.";
}

function leadRetry(locale: BotLocale): string {
  if (locale === "ru") {
    return "Не разобрал контакт. Напишите имя и телефон, например: Анна +995 555 00 00 00";
  }
  return "I could not read a contact. Send a name and phone, for example: Anna +995 555 00 00 00";
}

function unknownText(locale: BotLocale): string {
  if (locale === "ru") {
    return "Напишите /start, чтобы открыть меню, или оставьте заявку через кнопку «Оставить заявку».";
  }
  return "Send /start to open the menu, or tap “Request a call” to leave a request.";
}

function menuPayload(locale: BotLocale, firstName?: string) {
  return {
    text: welcomeText(locale, firstName),
    replyMarkup: mainKeyboard(locale),
    parseMode: "HTML" as const,
  };
}

function deliverText(
  chatId: number,
  messageId: number | undefined,
  text: string,
  replyMarkup: TelegramReplyMarkup,
): BotAction[] {
  if (messageId != null) {
    return [
      {
        type: "editMessage",
        chatId,
        messageId,
        text,
        replyMarkup,
        parseMode: "HTML",
      },
    ];
  }
  return [
    {
      type: "sendMessage",
      chatId,
      text,
      replyMarkup,
      parseMode: "HTML",
    },
  ];
}

function handleCommand(
  chatId: number,
  locale: BotLocale,
  user: TelegramUser | undefined,
  command: string,
  payload: string,
  editMessageId?: number,
): BotAction[] {
  const name = user?.first_name;
  switch (command) {
    case "/start": {
      if (payload) {
        const slug = payload.replace(/^project[_-]?/, "");
        const caption = projectCaption(slug, locale);
        if (caption) {
          const p = projectBySlug(slug, locale)!;
          return [
            {
              type: "sendPhoto",
              chatId,
              photo: `${SITE_URL}${p.cardImage}`,
              caption,
              replyMarkup: projectKeyboard(slug, locale),
              parseMode: "HTML",
            },
          ];
        }
      }
      const menu = menuPayload(locale, name);
      return deliverText(chatId, editMessageId, menu.text, menu.replyMarkup);
    }
    case "/projects":
      return deliverText(
        chatId,
        editMessageId,
        projectsText(locale),
        projectsKeyboard(locale),
      );
    case "/consult":
    case "/lead":
      return [
        {
          type: "sendMessage",
          chatId,
          text: leadPrompt(locale),
          replyMarkup: { force_reply: true, selective: true },
          parseMode: "HTML",
        },
      ];
    case "/why":
      return deliverText(chatId, editMessageId, whyText(locale), backKeyboard(locale));
    case "/contact":
      return deliverText(chatId, editMessageId, contactText(locale), backKeyboard(locale));
    case "/help":
      return deliverText(chatId, editMessageId, helpText(locale), backKeyboard(locale));
    default:
      return [
        {
          type: "sendMessage",
          chatId,
          text: unknownText(locale),
          replyMarkup: mainKeyboard(locale),
          parseMode: "HTML",
        },
      ];
  }
}

function handleCallback(query: TelegramCallbackQuery): BotAction[] {
  const locale = botLocale(query.from.language_code);
  const chatId = query.message?.chat.id;
  const messageId = query.message?.message_id;
  const data = query.data || "";
  if (chatId == null) {
    return [{ type: "answerCallback", id: query.id }];
  }

  const ack: BotAction = { type: "answerCallback", id: query.id };

  if (data === "menu") {
    const menu = menuPayload(locale, query.from.first_name);
    return [ack, ...deliverText(chatId, messageId, menu.text, menu.replyMarkup)];
  }
  if (data === "projects") {
    return [
      ack,
      ...deliverText(chatId, messageId, projectsText(locale), projectsKeyboard(locale)),
    ];
  }
  if (data === "why") {
    return [
      ack,
      ...deliverText(chatId, messageId, whyText(locale), backKeyboard(locale)),
    ];
  }
  if (data === "contact") {
    return [
      ack,
      ...deliverText(chatId, messageId, contactText(locale), backKeyboard(locale)),
    ];
  }
  if (data === "lead" || data.startsWith("lead:")) {
    const slug = data.startsWith("lead:") ? data.slice("lead:".length) : "";
    const project = slug ? projectBySlug(slug, locale) : undefined;
    return [
      ack,
      {
        type: "sendMessage",
        chatId,
        text: leadPrompt(locale, project?.name),
        replyMarkup: { force_reply: true, selective: true },
        parseMode: "HTML",
      },
    ];
  }
  if (data.startsWith("p:")) {
    const slug = data.slice(2);
    const caption = projectCaption(slug, locale);
    const project = projectBySlug(slug, locale);
    if (!caption || !project) {
      return [
        ack,
        {
          type: "sendMessage",
          chatId,
          text: locale === "ru" ? "Проект не найден." : "Project not found.",
          replyMarkup: projectsKeyboard(locale),
          parseMode: "HTML",
        },
      ];
    }
    return [
      ack,
      {
        type: "sendPhoto",
        chatId,
        photo: `${SITE_URL}${project.cardImage}`,
        caption,
        replyMarkup: projectKeyboard(slug, locale),
        parseMode: "HTML",
      },
    ];
  }

  return [ack];
}

function telegramHandle(user?: TelegramUser): string {
  if (user?.username) return `@${user.username}`;
  if (user?.id) return `tg:${user.id}`;
  return "";
}

function handleLeadReply(
  message: TelegramMessage,
  locale: BotLocale,
): BotAction[] {
  const chatId = message.chat.id;
  const parsed = parseLeadMessage(message.text || "", displayName(message.from));
  if (!parsed) {
    return [
      {
        type: "sendMessage",
        chatId,
        text: leadRetry(locale),
        replyMarkup: { force_reply: true, selective: true },
        parseMode: "HTML",
      },
    ];
  }

  const prompt = message.reply_to_message?.text || message.reply_to_message?.caption || "";
  const project = projectNameFromLeadPrompt(prompt, locale);
  const handle = telegramHandle(message.from);
  const phone = parsed.phone;
  const contact = phone || handle || parsed.name;

  const lead: WebsiteLead = {
    name: parsed.name,
    phone,
    contact,
    budget: parsed.budget,
    source: "Telegram bot",
    project,
    page: "telegram",
    message: [
      handle ? `Telegram: ${handle}` : null,
      message.from?.id ? `tg_id: ${message.from.id}` : null,
      parsed.budget ? `Бюджет: ${parsed.budget}` : null,
    ]
      .filter(Boolean)
      .join("\n"),
  };

  const adminLines = [
    "Новая заявка из Telegram-бота",
    `Имя: ${lead.name}`,
    phone ? `Телефон: ${phone}` : null,
    handle ? `Telegram: ${handle}` : null,
    project ? `Проект: ${project}` : null,
    parsed.budget ? `Бюджет: ${parsed.budget}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  return [
    { type: "createLead", lead },
    { type: "notifyAdmin", text: adminLines },
    {
      type: "sendMessage",
      chatId,
      text: leadThanks(locale),
      replyMarkup: mainKeyboard(locale),
      parseMode: "HTML",
    },
  ];
}

export function planUpdate(update: TelegramUpdate): BotAction[] {
  if (update.callback_query) {
    return handleCallback(update.callback_query);
  }

  const message = update.message;
  if (!message?.chat?.id) return [];

  const locale = botLocale(message.from?.language_code);
  const text = (message.text || "").trim();

  if (isLeadPrompt(message.reply_to_message?.text) || isLeadPrompt(message.reply_to_message?.caption)) {
    return handleLeadReply(message, locale);
  }

  if (text.startsWith("/")) {
    const [command, ...rest] = text.split(/\s+/);
    const cmd = (command || "").split("@")[0];
    return handleCommand(message.chat.id, locale, message.from, cmd, rest.join(" ").trim());
  }

  if (!text) return [];

  return [
    {
      type: "sendMessage",
      chatId: message.chat.id,
      text: unknownText(locale),
      replyMarkup: mainKeyboard(locale),
      parseMode: "HTML",
    },
  ];
}

export const BOT_COMMANDS_RU = [
  { command: "start", description: "Главное меню" },
  { command: "projects", description: "Избранные проекты" },
  { command: "consult", description: "Оставить заявку" },
  { command: "why", description: "Почему Грузия" },
  { command: "contact", description: "Контакты" },
  { command: "help", description: "Помощь" },
];

export const BOT_COMMANDS_EN = [
  { command: "start", description: "Main menu" },
  { command: "projects", description: "Selected projects" },
  { command: "consult", description: "Request a call" },
  { command: "why", description: "Why Georgia" },
  { command: "contact", description: "Contact details" },
  { command: "help", description: "Help" },
];
