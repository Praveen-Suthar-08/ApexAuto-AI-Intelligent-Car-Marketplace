"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-client";
import {
  Heart,
  Calendar,
  User,
  ArrowRight,
  LogOut,
  LogIn,
  LayoutDashboard,
  Compass,
  ChevronDown,
  Sparkles,
} from "lucide-react";

export function ProfileDropdown({ serverUser }) {
  const router = useRouter();
  const { user: clientUser, isSignedIn, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef(null);
  const dropdownRef = useRef(null);

  const user = clientUser || serverUser;
  const isAdmin = user?.role === "ADMIN";

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleNavigation = (href) => {
    setIsOpen(false);
    router.push(href);
  };

  const initials = (user?.name || user?.email || "U").substring(0, 2).toUpperCase();

  return (
    <div
      ref={dropdownRef}
      className="relative inline-block text-left"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      suppressHydrationWarning
    >
      {/* Profile Trigger Button on Right */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2.5 p-1.5 pl-2.5 pr-3 rounded-full bg-slate-100 hover:bg-slate-200/80 border border-slate-200/90 transition-all duration-200 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        aria-expanded={isOpen}
        suppressHydrationWarning
      >
        <div className="relative">
          <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white font-black text-sm shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            {initials}
          </div>
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
        </div>

        <div className="hidden sm:flex flex-col text-left">
          <span className="text-xs font-bold text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">
            {user?.name ? user.name.split(" ")[0] : "Account"}
          </span>
          <span className="text-[10px] font-medium text-slate-500 leading-tight">
            {isAdmin ? "Admin" : isSignedIn ? "Driver" : "Sign In"}
          </span>
        </div>

        <ChevronDown
          className={`h-4 w-4 text-slate-400 group-hover:text-indigo-600 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Flyout Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-[320px] sm:w-[350px] rounded-3xl bg-white/95 backdrop-blur-2xl shadow-2xl border border-slate-200/80 p-3 z-50 animate-in fade-in zoom-in-95 duration-150 divide-y divide-slate-100">
          {/* User Details Header Card */}
          <div className="p-3.5 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-2xl text-white mb-2 shadow-inner">
            {isSignedIn && user ? (
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white font-black text-base shadow">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-white text-sm truncate">
                      {user.name || "Authenticated Driver"}
                    </p>
                    {isAdmin && (
                      <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
                        Admin
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 truncate">{user.email}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-white text-sm">Guest Explorer</p>
                  <p className="text-xs text-slate-300">Sign in to save cars & book test drives</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleNavigation("/sign-in")}
                  className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs transition-all shadow cursor-pointer"
                >
                  Login
                </button>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <div className="py-2 space-y-1">
            <button
              type="button"
              suppressHydrationWarning
              onClick={() => handleNavigation(isSignedIn ? "/profile" : "/sign-in?redirect=/profile")}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    My Profile
                  </div>
                  <div className="text-xs text-slate-500">
                    License credentials, contact & prefs
                  </div>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
            </button>

            <button
              type="button"
              suppressHydrationWarning
              onClick={() => handleNavigation(isSignedIn ? "/saved-cars" : "/sign-in?redirect=/saved-cars")}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-rose-50/60 transition-colors text-left group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Heart className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
                    Saved Cars
                  </div>
                  <div className="text-xs text-slate-500">
                    Bookmarked fleet collection
                  </div>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-rose-600 transition-colors" />
            </button>

            <button
              type="button"
              suppressHydrationWarning
              onClick={() => handleNavigation(isSignedIn ? "/reservations" : "/sign-in?redirect=/reservations")}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-indigo-50/60 transition-colors text-left group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    My Reservations
                  </div>
                  <div className="text-xs text-slate-500">
                    Upcoming test drive appointments
                  </div>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
            </button>

            <button
              type="button"
              suppressHydrationWarning
              onClick={() => handleNavigation("/cars")}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Compass className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    Browse All Cars
                  </div>
                  <div className="text-xs text-slate-500">
                    Explore entire vehicle inventory
                  </div>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
            </button>

            {isAdmin && (
              <button
                type="button"
                suppressHydrationWarning
                onClick={() => handleNavigation("/admin")}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-purple-50/60 transition-colors text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <LayoutDashboard className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-purple-900 group-hover:text-purple-600 transition-colors">
                      Admin Portal
                    </div>
                    <div className="text-xs text-purple-600">
                      Manage fleet listings & dealership
                    </div>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-purple-400 group-hover:text-purple-600 transition-colors" />
              </button>
            )}
          </div>

          {/* Quick Sign In / Sign Out Footer */}
          <div className="pt-2 px-1 flex items-center justify-end text-xs">
            {isSignedIn ? (
              <button
                type="button"
                suppressHydrationWarning
                onClick={() => {
                  setIsOpen(false);
                  signOut();
                }}
                className="text-rose-600 hover:text-rose-700 font-semibold py-1 px-3 rounded-lg hover:bg-rose-50 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign Out
              </button>
            ) : (
              <button
                type="button"
                suppressHydrationWarning
                onClick={() => handleNavigation("/sign-in")}
                className="text-indigo-600 hover:text-indigo-700 font-bold py-1 px-3 rounded-lg hover:bg-indigo-50 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <LogIn className="h-3.5 w-3.5" />
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
