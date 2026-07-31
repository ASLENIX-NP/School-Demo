import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard, Home, Info, GraduationCap,
  Bell, Images, Users, Phone, Footprints, LogOut, ArrowRight,
  Settings, School, Newspaper, Inbox, Mail, Menu, X, FileText,
  Megaphone, Clock, Star, ChevronRight, Zap, Globe, Shield,
  Navigation,
} from "lucide-react";

// ── IMPORT ALL YOUR EXISTING ADMIN PAGES ──
import AdminHome from "./AdminHome";
import AdminNavbar from "./AdminNavbar";
import AdminAbout from "./AdminAbout";
import AdminAcademics from "./AdminAcademics";
import AdminAdmissions from "./AdminAdmissions";
import AdminNotices from "./AdminNotices";
import AdminCalendar from "./AdminCalendar";
import AdminBlog from "./AdminBlog";
import AdminAnnouncements from "./AdminAnnouncements";
import AdminStaff from "./AdminStaff";
import AdminFacilities from "./AdminFacilities";
import AdminGallery from "./AdminGallery";
import AdminContact from "./AdminContact";
import AdminFooter from "./AdminFooter";
import AdminSettings from "./AdminSettings";

const colors = {
  green: "#168A3A", purple: "#4B2E83", red: "#D71920", dark: "#0B1020",
  cyan: "#38BDF8", gold: "#FACC15", orange: "#F97316", pink: "#EC4899",
  blue: "#3B82F6", indigo: "#6366F1",
};

const adminSections = [
  { title: "Manage Home", icon: Home, color: colors.cyan, editorKey: "home" },
  { title: "Manage About", icon: Info, color: colors.purple, editorKey: "about" },
  { title: "Manage Academics", icon: GraduationCap, color: colors.red, editorKey: "academics" },
  { title: "Manage Admissions", icon: School, color: colors.cyan, editorKey: "admissions" },
  { title: "Manage Notices", icon: Bell, color: colors.red, editorKey: "notices" },
  { title: "Manage Calendar", icon: Clock, color: colors.blue, editorKey: "calendar" },
  { title: "Manage Blog", icon: Newspaper, color: colors.indigo, editorKey: "blogs" },
  { title: "Manage Announcements", icon: Newspaper, color: colors.orange, editorKey: "announcements" },
  { title: "Manage Staff", icon: Users, color: colors.green, editorKey: "staff" },
  { title: "Manage Facilities", icon: School, color: colors.purple, editorKey: "facilities" },
  { title: "Manage Gallery", icon: Images, color: colors.gold, editorKey: "gallery" },
  { title: "Manage Contact", icon: Phone, color: colors.cyan, editorKey: "contact" },
  { title: "Manage Footer", icon: Footprints, color: colors.green, editorKey: "footer" },
  { title: "Website Settings", icon: Settings, color: colors.purple, editorKey: "settings" },
];

// ── Sidebar navigation items ──────────────────────────────────────
const navigationItems = [
  { title: "Dashboard", icon: LayoutDashboard, editorKey: null },
  { title: "Manage Navbar", icon: Navigation, editorKey: "navbar" },
  { title: "Manage Home", icon: Home, editorKey: "home" },
  { title: "Manage About", icon: Info, editorKey: "about" },
  { title: "Manage Academics", icon: GraduationCap, editorKey: "academics" },
  { title: "Manage Admissions", icon: School, editorKey: "admissions" },
  { title: "Manage Notices", icon: Bell, editorKey: "notices" },
  { title: "Manage Calendar", icon: Clock, editorKey: "calendar" },
  { title: "Manage Blog", icon: Newspaper, editorKey: "blogs" },
  { title: "Manage Announcements", icon: Newspaper, editorKey: "announcements" },
  { title: "Manage Staff", icon: Users, editorKey: "staff" },
  { title: "Manage Facilities", icon: School, editorKey: "facilities" },
  { title: "Manage Gallery", icon: Images, editorKey: "gallery" },
  { title: "Manage Contact", icon: Phone, editorKey: "contact" },
  { title: "Manage Footer", icon: Footprints, editorKey: "footer" },
  { title: "Website Settings", icon: Settings, editorKey: "settings" },
];

function formatDate(value) {
  if (!value) return "Recently";
  try {
    return new Date(value).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
  } catch { return "Recently"; }
}

function getSourceLabel(source) {
  return source === "admission" ? "Admissions" : "Contact";
}

function getCurrentTime() {
  return new Date().toLocaleString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

// ── Light theme color tokens ──────────────────────────────────
const bg = {
  page:       "#F0F2F5",
  sidebar:    "#FFFFFF",
  card:       "#FFFFFF",
  cardHover:  "#F8F9FA",
  header:     "rgba(255,255,255,0.92)",
  border:     "rgba(15,23,42,0.06)",
  borderSoft: "rgba(15,23,42,0.04)",
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [notices, setNotices] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [staff, setStaff] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [currentTime] = useState(getCurrentTime());
  const [activeEditor, setActiveEditor] = useState(null);

  const adminUser = JSON.parse(localStorage.getItem("adminUser") || "{}");

  useEffect(() => {
    let alive = true;

    const loadData = async () => {
      const requestOptions = { timeout: 12000 };

      try {
        const [msgRes, noticeRes, annRes, staffRes] = await Promise.allSettled([
          axios.get("https://school-website-backend-ixx2.onrender.com/api/contact-messages", requestOptions),
          axios.get("https://school-website-backend-ixx2.onrender.com/api/notices", requestOptions),
          axios.get("https://school-website-backend-ixx2.onrender.com/api/announcements", requestOptions),
          axios.get("https://school-website-backend-ixx2.onrender.com/api/site-content/staff", requestOptions),
        ]);

        if (!alive) return;

        if (msgRes.status === "fulfilled") {
          setMessages(Array.isArray(msgRes.value.data?.data) ? msgRes.value.data.data : []);
        }

        if (noticeRes.status === "fulfilled") {
          setNotices(Array.isArray(noticeRes.value.data?.data) ? noticeRes.value.data.data : []);
        }

        if (annRes.status === "fulfilled") {
          setAnnouncements(Array.isArray(annRes.value.data?.data) ? annRes.value.data.data : []);
        }

        if (staffRes.status === "fulfilled") {
          const staffContent = staffRes.value.data?.data?.content;
          setStaff(Array.isArray(staffContent?.staff) ? staffContent.staff : []);
        }

        [msgRes, noticeRes, annRes, staffRes].forEach((result) => {
          if (result.status === "rejected") {
            console.error("Dashboard data load error:", result.reason);
          }
        });
      } finally {
        if (alive) setMessagesLoading(false);
      }
    };

    loadData();

    return () => {
      alive = false;
    };
  }, []);

  const logout = async () => {
    const token = localStorage.getItem("adminToken");

    try {
      if (token) {
        await axios.post(
          "https://school-website-backend-ixx2.onrender.com/api/admin/auth/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
    } catch (err) {
      console.error("Admin logout error:", err);
    } finally {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
      setShowLogoutConfirm(false);
      navigate("/admin/login");
    }
  };

  const latestMessages = messages.slice(0, 4);
  const unreadCount = messages.filter((m) => !m.is_read).length;
  const noticeCount = notices.length;
  const announcementCount = announcements.length;
  const pinnedCount = notices.filter((n) => n.pinned).length;

  const stats = [
    { icon: FileText,  label: "Total Notices",  value: noticeCount,       sub: `${pinnedCount} pinned`,  color: colors.red,    trend: "+5%" },
    { icon: Megaphone, label: "Announcements",  value: announcementCount, sub: `${announcements.filter(a => a.active !== false).length} active`, color: colors.orange, trend: "+3%" },
    { icon: Inbox,     label: "Messages",        value: messages.length,   sub: `${unreadCount} unread`, color: colors.purple, trend: unreadCount > 0 ? `${unreadCount} new` : "All read" },
    { icon: Users,     label: "Staff Members",   value: staff.length,      sub: "Active teachers",        color: colors.cyan,   trend: "Active" },
  ];

  // ── Sidebar component ──────────────────────────────────────────────
  const SidebarContent = () => (
    <>
      <div className="px-4 pt-5 pb-4 flex-shrink-0" style={{ borderBottom: `1px solid ${bg.border}` }}>
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #FACC15, #38BDF8)", boxShadow: "0 6px 18px rgba(56,189,248,0.2)" }}
          >
            <Shield className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="font-black text-slate-950 text-sm">Baljagriti</div>
            <div className="text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: "rgba(15,23,42,0.4)" }}>Admin Panel</div>
          </div>
        </div>

        <div
          className="px-3 py-2.5 rounded-xl flex items-center gap-2.5"
          style={{ background: "rgba(15,23,42,0.04)", border: `1px solid ${bg.border}` }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-black text-white"
            style={{ background: "linear-gradient(135deg, #FACC15, #F97316)" }}
          >
            {(adminUser.email || "A")[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="text-slate-950 text-xs font-bold truncate">{adminUser.name || "Administrator"}</div>
            <div className="text-[10px] truncate" style={{ color: "rgba(15,23,42,0.4)" }}>{adminUser.email || "admin@baljagriti.edu.np"}</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-0.5">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeEditor === item.editorKey || (item.editorKey === null && activeEditor === null);
          
          return (
            <button
              key={item.title}
              onClick={() => {
                setSidebarOpen(false);
                setActiveEditor(item.editorKey);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 text-left"
              style={{
                background: isActive ? "rgba(56,189,248,0.1)" : "transparent",
                color: isActive ? "#0B1020" : "rgba(15,23,42,0.55)",
                border: isActive ? "1px solid rgba(56,189,248,0.15)" : "1px solid transparent",
              }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = "rgba(15,23,42,0.04)"; e.currentTarget.style.color = "#0B1020"; } }}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(15,23,42,0.55)"; } }}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm font-medium truncate">{item.title}</span>
              {isActive && <div className="ml-auto w-1.5 h-5 rounded-full flex-shrink-0" style={{ background: "linear-gradient(180deg, #38BDF8, #FACC15)" }} />}
            </button>
          );
        })}
      </nav>

      <div className="px-3 pb-5 flex-shrink-0">
        <div className="h-px mb-3" style={{ background: bg.border }} />
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150"
          style={{ color: "rgba(215,25,32,0.6)", border: "1px solid transparent" }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(215,25,32,0.06)"; e.currentTarget.style.border = "1px solid rgba(215,25,32,0.12)"; e.currentTarget.style.color = "#D71920"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.border = "1px solid transparent"; e.currentTarget.style.color = "rgba(215,25,32,0.6)"; }}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm font-bold">Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex" style={{ background: bg.page }}>

      {/* ── Mobile overlay ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 z-30 lg:hidden"
            style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(4px)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Mobile sidebar ── */}
      <motion.aside
        animate={{ x: sidebarOpen ? 0 : -280 }}
        transition={{ duration: 0.26, ease: "easeInOut" }}
        className="fixed inset-y-0 left-0 z-40 w-[240px] flex flex-col lg:hidden"
        style={{ background: bg.sidebar, borderRight: `1px solid ${bg.border}` }}
      >
        <SidebarContent />
      </motion.aside>

      {/* ── Desktop sidebar ── */}
      <aside
        className="hidden lg:flex flex-col w-[220px] flex-shrink-0"
        style={{
          background: bg.sidebar,
          borderRight: `1px solid ${bg.border}`,
          minHeight: "100vh",
          position: "sticky",
          top: 0,
          height: "100vh",
          overflowY: "auto",
        }}
      >
        <SidebarContent />
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">

        {/* Topbar */}
        <header
          className="flex-shrink-0 sticky top-0 z-30 px-3 sm:px-4 md:px-6"
          style={{ background: bg.header, backdropFilter: "blur(20px)", borderBottom: `1px solid ${bg.border}` }}
        >
          <div className="h-12 sm:h-14 flex items-center justify-between gap-1 sm:gap-2 md:gap-4">
            {/* Left section - Menu + Title */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(15,23,42,0.06)", color: "rgba(15,23,42,0.6)" }}
              >
                {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
              
              <div className="min-w-0">
                <h1 className="font-black text-slate-950 text-xs sm:text-sm truncate">
                  {activeEditor ? `Editing: ${activeEditor.charAt(0).toUpperCase() + activeEditor.slice(1)}` : "Dashboard"}
                </h1>
                <p className="text-[8px] sm:text-[10px] truncate" style={{ color: "rgba(15,23,42,0.4)" }}>
                  {currentTime}
                </p>
              </div>
            </div>

            {/* Right section - Badges + Buttons */}
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              {/* Live Badge */}
              <div
                className="flex items-center gap-1 px-1.5 sm:px-2.5 py-1 rounded-full"
                style={{ background: "rgba(22,138,58,0.08)", border: "1px solid rgba(22,138,58,0.12)" }}
              >
                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full animate-pulse" style={{ background: colors.green }} />
                <span className="text-[7px] sm:text-[10px] font-bold whitespace-nowrap" style={{ color: colors.green }}>Live</span>
              </div>

              {/* View Site - desktop shows full text, mobile shows icon only */}
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 px-1.5 sm:px-3 py-1 rounded-xl text-[8px] sm:text-xs font-bold transition-all hover:-translate-y-0.5 whitespace-nowrap"
                style={{ background: "rgba(15,23,42,0.05)", color: "rgba(15,23,42,0.5)", border: `1px solid ${bg.border}` }}
              >
                <Globe className="w-2.5 sm:w-3.5 h-2.5 sm:h-3.5" />
                <span className="hidden sm:inline">View Site</span>
              </a>

              {/* Close Editor - only shows when active */}
              {activeEditor && (
                <button
                  onClick={() => setActiveEditor(null)}
                  className="flex items-center gap-1 px-1.5 sm:px-3 py-1 rounded-xl text-[8px] sm:text-xs font-black transition-all hover:-translate-y-0.5 whitespace-nowrap"
                  style={{
                    background: "rgba(15,23,42,0.06)",
                    color: "rgba(15,23,42,0.6)",
                    border: `1px solid ${bg.border}`,
                  }}
                >
                  <X className="w-2.5 sm:w-3.5 h-2.5 sm:h-3.5" />
                  <span className="hidden sm:inline">Close</span>
                </button>
              )}

              {/* Logout Button */}
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="flex items-center gap-1 px-1.5 sm:px-3 py-1 rounded-xl text-[8px] sm:text-xs font-black transition-all hover:-translate-y-0.5 whitespace-nowrap"
                style={{
                  background: "rgba(215,25,32,0.08)",
                  color: "#D71920",
                  border: "1px solid rgba(215,25,32,0.15)",
                }}
              >
                <LogOut className="w-2.5 sm:w-3.5 h-2.5 sm:h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5 max-w-full">

            {!activeEditor ? (
              // ── Dashboard View ──
              <div className="space-y-3 sm:space-y-4 md:space-y-5">
                {/* Welcome banner */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45 }}
                  className="relative overflow-hidden rounded-[16px] sm:rounded-[20px] md:rounded-[24px] p-4 sm:p-5 md:p-7"
                  style={{
                    background: "linear-gradient(135deg, #E8EDF5 0%, #DCE3EF 50%, #E8E0F0 100%)",
                    border: `1px solid ${bg.border}`,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                  }}
                >
                  <div className="absolute top-0 right-0 w-40 sm:w-56 md:w-72 h-40 sm:h-56 md:h-72 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(56,189,248,0.08), transparent 70%)", transform: "translate(30%,-30%)" }} />
                  <div className="absolute bottom-0 left-0 w-32 sm:w-44 md:w-56 h-32 sm:h-44 md:h-56 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(250,204,21,0.06), transparent 70%)", transform: "translate(-30%,30%)" }} />

                  <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 md:gap-5">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                        <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: colors.green }} />
                        <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.14em]" style={{ color: "rgba(15,23,42,0.4)" }}>Admin Dashboard</span>
                      </div>
                      <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-slate-950 leading-tight mb-0.5 sm:mb-1.5" style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.04em" }}>
                        Hello, {adminUser.name || "Admin"}!
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-500">Manage your school website — notices, staff, gallery, and more.</p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 sm:gap-2 md:gap-2.5 flex-shrink-0">
                      <button
                        onClick={() => setActiveEditor("notices")}
                        className="inline-flex items-center gap-1 sm:gap-1.5 md:gap-2 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 rounded-xl text-[10px] sm:text-xs md:text-sm font-black transition-all hover:-translate-y-0.5 whitespace-nowrap"
                        style={{ background: "linear-gradient(135deg, #D71920, #9B1117)", color: "#fff", boxShadow: "0 4px 14px rgba(215,25,32,0.2)" }}
                      >
                        <Bell className="w-3 sm:w-3.5 md:w-4 h-3 sm:h-3.5 md:h-4" /> 
                        <span className="hidden xs:inline">Add</span> Notice
                      </button>
                      <button
                        onClick={() => setActiveEditor("announcements")}
                        className="inline-flex items-center gap-1 sm:gap-1.5 md:gap-2 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 rounded-xl text-[10px] sm:text-xs md:text-sm font-black transition-all hover:-translate-y-0.5 whitespace-nowrap"
                        style={{ background: "rgba(15,23,42,0.06)", color: "rgba(15,23,42,0.7)", border: `1px solid ${bg.border}` }}
                      >
                        <Megaphone className="w-3 sm:w-3.5 md:w-4 h-3 sm:h-3.5 md:h-4" /> 
                        <span className="hidden xs:inline">Add</span> Announcement
                      </button>
                    </div>
                  </div>
                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-3">
                  {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: i * 0.06 }}
                        className="relative overflow-hidden rounded-xl sm:rounded-2xl p-3 sm:p-4 transition-all duration-300 hover:-translate-y-1"
                        style={{ background: bg.card, border: `1px solid ${bg.border}`, boxShadow: "0 4px 16px rgba(0,0,0,0.04)" }}
                      >
                        <div className="absolute top-0 right-0 w-12 sm:w-16 h-12 sm:h-16 rounded-full pointer-events-none" style={{ background: `radial-gradient(circle, ${stat.color}10, transparent 70%)`, transform: "translate(30%,-30%)" }} />
                        <div className="flex items-start justify-between mb-1.5 sm:mb-2 md:mb-3">
                          <div className="p-1.5 sm:p-2 rounded-xl" style={{ background: `${stat.color}10` }}>
                            <Icon className="w-3 sm:w-3.5 md:w-4 h-3 sm:h-3.5 md:h-4" style={{ color: stat.color }} />
                          </div>
                          <span className="text-[8px] sm:text-[10px] font-black px-1.5 sm:px-2 py-0.5 rounded-full" style={{ background: `${stat.color}10`, color: stat.color }}>
                            {stat.trend}
                          </span>
                        </div>
                        <div className="text-lg sm:text-xl md:text-2xl font-black text-slate-950 mb-0.5">{stat.value}</div>
                        <div className="text-[9px] sm:text-[10px] md:text-xs font-bold text-slate-500">{stat.label}</div>
                        <div className="text-[8px] sm:text-[10px] mt-0.5 text-slate-400">{stat.sub}</div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* ── Recent Messages (full width) ── */}
                <div className="rounded-xl sm:rounded-2xl overflow-hidden" style={{ background: bg.card, border: `1px solid ${bg.border}`, boxShadow: "0 4px 16px rgba(0,0,0,0.04)" }}>
                  <div className="flex items-center justify-between px-3 sm:px-4 md:px-5 py-3 sm:py-4" style={{ borderBottom: `1px solid ${bg.borderSoft}` }}>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="p-1.5 sm:p-2 rounded-xl" style={{ background: "rgba(75,46,131,0.08)" }}>
                        <Mail className="w-3.5 sm:w-4 h-3.5 sm:h-4" style={{ color: colors.purple }} />
                      </div>
                      <div>
                        <h3 className="font-black text-slate-950 text-xs sm:text-sm">Recent Messages</h3>
                        <p className="text-[9px] sm:text-[10px] md:text-[11px] text-slate-400">Latest inquiries from visitors</p>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate("/admin/contact-messages")}
                      className="flex items-center gap-1 text-[9px] sm:text-[10px] md:text-xs font-bold transition-colors text-slate-400 hover:text-slate-950 whitespace-nowrap"
                    >
                      View All <ChevronRight className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                    </button>
                  </div>

                  <div className="p-3 sm:p-4 md:p-5 space-y-2 sm:space-y-3">
                    {messagesLoading ? (
                      <div className="py-6 sm:py-8 text-center text-xs sm:text-sm text-slate-400">Loading messages...</div>
                    ) : latestMessages.length === 0 ? (
                      <div className="py-6 sm:py-8 text-center">
                        <Mail className="w-6 sm:w-8 h-6 sm:h-8 mx-auto mb-2 text-slate-200" />
                        <p className="text-xs sm:text-sm text-slate-400">No messages yet</p>
                      </div>
                    ) : (
                      latestMessages.map((message) => (
                        <div
                          key={message.id}
                          className="rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 transition-all duration-200 cursor-pointer"
                          style={{
                            background: message.is_read ? "rgba(15,23,42,0.02)" : "rgba(75,46,131,0.06)",
                            border: message.is_read ? `1px solid ${bg.borderSoft}` : "1px solid rgba(75,46,131,0.12)",
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = "rgba(15,23,42,0.04)"}
                          onMouseLeave={e => e.currentTarget.style.background = message.is_read ? "rgba(15,23,42,0.02)" : "rgba(75,46,131,0.06)"}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1.5 sm:gap-2 mb-1.5">
                            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                              {!message.is_read && <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: colors.green }} />}
                              <span className="font-black text-slate-950 text-xs sm:text-sm truncate max-w-[100px] sm:max-w-[200px]">{message.name || "Unknown Sender"}</span>
                            </div>
                            <span
                              className="px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[10px] font-black flex-shrink-0 self-start sm:self-auto"
                              style={{
                                background: message.source === "admission" ? "rgba(75,46,131,0.1)" : "rgba(215,25,32,0.08)",
                                color: message.source === "admission" ? colors.purple : colors.red,
                              }}
                            >
                              {getSourceLabel(message.source)}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm leading-relaxed line-clamp-2 text-slate-500">{message.message || "No message text."}</p>
                          <p className="text-[8px] sm:text-[10px] mt-1.5 text-slate-400">{formatDate(message.created_at)}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ) : (
              // ── Editor View ──
              <div className="overflow-x-auto">
                {activeEditor === "navbar" && <AdminNavbar />}
                {activeEditor === "home" && <AdminHome />}
                {activeEditor === "about" && <AdminAbout />}
                {activeEditor === "academics" && <AdminAcademics />}
                {activeEditor === "admissions" && <AdminAdmissions />}
                {activeEditor === "notices" && <AdminNotices />}
                {activeEditor === "calendar" && <AdminCalendar />}
                {activeEditor === "blogs" && <AdminBlog />}
                {activeEditor === "announcements" && <AdminAnnouncements />}
                {activeEditor === "staff" && <AdminStaff />}
                {activeEditor === "facilities" && <AdminFacilities />}
                {activeEditor === "gallery" && <AdminGallery />}
                {activeEditor === "contact" && <AdminContact />}
                {activeEditor === "footer" && <AdminFooter />}
                {activeEditor === "settings" && <AdminSettings />}
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ── Logout Confirm ── */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6"
            style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(12px)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowLogoutConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.88, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.92, y: 10, opacity: 0 }}
              transition={{ type: "spring", stiffness: 130, damping: 16 }}
              className="w-full max-w-sm overflow-hidden rounded-[24px] sm:rounded-[28px]"
              style={{ background: "#FFFFFF", border: `1px solid ${bg.border}`, boxShadow: "0 40px 80px rgba(0,0,0,0.15)" }}
              onClick={e => e.stopPropagation()}
            >
              <div className="h-1" style={{ background: "linear-gradient(90deg, #D71920, #FACC15)" }} />
              <div className="p-5 sm:p-7 text-center">
                <div
                  className="w-12 sm:w-14 h-12 sm:h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-5"
                  style={{ background: "rgba(215,25,32,0.08)", border: "1px solid rgba(215,25,32,0.12)" }}
                >
                  <LogOut className="w-5 sm:w-6 h-5 sm:h-6" style={{ color: "#D71920" }} />
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-950 mb-2">Log out?</h3>
                <p className="text-xs sm:text-sm mb-5 sm:mb-6 text-slate-500">
                  You'll need to sign in again to access the admin panel.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="flex-1 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm font-black transition-all hover:-translate-y-0.5"
                    style={{ background: "rgba(15,23,42,0.06)", color: "rgba(15,23,42,0.6)", border: `1px solid ${bg.border}` }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={logout}
                    className="flex-1 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm font-black transition-all hover:-translate-y-0.5"
                    style={{ background: "linear-gradient(135deg, #D71920, #9B1117)", color: "#fff", boxShadow: "0 4px 14px rgba(215,25,32,0.2)" }}
                  >
                    Yes, Logout
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


