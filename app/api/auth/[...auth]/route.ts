import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

console.log("Auth API route loaded"); 

export const { POST, GET } = toNextJsHandler(auth);
