# AdventureConnect — Viajes y experiencias en Colombia

AdventureConnect es una plataforma en construcción para descubrir destinos colombianos, planificar viajes y, por fases, conectar viajeros con anfitriones, operadores y empresas turísticas.

## Producto y alcance

- Inicio: inspiración de destinos y acceso al planificador.
- Planificador: recomendaciones iniciales según estilo, duración y presupuesto orientativo.
- Actualidad (/noticias): ventana especializada en turismo colombiano, destinos, cultura local, naturaleza, eventos y movilidad.
- API actual: endpoints propios de Express para artículos y categorías. No se ha detectado un proveedor externo de noticias configurado en el código. Los titulares externos requieren una fuente legítima, credenciales y revisión de sus condiciones de uso.
- Datos: el almacenamiento activo actual es MemStorage, en memoria. Los datos se pierden al reiniciar el proceso. La persistencia con PostgreSQL debe implementarse y probarse antes de usar datos de clientes o reservas reales.

## Stack actual

- React 18 + TypeScript + Vite
- Tailwind CSS, Radix UI y Lucide
- Wouter para rutas
- TanStack Query para consultas de datos
- Express + TypeScript para la API
- Drizzle y configuración PostgreSQL presentes, pero la capa de almacenamiento activa aún es MemStorage

## Desarrollo local

Requisitos: Node.js 22 y npm.

```bash
npm ci
npm run check
npm run build
npm run dev
```

La aplicación de desarrollo utiliza el puerto 5000. El servidor de producción usa la variable PORT cuando el proveedor la establece.

## API principal

- GET /api/health — estado del proceso
- GET /api/categories — categorías editoriales
- GET /api/articles — artículos del módulo editorial
- GET /api/travel-news?limit=12 — artículos filtrados a categorías turísticas
- GET /api/articles/:slug — artículo por slug

La ruta de actualidad filtra categorías turísticas; no convierte artículos genéricos en noticias de viaje. El endpoint POST /api/seed está deshabilitado en producción. Los artículos de muestra son guías editoriales de demostración, no noticias de última hora ni una fuente de noticias externa.

## Despliegue

Se incluye render.yaml para desplegar la aplicación web en Render. El flujo de CI verifica instalación, TypeScript y compilación, y produce un ZIP del código fuente. El archivo de configuración no implica que el servicio ya esté publicado ni sustituye la configuración de dominio o secretos.

Antes de aceptar reservas, pagos, cuentas de usuario o datos de empresas, implementar almacenamiento persistente, autenticación y autorización, validación, protección contra abuso, políticas de privacidad y pruebas de extremo a extremo.

## Calidad

```bash
npm run check
npm run build
```

No guardar claves API, credenciales de base de datos ni secretos en el repositorio.
