import FeaturedNews from "@/components/homepage/FeaturedNews";
import LatestNews from "@/components/homepage/LatestNews";
import Sidebar from "@/components/homepage/Sidebar";
import BreakingNewsBanner from "@/components/homepage/BreakingNewsBanner";
import { Helmet } from "react-helmet";

export default function Home() {
  return (
    <>
      <Helmet>
        <title>FameStream News - Noticias y actualidad</title>
        <meta name="description" content="FameStream News - Tu portal de noticias de actualidad, política, economía, deportes, tecnología y más. Información actualizada las 24 horas." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-6">
        <FeaturedNews />
        
        <BreakingNewsBanner />
        
        <div className="flex flex-col lg:flex-row gap-8">
          <LatestNews />
          <Sidebar />
        </div>
      </div>
    </>
  );
}
