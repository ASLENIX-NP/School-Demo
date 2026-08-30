import { useEffect, useMemo, useState } from "react";
import api from "../lib/api";
import {
  Camera,
  Mail,
  Pencil,
  Phone,
  Plus,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";



export const ACCENTS = [
  {
    name: "burgundy",
    solid: "#A62B4F",
    soft: "rgba(166,43,79,0.14)",
  },
  {
    name: "gold",
    solid: "#C79A3B",
    soft: "rgba(199,154,59,0.14)",
  },
  {
    name: "green",
    solid: "#3F6652",
    soft: "rgba(63,102,82,0.14)",
  },
  {
    name: "plum",
    solid: "#5C3B52",
    soft: "rgba(92,59,82,0.14)",
  },
  {
    name: "rose",
    solid: "#B64A63",
    soft: "rgba(182,74,99,0.14)",
  },
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

  return HARDCODED_STAFF_IMAGE_URLS.some((url) =>
    clean.startsWith(url)
  );
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
      accentColor: "",
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
      accentColor: "",
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
      accentColor: "",
    },
    {
      id: 4,
      name: "Sita Poudel",
      position: "English Dept Head",
      imageUrl: "",
      imageZoom: 1,
      imageOffsetX: 0,
      imageOffsetY: 0,
      qualification: "M.A. English, B.Ed",
      phone: "057-590147",
      email: "sita.english@redroseschool.edu.np",
      description:
        "Encourages confident communication, reading, writing, and creative expression across the secondary English curriculum.",
      visible: true,
      accentColor: "",
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
        "Dedicated to simplifying mathematics and encouraging logical thinking, problem-solving, and competitive Olympiad preparation.",
      visible: true,
      accentColor: "",
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
      accentColor: "",
    },
  ],
};

function clampNumber(value, min, max, fallback) {
  const numberValue = Number(value);

  if (!Number.isFinite(numberValue)) {
    return fallback;
  }

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
    icon:
      stat.icon ||
      defaultStaffContent.stats[index]?.icon ||
      "users",
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
      imageOffsetX: clampNumber(
        member.imageOffsetX,
        -60,
        60,
        0
      ),
      imageOffsetY: clampNumber(
        member.imageOffsetY,
        -60,
        60,
        0
      ),
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

function getStaffImageStyle(staff = {}) {
  const zoom = clampNumber(staff.imageZoom, 1, 3, 1);
  const x = clampNumber(staff.imageOffsetX, -60, 60, 0);
  const y = clampNumber(staff.imageOffsetY, -60, 60, 0);

  return {
    width: "100%",
    height: "100%",
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

function HeroPattern() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        opacity: 0.13,
        backgroundImage:
          "radial-gradient(circle, rgba(255,255,255,0.65) 1px, transparent 1.2px)",
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
        style={{
          background: light ? "#DDBE76" : colors.gold,
        }}
      />

      <span
        className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.22em]"
        style={{
          color: light ? "#E8CF98" : colors.primary,
        }}
      >
        {children}
      </span>
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
        className="rounded-full w-9 h-9 flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        style={{
          background: colors.white,
          color: colors.text,
          border: "1px solid #E5D8C8",
        }}
        title={label}
        aria-label={label}
      >
        <Icon className="w-4 h-4" />
      </button>

      {canDelete && (
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onDeleteTarget(target);
          }}
          className="rounded-full w-9 h-9 flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          style={{
            background: "#FCE7E7",
            color: "#B3261E",
            border: "1px solid #F3CCCC",
          }}
          title="Delete"
          aria-label="Delete"
        >
          <Trash2 className="w-4 h-4" />
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
      className="mt-10 mx-auto flex items-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-bold shadow-lg hover:-translate-y-0.5 transition-all"
      style={{
        background:
          "linear-gradient(135deg, #24131F, #4A1C2E)",
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
        background: color,
        clipPath:
          "polygon(0 42%, 3% 100%, 6% 42%, 9% 100%, 12% 42%, 15% 100%, 18% 42%, 21% 100%, 24% 42%, 27% 100%, 30% 42%, 33% 100%, 36% 42%, 39% 100%, 42% 42%, 45% 100%, 48% 42%, 51% 100%, 54% 42%, 57% 100%, 60% 42%, 63% 100%, 66% 42%, 69% 100%, 72% 42%, 75% 100%, 78% 42%, 81% 100%, 84% 42%, 87% 100%, 90% 42%, 93% 100%, 96% 42%, 100% 100%, 100% 100%, 0 100%)",
      }}
    />
  );
}

/*
|--------------------------------------------------------------------------
| ANIMATED NUMBER
|--------------------------------------------------------------------------
| Accepts values such as:
|   50+
|   240+
|   35+
|   98.5%
|
| The suffix remains fixed while the number scrolls/counts upward.
|--------------------------------------------------------------------------
*/

function parseStatValue(value) {
  const text = String(value ?? "").trim();

  const match = text.match(/^([+-]?\d+(?:\.\d+)?)(.*)$/);

  if (!match) {
    return {
      number: 0,
      suffix: text,
      decimals: 0,
    };
  }

  const numericPart = match[1];
  const suffix = match[2] || "";

  const decimals = numericPart.includes(".")
    ? numericPart.split(".")[1].length
    : 0;

  return {
    number: Number(numericPart),
    suffix,
    decimals,
  };
}

function AnimatedStatNumber({
  value,
  duration = 1500,
  start = false,
}) {
  const parsed = useMemo(
    () => parseStatValue(value),
    [value]
  );

  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!start) {
      setDisplay(0);
      return undefined;
    }

    let frameId = 0;
    let startTime = null;

    const from = 0;
    const to = parsed.number;

    const easeOut = (progress) =>
      1 - Math.pow(1 - progress, 3);

    const animate = (timestamp) => {
      if (startTime === null) {
        startTime = timestamp;
      }

      const elapsed = timestamp - startTime;
      const progress = Math.min(
        elapsed / duration,
        1
      );

      const next =
        from +
        (to - from) *
          easeOut(progress);

      setDisplay(next);

      if (progress < 1) {
        frameId =
          requestAnimationFrame(animate);
      } else {
        setDisplay(to);
      }
    };

    frameId = requestAnimationFrame(animate);

    return () =>
      cancelAnimationFrame(frameId);
  }, [start, parsed.number, duration]);

  const formatted = display.toLocaleString(
    undefined,
    {
      minimumFractionDigits: parsed.decimals,
      maximumFractionDigits: parsed.decimals,
    }
  );

  return (
    <span>
      {formatted}
      {parsed.suffix}
    </span>
  );
}

function useInViewOnce() {
  const [visible, setVisible] = useState(false);
  const [node, setNode] = useState(null);

  useEffect(() => {
    if (!node) return undefined;

    if (
      typeof IntersectionObserver ===
      "undefined"
    ) {
      setVisible(true);
      return undefined;
    }

    const observer =
      new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        },
        {
          threshold: 0.25,
          rootMargin: "0px 0px -40px 0px",
        }
      );

    observer.observe(node);

    return () => observer.disconnect();
  }, [node]);

  return [setNode, visible];
}

/*
|--------------------------------------------------------------------------
| STAT CARD
|--------------------------------------------------------------------------
*/

function StatCard({
  stat,
  index,
  editMode,
  onEditTarget,
}) {
  const [statRef, statVisible] = useInViewOnce();

  const accent =
    index === 1
      ? {
          main: "#B4872F",
          soft: "#F2E5C7",
          border: "#E7D7B4",
        }
      : index === 2
      ? {
          main: "#B04B66",
          soft: "#F0DCE3",
          border: "#E7CBD4",
        }
      : {
          main: "#B04B66",
          soft: "#F0DCE3",
          border: "#E7CBD4",
        };

  return (
    <EditableWrap
      editMode={editMode}
      target={{
        type: "statCard",
        index,
      }}
      onEditTarget={onEditTarget}
      label="Edit number card"
      className="h-full"
    >
      <motion.div
        ref={statRef}
        initial={{ opacity: 0, y: 18 }}
        animate={
          statVisible
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: 18 }
        }
        transition={{
          duration: 0.55,
          delay: index * 0.08,
        }}
        className="relative h-full min-h-[150px] sm:min-h-[170px] flex flex-col items-center justify-center text-center px-5 py-7 sm:px-8 sm:py-8 overflow-hidden"
        style={{
          background:
            "linear-gradient(145deg, #FFFDF9 0%, #FBF4E9 100%)",
        }}
      >
        {/* subtle decorative glow — no icon */}
        <div
          className="absolute -top-14 -right-14 w-32 h-32 rounded-full blur-3xl pointer-events-none"
          style={{
            background: accent.soft,
            opacity: 0.7,
          }}
        />

        <div
          className="absolute left-1/2 -translate-x-1/2 top-0 w-16 h-1 rounded-b-full"
          style={{
            background: accent.main,
            opacity: 0.9,
          }}
        />

        <div className="relative z-10">
          <div
            className="text-4xl sm:text-5xl lg:text-[54px] leading-none font-bold"
            style={{
              color: accent.main,
              fontFamily:
                "Georgia, 'Times New Roman', serif",
              letterSpacing: "-0.045em",
              textShadow:
                "0 2px 0 rgba(255,255,255,0.65)",
            }}
          >
            <AnimatedStatNumber
              value={stat.value}
              start={statVisible}
              duration={index === 1 ? 1750 : 1450}
            />
          </div>

          <div
            className="mt-3 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em]"
            style={{
              color: colors.slate,
            }}
          >
            {stat.label}
          </div>
        </div>

        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-px"
          style={{
            background: accent.border,
          }}
        />
      </motion.div>
    </EditableWrap>
  );
}

/*
|--------------------------------------------------------------------------
| STAFF POPUP
|--------------------------------------------------------------------------
*/

function StaffPopup({
  staff,
  onClose,
}) {
  useEffect(() => {
    if (!staff) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );

      document.body.style.overflow =
        previousOverflow;
    };
  }, [staff, onClose]);

  return (
    <AnimatePresence>
      {staff && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          style={{
            background:
              "rgba(24,17,23,0.78)",
            backdropFilter:
              "blur(9px)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            onClick={(event) =>
              event.stopPropagation()
            }
            initial={{
              opacity: 0,
              scale: 0.96,
              y: 25,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.97,
              y: 15,
            }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 24,
            }}
            className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-[28px] shadow-[0_35px_100px_rgba(0,0,0,0.35)]"
            style={{
              background: colors.cream,
              border:
                "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 z-30 w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                background:
                  "rgba(255,255,255,0.92)",
                color: colors.text,
              }}
              aria-label="Close profile"
            >
              <X className="w-5 h-5" />
            </button>

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
                  backgroundSize: "17px 17px",
                }}
              />

              <div className="relative z-10 flex items-center gap-5">
                <div
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-[24px] overflow-hidden shrink-0"
                  style={{
                    background:
                      "rgba(255,255,255,0.12)",
                    border:
                      "2px solid rgba(255,255,255,0.55)",
                    boxShadow:
                      "0 16px 35px rgba(0,0,0,0.18)",
                  }}
                >
                  <StaffImage staff={staff} />
                </div>

                <div>
                  <div
                    className="text-[10px] font-black uppercase tracking-[0.2em]"
                    style={{
                      color: "#F0D99B",
                    }}
                  >
                    {staff.position}
                  </div>

                  <h2
                    className="mt-2 text-2xl sm:text-3xl font-bold"
                    style={{
                      color: "#FFFFFF",
                      fontFamily:
                        "Georgia, 'Times New Roman', serif",
                    }}
                  >
                    {staff.name}
                  </h2>
                </div>
              </div>
            </div>

            <div className="relative px-6 sm:px-9 py-7 sm:py-8">
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
                  style={{
                    color: colors.primary,
                  }}
                >
                  {staff.qualification}
                </p>
              )}

              {staff.description && (
                <div
                  className="rounded-2xl px-5 py-4 mb-5"
                  style={{
                    background: "#F7F0E6",
                    border:
                      "1px solid #E9DCCB",
                  }}
                >
                  <p
                    className="text-sm sm:text-base leading-7"
                    style={{
                      color: "#6F6268",
                    }}
                  >
                    {staff.description}
                  </p>
                </div>
              )}

              {(staff.phone ||
                staff.email) && (
                <div
                  className="rounded-2xl p-5"
                  style={{
                    background: "#FFF9F0",
                    border:
                      "1px solid #E9DCCB",
                  }}
                >
                  <p
                    className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4"
                    style={{
                      color: colors.primary,
                    }}
                  >
                    Contact
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {staff.phone && (
                      <a
                        href={`tel:${staff.phone}`}
                        className="flex items-center gap-3 p-3 rounded-xl hover:-translate-y-0.5 transition-transform"
                        style={{
                          background:
                            "#F5EEE3",
                          color:
                            colors.text,
                        }}
                      >
                        <span
                          className="w-9 h-9 rounded-full flex items-center justify-center"
                          style={{
                            background:
                              "#EAD3D9",
                            color:
                              colors.primary,
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
                          background:
                            "#F5EEE3",
                          color:
                            colors.text,
                        }}
                      >
                        <span
                          className="w-9 h-9 rounded-full flex items-center justify-center"
                          style={{
                            background:
                              "#F0E1BE",
                            color:
                              "#8A681E",
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
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/*
|--------------------------------------------------------------------------
| MAIN STAFF PAGE
|--------------------------------------------------------------------------
*/

export function Staff({
  editMode = false,
  contentOverride = null,
  onEditTarget = () => {},
  onDeleteTarget = () => {},
  onAddTarget = () => {},
}) {
  const [content, setContent] =
    useState(() =>
      mergeStaffContent(
        contentOverride ||
          defaultStaffContent
      )
    );

  const [selectedStaff, setSelectedStaff] =
    useState(null);

  useEffect(() => {
    if (contentOverride) {
      setContent(
        mergeStaffContent(contentOverride)
      );

      return undefined;
    }

    let alive = true;

    const loadStaffContent =
      async () => {
        try {
          const res =
            await api.get(
              "/api/site-content/staff",
              { timeout: 8000 }
            );

          if (!alive) return;

          setContent(
            mergeStaffContent(
              res.data?.data
                ?.content || {}
            )
          );
        } catch (error) {
          console.error(
            "Staff content load error:",
            error
          );

          if (alive) {
            setContent(
              mergeStaffContent(
                defaultStaffContent
              )
            );
          }
        }
      };

    loadStaffContent();

    return () => {
      alive = false;
    };
  }, [contentOverride]);

  useEffect(() => {
    if (
      editMode ||
      !selectedStaff
    ) {
      return undefined;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [
    selectedStaff,
    editMode,
  ]);

  const visibleStaff =
    content.staff.filter(
      (staff) =>
        staff.visible !== false
    );

  const title =
    content.title ||
    "The People Behind Every Student's Journey";

  const highlight =
    content.highlightedWord &&
    title.includes(
      content.highlightedWord
    )
      ? content.highlightedWord
      : null;

  const titleParts = highlight
    ? title.split(highlight)
    : [title, ""];

  const titleBefore =
    titleParts[0] || "";

  const titleAfter =
    titleParts[1] || "";

  return (
    <section
      className={`relative overflow-hidden ${
        editMode
          ? "py-8 px-3 sm:px-6"
          : "pt-24 pb-24 sm:pt-28"
      }`}
      style={{
        background: colors.cream,
      }}
    >
      <style>
        {`
          @media (max-width: 767px) {
            .staff-page-safe {
              overflow-x: hidden;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .staff-page-safe *,
            .staff-page-safe *::before,
            .staff-page-safe *::after {
              animation-duration: 0.001ms !important;
              transition-duration: 0.001ms !important;
            }
          }
        `}
      </style>

      <div className="staff-page-safe">
        <div className="relative z-10 max-w-[1260px] mx-auto px-4 sm:px-7">
          {/* ========================================================
              HERO
          ======================================================== */}

          <EditableWrap
            editMode={editMode}
            target={{
              type: "pageHeader",
            }}
            onEditTarget={
              onEditTarget
            }
            label="Edit staff heading"
          >
            <motion.div
              initial={{
                opacity: 0,
                y: 22,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.55,
              }}
              className="relative overflow-hidden rounded-[34px] min-h-[430px] sm:min-h-[470px] flex items-center"
              style={{
                background:
                  "linear-gradient(135deg, #1D111B 0%, #2C1525 48%, #4A1C2E 100%)",
                boxShadow:
                  "0 28px 70px rgba(54,30,39,0.20)",
              }}
            >
              <HeroPattern />

              <div className="relative z-10 w-full px-7 sm:px-12 lg:px-16 py-14 sm:py-16">
                <div className="max-w-[900px]">
                  <SectionLabel light>
                    {content.badgeText ||
                      "Our Faculty"}
                  </SectionLabel>

                  <h1
                    className="text-4xl sm:text-5xl lg:text-[64px] leading-[1.02] tracking-[-0.035em] font-bold"
                    style={{
                      color:
                        colors.white,
                      fontFamily:
                        "Georgia, 'Times New Roman', serif",
                    }}
                  >
                    {titleBefore}

                    {highlight && (
                      <span
                        style={{
                          color:
                            "#E6C978",
                        }}
                      >
                        {highlight}
                      </span>
                    )}

                    {titleAfter}
                  </h1>

                  <p
                    className="mt-7 max-w-2xl text-base sm:text-lg leading-8"
                    style={{
                      color:
                        "rgba(255,255,255,0.72)",
                    }}
                  >
                    {content.subtitle}
                  </p>

                  <div
                    className="mt-8 inline-flex items-center gap-2 rounded-full px-4 py-2 border"
                    style={{
                      borderColor:
                        "rgba(213,184,109,0.4)",
                      background:
                        "rgba(255,255,255,0.05)",
                    }}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{
                        background:
                          "#E1C16E",
                      }}
                    />

                    <span
                      className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em]"
                      style={{
                        color:
                          "#E6D29C",
                      }}
                    >
                      Dedicated to every learner
                    </span>
                  </div>
                </div>
              </div>

              {/* ==================================================
                  IMPORTANT:
                  The old RR / RED ROSE circle has been completely
                  removed. There is intentionally NO logo/mark here.
              ================================================== */}

              <ZigZagBottom />
            </motion.div>
          </EditableWrap>

          {/* ========================================================
              ABOUT-STYLE ANIMATED STAT STRIP
          ======================================================== */}

          <div className="relative z-30 -mt-5 sm:-mt-7 px-3 sm:px-8">
            <div
              className="grid grid-cols-1 sm:grid-cols-3 overflow-hidden rounded-[24px]"
              style={{
                background: "#FBF7EF",
                border: "1px solid #E6D9C8",
                boxShadow:
                  "0 18px 45px rgba(55,39,30,0.11)",
              }}
            >
              {content.stats.slice(0, 3).map(
                (stat, index) => (
                  <div
                    key={stat.id || `stat-${index}`}
                    className={
                      index !== 2
                        ? "border-b sm:border-b-0 sm:border-r"
                        : ""
                    }
                    style={{
                      borderColor: "#E6D9C8",
                    }}
                  >
                    <StatCard
                      stat={stat}
                      index={index}
                      editMode={editMode}
                      onEditTarget={onEditTarget}
                    />
                  </div>
                )
              )}
            </div>
          </div>

          {/* ========================================================
              INTRO
          ======================================================== */}

          <div className="max-w-[1050px] mx-auto pt-24 sm:pt-32 pb-12">
            <SectionLabel>
              Our People
            </SectionLabel>

            <div className="max-w-[760px]">
              <h2
                className="text-3xl sm:text-4xl lg:text-5xl leading-[1.08] font-bold"
                style={{
                  color: colors.text,
                  fontFamily:
                    "Georgia, 'Times New Roman', serif",
                }}
              >
                Educators who make a difference{" "}
                <span
                  style={{
                    color: colors.primary,
                  }}
                >
                  every day.
                </span>
              </h2>
            </div>
          </div>

          {/* ========================================================
              STAFF LIST
          ======================================================== */}

          <div className="max-w-[1050px] mx-auto space-y-8 sm:space-y-10">
            {visibleStaff.map(
              (staff, index) => {
                const realIndex =
                  content.staff.findIndex(
                    (member) =>
                      member.id ===
                      staff.id
                  );

                const isReversed =
                  index % 2 === 1;

                const accent =
                  staff.accentColor ||
                  accentFor(
                    realIndex
                  ).solid;

                return (
                  <EditableWrap
                    key={staff.id}
                    editMode={
                      editMode
                    }
                    target={{
                      type:
                        "staffCard",
                      index:
                        realIndex,
                    }}
                    onEditTarget={
                      onEditTarget
                    }
                    onDeleteTarget={
                      onDeleteTarget
                    }
                    canDelete
                    label="Edit staff member"
                    className="w-full"
                  >
                    <motion.article
                      initial={{
                        opacity: 0,
                        y: 25,
                      }}
                      whileInView={{
                        opacity: 1,
                        y: 0,
                      }}
                      viewport={{
                        once: true,
                        margin:
                          "-70px",
                      }}
                      transition={{
                        duration: 0.55,
                      }}
                      onClick={() => {
                        if (!editMode) {
                          setSelectedStaff(
                            staff
                          );
                        }
                      }}
                      className={`relative overflow-hidden rounded-[28px] border cursor-pointer hover:-translate-y-1 transition-all duration-300 ${
                        isReversed
                          ? "bg-[#FFF8F0]"
                          : "bg-white"
                      }`}
                      style={{
                        borderColor:
                          "#E7DCCF",
                        boxShadow:
                          "0 16px 45px rgba(54,39,31,0.08)",
                      }}
                    >
                      <div
                        className={`grid md:grid-cols-2 min-h-[330px] ${
                          isReversed
                            ? "md:[&>*:first-child]:order-2"
                            : ""
                        }`}
                      >
                        {/* PHOTO */}
                        <div
                          className={`relative min-h-[300px] md:min-h-[330px] overflow-hidden ${
                            isReversed
                              ? "md:rounded-r-[28px]"
                              : "md:rounded-l-[28px]"
                          }`}
                        >
                          <StaffImage
                            staff={staff}
                          />

                          <div
                            className="absolute inset-0"
                            style={{
                              background:
                                "linear-gradient(to top, rgba(28,16,24,0.35), transparent 45%)",
                            }}
                          />

                          <div
                            className="absolute left-5 bottom-5 rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em]"
                            style={{
                              background:
                                "rgba(30,18,27,0.82)",
                              color:
                                "#F1D58E",
                              backdropFilter:
                                "blur(8px)",
                            }}
                          >
                            {staff.position}
                          </div>

                          <div
                            className="absolute right-5 bottom-4 text-5xl font-bold"
                            style={{
                              color:
                                "rgba(255,255,255,0.78)",
                              fontFamily:
                                "Georgia, 'Times New Roman', serif",
                            }}
                          >
                            {String(
                              index + 1
                            ).padStart(
                              2,
                              "0"
                            )}
                          </div>

                          {editMode && (
                            <button
                              type="button"
                              onClick={(
                                event
                              ) => {
                                event.preventDefault();
                                event.stopPropagation();
                                onEditTarget(
                                  {
                                    type:
                                      "staffImage",
                                    index:
                                      realIndex,
                                  }
                                );
                              }}
                              className="absolute top-4 left-4 w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
                              style={{
                                background:
                                  "#FFFFFF",
                                color:
                                  colors.text,
                                border:
                                  "1px solid #E5D8C8",
                              }}
                              title="Change staff photo"
                              aria-label="Change staff photo"
                            >
                              <Camera className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        {/* CONTENT */}
                        <div className="relative p-7 sm:p-9 flex flex-col justify-center">
                          <div
                            className="absolute top-0 w-2 h-24 rounded-b-full"
                            style={{
                              background:
                                accent,
                              [isReversed
                                ? "right"
                                : "left"]:
                                0,
                            }}
                          />

                          <div className="flex items-center gap-3 mb-3">
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{
                                background:
                                  accent,
                              }}
                            />

                            <span
                              className="text-[10px] font-black uppercase tracking-[0.18em]"
                              style={{
                                color:
                                  accent,
                              }}
                            >
                              Faculty Member
                            </span>
                          </div>

                          <h3
                            className="text-3xl sm:text-4xl font-bold leading-tight"
                            style={{
                              color:
                                colors.text,
                              fontFamily:
                                "Georgia, 'Times New Roman', serif",
                            }}
                          >
                            {staff.name}
                          </h3>

                          {staff.qualification && (
                            <p
                              className="mt-2 text-sm font-medium"
                              style={{
                                color:
                                  "#9A8B86",
                              }}
                            >
                              {
                                staff.qualification
                              }
                            </p>
                          )}

                          {staff.description && (
                            <p
                              className="mt-6 text-sm sm:text-base leading-7"
                              style={{
                                color:
                                  colors.slate,
                              }}
                            >
                              {
                                staff.description
                              }
                            </p>
                          )}

                          <div
                            className="mt-7 pt-5 border-t flex items-center justify-between gap-4"
                            style={{
                              borderColor:
                                "#E8DCCB",
                            }}
                          >
                            <div
                              className="flex items-center gap-2 text-xs font-semibold"
                              style={{
                                color:
                                  "#796B70",
                              }}
                            >
                              <Mail className="w-4 h-4" />
                              Meet our team
                            </div>

                            <span
                              className="text-sm font-bold"
                              style={{
                                color:
                                  colors.primary,
                              }}
                            >
                              View Profile →
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.article>
                  </EditableWrap>
                );
              }
            )}
          </div>

          <AddStaffButton
            editMode={editMode}
            onAddTarget={
              onAddTarget
            }
          />

          {/* ========================================================
              CLOSING STATEMENT
          ======================================================== */}

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
                    color:
                      "#DABF79",
                    fontFamily:
                      "Georgia, 'Times New Roman', serif",
                  }}
                >
                  “
                </div>

                <h3
                  className="text-2xl sm:text-3xl font-bold"
                  style={{
                    color:
                      colors.white,
                    fontFamily:
                      "Georgia, 'Times New Roman', serif",
                  }}
                >
                  Every student deserves someone who believes in them.
                </h3>

                <p
                  className="mt-4 max-w-2xl mx-auto text-sm sm:text-base leading-7"
                  style={{
                    color:
                      "rgba(255,255,255,0.68)",
                  }}
                >
                  That is the standard we bring to our classrooms,
                  corridors, activities, and every student interaction.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {!editMode && (
        <StaffPopup
          staff={
            selectedStaff
          }
          onClose={() =>
            setSelectedStaff(
              null
            )
          }
        />
      )}
    </section>
  );
}

export default Staff;
