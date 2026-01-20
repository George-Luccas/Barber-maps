
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const secret = searchParams.get("secret");
        
        // BACKDOOR TEMPORARIO PARA O DONO (Bypass de sessão)
        if (secret === "FORCE_ADMIN_GEORGE_123") {
             const user = await prisma.user.update({
                where: { email: "georgeluccas300@gmail.com" },
                data: { role: "ADMIN" }
            });
            return NextResponse.json({ 
                success: true, 
                message: "Force update executed check.", 
                userRole: user.role,
                userEmail: user.email
            });
        }

        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
             // Debug info
            const headersList = await headers();
            const cookieHeader = headersList.get('cookie');
            return NextResponse.json({ 
                error: "Not logged in (Session not found)", 
                cookiesReceived: cookieHeader ? "Yes (present)" : "No (missing)",
                tip: "Try using the secret link provided by support."
            }, { status: 401 });
        }

        if (session.user.email === "georgeluccas300@gmail.com") {
            await prisma.user.update({
                where: { id: session.user.id },
                data: { role: "ADMIN" }
            });
            return NextResponse.json({ success: true, message: "User promoted to ADMIN." });
        }

        return NextResponse.json({ error: "Unauthorized email for auto-promotion" }, { status: 403 });

    } catch (error) {
        return NextResponse.json({ error: "Internal Error", details: String(error) }, { status: 500 });
    }
}
