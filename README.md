# Excel-Native FP&A Platform

Production-grade scaffold for a web-first FP&A product built with Next.js App Router and Supabase.

## Included

- Marketing site with glassmorphism visual system
- Auth route group and Supabase auth wiring
- Protected app shell for dashboard, workbooks, budgets, and reports
- Typed domain models and mock data for early development
- API route structure for workbooks, cells, imports, and auth callbacks
- Middleware scaffold for session refresh and route protection

## Quick Start

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Required Environment Variables

- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Recommended Next Steps

1. Add Supabase SQL schema and RLS policies.
2. Replace mock dashboard and workbook data with server-side queries.
3. Implement workbook cell persistence, comments, and realtime presence.
4. Add tests and CI once the first live flows are stable.

