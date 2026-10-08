"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-client";
import {
  Car,
  Heart,
  Calendar,
  User,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  ArrowRight,
  LogOut,
  LogIn,
  SlidersHorizontal,
  LayoutDashboard,
  Compass,
} from "lucide-react";

export function LogoDropdownNav({ user: serverUser, isAdminPage = false }) {
  const router = useRouter();
  const { user: clientUser, isSignedIn, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef(null);
  const dropdownRef = useRef(null);

  // Active user data
  const user = clientUser || serverUser;
  const isAdmin = user?.role === "ADMIN";

  // Hover handlers with small grace delay for natural feeling
  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 220);
  };

  // Close when clicking outside
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

  return (
    <div
      ref={dropdownRef}
      className="relative inline-block text-left"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Interactive Brand Logo Trigger */}
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-3.5 py-1.5 px-3 -ml-3 rounded-2xl cursor-pointer hover:bg-slate-100/80 transition-all duration-200 select-none group"
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
      >
        <div className="relative">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/25 group-hover:scale-105 group-hover:shadow-indigo-500/40 transition-all duration-300">
            A
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-white flex items-center justify-center">
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
          </span>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-2xl font-black tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
              Apex<span className="text-cyan-600">Auto</span>
            </span>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200/60">
              AI
            </span>
            <ChevronDown
              className={`h-4 w-4 text-slate-400 group-hover:text-indigo-600 transition-transform duration-300 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
          <span className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase -mt-0.5">
            Intelligent Fleet Ecosystem
          </span>
        </div>
      </div>

      {/* Flyout Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 mt-2 w-[340px] sm:w-[380px] rounded-3xl bg-white/95 backdrop-blur-2xl shadow-2xl border border-slate-200/80 p-3 z-50 animate-in fade-in zoom-in-95 duration-200 divide-y divide-slate-100">
          {/* User Status / Account Header */}
          <div className="p-3.5 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-2xl text-white mb-2 shadow-inner">
            {isSignedIn && user ? (
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white font-black text-base shadow">
                  {(user.name || user.email || "U").substring(0, 2).toUpperCase()}
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
                  <p className="text-xs text-slate-300">Sign in to sync saved cars & bookings</p>
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

          {/* Core Navigation Items */}
          <div className="py-2 space-y-1">
            <button
              type="button"
              onClick={() => handleNavigation("/cars")}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Compass className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    Explore Inventory
                  </div>
                  <div className="text-xs text-slate-500">
                    Browse all verified cars & filter specs
                  </div>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
            </button>

            <button
              type="button"
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
                    Your bookmarked wishlist & favorites
                  </div>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-rose-600 transition-colors" />
            </button>

            <button
              type="button"
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
                    Manage upcoming test drive time slots
                  </div>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
            </button>

            <button
              type="button"
              onClick={() => handleNavigation(isSignedIn ? "/profile" : "/sign-in?redirect=/profile")}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    Driver Profile & Settings
                  </div>
                  <div className="text-xs text-slate-500">
                    Driving credentials, contact info & prefs
                  </div>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
            </button>

            {isAdmin && (
              <button
                type="button"
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
                      Manage inventory, deals & dealerships
                    </div>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-purple-400 group-hover:text-purple-600 transition-colors" />
              </button>
            )}
          </div>

          {/* Quick Actions / Session Actions */}
          <div className="pt-2 px-1 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => handleNavigation("/")}
              className="text-slate-500 hover:text-indigo-600 font-semibold py-1 px-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Home Page
            </button>

            {isSignedIn ? (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  signOut();
                }}
                className="text-rose-600 hover:text-rose-700 font-semibold py-1 px-2.5 rounded-lg hover:bg-rose-50 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign Out
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleNavigation("/sign-in")}
                className="text-indigo-600 hover:text-indigo-700 font-bold py-1 px-2.5 rounded-lg hover:bg-indigo-50 transition-colors flex items-center gap-1.5 cursor-pointer"
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
