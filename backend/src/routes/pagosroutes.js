import { Router } from "express";

import {
  obtenerPagos,
  crearPago,
  eliminarPago
} from "../controllers/pagosController.js";

import {
  verificarToken
} from "../middleware/authMiddleware.js";

const router = Router();

router.use(verificarToken);

router.get("/", obtenerPagos);

router.post("/", crearPago);

router.delete("/:id", eliminarPago);

export default router;