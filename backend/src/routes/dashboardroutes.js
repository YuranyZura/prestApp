// ==========================================
// DASHBOARD ROUTES
// backend/src/routes/dashboardroutes.js
// ==========================================

import { Router } from "express";

import {
  obtenerDashboard,
  obtenerResumen,
  obtenerMetricas
} from "../controllers/dashboardController.js";

import {
  verificarToken
} from "../middleware/authMiddleware.js";

const router = Router();

/* ==========================================
MIDDLEWARE
========================================== */

router.use(verificarToken);

/* ==========================================
RUTAS
========================================== */

router.get("/", obtenerDashboard);

router.get("/resumen", obtenerResumen);

router.get("/metricas", obtenerMetricas);

/* ==========================================
EXPORT
========================================== */

export default router;