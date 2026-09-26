import { readStore } from "@/lib/data";
import AvailabilityManager from "@/components/admin/AvailabilityManager";

export default async function AdminAvailabilityPage() {
  const { rooms, occupancies } = await readStore();

  return (
    <div className="flex flex-col gap-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-widest text-sand-700">
          Panel de administración
        </p>
        <h1 className="mt-1 font-serif text-2xl font-semibold text-brand-900">
          Disponibilidad
        </h1>
        <p className="mt-1 text-sm text-brand-800/70">
          Elegí un día y marcá qué unidades están ocupadas. La página pública se
          actualiza al instante.
        </p>
      </header>

      <AvailabilityManager rooms={rooms} occupancies={occupancies} />
    </div>
  );
}