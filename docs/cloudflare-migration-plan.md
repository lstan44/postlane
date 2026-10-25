# Postiz to Cloudflare: migration plan

Status: planning only. Baseline: upstream `main` at `3a7d28b7` on 2026-10-12. No Cloudflare resources or production data have been changed.

## Objective and boundary

Run the self-hosted Postiz product on Cloudflare infrastructure with D1 for application data, R2 for media, Better Auth for account sign-in, Workers for the web/API edge, and Cloudflare scheduling and execution services for publishing. Preserve current product behavior, social-provider connections, public API credentials, scheduled posts, and existing users. This is a maintained fork of Postiz, not a deployment configuration change.

The target uses Cloudflare Workers, D1, R2, Workflows, Queues, Durable Objects, and stateless Cloudflare Containers only where native Node or media workloads cannot safely run in Workers. Email, social networks, and optional AI/media providers remain external integrations.

## Repository evidence

| Current dependency | Evidence | Target / required work |
| --- | --- | --- |
| PostgreSQL via Prisma | `libraries/nestjs-libraries/src/database/prisma/schema.prisma`; 88 models and 11 enums; `PrismaService` connects on startup | Convert PostgreSQL schema, types, constraints, and queries to SQLite/D1; validate actual data size and query latency. |
| PostgreSQL for Mastra | `libraries/nestjs-libraries/src/chat/mastra.store.ts` uses `@mastra/pg` | Prove a Cloudflare-compatible Mastra store, likely Durable Object-backed storage, or replace that persistence layer. Include agent state in migration. |
| Redis | OAuth state/PKCE, wallet challenges, upload sessions/tickets, rate limiting, locks and caches in `apps/backend/src` and `libraries/nestjs-libraries/src` | D1 for single-use records and durable metadata; Durable Objects for atomic locks/rate counters; remove Redis client calls. Do not use eventually consistent KV for consume-once security state. |
| Temporal | `apps/orchestrator/src/workflows`, post workflow v1.1.2, media, clipping, email, token refresh, auto-post, missing-post recovery | Reimplement durable orchestration in Workflows plus Queues/alarms and reconciliation. Temporal histories are not directly portable. |
| Postiz sign-in | `apps/backend/src/services/auth`, bcrypt passwords, signed JWT cookie, provider-specific identities | Better Auth on D1; migrate user IDs, password hashes, provider identities and authorization links without linking accounts by email alone. |
| Postiz public API/OAuth server | `apps/backend/src/services/auth/public.auth.middleware.ts`, `api/routes/oauth.controller.ts`, OAuth models in Prisma schema | Preserve organization API keys and token protocol independently of Better Auth login. Evaluate Better Auth OAuth provider plugin only after protocol and token compatibility tests. |
| Media | `libraries/nestjs-libraries/src/upload/cloudflare.storage.ts`, R2 S3 API, multipart uploads; local filesystem paths remain in frontend and providers | Use R2 bindings/presigned multipart uploads, direct browser upload and R2 metadata; remove local-file assumptions; validate existing URLs and media bytes. |
| Native/long workloads | `sharp` and `fs` in social providers, `ffmpeg`/media processing, up to 30-minute publishing activities | Worker compatibility spike per provider; run remaining native/long tasks in stateless Containers with R2 as durable storage and D1 as job record. |
| Next.js frontend | `apps/frontend`, Next 16, server rendering, route handlers and `proxy.ts` | Run Cloudflare's compatibility check and prove core routes on Workers; remove filesystem upload route. Evaluate current vinext path against OpenNext in a production-like preview. |

## Proposed target shape

1. **Web Worker:** Next.js frontend, same public origin, using Better Auth session cookies. Keep the browser API contract stable where possible.
2. **API Worker:** Route handlers for account, organization, posts, integrations, webhooks, media metadata, and public API. Share auth and domain contracts with web. Use an incremental facade around legacy Nest routes during transition.
3. **D1:** Separate logical databases for identity and application data initially, with explicit migrations and foreign-key/uniqueness checks within each database. Cross-database links are validated in application code. Start application data in one D1 database only if measured size, growth and write contention fit; choose a shard boundary before cutover if not. Preserve current IDs.
4. **R2:** Private originals and processed media, with narrow upload/download authorization and a public media delivery hostname only for objects intended for social-provider retrieval. Use direct multipart uploads for large video.
5. **Workflows + Queues:** One durable publish execution per post/version, with sleep until publish time, explicit provider-specific steps and no blind retry after an uncertain external publish. Queue fanout for notifications, webhooks and processing. A scheduled reconciler finds due, stuck and unconfirmed posts.
6. **Durable Objects:** Per-resource coordination for short locks, rate limits, and any provider concurrency that currently relies on Redis or Temporal task queues. Use D1 for durable business state; DO state must be rebuildable where appropriate.
7. **Containers:** Stateless execution of proven incompatible native/media tasks. No Postgres, Redis or Temporal database inside Containers: their disks are ephemeral.

## Design rules that protect posting

- D1 is authoritative for post state, publish time, workflow generation, and external platform IDs. A state transition must check the expected generation/status before acting.
- A queued message or alarm may be delivered more than once. Every handler is idempotent up to the external publishing call.
- Once a social publish call may have reached the provider, timeout means **outcome unknown**. Query the provider's status or mark unconfirmed and alert; never retry the publish blindly. Match the current v1.1.2 workflow's behavior.
- Rescheduling/canceling a post increments its generation. Stale workflow instances and messages cannot publish it.
- Keep a durable outbox for webhooks, email and notifications, keyed to the state transition; apply per-user preferences and retry/deduplication rules.
- Use Cloudflare Workflows for long waits. Queue delay alone is unsuitable for posts scheduled beyond its 24-hour delay ceiling.

## Better Auth migration

1. Define Better Auth `user`, `account`, `session`, and `verification` data on D1. Keep Postiz organization membership/roles as domain authorization; do not infer authorization from a Better Auth session alone.
2. Map each legacy user ID to a Better Auth user ID without changing foreign keys. Resolve duplicate emails across Postiz's `(email, providerName)` uniqueness rule before import. Link Google/GitHub/Apple/OIDC accounts by verified provider subject and current Postiz `providerId`, never by email alone.
3. Configure Better Auth password verification for Postiz's bcrypt hashes, then rehash on successful login if desired. Test password reset, activation, disabled users and account deletion. Keep current login providers until individually proven on Better Auth; wallet/Farcaster may need custom plugins or staged retention.
4. Use secure, HttpOnly cookies for browser sessions. Public API keys and OAuth access tokens remain separate credentials with organization scopes and revocation. Preserve the existing OAuth authorization-server endpoints until client compatibility is demonstrated.
5. Test an existing-user login, each configured social login, organization switch, revocation, sign-out across devices, and public API callers. Provide a short, bounded legacy-JWT-to-new-session bridge only if seamless sign-in is needed and the threat review passes; otherwise require reauthentication at cutover.

## Database conversion and data move

1. Inventory real deployment data: table sizes, row counts, largest JSON/text values, indexes, write rate, active scheduled workflows, uploads, OAuth connections and account-provider collisions. A local empty schema is insufficient for sizing.
2. Build a typed schema map from PostgreSQL to D1: timestamps and time zones, JSON, enums, booleans, decimal precision, IDs, unique constraints, foreign keys, and nullable semantics. Preserve at least third normal form for core entities; justify any denormalized read model.
3. Prototype the existing Prisma model on D1's SQLite connector and `@prisma/adapter-d1`. Its D1 path is still a compatibility gate, not an assumed drop-in. Convert interactive Prisma transactions to D1-compatible atomic batches or explicit state machines, with concurrency tests. If the Prisma path cannot pass, move repository-by-repository to Drizzle/SQL.
4. Use versioned Wrangler D1 migrations. Test clean replay and upgrade from the previous schema; never use the current `prisma db push` production workflow for cutover. Export PostgreSQL at a consistent point, transform deterministically, import in bounded batches and verify per-table counts, checksums and relationship invariants.
5. Keep the old database read-only and recoverable through the rollback window. D1's per-database size and single-writer behavior require a measured capacity gate; do not assume one global D1 database scales indefinitely.

## Delivery phases and exit gates

| Phase | Deliverable | Gate |
| --- | --- | --- |
| 0. Baseline | Pin upstream commit and deployment version; inventory live data, credentials, provider use, scheduled jobs and traffic; define API/provider contract tests. | Restore a PostgreSQL/R2 backup in staging; quantify D1 fit and worker runtime blockers. |
| 1. Platform spike | Isolated Worker with Next.js login/calendar route, Better Auth + D1, representative Prisma/D1 queries, R2 multipart upload, one social provider call and a simulated scheduled workflow. | Browser and Worker-runtime tests pass; record exact unsupported packages, latency and resource use. Stop or redesign if full feature parity cannot be met. |
| 2. Data and identity | Versioned D1 schema/import pipeline; Better Auth user/account import and session bridge; public API credential preservation. | Migration replay, upgrade, referential checks, existing-password login, provider-subject login and rollback rehearsal pass. |
| 3. Core API and media | Port organization, integrations, post CRUD, authz, API keys, webhooks, upload and media paths. Replace Redis state and local file usage. | Contract tests against the same representative fixtures as legacy; no privilege or data isolation regressions; media checksums and URL reachability pass. |
| 4. Scheduler and providers | Workflows/Queues/DO orchestration, native task Containers where required; port each social provider and background workflow. | Scheduled, immediate, canceled, retried, uncertain and recurring posts pass with zero duplicate external publishes; notifications, webhooks and OAuth reconnects pass. |
| 5. Cutover | Shadow-read/reconcile, copy data, pause writes, final delta import, stop Temporal publishers, switch traffic, monitor and retain rollback route. | Counts/checksums match, scheduled-job inventory reconciles, live login/upload/publish callbacks work, and rollback has been exercised. |

No production cutover, DNS switch, or destructive data migration is included in this plan. Those are separate release decisions after the gates pass.

## Open decisions and measured blockers

- **Database partition:** a single shared D1 database may hit its 10 GB size or serialized-write limit. Determine actual data/growth and cross-organization queries before choosing per-tenant or domain shards.
- **Worker package compatibility:** NestJS/Express, Prisma, Sentry, provider SDKs, `sharp`, `fs`, and long-running activities require a real Worker build/run matrix. `nodejs_compat` does not prove each package works.
- **Mastra agent persistence:** prove an actively maintained Cloudflare-compatible store and migrate any existing memory/history; otherwise isolate agent features until parity is available.
- **Provider parity:** inventory which of the roughly 30+ provider implementations are actually used and stage by observed use, but the final migration gate requires every retained provider to work.
- **OAuth identity:** map existing provider subjects and Postiz's own OAuth authorization-server clients/tokens separately from Better Auth social login.
- **Operations:** determine owner for on-call, D1 capacity alarms, workflow reconciliation, R2 lifecycle/backups, secret rotation, cost budgets and upstream merge cadence.

## Primary platform references (checked 2026-10-12)

- [Cloudflare D1 limits](https://developers.cloudflare.com/d1/platform/limits/) and [D1 batch semantics](https://developers.cloudflare.com/d1/worker-api/d1-database/)
- [Cloudflare Workflows limits](https://developers.cloudflare.com/workflows/reference/limits/) and [Queues limits](https://developers.cloudflare.com/queues/platform/limits/)
- [Cloudflare Containers lifecycle](https://developers.cloudflare.com/containers/faq/) and [Workers limits](https://developers.cloudflare.com/workers/platform/limits/)
- [Prisma D1 adapter](https://www.prisma.io/docs/orm/v6/overview/databases/cloudflare-d1)
- [Better Auth D1 support](https://better-auth.com/blog/1-5), [password hooks](https://better-auth.com/docs/reference/options), and [OAuth provider](https://better-auth.com/docs/plugins/oauth-provider)
- [Cloudflare Next.js guidance](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/)
