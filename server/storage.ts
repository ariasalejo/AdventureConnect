import { 
  articles, type Article, type InsertArticle,
  categories, type Category, type InsertCategory,
  users, type User, type InsertUser,
  type ArticleWithCategory
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Category methods
  getAllCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Article methods
  getAllArticles(): Promise<ArticleWithCategory[]>;
  getArticleBySlug(slug: string): Promise<ArticleWithCategory | undefined>;
  getArticlesByCategory(categorySlug: string): Promise<ArticleWithCategory[]>;
  getFeaturedArticles(): Promise<ArticleWithCategory[]>;
  getLatestArticles(limit?: number): Promise<ArticleWithCategory[]>;
  getPopularArticles(limit?: number): Promise<ArticleWithCategory[]>;
  searchArticles(query: string): Promise<ArticleWithCategory[]>;
  createArticle(article: InsertArticle): Promise<Article>;
  incrementArticleViews(id: number): Promise<Article>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private articles: Map<number, Article>;
  private currentUserId: number;
  private currentCategoryId: number;
  private currentArticleId: number;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.articles = new Map();
    this.currentUserId = 1;
    this.currentCategoryId = 1;
    this.currentArticleId = 1;
    
    // Initialize with some categories
    this.seedCategories();
  }

  private seedCategories() {
    const defaultCategories: InsertCategory[] = [
      { name: "Política", slug: "politica" },
      { name: "Economía", slug: "economia" },
      { name: "Deportes", slug: "deportes" },
      { name: "Tecnología", slug: "tecnologia" },
      { name: "Cultura", slug: "cultura" },
      { name: "Internacional", slug: "internacional" },
      { name: "Ciencia", slug: "ciencia" }
    ];
    
    for (const category of defaultCategories) {
      this.createCategory(category);
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Category methods
  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }
  
  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(
      (category) => category.slug === slug,
    );
  }
  
  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.currentCategoryId++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }
  
  // Article methods
  async getAllArticles(): Promise<ArticleWithCategory[]> {
    return Array.from(this.articles.values())
      .map(article => this.attachCategory(article))
      .filter((article): article is ArticleWithCategory => article.category !== undefined)
      .sort((a, b) => 
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
  }
  
  async getArticleBySlug(slug: string): Promise<ArticleWithCategory | undefined> {
    const article = Array.from(this.articles.values()).find(
      (article) => article.slug === slug,
    );
    
    if (!article) return undefined;
    
    return this.attachCategory(article);
  }
  
  async getArticlesByCategory(categorySlug: string): Promise<ArticleWithCategory[]> {
    const category = await this.getCategoryBySlug(categorySlug);
    if (!category) return [];
    
    return Array.from(this.articles.values())
      .filter(article => article.categoryId === category.id)
      .map(article => this.attachCategory(article))
      .filter((article): article is ArticleWithCategory => article.category !== undefined)
      .sort((a, b) => 
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
  }
  
  async getFeaturedArticles(): Promise<ArticleWithCategory[]> {
    return Array.from(this.articles.values())
      .filter(article => article.isFeatured)
      .map(article => this.attachCategory(article))
      .filter((article): article is ArticleWithCategory => article.category !== undefined)
      .sort((a, b) => 
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
  }
  
  async getLatestArticles(limit: number = 6): Promise<ArticleWithCategory[]> {
    return Array.from(this.articles.values())
      .map(article => this.attachCategory(article))
      .filter((article): article is ArticleWithCategory => article.category !== undefined)
      .sort((a, b) => 
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      )
      .slice(0, limit);
  }
  
  async getPopularArticles(limit: number = 6): Promise<ArticleWithCategory[]> {
    return Array.from(this.articles.values())
      .map(article => this.attachCategory(article))
      .filter((article): article is ArticleWithCategory => article.category !== undefined)
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, limit);
  }
  
  async searchArticles(query: string): Promise<ArticleWithCategory[]> {
    const searchTerms = query.toLowerCase().split(" ");
    
    return Array.from(this.articles.values())
      .filter(article => {
        const titleLower = article.title.toLowerCase();
        const contentLower = article.content.toLowerCase();
        return searchTerms.some(term => 
          titleLower.includes(term) || contentLower.includes(term)
        );
      })
      .map(article => this.attachCategory(article))
      .filter((article): article is ArticleWithCategory => article.category !== undefined)
      .sort((a, b) => 
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
  }
  
  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const id = this.currentArticleId++;
    const article: Article = { 
      ...insertArticle, 
      id,
      viewCount: 0,
      createdAt: new Date()
    };
    this.articles.set(id, article);
    return article;
  }
  
  async incrementArticleViews(id: number): Promise<Article> {
    const article = this.articles.get(id);
    if (!article) throw new Error(`Article with id ${id} not found`);
    
    const updatedArticle = { ...article, viewCount: article.viewCount + 1 };
    this.articles.set(id, updatedArticle);
    return updatedArticle;
  }
  
  // Helper method to attach category to articles
  private attachCategory(article: Article): ArticleWithCategory | Article {
    const category = this.categories.get(article.categoryId);
    if (!category) return article;
    
    return { ...article, category };
  }
}

export const storage = new MemStorage();
