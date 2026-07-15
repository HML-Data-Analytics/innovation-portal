# Heineken Innovation Apps Portal

A lightweight portal that shows shortcut tiles (icon + name + link) to Heineken's
innovation apps, styled in Heineken green, with an admin area to add, edit, and
remove shortcuts. Built to embed cleanly inside a SharePoint page and to deploy
straight to Vercel.

## Features

- **Public portal** (`/`) — a responsive grid of app shortcut tiles. Click a
  tile to open the app in a new tab.
- **Admin dashboard** (`/admin`) — password-protected. Add a shortcut with a
  name, URL, and uploaded icon image; edit or delete existing ones.
- **Heineken theme** — green/gold palette defined once in `tailwind.config.ts`
  (`heineken.green`, `heineken.dark`, `heineken.light`, `heineken.red`,
  `heineken.gold`, `heineken.cream`).
- **SharePoint-ready** — sends a `Content-Security-Policy: frame-ancestors`
  header (see `next.config.js`) so the app can be embedded in a SharePoint
  page via the **Embed** web part, instead of being blocked by browsers.
- **Data storage** — app shortcuts are stored in [Vercel KV](https://vercel.com/docs/storage/vercel-kv)
  in production, with an automatic local-JSON-file fallback for development
  when no KV store is configured.
- **Icon uploads** — icons are uploaded to [Vercel Blob](https://vercel.com/docs/storage/vercel-blob)
  storage and served from a public URL.

## Tech stack

- [Next.js 14](https://nextjs.org/) (App Router) + TypeScript
- [Tailwind CSS](https://tailwindcss.com/)
- [@vercel/kv](https://www.npmjs.com/package/@vercel/kv) for app data
- [@vercel/blob](https://www.npmjs.com/package/@vercel/blob) for icon uploads

## Project structure

```
app/
  page.tsx                  Public portal (server component, reads from lib/data)
  layout.tsx                Root layout, fonts, global styles
  globals.css
  admin/
    page.tsx                Admin dashboard (client component)
    login/page.tsx          Admin login form
  api/
    apps/route.ts           GET (public) / POST (admin) app shortcuts
    apps/[id]/route.ts       PUT / DELETE a single app shortcut (admin)
    admin/login/route.ts    Verifies password, sets session cookie
    admin/logout/route.ts   Clears session cookie
    upload/route.ts         Uploads an icon image to Vercel Blob (admin)
components/
  Header.tsx                 Heineken-branded header/banner
  AppCard.tsx                Public shortcut tile
  icons.tsx                  Inline SVG icons
lib/
  data.ts                    App data access (Vercel KV or local JSON fallback)
  auth.ts                    Session cookie signing/verification (Web Crypto)
  types.ts                   Shared TypeScript types
middleware.ts                 Protects /admin/* and mutating /api/* routes
```

## Local development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the env template and set at least `ADMIN_PASSWORD`:

   ```bash
   cp .env.example .env.local
   ```

   Without `KV_REST_API_URL` / `KV_REST_API_TOKEN` set, app data is stored in
   `.data/apps.json` locally (git-ignored) — no external service needed to
   develop. Icon uploads require `BLOB_READ_WRITE_TOKEN` to be set even
   locally (pull it from Vercel once the Blob store is attached — see below).

3. Run the dev server:

   ```bash
   npm run dev
   ```

4. Visit `http://localhost:3000` for the public portal and
   `http://localhost:3000/admin/login` to sign in to the admin dashboard.

## Deploying to Vercel

1. Push this folder to a Git repository (see **Git setup** below) and
   [import it into Vercel](https://vercel.com/new).
2. In the Vercel project, go to **Storage** and:
   - Create/attach a **KV** database — this auto-populates
     `KV_REST_API_URL`, `KV_REST_API_TOKEN`, and
     `KV_REST_API_READ_ONLY_TOKEN` as project env vars.
   - Create/attach a **Blob** store — this auto-populates
     `BLOB_READ_WRITE_TOKEN`.
3. In **Settings → Environment Variables**, add:
   - `ADMIN_PASSWORD` — the password admins use to sign in to `/admin`.
   - `SHAREPOINT_DOMAIN` — your SharePoint tenant origin, e.g.
     `https://yourtenant.sharepoint.com` (used to allow iframe embedding).
4. Deploy. Vercel builds and runs the app automatically (`npm run build` /
   `npm start`), no `vercel.json` needed.

To pull those env vars down for local development instead of setting them by
hand, run `vercel link` once, then `vercel env pull .env.local`.

## Embedding in SharePoint

1. Deploy the app to Vercel and note its URL, e.g.
   `https://innovation-apps-portal.vercel.app`.
2. Set the `SHAREPOINT_DOMAIN` env var to your tenant's origin (e.g.
   `https://yourtenant.sharepoint.com`) and redeploy — this is what allows
   SharePoint to frame the app; without it the browser will block the embed.
3. On your SharePoint page, add the **Embed** web part and paste the Vercel
   URL (or wrap it in an `<iframe src="...">` if using the classic embed
   code option).
4. The public portal (`/`) is what you should embed. Keep `/admin` for
   direct admin use — it's not meant to be embedded.

## Admin usage

1. Go to `/admin/login` and sign in with `ADMIN_PASSWORD`.
2. Fill in **App name**, **App URL**, and choose an icon image (PNG/JPG/SVG,
   under 2MB) to upload.
3. Click **Add app** — it appears immediately on the public portal.
4. Use **Edit**/**Delete** on any row to update or remove a shortcut.
5. **Log out** clears your admin session cookie.

## Notes on the Heineken theme

Colors are approximate brand-inspired values (not official brand assets):
`#00843D` (green), `#00612E` (dark green), `#E4002B` (red), `#FFD100`
(gold), `#F5F5F0` (cream background). Swap these in `tailwind.config.ts` if
your brand team provides exact values. No official Heineken logo artwork is
included — the star icon in the header is a generic placeholder; replace
`components/icons.tsx` / `components/Header.tsx` with approved brand assets
before wider rollout.
