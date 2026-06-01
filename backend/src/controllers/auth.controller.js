// ==========================================
// IMPORTS
// ==========================================

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query } from "../config/db.js";

// ==========================================
// LOGIN
// ==========================================

export const login = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
      return res.status(400).json({
        success: false,
        message: "Correo y contraseña son obligatorios"
      });
    }

    const rows = await query(
      `SELECT * FROM usuarios WHERE correo = ? LIMIT 1`,
      [correo]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Credenciales incorrectas"
      });
    }

    const usuario = rows[0];
    const esValido = await bcrypt.compare(contrasena, usuario.contrasena);

    if (!esValido) {
      return res.status(401).json({
        success: false,
        message: "Credenciales incorrectas"
      });
    }

    const token = jwt.sign(
      { id: usuario.id_usuario, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    res.json({
      success: true,
      token,
      usuario: {
        id: usuario.id_usuario,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
        id_rol: usuario.id_rol
      }
    });

  } catch (error) {
    console.error("ERROR LOGIN:", error);
    res.status(500).json({ success: false, message: "Error servidor" });
  }
};

// ==========================================
// VALIDAR TOKEN
// ==========================================

export const validarToken = async (req, res) => {
  res.json({ success: true, usuario: req.usuario });
};

// ==========================================
// PERFIL
// ==========================================

export const perfil = async (req, res) => {
  try {
    const rows = await query(
      `SELECT id_usuario, nombre, correo, rol FROM usuarios WHERE id_usuario = ? LIMIT 1`,
      [req.usuario.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    res.json({ success: true, usuario: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error servidor" });
  }
};

// ==========================================
// REGISTER
// ==========================================

export const register = async (req, res) => {

  console.log("=================================");
  console.log("BODY RECIBIDO EN REGISTER:");
  console.log(req.body);
  console.log("=================================");

  try {

    const {
      nombre,
      correo,
      contrasena
    } = req.body;

    console.log("NOMBRE:", nombre);
    console.log("CORREO:", correo);
    console.log("CONTRASENA:", contrasena);

    // VALIDACIONES
    if (!nombre || !correo || !contrasena) {

      return res.status(400).json({
        success: false,
        message: "Todos los campos son obligatorios"
      });
    }

    // EXISTE
    const existe = await query(
      `
      SELECT id_usuario
      FROM usuarios
      WHERE correo = ?
      LIMIT 1
      `,
      [correo]
    );

    if (existe.length > 0) {

      return res.status(409).json({
        success: false,
        message: "Correo ya registrado"
      });
    }

    // HASH PASSWORD
    const hash = await bcrypt.hash(
      contrasena,
      10
    );

    // INSERT
    const result = await query(
      `
      INSERT INTO usuarios (
        nombre,
        correo,
        contrasena,
        rol,
        verificado
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        nombre,
        correo,
        hash,
        "trabajador",
        1
      ]
    );

    res.status(201).json({
      success: true,
      id: result.insertId
    });

  } catch (error) {

    console.error("ERROR REGISTER:");
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Error servidor"
    });
  }
};