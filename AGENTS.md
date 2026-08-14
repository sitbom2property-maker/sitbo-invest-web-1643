# AGENTS.md

## Cursor Cloud specific instructions

This repo is a single deployable product — **Sitbo Invest**, a React SPA + Hono API bundled into one Cloudflare Worker. There is only one service to run.

### Toolchain
- Package manager is **Bun** (see `bun.lock`). The startup/update script installs it to `~/.bun/bin`. If `bun` is not on `PATH` in a fresh shell, run `export PATH="$HOME/.bun/bin:$PATH"` (the Bun installer also appends this to `~/.bashrc`, so login shells pick it up).

### Running the app (dev)
- `bun dev` is the only process needed. The `@cloudflare/vite-plugin` runs the Hono Worker in the same process as Vite, so there is **no separate backend to start**.
- It serves on the **Vite port `5173`** (e.g. `http://localhost:5173/`). Ignore the `6474` in `website.config.json` — that is only used by the hosted runtime, not the local Vite dev server. Requests to `/api/*` are handled by Hono (`src/api/index.ts`); everything else serves the SPA.
- The startup log line `The latest compatibility date supported ... "2026-03-01", but you've requested "2026-05-06". Falling back...` is harmless.

### Build / typecheck
- `bun run build` runs `tsgo` (typecheck) then `vite build`. Use this to catch type errors.

### Lint (known broken at repo level)
- `bun lint` (`eslint .`) currently **fails** because there is no `eslint.config.js` committed and ESLint v10 requires flat config. This is a pre-existing repo issue, not an environment problem.

### Backend / data notes
- Lead forms `POST /api/leads` into a real **Odoo CRM**. Credentials are hardcoded as fallbacks in `src/api/lib/odoo-crm.ts` (and in `wrangler.json` vars), so submissions succeed and create real CRM leads even with no `.env`. It also degrades gracefully (returns `success` even if Odoo is down).
- Only `/api/ping`, `/api/apartments/piazza`, `/api/leads/health`, and `/api/leads` are mounted. The `auth`, `properties`, and `rates` routers exist in the code but are **not** imported in `src/api/index.ts`, so those endpoints return 404.
- Cloudflare **D1** is not bound in `wrangler.json`, so `bun db:migrate` is not needed to run the marketing site.
- `/api/apartments/piazza` fetches live inventory from an external API (`pro-api.flat.show`) with no fallback; it needs outbound internet to return data.
