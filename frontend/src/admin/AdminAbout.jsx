
import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "motion/react";
import {
  AlertCircle,
  BookOpen,
  Camera,
  CheckCircle2,
  Eye,
  Image as ImageIcon,
  MessageSquareText,
  Pencil,
  Save,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";

import {
  About,
  defaultAboutContent,
  mergeAboutContent,
} from "../app/components/About";

const colors = {
  red: "#D71920",
  green: "#168A3A",
  purple: "#4B2E83",
  dark: "#0B1020",
  cyan: "#38BDF8",
  gold: "#FACC15",
};

const cardColors = [
  "#4B2E83",
  "#168A3A",
  "#D71920",
  "#38BDF8",
  "#F97316",
  "#FACC15",
  "#14B8A6",
  "#8B5CF6",
];

function Field({
  label,
  value,
  onChange,
  placeholder = "",
  textarea = false,
  type = "text",
}) {
  return (
    <div>
      <label className="block text-sm font-black mb-2 text-slate-700">
        {label}
      </label>

      {textarea ? (
        <textarea
          value={value || ""}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          rows={4}
          className="w-full px-4 py-3 rounded-2xl outline-none text-sm resize-none"
          style={{
            background: "rgba(255,255,255,0.92)",
            border: "1px solid rgba(75,46,131,0.16)",
            color: colors.dark,
          }}
        />
      ) : (
        <input
          type={type}
          value={value || ""}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 rounded-2xl outline-none text-sm"
          style={{
            background: "rgba(255,255,255,0.92)",
            border: "1px solid rgba(75,46,131,0.16)",
            color: colors.dark,
          }}
        />
      )}
    </div>
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="w-full flex items-center justify-between gap-4 rounded-2xl px-4 py-3 text-left"
      style={{
        background: checked
          ? "rgba(22,138,58,0.08)"
          : "rgba(100,116,139,0.08)",
        border: checked
          ? "1px solid rgba(22,138,58,0.18)"
          : "1px solid rgba(100,116,139,0.18)",
      }}
    >
      <span className="text-sm font-black text-slate-700">{label}</span>

      <span
        className="relative w-12 h-7 rounded-full transition-all"
        style={{
          background: checked ? colors.green : "#CBD5E1",
        }}
      >
        <span
          className="absolute top-1 w-5 h-5 rounded-full bg-white transition-all shadow"
          style={{
            left: checked ? "24px" : "4px",
          }}
        />
      </span>
    </button>
  );
}

function getUploadUrl(payload) {
  return (
    payload?.url ||
    payload?.imageUrl ||
    payload?.fileUrl ||
    payload?.data?.url ||
    payload?.data?.imageUrl ||
    payload?.data?.fileUrl ||
    payload?.data?.secure_url ||
    payload?.file?.url ||
    ""
  );
}

function getAuthHeaders() {
  const token = localStorage.getItem("adminToken");

  if (!token) return null;

  return {
    Authorization: `Bearer ${token}`,
  };
}

function clampImageOffset(value) {
  const numberValue = Number(value);

  if (!Number.isFinite(numberValue)) return 0;

  return Math.min(60, Math.max(-60, numberValue));
}

function clampImageZoom(value) {
  const numberValue = Number(value);

  if (!Number.isFinite(numberValue)) return 1;

  return Math.min(3, Math.max(1, numberValue));
}

function getCropImageStyle(source = {}) {
  const zoom = clampImageZoom(source.imageZoom);
  const x = clampImageOffset(source.imageOffsetX);
  const y = clampImageOffset(source.imageOffsetY);
  const objectX = Math.min(100, Math.max(0, 50 - x));
  const objectY = Math.min(100, Math.max(0, 50 - y));

  return {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: `${objectX}% ${objectY}%`,
    transform: `scale(${zoom})`,
    transformOrigin: "center center",
    transition:
      "transform 160ms ease-out, object-position 160ms ease-out",
    userSelect: "none",
    pointerEvents: "none",
  };
}

function getActiveImageConfig(editingTarget, modalForm) {
  const isStoryImage = editingTarget?.type === "storyImage";

  return {
    imageKey: isStoryImage ? "storyImageUrl" : "image",
    imageUrl: isStoryImage ? modalForm.storyImageUrl : modalForm.image,
    title: isStoryImage ? "Story Image Adjustment" : "Leadership Photo Adjustment",
    label: isStoryImage ? "About Story Image" : "Leadership Photo",
    shape: isStoryImage ? "landscape" : "portrait",
  };
}

function CropSlider({ label, value, min, max, step = 1, suffix = "", onChange }) {
  const numericValue = Number(value);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <label className="text-sm font-black text-slate-700">{label}</label>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500">
          {Number.isFinite(numericValue) ? numericValue.toFixed(step < 1 ? 2 : 0) : min}
          {suffix}
        </span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={Number.isFinite(numericValue) ? numericValue : min}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-sky-500"
      />
    </div>
  );
}

function AboutImageAdjustPage({
  editingTarget,
  modalForm,
  setModalForm,
  uploadImage,
  uploadingImage,
  saving,
  onClose,
  onSave,
}) {
  const dragRef = useRef(null);
  const pointersRef = useRef(new Map());
  const pinchRef = useRef(null);
  const imageConfig = getActiveImageConfig(editingTarget, modalForm);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousTouchAction = document.body.style.touchAction;
    const previousOverscroll = document.body.style.overscrollBehavior;

    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
    document.body.style.overscrollBehavior = "contain";

    const preventGesture = (event) => event.preventDefault();

    window.addEventListener("gesturestart", preventGesture, { passive: false });
    window.addEventListener("gesturechange", preventGesture, { passive: false });
    window.addEventListener("gestureend", preventGesture, { passive: false });

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.touchAction = previousTouchAction;
      document.body.style.overscrollBehavior = previousOverscroll;
      window.removeEventListener("gesturestart", preventGesture);
      window.removeEventListener("gesturechange", preventGesture);
      window.removeEventListener("gestureend", preventGesture);
    };
  }, []);

  const updateCrop = (updates) => {
    setModalForm((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const resetCrop = () => {
    updateCrop({
      imageZoom: 1,
      imageOffsetX: 0,
      imageOffsetY: 0,
    });
  };

  const getPointerDistance = (points) => {
    if (points.length < 2) return 0;

    const [first, second] = points;

    return Math.hypot(
      second.clientX - first.clientX,
      second.clientY - first.clientY
    );
  };

  const startDrag = (event) => {
    if (!imageConfig.imageUrl) return;

    event.preventDefault();
    event.stopPropagation();

    const box = event.currentTarget.getBoundingClientRect();

    pointersRef.current.set(event.pointerId, {
      clientX: event.clientX,
      clientY: event.clientY,
    });

    event.currentTarget.setPointerCapture?.(event.pointerId);

    const points = Array.from(pointersRef.current.values());

    if (points.length >= 2) {
      pinchRef.current = {
        startDistance: getPointerDistance(points),
        startZoom: clampImageZoom(modalForm.imageZoom),
      };
      dragRef.current = null;
      return;
    }

    dragRef.current = {
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startOffsetX: clampImageOffset(modalForm.imageOffsetX),
      startOffsetY: clampImageOffset(modalForm.imageOffsetY),
      boxWidth: box.width || 1,
      boxHeight: box.height || 1,
    };
  };

  const moveDrag = (event) => {
    if (!imageConfig.imageUrl) return;

    event.preventDefault();
    event.stopPropagation();

    if (pointersRef.current.has(event.pointerId)) {
      pointersRef.current.set(event.pointerId, {
        clientX: event.clientX,
        clientY: event.clientY,
      });
    }

    const points = Array.from(pointersRef.current.values());

    if (points.length >= 2 && pinchRef.current) {
      const currentDistance = getPointerDistance(points);
      const startDistance = pinchRef.current.startDistance || currentDistance || 1;
      const nextZoom =
        pinchRef.current.startZoom * (currentDistance / startDistance);

      updateCrop({
        imageZoom: clampImageZoom(nextZoom),
      });
      return;
    }

    if (!dragRef.current) return;

    const data = dragRef.current;
    const moveX = ((event.clientX - data.startClientX) / data.boxWidth) * 100;
    const moveY = ((event.clientY - data.startClientY) / data.boxHeight) * 100;

    updateCrop({
      imageOffsetX: clampImageOffset(data.startOffsetX + moveX),
      imageOffsetY: clampImageOffset(data.startOffsetY + moveY),
    });
  };

  const endDrag = (event) => {
    pointersRef.current.delete(event.pointerId);
    event.currentTarget.releasePointerCapture?.(event.pointerId);

    const points = Array.from(pointersRef.current.values());

    if (points.length < 2) {
      pinchRef.current = null;
    }

    if (dragRef.current?.pointerId === event.pointerId) {
      dragRef.current = null;
    }
  };

  const handleWheelZoom = (event) => {
    if (!imageConfig.imageUrl) return;

    event.preventDefault();
    event.stopPropagation();

    const direction = event.deltaY > 0 ? -0.1 : 0.1;
    const nextZoom = clampImageZoom(clampImageZoom(modalForm.imageZoom) + direction);

    updateCrop({
      imageZoom: nextZoom,
    });
  };

  const cropBoxClass =
    imageConfig.shape === "landscape"
      ? "relative mx-auto h-[52vh] min-h-[320px] max-h-[560px] w-full max-w-[780px] touch-none select-none overflow-hidden rounded-[32px] bg-slate-100 shadow-2xl cursor-grab active:cursor-grabbing"
      : "relative mx-auto h-[68vh] min-h-[420px] max-h-[680px] w-full max-w-[410px] touch-none select-none overflow-hidden rounded-[32px] bg-slate-100 shadow-2xl cursor-grab active:cursor-grabbing";

  const cropBoxStyle = {
    border: "3px solid rgba(255,255,255,0.88)",
    touchAction: "none",
    overscrollBehavior: "contain",
  };

  return (
    <motion.div
      className="fixed inset-0 z-[20000] flex flex-col overflow-hidden bg-slate-950 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onWheelCapture={(event) => {
        if (event.ctrlKey) event.preventDefault();
      }}
    >
      <header className="shrink-0 border-b border-white/10 bg-slate-950/96 px-4 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.18em] text-white/45">
              {imageConfig.label}
            </div>
            <h2 className="mt-1 text-2xl font-black leading-tight">
              Drag and zoom the image
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving || uploadingImage}
              className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-black text-white disabled:opacity-50"
            >
              Back to Details
            </button>

            <button
              type="button"
              onClick={onSave}
              disabled={saving || uploadingImage}
              className="rounded-2xl px-5 py-3 text-sm font-black text-slate-950 disabled:opacity-50"
              style={{
                background: `linear-gradient(135deg, ${colors.gold}, ${colors.cyan})`,
              }}
            >
              {saving ? "Saving..." : "Save This Item"}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[minmax(280px,1fr)_420px] lg:items-start">
          <section className="rounded-[34px] bg-white/8 p-4 shadow-2xl ring-1 ring-white/10 sm:p-5">
            <div
              className={cropBoxClass}
              style={cropBoxStyle}
              onPointerDown={startDrag}
              onPointerMove={moveDrag}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              onPointerLeave={endDrag}
              onWheel={handleWheelZoom}
            >
              {imageConfig.imageUrl ? (
                <img
                  src={imageConfig.imageUrl}
                  alt="About image crop preview"
                  draggable={false}
                  className="absolute inset-0"
                  style={getCropImageStyle(modalForm)}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <ImageIcon className="h-16 w-16 text-slate-300" />
                </div>
              )}

              <div className="pointer-events-none absolute inset-0">
                <div className="absolute inset-x-0 top-1/3 h-px bg-white/35" />
                <div className="absolute inset-x-0 top-2/3 h-px bg-white/35" />
                <div className="absolute inset-y-0 left-1/3 w-px bg-white/35" />
                <div className="absolute inset-y-0 left-2/3 w-px bg-white/35" />
              </div>

              <div className="pointer-events-none absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-white">
                Drag / Pinch / Wheel
              </div>
            </div>
          </section>

          <section className="rounded-[34px] bg-white p-5 text-slate-950 shadow-2xl sm:p-6">
            <div className="mb-5">
              <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                Controls
              </div>
              <p className="mt-2 text-sm font-semibold leading-relaxed text-slate-500">
                Phone: use two fingers on the image to zoom. Laptop: place the mouse over the image and use mouse wheel or trackpad. Drag the image to position it.
              </p>
            </div>

            <label
              className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl px-4 py-3 font-black"
              style={{
                background: `linear-gradient(135deg, ${colors.gold}, ${colors.cyan})`,
                color: colors.dark,
              }}
            >
              <UploadCloud className="w-4 h-4" />
              {uploadingImage ? "Uploading..." : "Upload New Image"}
              <input
                type="file"
                accept="image/*"
                disabled={uploadingImage}
                onChange={(event) => {
                  uploadImage(event.target.files?.[0]);
                  event.target.value = "";
                }}
                className="hidden"
              />
            </label>

            <div className="mt-6 space-y-5">
              <CropSlider
                label="Zoom"
                value={clampImageZoom(modalForm.imageZoom)}
                min={1}
                max={3}
                step={0.05}
                suffix="x"
                onChange={(value) => updateCrop({ imageZoom: clampImageZoom(value) })}
              />

              <CropSlider
                label="Move Left / Right"
                value={clampImageOffset(modalForm.imageOffsetX)}
                min={-60}
                max={60}
                step={1}
                onChange={(value) => updateCrop({ imageOffsetX: clampImageOffset(value) })}
              />

              <CropSlider
                label="Move Up / Down"
                value={clampImageOffset(modalForm.imageOffsetY)}
                min={-60}
                max={60}
                step={1}
                onChange={(value) => updateCrop({ imageOffsetY: clampImageOffset(value) })}
              />
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() =>
                  updateCrop({
                    imageOffsetY: clampImageOffset(clampImageOffset(modalForm.imageOffsetY) - 5),
                  })
                }
                className="rounded-xl bg-slate-100 px-3 py-3 text-xs font-black text-slate-600"
              >
                Up
              </button>

              <button
                type="button"
                onClick={resetCrop}
                disabled={saving || uploadingImage}
                className="rounded-xl px-3 py-3 text-xs font-black text-slate-950 disabled:opacity-50"
                style={{
                  background: `linear-gradient(135deg, ${colors.gold}, ${colors.cyan})`,
                }}
              >
                Reset
              </button>

              <button
                type="button"
                onClick={() =>
                  updateCrop({
                    imageOffsetY: clampImageOffset(clampImageOffset(modalForm.imageOffsetY) + 5),
                  })
                }
                className="rounded-xl bg-slate-100 px-3 py-3 text-xs font-black text-slate-600"
              >
                Down
              </button>

              <button
                type="button"
                onClick={() =>
                  updateCrop({
                    imageOffsetX: clampImageOffset(clampImageOffset(modalForm.imageOffsetX) - 5),
                  })
                }
                className="rounded-xl bg-slate-100 px-3 py-3 text-xs font-black text-slate-600"
              >
                Left
              </button>

              <div className="rounded-xl bg-slate-50 px-3 py-3 text-center text-[11px] font-black text-slate-400">
                Move
              </div>

              <button
                type="button"
                onClick={() =>
                  updateCrop({
                    imageOffsetX: clampImageOffset(clampImageOffset(modalForm.imageOffsetX) + 5),
                  })
                }
                className="rounded-xl bg-slate-100 px-3 py-3 text-xs font-black text-slate-600"
              >
                Right
              </button>
            </div>

            <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-xs font-semibold leading-relaxed text-slate-500">
              Current: Zoom {clampImageZoom(modalForm.imageZoom).toFixed(2)}x, X{" "}
              {Math.round(clampImageOffset(modalForm.imageOffsetX))}, Y{" "}
              {Math.round(clampImageOffset(modalForm.imageOffsetY))}
            </div>
          </section>
        </div>
      </main>
    </motion.div>
  );
}


function getDeleteName(target) {
  if (!target) return "this item";

  if (target.type === "pillarCard") return "this core value card";
  if (target.type === "leadershipMessage") return "this leadership message";
  if (target.type === "missionVision") return "this mission / vision card";
  if (target.type === "journeyItem") return "this journey item";

  return "this item";
}

export default function AdminAbout() {
  const [form, setForm] = useState(defaultAboutContent);
  const [loading, setLoading] = useState(false);
  const [editingTarget, setEditingTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [modalForm, setModalForm] = useState({});
  const [imageAdjustOpen, setImageAdjustOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAboutContent = async () => {
      try {
        const res = await axios.get("https://school-website-backend-ixx2.onrender.com/api/site-content/about", {
          timeout: 12000,
        });
        const savedContent = res.data?.data?.content || {};
        setForm(mergeAboutContent(savedContent));
      } catch (err) {
        console.error("Load about content error:", err);
        setError("Could not load saved about content. Default content shown.");
      } finally {
        setLoading(false);
      }
    };

    loadAboutContent();
  }, []);

  const openEditor = (target) => {
    setSuccess("");
    setError("");
    setImageAdjustOpen(false);
    setEditingTarget(target);

    if (target.type === "pageHeader") {
      setModalForm({
        pageTitle: form.pageTitle || "",
        pageSubtitle: form.pageSubtitle || "",
      });
      return;
    }

    if (target.type === "storyText") {
      setModalForm({
        storyBadge: form.storyBadge || "",
        storyTitle: form.storyTitle || "",
        paragraph1: form.storyParagraphs?.[0] || "",
        paragraph2: form.storyParagraphs?.[1] || "",
      });
      return;
    }

    if (target.type === "storyImage") {
      setModalForm({
        storyImageUrl: form.storyImageUrl || "",
        storyImageAlt: form.storyImageAlt || "",
        imageZoom: clampImageZoom(form.storyImageZoom),
        imageOffsetX: clampImageOffset(form.storyImageOffsetX),
        imageOffsetY: clampImageOffset(form.storyImageOffsetY),
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
      });
      return;
    }

    if (target.type === "pillarCard") {
      const item = form.pillars?.[target.index];

      setModalForm({
        label: item?.label || "",
        desc: item?.desc || "",
        color: item?.color || colors.green,
        visible: item?.visible !== false,
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

    if (target.type === "leadershipMessage") {
      const item = form.messages?.[target.index];

      setModalForm({
        name: item?.name || "",
        role: item?.role || "",
        title: item?.title || "",
        message: item?.message || "",
        image: item?.image || "",
        imageZoom: clampImageZoom(item?.imageZoom),
        imageOffsetX: clampImageOffset(item?.imageOffsetX),
        imageOffsetY: clampImageOffset(item?.imageOffsetY),
        visible: item?.visible !== false,
      });
      return;
    }

    if (target.type === "leadershipPhoto") {
      const item = form.messages?.[target.index];

      setModalForm({
        image: item?.image || "",
        imageZoom: clampImageZoom(item?.imageZoom),
        imageOffsetX: clampImageOffset(item?.imageOffsetX),
        imageOffsetY: clampImageOffset(item?.imageOffsetY),
      });
      return;
    }

    if (target.type === "missionVision") {
      const item = form.missionVision?.[target.index];

      setModalForm({
        title: item?.title || "",
        desc: item?.desc || "",
        color: item?.color || colors.purple,
        visible: item?.visible !== false,
      });
      return;
    }

    if (target.type === "journeyHeader") {
      setModalForm({
        timelineBadge: form.timelineBadge || "",
        journeyTitle: form.journeyTitle || "",
      });
      return;
    }

    if (target.type === "journeyItem") {
      const item = form.journey?.[target.index];

      setModalForm({
        year: item?.year || "",
        title: item?.title || "",
        desc: item?.desc || "",
        visible: item?.visible !== false,
      });
    }
  };

  const closeEditor = () => {
    if (saving || uploadingImage) return;
    setImageAdjustOpen(false);
    setEditingTarget(null);
    setModalForm({});
  };

  const preventUnsafeBackspaceNavigation = (event) => {
    if (event.key !== "Backspace") return;

    const target = event.target;
    const tagName = String(target?.tagName || "").toLowerCase();
    const isEditableField =
      tagName === "input" ||
      tagName === "textarea" ||
      target?.isContentEditable;

    if (!isEditableField) {
      event.preventDefault();
    }
  };

  const updateModalField = (name, value) => {
    setModalForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const uploadImage = async (file) => {
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSize = 6 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      setError("Please upload only PNG, JPG, or WebP image.");
      return;
    }

    if (file.size > maxSize) {
      setError("Image must be less than 6 MB.");
      return;
    }

    const authHeaders = getAuthHeaders();

    if (!authHeaders) {
      setError("Admin login expired. Please logout and login again.");
      return;
    }

    setSuccess("");
    setError("");
    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post("https://school-website-backend-ixx2.onrender.com/api/upload", formData, {
        headers: {
          ...authHeaders,
          "Content-Type": "multipart/form-data",
        },
      });

      const uploadedUrl = getUploadUrl(res.data);

      if (!uploadedUrl) {
        setError("Image uploaded but backend did not return image URL.");
        return;
      }

      const imageKey = editingTarget?.type === "storyImage" ? "storyImageUrl" : "image";

      setModalForm((prev) => ({
        ...prev,
        [imageKey]: uploadedUrl,
        imageZoom: clampImageZoom(prev.imageZoom),
        imageOffsetX: clampImageOffset(prev.imageOffsetX),
        imageOffsetY: clampImageOffset(prev.imageOffsetY),
      }));

      setSuccess("Image uploaded. Open image adjustment if needed, then click Save.");
    } catch (err) {
      console.error("About image upload error:", err);
      setError(err.response?.data?.message || "Image upload failed.");
    } finally {
      setUploadingImage(false);
    }
  };

  const saveContentToBackend = async (nextForm, message) => {
    const authHeaders = getAuthHeaders();

    if (!authHeaders) {
      setError("Admin login expired. Please logout and login again.");
      return false;
    }

    await axios.put(
      "https://school-website-backend-ixx2.onrender.com/api/site-content/about",
      {
        content: nextForm,
      },
      {
        headers: authHeaders,
      }
    );

    setForm(nextForm);
    setSuccess(message || "About page updated successfully.");
    return true;
  };

  const saveSelectedPart = async () => {
    if (!editingTarget) return;

    setSaving(true);
    setSuccess("");
    setError("");

    try {
      let nextForm = mergeAboutContent(form);

      if (editingTarget.type === "pageHeader") {
        nextForm = {
          ...nextForm,
          pageTitle: modalForm.pageTitle || "",
          pageSubtitle: modalForm.pageSubtitle || "",
        };
      }

      if (editingTarget.type === "storyText") {
        nextForm = {
          ...nextForm,
          storyBadge: modalForm.storyBadge || "",
          storyTitle: modalForm.storyTitle || "",
          storyParagraphs: [
            modalForm.paragraph1 || "",
            modalForm.paragraph2 || "",
          ],
        };
      }

      if (editingTarget.type === "storyImage") {
        nextForm = {
          ...nextForm,
          storyImageUrl: modalForm.storyImageUrl || "",
          storyImageAlt: modalForm.storyImageAlt || "",
          storyImageZoom: clampImageZoom(modalForm.imageZoom),
          storyImageOffsetX: clampImageOffset(modalForm.imageOffsetX),
          storyImageOffsetY: clampImageOffset(modalForm.imageOffsetY),
        };
      }

      if (editingTarget.type === "storyImageText") {
        nextForm = {
          ...nextForm,
          storyImageTitle: modalForm.storyImageTitle || "",
          storyImageSubtitle: modalForm.storyImageSubtitle || "",
        };
      }

      if (editingTarget.type === "pillarHeader") {
        nextForm = {
          ...nextForm,
          pillarBadge: modalForm.pillarBadge || "",
          pillarTitle: modalForm.pillarTitle || "",
        };
      }

      if (editingTarget.type === "pillarCard") {
        nextForm = {
          ...nextForm,
          pillars: nextForm.pillars.map((item, index) =>
            index === editingTarget.index
              ? {
                  ...item,
                  label: modalForm.label || "",
                  desc: modalForm.desc || "",
                  color: modalForm.color || colors.green,
                  visible: modalForm.visible !== false,
                }
              : item
          ),
        };
      }

      if (editingTarget.type === "leadershipHeader") {
        nextForm = {
          ...nextForm,
          leadershipBadge: modalForm.leadershipBadge || "",
          leadershipTitle: modalForm.leadershipTitle || "",
          leadershipDescription: modalForm.leadershipDescription || "",
        };
      }

      if (editingTarget.type === "leadershipMessage") {
        nextForm = {
          ...nextForm,
          messages: nextForm.messages.map((item, index) =>
            index === editingTarget.index
              ? {
                  ...item,
                  name: modalForm.name || "",
                  role: modalForm.role || "",
                  title: modalForm.title || "",
                  message: modalForm.message || "",
                  image: modalForm.image || "",
                  imageZoom: clampImageZoom(modalForm.imageZoom),
                  imageOffsetX: clampImageOffset(modalForm.imageOffsetX),
                  imageOffsetY: clampImageOffset(modalForm.imageOffsetY),
                  visible: modalForm.visible !== false,
                }
              : item
          ),
        };
      }

      if (editingTarget.type === "leadershipPhoto") {
        nextForm = {
          ...nextForm,
          messages: nextForm.messages.map((item, index) =>
            index === editingTarget.index
              ? {
                  ...item,
                  image: modalForm.image || "",
                  imageZoom: clampImageZoom(modalForm.imageZoom),
                  imageOffsetX: clampImageOffset(modalForm.imageOffsetX),
                  imageOffsetY: clampImageOffset(modalForm.imageOffsetY),
                }
              : item
          ),
        };
      }

      if (editingTarget.type === "missionVision") {
        nextForm = {
          ...nextForm,
          missionVision: nextForm.missionVision.map((item, index) =>
            index === editingTarget.index
              ? {
                  ...item,
                  title: modalForm.title || "",
                  desc: modalForm.desc || "",
                  color: modalForm.color || colors.purple,
                  visible: modalForm.visible !== false,
                }
              : item
          ),
        };
      }

      if (editingTarget.type === "journeyHeader") {
        nextForm = {
          ...nextForm,
          timelineBadge: modalForm.timelineBadge || "",
          journeyTitle: modalForm.journeyTitle || "",
        };
      }

      if (editingTarget.type === "journeyItem") {
        nextForm = {
          ...nextForm,
          journey: nextForm.journey.map((item, index) =>
            index === editingTarget.index
              ? {
                  ...item,
                  year: modalForm.year || "",
                  title: modalForm.title || "",
                  desc: modalForm.desc || "",
                  visible: modalForm.visible !== false,
                }
              : item
          ),
        };
      }

      const cleanContent = mergeAboutContent(nextForm);
      await saveContentToBackend(
        cleanContent,
        "Selected about item saved successfully."
      );

      setImageAdjustOpen(false);
      setEditingTarget(null);
      setModalForm({});
    } catch (err) {
      console.error("Save selected about item error:", err);

      if (err.response?.status === 401) {
        setError("Admin login expired or token is invalid. Please login again.");
      } else {
        setError(err.response?.data?.message || "Could not save selected item.");
      }
    } finally {
      setSaving(false);
    }
  };

  const deleteTargetItem = async (target) => {
    if (!target) return;

    const deletableTypes = [
      "pillarCard",
      "leadershipMessage",
      "missionVision",
      "journeyItem",
    ];

    if (!deletableTypes.includes(target.type)) return;

    setSaving(true);
    setSuccess("");
    setError("");

    try {
      let nextForm = mergeAboutContent(form);

      if (target.type === "pillarCard") {
        nextForm = {
          ...nextForm,
          pillars: nextForm.pillars.filter((_, index) => index !== target.index),
        };
      }

      if (target.type === "leadershipMessage") {
        nextForm = {
          ...nextForm,
          messages: nextForm.messages.filter((_, index) => index !== target.index),
        };
      }

      if (target.type === "missionVision") {
        nextForm = {
          ...nextForm,
          missionVision: nextForm.missionVision.filter(
            (_, index) => index !== target.index
          ),
        };
      }

      if (target.type === "journeyItem") {
        nextForm = {
          ...nextForm,
          journey: nextForm.journey.filter((_, index) => index !== target.index),
        };
      }

      const cleanContent = mergeAboutContent(nextForm);
      await saveContentToBackend(cleanContent, "Selected item deleted successfully.");

      setDeleteTarget(null);
      setEditingTarget(null);
      setModalForm({});
    } catch (err) {
      console.error("Delete selected about item error:", err);
      setError(err.response?.data?.message || "Could not delete selected item.");
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

      if (type === "pillar") {
        const nextColor = cardColors[nextForm.pillars.length % cardColors.length];

        nextForm = {
          ...nextForm,
          pillars: [
            ...nextForm.pillars,
            {
              id: Date.now(),
              icon: "award",
              label: "New Core Value",
              desc: "Write a short description for this core value.",
              color: nextColor,
              visible: true,
            },
          ],
        };
      }

      if (type === "message") {
        nextForm = {
          ...nextForm,
          messages: [
            ...nextForm.messages,
            {
              id: Date.now(),
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
          ],
        };
      }

      if (type === "missionVision") {
        const nextColor =
          cardColors[nextForm.missionVision.length % cardColors.length];

        nextForm = {
          ...nextForm,
          missionVision: [
            ...nextForm.missionVision,
            {
              id: Date.now(),
              icon: "target",
              title: "New Section",
              desc: "Write the section description here.",
              color: nextColor,
              visible: true,
            },
          ],
        };
      }

      if (type === "journey") {
        nextForm = {
          ...nextForm,
          journey: [
            ...nextForm.journey,
            {
              id: Date.now(),
              year: "Year",
              title: "Journey Title",
              desc: "Write journey description here.",
              visible: true,
            },
          ],
        };
      }

      const cleanContent = mergeAboutContent(nextForm);
      await saveContentToBackend(cleanContent, "New item added successfully.");
    } catch (err) {
      console.error("Add about item error:", err);
      setError(err.response?.data?.message || "Could not add item.");
    } finally {
      setSaving(false);
    }
  };

  const modalTitle = useMemo(() => {
    if (!editingTarget) return "";

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
      missionVision: "Edit Mission / Vision Card",
      journeyHeader: "Edit Journey Heading",
      journeyItem: "Edit Journey Item",
    };

    return titles[editingTarget.type] || "Edit About Page";
  }, [editingTarget]);

  const ModalIcon = useMemo(() => {
    if (!editingTarget) return Pencil;

    if (
      editingTarget.type === "storyImage" ||
      editingTarget.type === "leadershipPhoto"
    ) {
      return Camera;
    }

    if (
      editingTarget.type === "leadershipMessage" ||
      editingTarget.type === "leadershipHeader"
    ) {
      return MessageSquareText;
    }

    return Pencil;
  }, [editingTarget]);

  const canDeleteSelected = useMemo(() => {
    if (!editingTarget) return false;

    return [
      "pillarCard",
      "leadershipMessage",
      "missionVision",
      "journeyItem",
    ].includes(editingTarget.type);
  }, [editingTarget]);

  const needsImageUpload = useMemo(() => {
    if (!editingTarget) return false;

    return [
      "storyImage",
      "leadershipPhoto",
      "leadershipMessage",
    ].includes(editingTarget.type);
  }, [editingTarget]);
  return (
    <div className="space-y-6">

      <style>
        {`
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

            .admin-about-preview-frame .group .hidden,
            .admin-about-preview-frame .group [class*="hidden"] {
              display: inline-flex !important;
            }

            .admin-about-preview-frame [class*="absolute"] button,
            .admin-about-preview-frame button[class*="rounded-full"] {
              min-width: 2.25rem !important;
              min-height: 2.25rem !important;
              max-width: calc(100vw - 2rem) !important;
              white-space: nowrap !important;
              z-index: 30 !important;
              pointer-events: auto !important;
            }

            .admin-about-preview-frame [class*="absolute"][class*="z-50"],
            .admin-about-preview-frame [class*="absolute"][class*="z-[50]"],
            .admin-about-preview-frame [class*="absolute"][class*="z-[60]"],
            .admin-about-preview-frame [class*="absolute"][class*="z-[70]"],
            .admin-about-preview-frame [class*="absolute"][class*="z-[80]"],
            .admin-about-preview-frame [class*="absolute"][class*="z-[90]"],
            .admin-about-preview-frame [class*="absolute"][class*="z-[999]"] {
              z-index: 30 !important;
            }
          }
        `}
      </style>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[24px] p-4 sm:p-5 md:p-6"
        style={{
          background:
            "linear-gradient(135deg, #E8EDF5 0%, #DCE3EF 50%, #E8E0F0 100%)",
          border: "1px solid rgba(15,23,42,0.06)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black mb-3 bg-purple-50 text-purple-700 border border-purple-100">
              <Eye className="w-3.5 h-3.5" />
              Visual About Editor
            </div>

            <h2
              className="text-2xl md:text-3xl font-black text-slate-950"
              style={{
                fontFamily: "var(--font-display)",
                letterSpacing: "-0.04em",
              }}
            >
              Hover and Edit About Page
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Hover content to edit. Core values, messages, mission cards, and journey items also show a delete icon with confirmation.
            </p>
          </div>
        </div>

        {success && (
          <div className="mb-4 rounded-2xl px-4 py-3 flex items-center gap-2 font-semibold bg-green-50 text-green-700 border border-green-100">
            <CheckCircle2 className="w-4 h-4" />
            {success}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-2xl px-4 py-3 flex items-center gap-2 font-semibold bg-red-50 text-red-700 border border-red-100">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <div
          className="admin-about-preview-frame rounded-[2rem] overflow-x-auto"
          style={{
            background:
              "radial-gradient(circle at top left, rgba(56,189,248,0.14), transparent 34%), linear-gradient(180deg, #FFF8EE 0%, #F1ECFF 100%)",
            border: "1px solid rgba(15,23,42,0.08)",
          }}
        >
          <div className="w-full min-w-0 bg-white">
            <About
              editMode
              contentOverride={form}
              onEditTarget={openEditor}
              onDeleteTarget={(target) => setDeleteTarget(target)}
              onAddTarget={addItem}
            />
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {editingTarget && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5"
            style={{
              background: "rgba(2,6,23,0.55)",
              backdropFilter: "blur(12px)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 130, damping: 16 }}
              className="w-full max-w-xl rounded-[28px] overflow-hidden max-h-[92vh] overflow-y-auto"
              style={{
                background: "#FFFFFF",
                border: "1px solid rgba(255,255,255,0.75)",
                boxShadow: "0 42px 110px rgba(0,0,0,0.28)",
              }}
              onClick={(event) => event.stopPropagation()}
              onMouseDown={(event) => event.stopPropagation()}
              onPointerDown={(event) => event.stopPropagation()}
              onKeyDownCapture={preventUnsafeBackspaceNavigation}
            >
              <div
                className="h-1"
                style={{
                  background: `linear-gradient(90deg, ${colors.gold}, ${colors.cyan}, ${colors.green})`,
                }}
              />

              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(250,204,21,0.18), rgba(56,189,248,0.18))",
                        color: colors.dark,
                      }}
                    >
                      <ModalIcon className="w-5 h-5" />
                    </div>

                    <div>
                      <h3 className="text-xl font-black text-slate-950">
                        {modalTitle}
                      </h3>
                      <p className="text-sm text-slate-500">
                        Save only this selected About page item.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={closeEditor}
                    className="w-10 h-10 rounded-2xl flex items-center justify-center bg-slate-100 text-slate-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-5">
                  {needsImageUpload && (
                    <>
                      <div
                        className="rounded-3xl p-5"
                        style={{
                          background:
                            "linear-gradient(145deg, rgba(15,23,42,0.96), rgba(30,41,59,0.92))",
                          border: "1px solid rgba(255,255,255,0.12)",
                        }}
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-32 h-24 rounded-2xl bg-slate-900 overflow-hidden flex items-center justify-center shrink-0">
                            {modalForm.storyImageUrl || modalForm.image ? (
                              <img
                                src={modalForm.storyImageUrl || modalForm.image}
                                alt="Preview"
                                className="w-full h-full"
                                style={getCropImageStyle(modalForm)}
                              />
                            ) : (
                              <ImageIcon className="w-8 h-8 text-slate-300" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="text-white font-black">Image Preview</div>
                            <div className="text-white/55 text-sm mt-1 leading-relaxed">
                              Upload image, then open full-screen adjustment to drag and zoom.
                            </div>
                          </div>
                        </div>

                        <label
                          className="mt-5 flex items-center justify-center gap-2 rounded-2xl px-4 py-3 font-black cursor-pointer"
                          style={{
                            background: `linear-gradient(135deg, ${colors.gold}, ${colors.cyan})`,
                            color: colors.dark,
                          }}
                        >
                          <UploadCloud className="w-4 h-4" />
                          {uploadingImage ? "Uploading..." : "Upload New Image"}
                          <input
                            type="file"
                            accept="image/*"
                            disabled={uploadingImage}
                            onChange={(event) => {
                              uploadImage(event.target.files?.[0]);
                              event.target.value = "";
                            }}
                            className="hidden"
                          />
                        </label>

                        <button
                          type="button"
                          onClick={() => setImageAdjustOpen(true)}
                          disabled={uploadingImage || saving || !(modalForm.storyImageUrl || modalForm.image)}
                          className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-black disabled:opacity-50"
                          style={{
                            background: "rgba(255,255,255,0.10)",
                            color: "#FFFFFF",
                            border: "1px solid rgba(255,255,255,0.14)",
                          }}
                        >
                          <Camera className="w-4 h-4" />
                          Open Image Adjustment
                        </button>
                      </div>

                      {editingTarget.type === "storyImage" ? (
                        <>
                          <Field
                            label="Story Image URL"
                            value={modalForm.storyImageUrl}
                            onChange={(value) =>
                              updateModalField("storyImageUrl", value)
                            }
                          />

                          <Field
                            label="Image Alt Text"
                            value={modalForm.storyImageAlt}
                            onChange={(value) =>
                              updateModalField("storyImageAlt", value)
                            }
                          />
                        </>
                      ) : (
                        <Field
                          label="Image URL"
                          value={modalForm.image}
                          onChange={(value) => updateModalField("image", value)}
                        />
                      )}
                    </>
                  )}

                  {editingTarget.type === "pageHeader" && (
                    <>
                      <Field
                        label="Page Title"
                        value={modalForm.pageTitle}
                        onChange={(value) => updateModalField("pageTitle", value)}
                      />

                      <Field
                        label="Page Subtitle"
                        value={modalForm.pageSubtitle}
                        onChange={(value) =>
                          updateModalField("pageSubtitle", value)
                        }
                        textarea
                      />
                    </>
                  )}

                  {editingTarget.type === "storyText" && (
                    <>
                      <Field
                        label="Story Badge"
                        value={modalForm.storyBadge}
                        onChange={(value) => updateModalField("storyBadge", value)}
                      />

                      <Field
                        label="Story Title"
                        value={modalForm.storyTitle}
                        onChange={(value) => updateModalField("storyTitle", value)}
                      />

                      <Field
                        label="Paragraph 1"
                        value={modalForm.paragraph1}
                        onChange={(value) => updateModalField("paragraph1", value)}
                        textarea
                      />

                      <Field
                        label="Paragraph 2"
                        value={modalForm.paragraph2}
                        onChange={(value) => updateModalField("paragraph2", value)}
                        textarea
                      />
                    </>
                  )}

                  {editingTarget.type === "storyImageText" && (
                    <>
                      <Field
                        label="Image Caption Title"
                        value={modalForm.storyImageTitle}
                        onChange={(value) =>
                          updateModalField("storyImageTitle", value)
                        }
                      />

                      <Field
                        label="Image Caption Subtitle"
                        value={modalForm.storyImageSubtitle}
                        onChange={(value) =>
                          updateModalField("storyImageSubtitle", value)
                        }
                      />
                    </>
                  )}

                  {editingTarget.type === "pillarHeader" && (
                    <>
                      <Field
                        label="Core Values Badge"
                        value={modalForm.pillarBadge}
                        onChange={(value) => updateModalField("pillarBadge", value)}
                      />

                      <Field
                        label="Core Values Title"
                        value={modalForm.pillarTitle}
                        onChange={(value) => updateModalField("pillarTitle", value)}
                      />
                    </>
                  )}

                  {editingTarget.type === "pillarCard" && (
                    <>
                      <Field
                        label="Card Title"
                        value={modalForm.label}
                        onChange={(value) => updateModalField("label", value)}
                      />

                      <Field
                        label="Description"
                        value={modalForm.desc}
                        onChange={(value) => updateModalField("desc", value)}
                        textarea
                      />

                      <Field
                        label="Accent Color"
                        value={modalForm.color}
                        onChange={(value) => updateModalField("color", value)}
                        type="color"
                      />

                      <Toggle
                        label="Show this card on website"
                        checked={modalForm.visible !== false}
                        onChange={(value) => updateModalField("visible", value)}
                      />
                    </>
                  )}

                  {editingTarget.type === "leadershipHeader" && (
                    <>
                      <Field
                        label="Leadership Badge"
                        value={modalForm.leadershipBadge}
                        onChange={(value) =>
                          updateModalField("leadershipBadge", value)
                        }
                      />

                      <Field
                        label="Leadership Title"
                        value={modalForm.leadershipTitle}
                        onChange={(value) =>
                          updateModalField("leadershipTitle", value)
                        }
                      />

                      <Field
                        label="Leadership Description"
                        value={modalForm.leadershipDescription}
                        onChange={(value) =>
                          updateModalField("leadershipDescription", value)
                        }
                        textarea
                      />
                    </>
                  )}

                  {editingTarget.type === "leadershipMessage" && (
                    <>
                      <Field
                        label="Person Name"
                        value={modalForm.name}
                        onChange={(value) => updateModalField("name", value)}
                        placeholder="Example: Principal name"
                      />

                      <Field
                        label="Post / Designation"
                        value={modalForm.role}
                        onChange={(value) => updateModalField("role", value)}
                        placeholder="Example: Principal"
                      />

                      <div className="rounded-2xl bg-sky-50 px-4 py-3 text-xs font-semibold leading-relaxed text-sky-700 border border-sky-100">
                        Name and post will appear on the lower-right side of the message card and on the full message page.
                      </div>

                      <Field
                        label="Message Title"
                        value={modalForm.title}
                        onChange={(value) => updateModalField("title", value)}
                      />

                      <Field
                        label="Message"
                        value={modalForm.message}
                        onChange={(value) => updateModalField("message", value)}
                        textarea
                      />

                      <Toggle
                        label="Show this message on website"
                        checked={modalForm.visible !== false}
                        onChange={(value) => updateModalField("visible", value)}
                      />
                    </>
                  )}

                  {editingTarget.type === "missionVision" && (
                    <>
                      <Field
                        label="Title"
                        value={modalForm.title}
                        onChange={(value) => updateModalField("title", value)}
                      />

                      <Field
                        label="Description"
                        value={modalForm.desc}
                        onChange={(value) => updateModalField("desc", value)}
                        textarea
                      />

                      <Field
                        label="Accent Color"
                        value={modalForm.color}
                        onChange={(value) => updateModalField("color", value)}
                        type="color"
                      />

                      <Toggle
                        label="Show this card on website"
                        checked={modalForm.visible !== false}
                        onChange={(value) => updateModalField("visible", value)}
                      />
                    </>
                  )}

                  {editingTarget.type === "journeyHeader" && (
                    <>
                      <Field
                        label="Timeline Badge"
                        value={modalForm.timelineBadge}
                        onChange={(value) =>
                          updateModalField("timelineBadge", value)
                        }
                      />

                      <Field
                        label="Journey Title"
                        value={modalForm.journeyTitle}
                        onChange={(value) =>
                          updateModalField("journeyTitle", value)
                        }
                      />
                    </>
                  )}

                  {editingTarget.type === "journeyItem" && (
                    <>
                      <Field
                        label="Year / Label"
                        value={modalForm.year}
                        onChange={(value) => updateModalField("year", value)}
                      />

                      <Field
                        label="Title"
                        value={modalForm.title}
                        onChange={(value) => updateModalField("title", value)}
                      />

                      <Field
                        label="Description"
                        value={modalForm.desc}
                        onChange={(value) => updateModalField("desc", value)}
                        textarea
                      />

                      <Toggle
                        label="Show this timeline item on website"
                        checked={modalForm.visible !== false}
                        onChange={(value) => updateModalField("visible", value)}
                      />
                    </>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-7">
                  {canDeleteSelected && (
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(editingTarget)}
                      disabled={saving || uploadingImage}
                      className="sm:w-auto px-5 py-3 rounded-2xl text-sm font-black transition-all hover:-translate-y-0.5 disabled:opacity-60 inline-flex items-center justify-center gap-2"
                      style={{
                        background: "rgba(215,25,32,0.08)",
                        color: colors.red,
                        border: "1px solid rgba(215,25,32,0.18)",
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={closeEditor}
                    disabled={saving || uploadingImage}
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
                    onClick={saveSelectedPart}
                    disabled={saving || uploadingImage}
                    className="flex-1 py-3 rounded-2xl text-sm font-black transition-all hover:-translate-y-0.5 disabled:opacity-60 inline-flex items-center justify-center gap-2"
                    style={{
                      background: `linear-gradient(135deg, ${colors.gold}, ${colors.cyan})`,
                      color: "#020617",
                      boxShadow: "0 16px 38px rgba(56,189,248,0.24)",
                    }}
                  >
                    <Save className="w-4 h-4" />
                    {saving ? "Saving..." : "Save This Item"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {imageAdjustOpen && editingTarget && needsImageUpload && (
          <AboutImageAdjustPage
            editingTarget={editingTarget}
            modalForm={modalForm}
            setModalForm={setModalForm}
            uploadImage={uploadImage}
            uploadingImage={uploadingImage}
            saving={saving}
            onClose={() => setImageAdjustOpen(false)}
            onSave={saveSelectedPart}
          />
        )}

        {deleteTarget && (
          <motion.div
            className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-5"
            style={{
              background: "rgba(2,6,23,0.62)",
              backdropFilter: "blur(14px)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              if (!saving) setDeleteTarget(null);
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              className="w-full max-w-md rounded-[28px] bg-white overflow-hidden"
              style={{
                boxShadow: "0 42px 110px rgba(0,0,0,0.32)",
                border: "1px solid rgba(255,255,255,0.75)",
              }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="p-6">
                <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-5">
                  <Trash2 className="w-6 h-6" />
                </div>

                <h3 className="text-2xl font-black text-slate-950 mb-2">
                  Are you sure?
                </h3>

                <p className="text-sm text-slate-500 leading-relaxed mb-6">
                  This will permanently delete {getDeleteName(deleteTarget)} from the About page.
                </p>

                <div className="flex gap-3">
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => setDeleteTarget(null)}
                    className="flex-1 py-3 rounded-2xl text-sm font-black disabled:opacity-60"
                    style={{
                      background: "rgba(15,23,42,0.06)",
                      color: "rgba(15,23,42,0.68)",
                      border: "1px solid rgba(15,23,42,0.08)",
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => deleteTargetItem(deleteTarget)}
                    className="flex-1 py-3 rounded-2xl text-sm font-black disabled:opacity-60 inline-flex items-center justify-center gap-2"
                    style={{
                      background: `linear-gradient(135deg, ${colors.red}, #991B1B)`,
                      color: "#FFFFFF",
                      boxShadow: "0 16px 38px rgba(215,25,32,0.24)",
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                    {saving ? "Deleting..." : "Yes, Delete"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


