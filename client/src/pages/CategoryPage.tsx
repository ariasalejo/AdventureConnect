import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import CategoryFilter from "@/components/home/CategoryFilter";
import ArticleCard from "@/components/home/ArticleCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { ArticleWithCategory, Category } from "@shared/schema";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  
  const { data: category, isLoading: isCategoryLoading } = useQuery<Category>({
    queryKey: [`/api/categories/${slug}`],
  });
  
  const { data: articles, isLoading: isArticlesLoading } = useQuery<ArticleWithCategory[]>({
    queryKey: ["/api/articles", { category: slug }],
  });
  
  const isLoading = isCategoryLoading || isArticlesLoading;

  return (
    <div className="container mx-auto px-4 py-8">
      <CategoryFilter activeCategory={slug} />
      
      <div className="mb-8">
        {isCategoryLoading ? (
          <Skeleton className="h-10 w-64" />
        ) : (
          <h1 className="text-3xl font-heading font-bold">
            Noticias de {category?.name || "la categoría"}
          </h1>
        )}
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(9).fill(null).map((_, index) => (
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
      ) : articles && articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map(article => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">No hay artículos</h2>
          <p className="text-neutral-500">
            No se encontraron artículos en esta categoría. Intenta con otra categoría.
          </p>
        </div>
      )}
    </div>
  );
}
