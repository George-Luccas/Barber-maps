
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export default async function DebugAuthPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  let dbUser = null;
  let bookings = [];
  
  if (session?.user?.email) {
      dbUser = await prisma.user.findUnique({
          where: { email: session.user.email }
      });
      
      if (dbUser) {
          bookings = await prisma.booking.findMany({
              where: { userId: dbUser.id },
              take: 5,
              orderBy: { date: 'desc' }
          });
      }
  }

  return (
    <div className="p-10 space-y-6 bg-white min-h-screen text-black">
      <h1 className="text-2xl font-bold">Debug Auth Session</h1>
      
      <div className="border p-4 rounded bg-gray-100">
        <h2 className="font-bold mb-2">Current Session</h2>
        <pre className="text-xs overflow-auto">{JSON.stringify(session, null, 2)}</pre>
      </div>

      <div className="border p-4 rounded bg-gray-100">
        <h2 className="font-bold mb-2">Database User (fetched by email)</h2>
        <pre className="text-xs overflow-auto">{JSON.stringify(dbUser, null, 2)}</pre>
      </div>
      
       <div className="border p-4 rounded bg-gray-100">
        <h2 className="font-bold mb-2">Recent Bookings (for DB User ID)</h2>
        <pre className="text-xs overflow-auto">{JSON.stringify(bookings, null, 2)}</pre>
      </div>
      
       <div className="border p-4 rounded bg-red-100 border-red-300">
        <h2 className="font-bold mb-2">Analysis</h2>
        <p>Session ID matches DB ID? {session?.user?.id === dbUser?.id ? "YES" : "NO"}</p>
        <p>Session ID: {session?.user?.id}</p>
        <p>Database ID: {dbUser?.id}</p>
      </div>
    </div>
  );
}
