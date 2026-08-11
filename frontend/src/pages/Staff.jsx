import { useEffect, useState, useRef, useCallback } from "react";
import api from "../lib/api";
import {
  Award,
  BookOpen,
  Camera,
  FileText,
  GraduationCap,
  Mail,
  Pencil,
  Phone,
  Plus,
  Trash2,
  UserRound,
  Users,
  X,
  Sparkles,
  MapPin,
  Calendar,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ─── ACCENT PALETTE ───
// A small rotating set of accent colors used across icons, glow rings and blobs
// so the page reads as intentionally colorful rather than a single-tint theme.
// Exported so the admin editor can reuse the exact same hexes as defaults/swatches.
export const ACCENTS = [
  { name: "indigo", solid: "#6366F1", soft: "rgba(99,102,241,0.16)" },
  { name: "violet", solid: "#8B5CF6", soft: "rgba(139,92,246,0.16)" },
  { name: "amber", solid: "#F59E0B", soft: "rgba(245,158,11,0.16)" },
  { name: "cyan", solid: "#22D3EE", soft: "rgba(34,211,238,0.16)" },
  { name: "rose", solid: "#FB7185", soft: "rgba(251,113,133,0.16)" },
];

export function accentFor(index = 0) {
  return ACCENTS[index % ACCENTS.length];
}

// ─── 1. ULTRA-SMOOTH, LIGHTWEIGHT TILT CARD COMPONENT ───
// Uses direct hardware-accelerated CSS transforms instead of heavy React spring hooks.
// Disables on touch devices to ensure 100% native, lag-free mobile scrolling.
function TiltCard({ children, className = "", style = {}, max = 6, editMode = false, ...props }) {
  const ref = useRef(null);

  const handleMove = useCallback((e) => {
    if (editMode) return;
    const el = ref.current;
    if (!el || typeof window === "undefined") return;
    if (window.matchMedia && window.matchMedia("(pointer: coarse)").matches) return;

    const rect = el.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rotY = (px - 0.5) * max * 2;
    const rotX = (0.5 - py) * max * 2;

    el.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateZ(0)`;
  }, [editMode, max]);

  const handleLeave = useCallback(() => {
    if (editMode) return;
    const el = ref.current;
    if (el) {
      el.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)";
    }
  }, [editMode]);

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`relative ${className}`}
      style={{
        transition: editMode ? "none" : "transform 260ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 260ms ease",
        willChange: editMode ? "auto" : "transform",
        ...style,
      }}
      {...props}
    >
      {/* Subtle glass glare reflection on hover for desktop */}
      {!editMode && (
        <div className="absolute inset-0 rounded-[inherit] pointer-events-none bg-gradient-to-br from-white/35 via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
      )}
      {children}
    </div>
  );
}

export const colors = {
  navy: "#0A1628",
  primary: "#1E3A5F",
  slate: "#475569",
  light: "#F8FAFC",
  white: "#FFFFFF",
};

const HARDCODED_STAFF_IMAGE_URLS = [
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
  "https://images.unsplash.com/photo-1504593811423-6dd665756598",
];

function isHardcodedStaffImageUrl(value = "") {
  const clean = String(value || "").trim();
  return HARDCODED_STAFF_IMAGE_URLS.some((url) => clean.startsWith(url));
}

export const defaultStaffContent = {
  badgeText: "Faculty & Team",
  title: "Our Staff Members",
  highlightedWord: "Staff Members",
  subtitle:
    "Meet the dedicated educators, department heads, and leaders guiding students at Red Rose Secondary English Boarding School.",
  stats: [
    {
      id: "teachingStaff",
      value: "50+",
      label: "Teaching Staff",
      icon: "users",
    },
    {
      id: "expertFaculty",
      value: "240+",
      label: "Faculty Members",
      icon: "graduation",
    },
    {
      id: "yearsExcellence",
      value: "35+",
      label: "Years Excellence",
      icon: "award",
    },
  ],
  staff: [
    {
      id: 1,
      name: "Binod Subedi",
      position: "Principal",
      imageUrl: "",
      imageZoom: 1,
      imageOffsetX: 0,
      imageOffsetY: 0,
      qualification: "M.Ed in Educational Leadership",
      phone: "057-590144",
      email: "principal@redroseschool.edu.np",
      description:
        "Mr. Binod Subedi has been leading Red Rose Boarding School with vision and commitment for over a decade, driving academic rigor and holistic development.",
      visible: true,
    },
    {
      id: 2,
      name: "Amul Shrestha",
      position: "Vice Principal",
      imageUrl: "",
      imageZoom: 1,
      imageOffsetX: 0,
      imageOffsetY: 0,
      qualification: "M.Ed",
      phone: "057-590145",
      email: "viceprincipal@redroseschool.edu.np",
      description:
        "Oversees daily academic administration, teacher development, and student welfare, maintaining high standards of discipline and achievement.",
      visible: true,
    },
    {
      id: 3,
      name: "Prem Hamal",
      position: "Science Dept Head",
      imageUrl: "",
      imageZoom: 1,
      imageOffsetX: 0,
      imageOffsetY: 0,
      qualification: "B.Sc, B.Ed",
      phone: "057-590146",
      email: "prem.science@redroseschool.edu.np",
      description:
        "Passionate science educator bringing hands-on practical experiments in Physics, Chemistry, and Biology to secondary school students.",
      visible: true,
    },
    {
      id: 4,
      name: "Saraswati Sharma",
      position: "English Dept Head",
      imageUrl: "",
      imageZoom: 1,
      imageOffsetX: 0,
      imageOffsetY: 0,
      qualification: "M.A. English, B.Ed",
      phone: "057-590144",
      email: "saraswati.english@redroseschool.edu.np",
      description:
        "Specializes in English literature and communication skills, fostering creative writing and debate programs across all grade levels.",
      visible: true,
    },
    {
      id: 5,
      name: "Ramesh Karki",
      position: "Mathematics Dept Head",
      imageUrl: "",
      imageZoom: 1,
      imageOffsetX: 0,
      imageOffsetY: 0,
      qualification: "M.Sc Mathematics",
      phone: "057-590145",
      email: "ramesh.math@redroseschool.edu.np",
      description:
        "Dedicated to simplifying mathematics and encouraging logical thinking, problem-solving, and competitive Olympiad prep.",
      visible: true,
    },
    {
      id: 6,
      name: "Anita Adhikari",
      position: "Primary Level Coordinator",
      imageUrl: "",
      imageZoom: 1,
      imageOffsetX: 0,
      imageOffsetY: 0,
      qualification: "M.Ed in Child Psychology",
      phone: "057-590146",
      email: "anita.primary@redroseschool.edu.np",
      description:
        "Guides primary educators to build a friendly, nurturing, activity-based foundation for young learners.",
      visible: true,
    },
  ],
};

function normalizeStats(stats) {
  if (!Array.isArray(stats) || stats.length === 0) {
    return defaultStaffContent.stats;
  }
  return stats.map((stat, index) => ({
    ...(defaultStaffContent.stats[index] || {}),
    ...stat,
    id: stat.id || `stat-${index}`,
    icon: stat.icon || defaultStaffContent.stats[index]?.icon || "users",
  }));
}

function clampNumber(value, min, max, fallback) {
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue)) return fallback;
  return Math.min(max, Math.max(min, numberValue));
}

function normalizeStaff(staff) {
  if (!Array.isArray(staff) || staff.length === 0) {
    return defaultStaffContent.staff;
  }
  return staff.map((member, index) => {
    const savedImageUrl = String(member.imageUrl || "").trim();
    const cleanImageUrl = isHardcodedStaffImageUrl(savedImageUrl) ? "" : savedImageUrl;

    return {
      ...(defaultStaffContent.staff[index] || {}),
      ...member,
      id: member.id || Date.now() + index,
      name: member.name || "Staff Member",
      position: member.position || "Teacher",
      imageUrl: cleanImageUrl,
      imageZoom: clampNumber(member.imageZoom, 1, 3, 1),
      imageOffsetX: clampNumber(member.imageOffsetX, -60, 60, 0),
      imageOffsetY: clampNumber(member.imageOffsetY, -60, 60, 0),
      qualification: member.qualification || "",
      phone: member.phone || "",
      email: member.email || "",
      description: member.description || "",
      visible: member.visible !== false,
      accentColor: typeof member.accentColor === "string" ? member.accentColor.trim() : "",
    };
  });
}

export function mergeStaffContent(saved = {}) {
  return {
    ...defaultStaffContent,
    ...(saved || {}),
    stats: normalizeStats(saved?.stats),
    staff: normalizeStaff(saved?.staff),
  };
}

function getStatIcon(icon) {
  if (icon === "graduation") return GraduationCap;
  if (icon === "award") return Award;
  return Users;
}

function getStaffImageStyle(staff = {}) {
  const zoom = clampNumber(staff.imageZoom, 1, 3, 1);
  const x = clampNumber(staff.imageOffsetX, -60, 60, 0);
  const y = clampNumber(staff.imageOffsetY, -60, 60, 0);

  return {
    objectFit: "cover",
    objectPosition: "center",
    transform: `translate(${x}%, ${y}%) scale(${zoom})`,
    transformOrigin: "center center",
  };
}

function StaffImage({ staff }) {
  const src = staff?.imageUrl || "";
  const name = staff?.name || "Staff member";

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        style={getStaffImageStyle(staff)}
        loading="lazy"
      />
    );
  }

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
      <UserRound className="w-16 h-16 text-slate-300" />
    </div>
  );
}

function ActionButtons({
  editMode,
  target,
  onEditTarget,
  onDeleteTarget,
  canDelete = false,
  label = "Edit",
  icon: Icon = Pencil,
  className = "absolute -top-2 -right-2 z-50",
}) {
  if (!editMode) return null;

  return (
    <div
      className={`${className} flex items-center gap-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 pointer-events-auto`}
      style={{ transform: "translateZ(60px)" }}
    >
      <button
        type="button"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onEditTarget(target);
        }}
        className="rounded-full w-8 h-8 flex items-center justify-center bg-white text-slate-900 shadow-lg border border-slate-200 hover:scale-110 transition-transform cursor-pointer"
        title={label}
      >
        <Icon className="w-3.5 h-3.5" />
      </button>

      {canDelete && (
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onDeleteTarget(target);
          }}
          className="rounded-full w-8 h-8 flex items-center justify-center bg-white text-red-600 shadow-lg border border-slate-200 hover:scale-110 hover:bg-red-50 transition-all cursor-pointer"
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
  onDeleteTarget = () => { },
  canDelete = false,
  label = "Edit",
  icon = Pencil,
  className = "",
  children,
}) {
  if (!editMode) return children;

  return (
    <div className={`relative group ${className}`}>
      {children}
      <ActionButtons
        editMode={editMode}
        target={target}
        onEditTarget={onEditTarget}
        onDeleteTarget={onDeleteTarget}
        canDelete={canDelete}
        label={label}
        icon={icon}
      />
    </div>
  );
}

function AddStaffButton({ editMode, onAddTarget }) {
  if (!editMode) return null;

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onAddTarget("staffMember");
      }}
      className="mt-10 sm:mt-12 mx-auto flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold bg-white text-slate-900 border border-slate-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer"
    >
      <Plus className="w-4 h-4 text-indigo-500" />
      Add Staff Member
    </button>
  );
}

// ─── BACKGROUND: layered dot-matrix + smooth optimized ambient glows ───
function GridBlobBackground({ editMode = false }) {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none select-none">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-50" />

      {/* Dot matrix — quiet depth cue */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: "radial-gradient(circle, #cbd5e1 1.5px, transparent 1.5px)",
          backgroundSize: "26px 26px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 20%, black 40%, transparent 90%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 20%, black 40%, transparent 90%)",
        }}
      />

      {/* Lightweight CSS ambient glows - no heavy JS physics loops */}
      {!editMode && (
        <>
          <div
            className="absolute -top-32 -left-24 w-[420px] h-[420px] rounded-full blur-3xl opacity-60 pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${ACCENTS[0].soft.replace("0.16", "0.4")}, transparent 70%)`,
            }}
          />
          <div
            className="absolute top-1/4 -right-36 w-[480px] h-[480px] rounded-full blur-3xl opacity-50 pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${ACCENTS[2].soft.replace("0.16", "0.35")}, transparent 70%)`,
            }}
          />
          <div
            className="absolute bottom-0 left-1/4 w-[360px] h-[360px] rounded-full blur-3xl opacity-45 pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${ACCENTS[3].soft.replace("0.16", "0.35")}, transparent 70%)`,
            }}
          />
          <div
            className="absolute top-6 right-1/3 w-[260px] h-[260px] rounded-full blur-3xl opacity-40 pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${ACCENTS[1].soft.replace("0.16", "0.35")}, transparent 70%)`,
            }}
          />
        </>
      )}
    </div>
  );
}

// ─── Clean, vibrant glowing frame behind staff photo ───
function AvatarGlowFrame({ accent, editMode = false, children }) {
  return (
    <div
      className="relative p-[2.5px] rounded-[26px] overflow-hidden transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.22)]"
      style={{
        background: `linear-gradient(135deg, ${accent.solid}, ${accent.soft || "rgba(99,102,241,0.25)"})`,
      }}
    >
      <div className="relative rounded-[23.5px] overflow-hidden bg-white h-full w-full">{children}</div>
    </div>
  );
}

function StaffPopup({ staff, onClose, accent }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <AnimatePresence>
      {staff && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
          style={{ background: "rgba(10, 22, 40, 0.75)", backdropFilter: "blur(12px)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
            className="relative w-full max-w-3xl my-auto bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 max-h-[92vh] flex flex-col"
          >
            <div
              className="h-1.5 w-full shrink-0"
              style={{ background: `linear-gradient(90deg, ${ACCENTS[0].solid}, ${ACCENTS[2].solid}, ${ACCENTS[3].solid})` }}
            />

            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 z-50 w-9 h-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 transition-colors shadow-sm cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12 min-h-[380px] overflow-y-auto">
              {/* Image Area */}
              <div className="md:col-span-5 relative h-64 md:h-auto bg-gradient-to-br from-slate-100 to-slate-200 shrink-0">
                {staff.imageUrl ? (
                  <img
                    src={staff.imageUrl}
                    alt={staff.name}
                    className="w-full h-full object-cover"
                    style={getStaffImageStyle(staff)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center min-h-[220px]">
                    <UserRound className="w-20 h-20 text-slate-400" />
                  </div>
                )}
              </div>

              {/* Content Area */}
              <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2.5 mb-2">
                    <span
                      className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm"
                      style={{ backgroundColor: accent?.solid || "#1E293B" }}
                    >
                      {staff.position}
                    </span>
                    {staff.qualification && (
                      <span className="text-xs font-medium text-slate-500">{staff.qualification}</span>
                    )}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">{staff.name}</h2>

                  {staff.description && (
                    <p className="text-sm text-slate-600 leading-relaxed mb-6">
                      {staff.description}
                    </p>
                  )}
                </div>

                <div className="pt-5 border-t border-slate-100 flex flex-wrap gap-4 sm:gap-6">
                  {staff.phone && (
                    <a
                      href={`tel:${staff.phone}`}
                      className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                        <Phone className="w-4 h-4 text-slate-500" />
                      </div>
                      <span>{staff.phone}</span>
                    </a>
                  )}

                  {staff.email && (
                    <a
                      href={`mailto:${staff.email}`}
                      className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors break-all"
                    >
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                        <Mail className="w-4 h-4 text-slate-500" />
                      </div>
                      <span>{staff.email}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Staff({
  editMode = false,
  contentOverride = null,
  onEditTarget = () => { },
  onDeleteTarget = () => { },
  onAddTarget = () => { },
}) {
  const [content, setContent] = useState(() =>
    mergeStaffContent(contentOverride || defaultStaffContent)
  );
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [selectedAccent, setSelectedAccent] = useState(ACCENTS[0]);

  useEffect(() => {
    if (contentOverride) {
      setContent(mergeStaffContent(contentOverride));
      return;
    }

    let alive = true;
    const loadStaffContent = async () => {
      try {
        const res = await api.get(
          "/api/site-content/staff",
          { timeout: 8000 }
        );
        if (!alive) return;
        setContent(mergeStaffContent(res.data?.data?.content || {}));
      } catch (error) {
        console.error("Staff content load error:", error);
        if (alive) setContent(mergeStaffContent(defaultStaffContent));
      }
    };

    loadStaffContent();
    return () => {
      alive = false;
    };
  }, [contentOverride]);

  useEffect(() => {
    if (editMode || !selectedStaff) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedStaff, editMode]);

  const visibleStaff = content.staff.filter((staff) => staff.visible !== false);

  // Split the title around the highlighted word so it can carry a gradient accent.
  const title = content.title || "Our Staff Members";
  const highlight = content.highlightedWord && title.includes(content.highlightedWord)
    ? content.highlightedWord
    : null;
  const [titleBefore, titleAfter] = highlight ? title.split(highlight) : [title, ""];

  return (
    <section className={`relative overflow-hidden w-full ${editMode ? "py-8 px-3 sm:px-6" : "min-h-screen pt-28 pb-24"}`}>
      <GridBlobBackground editMode={editMode} />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 relative z-10">

        {/* ─── HEADER ─── */}
        <EditableWrap
          editMode={editMode}
          target={{ type: "pageHeader" }}
          onEditTarget={onEditTarget}
          label="Edit staff heading"
        >
          {editMode ? (
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
              <span
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-md mb-6"
                style={{ background: `linear-gradient(120deg, ${ACCENTS[0].solid}, ${ACCENTS[1].solid})` }}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                {content.badgeText || "Faculty & Team"}
              </span>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                {titleBefore}
                {highlight && (
                  <span
                    className="bg-clip-text text-transparent"
                    style={{ backgroundImage: `linear-gradient(120deg, ${ACCENTS[0].solid}, ${ACCENTS[3].solid})` }}
                  >
                    {highlight}
                  </span>
                )}
                {titleAfter}
              </h1>

              <p className="mt-4 text-sm sm:text-base md:text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto font-light">
                {content.subtitle ||
                  "Meet the dedicated educators, department heads, and leaders guiding students at Red Rose Secondary English Boarding School."}
              </p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <span
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-md mb-6"
                style={{ background: `linear-gradient(120deg, ${ACCENTS[0].solid}, ${ACCENTS[1].solid})` }}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                {content.badgeText || "Faculty & Team"}
              </span>

              <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                {titleBefore}
                {highlight && (
                  <span
                    className="bg-clip-text text-transparent"
                    style={{ backgroundImage: `linear-gradient(120deg, ${ACCENTS[0].solid}, ${ACCENTS[3].solid})` }}
                  >
                    {highlight}
                  </span>
                )}
                {titleAfter}
              </h1>

              <p className="mt-4 text-base sm:text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto font-light">
                {content.subtitle ||
                  "Meet the dedicated educators, department heads, and leaders guiding students at Red Rose Secondary English Boarding School."}
              </p>
            </motion.div>
          )}
        </EditableWrap>

        {/* ─── STATS ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-14 sm:mb-20">
          {content.stats.map((stat, index) => {
            const Icon = getStatIcon(stat.icon);
            const accent = { solid: stat.color || accentFor(index).solid };

            const statCardContent = (
              <div className="relative rounded-2xl p-6 md:p-8 text-center bg-white/80 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgba(15,23,42,0.06)] hover:shadow-[0_16px_40px_rgba(15,23,42,0.1)] hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center overflow-hidden">
                <div
                  className="absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-60 pointer-events-none"
                  style={{ background: accent.solid }}
                />
                <div
                  className="relative w-12 h-12 rounded-2xl text-white flex items-center justify-center mb-4 shadow-md"
                  style={{ background: `linear-gradient(135deg, ${accent.solid}, ${accentFor(index + 1).solid})` }}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="relative text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  {stat.value}
                </h3>
                <p className="relative text-sm font-medium text-slate-500 mt-1">{stat.label}</p>
              </div>
            );

            return (
              <EditableWrap
                key={stat.id || index}
                editMode={editMode}
                target={{ type: "statCard", index }}
                onEditTarget={onEditTarget}
                label="Edit number card"
              >
                {editMode ? (
                  statCardContent
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                  >
                    {statCardContent}
                  </motion.div>
                )}
              </EditableWrap>
            );
          })}
        </div>

        {/* ─── STAFF GRID ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleStaff.map((staff, index) => {
            const realIndex = content.staff.findIndex((m) => m.id === staff.id);
            const accent = { solid: staff.accentColor || accentFor(realIndex).solid };

            const cardInner = (
              <TiltCard
                editMode={editMode}
                className="relative bg-white/80 backdrop-blur-xl rounded-3xl border border-white shadow-[0_8px_30px_rgba(15,23,42,0.06)] hover:shadow-[0_20px_50px_rgba(15,23,42,0.12)] hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col h-full"
              >
                <ActionButtons
                  editMode={editMode}
                  target={{ type: "staffCard", index: realIndex }}
                  onEditTarget={onEditTarget}
                  onDeleteTarget={onDeleteTarget}
                  canDelete
                  label="Edit staff member"
                  className="absolute top-3 right-3 z-30"
                />

                {/* Framed photo with glowing accent frame */}
                <div className="p-5 pb-0">
                  <AvatarGlowFrame accent={accent} editMode={editMode}>
                    <div className="relative h-56 w-full overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
                      <StaffImage staff={staff} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />

                      {editMode && (
                        <button
                          type="button"
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            onEditTarget({ type: "staffImage", index: realIndex });
                          }}
                          className="absolute top-3 left-3 z-30 h-9 w-9 rounded-full bg-white text-slate-800 flex items-center justify-center shadow-md border border-slate-200 hover:scale-105 transition-transform opacity-100 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer pointer-events-auto"
                          style={{ transform: "translateZ(60px)" }}
                          title="Change photo"
                        >
                          <Camera className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </AvatarGlowFrame>
                </div>

                {/* Content Area */}
                <div className="p-6 flex-1 flex flex-col justify-between relative z-20">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: accent.solid }}
                      />
                      <span
                        className="text-[11px] font-bold uppercase tracking-wider"
                        style={{ color: accent.solid }}
                      >
                        {staff.position}
                      </span>
                    </div>

                    <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-snug group-hover:text-slate-800 transition-colors">
                      {staff.name}
                    </h3>

                    {staff.qualification && (
                      <p className="mt-1 text-xs font-medium text-slate-400">
                        {staff.qualification}
                      </p>
                    )}

                    {staff.description && (
                      <p className="mt-3 text-sm text-slate-500 leading-relaxed line-clamp-3">
                        {staff.description}
                      </p>
                    )}
                  </div>

                  {/* Footer Action */}
                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-sm font-semibold">
                    <span className="flex items-center gap-2 text-slate-500">
                      <Mail className="w-4 h-4" /> Contact
                    </span>
                    <span
                      className="flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                      style={{ color: accent.solid }}
                    >
                      View Profile <span className="text-lg">↗</span>
                    </span>
                  </div>
                </div>
              </TiltCard>
            );

            if (editMode) {
              return (
                <div
                  key={staff.id}
                  className="group relative"
                >
                  {cardInner}
                </div>
              );
            }

            return (
              <motion.div
                key={staff.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                onClick={() => {
                  setSelectedAccent(accent);
                  setSelectedStaff(staff);
                }}
                className="group cursor-pointer"
              >
                {cardInner}
              </motion.div>
            );
          })}
        </div>

        <AddStaffButton editMode={editMode} onAddTarget={onAddTarget} />
      </div>

      {!editMode && (
        <StaffPopup staff={selectedStaff} onClose={() => setSelectedStaff(null)} accent={selectedAccent} />
      )}
    </section>
  );
}

export default Staff;