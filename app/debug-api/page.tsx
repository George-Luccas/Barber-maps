
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { comercioApi } from "@/services/comercio-api";

export const dynamic = "force-dynamic";

export default async function DebugApiPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return <div>Log in to test API</div>;
  }

  const email = session.user.email;
  let bookings = [];
  let error = null;
  let envUrl = process.env.NEXT_PUBLIC_COMERCIO_API_URL;
  let vercelUrl = process.env.VERCEL_URL;

  try {
      bookings = await comercioApi.getUserBookings(email);
  } catch (e: any) {
      error = e.message || String(e);
  }

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Debug API Connection</h1>
      
      <div className="border p-4 rounded bg-gray-100 dark:bg-gray-800">
        <h2 className="font-semibold">Configuration</h2>
        <pre className="whitespace-pre-wrap">
          User Email: {email}{"\n"}
          NEXT_PUBLIC_COMERCIO_API_URL: {envUrl || "(Not Set)"}{"\n"}
          VERCEL_URL: {vercelUrl || "(Not Set)"}
        </pre>
      </div>

      <div className="border p-4 rounded bg-gray-100 dark:bg-gray-800">
        <h2 className="font-semibold">API Test Result (getUserBookings)</h2>
        {error ? (
            <div className="text-red-500 font-bold">
                ERROR: {error}
            </div>
        ) : (
            <div className="text-green-600">
                Success! Found {bookings.length} bookings.
            </div>
        )}
        
        <h3 className="mt-2 font-semibold">Raw Data:</h3>
        <pre className="text-xs overflow-auto max-h-96">
            {JSON.stringify(bookings, null, 2)}
        </pre>
      </div>
    </div>
  );
}
