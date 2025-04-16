import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Article, Workshop, Event } from "@shared/schema";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FeaturedArticle } from "@/components/article/featured-article";
import { WorkshopCard } from "@/components/workshop/workshop-card";
import { ArticleCard } from "@/components/article/article-card";
import { EventCard } from "@/components/event/event-card";
import { Sidebar } from "@/components/sidebar/sidebar";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Home() {
  const { data: featuredArticle, isLoading: isLoadingFeatured } = useQuery<Article[]>({
    queryKey: ["/api/articles/featured"],
  });
  
  const { data: featuredWorkshops, isLoading: isLoadingWorkshops } = useQuery<Workshop[]>({
    queryKey: ["/api/workshops/featured"],
  });
  
  const { data: latestArticles, isLoading: isLoadingLatest } = useQuery<Article[]>({
    queryKey: ["/api/articles/latest"],
  });
  
  const { data: upcomingEvents, isLoading: isLoadingEvents } = useQuery<Event[]>({
    queryKey: ["/api/events/upcoming"],
  });
  
  // Set the document title
  useEffect(() => {
    document.title = "FameStream News - Noticias, Talleres y Eventos";
  }, []);
  
  return (
    <div className="flex flex-col min-h-screen bg-neutral-100 font-body text-neutral-800">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        {/* Hero Section */}
        <section className="mb-8">
          {isLoadingFeatured ? (
            <div className="h-[300px] md:h-[500px] bg-neutral-200 animate-pulse rounded-xl"></div>
          ) : (
            featuredArticle && featuredArticle.length > 0 && (
              <FeaturedArticle article={featuredArticle[0]} />
            )
          )}
        </section>
        
        {/* Featured Workshops */}
        <section className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl md:text-2xl font-heading font-bold">Talleres Destacados</h2>
            <Link href="/talleres" className="text-primary font-semibold hover:underline">Ver todos</Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {isLoadingWorkshops ? (
              Array(3).fill(0).map((_, index) => (
                <div key={index} className="h-80 bg-neutral-200 animate-pulse rounded-lg"></div>
              ))
            ) : (
              featuredWorkshops?.map(workshop => (
                <WorkshopCard key={workshop.id} workshop={workshop} />
              ))
            )}
          </div>
        </section>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content column */}
          <div className="lg:w-2/3">
            {/* Latest News */}
            <section className="mb-8">
              <h2 className="text-xl md:text-2xl font-heading font-bold mb-4">Últimas Noticias</h2>
              
              <div className="space-y-6">
                {isLoadingLatest ? (
                  Array(3).fill(0).map((_, index) => (
                    <div key={index} className="h-48 bg-neutral-200 animate-pulse rounded-lg"></div>
                  ))
                ) : (
                  latestArticles?.map(article => (
                    <ArticleCard key={article.id} article={article} />
                  ))
                )}
                
                <div className="text-center mt-8">
                  <Button className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors">
                    Cargar más artículos
                  </Button>
                </div>
              </div>
            </section>
            
            {/* Upcoming Events */}
            <section className="mb-8">
              <h2 className="text-xl md:text-2xl font-heading font-bold mb-4">Próximos Eventos</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {isLoadingEvents ? (
                  Array(4).fill(0).map((_, index) => (
                    <div key={index} className="h-32 bg-neutral-200 animate-pulse rounded-lg"></div>
                  ))
                ) : (
                  upcomingEvents?.map(event => (
                    <EventCard key={event.id} event={event} />
                  ))
                )}
              </div>
            </section>
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
