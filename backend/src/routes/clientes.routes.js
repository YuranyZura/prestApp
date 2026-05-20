import { Router } from "express";

import {
  obtenerClientes,
  obtenerClientePorId,
  crearCliente,
  actualizarCliente,
  eliminarCliente
} from "../controllers/clientes.controller.js";

import {
  verificarToken
} from "../middleware/auth.middleware.js";

const router = Router();

router.use(verificarToken);

router.get("/", obtenerClientes);

router.get("/:id", obtenerClientePorId);

router.post("/", crearCliente);

router.put("/:id", actualizarCliente);

router.delete("/:id", eliminarCliente);

export default router;