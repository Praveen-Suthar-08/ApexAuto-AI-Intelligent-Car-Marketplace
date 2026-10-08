import React from "react";
import Link from "next/link";
import { checkUser } from "@/lib/checkUser";
import { ProfileDropdown } from "./profile-dropdown";

const Header = async ({ isAdminPage = false }) => {
  const user = await checkUser();

  return (
    <header className="fixed top-0 w-full bg-white/80 backdrop-blur-xl z-50 border-b border-slate-200/70 shadow-xs transition-all">
      <nav className="max-w-[1750px] mx-auto px-4 sm:px-8 lg:px-12 py-3 flex items-center justify-between">
        {/* Normal Website Logo on the Left */}
        <Link href={isAdminPage ? "/admin" : "/"} className="flex items-center gap-2.5 group">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white font-black text-xl shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            A
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
              Apex<span className="text-cyan-600">Auto</span>
            </span>
            <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase -mt-0.5">
              AI Marketplace
            </span>
          </div>
          {isAdminPage && (
            <span className="ml-2 text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-slate-900 text-white tracking-wider">
              Admin
            </span>
          )}
        </Link>

        {/* Right Side: Profile Dropdown with all details on click/hover */}
        <div className="flex items-center gap-4">
          <ProfileDropdown serverUser={user} />
        </div>
      </nav>
    </header>
  );
};

export default Header;
