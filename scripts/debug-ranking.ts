
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    const shopCount = await prisma.barbershop.count();
    const reviewCount = await prisma.review.count();
    
    console.log(`Shops in Local DB: ${shopCount}`);
    console.log(`Reviews in Local DB: ${reviewCount}`);

    const shopsWithReviews = await prisma.barbershop.findMany({
        where: {
            reviews: {
                some: {}
            }
        },
        include: {
            _count: {
                select: { reviews: true }
            }
        },
        orderBy: {
            reviews: {
                _count: 'desc'
            }
        },
        take: 5
    });

    console.log("\nTop 5 Shops by Review Count:");
    shopsWithReviews.forEach(shop => {
        console.log(`${shop.name} (${shop.id}): ${(shop as any)._count.reviews} reviews`);
    });

  } catch (error) {
    console.error("Error checking DB:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
