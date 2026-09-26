import Image from "next/image";
import Link from "next/link";
import { AtSign, MapPin, MessageCircle, Phone } from "lucide-react";
import { SITE, whatsapp, WHATSAPP_MESSAGES } from "@/lib/constants";

const NAV_LINKS = [
  { href: "/#inicio", label: "Inicio" },
  { href: "/#hospedaje", label: "Hospedaje" },
  { href: "/#habitaciones", label: "Habitaciones" },
  { href: "/#salon", label: "Salón de eventos" },
  { href: "/#ubicacion", label: "Ubicación" },
] as const;

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-950 py-14 text-sand-200">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-3">
          <div>
            <Link href="/#inicio" className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Logo de Hostería Ruta 3"
                width={1080}
                height={1080}
                className="h-12 w-12 rounded-full object-cover"
                sizes="48px"
              />
              <span className="font-serif text-xl font-semibold tracking-tight text-sand-50">
                Hostería Ruta 3
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-sand-200/70">
              Descanso y eventos en Mayor Buratovich. Hospedaje pet-friendly y
              salón para festejar sin complicarte, sobre la Ruta 3.
            </p>
          </div>

          <nav aria-label="Navegación del pie de página">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-sand-400">
              Explorá
            </h3>
            <ul className="mt-4 space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-sand-200/80 transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-sand-400">
              Contacto
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href={SITE.phoneHref}
                  className="flex items-center gap-2.5 text-sm text-sand-200/80 transition-colors hover:text-white"
                >
                  <Phone className="h-4 w-4 shrink-0 text-sand-400" aria-hidden />
                  {SITE.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={whatsapp(WHATSAPP_MESSAGES.general)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm text-sand-200/80 transition-colors hover:text-white"
                >
                  <MessageCircle className="h-4 w-4 shrink-0 text-sand-400" aria-hidden />
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={SITE.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm text-sand-200/80 transition-colors hover:text-white"
                >
                  <AtSign className="h-4 w-4 shrink-0 text-sand-400" aria-hidden />
                  Instagram {SITE.instagramHandle}
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-sand-200/80">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sand-400" aria-hidden />
                <span>
                  {SITE.city}, {SITE.routeKm}
                  <br />
                  {SITE.province}, {SITE.country}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-brand-800 pt-6 text-center">
          <p className="text-xs text-sand-300">
            © {year} {SITE.name} · {SITE.city}, {SITE.province}
          </p>
        </div>
      </div>
    </footer>
  );
}