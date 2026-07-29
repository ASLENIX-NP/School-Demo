import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, ShieldCheck, ChevronRight } from "lucide-react";

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&fit=crop&q=80",
  "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1200&fit=crop&q=80",
  "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1200&fit=crop&q=80"
];

export function Hero({ editMode = false }) {
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  useEffect(() => {
    if (editMode) return;
    const timer = setInterval(() => {
      setActiveImgIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [editMode]);

  return (
    <section className="relative overflow-hidden pt-28 pb-16 lg:pt-32 lg:pb-24 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white">
      {/* Subtle background ambient glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-r from-blue-600/15 to-red-600/15 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-[1450px] mx-auto px-5 sm:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Left Text Column - Minimal, Classy, Spacious */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/60 border border-red-800/50 text-red-300 text-xs font-black uppercase tracking-wider backdrop-blur-md"
            >
              <Sparkles className="w-3.5 h-3.5 text-red-400" />
              <span>Admissions Open for Academic Session 2083</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Smriti Secondary <br />
              <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-red-400 bg-clip-text text-transparent">
                English School
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 }}
              className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl font-medium"
            >
              A joyful learning community combining academic discipline, digital innovation, science practicals, and moral leadership from Play Group to Grade 10.
            </motion.p>

            {/* Clean Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <Link
                to="/admissions"
                className="px-7 py-3.5 rounded-2xl font-black text-white bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-500 hover:to-blue-500 shadow-xl shadow-red-950/40 hover:scale-105 transition-all duration-300 flex items-center gap-2.5 text-sm sm:text-base"
              >
                <span>Apply For Admission</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/facilities"
                className="px-7 py-3.5 rounded-2xl font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md hover:scale-105 transition-all duration-300 flex items-center gap-2 text-sm sm:text-base"
              >
                <span>Explore Campus</span>
                <ChevronRight className="w-4 h-4 text-sky-400" />
              </Link>
            </motion.div>

            {/* Minimal Stat Bar integrated into copy column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32 }}
              className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-6 max-w-lg"
            >
              <div>
                <div className="text-2xl sm:text-3xl font-black text-white" style={{ fontFamily: "var(--font-display)" }}>
                  20+ Yrs
                </div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                  Excellence
                </div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-black text-white" style={{ fontFamily: "var(--font-display)" }}>
                  PG - 10
                </div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                  Comprehensive
                </div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-black text-white" style={{ fontFamily: "var(--font-display)" }}>
                  99.2%
                </div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                  SEE Success
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Image Showcase Column - Classy, Framed, Clean */}
          <div className="lg:col-span-6 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative mx-auto max-w-lg lg:max-w-none"
            >
              <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl h-[360px] sm:h-[430px] lg:h-[480px]">
                <img
                  key={HERO_IMAGES[activeImgIndex]}
                  src={HERO_IMAGES[activeImgIndex]}
                  alt="Smriti Secondary School Students"
                  className="w-full h-full object-cover transition-opacity duration-700"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                {/* Clean Bottom Label */}
                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white z-10">
                  <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/80 border border-white/20 backdrop-blur-md text-xs font-bold">
                    <ShieldCheck className="w-4 h-4 text-red-500" />
                    <span>Smriti School Campus • Kathmandu / Hetauda</span>
                  </div>

                  {/* Minimal Carousel Dots */}
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/80 border border-white/20 backdrop-blur-md">
                    {HERO_IMAGES.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImgIndex(idx)}
                        className={`h-2 rounded-full transition-all ${
                          activeImgIndex === idx ? "w-5 bg-red-500" : "w-2 bg-white/40"
                        }`}
                        aria-label={`Slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Hero;
