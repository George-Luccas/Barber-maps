
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Not logged in" }, { status: 401 });
        }

        if (session.user.email === "georgeluccas300@gmail.com") {
            await prisma.user.update({
                where: { id: session.user.id },
                data: { role: "ADMIN" }
            });
            return NextResponse.json({ success: true, message: "User promoted to ADMIN. Please verify." });
        }

        return NextResponse.json({ error: "Unauthorized email for auto-promotion" }, { status: 403 });

    } catch (error) {
        return NextResponse.json({ error: "Internal Error", details: String(error) }, { status: 500 });
    }
}
