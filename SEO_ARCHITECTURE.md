# AdventureConnect — SEO Architecture

## Public URL model

/

 /destinos

 /destinos/:country

 /destinos/:country/:destination

 /experiencias

 /experiencias/:slug

 /planificador

 /guias

 /guias/:slug

 /premium

 /para-empresas

## SEO principles

- Every indexable page has unique title and description.
- One clear H1 per page.
- Canonical URLs.
- Breadcrumbs where useful.
- Open Graph metadata.
- Structured data only when it accurately describes visible content.
- Strong internal linking between destinations, experiences, guides, and planning.
- Responsive images using modern formats.
- Avoid mass-generated thin destination pages.
- Avoid uncontrolled parameter/index pages.
- Editorial content must add real value.

## Destination page content

A strong destination page should answer:

- Is this trip right for me?
- Why visit?
- Best time/season.
- Typical duration.
- Estimated cost.
- Things to do.
- Experiences.
- Accommodation options.
- Getting there.
- Sample itineraries.
- Alternatives.
- Source/provenance where applicable.
- Planner CTA.

## Performance

SEO implementation must respect Core Web Vitals.

Do not sacrifice performance for decorative media.

## Structured data

Use only schemas that match the actual page content, such as:

- Organization
- WebSite
- BreadcrumbList
- Article
- Event
- VideoObject

Validate generated structured data during CI where practical.
