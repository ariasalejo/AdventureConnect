import { useQuery } from "@tanstack/react-query";
import { Article, Category, Tag } from "@shared/schema";
import { PopularArticle } from "../article/popular-article";
import { NewsletterForm } from "./newsletter-form";
import { Link } from "wouter";

export function Sidebar() {
  const { data: popularArticles, isLoading: isLoadingPopular } = useQuery<Article[]>({
    queryKey: ["/api/articles/popular"],
  });
  
  const { data: categories, isLoading: isLoadingCategories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });
  
  const { data: popularTags, isLoading: isLoadingTags } = useQuery<Tag[]>({
    queryKey: ["/api/tags/popular"],
  });

  return (
    <>
      {/* Popular Articles */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h3 className="font-heading font-bold text-lg border-b border-neutral-200 pb-2 mb-4">
          Lo Más Leído
        </h3>
        <div className="space-y-4">
          {isLoadingPopular ? (
            <p>Cargando artículos populares...</p>
          ) : (
            popularArticles?.map((article, index) => (
              <PopularArticle key={article.id} article={article} index={index + 1} />
            ))
          )}
        </div>
      </div>
      
      {/* Categories */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h3 className="font-heading font-bold text-lg border-b border-neutral-200 pb-2 mb-4">
          Categorías
        </h3>
        <div className="space-y-2">
          {isLoadingCategories ? (
            <p>Cargando categorías...</p>
          ) : (
            categories?.map((category) => (
              <Link 
                key={category.id} 
                href={`/categoria/${category.slug}`}
                className="flex justify-between items-center p-2 hover:bg-neutral-100 rounded"
              >
                <span className="font-medium">{category.name}</span>
                <span className="bg-primary text-white text-xs rounded-full px-2 py-1">
                  {category.articleCount}
                </span>
              </Link>
            ))
          )}
        </div>
      </div>
      
      {/* Newsletter */}
      <div className="bg-primary bg-opacity-10 rounded-lg shadow-md p-6 mb-6">
        <h3 className="font-heading font-bold text-lg text-primary mb-3">
          Suscríbete a nuestra newsletter
        </h3>
        <p className="text-sm text-neutral-700 mb-4">
          Recibe las últimas noticias, talleres y eventos directamente en tu email.
        </p>
        <NewsletterForm />
      </div>
      
      {/* Featured Tags */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="font-heading font-bold text-lg border-b border-neutral-200 pb-2 mb-4">
          Etiquetas Populares
        </h3>
        <div className="flex flex-wrap gap-2">
          {isLoadingTags ? (
            <p>Cargando etiquetas...</p>
          ) : (
            popularTags?.map((tag) => (
              <Link 
                key={tag.id} 
                href={`/etiqueta/${tag.slug}`}
                className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-sm rounded-full px-3 py-1"
              >
                #{tag.name}
              </Link>
            ))
          )}
        </div>
      </div>
    </>
  );
}
