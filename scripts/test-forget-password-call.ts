
import "dotenv/config";
import { auth } from "../lib/auth";

async function tryCall() {
    console.log("Tentando chamar auth.api.forgetPassword...");
    try {
        if (!auth.api.forgetPassword) {
            console.error("❌ Função auth.api.forgetPassword não existe!");
            return;
        }

        // Mock request context usually needed? 
        // Better Auth APIs often take a request object or just body depending on adapter.
        // But let's try calling it with standard signature.
        
        // @ts-ignore
        const res = await auth.api.forgetPassword({
            body: { 
                email: "test@example.com", 
                redirectTo: "/reset-password" 
            },
            headers: new Headers() 
        });
        console.log("✅ Sucesso:", res);
    } catch (e) {
        console.error("❌ Erro ao chamar:", e.message);
    }
}

tryCall();
