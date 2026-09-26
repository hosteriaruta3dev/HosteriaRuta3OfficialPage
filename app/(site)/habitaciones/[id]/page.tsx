import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getRoom } from "@/lib/data";
import { SITE } from "@/lib/constants";
import RoomDetail from "@/components/RoomDetail";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const room = await getRoom(id);
  if (!room || room.type !== "habitacion" || !room.active) return {};
  return {
    title: room.name,
    description: room.description,
    alternates: { canonical: `${SITE.url}/habitaciones/${room.id}` },
  };
}

export default async function HabitacionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const room = await getRoom(id);
  if (!room || room.type !== "habitacion" || !room.active) notFound();
  return <RoomDetail room={room} />;
}