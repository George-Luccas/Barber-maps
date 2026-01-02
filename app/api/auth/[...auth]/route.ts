import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

console.log("Auth API route loaded"); // Debug load

const handler = toNextJsHandler(auth);

export const POST = async (req: Request) => {
  console.log("AUTH POST Request Origin:", req.headers.get("origin"));
  console.log("AUTH Host:", req.headers.get("host"));
  console.log("VERCEL_URL:", process.env.VERCEL_URL);
  return handler.POST(req);
};

export const GET = async (req: Request) => {
  console.log("AUTH GET Request");
  return handler.GET(req);
};
