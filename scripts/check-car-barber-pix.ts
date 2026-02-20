
import { config } from "dotenv";
config();

async function main() {
  const { comercioApi } = await import("@/services/comercio-api");
  
  console.log("Listing all shops...");
  const shops = await comercioApi.getShops();
  console.log(`Found ${shops.length} shops.`);
  
  const carBarber = shops.find(s => s.name.includes("Car"));
  if (carBarber) {
      console.log("Found 'Car barber' in list:");
      console.log("ID:", carBarber.id);
      console.log("Pix Key:", carBarber.pixKey);
  } else {
      console.log("'Car barber' not found in shop list.");
  }
}

main();
