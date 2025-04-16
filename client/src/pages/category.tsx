import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Article, Category } from "@shared/schema";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Sidebar } from "@/components/sidebar/sidebar";
import { ArticleCard } from "@/components/article/article-card";
import { Button } from "@/components/ui/button";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState(1);
  const ARTICLES_PER_PAGE = 5;
  
  const { data: categories, isLoading: isLoadingCategories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });
  
  const category = categories?.find(cat => cat.slug === slug);
  
  const { data: articles, isLoading: isLoadingArticles } = useQuery<Article[]>({
    queryKey: [`/api/categories/${category?.id}/articles`, { limit: page * ARTICLES_PER_PAGE }],
    enabled: !!category,
  });
  
  // Set the document title
  useEffect(() => {
    if (category) {
      document.title = `${category.name} - FameStream News`;
    } else {
      document.title = "Categoría - FameStream News";
    }
  }, [category]);
  
  const loadMoreArticles = () => {
    setPage(prevPage => prevPage + 1);
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-neutral-100 font-body text-neutral-800">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-heading font-bold">
            {isLoadingCategories ? "Cargando categoría..." : category ? category.name : "Categoría no encontrada"}
          </h1>
          {category && (
            <p className="text-neutral-600 mt-2">
              Artículos relacionados con {category.name.toLowerCase()}
            </p>
          )}
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content column */}
          <div className="lg:w-2/3">
            {isLoadingArticles ? (
              Array(3).fill(0).map((_, index) => (
                <div key={index} className="h-48 bg-neutral-200 animate-pulse rounded-lg mb-6"></div>
              ))
            ) : articles && articles.length > 0 ? (
              <div className="space-y-6">
                {articles.map(article => (
                  <ArticleCard key={article.id} article={article} categoryName={category?.name} />
                ))}
                
                {articles.length >= page * ARTICLES_PER_PAGE && (
                  <div className="text-center mt-8">
                    <Button 
                      onClick={loadMoreArticles}
                      className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
                    >
                      Cargar más artículos
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="font-heading font-bold text-xl mb-2">No hay artículos disponibles</h2>
                <p>Aún no hay artículos publicados en esta categoría.</p>
              </div>
            )}
          </div>
          
          {/* Sidebar column */}
          <div className="lg:w-1/3">
            <Sidebar />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
