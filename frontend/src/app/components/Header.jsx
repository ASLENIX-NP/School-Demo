import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, Mail, MapPin, Sparkles, UserCheck, ArrowRight } from "lucide-react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Academics", path: "/academics" },
    { name: "Facilities", path: "/facilities" },
    { name: "Notices", path: "/notices" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Top contact info bar (Hidden on mobile, visible on tablet & desktop md:block) */}
      <div className={`hidden md:block bg-slate-950 text-slate-300 text-xs py-1.5 px-4 sm:px-8 border-b border-slate-800 transition-all duration-300 ${isScrolled ? "opacity-90" : "opacity-100"}`}>
        <div className="max-w-[1450px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="inline-flex items-center gap-1.5 text-blue-400 whitespace-nowrap">
              <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <span>Kathmandu / Hetauda, Nepal</span>
            </span>

            <span className="text-slate-700">|</span>

            <span className="inline-flex items-center gap-1.5 text-slate-300 whitespace-nowrap">
              <Phone className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>+977 01-XXXXXXX / +977 98XXXXXXXX</span>
            </span>

            <span className="text-slate-700">|</span>

            <span className="inline-flex items-center gap-1.5 text-slate-300 whitespace-nowrap">
              <Mail className="w-3.5 h-3.5 text-red-400 shrink-0" />
              <span>info@smritischool.edu.np</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-300 bg-red-950/80 px-2.5 py-0.5 rounded-full border border-red-800/60 whitespace-nowrap">
              <Sparkles className="w-3 h-3 text-red-400" />
              Admissions Open 2083
            </span>
            <Link
              to="/login"
              className="text-xs font-bold text-blue-300 hover:text-white transition-colors flex items-center gap-1 whitespace-nowrap"
            >
              <UserCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Admin Portal ↗</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <div
        className={`transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-xl shadow-lg border-b border-slate-200/80 py-2.5"
            : "bg-white/90 backdrop-blur-md py-3 sm:py-4 border-b border-slate-100"
        }`}
      >
        <div className="max-w-[1450px] mx-auto px-4 sm:px-8 flex items-center justify-between">
          {/* Logo brand */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-red-600 via-blue-600 to-red-500 p-0.5 shadow-md transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-white font-black text-sm sm:text-lg tracking-tighter">
                SS
              </div>
            </div>
            <div>
              <div className="text-base sm:text-xl font-black leading-none text-slate-950 flex items-center gap-1" style={{ fontFamily: "var(--font-display)" }}>
                <span>Smriti</span>
                <span className="text-red-600 font-extrabold">School</span>
              </div>
              <small className="text-[9px] sm:text-[10px] font-bold tracking-widest uppercase text-slate-500 block mt-0.5 sm:mt-1">
                Learn • Grow • Lead
              </small>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-bold transition-colors relative py-1 group ${
                    isActive ? "text-red-600 font-black" : "text-slate-700 hover:text-red-600"
                  }`}
                >
                  {link.name}
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-red-600 to-blue-600 transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Action buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              to="/admissions"
              className="px-5 py-2.5 rounded-xl font-black text-white bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-500 hover:to-blue-500 shadow-md shadow-red-950/20 transition-all duration-300 hover:scale-105 text-xs sm:text-sm"
            >
              <span className="flex items-center gap-1.5">
                <span>Apply Now</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>

          {/* Mobile menu hamburger toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[62px] bg-white/98 backdrop-blur-2xl border-b border-slate-200 p-6 shadow-2xl z-50 animate-fadeIn">
          <nav className="flex flex-col gap-4 mb-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-base font-bold transition-colors py-2 border-b border-slate-100 ${
                  location.pathname === link.path ? "text-red-600" : "text-slate-800 hover:text-red-600"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-3">
            <Link
              to="/admissions"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-3.5 rounded-xl font-black text-white bg-gradient-to-r from-red-600 to-blue-600 text-sm shadow-md"
            >
              Start Admission Process
            </Link>
            
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-3 rounded-xl font-bold text-slate-800 bg-slate-100 text-xs border border-slate-200 flex items-center justify-center gap-2"
            >
              <UserCheck className="w-4 h-4 text-blue-600" />
              <span>Admin Staff Portal ↗</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
