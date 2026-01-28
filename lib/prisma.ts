import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient().$extends({
    query: {
      barbershop: {
        async create({ args, query }) {
          if (args.data.city) {
            args.data.city = args.data.city
              .trim()
              .toLowerCase()
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ");
          }
          return query(args);
        },
        async update({ args, query }) {
          if (args.data.city && typeof args.data.city === "string") {
            args.data.city = args.data.city
              .trim()
              .toLowerCase()
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ");
          }
          return query(args);
        },
      },
    },
  });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = global as unknown as { 
  prisma_active: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma_active || prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma_active = prisma;
}
