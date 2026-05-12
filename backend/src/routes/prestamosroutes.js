import { Router } from "express";

import {
  obtenerPrestamos,
  crearPrestamo,
  actualizarPrestamo,
  eliminarPrestamo
} from "../controllers/prestamosController.js";

import {
  verificarToken
} from "../middleware/authMiddleware.js";

const router = Router();

router.use(verificarToken);

router.get("/", obtenerPrestamos);

router.post("/", crearPrestamo);

router.put("/:id", actualizarPrestamo);

router.delete("/:id", eliminarPrestamo);

export default router;