import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getRoom } from "@/lib/data";
import RoomEditor from "@/components/admin/RoomEditor";

export default async function EditRoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const room = await getRoom(id);
  if (!room) notFound();

  return (
    <div className="flex flex-col gap-6">
      <header>
        <Link
          href="/admin/habitaciones"
          className="mb-2 inline-flex items-center gap-1 text-sm font-medium text-sand-700 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a habitaciones
        </Link>
        <p className="text-xs font-semibold uppercase tracking-widest text-sand-700">
          Panel de administración
        </p>
        <h1 className="mt-1 font-serif text-2xl font-semibold text-brand-900">
          Editar: {room.name}
        </h1>
        <p className="mt-1 text-sm text-brand-800/70">
          Modificá los datos que se muestran en la landing.
        </p>
      </header>

      <RoomEditor room={room} />
    </div>
  );
}