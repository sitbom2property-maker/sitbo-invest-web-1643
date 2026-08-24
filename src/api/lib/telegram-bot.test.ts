import { describe, expect, test } from "bun:test";
import {
  botLocale,
  isLeadPrompt,
  LEAD_MARKER_RU,
  parseLeadMessage,
  planUpdate,
  projectNameFromLeadPrompt,
  SITE_URL,
  welcomeText,
} from "./telegram-bot";
import type { TelegramUpdate } from "./telegram";

const user = {
  id: 42,
  first_name: "Анна",
  username: "anna",
  language_code: "ru",
};

function messageUpdate(text: string, extra?: Partial<TelegramUpdate["message"]>): TelegramUpdate {
  return {
    update_id: 1,
    message: {
      message_id: 10,
      from: user,
      chat: { id: 99, type: "private" },
      text,
      ...extra,
    },
  };
}

describe("botLocale", () => {
  test("defaults to Russian", () => {
    expect(botLocale(undefined)).toBe("ru");
    expect(botLocale("ru")).toBe("ru");
    expect(botLocale("uk")).toBe("ru");
  });

  test("uses English only for en*", () => {
    expect(botLocale("en")).toBe("en");
    expect(botLocale("en-US")).toBe("en");
  });
});

describe("parseLeadMessage", () => {
  test("reads name, international phone and budget", () => {
    expect(parseLeadMessage("Анна +995 555 00 00 00 бюджет $150k", "X")).toEqual({
      name: "Анна",
      phone: "+995555000000",
      budget: "$150k",
    });
  });

  test("accepts local digits and falls back to Telegram name", () => {
    expect(parseLeadMessage("89991234567", "Анна")).toEqual({
      name: "Анна",
      phone: "89991234567",
      budget: undefined,
    });
  });

  test("rejects empty or too-short replies", () => {
    expect(parseLeadMessage("  ", "Анна")).toBeNull();
    expect(parseLeadMessage("ok", "")).toBeNull();
    expect(parseLeadMessage("Только имя", "Анна")).toBeNull();
  });
});

describe("lead prompt detection", () => {
  test("matches the Russian marker", () => {
    expect(isLeadPrompt(`${LEAD_MARKER_RU}.`)).toBe(true);
    expect(isLeadPrompt("random")).toBe(false);
  });

  test("extracts the project name from the prompt", () => {
    expect(
      projectNameFromLeadPrompt("Заявка по проекту Piazza Residence.\n\nНапишите одним сообщением имя и телефон.", "ru"),
    ).toBe("Piazza Residence");
  });
});

describe("planUpdate", () => {
  test("/start returns a welcome menu", () => {
    const actions = planUpdate(messageUpdate("/start"));
    expect(actions).toHaveLength(1);
    expect(actions[0]).toMatchObject({
      type: "sendMessage",
      chatId: 99,
    });
    if (actions[0].type !== "sendMessage") throw new Error("expected sendMessage");
    expect(actions[0].text).toContain("Артур Арутюнян");
    expect(actions[0].replyMarkup).toEqual(
      expect.objectContaining({
        inline_keyboard: expect.arrayContaining([
          expect.arrayContaining([expect.objectContaining({ callback_data: "projects" })]),
        ]),
      }),
    );
  });

  test("/start with a project slug sends a photo card", () => {
    const actions = planUpdate(messageUpdate("/start piazza-residence"));
    expect(actions[0]).toMatchObject({
      type: "sendPhoto",
      chatId: 99,
    });
    if (actions[0].type !== "sendPhoto") throw new Error("expected sendPhoto");
    expect(actions[0].photo).toBe(`${SITE_URL}/projects/piazza/for-sale/card.jpg`);
    expect(actions[0].caption).toContain("Piazza Residence");
    expect(actions[0].replyMarkup).toEqual(
      expect.objectContaining({
        inline_keyboard: expect.arrayContaining([
          expect.arrayContaining([expect.objectContaining({ callback_data: "lead:piazza-residence" })]),
        ]),
      }),
    );
  });

  test("project callback sends a card", () => {
    const actions = planUpdate({
      update_id: 2,
      callback_query: {
        id: "cb1",
        from: user,
        data: "p:artex-parkline",
        message: { message_id: 11, chat: { id: 99, type: "private" } },
      },
    });
    expect(actions[0]).toEqual({ type: "answerCallback", id: "cb1" });
    expect(actions[1]).toMatchObject({ type: "sendPhoto", chatId: 99 });
    if (actions[1].type !== "sendPhoto") throw new Error("expected sendPhoto");
    expect(actions[1].caption).toContain("Artex Parkline");
  });

  test("every project card caption fits Telegram's 1024-character limit", () => {
    const slugs = [
      "piazza-residence",
      "artex-parkline",
      "krtsanisi-resort-residence",
      "shekvetili-forest-beach",
      "vake-sky-tower",
      "queens-residence",
      "silk-towers",
      "rogantini-swiss-village",
      "ambassadori-island",
      "gonio-yachts-marina",
    ];
    for (const slug of slugs) {
      const actions = planUpdate(messageUpdate(`/start ${slug}`));
      expect(actions[0]?.type).toBe("sendPhoto");
      if (actions[0]?.type !== "sendPhoto") throw new Error(slug);
      expect(actions[0].caption.length).toBeLessThanOrEqual(1024);
    }
  });

  test("unknown project callback stays on the list", () => {
    const actions = planUpdate({
      update_id: 3,
      callback_query: {
        id: "cb2",
        from: user,
        data: "p:does-not-exist",
        message: { message_id: 11, chat: { id: 99, type: "private" } },
      },
    });
    expect(actions[1]).toMatchObject({ type: "sendMessage", chatId: 99 });
    if (actions[1].type !== "sendMessage") throw new Error("expected sendMessage");
    expect(actions[1].text).toContain("не найден");
  });

  test("lead reply creates an Odoo payload and thanks the user", () => {
    const actions = planUpdate(
      messageUpdate("Иван +995555505288 бюджет 200000", {
        reply_to_message: {
          message_id: 8,
          chat: { id: 99, type: "private" },
          text: `Заявка по проекту Piazza Residence.\n\n${LEAD_MARKER_RU}.`,
        },
      }),
    );
    const lead = actions.find((a) => a.type === "createLead");
    expect(lead).toMatchObject({
      type: "createLead",
      lead: {
        name: "Иван",
        phone: "+995555505288",
        source: "Telegram bot",
        project: "Piazza Residence",
        budget: "200000",
      },
    });
    expect(actions.some((a) => a.type === "notifyAdmin")).toBe(true);
    const thanks = actions.find((a) => a.type === "sendMessage");
    expect(thanks).toMatchObject({ type: "sendMessage", chatId: 99 });
    if (thanks?.type !== "sendMessage") throw new Error("expected sendMessage");
    expect(thanks.text).toContain("Заявка получена");
  });

  test("menu callback edits the current message", () => {
    const actions = planUpdate({
      update_id: 4,
      callback_query: {
        id: "cb3",
        from: user,
        data: "menu",
        message: { message_id: 15, chat: { id: 99, type: "private" } },
      },
    });
    expect(actions[1]).toMatchObject({
      type: "editMessage",
      chatId: 99,
      messageId: 15,
    });
  });
});

describe("welcome copy", () => {
  test("English welcome does not use Russian", () => {
    const text = welcomeText("en", "Sam");
    expect(text).toContain("Arthur Arutyunyan");
    expect(text).not.toContain("Артур");
  });
});
