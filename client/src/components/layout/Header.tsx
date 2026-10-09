import { useState } from "react";
import { useLocation } from "wouter";
import { Compass, Menu, Newspaper, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export default function Header() {
  const [, setLocation] = useLocation();
  const [searchValue, setSearchValue] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const term = searchValue.trim();
    if (!term) {
      toast({ title: "Escribe qué quieres buscar", description: "Puedes buscar artículos y noticias disponibles.", variant: "destructive" });
      return;
    }
    setLocation(`/buscar?q=${encodeURIComponent(term)}`);
    setSearchOpen(false);
    setMenuOpen(false);
  };

  const navLinks = [
    { href: "/#destinos", label: "Destinos" },
    { href: "/#planifica", label: "Planifica tu viaje" },
    { href: "/#noticias-viajes", label: "Fame News", icon: Newspaper },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-white/95 shadow-sm backdrop-blur">
      <div className="container mx-auto flex min-h-[76px] items-center justify-between gap-4 px-4">
        <a href="/" className="flex shrink-0 items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#17483a] text-[#f3c878]"><Compass className="h-6 w-6" /></span>
          <span className="leading-tight"><span className="block text-lg font-extrabold tracking-tight text-[#17483a] sm:text-xl">AdventureConnect</span><span className="hidden text-xs font-medium tracking-wide text-muted-foreground sm:block">Colombia · viajes con sentido</span></span>
        </a>
        <nav aria-label="Navegación principal" className="hidden items-center gap-7 lg:flex">
          {navLinks.map(({ href, label, icon: Icon }) => <a key={href} href={href} className="inline-flex items-center gap-2 text-sm font-semibold text-foreground/80 transition hover:text-primary">{Icon && <Icon className="h-4 w-4" />}{label}</a>)}
        </nav>
        <div className="flex items-center gap-2">
          <Button type="button" variant="ghost" size="icon" aria-label="Buscar noticias" onClick={() => setSearchOpen((open) => !open)}>{searchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}</Button>
          <Button type="button" variant="outline" size="icon" aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"} className="lg:hidden" onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</Button>
          <a href="/#destinos" className="hidden rounded-full bg-[#17483a] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#225b49] sm:inline-flex">Explorar</a>
        </div>
      </div>
      {searchOpen && <div className="border-t bg-white"><form onSubmit={handleSearch} className="container mx-auto flex gap-2 px-4 py-3"><Input autoFocus type="search" placeholder="Buscar noticias y artículos…" value={searchValue} onChange={(event) => setSearchValue(event.target.value)} aria-label="Buscar noticias y artículos" /><Button type="submit">Buscar</Button></form></div>}
      {menuOpen && <nav aria-label="Navegación móvil" className="border-t bg-white px-4 py-3 lg:hidden">{navLinks.map(({ href, label }) => <a key={href} href={href} onClick={() => setMenuOpen(false)} className="block rounded-lg px-3 py-3 font-semibold text-foreground hover:bg-muted">{label}</a>)}</nav>}
    </header>
  );
}
