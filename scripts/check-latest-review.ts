
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = "georgeluccas300@gmail.com";
  
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
        reviews: {
            include: { barbershop: true },
            orderBy: { createdAt: 'desc' },
            take: 1
        }
    }
  });

  if (!user) {
      console.log("User not found");
      return;
  }

  if (user.reviews.length === 0) {
      console.log("No reviews found for this user.");
  } else {
      const review = user.reviews[0];
      console.log("Latest Review Found:");
      console.log(`- Shop: ${review.barbershop.name}`);
      console.log(`- Rating: ${review.rating} (Type: ${typeof review.rating})`);
      console.log(`- Comment: ${review.comment}`);
      console.log(`- CreatedAt: ${review.createdAt}`);
      console.log(`- BarbershopId: ${review.barbershopId}`);
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
