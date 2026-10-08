"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { loginAction } from "@/actions/auth-actions";
import { Button } from "@/components/ui/button";
import { Loader2, Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);

      const res = await loginAction(formData);

      if (res?.success) {
        toast.success("Welcome back!");
        router.refresh();
        router.push(redirectUrl);
      } else {
        toast.error(res?.error || "Login failed. Please check credentials.");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail, demoRole) => {
    setEmail(demoEmail);
    setPassword("password123");
    setLoading(true);
    const formData = new FormData();
    formData.append("email", demoEmail);
    formData.append("password", "password123");
    const res = await loginAction(formData);
    if (res?.success) {
      toast.success(`Logged in as ${demoRole}!`);
      router.refresh();
      router.push(redirectUrl);
    } else {
      toast.error("Demo login error");
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-md p-8 bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-2xl">
      <div className="text-center mb-8">
        <div className="inline-flex h-12 w-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/25 mb-3">
          A
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Welcome to ApexAuto AI
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Sign in to access your test drives and wishlist
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      {/* Quick Demo Credentials */}
      <div className="mt-6 pt-6 border-t border-slate-100 space-y-2">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider text-center mb-2">
          ⚡ One-Click Demo Access
        </p>
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleDemoLogin("admin@apexauto.ai", "Admin")}
            className="text-xs font-medium border-slate-200 hover:bg-slate-50 text-slate-700"
          >
            <ShieldCheck className="h-3.5 w-3.5 mr-1 text-indigo-600" /> Admin Demo
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleDemoLogin("demo@user.com", "User")}
            className="text-xs font-medium border-slate-200 hover:bg-slate-50 text-slate-700"
          >
            User Demo
          </Button>
        </div>
      </div>

      <div className="mt-6 text-center text-xs text-slate-500">
        Don&apos;t have an account?{" "}
        <Link
          href={`/sign-up?redirect=${encodeURIComponent(redirectUrl)}`}
          className="font-bold text-blue-600 hover:underline"
        >
          Create Account
        </Link>
      </div>
    </div>
  );
}
