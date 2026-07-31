import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
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
} from "lucide-react";

const colors = {
  red: "#D71920",
  green: "#168A3A",
  purple: "#4B2E83",
  dark: "#0B1020",
  cyan: "#38BDF8",
  gold: "#FACC15",
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

function cleanFileName(fileName = "") {
  return fileName
    .replace(/\.[^/.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

async function uploadGalleryImage(file) {
  const formData = new FormData();
  formData.append("file", file);

  const token = localStorage.getItem("adminToken");

  const res = await axios.post("https://school-website-backend-ixx2.onrender.com/api/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    timeout: 20000,
  });

  const uploadedUrl =
    res.data?.url ||
    res.data?.imageUrl ||
    res.data?.fileUrl ||
    res.data?.data?.url ||
    res.data?.data?.imageUrl ||
    res.data?.data?.fileUrl;

  if (!uploadedUrl) {
    throw new Error("Image uploaded but backend did not return image URL.");
  }

  return uploadedUrl;
}

function Field({ label, value, onChange, placeholder = "", type = "text" }) {
  return (
    <div>
      <label className="block text-sm font-bold mb-2 text-slate-700">
        {label}
      </label>

      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-2xl outline-none text-sm"
        style={{
          background: "rgba(255,255,255,0.88)",
          border: "1px solid rgba(75,46,131,0.16)",
          color: colors.dark,
        }}
      />
    </div>
  );
}

function TextArea({ label, value, onChange, rows = 4 }) {
  return (
    <div>
      <label className="block text-sm font-bold mb-2 text-slate-700">
        {label}
      </label>

      <textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full px-4 py-3 rounded-2xl outline-none text-sm resize-none"
        style={{
          background: "rgba(255,255,255,0.88)",
          border: "1px solid rgba(75,46,131,0.16)",
          color: colors.dark,
        }}
      />
    </div>
  );
}

function ConfirmDialog({ target, onCancel, onConfirm }) {
  if (!target) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
        style={{
          background: "rgba(2,6,23,0.62)",
          backdropFilter: "blur(14px)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCancel}
      >
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 14, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 130, damping: 16 }}
          className="w-full max-w-md rounded-[28px] bg-white overflow-hidden"
          style={{ boxShadow: "0 42px 110px rgba(0,0,0,0.32)" }}
          onClick={(event) => event.stopPropagation()}
        >
          <div
            className="h-1"
            style={{
              background: `linear-gradient(90deg, ${colors.red}, ${colors.gold})`,
            }}
          />

          <div className="p-7">
            <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-5">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <h3 className="text-2xl font-black text-slate-950 mb-2">
              {target.title || "Delete item?"}
            </h3>

            <p className="text-sm text-slate-500 leading-relaxed">
              {target.message || "This item will be removed. Click Save Changes to publish."}
            </p>

            {target.name && (
              <div className="mt-4 rounded-2xl bg-slate-50 border border-slate-100 p-4 text-sm font-black text-slate-900">
                {target.name}
              </div>
            )}

            <div className="flex flex-col-reverse sm:flex-row gap-3 mt-7">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 py-3 rounded-2xl text-sm font-black"
                style={{
                  background: "rgba(15,23,42,0.06)",
                  color: "rgba(15,23,42,0.65)",
                  border: "1px solid rgba(15,23,42,0.08)",
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={onConfirm}
                className="flex-1 py-3 rounded-2xl text-sm font-black text-white"
                style={{
                  background: `linear-gradient(135deg, ${colors.red}, #9B1117)`,
                  boxShadow: "0 14px 34px rgba(215,25,32,0.25)",
                }}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}


export default function AdminGalleryImages() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const goBackToGalleryEditor = () => {
    navigate("/admin/gallery");
  };

  const [form, setForm] = useState(defaultGalleryContent);
  const [selectedCategory, setSelectedCategory] = useState("Classroom");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [confirmTarget, setConfirmTarget] = useState(null);

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    let alive = true;

    const loadGalleryContent = async () => {
      try {
        const res = await axios.get(
          "https://school-website-backend-ixx2.onrender.com/api/site-content/gallery",
          {
            timeout: 8000,
          }
        );

        if (!alive) return;

        const savedContent = res.data?.data?.content || {};
        const merged = mergeGalleryContent(savedContent);

        const categories = normalizeCategories(merged.categories);
        const requestedCategory = searchParams.get("category");
        const requestedSubcategory = searchParams.get("subcategory");
        const initialCategory = categories.includes(requestedCategory)
          ? requestedCategory
          : categories[0];
        const initialSubcategories =
          normalizeSubcategories(merged.subcategories, merged.categories)[initialCategory] || [];
        const initialSubcategory = initialSubcategories.some(
          (item) => item.name === requestedSubcategory
        )
          ? requestedSubcategory
          : initialSubcategories[0]?.name || "";

        setForm(merged);
        setSelectedCategory(initialCategory);
        setSelectedSubcategory(initialSubcategory);
        setError("");
      } catch (err) {
        console.error("Load gallery content error:", err);

        if (!alive) return;

        const fallback = mergeGalleryContent(defaultGalleryContent);
        const categories = normalizeCategories(fallback.categories);
        const requestedCategory = searchParams.get("category");
        const requestedSubcategory = searchParams.get("subcategory");
        const initialCategory = categories.includes(requestedCategory)
          ? requestedCategory
          : categories[0];
        const initialSubcategories =
          normalizeSubcategories(fallback.subcategories, fallback.categories)[initialCategory] || [];
        const initialSubcategory = initialSubcategories.some(
          (item) => item.name === requestedSubcategory
        )
          ? requestedSubcategory
          : initialSubcategories[0]?.name || "";

        setForm(fallback);
        setSelectedCategory(initialCategory);
        setSelectedSubcategory(initialSubcategory);
        setError(
          "Gallery content took too long to load. Default image manager is shown. Check backend if saved content is missing."
        );
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    };

    loadGalleryContent();

    return () => {
      alive = false;
    };
  }, [searchParams]);

  const categoryOptions = normalizeCategories(form.categories);
  const normalizedSubcategories = normalizeSubcategories(form.subcategories, form.categories);

  const selectedSubcategoryOptions =
    normalizedSubcategories[selectedCategory] || [];

  const selectedCategoryImages = (form.images || []).filter(
    (item) =>
      normalizeImageCategory(item.category, form.categories) ===
      selectedCategory
  );

  const allSelected =
    selectedCategoryImages.length > 0 &&
    selectedCategoryImages.every((item) => selectedIds.includes(item.id));

  const updateImage = (id, field, value) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const updateImageCategory = (id, category) => {
    const nextCategory = normalizeImageCategory(category, form.categories);
    const subcategoryOptions =
      normalizeSubcategories(form.subcategories, form.categories)[nextCategory] || [];

    setForm((prev) => ({
      ...prev,
      images: prev.images.map((item) =>
        item.id === id
          ? {
              ...item,
              category: nextCategory,
              subcategory: subcategoryOptions[0]?.name || "",
            }
          : item
      ),
    }));
  };

  const updateCategoryDescription = (value) => {
    setForm((prev) => ({
      ...prev,
      categoryDescriptions: {
        ...(prev.categoryDescriptions || {}),
        [selectedCategory]: value,
      },
    }));
  };

  const updateSelectedCategoryName = (value) => {
    const nextName = String(value || "").trimStart();
    if (!nextName) return;

    const existing = categoryOptions.filter((category) => category !== selectedCategory);
    if (existing.includes(nextName)) {
      setError(`Category "${nextName}" already exists.`);
      return;
    }

    const oldCategory = selectedCategory;

    setForm((prev) => {
      const categories = normalizeCategories(prev.categories).map((category) =>
        category === oldCategory ? nextName : category
      );

      const nextDescriptions = { ...(prev.categoryDescriptions || {}) };
      nextDescriptions[nextName] = nextDescriptions[oldCategory] || "";
      delete nextDescriptions[oldCategory];

      const normalizedSubcategories = normalizeSubcategories(prev.subcategories, prev.categories);
      const nextSubcategories = { ...normalizedSubcategories };
      nextSubcategories[nextName] = nextSubcategories[oldCategory] || [];
      delete nextSubcategories[oldCategory];

      return {
        ...prev,
        categories: Array.from(new Set(categories)),
        categoryDescriptions: nextDescriptions,
        subcategories: nextSubcategories,
        images: prev.images.map((image) =>
          image.category === oldCategory ? { ...image, category: nextName } : image
        ),
      };
    });

    setSelectedCategory(nextName);
    setError("");
  };

  const addSubcategoryToSelectedCategory = () => {
    setForm((prev) => {
      const normalizedSubcategories = normalizeSubcategories(prev.subcategories, prev.categories);
      const currentList = normalizedSubcategories[selectedCategory] || [];
      const existingNames = new Set(currentList.map((item) => item.name));

      let newName = `New ${selectedCategory} Subcategory`;
      let counter = 1;
      while (existingNames.has(newName)) {
        counter += 1;
        newName = `New ${selectedCategory} Subcategory ${counter}`;
      }

      const newSubcategory = {
        id: `${selectedCategory.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`,
        name: newName,
        description: "",
        visible: true,
      };

      return {
        ...prev,
        subcategories: {
          ...normalizedSubcategories,
          [selectedCategory]: [...currentList, newSubcategory],
        },
      };
    });

    setSelectedSubcategory(`New ${selectedCategory} Subcategory`);
    setSuccess(`Subcategory added inside ${selectedCategory}. Click Save Changes to publish.`);
    setError("");
  };

  const updateSubcategory = (subcategoryId, field, value) => {
    setForm((prev) => {
      const normalizedSubcategories = normalizeSubcategories(prev.subcategories, prev.categories);
      const currentList = normalizedSubcategories[selectedCategory] || [];
      const oldItem = currentList.find((item) => item.id === subcategoryId);

      const cleanValue = field === "name" ? String(value || "").trimStart() : value;
      if (field === "name" && !cleanValue) return prev;

      const updatedList = currentList.map((item) =>
        item.id === subcategoryId ? { ...item, [field]: cleanValue } : item
      );

      const updatedImages =
        field === "name" && oldItem
          ? prev.images.map((image) =>
              image.category === selectedCategory && image.subcategory === oldItem.name
                ? { ...image, subcategory: cleanValue }
                : image
            )
          : prev.images;

      return {
        ...prev,
        subcategories: {
          ...normalizedSubcategories,
          [selectedCategory]: updatedList,
        },
        images: updatedImages,
      };
    });

    if (field === "name" && selectedSubcategoryOptions.some((item) => item.id === subcategoryId && item.name === selectedSubcategory)) {
      setSelectedSubcategory(value);
    }
  };

  const deleteSubcategoryFromSelectedCategory = (subcategory) => {
    setConfirmTarget({
      title: "Delete subcategory?",
      name: subcategory.name,
      message: `Images using this subcategory will move to the general ${selectedCategory} album. Click Save Changes to publish.`,
      onConfirm: () => {
        setForm((prev) => {
          const normalizedSubcategories = normalizeSubcategories(
            prev.subcategories,
            prev.categories
          );
          const currentList = normalizedSubcategories[selectedCategory] || [];
          const remaining = currentList.filter(
            (item) => item.id !== subcategory.id
          );

          return {
            ...prev,
            subcategories: {
              ...normalizedSubcategories,
              [selectedCategory]: remaining,
            },
            images: prev.images.map((image) =>
              image.category === selectedCategory &&
              image.subcategory === subcategory.name
                ? { ...image, subcategory: "" }
                : image
            ),
          };
        });

        if (selectedSubcategory === subcategory.name) {
          const remaining = selectedSubcategoryOptions.filter(
            (item) => item.id !== subcategory.id
          );
          setSelectedSubcategory(remaining[0]?.name || "");
        }

        setSuccess("Subcategory removed. Click Save Changes to publish.");
        setError("");
      },
    });
  };

  const validateImageFile = (file) => {
    if (!file.type.startsWith("image/")) {
      return "Please upload only image files.";
    }

    if (file.size > 6 * 1024 * 1024) {
      return "Image is too large. Please upload images under 3 MB.";
    }

    return "";
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds((prev) =>
        prev.filter(
          (id) => !selectedCategoryImages.some((item) => item.id === id)
        )
      );
      return;
    }

    setSelectedIds((prev) =>
      Array.from(
        new Set([...prev, ...selectedCategoryImages.map((item) => item.id)])
      )
    );
  };

  const deleteSelected = () => {
    if (selectedIds.length === 0) {
      setError("Select at least one image to delete.");
      return;
    }

    setConfirmTarget({
      title: "Delete selected images?",
      name: `${selectedIds.length} selected image${
        selectedIds.length > 1 ? "s" : ""
      }`,
      message:
        "Selected images will be removed from this gallery. Click Save Changes to publish.",
      onConfirm: () => {
        setForm((prev) => ({
          ...prev,
          images: prev.images.filter((item) => !selectedIds.includes(item.id)),
        }));

        setSelectedIds([]);
        setSuccess("Selected image(s) removed. Click Save Changes to publish.");
        setError("");
      },
    });
  };

  const deleteOne = (id) => {
    const image = form.images.find((item) => item.id === id);

    setConfirmTarget({
      title: "Delete image?",
      name: image?.title || "This image",
      message:
        "This image will be removed from the gallery. Click Save Changes to publish.",
      onConfirm: () => {
        setForm((prev) => ({
          ...prev,
          images: prev.images.filter((item) => item.id !== id),
        }));

        setSelectedIds((prev) => prev.filter((item) => item !== id));
        setSuccess("Image removed. Click Save Changes to publish.");
        setError("");
      },
    });
  };

  const handleUploadImages = async (files) => {
    setError("");
    setSuccess("");

    const selectedFiles = Array.from(files || []);
    if (selectedFiles.length === 0) return;

    const validationError = selectedFiles.map(validateImageFile).find(Boolean);

    if (validationError) {
      setError(validationError);
      return;
    }

    setUploading(true);

    try {
      const activeSubcategory =
        selectedSubcategoryOptions.length > 0
          ? selectedSubcategoryOptions.some(
              (item) => item.name === selectedSubcategory
            )
            ? selectedSubcategory
            : selectedSubcategoryOptions[0]?.name || ""
          : "";

      const uploadedImages = await Promise.all(
        selectedFiles.map(async (file, index) => {
          const imageUrl = await uploadGalleryImage(file);

          return {
            id: `${Date.now()}-${index}-${Math.random()
              .toString(36)
              .substring(2)}`,
            title: cleanFileName(file.name) || `Gallery Image ${index + 1}`,
            category: selectedCategory,
            subcategory: activeSubcategory,
            date: "School Activity",
            description: "",
            image: imageUrl,
            images: [imageUrl],
            visible: true,
          };
        })
      );

      setForm((prev) => ({
        ...prev,
        images: [...uploadedImages, ...prev.images],
      }));

      setSuccess(
        `${uploadedImages.length} image${
          uploadedImages.length > 1 ? "s" : ""
        } uploaded to ${selectedCategory}${
          activeSubcategory ? ` / ${activeSubcategory}` : ""
        }. Click Save Changes to publish.`
      );
    } catch (err) {
      console.error("Gallery upload error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Could not upload selected images. Make sure backend is running and /api/upload is working."
      );
    } finally {
      setUploading(false);
    }
  };

  const handleReplaceImage = async (id, file) => {
    setError("");
    setSuccess("");

    if (!file) return;

    const validationError = validateImageFile(file);

    if (validationError) {
      setError(validationError);
      return;
    }

    setUploading(true);

    try {
      const imageUrl = await uploadGalleryImage(file);

      setForm((prev) => ({
        ...prev,
        images: prev.images.map((item) =>
          item.id === id
            ? {
                ...item,
                image: imageUrl,
                images: [imageUrl],
              }
            : item
        ),
      }));

      setSuccess("Image replaced. Click Save Changes to publish.");
    } catch (err) {
      console.error("Replace gallery image error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Could not replace image."
      );
    } finally {
      setUploading(false);
    }
  };

  async function saveGalleryContent() {
    setSuccess("");
    setError("");
    setSaving(true);

    try {
      const cleanedCategories = normalizeCategories(form.categories);
      const cleanedDescriptions = normalizeCategoryDescriptions(
        form.categoryDescriptions,
        cleanedCategories
      );
      const cleanedSubcategories = normalizeSubcategories(form.subcategories, cleanedCategories);

      const cleanedImages = form.images.map((image) => {
        const category = normalizeImageCategory(
          image.category,
          cleanedCategories
        );
        const subcategoryOptions = cleanedSubcategories[category] || [];

        const validSubcategory = subcategoryOptions.some(
          (item) => item.name === image.subcategory
        );

        return {
          ...image,
          description: "",
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

      const cleanedForm = {
        ...form,
        categories: cleanedCategories,
        categoryDescriptions: cleanedDescriptions,
        subcategories: cleanedSubcategories,
        images: cleanedImages,
      };

      await axios.put(
        "https://school-website-backend-ixx2.onrender.com/api/site-content/gallery",
        { content: cleanedForm },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 30000,
        }
      );

      setForm(cleanedForm);
      setSuccess("Gallery images saved successfully.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Save gallery images error:", err);
      setError(
        err.response?.data?.message ||
          JSON.stringify(err.response?.data) ||
          "Could not save gallery images."
      );
    } finally {
      setSaving(false);
    }
  }

  const confirmDeleteAction = () => {
    if (!confirmTarget?.onConfirm) {
      setConfirmTarget(null);
      return;
    }

    confirmTarget.onConfirm();
    setConfirmTarget(null);
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#FFF8EE" }}
      >
        <div className="text-slate-600 font-semibold">
          Loading gallery image manager...
        </div>
      </div>
    );
  }

  return (
    <section
      className="min-h-screen relative overflow-hidden"
      style={{
        background: `
          radial-gradient(circle at top right, rgba(56,189,248,0.16), transparent 34%),
          radial-gradient(circle at bottom left, rgba(250,204,21,0.12), transparent 32%),
          linear-gradient(180deg, #FFF8EE 0%, #F1ECFF 100%)
        `,
      }}
    >
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
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <button
            type="button"
            onClick={goBackToGalleryEditor}
            className="inline-flex w-fit items-center gap-2 font-black transition-all hover:-translate-x-1"
            style={{ color: colors.dark }}
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Gallery Editor
          </button>

          <button
            type="button"
            onClick={saveGalleryContent}
            disabled={saving || uploading}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-bold transition-all hover:scale-105 disabled:opacity-60"
            style={{
              color: "#020617",
              background: `linear-gradient(135deg, ${colors.gold}, ${colors.cyan})`,
              boxShadow:
                "0 18px 42px rgba(56,189,248,0.28), inset 0 1px 0 rgba(255,255,255,0.45)",
            }}
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-5"
            style={{
              background: "rgba(75,46,131,0.1)",
              color: colors.purple,
              border: "1px solid rgba(75,46,131,0.2)",
            }}
          >
            <ImageIcon className="w-4 h-4" />
            Gallery Image Manager
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
            Upload / Remove Gallery Images
          </h1>

          <p className="text-slate-500 max-w-3xl text-lg">
            Select a category and subcategory, upload one or multiple images,
            select multiple images, delete selected images, and edit image
            details.
          </p>
        </motion.div>

        {success && (
          <div
            className="mb-6 rounded-2xl px-5 py-4 flex items-center gap-3 font-semibold"
            style={{
              background: "rgba(22,138,58,0.1)",
              color: colors.green,
              border: "1px solid rgba(22,138,58,0.2)",
            }}
          >
            <CheckCircle2 className="w-5 h-5" />
            {success}
          </div>
        )}

        {error && (
          <div
            className="mb-6 rounded-2xl px-5 py-4 font-semibold"
            style={{
              background: "rgba(215,25,32,0.1)",
              color: colors.red,
              border: "1px solid rgba(215,25,32,0.2)",
            }}
          >
            {error}
          </div>
        )}

        <div
          className="rounded-[32px] p-6 mb-8"
          style={{
            background:
              "linear-gradient(145deg, rgba(255,255,255,0.96), rgba(255,255,255,0.78))",
            border: "1px solid rgba(11,16,32,0.08)",
            boxShadow:
              "0 18px 48px rgba(11,16,32,0.075), inset 0 1px 0 rgba(255,255,255,0.85)",
          }}
        >
          <div className="grid lg:grid-cols-[1fr_auto] gap-5 items-end">
            <div>
              <label className="block text-sm font-bold mb-2 text-slate-700">
                Select Category
              </label>

              <select
                value={selectedCategory}
                onChange={(e) => {
                  const nextCategory = e.target.value;
                  const nextSubcategories =
                    normalizeSubcategories(form.subcategories, form.categories)[nextCategory] ||
                    [];

                  setSelectedCategory(nextCategory);
                  setSelectedSubcategory(nextSubcategories[0]?.name || "");
                  setSelectedIds([]);
                }}
                className="w-full px-4 py-3 rounded-2xl outline-none text-sm"
                style={{
                  background: "rgba(255,255,255,0.88)",
                  border: "1px solid rgba(75,46,131,0.16)",
                  color: colors.dark,
                }}
              >
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              {selectedSubcategoryOptions.length > 0 && (
                <div className="mt-5">
                  <label className="block text-sm font-bold mb-2 text-slate-700">
                    Select Subcategory
                  </label>

                  <select
                    value={selectedSubcategory}
                    onChange={(e) => setSelectedSubcategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl outline-none text-sm"
                    style={{
                      background: "rgba(255,255,255,0.88)",
                      border: "1px solid rgba(75,46,131,0.16)",
                      color: colors.dark,
                    }}
                  >
                    {selectedSubcategoryOptions.map((sub) => (
                      <option key={sub.id} value={sub.name}>
                        {sub.name}
                        {sub.visible === false ? " (Hidden)" : ""}
                      </option>
                    ))}
                  </select>

                  <p className="text-xs text-slate-500 mt-2">
                    Uploaded images will go inside this subcategory.
                  </p>
                </div>
              )}

              <p className="text-xs text-slate-500 mt-2">
                Upload one or many images. Selected images will go inside{" "}
                <b>{selectedCategory}</b>
                {selectedSubcategoryOptions.length > 0 && selectedSubcategory
                  ? ` / ${selectedSubcategory}`
                  : ""}
                .
              </p>
            </div>

            <label
              className="cursor-pointer inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-white"
              style={{
                background: `linear-gradient(135deg, ${colors.purple}, ${colors.green})`,
              }}
            >
              <Upload className="w-5 h-5" />
              {uploading ? "Uploading..." : "Upload Image(s)"}
              <input
                type="file"
                accept="image/*"
                multiple
                disabled={uploading}
                className="hidden"
                onChange={(e) => {
                  handleUploadImages(e.target.files);
                  e.target.value = "";
                }}
              />
            </label>
          </div>

          <div className="mt-6 grid gap-5">
            <Field
              label="Selected Category Name"
              value={selectedCategory}
              onChange={updateSelectedCategoryName}
            />

            <TextArea
              label={`${selectedCategory} Category Description`}
              value={
                form.categoryDescriptions?.[selectedCategory] ||
                fallbackCategoryDescriptions[selectedCategory] ||
                ""
              }
              onChange={updateCategoryDescription}
              rows={4}
            />

            <p className="text-xs text-slate-500 -mt-3">
              This text appears on the category block in the public Gallery page.
            </p>

            <div
              className="rounded-3xl p-5"
              style={{
                background: "rgba(15,23,42,0.035)",
                border: "1px solid rgba(15,23,42,0.08)",
              }}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <div>
                  <h3 className="font-black text-slate-950">
                    Subcategories inside {selectedCategory}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Add, rename, hide, or delete subcategories for this category.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addSubcategoryToSelectedCategory}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-bold text-white"
                  style={{
                    background: `linear-gradient(135deg, ${colors.purple}, ${colors.green})`,
                  }}
                >
                  <Plus className="w-4 h-4" />
                  Add Subcategory
                </button>
              </div>

              <div className="grid gap-4">
                {selectedSubcategoryOptions.map((sub) => (
                  <div
                    key={sub.id}
                    className="rounded-2xl p-4"
                    style={{
                      background: "rgba(255,255,255,0.82)",
                      border: "1px solid rgba(75,46,131,0.12)",
                    }}
                  >
                    <div className="grid gap-4">
                      <Field
                        label="Subcategory Name"
                        value={sub.name}
                        onChange={(value) => updateSubcategory(sub.id, "name", value)}
                      />

                      <TextArea
                        label="Subcategory Description"
                        value={sub.description}
                        onChange={(value) => updateSubcategory(sub.id, "description", value)}
                        rows={3}
                      />

                      <div className="flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => updateSubcategory(sub.id, "visible", !sub.visible)}
                          className="inline-flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold"
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
                              <Eye className="w-4 h-4" />
                              Visible
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-4 h-4" />
                              Hidden
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteSubcategoryFromSelectedCategory(sub)}
                          className="inline-flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold"
                          style={{
                            background: "rgba(215,25,32,0.09)",
                            color: colors.red,
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {selectedSubcategoryOptions.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-white/70 p-5 text-sm font-semibold text-slate-500">
                    No subcategories yet. Click Add Subcategory for this category.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-950">
              {selectedCategory} Images
            </h2>
            <p className="text-slate-500">
              {selectedCategoryImages.length} total · {selectedIds.length}{" "}
              selected
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={toggleSelectAll}
              className="px-5 py-3 rounded-2xl font-bold bg-white border border-slate-200 text-slate-800"
            >
              {allSelected ? "Unselect All" : "Select All"}
            </button>

            <button
              type="button"
              onClick={deleteSelected}
              className="px-5 py-3 rounded-2xl font-bold text-white"
              style={{
                background:
                  selectedIds.length > 0
                    ? colors.red
                    : "rgba(100,116,139,0.55)",
              }}
            >
              Delete Selected
            </button>
          </div>
        </div>

        {selectedCategoryImages.length === 0 ? (
          <div
            className="rounded-[32px] p-12 text-center"
            style={{
              background: "rgba(255,255,255,0.84)",
              border: "1px dashed rgba(15,23,42,0.18)",
            }}
          >
            <ImageIcon className="w-16 h-16 mx-auto text-slate-300 mb-4" />
            <div className="font-black text-slate-900">
              No images in {selectedCategory}.
            </div>
            <div className="text-sm text-slate-500 mt-1">
              Upload one or multiple images from your device.
            </div>
          </div>
        ) : (
          <div className="grid xl:grid-cols-2 gap-6">
            {selectedCategoryImages.map((item) => {
              const checked = selectedIds.includes(item.id);
              const displayImage = item.image || item.images?.[0];
              const itemSubcategoryOptions =
                normalizeSubcategories(form.subcategories, form.categories)[item.category] || [];

              return (
                <div
                  key={item.id}
                  className="rounded-[32px] p-5"
                  style={{
                    background: checked
                      ? "linear-gradient(145deg, rgba(22,138,58,0.12), rgba(255,255,255,0.86))"
                      : "linear-gradient(145deg, rgba(255,255,255,0.96), rgba(255,255,255,0.78))",
                    border: checked
                      ? "1px solid rgba(22,138,58,0.32)"
                      : "1px solid rgba(11,16,32,0.08)",
                    boxShadow:
                      "0 18px 48px rgba(11,16,32,0.075), inset 0 1px 0 rgba(255,255,255,0.85)",
                  }}
                >
                  <div className="flex items-center justify-between gap-4 mb-5">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleSelect(item.id)}
                        className="w-5 h-5"
                      />
                      <span className="font-black text-slate-950">
                        {item.title || "Untitled Image"}
                      </span>
                    </label>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          updateImage(item.id, "visible", !item.visible)
                        }
                        className="p-3 rounded-xl"
                        style={{
                          background:
                            item.visible !== false
                              ? "rgba(22,138,58,0.1)"
                              : "rgba(100,116,139,0.12)",
                          color:
                            item.visible !== false ? colors.green : "#64748B",
                        }}
                        title={item.visible !== false ? "Visible" : "Hidden"}
                      >
                        {item.visible !== false ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteOne(item.id)}
                        className="p-3 rounded-xl"
                        style={{
                          background: "rgba(215,25,32,0.09)",
                          color: colors.red,
                        }}
                        title="Delete image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-[220px_1fr] gap-5">
                    <div>
                      <div
                        className="w-full h-44 rounded-2xl overflow-hidden bg-slate-100 border flex items-center justify-center"
                        style={{ borderColor: "rgba(15,23,42,0.08)" }}
                      >
                        {displayImage ? (
                          <img
                            src={displayImage}
                            alt={item.title}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="w-12 h-12 text-slate-300" />
                        )}
                      </div>

                      <label
                        className="mt-3 w-full cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-bold text-white"
                        style={{
                          background: `linear-gradient(135deg, ${colors.purple}, ${colors.green})`,
                        }}
                      >
                        <Upload className="w-4 h-4" />
                        Replace Image
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={uploading}
                          onChange={(e) => {
                            handleReplaceImage(item.id, e.target.files?.[0]);
                            e.target.value = "";
                          }}
                        />
                      </label>

                      <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                        Recommended size: 1200 × 800 px. max 6 MB.
                      </p>
                    </div>

                    <div className="grid gap-4">
                      <Field
                        label="Image Title"
                        value={item.title}
                        onChange={(value) =>
                          updateImage(item.id, "title", value)
                        }
                      />

                      <div>
                        <label className="block text-sm font-bold mb-2 text-slate-700">
                          Image Category
                        </label>

                        <select
                          value={item.category || ""}
                          onChange={(e) =>
                            updateImageCategory(item.id, e.target.value)
                          }
                          className="w-full px-4 py-3 rounded-2xl outline-none text-sm"
                          style={{
                            background: "rgba(255,255,255,0.88)",
                            border: "1px solid rgba(75,46,131,0.16)",
                            color: colors.dark,
                          }}
                        >
                          {categoryOptions.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>

                        <p className="text-xs text-slate-500 mt-2">
                          Changing this moves the image to another category.
                        </p>
                      </div>

                      {itemSubcategoryOptions.length > 0 && (
                        <div>
                          <label className="block text-sm font-bold mb-2 text-slate-700">
                            Image Subcategory
                          </label>

                          <select
                            value={item.subcategory || ""}
                            onChange={(e) =>
                              updateImage(
                                item.id,
                                "subcategory",
                                e.target.value
                              )
                            }
                            className="w-full px-4 py-3 rounded-2xl outline-none text-sm"
                            style={{
                              background: "rgba(255,255,255,0.88)",
                              border: "1px solid rgba(75,46,131,0.16)",
                              color: colors.dark,
                            }}
                          >
                            {itemSubcategoryOptions.map((sub) => (
                              <option key={sub.id} value={sub.name}>
                                {sub.name}
                                {sub.visible === false ? " (Hidden)" : ""}
                              </option>
                            ))}
                          </select>

                          <p className="text-xs text-slate-500 mt-2">
                            This controls which subcategory album the image
                            appears in.
                          </p>
                        </div>
                      )}

                      <Field
                        label="Date / Label"
                        value={item.date}
                        onChange={(value) =>
                          updateImage(item.id, "date", value)
                        }
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <ConfirmDialog
        target={confirmTarget}
        onCancel={() => setConfirmTarget(null)}
        onConfirm={confirmDeleteAction}
      />
    </section>
  );
}
