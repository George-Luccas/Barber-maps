
import { Resend } from "resend";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

async function main() {
    const log = (msg: string) => fs.appendFileSync("email_test_result.txt", msg + "\n");
    
    log("Testing Resend API Key...");
    
    if (!process.env.RESEND_API_KEY) {
        log("No RESEND_API_KEY found in environment.");
        return;
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    // Use the user's email if possible, but I'll use the one I found in codebase
    // "georgeluccas300@gmail.com" matches the admin check.
    const testEmail = "georgeluccas300@gmail.com"; 

    log(`Attempting to send email to ${testEmail} using onboarding@resend.dev...`);

    try {
        const data = await resend.emails.send({
            from: "BarberMaps Test <onboarding@resend.dev>",
            to: testEmail,
            subject: "Teste de Envio de Email - BarberMaps",
            html: "<p>Se você recebeu este email, a configuração do Resend está funcionando corretamente!</p>",
        });

        if (data.error) {
             log("Data Error: " + JSON.stringify(data.error));
        } else {
             log("Email sent successfully!");
             log("Response ID: " + data.data?.id);
        }
       
    } catch (error) {
        log("Failed to send email.");
        log("Error details: " + JSON.stringify(error));
    }
}

main();
