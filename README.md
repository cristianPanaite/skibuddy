# SkiBuddy — Poiana Brașov ski instructor directory

A production-ready Next.js 14 project for listing and managing ski instructors in Poiana Brașov and nearby resorts. Instructors can create and update their profile, skiers can filter and contact them, and admins can manage featured/verified badges.

## Tech stack

- **Next.js 14** with the App Router, TypeScript, ESLint, and Prettier
- **Tailwind CSS** with shadcn/ui primitives for design system components
- **Prisma** ORM targeting a Supabase Postgres database
- **Clerk** for authentication (email + social login)
- **Plausible Analytics** with a custom `TAP_WHATSAPP` event

## Features

- Landing page with CTA buttons, benefits, and quick resort filters
- Instructor directory with filters by resort, max price, language, and name search
- Instructor profile pages with verified/featured badges and WhatsApp/Instagram CTAs
- Join page for instructors to create or edit their profile (photo URL, languages, price, resort, bio, socials, tags)
- Admin dashboard to toggle featured/verified flags with instant feedback
- REST API routes for instructors listing, details, profile upsert, and admin toggles
- Seed script with Poiana Brașov + Sinaia resorts and 5 sample instructors

## Getting started

### 1. Clone and install

```bash
npm install
```

### 2. Configure environment variables

Create a `.env.local` file with the following variables:

```env
# Supabase Postgres connection string
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/dbname"

# Clerk authentication keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
CLERK_SECRET_KEY="sk_..."
CLERK_WEBHOOK_SECRET="whsec_..."

# Plausible Analytics
NEXT_PUBLIC_PLAUSIBLE_DOMAIN="your-domain.com"
```

### 3. Prepare the database

Generate the Prisma client and sync the schema:

```bash
npm run db:push
npm run db:seed
```

> The seed script creates two resorts (Poiana Brașov and Sinaia), four tags, demo users, and five sample instructors with varied pricing/languages.

### 4. Run the app locally

```bash
npm run dev
```

Visit http://localhost:3000 to explore the landing page and instructor directory.

### 5. Authentication & roles

- Sign in via Clerk. On first login a `User` record is created automatically.
- Promote your account to admin with:

  ```bash
  npx ts-node --transpile-only scripts/promote-admin.ts <your-clerk-user-id>
  ```

- Admins can access `/admin` to toggle featured/verified flags.

### 6. Deployment

1. Provision a Supabase Postgres database and update `DATABASE_URL` in Vercel.
2. Configure Clerk publishable/secret keys and webhook secret in Vercel.
3. Set `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` if you use Plausible (leave blank to disable).
4. On Vercel, set `npm run db:push && npm run db:seed` as a one-time setup or run locally before deployment.
5. Deploy; Prisma runs in the Edge-compatible Node runtime.

## Available scripts

- `npm run dev` — start the Next.js dev server
- `npm run build` — create a production build
- `npm run start` — run the production server
- `npm run lint` — run ESLint
- `npm run format` / `npm run format:write` — check or apply Prettier formatting
- `npm run db:push` — push the Prisma schema to the database
- `npm run db:seed` — seed demo data via Prisma

## API overview

- `GET /api/instructors` — list instructors with query filters (`resort`, `maxPrice`, `language`, `q`, `page`, `perPage`)
- `GET /api/instructors/[id]` — fetch a single instructor profile
- `POST /api/instructors` — create/update the current user’s instructor profile (Clerk auth required)
- `POST /api/admin/instructors/[id]/toggle` — toggle `featured` or `verified` (admin only)

## Project structure highlights

```
src/
  app/
    (landing + routes, API handlers)
  components/
    ui/ (shadcn-inspired components and feature widgets)
  lib/
    prisma.ts, auth helpers, instructor data access
  types/
    instructor.ts
prisma/
  schema.prisma, seed.ts
scripts/
  promote-admin.ts
```

## Analytics

The root layout wraps the app with `next-plausible`. When the WhatsApp buttons are clicked we emit a `TAP_WHATSAPP` custom event with the instructor ID, enabling funnel tracking in Plausible.

## Notes

- Images are rendered with `next/image` and remote patterns are open for instructor-hosted photos.
- Tailwind design tokens include a brand blue scale used across CTAs and badges.
- All server interactions use typed Prisma helpers and Zod validation to ensure safe inputs.

Happy skiing! ⛷️
