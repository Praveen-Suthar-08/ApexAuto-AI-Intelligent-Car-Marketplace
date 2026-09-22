"use client";

import { useState, useEffect } from "react";
import { Search, Upload, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import { processImageSearch } from "@/actions/home";
import useFetch from "@/hooks/use-fetch";

export function HomeSearch() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchImage, setSearchImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isImageSearchActive, setIsImageSearchActive] = useState(false);

  // Use the useFetch hook for image processing
  const {
    loading: isProcessing,
    fn: processImageFn,
    data: processResult,
    error: processError,
  } = useFetch(processImageSearch);

  // Handle process result and errors with useEffect
  useEffect(() => {
    if (processResult?.success) {
      const params = new URLSearchParams();

      // Add extracted params to the search
      if (processResult.data.make) params.set("make", processResult.data.make);
      if (processResult.data.bodyType)
        params.set("bodyType", processResult.data.bodyType);
      if (processResult.data.color)
        params.set("color", processResult.data.color);

      // Redirect to search results
      router.push(`/cars?${params.toString()}`);
    }
  }, [processResult, router]);

  useEffect(() => {
    if (processError) {
      toast.error(
        "Failed to analyze image: " + (processError.message || "Unknown error")
      );
    }
  }, [processError]);

  // Handle image upload with react-dropzone
  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      setIsUploading(true);
      setSearchImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setIsUploading(false);
        toast.success("Image uploaded successfully");
      };
      reader.onerror = () => {
        setIsUploading(false);
        toast.error("Failed to read the image");
      };
      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: {
        "image/*": [".jpeg", ".jpg", ".png"],
      },
      maxFiles: 1,
    });

  // Handle text search submissions
  const handleTextSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      toast.error("Please enter a search term");
      return;
    }

    router.push(`/cars?search=${encodeURIComponent(searchTerm)}`);
  };

  // Handle image search submissions
  const handleImageSearch = async (e) => {
    e.preventDefault();
    if (!searchImage) {
      toast.error("Please upload an image first");
      return;
    }

    // Use the processImageFn from useFetch hook
    await processImageFn(searchImage);
  };

  return (
    <div>
      <form onSubmit={handleTextSearch} className="relative">
        <div className="relative flex items-center shadow-2xl rounded-full bg-white/95 backdrop-blur-xl p-1.5 border border-slate-200/80 hover:border-indigo-300 transition-all group focus-within:ring-4 focus-within:ring-indigo-500/15 focus-within:border-indigo-500">
          <Search className="absolute left-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={22} />
          <Input
            type="text"
            placeholder="Search by make, model, electric, luxury, SUV..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-28 py-6 w-full rounded-full border-none shadow-none text-slate-800 placeholder:text-slate-400 text-base focus-visible:ring-0"
          />

          {/* Image Search Button */}
          <div className="absolute right-[115px]">
            <button
              type="button"
              title="Search by Car Photo (AI Vision)"
              onClick={() => setIsImageSearchActive(!isImageSearchActive)}
              className={`p-2.5 rounded-full transition-all flex items-center gap-1.5 text-xs font-semibold ${
                isImageSearchActive
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/30 scale-105"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              <Camera size={18} />
              <span className="hidden sm:inline">AI Lens</span>
            </button>
          </div>

          <Button type="submit" className="rounded-full px-6 py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md shadow-indigo-600/25 transition-all">
            Search
          </Button>
        </div>
      </form>

      {/* Quick Search Chips */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
        <span className="text-slate-400 font-medium mr-1">Trending:</span>
        {["Electric", "Sedan", "SUV", "BMW", "Tesla", "Under $30k"].map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => {
              if (tag === "Electric") router.push("/cars?fuelType=Electric");
              else if (tag === "Sedan" || tag === "SUV") router.push(`/cars?bodyType=${tag}`);
              else if (tag === "BMW" || tag === "Tesla") router.push(`/cars?make=${tag}`);
              else router.push("/cars");
            }}
            className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 border border-white/15 backdrop-blur-sm transition-all hover:scale-105 cursor-pointer"
          >
            {tag}
          </button>
        ))}
      </div>

      {isImageSearchActive && (
        <div className="mt-6 animate-in fade-in slide-in-from-top-4 duration-300">
          <form onSubmit={handleImageSearch} className="space-y-4">
            <div className="relative overflow-hidden border-2 border-dashed border-indigo-400/40 hover:border-indigo-400 bg-slate-900/60 backdrop-blur-xl rounded-3xl p-8 text-center transition-all">
              {imagePreview ? (
                <div className="flex flex-col items-center">
                  <div className="relative rounded-xl overflow-hidden border border-white/20 shadow-2xl scanline-pulse mb-4">
                    <img
                      src={imagePreview}
                      alt="Car preview"
                      className="h-48 object-contain bg-slate-950/60 p-2"
                    />
                    {isProcessing && (
                      <div className="absolute inset-0 bg-indigo-950/70 backdrop-blur-xs flex flex-col items-center justify-center text-white">
                        <div className="h-8 w-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin mb-2" />
                        <p className="text-xs font-medium tracking-wide">Gemini Vision Scanning Specs...</p>
                      </div>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    onClick={() => {
                      setSearchImage(null);
                      setImagePreview("");
                      toast.info("Image removed");
                    }}
                  >
                    Change Image
                  </Button>
                </div>
              ) : (
                <div {...getRootProps()} className="cursor-pointer py-4">
                  <input {...getInputProps()} />
                  <div className="flex flex-col items-center">
                    <div className="h-14 w-14 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-3 shadow-inner">
                      <Upload className="h-7 w-7" />
                    </div>
                    <p className="text-slate-200 font-semibold text-base mb-1">
                      {isDragActive && !isDragReject
                        ? "Drop the car image right here"
                        : "Upload a car image for instant AI recognition"}
                    </p>
                    <p className="text-slate-400 text-xs mb-3">
                      Our Gemini vision neural model automatically identifies make, body style, and color
                    </p>
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-slate-400 font-mono">
                      PNG, JPG or WEBP (Max 5MB)
                    </span>
                  </div>
                </div>
              )}
            </div>

            {imagePreview && (
              <Button
                type="submit"
                className="w-full py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-xl shadow-indigo-600/30 text-base"
                disabled={isUploading || isProcessing}
              >
                {isUploading
                  ? "Uploading photo..."
                  : isProcessing
                  ? "AI Analyzing Vehicle Characteristics..."
                  : "Find Matches with AI Vision"}
              </Button>
            )}
          </form>
        </div>
      )}
    </div>
  );
}
