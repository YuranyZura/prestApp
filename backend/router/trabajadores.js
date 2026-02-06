// Ruta: /trabajadores.js - endpoints para gestionar trabajadores (CRUD) con manejo de fotos, eliminación y actualización 
//de los trabajadores etc

import express from "express";
import { pool, uploadsDir } from "../server.js";
import multer from "multer";

const router = express.Router();




// Configurar multer para guardar fotos en "uploads/"
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // usar la ruta absoluta exportada desde server.js para evitar errores ENOENT
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });


// Crear un nuevo trabajador
router.post("/trabajadores", upload.single("foto"), async (req, res) => {
  try {
    const { nombre, apellido, cedula, fechaNacimiento, direccion, celular, correo } = req.body;
    // Validación básica del formato de cédula: sólo dígitos, longitud razonable
    if (cedula && !/^\d{4,20}$/.test(String(cedula))) {
      return res.status(400).json({ message: "Cédula inválida. Debe contener sólo dígitos y tener entre 4 y 20 caracteres." });
    }
    const foto = req.file ? req.file.filename : null;

    const [result] = await pool.query(
      "INSERT INTO trabajadores (nombre, apellido, cedula, fecha_nacimiento, direccion, telefono, correo, foto) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [nombre, apellido, cedula, fechaNacimiento, direccion, celular, correo, foto]
    );

    res.json({
      id: result.insertId,
      nombre,
      apellido,
      cedula,
      fechaNacimiento,
      direccion,
      celular,
      correo,
      foto
    });
  } catch (error) {
    console.error("Error al crear trabajador:", error);
    res.status(500).json({ message: "Error al crear trabajador" });
  }
});


// Obtener todos los trabajadores
router.get("/trabajadores", async (req, res) => {
  try {
    const [trabajadores] = await pool.query("SELECT * FROM trabajadores"); 
    res.json(trabajadores);  
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener trabajadores" });
  }
});


// Obtener un trabajador por ID
router.get("/:id", async (req, res) => {
  const { id } = req.params; 
  try {
    const [trabajador] = await pool.query(
      "SELECT * FROM trabajadores WHERE id_trabajador = ?",
      [id]
    );

    if (trabajador.length === 0) {
      return res.status(404).json({ message: "Trabajador no encontrado" });
    }

    res.json(trabajador[0]); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener trabajador" });
  }
});


// ELIMINAR UN TRABAJADOR DE LA TABLA 
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [resultado] = await pool.query("DELETE FROM trabajadores WHERE id_trabajador = ?", [id]);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ message: "Trabajador no encontrado" });
    }

    res.json({ message: "Trabajador eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar trabajador" });
  }
});




// Actualizar trabajador
router.put("/trabajadores/:id", upload.single("foto"), async (req, res) => {
  const id = req.params.id;
  const { cedula, nombre, apellido, telefono, correo, direccion, fecha_nacimiento } = req.body;
  let foto = req.file ? req.file.filename : null; // si usas multer para manejar la foto



  try {
    let sql = `
      UPDATE trabajadores 
      SET cedula = ?, nombre = ?, apellido = ?, telefono = ?, correo = ?, direccion = ?, fecha_nacimiento = ?
      ${foto ? ", foto = ?" : ""}
      WHERE id_trabajador = ?
    `;

    const values = [cedula, nombre, apellido, telefono, correo, direccion, fecha_nacimiento];
    if (foto) values.push(foto);
    values.push(id);

    const [result] = await pool.query(sql, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Trabajador no encontrado" });
    }

    res.json({ message: "Trabajador actualizado correctamente" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar trabajador" });
  }
});




// Obtener un trabajador por ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM trabajadores WHERE id_trabajador = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ message: "Trabajador no encontrado" });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener trabajador" });
  }
});



export default router;
