"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Eye,
  Info,
  MessageCircle,
  Users,
} from "lucide-react";
import { whatsapp } from "@/lib/constants";
import { roomReservationMessage } from "@/lib/messages";
import {
  formatLongDate,
  isPastDate,
  monthGrid,
  monthLabel,
  toISODate,
  WEEKDAY_LABELS,
} from "@/lib/date";
import type { Occupancy, Room } from "@/lib/data";

export interface DisponibilidadData {
  rooms: Room[];
  occupancies: Occupancy[];
}

type Tab = "todas" | "habitacion" | "salon";
export type { Tab };
type DayStatus = "none" | "some" | "all";

const CURRENCY = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

export default function Disponibilidad({
  initialTab = "todas",
  initialData = null,
}: {
  initialTab?: Tab;
  initialData?: DisponibilidadData | null;
}) {
  const [data, setData] = useState<DisponibilidadData | null>(initialData);
  const [error, setError] = useState(false);
  const [tab, setTab] = useState<Tab>(initialTab);
  const now = new Date();
  const [view, setView] = useState({ year: now.getFullYear(), month: now.getMonth() });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/disponibilidad")
      .then((response) => {
        if (!response.ok) throw new Error("API error");
        return response.json();
      })
      .then((json: DisponibilidadData) => {
        if (!cancelled) setData(json);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const occupiedByDate = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const entry of data?.occupancies ?? []) {
      const set = map.get(entry.date) ?? new Set<string>();
      set.add(entry.roomId);
      map.set(entry.date, set);
    }
    return map;
  }, [data]);

  const rooms = data?.rooms ?? [];

  const dayStatus = (iso: string, roomIds: string[]): DayStatus | null => {
    const occupied = occupiedByDate.get(iso);
    if (!occupied || occupied.size === 0) return "none";
    const relevant = roomIds.filter((id) => occupied.has(id)).length;
    return relevant >= roomIds.length ? "all" : "some";
  };

  const visibleRooms = rooms.filter(
    (room) => tab === "todas" || room.type === tab,
  );
  const visibleIds = visibleRooms.map((room) => room.id);

  const selectedOccupiedIds = selectedDate
    ? new Set(occupiedByDate.get(selectedDate) ?? [])
    : null;

  const grid = monthGrid(view.year, view.month);
  const firstDate = grid.find((cell): cell is Date => cell !== null);

  const goToMonth = (offset: number) => {
    setView((prev) => {
      const date = new Date(prev.year, prev.month + offset, 1);
      return { year: date.getFullYear(), month: date.getMonth() };
    });
  };

  const isSameMonth = firstDate
    ? firstDate.getMonth() === now.getMonth() &&
      firstDate.getFullYear() === now.getFullYear()
    : true;

  return (
    <section id="disponibilidad" className="bg-sand-50 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-sand-700">
            Disponibilidad
          </p>
          <h1 className="mt-2 font-serif text-3xl font-semibold text-brand-900 sm:text-4xl">
            Consultá qué día te conviene venir
          </h1>
          <p className="mt-4 text-brand-800/80">
            Elegí un día en el calendario y mirá de un vistazo qué unidades están
            libres: habitaciones y salón de eventos. Si te queda una opción,
            reservás directo por WhatsApp.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(320px,400px)_1fr]">
          <div className="rounded-3xl border border-sand-200 bg-white/70 p-5 shadow-md sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg font-semibold text-brand-900">
                {monthLabel(view.year, view.month)}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => goToMonth(-1)}
                  aria-label="Mes anterior"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-brand-700 transition-colors hover:bg-sand-100"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                {!isSameMonth && (
                  <button
                    type="button"
                    onClick={() => {
                      setView({ year: now.getFullYear(), month: now.getMonth() });
                      setSelectedDate(null);
                    }}
                    className="rounded-full bg-brand-700 px-3 py-1.5 text-xs font-semibold text-sand-100 transition-colors hover:bg-brand-800"
                  >
                    Hoy
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => goToMonth(1)}
                  aria-label="Mes siguiente"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-brand-700 transition-colors hover:bg-sand-100"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-7 gap-1 text-center">
              {WEEKDAY_LABELS.map((label) => (
                <span
                  key={label}
                  className="text-[11px] font-semibold uppercase tracking-wide text-brand-500"
                >
                  {label}
                </span>
              ))}
            </div>

            <div className="mt-1 grid grid-cols-7 gap-1">
              {grid.map((cell, index) => {
                if (!cell) {
                  return <span key={`empty-${index}`} aria-hidden="true" />;
                }
                const iso = toISODate(cell);
                const past = isPastDate(cell);
                const isToday =
                  cell.getDate() === now.getDate() &&
                  cell.getMonth() === now.getMonth() &&
                  cell.getFullYear() === now.getFullYear();
                const isSelected = iso === selectedDate;
                const status = past ? null : dayStatus(iso, visibleIds);

                return (
                  <button
                    key={iso}
                    type="button"
                    disabled={past}
                    onClick={() => setSelectedDate(iso)}
                    aria-label={formatLongDate(iso)}
                    aria-pressed={isSelected}
                    className={`relative flex aspect-square items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                      past
                        ? "cursor-not-allowed text-brand-200"
                        : isSelected
                          ? "bg-brand-700 text-sand-100"
                          : isToday
                            ? "bg-sand-200 text-brand-900 hover:bg-sand-300"
                            : "text-brand-800 hover:bg-sand-100"
                    }`}
                  >
                    {cell.getDate()}
                    {!past && status && (
                      <span
                        aria-hidden="true"
                        className={`absolute bottom-1 h-1.5 w-1.5 rounded-full ${
                          status === "all"
                            ? "bg-red-500"
                            : status === "some"
                              ? "bg-sand-500"
                              : "bg-brand-500"
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-brand-700">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-brand-500" /> Todas libres
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-sand-500" /> Algunas ocupadas
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-red-500" /> Todas ocupadas
              </span>
            </div>

            <div className="mt-4 flex items-start gap-2 rounded-2xl bg-sand-100 p-3 text-xs text-brand-800/80">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-sand-700" />
              <p>
                La disponibilidad la gestiona el equipo de la hostería. Al reservar
                te redirigimos a WhatsApp con tu consulta armada.
              </p>
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex rounded-full border border-sand-200 bg-white/70 p-1">
                {(
                  [
                    ["todas", "Todas"],
                    ["habitacion", "Habitaciones"],
                    ["salon", "Salón"],
                  ] as [Tab, string][]
                ).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setTab(value)}
                    aria-pressed={tab === value}
                    className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                      tab === value
                        ? "bg-brand-700 text-sand-100"
                        : "text-brand-800 hover:text-brand-950"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {selectedDate && (
                <p className="text-sm font-medium text-brand-800">
                  {formatLongDate(selectedDate)}
                </p>
              )}
            </div>

            {error && !data ? (
              <p className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                No pudimos cargar la disponibilidad. Volvé a intentar en unos
                segundos.
              </p>
            ) : !data ? (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {Array.from({ length: 2 }, (_, i) => (
                  <div
                    key={i}
                    className="h-64 animate-pulse rounded-3xl border border-sand-200 bg-white/70"
                  />
                ))}
              </div>
            ) : !selectedDate ? (
              <div className="mt-6 flex h-64 items-center justify-center rounded-3xl border border-dashed border-sand-300 bg-white/60">
                <div className="flex flex-col items-center gap-2 px-6 text-center text-brand-700">
                  <CalendarDays className="h-8 w-8 text-sand-700" />
                  <p className="text-sm font-medium">
                    Elegí un día en el calendario para ver qué unidades están
                    disponibles.
                  </p>
                </div>
              </div>
            ) : selectedOccupiedIds &&
              visibleRooms.every((room) => selectedOccupiedIds.has(room.id)) ? (
              <div className="mt-6 flex h-64 items-center justify-center rounded-3xl border border-dashed border-sand-300 bg-white/60">
                <div className="flex flex-col items-center gap-2 px-6 text-center text-brand-700">
                  <CalendarDays className="h-8 w-8 text-red-500" />
                  <p className="text-sm font-medium">
                    Todas las unidades están ocupadas para ese día. Probá con otra
                    fecha.
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {visibleRooms.map((room) => {
                  const occupied = selectedOccupiedIds?.has(room.id) ?? false;
                  return (
                    <article
                      key={room.id}
                      className="overflow-hidden rounded-3xl border border-sand-200 bg-white/80 shadow-sm"
                    >
                      <div className="relative aspect-[4/3] bg-sand-200">
                        {room.images[0] ? (
                          <Image
                            src={room.images[0]}
                            alt={room.name}
                            fill
                            sizes="(max-width: 1024px) 100vw, 480px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-brand-400">
                            <CalendarDays className="h-10 w-10" />
                          </div>
                        )}
                        <span
                          className={`absolute left-3 top-3 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                            occupied
                              ? "bg-red-600 text-white"
                              : "bg-brand-600 text-sand-100"
                          }`}
                        >
                          <span
                            aria-hidden="true"
                            className="h-1.5 w-1.5 rounded-full bg-current"
                          />
                          {occupied ? "Ocupada" : "Disponible"}
                        </span>
                      </div>

                      <div className="flex flex-col gap-3 p-4">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-widest text-sand-700">
                            {room.type === "salon" ? "Salón de eventos" : "Habitación"}
                          </p>
                          <h3 className="font-serif text-lg font-semibold text-brand-900">
                            {room.name}
                          </h3>
                        </div>

                        <p className="line-clamp-2 text-sm text-brand-800/80">
                          {room.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-brand-800">
                          <span className="font-semibold text-brand-950">
                            {CURRENCY.format(room.price)}
                          </span>
                          <span className="inline-flex items-center gap-1 text-brand-600">
                            <Users className="h-4 w-4" />
                            {room.capacity} {room.capacity === 1 ? "persona" : "personas"}
                          </span>
                        </div>

                        <div className="flex flex-col gap-2">
                          {!occupied && (
                            <a
                              href={whatsapp(roomReservationMessage(room, selectedDate))}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-700 px-5 py-2.5 text-sm font-semibold text-sand-100 transition-colors hover:bg-brand-800"
                            >
                              <MessageCircle className="h-4 w-4" aria-hidden />
                              Reservar por WhatsApp
                            </a>
                          )}
                          <Link
                            href={room.type === "salon" ? "/salon" : `/habitaciones/${room.id}`}
                            className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-brand-700 px-5 py-2.5 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-700 hover:text-sand-100"
                          >
                            <Eye className="h-4 w-4" aria-hidden />
                            Ver detalles
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}