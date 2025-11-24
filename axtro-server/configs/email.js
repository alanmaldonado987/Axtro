import nodemailer from 'nodemailer';

const createTransporter = () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Si hay configuración de Gmail, usarla
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }

  return null;
};

export const sendOTPEmail = async (email, otpCode) => {
  try {
    const transporter = createTransporter();
    
    console.log("Código de verificación: ", otpCode);

    if (!transporter) {
      return { success: false, error: 'Configuración de email no encontrada' };
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.SMTP_USER || process.env.GMAIL_USER,
      to: email,
      subject: 'Código de verificación - Axtro',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 20px; background-color: #F7F4FF; font-family: Arial, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="color: #7C3AED; font-size: 28px; font-weight: bold; margin-bottom: 10px;">Axtro AI</div>
            </div>
            <div style="color: #4C1D95; font-size: 24px; font-weight: bold; margin-bottom: 20px;">Código de Verificación</div>
            <div style="color: #1C1426; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
              <p>Hola,</p>
              <p>Has solicitado restablecer tu contraseña en Axtro. Utiliza el siguiente código de verificación:</p>
              <div style="background-color: #7C3AED; color: #FFFFFF; font-size: 36px; font-weight: bold; text-align: center; padding: 25px; border-radius: 12px; letter-spacing: 12px; margin: 30px 0; display: block; border: 2px solid #7C3AED;">
                <span style="color: #FFFFFF; font-size: 36px; font-weight: bold; letter-spacing: 12px;">${otpCode}</span>
              </div>
              <p style="margin-top: 20px;">Este código expirará en <strong>10 minutos</strong>.</p>
              <div style="background-color: #FFF4E6; border-left: 4px solid #F59E0B; padding: 15px; margin: 20px 0; border-radius: 8px; color: #92400E; font-size: 14px;">
                <strong>⚠️ Importante:</strong> Si no solicitaste este código, ignora este email. Tu cuenta está segura.
              </div>
            </div>
            <div style="text-align: center; color: #6B4AA6; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #E2D4FF;">
              <p>Este es un email automático, por favor no respondas.</p>
              <p>&copy; ${new Date().getFullYear()} Axtro AI. Todos los derechos reservados.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Código de Verificación - Axtro
        
        Has solicitado restablecer tu contraseña. Utiliza el siguiente código:
        
        ${otpCode}
        
        Este código expirará en 10 minutos.
        
        Si no solicitaste este código, ignora este email.
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export default { sendOTPEmail };

