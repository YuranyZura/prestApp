// config/cors.js

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://127.0.0.1:5500",
  // 👉 agrega aquí tu IP local si usas Android
  // "http://192.168.1.10:4000"
];

export const corsOptions = {
  origin: (origin, callback) => {
    // Permitir requests sin origin (Postman, Android WebView, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.warn("⚠️ CORS bloqueado para:", origin);
      return callback(new Error("No permitido por CORS"));
    }
  },
  credentials: true,
};