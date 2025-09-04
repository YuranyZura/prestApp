// servidor: se encarga de levantar el servidor, escchando todas las peticiones,sirve los archivos estaticos
// del lado del front , y conecta todas las rutas con los endpoint 
import dotenv from "dotenv";
dotenv.config();


// backend/server.js
import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import path from "path";
import { fileURLToPath } from "url";

import usuariosRoutes from "./router/usuarios.js";
import authRouter from "./router/auth.js";

const app = express();

// Para obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir carpeta frontend
app.use(express.static(path.join(__dirname, "../src")));

// Base de datos
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "prestapp"
});

// Rutas de frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../src/html/register.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "../src/html/register.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../src/html/login.html"));
});

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "../src/html/index.html"));
});

app.get("/index.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../src/html/index.html"));
});

// Rutas API
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/auth", authRouter);

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
  
  
});

export { pool };
