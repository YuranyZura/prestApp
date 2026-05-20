import { Router } from "express";

import {
  obtenerTrabajadores,
  crearTrabajador,
  actualizarTrabajador,
  eliminarTrabajador
} from "../controllers/trabajadores.controller.js";

import {
  verificarToken
} from "../middleware/authMiddleware.js";

const router = Router();

router.use(verificarToken);

router.get("/", obtenerTrabajadores);

router.post("/", crearTrabajador);

router.put("/:id", actualizarTrabajador);

router.delete("/:id", eliminarTrabajador);

export default router;
