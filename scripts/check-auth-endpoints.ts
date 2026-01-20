
import "dotenv/config";

async function checkForgotPassword() {
  const baseUrl = "http://127.0.0.1:3000"; 
  const path = "/api/auth/forget-password";
  console.log(`Testando ${path} em ${baseUrl}...`);

  try {
      const res = await fetch(`${baseUrl}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Valid payload to trigger 200 or 400 (if user doesn't exist etc)
        body: JSON.stringify({ email: "invalid-email-for-test@example.com", redirectTo: "/reset-password" })
      });
      console.log(`POST ${path}: ${res.status} ${res.statusText}`);
      const text = await res.text();
      console.log("Response:", text.substring(0, 200));
  } catch (e) {
      console.error("Erro:", e.message);
  }
}

checkForgotPassword();
