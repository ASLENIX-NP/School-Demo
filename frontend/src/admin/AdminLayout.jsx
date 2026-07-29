import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, ShieldCheck, UserCheck } from "lucide-react";

const links = [
  ["/dashboard", "Dashboard", "▦"],
  ["/students", "Students", "♙"],
  ["/teachers", "Teachers", "♧"],
  ["/classes", "Classes", "▤"],
  ["/subjects", "Subjects", "◈"],
  ["/attendance", "Attendance", "✓"],
  ["/fees", "Fees", "₹"],
  ["/exams", "Exams", "★"],
];

export default function AdminLayout({ title, subtitle, children }) {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const adminEmail = localStorage.getItem("admin_user_email") || "smritibam005@gmail.com";

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    navigate("/login");
  };

  return (
    <div className="admin-shell min-h-screen bg-slate-50 text-slate-900 flex flex-col lg:flex-row">
      {/* Mobile Topbar Bar (< 1024px) */}
      <header className="lg:hidden sticky top-0 z-50 bg-slate-900 text-white px-4 py-3 border-b border-slate-800 flex items-center justify-between shadow-md">
        <NavLink to="/dashboard" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-blue-600 p-0.5 flex items-center justify-center font-black text-white text-xs">
            SS
          </div>
          <div>
            <div className="text-sm font-black text-white leading-none">Smriti School</div>
            <small className="text-[9px] font-bold text-slate-400 block tracking-widest">ADMIN PORTAL</small>
          </div>
        </NavLink>

        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-200 hover:bg-slate-700 transition-colors"
          aria-label="Toggle Navigation"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Desktop Sidebar (≥ 1024px) */}
      <aside className="hidden lg:flex sidebar w-[250px] bg-slate-900 text-slate-200 p-6 flex-col fixed inset-y-0 left-0 z-40 border-r border-slate-800">
        <NavLink to="/dashboard" className="brand mb-6">
          <span>SS</span>
          <div>
            Smriti <b>School</b>
            <small>ADMIN PORTAL</small>
          </div>
        </NavLink>

        <nav className="flex flex-col gap-1">
          {links.map(([to, label, icon]) => (
            <NavLink key={to} to={to} className="flex items-center gap-3">
              <i>{icon}</i>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-800">
          <div className="profile-chip mb-4">
            <span>AS</span>
            <div className="truncate">
              Admin Smriti
              <small className="truncate">{adminEmail}</small>
            </div>
          </div>

          <button className="logout w-full flex items-center gap-2" onClick={handleLogout}>
            <LogOut className="w-4 h-4 text-red-500" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Overlay (< 1024px) */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />

          <div className="relative w-72 max-w-[85vw] bg-slate-900 text-white p-6 flex flex-col h-full z-10 shadow-2xl border-r border-slate-800 animate-fadeIn">
            <div className="flex items-center justify-between pb-6 mb-4 border-b border-slate-800">
              <NavLink to="/dashboard" onClick={() => setMobileOpen(false)} className="brand p-0">
                <span>SS</span>
                <div>
                  Smriti <b>School</b>
                  <small>ADMIN PORTAL</small>
                </div>
              </NavLink>

              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex flex-col gap-1 overflow-y-auto flex-1">
              {links.map(([to, label, icon]) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3"
                >
                  <i>{icon}</i>
                  <span>{label}</span>
                </NavLink>
              ))}
            </nav>

            <div className="pt-6 border-t border-slate-800 mt-auto">
              <div className="profile-chip mb-4">
                <span>AS</span>
                <div className="truncate">
                  Admin Smriti
                  <small className="truncate">{adminEmail}</small>
                </div>
              </div>

              <button
                className="logout w-full flex items-center gap-2 text-red-400 hover:text-red-300"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
                <span>Sign out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Admin Content Container */}
      <main className="admin-main flex-1 lg:ml-[250px] p-4 sm:p-6 lg:p-10 min-w-0">
        <header className="topbar mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
          <div>
            <p className="eyebrow">SMRITI SCHOOL • ACADEMIC YEAR 2083</p>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
              {title}
            </h1>
            {subtitle && <p className="subtitle text-xs sm:text-sm text-slate-500 mt-1">{subtitle}</p>}
          </div>

          <div className="profile-chip hidden sm:flex">
            <span>AS</span>
            <div className="truncate">
              Admin Smriti
              <small className="truncate">{adminEmail}</small>
            </div>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}

export const PageCard = ({ children, className = "" }) => (
  <section className={`page-card ${className}`}>{children}</section>
);
