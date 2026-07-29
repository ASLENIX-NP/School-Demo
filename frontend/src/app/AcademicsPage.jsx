import { Link } from "react-router-dom";
import { BookOpen, Laptop, Beaker, Trophy, Compass, CheckCircle2, Award, Sparkles } from "lucide-react";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function AcademicsPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Header />

      <main className="flex-1 pt-28 pb-20">
        {/* Banner */}
        <section className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white py-16 px-5 sm:px-8 border-b border-slate-800 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-600/20 blur-3xl pointer-events-none rounded-full" />
          <div className="max-w-[1450px] mx-auto relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-red-400 bg-red-950/80 border border-red-800/60 mb-4">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Academics at Smriti School</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
              Comprehensive Curriculum (PG to Grade 10)
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mt-4 font-medium leading-relaxed">
              Designed around NEB standards to foster analytical thinking, practical science experience, digital computer skills, and SEE board success.
            </p>
          </div>
        </section>

        {/* Academic Levels Breakdown */}
        <section className="py-16 max-w-[1450px] mx-auto px-5 sm:px-8">
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="rounded-3xl p-8 bg-white border border-slate-200 shadow-lg hover:border-red-500 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-6 font-bold">
                <Compass className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-slate-950 mb-2" style={{ fontFamily: "var(--font-display)" }}>
                Early Childhood Division (PG - UKG)
              </h2>
              <span className="text-xs font-black uppercase text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200 inline-block mb-4">
                Play Group, Nursery, LKG, UKG
              </span>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Activity-based learning designed to awaken curiosity, develop motor skills, build English vocabulary, and foster early social interaction.
              </p>
              <ul className="space-y-2 text-xs font-bold text-slate-700 border-t border-slate-100 pt-4">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> Child-safe creative play environment</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> Phonics & early numeracy games</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> Rhymes, storytelling & music</li>
              </ul>
            </div>

            <div className="rounded-3xl p-8 bg-white border border-slate-200 shadow-lg hover:border-blue-500 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6 font-bold">
                <BookOpen className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-slate-950 mb-2" style={{ fontFamily: "var(--font-display)" }}>
                Primary Division (Grade 1 - 5)
              </h2>
              <span className="text-xs font-black uppercase text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 inline-block mb-4">
                Grade 1 to Grade 5
              </span>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Strengthening mathematical, language, environmental science, and digital literacy skills under English medium instruction.
              </p>
              <ul className="space-y-2 text-xs font-bold text-slate-700 border-t border-slate-100 pt-4">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-red-600" /> English, Math, Science & Nepali core</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-red-600" /> Computer lab hands-on practicals</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-red-600" /> Moral education & discipline</li>
              </ul>
            </div>

            <div className="rounded-3xl p-8 bg-white border border-slate-200 shadow-lg hover:border-red-500 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-6 font-bold">
                <Beaker className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-slate-950 mb-2" style={{ fontFamily: "var(--font-display)" }}>
                Lower Secondary (Grade 6 - 8)
              </h2>
              <span className="text-xs font-black uppercase text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200 inline-block mb-4">
                Basic Level Education
              </span>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Transitioning students into analytical science laboratory experiments, computer programming basics, and sports competitions.
              </p>
              <ul className="space-y-2 text-xs font-bold text-slate-700 border-t border-slate-100 pt-4">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> Physics, Chem & Biology practicals</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> Computer IT skills & office tools</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> Quiz clubs & athletics competitions</li>
              </ul>
            </div>

            <div className="rounded-3xl p-8 bg-white border border-slate-200 shadow-lg hover:border-blue-500 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6 font-bold">
                <Trophy className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-slate-950 mb-2" style={{ fontFamily: "var(--font-display)" }}>
                Secondary Division (Grade 9 - 10)
              </h2>
              <span className="text-xs font-black uppercase text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 inline-block mb-4">
                SEE Board Examination Prep
              </span>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Focused SEE board examination preparation under NEB guidelines with weekly mock tests, revision series, and GPA 4.00 targets.
              </p>
              <ul className="space-y-2 text-xs font-bold text-slate-700 border-t border-slate-100 pt-4">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-red-600" /> Intensive SEE mock test series</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-red-600" /> One-on-one academic mentoring</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-red-600" /> Stream & career guidance post SEE</li>
              </ul>
            </div>
          </div>

          <div className="text-center">
            <Link
              to="/admissions"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-white bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-500 hover:to-blue-500 shadow-xl hover:scale-105 transition-transform"
            >
              <span>Enroll for Academic Session 2083</span>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
