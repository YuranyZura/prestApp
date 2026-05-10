import { Router } from "express";
import bcrypt from "bcrypt";
import pool from "../config/db.js";
import { enviarCodigoVerificacion } from "../config/mailer.js";
import jwt from "jsonwebtoken";

const router = Router();

const USE_PLAIN_PASSWORDS =
  process.env.PLAIN_PASSWORDS === "true";

if (USE_PLAIN_PASSWORDS) {
  console.warn(
    "⚠️ MODO INSEGURO: contraseñas en texto plano"
  );
}

// =============================
// VALIDACIONES
// =============================
const correoRegex =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const dominiosProhibidos = [
  "tempmail.com",
  "example.com",
  "test.com"
];

// =============================
// REGISTER
// =============================

router.post("/register", async (req, res) => {

  try {

    const {
      nombre,
      apellido,
      correo,
      telefono,
      cedula,
      contrasena,
      rol
    } = req.body;

    // VALIDAR
    if (
      !nombre ||
      !apellido ||
      !correo ||
      !telefono ||
      !cedula ||
      !contrasena
    ) {
      return res.status(400).json({
        success: false,
        message: "Complete todos los campos"
      });
    }

    // VERIFICAR CORREO
    const [existe] = await pool.query(
      "SELECT id_usuario FROM usuarios WHERE correo = ?",
      [correo]
    );

    if (existe.length > 0) {
      return res.status(400).json({
        success: false,
        message: "El correo ya existe"
      });
    }

    // HASH PASSWORD
    const passwordHash = await bcrypt.hash(contrasena, 10);

    // CÓDIGO
    const codigo = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // INSERT
    await pool.query(
      `
      INSERT INTO usuarios
      (
        nombre,
        apellido,
        correo,
        telefono,
        cedula,
        contrasena,
        rol,
        verificado,
        codigo_verificacion
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        nombre,
        apellido,
        correo,
        telefono,
        cedula,
        passwordHash,
        rol || "trabajador",
        0,
        codigo
      ]
    );

    res.json({
      success: true,
      message: "Usuario registrado"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Error del servidor"
    });
  }

});
// =============================
// VERIFY EMAIL
// =============================
router.post("/verify-email", async (req, res) => {

  try {

    const { correo, codigo } = req.body;

    if (!correo || !codigo) {
      return res.status(400).json({
        success: false,
        message: "Datos incompletos"
      });
    }

    const [rows] = await pool.query(
      `SELECT
        id_usuario,
        codigo_verificacion,
        codigo_expira,
        verificado
      FROM usuario
      WHERE correo = ?`,
      [correo]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado"
      });
    }

    const user = rows[0];

    if (user.verificado) {
      return res.json({
        success: true,
        message: "Ya verificado"
      });
    }

    if (
      user.codigo_verificacion !==
      String(codigo)
    ) {
      return res.status(400).json({
        success: false,
        message: "Código incorrecto"
      });
    }

    if (
      new Date() >
      new Date(user.codigo_expira)
    ) {
      return res.status(400).json({
        success: false,
        message: "Código expirado"
      });
    }

    await pool.query(
      `UPDATE usuario
       SET verificado = 1
       WHERE id_usuario = ?`,
      [user.id_usuario]
    );

    res.json({
      success: true,
      message: "Cuenta verificada"
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: "Error del servidor"
    });
  }

});

// =============================
// REENVIAR CÓDIGO
// =============================
router.post("/reenvio_codigo", async (req, res) => {

  try {

    const { correo } = req.body;

    const [rows] = await pool.query(
      `SELECT
        id_usuario,
        verificado
      FROM usuarios
      WHERE correo = ?`,
      [correo]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado"
      });
    }

    if (rows[0].verificado) {
      return res.json({
        success: true,
        message: "Ya verificado"
      });
    }

    const codigo = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const expira = new Date(
      Date.now() + 10 * 60 * 1000
    );

    await pool.query(
      `UPDATE usuario
       SET codigo_verificacion = ?,
           codigo_expira = ?
       WHERE id_usuario = ?`,
      [
        codigo,
        expira,
        rows[0].id_usuario
      ]
    );

    await enviarCodigoVerificacion(
      correo,
      codigo
    );

    res.json({
      success: true,
      message: "Código reenviado"
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: "Error del servidor"
    });
  }

});

// =============================
// LOGIN
// =============================
// LOGIN LIMPIO
router.post("/login", async (req, res) => {

  const { correo, contrasena } = req.body;

  if (!correo || !contrasena) {
    return res.status(400).json({
      success: false,
      message: "Credenciales requeridas"
    });
  }

  try {
    const [rows] = await pool.query(
      "SELECT * FROM usuarios WHERE correo = ? LIMIT 1",
      [correo]
    );

    if (rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Usuario no encontrado"
      });
    }

    const user = rows[0];

    
    // SOLO verificar si existe el campo
if (
    usuario.verificado !== undefined &&
    Number(usuario.verificado) === 0
) {

    return res.status(403).json({
        success: false,
        message: "Cuenta no verificada"
    });

}

    if (!user.activo) {
      return res.status(403).json({
        success: false,
        message: "Usuario desactivado"
      });
    }

    const ok = await bcrypt.compare(contrasena, user.contrasena);

    if (!ok) {
      return res.status(400).json({
        success: false,
        message: "Contraseña incorrecta"
      });
    }

    const token = jwt.sign(
      {
        id: user.id_usuario,
        rol: user.rol
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      success: true,
      message: "Login exitoso",
      token,
      user: {
        id: user.id_usuario,
        nombre: user.nombre,
        rol: user.rol
      }
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error del servidor"
    });
  }
});

// =============================
// LOGOUT
// =============================
router.post("/logout", (req, res) => {

  req.session.destroy(() => {

    res.clearCookie("connect.sid");

    res.json({
      success: true,
      message: "Sesión cerrada"
    });

  });

});

// =============================
// CHECK SESSION
// =============================
router.get("/check", (req, res) => {

  if (req.session?.usuario) {
    return res.json({
      success: true,
      user: req.session.usuario
    });
  }

  res.status(401).json({
    success: false,
    message: "No autenticado"
  });

});

export default router;