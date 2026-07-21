import { Hono } from 'hono';
import { cors } from "hono/cors"
import authRouter from "./routes/auth";
import propertiesRouter from "./routes/properties";
import ratesRouter from "./routes/rates";
import {
  appendLeadRow,
  LEADS_NTFY_TOPIC,
  notifyLeadNtfy,
  SHEETS_SHEET_GID,
  SHEETS_SHEET_NAME,
  SHEETS_SPREADSHEET_ID,
  type SheetsEnv,
} from "./lib/google-sheets";

type Bindings = SheetsEnv & {
  DB?: D1Database;
  ADMIN_PASSWORD?: string;
  LEADS_NTFY_TOPIC?: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use(cors({ origin: "*" }));

app.get('/api/ping', (c) => c.json({ message: `Pong! ${Date.now()}` }));

app.route('/api/auth', authRouter);
app.route('/api/properties', propertiesRouter);
app.route('/api/rates', ratesRouter);

// Lead form submission → Google Sheet (gid 1664909573)
app.post('/api/leads', async (c) => {
  try {
    const body = await c.req.json();
    const { name, contact, budget } = body;
    if (!name || !contact) {
      return c.json({ error: 'Name and contact are required' }, 400);
    }

    const ts = new Date().toISOString();
    const row = [ts, String(name), String(contact), budget ? String(budget) : '', 'Website'];
    console.log('[Lead submitted]', { name, contact, budget, ts });

    // Always notify (zero-config) so leads are never silently lost on Cloudflare
    try {
      await notifyLeadNtfy(row, c.env?.LEADS_NTFY_TOPIC || LEADS_NTFY_TOPIC);
      console.log('[ntfy] Lead pushed ✓');
    } catch (err) {
      console.error('[ntfy] Failed:', err);
    }

    try {
      const env: SheetsEnv = {
        SHEETS_WEBHOOK_URL: c.env?.SHEETS_WEBHOOK_URL,
        GOOGLE_SERVICE_ACCOUNT_JSON: c.env?.GOOGLE_SERVICE_ACCOUNT_JSON,
        SHEETS_SPREADSHEET_ID: c.env?.SHEETS_SPREADSHEET_ID || SHEETS_SPREADSHEET_ID,
        SHEETS_SHEET_NAME: c.env?.SHEETS_SHEET_NAME || SHEETS_SHEET_NAME,
        SHEETS_SHEET_GID: c.env?.SHEETS_SHEET_GID || String(SHEETS_SHEET_GID),
      };
      const result = await appendLeadRow(row, env);
      console.log('[Sheets] Row appended ✓ via', result.via);
    } catch (err) {
      console.error('[Sheets] Failed:', err);
      // Don't fail the user-facing request — ntfy may still have delivered
    }

    return c.json({ success: true, message: 'Lead received' });
  } catch {
    return c.json({ error: 'Invalid request' }, 400);
  }
});

export default app;
