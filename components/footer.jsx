import React from "react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-gradient-to-b from-slate-900 to-slate-950 text-slate-300 pt-16 pb-12 w-full">
      <div className="w-full max-w-[1750px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-500/20">
                A
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Apex<span className="text-cyan-400">Auto</span>{" "}
                <span className="text-xs uppercase px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                  AI
                </span>
              </span>
            </div>
            <p className="text-slate-400 text-sm max-w-md leading-relaxed">
              Next-generation intelligent vehicle marketplace. Leveraging Gemini AI
              computer vision to match dream cars with visual precision and
              real-time scheduling.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                ArcJet Protected
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700">
                ⚡ Gemini Vision AI
              </span>
            </div>
          </div>

          {/* Quick Nav */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <a href="/cars" className="hover:text-white transition-colors">
                  Browse Inventory
                </a>
              </li>
              <li>
                <a
                  href="/cars?bodyType=SUV"
                  className="hover:text-white transition-colors"
                >
                  Popular SUVs
                </a>
              </li>
              <li>
                <a
                  href="/saved-cars"
                  className="hover:text-white transition-colors"
                >
                  Saved Vehicles
                </a>
              </li>
              <li>
                <a
                  href="/reservations"
                  className="hover:text-white transition-colors"
                >
                  Test Drive Bookings
                </a>
              </li>
            </ul>
          </div>

          {/* Author & Repo */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Project Info
            </h4>
            <p className="text-sm text-slate-400 mb-3">
              Architected & Developed by{" "}
              <strong className="text-slate-200">Praveen Suthar</strong>.
            </p>
            <a
              href="https://github.com/Praveen-Suthar-08/ApexAuto-AI-Intelligent-Car-MarketPlace.git"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-medium transition-all border border-slate-700 hover:border-slate-600 group"
            >
              <svg
                className="h-4 w-4 fill-current group-hover:scale-110 transition-transform"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
              GitHub Repository
            </a>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} ApexAuto AI Marketplace. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with Next.js 15, Prisma & Supabase • Author:{" "}
            <span className="text-slate-300 font-semibold">Praveen Suthar</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
