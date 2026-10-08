import { getUserTestDrives } from "@/actions/test-drive";
import { auth } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import { ReservationsList } from "./_components/reservations-list";

export const metadata = {
  title: "My Reservations | Vehiql",
  description: "Manage your test drive reservations",
};

export default async function ReservationsPage() {
  // Check authentication on server
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in?redirect=/reservations");
  }

  // Fetch reservations on the server
  const reservationsResult = await getUserTestDrives();

  return (
    <div className="w-full max-w-[1750px] mx-auto px-4 sm:px-8 lg:px-12 py-12 pt-28">
      <div className="mb-8">
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">Your Reservations</h1>
        <p className="text-slate-500 text-sm mt-1">Track and manage your upcoming dealership test drive appointments.</p>
      </div>
      <ReservationsList initialData={reservationsResult} />
    </div>
  );
}
