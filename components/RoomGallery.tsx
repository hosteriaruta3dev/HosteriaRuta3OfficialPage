"use client";

import Image from "next/image";
import { CalendarDays, ZoomIn } from "lucide-react";
import Lightbox, { useLightbox, type LightboxItem } from "./Lightbox";

export default function RoomGallery({
  images,
  name,
  aspect = "4/3",
}: {
  images: string[];
  name: string;
  aspect?: "4/3" | "4/5";
}) {
  const lightbox = useLightbox();
  const mainAspect = aspect === "4/5" ? "aspect-[4/5]" : "aspect-[4/3]";

  if (images.length === 0) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-3xl border border-dashed border-sand-300 bg-white/60">
        <div className="flex flex-col items-center gap-2 px-6 text-center text-brand-700">
          <CalendarDays className="h-8 w-8 text-sand-700" />
          <p className="text-sm font-medium">Sin fotos por ahora.</p>
        </div>
      </div>
    );
  }

  const items: LightboxItem[] = images.map((src, index) => ({
    src,
    alt: `${name} — foto ${index + 1}`,
    width: 1200,
    height: 1600,
  }));

  const openAt = (index: number) => lightbox.open(items, index);

  return (
    <div>
      <button
        type="button"
        onClick={() => openAt(0)}
        aria-label={`Ampliar foto principal de ${name}`}
        className="group relative block w-full cursor-zoom-in overflow-hidden rounded-3xl bg-sand-200 shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
      >
        <div className={`relative ${mainAspect}`}>
          <Image
            src={items[0].src}
            alt={items[0].alt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-brand-950/70 px-3 py-1.5 text-xs font-medium text-sand-100 backdrop-blur-sm">
          <ZoomIn className="h-3.5 w-3.5" aria-hidden />
          Ver fotos
        </span>
      </button>

      {images.length > 1 && (
        <div
          className="mt-3 grid gap-3"
          style={{
            gridTemplateColumns: `repeat(${Math.min(images.length, 4)}, minmax(0, 1fr))`,
          }}
        >
          {images.map((src, index) => (
            <button
              key={src}
              type="button"
              onClick={() => openAt(index)}
              aria-label={`Ampliar foto ${index + 1} de ${name}`}
              className={`relative aspect-[4/3] cursor-zoom-in overflow-hidden rounded-2xl bg-sand-200 shadow-md transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 ${
                index === 0 ? "ring-2 ring-brand-700" : "hover:opacity-90"
              }`}
            >
              <Image
                src={src}
                alt={items[index].alt}
                fill
                sizes="(max-width: 1024px) 50vw, 200px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      <Lightbox
        items={lightbox.items}
        index={lightbox.index}
        onClose={lightbox.close}
        onNavigate={lightbox.navigate}
      />
    </div>
  );
}