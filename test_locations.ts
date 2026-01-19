import { getLocations } from "./app/_actions/get-locations";

async function main() {
  const locations = await getLocations();
  console.log("Returned Locations:");
  console.log(JSON.stringify(locations, null, 2));
}

main().catch(console.error);
