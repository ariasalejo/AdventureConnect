import { useParams } from "wouter";
import ArticleDetail from "@/components/articles/ArticleDetail";
import Sidebar from "@/components/homepage/Sidebar";
import { useQuery } from "@tanstack/react-query";
import { Article } from "@shared/schema";
import ArticleCard from "@/components/articles/ArticleCard";

export default function ArticlePage() {
  const { articleId } = useParams();
  
  // Get related articles (latest articles excluding current one)
  const { data: latestArticles = [] } = useQuery<Article[]>({
    queryKey: ['/api/articles/latest', { limit: 6 }],
  });

  const relatedArticles = latestArticles.filter(article => article.id !== Number(articleId)).slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <ArticleDetail articleId={Number(articleId)} />
          
          {/* Related articles */}
          {relatedArticles.length > 0 && (
            <div className="mt-12">
              <h3 className="headline-font text-2xl font-bold mb-6">Artículos relacionados</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticles.map(article => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="lg:w-1/3 mt-6 lg:mt-0">
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
