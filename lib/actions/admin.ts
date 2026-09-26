"use server";

import { revalidatePath } from "next/cache";
import {
  getRoom,
  replaceRoom,
  setOccupancy,
  type Room,
  type RoomType,
} from "@/lib/data";
import { getSession } from "@/lib/session";
import { isBeforeToday } from "@/lib/date";
import { getSupabaseAdmin, STORAGE_BUCKET } from "@/lib/supabase";

async function requireAdmin(): Promise<void> {
  const session = await getSession();
  if (!session) {
    throw new Error("No autorizado.");
  }
}

export type RoomActionState =
  | { ok: true; message?: string }
  | { ok: false; error: string }
  | undefined;

const PRICE_RE = /^\d+([.,]\d+)?$/;

function normalizePrice(raw: string): number | null {
  let value = raw.trim();
  if (value.includes(",") && value.includes(".")) {
    value = value.replace(/\./g, "").replace(",", ".");
  } else {
    value = value.replace(",", ".");
  }
  if (!PRICE_RE.test(value)) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function isRoomType(value: string): value is RoomType {
  return value === "habitacion" || value === "salon";
}

function parseImages(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item): item is string => typeof item === "string" && item.length > 0)
      .map((item) => item.replace(/^\/?uploads\//, "/uploads/"))
      .slice(0, 8);
  } catch {
    return [];
  }
}

export async function updateRoomAction(
  _prev: RoomActionState,
  formData: FormData,
): Promise<RoomActionState> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const existing = await getRoom(id);
  if (!existing) {
    return { ok: false, error: "La habitación no existe." };
  }

  const name = String(formData.get("name") ?? "").trim();
  const type = String(formData.get("type") ?? "");
  const description = String(formData.get("description") ?? "").trim();
  const capacity = Number(formData.get("capacity"));
  const price = normalizePrice(String(formData.get("price") ?? ""));
  const amenitiesRaw = String(formData.get("amenities") ?? "");
  const active = formData.get("active") === "on";

  if (name.length < 2) {
    return { ok: false, error: "El nombre debe tener al menos 2 caracteres." };
  }
  if (!isRoomType(type)) {
    return { ok: false, error: "Tipo de unidad inválido." };
  }
  if (description.length < 10) {
    return { ok: false, error: "La descripción es demasiado corta." };
  }
  if (!Number.isInteger(capacity) || capacity < 1) {
    return { ok: false, error: "La capacidad debe ser un número entero positivo." };
  }
  if (price === null) {
    return { ok: false, error: "El precio debe ser un número mayor a cero." };
  }

  const amenities = amenitiesRaw
    .split(/\r?\n/)
    .map((item) => item.replace(/^[-•*]\s*/, "").trim())
    .filter(Boolean)
    .slice(0, 12);

  const room: Room = {
    ...existing,
    name,
    type,
    description,
    capacity,
    price,
    amenities,
    images: parseImages(String(formData.get("images") ?? "[]")),
    active,
  };

  await replaceRoom(room);

  const removedImages = existing.images.filter((image) => !room.images.includes(image));
  if (removedImages.length > 0) {
    await Promise.all(removedImages.map(deleteStoredImage));
  }

  revalidatePath("/", "page");
  revalidatePath("/admin", "page");
  revalidatePath("/admin/habitaciones", "page");
  revalidatePath("/admin/habitaciones/" + id, "page");
  revalidatePath("/admin/disponibilidad", "page");

  return { ok: true, message: "Cambios guardados." };
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function isValidDate(iso: string): boolean {
  if (!DATE_RE.test(iso)) return false;
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

export async function setOccupancyAction(
  roomId: string,
  date: string,
  occupied: boolean,
): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin();

  const room = await getRoom(roomId);
  if (!room) {
    return { ok: false, error: "La habitación no existe." };
  }
  if (!isValidDate(date)) {
    return { ok: false, error: "Fecha inválida." };
  }
  if (isBeforeToday(date)) {
    return { ok: false, error: "No se puede marcar una fecha pasada." };
  }

  await setOccupancy(roomId, date, occupied);

  revalidatePath("/", "page");
  revalidatePath("/admin", "page");
  revalidatePath("/admin/disponibilidad", "page");

  return { ok: true };
}

function storageObjectPath(url: string): string | null {
  const marker = `/storage/v1/object/public/${STORAGE_BUCKET}/`;
  const index = url.indexOf(marker);
  return index === -1 ? null : url.slice(index + marker.length);
}

async function deleteStoredImage(url: string): Promise<void> {
  const objectPath = storageObjectPath(url);
  if (!objectPath) return;
  await getSupabaseAdmin()
    .storage.from(STORAGE_BUCKET)
    .remove([objectPath])
    .catch(() => {});
}

export async function deleteImageAction(
  roomId: string,
  imageUrl: string,
): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin();

  const room = await getRoom(roomId);
  if (!room) {
    return { ok: false, error: "La habitación no existe." };
  }

  const remaining = room.images.filter((image) => image !== imageUrl);
  await replaceRoom({ ...room, images: remaining });

  const objectPath = storageObjectPath(imageUrl);
  if (objectPath) {
    const { error } = await getSupabaseAdmin().storage
      .from(STORAGE_BUCKET)
      .remove([objectPath]);
    if (error) {
      return { ok: false, error: "No se pudo borrar la imagen del almacenamiento." };
    }
  }

  revalidatePath("/", "page");
  revalidatePath("/admin/habitaciones", "page");
  revalidatePath("/admin/habitaciones/" + roomId, "page");

  return { ok: true };
}