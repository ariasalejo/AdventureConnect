# AdventureConnect — Product Delivery Blueprint

## End state

AdventureConnect becomes a coherent travel decision product:

```
Intent
  ↓
Preference Model
  ↓
Candidate Generation
  ↓
Constraints
  ↓
Scoring
  ↓
Recommendation
  ↓
Explanation
  ↓
Itinerary
  ↓
Action / Save / Referral
```

## Technical shape

```
React + Vite + TypeScript
          |
          v
      API v1
          |
          v
Application Use Cases
          |
    +-----+------+
    |            |
    v            v
Domain       Decision Engine
    |            |
    +-----+------+
          |
          v
Infrastructure
   |          |
   v          v
Postgres   Meilisearch
   ^
   |
Adapters / ingestion / providers
```

## Release slices

### Slice A — Foundation
Architecture, boundaries, CI, runtime configuration, health checks.

### Slice B — Decision MVP
Intent form, deterministic candidate scoring, explanation, destination detail.

### Slice C — Data
RNT/MinCIT normalization, destination/experience seed, provenance.

### Slice D — Search
Meilisearch index and discovery.

### Slice E — Commercial
Viator first, Travelpayouts where approved, tracking and fallback.

### Slice F — Personalization
Behavior events, feedback loops, Gorse evaluation.

## Quality bar

Every slice must ship as a usable vertical capability. Do not create a large empty folder tree and call it implementation.
