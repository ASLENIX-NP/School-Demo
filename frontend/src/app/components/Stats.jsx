import { useEffect, useRef, useState, useCallback } from "react";
import api from "../../lib/api";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import {
  ArrowRight,
  Calendar,
  X,
  Pencil,
  Camera,
  Trash2,
  Plus,
  AlertCircle,
} from "lucide-react";

import PdfNoticePreview from "./PdfNoticePreview";
import HomeAnnouncementPopup from "./HomeAnnouncementPopup";

/* =========================================================
   THEME — Matches About page design language
========================================================= */

const theme = {
  ink: "#1E1420",
  inkSoft: "#2D1C2A",
  paper: "#F5EEE2",
  paperDeep: "#E9DCC4",
  card: "#FBF7EE",
  rose: "#9C2748",
  roseDeep: "#6E1733",
  roseBright: "#C6486B",
  gold: "#B98A42",
  goldSoft: "#E7CE9C",
  moss: "#3F5B49",
  mossDeep: "#2C4234",
  text: "#2B1E23",
  textMuted: "#7C6B6F",
  white: "#FFFFFF",
  gradRose: "linear-gradient(135deg, #6E1733 0%, #9C2748 55%, #C6486B 100%)",
  gradInk: "linear-gradient(160deg, #17101C 0%, #2A1826 55%, #3A2130 100%)",
  gradGold: "linear-gradient(135deg, #E7CE9C 0%, #B98A42 100%)",
  gradMoss: "linear-gradient(135deg, #2C4234 0%, #3F5B49 55%, #6E8F76 100%)",
};

/* =========================================================
   TILT CARD
========================================================= */

function TiltCard({
  children,
  className = "",
  max = 7,
  style = {},
  editMode = false,
  ...props
}) {
  const ref = useRef(null);

  const handleMove = useCallback(
    (e) => {
      if (editMode) return;

      const el = ref.current;

      if (!el || typeof window === "undefined") {
        return;
      }

      if (
        window.matchMedia &&
        window.matchMedia("(pointer: coarse)").matches
      ) {
        return;
      }

      const rect = el.getBoundingClientRect();

      if (!rect.width || !rect.height) {
        return;
      }

      const px =
        (e.clientX - rect.left) / rect.width;

      const py =
        (e.clientY - rect.top) / rect.height;

      const rotY = (px - 0.5) * max * 2;
      const rotX = (0.5 - py) * max * 2;

      el.style.transform = `
        perspective(1000px)
        rotateX(${rotX.toFixed(2)}deg)
        rotateY(${rotY.toFixed(2)}deg)
        translateZ(0)
      `;
    },
    [editMode, max]
  );

  const handleLeave = useCallback(() => {
    if (editMode) return;

    const el = ref.current;

    if (el) {
      el.style.transform =
        "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)";
    }
  }, [editMode]);

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`relative ${className}`}
      style={{
        transition: editMode
          ? "none"
          : "transform 260ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 260ms ease",
        willChange: editMode
          ? "auto"
          : "transform",
        transformStyle: "preserve-3d",
        ...style,
      }}
      {...props}
    >
      {!editMode && (
        <div className="absolute inset-0 rounded-[inherit] pointer-events-none bg-gradient-to-br from-white/40 via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
      )}

      {children}
    </div>
  );
}

/* =========================================================
   GLOBAL STYLES
========================================================= */

function StatsStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,500&family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');

      .rr-stats { font-family: 'Inter', system-ui, -apple-system, sans-serif; --rr-gold: ${theme.gold}; }
      .rr-serif { font-family: 'Fraunces', Georgia, 'Times New Roman', serif; }
      .rr-mono { font-family: 'Space Grotesk', 'IBM Plex Mono', monospace; }

      .rr-stats a:focus-visible,
      .rr-stats button:focus-visible {
        outline: 2px solid var(--rr-gold);
        outline-offset: 3px;
        border-radius: 6px;
      }

      @keyframes rr-float { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-10px) rotate(1deg); } }
      @keyframes rr-drift { 0% { transform: translate(0,0); } 50% { transform: translate(-1.5%,1.5%); } 100% { transform: translate(0,0); } }
      .rr-emblem { animation: rr-float 7s ease-in-out infinite; }
      .rr-grain { animation: rr-drift 18s ease-in-out infinite; }

      @media (prefers-reduced-motion: reduce) {
        .rr-stats *, .rr-stats *::before, .rr-stats *::after {
          animation-duration: 0.001ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.001ms !important;
        }
      }
    `}</style>
  );
}

/* =========================================================
   EDIT WRAPPER
========================================================= */

function StatsEditableWrap({
  editMode,
  target,
  onEditTarget,
  onDeleteTarget,
  canDelete = false,
  children,
}) {
  if (!editMode) {
    return children;
  }

  return (
    <div className="relative group">
      {children}

      <div className="absolute -top-2 -right-2 z-40 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200 flex gap-1.5 bg-white/95 backdrop-blur-sm p-1 rounded-full shadow-md border border-slate-200/80 pointer-events-auto">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();

            onEditTarget(target);
          }}
          className="w-7 h-7 rounded-full flex items-center justify-center shadow transition-all cursor-pointer"
          style={{ background: theme.rose, color: theme.white }}
          title="Edit"
        >
          {target.type === "storyImage" ? (
            <Camera className="w-3.5 h-3.5" />
          ) : (
            <Pencil className="w-3.5 h-3.5" />
          )}
        </button>

        {canDelete && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              onDeleteTarget(target);
            }}
            className="w-7 h-7 rounded-full flex items-center justify-center shadow transition-all cursor-pointer"
            style={{ background: "#DC2626", color: theme.white }}
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   DEFAULT DATA
========================================================= */

const defaultStatsData = {
  eyebrow: "Our Impact",

  title:
    "Creating Futures, One Student at a Time",

  // Keep this empty by default. If the admin deletes the description,
  // the user website must not restore the old hard-coded sentence.
  description: "",

  stats: [
    {
      value: "3800",
      suffix: "+",
      label: "Students Enrolled",
      note: "Across school programs",
      color: theme.rose,
    },

    {
      value: "240",
      suffix: "+",
      label: "Expert Teachers",
      note: "Academic support team",
      color: theme.gold,
    },

    {
      value: "35",
      suffix: " yrs",
      label: "Years of Excellence",
      note: "Serving Makwanpur",
      color: theme.moss,
    },

    {
      value: "98",
      suffix: "%",
      label: "Success Rate",
      note: "Academic performance",
      color: "#6E1733",
    },
  ],

  story: {
    badge: "Our Story",

    title:
      "Building Tomorrow's Leaders Today",

    imageTopTitle: "Our Campus",

    imageTopSubtitle: "Hetauda-2",

    paragraphs: [
      "Established with a vision to provide quality education in Makawanpur, Red Rose Secondary English Boarding School has grown as one of Hetauda's respected academic institutions.",

      "With students from Play Group to Grade 10, the school focuses on academic discipline, values, creativity, digital learning, and holistic student development.",
    ],

    image: "",

    buttonText:
      "Read Our Story",

    buttonLink:
      "/about",

    imageZoom: 1,

    imageOffsetX: 0,

    imageOffsetY: 0,

    imageBottomTitle: "",

    imageBottomDescription: "",
  },

  excellence: {
    title:
      "ACADEMIC EXCELLENCE",

    description:
      "We nurture knowledge, confidence, and curiosity through purposeful learning experiences that help every student discover their strengths and prepare for the future.",

    cards: [
      {
        title:
          "Strong Academic Foundations",

        description:
          "Focused teaching and consistent guidance help students build the knowledge, discipline, and confidence needed to achieve their academic goals.",
      },

      {
        title:
          "Learning for Tomorrow",

        description:
          "Modern teaching, technology, creativity, and practical learning experiences prepare students to adapt, think independently, and embrace new opportunities.",
      },

      {
        title:
          "Growing Beyond Books",

        description:
          "Sports, arts, leadership, teamwork, and extracurricular activities encourage students to develop character, confidence, and a balanced personality.",
      },
    ],
  },

  notices: {
    title:
      "Latest Notices",

    description:
      "Stay informed with the latest announcements.",
  },
};

/* =========================================================
   NORMALIZE OLD ACADEMIC CONTENT
========================================================= */

function normalizeExcellence(savedExcellence = {}) {
  const saved =
    savedExcellence &&
    typeof savedExcellence === "object"
      ? savedExcellence
      : {};

  const oldTitle =
    "Academic Focus";

  const oldDescription =
    "Our students consistently achieve outstanding results in the SEE examinations.";

  const oldCards = [
    {
      title:
        "Best SEE Results",

      description:
        "Achieving top results in the Secondary Education Examination.",
    },

    {
      title:
        "GPA 4.00 Achievers",

      description:
        "Our brightest students attain a perfect GPA of 4.00.",
    },

    {
      title:
        "Holistic Development",

      description:
        "Fostering creativity, leadership, and sportsmanship.",
    },
  ];

  let title =
    saved.title;

  let description =
    saved.description;

  if (
    !title ||
    title === oldTitle
  ) {
    title =
      defaultStatsData
        .excellence.title;
  }

  // Only use the default when the field is actually missing.
  // An empty string is a valid admin choice because it means the
  // administrator intentionally removed the text.
  if (
    description === undefined ||
    description === null ||
    description === oldDescription
  ) {
    description =
      defaultStatsData
        .excellence
        .description;
  }

  const savedCards =
    Array.isArray(
      saved.cards
    )
      ? saved.cards
      : [];

  const cards =
    defaultStatsData.excellence.cards.map(
      (
        defaultCard,
        index
      ) => {
        const existing =
          savedCards[index];

        if (!existing) {
          return {
            ...defaultCard,
          };
        }

        const isOldCard =
          existing.title ===
            oldCards[index]
              ?.title &&
          existing.description ===
            oldCards[index]
              ?.description;

        if (isOldCard) {
          return {
            ...defaultCard,
          };
        }

        return {
          ...defaultCard,
          ...existing,
        };
      }
    );

  if (
    savedCards.length >
    defaultStatsData
      .excellence.cards.length
  ) {
    savedCards
      .slice(
        defaultStatsData
          .excellence.cards.length
      )
      .forEach((card) => {
        cards.push(card);
      });
  }

  return {
    ...defaultStatsData.excellence,
    ...saved,
    title,
    description,
    cards,
  };
}

/* =========================================================
   IMAGE STYLE
========================================================= */

function clampOffset(value) {
  const number =
    Number(value);

  if (!Number.isFinite(number)) {
    return 0;
  }

  return Math.min(
    60,
    Math.max(-60, number)
  );
}

function clampZoom(value) {
  const number =
    Number(value);

  if (!Number.isFinite(number)) {
    return 1;
  }

  return Math.min(
    3,
    Math.max(1, number)
  );
}

function cleanImageUrl(value) {
  let url =
    String(value || "").trim();

  if (!url) return "";

  const markdownMatch =
    url.match(
      /\]\((https?:\/\/[^)]+)\)$/
    );

  if (markdownMatch?.[1]) {
    return markdownMatch[1].trim();
  }

  const embeddedUrl =
    url.match(
      /https?:\/\/[^\s)]+/
    );

  if (
    url.startsWith("[") &&
    embeddedUrl?.[0]
  ) {
    return embeddedUrl[0].trim();
  }

  return url;
}

function getStoryImageStyle(
  story
) {
  const zoom =
    clampZoom(
      story?.imageZoom
    );

  const x =
    clampOffset(
      story?.imageOffsetX
    );

  const y =
    clampOffset(
      story?.imageOffsetY
    );

  return {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center",
    transform:
      `translate(${x}%, ${y}%) scale(${zoom})`,
    transformOrigin:
      "center center",
    transition:
      "transform 180ms ease-out",
  };
}

/* =========================================================
   SECTION INTRO — Matches About page
========================================================= */

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
        {!isCenter && <span className="h-px flex-1 max-w-[80px]" style={{ background: light ? "rgba(231,206,156,0.35)" : "rgba(156,39,72,0.25)" }} />}
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

/* =========================================================
   MAIN STATS
========================================================= */

export default function Stats({
  editMode = false,
  contentOverride = null,
  onEditTarget = () => {},
  onDeleteTarget = () => {},
}) {
  const [loading, setLoading] =
    useState(true);

  const [notices, setNotices] =
    useState([]);

  const [
    selectedNotice,
    setSelectedNotice,
  ] = useState(null);

  const [error, setError] =
    useState(null);

  const [data, setData] =
    useState(
      defaultStatsData
    );

  /* =======================================================
     LOAD CONTENT
  ======================================================= */

  useEffect(() => {
    let alive = true;

    if (contentOverride) {
      setData({
        ...defaultStatsData,

        ...contentOverride,

        stats:
          contentOverride.stats ||
          defaultStatsData.stats,

        story: {
          ...defaultStatsData.story,

          ...(contentOverride.story ||
            {}),

          image: cleanImageUrl(
            contentOverride.story?.image
          ),
        },

        excellence:
          normalizeExcellence(
            contentOverride.excellence
          ),
      });

      setLoading(false);
    } else {
      const loadStatsContent =
        async () => {
          try {
            const res =
              await api.get(
                "/api/site-content/home"
              );

            if (!alive) {
              return;
            }

            const saved =
              res.data?.data?.content
                ?.statsSection;

            if (saved) {
              setData({
                ...defaultStatsData,

                ...saved,

                stats:
                  saved.stats ||
                  defaultStatsData.stats,

                story: {
                  ...defaultStatsData.story,

                  ...(saved.story ||
                    {}),

                  image: cleanImageUrl(
                    saved.story?.image
                  ),
                },

                excellence:
                  normalizeExcellence(
                    saved.excellence
                  ),
              });
            } else {
              setData(
                defaultStatsData
              );
            }
          } catch (err) {
            console.error(
              "Load stats content error:",
              err
            );

            if (alive) {
              setError(
                "Unable to load homepage content."
              );
            }
          } finally {
            if (alive) {
              setLoading(false);
            }
          }
        };

      loadStatsContent();
    }

    /* =====================================================
       LOAD NOTICES PUBLIC ONLY
    ===================================================== */

    if (!editMode) {
      api
        .get("/api/notices")
        .then((res) => {
          if (!alive) {
            return;
          }

          const list =
            Array.isArray(
              res.data
            )
              ? res.data
              : res.data?.data ||
                [];

          setNotices(
            list.slice(0, 3)
          );
        })
        .catch((err) => {
          console.error(
            "Failed to load notices:",
            err
          );

          if (alive) {
            setNotices([]);
          }
        });
    } else {
      setNotices([]);
    }

    return () => {
      alive = false;
    };
  }, [
    contentOverride,
    editMode,
  ]);

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center min-h-[60vh] ${
          editMode
            ? "py-12"
            : ""
        }`}
        style={{ background: theme.paper }}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-11 h-11 rounded-full border-[3px] animate-spin" style={{ borderColor: theme.paperDeep, borderTopColor: theme.rose }} />
          <p className="rr-mono text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: theme.textMuted }}>
            LOADING CONTENT
          </p>
        </div>
      </div>
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (error) {
    return (
      <div
        className={`flex items-center justify-center min-h-[60vh] ${
          editMode
            ? "py-12"
            : ""
        }`}
        style={{ background: theme.paper }}
      >
        <div className="flex flex-col items-center gap-4">
          <AlertCircle className="w-10 h-10" style={{ color: theme.rose }} />
          <p className="text-sm font-medium" style={{ color: theme.rose }}>
            {error}
          </p>
        </div>
      </div>
    );
  }

  /* =======================================================
     DATA CHECK
  ======================================================= */

  if (
    !data ||
    !data.stats ||
    data.stats.length === 0
  ) {
    return (
      <div
        className={`flex items-center justify-center min-h-[60vh] ${
          editMode
            ? "py-12"
            : ""
        }`}
        style={{ background: theme.paper }}
      >
        <p className="text-sm font-medium" style={{ color: theme.textMuted }}>
          No stats content available
        </p>
      </div>
    );
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <>
      <StatsStyles />
      {!editMode && (
        <HomeAnnouncementPopup />
      )}

      <section
        className="rr-stats relative w-full overflow-hidden"
        style={{ background: theme.paper }}
      >
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-16 md:py-24">

          {/* =================================================
              HEADER — Matches About page style
          ================================================= */}

          <StatsEditableWrap
            editMode={editMode}
            target={{
              type: "statsHeader",
            }}
            onEditTarget={
              onEditTarget
            }
          >
            <div
              className={`text-center max-w-3xl mx-auto mb-16 md:mb-20`}
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="h-px w-10" style={{ background: theme.gold }} />
                <span className="rr-mono text-[11px] font-semibold uppercase tracking-[0.28em]" style={{ color: theme.rose }}>
                  {data.eyebrow || "Our Impact"}
                </span>
                <span className="h-px w-10" style={{ background: theme.gold }} />
              </div>

              <h1
                className="rr-serif text-3xl sm:text-4xl md:text-[2.75rem] font-semibold leading-[1.08] tracking-tight"
                style={{ color: theme.ink }}
              >
                {data.title}
              </h1>

              <p
                className="mt-4 max-w-xl mx-auto text-base leading-7"
                style={{ color: theme.textMuted }}
              >
                {data.description}
              </p>
            </div>
          </StatsEditableWrap>

          {/* =================================================
              STATS GRID — Clean card design without icons
          ================================================= */}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mb-16 sm:mb-24">

            {data.stats.map(
              (stat, i) => {

                const card = (
                  <TiltCard
                    editMode={
                      editMode
                    }
                    max={5}
                    className="relative p-6 sm:p-8 text-center rounded-2xl transition-all duration-300 hover:-translate-y-1.5"
                    style={{
                      background: theme.card,
                      border: `1px solid ${theme.paperDeep}`,
                      boxShadow: "0 16px 36px rgba(30,20,32,0.08)",
                    }}
                  >

                    <StatsEditableWrap
                      editMode={
                        editMode
                      }
                      target={{
                        type: "statsCard",
                        index: i,
                      }}
                      onEditTarget={
                        onEditTarget
                      }
                      onDeleteTarget={
                        onDeleteTarget
                      }
                      canDelete={
                        data.stats
                          .length >
                        1
                      }
                    >

                      {/* Simple colored accent line */}
                      <div
                        className="w-12 h-1 mx-auto rounded-full mb-5"
                        style={{
                          background: stat.color || theme.rose,
                        }}
                      />

                      <div className="relative z-10">
                        <div className="rr-serif text-3xl sm:text-4xl md:text-5xl font-semibold mb-2 tracking-tight" style={{ color: theme.ink }}>
                          {stat.value}
                          {stat.suffix}
                        </div>

                        <div className="text-sm font-bold" style={{ color: theme.text }}>
                          {stat.label}
                        </div>

                        <div className="text-xs mt-1" style={{ color: theme.textMuted }}>
                          {stat.note}
                        </div>
                      </div>

                    </StatsEditableWrap>

                  </TiltCard>
                );

                if (editMode) {
                  return (
                    <div
                      key={i}
                      className="group relative"
                    >
                      {card}
                    </div>
                  );
                }

                return (
                  <motion.div
                    key={i}
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                      margin:
                        "-50px",
                    }}
                    transition={{
                      duration: 0.4,
                      delay:
                        i * 0.08,
                    }}
                    className="group"
                  >
                    {card}
                  </motion.div>
                );
              }
            )}

            {editMode && (
              <div
                className="flex items-center justify-center min-h-[180px] border-2 border-dashed rounded-2xl transition-colors cursor-pointer group"
                style={{ borderColor: `${theme.rose}40`, background: `${theme.rose}08` }}
                onClick={() => {
                  onEditTarget({
                    type: "statsCard",
                    index:
                      data.stats
                        .length,
                    isNew: true,
                  });
                }}
              >
                <div className="flex flex-col items-center gap-2" style={{ color: theme.rose }}>
                  <Plus className="w-7 h-7 group-hover:scale-110 transition-transform" />
                  <span className="text-xs sm:text-sm font-bold">
                    Add Stat Card
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* =================================================
              STORY SECTION — Matches About page
          ================================================= */}

          <div className="relative grid lg:grid-cols-2 gap-12 md:gap-16 items-center mb-16 sm:mb-24">

            <div className="relative">

              <StatsEditableWrap
                editMode={editMode}
                target={{
                  type: "storyImage",
                }}
                onEditTarget={
                  onEditTarget
                }
              >

                <div className="relative rounded-3xl overflow-hidden shadow-xl bg-slate-900 aspect-[4/3] w-full group">

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent z-10 pointer-events-none" />

                  {cleanImageUrl(
                    data.story?.image
                  ) ? (
                    <img
                      src={cleanImageUrl(
                        data.story?.image
                      )}
                      alt="School story"
                      className="absolute inset-0 w-full h-full object-cover"
                      style={getStoryImageStyle(
                        data.story
                      )}
                    />
                  ) : (
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{
                        background:
                          "linear-gradient(135deg, #EEF2F7 0%, #E5EAF0 50%, #DCE3EB 100%)",
                      }}
                    >

                      <div className="flex flex-col items-center gap-3 text-center px-6">

                        <div className="h-12 w-12 rounded-full border-4 animate-spin" style={{ borderColor: theme.paperDeep, borderTopColor: theme.gold }} />

                        <span className="rr-mono text-xs font-black uppercase tracking-[0.18em]" style={{ color: theme.textMuted }}>
                          Loading school image
                        </span>

                      </div>

                    </div>
                  )}

                  <StatsEditableWrap
                    editMode={
                      editMode
                    }
                    target={{
                      type: "storyImageText",
                    }}
                    onEditTarget={
                      onEditTarget
                    }
                  >

                    <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 z-20 pointer-events-none">

                      <div className="backdrop-blur-md bg-white/15 p-3.5 sm:p-4 rounded-2xl border border-white/25 inline-block shadow-lg">

                        <div className="rr-serif text-white text-lg sm:text-xl font-semibold">
                          {data.story
                            ?.imageTopTitle ||
                            "Our Campus"}
                        </div>

                        <div className="text-white/80 text-xs sm:text-sm">
                          {data.story
                            ?.imageTopSubtitle ||
                            "Hetauda-2"}
                        </div>

                      </div>

                    </div>

                  </StatsEditableWrap>

                  {(
                    data.story
                      ?.imageBottomTitle ||
                    data.story
                      ?.imageBottomDescription
                  ) && (
                    <div className="absolute top-5 right-5 z-20 max-w-[260px] rounded-2xl bg-slate-950/55 backdrop-blur-md border border-white/20 p-4 text-white">

                      {data.story
                        ?.imageBottomTitle && (
                        <div className="rr-serif font-semibold text-sm">
                          {
                            data.story
                              .imageBottomTitle
                          }
                        </div>
                      )}

                      {data.story
                        ?.imageBottomDescription && (
                        <div className="mt-1 text-xs leading-relaxed text-white/75">
                          {
                            data.story
                              .imageBottomDescription
                          }
                        </div>
                      )}

                    </div>
                  )}

                </div>

              </StatsEditableWrap>

            </div>

            <div>

              <StatsEditableWrap
                editMode={editMode}
                target={{
                  type: "storyText",
                }}
                onEditTarget={
                  onEditTarget
                }
              >

                <div className="flex items-center gap-2.5 mb-3 sm:mb-4">

                  <span className="rr-mono text-xs sm:text-sm font-bold uppercase tracking-widest" style={{ color: theme.gold }}>
                    {data.story
                      ?.badge ||
                      "Our Story"}
                  </span>

                </div>

                <h2 className="rr-serif text-2xl sm:text-3xl md:text-4xl font-semibold text-slate-900 mb-4 sm:mb-6 tracking-tight leading-tight" style={{ color: theme.ink }}>
                  {
                    data.story
                      ?.title
                  }
                </h2>

                <div className="space-y-3.5 text-slate-600 leading-relaxed text-sm sm:text-base md:text-lg mb-6 sm:mb-8" style={{ color: theme.textMuted }}>

                  {(
                    data.story
                      ?.paragraphs ||
                    []
                  ).map(
                    (
                      paragraph,
                      index
                    ) => (
                      <p
                        key={
                          index
                        }
                      >
                        {
                          paragraph
                        }
                      </p>
                    )
                  )}

                </div>

              </StatsEditableWrap>

              <StatsEditableWrap
                editMode={editMode}
                target={{
                  type: "storyButton",
                }}
                onEditTarget={
                  onEditTarget
                }
              >

                <Link
                  to={
                    editMode
                      ? "#"
                      : data.story
                          ?.buttonLink ||
                        "/about"
                  }
                  onClick={(e) => {
                    if (
                      editMode
                    ) {
                      e.preventDefault();
                    }
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-white font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all group"
                  style={{ background: theme.gradRose }}
                >

                  {data.story
                    ?.buttonText ||
                    "Read Our Story"}

                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />

                </Link>

              </StatsEditableWrap>

            </div>

          </div>

          {/* =================================================
              ACADEMIC EXCELLENCE — Clean, minimal design
          ================================================= */}

          <div className="relative mb-16 sm:mb-24">

            <StatsEditableWrap
              editMode={editMode}
              target={{
                type: "excellenceHeader",
              }}
              onEditTarget={
                onEditTarget
              }
            >

              <div className="relative z-10 text-center mb-12 sm:mb-16">

                <div className="flex items-center justify-center gap-3 mb-4">
                  <span className="h-px w-10" style={{ background: theme.gold }} />
                  <span className="rr-mono text-[11px] font-semibold uppercase tracking-[0.28em]" style={{ color: theme.rose }}>
                    {data.excellence?.title || "ACADEMIC EXCELLENCE"}
                  </span>
                  <span className="h-px w-10" style={{ background: theme.gold }} />
                </div>

                <h2
                  className="rr-serif text-3xl sm:text-4xl md:text-[2.75rem] font-semibold leading-[1.08] tracking-tight"
                  style={{ color: theme.ink }}
                >
                  Where Curiosity
                  <span style={{ color: theme.rose }}>
                    {" "}
                    Becomes Achievement
                  </span>
                </h2>

                <p
                  className="text-slate-600 max-w-2xl mx-auto mt-4 text-sm sm:text-base leading-7 sm:leading-8"
                  style={{ color: theme.textMuted }}
                >
                  {data.excellence
                    ?.description ||
                    "We nurture knowledge, confidence, and curiosity through purposeful learning experiences that help every student discover their strengths and prepare for the future."}
                </p>

              </div>

            </StatsEditableWrap>

            <div className="relative z-10 grid md:grid-cols-3 gap-6">

              {(
                data.excellence
                  ?.cards || []
              ).map(
                (
                  card,
                  i
                ) => {

                  const themes = [
                    {
                      accent: theme.rose,
                      soft: `${theme.rose}12`,
                      label: "ACADEMIC GROWTH",
                    },
                    {
                      accent: theme.gold,
                      soft: `${theme.gold}18`,
                      label: "FUTURE READY",
                    },
                    {
                      accent: theme.moss,
                      soft: `${theme.moss}14`,
                      label: "HOLISTIC GROWTH",
                    },
                  ];

                  const themeAccent =
                    themes[
                      i %
                        themes.length
                    ];

                  return (
                    <motion.div
                      key={i}
                      initial={{
                        opacity: 0,
                        y: 35,
                      }}
                      whileInView={{
                        opacity: 1,
                        y: 0,
                      }}
                      viewport={{
                        once: true,
                        amount: 0.2,
                      }}
                      transition={{
                        duration: 0.6,
                        delay:
                          i * 0.1,
                      }}
                      className="group"
                    >

                      <TiltCard
                        editMode={
                          editMode
                        }
                        max={5}
                        className="
                          relative
                          min-h-[240px]
                          h-full
                          overflow-hidden
                          rounded-2xl
                          p-7
                          sm:p-8
                          transition-all
                          duration-500
                          hover:-translate-y-1.5
                        "
                        style={{
                          background: theme.card,
                          border: `1px solid ${theme.paperDeep}`,
                          boxShadow: "0 16px 36px rgba(30,20,32,0.08)",
                        }}
                      >

                        {/* Accent line */}
                        <div
                          className="absolute left-0 right-0 top-0 h-1"
                          style={{ background: themeAccent.accent }}
                        />

                        {/* Soft glow */}
                        <div
                          className="
                            pointer-events-none
                            absolute
                            -right-16
                            -top-16
                            h-44
                            w-44
                            rounded-full
                            blur-3xl
                            opacity-30
                            transition-all
                            duration-500
                            group-hover:scale-150
                            group-hover:opacity-50
                          "
                          style={{
                            background: themeAccent.accent,
                          }}
                        />

                        <div className="relative z-20 flex h-full flex-col">

                          <StatsEditableWrap
                            editMode={
                              editMode
                            }
                            target={{
                              type: "excellenceCard",
                              index:
                                i,
                            }}
                            onEditTarget={
                              onEditTarget
                            }
                            onDeleteTarget={
                              onDeleteTarget
                            }
                            canDelete={
                              data
                                .excellence
                                ?.cards
                                ?.length >
                              1
                            }
                          >

                            <p className="rr-mono mb-3 text-[10px] font-black uppercase tracking-[0.22em]" style={{ color: themeAccent.accent }}>
                              {themeAccent.label}
                            </p>

                            <h3 className="rr-serif text-xl sm:text-2xl font-semibold tracking-tight" style={{ color: theme.ink }}>
                              {card.title}
                            </h3>

                            <p className="mt-4 text-sm leading-7" style={{ color: theme.textMuted }}>
                              {card.description}
                            </p>

                          </StatsEditableWrap>

                        </div>

                      </TiltCard>

                    </motion.div>
                  );
                }
              )}

              {editMode && (
                <div
                  className="
                    flex
                    items-center
                    justify-center
                    min-h-[240px]
                    border-2
                    border-dashed
                    rounded-2xl
                    transition-all
                    duration-300
                    cursor-pointer
                    group
                  "
                  style={{ borderColor: `${theme.rose}40`, background: `${theme.rose}08` }}
                  onClick={() => {
                    onEditTarget({
                      type: "excellenceCard",
                      index:
                        data
                          .excellence
                          ?.cards
                          ?.length ||
                        0,
                      isNew: true,
                    });
                  }}
                >

                  <div className="flex flex-col items-center gap-3" style={{ color: theme.rose }}>

                    <div className="w-14 h-14 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform" style={{ background: `${theme.rose}15` }}>
                      <Plus className="w-7 h-7" />
                    </div>

                    <span className="rr-mono text-xs sm:text-sm font-bold">
                      Add Excellence Card
                    </span>

                  </div>

                </div>
              )}

            </div>

          </div>

          {/* =================================================
              NOTICE BOARD — Clean, minimal
          ================================================= */}

          {!editMode && (
            <motion.div
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
                amount: 0.15,
              }}
              transition={{
                duration: 0.6,
              }}
              className="
                relative
                overflow-hidden
                rounded-2xl
                p-6
                sm:p-8
                md:p-10
              "
              style={{
                background: theme.card,
                border: `1px solid ${theme.paperDeep}`,
                boxShadow: "0 16px 36px rgba(30,20,32,0.08)",
              }}
            >

              {/* Soft background glow */}
              <div
                className="
                  pointer-events-none
                  absolute
                  -top-28
                  -right-20
                  h-64
                  w-64
                  rounded-full
                  blur-3xl
                  opacity-20
                "
                style={{ background: theme.rose }}
              />

              <div
                className="
                  pointer-events-none
                  absolute
                  -bottom-28
                  -left-20
                  h-64
                  w-64
                  rounded-full
                  blur-3xl
                  opacity-20
                "
                style={{ background: theme.gold }}
              />

              {/* HEADER */}
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-7 sm:mb-8">

                <div>

                  <div className="flex items-center gap-3 mb-3">
                    <span className="h-px w-8" style={{ background: theme.gold }} />
                    <span className="rr-mono text-[10px] font-semibold uppercase tracking-[0.28em]" style={{ color: theme.rose }}>
                      Notice Board
                    </span>
                  </div>

                  <h2
                    className="rr-serif text-3xl sm:text-4xl font-semibold tracking-tight"
                    style={{ color: theme.ink }}
                  >
                    Latest Updates
                  </h2>

                </div>

                <Link
                  to="/notices"
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    self-start
                    sm:self-auto
                    px-6
                    py-3
                    rounded-xl
                    text-white
                    text-sm
                    font-bold
                    shadow-md
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:shadow-lg
                  "
                  style={{ background: theme.gradRose }}
                >
                  View All
                  <ArrowRight className="w-4 h-4" />
                </Link>

              </div>

              {/* NOTICES */}
              {notices.length === 0 ? (

                <div
                  className="
                    relative
                    z-10
                    rounded-2xl
                    p-10
                    text-center
                  "
                  style={{ background: `${theme.paper}80`, border: `1px solid ${theme.paperDeep}` }}
                >

                  <h3 className="rr-serif text-lg font-semibold" style={{ color: theme.textMuted }}>
                    No notices available
                  </h3>

                  <p className="mt-1 text-sm" style={{ color: theme.textMuted }}>
                    New school announcements will appear here.
                  </p>

                </div>

              ) : (

                <div className="relative z-10 space-y-4">

                  {notices.map(
                    (
                      notice,
                      i
                    ) => {

                      const noticeStyles = [
                        {
                          border: theme.rose,
                          badge: `${theme.rose}12`,
                          badgeText: theme.rose,
                          hover: theme.rose,
                        },
                        {
                          border: theme.gold,
                          badge: `${theme.gold}16`,
                          badgeText: theme.gold,
                          hover: theme.gold,
                        },
                        {
                          border: theme.moss,
                          badge: `${theme.moss}12`,
                          badgeText: theme.moss,
                          hover: theme.moss,
                        },
                      ];

                      const style =
                        noticeStyles[
                          i %
                            noticeStyles.length
                        ];

                      return (
                        <motion.div
                          key={
                            notice.id ||
                            notice._id ||
                            i
                          }
                          initial={{
                            opacity: 0,
                            y: 12,
                          }}
                          whileInView={{
                            opacity: 1,
                            y: 0,
                          }}
                          viewport={{
                            once: true,
                          }}
                          transition={{
                            duration:
                              0.4,
                            delay:
                              i *
                              0.07,
                          }}
                        >

                          <button
                            type="button"
                            onClick={() =>
                              setSelectedNotice(
                                notice
                              )
                            }
                            className="
                              w-full
                              text-left
                              group
                              cursor-pointer
                              focus:outline-none
                            "
                          >

                            <div
                              className={`
                                relative
                                overflow-hidden
                                rounded-2xl
                                border-l-[4px]
                                px-5
                                py-5
                                sm:px-6
                                sm:py-5
                                transition-all
                                duration-300
                                hover:-translate-y-0.5
                                hover:shadow-lg
                              `}
                              style={{
                                borderColor: style.border,
                                background: theme.white,
                                boxShadow: "0 4px 16px rgba(30,20,32,0.04)",
                              }}
                            >

                              <div
                                className="
                                  relative
                                  flex
                                  flex-col
                                  md:flex-row
                                  md:items-center
                                  gap-4
                                "
                              >

                                <div className="flex-1 min-w-0">

                                  <div
                                    className="
                                      flex
                                      flex-wrap
                                      items-center
                                      gap-2
                                      mb-2
                                    "
                                  >

                                    <span
                                      className={`
                                        rr-mono
                                        inline-flex
                                        items-center
                                        px-2.5
                                        py-1
                                        rounded-full
                                        text-[10px]
                                        font-bold
                                        uppercase
                                        tracking-[0.13em]
                                      `}
                                      style={{
                                        background: style.badge,
                                        color: style.badgeText,
                                      }}
                                    >
                                      {notice.category ||
                                        "General"}
                                    </span>

                                    {notice.pdf_url && (
                                      <span
                                        className="
                                          rr-mono
                                          inline-flex
                                          items-center
                                          px-2.5
                                          py-1
                                          rounded-full
                                          text-[10px]
                                          font-bold
                                          uppercase
                                          tracking-wider
                                        "
                                        style={{
                                          background: `${theme.gold}15`,
                                          color: theme.gold,
                                        }}
                                      >
                                        PDF
                                      </span>
                                    )}

                                  </div>

                                  <h3
                                    className="
                                      text-base
                                      sm:text-lg
                                      font-bold
                                      leading-snug
                                      transition-colors
                                      duration-200
                                    "
                                    style={{ color: theme.ink }}
                                  >
                                    {
                                      notice.title
                                    }
                                  </h3>

                                  <p
                                    className="
                                      mt-1
                                      text-xs
                                      sm:text-sm
                                      leading-relaxed
                                      line-clamp-1
                                    "
                                    style={{ color: theme.textMuted }}
                                  >
                                    {notice.description ||
                                      "Click to read more."}
                                  </p>

                                </div>

                                <div
                                  className="
                                    flex
                                    items-center
                                    justify-between
                                    md:justify-end
                                    gap-3
                                    md:min-w-[140px]
                                  "
                                >

                                  <span
                                    className="
                                      rr-mono
                                      text-xs
                                      font-medium
                                      whitespace-nowrap
                                    "
                                    style={{ color: theme.textMuted }}
                                  >
                                    {new Date(
                                      notice.date
                                    ).toLocaleDateString()}
                                  </span>

                                  <div
                                    className="
                                      flex
                                      h-9
                                      w-9
                                      flex-shrink-0
                                      items-center
                                      justify-center
                                      rounded-full
                                      transition-all
                                      duration-300
                                      group-hover:translate-x-1
                                    "
                                    style={{
                                      background: style.badge,
                                      color: style.badgeText,
                                    }}
                                  >
                                    <ArrowRight className="w-4 h-4" />
                                  </div>

                                </div>

                              </div>

                            </div>

                          </button>

                        </motion.div>
                      );
                    }
                  )}

                </div>
              )}

            </motion.div>
          )}

        </div>

        {/* =================================================
            NOTICE MODAL
        ================================================= */}

        {selectedNotice && (
          <div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            style={{ background: "rgba(15,9,17,0.78)", backdropFilter: "blur(10px)" }}
            onClick={() =>
              setSelectedNotice(
                null
              )
            }
          >

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.95,
                y: 20,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
              }}
              className="relative w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
              style={{ background: theme.card }}
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <div
                className="sticky top-0 z-10 p-5 sm:p-6 border-b flex justify-between items-start"
                style={{ background: `${theme.card}dd`, borderColor: theme.paperDeep }}
              >

                <div>

                  <h2 className="rr-serif text-xl sm:text-2xl font-semibold" style={{ color: theme.ink }}>
                    {
                      selectedNotice.title
                    }
                  </h2>

                  <div className="flex items-center gap-2 mt-1 rr-mono text-xs" style={{ color: theme.textMuted }}>

                    <Calendar className="w-3.5 h-3.5" />

                    {new Date(
                      selectedNotice.date
                    ).toLocaleDateString()}

                  </div>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedNotice(
                      null
                    )
                  }
                  className="p-2 rounded-full transition-colors cursor-pointer"
                  style={{ background: `${theme.rose}08`, color: theme.textMuted }}
                >

                  <X className="w-5 h-5" />

                </button>

              </div>

              <div className="p-5 sm:p-6 overflow-y-auto flex-1">

                <div className="prose max-w-none text-sm sm:text-base leading-relaxed" style={{ color: theme.text }}>

                  <p className="whitespace-pre-line">
                    {selectedNotice.description ||
                      selectedNotice.content}
                  </p>

                </div>

                {selectedNotice.pdf_url && (
                  <div className="mt-6">

                    <PdfNoticePreview
                      fileUrl={
                        selectedNotice.pdf_url
                      }
                      title={
                        selectedNotice.title
                      }
                    />

                  </div>
                )}

              </div>

            </motion.div>

          </div>
        )}

      </section>
    </>
  );
}