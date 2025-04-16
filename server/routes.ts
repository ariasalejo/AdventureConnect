import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertArticleSchema, insertNewsletterSchema, insertCategorySchema, insertBreakingNewsSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes for Categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Error fetching categories" });
    }
  });

  app.post("/api/categories", async (req, res) => {
    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validatedData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid category data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error creating category" });
      }
    }
  });

  // API Routes for Articles
  app.get("/api/articles", async (req, res) => {
    try {
      const { category, limit, featured } = req.query;
      
      let articles;
      if (category) {
        articles = await storage.getArticlesByCategory(category as string);
      } else if (featured === 'true') {
        articles = await storage.getFeaturedArticles();
      } else {
        articles = await storage.getAllArticles(Number(limit) || undefined);
      }
      
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Error fetching articles" });
    }
  });

  app.get("/api/articles/popular", async (req, res) => {
    try {
      const limit = Number(req.query.limit) || 5;
      const articles = await storage.getPopularArticles(limit);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Error fetching popular articles" });
    }
  });

  app.get("/api/articles/latest", async (req, res) => {
    try {
      const limit = Number(req.query.limit) || 4;
      const articles = await storage.getLatestArticles(limit);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Error fetching latest articles" });
    }
  });

  app.get("/api/articles/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      const articles = await storage.searchArticles(query);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Error searching articles" });
    }
  });

  app.get("/api/articles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const article = await storage.getArticle(id);
      
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      
      res.json(article);
    } catch (error) {
      res.status(500).json({ message: "Error fetching article" });
    }
  });

  app.post("/api/articles", async (req, res) => {
    try {
      const validatedData = insertArticleSchema.parse(req.body);
      const article = await storage.createArticle(validatedData);
      res.status(201).json(article);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid article data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error creating article" });
      }
    }
  });

  // API Routes for Breaking News
  app.get("/api/breaking-news", async (req, res) => {
    try {
      const breakingNews = await storage.getActiveBreakingNews();
      res.json(breakingNews);
    } catch (error) {
      res.status(500).json({ message: "Error fetching breaking news" });
    }
  });

  app.post("/api/breaking-news", async (req, res) => {
    try {
      const validatedData = insertBreakingNewsSchema.parse(req.body);
      const news = await storage.createBreakingNews(validatedData);
      res.status(201).json(news);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid breaking news data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error creating breaking news" });
      }
    }
  });

  // API Route for Newsletter Subscription
  app.post("/api/newsletter", async (req, res) => {
    try {
      const validatedData = insertNewsletterSchema.parse(req.body);
      const subscription = await storage.subscribeToNewsletter(validatedData);
      res.status(201).json({ message: "Subscription successful", subscription });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid email", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error subscribing to newsletter" });
      }
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);
  return httpServer;
}
