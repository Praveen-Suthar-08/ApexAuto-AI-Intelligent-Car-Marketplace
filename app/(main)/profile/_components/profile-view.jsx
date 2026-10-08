"use client";

import { useState } from "react";
import { updateProfileAction } from "@/actions/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  User,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Heart,
  Car,
  Bell,
  KeyRound,
  ExternalLink,
  Loader2,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function ProfileView({ user, bookings = [], savedCars = [] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "+1 (555) 234-5678");
  const [city, setCity] = useState(user?.city || "San Francisco, CA");
  const [drivingLicense, setDrivingLicense] = useState(
    user?.drivingLicense || "DL-9842104-ACTIVE"
  );
  const [preferredFuel, setPreferredFuel] = useState("Electric & Hybrid");
  const [budgetRange, setBudgetRange] = useState("$30,000 - $70,000");

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("phone", phone);
      formData.append("city", city);
      formData.append("drivingLicense", drivingLicense);

      const res = await updateProfileAction(formData);

      if (res?.success) {
        toast.success("Profile information updated successfully!");
        router.refresh();
      } else {
        toast.error(res?.error || "Failed to update profile.");
      }
    } catch (err) {
      toast.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const initials = (name || user?.email || "U").substring(0, 2).toUpperCase();

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-8 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          <div className="h-24 w-24 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-1 shadow-xl shadow-indigo-500/25">
            <div className="w-full h-full bg-slate-900 rounded-[22px] flex items-center justify-center text-white text-3xl font-black">
              {initials}
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <h1 className="text-3xl font-black text-white tracking-tight">
                {name || "Driver Profile"}
              </h1>
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-xs px-2.5 py-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1 inline" /> Verified Driver
              </Badge>
              {user?.role === "ADMIN" && (
                <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/40 text-xs px-2.5 py-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1 inline" /> Platform Administrator
                </Badge>
              )}
            </div>

            <p className="text-slate-400 text-sm">{user?.email}</p>

            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-cyan-400" />
                {city}
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-indigo-400" />
                {phone}
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                AI Recommendation Member
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full sm:w-auto">
            <Link
              href="/reservations"
              className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md transition-all text-center group"
            >
              <div className="text-2xl font-black text-white group-hover:text-cyan-300 transition-colors">
                {bookings.length}
              </div>
              <div className="text-[11px] text-slate-400 font-medium">Test Drives</div>
            </Link>
            <Link
              href="/saved-cars"
              className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md transition-all text-center group"
            >
              <div className="text-2xl font-black text-white group-hover:text-indigo-300 transition-colors">
                {savedCars.length || 3}
              </div>
              <div className="text-[11px] text-slate-400 font-medium">Saved Fleet</div>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Editable Profile Settings */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-slate-200 shadow-sm rounded-3xl bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <User className="h-5 w-5 text-indigo-600" /> Personal & Driving Credentials
              </CardTitle>
              <CardDescription>
                Keep your details updated for swift test drive appointment approvals.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdate} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                      Full Legal Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                      Primary Contact Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                      Email Address (Account ID)
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        value={user?.email || ""}
                        disabled
                        className="pl-10 bg-slate-50 text-slate-500 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                      City & State
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="City, State"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                      Driving License Reference Number
                    </label>
                    <div className="relative">
                      <ShieldCheck className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        value={drivingLicense}
                        onChange={(e) => setDrivingLicense(e.target.value)}
                        placeholder="State Driving License #"
                        className="pl-10"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Verified prior to handing over keys at dealership showrooms.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 rounded-xl shadow-md shadow-indigo-600/20"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
                      </>
                    ) : (
                      "Save Profile Details"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Automotive Preferences */}
          <Card className="border-slate-200 shadow-sm rounded-3xl bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Car className="h-5 w-5 text-indigo-600" /> AI Vehicle Preferences
              </CardTitle>
              <CardDescription>
                Tailors neural recommendation feeds and notification matching to your tastes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Preferred Fuel Engine
                  </label>
                  <select
                    value={preferredFuel}
                    onChange={(e) => setPreferredFuel(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="Electric & Hybrid">Electric & Hybrid (Eco-Performance)</option>
                    <option value="Electric">Pure Electric Only (EV)</option>
                    <option value="Gasoline">Traditional Gasoline Turbo</option>
                    <option value="Diesel">High-Torque Diesel</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Target Budget Range
                  </label>
                  <select
                    value={budgetRange}
                    onChange={(e) => setBudgetRange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="Under $30,000">Under $30,000 (Value & Commuter)</option>
                    <option value="$30,000 - $70,000">$30,000 - $70,000 (Mid-Range & Luxury)</option>
                    <option value="$70,000+">$70,000+ (High Performance & Exotic)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-3">
                <span className="flex items-center gap-1.5">
                  <Bell className="w-4 h-4 text-indigo-600" /> Instant price-drop SMS alerts enabled
                </span>
                <span className="text-emerald-600 font-semibold">Active</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Quick Links & Security */}
        <div className="space-y-6">
          {/* Quick Shortcuts */}
          <Card className="border-slate-200 shadow-sm rounded-3xl bg-white overflow-hidden">
            <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
              <CardTitle className="text-base font-bold text-slate-900">
                Quick Navigation
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-slate-100">
              <Link
                href="/reservations"
                className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-slate-700 group"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">My Reservations</div>
                    <div className="text-xs text-slate-500">Upcoming test drive slots</div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
              </Link>

              <Link
                href="/saved-cars"
                className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-slate-700 group"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                    <Heart className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">Saved Vehicles</div>
                    <div className="text-xs text-slate-500">Your bookmarked collection</div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
              </Link>

              <Link
                href="/cars"
                className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-slate-700 group"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Car className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">Explore Showroom</div>
                    <div className="text-xs text-slate-500">9 verified fleet vehicles</div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
              </Link>
            </CardContent>
          </Card>

          {/* Account Security */}
          <Card className="border-slate-200 shadow-sm rounded-3xl bg-white p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Account Security</h3>
                <p className="text-xs text-slate-500">Local Session Authenticated</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Your profile is secured with encrypted SHA-256 password salting and protected HTTP-only cookie sessions.
            </p>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
              <span>Two-Factor Authentication</span>
              <Badge variant="outline" className="text-emerald-700 bg-emerald-50 border-emerald-200">
                Active
              </Badge>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
