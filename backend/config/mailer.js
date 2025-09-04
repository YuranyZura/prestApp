// backend/config/mailer.js

import dotenv from 'dotenv';
dotenv.config();

import nodemailer from 'nodemailer';

// Usa tu transporte configurado
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function enviarCodigoVerificacion(correo, codigo) {
  // URL de tu logo (puedes subirlo a un hosting o usar una ruta pública)
  const logoUrl = 'https://i.ibb.co/8X1Zq1d/logo-prestapp.png'; 

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: correo,
    subject: 'Verifica tu cuenta en PrestApp',
    html: `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Verificación de correo</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f5f7fb;
            margin: 0;
            padding: 0;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 30px auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            border: 1px solid #e0e4ea;
          }
          .header {
            text-align: center;
            padding: 20px 0;
            background-color: #0d6efd;
            border-radius: 12px 12px 0 0;
          }
          .header img {
            width: 80px;
            height: auto;
          }
          .content {
            padding: 30px;
            text-align: center;
          }
          h1 {
            color: #0d6efd;
            font-size: 24px;
            margin-bottom: 16px;
          }
          p {
            font-size: 16px;
            line-height: 1.6;
            color: #555;
          }
          .code-box {
            display: inline-block;
            margin: 20px auto;
            padding: 15px 20px;
            font-size: 28px;
            font-weight: bold;
            letter-spacing: 8px;
            background-color: #f0f4ff;
            border: 2px dashed #0d6efd;
            border-radius: 8px;
            color: #0d6efd;
            width: 220px;
            text-align: center;
          }
          .footer {
            margin-top: 30px;
            font-size: 14px;
            color: #888;
            text-align: center;
            padding-bottom: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Header con logo -->
          <div class="header">
            <img src="${logoUrl}" alt="Logo PrestApp" />
          </div>

          <!-- Contenido -->
          <div class="content">
            <h1>¡Hola!</h1>
            <p>Gracias por registrarte en <strong>PrestApp</strong>. Usa el siguiente código para verificar tu correo y activar tu cuenta.</p>

            <!-- Código de verificación -->
            <div class="code-box">${codigo}</div>

            <p><strong>Este código expira en 10 minutos.</strong></p>
          </div>

          <!-- Footer -->
          <div class="footer">
            <p>&copy; 2025 PrestApp. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(' Correo de verificación enviado a:', correo);
  } catch (error) {
    console.error(' Error al enviar correo:', error);
    throw new Error('No se pudo enviar el correo de verificación');
  }
}