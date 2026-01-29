import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

console.log("Auth API route loaded"); 

// Force dynamic to prevent caching of session data
export const dynamic = "force-dynamic";
const handlers = toNextJsHandler(auth);

export const GET = handlers.GET;
export const POST = async (req: Request) => {
    try {
        return await handlers.POST(req);
    } catch (error: any) {
        console.error("BETTER AUTH CRASH:", error);
        return new Response(JSON.stringify({ 
            error: "CRITICAL_AUTH_ERROR", 
            message: error.message, 
            stack: error.stack 
        }), { 
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
};
