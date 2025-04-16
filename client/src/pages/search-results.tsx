import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Article, Category } from "@shared/schema";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Sidebar } from "@/components/sidebar/sidebar";
import { ArticleCard } from "@/components/article/article-card";
import { Button } from "@/components/ui/button";
import { Search } from "@/components/ui/search";

function useQueryParam() {
  const [location] = useLocation();
  return new URLSearchParams(location.split("?")[1]);
}

export default function SearchResultsPage() {
  const query = useQueryParam().get("q") || "";
  const [page, setPage] = useState(1);
  const ARTICLES_PER_PAGE = 5;
  
  const { data: searchResults, isLoading: isLoadingResults } = useQuery<Article[]>({
    queryKey: [`/api/search?q=${encodeURIComponent(query)}&limit=${page * ARTICLES_PER_PAGE}`],
    enabled: query.length > 0,
  });
  
  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });
  
  // Set the document title
  useEffect(() => {
    document.title = `Resultados para "${query}" - FameStream News`;
  }, [query]);
  
  const loadMoreResults = () => {
    setPage(prevPage => prevPage + 1);
  };
  
  const getCategoryName = (categoryId: number) => {
    return categories?.find(cat => cat.id === categoryId)?.name || "";
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-neutral-100 font-body text-neutral-800">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-6">
            Resultados para: "{query}"
          </h1>
          
          <div className="w-full md:w-2/3">
            <Search placeholder="Buscar de nuevo..." />
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content column */}
          <div className="lg:w-2/3">
            {isLoadingResults ? (
              Array(3).fill(0).map((_, index) => (
                <div key={index} className="h-48 bg-neutral-200 animate-pulse rounded-lg mb-6"></div>
              ))
            ) : searchResults && searchResults.length > 0 ? (
              <div className="space-y-6">
                <p className="text-neutral-600 mb-4">
                  Se encontraron {searchResults.length} resultado(s) para tu búsqueda.
                </p>
                
                {searchResults.map(article => (
                  <ArticleCard 
                    key={article.id} 
                    article={article} 
                    categoryName={getCategoryName(article.categoryId)} 
                  />
                ))}
                
                {searchResults.length >= page * ARTICLES_PER_PAGE && (
                  <div className="text-center mt-8">
                    <Button 
                      onClick={loadMoreResults}
                      className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
                    >
                      Cargar más resultados
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="font-heading font-bold text-xl mb-2">No se encontraron resultados</h2>
                <p>No hay artículos que coincidan con tu búsqueda. Intenta con otras palabras clave.</p>
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
