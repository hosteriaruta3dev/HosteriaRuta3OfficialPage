import Link from "next/link";
import { ArrowLeft, Check, Users } from "lucide-react";
import { readStore } from "@/lib/data";
import type { Room } from "@/lib/data";
import RoomGallery from "./RoomGallery";
import RoomAvailability from "./RoomAvailability";

const CURRENCY = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

export default async function RoomDetail({ room }: { room: Room }) {
  const { occupancies } = await readStore();
  const isSalon = room.type === "salon";

  return (
    <section className="bg-sand-50 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 transition-colors hover:text-brand-900"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Volver a la hostería
        </Link>

        <div className="mt-6 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-sand-700">
            {isSalon ? "Salón de eventos" : "Habitación"}
          </p>
          <h1 className="mt-2 font-serif text-3xl font-semibold leading-tight text-brand-900 sm:text-4xl">
            {room.name}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-brand-800/80 sm:text-lg">
            {room.description}
          </p>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-14">
          <RoomGallery images={room.images} name={room.name} />

          <div className="flex flex-col gap-6">
            <div className="rounded-3xl border border-sand-200 bg-white/70 p-6 shadow-md">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-sand-700">
                    Tarifa
                  </p>
                  <p className="mt-1 font-serif text-3xl font-semibold text-brand-900">
                    {CURRENCY.format(room.price)}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-700 px-4 py-1.5 text-sm font-semibold text-sand-100">
                  <Users className="h-4 w-4" aria-hidden />
                  {room.capacity}{" "}
                  {room.capacity === 1 ? "persona" : "personas"}
                </span>
              </div>

              {room.amenities.length > 0 && (
                <ul className="mt-6 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
                  {room.amenities.map((amenity) => (
                    <li
                      key={amenity}
                      className="inline-flex items-start gap-2 text-sm text-brand-800"
                    >
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-brand-600"
                        aria-hidden
                      />
                      {amenity}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <RoomAvailability room={room} initialOccupancies={occupancies} />
          </div>
        </div>
      </div>
    </section>
  );
}