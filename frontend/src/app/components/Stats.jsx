import { useEffect, useRef, useState, useCallback } from "react";
import api from "../../lib/api";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import {
  ArrowRight,
  BookOpen,
  Calendar,
  Users,
  Award,
  Sparkles,
  Download,
  Monitor,
  Target,
  Layers,
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
   TILT CARD
========================================================= */

function TiltCard({
  children,
  className = "",
  max = 8,
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
        ...style,
      }}
      {...props}
    >
      {!editMode && (
        <div className="absolute inset-0 rounded-[inherit] pointer-events-none bg-gradient-to-br from-white/30 via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
      )}

      {children}
    </div>
  );
}

/* =========================================================
   FLOATING BACKGROUND
========================================================= */

function FloatingBackground() {
  const shapes = Array.from({
    length: 12,
  }).map((_, i) => ({
    id: i,
    x: (i * 19 + 7) % 100,
    y: (i * 23 + 11) % 100,
    size: 4 + (i % 4) * 2,
    duration: 18 + (i % 5) * 4,
    delay: (i * 1.5) % 8,
    color:
      i % 2 === 0
        ? "rgba(233, 196, 106, 0.15)"
        : "rgba(30, 58, 95, 0.10)",
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 select-none">
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className="absolute rounded-full"
          style={{
            width: shape.size,
            height: shape.size,
            left: `${shape.x}%`,
            top: `${shape.y}%`,
            background: shape.color,
          }}
          animate={{
            y: [0, -35, 0],
            x: [0, 10, 0],
            scale: [1, 1.15, 1],
            opacity: [0.35, 0.7, 0.35],
          }}
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            delay: shape.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
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
          className="w-7 h-7 rounded-full flex items-center justify-center bg-indigo-600 text-white shadow hover:bg-indigo-700 hover:scale-105 transition-all cursor-pointer"
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
            className="w-7 h-7 rounded-full flex items-center justify-center bg-red-600 text-white shadow hover:bg-red-700 hover:scale-105 transition-all cursor-pointer"
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

  description:
    "Real numbers that reflect our commitment to excellence and holistic education in the Makwanpur region.",

  stats: [
    {
      value: "3800",
      suffix: "+",
      label: "Students Enrolled",
      note: "Across school programs",
      color: "#1E3A5F",
    },

    {
      value: "240",
      suffix: "+",
      label: "Expert Teachers",
      note: "Academic support team",
      color: "#2D6A4F",
    },

    {
      value: "35",
      suffix: " yrs",
      label: "Years of Excellence",
      note: "Serving Makwanpur",
      color: "#E9C46A",
    },

    {
      value: "98",
      suffix: "%",
      label: "Success Rate",
      note: "Academic performance",
      color: "#F4A261",
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

    // No hardcoded story image.
    // The real image is loaded from the backend.
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
      "Academic Focus",

    description:
      "Our students consistently achieve outstanding results in the SEE examinations.",

    cards: [
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
  let url = String(value || "").trim();

  if (!url) return "";

  // Convert Markdown image/link values stored by mistake into raw URLs.
  const markdownMatch = url.match(/\]\((https?:\/\/[^)]+)\)$/);
  if (markdownMatch?.[1]) {
    return markdownMatch[1].trim();
  }

  const embeddedUrl = url.match(/https?:\/\/[^\s)]+/);
  if (url.startsWith("[") && embeddedUrl?.[0]) {
    return embeddedUrl[0].trim();
  }

  return url;
}

function getStoryImageStyle(story) {
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

        excellence: {
          ...defaultStatsData.excellence,
          ...(contentOverride.excellence ||
            {}),
          cards:
            contentOverride
              .excellence?.cards ||
            defaultStatsData.excellence
              .cards,
        },
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

                excellence: {
                  ...defaultStatsData.excellence,
                  ...(saved.excellence ||
                    {}),
                  cards:
                    saved.excellence
                      ?.cards ||
                    defaultStatsData
                      .excellence
                      .cards,
                },
              });
            }
          } catch (err) {
            console.error(
              "Load stats content error:",
              err
            );
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
        className={`flex items-center justify-center bg-slate-50 text-slate-900 ${
          editMode
            ? "py-12"
            : "min-h-screen"
        }`}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-indigo-400/30 border-t-indigo-500 rounded-full animate-spin" />

          <p className="text-xs font-bold tracking-widest text-slate-400">
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
        className={`flex items-center justify-center bg-slate-50 text-slate-900 ${
          editMode
            ? "py-12"
            : "min-h-screen"
        }`}
      >
        <div className="flex flex-col items-center gap-4">
          <AlertCircle className="w-10 h-10 text-red-500" />

          <p className="text-sm font-medium text-red-500">
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
        className={`flex items-center justify-center bg-slate-50 text-slate-900 ${
          editMode
            ? "py-12"
            : "min-h-screen"
        }`}
      >
        <p className="text-sm font-medium text-slate-400">
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
      {!editMode && (
        <HomeAnnouncementPopup />
      )}

      <section
        className={`relative w-full overflow-hidden ${
          editMode
            ? "py-10 sm:py-16 bg-slate-50/40"
            : "min-h-screen bg-gradient-to-br from-indigo-50 via-white to-amber-50/30 py-20 md:py-28"
        }`}
      >
        {!editMode && (
          <FloatingBackground />
        )}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8">

          {/* =================================================
              HEADER
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
              className={`text-center max-w-4xl mx-auto ${
                editMode
                  ? "mb-14"
                  : "mb-20"
              }`}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 bg-indigo-100 text-indigo-700 border border-indigo-200 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />

                {data.eyebrow ||
                  "Our Impact"}
              </div>

              <h1
                className={`font-black tracking-tight text-slate-900 leading-tight ${
                  editMode
                    ? "text-3xl sm:text-4xl md:text-5xl mb-4"
                    : "text-4xl md:text-6xl lg:text-7xl mb-6"
                }`}
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-slate-700 block">
                  {data.title}
                </span>
              </h1>

              <p
                className={`max-w-2xl mx-auto leading-relaxed ${
                  editMode
                    ? "text-base sm:text-lg text-slate-600"
                    : "text-lg md:text-xl text-slate-500 font-light"
                }`}
              >
                {data.description}
              </p>
            </div>
          </StatsEditableWrap>

          {/* =================================================
              STATS GRID
          ================================================= */}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mb-16 sm:mb-24 relative">

            <div className="absolute inset-0 bg-gradient-to-r from-indigo-100/30 to-transparent blur-3xl -z-10 rounded-full" />

            {data.stats.map(
              (stat, i) => {
                const card =
                  (
                    <TiltCard
                      editMode={
                        editMode
                      }
                      max={8}
                      className="relative p-5 sm:p-7 md:p-8 text-center bg-white/85 backdrop-blur-lg rounded-2xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 group"
                    >
                      <div
                        className="absolute -inset-0.5 rounded-2xl bg-gradient-to-br opacity-20 group-hover:opacity-35 transition-opacity blur-sm pointer-events-none"
                        style={{
                          background:
                            stat.color,
                        }}
                      />

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
                        <div
                          className="w-12 h-12 sm:w-14 sm:h-14 mx-auto rounded-2xl flex items-center justify-center mb-3 sm:mb-4 text-white shadow-md relative z-10"
                          style={{
                            background:
                              stat.color,
                          }}
                        >
                          {i === 0 ? (
                            <Users className="w-6 h-6 sm:w-7 sm:h-7" />
                          ) : i === 1 ? (
                            <Award className="w-6 h-6 sm:w-7 sm:h-7" />
                          ) : i === 2 ? (
                            <Calendar className="w-6 h-6 sm:w-7 sm:h-7" />
                          ) : (
                            <Target className="w-6 h-6 sm:w-7 sm:h-7" />
                          )}
                        </div>

                        <div className="relative z-10">
                          <div className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-1 tracking-tight">
                            {stat.value}
                            {stat.suffix}
                          </div>

                          <div className="text-xs sm:text-sm font-bold text-slate-700">
                            {stat.label}
                          </div>

                          <div className="text-[11px] sm:text-xs text-slate-500 mt-1">
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

            {/* =================================================
                ADD STAT CARD
            ================================================= */}

            {editMode && (
              <div
                className="flex items-center justify-center h-full min-h-[160px] sm:min-h-[200px] border-2 border-dashed border-indigo-300/60 rounded-2xl bg-indigo-50/40 hover:bg-indigo-100/60 transition-colors cursor-pointer group"
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
                <div className="flex flex-col items-center gap-2 text-indigo-600">
                  <Plus className="w-7 h-7 group-hover:scale-110 transition-transform" />

                  <span className="text-xs sm:text-sm font-bold">
                    Add Stat Card
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* =================================================
              STORY SECTION
          ================================================= */}

          <div className="relative grid lg:grid-cols-2 gap-10 md:gap-14 items-center mb-16 sm:mb-24">

            {/* =================================================
                STORY IMAGE
            ================================================= */}

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

                  {cleanImageUrl(data.story?.image) ? (
                    <img
                      src={cleanImageUrl(data.story?.image)}
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
                        <div className="h-12 w-12 rounded-full border-4 border-slate-300 border-t-amber-500 animate-spin" />
                        <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                          Loading school image
                        </span>
                      </div>
                    </div>
                  )}

                  {/* TOP TEXT */}

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
                        <div className="text-white text-lg sm:text-xl font-bold">
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

                  {/* OPTIONAL BOTTOM TEXT */}

                  {(
                    data.story
                      ?.imageBottomTitle ||
                    data.story
                      ?.imageBottomDescription
                  ) && (
                    <div className="absolute top-5 right-5 z-20 max-w-[260px] rounded-2xl bg-slate-950/55 backdrop-blur-md border border-white/20 p-4 text-white">
                      {data.story
                        ?.imageBottomTitle && (
                        <div className="font-black text-sm">
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

            {/* =================================================
                STORY TEXT
            ================================================= */}

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
                  <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
                    <Sparkles className="w-4 h-4" />
                  </div>

                  <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-amber-700">
                    {data.story
                      ?.badge ||
                      "Our Story"}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4 sm:mb-6 tracking-tight leading-tight">
                  {
                    data.story
                      ?.title
                  }
                </h2>

                <div className="space-y-3.5 text-slate-600 leading-relaxed text-sm sm:text-base md:text-lg mb-6 sm:mb-8">
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

              {/* =================================================
                  STORY BUTTON
              ================================================= */}

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
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-white font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all bg-gradient-to-r from-orange-500 to-amber-500 group"
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
              EXCELLENCE
          ================================================= */}

          <div className="mb-16 sm:mb-24">

            <StatsEditableWrap
              editMode={editMode}
              target={{
                type: "excellenceHeader",
              }}
              onEditTarget={
                onEditTarget
              }
            >
              <div className="text-center mb-10 sm:mb-12">

                <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold tracking-widest uppercase mb-3">
                  {data.excellence
                    ?.title ||
                    "Academic Focus"}
                </span>

                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">
                  Excellence in Every Subject
                </h2>

                <p className="text-slate-600 max-w-2xl mx-auto mt-2 text-sm sm:text-base">
                  {
                    data
                      .excellence
                      ?.description
                  }
                </p>
              </div>
            </StatsEditableWrap>

            <div className="grid md:grid-cols-3 gap-6">

              {(
                data.excellence
                  ?.cards || []
              ).map(
                (
                  card,
                  i
                ) => (
                  <div
                    key={i}
                    className="relative group bg-white rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-slate-100 overflow-hidden"
                  >
                    <div className="relative z-10">

                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-indigo-900 text-white flex items-center justify-center mb-4 shadow-md">
                        {i ===
                        0 ? (
                          <Monitor className="w-6 h-6" />
                        ) : i ===
                          1 ? (
                          <Award className="w-6 h-6" />
                        ) : (
                          <Layers className="w-6 h-6" />
                        )}
                      </div>

                      <StatsEditableWrap
                        editMode={
                          editMode
                        }
                        target={{
                          type: "excellenceCard",
                          index: i,
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
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
                          {
                            card.title
                          }
                        </h3>

                        <p className="text-slate-600 leading-relaxed text-sm">
                          {
                            card.description
                          }
                        </p>
                      </StatsEditableWrap>

                    </div>
                  </div>
                )
              )}

              {/* =================================================
                  ADD EXCELLENCE CARD
              ================================================= */}

              {editMode && (
                <div
                  className="flex items-center justify-center min-h-[160px] border-2 border-dashed border-purple-300/60 rounded-2xl bg-purple-50/40 hover:bg-purple-100/60 transition-colors cursor-pointer group"
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
                  <div className="flex flex-col items-center gap-2 text-purple-600">
                    <Plus className="w-7 h-7 group-hover:scale-110 transition-transform" />

                    <span className="text-xs sm:text-sm font-bold">
                      Add Excellence Card
                    </span>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* =================================================
              NOTICE BOARD
          ================================================= */}

          {!editMode && (
            <motion.div
              initial={{
                opacity: 0,
                y: 30,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.6,
              }}
              className="bg-gradient-to-br from-indigo-50/90 via-white to-purple-50/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 md:p-12 shadow-xl border border-white/50 relative overflow-hidden"
            >
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 sm:mb-10">

                <div>

                  <div className="inline-flex items-center gap-3 mb-2 border border-indigo-200 bg-indigo-50/50 rounded-full px-4 py-1.5 text-indigo-700 text-xs font-bold uppercase tracking-widest backdrop-blur-sm">
                    <BookOpen className="w-3.5 h-3.5" />

                    Notice Board
                  </div>

                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800">
                    Latest Updates
                  </h2>

                </div>

                <Link
                  to="/notices"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:shadow-lg hover:scale-105 transition-all active:scale-95 shadow-md text-sm"
                >
                  View All

                  <ArrowRight className="w-4 h-4" />
                </Link>

              </div>

              {notices.length ===
              0 ? (
                <div className="border border-indigo-200 rounded-2xl p-10 text-center bg-white/50 backdrop-blur-sm">

                  <Calendar className="w-14 h-14 mx-auto mb-3 text-indigo-300" />

                  <h3 className="text-lg font-bold text-slate-500">
                    No notices available
                  </h3>

                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4 relative z-10">

                  {notices.map(
                    (
                      notice,
                      i
                    ) => {
                      const borderColors =
                        [
                          "border-indigo-400",
                          "border-amber-400",
                          "border-emerald-400",
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
                            x: -20,
                          }}
                          whileInView={{
                            opacity: 1,
                            x: 0,
                          }}
                          viewport={{
                            once: true,
                          }}
                          transition={{
                            delay:
                              i *
                              0.08,
                          }}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedNotice(
                                notice
                              )
                            }
                            className="w-full text-left group cursor-pointer"
                          >
                            <div
                              className={`p-4 sm:p-5 md:p-6 rounded-2xl bg-white/70 backdrop-blur-sm border-l-4 ${
                                borderColors[
                                  i %
                                    borderColors.length
                                ]
                              } hover:bg-white/90 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg`}
                            >

                              <div className="flex flex-col md:flex-row md:items-center gap-3 sm:gap-4">

                                <div className="flex-1 min-w-0">

                                  <div className="flex flex-wrap items-center gap-2 mb-1">

                                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest border border-indigo-200 px-2 py-0.5 rounded-full">
                                      {notice.category ||
                                        "Notice"}
                                    </span>

                                    {notice.pdf_url && (
                                      <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                                        <Download className="w-3 h-3" />

                                        PDF
                                      </span>
                                    )}

                                  </div>

                                  <h3 className="text-base sm:text-lg font-bold text-slate-800 line-clamp-1">
                                    {
                                      notice.title
                                    }
                                  </h3>

                                  <p className="text-xs sm:text-sm text-slate-500 line-clamp-1 mt-0.5">
                                    {notice.description ||
                                      "Click to read more."}
                                  </p>

                                </div>

                                <div className="flex-shrink-0 flex items-center gap-3">

                                  <span className="text-xs text-slate-500 font-medium">
                                    {new Date(
                                      notice.date
                                    ).toLocaleDateString()}
                                  </span>

                                  <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">

                                    <ArrowRight className="w-3.5 h-3.5 text-indigo-600 group-hover:text-indigo-800 transition-colors" />

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
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md"
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
              className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm p-5 sm:p-6 border-b border-slate-100 flex justify-between items-start">

                <div>

                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    {
                      selectedNotice.title
                    }
                  </h2>

                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">

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
                  className="p-2 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>

              </div>

              <div className="p-5 sm:p-6 overflow-y-auto flex-1">

                <div className="prose max-w-none text-slate-700 text-sm sm:text-base">

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