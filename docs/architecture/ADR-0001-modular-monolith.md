# ADR-0001 — Modular Monolith

## Status
Accepted

## Decision
AdventureConnect is deployed initially as one coherent application with explicit domain, application, infrastructure, and integration boundaries.

## Why
The product needs fast iteration and a single operational unit while the Decision Engine and data model are still evolving. Microservices would add deployment, networking, observability, and consistency costs before those boundaries are proven.

## Consequences
- Modules must have explicit ownership and dependency direction.
- Shared infrastructure is allowed only through stable interfaces.
- Service extraction is permitted only through a new ADR with measured justification.
- The deployment unit remains simple and reproducible.

## Rejection criteria
Do not split a module into a service because of folder size, theoretical scale, or fashion. Require a concrete need such as independent scaling, deployment cadence, operational isolation, or ownership boundary.
