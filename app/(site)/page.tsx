import Hero from "@/components/Hero";
import Hospedaje from "@/components/Hospedaje";
import RoomCards from "@/components/RoomCards";
import Salon from "@/components/Salon";
import Galeria from "@/components/Galeria";
import Ubicacion from "@/components/Ubicacion";
import { getActiveRooms } from "@/lib/data";
import { SITE } from "@/lib/constants";

export const dynamic = "force-dynamic";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  "@id": `${SITE.url}/#hosteria`,
  name: SITE.name,
  description:
    "Hospedaje temporario pet-friendly y salón de eventos en Mayor Buratovich, RN3 km 778. Capacidad de hospedaje para 8 personas y eventos de hasta 40.",
  url: SITE.url,
  telephone: "+54 9 291 573-5768",
  priceRange: "$$",
  acceptsReservations: true,
  address: {
    "@type": "PostalAddress",
    streetAddress: SITE.routeKm,
    postalCode: SITE.postalCode,
    addressLocality: SITE.city,
    addressRegion: SITE.province,
    addressCountry: "AR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: SITE.geo.lat,
    longitude: SITE.geo.lng,
  },
  hasMap: SITE.mapsUrl,
  amenityFeature: [
    {
      "@type": "LocationFeatureSpecification",
      name: "Pet friendly",
      value: true,
    },
    {
      "@type": "LocationFeatureSpecification",
      name: "Cochera techada",
      value: true,
    },
    {
      "@type": "LocationFeatureSpecification",
      name: "Salón de eventos para 40 personas",
      value: true,
    },
  ],
  sameAs: [SITE.instagramUrl],
};

export default async function Home() {
  const rooms = await getActiveRooms();
  const habitaciones = rooms.filter((room) => room.type === "habitacion");
  const salon = rooms.find((room) => room.type === "salon") ?? null;
  const allImages = rooms.flatMap((room) => room.images);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <Hospedaje
        images={habitaciones.flatMap((room) => room.images.slice(0, 2))}
        roomName="Habitaciones"
      />
      <RoomCards />
      <Salon salon={salon} />
      <Galeria photos={allImages} name="Hostería Ruta 3" />
      <Ubicacion />
    </>
  );
}