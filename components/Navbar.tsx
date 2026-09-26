"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/#hospedaje", label: "Hospedaje" },
  { href: "/#habitaciones", label: "Habitaciones" },
  { href: "/#salon", label: "Salón" },
  { href: "/#ubicacion", label: "Ubicación" },
] as const;

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-brand-800/90 backdrop-blur-md">
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6"
        aria-label="Navegación principal"
      >
        <Link
          href="/#inicio"
          className="flex items-center gap-3"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/logo.png"
            alt="Logo de Hostería Ruta 3"
            width={1080}
            height={1080}
            className="h-10 w-10 rounded-full object-cover"
            sizes="40px"
          />
          <span className="font-serif text-lg font-semibold tracking-tight text-sand-100">
            Hostería Ruta 3
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-sand-100/90 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/disponibilidad"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-sand-200 px-5 py-2.5 text-sm font-semibold text-brand-900 transition-colors hover:bg-white"
          >
            <CalendarDays className="h-4 w-4" />
            Consultar disponibilidad
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="menu-mobile"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-sand-100 transition-colors hover:bg-brand-700 md:hidden"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div
          id="menu-mobile"
          className="border-t border-brand-700 bg-brand-800 px-4 pb-6 pt-4 md:hidden"
        >
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-base font-medium text-sand-100 transition-colors hover:bg-brand-700"
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/disponibilidad"
              onClick={() => setOpen(false)}
              className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-sand-200 px-5 py-3 text-base font-semibold text-brand-900 transition-colors hover:bg-white"
            >
              <CalendarDays className="h-5 w-5" />
              Consultar disponibilidad
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}