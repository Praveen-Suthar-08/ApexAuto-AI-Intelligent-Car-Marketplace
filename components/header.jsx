import React from "react";
import { Button } from "./ui/button";
import { Heart, CarFront, Layout, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { checkUser } from "@/lib/checkUser";
import Image from "next/image";

const Header = async ({ isAdminPage = false }) => {
  const user = await checkUser();
  const isAdmin = user?.role === "ADMIN";

  return (
    <header className="fixed top-0 w-full bg-white/80 backdrop-blur-xl z-50 border-b border-slate-200/70 shadow-sm transition-all">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        <Link href={isAdminPage ? "/admin" : "/"} className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white font-black shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            A
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-slate-900 leading-none">
              Apex<span className="text-blue-600">Auto</span>
            </span>
            <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase">
              AI Marketplace
            </span>
          </div>
          {isAdminPage && (
            <span className="ml-2 text-[11px] font-semibold uppercase px-2 py-0.5 rounded-md bg-slate-900 text-white tracking-wide">
              Admin
            </span>
          )}
        </Link>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4">
          {isAdminPage ? (
            <>
              <Link href="/">
                <Button variant="outline" className="flex items-center gap-2">
                  <ArrowLeft size={18} />
                  <span>Back to App</span>
                </Button>
              </Link>
            </>
          ) : (
            <SignedIn>
              {!isAdmin && (
                <Link
                  href="/reservations"
                  className="text-gray-600 hover:text-blue-600 flex items-center gap-2"
                >
                  <Button variant="outline">
                    <CarFront size={18} />
                    <span className="hidden md:inline">My Reservations</span>
                  </Button>
                </Link>
              )}
              <a href="/saved-cars">
                <Button className="flex items-center gap-2">
                  <Heart size={18} />
                  <span className="hidden md:inline">Saved Cars</span>
                </Button>
              </a>
              {isAdmin && (
                <Link href="/admin">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Layout size={18} />
                    <span className="hidden md:inline">Admin Portal</span>
                  </Button>
                </Link>
              )}
            </SignedIn>
          )}

          <SignedOut>
            {!isAdminPage && (
              <SignInButton forceRedirectUrl="/">
                <Button variant="outline">Login</Button>
              </SignInButton>
            )}
          </SignedOut>

          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                },
              }}
            />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
};

export default Header;
