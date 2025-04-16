import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import type { ArticleWithCategory } from "@shared/schema";

export default function PopularNewsSection() {
  const { data: popularArticles, isLoading } = useQuery<ArticleWithCategory[]>({
    queryKey: ["/api/articles", { popular: true, limit: 6 }],
  });

  if (isLoading) {
    return (
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-heading font-bold">Noticias Populares</h2>
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

  if (!popularArticles || popularArticles.length === 0) {
    return null;
  }

  // Split articles into two columns
  const firstColumnArticles = popularArticles.slice(0, 3);
  const secondColumnArticles = popularArticles.slice(3, 6);

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-heading font-bold">Noticias Populares</h2>
        <Link href="/articulo/populares">
          <a className="text-primary hover:underline font-semibold text-sm transition-colors">
            Ver todas <span aria-hidden="true">→</span>
          </a>
        </Link>
      </div>

      <div className="bg-neutral-100 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Popular News Column 1 */}
          <div className="space-y-4">
            {firstColumnArticles.map((article, index) => (
              <article key={article.id} className="flex gap-4 items-start">
                <span className={`text-4xl font-heading font-bold ${index === 0 ? 'text-primary' : 'text-neutral-300'}`}>
                  {String(index + 1).padStart(2, '0')}
                </span>
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

          {/* Popular News Column 2 */}
          <div className="space-y-4">
            {secondColumnArticles.map((article, index) => (
              <article key={article.id} className="flex gap-4 items-start">
                <span className="text-4xl font-heading font-bold text-neutral-300">
                  {String(index + 4).padStart(2, '0')}
                </span>
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
      </div>
    </section>
  );
}
