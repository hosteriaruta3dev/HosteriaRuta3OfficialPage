import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getRoom } from "@/lib/data";
import { SITE } from "@/lib/constants";
import RoomDetail from "@/components/RoomDetail";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const salon = await getRoom("salon-eventos");
  if (!salon || salon.type !== "salon" || !salon.active) return {};
  return {
    title: salon.name,
    description: salon.description,
    alternates: { canonical: `${SITE.url}/salon` },
  };
}

export default async function SalonPage() {
  const salon = await getRoom("salon-eventos");
  if (!salon || salon.type !== "salon" || !salon.active) notFound();
  return <RoomDetail room={salon} />;
}