import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import api from "../lib/api";
import About, {
  defaultAboutContent,
  mergeAboutContent,
} from "../app/components/About";
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  Eye,
  ExternalLink,
  Pencil,
  Plus,
  Save,
  Trash2,
  Upload,
  X,
} from "lucide-react";

/*
|--------------------------------------------------------------------------
| RED ROSE SCHOOL — ADMIN ABOUT
|--------------------------------------------------------------------------
| FULL REPLACEMENT
|
| Important:
| - Keeps the existing About public component as the live preview.
| - Keeps the existing API:
|       GET /api/site-content/about
|       PUT /api/site-content/about
|       POST /api/upload
| - The main change is responsive behaviour inside the admin preview.
| - On phones/tablets the preview is allowed to shrink naturally instead
|   of retaining desktop-sized rows/columns.
| - Editing, adding, deleting and image uploading remain available.
| - No separate About.css file is required.
|--------------------------------------------------------------------------
*/

const API_PATH = "/api/site-content/about";

const CARD_COLORS = [
  "#4B2E83",
  "#168A3A",
  "#C58A19",
  "#A62B4F",
  "#2563EB",
  "#0EA5E9",
];

function getToken() {
  return (
    localStorage.getItem("adminToken") ||
    sessionStorage.getItem("adminToken") ||
    ""
  );
}

function getAuthHeaders() {
  const token = getToken();
  if (!token) return null;

  return {
    Authorization: `Bearer ${token}`,
  };
}

function clamp(value, min, max, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, number));
}

function clampZoom(value) {
  return clamp(value, 1, 3, 1);
}

function clampOffset(value) {
  return clamp(value, -60, 60, 0);
}

function getUploadUrl(response) {
  return (
    response?.data?.url ||
    response?.data?.imageUrl ||
    response?.data?.image_url ||
    response?.url ||
    response?.imageUrl ||
    response?.image_url ||
    ""
  );
}

function getTargetTitle(target) {
  if (!target) return "Edit About Page";

  const titles = {
    pageHeader: "Edit About Page Header",
    storyText: "Edit Story Text",
    storyImage: "Change Story Image",
    storyImageText: "Edit Story Image Caption",
    pillarHeader: "Edit Core Values Heading",
    pillarCard: "Edit Core Value Card",
    leadershipHeader: "Edit Leadership Heading",
    leadershipMessage: "Edit Leadership Message",
    leadershipPhoto: "Change Leadership Photo",
    missionVisionBadge: "Edit Mission / Vision Heading",
    missionVisionHeader: "Edit Mission / Vision Heading",
    missionVision: "Edit Mission / Vision Card",
    journeyBadge: "Edit Journey Heading",
    journeyHeader: "Edit Journey Heading",
    journeyItem: "Edit Journey Item",
    ctaBand: "Edit Call to Action",
    statsCard: "Edit Statistic Card",
  };

  return titles[target.type] || "Edit About Page";
}

function Field({ label, value, onChange, textarea = false, type = "text" }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black uppercase tracking-[0.08em] text-slate-500">
        {label}
      </span>

      {textarea ? (
        <textarea
          value={value ?? ""}
          onChange={(event) => onChange(event.target.value)}
          rows={5}
          className="w-full resize-y rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-500/10"
        />
      ) : (
        <input
          type={type}
          value={value ?? ""}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-500/10"
        />
      )}
    </label>
  );
}

function ToggleField({ label, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <span className="text-sm font-bold text-slate-700">{label}</span>

      <input
        type="checkbox"
        checked={Boolean(checked)}
        onChange={(event) => onChange(event.target.checked)}
        className="h-5 w-5 accent-purple-600"
      />
    </label>
  );
}

function EditModal({
  target,
  form,
  setForm,
  onClose,
  onSave,
  saving,
  uploading,
  onUpload,
  onDelete,
  canDelete,
  imageAdjustOpen,
  setImageAdjustOpen,
}) {
  if (!target) return null;

  const update = (key, value) => {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const imageTarget =
    target.type === "storyImage" ||
    target.type === "leadershipPhoto" ||
    target.type === "leadershipMessage";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-950/75 p-3 sm:p-5 backdrop-blur-md"
        onMouseDown={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 18 }}
          onMouseDown={(event) => event.stopPropagation()}
          className="flex max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-[24px] bg-white shadow-2xl sm:rounded-[30px]"
        >
          <header className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-100 bg-white/95 px-4 py-4 backdrop-blur sm:px-6 sm:py-5">
            <div className="min-w-0">
              <div className="text-[9px] font-black uppercase tracking-[0.18em] text-purple-700 sm:text-[10px]">
                About Editor
              </div>

              <h2 className="mt-1 truncate text-lg font-black text-slate-950 sm:text-2xl">
                {getTargetTitle(target)}
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-red-50 hover:text-red-600 sm:h-10 sm:w-10"
            >
              <X size={18} />
            </button>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6">
            <div className="space-y-5">
              {imageTarget && (
                <section className="rounded-3xl border border-slate-200 bg-slate-950 p-4 sm:p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="h-32 w-full overflow-hidden rounded-2xl bg-slate-800 sm:h-36 sm:w-36 sm:shrink-0">
                      {form.image || form.storyImageUrl || form.imageUrl ? (
                        <img
                          src={
                            form.storyImageUrl ||
                            form.imageUrl ||
                            form.image
                          }
                          alt=""
                          className="h-full w-full object-cover"
                          style={{
                            objectPosition: `${50 - clampOffset(form.imageOffsetX)}% ${50 - clampOffset(form.imageOffsetY)}%`,
                            transform: `scale(${clampZoom(form.imageZoom)})`,
                          }}
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs font-bold text-white/50">
                          No image
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="font-black text-white">Image</p>
                      <p className="mt-1 text-xs leading-5 text-white/55">
                        Upload a new image without changing the rest of the
                        About page.
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-xs font-black text-slate-900">
                          <Upload size={14} />
                          {uploading ? "Uploading..." : "Upload Image"}
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            disabled={uploading}
                            className="hidden"
                            onChange={(event) => {
                              const file = event.target.files?.[0];
                              event.target.value = "";
                              if (file) onUpload(file);
                            }}
                          />
                        </label>

                        <button
                          type="button"
                          disabled={
                            !(form.storyImageUrl ||
                              form.imageUrl ||
                              form.image)
                          }
                          onClick={() => setImageAdjustOpen(true)}
                          className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2.5 text-xs font-black text-white disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Camera size={14} />
                          Adjust Image
                        </button>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {target.type === "pageHeader" && (
                <>
                  <Field label="Badge" value={form.pageBadge} onChange={(v) => update("pageBadge", v)} />
                  <Field label="Page Title" value={form.pageTitle} onChange={(v) => update("pageTitle", v)} />
                  <Field label="Page Subtitle" value={form.pageSubtitle} onChange={(v) => update("pageSubtitle", v)} textarea />
                  <Field label="Story Badge / Year" value={form.storyBadgeYear} onChange={(v) => update("storyBadgeYear", v)} />
                  <Field label="Hero Emblem Text" value={form.heroEmblemText} onChange={(v) => update("heroEmblemText", v)} />
                  <Field label="Hero Emblem Label" value={form.heroEmblemLabel} onChange={(v) => update("heroEmblemLabel", v)} />
                </>
              )}

              {target.type === "storyText" && (
                <>
                  <Field label="Story Badge" value={form.storyBadge} onChange={(v) => update("storyBadge", v)} />
                  <Field label="Story Title" value={form.storyTitle} onChange={(v) => update("storyTitle", v)} />
                  <Field label="Paragraph 1" value={form.paragraph1} onChange={(v) => update("paragraph1", v)} textarea />
                  <Field label="Paragraph 2" value={form.paragraph2} onChange={(v) => update("paragraph2", v)} textarea />
                  <Field label="Story Tags — one per line" value={form.tags} onChange={(v) => update("tags", v)} textarea />
                </>
              )}

              {target.type === "storyImage" && (
                <>
                  <Field label="Image URL" value={form.storyImageUrl} onChange={(v) => update("storyImageUrl", v)} />
                  <Field label="Image Alt Text" value={form.storyImageAlt} onChange={(v) => update("storyImageAlt", v)} />
                </>
              )}

              {target.type === "storyImageText" && (
                <>
                  <Field label="Image Title" value={form.storyImageTitle} onChange={(v) => update("storyImageTitle", v)} />
                  <Field label="Image Subtitle" value={form.storyImageSubtitle} onChange={(v) => update("storyImageSubtitle", v)} />
                </>
              )}

              {(target.type === "pillarHeader") && (
                <>
                  <Field label="Badge" value={form.pillarBadge} onChange={(v) => update("pillarBadge", v)} />
                  <Field label="Title" value={form.pillarTitle} onChange={(v) => update("pillarTitle", v)} />
                  <Field label="Description" value={form.pillarDescription} onChange={(v) => update("pillarDescription", v)} textarea />
                </>
              )}

              {target.type === "pillarCard" && (
                <>
                  <Field label="Label" value={form.label} onChange={(v) => update("label", v)} />
                  <Field label="Description" value={form.desc} onChange={(v) => update("desc", v)} textarea />
                  <Field label="Icon" value={form.icon} onChange={(v) => update("icon", v)} />
                  <Field label="Color" value={form.color} onChange={(v) => update("color", v)} />
                  <ToggleField label="Visible on public page" checked={form.visible} onChange={(v) => update("visible", v)} />
                </>
              )}

              {(target.type === "leadershipHeader") && (
                <>
                  <Field label="Badge" value={form.leadershipBadge} onChange={(v) => update("leadershipBadge", v)} />
                  <Field label="Title" value={form.leadershipTitle} onChange={(v) => update("leadershipTitle", v)} />
                  <Field label="Description" value={form.leadershipDescription} onChange={(v) => update("leadershipDescription", v)} textarea />
                </>
              )}

              {(target.type === "leadershipMessage" || target.type === "leadershipPhoto") && (
                <>
                  <Field label="Name" value={form.name} onChange={(v) => update("name", v)} />
                  <Field label="Role" value={form.role} onChange={(v) => update("role", v)} />
                  <Field label="Message Title" value={form.title} onChange={(v) => update("title", v)} />
                  <Field label="Message" value={form.message} onChange={(v) => update("message", v)} textarea />
                  <Field label="Image URL" value={form.imageUrl || form.image} onChange={(v) => update("imageUrl", v)} />
                  <ToggleField label="Visible on public page" checked={form.visible} onChange={(v) => update("visible", v)} />
                </>
              )}

              {(target.type === "missionVisionBadge" || target.type === "missionVisionHeader") && (
                <>
                  <Field label="Badge" value={form.missionVisionBadge} onChange={(v) => update("missionVisionBadge", v)} />
                  <Field label="Title" value={form.missionVisionTitle} onChange={(v) => update("missionVisionTitle", v)} />
                </>
              )}

              {target.type === "missionVision" && (
                <>
                  <Field label="Title" value={form.title} onChange={(v) => update("title", v)} />
                  <Field label="Description" value={form.desc} onChange={(v) => update("desc", v)} textarea />
                  <Field label="Color" value={form.color} onChange={(v) => update("color", v)} />
                  <Field label="Icon" value={form.icon} onChange={(v) => update("icon", v)} />
                  <ToggleField label="Visible on public page" checked={form.visible} onChange={(v) => update("visible", v)} />
                </>
              )}

              {(target.type === "journeyBadge" || target.type === "journeyHeader") && (
                <>
                  <Field label="Badge" value={form.journeyBadge} onChange={(v) => update("journeyBadge", v)} />
                  <Field label="Title" value={form.journeyTitle} onChange={(v) => update("journeyTitle", v)} />
                </>
              )}

              {target.type === "journeyItem" && (
                <>
                  <Field label="Year" value={form.year} onChange={(v) => update("year", v)} />
                  <Field label="Title" value={form.title} onChange={(v) => update("title", v)} />
                  <Field label="Description" value={form.desc} onChange={(v) => update("desc", v)} textarea />
                  <ToggleField label="Visible on public page" checked={form.visible} onChange={(v) => update("visible", v)} />
                </>
              )}

              {target.type === "ctaBand" && (
                <>
                  <Field label="CTA Title" value={form.ctaTitle} onChange={(v) => update("ctaTitle", v)} />
                  <Field label="CTA Description" value={form.ctaDescription} onChange={(v) => update("ctaDescription", v)} textarea />
                  <Field label="Button Text" value={form.ctaButtonText} onChange={(v) => update("ctaButtonText", v)} />
                  <Field label="Button Link" value={form.ctaButtonLink} onChange={(v) => update("ctaButtonLink", v)} />
                </>
              )}

              {target.type === "statsCard" && (
                <>
                  <Field label="Value" value={form.value} onChange={(v) => update("value", v)} type="number" />
                  <Field label="Suffix" value={form.suffix} onChange={(v) => update("suffix", v)} />
                  <Field label="Label" value={form.label} onChange={(v) => update("label", v)} />
                  <Field label="Decimals" value={form.decimals} onChange={(v) => update("decimals", v)} type="number" />
                  <ToggleField label="Visible on public page" checked={form.visible} onChange={(v) => update("visible", v)} />
                </>
              )}

              {imageAdjustOpen && imageTarget && (
                <section className="rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-base font-black text-slate-900">
                      Image Adjustment
                    </h3>

                    <button
                      type="button"
                      onClick={() => setImageAdjustOpen(false)}
                      className="rounded-xl bg-white px-3 py-2 text-xs font-black text-slate-600"
                    >
                      Done
                    </button>
                  </div>

                  <div className="mt-4 overflow-hidden rounded-2xl bg-slate-900">
                    <div className="mx-auto aspect-[4/3] max-h-[360px] w-full max-w-xl overflow-hidden">
                      {(form.storyImageUrl || form.imageUrl || form.image) && (
                        <img
                          src={form.storyImageUrl || form.imageUrl || form.image}
                          alt=""
                          className="h-full w-full object-cover"
                          style={{
                            objectPosition: `${50 - clampOffset(form.imageOffsetX)}% ${50 - clampOffset(form.imageOffsetY)}%`,
                            transform: `scale(${clampZoom(form.imageZoom)})`,
                          }}
                        />
                      )}
                    </div>
                  </div>

                  <div className="mt-4 grid gap-4 sm:grid-cols-3">
                    <label className="block">
                      <span className="text-xs font-black text-slate-500">
                        Zoom
                      </span>
                      <input
                        className="mt-2 w-full"
                        type="range"
                        min="1"
                        max="3"
                        step="0.05"
                        value={clampZoom(form.imageZoom)}
                        onChange={(event) =>
                          update("imageZoom", Number(event.target.value))
                        }
                      />
                    </label>

                    <label className="block">
                      <span className="text-xs font-black text-slate-500">
                        Horizontal
                      </span>
                      <input
                        className="mt-2 w-full"
                        type="range"
                        min="-60"
                        max="60"
                        value={clampOffset(form.imageOffsetX)}
                        onChange={(event) =>
                          update("imageOffsetX", Number(event.target.value))
                        }
                      />
                    </label>

                    <label className="block">
                      <span className="text-xs font-black text-slate-500">
                        Vertical
                      </span>
                      <input
                        className="mt-2 w-full"
                        type="range"
                        min="-60"
                        max="60"
                        value={clampOffset(form.imageOffsetY)}
                        onChange={(event) =>
                          update("imageOffsetY", Number(event.target.value))
                        }
                      />
                    </label>
                  </div>
                </section>
              )}
            </div>
          </div>

          <footer className="flex shrink-0 flex-col-reverse gap-2 border-t border-slate-100 bg-white/95 p-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              {canDelete && (
                <button
                  type="button"
                  disabled={saving}
                  onClick={onDelete}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-red-50 px-4 py-3 text-xs font-black text-red-700 disabled:opacity-50 sm:w-auto"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              )}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                disabled={saving || uploading}
                onClick={onClose}
                className="rounded-2xl bg-slate-100 px-5 py-3 text-xs font-black text-slate-700 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={saving || uploading}
                onClick={onSave}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-xs font-black text-white disabled:opacity-50"
              >
                <Save size={14} />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </footer>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function ConfirmDelete({ target, onCancel, onConfirm, saving }) {
  if (!target) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100000] flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-md"
        onMouseDown={onCancel}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onMouseDown={(event) => event.stopPropagation()}
          className="w-full max-w-md rounded-[26px] bg-white p-6 shadow-2xl sm:p-7"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <Trash2 size={21} />
          </div>

          <h3 className="mt-5 text-xl font-black text-slate-950">
            Delete this item?
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            This will remove the selected About item from the public page.
            The action is saved to the backend.
          </p>

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onCancel}
              disabled={saving}
              className="rounded-2xl bg-slate-100 px-5 py-3 text-xs font-black text-slate-700"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={saving}
              className="rounded-2xl bg-red-600 px-5 py-3 text-xs font-black text-white disabled:opacity-50"
            >
              {saving ? "Deleting..." : "Delete"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function AdminAbout() {
  const navigate = useNavigate();

  const [form, setForm] = useState(defaultAboutContent);
  const [loading, setLoading] = useState(true);

  const [editingTarget, setEditingTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [modalForm, setModalForm] = useState({});
  const [imageAdjustOpen, setImageAdjustOpen] = useState(false);

  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const loadAboutContent = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get(API_PATH, {
        timeout: 12000,
      });

      const savedContent = response?.data?.data?.content || {};
      setForm(mergeAboutContent(savedContent));
    } catch (err) {
      console.error("Load about content error:", err);
      setError(
        err?.response?.data?.message ||
          "Could not load saved About content. Default content is being shown by the preview."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAboutContent();
  }, []);

  const openEditor = (target) => {
    if (!target) return;

    setSuccess("");
    setError("");
    setImageAdjustOpen(false);
    setEditingTarget(target);

    const item = target.index != null
      ? form?.[
          target.type === "statsCard"
            ? "stats"
            : target.type === "pillarCard"
              ? "pillars"
              : target.type === "leadershipMessage" ||
                  target.type === "leadershipPhoto"
                ? "messages"
                : target.type === "missionVision"
                  ? "missionVision"
                  : target.type === "journeyItem"
                    ? "journey"
                    : ""
        ]?.[target.index] || {}
      : {};

    if (target.type === "pageHeader") {
      setModalForm({
        pageBadge: form.pageBadge || "",
        pageTitle: form.pageTitle || "",
        pageSubtitle: form.pageSubtitle || "",
        storyBadgeYear: form.storyBadgeYear || "",
        heroEmblemText: form.heroEmblemText || "",
        heroEmblemLabel: form.heroEmblemLabel || "",
      });
      return;
    }

    if (target.type === "storyText") {
      setModalForm({
        storyBadge: form.storyBadge || "",
        storyTitle: form.storyTitle || "",
        paragraph1: form.storyParagraphs?.[0] || "",
        paragraph2: form.storyParagraphs?.[1] || "",
        tags: Array.isArray(form.storyTags)
          ? form.storyTags.join("\n")
          : "",
      });
      return;
    }

    if (target.type === "storyImage") {
      setModalForm({
        storyImageUrl: form.storyImageUrl || "",
        storyImageAlt: form.storyImageAlt || "",
        imageZoom: clampZoom(form.storyImageZoom),
        imageOffsetX: clampOffset(form.storyImageOffsetX),
        imageOffsetY: clampOffset(form.storyImageOffsetY),
      });
      return;
    }

    if (target.type === "storyImageText") {
      setModalForm({
        storyImageTitle: form.storyImageTitle || "",
        storyImageSubtitle: form.storyImageSubtitle || "",
      });
      return;
    }

    if (target.type === "pillarHeader") {
      setModalForm({
        pillarBadge: form.pillarBadge || "",
        pillarTitle: form.pillarTitle || "",
        pillarDescription: form.pillarDescription || "",
      });
      return;
    }

    if (target.type === "pillarCard") {
      setModalForm({
        ...item,
        label: item.label || "",
        desc: item.desc || "",
        color: item.color || CARD_COLORS[target.index % CARD_COLORS.length],
        visible: item.visible !== false,
      });
      return;
    }

    if (target.type === "leadershipHeader") {
      setModalForm({
        leadershipBadge: form.leadershipBadge || "",
        leadershipTitle: form.leadershipTitle || "",
        leadershipDescription: form.leadershipDescription || "",
      });
      return;
    }

    if (target.type === "leadershipMessage" || target.type === "leadershipPhoto") {
      setModalForm({
        ...item,
        imageUrl: item.image || item.imageUrl || "",
        imageZoom: clampZoom(item.imageZoom),
        imageOffsetX: clampOffset(item.imageOffsetX),
        imageOffsetY: clampOffset(item.imageOffsetY),
        visible: item.visible !== false,
      });
      return;
    }

    if (target.type === "missionVisionBadge" || target.type === "missionVisionHeader") {
      setModalForm({
        missionVisionBadge: form.missionVisionBadge || "",
        missionVisionTitle: form.missionVisionTitle || "",
      });
      return;
    }

    if (target.type === "missionVision") {
      setModalForm({
        ...item,
        title: item.title || "",
        desc: item.desc || "",
        color: item.color || CARD_COLORS[target.index % CARD_COLORS.length],
        visible: item.visible !== false,
      });
      return;
    }

    if (target.type === "journeyBadge" || target.type === "journeyHeader") {
      setModalForm({
        journeyBadge: form.journeyBadge || "",
        journeyTitle: form.journeyTitle || "",
      });
      return;
    }

    if (target.type === "journeyItem") {
      setModalForm({
        ...item,
        year: item.year || "",
        title: item.title || "",
        desc: item.desc || "",
        visible: item.visible !== false,
      });
      return;
    }

    if (target.type === "ctaBand") {
      setModalForm({
        ctaTitle: form.ctaTitle || "",
        ctaDescription: form.ctaDescription || "",
        ctaButtonText: form.ctaButtonText || "",
        ctaButtonLink: form.ctaButtonLink || "/contact",
      });
      return;
    }

    if (target.type === "statsCard") {
      setModalForm({
        ...item,
        value: item.value ?? 0,
        suffix: item.suffix || "",
        label: item.label || "",
        decimals: item.decimals ?? 0,
        visible: item.visible !== false,
      });
    }
  };

  const closeEditor = () => {
    if (saving || uploadingImage) return;

    setImageAdjustOpen(false);
    setEditingTarget(null);
    setModalForm({});
  };

  const saveContentToBackend = async (nextForm, message) => {
    const authHeaders = getAuthHeaders();

    if (!authHeaders) {
      setError("Admin login expired. Please logout and login again.");
      return false;
    }

    await api.put(
      API_PATH,
      { content: nextForm },
      {
        headers: authHeaders,
        timeout: 20000,
      }
    );

    setForm(nextForm);
    setSuccess(message || "About page updated successfully.");
    return true;
  };

  const uploadImage = async (file) => {
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Please upload only PNG, JPG, or WebP images.");
      return;
    }

    if (file.size > 6 * 1024 * 1024) {
      setError("Image must be less than 6 MB.");
      return;
    }

    const authHeaders = getAuthHeaders();

    if (!authHeaders) {
      setError("Admin login expired. Please logout and login again.");
      return;
    }

    setUploadingImage(true);
    setSuccess("");
    setError("");

    try {
      const data = new FormData();
      data.append("file", file);

      const response = await api.post("/api/upload", data, {
        headers: {
          ...authHeaders,
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000,
      });

      const url = getUploadUrl(response?.data);

      if (!url) {
        throw new Error("Image uploaded but no image URL was returned.");
      }

      setModalForm((previous) => ({
        ...previous,
        ...(editingTarget?.type === "storyImage"
          ? { storyImageUrl: url }
          : { imageUrl: url }),
        imageZoom: 1,
        imageOffsetX: 0,
        imageOffsetY: 0,
      }));

      setSuccess("Image uploaded. Click Save Changes to publish it.");
    } catch (err) {
      console.error("About image upload error:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Image upload failed."
      );
    } finally {
      setUploadingImage(false);
    }
  };

  const saveSelectedPart = async () => {
    if (!editingTarget) return;

    setSaving(true);
    setSuccess("");
    setError("");

    try {
      let nextForm = mergeAboutContent(form);
      const target = editingTarget;

      if (target.type === "pageHeader") {
        nextForm = {
          ...nextForm,
          pageBadge: modalForm.pageBadge || "",
          pageTitle: modalForm.pageTitle || "",
          pageSubtitle: modalForm.pageSubtitle || "",
          storyBadgeYear: modalForm.storyBadgeYear || "",
          heroEmblemText: modalForm.heroEmblemText || "",
          heroEmblemLabel: modalForm.heroEmblemLabel || "",
        };
      }

      if (target.type === "storyText") {
        nextForm = {
          ...nextForm,
          storyBadge: modalForm.storyBadge || "",
          storyTitle: modalForm.storyTitle || "",
          storyParagraphs: [
            modalForm.paragraph1 || "",
            modalForm.paragraph2 || "",
          ],
          storyTags: String(modalForm.tags || "")
            .split("\n")
            .map((item) => item.trim())
            .filter(Boolean),
        };
      }

      if (target.type === "storyImage") {
        nextForm = {
          ...nextForm,
          storyImageUrl: modalForm.storyImageUrl || "",
          storyImageAlt: modalForm.storyImageAlt || "",
          storyImageZoom: clampZoom(modalForm.imageZoom),
          storyImageOffsetX: clampOffset(modalForm.imageOffsetX),
          storyImageOffsetY: clampOffset(modalForm.imageOffsetY),
        };
      }

      if (target.type === "storyImageText") {
        nextForm = {
          ...nextForm,
          storyImageTitle: modalForm.storyImageTitle || "",
          storyImageSubtitle: modalForm.storyImageSubtitle || "",
        };
      }

      if (target.type === "pillarHeader") {
        nextForm = {
          ...nextForm,
          pillarBadge: modalForm.pillarBadge || "",
          pillarTitle: modalForm.pillarTitle || "",
          pillarDescription: modalForm.pillarDescription || "",
        };
      }

      if (target.type === "pillarCard") {
        nextForm.pillars = nextForm.pillars.map((item, index) =>
          index === target.index
            ? {
                ...item,
                ...modalForm,
                visible: modalForm.visible !== false,
              }
            : item
        );
      }

      if (target.type === "leadershipHeader") {
        nextForm = {
          ...nextForm,
          leadershipBadge: modalForm.leadershipBadge || "",
          leadershipTitle: modalForm.leadershipTitle || "",
          leadershipDescription: modalForm.leadershipDescription || "",
        };
      }

      if (target.type === "leadershipMessage" || target.type === "leadershipPhoto") {
        nextForm.messages = nextForm.messages.map((item, index) =>
          index === target.index
            ? {
                ...item,
                ...modalForm,
                image: modalForm.imageUrl || modalForm.image || "",
                imageZoom: clampZoom(modalForm.imageZoom),
                imageOffsetX: clampOffset(modalForm.imageOffsetX),
                imageOffsetY: clampOffset(modalForm.imageOffsetY),
                visible: modalForm.visible !== false,
              }
            : item
        );
      }

      if (target.type === "missionVisionBadge" || target.type === "missionVisionHeader") {
        nextForm = {
          ...nextForm,
          missionVisionBadge: modalForm.missionVisionBadge || "",
          missionVisionTitle: modalForm.missionVisionTitle || "",
        };
      }

      if (target.type === "missionVision") {
        nextForm.missionVision = nextForm.missionVision.map((item, index) =>
          index === target.index
            ? {
                ...item,
                ...modalForm,
                visible: modalForm.visible !== false,
              }
            : item
        );
      }

      if (target.type === "journeyBadge" || target.type === "journeyHeader") {
        nextForm = {
          ...nextForm,
          journeyBadge: modalForm.journeyBadge || "",
          journeyTitle: modalForm.journeyTitle || "",
        };
      }

      if (target.type === "journeyItem") {
        nextForm.journey = nextForm.journey.map((item, index) =>
          index === target.index
            ? {
                ...item,
                ...modalForm,
                visible: modalForm.visible !== false,
              }
            : item
        );
      }

      if (target.type === "ctaBand") {
        nextForm = {
          ...nextForm,
          ctaTitle: modalForm.ctaTitle || "",
          ctaDescription: modalForm.ctaDescription || "",
          ctaButtonText: modalForm.ctaButtonText || "",
          ctaButtonLink: modalForm.ctaButtonLink || "/contact",
        };
      }

      if (target.type === "statsCard") {
        nextForm.stats = nextForm.stats.map((item, index) =>
          index === target.index
            ? {
                ...item,
                ...modalForm,
                value:
                  modalForm.value === ""
                    ? 0
                    : Number(modalForm.value),
                decimals: Number(modalForm.decimals) || 0,
                visible: modalForm.visible !== false,
              }
            : item
        );
      }

      await saveContentToBackend(
        mergeAboutContent(nextForm),
        "Selected About item saved successfully."
      );

      closeEditor();
    } catch (err) {
      console.error("Save selected About item error:", err);

      if (err?.response?.status === 401) {
        setError("Admin login expired or token is invalid. Please login again.");
      } else {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Could not save selected item."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const requestDelete = () => {
    if (!editingTarget) return;
    setDeleteTarget(editingTarget);
  };

  const deleteTargetItem = async () => {
    const target = deleteTarget;

    if (!target) return;

    setSaving(true);
    setSuccess("");
    setError("");

    try {
      const nextForm = mergeAboutContent(form);

      if (target.type === "statsCard") {
        nextForm.stats = nextForm.stats.filter(
          (_, index) => index !== target.index
        );
      }

      if (target.type === "pillarCard") {
        nextForm.pillars = nextForm.pillars.filter(
          (_, index) => index !== target.index
        );
      }

      if (target.type === "leadershipMessage") {
        nextForm.messages = nextForm.messages.filter(
          (_, index) => index !== target.index
        );
      }

      if (target.type === "missionVision") {
        nextForm.missionVision = nextForm.missionVision.filter(
          (_, index) => index !== target.index
        );
      }

      if (target.type === "journeyItem") {
        nextForm.journey = nextForm.journey.filter(
          (_, index) => index !== target.index
        );
      }

      await saveContentToBackend(
        mergeAboutContent(nextForm),
        "Selected About item deleted successfully."
      );

      setDeleteTarget(null);
      closeEditor();
    } catch (err) {
      console.error("Delete About item error:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Could not delete selected item."
      );
    } finally {
      setSaving(false);
    }
  };

  const addItem = async (type) => {
    setSaving(true);
    setSuccess("");
    setError("");

    try {
      let nextForm = mergeAboutContent(form);
      const id = Date.now();

      if (type === "stat") {
        nextForm.stats = [
          ...nextForm.stats,
          {
            id,
            value: 0,
            suffix: "",
            decimals: 0,
            label: "New Statistic",
            visible: true,
          },
        ];
      }

      if (type === "pillar") {
        nextForm.pillars = [
          ...nextForm.pillars,
          {
            id,
            label: "New Core Value",
            desc: "Write a short description for this core value.",
            color: CARD_COLORS[nextForm.pillars.length % CARD_COLORS.length],
            visible: true,
          },
        ];
      }

      if (type === "message") {
        nextForm.messages = [
          ...nextForm.messages,
          {
            id,
            name: "Leader Name",
            role: "Post / Designation",
            title: "Message Title",
            message: "Write the leadership message here.",
            image: "",
            imageZoom: 1,
            imageOffsetX: 0,
            imageOffsetY: 0,
            visible: true,
          },
        ];
      }

      if (type === "missionVision") {
        nextForm.missionVision = [
          ...nextForm.missionVision,
          {
            id,
            title: "New Section",
            desc: "Write the section description here.",
            color:
              CARD_COLORS[
                nextForm.missionVision.length %
                  CARD_COLORS.length
              ],
            visible: true,
          },
        ];
      }

      if (type === "journey") {
        nextForm.journey = [
          ...nextForm.journey,
          {
            id,
            year: "Year",
            title: "Journey Title",
            desc: "Write journey description here.",
            visible: true,
          },
        ];
      }

      await saveContentToBackend(
        mergeAboutContent(nextForm),
        "New About item added successfully."
      );
    } catch (err) {
      console.error("Add About item error:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Could not add item."
      );
    } finally {
      setSaving(false);
    }
  };

  const canDelete = useMemo(() => {
    if (!editingTarget) return false;

    return [
      "statsCard",
      "pillarCard",
      "leadershipMessage",
      "missionVision",
      "journeyItem",
    ].includes(editingTarget.type);
  }, [editingTarget]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-slate-50 p-6">
        <div className="rounded-3xl bg-white px-6 py-5 text-sm font-black text-slate-600 shadow-xl ring-1 ring-slate-200">
          Loading visual About editor...
        </div>
      </div>
    );
  }

  return (
    <div className="admin-about-root min-w-0 max-w-full space-y-5 overflow-x-hidden">
      <style>{`
        /* ============================================================
           ADMIN ABOUT — RESPONSIVE PREVIEW ONLY
           These rules are scoped to this admin page.
           They do not alter the public About page globally.
        ============================================================ */

        .admin-about-preview-frame,
        .admin-about-preview-frame * {
          box-sizing: border-box;
        }

        .admin-about-preview-frame {
          width: 100%;
          min-width: 0;
          max-width: 100%;
          overflow-x: hidden;
          isolation: isolate;
        }

        .admin-about-preview-frame .rr-about {
          width: 100% !important;
          min-width: 0 !important;
          max-width: 100% !important;
          overflow-x: hidden !important;
        }

        .admin-about-preview-frame img,
        .admin-about-preview-frame video,
        .admin-about-preview-frame iframe {
          max-width: 100%;
        }

        .admin-about-preview-frame [class*="min-w-"] {
          min-width: 0 !important;
        }

        .admin-about-preview-frame [class*="max-w-"] {
          max-width: 100%;
        }

        .admin-about-preview-frame h1,
        .admin-about-preview-frame h2,
        .admin-about-preview-frame h3,
        .admin-about-preview-frame h4,
        .admin-about-preview-frame p,
        .admin-about-preview-frame span,
        .admin-about-preview-frame a,
        .admin-about-preview-frame button {
          overflow-wrap: anywhere;
          word-break: normal;
        }

        /* Edit buttons must be visible/tappable on touch screens. */
        @media (max-width: 767px) {
          .admin-about-preview-frame .group .opacity-0,
          .admin-about-preview-frame .group [class*="opacity-0"],
          .admin-about-preview-frame .group [class*="group-hover:opacity"],
          .admin-about-preview-frame [class*="group-hover:opacity"] {
            opacity: 1 !important;
            visibility: visible !important;
            pointer-events: auto !important;
          }

          .admin-about-preview-frame .group .pointer-events-none,
          .admin-about-preview-frame .group [class*="pointer-events-none"] {
            pointer-events: auto !important;
          }

          .admin-about-preview-frame .group button[class*="opacity-0"],
          .admin-about-preview-frame button[class*="group-hover:opacity"],
          .admin-about-preview-frame button[class*="opacity-0"] {
            opacity: 1 !important;
            visibility: visible !important;
            pointer-events: auto !important;
          }

          /* Any responsive grid becomes a single clean mobile column. */
          .admin-about-preview-frame .rr-about [class*="grid-cols-"] {
            grid-template-columns: minmax(0, 1fr) !important;
          }

          /* Prevent fixed desktop widths from creating horizontal overflow. */
          .admin-about-preview-frame .rr-about [class*="w-\\["],
          .admin-about-preview-frame .rr-about [class*="min-w-\\["],
          .admin-about-preview-frame .rr-about [class*="basis-\\["] {
            max-width: 100% !important;
            min-width: 0 !important;
          }

          /* Large desktop padding is reduced only inside the mobile preview. */
          .admin-about-preview-frame .rr-about [class*="p-16"],
          .admin-about-preview-frame .rr-about [class*="px-16"],
          .admin-about-preview-frame .rr-about [class*="py-16"] {
            padding: 1.25rem !important;
          }

          .admin-about-preview-frame .rr-about [class*="p-12"],
          .admin-about-preview-frame .rr-about [class*="px-12"],
          .admin-about-preview-frame .rr-about [class*="py-12"] {
            padding: 1rem !important;
          }

          .admin-about-preview-frame .rr-about [class*="gap-12"],
          .admin-about-preview-frame .rr-about [class*="gap-10"] {
            gap: 1.25rem !important;
          }

          /* Mobile typography */
          .admin-about-preview-frame .rr-about h1 {
            font-size: clamp(2rem, 10vw, 3.1rem) !important;
            line-height: 1.08 !important;
          }

          .admin-about-preview-frame .rr-about h2 {
            font-size: clamp(1.55rem, 7vw, 2.25rem) !important;
            line-height: 1.12 !important;
          }

          .admin-about-preview-frame .rr-about h3 {
            line-height: 1.2 !important;
          }

          .admin-about-preview-frame .rr-about p {
            max-width: 100% !important;
          }

          /* Journey rows should not remain two-sided on a phone. */
          .admin-about-preview-frame .rr-about [class*="md\\:flex-row"],
          .admin-about-preview-frame .rr-about [class*="lg\\:flex-row"] {
            flex-direction: column !important;
          }

          /* CTA is always one column on a phone. */
          .admin-about-preview-frame .rr-about [class*="justify-between"] {
            min-width: 0 !important;
          }

          /* Absolute editor controls stay inside the phone width. */
          .admin-about-preview-frame [class*="absolute"] {
            max-width: 100%;
          }

          .admin-about-preview-frame [class*="absolute"] button,
          .admin-about-preview-frame button[class*="rounded-full"] {
            min-width: 2.25rem !important;
            min-height: 2.25rem !important;
            max-width: calc(100% - 8px) !important;
            z-index: 40 !important;
            pointer-events: auto !important;
          }

          /* Images inside cards must never force the page wider. */
          .admin-about-preview-frame .rr-about img {
            max-width: 100% !important;
          }
        }

        /* Very narrow phones (360px and below). */
        @media (max-width: 380px) {
          .admin-about-preview-frame .rr-about {
            font-size: 14px;
          }

          .admin-about-preview-frame .rr-about [class*="rounded-\\[2.5rem\\]"] {
            border-radius: 1.5rem !important;
          }

          .admin-about-preview-frame .rr-about [class*="px-8"],
          .admin-about-preview-frame .rr-about [class*="p-8"] {
            padding-left: 1rem !important;
            padding-right: 1rem !important;
          }
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[24px] border border-slate-200 p-4 shadow-sm sm:p-5 md:p-6"
        style={{
          background:
            "linear-gradient(135deg, #E8EDF5 0%, #DCE3EF 50%, #E8E0F0 100%)",
        }}
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-100 bg-purple-50 px-3 py-1.5 text-xs font-black text-purple-700">
              <Eye className="h-3.5 w-3.5" />
              Visual About Editor
            </div>

            <h2 className="mt-3 text-2xl font-black tracking-[-0.04em] text-slate-950 sm:text-3xl">
              Hover and Edit About Page
            </h2>

            <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
              The preview below uses the same About component as the public
              page. On mobile it now stacks correctly, stays inside the phone
              width, and keeps edit controls tappable.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => navigate("/admin/dashboard")}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-black text-slate-700 shadow-sm"
            >
              <ArrowLeft size={15} />
              Dashboard
            </button>

            <a
              href="/about"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-black text-slate-700 shadow-sm"
            >
              <ExternalLink size={15} />
              View Public
            </a>
          </div>
        </div>
      </motion.div>

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-2 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-bold text-green-700"
        >
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{success}</span>
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700"
        >
          <span className="shrink-0">!</span>
          <span>{error}</span>
        </motion.div>
      )}

      <div className="admin-about-preview-frame min-w-0 max-w-full overflow-x-hidden rounded-[24px] border border-slate-200 bg-white shadow-xl">
        <About
          editMode={true}
          contentOverride={form}
          onEditTarget={openEditor}
          onDeleteTarget={(target) => {
            if (target) setDeleteTarget(target);
          }}
          onAddTarget={addItem}
        />
      </div>

      <EditModal
        target={editingTarget}
        form={modalForm}
        setForm={setModalForm}
        onClose={closeEditor}
        onSave={saveSelectedPart}
        saving={saving}
        uploading={uploadingImage}
        onUpload={uploadImage}
        onDelete={requestDelete}
        canDelete={canDelete}
        imageAdjustOpen={imageAdjustOpen}
        setImageAdjustOpen={setImageAdjustOpen}
      />

      <ConfirmDelete
        target={deleteTarget}
        saving={saving}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={deleteTargetItem}
      />
    </div>
  );
}
