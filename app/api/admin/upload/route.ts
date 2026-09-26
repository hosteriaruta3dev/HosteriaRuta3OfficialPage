import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import sharp from "sharp";
import { COOKIE_NAME, verifyToken } from "@/lib/session";
import { getSupabaseAdmin, STORAGE_BUCKET } from "@/lib/supabase";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const OUTPUT_TYPE = "image/webp";
const OUTPUT_EXT = "webp";
const MAX_DIMENSION = 1600;

async function optimizeImage(buffer: Buffer): Promise<Buffer> {
  const image = sharp(buffer, { animated: true }).rotate();
  const meta = await image.metadata();
  const longest = meta.width && meta.height ? Math.max(meta.width, meta.height) : 0;
  if (longest > MAX_DIMENSION) {
    image.resize(MAX_DIMENSION, MAX_DIMENSION, { fit: "inside" });
  }
  return image.webp({ quality: 80 }).toBuffer();
}

export async function POST(request: Request) {
  const token = request.headers.get("cookie")?.match(new RegExp(`${COOKIE_NAME}=([^;]+)`))?.[1]
    ?? request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Formato inválido." }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No se envió ningún archivo." }, { status: 400 });
  }

  const mime = file.type;
  if (mime !== "image/jpeg" && mime !== "image/png" && mime !== "image/webp" && mime !== "image/gif") {
    return NextResponse.json(
      { error: "Formato no permitido. Use JPG, PNG, WebP o GIF." },
      { status: 400 },
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "La imagen supera el tamaño máximo de 5 MB." },
      { status: 400 },
    );
  }

  let buffer: Buffer;
  try {
    buffer = await optimizeImage(Buffer.from(await file.arrayBuffer()));
  } catch {
    return NextResponse.json(
      { error: "No se pudo procesar la imagen." },
      { status: 400 },
    );
  }

  const filename = `${Date.now()}-${randomUUID().slice(0, 8)}.${OUTPUT_EXT}`;

  const { error: bucketError } = await getSupabaseAdmin().storage.createBucket(
    STORAGE_BUCKET,
    { public: true },
  );
  if (bucketError) {
    const message = (bucketError as { message?: string }).message ?? "";
    if (!/already exists/i.test(message)) {
      return NextResponse.json(
        { error: "No se pudo acceder al contenedor de imágenes." },
        { status: 500 },
      );
    }
  }

  const { error, data } = await getSupabaseAdmin().storage
    .from(STORAGE_BUCKET)
    .upload(filename, buffer, { contentType: OUTPUT_TYPE, upsert: false });
  if (error) {
    return NextResponse.json(
      { error: "No se pudo subir la imagen al almacenamiento." },
      { status: 500 },
    );
  }

  const { data: publicUrl } = getSupabaseAdmin().storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(data.path);

  return NextResponse.json({ url: publicUrl.publicUrl });
}
