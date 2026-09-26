import sharp from "sharp"
import fs from "node:fs"
import path from "node:path"

const targets = [
  { file: "public/images/habitaciones_exterior.jpg", max: 2048 },
  { file: "public/images/habitacion_camas_simple.jpg", max: 1600 },
  { file: "public/images/habitacion_cama_doble.jpg", max: 1600 },
  { file: "public/images/salon_exterior_1.jpg", max: 1600 },
  { file: "public/images/salon_exterior_2.jpg", max: 1600 },
  { file: "public/images/salon_interior_1.jpg", max: 1600 },
  { file: "public/images/salon_interior_2.jpg", max: 1600 },
  { file: "public/images/salon_juegos.jpg", max: 1600 },
  { file: "public/images/predio.jpg", max: 1600 },
  { file: "public/logo.png", max: 256 },
  { file: "app/icon.png", max: 192 },
]

const report = []

for (const { file, max } of targets) {
  const abs = path.resolve(file)
  if (!fs.existsSync(abs)) {
    report.push(`SKIP  ${file} (missing)`)
    continue
  }
  const before = fs.statSync(abs).size
  const meta = await sharp(abs).metadata()
  const longest = Math.max(meta.width, meta.height)
  const scale = Math.min(1, max / longest)
  const outDims = {
    width: Math.round(meta.width * scale),
    height: Math.round(meta.height * scale),
  }
  const needsResize = scale < 1

  let img = sharp(abs, { failOn: "none" })
  if (needsResize) img = img.resize(outDims.width, outDims.height)

  if (meta.format === "jpeg") {
    img = img.jpeg({ quality: 80, progressive: true, mozjpeg: true })
  } else if (meta.format === "png") {
    img = img.png({ compressionLevel: 9, palette: true, effort: 10 })
  }

  await img.toFile(abs + ".tmp")
  const after = fs.statSync(abs + ".tmp").size
  fs.renameSync(abs + ".tmp", abs)
  const m2 = await sharp(abs).metadata()
  report.push(
    `${file.padEnd(42)} ${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB  ${m2.width}x${m2.height}`
  )
}

console.log(report.join("\n"))