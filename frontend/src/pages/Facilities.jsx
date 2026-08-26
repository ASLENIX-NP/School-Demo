// Facilities.jsx
import { useEffect, useState } from "react";
import api from "../lib/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bus,
  Camera,
  MapPin,
  Pencil,
  Plus,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";

// ---------------------------------------------------------------------
// Palette
// ---------------------------------------------------------------------
const palette = {
  primary: "#2A1023",
  secondary: "#3D6B54",
  accent: "#D7AD55",
  accent2: "#A92D4D",
  light: "#F6EFE2",
  dark: "#211523",
  gray: "#76686D",
  lightGray: "#E9DED0",
  white: "#FFFFFF",
  gradient1: "linear-gradient(135deg, #2A1023 0%, #42152C 100%)",
  gradient2: "linear-gradient(135deg, #D7AD55 0%, #EFD89B 100%)",
  gradient3: "linear-gradient(135deg, #A92D4D 0%, #2A1023 100%)",
};

const facilityTints = [
  palette.primary,
  palette.secondary,
  palette.accent2,
  "#8B5CF6",
  "#14B8A6",
  palette.primary,
];

// ---------------------------------------------------------------------
// Default content
// ---------------------------------------------------------------------
export const defaultFacilitiesContent = {
  badgeText: "Our Campus",
  title: "Spaces Built For How Students Actually Learn",
  highlightedText: "Learn",
  subtitle:
    "Red Rose Boarding School provides modern facilities that create an engaging, practical, and technology-driven learning environment for every student.",
  learnMoreText: "Learn More",
  highlightsTitle: "Facility Highlights",

  // Editable intro section
  introBadge: "Life Beyond The Classroom",
  introTitle: "Places that make learning feel real.",
  introHighlightedText: "learning",
  introDescription:
    "Our campus is designed as more than a collection of rooms. Each space gives students an opportunity to read, experiment, create, perform, travel safely, stay active, and discover the confidence that comes from doing things for themselves.",

  // Editable Facility Highlights section heading
  sectionKicker: "Explore Our Campus",
  sectionTitle: "Facility Highlights",
  sectionHighlightedText: "Highlights",
  sectionSubtitle:
    "Explore the spaces and services that support the academic, creative, physical, and social development of our students.",

  facilities: [
    {
      id: 1,
      title: "Digital Library",
      category: "Knowledge Hub",
      description:
        "A quiet, well-stocked reading room alongside e-books, journals, and research databases students can reach from any classroom.",
      details:
        "Students can browse physical shelves or sign into digital collections — e-books, academic journals, reference databases, and curated learning platforms — all from a single login.",
      imageUrl: "",
      imageZoom: 1,
      imageOffsetX: 0,
      imageOffsetY: 0,
      visible: true,
      color: palette.primary,
    },
    {
      id: 2,
      title: "Tech Lab",
      category: "Innovation",
      description:
        "A 40-seat computer lab where students get hands-on with the software and skills their exams — and future jobs — will actually ask for.",
      details:
        "40+ networked computers, programming environments, office software, and multimedia tools, with a teacher-led session every week from Grade 6 upward.",
      imageUrl: "",
      imageZoom: 1,
      imageOffsetX: 0,
      imageOffsetY: 0,
      visible: true,
      color: palette.secondary,
    },
    {
      id: 3,
      title: "Science Center",
      category: "Discovery",
      description:
        "Separate Physics, Chemistry, and Biology labs where the textbook diagram finally becomes something a student can hold.",
      details:
        "Fully equipped, separately ventilated labs for each science stream, with safety gear, demonstration benches, and enough apparatus for every student to run their own experiment — not just watch one.",
      imageUrl: "",
      imageZoom: 1,
      imageOffsetX: 0,
      imageOffsetY: 0,
      visible: true,
      color: palette.accent2,
    },
    {
      id: 4,
      title: "School Transport",
      category: "Safety & Comfort",
      description:
        "Monitored bus routes across Hetauda, so getting to school safely isn't something a family has to solve on their own.",
      details:
        "Red Rose Boarding School provides safe transportation with experienced drivers, route management, student safety monitoring, and comfortable buses for daily travel.",
      imageUrl: "",
      imageZoom: 1,
      imageOffsetX: 0,
      imageOffsetY: 0,
      visible: true,
      color: "#8B5CF6",
      busRoutes: [
        {
          id: 1,
          name: "Route 1",
          from: "Hetauda – New Bus Park",
          to: "School Campus",
          stops: ["New Bus Park", "Chandranagar", "Bhanu Chowk", "School Campus"],
        },
        {
          id: 2,
          name: "Route 2",
          from: "Hetauda – Old Bus Park",
          to: "School Campus",
          stops: ["Old Bus Park", "Milan Chowk", "Bishnupur", "School Campus"],
        },
      ],
    },
    {
      id: 5,
      title: "Performance Hall",
      category: "Arts & Culture",
      description:
        "A full auditorium for assemblies, cultural programs, and the kind of stage time that builds confidence a classroom can't.",
      details:
        "Tiered seating, a proper sound and lighting rig, and a stage large enough for full-school assemblies, exhibitions, and end-of-year cultural programs.",
      imageUrl: "",
      imageZoom: 1,
      imageOffsetX: 0,
      imageOffsetY: 0,
      visible: true,
      color: "#14B8A6",
    },
    {
      id: 6,
      title: "Sports Complex",
      category: "Fitness & Wellness",
      description:
        "Open playgrounds and indoor courts where football, basketball, and volleyball teams train under proper coaching.",
      details:
        "A full-size outdoor ground plus an indoor court, used for daily PE periods, house tournaments, and after-school training ahead of zonal and district competitions.",
      imageUrl: "",
      imageZoom: 1,
      imageOffsetX: 0,
      imageOffsetY: 0,
      visible: true,
      color: palette.primary,
    },
  ],
};

// ---------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------
function clampNumber(value, min, max, fallback) {
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue)) return fallback;
  return Math.min(max, Math.max(min, numberValue));
}

function getFacilityImageStyle(facility = {}) {
  const zoom = clampNumber(facility.imageZoom, 1, 3, 1);
  const x = clampNumber(facility.imageOffsetX, -60, 60, 0);
  const y = clampNumber(facility.imageOffsetY, -60, 60, 0);
  const objectX = Math.min(100, Math.max(0, 50 - x));
  const objectY = Math.min(100, Math.max(0, 50 - y));
  return {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: `${objectX}% ${objectY}%`,
    transform: `scale(${zoom})`,
    transformOrigin: "center center",
  };
}

function normalizeFacilities(facilities) {
  if (!Array.isArray(facilities)) return defaultFacilitiesContent.facilities;
  return facilities.map((facility, index) => ({
    ...(defaultFacilitiesContent.facilities[index] || {}),
    ...facility,
    id: facility.id || Date.now() + index,
    imageZoom: clampNumber(facility.imageZoom, 1, 3, 1),
    imageOffsetX: clampNumber(facility.imageOffsetX, -60, 60, 0),
    imageOffsetY: clampNumber(facility.imageOffsetY, -60, 60, 0),
    visible: facility.visible !== false,
    busRoutes: facility.busRoutes || [],
    color: facility.color || facilityTints[index % facilityTints.length],
  }));
}

export function mergeFacilitiesContent(saved = {}) {
  return {
    ...defaultFacilitiesContent,
    ...(saved || {}),
    facilities: normalizeFacilities(saved.facilities),
  };
}

function HighlightedTitle({ title, highlightedText }) {
  if (!highlightedText || !title.includes(highlightedText)) return <>{title}</>;
  const [before, after] = title.split(highlightedText);
  return (
    <>
      {before}
      <span style={{ color: palette.accent }}>{highlightedText}</span>
      {after}
    </>
  );
}

// ---------------------------------------------------------------------
// Shared editing chrome
// ---------------------------------------------------------------------
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
      className="absolute -top-2 -right-2 z-[90] opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 rounded-full w-8 h-8 flex items-center justify-center shadow-lg"
      style={{ background: palette.gradient2, color: palette.dark, border: `2px solid ${palette.white}` }}
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
      style={{ background: "#FCE4E4", color: "#B3261E", border: `2px solid ${palette.white}` }}
      title={label}
    >
      <Trash2 className="w-3.5 h-3.5" />
    </button>
  );
}

// Edit + delete grouped into ONE absolutely-positioned row, exactly like the
// Staff page's ActionButtons. This is what the standalone EditIconButton /
// DeleteIconButton pair above could not guarantee: when they're two separate
// elements at "-right-2" and "-right-12", the delete button sits further
// outside the card's box — if any ancestor has overflow-hidden (as the
// facility card did), that delete button gets silently clipped off while the
// edit button (closer to the edge) still shows. Grouping them removes that
// class of bug entirely, and pairs with removing overflow-hidden from the
// card container below.
function CardActionButtons({
  editMode,
  target,
  onEditTarget,
  onDeleteTarget,
  canDelete = false,
  label = "Edit",
  icon: Icon = Pencil,
}) {
  if (!editMode) return null;

  return (
    <div className="absolute -top-2 -right-2 z-[95] flex items-center gap-1.5 opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onEditTarget(target);
        }}
        className="rounded-full w-8 h-8 flex items-center justify-center shadow-lg"
        style={{ background: palette.gradient2, color: palette.dark, border: `2px solid ${palette.white}` }}
        title={label}
      >
        <Icon className="w-3.5 h-3.5" />
      </button>

      {canDelete && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDeleteTarget(target);
          }}
          className="rounded-full w-8 h-8 flex items-center justify-center shadow-lg"
          style={{ background: "#FCE4E4", color: "#B3261E", border: `2px solid ${palette.white}` }}
          title="Delete"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
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

function AddFacilityButton({ editMode, onAddTarget }) {
  if (!editMode) return null;
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onAddTarget("facility");
      }}
      className="mt-10 mx-auto flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5"
      style={{ color: palette.white, background: palette.gradient1, boxShadow: "0 8px 24px rgba(30,58,95,0.25)" }}
    >
      <Plus className="w-4 h-4" />
      Add Facility
    </button>
  );
}

// ---------------------------------------------------------------------
// Shared visual building blocks
// ---------------------------------------------------------------------
function SectionHeader({ badge, title, highlightedText, description }) {
  return (
    <div className="text-left max-w-3xl mb-12 md:mb-16">
      <span
        className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide mb-4"
        style={{ background: "rgba(30, 58, 95, 0.08)", color: palette.primary }}
      >
        {badge}
      </span>
      <h1
        className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5"
        style={{ color: palette.dark, fontFamily: "var(--font-display)", letterSpacing: "-0.02em", lineHeight: 1.08 }}
      >
        <HighlightedTitle title={title} highlightedText={highlightedText} />
      </h1>
      {description && (
        <p className="text-lg leading-relaxed" style={{ color: palette.gray }}>
          {description}
        </p>
      )}
      <div className="w-16 h-1 rounded-full mt-6" style={{ background: palette.gradient2 }} />
    </div>
  );
}

function DecorativeBackdrop() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-5" style={{ background: palette.primary }} />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-5" style={{ background: palette.secondary }} />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-[0.02]"
        style={{ background: palette.accent }}
      />
    </div>
  );
}

function FacilityVisual({ facility, tint }) {
  if (facility.imageUrl) {
    return <img src={facility.imageUrl} alt={facility.title} style={getFacilityImageStyle(facility)} />;
  }

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center text-center px-6"
      style={{ background: `linear-gradient(150deg, ${tint} 0%, ${palette.dark} 140%)` }}
    >
      <div className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: "rgba(255,255,255,0.6)" }}>
        {facility.category}
      </div>
    </div>
  );
}

function BusRoutesDisplay({ routes }) {
  if (!routes || routes.length === 0) return null;

  return (
    <div className="mt-5 space-y-3">
      <div className="flex items-center gap-2">
        <Bus className="w-4 h-4" style={{ color: palette.secondary }} />
        <h4 className="font-bold text-sm" style={{ color: palette.dark }}>
          Available Bus Routes
        </h4>
        <span
          className="text-xs px-2 py-0.5 rounded-full font-semibold"
          style={{ background: "rgba(45,106,79,0.1)", color: palette.secondary }}
        >
          {routes.length} routes
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {routes.map((route) => (
          <div key={route.id} className="rounded-xl p-3.5" style={{ background: palette.light, border: `1px solid ${palette.lightGray}` }}>
            <div className="font-bold text-xs mb-1.5" style={{ color: palette.dark }}>
              {route.name}
            </div>
            <div className="flex items-center gap-1.5 text-xs mb-2 flex-wrap" style={{ color: palette.gray }}>
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span>{route.from || "Not set"}</span>
              <span>→</span>
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span>{route.to || "Not set"}</span>
            </div>
            {route.stops && route.stops.length > 0 && (
              <div className="space-y-1">
                {route.stops.map((stop, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs" style={{ color: palette.gray }}>
                    <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: palette.secondary }} />
                    {stop}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------
// Facilities page
// ---------------------------------------------------------------------
export function Facilities({
  editMode = false,
  contentOverride = null,
  onEditTarget = () => {},
  onDeleteTarget = () => {},
  onAddTarget = () => {},
}) {
  const [content, setContent] = useState(() =>
    mergeFacilitiesContent(contentOverride || defaultFacilitiesContent)
  );
  const [selectedFacility, setSelectedFacility] = useState(null);

  useEffect(() => {
    if (contentOverride) {
      setContent(mergeFacilitiesContent(contentOverride));
      return undefined;
    }

    let alive = true;

    const loadFacilitiesContent = async () => {
      try {
        const res = await api.get("/api/site-content/facilities", {
          timeout: 10000,
        });

        if (!alive) return;

        const saved = res.data?.data?.content || {};
        setContent(mergeFacilitiesContent(saved));
      } catch (error) {
        console.error("Facilities content load error:", error);
        if (alive) {
          setContent(mergeFacilitiesContent(defaultFacilitiesContent));
        }
      }
    };

    loadFacilitiesContent();

    return () => {
      alive = false;
    };
  }, [contentOverride]);

  useEffect(() => {
    if (editMode) return undefined;

    document.body.style.overflow = selectedFacility ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedFacility, editMode]);

  const visibleFacilities = content.facilities.filter(
    (facility) => facility.visible !== false
  );

  const getFacilityInitials = (title = "Facility") => {
    const words = title.trim().split(/\s+/).filter(Boolean);
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return `${words[0][0] || "F"}${words[1][0] || ""}`.toUpperCase();
  };

  return (
    <section className="facilities-page">
      <style>{`
        /* =========================================================
           RED ROSE FACILITIES PAGE
           Same visual family as About / Academics / Notices:
           cream background + burgundy hero + gold details.
        ========================================================= */

        .facilities-page {
          --rr-cream: #f6efe2;
          --rr-paper: #fffaf1;
          --rr-burgundy: #2a1023;
          --rr-burgundy-2: #42152c;
          --rr-red: #a92d4d;
          --rr-gold: #d7ad55;
          --rr-gold-light: #efd89b;
          --rr-ink: #211523;
          --rr-muted: #76686d;
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          background: var(--rr-cream);
          color: var(--rr-ink);
        }

        .facilities-page * {
          box-sizing: border-box;
        }

        .facilities-page::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: .22;
          background-image:
            radial-gradient(circle at 20% 10%, rgba(169,45,77,.08), transparent 26%),
            radial-gradient(circle at 90% 45%, rgba(215,173,85,.10), transparent 30%);
        }

        .facilities-shell {
          position: relative;
          z-index: 2;
          max-width: 1280px;
          margin: 0 auto;
          padding: 58px 24px 90px;
        }

        /* ================= HERO ================= */

        .facilities-hero {
          position: relative;
          min-height: 430px;
          overflow: hidden;
          border-radius: 0 0 34px 34px;
          padding: 70px 72px 88px;
          color: #fff;
          background:
            radial-gradient(circle at 85% 25%, rgba(169,45,77,.58), transparent 27%),
            radial-gradient(circle at 18% 80%, rgba(215,173,85,.12), transparent 30%),
            linear-gradient(135deg, #160d19 0%, #2b1024 50%, #3d172d 100%);
          box-shadow: 0 26px 55px rgba(43,16,36,.20);
        }

        .facilities-hero::before {
          content: "";
          position: absolute;
          inset: 0;
          opacity: .30;
          pointer-events: none;
          background-image: radial-gradient(rgba(255,255,255,.18) 1px, transparent 1px);
          background-size: 15px 15px;
          mask-image: linear-gradient(to bottom, black, transparent 90%);
        }

        .facilities-hero::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: -1px;
          height: 28px;
          background: var(--rr-cream);
          clip-path: polygon(
            0 0, 2% 55%, 4% 0, 6% 55%, 8% 0, 10% 55%, 12% 0,
            14% 55%, 16% 0, 18% 55%, 20% 0, 22% 55%, 24% 0,
            26% 55%, 28% 0, 30% 55%, 32% 0, 34% 55%, 36% 0,
            38% 55%, 40% 0, 42% 55%, 44% 0, 46% 55%, 48% 0,
            50% 55%, 52% 0, 54% 55%, 56% 0, 58% 55%, 60% 0,
            62% 55%, 64% 0, 66% 55%, 68% 0, 70% 55%, 72% 0,
            74% 55%, 76% 0, 78% 55%, 80% 0, 82% 55%, 84% 0,
            86% 55%, 88% 0, 90% 55%, 92% 0, 94% 55%, 96% 0,
            98% 55%, 100% 0, 100% 100%, 0 100%
          );
        }

        .facilities-hero-inner {
          position: relative;
          z-index: 2;
          max-width: 820px;
        }

        .facilities-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          color: var(--rr-gold-light);
          font-size: 10px;
          font-weight: 900;
          letter-spacing: .24em;
          text-transform: uppercase;
        }

        .facilities-eyebrow::before {
          content: "";
          width: 42px;
          height: 1px;
          background: var(--rr-gold);
        }

        .facilities-hero h1 {
          margin: 22px 0 0;
          max-width: 800px;
          color: white;
          font-family: var(--font-display, Georgia, serif);
          font-size: clamp(48px, 7vw, 82px);
          font-weight: 700;
          line-height: .95;
          letter-spacing: -.045em;
        }

        .facilities-hero h1 .highlight {
          color: var(--rr-gold-light);
        }

        .facilities-hero-description {
          max-width: 720px;
          margin-top: 24px;
          color: rgba(255,255,255,.72);
          font-size: 16px;
          line-height: 1.75;
        }

        .facilities-hero-mark {
          position: absolute;
          z-index: 1;
          right: 8%;
          top: 50%;
          width: 185px;
          height: 185px;
          transform: translateY(-50%);
          display: grid;
          place-items: center;
          border: 1px solid rgba(215,173,85,.45);
          border-radius: 50%;
          color: var(--rr-gold-light);
          background: rgba(255,255,255,.025);
          box-shadow:
            inset 0 0 0 10px rgba(215,173,85,.045),
            inset 0 0 0 11px rgba(215,173,85,.22);
        }

        .facilities-hero-mark::before {
          content: "";
          position: absolute;
          inset: 17px;
          border: 1px dashed rgba(215,173,85,.35);
          border-radius: 50%;
        }

        .facilities-hero-mark strong {
          position: relative;
          z-index: 2;
          font-family: var(--font-display, Georgia, serif);
          font-size: 48px;
          letter-spacing: .05em;
        }

        .facilities-hero-mark span {
          position: absolute;
          bottom: 37px;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: .32em;
          text-transform: uppercase;
        }

        /* ================= INTRO ================= */

        .facilities-intro {
          display: grid;
          grid-template-columns: minmax(0, .8fr) minmax(0, 1.2fr);
          gap: 65px;
          align-items: center;
          padding: 82px 38px 72px;
        }

        .facilities-intro-label {
          color: var(--rr-red);
          font-size: 10px;
          font-weight: 900;
          letter-spacing: .22em;
          text-transform: uppercase;
        }

        .facilities-intro-title {
          margin-top: 14px;
          font-family: var(--font-display, Georgia, serif);
          font-size: clamp(34px, 4.3vw, 56px);
          line-height: 1;
          letter-spacing: -.04em;
          color: var(--rr-ink);
        }

        .facilities-intro-title span {
          color: var(--rr-red);
        }

        .facilities-intro-copy {
          color: var(--rr-muted);
          font-size: 16px;
          line-height: 1.85;
        }

        .facilities-intro-rule {
          width: 54px;
          height: 2px;
          margin-top: 22px;
          background: var(--rr-gold);
        }

        /* ================= FACILITY LIST ================= */

        .facilities-section-head {
          text-align: center;
          margin-bottom: 38px;
        }

        .facilities-section-kicker {
          color: var(--rr-red);
          font-size: 10px;
          font-weight: 900;
          letter-spacing: .24em;
          text-transform: uppercase;
        }

        .facilities-section-title {
          margin-top: 11px;
          color: var(--rr-ink);
          font-family: var(--font-display, Georgia, serif);
          font-size: clamp(34px, 4vw, 50px);
          line-height: 1;
          letter-spacing: -.04em;
        }

        .facilities-section-title span {
          color: var(--rr-red);
        }

        .facilities-section-subtitle {
          max-width: 650px;
          margin: 14px auto 0;
          color: var(--rr-muted);
          font-size: 14px;
          line-height: 1.7;
        }

        .facilities-list {
          display: flex;
          flex-direction: column;
          gap: 26px;
        }

        .facility-row {
          position: relative;
          display: grid;
          grid-template-columns: minmax(0, .95fr) minmax(0, 1.05fr);
          min-height: 310px;
          overflow: visible;
          border: 1px solid rgba(169,45,77,.13);
          border-radius: 28px;
          background: rgba(255,250,241,.82);
          box-shadow: 0 18px 40px rgba(56,31,43,.07);
          transition: transform .3s ease, box-shadow .3s ease;
        }

        .facility-row.reverse {
          grid-template-columns: minmax(0, 1.05fr) minmax(0, .95fr);
        }

        .facility-row:hover {
          transform: translateY(-5px);
          box-shadow: 0 25px 50px rgba(56,31,43,.11);
        }

        /*
         * The complete facility container is clickable on the public page.
         * Admin edit mode is excluded, so editing controls continue to work
         * normally without opening the details popup.
         */
        .facility-clickable {
          -webkit-tap-highlight-color: transparent;
        }

        .facility-clickable:focus-visible {
          outline: 3px solid rgba(215,173,85,.65);
          outline-offset: 4px;
        }

        .facility-row-image {
          position: relative;
          min-height: 310px;
          overflow: hidden;
          border-radius: 28px 0 0 28px;
          background: var(--rr-burgundy);
        }

        .facility-row.reverse .facility-row-image {
          order: 2;
          border-radius: 0 28px 28px 0;
        }

        .facility-row-image > div,
        .facility-row-image img {
          transition: transform .65s cubic-bezier(.22,1,.36,1);
        }

        .facility-row:hover .facility-row-image > div,
        .facility-row:hover .facility-row-image img {
          transform: scale(1.045);
        }

        .facility-row-image::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, rgba(22,13,25,.18), transparent 55%);
          pointer-events: none;
        }

        .facility-row-badge {
          position: absolute;
          z-index: 4;
          left: 22px;
          top: 22px;
          padding: 8px 12px;
          border: 1px solid rgba(255,255,255,.28);
          border-radius: 999px;
          color: white;
          background: rgba(22,13,25,.65);
          backdrop-filter: blur(10px);
          font-size: 9px;
          font-weight: 900;
          letter-spacing: .14em;
          text-transform: uppercase;
        }

        .facility-row-number {
          position: absolute;
          z-index: 4;
          left: 22px;
          bottom: 20px;
          color: rgba(255,255,255,.75);
          font-family: var(--font-display, Georgia, serif);
          font-size: 44px;
          line-height: .8;
        }

        .facility-row-content {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 42px 48px;
        }

        .facility-row-content::before {
          content: "";
          position: absolute;
          left: 0;
          top: 42px;
          width: 3px;
          height: 60px;
          background: var(--rr-gold);
          border-radius: 0 4px 4px 0;
        }

        .facility-row.reverse .facility-row-content::before {
          left: auto;
          right: 0;
        }

        .facility-category {
          color: var(--rr-red);
          font-size: 9px;
          font-weight: 900;
          letter-spacing: .2em;
          text-transform: uppercase;
        }

        .facility-row-title {
          margin-top: 10px;
          color: var(--rr-ink);
          font-family: var(--font-display, Georgia, serif);
          font-size: clamp(27px, 3vw, 40px);
          line-height: 1.02;
          letter-spacing: -.035em;
        }

        .facility-row-description {
          margin-top: 15px;
          max-width: 560px;
          color: var(--rr-muted);
          font-size: 13px;
          line-height: 1.75;
        }

        .facility-learn {
          width: fit-content;
          margin-top: 21px;
          padding: 10px 0;
          border: 0;
          border-bottom: 1px solid rgba(169,45,77,.35);
          color: var(--rr-red);
          background: transparent;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: .13em;
          text-transform: uppercase;
          cursor: pointer;
          transition: .25s ease;
        }

        .facility-learn:hover {
          color: var(--rr-burgundy);
          border-color: var(--rr-gold);
          padding-right: 8px;
        }

        .facility-admin-image {
          position: absolute;
          z-index: 12;
          top: 16px;
          left: 16px;
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border: 0;
          border-radius: 50%;
          color: var(--rr-burgundy);
          background: white;
          box-shadow: 0 8px 20px rgba(0,0,0,.18);
          opacity: 0;
          transform: translateY(4px);
          cursor: pointer;
          transition: .22s ease;
        }

        .facility-row-image:hover .facility-admin-image,
        .facility-row-image:focus-within .facility-admin-image {
          opacity: 1;
          transform: translateY(0);
        }

        /* ================= ADD BUTTON ================= */

        .facilities-add {
          display: flex;
          width: fit-content;
          align-items: center;
          gap: 8px;
          margin: 32px auto 0;
          padding: 13px 20px;
          border: 0;
          border-radius: 999px;
          color: white;
          background: var(--rr-burgundy);
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 12px 25px rgba(42,16,35,.18);
        }

        /* ================= MODAL ================= */

        .facility-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 22px;
          background: rgba(27,17,25,.78);
          backdrop-filter: blur(7px);
        }

        .facility-modal {
          position: relative;
          width: min(780px, 100%);
          max-height: 88vh;
          overflow-y: auto;
          border-radius: 0 0 28px 28px;
          background: var(--rr-paper);
          box-shadow: 0 40px 110px rgba(0,0,0,.38);
        }

        .facility-modal-header {
          position: relative;
          min-height: 205px;
          overflow: hidden;
          padding: 40px 52px 54px;
          color: white;
          background:
            radial-gradient(circle at 78% 22%, rgba(255,255,255,.10), transparent 20%),
            linear-gradient(135deg, #9d2848 0%, #c23859 55%, #8e2342 100%);
        }

        .facility-modal-header::before {
          content: "";
          position: absolute;
          inset: 0;
          opacity: .28;
          background-image: radial-gradient(rgba(255,255,255,.32) 1px, transparent 1px);
          background-size: 13px 13px;
        }

        .facility-modal-header::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: -1px;
          height: 30px;
          background: var(--rr-paper);
          clip-path: polygon(
            0 0, 2.5% 65%, 5% 0, 7.5% 65%, 10% 0, 12.5% 65%,
            15% 0, 17.5% 65%, 20% 0, 22.5% 65%, 25% 0, 27.5% 65%,
            30% 0, 32.5% 65%, 35% 0, 37.5% 65%, 40% 0, 42.5% 65%,
            45% 0, 47.5% 65%, 50% 0, 52.5% 65%, 55% 0, 57.5% 65%,
            60% 0, 62.5% 65%, 65% 0, 67.5% 65%, 70% 0, 72.5% 65%,
            75% 0, 77.5% 65%, 80% 0, 82.5% 65%, 85% 0, 87.5% 65%,
            90% 0, 92.5% 65%, 95% 0, 97.5% 65%, 100% 0,
            100% 100%, 0 100%
          );
        }

        .facility-modal-quote {
          position: absolute;
          top: 24px;
          left: 38px;
          color: rgba(255,255,255,.32);
          font-family: Georgia, serif;
          font-size: 58px;
          line-height: .5;
        }

        .facility-modal-kicker {
          position: relative;
          z-index: 2;
          color: rgba(255,255,255,.72);
          font-size: 9px;
          font-weight: 900;
          letter-spacing: .25em;
          text-transform: uppercase;
        }

        .facility-modal-profile {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 14px;
          margin-top: 23px;
        }

        .facility-modal-initials {
          display: grid;
          place-items: center;
          width: 58px;
          height: 58px;
          flex-shrink: 0;
          border: 3px solid rgba(255,255,255,.78);
          border-radius: 50%;
          color: var(--rr-burgundy);
          background: var(--rr-gold-light);
          font-family: Georgia, serif;
          font-size: 18px;
          font-weight: 900;
          box-shadow: 0 7px 18px rgba(54,13,30,.22);
        }

        .facility-modal-profile h3 {
          color: white;
          font-family: var(--font-display, Georgia, serif);
          font-size: 24px;
          line-height: 1;
          letter-spacing: -.02em;
        }

        .facility-modal-profile p {
          margin-top: 5px;
          color: rgba(255,255,255,.70);
          font-size: 9px;
          font-weight: 900;
          letter-spacing: .18em;
          text-transform: uppercase;
        }

        .facility-modal-close {
          position: absolute;
          z-index: 20;
          top: 16px;
          right: 18px;
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255,255,255,.35);
          border-radius: 50%;
          color: white;
          background: rgba(255,255,255,.12);
          cursor: pointer;
          transition: .25s ease;
        }

        .facility-modal-close:hover {
          background: rgba(255,255,255,.22);
          transform: rotate(90deg);
        }

        .facility-modal-body {
          position: relative;
          padding: 8px 48px 38px;
        }

        .facility-modal-title {
          color: var(--rr-ink);
          font-family: var(--font-display, Georgia, serif);
          font-size: clamp(30px, 4vw, 43px);
          line-height: 1.05;
          letter-spacing: -.04em;
        }

        .facility-modal-rule {
          width: 52px;
          height: 2px;
          margin: 13px 0 18px;
          background: var(--rr-gold);
        }

        .facility-modal-description {
          color: var(--rr-muted);
          font-size: 14px;
          line-height: 1.8;
        }

        .facility-modal-paper {
          margin-top: 22px;
          padding: 20px 22px;
          border: 1px solid rgba(169,45,77,.13);
          border-radius: 18px;
          background: #fbf4e8;
        }

        .facility-modal-paper-label {
          color: var(--rr-red);
          font-size: 9px;
          font-weight: 900;
          letter-spacing: .2em;
          text-transform: uppercase;
        }

        .facility-modal-paper p {
          margin-top: 8px;
          color: var(--rr-ink);
          font-size: 13px;
          line-height: 1.75;
        }

        .facility-routes {
          margin-top: 20px;
        }

        .facility-routes-title {
          color: var(--rr-red);
          font-size: 9px;
          font-weight: 900;
          letter-spacing: .2em;
          text-transform: uppercase;
        }

        .facility-routes-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          margin-top: 10px;
        }

        .facility-route-card {
          padding: 13px;
          border: 1px solid rgba(169,45,77,.11);
          border-radius: 14px;
          background: white;
        }

        .facility-route-name {
          color: var(--rr-ink);
          font-size: 11px;
          font-weight: 900;
        }

        .facility-route-line {
          margin-top: 5px;
          color: var(--rr-muted);
          font-size: 10px;
          line-height: 1.55;
        }

        .facility-route-stops {
          margin-top: 8px;
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
        }

        .facility-route-stop {
          padding: 4px 7px;
          border-radius: 999px;
          color: #704c58;
          background: #f8eee4;
          font-size: 8px;
          font-weight: 800;
        }

        .facility-modal-footer {
          margin-top: 25px;
          padding-top: 16px;
          border-top: 1px solid rgba(169,45,77,.12);
          color: #927e84;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: .12em;
          text-transform: uppercase;
        }

        /* ================= ADMIN EDIT OUTLINE ================= */

        .facilities-edit-card {
          border: 2px dashed rgba(169,45,77,.38) !important;
        }

        @media (max-width: 900px) {
          .facilities-shell {
            padding: 35px 18px 70px;
          }

          .facilities-hero {
            padding: 54px 36px 76px;
          }

          .facilities-hero-mark {
            right: 4%;
            width: 145px;
            height: 145px;
            opacity: .72;
          }

          .facilities-intro {
            grid-template-columns: 1fr;
            gap: 22px;
            padding: 60px 20px 52px;
          }

          .facility-row,
          .facility-row.reverse {
            grid-template-columns: 1fr;
          }

          .facility-row-image,
          .facility-row.reverse .facility-row-image {
            order: 0;
            min-height: 250px;
            border-radius: 28px 28px 0 0;
          }

          .facility-row-content {
            padding: 34px 32px 38px;
          }

          .facility-row.reverse .facility-row-content::before {
            left: 0;
            right: auto;
          }
        }

        @media (max-width: 620px) {
          .facilities-hero {
            min-height: 420px;
            padding: 45px 24px 70px;
            border-radius: 0 0 24px 24px;
          }

          .facilities-hero h1 {
            font-size: clamp(43px, 14vw, 62px);
          }

          .facilities-hero-description {
            max-width: 100%;
            font-size: 13px;
          }

          .facilities-hero-mark {
            width: 105px;
            height: 105px;
            top: auto;
            right: 24px;
            bottom: 60px;
            transform: none;
          }

          .facilities-hero-mark strong {
            font-size: 29px;
          }

          .facilities-hero-mark span {
            bottom: 20px;
            font-size: 5px;
          }

          .facilities-intro {
            padding: 48px 8px 40px;
          }

          .facilities-intro-title {
            font-size: 38px;
          }

          .facility-row {
            min-height: 0;
            border-radius: 22px;
          }

          .facility-row-image,
          .facility-row.reverse .facility-row-image {
            min-height: 210px;
            border-radius: 22px 22px 0 0;
          }

          .facility-row-content {
            padding: 30px 24px 32px;
          }

          .facility-row-title {
            font-size: 31px;
          }

          .facility-modal-backdrop {
            padding: 10px;
          }

          .facility-modal {
            max-height: 92vh;
            border-radius: 0 0 22px 22px;
          }

          .facility-modal-header {
            min-height: 205px;
            padding: 35px 25px 54px;
          }

          .facility-modal-quote {
            left: 22px;
          }

          .facility-modal-body {
            padding: 8px 24px 30px;
          }

          .facility-modal-profile h3 {
            font-size: 19px;
          }

          .facility-routes-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="facilities-shell">
        {/* ================= HERO ================= */}
        <EditableWrap
          editMode={editMode}
          target={{ type: "pageHeader" }}
          onEditTarget={onEditTarget}
          label="Edit facilities heading"
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            className="facilities-hero"
          >
            <div className="facilities-hero-inner">
              <div className="facilities-eyebrow">
                {content.badgeText || "Our Campus"}
              </div>

              <h1>
                {content.title?.includes(content.highlightedText) ? (
                  <HighlightedTitle
                    title={content.title}
                    highlightedText={content.highlightedText}
                  />
                ) : (
                  <>
                    {content.title || "Spaces Built For How Students Learn"}
                  </>
                )}
              </h1>

              <p className="facilities-hero-description">
                {content.subtitle ||
                  "Thoughtfully designed spaces that support learning, creativity, discovery, wellbeing, and everyday school life."}
              </p>
            </div>

            <div className="facilities-hero-mark" aria-hidden="true">
              <strong>RR</strong>
              <span>Red Rose</span>
            </div>
          </motion.div>
        </EditableWrap>

        {/* ================= INTRO ================= */}
        <EditableWrap
          editMode={editMode}
          target={{ type: "pageIntro" }}
          onEditTarget={onEditTarget}
          label="Edit Life Beyond The Classroom"
        >
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6 }}
            className="facilities-intro"
          >
            <div>
              <div className="facilities-intro-label">
                {content.introBadge || "Life Beyond The Classroom"}
              </div>

              <h2 className="facilities-intro-title">
                {content.introTitle?.includes(content.introHighlightedText) ? (
                  <HighlightedTitle
                    title={content.introTitle}
                    highlightedText={content.introHighlightedText}
                  />
                ) : (
                  content.introTitle || "Places that make learning feel real."
                )}
              </h2>

              <div className="facilities-intro-rule" />
            </div>

            <p className="facilities-intro-copy">
              {content.introDescription ||
                "Our campus is designed as more than a collection of rooms. Each space gives students an opportunity to read, experiment, create, perform, travel safely, stay active, and discover the confidence that comes from doing things for themselves."}
            </p>
          </motion.section>
        </EditableWrap>

        {/* ================= FACILITIES ================= */}
        <EditableWrap
          editMode={editMode}
          target={{ type: "facilitySectionHeader" }}
          onEditTarget={onEditTarget}
          label="Edit Facility Highlights heading"
        >
          <section>
            <div className="facilities-section-head">
              <div className="facilities-section-kicker">
                {content.sectionKicker || "Explore Our Campus"}
              </div>

              <h2 className="facilities-section-title">
                {content.sectionTitle?.includes(content.sectionHighlightedText) ? (
                  <HighlightedTitle
                    title={content.sectionTitle}
                    highlightedText={content.sectionHighlightedText}
                  />
                ) : (
                  content.sectionTitle || "Facility Highlights"
                )}
              </h2>

              <p className="facilities-section-subtitle">
                {content.sectionSubtitle ||
                  "Explore the spaces and services that support the academic, creative, physical, and social development of our students."}
              </p>
            </div>
          </section>
        </EditableWrap>

        <div className="facilities-list">
            {visibleFacilities.map((facility, i) => {
              const realIndex = content.facilities.findIndex(
                (item) => item.id === facility.id
              );
              const tint = facility.color || facilityTints[i % facilityTints.length];
              const reverse = i % 2 === 1;

              return (
                <motion.article
                  key={facility.id}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.55, delay: Math.min(i * 0.06, 0.25) }}
                  className={`facility-row ${reverse ? "reverse" : ""} ${
                    editMode ? "facilities-edit-card" : ""
                  } group ${!editMode ? "facility-clickable" : ""}`}
                  style={{
                    borderTopColor: `${tint}45`,
                    cursor: editMode ? "default" : "pointer",
                  }}
                  role={!editMode ? "button" : undefined}
                  tabIndex={!editMode ? 0 : undefined}
                  aria-label={
                    !editMode
                      ? `Open details for ${facility.title}`
                      : undefined
                  }
                  onClick={() => {
                    if (!editMode) {
                      setSelectedFacility(facility);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (
                      !editMode &&
                      (e.key === "Enter" || e.key === " ")
                    ) {
                      e.preventDefault();
                      setSelectedFacility(facility);
                    }
                  }}
                >
                  <CardActionButtons
                    editMode={editMode}
                    target={{ type: "facilityCard", index: realIndex }}
                    onEditTarget={onEditTarget}
                    onDeleteTarget={onDeleteTarget}
                    canDelete
                    label="Edit facility"
                  />

                  <div className="facility-row-image">
                    <div className="facility-row-badge">{facility.category}</div>

                    <div className="absolute inset-0">
                      <FacilityVisual facility={facility} tint={tint} />
                    </div>

                    {editMode && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onEditTarget({
                            type: "facilityImage",
                            index: realIndex,
                          });
                        }}
                        className="facility-admin-image"
                        title="Change facility image"
                      >
                        <Camera className="w-4 h-4" />
                      </button>
                    )}

                    <div className="facility-row-number">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                  </div>

                  <div className="facility-row-content">
                    <div className="facility-category">{facility.category}</div>

                    <h3 className="facility-row-title">{facility.title}</h3>

                    <p className="facility-row-description">
                      {facility.description}
                    </p>

                    <button
                      type="button"
                      className="facility-learn"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        if (!editMode) {
                          setSelectedFacility(facility);
                        }
                      }}
                    >
                      {content.learnMoreText || "Learn More"} →
                    </button>
                  </div>
                </motion.article>
              );
            })}
          </div>

        <AddFacilityButton editMode={editMode} onAddTarget={onAddTarget} />

        {/* ================= FACILITY DETAIL POPUP ================= */}
        <AnimatePresence>
          {!editMode && selectedFacility && (
            <motion.div
              className="facility-modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedFacility(null)}
            >
              <motion.div
                className="facility-modal"
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.97 }}
                transition={{ type: "spring", stiffness: 260, damping: 24 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="facility-modal-header">
                  <div className="facility-modal-quote">"</div>

                  <button
                    type="button"
                    className="facility-modal-close"
                    onClick={() => setSelectedFacility(null)}
                    aria-label="Close facility details"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="facility-modal-kicker">
                    {selectedFacility.category || "Campus Facility"}
                  </div>

                  <div className="facility-modal-profile">
                    <div className="facility-modal-initials">
                      {getFacilityInitials(selectedFacility.title)}
                    </div>

                    <div>
                      <h3>Red Rose Campus</h3>
                      <p>Facility Information</p>
                    </div>
                  </div>
                </div>

                <div className="facility-modal-body">
                  <h2 className="facility-modal-title">
                    {selectedFacility.title}
                  </h2>

                  <div className="facility-modal-rule" />

                  <p className="facility-modal-description">
                    {selectedFacility.description}
                  </p>

                  {/*
                    FIX: was previously gated on
                    `selectedFacility.title === "School Transport"`, which is
                    a fragile string match. If the facility title is ever
                    edited in the admin panel (e.g. renamed to "Transport &
                    Buses"), the routes silently stop showing here even
                    though the data is still saved. Now this checks the
                    actual data (busRoutes array) instead of the title text,
                    so it always reflects what's really stored — and stays
                    in sync with the admin editor's isBusFacility check.
                  */}
                  {selectedFacility.busRoutes &&
                    selectedFacility.busRoutes.length > 0 && (
                      <div className="facility-routes">
                        <div className="facility-routes-title">
                          Available Bus Routes
                        </div>

                        <div className="facility-routes-grid">
                          {selectedFacility.busRoutes.map((route) => (
                            <div className="facility-route-card" key={route.id}>
                              <div className="facility-route-name">
                                {route.name}
                              </div>

                              <div className="facility-route-line">
                                {route.from || "Not set"} → {route.to || "Not set"}
                              </div>

                              {route.stops?.length > 0 && (
                                <div className="facility-route-stops">
                                  {route.stops.map((stop, index) => (
                                    <span
                                      className="facility-route-stop"
                                      key={`${stop}-${index}`}
                                    >
                                      {stop}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  <div className="facility-modal-paper">
                    <div className="facility-modal-paper-label">
                      {content.highlightsTitle || "Facility Highlights"}
                    </div>
                    <p>
                      {selectedFacility.details ||
                        "This facility supports the everyday learning and development of Red Rose students."}
                    </p>
                  </div>

                  <div className="facility-modal-footer">
                    Red Rose Secondary English Boarding School · Hetauda
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

export default Facilities;