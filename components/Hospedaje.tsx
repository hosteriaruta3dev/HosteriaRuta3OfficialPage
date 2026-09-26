import Link from "next/link";
import {
  BedDouble,
  CalendarDays,
  Car,
  PawPrint,
  Users,
} from "lucide-react";
import RoomGallery from "./RoomGallery";

const BENEFITS = [
  {
    icon: PawPrint,
    title: "Pet friendly",
    description: "Tus mascotas también son bienvenidas a descansar.",
  },
  {
    icon: Car,
    title: "Cochera techada",
    description: "Guardás tu vehículo dentro del predio, con tranquilidad.",
  },
  {
    icon: Users,
    title: "Hasta 8 personas",
    description: "Ideal para familias y grupos que viajan juntos.",
  },
  {
    icon: BedDouble,
    title: "Completamente equipado",
    description: "Habitaciones confortables, listas para el descanso.",
  },
];

export default function Hospedaje({
  images,
  roomName,
}: {
  images: string[];
  roomName: string;
}) {
  return (
    <section
      id="hospedaje"
      className="scroll-mt-20 bg-sand-100 py-16 sm:py-24"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-14">
        <div className="relative">
          <RoomGallery images={images} name={roomName} aspect="4/5" />
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-sand-700">
            Hospedaje
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight text-brand-900 sm:text-4xl">
            Pará en la Ruta 3 y descansá de verdad
          </h2>
          <p className="mt-4 text-base leading-relaxed text-brand-800/80 sm:text-lg">
            Alquiler temporario pensado para el viajero: llegás, guardás el auto en
            la cochera techada y te relajás en un ambiente tranquilo y familiar.
            Apto para familias, grupos y mascotas.
          </p>

          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {BENEFITS.map((benefit) => (
              <li
                key={benefit.title}
                className="flex items-start gap-3 rounded-2xl border border-sand-200 bg-white/70 p-4"
              >
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-700 text-sand-100">
                  <benefit.icon className="h-5 w-5" aria-hidden />
                </span>
                <span>
                  <span className="block font-semibold text-brand-900">
                    {benefit.title}
                  </span>
                  <span className="mt-1 block text-sm leading-snug text-brand-800/70">
                    {benefit.description}
                  </span>
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col items-start gap-4">
            <Link
              href="/disponibilidad?tipo=habitaciones"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-700 px-7 py-3.5 text-base font-semibold text-sand-50 transition-colors hover:bg-brand-800"
            >
              <CalendarDays className="h-5 w-5" aria-hidden />
              Consultar disponibilidad
            </Link>
            <p className="text-sm text-brand-800/80">
              Mirá qué días están libres las habitaciones y reservá tu favorita.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}