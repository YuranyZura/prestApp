import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

// 🔒 Variables
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

if (!EMAIL_USER || !EMAIL_PASS) {
  console.warn("⚠️ Email no configurado. Los correos no se enviarán.");
}

// 🔥 Transporter optimizado
const transporter = EMAIL_USER && EMAIL_PASS
  ? nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    })
  : null;

// 🔍 Verificación (solo dev)
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

// 🎨 HTML reutilizable (mejorado responsive)
function generarHTML(codigo) {
  return `
    <div style="font-family: Arial; padding:20px; max-width:500px; margin:auto;">
      <h2 style="color:#0d6efd;">PrestApp</h2>
      <p>Tu código de verificación es:</p>
      <div style="
        font-size:28px;
        font-weight:bold;
        letter-spacing:5px;
        background:#f4f4f4;
        padding:15px;
        text-align:center;
        border-radius:10px;
      ">
        ${codigo}
      </div>
      <p style="margin-top:20px;">Este código expira en 10 minutos.</p>
    </div>
  `;
}

// 📧 Envío genérico (mejor manejo de errores)
export async function enviarCorreo({ to, subject, html }) {
  if (!transporter) {
    console.warn("⚠️ Intento de envío sin configuración de correo");
    return false;
  }

  try {
    const info = await transporter.sendMail({
      from: `"PrestApp" <${EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("📧 Correo enviado:", info.messageId);
    return true;

  } catch (error) {
    console.error("❌ Error al enviar correo:", {
      message: error.message,
      code: error.code,
    });
    return false;
  }
}

// 📧 Caso específico
export async function enviarCodigoVerificacion(correo, codigo) {
  return enviarCorreo({
    to: correo,
    subject: "Código de verificación - PrestApp",
    html: generarHTML(codigo),
  });
}