// servidor: se encarga de levantar el servidor, escchando todas las peticiones,sirve los archivos estaticos
// del lado del front , y conecta todas las rutas con los endpoint 
import dotenv from "dotenv";
dotenv.config();


// backend/server.js
import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import session from "express-session";
// import { verificarToken } from "./middleware/auth.js";


import trabajadoresRoutes from "./router/trabajadores.js";
import authRouter from "./router/auth.js";
import cobradorRoutes from "./router/rol2_cobrador.js";
import clientesRoutes from "./router/clientes.js";
import administradoresRoutes from "./router/administradores.js";
import pagosRoutes from "./router/pagos.js";
import dashboardRouter from "./router/dashboard.js";
const app = express();



// Para obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directorio para uploads (asegurar que exista)
const uploadsDir = path.join(__dirname, "../uploads");
try {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("Uploads directory ensured at:", uploadsDir);
} catch (err) {
  console.error("No se pudo crear la carpeta uploads:", err);
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar sesión
app.use(
  session({
    secret: "PrestAppSecretCambialoPorAlgoSeguro",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 1000 * 60 * 60
    }
  })
);

// Servir carpeta de imágenes y se muestren en el front
app.use("/uploads", express.static(uploadsDir));

// Evitar caché en páginas privadas
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");
  next();
});

// Middleware para verificar sesión
function verificarSesion(req, res, next) {
  if (req.session && req.session.usuario) {
    return next();
  } else {
    // Si es una petición API, retorna JSON; si no, redirige
    if (req.path.startsWith("/api")) {
      return res.status(401).json({ success: false, message: "No hay sesión activa" });
    }
    return res.redirect("/login");
  }
}






// Base de datos
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "prestapp"
});

// RUTAS API PRIMERO (ANTES DE ARCHIVOS ESTÁTICOS)
app.use("/api/trabajadores", trabajadoresRoutes);
app.use("/api/auth", authRouter);
app.use("/api/cobrador", cobradorRoutes);
app.use("/api/clientes", verificarSesion, clientesRoutes);
app.use("/api/administradores", verificarSesion, administradoresRoutes);
app.use("/api/pagos", verificarSesion, pagosRoutes);
app.use("/api/dashboard", verificarSesion, dashboardRouter);

// Rutas de frontend (páginas HTML específicas)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../src/html/register.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "../src/html/register.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../src/html/login.html"));
});

app.get("/index.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../src/html/index.html"));
});

app.get("/dashboard", (req, res) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.sendFile(path.join(__dirname, "../src/html/index.html"));
});

app.get("/trabajadores.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../src/html/trabajadores.html"));
});

app.get("/detalle-trabajador.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../src/html/detalle-trabajador.html"));
});

app.get("/Rol2_trabajador.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../src/html/Rol2_trabajador.html"));
});

app.get("/detalle-cliente.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../src/html/detalle-cliente.html"));
});

app.get("/administradores.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../src/html/administradores.html"));
});

// LUEGO servir archivos estáticos (CSS, JS, imágenes)
app.use(express.static(path.join(__dirname, "../src")));

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

export { pool, uploadsDir };
