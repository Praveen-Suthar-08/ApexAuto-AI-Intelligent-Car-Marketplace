"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { logoutAction } from "@/actions/auth-actions";

const AuthContext = createContext({
  user: null,
  isSignedIn: false,
  isLoaded: true,
  signOut: async () => {},
});

export const AuthProvider = ({ initialUser = null, children }) => {
  const [user, setUser] = useState(initialUser);
  const router = useRouter();

  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);

  const signOut = async () => {
    await logoutAction();
    setUser(null);
    router.refresh();
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userId: user?.clerkUserId || user?.id || null,
        isSignedIn: !!user,
        isLoaded: true,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};

export const useUser = () => {
  const { user, isLoaded, isSignedIn } = useContext(AuthContext);
  return { user, isLoaded, isSignedIn };
};

export const SignedIn = ({ children }) => {
  const { isSignedIn } = useContext(AuthContext);
  if (!isSignedIn) return null;
  return <>{children}</>;
};

export const SignedOut = ({ children }) => {
  const { isSignedIn } = useContext(AuthContext);
  if (isSignedIn) return null;
  return <>{children}</>;
};

export const UserButton = ({ appearance }) => {
  const { user, signOut } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const initials = (user.name || user.email || "U")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="relative inline-block text-left" suppressHydrationWarning>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-md ring-2 ring-white">
          {initials}
        </div>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-xl ring-1 ring-black/5 z-50 p-2 divide-y divide-slate-100 animate-in fade-in zoom-in-95 duration-100">
            <div className="px-3 py-2.5">
              <p className="text-sm font-semibold text-slate-800 truncate">
                {user.name || "User"}
              </p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
              <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
                {user.role || "USER"}
              </span>
            </div>
            <div className="py-1">
              <a
                href="/profile"
                onClick={() => setIsOpen(false)}
                className="block w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 rounded-lg transition-colors"
              >
                My Profile & Preferences
              </a>
              <a
                href="/reservations"
                onClick={() => setIsOpen(false)}
                className="block w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 rounded-lg transition-colors"
              >
                My Reservations
              </a>
              <a
                href="/saved-cars"
                onClick={() => setIsOpen(false)}
                className="block w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 rounded-lg transition-colors"
              >
                Saved Vehicles
              </a>
            </div>
            <div className="pt-1.5">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  signOut();
                }}
                className="w-full text-left px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export const SignInButton = ({ children, forceRedirectUrl = "/" }) => {
  return (
    <a href={`/sign-in?redirect=${encodeURIComponent(forceRedirectUrl)}`}>
      {children}
    </a>
  );
};

export const SignOutButton = ({ children }) => {
  const { signOut } = useContext(AuthContext);
  return (
    <span onClick={signOut} className="cursor-pointer inline-flex">
      {children}
    </span>
  );
};
