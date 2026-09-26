import Link from "next/link";
import Image from "next/image";
import { BedDouble, Eye, Pencil } from "lucide-react";
import { readStore } from "@/lib/data";

const CURRENCY = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

export default async function AdminRoomsPage() {
  const { rooms } = await readStore();

  return (
    <div className="flex flex-col gap-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-widest text-sand-700">
          Panel de administración
        </p>
        <h1 className="mt-1 font-serif text-2xl font-semibold text-brand-900">
          Habitaciones y salón
        </h1>
        <p className="mt-1 text-sm text-brand-800/70">
          Editá los datos que se muestran en la página principal: precios,
          descripciones, imágenes y más.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {rooms.map((room) => (
          <article
            key={room.id}
            className="flex overflow-hidden rounded-3xl border border-sand-200 bg-white/80 shadow-sm"
          >
            <div className="relative w-32 shrink-0 bg-sand-200 sm:w-40">
              {room.images[0] ? (
                <Image
                  src={room.images[0]}
                  alt=""
                  fill
                  sizes="160px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-brand-300">
                  <BedDouble className="h-8 w-8" />
                </div>
              )}
            </div>

            <div className="flex flex-1 flex-col gap-2 p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-sand-700">
                    {room.type === "salon" ? "Salón de eventos" : "Habitación"}
                  </p>
                  <h2 className="font-serif text-lg font-semibold leading-tight text-brand-900">
                    {room.name}
                  </h2>
                </div>
                {!room.active && (
                  <span className="rounded-full bg-sand-200 px-2.5 py-1 text-[11px] font-semibold text-brand-800">
                    Oculta
                  </span>
                )}
              </div>

              <p className="text-sm font-semibold text-brand-950">
                {CURRENCY.format(room.price)}{" "}
                <span className="font-normal text-brand-800/80">
                  · hasta {room.capacity} pers.
                </span>
              </p>

              <div className="mt-auto flex gap-2 pt-1">
                <Link
                  href={`/admin/habitaciones/${room.id}`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-brand-700 px-4 py-2 text-sm font-semibold text-sand-100 transition-colors hover:bg-brand-800"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Editar
                </Link>
                <Link
                  href="/disponibilidad"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-sand-300 px-4 py-2 text-sm font-semibold text-brand-800 transition-colors hover:bg-sand-100"
                >
                  <Eye className="h-3.5 w-3.5" />
                  Vista pública
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}