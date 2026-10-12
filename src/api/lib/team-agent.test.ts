import { describe, expect, test } from "bun:test";
import { handleBotUpdate, mentionsBot, parseTbilisiTime, runAgentReminders, telegramHtml, type AgentEnv } from "./team-agent";
import { loadLead, postNewLead } from "./telegram-leads";

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

const BOT = { id: 999, username: "SitboLeadsBot" };

/** Fake Telegram Bot API + Claude API. `claude` holds the queued Claude responses. */
function fakeApis(claude: unknown[] = []) {
  const telegram: { method: string; body: any }[] = [];
  const anthropic: any[] = [];
  let nextId = 100;
  const fetchImpl = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    const body = JSON.parse(String(init?.body ?? "{}"));
    if (url.startsWith("https://api.anthropic.com/")) {
      anthropic.push(body);
      return new Response(JSON.stringify(claude.shift()), { status: 200 });
    }
    const method = url.split("/").pop()!;
    telegram.push({ method, body });
    const result = method === "getMe" ? { ...BOT, is_bot: true } : { message_id: nextId++ };
    return new Response(JSON.stringify({ ok: true, result }), { status: 200 });
  }) as unknown as typeof fetch;
  return { telegram, anthropic, fetchImpl };
}

const NOW = Date.UTC(2026, 9, 12, 10, 0); // 14:00 Tbilisi

function env(kv: KVNamespace, key = "sk-test"): AgentEnv {
  return { TELEGRAM_BOT_TOKEN: "123:abc", TELEGRAM_CHAT_ID: "-1001", LEADS: kv, ANTHROPIC_API_KEY: key };
}

async function seedLead(kv: KVNamespace) {
  const apis = fakeApis();
  await postNewLead({ name: "Anna", contact: "+995 555 12-34-56", project: "HISNI" }, undefined, { ok: true, odooId: 1 }, env(kv), NOW, apis.fetchImpl);
  const id = [...(kv as any).store.keys()].find((k: string) => k.startsWith("lead:"))!.slice(5);
  return (await loadLead(kv, id))!;
}

const from = { id: 1, first_name: "Nino" };
let updateId = 1;
const message = (text: string, extra: Record<string, unknown> = {}) => ({
  update_id: updateId++,
  message: { message_id: 500 + updateId, chat: { id: -1001, type: "group" }, from, text, ...extra },
});

describe("formatting", () => {
  test("telegramHtml keeps allowed tags, escapes the rest and converts **bold**", () => {
    expect(telegramHtml("<b>Hi</b> <script>x</script> **bold** a & b")).toBe(
      "<b>Hi</b> &lt;script&gt;x&lt;/script&gt; <b>bold</b> a &amp; b",
    );
  });

  test("parseTbilisiTime treats the time as UTC+4", () => {
    expect(parseTbilisiTime("2026-10-15 14:00")).toBe(Date.UTC(2026, 9, 15, 10, 0));
    expect(parseTbilisiTime("завтра")).toBeNull();
  });

  test("mentionsBot recognises @username in entities and text", () => {
    const text = "@sitboleadsbot сколько заявок?";
    expect(mentionsBot({ message_id: 1, chat: { id: 1 }, text, entities: [{ type: "mention", offset: 0, length: 14 }] }, BOT)).toBe(true);
    expect(mentionsBot({ message_id: 1, chat: { id: 1 }, text: "просто текст" }, BOT)).toBe(false);
  });
});

describe("webhook routing", () => {
  test("ignores ordinary group chatter", async () => {
    const kv = fakeKv();
    const apis = fakeApis();
    await handleBotUpdate(message("всем привет"), env(kv), NOW, apis.fetchImpl);
    expect(apis.anthropic.length).toBe(0);
    expect(apis.telegram.filter((c) => c.method === "sendMessage").length).toBe(0);
  });

  test("a plain reply to a lead card is saved as a comment", async () => {
    const kv = fakeKv();
    const s = await seedLead(kv);
    const apis = fakeApis();
    const card = { message_id: s.messageId, chat: { id: -1001 }, from: { ...BOT, is_bot: true }, text: `… #${s.id}` };
    await handleBotUpdate(message("Позвонила, ждёт планировки", { reply_to_message: card }), env(kv), NOW, apis.fetchImpl);
    const stored = (await loadLead(kv, s.id))!;
    expect(stored.notes?.[0]).toEqual({ text: "Позвонила, ждёт планировки", by: "Nino", at: NOW });
    expect(apis.telegram.map((c) => c.method)).toContain("editMessageText");
    expect(apis.telegram.find((c) => c.method === "editMessageText")!.body.text).toContain("Позвонила, ждёт планировки");
    expect(apis.anthropic.length).toBe(0);
  });

  test("without an API key the agent explains it is not connected", async () => {
    const kv = fakeKv();
    const apis = fakeApis();
    await handleBotUpdate(message("@SitboLeadsBot привет"), env(kv, ""), NOW, apis.fetchImpl);
    expect(apis.telegram.find((c) => c.method === "sendMessage")!.body.text).toContain("ANTHROPIC_API_KEY");
  });

  test("handles a retried update only once", async () => {
    const kv = fakeKv();
    const apis = fakeApis([{ content: [{ type: "text", text: "Привет!" }], stop_reason: "end_turn" }]);
    const update = message("@SitboLeadsBot привет");
    await handleBotUpdate(update, env(kv), NOW, apis.fetchImpl);
    await handleBotUpdate(update, env(kv), NOW, apis.fetchImpl);
    expect(apis.anthropic.length).toBe(1);
  });
});

describe("agent", () => {
  test("runs tools: updates the lead, refreshes its card and replies", async () => {
    const kv = fakeKv();
    const s = await seedLead(kv);
    const apis = fakeApis([
      {
        content: [
          { type: "text", text: "Обновляю." },
          { type: "tool_use", id: "t1", name: "update_lead", input: { id: s.id, status: "zoom", assignee: "Гиорги", note: "Zoom в четверг" } },
        ],
        stop_reason: "tool_use",
      },
      { content: [{ type: "text", text: "Готово: **#" + s.id + "** — Zoom, ответственный Гиорги." }], stop_reason: "end_turn" },
    ]);
    await handleBotUpdate(message("@SitboLeadsBot Анну взял Гиорги, Zoom в четверг"), env(kv), NOW, apis.fetchImpl);

    const stored = (await loadLead(kv, s.id))!;
    expect(stored.status).toBe("zoom");
    expect(stored.assignee).toBe("Гиорги");
    expect(stored.notes?.[0].text).toBe("Zoom в четверг");
    expect(stored.history.at(-1)).toEqual({ status: "zoom", by: "Nino", at: NOW });
    expect(kv.store.has(`pending:${s.id}`)).toBe(false);

    const edit = apis.telegram.find((c) => c.method === "editMessageText")!;
    expect(edit.body.text).toContain("Ответственный: <b>Гиорги</b>");
    const reply = apis.telegram.filter((c) => c.method === "sendMessage").at(-1)!;
    expect(reply.body.text).toBe(`Готово: <b>#${s.id}</b> — Zoom, ответственный Гиорги.`);
    expect(reply.body.parse_mode).toBe("HTML");

    // Second Claude call carries the tool result; the question has no @mention left.
    expect(apis.anthropic[0].model).toBe("claude-sonnet-5-5");
    expect(apis.anthropic[0].messages.at(-1).content).toBe("Nino: Анну взял Гиорги, Zoom в четверг");
    const toolResult = apis.anthropic[1].messages.at(-1).content[0];
    expect(toolResult.type).toBe("tool_result");
    expect(JSON.parse(toolResult.content).ok).toBe(true);

    const history = JSON.parse(kv.store.get("agent:hist:-1001")!);
    expect(history.map((m: any) => m.role)).toEqual(["user", "assistant"]);
  });

  test("answers project questions from the site data", async () => {
    const kv = fakeKv();
    const apis = fakeApis([
      { content: [{ type: "tool_use", id: "t1", name: "get_project", input: { slug: "hisni" } }], stop_reason: "tool_use" },
      { content: [{ type: "text", text: "Студии от $67,900." }], stop_reason: "end_turn" },
    ]);
    await handleBotUpdate(message("@SitboLeadsBot сколько стоит студия в HISNI?"), env(kv), NOW, apis.fetchImpl);
    const data = JSON.parse(apis.anthropic[1].messages.at(-1).content[0].content);
    expect(data.name).toContain("HISNI");
    expect(data.url).toBe("https://sitboinvest.ge/project/hisni");
    expect(data.photos).toBeUndefined();
    expect(JSON.stringify(data)).not.toMatch(/\.jpg/);
  });

  test("reminders set by the agent are delivered by the cron", async () => {
    const kv = fakeKv();
    const apis = fakeApis([
      { content: [{ type: "tool_use", id: "t1", name: "set_reminder", input: { at: "2026-10-12 15:00", text: "Перезвонить Анне" } }], stop_reason: "tool_use" },
      { content: [{ type: "text", text: "Напомню в 15:00." }], stop_reason: "end_turn" },
    ]);
    await handleBotUpdate(message("@SitboLeadsBot напомни в 15:00 перезвонить Анне"), env(kv), NOW, apis.fetchImpl);
    expect([...kv.store.keys()].some((k) => k.startsWith("remind:"))).toBe(true);

    const cron = fakeApis();
    expect(await runAgentReminders(env(kv), NOW + 30 * 60_000, cron.fetchImpl)).toBe(0); // 14:30 — not yet
    expect(await runAgentReminders(env(kv), NOW + 61 * 60_000, cron.fetchImpl)).toBe(1); // 15:01
    expect(cron.telegram[0].body.text).toContain("Перезвонить Анне");
    expect([...kv.store.keys()].some((k) => k.startsWith("remind:"))).toBe(false);
  });
});
