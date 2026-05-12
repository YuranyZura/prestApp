import multer from "multer";
import path from "path";
import fs from "fs";

// ======================================
// CREAR CARPETA SI NO EXISTE
// ======================================

const uploadPath = "src/uploads/";

if (!fs.existsSync(uploadPath)) {

  fs.mkdirSync(
    uploadPath,
    { recursive: true }
  );
}

// ======================================
// CONFIGURACIÓN STORAGE
// ======================================

const storage = multer.diskStorage({

  // DESTINO
  destination: (req, file, cb) => {

    cb(null, uploadPath);
  },

  // NOMBRE ARCHIVO
  filename: (req, file, cb) => {

    const extension =
      path.extname(file.originalname);

    const nombreArchivo =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      extension;

    cb(null, nombreArchivo);
  }
});

// ======================================
// VALIDAR TIPOS
// ======================================

const fileFilter = (req, file, cb) => {

  const tiposPermitidos = [
    "image/jpeg",
    "image/png",
    "application/pdf"
  ];

  if (
    tiposPermitidos.includes(file.mimetype)
  ) {

    cb(null, true);

  } else {

    cb(
      new Error(
        "Tipo de archivo no permitido"
      ),
      false
    );
  }
};

// ======================================
// MULTER
// ======================================

const upload = multer({

  storage,

  fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

export default upload;