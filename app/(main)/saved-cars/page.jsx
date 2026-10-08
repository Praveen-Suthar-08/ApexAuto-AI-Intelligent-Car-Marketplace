import { getSavedCars } from "@/actions/car-listing";
import { SavedCarsList } from "./_components/saved-cars-list";
import { auth } from "@/lib/auth-server";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Saved Cars | Vehiql",
  description: "View your saved cars and favorites",
};

export default async function SavedCarsPage() {
  // Check authentication on server
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in?redirect=/saved-cars");
  }

  // Fetch saved cars on the server
  const savedCarsResult = await getSavedCars();

  return (
    <div className="w-full max-w-[1750px] mx-auto px-4 sm:px-8 lg:px-12 py-12 pt-28">
      <div className="mb-8">
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">Your Saved Cars</h1>
        <p className="text-slate-500 text-sm mt-1">Review vehicles you have bookmarked for comparison and booking.</p>
      </div>
      <SavedCarsList initialData={savedCarsResult} />
    </div>
  );
}
