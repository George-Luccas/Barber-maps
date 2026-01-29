
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs"; // Assuming bcryptjs is installed per package.json

export async function POST(req: Request) {
    try {
        const { newPassword, token } = await req.json();

        if (!newPassword || !token) {
            return NextResponse.json({ message: "Senha e token são obrigatórios" }, { status: 400 });
        }

        // Verify Token
        // We stored identifier = token, value = email
        const verification = await prisma.verification.findFirst({
            where: {
                identifier: token,
                expiresAt: {
                    gt: new Date()
                }
            }
        });

        if (!verification) {
            return NextResponse.json({ message: "Link inválido ou expirado" }, { status: 400 });
        }

        const email = verification.value;

        // Hash Password
        const hashedPassword = await hash(newPassword, 10);

        // Update User
        await prisma.user.update({
            where: { email },
            data: {
                password: hashedPassword
            }
        });

        // Update Account (Better Auth credential provider)
        const userWithId = await prisma.user.findUnique({ where: { email }, select: { id: true } });
        if (userWithId) {
            // Update ALL accounts for this user that have a password field.
            // This covers "credential", "email", or any other provider ID that might store a password.
            await prisma.account.updateMany({
                where: { 
                    userId: userWithId.id,
                },
                data: {
                    password: hashedPassword
                }
            });
        }

        // Delete Verification (Consume token)
        await prisma.verification.delete({
            where: { id: verification.id }
        });

        return NextResponse.json({ status: true });

    } catch (error) {
        console.error("Erro no reset-password manual:", error);
        return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 });
    }
}
