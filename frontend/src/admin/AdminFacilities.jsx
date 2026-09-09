import { useEffect, useMemo, useRef, useState } from "react";
import api from "../lib/api";
import { motion, AnimatePresence } from "motion/react";
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  Camera,
  CheckCircle2,
  ExternalLink,
  Image as ImageIcon,
  Pencil,
  Save,
  Trash2,
  UploadCloud,
  X,
  Plus,
  MapPin,
  Bus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  Facilities,
  defaultFacilitiesContent,
  mergeFacilitiesContent,
} from "../pages/Facilities";

const colors = {
  red: "#D71920",
  green: "#168A3A",
  purple: "#4B2E83",
  dark: "#0B1020",
  cyan: "#38BDF8",
  gold: "#FACC15",
};

const facilityColors = [
  "#D71920",
  "#4B2E83",
  "#168A3A",
  "#F59E0B",
  "#38BDF8",
  "#8B5CF6",
  "#14B8A6",
];

function Field({ label, value, onChange, placeholder = "", type = "text" }) {
  return (
    <div>
      <label className="block text-sm font-black mb-2 text-slate-700">
        {label}
      </label>
      <input
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-2xl outline-none text-sm"
        style={{
          background: "rgba(255,255,255,.94)",
          border: "1px solid rgba(75,46,131,.16)",
          color: colors.dark,
        }}
      />
    </div>
  );
}

function TextArea({ label, value, onChange, placeholder = "", rows = 4 }) {
  return (
    <div>
      <label className="block text-sm font-black mb-2 text-slate-700">
        {label}
      </label>
      <textarea
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-4 py-3 rounded-2xl outline-none text-sm resize-none"
        style={{
          background: "rgba(255,255,255,.94)",
          border: "1px solid rgba(75,46,131,.16)",
          color: colors.dark,
        }}
      />
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
          ? "rgba(22,138,58,.08)"
          : "rgba(100,116,139,.08)",
        border: checked
          ? "1px solid rgba(22,138,58,.18)"
          : "1px solid rgba(100,116,139,.18)",
      }}
    >
      <span className="text-sm font-black text-slate-700">{label}</span>
      <span
        className="relative w-12 h-7 rounded-full"
        style={{ background: checked ? colors.green : "#CBD5E1" }}
      >
        <span
          className="absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-all"
          style={{ left: checked ? "24px" : "4px" }}
        />
      </span>
    </button>
  );
}

function clampImageOffset(value) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.min(60, Math.max(-60, n)) : 0;
}

function clampImageZoom(value) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.min(3, Math.max(1, n)) : 1;
}

function getCropImageStyle(source = {}) {
  const zoom = clampImageZoom(source.imageZoom);
  const x = clampImageOffset(source.imageOffsetX);
  const y = clampImageOffset(source.imageOffsetY);

  return {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: `${Math.min(100, Math.max(0, 50 - x))}% ${Math.min(
      100,
      Math.max(0, 50 - y)
    )}%`,
    transform: `scale(${zoom})`,
    transformOrigin: "center center",
    userSelect: "none",
    pointerEvents: "none",
  };
}

function CropSlider({ label, value, min, max, step = 1, suffix = "", onChange }) {
  const n = Number(value);
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <label className="text-sm font-black text-slate-700">{label}</label>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500">
          {Number.isFinite(n) ? n.toFixed(step < 1 ? 1 : 0) : min}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={Number.isFinite(n) ? n : min}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-sky-500"
      />
    </div>
  );
}

function FacilityImageAdjustPage({
  modalForm,
  setModalForm,
  uploadImage,
  uploadingImage,
  saving,
  onClose,
  onSave,
}) {
  const dragRef = useRef(null);

  const updateCrop = (updates) =>
    setModalForm((prev) => ({ ...prev, ...updates }));

  const resetCrop = () =>
    updateCrop({ imageZoom: 1, imageOffsetX: 0, imageOffsetY: 0 });

  const handlePointerDown = (e) => {
    if (!modalForm.imageUrl) return;
    const box = e.currentTarget.getBoundingClientRect();
    dragRef.current = {
      x: e.clientX,
      y: e.clientY,
      ox: clampImageOffset(modalForm.imageOffsetX),
      oy: clampImageOffset(modalForm.imageOffsetY),
      w: box.width || 1,
      h: box.height || 1,
      id: e.pointerId,
    };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e) => {
    const d = dragRef.current;
    if (!d || d.id !== e.pointerId) return;
    e.preventDefault();

    updateCrop({
      imageOffsetX: clampImageOffset(
        d.ox + ((e.clientX - d.x) / d.w) * 100
      ),
      imageOffsetY: clampImageOffset(
        d.oy + ((e.clientY - d.y) / d.h) * 100
      ),
    });
  };

  const handlePointerUp = (e) => {
    if (dragRef.current?.id === e.pointerId) dragRef.current = null;
  };

  const handleWheel = (e) => {
    if (!modalForm.imageUrl) return;
    e.preventDefault();
    updateCrop({
      imageZoom: clampImageZoom(
        clampImageZoom(modalForm.imageZoom) + (e.deltaY > 0 ? -0.08 : 0.08)
      ),
    });
  };

  return (
    <motion.div
      className="fixed inset-0 z-[12000] flex flex-col overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg,#F8FAFC 0%,#FFF8EE 48%,#F1ECFF 100%)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <header
        className="shrink-0 px-4 sm:px-6 py-4"
        style={{
          background: "rgba(255,255,255,.88)",
          borderBottom: "1px solid rgba(15,23,42,.08)",
          backdropFilter: "blur(18px)",
        }}
      >
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-950">
              Adjust Facility Image
            </h2>
            <p className="text-sm font-semibold text-slate-500">
              Drag to move. Use the slider or mouse wheel to zoom.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving || uploadingImage}
              className="rounded-2xl bg-white px-4 py-3 text-sm font-black text-slate-600 shadow-sm disabled:opacity-50"
            >
              Back
            </button>
            <button
              type="button"
              onClick={onSave}
              disabled={saving || uploadingImage}
              className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-black text-slate-950 shadow-xl disabled:opacity-50"
              style={{
                background: `linear-gradient(135deg,${colors.gold},${colors.cyan})`,
              }}
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save This Item"}
            </button>
          </div>
        </div>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[minmax(0,1fr)_390px]">
          <section className="rounded-[32px] bg-slate-950 p-4 sm:p-6 shadow-2xl">
            <div
              className="relative mx-auto aspect-[4/3] max-h-[72vh] w-full max-w-[900px] overflow-hidden rounded-[28px] bg-slate-900 touch-none select-none cursor-grab active:cursor-grabbing"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onPointerLeave={handlePointerUp}
              onWheel={handleWheel}
            >
              {modalForm.imageUrl ? (
                <img
                  src={modalForm.imageUrl}
                  alt="Facility crop preview"
                  draggable={false}
                  className="absolute inset-0"
                  style={getCropImageStyle(modalForm)}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <ImageIcon className="w-16 h-16 text-slate-500" />
                </div>
              )}
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute inset-x-0 top-1/3 h-px bg-white/25" />
                <div className="absolute inset-x-0 top-2/3 h-px bg-white/25" />
                <div className="absolute inset-y-0 left-1/3 w-px bg-white/25" />
                <div className="absolute inset-y-0 left-2/3 w-px bg-white/25" />
              </div>
            </div>

            <label
              className="mt-5 flex items-center justify-center gap-2 rounded-2xl px-4 py-3 font-black cursor-pointer"
              style={{
                background: `linear-gradient(135deg,${colors.gold},${colors.cyan})`,
                color: colors.dark,
              }}
            >
              <UploadCloud className="w-4 h-4" />
              {uploadingImage ? "Uploading..." : "Upload New Image"}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                disabled={uploadingImage}
                onChange={(e) => {
                  uploadImage(e.target.files?.[0]);
                  e.target.value = "";
                }}
                className="hidden"
              />
            </label>
          </section>

          <section className="rounded-[32px] bg-white p-5 shadow-xl">
            <h3 className="mb-2 text-lg font-black text-slate-950">
              Photo Controls
            </h3>
            <p className="mb-5 text-sm font-semibold leading-relaxed text-slate-500">
              Position and zoom the image without creating white gaps.
            </p>

            <CropSlider
              label="Zoom"
              value={clampImageZoom(modalForm.imageZoom)}
              min={1}
              max={3}
              step={0.05}
              suffix="x"
              onChange={(v) => updateCrop({ imageZoom: clampImageZoom(v) })}
            />
            <div className="mt-4 space-y-4">
              <CropSlider
                label="Move Left / Right"
                value={clampImageOffset(modalForm.imageOffsetX)}
                min={-60}
                max={60}
                onChange={(v) =>
                  updateCrop({ imageOffsetX: clampImageOffset(v) })
                }
              />
              <CropSlider
                label="Move Up / Down"
                value={clampImageOffset(modalForm.imageOffsetY)}
                min={-60}
                max={60}
                onChange={(v) =>
                  updateCrop({ imageOffsetY: clampImageOffset(v) })
                }
              />
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2">
              {[
                ["Up", { imageOffsetY: -5 }],
                ["Reset", null],
                ["Down", { imageOffsetY: 5 }],
                ["Left", { imageOffsetX: -5 }],
                ["Move", null],
                ["Right", { imageOffsetX: 5 }],
              ].map(([label, change], index) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    if (!change) return resetCrop();
                    updateCrop(
                      label === "Up" || label === "Down"
                        ? {
                            imageOffsetY: clampImageOffset(
                              clampImageOffset(modalForm.imageOffsetY) +
                                change.imageOffsetY
                            ),
                          }
                        : {
                            imageOffsetX: clampImageOffset(
                              clampImageOffset(modalForm.imageOffsetX) +
                                change.imageOffsetX
                            ),
                          }
                    );
                  }}
                  className="rounded-xl px-3 py-3 text-xs font-black"
                  style={{
                    background:
                      label === "Reset"
                        ? `linear-gradient(135deg,${colors.gold},${colors.cyan})`
                        : "#F1F5F9",
                    color: "#475569",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </section>
        </div>
      </main>
    </motion.div>
  );
}

function getAuthHeaders() {
  const token = localStorage.getItem("adminToken");
  return token ? { Authorization: `Bearer ${token}` } : null;
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

function getDeleteName(target) {
  return target?.type === "facilityCard" ? "this facility" : "this item";
}

function BusRouteEditor({
  routes,
  onAddRoute,
  onEditRoute,
  onDeleteRoute,
  editingRouteId,
  setEditingRouteId,
}) {
  const [routeForm, setRouteForm] = useState({
    name: "",
    from: "",
    to: "",
    stops: [],
  });
  const [stopInput, setStopInput] = useState("");

  const editingRoute = editingRouteId
    ? routes.find((r) => r.id === editingRouteId)
    : null;

  useEffect(() => {
    setRouteForm(
      editingRoute
        ? { ...editingRoute, stops: Array.isArray(editingRoute.stops) ? editingRoute.stops : [] }
        : { name: "", from: "", to: "", stops: [] }
    );
    setStopInput("");
  }, [editingRouteId, routes]);

  const addStop = () => {
    if (!stopInput.trim()) return;
    setRouteForm((p) => ({
      ...p,
      stops: [...p.stops, stopInput.trim()],
    }));
    setStopInput("");
  };

  const saveRoute = () => {
    if (!routeForm.name.trim()) return;
    if (editingRoute) {
      onEditRoute(editingRoute.id, routeForm);
    } else {
      onAddRoute({ ...routeForm, id: Date.now() });
    }
    setEditingRouteId(null);
    setRouteForm({ name: "", from: "", to: "", stops: [] });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-slate-700 flex items-center gap-2">
          <Bus className="w-4 h-4" />
          Bus Routes
        </h4>
        <span className="text-sm text-slate-500">{routes.length} routes</span>
      </div>

      {routes.map((route) => (
        <div
          key={route.id}
          className="rounded-2xl p-4 border"
          style={{
            background:
              editingRouteId === route.id
                ? "rgba(56,189,248,.05)"
                : "rgba(255,255,255,.92)",
            borderColor:
              editingRouteId === route.id
                ? "rgba(56,189,248,.5)"
                : "rgba(75,46,131,.12)",
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="font-bold text-slate-800">{route.name}</div>
              <div className="flex items-center gap-2 text-xs text-slate-600 mt-1">
                <MapPin className="w-3 h-3" />
                <span>{route.from || "Not set"}</span>
                <span>→</span>
                <span>{route.to || "Not set"}</span>
              </div>
              {route.stops?.length > 0 && (
                <div className="mt-2 space-y-1">
                  {route.stops.map((stop, i) => (
                    <div key={i} className="text-xs text-slate-500">
                      • {stop}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setEditingRouteId(route.id)}
                className="p-2 rounded-xl hover:bg-slate-100"
              >
                <Pencil className="w-4 h-4 text-purple-700" />
              </button>
              <button
                type="button"
                onClick={() => onDeleteRoute(route.id)}
                className="p-2 rounded-xl hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </button>
            </div>
          </div>
        </div>
      ))}

      <div className="rounded-2xl p-4 border border-slate-200">
        <div className="font-bold text-sm text-slate-700 mb-3">
          {editingRoute ? "Edit Route" : "Add New Route"}
        </div>
        <div className="space-y-3">
          <Field
            label="Route Name"
            value={routeForm.name}
            onChange={(v) => setRouteForm((p) => ({ ...p, name: v }))}
            placeholder="e.g. Route 1"
          />
          <Field
            label="Starting Point"
            value={routeForm.from}
            onChange={(v) => setRouteForm((p) => ({ ...p, from: v }))}
          />
          <Field
            label="Destination"
            value={routeForm.to}
            onChange={(v) => setRouteForm((p) => ({ ...p, to: v }))}
          />
          <div>
            <label className="block text-sm font-black mb-2 text-slate-700">
              Stops
            </label>
            <div className="flex gap-2">
              <input
                value={stopInput}
                onChange={(e) => setStopInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addStop();
                  }
                }}
                className="flex-1 px-4 py-3 rounded-2xl outline-none text-sm border border-slate-200"
                placeholder="Add a stop"
              />
              <button
                type="button"
                onClick={addStop}
                className="px-4 rounded-2xl font-black"
                style={{
                  background: `linear-gradient(135deg,${colors.gold},${colors.cyan})`,
                }}
              >
                Add
              </button>
            </div>
            {routeForm.stops.length > 0 && (
              <div className="mt-2 space-y-1">
                {routeForm.stops.map((stop, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2"
                  >
                    <span className="text-sm">{stop}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setRouteForm((p) => ({
                          ...p,
                          stops: p.stops.filter((_, index) => index !== i),
                        }))
                      }
                    >
                      <X className="w-3 h-3 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            {editingRoute && (
              <button
                type="button"
                onClick={() => setEditingRouteId(null)}
                className="flex-1 py-3 rounded-2xl font-black bg-slate-100 text-slate-600"
              >
                Cancel
              </button>
            )}
            <button
              type="button"
              onClick={saveRoute}
              className="flex-1 py-3 rounded-2xl font-black"
              style={{
                background: `linear-gradient(135deg,${colors.gold},${colors.cyan})`,
              }}
            >
              {editingRoute ? "Update Route" : "Add Route"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingFacilitiesEditor() {
  return (
    <div
      className="min-h-[60vh] flex items-center justify-center p-6"
      style={{
        background:
          "linear-gradient(180deg,rgba(255,248,238,.95),rgba(241,236,255,.95))",
      }}
    >
      <div className="w-full max-w-md rounded-[28px] bg-white p-8 text-center shadow-xl border border-slate-100">
        <div
          className="mx-auto mb-5 h-12 w-12 rounded-full border-4 border-slate-200 border-t-purple-600 animate-spin"
        />
        <h2 className="text-xl font-black text-slate-950">
          Loading Facilities
        </h2>
        <p className="mt-2 text-sm font-semibold text-slate-500">
          Loading the saved Facilities content...
        </p>
      </div>
    </div>
  );
}

export default function AdminFacilities() {
  const navigate = useNavigate();

  /*
   * IMPORTANT FIX:
   * Do NOT initialize this with defaultFacilitiesContent.
   * The old code rendered defaults immediately, then replaced them
   * when the API response arrived. That caused the 2–3 second flash.
   *
   * null means "the real saved content has not been loaded yet".
   */
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  const [editingTarget, setEditingTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [modalForm, setModalForm] = useState({});
  const [imageAdjustOpen, setImageAdjustOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [editingRouteId, setEditingRouteId] = useState(null);

  useEffect(() => {
    let alive = true;

    const loadFacilitiesContent = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await api.get("/api/site-content/facilities", {
          timeout: 20000,
        });

        if (!alive) return;

        const savedContent =
          res?.data?.data?.content ||
          res?.data?.content ||
          {};

        /*
         * Merge only after the API response exists.
         * Facilities is NOT mounted before this state is set.
         */
        setForm(mergeFacilitiesContent(savedContent));
      } catch (err) {
        console.error("Load facilities content error:", err);

        if (!alive) return;

        /*
         * Only use defaults after the API request genuinely fails.
         * This prevents the default content from flashing first.
         */
        setForm(mergeFacilitiesContent(defaultFacilitiesContent));
        setError(
          "Could not load saved facilities content. Default content is being used."
        );
      } finally {
        if (alive) setLoading(false);
      }
    };

    loadFacilitiesContent();

    return () => {
      alive = false;
    };
  }, []);

  const updateModalField = (name, value) => {
    setModalForm((prev) => ({ ...prev, [name]: value }));
  };

  const openEditor = (target) => {
    if (!form) return;

    setSuccess("");
    setError("");
    setEditingTarget(target);
    setImageAdjustOpen(false);
    setEditingRouteId(null);

    if (target.type === "pageHeader") {
      setModalForm({
        badgeText: form.badgeText || "",
        title: form.title || "",
        highlightedText: form.highlightedText || "",
        subtitle: form.subtitle || "",
        learnMoreText: form.learnMoreText || "",
        highlightsTitle: form.highlightsTitle || "",
      });
      return;
    }

    if (target.type === "pageIntro") {
      setModalForm({
        introBadge: form.introBadge || "",
        introTitle: form.introTitle || "",
        introHighlightedText: form.introHighlightedText || "",
        introDescription: form.introDescription || "",
      });
      return;
    }

    if (target.type === "facilitySectionHeader") {
      setModalForm({
        sectionKicker: form.sectionKicker || "",
        sectionTitle: form.sectionTitle || "",
        sectionHighlightedText: form.sectionHighlightedText || "",
        sectionSubtitle: form.sectionSubtitle || "",
      });
      return;
    }

    if (
      target.type === "facilityCard" ||
      target.type === "facilityImage"
    ) {
      const item = form.facilities?.[target.index] || {};

      setModalForm({
        title: item.title || "",
        category: item.category || "",
        description: item.description || "",
        details: item.details || "",
        imageUrl: item.imageUrl || "",
        imageZoom: clampImageZoom(item.imageZoom),
        imageOffsetX: clampImageOffset(item.imageOffsetX),
        imageOffsetY: clampImageOffset(item.imageOffsetY),
        color: item.color || colors.green,
        visible: item.visible !== false,
        busRoutes: Array.isArray(item.busRoutes) ? item.busRoutes : [],
      });
    }
  };

  const closeEditor = () => {
    if (saving || uploadingImage) return;
    setImageAdjustOpen(false);
    setEditingTarget(null);
    setModalForm({});
    setEditingRouteId(null);
  };

  const saveContentToBackend = async (nextForm, message) => {
    const authHeaders = getAuthHeaders();

    if (!authHeaders) {
      setError("Admin login expired. Please logout and login again.");
      return false;
    }

    await api.put(
      "/api/site-content/facilities",
      { content: nextForm },
      { headers: authHeaders }
    );

    setForm(mergeFacilitiesContent(nextForm));
    setSuccess(message || "Facilities page updated successfully.");
    return true;
  };

  const uploadImage = async (file) => {
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Please upload only PNG, JPG, or WebP image.");
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

    setSuccess("");
    setError("");
    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post("/api/upload", formData, {
        headers: {
          ...authHeaders,
          "Content-Type": "multipart/form-data",
        },
      });

      const uploadedUrl = getUploadUrl(res.data);

      if (!uploadedUrl) {
        setError("Image uploaded but backend did not return an image URL.");
        return;
      }

      setModalForm((prev) => ({
        ...prev,
        imageUrl: uploadedUrl,
        imageZoom: 1,
        imageOffsetX: 0,
        imageOffsetY: 0,
      }));

      setImageAdjustOpen(true);
    } catch (err) {
      console.error("Facility image upload error:", err);
      setError(err.response?.data?.message || "Image upload failed.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddBusRoute = (newRoute) => {
    updateModalField("busRoutes", [
      ...(modalForm.busRoutes || []),
      newRoute,
    ]);
  };

  const handleEditBusRoute = (routeId, updatedRoute) => {
    updateModalField(
      "busRoutes",
      (modalForm.busRoutes || []).map((route) =>
        route.id === routeId ? { ...route, ...updatedRoute } : route
      )
    );
  };

  const handleDeleteBusRoute = (routeId) => {
    updateModalField(
      "busRoutes",
      (modalForm.busRoutes || []).filter((route) => route.id !== routeId)
    );
  };

  const saveSelectedPart = async () => {
    if (!editingTarget || !form) return;

    setSaving(true);
    setSuccess("");
    setError("");

    try {
      let nextForm = mergeFacilitiesContent(form);

      if (editingTarget.type === "pageHeader") {
        nextForm = {
          ...nextForm,
          badgeText: modalForm.badgeText || "",
          title: modalForm.title || "",
          highlightedText: modalForm.highlightedText || "",
          subtitle: modalForm.subtitle || "",
          learnMoreText: modalForm.learnMoreText || "",
          highlightsTitle: modalForm.highlightsTitle || "",
        };
      }

      if (editingTarget.type === "pageIntro") {
        nextForm = {
          ...nextForm,
          introBadge: modalForm.introBadge || "",
          introTitle: modalForm.introTitle || "",
          introHighlightedText: modalForm.introHighlightedText || "",
          introDescription: modalForm.introDescription || "",
        };
      }

      if (editingTarget.type === "facilitySectionHeader") {
        nextForm = {
          ...nextForm,
          sectionKicker: modalForm.sectionKicker || "",
          sectionTitle: modalForm.sectionTitle || "",
          sectionHighlightedText: modalForm.sectionHighlightedText || "",
          sectionSubtitle: modalForm.sectionSubtitle || "",
        };
      }

      if (
        editingTarget.type === "facilityCard" ||
        editingTarget.type === "facilityImage"
      ) {
        nextForm = {
          ...nextForm,
          facilities: nextForm.facilities.map((item, index) =>
            index === editingTarget.index
              ? {
                  ...item,
                  title: modalForm.title || "",
                  category: modalForm.category || "",
                  description: modalForm.description || "",
                  details: modalForm.details || "",
                  imageUrl: modalForm.imageUrl || "",
                  imageZoom: clampImageZoom(modalForm.imageZoom),
                  imageOffsetX: clampImageOffset(modalForm.imageOffsetX),
                  imageOffsetY: clampImageOffset(modalForm.imageOffsetY),
                  color: modalForm.color || colors.green,
                  visible: modalForm.visible !== false,
                  busRoutes: modalForm.busRoutes || [],
                }
              : item
          ),
        };
      }

      await saveContentToBackend(
        mergeFacilitiesContent(nextForm),
        "Selected facilities item saved successfully."
      );

      setImageAdjustOpen(false);
      setEditingTarget(null);
      setModalForm({});
      setEditingRouteId(null);
    } catch (err) {
      console.error("Save selected facilities item error:", err);

      if (err.response?.status === 401) {
        setError("Admin login expired or token is invalid. Please login again.");
      } else {
        setError(
          err.response?.data?.message || "Could not save selected item."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const addFacility = async () => {
    if (!form) return;

    setSaving(true);
    setSuccess("");
    setError("");

    try {
      const newFacility = {
        id: Date.now(),
        emoji: "🏫",
        title: "New Facility",
        category: "School Facility",
        description: "Short facility description.",
        details: "Detailed facility highlights.",
        imageUrl: "",
        imageZoom: 1,
        imageOffsetX: 0,
        imageOffsetY: 0,
        color:
          facilityColors[form.facilities.length % facilityColors.length],
        visible: true,
        busRoutes: [],
      };

      await saveContentToBackend(
        mergeFacilitiesContent({
          ...form,
          facilities: [...form.facilities, newFacility],
        }),
        "New facility added successfully."
      );
    } catch (err) {
      console.error("Add facility error:", err);
      setError(err.response?.data?.message || "Could not add facility.");
    } finally {
      setSaving(false);
    }
  };

  const deleteTargetItem = async (target) => {
    if (!target || target.type !== "facilityCard" || !form) return;

    setSaving(true);
    setSuccess("");
    setError("");

    try {
      const nextFacilities = form.facilities.filter(
        (_, index) => index !== target.index
      );

      await saveContentToBackend(
        mergeFacilitiesContent({
          ...form,
          facilities: nextFacilities,
        }),
        "Facility deleted successfully."
      );

      setDeleteTarget(null);
      setEditingTarget(null);
      setModalForm({});
      setEditingRouteId(null);
      setImageAdjustOpen(false);
    } catch (err) {
      console.error("Delete facility error:", err);
      setError(err.response?.data?.message || "Could not delete facility.");
    } finally {
      setSaving(false);
    }
  };

  const modalTitle = useMemo(() => {
    if (!editingTarget) return "";
    if (editingTarget.type === "pageHeader") return "Edit Facilities Heading";
    if (editingTarget.type === "pageIntro")
      return "Edit Life Beyond The Classroom";
    if (editingTarget.type === "facilitySectionHeader")
      return "Edit Facility Highlights Heading";
    if (editingTarget.type === "facilityImage")
      return "Change Facility Image";
    return "Edit Facility Card";
  }, [editingTarget]);

  const needsImageUpload =
    editingTarget?.type === "facilityCard" ||
    editingTarget?.type === "facilityImage";

  const ModalIcon =
    editingTarget?.type === "facilityImage"
      ? Camera
      : editingTarget?.type === "facilityCard"
      ? Building2
      : Pencil;

  const isBusFacility = useMemo(() => {
    if (!editingTarget || editingTarget.type !== "facilityCard") return false;

    return (
      (modalForm.busRoutes || []).length > 0 ||
      /transport|bus/i.test(String(modalForm.title || ""))
    );
  }, [editingTarget, modalForm.busRoutes, modalForm.title]);

  /*
   * IMPORTANT FIX:
   * Facilities is not rendered at all while the API request is pending.
   * This removes the old-content -> new-content flash.
   */
  if (loading || !form) {
    return <LoadingFacilitiesEditor />;
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[24px] p-4 sm:p-5 md:p-6"
        style={{
          background:
            "linear-gradient(135deg,#E8EDF5 0%,#DCE3EF 50%,#E8E0F0 100%)",
          border: "1px solid rgba(15,23,42,.06)",
          boxShadow: "0 4px 20px rgba(0,0,0,.04)",
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black mb-3 bg-green-50 text-green-700 border border-green-100">
              <Building2 className="w-3.5 h-3.5" />
              Visual Facilities Editor
            </div>

            <h2
              className="text-2xl md:text-3xl font-black text-slate-950"
              style={{
                fontFamily: "var(--font-display)",
                letterSpacing: "-0.04em",
              }}
            >
              Hover and Edit Facilities Page
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Hover headings or facility cards. Use pencil, camera, and trash
              controls to manage the saved content.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate("/admin/dashboard")}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-black bg-white text-slate-700 border border-slate-100"
            >
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </button>

            <a
              href="/facilities"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-black bg-white text-slate-700 border border-slate-100"
            >
              <ExternalLink className="w-4 h-4" />
              View Page
            </a>
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
          className="admin-facilities-preview-frame rounded-[2rem] overflow-x-auto"
          style={{
            background:
              "radial-gradient(circle at top left,rgba(56,189,248,.14),transparent 34%),linear-gradient(180deg,#FFF8EE 0%,#F1ECFF 100%)",
            border: "1px solid rgba(15,23,42,.08)",
          }}
        >
          <div className="w-full min-w-0 bg-white">
            {/*
             * The saved API content is now the first content Facilities
             * ever receives. There is no default-content flash.
             */}
            <Facilities
              key="loaded-facilities"
              editMode
              contentOverride={form}
              onEditTarget={openEditor}
              onDeleteTarget={setDeleteTarget}
              onAddTarget={addFacility}
            />
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {editingTarget && imageAdjustOpen && needsImageUpload && (
          <FacilityImageAdjustPage
            modalForm={modalForm}
            setModalForm={setModalForm}
            uploadImage={uploadImage}
            uploadingImage={uploadingImage}
            saving={saving}
            onClose={() => setImageAdjustOpen(false)}
            onSave={saveSelectedPart}
          />
        )}

        {editingTarget && !imageAdjustOpen && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5"
            style={{
              background: "rgba(2,6,23,.55)",
              backdropFilter: "blur(12px)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeEditor}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 130, damping: 16 }}
              className="w-full max-w-xl rounded-[28px] overflow-hidden max-h-[92vh] overflow-y-auto bg-white"
              style={{
                border: "1px solid rgba(255,255,255,.75)",
                boxShadow: "0 42px 110px rgba(0,0,0,.28)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="h-1"
                style={{
                  background: `linear-gradient(90deg,${colors.gold},${colors.cyan},${colors.green})`,
                }}
              />

              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center"
                      style={{
                        background:
                          "linear-gradient(135deg,rgba(250,204,21,.18),rgba(56,189,248,.18))",
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
                        Save only this selected Facilities item.
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
                            "linear-gradient(145deg,rgba(15,23,42,.96),rgba(30,41,59,.92))",
                        }}
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-28 w-36 shrink-0 overflow-hidden rounded-2xl bg-white">
                            {modalForm.imageUrl ? (
                              <img
                                src={modalForm.imageUrl}
                                alt="Facility preview"
                                draggable={false}
                                className="h-full w-full"
                                style={getCropImageStyle(modalForm)}
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <ImageIcon className="w-8 h-8 text-slate-300" />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="text-white font-black">
                              Image Preview
                            </div>
                            <div className="text-white/55 text-sm mt-1 leading-relaxed">
                              Upload an image and adjust its crop before saving.
                            </div>
                          </div>
                        </div>

                        <label
                          className="mt-5 flex items-center justify-center gap-2 rounded-2xl px-4 py-3 font-black cursor-pointer"
                          style={{
                            background: `linear-gradient(135deg,${colors.gold},${colors.cyan})`,
                            color: colors.dark,
                          }}
                        >
                          <UploadCloud className="w-4 h-4" />
                          {uploadingImage ? "Uploading..." : "Upload New Image"}
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            disabled={uploadingImage}
                            onChange={(e) => {
                              uploadImage(e.target.files?.[0]);
                              e.target.value = "";
                            }}
                            className="hidden"
                          />
                        </label>

                        <button
                          type="button"
                          onClick={() => setImageAdjustOpen(true)}
                          disabled={!modalForm.imageUrl || saving || uploadingImage}
                          className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-black disabled:opacity-45"
                          style={{
                            background: "rgba(255,255,255,.10)",
                            color: "#fff",
                            border: "1px solid rgba(255,255,255,.16)",
                          }}
                        >
                          <Camera className="w-4 h-4" />
                          Open Image Adjustment
                        </button>
                      </div>

                      <Field
                        label="Image URL"
                        value={modalForm.imageUrl}
                        onChange={(v) => updateModalField("imageUrl", v)}
                      />
                    </>
                  )}

                  {editingTarget.type === "pageHeader" && (
                    <>
                      <Field
                        label="Badge Text"
                        value={modalForm.badgeText}
                        onChange={(v) => updateModalField("badgeText", v)}
                      />
                      <Field
                        label="Main Title"
                        value={modalForm.title}
                        onChange={(v) => updateModalField("title", v)}
                      />
                      <Field
                        label="Red Highlight Text"
                        value={modalForm.highlightedText}
                        onChange={(v) =>
                          updateModalField("highlightedText", v)
                        }
                      />
                      <TextArea
                        label="Subtitle"
                        value={modalForm.subtitle}
                        onChange={(v) => updateModalField("subtitle", v)}
                      />
                      <Field
                        label="Card Button Text"
                        value={modalForm.learnMoreText}
                        onChange={(v) =>
                          updateModalField("learnMoreText", v)
                        }
                      />
                      <Field
                        label="Modal Details Title"
                        value={modalForm.highlightsTitle}
                        onChange={(v) =>
                          updateModalField("highlightsTitle", v)
                        }
                      />
                    </>
                  )}

                  {editingTarget.type === "pageIntro" && (
                    <>
                      <Field
                        label="Section Label"
                        value={modalForm.introBadge}
                        onChange={(v) => updateModalField("introBadge", v)}
                      />
                      <Field
                        label="Section Title"
                        value={modalForm.introTitle}
                        onChange={(v) => updateModalField("introTitle", v)}
                      />
                      <Field
                        label="Red Highlight Text"
                        value={modalForm.introHighlightedText}
                        onChange={(v) =>
                          updateModalField("introHighlightedText", v)
                        }
                      />
                      <TextArea
                        label="Section Description"
                        value={modalForm.introDescription}
                        onChange={(v) =>
                          updateModalField("introDescription", v)
                        }
                        rows={5}
                      />
                    </>
                  )}

                  {editingTarget.type === "facilitySectionHeader" && (
                    <>
                      <Field
                        label="Section Kicker"
                        value={modalForm.sectionKicker}
                        onChange={(v) =>
                          updateModalField("sectionKicker", v)
                        }
                      />
                      <Field
                        label="Section Title"
                        value={modalForm.sectionTitle}
                        onChange={(v) =>
                          updateModalField("sectionTitle", v)
                        }
                      />
                      <Field
                        label="Red Highlight Text"
                        value={modalForm.sectionHighlightedText}
                        onChange={(v) =>
                          updateModalField("sectionHighlightedText", v)
                        }
                      />
                      <TextArea
                        label="Section Description"
                        value={modalForm.sectionSubtitle}
                        onChange={(v) =>
                          updateModalField("sectionSubtitle", v)
                        }
                        rows={4}
                      />
                    </>
                  )}

                  {(editingTarget.type === "facilityCard" ||
                    editingTarget.type === "facilityImage") && (
                    <>
                      <Field
                        label="Facility Title"
                        value={modalForm.title}
                        onChange={(v) => updateModalField("title", v)}
                      />
                      <Field
                        label="Category"
                        value={modalForm.category}
                        onChange={(v) => updateModalField("category", v)}
                      />
                      <Field
                        label="Accent Color"
                        type="color"
                        value={modalForm.color}
                        onChange={(v) => updateModalField("color", v)}
                      />
                      <TextArea
                        label="Short Description"
                        value={modalForm.description}
                        onChange={(v) =>
                          updateModalField("description", v)
                        }
                        rows={3}
                      />
                      <TextArea
                        label="Popup Details"
                        value={modalForm.details}
                        onChange={(v) => updateModalField("details", v)}
                        rows={5}
                      />

                      {isBusFacility && (
                        <BusRouteEditor
                          routes={modalForm.busRoutes || []}
                          onAddRoute={handleAddBusRoute}
                          onEditRoute={handleEditBusRoute}
                          onDeleteRoute={handleDeleteBusRoute}
                          editingRouteId={editingRouteId}
                          setEditingRouteId={setEditingRouteId}
                        />
                      )}

                      <Toggle
                        label="Show this facility on website"
                        checked={modalForm.visible !== false}
                        onChange={(v) => updateModalField("visible", v)}
                      />
                    </>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-7">
                  {editingTarget.type === "facilityCard" && (
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(editingTarget)}
                      disabled={saving || uploadingImage}
                      className="sm:w-auto px-5 py-3 rounded-2xl text-sm font-black inline-flex items-center justify-center gap-2 disabled:opacity-60"
                      style={{
                        background: "rgba(215,25,32,.08)",
                        color: colors.red,
                        border: "1px solid rgba(215,25,32,.18)",
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
                    className="flex-1 py-3 rounded-2xl text-sm font-black disabled:opacity-60"
                    style={{
                      background: "rgba(15,23,42,.06)",
                      color: "rgba(15,23,42,.65)",
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={saveSelectedPart}
                    disabled={saving || uploadingImage}
                    className="flex-1 py-3 rounded-2xl text-sm font-black inline-flex items-center justify-center gap-2 disabled:opacity-60"
                    style={{
                      background: `linear-gradient(135deg,${colors.gold},${colors.cyan})`,
                      color: "#020617",
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

        {deleteTarget && (
          <motion.div
            className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-5"
            style={{
              background: "rgba(2,6,23,.62)",
              backdropFilter: "blur(14px)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !saving && setDeleteTarget(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              className="w-full max-w-md rounded-[28px] bg-white overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-5">
                  <Trash2 className="w-6 h-6" />
                </div>

                <h3 className="text-2xl font-black text-slate-950 mb-2">
                  Are you sure?
                </h3>

                <p className="text-sm text-slate-500 leading-relaxed mb-6">
                  This will permanently delete{" "}
                  {getDeleteName(deleteTarget)} from the Facilities page.
                </p>

                <div className="flex gap-3">
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => setDeleteTarget(null)}
                    className="flex-1 py-3 rounded-2xl text-sm font-black bg-slate-100 text-slate-600 disabled:opacity-60"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => deleteTargetItem(deleteTarget)}
                    className="flex-1 py-3 rounded-2xl text-sm font-black text-white inline-flex items-center justify-center gap-2 disabled:opacity-60"
                    style={{
                      background: `linear-gradient(135deg,${colors.red},#991B1B)`,
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
