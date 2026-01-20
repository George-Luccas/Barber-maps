
import "dotenv/config";
import { Resend } from "resend";

async function checkEmailConfig() {
  console.log("🔍 Verificando configuração de email...");

  const apiKey = process.env.RESEND_API_KEY;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!apiKey) {
    console.error("❌ ERRO: RESEND_API_KEY não encontrada nas variáveis de ambiente.");
  } else {
    console.log("✅ RESEND_API_KEY encontrada.");
    // Opcional: Tentar inicializar o cliente para verificar formato básico
    try {
        new Resend(apiKey);
        console.log("✅ Cliente Resend inicializado com sucesso.");
    } catch (e) {
        console.error("❌ ERRO: Chave API do Resend parece inválida.", e);
    }
  }

  if (!appUrl) {
    console.warn("⚠️ AVISO: NEXT_PUBLIC_APP_URL não encontrada. Links de recuperação podem não funcionar corretamente.");
  } else {
    console.log(`✅ NEXT_PUBLIC_APP_URL configurada: ${appUrl}`);
  }

  if (apiKey && appUrl) {
      console.log("\n🎉 Configuração parece correta! Você pode testar o envio real pelo fluxo da aplicação.");
  } else {
      console.log("\n⚠️ Por favor, corrija os itens acima no arquivo .env antes de testar a recuperação de senha.");
  }
}

checkEmailConfig();
