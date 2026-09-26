"use client";

import Image from "next/image";
import { ZoomIn } from "lucide-react";
import { useLightbox, type LightboxItem } from "./Lightbox";

export default function FeaturedPhoto({
  src,
  alt,
  aspect = "aspect-[4/3]",
  showBadge = true,
  children,
}: {
  src: string;
  alt: string;
  aspect?: string;
  showBadge?: boolean;
  children?: React.ReactNode;
}) {
  const lightbox = useLightbox();
  const item: LightboxItem = { src, alt, width: 1200, height: 1600 };

  return (
    <div className="relative block w-full">
      <button
        type="button"
        onClick={() => lightbox.open([item], 0)}
        aria-label={`Ampliar foto: ${alt}`}
        className="group relative block w-full cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-sand-200"
      >
        <div
          className={`relative ${aspect} overflow-hidden rounded-3xl bg-sand-200 shadow-lg`}
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        {showBadge && (
          <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-brand-950/70 px-3 py-1.5 text-xs font-medium text-sand-100 backdrop-blur-sm">
            <ZoomIn className="h-3.5 w-3.5" aria-hidden />
            Ver fotos
          </span>
        )}
      </button>
      {children}
    </div>
  );
}