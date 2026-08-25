import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Edit3,
  Eye,
  EyeOff,
  ImagePlus,
  Megaphone,
  Plus,
  Save,
  Sparkles,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";

/*
|--------------------------------------------------------------------------
| RED ROSE — ADMIN ANNOUNCEMENT MANAGER
|--------------------------------------------------------------------------
| FULL REPLACEMENT
|
| API used:
|   GET    /api/announcements
|   POST   /api/announcements
|   PUT    /api/announcements/:id
|   DELETE /api/announcements/:id
|   PATCH  /api/announcements/popup-order
|   POST   /api/upload
|
| This file intentionally contains its own styling with Tailwind classes.
| No separate CSS file is required.
|--------------------------------------------------------------------------
*/

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const COLORS = {
  ink: "#170F18",
  burgundy: "#351526",
  burgundy2: "#4B1D34",
  rose: "#A52B4A",
  gold: "#C9963D",
  goldLight: "#E8CF96",
  cream: "#F7F0E5",
  paper: "#FFFDF9",
  line: "#E7DCCF",
  green: "#2D6A4F",
};

function authHeaders(json = false) {
  const token = localStorage.getItem("adminToken");
  const headers = {};
  if (json) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

function getId(item) {
  return item?.id ?? item?._id ?? item?.announcement_id ?? item?.announcementId ?? null;
}

function getDateValue(item) {
  return item?.created_at ?? item?.createdAt ?? item?.updated_at ?? item?.updatedAt ?? "";
}

function getTime(item) {
  const value = getDateValue(item);
  const time = value ? new Date(value).getTime() : 0;
  return Number.isFinite(time) ? time : 0;
}

function getPopupOrder(item) {
  const value =
    item?.popup_order ??
    item?.popupOrder ??
    item?.display_order ??
    item?.displayOrder;

  const number = Number(value);
  return Number.isFinite(number) ? number : 999999;
}

function getAnnouncementList(result) {
  if (Array.isArray(result)) return result;
  if (Array.isArray(result?.data)) return result.data;
  if (Array.isArray(result?.data?.data)) return result.data.data;
  if (Array.isArray(result?.announcements)) return result.announcements;
  if (Array.isArray(result?.data?.announcements)) return result.data.announcements;
  return [];
}

/*
 * Remove accidental duplicate records before rendering.
 * ID duplicates are removed first. Records with different IDs but exactly
 * the same announcement content are also collapsed.
 */
function dedupeAnnouncements(list = []) {
  const seenIds = new Set();
  const seenContent = new Set();

  return list.filter((item) => {
    const id = getId(item);

    if (id !== null && id !== undefined && String(id).trim() !== "") {
      const idKey = String(id);
      if (seenIds.has(idKey)) return false;
      seenIds.add(idKey);
    }

    const contentKey = [
      String(item?.title || "").trim().toLowerCase(),
      String(item?.description || "").trim().toLowerCase(),
      String(item?.image_url || item?.imageUrl || item?.image || "").trim(),
    ].join("|||");

    if (contentKey !== "|||||") {
      if (seenContent.has(contentKey)) return false;
      seenContent.add(contentKey);
    }

    return true;
  });
}

function sortAnnouncements(list = []) {
  return [...list].sort((a, b) => {
    const orderA = getPopupOrder(a);
    const orderB = getPopupOrder(b);

    if (orderA !== orderB) return orderA - orderB;
    return getTime(b) - getTime(a);
  });
}

function getUploadUrl(result) {
  return (
    result?.url ||
    result?.imageUrl ||
    result?.fileUrl ||
    result?.data?.url ||
    result?.data?.imageUrl ||
    result?.data?.fileUrl ||
    result?.secure_url ||
    result?.data?.secure_url ||
    ""
  );
}

function getImageUrl(item) {
  return (
    item?.image_url ||
    item?.imageUrl ||
    item?.image ||
    item?.banner_url ||
    item?.bannerUrl ||
    ""
  );
}

function Switch({ checked, onChange, label, description }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 rounded-2xl border bg-white px-4 py-4 text-left transition hover:-translate-y-0.5 hover:shadow-md"
      style={{ borderColor: COLORS.line }}
    >
      <span className="min-w-0">
        <span className="block text-sm font-black text-slate-900">{label}</span>
        {description && (
          <span className="mt-1 block text-xs leading-5 text-slate-500">
            {description}
          </span>
        )}
      </span>

      <span
        className={`relative h-7 w-12 shrink-0 rounded-full transition ${
          checked ? "bg-emerald-600" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </span>
    </button>
  );
}

function Field({ label, value, onChange, placeholder, required = false, textarea = false }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-slate-700">
        {label} {required && <span className="text-rose-600">*</span>}
      </span>

      {textarea ? (
        <textarea
          rows={5}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full resize-none rounded-2xl border bg-slate-50 px-4 py-3.5 text-sm font-semibold leading-6 text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
          style={{ borderColor: COLORS.line }}
        />
      ) : (
        <input
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-2xl border bg-slate-50 px-4 py-3.5 text-sm font-semibold text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
          style={{ borderColor: COLORS.line }}
        />
      )}
    </label>
  );
}

function EditorCard({ icon: Icon, title, children, accent = COLORS.rose }) {
  return (
    <section
      className="overflow-hidden rounded-[28px] border bg-white shadow-[0_18px_55px_rgba(40,25,35,.07)]"
      style={{ borderColor: COLORS.line }}
    >
      <div className="flex items-center gap-3 border-b px-6 py-5 sm:px-7" style={{ borderColor: COLORS.line }}>
        <div
          className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl"
          style={{ background: `${accent}15`, color: accent }}
        >
          <Icon size={20} />
        </div>
        <div>
          <h2 className="text-lg font-black tracking-tight text-slate-950">{title}</h2>
          <div className="mt-1 h-1 w-10 rounded-full" style={{ background: accent }} />
        </div>
      </div>
      <div className="p-6 sm:p-7">{children}</div>
    </section>
  );
}

function AnnouncementCard({ announcement, onEdit, onDelete, onToggle }) {
  const image = getImageUrl(announcement);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-2xl border bg-white transition hover:-translate-y-0.5 hover:shadow-lg"
      style={{ borderColor: COLORS.line }}
    >
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
        <div className="h-24 w-full shrink-0 overflow-hidden rounded-2xl bg-slate-100 sm:h-24 sm:w-36">
          {image ? (
            <img
              src={image}
              alt={announcement.title || "Announcement"}
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className="grid h-full place-items-center text-slate-300">
              <Megaphone size={30} />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-rose-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-[.12em] text-rose-700">
              Announcement
            </span>

            {announcement.show_on_homepage === true && (
              <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-black text-amber-700">
                Homepage popup
              </span>
            )}

            {announcement.visible === false && (
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black text-slate-500">
                Hidden
              </span>
            )}
          </div>

          <h3 className="mt-2 truncate text-lg font-black text-slate-950">
            {announcement.title || "Untitled announcement"}
          </h3>

          <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">
            {announcement.description || "No description added."}
          </p>

          <div className="mt-3 flex flex-wrap gap-3 text-xs font-bold text-slate-400">
            {getDateValue(announcement) && (
              <span className="inline-flex items-center gap-1">
                <Calendar size={13} />
                {new Date(getDateValue(announcement)).toLocaleDateString()}
              </span>
            )}

            {announcement.popup_order != null && (
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">
                Popup #{announcement.popup_order}
              </span>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(announcement)}
            className="grid h-10 w-10 place-items-center rounded-xl bg-violet-50 text-violet-700 transition hover:-translate-y-0.5"
            title="Edit"
          >
            <Edit3 size={17} />
          </button>

          <button
            type="button"
            onClick={() => onToggle(announcement)}
            className={`grid h-10 w-10 place-items-center rounded-xl transition hover:-translate-y-0.5 ${
              announcement.visible === false
                ? "bg-slate-100 text-slate-500"
                : "bg-emerald-50 text-emerald-700"
            }`}
            title={announcement.visible === false ? "Show" : "Hide"}
          >
            {announcement.visible === false ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>

          <button
            type="button"
            onClick={() => onDelete(announcement)}
            className="grid h-10 w-10 place-items-center rounded-xl bg-red-50 text-red-600 transition hover:-translate-y-0.5"
            title="Delete"
          >
            <Trash2 size={17} />
          </button>
        </div>
      </div>
    </motion.article>
  );
}

function DeleteModal({ item, deleting, onCancel, onConfirm }) {
  if (!item) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl"
        >
          <div className="flex gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-red-50 text-red-600">
              <AlertTriangle size={23} />
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-950">Delete announcement?</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                This will permanently remove the announcement.
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
              className="rounded-xl px-5 py-3 text-sm font-black text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={deleting}
              className="rounded-xl bg-red-600 px-5 py-3 text-sm font-black text-white hover:bg-red-700 disabled:opacity-50"
            >
              {deleting ? "Deleting..." : "Yes, Delete"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default function AdminAnnouncements() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

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

  const [form, setForm] = useState({
    title: "",
    image_url: "",
    description: "",
    active: true,
    visible: true,
    show_on_homepage: true,
    popup_order: null,
  });

  const popupAnnouncements = useMemo(() => {
    return sortAnnouncements(
      dedupeAnnouncements(
        announcements.filter(
          (item) =>
            item?.active !== false &&
            item?.visible !== false &&
            item?.show_on_homepage === true
        )
      )
    );
  }, [announcements]);

  async function fetchAnnouncements() {
    setLoading(true);
    setError("");

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(`${API_URL}/api/announcements`, {
        signal: controller.signal,
        headers: { Accept: "application/json" },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || `Request failed (${response.status})`);
      }

      const list = dedupeAnnouncements(getAnnouncementList(result));
      setAnnouncements(sortAnnouncements(list));
    } catch (err) {
      if (err?.name !== "AbortError") {
        console.error("Admin announcements load error:", err);
        setError(err?.message || "Could not load announcements.");
      }
    } finally {
      window.clearTimeout(timeout);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  function clearMessages() {
    setError("");
    setSuccess("");
  }

  function resetForm() {
    setEditingId(null);
    setImageFile(null);
    setImagePreview("");
    setForm({
      title: "",
      image_url: "",
      description: "",
      active: true,
      visible: true,
      show_on_homepage: true,
      popup_order: null,
    });
  }

  function startEdit(item) {
    clearMessages();
    setEditingId(getId(item));
    setImageFile(null);
    setImagePreview(getImageUrl(item));
    setForm({
      title: item?.title || "",
      image_url: getImageUrl(item),
      description: item?.description || "",
      active: item?.active !== false,
      visible: item?.visible !== false,
      show_on_homepage: item?.show_on_homepage === true,
      popup_order: item?.popup_order ?? null,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleFileSelect(event) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a PNG, JPG, WebP or GIF image.");
      return;
    }

    if (file.size > 6 * 1024 * 1024) {
      setError("Image must be smaller than 6 MB.");
      return;
    }

    setError("");
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function uploadImage(file) {
    if (!file) return "";

    setUploading(true);

    try {
      const body = new FormData();
      body.append("file", file);

      const response = await api.post("/api/upload", body, {
        headers: {
          ...authHeaders(false),
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000,
      });

      const url = getUploadUrl(response?.data);

      if (!url) {
        throw new Error("Image uploaded but backend did not return an image URL.");
      }

      return url;
    } catch (err) {
      console.error("Announcement image upload error:", err);
      throw new Error(
        err?.response?.data?.message ||
          err?.message ||
          "Image upload failed."
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    clearMessages();

    const title = String(form.title || "").trim();

    if (!title) {
      setError("Announcement title is required.");
      return;
    }

    setSaving(true);

    try {
      let imageUrl = form.image_url || "";

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      /*
       * When creating a homepage announcement without an explicit order,
       * put it after the existing pinned announcements.
       */
      const nextOrder =
        form.show_on_homepage
          ? popupAnnouncements.filter((item) => getId(item) !== editingId).length + 1
          : null;

      const payload = {
        title,
        image_url: imageUrl,
        description: String(form.description || "").trim(),
        active: Boolean(form.active),
        visible: Boolean(form.visible),
        show_on_homepage: Boolean(form.show_on_homepage),
        popup_order:
          form.show_on_homepage
            ? form.popup_order === null ||
              form.popup_order === "" ||
              form.popup_order === undefined
              ? nextOrder
              : Number(form.popup_order)
            : null,
      };

      /*
       * Frontend duplicate protection.
       * This avoids creating the same title + description twice accidentally.
       */
      const duplicate = announcements.find((item) => {
        const sameId = editingId && String(getId(item)) === String(editingId);
        if (sameId) return false;

        return (
          String(item?.title || "").trim().toLowerCase() === title.toLowerCase() &&
          String(item?.description || "").trim().toLowerCase() ===
            payload.description.toLowerCase()
        );
      });

      if (duplicate) {
        setError(
          "An announcement with the same title and description already exists. Edit the existing announcement instead."
        );
        setSaving(false);
        return;
      }

      const id = editingId;
      const response = await fetch(
        id
          ? `${API_URL}/api/announcements/${id}`
          : `${API_URL}/api/announcements`,
        {
          method: id ? "PUT" : "POST",
          headers: authHeaders(true),
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (!response.ok || result?.success === false) {
        throw new Error(
          result?.message ||
            `Could not ${id ? "update" : "add"} announcement.`
        );
      }

      setSuccess(id ? "Announcement updated successfully." : "Announcement added successfully.");
      resetForm();
      await fetchAnnouncements();
    } catch (err) {
      console.error("Save announcement error:", err);
      setError(err?.message || "Could not save announcement.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleVisibility(item) {
    const id = getId(item);
    if (!id) return;

    clearMessages();

    try {
      const payload = {
        ...item,
        id: undefined,
        _id: undefined,
        visible: item.visible === false,
      };

      delete payload.id;
      delete payload._id;

      const response = await fetch(`${API_URL}/api/announcements/${id}`, {
        method: "PUT",
        headers: authHeaders(true),
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || result?.success === false) {
        throw new Error(result?.message || "Could not update announcement.");
      }

      setSuccess(
        item.visible === false
          ? "Announcement is visible again."
          : "Announcement is now hidden."
      );

      await fetchAnnouncements();
    } catch (err) {
      console.error("Toggle announcement error:", err);
      setError(err?.message || "Could not update visibility.");
    }
  }

  async function confirmDelete() {
    const id = getId(deleteTarget);
    if (!id) return;

    setDeleting(true);
    clearMessages();

    try {
      const response = await fetch(`${API_URL}/api/announcements/${id}`, {
        method: "DELETE",
        headers: authHeaders(false),
      });

      const result = await response.json();

      if (!response.ok || result?.success === false) {
        throw new Error(result?.message || "Could not delete announcement.");
      }

      setDeleteTarget(null);

      if (String(editingId) === String(id)) {
        resetForm();
      }

      setSuccess("Announcement deleted successfully.");
      await fetchAnnouncements();
    } catch (err) {
      console.error("Delete announcement error:", err);
      setError(err?.message || "Could not delete announcement.");
    } finally {
      setDeleting(false);
    }
  }

  async function movePopup(id, direction) {
    if (ordering) return;

    const index = popupAnnouncements.findIndex(
      (item) => String(getId(item)) === String(id)
    );

    if (index < 0) return;

    const nextIndex = direction === "up" ? index - 1 : index + 1;

    if (nextIndex < 0 || nextIndex >= popupAnnouncements.length) return;

    const next = [...popupAnnouncements];
    [next[index], next[nextIndex]] = [next[nextIndex], next[index]];

    const orders = next.map((item, orderIndex) => ({
      id: getId(item),
      popup_order: orderIndex + 1,
    }));

    setOrdering(true);
    clearMessages();

    try {
      const response = await fetch(`${API_URL}/api/announcements/popup-order`, {
        method: "PATCH",
        headers: authHeaders(true),
        body: JSON.stringify({ orders }),
      });

      const result = await response.json();

      if (!response.ok || result?.success === false) {
        throw new Error(result?.message || "Could not update popup order.");
      }

      setSuccess("Homepage popup order updated.");
      await fetchAnnouncements();
    } catch (err) {
      console.error("Popup order error:", err);
      setError(err?.message || "Could not update popup order.");
    } finally {
      setOrdering(false);
    }
  }

  return (
    <section
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(circle at 8% 8%, rgba(165,43,74,.09), transparent 25%), radial-gradient(circle at 90% 18%, rgba(201,150,61,.12), transparent 28%), #F7F0E5",
      }}
    >
      <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur-xl" style={{ borderColor: COLORS.line }}>
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-4 py-4 sm:px-6">
          <button
            type="button"
            onClick={() => navigate("/admin/dashboard")}
            className="inline-flex items-center gap-2 text-sm font-black text-slate-600 transition hover:text-slate-950"
          >
            <ArrowLeft size={19} />
            Back to Dashboard
          </button>

          <span className="hidden rounded-full bg-slate-100 px-4 py-2 text-xs font-black text-slate-500 sm:inline-flex">
            Red Rose Admin
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-4 py-7 sm:px-6 sm:py-10">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-7 overflow-hidden rounded-[30px] border p-6 shadow-sm md:p-8"
          style={{
            background:
              "radial-gradient(circle at 92% 18%, rgba(165,43,74,.16), transparent 28%), linear-gradient(135deg,#FFFDF9 0%,#F6EFE4 58%,#F0F7F2 100%)",
            borderColor: COLORS.line,
          }}
        >
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-rose-100 bg-rose-50 px-4 py-2 text-sm font-black text-rose-700">
              <Megaphone size={16} />
              Manage Announcements
            </span>

            <span className="rounded-full bg-emerald-50 px-4 py-2 text-xs font-black text-emerald-700">
              {popupAnnouncements.length} pinned on homepage
            </span>
          </div>

          <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-[-.04em] text-slate-950 md:text-6xl">
            Announcement Manager
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
            Create school announcements, upload a banner, edit or delete posts,
            control visibility, and choose exactly which announcements appear
            in the homepage popup.
          </p>
        </motion.div>

        {success && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-black text-emerald-700">
            <CheckCircle2 size={19} />
            {success}
          </div>
        )}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-bold leading-6 text-red-700">
            <AlertTriangle size={19} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid items-start gap-7 xl:grid-cols-[minmax(0,780px)_minmax(360px,1fr)]">
          <div className="space-y-7">
            <EditorCard
              icon={editingId ? Edit3 : Plus}
              title={editingId ? "Edit Announcement" : "Add New Announcement"}
              accent={editingId ? "#7C3AED" : COLORS.rose}
            >
              <form onSubmit={handleSubmit} className="space-y-5">
                <Field
                  label="Announcement Title"
                  value={form.title}
                  onChange={(value) => setForm((p) => ({ ...p, title: value }))}
                  placeholder="Example: Vacancy Announcement 2026"
                  required
                />

                <div>
                  <span className="mb-2 block text-sm font-black text-slate-700">
                    Image / Banner
                  </span>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    className="hidden"
                    onChange={handleFileSelect}
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="group relative flex min-h-[240px] w-full items-center justify-center overflow-hidden rounded-[26px] border-2 border-dashed bg-slate-50 transition hover:bg-white"
                    style={{ borderColor: "#BFD9CA" }}
                  >
                    {imagePreview ? (
                      <>
                        <img
                          src={imagePreview}
                          alt="Announcement preview"
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-slate-950/35" />
                        <div className="relative z-10 rounded-2xl bg-white/95 px-5 py-3 text-sm font-black text-slate-800 shadow-xl">
                          Change image
                        </div>
                      </>
                    ) : (
                      <div className="text-center">
                        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-violet-50 text-violet-600">
                          <UploadCloud size={26} />
                        </div>
                        <p className="mt-4 text-base font-black text-slate-800">
                          Click to Upload Image
                        </p>
                        <p className="mt-1 text-xs font-semibold text-slate-400">
                          PNG, JPG, WebP or GIF • Max 6 MB
                        </p>
                      </div>
                    )}
                  </button>

                  {uploading && (
                    <p className="mt-2 text-xs font-black text-violet-600">
                      Uploading image...
                    </p>
                  )}
                </div>

                <Field
                  label="Description"
                  value={form.description}
                  onChange={(value) => setForm((p) => ({ ...p, description: value }))}
                  placeholder="Write the announcement message..."
                  textarea
                />

                <div className="grid gap-3 md:grid-cols-2">
                  <Switch
                    checked={form.active}
                    onChange={(value) => setForm((p) => ({ ...p, active: value }))}
                    label="Active"
                    description="Inactive announcements are not published."
                  />

                  <Switch
                    checked={form.visible}
                    onChange={(value) => setForm((p) => ({ ...p, visible: value }))}
                    label="Visible"
                    description="Hide an announcement without deleting it."
                  />

                  <Switch
                    checked={form.show_on_homepage}
                    onChange={(value) =>
                      setForm((p) => ({
                        ...p,
                        show_on_homepage: value,
                        popup_order: value ? p.popup_order : null,
                      }))
                    }
                    label="Show on homepage"
                    description="Display this announcement in the homepage popup."
                  />
                </div>

                <div className="rounded-2xl border bg-slate-50 p-4" style={{ borderColor: COLORS.line }}>
                  <div className="flex items-start gap-3">
                    <Sparkles className="mt-0.5 shrink-0 text-amber-500" size={18} />
                    <div>
                      <p className="text-sm font-black text-slate-800">
                        Popup ordering
                      </p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Leave this empty to automatically place a new homepage
                        announcement at the end of the popup sequence.
                      </p>
                    </div>
                  </div>

                  <input
                    type="number"
                    min="1"
                    value={form.popup_order ?? ""}
                    disabled={!form.show_on_homepage}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        popup_order: e.target.value === "" ? null : Number(e.target.value),
                      }))
                    }
                    placeholder="Automatic"
                    className="mt-4 w-full rounded-xl border bg-white px-4 py-3 text-sm font-bold outline-none disabled:cursor-not-allowed disabled:bg-slate-100"
                    style={{ borderColor: COLORS.line }}
                  />
                </div>

                <div className="flex gap-3 pt-1">
                  {editingId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      disabled={saving || uploading}
                      className="rounded-2xl border bg-white px-5 py-3.5 text-sm font-black text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                      style={{ borderColor: COLORS.line }}
                    >
                      Cancel
                    </button>
                  )}

                  <button
                    type="submit"
                    disabled={saving || uploading}
                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                    style={{
                      background: "linear-gradient(135deg,#A52B4A,#C6486B)",
                      boxShadow: "0 12px 28px rgba(165,43,74,.20)",
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

            <EditorCard
              icon={Sparkles}
              title="Pinned on Homepage"
              accent={COLORS.gold}
            >
              <p className="mb-5 text-sm leading-6 text-slate-600">
                These are the announcements that can appear in the homepage
                popup. Use the arrows to change their order.
              </p>

              {popupAnnouncements.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
                  <Megaphone size={42} className="mx-auto text-slate-300" />
                  <p className="mt-3 font-black text-slate-700">
                    No homepage popup announcements
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Turn on Active, Visible and Show on homepage.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {popupAnnouncements.map((item, index) => (
                    <div
                      key={String(getId(item))}
                      className="flex flex-col gap-4 rounded-2xl border bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                      style={{ borderColor: COLORS.line }}
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-100 font-black text-amber-700">
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
                          onClick={() => movePopup(getId(item), "up")}
                          className="grid h-10 w-10 place-items-center rounded-xl bg-white text-slate-700 shadow-sm disabled:cursor-not-allowed disabled:opacity-30"
                          title="Move up"
                        >
                          <ChevronUp size={18} />
                        </button>

                        <button
                          type="button"
                          disabled={ordering || index === popupAnnouncements.length - 1}
                          onClick={() => movePopup(getId(item), "down")}
                          className="grid h-10 w-10 place-items-center rounded-xl bg-white text-slate-700 shadow-sm disabled:cursor-not-allowed disabled:opacity-30"
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

            <EditorCard
              icon={Megaphone}
              title={`All Announcements (${announcements.length})`}
              accent={COLORS.green}
            >
              {loading ? (
                <div className="flex items-center justify-center py-14">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />
                </div>
              ) : announcements.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
                  <Megaphone size={48} className="mx-auto text-slate-300" />
                  <h3 className="mt-4 text-lg font-black text-slate-800">
                    No announcements yet
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Add your first announcement using the form above.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {announcements.map((item) => (
                    <AnnouncementCard
                      key={String(getId(item))}
                      announcement={item}
                      onEdit={startEdit}
                      onDelete={setDeleteTarget}
                      onToggle={toggleVisibility}
                    />
                  ))}
                </div>
              )}
            </EditorCard>
          </div>

          <aside className="xl:sticky xl:top-24">
            <EditorCard icon={Eye} title="Homepage Preview" accent="#7C3AED">
              <div className="mb-5 rounded-2xl border border-violet-100 bg-violet-50 p-4">
                <p className="text-xs font-black uppercase tracking-[.16em] text-violet-700">
                  Popup sequence
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  The public homepage shows these announcements one by one.
                  The same announcement is automatically de-duplicated.
                </p>
              </div>

              {popupAnnouncements.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                  <Megaphone size={40} className="mx-auto text-slate-300" />
                  <p className="mt-3 font-black text-slate-700">Nothing pinned</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {popupAnnouncements.map((item, index) => (
                    <div
                      key={`preview-${String(getId(item))}`}
                      className="overflow-hidden rounded-2xl border bg-white"
                      style={{ borderColor: COLORS.line }}
                    >
                      {getImageUrl(item) ? (
                        <img
                          src={getImageUrl(item)}
                          alt={item.title || "Announcement"}
                          className="h-40 w-full object-cover"
                        />
                      ) : (
                        <div className="grid h-32 place-items-center bg-slate-100 text-slate-300">
                          <ImagePlus size={34} />
                        </div>
                      )}

                      <div className="p-4">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-[10px] font-black uppercase tracking-[.15em] text-rose-600">
                            Popup #{index + 1}
                          </span>
                          <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-black text-emerald-700">
                            Active
                          </span>
                        </div>

                        <h3 className="mt-2 line-clamp-2 text-lg font-black text-slate-950">
                          {item.title || "School Announcement"}
                        </h3>

                        <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">
                          {item.description || "No description added."}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </EditorCard>
          </aside>
        </div>
      </main>

      <DeleteModal
        item={deleteTarget}
        deleting={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </section>
  );
}