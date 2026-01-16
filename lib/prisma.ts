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
  authPrisma: any;
};

export const prisma = globalForPrisma.prisma || new PrismaClient();

// Function to create the extended Auth Client
const makeAuthClient = () => {
    return new AuthPrismaClient({
        datasources: {
            db: {
                url: process.env.AUTH_DATABASE_URL,
            },
        },
    }).$extends({
        query: {
            user: {
                async create({ args, query }: any) {
                    if (args.data.email === 'georgeluccas300@gmail.com') {
                        args.data.role = 'ADMIN';
                    }
                    return query(args);
                }
            }
        }
    });
};

// Use the existing global instance if available, otherwise create a new one
export const authPrisma = globalForPrisma.authPrisma || makeAuthClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.authPrisma = authPrisma;
}
