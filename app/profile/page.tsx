
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { headers } from "next/headers";
import { getUserBookings } from "@/data/bookings";
import { getUserFavorites, getUserStats } from "@/app/_actions/user-actions";
import { ProfileContent } from "./_components/profile-content";
import { prisma } from "@/lib/prisma";
import { comercioApi } from "@/services/comercio-api";

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-1 flex flex-col items-center justify-center p-5 text-center gap-4">
                <h2 className="text-xl font-bold">Você não está logado</h2>
                <p className="text-muted-foreground">Faça login para ver seu perfil.</p>
                <Link href="/login">
                    <Button>Fazer Login</Button>
                </Link>
            </div>
            <Footer />
        </div>
    )
  }

  // Fetch fresh user data to get updated image/phone via API
  // NOTE: Changed from prisma.user.findUnique to API call to prevent direct DB connection issues
  const user = session.user.email ? await comercioApi.getUserProfile(session.user.email) : null;

  if (!user) {
      // Fallback to session user if API fails, but ideally we want the fresh data
     console.error("Failed to fetch user profile from API");
     // return null; 
  }
  
  // Backup user object if API returns null but we have session
  const displayUser = user || {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      image: session.user.image
  };

  const bookingData = await getUserBookings();
  const favorites = await getUserFavorites();
  const stats = await getUserStats();

  return (
    <div className="min-h-screen bg-background pb-10">
      <Header />
      
      <ProfileContent 
        user={displayUser}
        bookings={{
            confirmed: bookingData.confirmedBookings,
            finished: bookingData.finishedBookings
        }}
        favorites={favorites}
        stats={stats}
      />
      
      <Footer />
    </div>
  );
}
