
const API_URL = "https://barber-maps-comercio.vercel.app/api/external/v1";
const API_KEY = "sk_ryw3jqn5b_ml1r6ge0";

async function run() {
    console.log("--- DEBUG START ---");
    
    try {
        // 1. Get Shops
        const resp = await fetch(`${API_URL}/shops`, {
            headers: { "Authorization": `Bearer ${API_KEY}` }
        });
        
        if (!resp.ok) {
            console.log("GET /shops FAILED", resp.status);
            return;
        }
        
        const shops = await resp.json();
        console.log(`SHOPS FOUND: ${shops.length}`);
        
        if (shops.length > 0) {
            const shop = shops[0];
            console.log(`TESTING SHOP ID: ${shop.id} NAME: ${shop.name}`);

            // 2. Services
            const sResp = await fetch(`${API_URL}/shops/${shop.id}/services`, { headers: { "Authorization": `Bearer ${API_KEY}` } });
            console.log(`SERVICES STATUS: ${sResp.status}`);
            const sBody = await sResp.text();
            console.log("SERVICES BODY:", sBody.substring(0, 200));

            // 3. Details
            const dResp = await fetch(`${API_URL}/shops/${shop.id}`, { headers: { "Authorization": `Bearer ${API_KEY}` } });
            console.log(`DETAILS STATUS: ${dResp.status}`);
            const dBody = await dResp.text();
            console.log("DETAILS BODY:", dBody.substring(0, 200));
        }

    } catch (e) {
        console.error("EXCEPTION:", e);
    }
    console.log("--- DEBUG END ---");
}

run();
