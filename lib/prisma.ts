import { PrismaClient } from "@prisma/client";
// import { PrismaPg } from "@prisma/adapter-pg";
// import { Pool } from "pg";
// @ts-ignore
import { PrismaClient as AuthPrismaClient } from "../generated/auth-client";

// Main Project Database Connection
// Adapter removed to avoid conflict with Prisma Accelerate URL
// const connectionString = `${process.env.DATABASE_URL}`;
// const pool = new Pool({ connectionString });
// const adapter = new PrismaPg(pool);

const globalForPrisma = global as unknown as { 
  prisma: PrismaClient;
  authPrisma: AuthPrismaClient;
};

export const prisma = globalForPrisma.prisma || new PrismaClient();

// Auth Database Connection
export const authPrisma = globalForPrisma.authPrisma || new AuthPrismaClient({
  datasources: {
    db: {
      url: process.env.AUTH_DATABASE_URL,
    },
  },
});

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.authPrisma = authPrisma;
}
