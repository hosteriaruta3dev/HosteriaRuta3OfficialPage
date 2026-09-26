import { ExternalLink, MapPin, MessageCircle } from "lucide-react";
import { MAPS_EMBED_URL, SITE, whatsapp, WHATSAPP_MESSAGES } from "@/lib/constants";

export default function Ubicacion() {
  return (
    <section
      id="ubicacion"
      className="scroll-mt-20 bg-sand-50 py-16 sm:py-24 [content-visibility:auto] [contain-intrinsic-size:auto_700px]"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-14">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-sand-700">
            Ubicación
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight text-brand-900 sm:text-4xl">
            Encontrarnos es fácil: quedamos sobre la Ruta 3
          </h2>

          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-sand-200 bg-white/70 p-5">
            <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-700 text-sand-100">
              <MapPin className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <p className="font-semibold text-brand-900">{SITE.city}</p>
              <p className="mt-1 text-sm leading-relaxed text-brand-800/70">
                {SITE.routeKm}, {SITE.postalCode} — {SITE.province},{" "}
                {SITE.country}
              </p>
            </div>
          </div>

          <p className="mt-5 text-base leading-relaxed text-brand-800/80">
            Parada natural para quienes recorren la Ruta 3: llegás por la ruta, con
            acceso directo y cochera techada dentro del predio para descansar
            tranquilo.
          </p>

          <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center">
            <a
              href={whatsapp(WHATSAPP_MESSAGES.ubicacion)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-700 px-7 py-3.5 text-base font-semibold text-sand-50 transition-colors hover:bg-brand-800"
            >
              <MessageCircle className="h-5 w-5" aria-hidden />
              Pedir indicaciones por WhatsApp
            </a>
            <a
              href={SITE.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-brand-700 px-7 py-3.5 text-base font-semibold text-brand-700 transition-colors hover:bg-brand-700 hover:text-sand-50"
            >
              <ExternalLink className="h-5 w-5" aria-hidden />
              Abrir en Google Maps
            </a>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-sand-200 bg-white p-2 shadow-lg">
          <iframe
            src={MAPS_EMBED_URL}
            title={`Mapa de ${SITE.name} - ${SITE.address.replace(", Argentina", "")}`}
            className="aspect-video w-full rounded-2xl border-0 lg:aspect-[4/5]"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}