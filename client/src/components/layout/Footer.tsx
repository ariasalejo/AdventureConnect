import { Link } from "wouter";
import { Compass, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#102c25] py-12 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 md:grid-cols-3 lg:px-10">
        <div>
          <Link href="/"><a className="inline-flex items-center gap-2 text-xl font-bold"><Compass className="h-6 w-6 text-[#d5f078]" />AdventureConnect</a></Link>
          <p className="mt-4 max-w-sm text-sm leading-6 text-white/70">Descubre Colombia, planifica tu próxima aventura y conecta con experiencias locales.</p>
        </div>
        <div>
          <h2 className="font-semibold">Explora</h2>
          <ul className="mt-4 space-y-3 text-sm text-white/75">
            <li><Link href="/"><a className="hover:text-[#d5f078]">Destinos</a></Link></li>
            <li><Link href="/planificador"><a className="hover:text-[#d5f078]">Planificador</a></Link></li>
            <li><Link href="/noticias"><a className="hover:text-[#d5f078]">Actualidad viajera</a></Link></li>
          </ul>
        </div>
        <div>
          <h2 className="font-semibold">Una plataforma en construcción</h2>
          <p className="mt-4 flex items-start gap-2 text-sm leading-6 text-white/70"><MapPin className="mt-1 h-4 w-4 shrink-0 text-[#d5f078]" />Colombia</p>
          <p className="mt-2 flex items-start gap-2 text-sm leading-6 text-white/70"><Mail className="mt-1 h-4 w-4 shrink-0 text-[#d5f078]" />Los canales de contacto de proveedores se incorporarán con verificación.</p>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-7xl border-t border-white/15 px-5 pt-5 text-xs text-white/50 sm:px-8 lg:px-10">© {new Date().getFullYear()} AdventureConnect. Confirma precios, horarios y disponibilidad directamente con cada proveedor.</div>
    </footer>
  );
}
