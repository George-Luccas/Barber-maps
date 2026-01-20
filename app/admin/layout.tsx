
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    redirect("/login");
  }

  // @ts-ignore - Role exists in DB but typescript might complain strictly
  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  return <>{children}</>;
}
