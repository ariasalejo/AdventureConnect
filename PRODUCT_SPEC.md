# AdventureConnect — Product Specification

## Positioning

**Decide better. Travel better.**

AdventureConnect is a Travel Intelligence Platform.

It does not begin with "search everything". It begins with traveler intent and produces a justified recommendation.

## Primary user

Leisure and exploration travelers:

- solo
- couples
- friends
- families
- nature
- gastronomy
- adventure
- culture
- rest

B2B/provider capabilities are secondary.

## Initial geography

Launch:
- Colombia
- Medellín as an initial origin/context
- national destinations

Architecture:
- global countries
- regions
- cities
- currencies
- languages
- time zones
- seasons
- provider markets

## Core user input

Example:

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

## Core output

A ranked set of trip candidates with:

- destination match score
- explanation
- estimated budget
- transport options
- accommodation options
- experiences
- sample itinerary
- alternatives
- provider links

## Product hierarchy

1. Home
2. Decision Engine
3. Destinations
4. Experiences
5. Planner
6. Guides
7. Premium
8. Partner/B2B

## Monetization

Primary early model:
- affiliate referrals
- experience referrals
- accommodation/transport referrals when approved and available

The affiliate layer monetizes the recommendation; it does not define the product.

## Trust

Recommendations must distinguish:

- official/public data
- partner/provider data
- editorial content
- calculated estimates
- user-generated signals

Never present estimates as official facts.

## Visual direction

Cinematic + editorial + intelligent.

Use emotion to attract, intelligence to help decide, and a clear action to convert.

Do not make every page a hero-image landing page. Use visual intensity where it improves discovery.
