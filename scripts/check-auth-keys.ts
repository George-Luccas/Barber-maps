
import "dotenv/config";
import { auth } from "../lib/auth";

async function checkKeys() {
  const keys = Object.keys(auth.api);
  console.log("Has forgetPassword:", keys.includes("forgetPassword"));
  console.log("Has forgotPassword:", keys.includes("forgotPassword"));
  console.log("Has resetPassword:", keys.includes("resetPassword"));
  console.log("Has sendResetPassword:", keys.includes("sendResetPassword"));
  console.log("Has requestPasswordReset:", keys.includes("requestPasswordReset"));
}

checkKeys();
