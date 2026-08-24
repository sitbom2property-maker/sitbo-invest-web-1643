# Website

React + Vite + Hono + Tailwind + Cloudflare Workers

## Project Structure

- `src/web/` — React frontend: pages, components, styles, hooks
- `src/api/` — Hono API server (`/api/*`), database schema and migrations
- `public/` — Static assets (favicon, og-image, logo)

## Quick Start

```bash
# Install dependencies
bun install

# Generate types and run migrations
bun cf-typegen
bun db:generate
bun db:migrate

# Start dev server
bun dev
```

## shadcn/ui

Add components you need, customize them however you want.

```bash
bun x shadcn@latest add button card dialog
```

Components land in `src/web/components/ui/`, import with `@/components/ui/button`.

```tsx
import { Button } from "@/components/ui/button"

<Button variant="outline">Click me</Button>
```

## Routing

Client-side routing uses [wouter](https://github.com/molefrog/wouter). Add routes in `src/web/app.tsx`:

```tsx
import { Route, Switch } from "wouter";

<Switch>
  <Route path="/" component={Home} />
  <Route path="/about" component={About} />
</Switch>
```

## Database

Uses [Drizzle ORM](https://orm.drizzle.team/) with Cloudflare D1.

```bash
bun db:generate       # Generate migrations from schema
bun db:migrate        # Apply migrations locally
```

Schema is in `src/api/database/schema.ts`, migrations in `src/api/migrations/`.

## API

Backend uses [Hono](https://hono.dev/) on Cloudflare Workers. All routes are under `/api/*` in `src/api/index.ts`.

```ts
app.get('/api/hello', (c) => c.json({ message: 'Hello' }));
```

## Config

`website.config.json` contains the site name, description, and URL — use it as the source of truth for site-wide values.

## Analytics (Google Analytics 4)

The GA4 tag lives in `src/web/lib/analytics.ts` and is started from `src/web/main.tsx`.

- Measurement ID defaults to the `sitboinvest.ge` stream (`G-BTHRL2KV6K`); override with `VITE_GA_MEASUREMENT_ID` at build time, or set it empty to disable tracking. The same ID is in the official `gtag.js` snippet in `index.html` so Google’s tag checker can see it in the page HTML.
- Localhost is excluded so development traffic never reaches the production property. Append `?ga_debug=1` to any URL to force the tag on and stream events to GA4 DebugView (sticky for the browser tab; `?ga_debug=0` clears it).
- Page views come from GA4 **enhanced measurement**, which already covers SPA navigation via browser history events — keep "Page views" (page loads *and* page changes based on browser history events) enabled in the web data stream, and do not add manual `page_view` calls or they will be counted twice.
- Consent is wired to the cookie banner through [Google Consent Mode v2](https://developers.google.com/tag-platform/security/guides/consent). Everything except `security_storage` starts denied, so pre-consent traffic is measured with cookieless pings; the banner's "Performance" category grants `analytics_storage` and "Targeting" grants the ad signals.

Custom events sent by the app:

| Event | When | Parameters |
| --- | --- | --- |
| `generate_lead` | any lead form submits successfully | `lead_source`, `lead_budget`, `lead_project` |
| `contact_click` | a WhatsApp / Telegram / `tel:` / `mailto:` link is clicked | `contact_method`, `link_url` |

Register those parameters as custom dimensions in GA4 (Admin → Custom definitions) to break the events down by form or contact channel, and mark `generate_lead` as a key event to track it as a conversion.

```ts
import { trackEvent, trackLead } from "@/lib/analytics";

trackLead({ source: "Website popup" });
trackEvent("brochure_download", { project: "Piazza" });
```

## Telegram bot

The Sitbo Telegram bot runs on the same Cloudflare Worker as the site (`/api/telegram/webhook`). It shows curated projects, answers “why Georgia”, and writes consultation requests into Odoo CRM.

1. In Telegram, open [@BotFather](https://t.me/BotFather) → `/newbot` (or `/mybots` if the bot already exists) and copy the token.
2. Add the token as a Worker secret (do not commit it):

```bash
bunx wrangler secret put TELEGRAM_BOT_TOKEN
# optional: your personal Telegram chat id, so new leads are forwarded to you
bunx wrangler secret put TELEGRAM_ADMIN_CHAT_ID
```

3. After deploy, register the webhook (use the same token as the `Authorization` bearer):

```bash
curl -X POST https://sitboinvest.ge/api/telegram/setup \
  -H "Authorization: Bearer $TELEGRAM_BOT_TOKEN"
```

4. Open the bot in Telegram and send `/start`. Deep links work: `https://t.me/<bot>/start?start=piazza-residence`.

Local checks: `bun test src/api`.

## Agent Rules

**CRITICAL: This project uses Tailwind CSS v4.** No `tailwind.config.js`, no `postcss.config.js`, no `@tailwind` directives. All configuration is CSS-first via `@theme` in `src/web/styles.css` and the `@tailwindcss/vite` plugin. Do NOT use Tailwind v3 syntax.

**IMPORTANT: Don't assume how a package works from memory.** Run `bun build` to catch type errors. If anything fails, check the package docs.
