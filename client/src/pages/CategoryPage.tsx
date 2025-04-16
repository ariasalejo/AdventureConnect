import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Article, Category } from "@shared/schema";
import ArticleCard from "@/components/articles/ArticleCard";
import Sidebar from "@/components/homepage/Sidebar";
import { useEffect, useState } from "react";

export default function CategoryPage() {
  const { categorySlug } = useParams();
  const [page, setPage] = useState(1);
  const articlesPerPage = 8;

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: articles = [], isLoading } = useQuery<Article[]>({
    queryKey: [`/api/articles`, { category: categorySlug }],
  });

  const category = categories.find((cat) => cat.slug === categorySlug);

  // Reset page when category changes
  useEffect(() => {
    setPage(1);
  }, [categorySlug]);

  // Calculate pagination
  const totalPages = Math.ceil(articles.length / articlesPerPage);
  const displayedArticles = articles.slice(0, page * articlesPerPage);
  const hasMoreArticles = page < totalPages;

  const loadMore = () => {
    setPage((prev) => prev + 1);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="animate-pulse h-10 bg-gray-200 w-1/3 rounded-md mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="h-80 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="headline-font text-3xl font-bold mb-8">
        {category ? category.name : "Categoría no encontrada"}
      </h1>

      {articles.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg text-gray-600">No hay artículos en esta categoría</p>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {displayedArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>

            {hasMoreArticles && (
              <div className="text-center py-4">
                <button
                  onClick={loadMore}
                  className="bg-white hover:bg-gray-100 text-primary font-medium py-2 px-6 rounded-full border border-gray-300 shadow-sm transition-colors"
                >
                  Cargar más artículos
                </button>
              </div>
            )}
          </div>

          <Sidebar />
        </div>
      )}
    </div>
  );
}
