# AdventureConnect — Deployment Architecture

## Veredicto

AdventureConnect se despliega como **monolito modular containerizado**. La aplicación es la unidad principal de despliegue; PostgreSQL es la fuente de verdad y Meilisearch una proyección reconstruible.

### Producción objetivo

```text
Internet → HTTPS/Reverse Proxy → AdventureConnect App
                                      ├─ React + Vite
                                      ├─ API/Application
                                      ├─ Decision Engine
                                      └─ Provider adapters
                                           ├─ PostgreSQL (source of truth)
                                           ├─ Meilisearch (derived index)
                                           └─ RNT / RSS / Viator / Travelpayouts

Observability: structured logs + health/readiness + release metadata
```

## Principios

1. `main` no recibe trabajo directo de implementación.
2. Cambios por ramas pequeñas y pull requests.
3. Build y verificación antes de desplegar el artefacto.
4. PostgreSQL es persistente y autoritativo.
5. Meilisearch puede reconstruirse desde PostgreSQL.
6. Secretos únicamente en el entorno de despliegue.
7. Fallas de proveedores externos no pueden tumbar el núcleo de decisión.
8. Migraciones de base de datos explícitas.
9. Health y readiness separados.
10. No Kubernetes ni microservicios en la primera etapa.

## Entornos

- local: Docker Compose o desarrollo nativo
- CI: GitHub Actions
- staging: datos/credenciales aislados
- production: imagen verificada + PostgreSQL persistente

## Gates

TypeScript/build, tests, secretos, migraciones, health endpoint, imagen de producción y revisión de diff deben pasar antes de una release.

## Evolución

Sólo se extraen servicios cuando carga, despliegue independiente u ownership lo justifiquen. Los primeros candidatos son sincronizadores/indexadores; el Decision Engine permanece en el núcleo salvo evidencia contraria.
