import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import type { Category } from "@shared/schema";

interface CategoryFilterProps {
  activeCategory?: string;
}

export default function CategoryFilter({ activeCategory }: CategoryFilterProps) {
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  if (isLoading) {
    return (
      <section className="mb-8">
        <h2 className="text-xl font-heading font-bold mb-4">Explorar por categoría</h2>
        <div className="flex flex-wrap gap-2">
          <div className="bg-neutral-100 w-16 h-8 rounded-full animate-pulse"></div>
          <div className="bg-neutral-100 w-20 h-8 rounded-full animate-pulse"></div>
          <div className="bg-neutral-100 w-24 h-8 rounded-full animate-pulse"></div>
          <div className="bg-neutral-100 w-16 h-8 rounded-full animate-pulse"></div>
          <div className="bg-neutral-100 w-20 h-8 rounded-full animate-pulse"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8">
      <h2 className="text-xl font-heading font-bold mb-4">Explorar por categoría</h2>
      <div className="flex flex-wrap gap-2">
        <Link href="/">
          <a className={cn(
            "px-4 py-2 rounded-full text-sm font-semibold transition-colors",
            !activeCategory 
              ? "bg-primary text-white" 
              : "bg-neutral-100 text-neutral-700 hover:bg-primary hover:text-white"
          )}>
            Todas
          </a>
        </Link>
        
        {categories?.map((category) => (
          <Link key={category.id} href={`/categoria/${category.slug}`}>
            <a className={cn(
              "px-4 py-2 rounded-full text-sm font-semibold transition-colors",
              activeCategory === category.slug 
                ? "bg-primary text-white" 
                : "bg-neutral-100 text-neutral-700 hover:bg-primary hover:text-white"
            )}>
              {category.name}
            </a>
          </Link>
        ))}
      </div>
    </section>
  );
}
