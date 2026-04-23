import dotenv from "dotenv";


import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";

// ✅ IMPORTAR pool correcto
dotenv.config();
import rutasRoutes from "./router/rutas.js";
import { uploadsDir } from "./config/uploads.js";
import trabajadoresRoutes from "./router/trabajadores.js";
import authRouter from "./router/auth.js";
import cobradorRoutes from "./router/rol2_cobrador.js";
import clientesRoutes from "./router/clientes.js";
import administradoresRoutes from "./router/administradores.js";
import pagosRoutes from "./router/pagos.js";


const app = express();

// __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔥 Middleware
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔐 Sesión (corregido)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "super_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // 🔥 IMPORTANTE en desarrollo
      httpOnly: true,
      maxAge: 1000 * 60 * 60
    }
  })
);

// 📂 Archivos
app.use("/uploads", express.static(uploadsDir));
app.use(express.static(path.join(__dirname, "../src")));
app.get("/", (req, res) => {
  res.redirect("/html/login.html");
});
// 🔒 No cache
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

// 🔐 Middleware sesión
function verificarSesion(req, res, next) {
  if (req.session?.usuario) return next();
  return res.status(401).json({ success: false, message: "No hay sesión activa" });
}

// 🚀 RUTAS API
app.get("/test", (req, res) => {
  console.log("👉 Entró a /test");
  res.send("TEST OK 🚀");
});
app.get("/test", (req, res) => {
  console.log("👉 Entró a /test");
  res.send("TEST OK 🚀");
});
//app.use("/api/auth", authRouter);
//app.use("/api/trabajadores", trabajadoresRoutes);
//app.use("/api/cobrador", cobradorRoutes);
//app.use("/api/clientes", verificarSesion, clientesRoutes);
//app.use("/api/administradores", verificarSesion, administradoresRoutes);
//app.use("/api/pagos", verificarSesion, pagosRoutes);
//app.use("/api/rutas", rutasRoutes);

// 🌐 Frontend
//app.get("/", (req, res) => {
 // res.sendFile(path.join(__dirname, "../src/html/register.html"));
//});

//app.get("/login", (req, res) => {
 // res.sendFile(path.join(__dirname, "../src/html/login.html"));
//});

//app.get("/dashboard", (req, res) => {
 // res.sendFile(path.join(__dirname, "../src/html/index.html"));
//});

// 🚀 SERVER
const PORT = process.env.PORT || 4000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
process.on("uncaughtException", (err) => {
  console.error("🔥 ERROR GLOBAL:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("🔥 PROMESA FALLÓ:", err);
});