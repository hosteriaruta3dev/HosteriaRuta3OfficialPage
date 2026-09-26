import "server-only";

import { cache } from "react";
import { getSupabaseAdmin, getSupabasePublic } from "@/lib/supabase";

export type RoomType = "habitacion" | "salon";

export interface Room {
  id: string;
  type: RoomType;
  name: string;
  description: string;
  price: number;
  capacity: number;
  images: string[];
  amenities: string[];
  active: boolean;
}

export interface Occupancy {
  roomId: string;
  date: string; // YYYY-MM-DD
}

export interface Store {
  rooms: Room[];
  occupancies: Occupancy[];
}

const ROOM_COLUMNS =
  "id,type,name,description,price,capacity,amenities,images,active";

interface RoomRow {
  id: string;
  type: RoomType;
  name: string;
  description: string;
  price: number;
  capacity: number;
  amenities: string[] | null;
  images: string[] | null;
  active: boolean;
}

function rowToRoom(row: RoomRow): Room {
  return {
    id: row.id,
    type: row.type,
    name: row.name,
    description: row.description,
    price: row.price,
    capacity: row.capacity,
    amenities: row.amenities ?? [],
    images: row.images ?? [],
    active: row.active,
  };
}

export const readStore = cache(async (): Promise<Store> => {
  const [roomsResult, occupanciesResult] = await Promise.all([
    getSupabasePublic().from("rooms").select(ROOM_COLUMNS).order("id"),
    getSupabasePublic().from("occupancies").select("room_id,date"),
  ]);
  if (roomsResult.error) throw roomsResult.error;
  if (occupanciesResult.error) throw occupanciesResult.error;
  return {
    rooms: (roomsResult.data ?? []).map(rowToRoom),
    occupancies: (occupanciesResult.data ?? []).map((row) => ({
      roomId: row.room_id,
      date: row.date,
    })),
  };
});

export async function getRoom(id: string): Promise<Room | undefined> {
  const store = await readStore();
  return store.rooms.find((room) => room.id === id);
}

export async function getActiveRooms(): Promise<Room[]> {
  const store = await readStore();
  return store.rooms.filter((room) => room.active);
}

export async function getOccupancies(): Promise<Occupancy[]> {
  const store = await readStore();
  return store.occupancies;
}

export async function replaceRoom(room: Room): Promise<void> {
  const { error } = await getSupabaseAdmin()
    .from("rooms")
    .update({
      type: room.type,
      name: room.name,
      description: room.description,
      price: room.price,
      capacity: room.capacity,
      amenities: room.amenities,
      images: room.images,
      active: room.active,
    })
    .eq("id", room.id);
  if (error) throw error;
}

export async function setOccupancy(
  roomId: string,
  date: string,
  occupied: boolean,
): Promise<void> {
  if (occupied) {
    const { error } = await getSupabaseAdmin()
      .from("occupancies")
      .upsert({ room_id: roomId, date }, { onConflict: "room_id,date" });
    if (error) throw error;
  } else {
    const { error } = await getSupabaseAdmin()
      .from("occupancies")
      .delete()
      .eq("room_id", roomId)
      .eq("date", date);
    if (error) throw error;
  }
}
