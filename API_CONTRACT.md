# AdventureConnect — API Contract

## API policy

Base path:

/api/v1

The existing legacy API is not the target contract.

## Core endpoints

### Decision Engine

POST /api/v1/decision-engine/recommend

Request:

{
  "origin": "MDE",
  "duration": 5,
  "budget": {
    "amount": 1500000,
    "currency": "COP"
  },
  "travelers": 2,
  "interests": ["nature", "gastronomy", "adventure"],
  "pace": "moderate"
}

Response concept:

{
  "requestId": "...",
  "candidates": [
    {
      "destinationId": "...",
      "score": 0.92,
      "scoreBreakdown": {},
      "explanation": "...",
      "estimatedBudget": {},
      "itinerary": {}
    }
  ]
}

### Destinations

GET /api/v1/destinations
GET /api/v1/destinations/:slug

### Experiences

GET /api/v1/experiences
GET /api/v1/experiences/:slug

### Search

GET /api/v1/search?q=...

### Trips

POST /api/v1/trips
GET /api/v1/trips/:id
POST /api/v1/trips/:id/itinerary

### Affiliate

POST /api/v1/affiliate/click

## API requirements

- Validate all input with shared schemas.
- Return stable error envelopes.
- Use request IDs.
- Do not leak internal stack traces.
- Do not expose secrets.
- Third-party failures must degrade gracefully.
- Pagination must be explicit.
- Currency and locale must be explicit where relevant.

## Error envelope

{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable message",
    "requestId": "..."
  }
}
