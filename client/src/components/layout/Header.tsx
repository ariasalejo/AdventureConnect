import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Search, Menu, ChevronDown, ChevronUp } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { Category } from "@shared/schema";

export default function Header() {
  const [, setLocation] = useLocation();
  const [searchValue, setSearchValue] = useState("");
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);

  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const toggleSearch = () => {
    setIsSearchBarVisible(!isSearchBarVisible);
    if (!isSearchBarVisible) {
      setTimeout(() => {
        document.getElementById("search-input")?.focus();
      }, 100);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleMobileCategories = () => {
    setIsMobileCategoriesOpen(!isMobileCategoriesOpen);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      setLocation(`/buscar?q=${encodeURIComponent(searchValue.trim())}`);
      setIsSearchBarVisible(false);
      setSearchValue("");
    } else {
      toast({
        title: "Búsqueda vacía",
        description: "Por favor, ingrese un término de búsqueda",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-neutral-200 shadow-sm">
      <div className="container mx-auto px-4">
        {/* Top Header */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <div className="inline-block">
                <h1 className="text-2xl md:text-3xl font-heading font-bold text-neutral-700">
                  <span className="text-primary">Fame</span>Stream
                </h1>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/">
              <div className="text-neutral-700 hover:text-primary font-semibold transition-colors">
                Inicio
              </div>
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-neutral-700 hover:text-primary font-semibold flex items-center transition-colors">
                  Categorías <ChevronDown className="ml-1 h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {isLoading ? (
                  <DropdownMenuItem disabled>Cargando...</DropdownMenuItem>
                ) : (
                  categories?.map((category) => (
                    <DropdownMenuItem key={category.id} asChild>
                      <Link href={`/categoria/${category.slug}`}>
                        <div className="w-full">{category.name}</div>
                      </Link>
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Link href="/articulo/nuevos">
              <div className="text-neutral-700 hover:text-primary font-semibold transition-colors">
                Más Recientes
              </div>
            </Link>
            
            <Link href="/articulo/populares">
              <div className="text-neutral-700 hover:text-primary font-semibold transition-colors">
                Populares
              </div>
            </Link>
          </nav>

          {/* Search & Menu Buttons */}
          <div className="flex items-center space-x-2">
            <button 
              onClick={toggleSearch}
              className="p-2 text-neutral-400 hover:text-primary transition-colors"
              aria-label="Buscar"
            >
              <Search className="h-5 w-5" />
            </button>
            
            <button 
              onClick={toggleMobileMenu}
              className="p-2 text-neutral-400 hover:text-primary md:hidden transition-colors"
              aria-label="Menú"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className={cn("py-3 transition-all duration-300", isSearchBarVisible ? "block" : "hidden")}>
          <form onSubmit={handleSearch} className="relative">
            <Input
              id="search-input"
              type="text"
              placeholder="Buscar noticias, temas o autores..."
              className="w-full pl-4 pr-10 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <Button 
              type="submit"
              variant="ghost" 
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-primary"
              aria-label="Buscar"
            >
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </div>

        {/* Mobile Menu */}
        <div className={cn("md:hidden py-4 transition-all duration-300", isMobileMenuOpen ? "block" : "hidden")}>
          <nav className="flex flex-col space-y-4">
            <Link href="/">
              <div className="text-neutral-700 hover:text-primary font-semibold py-2 transition-colors">
                Inicio
              </div>
            </Link>
            
            <div className="py-2">
              <button 
                onClick={toggleMobileCategories}
                className="text-neutral-700 hover:text-primary font-semibold flex items-center justify-between w-full transition-colors"
              >
                Categorías 
                {isMobileCategoriesOpen ? (
                  <ChevronUp className="ml-1 h-4 w-4" />
                ) : (
                  <ChevronDown className="ml-1 h-4 w-4" />
                )}
              </button>
              
              <div className={cn("mt-2 pl-4 border-l-2 border-neutral-200 transition-all duration-300", 
                isMobileCategoriesOpen ? "block" : "hidden")}>
                {isLoading ? (
                  <div className="py-2 text-neutral-400">Cargando...</div>
                ) : (
                  categories?.map((category) => (
                    <Link key={category.id} href={`/categoria/${category.slug}`}>
                      <div className="block py-2 text-neutral-700 hover:text-primary transition-colors">
                        {category.name}
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
            
            <Link href="/articulo/nuevos">
              <div className="text-neutral-700 hover:text-primary font-semibold py-2 transition-colors">
                Más Recientes
              </div>
            </Link>
            
            <Link href="/articulo/populares">
              <div className="text-neutral-700 hover:text-primary font-semibold py-2 transition-colors">
                Populares
              </div>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
