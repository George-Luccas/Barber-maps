import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { authPrisma } from "./prisma";
// import removed: emailPassword not needed

export const auth = betterAuth({
  database: prismaAdapter(authPrisma, {
    provider: "postgresql",
  }),
  baseURL: process.env.BETTER_AUTH_URL || 
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : process.env.NEXT_PUBLIC_APP_URL),
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
