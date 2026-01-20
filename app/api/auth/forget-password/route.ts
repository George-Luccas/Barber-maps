
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";


export async function POST(req: Request) {
    try {
        const { email, redirectTo } = await req.json();

        if (!email) {
            return NextResponse.json({ message: "Email é obrigatório" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            // For security, don't reveal if user exists. 
            // Just return success or generic message.
            // Better Auth usually returns success even if user not found.
            return NextResponse.json({ status: true });
        }

        // Generate Token
        const token = crypto.randomUUID();
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

        // Save to Verification table (mimicking Better Auth structure if possible, or just using it)
        // Identifier: `reset-password-${email}`?
        // Better Auth might use hashed values. 
        // We will stick to a custom identifier format that WE control in reset-password route.
        const identifier = `reset-password-${token}`; // Let's use token in identifier to be unique per request? 
        // Actually, identifier usually groups by purpose. 
        // But `verification` table has (identifier, value) unique? Or just id?
        // Schema: identifier matches value?
        // Let's use identifier = token, value = email? To look up email by token?
        // Schema: identifier String, value String.
        // We generally query by identifier.
        // So let's store: identifier = token, value = email.
        
        await prisma.verification.create({
            data: {
                id: crypto.randomUUID(),
                identifier: token,
                value: email,
                expiresAt,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });

        // Send Email
        await sendPasswordResetEmail(email, token);

        return NextResponse.json({ status: true });
    } catch (error) {
        console.error("Erro no forget-password manual:", error);
        return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 });
    }
}
