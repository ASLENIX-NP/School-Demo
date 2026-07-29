import { useState } from "react";
import { Bell, Calendar, FileText, ChevronRight, Search, Sparkles, X } from "lucide-react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PdfNoticePreview from "./components/PdfNoticePreview";

const ALL_NOTICES = [
  {
    id: 1,
    title: "Admissions Open for Session 2083 - Smriti School",
    date: "2026-03-01",
    category: "Admission",
    description: "Application forms for new student admission for the academic year 2083 are available online and at the front desk office. Parents can apply from Play Group to Grade 9."
  },
  {
    id: 2,
    title: "SEE Board Examination Routine & Prep Schedule",
    date: "2026-02-24",
    category: "Exam",
    description: "Routine and revision instructions for Grade 10 candidates preparing for the Secondary Education Examination under NEB."
  },
  {
    id: 3,
    title: "Annual Sports Week & Athletics Tournament",
    date: "2026-02-18",
    category: "Event",
    description: "Inter-house athletic competitions, football, basketball, and quiz contests will take place next week at the school sports ground."
  },
  {
    id: 4,
    title: "First Terminal Examination Result Publication",
    date: "2026-01-15",
    category: "Exam",
    description: "Parents are invited to attend the Parent-Teacher meeting for progress report distribution and feedback."
  },
  {
    id: 5,
    title: "Science Fair & Robotics Workshop Registration",
    date: "2025-12-20",
    category: "Event",
    description: "Students from Grade 5 to 10 are invited to submit science projects and models for the upcoming annual science fair."
  }
];

export default function NoticesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedNotice, setSelectedNotice] = useState(null);

  const filteredNotices = ALL_NOTICES.filter((notice) => {
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) || notice.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || notice.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Header />

      <main className="flex-1 pt-28 pb-20">
        {/* Banner */}
        <section className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white py-16 px-5 sm:px-8 border-b border-slate-800 relative overflow-hidden">
          <div className="max-w-[1450px] mx-auto relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-red-400 bg-red-950/80 border border-red-800/60 mb-4">
              <Bell className="w-3.5 h-3.5" />
              <span>School Notice Board</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
              Official Notices & Announcements
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mt-4 font-medium leading-relaxed">
              Stay updated with academic schedules, exam routines, sports events, and admission notices from Smriti Secondary School.
            </p>
          </div>
        </section>

        <section className="py-12 max-w-[1450px] mx-auto px-5 sm:px-8">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
            <div className="flex items-center gap-2 flex-wrap">
              {["All", "Admission", "Exam", "Event"].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-colors ${
                    selectedCategory === cat
                      ? "bg-red-600 text-white shadow-md"
                      : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search notices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          {/* Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotices.map((notice) => (
              <div
                key={notice.id}
                onClick={() => setSelectedNotice(notice)}
                className="rounded-3xl p-6 bg-white border border-slate-200 shadow-md hover:shadow-xl transition-all cursor-pointer group hover:-translate-y-1"
              >
                <div className="flex items-center justify-between text-xs text-blue-600 font-bold mb-3">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-red-500" />
                    {notice.date}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200 text-[10px] uppercase font-black">
                    {notice.category}
                  </span>
                </div>

                <h3 className="text-lg font-black text-slate-950 mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
                  {notice.title}
                </h3>

                <p className="text-slate-600 text-xs leading-relaxed line-clamp-3 mb-4">
                  {notice.description}
                </p>

                <div className="flex items-center gap-1 text-xs font-bold text-red-600 group-hover:translate-x-1 transition-transform">
                  <span>Read Notice</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Modal */}
      {selectedNotice && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl text-slate-900 border border-slate-200">
            <button
              type="button"
              onClick={() => setSelectedNotice(null)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 px-3 py-1 rounded-full inline-block mb-3">
              {selectedNotice.category} Notice
            </span>

            <h3 className="text-2xl font-black text-slate-900 mb-2">
              {selectedNotice.title}
            </h3>

            <p className="text-xs font-bold text-slate-400 mb-6">
              Published: {selectedNotice.date}
            </p>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-6 text-sm text-slate-700 leading-relaxed">
              {selectedNotice.description}
            </div>

            <PdfNoticePreview title={selectedNotice.title} />

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedNotice(null)}
                className="px-6 py-2.5 rounded-xl font-bold bg-slate-950 text-white hover:bg-red-600 transition-colors text-sm"
              >
                Close Notice
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
