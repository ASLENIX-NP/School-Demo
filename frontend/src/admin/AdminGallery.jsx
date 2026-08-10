import { useEffect, useMemo, useState } from "react";
import api from "../lib/api";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  Save,
  Upload,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle2,
  Plus,
  Image as ImageIcon,
  AlertTriangle,
  Camera,
  Edit3,
  X,
  Trophy,
  Award,
  Star,
  BookOpen,
  CalendarDays,
  Grid3X3,
  Sparkles,
  Layers,
  ExternalLink,
} from "lucide-react";

/*
|--------------------------------------------------------------------------
| ADMIN GALLERY - SINGLE PAGE
|--------------------------------------------------------------------------
| Everything is edited from this page:
|
| 1. Hero
| 2. Achievements
| 3. Gallery heading
| 4. Categories
| 5. Subcategories
| 6. Upload images
| 7. Replace images
| 8. Move images between categories/subcategories
| 9. Hide/show images
| 10. Delete one/multiple images
| 11. Bottom section
|
| IMPORTANT:
| - The separate /admin/gallery-images page is no longer required.
| - Images are managed directly below the gallery preview.
| - Existing backend endpoints are preserved:
|       GET /api/site-content/gallery
|       PUT /api/site-content/gallery
|       POST /api/upload
|--------------------------------------------------------------------------
*/

const DEFAULT_CATEGORIES = ["Classroom", "Events", "Certificate"];

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

const defaultAchievements = [
  { id: "1", title: "Top School Award", year: "2024", icon: "Trophy" },
  { id: "2", title: "STEM Excellence", year: "2023", icon: "Award" },
  { id: "3", title: "Sports Champion", year: "2024", icon: "Trophy" },
  { id: "4", title: "Community Service", year: "2023", icon: "Star" },
];

const defaultContent = {
  heroBadge: "INTERACTIVE GALLERY",
  heroTitle: "Smriti School",
  heroHighlightedText: "Smriti",
  heroSubtitle: "Moments that become memories",
  heroExploreText: "Explore Moments",
  heroAchievementText: "Celebrate Achievements",

  badge: "School Gallery",
  title: "Stories",
  highlightedText: "Stories",
  description:
    "Explore classroom learning, school events, certificates, achievements, and student life at Smriti Secondary English Boarding School.",

  categories: DEFAULT_CATEGORIES,
  categoryDescriptions: fallbackCategoryDescriptions,
  subcategories: fallbackSubcategories,
  achievements: defaultAchievements,

  images: [],

  bottomTitle: "Every picture tells a story.",
  bottomDescription:
    "Explore the moments, celebrate the achievements, and remember the journey.",
  bottomNote: "Gallery is managed by the school administration.",
};

function normalizeCategories(value) {
  const source = Array.isArray(value) ? value : DEFAULT_CATEGORIES;

  const result = [
    ...new Set(
      source
        .map((item) => String(item || "").trim())
        .filter(Boolean)
        .filter((item) => item.toLowerCase() !== "all")
    ),
  ];

  return result.length ? result : [...DEFAULT_CATEGORIES];
}

function normalizeSubcategories(value, categories) {
  const cats = normalizeCategories(categories);

  return cats.reduce((output, category) => {
    const source = Array.isArray(value?.[category])
      ? value[category]
      : fallbackSubcategories[category] || [];

    output[category] = source
      .map((item, index) => {
        const name =
          typeof item === "string"
            ? item.trim()
            : String(item?.name || "").trim();

        if (!name) return null;

        return {
          id:
            item?.id ||
            `${category}-${index}-${name
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")}`,
          name,
          description:
            typeof item === "string"
              ? ""
              : item?.description || "",
          visible: item?.visible !== false,
        };
      })
      .filter(Boolean);

    return output;
  }, {});
}

function normalizeImages(images, categories) {
  const cats = normalizeCategories(categories);

  if (!Array.isArray(images)) return [];

  return images.map((item, index) => ({
    ...item,
    id: item?.id || `gallery-${index}`,
    category: cats.includes(item?.category)
      ? item.category
      : cats[0],
    subcategory: item?.subcategory || "",
    visible: item?.visible !== false,
    images:
      Array.isArray(item?.images) && item.images.length
        ? item.images.filter(Boolean)
        : item?.image
        ? [item.image]
        : [],
  }));
}

function mergeContent(saved = {}) {
  const categories = normalizeCategories(saved.categories);

  const categoryDescriptions = categories.reduce(
    (output, category) => {
      output[category] =
        saved?.categoryDescriptions?.[category] ||
        fallbackCategoryDescriptions[category] ||
        "";
      return output;
    },
    {}
  );

  return {
    ...defaultContent,
    ...saved,
    categories,
    categoryDescriptions,
    subcategories: normalizeSubcategories(
      saved.subcategories,
      categories
    ),
    achievements: Array.isArray(saved.achievements)
      ? saved.achievements
      : defaultAchievements,
    images: normalizeImages(saved.images, categories),
  };
}

function getUrls(item) {
  if (Array.isArray(item?.images) && item.images.length) {
    return item.images.filter(Boolean);
  }

  return item?.image ? [item.image] : [];
}

function buildAlbums(content, activeCategory) {
  const visibleImages = (content.images || []).filter(
    (item) => item.visible !== false
  );

  const categories = normalizeCategories(content.categories);

  const makeAlbum = (category, subcategory = "") => {
    const items = visibleImages.filter(
      (item) =>
        item.category === category &&
        (!subcategory || item.subcategory === subcategory)
    );

    const seen = new Set();
    const photos = [];

    items.forEach((item) => {
      getUrls(item).forEach((url) => {
        if (!url || seen.has(url)) return;
        seen.add(url);

        photos.push({
          url,
          title: item.title || subcategory || category,
          date: item.date || "School Activity",
        });
      });
    });

    const sub = content.subcategories?.[category]?.find(
      (item) => item.name === subcategory
    );

    return {
      category,
      subcategory,
      title: subcategory || category,
      description: subcategory
        ? sub?.description || ""
        : content.categoryDescriptions?.[category] || "",
      date: items[0]?.date || "School Gallery",
      photos,
      cover: photos[0]?.url || "",
      total: photos.length,
    };
  };

  if (activeCategory === "All") {
    return categories.map((category) => makeAlbum(category));
  }

  const subs = (content.subcategories?.[activeCategory] || []).filter(
    (item) => item.visible !== false
  );

  if (!subs.length) return [makeAlbum(activeCategory)];

  const albums = subs.map((sub) =>
    makeAlbum(activeCategory, sub.name)
  );

  const hasGeneralImages = visibleImages.some(
    (item) =>
      item.category === activeCategory && !item.subcategory
  );

  if (hasGeneralImages) albums.push(makeAlbum(activeCategory));

  return albums;
}

function IconFor({ name, size = 22 }) {
  const icons = { Trophy, Award, Star };
  const Icon = icons[name] || Trophy;
  return <Icon size={size} />;
}

function Button({
  children,
  onClick,
  tone = "dark",
  icon: Icon,
  disabled = false,
}) {
  const tones = {
    dark: "bg-slate-900 text-white hover:bg-slate-800",
    green: "bg-emerald-700 text-white hover:bg-emerald-800",
    gold: "bg-amber-400 text-slate-900 hover:bg-amber-300",
    red: "bg-red-600 text-white hover:bg-red-700",
    white:
      "bg-white text-slate-800 hover:bg-slate-50 border border-slate-200",
    purple: "bg-violet-600 text-white hover:bg-violet-700",
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-black shadow-sm transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 ${tones[tone]}`}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-slate-700">
        {label}
      </span>
      <input
        type={type}
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
      />
    </label>
  );
}

function TextArea({ label, value, onChange, rows = 4 }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-slate-700">
        {label}
      </span>
      <textarea
        value={value ?? ""}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
      />
    </label>
  );
}

function EditModal({
  title,
  children,
  onClose,
  onSave,
}) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-md"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 25 }}
          onClick={(e) => e.stopPropagation()}
          className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[28px] bg-white shadow-2xl"
        >
          <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-100 bg-white/95 px-6 py-5 backdrop-blur">
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-700">
                Gallery Editor
              </div>
              <h2 className="mt-1 text-2xl font-black text-slate-950">
                {title}
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:rotate-90 hover:bg-red-50 hover:text-red-600"
            >
              <X size={19} />
            </button>
          </div>

          <div className="space-y-5 p-6">{children}</div>

          <div className="sticky bottom-0 flex justify-end gap-3 border-t border-slate-100 bg-white/95 px-6 py-4 backdrop-blur">
            <Button tone="white" onClick={onClose}>
              Cancel
            </Button>
            <Button tone="green" onClick={onSave} icon={Save}>
              Apply Changes
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function ConfirmModal({ target, onClose, onConfirm }) {
  if (!target) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[100000] flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-md"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md rounded-[28px] bg-white p-7 shadow-2xl"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <AlertTriangle size={25} />
          </div>

          <h3 className="mt-5 text-2xl font-black text-slate-950">
            {target.title || "Are you sure?"}
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {target.message}
          </p>

          {target.name && (
            <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm font-black text-slate-900">
              {target.name}
            </div>
          )}

          <div className="mt-7 flex justify-end gap-3">
            <Button tone="white" onClick={onClose}>
              Cancel
            </Button>
            <Button tone="red" onClick={onConfirm} icon={Trash2}>
              Delete
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function AdminHero({ content, onEdit }) {
  return (
    <section className="relative min-h-[560px] overflow-hidden bg-[linear-gradient(135deg,#102B45,#1D4C6D_45%,#173C58)]">
      <div className="absolute inset-0 opacity-30">
        <motion.div
          animate={{ x: [0, 45, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-20 top-20 h-80 w-80 rounded-full bg-amber-300/20 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, 30, 0], scale: [1, 1.12, 1] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-emerald-400/20 blur-3xl"
        />
      </div>

      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px)",
          backgroundSize: "70px 70px",
        }}
      />

      <button
        type="button"
        onClick={onEdit}
        className="absolute right-5 top-5 z-30 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-black text-slate-800 shadow-xl transition hover:-translate-y-0.5"
      >
        <Edit3 size={16} />
        Edit Hero
      </button>

      <div className="relative z-10 mx-auto flex min-h-[560px] max-w-5xl flex-col items-center justify-center px-6 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-5 py-2.5 text-xs font-black tracking-[.15em] text-amber-300 backdrop-blur"
        >
          <Sparkles size={15} />
          {content.heroBadge}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-8 text-[clamp(58px,10vw,125px)] font-black leading-[.9] tracking-[-.07em] text-white"
        >
          <span className="text-amber-300">
            {content.heroHighlightedText}
          </span>
          {content.heroTitle.replace(content.heroHighlightedText, "")}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-7 max-w-2xl text-lg leading-8 text-white/65 md:text-2xl"
        >
          {content.heroSubtitle}
        </motion.p>

        <div className="mt-12 flex items-center gap-8 text-white">
          <div>
            <div className="text-2xl font-black">
              {(content.images || []).reduce(
                (total, item) => total + getUrls(item).length,
                0
              )}
            </div>
            <div className="text-[10px] uppercase tracking-[.15em] text-white/45">
              Photos
            </div>
          </div>

          <div className="h-9 w-px bg-white/15" />

          <div>
            <div className="text-2xl font-black">
              {content.categories.length}
            </div>
            <div className="text-[10px] uppercase tracking-[.15em] text-white/45">
              Collections
            </div>
          </div>

          <div className="h-9 w-px bg-white/15" />

          <div>
            <div className="text-2xl font-black">
              {content.achievements.length}
            </div>
            <div className="text-[10px] uppercase tracking-[.15em] text-white/45">
              Achievements
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AchievementSection({ content, onAdd, onEdit, onDelete }) {
  return (
    <section className="bg-[#F7F8FA] px-5 py-20">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-black text-emerald-700">
              <Trophy size={15} />
              OUR ACHIEVEMENTS
            </span>

            <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
              Celebrating{" "}
              <span className="bg-gradient-to-r from-emerald-700 to-orange-400 bg-clip-text text-transparent">
                Excellence
              </span>
            </h2>
          </div>

          <Button tone="green" icon={Plus} onClick={onAdd}>
            Add Achievement
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(content.achievements || []).map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -7 }}
              className="group relative overflow-hidden rounded-[24px] border border-slate-100 bg-white p-6 text-center shadow-sm transition hover:shadow-xl"
            >
              <div className="absolute right-3 top-3 flex gap-1 opacity-100 transition md:opacity-0 md:group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => onEdit(item)}
                  className="rounded-full bg-violet-600 p-2 text-white"
                >
                  <Edit3 size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(item)}
                  className="rounded-full bg-red-600 p-2 text-white"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-50 to-amber-50 text-emerald-700 transition group-hover:scale-110">
                <IconFor name={item.icon} size={27} />
              </div>

              <div className="mt-5 text-[10px] font-black uppercase tracking-[.16em] text-orange-500">
                {item.year}
              </div>

              <h3 className="mt-2 text-base font-black text-slate-950">
                {item.title}
              </h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GalleryPreviewCard({
  album,
  index,
  onManage,
  onEditCategory,
  onDeleteCategory,
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: Math.min(index * 0.05, 0.25) }}
      whileHover={{ y: -7 }}
      className="group relative overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-sm transition hover:shadow-2xl"
    >
      <div className="relative h-[300px] overflow-hidden bg-slate-100">
        {album.cover ? (
          <img
            src={album.cover}
            alt={album.title}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-300">
            <ImageIcon size={52} />
            <span className="text-xs font-bold">No images yet</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/70" />

        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span className="rounded-full border border-white/15 bg-slate-950/45 px-3 py-1.5 text-[10px] font-black text-white backdrop-blur">
            {album.category}
          </span>

          {album.subcategory && (
            <span className="rounded-full bg-amber-300 px-3 py-1.5 text-[10px] font-black text-slate-900">
              {album.subcategory}
            </span>
          )}
        </div>

        <div className="absolute bottom-4 right-4 rounded-full bg-black/45 px-3 py-1.5 text-[10px] font-black text-white backdrop-blur">
          {album.total} photos
        </div>

        <div className="absolute right-4 top-4 flex gap-2 opacity-100 transition md:opacity-0 md:group-hover:opacity-100">
          {!album.subcategory && (
            <>
              <button
                type="button"
                onClick={() => onEditCategory(album.category)}
                className="rounded-full bg-violet-600 p-2.5 text-white shadow-lg"
              >
                <Edit3 size={15} />
              </button>

              <button
                type="button"
                onClick={() => onDeleteCategory(album.category)}
                className="rounded-full bg-red-600 p-2.5 text-white shadow-lg"
              >
                <Trash2 size={15} />
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() =>
              onManage(album.category, album.subcategory)
            }
            className="rounded-full bg-emerald-600 p-2.5 text-white shadow-lg"
          >
            <Upload size={15} />
          </button>
        </div>

        <button
          type="button"
          onClick={() =>
            onManage(album.category, album.subcategory)
          }
          className="absolute bottom-1/2 left-1/2 flex translate-x-[-50%] translate-y-1/2 items-center gap-2 rounded-xl bg-white/95 px-4 py-3 text-xs font-black text-slate-900 opacity-0 shadow-xl transition group-hover:opacity-100"
        >
          <Camera size={15} />
          Manage Photos
        </button>
      </div>

      <div className="p-5">
        <div className="text-[10px] font-black uppercase tracking-[.12em] text-slate-400">
          {album.date}
        </div>

        <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
          {album.title}
        </h3>

        <p className="mt-2 line-clamp-3 min-h-[63px] text-sm leading-6 text-slate-500">
          {album.description || "No description added yet."}
        </p>

        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
          <span className="text-xs font-black text-slate-400">
            {album.total} {album.total === 1 ? "memory" : "memories"}
          </span>

          <button
            type="button"
            onClick={() =>
              onManage(album.category, album.subcategory)
            }
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white transition hover:rotate-6 hover:bg-emerald-700"
          >
            <ExternalLink size={17} />
          </button>
        </div>
      </div>
    </motion.article>
  );
}

function GalleryPreview({
  content,
  activeCategory,
  setActiveCategory,
  onEditHeading,
  onManage,
  onEditCategory,
  onDeleteCategory,
}) {
  const categories = ["All", ...normalizeCategories(content.categories)];

  const albums = useMemo(
    () => buildAlbums(content, activeCategory),
    [content, activeCategory]
  );

  const iconFor = (category) => {
    if (category === "All") return Grid3X3;
    if (category === "Classroom") return BookOpen;
    if (category === "Events") return CalendarDays;
    if (category === "Certificate") return Award;
    return Camera;
  };

  return (
    <section className="bg-white px-5 py-20">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-10 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-black text-emerald-700">
            <Camera size={15} />
            {content.badge}
          </span>

          <h2 className="mt-5 text-5xl font-black tracking-[-.05em] text-slate-950 md:text-6xl">
            {content.title}
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-sm leading-7 text-slate-500">
            {content.description}
          </p>

          <div className="mt-5">
            <Button tone="white" icon={Edit3} onClick={onEditHeading}>
              Edit Gallery Heading
            </Button>
          </div>
        </div>

        <div className="mb-10 flex justify-center gap-2 overflow-x-auto pb-2">
          {categories.map((category) => {
            const Icon = iconFor(category);
            const active = category === activeCategory;

            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`inline-flex flex-none items-center gap-2 rounded-2xl px-5 py-3 text-xs font-black transition ${
                  active
                    ? "bg-[linear-gradient(135deg,#173B5F,#2D6A4F)] text-white shadow-xl"
                    : "border border-slate-200 bg-white text-slate-700 hover:-translate-y-0.5 hover:shadow-md"
                }`}
              >
                <Icon size={16} />
                {category}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {albums.map((album, index) => (
            <GalleryPreviewCard
              key={`${album.category}-${album.subcategory || album.title}`}
              album={album}
              index={index}
              onManage={onManage}
              onEditCategory={onEditCategory}
              onDeleteCategory={onDeleteCategory}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function BottomPreview({ content, onEdit }) {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,#112F49,#1D536F)] px-5 py-20 text-center text-white">
      <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-300/10 blur-3xl" />

      <div className="relative mx-auto max-w-2xl">
        <button
          type="button"
          onClick={onEdit}
          className="absolute -right-2 -top-2 rounded-full bg-white px-4 py-2 text-xs font-black text-slate-900 shadow-xl"
        >
          <Edit3 size={14} className="mr-1 inline" />
          Edit
        </button>

        <Sparkles size={24} className="mx-auto text-amber-300" />

        <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
          {content.bottomTitle}
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/60">
          {content.bottomDescription}
        </p>

        <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-white/55">
          <Sparkles size={14} className="text-amber-300" />
          {content.bottomNote}
        </div>
      </div>
    </section>
  );
}

function ImageManager({
  content,
  selectedCategory,
  setSelectedCategory,
  selectedSubcategory,
  setSelectedSubcategory,
  selectedIds,
  setSelectedIds,
  onUpload,
  onReplace,
  onDeleteOne,
  onDeleteSelected,
  onUpdateImage,
  onMoveImage,
  onAddSubcategory,
  onUpdateSubcategory,
  onDeleteSubcategory,
  onCategoryName,
  onCategoryDescription,
  uploading,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
}) {
  const categories = normalizeCategories(content.categories);

  const subcategories =
    normalizeSubcategories(
      content.subcategories,
      content.categories
    )[selectedCategory] || [];

  const categoryImages = (content.images || []).filter(
    (item) => item.category === selectedCategory
  );

  const allSelected =
    categoryImages.length > 0 &&
    categoryImages.every((item) =>
      selectedIds.includes(item.id)
    );

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds((prev) =>
        prev.filter(
          (id) =>
            !categoryImages.some(
              (item) => item.id === id
            )
        )
      );
      return;
    }

    setSelectedIds((prev) => [
      ...new Set([
        ...prev,
        ...categoryImages.map(
          (item) => item.id
        ),
      ]),
    ]);
  };

  return (
    <section
      id="image-manager"
      className="scroll-mt-24 bg-[#F7F8FA] px-5 py-20"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-4 py-2 text-xs font-black text-violet-700">
              <Layers size={15} />
              EDIT IMAGES HERE
            </span>

            <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
              Gallery Images
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
              Upload, replace, move, hide, or delete images without opening
              another admin page.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              tone="white"
              icon={Plus}
              onClick={onAddCategory}
            >
              Add Category
            </Button>

            <Button
              tone="white"
              icon={Edit3}
              onClick={() =>
                onEditCategory(selectedCategory)
              }
            >
              Edit Category
            </Button>
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-5 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
            <label className="block">
              <span className="mb-2 block text-sm font-black text-slate-700">
                Category
              </span>

              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  const nextSubs =
                    normalizeSubcategories(
                      content.subcategories,
                      content.categories
                    )[e.target.value] || [];
                  setSelectedSubcategory(
                    nextSubs[0]?.name || ""
                  );
                  setSelectedIds([]);
                }}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500"
              >
                {categories.map(
                  (category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>
                  )
                )}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-black text-slate-700">
                Subcategory
              </span>

              <select
                value={selectedSubcategory}
                onChange={(e) =>
                  setSelectedSubcategory(
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500"
              >
                <option value="">
                  General {selectedCategory}
                </option>

                {subcategories.map(
                  (sub) => (
                    <option
                      key={sub.id}
                      value={sub.name}
                    >
                      {sub.name}
                      {sub.visible ===
                      false
                        ? " (Hidden)"
                        : ""}
                    </option>
                  )
                )}
              </select>
            </label>

            <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-black text-white transition hover:bg-emerald-800">
              <Upload size={17} />
              {uploading
                ? "Uploading..."
                : "Upload Images"}
              <input
                type="file"
                accept="image/*"
                multiple
                disabled={uploading}
                className="hidden"
                onChange={(e) => {
                  onUpload(
                    e.target.files
                  );
                  e.target.value = "";
                }}
              />
            </label>
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <Field
              label="Category Name"
              value={selectedCategory}
              onChange={onCategoryName}
            />

            <TextArea
              label="Category Description"
              value={
                content
                  .categoryDescriptions?.[
                  selectedCategory
                ] || ""
              }
              onChange={
                onCategoryDescription
              }
              rows={3}
            />
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-black text-slate-900">
                  Subcategories
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Manage collections for{" "}
                  {selectedCategory}.
                </p>
              </div>

              <Button
                tone="purple"
                icon={Plus}
                onClick={onAddSubcategory}
              >
                Add Subcategory
              </Button>
            </div>

            <div className="mt-4 grid gap-3">
              {subcategories.map(
                (sub) => (
                  <div
                    key={sub.id}
                    className="rounded-2xl border border-slate-200 bg-white p-4"
                  >
                    <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto] md:items-end">
                      <Field
                        label="Name"
                        value={sub.name}
                        onChange={(value) =>
                          onUpdateSubcategory(
                            sub.id,
                            "name",
                            value
                          )
                        }
                      />

                      <Field
                        label="Description"
                        value={
                          sub.description
                        }
                        onChange={(value) =>
                          onUpdateSubcategory(
                            sub.id,
                            "description",
                            value
                          )
                        }
                      />

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateSubcategory(
                              sub.id,
                              "visible",
                              !sub.visible
                            )
                          }
                          className="rounded-xl bg-slate-100 p-3 text-slate-700"
                          title={
                            sub.visible
                              ? "Hide"
                              : "Show"
                          }
                        >
                          {sub.visible ? (
                            <Eye size={17} />
                          ) : (
                            <EyeOff
                              size={17}
                            />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            onDeleteSubcategory(
                              sub
                            )
                          }
                          className="rounded-xl bg-red-50 p-3 text-red-600"
                          title="Delete"
                        >
                          <Trash2
                            size={17}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              )}

              {!subcategories.length && (
                <div className="rounded-xl border border-dashed border-slate-300 bg-white p-5 text-center text-xs font-bold text-slate-400">
                  No subcategories. Click
                  "Add Subcategory".
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h3 className="text-2xl font-black text-slate-950">
              {selectedCategory} Images
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {categoryImages.length} images •{" "}
              {selectedIds.length} selected
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              tone="white"
              onClick={toggleSelectAll}
            >
              {allSelected
                ? "Unselect All"
                : "Select All"}
            </Button>

            <Button
              tone="red"
              icon={Trash2}
              disabled={!selectedIds.length}
              onClick={onDeleteSelected}
            >
              Delete Selected
            </Button>
          </div>
        </div>

        {!categoryImages.length ? (
          <div className="mt-6 rounded-[28px] border-2 border-dashed border-slate-200 bg-white p-16 text-center">
            <ImageIcon
              size={50}
              className="mx-auto text-slate-300"
            />

            <h3 className="mt-4 text-xl font-black text-slate-800">
              No images yet
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Upload images using the button
              above.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-5 xl:grid-cols-2">
            {categoryImages.map(
              (item) => {
                const image =
                  item.image ||
                  item.images?.[0];

                const selected =
                  selectedIds.includes(
                    item.id
                  );

                const itemSubs =
                  normalizeSubcategories(
                    content.subcategories,
                    content.categories
                  )[item.category] ||
                  [];

                return (
                  <motion.div
                    key={item.id}
                    layout
                    className={`rounded-[26px] border bg-white p-5 shadow-sm transition ${
                      selected
                        ? "border-emerald-400 ring-4 ring-emerald-500/10"
                        : "border-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <label className="flex min-w-0 items-center gap-3">
                        <input
                          type="checkbox"
                          checked={
                            selected
                          }
                          onChange={() =>
                            setSelectedIds(
                              (prev) =>
                                selected
                                  ? prev.filter(
                                      (id) =>
                                        id !==
                                        item.id
                                    )
                                  : [
                                      ...prev,
                                      item.id,
                                    ]
                            )
                          }
                          className="h-5 w-5"
                        />

                        <span className="truncate text-sm font-black text-slate-900">
                          {item.title ||
                            "Untitled Image"}
                        </span>
                      </label>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateImage(
                              item.id,
                              "visible",
                              !item.visible
                            )
                          }
                          className="rounded-xl bg-slate-100 p-2.5 text-slate-700"
                          title={
                            item.visible
                              ? "Hide"
                              : "Show"
                          }
                        >
                          {item.visible ? (
                            <Eye
                              size={16}
                            />
                          ) : (
                            <EyeOff
                              size={16}
                            />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            onDeleteOne(
                              item.id
                            )
                          }
                          className="rounded-xl bg-red-50 p-2.5 text-red-600"
                          title="Delete"
                        >
                          <Trash2
                            size={16}
                          />
                        </button>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-5 md:grid-cols-[220px_1fr]">
                      <div>
                        <div className="h-44 overflow-hidden rounded-2xl bg-slate-100">
                          {image ? (
                            <img
                              src={image}
                              alt={
                                item.title ||
                                "Gallery image"
                              }
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <ImageIcon
                                size={42}
                                className="text-slate-300"
                              />
                            </div>
                          )}
                        </div>

                        <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-black text-white transition hover:bg-emerald-700">
                          <Upload
                            size={15}
                          />
                          Replace Image
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={
                              uploading
                            }
                            onChange={(
                              e
                            ) => {
                              onReplace(
                                item.id,
                                e.target
                                  .files?.[0]
                              );
                              e.target.value =
                                "";
                            }}
                          />
                        </label>
                      </div>

                      <div className="grid gap-4">
                        <Field
                          label="Image Title"
                          value={
                            item.title
                          }
                          onChange={(
                            value
                          ) =>
                            onUpdateImage(
                              item.id,
                              "title",
                              value
                            )
                          }
                        />

                        <label className="block">
                          <span className="mb-2 block text-sm font-black text-slate-700">
                            Category
                          </span>

                          <select
                            value={
                              item.category
                            }
                            onChange={(
                              e
                            ) =>
                              onMoveImage(
                                item.id,
                                e.target
                                  .value
                              )
                            }
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500"
                          >
                            {categories.map(
                              (
                                category
                              ) => (
                                <option
                                  key={
                                    category
                                  }
                                  value={
                                    category
                                  }
                                >
                                  {
                                    category
                                  }
                                </option>
                              )
                            )}
                          </select>
                        </label>

                        {itemSubs.length >
                          0 && (
                          <label className="block">
                            <span className="mb-2 block text-sm font-black text-slate-700">
                              Subcategory
                            </span>

                            <select
                              value={
                                item.subcategory ||
                                ""
                              }
                              onChange={(
                                e
                              ) =>
                                onUpdateImage(
                                  item.id,
                                  "subcategory",
                                  e
                                    .target
                                    .value
                                )
                              }
                              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500"
                            >
                              <option value="">
                                General
                              </option>

                              {itemSubs.map(
                                (
                                  sub
                                ) => (
                                  <option
                                    key={
                                      sub.id
                                    }
                                    value={
                                      sub.name
                                    }
                                  >
                                    {
                                      sub.name
                                    }
                                  </option>
                                )
                              )}
                            </select>
                          </label>
                        )}

                        <Field
                          label="Date / Label"
                          value={
                            item.date
                          }
                          onChange={(
                            value
                          ) =>
                            onUpdateImage(
                              item.id,
                              "date",
                              value
                            )
                          }
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              }
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default function AdminGallery() {
  const navigate = useNavigate();

  const [content, setContent] =
    useState(defaultContent);

  const [activeCategory, setActiveCategory] =
    useState("All");

  const [selectedCategory, setSelectedCategory] =
    useState("Classroom");

  const [selectedSubcategory, setSelectedSubcategory] =
    useState("");

  const [selectedIds, setSelectedIds] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  const [message, setMessage] =
    useState({
      type: "",
      text: "",
    });

  const [modal, setModal] =
    useState(null);

  const [draft, setDraft] =
    useState({});

  const [confirmTarget, setConfirmTarget] =
    useState(null);

  const token =
    localStorage.getItem("adminToken");

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const response =
          await api.get(
            "/api/site-content/gallery",
            { timeout: 15000 }
          );

        if (!mounted) return;

        const merged = mergeContent(
          response.data?.data?.content || {}
        );

        setContent(merged);

        const firstCategory =
          merged.categories[0] ||
          "Classroom";

        setSelectedCategory(
          firstCategory
        );

        const firstSub =
          merged.subcategories?.[
            firstCategory
          ]?.find(
            (item) =>
              item.visible !== false
          );

        setSelectedSubcategory(
          firstSub?.name || ""
        );
      } catch (error) {
        console.error(
          "Gallery load error:",
          error
        );

        if (mounted) {
          setMessage({
            type: "error",
            text: "Could not load saved gallery. Default content is being shown.",
          });
        }
      } finally {
        if (mounted)
          setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const showMessage = (
    type,
    text
  ) => {
    setMessage({
      type,
      text,
    });
  };

  const save = async (
    nextContent = content,
    successText = "Gallery changes saved successfully."
  ) => {
    setSaving(true);
    setMessage({
      type: "",
      text: "",
    });

    const categories =
      normalizeCategories(
        nextContent.categories
      );

    const cleaned = {
      ...nextContent,
      categories,
      categoryDescriptions:
        categories.reduce(
          (output, category) => {
            output[category] =
              nextContent
                .categoryDescriptions?.[
                category
              ] || "";
            return output;
          },
          {}
        ),
      subcategories:
        normalizeSubcategories(
          nextContent.subcategories,
          categories
        ),
      images:
        normalizeImages(
          nextContent.images,
          categories
        ),
    };

    try {
      await api.put(
        "/api/site-content/gallery",
        { content: cleaned },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 30000,
        }
      );

      setContent(
        mergeContent(cleaned)
      );

      showMessage(
        "success",
        successText
      );
    } catch (error) {
      console.error(
        "Gallery save error:",
        error
      );

      showMessage(
        "error",
        error.response?.data
          ?.message ||
          "Could not save gallery changes."
      );
    } finally {
      setSaving(false);
    }
  };

  const openHeroEditor =
    () => {
      setDraft({
        heroBadge:
          content.heroBadge,
        heroTitle:
          content.heroTitle,
        heroHighlightedText:
          content.heroHighlightedText,
        heroSubtitle:
          content.heroSubtitle,
        heroExploreText:
          content.heroExploreText,
        heroAchievementText:
          content.heroAchievementText,
      });

      setModal("hero");
    };

  const openMainEditor =
    () => {
      setDraft({
        badge: content.badge,
        title: content.title,
        highlightedText:
          content.highlightedText,
        description:
          content.description,
      });

      setModal("main");
    };

  const openBottomEditor =
    () => {
      setDraft({
        bottomTitle:
          content.bottomTitle,
        bottomDescription:
          content.bottomDescription,
        bottomNote:
          content.bottomNote,
      });

      setModal("bottom");
    };

  const openAchievement =
    (item = null) => {
      setDraft(
        item || {
          id: String(Date.now()),
          title: "",
          year:
            new Date()
              .getFullYear()
              .toString(),
          icon: "Trophy",
        }
      );

      setModal(
        item
          ? "achievement-edit"
          : "achievement-add"
      );
    };

  const openCategory =
    (category) => {
      setDraft({
        oldName: category,
        name: category,
        description:
          content
            .categoryDescriptions?.[
            category
          ] || "",
        subcategories: (
          content
            .subcategories?.[
            category
          ] || []
        ).map((item) => ({
          ...item,
        })),
      });

      setModal("category");
    };

  const applyModal =
    () => {
      let next = {
        ...content,
      };

      if (
        modal === "hero" ||
        modal === "main" ||
        modal === "bottom"
      ) {
        next = {
          ...next,
          ...draft,
        };
      }

      if (
        modal ===
          "achievement-add" ||
        modal ===
          "achievement-edit"
      ) {
        const list = [
          ...(next.achievements || []),
        ];

        const index =
          list.findIndex(
            (item) =>
              item.id === draft.id
          );

        if (index >= 0)
          list[index] = draft;
        else list.push(draft);

        next.achievements = list;
      }

      if (modal === "category") {
        const oldName =
          draft.oldName;

        const newName =
          String(
            draft.name || ""
          ).trim();

        if (!newName) {
          showMessage(
            "error",
            "Category name cannot be empty."
          );
          return;
        }

        const categories =
          normalizeCategories(
            next.categories
          ).map(
            (category) =>
              category ===
              oldName
                ? newName
                : category
          );

        const descriptions = {
          ...next.categoryDescriptions,
        };

        delete descriptions[
          oldName
        ];

        descriptions[newName] =
          draft.description || "";

        const subcategories = {
          ...next.subcategories,
        };

        delete subcategories[
          oldName
        ];

        subcategories[newName] =
          (
            draft.subcategories ||
            []
          ).filter((item) =>
            String(
              item.name || ""
            ).trim()
          );

        const images = (
          next.images || []
        ).map((item) => ({
          ...item,
          category:
            item.category ===
            oldName
              ? newName
              : item.category,
        }));

        next = {
          ...next,
          categories: [
            ...new Set(categories),
          ],
          categoryDescriptions:
            descriptions,
          subcategories,
          images,
        };

        if (
          selectedCategory ===
          oldName
        ) {
          setSelectedCategory(
            newName
          );
        }
      }

      setContent(
        mergeContent(next)
      );

      setModal(null);

      showMessage(
        "success",
        "Changes applied. Click Save Changes to publish them."
      );
    };

  const addCategory =
    () => {
      let name = "New Category";
      let count = 1;

      while (
        content.categories.includes(
          name
        )
      ) {
        count += 1;
        name = `New Category ${count}`;
      }

      const next = {
        ...content,
        categories: [
          ...content.categories,
          name,
        ],
        categoryDescriptions: {
          ...content.categoryDescriptions,
          [name]: "",
        },
        subcategories: {
          ...content.subcategories,
          [name]: [],
        },
      };

      setContent(
        mergeContent(next)
      );

      setActiveCategory(
        name
      );
      setSelectedCategory(
        name
      );
      setSelectedSubcategory(
        ""
      );

      showMessage(
        "success",
        `"${name}" added. Click Save Changes to publish.`
      );
    };

  const requestDeleteCategory =
    (category) => {
      if (
        content.categories
          .length <= 1
      ) {
        showMessage(
          "error",
          "At least one gallery category is required."
        );
        return;
      }

      const fallback =
        content.categories.find(
          (item) =>
            item !== category
        );

      setConfirmTarget({
        type: "category",
        category,
        title:
          "Delete category?",
        name: category,
        message: `Its images will be moved to "${fallback}".`,
      });
    };

  const deleteCategory =
    () => {
      const category =
        confirmTarget?.category;

      if (!category) return;

      const categories =
        content.categories.filter(
          (item) =>
            item !== category
        );

      const fallback =
        categories[0];

      const descriptions = {
        ...content.categoryDescriptions,
      };

      delete descriptions[
        category
      ];

      const subcategories = {
        ...content.subcategories,
      };

      delete subcategories[
        category
      ];

      const images = (
        content.images || []
      ).map((item) =>
        item.category === category
          ? {
              ...item,
              category: fallback,
              subcategory: "",
            }
          : item
      );

      const next = {
        ...content,
        categories,
        categoryDescriptions:
          descriptions,
        subcategories,
        images,
      };

      setContent(
        mergeContent(next)
      );

      setActiveCategory(
        "All"
      );
      setSelectedCategory(
        fallback
      );
      setSelectedSubcategory(
        ""
      );

      setConfirmTarget(null);

      showMessage(
        "success",
        `"${category}" deleted. Click Save Changes to publish.`
      );
    };

  const deleteAchievement =
    () => {
      const id =
        confirmTarget?.id;

      if (!id) return;

      setContent(
        (previous) => ({
          ...previous,
          achievements: (
            previous.achievements ||
            []
          ).filter(
            (item) =>
              item.id !== id
          ),
        })
      );

      setConfirmTarget(null);

      showMessage(
        "success",
        "Achievement deleted. Click Save Changes to publish."
      );
    };

  const uploadImage = async (
    file
  ) => {
    const formData =
      new FormData();

    formData.append(
      "file",
      file
    );

    const uploadToken =
      localStorage.getItem(
        "adminToken"
      );

    const response =
      await api.post(
        "/api/upload",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
            ...(uploadToken
              ? {
                  Authorization: `Bearer ${uploadToken}`,
                }
              : {}),
          },
          timeout: 20000,
        }
      );

    const url =
      response.data?.url ||
      response.data
        ?.imageUrl ||
      response.data?.fileUrl ||
      response.data?.data?.url ||
      response.data?.data
        ?.imageUrl ||
      response.data?.data
        ?.fileUrl;

    if (!url) {
      throw new Error(
        "Image uploaded but backend did not return an image URL."
      );
    }

    return url;
  };

  const cleanFileName =
    (fileName = "") =>
      fileName
        .replace(
          /\.[^/.]+$/,
          ""
        )
        .replace(
          /[-_]+/g,
          " "
        )
        .replace(
          /\s+/g,
          " "
        )
        .trim()
        .replace(
          /\b\w/g,
          (char) =>
            char.toUpperCase()
        );

  const validateImage =
    (file) => {
      if (
        !file.type.startsWith(
          "image/"
        )
      ) {
        return "Please upload only image files.";
      }

      if (
        file.size >
        6 * 1024 * 1024
      ) {
        return "Image is too large. Please use an image under 6 MB.";
      }

      return "";
    };

  const handleUpload =
    async (files) => {
      const selectedFiles =
        Array.from(
          files || []
        );

      if (!selectedFiles.length)
        return;

      const validation =
        selectedFiles
          .map(validateImage)
          .find(Boolean);

      if (validation) {
        showMessage(
          "error",
          validation
        );
        return;
      }

      setUploading(true);
      setMessage({
        type: "",
        text: "",
      });

      try {
        const selectedSub =
          selectedSubcategory &&
          (
            content
              .subcategories?.[
              selectedCategory
            ] || []
          ).some(
            (item) =>
              item.name ===
              selectedSubcategory
          )
            ? selectedSubcategory
            : "";

        const uploaded =
          await Promise.all(
            selectedFiles.map(
              async (
                file,
                index
              ) => {
                const url =
                  await uploadImage(
                    file
                  );

                return {
                  id: `${Date.now()}-${index}-${Math.random()
                    .toString(36)
                    .slice(2)}`,
                  title:
                    cleanFileName(
                      file.name
                    ) ||
                    `Gallery Image ${
                      index + 1
                    }`,
                  category:
                    selectedCategory,
                  subcategory:
                    selectedSub,
                  date: "School Activity",
                  description:
                    "",
                  image: url,
                  images: [url],
                  visible: true,
                };
              }
            )
          );

        setContent(
          (previous) => ({
            ...previous,
            images: [
              ...uploaded,
              ...previous.images,
            ],
          })
        );

        showMessage(
          "success",
          `${uploaded.length} image${
            uploaded.length ===
            1
              ? ""
              : "s"
          } uploaded. Click Save Changes to publish.`
        );
      } catch (error) {
        console.error(
          "Gallery upload error:",
          error
        );

        showMessage(
          "error",
          error.response?.data
            ?.message ||
            error.message ||
            "Could not upload images. Check that the backend is running."
        );
      } finally {
        setUploading(false);
      }
    };

  const replaceImage =
    async (
      id,
      file
    ) => {
      if (!file) return;

      const validation =
        validateImage(file);

      if (validation) {
        showMessage(
          "error",
          validation
        );
        return;
      }

      setUploading(true);

      try {
        const url =
          await uploadImage(
            file
          );

        setContent(
          (previous) => ({
            ...previous,
            images:
              previous.images.map(
                (item) =>
                  item.id === id
                    ? {
                        ...item,
                        image: url,
                        images: [url],
                      }
                    : item
              ),
          })
        );

        showMessage(
          "success",
          "Image replaced. Click Save Changes to publish."
        );
      } catch (error) {
        console.error(
          "Replace image error:",
          error
        );

        showMessage(
          "error",
          error.response?.data
            ?.message ||
            error.message ||
            "Could not replace image."
        );
      } finally {
        setUploading(false);
      }
    };

  const updateImage =
    (
      id,
      field,
      value
    ) => {
      setContent(
        (previous) => ({
          ...previous,
          images:
            previous.images.map(
              (item) =>
                item.id === id
                  ? {
                      ...item,
                      [field]:
                        value,
                    }
                  : item
            ),
        })
      );
    };

  const moveImage =
    (
      id,
      category
    ) => {
      const subcategories =
        content.subcategories?.[
          category
        ] || [];

      setContent(
        (previous) => ({
          ...previous,
          images:
            previous.images.map(
              (item) =>
                item.id === id
                  ? {
                      ...item,
                      category,
                      subcategory:
                        subcategories[0]
                          ?.name ||
                        "",
                    }
                  : item
            ),
        })
      );
    };

  const deleteOne =
    (id) => {
      const image =
        content.images.find(
          (item) =>
            item.id === id
        );

      setConfirmTarget({
        type: "image",
        id,
        title:
          "Delete image?",
        name:
          image?.title ||
          "This image",
        message:
          "The image will be removed from the gallery. Click Save Changes to publish.",
      });
    };

  const deleteSelected =
    () => {
      if (
        !selectedIds.length
      ) {
        showMessage(
          "error",
          "Select at least one image first."
        );
        return;
      }

      setConfirmTarget({
        type: "images",
        title:
          "Delete selected images?",
        name: `${selectedIds.length} selected image${
          selectedIds.length ===
          1
            ? ""
            : "s"
        }`,
        message:
          "The selected images will be removed from the gallery. Click Save Changes to publish.",
      });
    };

  const confirmDelete =
    () => {
      if (
        confirmTarget?.type ===
        "category"
      ) {
        deleteCategory();
        return;
      }

      if (
        confirmTarget?.type ===
        "achievement"
      ) {
        deleteAchievement();
        return;
      }

      if (
        confirmTarget?.type ===
        "image"
      ) {
        const id =
          confirmTarget.id;

        setContent(
          (previous) => ({
            ...previous,
            images:
              previous.images.filter(
                (item) =>
                  item.id !== id
              ),
          })
        );

        setSelectedIds(
          (previous) =>
            previous.filter(
              (item) =>
                item !== id
            )
        );

        setConfirmTarget(null);

        showMessage(
          "success",
          "Image deleted. Click Save Changes to publish."
        );
        return;
      }

      if (
        confirmTarget?.type ===
        "images"
      ) {
        setContent(
          (previous) => ({
            ...previous,
            images:
              previous.images.filter(
                (item) =>
                  !selectedIds.includes(
                    item.id
                  )
              ),
          })
        );

        setSelectedIds([]);
        setConfirmTarget(null);

        showMessage(
          "success",
          "Selected images deleted. Click Save Changes to publish."
        );
      }
    };

  const addSubcategory =
    () => {
      const current =
        content.subcategories?.[
          selectedCategory
        ] || [];

      const names = new Set(
        current.map(
          (item) =>
            item.name
        )
      );

      let name = `New ${selectedCategory} Subcategory`;
      let count = 1;

      while (
        names.has(name)
      ) {
        count += 1;
        name = `New ${selectedCategory} Subcategory ${count}`;
      }

      const newSub = {
        id: `${selectedCategory}-${Date.now()}`,
        name,
        description: "",
        visible: true,
      };

      setContent(
        (previous) => ({
          ...previous,
          subcategories: {
            ...previous.subcategories,
            [selectedCategory]: [
              ...(previous
                .subcategories?.[
                selectedCategory
              ] || []),
              newSub,
            ],
          },
        })
      );

      setSelectedSubcategory(
        name
      );

      showMessage(
        "success",
        `Subcategory "${name}" added. Click Save Changes to publish.`
      );
    };

  const updateSubcategory =
    (
      id,
      field,
      value
    ) => {
      setContent(
        (previous) => {
          const current =
            previous
              .subcategories?.[
              selectedCategory
            ] || [];

          const old =
            current.find(
              (item) =>
                item.id === id
            );

          const updated =
            current.map(
              (item) =>
                item.id === id
                  ? {
                      ...item,
                      [field]:
                        value,
                    }
                  : item
            );

          const images =
            field === "name" &&
            old
              ? previous.images.map(
                  (image) =>
                    image.category ===
                      selectedCategory &&
                    image.subcategory ===
                      old.name
                      ? {
                          ...image,
                          subcategory:
                            value,
                        }
                      : image
                )
              : previous.images;

          return {
            ...previous,
            subcategories: {
              ...previous.subcategories,
              [selectedCategory]:
                updated,
            },
            images,
          };
        }
      );

      if (
        field === "name" &&
        selectedSubcategory ===
          content.subcategories?.[
            selectedCategory
          ]?.find(
            (item) =>
              item.id === id
          )?.name
      ) {
        setSelectedSubcategory(
          value
        );
      }
    };

  const deleteSubcategory =
    (subcategory) => {
      setConfirmTarget({
        type: "subcategory",
        subcategory,
        title:
          "Delete subcategory?",
        name:
          subcategory.name,
        message:
          "Images inside this subcategory will move to the general category.",
      });
    };

  const confirmDeleteSubcategory =
    () => {
      const sub =
        confirmTarget?.subcategory;

      if (!sub) return;

      setContent(
        (previous) => ({
          ...previous,
          subcategories: {
            ...previous.subcategories,
            [selectedCategory]: (
              previous
                .subcategories?.[
                selectedCategory
              ] || []
            ).filter(
              (item) =>
                item.id !==
                sub.id
            ),
          },
          images:
            previous.images.map(
              (image) =>
                image.category ===
                  selectedCategory &&
                image.subcategory ===
                  sub.name
                  ? {
                      ...image,
                      subcategory:
                        "",
                    }
                  : image
            ),
        })
      );

      if (
        selectedSubcategory ===
        sub.name
      ) {
        setSelectedSubcategory(
          ""
        );
      }

      setConfirmTarget(null);

      showMessage(
        "success",
        "Subcategory deleted. Click Save Changes to publish."
      );
    };

  const updateCategoryName =
    (value) => {
      const newName =
        String(
          value || ""
        ).trimStart();

      if (!newName) return;

      if (
        content.categories.some(
          (category) =>
            category !==
              selectedCategory &&
            category ===
              newName
        )
      ) {
        showMessage(
          "error",
          `Category "${newName}" already exists.`
        );
        return;
      }

      const oldName =
        selectedCategory;

      setContent(
        (previous) => {
          const categories =
            previous.categories.map(
              (category) =>
                category ===
                oldName
                  ? newName
                  : category
            );

          const descriptions =
            {
              ...previous.categoryDescriptions,
            };

          descriptions[
            newName
          ] =
            descriptions[
              oldName
            ] || "";

          delete descriptions[
            oldName
          ];

          const subcategories =
            {
              ...previous.subcategories,
            };

          subcategories[
            newName
          ] =
            subcategories[
              oldName
            ] || [];

          delete subcategories[
            oldName
          ];

          return {
            ...previous,
            categories,
            categoryDescriptions:
              descriptions,
            subcategories,
            images:
              previous.images.map(
                (image) =>
                  image.category ===
                  oldName
                    ? {
                        ...image,
                        category:
                          newName,
                      }
                    : image
              ),
          };
        }
      );

      setSelectedCategory(
        newName
      );

      showMessage(
        "success",
        "Category renamed. Click Save Changes to publish."
      );
    };

  const updateCategoryDescription =
    (value) => {
      setContent(
        (previous) => ({
          ...previous,
          categoryDescriptions:
            {
              ...previous.categoryDescriptions,
              [selectedCategory]:
                value,
            },
        })
      );
    };

  if (loading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{
          background:
            "radial-gradient(circle at 10% 15%, rgba(45,106,79,0.10), transparent 28%), radial-gradient(circle at 90% 75%, rgba(233,196,106,0.12), transparent 28%), #F5F8F6",
        }}
      >
        <div className="rounded-2xl bg-white px-6 py-4 font-black text-slate-700 shadow-xl">
          Loading Gallery Editor...
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{
        backgroundImage:
          "radial-gradient(circle at 8% 12%, rgba(45,106,79,0.10), transparent 25%), radial-gradient(circle at 92% 45%, rgba(233,196,106,0.12), transparent 28%), radial-gradient(circle at 50% 95%, rgba(126,155,190,0.08), transparent 30%), radial-gradient(rgba(45,106,79,0.08) 1px, transparent 1px), linear-gradient(180deg, #F7FAF8 0%, #F1F7F4 100%)",
        backgroundSize:
          "auto, auto, auto, 30px 30px, auto",
      }}
    >
      {/* TOP ADMIN BAR */}
      <header className="sticky top-0 z-[100] border-b border-slate-200 bg-white/90 px-4 py-3 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() =>
              navigate(
                "/admin/dashboard"
              )
            }
            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-black text-slate-800 transition hover:bg-slate-100"
          >
            <ArrowLeft size={18} />
            Dashboard
          </button>

          <div className="flex flex-wrap gap-2">
            <Button
              tone="white"
              icon={Upload}
              onClick={() =>
                document
                  .getElementById(
                    "image-manager"
                  )
                  ?.scrollIntoView({
                    behavior:
                      "smooth",
                  })
              }
            >
              Manage Images
            </Button>

            <a
              href="/gallery"
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md md:inline-flex"
            >
              <ExternalLink size={16} />
              View Gallery
            </a>

            <Button
              tone="green"
              icon={Save}
              disabled={saving || uploading}
              onClick={() =>
                save()
              }
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </Button>
          </div>
        </div>
      </header>

      {/* PAGE INTRO */}
      <div className="mx-auto max-w-[1500px] px-4 py-7">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-black text-emerald-700">
              <Sparkles size={14} />
              ONE PAGE GALLERY ADMIN
            </span>

            <h1 className="mt-4 text-4xl font-black tracking-[-.05em] text-slate-950 md:text-6xl">
              Edit Gallery
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
              You no longer need to open a separate
              Image Manager page. Edit the complete
              gallery from this one page.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              tone="white"
              icon={Edit3}
              onClick={
                openMainEditor
              }
            >
              Edit Heading
            </Button>

            <Button
              tone="white"
              icon={Plus}
              onClick={
                addCategory
              }
            >
              Add Category
            </Button>

            <Button
              tone="white"
              icon={Layers}
              onClick={
                openBottomEditor
              }
            >
              Edit Bottom
            </Button>
          </div>
        </div>

        {message.text && (
          <motion.div
            initial={{
              opacity: 0,
              y: -10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className={`mt-5 flex items-center gap-2 rounded-2xl px-5 py-4 text-sm font-black ${
              message.type ===
              "error"
                ? "bg-red-50 text-red-700"
                : "bg-emerald-50 text-emerald-700"
            }`}
          >
            {message.type ===
            "error" ? (
              <AlertTriangle
                size={18}
              />
            ) : (
              <CheckCircle2
                size={18}
              />
            )}

            {message.text}
          </motion.div>
        )}
      </div>

      {/* HERO */}
      <AdminHero
        content={content}
        onEdit={
          openHeroEditor
        }
      />

      {/* ACHIEVEMENTS */}
      <AchievementSection
        content={content}
        onAdd={() =>
          openAchievement()
        }
        onEdit={
          openAchievement
        }
        onDelete={(item) =>
          setConfirmTarget({
            type: "achievement",
            id: item.id,
            title:
              "Delete achievement?",
            name: item.title,
            message:
              "This achievement will be removed from the gallery page.",
          })
        }
      />

      {/* GALLERY PREVIEW */}
      <GalleryPreview
        content={content}
        activeCategory={
          activeCategory
        }
        setActiveCategory={
          setActiveCategory
        }
        onEditHeading={
          openMainEditor
        }
        onManage={(
          category,
          subcategory
        ) => {
          setSelectedCategory(
            category
          );
          setSelectedSubcategory(
            subcategory || ""
          );

          setTimeout(() => {
            document
              .getElementById(
                "image-manager"
              )
              ?.scrollIntoView({
                behavior:
                  "smooth",
              });
          }, 50);
        }}
        onEditCategory={
          openCategory
        }
        onDeleteCategory={
          requestDeleteCategory
        }
      />

      {/* IMAGE MANAGEMENT - SAME PAGE */}
      <ImageManager
        content={content}
        selectedCategory={
          selectedCategory
        }
        setSelectedCategory={
          setSelectedCategory
        }
        selectedSubcategory={
          selectedSubcategory
        }
        setSelectedSubcategory={
          setSelectedSubcategory
        }
        selectedIds={selectedIds}
        setSelectedIds={
          setSelectedIds
        }
        onUpload={
          handleUpload
        }
        onReplace={
          replaceImage
        }
        onDeleteOne={
          deleteOne
        }
        onDeleteSelected={
          deleteSelected
        }
        onUpdateImage={
          updateImage
        }
        onMoveImage={
          moveImage
        }
        onAddSubcategory={
          addSubcategory
        }
        onUpdateSubcategory={
          updateSubcategory
        }
        onDeleteSubcategory={
          deleteSubcategory
        }
        onCategoryName={
          updateCategoryName
        }
        onCategoryDescription={
          updateCategoryDescription
        }
        uploading={uploading}
        onAddCategory={
          addCategory
        }
        onEditCategory={
          openCategory
        }
        onDeleteCategory={
          requestDeleteCategory
        }
      />

      {/* BOTTOM PREVIEW */}
      <BottomPreview
        content={content}
        onEdit={
          openBottomEditor
        }
      />

      {/* HERO MODAL */}
      {modal === "hero" && (
        <EditModal
          title="Edit Gallery Hero"
          onClose={() =>
            setModal(null)
          }
          onSave={
            applyModal
          }
        >
          <Field
            label="Hero Badge"
            value={
              draft.heroBadge
            }
            onChange={(value) =>
              setDraft({
                ...draft,
                heroBadge:
                  value,
              })
            }
          />

          <Field
            label="Hero Title"
            value={
              draft.heroTitle
            }
            onChange={(value) =>
              setDraft({
                ...draft,
                heroTitle:
                  value,
              })
            }
          />

          <Field
            label="Highlighted Text"
            value={
              draft.heroHighlightedText
            }
            onChange={(value) =>
              setDraft({
                ...draft,
                heroHighlightedText:
                  value,
              })
            }
          />

          <TextArea
            label="Hero Subtitle"
            value={
              draft.heroSubtitle
            }
            onChange={(value) =>
              setDraft({
                ...draft,
                heroSubtitle:
                  value,
              })
            }
          />

          <Field
            label="Explore Button Text"
            value={
              draft.heroExploreText
            }
            onChange={(value) =>
              setDraft({
                ...draft,
                heroExploreText:
                  value,
              })
            }
          />

          <Field
            label="Achievement Button Text"
            value={
              draft.heroAchievementText
            }
            onChange={(value) =>
              setDraft({
                ...draft,
                heroAchievementText:
                  value,
              })
            }
          />
        </EditModal>
      )}

      {/* MAIN HEADING MODAL */}
      {modal === "main" && (
        <EditModal
          title="Edit Gallery Heading"
          onClose={() =>
            setModal(null)
          }
          onSave={
            applyModal
          }
        >
          <Field
            label="Badge"
            value={draft.badge}
            onChange={(value) =>
              setDraft({
                ...draft,
                badge: value,
              })
            }
          />

          <Field
            label="Title"
            value={draft.title}
            onChange={(value) =>
              setDraft({
                ...draft,
                title: value,
              })
            }
          />

          <Field
            label="Highlighted Text"
            value={
              draft.highlightedText
            }
            onChange={(value) =>
              setDraft({
                ...draft,
                highlightedText:
                  value,
              })
            }
          />

          <TextArea
            label="Description"
            value={
              draft.description
            }
            onChange={(value) =>
              setDraft({
                ...draft,
                description:
                  value,
              })
            }
            rows={5}
          />
        </EditModal>
      )}

      {/* BOTTOM MODAL */}
      {modal === "bottom" && (
        <EditModal
          title="Edit Bottom Section"
          onClose={() =>
            setModal(null)
          }
          onSave={
            applyModal
          }
        >
          <Field
            label="Bottom Title"
            value={
              draft.bottomTitle
            }
            onChange={(value) =>
              setDraft({
                ...draft,
                bottomTitle:
                  value,
              })
            }
          />

          <TextArea
            label="Bottom Description"
            value={
              draft.bottomDescription
            }
            onChange={(value) =>
              setDraft({
                ...draft,
                bottomDescription:
                  value,
              })
            }
          />

          <Field
            label="Bottom Note"
            value={
              draft.bottomNote
            }
            onChange={(value) =>
              setDraft({
                ...draft,
                bottomNote:
                  value,
              })
            }
          />
        </EditModal>
      )}

      {/* ACHIEVEMENT MODAL */}
      {(modal ===
        "achievement-add" ||
        modal ===
          "achievement-edit") && (
        <EditModal
          title={
            modal ===
            "achievement-add"
              ? "Add Achievement"
              : "Edit Achievement"
          }
          onClose={() =>
            setModal(null)
          }
          onSave={
            applyModal
          }
        >
          <Field
            label="Achievement Title"
            value={
              draft.title
            }
            onChange={(value) =>
              setDraft({
                ...draft,
                title: value,
              })
            }
          />

          <Field
            label="Year"
            value={draft.year}
            onChange={(value) =>
              setDraft({
                ...draft,
                year: value,
              })
            }
          />

          <label className="block">
            <span className="mb-2 block text-sm font-black text-slate-700">
              Icon
            </span>

            <select
              value={
                draft.icon ||
                "Trophy"
              }
              onChange={(e) =>
                setDraft({
                  ...draft,
                  icon: e.target
                    .value,
                })
              }
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500"
            >
              <option value="Trophy">
                Trophy
              </option>
              <option value="Award">
                Award
              </option>
              <option value="Star">
                Star
              </option>
            </select>
          </label>
        </EditModal>
      )}

      {/* CATEGORY MODAL */}
      {modal ===
        "category" && (
        <EditModal
          title={`Edit ${draft.oldName}`}
          onClose={() =>
            setModal(null)
          }
          onSave={
            applyModal
          }
        >
          <Field
            label="Category Name"
            value={draft.name}
            onChange={(value) =>
              setDraft({
                ...draft,
                name: value,
              })
            }
          />

          <TextArea
            label="Category Description"
            value={
              draft.description
            }
            onChange={(value) =>
              setDraft({
                ...draft,
                description:
                  value,
              })
            }
          />

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-black text-slate-900">
                  Subcategories
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  These appear as collections
                  in the public gallery.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setDraft({
                    ...draft,
                    subcategories: [
                      ...(draft.subcategories ||
                        []),
                      {
                        id: String(
                          Date.now()
                        ),
                        name: "New Subcategory",
                        description:
                          "",
                        visible: true,
                      },
                    ],
                  })
                }
                className="inline-flex items-center gap-1 rounded-xl bg-emerald-700 px-3 py-2 text-xs font-black text-white"
              >
                <Plus size={14} />
                Add
              </button>
            </div>

            <div className="space-y-3">
              {(
                draft.subcategories ||
                []
              ).map(
                (
                  sub,
                  index
                ) => (
                  <div
                    key={
                      sub.id
                    }
                    className="rounded-2xl border border-slate-200 bg-white p-4"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-[.12em] text-slate-400">
                        Subcategory{" "}
                        {index +
                          1}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          setDraft({
                            ...draft,
                            subcategories:
                              draft.subcategories.filter(
                                (
                                  item
                                ) =>
                                  item.id !==
                                  sub.id
                              ),
                          })
                        }
                        className="rounded-full p-2 text-red-600 hover:bg-red-50"
                      >
                        <Trash2
                          size={15}
                        />
                      </button>
                    </div>

                    <Field
                      label="Name"
                      value={
                        sub.name
                      }
                      onChange={(
                        value
                      ) =>
                        setDraft({
                          ...draft,
                          subcategories:
                            draft.subcategories.map(
                              (
                                item
                              ) =>
                                item.id ===
                                sub.id
                                  ? {
                                      ...item,
                                      name: value,
                                    }
                                  : item
                            ),
                        })
                      }
                    />

                    <div className="mt-3">
                      <TextArea
                        label="Description"
                        value={
                          sub.description
                        }
                        onChange={(
                          value
                        ) =>
                          setDraft({
                            ...draft,
                            subcategories:
                              draft.subcategories.map(
                                (
                                  item
                                ) =>
                                  item.id ===
                                  sub.id
                                    ? {
                                        ...item,
                                        description:
                                          value,
                                      }
                                    : item
                              ),
                          })
                        }
                        rows={
                          3
                        }
                      />
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </EditModal>
      )}

      {/* CONFIRM DELETE */}
      {confirmTarget && (
        <ConfirmModal
          target={
            confirmTarget
          }
          onClose={() =>
            setConfirmTarget(
              null
            )
          }
          onConfirm={() => {
            if (
              confirmTarget.type ===
              "subcategory"
            ) {
              confirmDeleteSubcategory();
            } else {
              confirmDelete();
            }
          }}
        />
      )}
    </div>
  );
}
