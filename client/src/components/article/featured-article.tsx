import { Link } from "wouter";
import { Article } from "@shared/schema";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface FeaturedArticleProps {
  article: Article;
}

export function FeaturedArticle({ article }: FeaturedArticleProps) {
  return (
    <div className="relative rounded-xl overflow-hidden shadow-lg">
      <img 
        src={article.imageUrl} 
        alt={article.title} 
        className="w-full h-[300px] md:h-[500px] object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
      <div className="absolute bottom-0 left-0 p-4 md:p-8 w-full">
        <span className="inline-block bg-[#ED8936] px-3 py-1 rounded-full text-white text-sm font-semibold mb-2">
          DESTACADO
        </span>
        <h1 className="text-2xl md:text-4xl font-heading font-bold text-white mb-2">
          {article.title}
        </h1>
        <p className="text-white text-sm md:text-base mb-2">
          {article.summary}
        </p>
        <div className="flex items-center text-white text-sm">
          <img src={article.authorImageUrl} alt={article.authorName} className="w-8 h-8 rounded-full mr-2" />
          <span>Por {article.authorName}</span>
          <span className="mx-2">•</span>
          <span>{format(new Date(article.publishedAt), "d MMMM yyyy", { locale: es })}</span>
          <div className="ml-auto flex space-x-2">
            <button className="hover:text-[#ED8936]">
              <i className="fas fa-share-alt"></i>
            </button>
            <button className="hover:text-[#ED8936]">
              <i className="far fa-bookmark"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
