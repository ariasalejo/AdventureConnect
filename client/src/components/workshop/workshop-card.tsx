import { Workshop } from "@shared/schema";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface WorkshopCardProps {
  workshop: Workshop;
}

export function WorkshopCard({ workshop }: WorkshopCardProps) {
  const formatDate = (date: Date) => {
    return format(new Date(date), "d MMMM, yyyy", { locale: es });
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img 
          src={workshop.imageUrl} 
          alt={workshop.title} 
          className="w-full h-48 object-cover"
        />
        <div className={`absolute top-0 right-0 ${workshop.availableSpots === 0 ? 'bg-[#ED8936]' : 'bg-primary'} text-white py-1 px-3 rounded-bl-lg font-semibold`}>
          {workshop.availableSpots === 0 
            ? "Completo"
            : `${workshop.availableSpots} plazas disponibles`}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-heading font-bold text-lg mb-1">{workshop.title}</h3>
        <p className="text-neutral-600 text-sm mb-2">{workshop.description}</p>
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-neutral-500">
            <i className="far fa-calendar-alt mr-1"></i> {formatDate(workshop.date)}
          </span>
          <span className="text-sm text-neutral-500">
            <i className="far fa-clock mr-1"></i> {workshop.startTime} - {workshop.endTime}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-bold text-primary text-lg">{workshop.price}€</span>
          <button 
            className={`${workshop.availableSpots === 0 
              ? 'bg-neutral-400 cursor-not-allowed' 
              : 'bg-[#48BB78] hover:bg-[#38A169]'} text-white px-4 py-2 rounded transition-colors`}
          >
            {workshop.availableSpots === 0 ? "Lista de espera" : "Reservar"}
          </button>
        </div>
      </div>
    </div>
  );
}
