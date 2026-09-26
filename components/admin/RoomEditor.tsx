"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  Loader2,
  Save,
  Trash2,
  Upload,
} from "lucide-react";
import { updateRoomAction, deleteImageAction } from "@/lib/actions/admin";
import type { Room } from "@/lib/data";

interface RoomEditorProps {
  room: Room;
}

function SortableImage({
  url,
  index,
  onRemove,
}: {
  url: string;
  index: number;
  onRemove: (url: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: url });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`group relative aspect-square overflow-hidden rounded-xl border border-sand-200 bg-sand-100 ${
        isDragging ? "z-10 ring-2 ring-brand-500" : ""
      }`}
    >
      <Image
        src={url}
        alt=""
        fill
        sizes="200px"
        className="object-cover"
      />
      {index === 0 && (
        <span className="absolute left-1.5 top-1.5 rounded-full bg-brand-900/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-sand-100">
          Portada
        </span>
      )}
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="absolute bottom-1.5 left-1.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand-900/80 text-white opacity-0 shadow transition-opacity hover:bg-brand-700 group-hover:opacity-100 active:cursor-grabbing"
        aria-label="Arrastrar para reordenar"
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => onRemove(url)}
        className="absolute right-1.5 top-1.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-white opacity-0 shadow transition-opacity group-hover:opacity-100"
        aria-label="Eliminar imagen"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export default function RoomEditor({ room }: RoomEditorProps) {
  const [images, setImages] = useState<string[]>(room.images);
  const [pending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<
    { type: "success" | "error"; text: string } | null
  >(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setImages((prev) => {
      const oldIndex = prev.indexOf(String(active.id));
      const newIndex = prev.indexOf(String(over.id));
      if (oldIndex === -1 || newIndex === -1) return prev;
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);

    const uploaded: string[] = [];
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const response = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });
        if (response.ok) {
          const { url } = await response.json();
          uploaded.push(url);
        }
      } catch {
        // Error silenciado, el usuario puede reintentar
      }
    }

    if (uploaded.length > 0) {
      setImages((prev) => [...prev, ...uploaded]);
    }
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleRemoveImage = async (url: string) => {
    if (!url.startsWith("/uploads/")) {
      setImages((prev) => prev.filter((img) => img !== url));
      return;
    }
    const result = await deleteImageAction(room.id, url);
    if (result.ok) {
      setImages((prev) => prev.filter((img) => img !== url));
      router.refresh();
    }
  };

  const handleSubmit = (formData: FormData) => {
    formData.set("images", JSON.stringify(images));
    startTransition(async () => {
      try {
        const result = await updateRoomAction(undefined, formData);
        if (result?.ok) {
          setMessage({ type: "success", text: result.message ?? "Cambios guardados." });
          router.refresh();
        } else if (result) {
          setMessage({ type: "error", text: result.error });
        }
      } catch {
        setMessage({ type: "error", text: "No se pudo guardar. Tu sesión pudo expirar; ingresá de nuevo." });
      }
    });
  };

  return (
    <form action={handleSubmit} className="flex flex-col gap-6">
      <input type="hidden" name="id" value={room.id} />

      <section className="rounded-3xl border border-sand-200 bg-white/80 p-5 sm:p-6">
        <h2 className="font-serif text-lg font-semibold text-brand-900">
          Datos generales
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="name" className="mb-1 block text-sm font-medium text-brand-900">
              Nombre
            </label>
            <input
              id="name"
              name="name"
              defaultValue={room.name}
              required
              minLength={2}
              className="w-full rounded-xl border border-sand-200 bg-white px-4 py-2.5 text-brand-900 shadow-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          <div>
            <label htmlFor="type" className="mb-1 block text-sm font-medium text-brand-900">
              Tipo
            </label>
            <select
              id="type"
              name="type"
              defaultValue={room.type}
              className="w-full rounded-xl border border-sand-200 bg-white px-4 py-2.5 text-brand-900 shadow-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="habitacion">Habitación</option>
              <option value="salon">Salón de eventos</option>
            </select>
          </div>

          <div>
            <label htmlFor="price" className="mb-1 block text-sm font-medium text-brand-900">
              Precio (ARS)
            </label>
            <input
              id="price"
              name="price"
              type="number"
              min={0}
              step={1000}
              defaultValue={room.price}
              required
              className="w-full rounded-xl border border-sand-200 bg-white px-4 py-2.5 text-brand-900 shadow-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          <div>
            <label htmlFor="capacity" className="mb-1 block text-sm font-medium text-brand-900">
              Capacidad (personas)
            </label>
            <input
              id="capacity"
              name="capacity"
              type="number"
              min={1}
              step={1}
              defaultValue={room.capacity}
              required
              className="w-full rounded-xl border border-sand-200 bg-white px-4 py-2.5 text-brand-900 shadow-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="description" className="mb-1 block text-sm font-medium text-brand-900">
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              defaultValue={room.description}
              required
              minLength={10}
              className="w-full rounded-xl border border-sand-200 bg-white px-4 py-2.5 text-brand-900 shadow-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="amenities" className="mb-1 block text-sm font-medium text-brand-900">
              Amenities (una por línea)
            </label>
            <textarea
              id="amenities"
              name="amenities"
              rows={4}
              defaultValue={room.amenities.join("\n")}
              placeholder={"Calefacción\nWi-Fi\nSmart TV"}
              className="w-full rounded-xl border border-sand-200 bg-white px-4 py-2.5 text-brand-900 shadow-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="active"
              name="active"
              defaultChecked={room.active}
              className="h-4 w-4 rounded border-sand-300 text-brand-700 focus:ring-brand-500/20"
            />
            <label htmlFor="active" className="text-sm font-medium text-brand-900">
              Visible en la página pública
            </label>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-sand-200 bg-white/80 p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-lg font-semibold text-brand-900">
            Imágenes
          </h2>
          <span className="text-xs text-brand-800/80">
            La primera imagen es la portada · Arrastrá para reordenar
          </span>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={images} strategy={rectSortingStrategy}>
            <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
              {images.map((url, index) => (
                <SortableImage
                  key={url}
                  url={url}
                  index={index}
                  onRemove={handleRemoveImage}
                />
              ))}

              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={uploading || images.length >= 8}
                className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-sand-300 bg-white/60 text-sm font-medium text-brand-800 transition-colors hover:border-brand-500 hover:text-brand-950 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {uploading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-brand-700" />
                ) : (
                  <Upload className="h-5 w-5 text-sand-700" />
                )}
                {uploading ? "Subiendo…" : "Agregar"}
              </button>
            </div>
          </SortableContext>
        </DndContext>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          onChange={(e) => handleUpload(e.target.files)}
          className="hidden"
        />
      </section>

      <div className="flex items-center justify-end gap-3">
        {message && (
          <p
            role="status"
            className={`text-sm font-medium ${
              message.type === "error" ? "text-red-600" : "text-green-700"
            }`}
          >
            {message.text}
          </p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-6 py-3 text-sm font-semibold text-sand-100 transition-colors hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? (
            <>
              <Loader2 className="h-4 w-4 animate-pulse" />
              Guardando…
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Guardar cambios
            </>
          )}
        </button>
      </div>
    </form>
  );
}