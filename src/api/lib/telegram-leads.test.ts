import { describe, expect, test } from "bun:test";
import {
  REMINDER_AFTER_MS,
  channelOf,
  contactLinks,
  handleUpdate,
  leadKeyboard,
  loadLead,
  parseAttribution,
  postNewLead,
  renderLead,
  renderSummary,
  runReminders,
  sendDailySummary,
  type BotEnv,
  type StoredLead,
} from "./telegram-leads";

/** In-memory stand-in for a Workers KV namespace. */
function fakeKv() {
  const store = new Map<string, string>();
  const kv = {
    store,
    async get(key: string) {
      return store.get(key) ?? null;
    },
    async put(key: string, value: string) {
      store.set(key, value);
    },
    async delete(key: string) {
      store.delete(key);
    },
    async list({ prefix = "" }: { prefix?: string; cursor?: string } = {}) {
      const keys = [...store.keys()].filter((k) => k.startsWith(prefix)).map((name) => ({ name }));
      return { keys, list_complete: true, cursor: "" };
    },
  };
  return kv as unknown as KVNamespace & { store: Map<string, string> };
}

/** Records Telegram API calls and answers like the Bot API. */
function fakeTelegram() {
  const calls: { method: string; body: any }[] = [];
  let nextId = 100;
  const fetchImpl = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const method = String(input).split("/").pop()!;
    const body = JSON.parse(String(init?.body ?? "{}"));
    calls.push({ method, body });
    return new Response(JSON.stringify({ ok: true, result: { message_id: nextId++ } }), { status: 200 });
  }) as unknown as typeof fetch;
  return { calls, fetchImpl };
}

const lead = {
  name: "Anna <VIP>",
  contact: "+995 555 12-34-56",
  project: "HISNI 3rd Tower Pre-Sale",
  budget: "HISNI 3rd Tower Pre-Sale",
  message: "Interested in a studio",
  source: "hisni-presale",
  page: "/hisni-presale",
};

const NOW = Date.UTC(2026, 9, 12, 10, 0); // 14:00 Tbilisi

function env(kv?: KVNamespace): BotEnv {
  return { TELEGRAM_BOT_TOKEN: "123:abc", TELEGRAM_CHAT_ID: "-1001", LEADS: kv };
}

describe("formatting", () => {
  test("contactLinks recognises phone, Telegram handle and email", () => {
    expect(contactLinks({ name: "a", contact: "+995 555 12-34-56" })).toEqual({ phoneDigits: "995555123456" });
    expect(contactLinks({ name: "a", contact: "@anna_test" })).toEqual({ telegram: "anna_test" });
    expect(contactLinks({ name: "a", contact: "a@b.ge" })).toEqual({ email: "a@b.ge" });
    expect(contactLinks({ name: "a", contact: "call me" })).toEqual({});
  });

  test("renderLead escapes HTML, uses a full page URL and shows the status", () => {
    const s: StoredLead = {
      id: "abc12345",
      lead,
      attribution: { utm_source: "google", utm_medium: "cpc", utm_campaign: "hisni" },
      crm: { ok: false, error: "blocked" },
      createdAt: NOW,
      status: "new",
      history: [],
      reminders: 0,
    };
    const text = renderLead(s);
    expect(text).toContain("<b>Anna &lt;VIP&gt;</b>");
    expect(text).toContain("https://sitboinvest.ge/hisni-presale");
    expect(text).toContain("google / cpc / hisni");
    expect(text).toContain("14:00");
    expect(text).toContain("Odoo: ⚠️");
    expect(text).toContain("Статус: 🆕 Новая");
    expect(text).not.toContain("💵"); // budget equal to project is not repeated
  });

  test("keyboard has WhatsApp + page links and status buttons", () => {
    const s = { id: "x1", lead, crm: { ok: true, odooId: 1 }, createdAt: NOW, status: "take", history: [], reminders: 0 } as StoredLead;
    const kb = leadKeyboard(s, true).inline_keyboard;
    expect(kb[0][0]).toEqual({ text: "💬 WhatsApp", url: "https://wa.me/995555123456" });
    expect(kb[0][1].url).toBe("https://sitboinvest.ge/hisni-presale");
    expect(kb[1][0]).toEqual({ text: "• 🙋 В работе", callback_data: "s:x1:take" });
    expect(kb.flat().every((b) => !b.callback_data || b.callback_data.length <= 64)).toBe(true);
  });

  test("channelOf groups by UTM, ad click or referrer", () => {
    const base = { id: "1", lead, crm: { ok: true, odooId: 1 }, createdAt: NOW, status: "new", history: [], reminders: 0 } as StoredLead;
    expect(channelOf({ ...base, attribution: { utm_source: "facebook", utm_medium: "paid" } })).toBe("facebook / paid");
    expect(channelOf({ ...base, attribution: { gclid: "x" } })).toBe("Google Ads");
    expect(channelOf({ ...base, attribution: { referrer: "https://www.google.com/" } })).toBe("google.com");
    expect(channelOf(base)).toBe("Напрямую / без UTM");
  });

  test("parseAttribution keeps only known string fields", () => {
    expect(parseAttribution({ utm_source: " ig ", evil: "x", gclid: 5 })).toEqual({ utm_source: "ig" });
    expect(parseAttribution("nope")).toBeUndefined();
  });

  test("renderSummary handles an empty day", () => {
    expect(renderSummary("Сводка", [], [])).toContain("Заявок не было");
  });
});

describe("lead flow", () => {
  test("does nothing without a token or chat id", async () => {
    const { calls, fetchImpl } = fakeTelegram();
    expect(await postNewLead(lead, undefined, { ok: true, odooId: 1 }, {}, NOW, fetchImpl)).toBe(false);
    expect(calls.length).toBe(0);
  });

  test("posts the lead, stores it, and a status button updates it", async () => {
    const kv = fakeKv();
    const tg = fakeTelegram();
    expect(await postNewLead(lead, { utm_source: "google" }, { ok: false, error: "x" }, env(kv), NOW, tg.fetchImpl)).toBe(true);

    const sent = tg.calls[0];
    expect(sent.method).toBe("sendMessage");
    expect(sent.body.chat_id).toBe("-1001");
    expect(sent.body.parse_mode).toBe("HTML");

    const leadKeyName = [...kv.store.keys()].find((k) => k.startsWith("lead:"))!;
    const id = leadKeyName.slice(5);
    expect(kv.store.has(`pending:${id}`)).toBe(true);
    expect(kv.store.has(`day:2026-10-12:${id}`)).toBe(true);

    await handleUpdate(
      {
        callback_query: {
          id: "cb1",
          data: `s:${id}:take`,
          from: { first_name: "Nino" },
          message: { chat: { id: -1001 }, message_id: 100 },
        },
      },
      env(kv),
      NOW + 60_000,
      tg.fetchImpl,
    );
    const stored = (await loadLead(kv, id))!;
    expect(stored.status).toBe("take");
    expect(stored.history[0].by).toBe("Nino");
    expect(kv.store.has(`pending:${id}`)).toBe(false);
    const edit = tg.calls.find((c) => c.method === "editMessageText")!;
    expect(edit.body.text).toContain("🙋 В работе — Nino");
    expect(tg.calls.at(-1)!.method).toBe("answerCallbackQuery");
  });

  test("reminds about untouched leads at 15 min and 2 h, then stops", async () => {
    const kv = fakeKv();
    const tg = fakeTelegram();
    await postNewLead(lead, undefined, { ok: true, odooId: 7 }, env(kv), NOW, tg.fetchImpl);
    const e = env(kv);

    expect(await runReminders(e, NOW + 5 * 60_000, tg.fetchImpl)).toBe(0);
    expect(await runReminders(e, NOW + REMINDER_AFTER_MS[0], tg.fetchImpl)).toBe(1);
    expect(await runReminders(e, NOW + REMINDER_AFTER_MS[0] + 60_000, tg.fetchImpl)).toBe(0);
    expect(await runReminders(e, NOW + REMINDER_AFTER_MS[1], tg.fetchImpl)).toBe(1);
    expect(await runReminders(e, NOW + REMINDER_AFTER_MS[1] * 3, tg.fetchImpl)).toBe(0);

    const reminder = tg.calls.find((c) => c.body.text?.startsWith("⏰"))!;
    expect(reminder.body.reply_parameters.message_id).toBe(100);
    expect([...kv.store.keys()].some((k) => k.startsWith("pending:"))).toBe(false);
  });

  test("daily summary covers yesterday's leads", async () => {
    const kv = fakeKv();
    const tg = fakeTelegram();
    await postNewLead(lead, { utm_source: "google", utm_medium: "cpc" }, { ok: true, odooId: 1 }, env(kv), NOW, tg.fetchImpl);
    const nextMorning = Date.UTC(2026, 9, 13, 5, 0); // 09:00 Tbilisi next day
    expect(await sendDailySummary(env(kv), nextMorning, tg.fetchImpl)).toBe(true);
    const text = tg.calls.at(-1)!.body.text as string;
    expect(text).toContain("Сводка за 12.10.2026");
    expect(text).toContain("Заявок: <b>1</b>");
    expect(text).toContain("google / cpc — 1");
    expect(text).toContain("Без ответа: 1");
  });

  test("/id answers anywhere; lead commands only in the managers' chat", async () => {
    const kv = fakeKv();
    const tg = fakeTelegram();
    await handleUpdate({ message: { chat: { id: 555 }, text: "/id@SitboLeadsBot", message_id: 1 } }, env(kv), NOW, tg.fetchImpl);
    expect(tg.calls[0].body.text).toContain("<code>555</code>");
    await handleUpdate({ message: { chat: { id: 555 }, text: "/pending", message_id: 2 } }, env(kv), NOW, tg.fetchImpl);
    expect(tg.calls.length).toBe(1);
    await handleUpdate({ message: { chat: { id: -1001 }, text: "/pending", message_id: 3 } }, env(kv), NOW, tg.fetchImpl);
    expect(tg.calls.at(-1)!.body.text).toContain("Заявок без ответа нет");
  });
});
