# AdventureConnect — Implementation Plan

## Phase 0 — Freeze and understand

- Preserve main.
- Work on architecture/world-foundation.
- Inspect untracked files before moving/deleting.
- Preserve legacy behavior until replacement paths exist.

## Phase 1 — World Foundation

Deliver:

- AGENTS.md
- ARCHITECTURE.md
- PRODUCT_SPEC.md
- DOMAIN_MODEL.md
- API_CONTRACT.md
- DATABASE_ARCHITECTURE.md
- SEO_ARCHITECTURE.md
- ADRs
- repository structure documentation

Acceptance:
- architecture is internally consistent
- no destructive migration
- OpenCode can operate from explicit rules

## Phase 2 — Backend boundary

Refactor Express into explicit layers:

server/
  api/
  application/
  domain/
  infrastructure/

Keep compatibility routes isolated.

Acceptance:
- existing app can still build/run
- new v1 API boundary exists
- tests cover critical use cases

## Phase 3 — Database foundation

Introduce new domain tables incrementally.

Priority:

countries
regions
cities
destinations
experiences
providers
traveler_profiles
trip_preferences

Acceptance:
- migrations reproducible
- seed data reproducible
- provenance model works

## Phase 4 — Colombia data

Integrate:

- MinCIT/RNT
- TurismoColombia/RSS where appropriate

Pipeline:

ingest → normalize → validate → persist → index → observe

Acceptance:
- failed source does not break the app
- sync is repeatable
- source provenance is visible internally

## Phase 5 — Search

Introduce Meilisearch.

Acceptance:
- PostgreSQL remains authoritative
- indexes can be rebuilt
- search latency is measured

## Phase 6 — Decision Engine v1

Implement:

- traveler intent
- candidate generation
- constraints
- scoring
- explanation
- budget estimation
- recommendation ranking

Acceptance:
- deterministic tests
- score breakdown
- explainable results
- no external affiliate dependency

## Phase 7 — Visual product

Build the public experience:

Home
→ Decision Engine
→ Destinations
→ Experiences
→ Planner
→ Guides
→ Premium

Acceptance:
- responsive
- accessible
- fast
- coherent visual system
- no legacy FameStream terminology visible

## Phase 8 — Affiliate layer

First integrations:

- Viator
- Travelpayouts programs actually approved/available

Later:
- Skyscanner when eligibility is satisfied

Acceptance:
- provider adapters
- click attribution
- privacy-safe tracking
- graceful provider failures

## Phase 9 — Personalization

Only after sufficient interaction data:

- event tracking
- recommendation feedback
- Gorse evaluation

## Phase 10 — Legacy retirement

Only after:

- replacement features pass tests
- migration verified
- no production dependency remains

Then remove or archive FameStream code in a dedicated change.

## Release rule

No phase is considered complete because files exist.

A phase is complete only when:

code + tests + documentation + observability + verification
are all present.
