"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Info,
  MessageCircle,
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

interface DisponibilidadData {
  rooms: Room[];
  occupancies: Occupancy[];
}

export default function RoomAvailability({
  room,
  initialOccupancies,
}: {
  room: Room;
  initialOccupancies?: Occupancy[];
}) {
  const [occupancies, setOccupancies] = useState<Occupancy[]>(initialOccupancies ?? []);
  const [error, setError] = useState(false);
  const [ready, setReady] = useState<boolean>(initialOccupancies !== undefined);
  const now = new Date();
  const [view, setView] = useState({
    year: now.getFullYear(),
    month: now.getMonth(),
  });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/disponibilidad")
      .then((response) => {
        if (!response.ok) throw new Error("API error");
        return response.json();
      })
      .then((json: DisponibilidadData) => {
        if (!cancelled) {
          setOccupancies(json.occupancies);
          setReady(true);
        }
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const occupiedDates = useMemo(() => {
    const dates = new Set<string>();
    for (const entry of occupancies) {
      if (entry.roomId === room.id) dates.add(entry.date);
    }
    return dates;
  }, [occupancies, room.id]);

  const grid = monthGrid(view.year, view.month);
  const firstDate = grid.find((cell): cell is Date => cell !== null);

  const isSameMonth = firstDate
    ? firstDate.getMonth() === now.getMonth() &&
      firstDate.getFullYear() === now.getFullYear()
    : true;

  const selectedOccupied = selectedDate
    ? occupiedDates.has(selectedDate)
    : false;

  const goToMonth = (offset: number) => {
    setView((prev) => {
      const date = new Date(prev.year, prev.month + offset, 1);
      return { year: date.getFullYear(), month: date.getMonth() };
    });
  };

  return (
    <div className="rounded-3xl border border-sand-200 bg-white/70 p-6 shadow-md">
      <div>
        <h3 className="font-serif text-lg font-semibold text-brand-900">
          Disponibilidad
        </h3>
        <p className="mt-1 text-sm text-brand-800/80">
          Elegí un día para saber si {room.type === "salon" ? "el salón" : "la habitación"} está
          libre y reservarla por WhatsApp.
        </p>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between">
          <h4 className="font-serif text-base font-semibold text-brand-900">
            {monthLabel(view.year, view.month)}
          </h4>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => goToMonth(-1)}
              aria-label="Mes anterior"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-brand-700 transition-colors hover:bg-sand-100"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {!isSameMonth && (
              <button
                type="button"
                onClick={() => {
                  setView({ year: now.getFullYear(), month: now.getMonth() });
                  setSelectedDate(null);
                }}
                className="rounded-full bg-brand-700 px-3 py-1 text-xs font-semibold text-sand-100 transition-colors hover:bg-brand-800"
              >
                Hoy
              </button>
            )}
            <button
              type="button"
              onClick={() => goToMonth(1)}
              aria-label="Mes siguiente"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-brand-700 transition-colors hover:bg-sand-100"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-7 gap-1 text-center">
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
            const occupied = !past && occupiedDates.has(iso);

            return (
              <button
                key={iso}
                type="button"
                disabled={past}
                onClick={() => setSelectedDate(iso)}
                aria-label={`${formatLongDate(iso)}${occupied ? ", ocupada" : ""}`}
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
                {!past && (
                  <span
                    aria-hidden="true"
                    className={`absolute bottom-1 h-1.5 w-1.5 rounded-full ${
                      occupied ? "bg-red-500" : "bg-brand-500"
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-brand-700">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-brand-500" /> Libre
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-red-500" /> Ocupada
          </span>
        </div>
      </div>

      <div className="mt-5">
        {error && !ready ? (
          <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            No pudimos cargar la disponibilidad. Volvé a intentar en unos
            segundos.
          </p>
        ) : !ready ? (
          <div className="h-24 animate-pulse rounded-2xl border border-sand-200 bg-sand-100" />
        ) : !selectedDate ? (
          <div className="flex items-center gap-2 rounded-2xl bg-sand-100 p-4 text-sm text-brand-800/80">
            <CalendarDays className="h-5 w-5 shrink-0 text-sand-700" aria-hidden />
            Elegí un día en el calendario para ver la disponibilidad.
          </div>
        ) : selectedOccupied ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
              <Info className="h-5 w-5 shrink-0" aria-hidden />
              El {formatLongDate(selectedDate)} está ocupado. Elegí otra fecha.
            </div>
            <span className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-full bg-brand-700 px-7 py-3.5 text-base font-semibold text-sand-50 opacity-40">
              <MessageCircle className="h-5 w-5" aria-hidden />
              Reservar por WhatsApp
            </span>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="rounded-2xl bg-brand-50 p-4 text-sm font-medium text-brand-800">
              El {formatLongDate(selectedDate)} {room.type === "salon" ? "el salón está" : "la habitación está"}{" "}
              <span className="font-semibold text-brand-700">disponible</span>.
            </p>
            <a
              href={whatsapp(roomReservationMessage(room, selectedDate))}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-700 px-7 py-3.5 text-base font-semibold text-sand-50 transition-colors hover:bg-brand-800"
            >
              <MessageCircle className="h-5 w-5" aria-hidden />
              Reservar por WhatsApp
            </a>
          </div>
        )}
      </div>
    </div>
  );
}