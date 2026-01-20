## SiteTrack

Live web analytics dashboard that lets you add websites, drop in one tracking script, and watch visitors, sessions, and live users in real time.

### Tech stack
- Framework: Next.js 16 (App Router) with React 19 and TypeScript; route protection via `clerkMiddleware`.
- Styling/UI: Tailwind CSS v4 (via `@tailwindcss/postcss`), custom CSS variables in `app/globals.css`, shadcn/ui (Radix primitives), Lucide icons, Sonner toasts, Geist + DM Sans fonts.
- Auth & billing: Clerk authentication components and `<PricingTable />`.
- Data & backend: Drizzle ORM with Neon serverless Postgres (`configs/schema.ts`, `drizzle.config.ts`); drizzle-kit for schema tasks; axios on the client; helper CORS wrappers in `lib/cors.ts`.
- Analytics capture: Custom tracking script in `public/analytics.js` sending entry/exit + active time + live pings to API routes; UAParser for device/OS/browser; ip-api/ipapi for geo lookups; recent IPs surfaced via `/api/recentip` and `/api/ipinfo`.
- Visualization & UX: Recharts charts with shadcn chart wrappers, date-fns/date-fns-tz for ranges/timezones, rich UI components (tabs, dialogs, calendars, selects, accordions, drawers, etc.).

### Features
- Add a website, copy an embeddable script snippet, and start collecting analytics immediately.
- Dashboard cards for each site plus detailed hourly/daily charts, visitors/sessions/active time metrics, and live user counts.
- Geo/device/browser widgets with flag and platform icons, plus a recent IP explorer with copy + detail dialog.
- Pricing page powered by Clerk and protected dashboards via Clerk middleware.
- Settings surface the install snippet and allow deleting a site (removes analytics and live user rows).

### Getting started
1) Install deps: `npm install`
2) Create `.env.local` (or `.env`) with at least:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_NEON_DB_CONNECTION_STRING=
NEXT_PUBLIC_HOST_URL=http://localhost:3000
```
3) Run dev server: `npm run dev` (opens http://localhost:3000)
4) Build/lint: `npm run build` -> `npm start`, `npm run lint`

### Analytics snippet
Place this in your site's `<head>`, replacing the placeholders:
```html
<script
  defer
  data-website-id="YOUR_SITE_ID"
  data-domain="yourdomain.com"
  src="http://localhost:3000/analytics.js">
</script>
```
The script persists a visitor/session id in `localStorage`, captures referrer + UTM params, tracks active time/exit URL, and sends 30s live pings to `/api/live`.
