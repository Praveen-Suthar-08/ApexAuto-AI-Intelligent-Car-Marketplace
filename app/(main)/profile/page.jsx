import { auth } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import { ProfileView } from "./_components/profile-view";
import { getUserTestDrives } from "@/actions/test-drive";
import { getSavedCars } from "@/actions/car-listing";

export const metadata = {
  title: "Driver Profile & Account Settings | ApexAuto AI",
  description: "Manage your personal profile, test drive bookings, and automotive preferences.",
};

export default async function ProfilePage() {
  const { userId, user } = await auth();

  if (!userId) {
    redirect("/sign-in?redirect=/profile");
  }

  // Load user data & statistics
  const [testDrivesRes, savedCarsRes] = await Promise.all([
    getUserTestDrives(),
    getSavedCars(),
  ]);

  return (
    <div className="w-full max-w-[1750px] mx-auto px-4 sm:px-8 lg:px-12 py-12 pt-28">
      <ProfileView
        user={user}
        bookings={testDrivesRes?.data || []}
        savedCars={savedCarsRes?.data || []}
      />
    </div>
  );
}
