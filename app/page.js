import { ChevronRight, Car, Calendar, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SignedOut } from "@/lib/auth-client";
import { getFeaturedCars } from "@/actions/home";
import { CarCard } from "@/components/car-card";
import { HomeSearch } from "@/components/home-search";
import Link from "next/link";
import Image from "next/image";
import { bodyTypes, carMakes, faqItems } from "@/lib/data";
import { Footer } from "@/components/footer";

export default async function Home() {
  const featuredCars = await getFeaturedCars(6);

  return (
    <div className="flex flex-col pt-16">
      {/* Hero Section with Cosmic Dotted Mesh Background */}
      <section className="relative py-20 md:py-32 dotted-background overflow-hidden w-full">
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-[500px] h-[300px] bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-6 backdrop-blur-md shadow-lg">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            Gemini Vision 2.0 Powered Car Discovery
          </div>

          <div className="mb-10">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tight mb-6 leading-[1.08]">
              Discover & Book Your <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
                Dream Drive With AI
              </span>
            </h1>
            <p className="text-lg md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed font-light">
              Experience the next frontier of automotive shopping. Snap a car photo or search our verified collection for instant test drive scheduling.
            </p>

            {/* Platform Highlights / Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-10 text-slate-200">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors">
                <div className="text-2xl md:text-3xl font-black text-white">12,500+</div>
                <div className="text-xs md:text-sm text-slate-400 font-medium">Verified Vehicles</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors">
                <div className="text-2xl md:text-3xl font-black text-cyan-300">99.4%</div>
                <div className="text-xs md:text-sm text-slate-400 font-medium">AI Recognition</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors">
                <div className="text-2xl md:text-3xl font-black text-indigo-300">Instant</div>
                <div className="text-xs md:text-sm text-slate-400 font-medium">Test Booking</div>
              </div>
            </div>
          </div>

          {/* Search Component (Client) */}
          <HomeSearch />
        </div>
      </section>

      {/* Featured Cars Section */}
      <section className="py-20 bg-slate-50/60 w-full">
        <div className="w-full max-w-[1750px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 mb-10">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
                Handpicked Selection
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Featured Fleet Listings
              </h2>
            </div>
            <Button variant="ghost" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 font-semibold self-start sm:self-auto" asChild>
              <Link href="/cars" className="flex items-center gap-1 text-base">
                Explore Full Inventory <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
            {featuredCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </div>
      </section>

      {/* Browse by Make Section */}
      <section className="py-20 bg-white border-y border-slate-100 w-full">
        <div className="w-full max-w-[1750px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 mb-10">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
                Leading Automotive Brands
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Browse By Manufacturer
              </h2>
            </div>
            <Button variant="ghost" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 font-semibold self-start sm:self-auto" asChild>
              <Link href="/cars" className="flex items-center gap-1 text-base">
                All Brands <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {carMakes.map((make) => (
              <Link
                key={make.name}
                href={`/cars?make=${make.name}`}
                className="group relative bg-slate-50 hover:bg-white rounded-2xl p-6 text-center border border-slate-200/80 hover:border-indigo-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center"
              >
                <div className="h-16 w-20 mx-auto mb-3 relative flex items-center justify-center">
                  <Image
                    src={
                      make.imageUrl || `/make/${make.name.toLowerCase()}.webp`
                    }
                    alt={make.name}
                    fill
                    sizes="80px"
                    style={{ objectFit: "contain" }}
                    className="group-hover:scale-110 transition-transform duration-300 filter drop-shadow-sm"
                  />
                </div>
                <h3 className="font-bold text-slate-800 group-hover:text-indigo-600 text-sm">
                  {make.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us - Upgraded Glass Cards */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white w-full">
        <div className="w-full max-w-[1750px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
              Why Choose ApexAuto AI
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
              Engineered for Modern Car Buyers
            </h2>
            <p className="text-slate-600 text-base md:text-lg">
              Say goodbye to frustrating car hunting. We blend cutting-edge computer vision with verified inventory and verified dealers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group">
              <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-2xl w-14 h-14 flex items-center justify-center mb-6 shadow-lg shadow-indigo-600/25 group-hover:scale-110 transition-transform">
                <Car className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                Verified Multi-Point Fleet
              </h3>
              <p className="text-slate-600 text-base leading-relaxed">
                Every vehicle listed passes stringent structural and mechanical safety audits before being published.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group">
              <div className="bg-gradient-to-tr from-indigo-600 to-purple-600 text-white rounded-2xl w-14 h-14 flex items-center justify-center mb-6 shadow-lg shadow-purple-600/25 group-hover:scale-110 transition-transform">
                <Calendar className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                Instant Test Drive Booking
              </h3>
              <p className="text-slate-600 text-base leading-relaxed">
                Pick your preferred time slot in seconds. Receive instant confirmations with zero tedious phone calls.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group">
              <div className="bg-gradient-to-tr from-cyan-600 to-blue-600 text-white rounded-2xl w-14 h-14 flex items-center justify-center mb-6 shadow-lg shadow-blue-600/25 group-hover:scale-110 transition-transform">
                <Shield className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                ArcJet Rate & Bot Protection
              </h3>
              <p className="text-slate-600 text-base leading-relaxed">
                Enterprise security guardrails protect user reservations, prevent fraud, and safeguard your sensitive credentials.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Browse by Body Type */}
      <section className="py-20 bg-slate-50 border-t border-slate-100 w-full">
        <div className="w-full max-w-[1750px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 mb-10">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
                Categories
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Explore Vehicle Body Styles
              </h2>
            </div>
            <Button variant="ghost" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 font-semibold self-start sm:self-auto" asChild>
              <Link href="/cars" className="flex items-center gap-1 text-base">
                View All Categories <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {bodyTypes.map((type) => (
              <Link
                key={type.name}
                href={`/cars?bodyType=${type.name}`}
                className="relative group rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 border border-slate-200/60"
              >
                <div className="overflow-hidden h-52 relative bg-slate-800">
                  <Image
                    src={
                      type.imageUrl || `/body/${type.name.toLowerCase()}.webp`
                    }
                    alt={type.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent flex items-end p-6">
                    <div>
                      <span className="text-xs text-indigo-300 font-semibold uppercase tracking-wider block">Class</span>
                      <h3 className="text-white text-2xl font-bold">
                        {type.name}
                      </h3>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section with Accordion */}
      <section className="py-24 bg-white w-full">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
              Got Questions?
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqItems.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border border-slate-200 rounded-2xl px-5 data-[state=open]:border-indigo-300 data-[state=open]:bg-slate-50/50 transition-all">
                <AccordionTrigger className="text-left font-semibold text-slate-800 hover:text-indigo-600 hover:no-underline py-5 text-base md:text-lg">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 text-sm md:text-base leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 dotted-background text-white relative overflow-hidden w-full">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-6 backdrop-blur-md">
            🚀 Ready to Roll?
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold mb-6 tracking-tight">
            Find Your Dream Vehicle in Minutes
          </h2>
          <p className="text-base sm:text-lg text-slate-300 mb-10 max-w-xl mx-auto font-light leading-relaxed">
            Join thousands of satisfied drivers who found and booked their ideal cars through our intelligent AI platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="bg-white hover:bg-slate-100 text-slate-900 font-bold px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all" asChild>
              <Link href="/cars">Explore All Cars</Link>
            </Button>
            <SignedOut>
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-6 rounded-xl shadow-lg shadow-indigo-600/30 transition-all" asChild>
                <Link href="/sign-up">Create Free Account</Link>
              </Button>
            </SignedOut>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
