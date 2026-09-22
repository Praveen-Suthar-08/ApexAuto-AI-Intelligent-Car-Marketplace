"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Car as CarIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { toggleSavedCar } from "@/actions/car-listing";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import useFetch from "@/hooks/use-fetch";

export const CarCard = ({ car }) => {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(car.wishlisted);

  // Use the useFetch hook
  const {
    loading: isToggling,
    fn: toggleSavedCarFn,
    data: toggleResult,
    error: toggleError,
  } = useFetch(toggleSavedCar);

  // Handle toggle result with useEffect
  useEffect(() => {
    if (toggleResult?.success && toggleResult.saved !== isSaved) {
      setIsSaved(toggleResult.saved);
      toast.success(toggleResult.message);
    }
  }, [toggleResult, isSaved]);

  // Handle errors with useEffect
  useEffect(() => {
    if (toggleError) {
      toast.error("Failed to update favorites");
    }
  }, [toggleError]);

  // Handle save/unsave car
  const handleToggleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isSignedIn) {
      toast.error("Please sign in to save cars");
      router.push("/sign-in");
      return;
    }

    if (isToggling) return;

    // Call the toggleSavedCar function using our useFetch hook
    await toggleSavedCarFn(car.id);
  };

  return (
    <Card className="overflow-hidden rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group bg-white">
      <div className="relative h-52 overflow-hidden bg-slate-900">
        {car.images && car.images.length > 0 ? (
          <div className="relative w-full h-full">
            <Image
              src={car.images[0]}
              alt={`${car.make} ${car.model}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent opacity-60" />
          </div>
        ) : (
          <div className="w-full h-full bg-slate-800 flex items-center justify-center">
            <CarIcon className="h-12 w-12 text-slate-500" />
          </div>
        )}

        {/* Wishlist button with glassmorphic pill */}
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-3 right-3 backdrop-blur-md rounded-full h-9 w-9 p-0 shadow-md transition-all ${
            isSaved
              ? "bg-red-500 text-white hover:bg-red-600 shadow-red-500/30"
              : "bg-white/80 hover:bg-white text-slate-700 hover:text-red-500"
          }`}
          onClick={handleToggleSave}
          disabled={isToggling}
        >
          {isToggling ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Heart className={isSaved ? "fill-current" : ""} size={18} />
          )}
        </Button>
      </div>

      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-2 gap-2">
          <div>
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">
              {car.make}
            </span>
            <h3 className="text-lg font-bold text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
              {car.model}
            </h3>
          </div>
          <span className="text-lg font-black text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
            ${car.price.toLocaleString()}
          </span>
        </div>

        <div className="text-xs text-slate-500 mb-3 flex items-center gap-1.5 font-medium">
          <span>{car.year}</span>
          <span>•</span>
          <span>{car.transmission}</span>
          <span>•</span>
          <span>{car.fuelType}</span>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-5">
          <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 text-[11px] font-normal py-0.5 px-2">
            {car.bodyType}
          </Badge>
          <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 text-[11px] font-normal py-0.5 px-2">
            {car.mileage.toLocaleString()} mi
          </Badge>
          <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 text-[11px] font-normal py-0.5 px-2">
            {car.color}
          </Badge>
        </div>

        <div>
          <Button
            className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-semibold rounded-xl py-5 shadow-sm transition-all group-hover:shadow-md"
            onClick={() => {
              router.push(`/cars/${car.id}`);
            }}
          >
            Inspect Vehicle & Book Drive
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
