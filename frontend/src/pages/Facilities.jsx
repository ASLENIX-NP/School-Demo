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
  primary: "#1E3A5F",
  secondary: "#2D6A4F",
  accent: "#E9C46A",
  accent2: "#F4A261",
  light: "#F8F9FA",
  dark: "#1A1A2E",
  gray: "#6C757D",
  lightGray: "#E9ECEF",
  white: "#FFFFFF",
  gradient1: "linear-gradient(135deg, #1E3A5F 0%, #2D6A4F 100%)",
  gradient2: "linear-gradient(135deg, #E9C46A 0%, #F4A261 100%)",
  gradient3: "linear-gradient(135deg, #2D6A4F 0%, #1E3A5F 100%)",
};

const API_URL = import.meta.env.VITE_API_URL;

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
    "Smriti Boarding School provides modern facilities that create an engaging, practical, and technology-driven learning environment for every student.",
  learnMoreText: "Learn More",
  highlightsTitle: "Facility Highlights",
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
        "Smriti Boarding School provides safe transportation with experienced drivers, route management, student safety monitoring, and comfortable buses for daily travel.",
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
      <span style={{ color: palette.accent2 }}>{highlightedText}</span>
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
  const [content, setContent] = useState(() => mergeFacilitiesContent(contentOverride || defaultFacilitiesContent));
  const [selectedFacility, setSelectedFacility] = useState(null);

  useEffect(() => {
    if (contentOverride) {
      setContent(mergeFacilitiesContent(contentOverride));
      return undefined;
    }
    let alive = true;
    const loadFacilitiesContent = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/site-content/facilities`, { timeout: 10000 });
        if (!alive) return;
        const saved = res.data?.data?.content || {};
        setContent(mergeFacilitiesContent(saved));
      } catch (error) {
        console.error("Facilities content load error:", error);
        if (alive) setContent(mergeFacilitiesContent(defaultFacilitiesContent));
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

  const visibleFacilities = content.facilities.filter((f) => f.visible !== false);

  // Get emoji for facility
  const getFacilityEmoji = (title) => {
    const emojis = {
      "Digital Library": "📚",
      "Tech Lab": "💻",
      "Science Center": "🔬",
      "School Transport": "🚌",
      "Performance Hall": "🎭",
      "Sports Complex": "⚽",
    };
    return emojis[title] || "🏫";
  };

  return (
    <section className="relative overflow-hidden pt-28 pb-16 md:pb-24" style={{ background: palette.light }}>
      <DecorativeBackdrop />

      <div className="relative z-10 max-w-[1400px] mx-auto px-5 sm:px-8">
        {/* ================= PAGE HEADER ================= */}
        <EditableWrap editMode={editMode} target={{ type: "pageHeader" }} onEditTarget={onEditTarget} label="Edit facilities heading">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <SectionHeader
              badge={content.badgeText}
              title={content.title}
              highlightedText={content.highlightedText}
              description={content.subtitle}
            />
          </motion.div>
        </EditableWrap>

        {/* ================= FACILITY CARDS ================= */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleFacilities.map((facility, i) => {
            const realIndex = content.facilities.findIndex((item) => item.id === facility.id);
            const tint = facility.color || facilityTints[i % facilityTints.length];

            return (
              <motion.div
                key={facility.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                onClick={() => {
                  if (!editMode) setSelectedFacility(facility);
                }}
                className="group relative overflow-hidden rounded-2xl h-full flex flex-col transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                style={{
                  background: palette.white,
                  border: editMode ? `2px dashed ${palette.accent2}88` : `1px solid ${tint}2e`,
                  boxShadow: `0 4px 22px ${tint}1a`,
                }}
              >
                <EditIconButton editMode={editMode} target={{ type: "facilityCard", index: realIndex }} onEditTarget={onEditTarget} label="Edit facility" />
                <DeleteIconButton editMode={editMode} target={{ type: "facilityCard", index: realIndex }} onDeleteTarget={onDeleteTarget} label="Delete facility" />

                <div className="absolute top-0 left-0 right-0 h-1.5 z-10 transition-all duration-300 group-hover:h-2" style={{ background: `linear-gradient(90deg, ${tint}, ${palette.accent})` }} />

                <div className="h-48 relative overflow-hidden">
                  <div className="w-full h-full transition-transform duration-500 group-hover:scale-105">
                    <FacilityVisual facility={facility} tint={tint} />
                  </div>

                  {editMode && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onEditTarget({ type: "facilityImage", index: realIndex });
                      }}
                      className="absolute top-4 left-4 z-20 w-9 h-9 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all"
                      style={{ background: palette.white, color: palette.primary }}
                      title="Change facility image"
                    >
                      <Camera className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <div className="absolute bottom-3 left-4">
                    <span
                      className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold"
                      style={{ background: "rgba(255,255,255,0.92)", color: tint }}
                    >
                      {facility.category}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold mb-2" style={{ color: palette.dark, fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}>
                    {facility.title}
                  </h3>
                  <p className="text-sm leading-relaxed flex-1" style={{ color: palette.gray }}>
                    {facility.description}
                  </p>
                  <div className="mt-4 inline-flex items-center gap-1 text-sm font-bold transition-all duration-300 group-hover:gap-2" style={{ color: tint }}>
                    {content.learnMoreText} →
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <AddFacilityButton editMode={editMode} onAddTarget={onAddTarget} />
      </div>

      {/* ================= ATTRACTIVE FACILITY DETAIL MODAL ================= */}
      <AnimatePresence>
        {!editMode && selectedFacility && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            style={{ background: "rgba(26,26,46,0.75)", backdropFilter: "blur(8px)" }}
            onClick={() => setSelectedFacility(null)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 250, damping: 22 }}
              className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl"
              style={{
                background: palette.white,
                boxShadow: "0 40px 100px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05)",
              }}
            >
              {/* Decorative gradient header */}
              <div
                className="relative h-2 w-full rounded-t-2xl overflow-hidden"
                style={{ background: `linear-gradient(90deg, ${selectedFacility.color || palette.primary}, ${palette.accent}, ${palette.accent2})` }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                    animation: "shimmer 3s infinite",
                  }}
                />
              </div>

              {/* Decorative background circles */}
              <div
                className="absolute top-20 right-10 w-48 h-48 rounded-full pointer-events-none opacity-10"
                style={{ background: selectedFacility.color || palette.primary, filter: "blur(60px)" }}
              />
              <div
                className="absolute bottom-20 left-10 w-32 h-32 rounded-full pointer-events-none opacity-10"
                style={{ background: palette.accent, filter: "blur(50px)" }}
              />

              {/* Close button - RED with rotation */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFacility(null);
                }}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:rotate-180 hover:scale-110 group"
                style={{
                  background: "#DC2626",
                  color: palette.white,
                  boxShadow: "0 4px 16px rgba(220, 38, 38, 0.4)",
                  border: "2px solid rgba(255,255,255,0.2)",
                }}
              >
                <X className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
              </button>

              <div className="p-6 md:p-8 relative z-10">
                {/* Category badge with icon */}
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                    style={{
                      background: `linear-gradient(135deg, ${selectedFacility.color || palette.primary}20, ${selectedFacility.color || palette.primary}08)`,
                      border: `1px solid ${selectedFacility.color || palette.primary}20`,
                    }}
                  >
                    {getFacilityEmoji(selectedFacility.title)}
                  </div>
                  <span
                    className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider"
                    style={{
                      background: `${selectedFacility.color || palette.primary}12`,
                      color: selectedFacility.color || palette.primary,
                      border: `1px solid ${selectedFacility.color || palette.primary}22`,
                    }}
                  >
                    {selectedFacility.category}
                  </span>
                </div>

                {/* Title with gradient underline */}
                <h2
                  className="text-2xl md:text-3xl font-bold mb-3"
                  style={{
                    color: palette.dark,
                    fontFamily: "var(--font-display)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {selectedFacility.title}
                </h2>
                <div
                  className="w-16 h-1 rounded-full mb-4"
                  style={{ background: `linear-gradient(90deg, ${selectedFacility.color || palette.primary}, ${palette.accent})` }}
                />

                {/* Description */}
                <p className="text-base md:text-lg leading-relaxed mb-5" style={{ color: palette.gray }}>
                  {selectedFacility.description}
                </p>

                {/* Bus routes (only for transport) */}
                {selectedFacility.title === "School Transport" && (
                  <BusRoutesDisplay routes={selectedFacility.busRoutes} />
                )}

                {/* Details section with gradient border */}
                <div
                  className="mt-5 rounded-xl p-5 relative overflow-hidden"
                  style={{
                    background: `linear-gradient(145deg, ${selectedFacility.color || palette.primary}06, ${palette.light})`,
                    border: `1px solid ${selectedFacility.color || palette.primary}15`,
                  }}
                >
                  <div
                    className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none opacity-20"
                    style={{ background: selectedFacility.color || palette.primary, filter: "blur(40px)" }}
                  />
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4" style={{ color: selectedFacility.color || palette.primary }} />
                      <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: palette.gray }}>
                        {content.highlightsTitle}
                      </h4>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: palette.dark }}>
                      {selectedFacility.details}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Shimmer animation keyframes */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </section>
  );
}

export default Facilities;