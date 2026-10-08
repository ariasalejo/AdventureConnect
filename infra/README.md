# Infrastructure

Deployment assets live here and must remain aligned with `DEPLOYMENT_ARCHITECTURE.md`.

## Planned layers

- `container/` — reproducible application image definitions.
- `compose/` — local infrastructure for PostgreSQL and Meilisearch.
- `production/` — provider-specific deployment manifests only when a real target is selected.
- `scripts/` — safe operational commands and verification.

Do not add Kubernetes or cloud-specific complexity until the deployment target and operational need justify it.
