import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/constants";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} | ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description:
    "Hospedaje temporario pet-friendly y salón de eventos en Mayor Buratovich, RN3 km 778. Capacidad para 8 huéspedes y eventos de hasta 40 personas. Reservá por WhatsApp.",
  keywords: [
    "Hostería Ruta 3",
    "Mayor Buratovich",
    "hospedaje Mayor Buratovich",
    "alquiler temporario Ruta 3",
    "salón de eventos Mayor Buratovich",
    "salón de fiestas Ruta 3",
    "hostería Ruta 3",
    "donde dormir en Ruta 3",
    "hospedaje RN3 km 778",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: SITE.name,
    description:
      "Descanso y eventos en Mayor Buratovich: hospedaje para 8 y salón para 40 personas sobre la Ruta 3.",
    url: SITE.url,
    siteName: SITE.name,
    locale: "es_AR",
    type: "website",
    images: [
      {
        url: "/images/habitaciones_exterior.jpg",
        width: 1536,
        height: 2048,
        alt: "Hostería Ruta 3 - Descanso y eventos en Mayor Buratovich",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.name,
    description:
      "Hospedaje y salón de eventos en Mayor Buratovich, RN3 km 778.",
    images: ["/images/habitaciones_exterior.jpg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#28442d",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${fraunces.variable} ${manrope.variable}`}>
      <body className="flex min-h-screen flex-col antialiased">{children}</body>
    </html>
  );
}