import { useEffect, useMemo, useState } from "react";
import axios from "axios";
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

const API_URL = "https://school-website-backend-ixx2.onrender.com";

const colors = {
  red: "#D71920",
  green: "#168A3A",
  purple: "#4B2E83",
  dark: "#0B1020",
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
      <label className="block text-sm font-bold mb-2 text-slate-700">
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
          className="w-full px-4 py-3 rounded-2xl outline-none text-sm transition-all focus:ring-2 focus:ring-red-200"
          style={{
            background: "rgba(255,255,255,0.88)",
            border: "1px solid rgba(75,46,131,0.16)",
            color: colors.dark,
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
      <label className="block text-sm font-bold mb-2 text-slate-700">
        {label}
      </label>
      <textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-4 py-3 rounded-2xl outline-none text-sm resize-none transition-all focus:ring-2 focus:ring-red-200"
        style={{
          background: "rgba(255,255,255,0.88)",
          border: "1px solid rgba(75,46,131,0.16)",
          color: colors.dark,
        }}
      />
    </div>
  );
}

function EditorCard({ icon: Icon, title, color, children, gradient }) {
  return (
    <div
      className="rounded-3xl p-5 sm:p-6 md:p-8 transition-all duration-300 hover:shadow-xl"
      style={{
        background:
          gradient ||
          "linear-gradient(145deg, rgba(255,255,255,0.96), rgba(255,255,255,0.78))",
        border: "1px solid rgba(11,16,32,0.08)",
        boxShadow:
          "0 18px 48px rgba(11,16,32,0.075), inset 0 1px 0 rgba(255,255,255,0.85)",
      }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl" style={{ background: `${color}15` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
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
      className="rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      style={{
        background: "rgba(255,255,255,0.9)",
        border: "1px solid rgba(75,46,131,0.10)",
        boxShadow: "0 12px 32px rgba(11,16,32,0.06)",
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center gap-2">
            <span
              className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold"
              style={{
                background: "rgba(215,25,32,0.9)",
                color: "#fff",
              }}
            >
              <Zap className="w-3 h-3" />
              {announcement.active !== false ? "Active" : "Inactive"}
            </span>

            {announcement.show_on_homepage && (
              <span
                className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold"
                style={{
                  background: "rgba(250,204,21,0.9)",
                  color: "#0B1020",
                }}
              >
                <Sparkles className="w-3 h-3" />
                Homepage Popup
              </span>
            )}

            {announcement.popup_order !== null &&
              announcement.popup_order !== undefined && (
                <span
                  className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold"
                  style={{
                    background: "rgba(15,23,42,0.9)",
                    color: "#fff",
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
            <h3 className="text-lg font-bold text-slate-950">
              {announcement.title || "Untitled"}
            </h3>
            <p className="text-sm text-slate-500 mt-1 line-clamp-2">
              {announcement.description || "No description"}
            </p>
            <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
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
                background: "rgba(75,46,131,0.08)",
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
                    ? "rgba(22,138,58,0.08)"
                    : "rgba(100,116,139,0.1)",
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
                background: "rgba(215,25,32,0.08)",
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
      gradient="linear-gradient(145deg, rgba(255,255,255,0.96), rgba(255,250,230,0.92))"
    >
      {popupAnnouncements.length === 0 ? (
        <div className="rounded-2xl p-6 text-center bg-white/70 border border-slate-100">
          <Megaphone className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <p className="font-bold text-slate-600">
            No homepage popup announcement.
          </p>
          <p className="text-sm text-slate-400 mt-1">
            Turn on Active, Visible, and Show on homepage.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-slate-500 leading-relaxed">
            First item pops up first. When user closes it, the next popup opens.
            If you never arrange, latest announcement comes first.
          </p>

          {popupAnnouncements.map((item, index) => (
            <div
              key={item.id}
              className="rounded-2xl bg-white p-4 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <div className="text-xs font-black uppercase tracking-[0.16em] text-yellow-600 mb-1">
                  Popup #{index + 1}
                </div>
                <div className="font-black text-slate-950 truncate">
                  {item.title || "Untitled announcement"}
                </div>
                <div className="text-xs text-slate-400 mt-1">
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
                  className="px-4 py-2 rounded-xl text-sm font-black disabled:opacity-40"
                  style={{
                    background: "rgba(15,23,42,0.06)",
                    color: colors.dark,
                  }}
                >
                  Up
                </button>
                <button
                  type="button"
                  disabled={index === popupAnnouncements.length - 1}
                  onClick={() => onMove(item.id, "down")}
                  className="px-4 py-2 rounded-xl text-sm font-black disabled:opacity-40"
                  style={{
                    background: "rgba(15,23,42,0.06)",
                    color: colors.dark,
                  }}
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
    <div
      className="min-h-full p-5 sm:p-6"
      style={{
        background:
          "radial-gradient(circle at top left, rgba(75,46,131,0.08), transparent 34%), linear-gradient(180deg, #FFF8EE 0%, #F8FAFC 100%)",
      }}
    >
      <div className="text-center mb-6">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-3"
          style={{
            background: "rgba(215,25,32,0.08)",
            color: colors.red,
            border: "1px solid rgba(215,25,32,0.15)",
          }}
        >
          <Megaphone className="w-4 h-4" />
          Popup Preview
        </div>

        <h3
          className="text-2xl text-slate-950 leading-tight"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 850,
            letterSpacing: "-0.04em",
          }}
        >
          Homepage Popup Order
        </h3>

        <p className="mt-2 text-slate-500 text-sm">
          User will see these one by one.
        </p>
      </div>

      {visible.length === 0 ? (
        <div
          className="rounded-2xl p-8 text-center"
          style={{
            background: "rgba(255,255,255,0.7)",
            border: "1px dashed rgba(15,23,42,0.12)",
          }}
        >
          <Megaphone className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <p className="text-slate-500 font-semibold">No popup selected</p>
          <p className="text-sm text-slate-400">
            Active + Visible + Show on homepage is required.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {visible.map((item, index) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
              style={{
                border: "1px solid rgba(215,25,32,0.08)",
                boxShadow: "0 12px 32px rgba(215,25,32,0.08)",
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
                <div className="text-xs font-black uppercase tracking-[0.16em] text-red-600 mb-1">
                  Popup #{index + 1}
                </div>
                <div className="font-black text-slate-950">{item.title}</div>
                <p className="text-slate-500 text-sm mt-1 line-clamp-2">
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
        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
        style={{
          border: "1px solid rgba(215,25,32,0.16)",
          boxShadow: "0 28px 80px rgba(15,23,42,0.28)",
        }}
      >
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <AlertTriangle className="h-6 w-6" />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-xl font-black text-slate-950">
              Delete announcement?
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              This action cannot be undone. This will permanently delete:
            </p>

            <p className="mt-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800">
              {item.title || "Untitled announcement"}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            className="rounded-2xl px-5 py-3 text-sm font-black text-slate-600 transition-all hover:bg-slate-100 disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="rounded-2xl px-5 py-3 text-sm font-black text-white transition-all hover:scale-[1.02] disabled:opacity-60"
            style={{
              background: `linear-gradient(135deg, ${colors.red}, #9B1117)`,
              boxShadow: "0 14px 34px rgba(215,25,32,0.25)",
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
        style={{ background: "#FFF8EE" }}
      >
        <div className="text-slate-600 font-semibold">
          Loading announcements...
        </div>
      </div>
    );
  }

  return (
    <section
      className="admin-announcements-editor min-h-screen relative overflow-hidden"
      style={{
        background: `
          radial-gradient(circle at top right, rgba(56,189,248,0.16), transparent 34%),
          radial-gradient(circle at bottom left, rgba(250,204,21,0.12), transparent 32%),
          linear-gradient(180deg, #FFF8EE 0%, #F1ECFF 100%)
        `,
      }}
    >
      <div className="absolute top-40 right-20 w-64 h-64 rounded-full bg-red-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-40 left-20 w-72 h-72 rounded-full bg-purple-500/5 blur-3xl pointer-events-none" />

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate("/admin/dashboard")}
            className="inline-flex w-fit items-center gap-2 font-black transition-all hover:-translate-x-1"
            style={{ color: colors.dark }}
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-5">
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold"
              style={{
                background: "rgba(215,25,32,0.08)",
                color: colors.red,
                border: "1px solid rgba(215,25,32,0.15)",
              }}
            >
              <Megaphone className="w-4 h-4" />
              Manage Announcements
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-red-200 to-transparent" />
          </div>

          <h1
            className="text-3xl md:text-6xl mb-4"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 850,
              color: colors.dark,
              letterSpacing: "-0.045em",
            }}
          >
            Announcement Manager
          </h1>

          <p className="text-slate-500 max-w-3xl text-base sm:text-lg">
            Add, edit, and manage homepage popup announcements. Drag-free order
            control is available using Up and Down buttons.
          </p>
        </motion.div>

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-2xl px-5 py-4 flex items-center gap-3 font-semibold"
            style={{
              background: "rgba(22,138,58,0.1)",
              color: colors.green,
              border: "1px solid rgba(22,138,58,0.2)",
            }}
          >
            <CheckCircle2 className="w-5 h-5" />
            {success}
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-2xl px-5 py-4 font-semibold"
            style={{
              background: "rgba(215,25,32,0.1)",
              color: colors.red,
              border: "1px solid rgba(215,25,32,0.2)",
            }}
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
              gradient="linear-gradient(145deg, rgba(255,255,255,0.96), rgba(255,245,245,0.92))"
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
                  <label className="block text-sm font-bold mb-2 text-slate-700">
                    Image / Banner
                  </label>
                  <div
                    className="rounded-2xl p-4 transition-all hover:border-purple-300"
                    style={{
                      background: "rgba(255,255,255,0.88)",
                      border: "2px dashed rgba(75,46,131,0.16)",
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
                      <label className="flex flex-col items-center justify-center gap-2 cursor-pointer py-6 hover:bg-purple-50/50 rounded-xl transition-colors">
                        <div
                          className="p-3 rounded-full"
                          style={{ background: "rgba(75,46,131,0.08)" }}
                        >
                          <UploadCloud
                            className="w-8 h-8"
                            style={{ color: colors.purple }}
                          />
                        </div>
                        <span className="text-sm font-bold text-slate-800">
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
                  className="flex flex-wrap items-center gap-6 p-4 rounded-2xl"
                  style={{ background: "rgba(15,23,42,0.03)" }}
                >
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700 cursor-pointer">
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

                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700 cursor-pointer">
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

                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700 cursor-pointer">
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
                      className="px-6 py-3 rounded-2xl font-bold transition-all hover:scale-105"
                      style={{
                        background: "rgba(100,116,139,0.1)",
                        color: "#64748B",
                        border: "1px solid rgba(100,116,139,0.2)",
                      }}
                    >
                      Cancel
                    </button>
                  )}

                  <button
                    type="submit"
                    disabled={saving || uploading}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all hover:scale-105 disabled:opacity-60 hover:shadow-xl"
                    style={{
                      color: "#fff",
                      background: `linear-gradient(135deg, ${colors.red}, #9B1117)`,
                      boxShadow: "0 14px 34px rgba(215,25,32,0.25)",
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
              gradient="linear-gradient(145deg, rgba(255,255,255,0.96), rgba(245,255,245,0.92))"
            >
              <div className="space-y-4">
                {announcements.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <Megaphone className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                    <p className="font-semibold text-lg">
                      No announcements added yet
                    </p>
                    <p className="text-sm">
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
            className="xl:sticky xl:top-28 rounded-3xl overflow-hidden"
            style={lightAdminPanelStyle}
          >
            <div
              className="p-5"
              style={{
                borderBottom: "1px solid rgba(75,46,131,0.1)",
              }}
            >
              <div
                className="font-black text-lg flex items-center gap-2"
                style={{ color: colors.dark }}
              >
                <div
                  className="p-1.5 rounded-lg"
                  style={{
                    background: "rgba(75,46,131,0.1)",
                    color: colors.purple,
                  }}
                >
                  <Eye className="w-5 h-5" />
                </div>
                Homepage Preview
              </div>
              <div className="text-sm text-slate-500">
                Preview popup sequence order.
              </div>
            </div>

            <div
              className="bg-white overflow-y-auto"
              style={{ height: "600px" }}
            >
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
