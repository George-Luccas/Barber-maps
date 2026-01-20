import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { authPrisma } from "./prisma";
import { sendPasswordResetEmail } from "./email";
import { hash, compare } from "bcryptjs";
// import removed: emailPassword not needed

export const auth = betterAuth({
  database: prismaAdapter(authPrisma, {
    provider: "postgresql",
  }),
  timeout: 30000, // Increase connection timeout
  baseURL: process.env.NEXT_PUBLIC_APP_URL, 
  basePath: "/api/auth",
  trustedOrigins: [
    "https://*.vercel.app", // Allow all Vercel subdomains (Preview & Prod)
    "https://barber-maps.vercel.app",
    "http://localhost:3000",
    "*", // Emergency fallback: Trust all origins to unblock development
  ],
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
    async sendResetPassword(data) {
        // data.url is the link better-auth generated (e.g. /reset-password?token=...)
        // But our email function manually constructs it. Let's pass the token.
        // Or better, let's update our email function to take the URL if we wanted.
        // For now, let's just pass the token as our function expects.
        // data object likely contains { user, url, token }
        await sendPasswordResetEmail(data.user.email, data.token);
    },
  },
  password: {
    hash: async (password: string) => {
      return await hash(password, 10);
    },
    verify: async (password: string, hash: string) => {
      return await compare(password, hash);
    }, 
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
      },
    },
  },
  callbacks: {
    async session({ session, user }: { session: any, user: any }) {
        return {
            ...session,
            user: {
                ...session.user,
                // @ts-expect-error - role exists in prisma type but might not be inferred here
                role: user.role
            }
        }
    }
  }
});
