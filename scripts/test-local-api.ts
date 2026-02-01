
async function main() {
  const url = "http://127.0.0.1:3000/api/external/v1/bookings";
  console.log(`Testing POST to ${url}`);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { 
          "Content-Type": "application/json",
          "Authorization": "Bearer sk_start" // Dummy key, validation is loose locally
      },
      body: JSON.stringify({
        barbershopId: "test-shop-id",
        serviceId: "test-service-id",
        date: new Date().toISOString(),
        clientName: "Test User",
        clientEmail: "georgeluccas300@gmail.com",
        isSubscription: false
      })
    });

    console.log(`Status: ${res.status}`);
    const text = await res.text();
    console.log(`Body: ${text}`);

  } catch (err) {
    console.error("Fetch failed:", err);
  }
}

main();
