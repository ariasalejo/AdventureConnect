import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Compass, Menu, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Header() {
  const [, setLocation] = useLocation();
  const [searchValue, setSearchValue] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchValue.trim();
    if (!query) return;
    setLocation("/buscar?q=" + encodeURIComponent(query));
    setSearchOpen(false);
    setMenuOpen(false);
  };

  const navClass = "text-sm font-semibold text-[#29483a] transition hover:text-[#708832]";

  return (
    <header className="sticky top-0 z-50 border-b border-[#e4e8df] bg-[#fffefa]/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-10">
        <Link href="/">
          <a className="flex items-center gap-2.5" aria-label="AdventureConnect inicio">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#d5f078] text-[#17372d]"><Compass className="h-6 w-6" /></span>
            <span className="text-lg font-bold tracking-tight text-[#17372d] sm:text-xl">Adventure<span className="text-[#708832]">Connect</span></span>
          </a>
        </Link>
        <nav className="hidden items-center gap-7 md:flex" aria-label="Navegación principal">
          <Link href="/"><a className={navClass}>Descubrir</a></Link>
          <Link href="/planificador"><a className={navClass}>Planificador</a></Link>
          <Link href="/noticias"><a className={navClass}>Actualidad</a></Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button type="button" variant="ghost" size="icon" aria-label={searchOpen ? "Cerrar búsqueda" : "Abrir búsqueda"} onClick={() => setSearchOpen((open) => !open)}><Search className="h-5 w-5" /></Button>
          <Button type="button" variant="ghost" size="icon" className="md:hidden" aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"} onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</Button>
          <Link href="/planificador"><a className="hidden rounded-full bg-[#244436] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#365847] sm:inline-flex">Planear viaje</a></Link>
        </div>
      </div>
      {searchOpen && <div className="border-t border-[#e4e8df] px-4 py-3 sm:px-6"><form onSubmit={submitSearch} className="mx-auto flex max-w-3xl gap-2"><Input autoFocus value={searchValue} onChange={(event) => setSearchValue(event.target.value)} placeholder="Buscar destinos, experiencias o artículos" aria-label="Buscar" /><Button type="submit">Buscar</Button></form></div>}
      {menuOpen && <nav className="grid gap-1 border-t border-[#e4e8df] bg-white px-5 py-3 md:hidden" aria-label="Navegación móvil"><Link href="/"><a onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-3 font-semibold text-[#29483a]">Descubrir destinos</a></Link><Link href="/planificador"><a onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-3 font-semibold text-[#29483a]">Planificador de viajes</a></Link><Link href="/noticias"><a onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-3 font-semibold text-[#29483a]">Actualidad viajera</a></Link></nav>}
    </header>
  );
}
