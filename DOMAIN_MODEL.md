# AdventureConnect — Domain Model

## Bounded contexts

### Travelers
- Traveler
- TravelerProfile
- TravelPreference
- TravelParty

### Geography
- Country
- Region
- City
- Destination
- DestinationCategory

### Supply
- Provider
- ProviderLocation
- Accommodation
- TransportationOption
- Experience
- ExperienceCategory

### Trip Planning
- TripPreference
- TripCandidate
- Recommendation
- Trip
- Itinerary
- ItineraryItem
- BudgetEstimate

### Trust
- Review
- Favorite
- DataSource
- ExternalRecord
- SyncRun
- Provenance

### Commerce
- AffiliateProgram
- AffiliateOffer
- AffiliateClick
- Conversion
- Subscription

## Important invariants

1. A Destination belongs to a geographic hierarchy.
2. An Experience belongs to a destination or explicit geographic scope.
3. Provider data is never treated as first-party truth without provenance.
4. Recommendation scores are calculated, not stored as unexplained magic numbers.
5. Every external record has a source and external identifier.
6. An itinerary item references a domain entity or a clearly labeled user-generated/custom item.
7. Affiliate clicks are attributable without exposing private user data to providers.
8. Currency is explicit for every monetary value.
9. Dates and time zones are explicit where operationally relevant.

## Decision Engine concepts

TravelerIntent
→ PreferenceModel
→ Candidate
→ ConstraintResult
→ ScoreBreakdown
→ Recommendation
→ Explanation

The engine must be deterministic for identical inputs and data snapshots.
