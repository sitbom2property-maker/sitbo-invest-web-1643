import { Hono } from 'hono';
import { cors } from "hono/cors"
import authRouter from "./routes/auth";
import propertiesRouter from "./routes/properties";

const app = new Hono();

app.use(cors({ origin: "*" }));

app.get('/api/ping', (c) => c.json({ message: `Pong! ${Date.now()}` }));

app.route('/api/auth', authRouter);
app.route('/api/properties', propertiesRouter);

const SHEETS_WORKER = 'http://localhost:6475';
const SHEETS_SECRET = 'sitbo-sheets-secret';

async function appendToSheets(row: string[]) {
  const res = await fetch(SHEETS_WORKER, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-secret': SHEETS_SECRET },
    body: JSON.stringify({ row }),
  });
  if (!res.ok) throw new Error(`sheets-worker ${res.status}`);
  return res.json();
}

// Lead form submission
app.post('/api/leads', async (c) => {
  try {
    const body = await c.req.json();
    const { name, contact, budget } = body;
    if (!name || !contact) {
      return c.json({ error: 'Name and contact are required' }, 400);
    }

    const ts = new Date().toISOString();
    console.log('[Lead submitted]', { name, contact, budget, ts });

    try {
      await appendToSheets([ts, name, contact, budget || '', 'Website']);
      console.log('[Sheets] Row appended ✓');
    } catch (err) {
      console.error('[Sheets] Failed:', err);
      // Don't fail the user-facing request
    }

    return c.json({ success: true, message: 'Lead received' });
  } catch {
    return c.json({ error: 'Invalid request' }, 400);
  }
});

export default app;
