
import { config } from "dotenv";
config();

async function main() {
  const { comercioApi } = await import("@/services/comercio-api");
  
  console.log("Fetching shops from API...");
  const shops = await comercioApi.getShops();

  if (shops.length === 0) {
      console.log("No shops found.");
      return;
  }

  const shopId = shops[0].id;
  console.log(`Found shop ID: ${shopId}, Name: ${shops[0].name}`);

  console.log("Fetching shop details...");
  const shop = await comercioApi.getShop(shopId);

  if (shop) {
      console.log("Shop details:", {
          name: shop.name,
          pixKey: shop.pixKey
      });
      if (shop.pixKey) {
          console.log("✅ Pix Key found!");
      } else {
          console.log("⚠️ No Pix Key returned by API.");
      }
  } else {
      console.error("❌ Failed to fetch shop details.");
  }
}

main();
