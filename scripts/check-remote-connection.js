
const fs = require('fs');
const path = require('path');

// Manually read .env
const envPath = path.join(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim().replace(/^"/, '').replace(/"$/, ''); // Remove quotes if present
        envVars[key] = value;
    }
});

const API_URL = envVars.NEXT_PUBLIC_COMERCIO_API_URL;
const API_KEY = envVars.COMERCIO_API_KEY;

console.log("--- REMOTE API CHECK (Manual Env) ---");
console.log(`URL: ${API_URL}`);
console.log(`KEY: ${API_KEY ? "Presente" : "Missing"}`);

if (!API_URL || !API_KEY) {
  console.error("Missing configuration. Check .env.");
  process.exit(1);
}

const headers = {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${API_KEY}`
};

async function check() {
  try {
    // 1. Check Shops List
    console.log("\n1. Fetching Shops List...");
    const shopsUrl = `${API_URL}/shops`;
    console.log(`GET ${shopsUrl}`);
    const resShops = await fetch(shopsUrl, { headers });
    console.log(`Status: ${resShops.status} ${resShops.statusText}`);
    
    if (!resShops.ok) {
        console.log("Body:", await resShops.text());
        return;
    }

    const shops = await resShops.json();
    console.log(`Found ${shops.length} shops.`);

    if (shops.length === 0) {
        console.log("No shops to test details.");
        return;
    }

    const shopId = shops[0].id; 
    console.log(`\nTesting with Shop ID: ${shopId}`);

    // 2. Check Shop Details
    console.log(`\n2. Fetching Details for ${shopId}...`);
    const detailsUrl = `${API_URL}/shops/${shopId}`;
    console.log(`GET ${detailsUrl}`);
    const resDetails = await fetch(detailsUrl, { headers });
    console.log(`Status: ${resDetails.status} ${resDetails.statusText}`);
    if (!resDetails.ok) console.log("Body:", await resDetails.text());

    // 3. Check Services
    console.log(`\n3. Fetching Services for ${shopId}...`);
    const servicesUrl = `${API_URL}/shops/${shopId}/services`;
    console.log(`GET ${servicesUrl}`);
    const resServices = await fetch(servicesUrl, { headers });
    console.log(`Status: ${resServices.status} ${resServices.statusText}`);
    if (!resServices.ok) console.log("Body:", await resServices.text());

    // 4. Check Availability
    console.log(`\n4. Fetching Availability for ${shopId}...`);
    const today = new Date().toISOString().split('T')[0];
    const availUrl = `${API_URL}/shops/${shopId}/availability?date=${today}`;
    console.log(`GET ${availUrl}`);
    const resAvail = await fetch(availUrl, { headers });
    console.log(`Status: ${resAvail.status} ${resAvail.statusText}`);
    if (!resAvail.ok) console.log("Body:", await resAvail.text());

  } catch (error) {
    console.error("Connection failed:", error);
  }
}

check();
