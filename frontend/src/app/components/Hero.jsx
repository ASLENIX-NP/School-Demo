import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Camera,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Pencil,
  Sparkles,
} from "lucide-react";
import api from "../../lib/api";

/* =========================================================
   THEME — Matches About page design language
========================================================= */

const THEME = {
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
  border: "rgba(30,20,32,0.08)",
  gradRose: "linear-gradient(135deg, #6E1733 0%, #9C2748 55%, #C6486B 100%)",
  gradInk: "linear-gradient(160deg, #17101C 0%, #2A1826 55%, #3A2130 100%)",
  gradGold: "linear-gradient(135deg, #E7CE9C 0%, #B98A42 100%)",
  gradMoss: "linear-gradient(135deg, #2C4234 0%, #3F5B49 55%, #6E8F76 100%)",
};

/* =========================================================
   GLOBAL STYLES
========================================================= */

function HeroStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,500&family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');

      .rr-hero { font-family: 'Inter', system-ui, -apple-system, sans-serif; --rr-gold: ${THEME.gold}; }
      .rr-serif { font-family: 'Fraunces', Georgia, 'Times New Roman', serif; }
      .rr-mono { font-family: 'Space Grotesk', 'IBM Plex Mono', monospace; }

      .rr-hero a:focus-visible,
      .rr-hero button:focus-visible {
        outline: 2px solid var(--rr-gold);
        outline-offset: 3px;
        border-radius: 6px;
      }

      @keyframes rr-float { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-10px) rotate(1deg); } }
      @keyframes rr-drift { 0% { transform: translate(0,0); } 50% { transform: translate(-1.5%,1.5%); } 100% { transform: translate(0,0); } }
      @keyframes rr-spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      @keyframes rr-twinkle { 0%, 100% { opacity: 0.2; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.15); } }
      @keyframes rr-shimmer-sweep { 0% { transform: translateX(-130%) skewX(-12deg); } 100% { transform: translateX(230%) skewX(-12deg); } }
      @keyframes rr-skel { 0%, 100% { opacity: 0.55; } 50% { opacity: 1; } }

      .rr-emblem { animation: rr-float 7s ease-in-out infinite; }
      .rr-grain { animation: rr-drift 18s ease-in-out infinite; }
      .rr-spin-slow { animation: rr-spin-slow 14s linear infinite; }
      .rr-twinkle { animation: rr-twinkle 2.8s ease-in-out infinite; }
      .rr-skel-block { animation: rr-skel 1.4s ease-in-out infinite; }

      .rr-image-sheen {
        position: absolute;
        top: -10%; left: 0;
        width: 32%; height: 120%;
        background: linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.35) 45%, transparent 90%);
        pointer-events: none;
        z-index: 16;
        animation: rr-shimmer-sweep 5.5s ease-in-out infinite;
        animation-delay: 1.2s;
      }

      @media (prefers-reduced-motion: reduce) {
        .rr-hero *, .rr-hero *::before, .rr-hero *::after {
          animation-duration: 0.001ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.001ms !important;
        }
      }
    `}</style>
  );
}

/* =========================================================
   DEFAULT HERO IMAGE
========================================================= */

const DEFAULT_IMAGE = "";

/* =========================================================
   DEFAULT HERO DATA
========================================================= */

export const defaultHeroData = {
  badge: "WISDOM IS DIVINE",
  schoolName: "RED ROSE SCHOOL",
  titleLine1: "Learning Today.",
  titleLine2: "Leading Tomorrow.",
  establishedYear: "ESTABLISHED 2046 BS",
  subtitle: "Basudev Marga, Hetauda-2",
  description:
    "A welcoming learning community where curiosity, creativity, discipline and values help every student grow with confidence.",
  image: DEFAULT_IMAGE,
  images: [DEFAULT_IMAGE],
  imageAdjustments: {},
  primaryButtonText: "Start Admission",
  primaryButtonLink: "/admissions",
  secondaryButtonText: "Explore School",
  secondaryButtonLink: "/about",
};

/* =========================================================
   IMAGE HELPERS
========================================================= */

function cleanImageUrl(value) {
  let url = String(value || "").trim();
  if (!url) return "";

  const markdownMatch = url.match(/\]\((https?:\/\/[^)]+)\)$/);
  if (markdownMatch?.[1]) return markdownMatch[1].trim();

  const embeddedUrl = url.match(/https?:\/\/[^\s)]+/);
  if (url.startsWith("[") && embeddedUrl?.[0]) return embeddedUrl[0].trim();

  return url;
}

function normalizeImages(saved = {}) {
  const images = [];

  if (Array.isArray(saved?.images)) {
    saved.images.forEach((item) => {
      const url = cleanImageUrl(item);
      if (url && !images.includes(url)) images.push(url);
    });
  }

  const singleImage = cleanImageUrl(saved?.image);

  if (images.length === 0 && singleImage) {
    images.push(singleImage);
  }

  return Array.from(new Set(images));
}

/* =========================================================
   MERGE HERO DATA
========================================================= */

export function mergeHeroData(saved = {}) {
  const savedData = saved && typeof saved === "object" ? saved : {};
  const finalImages = normalizeImages(savedData);

  return {
    ...defaultHeroData,
    ...savedData,
    image: finalImages[0] || cleanImageUrl(savedData.image) || "",
    images: finalImages,
    imageAdjustments:
      savedData.imageAdjustments && typeof savedData.imageAdjustments === "object"
        ? savedData.imageAdjustments
        : {},
  };
}

/* =========================================================
   SAFE LINK
========================================================= */

function safeLink(value, fallback) {
  const link = String(value || "").trim();
  if (link.startsWith("/")) return link;
  return fallback;
}

/* =========================================================
   EDIT BUTTON — Matches About page style
========================================================= */

function EditButton({ editMode, target, onEditTarget, label = "Edit" }) {
  if (!editMode) return null;

  return (
    <button
      type="button"
      title={label}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onEditTarget(target);
      }}
      className="absolute -right-2 -top-2 z-50 flex h-8 w-8 items-center justify-center rounded-full shadow-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 hover:scale-110 transition-all duration-200 cursor-pointer pointer-events-auto"
      style={{
        background: THEME.rose,
        color: THEME.white,
        border: `2px solid ${THEME.white}`,
      }}
    >
      <Pencil className="h-3.5 w-3.5" />
    </button>
  );
}

/* =========================================================
   EDITABLE AREA
========================================================= */

function Editable({ editMode, target, onEditTarget, label, children, className = "" }) {
  if (!editMode) return children;

  return (
    <div className={`relative group ${className}`}>
      {children}
      <EditButton editMode={editMode} target={target} onEditTarget={onEditTarget} label={label} />
    </div>
  );
}

/* =========================================================
   HERO SKELETON — shown while real content loads, so the
   page never flashes the hard-coded default copy/image before
   the saved content swaps in.
========================================================= */

function HeroSkeleton() {
  return (
    <section className="rr-hero relative overflow-hidden w-full" style={{ background: THEME.paper }}>
      <HeroStyles />
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1450px] items-center px-6 pb-16 pt-28 sm:px-8 sm:pt-24 lg:px-12 lg:pt-20 xl:px-16 2xl:px-20">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:gap-10 xl:gap-16">
          <div>
            <div className="rr-skel-block h-8 w-40 rounded-full mb-8" style={{ background: THEME.paperDeep }} />
            <div className="rr-skel-block h-4 w-56 rounded mb-3" style={{ background: THEME.paperDeep }} />
            <div className="rr-skel-block h-14 w-full max-w-lg rounded-lg mb-3" style={{ background: THEME.paperDeep }} />
            <div className="rr-skel-block h-14 w-2/3 max-w-md rounded-lg mb-6" style={{ background: THEME.paperDeep }} />
            <div className="rr-skel-block h-4 w-full max-w-md rounded mb-2" style={{ background: THEME.paperDeep }} />
            <div className="rr-skel-block h-4 w-3/4 max-w-sm rounded mb-8" style={{ background: THEME.paperDeep }} />
            <div className="flex gap-4">
              <div className="rr-skel-block h-14 w-44 rounded-full" style={{ background: THEME.paperDeep }} />
              <div className="rr-skel-block h-14 w-40 rounded-full" style={{ background: THEME.paperDeep }} />
            </div>
          </div>

          <div className="relative min-h-[360px] w-full sm:min-h-[460px] lg:min-h-[540px]">
            <div
              className="rr-skel-block absolute inset-0"
              style={{
                borderRadius: "48% 48% 42% 42% / 24% 24% 18% 18%",
                background: THEME.paperDeep,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   HERO COMPONENT
========================================================= */

export function Hero({ editMode = false, contentOverride = null, onEditTarget = () => {} }) {
  // Only pre-fill with default data when we have an override in hand
  // (edit-mode preview). On the public site, start truly empty and
  // show a skeleton until the saved content actually arrives — this
  // is what was causing the default hero to flash before the real
  // one replaced it.
  const [heroData, setHeroData] = useState(() =>
    contentOverride ? mergeHeroData(contentOverride) : null
  );

  const [loading, setLoading] = useState(!contentOverride);
  const [currentImage, setCurrentImage] = useState(0);

  /* =======================================================
     LOAD HERO CONTENT
  ======================================================= */

  useEffect(() => {
    if (contentOverride) {
      setHeroData(mergeHeroData(contentOverride));
      setLoading(false);
      return;
    }

    let mounted = true;
    setLoading(true);

    async function loadHero() {
      try {
        const response = await api.get("/api/site-content/home");

        if (!mounted) return;

        const hero = response?.data?.data?.content?.hero;

        setHeroData(mergeHeroData(hero || defaultHeroData));
      } catch (error) {
        console.error("Hero loading error:", error);

        if (mounted) {
          setHeroData(mergeHeroData(defaultHeroData));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadHero();

    return () => {
      mounted = false;
    };
  }, [contentOverride]);

  /* =======================================================
     RESET SLIDER
  ======================================================= */

  useEffect(() => {
    setCurrentImage(0);
  }, [heroData?.images?.length]);

  /* =======================================================
     AUTO SLIDER
  ======================================================= */

  useEffect(() => {
    if (editMode || !heroData?.images || heroData.images.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentImage((previous) => (previous + 1) % heroData.images.length);
    }, 5500);

    return () => clearInterval(interval);
  }, [heroData?.images, editMode]);

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading || !heroData) {
    return <HeroSkeleton />;
  }

  /* =======================================================
     IMAGES
  ======================================================= */

  const images =
    Array.isArray(heroData.images) && heroData.images.length > 0
      ? heroData.images.filter(Boolean)
      : [];

  const image = images.length > 0 ? images[currentImage % images.length] : "";

  /* =======================================================
     IMAGE CONTROLS
  ======================================================= */

  const previousImage = () => {
    if (images.length <= 1) return;
    setCurrentImage((previous) => (previous === 0 ? images.length - 1 : previous - 1));
  };

  const nextImage = () => {
    if (images.length <= 1) return;
    setCurrentImage((previous) => (previous + 1) % images.length);
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="rr-hero relative overflow-hidden w-full"
      style={{ background: THEME.paper }}
    >
      <HeroStyles />

      {/* ===================================================
          BACKGROUND — Soft, warm texture
      =================================================== */}

      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -left-32 top-24 h-[420px] w-[420px] rounded-full blur-3xl"
          style={{ background: `${THEME.rose}08` }}
        />
        <div
          className="absolute -right-32 bottom-10 h-[500px] w-[500px] rounded-full blur-3xl"
          style={{ background: `${THEME.gold}10` }}
        />
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, #1E1420 1px, transparent 1.4px)",
            backgroundSize: "24px 24px",
          }}
        />

        {!editMode && (
          <>
            <motion.div
              className="absolute -right-36 top-12 hidden h-[240px] w-[470px] rounded-[50%] lg:block"
              animate={{ rotate: [-8, -4, -8], y: [0, 8, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              style={{
                border: `1px solid ${THEME.gold}20`,
                background: `${THEME.gold}04`,
                boxShadow: `inset 0 1px 0 ${THEME.white}50`,
              }}
            />

            {/* Twinkling accent particles — subtle, same palette */}
            <span
              className="rr-twinkle absolute left-[8%] top-[22%] hidden h-2 w-2 rounded-full lg:block"
              style={{ background: THEME.gold, animationDelay: "0s" }}
            />
            <span
              className="rr-twinkle absolute left-[18%] top-[68%] hidden h-1.5 w-1.5 rounded-full lg:block"
              style={{ background: THEME.rose, animationDelay: "0.9s" }}
            />
            <span
              className="rr-twinkle absolute right-[6%] top-[55%] hidden h-2 w-2 rounded-full lg:block"
              style={{ background: THEME.gold, animationDelay: "1.6s" }}
            />
          </>
        )}
      </div>

      {/* ===================================================
          MAIN CONTAINER
      =================================================== */}

      <div
        className={`relative z-10 mx-auto w-full max-w-[1450px] ${
          editMode
            ? ""
            : "flex min-h-screen items-center px-6 pb-16 pt-28 sm:px-8 sm:pt-24 lg:px-12 lg:pt-20 xl:px-16 2xl:px-20"
        }`}
      >
        <div className="grid w-full items-center gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:gap-10 xl:gap-16">
          {/* =================================================
              LEFT SIDE
          ================================================= */}

          <div className="relative z-20">
            {/* BADGE — Matches About page style */}

            <Editable
              editMode={editMode}
              target={{ type: "heroBadge" }}
              onEditTarget={onEditTarget}
              label="Edit hero badge"
            >
              {editMode ? (
                <div
                  className="inline-flex items-center gap-3 rounded-full px-5 py-2.5 shadow-sm"
                  style={{ background: THEME.card, border: `1px solid ${THEME.border}` }}
                >
                  <Sparkles className="h-4 w-4" style={{ color: THEME.gold }} />
                  <span className="rr-mono text-sm font-bold tracking-[0.28em] sm:text-base" style={{ color: THEME.rose }}>
                    {heroData.badge}
                  </span>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7 }}
                  className="inline-flex items-center gap-3 rounded-full px-5 py-2.5 shadow-sm"
                  style={{ background: THEME.card, border: `1px solid ${THEME.border}` }}
                >
                  <motion.div
                    animate={{ rotate: [0, 15, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Sparkles className="h-4 w-4" style={{ color: THEME.gold }} />
                  </motion.div>
                  <span className="rr-mono text-sm font-bold tracking-[0.28em] sm:text-base" style={{ color: THEME.rose }}>
                    {heroData.badge}
                  </span>
                </motion.div>
              )}
            </Editable>

            {/* SCHOOL NAME */}

            <Editable
              editMode={editMode}
              target={{ type: "heroSchoolName" }}
              onEditTarget={onEditTarget}
              label="Edit school name"
            >
              {editMode ? (
                <p className="mt-6 text-base font-bold tracking-[0.38em] sm:text-lg" style={{ color: THEME.gold }}>
                  {heroData.schoolName}
                </p>
              ) : (
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.08 }}
                  className="mt-8 text-base font-bold tracking-[0.38em] sm:text-lg"
                  style={{ color: THEME.gold }}
                >
                  {heroData.schoolName}
                </motion.p>
              )}
            </Editable>

            {/* MAIN TITLE — Using serif font like About page */}

            <Editable
              editMode={editMode}
              target={{ type: "heroTitle" }}
              onEditTarget={onEditTarget}
              label="Edit hero title"
            >
              {editMode ? (
                <h1
                  className="rr-serif mt-3 max-w-2xl text-4xl font-semibold leading-[1.05] tracking-[-0.02em] sm:text-5xl md:text-6xl lg:text-[4rem]"
                  style={{ color: THEME.ink }}
                >
                  {heroData.titleLine1}
                  <br />
                  <span style={{ color: THEME.rose }}>{heroData.titleLine2}</span>
                </h1>
              ) : (
                <motion.h1
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
                  className="rr-serif mt-3 max-w-2xl text-5xl font-semibold leading-[0.98] tracking-[-0.02em] sm:text-6xl md:text-7xl lg:text-[4.5rem] xl:text-[5rem]"
                  style={{ color: THEME.ink }}
                >
                  {heroData.titleLine1}
                  <br />
                  <span style={{ color: THEME.rose }}>{heroData.titleLine2}</span>
                </motion.h1>
              )}
            </Editable>

            {/* DESCRIPTION */}

            <Editable
              editMode={editMode}
              target={{ type: "heroDescription" }}
              onEditTarget={onEditTarget}
              label="Edit description"
            >
              {editMode ? (
                <p className="mt-4 max-w-xl text-base leading-7 sm:text-lg sm:leading-8" style={{ color: THEME.textMuted }}>
                  {heroData.description}
                </p>
              ) : (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.25 }}
                  className="mt-4 max-w-xl text-lg leading-8 sm:text-xl sm:leading-9"
                  style={{ color: THEME.textMuted }}
                >
                  {heroData.description}
                </motion.p>
              )}
            </Editable>

            {/* DETAILS — Clean, minimal */}

            <Editable
              editMode={editMode}
              target={{ type: "heroMeta" }}
              onEditTarget={onEditTarget}
              label="Edit school details"
            >
              <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
                <span className="rr-mono text-sm font-bold tracking-[0.12em] sm:text-base" style={{ color: THEME.textMuted }}>
                  {heroData.establishedYear}
                </span>

                <span className="h-1.5 w-1.5 rounded-full" style={{ background: THEME.gold }} />

                <span className="flex items-center gap-2 text-base font-semibold sm:text-lg" style={{ color: THEME.textMuted }}>
                  <MapPin className="h-4 w-4" style={{ color: THEME.gold }} />
                  {heroData.subtitle}
                </span>
              </div>
            </Editable>

            {/* BUTTONS — Matches About page style */}

            <Editable
              editMode={editMode}
              target={{ type: "heroButtons" }}
              onEditTarget={onEditTarget}
              label="Edit hero buttons"
            >
              <div className="mt-5 flex flex-wrap gap-4">
                <Link
                  to={safeLink(heroData.primaryButtonLink, "/admissions")}
                  onClick={(event) => {
                    if (editMode) event.preventDefault();
                  }}
                  className="group inline-flex items-center gap-3 rounded-full px-7 py-3.5 text-base font-bold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:px-8 sm:py-4 sm:text-lg"
                  style={{
                    color: THEME.white,
                    background: THEME.gradRose,
                    boxShadow: `0 14px 30px ${THEME.rose}35`,
                  }}
                >
                  {heroData.primaryButtonText}
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-full"
                    style={{ background: "rgba(255,255,255,0.20)" }}
                  >
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Link>

                <Link
                  to={safeLink(heroData.secondaryButtonLink, "/about")}
                  onClick={(event) => {
                    if (editMode) event.preventDefault();
                  }}
                  className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-base font-bold shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:px-8 sm:py-4 sm:text-lg"
                  style={{ color: THEME.ink, background: THEME.card, border: `1px solid ${THEME.border}` }}
                >
                  {heroData.secondaryButtonText}
                </Link>
              </div>
            </Editable>

            {/* PHILOSOPHY — Clean, minimal */}

            <div className="mt-6 flex items-center gap-4">
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
                style={{ background: `${THEME.rose}08`, color: THEME.rose }}
              >
                <Sparkles className="h-5 w-5" />
              </div>

              <div>
                <p className="rr-mono text-sm font-bold uppercase tracking-[0.2em] sm:text-base" style={{ color: THEME.textMuted }}>
                  A place to learn
                </p>
                <p className="rr-serif mt-0.5 text-lg font-semibold sm:text-xl" style={{ color: THEME.ink }}>
                  A place to belong.
                </p>
              </div>
            </div>
          </div>

          {/* =================================================
              RIGHT IMAGE
          ================================================= */}

          <div className="relative min-h-[360px] w-full sm:min-h-[460px] lg:min-h-[540px]">
            {/* GOLD RING */}

            {!editMode ? (
              <motion.div
                className="rr-spin-slow absolute right-[-4%] top-[4%] h-[82%] w-[82%] rounded-[48%]"
                style={{
                  border: `2px dashed ${THEME.gold}30`,
                  background: `${THEME.gold}08`,
                  boxShadow: `0 30px 70px ${THEME.gold}15`,
                }}
              />
            ) : (
              <div
                className="absolute right-[-2%] top-[3%] h-[82%] w-[82%] rounded-[48%]"
                style={{ border: `2px solid ${THEME.gold}20`, background: `${THEME.gold}06` }}
              />
            )}

            {/* ACCENT */}

            <div
              className="absolute bottom-[2%] left-[2%] h-[55%] w-[35%] rounded-[50%] blur-[1px]"
              style={{ background: `${THEME.gold}30`, transform: "rotate(-18deg)" }}
            />

            {/* MAIN IMAGE FRAME */}

            <div
              className="absolute inset-0 overflow-hidden"
              style={{
                borderRadius: "48% 48% 42% 42% / 24% 24% 18% 18%",
                border: `7px solid ${THEME.white}E6`,
                boxShadow: `0 35px 70px ${THEME.ink}18, 0 14px 28px ${THEME.ink}10`,
                background: THEME.ink,
              }}
            >
              {!editMode && image && <div className="rr-image-sheen" />}

              {image ? (
                editMode ? (
                  <img
                    src={image}
                    alt={`${heroData.schoolName} school`}
                    className="absolute inset-0 h-full w-full object-cover"
                    draggable={false}
                  />
                ) : (
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={image}
                      src={image}
                      alt={`${heroData.schoolName} school`}
                      className="absolute inset-0 h-full w-full object-cover"
                      initial={{ opacity: 0, scale: 1.03 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.01 }}
                      transition={{ duration: 0.45 }}
                    />
                  </AnimatePresence>
                )
              ) : (
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #EEF2F7 0%, #E5EAF0 50%, #DCE3EB 100%)" }}
                >
                  <div className="flex flex-col items-center gap-3 text-center px-6">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-full"
                      style={{ background: `${THEME.gold}14`, color: THEME.gold, border: `1px solid ${THEME.gold}30` }}
                    >
                      <Camera className="h-5 w-5" />
                    </div>
                    <span className="rr-mono text-xs font-bold uppercase tracking-[0.18em]" style={{ color: THEME.textMuted }}>
                      School image
                    </span>
                  </div>
                </div>
              )}

              {/* OVERLAY */}

              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: `linear-gradient(180deg, ${THEME.ink}00 50%, ${THEME.ink}40 100%)` }}
              />

              {/* CAMERA ICON */}

              <div
                className="absolute right-5 top-5 z-20 flex h-11 w-11 items-center justify-center rounded-full"
                style={{
                  background: `${THEME.white}D9`,
                  color: THEME.ink,
                  backdropFilter: "blur(14px)",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.10)",
                }}
              >
                <Camera className="h-5 w-5" />
              </div>

              {/* ADMIN IMAGE BUTTON */}

              {editMode && (
                <button
                  type="button"
                  onClick={() => onEditTarget({ type: "heroImage" })}
                  className="absolute right-20 top-5 z-30 flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-bold shadow-xl hover:scale-105 transition-transform cursor-pointer"
                  style={{ background: THEME.white, color: THEME.ink }}
                >
                  <Camera className="h-4 w-4" />
                  Change Image
                </button>
              )}

              {/* IMAGE CAPTION */}

              <div className="absolute bottom-7 left-7 z-20 sm:bottom-9 sm:left-9">
                <p className="rr-mono text-[10px] font-bold uppercase tracking-[0.25em] text-white">
                  {heroData.schoolName}
                </p>
                <p className="rr-serif mt-1 text-xl font-semibold tracking-tight text-white sm:text-2xl">
                  A place to belong.
                </p>
              </div>

              {/* SLIDER CONTROLS */}

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={previousImage}
                    aria-label="Previous image"
                    className="absolute left-4 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full shadow-lg transition-all hover:scale-110 cursor-pointer"
                    style={{ background: `${THEME.white}D9`, color: THEME.ink, backdropFilter: "blur(8px)" }}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  <button
                    type="button"
                    onClick={nextImage}
                    aria-label="Next image"
                    className="absolute right-4 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full shadow-lg transition-all hover:scale-110 cursor-pointer"
                    style={{ background: `${THEME.white}D9`, color: THEME.ink, backdropFilter: "blur(8px)" }}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>

                  <div
                    className="absolute bottom-7 right-7 z-30 flex items-center gap-2 rounded-full px-3 py-2 backdrop-blur-md"
                    style={{ background: `${THEME.ink}55` }}
                  >
                    {images.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setCurrentImage(index)}
                        aria-label={`Show image ${index + 1}`}
                        className="h-1.5 rounded-full transition-all duration-300 cursor-pointer"
                        style={{
                          width: currentImage === index ? "25px" : "7px",
                          background:
                            currentImage === index ? THEME.goldSoft : "rgba(255,255,255,0.70)",
                          boxShadow:
                            currentImage === index ? `0 0 10px ${THEME.goldSoft}` : "none",
                        }}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* FLOATING INFO — Matches About page style */}

            {!editMode ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: [0, -7, 0] }}
                transition={{
                  opacity: { duration: 0.7, delay: 0.8 },
                  y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                }}
                className="absolute bottom-[5%] left-0 z-40 rounded-[22px] px-5 py-4 shadow-xl sm:px-6 sm:py-5"
                style={{
                  background: `${THEME.card}E6`,
                  border: `1px solid ${THEME.border}`,
                  boxShadow: `0 24px 48px ${THEME.ink}15`,
                  backdropFilter: "blur(16px)",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full"
                    style={{ background: `${THEME.rose}08`, color: THEME.rose }}
                  >
                    <Sparkles className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="rr-mono text-[9px] font-bold uppercase tracking-[0.18em]" style={{ color: THEME.textMuted }}>
                      Our Philosophy
                    </p>
                    <p className="rr-serif mt-0.5 text-sm font-semibold" style={{ color: THEME.ink }}>
                      Learn • Lead • Serve
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div
                className="absolute bottom-[5%] left-0 z-40 rounded-[22px] px-5 py-4 shadow-xl sm:px-6 sm:py-5"
                style={{
                  background: `${THEME.card}F2`,
                  border: `1px solid ${THEME.border}`,
                  boxShadow: `0 16px 36px ${THEME.ink}10`,
                  backdropFilter: "blur(16px)",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full"
                    style={{ background: `${THEME.rose}08`, color: THEME.rose }}
                  >
                    <Sparkles className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="rr-mono text-[9px] font-bold uppercase tracking-[0.18em]" style={{ color: THEME.textMuted }}>
                      Our Philosophy
                    </p>
                    <p className="rr-serif mt-0.5 text-sm font-semibold" style={{ color: THEME.ink }}>
                      Learn • Lead • Serve
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===================================================
          BOTTOM SCROLL INDICATOR
      =================================================== */}

      {!editMode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 items-center gap-2 lg:flex"
        >
          <div className="h-1.5 w-1.5 rounded-full" style={{ background: THEME.gold }} />
          <span className="rr-mono text-[9px] font-bold uppercase tracking-[0.3em]" style={{ color: THEME.textMuted }}>
            Discover {heroData.schoolName.split(" ")[0]}
          </span>
          <div className="h-px w-12" style={{ background: `${THEME.ink}15` }} />
        </motion.div>
      )}
    </motion.section>
  );
}

export default Hero;