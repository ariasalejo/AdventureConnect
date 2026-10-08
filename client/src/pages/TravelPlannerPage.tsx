import { useMemo, useState } from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  ArrowUpRight,
  Compass,
  Leaf,
  MapPin,
  Mountain,
  Sparkles,
  Wallet,
  Waves,
  CalendarDays,
  Users,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type TravelStyle = "nature" | "adventure" | "culture" | "relax";

const styles: { id: TravelStyle; label: string; description: string; icon: typeof Leaf }[] = [
  { id: "nature", label: "Naturaleza", description: "Paisajes y aire libre", icon: Leaf },
  { id: "adventure", label: "Aventura", description: "Rutas y nuevas emociones", icon: Mountain },
  { id: "culture", label: "Cultura", description: "Sabores e historias locales", icon: Compass },
  { id: "relax", label: "Descanso", description: "Bajar el ritmo y desconectar", icon: Waves },
];

const destinations = [
  {
    name: "Guatapé y sus islas",
    region: "Antioquia, Colombia",
    styles: ["nature", "adventure"],
    description: "Agua, montañas verdes y un pueblo lleno de color para explorar sin afán.",
    image: "https://images.unsplash.com/photo-1583531352515-8884af319dc1?auto=format&fit=crop&w=1200&q=85",
    budget: "Desde $650.000 COP",
    days: "2–3 días",
    tag: "Escapada natural",
  },
  {
    name: "Eje Cafetero",
    region: "Quindío y Risaralda, Colombia",
    styles: ["nature", "culture", "relax"],
    description: "Fincas cafeteras, valles verdes y experiencias que conectan con lo local.",
    image: "https://images.unsplash.com/photo-1518182170546-076c4f6e9e4b?auto=format&fit=crop&w=1200&q=85",
    budget: "Desde $1.100.000 COP",
    days: "4–5 días",
    tag: "Favorito para explorar",
  },
  {
    name: "Santa Marta y Tayrona",
    region: "Magdalena, Colombia",
    styles: ["nature", "adventure", "relax"],
    description: "Selva tropical, playas y senderos para combinar aventura con descanso.",
    image: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1200&q=85",
    budget: "Desde $1.350.000 COP",
    days: "4–5 días",
    tag: "Mar y montaña",
  },
];

export default function TravelPlannerPage() {
  const [origin, setOrigin] = useState("Medellín");
  const [days, setDays] = useState("5");
  const [budget, setBudget] = useState("1500000");
  const [travelers, setTravelers] = useState("2");
  const [style, setStyle] = useState<TravelStyle>("nature");
  const [submitted, setSubmitted] = useState(false);

  const selectedStyle = styles.find((item) => item.id === style)!;
  const filteredDestinations = useMemo(
    () => destinations.filter((destination) => destination.styles.includes(style)),
    [style],
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    document.getElementById("recommendations")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-[#f8f7f3] text-[#172b25]">
      <section className="relative isolate overflow-hidden bg-[#102c25] text-white">
        <div className="absolute inset-0 -z-10">
          <img
            src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=2200&q=90"
            alt=""
            className="h-full w-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#102c25] via-[#102c25]/85 to-[#102c25]/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#102c25]/70 via-transparent to-[#102c25]/15" />
        </div>

        <div className="mx-auto max-w-7xl px-5 pb-16 pt-6 sm:px-8 lg:px-10 lg:pb-24">
          <header className="flex items-center justify-between border-b border-white/15 pb-5">
            <Link href="/" className="inline-flex items-center gap-3" aria-label="AdventureConnect, inicio">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#d5f078] text-[#17372d]">
                <Compass className="h-6 w-6" />
              </span>
              <span className="text-xl font-semibold tracking-tight">Adventure<span className="text-[#d5f078]">Connect</span></span>
            </Link>
            <nav className="hidden items-center gap-8 text-sm text-white/80 md:flex" aria-label="Navegación principal">
              <a href="#como-funciona" className="transition hover:text-white">Cómo funciona</a>
              <a href="#destinos" className="transition hover:text-white">Inspiración</a>
              <a href="#planificador" className="transition hover:text-white">Planificador</a>
            </nav>
            <a href="#planificador" className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-[#17372d] transition hover:bg-[#d5f078]">
              Crear mi viaje <ArrowUpRight className="h-4 w-4" />
            </a>
          </header>

          <div className="grid items-center gap-12 pt-16 md:grid-cols-[1.05fr_.95fr] md:pt-24">
            <div className="max-w-2xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium tracking-wide text-[#e5f4c1] backdrop-blur">
                <Sparkles className="h-4 w-4" /> VIAJES QUE EMPIEZAN CONTIGO
              </div>
              <h1 className="text-5xl font-semibold leading-[1.04] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
                El viaje ideal no se busca. <span className="text-[#d5f078]">Se descubre.</span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-white/75 sm:text-lg">
                Cuéntanos cuánto tiempo tienes, tu presupuesto y qué te mueve. Te ayudamos a descubrir destinos que encajan contigo.
              </p>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/80">
                <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-[#d5f078]" /> Recomendaciones con razones claras</span>
                <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-[#d5f078]" /> Presupuesto como punto de partida</span>
              </div>
            </div>

            <form id="planificador" onSubmit={handleSubmit} className="rounded-[1.75rem] border border-white/20 bg-[#fffefa] p-5 text-[#172b25] shadow-2xl shadow-black/20 sm:p-7">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#688075]">Tu próxima aventura</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight">Diseña tu viaje</h2>
                  <p className="mt-1 text-sm text-[#6e7e76]">Empieza con cuatro decisiones sencillas.</p>
                </div>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#e8efdd] text-[#365847]"><Compass className="h-5 w-5" /></span>
              </div>

              <div className="space-y-5">
                <div>
                  <Label htmlFor="origin" className="mb-2 block text-sm font-medium">¿Desde dónde sales?</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#718177]" />
                    <Input id="origin" value={origin} onChange={(event) => setOrigin(event.target.value)} placeholder="Ciudad de origen" className="h-12 rounded-xl border-[#dfe5dc] bg-white pl-10" required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="days" className="mb-2 block text-sm font-medium">Días disponibles</Label>
                    <div className="relative">
                      <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#718177]" />
                      <Input id="days" type="number" min="1" max="60" value={days} onChange={(event) => setDays(event.target.value)} className="h-12 rounded-xl border-[#dfe5dc] bg-white pl-10" required />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="travelers" className="mb-2 block text-sm font-medium">Viajeros</Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#718177]" />
                      <Input id="travelers" type="number" min="1" max="20" value={travelers} onChange={(event) => setTravelers(event.target.value)} className="h-12 rounded-xl border-[#dfe5dc] bg-white pl-10" required />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="budget" className="mb-2 block text-sm font-medium">Presupuesto total (COP)</Label>
                  <div className="relative">
                    <Wallet className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#718177]" />
                    <Input id="budget" type="number" min="1" value={budget} onChange={(event) => setBudget(event.target.value)} className="h-12 rounded-xl border-[#dfe5dc] bg-white pl-10" required />
                  </div>
                  <p className="mt-1.5 text-xs text-[#77867e]">Indica el presupuesto total para tu grupo.</p>
                </div>

                <fieldset>
                  <legend className="mb-3 text-sm font-medium">¿Qué quieres sentir en este viaje?</legend>
                  <div className="grid grid-cols-2 gap-2">
                    {styles.map((item) => {
                      const Icon = item.icon;
                      const active = style === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setStyle(item.id)}
                          aria-pressed={active}
                          className={`flex min-h-[76px] items-start gap-3 rounded-xl border p-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#547c5d] ${active ? "border-[#42684e] bg-[#eaf0e3] ring-1 ring-[#42684e]" : "border-[#e2e7df] bg-white hover:border-[#aebfae]"}`}
                        >
                          <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${active ? "text-[#365847]" : "text-[#829086]"}`} />
                          <span>
                            <span className="block text-sm font-semibold">{item.label}</span>
                            <span className="mt-1 block text-xs leading-4 text-[#77867e]">{item.description}</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <Button type="submit" className="h-13 w-full rounded-xl bg-[#234a38] py-6 text-base font-semibold text-white hover:bg-[#17372a]">
                  Descubrir destinos <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <p className="text-center text-xs text-[#7b8980]">Sin compromiso. Tú decides qué sigue.</p>
              </div>
            </form>
          </div>
        </div>
      </section>

      <section id="como-funciona" className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
        <div className="grid gap-8 md:grid-cols-[.8fr_1.2fr] md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#65806e]">Menos pestañas. Mejores decisiones.</p>
            <h2 className="mt-3 max-w-xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">Tu forma de viajar es el mejor punto de partida.</h2>
          </div>
          <p className="max-w-2xl text-base leading-7 text-[#6e7e76]">AdventureConnect está pensado para ayudarte a comparar posibilidades con contexto: qué puedes vivir, cuánto podrías gastar y por qué un destino merece estar en tu lista.</p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            { number: "01", title: "Cuéntanos tu intención", description: "Tiempo, presupuesto, origen y el estilo de experiencia que buscas." },
            { number: "02", title: "Compara opciones con sentido", description: "Explora destinos que encajan y entiende los compromisos de cada opción." },
            { number: "03", title: "Convierte ideas en un plan", description: "Organiza actividades y estima costes antes de elegir proveedores." },
          ].map((step) => (
            <article key={step.number} className="rounded-2xl border border-[#e6e8df] bg-white p-6">
              <span className="text-sm font-semibold text-[#8b9d86]">{step.number}</span>
              <h3 className="mt-5 text-xl font-semibold">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#738078]">{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="recommendations" className="bg-[#eeefe7]">
        <div id="destinos" className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#65806e]">{submitted ? "Tu selección" : "Inspírate para empezar"}</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{submitted ? "Lugares que conectan con tu estilo" : "Ideas para tu próximo capítulo"}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6e7e76]">
                {submitted
                  ? `Estilo: ${selectedStyle.label}. Origen: ${origin || "por definir"}. ${days} días para ${travelers} viajero(s); presupuesto indicado: ${Number(budget || 0).toLocaleString("es-CO")} COP.`
                  : "Una primera selección de inspiración. Los costes son orientativos y deben verificarse antes de reservar."}
              </p>
            </div>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-[#486b54]"><Sparkles className="h-4 w-4" /> Viaja a tu manera</span>
          </div>

          {submitted && (
            <div role="status" className="mt-6 rounded-xl border border-[#d3ddcb] bg-white px-4 py-3 text-sm text-[#526a57]">
              Vista preliminar filtrada por estilo. Todavía no se ha consultado el Decision Engine ni se han validado precios en tiempo real.
            </div>
          )}

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {(submitted ? filteredDestinations : destinations).map((destination) => (
              <article key={destination.name} className="group overflow-hidden rounded-2xl border border-[#e1e5db] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#253c2b]/10">
                <div className="relative h-56 overflow-hidden">
                  <img src={destination.image} alt={destination.name} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  <span className="absolute left-4 top-4 rounded-full bg-[#fffefa]/95 px-3 py-1.5 text-xs font-semibold text-[#34533f]">{destination.tag}</span>
                </div>
                <div className="p-5">
                  <p className="flex items-center gap-1.5 text-xs font-medium text-[#7a887d]"><MapPin className="h-3.5 w-3.5" /> {destination.region}</p>
                  <h3 className="mt-2 text-xl font-semibold tracking-tight">{destination.name}</h3>
                  <p className="mt-2 min-h-[60px] text-sm leading-6 text-[#6e7e76]">{destination.description}</p>
                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#edf0e9] pt-4">
                    <div>
                      <p className="text-xs text-[#7a887d]">Estimación inicial</p>
                      <p className="mt-1 text-sm font-semibold">{destination.budget}</p>
                      <p className="mt-1 text-xs text-[#7a887d]">{destination.days}</p>
                    </div>
                    <a href="#planificador" className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#eaf0e3] text-[#31533e] transition hover:bg-[#d5f078]" aria-label={`Personalizar viaje a ${destination.name}`}>
                      <ArrowUpRight className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
          {submitted && filteredDestinations.length === 0 && (
            <div className="mt-8 rounded-2xl border border-dashed border-[#cbd5c5] bg-white p-8 text-center">
              <p className="font-semibold">Estamos ampliando esta selección.</p>
              <p className="mt-2 text-sm text-[#6e7e76]">Prueba otro estilo para ver más ideas de viaje.</p>
            </div>
          )}
          <p className="mt-6 text-xs leading-5 text-[#7a887d]">Los destinos y presupuestos mostrados son contenido demostrativo. No constituyen cotizaciones, disponibilidad ni recomendaciones calculadas por un motor conectado a datos reales.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="overflow-hidden rounded-[1.75rem] bg-[#d8e5c6] p-8 sm:p-12 lg:flex lg:items-center lg:justify-between lg:gap-10">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#526d52]">El mundo no va a explorarse solo</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">Tu próxima historia empieza con una buena decisión.</h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-[#526b57]">Empieza con lo que tienes. Nosotros te ayudamos a descubrir las posibilidades.</p>
          </div>
          <a href="#planificador" className="mt-7 inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#234a38] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#17372a] lg:mt-0">
            Planear mi viaje <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      <footer className="border-t border-[#e5e7df] bg-[#f8f7f3]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-sm text-[#718077] sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
          <Link href="/" className="font-semibold text-[#244735]">AdventureConnect</Link>
          <p>Decide better. Travel better.</p>
          <p>© {new Date().getFullYear()} AdventureConnect</p>
        </div>
      </footer>
    </div>
  );
}
