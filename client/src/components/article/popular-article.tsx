import { Link } from "wouter";
import { Article } from "@shared/schema";

interface PopularArticleProps {
  article: Article;
  index: number;
}

export function PopularArticle({ article, index }: PopularArticleProps) {
  // Format the index to always have 2 digits
  const formattedIndex = index < 10 ? `0${index}` : index.toString();
  
  return (
    <div className="flex items-start space-x-3">
      <span className="font-heading font-bold text-xl text-primary">{formattedIndex}</span>
      <div>
        <h4 className="font-bold text-neutral-800 hover:text-primary">
          <Link href={`/articulo/${article.slug}`}>{article.title}</Link>
        </h4>
        <p className="text-xs text-neutral-500">{article.readCount.toLocaleString('es')} lecturas</p>
      </div>
    </div>
  );
}
