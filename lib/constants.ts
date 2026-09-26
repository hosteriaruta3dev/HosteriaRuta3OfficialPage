export const SITE = {
  name: "Hostería Ruta 3",
  city: "Mayor Buratovich",
  province: "Provincia de Buenos Aires",
  country: "Argentina",
  routeKm: "RN3 km 778",
  postalCode: "B8146",
  address:
    "RN3 km 778, B8146 Mayor Buratovich, Provincia de Buenos Aires, Argentina",
  mapsUrl: "https://maps.app.goo.gl/jhySCgLEZ9HjoaZo9",
  geo: {
    lat: -39.2569096,
    lng: -62.5971999,
  },
  phoneDisplay: "291 573-5768",
  phoneHref: "tel:+5492915735768",
  whatsappNumber: "5492915735768",
  instagramHandle: "@hosteriaruta3",
  instagramUrl: "https://instagram.com/hosteriaruta3",
  url: "https://hosteriaruta3.com.ar",
  tagline: "Descanso y eventos en Mayor Buratovich",
} as const;

export const WHATSAPP_MESSAGES = {
  general: "Hola Hostería Ruta 3, quiero hacer una consulta.",
  hospedaje:
    "Hola Hostería Ruta 3, quiero reservar hospedaje para las siguientes fechas. ¿Tienen disponibilidad?",
  salon:
    "Hola Hostería Ruta 3, quiero consultar fechas disponibles para el salón de eventos.",
  ubicacion:
    "Hola Hostería Ruta 3, ¿me pueden indicar cómo llegar desde la Ruta 3?",
} as const;

export const whatsapp = (message: string) =>
  `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`;

export const MAPS_EMBED_URL = `https://www.google.com/maps?ll=${SITE.geo.lat},${SITE.geo.lng}&z=16&hl=es&q=${encodeURIComponent(
  SITE.address,
)}&output=embed`;