import type { MetadataRoute } from "next";
import { getActiveRooms } from "@/lib/data";
import { SITE } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const rooms = await getActiveRooms();
  const entries: MetadataRoute.Sitemap = [
    { url: SITE.url, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE.url}/disponibilidad`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE.url}/salon`, changeFrequency: "monthly", priority: 0.8 },
  ];

  for (const room of rooms.filter((item) => item.type === "habitacion")) {
    entries.push({
      url: `${SITE.url}/habitaciones/${room.id}`,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  return entries;
}