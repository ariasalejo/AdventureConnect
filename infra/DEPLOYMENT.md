# AdventureConnect — Deployment Contract

## Production shape

```
                    +------------------+
                    |   HTTPS / CDN    |
                    +--------+---------+
                             |
                             v
                    +------------------+
                    | AdventureConnect |
                    |  Web + API       |
                    +---+----------+---+
                        |          |
                        v          v
                 +----------+  +-----------+
                 | Postgres |  | Meilisearch|
                 |  source  |  |  derived   |
                 +----------+  +-----------+
                        ^
                        |
              ingestion / sync jobs
                        |
             +----------+----------+
             | external adapters  |
             +---------------------+
```

## Required runtime configuration

- `NODE_ENV`
- `PORT`
- `DATABASE_URL`
- `MEILISEARCH_URL`
- `MEILISEARCH_MASTER_KEY`
- provider credentials only when the corresponding integration is enabled
- an application secret for signed server-side state when required

Never commit real values.

## Build contract

The deploy pipeline must:
1. install locked dependencies;
2. type-check;
3. run unit tests;
4. build the web/API artifact;
5. build the production container;
6. run a startup/health verification;
7. deploy only from an approved branch/tag.

## Health contract

- `/health/live`: process is running.
- `/health/ready`: application can serve traffic and required local dependencies are usable.
- Provider availability is not a prerequisite for readiness.

## Rollback

Every production release must be traceable to a Git commit. Rollback means redeploying a previously verified immutable commit/image. Database migrations must be backward-compatible during rollout whenever possible.

## Observability

At minimum capture:
- request ID
- HTTP status
- latency
- error code
- deployment/version identifier
- dependency failure category

Never log secrets, authentication tokens, raw payment data, or unnecessary personal data.
