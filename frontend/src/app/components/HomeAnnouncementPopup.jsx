import { useState, useEffect } from "react";
import { X, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function HomeAnnouncementPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const hasSeen = sessionStorage.getItem("announcement_seen");
      if (!hasSeen) {
        setIsOpen(true);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("announcement_seen", "true");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200 overflow-hidden">
        {/* Red & Blue background glows */}
        <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-red-500/20 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-blue-500/20 blur-2xl pointer-events-none" />

        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold text-red-800 bg-red-100 border border-red-200 mb-4">
            <Sparkles className="w-4 h-4 text-red-600" />
            <span>Session 2083 Admissions</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-slate-950 leading-tight mb-3" style={{ fontFamily: "var(--font-display)" }}>
            Welcome to Smriti Secondary School
          </h3>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
            Admissions are officially open for Play Group through Grade 9 for Academic Session 2083. Apply online or visit our campus!
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/admissions"
              onClick={handleClose}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-black text-white bg-gradient-to-r from-red-600 to-blue-600 hover:opacity-95 shadow-lg transition-transform hover:scale-[1.02] text-sm"
            >
              <span>Apply Online Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-3.5 rounded-2xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
