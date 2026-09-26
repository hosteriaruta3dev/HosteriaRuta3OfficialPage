"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export type LightboxItem = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

type LightboxState = {
  items: LightboxItem[];
  index: number;
};

export function useLightbox() {
  const [state, setState] = useState<LightboxState | null>(null);

  const open = useCallback((items: LightboxItem[], index = 0) => {
    setState({ items, index });
  }, []);

  const close = useCallback(() => {
    setState(null);
  }, []);

  const navigate = useCallback((direction: number) => {
    setState((current) => {
      if (!current || current.items.length <= 1) return current;
      const length = current.items.length;
      const index = (current.index + direction + length) % length;
      return { ...current, index };
    });
  }, []);

  return {
    items: state?.items ?? null,
    index: state?.index ?? 0,
    open,
    close,
    navigate,
  };
}

export default function Lightbox({
  items,
  index,
  onClose,
  onNavigate,
}: {
  items: LightboxItem[] | null;
  index: number;
  onClose: () => void;
  onNavigate: (direction: number) => void;
}) {
  useEffect(() => {
    if (items) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [items]);

  useEffect(() => {
    if (!items) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onNavigate(-1);
      if (event.key === "ArrowRight") onNavigate(1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [items, onClose, onNavigate]);

  if (!items || items.length === 0) return null;

  const hasMultiple = items.length > 1;
  const item = items[index];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Foto ampliada"
      className="fixed inset-0 z-100 flex items-center justify-center bg-brand-950/95 p-4 backdrop-blur-sm sm:p-8"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-full max-w-full items-center justify-center animate-[lightbox-in_0.15s_ease-out]"
        onClick={(event) => event.stopPropagation()}
      >
        <Image
          src={item.src}
          alt={item.alt}
          width={item.width}
          height={item.height}
          sizes="(max-width: 768px) 94vw, 80vw"
          loading="eager"
          className="max-h-[82vh] w-auto max-w-full rounded-xl object-contain shadow-2xl"
        />

        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar foto ampliada"
          className="absolute -top-3 -right-3 flex h-10 w-10 items-center justify-center rounded-full bg-sand-100 text-brand-900 shadow-lg transition-colors hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-sand-200"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={() => onNavigate(-1)}
              aria-label="Foto anterior"
              className="absolute top-1/2 -left-4 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-sand-100 text-brand-900 shadow-lg transition-colors hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-sand-200 sm:-left-16"
            >
              <ChevronLeft className="h-6 w-6" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => onNavigate(1)}
              aria-label="Foto siguiente"
              className="absolute top-1/2 -right-4 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-sand-100 text-brand-900 shadow-lg transition-colors hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-sand-200 sm:-right-16"
            >
              <ChevronRight className="h-6 w-6" aria-hidden />
            </button>
            <span className="absolute -bottom-9 left-1/2 -translate-x-1/2 rounded-full bg-brand-950/70 px-4 py-1 text-xs font-medium tracking-wide text-sand-100">
              {index + 1} / {items.length}
            </span>
          </>
        )}
      </div>
    </div>
  );
}