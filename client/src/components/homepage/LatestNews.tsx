import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Article } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function LatestNews() {
  const [articlesLimit, setArticlesLimit] = useState(4);
  
  const { data: articles = [], isLoading } = useQuery<Article[]>({
    queryKey: ['/api/articles/latest', { limit: articlesLimit }],
  });

  const loadMore = () => {
    setArticlesLimit(prev => prev + 4);
  };

  if (isLoading) {
    return (
      <section className="lg:w-2/3">
        <div className="flex justify-between items-center mb-6">
          <h2 className="headline-font text-2xl font-bold">Últimas Noticias</h2>
        </div>
        <div className="space-y-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="lg:w-2/3">
      <div className="flex justify-between items-center mb-6">
        <h2 className="headline-font text-2xl font-bold">Últimas Noticias</h2>
        <Link href="/articulos">
          <a className="text-primary hover:underline font-medium text-sm">Ver todas</a>
        </Link>
      </div>
      
      <div className="space-y-6">
        {articles.map((article) => (
          <article key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <Link href={`/articulo/${article.id}`}>
              <a className="flex flex-col md:flex-row group">
                <div className="md:w-1/3">
                  <img 
                    src={article.imageUrl} 
                    alt={article.title} 
                    className="w-full h-48 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-2/3 p-4">
                  <span className="text-primary text-sm font-medium">
                    {/* Would need to fetch category name */}
                  </span>
                  <h3 className="headline-font text-xl font-bold mb-2 mt-1 group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-[#5F6368] mb-4 line-clamp-3">
                    {article.summary}
                  </p>
                  <div className="flex justify-between items-center text-xs text-[#5F6368]">
                    <span>Por {article.author} • {new Date(article.publishedAt).toLocaleDateString()}</span>
                    <div className="flex space-x-3">
                      <span className="flex items-center">
                        <i className="fas fa-comment mr-1"></i> {article.commentCount}
                      </span>
                      <span className="flex items-center">
                        <i className="fas fa-share-alt mr-1"></i> {article.shareCount}
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            </Link>
          </article>
        ))}
        
        <div className="text-center py-4">
          <Button 
            onClick={loadMore}
            variant="outline" 
            className="bg-white hover:bg-gray-100 text-primary font-medium py-2 px-6 rounded-full border border-gray-300 shadow-sm transition-colors"
          >
            Cargar más noticias
          </Button>
        </div>
      </div>
    </section>
  );
}
