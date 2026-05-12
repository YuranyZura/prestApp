// ==========================================
// PRESTAPP APP
// backend/src/app.js
// ==========================================

import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";

import { fileURLToPath } from "url";

// ==========================================
// ROUTES
// ==========================================

import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import clientesRoutes from "./routes/clientesRoutes.js";
import prestamosRoutes from "./routes/prestamosRoutes.js";
import pagosRoutes from "./routes/pagosRoutes.js";
import trabajadoresRoutes from "./routes/trabajadoresRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import cobradoresRoutes from "./routes/cobradoresRoutes.js";

// ==========================================
// MIDDLEWARES
// ==========================================

import errorHandler from "./middleware/errorHandler.js";
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

app.use(cors({
  origin: "*",
  credentials: true
}));

// ==========================================
// MIDDLEWARES
// ==========================================

app.use(express.json());

app.use(express.urlencoded({
  extended: true
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