import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { sendPasswordResetEmail } from "./email";
import { hash, compare } from "bcryptjs";
// import removed: emailPassword not needed

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  timeout: 30000, // Increase connection timeout
  baseURL: process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"), 
  basePath: "/api/auth",
  trustedOrigins: [
    "https://*.vercel.app", 
    "https://barber-maps.vercel.app",
    "https://barbermaps.com.br",
    "https://www.barbermaps.com.br",
    "http://localhost:3000",
    "http://localhost:3001",
    "https://*", // Allow any HTTPS domain (Custom Domains)
    "*", // Emergency fallback
  ],
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
    password: {
        hash: async (password: string) => {
          const hashedPassword = await hash(password, 10);
          return hashedPassword;
        },
        verify: async ({ password, hash }: { password: string, hash: string }) => {
          console.log("[DEBUG] Verifying password. Hash length:", hash?.length);
          try {
              const isValid = await compare(password, hash);
              console.log("[DEBUG] Password valid?", isValid);
              return isValid;
          } catch (e) {
              console.error("[DEBUG] Error verifying password:", e);
              return false;
          }
        }, 
    },
    async sendResetPassword(data) {
        console.log("[DEBUG] sendResetPassword callback triggered for:", data.user.email);
        await sendPasswordResetEmail(data.user.email, data.token);
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
      },
      imagePosition: { type: "string" },
      coverImagePosition: { type: "string" },
    },
  },
  callbacks: {
    async session({ session, user }: { session: any, user: any }) {
        try {
            return {
                ...session,
                user: {
                    ...session.user,
                    role: user?.role || "BARBER" // Ensure role fallback
                }
            }
        } catch (error) {
            console.error("[CRITICAL] Session callback failed:", error);
            // Fallback to basic session to avoid 500
            return session;
        }
    }
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          console.log("[DEBUG] Auth Hook: Creating user:", user.email);
          if (user.email === "georgeluccas300@gmail.com") {
             console.log("[DEBUG] Auth Hook: Promoting to ADMIN");
            return {
              data: {
                ...user,
                role: "ADMIN",
              },
            };
          }
          return { data: user };
        },
      },
    },
  },
});
