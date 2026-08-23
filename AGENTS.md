# Agent rules

## Stay inside the request

- Do only what the request asks for, and touch only the files that task needs.
- Never change design, layout, typography, colours, spacing or copy unless the request explicitly asks for it.
- Never revert, restore or roll back existing work — including restoring files from `backup/*` or `restore/*` branches — unless the request explicitly asks for that rollback. Rollbacks delete real work: if the request is ambiguous, ask first.
- `src/web/app.tsx` selects the whole site design (`pages/home-v2` vs `pages/index`, `FooterV2` vs `footer`). Do not swap those imports unless the request is specifically about switching the design.
- Keep the diff minimal and list every touched file in the pull request description.

## "The site still shows the old design"

The live site is published by the `Deploy Cloudflare Worker` action, which runs only on push to `main`. Before concluding that code was reverted, check what is actually deployed:

```bash
gh run list --workflow "Deploy Cloudflare Worker" --limit 5   # did the last deploy pass?
curl -s https://sitboinvest.ge/ | rg 'assets/index-'          # bundle that is live
bun run build && ls dist/client/assets                        # bundle main produces
```

If those bundles differ, the live site is a stale deployment. That is a deployment problem and must never be "fixed" by rolling back code.

Deploys need the `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` repository secrets. Without them every run of the workflow fails and nothing merged into `main` reaches sitboinvest.ge.

## Evidence for changes

- Do not record demo videos or screencasts.
- Prove changes with test output, request/response logs and build output. Add a single screenshot only when a visual change genuinely needs one.

## Code

See `README.md` for the stack (Tailwind v4 CSS-first, wouter routing, Hono API, Drizzle/D1) and the Google Analytics setup.
