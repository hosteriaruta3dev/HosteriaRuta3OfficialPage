import "server-only";

import { cache } from "react";
import { promises as fs } from "fs";
import path from "path";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";

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

const DATA_DIR = path.join(process.cwd(), "data");
const STORE_PATH = path.join(DATA_DIR, "store.json");

export const DEFAULT_ROOMS: Room[] = [
  {
    id: "habitacion-simple",
    type: "habitacion",
    name: "Habitación Simple",
    description:
      "Ideal para una o dos personas que están de paso por la Ruta 3. Cama cómoda, calefacción y todo lo necesario para una buena noche de descanso.",
    price: 80000,
    capacity: 2,
    images: ["/images/habitacion_camas_simple.jpg"],
    amenities: [
      "Cama confortable",
      "Ropa de cama y toallas",
      "Calefacción",
      "Wi-Fi",
    ],
    active: true,
  },
  {
    id: "habitacion-doble",
    type: "habitacion",
    name: "Habitación Doble",
    description:
      "Amplia habitación con cama doble para descansar en pareja o en familia chica. Espacio luminoso y equipado para que la parada en la Ruta 3 sea un placer.",
    price: 100000,
    capacity: 3,
    images: ["/images/habitacion_cama_doble.jpg"],
    amenities: [
      "Cama doble",
      "Ropa de cama y toallas",
      "Calefacción",
      "Wi-Fi",
      "Smart TV",
    ],
    active: true,
  },
  {
    id: "habitacion-familiar",
    type: "habitacion",
    name: "Habitación Familiar",
    description:
      "La más espaciosa: perfecta para grupos o familias que viajan juntos. Comodidad para varios huéspedes con acceso a cocina equipada y cochera techada.",
    price: 150000,
    capacity: 5,
    images: ["/images/habitaciones_exterior.jpg"],
    amenities: [
      "Capacidad hasta 5 personas",
      "Cocina equipada",
      "Ropa de cama y toallas",
      "Calefacción",
      "Wi-Fi",
    ],
    active: true,
  },
  {
    id: "salon-eventos",
    type: "salon",
    name: "Salón de Eventos",
    description:
      "Festejos y reuniones con capacidad para hasta 40 personas. Vajilla, mesas, sillas y limpieza incluidos, además de espacio al aire libre con cancha y juegos.",
    price: 150000,
    capacity: 40,
    images: [
      "/images/salon_interior_1.jpg",
      "/images/salon_interior_2.jpg",
      "/images/salon_exterior_1.jpg",
      "/images/salon_exterior_2.jpg",
      "/images/salon_juegos.jpg",
    ],
    amenities: [
      "Mesas y sillas",
      "Vajilla completa",
      "Limpieza incluida",
      "Calefacción",
      "Espacio al aire libre y cancha",
      "Juegos para niños",
    ],
    active: true,
  },
];

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

async function ensureRoomsSeeded(): Promise<void> {
  const { data, error } = await getSupabase()
    .from("rooms")
    .select("id")
    .limit(1);
  if (error) throw error;
  if (data?.length) return;
  const { error: insertError } = await getSupabase()
    .from("rooms")
    .upsert(DEFAULT_ROOMS, { onConflict: "id" });
  if (insertError) throw insertError;
}

let fileCache: Store | null = null;
let writeChain: Promise<void> = Promise.resolve();

export const readStore = cache(async (): Promise<Store> => {
  if (isSupabaseConfigured()) {
    await ensureRoomsSeeded();
    const [roomsResult, occupanciesResult] = await Promise.all([
      getSupabase().from("rooms").select(ROOM_COLUMNS).order("id"),
      getSupabase().from("occupancies").select("room_id,date"),
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
  }
  return readStoreFile();
});

async function readStoreFile(): Promise<Store> {
  if (fileCache) return fileCache;

  if (!(await fileExists(STORE_PATH))) {
    const seed: Store = { rooms: DEFAULT_ROOMS, occupancies: [] };
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(STORE_PATH, JSON.stringify(seed, null, 2), "utf8");
    fileCache = seed;
    return fileCache;
  }

  const raw = await fs.readFile(STORE_PATH, "utf8");
  fileCache = JSON.parse(raw) as Store;
  return fileCache;
}

async function fileExists(file: string): Promise<boolean> {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

function persist(store: Store): Promise<void> {
  writeChain = writeChain.then(async () => {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
    fileCache = store;
  });
  return writeChain;
}

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
  if (isSupabaseConfigured()) {
    const { error } = await getSupabase()
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
    return;
  }

  const store = await readStore();
  const index = store.rooms.findIndex((item) => item.id === room.id);
  if (index === -1) return;
  const next = [...store.rooms];
  next[index] = room;
  await persist({ ...store, rooms: next });
}

export async function setOccupancy(
  roomId: string,
  date: string,
  occupied: boolean,
): Promise<void> {
  if (isSupabaseConfigured()) {
    if (occupied) {
      const { error } = await getSupabase()
        .from("occupancies")
        .upsert({ room_id: roomId, date }, { onConflict: "room_id,date" });
      if (error) throw error;
    } else {
      const { error } = await getSupabase()
        .from("occupancies")
        .delete()
        .eq("room_id", roomId)
        .eq("date", date);
      if (error) throw error;
    }
    return;
  }

  const store = await readStore();
  const exists = store.occupancies.some(
    (entry) => entry.roomId === roomId && entry.date === date,
  );
  let occupancies: Occupancy[];
  if (occupied && !exists) {
    occupancies = [...store.occupancies, { roomId, date }];
  } else if (!occupied && exists) {
    occupancies = store.occupancies.filter(
      (entry) => !(entry.roomId === roomId && entry.date === date),
    );
  } else {
    return;
  }
  await persist({ ...store, occupancies });
}