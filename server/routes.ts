import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertArticleSchema, insertCategorySchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API prefix
  const apiPrefix = "/api";

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

  // Seed data endpoint (for demo purposes)
  app.post(`${apiPrefix}/seed`, async (req: Request, res: Response) => {
    try {
      // Create sample articles
      const sampleArticles = [
        {
          title: "Nueva reforma fiscal: Impacto en la economía nacional",
          slug: "nueva-reforma-fiscal",
          content: "El gobierno anuncia cambios significativos en la política fiscal que afectarán a diversos sectores de la economía. Los expertos anticipan que estas modificaciones podrían generar un aumento en la recaudación fiscal, pero también preocupaciones sobre posibles efectos en la inversión privada.",
          excerpt: "El gobierno anuncia cambios significativos en la política fiscal que afectarán a diversos sectores de la economía.",
          imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
          author: "Ana Martínez",
          categoryId: 1, // Política
          isFeatured: true,
          publishedAt: new Date()
        },
        {
          title: "Nuevos avances en innovación tecnológica",
          slug: "avances-innovacion-tecnologica",
          content: "Importantes empresas tecnológicas revelan avances significativos en inteligencia artificial y computación cuántica. Estos desarrollos prometen revolucionar múltiples industrias, desde la medicina hasta la logística global.",
          excerpt: "Nuevos desarrollos en IA prometen transformar industrias y cambiar la forma en que interactuamos con la tecnología.",
          imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          author: "Carlos Vega",
          categoryId: 4, // Tecnología
          isFeatured: true,
          publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000) // 5 hours ago
        },
        {
          title: "Comienza el campeonato mundial de fútbol",
          slug: "campeonato-mundial-futbol",
          content: "Las selecciones nacionales se preparan para el torneo más importante del mundo. Análisis de los equipos favoritos y las posibles sorpresas en esta edición del campeonato.",
          excerpt: "Las selecciones nacionales se preparan para el torneo más importante del mundo.",
          imageUrl: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          author: "David López",
          categoryId: 3, // Deportes
          isFeatured: true,
          publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
        },
        {
          title: "Crisis económica global: Análisis y perspectivas",
          slug: "crisis-economica-global",
          content: "Expertos analizan el impacto de la reciente crisis económica y ofrecen perspectivas sobre la recuperación global. Los mercados financieros muestran signos de volatilidad mientras los gobiernos implementan medidas de estímulo.",
          excerpt: "Expertos analizan el impacto de la reciente crisis económica y ofrecen perspectivas sobre la recuperación global.",
          imageUrl: "https://images.unsplash.com/photo-1607963412834-a1bbc693aef9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          author: "Elena Ramírez",
          categoryId: 2, // Economía
          isFeatured: false,
          publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
        },
        {
          title: "Avances revolucionarios en inteligencia artificial",
          slug: "avances-inteligencia-artificial",
          content: "Nuevos desarrollos en IA prometen transformar industrias y cambiar la forma en que interactuamos con la tecnología. Investigadores presentan modelos con capacidades de procesamiento de lenguaje natural nunca antes vistas.",
          excerpt: "Nuevos desarrollos en IA prometen transformar industrias y cambiar la forma en que interactuamos con la tecnología.",
          imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          author: "Pablo Herrera",
          categoryId: 4, // Tecnología
          isFeatured: false,
          publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
        },
        {
          title: "Comienzan las elecciones presidenciales en el país",
          slug: "elecciones-presidenciales",
          content: "Los ciudadanos acuden a las urnas para elegir al próximo presidente en unas elecciones históricas para el futuro del país. Se espera una alta participación en este proceso democrático clave.",
          excerpt: "Los ciudadanos acuden a las urnas para elegir al próximo presidente en unas elecciones históricas para el futuro del país.",
          imageUrl: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          author: "Laura Mendoza",
          categoryId: 1, // Política
          isFeatured: false,
          publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
        },
        {
          title: "Comienza el festival de cine internacional",
          slug: "festival-cine-internacional",
          content: "La ciudad acoge el prestigioso festival de cine con la participación de reconocidos directores y actores internacionales. Este año el festival presenta una selección de películas independientes que abordan temas sociales relevantes.",
          excerpt: "La ciudad acoge el prestigioso festival de cine con la participación de reconocidos directores y actores internacionales.",
          imageUrl: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          author: "Marta Jiménez",
          categoryId: 5, // Cultura
          isFeatured: false,
          publishedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000) // 9 days ago
        },
        {
          title: "Importante descubrimiento científico revoluciona la medicina",
          slug: "descubrimiento-cientifico",
          content: "Científicos logran un avance significativo que podría cambiar el tratamiento de diversas enfermedades crónicas. La nueva investigación representa un hito en la comprensión de los mecanismos celulares implicados en el desarrollo de patologías autoinmunes.",
          excerpt: "Científicos logran un avance significativo que podría cambiar el tratamiento de diversas enfermedades crónicas.",
          imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          author: "Dr. Javier Soto",
          categoryId: 7, // Ciencia
          isFeatured: false,
          publishedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000) // 12 days ago
        },
        {
          title: "Nuevo acuerdo comercial entre potencias mundiales",
          slug: "acuerdo-comercial-internacional",
          content: "Las principales economías del mundo firman un histórico acuerdo que modificará las relaciones comerciales globales. El tratado busca eliminar barreras arancelarias y promover una economía más interconectada y sostenible.",
          excerpt: "Las principales economías del mundo firman un histórico acuerdo que modificará las relaciones comerciales globales.",
          imageUrl: "https://images.unsplash.com/photo-1444653614773-995cb1ef9efa?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          author: "Roberto Torres",
          categoryId: 6, // Internacional
          isFeatured: false,
          publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) // 14 days ago
        },
        {
          title: "Reforma educativa: Cambios fundamentales en el sistema de enseñanza",
          slug: "reforma-educativa",
          content: "El nuevo plan educativo promete mejorar la calidad de la enseñanza y adaptarla a los desafíos del siglo XXI. Se incorporarán nuevas metodologías de aprendizaje y un mayor énfasis en habilidades digitales y pensamiento crítico.",
          excerpt: "El nuevo plan educativo promete mejorar la calidad de la enseñanza y adaptarla a los desafíos del siglo XXI.",
          imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          author: "Carmen Ortiz",
          categoryId: 1, // Política
          isFeatured: false,
          publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
        },
        {
          title: "Crisis hídrica: Regiones afectadas por la escasez de agua",
          slug: "crisis-hidrica",
          content: "Autoridades implementan medidas urgentes para enfrentar la creciente escasez de agua en diversas zonas del país. Expertos advierten que el cambio climático está intensificando los problemas de disponibilidad de recursos hídricos.",
          excerpt: "Autoridades implementan medidas urgentes para enfrentar la creciente escasez de agua en diversas zonas del país.",
          imageUrl: "https://images.unsplash.com/photo-1541252260730-0412e8e2d235?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          author: "Santiago Morales",
          categoryId: 6, // Internacional
          isFeatured: false,
          publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) // 4 days ago
        },
        {
          title: "Nuevas tecnologías revolucionan el mundo empresarial",
          slug: "nuevas-tecnologias-empresas",
          content: "La transformación digital impulsa cambios significativos en la forma de operar de las empresas modernas. La automatización de procesos y el análisis de datos se convierten en elementos clave para la competitividad en un mercado cada vez más exigente.",
          excerpt: "La transformación digital impulsa cambios significativos en la forma de operar de las empresas modernas.",
          imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          author: "Natalia Vargas",
          categoryId: 4, // Tecnología
          isFeatured: false,
          publishedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) // 6 days ago
        }
      ];

      for (const article of sampleArticles) {
        await storage.createArticle(article);
      }

      res.status(200).json({ message: "Sample data seeded successfully" });
    } catch (error) {
      console.error("Error seeding data:", error);
      res.status(500).json({ message: "Error seeding data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
