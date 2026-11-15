# Cao Anh Huân — Personal Project Lab

A bilingual React and TypeScript portfolio using Vinext, Vite, Cloudflare Workers, and D1. Includes project case studies, a Three.js sculpture, and an owner-only project editor.

## Local development

Requires Node.js 22.13 or newer. Run commands from this directory.

```powershell
npm ci
npm run db:migrate:local
npm run dev
```

Open the URL printed by the server (normally http://localhost:5173). Local D1 data is separate from the hosted database. Keep `.wrangler/state` to preserve local records. If you previously applied the initial SQL directly, skip the initial migration on that existing database; it already contains the table.

```powershell
npm run typecheck
npm run lint
npm run verify:auth
npm run build
npm start
```

`npm start` previews the built Worker locally. With a local server running, `npm run verify:portfolio` checks public pages and unauthenticated access, and `npm run verify:i18n` checks English and Vietnamese rendering. Admin mutation checks require a valid `PORTFOLIO_TEST_ACCESS_TOKEN` and matching local Access configuration; they create and remove a disposable project.

## Cloudflare deployment

This app deploys to **Cloudflare Workers**, with D1 for project records. It is not a static Pages export.

1. Sign in with `npx wrangler login`.
2. Create a database with `npx wrangler d1 create portfolio`.
3. Copy its real database ID into [wrangler.jsonc](wrangler.jsonc). The checked-in ID is a local-development placeholder.
4. Apply the schema with `npm run db:migrate:remote`.
5. Run `npm run deploy` to build and deploy the Worker.

For Cloudflare Git builds, set the project root to this directory (`showcase`), the build command to `npm run build`, and the deploy command to `npx wrangler deploy --config dist/server/wrangler.json`. Apply remote migrations separately when changing the schema. Keep the lockfile and [drizzle migrations](drizzle/).

## Admin authentication

Create a Cloudflare Access self-hosted application covering both `/admin` (including subpaths) and `/api/admin/*` on the portfolio hostname. Allow only the owner's email from [lib/profile.ts](lib/profile.ts). Public portfolio routes can remain public.

Set these Worker secrets, using values from the Access application:

```powershell
npx wrangler secret put ACCESS_TEAM_DOMAIN
npx wrangler secret put ACCESS_AUD
```

`ACCESS_TEAM_DOMAIN` is the hostname only, such as `your-team.cloudflareaccess.com`. `ACCESS_AUD` is the application's audience tag. For local authenticated checks, put the same settings in an ignored `.dev.vars` file and supply an actual Access JWT to the verification script.

The app verifies the Access JWT signature, issuer, audience, expiry, and owner email. It does not trust the email header alone. Admin pages return 404 and admin APIs return 401 without a valid identity. There is no development sign-in bypass. Without Access settings, administration stays disabled. Protecting both paths with Access provides the browser login flow.

## Project content

Open `/admin` after configuring Access to add, edit, preview, publish, or remove projects. Slugs are permanent, drafts stay private, and revision checks prevent stale edits from overwriting newer content. The reviewed projects are code-backed defaults with D1 overrides; removing a default stores a tombstone.

## Languages

The header switches between English and Tiếng Việt. The `portfolio-language` cookie remembers the selection. Pages render the selected language on the server, including metadata. Switching preserves unsaved editor state. Translations live in [lib/vietnamese.ts](lib/vietnamese.ts); unknown text falls back to the original. Search ignores Vietnamese accents.

## What scripts does

The [scripts folder](scripts/) contains optional maintenance and verification tools. None is required by `dev`, `build`, `start`, or `deploy`.

| Script | Purpose |
| --- | --- |
| `verify-admin-auth.mjs` | Checks owner authorization and JWT verification, including forgery and expiry rejection. |
| `verify-portfolio.mjs` | Checks public routes, denied unauthenticated requests, and optionally admin content operations against a local server. |
| `verify-i18n.mjs` | Checks English/Vietnamese pages, metadata, and language fallback against a local server. |
| `prepare-project-captures.mjs` | Validates original Cryptofolio PNG dimensions and creates the WebP assets served by the app. |
| `prepare-commerce-captures.mjs` | Recreates commerce WebP captures from local sibling project screenshots; its source paths are machine-specific. |

You can remove the entire folder if you do not need these tools; also remove the three `verify:*` entries from [package.json](package.json). The screenshot tools use `sharp`, declared as a development dependency.

Original Cryptofolio PNGs live in [captures/cryptofolio](captures/cryptofolio/), outside the public directory. Keep them to regenerate WebP assets, or delete them if you only need the final assets in [public/projects](public/projects/). Desktop exports are 1920 × 1080, mobile exports 880 × 1912, and commerce exports 1920 × 1400.
