// Gallery.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import api from "../../lib/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Sparkles,
  X,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Download,
  ZoomIn,
  ZoomOut,
  Grid,
  BookOpen,
  Calendar,
  Award,
  Heart,
  Star,
  Trophy,
  Clock,
  Users,
  School,
} from "lucide-react";

// ============ PALETTE ============
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

const DEFAULT_GALLERY_CATEGORIES = ["Classroom", "Events", "Certificate"];

const fallbackCategoryDescriptions = {
  Classroom:
    "Classroom moments show students learning, discussing, writing, presenting, and growing through daily academic activities.",
  Events:
    "School events highlight celebrations, programs, competitions, cultural activities, student participation, and community moments.",
  Certificate:
    "Certificates and awards recognize student achievement, participation, discipline, excellence, and school accomplishments.",
};

const fallbackSubcategories = {
  Events: [
    {
      id: "annual-program",
      name: "Annual Program",
      description:
        "Photos from annual programs, performances, celebrations, and school-wide events.",
      visible: true,
    },
    {
      id: "sports-events",
      name: "Sports Events",
      description:
        "Photos from sports competitions, games, student teamwork, and athletic participation.",
      visible: true,
    },
  ],
  Certificate: [
    {
      id: "student-certificates",
      name: "Student Certificates",
      description:
        "Certificates awarded to students for academic, creative, sports, and extracurricular achievements.",
      visible: true,
    },
    {
      id: "school-awards",
      name: "School Awards",
      description:
        "Awards and recognitions received by the school, staff, and student groups.",
      visible: true,
    },
  ],
};

const defaultGalleryContent = {
  badge: "Gallery",
  title: "School in Action",
  highlightedText: "in Action",
  description:
    "Explore classroom learning, school events, certificates, achievements, and student life at Smriti Secondary English Boarding School.",
  categories: DEFAULT_GALLERY_CATEGORIES,
  categoryDescriptions: fallbackCategoryDescriptions,
  subcategories: fallbackSubcategories,
  images: [],
};

// ============ HELPERS ============
function normalizeCategories(categories = null) {
  const hasSavedCategories = Array.isArray(categories);
  const cleaned = (hasSavedCategories ? categories : DEFAULT_GALLERY_CATEGORIES)
    .map((item) => String(item || "").trim())
    .filter(Boolean)
    .filter((item) => item.toLowerCase() !== "all");
  const uniqueCategories = Array.from(new Set(cleaned));
  return uniqueCategories.length > 0 ? uniqueCategories : [...DEFAULT_GALLERY_CATEGORIES];
}

function normalizeImageCategory(category, categories = []) {
  const clean = String(category || "").trim();
  const validCategories = normalizeCategories(categories);
  if (validCategories.includes(clean)) return clean;
  const legacyMap = { Sports: "Events", ECA: "Events", Facilities: "Classroom" };
  return legacyMap[clean] || validCategories[0] || "Classroom";
}

function normalizeCategoryDescriptions(descriptions = {}, categories = []) {
  return normalizeCategories(categories).reduce((acc, category) => {
    acc[category] = descriptions?.[category] || fallbackCategoryDescriptions[category] || "";
    return acc;
  }, {});
}

function normalizeSubcategories(subcategories = {}, categories = null) {
  const parentCategories = normalizeCategories(categories);
  return parentCategories.reduce((acc, category) => {
    const source = Array.isArray(subcategories?.[category])
      ? subcategories[category]
      : fallbackSubcategories[category] || [];
    acc[category] = source
      .map((item, index) => {
        const name = typeof item === "string" ? item : String(item?.name || "").trim();
        if (!name) return null;
        return {
          id: item?.id || `${category.toLowerCase()}-${index}-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
          name,
          description: typeof item === "string" ? "" : item?.description || `Photos and memories from ${name.toLowerCase()}.`,
          visible: item?.visible !== false,
        };
      })
      .filter(Boolean);
    return acc;
  }, {});
}

function mergeGalleryContent(saved = {}) {
  const categories = normalizeCategories(saved.categories);
  const categoryDescriptions = normalizeCategoryDescriptions(saved.categoryDescriptions, categories);
  const subcategories = normalizeSubcategories(saved.subcategories, categories);
  return {
    ...defaultGalleryContent,
    ...saved,
    categories,
    categoryDescriptions,
    subcategories,
    images: Array.isArray(saved.images)
      ? saved.images.map((image) => ({
          ...image,
          category: normalizeImageCategory(image.category, categories),
          subcategory: image.subcategory || "",
          images: Array.isArray(image.images) && image.images.length > 0 ? image.images : image.image ? [image.image] : [],
        }))
      : [],
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

function getImageUrls(item) {
  if (Array.isArray(item.images) && item.images.length > 0) return item.images.filter(Boolean);
  return item.image ? [item.image] : [];
}

function collectAlbumPhotos(items, fallbackCategory, fallbackTitle) {
  const seen = new Set();
  const photos = [];
  items.forEach((item) => {
    getImageUrls(item).forEach((url) => {
      if (!url || seen.has(url)) return;
      seen.add(url);
      photos.push({
        url,
        title: item.title || fallbackTitle,
        date: item.date || "School Activity",
        category: fallbackCategory,
        subcategory: item.subcategory || "",
      });
    });
  });
  return photos;
}

function SmoothLoadedImage({ src, alt, className = "", style = {}, fallback = null, ...props }) {
  const cleanSrc = String(src || "").trim();
  const [displaySrc, setDisplaySrc] = useState(cleanSrc);
  const [waitingForSrc, setWaitingForSrc] = useState("");

  useEffect(() => {
    if (!cleanSrc) { setDisplaySrc(""); setWaitingForSrc(""); return undefined; }
    if (cleanSrc === displaySrc) { setWaitingForSrc(""); return undefined; }
    let alive = true;
    const image = new Image();
    setWaitingForSrc(cleanSrc);
    image.onload = () => { if (!alive) return; setDisplaySrc(cleanSrc); setWaitingForSrc(""); };
    image.onerror = () => { if (!alive) return; setWaitingForSrc(""); };
    image.src = cleanSrc;
    if (image.complete) { setDisplaySrc(cleanSrc); setWaitingForSrc(""); }
    return () => { alive = false; };
  }, [cleanSrc, displaySrc]);

  if (!displaySrc) return fallback;
  return (
    <img
      {...props}
      src={displaySrc}
      alt={alt}
      className={className}
      style={{ ...style, opacity: waitingForSrc ? 0.96 : 1, transition: style?.transition || "opacity 220ms ease-out, transform 700ms ease-out" }}
    />
  );
}

function preloadImage(url = "") {
  const cleanUrl = String(url || "").trim();
  if (!cleanUrl) return;
  const image = new Image();
  image.src = cleanUrl;
}

function buildSingleCategoryAlbum(content, category) {
  const visibleImages = (content.images || []).filter((item) => item.visible !== false);
  const categoryItems = visibleImages.filter((item) => normalizeImageCategory(item.category, content.categories) === category);
  const photos = collectAlbumPhotos(categoryItems, category, category);
  const cover = categoryItems.find((item) => item.image)?.image || photos[0]?.url || "";
  return {
    category,
    subcategory: "",
    title: category,
    date: categoryItems[0]?.date || "School Gallery",
    description: content.categoryDescriptions?.[category] || fallbackCategoryDescriptions[category] || "Explore school moments from this category.",
    cover,
    photos,
    total: photos.length,
  };
}

function buildMainCategoryAlbums(content) {
  return normalizeCategories(content.categories).map((category) => buildSingleCategoryAlbum(content, category));
}

function buildSubcategoryAlbums(content, parentCategory) {
  const visibleImages = (content.images || []).filter((item) => item.visible !== false);
  const parentItems = visibleImages.filter((item) => normalizeImageCategory(item.category, content.categories) === parentCategory);
  const subcategoryList = normalizeSubcategories(content.subcategories, content.categories)[parentCategory] || [];
  if (subcategoryList.length === 0) return [buildSingleCategoryAlbum(content, parentCategory)];
  const albums = subcategoryList.filter((sub) => sub.visible !== false).map((sub) => {
    const subItems = parentItems.filter((item) => String(item.subcategory || "").trim() === sub.name);
    const photos = collectAlbumPhotos(subItems, parentCategory, sub.name);
    const cover = subItems.find((item) => item.image)?.image || photos[0]?.url || "";
    return {
      category: parentCategory,
      subcategory: sub.name,
      title: sub.name,
      date: subItems[0]?.date || parentCategory,
      description: sub.description || `Photos and memories from ${sub.name.toLowerCase()}.`,
      cover,
      photos,
      total: photos.length,
    };
  });
  const uncategorizedItems = parentItems.filter((item) => !String(item.subcategory || "").trim());
  if (uncategorizedItems.length > 0) {
    const photos = collectAlbumPhotos(uncategorizedItems, parentCategory, parentCategory);
    albums.push({
      category: parentCategory,
      subcategory: "",
      title: `General ${parentCategory}`,
      date: uncategorizedItems[0]?.date || parentCategory,
      description: content.categoryDescriptions?.[parentCategory] || fallbackCategoryDescriptions[parentCategory],
      cover: uncategorizedItems.find((item) => item.image)?.image || photos[0]?.url || "",
      photos,
      total: photos.length,
    });
  }
  return albums;
}

function buildCategoryAlbums(content, activeCategory) {
  if (activeCategory === "All") return buildMainCategoryAlbums(content);
  const subcategoryList = normalizeSubcategories(content.subcategories, content.categories)[activeCategory] || [];
  if (subcategoryList.length > 0) return buildSubcategoryAlbums(content, activeCategory);
  return [buildSingleCategoryAlbum(content, activeCategory)];
}

// ============ MODERN GALLERY CARD ============
function ModernGalleryCard({ album, index, onClick }) {
  const [currentImage, setCurrentImage] = useState(0);
  const photoUrls = useMemo(() => Array.isArray(album.photos) ? album.photos.map((photo) => photo?.url).filter(Boolean) : [], [album.photos]);
  const currentImageUrl = photoUrls.length > 0 ? photoUrls[currentImage] || album.cover : album.cover;

  useEffect(() => {
    setCurrentImage(0);
    const firstFewImages = photoUrls.slice(0, 3);
    firstFewImages.forEach((url) => preloadImage(url));
  }, [album.cover, photoUrls.join("|")]);

  useEffect(() => {
    if (photoUrls.length <= 1) return undefined;
    const interval = window.setInterval(() => {
      setCurrentImage((prev) => {
        const next = (prev + 1) % photoUrls.length;
        preloadImage(photoUrls[next]);
        return next;
      });
    }, 4000);
    return () => window.clearInterval(interval);
  }, [photoUrls.join("|")]);

  const tintColors = [palette.primary, palette.secondary, palette.accent2, "#8B5CF6", "#14B8A6"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className="group relative overflow-hidden rounded-2xl bg-white border transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
      style={{
        borderColor: `${tintColors[index % tintColors.length]}25`,
        boxShadow: "0 4px 22px rgba(0,0,0,0.04)",
      }}
    >
      {/* Gradient top bar */}
      <div
        className="h-1.5 w-full transition-all duration-300 group-hover:h-2"
        style={{ background: `linear-gradient(90deg, ${tintColors[index % tintColors.length]}, ${palette.accent})` }}
      />

      <div className="p-5">
        {/* Category badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span
            className="px-3 py-1 rounded-full text-xs font-bold"
            style={{
              background: `${tintColors[index % tintColors.length]}12`,
              color: tintColors[index % tintColors.length],
            }}
          >
            {album.category}
          </span>
          {album.subcategory && (
            <span
              className="px-3 py-1 rounded-full text-xs font-bold"
              style={{
                background: `${palette.accent}15`,
                color: palette.accent2,
              }}
            >
              {album.subcategory}
            </span>
          )}
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500">
            {album.total} photos
          </span>
        </div>

        {/* Image */}
        <div className="relative rounded-xl overflow-hidden bg-slate-100 aspect-[4/3]">
          {currentImageUrl ? (
            <SmoothLoadedImage
              src={currentImageUrl}
              alt={album.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              fallback={
                <div className="w-full h-full flex items-center justify-center bg-slate-100">
                  <ImageIcon className="w-12 h-12 text-slate-300" />
                </div>
              }
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-100">
              <ImageIcon className="w-12 h-12 text-slate-300" />
            </div>
          )}

          {/* Image counter overlay */}
          {photoUrls.length > 1 && (
            <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-bold">
              {currentImage + 1} / {photoUrls.length}
            </div>
          )}
        </div>

        {/* Title & Description */}
        <h3
          className="text-xl font-bold mt-4 mb-2"
          style={{ color: palette.dark, fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
        >
          {album.title}
        </h3>

        <p className="text-sm leading-relaxed line-clamp-2" style={{ color: palette.gray }}>
          {album.description}
        </p>

        {/* View button */}
        <button
          type="button"
          disabled={album.total === 0}
          onClick={() => { if (album.total > 0) onClick(album); }}
          className="mt-4 w-full py-3 rounded-xl font-bold transition-all duration-300 hover:gap-2 group-hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            color: palette.white,
            background: album.total > 0 ? `linear-gradient(135deg, ${tintColors[index % tintColors.length]}, ${palette.accent})` : palette.gray,
          }}
        >
          {album.total > 0 ? `View Gallery (${album.total})` : "No Images"}
        </button>
      </div>
    </motion.div>
  );
}

// ============ ACHIEVEMENTS SECTION ============
function AchievementsSection() {
  const achievements = [
    { id: 1, title: "Top School Award", color: palette.accent, year: "2024", icon: Trophy },
    { id: 2, title: "STEM Excellence", color: palette.secondary, year: "2023", icon: Award },
    { id: 3, title: "Sports Champion", color: palette.accent2, year: "2024", icon: Trophy },
    { id: 4, title: "Community Service", color: palette.primary, year: "2023", icon: Star },
  ];

  return (
    <section className="py-16 px-6" style={{ background: palette.light }}>
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide mb-4" style={{ background: "rgba(45,106,79,0.15)", color: palette.secondary }}>
            <Trophy className="w-4 h-4 inline mr-2" />
            Our Achievements
          </span>
          <h2 className="text-3xl md:text-4xl font-bold" style={{ color: palette.dark, fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}>
            Celebrating <span style={{ color: palette.secondary }}>Excellence</span>
          </h2>
          <div className="w-16 h-1 rounded-full mx-auto mt-4" style={{ background: palette.gradient2 }} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {achievements.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.03 }}
                className="relative rounded-2xl p-6 text-center cursor-pointer group"
                style={{ background: palette.white, border: `1px solid ${item.color}20`, boxShadow: "0 4px 22px rgba(0,0,0,0.04)" }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 transition-all duration-300 group-hover:scale-110"
                  style={{ background: `${item.color}15` }}
                >
                  <Icon size={28} style={{ color: item.color }} />
                </div>
                <h3 className="font-bold" style={{ color: palette.dark }}>{item.title}</h3>
                <p className="text-xs mt-1" style={{ color: palette.gray }}>{item.year}</p>
                <div
                  className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl transition-all duration-300 group-hover:h-1.5"
                  style={{ background: item.color }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ============ HERO SECTION ============
function GalleryHero() {
  return (
    <section
    className="relative min-h-[80vh] flex items-center justify-center overflow-hidden"
    style={{
      background:
        "linear-gradient(135deg,#1E3A5F 0%,#29597A 35%,#234B69 70%,#16324C 100%)",
    }}
  >
      <div className="absolute inset-0 opacity-20">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-20 w-64 h-64 rounded-full"
          style={{ background: palette.accent, filter: "blur(80px)" }}
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-20 right-20 w-64 h-64 rounded-full"
          style={{ background: palette.secondary, filter: "blur(80px)" }}
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.4, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full"
          style={{ background: palette.primary, filter: "blur(100px)" }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{ background: palette.accent }}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 50 - 25, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 4,
              ease: "easeInOut",
            }}
            initial={{
              x: Math.random() * 100 - 50,
              y: Math.random() * 100 + 20,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="inline-block px-5 py-2.5 rounded-full mb-6"
            style={{ background: "rgba(233,196,106,0.15)", border: "1px solid rgba(233,196,106,0.3)" }}
          >
            <span className="text-sm font-bold tracking-wider" style={{ color: palette.accent }}>
              <Sparkles className="w-4 h-4 inline mr-2" />
              INTERACTIVE GALLERY
            </span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-4" style={{ color: palette.white, fontFamily: "var(--font-display)", letterSpacing: "-0.03em" }}>
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              style={{ color: palette.accent }}
            >
              Smriti
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              School
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-xl md:text-2xl mb-6" style={{ color: "rgba(255,255,255,0.7)" }}
          >
            Interactive Gallery Experience
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="flex justify-center gap-4"
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <Camera size={16} style={{ color: palette.accent }} />
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>Explore Moments</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <Heart size={16} style={{ color: palette.accent2 }} />
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>Celebrate Achievements</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ============ MAIN GALLERY COMPONENT ============
function Gallery() {
  const [content, setContent] = useState(defaultGalleryContent);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);

  const lastThumbnailTapRef = useRef({ index: null, time: 0 });

  useEffect(() => {
    const loadGalleryContent = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/site-content/gallery`, { timeout: 12000 });
        const savedContent = res.data?.data?.content || {};
        setContent(mergeGalleryContent(savedContent));
      } catch (error) {
        console.error("Gallery content load error:", error);
        setContent(defaultGalleryContent);
      }
    };
    loadGalleryContent();
  }, []);

  const categories = ["All", ...normalizeCategories(content.categories)];
  const filteredAlbums = useMemo(() => buildCategoryAlbums(content, activeCategory), [content, activeCategory]);
  const currentPhoto = selectedAlbum?.photos?.[currentImageIndex];

  const openAlbum = (album) => {
    setSelectedAlbum(album);
    setCurrentImageIndex(0);
    setZoomOpen(false);
    setZoomScale(1);
  };

  const closeAlbum = () => {
    setSelectedAlbum(null);
    setCurrentImageIndex(0);
    setZoomOpen(false);
    setZoomScale(1);
  };

  const previousImage = (e) => {
    e?.stopPropagation();
    if (!selectedAlbum?.photos?.length) return;
    setCurrentImageIndex((prev) => (prev === 0 ? selectedAlbum.photos.length - 1 : prev - 1));
    setZoomScale(1);
  };

  const nextImage = (e) => {
    e?.stopPropagation();
    if (!selectedAlbum?.photos?.length) return;
    setCurrentImageIndex((prev) => (prev + 1) % selectedAlbum.photos.length);
    setZoomScale(1);
  };

  const openImageInsidePage = (index = currentImageIndex) => {
    setCurrentImageIndex(index);
    setZoomOpen(true);
    setZoomScale(1);
  };

  const handleThumbnailClick = (e, index) => {
    const isTouchScreen = window.matchMedia?.("(hover: none), (pointer: coarse)")?.matches || false;
    if (!isTouchScreen) {
      setCurrentImageIndex(index);
      setZoomScale(1);
      return;
    }
    const now = Date.now();
    const lastTap = lastThumbnailTapRef.current;
    const tappedSameImage = lastTap.index === index;
    const tappedFastEnough = now - lastTap.time <= 420;
    if (tappedSameImage && tappedFastEnough) {
      e.preventDefault();
      e.stopPropagation();
      openImageInsidePage(index);
      lastThumbnailTapRef.current = { index: null, time: 0 };
      return;
    }
    setCurrentImageIndex(index);
    setZoomScale(1);
    lastThumbnailTapRef.current = { index, time: now };
  };

  const downloadImage = async (photo = currentPhoto) => {
    if (!photo?.url) return;
    const cleanTitle = String(photo.title || selectedAlbum?.title || "gallery").trim().replace(/[^a-z0-9]+/gi, "-").replace(/^-+|-+$/g, "").toLowerCase();
    const fileName = `${cleanTitle || "gallery-image"}-${currentImageIndex + 1}.jpg`;
    try {
      const response = await fetch(photo.url, { mode: "cors" });
      if (!response.ok) throw new Error("Image fetch failed");
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Image download failed:", error);
      const link = document.createElement("a");
      link.href = photo.url;
      link.download = fileName;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  };

  // Category icons
  const getCategoryIcon = (category) => {
    const icons = {
      "All": <Grid size={16} />,
      "Classroom": <BookOpen size={16} />,
      "Events": <Calendar size={16} />,
      "Certificate": <Award size={16} />,
    };
    return icons[category] || <Grid size={16} />;
  };

  return (
    <div>
      {/* ===== HERO SECTION ===== */}
      <GalleryHero />

      {/* ===== ACHIEVEMENTS SECTION ===== */}
      <AchievementsSection />

      {/* ===== MAIN GALLERY ===== */}
      <section className="py-16 px-6" style={{ background: palette.light }} id="gallery-grid">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide mb-4" style={{ background: "rgba(30,58,95,0.08)", color: palette.primary }}>
              <Camera className="w-4 h-4 inline mr-2" />
              {content.badge}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ color: palette.dark, fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}>
              <HighlightedTitle title={content.title} highlightedText={content.highlightedText} />
            </h2>
            <div className="w-16 h-1 rounded-full mx-auto mt-4" style={{ background: palette.gradient2 }} />
            <p className="text-lg mt-4 max-w-3xl mx-auto" style={{ color: palette.gray }}>
              {content.description}
            </p>
          </div>

          {/* Category Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-wrap justify-center gap-3 mb-10"
          >
            {categories.map((category) => {
              const active = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 hover:-translate-y-0.5"
                  style={{
                    color: active ? palette.white : palette.dark,
                    background: active ? palette.gradient1 : palette.white,
                    border: active ? "none" : `1px solid ${palette.lightGray}`,
                    boxShadow: active ? "0 8px 24px rgba(30,58,95,0.2)" : "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  {getCategoryIcon(category)}
                  {category}
                </button>
              );
            })}
          </motion.div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAlbums.length > 0 ? (
              filteredAlbums.map((album, index) => (
                <ModernGalleryCard
                  key={`${album.category}-${album.subcategory || album.title}`}
                  album={album}
                  index={index}
                  onClick={openAlbum}
                />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="col-span-full"
              >
                <div
                  className="rounded-2xl p-16 text-center"
                  style={{
                    background: palette.white,
                    border: `2px dashed ${palette.lightGray}`,
                  }}
                >
                  <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: `${palette.primary}08` }}>
                    <ImageIcon className="w-10 h-10" style={{ color: palette.gray }} />
                  </div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: palette.dark }}>
                    No Gallery Images Found
                  </h3>
                  <p className="text-sm" style={{ color: palette.gray }}>
                    Please check another category or upload images to showcase your school moments.
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* ===== MODAL ===== */}
      <AnimatePresence>
        {selectedAlbum && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeAlbum}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto"
            style={{ background: "rgba(26,26,46,0.85)", backdropFilter: "blur(12px)" }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 250, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-6xl rounded-2xl overflow-hidden max-h-[92vh]"
              style={{
                background: palette.white,
                boxShadow: "0 40px 100px rgba(0,0,0,0.3)",
              }}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  closeAlbum();
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

              <div
                className="h-1.5 w-full"
                style={{
                  background: `linear-gradient(90deg, ${selectedAlbum.category === "Classroom" ? palette.primary : selectedAlbum.category === "Events" ? palette.accent2 : palette.secondary}, ${palette.accent})`,
                }}
              />

              <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-0">
                <div className="relative bg-slate-950 min-h-[300px] lg:min-h-[500px] flex items-center justify-center p-4">
                  {currentPhoto?.url ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openImageInsidePage(currentImageIndex);
                      }}
                      className="w-full h-full flex items-center justify-center cursor-zoom-in"
                    >
                      <SmoothLoadedImage
                        src={currentPhoto.url}
                        alt={currentPhoto.title || selectedAlbum.title}
                        decoding="async"
                        className="w-full max-h-[400px] lg:max-h-[550px] object-contain rounded-xl"
                        fallback={
                          <div className="w-full min-h-[300px] flex items-center justify-center">
                            <ImageIcon className="w-12 h-12" style={{ color: palette.gray }} />
                          </div>
                        }
                      />
                    </button>
                  ) : (
                    <ImageIcon className="w-16 h-16" style={{ color: palette.gray }} />
                  )}

                  {selectedAlbum.photos.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={previousImage}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-xl hover:scale-110 transition-all flex items-center justify-center"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        type="button"
                        onClick={nextImage}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-xl hover:scale-110 transition-all flex items-center justify-center"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </>
                  )}

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/50 backdrop-blur-sm text-white text-sm font-bold">
                    {currentImageIndex + 1} / {selectedAlbum.photos.length}
                  </div>
                </div>

                <div className="p-6 overflow-y-auto max-h-[300px] lg:max-h-[500px]">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-bold"
                      style={{
                        background: "rgba(30,58,95,0.08)",
                        color: palette.primary,
                      }}
                    >
                      {selectedAlbum.category}
                    </span>
                    {selectedAlbum.subcategory && (
                      <span
                        className="px-3 py-1 rounded-full text-xs font-bold"
                        style={{
                          background: "rgba(233,196,106,0.15)",
                          color: palette.accent2,
                        }}
                      >
                        {selectedAlbum.subcategory}
                      </span>
                    )}
                  </div>

                  <h2
                    className="text-2xl font-bold mb-2"
                    style={{ color: palette.dark, fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
                  >
                    {selectedAlbum.title}
                  </h2>

                  <p className="text-sm leading-relaxed mb-4" style={{ color: palette.gray }}>
                    {selectedAlbum.description}
                  </p>

                  <div className="grid grid-cols-3 gap-2 max-h-[150px] overflow-y-auto pr-1">
                    {selectedAlbum.photos.map((photo, index) => (
                      <button
                        key={`${photo.url}-${index}`}
                        type="button"
                        onClick={(e) => handleThumbnailClick(e, index)}
                        onDoubleClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          openImageInsidePage(index);
                        }}
                        className="rounded-xl overflow-hidden border-2 bg-slate-100 transition-all hover:scale-105"
                        style={{
                          borderColor: currentImageIndex === index ? palette.primary : "rgba(15,23,42,0.06)",
                        }}
                      >
                        <img src={photo.url} alt="" className="w-full h-16 object-cover" />
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    disabled={!currentPhoto?.url}
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadImage(currentPhoto);
                    }}
                    className="mt-4 w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all hover:gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: palette.gradient1,
                      boxShadow: "0 8px 24px rgba(30,58,95,0.2)",
                    }}
                  >
                    <Download className="w-4 h-4" />
                    Download Image
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== ZOOM MODAL ===== */}
      <AnimatePresence>
        {zoomOpen && currentPhoto?.url && selectedAlbum && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { setZoomOpen(false); setZoomScale(1); }}
            className="fixed inset-0 z-[999999] flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(8px)" }}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setZoomOpen(false);
                setZoomScale(1);
              }}
              className="absolute top-4 right-4 z-50 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:rotate-180 hover:scale-110"
              style={{
                background: "#DC2626",
                color: palette.white,
                boxShadow: "0 4px 20px rgba(220,38,38,0.4)",
              }}
            >
              <X size={24} />
            </button>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-white/95 rounded-2xl p-2 shadow-2xl">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setZoomScale((prev) => Math.max(1, prev - 0.25)); }}
                className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-all"
              >
                <ZoomOut size={20} />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setZoomScale((prev) => Math.min(3, prev + 0.25)); }}
                className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-all"
              >
                <ZoomIn size={20} />
              </button>
              <button
                type="button"
                disabled={!currentPhoto?.url}
                onClick={(e) => {
                  e.stopPropagation();
                  downloadImage(currentPhoto);
                }}
                className="h-11 px-4 rounded-xl text-white font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: palette.gradient1 }}
              >
                <Download size={19} />
                <span className="hidden sm:inline">Download</span>
              </button>
            </div>

            {selectedAlbum.photos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={previousImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/90 shadow-xl hover:scale-110 transition-all flex items-center justify-center"
                >
                  <ChevronLeft size={28} />
                </button>
                <button
                  type="button"
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/90 shadow-xl hover:scale-110 transition-all flex items-center justify-center"
                >
                  <ChevronRight size={28} />
                </button>
              </>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={currentPhoto.url}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: zoomScale }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
                className="cursor-grab active:cursor-grabbing"
              >
                <SmoothLoadedImage
                  src={currentPhoto.url}
                  alt={currentPhoto.title || selectedAlbum.title}
                  className="max-w-[92vw] max-h-[82vh] rounded-2xl shadow-2xl object-contain"
                  fallback={
                    <div className="w-[70vw] h-[60vh] rounded-2xl flex items-center justify-center" style={{ background: palette.dark }}>
                      <ImageIcon className="w-16 h-16" style={{ color: palette.gray }} />
                    </div>
                  }
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export { Gallery };
export default Gallery;