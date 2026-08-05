import { useEffect, useMemo, useState } from "react";
import api from "../lib/api";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  UploadCloud,
  CheckCircle2,
  Eye,
  EyeOff,
  Calendar,
  X,
  Megaphone,
  Edit2,
  Sparkles,
  Zap,
  AlertTriangle,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

// ── THEME TO MATCH LIGHT DASHBOARD ──
const theme = {
  bg: "#F5F7FB",
  card: "#FFFFFF",
  cardHover: "#FFFFFF",
  border: "#E5E7EB",
  borderHover: "#CBD5E1",
  text: "#0F172A",
  muted: "#64748B",
  primary: "#2563EB",
  accent: "#38BDF8",
  success: "#16A34A",
  warning: "#F59E0B",
  danger: "#EF4444",
};

const colors = {
  red: "#EF4444",
  green: "#22C55E",
  purple: "#A78BFA",
  gold: "#FACC15",
  cyan: "#22D3EE",
  dark: "#0B1020",
};

function getTime(item) {
  const time = new Date(item?.created_at || 0).getTime();
  return Number.isNaN(time) ? 0 : time;
}

function hasManualPopupOrder(list) {
  return list.some(
    (item) => item.popup_order !== null && item.popup_order !== undefined
  );
}

function sortAnnouncements(list) {
  const items = [...list];

  if (hasManualPopupOrder(items)) {
    return items.sort((a, b) => {
      const aOrder =
        a.popup_order === null || a.popup_order === undefined
          ? Number.MAX_SAFE_INTEGER
          : Number(a.popup_order);

      const bOrder =
        b.popup_order === null || b.popup_order === undefined
          ? Number.MAX_SAFE_INTEGER
          : Number(b.popup_order);

      if (aOrder !== bOrder) return aOrder - bOrder;
      return getTime(b) - getTime(a);
    });
  }

  return items.sort((a, b) => getTime(b) - getTime(a));
}

function Field({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
  required = false,
  icon: Icon,
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          type={type}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 rounded-xl outline-none text-sm transition-all focus:ring-2 focus:ring-blue-500/50"
          style={{
            background: "#FFFFFF",
            border: "1px solid #D1D5DB",
            color: "#0F172A",
            paddingLeft: Icon ? "44px" : "16px",
          }}
        />
      </div>
    </div>
  );
}

function TextArea({ label, value, onChange, placeholder = "", rows = 4 }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-slate-700">
        {label}
      </label>
      <textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-4 py-3 rounded-xl outline-none text-sm resize-none transition-all focus:ring-2 focus:ring-blue-500/50"
        style={{
          background: "#FFFFFF",
          border: "1px solid #D1D5DB",
          color: "#0F172A",
        }}
      />
    </div>
  );
}

function EditorCard({ icon: Icon, title, color, children }) {
  return (
    <div
      className="rounded-2xl p-5 sm:p-6 md:p-8 transition-all duration-300 hover:shadow-xl border"
      style={{
        background: "#FFFFFF",
        borderColor: "#E5E7EB",
        boxShadow: "0 15px 35px rgba(15,23,42,.08)",
      }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl" style={{ background: `${color}15` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}

function AnnouncementCard({
  announcement,
  onDelete,
  onToggleVisibility,
  onEdit,
}) {
  const hasImage = announcement.image_url && announcement.image_url !== "";

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border"
      style={{
        background: "#FFFFFF",
        borderColor: "#E5E7EB",
        opacity: announcement.visible !== false ? 1 : 0.6,
      }}
    >
      {hasImage && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={announcement.image_url}
            alt={announcement.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center gap-2">
            <span
              className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold text-white"
              style={{
                background: "rgba(239, 68, 68, 0.85)",
              }}
            >
              <Zap className="w-3 h-3" />
              {announcement.active !== false ? "Active" : "Inactive"}
            </span>

            {announcement.show_on_homepage && (
              <span
                className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold text-slate-900"
                style={{
                  background: "rgba(250, 204, 21, 0.9)",
                }}
              >
                <Sparkles className="w-3 h-3" />
                Homepage Popup
              </span>
            )}

            {announcement.popup_order !== null &&
              announcement.popup_order !== undefined && (
                <span
                  className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold text-white"
                  style={{
                    background: "rgba(15, 23, 42, 0.9)",
                  }}
                >
                  Order #{announcement.popup_order}
                </span>
              )}
          </div>
        </div>
      )}

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-slate-900">
              {announcement.title || "Untitled"}
            </h3>
            <p className="text-sm text-slate-600 mt-1 line-clamp-2">
              {announcement.description || "No description"}
            </p>
            <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {announcement.created_at
                  ? new Date(announcement.created_at).toLocaleDateString()
                  : "No date"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => onEdit(announcement)}
              className="p-2 rounded-xl transition-all hover:scale-110"
              style={{
                background: "rgba(167, 139, 250, 0.15)",
                color: colors.purple,
              }}
              title="Edit"
            >
              <Edit2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onToggleVisibility(announcement)}
              className="p-2 rounded-xl transition-all hover:scale-110"
              style={{
                background:
                  announcement.visible !== false
                    ? "rgba(34, 197, 94, 0.15)"
                    : "rgba(255,255,255,0.5)",
                color:
                  announcement.visible !== false ? colors.green : "#64748B",
              }}
              title={announcement.visible !== false ? "Visible" : "Hidden"}
            >
              {announcement.visible !== false ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
            </button>

            <button
              type="button"
              onClick={() => onDelete(announcement)}
              className="p-2 rounded-xl transition-all hover:scale-110"
              style={{
                background: "rgba(239, 68, 68, 0.15)",
                color: colors.red,
              }}
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PopupOrderManager({ popupAnnouncements, onMove }) {
  return (
    <EditorCard
      icon={Sparkles}
      title="Homepage Popup Order"
      color={colors.gold}
    >
      {popupAnnouncements.length === 0 ? (
        <div className="rounded-2xl p-6 text-center border bg-slate-50" style={{ borderColor: "#E5E7EB" }}>
          <Megaphone className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <p className="font-bold text-slate-700">
            No homepage popup announcement.
          </p>
          <p className="text-sm text-slate-500 mt-1">
            Turn on Active, Visible, and Show on homepage.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-slate-600 leading-relaxed">
            First item pops up first. When user closes it, the next popup opens.
            If you never arrange, latest announcement comes first.
          </p>

          {popupAnnouncements.map((item, index) => (
            <div
              key={item.id}
              className="rounded-2xl p-4 border flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50"
              style={{ borderColor: "#E5E7EB" }}
            >
              <div className="min-w-0">
                <div className="text-xs font-bold uppercase tracking-[0.16em] text-yellow-600 mb-1">
                  Popup #{index + 1}
                </div>
                <div className="font-bold text-slate-900 truncate">
                  {item.title || "Untitled announcement"}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {item.created_at
                    ? new Date(item.created_at).toLocaleDateString()
                    : "No date"}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => onMove(item.id, "up")}
                  className="px-4 py-2 rounded-xl text-sm font-bold disabled:opacity-40 text-slate-700 hover:bg-slate-200 transition-colors bg-slate-100"
                >
                  Up
                </button>
                <button
                  type="button"
                  disabled={index === popupAnnouncements.length - 1}
                  onClick={() => onMove(item.id, "down")}
                  className="px-4 py-2 rounded-xl text-sm font-bold disabled:opacity-40 text-slate-700 hover:bg-slate-200 transition-colors bg-slate-100"
                >
                  Down
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </EditorCard>
  );
}

function AnnouncementPreview({ announcements }) {
  const visible = sortAnnouncements(
    announcements.filter(
      (a) =>
        a.visible !== false &&
        a.active !== false &&
        a.show_on_homepage === true
    )
  );

  return (
    <div className="min-h-full p-5 sm:p-6">
      <div className="text-center mb-6">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-3"
          style={{
            background: "rgba(239, 68, 68, 0.1)",
            color: colors.red,
            border: "1px solid rgba(239, 68, 68, 0.15)",
          }}
        >
          <Megaphone className="w-4 h-4" />
          Popup Preview
        </div>

        <h3 className="text-2xl text-slate-900 font-bold tracking-tight">
          Homepage Popup Order
        </h3>

        <p className="mt-2 text-slate-600 text-sm">
          User will see these one by one.
        </p>
      </div>

      {visible.length === 0 ? (
        <div
          className="rounded-2xl p-8 text-center bg-slate-50"
          style={{
            border: "1px dashed #CBD5E1",
          }}
        >
          <Megaphone className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <p className="text-slate-600 font-medium">No popup selected</p>
          <p className="text-sm text-slate-500">
            Active + Visible + Show on homepage is required.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {visible.map((item, index) => (
            <div
              key={item.id}
              className="rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 shadow-sm border bg-white"
              style={{
                borderColor: "#E5E7EB",
              }}
            >
              {item.image_url && (
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-40 object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              )}
              <div className="p-4">
                <div className="text-xs font-bold uppercase tracking-[0.16em] text-red-500 mb-1">
                  Popup #{index + 1}
                </div>
                <div className="font-bold text-slate-900">{item.title}</div>
                <p className="text-slate-600 text-sm mt-1 line-clamp-2">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DeleteConfirmModal({ item, deleting, onCancel, onConfirm }) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div
        className="w-full max-w-md rounded-3xl p-6 shadow-2xl border"
        style={{
          background: "#FFFFFF",
          borderColor: "#E5E7EB",
          boxShadow: "0 28px 80px rgba(0,0,0,0.15)",
        }}
      >
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600 border border-red-100">
            <AlertTriangle className="h-6 w-6" />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-xl font-bold text-slate-900">
              Delete announcement?
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              This action cannot be undone. This will permanently delete:
            </p>

            <p className="mt-3 rounded-2xl bg-slate-50 border px-4 py-3 text-sm font-bold text-slate-800" style={{ borderColor: "#E5E7EB" }}>
              {item.title || "Untitled announcement"}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            className="rounded-xl px-5 py-3 text-sm font-bold text-slate-600 transition-all hover:bg-slate-100 disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="rounded-xl px-5 py-3 text-sm font-bold text-white transition-all hover:scale-[1.02] disabled:opacity-60"
            style={{
              background: `linear-gradient(135deg, #2563EB, #3B82F6)`,
              boxShadow: "0 8px 24px rgba(37,99,235,0.25)",
            }}
          >
            {deleting ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminAnnouncements() {
  const navigate = useNavigate();

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [ordering, setOrdering] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    image_url: "",
    description: "",
    active: true,
    visible: true,
    show_on_homepage: true,
    popup_order: null,
  });

  const [imageFile, setImageFile] = useState(null);

  const popupAnnouncements = useMemo(
    () =>
      sortAnnouncements(
        announcements.filter(
          (item) =>
            item.active !== false &&
            item.visible !== false &&
            item.show_on_homepage === true
        )
      ),
    [announcements]
  );

  const fetchAnnouncements = async () => {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 8000);

    try {
      const res = await fetch(`${API_URL}/api/announcements`, {
        signal: controller.signal,
      });
      const data = await res.json();

      if (data.success) {
        setAnnouncements(sortAnnouncements(data.data || []));
      } else {
        setAnnouncements([]);
      }
    } catch (err) {
      if (err?.name !== "AbortError") {
        console.error("Fetch announcements error:", err);
      }
      setError("Could not load announcements. Default empty editor is shown.");
    } finally {
      window.clearTimeout(timer);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const resetForm = () => {
    setFormData({
      title: "",
      image_url: "",
      description: "",
      active: true,
      visible: true,
      show_on_homepage: true,
      popup_order: null,
    });
    setImageFile(null);
    setImagePreview(null);
    setEditingId(null);
    setSuccess("");
    setError("");
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      title: item.title || "",
      image_url: item.image_url || "",
      description: item.description || "",
      active: item.active !== false,
      visible: item.visible !== false,
      show_on_homepage: item.show_on_homepage !== false,
      popup_order:
        item.popup_order === null || item.popup_order === undefined
          ? null
          : item.popup_order,
    });
    setImageFile(null);
    setImagePreview(item.image_url || null);
    setSuccess("");
    setError("");
  };

  const handleDelete = (item) => {
    setDeleteTarget(item);
  };

  const confirmDelete = async () => {
    if (!deleteTarget?.id) return;

    setDeleting(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${API_URL}/api/announcements/${deleteTarget.id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        setSuccess("Announcement deleted successfully.");
        if (editingId === deleteTarget.id) resetForm();
        setDeleteTarget(null);
        fetchAnnouncements();
      } else {
        setError(data.message || "Could not delete announcement.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      setError("Could not delete announcement.");
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleVisibility = async (item) => {
    const newVisibility = item.visible !== false ? false : true;

    try {
      const res = await fetch(`${API_URL}/api/announcements/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...item, visible: newVisibility }),
      });

      const data = await res.json();

      if (data.success) {
        fetchAnnouncements();
      } else {
        setError(data.message || "Could not update visibility.");
      }
    } catch (err) {
      console.error("Toggle visibility error:", err);
      setError("Could not update visibility.");
    }
  };

  const handleMovePopup = async (id, direction) => {
    if (ordering) return;

    const currentIndex = popupAnnouncements.findIndex((item) => item.id === id);
    if (currentIndex === -1) return;

    const nextIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (nextIndex < 0 || nextIndex >= popupAnnouncements.length) return;

    const nextList = [...popupAnnouncements];
    const temp = nextList[currentIndex];
    nextList[currentIndex] = nextList[nextIndex];
    nextList[nextIndex] = temp;

    const orders = nextList.map((item, index) => ({
      id: item.id,
      popup_order: index + 1,
    }));

    setOrdering(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${API_URL}/api/announcements/popup-order`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orders }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess("Homepage popup order updated.");
        fetchAnnouncements();
      } else {
        setError(data.message || "Could not update popup order.");
      }
    } catch (err) {
      console.error("Popup order update error:", err);
      setError("Could not update popup order.");
    } finally {
      setOrdering(false);
    }
  };

  const uploadImage = async (file) => {
    if (!file) return null;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    const maxSize = 6 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      setError("Please upload only PNG, JPG, WebP, or GIF images.");
      return null;
    }

    if (file.size > maxSize) {
      setError("Image must be less than 6 MB.");
      return null;
    }

    setUploading(true);
    setError("");

    try {
      const imageFormData = new FormData();
      imageFormData.append("file", file);

      const res = await axios.post(`${API_URL}/api/upload`, imageFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const uploadedUrl =
        res.data?.url ||
        res.data?.imageUrl ||
        res.data?.fileUrl ||
        res.data?.data?.url ||
        res.data?.data?.imageUrl ||
        res.data?.data?.fileUrl ||
        res.data?.secure_url ||
        res.data?.data?.secure_url;

      if (!uploadedUrl) {
        setError("Image uploaded but URL not returned.");
        return null;
      }

      return uploadedUrl;
    } catch (err) {
      console.error("Image upload error:", err);
      setError(err.response?.data?.message || "Image upload failed.");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setFormData({ ...formData, image_url: "Uploading..." });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      let imageUrl = formData.image_url;

      if (imageFile) {
        const uploadedUrl = await uploadImage(imageFile);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else {
          setSaving(false);
          return;
        }
      }

      if (imageUrl === "Uploading...") {
        setError("Image upload failed. Please try again.");
        setSaving(false);
        return;
      }

      const announcementData = {
        title: formData.title,
        image_url: imageUrl || "",
        description: formData.description,
        active: formData.active,
        visible: formData.visible,
        show_on_homepage: formData.show_on_homepage,
        popup_order:
          formData.popup_order === "" ||
          formData.popup_order === null ||
          formData.popup_order === undefined
            ? null
            : Number(formData.popup_order),
      };

      const url = editingId
        ? `${API_URL}/api/announcements/${editingId}`
        : `${API_URL}/api/announcements`;

      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(announcementData),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(
          editingId
            ? "Announcement updated successfully."
            : "Announcement added successfully."
        );
        resetForm();
        fetchAnnouncements();
      } else {
        setError(data.message || "Could not save announcement.");
      }
    } catch (err) {
      console.error("Save announcement error:", err);
      setError("Could not save announcement.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: theme.bg }}
      >
        <div className="text-slate-600 font-medium">
          Loading announcements...
        </div>
      </div>
    );
  }

  return (
    <section
      className="admin-announcements-editor min-h-screen relative"
      style={{
        background:
          "linear-gradient(135deg,#F8FAFC 0%,#EEF4FF 50%,#F5F7FB 100%)",
      }}
    >
      <header
        className="relative z-0 sticky top-0 border-b"
        style={{
          background: "#FFFFFF",
          borderColor: "#E5E7EB",
        }}
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate("/admin/dashboard")}
            className="inline-flex w-fit items-center gap-2 font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-2xl p-6 border"
          style={{
            background:
              "linear-gradient(135deg,#FFFFFF,#EFF6FF)",
            borderColor: "#E5E7EB",
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium"
              style={{
                background: "rgba(239, 68, 68, 0.1)",
                color: colors.red,
                border: "1px solid rgba(239, 68, 68, 0.15)",
              }}
            >
              <Megaphone className="w-4 h-4" />
              Manage Announcements
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Announcement Manager
          </h1>

          <p className="text-slate-600 max-w-3xl text-base">
            Add, edit, and manage homepage popup announcements. Drag-free order
            control is available using Up and Down buttons.
          </p>
        </motion.div>

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-xl px-5 py-4 flex items-center gap-3 font-medium bg-green-50 text-green-700 border border-green-200"
          >
            <CheckCircle2 className="w-5 h-5" />
            {success}
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-xl px-5 py-4 font-medium bg-red-50 text-red-700 border border-red-200"
          >
            {error}
          </motion.div>
        )}

        <div className="grid xl:grid-cols-[780px_1fr] gap-8 items-start">
          <div className="space-y-8">
            <EditorCard
              icon={editingId ? Edit2 : Plus}
              title={editingId ? "Edit Announcement" : "Add New Announcement"}
              color={colors.red}
            >
              <form onSubmit={handleSubmit} className="space-y-5">
                <Field
                  label="Announcement Title"
                  value={formData.title}
                  onChange={(value) =>
                    setFormData({ ...formData, title: value })
                  }
                  placeholder="e.g., Vacancy Announcement 2026"
                  required
                  icon={Edit2}
                />

                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700">
                    Image / Banner
                  </label>
                  <div
                    className="rounded-2xl p-4 transition-all hover:border-blue-300"
                    style={{
                      background: "#F8FAFC",
                      border: "2px dashed #CBD5E1",
                    }}
                  >
                    {(imagePreview || formData.image_url) &&
                    formData.image_url !== "Uploading..." ? (
                      <div className="space-y-3">
                        <div className="relative rounded-xl overflow-hidden">
                          <img
                            src={imagePreview || formData.image_url}
                            alt="Announcement"
                            className="w-full h-48 object-cover"
                            onError={(e) => {
                              e.target.src =
                                "https://via.placeholder.com/400x300?text=No+Image";
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, image_url: "" });
                              setImagePreview(null);
                              setImageFile(null);
                            }}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center gap-2 cursor-pointer py-6 hover:bg-slate-100/50 rounded-xl transition-colors">
                        <div
                          className="p-3 rounded-full"
                          style={{ background: "rgba(167, 139, 250, 0.1)" }}
                        >
                          <UploadCloud
                            className="w-8 h-8"
                            style={{ color: colors.purple }}
                          />
                        </div>
                        <span className="text-sm font-bold text-slate-700">
                          {uploading ? "Uploading..." : "Click to Upload Image"}
                        </span>
                        <span className="text-xs text-slate-500">
                          PNG, JPG, WebP, GIF • Max 6MB
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          disabled={uploading}
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  {imageFile && formData.image_url === "Uploading..." && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle2 className="w-4 h-4" />
                      Selected: {imageFile.name}
                    </div>
                  )}
                </div>

                <TextArea
                  label="Description"
                  value={formData.description}
                  onChange={(value) =>
                    setFormData({ ...formData, description: value })
                  }
                  placeholder="Write the announcement details here..."
                  rows={5}
                />

                <div
                  className="flex flex-wrap items-center gap-6 p-4 rounded-2xl bg-slate-50 border"
                  style={{ borderColor: "#E5E7EB" }}
                >
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          active: e.target.checked,
                        })
                      }
                      className="w-4 h-4 accent-red-500"
                    />
                    Active
                  </label>

                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.visible}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          visible: e.target.checked,
                        })
                      }
                      className="w-4 h-4 accent-green-500"
                    />
                    Visible on website
                  </label>

                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.show_on_homepage}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          show_on_homepage: e.target.checked,
                        })
                      }
                      className="w-4 h-4 accent-yellow-500"
                    />
                    Show as homepage popup
                  </label>
                </div>

                <div className="flex items-center gap-3 pt-4">
                  {editingId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-6 py-3 rounded-xl font-bold transition-all hover:scale-105 text-slate-600 hover:bg-slate-100"
                      style={{
                        background: "transparent",
                        border: "1px solid #E5E7EB",
                      }}
                    >
                      Cancel
                    </button>
                  )}

                  <button
                    type="submit"
                    disabled={saving || uploading}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all hover:scale-105 disabled:opacity-60 text-white"
                    style={{
                      background: `linear-gradient(135deg, #2563EB, #3B82F6)`,
                      boxShadow: "0 8px 24px rgba(37,99,235,0.25)",
                    }}
                  >
                    <Save className="w-4 h-4" />
                    {saving
                      ? "Saving..."
                      : editingId
                      ? "Update Announcement"
                      : "Add Announcement"}
                  </button>
                </div>
              </form>
            </EditorCard>

            <PopupOrderManager
              popupAnnouncements={popupAnnouncements}
              onMove={handleMovePopup}
            />

            <EditorCard
              icon={Megaphone}
              title="All Announcements"
              color={colors.green}
            >
              <div className="space-y-4">
                {announcements.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <Megaphone className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                    <p className="font-semibold text-lg text-slate-700">
                      No announcements added yet
                    </p>
                    <p className="text-sm text-slate-500">
                      Add your first announcement using the form.
                    </p>
                  </div>
                ) : (
                  announcements.map((item) => (
                    <AnnouncementCard
                      key={item.id}
                      announcement={item}
                      onDelete={handleDelete}
                      onToggleVisibility={handleToggleVisibility}
                      onEdit={handleEdit}
                    />
                  ))
                )}
              </div>
            </EditorCard>
          </div>

          <aside
            className="xl:sticky xl:top-28 rounded-2xl overflow-hidden border"
            style={{
              background: "#FFFFFF",
              borderColor: "#E5E7EB",
            }}
          >
            <div
              className="p-5 border-b"
              style={{
                borderColor: "#E5E7EB",
              }}
            >
              <div
                className="font-bold text-lg flex items-center gap-2 text-slate-900"
              >
                <div
                  className="p-1.5 rounded-lg"
                  style={{
                    background: "rgba(167, 139, 250, 0.1)",
                    color: colors.purple,
                  }}
                >
                  <Eye className="w-5 h-5" />
                </div>
                Homepage Preview
              </div>
              <div className="text-sm text-slate-600">
                Preview popup sequence order.
              </div>
            </div>

            <div className="overflow-y-auto" style={{ height: "600px" }}>
              <AnnouncementPreview announcements={announcements} />
            </div>
          </aside>
        </div>
      </main>

      <DeleteConfirmModal
        item={deleteTarget}
        deleting={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </section>
  );
}