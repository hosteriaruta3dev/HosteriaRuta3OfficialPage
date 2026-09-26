import type { Metadata } from "next";
import Disponibilidad, { type Tab } from "@/components/Disponibilidad";
import { readStore } from "@/lib/data";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Disponibilidad",
  description: `Consultá qué días están libres las habitaciones y el salón de eventos de ${SITE.name} en Mayor Buratovich. Elegí una fecha y reservá por WhatsApp.`,
};

function resolveTab(raw: string | string[] | undefined): Tab {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (value === "habitaciones") return "habitacion";
  if (value === "salon") return "salon";
  return "todas";
}

export default async function DisponibilidadPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { tipo } = await searchParams;
  const tab = resolveTab(tipo);
  const { rooms, occupancies } = await readStore();

  return (
    <>
      <Disponibilidad
        key={tab}
        initialTab={tab}
        initialData={{ rooms: rooms.filter((room) => room.active), occupancies }}
      />
    </>
  );
}