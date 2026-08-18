import { useEffect, useState } from "react";
import api from "../lib/api";
import {
  Camera,
  GraduationCap,
  Mail,
  Pencil,
  Phone,
  Plus,
  Trash2,
  UserRound,
  Users,
  Award,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/*
 * RED ROSE STAFF PAGE
 * -------------------
 * Redesigned to follow the visual language of the About/Facilities pages:
 * - warm cream background
 * - burgundy editorial hero
 * - gold accents
 * - zig-zag section edge
 * - large alternating staff sections
 * - principal-message-style profile popup
 *
 * Existing API/edit targets are intentionally preserved so the admin editor
 * can continue using this component without changing its target names.
 */

export const ACCENTS = [
  { name: "burgundy", solid: "#A62B4F", soft: "rgba(166,43,79,0.14)" },
  { name: "gold", solid: "#C79A3B", soft: "rgba(199,154,59,0.14)" },
  { name: "green", solid: "#3F6652", soft: "rgba(63,102,82,0.14)" },
  { name: "plum", solid: "#5C3B52", soft: "rgba(92,59,82,0.14)" },
  { name: "rose", solid: "#B64A63", soft: "rgba(182,74,99,0.14)" },
];

export function accentFor(index = 0) {
  return ACCENTS[index % ACCENTS.length];
}

export const colors = {
  navy: "#15111A",
  primary: "#A62B4F",
  slate: "#786C72",
  light: "#F5EEE2",
  white: "#FFFFFF",
  burgundy: "#24131F",
  gold: "#C79A3B",
  cream: "#FBF7EF",
  text: "#211824",
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
  badgeText: "Our Faculty",
  title: "The People Behind Every Student's Journey",
  highlightedWord: "Student's Journey",
  subtitle:
    "Meet the dedicated educators, department heads, and leaders who make Red Rose Secondary English Boarding School a place to learn, grow, and belong.",
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

function clampNumber(value, min, max, fallback) {
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue)) return fallback;
  return Math.min(max, Math.max(min, numberValue));
}

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

function normalizeStaff(staff) {
  if (!Array.isArray(staff) || staff.length === 0) {
    return defaultStaffContent.staff;
  }

  return staff.map((member, index) => {
    const savedImageUrl = String(member.imageUrl || "").trim();
    const cleanImageUrl = isHardcodedStaffImageUrl(savedImageUrl)
      ? ""
      : savedImageUrl;

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
      accentColor:
        typeof member.accentColor === "string"
          ? member.accentColor.trim()
          : "",
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

function StaffImage({ staff, className = "" }) {
  const src = staff?.imageUrl || "";
  const name = staff?.name || "Staff member";

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`w-full h-full object-cover ${className}`}
        style={getStaffImageStyle(staff)}
        loading="lazy"
      />
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center bg-[#E9DED0]">
      <UserRound className="w-20 h-20 text-[#BBAFA7]" />
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
      className={`${className} flex items-center gap-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300`}
    >
      <button
        type="button"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onEditTarget(target);
        }}
        className="rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        style={{
          background: colors.white,
          color: colors.text,
          border: "1px solid #E5D8C8",
        }}
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
          className="rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          style={{
            background: "#FCE7E7",
            color: "#B3261E",
            border: "1px solid #F3CCCC",
          }}
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
      className="mt-10 mx-auto flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold shadow-md hover:-translate-y-0.5 transition-all"
      style={{
        background: colors.burgundy,
        color: colors.white,
      }}
    >
      <Plus className="w-4 h-4" />
      Add Staff Member
    </button>
  );
}

function ZigZagBottom({ color = colors.cream }) {
  return (
    <div
      className="absolute bottom-0 left-0 right-0 h-8 z-20"
      style={{
        background: `linear-gradient(135deg, transparent 25%, ${color} 25%) 0 0 / 42px 32px repeat-x`,
        clipPath:
          "polygon(0 42%, 3% 100%, 6% 42%, 9% 100%, 12% 42%, 15% 100%, 18% 42%, 21% 100%, 24% 42%, 27% 100%, 30% 42%, 33% 100%, 36% 42%, 39% 100%, 42% 42%, 45% 100%, 48% 42%, 51% 100%, 54% 42%, 57% 100%, 60% 42%, 63% 100%, 66% 42%, 69% 100%, 72% 42%, 75% 100%, 78% 42%, 81% 100%, 84% 42%, 87% 100%, 90% 42%, 93% 100%, 96% 42%, 100% 100%, 100% 100%, 0 100%)",
      }}
    />
  );
}

function HeroPattern() {
  return (
    <div
      className="absolute inset-0 opacity-[0.13] pointer-events-none"
      style={{
        backgroundImage:
          "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1.2px)",
        backgroundSize: "18px 18px",
        maskImage:
          "linear-gradient(to bottom, black 0%, black 65%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, black 0%, black 65%, transparent 100%)",
      }}
    />
  );
}

function SectionLabel({ children, light = false }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span
        className="w-10 h-px"
        style={{ background: light ? "#DDBE76" : colors.gold }}
      />
      <span
        className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.22em]"
        style={{ color: light ? "#E8CF98" : colors.primary }}
      >
        {children}
      </span>
    </div>
  );
}

function StaffPopup({ staff, onClose }) {
  useEffect(() => {
    if (!staff) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [staff, onClose]);

  return (
    <AnimatePresence>
      {staff && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          style={{
            background: "rgba(24, 17, 23, 0.78)",
            backdropFilter: "blur(9px)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            onClick={(event) => event.stopPropagation()}
            initial={{ opacity: 0, scale: 0.96, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 15 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-[28px] shadow-[0_35px_100px_rgba(0,0,0,0.35)]"
            style={{
              background: colors.cream,
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            {/* Burgundy principal-message-style header */}
            <div
              className="relative overflow-hidden px-6 sm:px-9 pt-7 sm:pt-8 pb-14"
              style={{
                background:
                  "linear-gradient(135deg, #8F2345 0%, #B82E53 58%, #8E2746 100%)",
              }}
            >
              <div
                className="absolute inset-0 opacity-[0.16]"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1.5px)",
                  backgroundSize: "16px 16px",
                }}
              />

              <div className="relative z-10">
                <div className="flex items-start justify-between">
                  <div
                    className="text-5xl sm:text-6xl leading-none"
                    style={{
                      color: "rgba(255,255,255,0.75)",
                      fontFamily: "Georgia, serif",
                    }}
                  >
                    “
                  </div>

                  <button
                    type="button"
                    onClick={onClose}
                    className="w-10 h-10 rounded-full flex items-center justify-center hover:rotate-90 transition-all duration-300"
                    style={{
                      color: colors.white,
                      background: "rgba(255,255,255,0.12)",
                      border: "1px solid rgba(255,255,255,0.28)",
                    }}
                    title="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <p
                  className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.28em] mb-6"
                  style={{ color: "#F1D9A0" }}
                >
                  Meet Our Team
                </p>

                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 shrink-0"
                    style={{ background: "#D6AE57" }}
                  >
                    <div className="w-full h-full rounded-full overflow-hidden bg-[#E9DED0] flex items-center justify-center">
                      <StaffImage staff={staff} />
                    </div>
                  </div>

                  <div>
                    <h3
                      className="text-xl sm:text-2xl font-bold"
                      style={{
                        color: colors.white,
                        fontFamily: "Georgia, 'Times New Roman', serif",
                      }}
                    >
                      {staff.name}
                    </h3>
                    <p
                      className="mt-1 text-xs sm:text-sm font-semibold uppercase tracking-[0.12em]"
                      style={{ color: "#F0D99E" }}
                    >
                      {staff.position}
                    </p>
                  </div>
                </div>
              </div>

              {/* Header-to-paper zig-zag */}
              <div
                className="absolute bottom-0 left-0 right-0 h-8"
                style={{
                  background: colors.cream,
                  clipPath:
                    "polygon(0 45%, 4% 100%, 8% 45%, 12% 100%, 16% 45%, 20% 100%, 24% 45%, 28% 100%, 32% 45%, 36% 100%, 40% 45%, 44% 100%, 48% 45%, 52% 100%, 56% 45%, 60% 100%, 64% 45%, 68% 100%, 72% 45%, 76% 100%, 80% 45%, 84% 100%, 88% 45%, 92% 100%, 96% 45%, 100% 100%, 100% 100%, 0 100%)",
                }}
              />
            </div>

            {/* Cream paper content */}
            <div className="px-6 sm:px-10 pt-2 pb-8 sm:pb-10">
              <h2
                className="text-2xl sm:text-3xl font-bold leading-tight mb-3"
                style={{
                  color: colors.text,
                  fontFamily: "Georgia, 'Times New Roman', serif",
                }}
              >
                {staff.name}
              </h2>

              <div
                className="w-14 h-1 rounded-full mb-5"
                style={{
                  background:
                    "linear-gradient(90deg, #A62B4F, #C79A3B)",
                }}
              />

              {staff.qualification && (
                <p
                  className="text-sm font-semibold mb-4"
                  style={{ color: colors.primary }}
                >
                  {staff.qualification}
                </p>
              )}

              {staff.description && (
                <div
                  className="rounded-2xl px-5 py-4 mb-5"
                  style={{
                    background: "#F7F0E6",
                    border: "1px solid #E9DCCB",
                  }}
                >
                  <p
                    className="text-sm sm:text-base leading-7"
                    style={{ color: "#6F6268" }}
                  >
                    {staff.description}
                  </p>
                </div>
              )}

              <div
                className="rounded-2xl p-5"
                style={{
                  background: "#FFF9F0",
                  border: "1px solid #E9DCCB",
                }}
              >
                <p
                  className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4"
                  style={{ color: colors.primary }}
                >
                  Contact
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {staff.phone && (
                    <a
                      href={`tel:${staff.phone}`}
                      className="flex items-center gap-3 p-3 rounded-xl hover:-translate-y-0.5 transition-transform"
                      style={{
                        background: "#F5EEE3",
                        color: colors.text,
                      }}
                    >
                      <span
                        className="w-9 h-9 rounded-full flex items-center justify-center"
                        style={{
                          background: "#EAD3D9",
                          color: colors.primary,
                        }}
                      >
                        <Phone className="w-4 h-4" />
                      </span>
                      <span className="text-sm font-medium break-all">
                        {staff.phone}
                      </span>
                    </a>
                  )}

                  {staff.email && (
                    <a
                      href={`mailto:${staff.email}`}
                      className="flex items-center gap-3 p-3 rounded-xl hover:-translate-y-0.5 transition-transform"
                      style={{
                        background: "#F5EEE3",
                        color: colors.text,
                      }}
                    >
                      <span
                        className="w-9 h-9 rounded-full flex items-center justify-center"
                        style={{
                          background: "#F0E1BE",
                          color: "#8A681E",
                        }}
                      >
                        <Mail className="w-4 h-4" />
                      </span>
                      <span className="text-sm font-medium break-all">
                        {staff.email}
                      </span>
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
  onEditTarget = () => {},
  onDeleteTarget = () => {},
  onAddTarget = () => {},
}) {
  const [content, setContent] = useState(() =>
    mergeStaffContent(contentOverride || defaultStaffContent)
  );
  const [selectedStaff, setSelectedStaff] = useState(null);

  useEffect(() => {
    if (contentOverride) {
      setContent(mergeStaffContent(contentOverride));
      return undefined;
    }

    let alive = true;

    const loadStaffContent = async () => {
      try {
        const res = await api.get("/api/site-content/staff", {
          timeout: 8000,
        });

        if (!alive) return;

        setContent(
          mergeStaffContent(res.data?.data?.content || {})
        );
      } catch (error) {
        console.error("Staff content load error:", error);

        if (alive) {
          setContent(mergeStaffContent(defaultStaffContent));
        }
      }
    };

    loadStaffContent();

    return () => {
      alive = false;
    };
  }, [contentOverride]);

  useEffect(() => {
    if (editMode || !selectedStaff) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedStaff, editMode]);

  const visibleStaff = content.staff.filter(
    (staff) => staff.visible !== false
  );

  const title = content.title || "The People Behind Every Student's Journey";
  const highlight =
    content.highlightedWord && title.includes(content.highlightedWord)
      ? content.highlightedWord
      : null;

  const [titleBefore, titleAfter] = highlight
    ? title.split(highlight)
    : [title, ""];

  return (
    <section
      className={`relative overflow-hidden ${
        editMode ? "py-8 px-3 sm:px-6" : "pt-24 pb-24 sm:pt-28"
      }`}
      style={{ background: colors.cream }}
    >
      {/* ============================================================
          HERO
          ============================================================ */}
      <div className="relative z-10 max-w-[1260px] mx-auto px-4 sm:px-7">
        <EditableWrap
          editMode={editMode}
          target={{ type: "pageHeader" }}
          onEditTarget={onEditTarget}
          label="Edit staff heading"
        >
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="relative overflow-hidden rounded-[34px] min-h-[430px] sm:min-h-[470px] flex items-center"
            style={{
              background:
                "linear-gradient(135deg, #1D111B 0%, #2C1525 48%, #4A1C2E 100%)",
              boxShadow: "0 28px 70px rgba(54,30,39,0.20)",
            }}
          >
            <HeroPattern />

            <div className="relative z-10 w-full px-7 sm:px-12 lg:px-16 py-14 sm:py-16">
              <div className="max-w-[820px]">
                <SectionLabel light>
                  {content.badgeText || "Our Faculty"}
                </SectionLabel>

                <h1
                  className="text-4xl sm:text-5xl lg:text-[64px] leading-[1.02] tracking-[-0.035em] font-bold"
                  style={{
                    color: colors.white,
                    fontFamily:
                      "Georgia, 'Times New Roman', serif",
                  }}
                >
                  {titleBefore}
                  {highlight && (
                    <span style={{ color: "#E6C978" }}>
                      {highlight}
                    </span>
                  )}
                  {titleAfter}
                </h1>

                <p
                  className="mt-7 max-w-2xl text-base sm:text-lg leading-8"
                  style={{ color: "rgba(255,255,255,0.72)" }}
                >
                  {content.subtitle}
                </p>

                <div className="mt-8 inline-flex items-center gap-2 rounded-full px-4 py-2 border border-[#D5B86D]/40 bg-white/5">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: "#E1C16E" }}
                  />
                  <span
                    className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em]"
                    style={{ color: "#E6D29C" }}
                  >
                    Dedicated to every learner
                  </span>
                </div>
              </div>

              {/* RR mark */}
              <div className="absolute right-7 sm:right-12 lg:right-16 top-1/2 -translate-y-1/2 hidden md:flex">
                <div
                  className="w-40 h-40 lg:w-52 lg:h-52 rounded-full p-2"
                  style={{
                    background:
                      "linear-gradient(135deg, #C79A3B, #F0D891, #8E6720)",
                  }}
                >
                  <div
                    className="w-full h-full rounded-full flex flex-col items-center justify-center"
                    style={{
                      background: "#281521",
                      border: "1px dashed rgba(226,201,137,0.5)",
                    }}
                  >
                    <div
                      className="text-4xl lg:text-5xl font-bold"
                      style={{
                        color: "#E3C67C",
                        fontFamily:
                          "Georgia, 'Times New Roman', serif",
                      }}
                    >
                      RR
                    </div>
                    <div
                      className="mt-1 text-[8px] font-bold tracking-[0.28em]"
                      style={{ color: "#D7C59D" }}
                    >
                      RED ROSE
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <ZigZagBottom />
          </motion.div>
        </EditableWrap>

        {/* ============================================================
            SMALL STAT STRIP
            ============================================================ */}
        <div className="relative z-30 -mt-5 sm:-mt-7 px-3 sm:px-8">
          <div
            className="grid grid-cols-1 sm:grid-cols-3 rounded-[22px] overflow-hidden"
            style={{
              background: "#FFF9F0",
              border: "1px solid #E8DCCB",
              boxShadow: "0 18px 40px rgba(55,39,30,0.10)",
            }}
          >
            {content.stats.map((stat, index) => {
              const Icon = getStatIcon(stat.icon);

              return (
                <EditableWrap
                  key={stat.id || index}
                  editMode={editMode}
                  target={{ type: "statCard", index }}
                  onEditTarget={onEditTarget}
                  label="Edit number card"
                  className="h-full"
                >
                  <div
                    className={`p-5 sm:p-6 text-center flex items-center justify-center gap-4 ${
                      index !== content.stats.length - 1
                        ? "border-b sm:border-b-0 sm:border-r"
                        : ""
                    }`}
                    style={{ borderColor: "#E8DCCB" }}
                  >
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
                      style={{
                        background:
                          index === 1 ? "#F0E4C7" : "#EAD6DD",
                        color:
                          index === 1
                            ? "#8A681E"
                            : colors.primary,
                      }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="text-left">
                      <div
                        className="text-2xl font-bold"
                        style={{
                          color: colors.text,
                          fontFamily:
                            "Georgia, 'Times New Roman', serif",
                        }}
                      >
                        {stat.value}
                      </div>
                      <div
                        className="text-[10px] font-bold uppercase tracking-[0.15em]"
                        style={{ color: colors.slate }}
                      >
                        {stat.label}
                      </div>
                    </div>
                  </div>
                </EditableWrap>
              );
            })}
          </div>
        </div>

        {/* ============================================================
            INTRO
            ============================================================ */}
        <div className="max-w-[1050px] mx-auto pt-24 sm:pt-32 pb-12">
          <SectionLabel>Our People</SectionLabel>

          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8 lg:gap-20 items-start">
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl leading-[1.08] font-bold"
              style={{
                color: colors.text,
                fontFamily:
                  "Georgia, 'Times New Roman', serif",
              }}
            >
              Educators who make a difference{" "}
              <span style={{ color: colors.primary }}>
                every day.
              </span>
            </h2>

            <p
              className="text-base sm:text-lg leading-8"
              style={{ color: colors.slate }}
            >
              Great schools are built by people who care deeply about
              learning and about the students they serve. At Red Rose,
              our faculty combine subject expertise, mentorship, and
              genuine attention to help students discover confidence,
              curiosity, and purpose.
            </p>
          </div>
        </div>

        {/* ============================================================
            STAFF EDITORIAL LIST
            ============================================================ */}
        <div className="max-w-[1050px] mx-auto space-y-8 sm:space-y-10">
          {visibleStaff.map((staff, index) => {
            const realIndex = content.staff.findIndex(
              (member) => member.id === staff.id
            );

            const isReversed = index % 2 === 1;
            const accent =
              staff.accentColor || accentFor(realIndex).solid;

            return (
              <EditableWrap
                key={staff.id}
                editMode={editMode}
                target={{ type: "staffCard", index: realIndex }}
                onEditTarget={onEditTarget}
                onDeleteTarget={onDeleteTarget}
                canDelete
                label="Edit staff member"
                className="group"
              >
                <motion.article
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    duration: 0.5,
                    delay: Math.min(index * 0.04, 0.2),
                  }}
                  onClick={() => {
                    if (!editMode) setSelectedStaff(staff);
                  }}
                  className={`relative cursor-pointer grid grid-cols-1 md:grid-cols-2 overflow-visible rounded-[28px] transition-all duration-300 hover:-translate-y-1 ${
                    isReversed ? "md:[&>div:first-child]:order-2" : ""
                  }`}
                  style={{
                    background: "#FFF9F0",
                    border: "1px solid #E8DCCB",
                    boxShadow:
                      "0 10px 35px rgba(55,39,30,0.08)",
                  }}
                >
                  {/* Image */}
                  <div className="relative min-h-[320px] sm:min-h-[390px] overflow-hidden rounded-t-[28px] md:rounded-t-none md:first:rounded-l-[28px] md:last:rounded-r-[28px]">
                    <StaffImage
                      staff={staff}
                      className="transition-transform duration-700 group-hover:scale-[1.035]"
                    />

                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(180deg, transparent 50%, rgba(24,15,22,0.28) 100%)",
                      }}
                    />

                    {/* Small number marker */}
                    <div
                      className="absolute top-5 left-5 w-12 h-12 rounded-full flex items-center justify-center"
                      style={{
                        background: "rgba(255,250,241,0.94)",
                        color: colors.primary,
                        border: "1px solid rgba(255,255,255,0.8)",
                      }}
                    >
                      <span
                        className="text-sm font-bold"
                        style={{
                          fontFamily:
                            "Georgia, 'Times New Roman', serif",
                        }}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    {editMode && (
                      <button
                        type="button"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          onEditTarget({
                            type: "staffImage",
                            index: realIndex,
                          });
                        }}
                        className="absolute top-5 right-5 z-30 w-10 h-10 rounded-full flex items-center justify-center shadow-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all"
                        style={{
                          background: colors.white,
                          color: colors.text,
                        }}
                        title="Change photo"
                      >
                        <Camera className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Text */}
                  <div
                    className={`relative p-7 sm:p-9 lg:p-11 flex flex-col justify-center ${
                      isReversed
                        ? "md:order-1"
                        : "md:order-2"
                    }`}
                  >
                    <div
                      className="w-12 h-1 rounded-full mb-7"
                      style={{
                        background:
                          "linear-gradient(90deg, #A62B4F, #C79A3B)",
                      }}
                    />

                    <p
                      className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] mb-3"
                      style={{ color: accent }}
                    >
                      {staff.position}
                    </p>

                    <h3
                      className="text-3xl sm:text-4xl font-bold leading-tight"
                      style={{
                        color: colors.text,
                        fontFamily:
                          "Georgia, 'Times New Roman', serif",
                      }}
                    >
                      {staff.name}
                    </h3>

                    {staff.qualification && (
                      <p
                        className="mt-2 text-sm font-medium"
                        style={{ color: "#9A8B86" }}
                      >
                        {staff.qualification}
                      </p>
                    )}

                    {staff.description && (
                      <p
                        className="mt-6 text-sm sm:text-base leading-7"
                        style={{ color: colors.slate }}
                      >
                        {staff.description}
                      </p>
                    )}

                    <div
                      className="mt-7 pt-5 border-t flex items-center justify-between gap-4"
                      style={{ borderColor: "#E8DCCB" }}
                    >
                      <div
                        className="flex items-center gap-2 text-xs font-semibold"
                        style={{ color: "#796B70" }}
                      >
                        <Mail className="w-4 h-4" />
                        Meet our team
                      </div>

                      <span
                        className="text-sm font-bold"
                        style={{ color: colors.primary }}
                      >
                        View Profile →
                      </span>
                    </div>
                  </div>

                  {/* Accent corner */}
                  <div
                    className={`absolute top-0 ${
                      isReversed ? "right-0" : "left-0"
                    } w-2 h-24 rounded-b-full`}
                    style={{ background: accent }}
                  />
                </motion.article>
              </EditableWrap>
            );
          })}
        </div>

        <AddStaffButton
          editMode={editMode}
          onAddTarget={onAddTarget}
        />

        {/* ============================================================
            CLOSING STATEMENT
            ============================================================ */}
        {!editMode && (
          <div
            className="max-w-[1050px] mx-auto mt-20 sm:mt-28 rounded-[30px] p-9 sm:p-12 text-center relative overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, #24131F 0%, #431B2D 100%)",
              boxShadow:
                "0 22px 55px rgba(45,25,36,0.16)",
            }}
          >
            <HeroPattern />

            <div className="relative z-10">
              <div
                className="text-4xl mb-3"
                style={{
                  color: "#DABF79",
                  fontFamily:
                    "Georgia, 'Times New Roman', serif",
                }}
              >
                “
              </div>

              <h3
                className="text-2xl sm:text-3xl font-bold"
                style={{
                  color: colors.white,
                  fontFamily:
                    "Georgia, 'Times New Roman', serif",
                }}
              >
                Every student deserves someone who believes in them.
              </h3>

              <p
                className="mt-4 max-w-2xl mx-auto text-sm sm:text-base leading-7"
                style={{ color: "rgba(255,255,255,0.68)" }}
              >
                That is the standard we bring to our classrooms,
                corridors, activities, and every student interaction.
              </p>
            </div>
          </div>
        )}
      </div>

      {!editMode && (
        <StaffPopup
          staff={selectedStaff}
          onClose={() => setSelectedStaff(null)}
        />
      )}

      <style>{`
        @media (max-width: 767px) {
          .staff-page-safe {
            overflow-x: hidden;
          }
        }
      `}</style>
    </section>
  );
}

export default Staff;
