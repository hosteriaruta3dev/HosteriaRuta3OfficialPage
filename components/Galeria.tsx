import RoomGallery from "./RoomGallery";

export default function Galeria({
  photos,
  name,
}: {
  photos: string[];
  name: string;
}) {
  if (photos.length === 0) return null;

  return (
    <section
      id="galeria"
      className="scroll-mt-20 bg-sand-100 py-16 sm:py-24 [content-visibility:auto] [contain-intrinsic-size:auto_700px]"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-sand-700">
            Galería
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight text-brand-900 sm:text-4xl">
            Viví la experiencia antes de llegar
          </h2>
          <p className="mt-4 text-base leading-relaxed text-brand-800/80 sm:text-lg">
            Un adelanto del ambiente tranquilo y familiar que te espera en
            Mayor Buratovich: las habitaciones, el salón y el espacio al aire
            libre.
          </p>
        </div>

        <div className="mt-10">
          <RoomGallery images={photos} name={name} />
        </div>
      </div>
    </section>
  );
}