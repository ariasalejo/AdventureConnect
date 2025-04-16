import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Article, Category } from "@shared/schema";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Sidebar } from "@/components/sidebar/sidebar";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  
  const { data: article, isLoading: isLoadingArticle } = useQuery<Article>({
    queryKey: [`/api/articles/${slug}`],
  });
  
  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });
  
  // Find the category name for this article
  const categoryName = categories?.find(cat => cat.id === article?.categoryId)?.name || "";
  
  // Set the document title
  useEffect(() => {
    if (article) {
      document.title = `${article.title} - FameStream News`;
    }
  }, [article]);
  
  return (
    <div className="flex flex-col min-h-screen bg-neutral-100 font-body text-neutral-800">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content column */}
          <div className="lg:w-2/3">
            {isLoadingArticle ? (
              <div className="space-y-4">
                <div className="h-8 bg-neutral-200 animate-pulse rounded w-3/4"></div>
                <div className="h-80 bg-neutral-200 animate-pulse rounded"></div>
                <div className="h-4 bg-neutral-200 animate-pulse rounded w-1/2"></div>
                <div className="h-4 bg-neutral-200 animate-pulse rounded"></div>
                <div className="h-4 bg-neutral-200 animate-pulse rounded"></div>
                <div className="h-4 bg-neutral-200 animate-pulse rounded w-5/6"></div>
              </div>
            ) : article ? (
              <article className="bg-white rounded-lg shadow-md p-6">
                <div className="mb-4">
                  <span className="bg-primary bg-opacity-20 text-primary text-xs font-semibold px-2 py-1 rounded">
                    {categoryName}
                  </span>
                  <span className="text-neutral-500 text-sm ml-2">
                    {format(new Date(article.publishedAt), "d MMMM yyyy", { locale: es })}
                  </span>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4">{article.title}</h1>
                
                <div className="flex items-center mb-6">
                  <img src={article.authorImageUrl} alt={article.authorName} className="w-10 h-10 rounded-full mr-3" />
                  <div>
                    <p className="font-semibold">{article.authorName}</p>
                    <p className="text-sm text-neutral-500">{article.readCount.toLocaleString('es')} lecturas</p>
                  </div>
                  <div className="ml-auto flex space-x-4">
                    <button className="text-neutral-500 hover:text-primary">
                      <i className="fas fa-share-alt"></i>
                    </button>
                    <button className="text-neutral-500 hover:text-primary">
                      <i className="far fa-bookmark"></i>
                    </button>
                    <button className="text-neutral-500 hover:text-primary">
                      <i className="far fa-heart"></i>
                    </button>
                  </div>
                </div>
                
                <img 
                  src={article.imageUrl} 
                  alt={article.title} 
                  className="w-full h-auto rounded-lg mb-6"
                />
                
                <div 
                  className="prose max-w-none prose-headings:font-heading prose-headings:font-bold prose-h2:text-xl prose-p:text-neutral-700 prose-a:text-primary"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
                
                <div className="mt-8 pt-6 border-t border-neutral-200">
                  <h3 className="font-heading font-bold text-lg mb-4">Compartir este artículo</h3>
                  <div className="flex space-x-3">
                    <button className="bg-[#3b5998] text-white p-2 rounded-full hover:bg-opacity-90">
                      <i className="fab fa-facebook-f"></i>
                    </button>
                    <button className="bg-[#1da1f2] text-white p-2 rounded-full hover:bg-opacity-90">
                      <i className="fab fa-twitter"></i>
                    </button>
                    <button className="bg-[#25D366] text-white p-2 rounded-full hover:bg-opacity-90">
                      <i className="fab fa-whatsapp"></i>
                    </button>
                    <button className="bg-[#0077b5] text-white p-2 rounded-full hover:bg-opacity-90">
                      <i className="fab fa-linkedin-in"></i>
                    </button>
                    <button className="bg-neutral-700 text-white p-2 rounded-full hover:bg-opacity-90">
                      <i className="fas fa-envelope"></i>
                    </button>
                  </div>
                </div>
              </article>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-heading font-bold">Artículo no encontrado</h1>
                <p className="mt-4">Lo sentimos, el artículo que buscas no existe o ha sido eliminado.</p>
              </div>
            )}
          </div>
          
          {/* Sidebar column */}
          <div className="lg:w-1/3">
            <Sidebar />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
