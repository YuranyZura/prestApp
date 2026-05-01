// config/session.js

export const sessionConfig = {
  secret: process.env.SESSION_SECRET || "dev_secret_key",

  resave: false,
  saveUninitialized: false,

  cookie: {
    secure: process.env.NODE_ENV === "production", // HTTPS en producción
    httpOnly: true,
    sameSite: "lax", // importante para compatibilidad
    maxAge: 1000 * 60 * 60, // 1 hora
  },
};