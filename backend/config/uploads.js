import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// 🔧 Fix __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 📁 Carpeta uploads
const uploadsDir = path.join(process.cwd(), "uploads");

// Crear carpeta si no existe
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("📁 Carpeta uploads creada:", uploadsDir);
}

// 📌 Ruta segura
export const getFilePath = (filename) => {
  const safeName = path.basename(filename); // 🔥 evita rutas maliciosas
  return path.join(uploadsDir, safeName);
};

// 📌 Eliminar archivo (async y seguro)
export const deleteFile = async (filename) => {
  try {
    const filePath = getFilePath(filename);

    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
      return true;
    }

    return false;
  } catch (error) {
    console.error("❌ Error eliminando archivo:", error.message);
    return false;
  }
};

// 📌 Extensiones permitidas
const allowedExtensions = [".jpg", ".jpeg", ".png", ".pdf"];

// 📌 Generar nombre seguro
export const generateFileName = (originalName) => {
  const ext = path.extname(originalName).toLowerCase();

  if (!allowedExtensions.includes(ext)) {
    throw new Error("Tipo de archivo no permitido");
  }

  const name = path
    .basename(originalName, ext)
    .replace(/[^a-zA-Z0-9]/g, "_");

  const timestamp = Date.now();

  return `${name}-${timestamp}${ext}`;
};

// 📤 Export
export { uploadsDir };