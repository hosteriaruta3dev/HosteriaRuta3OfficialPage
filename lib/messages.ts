import { formatLongDate } from "@/lib/date";
import type { Room } from "@/lib/data";

export function roomReservationMessage(room: Room, date?: string): string {
  const entity = room.type === "salon" ? "el salón de eventos" : `la ${room.name}`;
  const when = date ? ` para el ${formatLongDate(date)}` : "";
  return `Hola Hostería Ruta 3, quiero reservar ${entity}${when}. ¿Está disponible?`;
}