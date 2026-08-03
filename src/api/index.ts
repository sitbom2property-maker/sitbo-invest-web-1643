import { Hono } from 'hono';
import { cors } from "hono/cors";
import { createOdooLead, type WebsiteLead } from "./lib/odoo-crm";

type Bindings = {
  ODOO_URL?: string;
  ODOO_DB?: string;
  ODOO_LOGIN?: string;
  ODOO_API_KEY?: string;
  ODOO_USER_ID?: string;
};

const app = new Hono<{ Bindings: Bindings }>().basePath('api');

app.use(cors({ origin: "*" }));

app.get('/ping', (c) => c.json({ message: `Pong! ${Date.now()}` }));

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
app.post('/leads', async (c) => {
  try {
    const body = await c.req.json<Record<string, unknown>>();
    const lead = parseLeadBody(body);
    if (!lead) {
      return c.json({ error: 'Name and contact are required' }, 400);
    }

    console.log('[Lead submitted]', lead);

    try {
      const id = await createOdooLead(lead, c.env);
      console.log('[Odoo CRM] Lead created ✓ id=', id);
    } catch (err) {
      console.error('[Odoo CRM] Failed:', err);
      // Don't fail the user-facing request if CRM is temporarily unavailable
    }

    return c.json({ success: true, message: 'Lead received' });
  } catch {
    return c.json({ error: 'Invalid request' }, 400);
  }
});

export default app;
