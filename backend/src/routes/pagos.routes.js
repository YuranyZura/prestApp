import { Router } from "express";

import {
  obtenerPagos,
  crearPago,
  eliminarPago
} from "../controllers/pagos.controller.js";

import {
  verificarToken
} from "../middleware/auth.middleware.js";

const router = Router();

router.use(verificarToken);

router.get("/", obtenerPagos);

router.post("/", crearPago);

router.delete("/:id", eliminarPago);

export default router;