import { useState, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Search as SearchIcon } from "lucide-react";

interface SearchProps {
  onSearch?: (query: string) => void;
  className?: string;
  placeholder?: string;
}

export function Search({ onSearch, className = "", placeholder = "Buscar noticias..." }: SearchProps) {
  const [query, setQuery] = useState("");
  const [, navigate] = useLocation();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    if (onSearch) {
      onSearch(query);
    } else {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <Input
        type="search"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-10 w-full pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
      />
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        <SearchIcon className="h-4 w-4" />
      </div>
    </form>
  );
}
