"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarCheck,
  CalendarOff,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { setOccupancyAction } from "@/lib/actions/admin";
import {
  formatLongDate,
  isPastDate,
  monthGrid,
  monthLabel,
  toISODate,
  WEEKDAY_LABELS,
} from "@/lib/date";
import type { Occupancy, Room } from "@/lib/data";

interface AvailabilityManagerProps {
  rooms: Room[];
  occupancies: Occupancy[];
}

export default function AvailabilityManager({
  rooms,
  occupancies,
}: AvailabilityManagerProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const now = new Date();
  const [view, setView] = useState({
    year: now.getFullYear(),
    month: now.getMonth(),
  });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string>("all");
  const [actionError, setActionError] = useState<string | null>(null);

  const occupiedMap = new Map<string, Set<string>>();
  for (const entry of occupancies) {
    const set = occupiedMap.get(entry.date) ?? new Set<string>();
    set.add(entry.roomId);
    occupiedMap.set(entry.date, set);
  }

  const grid = monthGrid(view.year, view.month);

  const goToMonth = (offset: number) => {
    setView((prev) => {
      const d = new Date(prev.year, prev.month + offset, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  };

  const toggleOccupancy = (roomId: string, date: string, currentlyOccupied: boolean) => {
    startTransition(async () => {
      try {
        setActionError(null);
        await setOccupancyAction(roomId, date, !currentlyOccupied);
        router.refresh();
      } catch {
        setActionError("No se pudo guardar. Revisá tu sesión e intentá de nuevo.");
      }
    });
  };

  const dayOccupiedCount = (iso: string): number => {
    return occupiedMap.get(iso)?.size ?? 0;
  };

  const activeRooms = rooms.filter((r) => r.active);
  const displayRooms = selectedRoomId === "all"
    ? activeRooms
    : activeRooms.filter((r) => r.id === selectedRoomId);

  const isCurrentMonth =
    view.month === now.getMonth() && view.year === now.getFullYear();

  return (
    <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
      <div className="rounded-3xl border border-sand-200 bg-white/70 p-5 shadow-md sm:p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg font-semibold text-brand-900">
            {monthLabel(view.year, view.month)}
          </h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => goToMonth(-1)}
              aria-label="Mes anterior"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-brand-700 transition-colors hover:bg-sand-100"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            {!isCurrentMonth && (
              <button
                type="button"
                onClick={() =>
                  setView({ year: now.getFullYear(), month: now.getMonth() })
                }
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
            if (!cell) return <span key={`e-${index}`} />;
            const iso = toISODate(cell);
            const past = isPastDate(cell);
            const isSelected = iso === selectedDate;
            const occupiedCount = dayOccupiedCount(iso);
            const total = activeRooms.length;
            const statusColor =
              occupiedCount === 0
                ? "bg-brand-500"
                : occupiedCount >= total
                  ? "bg-red-500"
                  : "bg-sand-500";

            return (
              <button
                key={iso}
                type="button"
                disabled={past}
                onClick={() => setSelectedDate(iso)}
                className={`relative flex aspect-square items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                  past
                    ? "cursor-not-allowed text-brand-200"
                    : isSelected
                      ? "bg-brand-700 text-sand-100"
                      : "text-brand-800 hover:bg-sand-100"
                }`}
              >
                {cell.getDate()}
                {!past && occupiedCount > 0 && (
                  <span
                    className={`absolute bottom-1 h-1.5 w-1.5 rounded-full ${statusColor}`}
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-brand-700">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-brand-500" /> Libre
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-sand-500" /> Parcial
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-red-500" /> Ocupado
          </span>
        </div>
      </div>

      <div className="rounded-3xl border border-sand-200 bg-white/70 p-5 shadow-md sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <label htmlFor="room-select" className="mb-1 block text-sm font-medium text-brand-900">
              Seleccioná una unidad
            </label>
            <select
              id="room-select"
              value={selectedRoomId}
              onChange={(e) => setSelectedRoomId(e.target.value)}
              className="rounded-xl border border-sand-200 bg-white px-4 py-2 text-sm text-brand-900 shadow-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="all">Todas las unidades</option>
              {activeRooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name}{" "}
                  {room.type === "salon" ? "(Salón)" : "(Hab.)"}
                </option>
              ))}
            </select>
          </div>

          {pending && (
            <span className="inline-flex items-center gap-1.5 text-sm text-brand-600">
              <Loader2 className="h-4 w-4 animate-pulse" />
              Guardando…
            </span>
          )}
        </div>

        {!selectedDate ? (
          <div className="mt-12 flex flex-col items-center gap-2 text-center text-brand-700">
            <CalendarCheck className="h-10 w-10 text-sand-400" />
            <p className="text-sm font-medium">
              Elegí un día en el calendario para marcar ocupaciones.
            </p>
          </div>
        ) : (
          <div className="mt-5">
            <p className="mb-3 font-serif text-lg font-semibold text-brand-900">
              {formatLongDate(selectedDate)}
            </p>

            <div className="flex flex-col gap-2">
              {displayRooms.map((room) => {
                const occupied =
                  occupiedMap.get(selectedDate)?.has(room.id) ?? false;
                return (
                  <div
                    key={room.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-sand-200 bg-white/80 px-4 py-3"
                  >
                    <div>
                      <p className="font-medium text-brand-900">{room.name}</p>
                      <p className="text-xs text-brand-800/80">
                        {room.type === "salon"
                          ? `Salón · hasta ${room.capacity} personas`
                          : `Habitación · hasta ${room.capacity} personas`}
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={pending}
                      onClick={() =>
                        toggleOccupancy(room.id, selectedDate, occupied)
                      }
                      className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                        occupied
                          ? "bg-red-600 text-white hover:bg-red-700"
                          : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                    >
                      {occupied ? (
                        <>
                          <CalendarOff className="h-4 w-4" />
                          Ocupada
                        </>
                      ) : (
                        <>
                          <CalendarCheck className="h-4 w-4" />
                          Libre
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            <p className="mt-4 text-xs text-brand-800/80">
              Presioná el botón para alternar el estado de la unidad para ese
              día.
            </p>
            {actionError && (
              <p role="alert" className="mt-2 text-sm font-medium text-red-600">
                {actionError}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}