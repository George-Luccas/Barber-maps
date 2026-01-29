
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import fs from "fs";

dotenv.config();

async function main() {
    const log = (msg: string) => {
        console.log(msg);
        fs.appendFileSync("email_test_result.txt", msg + "\n");
    };
    
    log("Testing Gmail SMTP via Nodemailer...");
    
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        log("SMTP credentials missing in environment.");
        return;
    }

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false, 
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    const testEmail = "georgeluccas300@gmail.com"; 

    log(`Attempting to send email to ${testEmail} from ${process.env.SMTP_USER}...`);

    try {
        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM || `"BarberMaps Test" <${process.env.SMTP_USER}>`,
            to: testEmail,
            subject: "Teste de Envio de Email - Gmail SMTP",
            html: "<p>Se você recebeu este email, a configuração do Gmail SMTP está funcionando corretamente!</p>",
        });

        log("Email sent successfully!");
        log("Message ID: " + info.messageId);
        
    } catch (error) {
        log("Failed to send email.");
        log("Error details: " + JSON.stringify(error, null, 2));
        if (error instanceof Error) {
            log("Error message: " + error.message);
        }
    }
}

main();
