import { useQuery } from "@tanstack/react-query";
import CategoryFilter from "@/components/home/CategoryFilter";
import FeaturedNews from "@/components/home/FeaturedNews";
import ArticleCard from "@/components/home/ArticleCard";
import PopularNewsSection from "@/components/home/PopularNewsSection";
import NewsletterSection from "@/components/home/NewsletterSection";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { ArticleWithCategory } from "@shared/schema";

export default function HomePage() {
  const { data: latestArticles, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = 
    useQuery<ArticleWithCategory[]>({
      queryKey: ["/api/articles", { latest: true, limit: 6 }],
    });

  const handleLoadMore = () => {
    fetchNextPage();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <CategoryFilter />
      <FeaturedNews />
      
      {/* Latest News Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-heading font-bold">Últimas Noticias</h2>
          <a href="#" className="text-primary hover:underline font-semibold text-sm">Ver todas <span aria-hidden="true">→</span></a>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(null).map((_, index) => (
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
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestArticles?.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>

            {/* Load More Button */}
            <div className="text-center mt-8">
              <Button
                variant="outline"
                onClick={handleLoadMore}
                disabled={!hasNextPage || isFetchingNextPage}
                className="border border-primary text-primary hover:bg-primary hover:text-white px-6 py-2 rounded-full font-semibold transition-colors"
              >
                {isFetchingNextPage
                  ? "Cargando..."
                  : hasNextPage
                  ? "Cargar más noticias"
                  : "No hay más noticias"}
              </Button>
            </div>
          </>
        )}
      </section>

      <PopularNewsSection />
      <NewsletterSection />
    </div>
  );
}
