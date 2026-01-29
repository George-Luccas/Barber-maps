
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

async function main() {
    console.log("Attempting to create user via server-side generic script...");
    const email = "georgeluccas300@gmail.com";
    const password = "password123";
    const name = "George Luccas";

    try {
        // Better Auth server-side generic sign up might not be exposed as simple function without request context
        // But we can try to investigate if user already exists
        const { prisma } = await import("@/lib/prisma");
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            console.log("User ALREADY EXISTS in database:", existingUser);
            // This would explain why he can't register
        } else {
            console.log("User NOT FOUND in database. Proceeding with registration check...");
            // We can't easily invoke auth.api.signUpEmail without a request mock
            // But confirming existence is the most important step after a 'cleanup' that might have failed
        }

        // Check Account table too
        const accounts = await prisma.account.findMany({
            where: { userId: existingUser?.id || "nonexistent" }
        });
        console.log("Accounts found for user:", accounts);

    } catch (e: any) {
        console.error("Script error:", e);
    }
}

main();
