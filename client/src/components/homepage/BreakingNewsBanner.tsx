import { useQuery } from "@tanstack/react-query";
import { BreakingNews } from "@shared/schema";

export default function BreakingNewsBanner() {
  const { data: breakingNews = [], isLoading } = useQuery<BreakingNews[]>({
    queryKey: ['/api/breaking-news'],
  });

  if (isLoading) {
    return (
      <div className="bg-[#E63946] text-white px-4 py-3 rounded-lg mb-10 shadow-md animate-pulse">
        <div className="h-5 bg-white bg-opacity-20 rounded"></div>
      </div>
    );
  }

  if (breakingNews.length === 0) {
    return null;
  }

  return (
    <div className="bg-[#E63946] text-white px-4 py-3 rounded-lg mb-10 shadow-md">
      <div className="flex items-center">
        <span className="font-bold mr-3 whitespace-nowrap">ÚLTIMA HORA:</span>
        <div className="overflow-hidden">
          <div className="whitespace-nowrap animate-marquee">
            {breakingNews[0].content}
          </div>
        </div>
      </div>
    </div>
  );
}
