import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertArticleSchema, 
  insertWorkshopSchema, 
  insertEventSchema, 
  insertSubscriberSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Categories routes
  app.get("/api/categories", async (req, res) => {
    const categories = await storage.getAllCategories();
    res.json(categories);
  });

  app.get("/api/categories/:slug", async (req, res) => {
    const { slug } = req.params;
    const category = await storage.getCategoryBySlug(slug);
    
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    
    res.json(category);
  });

  // Articles routes
  app.get("/api/articles", async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
    
    const articles = await storage.getAllArticles(limit, offset);
    res.json(articles);
  });

  app.get("/api/articles/featured", async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 1;
    const featuredArticles = await storage.getFeaturedArticles(limit);
    res.json(featuredArticles);
  });

  app.get("/api/articles/latest", async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 3;
    const latestArticles = await storage.getLatestArticles(limit);
    res.json(latestArticles);
  });

  app.get("/api/articles/popular", async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
    const popularArticles = await storage.getPopularArticles(limit);
    res.json(popularArticles);
  });

  app.get("/api/articles/:slug", async (req, res) => {
    const { slug } = req.params;
    const article = await storage.getArticleBySlug(slug);
    
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    
    // Increment read count
    await storage.incrementArticleReadCount(article.id);
    
    res.json(article);
  });

  app.get("/api/categories/:categoryId/articles", async (req, res) => {
    const categoryId = parseInt(req.params.categoryId);
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
    
    const articles = await storage.getArticlesByCategory(categoryId, limit, offset);
    res.json(articles);
  });

  app.post("/api/articles", async (req, res) => {
    try {
      const articleData = insertArticleSchema.parse(req.body);
      const article = await storage.createArticle(articleData);
      res.status(201).json(article);
    } catch (error) {
      res.status(400).json({ message: "Invalid article data", error });
    }
  });

  // Workshops routes
  app.get("/api/workshops", async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const workshops = await storage.getAllWorkshops(limit);
    res.json(workshops);
  });

  app.get("/api/workshops/featured", async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 3;
    const featuredWorkshops = await storage.getFeaturedWorkshops(limit);
    res.json(featuredWorkshops);
  });

  app.get("/api/workshops/:slug", async (req, res) => {
    const { slug } = req.params;
    const workshop = await storage.getWorkshopBySlug(slug);
    
    if (!workshop) {
      return res.status(404).json({ message: "Workshop not found" });
    }
    
    res.json(workshop);
  });

  app.post("/api/workshops", async (req, res) => {
    try {
      const workshopData = insertWorkshopSchema.parse(req.body);
      const workshop = await storage.createWorkshop(workshopData);
      res.status(201).json(workshop);
    } catch (error) {
      res.status(400).json({ message: "Invalid workshop data", error });
    }
  });

  // Events routes
  app.get("/api/events", async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const events = await storage.getAllEvents(limit);
    res.json(events);
  });

  app.get("/api/events/upcoming", async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 4;
    const upcomingEvents = await storage.getUpcomingEvents(limit);
    res.json(upcomingEvents);
  });

  app.post("/api/events", async (req, res) => {
    try {
      const eventData = insertEventSchema.parse(req.body);
      const event = await storage.createEvent(eventData);
      res.status(201).json(event);
    } catch (error) {
      res.status(400).json({ message: "Invalid event data", error });
    }
  });

  // Tags routes
  app.get("/api/tags", async (req, res) => {
    const tags = await storage.getAllTags();
    res.json(tags);
  });

  app.get("/api/tags/popular", async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const popularTags = await storage.getPopularTags(limit);
    res.json(popularTags);
  });

  // Search route
  app.get("/api/search", async (req, res) => {
    const query = req.query.q as string;
    
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }
    
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const results = await storage.searchArticles(query, limit);
    
    res.json(results);
  });

  // Subscribers route
  app.post("/api/subscribers", async (req, res) => {
    try {
      const subscriberData = insertSubscriberSchema.parse(req.body);
      const subscriber = await storage.createSubscriber(subscriberData);
      res.status(201).json(subscriber);
    } catch (error) {
      res.status(400).json({ message: "Invalid subscriber data", error });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
