
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

async function main() {
    const email = "georgeluccas300@gmail.com";
    console.log("Testing manual DB creation for", email);
    
    try {
        const hashedPassword = await hash("123456789", 10);
        // Better Auth typically uses UUIDs or CUIDs. Adapters usually generate them.
        // Prisma User model has 'id String @id'. No default?
        // Let's check schema. 'id String @id'. No default value function?
        // Wait, schema Step 12: 'id String @id'. 
        // If no default is set, Better Auth adapter provides it.
        // But if I use Prisma directly, I must provide it.
        
        const user = await prisma.user.create({
            data: {
                id: "test-user-" + Date.now().toString(),
                name: "Manual Test",
                email: email,
                password: hashedPassword,
                role: "ADMIN",
                // Required fields?
                // emailVerified: false (default)
            }
        });
        console.log("SUCCESS: User created manually via Prisma.");
        console.log("User Data:", user);
        
        // Clean up
        await prisma.user.delete({ where: { id: user.id } });
        console.log("Cleanup successful.");

    } catch (e: any) {
        console.error("FAILURE: Prisma Creation Error:", e);
        if (e.code) console.error("Error Code:", e.code);
        if (e.meta) console.error("Error Meta:", e.meta);
    }
}

main();
