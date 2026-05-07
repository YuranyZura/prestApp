// ==========================================
// PRESTAPP SERVER
// backend/server.js
// ==========================================

import dotenv from "dotenv";
dotenv.config();

// ==========================================
// IMPORTS
// ==========================================

import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import session from "express-session";

import path from "path";
import { fileURLToPath } from "url";

// ==========================================
// CONFIG
// ==========================================

import { corsOptions } from "./config/cors.js";
import { uploadsDir } from "./config/uploads.js";

// ==========================================
// ROUTES
// ==========================================

import authRouter from "./router/auth.js";
import dashboardRoutes from "./router/dashboard.js";
import pagosRoutes from "./router/pagos.js";
import prestamosRoutes from "./router/prestamos.js";
import rutasRoutes from "./router/rutas.js";
import trabajadoresRoutes from "./router/trabajadores.js";
import cobradorRoutes from "./router/rol2_cobrador.js";
import clientesRoutes from "./router/clientes.js";
import administradoresRoutes from "./router/administradores.js";

// ==========================================
// APP
// ==========================================

const app = express();

// ==========================================
// FIX __dirname
// ==========================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==========================================
// SEGURIDAD
// ==========================================

// Helmet
app.use(helmet());

// Rate limit
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,

    message: {
      success: false,
      message: "Demasiadas peticiones. Intenta más tarde."
    }
  })
);

// ==========================================
// CORS
// ==========================================

app.use(cors(corsOptions));

// ==========================================
// BODY PARSER
// ==========================================

app.use(express.json({ limit: "10mb" }));

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb"
  })
);

// ==========================================
// SESSION
// ==========================================

app.use(
  session({
    secret:
      process.env.SESSION_SECRET ||
      "prestapp_secret_key",

    resave: false,

    saveUninitialized: false,

    cookie: {
      secure:
        process.env.NODE_ENV === "production",

      httpOnly: true,

      sameSite: "lax",

      maxAge:
        1000 * 60 * 60 * 8 // 8 horas
    }
  })
);

// ==========================================
// LOGGER
// ==========================================

app.use((req, res, next) => {
  console.log(
    `📌 ${req.method} ${req.originalUrl}`
  );

  next();
});

// ==========================================
// NO CACHE
// ==========================================

app.use((req, res, next) => {

  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, private"
  );

  next();
});

// ==========================================
// STATIC FILES
// ==========================================

// Uploads
app.use(
  "/uploads",
  express.static(uploadsDir)
);

// Frontend
app.use(
  express.static(
    path.join(__dirname, "../src")
  )
);

// ==========================================
// API ROUTES
// ==========================================

app.use("/api/auth", authRouter);

app.use(
  "/api/dashboard",
  dashboardRoutes
);

app.use(
  "/api/pagos",
  pagosRoutes
);

app.use(
  "/api/prestamos",
  prestamosRoutes
);

app.use(
  "/api/rutas",
  rutasRoutes
);

app.use(
  "/api/trabajadores",
  trabajadoresRoutes
);

app.use(
  "/api/cobrador",
  cobradorRoutes
);

app.use(
  "/api/clientes",
  clientesRoutes
);

app.use(
  "/api/administradores",
  administradoresRoutes
);

// ==========================================
// HOME
// ==========================================

app.get("/", (req, res) => {

  res.redirect(
    "/html/auth/login.html"
  );
});

// ==========================================
// API 404
// ==========================================

app.use("/api", (req, res) => {

  res.status(404).json({
    success: false,
    message: "Ruta API no encontrada"
  });
});

// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

app.use((err, req, res, next) => {

  console.error("🔥 ERROR:", err);

  res.status(err.status || 500).json({
    success: false,

    message:
      err.message ||
      "Error interno del servidor"
  });
});

// ==========================================
// START SERVER
// ==========================================

const PORT =
  process.env.PORT || 4000;

app.listen(PORT, () => {

  console.log(`
====================================
✅ PRESTAPP INICIADO
🌎 http://localhost:${PORT}
====================================
  `);

});