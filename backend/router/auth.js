// Aquí van todos los endpoints relacionados con REGISTRO Y INCIO DE SESION,VALIDACION DE CORREO
// VALIDACION DE SONTRASEÑAS,TODOS LO QUE TENGA QUE VER OCN AUTENTICACION por eso el archivo se llama auth.

import { Router } from "express";
import bcrypt from "bcrypt";
import { pool } from "../server.js"; // importar pool del servidor
import { enviarCodigoVerificacion } from "../config/mailer.js";

const router = Router();


// Regex básico para correos válidos
const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Lista de dominios de prueba que queremos bloquear
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

    const hash = await bcrypt.hash(contrasena, 10);

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
    console.error(err);
    return res.status(500).json({ 
      success: false, 
      message: "Error del servidor" 
    });
  }
});

//endpoint de verficacion de un correo 
// POST /auth/verify-email
// router.post("/verify-email", async (req, res) => {
//   try {
//     const { correo, codigo } = req.body;

//     // Buscar usuario con ese correo
//     const [rows] = await pool.query(
//       "SELECT id_usuarios, codigo_verificacion, codigo_expira, verificado FROM usuarios WHERE correo = ?",
//       [correo]
//     );

//     if (rows.length === 0) {
//       return res.status(404).json({ success: false, message: "Usuario no encontrado." });
//     }

//     const usuario = rows[0];

//     // Si ya está verificado
//     if (usuario.verificado) {
//       return res.json({ success: true, message: "El usuario ya está verificado." });
//     }

//     // Validar código
//     if (usuario.codigo_verificacion !== codigo) {
//       return res.status(400).json({ success: false, message: "El codigo es incorrecto." });
//     }
//     // Validar expiración
//     const ahora = new Date();
//     if (ahora > new Date(usuario.codigo_expira)) {
//       return res.status(400).json({ success: false, message: "El código ha expirado, solicita uno nuevo." });
//     }

//     // Si pasa todo, marcar como verificado
//     await pool.query(
//       "UPDATE usuarios SET verificado = 1, codigo_verificacion = NULL, codigo_expira = NULL WHERE id_usuarios = ?",
//       [usuario.id_usuarios]
//     );

//     return res.json({ success: true, message: "Correo verificado con éxito." });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: "Error en el servidor." });
//   }
// });






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

    // ✅ Verificar
    await pool.query(
      "UPDATE usuarios SET verificado = 1, codigo_verificacion = NULL, codigo_expira = NULL WHERE id_usuarios = ?",
      [usuario.id_usuarios]
    );

    return res.json({ 
      success: true, 
      message: "Correo verificado con éxito." 
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error del servidor." });
  }
});


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

    // Verificar contraseña
    const ok = await bcrypt.compare(contrasena, user.contrasena);
    if (!ok) {
      return res.status(400).json({ 
        success: false, 
        message: "Contraseña incorrecta" 
      });
    }

    // Login exitoso
    return res.json({ 
      success: true, 
      message: `¡Bienvenido, ${user.nombre}!`,
      user: {
        id: user.id_usuarios,
        nombre: user.nombre,
        correo: user.correo,
        rol: user.rol
      }
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ 
      success: false, 
      message: "Error del servidor" 
    });
  }
});
export default router;
