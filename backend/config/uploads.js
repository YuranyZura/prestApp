import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// 🔧 Fix __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 📁 Ruta absoluta a la carpeta uploads (mejor con process.cwd)
const uploadsDir = path.join(process.cwd(), "uploads");

// 📁 Crear carpeta automáticamente si no existe
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("📁 Carpeta uploads creada:", uploadsDir);
}

// 📌 Obtener ruta completa del archivo
export const getFilePath = (filename) => {
  return path.join(uploadsDir, filename);
};

// 📌 Eliminar archivo (más seguro)
export const deleteFile = (filename) => {
  try {
    const filePath = getFilePath(filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }

    return false;
  } catch (error) {
    console.error("❌ Error eliminando archivo:", error.message);
    return false;
  }
};

// 📌 Generar nombre único seguro
export const generateFileName = (originalName) => {
  const ext = path.extname(originalName);
  const name = path
    .basename(originalName, ext)
    .replace(/[^a-zA-Z0-9]/g, "_"); // 🔒 sanitiza nombre

  const timestamp = Date.now();

  return `${name}-${timestamp}${ext}`;
};

// 📤 Export principal
export { uploadsDir };