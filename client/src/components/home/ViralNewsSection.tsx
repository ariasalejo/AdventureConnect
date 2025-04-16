
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import type { ArticleWithCategory } from "@shared/schema";

export default function ViralNewsSection() {
  const { data: viralArticles, isLoading } = useQuery<ArticleWithCategory[]>({
    queryKey: ["/api/articles", { viral: true, limit: 6 }],
  });

  if (isLoading) {
    return (
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-heading font-bold">Noticias Virales</h2>
          <div className="w-20 h-6 bg-neutral-100 animate-pulse rounded"></div>
        </div>
        <div className="bg-neutral-100 rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array(6).fill(null).map((_, index) => (
              <div key={index} className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-neutral-200 animate-pulse rounded"></div>
                <div className="flex-1">
                  <div className="w-full h-5 bg-neutral-200 animate-pulse rounded mb-2"></div>
                  <div className="w-full h-4 bg-neutral-200 animate-pulse rounded mb-2"></div>
                  <div className="w-20 h-3 bg-neutral-200 animate-pulse rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!viralArticles || viralArticles.length === 0) {
    return null;
  }

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-heading font-bold">Noticias Virales</h2>
        <Link href="/articulo/virales">
          <a className="text-primary hover:underline font-semibold text-sm transition-colors">
            Ver todas <span aria-hidden="true">→</span>
          </a>
        </Link>
      </div>
      <div className="bg-neutral-100 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {viralArticles.map((article) => (
            <article key={article.id} className="flex gap-4 items-start group">
              <div className="relative w-20 h-20 overflow-hidden rounded-lg flex-shrink-0">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                />
              </div>
              <div>
                <Link href={`/articulo/${article.slug}`}>
                  <a className="group">
                    <h3 className="text-base font-heading font-bold group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-sm text-neutral-500 mt-1 line-clamp-2">
                      {article.excerpt}
                    </p>
                    <span className="text-xs text-neutral-400 mt-1 inline-block">
                      {article.viewCount} lecturas
                    </span>
                  </a>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
