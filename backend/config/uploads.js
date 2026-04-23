import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// 🔧 Fix __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 📁 Ruta absoluta a la carpeta uploads
const uploadsDir = path.join(__dirname, "../../uploads");

// 📁 Crear carpeta automáticamente si no existe
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("📁 Carpeta uploads creada:", uploadsDir);
}

// 📌 Función para obtener ruta de archivos
const getFilePath = (filename) => {
  return path.join(uploadsDir, filename);
};

// 📌 Función para eliminar archivo
const deleteFile = (filename) => {
  const filePath = getFilePath(filename);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return true;
  }

  return false;
};

// 📌 Función para generar nombre único (evita sobrescribir)
const generateFileName = (originalName) => {
  const ext = path.extname(originalName);
  const name = path.basename(originalName, ext);
  const timestamp = Date.now();

  return `${name}-${timestamp}${ext}`;
};

// 📤 Exportaciones
export {
  uploadsDir,
  getFilePath,
  deleteFile,
  generateFileName
};