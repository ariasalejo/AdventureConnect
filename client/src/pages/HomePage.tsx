import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Compass, MapPin, Newspaper, Sparkles, Users } from "lucide-react";
import type { ArticleWithCategory } from "@shared/schema";

const destinations = [
  { name: "Guatapé y el Peñol", region: "Antioquia", description: "Pueblos coloridos, embalse y rutas para descubrir a tu ritmo.", tag: "Naturaleza y aventura", image: "https://images.unsplash.com/photo-1583531352515-8884af319dc1?auto=format&fit=crop&w=1200&q=85" },
  { name: "Eje Cafetero", region: "Quindío y Risaralda", description: "Paisajes cafeteros, cultura local y experiencias con anfitriones.", tag: "Cultura y sabor", image: "https://images.unsplash.com/photo-1518182170546-076c4f6e9e4b?auto=format&fit=crop&w=1200&q=85" },
  { name: "Santa Marta y Tayrona", region: "Magdalena", description: "Mar Caribe, senderos y encuentros entre selva y costa.", tag: "Mar y montaña", image: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1200&q=85" },
];

export default function HomePage() {
  const { data: latestNews = [], isLoading, isError } = useQuery<ArticleWithCategory[]>({
    queryKey: ["/api/travel-news", 3],
    queryFn: async () => {
      const response = await fetch("/api/travel-news?limit=3");
      if (!response.ok) throw new Error("No fue posible cargar la actualidad turística");
      return response.json();
    },
  });

  return (
    <div className="min-h-screen bg-[#f8f7f3] text-[#172b25]">
      <section className="relative isolate overflow-hidden bg-[#102c25] text-white">
        <div className="absolute inset-0 -z-10">
          <img src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=2200&q=90" alt="" className="h-full w-full object-cover opacity-35" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#102c25] via-[#102c25]/85 to-[#102c25]/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#102c25]/70 via-transparent to-[#102c25]/15" />
        </div>
        <div className="mx-auto max-w-7xl px-5 pb-20 pt-12 sm:px-8 lg:px-10 lg:pb-28 lg:pt-16">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold tracking-wide text-[#e5f4c1] backdrop-blur"><Sparkles className="h-4 w-4" /> VIAJES CONECTADOS CON LO LOCAL</div>
          <div className="grid items-center gap-12 md:grid-cols-[1.1fr_.9fr]">
            <div className="max-w-3xl">
              <h1 className="text-5xl font-semibold leading-[1.04] tracking-[-0.045em] sm:text-6xl lg:text-7xl">Colombia no solo se visita. <span className="text-[#d5f078]">Se conecta.</span></h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">Descubre destinos, conoce experiencias locales y conecta con las personas y empresas que hacen único cada viaje.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/planificador"><a className="inline-flex items-center gap-2 rounded-full bg-[#d5f078] px-6 py-3 font-semibold text-[#17372d] transition hover:bg-white">Diseñar mi viaje <ArrowRight className="h-4 w-4" /></a></Link>
                <Link href="/noticias"><a className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/10 px-6 py-3 font-semibold text-white transition hover:bg-white/20">Actualidad viajera <Newspaper className="h-4 w-4" /></a></Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/80"><span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-[#d5f078]" /> Destinos colombianos</span><span className="inline-flex items-center gap-2"><Users className="h-4 w-4 text-[#d5f078]" /> Viajeros y anfitriones</span></div>
            </div>
            <div className="rounded-[2rem] border border-white/20 bg-white/10 p-3 shadow-2xl backdrop-blur">
              <img src="https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=1200&q=85" alt="Viajera explorando un paisaje" className="h-[320px] w-full rounded-[1.5rem] object-cover sm:h-[400px]" loading="eager" />
              <div className="flex items-center justify-between gap-4 px-3 py-4"><div><p className="text-sm text-white/70">Tu próxima historia empieza aquí</p><p className="mt-1 font-semibold">Encuentra tu forma de vivir Colombia</p></div><Compass className="h-8 w-8 shrink-0 text-[#d5f078]" /></div>
            </div>
          </div>
        </div>
      </section>

      <section id="destinos" className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#587665]">Inspiración para salir</p><h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Colombia te espera</h2><p className="mt-3 max-w-2xl leading-7 text-[#65766c]">Ideas para empezar a explorar. Confirma precios, horarios y disponibilidad con cada proveedor antes de reservar.</p></div><Link href="/planificador"><a className="inline-flex items-center gap-2 font-semibold text-[#365847]">Encontrar mi viaje <ArrowRight className="h-4 w-4" /></a></Link></div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{destinations.map((destination) => <article key={destination.name} className="group overflow-hidden rounded-[1.5rem] border border-[#e5e7df] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"><div className="relative h-60 overflow-hidden"><img src={destination.image} alt={destination.name} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /><span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-[#244436]">{destination.tag}</span></div><div className="p-6"><p className="text-sm font-medium text-[#6d852f]">{destination.region}</p><h3 className="mt-2 text-xl font-semibold">{destination.name}</h3><p className="mt-2 min-h-14 leading-6 text-[#65766c]">{destination.description}</p><Link href="/planificador"><a className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#244436]">Planear una visita <ArrowRight className="h-4 w-4" /></a></Link></div></article>)}</div>
      </section>

      <section className="bg-[#e9eee3]"><div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 md:grid-cols-3 lg:px-10"><div><span className="text-sm font-bold text-[#6d852f]">01 / DESCUBRE</span><h3 className="mt-3 text-xl font-semibold">Encuentra lugares para ti</h3><p className="mt-2 leading-7 text-[#65766c]">Explora opciones por estilo de viaje, tiempo y presupuesto orientativo.</p></div><div><span className="text-sm font-bold text-[#6d852f]">02 / CONECTA</span><h3 className="mt-3 text-xl font-semibold">Conoce la experiencia local</h3><p className="mt-2 leading-7 text-[#65766c]">La visión del producto conecta viajeros con anfitriones y negocios turísticos.</p></div><div><span className="text-sm font-bold text-[#6d852f]">03 / PREPÁRATE</span><h3 className="mt-3 text-xl font-semibold">Planifica con claridad</h3><p className="mt-2 leading-7 text-[#65766c]">Organiza una idea de itinerario y confirma los detalles con los proveedores.</p></div></div></section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#587665]">La ventana de noticias</p><h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Actualidad para viajar mejor</h2><p className="mt-3 max-w-2xl leading-7 text-[#65766c]">Turismo colombiano, destinos, eventos y movilidad. No presentaremos noticias genéricas como información turística.</p></div><Link href="/noticias"><a className="inline-flex items-center gap-2 font-semibold text-[#365847]">Ver noticias <ArrowRight className="h-4 w-4" /></a></Link></div>
        {isLoading ? <div className="grid gap-5 md:grid-cols-3">{[0,1,2].map((item) => <div key={item} className="h-56 animate-pulse rounded-2xl bg-[#e9eee3]" />)}</div> : isError ? <div className="rounded-2xl border border-[#d7dfd3] bg-white p-6 text-[#65766c]">La actualidad turística no está disponible en este momento.</div> : latestNews.length === 0 ? <div className="rounded-2xl border border-[#d7dfd3] bg-white p-6"><p className="font-semibold">Estamos preparando la ventana de actualidad.</p><p className="mt-2 text-sm leading-6 text-[#65766c]">Todavía no hay artículos turísticos en la API. La conexión a una fuente externa verificada es una tarea independiente.</p></div> : <div className="grid gap-5 md:grid-cols-3">{latestNews.map((article) => <article key={article.id} className="overflow-hidden rounded-2xl border border-[#e5e7df] bg-white"><img src={article.imageUrl} alt={article.title} loading="lazy" className="h-48 w-full object-cover" /><div className="p-5"><p className="text-xs font-semibold uppercase tracking-wide text-[#6d852f]">{article.category.name}</p><h3 className="mt-2 text-lg font-semibold leading-snug">{article.title}</h3><p className="mt-2 line-clamp-3 text-sm leading-6 text-[#65766c]">{article.excerpt}</p><Link href={"/articulo/" + article.slug}><a className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#244436]">Leer artículo <ArrowRight className="h-4 w-4" /></a></Link></div></article>)}</div>}
      </section>
    </div>
  );
}