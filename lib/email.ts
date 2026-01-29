import { Resend } from "resend";

const getResend = () => {
    if (!process.env.RESEND_API_KEY) {
        return null; // Handle missing key gracefully
    }
    return new Resend(process.env.RESEND_API_KEY);
}

export const sendContactsExportEmail = async (users: any[]) => {
  const resend = getResend();
  if (!resend) {
    console.error("RESEND_API_KEY is not set");
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
    await resend.emails.send({
      from: "BarberMaps Export <onboarding@resend.dev>",
      to: exportEmail,
      subject: "Exportação de Contatos - BarberMaps",
      text: `Olá,\n\nSegue em anexo a lista com 100 novos contatos coletados.\n\nTotal: ${users.length} contatos.`,
      attachments: [
        {
          filename: "contatos_barbermaps.csv",
          content: Buffer.from(csvContent).toString("base64"),
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
  const resend = getResend();
  if (!resend) {
     console.error("RESEND_API_KEY is not set. Cannot send password reset email.");
     return;
  }

  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

  try {
    console.log(`[DEBUG] Attempting to send reset email to: ${email} with token: ${token}`);
    const { data, error } = await resend.emails.send({
      to: email, 
      from: "BarberMaps Security <onboarding@resend.dev>",
      subject: "Recuperação de Senha - BarberMaps",
      html: `
        <h1>Recuperação de Senha</h1>
        <p>Você solicitou a redefinição de sua senha.</p>
        <p>Clique no link abaixo para criar uma nova senha:</p>
        <a href="${resetLink}">Redefinir Senha</a>
        <p>Se você não solicitou isso, ignore este e-mail.</p>
      `,
    });
    
    if (error) {
        console.error("[DEBUG] Resend API Error:", error);
    } else {
        console.log(`[DEBUG] Reset email sent successfully. ID: ${data?.id}`);
    }
  } catch (error) {
    console.error("[DEBUG] Unexpected error sending reset email:", error);
    throw error;
  }
};
