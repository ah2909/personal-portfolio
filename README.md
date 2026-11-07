# Cao Anh Huân — Personal Project Lab

A responsive editorial portfolio with a lazy-loaded Three.js sculpture, searchable project collection, feature explorers, and database-backed administration.

## Pages

- `/`: introduction, interactive sculpture, project collection, and about section.
- `/projects/cryptofolio`: source-grounded Cryptofolio introduction.
- `/projects/e-commerce`: source-grounded E-Commerce introduction.
- `/projects/:slug`: introduction pages generated from published project content.
- `/admin`: authenticated collection, project editor, and private draft preview.

## Local development

Requires Node.js 22.13 or newer.

```powershell
npm install
npm run build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_worried_spectrum.sql
npm run dev
```

Apply the migration only once to a new local database. The preview URL is printed by the dev server. Local and hosted databases are separate.

The portable starter provides development-only sign-in at `/signin-with-chatgpt?return_to=/admin`. It creates a synthetic local identity and is excluded from production builds. Hosted authentication is handled by Sites.

## Add or update a project

Open `/admin` and choose **Add project**. Enter an introduction, challenge, approach, architecture, technology stack, and at least one feature. Select a palette and display order. Optional HTTPS links can point to a live demo, source repository, and public cover image.

Use **Preview** to inspect a draft. **Save draft** stores it without exposing an introduction route. Enable **Publish project** and choose **Save & publish** to make it appear immediately. Uncheck that option and save to hide a project again. Existing slugs are locked to preserve links. Edits use revision checks to prevent an older tab from silently overwriting a newer save.

The two reviewed projects are code-backed defaults with database overrides. Removing a default stores a tombstone so it stays removed after restart. Deleted slugs remain reserved. The remove action is confirmed in the UI; keeping a project as an unpublished draft is recommended when it may be needed again.

## Access boundary

The initial hosted Site is **owner-private**. That platform boundary restricts both portfolio and admin access to its owner. Independently, the admin page and every admin API operation require the trusted signed-in email to match `caoanhhuan2909@gmail.com`. A different signed-in identity cannot manage content. The application rejects cross-origin mutations, validates bounded content, and only accepts HTTPS external URLs. API responses containing drafts are not cached.

The email allowlist is centralized in `lib/admin-auth.ts` and uses the profile in `lib/profile.ts`. Local mock access is explicitly limited to development builds. Hosted authentication is handled by Sites; do not trust caller-supplied identity headers on a separate hosting platform. Audience changes are separate from content publishing.

Runtime secrets and local state are ignored. No original project environment, deployment, package, or other configuration files were used as project research. See [PROJECT_RESEARCH.md](PROJECT_RESEARCH.md) for source scope and presentation limits.

## Verification

```powershell
npx tsc --noEmit
npm run build
npm audit --omit=dev --audit-level=high
node scripts/verify-portfolio.mjs
node scripts/verify-admin-auth.mjs
```

The integration script only accepts a loopback origin. It exercises authentication, forged-header rejection, cross-origin rejection, unsafe URLs, duplicate slugs, draft creation, persisted reads, publication, stale writes, unpublication, and removal. It removes its disposable project afterward. Set `PORTFOLIO_TEST_ORIGIN` if the preview uses another loopback URL.

## Implementation

The application uses React and TypeScript on the Vinext / Vite Sites starter, D1 with Drizzle for durable project records, Zod for content validation, and self-hosted Manrope / Space Grotesk fonts. Three.js is loaded separately from the main page; offscreen and hidden scenes skip GPU rendering, and reduced motion or the pause control stops animation. A CSS composition remains visible when WebGL is unavailable.

Project previews are original illustrative compositions with sample data, not production screenshots. Real demo and repository URLs are empty until supplied by the owner. New projects can use an HTTPS cover image or the built-in project identity preview.

## Hosting

`.openai/hosting.json` retains the Site ID and `DB` binding. Use the Sites source and deployment workflow to publish updates; it applies hosted schema migrations. Publishing project content through the admin changes D1 records directly and does not require a source deployment.
