
import "dotenv/config";
import { auth } from "../lib/auth";

async function checkReset() {
    console.log("Checking resetPassword...");
    if (auth.api.resetPassword) {
        console.log("✅ auth.api.resetPassword exists!");
    } else {
        console.log("❌ auth.api.resetPassword DOES NOT exist!");
    }
}
checkReset();
