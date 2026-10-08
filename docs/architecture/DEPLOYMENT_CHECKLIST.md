# Deployment Checklist

## Before merge

- [ ] Architecture contract is respected.
- [ ] No provider secrets are committed.
- [ ] TypeScript check passes.
- [ ] Tests pass when present.
- [ ] Production build passes.
- [ ] Database changes include a migration strategy.
- [ ] External integrations have timeout/error handling.
- [ ] Search changes remain rebuildable from PostgreSQL.
- [ ] Legacy FameStream remains isolated.

## Before production

- [ ] PostgreSQL backups are configured.
- [ ] Runtime secrets are configured outside Git.
- [ ] TLS and domain are configured.
- [ ] Health/readiness checks are enabled.
- [ ] Structured logs expose request IDs.
- [ ] Error tracking and provider telemetry are available.
- [ ] Database migration has been tested against a production-like snapshot.
- [ ] Rollback procedure is known.
- [ ] Search index rebuild procedure is documented.

## Product verification

- [ ] Home page renders correctly on mobile and desktop.
- [ ] Planner produces deterministic recommendation results for the same input.
- [ ] Recommendation explanations are visible and understandable.
- [ ] Affiliate clicks are measurable without coupling the decision engine to commerce.
