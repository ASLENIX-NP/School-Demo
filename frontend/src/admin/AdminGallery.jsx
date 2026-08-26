import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import {
  ArrowLeft,
  Award,
  Camera,
  Check,
  ChevronDown,
  Edit3,
  Eye,
  EyeOff,
  ExternalLink,
  Image as ImageIcon,
  Plus,
  Save,
  Star,
  Trash2,
  Trophy,
  Upload,
  X,
} from "lucide-react";

/*
  ADMIN GALLERY - FULL REPLACEMENT
  File: src/admin/AdminGallery.jsx

  The public Gallery.jsx reads the same /api/site-content/gallery object.
  Therefore every change saved here is reflected on the public gallery.
*/

const DEFAULT_CATEGORIES = ["Classroom", "Events", "Certificate"];

const DEFAULT_CATEGORY_DESCRIPTIONS = {
  Classroom:
    "Classroom moments show students learning, discussing, writing, presenting, and growing through daily academic activities.",
  Events:
    "School events highlight celebrations, programs, competitions, cultural activities, student participation, and memorable school occasions.",
  Certificate:
    "Certificates and awards recognize student achievement, participation, discipline, excellence, and school accomplishments.",
};

const DEFAULT_SUBCATEGORIES = {
  Classroom: [],
  Events: [
    {
      id: "annual-program",
      name: "Annual Program",
      description:
        "Annual programs, performances, celebrations, and school-wide events.",
      visible: true,
    },
    {
      id: "sports-events",
      name: "Sports Events",
      description:
        "Sports competitions, games, teamwork, and athletic participation.",
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

const DEFAULT_CONTENT = {
  heroBadge: "SCHOOL GALLERY",
  heroTitle: "Moments That Become Memories",
  heroHighlightedText: "Memories",
  heroSubtitle:
    "A visual collection of learning, celebrations, achievements, and everyday moments from Red Rose Secondary English Boarding School.",
  heroExploreText: "Explore Gallery",
  heroAchievementText: "Celebrating Our Students",

  badge: "OUR GALLERY",
  title: "School Life in Pictures",
  highlightedText: "Pictures",
  description:
    "Explore classroom learning, school events, certificates, achievements, and the moments that make our school community special.",

  categories: DEFAULT_CATEGORIES,
  categoryDescriptions: DEFAULT_CATEGORY_DESCRIPTIONS,
  subcategories: DEFAULT_SUBCATEGORIES,

  achievements: [
    {
      id: "achievement-1",
      title: "Top School Award",
      year: "2024",
      icon: "Trophy",
      visible: true,
    },
    {
      id: "achievement-2",
      title: "STEM Excellence",
      year: "2023",
      icon: "Award",
      visible: true,
    },
    {
      id: "achievement-3",
      title: "Sports Champion",
      year: "2024",
      icon: "Trophy",
      visible: true,
    },
    {
      id: "achievement-4",
      title: "Community Service",
      year: "2023",
      icon: "Star",
      visible: true,
    },
  ],

  images: [],

  bottomTitle: "Every picture tells a story.",
  bottomDescription:
    "Explore the moments, celebrate the achievements, and remember the journey.",
  bottomNote: "Gallery is managed by the school administration.",
};

function normalizeCategories(value) {
  const list = Array.isArray(value)
    ? value
        .map((item) => String(item || "").trim())
        .filter(Boolean)
        .filter((item) => item.toLowerCase() !== "all")
    : [];

  const unique = [...new Set(list)];
  return unique.length ? unique : [...DEFAULT_CATEGORIES];
}

function normalizeImages(value, categories) {
  if (!Array.isArray(value)) return [];

  return value
    .map((item, index) => {
      const urls = Array.isArray(item?.images)
        ? item.images.filter(Boolean)
        : item?.image
        ? [item.image]
        : [];

      const category = categories.includes(item?.category)
        ? item.category
        : categories[0];

      return {
        id:
          item?.id ||
          `gallery-image-${Date.now()}-${index}-${Math.random()
            .toString(36)
            .slice(2, 7)}`,
        title: String(item?.title || "Gallery Image"),
        description: String(item?.description || ""),
        date: String(item?.date || "School Activity"),
        category,
        subcategory: String(item?.subcategory || ""),
        image: urls[0] || "",
        images: urls,
        visible: item?.visible !== false,
      };
    })
    .filter((item) => item.image);
}

function normalizeSubcategories(value, categories) {
  const output = {};

  categories.forEach((category) => {
    const list = Array.isArray(value?.[category])
      ? value[category]
      : DEFAULT_SUBCATEGORIES[category] || [];

    output[category] = list
      .map((item, index) => {
        if (typeof item === "string") {
          return {
            id: `${category}-${index}`,
            name: item,
            description: "",
            visible: true,
          };
        }

        return {
          id: item?.id || `${category}-${index}`,
          name: String(item?.name || "").trim(),
          description: String(item?.description || ""),
          visible: item?.visible !== false,
        };
      })
      .filter((item) => item.name);
  });

  return output;
}

function normalizeContent(value = {}) {
  const categories = normalizeCategories(value.categories);

  return {
    ...DEFAULT_CONTENT,
    ...value,
    categories,
    categoryDescriptions: categories.reduce((result, category) => {
      result[category] =
        value?.categoryDescriptions?.[category] ||
        DEFAULT_CATEGORY_DESCRIPTIONS[category] ||
        "";
      return result;
    }, {}),
    subcategories: normalizeSubcategories(value.subcategories, categories),
    achievements: Array.isArray(value.achievements)
      ? value.achievements.map((item, index) => ({
          id: item?.id || `achievement-${index}`,
          title: String(item?.title || "Achievement"),
          year: String(item?.year || ""),
          icon: item?.icon || "Trophy",
          visible: item?.visible !== false,
        }))
      : [...DEFAULT_CONTENT.achievements],
    images: normalizeImages(value.images, categories),
  };
}

function getAuthHeaders() {
  const token =
    localStorage.getItem("adminToken") ||
    localStorage.getItem("token") ||
    localStorage.getItem("authToken");

  return token ? { Authorization: `Bearer ${token}` } : {};
}

function AchievementIcon({ type = "Trophy", size = 22 }) {
  if (type === "Award") return <Award size={size} />;
  if (type === "Star") return <Star size={size} />;
  return <Trophy size={size} />;
}

function Field({ label, value, onChange, textarea = false, placeholder = "" }) {
  return (
    <label className="ag-field">
      <span>{label}</span>
      {textarea ? (
        <textarea
          value={value ?? ""}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          value={value ?? ""}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </label>
  );
}

function Modal({ title, subtitle, children, onClose, onSave }) {
  return (
    <div className="ag-modal-backdrop" onMouseDown={onClose}>
      <div className="ag-modal" onMouseDown={(event) => event.stopPropagation()}>
        <div className="ag-modal-head">
          <div>
            <div className="ag-modal-kicker">Gallery Editor</div>
            <h2>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <button className="ag-icon-button" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="ag-modal-body">{children}</div>

        <div className="ag-modal-foot">
          <button className="ag-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="ag-primary" onClick={onSave}>
            <Check size={16} />
            Done Editing
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminGallery() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const replaceInputRefs = useRef({});

  const [content, setContent] = useState(normalizeContent());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Classroom");
  const [activeSubcategory, setActiveSubcategory] = useState("");
  const [search, setSearch] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [modal, setModal] = useState(null);
  const [draft, setDraft] = useState({});
  const [notice, setNotice] = useState(null);

  const showNotice = (message, type = "success") => {
    setNotice({ message, type });
    window.setTimeout(() => setNotice(null), 4000);
  };

  useEffect(() => {
    let mounted = true;

    async function loadGallery() {
      try {
        const response = await api.get("/api/site-content/gallery", {
          timeout: 20000,
        });

        if (!mounted) return;

        const saved = normalizeContent(response?.data?.data?.content || {});
        setContent(saved);
        setActiveCategory(saved.categories[0] || "Classroom");
      } catch (error) {
        console.error("Admin Gallery load error:", error);
        if (mounted) {
          showNotice(
            "Saved gallery could not be loaded. Default content is being shown.",
            "error"
          );
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadGallery();

    return () => {
      mounted = false;
    };
  }, []);

  const currentSubcategories = content.subcategories?.[activeCategory] || [];

  const visibleImages = useMemo(() => {
    const query = search.trim().toLowerCase();

    return content.images.filter((item) => {
      const categoryMatch = item.category === activeCategory;
      const subcategoryMatch =
        !activeSubcategory || item.subcategory === activeSubcategory;

      const searchMatch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.subcategory.toLowerCase().includes(query);

      return categoryMatch && subcategoryMatch && searchMatch;
    });
  }, [content.images, activeCategory, activeSubcategory, search]);

  const updateContent = (changes) => {
    setContent((previous) => normalizeContent({ ...previous, ...changes }));
  };

  const saveGallery = async () => {
    setSaving(true);

    try {
      const clean = normalizeContent(content);

      await api.put(
        "/api/site-content/gallery",
        { content: clean },
        {
          headers: getAuthHeaders(),
          timeout: 30000,
        }
      );

      setContent(clean);
      showNotice("Gallery changes saved successfully.");
    } catch (error) {
      console.error("Gallery save error:", error);
      showNotice(
        error?.response?.data?.message || "Could not save Gallery changes.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/api/upload", formData, {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "multipart/form-data",
      },
      timeout: 30000,
    });

    return (
      response?.data?.url ||
      response?.data?.imageUrl ||
      response?.data?.fileUrl ||
      response?.data?.data?.url ||
      response?.data?.data?.imageUrl ||
      response?.data?.data?.fileUrl ||
      ""
    );
  };

  const handleAddImages = async (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";

    if (!files.length) return;

    setUploading(true);

    try {
      const uploaded = [];

      for (let index = 0; index < files.length; index += 1) {
        const file = files[index];

        if (file.size > 6 * 1024 * 1024) {
          throw new Error(`"${file.name}" is larger than 6 MB.`);
        }

        if (!file.type.startsWith("image/")) {
          throw new Error(`"${file.name}" is not an image file.`);
        }

        const url = await uploadFile(file);

        if (!url) {
          throw new Error(`No image URL was returned for "${file.name}".`);
        }

        uploaded.push({
          id: `gallery-${Date.now()}-${index}-${Math.random()
            .toString(36)
            .slice(2, 7)}`,
          title: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " "),
          description: "",
          date: "School Activity",
          category: activeCategory,
          subcategory: activeSubcategory,
          image: url,
          images: [url],
          visible: true,
        });
      }

      updateContent({
        images: [...uploaded, ...content.images],
      });

      showNotice(
        `${uploaded.length} image${uploaded.length > 1 ? "s" : ""} uploaded. Click Save Changes to publish them.`
      );
    } catch (error) {
      console.error("Gallery image upload error:", error);
      showNotice(error?.message || "Image upload failed.", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleReplaceImage = async (imageId, file) => {
    if (!file) return;

    setUploading(true);

    try {
      if (file.size > 6 * 1024 * 1024) {
        throw new Error("Image must be smaller than 6 MB.");
      }

      const url = await uploadFile(file);

      if (!url) {
        throw new Error("No image URL was returned.");
      }

      updateContent({
        images: content.images.map((item) =>
          item.id === imageId
            ? { ...item, image: url, images: [url] }
            : item
        ),
      });

      showNotice("Image replaced. Click Save Changes to publish it.");
    } catch (error) {
      console.error("Replace image error:", error);
      showNotice(error?.message || "Could not replace image.", "error");
    } finally {
      setUploading(false);
    }
  };

  const updateImage = (id, field, value) => {
    updateContent({
      images: content.images.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    });
  };

  const deleteImage = (id) => {
    updateContent({
      images: content.images.filter((item) => item.id !== id),
    });

    setSelectedImages((items) => items.filter((item) => item !== id));
    showNotice("Image deleted locally. Click Save Changes to publish.");
  };

  const toggleImageSelection = (id) => {
    setSelectedImages((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
  };

  const deleteSelected = () => {
    if (!selectedImages.length) return;

    updateContent({
      images: content.images.filter(
        (item) => !selectedImages.includes(item.id)
      ),
    });

    setSelectedImages([]);
    showNotice("Selected images deleted locally. Click Save Changes to publish.");
  };

  const toggleImageVisibility = (id) => {
    updateContent({
      images: content.images.map((item) =>
        item.id === id ? { ...item, visible: !item.visible } : item
      ),
    });
  };

  const openHeroEditor = () => {
    setDraft({
      heroBadge: content.heroBadge,
      heroTitle: content.heroTitle,
      heroHighlightedText: content.heroHighlightedText,
      heroSubtitle: content.heroSubtitle,
      heroExploreText: content.heroExploreText,
      heroAchievementText: content.heroAchievementText,
    });
    setModal("hero");
  };

  const openMainEditor = () => {
    setDraft({
      badge: content.badge,
      title: content.title,
      highlightedText: content.highlightedText,
      description: content.description,
    });
    setModal("main");
  };

  const openBottomEditor = () => {
    setDraft({
      bottomTitle: content.bottomTitle,
      bottomDescription: content.bottomDescription,
      bottomNote: content.bottomNote,
    });
    setModal("bottom");
  };

  const openCategoryEditor = (category) => {
    setDraft({
      oldName: category,
      name: category,
      description: content.categoryDescriptions?.[category] || "",
      subcategories: (content.subcategories?.[category] || []).map((item) => ({
        ...item,
      })),
    });
    setModal("category");
  };

  const openAchievementEditor = (achievement = null) => {
    setDraft(
      achievement || {
        id: `achievement-${Date.now()}`,
        title: "",
        year: new Date().getFullYear().toString(),
        icon: "Trophy",
        visible: true,
      }
    );
    setModal("achievement");
  };

  const openImageEditor = (image) => {
    setDraft({ ...image });
    setModal("image");
  };

  const closeModal = () => {
    if (uploading) return;
    setModal(null);
    setDraft({});
  };

  const saveModal = () => {
    if (modal === "hero" || modal === "main" || modal === "bottom") {
      updateContent(draft);
      closeModal();
      return;
    }

    if (modal === "image") {
      if (!draft.title?.trim()) {
        showNotice("Image title is required.", "error");
        return;
      }

      updateContent({
        images: content.images.map((item) =>
          item.id === draft.id ? { ...item, ...draft } : item
        ),
      });

      closeModal();
      return;
    }

    if (modal === "achievement") {
      if (!draft.title?.trim()) {
        showNotice("Achievement title is required.", "error");
        return;
      }

      const exists = content.achievements.some((item) => item.id === draft.id);

      updateContent({
        achievements: exists
          ? content.achievements.map((item) =>
              item.id === draft.id ? { ...draft } : item
            )
          : [...content.achievements, { ...draft }],
      });

      closeModal();
      return;
    }

    if (modal === "category") {
      const oldName = draft.oldName;
      const newName = draft.name?.trim();

      if (!newName) {
        showNotice("Category name cannot be empty.", "error");
        return;
      }

      const duplicate = content.categories.some(
        (item) =>
          item !== oldName &&
          item.toLowerCase() === newName.toLowerCase()
      );

      if (duplicate) {
        showNotice("That category already exists.", "error");
        return;
      }

      const categories = content.categories.map((item) =>
        item === oldName ? newName : item
      );

      const categoryDescriptions = {
        ...content.categoryDescriptions,
      };

      delete categoryDescriptions[oldName];
      categoryDescriptions[newName] = draft.description || "";

      const subcategories = {
        ...content.subcategories,
      };

      delete subcategories[oldName];
      subcategories[newName] = (draft.subcategories || []).filter((item) =>
        item.name?.trim()
      );

      const images = content.images.map((item) =>
        item.category === oldName
          ? { ...item, category: newName, subcategory: "" }
          : item
      );

      updateContent({
        categories,
        categoryDescriptions,
        subcategories,
        images,
      });

      if (activeCategory === oldName) {
        setActiveCategory(newName);
      }

      closeModal();
    }
  };

  const addCategory = () => {
    let name = "New Category";
    let counter = 1;

    while (content.categories.includes(name)) {
      counter += 1;
      name = `New Category ${counter}`;
    }

    updateContent({
      categories: [...content.categories, name],
      categoryDescriptions: {
        ...content.categoryDescriptions,
        [name]: "",
      },
      subcategories: {
        ...content.subcategories,
        [name]: [],
      },
    });

    setActiveCategory(name);
    setActiveSubcategory("");
    showNotice(`${name} added. Click Save Changes to publish.`);
  };

  const deleteCategory = (category) => {
    if (content.categories.length <= 1) {
      showNotice("At least one category must remain.", "error");
      return;
    }

    const remaining = content.categories.filter((item) => item !== category);
    const replacement = remaining[0];

    const categoryDescriptions = {
      ...content.categoryDescriptions,
    };
    delete categoryDescriptions[category];

    const subcategories = {
      ...content.subcategories,
    };
    delete subcategories[category];

    updateContent({
      categories: remaining,
      categoryDescriptions,
      subcategories,
      images: content.images.map((item) =>
        item.category === category
          ? { ...item, category: replacement, subcategory: "" }
          : item
      ),
    });

    setActiveCategory(replacement);
    setActiveSubcategory("");
    showNotice("Category deleted locally. Click Save Changes to publish.");
  };

  const addSubcategory = () => {
    const name = window.prompt(`New subcategory for ${activeCategory}:`);
    if (!name?.trim()) return;

    const cleanName = name.trim();
    const list = content.subcategories?.[activeCategory] || [];

    if (
      list.some(
        (item) => item.name.toLowerCase() === cleanName.toLowerCase()
      )
    ) {
      showNotice("That subcategory already exists.", "error");
      return;
    }

    updateContent({
      subcategories: {
        ...content.subcategories,
        [activeCategory]: [
          ...list,
          {
            id: `${activeCategory}-${Date.now()}`,
            name: cleanName,
            description: "",
            visible: true,
          },
        ],
      },
    });

    setActiveSubcategory(cleanName);
    showNotice("Subcategory added. Click Save Changes to publish.");
  };

  const editSubcategory = (subcategory) => {
    const name = window.prompt("Subcategory name:", subcategory.name);
    if (!name?.trim()) return;

    const description = window.prompt(
      "Subcategory description:",
      subcategory.description || ""
    );

    const updated = (content.subcategories?.[activeCategory] || []).map(
      (item) =>
        item.id === subcategory.id
          ? {
              ...item,
              name: name.trim(),
              description: description ?? item.description,
            }
          : item
    );

    updateContent({
      subcategories: {
        ...content.subcategories,
        [activeCategory]: updated,
      },
    });

    if (activeSubcategory === subcategory.name) {
      setActiveSubcategory(name.trim());
    }

    showNotice("Subcategory updated. Click Save Changes to publish.");
  };

  const deleteSubcategory = (subcategory) => {
    const updated = (content.subcategories?.[activeCategory] || []).filter(
      (item) => item.id !== subcategory.id
    );

    updateContent({
      subcategories: {
        ...content.subcategories,
        [activeCategory]: updated,
      },
      images: content.images.map((item) =>
        item.subcategory === subcategory.name
          ? { ...item, subcategory: "" }
          : item
      ),
    });

    if (activeSubcategory === subcategory.name) {
      setActiveSubcategory("");
    }

    showNotice("Subcategory deleted locally. Click Save Changes to publish.");
  };

  const deleteAchievement = (id) => {
    updateContent({
      achievements: content.achievements.filter((item) => item.id !== id),
    });

    showNotice("Achievement deleted locally. Click Save Changes to publish.");
  };

  const toggleAchievement = (id) => {
    updateContent({
      achievements: content.achievements.map((item) =>
        item.id === id ? { ...item, visible: !item.visible } : item
      ),
    });
  };

  if (loading) {
    return (
      <>
        <style>{ADMIN_CSS}</style>
        <div className="ag-loading">
          <div className="ag-spinner" />
          <strong>Loading Gallery Manager...</strong>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{ADMIN_CSS}</style>

      {notice && (
        <div className={`ag-notice ${notice.type}`}>
          <div>{notice.type === "success" ? <Check size={17} /> : <X size={17} />}</div>
          <span>{notice.message}</span>
        </div>
      )}

      <div className="ag-page">
        <header className="ag-topbar">
          <div className="ag-topbar-inner">
            <button
              className="ag-secondary"
              onClick={() => navigate("/admin/dashboard")}
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </button>

            <div className="ag-brand">
              <div className="ag-brand-icon">
                <Camera size={19} />
              </div>
              <div>
                <strong>Gallery Manager</strong>
                <small>Red Rose Admin Panel</small>
              </div>
            </div>

            <div className="ag-top-actions">
              <a
                className="ag-secondary ag-link-button"
                href="/gallery"
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLink size={15} />
                View Gallery
              </a>

              <button
                className="ag-primary"
                onClick={saveGallery}
                disabled={saving || uploading}
              >
                <Save size={16} />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </header>

        <main className="ag-container">
          <section className="ag-hero">
            <div>
              <span className="ag-kicker">
                <Camera size={14} />
                Gallery Manager
              </span>
              <h1>Manage School Gallery</h1>
              <p>
                Edit the complete public Gallery page from one place. Add
                photos, change titles, manage categories, achievements, and
                publish everything to the user website.
              </p>
            </div>

            <div className="ag-hero-stat">
              <strong>{content.images.length}</strong>
              <span>Total Images</span>
            </div>
          </section>

          <section className="ag-grid-two">
            <div className="ag-card">
              <div className="ag-card-head">
                <div>
                  <span className="ag-section-label">Hero Section</span>
                  <h2>Gallery landing section</h2>
                </div>
                <button className="ag-edit" onClick={openHeroEditor}>
                  <Edit3 size={15} />
                  Edit
                </button>
              </div>

              <div className="ag-preview-dark">
                <small>{content.heroBadge}</small>
                <h3>
                  {content.heroTitle}{" "}
                  <em>{content.heroHighlightedText}</em>
                </h3>
                <p>{content.heroSubtitle}</p>
                <div className="ag-preview-buttons">
                  <span>{content.heroExploreText}</span>
                  <span>{content.heroAchievementText}</span>
                </div>
              </div>
            </div>

            <div className="ag-card">
              <div className="ag-card-head">
                <div>
                  <span className="ag-section-label">Main Gallery</span>
                  <h2>Heading and introduction</h2>
                </div>
                <button className="ag-edit" onClick={openMainEditor}>
                  <Edit3 size={15} />
                  Edit
                </button>
              </div>

              <div className="ag-main-preview">
                <span>{content.badge}</span>
                <h3>
                  {content.title} <em>{content.highlightedText}</em>
                </h3>
                <p>{content.description}</p>
              </div>
            </div>
          </section>

          <section className="ag-card">
            <div className="ag-card-head ag-wrap-head">
              <div>
                <span className="ag-section-label">Categories</span>
                <h2>Organize the gallery</h2>
                <p>
                  Categories and subcategories are shown on the public Gallery
                  page.
                </p>
              </div>

              <button className="ag-primary" onClick={addCategory}>
                <Plus size={16} />
                Add Category
              </button>
            </div>

            <div className="ag-category-tabs">
              {content.categories.map((category) => (
                <button
                  key={category}
                  className={
                    activeCategory === category ? "active" : ""
                  }
                  onClick={() => {
                    setActiveCategory(category);
                    setActiveSubcategory("");
                  }}
                >
                  <ImageIcon size={14} />
                  {category}
                </button>
              ))}
            </div>

            <div className="ag-category-content">
              <div className="ag-category-info">
                <div>
                  <span className="ag-section-label">Selected Category</span>
                  <h3>{activeCategory}</h3>
                  <p>
                    {content.categoryDescriptions?.[activeCategory] ||
                      "No description added yet."}
                  </p>
                </div>

                <div className="ag-category-actions">
                  <button
                    className="ag-edit"
                    onClick={() => openCategoryEditor(activeCategory)}
                  >
                    <Edit3 size={15} />
                    Edit Category
                  </button>

                  <button
                    className="ag-danger-outline"
                    onClick={() => deleteCategory(activeCategory)}
                  >
                    <Trash2 size={15} />
                    Delete
                  </button>
                </div>
              </div>

              <div className="ag-sub-head">
                <div>
                  <strong>Subcategories</strong>
                  <span>
                    {currentSubcategories.length} available
                  </span>
                </div>
                <button className="ag-small-button" onClick={addSubcategory}>
                  <Plus size={14} />
                  Add Subcategory
                </button>
              </div>

              <div className="ag-sub-list">
                <button
                  className={!activeSubcategory ? "selected" : ""}
                  onClick={() => setActiveSubcategory("")}
                >
                  <span>All {activeCategory}</span>
                  <small>All photos</small>
                </button>

                {currentSubcategories.map((subcategory) => (
                  <div className="ag-sub-row" key={subcategory.id}>
                    <button
                      className={
                        activeSubcategory === subcategory.name ? "selected" : ""
                      }
                      onClick={() =>
                        setActiveSubcategory(subcategory.name)
                      }
                    >
                      <span>{subcategory.name}</span>
                      <small>
                        {subcategory.visible ? "Visible" : "Hidden"}
                      </small>
                    </button>

                    <button
                      className="ag-row-icon"
                      title="Edit subcategory"
                      onClick={() => editSubcategory(subcategory)}
                    >
                      <Edit3 size={14} />
                    </button>

                    <button
                      className="ag-row-icon danger"
                      title="Delete subcategory"
                      onClick={() => deleteSubcategory(subcategory)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="ag-card">
            <div className="ag-card-head ag-wrap-head">
              <div>
                <span className="ag-section-label">Photo Manager</span>
                <h2>
                  {activeCategory}
                  {activeSubcategory ? ` / ${activeSubcategory}` : ""}
                </h2>
                <p>
                  Upload, edit, hide, replace, or delete individual gallery
                  images.
                </p>
              </div>

              <div className="ag-upload-actions">
                {selectedImages.length > 0 && (
                  <button className="ag-danger" onClick={deleteSelected}>
                    <Trash2 size={15} />
                    Delete Selected ({selectedImages.length})
                  </button>
                )}

                <button
                  className="ag-primary"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  <Upload size={16} />
                  {uploading ? "Uploading..." : "Upload Images"}
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  multiple
                  hidden
                  onChange={handleAddImages}
                />
              </div>
            </div>

            <div className="ag-toolbar">
              <div className="ag-toolbar-left">
                <button
                  className={!activeSubcategory ? "active" : ""}
                  onClick={() => setActiveSubcategory("")}
                >
                  All
                </button>

                {currentSubcategories.map((subcategory) => (
                  <button
                    key={subcategory.id}
                    className={
                      activeSubcategory === subcategory.name ? "active" : ""
                    }
                    onClick={() => setActiveSubcategory(subcategory.name)}
                  >
                    {subcategory.name}
                  </button>
                ))}
              </div>

              <input
                className="ag-search"
                placeholder="Search gallery images..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            {visibleImages.length === 0 ? (
              <div className="ag-empty">
                <ImageIcon size={38} />
                <h3>No images in this selection</h3>
                <p>
                  Upload images to{" "}
                  {activeSubcategory || activeCategory} to start building the
                  gallery.
                </p>
                <button
                  className="ag-primary"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload size={15} />
                  Upload Image
                </button>
              </div>
            ) : (
              <div className="ag-image-grid">
                {visibleImages.map((image) => (
                  <article
                    key={image.id}
                    className={`ag-image-card ${
                      !image.visible ? "hidden-card" : ""
                    }`}
                  >
                    <div className="ag-image-check">
                      <input
                        type="checkbox"
                        checked={selectedImages.includes(image.id)}
                        onChange={() => toggleImageSelection(image.id)}
                      />
                    </div>

                    <div className="ag-image-preview">
                      {image.image ? (
                        <img src={image.image} alt={image.title} />
                      ) : (
                        <div className="ag-no-image">
                          <ImageIcon size={32} />
                        </div>
                      )}

                      {!image.visible && (
                        <div className="ag-hidden-label">
                          <EyeOff size={13} />
                          Hidden
                        </div>
                      )}

                      <div className="ag-image-overlay">
                        <button
                          className="ag-overlay-button"
                          onClick={() => openImageEditor(image)}
                        >
                          <Edit3 size={14} />
                          Edit
                        </button>

                        <button
                          className="ag-overlay-button"
                          onClick={() =>
                            replaceInputRefs.current[image.id]?.click()
                          }
                        >
                          <Upload size={14} />
                          Replace
                        </button>

                        <input
                          ref={(element) => {
                            replaceInputRefs.current[image.id] = element;
                          }}
                          type="file"
                          accept="image/*"
                          hidden
                          onChange={(event) => {
                            const file = event.target.files?.[0];
                            event.target.value = "";
                            handleReplaceImage(image.id, file);
                          }}
                        />
                      </div>
                    </div>

                    <div className="ag-image-body">
                      <div className="ag-image-tags">
                        <span>{image.category}</span>
                        {image.subcategory && (
                          <span>{image.subcategory}</span>
                        )}
                      </div>

                      <h3>{image.title}</h3>
                      <p>{image.description || "No description added."}</p>

                      <div className="ag-image-meta">
                        <small>{image.date}</small>

                        <div>
                          <button
                            title={image.visible ? "Hide image" : "Show image"}
                            onClick={() => toggleImageVisibility(image.id)}
                          >
                            {image.visible ? (
                              <Eye size={15} />
                            ) : (
                              <EyeOff size={15} />
                            )}
                          </button>

                          <button
                            title="Edit image"
                            onClick={() => openImageEditor(image)}
                          >
                            <Edit3 size={15} />
                          </button>

                          <button
                            className="danger"
                            title="Delete image"
                            onClick={() => deleteImage(image.id)}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="ag-card">
            <div className="ag-card-head ag-wrap-head">
              <div>
                <span className="ag-section-label">Achievements</span>
                <h2>Manage achievement cards</h2>
                <p>
                  These cards are displayed on the public Gallery page.
                </p>
              </div>

              <button
                className="ag-primary"
                onClick={() => openAchievementEditor()}
              >
                <Plus size={16} />
                Add Achievement
              </button>
            </div>

            <div className="ag-achievement-grid">
              {content.achievements.map((achievement) => (
                <article
                  className={`ag-achievement-card ${
                    !achievement.visible ? "hidden-card" : ""
                  }`}
                  key={achievement.id}
                >
                  <div className="ag-achievement-icon">
                    <AchievementIcon type={achievement.icon} size={22} />
                  </div>

                  <div className="ag-achievement-copy">
                    <span>{achievement.year}</span>
                    <h3>{achievement.title}</h3>
                  </div>

                  <div className="ag-achievement-actions">
                    <button onClick={() => toggleAchievement(achievement.id)}>
                      {achievement.visible ? (
                        <Eye size={15} />
                      ) : (
                        <EyeOff size={15} />
                      )}
                    </button>

                    <button onClick={() => openAchievementEditor(achievement)}>
                      <Edit3 size={15} />
                    </button>

                    <button
                      className="danger"
                      onClick={() => deleteAchievement(achievement.id)}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="ag-card">
            <div className="ag-card-head">
              <div>
                <span className="ag-section-label">Bottom Section</span>
                <h2>Closing Gallery message</h2>
              </div>
              <button className="ag-edit" onClick={openBottomEditor}>
                <Edit3 size={15} />
                Edit
              </button>
            </div>

            <div className="ag-bottom-preview">
              <strong>{content.bottomTitle}</strong>
              <p>{content.bottomDescription}</p>
              <small>{content.bottomNote}</small>
            </div>
          </section>

          <div className="ag-save-bar">
            <div>
              <strong>Ready to publish your Gallery?</strong>
              <span>
                Changes are local until you click Save Changes.
              </span>
            </div>

            <button
              className="ag-primary"
              onClick={saveGallery}
              disabled={saving || uploading}
            >
              <Save size={16} />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </main>
      </div>

      {modal === "hero" && (
        <Modal
          title="Edit Hero Section"
          subtitle="These values control the top section of the public Gallery page."
          onClose={closeModal}
          onSave={saveModal}
        >
          <Field
            label="Hero Badge"
            value={draft.heroBadge}
            onChange={(value) => setDraft({ ...draft, heroBadge: value })}
          />
          <Field
            label="Hero Title"
            value={draft.heroTitle}
            onChange={(value) => setDraft({ ...draft, heroTitle: value })}
          />
          <Field
            label="Highlighted Text"
            value={draft.heroHighlightedText}
            onChange={(value) =>
              setDraft({ ...draft, heroHighlightedText: value })
            }
          />
          <Field
            label="Hero Description"
            value={draft.heroSubtitle}
            textarea
            onChange={(value) => setDraft({ ...draft, heroSubtitle: value })}
          />
          <Field
            label="Explore Button Text"
            value={draft.heroExploreText}
            onChange={(value) =>
              setDraft({ ...draft, heroExploreText: value })
            }
          />
          <Field
            label="Achievement Button Text"
            value={draft.heroAchievementText}
            onChange={(value) =>
              setDraft({ ...draft, heroAchievementText: value })
            }
          />
        </Modal>
      )}

      {modal === "main" && (
        <Modal
          title="Edit Main Gallery Section"
          subtitle="Change the badge, title, highlighted word, and description."
          onClose={closeModal}
          onSave={saveModal}
        >
          <Field
            label="Badge"
            value={draft.badge}
            onChange={(value) => setDraft({ ...draft, badge: value })}
          />
          <Field
            label="Title"
            value={draft.title}
            onChange={(value) => setDraft({ ...draft, title: value })}
          />
          <Field
            label="Highlighted Text"
            value={draft.highlightedText}
            onChange={(value) =>
              setDraft({ ...draft, highlightedText: value })
            }
          />
          <Field
            label="Description"
            value={draft.description}
            textarea
            onChange={(value) =>
              setDraft({ ...draft, description: value })
            }
          />
        </Modal>
      )}

      {modal === "bottom" && (
        <Modal
          title="Edit Bottom Section"
          subtitle="Control the final message shown below the Gallery."
          onClose={closeModal}
          onSave={saveModal}
        >
          <Field
            label="Bottom Title"
            value={draft.bottomTitle}
            onChange={(value) =>
              setDraft({ ...draft, bottomTitle: value })
            }
          />
          <Field
            label="Bottom Description"
            value={draft.bottomDescription}
            textarea
            onChange={(value) =>
              setDraft({ ...draft, bottomDescription: value })
            }
          />
          <Field
            label="Bottom Note"
            value={draft.bottomNote}
            onChange={(value) =>
              setDraft({ ...draft, bottomNote: value })
            }
          />
        </Modal>
      )}

      {modal === "category" && (
        <Modal
          title="Edit Category"
          subtitle="Rename the category and manage its description."
          onClose={closeModal}
          onSave={saveModal}
        >
          <Field
            label="Category Name"
            value={draft.name}
            onChange={(value) => setDraft({ ...draft, name: value })}
          />

          <Field
            label="Category Description"
            value={draft.description}
            textarea
            onChange={(value) =>
              setDraft({ ...draft, description: value })
            }
          />

          <div className="ag-modal-subtitle-row">
            <strong>Subcategories</strong>
            <span>{draft.subcategories?.length || 0}</span>
          </div>

          <div className="ag-modal-subcategories">
            {(draft.subcategories || []).map((item) => (
              <div className="ag-modal-subcategory" key={item.id}>
                <div>
                  <strong>{item.name}</strong>
                  <small>{item.description || "No description"}</small>
                </div>
                <button
                  className="ag-row-icon danger"
                  onClick={() =>
                    setDraft({
                      ...draft,
                      subcategories: draft.subcategories.filter(
                        (subItem) => subItem.id !== item.id
                      ),
                    })
                  }
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}

            {!draft.subcategories?.length && (
              <div className="ag-modal-empty">No subcategories.</div>
            )}
          </div>
        </Modal>
      )}

      {modal === "achievement" && (
        <Modal
          title="Edit Achievement"
          subtitle="This card will appear in the public Gallery achievement section."
          onClose={closeModal}
          onSave={saveModal}
        >
          <Field
            label="Achievement Title"
            value={draft.title}
            onChange={(value) => setDraft({ ...draft, title: value })}
          />

          <Field
            label="Year"
            value={draft.year}
            onChange={(value) => setDraft({ ...draft, year: value })}
          />

          <label className="ag-field">
            <span>Icon</span>
            <div className="ag-select-wrap">
              <select
                value={draft.icon || "Trophy"}
                onChange={(event) =>
                  setDraft({ ...draft, icon: event.target.value })
                }
              >
                <option value="Trophy">Trophy</option>
                <option value="Award">Award</option>
                <option value="Star">Star</option>
              </select>
              <ChevronDown size={15} />
            </div>
          </label>

          <label className="ag-check-field">
            <input
              type="checkbox"
              checked={draft.visible !== false}
              onChange={(event) =>
                setDraft({ ...draft, visible: event.target.checked })
              }
            />
            <span>Show this achievement on the public Gallery</span>
          </label>
        </Modal>
      )}

      {modal === "image" && (
        <Modal
          title="Edit Gallery Image"
          subtitle="All of these fields are shown/used by the public Gallery."
          onClose={closeModal}
          onSave={saveModal}
        >
          <div className="ag-edit-image">
            <div className="ag-edit-image-preview">
              {draft.image ? (
                <img src={draft.image} alt={draft.title || "Gallery"} />
              ) : (
                <ImageIcon size={34} />
              )}
            </div>

            <div>
              <strong>{draft.title || "Gallery Image"}</strong>
              <small>{draft.category}</small>
            </div>
          </div>

          <Field
            label="Image Title"
            value={draft.title}
            onChange={(value) => setDraft({ ...draft, title: value })}
          />

          <Field
            label="Description"
            value={draft.description}
            textarea
            onChange={(value) =>
              setDraft({ ...draft, description: value })
            }
          />

          <Field
            label="Date / Label"
            value={draft.date}
            onChange={(value) => setDraft({ ...draft, date: value })}
          />

          <label className="ag-field">
            <span>Category</span>
            <div className="ag-select-wrap">
              <select
                value={draft.category || activeCategory}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    category: event.target.value,
                    subcategory: "",
                  })
                }
              >
                {content.categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <ChevronDown size={15} />
            </div>
          </label>

          <label className="ag-field">
            <span>Subcategory</span>
            <div className="ag-select-wrap">
              <select
                value={draft.subcategory || ""}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    subcategory: event.target.value,
                  })
                }
              >
                <option value="">No subcategory</option>
                {(content.subcategories?.[draft.category] || []).map(
                  (subcategory) => (
                    <option key={subcategory.id} value={subcategory.name}>
                      {subcategory.name}
                    </option>
                  )
                )}
              </select>
              <ChevronDown size={15} />
            </div>
          </label>

          <label className="ag-check-field">
            <input
              type="checkbox"
              checked={draft.visible !== false}
              onChange={(event) =>
                setDraft({ ...draft, visible: event.target.checked })
              }
            />
            <span>Show this image on the public Gallery</span>
          </label>
        </Modal>
      )}
    </>
  );
}

const ADMIN_CSS = `
:root{
  --ag-bg:#f2eee9;
  --ag-card:#ffffff;
  --ag-dark:#1c121c;
  --ag-maroon:#531d35;
  --ag-maroon-2:#6d2845;
  --ag-gold:#e5c36e;
  --ag-cyan:#49bddd;
  --ag-text:#171525;
  --ag-muted:#6c6876;
  --ag-border:#e5ddd7;
  --ag-soft:#faf7f3;
  --ag-danger:#d94d58;
  --ag-shadow:0 18px 50px rgba(40,25,30,.08);
}

*{box-sizing:border-box}

.ag-page{
  min-height:100vh;
  background:
    radial-gradient(circle at 12% 0%,rgba(229,195,110,.13),transparent 28%),
    radial-gradient(circle at 90% 15%,rgba(73,189,221,.10),transparent 25%),
    var(--ag-bg);
  color:var(--ag-text);
  font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
  padding-bottom:70px;
}

.ag-topbar{
  position:sticky;
  top:0;
  z-index:50;
  background:rgba(28,18,28,.96);
  border-bottom:1px solid rgba(255,255,255,.08);
  backdrop-filter:blur(16px);
}

.ag-topbar-inner{
  width:min(1440px,calc(100% - 36px));
  min-height:76px;
  margin:auto;
  display:flex;
  align-items:center;
  gap:18px;
}

.ag-brand{
  flex:1;
  display:flex;
  align-items:center;
  gap:11px;
  color:white;
}

.ag-brand-icon{
  width:39px;
  height:39px;
  border-radius:12px;
  display:grid;
  place-items:center;
  background:linear-gradient(135deg,var(--ag-gold),#f5e0a2);
  color:#34231d;
}

.ag-brand strong{display:block;font-size:14px}
.ag-brand small{display:block;color:#c9b8c3;font-size:10px;margin-top:2px}

.ag-top-actions{display:flex;align-items:center;gap:9px}

.ag-secondary,
.ag-primary,
.ag-edit,
.ag-danger,
.ag-danger-outline,
.ag-small-button,
.ag-icon-button,
.ag-row-icon{
  border:0;
  font:inherit;
  cursor:pointer;
  transition:.2s ease;
}

.ag-secondary{
  min-height:40px;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:7px;
  padding:0 13px;
  border:1px solid var(--ag-border);
  border-radius:11px;
  background:white;
  color:#4e4a56;
  text-decoration:none;
}

.ag-secondary:hover{transform:translateY(-1px);border-color:#cdbfb7}

.ag-primary{
  min-height:40px;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:7px;
  padding:0 15px;
  border-radius:11px;
  background:linear-gradient(100deg,#e9c718,#58c4dc);
  color:#17151b;
  font-weight:800;
  box-shadow:0 8px 18px rgba(70,60,30,.12);
}

.ag-primary:hover{transform:translateY(-1px)}
.ag-primary:disabled{opacity:.55;cursor:not-allowed;transform:none}

.ag-topbar .ag-secondary{
  background:transparent;
  border-color:rgba(255,255,255,.15);
  color:#eee8ef;
}

.ag-container{
  width:min(1440px,calc(100% - 36px));
  margin:28px auto 0;
}

.ag-hero{
  min-height:210px;
  padding:34px 38px;
  border:1px solid rgba(255,255,255,.7);
  border-radius:27px;
  background:linear-gradient(120deg,#fffdf8,#eef8f7);
  box-shadow:var(--ag-shadow);
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:30px;
}

.ag-kicker,
.ag-section-label{
  color:var(--ag-maroon);
  font-size:10px;
  font-weight:900;
  letter-spacing:.13em;
  text-transform:uppercase;
}

.ag-kicker{
  display:inline-flex;
  align-items:center;
  gap:6px;
  padding:8px 12px;
  border-radius:999px;
  background:#f5e8ef;
}

.ag-hero h1{
  margin:13px 0 7px;
  font-family:Georgia,serif;
  font-size:clamp(36px,4vw,58px);
  line-height:.98;
}

.ag-hero p{
  max-width:780px;
  margin:0;
  color:#5e5b69;
  font-size:13px;
  line-height:1.75;
}

.ag-hero-stat{
  min-width:145px;
  padding:22px;
  border-radius:19px;
  background:var(--ag-dark);
  color:white;
  text-align:center;
}

.ag-hero-stat strong{
  display:block;
  color:var(--ag-gold);
  font-size:38px;
  line-height:1;
}

.ag-hero-stat span{
  display:block;
  margin-top:8px;
  color:#d8cbd5;
  font-size:10px;
  font-weight:800;
  text-transform:uppercase;
  letter-spacing:.08em;
}

.ag-grid-two{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:20px;
  margin-top:20px;
}

.ag-card{
  margin-top:20px;
  padding:25px;
  border:1px solid var(--ag-border);
  border-radius:22px;
  background:var(--ag-card);
  box-shadow:var(--ag-shadow);
}

.ag-grid-two .ag-card{margin-top:0}

.ag-card-head{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:20px;
  margin-bottom:19px;
}

.ag-wrap-head{align-items:flex-start}

.ag-card-head h2{
  margin:6px 0 0;
  font-family:Georgia,serif;
  font-size:25px;
}

.ag-card-head p{
  margin:7px 0 0;
  color:var(--ag-muted);
  font-size:11px;
}

.ag-edit,
.ag-small-button{
  min-height:36px;
  display:inline-flex;
  align-items:center;
  gap:6px;
  padding:0 11px;
  border:1px solid var(--ag-border);
  border-radius:10px;
  background:white;
  color:#4d4855;
  font-size:11px;
  font-weight:800;
}

.ag-edit:hover,.ag-small-button:hover{border-color:#c8b9b1;transform:translateY(-1px)}

.ag-preview-dark{
  min-height:235px;
  padding:30px;
  border-radius:18px;
  overflow:hidden;
  background:
    radial-gradient(circle at 80% 20%,rgba(229,195,110,.2),transparent 24%),
    linear-gradient(135deg,#21131f,#541d35);
  color:white;
}

.ag-preview-dark small{
  color:var(--ag-gold);
  font-size:9px;
  font-weight:900;
  letter-spacing:.16em;
}

.ag-preview-dark h3{
  max-width:570px;
  margin:13px 0;
  font-family:Georgia,serif;
  font-size:32px;
  line-height:1.04;
}

.ag-preview-dark h3 em{
  color:#e8c96f;
  font-style:normal;
}

.ag-preview-dark p{
  max-width:600px;
  margin:0;
  color:#eee0e6;
  font-size:11px;
  line-height:1.7;
}

.ag-preview-buttons{
  display:flex;
  flex-wrap:wrap;
  gap:8px;
  margin-top:20px;
}

.ag-preview-buttons span{
  padding:8px 11px;
  border:1px solid rgba(255,255,255,.18);
  border-radius:999px;
  color:white;
  font-size:9px;
  font-weight:800;
}

.ag-main-preview{
  min-height:235px;
  padding:30px;
  border-radius:18px;
  background:linear-gradient(145deg,#faf7f2,#f4edf0);
  border:1px solid #eee5de;
}

.ag-main-preview span{
  color:#8b6c2c;
  font-size:9px;
  font-weight:900;
  letter-spacing:.14em;
}

.ag-main-preview h3{
  margin:13px 0 10px;
  font-family:Georgia,serif;
  font-size:32px;
  line-height:1.05;
}

.ag-main-preview h3 em{
  color:var(--ag-maroon-2);
  font-style:normal;
}

.ag-main-preview p{
  max-width:650px;
  color:var(--ag-muted);
  font-size:11px;
  line-height:1.8;
}

.ag-category-tabs{
  display:flex;
  flex-wrap:wrap;
  gap:8px;
  margin-bottom:19px;
}

.ag-category-tabs button,
.ag-toolbar-left button{
  min-height:38px;
  padding:0 13px;
  display:inline-flex;
  align-items:center;
  gap:6px;
  border:1px solid var(--ag-border);
  border-radius:10px;
  background:#fff;
  color:#625c67;
  font-size:10px;
  font-weight:900;
  cursor:pointer;
}

.ag-category-tabs button.active,
.ag-toolbar-left button.active{
  background:var(--ag-dark);
  border-color:var(--ag-dark);
  color:white;
}

.ag-category-content{
  padding:20px;
  border-radius:17px;
  background:#faf8f5;
  border:1px solid #ece4dd;
}

.ag-category-info{
  display:flex;
  justify-content:space-between;
  gap:20px;
  padding-bottom:20px;
  border-bottom:1px solid #e7ded6;
}

.ag-category-info h3{
  margin:5px 0 6px;
  font-family:Georgia,serif;
  font-size:25px;
}

.ag-category-info p{
  max-width:800px;
  margin:0;
  color:var(--ag-muted);
  font-size:11px;
  line-height:1.7;
}

.ag-category-actions{
  display:flex;
  align-items:flex-start;
  gap:7px;
}

.ag-danger,
.ag-danger-outline{
  min-height:36px;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:6px;
  padding:0 11px;
  border-radius:10px;
  background:#fff1f1;
  color:var(--ag-danger);
  border:1px solid #f5d3d5;
  font-size:10px;
  font-weight:900;
}

.ag-danger:hover,.ag-danger-outline:hover{background:#ffe7e8}

.ag-sub-head{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:15px;
  margin:18px 0 10px;
}

.ag-sub-head div{
  display:flex;
  align-items:center;
  gap:8px;
}

.ag-sub-head strong{font-size:12px}
.ag-sub-head span{color:#948b93;font-size:10px}

.ag-sub-list{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:8px;
}

.ag-sub-list>button,
.ag-sub-row>button{
  min-height:57px;
  padding:10px 12px;
  text-align:left;
  border:1px solid var(--ag-border);
  border-radius:12px;
  background:white;
  cursor:pointer;
}

.ag-sub-list>button.selected,
.ag-sub-row>button.selected{
  border-color:#6e3150;
  background:#f6edf2;
}

.ag-sub-list button span,
.ag-sub-row button span{
  display:block;
  font-size:10px;
  font-weight:900;
  color:#37323b;
}

.ag-sub-list button small,
.ag-sub-row button small{
  display:block;
  margin-top:4px;
  color:#918891;
  font-size:8px;
}

.ag-sub-row{
  display:grid;
  grid-template-columns:1fr 35px 35px;
  gap:5px;
}

.ag-row-icon{
  width:35px;
  height:35px;
  align-self:center;
  display:grid;
  place-items:center;
  border:1px solid var(--ag-border);
  border-radius:9px;
  background:white;
  color:#645c66;
}

.ag-row-icon:hover{background:#f6f2ee}
.ag-row-icon.danger{color:var(--ag-danger)}

.ag-upload-actions{
  display:flex;
  flex-wrap:wrap;
  gap:7px;
}

.ag-toolbar{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:14px;
  padding:13px;
  margin-bottom:18px;
  border:1px solid var(--ag-border);
  border-radius:13px;
  background:#faf8f5;
}

.ag-toolbar-left{
  display:flex;
  flex-wrap:wrap;
  gap:6px;
}

.ag-toolbar-left button{
  min-height:32px;
  padding:0 10px;
  font-size:9px;
}

.ag-search{
  width:min(300px,100%);
  min-height:38px;
  padding:0 12px;
  border:1px solid var(--ag-border);
  border-radius:10px;
  background:white;
  outline:none;
  font:inherit;
  font-size:11px;
}

.ag-search:focus{border-color:#9c6a7f}

.ag-image-grid{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:14px;
}

.ag-image-card{
  position:relative;
  overflow:hidden;
  border:1px solid var(--ag-border);
  border-radius:17px;
  background:white;
  transition:.2s ease;
}

.ag-image-card:hover{
  transform:translateY(-2px);
  box-shadow:0 14px 35px rgba(40,25,30,.09);
}

.ag-image-card.hidden-card{opacity:.62}

.ag-image-check{
  position:absolute;
  z-index:3;
  left:11px;
  top:11px;
}

.ag-image-check input{
  width:17px;
  height:17px;
  accent-color:#63213e;
}

.ag-image-preview{
  height:225px;
  position:relative;
  overflow:hidden;
  background:#eae2da;
}

.ag-image-preview img{
  width:100%;
  height:100%;
  display:block;
  object-fit:cover;
}

.ag-no-image{
  width:100%;
  height:100%;
  display:grid;
  place-items:center;
  color:#9e9289;
}

.ag-hidden-label{
  position:absolute;
  right:10px;
  top:10px;
  display:flex;
  align-items:center;
  gap:5px;
  padding:6px 8px;
  border-radius:999px;
  background:#24131dcc;
  color:white;
  font-size:8px;
  font-weight:900;
}

.ag-image-overlay{
  position:absolute;
  inset:0;
  display:flex;
  align-items:flex-end;
  justify-content:center;
  gap:7px;
  padding:13px;
  opacity:0;
  background:linear-gradient(transparent,rgba(20,10,18,.78));
  transition:.2s ease;
}

.ag-image-card:hover .ag-image-overlay{opacity:1}

.ag-overlay-button{
  min-height:32px;
  padding:0 10px;
  display:inline-flex;
  align-items:center;
  gap:5px;
  border:1px solid rgba(255,255,255,.3);
  border-radius:9px;
  background:rgba(255,255,255,.94);
  color:#291c24;
  font-size:9px;
  font-weight:900;
  cursor:pointer;
}

.ag-image-body{padding:15px}

.ag-image-tags{
  display:flex;
  flex-wrap:wrap;
  gap:5px;
}

.ag-image-tags span{
  padding:5px 7px;
  border-radius:999px;
  background:#f2e8ee;
  color:#6e3450;
  font-size:8px;
  font-weight:900;
}

.ag-image-body h3{
  margin:9px 0 5px;
  font-family:Georgia,serif;
  font-size:18px;
  line-height:1.12;
}

.ag-image-body p{
  min-height:34px;
  margin:0;
  color:var(--ag-muted);
  font-size:10px;
  line-height:1.6;
}

.ag-image-meta{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:8px;
  margin-top:13px;
  padding-top:10px;
  border-top:1px solid #eee6df;
}

.ag-image-meta small{
  color:#958b91;
  font-size:8px;
  font-weight:800;
}

.ag-image-meta div{
  display:flex;
  gap:4px;
}

.ag-image-meta button,
.ag-achievement-actions button{
  width:30px;
  height:30px;
  display:grid;
  place-items:center;
  border:1px solid var(--ag-border);
  border-radius:8px;
  background:white;
  color:#5d5660;
  cursor:pointer;
}

.ag-image-meta button:hover,
.ag-achievement-actions button:hover{background:#f5f1ed}

.ag-image-meta button.danger,
.ag-achievement-actions button.danger{color:var(--ag-danger)}

.ag-empty{
  padding:65px 20px;
  text-align:center;
  border:1px dashed #d7ccc4;
  border-radius:17px;
  color:#988e95;
}

.ag-empty h3{
  margin:10px 0 5px;
  color:#3c3540;
  font-family:Georgia,serif;
}

.ag-empty p{
  max-width:520px;
  margin:0 auto 16px;
  font-size:10px;
  line-height:1.6;
}

.ag-achievement-grid{
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:12px;
}

.ag-achievement-card{
  display:flex;
  align-items:center;
  gap:10px;
  padding:14px;
  border:1px solid var(--ag-border);
  border-radius:14px;
  background:#faf8f5;
}

.ag-achievement-card.hidden-card{opacity:.55}

.ag-achievement-icon{
  width:43px;
  height:43px;
  flex:0 0 43px;
  display:grid;
  place-items:center;
  border-radius:12px;
  background:#f1e2e8;
  color:#712947;
}

.ag-achievement-copy{
  flex:1;
  min-width:0;
}

.ag-achievement-copy span{
  color:#9a762d;
  font-size:8px;
  font-weight:900;
}

.ag-achievement-copy h3{
  margin:3px 0 0;
  font-size:11px;
  line-height:1.3;
}

.ag-achievement-actions{
  display:flex;
  gap:3px;
}

.ag-bottom-preview{
  padding:28px;
  text-align:center;
  border-radius:18px;
  color:white;
  background:linear-gradient(135deg,#291321,#682641);
}

.ag-bottom-preview strong{
  display:block;
  font-family:Georgia,serif;
  font-size:30px;
}

.ag-bottom-preview p{
  margin:8px auto;
  color:#f4e8ed;
  font-size:11px;
}

.ag-bottom-preview small{
  color:#e6c875;
  font-size:9px;
  font-weight:800;
}

.ag-save-bar{
  position:sticky;
  bottom:16px;
  z-index:20;
  margin-top:22px;
  padding:15px 18px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:18px;
  border:1px solid rgba(255,255,255,.7);
  border-radius:17px;
  background:rgba(255,255,255,.94);
  box-shadow:0 18px 50px rgba(30,20,25,.14);
  backdrop-filter:blur(14px);
}

.ag-save-bar strong{display:block;font-size:12px}
.ag-save-bar span{display:block;margin-top:3px;color:#8a8188;font-size:9px}

.ag-notice{
  position:fixed;
  z-index:100;
  right:20px;
  top:90px;
  max-width:420px;
  padding:12px 14px;
  display:flex;
  align-items:center;
  gap:9px;
  border-radius:12px;
  color:white;
  background:#24131f;
  box-shadow:0 15px 40px rgba(0,0,0,.18);
  font-size:11px;
  font-weight:700;
}

.ag-notice>div{
  width:28px;
  height:28px;
  flex:0 0 28px;
  display:grid;
  place-items:center;
  border-radius:8px;
  background:rgba(255,255,255,.12);
}

.ag-notice.error{background:#8d2734}

.ag-modal-backdrop{
  position:fixed;
  inset:0;
  z-index:200;
  padding:20px;
  display:flex;
  align-items:center;
  justify-content:center;
  overflow:auto;
  background:rgba(20,10,18,.72);
  backdrop-filter:blur(9px);
}

.ag-modal{
  width:min(720px,100%);
  max-height:min(88vh,850px);
  display:flex;
  flex-direction:column;
  overflow:hidden;
  border-radius:20px;
  background:white;
  box-shadow:0 35px 100px rgba(0,0,0,.3);
}

.ag-modal-head{
  padding:20px 22px;
  display:flex;
  align-items:flex-start;
  justify-content:space-between;
  gap:15px;
  border-bottom:1px solid #eee6df;
}

.ag-modal-kicker{
  color:#8d6b2b;
  font-size:8px;
  font-weight:900;
  letter-spacing:.14em;
  text-transform:uppercase;
}

.ag-modal-head h2{
  margin:5px 0 0;
  font-family:Georgia,serif;
  font-size:25px;
}

.ag-modal-head p{
  margin:5px 0 0;
  color:#88808a;
  font-size:10px;
}

.ag-icon-button{
  width:35px;
  height:35px;
  display:grid;
  place-items:center;
  border-radius:9px;
  background:#f5f1ed;
  color:#5b535c;
}

.ag-modal-body{
  padding:22px;
  overflow:auto;
}

.ag-modal-foot{
  padding:14px 22px;
  display:flex;
  justify-content:flex-end;
  gap:8px;
  border-top:1px solid #eee6df;
  background:#faf8f5;
}

.ag-field{
  display:block;
  margin-bottom:16px;
}

.ag-field>span{
  display:block;
  margin-bottom:6px;
  color:#4a4450;
  font-size:10px;
  font-weight:900;
}

.ag-field input,
.ag-field textarea,
.ag-field select{
  width:100%;
  border:1px solid #ddd4cd;
  border-radius:10px;
  outline:none;
  background:white;
  color:#27222b;
  font:inherit;
  font-size:11px;
}

.ag-field input,
.ag-field select{
  min-height:42px;
  padding:0 11px;
}

.ag-field textarea{
  min-height:100px;
  padding:11px;
  resize:vertical;
  line-height:1.6;
}

.ag-field input:focus,
.ag-field textarea:focus,
.ag-field select:focus{border-color:#8b5169;box-shadow:0 0 0 3px #8b516915}

.ag-select-wrap{position:relative}
.ag-select-wrap select{appearance:none;padding-right:34px}
.ag-select-wrap svg{position:absolute;right:11px;top:50%;transform:translateY(-50%);pointer-events:none;color:#847b83}

.ag-check-field{
  display:flex;
  align-items:center;
  gap:8px;
  padding:11px;
  border:1px solid #e8dfd8;
  border-radius:10px;
  background:#faf8f5;
  font-size:10px;
  font-weight:700;
}

.ag-check-field input{
  width:16px;
  height:16px;
  accent-color:#672441;
}

.ag-modal-subtitle-row{
  display:flex;
  justify-content:space-between;
  margin:18px 0 8px;
  color:#4a4450;
  font-size:10px;
}

.ag-modal-subtitle-row span{
  width:23px;
  height:23px;
  display:grid;
  place-items:center;
  border-radius:50%;
  background:#f2e8ed;
  color:#6d2846;
  font-size:9px;
  font-weight:900;
}

.ag-modal-subcategories{
  display:grid;
  gap:7px;
}

.ag-modal-subcategory{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:10px;
  padding:10px;
  border:1px solid #e6ddd6;
  border-radius:10px;
}

.ag-modal-subcategory strong{
  display:block;
  font-size:10px;
}

.ag-modal-subcategory small{
  display:block;
  margin-top:3px;
  color:#938a91;
  font-size:8px;
}

.ag-modal-empty{
  padding:20px;
  text-align:center;
  color:#958b92;
  border:1px dashed #ddd2ca;
  border-radius:10px;
  font-size:9px;
}

.ag-edit-image{
  display:flex;
  align-items:center;
  gap:12px;
  padding:10px;
  margin-bottom:17px;
  border:1px solid #e8dfd8;
  border-radius:12px;
  background:#faf8f5;
}

.ag-edit-image-preview{
  width:80px;
  height:58px;
  display:grid;
  place-items:center;
  overflow:hidden;
  border-radius:8px;
  background:#e8dfd8;
  color:#988d93;
}

.ag-edit-image-preview img{
  width:100%;
  height:100%;
  object-fit:cover;
}

.ag-edit-image strong{
  display:block;
  font-size:11px;
}

.ag-edit-image small{
  display:block;
  margin-top:3px;
  color:#91878e;
  font-size:8px;
}

.ag-loading{
  min-height:100vh;
  display:grid;
  place-items:center;
  align-content:center;
  gap:12px;
  background:var(--ag-bg);
  color:#4f4851;
}

.ag-spinner{
  width:38px;
  height:38px;
  border:4px solid #ddd2ca;
  border-top-color:#6a2847;
  border-radius:50%;
  animation:ag-spin .8s linear infinite;
}

@keyframes ag-spin{to{transform:rotate(360deg)}}

@media(max-width:1100px){
  .ag-image-grid{grid-template-columns:repeat(2,1fr)}
  .ag-achievement-grid{grid-template-columns:repeat(2,1fr)}
  .ag-sub-list{grid-template-columns:1fr 1fr}
}

@media(max-width:850px){
  .ag-grid-two{grid-template-columns:1fr}
  .ag-topbar-inner{flex-wrap:wrap;padding:10px 0}
  .ag-brand{order:-1;flex-basis:100%}
  .ag-top-actions{margin-left:auto}
  .ag-hero{align-items:flex-start;flex-direction:column}
  .ag-category-info{flex-direction:column}
}

/* ============================================================
   MOBILE ADMIN GALLERY
   Keep the existing AdminDashboard mobile sidebar/header visible.
   Only the Gallery action buttons are adjusted below for small screens.
   ============================================================ */
@media(max-width:650px){
  /* Keep the AdminDashboard mobile sidebar above Gallery content when it is open. */
  .ag-topbar{
    z-index:20;
  }

  .ag-container,.ag-topbar-inner{width:min(100% - 20px,1440px)}
  .ag-card{padding:17px}
  .ag-hero{padding:25px 20px}
  .ag-image-grid{grid-template-columns:1fr}
  .ag-achievement-grid{grid-template-columns:1fr}
  .ag-sub-list{grid-template-columns:1fr}
  .ag-toolbar{align-items:stretch;flex-direction:column}
  .ag-search{width:100%}

  /* Mobile-only: keep View Gallery and Save Changes stacked and tappable. */
  .ag-top-actions{
    width:100%;
    display:grid;
    grid-template-columns:1fr;
    gap:8px;
  }

  .ag-top-actions > *{
    width:100%;
    min-width:0;
    flex:none;
  }

  .ag-category-actions{width:100%}
  .ag-category-actions>*{flex:1}
  .ag-save-bar{align-items:stretch;flex-direction:column}
  .ag-save-bar .ag-primary{width:100%}
}
`;
