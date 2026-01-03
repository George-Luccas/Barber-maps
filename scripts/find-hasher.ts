
import * as pkg from 'better-auth';
console.log("Exports:", Object.keys(pkg));

// Try to import directly if possible, or just check pkg members
async function scan() {
  try {
     // @ts-ignore
     const crypto = await import("better-auth/crypto");
     console.log("Crypto:", Object.keys(crypto));
  } catch(e) { console.log("No crypto export"); }
}
scan();
