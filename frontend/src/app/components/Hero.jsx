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
  primaryButtonText: "Start Admission",
  primaryButtonLink: "/admissions",
  secondaryButtonText: "Explore School",
  secondaryButtonLink: "/about",
};

/* =========================================================
   MERGE DATA
========================================================= */

export function mergeHeroData(data = {}) {
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

        const hero = response?.data?.data?.content?.hero;

        if (hero) {
          setHeroData(mergeHeroData(hero));
        }
      } catch (error) {
        console.error("Hero loading error:", error);

        if (mounted) {
          setHeroData(mergeHeroData(defaultHeroData));
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
          (previous + 1) % heroData.images.length
      );
    }, 5500);

    return () => clearInterval(interval);
  }, [heroData.images]);

  const images =
    heroData.images?.length > 0
      ? heroData.images
      : [DEFAULT_IMAGE];

  const image =
    images[currentImage % images.length] || DEFAULT_IMAGE;

  /* =======================================================
     IMAGE CONTROLS
  ======================================================= */

  const previousImage = () => {
    setCurrentImage((previous) =>
      previous === 0 ? images.length - 1 : previous - 1
    );
  };

  const nextImage = () => {
    setCurrentImage((previous) => (previous + 1) % images.length);
  };

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <section className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-[#FFFDF8] flex items-center">
      {/* Background Decorative Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Warm Glow */}
        <div
          className="absolute -left-32 top-24 h-[420px] w-[420px] rounded-full blur-3xl"
          style={{ background: "rgba(244,215,126,0.18)" }}
        />

        {/* Blue Glow */}
        <div
          className="absolute -right-32 bottom-10 h-[500px] w-[500px] rounded-full blur-3xl"
          style={{ background: "rgba(221,239,243,0.65)" }}
        />

        {/* Subtle Grid */}
        <div
          className="absolute inset-0 opacity-[0.16]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(21,36,56,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(21,36,56,0.05) 1px, transparent 1px)
            `,
            backgroundSize: "70px 70px",
            maskImage: "linear-gradient(to bottom, black 0%, transparent 75%)",
          }}
        />
      </div>

      {/* Decorative Gold Oval */}
      <motion.div
        className="absolute -right-36 top-12 hidden h-[420px] w-[420px] rounded-[50%] lg:block"
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
          border: "1px solid rgba(217,170,50,0.18)",
          background: "rgba(244,215,126,0.08)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8)",
        }}
      />

      {/* Main Container */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8 lg:py-20 xl:px-12">
        <div className="grid w-full items-center gap-8 lg:grid-cols-12 lg:gap-10 xl:gap-16">
          
          {/* ================= LEFT SIDE ================= */}
          <div className="relative z-20 lg:col-span-6 xl:col-span-7">
            
            {/* BADGE */}
            <Editable
              editMode={editMode}
              target={{ type: "heroBadge" }}
              onEditTarget={onEditTarget}
              label="Edit hero badge"
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                className="inline-flex items-center gap-2 rounded-full border bg-white/80 px-4 py-2.5 shadow-sm backdrop-blur-xl"
                style={{ borderColor: COLORS.border }}
              >
                <Sparkles className="h-4 w-4" style={{ color: COLORS.gold }} />
                <span
                  className="text-[10px] font-black tracking-[0.28em] uppercase"
                  style={{ color: COLORS.navy }}
                >
                  {heroData.badge}
                </span>
              </motion.div>
            </Editable>

            {/* SCHOOL NAME */}
            <Editable
              editMode={editMode}
              target={{ type: "heroSchoolName" }}
              onEditTarget={onEditTarget}
              label="Edit school name"
            >
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.08 }}
                className="mt-6 text-xs font-black tracking-[0.28em] uppercase"
                style={{ color: COLORS.gold }}
              >
                {heroData.schoolName}
              </motion.p>
            </Editable>

            {/* MAIN TITLE */}
            <Editable
              editMode={editMode}
              target={{ type: "heroTitle" }}
              onEditTarget={onEditTarget}
              label="Edit hero title"
            >
              <motion.h1
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="mt-4 max-w-2xl text-[2.8rem] font-black leading-[1.05] tracking-tight sm:text-[3.8rem] lg:text-[4.5rem] xl:text-[5rem]"
                style={{ color: COLORS.navy }}
              >
                {heroData.titleLine1}
                <br />
                <span style={{ color: COLORS.gold }}>
                  {heroData.titleLine2}
                </span>
              </motion.h1>
            </Editable>

            {/* DESCRIPTION */}
            <Editable
              editMode={editMode}
              target={{ type: "heroDescription" }}
              onEditTarget={onEditTarget}
              label="Edit description"
            >
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.25 }}
                className="mt-6 max-w-xl text-base leading-7 sm:text-lg sm:leading-8 font-normal"
                style={{ color: COLORS.navySoft }}
              >
                {heroData.description}
              </motion.p>
            </Editable>

            {/* META DETAILS */}
            <Editable
              editMode={editMode}
              target={{ type: "heroMeta" }}
              onEditTarget={onEditTarget}
              label="Edit school details"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2"
              >
                <span
                  className="text-xs font-black tracking-[0.12em] uppercase"
                  style={{ color: COLORS.navySoft }}
                >
                  {heroData.establishedYear}
                </span>

                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: COLORS.gold }}
                />

                <span
                  className="flex items-center gap-1.5 text-xs font-semibold"
                  style={{ color: COLORS.navySoft }}
                >
                  <MapPin className="h-4 w-4" style={{ color: COLORS.gold }} />
                  {heroData.subtitle}
                </span>
              </motion.div>
            </Editable>

            {/* BUTTONS */}
            <Editable
              editMode={editMode}
              target={{ type: "heroButtons" }}
              onEditTarget={onEditTarget}
              label="Edit hero buttons"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.35 }}
                className="mt-8 flex flex-wrap items-center gap-4"
              >
                {/* PRIMARY */}
                <Link
                  to={safeLink(heroData.primaryButtonLink, "/admissions")}
                  onClick={(event) => {
                    if (editMode) event.preventDefault();
                  }}
                  className="group inline-flex items-center gap-3 rounded-full px-7 py-3.5 text-sm font-black transition-all duration-300 hover:-translate-y-1"
                  style={{
                    color: COLORS.navy,
                    background: "linear-gradient(135deg,#D9AA32,#F4D77E)",
                    boxShadow: "0 14px 30px rgba(217,170,50,0.22)",
                  }}
                >
                  {heroData.primaryButtonText}
                  <span
                    className="flex h-7 w-7 items-center justify-center rounded-full"
                    style={{ background: "rgba(255,255,255,0.55)" }}
                  >
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>

                {/* SECONDARY */}
                <Link
                  to={safeLink(heroData.secondaryButtonLink, "/about")}
                  onClick={(event) => {
                    if (editMode) event.preventDefault();
                  }}
                  className="inline-flex items-center gap-2 rounded-full border bg-white/70 px-7 py-3.5 text-sm font-black backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white"
                  style={{
                    color: COLORS.navy,
                    borderColor: COLORS.border,
                  }}
                >
                  {heroData.secondaryButtonText}
                </Link>
              </motion.div>
            </Editable>

            {/* BOTTOM MESSAGE */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.55 }}
              className="mt-10 flex items-center gap-3"
            >
              <div
                className="flex h-9 w-9 items-center justify-center rounded-full"
                style={{ background: COLORS.creamDark, color: COLORS.gold }}
              >
                <Sparkles className="h-4 w-4" />
              </div>

              <div>
                <p
                  className="text-[10px] font-black uppercase tracking-[0.25em]"
                  style={{ color: COLORS.navySoft }}
                >
                  A place to learn
                </p>
                <p
                  className="mt-0.5 text-sm font-bold"
                  style={{ color: COLORS.navy }}
                >
                  A place to belong.
                </p>
              </div>
            </motion.div>
          </div>

          {/* ================= RIGHT SIDE IMAGE ================= */}
          <div className="relative min-h-[420px] sm:min-h-[500px] lg:col-span-6 xl:col-span-5">
            
            {/* Gold 3D Ring */}
            <motion.div
              className="absolute right-[-4%] top-[4%] h-[92%] w-[82%] rounded-[48%]"
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

            {/* Blue Shape */}
            <div
              className="absolute bottom-[2%] left-[2%] h-[80%] w-[76%] rounded-[50%] blur-[1px]"
              style={{
                background: "rgba(221,239,243,0.85)",
                transform: "rotate(-18deg)",
              }}
            />

            {/* Main Hero Photo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, x: 30 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-y-5 left-[7%] right-[7%] overflow-hidden"
              style={{
                borderRadius: "48% 48% 42% 42% / 24% 24% 18% 18%",
                border: "7px solid rgba(255,255,255,0.92)",
                boxShadow: "0 35px 80px rgba(21,36,56,0.16), 0 10px 25px rgba(21,36,56,0.08)",
                background: COLORS.navy,
              }}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={image}
                  src={image}
                  alt="Red Rose School campus"
                  className="absolute inset-0 h-full w-full object-cover"
                  initial={{ opacity: 0, scale: 1.08 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.03 }}
                  transition={{ duration: 0.9 }}
                />
              </AnimatePresence>

              {/* Light Gradient Overlay */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "linear-gradient(180deg, rgba(21,36,56,0) 50%, rgba(21,36,56,0.30) 100%)",
                }}
              />

              {/* Camera Icon */}
              <div
                className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full"
                style={{
                  background: "rgba(255,255,255,0.76)",
                  color: COLORS.navy,
                  backdropFilter: "blur(14px)",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.10)",
                }}
              >
                <Camera className="h-5 w-5" />
              </div>

              {/* Admin Change Image Button */}
              {editMode && (
                <button
                  type="button"
                  onClick={() => onEditTarget({ type: "heroImage" })}
                  className="absolute right-20 top-5 z-40 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/90 px-4 py-2 text-xs font-black text-[#152438] shadow-lg backdrop-blur-md transition-transform hover:scale-105"
                >
                  <Camera className="h-4 w-4" /> Change Image
                </button>
              )}

              {/* Image Caption */}
              <div className="absolute bottom-7 left-7 sm:bottom-9 sm:left-9">
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-white">
                  RED ROSE SCHOOL
                </p>
                <p className="mt-1 text-xl font-black tracking-tight text-white sm:text-2xl">
                  A place to belong.
                </p>
              </div>

              {/* Slider Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={previousImage}
                    aria-label="Previous image"
                    className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-[#152438] shadow-lg backdrop-blur-md transition-all hover:scale-110"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  <button
                    type="button"
                    onClick={nextImage}
                    aria-label="Next image"
                    className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-[#152438] shadow-lg backdrop-blur-md transition-all hover:scale-110"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>

                  {/* Indicator Dots */}
                  <div className="absolute bottom-7 right-7 flex items-center gap-1.5 rounded-full bg-black/35 px-3 py-2 backdrop-blur-md">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setCurrentImage(index)}
                        aria-label={`Show image ${index + 1}`}
                        className="h-1.5 rounded-full transition-all"
                        style={{
                          width: currentImage === index ? "25px" : "7px",
                          background: currentImage === index ? COLORS.goldLight : "rgba(255,255,255,0.70)",
                        }}
                      />
                    ))}
                  </div>
                </>
              )}
            </motion.div>

            {/* Floating Info Pill */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: [0, -7, 0] }}
              transition={{
                opacity: { duration: 0.7, delay: 0.8 },
                y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
              }}
              className="absolute bottom-[5%] left-0 rounded-2xl border bg-white/90 px-5 py-4 shadow-xl backdrop-blur-xl sm:px-6 sm:py-5"
              style={{ borderColor: COLORS.border }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full"
                  style={{ background: COLORS.creamDark, color: COLORS.gold }}
                >
                  <Sparkles className="h-5 w-5" />
                </div>

                <div>
                  <p
                    className="text-[9px] font-black uppercase tracking-[0.24em]"
                    style={{ color: COLORS.navySoft }}
                  >
                    Our Philosophy
                  </p>
                  <p
                    className="mt-0.5 text-sm font-black"
                    style={{ color: COLORS.navy }}
                  >
                    Learn • Lead • Serve
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 items-center gap-2 lg:flex"
      >
        <div
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: COLORS.gold }}
        />
        <span
          className="text-[9px] font-black uppercase tracking-[0.3em]"
          style={{ color: COLORS.navySoft }}
        >
          Discover Red Rose
        </span>
        <div
          className="h-px w-12"
          style={{ background: "rgba(21,36,56,0.15)" }}
        />
      </motion.div>
    </section>
  );
}

export default Hero;