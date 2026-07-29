import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Award, ArrowUp, UserCheck, Heart, ChevronRight } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-slate-950 text-slate-300 pt-10 pb-6 sm:pt-16 sm:pb-8 border-t border-slate-800 relative overflow-hidden">
      <div className="max-w-[1450px] mx-auto px-4 sm:px-8">
        {/* 2-column grid on mobile, 4-column grid on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10 mb-8 sm:mb-16">
          {/* Brand Column (Span 2 cols on mobile) */}
          <div className="col-span-2 md:col-span-1 space-y-3 sm:space-y-4">
            <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-red-600 to-blue-600 p-0.5">
                <div className="w-full h-full bg-slate-950 rounded-[10px] sm:rounded-[14px] flex items-center justify-center text-white font-black text-xs sm:text-base tracking-tighter">
                  SS
                </div>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-white leading-none" style={{ fontFamily: "var(--font-display)" }}>
                  Smriti <span className="text-red-500">School</span>
                </h3>
                <small className="text-[9px] sm:text-[10px] font-bold tracking-wider uppercase text-slate-400 block mt-0.5 sm:mt-1">
                  Secondary English School
                </small>
              </div>
            </Link>

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              Smriti Secondary School combines academic discipline, digital innovation, practical science, and character building from PG to Grade 10.
            </p>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold text-red-300 bg-red-950/70 border border-red-800/60">
              <Award className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-400" />
              <span>Learn • Grow • Lead</span>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="col-span-1">
            <h4 className="text-xs sm:text-base font-black text-white mb-2.5 sm:mb-4 uppercase tracking-wider text-[10px] sm:text-xs">
              Quick Pages
            </h4>
            <ul className="space-y-1.5 sm:space-y-2.5 text-xs sm:text-sm">
              {[
                { name: "Home", path: "/" },
                { name: "About Us", path: "/about" },
                { name: "Academics", path: "/academics" },
                { name: "Facilities", path: "/facilities" },
                { name: "Notices", path: "/notices" },
                { name: "Contact", path: "/contact" },
                { name: "Admissions", path: "/admissions" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-slate-400 hover:text-red-400 transition-colors flex items-center gap-1 group"
                  >
                    <ChevronRight className="w-3 h-3 text-blue-500 group-hover:translate-x-0.5 transition-transform" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Academic Divisions Links */}
          <div className="col-span-1">
            <h4 className="text-xs sm:text-base font-black text-white mb-2.5 sm:mb-4 uppercase tracking-wider text-[10px] sm:text-xs">
              Academics
            </h4>
            <ul className="space-y-1.5 sm:space-y-2.5 text-xs sm:text-sm">
              {[
                { name: "Pre-Primary (PG-UKG)", path: "/academics" },
                { name: "Primary (Grade 1-5)", path: "/academics" },
                { name: "Basic (Grade 6-8)", path: "/academics" },
                { name: "Secondary (9-10)", path: "/academics" },
                { name: "SEE Preparation", path: "/academics" },
                { name: "Digital Science Labs", path: "/facilities" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-slate-400 hover:text-sky-400 transition-colors flex items-center gap-1 group"
                  >
                    <ChevronRight className="w-3 h-3 text-red-500 group-hover:translate-x-0.5 transition-transform" />
                    <span className="truncate">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Campus Info & Admin Portal */}
          <div className="col-span-2 md:col-span-1 pt-2 sm:pt-0">
            <h4 className="text-xs sm:text-base font-black text-white mb-2.5 sm:mb-4 uppercase tracking-wider text-[10px] sm:text-xs">
              Campus Info
            </h4>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span>Kathmandu / Hetauda, Nepal</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>+977 01-XXXXXXX / 98XXXXXXXX</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span>info@smritischool.edu.np</span>
              </li>
              <li className="pt-1.5">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[11px] font-bold text-white bg-gradient-to-r from-blue-900 to-slate-900 border border-blue-700/80 hover:border-red-500 transition-all"
                >
                  <UserCheck className="w-3.5 h-3.5 text-sky-400" />
                  <span>Admin Staff Portal ↗</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 sm:pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] sm:text-xs text-slate-400 text-center sm:text-left">
          <p>© {new Date().getFullYear()} Smriti Secondary English School.</p>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> for Smriti School
            </span>

            <button
              type="button"
              onClick={scrollToTop}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-900 hover:bg-red-600 border border-slate-700 flex items-center justify-center text-white transition-colors"
              title="Back to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
