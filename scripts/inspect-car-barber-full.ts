
import { config } from "dotenv";
config();

async function main() {
  const { comercioApi } = await import("@/services/comercio-api");
  
  console.log("Searching for 'Car barber'...");
  const shops = await comercioApi.getShops({ search: "Car" });
  
  const carBarber = shops.find(s => s.name.toLowerCase().includes("car barber"));

  if (carBarber) {

      console.log("FOUND SHOP. Searching for key 'a4358c54' in properties...");
      
      const findKey = (obj: any, path: string = "") => {
          if (!obj) return;
          for (const key in obj) {
              const val = obj[key];
              const newPath = path ? `${path}.${key}` : key;
              if (typeof val === "string" && val.includes("a4358c54")) {
                  console.log(`🔥 MATCH FOUND at: ${newPath} = ${val}`);
              } else if (typeof val === "object") {
                  findKey(val, newPath);
              }
          }
      };

      console.log("MATCH SEARCH FINISHED.");
      
      console.log("\n--- Keys available on object ---");
      console.log(Object.keys(carBarber));

      console.log("\n--- Description Field Content ---");
      console.log(carBarber.description);
      
      console.log("\n--- About Us Field Content ---");
      console.log(carBarber.aboutUs);

  } else {
      console.log("Car barber not found in search results.");
      console.log("Available shops:", shops.map(s => s.name));
  }
}

main();
