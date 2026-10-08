import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { AuthProvider } from "@/lib/auth-client";
import { getCurrentUser } from "@/lib/auth-service";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ApexAuto AI | Intelligent Car Marketplace & Test Drive Platform",
  description:
    "AI-powered automotive discovery engine. Search vehicles visually, explore verified dealership inventories, and schedule test drives seamlessly.",
};

export default async function RootLayout({ children }) {
  const user = await getCurrentUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo-white.png" sizes="any" />
      </head>
      <body suppressHydrationWarning className={`${inter.className} antialiased bg-slate-50/50 text-slate-900 selection:bg-indigo-500 selection:text-white`}>
        <AuthProvider initialUser={user}>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Toaster richColors position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}

