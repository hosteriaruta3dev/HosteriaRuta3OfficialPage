import Link from "next/link";
import {
  Armchair,
  CalendarDays,
  Flame,
  PartyPopper,
  Sparkles,
  ToyBrick,
  TreePine,
  UtensilsCrossed,
} from "lucide-react";
import FeaturedPhoto from "./FeaturedPhoto";
import { SITE } from "@/lib/constants";
import type { Room } from "@/lib/data";

const CURRENCY = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

const AMENITIES = [
  { icon: Flame, label: "Calefacción" },
  { icon: UtensilsCrossed, label: "Vajilla completa" },
  { icon: Sparkles, label: "Limpieza incluida" },
  { icon: Armchair, label: "Mesas y sillas" },
  { icon: TreePine, label: "Espacio al aire libre y cancha" },
  { icon: ToyBrick, label: "Juegos para niños" },
];

export default function Salon({ salon }: { salon: Room | null }) {
  const photo = salon?.images[0] ?? null;

  return (
    <section
      id="salon"
      className="scroll-mt-20 bg-brand-800 py-16 text-sand-100 sm:py-24"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-14">
        <div className="order-2 lg:order-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-sand-400">
            Salón de eventos
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight text-sand-50 sm:text-4xl">
            Festejar en casa, ¿de verdad sale más barato?
          </h2>
          <p className="mt-4 text-base leading-relaxed text-sand-100/80 sm:text-lg">
            Pensalo: la vajilla, el salón, la limpieza después… En Hostería Ruta 3
            festejás sin complicarte. Llegás, celebramos, y la limpieza y el orden
            son cosa nuestra.
          </p>

          <ul className="mt-7 flex flex-wrap gap-2.5">
            {AMENITIES.map((amenity) => (
              <li
                key={amenity.label}
                className="inline-flex items-center gap-2 rounded-full border border-sand-300/25 bg-white/5 px-4 py-2.5 text-sm font-medium text-sand-50"
              >
                <amenity.icon className="h-4 w-4 text-sand-400" aria-hidden />
                {amenity.label}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row">
            <Link
              href="/salon"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-sand-200/40 px-7 py-3.5 text-base font-semibold text-sand-100 transition-colors hover:bg-white/10"
            >
              <PartyPopper className="h-5 w-5" aria-hidden />
              Ver el salón
            </Link>
            <Link
              href="/disponibilidad?tipo=salon"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-sand-200 px-7 py-3.5 text-base font-semibold text-brand-900 transition-colors hover:bg-white"
            >
              <CalendarDays className="h-5 w-5" aria-hidden />
              Consultar disponibilidad
            </Link>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          {photo ? (
            <FeaturedPhoto
              src={photo}
              alt={`${salon?.name ?? "Salón de eventos"} de ${SITE.name}`}
              aspect="aspect-[4/3]"
              showBadge={false}
            >
              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center p-4 sm:p-6">
                <div className="flex flex-col items-center gap-1 rounded-2xl bg-brand-950/80 px-5 py-4 text-center backdrop-blur-sm">
                  <span className="flex items-center gap-2 font-serif text-3xl font-semibold text-sand-50 sm:text-4xl">
                    <PartyPopper className="h-7 w-7 text-sand-400" aria-hidden />
                    {salon ? `Desde ${CURRENCY.format(salon.price)}` : "Consultá la tarifa"}
                  </span>
                  <span className="text-sm font-medium text-sand-200/90">
                    Capacidad hasta {salon?.capacity ?? 40} personas · Incluye limpieza y vajilla
                  </span>
                </div>
              </div>
            </FeaturedPhoto>
          ) : (
            <div className="aspect-[4/3] rounded-3xl border border-dashed border-sand-300/40 bg-white/5" />
          )}
        </div>
      </div>
    </section>
  );
}