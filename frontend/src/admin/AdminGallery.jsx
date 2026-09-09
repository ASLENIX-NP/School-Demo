import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import {
  ArrowLeft,
  Camera,
  Check,
  ChevronDown,
  Edit3,
  Eye,
  EyeOff,
  ExternalLink,
  Image as ImageIcon,
  LayoutGrid,
  Plus,
  Save,
  Search,
  Settings2,
  Trash2,
  Upload,
  X,
} from "lucide-react";

/*
  ADMIN GALLERY - FULL REPLACEMENT
  File: src/admin/AdminGallery.jsx

  Updated:
  - Removed the entire Achievements manager.
  - Removed achievement data and achievement actions.
  - Made the page easier to manage by putting the most-used controls first.
  - Added clear dashboard-style stats.
  - Added category/subcategory management.
  - Added image search, bulk selection, visibility, edit, replace and delete.
  - Kept the same /api/site-content/gallery endpoint.
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

function Field({
  label,
  value,
  onChange,
  textarea = false,
  placeholder = "",
}) {
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
      <div
        className="ag-modal"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="ag-modal-head">
          <div>
            <div className="ag-modal-kicker">Gallery Editor</div>
            <h2>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>

          <button
            className="ag-icon-button"
            onClick={onClose}
            aria-label="Close"
          >
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
  const [showSettings, setShowSettings] = useState(false);

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

  const categoryImages = useMemo(
    () => content.images.filter((item) => item.category === activeCategory),
    [content.images, activeCategory]
  );

  const visibleImages = useMemo(() => {
    const query = search.trim().toLowerCase();

    return categoryImages.filter((item) => {
      const subcategoryMatch =
        !activeSubcategory || item.subcategory === activeSubcategory;

      const searchMatch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.subcategory.toLowerCase().includes(query);

      return subcategoryMatch && searchMatch;
    });
  }, [categoryImages, activeSubcategory, search]);

  const stats = useMemo(() => {
    const categoryCount = categoryImages.length;
    const visibleCount = categoryImages.filter((item) => item.visible).length;
    const hiddenCount = categoryCount - visibleCount;

    return {
      total: content.images.length,
      categoryCount,
      visibleCount,
      hiddenCount,
      categories: content.categories.length,
    };
  }, [content.images, content.categories, categoryImages]);

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
        `${uploaded.length} image${
          uploaded.length > 1 ? "s" : ""
        } uploaded. Click Save Changes to publish them.`
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

      if (!file.type.startsWith("image/")) {
        throw new Error("Please select an image file.");
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

  const deleteSelected = () => {
    if (!selectedImages.length) return;

    updateContent({
      images: content.images.filter(
        (item) => !selectedImages.includes(item.id)
      ),
    });

    setSelectedImages([]);
    showNotice(
      "Selected images deleted locally. Click Save Changes to publish."
    );
  };

  const toggleImageSelection = (id) => {
    setSelectedImages((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
  };

  const toggleSelectAllVisible = () => {
    const ids = visibleImages.map((item) => item.id);
    const allSelected = ids.length > 0 && ids.every((id) => selectedImages.includes(id));

    setSelectedImages((previous) =>
      allSelected
        ? previous.filter((id) => !ids.includes(id))
        : [...new Set([...previous, ...ids])]
    );
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
    });
    setModal("category");
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

      const categoryDescriptions = { ...content.categoryDescriptions };
      delete categoryDescriptions[oldName];
      categoryDescriptions[newName] = draft.description || "";

      const subcategories = { ...content.subcategories };
      if (!subcategories[newName]) {
        subcategories[newName] = subcategories[oldName] || [];
      }
      delete subcategories[oldName];

      const images = content.images.map((item) =>
        item.category === oldName
          ? { ...item, category: newName }
          : item
      );

      updateContent({
        categories,
        categoryDescriptions,
        subcategories,
        images,
      });

      if (activeCategory === oldName) setActiveCategory(newName);
      closeModal();
      return;
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

    const categoryDescriptions = { ...content.categoryDescriptions };
    delete categoryDescriptions[category];

    const subcategories = { ...content.subcategories };
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

    const newName = name.trim();

    const duplicate = (content.subcategories?.[activeCategory] || []).some(
      (item) =>
        item.id !== subcategory.id &&
        item.name.toLowerCase() === newName.toLowerCase()
    );

    if (duplicate) {
      showNotice("That subcategory already exists.", "error");
      return;
    }

    const updated = (content.subcategories?.[activeCategory] || []).map(
      (item) =>
        item.id === subcategory.id
          ? {
              ...item,
              name: newName,
              description: description ?? item.description,
            }
          : item
    );

    updateContent({
      subcategories: {
        ...content.subcategories,
        [activeCategory]: updated,
      },
      images: content.images.map((item) =>
        item.category === activeCategory &&
        item.subcategory === subcategory.name
          ? { ...item, subcategory: newName }
          : item
      ),
    });

    if (activeSubcategory === subcategory.name) {
      setActiveSubcategory(newName);
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
        item.category === activeCategory &&
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

  const selectedVisibleCount = visibleImages.filter((item) =>
    selectedImages.includes(item.id)
  ).length;

  return (
    <>
      <style>{ADMIN_CSS}</style>

      {notice && (
        <div className={`ag-notice ${notice.type}`}>
          <div>
            {notice.type === "success" ? <Check size={17} /> : <X size={17} />}
          </div>
          <span>{notice.message}</span>
        </div>
      )}

      <div className="ag-page">
        <header className="ag-topbar">
          <div className="ag-topbar-inner">
            <button
              className="ag-topbar-button"
              onClick={() => navigate("/admin/dashboard")}
            >
              <ArrowLeft size={16} />
              Dashboard
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
                className="ag-topbar-button"
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
          <section className="ag-page-heading">
            <div>
              <span className="ag-kicker">
                <Camera size={14} />
                Gallery Manager
              </span>
              <h1>Manage School Gallery</h1>
              <p>
                Upload and organize school photos, edit image details, control
                visibility, and update the public Gallery page.
              </p>
            </div>

            <button
              className="ag-settings-button"
              onClick={() => setShowSettings((value) => !value)}
            >
              <Settings2 size={16} />
              Page Settings
              <ChevronDown
                size={15}
                className={showSettings ? "rotate" : ""}
              />
            </button>
          </section>

          {showSettings && (
            <section className="ag-settings-panel">
              <div className="ag-settings-title">
                <div>
                  <span className="ag-section-label">Page Content</span>
                  <h2>Quickly edit public sections</h2>
                </div>
                <button
                  className="ag-icon-button"
                  onClick={() => setShowSettings(false)}
                >
                  <X size={17} />
                </button>
              </div>

              <div className="ag-settings-grid">
                <div className="ag-setting-card">
                  <div>
                    <span>Hero</span>
                    <strong>{content.heroTitle}</strong>
                  </div>
                  <button className="ag-edit" onClick={openHeroEditor}>
                    <Edit3 size={14} />
                    Edit
                  </button>
                </div>

                <div className="ag-setting-card">
                  <div>
                    <span>Main Introduction</span>
                    <strong>{content.title}</strong>
                  </div>
                  <button className="ag-edit" onClick={openMainEditor}>
                    <Edit3 size={14} />
                    Edit
                  </button>
                </div>

                <div className="ag-setting-card">
                  <div>
                    <span>Closing Message</span>
                    <strong>{content.bottomTitle}</strong>
                  </div>
                  <button className="ag-edit" onClick={openBottomEditor}>
                    <Edit3 size={14} />
                    Edit
                  </button>
                </div>
              </div>
            </section>
          )}

          <section className="ag-stat-grid">
            <div className="ag-stat-card">
              <div className="ag-stat-icon"><ImageIcon size={18} /></div>
              <div>
                <strong>{stats.total}</strong>
                <span>Total Photos</span>
              </div>
            </div>

            <div className="ag-stat-card">
              <div className="ag-stat-icon"><LayoutGrid size={18} /></div>
              <div>
                <strong>{stats.categories}</strong>
                <span>Categories</span>
              </div>
            </div>

            <div className="ag-stat-card">
              <div className="ag-stat-icon"><Eye size={18} /></div>
              <div>
                <strong>{stats.visibleCount}</strong>
                <span>Visible in {activeCategory}</span>
              </div>
            </div>

            <div className="ag-stat-card">
              <div className="ag-stat-icon"><EyeOff size={18} /></div>
              <div>
                <strong>{stats.hiddenCount}</strong>
                <span>Hidden in {activeCategory}</span>
              </div>
            </div>
          </section>

          <section className="ag-card ag-manager-card">
            <div className="ag-card-head">
              <div>
                <span className="ag-section-label">Photo Library</span>
                <h2>Manage your photos</h2>
                <p>
                  Choose a category, upload photos, then edit or organize them
                  directly from the cards below.
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
                  {uploading ? "Uploading..." : "Upload Photos"}
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

            <div className="ag-category-strip">
              <div className="ag-category-list">
                {content.categories.map((category) => (
                  <button
                    key={category}
                    className={activeCategory === category ? "active" : ""}
                    onClick={() => {
                      setActiveCategory(category);
                      setActiveSubcategory("");
                      setSelectedImages([]);
                    }}
                  >
                    <ImageIcon size={14} />
                    {category}
                    <span>
                      {
                        content.images.filter(
                          (item) => item.category === category
                        ).length
                      }
                    </span>
                  </button>
                ))}

                <button className="add-category-tab" onClick={addCategory}>
                  <Plus size={14} />
                  Add Category
                </button>
              </div>
            </div>

            <div className="ag-category-toolbar">
              <div className="ag-category-title">
                <div className="ag-category-title-icon">
                  <ImageIcon size={18} />
                </div>
                <div>
                  <strong>{activeCategory}</strong>
                  <span>
                    {stats.categoryCount} photo
                    {stats.categoryCount === 1 ? "" : "s"}
                  </span>
                </div>
              </div>

              <div className="ag-category-actions">
                <button
                  className="ag-edit"
                  onClick={() => openCategoryEditor(activeCategory)}
                >
                  <Edit3 size={14} />
                  Edit Category
                </button>

                <button
                  className="ag-danger-outline"
                  onClick={() => deleteCategory(activeCategory)}
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </div>

            <div className="ag-category-description">
              <div>
                <span className="ag-section-label">Category Description</span>
                <p>
                  {content.categoryDescriptions?.[activeCategory] ||
                    "No description added yet."}
                </p>
              </div>

              <button
                className="ag-small-button"
                onClick={() => openCategoryEditor(activeCategory)}
              >
                <Edit3 size={13} />
                Edit Description
              </button>
            </div>

            <div className="ag-subcategory-row">
              <div className="ag-subcategory-label">
                <strong>Filter by subcategory</strong>
                <button onClick={addSubcategory}>
                  <Plus size={13} />
                  Add
                </button>
              </div>

              <div className="ag-subcategory-list">
                <button
                  className={!activeSubcategory ? "selected" : ""}
                  onClick={() => setActiveSubcategory("")}
                >
                  All
                </button>

                {currentSubcategories.map((subcategory) => (
                  <div className="ag-subcategory-item" key={subcategory.id}>
                    <button
                      className={
                        activeSubcategory === subcategory.name
                          ? "selected"
                          : ""
                      }
                      onClick={() =>
                        setActiveSubcategory(subcategory.name)
                      }
                    >
                      {subcategory.name}
                    </button>

                    <button
                      title="Edit subcategory"
                      onClick={() => editSubcategory(subcategory)}
                    >
                      <Edit3 size={12} />
                    </button>

                    <button
                      className="danger"
                      title="Delete subcategory"
                      onClick={() => deleteSubcategory(subcategory)}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="ag-photo-toolbar">
              <div className="ag-toolbar-selection">
                <label className="ag-select-all">
                  <input
                    type="checkbox"
                    checked={
                      visibleImages.length > 0 &&
                      selectedVisibleCount === visibleImages.length
                    }
                    onChange={toggleSelectAllVisible}
                  />
                  <span>Select all visible</span>
                </label>

                {selectedImages.length > 0 && (
                  <span className="ag-selected-count">
                    {selectedImages.length} selected
                  </span>
                )}
              </div>

              <div className="ag-search-box">
                <Search size={15} />
                <input
                  placeholder="Search photos..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
                {search && (
                  <button onClick={() => setSearch("")}>
                    <X size={13} />
                  </button>
                )}
              </div>
            </div>

            {visibleImages.length === 0 ? (
              <div className="ag-empty">
                <div className="ag-empty-icon">
                  <ImageIcon size={32} />
                </div>
                <h3>No photos found</h3>
                <p>
                  {search
                    ? "Try another search term."
                    : `Upload photos to ${activeSubcategory || activeCategory} to start building the gallery.`}
                </p>
                {!search && (
                  <button
                    className="ag-primary"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload size={15} />
                    Upload Photos
                  </button>
                )}
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
                      <img src={image.image} alt={image.title} />

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
                          Edit Details
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

                      <h3 title={image.title}>{image.title}</h3>
                      <p>
                        {image.description || "No description added."}
                      </p>

                      <div className="ag-image-meta">
                        <small>{image.date}</small>

                        <div className="ag-card-actions">
                          <button
                            title={image.visible ? "Hide photo" : "Show photo"}
                            onClick={() => toggleImageVisibility(image.id)}
                          >
                            {image.visible ? (
                              <Eye size={15} />
                            ) : (
                              <EyeOff size={15} />
                            )}
                          </button>

                          <button
                            title="Edit details"
                            onClick={() => openImageEditor(image)}
                          >
                            <Edit3 size={15} />
                          </button>

                          <button
                            className="danger"
                            title="Delete photo"
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

          <section className="ag-card ag-bottom-card">
            <div>
              <span className="ag-section-label">Closing Section</span>
              <h2>{content.bottomTitle}</h2>
              <p>{content.bottomDescription}</p>
            </div>

            <button className="ag-edit" onClick={openBottomEditor}>
              <Edit3 size={15} />
              Edit Closing Message
            </button>
          </section>

          <div className="ag-save-bar">
            <div>
              <strong>Ready to publish your Gallery?</strong>
              <span>
                Your edits stay local until you click Save Changes.
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
            label="Second Button Text"
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
          subtitle="Change the badge, title, highlighted word, and introduction."
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
          title="Edit Closing Section"
          subtitle="Control the final message shown below the Gallery."
          onClose={closeModal}
          onSave={saveModal}
        >
          <Field
            label="Closing Title"
            value={draft.bottomTitle}
            onChange={(value) =>
              setDraft({ ...draft, bottomTitle: value })
            }
          />
          <Field
            label="Description"
            value={draft.bottomDescription}
            textarea
            onChange={(value) =>
              setDraft({ ...draft, bottomDescription: value })
            }
          />
          <Field
            label="Note"
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
          subtitle="Rename the category and update its public description."
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
        </Modal>
      )}

      {modal === "image" && (
        <Modal
          title="Edit Photo Details"
          subtitle="Update the information used by the public Gallery."
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
              <strong>{draft.title || "Gallery Photo"}</strong>
              <small>{draft.category}</small>
            </div>
          </div>

          <Field
            label="Photo Title"
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
            <span>Show this photo on the public Gallery</span>
          </label>
        </Modal>
      )}
    </>
  );
}

const ADMIN_CSS = `
:root{
  --ag-bg:#f2eee9;
  --ag-card:#fff;
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
  --ag-shadow:0 14px 42px rgba(40,25,30,.07);
}

*{box-sizing:border-box}

.ag-page{
  min-height:100vh;
  background:
    radial-gradient(circle at 10% 0%,rgba(229,195,110,.12),transparent 27%),
    radial-gradient(circle at 90% 12%,rgba(73,189,221,.09),transparent 24%),
    var(--ag-bg);
  color:var(--ag-text);
  font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
  padding-bottom:70px;
}

.ag-topbar{
  position:sticky;
  top:0;
  z-index:50;
  background:rgba(28,18,28,.97);
  border-bottom:1px solid rgba(255,255,255,.08);
  backdrop-filter:blur(16px);
}

.ag-topbar-inner{
  width:min(1440px,calc(100% - 36px));
  min-height:72px;
  margin:auto;
  display:flex;
  align-items:center;
  gap:16px;
}

.ag-brand{
  flex:1;
  display:flex;
  align-items:center;
  gap:10px;
  color:#fff;
}

.ag-brand-icon{
  width:38px;
  height:38px;
  border-radius:11px;
  display:grid;
  place-items:center;
  background:linear-gradient(135deg,var(--ag-gold),#f4dda0);
  color:#34231d;
}

.ag-brand strong{display:block;font-size:14px}
.ag-brand small{display:block;color:#c9b8c3;font-size:9px;margin-top:2px}

.ag-top-actions{display:flex;align-items:center;gap:8px}

.ag-topbar-button{
  min-height:39px;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:7px;
  padding:0 12px;
  border:1px solid rgba(255,255,255,.15);
  border-radius:10px;
  background:transparent;
  color:#eee8ef;
  text-decoration:none;
  font:inherit;
  font-size:10px;
  font-weight:800;
  cursor:pointer;
}

.ag-topbar-button:hover{
  background:rgba(255,255,255,.06);
}

.ag-primary,
.ag-secondary,
.ag-edit,
.ag-danger,
.ag-danger-outline,
.ag-small-button,
.ag-icon-button,
.ag-settings-button{
  border:0;
  font:inherit;
  cursor:pointer;
  transition:.2s ease;
}

.ag-primary{
  min-height:40px;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:7px;
  padding:0 15px;
  border-radius:10px;
  background:linear-gradient(100deg,#e9c718,#58c4dc);
  color:#17151b;
  font-size:10px;
  font-weight:900;
  box-shadow:0 8px 18px rgba(70,60,30,.1);
}

.ag-primary:hover{transform:translateY(-1px)}
.ag-primary:disabled{opacity:.55;cursor:not-allowed;transform:none}

.ag-container{
  width:min(1440px,calc(100% - 36px));
  margin:25px auto 0;
}

.ag-page-heading{
  padding:27px 31px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:25px;
  border:1px solid #fff;
  border-radius:21px;
  background:linear-gradient(120deg,#fffdf8,#eef8f7);
  box-shadow:var(--ag-shadow);
}

.ag-kicker{
  display:inline-flex;
  align-items:center;
  gap:6px;
  padding:7px 10px;
  border-radius:999px;
  background:#f5e8ef;
  color:var(--ag-maroon);
  font-size:9px;
  font-weight:900;
  letter-spacing:.13em;
  text-transform:uppercase;
}

.ag-page-heading h1{
  margin:10px 0 6px;
  font-family:Georgia,serif;
  font-size:clamp(32px,4vw,48px);
  line-height:1;
}

.ag-page-heading p{
  max-width:780px;
  margin:0;
  color:var(--ag-muted);
  font-size:11px;
  line-height:1.7;
}

.ag-settings-button{
  min-height:41px;
  flex:0 0 auto;
  display:inline-flex;
  align-items:center;
  gap:7px;
  padding:0 13px;
  border:1px solid var(--ag-border);
  border-radius:10px;
  background:#fff;
  color:#4e4853;
  font-size:10px;
  font-weight:900;
}

.ag-settings-button:hover{transform:translateY(-1px)}
.ag-settings-button .rotate{transform:rotate(180deg)}

.ag-settings-panel{
  margin-top:15px;
  padding:19px;
  border:1px solid var(--ag-border);
  border-radius:17px;
  background:#fff;
  box-shadow:var(--ag-shadow);
}

.ag-settings-title{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:15px;
  margin-bottom:13px;
}

.ag-settings-title h2{
  margin:5px 0 0;
  font-family:Georgia,serif;
  font-size:20px;
}

.ag-settings-grid{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:10px;
}

.ag-setting-card{
  padding:13px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:10px;
  border:1px solid var(--ag-border);
  border-radius:12px;
  background:var(--ag-soft);
}

.ag-setting-card span{
  display:block;
  color:#8a8189;
  font-size:8px;
  font-weight:800;
  text-transform:uppercase;
  letter-spacing:.08em;
}

.ag-setting-card strong{
  display:block;
  max-width:260px;
  margin-top:4px;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
  font-size:10px;
}

.ag-stat-grid{
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:12px;
  margin-top:15px;
}

.ag-stat-card{
  min-height:82px;
  padding:15px;
  display:flex;
  align-items:center;
  gap:11px;
  border:1px solid var(--ag-border);
  border-radius:14px;
  background:#fff;
  box-shadow:var(--ag-shadow);
}

.ag-stat-icon{
  width:38px;
  height:38px;
  flex:0 0 38px;
  display:grid;
  place-items:center;
  border-radius:10px;
  background:#f2e6ec;
  color:#6d2845;
}

.ag-stat-card strong{
  display:block;
  font-family:Georgia,serif;
  font-size:25px;
  line-height:1;
}

.ag-stat-card span{
  display:block;
  margin-top:4px;
  color:#88808a;
  font-size:8px;
  font-weight:800;
  text-transform:uppercase;
  letter-spacing:.05em;
}

.ag-card{
  margin-top:15px;
  padding:22px;
  border:1px solid var(--ag-border);
  border-radius:19px;
  background:#fff;
  box-shadow:var(--ag-shadow);
}

.ag-card-head{
  display:flex;
  align-items:flex-start;
  justify-content:space-between;
  gap:18px;
  margin-bottom:17px;
}

.ag-section-label{
  color:var(--ag-maroon);
  font-size:8px;
  font-weight:900;
  letter-spacing:.13em;
  text-transform:uppercase;
}

.ag-card-head h2{
  margin:5px 0 0;
  font-family:Georgia,serif;
  font-size:24px;
}

.ag-card-head p{
  margin:6px 0 0;
  color:var(--ag-muted);
  font-size:10px;
  line-height:1.6;
}

.ag-upload-actions{
  display:flex;
  align-items:center;
  justify-content:flex-end;
  flex-wrap:wrap;
  gap:7px;
}

.ag-edit,
.ag-small-button{
  min-height:35px;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:6px;
  padding:0 10px;
  border:1px solid var(--ag-border);
  border-radius:9px;
  background:#fff;
  color:#514b55;
  font-size:9px;
  font-weight:900;
}

.ag-edit:hover,.ag-small-button:hover{
  border-color:#cbbdb5;
  transform:translateY(-1px);
}

.ag-danger,
.ag-danger-outline{
  min-height:35px;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:6px;
  padding:0 10px;
  border-radius:9px;
  background:#fff1f1;
  color:var(--ag-danger);
  border:1px solid #f5d3d5;
  font-size:9px;
  font-weight:900;
}

.ag-danger:hover,.ag-danger-outline:hover{background:#ffe7e8}

.ag-category-strip{
  padding:3px 0 14px;
  border-bottom:1px solid #eee6df;
}

.ag-category-list{
  display:flex;
  flex-wrap:wrap;
  gap:7px;
}

.ag-category-list>button{
  min-height:36px;
  padding:0 11px;
  display:inline-flex;
  align-items:center;
  gap:6px;
  border:1px solid var(--ag-border);
  border-radius:9px;
  background:#fff;
  color:#625c67;
  font:inherit;
  font-size:9px;
  font-weight:900;
  cursor:pointer;
}

.ag-category-list>button span{
  min-width:19px;
  height:19px;
  display:grid;
  place-items:center;
  border-radius:999px;
  background:#f3ece8;
  color:#8c7d7d;
  font-size:8px;
}

.ag-category-list>button.active{
  background:var(--ag-dark);
  border-color:var(--ag-dark);
  color:#fff;
}

.ag-category-list>button.active span{
  background:rgba(255,255,255,.13);
  color:#fff;
}

.ag-category-list .add-category-tab{
  border-style:dashed;
  color:var(--ag-maroon);
}

.ag-category-toolbar{
  margin-top:14px;
  padding:13px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:15px;
  border:1px solid #e9e0d9;
  border-radius:13px;
  background:#faf8f5;
}

.ag-category-title{
  display:flex;
  align-items:center;
  gap:10px;
}

.ag-category-title-icon{
  width:38px;
  height:38px;
  display:grid;
  place-items:center;
  border-radius:10px;
  background:#f0e1e8;
  color:#6d2845;
}

.ag-category-title strong{
  display:block;
  font-family:Georgia,serif;
  font-size:19px;
}

.ag-category-title span{
  display:block;
  margin-top:3px;
  color:#91878e;
  font-size:8px;
}

.ag-category-actions{
  display:flex;
  gap:6px;
}

.ag-category-description{
  padding:13px 2px;
  display:flex;
  align-items:flex-end;
  justify-content:space-between;
  gap:15px;
}

.ag-category-description p{
  max-width:900px;
  margin:5px 0 0;
  color:var(--ag-muted);
  font-size:10px;
  line-height:1.65;
}

.ag-subcategory-row{
  padding:13px;
  border:1px solid #eee5de;
  border-radius:13px;
  background:#faf8f5;
}

.ag-subcategory-label{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:10px;
  margin-bottom:9px;
}

.ag-subcategory-label strong{
  font-size:9px;
  color:#49434c;
}

.ag-subcategory-label button{
  border:0;
  background:transparent;
  color:#6d2845;
  display:inline-flex;
  align-items:center;
  gap:4px;
  font:inherit;
  font-size:9px;
  font-weight:900;
  cursor:pointer;
}

.ag-subcategory-list{
  display:flex;
  flex-wrap:wrap;
  gap:6px;
}

.ag-subcategory-list>button,
.ag-subcategory-item>button:first-child{
  min-height:31px;
  padding:0 10px;
  border:1px solid var(--ag-border);
  border-radius:8px;
  background:#fff;
  color:#625c67;
  font:inherit;
  font-size:8px;
  font-weight:900;
  cursor:pointer;
}

.ag-subcategory-list>button.selected,
.ag-subcategory-item>button:first-child.selected{
  border-color:#6d2845;
  background:#f2e5eb;
  color:#64243f;
}

.ag-subcategory-item{
  display:flex;
  gap:3px;
}

.ag-subcategory-item>button:not(:first-child){
  width:29px;
  height:31px;
  display:grid;
  place-items:center;
  border:1px solid var(--ag-border);
  border-radius:8px;
  background:#fff;
  color:#6d626b;
  cursor:pointer;
}

.ag-subcategory-item>button.danger{color:var(--ag-danger)}

.ag-photo-toolbar{
  margin:15px 0;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:15px;
}

.ag-toolbar-selection{
  display:flex;
  align-items:center;
  gap:9px;
}

.ag-select-all{
  display:inline-flex;
  align-items:center;
  gap:6px;
  color:#5e5861;
  font-size:9px;
  font-weight:800;
  cursor:pointer;
}

.ag-select-all input{
  width:15px;
  height:15px;
  accent-color:#672441;
}

.ag-selected-count{
  padding:5px 8px;
  border-radius:999px;
  background:#f2e6ec;
  color:#6d2845;
  font-size:8px;
  font-weight:900;
}

.ag-search-box{
  width:min(310px,100%);
  min-height:37px;
  display:flex;
  align-items:center;
  gap:7px;
  padding:0 10px;
  border:1px solid var(--ag-border);
  border-radius:9px;
  background:#fff;
  color:#8d838a;
}

.ag-search-box input{
  flex:1;
  min-width:0;
  border:0;
  outline:0;
  background:transparent;
  font:inherit;
  font-size:10px;
}

.ag-search-box button{
  width:23px;
  height:23px;
  display:grid;
  place-items:center;
  border:0;
  border-radius:6px;
  background:#f2eeeb;
  color:#777078;
  cursor:pointer;
}

.ag-image-grid{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:13px;
}

.ag-image-card{
  position:relative;
  overflow:hidden;
  border:1px solid var(--ag-border);
  border-radius:15px;
  background:#fff;
  transition:.2s ease;
}

.ag-image-card:hover{
  transform:translateY(-2px);
  box-shadow:0 13px 30px rgba(40,25,30,.09);
}

.ag-image-card.hidden-card{opacity:.62}

.ag-image-check{
  position:absolute;
  z-index:3;
  top:9px;
  left:9px;
}

.ag-image-check input{
  width:17px;
  height:17px;
  accent-color:#672441;
}

.ag-image-preview{
  height:205px;
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

.ag-hidden-label{
  position:absolute;
  right:9px;
  top:9px;
  display:flex;
  align-items:center;
  gap:5px;
  padding:6px 8px;
  border-radius:999px;
  background:#24131ddd;
  color:#fff;
  font-size:8px;
  font-weight:900;
}

.ag-image-overlay{
  position:absolute;
  inset:0;
  display:flex;
  align-items:flex-end;
  justify-content:center;
  gap:6px;
  padding:11px;
  opacity:0;
  background:linear-gradient(transparent,rgba(20,10,18,.8));
  transition:.2s ease;
}

.ag-image-card:hover .ag-image-overlay{opacity:1}

.ag-overlay-button{
  min-height:31px;
  padding:0 9px;
  display:inline-flex;
  align-items:center;
  gap:5px;
  border:1px solid rgba(255,255,255,.3);
  border-radius:8px;
  background:rgba(255,255,255,.95);
  color:#291c24;
  font:inherit;
  font-size:8px;
  font-weight:900;
  cursor:pointer;
}

.ag-image-body{padding:13px}

.ag-image-tags{
  min-height:19px;
  display:flex;
  flex-wrap:wrap;
  gap:4px;
}

.ag-image-tags span{
  padding:4px 6px;
  border-radius:999px;
  background:#f2e8ee;
  color:#6e3450;
  font-size:7px;
  font-weight:900;
}

.ag-image-body h3{
  margin:8px 0 4px;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
  font-family:Georgia,serif;
  font-size:16px;
}

.ag-image-body p{
  height:32px;
  overflow:hidden;
  margin:0;
  color:var(--ag-muted);
  font-size:9px;
  line-height:1.6;
}

.ag-image-meta{
  margin-top:11px;
  padding-top:9px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:8px;
  border-top:1px solid #eee6df;
}

.ag-image-meta small{
  color:#958b91;
  font-size:7px;
  font-weight:800;
}

.ag-card-actions{
  display:flex;
  gap:4px;
}

.ag-card-actions button{
  width:29px;
  height:29px;
  display:grid;
  place-items:center;
  border:1px solid var(--ag-border);
  border-radius:7px;
  background:#fff;
  color:#5d5660;
  cursor:pointer;
}

.ag-card-actions button:hover{background:#f5f1ed}
.ag-card-actions button.danger{color:var(--ag-danger)}

.ag-empty{
  padding:55px 20px;
  text-align:center;
  border:1px dashed #d7ccc4;
  border-radius:15px;
  color:#988e95;
}

.ag-empty-icon{
  width:54px;
  height:54px;
  margin:0 auto;
  display:grid;
  place-items:center;
  border-radius:15px;
  background:#f3ebe7;
  color:#8e7c82;
}

.ag-empty h3{
  margin:10px 0 4px;
  color:#3c3540;
  font-family:Georgia,serif;
  font-size:20px;
}

.ag-empty p{
  max-width:500px;
  margin:0 auto 15px;
  font-size:9px;
  line-height:1.6;
}

.ag-bottom-card{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:20px;
}

.ag-bottom-card h2{
  margin:5px 0;
  font-family:Georgia,serif;
  font-size:23px;
}

.ag-bottom-card p{
  margin:0;
  color:var(--ag-muted);
  font-size:10px;
}

.ag-save-bar{
  position:sticky;
  bottom:14px;
  z-index:20;
  margin-top:18px;
  padding:13px 16px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:15px;
  border:1px solid rgba(255,255,255,.75);
  border-radius:14px;
  background:rgba(255,255,255,.95);
  box-shadow:0 17px 45px rgba(30,20,25,.14);
  backdrop-filter:blur(14px);
}

.ag-save-bar strong{
  display:block;
  font-size:10px;
}

.ag-save-bar span{
  display:block;
  margin-top:3px;
  color:#8a8188;
  font-size:8px;
}

.ag-notice{
  position:fixed;
  z-index:100;
  right:18px;
  top:88px;
  max-width:410px;
  padding:11px 13px;
  display:flex;
  align-items:center;
  gap:8px;
  border-radius:11px;
  color:#fff;
  background:#24131f;
  box-shadow:0 15px 40px rgba(0,0,0,.18);
  font-size:10px;
  font-weight:700;
}

.ag-notice>div{
  width:26px;
  height:26px;
  flex:0 0 26px;
  display:grid;
  place-items:center;
  border-radius:7px;
  background:rgba(255,255,255,.12);
}

.ag-notice.error{background:#8d2734}

.ag-modal-backdrop{
  position:fixed;
  inset:0;
  z-index:200;
  padding:18px;
  display:flex;
  align-items:center;
  justify-content:center;
  overflow:auto;
  background:rgba(20,10,18,.72);
  backdrop-filter:blur(8px);
}

.ag-modal{
  width:min(680px,100%);
  max-height:88vh;
  display:flex;
  flex-direction:column;
  overflow:hidden;
  border-radius:18px;
  background:#fff;
  box-shadow:0 35px 100px rgba(0,0,0,.3);
}

.ag-modal-head{
  padding:19px 21px;
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
  font-size:23px;
}

.ag-modal-head p{
  margin:5px 0 0;
  color:#88808a;
  font-size:9px;
}

.ag-icon-button{
  width:34px;
  height:34px;
  display:grid;
  place-items:center;
  border-radius:8px;
  background:#f5f1ed;
  color:#5b535c;
}

.ag-modal-body{
  padding:20px 21px;
  overflow:auto;
}

.ag-modal-foot{
  padding:13px 21px;
  display:flex;
  justify-content:flex-end;
  gap:7px;
  border-top:1px solid #eee6df;
  background:#faf8f5;
}

.ag-secondary{
  min-height:39px;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:6px;
  padding:0 13px;
  border:1px solid var(--ag-border);
  border-radius:9px;
  background:#fff;
  color:#4e4a56;
  font-size:10px;
  font-weight:800;
}

.ag-field{
  display:block;
  margin-bottom:15px;
}

.ag-field>span{
  display:block;
  margin-bottom:5px;
  color:#4a4450;
  font-size:9px;
  font-weight:900;
}

.ag-field input,
.ag-field textarea,
.ag-field select{
  width:100%;
  border:1px solid #ddd4cd;
  border-radius:9px;
  outline:none;
  background:#fff;
  color:#27222b;
  font:inherit;
  font-size:10px;
}

.ag-field input,
.ag-field select{
  min-height:41px;
  padding:0 10px;
}

.ag-field textarea{
  min-height:92px;
  padding:10px;
  resize:vertical;
  line-height:1.6;
}

.ag-field input:focus,
.ag-field textarea:focus,
.ag-field select:focus{
  border-color:#8b5169;
  box-shadow:0 0 0 3px #8b516915;
}

.ag-select-wrap{position:relative}
.ag-select-wrap select{appearance:none;padding-right:32px}
.ag-select-wrap svg{
  position:absolute;
  right:10px;
  top:50%;
  transform:translateY(-50%);
  pointer-events:none;
  color:#847b83;
}

.ag-check-field{
  display:flex;
  align-items:center;
  gap:8px;
  padding:10px;
  border:1px solid #e8dfd8;
  border-radius:9px;
  background:#faf8f5;
  font-size:9px;
  font-weight:700;
}

.ag-check-field input{
  width:15px;
  height:15px;
  accent-color:#672441;
}

.ag-edit-image{
  display:flex;
  align-items:center;
  gap:11px;
  padding:9px;
  margin-bottom:15px;
  border:1px solid #e8dfd8;
  border-radius:10px;
  background:#faf8f5;
}

.ag-edit-image-preview{
  width:75px;
  height:54px;
  display:grid;
  place-items:center;
  overflow:hidden;
  border-radius:7px;
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
  font-size:10px;
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
  gap:11px;
  background:var(--ag-bg);
  color:#4f4851;
}

.ag-spinner{
  width:36px;
  height:36px;
  border:4px solid #ddd2ca;
  border-top-color:#6a2847;
  border-radius:50%;
  animation:ag-spin .8s linear infinite;
}

@keyframes ag-spin{to{transform:rotate(360deg)}}

@media(max-width:1100px){
  .ag-image-grid{grid-template-columns:repeat(2,1fr)}
  .ag-stat-grid{grid-template-columns:repeat(2,1fr)}
  .ag-settings-grid{grid-template-columns:1fr}
}

@media(max-width:850px){
  .ag-page-heading{align-items:flex-start;flex-direction:column}
  .ag-category-toolbar,.ag-bottom-card{align-items:flex-start;flex-direction:column}
  .ag-category-actions{width:100%}
  .ag-category-actions>*{flex:1}
}

@media(max-width:650px){
  .ag-container,.ag-topbar-inner{width:min(100% - 20px,1440px)}
  .ag-topbar-inner{min-height:auto;padding:9px 0;flex-wrap:wrap}
  .ag-brand{order:-1;flex-basis:100%}
  .ag-top-actions{width:100%;display:grid;grid-template-columns:1fr 1fr}
  .ag-top-actions>*{width:100%}
  .ag-page-heading{padding:22px 19px}
  .ag-card{padding:16px}
  .ag-card-head{flex-direction:column}
  .ag-upload-actions{width:100%}
  .ag-upload-actions>*{flex:1}
  .ag-stat-grid{grid-template-columns:1fr 1fr}
  .ag-image-grid{grid-template-columns:1fr}
  .ag-category-description{align-items:flex-start;flex-direction:column}
  .ag-category-description .ag-small-button{width:100%}
  .ag-photo-toolbar{align-items:stretch;flex-direction:column}
  .ag-search-box{width:100%}
  .ag-save-bar{align-items:stretch;flex-direction:column}
  .ag-save-bar .ag-primary{width:100%}
}
`;
