import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard, Home, Info, GraduationCap,
  Bell, Images, Users, Phone, Footprints, LogOut, ArrowRight,
  Settings, School, Newspaper, Inbox, Mail, Menu, X, FileText,
  Megaphone, Clock, Star, ChevronRight, Zap, Globe, Shield,
  Navigation, MessageSquare, BarChart3, Sparkles, PlusCircle,
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

// ============ "FROSTED AMBER" UNIQUE THEME ============
const theme = {
  bg: "#0B0E14",            // Deep Premium Gray
  sidebarBg: "rgba(18, 22, 32, 0.95)",
  card: "rgba(255, 255, 255, 0.04)", 
  cardHover: "rgba(255, 255, 255, 0.08)",
  border: "rgba(255, 255, 255, 0.08)",
  borderSoft: "rgba(255, 255, 255, 0.02)",
  text: "#F1F5F9",
  muted: "#94A3B8",
  primary: "#F59E0B",       // Vibrant Amber/Gold
  accent: "#F97316",        // Deep Orange
  success: "#22C55E",
  warning: "#F59E0B",
  danger: "#EF4444",
};

// ── Icon Colors ──
const colors = {
  green: "#22C55E", purple: "#A78BFA", red: "#F87171", dark: "#0B1020",
  cyan: "#22D3EE", gold: "#F59E0B", orange: "#FB923C", pink: "#F472B6",
  blue: "#60A5FA", indigo: "#818CF8",
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

// ✨ NEW: Dynamic Greeting based on Time
function getTimeBasedGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return { text: "Good Morning", emoji: "🌅" };
  if (hour < 18) return { text: "Good Afternoon", emoji: "☀️" };
  return { text: "Good Evening", emoji: "🌙" };
}

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
  const greeting = getTimeBasedGreeting();

  useEffect(() => {
    let alive = true;

    const loadData = async () => {
      const requestOptions = { timeout: 12000 };

      try {
        const [msgRes, noticeRes, annRes, staffRes] = await Promise.allSettled([
          api.get("/api/contact-messages", requestOptions),
          api.get("/api/notices", requestOptions),
          api.get("/api/announcements", requestOptions),
          api.get("/api/site-content/staff", requestOptions),
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
        await api.post(
          "/api/admin/auth/logout",
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

  // Stats update
  const stats = [
    { icon: FileText,  label: "Total Notices",  value: noticeCount,       sub: `${pinnedCount} pinned`,  color: colors.red,    trend: "+5%" },
    { icon: Megaphone, label: "Announcements",  value: announcementCount, sub: `${announcements.filter(a => a.active !== false).length} active`, color: colors.orange, trend: "+3%" },
    { icon: Inbox,     label: "Messages",        value: messages.length,   sub: `${unreadCount} unread`, color: colors.purple, trend: unreadCount > 0 ? `${unreadCount} new` : "All read" },
    { icon: Users,     label: "Staff Members",   value: staff.length,      sub: "Active teachers",        color: colors.cyan,   trend: "Active" },
  ];

  // ── Sidebar component ──────────────────────────────────────────────
  const SidebarContent = () => (
    <>
      <div className="px-4 pt-6 pb-4 flex-shrink-0 border-b" style={{ borderColor: theme.border }}>
        <div className="flex items-center gap-3 mb-5">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #F59E0B, #F97316)", boxShadow: "0 6px 18px rgba(245,158,11,0.25)" }}
          >
            <Shield className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="font-bold text-white text-sm tracking-tight">Baljagriti</div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-400/60">Admin Panel</div>
          </div>
        </div>

        <div
          className="px-3 py-2.5 rounded-xl flex items-center gap-2.5"
          style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${theme.border}` }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold text-slate-950"
            style={{ background: "linear-gradient(135deg, #F59E0B, #F97316)" }}
          >
            {(adminUser.email || "A")[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="text-white/80 text-xs font-semibold truncate">{adminUser.name || "Administrator"}</div>
            <div className="text-[10px] truncate text-slate-500">{adminUser.email || "admin@baljagriti.edu.np"}</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-1.5">
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
              className="w-full relative group"
            >
              <div
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 text-left ${
                  isActive ? "bg-white/10" : "bg-transparent"
                }`}
                style={{
                  color: isActive ? "#FFFFFF" : "#64748B",
                  border: isActive ? `1px solid ${theme.border}` : "1px solid transparent",
                  transform: isActive ? "translateY(-2px)" : "translateY(0)",
                  boxShadow: isActive ? "0 4px 12px rgba(0,0,0,0.2)" : "none",
                }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#FFFFFF"; } }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#64748B"; } }}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm font-medium truncate">{item.title}</span>
              </div>
              
              {/* Glowing Amber Underline Indicator */}
              {isActive && (
                <motion.div 
                  layoutId="sidebarActiveIndicator"
                  className="absolute left-3 right-3 -bottom-1 h-0.5 rounded-full"
                  style={{ 
                    background: "linear-gradient(90deg, #F59E0B, #F97316)",
                    boxShadow: "0 0 12px #F59E0B"
                  }}
                />
              )}
            </button>
          );
        })}
      </nav>

      <div className="px-3 pb-5 flex-shrink-0">
        <div className="h-px mb-3" style={{ background: theme.border }} />
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-left group"
          style={{ 
            background: "rgba(239, 68, 68, 0.1)", 
            color: "#F87171", 
            border: "1px solid rgba(239, 68, 68, 0.1)" 
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)"; e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.2)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)"; e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.1)"; }}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm font-bold">Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex" style={{ background: theme.bg, fontFamily: "'Inter', sans-serif" }}>

      {/* ── Mobile overlay ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 z-30 lg:hidden"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Mobile sidebar ── */}
      <motion.aside
        animate={{ x: sidebarOpen ? 0 : -280 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed inset-y-0 left-0 z-40 w-[260px] flex flex-col lg:hidden backdrop-blur-xl border-r shadow-2xl"
        style={{ background: theme.sidebarBg, borderColor: theme.border }}
      >
        <SidebarContent />
      </motion.aside>

      {/* ── Desktop sidebar ── */}
      <aside
        className="hidden lg:flex flex-col w-[240px] flex-shrink-0 backdrop-blur-xl border-r shadow-xl"
        style={{
          background: theme.sidebarBg,
          borderColor: theme.border,
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
          className="flex-shrink-0 sticky top-0 z-30 px-4 sm:px-6 md:px-8 backdrop-blur-xl border-b"
          style={{ 
            background: "rgba(11, 14, 20, 0.75)", 
            borderColor: theme.border,
            borderBottom: `1px solid ${theme.primary}40`,
            boxShadow: "0 4px 30px rgba(0,0,0,0.3)"
          }}
        >
          <div className="h-16 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(255,255,255,0.06)", color: "#94A3B8" }}
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              
              <div className="min-w-0">
                <h1 className="font-bold text-white text-base truncate tracking-tight">
                  {activeEditor ? `Editing: ${activeEditor.charAt(0).toUpperCase() + activeEditor.slice(1)}` : "Dashboard"}
                </h1>
                <p className="text-xs truncate text-slate-400">
                  {currentTime}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                style={{ background: "rgba(34, 197, 94, 0.12)", border: "1px solid rgba(34, 197, 94, 0.2)" }}
              >
                <div className="w-1.5 h-1.5 rounded-full animate-pulse bg-green-500" />
                <span className="text-[10px] font-bold text-green-400 tracking-wide">Live</span>
              </div>
              <a href="/" target="_blank" rel="noreferrer" className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all hover:-translate-y-0.5 text-slate-300 hover:text-white" style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${theme.border}` }}><Globe className="w-4 h-4" /> View Site</a>
              {activeEditor && <button onClick={() => setActiveEditor(null)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all hover:-translate-y-0.5 text-slate-300 hover:text-white" style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${theme.border}` }}><X className="w-3.5 h-3.5" /><span className="hidden sm:inline">Close</span></button>}
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 sm:px-6 md:px-8 py-6 max-w-full">

            {!activeEditor ? (
              <div className="space-y-6">
                
                {/* ✨ WELCOME BANNER WITH ANIMATED AURORA ✨ */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="relative overflow-hidden rounded-2xl p-8 border"
                  style={{
                    background: "linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(249, 115, 22, 0.05), rgba(20, 24, 36, 0.9))",
                    borderColor: "rgba(245, 158, 11, 0.15)",
                    backdropFilter: "blur(12px)",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.3)"
                  }}
                >
                  {/* Animated Glowing Aurora Background */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <motion.div 
                      animate={{ x: [0, 40, 0], y: [0, -20, 0], scale: [1, 1.05, 1] }}
                      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-amber-500/20 blur-[80px]" 
                    />
                    <motion.div 
                      animate={{ x: [0, -30, 0], y: [0, 30, 0] }}
                      transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                      className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-orange-500/20 blur-[80px]" 
                    />
                  </div>

                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{greeting.emoji}</span>
                        <span className="text-xs font-bold uppercase tracking-[0.14em] text-amber-400/60">Admin Dashboard</span>
                      </div>
                      {/* ✨ Dynamic Greeting based on Time ✨ */}
                      <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight tracking-tight">
                        {greeting.text}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">{adminUser.name || "Admin"}!</span>
                      </h2>
                      <p className="text-base text-slate-400 max-w-xl">Manage your school website — notices, staff, gallery, and more.</p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button onClick={() => setActiveEditor("notices")} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all hover:-translate-y-1 text-slate-950 shadow-md" style={{ background: "linear-gradient(135deg, #F59E0B, #F97316)" }}>
                        <PlusCircle className="w-4 h-4" /> Add Notice
                      </button>
                      <button onClick={() => setActiveEditor("announcements")} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all hover:-translate-y-1 text-slate-300 hover:text-white" style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${theme.border}` }}>
                        <Megaphone className="w-4 h-4" /> Add Announcement
                      </button>
                    </div>
                  </div>
                </motion.div>

                {/* ✨ 3D STATS CARDS WITH PERSPECTIVE TILT ✨ */}
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-6">
                  {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        whileHover={{ y: -8, scale: 1.02 }}
                        className="relative p-6 border rounded-xl transition-all duration-300 group"
                        style={{ 
                          background: "linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))", 
                          borderColor: theme.border,
                          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                          transform: "perspective(800px)"
                        }}
                      >
                        <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl opacity-0 group-hover:opacity-50 transition-all duration-500 pointer-events-none" style={{ background: stat.color }} />
                        <div className="flex items-center justify-between mb-3">
                          <div className="p-2.5 rounded-xl bg-white/5 border border-white/5" style={{ background: `${stat.color}20` }}>
                            <Icon className="w-5 h-5" style={{ color: stat.color }} />
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${stat.color}15`, color: stat.color }}>
                            {stat.trend}
                          </span>
                        </div>
                        <div className="text-3xl font-bold text-white mb-1 tracking-tight">{stat.value}</div>
                        <div className="text-xs font-medium text-slate-400">{stat.label}</div>
                        <div className="text-[10px] mt-1 text-slate-500">{stat.sub}</div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* ✨ QUICK ACTION TASK BAR ✨ */}
                <div className="flex flex-wrap gap-3 py-2 border-b border-white/5 pb-6">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider pr-4 self-center">Quick Actions:</span>
                  <button onClick={() => setActiveEditor("notices")} className="text-xs font-medium px-3 py-1.5 rounded-full bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-colors">+ Manage Notices</button>
                  <button onClick={() => setActiveEditor("staff")} className="text-xs font-medium px-3 py-1.5 rounded-full bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-colors">+ Manage Staff</button>
                  <button onClick={() => setActiveEditor("gallery")} className="text-xs font-medium px-3 py-1.5 rounded-full bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-colors">+ Update Gallery</button>
                  <button onClick={() => setActiveEditor("settings")} className="text-xs font-medium px-3 py-1.5 rounded-full bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-colors">⚙ Settings</button>
                </div>

                {/* ── Recent Messages (Frosted Glass Full Width) ── */}
                <div className="rounded-xl overflow-hidden border" style={{ background: "rgba(255,255,255,0.03)", borderColor: theme.border, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
                  <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: theme.border }}>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl" style={{ background: "rgba(167, 139, 250, 0.1)" }}>
                        <Mail className="w-4 h-4" style={{ color: colors.purple }} />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm tracking-tight">Recent Messages</h3>
                        <p className="text-xs text-slate-400">Latest inquiries from visitors</p>
                      </div>
                    </div>
                    <button onClick={() => navigate("/admin/contact-messages")} className="flex items-center gap-1 text-xs font-medium transition-colors text-slate-400 hover:text-white">
                      View All <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-5 space-y-3">
                    {messagesLoading ? (
                      <div className="py-8 text-center text-sm text-slate-400">Loading messages...</div>
                    ) : latestMessages.length === 0 ? (
                      <div className="py-8 text-center">
                        <Mail className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                        <p className="text-sm text-slate-400">No messages yet</p>
                      </div>
                    ) : (
                      latestMessages.map((message) => (
                        <div key={message.id} className="rounded-xl p-4 transition-all duration-200 cursor-pointer" style={{ background: message.is_read ? "rgba(255,255,255,0.02)" : "rgba(167, 139, 250, 0.06)", border: message.is_read ? `1px solid ${theme.border}` : "1px solid rgba(167, 139, 250, 0.2)" }} onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"} onMouseLeave={e => e.currentTarget.style.background = message.is_read ? "rgba(255,255,255,0.02)" : "rgba(167, 139, 250, 0.06)"}>
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-1">
                            <div className="flex items-center gap-2 min-w-0">
                              {!message.is_read && <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-green-400" />}
                              <span className="font-bold text-white text-sm truncate max-w-[150px]">{message.name || "Unknown Sender"}</span>
                            </div>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0 self-start sm:self-auto" style={{ background: message.source === "admission" ? "rgba(167, 139, 250, 0.15)" : "rgba(248, 113, 113, 0.12)", color: message.source === "admission" ? colors.purple : colors.red, }}>{getSourceLabel(message.source)}</span>
                          </div>
                          <p className="text-sm leading-relaxed line-clamp-2 text-slate-400">{message.message || "No message text."}</p>
                          <p className="text-xs mt-1.5 text-slate-500">{formatDate(message.created_at)}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border p-6" style={{ background: "rgba(255,255,255,0.03)", borderColor: theme.border }}>
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
          <motion.div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(12px)" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowLogoutConfirm(false)}>
            <motion.div initial={{ scale: 0.9, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.95, y: 10, opacity: 0 }} transition={{ type: "spring", stiffness: 150, damping: 18 }} className="w-full max-w-sm overflow-hidden rounded-2xl border" style={{ background: "#1E293B", borderColor: theme.border, boxShadow: "0 30px 60px rgba(0,0,0,0.5)" }} onClick={e => e.stopPropagation()}>
              <div className="h-1" style={{ background: `linear-gradient(90deg, ${theme.danger}, ${theme.warning})` }} />
              <div className="p-6 text-center">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)" }}><LogOut className="w-5 h-5" style={{ color: theme.danger }} /></div>
                <h3 className="text-lg font-bold text-white mb-2">Log out?</h3>
                <p className="text-sm mb-6 text-slate-400">You'll need to sign in again to access the admin panel.</p>
                <div className="flex gap-3">
                  <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all hover:-translate-y-0.5 text-slate-300 hover:text-white" style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${theme.border}` }}>Cancel</button>
                  <button onClick={logout} className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5 text-white" style={{ background: "linear-gradient(135deg, #EF4444, #DC2626)", boxShadow: "0 4px 15px rgba(239, 68, 68, 0.2)" }}>Yes, Logout</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}