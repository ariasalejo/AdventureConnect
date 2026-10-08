# AdventureConnect Infrastructure

This directory contains reproducible deployment and runtime infrastructure.

## Principles
- Container-first.
- PostgreSQL is authoritative persistent state.
- Meilisearch is disposable derived state.
- Secrets are injected at runtime.
- Health checks are explicit.
- Local development must approximate production topology.
- Platform-specific configuration must not leak into domain code.

## Runtime services

| Service | Role | Persistence |
|---|---|---|
| app | React/Vite delivery + Node API | stateless |
| postgres | system of record | persistent |
| meilisearch | search index | rebuildable |

## Deployment contract

The production platform must provide:
1. HTTPS termination.
2. Environment variables/secrets.
3. Persistent PostgreSQL.
4. Restart-on-failure.
5. Health checks.
6. Logs and basic metrics.
7. A reproducible build from Git.

See `infra/DEPLOYMENT.md` for the operational contract.
