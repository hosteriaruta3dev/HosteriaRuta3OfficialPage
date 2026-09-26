import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen flex-col bg-sand-100 lg:flex-row">
      <AdminSidebar />
      <main className="flex-1 px-4 py-6 sm:px-8 sm:py-8">
        {children}
      </main>
    </div>
  );
}