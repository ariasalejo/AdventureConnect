import { Link } from "wouter";
import { Article } from "@shared/schema";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface ArticleCardProps {
  article: Article;
  categoryName?: string;
}

export function ArticleCard({ article, categoryName }: ArticleCardProps) {
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col md:flex-row">
      <div className="md:w-1/3">
        <img 
          src={article.imageUrl} 
          alt={article.title} 
          className="w-full h-48 md:h-full object-cover"
        />
      </div>
      <div className="md:w-2/3 p-4">
        <div className="flex items-center mb-2">
          <span className="bg-primary bg-opacity-20 text-primary text-xs font-semibold px-2 py-1 rounded">
            {categoryName || "Noticia"}
          </span>
          <span className="text-neutral-500 text-sm ml-auto">
            {format(new Date(article.publishedAt), "d MMM, yyyy", { locale: es })}
          </span>
        </div>
        <h3 className="font-heading font-bold text-lg mb-2">{article.title}</h3>
        <p className="text-neutral-600 text-sm mb-3 line-clamp-2">{article.summary}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img src={article.authorImageUrl} alt={article.authorName} className="w-8 h-8 rounded-full mr-2" />
            <span className="text-sm text-neutral-700">{article.authorName}</span>
          </div>
          <Link href={`/articulo/${article.slug}`} className="text-primary font-semibold text-sm hover:underline">
            Leer más
          </Link>
        </div>
      </div>
    </article>
  );
}
