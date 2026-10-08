# AdventureConnect — Deployment Architecture

## Decision

AdventureConnect deploys as a **modular monolith** first. The deployment topology must preserve the same boundaries as the codebase without prematurely introducing microservices.

## Runtime topology

```
Internet
  |
  v
CDN / TLS / Edge
  |
  v
Web + API application (React/Vite build + Node runtime)
  |             |              |
  v             v              v
PostgreSQL    Meilisearch     Object Storage
  |
  v
Sync / background jobs
  |
  +--> RNT / MinCIT
  +--> TurismoColombia RSS
  +--> Viator
  +--> Travelpayouts
```

## Production responsibilities

- **Application**: public web, planner, API v1, decision engine orchestration.
- **PostgreSQL**: authoritative transactional state.
- **Meilisearch**: derived search index; rebuildable from PostgreSQL.
- **Object storage**: images, generated exports and durable media where required.
- **Background jobs**: source synchronization, indexing, enrichment and retries.
- **Observability**: structured logs, request IDs, health checks and provider telemetry.

## Deployment principles

1. Build once, run the same artifact through environments.
2. Secrets exist only in server/runtime environments.
3. Database migrations are explicit and reversible where practical.
4. Search indexes are disposable and reconstructible.
5. Third-party providers are isolated behind adapters.
6. Provider failures never make the core domain depend on affiliate availability.
7. Health checks distinguish application readiness from dependency health.
8. Production deploys are gated by typecheck, tests and build.
9. `main` remains protected; changes arrive through reviewed pull requests.
10. No Kubernetes requirement for the MVP.

## Environments

- **development** — local modular monolith + local PostgreSQL/Meilisearch.
- **preview** — isolated build for pull requests when supported by the host.
- **production** — managed PostgreSQL + managed/isolated search + application runtime.

## Scaling path

Start with one application runtime. Scale horizontally only after observing real bottlenecks. PostgreSQL remains the source of truth; Meilisearch and workers scale independently when needed.

Microservices are an architectural escape hatch, not an MVP milestone.
