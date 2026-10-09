import { Compass, Mail, MapPin, Newspaper } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#102f28] text-white">
      <div className="container mx-auto grid gap-10 px-4 py-12 md:grid-cols-[1.4fr_.8fr_.8fr] md:py-16">
        <div>
          <a href="/" className="inline-flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-[#f3c878]"><Compass className="h-6 w-6" /></span><span className="text-xl font-extrabold tracking-tight">AdventureConnect</span></a>
          <p className="mt-5 max-w-md text-sm leading-7 text-white/70">Un punto de partida para descubrir Colombia, encontrar inspiración para viajar y acercarse a las experiencias de cada territorio.</p>
          <p className="mt-4 inline-flex items-center gap-2 text-sm text-white/75"><MapPin className="h-4 w-4 text-[#f3c878]" /> Colombia</p>
        </div>
        <div><h2 className="mb-4 font-bold">Explora</h2><ul className="space-y-3 text-sm text-white/70"><li><a href="/#destinos" className="transition hover:text-[#f3c878]">Destinos</a></li><li><a href="/#planifica" className="transition hover:text-[#f3c878]">Planifica tu viaje</a></li><li><a href="/#noticias-viajes" className="transition hover:text-[#f3c878]">Noticias de viajes</a></li></ul></div>
        <div><h2 className="mb-4 font-bold">Actualidad viajera</h2><p className="text-sm leading-6 text-white/70">Fame News se integra como sección editorial para noticias de turismo, destinos y eventos. Sus contenidos y fuentes se deben verificar antes de publicar.</p><a href="/#noticias-viajes" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#f3c878] hover:text-white"><Newspaper className="h-4 w-4" /> Ir a Fame News</a><p className="mt-4 inline-flex items-center gap-2 text-xs text-white/55"><Mail className="h-4 w-4" /> Contacto oficial pendiente de configurar</p></div>
      </div>
      <div className="border-t border-white/10"><div className="container mx-auto flex flex-col gap-2 px-4 py-5 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between"><p>© {new Date().getFullYear()} AdventureConnect. Todos los derechos reservados.</p><p>Construyendo conexiones para viajar por Colombia.</p></div></div>
    </footer>
  );
}
