import type { Metadata } from "next";
import Image from "next/image";
import { SITE } from "@/lib/constants";
import { ShieldCheck } from "lucide-react";
import LoginForm from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Acceso administrador",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-900 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center gap-2 text-center">
          <Image
            src="/logo.png"
            alt={`Logo de ${SITE.name}`}
            width={1080}
            height={1080}
            className="h-16 w-16 rounded-full object-cover"
          />
          <p className="font-serif text-2xl font-semibold text-sand-100">
            {SITE.name}
          </p>
          <p className="inline-flex items-center gap-1.5 text-sm text-sand-200/70">
            <ShieldCheck className="h-4 w-4" />
            Panel de administración
          </p>
        </div>

        <div className="mt-8 rounded-3xl border border-brand-700 bg-sand-50 p-6 shadow-xl sm:p-8">
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-sm text-sand-300">
          Acceso restringido al equipo de {SITE.name}.
        </p>
      </div>
    </div>
  );
}