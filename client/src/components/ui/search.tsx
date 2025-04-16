import { useState } from "react";
import { Input } from "./input";
import { useLocation } from "wouter";

interface SearchProps {
  mobile?: boolean;
  placeholder?: string;
}

export function Search({ mobile = false, placeholder = "Buscar artículos, talleres, eventos..." }: SearchProps) {
  const [query, setQuery] = useState("");
  const [, setLocation] = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setLocation(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className={`relative ${mobile ? "w-full" : "w-1/3 hidden md:block"}`}>
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={`w-full pl-10 pr-4 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${mobile ? "mb-4" : ""}`}
      />
      <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500 ${mobile ? "left-3" : ""}`}>
        <i className="fas fa-search"></i>
      </span>
    </form>
  );
}
