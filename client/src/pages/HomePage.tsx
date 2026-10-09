import { useInfiniteQuery } from "@tanstack/react-query";
import { ArrowDownRight, ArrowRight, Compass, MapPin, Newspaper, ShieldCheck, Sparkles } from "lucide-react";
import CategoryFilter from "@/components/home/CategoryFilter";
import FeaturedNews from "@/components/home/FeaturedNews";
import ArticleCard from "@/components/home/ArticleCard";
import PopularNewsSection from "@/components/home/PopularNewsSection";
import NewsletterSection from "@/components/home/NewsletterSection";
import ViralNewsSection from "@/components/home/ViralNewsSection";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { ArticleWithCategory } from "@shared/schema";

const destinations = [
  { name: "Cartagena de Indias", region: "Caribe colombiano", description: "Calles coloniales, murallas y atardeceres junto al mar.", image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=85", alt: "Arquitectura colorida y ambiente costero del Caribe" },
  { name: "Eje Cafetero", region: "Andes occidentales", description: "Montañas verdes, fincas cafeteras y pueblos con encanto.", image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1200&q=85", alt: "Paisaje verde de montañas y naturaleza" },
  { name: "Santa Marta y Tayrona", region: "Caribe natural", description: "Selva tropical, senderos y playas rodeadas de naturaleza.", image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=85", alt: "Sendero natural entre vegetación tropical" },
];

export default function HomePage() {
  const { data: latestArticles, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery<ArticleWithCategory[]>({
    queryKey: ["/api/articles", "adventureconnect-latest"],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await fetch(`/api/articles?latest=true&limit=6&page=${pageParam}`);
      if (!response.ok) throw new Error("No fue posible cargar las noticias");
      return response.json();
    },
    getNextPageParam: (lastPage, pages) => lastPage.length === 6 ? pages.length + 1 : undefined,
    initialPageParam: 1,
  });

  const handleLoadMore = () => { if (hasNextPage) void fetchNextPage(); };
  const articles = latestArticles?.pages.flatMap((page) => page) ?? [];

  return (
    <div className="min-h-screen bg-background">
      <section className="relative isolate overflow-hidden bg-[#123d32] text-white">
        <div className="absolute inset-0 -z-10">
          <img src="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=2200&q=90" alt="" className="h-full w-full object-cover opacity-35" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b2d26] via-[#123d32]/90 to-[#123d32]/35" />
        </div>
        <div className="container mx-auto grid min-h-[560px] items-center gap-10 px-4 py-16 md:min-h-[620px] md:grid-cols-[1.15fr_.85fr] md:py-24">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur"><Compass className="h-4 w-4 text-[#f3c878]" /> Colombia se vive mejor cuando la descubres</div>
            <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight md:text-6xl">Tu próxima historia empieza <span className="text-[#f3c878]">en Colombia.</span></h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/85 md:text-lg">Encuentra destinos, conoce experiencias locales y descubre información útil para planear tu próximo viaje. Una conexión entre viajeros, territorios y quienes los hacen especiales.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#destinos" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#f3c878] px-6 py-3 font-semibold text-[#18382f] transition hover:bg-white">Explorar Colombia <ArrowRight className="h-4 w-4" /></a>
              <a href="#noticias-viajes" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/40 px-6 py-3 font-semibold text-white transition hover:bg-white/10">Noticias de viajes <Newspaper className="h-4 w-4" /></a>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/80">
              <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-[#f3c878]" /> Destinos colombianos</span>
              <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[#f3c878]" /> Información clara</span>
              <span className="inline-flex items-center gap-2"><Sparkles className="h-4 w-4 text-[#f3c878]" /> Experiencias locales</span>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-auto max-w-sm rounded-3xl border border-white/20 bg-white/10 p-3 shadow-2xl backdrop-blur">
              <img src="https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=1000&q=85" alt="Viajero contemplando un paisaje de montaña" className="h-[340px] w-full rounded-2xl object-cover" />
              <div className="flex items-center justify-between gap-4 px-3 py-4"><div><p className="text-sm text-white/70">Inspírate para tu próximo viaje</p><p className="mt-1 font-semibold">Hay mucho por descubrir</p></div><a href="#destinos" aria-label="Ver destinos" className="rounded-full bg-white p-3 text-[#123d32] transition hover:bg-[#f3c878]"><ArrowDownRight className="h-5 w-5" /></a></div>
            </div>
          </div>
        </div>
      </section>

      <section id="destinos" className="container mx-auto px-4 py-16 md:py-20">
        <div className="mb-8"><p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-primary">Empieza a explorar</p><h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">Colombia te espera</h2><p className="mt-3 max-w-2xl text-muted-foreground">Una primera selección para inspirarte. Estamos construyendo herramientas para descubrir destinos y conectar con experiencias locales.</p></div>
        <div className="grid gap-6 md:grid-cols-3">
          {destinations.map((destination) => <article key={destination.name} className="group overflow-hidden rounded-2xl border bg-card shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="relative h-64 overflow-hidden"><img src={destination.image} alt={destination.alt} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /><span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-[#17483a]">{destination.region}</span></div>
            <div className="p-5"><h3 className="text-xl font-bold">{destination.name}</h3><p className="mt-2 min-h-12 text-sm leading-6 text-muted-foreground">{destination.description}</p><a href="#planifica" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">Descubrir más <ArrowRight className="h-4 w-4" /></a></div>
          </article>)}
        </div>
      </section>

      <section id="planifica" className="border-y bg-white">
        <div className="container mx-auto grid gap-8 px-4 py-12 md:grid-cols-3 md:py-16">
          <div><div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><Compass className="h-5 w-5" /></div><h2 className="text-lg font-bold">Descubre con contexto</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Guías e información para comparar lugares, entender cada región y preparar mejor la salida.</p></div>
          <div><div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><MapPin className="h-5 w-5" /></div><h2 className="text-lg font-bold">Conecta con lo local</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">La visión del producto es acercar viajeros, negocios y proveedores turísticos. La disponibilidad y las reservas se incorporarán cuando estén integradas y verificadas.</p></div>
          <div><div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><Newspaper className="h-5 w-5" /></div><h2 className="text-lg font-bold">Mantente al día</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Fame News se conserva como espacio editorial para noticias, eventos y novedades relacionadas con viajes.</p></div>
        </div>
      </section>

      <section id="noticias-viajes" className="container mx-auto px-4 py-16 md:py-20">
        <div className="mb-8 max-w-3xl"><p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-primary">Fame News · dentro de AdventureConnect</p><h2 className="text-3xl font-bold tracking-tight md:text-4xl">Noticias para viajar mejor</h2><p className="mt-3 leading-7 text-muted-foreground">Actualidad turística, eventos y novedades de destinos. Se mantiene el motor de artículos existente mientras se adapta su contenido y sus fuentes a los viajes en Colombia.</p></div>
        <CategoryFilter />
        <FeaturedNews />
        <section className="mb-12">
          <div className="mb-6 flex items-center justify-between gap-4"><h3 className="text-2xl font-bold">Últimas noticias</h3><span className="text-sm text-muted-foreground">Fame News</span></div>
          {isLoading ? <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, index) => <div key={index} className="overflow-hidden rounded-xl border bg-card p-4"><Skeleton className="mb-4 h-44 w-full" /><Skeleton className="mb-2 h-4 w-24" /><Skeleton className="mb-3 h-6 w-full" /><Skeleton className="h-4 w-3/4" /></div>)}</div> : articles.length > 0 ? <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">{articles.map((article) => <ArticleCard key={article.id} article={article} />)}</div> : <p className="rounded-xl border border-dashed p-6 text-sm text-muted-foreground">Las noticias aparecerán aquí cuando la fuente editorial tenga artículos disponibles.</p>}
          <div className="mt-8 text-center"><Button variant="outline" onClick={handleLoadMore} disabled={!hasNextPage || isFetchingNextPage} className="rounded-full border-primary px-6 text-primary hover:bg-primary hover:text-white">{isFetchingNextPage ? "Cargando..." : hasNextPage ? "Cargar más noticias" : "Fin de las noticias disponibles"}</Button></div>
        </section>
        <PopularNewsSection />
        <ViralNewsSection />
        <NewsletterSection />
      </section>
    </div>
  );
}
