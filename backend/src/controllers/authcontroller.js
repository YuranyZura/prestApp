import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { query } from "../config/db.js";

// ==========================================
// LOGIN
// ==========================================

export const login = async (req, res) => {

  try {

    const { correo, contrasena } = req.body;

    // ==========================
    // VALIDACIONES
    // ==========================

    if (!correo || !contrasena) {

      return res.status(400).json({
        success: false,
        message: "Correo y contraseña son obligatorios"
      });
    }

    // ==========================
    // BUSCAR USUARIO
    // ==========================

    const rows = await query(
      `
      SELECT
        id_usuarios,
        nombre,
        apellido,
        correo,
        contrasena,
        rol,
        verificado
      FROM usuarios
      WHERE correo = ?
      LIMIT 1
      `,
      [correo]
    );

    // ==========================
    // USUARIO NO EXISTE
    // ==========================

    if (rows.length === 0) {

      return res.status(401).json({
        success: false,
        message: "Usuario no encontrado"
      });
    }

    const usuario = rows[0];

    // ==========================
    // USUARIO NO VERIFICADO
    // ==========================

    if (!usuario.verificado) {

      return res.status(403).json({
        success: false,
        message: "Cuenta no verificada"
      });
    }

    // ==========================
    // VALIDAR PASSWORD
    // ==========================

    const passwordCorrecta =
      await bcrypt.compare(
        contrasena,
        usuario.contrasena
      );

    if (!passwordCorrecta) {

      return res.status(401).json({
        success: false,
        message: "Contraseña incorrecta"
      });
    }

    // ==========================
    // GENERAR TOKEN
    // ==========================

    const token = jwt.sign(
      {
        id: usuario.id_usuarios,
        rol: usuario.rol
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "8h"
      }
    );

    // ==========================
    // RESPUESTA
    // ==========================

    res.json({
      success: true,

      message: "Login exitoso",

      token,

      user: {
        id: usuario.id_usuarios,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo: usuario.correo,
        rol: usuario.rol
      }
    });

  }

  catch (error) {

    console.error(
      "ERROR LOGIN:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Error del servidor"
    });
  }
};

// ==========================================
// PERFIL USUARIO
// ==========================================

export const perfil = async (req, res) => {

  try {

    const rows = await query(
      `
      SELECT
        id_usuarios,
        nombre,
        apellido,
        correo,
        rol,
        verificado,
        fecha_creacion
      FROM usuarios
      WHERE id_usuarios = ?
      LIMIT 1
      `,
      [req.usuario.id]
    );

    if (rows.length === 0) {

      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado"
      });
    }

    res.json({
      success: true,
      user: rows[0]
    });

  }

  catch (error) {

    console.error(
      "ERROR PERFIL:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Error del servidor"
    });
  }
};

// ==========================================
// VALIDAR TOKEN
// ==========================================

export const validarToken = async (req, res) => {

  try {

    res.json({
      success: true,
      user: req.usuario
    });

  }

  catch (error) {

    console.error(
      "ERROR TOKEN:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Error del servidor"
    });
  }
};