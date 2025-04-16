import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import ArticleCard from "@/components/home/ArticleCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import type { ArticleWithCategory } from "@shared/schema";

export default function SearchResultsPage() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split("?")[1] || "");
  const initialQuery = searchParams.get("q") || "";
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  
  const { data: articles, isLoading } = useQuery<ArticleWithCategory[]>({
    queryKey: ["/api/articles", { search: debouncedQuery }],
    enabled: debouncedQuery.length > 0,
  });
  
  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchQuery]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setDebouncedQuery(searchQuery);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-heading font-bold mb-6">Resultados de búsqueda</h1>
      
      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex max-w-2xl gap-2">
          <Input
            type="text"
            placeholder="Buscar noticias, temas o autores..."
            className="flex-grow"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button type="submit">
            <Search className="h-4 w-4 mr-2" />
            Buscar
          </Button>
        </form>
      </div>
      
      {debouncedQuery ? (
        <>
          <h2 className="text-xl font-semibold mb-6">
            {isLoading 
              ? "Buscando..." 
              : `Resultados para "${debouncedQuery}" (${articles?.length || 0})`}
          </h2>
          
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
          ) : articles && articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map(article => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-neutral-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">No se encontraron resultados</h3>
              <p className="text-neutral-500">
                No hay artículos que coincidan con tu búsqueda. Intenta con otros términos.
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 bg-neutral-50 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Realiza una búsqueda</h3>
          <p className="text-neutral-500">
            Ingresa términos de búsqueda para encontrar artículos.
          </p>
        </div>
      )}
    </div>
  );
}
