# AdventureConnect — Database Architecture

## System of record

PostgreSQL.

Drizzle remains the database toolkit because the current repository already uses it.

## First domain groups

### Identity
- users
- traveler_profiles
- travel_parties

### Geography
- countries
- regions
- cities
- destinations
- destination_categories

### Supply
- providers
- provider_locations
- accommodations
- transportation_options
- experiences
- experience_categories

### Planning
- trip_preferences
- trips
- trip_candidates
- recommendations
- itineraries
- itinerary_items
- budget_estimates

### Trust and provenance
- data_sources
- external_records
- sync_runs
- reviews
- favorites

### Commerce
- affiliate_programs
- affiliate_offers
- affiliate_clicks
- conversions
- subscriptions

## External data strategy

Never write raw provider payloads directly into domain tables.

Pipeline:

External Source
→ Raw/External Record
→ Normalize
→ Validate
→ Map
→ Upsert Domain Entity
→ Index Search

Each ingestion run records:

- source
- started_at
- finished_at
- status
- records_seen
- records_created
- records_updated
- records_rejected
- error summary

## Search index

Meilisearch is derived.

PostgreSQL remains authoritative.

A failed search index update must not corrupt domain persistence.

## Data lifecycle

All external records should support:

- source identity
- external ID
- first seen
- last seen
- last synchronized
- active/inactive state
- checksum/version where useful

## Currency

Money values must store amount plus currency code. Avoid implicit COP assumptions in domain tables.

## Migration rule

Do not replace the current legacy schema in one destructive migration.

Introduce new domain tables incrementally, migrate needed data, verify, then retire unused legacy tables.
