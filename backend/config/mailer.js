import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

// 🔒 Validación de variables
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

if (!EMAIL_USER || !EMAIL_PASS) {
  console.warn("⚠️ Email no configurado. Los correos no se enviarán.");
}

// 🔥 Crear transporter SOLO si hay credenciales
const transporter = EMAIL_USER && EMAIL_PASS
  ? nodemailer.createTransport({
      service: "gmail", // más simple y estable
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    })
  : null;

// 🔍 Verificar conexión (solo en desarrollo)
async function verificarMailer() {
  if (!transporter) return;

  try {
    await transporter.verify();
    console.log("✅ Servidor de correo listo");
  } catch (error) {
    console.error("❌ Error en configuración de correo:", error.message);
  }
}

if (process.env.NODE_ENV !== "production") {
  verificarMailer();
}

// 🎨 Generador de HTML
function generarHTML(codigo) {
  return `
    <div style="font-family: Arial, sans-serif; padding:20px;">
      <h2 style="color:#333;">PrestApp</h2>
      <p>Tu código de verificación es:</p>
      <h1 style="letter-spacing:3px;">${codigo}</h1>
      <p>Este código expira en 10 minutos.</p>
    </div>
  `;
}

// 📧 Función genérica (REUTILIZABLE)
export async function enviarCorreo({ to, subject, html }) {
  if (!transporter) {
    console.warn("⚠️ Intento de envío de correo sin configuración");
    return false;
  }

  try {
    await transporter.sendMail({
      from: `"PrestApp" <${EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("✅ Correo enviado");
    return true;
  } catch (error) {
    console.error("❌ Error al enviar correo:", error.message);
    return false;
  }
}

// 📧 Caso específico: código de verificación
export async function enviarCodigoVerificacion(correo, codigo) {
  return await enviarCorreo({
    to: correo,
    subject: "Código de verificación",
    html: generarHTML(codigo),
  });
}