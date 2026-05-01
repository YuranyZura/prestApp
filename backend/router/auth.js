import { Router } from "express";
import bcrypt from "bcrypt";
import pool from "../config/db.js";
import { enviarCodigoVerificacion } from "../config/mailer.js";
import jwt from "jsonwebtoken";

const router = Router();

const USE_PLAIN_PASSWORDS = process.env.PLAIN_PASSWORDS === "true";

if (USE_PLAIN_PASSWORDS) {
  console.warn("⚠️ MODO INSEGURO: contraseñas en texto plano");
}

// =============================
// VALIDACIONES
// =============================
const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const dominiosProhibidos = ["tempmail.com", "example.com", "test.com"];

// =============================
// REGISTER
// =============================
router.post("/register", async (req, res) => {
  try {
    const { nombre, apellido, correo, contrasena } = req.body;

    if (!nombre || !apellido || !correo || !contrasena) {
      return res.status(400).json({ success: false, message: "Faltan datos" });
    }

    if (!correoRegex.test(correo)) {
      return res.status(400).json({ success: false, message: "Correo inválido" });
    }

    const dominio = correo.split("@")[1];
    if (dominiosProhibidos.includes(dominio)) {
      return res.status(400).json({ success: false, message: "Correo no permitido" });
    }

    const [exists] = await pool.query("SELECT id_usuarios FROM usuarios WHERE correo = ?", [correo]);
    if (exists.length > 0) {
      return res.status(400).json({ success: false, message: "Correo ya registrado" });
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(contrasena)) {
      return res.status(400).json({
        success: false,
        message: "Contraseña débil (mínimo 8 caracteres con letras y números)"
      });
    }

    const hash = USE_PLAIN_PASSWORDS ? contrasena : await bcrypt.hash(contrasena, 10);

    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    const expira = new Date(Date.now() + 10 * 60 * 1000);

    await pool.query(
      `INSERT INTO usuarios 
      (nombre, apellido, correo, contrasena, rol, verificado, codigo_verificacion, codigo_expira, activo)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nombre, apellido, correo, hash, "dueno", 0, codigo, expira, 1]
    );

    await enviarCodigoVerificacion(correo, codigo);

    res.json({ success: true, message: "Usuario registrado. Verifica tu correo." });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error del servidor" });
  }
});

// =============================
// VERIFY EMAIL
// =============================
router.post("/verify-email", async (req, res) => {
  try {
    const { correo, codigo } = req.body;

    if (!correo || !codigo) {
      return res.status(400).json({ success: false, message: "Datos incompletos" });
    }

    const [rows] = await pool.query(
      "SELECT id_usuarios, codigo_verificacion, codigo_expira, verificado FROM usuarios WHERE correo = ?",
      [correo]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    const user = rows[0];

    if (user.verificado) {
      return res.json({ success: true, message: "Ya verificado" });
    }

    if (user.codigo_verificacion !== String(codigo)) {
      return res.status(400).json({ success: false, message: "Código incorrecto" });
    }

    if (new Date() > new Date(user.codigo_expira)) {
      return res.status(400).json({ success: false, message: "Código expirado" });
    }

    await pool.query(
      "UPDATE usuarios SET verificado = 1 WHERE id_usuarios = ?",
      [user.id_usuarios]
    );

    res.json({ success: true, message: "Cuenta verificada" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error del servidor" });
  }
});

// =============================
// REENVIAR CÓDIGO
// =============================
router.post("/reenvio_codigo", async (req, res) => {
  try {
    const { correo } = req.body;

    const [rows] = await pool.query(
      "SELECT id_usuarios, verificado FROM usuarios WHERE correo = ?",
      [correo]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    if (rows[0].verificado) {
      return res.json({ success: true, message: "Ya verificado" });
    }

    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    const expira = new Date(Date.now() + 10 * 60 * 1000);

    await pool.query(
      "UPDATE usuarios SET codigo_verificacion = ?, codigo_expira = ? WHERE id_usuarios = ?",
      [codigo, expira, rows[0].id_usuarios]
    );

    await enviarCodigoVerificacion(correo, codigo);

    res.json({ success: true, message: "Código reenviado" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error del servidor" });
  }
});

// =============================
// LOGIN (SESION + JWT)
// =============================
router.post("/login", async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    const [rows] = await pool.query(
      "SELECT * FROM usuarios WHERE correo = ? LIMIT 1",
      [correo]
    );

    if (rows.length === 0) {
      return res.status(400).json({ success: false, message: "Usuario no encontrado" });
    }

    const user = rows[0];

    if (!user.verificado) {
      return res.status(403).json({ success: false, message: "Cuenta no verificada" });
    }

    if (!user.activo) {
      return res.status(403).json({ success: false, message: "Usuario desactivado" });
    }

    const ok = USE_PLAIN_PASSWORDS
      ? contrasena === user.contrasena
      : await bcrypt.compare(contrasena, user.contrasena);

    if (!ok) {
      return res.status(400).json({ success: false, message: "Contraseña incorrecta" });
    }

    // ✅ sesión
    req.session.usuario = {
      id: user.id_usuarios,
      nombre: user.nombre,
      correo: user.correo,
      rol: user.rol
    };

    // ✅ JWT
    const token = jwt.sign(
      { id: user.id_usuarios, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      success: true,
      message: "Login exitoso",
      user: req.session.usuario,
      token
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error del servidor" });
  }
});

// =============================
// LOGOUT
// =============================
router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ success: true });
  });
});

// =============================
// CHECK SESSION
// =============================
router.get("/check", (req, res) => {
  if (req.session?.usuario) {
    return res.json({ loggedIn: true, user: req.session.usuario });
  }
  res.status(401).json({ loggedIn: false });
});

export default router;