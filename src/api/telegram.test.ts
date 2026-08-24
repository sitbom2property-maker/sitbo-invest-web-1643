import { afterEach, describe, expect, test } from "bun:test";
import app from "./index";
import { webhookSecretFromToken } from "./lib/telegram";

const TOKEN = "123456:TESTTOKEN";

function env(overrides: Record<string, string> = {}) {
  return { TELEGRAM_BOT_TOKEN: TOKEN, ...overrides };
}

afterEach(() => {
  globalThis.fetch = originalFetch;
});

const originalFetch = globalThis.fetch;

describe("telegram webhook", () => {
  test("health reports whether a token is configured", async () => {
    const on = await app.request("https://sitboinvest.ge/api/telegram/health", {}, env());
    expect(on.status).toBe(200);
    expect(await on.json()).toEqual({ ok: true, configured: true });

    const off = await app.request("https://sitboinvest.ge/api/telegram/health", {}, {});
    expect(await off.json()).toEqual({ ok: true, configured: false });
  });

  test("rejects webhook calls without the secret header", async () => {
    const res = await app.request(
      "https://sitboinvest.ge/api/telegram/webhook",
      { method: "POST", body: JSON.stringify({ update_id: 1 }) },
      env(),
    );
    expect(res.status).toBe(401);
  });

  test("accepts a signed /start update and talks to Telegram", async () => {
    const secret = await webhookSecretFromToken(TOKEN);
    const calls: { url: string; body: unknown }[] = [];
    globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      calls.push({ url, body: init?.body ? JSON.parse(String(init.body)) : null });
      return new Response(JSON.stringify({ ok: true, result: { message_id: 1 } }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }) as typeof fetch;

    const res = await app.request(
      "https://sitboinvest.ge/api/telegram/webhook",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-telegram-bot-api-secret-token": secret,
        },
        body: JSON.stringify({
          update_id: 9,
          message: {
            message_id: 1,
            from: { id: 7, first_name: "Sam", language_code: "en" },
            chat: { id: 7, type: "private" },
            text: "/start",
          },
        }),
      },
      env(),
    );

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(calls).toHaveLength(1);
    expect(calls[0].url).toBe(`https://api.telegram.org/bot${TOKEN}/sendMessage`);
    expect(calls[0].body).toEqual(
      expect.objectContaining({
        chat_id: 7,
        parse_mode: "HTML",
      }),
    );
  });

  test("lead reply posts an opportunity to Odoo", async () => {
    const secret = await webhookSecretFromToken(TOKEN);
    const calls: { url: string; body: unknown }[] = [];
    globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      const body = init?.body ? JSON.parse(String(init.body)) : null;
      calls.push({ url, body });
      if (url.includes("odoo.com")) {
        return new Response(JSON.stringify([901]), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ ok: true, result: { message_id: 1 } }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }) as typeof fetch;

    const res = await app.request(
      "https://sitboinvest.ge/api/telegram/webhook",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-telegram-bot-api-secret-token": secret,
        },
        body: JSON.stringify({
          update_id: 11,
          message: {
            message_id: 20,
            from: { id: 7, first_name: "Sam", username: "sam", language_code: "en" },
            chat: { id: 7, type: "private" },
            text: "Sam +995555505288",
            reply_to_message: {
              message_id: 19,
              chat: { id: 7, type: "private" },
              text: "Enquiry for Piazza Residence.\n\nSend your name and phone number in one message.",
            },
          },
        }),
      },
      env(),
    );

    expect(res.status).toBe(200);
    const odoo = calls.find((c) => String(c.url).includes("crm.lead/create"));
    expect(odoo?.body).toEqual(
      expect.objectContaining({
        vals_list: [
          expect.objectContaining({
            name: "Telegram — Piazza Residence",
            contact_name: "Sam",
            phone: "+995555505288",
          }),
        ],
      }),
    );
  });

  test("setup is protected and registers the webhook on sitboinvest.ge", async () => {
    const calls: string[] = [];
    globalThis.fetch = (async (input: RequestInfo | URL) => {
      const url = String(input);
      calls.push(url);
      const method = url.split("/").pop();
      const result =
        method === "getMe"
          ? { id: 1, is_bot: true, first_name: "Sitbo", username: "sitboinvest_bot" }
          : method === "getWebhookInfo"
            ? { url: "https://sitboinvest.ge/api/telegram/webhook", pending_update_count: 0 }
            : true;
      return new Response(JSON.stringify({ ok: true, result }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }) as typeof fetch;

    const denied = await app.request(
      "https://sitboinvest.ge/api/telegram/setup",
      { method: "POST" },
      env(),
    );
    expect(denied.status).toBe(401);

    const res = await app.request(
      "https://sitboinvest.ge/api/telegram/setup",
      {
        method: "POST",
        headers: { authorization: `Bearer ${TOKEN}` },
      },
      env(),
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual(
      expect.objectContaining({
        ok: true,
        bot: expect.objectContaining({ username: "sitboinvest_bot" }),
      }),
    );
    expect(calls.some((url) => url.endsWith("/setWebhook"))).toBe(true);
    expect(calls.some((url) => url.endsWith("/setMyCommands"))).toBe(true);
  });
});
