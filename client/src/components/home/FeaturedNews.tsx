import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { MessageSquare } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatTimeAgo } from "@/lib/utils";
import type { ArticleWithCategory } from "@shared/schema";

export default function FeaturedNews() {
  const { data: featuredArticles, isLoading } = useQuery<ArticleWithCategory[]>({
    queryKey: ["/api/articles"],
    queryFn: () => fetch("/api/articles?featured=true").then(res => res.json()),
  });

  if (isLoading) {
    return (
      <section className="mb-12">
        <h2 className="sr-only">Noticias Destacadas</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Featured Skeleton */}
          <div className="lg:col-span-2 relative rounded-xl overflow-hidden h-[400px] lg:h-[500px] bg-neutral-100"></div>
          
          {/* Secondary Featured Skeletons */}
          <div className="space-y-6">
            <div className="relative rounded-xl overflow-hidden h-[240px] bg-neutral-100"></div>
            <div className="relative rounded-xl overflow-hidden h-[240px] bg-neutral-100"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!featuredArticles || featuredArticles.length === 0) {
    return null;
  }

  // Main featured article is the first one
  const mainArticle = featuredArticles[0];
  
  // Secondary featured articles are the next two (if they exist)
  const secondaryArticles = featuredArticles.slice(1, 3);

  return (
    <section className="mb-12">
      <h2 className="sr-only">Noticias Destacadas</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Featured Article */}
        <div className="lg:col-span-2 relative rounded-xl overflow-hidden h-[400px] lg:h-[500px] transition-all hover:shadow-lg">
          <Link href={`/articulo/${mainArticle.slug}`}>
            <a className="block h-full">
              <div className="absolute inset-0">
                <img 
                  src={mainArticle.imageUrl}
                  alt={mainArticle.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
              </div>
              <div className="absolute bottom-0 left-0 p-6 text-white">
                <span className="bg-primary px-2 py-1 text-xs font-bold rounded uppercase mb-3 inline-block">
                  {mainArticle.category.name}
                </span>
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold mb-2 text-shadow">
                  {mainArticle.title}
                </h3>
                <p className="mb-2 text-sm md:text-base line-clamp-2 text-neutral-100">
                  {mainArticle.excerpt}
                </p>
                <div className="flex items-center text-sm">
                  <span>Por: {mainArticle.author}</span>
                  <span className="mx-2">•</span>
                  <span>{formatTimeAgo(new Date(mainArticle.publishedAt))}</span>
                  <span className="mx-2">•</span>
                  <span className="flex items-center">
                    <MessageSquare className="mr-1 h-4 w-4" /> {mainArticle.viewCount}
                  </span>
                </div>
              </div>
            </a>
          </Link>
        </div>

        {/* Secondary Featured Articles */}
        <div className="space-y-6">
          {secondaryArticles.map((article) => (
            <div key={article.id} className="relative rounded-xl overflow-hidden h-[240px] transition-all hover:shadow-lg">
              <Link href={`/articulo/${article.slug}`}>
                <a className="block h-full">
                  <div className="absolute inset-0">
                    <img 
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                  </div>
                  <div className="absolute bottom-0 left-0 p-4 text-white">
                    <span className="bg-primary px-2 py-1 text-xs font-bold rounded uppercase mb-2 inline-block">
                      {article.category.name}
                    </span>
                    <h3 className="text-xl font-heading font-bold mb-1 text-shadow">
                      {article.title}
                    </h3>
                    <div className="flex items-center text-xs">
                      <span>Por: {article.author}</span>
                      <span className="mx-2">•</span>
                      <span>{formatTimeAgo(new Date(article.publishedAt))}</span>
                    </div>
                  </div>
                </a>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
