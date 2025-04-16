import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Article } from "@shared/schema";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

export default function Sidebar() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const { data: popularArticles = [], isLoading: isLoadingPopular } = useQuery<Article[]>({
    queryKey: ['/api/articles/popular'],
  });

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailSchema = z.string().email("Por favor, introduce un email válido");
    
    try {
      // Validate email first
      emailSchema.parse(email);
      
      // Submit to API
      await apiRequest("POST", "/api/newsletter", { email });
      
      toast({
        title: "Suscripción exitosa",
        description: "Recibirás nuestras novedades en tu correo electrónico.",
        variant: "default",
      });
      
      setEmail("");
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Error de validación",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Ha ocurrido un error al procesar tu suscripción. Por favor, inténtalo de nuevo.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <aside className="lg:w-1/3">
      {/* Most Popular */}
      <div className="bg-white rounded-lg shadow-md p-5 mb-8">
        <h3 className="headline-font text-xl font-bold mb-4">Más Populares</h3>
        <div className="space-y-4">
          {isLoadingPopular ? (
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="text-3xl font-bold text-gray-200">0{i+1}</div>
                <div className="w-full">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-1 w-full"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                </div>
              </div>
            ))
          ) : (
            popularArticles.map((article, index) => (
              <Link key={article.id} href={`/articulo/${article.id}`}>
                <a className="flex items-start group">
                  <span className="text-3xl font-bold text-gray-200 mr-4">
                    {index < 9 ? `0${index + 1}` : index + 1}
                  </span>
                  <div>
                    <h4 className="font-medium group-hover:text-primary transition-colors">
                      {article.title}
                    </h4>
                    <p className="text-xs text-[#5F6368] mt-1">
                      {new Date(article.publishedAt).toLocaleDateString()}
                    </p>
                  </div>
                </a>
              </Link>
            ))
          )}
        </div>
      </div>
      
      {/* Newsletter */}
      <div className="bg-primary bg-opacity-10 rounded-lg shadow-md p-5 mb-8">
        <h3 className="headline-font text-xl font-bold mb-2">Suscríbete a nuestro boletín</h3>
        <p className="text-sm mb-4">Recibe las noticias más importantes del día en tu correo electrónico</p>
        <form onSubmit={handleNewsletterSubmit}>
          <input 
            type="email" 
            placeholder="Tu email" 
            className="w-full p-3 mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-md transition-colors"
          >
            Suscribirme
          </button>
        </form>
      </div>
      
      {/* Tags/Topics */}
      <div className="bg-white rounded-lg shadow-md p-5">
        <h3 className="headline-font text-xl font-bold mb-4">Temas Populares</h3>
        <div className="flex flex-wrap gap-2">
          <a href="#" className="bg-gray-100 hover:bg-gray-200 text-[#202124] px-3 py-1 rounded-full text-sm transition-colors">Elecciones</a>
          <a href="#" className="bg-gray-100 hover:bg-gray-200 text-[#202124] px-3 py-1 rounded-full text-sm transition-colors">Cambio climático</a>
          <a href="#" className="bg-gray-100 hover:bg-gray-200 text-[#202124] px-3 py-1 rounded-full text-sm transition-colors">Crisis energética</a>
          <a href="#" className="bg-gray-100 hover:bg-gray-200 text-[#202124] px-3 py-1 rounded-full text-sm transition-colors">Inteligencia artificial</a>
          <a href="#" className="bg-gray-100 hover:bg-gray-200 text-[#202124] px-3 py-1 rounded-full text-sm transition-colors">Mundial 2026</a>
          <a href="#" className="bg-gray-100 hover:bg-gray-200 text-[#202124] px-3 py-1 rounded-full text-sm transition-colors">LaLiga</a>
          <a href="#" className="bg-gray-100 hover:bg-gray-200 text-[#202124] px-3 py-1 rounded-full text-sm transition-colors">Inflación</a>
          <a href="#" className="bg-gray-100 hover:bg-gray-200 text-[#202124] px-3 py-1 rounded-full text-sm transition-colors">Vivienda</a>
          <a href="#" className="bg-gray-100 hover:bg-gray-200 text-[#202124] px-3 py-1 rounded-full text-sm transition-colors">Salud mental</a>
          <a href="#" className="bg-gray-100 hover:bg-gray-200 text-[#202124] px-3 py-1 rounded-full text-sm transition-colors">Criptomonedas</a>
        </div>
      </div>
    </aside>
  );
}
