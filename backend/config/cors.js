// config/cors.js
import cors from "cors";

const allowedOrigins = [
  "http://localhost:4000",
  "http://localhost:5173",
  "http://127.0.0.1:5500",
];

// Función dinámica (mejor para desarrollo)
const isAllowedOrigin = (origin) => {
  if (!origin) return true; // Postman, mobile apps, etc.

  // Permitir localhost y red local automáticamente
  if (
    origin.startsWith("http://localhost") ||
    origin.startsWith("http://127.0.0.1") ||
    origin.startsWith("http://192.168.") ||
    origin.startsWith("http://10.")
  ) {
    return true;
  }

  return allowedOrigins.includes(origin);
};

export const corsOptions = {
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) {
      callback(null, true);
    } else {
      console.log("❌ CORS bloqueado:", origin);
      callback(new Error("No permitido por CORS"));
    }
  },
  credentials: true,
};

export default cors(corsOptions);