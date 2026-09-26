import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Users } from "lucide-react";
import { getActiveRooms } from "@/lib/data";

const CURRENCY = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

export default async function RoomCards() {
  const rooms = (await getActiveRooms()).filter(
    (room) => room.type === "habitacion",
  );
  if (rooms.length === 0) return null;

  return (
    <section id="habitaciones" className="scroll-mt-20 bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-sand-700">
              Habitaciones
            </p>
            <h2 className="mt-2 font-serif text-3xl font-semibold leading-tight text-brand-900 sm:text-4xl">
              Elegí dónde descansar
            </h2>
            <p className="mt-3 text-brand-800/80">
              Tres opciones, todas equipadas y con cochera techada. Tocá cada una
              para ver fotos, detalles y tarifas.
            </p>
          </div>
          <Link
            href="/disponibilidad?tipo=habitaciones"
            className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-brand-700 px-5 py-2.5 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-700 hover:text-sand-100"
          >
            <CalendarDays className="h-4 w-4" aria-hidden />
            Consultar disponibilidad
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <article
              key={room.id}
              className="group flex flex-col overflow-hidden rounded-3xl border border-sand-200 bg-white shadow-md transition-shadow hover:shadow-lg"
            >
              <Link
                href={`/habitaciones/${room.id}`}
                className="relative block aspect-[4/3] overflow-hidden bg-sand-200"
              >
                {room.images[0] ? (
                  <Image
                    src={room.images[0]}
                    alt={room.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-brand-400">
                    <CalendarDays className="h-10 w-10" />
                  </div>
                )}
              </Link>

              <div className="flex flex-1 flex-col gap-3 p-5">
                <h3 className="font-serif text-xl font-semibold text-brand-900">
                  {room.name}
                </h3>
                <p className="line-clamp-2 text-sm text-brand-800/80">
                  {room.description}
                </p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-brand-800">
                  <span className="font-semibold text-brand-950">
                    {CURRENCY.format(room.price)}
                  </span>
                  <span className="inline-flex items-center gap-1 text-brand-600">
                    <Users className="h-4 w-4" aria-hidden />
                    {room.capacity}{" "}
                    {room.capacity === 1 ? "persona" : "personas"}
                  </span>
                </div>
                <Link
                  href={`/habitaciones/${room.id}`}
                  className="mt-auto inline-flex items-center justify-center gap-2 rounded-full bg-brand-700 px-5 py-2.5 text-sm font-semibold text-sand-100 transition-colors hover:bg-brand-800"
                >
                  Ver detalles
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}