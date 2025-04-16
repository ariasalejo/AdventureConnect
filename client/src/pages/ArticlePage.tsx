import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import ArticleDetail from "@/components/article/ArticleDetail";
import ArticleCard from "@/components/home/ArticleCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { ArticleWithCategory } from "@shared/schema";

export default function ArticlePage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const [location] = useLocation();
  
  // Handling special routes
  if (slug === "nuevos") {
    return <NewArticlesPage />;
  }
  
  if (slug === "populares") {
    return <PopularArticlesPage />;
  }

  return (
    <div>
      <ArticleDetail slug={slug} />
      
      {/* Related Articles Section */}
      <section className="container mx-auto px-4 py-8 mb-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-heading font-bold mb-6">Artículos Relacionados</h2>
          <RelatedArticles currentSlug={slug} />
        </div>
      </section>
    </div>
  );
}

function RelatedArticles({ currentSlug }: { currentSlug: string }) {
  const { data: article } = useQuery<ArticleWithCategory>({
    queryKey: [`/api/articles/${currentSlug}`],
  });
  
  const { data: relatedArticles, isLoading } = useQuery<ArticleWithCategory[]>({
    queryKey: ["/api/articles", { category: article?.category.slug }],
    enabled: !!article?.category.slug,
  });
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(3).fill(null).map((_, index) => (
          <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm">
            <Skeleton className="w-full h-48" />
            <div className="p-4">
              <Skeleton className="w-20 h-4 mb-2" />
              <Skeleton className="w-full h-6 mb-2" />
              <Skeleton className="w-full h-4 mb-4" />
              <div className="flex justify-between">
                <Skeleton className="w-20 h-4" />
                <Skeleton className="w-20 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (!relatedArticles || relatedArticles.length === 0) {
    return <p className="text-neutral-500">No hay artículos relacionados disponibles.</p>;
  }
  
  const filteredArticles = relatedArticles
    .filter(article => article.slug !== currentSlug)
    .slice(0, 3);
  
  if (filteredArticles.length === 0) {
    return <p className="text-neutral-500">No hay artículos relacionados disponibles.</p>;
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {filteredArticles.map(article => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}

function NewArticlesPage() {
  const { data: latestArticles, isLoading } = useQuery<ArticleWithCategory[]>({
    queryKey: ["/api/articles", { latest: true, limit: 12 }],
  });
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-heading font-bold mb-8">Noticias Más Recientes</h1>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(12).fill(null).map((_, index) => (
            <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm">
              <Skeleton className="w-full h-48" />
              <div className="p-4">
                <Skeleton className="w-20 h-4 mb-2" />
                <Skeleton className="w-full h-6 mb-2" />
                <Skeleton className="w-full h-4 mb-4" />
                <div className="flex justify-between">
                  <Skeleton className="w-20 h-4" />
                  <Skeleton className="w-20 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestArticles?.map(article => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}

function PopularArticlesPage() {
  const { data: popularArticles, isLoading } = useQuery<ArticleWithCategory[]>({
    queryKey: ["/api/articles", { popular: true, limit: 12 }],
  });
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-heading font-bold mb-8">Noticias Más Populares</h1>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(12).fill(null).map((_, index) => (
            <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm">
              <Skeleton className="w-full h-48" />
              <div className="p-4">
                <Skeleton className="w-20 h-4 mb-2" />
                <Skeleton className="w-full h-6 mb-2" />
                <Skeleton className="w-full h-4 mb-4" />
                <div className="flex justify-between">
                  <Skeleton className="w-20 h-4" />
                  <Skeleton className="w-20 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularArticles?.map(article => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
