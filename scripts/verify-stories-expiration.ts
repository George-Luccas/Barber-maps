
import { prisma } from "@/lib/prisma";
import { getBarbershopsWithStories } from "@/data/barbershops";

async function main() {
  console.log("Starting stories expiration verification...");

  // 1. Create a test barbershop
  const shop = await prisma.barbershop.create({
    data: {
      name: "Test Shop Stories",
      address: "Test Address",
      description: "Test Description",
      phones: ["123456789"],
    }
  });

  console.log(`Created test shop: ${shop.id}`);

  // 2. Create an OLD story (25 hours ago)
  const oldDate = new Date(Date.now() - 25 * 60 * 60 * 1000);
  await prisma.style.create({
    data: {
      id: `style-old-${shop.id}`,
      name: "Old Cut",
      imageUrl: "http://example.com/old.jpg",
      barbershopId: shop.id,
      createdAt: oldDate,
      updatedAt: oldDate
    }
  });
  console.log("Created OLD story (25h ago)");

  // 3. Create a NEW story (1 hour ago)
  const newDate = new Date(Date.now() - 1 * 60 * 60 * 1000);
  await prisma.style.create({
    data: {
      id: `style-new-${shop.id}`,
      name: "New Cut",
      imageUrl: "http://example.com/new.jpg",
      barbershopId: shop.id,
      createdAt: newDate,
      updatedAt: newDate
    }
  });
  console.log("Created NEW story (1h ago)");

  // 4. Fetch stories
  const shops = await getBarbershopsWithStories();
  const testShop = shops.find(s => s.id === shop.id);

  if (!testShop) {
    console.error("Test shop not found in results!");
    process.exit(1);
  }

  // 5. Verify results
  console.log(`Found ${testShop.Style.length} stories for test shop.`);
  
  const hasOld = testShop.Style.some(s => s.name === "Old Cut");
  const hasNew = testShop.Style.some(s => s.name === "New Cut");

  if (hasOld) {
    console.error("FAILURE: Old story was found!");
  } else {
    console.log("SUCCESS: Old story correctly filtered out.");
  }

  if (!hasNew) {
    console.error("FAILURE: New story was NOT found!");
  } else {
    console.log("SUCCESS: New story found.");
  }

  // Cleanup
  await prisma.style.deleteMany({ where: { barbershopId: shop.id } });
  await prisma.barbershop.delete({ where: { id: shop.id } });
  console.log("Cleanup done.");

  if (!hasOld && hasNew) {
    console.log("VERIFICATION PASSED");
  } else {
    console.log("VERIFICATION FAILED");
    process.exit(1);
  }
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
