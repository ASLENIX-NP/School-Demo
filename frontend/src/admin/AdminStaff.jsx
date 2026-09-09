import { useEffect, useMemo, useRef, useState } from "react";
import api from "../lib/api";
import { motion, AnimatePresence } from "motion/react";
import {
  AlertCircle,
  ArrowLeft,
  Camera,
  CheckCircle2,
  ExternalLink,
  Image as ImageIcon,
  Pencil,
  Plus,
  Save,
  Trash2,
  UploadCloud,
  UserRound,
  Users,
  X,
  GripVertical,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  Staff,
  ACCENTS,
  defaultStaffContent,
  mergeStaffContent,
} from "../pages/Staff";

const colors = {
  red: "#D71920",
  green: "#168A3A",
  purple: "#4B2E83",
  dark: "#0B1020",
  cyan: "#38BDF8",
  gold: "#FACC15",
  cream: "#FFF8EE",
};

const DEFAULT_DEPARTMENTS = [
  "Science Department",
  "Mathematics Department",
  "English Department",
  "Language Department",
  "Social Studies Department",
  "Computer & Technology Department",
  "Primary Department",
  "School Leadership",
  "Student Support & Administration",
];

const LEGACY_DEPARTMENTS = new Set([
  "Senior Teachers & Department Heads",
  "Primary & Junior Faculty",
  "Faculty Members",
  "Support Staff",
]);

const DEPARTMENT_DESCRIPTIONS = {
  "Science Department": "Exploring science through experiments, observation, discovery, and practical learning.",
  "Mathematics Department": "Building logical thinking, problem-solving skills, numerical confidence, and mathematical reasoning.",
  "English Department": "Developing communication, reading, writing, literature, confidence, and creative expression.",
  "Language Department": "Strengthening language skills, communication, literature, and cultural understanding.",
  "Social Studies Department": "Understanding society, history, civics, geography, culture, and responsible citizenship.",
  "Computer & Technology Department": "Preparing students with digital literacy, computing skills, technology, and responsible digital learning.",
  "Primary Department": "Nurturing young learners with strong foundations, curiosity, confidence, and care.",
  "School Leadership": "Leading the school community with vision, responsibility, and commitment to student success.",
  "Student Support & Administration": "Supporting student wellbeing, communication, activities, and the systems that keep school life organised.",
};

const normalizeText = (value) => String(value || "").trim();

function cleanImageUrl(value) {
  if (!value) return "";
  let url = String(value).trim();
  url = url.replace(/^['"`]+|['"`]+$/g, "");
  url = url.replace(/^\!\[[^\]]*\]\((.*)\)$/s, "$1");
  if (url.startsWith("//")) url = `https:${url}`;
  return url;
}

function clampImageOffset(value) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.min(60, Math.max(-60, n)) : 0;
}

function clampImageZoom(value) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.min(3, Math.max(1, n)) : 1;
}

function getMemberImage(member = {}) {
  return cleanImageUrl(
    member.imageUrl || member.image || member.photo || member.avatar || ""
  );
}

function getAuthHeaders() {
  const token = localStorage.getItem("adminToken");
  return token ? { Authorization: `Bearer ${token}` } : null;
}

function getUploadUrl(payload) {
  return cleanImageUrl(
    payload?.url ||
      payload?.imageUrl ||
      payload?.fileUrl ||
      payload?.secure_url ||
      payload?.data?.url ||
      payload?.data?.imageUrl ||
      payload?.data?.fileUrl ||
      payload?.data?.secure_url ||
      payload?.file?.url ||
      payload?.file?.secure_url ||
      ""
  );
}

function inferDepartment(member = {}) {
  const saved = normalizeText(member.category || member.department);
  if (saved && !LEGACY_DEPARTMENTS.has(saved)) return saved;

  const text = `${member.position || ""} ${member.subjects || ""}`.toLowerCase();
  if (text.includes("principal") || text.includes("administrator") || text.includes("leadership")) return "School Leadership";
  if (text.includes("science") || text.includes("physics") || text.includes("chemistry") || text.includes("biology")) return "Science Department";
  if (text.includes("math")) return "Mathematics Department";
  if (text.includes("english")) return "English Department";
  if (text.includes("nepali") || text.includes("language") || text.includes("literature")) return "Language Department";
  if (text.includes("social") || text.includes("history") || text.includes("civics") || text.includes("geography")) return "Social Studies Department";
  if (text.includes("computer") || text.includes("technology") || text.includes("ict")) return "Computer & Technology Department";
  if (text.includes("primary") || text.includes("junior")) return "Primary Department";
  if (text.includes("support") || text.includes("counsel") || text.includes("coordinator")) return "Student Support & Administration";
  return "Student Support & Administration";
}

function getDepartments(content) {
  const saved = Array.isArray(content?.departments)
    ? content.departments.map(normalizeText).filter(Boolean)
    : [];

  const fromStaff = (content?.staff || [])
    .map(inferDepartment)
    .map(normalizeText)
    .filter(Boolean);

  const result = [];
  [...saved, ...fromStaff].forEach((department) => {
    if (!result.includes(department)) result.push(department);
  });

  if (!result.length) return [...DEFAULT_DEPARTMENTS];
  return result;
}

function normalizeStaffContent(saved = {}, { migrateLegacy = false } = {}) {
  /*
   * IMPORTANT:
   * The public Staff page owns the canonical 30-teacher list in
   * defaultStaffContent. The admin page uses that same list so the
   * admin and public page never start with unrelated/random staff.
   *
   * staffAdminInitialized is a small migration flag stored with the
   * content. It lets us distinguish:
   *   1. an old/random database record that needs the real 30 teachers
   *   2. a real admin choice to delete some/all staff later.
   *
   * Once initialized, an empty staff array stays EMPTY.
   */
  const rawStaff = Array.isArray(saved?.staff) ? saved.staff : null;
  const initialized = saved?.staffAdminInitialized === true;

  let source = saved || {};

  if (migrateLegacy && !initialized) {
    const canonicalNames = new Set(
      (defaultStaffContent.staff || []).map((member) =>
        normalizeText(member.name).toLowerCase()
      )
    );

    const hasCanonicalTeacher = (rawStaff || []).some((member) =>
      canonicalNames.has(normalizeText(member?.name).toLowerCase())
    );

    /*
     * The current database contains an unrelated/random staff record
     * such as "Suman Rai". If the old content has no canonical teacher,
     * replace that old list with the real teacher list from Staff.jsx.
     *
     * If the database is already empty on first migration, also seed
     * the real 30 teachers.
     */
    if (!hasCanonicalTeacher) {
      source = {
        ...source,
        staff: (defaultStaffContent.staff || []).map((member) => ({
          ...member,
        })),
        staffAdminInitialized: true,
      };
    } else {
      source = {
        ...source,
        staffAdminInitialized: true,
      };
    }
  }

  const merged = mergeStaffContent(source || {});
  const departments = getDepartments(merged);

  /*
   * mergeStaffContent historically falls back to the canonical 30
   * teachers when staff is an empty array. That is useful for the
   * public page, but NOT for the admin editor: an admin must be able
   * to intentionally delete every staff member.
   */
  const intentionallyEmpty =
    source?.staffAdminInitialized === true &&
    Array.isArray(source?.staff) &&
    source.staff.length === 0;

  const staffSource = intentionallyEmpty ? [] : merged.staff;

  return {
    ...merged,
    staffAdminInitialized:
      source?.staffAdminInitialized === true || initialized,
    departments,
    staff: Array.isArray(staffSource)
      ? staffSource.map((member, index) => {
          const category = inferDepartment(member);

          return {
            ...member,
            category,
            department: category,
            imageUrl: getMemberImage(member),
            imageZoom: clampImageZoom(member.imageZoom),
            imageOffsetX: clampImageOffset(member.imageOffsetX),
            imageOffsetY: clampImageOffset(member.imageOffsetY),
            email: member.email || "",
            description: member.description || "",
            philosophy: member.philosophy || "",
            visible: member.visible !== false,
            accentColor: member.accentColor || "",
            _accentIndex: index,
          };
        })
      : [],
  };
}

function Field({ label, value, onChange, placeholder = "", type = "text" }) {
  return (
    <label className="block">
      <span className="block mb-2 text-sm font-black text-slate-700">{label}</span>
      <input
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl px-4 py-3 text-sm outline-none"
        style={{
          background: "#fff",
          border: "1px solid rgba(75,46,131,.16)",
          color: colors.dark,
        }}
      />
    </label>
  );
}

function TextArea({ label, value, onChange, placeholder = "", rows = 4 }) {
  return (
    <label className="block">
      <span className="block mb-2 text-sm font-black text-slate-700">{label}</span>
      <textarea
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full rounded-2xl px-4 py-3 text-sm outline-none resize-none"
        style={{
          background: "#fff",
          border: "1px solid rgba(75,46,131,.16)",
          color: colors.dark,
        }}
      />
    </label>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="w-full flex items-center justify-between gap-4 rounded-2xl px-4 py-3 text-left"
      style={{
        background: checked ? "rgba(22,138,58,.08)" : "rgba(100,116,139,.08)",
        border: checked ? "1px solid rgba(22,138,58,.18)" : "1px solid rgba(100,116,139,.18)",
      }}
    >
      <span className="text-sm font-black text-slate-700">{label}</span>
      <span className="relative w-12 h-7 rounded-full" style={{ background: checked ? colors.green : "#CBD5E1" }}>
        <span className="absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-all" style={{ left: checked ? 24 : 4 }} />
      </span>
    </button>
  );
}

function DepartmentManager({ departments, staff, onAdd, onDelete, disabled }) {
  const [newDepartment, setNewDepartment] = useState("");

  const submit = () => {
    const value = normalizeText(newDepartment);
    if (!value) return;
    onAdd(value);
    setNewDepartment("");
  };

  return (
    <section
      className="rounded-[28px] p-5 sm:p-6"
      style={{ background: "rgba(255,255,255,.86)", border: "1px solid rgba(15,23,42,.08)" }}
    >
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <div className="text-[10px] font-black uppercase tracking-[.2em] text-[#A62B4F]">Department Management</div>
          <h3 className="mt-1 text-2xl font-black text-slate-950">Manage School Departments</h3>
          <p className="mt-1 text-sm text-slate-500">Add the departments your school actually uses or remove departments you no longer need.</p>
        </div>
        <div className="flex w-full lg:w-auto gap-2">
          <input
            value={newDepartment}
            onChange={(e) => setNewDepartment(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
            placeholder="New department name"
            disabled={disabled}
            className="min-w-0 flex-1 lg:w-64 rounded-2xl px-4 py-3 text-sm outline-none"
            style={{ border: "1px solid rgba(75,46,131,.16)", background: "#fff" }}
          />
          <button
            type="button"
            onClick={submit}
            disabled={disabled || !normalizeText(newDepartment)}
            className="inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-black disabled:opacity-50"
            style={{ background: "linear-gradient(135deg,#24131F,#4A1C2E)", color: "#fff" }}
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {departments.map((department) => {
          const count = staff.filter((member) => inferDepartment(member) === department).length;
          return (
            <div key={department} className="flex items-center justify-between gap-3 rounded-2xl px-4 py-3" style={{ background: "#FBF7EF", border: "1px solid #E5D9CD" }}>
              <div className="min-w-0 flex items-center gap-2">
                <GripVertical className="w-4 h-4 shrink-0 text-slate-300" />
                <div className="min-w-0">
                  <div className="truncate text-sm font-black text-slate-800">{department}</div>
                  <div className="text-xs text-slate-500">{count} {count === 1 ? "staff member" : "staff members"}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onDelete(department)}
                disabled={disabled || count > 0}
                title={count > 0 ? "Move or delete staff in this department first" : "Delete department"}
                className="w-9 h-9 shrink-0 rounded-xl flex items-center justify-center disabled:opacity-30"
                style={{ background: "#FCE7E7", color: colors.red }}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-slate-400">A department containing staff cannot be deleted until those staff members are moved to another department.</p>
    </section>
  );
}

function StaffPhotoPreview({ member, small = false }) {
  const src = getMemberImage(member);
  return (
    <div className={`${small ? "w-20 h-24" : "w-24 h-32"} shrink-0 overflow-hidden rounded-2xl bg-slate-100`}>
      {src ? (
        <img
          src={src}
          alt={member.name || "Staff"}
          className="w-full h-full object-cover"
          draggable={false}
          onError={(e) => { e.currentTarget.style.display = "none"; }}
          style={{
            transform: `translate(${clampImageOffset(member.imageOffsetX)}%, ${clampImageOffset(member.imageOffsetY)}%) scale(${clampImageZoom(member.imageZoom)})`,
            transformOrigin: "center",
          }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-slate-300"><UserRound className="w-9 h-9" /></div>
      )}
    </div>
  );
}

function StaffEditorModal({
  mode,
  form,
  departments,
  saving,
  uploading,
  onChange,
  onUpload,
  onSave,
  onClose,
  onDelete,
  onOpenPhoto,
}) {
  const fileRef = useRef(null);
  const isNew = mode === "add";

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5"
      style={{ background: "rgba(2,6,23,.58)", backdropFilter: "blur(12px)" }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onMouseDown={onClose}
    >
      <motion.div
        className="w-full max-w-2xl max-h-[94vh] overflow-y-auto rounded-[30px] bg-white"
        style={{ boxShadow: "0 42px 110px rgba(0,0,0,.30)" }}
        initial={{ opacity: 0, y: 25, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="h-1.5" style={{ background: `linear-gradient(90deg,${colors.gold},${colors.cyan},${colors.green})` }} />
        <div className="p-5 sm:p-7">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,rgba(250,204,21,.18),rgba(56,189,248,.18))" }}>
                {isNew ? <Plus className="w-5 h-5" /> : <UserRound className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-950">{isNew ? "Add Staff Member" : "Edit Staff Member"}</h3>
                <p className="text-sm text-slate-500">{isNew ? "Create a new teacher or staff profile." : "Update only this selected staff member."}</p>
              </div>
            </div>
            <button type="button" onClick={onClose} disabled={saving || uploading} className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center disabled:opacity-50"><X className="w-5 h-5" /></button>
          </div>

          <div className="space-y-5">
            <div className="rounded-3xl p-5" style={{ background: "linear-gradient(145deg,#0f172a,#1e293b)" }}>
              <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                <StaffPhotoPreview member={form} />
                <div className="flex-1">
                  <div className="text-white font-black">Staff Photo</div>
                  <p className="mt-1 text-sm text-white/55">Upload a photo, then adjust its crop before saving.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                    <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="rounded-2xl px-4 py-3 font-black text-sm flex items-center justify-center gap-2" style={{ background: "rgba(255,255,255,.10)", color: "#fff" }}><UploadCloud className="w-4 h-4" />{uploading ? "Uploading..." : "Upload New Photo"}</button>
                    <button type="button" onClick={onOpenPhoto} disabled={!getMemberImage(form) || uploading} className="rounded-2xl px-4 py-3 font-black text-sm flex items-center justify-center gap-2 disabled:opacity-40" style={{ background: `linear-gradient(135deg,${colors.gold},${colors.cyan})`, color: colors.dark }}><Camera className="w-4 h-4" /> Adjust Photo</button>
                  </div>
                  <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => { onUpload(e.target.files?.[0]); e.target.value = ""; }} />
                </div>
              </div>
            </div>

            <Field label="Image URL" value={form.imageUrl} onChange={(v) => onChange("imageUrl", v)} placeholder="Upload a photo or paste an image URL" />
            <Field label="Name" value={form.name} onChange={(v) => onChange("name", v)} placeholder="Teacher or staff name" />
            <Field label="Position" value={form.position} onChange={(v) => onChange("position", v)} placeholder="e.g. Science Teacher" />

            <div>
              <label className="block mb-2 text-sm font-black text-slate-700">Department</label>
              <select value={form.category || departments[0] || ""} onChange={(e) => onChange("category", e.target.value)} className="w-full rounded-2xl px-4 py-3 text-sm outline-none bg-white" style={{ border: "1px solid rgba(75,46,131,.16)" }}>
                {departments.map((department) => <option key={department} value={department}>{department}</option>)}
              </select>
              <p className="mt-2 text-xs text-slate-400">This selection controls which department/category the staff member appears under on the public Staff page.</p>
            </div>

            <Field label="Email" value={form.email} onChange={(v) => onChange("email", v)} placeholder="teacher@redroseschool.edu.np" />
            <TextArea label="About the Teacher" value={form.description} onChange={(v) => onChange("description", v)} placeholder="Write a short introduction about this teacher..." rows={5} />
            <TextArea label="Teaching Philosophy" value={form.philosophy} onChange={(v) => onChange("philosophy", v)} placeholder="Describe this teacher's approach to teaching and learning..." rows={4} />

            <Toggle label="Show this staff member on website" checked={form.visible !== false} onChange={(v) => onChange("visible", v)} />
            <Toggle label="Use a custom accent color for this card" checked={Boolean(form.useCustomAccent)} onChange={(v) => onChange("useCustomAccent", v)} />
            {form.useCustomAccent && <Field label="Accent Color" type="color" value={form.accentColor || "#A62B4F"} onChange={(v) => onChange("accentColor", v)} />}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              {!isNew && <button type="button" onClick={onDelete} disabled={saving || uploading} className="sm:w-auto px-5 py-3 rounded-2xl text-sm font-black inline-flex items-center justify-center gap-2" style={{ background: "#FCE7E7", color: colors.red }}><Trash2 className="w-4 h-4" /> Delete</button>}
              <button type="button" onClick={onClose} disabled={saving || uploading} className="flex-1 py-3 rounded-2xl text-sm font-black bg-slate-100 text-slate-600">Cancel</button>
              <button type="button" onClick={onSave} disabled={saving || uploading || !normalizeText(form.name)} className="flex-1 py-3 rounded-2xl text-sm font-black inline-flex items-center justify-center gap-2 disabled:opacity-50" style={{ background: `linear-gradient(135deg,${colors.gold},${colors.cyan})`, color: colors.dark }}><Save className="w-4 h-4" />{saving ? "Saving..." : isNew ? "Add Staff Member" : "Save Changes"}</button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function PhotoAdjustModal({ form, onChange, onSave, onClose, saving }) {
  const update = (key, value) => onChange(key, value);
  const src = getMemberImage(form);
  return (
    <motion.div className="fixed inset-0 z-[11000] flex items-center justify-center p-3 sm:p-5" style={{ background: "rgba(2,6,23,.72)", backdropFilter: "blur(14px)" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="w-full max-w-3xl rounded-[30px] bg-white p-5 sm:p-7 max-h-[94vh] overflow-y-auto" initial={{ opacity: 0, scale: .95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-5"><div><h3 className="text-2xl font-black">Adjust Staff Photo</h3><p className="text-sm text-slate-500">Set the crop used by the Staff card.</p></div><button onClick={onClose} className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center"><X className="w-5 h-5" /></button></div>
        <div className="grid lg:grid-cols-[1fr_280px] gap-6 items-start">
          <div className="mx-auto w-full max-w-sm aspect-[3/4] overflow-hidden rounded-[28px] bg-slate-100 border border-slate-200">
            {src ? <img src={src} alt="Staff crop" className="w-full h-full object-cover" draggable={false} onError={(e) => { e.currentTarget.style.display = "none"; }} style={{ transform: `translate(${clampImageOffset(form.imageOffsetX)}%,${clampImageOffset(form.imageOffsetY)}%) scale(${clampImageZoom(form.imageZoom)})`, transformOrigin: "center" }} /> : <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon className="w-16 h-16" /></div>}
          </div>
          <div className="space-y-5">
            <label className="block"><span className="block text-sm font-black text-slate-700 mb-2">Zoom: {clampImageZoom(form.imageZoom).toFixed(2)}x</span><input type="range" min="1" max="3" step=".01" value={clampImageZoom(form.imageZoom)} onChange={(e) => update("imageZoom", Number(e.target.value))} className="w-full" /></label>
            <label className="block"><span className="block text-sm font-black text-slate-700 mb-2">Horizontal: {Math.round(clampImageOffset(form.imageOffsetX))}</span><input type="range" min="-60" max="60" value={clampImageOffset(form.imageOffsetX)} onChange={(e) => update("imageOffsetX", Number(e.target.value))} className="w-full" /></label>
            <label className="block"><span className="block text-sm font-black text-slate-700 mb-2">Vertical: {Math.round(clampImageOffset(form.imageOffsetY))}</span><input type="range" min="-60" max="60" value={clampImageOffset(form.imageOffsetY)} onChange={(e) => update("imageOffsetY", Number(e.target.value))} className="w-full" /></label>
            <button type="button" onClick={() => { update("imageZoom",1); update("imageOffsetX",0); update("imageOffsetY",0); }} className="w-full rounded-2xl bg-slate-100 px-4 py-3 text-sm font-black">Reset Crop</button>
            <button type="button" onClick={onSave} disabled={saving || !src} className="w-full rounded-2xl px-4 py-3 text-sm font-black disabled:opacity-50" style={{ background: `linear-gradient(135deg,${colors.gold},${colors.cyan})` }}>{saving ? "Saving..." : "Save Photo"}</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AdminStaff() {
  const navigate = useNavigate();
  const [form, setForm] = useState(() => normalizeStaffContent({
    ...defaultStaffContent,
    staffAdminInitialized: true,
  }));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editor, setEditor] = useState(null);
  const [photoEditor, setPhotoEditor] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await api.get("/api/site-content/staff", { timeout: 20000 });
        if (!alive) return;
        setForm(
          normalizeStaffContent(
            res.data?.data?.content || {},
            { migrateLegacy: true }
          )
        );
      } catch (err) {
        console.error("Admin Staff load error:", err);
        if (alive) setError("Could not load saved Staff content. Default content is shown.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const departments = useMemo(() => getDepartments(form), [form]);

  const persist = async (next, message) => {
    const headers = getAuthHeaders();
    if (!headers) {
      setError("Admin login expired. Please logout and login again.");
      return false;
    }
    const payload = {
      ...next,
      staffAdminInitialized: true,
      staff: Array.isArray(next?.staff) ? next.staff : [],
    };

    await api.put("/api/site-content/staff", { content: payload }, { headers });
    setForm(normalizeStaffContent(payload));
    setSuccess(message);
    setError("");
    return true;
  };

  const openAddStaff = () => {
    setSuccess(""); setError("");
    setEditor({
      mode: "add",
      form: {
        id: `staff-${Date.now()}`,
        name: "",
        position: "Teacher",
        category: departments[0] || DEFAULT_DEPARTMENTS[0],
        department: departments[0] || DEFAULT_DEPARTMENTS[0],
        imageUrl: "",
        imageZoom: 1,
        imageOffsetX: 0,
        imageOffsetY: 0,
        email: "",
        description: "",
        philosophy: "",
        visible: true,
        accentColor: "",
        useCustomAccent: false,
      },
    });
  };

  const openEditStaff = (index) => {
    const member = form.staff[index];
    if (!member) return;
    setSuccess(""); setError("");
    setEditor({
      mode: "edit",
      index,
      form: {
        ...member,
        category: inferDepartment(member),
        department: inferDepartment(member),
        imageUrl: getMemberImage(member),
        imageZoom: clampImageZoom(member.imageZoom),
        imageOffsetX: clampImageOffset(member.imageOffsetX),
        imageOffsetY: clampImageOffset(member.imageOffsetY),
        description: member.description || "",
        philosophy: member.philosophy || "",
        useCustomAccent: Boolean(member.accentColor),
      },
    });
  };

  const changeEditor = (key, value) => {
    setEditor((prev) => ({ ...prev, form: { ...prev.form, [key]: value } }));
  };

  const uploadImage = async (file) => {
    if (!file || !editor) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Please upload only JPG, PNG, or WebP images."); return;
    }
    if (file.size > 6 * 1024 * 1024) {
      setError("Staff photo must be less than 6 MB."); return;
    }
    const headers = getAuthHeaders();
    if (!headers) { setError("Admin login expired. Please login again."); return; }
    setUploading(true); setError(""); setSuccess("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await api.post("/api/upload", fd, { headers, timeout: 30000 });
      const url = getUploadUrl(res.data);
      if (!url) throw new Error("Backend did not return an image URL.");
      changeEditor("imageUrl", url);
      changeEditor("imageZoom", 1);
      changeEditor("imageOffsetX", 0);
      changeEditor("imageOffsetY", 0);
      setSuccess("Photo uploaded. Adjust it before saving.");
      setPhotoEditor(true);
    } catch (err) {
      console.error("Staff image upload error:", err);
      setError(err.response?.data?.message || err.message || "Staff photo upload failed.");
    } finally { setUploading(false); }
  };

  const saveEditor = async () => {
    if (!editor) return;
    const member = {
      ...editor.form,
      name: normalizeText(editor.form.name),
      position: normalizeText(editor.form.position) || "Teacher",
      category: normalizeText(editor.form.category) || departments[0] || DEFAULT_DEPARTMENTS[0],
      department: normalizeText(editor.form.category) || departments[0] || DEFAULT_DEPARTMENTS[0],
      imageUrl: getMemberImage(editor.form),
      image: getMemberImage(editor.form),
      imageZoom: clampImageZoom(editor.form.imageZoom),
      imageOffsetX: clampImageOffset(editor.form.imageOffsetX),
      imageOffsetY: clampImageOffset(editor.form.imageOffsetY),
      email: normalizeText(editor.form.email),
      description: editor.form.description || "",
      philosophy: editor.form.philosophy || "",
      visible: editor.form.visible !== false,
      accentColor: editor.form.useCustomAccent ? (editor.form.accentColor || "#A62B4F") : "",
    };

    if (!member.name) { setError("Please enter the staff member's name."); return; }

    setSaving(true); setError(""); setSuccess("");
    try {
      const nextStaff = [...(form.staff || [])];
      if (editor.mode === "add") nextStaff.push(member);
      else nextStaff[editor.index] = { ...nextStaff[editor.index], ...member };

      const next = normalizeStaffContent({
        ...form,
        departments,
        staff: nextStaff,
        staffAdminInitialized: true,
      });
      await persist(next, editor.mode === "add" ? "New staff member added successfully." : "Staff member updated successfully.");
      setEditor(null); setPhotoEditor(false);
    } catch (err) {
      console.error("Save staff error:", err);
      setError(err.response?.data?.message || "Could not save staff member.");
    } finally { setSaving(false); }
  };

  const deleteStaff = () => {
    if (!editor || editor.mode !== "edit") return;

    const staffIndex = editor.index;
    const staffName = editor.form.name || "this staff member";

    // Close the edit popup immediately.
    // The delete confirmation is shown separately as the in-app toast.
    setEditor(null);
    setPhotoEditor(false);

    setPendingDelete({
      type: "staff",
      name: staffName,
      index: staffIndex,
    });
  };

  const confirmPendingDelete = async () => {
    if (!pendingDelete) return;

    const pending = pendingDelete;
    setPendingDelete(null);
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      if (pending.type === "staff") {
        const nextStaff = form.staff.filter((_, index) => index !== pending.index);
        await persist(
          normalizeStaffContent({ ...form, departments, staff: nextStaff, staffAdminInitialized: true }),
          "Staff member deleted successfully."
        );
        setEditor(null);
        setPhotoEditor(false);
      } else if (pending.type === "department") {
        await persist(
          { ...form, departments: departments.filter((d) => d !== pending.name), staffAdminInitialized: true },
          `Department "${pending.name}" deleted successfully.`
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        (pending.type === "staff"
          ? "Could not delete staff member."
          : "Could not delete department.")
      );
    } finally {
      setSaving(false);
    }
  };

  const addDepartment = async (name) => {
    if (departments.includes(name)) { setError("That department already exists."); return; }
    setSaving(true); setError(""); setSuccess("");
    try {
      await persist({ ...form, departments: [...departments, name], staffAdminInitialized: true }, `Department "${name}" added successfully.`);
    } catch (err) {
      setError(err.response?.data?.message || "Could not add department.");
    } finally { setSaving(false); }
  };

  const deleteDepartment = async (name) => {
    const count = form.staff.filter((member) => inferDepartment(member) === name).length;
    if (count > 0) {
      setError(
        `Cannot delete ${name} because ${count} staff member${count === 1 ? " is" : "s are"} assigned to it. Move them first.`
      );
      return;
    }

    // Department deletion uses the same in-app confirmation toast.
    setEditor(null);
    setPhotoEditor(false);

    setPendingDelete({
      type: "department",
      name,
    });
  };

  if (loading) return <div className="py-16 flex justify-center text-slate-500 font-semibold">Loading Staff editor...</div>;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="rounded-[24px] p-4 sm:p-6" style={{ background: "linear-gradient(135deg,#E8EDF5,#DCE3EF 50%,#E8E0F0)", border: "1px solid rgba(15,23,42,.06)" }}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black mb-3 bg-green-50 text-green-700 border border-green-100"><Users className="w-3.5 h-3.5" /> Staff Management</div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-950" style={{ fontFamily: "var(--font-display)", letterSpacing: "-.04em" }}>Manage School Staff</h2>
            <p className="text-sm text-slate-500 mt-1">Create staff members, manage departments, edit profiles, and control what appears on the public Staff page.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => navigate("/admin/dashboard")} className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-black bg-white text-slate-700 border border-slate-100"><ArrowLeft className="w-4 h-4" /> Dashboard</button>
            <a href="/staff" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-black bg-white text-slate-700 border border-slate-100"><ExternalLink className="w-4 h-4" /> View Page</a>
          </div>
        </div>

        {success && <div className="mt-4 rounded-2xl px-4 py-3 flex items-center gap-2 font-semibold bg-green-50 text-green-700 border border-green-100"><CheckCircle2 className="w-4 h-4" />{success}</div>}
        {error && <div className="mt-4 rounded-2xl px-4 py-3 flex items-center gap-2 font-semibold bg-red-50 text-red-700 border border-red-100"><AlertCircle className="w-4 h-4" />{error}</div>}
      </motion.div>

      {/* ADD STAFF IS INTENTIONALLY ABOVE THE DEPARTMENT/STAFF CONTAINERS */}
      <div className="flex justify-center">
        <button type="button" onClick={openAddStaff} disabled={saving} className="inline-flex items-center gap-2 rounded-2xl px-7 py-4 text-sm font-black shadow-lg hover:-translate-y-0.5 transition disabled:opacity-50" style={{ background: "linear-gradient(135deg,#24131F,#4A1C2E)", color: "#fff" }}>
          <Plus className="w-5 h-5" /> Add Staff Member
        </button>
      </div>

      <DepartmentManager departments={departments} staff={form.staff || []} onAdd={addDepartment} onDelete={deleteDepartment} disabled={saving} />

      <div className="rounded-[32px] overflow-hidden" style={{ background: "linear-gradient(180deg,#FFF8EE,#F1ECFF)", border: "1px solid rgba(15,23,42,.08)" }}>
        <div className="p-4 sm:p-6">
          {form.staff?.length > 0 ? (
            <Staff
              editMode
              contentOverride={{ ...form, departments, staffAdminInitialized: true }}
              onEditTarget={(target) => {
                if (target?.type === "staffCard" || target?.type === "staffImage") {
                  openEditStaff(target.index);
                }
              }}
              onDeleteTarget={(target) => {
                if (target?.type === "staffCard") {
                  const staffIndex = target.index;
                  const staffMember = form.staff?.[staffIndex];

                  if (!staffMember) return;

                  setPendingDelete({
                    type: "staff",
                    name: staffMember.name || "this staff member",
                    index: staffIndex,
                  });
                }
              }}
              onAddTarget={openAddStaff}
            />
          ) : (
            <div className="min-h-[360px] flex flex-col items-center justify-center text-center px-6 py-16">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: "#F1E5D5", color: "#806A5B" }}
              >
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black text-slate-950">
                No staff members
              </h3>
              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                All staff members have been removed. Add a teacher or staff
                member whenever you are ready.
              </p>
              <button
                type="button"
                onClick={openAddStaff}
                disabled={saving}
                className="mt-6 inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-black disabled:opacity-50"
                style={{
                  background: "linear-gradient(135deg,#24131F,#4A1C2E)",
                  color: "#fff",
                }}
              >
                <Plus className="w-4 h-4" />
                Add Staff Member
              </button>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {pendingDelete && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-5 right-5 z-[100] w-[min(420px,calc(100vw-32px))] rounded-2xl p-4 shadow-2xl"
            style={{
              background: "#24131F",
              border: "1px solid rgba(255,255,255,.12)",
              color: "#fff",
              boxShadow: "0 20px 60px rgba(0,0,0,.28)",
            }}
            role="alertdialog"
            aria-live="assertive"
          >
            <div className="flex items-start gap-3">
              <div
                className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                style={{ background: "rgba(215,25,32,.18)", color: "#FF8D91" }}
              >
                <Trash2 className="w-5 h-5" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="font-black text-base">
                  Delete {pendingDelete.type === "department" ? "department" : "staff member"}?
                </div>
                <div className="mt-1 text-sm text-white/70 leading-5">
                  {pendingDelete.type === "department"
                    ? `Delete "${pendingDelete.name}"? This cannot be undone.`
                    : `Delete "${pendingDelete.name}"? This cannot be undone.`}
                </div>

                <div className="mt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setPendingDelete(null)}
                    disabled={saving}
                    className="rounded-xl px-4 py-2 text-sm font-black transition hover:bg-white/10 disabled:opacity-50"
                    style={{ color: "#fff" }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={confirmPendingDelete}
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-black transition hover:brightness-110 disabled:opacity-50"
                    style={{ background: "#D71920", color: "#fff" }}
                  >
                    <Trash2 className="w-4 h-4" />
                    {saving ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setPendingDelete(null)}
                disabled={saving}
                className="rounded-lg p-1 text-white/60 hover:bg-white/10 hover:text-white disabled:opacity-50"
                aria-label="Close delete confirmation"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {editor && !photoEditor && (
          <StaffEditorModal
            mode={editor.mode}
            form={editor.form}
            departments={departments}
            saving={saving}
            uploading={uploading}
            onChange={changeEditor}
            onUpload={uploadImage}
            onOpenPhoto={() => setPhotoEditor(true)}
            onSave={saveEditor}
            onClose={() => { if (!saving && !uploading) setEditor(null); }}
            onDelete={deleteStaff}
          />
        )}
        {editor && photoEditor && (
          <PhotoAdjustModal
            form={editor.form}
            onChange={changeEditor}
            saving={saving}
            onClose={() => setPhotoEditor(false)}
            onSave={async () => { setPhotoEditor(false); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
