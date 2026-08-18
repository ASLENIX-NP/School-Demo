import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../lib/api";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard, Home, Info, GraduationCap,
  Bell, Images, Users, Phone, Footprints, LogOut,
  Settings, School, Newspaper, Inbox, Mail, Menu, X, FileText,
  Megaphone, Clock, ChevronRight, Globe, Shield,
  Navigation, PlusCircle,
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

// ============================================================
// "THE LEDGER" ADMIN THEME
// Same design language as the public site (About / Hero / Stats):
// deep ink, brass gold + rose, warm paper accents, Fraunces for
// headlines, Space Grotesk for eyebrows/labels. Keep this object
// in sync with the public-site theme if it's ever centralized.
// ============================================================
const theme = {
  ink: "#170F1A",
  inkPanel: "rgba(30, 20, 32, 0.92)",
  card: "rgba(231, 206, 156, 0.045)",
  cardHover: "rgba(231, 206, 156, 0.09)",
  border: "rgba(231, 206, 156, 0.14)",
  borderSoft: "rgba(231, 206, 156, 0.05)",
  text: "#F5EEE2",
  muted: "#9C8D92",
  primary: "#B98A42", // brass gold
  primarySoft: "#E7CE9C",
  accent: "#9C2748", // rose
  accentDeep: "#6E1733",
  moss: "#3F5B49",
  success: "#4C9A6A",
  warning: "#B98A42",
  danger: "#EF4444",
  gradGold: "linear-gradient(135deg, #E7CE9C 0%, #B98A42 100%)",
  gradInk: "linear-gradient(150deg, #170F1A 0%, #241722 55%, #331F2C 100%)",
};

// Rotating accent set for stat/section icon chips — brand palette
// instead of an arbitrary rainbow.
const ACCENTS = ["#9C2748", "#B98A42", "#3F5B49", "#6E1733", "#C6486B", "#2C4234"];

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

// Dynamic Greeting based on Time
function getTimeBasedGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return { text: "Good Morning", emoji: "🌅" };
  if (hour < 18) return { text: "Good Afternoon", emoji: "☀️" };
  return { text: "Good Evening", emoji: "🌙" };
}

// ── Standalone Sidebar Component to avoid unmount/remount on re-render ──
function SidebarContent({
  adminUser,
  activeEditor,
  setActiveEditor,
  setSidebarOpen,
  onLogoutClick,
  theme,
}) {
  return (
    <div className="flex flex-col h-full min-h-0 select-none">
      {/* Header / User Info */}
      <div className="px-4 pt-6 pb-4 flex-shrink-0 border-b" style={{ borderColor: theme.border }}>
        <div className="flex items-center gap-3 mb-5">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: theme.gradGold, boxShadow: `0 6px 18px ${theme.primary}40` }}
          >
            <Shield className="w-5 h-5" style={{ color: theme.ink }} />
          </div>
          <div>
            <div className="rr-serif font-semibold text-sm tracking-tight" style={{ color: theme.text }}>Red Rose</div>
            <div className="rr-mono text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: `${theme.primarySoft}90` }}>Admin Panel</div>
          </div>
        </div>

        <div
          className="px-3 py-2.5 rounded-xl flex items-center gap-2.5"
          style={{ background: theme.card, border: `1px solid ${theme.border}` }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold"
            style={{ background: theme.gradGold, color: theme.ink }}
          >
            {(adminUser.email || "A")[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold truncate" style={{ color: theme.text, opacity: 0.85 }}>{adminUser.name || "Administrator"}</div>
            <div className="text-[10px] truncate" style={{ color: theme.muted }}>{adminUser.email || "admin@Red Rose.edu.np"}</div>
          </div>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto min-h-0 space-y-1.5 custom-sidebar-scroll">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeEditor === item.editorKey || (item.editorKey === null && activeEditor === null);

          return (
            <button
              key={item.title}
              type="button"
              data-sidebar-active={isActive ? "true" : undefined}
              onClick={() => {
                setSidebarOpen(false);
                setActiveEditor(item.editorKey);
              }}
              className="w-full relative group block text-left"
            >
              <div
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-left"
                style={{
                  background: isActive ? `${theme.primary}17` : "transparent",
                  color: isActive ? theme.text : theme.muted,
                  border: isActive ? `1px solid ${theme.border}` : "1px solid transparent",
                  transform: isActive ? "translateY(-1px)" : "translateY(0)",
                  boxShadow: isActive ? "0 4px 12px rgba(0,0,0,0.25)" : "none",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = theme.card;
                    e.currentTarget.style.color = theme.text;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = theme.muted;
                  }
                }}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm font-medium truncate">{item.title}</span>
              </div>

              {/* Brass gradient active indicator */}
              {isActive && (
                <motion.div
                  layoutId="sidebarActiveIndicator"
                  className="absolute left-3 right-3 -bottom-0.5 h-0.5 rounded-full pointer-events-none"
                  style={{
                    background: theme.gradGold,
                    boxShadow: `0 0 12px ${theme.primary}`,
                  }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Logout button */}
      <div className="px-3 pb-5 flex-shrink-0 border-t" style={{ borderColor: theme.border }}>
        <button
          type="button"
          onClick={onLogoutClick}
          className="w-full mt-3 flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-left group"
          style={{
            background: "rgba(239, 68, 68, 0.1)",
            color: "#F87171",
            border: "1px solid rgba(239, 68, 68, 0.1)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)";
            e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
            e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.1)";
          }}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm font-bold">Logout</span>
        </button>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlTab = searchParams.get("tab");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [notices, setNotices] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [staff, setStaff] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [currentTime] = useState(getCurrentTime());
  const [activeEditor, setActiveEditor] = useState(urlTab || null);

  const adminUser = JSON.parse(localStorage.getItem("adminUser") || "{}");
  const greeting = getTimeBasedGreeting();

  // Sync activeEditor when search params in URL change
  useEffect(() => {
    setActiveEditor(urlTab || null);
  }, [urlTab]);

  const handleSelectEditor = (key) => {
    setActiveEditor(key);
    if (key) {
      setSearchParams({ tab: key }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  };

  // Smoothly scroll active sidebar button into view if it's hidden or at the lower end
  useEffect(() => {
    const timer = setTimeout(() => {
      const activeElements = document.querySelectorAll('[data-sidebar-active="true"]');
      activeElements.forEach((el) => {
        el.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "nearest",
        });
      });
    }, 80);

    return () => clearTimeout(timer);
  }, [activeEditor, sidebarOpen]);

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

  // Stats — brass/rose/moss accent rotation instead of a rainbow palette
  const stats = [
    { icon: FileText, label: "Total Notices", value: noticeCount, sub: `${pinnedCount} pinned`, color: ACCENTS[0], trend: "+5%" },
    { icon: Megaphone, label: "Announcements", value: announcementCount, sub: `${announcements.filter(a => a.active !== false).length} active`, color: ACCENTS[1], trend: "+3%" },
    { icon: Inbox, label: "Messages", value: messages.length, sub: `${unreadCount} unread`, color: ACCENTS[2], trend: unreadCount > 0 ? `${unreadCount} new` : "All read" },
    { icon: Users, label: "Staff Members", value: staff.length, sub: "Active teachers", color: ACCENTS[3], trend: "Active" },
  ];

  return (
    <div className="rr-ledger min-h-screen flex" style={{ background: theme.ink, fontFamily: "'Inter', sans-serif" }}>
      {/* Fonts, sidebar scrollbar, focus + motion rules */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,500&family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');

        .rr-serif { font-family: 'Fraunces', Georgia, 'Times New Roman', serif; }
        .rr-mono { font-family: 'Space Grotesk', 'IBM Plex Mono', monospace; }

        .rr-ledger a:focus-visible,
        .rr-ledger button:focus-visible {
          outline: 2px solid ${theme.primary};
          outline-offset: 3px;
          border-radius: 6px;
        }

        .custom-sidebar-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(185, 138, 66, 0.3) transparent;
        }
        .custom-sidebar-scroll::-webkit-scrollbar {
          width: 5px;
        }
        .custom-sidebar-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-sidebar-scroll::-webkit-scrollbar-thumb {
          background: rgba(185, 138, 66, 0.28);
          border-radius: 9999px;
        }
        .custom-sidebar-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(185, 138, 66, 0.55);
        }

        @media (prefers-reduced-motion: reduce) {
          .rr-ledger *, .rr-ledger *::before, .rr-ledger *::after {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.001ms !important;
          }
        }
      `}</style>

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
        className="fixed inset-y-0 left-0 z-40 w-[260px] flex flex-col lg:hidden backdrop-blur-xl border-r shadow-2xl overflow-hidden h-full"
        style={{ background: theme.inkPanel, borderColor: theme.border }}
      >
        <SidebarContent
          adminUser={adminUser}
          activeEditor={activeEditor}
          setActiveEditor={handleSelectEditor}
          setSidebarOpen={setSidebarOpen}
          onLogoutClick={() => setShowLogoutConfirm(true)}
          theme={theme}
        />
      </motion.aside>

      {/* ── Desktop sidebar ── */}
      <aside
        className="hidden lg:flex flex-col w-[240px] flex-shrink-0 backdrop-blur-xl border-r shadow-xl sticky top-0 h-screen overflow-hidden z-20"
        style={{
          background: theme.inkPanel,
          borderColor: theme.border,
        }}
      >
        <SidebarContent
          adminUser={adminUser}
          activeEditor={activeEditor}
          setActiveEditor={handleSelectEditor}
          setSidebarOpen={setSidebarOpen}
          onLogoutClick={() => setShowLogoutConfirm(true)}
          theme={theme}
        />
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">

        {/* Topbar */}
        <header
          className="flex-shrink-0 sticky top-0 z-30 px-4 sm:px-6 md:px-8 backdrop-blur-xl border-b"
          style={{
            background: "rgba(23, 15, 26, 0.78)",
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
                style={{ background: theme.card, color: theme.muted }}
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <div className="min-w-0">
                <h1 className="font-bold text-base truncate tracking-tight" style={{ color: theme.text }}>
                  {activeEditor ? `Editing: ${activeEditor.charAt(0).toUpperCase() + activeEditor.slice(1)}` : "Dashboard"}
                </h1>
                <p className="text-xs truncate" style={{ color: theme.muted }}>
                  {currentTime}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                style={{ background: "rgba(76, 154, 106, 0.14)", border: "1px solid rgba(76, 154, 106, 0.25)" }}
              >
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: theme.success }} />
                <span className="rr-mono text-[10px] font-bold tracking-wide" style={{ color: theme.success }}>Live</span>
              </div>
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all hover:-translate-y-0.5"
                style={{ background: theme.gradGold, color: theme.ink, boxShadow: `0 4px 14px ${theme.primary}40` }}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>View Site</span>
              </a>
              {activeEditor && (
                <button
                  onClick={() => handleSelectEditor(null)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all hover:-translate-y-0.5"
                  style={{ background: theme.card, border: `1px solid ${theme.border}`, color: theme.muted }}
                >
                  <X className="w-3.5 h-3.5" /><span className="hidden sm:inline">Close</span>
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 sm:px-6 md:px-8 py-6 max-w-full">

            {!activeEditor ? (
              <div className="space-y-6">

                {/* ✨ WELCOME BANNER ✨ */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="relative overflow-hidden rounded-2xl p-8 border"
                  style={{
                    background: theme.gradInk,
                    borderColor: theme.border,
                    boxShadow: "0 20px 50px rgba(0,0,0,0.35)"
                  }}
                >
                  {/* Aurora background */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <motion.div
                      animate={{ x: [0, 40, 0], y: [0, -20, 0], scale: [1, 1.05, 1] }}
                      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute -top-20 -right-20 w-80 h-80 rounded-full blur-[90px]"
                      style={{ background: "rgba(156,39,72,0.28)" }}
                    />
                    <motion.div
                      animate={{ x: [0, -30, 0], y: [0, 30, 0] }}
                      transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                      className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full blur-[90px]"
                      style={{ background: "rgba(185,138,66,0.20)" }}
                    />
                  </div>

                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{greeting.emoji}</span>
                        <span className="rr-mono text-xs font-bold uppercase tracking-[0.18em]" style={{ color: `${theme.primarySoft}90` }}>Admin Dashboard</span>
                      </div>
                      <h2 className="rr-serif text-3xl sm:text-4xl font-semibold leading-tight tracking-tight" style={{ color: theme.text }}>
                        {greeting.text}, <span className="text-transparent bg-clip-text" style={{ backgroundImage: theme.gradGold }}>{adminUser.name || "Admin"}!</span>
                      </h2>
                      <p className="text-base max-w-xl" style={{ color: "rgba(245,238,226,0.6)" }}>Manage your school website — notices, staff, gallery, and more.</p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => handleSelectEditor("notices")}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:-translate-y-1 shadow-md"
                        style={{ background: theme.gradGold, color: theme.ink }}
                      >
                        <PlusCircle className="w-4 h-4" /> Add Notice
                      </button>
                      <button
                        onClick={() => handleSelectEditor("announcements")}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:-translate-y-1"
                        style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${theme.border}`, color: theme.text }}
                      >
                        <Megaphone className="w-4 h-4" /> Add Announcement
                      </button>
                    </div>
                  </div>
                </motion.div>

                {/* ✨ 3D STATS CARDS ✨ */}
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
                          background: `linear-gradient(145deg, ${theme.card}, ${theme.borderSoft})`,
                          borderColor: theme.border,
                          boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
                          transform: "perspective(800px)"
                        }}
                      >
                        <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl opacity-0 group-hover:opacity-50 transition-all duration-500 pointer-events-none" style={{ background: stat.color }} />
                        <div className="flex items-center justify-between mb-3">
                          <div className="p-2.5 rounded-xl" style={{ background: `${stat.color}20` }}>
                            <Icon className="w-5 h-5" style={{ color: stat.color }} />
                          </div>
                          <span className="rr-mono text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${stat.color}18`, color: stat.color }}>
                            {stat.trend}
                          </span>
                        </div>
                        <div className="rr-serif text-3xl font-semibold mb-1 tracking-tight" style={{ color: theme.text }}>{stat.value}</div>
                        <div className="text-xs font-medium" style={{ color: theme.muted }}>{stat.label}</div>
                        <div className="text-[10px] mt-1" style={{ color: `${theme.muted}99` }}>{stat.sub}</div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* ✨ QUICK ACTION TASK BAR ✨ */}
                <div className="flex flex-wrap gap-3 py-2 pb-6 border-b" style={{ borderColor: theme.borderSoft }}>
                  <span className="rr-mono text-[11px] font-bold uppercase tracking-[0.14em] pr-4 self-center" style={{ color: `${theme.muted}` }}>Quick Actions:</span>
                  <button onClick={() => handleSelectEditor("notices")} className="text-xs font-medium px-3 py-1.5 rounded-full transition-colors" style={{ background: theme.card, color: theme.muted }}>+ Manage Notices</button>
                  <button onClick={() => handleSelectEditor("staff")} className="text-xs font-medium px-3 py-1.5 rounded-full transition-colors" style={{ background: theme.card, color: theme.muted }}>+ Manage Staff</button>
                  <button onClick={() => handleSelectEditor("gallery")} className="text-xs font-medium px-3 py-1.5 rounded-full transition-colors" style={{ background: theme.card, color: theme.muted }}>+ Update Gallery</button>
                  <button onClick={() => handleSelectEditor("settings")} className="text-xs font-medium px-3 py-1.5 rounded-full transition-colors" style={{ background: theme.card, color: theme.muted }}>⚙ Settings</button>
                </div>

                {/* ── Recent Messages ── */}
                <div className="rounded-xl overflow-hidden border" style={{ background: theme.card, borderColor: theme.border, boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}>
                  <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: theme.border }}>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl" style={{ background: `${theme.accent}18` }}>
                        <Mail className="w-4 h-4" style={{ color: theme.accent }} />
                      </div>
                      <div>
                        <h3 className="rr-serif font-semibold text-sm tracking-tight" style={{ color: theme.text }}>Recent Messages</h3>
                        <p className="text-xs" style={{ color: theme.muted }}>Latest inquiries from visitors</p>
                      </div>
                    </div>
                    <button onClick={() => navigate("/admin/contact-messages")} className="flex items-center gap-1 text-xs font-medium transition-colors" style={{ color: theme.muted }}>
                      View All <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-5 space-y-3">
                    {messagesLoading ? (
                      <div className="py-8 text-center text-sm" style={{ color: theme.muted }}>Loading messages...</div>
                    ) : latestMessages.length === 0 ? (
                      <div className="py-8 text-center">
                        <Mail className="w-8 h-8 mx-auto mb-2" style={{ color: `${theme.muted}70` }} />
                        <p className="text-sm" style={{ color: theme.muted }}>No messages yet</p>
                      </div>
                    ) : (
                      latestMessages.map((message) => (
                        <div
                          key={message.id}
                          className="rounded-xl p-4 transition-all duration-200 cursor-pointer"
                          style={{
                            background: message.is_read ? theme.borderSoft : `${theme.primary}0F`,
                            border: message.is_read ? `1px solid ${theme.border}` : `1px solid ${theme.primary}35`,
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = theme.cardHover}
                          onMouseLeave={e => e.currentTarget.style.background = message.is_read ? theme.borderSoft : `${theme.primary}0F`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-1">
                            <div className="flex items-center gap-2 min-w-0">
                              {!message.is_read && <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: theme.success }} />}
                              <span className="font-bold text-sm truncate max-w-[150px]" style={{ color: theme.text }}>{message.name || "Unknown Sender"}</span>
                            </div>
                            <span
                              className="rr-mono px-2 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0 self-start sm:self-auto"
                              style={{
                                background: message.source === "admission" ? `${theme.primary}20` : `${theme.accent}18`,
                                color: message.source === "admission" ? theme.primary : theme.accent,
                              }}
                            >
                              {getSourceLabel(message.source)}
                            </span>
                          </div>
                          <p className="text-sm leading-relaxed line-clamp-2" style={{ color: theme.muted }}>{message.message || "No message text."}</p>
                          <p className="text-xs mt-1.5" style={{ color: `${theme.muted}90` }}>{formatDate(message.created_at)}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border p-6" style={{ background: theme.card, borderColor: theme.border }}>
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
            <motion.div initial={{ scale: 0.9, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.95, y: 10, opacity: 0 }} transition={{ type: "spring", stiffness: 150, damping: 18 }} className="w-full max-w-sm overflow-hidden rounded-2xl border" style={{ background: "#221521", borderColor: theme.border, boxShadow: "0 30px 60px rgba(0,0,0,0.5)" }} onClick={e => e.stopPropagation()}>
              <div className="h-1" style={{ background: `linear-gradient(90deg, ${theme.danger}, ${theme.primary})` }} />
              <div className="p-6 text-center">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)" }}><LogOut className="w-5 h-5" style={{ color: theme.danger }} /></div>
                <h3 className="rr-serif text-lg font-semibold mb-2" style={{ color: theme.text }}>Log out?</h3>
                <p className="text-sm mb-6" style={{ color: theme.muted }}>You'll need to sign in again to access the admin panel.</p>
                <div className="flex gap-3">
                  <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all hover:-translate-y-0.5" style={{ background: theme.card, border: `1px solid ${theme.border}`, color: theme.text }}>Cancel</button>
                  <button onClick={logout} className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5 text-white" style={{ background: "linear-gradient(135deg, #EF4444, #DC2626)", boxShadow: "0 4px 15px rgba(239, 68, 68, 0.25)" }}>Yes, Logout</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}