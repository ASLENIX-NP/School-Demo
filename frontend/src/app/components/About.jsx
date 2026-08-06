// About.jsx
// Features individual Staff Containers that open a dedicated Popup on click.
// Page Header is now left-aligned, containerized, and wrapped in a colorful glass gradient card.
// FIXED: Mission & Vision emojis are now fully visible without getting cut off.

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  Camera,
  Compass,
  Eye,
  GraduationCap,
  Heart,
  ImageIcon,
  Lightbulb,
  Pencil,
  Plus,
  Quote,
  Sparkles,
  Target,
  Trash2,
  Users,
  UserRound,
  Globe,
  BookOpen,
  Trophy,
  X,
  MessageSquare,
  ChevronRight,
  Mail,
  Library,
} from "lucide-react";

// ──────────────────────────────────────────────
// Palette
// ──────────────────────────────────────────────
const palette = {
  primary: "#2563EB",      // Modern Royal Blue
  secondary: "#0F172A",    // Deep Navy
  accent: "#38BDF8",       // Bright Cyan
  accent2: "#F59E0B",      // Amber/Gold
  light: "#F1F5F9",        // Light Slate Background
  dark: "#0F172A",         // Deep Navy Text
  gray: "#64748B",         // Slate Gray
  lightGray: "#E2E8F0",    // Light Slate Border
  white: "#FFFFFF",
  gradient1: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)", // Deep Blue to Purple
  gradient2: "linear-gradient(135deg, #F59E0B 0%, #F97316 100%)",
  gradient3: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
};

const API_URL = "https://school-website-backend-ixx2.onrender.com";

// ──────────────────────────────────────────────
// Default content
// ──────────────────────────────────────────────
export const defaultAboutContent = {
  pageBadge: "About Our School",
  pageTitle: "Building a Brighter Future, One Student at a Time",
  pageSubtitle:
    "Rooted in tradition, driven by innovation. We are a community dedicated to nurturing confident, compassionate, and capable learners ready for tomorrow's world.",

  stats: [
    { id: 1, icon: "users", value: 2500, suffix: "+", label: "Students Enrolled" },
    { id: 2, icon: "trophy", value: 98.5, suffix: "%", decimals: 1, label: "Board Success Rate" },
    { id: 3, icon: "graduation", value: 15, suffix: " yrs", label: "Excellence in Education" },
    { id: 4, icon: "heart", value: 180, suffix: "+", label: "Dedicated Faculty" },
  ],

  storyBadge: "Our Story",
  storyTitle: "Where Passion Meets Purpose",
  storyParagraphs: [
    "Founded with a vision to redefine local education, our school has quickly become a cornerstone of academic excellence in our community. We believe that education is not just about textbooks, but about building character, resilience, and a lifelong love for learning.",
    "Our approach is simple yet profound: provide world-class facilities, encourage creative thinking, and foster an environment where every student feels seen, heard, and empowered to reach their full potential. We prepare students not just for exams, but for life.",
  ],
  storyImageUrl:
    "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1000&h=800&fit=crop&auto=format",
  storyImageZoom: 1,
  storyImageOffsetX: 0,
  storyImageOffsetY: 0,
  storyImageTopTitle: "Our Main Campus",
  storyImageTopSubtitle: "A Hub of Innovation & Learning",
  storyBadgeYear: "Est. 2010 AD",

  pillarBadge: "Our Core Values",
  pillarTitle: "The Principles That Guide Our Community",
  pillarDescription:
    "More than just words on a wall, these values shape our culture, our teaching, and our relationships every single day.",
  pillars: [
    {
      id: 1,
      icon: "trophy",
      label: "Academic Excellence",
      desc: "We challenge our students to strive for greatness through a rigorous, engaging, and supportive curriculum.",
      visible: true,
    },
    {
      id: 2,
      icon: "heart",
      label: "Character & Integrity",
      desc: "We believe that true education is built on a foundation of honesty, respect, and empathy for others.",
      visible: true,
    },
    {
      id: 3,
      icon: "globe",
      label: "Global Readiness",
      desc: "Equipping students with the critical thinking skills and cultural awareness needed to thrive in an interconnected world.",
      visible: true,
    },
  ],

  leadershipBadge: "Our Leadership",
  leadershipTitle: "Words From Our Staff",
  leadershipDescription:
    "Hear directly from the dedicated educators and leaders who make our school a home for learning.",

  messages: [
    {
      id: 1,
      name: "Mr. Ram Sharma",
      role: "Principal",
      title: "Creating Opportunities for Every Child",
      message:
        "Our mission is to provide a safe, nurturing, and academically rigorous environment where every child discovers their unique potential. We are committed to not just teaching lessons, but inspiring a generation of thinkers, leaders, and dreamers.",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&auto=format", 
      imageZoom: 1,
      imageOffsetX: 0,
      imageOffsetY: 0,
      visible: true,
    },
    {
      id: 2,
      name: "Mrs. Sita Poudel",
      role: "Vice Principal",
      title: "A Commitment to Excellence",
      message:
        "Behind every great school is a dedicated team. Our educators are our greatest asset, working tirelessly to ensure that no child is left behind. Through innovation, compassion, and unwavering dedication, we are making a real difference in the community.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&auto=format", 
      imageZoom: 1,
      imageOffsetX: 0,
      imageOffsetY: 0,
      visible: true,
    },
  ],

  missionVisionBadge: "Our Focus",
  missionVision: [
    {
      id: 1,
      icon: "target",
      title: "Our Mission",
      desc: "To cultivate a love for learning in every student by providing a challenging, inclusive, and innovative educational environment that promotes academic achievement and personal growth.",
      visible: true,
    },
    {
      id: 2,
      icon: "compass",
      title: "Our Vision",
      desc: "To be recognized as a beacon of educational excellence, producing well-rounded, compassionate, and future-ready graduates who lead with confidence and integrity.",
      visible: true,
    },
  ],

  journeyBadge: "Our Journey",
  journeyTitle: "A Timeline of Growth",
  journey: [
    { id: 1, year: "2010 AD", title: "School Founded", desc: "Our school opens with a vision to deliver modern, high-quality education to the local community.", visible: true },
    { id: 2, year: "2015 AD", title: "Expanded To Secondary", desc: "Rising demand pushed the school to extend its academic structure, offering education up to Grade 10.", visible: true },
    { id: 3, year: "2018 AD", title: "Academic Achievements", desc: "Focused classroom teaching and dedicated staff began producing some of the region's strongest exam results.", visible: true },
    { id: 4, year: "Today", title: "A Growing Community", desc: "A vibrant community of over 2,500 students, 180+ educators, and a shared focus on holistic excellence.", visible: true },
  ],

  ctaTitle: "Ready to Join Our Community?",
  ctaDescription: "Experience our campus, meet our dedicated faculty, and see firsthand how we nurture the leaders of tomorrow.",
  ctaButtonText: "Schedule a Visit",
  ctaButtonLink: "/contact",
};

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────
function clampNumber(value, min, max, fallback) {
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue)) return fallback;
  return Math.min(max, Math.max(min, numberValue));
}

function getAdjustedImageStyle(source = {}) {
  const zoom = clampNumber(source.imageZoom, 1, 3, 1);
  const x = clampNumber(source.imageOffsetX, -60, 60, 0);
  const y = clampNumber(source.imageOffsetY, -60, 60, 0);
  const objectX = Math.min(100, Math.max(0, 50 - x));
  const objectY = Math.min(100, Math.max(0, 50 - y));
  return {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: `${objectX}% ${objectY}%`,
    transform: `scale(${zoom})`,
    transformOrigin: "center center",
    transition: "transform 240ms ease-out, object-position 240ms ease-out",
  };
}

function normalizeArray(savedArray, defaultArray) {
  if (!Array.isArray(savedArray)) return defaultArray;
  return savedArray.map((item, index) => ({
    ...(defaultArray[index] || {}),
    ...item,
    id: item.id || Date.now() + index,
  }));
}

export function mergeAboutContent(saved = {}) {
  const messages = normalizeArray(saved.messages, defaultAboutContent.messages).map((message) => ({
    ...message,
    imageZoom: clampNumber(message.imageZoom, 1, 3, 1),
    imageOffsetX: clampNumber(message.imageOffsetX, -60, 60, 0),
    imageOffsetY: clampNumber(message.imageOffsetY, -60, 60, 0),
  }));

  return {
    ...defaultAboutContent,
    ...(saved || {}),
    stats: normalizeArray(saved.stats, defaultAboutContent.stats),
    storyParagraphs: Array.isArray(saved.storyParagraphs) ? saved.storyParagraphs : defaultAboutContent.storyParagraphs,
    storyImageZoom: clampNumber(saved.storyImageZoom, 1, 3, 1),
    storyImageOffsetX: clampNumber(saved.storyImageOffsetX, -60, 60, 0),
    storyImageOffsetY: clampNumber(saved.storyImageOffsetY, -60, 60, 0),
    pillars: normalizeArray(saved.pillars, defaultAboutContent.pillars),
    messages,
    missionVision: normalizeArray(saved.missionVision, defaultAboutContent.missionVision),
    journey: normalizeArray(saved.journey, defaultAboutContent.journey),
  };
}

const ICONS = {
  award: Award,
  heart: Heart,
  lightbulb: Lightbulb,
  target: Target,
  eye: Eye,
  graduation: GraduationCap,
  users: Users,
  trophy: Trophy,
  globe: Globe,
  compass: Compass,
  book: BookOpen,
};

// ──────────────────────────────────────────────
// 3D tilt wrapper
// ──────────────────────────────────────────────
function TiltCard({ children, className = "", style = {}, max = 7, glare = true }) {
  const ref = useRef(null);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [hovering, setHovering] = useState(false);

  const handleMove = (e) => {
    const el = ref.current;
    if (!el || typeof window === "undefined") return;
    if (window.matchMedia && window.matchMedia("(pointer: coarse)").matches) return;

    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rotY = (px - 0.5) * max * 2;
    const rotX = (0.5 - py) * max * 2;

    el.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(0)`;
    setGlarePos({ x: px * 100, y: py * 100 });
  };

  const handleLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
    setHovering(false);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={handleLeave}
      className={className}
      style={{
        transition: "transform 260ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 260ms ease",
        transformStyle: "preserve-3d",
        willChange: "transform",
        position: "relative",
        ...style,
      }}
    >
      {children}
      {glare && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{
            opacity: hovering ? 1 : 0,
            transition: "opacity 260ms ease",
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.35), transparent 55%)`,
          }}
        />
      )}
    </div>
  );
}

// ──────────────────────────────────────────────
// Animated count-up
// ──────────────────────────────────────────────
function CountUp({ value, suffix = "", decimals = 0 }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  const target = Number(value) || 0;

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setDisplay(target);
      return undefined;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const duration = 1400;
          const start = performance.now();
          const step = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(target * eased);
            if (progress < 1) requestAnimationFrame(step);
            else setDisplay(target);
          };
          requestAnimationFrame(step);
          io.unobserve(el);
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {decimals > 0 ? display.toFixed(decimals) : Math.floor(display).toLocaleString()}
      {suffix}
    </span>
  );
}

// ──────────────────────────────────────────────
// Shared editing chrome
// ──────────────────────────────────────────────
function EditIconButton({ editMode, target, onEditTarget, icon: Icon = Pencil, label = "Edit" }) {
  if (!editMode) return null;
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onEditTarget(target);
      }}
      className="absolute -top-2 -right-2 z-[90] opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 rounded-full w-8 h-8 flex items-center justify-center shadow-lg backdrop-blur-md"
      style={{ background: "rgba(255,255,255,0.2)", color: palette.primary, border: `1px solid rgba(255,255,255,0.4)` }}
      title={label}
    >
      <Icon className="w-3.5 h-3.5" />
    </button>
  );
}

function DeleteIconButton({ editMode, target, onDeleteTarget, label = "Delete" }) {
  if (!editMode) return null;
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onDeleteTarget(target);
      }}
      className="absolute -top-2 -right-12 z-[90] opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 rounded-full w-8 h-8 flex items-center justify-center shadow-lg"
      style={{ background: "#FEE2E2", color: "#DC2626", border: `2px solid ${palette.white}` }}
      title={label}
    >
      <Trash2 className="w-3.5 h-3.5" />
    </button>
  );
}

function EditableWrap({
  editMode,
  target,
  onEditTarget,
  onDeleteTarget = () => {},
  icon = Pencil,
  label = "Edit",
  canDelete = false,
  className = "",
  children,
}) {
  if (!editMode) return children;
  return (
    <div className={`relative group ${className}`}>
      {children}
      <EditIconButton editMode={editMode} target={target} onEditTarget={onEditTarget} icon={icon} label={label} />
      {canDelete && (
        <DeleteIconButton editMode={editMode} target={target} onDeleteTarget={onDeleteTarget} label="Delete" />
      )}
    </div>
  );
}

function SectionAddButton({ editMode, label, type, onAddTarget }) {
  if (!editMode) return null;
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onAddTarget(type);
      }}
      className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5"
      style={{ color: palette.white, background: palette.gradient1, boxShadow: "0 8px 20px rgba(37,99,235,0.22)" }}
    >
      <Plus className="w-4 h-4" />
      {label}
    </button>
  );
}

// ──────────────────────────────────────────────
// Shared visual building blocks
// ──────────────────────────────────────────────
function SectionHeader({ badge, badgeColor = palette.primary, badgeBg = "rgba(37,99,235,0.08)", title, description }) {
  return (
    <div className="text-center max-w-3xl mx-auto mb-12 relative">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="inline-block"
      >
        <span
          className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide mb-4 backdrop-blur-sm"
          style={{ background: badgeBg, color: badgeColor, border: `1px solid ${badgeColor}20` }}
        >
          {badge}
        </span>
      </motion.div>
      <h2
        className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
        style={{ color: palette.dark, fontFamily: "var(--font-display)", letterSpacing: "-0.02em", lineHeight: 1.1 }}
      >
        {title}
      </h2>
      {description && (
        <p className="text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: palette.gray }}>
          {description}
        </p>
      )}
      <div className="w-16 h-1 rounded-full mx-auto mt-4" style={{ background: palette.gradient2 }} />
    </div>
  );
}

// Animated, layered, premium background
function DecorativeBackdrop() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `radial-gradient(circle, ${palette.primary} 1px, transparent 1.3px)`, backgroundSize: "24px 24px" }} />
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-30 blur-[120px] animate-pulse" style={{ background: palette.gradient1 }} />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-20 blur-[120px] animate-pulse delay-1000" style={{ background: palette.accent }} />
    </div>
  );
}

// ──────────────────────────────────────────────
// SINGLE STAFF POPUP COMPONENT
// ──────────────────────────────────────────────
function StaffPopup({ isOpen, onClose, staff }) {
  if (!isOpen || !staff) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 10, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header / Image Area */}
          <div className="relative h-56 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
              <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-200">
                {staff.image ? (
                  <img 
                    src={staff.image} 
                    alt={staff.name} 
                    className="w-full h-full object-cover"
                    style={getAdjustedImageStyle(staff)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                    <UserRound className="w-10 h-10" />
                  </div>
                )}
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors backdrop-blur-sm"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Info Body */}
          <div className="pt-16 pb-8 px-8 text-center">
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-slate-900">{staff.name}</h3>
              <span className="inline-block mt-1 text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                {staff.role}
              </span>
            </div>
            
            <div className="text-left bg-slate-50 p-6 rounded-xl border border-slate-100 mb-6">
              <h4 className="font-bold text-slate-800 text-base mb-2">{staff.title}</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                {staff.message}
              </p>
            </div>

            <button 
              onClick={onClose} 
              className="w-full py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors border border-slate-200"
            >
              Close Message
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ──────────────────────────────────────────────
// About page
// ──────────────────────────────────────────────
export default function About({
  editMode = false,
  contentOverride = null,
  onEditTarget = () => {},
  onDeleteTarget = () => {},
  onAddTarget = () => {},
}) {
  const [content, setContent] = useState(() => mergeAboutContent(contentOverride || defaultAboutContent));
  const [selectedStaff, setSelectedStaff] = useState(null);

  useEffect(() => {
    if (contentOverride) {
      setContent(mergeAboutContent(contentOverride));
      return undefined;
    }
    let alive = true;
    const loadAboutContent = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/site-content/about`, { timeout: 10000 });
        if (!alive) return;
        const saved = res.data?.data?.content || {};
        setContent(mergeAboutContent(saved));
      } catch (error) {
        console.error("About content load error:", error);
        if (alive) setContent(mergeAboutContent(defaultAboutContent));
      }
    };
    loadAboutContent();
    return () => {
      alive = false;
    };
  }, [contentOverride]);

  const visiblePillars = (content.pillars || []).filter((p) => p.visible !== false);
  const visibleStaff = (content.messages || []).filter((m) => m.visible !== false);
  const visibleMissionVision = (content.missionVision || []).filter((mv) => mv.visible !== false);
  const visibleJourney = (content.journey || []).filter((j) => j.visible !== false);

  return (
    <section className="relative overflow-hidden py-16 md:py-24" style={{ background: palette.light }}>
      <DecorativeBackdrop />

      <div className="relative z-10 max-w-[1400px] mx-auto px-5 sm:px-8">
        
        {/* ─────────── PAGE HEADER (COLORFUL CONTAINER) ─────────── */}
        <EditableWrap editMode={editMode} target={{ type: "pageHeader" }} onEditTarget={onEditTarget} label="Edit page header">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 md:mb-20"
          >
            <TiltCard
              max={5}
              glare={true}
              className="relative rounded-3xl p-8 md:p-12 overflow-hidden"
              style={{
                background: "linear-gradient(145deg, #EFF6FF 0%, #F0F0FF 45%, #FEFCE8 100%)",
                border: "1px solid rgba(37, 99, 235, 0.10)",
                boxShadow: "0 20px 50px rgba(37, 99, 235, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)",
              }}
            >
              {/* Decorative floating blobs inside the header to make it colorful */}
              <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-blue-400/10 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-purple-400/10 blur-3xl pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-amber-200/10 blur-2xl pointer-events-none" />

              <div className="relative z-10 max-w-2xl">
                <motion.span
                  initial={{ scale: 0.9 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide mb-5"
                  style={{ background: "rgba(37, 99, 235, 0.10)", color: palette.primary }}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {content.pageBadge}
                </motion.span>
                <h1
                  className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5"
                  style={{
                    color: palette.dark,
                    fontFamily: "var(--font-display)",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.08,
                  }}
                >
                  {content.pageTitle}
                </h1>
                <p className="text-lg leading-relaxed" style={{ color: palette.gray }}>
                  {content.pageSubtitle}
                </p>
                <div className="w-16 h-1 rounded-full mt-6" style={{ background: palette.gradient1 }} />
              </div>
            </TiltCard>
          </motion.div>
        </EditableWrap>

        {/* ─────────── OUR STORY ─────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="grid lg:grid-cols-2 gap-10 md:gap-14 items-center mb-16 md:mb-24"
        >
          <EditableWrap editMode={editMode} target={{ type: "storyImage" }} onEditTarget={onEditTarget} icon={Camera} label="Change story image">
            <TiltCard max={5} glare={false} className="relative" style={{ transform: "perspective(1000px)" }}>
              <div
                className="relative rounded-2xl overflow-hidden min-h-[300px] md:min-h-[420px]"
                style={{ background: palette.dark, boxShadow: "0 30px 70px rgba(15,23,42,0.15)" }}
              >
                {content.storyImageUrl ? (
                  <img
                    src={content.storyImageUrl}
                    alt="Campus"
                    draggable={false}
                    className="absolute inset-0"
                    style={getAdjustedImageStyle(content)}
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                    <ImageIcon className="w-12 h-12 mb-2" />
                    <div className="text-xs font-bold uppercase tracking-wider">Add Story Image</div>
                  </div>
                )}
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(15,23,42,0.6) 0%, rgba(15,23,42,0.1) 50%, rgba(15,23,42,0.2) 100%)" }} />
                <EditableWrap editMode={editMode} target={{ type: "storyImageText" }} onEditTarget={onEditTarget} label="Edit image caption" className="absolute inset-0">
                  <div className="absolute top-0 left-0 right-0 p-6">
                    <div className="text-white text-lg font-bold">{content.storyImageTopTitle}</div>
                    <div className="text-white/80 text-sm">{content.storyImageTopSubtitle}</div>
                  </div>
                </EditableWrap>
              </div>
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-6 -left-4 md:-left-6 rounded-2xl px-5 py-4 hidden sm:block backdrop-blur-md border"
                style={{
                  background: "rgba(255, 255, 255, 0.5)",
                  borderColor: "rgba(255, 255, 255, 0.6)",
                  boxShadow: "0 12px 32px rgba(15,23,42,0.08)",
                }}
              >
                <div className="text-2xl font-bold" style={{ color: palette.primary, fontFamily: "var(--font-display)" }}>
                  {content.storyBadgeYear}
                </div>
                <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: palette.gray }}>
                  {content.storyImageTopSubtitle}
                </div>
              </motion.div>
            </TiltCard>
          </EditableWrap>

          <EditableWrap editMode={editMode} target={{ type: "storyText" }} onEditTarget={onEditTarget} label="Edit story text" className="lg:pl-4">
            <div>
              <span
                className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide mb-4"
                style={{ background: "rgba(56, 189, 248, 0.1)", color: palette.accent }}
              >
                {content.storyBadge}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: palette.dark, fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}>
                {content.storyTitle}
              </h2>
              <div className="space-y-4">
                {(content.storyParagraphs || []).map((text, idx) => (
                  <p key={idx} className="text-base md:text-lg leading-relaxed" style={{ color: palette.gray }}>
                    {text}
                  </p>
                ))}
              </div>
            </div>
          </EditableWrap>
        </motion.div>

        {/* ─────────── CORE VALUES / PILLARS ─────────── */}
        <div className="mb-16 md:mb-24">
          <SectionHeader
            badge={content.pillarBadge}
            title={content.pillarTitle}
            description={content.pillarDescription}
            badgeBg="rgba(245, 158, 11, 0.15)"
            badgeColor={palette.accent2}
          />

          <div className="flex justify-end mb-6">
            <SectionAddButton editMode={editMode} label="Add Value" type="pillar" onAddTarget={onAddTarget} />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {visiblePillars.map((p, i) => {
              const realIndex = content.pillars.findIndex((item) => item.id === p.id);
              const Icon = ICONS[p.icon] || Award;

              return (
                <EditableWrap
                  key={p.id}
                  editMode={editMode}
                  target={{ type: "pillarCard", index: realIndex }}
                  onEditTarget={onEditTarget}
                  onDeleteTarget={onDeleteTarget}
                  canDelete
                  label="Edit value card"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    <TiltCard
                      max={6}
                      className="rounded-2xl p-6 md:p-8 h-full backdrop-blur-md border"
                      style={{ 
                        background: "linear-gradient(145deg, rgba(255,255,255,0.5), rgba(255,255,255,0.1))",
                        borderColor: "rgba(255,255,255,0.6)",
                        boxShadow: "0 10px 30px rgba(15,23,42,0.06), inset 0 1px 0 rgba(255,255,255,0.8)"
                      }}
                    >
                      <div className="absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl" style={{ background: palette.gradient1 }} />

                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                        style={{
                          background: "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(249,115,22,0.15))",
                          color: palette.accent2,
                          border: "1px solid rgba(245,158,11,0.1)",
                          transform: "translateZ(24px)",
                        }}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold mb-2" style={{ color: palette.dark }}>
                        {p.label}
                      </h3>
                      <p className="text-sm leading-relaxed" style={{ color: palette.gray }}>
                        {p.desc}
                      </p>
                    </TiltCard>
                  </motion.div>
                </EditableWrap>
              );
            })}
          </div>
        </div>

        {/* ─────────── STAFF CONTAINERS ─────────── */}
        <div className="mb-16 md:mb-24">
          <SectionHeader 
            badge={content.leadershipBadge} 
            title="Words From Our Staff" 
            description="Hear directly from the dedicated educators and leaders who make our school a home for learning." 
          />

          <div className="flex justify-end mb-6">
            <SectionAddButton editMode={editMode} label="Add Staff" type="message" onAddTarget={onAddTarget} />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {visibleStaff.map((person, i) => {
              const realIndex = content.messages.findIndex((m) => m.id === person.id);

              return (
                <EditableWrap
                  key={person.id}
                  editMode={editMode}
                  target={{ type: "leadershipMessage", index: realIndex }}
                  onEditTarget={onEditTarget}
                  onDeleteTarget={onDeleteTarget}
                  canDelete
                  label="Edit staff profile"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.5, delay: i * 0.12 }}
                  >
                    <button
                      onClick={() => setSelectedStaff(person)}
                      className="w-full text-left group"
                    >
                      <TiltCard
                        max={4}
                        className="rounded-2xl p-6 backdrop-blur-md border transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                        style={{ 
                          background: "linear-gradient(145deg, rgba(255,255,255,0.4), rgba(255,255,255,0.1))",
                          borderColor: "rgba(255,255,255,0.6)",
                          boxShadow: "0 10px 30px rgba(15,23,42,0.06), inset 0 1px 0 rgba(255,255,255,0.8)"
                        }}
                      >
                        <div className="flex items-center gap-5">
                          {/* Photo */}
                          <div className="flex-shrink-0">
                            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-sm bg-gray-200 transition-transform group-hover:scale-105">
                              {person.image ? (
                                <img 
                                  src={person.image} 
                                  alt={person.name} 
                                  className="w-full h-full object-cover"
                                  style={getAdjustedImageStyle(person)}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                                  <UserRound className="w-6 h-6" />
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-bold text-slate-900 text-lg">{person.name}</h3>
                              <span className="text-xs text-blue-600 font-medium px-2 py-0.5 bg-blue-50 rounded-full">
                                {person.role}
                              </span>
                            </div>
                            <p className="text-sm text-slate-500 mt-1">{person.title}</p>
                            
                            <div className="mt-3 flex items-center gap-2 text-sm font-medium text-blue-600 group-hover:text-blue-700 transition-colors">
                              <Mail className="w-4 h-4" />
                              <span>Read Message</span>
                              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </div>
                      </TiltCard>
                    </button>
                  </motion.div>
                </EditableWrap>
              );
            })}
          </div>
        </div>

        {/* ─────────── MISSION & VISION (EXPANDED & FIXED) ─────────── */}
        <div className="mb-16 md:mb-24 max-w-5xl mx-auto">
          <SectionHeader badge={content.missionVisionBadge} title="What Guides Every Decision We Make" badgeBg="rgba(56, 189, 248, 0.1)" badgeColor={palette.accent} />

          <div className="flex justify-end mb-6">
            <SectionAddButton editMode={editMode} label="Add Card" type="missionVision" onAddTarget={onAddTarget} />
          </div>

          <div className="grid md:grid-cols-2 gap-8 pt-6">
            {visibleMissionVision.map((item, i) => {
              const realIndex = content.missionVision.findIndex((mv) => mv.id === item.id);
              const Icon = ICONS[item.icon] || Compass;

              return (
                <EditableWrap
                  key={item.id}
                  editMode={editMode}
                  target={{ type: "missionVision", index: realIndex }}
                  onEditTarget={onEditTarget}
                  onDeleteTarget={onDeleteTarget}
                  canDelete
                  label="Edit mission or vision card"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    <TiltCard
                      max={6}
                      glare={false}
                      className="relative rounded-2xl p-8 md:p-10 h-full backdrop-blur-md border relative pt-10"
                      style={{ 
                        background: "linear-gradient(145deg, rgba(255,255,255,0.4), rgba(255,255,255,0.1))",
                        borderColor: "rgba(255,255,255,0.6)",
                        boxShadow: "0 10px 30px rgba(15,23,42,0.06), inset 0 1px 0 rgba(255,255,255,0.8)"
                      }}
                    >
                      {/* FIX: Icon is now relative and uses mt-[-32px] to pop out safely without being cut */}
                      <div
                        className="relative flex items-center justify-center w-16 h-16 rounded-2xl mx-auto -mt-[58px] mb-6 z-10"
                        style={{
                          background: palette.gradient1,
                          color: palette.white,
                          boxShadow: "0 8px 16px rgba(37,99,235,0.3)",
                        }}
                      >
                        <Icon className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold mb-3 text-center" style={{ color: palette.dark }}>{item.title}</h3>
                        <p className="text-base leading-relaxed text-center" style={{ color: palette.gray }}>{item.desc}</p>
                      </div>
                    </TiltCard>
                  </motion.div>
                </EditableWrap>
              );
            })}
          </div>
        </div>

        {/* ─────────── OUR JOURNEY (VIBRANT & COLORFUL) ─────────── */}
        <div className="mb-16 md:mb-24">
          <SectionHeader badge={content.journeyBadge} title={content.journeyTitle} badgeBg="rgba(244, 162, 97, 0.15)" badgeColor={palette.accent2} />

          <div className="flex justify-end mb-6">
            <SectionAddButton editMode={editMode} label="Add Milestone" type="journey" onAddTarget={onAddTarget} />
          </div>

          <div className="relative max-w-3xl mx-auto">
            <div
              className="absolute left-[19px] md:left-1/2 top-2 bottom-2 w-0.5 md:-translate-x-1/2"
              style={{ background: `linear-gradient(180deg, #2563EB, #0EA5E9, #F59E0B, #8B5CF6)`, opacity: 0.4 }}
            />

            <div className="space-y-8">
              {visibleJourney.map((item, i) => {
                const realIndex = content.journey.findIndex((j) => j.id === item.id);
                const isLeft = i % 2 === 0;
                const colors = [
                  { bg: "#2563EB", glow: "rgba(37,99,235,0.2)" },
                  { bg: "#0EA5E9", glow: "rgba(14,165,233,0.2)" },
                  { bg: "#F59E0B", glow: "rgba(245,158,11,0.2)" },
                  { bg: "#8B5CF6", glow: "rgba(139,92,246,0.2)" }
                ];
                const nodeColor = colors[i % colors.length];

                return (
                  <EditableWrap
                    key={item.id}
                    editMode={editMode}
                    target={{ type: "journeyItem", index: realIndex }}
                    onEditTarget={onEditTarget}
                    onDeleteTarget={onDeleteTarget}
                    canDelete
                    label="Edit journey milestone"
                    className="relative"
                  >
                    <motion.div
                      initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 0.5, delay: i * 0.08 }}
                      className={`relative flex items-start gap-5 md:gap-0 ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}`}
                    >
                      <div
                        className="relative z-10 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white md:absolute md:left-1/2 md:-translate-x-1/2 transition-all hover:scale-110 hover:shadow-xl"
                        style={{ 
                          background: nodeColor.bg, 
                          boxShadow: `0 0 0 5px ${palette.light}, 0 0 0 6px ${nodeColor.bg}40, 0 8px 18px ${nodeColor.bg}55` 
                        }}
                      >
                        {i + 1}
                      </div>

                      <div className={`flex-1 md:w-[calc(50%-40px)] ${isLeft ? "md:pr-2" : "md:pl-2"}`}>
                        <TiltCard
                          max={4}
                          className="rounded-2xl p-5 md:p-6 backdrop-blur-md border transition-all hover:shadow-lg"
                          style={{ 
                            background: "linear-gradient(145deg, rgba(255,255,255,0.4), rgba(255,255,255,0.1))",
                            borderColor: "rgba(255,255,255,0.6)",
                            boxShadow: "0 10px 30px rgba(15,23,42,0.06), inset 0 1px 0 rgba(255,255,255,0.8)",
                            borderLeft: `4px solid ${nodeColor.bg}` 
                          }}
                        >
                          <div className="text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: nodeColor.bg }}>
                            {item.year}
                          </div>
                          <h3 className="text-lg font-bold mb-1.5" style={{ color: palette.dark }}>
                            {item.title}
                          </h3>
                          <p className="text-sm leading-relaxed" style={{ color: palette.gray }}>
                            {item.desc}
                          </p>
                        </TiltCard>
                      </div>
                    </motion.div>
                  </EditableWrap>
                );
              })}
            </div>
          </div>
        </div>

        {/* ─────────── CTA BAND ─────────── */}
        <EditableWrap editMode={editMode} target={{ type: "ctaBand" }} onEditTarget={onEditTarget} label="Edit call to action">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-2xl p-10 md:p-14 text-center"
            style={{ background: palette.gradient1, boxShadow: "0 30px 70px rgba(37,99,235,0.25)" }}
          >
            <div className="absolute top-0 left-0 w-full h-full opacity-20" style={{ background: `radial-gradient(circle at top right, rgba(255,255,255,0.4), transparent 60%)` }} />
            <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full bg-white/10 blur-2xl animate-pulse" />

            <h2 className="relative text-3xl md:text-4xl font-bold mb-4" style={{ color: palette.white, fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}>
              {content.ctaTitle}
            </h2>
            <p className="relative max-w-xl mx-auto mb-8 text-lg" style={{ color: "rgba(255,255,255,0.85)" }}>
              {content.ctaDescription}
            </p>
            <Link
              to={content.ctaButtonLink || "/contact"}
              onClick={(e) => {
                if (editMode) { e.preventDefault(); return; }
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="relative inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              style={{ color: palette.white, background: palette.dark, boxShadow: "0 14px 30px rgba(0,0,0,0.15)" }}
            >
              {content.ctaButtonText}
            </Link>
          </motion.div>
        </EditableWrap>
      </div>

      {/* ─────────── STAFF POPUP OVERLAY ─────────── */}
      <StaffPopup 
        isOpen={selectedStaff !== null} 
        onClose={() => setSelectedStaff(null)} 
        staff={selectedStaff}
      />
    </section>
  );
}