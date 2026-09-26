import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-brand-700 focus:px-4 focus:py-2 focus:text-sand-50"
      >
        Saltar al contenido
      </a>
      <Navbar />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}