// backend/config/mailer.js
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

// ✅ Validar variables de entorno
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error("❌ Faltan variables de entorno para el correo");
  process.exit(1);
}

// 🔥 Configuración del transporte
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 🎨 Generador de HTML (más limpio)
function generarHTML(codigo) {
  const logoUrl = "https://i.ibb.co/8X1Zq1d/logo-prestapp.png";

  return `
    <div style="font-family: Arial; background:#f5f7fb; padding:20px;">
      <div style="max-width:600px; margin:auto; background:#fff; border-radius:10px; overflow:hidden;">
        
        <div style="background:#0d6efd; text-align:center; padding:20px;">
          <img src="${logoUrl}" width="80"/>
        </div>

        <div style="padding:30px; text-align:center;">
          <h2 style="color:#0d6efd;">¡Hola!</h2>
          <p>Gracias por registrarte en <b>PrestApp</b></p>

          <div style="
            margin:20px auto;
            padding:15px;
            font-size:28px;
            letter-spacing:6px;
            border:2px dashed #0d6efd;
            display:inline-block;
            color:#0d6efd;
          ">
            ${codigo}
          </div>

          <p><b>Este código expira en 10 minutos</b></p>
        </div>

        <div style="text-align:center; font-size:12px; color:#888; padding:10px;">
          © 2025 PrestApp
        </div>
      </div>
    </div>
  `;
}

// 📧 Función principal
export async function enviarCodigoVerificacion(correo, codigo) {
  // ✅ Validar datos
  if (!correo || !codigo) {
    throw new Error("Correo y código son obligatorios");
  }

  try {
    const info = await transporter.sendMail({
      from: `"PrestApp" <${process.env.EMAIL_USER}>`,
      to: correo,
      subject: "Verifica tu cuenta en PrestApp",
      html: generarHTML(codigo),
    });

    console.log("✅ Correo enviado:", info.messageId);

  } catch (error) {
    console.error("❌ Error al enviar correo:", error.message);
    throw new Error("No se pudo enviar el correo");
  }
}