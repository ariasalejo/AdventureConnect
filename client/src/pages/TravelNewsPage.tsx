import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Newspaper } from "lucide-react";
import CategoryFilter from "@/components/home/CategoryFilter";
import FeaturedNews from "@/components/home/FeaturedNews";
import ArticleCard from "@/components/home/ArticleCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { ArticleWithCategory } from "@shared/schema";

export default function TravelNewsPage() {
  const { data: articles = [], isLoading, isError, refetch } = useQuery<ArticleWithCategory[]>({
    queryKey: ["/api/travel-news", 12],
    queryFn: async () => {
      const response = await fetch("/api/travel-news?limit=12");
      if (!response.ok) throw new Error("No fue posible cargar la actualidad turística");
      return response.json();
    },
  });
  return <div className="min-h-screen bg-[#f8f7f3] text-[#172b25]">
    <section className="bg-[#102c25] text-white"><div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
      <div className="flex items-center gap-3 text-[#d5f078]"><Newspaper className="h-6 w-6" /><span className="text-xs font-bold uppercase tracking-[0.2em]">AdventureConnect / Actualidad</span></div>
      <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">Noticias para viajar por Colombia</h1>
      <p className="mt-4 max-w-2xl leading-7 text-white/75">Destinos, naturaleza, cultura local, eventos y movilidad. Una ventana de información especializada, separada de la planificación de viajes.</p>
      <Link href="/"><a className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#d5f078] hover:text-white">Volver a descubrir Colombia <ArrowRight className="h-4 w-4" /></a></Link>
    </div></section>
    <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
      <CategoryFilter /><FeaturedNews />
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#587665]">Actualidad turística</p><h2 className="mt-2 text-2xl font-semibold">Lo último para tu próximo viaje</h2></div><span className="text-sm text-[#65766c]">{articles.length} artículos</span></div>
      {isLoading ? <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{[0,1,2,3,4,5].map((item) => <div key={item} className="overflow-hidden rounded-2xl bg-white p-4"><Skeleton className="h-44 w-full rounded-xl" /><Skeleton className="mt-4 h-5 w-2/3" /><Skeleton className="mt-3 h-4 w-full" /><Skeleton className="mt-2 h-4 w-4/5" /></div>)}</div>
      : isError ? <div className="rounded-2xl border border-[#e5e7df] bg-white p-8 text-center"><p className="font-semibold">No pudimos cargar las noticias.</p><button type="button" onClick={() => refetch()} className="mt-4 rounded-full bg-[#244436] px-5 py-2.5 text-sm font-semibold text-white">Intentar de nuevo</button></div>
      : articles.length === 0 ? <div className="rounded-2xl border border-[#e5e7df] bg-white p-8"><h3 className="text-xl font-semibold">La ventana turística está lista para recibir contenido.</h3><p className="mt-2 max-w-2xl leading-7 text-[#65766c]">La API actual es interna y no hay un proveedor externo de noticias configurado en este repositorio. No inventaremos titulares actuales. Una fuente verificada requiere proveedor, condiciones de uso y credenciales.</p></div>
      : <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{articles.map((article) => <ArticleCard key={article.id} article={article} />)}</div>}
    </main>
  </div>;
}