import { BookOpen, Laptop, Beaker, Trophy, Compass, CheckCircle2 } from "lucide-react";

const academicLevels = [
  {
    icon: Compass,
    title: "Early Childhood (PG - UKG)",
    tag: "Ages 3 - 6",
    color: "#EF4444",
    description: "Activity-based experiential learning building curiosity, language skills, confidence, and early literacy in a warm, child-safe environment.",
    features: ["Play-based learning", "Phonics & vocabulary", "Creative arts & rhythm", "Child-safe play zone"]
  },
  {
    icon: BookOpen,
    title: "Primary Level (Grade 1 - 5)",
    tag: "Grade 1 to 5",
    color: "#2563EB",
    description: "Building strong foundational mathematics, English language proficiency, environmental science, and moral values.",
    features: ["English medium instruction", "Computer lab basics", "Environmental science", "Character & ethics"]
  },
  {
    icon: Beaker,
    title: "Basic / Lower Secondary (Grade 6 - 8)",
    tag: "Grade 6 to 8",
    color: "#DC2626",
    description: "Developing analytical problem solving through practical science experiments, digital IT skills, and active school sports.",
    features: ["Science laboratory work", "Digital IT computer lab", "Student clubs & quiz", "Sports & athletics"]
  },
  {
    icon: Trophy,
    title: "Secondary Level (Grade 9 - 10)",
    tag: "SEE Board Prep",
    color: "#1E40AF",
    description: "Rigorous academic preparation under National Examination Board guidelines with mock exams, mentorship, and GPA 4.00 guidance.",
    features: ["NEB aligned SEE syllabus", "Mock test series & feedback", "Career & stream counseling", "Advanced practical labs"]
  }
];

export default function Academics() {
  return (
    <section id="academics" className="py-16 sm:py-24 bg-white relative overflow-hidden">
      <div className="max-w-[1450px] mx-auto px-5 sm:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-red-600 bg-red-50 border border-red-200 mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Academic Distinction</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-950 tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            Academic Programs at Smriti School
          </h2>

          <p className="text-slate-600 text-base sm:text-lg mt-4 leading-relaxed font-medium">
            Empowering students with intellectual discipline, digital tech mastery, and strong values from Play Group to Grade 10.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {academicLevels.map((level) => {
            const Icon = level.icon;
            return (
              <div
                key={level.title}
                className="rounded-3xl p-8 bg-slate-50 border border-slate-200 hover:border-red-500 transition-all duration-300 shadow-md hover:shadow-2xl group"
              >
                <div className="flex items-center justify-between mb-6">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform"
                    style={{ background: level.color }}
                  >
                    <Icon className="w-7 h-7" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-800 shadow-sm">
                    {level.tag}
                  </span>
                </div>

                <h3 className="text-2xl font-black text-slate-950 mb-3" style={{ fontFamily: "var(--font-display)" }}>
                  {level.title}
                </h3>

                <p className="text-slate-600 text-base leading-relaxed mb-6 font-medium">
                  {level.description}
                </p>

                <div className="grid grid-cols-2 gap-3 border-t border-slate-200 pt-6">
                  {level.features.map((feat) => (
                    <div key={feat} className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
