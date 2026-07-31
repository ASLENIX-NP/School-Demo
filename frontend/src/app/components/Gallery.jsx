import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "motion/react";
import {
  Camera,
  Sparkles,
  X,
  Layers,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Download,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

const colors = {
  red: "#D71920",
  green: "#168A3A",
  purple: "#4B2E83",
  dark: "#0B1020",
  cream: "#FFF8EE",
};

const DEFAULT_GALLERY_CATEGORIES = ["Classroom", "Events", "Certificate"];
// Subcategories are allowed for every saved category except the virtual "All" tab.

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
    "Explore classroom learning, school events, certificates, achievements, and student life at Baljagriti English Secondary School.",

  categories: DEFAULT_GALLERY_CATEGORIES,
  categoryDescriptions: fallbackCategoryDescriptions,
  subcategories: fallbackSubcategories,

  images: [],

  bottomTitle: "School Memories",
  bottomDescription:
    "Gallery images are updated by the school administration to highlight student life and school activities.",
  bottomNote: "Click image to preview",
};

function normalizeCategories(categories = null) {
  const hasSavedCategories = Array.isArray(categories);

  const cleaned = (hasSavedCategories ? categories : DEFAULT_GALLERY_CATEGORIES)
    .map((item) => String(item || "").trim())
    .filter(Boolean)
    .filter((item) => item.toLowerCase() !== "all");

  const uniqueCategories = Array.from(new Set(cleaned));

  return uniqueCategories.length > 0
    ? uniqueCategories
    : [...DEFAULT_GALLERY_CATEGORIES];
}

function normalizeImageCategory(category, categories = []) {
  const clean = String(category || "").trim();
  const validCategories = normalizeCategories(categories);

  if (validCategories.includes(clean)) {
    return clean;
  }

  const legacyMap = {
    Sports: "Events",
    ECA: "Events",
    Facilities: "Classroom",
  };

  const normalizedCategories = normalizeCategories(categories);
  return legacyMap[clean] || normalizedCategories[0] || "Classroom";
}

function normalizeCategoryDescriptions(descriptions = {}, categories = []) {
  return normalizeCategories(categories).reduce((acc, category) => {
    acc[category] =
      descriptions?.[category] || fallbackCategoryDescriptions[category] || "";
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
        const name =
          typeof item === "string" ? item : String(item?.name || "").trim();

        if (!name) return null;

        return {
          id:
            item?.id ||
            `${category.toLowerCase()}-${index}-${name
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")}`,
          name,
          description:
            typeof item === "string"
              ? ""
              : item?.description ||
                `Photos and memories from ${name.toLowerCase()}.`,
          visible: item?.visible !== false,
        };
      })
      .filter(Boolean);

    return acc;
  }, {});
}

function mergeGalleryContent(saved = {}) {
  const categories = normalizeCategories(saved.categories);

  const categoryDescriptions = normalizeCategoryDescriptions(
    saved.categoryDescriptions,
    categories
  );

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
          images:
            Array.isArray(image.images) && image.images.length > 0
              ? image.images
              : image.image
              ? [image.image]
              : [],
        }))
      : [],
  };
}

function HighlightedTitle({ title, highlightedText }) {
  if (!highlightedText || !title.includes(highlightedText)) {
    return <>{title}</>;
  }

  const [before, after] = title.split(highlightedText);

  return (
    <>
      {before}
      <span className="italic" style={{ color: colors.red }}>
        {highlightedText}
      </span>
      {after}
    </>
  );
}

function getImageUrls(item) {
  if (Array.isArray(item.images) && item.images.length > 0) {
    return item.images.filter(Boolean);
  }

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

function SmoothLoadedImage({
  src,
  alt,
  className = "",
  style = {},
  fallback = null,
  ...props
}) {
  const cleanSrc = String(src || "").trim();
  const [displaySrc, setDisplaySrc] = useState(cleanSrc);
  const [waitingForSrc, setWaitingForSrc] = useState("");

  useEffect(() => {
    if (!cleanSrc) {
      setDisplaySrc("");
      setWaitingForSrc("");
      return undefined;
    }

    if (cleanSrc === displaySrc) {
      setWaitingForSrc("");
      return undefined;
    }

    let alive = true;
    const image = new Image();

    setWaitingForSrc(cleanSrc);

    image.onload = () => {
      if (!alive) return;

      setDisplaySrc(cleanSrc);
      setWaitingForSrc("");
    };

    image.onerror = () => {
      if (!alive) return;

      setWaitingForSrc("");
    };

    image.src = cleanSrc;

    if (image.complete) {
      setDisplaySrc(cleanSrc);
      setWaitingForSrc("");
    }

    return () => {
      alive = false;
    };
  }, [cleanSrc, displaySrc]);

  if (!displaySrc) return fallback;

  return (
    <img
      {...props}
      src={displaySrc}
      alt={alt}
      className={className}
      style={{
        ...style,
        opacity: waitingForSrc ? 0.96 : 1,
        transition:
          style?.transition ||
          "opacity 220ms ease-out, transform 700ms ease-out",
      }}
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
  const visibleImages = (content.images || []).filter(
    (item) => item.visible !== false
  );

  const categoryItems = visibleImages.filter(
    (item) =>
      normalizeImageCategory(item.category, content.categories) === category
  );

  const photos = collectAlbumPhotos(categoryItems, category, category);

  const cover =
    categoryItems.find((item) => item.image)?.image || photos[0]?.url || "";

  return {
    category,
    subcategory: "",
    title: category,
    date: categoryItems[0]?.date || "School Gallery",
    description:
      content.categoryDescriptions?.[category] ||
      fallbackCategoryDescriptions[category] ||
      "Explore school moments from this category.",
    cover,
    photos,
    total: photos.length,
  };
}

function buildMainCategoryAlbums(content) {
  return normalizeCategories(content.categories).map((category) =>
    buildSingleCategoryAlbum(content, category)
  );
}

function buildSubcategoryAlbums(content, parentCategory) {
  const visibleImages = (content.images || []).filter(
    (item) => item.visible !== false
  );

  const parentItems = visibleImages.filter(
    (item) =>
      normalizeImageCategory(item.category, content.categories) ===
      parentCategory
  );

  const subcategoryList =
    normalizeSubcategories(content.subcategories, content.categories)[parentCategory] || [];

  if (subcategoryList.length === 0) {
    return [buildSingleCategoryAlbum(content, parentCategory)];
  }

  const albums = subcategoryList
    .filter((sub) => sub.visible !== false)
    .map((sub) => {
      const subItems = parentItems.filter(
        (item) => String(item.subcategory || "").trim() === sub.name
      );

      const photos = collectAlbumPhotos(subItems, parentCategory, sub.name);

      const cover =
        subItems.find((item) => item.image)?.image || photos[0]?.url || "";

      return {
        category: parentCategory,
        subcategory: sub.name,
        title: sub.name,
        date: subItems[0]?.date || parentCategory,
        description:
          sub.description ||
          `Photos and memories from ${sub.name.toLowerCase()}.`,
        cover,
        photos,
        total: photos.length,
      };
    });

  const uncategorizedItems = parentItems.filter(
    (item) => !String(item.subcategory || "").trim()
  );

  if (uncategorizedItems.length > 0) {
    const photos = collectAlbumPhotos(
      uncategorizedItems,
      parentCategory,
      parentCategory
    );

    albums.push({
      category: parentCategory,
      subcategory: "",
      title: `General ${parentCategory}`,
      date: uncategorizedItems[0]?.date || parentCategory,
      description:
        content.categoryDescriptions?.[parentCategory] ||
        fallbackCategoryDescriptions[parentCategory],
      cover:
        uncategorizedItems.find((item) => item.image)?.image ||
        photos[0]?.url ||
        "",
      photos,
      total: photos.length,
    });
  }

  return albums;
}

function buildCategoryAlbums(content, activeCategory) {
  if (activeCategory === "All") {
    return buildMainCategoryAlbums(content);
  }

  const subcategoryList =
    normalizeSubcategories(content.subcategories, content.categories)[activeCategory] || [];

  if (subcategoryList.length > 0) {
    return buildSubcategoryAlbums(content, activeCategory);
  }

  return [buildSingleCategoryAlbum(content, activeCategory)];
}

function GalleryCategoryCard({ album, index, onClick }) {
  const [currentImage, setCurrentImage] = useState(0);

  const photoUrls = useMemo(
    () =>
      Array.isArray(album.photos)
        ? album.photos.map((photo) => photo?.url).filter(Boolean)
        : [],
    [album.photos]
  );

  const currentImageUrl =
    photoUrls.length > 0 ? photoUrls[currentImage] || album.cover : album.cover;

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
    }, 3500);

    return () => window.clearInterval(interval);
  }, [photoUrls.join("|")]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`grid lg:grid-cols-2 gap-12 items-center ${
        index % 2 !== 0 ? "lg:[&>*:first-child]:order-2" : ""
      }`}
    >
      <div className="overflow-hidden rounded-[32px] shadow-2xl bg-white">
        {currentImageUrl ? (
          <SmoothLoadedImage
            src={currentImageUrl}
            alt={album.title}
            className="w-full h-[450px] object-cover hover:scale-105"
            fallback={
              <div className="w-full h-[450px] bg-slate-100 flex items-center justify-center">
                <ImageIcon className="w-16 h-16 text-slate-300" />
              </div>
            }
          />
        ) : (
          <div className="w-full h-[450px] bg-slate-100 flex items-center justify-center">
            <ImageIcon className="w-16 h-16 text-slate-300" />
          </div>
        )}
      </div>

      <div>
        <div className="flex flex-wrap gap-2">
          <span className="px-4 py-2 rounded-full bg-green-100 text-green-700 font-semibold">
            {album.category}
          </span>

          {album.subcategory && (
            <span className="px-4 py-2 rounded-full bg-purple-100 text-purple-700 font-semibold">
              {album.subcategory}
            </span>
          )}
        </div>

        <h2 className="text-5xl font-black text-slate-900 mt-5">
          {album.title}
        </h2>

        <p className="text-slate-500 mt-3">{album.date}</p>

        <p className="text-lg text-slate-600 mt-6 leading-relaxed">
          {album.description}
        </p>

        <button
          type="button"
          disabled={album.total === 0}
          onClick={() => {
            if (album.total > 0) onClick(album);
          }}
          className="mt-8 px-6 py-3 rounded-xl text-white font-bold relative z-50 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background:
              album.total > 0
                ? `linear-gradient(135deg, ${colors.red}, ${colors.green})`
                : "rgba(100,116,139,0.75)",
          }}
        >
          {album.total > 0 ? `View Album (${album.total})` : "No Images Added"}
        </button>
      </div>
    </motion.div>
  );
}

function Gallery() {
  const [content, setContent] = useState(defaultGalleryContent);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);

  const lastThumbnailTapRef = useRef({
    index: null,
    time: 0,
  });

  useEffect(() => {
    const loadGalleryContent = async () => {
      try {
        const res = await axios.get(
          "https://school-website-backend-ixx2.onrender.com/api/site-content/gallery",
          {
            timeout: 12000,
          }
        );

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

  const filteredAlbums = useMemo(
    () => buildCategoryAlbums(content, activeCategory),
    [content, activeCategory]
  );

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

    setCurrentImageIndex((prev) =>
      prev === 0 ? selectedAlbum.photos.length - 1 : prev - 1
    );
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
  const isTouchScreen =
    window.matchMedia?.("(hover: none), (pointer: coarse)")?.matches || false;

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

    lastThumbnailTapRef.current = {
      index: null,
      time: 0,
    };

    return;
  }

  setCurrentImageIndex(index);
  setZoomScale(1);

  lastThumbnailTapRef.current = {
    index,
    time: now,
  };
};

  const downloadImage = async (photo = currentPhoto) => {
    if (!photo?.url) return;

    const cleanTitle = String(photo.title || selectedAlbum?.title || "gallery")
      .trim()
      .replace(/[^a-z0-9]+/gi, "-")
      .replace(/^-+|-+$/g, "")
      .toLowerCase();

    const fileName = `${cleanTitle || "gallery-image"}-${
      currentImageIndex + 1
    }.jpg`;

    try {
      const response = await fetch(photo.url, {
        mode: "cors",
      });

      if (!response.ok) {
        throw new Error("Image fetch failed");
      }

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

  return (
    <section
      id="gallery"
      className="min-h-screen pt-32 pb-24 relative overflow-hidden"
      style={{
        background: `
          radial-gradient(circle at top right, rgba(124,92,196,0.18), transparent 34%),
          radial-gradient(circle at bottom left, rgba(22,138,58,0.14), transparent 32%),
          linear-gradient(180deg, #FFF8EE 0%, #F1ECFF 100%)
        `,
      }}
    >
      <div
        className="absolute top-0 right-0 w-[520px] h-[520px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(75,46,131,0.12), transparent 70%)",
          filter: "blur(8px)",
        }}
      />

      <div
        className="absolute bottom-0 left-0 w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(22,138,58,0.11), transparent 70%)",
          filter: "blur(8px)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="text-center mb-12"
        >
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-5"
            style={{
              background: "rgba(75,46,131,0.09)",
              color: colors.purple,
              border: "1px solid rgba(75,46,131,0.16)",
            }}
          >
            <Camera className="w-4 h-4" />
            {content.badge}
          </span>

          <h1
            className="text-4xl md:text-6xl mb-4"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 850,
              color: colors.dark,
              letterSpacing: "-0.045em",
            }}
          >
            <HighlightedTitle
              title={content.title}
              highlightedText={content.highlightedText}
            />
          </h1>

          <p className="max-w-3xl mx-auto text-base md:text-lg text-slate-500 leading-relaxed">
            {content.description}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => {
            const active = activeCategory === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className="px-5 py-3 rounded-2xl text-sm font-bold transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  color: active ? "#FFFFFF" : colors.dark,
                  background: active
                    ? `linear-gradient(135deg, ${colors.red}, ${colors.green})`
                    : "linear-gradient(145deg, rgba(255,255,255,0.92), rgba(255,255,255,0.68))",
                  border: active
                    ? "1px solid rgba(255,255,255,0.2)"
                    : "1px solid rgba(11,16,32,0.08)",
                  boxShadow: active
                    ? "0 16px 38px rgba(22,138,58,0.22)"
                    : "0 10px 28px rgba(11,16,32,0.06)",
                  backdropFilter: "blur(14px)",
                }}
              >
                {category}
              </button>
            );
          })}
        </motion.div>

        <div
          className="rounded-[2rem] p-4 md:p-5"
          style={{
            background:
              "linear-gradient(145deg, rgba(255,255,255,0.38), rgba(255,255,255,0.16))",
            border: "1px solid rgba(255,255,255,0.45)",
            boxShadow:
              "0 24px 80px rgba(11,16,32,0.1), inset 0 1px 0 rgba(255,255,255,0.72)",
            backdropFilter: "blur(18px)",
          }}
        >
          {filteredAlbums.length > 0 ? (
            <div className="space-y-24">
              {filteredAlbums.map((album, index) => (
                <GalleryCategoryCard
                  key={`${album.category}-${album.subcategory || album.title}`}
                  album={album}
                  index={index}
                  onClick={openAlbum}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-10 text-center">
              <ImageIcon className="w-14 h-14 mx-auto text-slate-300 mb-4" />
              <div className="font-bold text-slate-800">
                No gallery images found.
              </div>
              <div className="text-sm text-slate-500 mt-1">
                Please check another category.
              </div>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedAlbum && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeAlbum}
            className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center p-2 sm:p-5 overflow-y-auto"
            style={{
              background: "rgba(2,6,23,0.82)",
              backdropFilter: "blur(12px)",
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 24 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-6xl rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden max-h-[96vh] overflow-y-auto"
              style={{
                background: "#FFFFFF",
                boxShadow: "0 35px 100px rgba(0,0,0,0.42)",
              }}
            >
              <button
                type="button"
                onClick={closeAlbum}
                className="absolute top-3 right-3 sm:top-5 sm:right-5 z-[99999] w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-2xl cursor-pointer font-bold hover:bg-red-500 hover:text-white hover:rotate-180 hover:scale-110 transition-all duration-500 flex items-center justify-center"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-0">
                <div className="relative bg-slate-950 min-h-[220px] sm:min-h-[320px] lg:min-h-[520px] flex items-center justify-center p-3 sm:p-5">
                  {currentPhoto?.url ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openImageInsidePage(currentImageIndex);
                      }}
                      title="Click to view this image"
                      className="w-full flex items-center justify-center cursor-zoom-in"
                    >
                      <SmoothLoadedImage
                        src={currentPhoto.url}
                        alt={currentPhoto.title || selectedAlbum.title}
                        decoding="async"
                        className="w-full max-h-[220px] sm:max-h-[420px] lg:max-h-[560px] object-contain rounded-2xl"
                        fallback={
                          <div className="w-full min-h-[220px] sm:min-h-[320px] flex items-center justify-center">
                            <ImageIcon className="w-12 h-12 text-slate-500" />
                          </div>
                        }
                      />
                    </button>
                  ) : (
                    <ImageIcon className="w-12 h-12 sm:w-16 sm:h-16 text-slate-500" />
                  )}

                  {selectedAlbum.photos.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={previousImage}
                        className="absolute left-2 sm:left-5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-white shadow-2xl hover:scale-110 transition-all flex items-center justify-center"
                      >
                        <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
                      </button>

                      <button
                        type="button"
                        onClick={nextImage}
                        className="absolute right-2 sm:right-5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-white shadow-2xl hover:scale-110 transition-all flex items-center justify-center"
                      >
                        <ChevronRight size={20} className="sm:w-6 sm:h-6" />
                      </button>
                    </>
                  )}
                </div>

                <div className="p-4 sm:p-6">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-bold"
                      style={{
                        background: "rgba(22,138,58,0.09)",
                        color: colors.green,
                        border: "1px solid rgba(22,138,58,0.16)",
                      }}
                    >
                      {selectedAlbum.category}
                    </span>

                    {selectedAlbum.subcategory && (
                      <span
                        className="px-3 py-1 rounded-full text-xs font-bold"
                        style={{
                          background: "rgba(75,46,131,0.09)",
                          color: colors.purple,
                          border: "1px solid rgba(75,46,131,0.16)",
                        }}
                      >
                        {selectedAlbum.subcategory}
                      </span>
                    )}

                    <span className="text-sm text-slate-500">
                      {currentPhoto?.date || selectedAlbum.date}
                    </span>
                  </div>

                  <h2
                    className="text-2xl sm:text-3xl"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 850,
                      color: colors.dark,
                      letterSpacing: "-0.035em",
                    }}
                  >
                    {selectedAlbum.title}
                  </h2>

                  <p className="text-slate-600 mt-4 leading-relaxed">
                    {selectedAlbum.description}
                  </p>

                  <div className="mt-5 text-sm font-bold text-slate-500">
                    {currentImageIndex + 1} of {selectedAlbum.photos.length}
                  </div>

                  <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-5 max-h-[220px] sm:max-h-[300px] overflow-y-auto pr-1">
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
  title="Double tap to view this image"
  className="rounded-2xl overflow-hidden border-2 bg-slate-100"
                        style={{
                          borderColor:
                            currentImageIndex === index
                              ? colors.green
                              : "rgba(15,23,42,0.08)",
                        }}
                      >
                        <img
                          src={photo.url}
                          alt=""
                          className="w-full h-16 sm:h-24 object-cover"
                        />
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
                    className="mt-6 w-full px-5 py-3 rounded-2xl font-bold text-white flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: `linear-gradient(135deg, ${colors.purple}, ${colors.green})`,
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

      <AnimatePresence>
        {zoomOpen && currentPhoto?.url && selectedAlbum && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setZoomOpen(false);
              setZoomScale(1);
            }}
            className="fixed inset-0 z-[999999] bg-black/92 flex items-center justify-center p-3 sm:p-6 overflow-hidden"
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setZoomOpen(false);
                setZoomScale(1);
              }}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white flex items-center justify-center hover:bg-red-500 hover:text-white hover:rotate-180 transition-all duration-500 z-50"
            >
              <X size={24} />
            </button>

            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-50 rounded-2xl px-4 py-3 bg-white/95 shadow-2xl max-w-[70vw]">
              <div className="text-sm sm:text-base font-black text-slate-950 truncate">
                {currentPhoto.title || selectedAlbum.title}
              </div>
              <div className="text-xs sm:text-sm text-slate-500 mt-1">
                {currentImageIndex + 1} of {selectedAlbum.photos.length}
              </div>
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-white/95 rounded-2xl p-2 shadow-2xl">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setZoomScale((prev) => Math.max(1, prev - 0.25));
                }}
                className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200"
              >
                <ZoomOut size={20} />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setZoomScale((prev) => Math.min(3, prev + 0.25));
                }}
                className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200"
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
                style={{
                  background: `linear-gradient(135deg, ${colors.purple}, ${colors.green})`,
                }}
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
                  className="absolute left-3 sm:left-8 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white shadow-2xl hover:scale-110 transition-all z-50 flex items-center justify-center"
                >
                  <ChevronLeft size={32} />
                </button>

                <button
                  type="button"
                  onClick={nextImage}
                  className="absolute right-3 sm:right-8 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white shadow-2xl hover:scale-110 transition-all z-50 flex items-center justify-center"
                >
                  <ChevronRight size={32} />
                </button>
              </>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={currentPhoto.url}
                initial={{ opacity: 0, scale: 0.96, x: 18 }}
                animate={{ opacity: 1, scale: zoomScale, x: 0 }}
                exit={{ opacity: 0, scale: 0.96, x: -18 }}
                transition={{ duration: 0.18 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  cursor: zoomScale > 1 ? "grab" : "default",
                }}
              >
                <SmoothLoadedImage
                  src={currentPhoto.url}
                  alt={currentPhoto.title || selectedAlbum.title}
                  className="max-w-[92vw] max-h-[82vh] rounded-3xl shadow-2xl object-contain"
                  fallback={
                    <div className="w-[70vw] h-[60vh] rounded-3xl bg-slate-900 flex items-center justify-center">
                      <ImageIcon className="w-16 h-16 text-slate-500" />
                    </div>
                  }
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export { Gallery };
export default Gallery;


