// config/cors.js
import cors from "cors";

const allowedOrigins = [
  "http://localhost:4000",
  "http://localhost:5173",
  "http://127.0.0.1:5500",
  // 👉 agrega aquí tu IP local si usas Android
  // "http://192.168.1.10:4000"
];

export const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("cors bloqueado para:", origin);
      callback(new Error("No permitido por CORS"));
    }
  },
  credentials: true
};

export default cors(corsOptions);