import { useState, useCallback } from "react";
import { useLocation } from "wouter";

export function useSearch() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [, navigate] = useLocation();

  const handleSearch = useCallback(
    (searchQuery?: string) => {
      const queryToUse = searchQuery !== undefined ? searchQuery : query;
      
      if (!queryToUse.trim()) return;
      
      setIsSearching(true);
      navigate(`/search?q=${encodeURIComponent(queryToUse.trim())}`);
      setIsSearching(false);
    },
    [query, navigate]
  );

  const updateQuery = useCallback((value: string) => {
    setQuery(value);
  }, []);

  return {
    query,
    updateQuery,
    handleSearch,
    isSearching,
  };
}
