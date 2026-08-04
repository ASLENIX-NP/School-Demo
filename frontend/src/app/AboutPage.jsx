import { Link } from "react-router-dom";
import { ArrowLeft, Award, CheckCircle2, ShieldCheck, Heart, Sparkles, BookOpen, Users, Target, Compass } from "lucide-react";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">

      <Header />

      <main className="flex-1 pt-28 pb-20">
        {/* Hero Banner for About */}
        <section className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white py-16 px-5 sm:px-8 border-b border-slate-800 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-red-600/20 blur-3xl pointer-events-none rounded-full" />
          <div className="max-w-[1450px] mx-auto relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-red-400 bg-red-950/80 border border-red-800/60 mb-4">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>About Smriti School</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
              Rooted in Care. Ready for Tomorrow.
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mt-4 font-medium leading-relaxed">
              Empowering students in Nepal through academic excellence, moral values, digital computer literacy, and holistic character building since establishment.
            </p>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="py-16 max-w-[1450px] mx-auto px-5 sm:px-8">
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="rounded-3xl p-8 bg-white border border-slate-200 shadow-lg hover:border-red-500 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-6 font-bold">
                <Target className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-slate-950 mb-3" style={{ fontFamily: "var(--font-display)" }}>
                Our Vision
              </h2>
              <p className="text-slate-600 text-base leading-relaxed font-medium">
                To be a premier learning center in Nepal where every student discovers their innate potential, masters modern digital tools, and develops into a compassionate, responsible leader of society.
              </p>
            </div>

            <div className="rounded-3xl p-8 bg-white border border-slate-200 shadow-lg hover:border-blue-500 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6 font-bold">
                <Compass className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-slate-950 mb-3" style={{ fontFamily: "var(--font-display)" }}>
                Our Mission
              </h2>
              <p className="text-slate-600 text-base leading-relaxed font-medium">
                Providing high-quality education from Play Group to Grade 10 by integrating NEB academic standards, hands-on science practicals, athletics, digital computer labs, and ethical values.
              </p>
            </div>
          </div>

          {/* Principal's Message */}
          <div className="rounded-3xl p-8 sm:p-12 bg-slate-900 text-white shadow-2xl border border-slate-800 grid lg:grid-cols-[0.8fr_1.2fr] gap-10 items-center mb-16">
            <div className="relative rounded-2xl overflow-hidden h-80 bg-slate-800 border border-slate-700">
              <img
                src="https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&fit=crop&q=80"
                alt="Principal"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <div className="text-lg font-black">Principal's Desk</div>
                <div className="text-xs text-red-400 font-bold">Smriti Secondary School</div>
              </div>
            </div>

            <div>
              <span className="text-xs font-black uppercase text-red-400 bg-red-950/80 px-3 py-1 rounded-full border border-red-800/60 inline-block mb-3">
                Message From Principal
              </span>
              <h3 className="text-3xl font-black text-white mb-4" style={{ fontFamily: "var(--font-display)" }}>
                Welcome to Smriti Secondary School
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4">
                "At Smriti School, we believe education is not merely about memorizing textbooks, but about nurturing curious minds, strong character, and practical life skills. Our dedicated faculty members ensure every child feels safe, recognized, and motivated."
              </p>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                "We welcome parents to join our vibrant academic family as we continue our journey of educational excellence."
              </p>
            </div>
          </div>

          {/* Core Values */}
          <div>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-black text-slate-950" style={{ fontFamily: "var(--font-display)" }}>
                Our Core Values
              </h2>
              <p className="text-slate-600 mt-2">The principles that guide our everyday teaching and school culture.</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Academic Integrity", desc: "Instilling honesty, discipline, and high standards in studies.", color: "#EF4444" },
                { title: "Digital Innovation", desc: "Preparing students with computer literacy for tomorrow's technology.", color: "#2563EB" },
                { title: "Inclusivity & Care", desc: "Creating a welcoming environment where every student thrives.", color: "#38BDF8" },
                { title: "Excellence & Leadership", desc: "Encouraging sportsmanship, arts, and confidence in public speaking.", color: "#DC2626" },
              ].map((val, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-md">
                  <div className="w-10 h-1.5 rounded-full mb-4" style={{ background: val.color }} />
                  <h4 className="text-lg font-bold text-slate-950 mb-2">{val.title}</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">{val.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
