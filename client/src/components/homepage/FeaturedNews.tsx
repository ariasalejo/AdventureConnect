import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Article } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export default function FeaturedNews() {
  const { data: articles = [], isLoading } = useQuery<Article[]>({
    queryKey: ['/api/articles', { featured: true }],
  });

  if (isLoading) {
    return (
      <section className="mb-10">
        <h2 className="headline-font text-2xl md:text-3xl font-bold mb-6">Noticias Destacadas</h2>
        <div className="animate-pulse bg-gray-200 h-96 w-full rounded-lg mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-gray-200 h-80 rounded-lg"></div>
          ))}
        </div>
      </section>
    );
  }

  const mainArticle = articles[0];
  const secondaryArticles = articles.slice(1, 4);

  return (
    <section className="mb-10">
      <h2 className="headline-font text-2xl md:text-3xl font-bold mb-6">Noticias Destacadas</h2>
      
      {/* Main featured article */}
      {mainArticle && (
        <article className="mb-8">
          <Link href={`/articulo/${mainArticle.id}`}>
            <a className="block group">
              <div className="rounded-lg overflow-hidden shadow-lg bg-white">
                <div className="relative">
                  <img 
                    src={mainArticle.imageUrl} 
                    alt={mainArticle.title} 
                    className="w-full h-56 md:h-96 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {mainArticle.isBreakingNews && (
                    <div className="absolute top-0 left-0 bg-[#E63946] text-white px-3 py-1 m-3 text-sm font-medium rounded">
                      ÚLTIMA HORA
                    </div>
                  )}
                </div>
                <div className="p-4 md:p-6">
                  <h3 className="headline-font text-xl md:text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {mainArticle.title}
                  </h3>
                  <p className="text-[#5F6368] mb-3 line-clamp-3">
                    {mainArticle.summary}
                  </p>
                  <div className="flex justify-between items-center text-xs text-[#5F6368]">
                    <span>Por {mainArticle.author} • {new Date(mainArticle.publishedAt).toLocaleDateString()}</span>
                    <span className="flex items-center">
                      <i className="fas fa-clock mr-1"></i> {mainArticle.readTime} min lectura
                    </span>
                  </div>
                </div>
              </div>
            </a>
          </Link>
        </article>
      )}
      
      {/* Secondary featured articles grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {secondaryArticles.map((article) => (
          <article key={article.id}>
            <Link href={`/articulo/${article.id}`}>
              <a className="block group">
                <div className="rounded-lg overflow-hidden shadow-lg bg-white h-full">
                  <img 
                    src={article.imageUrl} 
                    alt={article.title} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <span className="text-primary text-sm font-medium">
                      {/* Would need to fetch category name if needed */}
                    </span>
                    <h3 className="headline-font text-lg font-bold mb-2 mt-1 group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-[#5F6368] mb-3 text-sm line-clamp-2">
                      {article.summary}
                    </p>
                    <div className="text-xs text-[#5F6368]">
                      {new Date(article.publishedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </a>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
