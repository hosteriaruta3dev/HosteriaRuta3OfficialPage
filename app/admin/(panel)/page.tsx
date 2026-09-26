import Link from "next/link";
import {
  BedDouble,
  CalendarRange,
  CircleCheck,
  CircleX,
  LayoutDashboard,
  Users,
} from "lucide-react";
import { readStore } from "@/lib/data";
import { toISODate } from "@/lib/date";

export default async function AdminDashboardPage() {
  const { rooms, occupancies } = await readStore();
  const today = toISODate(new Date());
  const occupiedToday = occupancies.filter((entry) => entry.date === today).length;
  const activeRooms = rooms.filter((room) => room.active);

  return (
    <div className="flex flex-col gap-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-widest text-sand-700">
          Panel de administración
        </p>
        <h1 className="mt-1 font-serif text-2xl font-semibold text-brand-900">
          Inicio
        </h1>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-sand-200 bg-white/80 p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-sand-700">
            Unidades activas
          </p>
          <p className="mt-2 flex items-center gap-2 font-serif text-3xl font-semibold text-brand-900">
            <BedDouble className="h-6 w-6 text-brand-700" />
            {activeRooms.length}
          </p>
          <p className="mt-1 text-sm text-brand-800/70">
            Sobre {rooms.length} en total
          </p>
        </div>

        <div className="rounded-2xl border border-sand-200 bg-white/80 p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-sand-700">
            Unidades ocupadas hoy
          </p>
          <p className="mt-2 flex items-center gap-2 font-serif text-3xl font-semibold text-brand-900">
            <CircleX className="h-6 w-6 text-red-500" />
            {occupiedToday}
          </p>
          <p className="mt-1 text-sm text-brand-800/70">
            Marcadas como ocupadas para hoy
          </p>
        </div>

        <div className="rounded-2xl border border-sand-200 bg-white/80 p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-sand-700">
            Capacidad total
          </p>
          <p className="mt-2 flex items-center gap-2 font-serif text-3xl font-semibold text-brand-900">
            <Users className="h-6 w-6 text-brand-700" />
            {activeRooms.reduce((sum, room) => sum + room.capacity, 0)}
          </p>
          <p className="mt-1 text-sm text-brand-800/70">
            Personas en todas las unidades
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/habitaciones"
          className="group rounded-3xl border border-sand-200 bg-white/80 p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-700 text-sand-100">
            <BedDouble className="h-5 w-5" />
          </span>
          <h2 className="mt-4 font-serif text-xl font-semibold text-brand-900">
            Editar habitaciones
          </h2>
          <p className="mt-1 text-sm text-brand-800/70">
            Precios, descripciones, amenities e imágenes de cada unidad.
          </p>
          <span className="mt-4 inline-block text-sm font-semibold text-sand-700 transition-transform group-hover:translate-x-1">
            Ir a habitaciones →
          </span>
        </Link>

        <Link
          href="/admin/disponibilidad"
          className="group rounded-3xl border border-sand-200 bg-white/80 p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-700 text-sand-100">
            <CalendarRange className="h-5 w-5" />
          </span>
          <h2 className="mt-4 font-serif text-xl font-semibold text-brand-900">
            Disponibilidad
          </h2>
          <p className="mt-1 text-sm text-brand-800/70">
            Marcá qué unidades están ocupadas para cada día del calendario.
          </p>
          <span className="mt-4 inline-block text-sm font-semibold text-sand-700 transition-transform group-hover:translate-x-1">
            Abrir calendario →
          </span>
        </Link>
      </div>

      <section className="rounded-3xl border border-sand-200 bg-white/80 p-6">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="h-4 w-4 text-sand-700" />
          <h2 className="font-serif text-lg font-semibold text-brand-900">
            Unidades del sitio
          </h2>
        </div>
        <ul className="mt-4 divide-y divide-sand-200">
          {rooms.map((room) => {
            const occupied = occupancies.some(
              (entry) => entry.roomId === room.id && entry.date === today,
            );
            return (
              <li
                key={room.id}
                className="flex items-center justify-between gap-3 py-3"
              >
                <div>
                  <p className="font-medium text-brand-900">{room.name}</p>
                  <p className="text-sm text-brand-800/80">
                    {room.type === "salon"
                      ? "Salón de eventos"
                      : `Habitación · hasta ${room.capacity} pers.`}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {!room.active ? (
                    <span className="rounded-full bg-sand-200 px-3 py-1 text-xs font-semibold text-brand-900">
                      Oculta
                    </span>
                  ) : occupied ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
                      <CircleX className="h-3.5 w-3.5" /> Ocupada hoy
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-600">
                      <CircleCheck className="h-3.5 w-3.5" /> Libre hoy
                    </span>
                  )}
                  <Link
                    href={`/admin/habitaciones/${room.id}`}
                    className="text-sm font-semibold text-sand-700 hover:underline"
                  >
                    Editar
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}