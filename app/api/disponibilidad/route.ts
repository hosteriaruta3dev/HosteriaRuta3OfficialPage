import { NextResponse } from "next/server";
import { readStore } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { rooms, occupancies } = await readStore();
    const activeRooms = rooms.filter((room) => room.active);

    return NextResponse.json(
      { rooms: activeRooms, occupancies },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { error: "Error al obtener disponibilidad." },
      { status: 500 },
    );
  }
}