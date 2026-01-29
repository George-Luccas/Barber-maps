import nodemailer from 'nodemailer';

const getTransporter = () => {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        return null;
    }

    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
        tls: {
            rejectUnauthorized: false
        }
    });
};

export const sendContactsExportEmail = async (users: any[]) => {
  const transporter = getTransporter();
  if (!transporter) {
    console.error("SMTP credentials are not set");
    return;
  }

  const exportEmail = process.env.CONTACTS_EXPORT_EMAIL;
  if (!exportEmail) {
    console.error("CONTACTS_EXPORT_EMAIL is not set");
    return;
  }

  // Generate CSV
  const header = "Nome,Email,Telefone,Data de Cadastro\n";
  const rows = users
    .map((user) => {
      const name = user.name || "";
      const email = user.email || "";
      const phone = user.phone || "";
      const createdAt = new Date(user.createdAt).toLocaleDateString("pt-BR");
      return `"${name}","${email}","${phone}","${createdAt}"`;
    })
    .join("\n");
  
  const csvContent = header + rows;

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || '"BarberMaps" <barbermapsmt@gmail.com>',
      to: exportEmail,
      subject: "Exportação de Contatos - BarberMaps",
      text: `Olá,\n\nSegue em anexo a lista com ${users.length} novos contatos coletados.`,
      attachments: [
        {
          filename: "contatos_barbermaps.csv",
          content: csvContent, // Nodemailer handles string content implies utf-8
        },
      ],
    });

    console.log("Export email sent successfully to", exportEmail);
  } catch (error) {
    console.error("Error sending export email:", error);
    throw error;
  }
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const transporter = getTransporter();
  if (!transporter) {
     console.error("SMTP credentials are not set. Cannot send password reset email.");
     return;
  }

  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

  try {
    console.log(`[DEBUG] Attempting to send reset email to: ${email} with token: ${token}`);
    
    await transporter.sendMail({
      from: process.env.SMTP_FROM || '"BarberMaps Security" <barbermapsmt@gmail.com>',
      to: email, 
      subject: "Recuperação de Senha - BarberMaps",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">Recuperação de Senha</h1>
            <p style="font-size: 16px; color: #555;">Você solicitou a redefinição de sua senha.</p>
            <p style="font-size: 16px; color: #555;">Clique no link abaixo para criar uma nova senha:</p>
            <div style="margin: 20px 0;">
                <a href="${resetLink}" style="background-color: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Redefinir Senha</a>
            </div>
            <p style="font-size: 14px; color: #777;">Se você não solicitou isso, ignore este e-mail.</p>
            <p style="font-size: 12px; color: #999; margin-top: 30px;">BarberMaps Team</p>
        </div>
      `,
    });
    
    console.log(`[DEBUG] Reset email sent successfully to ${email}`);

  } catch (error) {
    console.error("[DEBUG] Unexpected error sending reset email:", error);
    throw error;
  }
};
