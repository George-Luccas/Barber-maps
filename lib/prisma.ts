// lib/prisma.ts

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// @ts-ignore
import { PrismaClient as AuthPrismaClient } from "@/generated/auth-client";

// Main Project Database Connection
const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

// Auth Database Connection (Standard Connection since Adapter logic might differ)
// For simplicity, using standard connection for Auth DB unless Pool is strictly needed there too.
const authConnectionString = `${process.env.AUTH_DATABASE_URL}`;

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const globalForAuthPrisma = global as unknown as { authPrisma: AuthPrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });
// Initialize Auth Client - Better Auth handles its own adapter internally usually, 
// but if we need a direct client we use this.
export const authPrisma = globalForAuthPrisma.authPrisma || new AuthPrismaClient({
    datasources: {
        db: {
            url: authConnectionString
        }
    }
});

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
    globalForAuthPrisma.authPrisma = authPrisma;
}
