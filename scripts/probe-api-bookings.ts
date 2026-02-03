
import { comercioApi } from "@/services/comercio-api";

// We need to bypass the "isConfigured" check if env vars aren't loaded in this script context 
// or manually setup fetch if the module doesn't work in standalone script.
// But lets try using the module first, assuming dotenv is loaded by tsx.

async function main() {
  const email = "georgeluccas300@gmail.com";
  console.log(`Probing API for bookings for: ${email}`);

  // Accessing private/internal parts via raw fetch since the method doesn't exist on the interface yet
  const API_URL = process.env.NEXT_PUBLIC_COMERCIO_API_URL || "http://localhost:3000/api/external/v1";
  const API_KEY = process.env.COMERCIO_API_KEY;
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${API_KEY}`
  };

  const endpoints = [
    `${API_URL}/bookings?email=${email}`,
    `${API_URL}/bookings?clientEmail=${email}`,
    `${API_URL}/users/${email}/bookings`,
    `${API_URL}/my-bookings?email=${email}`
  ];

  for (const url of endpoints) {
    console.log(`\nTesting: ${url}`);
    try {
      const res = await fetch(url, { headers });
      console.log(`Status: ${res.status} ${res.statusText}`);
      if (res.ok) {
        const data = await res.json();
        console.log("SUCCESS! Data found:", JSON.stringify(data, null, 2));
      } else {
        const text = await res.text();
        console.log("Error body:", text.substring(0, 200));
      }
    } catch (e: any) {
      console.log("Fetch error:", e.message);
    }
  }
}

main();
