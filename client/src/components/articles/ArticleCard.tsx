import { Link } from "wouter";
import { Article } from "@shared/schema";

interface ArticleCardProps {
  article: Article;
  variant?: "horizontal" | "vertical" | "featured";
}

export default function ArticleCard({ article, variant = "vertical" }: ArticleCardProps) {
  if (variant === "horizontal") {
    return (
      <article className="bg-white rounded-lg shadow-md overflow-hidden">
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
              <h3 className="headline-font text-xl font-bold mb-2 group-hover:text-primary transition-colors">
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
    );
  }

  if (variant === "featured") {
    return (
      <article className="mb-8">
        <Link href={`/articulo/${article.id}`}>
          <a className="block group">
            <div className="rounded-lg overflow-hidden shadow-lg bg-white">
              <div className="relative">
                <img 
                  src={article.imageUrl} 
                  alt={article.title} 
                  className="w-full h-56 md:h-96 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {article.isBreakingNews && (
                  <div className="absolute top-0 left-0 bg-[#E63946] text-white px-3 py-1 m-3 text-sm font-medium rounded">
                    ÚLTIMA HORA
                  </div>
                )}
              </div>
              <div className="p-4 md:p-6">
                <h3 className="headline-font text-xl md:text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
                <p className="text-[#5F6368] mb-3 line-clamp-3">
                  {article.summary}
                </p>
                <div className="flex justify-between items-center text-xs text-[#5F6368]">
                  <span>Por {article.author} • {new Date(article.publishedAt).toLocaleDateString()}</span>
                  <span className="flex items-center">
                    <i className="fas fa-clock mr-1"></i> {article.readTime} min lectura
                  </span>
                </div>
              </div>
            </div>
          </a>
        </Link>
      </article>
    );
  }

  // Default vertical card
  return (
    <article>
      <Link href={`/articulo/${article.id}`}>
        <a className="block group">
          <div className="rounded-lg overflow-hidden shadow-lg bg-white h-full">
            <img 
              src={article.imageUrl} 
              alt={article.title} 
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="headline-font text-lg font-bold mb-2 group-hover:text-primary transition-colors">
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
  );
}
