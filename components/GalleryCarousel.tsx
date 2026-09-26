"use client";

import { useCallback, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Lightbox, { useLightbox, type LightboxItem } from "./Lightbox";

export type GalleryPhoto = { src: string; alt: string };

export default function GalleryCarousel({ photos }: { photos: GalleryPhoto[] }) {
  const lightbox = useLightbox();
  const scrollerRef = useRef<HTMLUListElement>(null);

  const items: LightboxItem[] = photos.map((photo) => ({
    src: photo.src,
    alt: photo.alt,
    width: 1200,
    height: 1600,
  }));

  const scroll = useCallback((direction: number) => {
    const element = scrollerRef.current;
    if (!element) return;
    const maxScroll = element.scrollWidth - element.clientWidth;
    const atStart = element.scrollLeft <= 10;
    const atEnd = maxScroll - element.scrollLeft <= 10;
    if (direction > 0 && atEnd) {
      element.scrollTo({ left: 0, behavior: "smooth" });
    } else if (direction < 0 && atStart) {
      element.scrollTo({ left: maxScroll, behavior: "smooth" });
    } else {
      element.scrollBy({ left: direction * element.clientWidth * 0.9, behavior: "smooth" });
    }
  }, []);

  return (
    <div
      role="region"
      aria-label="Galería de fotos de Hostería Ruta 3"
      aria-roledescription="carrusel"
      className="relative mt-10"
    >
      <ul
        ref={scrollerRef}
        className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-2 sm:gap-4"
      >
        {photos.map((photo, index) => (
          <li
            key={photo.src}
            className="w-[85%] shrink-0 snap-center sm:w-[45%] lg:w-[31%]"
          >
            <button
              type="button"
              onClick={() => lightbox.open(items, index)}
              aria-label={`Ampliar foto: ${photo.alt}`}
              className="relative block aspect-[4/5] w-full cursor-zoom-in overflow-hidden rounded-2xl bg-brand-200 shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-700"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 31vw"
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => scroll(-1)}
        aria-label="Foto anterior"
        className="absolute top-1/2 left-2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-brand-950/60 text-sand-100 shadow-lg backdrop-blur transition-colors hover:bg-brand-950/85 focus:outline-none focus-visible:ring-2 focus-visible:ring-sand-200"
      >
        <ChevronLeft className="h-6 w-6" aria-hidden />
      </button>
      <button
        type="button"
        onClick={() => scroll(1)}
        aria-label="Foto siguiente"
        className="absolute top-1/2 right-2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-brand-950/60 text-sand-100 shadow-lg backdrop-blur transition-colors hover:bg-brand-950/85 focus:outline-none focus-visible:ring-2 focus-visible:ring-sand-200"
      >
        <ChevronRight className="h-6 w-6" aria-hidden />
      </button>

      <Lightbox
        items={lightbox.items}
        index={lightbox.index}
        onClose={lightbox.close}
        onNavigate={lightbox.navigate}
      />
    </div>
  );
}