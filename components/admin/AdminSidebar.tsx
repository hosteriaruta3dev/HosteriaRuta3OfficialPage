"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BedDouble,
  CalendarRange,
  Home,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { logoutAction } from "@/lib/actions/auth";

const NAV_ITEMS = [
  { href: "/admin", label: "Inicio", icon: Home },
  { href: "/admin/habitaciones", label: "Habitaciones", icon: BedDouble },
  { href: "/admin/disponibilidad", label: "Disponibilidad", icon: CalendarRange },
] as const;

export default function AdminSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <aside className="flex flex-col gap-6 bg-brand-900 p-4 text-sand-100 sm:p-6 lg:min-h-screen lg:w-64 lg:shrink-0">
        <div className="flex items-center justify-between gap-3 lg:flex-col lg:items-start">
          <div>
            <p className="font-serif text-lg font-semibold text-sand-100">
              Panel admin
            </p>
            <p className="text-xs text-sand-200/60">Hostería Ruta 3</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="rounded-full bg-brand-700 px-3 py-1.5 text-xs font-semibold text-sand-100 transition-colors hover:bg-brand-600"
            >
              Ver sitio
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="admin-menu-mobile"
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-sand-100 transition-colors hover:bg-brand-700 lg:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <nav className="hidden flex-col gap-1 lg:flex">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-sand-200 text-brand-900"
                    : "text-sand-100/80 hover:bg-brand-800 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto hidden lg:block lg:border-t lg:border-brand-700 lg:pt-4">
          <form action={logoutAction}>
            <button
              type="submit"
              className="inline-flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-sand-100/80 transition-colors hover:bg-brand-800 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              Cerrar sesión
            </button>
          </form>
        </div>
      </aside>

      {open && (
        <div
          id="admin-menu-mobile"
          className="border-b border-brand-700 bg-brand-800/90 px-4 pb-6 pt-4 backdrop-blur-md lg:hidden"
        >
          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`inline-flex items-center gap-2 rounded-lg px-3 py-3 text-base font-medium transition-colors ${
                    isActive
                      ? "bg-sand-200 text-brand-900"
                      : "text-sand-100 hover:bg-brand-700"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
            <form action={logoutAction} className="mt-2 border-t border-brand-700 pt-3">
              <button
                type="submit"
                className="inline-flex w-full items-center gap-2 rounded-lg px-3 py-3 text-base font-medium text-sand-100/80 transition-colors hover:bg-brand-700 hover:text-white"
              >
                <LogOut className="h-5 w-5" />
                Cerrar sesión
              </button>
            </form>
          </nav>
        </div>
      )}
    </>
  );
}
