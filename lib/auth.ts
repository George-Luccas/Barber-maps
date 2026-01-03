import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { authPrisma } from "./prisma";
// import removed: emailPassword not needed

export const auth = betterAuth({
  database: prismaAdapter(authPrisma, {
    provider: "postgresql",
  }),
  // baseURL: process.env.VERCEL_URL 
  //   ? `https://${process.env.VERCEL_URL}` 
  //   : (process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL),
  rateLimit: {
    window: 10,
    max: 1000, 
  },
  trustedOrigins: [
    "https://barber-maps.vercel.app",
    "http://localhost:3000",
    "https://barber-maps-33sj2ta61-george-luccas-projects.vercel.app", // Specific Preview Fix
    ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
  ],
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
    // Recovery disabled for stability test
  },
});
