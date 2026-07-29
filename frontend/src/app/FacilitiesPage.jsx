import { Link } from "react-router-dom";
import { Laptop, Beaker, BookOpen, Trophy, Bus, Coffee, Sparkles } from "lucide-react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Facilities from "./components/Facilities";

export default function FacilitiesPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Header />

      <main className="flex-1 pt-28 pb-20">
        {/* Banner */}
        <section className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white py-16 px-5 sm:px-8 border-b border-slate-800 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-red-600/20 blur-3xl pointer-events-none rounded-full" />
          <div className="max-w-[1450px] mx-auto relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-red-400 bg-red-950/80 border border-red-800/60 mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Campus Facilities</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
              Modern Campus Infrastructure
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mt-4 font-medium leading-relaxed">
              Discover the digital computer labs, science practical rooms, library resources, and sports arenas built for Smriti School students.
            </p>
          </div>
        </section>

        {/* Facilities Component */}
        <Facilities />
      </main>

      <Footer />
    </div>
  );
}
