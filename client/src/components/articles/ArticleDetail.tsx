import { useQuery } from "@tanstack/react-query";
import { Article } from "@shared/schema";
import { useEffect } from "react";

interface ArticleDetailProps {
  articleId: number;
}

export default function ArticleDetail({ articleId }: ArticleDetailProps) {
  const { data: article, isLoading, error } = useQuery<Article>({
    queryKey: [`/api/articles/${articleId}`],
  });

  // Set page title
  useEffect(() => {
    if (article) {
      document.title = `${article.title} - FameStream News`;
    }
    return () => {
      document.title = "FameStream News - Noticias y actualidad";
    };
  }, [article]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded-md w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded-md w-1/2 mb-8"></div>
          <div className="h-96 bg-gray-200 rounded-lg mb-8"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded-md w-full"></div>
            <div className="h-4 bg-gray-200 rounded-md w-full"></div>
            <div className="h-4 bg-gray-200 rounded-md w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="container mx-auto px-4 py-6 text-center">
        <h2 className="headline-font text-2xl font-bold text-gray-800 mb-4">
          No se pudo cargar el artículo
        </h2>
        <p className="text-gray-600">
          Hubo un problema al cargar el contenido. Por favor, inténtalo de nuevo más tarde.
        </p>
      </div>
    );
  }

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = article.title;
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url)}`, '_blank');
        break;
      default:
        navigator.clipboard.writeText(url);
        alert('Enlace copiado al portapapeles');
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <article className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="headline-font text-3xl md:text-4xl font-bold text-[#202124] mb-4">
            {article.title}
          </h1>
          
          <div className="flex flex-wrap items-center justify-between text-sm text-[#5F6368] mb-4">
            <div className="flex items-center mb-2 md:mb-0">
              <span className="mr-4">Por <span className="font-medium">{article.author}</span></span>
              <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>{article.readTime} min lectura</span>
            </div>
          </div>
          
          <div className="border-b border-gray-200 pb-4 mb-6">
            <p className="text-lg text-[#5F6368] font-medium">
              {article.summary}
            </p>
          </div>
        </header>
        
        <div className="mb-8">
          <img 
            src={article.imageUrl} 
            alt={article.title} 
            className="w-full h-auto max-h-[600px] object-cover rounded-lg"
          />
        </div>
        
        <div className="prose prose-lg max-w-none mb-8" dangerouslySetInnerHTML={{ __html: article.content }}></div>
        
        <div className="border-t border-gray-200 pt-6 mt-10">
          <div className="flex flex-wrap justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="text-sm text-[#5F6368] mr-2">Compartir:</span>
              <button onClick={() => handleShare('facebook')} className="text-[#3b5998] hover:opacity-80 mx-1">
                <i className="fab fa-facebook-f text-lg"></i>
              </button>
              <button onClick={() => handleShare('twitter')} className="text-[#1da1f2] hover:opacity-80 mx-1">
                <i className="fab fa-twitter text-lg"></i>
              </button>
              <button onClick={() => handleShare('whatsapp')} className="text-[#25d366] hover:opacity-80 mx-1">
                <i className="fab fa-whatsapp text-lg"></i>
              </button>
              <button onClick={() => handleShare('copy')} className="text-gray-500 hover:opacity-80 mx-1">
                <i className="fas fa-link text-lg"></i>
              </button>
            </div>
            
            <div className="flex space-x-4 text-sm">
              <span className="flex items-center text-[#5F6368]">
                <i className="fas fa-comment mr-1"></i> {article.commentCount} comentarios
              </span>
              <span className="flex items-center text-[#5F6368]">
                <i className="fas fa-share-alt mr-1"></i> {article.shareCount} compartidos
              </span>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
