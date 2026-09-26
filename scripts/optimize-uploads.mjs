import sharp from "sharp"
import fs from "node:fs/promises"
import path from "node:path"

const UPLOADS_DIR = path.resolve("public/uploads")
const STORE_PATH = path.resolve("data/store.json")
const MAX_DIMENSION = 1600
const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"])

async function exists(target) {
  try {
    await fs.access(target)
    return true
  } catch {
    return false
  }
}

const entries = await fs.readdir(UPLOADS_DIR, { withFileTypes: true })
const report = []
const renameMap = new Map()

for (const entry of entries) {
  if (!entry.isFile()) continue
  const ext = path.extname(entry.name).toLowerCase()
  if (!IMAGE_EXT.has(ext)) continue

  const oldAbs = path.join(UPLOADS_DIR, entry.name)
  const base = path.basename(entry.name, path.extname(entry.name))
  const newName = `${base}.webp`
  const newAbs = path.join(UPLOADS_DIR, newName)

  try {
    const before = (await fs.stat(oldAbs)).size
    let image = sharp(oldAbs, { animated: true }).rotate()
    const meta = await image.metadata()
    const longest = meta.width && meta.height ? Math.max(meta.width, meta.height) : 0
    if (longest > MAX_DIMENSION) {
      image = image.resize(MAX_DIMENSION, MAX_DIMENSION, { fit: "inside" })
    }
    await image.webp({ quality: 80 }).toFile(newAbs)
    const after = (await fs.stat(newAbs)).size

    if (newName !== entry.name) {
      await fs.unlink(oldAbs)
    }
    renameMap.set(`/uploads/${entry.name}`, `/uploads/${newName}`)
    report.push(
      `${entry.name.padEnd(42)} ${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB  ${newName}`
    )
  } catch (error) {
    report.push(`ERROR ${entry.name}: ${error.message}`)
  }
}

if (renameMap.size > 0 && (await exists(STORE_PATH))) {
  const store = JSON.parse(await fs.readFile(STORE_PATH, "utf8"))
  for (const room of store.rooms ?? []) {
    room.images = (room.images ?? []).map((url) => renameMap.get(url) ?? url)
  }
  await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf8")
  report.push(`store.json actualizado (${renameMap.size} rutas reemplazadas)`)
}

console.log(report.join("\n"))