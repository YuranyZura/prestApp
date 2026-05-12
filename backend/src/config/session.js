// config/session.js

export const sessionConfig = {
  name: "prestapp.sid", // 👈 nombre de cookie

  secret: process.env.SESSION_SECRET || "dev_secret_key",

  resave: false,
  saveUninitialized: false,

  rolling: true, // 🔥 renueva la sesión automáticamente

  cookie: {
    secure: process.env.NODE_ENV === "production", // HTTPS en producción
    httpOnly: true,

    sameSite: "lax", // puedes cambiar a "none" si usas apps móviles externas

    maxAge: 1000 * 60 * 60 * 2, // 🔥 2 horas mejor que 1
  },
};