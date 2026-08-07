// Hero.jsx
import { useEffect, useState } from "react";
import api from "../../lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Camera,
  Image as ImageIcon,
  Pencil,
  Sparkles,
  School,
  Star,
} from "lucide-react";

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
  gold: "#C9A84C",
  goldLight: "#E8D5A3",
  goldDark: "#B8960F",
  navy: "#0A1628",
  gradient1: "linear-gradient(135deg, #1E3A5F 0%, #2D6A4F 100%)",
  gradient2: "linear-gradient(135deg, #E9C46A 0%, #F4A261 100%)",
  gradient3: "linear-gradient(135deg, #2D6A4F 0%, #1E3A5F 100%)",
  gradientGold: "linear-gradient(135deg, #C9A84C 0%, #E8D5A3 50%, #C9A84C 100%)",
};

// Hardcoded St. Mary's style school image
const DEFAULT_HERO_IMAGE = "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1920&q=80";

export const defaultHeroData = {
  badge: "Wisdom is Divine",
  schoolName: "SMRITI SCHOOL",
  titleLine1: "Smriti School",
  establishedYear: "ESTABLISHED 2046 BS",
  subtitle: "Basudev Marga, Hetauda-2",
  description:
    "Smriti School blends academic discipline, digital learning, creativity, sports, and values for students from Play Group to Grade 10.",
  image: DEFAULT_HERO_IMAGE,
  images: [DEFAULT_HERO_IMAGE],
  imageAdjustments: {},
  primaryButtonText: "Start Admission",
  primaryButtonLink: "/admissions",
  secondaryButtonText: "Explore Facilities",
  secondaryButtonLink: "/facilities",
};

export function mergeHeroData(saved = {}) {
  const merged = {
    ...defaultHeroData,
    ...(saved || {}),
  };
  const savedImages = Array.isArray(saved?.images)
    ? saved.images
    : Array.isArray(merged.images)
    ? merged.images
    : [DEFAULT_HERO_IMAGE];
  const cleanImages = Array.from(
    new Set(
      savedImages
        .map((item) => String(item || "").trim())
        .filter((item) => item)
    )
  );
  return {
    ...merged,
    image: cleanImages[0] || DEFAULT_HERO_IMAGE,
    images: cleanImages.length > 0 ? cleanImages : [DEFAULT_HERO_IMAGE],
    imageAdjustments: {},
  };
}

function safeLink(link, fallback) {
  const clean = String(link || "").trim();
  return clean.startsWith("/") ? clean : fallback;
}

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
      className="absolute -top-2 -right-2 z-[80] opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 rounded-full w-8 h-8 flex items-center justify-center shadow-lg"
      style={{
        background: palette.gradient2,
        color: palette.dark,
        border: `2px solid ${palette.white}`,
      }}
      title={label}
    >
      <Icon className="w-3.5 h-3.5" />
    </button>
  );
}

function EditableWrap({ editMode, target, onEditTarget, icon = Pencil, label = "Edit", className = "", children }) {
  if (!editMode) return children;
  return (
    <div className={`relative group ${className}`}>
      {children}
      <EditIconButton editMode={editMode} target={target} onEditTarget={onEditTarget} icon={icon} label={label} />
    </div>
  );
}

function Hero({ editMode = false, contentOverride = null, onEditTarget = () => {} }) {
  const [heroData, setHeroData] = useState(() =>
    mergeHeroData(contentOverride || defaultHeroData)
  );

  // ── SLIDESHOW LOGIC ──
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (contentOverride) {
      setHeroData(mergeHeroData(contentOverride));
      return;
    }
    let alive = true;
    const loadHeroContent = async () => {
      try {
        const res = await api.get("/api/site-content/home");
        if (!alive) return;
        const hero = res.data.data.content.hero;
        setHeroData(mergeHeroData(hero));
      } catch (error) {
        console.error("Hero content load error:", error);
        if (alive) {
          setHeroData(mergeHeroData(defaultHeroData));
        }
      }
    };
    loadHeroContent();
    return () => { alive = false; };
  }, [contentOverride]);

  // Auto-rotate images every 3 seconds
  useEffect(() => {
    if (!heroData?.images || heroData.images.length < 2) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % heroData.images.length
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [heroData?.images]);

  // Fallback to single image if array is empty
  const heroImages = heroData.images?.length > 0 ? heroData.images : [DEFAULT_HERO_IMAGE];
  const currentImage = heroImages[currentImageIndex % heroImages.length] || DEFAULT_HERO_IMAGE;

  return (
    <section 
      id="home" 
      className="relative min-h-[80vh] flex items-center overflow-hidden"
      style={{
        background: palette.navy,
      }}
    >
      {/* Background Image Slideshow - Lighter and more visible */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImage}
            src={currentImage}
            alt="Smriti School Campus"
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            style={{
              filter: "brightness(0.55) saturate(1.1) contrast(1)",
            }}
          />
        </AnimatePresence>
        
        {/* Lighter Gradient Overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(135deg, rgba(10,22,40,0.65) 0%, rgba(10,22,40,0.3) 40%, rgba(10,22,40,0.5) 100%),
              radial-gradient(circle at 70% 30%, rgba(201,168,76,0.06) 0%, transparent 50%)
            `,
          }}
        />
      </div>

      {/* Content - Left aligned like original */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-5 sm:px-8 py-12 md:py-20">
        <div className="max-w-3xl">
          {/* Badge - Wisdom is Divine */}
          <EditableWrap
            editMode={editMode}
            target={{ type: "heroBadge" }}
            onEditTarget={onEditTarget}
            label="Edit badge"
            className="inline-block"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6"
              style={{
                background: "rgba(201, 168, 76, 0.15)",
                border: "1px solid rgba(201, 168, 76, 0.25)",
                backdropFilter: "blur(10px)",
              }}
            >
              <Star className="w-3.5 h-3.5" style={{ color: palette.gold }} />
              <span className="text-xs font-semibold tracking-wide" style={{ color: palette.goldLight }}>
                {heroData.badge || "Wisdom is Divine"}
              </span>
            </motion.div>
          </EditableWrap>

          {/* School Name */}
          <EditableWrap
            editMode={editMode}
            target={{ type: "heroTitle" }}
            onEditTarget={onEditTarget}
            label="Edit school name"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
            >
              {/* School Name Label */}
              <div className="flex items-center gap-4 mb-3">
                <div 
                  className="w-10 h-0.5"
                  style={{ background: palette.gold }}
                />
                <span 
                  className="text-[10px] md:text-xs font-bold tracking-[0.25em] uppercase"
                  style={{ color: palette.gold }}
                >
                  {heroData.schoolName || "SMRITI SCHOOL"}
                </span>
                <div 
                  className="flex-1 h-0.5"
                  style={{ background: "rgba(201, 168, 76, 0.2)" }}
                />
              </div>
              
              <h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.05]"
                style={{
                  background: `linear-gradient(135deg, ${palette.gold} 0%, ${palette.goldLight} 40%, ${palette.gold} 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontFamily: "var(--font-display)",
                  letterSpacing: "-0.02em",
                  textShadow: "0 2px 20px rgba(0,0,0,0.2)",
                }}
              >
                {heroData.titleLine1}
              </h1>

              {/* Established Year */}
              <div className="flex items-center gap-3 mt-3">
                <div 
                  className="h-px w-8 md:w-12"
                  style={{ background: "rgba(201, 168, 76, 0.3)" }}
                />
                <span 
                  className="text-xs md:text-sm font-semibold tracking-[0.15em]"
                  style={{ color: palette.goldLight }}
                >
                  {heroData.establishedYear || "ESTABLISHED 2046 BS"}
                </span>
                <div 
                  className="h-px flex-1"
                  style={{ background: "rgba(201, 168, 76, 0.1)" }}
                />
              </div>
            </motion.div>
          </EditableWrap>

          {/* Subtitle */}
          <EditableWrap
            editMode={editMode}
            target={{ type: "heroSubtitle" }}
            onEditTarget={onEditTarget}
            label="Edit subtitle"
          >
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-base md:text-lg font-medium mt-4 mb-3"
              style={{ color: "rgba(255,255,255,0.8)" }}
            >
              {heroData.subtitle || "Basudev Marga, Hetauda-2"}
            </motion.p>
          </EditableWrap>

          {/* Description */}
          <EditableWrap
            editMode={editMode}
            target={{ type: "heroDescription" }}
            onEditTarget={onEditTarget}
            label="Edit description"
          >
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-sm md:text-base max-w-xl leading-relaxed mb-8"
              style={{ color: "rgba(255,255,255,0.65)" }}
            >
              {heroData.description}
            </motion.p>
          </EditableWrap>

          {/* Buttons */}
          <EditableWrap
            editMode={editMode}
            target={{ type: "heroButtons" }}
            onEditTarget={onEditTarget}
            label="Edit buttons"
          >
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                to={safeLink(heroData.primaryButtonLink, "/admissions")}
                onClick={(e) => {
                  if (editMode) e.preventDefault();
                }}
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:gap-3 hover:-translate-y-0.5"
                style={{
                  color: palette.navy,
                  background: `linear-gradient(135deg, ${palette.gold} 0%, ${palette.goldLight} 100%)`,
                  boxShadow: "0 8px 32px rgba(201, 168, 76, 0.35)",
                }}
              >
                {heroData.primaryButtonText || "Start Admission"}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to={safeLink(heroData.secondaryButtonLink, "/facilities")}
                onClick={(e) => {
                  if (editMode) e.preventDefault();
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20"
                style={{
                  color: palette.white,
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  backdropFilter: "blur(10px)",
                }}
              >
                {heroData.secondaryButtonText || "Explore Facilities"}
              </Link>
            </motion.div>
          </EditableWrap>
        </div>
      </div>

      {/* Bottom gradient fade - lighter */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-20 z-5 pointer-events-none"
        style={{
          background: "linear-gradient(to top, rgba(10,22,40,0.4) 0%, transparent 100%)",
        }}
      />

      {/* Edit mode indicator */}
      {editMode && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20">
          <EditableWrap
            editMode={editMode}
            target={{ type: "heroImage" }}
            onEditTarget={onEditTarget}
            icon={Camera}
            label="Change hero background image"
            className="inline-block"
          >
            <div 
              className="px-4 py-2 rounded-xl text-sm font-semibold backdrop-blur-sm"
              style={{
                background: "rgba(255,255,255,0.15)",
                color: palette.white,
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <Camera className="w-4 h-4 inline mr-2" />
              Change Background Image
            </div>
          </EditableWrap>
        </div>
      )}

      {/* Gold corner accents - decorative */}
      <div 
        className="absolute top-0 left-0 w-16 h-16 pointer-events-none"
        style={{
          borderTop: `2px solid rgba(201, 168, 76, 0.12)`,
          borderLeft: `2px solid rgba(201, 168, 76, 0.12)`,
          borderTopLeftRadius: "2px",
        }}
      />
      <div 
        className="absolute top-0 right-0 w-16 h-16 pointer-events-none"
        style={{
          borderTop: `2px solid rgba(201, 168, 76, 0.12)`,
          borderRight: `2px solid rgba(201, 168, 76, 0.12)`,
          borderTopRightRadius: "2px",
        }}
      />
      <div 
        className="absolute bottom-0 left-0 w-16 h-16 pointer-events-none"
        style={{
          borderBottom: `2px solid rgba(201, 168, 76, 0.12)`,
          borderLeft: `2px solid rgba(201, 168, 76, 0.12)`,
          borderBottomLeftRadius: "2px",
        }}
      />
      <div 
        className="absolute bottom-0 right-0 w-16 h-16 pointer-events-none"
        style={{
          borderBottom: `2px solid rgba(201, 168, 76, 0.12)`,
          borderRight: `2px solid rgba(201, 168, 76, 0.12)`,
          borderBottomRightRadius: "2px",
        }}
      />
    </section>
  );
}

export { Hero };
export default Hero;