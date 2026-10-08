# AdventureConnect — Engineering Agent Contract

## Product identity

AdventureConnect is a Travel Intelligence Platform.

It is NOT FameStream News, a news portal, a generic affiliate directory, or a Booking/Skyscanner clone.

The legacy FameStream implementation is preserved only for controlled migration and historical reference.

## Non-negotiable architecture rules

1. Preserve Git history.
2. Never rewrite the repository wholesale.
3. Never work directly on main for architecture or feature implementation.
4. Use small, reviewable, atomic changes.
5. Keep the backend as a modular monolith until an explicit ADR authorizes service extraction.
6. Keep domain logic independent from Express, React, and vendor SDKs.
7. External providers must be isolated behind adapters.
8. PostgreSQL is the system of record.
9. Meilisearch is a derived search index, never the source of truth.
10. The Decision Engine must be deterministic, testable, explainable, and independent from affiliate providers.
11. Gorse is a later personalization layer, not a prerequisite for MVP.
12. RNT/MinCIT and TurismoColombia are external data sources; normalize and validate before persistence.
13. Never expose provider credentials to the browser.
14. No business logic in presentational React components.
15. Every new domain capability requires tests and documentation.
16. Do not invent external API capabilities. Verify provider contracts before implementing them.
17. Do not delete legacy FameStream code until its replacement is tested and its migration is documented.
18. Do not optimize for an arbitrary file count. Optimize for boundaries, correctness, maintainability, and product value.

## Quality gates

Before considering a change complete:

- TypeScript compiles.
- Lint passes when configured.
- Unit tests pass.
- Integration tests pass for changed backend boundaries.
- No secrets are committed.
- Git diff is reviewed.
- Architecture docs remain consistent with implementation.
- New external integrations have timeout, error, and fallback behavior.

## Product principle

The platform should answer:

> "What trip is right for me?"

The core flow is:

Traveler Intent → Preference Model → Candidate Generation → Constraint Engine → Scoring Engine → Recommendation Engine → Itinerary Builder → Explanation Engine → Personalized Trip
