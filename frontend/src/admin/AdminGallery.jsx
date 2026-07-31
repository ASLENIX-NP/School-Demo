import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Eye,
  EyeOff,
  Camera,
  Image as ImageIcon,
  Layers,
  Sparkles,
  Upload,
  Edit3,
  X,
} from "lucide-react";

const colors = {
  red: "#D71920",
  green: "#168A3A",
  purple: "#4B2E83",
  softPurple: "#7C5CC4",
  dark: "#0B1020",
  cyan: "#38BDF8",
  gold: "#FACC15",
  cream: "#FFF8EE",
};

const lightAdminPanelStyle = {
  background:
    "linear-gradient(135deg, rgba(255,255,255,0.96), rgba(248,244,255,0.95), rgba(238,247,255,0.95))",
  border: "1px solid rgba(75,46,131,0.12)",
  boxShadow: "0 18px 44px rgba(15,23,42,0.08)",
  backdropFilter: "blur(14px)",
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

function safeCategoryId(value = "") {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "gallery-category";
}

function normalizeImageCategory(category, categories = []) {
  const clean = String(category || "").trim();
  const validCategories = normalizeCategories(categories);

  if (validCategories.includes(clean)) return clean;

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
      normalizeImageCategory(item.category, content.categories) === parentCategory
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
  if (activeCategory === "All") return buildMainCategoryAlbums(content);

  const subcategoryList =
    normalizeSubcategories(content.subcategories, content.categories)[activeCategory] || [];

  if (subcategoryList.length > 0) {
    return buildSubcategoryAlbums(content, activeCategory);
  }

  return [buildSingleCategoryAlbum(content, activeCategory)];
}

function HighlightedTitle({ title, highlightedText }) {
  if (!highlightedText || !title.includes(highlightedText)) return <>{title}</>;

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

function Field({ label, value, onChange, placeholder = "", type = "text", disabled = false }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </label>

      <input
        type={type}
        value={value || ""}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl px-4 py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-60"
        style={{
          background: "rgba(255,255,255,0.92)",
          border: "1px solid rgba(75,46,131,0.16)",
          color: colors.dark,
        }}
      />
    </div>
  );
}

function TextArea({ label, value, onChange, placeholder = "", rows = 4 }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </label>

      <textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full resize-none rounded-2xl px-4 py-3 text-sm outline-none"
        style={{
          background: "rgba(255,255,255,0.92)",
          border: "1px solid rgba(75,46,131,0.16)",
          color: colors.dark,
        }}
      />
    </div>
  );
}

function IconButton({ icon: Icon, label, onClick, tone = "purple" }) {
  const styles = {
    purple: {
      background: `linear-gradient(135deg, ${colors.purple}, ${colors.softPurple})`,
      color: "#FFFFFF",
    },
    green: {
      background: `linear-gradient(135deg, ${colors.green}, ${colors.cyan})`,
      color: "#FFFFFF",
    },
    red: {
      background: "rgba(215,25,32,0.95)",
      color: "#FFFFFF",
    },
    dark: {
      background: "rgba(11,16,32,0.94)",
      color: "#FFFFFF",
    },
  };

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black shadow-xl transition-all hover:-translate-y-0.5 hover:scale-105"
      style={styles[tone] || styles.purple}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function ConfirmDialog({ target, onCancel, onConfirm }) {
  if (!target) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-950/70 p-5 backdrop-blur-sm"
        onClick={onCancel}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 18 }}
          className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <Trash2 className="h-6 w-6" />
          </div>

          <h3 className="text-2xl font-black text-slate-950">Are you sure?</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            {target.message || "This item will be removed from the gallery content."}
          </p>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-2xl bg-slate-100 px-5 py-3 text-sm font-black text-slate-700"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onConfirm}
              className="rounded-2xl px-5 py-3 text-sm font-black text-white"
              style={{ background: colors.red }}
            >
              Delete
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function EditModal({ target, modalForm, setModalForm, onClose, onSave, onRequestDeleteSubcategory }) {
  if (!target) return null;

  const isCategory = target.type === "category";
  const canUseSubcategories = isCategory;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/75 p-5 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 24 }}
          className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-[30px] bg-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="sticky top-0 z-10 flex items-center justify-between gap-4 px-6 py-5"
            style={{
              ...lightAdminPanelStyle,
              borderLeft: "0",
              borderRight: "0",
              borderTop: "0",
              borderRadius: "0",
              boxShadow: "0 12px 30px rgba(15,23,42,0.08)",
            }}
          >
            <div>
              <div
                className="text-xs font-black uppercase tracking-[0.18em]"
                style={{ color: colors.softPurple }}
              >
                Gallery Editor
              </div>
              <h2 className="text-2xl font-black" style={{ color: colors.dark }}>
                {target.label}
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid gap-5 p-6">
            {target.type === "hero" && (
              <>
                <Field
                  label="Badge Text"
                  value={modalForm.badge}
                  onChange={(value) => setModalForm((prev) => ({ ...prev, badge: value }))}
                />
                <Field
                  label="Main Title"
                  value={modalForm.title}
                  onChange={(value) => setModalForm((prev) => ({ ...prev, title: value }))}
                />
                <Field
                  label="Red Highlight Text"
                  value={modalForm.highlightedText}
                  onChange={(value) => setModalForm((prev) => ({ ...prev, highlightedText: value }))}
                />
                <TextArea
                  label="Description"
                  value={modalForm.description}
                  onChange={(value) => setModalForm((prev) => ({ ...prev, description: value }))}
                  rows={4}
                />
              </>
            )}

            {target.type === "bottom" && (
              <>
                <Field
                  label="Bottom Title"
                  value={modalForm.bottomTitle}
                  onChange={(value) => setModalForm((prev) => ({ ...prev, bottomTitle: value }))}
                />
                <TextArea
                  label="Bottom Description"
                  value={modalForm.bottomDescription}
                  onChange={(value) => setModalForm((prev) => ({ ...prev, bottomDescription: value }))}
                  rows={3}
                />
                <Field
                  label="Bottom Note"
                  value={modalForm.bottomNote}
                  onChange={(value) => setModalForm((prev) => ({ ...prev, bottomNote: value }))}
                />
              </>
            )}

            {isCategory && (
              <>
                <Field
                  label="Category Name"
                  value={modalForm.name}
                  onChange={(value) => setModalForm((prev) => ({ ...prev, name: value }))}
                />

                <TextArea
                  label={`${target.category} Description`}
                  value={modalForm.description}
                  onChange={(value) => setModalForm((prev) => ({ ...prev, description: value }))}
                  rows={4}
                />

                {canUseSubcategories && (
                  <div className="rounded-[24px] bg-slate-50 p-5" style={{ border: "1px solid rgba(15,23,42,0.08)" }}>
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-black text-slate-950">
                          {target.category} Subcategories
                        </h3>
                        <p className="text-sm text-slate-500">
                          These appear when users open the {target.category} tab.
                        </p>
                      </div>

                    </div>

                    <div className="grid gap-4">
                      {(modalForm.subcategories || []).map((sub, index) => (
                        <div
                          key={sub.id}
                          className="rounded-2xl bg-white p-4"
                          style={{ border: "1px solid rgba(75,46,131,0.12)" }}
                        >
                          <div className="mb-4 flex items-start justify-between gap-3">
                            <div className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                              Subcategory {index + 1}
                            </div>
                            <button
                              type="button"
                              onClick={() => onRequestDeleteSubcategory(sub)}
                              className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-black"
                              style={{
                                background: "rgba(215,25,32,0.08)",
                                color: colors.red,
                              }}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Delete
                            </button>
                          </div>

                          <div className="grid gap-4">
                            <Field
                              label="Subcategory Name"
                              value={sub.name}
                              onChange={(value) =>
                                setModalForm((prev) => ({
                                  ...prev,
                                  subcategories: prev.subcategories.map((item) =>
                                    item.id === sub.id ? { ...item, name: value } : item
                                  ),
                                }))
                              }
                            />
                            <TextArea
                              label="Subcategory Description"
                              value={sub.description}
                              rows={3}
                              onChange={(value) =>
                                setModalForm((prev) => ({
                                  ...prev,
                                  subcategories: prev.subcategories.map((item) =>
                                    item.id === sub.id ? { ...item, description: value } : item
                                  ),
                                }))
                              }
                            />

                            <button
                              type="button"
                              onClick={() =>
                                setModalForm((prev) => ({
                                  ...prev,
                                  subcategories: prev.subcategories.map((item) =>
                                    item.id === sub.id
                                      ? { ...item, visible: item.visible === false }
                                      : item
                                  ),
                                }))
                              }
                              className="inline-flex w-fit items-center gap-2 rounded-xl px-4 py-3 text-sm font-black"
                              style={{
                                background:
                                  sub.visible !== false
                                    ? "rgba(22,138,58,0.1)"
                                    : "rgba(100,116,139,0.12)",
                                color: sub.visible !== false ? colors.green : "#64748B",
                              }}
                            >
                              {sub.visible !== false ? (
                                <>
                                  <Eye className="h-4 w-4" /> Visible
                                </>
                              ) : (
                                <>
                                  <EyeOff className="h-4 w-4" /> Hidden
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      ))}

                      {(modalForm.subcategories || []).length === 0 && (
                        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm font-semibold text-slate-400">
                          No subcategories added yet.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl bg-slate-100 px-5 py-3 text-sm font-black text-slate-700"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSave}
              className="rounded-2xl px-5 py-3 text-sm font-black text-white"
              style={{ background: `linear-gradient(135deg, ${colors.purple}, ${colors.green})` }}
            >
              Save This Section
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function GalleryAlbumCard({ album, index, onEdit, onDelete, onManageImages }) {
  const canDelete = album.category !== "All";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.04, 0.18) }}
      id={`gallery-category-${safeCategoryId(album.category)}${album.subcategory ? `-${safeCategoryId(album.subcategory)}` : ""}`}
      className={`group relative grid items-center gap-6 lg:gap-12 rounded-[2rem] border border-dashed border-cyan-300/70 bg-white/30 p-4 lg:grid-cols-2 ${
        index % 2 !== 0 ? "lg:[&>*:first-child]:order-2" : ""
      }`}
    >
      <div className="absolute right-4 top-4 z-40 flex flex-wrap justify-end gap-2 opacity-100 md:opacity-0 md:transition-opacity md:duration-200 md:group-hover:opacity-100">
        <IconButton
          icon={Edit3}
          label="Edit"
          tone="purple"
          onClick={() => onManageImages?.(album.category, album.subcategory)}
        />
        <IconButton
          icon={Upload}
          label="Upload"
          tone="green"
          onClick={() => onManageImages?.(album.category, album.subcategory)}
        />
        {canDelete && (
          <IconButton icon={Trash2} label="Delete" tone="red" onClick={onDelete} />
        )}
      </div>

      <div className="overflow-hidden rounded-[32px] bg-white shadow-2xl">
        {album.cover ? (
          <img
            src={album.cover}
            alt={album.title}
            className="h-64 sm:h-80 lg:h-[450px] w-full object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-64 sm:h-80 lg:h-[450px] w-full items-center justify-center bg-slate-100">
            <ImageIcon className="h-16 w-16 text-slate-300" />
          </div>
        )}
      </div>

      <div className="px-2 py-8">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-green-100 px-4 py-2 font-semibold text-green-700">
            {album.category}
          </span>
          {album.subcategory && (
            <span className="rounded-full bg-purple-100 px-4 py-2 font-semibold text-purple-700">
              {album.subcategory}
            </span>
          )}
        </div>

        <h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900">
          {album.title}
        </h2>
        <p className="mt-3 text-slate-500">{album.date}</p>
        <p className="mt-6 text-lg leading-relaxed text-slate-600">
          {album.description}
        </p>

        <button
          type="button"
          disabled={album.total === 0}
          className="relative z-10 mt-8 rounded-xl px-6 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
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

function GalleryVisualEditor({ form, activeCategory, setActiveCategory, onEditHero, onEditCategory, onEditBottom, onAddCategory, onDeleteCategory, onDeleteSubcategory, onManageImages }) {
  const categories = ["All", ...normalizeCategories(form.categories)];
  const filteredAlbums = useMemo(
    () => buildCategoryAlbums(form, activeCategory),
    [form, activeCategory]
  );

  return (
    <>
      <style>
        {`
          @media (max-width: 767px) {
            #gallery-admin-preview .group .opacity-0,
            #gallery-admin-preview .group [class*="opacity-0"],
            #gallery-admin-preview .group .md\\:opacity-0,
            #gallery-admin-preview .group [class*="md:opacity-0"],
            #gallery-admin-preview .group [class*="group-hover:opacity"],
            #gallery-admin-preview [class*="group-hover:opacity"] {
              opacity: 1 !important;
              visibility: visible !important;
              pointer-events: auto !important;
            }

            #gallery-admin-preview .group .pointer-events-none,
            #gallery-admin-preview .group [class*="pointer-events-none"] {
              pointer-events: auto !important;
            }

            #gallery-admin-preview .group button[class*="opacity-0"],
            #gallery-admin-preview button[class*="group-hover:opacity"],
            #gallery-admin-preview button[class*="opacity-0"] {
              opacity: 1 !important;
              visibility: visible !important;
              pointer-events: auto !important;
            }

            #gallery-admin-preview [class*="absolute"] button,
            #gallery-admin-preview button[class*="rounded-full"] {
              min-width: 2.25rem !important;
              min-height: 2.25rem !important;
              max-width: calc(100vw - 2rem) !important;
              white-space: nowrap !important;
              z-index: 30 !important;
              pointer-events: auto !important;
            }

            #gallery-admin-preview [class*="z-50"],
            #gallery-admin-preview [class*="z-[50]"],
            #gallery-admin-preview [class*="z-[60]"],
            #gallery-admin-preview [class*="z-[70]"],
            #gallery-admin-preview [class*="z-[80]"],
            #gallery-admin-preview [class*="z-[90]"],
            #gallery-admin-preview [class*="z-[999]"] {
              z-index: 30 !important;
            }
          }
        `}
      </style>

      <section
        id="gallery-admin-preview"
      className="relative min-h-screen overflow-hidden pb-24 pt-10"
      style={{
        background: `
          radial-gradient(circle at top right, rgba(124,92,196,0.18), transparent 34%),
          radial-gradient(circle at bottom left, rgba(22,138,58,0.14), transparent 32%),
          linear-gradient(180deg, #FFF8EE 0%, #F1ECFF 100%)
        `,
      }}
    >
      <div className="pointer-events-none absolute right-0 top-0 h-[280px] w-[280px] sm:h-[520px] sm:w-[520px] rounded-full bg-purple-500/10 blur-2xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-[260px] w-[260px] sm:h-[420px] sm:w-[420px] rounded-full bg-green-500/10 blur-2xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <div
          className="mb-6 sm:mb-8 rounded-[28px] p-4 sm:p-5"
          style={lightAdminPanelStyle}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div
                className="text-xs font-black uppercase tracking-[0.22em]"
                style={{ color: colors.softPurple }}
              >
                Admin Gallery Editor Active
              </div>
              <p className="mt-1 text-sm font-semibold text-slate-600">
                Use Edit or Upload to open the Gallery Image Manager. Add subcategories inside Gallery Image Manager.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <IconButton icon={Plus} label="Add Category" tone="green" onClick={onAddCategory} />
              <IconButton icon={Upload} label="Manage Images" tone="purple" onClick={() => onManageImages?.(activeCategory === "All" ? "" : activeCategory)} />
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="group relative mb-8 sm:mb-12 rounded-[32px] border border-dashed border-cyan-300/80 p-5 sm:p-8 text-center"
        >
          <div className="absolute right-5 top-5 z-30 opacity-100 md:opacity-0 md:transition-opacity md:duration-200 md:group-hover:opacity-100">
            <IconButton icon={Edit3} label="Edit Heading" tone="purple" onClick={onEditHero} />
          </div>

          <span
            className="mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold"
            style={{
              background: "rgba(75,46,131,0.09)",
              color: colors.purple,
              border: "1px solid rgba(75,46,131,0.16)",
            }}
          >
            <Camera className="h-4 w-4" />
            {form.badge}
          </span>

          <h1
            className="mb-4 text-4xl text-slate-950 md:text-6xl"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 850,
              letterSpacing: "-0.045em",
            }}
          >
            <HighlightedTitle title={form.title} highlightedText={form.highlightedText} />
          </h1>

          <p className="mx-auto max-w-3xl text-base leading-relaxed text-slate-500 md:text-lg">
            {form.description}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="mb-8 sm:mb-12 flex flex-wrap justify-center gap-3"
        >
          {categories.map((category) => {
            const active = activeCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className="rounded-2xl px-5 py-3 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5"
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
            <div className="space-y-10 sm:space-y-16 lg:space-y-24">
              {filteredAlbums.map((album, index) => (
                <GalleryAlbumCard
                  key={`${album.category}-${album.subcategory || album.title}`}
                  album={album}
                  index={index}
                  onEdit={() => onManageImages?.(album.category, album.subcategory)}
                  onDelete={() =>
                    album.subcategory
                      ? onDeleteSubcategory(album.category, album.subcategory)
                      : onDeleteCategory(album.category)
                  }
                  onManageImages={onManageImages}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl bg-white p-10 text-center">
              <ImageIcon className="mx-auto mb-4 h-14 w-14 text-slate-300" />
              <div className="font-bold text-slate-800">No gallery images found.</div>
              <div className="mt-1 text-sm text-slate-500">Please check another category.</div>
            </div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="group relative mt-10 flex flex-col gap-4 rounded-3xl border border-dashed border-cyan-300/70 p-6 md:flex-row md:items-center md:justify-between"
          style={lightAdminPanelStyle}
        >
          <div className="absolute right-4 top-4 z-30 opacity-100 md:opacity-0 md:transition-opacity md:duration-200 md:group-hover:opacity-100">
            <IconButton icon={Edit3} label="Edit Bottom" tone="green" onClick={onEditBottom} />
          </div>

          <div className="flex items-center gap-4">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl"
              style={{
                background: "rgba(75,46,131,0.1)",
                color: colors.purple,
              }}
            >
              <Layers className="h-6 w-6" />
            </div>
            <div>
              <div className="font-black text-slate-950">{form.bottomTitle}</div>
              <div className="text-sm text-slate-500">{form.bottomDescription}</div>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600">
            <Sparkles className="h-4 w-4" style={{ color: colors.gold }} />
            {form.bottomNote}
          </div>
        </motion.div>
      </div>
      </section>
    </>
  );
}

export default function AdminGallery() {
  const navigate = useNavigate();

  const [form, setForm] = useState(defaultGalleryContent);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [editingTarget, setEditingTarget] = useState(null);
  const [modalForm, setModalForm] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [busyOverlayText, setBusyOverlayText] = useState("");

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    let alive = true;

    const loadGalleryContent = async () => {
      try {
        const res = await axios.get(
          "https://school-website-backend-ixx2.onrender.com/api/site-content/gallery",
          { timeout: 20000 }
        );

        if (!alive) return;

        const savedContent = res.data?.data?.content || {};
        const mergedContent = mergeGalleryContent(savedContent);

        setForm(mergedContent);
        setError("");
      } catch (err) {
        console.error("Load gallery content error:", err);

        if (!alive) return;

        setForm(defaultGalleryContent);
        setError(
          "Gallery content took too long to load. Default editor is shown. Check backend if saved content is missing."
        );
      } finally {
        if (alive) setLoading(false);
      }
    };

    loadGalleryContent();

    return () => {
      alive = false;
    };
  }, []);

  const openHeroEditor = () => {
    setEditingTarget({ type: "hero", label: "Edit Gallery Heading" });
    setModalForm({
      badge: form.badge,
      title: form.title,
      highlightedText: form.highlightedText,
      description: form.description,
    });
  };

  const openBottomEditor = () => {
    setEditingTarget({ type: "bottom", label: "Edit Bottom Info Card" });
    setModalForm({
      bottomTitle: form.bottomTitle,
      bottomDescription: form.bottomDescription,
      bottomNote: form.bottomNote,
    });
  };

  const openCategoryEditor = (category) => {
    const normalizedSubcategories = normalizeSubcategories(form.subcategories, form.categories);

    setEditingTarget({
      type: "category",
      label: `Edit ${category}`,
      category,
    });

    setModalForm({
      name: category,
      description:
        form.categoryDescriptions?.[category] ||
        fallbackCategoryDescriptions[category] ||
        "",
      subcategories: (normalizedSubcategories[category] || []).map((sub) => ({
        ...sub,
        originalName: sub.name,
      })),
    });
  };

  const closeModal = () => {
    setEditingTarget(null);
    setModalForm({});
  };

  const addCategory = async () => {
    setSuccess("");
    setError("");
    setBusyOverlayText("Adding New Category");

    try {
      const categories = normalizeCategories(form.categories);
      let newName = "New Category";
      let counter = 1;

      while (categories.includes(newName)) {
        counter += 1;
        newName = `New Category ${counter}`;
      }

      const nextForm = {
        ...form,
        categories: [...categories, newName],
        categoryDescriptions: {
          ...(form.categoryDescriptions || {}),
          [newName]: "",
        },
        subcategories: {
          ...normalizeSubcategories(form.subcategories, form.categories),
          [newName]: [],
        },
      };

      const saved = await persistGalleryContent(
        nextForm,
        `Category "${newName}" added and saved.`
      );

      if (!saved) return;

      setActiveCategory(newName);

      window.setTimeout(() => {
        const target = document.getElementById(
          `gallery-category-${safeCategoryId(newName)}`
        );

        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 250);
    } finally {
      setBusyOverlayText("");
    }
  };

  const requestDeleteCategory = (categoryToDelete) => {
    if (categoryToDelete === "All") return;

    const categories = normalizeCategories(form.categories);

    if (categories.length <= 1) {
      setError("At least one gallery category is required.");
      return;
    }

    const fallbackCategory = categories.find(
      (category) => category !== categoryToDelete
    );

    setDeleteTarget({
      type: "category",
      category: categoryToDelete,
      message: `Delete category \"${categoryToDelete}\"? Images inside it will be moved to ${fallbackCategory || "the remaining category"}.`,
    });
  };

  const cleanGalleryForm = (draftForm) => {
    const cleanedCategories = normalizeCategories(draftForm.categories);
    const cleanedDescriptions = normalizeCategoryDescriptions(
      draftForm.categoryDescriptions,
      cleanedCategories
    );
    const cleanedSubcategories = normalizeSubcategories(
      draftForm.subcategories,
      cleanedCategories
    );

    const cleanedImages = (draftForm.images || []).map((image) => {
      const category = normalizeImageCategory(image.category, cleanedCategories);
      const subcategoryOptions = cleanedSubcategories[category] || [];

      const validSubcategory = subcategoryOptions.some(
        (item) => item.name === image.subcategory
      );

      return {
        ...image,
        category,
        subcategory:
          subcategoryOptions.length > 0
            ? validSubcategory
              ? image.subcategory
              : subcategoryOptions[0]?.name || ""
            : "",
        images:
          Array.isArray(image.images) && image.images.length > 0
            ? image.images
            : image.image
            ? [image.image]
            : [],
      };
    });

    return {
      ...draftForm,
      categories: cleanedCategories,
      categoryDescriptions: cleanedDescriptions,
      subcategories: cleanedSubcategories,
      images: cleanedImages,
    };
  };

  const persistGalleryContent = async (draftForm, successMessage) => {
    const cleanedForm = cleanGalleryForm(draftForm);

    setSaving(true);
    setError("");

    try {
      await axios.put(
        "https://school-website-backend-ixx2.onrender.com/api/site-content/gallery",
        { content: cleanedForm },
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 30000,
        }
      );

      setForm(cleanedForm);
      setSuccess(successMessage || "Gallery page content saved successfully.");
      return true;
    } catch (err) {
      console.error("Save gallery content error:", err);
      setError(
        err.response?.data?.message ||
          JSON.stringify(err.response?.data) ||
          "Could not save gallery content."
      );
      return false;
    } finally {
      setSaving(false);
    }
  };

  const buildCategoryDeleteForm = (sourceForm, categoryToDelete) => {
    const categoriesBeforeDelete = normalizeCategories(sourceForm.categories);
    const categories = categoriesBeforeDelete.filter(
      (category) => category !== categoryToDelete
    );
    const fallbackCategory = categories[0] || categoriesBeforeDelete[0] || "Gallery";

    const nextDescriptions = { ...(sourceForm.categoryDescriptions || {}) };
    delete nextDescriptions[categoryToDelete];

    const normalizedSubcategories = normalizeSubcategories(
      sourceForm.subcategories,
      sourceForm.categories
    );
    const nextSubcategories = { ...normalizedSubcategories };
    delete nextSubcategories[categoryToDelete];

    return {
      ...sourceForm,
      categories,
      categoryDescriptions: nextDescriptions,
      subcategories: nextSubcategories,
      images: (sourceForm.images || []).map((image) =>
        image.category === categoryToDelete
          ? { ...image, category: fallbackCategory, subcategory: "" }
          : image
      ),
    };
  };

  const deleteCategoryNow = async (categoryToDelete) => {
    const categories = normalizeCategories(form.categories);

    if (categories.length <= 1) {
      setError("At least one gallery category is required.");
      return;
    }

    const nextForm = buildCategoryDeleteForm(form, categoryToDelete);
    setActiveCategory("All");
    await persistGalleryContent(
      nextForm,
      `Category "${categoryToDelete}" deleted and saved.`
    );
  };

  const requestDeleteSubcategoryFromBlock = (category, subcategoryName) => {
    if (!category || !subcategoryName) return;

    setDeleteTarget({
      type: "subcategoryBlock",
      category,
      subcategoryName,
      message: `Delete subcategory "${subcategoryName}" from ${category}? Images using it will move to the general ${category} album.`,
    });
  };

  const deleteSubcategoryNow = (category, subcategoryName) => {
    setForm((prev) => {
      const normalizedSubcategories = normalizeSubcategories(prev.subcategories, prev.categories);
      const currentList = normalizedSubcategories[category] || [];

      return {
        ...prev,
        subcategories: {
          ...normalizedSubcategories,
          [category]: currentList.filter((item) => item.name !== subcategoryName),
        },
        images: prev.images.map((image) =>
          image.category === category && image.subcategory === subcategoryName
            ? { ...image, subcategory: "" }
            : image
        ),
      };
    });

    setSuccess("Subcategory deleted. Click Save Changes to publish.");
    setError("");
  };

  const addSubcategoryToCategory = (category) => {
    if (!category || category === "All") return;

    setForm((prev) => {
      const normalizedSubcategories = normalizeSubcategories(prev.subcategories, prev.categories);
      const currentList = normalizedSubcategories[category] || [];

      let newName = `New ${category} Subcategory`;
      let counter = 1;
      const existingNames = new Set(currentList.map((item) => item.name));

      while (existingNames.has(newName)) {
        counter += 1;
        newName = `New ${category} Subcategory ${counter}`;
      }

      const newSubcategory = {
        id: `${category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`,
        name: newName,
        description: "",
        visible: true,
      };

      return {
        ...prev,
        subcategories: {
          ...normalizedSubcategories,
          [category]: [...currentList, newSubcategory],
        },
      };
    });

    setActiveCategory(category);
    setSuccess(`Subcategory added inside ${category}. Click Save Changes to publish.`);
    setError("");
  };

  const addSubcategoryInModal = () => {
    if (!editingTarget?.category) return;

    setModalForm((prev) => ({
      ...prev,
      subcategories: [
        ...(prev.subcategories || []),
        {
          id: `${editingTarget.category.toLowerCase()}-${Date.now()}`,
          name: `New ${editingTarget.category} Subcategory`,
          originalName: "",
          description: "",
          visible: true,
        },
      ],
    }));
  };

  const requestDeleteSubcategory = (subcategory) => {
    setDeleteTarget({
      type: "subcategory",
      subcategory,
      message: `Delete subcategory \"${subcategory.name}\"? Images using it will move to the general category.`,
    });
  };

  const deleteSubcategoryInModal = (subcategoryId) => {
    setModalForm((prev) => ({
      ...prev,
      subcategories: (prev.subcategories || []).filter(
        (item) => item.id !== subcategoryId
      ),
    }));
  };

  const saveEditingSection = () => {
    if (!editingTarget) return;

    if (editingTarget.type === "hero") {
      setForm((prev) => ({
        ...prev,
        badge: modalForm.badge,
        title: modalForm.title,
        highlightedText: modalForm.highlightedText,
        description: modalForm.description,
      }));
      closeModal();
      setSuccess("Heading updated. Click Save Changes to publish.");
      return;
    }

    if (editingTarget.type === "bottom") {
      setForm((prev) => ({
        ...prev,
        bottomTitle: modalForm.bottomTitle,
        bottomDescription: modalForm.bottomDescription,
        bottomNote: modalForm.bottomNote,
      }));
      closeModal();
      setSuccess("Bottom card updated. Click Save Changes to publish.");
      return;
    }

    if (editingTarget.type === "category") {
      const oldCategory = editingTarget.category;
      const newCategory = String(modalForm.name || "").trim();

      if (!newCategory) {
        setError("Category name cannot be empty.");
        return;
      }

      setForm((prev) => {
        const categories = normalizeCategories(prev.categories);
        const nextCategories = categories.map((category) =>
          category === oldCategory ? newCategory : category
        );

        const nextDescriptions = { ...(prev.categoryDescriptions || {}) };
        delete nextDescriptions[oldCategory];
        nextDescriptions[newCategory] = modalForm.description || "";

        const normalizedSubcategories = normalizeSubcategories(prev.subcategories, prev.categories);
        const nextSubcategories = { ...normalizedSubcategories };

        nextSubcategories[newCategory] = (modalForm.subcategories || [])
          .map((sub) => ({
            id: sub.id || `${newCategory.toLowerCase()}-${Date.now()}`,
            name: String(sub.name || "").trim(),
            description: sub.description || "",
            visible: sub.visible !== false,
            originalName: sub.originalName || "",
          }))
          .filter((sub) => sub.name);

        if (oldCategory !== newCategory) {
          delete nextSubcategories[oldCategory];
        }

        let nextImages = prev.images.map((image) =>
          image.category === oldCategory
            ? { ...image, category: newCategory }
            : image
        );

        const newSubNames = new Set(
          (nextSubcategories[newCategory] || []).map((sub) => sub.name)
        );

        nextImages = nextImages.map((image) => {
          if (image.category !== oldCategory && image.category !== newCategory) {
            return image;
          }

          const renamedSub = (modalForm.subcategories || []).find(
            (sub) =>
              sub.originalName &&
              image.subcategory === sub.originalName &&
              sub.name
          );

          if (renamedSub) {
            return { ...image, subcategory: renamedSub.name };
          }

          if (image.subcategory && !newSubNames.has(image.subcategory)) {
            return { ...image, subcategory: "" };
          }

          return image;
        });

        return {
          ...prev,
          categories: Array.from(new Set(nextCategories)),
          categoryDescriptions: nextDescriptions,
          subcategories: nextSubcategories,
          images: nextImages,
        };
      });

      closeModal();
      setSuccess("Category updated. Click Save Changes to publish.");
    }
  };

  async function saveGalleryContent() {
    setSuccess("");
    setError("");

    const saved = await persistGalleryContent(
      form,
      "Gallery page content saved successfully."
    );

    if (saved) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  const confirmDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === "category") {
      deleteCategoryNow(deleteTarget.category);
      setDeleteTarget(null);
      return;
    }

    if (deleteTarget.type === "subcategory") {
      deleteSubcategoryInModal(deleteTarget.subcategory.id);
      setDeleteTarget(null);
      return;
    }

    if (deleteTarget.type === "subcategoryBlock") {
      deleteSubcategoryNow(deleteTarget.category, deleteTarget.subcategoryName);
      setDeleteTarget(null);
    }
  };

  const openGalleryImageManager = (category = "", subcategory = "") => {
    const params = new URLSearchParams();

    if (category && category !== "All") {
      params.set("category", category);
    }

    if (subcategory) {
      params.set("subcategory", subcategory);
    }

    const query = params.toString();
    navigate(`/admin/gallery-images${query ? `?${query}` : ""}`, {
      state: {
        fromAdminGalleryEditor: true,
      },
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: "#FFF8EE" }}>
        <div className="font-semibold text-slate-600">Loading gallery editor...</div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-[#FFF8EE] overflow-x-hidden">
      <AnimatePresence>
        {busyOverlayText && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999999] flex items-center justify-center px-6"
            style={{
              background: "rgba(2,6,23,0.52)",
              backdropFilter: "blur(14px)",
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 18 }}
              className="w-full max-w-sm rounded-[32px] p-8 text-center shadow-2xl"
              style={lightAdminPanelStyle}
            >
              <div
                className="mx-auto mb-5 h-14 w-14 animate-spin rounded-full"
                style={{
                  border: "4px solid rgba(75,46,131,0.14)",
                  borderTopColor: colors.gold,
                }}
              />

              <div className="text-2xl font-black text-slate-950">
                {busyOverlayText}
              </div>

              <p className="mt-2 text-sm font-semibold text-slate-500">
                Please wait. Saving it first so it will not disappear after reload.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <header
        className="relative z-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.96), rgba(248,244,255,0.95), rgba(238,247,255,0.95))",
          borderBottom: "1px solid rgba(75,46,131,0.12)",
          boxShadow: "0 14px 36px rgba(15,23,42,0.08)",
          backdropFilter: "blur(18px)",
        }}
      >
        <div className="mx-auto flex min-h-20 max-w-[1600px] flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <button
            type="button"
            onClick={() => navigate("/admin/dashboard")}
            className="inline-flex items-center gap-2 font-black transition-all hover:-translate-x-1"
            style={{ color: colors.dark }}
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Dashboard
          </button>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => openGalleryImageManager()}
              className="hidden items-center gap-2 rounded-2xl px-4 py-3 font-black transition-all hover:scale-105 md:inline-flex"
              style={{
                color: colors.dark,
                background: "rgba(255,255,255,0.72)",
                border: "1px solid rgba(75,46,131,0.12)",
                boxShadow: "0 10px 26px rgba(15,23,42,0.06)",
              }}
            >
              <Upload className="h-4 w-4" />
              Manage Images
            </button>

            <a
              href="/gallery"
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-2 rounded-2xl px-4 py-3 font-black transition-all hover:scale-105 md:inline-flex"
              style={{
                color: colors.dark,
                background: "rgba(255,255,255,0.72)",
                border: "1px solid rgba(75,46,131,0.12)",
                boxShadow: "0 10px 26px rgba(15,23,42,0.06)",
              }}
            >
              <ExternalLink className="h-4 w-4" />
              View Gallery Page
            </a>

            <button
              type="button"
              onClick={saveGalleryContent}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 font-bold transition-all hover:scale-105 disabled:opacity-60"
              style={{
                color: "#020617",
                background: `linear-gradient(135deg, ${colors.gold}, ${colors.cyan})`,
                boxShadow:
                  "0 18px 42px rgba(56,189,248,0.28), inset 0 1px 0 rgba(255,255,255,0.45)",
              }}
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </header>

      <main>
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 pt-6 sm:pt-8">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
            <span
              className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold"
              style={{
                background: "rgba(75,46,131,0.1)",
                color: colors.purple,
                border: "1px solid rgba(75,46,131,0.2)",
              }}
            >
              <Camera className="h-4 w-4" />
              Manage Gallery Page
            </span>

            <h1
              className="mb-2 text-4xl md:text-6xl"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 850,
                color: colors.dark,
                letterSpacing: "-0.045em",
              }}
            >
              Edit Gallery Page
            </h1>

            <p className="max-w-3xl text-lg text-slate-500">
              Visual editor mode. Hover the real gallery sections and click pencil/edit buttons. Use Manage Images for uploading and removing photos.
            </p>
          </motion.div>

          {success && (
            <div
              className="mt-6 flex items-center gap-3 rounded-2xl px-5 py-4 font-semibold"
              style={{
                background: "rgba(22,138,58,0.1)",
                color: colors.green,
                border: "1px solid rgba(22,138,58,0.2)",
              }}
            >
              <CheckCircle2 className="h-5 w-5" />
              {success}
            </div>
          )}

          {error && (
            <div
              className="mt-6 flex items-center gap-3 rounded-2xl px-5 py-4 font-semibold"
              style={{
                background: "rgba(215,25,32,0.1)",
                color: colors.red,
                border: "1px solid rgba(215,25,32,0.2)",
              }}
            >
              <AlertCircle className="h-5 w-5" />
              {error}
            </div>
          )}
        </div>

        <GalleryVisualEditor
          form={form}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          onEditHero={openHeroEditor}
          onEditCategory={openCategoryEditor}
          onEditBottom={openBottomEditor}
          onAddCategory={addCategory}
          onDeleteCategory={requestDeleteCategory}
          onDeleteSubcategory={requestDeleteSubcategoryFromBlock}
          onManageImages={openGalleryImageManager}
        />
      </main>

      <EditModal
        target={editingTarget}
        modalForm={modalForm}
        setModalForm={setModalForm}
        onClose={closeModal}
        onSave={saveEditingSection}
        onRequestDeleteSubcategory={requestDeleteSubcategory}
      />

      <ConfirmDialog
        target={deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </section>
  );
}