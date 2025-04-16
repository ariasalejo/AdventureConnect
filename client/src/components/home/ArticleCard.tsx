import { Link } from "wouter";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import ShareButtons from "@/components/common/ShareButtons";
import type { ArticleWithCategory } from "@shared/schema";

interface ArticleCardProps {
  article: ArticleWithCategory;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all">
      <Link href={`/articulo/${article.slug}`}>
        <a className="block">
          <img 
            src={article.imageUrl} 
            alt={article.title}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <span className="text-xs font-semibold text-primary uppercase">{article.category.name}</span>
            <h3 className="text-lg font-heading font-bold mt-1 mb-2 hover:text-primary transition-colors">{article.title}</h3>
            <p className="text-neutral-600 text-sm line-clamp-2 mb-3">{article.excerpt}</p>
            <div className="flex justify-between items-center text-xs text-neutral-400">
              <span>{format(new Date(article.publishedAt), 'd MMM yyyy', { locale: es })}</span>
              <ShareButtons 
                title={article.title} 
                url={`/articulo/${article.slug}`} 
              />
            </div>
          </div>
        </a>
      </Link>
    </article>
  );
}
