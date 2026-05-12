// ==========================================
// TEST SERVER PRESTAPP
// test-server.js
// ==========================================

import express from "express";

const app = express();

/* ==========================================
CONFIG
========================================== */

const PORT = 4000;

/* ==========================================
MIDDLEWARES
========================================== */

app.use(express.json());

/* ==========================================
RUTA PRINCIPAL
========================================== */

app.get("/", (req, res) => {

  res.status(200).json({
    success: true,
    message: "Servidor PrestApp funcionando 🚀"
  });

});

/* ==========================================
HEALTH CHECK
========================================== */

app.get("/health", (req, res) => {

  res.status(200).json({
    status: "ok",
    server: "online",
    port: PORT
  });

});

/* ==========================================
ERROR 404
========================================== */

app.use((req, res) => {

  res.status(404).json({
    success: false,
    message: "Ruta no encontrada"
  });

});

/* ==========================================
INICIAR SERVIDOR
========================================== */

app.listen(PORT, "0.0.0.0", () => {

  console.log(`
==================================
🚀 PRESTAPP SERVER ONLINE
🌐 http://localhost:${PORT}
📱 Compatible Android y PC
==================================
`);

});
