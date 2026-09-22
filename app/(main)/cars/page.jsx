import { CarFilters } from "./_components/car-filters";
import { getCarFilters } from "@/actions/car-listing";
import { CarListings } from "./_components/cars-listing";

export const metadata = {
  title: "Explore Fleet | ApexAuto AI",
  description: "Browse and search verified inventory with intelligent AI filters",
};

export default async function CarsPage() {
  // Fetch filters data on the server
  const filtersData = await getCarFilters();

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 pt-28">
      <div className="mb-8">
        <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
          Real-time Inventory
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Browse Verified Vehicles
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Filter by price, brand, transmission, fuel type, and mileage to find your perfect match.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Section */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <CarFilters filters={filtersData.data} />
        </div>

        {/* Car Listings */}
        <div className="flex-1">
          <CarListings />
        </div>
      </div>
    </div>
  );
}
