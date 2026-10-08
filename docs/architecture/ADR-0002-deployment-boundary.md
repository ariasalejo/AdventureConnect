# ADR-0002 — Deployment Boundary

## Status
Accepted

## Decision
The production application is deployed as a containerized modular monolith. PostgreSQL and Meilisearch are infrastructure dependencies, not application-owned state.

## Runtime topology
```
Internet
  |
  v
HTTPS / Reverse Proxy
  |
  v
AdventureConnect Web + API
  |             |
  |             +--> External provider adapters
  |
  +--> PostgreSQL (authoritative)
  |
  +--> Meilisearch (derived)
```

## Rules
- Secrets exist only in server/runtime configuration.
- PostgreSQL is persistent and backed up by the hosting platform.
- Meilisearch can be rebuilt from PostgreSQL.
- Health checks must distinguish application readiness from dependency health.
- Third-party provider failures must not take down public discovery.
- Background ingestion/sync must be restartable and idempotent.

## Portability
The application must be deployable to any container-capable platform without changing domain logic. Provider-specific deployment configuration belongs under `infra/` or the platform adapter.
