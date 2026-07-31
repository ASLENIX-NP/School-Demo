import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Save,
  Contact as ContactIcon,
  Type,
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  ExternalLink,
  Eye,
  MessageSquare,
  Map,
  X,
  Trash2,
  Plus,
  Pencil,
  AlertCircle,
  Inbox,
} from "lucide-react";

import {
  Contact,
  defaultContactContent,
  mergeContactContent,
  normalizeExternalUrl,
} from "../app/components/Contact";

const colors = {
  red: "#D71920",
  green: "#168A3A",
  purple: "#4B2E83",
  softPurple: "#7C5CC4",
  dark: "#0B1020",
  cream: "#FFF8EE",
  lightPurple: "#F1ECFF",
  cyan: "#38BDF8",
  gold: "#FACC15",
};

const lightAdminPanelStyle = {
  background:
    "linear-gradient(135deg, rgba(255,255,255,0.96), rgba(248,244,255,0.95), rgba(238,247,255,0.95))",
  border: "1px solid rgba(75,46,131,0.12)",
  boxShadow: "0 18px 44px rgba(15,23,42,0.08)",
  backdropFilter: "blur(14px)",
};

function getAdminToken() {
  return (
    localStorage.getItem("adminToken") ||
    localStorage.getItem("token") ||
    localStorage.getItem("admin_token") ||
    ""
  );
}

function getAuthHeaders() {
  const token = getAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : null;
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
      <label className="block text-sm font-bold mb-2 text-slate-700">
        {label}
      </label>

      <textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-4 py-3 rounded-2xl outline-none text-sm resize-none"
        style={{
          background: "rgba(255,255,255,0.92)",
          border: "1px solid rgba(75,46,131,0.16)",
          color: colors.dark,
        }}
      />
    </div>
  );
}

function IconSelect({ value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-bold mb-2 text-slate-700">
        Icon
      </label>

      <select
        value={value || "map"}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-2xl outline-none text-sm"
        style={{
          background: "rgba(255,255,255,0.92)",
          border: "1px solid rgba(75,46,131,0.16)",
          color: colors.dark,
        }}
      >
        <option value="map">Map Pin</option>
        <option value="phone">Phone</option>
        <option value="mail">Mail</option>
        <option value="clock">Clock</option>
      </select>
    </div>
  );
}

function getContactIcon(icon) {
  if (icon === "phone") return Phone;
  if (icon === "mail") return Mail;
  if (icon === "clock") return Clock;
  return MapPin;
}

function EditorHint({ icon: Icon, title, text, color }) {
  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: "rgba(255,255,255,0.9)",
        border: "1px solid rgba(75,46,131,0.1)",
        boxShadow: "0 14px 34px rgba(15,23,42,0.06)",
      }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
        style={{ background: `${color}12`, color }}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div className="font-black text-slate-950">{title}</div>
      <div className="text-sm text-slate-500 mt-1">{text}</div>
    </div>
  );
}

function ModalShell({
  title,
  subtitle,
  icon: Icon,
  onClose,
  children,
  onSave,
  saving,
  saveLabel = "Save",
}) {
  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-5"
      style={{ background: "rgba(2,6,23,0.58)", backdropFilter: "blur(14px)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 14, scale: 0.96 }}
        transition={{ type: "spring", stiffness: 130, damping: 16 }}
        className="w-full max-w-2xl rounded-[30px] overflow-hidden max-h-[92vh] flex flex-col"
        style={{
          background: "#FFFFFF",
          border: "1px solid rgba(255,255,255,0.75)",
          boxShadow: "0 42px 110px rgba(0,0,0,0.28)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="h-1"
          style={{
            background: `linear-gradient(90deg, ${colors.gold}, ${colors.cyan}, ${colors.green})`,
          }}
        />

        <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, rgba(250,204,21,0.18), rgba(56,189,248,0.18))",
                color: colors.dark,
              }}
            >
              <Icon className="w-5 h-5" />
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-950">{title}</h3>
              <p className="text-sm text-slate-500">{subtitle}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="w-10 h-10 rounded-2xl flex items-center justify-center bg-slate-100 text-slate-600 disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">{children}</div>

        <div className="p-6 border-t border-slate-100 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="flex-1 py-3 rounded-2xl text-sm font-black transition-all hover:-translate-y-0.5 disabled:opacity-60"
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
            onClick={onSave}
            disabled={saving}
            className="flex-1 py-3 rounded-2xl text-sm font-black transition-all hover:-translate-y-0.5 disabled:opacity-60 inline-flex items-center justify-center gap-2"
            style={{
              background: `linear-gradient(135deg, ${colors.gold}, ${colors.cyan})`,
              color: "#020617",
              boxShadow: "0 16px 38px rgba(56,189,248,0.24)",
            }}
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : saveLabel}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AdminContact() {
  const navigate = useNavigate();

  const [form, setForm] = useState(defaultContactContent);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [editingTarget, setEditingTarget] = useState(null);
  const [modalForm, setModalForm] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);
  const addedIdRef = useRef(null);

  useEffect(() => {
    let alive = true;

    const loadContactContent = async () => {
      try {
        const res = await axios.get(
          "https://school-website-backend-ixx2.onrender.com/api/site-content/contact",
          { timeout: 20000 }
        );

        if (!alive) return;

        const savedContent = res.data?.data?.content || {};
        setForm(mergeContactContent(savedContent));
      } catch (err) {
        console.error("Load contact content error:", err);
        if (alive) {
          setForm(defaultContactContent);
          setError(
            "Could not load saved contact content. Default editor is shown."
          );
        }
      } finally {
        if (alive) setLoading(false);
      }
    };

    loadContactContent();

    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!addedIdRef.current) return;

    const timer = setTimeout(() => {
      const element = document.querySelector(
        `[data-contact-card-id="${addedIdRef.current}"]`
      );
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      addedIdRef.current = null;
    }, 200);

    return () => clearTimeout(timer);
  }, [form.contactInfo]);

  const selectedContactInfo = useMemo(() => {
    if (editingTarget?.type !== "contactInfo") return null;
    return form.contactInfo.find((item) => item.id === editingTarget.id) || null;
  }, [editingTarget, form.contactInfo]);

  const openHeroEditor = () => {
    setEditingTarget({ type: "hero" });
    setModalForm({
      badgeText: form.badgeText || "",
      title: form.title || "",
      highlightedText: form.highlightedText || "",
      subtitle: form.subtitle || "",
    });
  };

  const openContactInfoEditor = (id) => {
    const item = form.contactInfo.find((info) => info.id === id);
    if (!item) return;

    setEditingTarget({ type: "contactInfo", id });
    setModalForm({ ...item });
  };

  const openMapEditor = () => {
    setEditingTarget({ type: "mapCard" });
    setModalForm({ ...form.mapCard });
  };

  const openFormEditor = () => {
    setEditingTarget({ type: "form" });
    setModalForm({ ...form.form });
  };

  const closeEditor = () => {
    if (saving) return;
    setEditingTarget(null);
    setModalForm({});
  };

  const updateModalField = (name, value) => {
    setModalForm((prev) => ({ ...prev, [name]: value }));
  };

  const cleanBeforeSave = (content) => {
    const merged = mergeContactContent(content);

    return {
      ...merged,
      contactInfo: merged.contactInfo
        .map((item, index) => ({
          id: item.id || `contact-${Date.now()}-${index}`,
          icon: item.icon || "map",
          label: String(item.label || "Contact").trim() || "Contact",
          value: String(item.value || "").trim(),
          color: item.color || colors.purple,
        }))
        .filter((item) => item.label || item.value),
      mapCard: {
        ...merged.mapCard,
        title: merged.mapCard.title || "School Location",
        address: merged.mapCard.address || "",
        buttonText: merged.mapCard.buttonText || "Open in Maps",
        mapUrl: normalizeExternalUrl(merged.mapCard.mapUrl),
      },
      form: {
        ...defaultContactContent.form,
        ...(merged.form || {}),
      },
    };
  };

  async function saveContent(
    nextContent,
    successMessage = "Contact page content saved successfully."
  ) {
    setSuccess("");
    setError("");
    setSaving(true);

    try {
      const cleanContent = cleanBeforeSave(nextContent);
      const authHeaders = getAuthHeaders();

      if (!authHeaders) {
        setError("Admin login expired. Please logout and login again.");
        return null;
      }

      await axios.put(
        "https://school-website-backend-ixx2.onrender.com/api/site-content/contact",
        { content: cleanContent },
        {
          headers: authHeaders,
          timeout: 30000,
        }
      );

      setForm(cleanContent);
      setSuccess(successMessage);
      return cleanContent;
    } catch (err) {
      console.error("Save contact content error:", err);
      setError(err.response?.data?.message || "Could not save contact content.");
      return null;
    } finally {
      setSaving(false);
    }
  }

  const saveSelectedPart = async () => {
    if (!editingTarget) return;

    let nextForm = mergeContactContent(form);

    if (editingTarget.type === "hero") {
      nextForm = {
        ...nextForm,
        badgeText: modalForm.badgeText || "",
        title: modalForm.title || "",
        highlightedText: modalForm.highlightedText || "",
        subtitle: modalForm.subtitle || "",
      };
    }

    if (editingTarget.type === "contactInfo") {
      nextForm = {
        ...nextForm,
        contactInfo: nextForm.contactInfo.map((item) =>
          item.id === editingTarget.id
            ? {
                ...item,
                label: modalForm.label || "",
                icon: modalForm.icon || "map",
                value: modalForm.value || "",
                color: modalForm.color || colors.purple,
              }
            : item
        ),
      };
    }

    if (editingTarget.type === "mapCard") {
      nextForm = {
        ...nextForm,
        mapCard: {
          ...nextForm.mapCard,
          title: modalForm.title || "",
          address: modalForm.address || "",
          buttonText: modalForm.buttonText || "Open in Maps",
          mapUrl: normalizeExternalUrl(modalForm.mapUrl),
        },
      };
    }

    if (editingTarget.type === "form") {
      nextForm = {
        ...nextForm,
        form: {
          ...nextForm.form,
          ...modalForm,
        },
      };
    }

    const saved = await saveContent(
      nextForm,
      "Selected contact item saved successfully."
    );

    if (saved) {
      closeEditor();
    }
  };

  const addContactInfo = async () => {
    const newId = `contact-${Date.now()}`;
    const newItem = {
      id: newId,
      icon: "map",
      label: "New Contact",
      value: "Add contact detail here",
      color: colors.purple,
    };

    const nextForm = {
      ...mergeContactContent(form),
      contactInfo: [...form.contactInfo, newItem],
    };

    addedIdRef.current = newId;
    const saved = await saveContent(
      nextForm,
      "New contact block added. Edit it and save your changes."
    );

    if (saved) {
      setEditingTarget({ type: "contactInfo", id: newId });
      setModalForm(newItem);
    }
  };

  const requestDeleteContactInfo = (id) => {
    const item = form.contactInfo.find((info) => info.id === id);
    if (!item) return;
    setDeleteTarget(item);
  };

  const confirmDeleteContactInfo = async () => {
    if (!deleteTarget) return;

    if (form.contactInfo.length <= 1) {
      setDeleteTarget(null);
      setError("At least one contact block must remain.");
      return;
    }

    const nextForm = {
      ...mergeContactContent(form),
      contactInfo: form.contactInfo.filter(
        (item) => item.id !== deleteTarget.id
      ),
    };

    const saved = await saveContent(
      nextForm,
      "Contact block deleted successfully."
    );

    if (saved) {
      setDeleteTarget(null);
    }
  };

  const modalTitle = useMemo(() => {
    if (!editingTarget) return "";
    if (editingTarget.type === "hero") return "Edit Contact Heading";
    if (editingTarget.type === "contactInfo") {
      return selectedContactInfo
        ? `Edit ${selectedContactInfo.label}`
        : "Edit Contact Block";
    }
    if (editingTarget.type === "mapCard") return "Edit Map Card";
    if (editingTarget.type === "form") return "Edit Contact Form Text";
    return "Edit Contact";
  }, [editingTarget, selectedContactInfo]);

  const modalIcon = useMemo(() => {
    if (!editingTarget) return Pencil;
    if (editingTarget.type === "hero") return Type;
    if (editingTarget.type === "contactInfo") return getContactIcon(modalForm.icon);
    if (editingTarget.type === "mapCard") return Map;
    if (editingTarget.type === "form") return MessageSquare;
    return Pencil;
  }, [editingTarget, modalForm.icon]);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#FFF8EE" }}
      >
        <div className="text-slate-600 font-semibold">
          Loading contact editor...
        </div>
      </div>
    );
  }

  const ModalIcon = modalIcon;

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
      <style>
        {`
          .admin-contact-preview-frame {
            overflow: hidden !important;
            max-width: 100% !important;
            width: 100% !important;
            position: relative !important;
            z-index: 0 !important;
          }

          .admin-contact-preview-frame .bg-slate-950 {
            background: linear-gradient(135deg, rgba(255,255,255,0.96), rgba(248,244,255,0.95), rgba(238,247,255,0.95)) !important;
            color: #0F172A !important;
            border: 1px solid rgba(75,46,131,0.12) !important;
            box-shadow: 0 18px 44px rgba(15,23,42,0.08) !important;
          }

          .admin-contact-preview-frame .bg-slate-950 [class*="text-white"] {
            color: #0F172A !important;
          }

          .admin-contact-preview-frame .bg-slate-950 [class*="text-white/45"],
          .admin-contact-preview-frame .bg-slate-950 [class*="text-white/55"],
          .admin-contact-preview-frame .bg-slate-950 [class*="text-white/70"] {
            color: #7C5CC4 !important;
          }

          @media (max-width: 767px) {
            .admin-contact-preview-frame {
              overflow-x: hidden !important;
            }

            .admin-contact-preview-frame * {
              box-sizing: border-box !important;
            }

            .admin-contact-preview-frame .group .opacity-0,
            .admin-contact-preview-frame .group [class*="opacity-0"],
            .admin-contact-preview-frame .group .md\\:opacity-0,
            .admin-contact-preview-frame .group [class*="md:opacity-0"],
            .admin-contact-preview-frame .group [class*="group-hover:opacity"],
            .admin-contact-preview-frame [class*="group-hover:opacity"] {
              opacity: 1 !important;
              visibility: visible !important;
              pointer-events: auto !important;
            }

            .admin-contact-preview-frame .group .pointer-events-none,
            .admin-contact-preview-frame .group [class*="pointer-events-none"] {
              pointer-events: auto !important;
            }

            .admin-contact-preview-frame .group button[class*="opacity-0"],
            .admin-contact-preview-frame button[class*="group-hover:opacity"],
            .admin-contact-preview-frame button[class*="opacity-0"] {
              opacity: 1 !important;
              visibility: visible !important;
              pointer-events: auto !important;
            }

            .admin-contact-preview-frame [data-contact-card-id] {
              position: relative !important;
              padding-top: 3.2rem !important;
              padding-right: 1rem !important;
              overflow: hidden !important;
            }

            .admin-contact-preview-frame [data-contact-card-id] * {
              min-width: 0 !important;
            }

            .admin-contact-preview-frame [data-contact-card-id] p,
            .admin-contact-preview-frame [data-contact-card-id] span,
            .admin-contact-preview-frame [data-contact-card-id] div {
              word-break: normal !important;
              overflow-wrap: break-word !important;
              white-space: normal !important;
              writing-mode: horizontal-tb !important;
              text-orientation: mixed !important;
            }

            .admin-contact-preview-frame [data-contact-card-id] [class*="tracking"] {
              letter-spacing: 0.06em !important;
              white-space: normal !important;
              word-break: normal !important;
              overflow-wrap: normal !important;
            }

            .admin-contact-preview-frame [data-contact-card-id] [class*="absolute"] {
              top: 0.75rem !important;
              right: 0.75rem !important;
              left: auto !important;
              display: flex !important;
              flex-direction: row !important;
              align-items: center !important;
              justify-content: flex-end !important;
              gap: 0.4rem !important;
              width: auto !important;
              max-width: calc(100% - 1.5rem) !important;
              z-index: 35 !important;
              pointer-events: auto !important;
            }

            .admin-contact-preview-frame [class*="absolute"] button,
            .admin-contact-preview-frame button[class*="rounded-full"] {
              min-width: 2.15rem !important;
              width: 2.15rem !important;
              height: 2.15rem !important;
              padding: 0 !important;
              border-radius: 9999px !important;
              font-size: 0 !important;
              display: inline-flex !important;
              align-items: center !important;
              justify-content: center !important;
              gap: 0 !important;
              white-space: nowrap !important;
              z-index: 35 !important;
              pointer-events: auto !important;
              cursor: pointer !important;
              flex-shrink: 0 !important;
            }

            .admin-contact-preview-frame [class*="absolute"] button svg,
            .admin-contact-preview-frame button[class*="rounded-full"] svg {
              width: 0.95rem !important;
              height: 0.95rem !important;
              margin: 0 !important;
              flex-shrink: 0 !important;
              pointer-events: none !important;
            }

            .admin-contact-preview-frame input,
            .admin-contact-preview-frame textarea,
            .admin-contact-preview-frame select {
              width: 100% !important;
              max-width: 100% !important;
            }

            .admin-contact-preview-frame [class*="lg:grid-cols"],
            .admin-contact-preview-frame [class*="md:grid-cols"] {
              grid-template-columns: minmax(0, 1fr) !important;
            }
          }
        `}
      </style>

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
  <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate("/admin/dashboard")}
            className="inline-flex items-center gap-2 font-black transition-all hover:-translate-x-1"
            style={{ color: colors.dark }}
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/admin/contact-messages")}
              className="hidden md:inline-flex items-center gap-2 px-4 py-3 rounded-2xl font-black transition-all hover:scale-105"
              style={{
                color: colors.dark,
                background: "rgba(255,255,255,0.72)",
                border: "1px solid rgba(75,46,131,0.12)",
                boxShadow: "0 10px 26px rgba(15,23,42,0.06)",
              }}
            >
              <Inbox className="w-4 h-4" />
              Messages
            </button>

            <a
              href="/contact"
              target="_blank"
              rel="noreferrer"
              className="hidden md:inline-flex items-center gap-2 px-4 py-3 rounded-2xl font-black transition-all hover:scale-105"
              style={{
                color: colors.dark,
                background: "rgba(255,255,255,0.72)",
                border: "1px solid rgba(75,46,131,0.12)",
                boxShadow: "0 10px 26px rgba(15,23,42,0.06)",
              }}
            >
              <ExternalLink className="w-4 h-4" />
              View Contact Page
            </a>

            <button
              type="button"
              onClick={() => saveContent(form)}
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-black transition-all hover:scale-105 disabled:opacity-60"
              style={{
                color: "#020617",
                background: `linear-gradient(135deg, ${colors.gold}, ${colors.cyan})`,
                boxShadow:
                  "0 18px 42px rgba(56,189,248,0.24), inset 0 1px 0 rgba(255,255,255,0.45)",
              }}
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-3 sm:px-6 py-6 sm:py-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8 rounded-[28px] sm:rounded-[34px] p-5 md:p-8"
          style={lightAdminPanelStyle}
        >
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-black mb-5"
            style={{
              background: "rgba(215,25,32,0.08)",
              color: colors.red,
              border: "1px solid rgba(215,25,32,0.18)",
            }}
          >
            <ContactIcon className="w-4 h-4" />
            Visual Contact Editor
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
            Edit Contact Page
          </h1>

          <p className="text-slate-500 max-w-3xl text-lg">
            Hover the real Contact page below. Edit heading, contact cards, map
            card, and form text directly from the visual preview.
          </p>
        </motion.div>

        {success && (
          <div className="mb-6 rounded-2xl px-5 py-4 flex items-center gap-3 font-semibold bg-green-50 text-green-700 border border-green-100">
            <CheckCircle2 className="w-5 h-5" />
            {success}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-2xl px-5 py-4 flex items-center gap-3 font-semibold bg-red-50 text-red-700 border border-red-100">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <EditorHint
            icon={Type}
            title="Heading"
            text="Hover title area and click edit."
            color={colors.red}
          />
          <EditorHint
            icon={MapPin}
            title="Contact Blocks"
            text="Add, edit, or delete info cards."
            color={colors.green}
          />
          <EditorHint
            icon={Map}
            title="Map"
            text="Edit location text and Google Maps link."
            color={colors.purple}
          />
          <EditorHint
            icon={MessageSquare}
            title="Form Text"
            text="Edit labels, placeholders, and messages."
            color={colors.gold}
          />
        </div>

        <div
          className="admin-contact-preview-frame rounded-[24px] sm:rounded-[34px] overflow-hidden"
          style={{
            border: "1px solid rgba(15,23,42,0.08)",
            boxShadow: "0 24px 70px rgba(11,16,32,0.12)",
            background: "#FFFFFF",
          }}
        >
          <Contact
            editMode
            contentOverride={form}
            onEditHero={openHeroEditor}
            onEditContactInfo={openContactInfoEditor}
            onDeleteContactInfo={requestDeleteContactInfo}
            onAddContactInfo={addContactInfo}
            onEditMap={openMapEditor}
            onEditForm={openFormEditor}
          />
        </div>
      </main>

      <AnimatePresence>
        {editingTarget && (
          <ModalShell
            title={modalTitle}
            subtitle="Save only this selected contact item."
            icon={ModalIcon}
            onClose={closeEditor}
            onSave={saveSelectedPart}
            saving={saving}
            saveLabel="Save Item"
          >
            {editingTarget.type === "hero" && (
              <div className="grid gap-5">
                <Field
                  label="Small Badge Text"
                  value={modalForm.badgeText}
                  onChange={(value) => updateModalField("badgeText", value)}
                />

                <Field
                  label="Main Title"
                  value={modalForm.title}
                  onChange={(value) => updateModalField("title", value)}
                />

                <Field
                  label="Purple Italic Highlight Text"
                  value={modalForm.highlightedText}
                  onChange={(value) =>
                    updateModalField("highlightedText", value)
                  }
                  placeholder="Example: Hear From You"
                />

                <TextArea
                  label="Subtitle"
                  value={modalForm.subtitle}
                  onChange={(value) => updateModalField("subtitle", value)}
                  rows={4}
                />
              </div>
            )}

            {editingTarget.type === "contactInfo" && (
              <div className="grid gap-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <Field
                    label="Label"
                    value={modalForm.label}
                    onChange={(value) => updateModalField("label", value)}
                  />

                  <IconSelect
                    value={modalForm.icon}
                    onChange={(value) => updateModalField("icon", value)}
                  />
                </div>

                <Field
                  label="Icon Color"
                  type="color"
                  value={modalForm.color || colors.purple}
                  onChange={(value) => updateModalField("color", value)}
                />

                <TextArea
                  label="Value"
                  value={modalForm.value}
                  onChange={(value) => updateModalField("value", value)}
                  rows={5}
                />
              </div>
            )}

            {editingTarget.type === "mapCard" && (
              <div className="grid gap-5">
                <Field
                  label="Map Card Title"
                  value={modalForm.title}
                  onChange={(value) => updateModalField("title", value)}
                />

                <Field
                  label="Map Card Address"
                  value={modalForm.address}
                  onChange={(value) => updateModalField("address", value)}
                />

                <Field
                  label="Button Text"
                  value={modalForm.buttonText}
                  onChange={(value) => updateModalField("buttonText", value)}
                />

                <div>
                  <Field
                    label="Google Map Link"
                    value={modalForm.mapUrl}
                    onChange={(value) => updateModalField("mapUrl", value)}
                    placeholder="Paste full Google Maps link, example: https://maps.app.goo.gl/..."
                  />
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    Paste the full link with https://. If admin pastes
                    maps.app.goo.gl or google.com/maps without https://, it will
                    be fixed automatically while saving.
                  </p>
                </div>
              </div>
            )}

            {editingTarget.type === "form" && (
              <div className="grid gap-5">
                <Field
                  label="Form Title"
                  value={modalForm.title}
                  onChange={(value) => updateModalField("title", value)}
                />

                <div className="grid md:grid-cols-2 gap-5">
                  <Field
                    label="Name Label"
                    value={modalForm.nameLabel}
                    onChange={(value) => updateModalField("nameLabel", value)}
                  />
                  <Field
                    label="Name Placeholder"
                    value={modalForm.namePlaceholder}
                    onChange={(value) =>
                      updateModalField("namePlaceholder", value)
                    }
                  />
                  <Field
                    label="Email Label"
                    value={modalForm.emailLabel}
                    onChange={(value) => updateModalField("emailLabel", value)}
                  />
                  <Field
                    label="Email Placeholder"
                    value={modalForm.emailPlaceholder}
                    onChange={(value) =>
                      updateModalField("emailPlaceholder", value)
                    }
                  />
                  <Field
                    label="Phone Label"
                    value={modalForm.phoneLabel}
                    onChange={(value) => updateModalField("phoneLabel", value)}
                  />
                  <Field
                    label="Phone Placeholder"
                    value={modalForm.phonePlaceholder}
                    onChange={(value) =>
                      updateModalField("phonePlaceholder", value)
                    }
                  />
                  <Field
                    label="Subject Label"
                    value={modalForm.subjectLabel}
                    onChange={(value) =>
                      updateModalField("subjectLabel", value)
                    }
                  />
                  <Field
                    label="Subject Placeholder"
                    value={modalForm.subjectPlaceholder}
                    onChange={(value) =>
                      updateModalField("subjectPlaceholder", value)
                    }
                  />
                  <Field
                    label="Message Label"
                    value={modalForm.messageLabel}
                    onChange={(value) =>
                      updateModalField("messageLabel", value)
                    }
                  />
                  <Field
                    label="Button Text"
                    value={modalForm.buttonText}
                    onChange={(value) => updateModalField("buttonText", value)}
                  />
                  <Field
                    label="Sending Text"
                    value={modalForm.sendingText}
                    onChange={(value) =>
                      updateModalField("sendingText", value)
                    }
                  />
                  <Field
                    label="Success Message"
                    value={modalForm.successMessage}
                    onChange={(value) =>
                      updateModalField("successMessage", value)
                    }
                  />
                </div>

                <TextArea
                  label="Message Placeholder"
                  value={modalForm.messagePlaceholder}
                  onChange={(value) =>
                    updateModalField("messagePlaceholder", value)
                  }
                  rows={4}
                />

                <Field
                  label="Error Message"
                  value={modalForm.errorMessage}
                  onChange={(value) => updateModalField("errorMessage", value)}
                />
              </div>
            )}
          </ModalShell>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-5"
            style={{
              background: "rgba(2,6,23,0.58)",
              backdropFilter: "blur(14px)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDeleteTarget(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14, scale: 0.96 }}
              className="w-full max-w-md rounded-[30px] bg-white p-7"
              style={{ boxShadow: "0 42px 110px rgba(0,0,0,0.28)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 bg-red-50 text-red-600 border border-red-100">
                <Trash2 className="w-6 h-6" />
              </div>

              <h3 className="text-2xl font-black text-slate-950 mb-2">
                Delete this contact block?
              </h3>

              <p className="text-sm text-slate-500 mb-6">
                This will remove <b>{deleteTarget.label}</b> from the public
                Contact page after saving.
              </p>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  disabled={saving}
                  className="flex-1 py-3 rounded-2xl text-sm font-black bg-slate-100 text-slate-600 disabled:opacity-60"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={confirmDeleteContactInfo}
                  disabled={saving}
                  className="flex-1 py-3 rounded-2xl text-sm font-black text-white disabled:opacity-60"
                  style={{
                    background: `linear-gradient(135deg, ${colors.red}, #9B1117)`,
                  }}
                >
                  {saving ? "Deleting..." : "Yes, Delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}


