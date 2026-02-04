import { NextResponse } from "next/server";
import { prisma as db } from "@/lib/prisma";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    // NOTE: In production, validate apiKey from headers if strictly needed
    // const apiKey = req.headers.get("Authorization")?.replace("Bearer ", "");

    if (!email) {
        return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    try {
        const user = await db.user.findUnique({
            where: { email }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user, { status: 200 });
    } catch (error: any) {
        console.error("[LOCAL API] Get User Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
