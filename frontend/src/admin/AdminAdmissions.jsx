import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  Pencil,
  Save,
  Trash2,
  X,
} from "lucide-react";

// ── FIXED IMPORT: Safely handles both named and default exports ──
import * as AdmissionsModule from "../app/components/Admissions";

// ── EXTRACT THE EXPORTS FROM YOUR COMPONENT MODULE ──
const Admissions = AdmissionsModule.default || AdmissionsModule.Admissions;
const defaultAdmissionsContent = AdmissionsModule.defaultAdmissionsContent || AdmissionsModule.defaultContent || {};
const mergeAdmissionsContent = AdmissionsModule.mergeAdmissionsContent || ((c) => c);
const stepColorOptions = AdmissionsModule.stepColorOptions || [];

// ── THEME TO MATCH DEEP NAVY DASHBOARD ──
const theme = {
  bg: "#0F172A",
  card: "rgba(255, 255, 255, 0.05)",
  border: "rgba(255, 255, 255, 0.08)",
  text: "#F8FAFC",
  muted: "#94A3B8",
  primary: "#2563EB",
  accent: "#06B6D4",
  success: "#22C55E",
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

function cleanText(value) {
  return String(value ?? "").trim();
}

function getAuthHeaders() {
  const token = localStorage.getItem("adminToken");
  return token ? { Authorization: `Bearer ${token}` } : null;
}

function Field({ label, value, onChange, placeholder = "", type = "text" }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-slate-300">
        {label}
      </label>
      <input
        type={type}
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl outline-none text-sm transition-all focus:ring-2"
        style={{
          background: "rgba(30, 41, 59, 0.8)",
          border: "1px solid rgba(255,255,255,0.08)",
          color: "#F8FAFC",
        }}
      />
    </div>
  );
}

function TextArea({ label, value, onChange, placeholder = "", rows = 4 }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-slate-300">
        {label}
      </label>
      <textarea
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-4 py-3 rounded-xl outline-none text-sm resize-none transition-all focus:ring-2"
        style={{
          background: "rgba(30, 41, 59, 0.8)",
          border: "1px solid rgba(255,255,255,0.08)",
          color: "#F8FAFC",
        }}
      />
    </div>
  );
}

function ModalShell({ title, subtitle, icon: Icon, children, onClose, error = "" }) {
  return (
    <motion.div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-5"
      style={{
        background: "rgba(2,6,23,0.65)",
        backdropFilter: "blur(12px)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.96 }}
        transition={{ type: "spring", stiffness: 130, damping: 16 }}
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-3xl rounded-[26px] sm:rounded-[30px] overflow-hidden max-h-[92vh] overflow-y-auto border"
        style={{
          background: "#1E293B",
          borderColor: "rgba(255,255,255,0.08)",
          boxShadow: "0 42px 110px rgba(0,0,0,0.5)",
        }}
      >
        <div
          className="h-1"
          style={{
            background: `linear-gradient(90deg, ${colors.gold}, ${colors.cyan}, ${colors.green})`,
          }}
        />

        <div className="p-5 md:p-7">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0"
                style={{
                  background: "rgba(250,204,21,0.10)",
                  color: colors.gold,
                }}
              >
                <Icon className="w-5 h-5" />
              </div>

              <div className="min-w-0">
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  {title}
                </h3>
                <p className="text-sm text-slate-400">{subtitle}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-colors text-slate-400 shrink-0"
              style={{ border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-red-400">
              <div className="flex items-start gap-2 font-medium">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}

function ConfirmDelete({ itemTitle, onCancel, onConfirm }) {
  return (
    <ModalShell
      title="Delete Admission Step?"
      subtitle="This admission step will be removed immediately after confirmation."
      icon={Trash2}
      onClose={onCancel}
    >
      <div className="rounded-2xl p-5 bg-red-500/10 border border-red-500/20 text-red-400 font-medium">
        Are you sure you want to delete <b className="text-white">{itemTitle}</b>?
      </div>

      <div className="flex gap-3 mt-7">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 rounded-xl text-sm font-bold bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-colors"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={onConfirm}
          className="flex-1 py-3 rounded-xl text-sm font-bold text-white"
          style={{ background: `linear-gradient(135deg, ${theme.danger}, #991B1B)` }}
        >
          Delete Step
        </button>
      </div>
    </ModalShell>
  );
}

function validateRequiredFields(fields) {
  const missing = fields.find(({ value }) => !cleanText(value));
  return missing ? `Please write ${missing.label} before saving.` : "";
}

function validateAdmissionsContent(content = {}) {
  const heroError = validateRequiredFields([
    { label: "the admissions badge", value: content.badgeText },
    { label: "the admissions title", value: content.title },
    { label: "the highlighted title text", value: content.highlightedText },
    { label: "the admissions subtitle", value: content.subtitle },
  ]);

  if (heroError) return heroError;

  if (cleanText(content.highlightedText) && !cleanText(content.title).includes(cleanText(content.highlightedText))) {
    return "The highlighted text must be part of the main title.";
  }

  for (const [index, step] of (content.steps || []).entries()) {
    const stepError = validateRequiredFields([
      { label: `step ${index + 1} number`, value: step?.step },
      { label: `step ${index + 1} title`, value: step?.title },
      { label: `step ${index + 1} description`, value: step?.desc },
      { label: `step ${index + 1} accent color`, value: step?.color },
    ]);

    if (stepError) return stepError;
  }

  const formError = validateRequiredFields([
    { label: "the form title", value: content.formTitle },
    { label: "the form description", value: content.formDescription },
    { label: "the name label", value: content.nameLabel },
    { label: "the name placeholder", value: content.namePlaceholder },
    { label: "the email label", value: content.emailLabel },
    { label: "the email placeholder", value: content.emailPlaceholder },
    { label: "the phone label", value: content.phoneLabel },
    { label: "the phone placeholder", value: content.phonePlaceholder },
    { label: "the grade label", value: content.gradeLabel },
    { label: "the grade placeholder", value: content.gradePlaceholder },
    { label: "the message label", value: content.messageLabel },
    { label: "the message placeholder", value: content.messagePlaceholder },
    { label: "the submit button text", value: content.submitButtonText },
    { label: "the submitting text", value: content.submittingText },
    { label: "the success title", value: content.successTitle },
    { label: "the success message", value: content.successMessage },
  ]);

  if (formError) return formError;

  const grades = Array.isArray(content.grades)
    ? content.grades.map((item) => cleanText(item)).filter(Boolean)
    : [];

  return grades.length === 0 ? "Please add at least one grade option before saving." : "";
}

function validateAdmissionModal(editing, modalForm) {
  if (!editing) return "No admissions section is selected.";

  if (editing.type === "hero") {
    const error = validateRequiredFields([
      { label: "the admissions badge", value: modalForm.badgeText },
      { label: "the main title", value: modalForm.title },
      { label: "the highlighted title text", value: modalForm.highlightedText },
      { label: "the subtitle", value: modalForm.subtitle },
    ]);

    if (error) return error;
    return !cleanText(modalForm.title).includes(cleanText(modalForm.highlightedText)) ? "The highlighted text must be part of the main title." : "";
  }

  if (editing.type === "step") {
    return validateRequiredFields([
      { label: "the step number", value: modalForm.step },
      { label: "the step title", value: modalForm.title },
      { label: "the step description", value: modalForm.desc },
      { label: "the accent color", value: modalForm.color },
    ]);
  }

  if (editing.type === "form") {
    const error = validateRequiredFields([
      { label: "the form title", value: modalForm.formTitle },
      { label: "the form description", value: modalForm.formDescription },
      { label: "the name label", value: modalForm.nameLabel },
      { label: "the name placeholder", value: modalForm.namePlaceholder },
      { label: "the email label", value: modalForm.emailLabel },
      { label: "the email placeholder", value: modalForm.emailPlaceholder },
      { label: "the phone label", value: modalForm.phoneLabel },
      { label: "the phone placeholder", value: modalForm.phonePlaceholder },
      { label: "the grade label", value: modalForm.gradeLabel },
      { label: "the grade placeholder", value: modalForm.gradePlaceholder },
      { label: "the message label", value: modalForm.messageLabel },
      { label: "the message placeholder", value: modalForm.messagePlaceholder },
      { label: "the submit button text", value: modalForm.submitButtonText },
      { label: "the submitting text", value: modalForm.submittingText },
      { label: "the success title", value: modalForm.successTitle },
      { label: "the success message", value: modalForm.successMessage },
    ]);

    if (error) return error;

    const grades = cleanText(modalForm.gradesText).split("\n").map((item) => cleanText(item)).filter(Boolean);
    return grades.length === 0 ? "Please add at least one grade option before saving." : "";
  }

  return "";
}

export default function AdminAdmissions() {
  const navigate = useNavigate();
  const [form, setForm] = useState(defaultAdmissionsContent);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [modalError, setModalError] = useState("");
  const [editing, setEditing] = useState(null);
  const [modalForm, setModalForm] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    let alive = true;
    const loadAdmissionsContent = async () => {
      try {
        const res = await axios.get("https://school-website-backend-ixx2.onrender.com/api/site-content/admissions", { timeout: 20000 });
        if (!alive) return;
        const savedContent = res.data?.data?.content || {};
        setForm(mergeAdmissionsContent(savedContent));
      } catch (err) {
        console.error("Load admissions content error:", err);
        if (alive) setError("Could not load saved admissions content. Default content is shown.");
      } finally {
        if (alive) setLoading(false);
      }
    };
    loadAdmissionsContent();
    return () => { alive = false; };
  }, []);

  const updateModalField = (name, value) => {
    setModalForm((prev) => ({ ...prev, [name]: value }));
    setModalError("");
  };

  const persistAdmissionsContent = async (nextForm, message) => {
    const authHeaders = getAuthHeaders();
    if (!authHeaders) {
      setModalError("Admin login expired. Please logout and login again.");
      setError("Admin login expired. Please logout and login again.");
      return false;
    }
    const cleanedForm = mergeAdmissionsContent(nextForm);
    const validationError = validateAdmissionsContent(cleanedForm);
    if (validationError) {
      setModalError(validationError);
      return false;
    }
    await axios.put("https://school-website-backend-ixx2.onrender.com/api/site-content/admissions", { content: cleanedForm }, { headers: authHeaders, timeout: 30000 });
    setForm(cleanedForm);
    setSuccess(message || "Admissions page content saved successfully.");
    return true;
  };

  const openHeroEditor = () => {
    setSuccess(""); setError(""); setModalError("");
    setEditing({ type: "hero" });
    setModalForm({ badgeText: form.badgeText || "", title: form.title || "", highlightedText: form.highlightedText || "", subtitle: form.subtitle || "" });
  };

  const openStepEditor = (step) => {
    setSuccess(""); setError(""); setModalError("");
    setEditing({ type: "step", id: step.id, isNew: false });
    setModalForm({ step: step.step || "", title: step.title || "", desc: step.desc || "", color: step.color || colors.green });
  };

  const openFormEditor = () => {
    setSuccess(""); setError(""); setModalError("");
    setEditing({ type: "form" });
    setModalForm({
      formTitle: form.formTitle || "", formDescription: form.formDescription || "", nameLabel: form.nameLabel || "", namePlaceholder: form.namePlaceholder || "",
      emailLabel: form.emailLabel || "", emailPlaceholder: form.emailPlaceholder || "", phoneLabel: form.phoneLabel || "", phonePlaceholder: form.phonePlaceholder || "",
      gradeLabel: form.gradeLabel || "", gradePlaceholder: form.gradePlaceholder || "", messageLabel: form.messageLabel || "", messagePlaceholder: form.messagePlaceholder || "",
      gradesText: (form.grades || []).join("\n"), submitButtonText: form.submitButtonText || "", submittingText: form.submittingText || "",
      successTitle: form.successTitle || "", successMessage: form.successMessage || "",
    });
  };

  const closeEditor = () => {
    if (saving) return;
    setEditing(null);
    setModalForm({});
    setModalError("");
  };

  const saveModalChanges = async () => {
    if (!editing) return;
    const validationError = validateAdmissionModal(editing, modalForm);
    if (validationError) { setModalError(validationError); return; }
    setSaving(true); setSuccess(""); setError(""); setModalError("");
    try {
      let nextForm = mergeAdmissionsContent(form);
      if (editing.type === "hero") {
        nextForm = { ...nextForm, badgeText: cleanText(modalForm.badgeText), title: cleanText(modalForm.title), highlightedText: cleanText(modalForm.highlightedText), subtitle: cleanText(modalForm.subtitle) };
      }
      if (editing.type === "step") {
        const nextStep = { id: editing.id, icon: "message", step: cleanText(modalForm.step), title: cleanText(modalForm.title), desc: cleanText(modalForm.desc), color: cleanText(modalForm.color) || colors.green, visible: true };
        nextForm = { ...nextForm, steps: editing.isNew ? [...(nextForm.steps || []), nextStep] : (nextForm.steps || []).map((step) => step.id === editing.id ? { ...step, ...nextStep } : step) };
      }
      if (editing.type === "form") {
        const grades = cleanText(modalForm.gradesText).split("\n").map((item) => cleanText(item)).filter(Boolean);
        nextForm = { ...nextForm, formTitle: cleanText(modalForm.formTitle), formDescription: cleanText(modalForm.formDescription), nameLabel: cleanText(modalForm.nameLabel), namePlaceholder: cleanText(modalForm.namePlaceholder), emailLabel: cleanText(modalForm.emailLabel), emailPlaceholder: cleanText(modalForm.emailPlaceholder), phoneLabel: cleanText(modalForm.phoneLabel), phonePlaceholder: cleanText(modalForm.phonePlaceholder), gradeLabel: cleanText(modalForm.gradeLabel), gradePlaceholder: cleanText(modalForm.gradePlaceholder), messageLabel: cleanText(modalForm.messageLabel), messagePlaceholder: cleanText(modalForm.messagePlaceholder), grades, submitButtonText: cleanText(modalForm.submitButtonText), submittingText: cleanText(modalForm.submittingText), successTitle: cleanText(modalForm.successTitle), successMessage: cleanText(modalForm.successMessage) };
      }
      const saved = await persistAdmissionsContent(nextForm, editing.type === "step" && editing.isNew ? "New admission step added successfully." : "Selected admissions item saved successfully.");
      if (saved) { setEditing(null); setModalForm({}); setModalError(""); }
    } catch (err) {
      console.error("Save admissions item error:", err);
      setModalError(err.response?.status === 401 ? "Admin login expired or token is invalid. Please login again." : err.response?.data?.message || "Could not save the selected admissions item.");
    } finally {
      setSaving(false);
    }
  };

  const addStep = () => {
    const nextIndex = (form.steps || []).length;
    const newId = `admission-step-${Date.now()}`;
    setSuccess(""); setError(""); setModalError("");
    setEditing({ type: "step", id: newId, isNew: true });
    setModalForm({ step: String(nextIndex + 1).padStart(2, "0"), title: "", desc: "", color: stepColorOptions[nextIndex % stepColorOptions.length] || colors.green });
  };

  const confirmDeleteStep = (step) => { setDeleteTarget(step); };
  const deleteStep = async () => {
    if (!deleteTarget) return;
    setSaving(true); setSuccess(""); setError("");
    try {
      const nextForm = { ...mergeAdmissionsContent(form), steps: (form.steps || []).filter((step) => step.id !== deleteTarget.id) };
      const saved = await persistAdmissionsContent(nextForm, "Admission step deleted successfully.");
      if (saved) setDeleteTarget(null);
    } catch (err) { console.error("Delete admission step error:", err); setError(err.response?.data?.message || "Could not delete the admission step."); } finally { setSaving(false); }
  };

  async function saveAdmissionsContent() {
    setSuccess(""); setError(""); setModalError("");
    const validationError = validateAdmissionsContent(form);
    if (validationError) { setError(validationError); return; }
    setSaving(true);
    try {
      const authHeaders = getAuthHeaders();
      if (!authHeaders) { setError("Admin login expired. Please logout and login again."); return; }
      const cleanedForm = mergeAdmissionsContent({
        ...form, steps: (form.steps || []).map((step, index) => ({ ...step, id: step.id ?? `admission-step-${index + 1}`, step: cleanText(step.step), title: cleanText(step.title), desc: cleanText(step.desc), color: cleanText(step.color) || stepColorOptions[index % stepColorOptions.length] || colors.green, visible: true })), grades: (form.grades || []).map((item) => cleanText(item)).filter(Boolean)
      });
      await axios.put("https://school-website-backend-ixx2.onrender.com/api/site-content/admissions", { content: cleanedForm }, { headers: authHeaders, timeout: 30000 });
      setForm(cleanedForm);
      setSuccess("Admissions page content saved successfully.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) { console.error("Save admissions content error:", err); setError(err.response?.data?.message || JSON.stringify(err.response?.data) || "Could not save admissions content."); } finally { setSaving(false); }
  }

  if (loading) {
    return (<div className="min-h-screen flex items-center justify-center" style={{ background: theme.bg }}><div className="text-slate-400 font-medium">Loading admissions editor...</div></div>);
  }

  return (
    <div className="min-h-screen" style={{ background: theme.bg }}>
      <header
        className="sticky top-0 z-30 backdrop-blur-xl border-b"
        style={{ background: "rgba(15, 23, 42, 0.85)", borderColor: "rgba(255,255,255,0.08)" }}
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate("/admin/dashboard")}
            className="inline-flex w-fit items-center gap-2 font-medium text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>

          <div className="flex flex-wrap items-center gap-3">
            <a href="/admissions" target="_blank" rel="noreferrer" className="hidden md:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white transition-colors" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <ExternalLink className="w-4 h-4" />
              View Page
            </a>

            <button type="button" onClick={saveAdmissionsContent} disabled={saving} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5 disabled:opacity-60 text-white" style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`, boxShadow: "0 8px 24px rgba(37,99,235,0.25)" }}>
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save All"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 rounded-2xl p-6 border backdrop-blur-xl" style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)" }}>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-4 bg-purple-500/10 text-purple-300 border border-purple-500/20">
            <GraduationCap className="w-3.5 h-3.5" />
            Manage Admissions Page
          </span>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Edit Admissions Page</h1>
          <p className="text-sm text-slate-400">Hover and edit the real admissions page. Steps can be added, edited, or permanently deleted. {(form.steps || []).length} step{(form.steps || []).length === 1 ? "" : "s"} currently saved.</p>
        </motion.div>

        {success && <div className="mb-6 rounded-xl px-4 py-3 flex items-center gap-2 font-medium bg-green-500/10 text-green-400 border border-green-500/20"><CheckCircle2 className="w-4 h-4" />{success}</div>}
        {error && <div className="mb-6 rounded-xl px-4 py-3 font-medium bg-red-500/10 text-red-400 border border-red-500/20">{error}</div>}

        <div className="rounded-[2rem] overflow-hidden border" style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}>
          <Admissions editMode contentOverride={form} onEditHero={openHeroEditor} onEditStep={openStepEditor} onAddStep={addStep} onDeleteStep={confirmDeleteStep} onEditForm={openFormEditor} />
        </div>
      </main>

      <AnimatePresence>
        {editing?.type === "hero" && (
          <ModalShell title="Edit Admissions Heading" subtitle="Update the badge, main title, highlighted text, and subtitle." icon={Pencil} onClose={closeEditor} error={modalError}>
            <div className="grid gap-5">
              <Field label="Badge Text" value={modalForm.badgeText} onChange={(v) => updateModalField("badgeText", v)} />
              <Field label="Main Title" value={modalForm.title} onChange={(v) => updateModalField("title", v)} />
              <Field label="Red Highlight Text" value={modalForm.highlightedText} onChange={(v) => updateModalField("highlightedText", v)} placeholder="Example: Starts Here" />
              <TextArea label="Subtitle" value={modalForm.subtitle} onChange={(v) => updateModalField("subtitle", v)} rows={4} />
            </div>
            <div className="flex gap-3 mt-7">
              <button type="button" onClick={closeEditor} className="flex-1 py-3 rounded-xl text-sm font-bold bg-white/5 border border-white/10 text-slate-400 hover:text-white">Cancel</button>
              <button type="button" onClick={saveModalChanges} disabled={saving} className="flex-1 py-3 rounded-xl text-sm font-bold text-white disabled:opacity-60" style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})` }}>{saving ? "Saving..." : "Update Heading"}</button>
            </div>
          </ModalShell>
        )}

        {editing?.type === "step" && (
          <ModalShell title={editing?.isNew ? "Add Admission Step" : "Edit Admission Step"} subtitle="Complete every field, then save this admission step." icon={Pencil} onClose={closeEditor} error={modalError}>
            <div className="grid gap-5">
              <div className="grid md:grid-cols-3 gap-4">
                <Field label="Step Number" value={modalForm.step} onChange={(v) => updateModalField("step", v)} placeholder="01" />
                <Field label="Step Title" value={modalForm.title} onChange={(v) => updateModalField("title", v)} />
                <Field label="Accent Color" type="color" value={modalForm.color} onChange={(v) => updateModalField("color", v)} />
              </div>
              <TextArea label="Step Description" value={modalForm.desc} onChange={(v) => updateModalField("desc", v)} rows={4} />
            </div>
            <div className="flex gap-3 mt-7">
              <button type="button" onClick={closeEditor} className="flex-1 py-3 rounded-xl text-sm font-bold bg-white/5 border border-white/10 text-slate-400 hover:text-white">Cancel</button>
              <button type="button" onClick={saveModalChanges} disabled={saving} className="flex-1 py-3 rounded-xl text-sm font-bold text-white disabled:opacity-60" style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})` }}>{saving ? "Saving..." : editing?.isNew ? "Add Step" : "Update Step"}</button>
            </div>
          </ModalShell>
        )}

        {editing?.type === "form" && (
          <ModalShell title="Edit Admission Inquiry Form" subtitle="Update public form labels, placeholders, grade options, and success text." icon={Pencil} onClose={closeEditor} error={modalError}>
            <div className="grid gap-5">
              <Field label="Form Title" value={modalForm.formTitle} onChange={(v) => updateModalField("formTitle", v)} />
              <TextArea label="Form Description" value={modalForm.formDescription} onChange={(v) => updateModalField("formDescription", v)} rows={3} />
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Name Label" value={modalForm.nameLabel} onChange={(v) => updateModalField("nameLabel", v)} />
                <Field label="Name Placeholder" value={modalForm.namePlaceholder} onChange={(v) => updateModalField("namePlaceholder", v)} />
                <Field label="Email Label" value={modalForm.emailLabel} onChange={(v) => updateModalField("emailLabel", v)} />
                <Field label="Email Placeholder" value={modalForm.emailPlaceholder} onChange={(v) => updateModalField("emailPlaceholder", v)} />
                <Field label="Phone Label" value={modalForm.phoneLabel} onChange={(v) => updateModalField("phoneLabel", v)} />
                <Field label="Phone Placeholder" value={modalForm.phonePlaceholder} onChange={(v) => updateModalField("phonePlaceholder", v)} />
                <Field label="Grade Label" value={modalForm.gradeLabel} onChange={(v) => updateModalField("gradeLabel", v)} />
                <Field label="Grade Placeholder" value={modalForm.gradePlaceholder} onChange={(v) => updateModalField("gradePlaceholder", v)} />
                <Field label="Message Label" value={modalForm.messageLabel} onChange={(v) => updateModalField("messageLabel", v)} />
                <Field label="Submit Button Text" value={modalForm.submitButtonText} onChange={(v) => updateModalField("submitButtonText", v)} />
                <Field label="Submitting Text" value={modalForm.submittingText} onChange={(v) => updateModalField("submittingText", v)} />
                <Field label="Success Title" value={modalForm.successTitle} onChange={(v) => updateModalField("successTitle", v)} />
              </div>
              <TextArea label="Message Placeholder" value={modalForm.messagePlaceholder} onChange={(v) => updateModalField("messagePlaceholder", v)} rows={3} />
              <TextArea label="Grades - one per line" value={modalForm.gradesText} onChange={(v) => updateModalField("gradesText", v)} rows={8} />
              <TextArea label="Success Message" value={modalForm.successMessage} onChange={(v) => updateModalField("successMessage", v)} rows={3} />
            </div>
            <div className="flex gap-3 mt-7">
              <button type="button" onClick={closeEditor} className="flex-1 py-3 rounded-xl text-sm font-bold bg-white/5 border border-white/10 text-slate-400 hover:text-white">Cancel</button>
              <button type="button" onClick={saveModalChanges} disabled={saving} className="flex-1 py-3 rounded-xl text-sm font-bold text-white disabled:opacity-60" style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})` }}>{saving ? "Saving..." : "Update Form"}</button>
            </div>
          </ModalShell>
        )}

        {deleteTarget && <ConfirmDelete itemTitle={deleteTarget.title || "this step"} onCancel={() => setDeleteTarget(null)} onConfirm={deleteStep} />}
      </AnimatePresence>
    </div>
  );
}