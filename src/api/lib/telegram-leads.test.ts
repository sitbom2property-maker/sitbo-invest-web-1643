import { describe, expect, test } from "bun:test";
import { formatLeadMessage, notifyTelegram } from "./telegram-leads";

const lead = {
  name: "Anna <test>",
  contact: "+995 555 00 00 00",
  project: "HISNI 3rd Tower Pre-Sale",
  budget: "HISNI 3rd Tower Pre-Sale",
  source: "hisni-presale",
  page: "/hisni-presale",
};

describe("formatLeadMessage", () => {
  test("lists lead fields, escapes HTML and skips a budget equal to the project", () => {
    const text = formatLeadMessage(lead, { ok: true, odooId: 42 });
    expect(text).toContain("<b>Name:</b> Anna &lt;test&gt;");
    expect(text).toContain("<b>Project:</b> HISNI 3rd Tower Pre-Sale");
    expect(text).not.toContain("<b>Budget:</b>");
    expect(text).toContain("Saved in Odoo (id 42)");
  });

  test("flags leads that did not reach Odoo", () => {
    const text = formatLeadMessage(lead, { ok: false, error: "Database blocked" });
    expect(text).toContain("NOT saved in Odoo — Database blocked");
  });
});

describe("notifyTelegram", () => {
  test("does nothing without a token or chat id", async () => {
    let called = false;
    const fake = (async () => {
      called = true;
      return new Response("{}");
    }) as unknown as typeof fetch;
    expect(await notifyTelegram(lead, { ok: true, odooId: 1 }, {}, fake)).toBe(false);
    expect(called).toBe(false);
  });

  test("posts the message to the configured chat", async () => {
    let url = "";
    let body: Record<string, unknown> = {};
    const fake = (async (input: RequestInfo | URL, init?: RequestInit) => {
      url = String(input);
      body = JSON.parse(String(init?.body));
      return new Response("{}", { status: 200 });
    }) as unknown as typeof fetch;
    const ok = await notifyTelegram(
      lead,
      { ok: false, error: "x" },
      { TELEGRAM_BOT_TOKEN: "123:abc", TELEGRAM_CHAT_ID: "-100" },
      fake,
    );
    expect(ok).toBe(true);
    expect(url).toBe("https://api.telegram.org/bot123:abc/sendMessage");
    expect(body.chat_id).toBe("-100");
    expect(body.parse_mode).toBe("HTML");
  });

  test("swallows Telegram errors so the form keeps working", async () => {
    const fake = (async () => {
      throw new Error("network down");
    }) as unknown as typeof fetch;
    expect(
      await notifyTelegram(lead, { ok: true, odooId: 1 }, { TELEGRAM_BOT_TOKEN: "t", TELEGRAM_CHAT_ID: "c" }, fake),
    ).toBe(false);
  });
});
