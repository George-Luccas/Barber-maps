import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { authPrisma } from "./prisma";
// import removed: emailPassword not needed

export const auth = betterAuth({
  database: prismaAdapter(authPrisma, {
    provider: "postgresql",
  }),
  timeout: 30000, // Increase connection timeout
  trustedOrigins: [
    "https://*.vercel.app", // Allow all Vercel subdomains (Preview & Prod)
    "https://barber-maps.vercel.app",
    "http://localhost:3000",
    "*", // Emergency fallback: Trust all origins to unblock development
  ],
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
  },
});
