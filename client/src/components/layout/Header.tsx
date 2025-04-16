import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@shared/schema";
import { Search } from "@/components/ui/search";

interface HeaderProps {
  onMenuToggle: () => void;
  onSearchToggle: () => void;
  isMobileSearchOpen: boolean;
}

export default function Header({ onMenuToggle, onSearchToggle, isMobileSearchOpen }: HeaderProps) {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <a className="headline-font text-2xl md:text-3xl font-bold text-primary">
                FameStream
              </a>
            </Link>
          </div>
          
          {/* Search (desktop) */}
          <div className="hidden md:block w-1/3">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Buscar noticias..." 
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute left-3 top-2.5 text-gray-400">
                  <i className="fas fa-search"></i>
                </div>
              </div>
            </form>
          </div>
          
          {/* Navigation toggles */}
          <div className="flex items-center space-x-4">
            <button className="md:hidden text-neutral-text" onClick={onSearchToggle}>
              <i className="fas fa-search text-xl"></i>
            </button>
            <button className="text-neutral-text" onClick={onMenuToggle}>
              <i className="fas fa-bars text-xl"></i>
            </button>
          </div>
        </div>
        
        {/* Mobile search (hidden by default) */}
        <div className={`md:hidden pb-3 ${isMobileSearchOpen ? 'block' : 'hidden'}`}>
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Buscar noticias..." 
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <i className="fas fa-search"></i>
              </div>
            </div>
          </form>
        </div>
      </div>
      
      {/* Categories navigation */}
      <nav className="bg-white border-t border-gray-200 overflow-x-auto">
        <div className="container mx-auto">
          <ul className="flex whitespace-nowrap px-4 py-2 space-x-6">
            {categories.map((category) => (
              <li key={category.id}>
                <Link href={`/categoria/${category.slug}`}>
                  <a className="text-neutral-text hover:text-primary font-medium text-sm">
                    {category.name}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
