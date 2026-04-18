// Aquí van todos los endpoints relacionados con REGISTRO Y INCIO DE SESION,VALIDACION DE CORREO
// VALIDACION DE SONTRASEÑAS,TODOS LO QUE TENGA QUE VER OCN AUTENTICACION por eso el archivo se llama auth.

import { Router } from "express";
import bcrypt from "bcrypt";
import { pool } from "../config/db.js"; // importar pool del servidor
import { enviarCodigoVerificacion } from "../config/mailer.js";
import jwt from "jsonwebtoken";

const router = Router();
// Si se activa, las contraseñas se guardan en claro (inseguro). Usar solo en desarrollo local.
const USE_PLAIN_PASSWORDS = process.env.PLAIN_PASSWORDS === "true";
if (USE_PLAIN_PASSWORDS) {
  console.warn("WARNING: PLAIN_PASSWORDS=true — las contraseñas se almacenarán en texto plano. Esto es INSEGURO.");
}


//  correos válidos
const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Lista de dominios  que queremos bloquear
const dominiosProhibidos = [ "tempmail.com", "example.com", "test.com"];


// POST /auth/register
router.post("/register", async (req, res) => {
  try {
    const { nombre, apellido, correo, contrasena } = req.body;

    if (!nombre || !apellido || !correo || !contrasena) {
      return res.status(400).json({ 
        success: false, 
        message: "Faltan datos requeridos" 
      });
    }

    if (!correoRegex.test(correo)) {
      return res.status(400).json({ 
        success: false, 
        message: "Correo no válido" 
      });
    }

    const dominio = correo.split("@")[1].toLowerCase();
    if (dominiosProhibidos.includes(dominio)) {
      return res.status(400).json({ 
        success: false, 
        message: "No se permiten correos de prueba" 
      });
    }

    const [existingUser] = await pool.query("SELECT * FROM usuarios WHERE correo = ?", [correo]);
    if (existingUser.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Ya existe un usuario con ese correo" 
      });
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(contrasena)) {
      return res.status(400).json({
        success: false,
        message: "La contraseña debe tener al menos 8 caracteres, incluyendo letras y números",
      });
    }

    const hash = USE_PLAIN_PASSWORDS ? contrasena : await bcrypt.hash(contrasena, 10);

    //  Rol FIJO: solo dueño puede registrarse
    const rolFinal = "dueno";

    // Generar código de verificación
    const codigo = Math.floor(100000 + Math.random() * 900000);
    const codigoExpira = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos

    // Guardar usuario como dueño
    await pool.query(
      `INSERT INTO usuarios 
      (nombre, apellido, correo, contrasena, rol, verificado, codigo_verificacion, codigo_expira)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [nombre, apellido, correo, hash, rolFinal, 0, codigo, codigoExpira] 
    );

    // Enviar correo con código
    await enviarCodigoVerificacion(correo, codigo);

    return res.json({
      success: true,
      message: "Usuario registrado. Revisa tu correo para verificar la cuenta.",
    });
  } catch (err) {
    console.error("Error en auth:", err.message);
    return res.status(500).json({ 
      success: false, 
      message: "Error del servidor" 
    });
  }
});




// backend/router/auth.js
router.post("/verify-email", async (req, res) => {
  try {
    const { correo, codigo } = req.body;

    const [rows] = await pool.query(
      "SELECT id_usuarios, codigo_verificacion, codigo_expira, verificado FROM usuarios WHERE correo = ?",
      [correo]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado." });
    }

    const usuario = rows[0];

    if (usuario.verificado) {
      return res.json({ success: true, message: "El usuario ya está verificado." });
    }

    if (usuario.codigo_verificacion !== codigo) {
      return res.status(400).json({ success: false, message: "El código es incorrecto." });
    }

    const ahora = new Date();
    if (ahora > new Date(usuario.codigo_expira)) {
      return res.status(400).json({ success: false, message: "El código ha expirado." });
    }

    //  Verificar
    if (!correo || !codigo) {
  return res.status(400).json({ success: false, message: "Datos incompletos" });
}

if (usuario.codigo_verificacion !== String(codigo)) {

// POST /auth/reenvio del codigo de verificacion 
router.post("/reenvio_codigo", async (req, res) => {
  try {
    const { correo } = req.body;

    const [rows] = await pool.query(
      "SELECT id_usuarios, verificado FROM usuarios WHERE correo = ?",
      [correo]
    );

    if (rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "Usuario no encontrado." 
      });
    }

    const usuario = rows[0];

    if (usuario.verificado) {
      return res.json({ 
        success: true, 
        message: "Tu cuenta ya está verificada." 
      });
    }

    // Generar nuevo código
    const nuevoCodigo = Math.floor(100000 + Math.random() * 900000).toString();
    const expira = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos

    // Guardar en BD
    await pool.query(
      "UPDATE usuarios SET codigo_verificacion = ?, codigo_expira = ? WHERE id_usuarios = ?",
      [nuevoCodigo, expira, usuario.id_usuarios]
    );

    //  ENVIAR EL CORREO CON EL NUEVO CÓDIGO
    await enviarCodigoVerificacion(correo, nuevoCodigo);

    // Responder éxito
    return res.json({ 
      success: true, 
      message: "Se ha enviado un nuevo código de verificación." 
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ 
      success: false, 
      message: "Error en el servidor." 
    });
  }
});


// Obtener usuario por id
router.get("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT id_usuarios, nombre, apellido, correo, rol, verificado FROM usuarios WHERE id_usuarios = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    return res.json(rows[0]);
  } catch (err) {
    console.error("Error en auth:", err.message);
    return res.status(500).json({ success: false, message: "Error del servidor" });
  }
});


// Devuelve la contraseña en texto plano SOLO si la app está configurada para almacenar contraseñas en claro.
router.get("/user-password/:id", async (req, res) => {
  try {
    if (!USE_PLAIN_PASSWORDS) {
      return res.status(403).json({ success: false, message: "Operación no permitida en este entorno" });
    }

    const { id } = req.params;
    const [rows] = await pool.query("SELECT contrasena FROM usuarios WHERE id_usuarios = ? LIMIT 1", [id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    return res.json({ contrasena: rows[0].contrasena });
  } catch (err) {
    console.error("Error en auth:", err.message);
    return res.status(500).json({ success: false, message: "Error del servidor" });
  }
});


// Alternar acceso (activar/desactivar) — cambia el flag `verificado` para bloquear/permitir inicio de sesión.
router.post("/toggle-acceso", async (req, res) => {
  try {
    const { id_usuarios, activo } = req.body;
    if (!id_usuarios) return res.status(400).json({ success: false, message: "Falta id_usuarios" });

    const nuevo = activo ? 1 : 0;
    const [result] = await pool.query("UPDATE usuarios SET verificado = ? WHERE id_usuarios = ?", [nuevo, id_usuarios]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: "Usuario no encontrado" });

    return res.json({ success: true, message: `Acceso ${activo ? 'activado' : 'desactivado'}` });
  } catch (err) {
    console.error("Error en auth:", err.message);
    return res.status(500).json({ success: false, message: "Error del servidor" });
  }
});




// POST /auth/login
router.post("/login", async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    // Añadir 'verificado' en el SELECT
    const [rows] = await pool.query(
      "SELECT id_usuarios, nombre, correo, contrasena, rol, verificado FROM usuarios WHERE correo = ? LIMIT 1",
      [correo]
    );

    if (rows.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Usuario no encontrado" 
      });
    }

    const user = rows[0];

    //  Validar si el correo no está verificado
    if (!user.verificado) {
      return res.status(403).json({
        success: false,
        message: "Tu cuenta no está verificada. Revisa tu correo para activarla."
      });
    }

    // Verificar contraseña (condicional según flag)
    const ok = USE_PLAIN_PASSWORDS ? (contrasena === user.contrasena) : await bcrypt.compare(contrasena, user.contrasena);
    if (!ok) {
      return res.status(400).json({ 
        success: false, 
        message: "Contraseña incorrecta" 
      });
    }

    // Login exitoso
req.session.usuario = {
  id: user.id_usuarios,
  nombre: user.nombre,
  correo: user.correo,
  rol: user.rol
};

// Ahora sí responde
return res.json({ 
  success: true, 
  message: `¡Bienvenido, ${user.nombre}!`,
  user: req.session.usuario
});


  } catch (err) {
    console.error("Error en auth:", err.message);
    return res.status(500).json({ 
      success: false, 
      message: "Error del servidor" 
    });
  }
});



// (cerrar sesión)
router.post("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) return res.status(500).json({ message: "Error al cerrar sesión" });
      // borrar cookie
      res.clearCookie("connect.sid", { path: "/" });
      return res.json({ ok: true });
    });
  } else {
    return res.json({ ok: true });
  }
});


// CHECK — endpoint para que el frontend confirme si sigue logueado
router.get("/check", (req, res) => {
  if (req.session && req.session.usuario) {
    return res.json({ loggedIn: true, user: req.session.usuario });
  }
  return res.status(401).json({ loggedIn: false });
});






// Crear o actualizar credenciales para un trabajador (rol = 'trabajador')
router.post("/create-credenciales", async (req, res) => {
  try {
    const { id_trabajador, correo, contrasena } = req.body;

    if (!id_trabajador || !correo || !contrasena) {
      return res.status(400).json({ success: false, message: "Faltan datos requeridos" });
    }

    if (!correoRegex.test(correo)) {
      return res.status(400).json({ success: false, message: "Correo no válido" });
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@#$%&*]{8,}$/;
    if (!passwordRegex.test(contrasena)) {
      return res.status(400).json({ success: false, message: "La contraseña debe tener al menos 8 caracteres, incluyendo letras y números" });
    }

    // Obtener datos del trabajador (para nombre/apellido y para saber si ya tiene usuario)
    const [trabRows] = await pool.query("SELECT id_usuario, nombre, apellido FROM trabajadores WHERE id_trabajador = ?", [id_trabajador]);
    if (trabRows.length === 0) return res.status(404).json({ success: false, message: "Trabajador no encontrado" });
    const trabajador = trabRows[0];

    // Verificar que el correo no esté en uso por otro usuario distinto
    const [existingByEmail] = await pool.query("SELECT id_usuarios FROM usuarios WHERE correo = ?", [correo]);
    if (existingByEmail.length > 0 && (!trabajador.id_usuario || existingByEmail[0].id_usuarios !== trabajador.id_usuario)) {
      return res.status(400).json({ success: false, message: "El correo ya está en uso por otro usuario" });
    }

    const hash = USE_PLAIN_PASSWORDS ? contrasena : await bcrypt.hash(contrasena, 10);

    const rolFinal = "trabajador";

    let id_usuario = trabajador.id_usuario;
    if (id_usuario) {
      // Actualizar usuario existente
      await pool.query(
        "UPDATE usuarios SET correo = ?, contrasena = ?, rol = ?, verificado = 1 WHERE id_usuarios = ?",
        [correo, hash, rolFinal, id_usuario]
      );
    } else {
      // Insertar nuevo usuario y vincular al trabajador
      const nombre = trabajador.nombre || null;
      const apellido = trabajador.apellido || null;
      const [result] = await pool.query(
        `INSERT INTO usuarios (nombre, apellido, correo, contrasena, rol, verificado) VALUES (?, ?, ?, ?, ?, ?)`,
        [nombre, apellido, correo, hash, rolFinal, 1]
      );
      id_usuario = result.insertId;
      await pool.query("UPDATE trabajadores SET id_usuario = ? WHERE id_trabajador = ?", [id_usuario, id_trabajador]);
    }

    return res.json({ success: true, message: "Credenciales guardadas correctamente", id_usuario, correo });
  } catch (err) {
    console.error("Error en auth:", err.message);
    return res.status(500).json({ success: false, message: "Error del servidor" });
  }
});




export default router;
