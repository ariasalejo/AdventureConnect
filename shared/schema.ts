import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  articleCount: integer("article_count").default(0),
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  slug: true,
  articleCount: true,
});

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  summary: text("summary").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url").notNull(),
  categoryId: integer("category_id").notNull(),
  authorId: integer("author_id").notNull(),
  authorName: text("author_name").notNull(),
  authorImageUrl: text("author_image_url").notNull(),
  featured: boolean("featured").default(false),
  publishedAt: timestamp("published_at").notNull().defaultNow(),
  readCount: integer("read_count").default(0),
});

export const insertArticleSchema = createInsertSchema(articles).pick({
  title: true,
  slug: true,
  summary: true,
  content: true,
  imageUrl: true,
  categoryId: true,
  authorId: true,
  authorName: true,
  authorImageUrl: true,
  featured: true,
  publishedAt: true,
  readCount: true,
});

export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type Article = typeof articles.$inferSelect;

export const workshops = pgTable("workshops", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  date: timestamp("date").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  price: integer("price").notNull(),
  availableSpots: integer("available_spots"),
  location: text("location").notNull(),
});

export const insertWorkshopSchema = createInsertSchema(workshops).pick({
  title: true,
  slug: true,
  description: true,
  imageUrl: true,
  date: true,
  startTime: true,
  endTime: true,
  price: true,
  availableSpots: true,
  location: true,
});

export type InsertWorkshop = z.infer<typeof insertWorkshopSchema>;
export type Workshop = typeof workshops.$inferSelect;

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  date: timestamp("date").notNull(),
  location: text("location").notNull(),
  price: text("price").notNull(),
  buttonText: text("button_text").notNull(),
  buttonAction: text("button_action").notNull(),
  borderColor: text("border_color").notNull(),
});

export const insertEventSchema = createInsertSchema(events).pick({
  title: true,
  description: true,
  date: true,
  location: true,
  price: true,
  buttonText: true,
  buttonAction: true,
  borderColor: true,
});

export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;

export const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
});

export const insertTagSchema = createInsertSchema(tags).pick({
  name: true,
  slug: true,
});

export type InsertTag = z.infer<typeof insertTagSchema>;
export type Tag = typeof tags.$inferSelect;

export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  subscribedAt: timestamp("subscribed_at").notNull().defaultNow(),
});

export const insertSubscriberSchema = createInsertSchema(subscribers).pick({
  name: true,
  email: true,
});

export type InsertSubscriber = z.infer<typeof insertSubscriberSchema>;
export type Subscriber = typeof subscribers.$inferSelect;
