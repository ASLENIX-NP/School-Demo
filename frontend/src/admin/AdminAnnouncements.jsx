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
  ChevronUp,
  ChevronDown,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const theme = {
  bg: "#F3F7F4",
  card: "#FFFFFF",
  border: "#DDE8E1",
  text: "#102018",
  muted: "#65766D",
  primary: "#2D6A4F",
  primaryLight: "#EAF4EE",
  accent: "#D9A441",
  success: "#2F855A",
  danger: "#D71920",
  purple: "#6D4BB1",
};

function getTime(item) {
  const time = new Date(
    item?.created_at || item?.createdAt || 0
  ).getTime();

  return Number.isNaN(time) ? 0 : time;
}

function sortAnnouncements(list) {
  return [...list].sort((a, b) => {
    const aOrder =
      a.popup_order === null ||
      a.popup_order === undefined
        ? Number.MAX_SAFE_INTEGER
        : Number(a.popup_order);

    const bOrder =
      b.popup_order === null ||
      b.popup_order === undefined
        ? Number.MAX_SAFE_INTEGER
        : Number(b.popup_order);

    if (aOrder !== bOrder) return aOrder - bOrder;

    return getTime(b) - getTime(a);
  });
}

function authHeaders(includeJson = false) {
  const token = localStorage.getItem("adminToken");

  return {
    ...(includeJson ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
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
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </span>

      <div className="relative">
        {Icon && (
          <Icon
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={17}
          />
        )}

        <input
          type={type}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-2xl border bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
          style={{
            borderColor: "#D7E1DB",
            paddingLeft: Icon ? "44px" : "16px",
          }}
        />
      </div>
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder = "",
  rows = 5,
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </span>

      <textarea
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full resize-none rounded-2xl border bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
        style={{ borderColor: "#D7E1DB" }}
      />
    </label>
  );
}

function EditorCard({ icon: Icon, title, color, children }) {
  return (
    <section
      className="rounded-[28px] border bg-white p-5 shadow-sm transition duration-300 hover:shadow-xl sm:p-6 md:p-8"
      style={{ borderColor: theme.border }}
    >
      <div className="mb-6 flex items-center gap-3">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-2xl"
          style={{
            background: `${color}16`,
            color,
          }}
        >
          <Icon size={21} />
        </div>

        <h2 className="text-xl font-black tracking-tight text-slate-950 sm:text-2xl">
          {title}
        </h2>
      </div>

      {children}
    </section>
  );
}

function AnnouncementCard({
  announcement,
  onEdit,
  onDelete,
  onToggleVisibility,
}) {
  const image =
    announcement.image_url ||
    announcement.imageUrl ||
    announcement.image ||
    "";

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-[24px] border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
      style={{
        borderColor: theme.border,
        opacity: announcement.visible === false ? 0.6 : 1,
      }}
    >
      {image ? (
        <div className="relative h-52 overflow-hidden bg-slate-100">
          <img
            src={image}
            alt={announcement.title || "Announcement"}
            className="h-full w-full object-cover transition duration-700 hover:scale-105"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

          <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-emerald-700 px-3 py-1.5 text-[11px] font-black text-white">
              {announcement.active !== false ? "Active" : "Inactive"}
            </span>

            {announcement.show_on_homepage === true && (
              <span className="rounded-full bg-amber-300 px-3 py-1.5 text-[11px] font-black text-slate-950">
                Pinned on Homepage
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="flex h-36 items-center justify-center bg-gradient-to-br from-emerald-50 to-amber-50">
          <Megaphone size={42} className="text-emerald-700/40" />
        </div>
      )}

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-lg font-black text-slate-950">
              {announcement.title || "Untitled announcement"}
            </h3>

            <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
              {announcement.description || "No description added."}
            </p>

            <div className="mt-3 flex flex-wrap gap-3 text-xs font-semibold text-slate-400">
              <span className="inline-flex items-center gap-1">
                <Calendar size={13} />
                {announcement.created_at
                  ? new Date(
                      announcement.created_at
                    ).toLocaleDateString()
                  : "No date"}
              </span>

              {announcement.popup_order != null && (
                <span className="rounded-full bg-amber-50 px-2.5 py-1 text-amber-700">
                  Popup #{announcement.popup_order}
                </span>
              )}
            </div>
          </div>

          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => onEdit(announcement)}
              className="rounded-xl bg-violet-50 p-2.5 text-violet-700 transition hover:scale-105"
              title="Edit"
            >
              <Edit2 size={16} />
            </button>

            <button
              type="button"
              onClick={() => onToggleVisibility(announcement)}
              className="rounded-xl bg-emerald-50 p-2.5 text-emerald-700 transition hover:scale-105"
              title={
                announcement.visible === false
                  ? "Show"
                  : "Hide"
              }
            >
              {announcement.visible === false ? (
                <EyeOff size={16} />
              ) : (
                <Eye size={16} />
              )}
            </button>

            <button
              type="button"
              onClick={() => onDelete(announcement)}
              className="rounded-xl bg-red-50 p-2.5 text-red-600 transition hover:scale-105"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function PopupOrderManager({ popupAnnouncements, onMove, ordering }) {
  return (
    <EditorCard
      icon={Sparkles}
      title="Pinned on Homepage"
      color={theme.accent}
    >
      <p className="mb-5 text-sm leading-6 text-slate-600">
        These announcements appear in the homepage popup. The first item
        appears first. Use the arrows to change the order.
      </p>

      {popupAnnouncements.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
          <Megaphone
            size={42}
            className="mx-auto mb-3 text-slate-300"
          />
          <p className="font-black text-slate-700">
            No announcement is pinned.
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Enable Active, Visible and Pin / show on homepage.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {popupAnnouncements.map((item, index) => (
            <div
              key={item.id}
              className="flex flex-col gap-4 rounded-2xl border bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
              style={{ borderColor: "#E1E9E4" }}
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700 font-black">
                  {index + 1}
                </div>

                <div className="min-w-0">
                  <p className="truncate font-black text-slate-900">
                    {item.title || "Untitled announcement"}
                  </p>
                  <p className="mt-1 line-clamp-1 text-xs text-slate-500">
                    {item.description || "No description"}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  disabled={ordering || index === 0}
                  onClick={() => onMove(item.id, "up")}
                  className="rounded-xl bg-white p-2.5 text-slate-700 shadow-sm disabled:cursor-not-allowed disabled:opacity-35"
                  title="Move up"
                >
                  <ChevronUp size={18} />
                </button>

                <button
                  type="button"
                  disabled={
                    ordering ||
                    index === popupAnnouncements.length - 1
                  }
                  onClick={() => onMove(item.id, "down")}
                  className="rounded-xl bg-white p-2.5 text-slate-700 shadow-sm disabled:cursor-not-allowed disabled:opacity-35"
                  title="Move down"
                >
                  <ChevronDown size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </EditorCard>
  );
}

function DeleteConfirmModal({
  item,
  deleting,
  onCancel,
  onConfirm,
}) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl"
      >
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <AlertTriangle size={24} />
          </div>

          <div>
            <h3 className="text-xl font-black text-slate-950">
              Delete announcement?
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              This action cannot be undone.
            </p>

            <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm font-black text-slate-800">
              {item.title || "Untitled announcement"}
            </div>
          </div>
        </div>

        <div className="mt-7 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            className="rounded-xl px-5 py-3 text-sm font-black text-slate-600 hover:bg-slate-100 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="rounded-xl bg-red-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-red-600/20 hover:bg-red-700 disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminAnnouncements() {
  const navigate = useNavigate();

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [ordering, setOrdering] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    image_url: "",
    description: "",
    active: true,
    visible: true,
    show_on_homepage: true,
    popup_order: null,
  });

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
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/announcements`
      );

      if (!response.ok) {
        throw new Error(
          `Request failed with status ${response.status}`
        );
      }

      const result = await response.json();

      const data = Array.isArray(result)
        ? result
        : Array.isArray(result?.data)
        ? result.data
        : [];

      setAnnouncements(sortAnnouncements(data));
    } catch (err) {
      console.error("Fetch announcements error:", err);
      setError("Could not load announcements.");
    } finally {
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
    setImagePreview("");
    setEditingId(null);
  };

  const handleEdit = (item) => {
    setEditingId(item.id);

    setFormData({
      title: item.title || "",
      image_url:
        item.image_url ||
        item.imageUrl ||
        item.image ||
        "",
      description: item.description || "",
      active: item.active !== false,
      visible: item.visible !== false,
      show_on_homepage: item.show_on_homepage !== false,
      popup_order:
        item.popup_order === null ||
        item.popup_order === undefined
          ? null
          : item.popup_order,
    });

    setImageFile(null);
    setImagePreview(
      item.image_url ||
        item.imageUrl ||
        item.image ||
        ""
    );

    setSuccess("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Please upload only PNG, JPG, WebP, or GIF images."
      );
      event.target.value = "";
      return;
    }

    if (file.size > 6 * 1024 * 1024) {
      setError("Image must be less than 6 MB.");
      event.target.value = "";
      return;
    }

    setError("");
    setSuccess("");

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));

    event.target.value = "";
  };

  /*
   * IMPORTANT:
   * This uses the same authenticated /api/upload pattern as the
   * working Gallery uploader.
   */
  const uploadImage = async (file) => {
    if (!file) return null;

    setUploading(true);
    setError("");

    try {
      const formDataToUpload = new FormData();
      formDataToUpload.append("file", file);

      const token = localStorage.getItem("adminToken");

      const response = await api.post(
        "/api/upload",
        formDataToUpload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            ...(token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {}),
          },
          timeout: 30000,
        }
      );

      const uploadedUrl =
        response.data?.url ||
        response.data?.imageUrl ||
        response.data?.fileUrl ||
        response.data?.data?.url ||
        response.data?.data?.imageUrl ||
        response.data?.data?.fileUrl ||
        response.data?.secure_url ||
        response.data?.data?.secure_url;

      if (!uploadedUrl) {
        throw new Error(
          "Image uploaded but backend did not return an image URL."
        );
      }

      return uploadedUrl;
    } catch (err) {
      console.error("Announcement image upload error:", err);

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Image upload failed.";

      setError(message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!String(formData.title || "").trim()) {
      setError("Announcement title is required.");
      return;
    }

    setSaving(true);

    try {
      let imageUrl = formData.image_url || "";

      if (imageFile) {
        const uploadedUrl = await uploadImage(imageFile);

        if (!uploadedUrl) {
          return;
        }

        imageUrl = uploadedUrl;
      }

      const announcementData = {
        title: String(formData.title).trim(),
        image_url: imageUrl,
        description: formData.description || "",
        active: Boolean(formData.active),
        visible: Boolean(formData.visible),
        show_on_homepage: Boolean(
          formData.show_on_homepage
        ),
        popup_order:
          formData.popup_order === "" ||
          formData.popup_order === null ||
          formData.popup_order === undefined
            ? null
            : Number(formData.popup_order),
      };

      const endpoint = editingId
        ? `${API_URL}/api/announcements/${editingId}`
        : `${API_URL}/api/announcements`;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: authHeaders(true),
        body: JSON.stringify(announcementData),
      });

      const result = await response.json();

      if (!response.ok || result?.success === false) {
        throw new Error(
          result?.message ||
            `Could not save announcement. Status ${response.status}`
        );
      }

      setSuccess(
        editingId
          ? "Announcement updated successfully."
          : "Announcement added successfully."
      );

      resetForm();
      await fetchAnnouncements();
    } catch (err) {
      console.error("Save announcement error:", err);
      setError(
        err.message || "Could not save announcement."
      );
    } finally {
      setSaving(false);
    }
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
      const response = await fetch(
        `${API_URL}/api/announcements/${deleteTarget.id}`,
        {
          method: "DELETE",
          headers: authHeaders(false),
        }
      );

      const result = await response.json();

      if (!response.ok || result?.success === false) {
        throw new Error(
          result?.message || "Could not delete announcement."
        );
      }

      if (editingId === deleteTarget.id) {
        resetForm();
      }

      setDeleteTarget(null);
      setSuccess("Announcement deleted successfully.");

      await fetchAnnouncements();
    } catch (err) {
      console.error("Delete announcement error:", err);
      setError(
        err.message || "Could not delete announcement."
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleVisibility = async (item) => {
    setError("");
    setSuccess("");

    try {
      const newVisibility =
        item.visible === false;

      const payload = {
        ...item,
        visible: newVisibility,
      };

      const response = await fetch(
        `${API_URL}/api/announcements/${item.id}`,
        {
          method: "PUT",
          headers: authHeaders(true),
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (!response.ok || result?.success === false) {
        throw new Error(
          result?.message ||
            "Could not update announcement visibility."
        );
      }

      setSuccess(
        newVisibility
          ? "Announcement is now visible."
          : "Announcement is now hidden."
      );

      await fetchAnnouncements();
    } catch (err) {
      console.error(
        "Toggle visibility error:",
        err
      );
      setError(
        err.message ||
          "Could not update visibility."
      );
    }
  };

  const handleMovePopup = async (id, direction) => {
    if (ordering) return;

    const currentIndex =
      popupAnnouncements.findIndex(
        (item) => item.id === id
      );

    if (currentIndex === -1) return;

    const nextIndex =
      direction === "up"
        ? currentIndex - 1
        : currentIndex + 1;

    if (
      nextIndex < 0 ||
      nextIndex >= popupAnnouncements.length
    ) {
      return;
    }

    const nextList = [
      ...popupAnnouncements,
    ];

    [
      nextList[currentIndex],
      nextList[nextIndex],
    ] = [
      nextList[nextIndex],
      nextList[currentIndex],
    ];

    const orders = nextList.map(
      (item, index) => ({
        id: item.id,
        popup_order: index + 1,
      })
    );

    setOrdering(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${API_URL}/api/announcements/popup-order`,
        {
          method: "PATCH",
          headers: authHeaders(true),
          body: JSON.stringify({ orders }),
        }
      );

      const result = await response.json();

      if (!response.ok || result?.success === false) {
        throw new Error(
          result?.message ||
            "Could not update popup order."
        );
      }

      setSuccess(
        "Homepage popup order updated."
      );

      await fetchAnnouncements();
    } catch (err) {
      console.error(
        "Popup order update error:",
        err
      );
      setError(
        err.message ||
          "Could not update popup order."
      );
    } finally {
      setOrdering(false);
    }
  };

  if (loading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{
          background:
            "radial-gradient(circle at 10% 10%, rgba(45,106,79,.10), transparent 28%), radial-gradient(circle at 90% 70%, rgba(217,164,65,.12), transparent 28%), #F3F7F4",
        }}
      >
        <div className="rounded-2xl bg-white px-6 py-4 font-bold text-slate-700 shadow-lg">
          Loading announcements...
        </div>
      </div>
    );
  }

  return (
    <section
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(circle at 8% 8%, rgba(45,106,79,.10), transparent 25%), radial-gradient(circle at 92% 35%, rgba(217,164,65,.12), transparent 28%), radial-gradient(circle at 50% 100%, rgba(78,154,168,.07), transparent 30%), #F3F7F4",
      }}
    >
      <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-4 py-4 sm:px-6">
          <button
            type="button"
            onClick={() =>
              navigate("/admin/dashboard")
            }
            className="inline-flex items-center gap-2 font-bold text-slate-600 transition hover:text-slate-950"
          >
            <ArrowLeft size={19} />
            Back to Dashboard
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-4 py-7 sm:px-6 sm:py-10">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-7 rounded-[28px] border p-6 shadow-sm md:p-8"
          style={{
            background:
              "linear-gradient(135deg,#FFFFFF 0%,#F5FAF7 55%,#FFF9ED 100%)",
            borderColor: theme.border,
          }}
        >
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-4 py-2 text-sm font-black text-red-700">
              <Megaphone size={16} />
              Manage Announcements
            </span>

            <span className="rounded-full bg-emerald-50 px-4 py-2 text-xs font-black text-emerald-700">
              {popupAnnouncements.length} pinned on homepage
            </span>
          </div>

          <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-950 md:text-5xl">
            Announcement Manager
          </h1>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
            Add, edit and manage school announcements. Turn on
            <strong> Pin / show on homepage </strong>
            when an announcement should appear in the homepage popup.
            Active and visible announcements are also shown on the public
            Notices page.
          </p>
        </motion.div>

        {success && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-bold text-emerald-700">
            <CheckCircle2 size={19} />
            {success}
          </div>
        )}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-bold text-red-700">
            <AlertTriangle
              size={19}
              className="mt-0.5 shrink-0"
            />
            <span>{error}</span>
          </div>
        )}

        <div className="grid items-start gap-7 xl:grid-cols-[minmax(0,780px)_minmax(340px,1fr)]">
          <div className="space-y-7">
            <EditorCard
              icon={editingId ? Edit2 : Plus}
              title={
                editingId
                  ? "Edit Announcement"
                  : "Add New Announcement"
              }
              color={theme.danger}
            >
              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                <Field
                  label="Announcement Title"
                  value={formData.title}
                  onChange={(value) =>
                    setFormData((previous) => ({
                      ...previous,
                      title: value,
                    }))
                  }
                  placeholder="Example: Vacancy Announcement 2026"
                  required
                  icon={Edit2}
                />

                <div>
                  <span className="mb-2 block text-sm font-bold text-slate-700">
                    Image / Banner
                  </span>

                  <div
                    className="rounded-[24px] border-2 border-dashed p-4"
                    style={{
                      background:
                        "linear-gradient(135deg,#F7FBF8,#FFF9ED)",
                      borderColor: "#C9DCD0",
                    }}
                  >
                    {imagePreview ? (
                      <div className="relative overflow-hidden rounded-2xl">
                        <img
                          src={imagePreview}
                          alt="Announcement preview"
                          className="max-h-72 w-full object-cover"
                        />

                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview("");
                            setImageFile(null);
                            setFormData((previous) => ({
                              ...previous,
                              image_url: "",
                            }));
                          }}
                          className="absolute right-3 top-3 rounded-full bg-slate-950/80 p-2 text-white shadow-lg"
                          title="Remove image"
                        >
                          <X size={17} />
                        </button>
                      </div>
                    ) : (
                      <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl bg-white/80 px-6 py-10 text-center transition hover:bg-white">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
                          <UploadCloud size={30} />
                        </div>

                        <span className="font-black text-slate-800">
                          {uploading
                            ? "Uploading..."
                            : "Click to Upload Image"}
                        </span>

                        <span className="mt-1 text-xs text-slate-500">
                          PNG, JPG, WebP or GIF • Max 6 MB
                        </span>

                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp,image/gif"
                          disabled={uploading}
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  {imageFile && (
                    <p className="mt-2 text-xs font-bold text-emerald-700">
                      Selected: {imageFile.name}
                    </p>
                  )}
                </div>

                <TextArea
                  label="Description"
                  value={formData.description}
                  onChange={(value) =>
                    setFormData((previous) => ({
                      ...previous,
                      description: value,
                    }))
                  }
                  placeholder="Write the announcement details here..."
                  rows={5}
                />

                <div className="grid gap-3 rounded-[22px] border bg-slate-50 p-4 sm:grid-cols-3">
                  <label className="flex cursor-pointer items-center gap-2 text-sm font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(event) =>
                        setFormData((previous) => ({
                          ...previous,
                          active:
                            event.target.checked,
                        }))
                      }
                      className="h-4 w-4 accent-emerald-700"
                    />
                    Active
                  </label>

                  <label className="flex cursor-pointer items-center gap-2 text-sm font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={formData.visible}
                      onChange={(event) =>
                        setFormData((previous) => ({
                          ...previous,
                          visible:
                            event.target.checked,
                        }))
                      }
                      className="h-4 w-4 accent-emerald-700"
                    />
                    Visible on website
                  </label>

                  <label className="flex cursor-pointer items-center gap-2 text-sm font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={
                        formData.show_on_homepage
                      }
                      onChange={(event) =>
                        setFormData((previous) => ({
                          ...previous,
                          show_on_homepage:
                            event.target.checked,
                        }))
                      }
                      className="h-4 w-4 accent-amber-500"
                    />
                    Pin / show on homepage
                  </label>
                </div>

                <div className="flex gap-3 pt-2">
                  {editingId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      disabled={saving || uploading}
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-3 font-black text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  )}

                  <button
                    type="submit"
                    disabled={saving || uploading}
                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl px-6 py-3.5 font-black text-white shadow-lg transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                    style={{
                      background:
                        "linear-gradient(135deg,#2D6A4F,#4E9A72)",
                      boxShadow:
                        "0 12px 28px rgba(45,106,79,.20)",
                    }}
                  >
                    <Save size={17} />
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
              ordering={ordering}
            />

            <EditorCard
              icon={Megaphone}
              title="All Announcements"
              color={theme.primary}
            >
              {announcements.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
                  <Megaphone
                    size={48}
                    className="mx-auto text-slate-300"
                  />
                  <h3 className="mt-4 text-lg font-black text-slate-800">
                    No announcements yet
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Add your first announcement above.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {announcements.map((item) => (
                    <AnnouncementCard
                      key={item.id}
                      announcement={item}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onToggleVisibility={
                        handleToggleVisibility
                      }
                    />
                  ))}
                </div>
              )}
            </EditorCard>
          </div>

          <aside className="xl:sticky xl:top-24">
            <EditorCard
              icon={Eye}
              title="Homepage Preview"
              color={theme.purple}
            >
              <div className="mb-5 rounded-2xl border border-violet-100 bg-violet-50 p-4">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-violet-700">
                  Popup sequence
                </p>

                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Visitors will see pinned announcements one by one.
                </p>
              </div>

              {popupAnnouncements.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                  <Megaphone
                    size={42}
                    className="mx-auto text-slate-300"
                  />
                  <p className="mt-3 font-black text-slate-700">
                    Nothing pinned
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {popupAnnouncements.map(
                    (item, index) => (
                      <div
                        key={item.id}
                        className="overflow-hidden rounded-2xl border bg-white shadow-sm"
                        style={{
                          borderColor: theme.border,
                        }}
                      >
                        {item.image_url && (
                          <img
                            src={item.image_url}
                            alt={item.title}
                            className="h-36 w-full object-cover"
                          />
                        )}

                        <div className="p-4">
                          <div className="text-[10px] font-black uppercase tracking-[0.16em] text-red-600">
                            Popup #{index + 1}
                          </div>

                          <h3 className="mt-1 font-black text-slate-950">
                            {item.title ||
                              "Untitled announcement"}
                          </h3>

                          <p className="mt-1 line-clamp-3 text-sm leading-6 text-slate-600">
                            {item.description ||
                              "No description"}
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </EditorCard>
          </aside>
        </div>
      </main>

      <DeleteConfirmModal
        item={deleteTarget}
        deleting={deleting}
        onCancel={() =>
          setDeleteTarget(null)
        }
        onConfirm={confirmDelete}
      />
    </section>
  );
}
