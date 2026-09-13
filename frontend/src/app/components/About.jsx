import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, ChevronRight, Pencil, Plus, Quote, Trash2, X } from "lucide-react";


const theme = {
  ink: "#1E1420",
  inkSoft: "#2D1C2A",
  paper: "#F5EEE2",
  paperDeep: "#E9DCC4",
  card: "#FBF7EE",
  rose: "#B34C6A",
  roseDeep: "#7F2C47",
  roseBright: "#CF6D86",
  gold: "#B98A42",
  goldSoft: "#E7CE9C",
  moss: "#3F5B49",
  mossDeep: "#2C4234",
  text: "#2B1E23",
  textMuted: "#7C6B6F",
  white: "#FFFFFF",
  gradRose: "linear-gradient(135deg, #7F2C47 0%, #B34C6A 55%, #CF6D86 100%)",
  gradInk: "linear-gradient(160deg, #17101C 0%, #2A1826 55%, #3A2130 100%)",
  gradGold: "linear-gradient(135deg, #E7CE9C 0%, #B98A42 100%)",
  gradMoss: "linear-gradient(135deg, #2C4234 0%, #3F5B49 55%, #6E8F76 100%)",
  gradHeroLightRed: "linear-gradient(160deg, #FDEDEE 0%, #FBD9DC 55%, #F6C3C8 100%)",
};

// Rotating accent themes for staff cards / message popup.
const STAFF_ACCENTS = [
  { solid: theme.rose, soft: "rgba(179,76,106,0.10)", ring: "rgba(179,76,106,0.35)", grad: theme.gradRose },
  { solid: theme.gold, soft: "rgba(185,138,66,0.14)", ring: "rgba(185,138,66,0.35)", grad: theme.gradGold },
  { solid: theme.moss, soft: "rgba(63,91,73,0.12)", ring: "rgba(63,91,73,0.35)", grad: theme.gradMoss },
  { solid: theme.inkSoft, soft: "rgba(45,28,42,0.08)", ring: "rgba(45,28,42,0.30)", grad: theme.gradInk },
];

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

// Keep image URLs usable in both local development and production.
// Absolute ImageKit/Cloudinary/etc. URLs are left untouched. Relative
// upload paths are resolved against the backend origin.
function resolveAssetUrl(value) {
  if (!value || typeof value !== "string") return "";

  const trimmed = value.trim();
  if (!trimmed) return "";

  if (/^(https?:)?\/\//i.test(trimmed) || trimmed.startsWith("data:")) {
    return trimmed;
  }

  if (trimmed.startsWith("blob:")) return trimmed;

  if (trimmed.startsWith("/")) {
    return `${API_URL}${trimmed}`;
  }

  return `${API_URL}/${trimmed}`;
}

// The backend has returned the content in slightly different wrappers over
// the life of this project. Accept all known shapes so the public About page
// does not silently fall back to the old hard-coded content.
function extractAboutContent(payload) {
  return (
    payload?.data?.content ||
    payload?.content ||
    payload?.data?.data?.content ||
    payload?.data ||
    null
  );
}

function normalizeAboutImages(saved = {}) {
  const normalized = {
    ...saved,
    storyImageUrl: resolveAssetUrl(saved.storyImageUrl),
    messages: Array.isArray(saved.messages)
      ? saved.messages.map((message) => ({
          ...message,
          image: resolveAssetUrl(message?.image),
        }))
      : saved.messages,
  };

  return normalized;
}

// Torn-paper (deckle edge) clip-paths used for the story photo and the
// message popup — the page's one recurring "material" motif.
const DECKLE_CLIP =
  "polygon(0% 2%,4% 0%,9% 3%,14% 0%,20% 2%,26% 0%,32% 3%,38% 0%,44% 2%,50% 0%,56% 3%,62% 0%,68% 2%,74% 0%,80% 3%,86% 0%,92% 2%,97% 0%,100% 3%,100% 97%,96% 100%,91% 97%,85% 100%,79% 97%,73% 100%,67% 97%,61% 100%,55% 97%,49% 100%,43% 97%,37% 100%,31% 97%,25% 100%,19% 97%,13% 100%,7% 97%,2% 100%,0% 97%)";

const TORN_EDGE_CLIP =
  "polygon(0% 40%,3% 8%,6% 44%,9% 12%,12% 40%,15% 6%,18% 38%,21% 14%,24% 42%,27% 8%,30% 36%,33% 12%,36% 42%,39% 6%,42% 38%,45% 10%,48% 44%,51% 8%,54% 36%,57% 12%,60% 40%,63% 6%,66% 38%,69% 10%,72% 42%,75% 8%,78% 36%,81% 12%,84% 40%,87% 6%,90% 38%,93% 10%,96% 42%,100% 8%,100% 100%,0% 100%)";

// ──────────────────────────────────────────────
// Default content
// NOTE ON THE DATA CONTRACT: every field here is what AdminAbout.jsx reads
// from and writes back to (via PUT /api/site-content/about). If you add a
// new field to a card here, add matching read/write logic in AdminAbout's
// openEditor()/saveSelectedPart(). `visible` on list items controls the
// "show/hide" toggle in the admin editor without deleting the item.
// ──────────────────────────────────────────────
export const defaultAboutContent = {
  pageBadge: "About Our School",
  pageTitle: "Growing Curious Minds, Inspiring Bright Futures",
  pageSubtitle:
    "At Red Rose School, learning goes beyond the classroom. We nurture confident, creative, and compassionate students through meaningful experiences, strong values, and a love for discovery.",
  heroEmblemText: "RR",
  heroEmblemLabel: "Red Rose",

  // Editable via: click any stat coin (target: "statsCard") · "Add Stat" button (add type: "stat")
  stats: [
    { id: 1, value: 2500, suffix: "+", decimals: 0, label: "Students Enrolled", visible: true },
    { id: 2, value: 98.5, suffix: "%", decimals: 1, label: "Board Success Rate", visible: true },
    { id: 3, value: 15, suffix: " yrs", decimals: 0, label: "Excellence in Education", visible: true },
    { id: 4, value: 180, suffix: "+", decimals: 0, label: "Dedicated Faculty", visible: true },
  ],

  storyBadge: "Our Story",
  storyTitle: "Where Passion Meets Purpose",
  storyParagraphs: [
    "Founded with a vision to redefine local education, our school has quickly become a cornerstone of academic excellence in our community. We believe that education is not just about textbooks, but about building character, resilience, and a lifelong love for learning.",
    "Our approach is simple yet profound: provide world-class facilities, encourage creative thinking, and foster an environment where every student feels seen, heard, and empowered to reach their full potential. We prepare students not just for exams, but for life.",
  ],
  storyImageUrl: "",
  storyImageAlt: "Students and teachers on the Red Rose School",
  storyImageZoom: 1,
  storyImageOffsetX: 0,
  storyImageOffsetY: 0,
  storyImageTopTitle: "Our Main School",
  storyImageTopSubtitle: "A Hub of Innovation & Learning",
  storyBadgeYear: "Est. 2010 AD",

  pillarBadge: "Our Core Values",
  pillarTitle: "The Principles That Guide Our Community",
  pillarDescription:
    "More than just words on a wall, these values shape our culture, our teaching, and our relationships every single day.",
  // Editable via: click any card (target: "pillarCard") · "Add Value" button (add type: "pillar")
  pillars: [
    {
      id: 1,
      label: "Academic Excellence",
      desc: "We challenge our students to strive for greatness through a rigorous, engaging, and supportive curriculum.",
      visible: true,
    },
    {
      id: 2,
      label: "Character & Integrity",
      desc: "We believe that true education is built on a foundation of honesty, respect, and empathy for others.",
      visible: true,
    },
    {
      id: 3,
      label: "Global Readiness",
      desc: "Equipping students with the critical thinking skills and cultural awareness needed to thrive in an interconnected world.",
      visible: true,
    },
  ],

  leadershipBadge: "Our Leadership",
  leadershipTitle: "Words From Our Staff",
  leadershipDescription:
    "Hear directly from the dedicated educators and leaders who make our school a home for learning.",

  // Editable via: click any staff card (target: "leadershipMessage", includes photo
  // upload + crop) · "Add Staff" button (add type: "message")
  messages: [
    {
      id: 1,
      name: "Mr. Ram Sharma",
      role: "Principal",
      title: "Creating Opportunities for Every Child",
      message:
        "Our mission is to provide a safe, nurturing, and academically rigorous environment where every child discovers their unique potential. We are committed to not just teaching lessons, but inspiring a generation of thinkers, leaders, and dreamers.",
      image: "",
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
      image: "",
      imageZoom: 1,
      imageOffsetX: 0,
      imageOffsetY: 0,
      visible: true,
    },
  ],

  missionVisionBadge: "Our Focus",
  // Editable via: click any card (target: "missionVision") · "Add Card" button (add type: "missionVision")
  missionVision: [
    {
      id: 1,
      title: "Our Mission",
      desc: "To cultivate a love for learning in every student by providing a challenging, inclusive, and innovative educational environment that promotes academic achievement and personal growth.",
      visible: true,
    },
    {
      id: 2,
      title: "Our Vision",
      desc: "To be recognized as a beacon of educational excellence, producing well-rounded, compassionate, and future-ready graduates who lead with confidence and integrity.",
      visible: true,
    },
  ],

  journeyBadge: "Our Journey",
  journeyTitle: "A Timeline of Growth",
  // Editable via: click any milestone (target: "journeyItem") · "Add Milestone" button (add type: "journey")
  journey: [
    { id: 1, year: "2010 AD", title: "School Founded", desc: "Our school opens with a vision to deliver modern, high-quality education to the local community.", visible: true },
    { id: 2, year: "2015 AD", title: "Expanded To Secondary", desc: "Rising demand pushed the school to extend its academic structure, offering education up to Grade 10.", visible: true },
    { id: 3, year: "2018 AD", title: "Academic Achievements", desc: "Focused classroom teaching and dedicated staff began producing some of the region's strongest exam results.", visible: true },
    { id: 4, year: "Today", title: "A Growing Community", desc: "A vibrant community of over 2,500 students, 180+ educators, and a shared focus on holistic excellence.", visible: true },
  ],

  ctaTitle: "Ready to Join Our Community?",
  ctaDescription: "Experience our school, meet our dedicated faculty, and see firsthand how we nurture the leaders of tomorrow.",
  ctaButtonText: "Schedule a Visit",
  ctaButtonLink: "/contact",
};

// ──────────────────────────────────────────────
// Helpers (unchanged logic)
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

// ──────────────────────────────────────────────
// Global scoped styles: fonts, texture, motion & focus rules
// ──────────────────────────────────────────────
function LedgerStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,500&family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');

      .rr-about { font-family: 'Inter', system-ui, -apple-system, sans-serif; --rr-gold: ${theme.gold}; }
      .rr-serif { font-family: 'Fraunces', Georgia, 'Times New Roman', serif; }
      .rr-mono { font-family: 'Space Grotesk', 'IBM Plex Mono', monospace; }

      .rr-dropcap::first-letter {
        font-family: 'Fraunces', serif;
        font-weight: 600;
        font-size: 3.4rem;
        float: left;
        line-height: 0.82;
        padding-right: 0.4rem;
        padding-top: 0.3rem;
        color: ${theme.rose};
      }

      .rr-about a:focus-visible,
      .rr-about button:focus-visible {
        outline: 2px solid var(--rr-gold);
        outline-offset: 3px;
        border-radius: 6px;
      }

      @keyframes rr-float { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-10px) rotate(1deg); } }
      @keyframes rr-drift { 0% { transform: translate(0,0); } 50% { transform: translate(-1.5%,1.5%); } 100% { transform: translate(0,0); } }
      .rr-emblem { animation: rr-float 7s ease-in-out infinite; }
      .rr-grain { animation: rr-drift 18s ease-in-out infinite; }

      @media (prefers-reduced-motion: reduce) {
        .rr-about *, .rr-about *::before, .rr-about *::after {
          animation-duration: 0.001ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.001ms !important;
        }
      }
    `}</style>
  );
}

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
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.30), transparent 55%)`,
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
// Every editable block on the page is one of these two wrappers:
//   <EditableWrap>     — hover reveals a pencil (and a trash can if
//                         canDelete is set) that calls onEditTarget/
//                         onDeleteTarget with a `target` object.
//   <SectionAddButton> — a visible "+ Add …" button (edit mode only)
//                         that calls onAddTarget(type).
// AdminAbout.jsx is the only thing that needs to know what each
// `target.type` string means.
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
      style={{ background: "rgba(255,255,255,0.9)", color: theme.rose, border: `1px solid ${theme.gold}55` }}
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
      style={{ background: "#FBE3E7", color: "#B34C6A", border: `2px solid ${theme.white}` }}
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
      className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5"
      style={{ color: theme.white, background: theme.gradRose, boxShadow: `0 10px 24px ${theme.rose}40` }}
    >
      <Plus className="w-4 h-4" />
      {label}
    </button>
  );
}

// ──────────────────────────────────────────────
// Section eyebrow + heading — the page's recurring type treatment
// ──────────────────────────────────────────────
function SectionIntro({ eyebrow, title, description, tone = "dark", align = "left" }) {
  const light = tone === "light";
  const isCenter = align === "center";
  return (
    <div className={isCenter ? "text-center max-w-2xl mx-auto" : ""}>
      <div className={`flex items-center gap-3 mb-4 ${isCenter ? "justify-center" : ""}`}>
        <span className="h-px w-10" style={{ background: theme.gold }} />
        <span className="rr-mono text-[11px] font-semibold uppercase tracking-[0.28em]" style={{ color: light ? theme.goldSoft : theme.rose }}>
          {eyebrow}
        </span>
        {!isCenter && <span className="h-px flex-1 max-w-[80px]" style={{ background: light ? "rgba(231,206,156,0.35)" : "rgba(179,76,106,0.25)" }} />}
      </div>
      <h2
        className="rr-serif text-3xl sm:text-4xl md:text-[2.75rem] font-semibold leading-[1.08] tracking-tight"
        style={{ color: light ? theme.white : theme.ink }}
      >
        {title}
      </h2>
      {description && (
        <p className="mt-4 max-w-xl text-base leading-7" style={{ color: light ? "rgba(245,238,226,0.72)" : theme.textMuted }}>
          {description}
        </p>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────
// STAFF MESSAGE POPUP — redesigned as an "open letter" card
// ──────────────────────────────────────────────
function StaffPopup({ isOpen, onClose, staff, accent }) {
  if (!isOpen || !staff) return null;
  const t = accent || STAFF_ACCENTS[0];

  return (
    <AnimatePresence>
      <motion.div
        key="staff-popup-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="rr-about fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6"
        style={{ background: "rgba(15,9,17,0.78)", backdropFilter: "blur(10px)" }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 40, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.94, y: 20, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto"
          style={{ filter: `drop-shadow(0 40px 70px rgba(0,0,0,0.45))` }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative" style={{ clipPath: DECKLE_CLIP, background: theme.card }}>
            {/* ribbon header */}
            <div className="relative px-9 pt-9 pb-14" style={{ background: t.grad }}>
              <div className="absolute inset-0 opacity-[0.12] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, #fff 1.4px, transparent 1.7px)", backgroundSize: "18px 18px" }} />
              <button
                onClick={onClose}
                className="absolute top-5 right-5 z-30 w-9 h-9 flex items-center justify-center rounded-full text-white transition-transform duration-300 hover:rotate-90"
                style={{ background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.3)" }}
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>

              <Quote className="w-8 h-8 text-white/50 mb-4" strokeWidth={1.6} />
              <div className="rr-mono text-[10px] uppercase tracking-[0.28em] text-white/70">Message from our {staff.role}</div>

              <div className="mt-6 flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0"
                  style={{ border: "3px solid rgba(255,255,255,0.85)", boxShadow: "0 10px 22px rgba(0,0,0,0.3)" }}
                >
                  {staff.image ? (
                    <img src={staff.image} alt={staff.name} style={getAdjustedImageStyle(staff)} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/90 rr-serif text-xl font-semibold" style={{ background: "rgba(255,255,255,0.15)" }}>
                      {staff.name?.split(" ").map((n) => n[0]).slice(0, 2).join("") || "RR"}
                    </div>
                  )}
                </div>
                <div>
                  <div className="rr-serif text-xl font-semibold text-white">{staff.name}</div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-white/70">{staff.role}</div>
                </div>
              </div>
            </div>

            {/* letter body */}
            <div className="px-9 md:px-11 pb-11 -mt-7">
              <div className="rounded-2xl bg-white px-7 py-8" style={{ boxShadow: "0 18px 40px rgba(30,20,32,0.14)" }}>
                <h3 className="rr-serif text-2xl font-semibold" style={{ color: theme.ink }}>
                  {staff.title}
                </h3>
                <p className="mt-4 text-[15px] leading-relaxed" style={{ color: theme.textMuted }}>
                  {staff.message}
                </p>
              </div>

              <button
                onClick={onClose}
                className="mt-7 w-full inline-flex items-center justify-center gap-2 rounded-full py-3.5 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5"
                style={{ background: theme.gradInk, boxShadow: "0 14px 28px rgba(0,0,0,0.25)" }}
              >
                Close message
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// ABOUT PAGE
//
// Props:
//   editMode         — when true, every block shows its pencil/trash/add
//                       controls (AdminAbout renders this with editMode).
//   contentOverride  — AdminAbout passes its live in-memory form here so
//                       the preview updates instantly with no API round trip.
//   onEditTarget(target)   — called when a pencil icon is clicked.
//   onDeleteTarget(target) — called when a trash icon is clicked.
//   onAddTarget(type)      — called when a "+ Add …" button is clicked.
// ══════════════════════════════════════════════════════════════════════════
export default function About({
  editMode = false,
  contentOverride = null,
  onEditTarget = () => {},
  onDeleteTarget = () => {},
  onAddTarget = () => {},
}) {
  const [content, setContent] = useState(() =>
    contentOverride
      ? mergeAboutContent(normalizeAboutImages(contentOverride))
      : mergeAboutContent({
          ...defaultAboutContent,
          storyImageUrl: "",
          messages: defaultAboutContent.messages.map((message) => ({
            ...message,
            image: "",
          })),
        })
  );
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isLoading, setIsLoading] = useState(!contentOverride);

  useEffect(() => {
    if (contentOverride) {
      setContent(mergeAboutContent(normalizeAboutImages(contentOverride)));
      return undefined;
    }
    let alive = true;
    const loadAboutContent = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${API_URL}/api/site-content/about`, {
          timeout: 15000,
          headers: { Accept: "application/json" },
        });
        if (!alive) return;

        const saved = extractAboutContent(res.data);

        if (saved && typeof saved === "object") {
          setContent(mergeAboutContent(normalizeAboutImages(saved)));
        } else {
          console.warn(
            "About content API returned no usable content.",
            res.data
          );
        }
      } catch (error) {
        console.error("About content load error:", error);
      } finally {
        if (alive) setIsLoading(false);
      }
    };
    loadAboutContent();
    return () => {
      alive = false;
    };
  }, [contentOverride]);

  if (isLoading) {
    return (
      <section className="min-h-[70vh] flex items-center justify-center" style={{ background: theme.paper }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-11 h-11 rounded-full border-[3px] animate-spin" style={{ borderColor: theme.paperDeep, borderTopColor: theme.rose }} />
          <p className="rr-mono text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: theme.textMuted }}>
            Loading About page…
          </p>
        </div>
      </section>
    );
  }

  const visibleStats = (content.stats || []).filter((s) => s.visible !== false);
  const visiblePillars = (content.pillars || []).filter((p) => p.visible !== false);
  const visibleStaff = (content.messages || []).filter((m) => m.visible !== false);
  const visibleMissionVision = (content.missionVision || []).filter((mv) => mv.visible !== false);
  const visibleJourney = (content.journey || []).filter((j) => j.visible !== false);
  const pillarAccents = [theme.rose, theme.gold, theme.moss];

  return (
    <section className="rr-about relative py-10 md:py-16" style={{ background: theme.paper }}>
      <LedgerStyles />

      <div className="relative z-10 max-w-[1320px] mx-auto px-5 sm:px-8">
        {/* ═══════════════ HERO ═══════════════ */}
        <EditableWrap editMode={editMode} target={{ type: "pageHeader" }} onEditTarget={onEditTarget} label="Edit page header">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-[2rem] md:rounded-[2.75rem]"
            style={{ background: theme.gradHeroLightRed, boxShadow: "0 40px 90px rgba(179,76,106,0.22)" }}
          >
            {/* texture */}
            <div className="rr-grain absolute -inset-10 opacity-[0.06] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, #7F2C47 1px, transparent 1.4px)", backgroundSize: "22px 22px" }} />
            <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-[100px] opacity-30 pointer-events-none" style={{ background: theme.roseBright }} />
            <div className="absolute -bottom-28 -left-16 w-72 h-72 rounded-full blur-[100px] opacity-20 pointer-events-none" style={{ background: theme.gold }} />

            <div className="relative z-10 grid gap-12 items-center px-7 py-14 sm:px-10 sm:py-16 lg:px-16 lg:py-20">
              <div>
                <div className="flex items-center gap-3">
                  <span className="h-px w-10" style={{ background: theme.roseDeep }} />
                  <span className="rr-mono text-[11px] font-semibold uppercase tracking-[0.3em]" style={{ color: theme.roseDeep }}>
                    {content.pageBadge}
                  </span>
                </div>

                <h1
                  className="rr-serif mt-7 text-[2.5rem] sm:text-5xl lg:text-[3.75rem] font-semibold leading-[1.04] tracking-tight max-w-xl"
                  style={{ color: theme.ink }}
                >
                  {content.pageTitle}
                </h1>

                <p className="mt-6 max-w-lg text-base sm:text-lg leading-8" style={{ color: theme.textMuted }}>
                  {content.pageSubtitle}
                </p>

                <div className="mt-9 flex items-center gap-3">
                  <span className="rr-mono text-[10px] font-semibold uppercase tracking-[0.3em] px-4 py-2 rounded-full" style={{ color: theme.roseDeep, border: `1px solid ${theme.roseDeep}45` }}>
                    {content.storyBadgeYear}
                  </span>
                </div>
              </div>


            </div>

            {/* torn edge into the page */}
            <div className="absolute bottom-0 left-0 right-0 h-10 md:h-14" style={{ background: theme.paper, clipPath: TORN_EDGE_CLIP }} />
          </motion.div>
        </EditableWrap>

        {/* ═══════════════ STAT COINS (overlapping the torn edge) ═══════════════
             Fully editable: hover any coin to edit or delete it, and the
             "Add Stat" button appears here in edit mode. */}
        <div className="relative z-20 -mt-7 md:-mt-9 mb-16 md:mb-24 px-4 sm:px-8">
          {editMode && (
            <div className="flex justify-end mb-4">
              <SectionAddButton editMode={editMode} label="Add Stat" type="stat" onAddTarget={onAddTarget} />
            </div>
          )}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {visibleStats.map((stat, i) => {
              const realIndex = content.stats.findIndex((item) => item.id === stat.id);

              return (
                <EditableWrap
                  key={stat.id || i}
                  editMode={editMode}
                  target={{ type: "statsCard", index: realIndex }}
                  onEditTarget={onEditTarget}
                  onDeleteTarget={onDeleteTarget}
                  canDelete={content.stats.length > 1}
                  label="Edit stat card"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                    className="rounded-2xl px-5 py-6 text-center"
                    style={{ background: theme.card, border: `1px solid ${theme.paperDeep}`, boxShadow: "0 16px 34px rgba(30,20,32,0.10)" }}
                  >
                    <div className="rr-serif text-2xl sm:text-3xl font-semibold" style={{ color: theme.rose }}>
                      <CountUp value={stat.value} suffix={stat.suffix} decimals={stat.decimals || 0} />
                    </div>
                    <div className="mt-2 rr-mono text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color: theme.textMuted }}>
                      {stat.label}
                    </div>
                  </motion.div>
                </EditableWrap>
              );
            })}
          </div>
        </div>

        {/* ═══════════════ OUR STORY ═══════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="grid lg:grid-cols-[0.95fr_1.05fr] gap-12 md:gap-16 items-center mb-20 md:mb-28"
        >
          <EditableWrap editMode={editMode} target={{ type: "storyImage" }} onEditTarget={onEditTarget} icon={Camera} label="Change story image">
            <TiltCard max={5} glare={false} className="relative">
              <div style={{ filter: "drop-shadow(0 26px 46px rgba(30,20,32,0.28))" }}>
                <div
                  className="relative aspect-[4/3] -rotate-1"
                  style={{ clipPath: DECKLE_CLIP, background: theme.paperDeep }}
                >
                  {content.storyImageUrl ? (
                    <img
                      src={content.storyImageUrl}
                      alt={content.storyImageAlt || "School"}
                      draggable={false}
                      className="absolute inset-0"
                      style={getAdjustedImageStyle(content)}
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ color: theme.textMuted }}>
                      <span className="rr-mono text-[10px] font-semibold uppercase tracking-[0.2em]">Add Story Image</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent pointer-events-none" />

                  <EditableWrap editMode={editMode} target={{ type: "storyImageText" }} onEditTarget={onEditTarget} label="Edit image caption" className="absolute inset-0">
                    <div className="absolute left-7 right-7 bottom-7">
                      <div className="rr-serif text-white text-xl font-semibold">{content.storyImageTopTitle}</div>
                      <div className="mt-1 text-white/70 text-sm">{content.storyImageTopSubtitle}</div>
                    </div>
                  </EditableWrap>
                </div>
              </div>

              {/* wax-seal badge */}
              <div
                className="absolute -bottom-6 -right-4 sm:right-4 w-24 h-24 rounded-full flex flex-col items-center justify-center rotate-[-8deg]"
                style={{ background: theme.gradGold, boxShadow: "0 16px 30px rgba(185,138,66,0.45), inset 0 2px 4px rgba(255,255,255,0.4)", border: `3px solid ${theme.card}` }}
              >
                <span className="rr-serif text-[11px] font-bold leading-tight text-center px-2" style={{ color: theme.ink }}>
                  {content.storyBadgeYear}
                </span>
              </div>
            </TiltCard>
          </EditableWrap>

          <EditableWrap editMode={editMode} target={{ type: "storyText" }} onEditTarget={onEditTarget} label="Edit story text">
            <div className="lg:pl-2">
              <SectionIntro eyebrow={content.storyBadge} title={content.storyTitle} />

              <div className="mt-7 space-y-5 max-w-2xl">
                {(content.storyParagraphs || []).map((paragraph, idx) => (
                  <p key={idx} className={`text-base md:text-lg leading-8 ${idx === 0 ? "rr-dropcap" : ""}`} style={{ color: theme.textMuted }}>
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                {["Student-first learning", "Strong values", "Future-ready skills"].map((tag) => (
                  <span
                    key={tag}
                    className="rr-mono rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.08em]"
                    style={{ color: theme.rose, border: `1px solid ${theme.rose}30`, background: "rgba(179,76,106,0.05)" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </EditableWrap>
        </motion.div>

        {/* ═══════════════ CORE VALUES ═══════════════ */}
        <div className="mb-20 md:mb-28">
          <EditableWrap editMode={editMode} target={{ type: "pillarHeader" }} onEditTarget={onEditTarget} label="Edit pillar header">
            <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-8 items-end mb-10">
              <SectionIntro eyebrow={content.pillarBadge} title={content.pillarTitle} />
              <p className="max-w-xl lg:justify-self-end lg:text-right text-base leading-7" style={{ color: theme.textMuted }}>
                {content.pillarDescription}
              </p>
            </div>
          </EditableWrap>

          <div className="flex justify-end mb-6">
            <SectionAddButton editMode={editMode} label="Add Value" type="pillar" onAddTarget={onAddTarget} />
          </div>

          <div className="grid md:grid-cols-3 gap-5 md:gap-6">
            {visiblePillars.map((p, i) => {
              const realIndex = content.pillars.findIndex((item) => item.id === p.id);
              const accent = pillarAccents[i % pillarAccents.length];
              const initial = (p.label || "R").trim().charAt(0).toUpperCase();

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
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.45, delay: i * 0.08 }}
                  >
                    <TiltCard
                      max={5}
                      glare={false}
                      className="relative min-h-[260px] rounded-[1.5rem] p-8 overflow-hidden transition-all duration-300 hover:-translate-y-1.5"
                      style={{ background: theme.card, border: `1px solid ${theme.paperDeep}`, boxShadow: "0 16px 36px rgba(30,20,32,0.08)" }}
                    >
                      {/* hanging tab */}
                      <div
                        className="absolute -top-px left-8 w-10 h-3 rounded-b-md"
                        style={{ background: accent }}
                      />
                      {/* ghost initial watermark */}
                      <span
                        className="rr-serif absolute -top-3 right-4 text-[7rem] font-semibold leading-none select-none pointer-events-none"
                        style={{ color: accent, opacity: 0.07 }}
                      >
                        {initial}
                      </span>

                      <div className="relative z-10 flex flex-col h-full pt-3">
                        <span className="h-1 w-10 rounded-full mb-8" style={{ background: accent }} />
                        <h3 className="rr-serif text-xl sm:text-2xl font-semibold tracking-tight" style={{ color: theme.ink }}>
                          {p.label}
                        </h3>
                        <p className="mt-4 text-sm leading-7" style={{ color: theme.textMuted }}>
                          {p.desc}
                        </p>
                      </div>
                    </TiltCard>
                  </motion.div>
                </EditableWrap>
              );
            })}
          </div>
        </div>

        {/* ═══════════════ STAFF — CARD CATALOG ═══════════════ */}
        <div className="relative -mx-5 sm:-mx-8 mb-20 md:mb-28 overflow-hidden">
          <div className="relative px-5 sm:px-8 py-16 md:py-20" style={{ background: theme.gradInk }}>
            <div className="rr-grain absolute -inset-10 opacity-[0.05] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1.4px)", backgroundSize: "22px 22px" }} />

            <div className="relative z-10 max-w-[1320px] mx-auto">
              <EditableWrap editMode={editMode} target={{ type: "leadershipHeader" }} onEditTarget={onEditTarget} label="Edit leadership header">
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-7 mb-10">
                  <SectionIntro eyebrow={content.leadershipBadge} title={content.leadershipTitle} tone="light" />
                  <p className="max-w-sm text-base leading-7 lg:text-right" style={{ color: "rgba(245,238,226,0.68)" }}>
                    {content.leadershipDescription}
                  </p>
                </div>
              </EditableWrap>

              <div className="flex justify-end mb-8">
                <SectionAddButton editMode={editMode} label="Add Staff" type="message" onAddTarget={onAddTarget} />
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
                {visibleStaff.map((person, i) => {
                  const realIndex = content.messages.findIndex((m) => m.id === person.id);
                  const t = STAFF_ACCENTS[i % STAFF_ACCENTS.length];
                  const tilt = i % 2 === 0 ? "-rotate-1" : "rotate-1";
                  const preview = person.message && person.message.length > 120 ? `${person.message.slice(0, 120).trim()}…` : person.message;

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
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.5, delay: i * 0.07 }}
                      >
                        <button type="button" onClick={() => setSelectedStaff({ ...person, __accentIndex: i })} className="w-full text-left group">
                          <div className={`relative ${tilt} hover:rotate-0 transition-transform duration-300`}>
                            {/* brass pin */}
                            <div
                              className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-5 h-5 rounded-full"
                              style={{ background: theme.gradGold, boxShadow: "0 4px 10px rgba(185,138,66,0.5)" }}
                            />
                            <TiltCard
                              max={4}
                              glare={false}
                              className="rounded-2xl px-6 pt-8 pb-6"
                              style={{ background: theme.card, boxShadow: "0 18px 40px rgba(0,0,0,0.28)" }}
                            >
                              <div className="flex flex-col items-center text-center">
                                <div
                                  className="w-20 h-20 rounded-full overflow-hidden mb-4"
                                  style={{ border: `3px solid ${t.solid}30`, boxShadow: `0 10px 22px ${t.solid}25` }}
                                >
                                  {person.image ? (
                                    <img src={person.image} alt={person.name} style={getAdjustedImageStyle(person)} />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center rr-serif text-2xl font-semibold" style={{ background: t.soft, color: t.solid }}>
                                      {person.name?.split(" ").map((n) => n[0]).slice(0, 2).join("") || "RR"}
                                    </div>
                                  )}
                                </div>

                                <h3 className="rr-serif text-lg font-semibold" style={{ color: theme.ink }}>
                                  {person.name}
                                </h3>
                                <span
                                  className="rr-mono mt-2 text-[10px] font-semibold uppercase tracking-[0.14em] px-3 py-1 rounded-full"
                                  style={{ color: t.solid, background: t.soft }}
                                >
                                  {person.role}
                                </span>

                                <p className="mt-4 text-sm leading-6" style={{ color: theme.textMuted }}>
                                  {preview}
                                </p>

                                <span
                                  className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold transition-transform duration-300 group-hover:translate-x-1"
                                  style={{ color: t.solid }}
                                >
                                  Read message
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </span>
                              </div>
                            </TiltCard>
                          </div>
                        </button>
                      </motion.div>
                    </EditableWrap>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════ MISSION & VISION — OPEN BOOK SPREAD ═══════════════ */}
        <div className="mb-20 md:mb-28">
          <EditableWrap editMode={editMode} target={{ type: "missionVisionBadge" }} onEditTarget={onEditTarget} label="Edit mission/vision badge">
            <SectionIntro eyebrow={content.missionVisionBadge} title="What Shapes Every Decision We Make" align="center" />
          </EditableWrap>

          <div className="flex justify-end mt-6 mb-8">
            <SectionAddButton editMode={editMode} label="Add Card" type="missionVision" onAddTarget={onAddTarget} />
          </div>

          <div className="relative max-w-4xl mx-auto rounded-[1.75rem] overflow-hidden" style={{ background: theme.card, boxShadow: "0 30px 60px rgba(30,20,32,0.14)" }}>
            {/* book spine */}
            <div
              className="hidden md:block absolute top-0 bottom-0 left-1/2 w-6 -translate-x-1/2 z-10"
              style={{ background: `linear-gradient(90deg, rgba(30,20,32,0.12), rgba(30,20,32,0.02) 30%, transparent 50%, rgba(30,20,32,0.02) 70%, rgba(30,20,32,0.12))` }}
            />
            <div className="grid md:grid-cols-2">
              {visibleMissionVision.map((item, i) => {
                const realIndex = content.missionVision.findIndex((mv) => mv.id === item.id);
                const isLeft = i % 2 === 0;

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
                      initial={{ opacity: 0, x: isLeft ? -16 : 16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.25 }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      className={`p-9 md:p-12 ${isLeft ? "md:pr-10" : "md:pl-10"} ${i % 2 === 1 ? "border-t md:border-t-0" : ""}`}
                      style={{ borderColor: theme.paperDeep }}
                    >
                      <span className="rr-mono text-[11px] font-semibold uppercase tracking-[0.24em]" style={{ color: theme.gold }}>
                        {String(i + 1).padStart(2, "0")} — Chapter
                      </span>
                      <h3 className="rr-serif mt-3 text-2xl font-semibold" style={{ color: theme.ink }}>
                        {item.title}
                      </h3>
                      <p className="mt-4 text-base leading-relaxed" style={{ color: theme.textMuted }}>
                        {item.desc}
                      </p>
                    </motion.div>
                  </EditableWrap>
                );
              })}
            </div>
          </div>
        </div>

        {/* ═══════════════ JOURNEY — LEDGER SPINE TIMELINE ═══════════════ */}
        <div className="mb-20 md:mb-28">
          <EditableWrap editMode={editMode} target={{ type: "journeyBadge" }} onEditTarget={onEditTarget} label="Edit journey badge">
            <SectionIntro eyebrow={content.journeyBadge} title={content.journeyTitle} align="center" />
          </EditableWrap>

          <div className="flex justify-end mt-6 mb-10">
            <SectionAddButton editMode={editMode} label="Add Milestone" type="journey" onAddTarget={onAddTarget} />
          </div>

          <div className="relative max-w-3xl mx-auto">
            <div
              className="absolute left-[7px] md:left-1/2 top-2 bottom-2 w-[2px] md:-translate-x-1/2"
              style={{ background: theme.gradGold, opacity: 0.4 }}
            />

            <div className="space-y-8">
              {visibleJourney.map((item, i) => {
                const realIndex = content.journey.findIndex((j) => j.id === item.id);
                const isLeft = i % 2 === 0;

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
                        className="relative z-10 flex-shrink-0 w-4 h-4 mt-1.5 rounded-full md:absolute md:left-1/2 md:-translate-x-1/2"
                        style={{ background: theme.gradGold, boxShadow: `0 0 0 5px ${theme.paper}, 0 0 0 6px ${theme.gold}35, 0 6px 14px rgba(185,138,66,0.5)` }}
                      />

                      <div className={`flex-1 md:w-[calc(50%-40px)] ${isLeft ? "md:pr-2" : "md:pl-2"}`}>
                        <TiltCard
                          max={4}
                          glare={false}
                          className="rounded-2xl p-6"
                          style={{ background: theme.card, border: `1px solid ${theme.paperDeep}`, boxShadow: "0 14px 32px rgba(30,20,32,0.08)" }}
                        >
                          <div className="rr-mono text-xs font-bold uppercase tracking-[0.16em]" style={{ color: theme.rose }}>
                            {item.year}
                          </div>
                          <h3 className="rr-serif mt-2 text-lg font-semibold" style={{ color: theme.ink }}>
                            {item.title}
                          </h3>
                          <p className="mt-2 text-sm leading-relaxed" style={{ color: theme.textMuted }}>
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

        {/* ═══════════════ CTA ═══════════════ */}
        <EditableWrap editMode={editMode} target={{ type: "ctaBand" }} onEditTarget={onEditTarget} label="Edit call to action">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-[2rem] p-10 md:p-16 text-center"
            style={{ background: theme.gradInk, boxShadow: "0 34px 70px rgba(30,20,32,0.35)" }}
          >
            <div className="absolute inset-0 rounded-[2rem] pointer-events-none" style={{ border: `1px solid ${theme.goldSoft}35`, margin: "10px" }} />
            <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full blur-[100px] opacity-30 pointer-events-none" style={{ background: theme.rose }} />

            <span className="rr-mono relative text-[11px] font-semibold uppercase tracking-[0.3em]" style={{ color: theme.goldSoft }}>
              Visit Us
            </span>
            <h2 className="rr-serif relative mt-4 text-3xl md:text-4xl font-semibold" style={{ color: theme.white }}>
              {content.ctaTitle}
            </h2>
            <p className="relative max-w-xl mx-auto mt-4 mb-9 text-base md:text-lg" style={{ color: "rgba(245,238,226,0.72)" }}>
              {content.ctaDescription}
            </p>
            <Link
              to={content.ctaButtonLink || "/contact"}
              onClick={(e) => {
                if (editMode) {
                  e.preventDefault();
                  return;
                }
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="relative inline-flex items-center gap-2 px-9 py-4 rounded-full text-base font-bold transition-all duration-300 hover:-translate-y-1"
              style={{ color: theme.ink, background: theme.gradGold, boxShadow: "0 18px 36px rgba(185,138,66,0.4)" }}
            >
              {content.ctaButtonText}
            </Link>
          </motion.div>
        </EditableWrap>
      </div>

      {/* ═══════════════ STAFF POPUP ═══════════════ */}
      <StaffPopup
        isOpen={selectedStaff !== null}
        onClose={() => setSelectedStaff(null)}
        staff={selectedStaff}
        accent={STAFF_ACCENTS[(selectedStaff?.__accentIndex ?? 0) % STAFF_ACCENTS.length]}
      />
    </section>
  );
}
