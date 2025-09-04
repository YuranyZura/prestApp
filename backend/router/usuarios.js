// router/usuarios.js
import { Router } from "express";
import { pool } from "../server.js";

const router = Router();

// Listar todos los usuarios
router.get("/", async (req, res) => {
  try {
    const [usuarios] = await pool.query(
      "SELECT id_usuarios, nombre, apellido, correo, rol, verificado FROM usuarios"
    );
    res.json(usuarios);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

// Eliminar un usuario
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM usuarios WHERE id_usuarios = ?", [id]);
    res.json({ mensaje: "Usuario eliminado correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
});

// Actualizar un usuario
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, correo, rol } = req.body;
    await pool.query(
      "UPDATE usuarios SET nombre=?, apellido=?, correo=?, rol=? WHERE id_usuarios=?",
      [nombre, apellido, correo, rol, id]
    );
    res.json({ mensaje: "Usuario actualizado correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
});

// 🔹 Export default para que server.js lo pueda importar
export default router;
