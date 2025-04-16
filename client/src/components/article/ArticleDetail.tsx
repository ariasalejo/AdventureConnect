import { useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon, Clock, User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import ShareButtons from "@/components/common/ShareButtons";
import { queryClient } from "@/lib/queryClient";
import { formatTimeAgo } from "@/lib/utils";
import type { ArticleWithCategory } from "@shared/schema";

interface ArticleDetailProps {
  slug: string;
}

export default function ArticleDetail({ slug }: ArticleDetailProps) {
  const { data: article, isLoading, isError } = useQuery<ArticleWithCategory>({
    queryKey: [`/api/articles/${slug}`],
  });

  useEffect(() => {
    // Update related articles when this article loads
    if (article) {
      queryClient.invalidateQueries({ 
        queryKey: ["/api/articles", { popular: true }] 
      });
    }
  }, [article]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-8 w-3/4 mb-4" />
          <div className="flex items-center space-x-4 mb-6">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-32" />
          </div>
          <Skeleton className="h-[400px] w-full mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !article) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-heading font-bold mb-4">Error al cargar el artículo</h1>
          <p className="mb-6">Lo sentimos, no pudimos cargar el artículo solicitado.</p>
          <Link href="/">
            <a className="text-primary hover:underline">Volver a la página principal</a>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Category and title */}
        <Link href={`/categoria/${article.category.slug}`}>
          <a className="inline-block bg-primary text-white px-3 py-1 text-sm font-semibold rounded mb-4">
            {article.category.name}
          </a>
        </Link>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4">
          {article.title}
        </h1>
        
        {/* Metadata */}
        <div className="flex flex-wrap items-center text-sm text-neutral-500 mb-6 gap-4">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            <span>Por: {article.author}</span>
          </div>
          <div className="flex items-center">
            <CalendarIcon className="h-4 w-4 mr-1" />
            <span>{format(new Date(article.publishedAt), 'd MMMM, yyyy', { locale: es })}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{formatTimeAgo(new Date(article.publishedAt))}</span>
          </div>
          <div className="flex-grow"></div>
          <ShareButtons title={article.title} url={`/articulo/${article.slug}`} />
        </div>
        
        {/* Featured image */}
        <div className="mb-8">
          <img 
            src={article.imageUrl} 
            alt={article.title}
            className="w-full h-auto rounded-lg"
          />
        </div>
        
        {/* Article content */}
        <div className="prose prose-lg max-w-none">
          {article.content.split('\n\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
        
        {/* Tags and sharing */}
        <div className="mt-8 pt-8 border-t border-neutral-200 flex flex-wrap justify-between items-center">
          <div>
            <h3 className="text-lg font-bold mb-2">Compartir artículo</h3>
            <ShareButtons 
              title={article.title} 
              url={`/articulo/${article.slug}`}
              large
            />
          </div>
        </div>
      </div>
    </article>
  );
}
