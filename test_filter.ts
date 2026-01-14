// test_filter.ts
import { getBarbershops } from "./data/barbershops";

async function main() {
  const state = process.argv[2] || "";
  const city = process.argv[3] || "";
  const search = process.argv[4] || "";
  const results = await getBarbershops({ state: state || undefined, city: city || undefined, search: search || undefined });
  console.log("Filters:", { state, city, search });
  console.log("Found", results.length, "barbershops");
  console.log(results.map(b => ({ id: b.id, name: b.name, city: b.city, state: b.state })));
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
