import Image from "next/image";
import Link from "next/link";
import { Car, MapPin, PawPrint, ThumbsUp } from "lucide-react";

const TRUST_POINTS = [
  { icon: PawPrint, label: "Pet friendly" },
  { icon: Car, label: "Cochera techada" },
  { icon: ThumbsUp, label: "Precio-calidad" },
];

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative flex min-h-[88svh] items-center overflow-hidden bg-brand-900"
    >
      <Image
        src="/images/hosteria_exterior.jpg"
        alt="Exterior de las habitaciones de Hostería Ruta 3 en su entorno rural, RN3 km 778 en Mayor Buratovich"
        fill
        sizes="100vw"
        preload
        className="object-cover"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-b from-brand-950/85 via-brand-900/55 to-brand-950/90"
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-24 text-center sm:px-6">
        <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-sand-300/30 bg-brand-900/40 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-sand-200 backdrop-blur-sm">
          <MapPin className="h-3.5 w-3.5 text-sand-400" aria-hidden />
          Mayor Buratovich · RN3 km 778
        </p>

        <h1 className="mx-auto max-w-3xl font-serif text-4xl font-semibold leading-tight text-sand-50 sm:text-5xl lg:text-6xl">
          Descanso y Eventos en Mayor Buratovich{" "}
          <span className="text-sand-300">— Hostería Ruta 3</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-sand-100/85 sm:text-lg">
          Hospedaje temporario para quienes viajan por la Ruta 3 y quieren parar a
          descansar, y un salón de eventos para festejar sin complicarte. En un
          ambiente tranquilo, familiar y pet-friendly.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Link
            href="#hospedaje"
            className="inline-flex w-full items-center justify-center rounded-full bg-sand-200 px-7 py-3.5 text-base font-semibold text-brand-900 transition-colors hover:bg-white sm:w-auto"
          >
            Ver Hospedaje
          </Link>
          <Link
            href="#salon"
            className="inline-flex w-full items-center justify-center rounded-full border-2 border-sand-200/40 px-7 py-3.5 text-base font-semibold text-sand-50 transition-colors hover:border-sand-200 hover:bg-sand-200 hover:text-brand-900 sm:w-auto"
          >
            Consultar Salón
          </Link>
        </div>

        <ul className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {TRUST_POINTS.map((point) => (
            <li
              key={point.label}
              className="flex items-center gap-2 text-sm font-medium text-sand-100/90"
            >
              <point.icon className="h-4.5 w-4.5 text-sand-400" aria-hidden />
              {point.label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}