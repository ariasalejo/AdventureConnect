# AdventureConnect — World Architecture Contract

## 1. Mission

AdventureConnect is a global Travel Intelligence Platform that helps people discover and plan trips based on intent, constraints, preferences, budget, time, pace, and interests.

Launch market: Colombia.

Architecture scope: global from day one.

## 2. Architectural style

Use a Modular Monolith.

The application is deployed as a coherent system, but domain modules have explicit boundaries so that future extraction is possible without designing a distributed system prematurely.

### High-level flow

Web App
→ API
→ Application Services
→ Domain Modules
→ Core Decision Engine
→ Infrastructure
→ PostgreSQL

Derived systems:

PostgreSQL
→ Meilisearch

External sources
→ Ingestion Adapters
→ Normalization
→ Validation
→ PostgreSQL

Affiliate providers
→ Provider Adapters
→ Tracking/Attribution
→ outbound conversion

## 3. Logical layers

### Presentation
React + TypeScript + Vite + Tailwind.

### API
Node.js + TypeScript + existing Express foundation.

### Application
Use cases, orchestration, authorization, DTO mapping, transaction boundaries.

### Domain
Travel concepts and business rules.

### Core Intelligence
Decision Engine, scoring, constraints, recommendations, budget, itinerary, explanations.

### Infrastructure
PostgreSQL/Drizzle, cache, search, queues, storage, observability, external adapters.

## 4. Core modules

- travelers
- destinations
- experiences
- providers
- accommodations
- transportation
- trips
- itineraries
- reviews
- favorites
- subscriptions
- affiliate

## 5. Core intelligence

- decision-engine
- candidate-generator
- constraint-engine
- scoring-engine
- recommendation-engine
- budget-engine
- itinerary-builder
- explanation-engine

## 6. External integrations

### Official/public
- MinCIT / RNT
- TurismoColombia RSS/content sources

### Commercial
- Viator
- Travelpayouts
- later: Skyscanner and other providers subject to approval and contract verification

### Future
- maps
- flights
- hotels
- additional experience providers

All integrations must be adapters. No provider SDK may leak into domain code.

## 7. Data authority

PostgreSQL is authoritative.

Meilisearch is derived and rebuildable.

External source records must retain source name, external identifier, sync timestamp, status, and provenance.

## 8. Legacy boundary

Legacy FameStream code is not part of the new AdventureConnect domain.

It may temporarily live under a legacy boundary while migration occurs.

No new AdventureConnect feature should depend on FameStream articles/categories APIs.

## 9. Performance targets

Initial engineering targets:

- Public page LCP: ≤ 2.5s at the 75th percentile.
- INP: ≤ 200ms.
- CLS: < 0.1.
- TTFB: target ≤ 800ms for public pages.
- Internal API P95: < 500ms excluding third-party provider latency.
- Decision Engine P95: < 800ms with local/cache-backed data.

Third-party calls require explicit timeout, retry policy where safe, circuit/fallback behavior, and telemetry.

## 10. Evolution rule

Do not introduce microservices merely because modules exist.

A module becomes a service only after an ADR demonstrates a real need such as independent scaling, operational isolation, deployment cadence, or ownership boundary.
