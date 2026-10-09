import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertArticleSchema, insertCategorySchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API prefix
  const apiPrefix = "/api";

  // Health check for deployment platforms.
  app.get(`${apiPrefix}/health`, (_req: Request, res: Response) => {
    res.status(200).json({ status: "ok", service: "adventureconnect" });
  });

  // Dedicated travel-news feed: only travel-related categories are returned.
  app.get(`${apiPrefix}/travel-news`, async (req: Request, res: Response) => {
    try {
      const allowedCategories = new Set([
        "destinos-colombia",
        "cultura-local",
        "naturaleza-aventura",
        "movilidad-viajera",
        "eventos-colombia",
        "turismo-sostenible",
        "economia-turistica",
      ]);
      const requestedLimit = Number.parseInt(String(req.query.limit ?? "12"), 10);
      const limit = Number.isFinite(requestedLimit) ? Math.min(50, Math.max(1, requestedLimit)) : 12;
      const articles = await storage.getAllArticles();
      const travelNews = articles
        .filter((article) => allowedCategories.has(article.category.slug))
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
        .slice(0, limit);
      res.set("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
      res.json(travelNews);
    } catch (error) {
      console.error("Error fetching travel news:", error);
      res.status(500).json({ message: "No se pudo cargar la actualidad turística" });
    }
  });

  // Categories API
  app.get(`${apiPrefix}/categories`, async (req: Request, res: Response) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Error fetching categories" });
    }
  });

  app.get(`${apiPrefix}/categories/:slug`, async (req: Request, res: Response) => {
    try {
      const category = await storage.getCategoryBySlug(req.params.slug);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Error fetching category" });
    }
  });

  app.post(`${apiPrefix}/categories`, async (req: Request, res: Response) => {
    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validatedData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid category data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating category" });
    }
  });

  // Articles API
  app.get(`${apiPrefix}/articles`, async (req: Request, res: Response) => {
    try {
      let articles;
      
      if (req.query.featured === "true") {
        articles = await storage.getFeaturedArticles();
      } else if (req.query.latest === "true") {
        const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
        articles = await storage.getLatestArticles(limit);
      } else if (req.query.popular === "true") {
        const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
        articles = await storage.getPopularArticles(limit);
      } else if (req.query.viral === "true") {
        const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
        articles = await storage.getViralArticles(limit);
      } else if (req.query.category) {
        articles = await storage.getArticlesByCategory(req.query.category as string);
      } else if (req.query.search) {
        articles = await storage.searchArticles(req.query.search as string);
      } else {
        articles = await storage.getAllArticles();
      }
      
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Error fetching articles" });
    }
  });

  app.get(`${apiPrefix}/articles/:slug`, async (req: Request, res: Response) => {
    try {
      const article = await storage.getArticleBySlug(req.params.slug);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      
      // Increment view count
      await storage.incrementArticleViews(article.id);
      
      res.json(article);
    } catch (error) {
      res.status(500).json({ message: "Error fetching article" });
    }
  });

  app.post(`${apiPrefix}/articles`, async (req: Request, res: Response) => {
    try {
      const validatedData = insertArticleSchema.parse(req.body);
      const article = await storage.createArticle(validatedData);
      res.status(201).json(article);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid article data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating article" });
    }
  });

  // Development-only, idempotent seed. Never expose a write seed endpoint in production.
  app.post(`${apiPrefix}/seed`, async (_req: Request, res: Response) => {
    if (process.env.NODE_ENV === "production") {
      return res.status(404).json({ message: "Not found" });
    }

    try {
      const categoryDefinitions = [
        { name: "Destinos de Colombia", slug: "destinos-colombia" },
        { name: "Cultura local", slug: "cultura-local" },
        { name: "Naturaleza y aventura", slug: "naturaleza-aventura" },
        { name: "Movilidad viajera", slug: "movilidad-viajera" },
        { name: "Eventos en Colombia", slug: "eventos-colombia" },
        { name: "Turismo sostenible", slug: "turismo-sostenible" },
        { name: "Economía turística", slug: "economia-turistica" },
      ];

      let categories = await storage.getAllCategories();
      for (const definition of categoryDefinitions) {
        if (!categories.some((category) => category.slug === definition.slug)) {
          await storage.createCategory(definition);
        }
      }
      categories = await storage.getAllCategories();
      const categoryIds = new Map(categories.map((category) => [category.slug, category.id]));

      const editorialGuides = [
        {
          title: "Guía de viaje: prepara una escapada a Guatapé",
          slug: "guia-escapada-guatape",
          excerpt: "Ideas para organizar una visita al embalse y al pueblo, y confirmar servicios antes de salir.",
          content: "Guía editorial de AdventureConnect. Antes de viajar a Guatapé, revisa el transporte, los horarios de los operadores, el estado del tiempo y las condiciones de acceso a cada actividad. Confirma precios y disponibilidad directamente con los proveedores locales. Este contenido es orientativo y no representa una noticia de última hora.",
          imageUrl: "https://images.unsplash.com/photo-1583531352515-8884af319dc1?auto=format&fit=crop&w=1200&q=85",
          author: "Guía editorial AdventureConnect",
          categorySlug: "destinos-colombia",
          isFeatured: true,
        },
        {
          title: "Eje Cafetero: experiencias para conectar con la cultura local",
          slug: "experiencias-cultura-cafetera",
          excerpt: "Cómo explorar fincas, pueblos y paisajes con respeto por las comunidades anfitrionas.",
          content: "Guía editorial de AdventureConnect. Al visitar el Eje Cafetero, busca operadores autorizados, pregunta por el origen de las experiencias y reserva tiempo para conocer la historia de cada lugar. Los servicios, precios y horarios deben verificarse directamente con cada anfitrión.",
          imageUrl: "https://images.unsplash.com/photo-1518182170546-076c4f6e9e4b?auto=format&fit=crop&w=1200&q=85",
          author: "Guía editorial AdventureConnect",
          categorySlug: "cultura-local",
          isFeatured: true,
        },
        {
          title: "Viajar por áreas naturales de Colombia con responsabilidad",
          slug: "turismo-responsable-areas-naturales",
          excerpt: "Buenas prácticas para preparar recorridos, reducir residuos y respetar las normas locales.",
          content: "Guía editorial de AdventureConnect. Antes de visitar un parque o reserva, consulta las reglas oficiales, los cierres preventivos, los requisitos de ingreso y las recomendaciones de seguridad. No abandones senderos señalizados y evita contratar actividades que dañen la fauna o los ecosistemas.",
          imageUrl: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=85",
          author: "Guía editorial AdventureConnect",
          categorySlug: "turismo-sostenible",
          isFeatured: true,
        },
        {
          title: "Antes de salir: una lista útil para revisar tu ruta",
          slug: "lista-revision-ruta-viajera",
          excerpt: "Documentos, clima, transporte y contactos que conviene revisar antes de comenzar un trayecto.",
          content: "Guía editorial de AdventureConnect. Verifica las condiciones de las vías y el transporte con fuentes oficiales, lleva los documentos necesarios y comparte tu itinerario con una persona de confianza. Esta guía no sustituye avisos de tránsito en tiempo real.",
          imageUrl: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=85",
          author: "Guía editorial AdventureConnect",
          categorySlug: "movilidad-viajera",
          isFeatured: false,
        },
        {
          title: "Cómo planear una escapada alrededor de eventos locales",
          slug: "planear-escapada-eventos-locales",
          excerpt: "Organiza alojamiento y transporte con anticipación y confirma fechas en canales oficiales.",
          content: "Guía editorial de AdventureConnect. Las fechas y condiciones de festivales pueden cambiar. Confirma programación, entradas, aforo y recomendaciones de movilidad en los canales oficiales del organizador antes de comprar o desplazarte.",
          imageUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=85",
          author: "Guía editorial AdventureConnect",
          categorySlug: "eventos-colombia",
          isFeatured: false,
        },
      ];

      let created = 0;
      for (const item of editorialGuides) {
        if (await storage.getArticleBySlug(item.slug)) continue;
        const categoryId = categoryIds.get(item.categorySlug);
        if (!categoryId) continue;
        await storage.createArticle({
          title: item.title,
          slug: item.slug,
          excerpt: item.excerpt,
          content: item.content,
          imageUrl: item.imageUrl,
          author: item.author,
          categoryId,
          isFeatured: item.isFeatured,
          publishedAt: new Date(),
        });
        created += 1;
      }

      res.status(200).json({ message: "Editorial travel guides checked", created, contentType: "editorial-demo-not-live-news" });
    } catch (error) {
      console.error("Error seeding travel guides:", error);
      res.status(500).json({ message: "Error preparing editorial travel guides" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
