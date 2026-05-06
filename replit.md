# VentureForge

A full-stack marketplace for business ideas and early-stage venture development — think Product Hunt meets LinkedIn meets startup incubator.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080, proxied to /api)
- `pnpm --filter @workspace/venture-forge run dev` — run the frontend (Vite, dynamic port)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` (Postgres), `SESSION_SECRET` (express-session)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Wouter (routing), TanStack Query, shadcn/ui, Tailwind, Framer Motion
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec → React Query hooks + Zod schemas)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — source of truth for all API contracts (~30 endpoints)
- `lib/api-client-react/src/generated/api.ts` — generated React Query hooks (do not edit)
- `lib/api-zod/src/generated/api.ts` — generated Zod schemas (do not edit)
- `lib/db/src/schema/index.ts` — exports all 8 DB tables
- `artifacts/api-server/src/routes/` — route handlers (auth, ideas, votes, comments, contributions, users, stats, admin)
- `artifacts/venture-forge/src/pages/` — all frontend pages

## Architecture decisions

- Contract-first API: OpenAPI spec → Orval codegen → typed hooks used throughout the frontend; never write fetch calls manually
- Sessions over JWT: express-session with SHA-256 password hashing (lightweight for MVP; static salt `vf_salt_2025`)
- Shared proxy routing: all services route through a single reverse proxy; frontend uses relative URLs, API is mounted at `/api`
- `PaginatedIdeas` / `PaginatedUsers` (admin endpoints) return `{ ideas, total, page, limit, totalPages }` — plain array endpoints (user ideas, comments, venture elements, market fit) return raw arrays
- Codegen post-hook: `lib/api-spec/package.json` runs `echo 'export * from "./generated/api";'` after orval to reset the api-zod index.ts
- TanStack Query v5 requires `queryKey` in `UseQueryOptions` — always pass `queryKey: getXQueryKey()` when calling hooks with custom query options

## Product

- **Browse & Search**: paginated idea grid with industry/stage/contributor-skill filters, search, and score-based sorting
- **Idea Detail**: tabbed view — Pitch (+ revenue model), Localisation (market context), Execution Plan, Market Fit by region, Discussion
- **Voting**: up/down vote with optimistic updates and net score display
- **Contributions**: offer to contribute roles/skills to an idea
- **Follows**: follow ideas for updates
- **Submit Idea**: full multi-section form — new fields: revenueModel, whyThisMarket, contributorSkills (checkboxes), localisation fields, visibility, disclaimer checkbox
- **My Ideas**: manage your submitted ideas — view, edit, delete with quality scores and visibility indicators
- **Profiles**: personal edit profile + public profile pages showing submitted concepts
- **Admin Dashboard**: idea moderation (activate/remove), featured toggle, user management (role toggle), summary stats
- **Static pages**: How It Works (with quality score explainer), About, Privacy Policy, Terms of Service
- **Auth**: register/login/logout with session cookies; quality score (0-100) auto-computed on submission

## User preferences

- DB seeded with admin only — all example ideas and non-admin users cleared for beta
- Admin login: `admin@ventureforge.io` / `admin123`
- Maturity stages: Raw concept → Researching → Validating → Prototype → Pilot → Launch-ready

## Gotchas

- Run codegen after any OpenAPI spec changes: `pnpm --filter @workspace/api-spec run codegen`
- Express 5 wildcard routes need names: `/{*splat}` not `/*`
- `req.params` values are `string | string[]` — always `parseInt()` numeric params
- `requireAuth()` reads `(req.session as Record<string, unknown>).userId` — typed this way due to express-session module augmentation
- shadcn/ui component imports are lowercase: `@/components/ui/tabs` not `@/components/ui/Tabs`
- New DB fields on ideas: `visibility`, `revenueModel`, `whyThisMarket`, `contributorSkills`, `localConstraints`, `regulatoryConsiderations`, `infrastructureDependencies`, `localCompetitors`, `localLaunchChannels`, `qualityScore` (int), `featured` (boolean)

## Pointers

- See `.local/skills/pnpm-workspace` for workspace structure and codegen details
- See `.local/skills/react-vite` for Vite/React patterns
