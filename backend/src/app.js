// ==========================================
// PRESTAPP APP
// backend/src/app.js
// ==========================================

import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import mongoSanitize from "express-mongo-sanitize";

//import xss from "xss-clean";

import { fileURLToPath } from "url";

// ==========================================
// ROUTES
// ==========================================

import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import clientesRoutes from "./routes/clientes.routes.js";
import prestamosRoutes from "./routes/prestamos.routes.js";
import pagosRoutes from "./routes/pagos.routes.js";
import trabajadoresRoutes from "./routes/trabajadores.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import cobradoresRoutes from "./routes/cobradores.routes.js";

// ==========================================
// MIDDLEWARES
// ==========================================

import errorHandler from "./middleware/errorhandler.js";
import notFound from "./middleware/notFound.js";

// ==========================================
// CONFIG
// ==========================================

dotenv.config();

const app = express();

const __filename =
  fileURLToPath(import.meta.url);

const __dirname =
  path.dirname(__filename);

// ==========================================
// CORS
// ==========================================

const allowedOrigins = [
  // LOCAL
  "http://localhost:5173",
  "http://localhost:3000",
  // PRODUCCION
  process.env.FRONTEND_URL,
  "https://www.tudominio.com"
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS"));
    }
  },
  credentials: true
}));

// ==========================================
// MIDDLEWARES
// ==========================================
app.use(express.json());

app.use(express.urlencoded({
  extended: true
}));

app.use(helmet());

app.use(hpp());

app.use(mongoSanitize());

//app.use(xss());

app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}));
app.use(morgan("dev"));

// ==========================================
// STATIC FILES
// ==========================================

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "../uploads")
  )
);

// ==========================================
// HEALTH CHECK
// ==========================================

app.get("/", (req, res) => {

  res.status(200).json({
    success: true,
    message: "PrestApp API funcionando 🚀"
  });

});

app.get("/health", (req, res) => {

  res.status(200).json({
    success: true,
    status: "online"
  });

});

// ==========================================
// API ROUTES
// ==========================================

app.use("/api/auth", authRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/clientes", clientesRoutes);

app.use("/api/prestamos", prestamosRoutes);

app.use("/api/pagos", pagosRoutes);

app.use("/api/trabajadores", trabajadoresRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/cobradores", cobradoresRoutes);

// ==========================================
// 404
// ==========================================

app.use(notFound);

// ==========================================
// ERROR HANDLER
// ==========================================

app.use(errorHandler);

// ==========================================
// EXPORT
// ==========================================

export default app;