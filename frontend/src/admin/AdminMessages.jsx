import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { supabase } from "../lib/supabase";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  MessageSquareText,
  UserRound,
  Image,
  Type,
  CheckCircle2,
  Eye,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  UploadCloud,
  X,
} from "lucide-react";

const colors = {
  red: "#D71920",
  green: "#168A3A",
  purple: "#4B2E83",
  dark: "#0B1020",
  cyan: "#38BDF8",
  gold: "#FACC15",
};

const defaultMessagesContent = {
  badge: "Leadership Messages",
  title: "Messages From Leadership",
  description:
    "Words from school leadership guiding students toward academic excellence, discipline, values, and lifelong learning.",
  people: [
    {
      id: crypto.randomUUID(),
      name: "Principal",
      role: "Principal",
      title: "Principal’s Message",
      message:
        "Welcome to Baljagriti English Secondary School. We are committed to nurturing every child into a confident, capable, disciplined, and compassionate individual. Our goal is to provide quality education with strong values, creativity, and academic excellence.",
      image: "",
    },
    {
      id: crypto.randomUUID(),
      name: "Vice Principal",
      role: "Vice Principal",
      title: "Vice Principal’s Message",
      message:
        "Our team works tirelessly to provide a safe, inspiring, and academically rigorous environment for every student. We believe every child deserves care, guidance, and opportunities to grow academically, socially, and personally.",
      image: "",
    },
  ],
};

function mergeMessagesContent(saved = {}) {
  return {
    ...defaultMessagesContent,
    ...saved,
    people:
      Array.isArray(saved.people) && saved.people.length > 0
        ? saved.people.map((person) => ({
            id: person.id || crypto.randomUUID(),
            name: person.name || "",
            role: person.role || "",
            title: person.title || "",
            message: person.message || "",
            image: person.image || "",
          }))
        : defaultMessagesContent.people,
  };
}

function Field({ label, value, onChange, textarea = false, placeholder = "" }) {
  return (
    <div>
      <label className="block text-xs font-bold mb-1.5 text-slate-500 uppercase tracking-wider">
        {label}
      </label>

      {textarea ? (
        <textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          rows={5}
          placeholder={placeholder}
          className="w-full px-4 py-3 rounded-xl outline-none text-sm resize-none transition-all duration-150"
          style={{
            background: "#F8FAFC",
            border: "1.5px solid rgba(75,46,131,0.12)",
            color: colors.dark,
          }}
          onFocus={(e) => {
            e.target.style.border = "1.5px solid rgba(75,46,131,0.4)";
            e.target.style.background = "#fff";
            e.target.style.boxShadow = "0 0 0 3px rgba(75,46,131,0.06)";
          }}
          onBlur={(e) => {
            e.target.style.border = "1.5px solid rgba(75,46,131,0.12)";
            e.target.style.background = "#F8FAFC";
            e.target.style.boxShadow = "none";
          }}
        />
      ) : (
        <input
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 rounded-xl outline-none text-sm transition-all duration-150"
          style={{
            background: "#F8FAFC",
            border: "1.5px solid rgba(75,46,131,0.12)",
            color: colors.dark,
          }}
          onFocus={(e) => {
            e.target.style.border = "1.5px solid rgba(75,46,131,0.4)";
            e.target.style.background = "#fff";
            e.target.style.boxShadow = "0 0 0 3px rgba(75,46,131,0.06)";
          }}
          onBlur={(e) => {
            e.target.style.border = "1.5px solid rgba(75,46,131,0.12)";
            e.target.style.background = "#F8FAFC";
            e.target.style.boxShadow = "none";
          }}
        />
      )}
    </div>
  );
}

// Image Upload Component for Leadership Photos
function ImageUploadField({ label, imageUrl, onUpload, onRemove, uploading }) {
  return (
    <div>
      <label className="block text-xs font-bold mb-1.5 text-slate-500 uppercase tracking-wider">
        {label}
      </label>

      <div
        className="rounded-xl overflow-hidden bg-white mb-3 relative"
        style={{ border: "1.5px solid rgba(15,23,42,0.08)" }}
      >
        {imageUrl ? (
          <>
            <img src={imageUrl} alt="Leadership" className="w-full h-48 object-cover" />
            <button
              type="button"
              onClick={onRemove}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </>
        ) : (
          <div className="w-full h-48 bg-slate-50 flex items-center justify-center">
            <UserRound className="w-16 h-16 text-slate-300" />
          </div>
        )}
      </div>

      <label
        className="flex flex-col items-center justify-center gap-2 cursor-pointer rounded-xl p-4 text-center transition-all duration-150 hover:bg-white/90"
        style={{
          background: "rgba(255,255,255,0.6)",
          border: "1.5px dashed rgba(75,46,131,0.2)",
        }}
      >
        <UploadCloud className="w-5 h-5" style={{ color: colors.purple }} />

        <span className="text-sm font-bold text-slate-800">
          {uploading ? "Uploading..." : "Upload Photo"}
        </span>

        <span className="text-xs text-slate-400 leading-relaxed">
          PNG, JPG, WebP • max 6 MB
        </span>

        <input
          type="file"
          accept="image/*"
          disabled={uploading}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              onUpload(file);
            }
            e.target.value = "";
          }}
          className="hidden"
        />
      </label>
    </div>
  );
}

// Accordion Section Component - Matching Home page design
function AccordionSection({
  icon: Icon,
  title,
  color,
  children,
  isExpanded,
  onToggle,
  sectionId,
  index,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        background: "#FFFFFF",
        border: isExpanded
          ? `1.5px solid ${color}30`
          : "1.5px solid rgba(15,23,42,0.07)",
        boxShadow: isExpanded
          ? `0 8px 32px ${color}12, 0 2px 8px rgba(0,0,0,0.04)`
          : "0 2px 8px rgba(0,0,0,0.04)",
      }}
    >
      {/* Header */}
      <button
        onClick={() => onToggle(sectionId)}
        className="w-full flex items-center justify-between px-5 py-4 transition-all duration-200"
        style={{
          background: isExpanded ? `${color}06` : "transparent",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${color}12` }}
          >
            <Icon className="w-4 h-4" style={{ color }} />
          </div>
          <div className="text-left">
            <div className="font-bold text-slate-900 text-sm">{title}</div>
            {!isExpanded && (
              <div className="text-xs text-slate-400 mt-0.5">Click to expand and edit</div>
            )}
          </div>
        </div>
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200"
          style={{
            background: isExpanded ? `${color}15` : "rgba(15,23,42,0.05)",
          }}
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" style={{ color }} />
          ) : (
            <ChevronRight className="w-4 h-4 text-slate-400" />
          )}
        </div>
      </button>

      {/* Divider when open */}
      {isExpanded && (
        <div style={{ height: "1px", background: `${color}18`, margin: "0 20px" }} />
      )}

      {/* Content */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-5 pt-5 pb-6 space-y-4">{children}</div>
      </div>
    </motion.div>
  );
}

function MessagesPreview({ form }) {
  return (
    <div
      className="min-h-full p-6"
      style={{
        background: `
          radial-gradient(circle at top right, rgba(124,92,196,0.16), transparent 34%),
          radial-gradient(circle at bottom left, rgba(22,138,58,0.13), transparent 32%),
          linear-gradient(180deg, #FFF8EE 0%, #F1ECFF 100%)
        `,
      }}
    >
      <div className="text-center mb-10">
        <span
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-5"
          style={{
            background: "rgba(215,25,32,0.08)",
            color: colors.red,
            border: "1px solid rgba(215,25,32,0.16)",
          }}
        >
          {form.badge}
        </span>

        <h1
          className="text-4xl mb-4"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 850,
            color: colors.dark,
            letterSpacing: "-0.045em",
          }}
        >
          {form.title}
        </h1>

        <p className="max-w-2xl mx-auto text-base text-slate-500 leading-relaxed">
          {form.description}
        </p>
      </div>

      <div className="space-y-6">
        {form.people.map((person) => (
          <div
            key={person.id}
            className="rounded-3xl overflow-hidden flex flex-col md:flex-row"
            style={{
              background:
                "linear-gradient(145deg, rgba(255,255,255,0.96), rgba(255,255,255,0.78))",
              border: "1px solid rgba(11,16,32,0.08)",
              boxShadow:
                "0 18px 48px rgba(11,16,32,0.075), inset 0 1px 0 rgba(255,255,255,0.85)",
            }}
          >
            <div
              className="w-full md:w-[220px] flex-shrink-0 flex flex-col items-center justify-center text-center p-7"
              style={{
                background:
                  "linear-gradient(145deg, rgba(255,248,238,0.96), rgba(241,236,255,0.8))",
                borderRight: "1px solid rgba(11,16,32,0.08)",
              }}
            >
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center overflow-hidden mb-5"
                style={{
                  background: "rgba(255,255,255,0.85)",
                  border: "1px solid rgba(11,16,32,0.08)",
                  boxShadow: "0 16px 38px rgba(11,16,32,0.1)",
                }}
              >
                {person.image ? (
                  <img
                    src={person.image}
                    alt={person.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserRound className="w-12 h-12 text-slate-400" />
                )}
              </div>

              <h3
                className="text-xl mb-1"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 850,
                  color: colors.dark,
                  letterSpacing: "-0.025em",
                }}
              >
                {person.name || "Name"}
              </h3>

              <p className="text-sm font-semibold" style={{ color: colors.green }}>
                {person.role || "Role"}
              </p>
            </div>

            <div className="relative flex-1 p-7">
              <div
                className="absolute right-7 top-5 text-6xl leading-none"
                style={{ color: "rgba(75,46,131,0.1)" }}
              >
                ”
              </div>

              <h2
                className="text-3xl mb-4"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 850,
                  color: colors.dark,
                  letterSpacing: "-0.035em",
                }}
              >
                {person.title || "Message Title"}
              </h2>

              <p className="text-base leading-relaxed text-slate-500">
                {person.message || "Message text..."}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminMessages() {
  const navigate = useNavigate();

  const [form, setForm] = useState(defaultMessagesContent);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState({});
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // State for accordion - all collapsed by default
  const [expandedSections, setExpandedSections] = useState({
    header: false,
  });

  // Dynamic state for people sections
  const [expandedPeople, setExpandedPeople] = useState({});

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    const loadMessagesContent = async () => {
      try {
        const res = await axios.get(
          "https://school-website-backend-ixx2.onrender.com/api/site-content/messages",
          { timeout: 8000 }
        );

        const savedContent = res.data?.data?.content || {};
        setForm(mergeMessagesContent(savedContent));
        
        // Initialize expanded state for all people sections (all collapsed by default)
        const initialExpanded = {};
        savedContent.people?.forEach(person => {
          initialExpanded[person.id] = false;
        });
        setExpandedPeople(initialExpanded);
      } catch (err) {
        console.error("Load messages content error:", err);
        setError("Could not load saved leadership messages. Default editor is shown.");
      } finally {
        setLoading(false);
      }
    };

    loadMessagesContent();
  }, []);

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const togglePersonSection = (personId) => {
    setExpandedPeople((prev) => ({
      ...prev,
      [personId]: !prev[personId],
    }));
  };

  const expandAll = () => {
    const allExpanded = {};
    form.people.forEach(person => {
      allExpanded[person.id] = true;
    });
    setExpandedPeople(allExpanded);
    setExpandedSections({ header: true });
  };

  const collapseAll = () => {
    const allCollapsed = {};
    form.people.forEach(person => {
      allCollapsed[person.id] = false;
    });
    setExpandedPeople(allCollapsed);
    setExpandedSections({ header: false });
  };

  const updatePageField = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updatePerson = (id, name, value) => {
    setForm((prev) => ({
      ...prev,
      people: prev.people.map((person) =>
        person.id === id
          ? {
              ...person,
              [name]: value,
            }
          : person
      ),
    }));
  };

  // Image upload function using Supabase
  const uploadImage = async (personId, file) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError("Please upload only PNG, JPG, or WebP image.");
      return;
    }

    // Validate file size (max 3MB)
    if (file.size > 6 * 1024 * 1024) {
      setError("Image must be less than 6 MB.");
      return;
    }

    setError("");
    setUploading((prev) => ({ ...prev, [personId]: true }));

    try {
      const fileName = `leadership/${Date.now()}-${file.name}`;

      const { error } = await supabase.storage
        .from("website-images")
        .upload(fileName, file);

      if (error) throw error;

      const { data } = supabase.storage
        .from("website-images")
        .getPublicUrl(fileName);

      updatePerson(personId, "image", data.publicUrl);
      setSuccess("Image uploaded successfully.");
    } catch (err) {
      console.error("Image upload error:", err);
      setError("Image upload failed. Please try again.");
    } finally {
      setUploading((prev) => ({ ...prev, [personId]: false }));
    }
  };

  const addPerson = () => {
    const newPerson = {
      id: crypto.randomUUID(),
      name: "New Leader",
      role: "Designation",
      title: "New Message",
      message: "Write leadership message here.",
      image: "",
    };
    
    setForm((prev) => ({
      ...prev,
      people: [...prev.people, newPerson],
    }));
    
    // Auto-expand the new person section
    setExpandedPeople((prev) => ({
      ...prev,
      [newPerson.id]: true,
    }));
  };

  const deletePerson = (id) => {
    setForm((prev) => ({
      ...prev,
      people: prev.people.filter((person) => person.id !== id),
    }));
    
    // Remove from expanded state
    setExpandedPeople((prev) => {
      const newState = { ...prev };
      delete newState[id];
      return newState;
    });
  };

  const saveMessagesContent = async () => {
    setSuccess("");
    setError("");
    setSaving(true);

    try {
      await axios.put(
        "https://school-website-backend-ixx2.onrender.com/api/site-content/messages",
        {
          content: form,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Leadership messages saved successfully.");
    } catch (err) {
      console.error("Save messages content error:", err);
      setError(
        err.response?.data?.message || "Could not save leadership messages."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#FFF8EE" }}
      >
        <div className="text-slate-600 font-semibold">
          Loading messages editor...
        </div>
      </div>
    );
  }

  const expandedCount = Object.values(expandedPeople).filter(Boolean).length + (expandedSections.header ? 1 : 0);
  const totalSections = form.people.length + 1; // +1 for header

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
        className="sticky top-0 z-40"
        style={{
          background:
            "linear-gradient(145deg, rgba(2,6,23,0.96), rgba(15,23,42,0.88))",
          borderBottom: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 18px 52px rgba(0,0,0,0.22)",
          backdropFilter: "blur(22px)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/admin/dashboard")}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white font-semibold text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>

          <div className="flex items-center gap-3">
            <a
              href="/messages"
              target="_blank"
              rel="noreferrer"
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-white/80 hover:text-white text-sm transition-all"
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
            >
              <ExternalLink className="w-4 h-4" />
              View Page
            </a>

            <button
              type="button"
              onClick={addPerson}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-white/80 hover:text-white text-sm transition-all"
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
            >
              <Plus className="w-4 h-4" />
              Add Block
            </button>

            <button
              type="button"
              onClick={saveMessagesContent}
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-105 disabled:opacity-60"
              style={{
                color: "#020617",
                background: `linear-gradient(135deg, ${colors.gold}, ${colors.cyan})`,
                boxShadow: "0 8px 24px rgba(56,189,248,0.28)",
              }}
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-7"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(75,46,131,0.12)", border: "1px solid rgba(75,46,131,0.2)" }}
                >
                  <MessageSquareText className="w-4 h-4" style={{ color: colors.purple }} />
                </div>
                <span className="text-sm font-bold" style={{ color: colors.purple }}>Manage Messages</span>
              </div>

              <h1
                className="text-3xl md:text-4xl font-black mb-2"
                style={{ color: colors.dark, letterSpacing: "-0.04em" }}
              >
                Edit Leadership Messages
              </h1>
              <p className="text-slate-500 text-sm">
                Click on any section below to expand and edit. Only the section you need will be visible.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-400 font-medium">
                {expandedCount} of {totalSections} sections open
              </span>
              
              {expandedCount < totalSections ? (
                <button
                  onClick={expandAll}
                  className="px-4 py-2 rounded-xl text-sm font-bold transition-all hover:scale-105"
                  style={{
                    background: "rgba(56,189,248,0.1)",
                    color: colors.cyan,
                    border: "1px solid rgba(56,189,248,0.2)",
                  }}
                >
                  Expand All
                </button>
              ) : (
                <button
                  onClick={collapseAll}
                  className="px-4 py-2 rounded-xl text-sm font-bold transition-all hover:scale-105"
                  style={{
                    background: "rgba(15,23,42,0.06)",
                    color: "rgba(15,23,42,0.5)",
                    border: "1px solid rgba(15,23,42,0.08)",
                  }}
                >
                  Collapse All
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 rounded-xl px-4 py-3 flex items-center gap-3 font-semibold text-sm"
            style={{ background: "rgba(22,138,58,0.08)", color: colors.green, border: "1px solid rgba(22,138,58,0.18)" }}
          >
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            {success}
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 rounded-xl px-4 py-3 font-semibold text-sm"
            style={{ background: "rgba(215,25,32,0.08)", color: colors.red, border: "1px solid rgba(215,25,32,0.18)" }}
          >
            {error}
          </motion.div>
        )}

        {/* Main grid - matching Home page layout */}
        <div className="grid xl:grid-cols-[1fr_1.2fr] gap-6 items-start">
          {/* Left: Accordion sections */}
          <div className="space-y-3">
            {/* Page Header Section */}
            <AccordionSection
              icon={Type}
              title="Page Header"
              color={colors.purple}
              isExpanded={expandedSections.header}
              onToggle={toggleSection}
              sectionId="header"
              index={0}
            >
              <Field
                label="Badge Text"
                value={form.badge}
                onChange={(value) => updatePageField("badge", value)}
              />
              <Field
                label="Page Title"
                value={form.title}
                onChange={(value) => updatePageField("title", value)}
              />
              <Field
                label="Page Description"
                value={form.description}
                onChange={(value) => updatePageField("description", value)}
                textarea
              />
            </AccordionSection>

            {/* Leadership Blocks - Each as a separate accordion */}
            {form.people.map((person, index) => (
              <AccordionSection
                key={person.id}
                icon={UserRound}
                title={`Leadership Block ${index + 1}: ${person.name || "Untitled"}`}
                color={colors.green}
                isExpanded={expandedPeople[person.id] || false}
                onToggle={() => togglePersonSection(person.id)}
                sectionId={person.id}
                index={index + 1}
              >
                <div className="flex justify-end mb-2">
                  <button
                    type="button"
                    onClick={() => deletePerson(person.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-105"
                    style={{
                      background: "rgba(215,25,32,0.08)",
                      color: colors.red,
                      border: "1px solid rgba(215,25,32,0.15)",
                    }}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete Block
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <Field
                    label="Name"
                    value={person.name}
                    onChange={(value) => updatePerson(person.id, "name", value)}
                  />
                  <Field
                    label="Role"
                    value={person.role}
                    onChange={(value) => updatePerson(person.id, "role", value)}
                  />
                </div>

                <Field
                  label="Message Title"
                  value={person.title}
                  onChange={(value) => updatePerson(person.id, "title", value)}
                />

                <Field
                  label="Message"
                  value={person.message}
                  onChange={(value) => updatePerson(person.id, "message", value)}
                  textarea
                />

                {/* Image Upload Field - Replaces the URL field */}
                <ImageUploadField
                  label="Leadership Photo"
                  imageUrl={person.image}
                  uploading={uploading[person.id] || false}
                  onUpload={(file) => uploadImage(person.id, file)}
                  onRemove={() => updatePerson(person.id, "image", "")}
                />

                {/* Image preview - Keep this */}
                {person.image && (
                  <div
                    className="rounded-xl overflow-hidden"
                    style={{ border: "1.5px solid rgba(15,23,42,0.08)" }}
                  >
                    <img
                      src={person.image}
                      alt={person.name}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}
              </AccordionSection>
            ))}

            {/* Add New Block Button */}
            <button
              type="button"
              onClick={addPerson}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-4 rounded-2xl font-bold text-sm transition-all hover:scale-[1.01]"
              style={{
                color: colors.dark,
                background: "#FFFFFF",
                border: "1.5px dashed rgba(75,46,131,0.2)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}
            >
              <Plus className="w-4 h-4" style={{ color: colors.purple }} />
              Add New Leadership Block
            </button>
          </div>

          {/* Right: Preview */}
          <aside
            className="xl:sticky xl:top-24 rounded-2xl overflow-hidden"
            style={{
              background: "linear-gradient(145deg, rgba(15,23,42,0.98), rgba(30,41,59,0.94))",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 20px 60px rgba(11,16,32,0.3)",
            }}
          >
            {/* Preview header */}
            <div
              className="px-5 py-4 flex items-center justify-between"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(56,189,248,0.12)" }}
                >
                  <Eye className="w-4 h-4" style={{ color: colors.cyan }} />
                </div>
                <div>
                  <div className="text-white font-bold text-sm">Messages Preview</div>
                  <div className="text-white/45 text-xs">Updates live while typing</div>
                </div>
              </div>
              {/* Fake browser dots */}
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
              </div>
            </div>

            <div className="bg-white overflow-y-auto" style={{ height: "720px" }}>
              <MessagesPreview form={form} />
            </div>
          </aside>
        </div>
      </main>
    </section>
  );
}
