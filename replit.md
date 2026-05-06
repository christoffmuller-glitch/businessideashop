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

## Product

- **Browse & Search**: paginated idea grid with industry/stage filters and search
- **Idea Detail**: tabbed view — Pitch, Execution Plan (venture elements checklist), Market Fit by region, Discussion (comments)
- **Voting**: up/down vote with optimistic updates and net score display
- **Contributions**: offer to contribute roles/skills to an idea
- **Follows**: follow ideas for updates
- **Submit Idea**: full multi-section form with zod validation
- **Profiles**: personal edit profile + public profile pages showing submitted concepts
- **Admin Dashboard**: idea moderation (activate/remove) and user management (role toggle)
- **Auth**: register/login/logout with session cookies

## User preferences

- Seeded with 5 example ideas and 5 users
- Admin login: `admin@ventureforge.io` / `admin123`
- Regular users (all `password123`): sarah@, marcus@, priya@, tom@ — all @ventureforge.io

## Gotchas

- Run codegen after any OpenAPI spec changes: `pnpm --filter @workspace/api-spec run codegen`
- Express 5 wildcard routes need names: `/{*splat}` not `/*`
- `req.params` values are `string | string[]` — always `parseInt()` numeric params
- `requireAuth()` reads `(req.session as Record<string, unknown>).userId` — typed this way due to express-session module augmentation
- shadcn/ui component imports are lowercase: `@/components/ui/tabs` not `@/components/ui/Tabs`

## Pointers

- See `.local/skills/pnpm-workspace` for workspace structure and codegen details
- See `.local/skills/react-vite` for Vite/React patterns
