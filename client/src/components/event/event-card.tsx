import { Event } from "@shared/schema";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const day = format(new Date(event.date), "d", { locale: es });
  const month = format(new Date(event.date), "MMM", { locale: es }).toUpperCase();
  
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden border-l-4 hover:shadow-lg transition-shadow`} style={{ borderColor: event.borderColor }}>
      <div className="p-4">
        <div className="flex items-start">
          <div className="bg-neutral-100 rounded p-2 text-center mr-4">
            <span className="block text-xl font-bold" style={{ color: event.borderColor }}>{day}</span>
            <span className="block text-sm text-neutral-600">{month}</span>
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg mb-1">{event.title}</h3>
            <p className="text-neutral-600 text-sm mb-2">{event.description}</p>
            <div className="flex items-center text-sm text-neutral-500">
              <i className="fas fa-map-marker-alt mr-1"></i>
              <span>{event.location}</span>
            </div>
          </div>
        </div>
        <div className="mt-3 flex justify-between items-center">
          <span className="text-sm font-semibold text-primary">{event.price}</span>
          <button 
            className="text-white px-3 py-1 rounded text-sm transition-colors"
            style={{ 
              backgroundColor: event.borderColor,
              // Darken the hover color
              ':hover': { backgroundColor: `${event.borderColor}dd` }
            }}
          >
            {event.buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
