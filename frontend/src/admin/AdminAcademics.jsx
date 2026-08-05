import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "motion/react";
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Eye,
  Pencil,
  Save,
  Trash2,
  X,
  ArrowLeft,
  Users,
  Phone,
  Calendar,
  BookOpen,
  Plus,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// FIXED: Imports everything from your Admissions component to prevent missing export errors
import * as AdmissionsModule from "../app/components/Admissions";

// ── EXTRACT THE EXPORTS FROM YOUR COMPONENT MODULE ──
// This handles both default exports and named exports safely
const Admissions = AdmissionsModule.default || AdmissionsModule.Admissions;
const defaultAdmissionsContent = AdmissionsModule.defaultAdmissionsContent || AdmissionsModule.defaultContent || {};
const mergeAdmissionsContent = AdmissionsModule.mergeAdmissionsContent || ((c) => c);

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
};

function cleanText(value) {
  return String(value ?? "").trim();
}

function getAuthHeaders() {
  const token = localStorage.getItem("adminToken");
  if (!token) return null;
  return { Authorization: `Bearer ${token}` };
}

function Field({ label, value, onChange, placeholder = "", textarea = false, type = "text", rows = 4 }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-slate-300">
        {label}
      </label>
      {textarea ? (
        <textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="w-full px-4 py-3 rounded-xl outline-none text-sm resize-none transition-all focus:ring-2"
          style={{
            background: "rgba(30, 41, 59, 0.8)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#F8FAFC",
          }}
        />
      ) : (
        <input
          type={type}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 rounded-xl outline-none text-sm transition-all focus:ring-2"
          style={{
            background: "rgba(30, 41, 59, 0.8)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#F8FAFC",
          }}
        />
      )}
    </div>
  );
}

export default function AdminAdmissions() {
  const navigate = useNavigate();

  const [form, setForm] = useState(defaultAdmissionsContent);
  const [loading, setLoading] = useState(false);
  const [editingTarget, setEditingTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [modalForm, setModalForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [modalError, setModalError] = useState("");

  useEffect(() => {
    const loadContent = async () => {
      try {
        const res = await axios.get(
          "https://localhost:5000/admissions",
          { timeout: 12000 }
        );
        const savedContent = res.data?.data?.content || {};
        setForm(mergeAdmissionsContent(savedContent));
      } catch (err) {
        console.error("Load admissions content error:", err);
        setError("Could not load saved content. Default content shown.");
      } finally {
        setLoading(false);
      }
    };
    loadContent();
  }, []);

  const updateModalField = (name, value) => {
    setModalForm((prev) => ({ ...prev, [name]: value }));
    setModalError("");
  };

  const openEditor = (target) => {
    setSuccess("");
    setError("");
    setModalError("");
    setEditingTarget(target);

    if (target.type === "hero") {
      setModalForm({
        heroBadge: form.heroBadge || "",
        heroTitle: form.heroTitle || "",
        heroHighlight: form.heroHighlight || "",
        heroDescription: form.heroDescription || "",
      });
    } else if (target.type === "feature") {
      const item = form.features?.[target.index] || {};
      setModalForm({
        title: item.title || "",
        description: item.description || "",
        icon: item.icon || "📘",
      });
    } else if (target.type === "step") {
      const item = form.steps?.[target.index] || {};
      setModalForm({
        stepNumber: item.stepNumber || "",
        title: item.title || "",
        description: item.description || "",
      });
    }
  };

  const closeEditor = () => {
    if (saving) return;
    setEditingTarget(null);
    setModalForm({});
    setModalError("");
  };

  const saveContentToBackend = async (nextForm, message) => {
    const authHeaders = getAuthHeaders();
    if (!authHeaders) {
      setError("Admin login expired. Please logout and login again.");
      return false;
    }

    try {
      const cleanContent = mergeAdmissionsContent(nextForm);
      await axios.put(
        "https://localhost:5000/admissions",
        { content: cleanContent },
        { headers: authHeaders }
      );
      setForm(cleanContent);
      setSuccess(message || "Admissions page updated successfully.");
      return true;
    } catch (err) {
      console.error("Save error:", err);
      setError(err.response?.data?.message || "Could not save content.");
      return false;
    }
  };

  const saveSelectedPart = async () => {
    if (!editingTarget) return;
    setSaving(true);
    setSuccess("");
    setError("");
    setModalError("");

    try {
      let nextForm = mergeAdmissionsContent(form);

      if (editingTarget.type === "hero") {
        nextForm = {
          ...nextForm,
          heroBadge: cleanText(modalForm.heroBadge),
          heroTitle: cleanText(modalForm.heroTitle),
          heroHighlight: cleanText(modalForm.heroHighlight),
          heroDescription: cleanText(modalForm.heroDescription),
        };
      } else if (editingTarget.type === "feature") {
        const nextItem = {
          id: editingTarget.id || Date.now(),
          title: cleanText(modalForm.title),
          description: cleanText(modalForm.description),
          icon: cleanText(modalForm.icon) || "📘",
          visible: true,
        };
        nextForm = {
          ...nextForm,
          features: editingTarget.isNew
            ? [...nextForm.features, nextItem]
            : nextForm.features.map((item, index) =>
              index === editingTarget.index ? { ...item, ...nextItem } : item
            ),
        };
      } else if (editingTarget.type === "step") {
        const nextItem = {
          id: editingTarget.id || Date.now(),
          stepNumber: cleanText(modalForm.stepNumber),
          title: cleanText(modalForm.title),
          description: cleanText(modalForm.description),
          visible: true,
        };
        nextForm = {
          ...nextForm,
          steps: editingTarget.isNew
            ? [...nextForm.steps, nextItem]
            : nextForm.steps.map((item, index) =>
              index === editingTarget.index ? { ...item, ...nextItem } : item
            ),
        };
      }

      const saved = await saveContentToBackend(nextForm);
      if (saved) {
        setEditingTarget(null);
        setModalForm({});
        setModalError("");
      }
    } catch (err) {
      console.error("Save selected error:", err);
      setModalError(err.response?.data?.message || "Could not save selected item.");
    } finally {
      setSaving(false);
    }
  };

  const addItem = (type) => {
    const newId = Date.now();
    setSuccess("");
    setError("");
    setModalError("");

    if (type === "feature") {
      setEditingTarget({ type: "feature", index: (form.features || []).length, id: newId, isNew: true });
      setModalForm({ title: "", description: "", icon: "📘" });
    } else if (type === "step") {
      setEditingTarget({ type: "step", index: (form.steps || []).length, id: newId, isNew: true });
      setModalForm({ stepNumber: "", title: "", description: "" });
    }
  };

  const deleteTargetItem = async (target) => {
    if (!target) return;
    setSaving(true);
    setSuccess("");
    setError("");

    try {
      let nextForm = mergeAdmissionsContent(form);
      if (target.type === "feature") {
        nextForm.features = nextForm.features.filter((_, index) => index !== target.index);
      } else if (target.type === "step") {
        nextForm.steps = nextForm.steps.filter((_, index) => index !== target.index);
      }

      const saved = await saveContentToBackend(nextForm);
      if (saved) {
        setDeleteTarget(null);
        setEditingTarget(null);
        setModalForm({});
      }
    } catch (err) {
      console.error("Delete error:", err);
      setError(err.response?.data?.message || "Could not delete selected item.");
    } finally {
      setSaving(false);
    }
  };

  const modalTitle = editingTarget ? {
    hero: "Edit Admissions Hero",
    feature: "Edit Feature",
    step: "Edit Admission Step",
  }[editingTarget.type] || "Edit Admissions" : "";

  const canDeleteSelected = editingTarget && !editingTarget.isNew && ["feature", "step"].includes(editingTarget.type);

  return (
    <div className="space-y-6 min-h-screen" style={{ background: theme.bg }}>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[24px] p-4 sm:p-5 md:p-6 backdrop-blur-xl border"
        style={{
          background: "rgba(255,255,255,0.04)",
          borderColor: "rgba(255,255,255,0.08)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black mb-3 bg-blue-500/10 text-blue-300 border border-blue-500/20">
              <Eye className="w-3.5 h-3.5" />
              Visual Admissions Editor
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Hover and Edit Admissions Page</h2>
            <p className="text-sm text-slate-400 mt-1">Hover sections to edit features and steps.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => navigate("/admin/dashboard")}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-slate-300 hover:text-white transition-colors"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <ArrowLeft className="w-4 h-4" /> Dashboard
            </button>
            <a href="/admissions" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-slate-300 hover:text-white transition-colors" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <ExternalLink className="w-4 h-4" /> View Page
            </a>
            <button type="button" onClick={() => saveContentToBackend(form, "Admissions saved successfully.")} disabled={saving} className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5 disabled:opacity-60 text-white" style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`, boxShadow: "0 8px 24px rgba(37,99,235,0.25)" }}>
              <Save className="w-4 h-4" /> Save All
            </button>
          </div>
        </div>

        {success && <div className="mb-4 rounded-xl px-4 py-3 flex items-center gap-2 font-medium bg-green-500/10 text-green-400 border border-green-500/20"><CheckCircle2 className="w-4 h-4" />{success}</div>}
        {error && <div className="mb-4 rounded-xl px-4 py-3 flex items-center gap-2 font-medium bg-red-500/10 text-red-400 border border-red-500/20"><AlertCircle className="w-4 h-4" />{error}</div>}

        <div className="rounded-[2rem] overflow-hidden border" style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="w-full">
            <Admissions editMode contentOverride={form} onEditTarget={openEditor} onDeleteTarget={setDeleteTarget} onAddTarget={addItem} />
          </div>
        </div>
      </motion.div>

      {/* ── EDIT MODAL ── */}
      <AnimatePresence>
        {editingTarget && (
          <motion.div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5" style={{ background: "rgba(2,6,23,0.65)", backdropFilter: "blur(12px)" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeEditor}>
            <motion.div initial={{ opacity: 0, y: 24, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 14, scale: 0.96 }} transition={{ type: "spring", stiffness: 130, damping: 16 }} className="w-full max-w-2xl rounded-[28px] overflow-hidden max-h-[92vh] overflow-y-auto border" style={{ background: "#1E293B", borderColor: "rgba(255,255,255,0.08)", boxShadow: "0 42px 110px rgba(0,0,0,0.5)" }} onClick={(e) => e.stopPropagation()}>
              <div className="h-1" style={{ background: `linear-gradient(90deg, ${theme.gold}, ${theme.accent}, ${theme.success})` }} />
              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "rgba(250,204,21,0.10)", color: theme.gold }}><Pencil className="w-5 h-5" /></div>
                    <div><h3 className="text-xl font-bold text-white">{modalTitle}</h3><p className="text-sm text-slate-400">Save only this selected item.</p></div>
                  </div>
                  <button type="button" onClick={closeEditor} className="w-10 h-10 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-colors text-slate-400" style={{ border: "1px solid rgba(255,255,255,0.06)" }}><X className="w-5 h-5" /></button>
                </div>

                {modalError && <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-red-400"><div className="flex items-start gap-2 font-medium"><AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" /><span>{modalError}</span></div></div>}

                <div className="space-y-5">
                  {editingTarget.type === "hero" && (
                    <>
                      <Field label="Hero Badge" value={modalForm.heroBadge} onChange={(v) => updateModalField("heroBadge", v)} />
                      <Field label="Hero Title" value={modalForm.heroTitle} onChange={(v) => updateModalField("heroTitle", v)} />
                      <Field label="Highlight Word" value={modalForm.heroHighlight} onChange={(v) => updateModalField("heroHighlight", v)} />
                      <Field label="Hero Description" value={modalForm.heroDescription} onChange={(v) => updateModalField("heroDescription", v)} textarea rows={5} />
                    </>
                  )}
                  {editingTarget.type === "feature" && (
                    <>
                      <Field label="Title" value={modalForm.title} onChange={(v) => updateModalField("title", v)} />
                      <Field label="Description" value={modalForm.description} onChange={(v) => updateModalField("description", v)} textarea rows={4} />
                      <Field label="Icon (Emoji)" value={modalForm.icon} onChange={(v) => updateModalField("icon", v)} />
                    </>
                  )}
                  {editingTarget.type === "step" && (
                    <>
                      <Field label="Step Number (e.g. 01)" value={modalForm.stepNumber} onChange={(v) => updateModalField("stepNumber", v)} />
                      <Field label="Step Title" value={modalForm.title} onChange={(v) => updateModalField("title", v)} />
                      <Field label="Step Description" value={modalForm.description} onChange={(v) => updateModalField("description", v)} textarea rows={4} />
                    </>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-7">
                  {canDeleteSelected && (
                    <button type="button" onClick={() => setDeleteTarget(editingTarget)} disabled={saving} className="sm:w-auto px-5 py-3 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5 disabled:opacity-60 inline-flex items-center justify-center gap-2 border border-red-500/20 text-red-400 bg-red-500/10"><Trash2 className="w-4 h-4" /> Delete</button>
                  )}
                  <button type="button" onClick={closeEditor} disabled={saving} className="flex-1 py-3 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5 disabled:opacity-60 bg-white/5 border border-white/10 text-slate-400 hover:text-white">Cancel</button>
                  <button type="button" onClick={saveSelectedPart} disabled={saving} className="flex-1 py-3 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5 disabled:opacity-60 inline-flex items-center justify-center gap-2 text-white" style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`, boxShadow: "0 8px 24px rgba(37,99,235,0.25)" }}><Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Item"}</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* ── DELETE CONFIRMATION ── */}
        {deleteTarget && (
          <motion.div className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-5" style={{ background: "rgba(2,6,23,0.7)", backdropFilter: "blur(14px)" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { if (!saving) setDeleteTarget(null); }}>
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.96 }} className="w-full max-w-md rounded-[28px] overflow-hidden border" style={{ background: "#1E293B", borderColor: "rgba(255,255,255,0.08)", boxShadow: "0 42px 110px rgba(0,0,0,0.5)" }} onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                <div className="w-14 h-14 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center mb-5 border border-red-500/20"><Trash2 className="w-6 h-6" /></div>
                <h3 className="text-2xl font-bold text-white mb-2">Are you sure?</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-6">This will permanently delete this item from the Admissions page.</p>
                <div className="flex gap-3">
                  <button type="button" disabled={saving} onClick={() => setDeleteTarget(null)} className="flex-1 py-3 rounded-xl text-sm font-bold disabled:opacity-60 bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-colors">Cancel</button>
                  <button type="button" disabled={saving} onClick={() => deleteTargetItem(deleteTarget)} className="flex-1 py-3 rounded-xl text-sm font-bold disabled:opacity-60 inline-flex items-center justify-center gap-2 text-white" style={{ background: `linear-gradient(135deg, ${theme.danger}, #991B1B)`, boxShadow: "0 8px 24px rgba(239,68,68,0.25)" }}><Trash2 className="w-4 h-4" /> {saving ? "Deleting..." : "Yes, Delete"}</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}