import { Hono } from "hono";
import { cors } from "hono/cors";
import { createOdooLead, type WebsiteLead } from "./lib/odoo-crm";
import { fetchFlatshowApartments, type ApartmentKey } from "./lib/flatshow-apartments";
import { claimAminaPromo, readAminaPromo } from "./lib/amina-promo";

type Bindings = {
  ODOO_URL?: string;
  ODOO_DB?: string;
  ODOO_LOGIN?: string;
  ODOO_API_KEY?: string;
  ODOO_USER_ID?: string;
  AMINA_PROMO?: KVNamespace;
};

const app = new Hono<{ Bindings: Bindings }>().basePath("api");

app.use(cors({ origin: "*" }));

app.get("/ping", (c) =>
  c.json({
    message: `Pong! ${Date.now()}`,
    crm: "odoo",
    version: "odoo-crm-v2",
  }),
);

app.get("/amina-promo", async (c) => {
  const state = await readAminaPromo(c.env);
  c.header("Cache-Control", "no-store");
  return c.json(state);
});

app.post("/amina-promo/claim", async (c) => {
  try {
    const body = await c.req.json<{ clientId?: string }>().catch(() => ({} as { clientId?: string }));
    const clientId = typeof body.clientId === "string" ? body.clientId.trim() : "";
    if (!clientId) {
      return c.json({ error: "clientId required" }, 400);
    }
    const state = await claimAminaPromo(c.env, clientId);
    c.header("Cache-Control", "no-store");
    return c.json(state);
  } catch (err) {
    return c.json({ error: String(err) }, 500);
  }
});

app.get("/apartments/:key", async (c) => {
  const key = c.req.param("key");
  if (key !== "piazza" && key !== "parkline") {
    return c.json({ error: "Unknown project" }, 404);
  }
  try {
    const data = await fetchFlatshowApartments(key as ApartmentKey);
    c.header("Cache-Control", "public, max-age=300");
    return c.json(data);
  } catch (err) {
    return c.json({ error: String(err) }, 502);
  }
});

app.get("/leads/health", async (c) => {
  try {
    const id = await createOdooLead(
      {
        name: "Healthcheck",
        contact: "healthcheck@sitbo.local",
        source: "API healthcheck",
        page: "/api/leads/health",
      },
      c.env,
    );
    return c.json({ ok: true, crm: "odoo", odooId: id });
  } catch (err) {
    return c.json({ ok: false, crm: "odoo", error: String(err) }, 500);
  }
});

function parseLeadBody(body: Record<string, unknown>): WebsiteLead | null {
  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name) return null;

  const contact = typeof body.contact === "string" ? body.contact.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";

  if (!contact && !phone && !email) return null;

  return {
    name,
    contact: contact || undefined,
    phone: phone || undefined,
    email: email || undefined,
    budget: typeof body.budget === "string" ? body.budget : undefined,
    message: typeof body.message === "string" ? body.message : undefined,
    source: typeof body.source === "string" ? body.source : undefined,
    project: typeof body.project === "string" ? body.project : undefined,
    page: typeof body.page === "string" ? body.page : undefined,
  };
}

// Lead form submission → Odoo CRM
app.post("/leads", async (c) => {
  try {
    const body = await c.req.json<Record<string, unknown>>();
    const lead = parseLeadBody(body);
    if (!lead) {
      return c.json({ error: "Name and contact are required" }, 400);
    }

    console.log("[Lead submitted]", lead);

    try {
      const id = await createOdooLead(lead, c.env);
      console.log("[Odoo CRM] Lead created ✓ id=", id);
      return c.json({
        success: true,
        message: "Lead received",
        crm: "odoo",
        odooId: id,
        version: "odoo-crm-v2",
      });
    } catch (err) {
      console.error("[Odoo CRM] Failed:", err);
      return c.json({
        success: true,
        message: "Lead received",
        crm: "failed",
        error: String(err),
        version: "odoo-crm-v2",
      });
    }
  } catch {
    return c.json({ error: "Invalid request" }, 400);
  }
});

export default app;
