import { Router } from "express";

import {
  obtenerPagos,
  obtenerPagoPorId,
  crearPago,
  actualizarPago,
  eliminarPago
} from "../controllers/pagos.controller.js";

import {
  verificarToken
} from "../middleware/auth.middleware.js";

const router = Router();

// ==========================================
// MIDDLEWARE
// ==========================================

router.use(verificarToken);

// ==========================================
// RUTAS
// ==========================================

// OBTENER TODOS
router.get("/", obtenerPagos);

// OBTENER UNO
router.get("/:id", obtenerPagoPorId);

// CREAR
router.post("/", crearPago);

// ACTUALIZAR
router.put("/:id", actualizarPago);

// ELIMINAR
router.delete("/:id", eliminarPago);

// ==========================================
// EXPORT
// ==========================================

export default router;