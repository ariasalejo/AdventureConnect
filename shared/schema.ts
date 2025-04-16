import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Categories
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  slug: true,
});

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

// Articles
export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  summary: text("summary").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url").notNull(),
  author: text("author").notNull(),
  publishedAt: timestamp("published_at").notNull().defaultNow(),
  categoryId: integer("category_id").notNull(),
  isFeatured: boolean("is_featured").default(false),
  isBreakingNews: boolean("is_breaking_news").default(false),
  readTime: integer("read_time").default(5),
  commentCount: integer("comment_count").default(0),
  shareCount: integer("share_count").default(0),
  tags: json("tags").$type<string[]>().default([]),
});

export const insertArticleSchema = createInsertSchema(articles).pick({
  title: true,
  slug: true,
  summary: true,
  content: true,
  imageUrl: true,
  author: true,
  publishedAt: true,
  categoryId: true,
  isFeatured: true,
  isBreakingNews: true,
  readTime: true,
  commentCount: true,
  shareCount: true,
  tags: true,
});

export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type Article = typeof articles.$inferSelect;

// Breaking News
export const breakingNews = pgTable("breaking_news", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  isActive: boolean("is_active").default(true),
});

export const insertBreakingNewsSchema = createInsertSchema(breakingNews).pick({
  content: true,
  isActive: true,
});

export type InsertBreakingNews = z.infer<typeof insertBreakingNewsSchema>;
export type BreakingNews = typeof breakingNews.$inferSelect;

// Users (basic schema for newsletter subscription)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  isSubscribed: boolean("is_subscribed").default(false),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  isSubscribed: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Newsletter subscriptions (for non-users)
export const newsletters = pgTable("newsletters", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertNewsletterSchema = createInsertSchema(newsletters).pick({
  email: true,
});

export type InsertNewsletter = z.infer<typeof insertNewsletterSchema>;
export type Newsletter = typeof newsletters.$inferSelect;
