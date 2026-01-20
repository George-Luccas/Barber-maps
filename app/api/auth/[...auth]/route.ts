import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

console.log("Auth API route loaded"); 

// Force dynamic to prevent caching of session data
export const dynamic = "force-dynamic";
export const { POST, GET } = toNextJsHandler(auth);
