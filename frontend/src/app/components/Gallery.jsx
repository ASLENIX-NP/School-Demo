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
  Grid3X3,
  BookOpen,
  CalendarDays,
  Award,
  Heart,
  Star,
  Trophy,
  ArrowUpRight,
  Maximize2,
} from "lucide-react";

/*
|--------------------------------------------------------------------------
| MODERN RED ROSE SCHOOL GALLERY
|--------------------------------------------------------------------------
| This is a single-file Gallery page.
|
| It keeps the existing backend structure:
|   GET /api/site-content/gallery
|
| The page is intentionally designed to work with the same content object
| used by the Admin Gallery:
|
|   heroBadge
|   heroTitle
|   heroHighlightedText
|   heroSubtitle
|   heroExploreText
|   heroAchievementText
|   badge
|   title
|   highlightedText
|   description
|   categories
|   categoryDescriptions
|   subcategories
|   achievements
|   images
|
| No extra CSS file is required. The custom CSS is included at the bottom
| of this file so you can replace your existing Gallery.jsx directly.
|--------------------------------------------------------------------------
*/

const palette = {
  primary: "#173B5F",
  primary2: "#0E2A43",
  secondary: "#2D6A4F",
  accent: "#E9C46A",
  accent2: "#F4A261",
  cream: "#FFF9ED",
  light: "#F6F8FA",
  dark: "#111827",
  gray: "#667085",
  white: "#FFFFFF",
};

const DEFAULT_CATEGORIES = ["Classroom", "Events", "Certificate"];

const fallbackDescriptions = {
  Classroom:
    "Classroom moments show students learning, discussing, writing, presenting, and growing through daily academic activities.",
  Events:
    "School events highlight celebrations, programs, competitions, cultural activities, student participation, and community moments.",
  Certificate:
    "Certificates and awards recognize student achievement, participation, discipline, excellence, and school accomplishments.",
};

const defaultAchievements = [
  { id: "1", title: "Top School Award", year: "2024", icon: "Trophy" },
  { id: "2", title: "STEM Excellence", year: "2023", icon: "Award" },
  { id: "3", title: "Sports Champion", year: "2024", icon: "Trophy" },
  { id: "4", title: "Community Service", year: "2023", icon: "Star" },
];

const defaultContent = {
  heroBadge: "INTERACTIVE GALLERY",
  heroTitle: "Red Rose School",
  heroHighlightedText: "Red Rose",
  heroSubtitle: "Moments that become memories",
  heroExploreText: "Explore Moments",
  heroAchievementText: "Celebrate Achievements",
  badge: "School Gallery",
  title: "Stories",
  highlightedText: "Stories",
  description:
    "Explore classroom learning, school events, certificates, achievements, and student life at Red Rose Secondary English Boarding School.",
  categories: DEFAULT_CATEGORIES,
  categoryDescriptions: fallbackDescriptions,
  subcategories: {},
  achievements: defaultAchievements,
  images: [],
};

function normalizeCategories(value) {
  const source = Array.isArray(value) ? value : DEFAULT_CATEGORIES;

  const result = [
    ...new Set(
      source
        .map((x) => String(x || "").trim())
        .filter(Boolean)
        .filter((x) => x.toLowerCase() !== "all")
    ),
  ];

  return result.length ? result : [...DEFAULT_CATEGORIES];
}

function normalizeSubcategories(value, categories) {
  return normalizeCategories(categories).reduce((out, category) => {
    out[category] = Array.isArray(value?.[category])
      ? value[category]
          .map((item, index) => ({
            id: item?.id || `${category}-${index}`,
            name: String(
              typeof item === "string" ? item : item?.name || ""
            ).trim(),
            description:
              typeof item === "string" ? "" : item?.description || "",
            visible: item?.visible !== false,
          }))
          .filter((x) => x.name)
      : [];

    return out;
  }, {});
}

function mergeGalleryContent(saved = {}) {
  const categories = normalizeCategories(saved.categories);

  const descriptions = categories.reduce((out, category) => {
    out[category] =
      saved?.categoryDescriptions?.[category] ||
      fallbackDescriptions[category] ||
      "";

    return out;
  }, {});

  return {
    ...defaultContent,
    ...saved,
    categories,
    categoryDescriptions: descriptions,
    subcategories: normalizeSubcategories(
      saved.subcategories,
      categories
    ),
    achievements:
      Array.isArray(saved.achievements) && saved.achievements.length
        ? saved.achievements
        : defaultAchievements,
    images: Array.isArray(saved.images)
      ? saved.images.map((item) => ({
          ...item,
          category: categories.includes(item?.category)
            ? item.category
            : categories[0],
          subcategory: item?.subcategory || "",
          images:
            Array.isArray(item?.images) && item.images.length
              ? item.images.filter(Boolean)
              : item?.image
              ? [item.image]
              : [],
        }))
      : [],
  };
}

function getImageUrls(item) {
  if (Array.isArray(item?.images) && item.images.length) {
    return item.images.filter(Boolean);
  }

  return item?.image ? [item.image] : [];
}

function collectPhotos(items, category, fallbackTitle) {
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
        category,
        subcategory: item.subcategory || "",
      });
    });
  });

  return photos;
}

function buildAlbums(content, activeCategory) {
  const categories = normalizeCategories(content.categories);

  const visible = (content.images || []).filter(
    (item) => item.visible !== false
  );

  const buildAlbum = (category, subcategory = "") => {
    const items = visible.filter(
      (item) =>
        item.category === category &&
        (!subcategory || item.subcategory === subcategory)
    );

    const photos = collectPhotos(
      items,
      category,
      subcategory || category
    );

    const subDescription =
      content.subcategories?.[category]?.find(
        (item) => item.name === subcategory
      )?.description || "";

    return {
      category,
      subcategory,
      title: subcategory || category,
      date: items[0]?.date || "School Gallery",
      description:
        subcategory
          ? subDescription
          : content.categoryDescriptions?.[category] ||
            fallbackDescriptions[category] ||
            "",
      cover: photos[0]?.url || "",
      photos,
      total: photos.length,
    };
  };

  if (activeCategory === "All") {
    return categories.map((category) => buildAlbum(category));
  }

  const subcategories = (
    content.subcategories?.[activeCategory] || []
  ).filter((item) => item.visible !== false);

  if (!subcategories.length) {
    return [buildAlbum(activeCategory)];
  }

  const albums = subcategories.map((sub) =>
    buildAlbum(activeCategory, sub.name)
  );

  const general = buildAlbum(activeCategory);

  if (
    general.photos.length &&
    !albums.some((album) => album.total > 0)
  ) {
    albums.push(general);
  }

  return albums;
}

function IconFor({ name, size = 20 }) {
  const icons = {
    Trophy,
    Award,
    Star,
  };

  const Icon = icons[name] || Trophy;

  return <Icon size={size} />;
}

function HighlightedTitle({ title, highlightedText }) {
  if (!highlightedText || !title?.includes(highlightedText)) {
    return <>{title}</>;
  }

  const [before, after] = title.split(highlightedText);

  return (
    <>
      {before}
      <span className="gallery-gradient-text">{highlightedText}</span>
      {after}
    </>
  );
}

function SmoothLoadedImage({
  src,
  alt,
  className = "",
  style = {},
  ...props
}) {
  const cleanSrc = String(src || "").trim();
  const [displaySrc, setDisplaySrc] = useState(cleanSrc);

  useEffect(() => {
    if (!cleanSrc) {
      setDisplaySrc("");
      return;
    }

    if (cleanSrc === displaySrc) return;

    let alive = true;
    const image = new Image();

    image.onload = () => {
      if (alive) setDisplaySrc(cleanSrc);
    };

    image.onerror = () => {
      if (alive) setDisplaySrc("");
    };

    image.src = cleanSrc;

    return () => {
      alive = false;
    };
  }, [cleanSrc, displaySrc]);

  if (!displaySrc) {
    return (
      <div className="gallery-image-placeholder">
        <ImageIcon size={42} />
      </div>
    );
  }

  return (
    <img
      {...props}
      src={displaySrc}
      alt={alt}
      className={className}
      style={style}
      loading="lazy"
      decoding="async"
    />
  );
}

function FloatingShapes() {
  return (
    <div className="gallery-floating-shapes" aria-hidden="true">
      <motion.div
        className="gallery-orb gallery-orb-one"
        animate={{
          x: [0, 45, 0],
          y: [0, -35, 0],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="gallery-orb gallery-orb-two"
        animate={{
          x: [0, -40, 0],
          y: [0, 30, 0],
          scale: [1, 1.12, 1],
        }}
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="gallery-orb gallery-orb-three"
        animate={{
          rotate: [0, 180, 360],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {[...Array(18)].map((_, index) => (
        <motion.span
          key={index}
          className="gallery-particle"
          style={{
            left: `${(index * 37) % 100}%`,
            top: `${(index * 53) % 100}%`,
          }}
          animate={{
            y: [0, -25, 0],
            opacity: [0.15, 0.8, 0.15],
          }}
          transition={{
            duration: 3 + (index % 4),
            repeat: Infinity,
            delay: index * 0.2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function GalleryHero({ content, totalPhotos, onExplore }) {
  const heroTitle = content.heroTitle || "Red Rose School";
  const highlighted = content.heroHighlightedText || "Red Rose";

  return (
    <section className="gallery-hero-modern">
      <FloatingShapes />

      <div className="gallery-hero-grid" />

      <div className="gallery-hero-content">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="gallery-hero-badge"
        >
          <Sparkles size={16} />
          {content.heroBadge}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          <h1 className="gallery-hero-title">
            {heroTitle.includes(highlighted) ? (
              <>
                <span className="gallery-hero-highlight">
                  {highlighted}
                </span>
                {heroTitle.replace(highlighted, "")}
              </>
            ) : (
              heroTitle
            )}
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="gallery-hero-subtitle"
        >
          {content.heroSubtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="gallery-hero-actions"
        >
          <button
            type="button"
            onClick={onExplore}
            className="gallery-primary-button"
          >
            <Camera size={18} />
            {content.heroExploreText}
            <ArrowUpRight size={17} />
          </button>

          <div className="gallery-hero-pill">
            <Heart size={16} />
            {content.heroAchievementText}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="gallery-hero-stats"
        >
          <div>
            <strong>{totalPhotos}</strong>
            <span>Photos</span>
          </div>
          <div className="gallery-stat-divider" />
          <div>
            <strong>{content.categories?.length || 0}</strong>
            <span>Collections</span>
          </div>
          <div className="gallery-stat-divider" />
          <div>
            <strong>∞</strong>
            <span>Memories</span>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="gallery-scroll-indicator"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span>Scroll to explore</span>
        <div />
      </motion.div>
    </section>
  );
}

function AchievementsSection({ content }) {
  const achievements =
    Array.isArray(content.achievements) && content.achievements.length
      ? content.achievements
      : defaultAchievements;

  return (
    <section className="gallery-achievements-section">
      <div className="gallery-section-shell">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          className="gallery-section-heading"
        >
          <span className="gallery-small-label">
            <Trophy size={15} />
            Our Achievements
          </span>

          <h2>
            Celebrating{" "}
            <span className="gallery-gradient-text">Excellence</span>
          </h2>

          <p>
            A few moments that remind us why every achievement matters.
          </p>
        </motion.div>

        <div className="gallery-achievement-grid">
          {achievements.map((item, index) => (
            <motion.div
              key={item.id || index}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -8 }}
              className="gallery-achievement-card"
            >
              <div className="gallery-achievement-icon">
                <IconFor name={item.icon} size={25} />
              </div>

              <span className="gallery-achievement-year">
                {item.year}
              </span>

              <h3>{item.title}</h3>

              <div className="gallery-achievement-line" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryTabs({
  categories,
  activeCategory,
  setActiveCategory,
}) {
  const getIcon = (category) => {
    if (category === "All") return <Grid3X3 size={17} />;
    if (category === "Classroom") return <BookOpen size={17} />;
    if (category === "Events") return <CalendarDays size={17} />;
    if (category === "Certificate") return <Award size={17} />;
    return <Camera size={17} />;
  };

  return (
    <div className="gallery-tabs-wrap">
      {categories.map((category) => {
        const active = activeCategory === category;

        return (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            className={`gallery-tab ${active ? "active" : ""}`}
          >
            {getIcon(category)}
            <span>{category}</span>
            {active && <motion.i layoutId="gallery-tab-dot" />}
          </button>
        );
      })}
    </div>
  );
}

function ModernGalleryCard({ album, index, onClick }) {
  const [currentImage, setCurrentImage] = useState(0);

  const photoUrls = useMemo(
    () =>
      album.photos
        .map((photo) => photo?.url)
        .filter(Boolean),
    [album.photos]
  );

  useEffect(() => {
    setCurrentImage(0);
  }, [album.category, album.subcategory, photoUrls.join("|")]);

  useEffect(() => {
    if (photoUrls.length <= 1) return undefined;

    const interval = window.setInterval(() => {
      setCurrentImage(
        (previous) => (previous + 1) % photoUrls.length
      );
    }, 4500);

    return () => window.clearInterval(interval);
  }, [photoUrls.join("|")]);

  const currentUrl =
    photoUrls[currentImage] || album.cover || "";

  const cardClass =
    index % 5 === 0
      ? "gallery-card gallery-card-featured"
      : "gallery-card";

  return (
    <motion.article
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.6,
        delay: Math.min(index * 0.06, 0.3),
      }}
      whileHover={{ y: -7 }}
      className={cardClass}
    >
      <div className="gallery-card-image">
        {currentUrl ? (
          <SmoothLoadedImage
            src={currentUrl}
            alt={album.title}
            className="gallery-card-photo"
          />
        ) : (
          <div className="gallery-image-placeholder">
            <ImageIcon size={48} />
            <span>No images yet</span>
          </div>
        )}

        <div className="gallery-card-overlay" />

        <div className="gallery-card-top">
          <span className="gallery-card-category">
            {album.category}
          </span>

          {album.subcategory && (
            <span className="gallery-card-subcategory">
              {album.subcategory}
            </span>
          )}
        </div>

        <div className="gallery-card-count">
          <Camera size={14} />
          {album.total}
        </div>

        {photoUrls.length > 1 && (
          <div className="gallery-card-dots">
            {photoUrls.slice(0, 5).map((_, dotIndex) => (
              <span
                key={dotIndex}
                className={
                  dotIndex === currentImage ? "active" : ""
                }
              />
            ))}
          </div>
        )}

        <button
          type="button"
          disabled={!album.total}
          onClick={() => album.total && onClick(album)}
          className="gallery-card-open"
        >
          <Maximize2 size={16} />
          {album.total ? "Open collection" : "No images"}
        </button>
      </div>

      <div className="gallery-card-content">
        <div className="gallery-card-date">
          <span />
          {album.date}
        </div>

        <h3>{album.title}</h3>

        <p>{album.description}</p>

        <div className="gallery-card-footer">
          <span>
            {album.total}{" "}
            {album.total === 1 ? "memory" : "memories"}
          </span>

          <button
            type="button"
            disabled={!album.total}
            onClick={() => album.total && onClick(album)}
            aria-label={`Open ${album.title}`}
          >
            <ArrowUpRight size={18} />
          </button>
        </div>
      </div>
    </motion.article>
  );
}

function GalleryModal({
  selectedAlbum,
  currentImageIndex,
  setCurrentImageIndex,
  closeAlbum,
  zoomOpen,
  setZoomOpen,
  zoomScale,
  setZoomScale,
}) {
  const currentPhoto =
    selectedAlbum?.photos?.[currentImageIndex];

  const previousImage = (e) => {
    e?.stopPropagation();

    if (!selectedAlbum?.photos?.length) return;

    setCurrentImageIndex((previous) =>
      previous === 0
        ? selectedAlbum.photos.length - 1
        : previous - 1
    );

    setZoomScale(1);
  };

  const nextImage = (e) => {
    e?.stopPropagation();

    if (!selectedAlbum?.photos?.length) return;

    setCurrentImageIndex(
      (previous) =>
        (previous + 1) % selectedAlbum.photos.length
    );

    setZoomScale(1);
  };

  const downloadImage = async () => {
    if (!currentPhoto?.url) return;

    const cleanTitle = String(
      currentPhoto.title ||
        selectedAlbum?.title ||
        "gallery"
    )
      .trim()
      .replace(/[^a-z0-9]+/gi, "-")
      .replace(/^-+|-+$/g, "")
      .toLowerCase();

    const fileName = `${
      cleanTitle || "gallery-image"
    }-${currentImageIndex + 1}.jpg`;

    try {
      const response = await fetch(currentPhoto.url, {
        mode: "cors",
      });

      if (!response.ok) {
        throw new Error("Image fetch failed");
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Image download failed:", error);
      window.open(
        currentPhoto.url,
        "_blank",
        "noopener,noreferrer"
      );
    }
  };

  useEffect(() => {
    if (!selectedAlbum) return undefined;

    const handleKey = (event) => {
      if (event.key === "Escape") closeAlbum();
      if (event.key === "ArrowLeft") previousImage();
      if (event.key === "ArrowRight") nextImage();
    };

    window.addEventListener("keydown", handleKey);

    return () =>
      window.removeEventListener("keydown", handleKey);
  }, [selectedAlbum, currentImageIndex]);

  return (
    <AnimatePresence>
      {selectedAlbum && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAlbum}
          className="gallery-modal-backdrop"
        >
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.94,
              y: 25,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.94,
              y: 25,
            }}
            transition={{
              type: "spring",
              stiffness: 250,
              damping: 25,
            }}
            onClick={(e) => e.stopPropagation()}
            className="gallery-modal"
          >
            <button
              type="button"
              onClick={closeAlbum}
              className="gallery-modal-close"
              aria-label="Close gallery"
            >
              <X size={21} />
            </button>

            <div className="gallery-modal-image-area">
              {currentPhoto?.url ? (
                <button
                  type="button"
                  className="gallery-modal-image-button"
                  onClick={() => {
                    setZoomOpen(true);
                    setZoomScale(1);
                  }}
                >
                  <SmoothLoadedImage
                    src={currentPhoto.url}
                    alt={
                      currentPhoto.title ||
                      selectedAlbum.title
                    }
                    className="gallery-modal-image"
                  />

                  <span className="gallery-zoom-hint">
                    <ZoomIn size={15} />
                    Click to zoom
                  </span>
                </button>
              ) : (
                <div className="gallery-modal-empty">
                  <ImageIcon size={60} />
                </div>
              )}

              {selectedAlbum.photos.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={previousImage}
                    className="gallery-modal-arrow left"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={25} />
                  </button>

                  <button
                    type="button"
                    onClick={nextImage}
                    className="gallery-modal-arrow right"
                    aria-label="Next image"
                  >
                    <ChevronRight size={25} />
                  </button>
                </>
              )}

              <div className="gallery-modal-counter">
                {currentImageIndex + 1} /{" "}
                {selectedAlbum.photos.length}
              </div>
            </div>

            <div className="gallery-modal-details">
              <div className="gallery-modal-category">
                {selectedAlbum.category}
                {selectedAlbum.subcategory && (
                  <>
                    <span>•</span>
                    {selectedAlbum.subcategory}
                  </>
                )}
              </div>

              <h2>{selectedAlbum.title}</h2>

              <p>{selectedAlbum.description}</p>

              <div className="gallery-modal-thumbnails">
                {selectedAlbum.photos.map(
                  (photo, index) => (
                    <button
                      type="button"
                      key={`${photo.url}-${index}`}
                      onClick={() =>
                        setCurrentImageIndex(index)
                      }
                      className={
                        currentImageIndex === index
                          ? "active"
                          : ""
                      }
                    >
                      <img
                        src={photo.url}
                        alt=""
                        loading="lazy"
                      />
                    </button>
                  )
                )}
              </div>

              <button
                type="button"
                disabled={!currentPhoto?.url}
                onClick={downloadImage}
                className="gallery-download-button"
              >
                <Download size={17} />
                Download Image
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ZoomViewer({
  selectedAlbum,
  currentImageIndex,
  zoomScale,
  setZoomScale,
  setZoomOpen,
}) {
  const photo = selectedAlbum?.photos?.[currentImageIndex];

  if (!photo?.url) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => {
          setZoomScale(1);
          setZoomOpen(false);
        }}
        className="gallery-zoom-viewer"
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setZoomScale(1);
            setZoomOpen(false);
          }}
          className="gallery-zoom-close"
        >
          <X size={23} />
        </button>

        <div className="gallery-zoom-controls">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setZoomScale((value) =>
                Math.max(1, value - 0.25)
              );
            }}
          >
            <ZoomOut size={19} />
          </button>

          <span>{Math.round(zoomScale * 100)}%</span>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setZoomScale((value) =>
                Math.min(3, value + 0.25)
              );
            }}
          >
            <ZoomIn size={19} />
          </button>
        </div>

        <motion.img
          src={photo.url}
          alt={photo.title || selectedAlbum.title}
          animate={{ scale: zoomScale }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
          className="gallery-zoom-image"
        />
      </motion.div>
    </AnimatePresence>
  );
}

export default function Gallery() {
  const [content, setContent] =
    useState(defaultContent);

  const [activeCategory, setActiveCategory] =
    useState("All");

  const [selectedAlbum, setSelectedAlbum] =
    useState(null);

  const [currentImageIndex, setCurrentImageIndex] =
    useState(0);

  const [zoomOpen, setZoomOpen] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);

  const galleryGridRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    api
      .get("/api/site-content/gallery", {
        timeout: 12000,
      })
      .then((res) => {
        if (!mounted) return;

        setContent(
          mergeGalleryContent(
            res.data?.data?.content || {}
          )
        );
      })
      .catch((error) => {
        console.error(
          "Gallery content load error:",
          error
        );

        if (mounted) {
          setContent(defaultContent);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const categories = [
    "All",
    ...normalizeCategories(content.categories),
  ];

  const albums = useMemo(
    () => buildAlbums(content, activeCategory),
    [content, activeCategory]
  );

  const totalPhotos = useMemo(
    () =>
      (content.images || [])
        .filter((item) => item.visible !== false)
        .reduce(
          (total, item) =>
            total + getImageUrls(item).length,
          0
        ),
    [content.images]
  );

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

  const scrollToGallery = () => {
    galleryGridRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <>
      <div className="gallery-page">
        <GalleryHero
          content={content}
          totalPhotos={totalPhotos}
          onExplore={scrollToGallery}
        />

        <AchievementsSection content={content} />

        <section
          ref={galleryGridRef}
          className="gallery-main-section"
          id="gallery-grid"
        >
          <div className="gallery-section-shell">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{
                once: true,
                amount: 0.2,
              }}
              className="gallery-main-heading"
            >
              <span className="gallery-small-label">
                <Camera size={15} />
                {content.badge}
              </span>

              <h2>
                <HighlightedTitle
                  title={content.title}
                  highlightedText={
                    content.highlightedText
                  }
                />
              </h2>

              <div className="gallery-heading-line">
                <span />
                <i />
                <span />
              </div>

              <p>{content.description}</p>
            </motion.div>

            <CategoryTabs
              categories={categories}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{
                  opacity: 0,
                  y: 18,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -10,
                }}
                transition={{
                  duration: 0.35,
                }}
                className="gallery-grid"
              >
                {albums.length > 0 ? (
                  albums.map((album, index) => (
                    <ModernGalleryCard
                      key={`${album.category}-${
                        album.subcategory ||
                        album.title
                      }`}
                      album={album}
                      index={index}
                      onClick={openAlbum}
                    />
                  ))
                ) : (
                  <div className="gallery-empty-state">
                    <div className="gallery-empty-icon">
                      <ImageIcon size={40} />
                    </div>
                    <h3>No Gallery Images Yet</h3>
                    <p>
                      Gallery images uploaded from the
                      admin panel will appear here.
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        <footer className="gallery-bottom-banner">
          <div className="gallery-bottom-glow" />

          <div className="gallery-bottom-content">
            <Sparkles size={22} />
            <h2>Every picture tells a story.</h2>
            <p>
              Explore the moments, celebrate the
              achievements, and remember the journey.
            </p>
          </div>
        </footer>
      </div>

      <GalleryModal
        selectedAlbum={selectedAlbum}
        currentImageIndex={currentImageIndex}
        setCurrentImageIndex={setCurrentImageIndex}
        closeAlbum={closeAlbum}
        zoomOpen={zoomOpen}
        setZoomOpen={setZoomOpen}
        zoomScale={zoomScale}
        setZoomScale={setZoomScale}
      />

      {zoomOpen && (
        <ZoomViewer
          selectedAlbum={selectedAlbum}
          currentImageIndex={currentImageIndex}
          zoomScale={zoomScale}
          setZoomScale={setZoomScale}
          setZoomOpen={setZoomOpen}
        />
      )}

      <style>{`
        /* ==============================================================
           MODERN GALLERY PAGE CSS
           Everything is inside this file.
        ============================================================== */

        .gallery-page {
          --g-primary: ${palette.primary};
          --g-primary-2: ${palette.primary2};
          --g-secondary: ${palette.secondary};
          --g-accent: ${palette.accent};
          --g-accent-2: ${palette.accent2};
          --g-dark: ${palette.dark};
          --g-gray: ${palette.gray};
          --g-light: ${palette.light};
          --g-white: ${palette.white};

          color: var(--g-dark);
          background:
            radial-gradient(
              circle at 8% 15%,
              rgba(45, 106, 79, 0.10),
              transparent 25%
            ),
            radial-gradient(
              circle at 92% 42%,
              rgba(233, 196, 106, 0.12),
              transparent 27%
            ),
            radial-gradient(
              circle at 50% 92%,
              rgba(126, 155, 190, 0.08),
              transparent 30%
            ),
            #f5f8f6;
          overflow: hidden;
        }

        .gallery-section-shell {
          width: min(1400px, calc(100% - 40px));
          margin: 0 auto;
        }

        .gallery-gradient-text {
          background: linear-gradient(
            135deg,
            #2d6a4f,
            #f4a261
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        /* ================= HERO ================= */

        .gallery-hero-modern {
          position: relative;
          min-height: 760px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          isolation: isolate;
          background:
            radial-gradient(
              circle at 15% 20%,
              rgba(233,196,106,.18),
              transparent 25%
            ),
            radial-gradient(
              circle at 85% 75%,
              rgba(45,106,79,.22),
              transparent 28%
            ),
            linear-gradient(
              135deg,
              #102b45 0%,
              #1d4c6d 42%,
              #173c58 100%
            );
        }

        .gallery-hero-modern::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              rgba(255,255,255,.025) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255,255,255,.025) 1px,
              transparent 1px
            );
          background-size: 70px 70px;
          mask-image: linear-gradient(
            to bottom,
            black,
            transparent
          );
          pointer-events: none;
        }

        .gallery-hero-grid {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(
              ellipse at center,
              transparent 25%,
              rgba(5,20,34,.38) 100%
            );
          z-index: -1;
        }

        .gallery-floating-shapes {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: -1;
        }

        .gallery-orb {
          position: absolute;
          border-radius: 999px;
          filter: blur(3px);
          opacity: .45;
        }

        .gallery-orb-one {
          width: 300px;
          height: 300px;
          left: -100px;
          top: 80px;
          background: rgba(233,196,106,.22);
          box-shadow: 0 0 100px rgba(233,196,106,.18);
        }

        .gallery-orb-two {
          width: 360px;
          height: 360px;
          right: -130px;
          bottom: -70px;
          background: rgba(45,106,79,.28);
          box-shadow: 0 0 120px rgba(45,106,79,.22);
        }

        .gallery-orb-three {
          width: 180px;
          height: 180px;
          right: 16%;
          top: 16%;
          border: 1px solid rgba(255,255,255,.12);
          background: rgba(255,255,255,.025);
        }

        .gallery-particle {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 999px;
          background: #e9c46a;
          box-shadow: 0 0 15px rgba(233,196,106,.65);
        }

        .gallery-hero-content {
          position: relative;
          z-index: 2;
          width: min(1000px, calc(100% - 40px));
          text-align: center;
          padding: 120px 0 90px;
        }

        .gallery-hero-badge {
          width: fit-content;
          margin: 0 auto 28px;
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 10px 17px;
          border: 1px solid rgba(233,196,106,.35);
          border-radius: 999px;
          color: #f6d67d;
          background: rgba(233,196,106,.08);
          backdrop-filter: blur(12px);
          font-size: 12px;
          font-weight: 800;
          letter-spacing: .14em;
        }

        .gallery-hero-title {
          margin: 0;
          color: white;
          font-size: clamp(58px, 10vw, 132px);
          line-height: .92;
          letter-spacing: -.07em;
          font-weight: 900;
          text-shadow: 0 15px 50px rgba(0,0,0,.2);
        }

        .gallery-hero-highlight {
          color: var(--g-accent);
          position: relative;
        }

        .gallery-hero-highlight::after {
          content: "";
          position: absolute;
          left: 3%;
          right: 3%;
          bottom: -8px;
          height: 5px;
          border-radius: 99px;
          background: linear-gradient(
            90deg,
            transparent,
            var(--g-accent),
            transparent
          );
          opacity: .8;
        }

        .gallery-hero-subtitle {
          max-width: 700px;
          margin: 30px auto 0;
          color: rgba(255,255,255,.72);
          font-size: clamp(18px, 2.2vw, 26px);
          line-height: 1.5;
        }

        .gallery-hero-actions {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 35px;
        }

        .gallery-primary-button {
          border: 0;
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 14px 21px;
          border-radius: 15px;
          cursor: pointer;
          color: #15263a;
          font-weight: 800;
          background: linear-gradient(
            135deg,
            #f6d77d,
            #e9c46a
          );
          box-shadow:
            0 12px 35px rgba(233,196,106,.2);
          transition:
            transform .25s ease,
            box-shadow .25s ease;
        }

        .gallery-primary-button:hover {
          transform: translateY(-3px);
          box-shadow:
            0 18px 45px rgba(233,196,106,.3);
        }

        .gallery-hero-pill {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 13px 18px;
          border-radius: 15px;
          color: rgba(255,255,255,.72);
          background: rgba(255,255,255,.055);
          border: 1px solid rgba(255,255,255,.1);
          backdrop-filter: blur(10px);
          font-size: 13px;
          font-weight: 700;
        }

        .gallery-hero-pill svg {
          color: #f4a261;
        }

        .gallery-hero-stats {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 30px;
          margin-top: 55px;
          color: white;
        }

        .gallery-hero-stats > div:not(.gallery-stat-divider) {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .gallery-hero-stats strong {
          font-size: 25px;
          font-weight: 900;
        }

        .gallery-hero-stats span {
          color: rgba(255,255,255,.5);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: .14em;
        }

        .gallery-stat-divider {
          width: 1px;
          height: 34px;
          background: rgba(255,255,255,.15);
        }

        .gallery-scroll-indicator {
          position: absolute;
          left: 50%;
          bottom: 25px;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          color: rgba(255,255,255,.42);
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: .16em;
        }

        .gallery-scroll-indicator div {
          width: 1px;
          height: 35px;
          background: linear-gradient(
            to bottom,
            rgba(255,255,255,.6),
            transparent
          );
        }

        /* ================= ACHIEVEMENTS ================= */

        .gallery-achievements-section {
          position: relative;
          padding: 100px 0 90px;
          background:
            radial-gradient(
              circle at 8% 20%,
              rgba(45, 106, 79, 0.10),
              transparent 25%
            ),
            radial-gradient(
              circle at 92% 80%,
              rgba(233, 196, 106, 0.12),
              transparent 25%
            ),
            #f5f8f6;
        }

        .gallery-section-heading {
          text-align: center;
          max-width: 760px;
          margin: 0 auto 45px;
        }

        .gallery-small-label {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 8px 14px;
          border-radius: 999px;
          background: rgba(45,106,79,.09);
          color: #2d6a4f;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: .05em;
        }

        .gallery-section-heading h2 {
          margin: 16px 0 10px;
          font-size: clamp(34px, 4vw, 54px);
          line-height: 1;
          letter-spacing: -.045em;
          font-weight: 900;
        }

        .gallery-section-heading p {
          margin: 0;
          color: #7a8491;
          font-size: 15px;
        }

        .gallery-achievement-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
        }

        .gallery-achievement-card {
          position: relative;
          overflow: hidden;
          padding: 30px 22px;
          border: 1px solid rgba(17,24,39,.06);
          border-radius: 24px;
          background: white;
          box-shadow: 0 10px 35px rgba(17,24,39,.035);
          text-align: center;
          transition:
            box-shadow .3s ease,
            border-color .3s ease;
        }

        .gallery-achievement-card::before {
          content: "";
          position: absolute;
          width: 120px;
          height: 120px;
          right: -50px;
          top: -50px;
          border-radius: 50%;
          background: rgba(233,196,106,.12);
          transition: transform .4s ease;
        }

        .gallery-achievement-card:hover {
          box-shadow: 0 20px 50px rgba(17,24,39,.08);
          border-color: rgba(233,196,106,.3);
        }

        .gallery-achievement-card:hover::before {
          transform: scale(1.7);
        }

        .gallery-achievement-icon {
          position: relative;
          z-index: 1;
          width: 62px;
          height: 62px;
          margin: 0 auto 17px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 20px;
          color: #2d6a4f;
          background: linear-gradient(
            145deg,
            rgba(45,106,79,.1),
            rgba(233,196,106,.14)
          );
        }

        .gallery-achievement-year {
          position: relative;
          z-index: 1;
          color: #e49a4e;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: .15em;
        }

        .gallery-achievement-card h3 {
          position: relative;
          z-index: 1;
          margin: 8px 0 15px;
          font-size: 16px;
          font-weight: 850;
        }

        .gallery-achievement-line {
          width: 35px;
          height: 3px;
          margin: auto;
          border-radius: 99px;
          background: linear-gradient(
            90deg,
            #2d6a4f,
            #e9c46a
          );
        }

        /* ================= MAIN GALLERY ================= */

        .gallery-main-section {
          position: relative;
          padding: 100px 0 120px;
          scroll-margin-top: 30px;
          background:
            radial-gradient(
              circle at 5% 15%,
              rgba(45, 106, 79, 0.08),
              transparent 28%
            ),
            radial-gradient(
              circle at 95% 70%,
              rgba(233, 196, 106, 0.10),
              transparent 28%
            ),
            linear-gradient(
              180deg,
              #fbfcf9 0%,
              #f3f8f5 100%
            );
        }

        .gallery-main-section::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image:
            radial-gradient(
              rgba(45, 106, 79, 0.12) 1px,
              transparent 1px
            );
          background-size: 28px 28px;
          opacity: 0.35;
          pointer-events: none;
        }

        .gallery-main-section > .gallery-section-shell {
          position: relative;
          z-index: 1;
        }

        .gallery-main-heading {
          text-align: center;
          max-width: 850px;
          margin: 0 auto 42px;
        }

        .gallery-main-heading h2 {
          margin: 15px 0 10px;
          font-size: clamp(40px, 5vw, 68px);
          line-height: .98;
          letter-spacing: -.055em;
          font-weight: 900;
        }

        .gallery-main-heading p {
          max-width: 760px;
          margin: 20px auto 0;
          color: #667085;
          font-size: 16px;
          line-height: 1.8;
        }

        .gallery-heading-line {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          margin: 20px auto 0;
        }

        .gallery-heading-line span {
          width: 35px;
          height: 2px;
          border-radius: 99px;
          background: #dce3e9;
        }

        .gallery-heading-line i {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #e9c46a;
          box-shadow: 0 0 0 5px rgba(233,196,106,.12);
        }

        /* ================= TABS ================= */

        .gallery-tabs-wrap {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 45px;
        }

        .gallery-tab {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 18px;
          border: 1px solid #e7ebef;
          border-radius: 14px;
          color: #263244;
          background: white;
          cursor: pointer;
          font-size: 13px;
          font-weight: 800;
          box-shadow: 0 5px 20px rgba(15,23,42,.035);
          transition:
            transform .25s ease,
            color .25s ease,
            border-color .25s ease,
            background .25s ease,
            box-shadow .25s ease;
        }

        .gallery-tab:hover {
          transform: translateY(-3px);
          border-color: rgba(45,106,79,.2);
          box-shadow: 0 12px 28px rgba(15,23,42,.07);
        }

        .gallery-tab.active {
          color: white;
          border-color: transparent;
          background: linear-gradient(
            135deg,
            #173b5f,
            #2d6a4f
          );
          box-shadow:
            0 12px 28px rgba(23,59,95,.2);
        }

        .gallery-tab i {
          position: absolute;
          left: 50%;
          bottom: 4px;
          width: 4px;
          height: 4px;
          transform: translateX(-50%);
          border-radius: 50%;
          background: #e9c46a;
        }

        /* ================= CARDS ================= */

        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 22px;
        }

        .gallery-card {
          position: relative;
          overflow: hidden;
          min-width: 0;
          border: 1px solid #e9edf1;
          border-radius: 25px;
          background: white;
          box-shadow: 0 12px 40px rgba(15,23,42,.045);
          transition:
            box-shadow .35s ease,
            border-color .35s ease;
        }

        .gallery-card:hover {
          border-color: rgba(45,106,79,.16);
          box-shadow: 0 25px 60px rgba(15,23,42,.1);
        }

        .gallery-card-image {
          position: relative;
          height: 315px;
          overflow: hidden;
          background: #edf2f6;
        }

        .gallery-card-photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition:
            transform .8s cubic-bezier(.2,.7,.2,1),
            filter .5s ease;
        }

        .gallery-card:hover .gallery-card-photo {
          transform: scale(1.075);
          filter: saturate(1.08);
        }

        .gallery-card-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              to bottom,
              rgba(0,0,0,.32),
              transparent 35%,
              transparent 45%,
              rgba(0,0,0,.55)
            );
          pointer-events: none;
        }

        .gallery-card-top {
          position: absolute;
          left: 15px;
          top: 15px;
          right: 15px;
          display: flex;
          gap: 7px;
          flex-wrap: wrap;
        }

        .gallery-card-category,
        .gallery-card-subcategory {
          padding: 7px 10px;
          border-radius: 999px;
          color: white;
          background: rgba(10,20,30,.45);
          border: 1px solid rgba(255,255,255,.18);
          backdrop-filter: blur(12px);
          font-size: 10px;
          font-weight: 900;
          letter-spacing: .05em;
        }

        .gallery-card-subcategory {
          color: #1e3347;
          background: rgba(233,196,106,.9);
          border-color: transparent;
        }

        .gallery-card-count {
          position: absolute;
          right: 15px;
          bottom: 15px;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 10px;
          border-radius: 999px;
          color: white;
          background: rgba(10,20,30,.5);
          backdrop-filter: blur(12px);
          font-size: 11px;
          font-weight: 800;
        }

        .gallery-card-open {
          position: absolute;
          left: 50%;
          bottom: 50%;
          transform: translate(-50%, 50%) scale(.9);
          opacity: 0;
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 12px 16px;
          border: 1px solid rgba(255,255,255,.25);
          border-radius: 13px;
          color: #14263a;
          background: rgba(255,255,255,.93);
          backdrop-filter: blur(10px);
          cursor: pointer;
          font-size: 12px;
          font-weight: 900;
          white-space: nowrap;
          transition:
            opacity .3s ease,
            transform .3s ease;
        }

        .gallery-card:hover .gallery-card-open {
          opacity: 1;
          transform: translate(-50%, 50%) scale(1);
        }

        .gallery-card-open:disabled {
          cursor: not-allowed;
        }

        .gallery-card-dots {
          position: absolute;
          left: 50%;
          bottom: 17px;
          transform: translateX(-50%);
          display: flex;
          gap: 5px;
        }

        .gallery-card-dots span {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: rgba(255,255,255,.45);
          transition: width .25s ease;
        }

        .gallery-card-dots span.active {
          width: 16px;
          border-radius: 10px;
          background: #fff;
        }

        .gallery-card-content {
          padding: 21px 22px 20px;
        }

        .gallery-card-date {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #98a2b3;
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: .11em;
        }

        .gallery-card-date span {
          width: 20px;
          height: 2px;
          border-radius: 99px;
          background: linear-gradient(
            90deg,
            #2d6a4f,
            #e9c46a
          );
        }

        .gallery-card-content h3 {
          margin: 9px 0 7px;
          color: #111827;
          font-size: 23px;
          line-height: 1.1;
          letter-spacing: -.03em;
          font-weight: 900;
        }

        .gallery-card-content p {
          min-height: 45px;
          margin: 0;
          color: #667085;
          font-size: 13px;
          line-height: 1.65;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .gallery-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 18px;
          padding-top: 14px;
          border-top: 1px solid #eef1f4;
          color: #98a2b3;
          font-size: 11px;
          font-weight: 800;
        }

        .gallery-card-footer button {
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 0;
          border-radius: 10px;
          color: white;
          background: #173b5f;
          cursor: pointer;
          transition:
            transform .25s ease,
            background .25s ease;
        }

        .gallery-card-footer button:hover {
          transform: rotate(8deg) scale(1.08);
          background: #2d6a4f;
        }

        .gallery-card-footer button:disabled {
          opacity: .4;
          cursor: not-allowed;
        }

        /* ================= EMPTY ================= */

        .gallery-image-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: #b6c1cc;
          background:
            radial-gradient(
              circle at center,
              #f8fafc,
              #edf2f6
            );
        }

        .gallery-image-placeholder span {
          font-size: 11px;
          font-weight: 700;
        }

        .gallery-empty-state {
          grid-column: 1 / -1;
          padding: 80px 30px;
          border: 2px dashed #e0e6eb;
          border-radius: 25px;
          text-align: center;
          background: #fafbfc;
        }

        .gallery-empty-icon {
          width: 75px;
          height: 75px;
          margin: 0 auto 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 24px;
          color: #9aa7b5;
          background: #edf2f6;
        }

        .gallery-empty-state h3 {
          margin: 0;
          font-size: 22px;
          font-weight: 900;
        }

        .gallery-empty-state p {
          margin: 8px auto 0;
          max-width: 450px;
          color: #7d8995;
          font-size: 14px;
        }

        /* ================= MODAL ================= */

        .gallery-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          overflow-y: auto;
          background: rgba(8,18,28,.82);
          backdrop-filter: blur(15px);
        }

        .gallery-modal {
          position: relative;
          width: min(1120px, 100%);
          display: grid;
          grid-template-columns: 1.45fr .8fr;
          overflow: hidden;
          border-radius: 28px;
          background: white;
          box-shadow:
            0 40px 120px rgba(0,0,0,.35);
        }

        .gallery-modal-close {
          position: absolute;
          z-index: 5;
          right: 15px;
          top: 15px;
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255,255,255,.2);
          border-radius: 50%;
          color: white;
          background: rgba(0,0,0,.42);
          cursor: pointer;
          backdrop-filter: blur(10px);
          transition:
            transform .25s ease,
            background .25s ease;
        }

        .gallery-modal-close:hover {
          transform: rotate(90deg);
          background: #dc2626;
        }

        .gallery-modal-image-area {
          position: relative;
          min-height: 620px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 30px;
          overflow: hidden;
          background:
            radial-gradient(
              circle at center,
              #193b54,
              #07131e 70%
            );
        }

        .gallery-modal-image-button {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 0;
          background: transparent;
          cursor: zoom-in;
        }

        .gallery-modal-image {
          width: 100%;
          max-height: 550px;
          object-fit: contain;
          border-radius: 14px;
          box-shadow: 0 25px 70px rgba(0,0,0,.3);
        }

        .gallery-zoom-hint {
          position: absolute;
          right: 15px;
          bottom: 15px;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 11px;
          border-radius: 10px;
          color: rgba(255,255,255,.7);
          background: rgba(0,0,0,.35);
          font-size: 10px;
          font-weight: 700;
        }

        .gallery-modal-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 45px;
          height: 45px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 0;
          border-radius: 50%;
          color: #172536;
          background: rgba(255,255,255,.93);
          cursor: pointer;
          box-shadow: 0 10px 25px rgba(0,0,0,.2);
          transition: transform .25s ease;
        }

        .gallery-modal-arrow:hover {
          transform: translateY(-50%) scale(1.1);
        }

        .gallery-modal-arrow.left {
          left: 18px;
        }

        .gallery-modal-arrow.right {
          right: 18px;
        }

        .gallery-modal-counter {
          position: absolute;
          left: 50%;
          bottom: 18px;
          transform: translateX(-50%);
          padding: 7px 12px;
          border-radius: 999px;
          color: white;
          background: rgba(0,0,0,.45);
          backdrop-filter: blur(10px);
          font-size: 11px;
          font-weight: 800;
        }

        .gallery-modal-details {
          padding: 42px 30px 30px;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          max-height: 620px;
        }

        .gallery-modal-category {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #2d6a4f;
          font-size: 11px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: .08em;
        }

        .gallery-modal-details h2 {
          margin: 13px 0 12px;
          font-size: 34px;
          line-height: 1;
          letter-spacing: -.04em;
          font-weight: 900;
        }

        .gallery-modal-details > p {
          color: #667085;
          font-size: 13px;
          line-height: 1.8;
        }

        .gallery-modal-thumbnails {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 7px;
          max-height: 185px;
          overflow-y: auto;
          margin-top: 20px;
          padding-right: 2px;
        }

        .gallery-modal-thumbnails button {
          height: 68px;
          padding: 0;
          overflow: hidden;
          border: 2px solid transparent;
          border-radius: 11px;
          background: #edf2f6;
          cursor: pointer;
          opacity: .65;
          transition:
            opacity .2s ease,
            transform .2s ease,
            border-color .2s ease;
        }

        .gallery-modal-thumbnails button:hover {
          opacity: 1;
          transform: translateY(-2px);
        }

        .gallery-modal-thumbnails button.active {
          opacity: 1;
          border-color: #2d6a4f;
        }

        .gallery-modal-thumbnails img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .gallery-download-button {
          margin-top: auto;
          padding: 13px 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: 0;
          border-radius: 13px;
          color: white;
          background: linear-gradient(
            135deg,
            #173b5f,
            #2d6a4f
          );
          cursor: pointer;
          font-size: 12px;
          font-weight: 900;
          transition:
            transform .25s ease,
            box-shadow .25s ease;
        }

        .gallery-download-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 25px rgba(23,59,95,.2);
        }

        .gallery-download-button:disabled {
          opacity: .45;
          cursor: not-allowed;
        }

        /* ================= ZOOM ================= */

        .gallery-zoom-viewer {
          position: fixed;
          inset: 0;
          z-index: 100000;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: rgba(0,0,0,.95);
          backdrop-filter: blur(12px);
        }

        .gallery-zoom-image {
          max-width: 90vw;
          max-height: 84vh;
          object-fit: contain;
          border-radius: 12px;
          box-shadow: 0 30px 100px rgba(0,0,0,.5);
          cursor: zoom-out;
        }

        .gallery-zoom-close {
          position: absolute;
          z-index: 5;
          top: 18px;
          right: 18px;
          width: 46px;
          height: 46px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 0;
          border-radius: 50%;
          color: white;
          background: #dc2626;
          cursor: pointer;
        }

        .gallery-zoom-controls {
          position: absolute;
          z-index: 5;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 7px;
          border: 1px solid rgba(255,255,255,.12);
          border-radius: 15px;
          background: rgba(255,255,255,.95);
          box-shadow: 0 15px 45px rgba(0,0,0,.25);
        }

        .gallery-zoom-controls button {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 0;
          border-radius: 10px;
          color: #173b5f;
          background: #eef2f5;
          cursor: pointer;
        }

        .gallery-zoom-controls span {
          min-width: 55px;
          text-align: center;
          color: #475467;
          font-size: 11px;
          font-weight: 900;
        }

        /* ================= BOTTOM ================= */

        .gallery-bottom-banner {
          position: relative;
          overflow: hidden;
          min-height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
          background:
            linear-gradient(
              135deg,
              #112f49,
              #1d536f
            );
        }

        .gallery-bottom-glow {
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: rgba(233,196,106,.12);
          filter: blur(80px);
        }

        .gallery-bottom-content {
          position: relative;
          z-index: 2;
          width: min(650px, calc(100% - 40px));
          padding: 60px 0;
          text-align: center;
          color: white;
        }

        .gallery-bottom-content > svg {
          color: #e9c46a;
          margin-bottom: 13px;
        }

        .gallery-bottom-content h2 {
          margin: 0;
          font-size: clamp(30px, 4vw, 48px);
          letter-spacing: -.045em;
          font-weight: 900;
        }

        .gallery-bottom-content p {
          margin: 13px auto 0;
          color: rgba(255,255,255,.62);
          font-size: 14px;
          line-height: 1.7;
        }

        /* ================= RESPONSIVE ================= */

        @media (max-width: 1050px) {
          .gallery-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .gallery-achievement-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .gallery-modal {
            grid-template-columns: 1fr;
          }

          .gallery-modal-image-area {
            min-height: 470px;
          }

          .gallery-modal-details {
            max-height: none;
          }
        }

        @media (max-width: 700px) {
          .gallery-section-shell {
            width: min(100% - 28px, 1400px);
          }

          .gallery-hero-modern {
            min-height: 690px;
          }

          .gallery-hero-content {
            width: calc(100% - 28px);
            padding-top: 100px;
          }

          .gallery-hero-title {
            font-size: clamp(52px, 17vw, 85px);
          }

          .gallery-hero-subtitle {
            font-size: 17px;
          }

          .gallery-hero-actions {
            flex-direction: column;
          }

          .gallery-primary-button,
          .gallery-hero-pill {
            width: 100%;
            justify-content: center;
          }

          .gallery-hero-stats {
            gap: 17px;
            margin-top: 38px;
          }

          .gallery-hero-stats strong {
            font-size: 21px;
          }

          .gallery-achievements-section,
          .gallery-main-section {
            padding: 70px 0;
          }

          .gallery-achievement-grid {
            grid-template-columns: 1fr 1fr;
            gap: 10px;
          }

          .gallery-achievement-card {
            padding: 23px 13px;
            border-radius: 18px;
          }

          .gallery-grid {
            grid-template-columns: 1fr;
          }

          .gallery-card-image {
            height: 300px;
          }

          .gallery-modal-backdrop {
            padding: 8px;
          }

          .gallery-modal {
            border-radius: 20px;
          }

          .gallery-modal-image-area {
            min-height: 350px;
            padding: 20px;
          }

          .gallery-modal-details {
            padding: 28px 20px 20px;
          }

          .gallery-modal-details h2 {
            font-size: 29px;
          }

          .gallery-scroll-indicator {
            display: none;
          }
        }

        @media (max-width: 430px) {
          .gallery-achievement-grid {
            grid-template-columns: 1fr;
          }

          .gallery-tabs-wrap {
            justify-content: flex-start;
            overflow-x: auto;
            flex-wrap: nowrap;
            padding: 3px 2px 8px;
          }

          .gallery-tab {
            flex: 0 0 auto;
          }

          .gallery-hero-stats {
            gap: 12px;
          }

          .gallery-hero-stats span {
            font-size: 9px;
            letter-spacing: .08em;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .gallery-page *,
          .gallery-page *::before,
          .gallery-page *::after {
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: .01ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </>
  );
}

export { Gallery };