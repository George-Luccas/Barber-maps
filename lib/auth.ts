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
    max: 1000, // Increase limit significantly
  },
  trustedOrigins: [
    "https://barber-maps.vercel.app",
    "http://localhost:3000",
    ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
    ...(process.env.VERCEL_BRANCH_URL ? [`https://${process.env.VERCEL_BRANCH_URL}`] : []),
    ...(process.env.VERCEL_PROJECT_PRODUCTION_URL ? [`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`] : []),
  ],
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
    async sendResetPassword(data, request) {
      // Import dynamically to avoid circular deps if any (though lib/email is fine)
      const { sendPasswordResetEmail } = await import("./email");
      await sendPasswordResetEmail(data.user.email, data.token);
    },
  },
});
