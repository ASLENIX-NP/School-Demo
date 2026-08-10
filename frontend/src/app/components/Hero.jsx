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
  Play,
} from "lucide-react";
import api from "../../lib/api";

/* =========================================================
   SCHOOL COLORS
========================================================= */

const COLORS = {
  navy: "#152438",
  navySoft: "#5E7084",
  gold: "#D9AA32",
  goldLight: "#F4D77E",
  cream: "#FFFDF8",
  creamDark: "#F8F2E6",
  white: "#FFFFFF",
  blue: "#DDEFF3",
  border: "rgba(21,36,56,0.10)",
};

/* =========================================================
   DEFAULT HERO DATA
========================================================= */

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=2000&q=90";

const defaultHeroData = {
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

  primaryButtonText: "Start Admission",
  primaryButtonLink: "/admissions",

  secondaryButtonText: "Explore School",
  secondaryButtonLink: "/about",
};

/* =========================================================
   MERGE DATA
========================================================= */

function mergeHeroData(data = {}) {
  const images = Array.isArray(data.images)
    ? data.images
        .map((item) => String(item || "").trim())
        .filter(Boolean)
    : [];

  const finalImages =
    images.length > 0
      ? Array.from(new Set(images))
      : [data.image || DEFAULT_IMAGE];

  return {
    ...defaultHeroData,
    ...data,
    image: finalImages[0],
    images: finalImages,
  };
}

/* =========================================================
   SAFE LINK
========================================================= */

function safeLink(value, fallback) {
  const link = String(value || "").trim();

  return link.startsWith("/") ? link : fallback;
}

/* =========================================================
   EDIT BUTTON
========================================================= */

function EditButton({
  editMode,
  target,
  onEditTarget,
  label = "Edit",
}) {
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
      className="
        absolute
        -right-3
        -top-3
        z-50
        flex
        h-9
        w-9
        items-center
        justify-center
        rounded-full
        border-2
        border-white
        bg-[#D9AA32]
        text-[#152438]
        shadow-xl
        opacity-0
        transition-all
        duration-200
        group-hover:opacity-100
        hover:scale-110
      "
    >
      <Pencil className="h-4 w-4" />
    </button>
  );
}

/* =========================================================
   EDITABLE AREA
========================================================= */

function Editable({
  editMode,
  target,
  onEditTarget,
  label,
  children,
  className = "",
}) {
  if (!editMode) {
    return children;
  }

  return (
    <div className={`relative group ${className}`}>
      {children}

      <EditButton
        editMode={editMode}
        target={target}
        onEditTarget={onEditTarget}
        label={label}
      />
    </div>
  );
}

/* =========================================================
   HERO COMPONENT
========================================================= */

export function Hero({
  editMode = false,
  contentOverride = null,
  onEditTarget = () => {},
}) {
  const [heroData, setHeroData] = useState(() =>
    mergeHeroData(contentOverride || defaultHeroData)
  );

  const [currentImage, setCurrentImage] = useState(0);

  /* =======================================================
     LOAD HERO CONTENT
  ======================================================= */

  useEffect(() => {
    if (contentOverride) {
      setHeroData(mergeHeroData(contentOverride));
      return;
    }

    let mounted = true;

    async function loadHero() {
      try {
        const response = await api.get("/api/site-content/home");

        if (!mounted) return;

        const hero =
          response?.data?.data?.content?.hero;

        if (hero) {
          setHeroData(mergeHeroData(hero));
        }
      } catch (error) {
        console.error("Hero loading error:", error);

        if (mounted) {
          setHeroData(
            mergeHeroData(defaultHeroData)
          );
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
  }, [heroData.images?.length]);

  /* =======================================================
     AUTO SLIDER
  ======================================================= */

  useEffect(() => {
    if (!heroData.images || heroData.images.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentImage(
        (previous) =>
          (previous + 1) %
          heroData.images.length
      );
    }, 5500);

    return () => clearInterval(interval);
  }, [heroData.images]);

  const images =
    heroData.images?.length > 0
      ? heroData.images
      : [DEFAULT_IMAGE];

  const image =
    images[currentImage % images.length] ||
    DEFAULT_IMAGE;

  /* =======================================================
     IMAGE CONTROLS
  ======================================================= */

  const previousImage = () => {
    setCurrentImage((previous) =>
      previous === 0
        ? images.length - 1
        : previous - 1
    );
  };

  const nextImage = () => {
    setCurrentImage(
      (previous) =>
        (previous + 1) % images.length
    );
  };

  /* =======================================================
     PAGE - Lighter yellow background with larger fonts
  ======================================================= */

  return (
    <section
      className="
        relative
        min-h-screen
        overflow-hidden
      "
      style={{
        background: "linear-gradient(180deg, #FFF8E7 0%, #FFF3D6 45%, #FFE8B0 100%)",
      }}
    >
      {/* ===================================================
          BACKGROUND - Decorative elements
      =================================================== */}

      <div className="absolute inset-0 pointer-events-none">
        {/* Warm glow */}
        <div
          className="
            absolute
            -left-32
            top-24
            h-[420px]
            w-[420px]
            rounded-full
            blur-3xl
          "
          style={{
            background: "rgba(255,215,0,0.12)",
          }}
        />

        {/* Gold glow */}
        <div
          className="
            absolute
            -right-32
            bottom-10
            h-[500px]
            w-[500px]
            rounded-full
            blur-3xl
          "
          style={{
            background: "rgba(255,215,0,0.18)",
          }}
        />

        {/* Subtle pattern */}
        <div
          className="
            absolute
            inset-0
            opacity-[0.06]
          "
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 50%, rgba(255,215,0,0.08) 0%, transparent 50%),
              radial-gradient(circle at 80% 50%, rgba(255,215,0,0.08) 0%, transparent 50%)
            `,
          }}
        />

        {/* Decorative gold oval */}
        <motion.div
          className="
            absolute
            -right-36
            top-12
            hidden
            h-[240px]
            w-[470px]
            rounded-[50%]
            lg:block
          "
          animate={{
            rotate: [-8, -4, -8],
            y: [0, 8, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            border: "1px solid rgba(217,170,50,0.15)",
            background: "rgba(217,170,50,0.04)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5)",
          }}
        />
      </div>

      {/* ===================================================
          MAIN CONTAINER
      =================================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          flex
          min-h-screen
          w-full
          max-w-[1450px]
          items-center
          px-6
          pb-16
          pt-28
          sm:px-8
          sm:pt-24
          lg:px-12
          lg:pt-20
          xl:px-16
          2xl:px-20
        "
      >
        <div
          className="
            grid
            w-full
            items-center
            gap-12
            lg:grid-cols-[0.88fr_1.12fr]
            lg:gap-10
            xl:gap-16
          "
        >
          {/* =================================================
              LEFT SIDE - INCREASED FONT SIZES
          ================================================= */}

          <div className="relative z-20">
            {/* BADGE - Increased size */}

            <Editable
              editMode={editMode}
              target={{
                type: "heroBadge",
              }}
              onEditTarget={onEditTarget}
              label="Edit hero badge"
            >
              <motion.div
                initial={{
                  opacity: 0,
                  x: -20,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  duration: 0.7,
                }}
                className="
                  inline-flex
                  items-center
                  gap-3
                  rounded-full
                  border
                  bg-white/80
                  px-5
                  py-3
                  shadow-sm
                  backdrop-blur-xl
                "
                style={{
                  borderColor: COLORS.border,
                }}
              >
                <Sparkles
                  className="h-5 w-5"
                  style={{
                    color: COLORS.gold,
                  }}
                />

                <span
                  className="
                    text-sm
                    font-black
                    tracking-[0.28em]
                    sm:text-base
                  "
                  style={{
                    color: COLORS.navy,
                  }}
                >
                  {heroData.badge}
                </span>
              </motion.div>
            </Editable>

            {/* SCHOOL NAME - Increased size */}

            <Editable
              editMode={editMode}
              target={{
                type: "heroSchoolName",
              }}
              onEditTarget={onEditTarget}
              label="Edit school name"
            >
              <motion.p
                initial={{
                  opacity: 0,
                  x: -20,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  duration: 0.7,
                  delay: 0.08,
                }}
                className="
                  mt-8
                  text-base
                  font-black
                  tracking-[0.38em]
                  sm:text-lg
                "
                style={{
                  color: COLORS.gold,
                }}
              >
                {heroData.schoolName}
              </motion.p>
            </Editable>

            {/* =================================================
                MAIN TITLE - Increased size
            ================================================= */}

            <Editable
              editMode={editMode}
              target={{
                type: "heroTitle",
              }}
              onEditTarget={onEditTarget}
              label="Edit hero title"
            >
              <motion.h1
                initial={{
                  opacity: 0,
                  y: 25,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.9,
                  delay: 0.12,
                  ease: [
                    0.22,
                    1,
                    0.36,
                    1,
                  ],
                }}
                className="
                  mt-3
                  max-w-2xl
                  text-5xl
                  font-black
                  leading-[0.98]
                  tracking-[-0.045em]
                  sm:text-6xl
                  md:text-7xl
                  lg:text-[4.5rem]
                  xl:text-[5rem]
                "
                style={{
                  color: COLORS.navy,
                }}
              >
                {heroData.titleLine1}

                <br />

                <span
                  style={{
                    color: COLORS.gold,
                  }}
                >
                  {heroData.titleLine2}
                </span>
              </motion.h1>
            </Editable>

            {/* DESCRIPTION - Increased size */}

            <Editable
              editMode={editMode}
              target={{
                type: "heroDescription",
              }}
              onEditTarget={onEditTarget}
              label="Edit description"
            >
              <motion.p
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.7,
                  delay: 0.25,
                }}
                className="
                  mt-4
                  max-w-xl
                  text-lg
                  leading-8
                  sm:text-xl
                  sm:leading-9
                "
                style={{
                  color: COLORS.navySoft,
                }}
              >
                {heroData.description}
              </motion.p>
            </Editable>

            {/* =================================================
                DETAILS - Increased size
            ================================================= */}

            <Editable
              editMode={editMode}
              target={{
                type: "heroMeta",
              }}
              onEditTarget={onEditTarget}
              label="Edit school details"
            >
              <motion.div
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                transition={{
                  duration: 0.7,
                  delay: 0.3,
                }}
                className="
                  mt-4
                  flex
                  flex-wrap
                  items-center
                  gap-x-6
                  gap-y-2
                "
              >
                <span
                  className="
                    text-sm
                    font-black
                    tracking-[0.12em]
                    sm:text-base
                  "
                  style={{
                    color: COLORS.navySoft,
                  }}
                >
                  {heroData.establishedYear}
                </span>

                <span
                  className="
                    h-2
                    w-2
                    rounded-full
                  "
                  style={{
                    background: COLORS.gold,
                  }}
                />

                <span
                  className="
                    flex
                    items-center
                    gap-2
                    text-base
                    font-semibold
                    sm:text-lg
                  "
                  style={{
                    color: COLORS.navySoft,
                  }}
                >
                  <MapPin
                    className="h-5 w-5"
                    style={{
                      color: COLORS.gold,
                    }}
                  />

                  {heroData.subtitle}
                </span>
              </motion.div>
            </Editable>

            {/* =================================================
                BUTTONS - Increased size
            ================================================= */}

            <Editable
              editMode={editMode}
              target={{
                type: "heroButtons",
              }}
              onEditTarget={onEditTarget}
              label="Edit hero buttons"
            >
              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.7,
                  delay: 0.35,
                }}
                className="
                  mt-5
                  flex
                  flex-wrap
                  gap-4
                "
              >
                {/* PRIMARY */}

                <Link
                  to={safeLink(
                    heroData.primaryButtonLink,
                    "/admissions"
                  )}
                  onClick={(event) => {
                    if (editMode) {
                      event.preventDefault();
                    }
                  }}
                  className="
                    group
                    inline-flex
                    items-center
                    gap-3
                    rounded-full
                    px-8
                    py-4
                    text-base
                    font-black
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    sm:text-lg
                  "
                  style={{
                    color: COLORS.navy,
                    background: "linear-gradient(135deg,#D9AA32,#F4D77E)",
                    boxShadow: "0 14px 30px rgba(217,170,50,0.22)",
                  }}
                >
                  {heroData.primaryButtonText}

                  <span
                    className="
                      flex
                      h-8
                      w-8
                      items-center
                      justify-center
                      rounded-full
                    "
                    style={{
                      background: "rgba(255,255,255,0.55)",
                    }}
                  >
                    <ArrowRight
                      className="
                        h-5
                        w-5
                        transition-transform
                        duration-300
                        group-hover:translate-x-1
                      "
                    />
                  </span>
                </Link>

                {/* SECONDARY */}

                <Link
                  to={safeLink(
                    heroData.secondaryButtonLink,
                    "/about"
                  )}
                  onClick={(event) => {
                    if (editMode) {
                      event.preventDefault();
                    }
                  }}
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    bg-white/75
                    px-8
                    py-4
                    text-base
                    font-bold
                    shadow-sm
                    backdrop-blur-xl
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:bg-white
                    sm:text-lg
                  "
                  style={{
                    color: COLORS.navy,
                    borderColor: COLORS.border,
                  }}
                >
                  {heroData.secondaryButtonText}
                </Link>
              </motion.div>
            </Editable>

            {/* =================================================
                SMALL BOTTOM MESSAGE - MOVED UP TO FIT ABOVE
            ================================================= */}

            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                duration: 0.8,
                delay: 0.55,
              }}
              className="
                mt-6
                flex
                items-center
                gap-4
              "
            >
              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-full
                "
                style={{
                  background: COLORS.creamDark,
                  color: COLORS.gold,
                }}
              >
                <Sparkles className="h-5 w-5" />
              </div>

              <div>
                <p
                  className="
                    text-sm
                    font-black
                    uppercase
                    tracking-[0.2em]
                    sm:text-base
                  "
                  style={{
                    color: COLORS.navySoft,
                  }}
                >
                  A place to learn
                </p>

                <p
                  className="
                    mt-0.5
                    text-lg
                    font-bold
                    sm:text-xl
                  "
                  style={{
                    color: COLORS.navy,
                  }}
                >
                  A place to belong.
                </p>
              </div>
            </motion.div>
          </div>

          {/* =================================================
              RIGHT IMAGE - FIXED: No white gaps
          ================================================= */}

          <div
            className="
              relative
              min-h-[400px]
              sm:min-h-[500px]
              lg:min-h-[600px]
            "
          >
            {/* =============================================
                GOLD 3D RING
            ============================================= */}

            <motion.div
              className="
                absolute
                right-[-4%]
                top-[4%]
                h-[82%]
                w-[82%]
                rounded-[48%]
              "
              animate={{
                rotate: [8, 10, 8],
                y: [0, 8, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                border: "2px solid rgba(217,170,50,0.30)",
                background: "rgba(244,215,126,0.12)",
                boxShadow: "0 30px 70px rgba(217,170,50,0.12)",
              }}
            />

            {/* =============================================
                BLUE SHAPE
            ============================================= */}

            <div
              className="
                absolute
                bottom-[2%]
                left-[2%]
                h-[55%]
                w-[35%]
                rounded-[50%]
                blur-[1px]
              "
              style={{
                background: "rgba(244,215,126,0.55)",
                transform: "rotate(-18deg)",
              }}
            />

            {/* =============================================
                IMAGE - FIXED: No gaps, full coverage
            ============================================= */}

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.94,
                x: 30,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                x: 0,
              }}
              whileHover={{
                scale: 1.015,
              }}
              transition={{
                duration: 1,
                delay: 0.2,
                ease: [
                  0.22,
                  1,
                  0.36,
                  1,
                ],
              }}
              className="
                absolute
                inset-0
                overflow-hidden
              "
              style={{
                borderRadius: "48% 48% 42% 42% / 24% 24% 18% 18%",
                border: "7px solid rgba(255,255,255,0.92)",
                boxShadow: "0 45px 90px rgba(21,36,56,0.22), 0 18px 34px rgba(21,36,56,0.14), 0 4px 10px rgba(217,170,50,0.18)",
                background: COLORS.navy,
              }}
            >
              {/* IMAGE */}

              <AnimatePresence mode="wait">
                <motion.img
                  key={image}
                  src={image}
                  alt={`${heroData.schoolName} campus`}
                  className="
                    absolute
                    inset-0
                    h-full
                    w-full
                    object-cover
                  "
                  initial={{
                    opacity: 0,
                    scale: 1.08,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 1.03,
                  }}
                  transition={{
                    duration: 0.9,
                  }}
                />
              </AnimatePresence>

              {/* VERY LIGHT OVERLAY */}

              <div
                className="
                  absolute
                  inset-0
                  pointer-events-none
                "
                style={{
                  background: "linear-gradient(180deg, rgba(21,36,56,0) 50%, rgba(21,36,56,0.30) 100%)",
                }}
              />

              {/* =========================================
                  CAMERA BUTTON
              ========================================= */}

              <div
                className="
                  absolute
                  right-5
                  top-5
                  z-20
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-full
                "
                style={{
                  background: "rgba(255,255,255,0.76)",
                  color: COLORS.navy,
                  backdropFilter: "blur(14px)",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.10)",
                }}
              >
                <Camera className="h-5 w-5" />
              </div>

              {/* =========================================
                  ADMIN IMAGE BUTTON
              ========================================= */}

              {editMode && (
                <button
                  type="button"
                  onClick={() =>
                    onEditTarget({
                      type: "heroImage",
                    })
                  }
                  className="
                    absolute
                    right-20
                    top-5
                    z-30
                    flex
                    items-center
                    gap-2
                    rounded-full
                    bg-white
                    px-4
                    py-2.5
                    text-xs
                    font-black
                    text-[#152438]
                    shadow-xl
                    transition-transform
                    hover:scale-105
                  "
                >
                  <Camera className="h-4 w-4" />

                  Change Image
                </button>
              )}

              {/* =========================================
                  IMAGE CAPTION
              ========================================= */}

              <div
                className="
                  absolute
                  bottom-7
                  left-7
                  z-20
                  sm:bottom-9
                  sm:left-9
                "
              >
                <p
                  className="
                    text-[10px]
                    font-black
                    uppercase
                    tracking-[0.25em]
                    text-white
                  "
                >
                  {heroData.schoolName}
                </p>

                <p
                  className="
                    mt-1
                    text-xl
                    font-black
                    tracking-tight
                    text-white
                    sm:text-2xl
                  "
                >
                  A place to belong.
                </p>
              </div>

              {/* =========================================
                  SLIDER
              ========================================= */}

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={previousImage}
                    aria-label="Previous image"
                    className="
                      absolute
                      left-4
                      top-1/2
                      z-30
                      flex
                      h-10
                      w-10
                      -translate-y-1/2
                      items-center
                      justify-center
                      rounded-full
                      bg-white/85
                      text-[#152438]
                      shadow-lg
                      backdrop-blur-md
                      transition-all
                      hover:scale-110
                    "
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  <button
                    type="button"
                    onClick={nextImage}
                    aria-label="Next image"
                    className="
                      absolute
                      right-4
                      top-1/2
                      z-30
                      flex
                      h-10
                      w-10
                      -translate-y-1/2
                      items-center
                      justify-center
                      rounded-full
                      bg-white/85
                      text-[#152438]
                      shadow-lg
                      backdrop-blur-md
                      transition-all
                      hover:scale-110
                    "
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>

                  <div
                    className="
                      absolute
                      bottom-7
                      right-7
                      z-30
                      flex
                      items-center
                      gap-2
                      rounded-full
                      bg-[#152438]/35
                      px-3
                      py-2
                      backdrop-blur-md
                    "
                  >
                    {images.map(
                      (_, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() =>
                            setCurrentImage(
                              index
                            )
                          }
                          aria-label={`Show image ${
                            index + 1
                          }`}
                          className="
                            h-1.5
                            rounded-full
                            transition-all
                            duration-300
                          "
                          style={{
                            width:
                              currentImage ===
                              index
                                ? "25px"
                                : "7px",

                            background:
                              currentImage ===
                              index
                                ? COLORS.goldLight
                                : "rgba(255,255,255,0.70)",
                          }}
                        />
                      )
                    )}
                  </div>
                </>
              )}
            </motion.div>

            {/* =============================================
                FLOATING INFO PILL
            ============================================= */}

            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: [0, -7, 0],
              }}
              transition={{
                opacity: {
                  duration: 0.7,
                  delay: 0.8,
                },

                y: {
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
              className="
                absolute
                bottom-[5%]
                left-0
                z-40
                rounded-[22px]
                border
                bg-white/90
                px-5
                py-4
                shadow-xl
                backdrop-blur-xl
                sm:px-6
                sm:py-5
              "
              style={{
                borderColor: COLORS.border,
                boxShadow: "0 24px 48px rgba(21,36,56,0.16)",
              }}
            >
              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >
                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                  "
                  style={{
                    background: COLORS.creamDark,
                    color: COLORS.gold,
                  }}
                >
                  <Sparkles className="h-5 w-5" />
                </div>

                <div>
                  <p
                    className="
                      text-[9px]
                      font-black
                      uppercase
                      tracking-[0.18em]
                    "
                    style={{
                      color: COLORS.navySoft,
                    }}
                  >
                    Our Philosophy
                  </p>

                  <p
                    className="
                      mt-0.5
                      text-sm
                      font-black
                    "
                    style={{
                      color: COLORS.navy,
                    }}
                  >
                    Learn • Lead • Serve
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ===================================================
          BOTTOM SCROLL INDICATOR
      =================================================== */}

      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          delay: 1.2,
        }}
        className="
          absolute
          bottom-5
          left-1/2
          hidden
          -translate-x-1/2
          items-center
          gap-2
          lg:flex
        "
      >
        <div
          className="
            h-1.5
            w-1.5
            rounded-full
          "
          style={{
            background: COLORS.gold,
          }}
        />

        <span
          className="
            text-[9px]
            font-black
            uppercase
            tracking-[0.3em]
          "
          style={{
            color: COLORS.navySoft,
          }}
        >
          Discover {heroData.schoolName.split(" ")[0]}
        </span>

        <div
          className="
            h-px
            w-12
          "
          style={{
            background: "rgba(21,36,56,0.15)",
          }}
        />
      </motion.div>
    </section>
  );
}

export default Hero;
export { defaultHeroData, mergeHeroData };