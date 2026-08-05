import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

const API_URL = import.meta.env.VITE_API_URL;
import {
  AlertCircle,
  ArrowLeft,
  Bell,
  CheckCircle2,
  CheckSquare,
  Eye,
  FileText,
  Image as ImageIcon,
  ListChecks,
  Pencil,
  Plus,
  Save,
  Square,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";

// ── FIXED IMPORT: Safely handles both named and default exports ──
import * as NoticesModule from "../pages/Notices";

// ── EXTRACT THE EXPORTS FROM YOUR COMPONENT MODULE ──
const Notices = NoticesModule.default || NoticesModule.Notices;
const defaultNoticeSettings = NoticesModule.defaultNoticeSettings || {};
const formatNoticeDate = NoticesModule.formatNoticeDate || ((date) => date || "N/A");
const normalizeNotice = NoticesModule.normalizeNotice || ((n) => n);
const sortNoticesNewestFirst = NoticesModule.sortNoticesNewestFirst || ((arr) => arr);

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
  dark: "#0B1020",
  cyan: "#22D3EE",
  gold: "#FACC15",
};

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
        rows={rows}
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
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

function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="w-full flex items-center justify-between gap-4 rounded-xl px-4 py-3 text-left"
      style={{
        background: checked
          ? "rgba(34, 197, 94, 0.1)"
          : "rgba(255,255,255,0.05)",
        border: checked
          ? "1px solid rgba(34, 197, 94, 0.2)"
          : "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <span className="text-sm font-medium text-slate-300">{label}</span>
      <span
        className="relative w-12 h-7 rounded-full transition-all"
        style={{ background: checked ? colors.green : "#334155" }}
      >
        <span
          className="absolute top-1 w-5 h-5 rounded-full bg-white transition-all shadow"
          style={{ left: checked ? "24px" : "4px" }}
        />
      </span>
    </button>
  );
}

function getAuthHeaders(json = false) {
  const token = localStorage.getItem("adminToken");
  const headers = {};

  if (json) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  return headers;
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

function noticeToBackendPayload(notice = {}) {
  return {
    title: notice.title || "",
    category: notice.category || "",
    notice_date: notice.notice_date || null,
    description: notice.description || "",
    pdf_url: notice.pdf_url || "",
    pinned: Boolean(notice.pinned),
  };
}

function getDeleteLabel(target) {
  if (!target) return "this item";
  if (target.type === "notice") return "this notice";
  if (target.type === "bulkNotice") return `${target.count || 0} selected notice(s)`;
  return "this item";
}

export default function AdminNotices() {
  const [notices, setNotices] = useState([]);
  const [settings, setSettings] = useState(defaultNoticeSettings);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [editingTarget, setEditingTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [modalForm, setModalForm] = useState({});

  const [showAllNotices, setShowAllNotices] = useState(false);
  const [selectedNoticeIds, setSelectedNoticeIds] = useState([]);

  useEffect(() => {
    let alive = true;

    const loadData = async () => {
      try {
        await Promise.all([fetchNotices(), fetchSettings()]);
      } finally {
        if (alive) setLoading(false);
      }
    };

    loadData();

    return () => {
      alive = false;
    };
  }, []);

  const fetchNotices = async () => {
    try {
      const response = await fetch(`${API_URL}/api/notices`);
      const result = await response.json();

      if (result.success && Array.isArray(result.data)) {
        setNotices(
          sortNoticesNewestFirst(result.data.map((item) => normalizeNotice(item)))
        );
      }
    } catch (err) {
      console.error("Fetch notices error:", err);
      setError("Could not load notices.");
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await fetch(`${API_URL}/api/notice-settings`);
      const result = await response.json();

      if (result.success) {
        setSettings({ ...defaultNoticeSettings, ...(result.data || {}) });
      }
    } catch (err) {
      console.error("Fetch notice settings error:", err);
      setError("Could not load notice settings.");
    }
  };

  const refreshAll = async () => {
    await Promise.all([fetchNotices(), fetchSettings()]);
  };

  const updateModalField = (name, value) => {
    setModalForm((prev) => ({ ...prev, [name]: value }));
  };

  const openEditor = (target) => {
    setSuccess("");
    setError("");
    setEditingTarget(target);

    if (target.type === "pageHeader") {
      setModalForm({
        page_badge: settings.page_badge || "",
        page_title: settings.page_title || "",
        page_description: settings.page_description || "",
      });
      return;
    }

    if (target.type === "sidebar") {
      setModalForm({
        sidebar_title: settings.sidebar_title || "",
        sidebar_description: settings.sidebar_description || "",
        sidebar_button_text: settings.sidebar_button_text || "",
        sidebar_button_link: settings.sidebar_button_link || "",
      });
      return;
    }

    if (target.type === "newNotice") {
      setModalForm({
        title: "",
        category: "General",
        notice_date: new Date().toISOString().slice(0, 10),
        description: "",
        pdf_url: "",
        pinned: false,
      });
      return;
    }

    if (target.type === "notice") {
      const notice = notices.find((item) => item.id === target.id) || {};
      setModalForm({
        id: notice.id,
        title: notice.title || "",
        category: notice.category || "General",
        notice_date: notice.notice_date || "",
        description: notice.description || "",
        pdf_url: notice.pdf_url || "",
        pinned: Boolean(notice.pinned),
      });
    }
  };

  const closeEditor = () => {
    if (saving || uploading) return;
    setEditingTarget(null);
    setModalForm({});
  };

  const saveSettingsPatch = async (patch, message) => {
    const nextSettings = { ...settings, ...patch };

    const response = await fetch(`${API_URL}/api/notice-settings`, {
      method: "PUT",
      headers: getAuthHeaders(true),
      body: JSON.stringify(nextSettings),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to save notice settings.");
    }

    setSettings(nextSettings);
    setSuccess(message || "Notice settings saved successfully.");
  };

  const saveSelectedPart = async () => {
    if (!editingTarget) return;

    setSaving(true);
    setSuccess("");
    setError("");

    try {
      if (editingTarget.type === "pageHeader") {
        await saveSettingsPatch(
          {
            page_badge: modalForm.page_badge || "",
            page_title: modalForm.page_title || "",
            page_description: modalForm.page_description || "",
          },
          "Notice page heading saved successfully."
        );
      }

      if (editingTarget.type === "sidebar") {
        await saveSettingsPatch(
          {
            sidebar_title: modalForm.sidebar_title || "",
            sidebar_description: modalForm.sidebar_description || "",
            sidebar_button_text: modalForm.sidebar_button_text || "",
            sidebar_button_link: modalForm.sidebar_button_link || "",
          },
          "Sidebar card saved successfully."
        );
      }

      if (editingTarget.type === "newNotice") {
        if (!String(modalForm.title || "").trim()) {
          throw new Error("Notice title is required.");
        }

        const response = await fetch(`${API_URL}/api/notices`, {
          method: "POST",
          headers: getAuthHeaders(true),
          body: JSON.stringify(noticeToBackendPayload(modalForm)),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to create notice.");
        }

        setSuccess("Notice added successfully.");
        await fetchNotices();
      }

      if (editingTarget.type === "notice") {
        if (!String(modalForm.title || "").trim()) {
          throw new Error("Notice title is required.");
        }

        const response = await fetch(
          `${API_URL}/api/notices/${editingTarget.id}`,
          {
            method: "PUT",
            headers: getAuthHeaders(true),
            body: JSON.stringify(noticeToBackendPayload(modalForm)),
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to update notice.");
        }

        setSuccess("Notice saved successfully.");
        await fetchNotices();
      }

      setEditingTarget(null);
      setModalForm({});
    } catch (err) {
      console.error("Save notice editor error:", err);
      setError(err.message || "Could not save selected item.");
    } finally {
      setSaving(false);
    }
  };

  const uploadPdf = async (file) => {
    if (!file) return;

    setSuccess("");
    setError("");

    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");
    const maxSize = 10 * 1024 * 1024;

    if (!isPdf) {
      setError("Please upload only a PDF file.");
      return;
    }

    if (file.size > maxSize) {
      setError("PDF file must be less than 10 MB.");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_URL}/api/upload`, {
        method: "POST",
        headers: getAuthHeaders(false),
        body: formData,
      });

      const result = await response.json();
      const uploadedUrl = getUploadUrl(result);

      if (!response.ok || !uploadedUrl) {
        throw new Error(result?.message || "PDF upload failed.");
      }

      updateModalField("pdf_url", uploadedUrl);
      setSuccess("PDF uploaded. Click Save This Item to publish it.");
    } catch (err) {
      console.error("PDF upload error:", err);
      setError(err.message || "PDF upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const deleteTargetItem = async (target) => {
    if (!target) return;

    if (target.type === "bulkNotice") {
      await deleteSelectedNotices();
      setDeleteTarget(null);
      return;
    }

    if (target.type !== "notice") return;

    setSaving(true);
    setSuccess("");
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/notices/${target.id}`, {
        method: "DELETE",
        headers: getAuthHeaders(false),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to delete notice.");
      }

      setNotices((prev) => prev.filter((notice) => notice.id !== target.id));
      setSelectedNoticeIds((prev) => prev.filter((id) => id !== target.id));
      setSuccess("Notice deleted successfully.");
      setDeleteTarget(null);
      setEditingTarget(null);
      setModalForm({});
    } catch (err) {
      console.error("Delete notice error:", err);
      setError(err.message || "Could not delete notice.");
    } finally {
      setSaving(false);
    }
  };

  const deleteSelectedNotices = async () => {
    if (selectedNoticeIds.length === 0) {
      setError("Select at least one notice to delete.");
      return;
    }

    setSaving(true);
    setSuccess("");
    setError("");

    try {
      for (const id of selectedNoticeIds) {
        const response = await fetch(`${API_URL}/api/notices/${id}`, {
          method: "DELETE",
          headers: getAuthHeaders(false),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to delete selected notice.");
        }
      }

      setNotices((prev) => prev.filter((notice) => !selectedNoticeIds.includes(notice.id)));
      setSelectedNoticeIds([]);
      setSuccess("Selected notices deleted successfully.");
    } catch (err) {
      console.error("Delete selected notices error:", err);
      setError(err.message || "Could not delete selected notices.");
      await fetchNotices();
    } finally {
      setSaving(false);
    }
  };

  const toggleSelectedNotice = (id) => {
    setSelectedNoticeIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedNoticeIds.length === notices.length) {
      setSelectedNoticeIds([]);
      return;
    }

    setSelectedNoticeIds(notices.map((notice) => notice.id));
  };

  const modalTitle = useMemo(() => {
    if (!editingTarget) return "";

    const titles = {
      pageHeader: "Edit Notice Page Heading",
      sidebar: "Edit Sidebar Help Card",
      newNotice: "Add New Notice",
      notice: "Edit Notice",
    };

    return titles[editingTarget.type] || "Edit Notice Section";
  }, [editingTarget]);

  const isNoticeEditor =
    editingTarget?.type === "notice" || editingTarget?.type === "newNotice";
  const allSelected = notices.length > 0 && selectedNoticeIds.length === notices.length;

  if (loading) {
    return (
      <div className="py-16 flex items-center justify-center" style={{ background: theme.bg }}>
        <div className="text-slate-400 font-medium">Loading visual notice editor...</div>
      </div>
    );
  }

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
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-3 bg-blue-500/10 text-blue-300 border border-blue-500/20">
              <Eye className="w-3.5 h-3.5" />
              Visual Notice Editor
            </div>

            <h2
              className="text-2xl md:text-3xl font-bold text-white tracking-tight"
              style={{
                letterSpacing: "-0.04em",
              }}
            >
              Hover and Edit Notice Page
            </h2>

            <p className="text-sm text-slate-400 mt-1">
              Hover page heading and notice cards. Add Notice is inside the notice board. Only two notices are shown here; use View All for bulk delete.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => openEditor({ type: "newNotice" })}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5"
              style={{
                background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
                color: "#FFFFFF",
                boxShadow: "0 8px 24px rgba(37,99,235,0.25)",
              }}
            >
              <Plus className="w-4 h-4" />
              Add Notice
            </button>

            <button
              type="button"
              onClick={() => setShowAllNotices(true)}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5 text-slate-300 hover:text-white"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <ListChecks className="w-4 h-4" />
              View All ({notices.length})
            </button>

            <Link
              to="/admin/dashboard"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5 text-slate-400 hover:text-white"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </Link>
          </div>
        </div>

        {success && (
          <div className="mb-4 rounded-xl px-4 py-3 flex items-center gap-2 font-medium bg-green-500/10 text-green-400 border border-green-500/20">
            <CheckCircle2 className="w-4 h-4" />
            {success}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-xl px-4 py-3 flex items-center gap-2 font-medium bg-red-500/10 text-red-400 border border-red-500/20">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <div
          className="admin-notices-preview-frame rounded-[2rem] overflow-x-auto border"
          style={{
            background: "rgba(255,255,255,0.02)",
            borderColor: "rgba(255,255,255,0.06)",
          }}
        >
          <div className="admin-notices-preview-frame w-full min-w-0">
            <Notices
              editMode
              noticesOverride={notices}
              announcementsOverride={[]}
              settingsOverride={settings}
              loadingOverride={false}
              onEditTarget={openEditor}
              onDeleteTarget={(target) => setDeleteTarget(target)}
              onAddNotice={() => openEditor({ type: "newNotice" })}
              onViewAllNotices={() => setShowAllNotices(true)}
            />
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {editingTarget && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5"
            style={{ background: "rgba(2,6,23,0.65)", backdropFilter: "blur(12px)" }}
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
              className="w-full max-w-xl rounded-[28px] overflow-hidden max-h-[92vh] overflow-y-auto border"
              style={{
                background: "#1E293B",
                borderColor: "rgba(255,255,255,0.08)",
                boxShadow: "0 42px 110px rgba(0,0,0,0.5)",
              }}
              onClick={(event) => event.stopPropagation()}
            >
              <div
                className="h-1"
                style={{ background: `linear-gradient(90deg, ${colors.gold}, ${colors.cyan}, ${colors.green})` }}
              />

              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center"
                      style={{
                        background: "rgba(250,204,21,0.10)",
                        color: colors.gold,
                      }}
                    >
                      {isNoticeEditor ? <FileText className="w-5 h-5" /> : <Pencil className="w-5 h-5" />}
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {modalTitle}
                      </h3>
                      <p className="text-sm text-slate-400">
                        Save only this selected notice-page item.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={closeEditor}
                    className="w-10 h-10 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-colors text-slate-400"
                    style={{ border: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-5">
                  {editingTarget.type === "pageHeader" && (
                    <>
                      <Field label="Page Badge" value={modalForm.page_badge} onChange={(v) => updateModalField("page_badge", v)} />
                      <Field label="Page Title" value={modalForm.page_title} onChange={(v) => updateModalField("page_title", v)} />
                      <TextArea label="Page Description" value={modalForm.page_description} onChange={(v) => updateModalField("page_description", v)} rows={4} />
                    </>
                  )}

                  {editingTarget.type === "sidebar" && (
                    <>
                      <Field label="Sidebar Title" value={modalForm.sidebar_title} onChange={(v) => updateModalField("sidebar_title", v)} />
                      <TextArea label="Sidebar Description" value={modalForm.sidebar_description} onChange={(v) => updateModalField("sidebar_description", v)} rows={4} />
                      <Field label="Button Text" value={modalForm.sidebar_button_text} onChange={(v) => updateModalField("sidebar_button_text", v)} />
                      <Field label="Button Link" value={modalForm.sidebar_button_link} onChange={(v) => updateModalField("sidebar_button_link", v)} />
                    </>
                  )}

                  {isNoticeEditor && (
                    <>
                      <Field label="Notice Title" value={modalForm.title} onChange={(v) => updateModalField("title", v)} placeholder="Enter notice title" />
                      <div className="grid md:grid-cols-2 gap-4">
                        <Field label="Category" value={modalForm.category} onChange={(v) => updateModalField("category", v)} placeholder="Exam / Holiday / Admission" />
                        <Field label="Notice Date" type="date" value={modalForm.notice_date} onChange={(v) => updateModalField("notice_date", v)} />
                      </div>
                      <TextArea label="Description" value={modalForm.description} onChange={(v) => updateModalField("description", v)} rows={5} placeholder="Write notice details" />

                      <div className="rounded-2xl p-5 border" style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)" }}>
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-16 rounded-xl bg-slate-800/80 border border-slate-700/50 overflow-hidden flex items-center justify-center">
                            {modalForm.pdf_url ? (
                              <FileText className="w-8 h-8 text-green-400" />
                            ) : (
                              <ImageIcon className="w-7 h-7 text-slate-500" />
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-white">Notice PDF</div>
                            <div className="text-slate-400 text-sm mt-1 leading-relaxed">PDF only, maximum 10 MB.</div>
                          </div>
                        </div>

                        <label className="mt-4 flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-bold cursor-pointer text-white" style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`, boxShadow: "0 8px 24px rgba(37,99,235,0.25)" }}>
                          <UploadCloud className="w-4 h-4" />
                          {uploading ? "Uploading..." : "Upload PDF"}
                          <input type="file" accept="application/pdf,.pdf" disabled={uploading} onChange={(event) => { uploadPdf(event.target.files?.[0]); event.target.value = ""; }} className="hidden" />
                        </label>
                      </div>

                      <Field label="PDF URL" value={modalForm.pdf_url} onChange={(v) => updateModalField("pdf_url", v)} placeholder="Uploaded PDF URL will appear here" />

                      {modalForm.pdf_url && (
                        <div className="flex flex-wrap gap-2">
                          <a href={modalForm.pdf_url} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-xl text-sm font-medium bg-white/10 text-white border border-white/10 hover:bg-white/20 transition">View PDF</a>
                          <button type="button" onClick={() => updateModalField("pdf_url", "")} className="px-4 py-2 rounded-xl text-sm font-medium border border-red-500/20 text-red-400 bg-red-500/10 transition">Remove PDF</button>
                        </div>
                      )}

                      <Toggle label="Pin this notice as important" checked={modalForm.pinned === true} onChange={(v) => updateModalField("pinned", v)} />
                    </>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-7">
                  {editingTarget.type === "notice" && (
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(editingTarget)}
                      disabled={saving || uploading}
                      className="sm:w-auto px-5 py-3 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5 disabled:opacity-60 inline-flex items-center justify-center gap-2 border border-red-500/20 text-red-400 bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={closeEditor}
                    disabled={saving || uploading}
                    className="flex-1 py-3 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5 disabled:opacity-60 bg-white/5 border border-white/10 text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={saveSelectedPart}
                    disabled={saving || uploading}
                    className="flex-1 py-3 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5 disabled:opacity-60 inline-flex items-center justify-center gap-2 text-white"
                    style={{
                      background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
                      boxShadow: "0 8px 24px rgba(37,99,235,0.25)",
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
            style={{ background: "rgba(2,6,23,0.7)", backdropFilter: "blur(14px)" }}
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
              className="w-full max-w-md rounded-[28px] overflow-hidden border"
              style={{
                background: "#1E293B",
                borderColor: "rgba(255,255,255,0.08)",
                boxShadow: "0 42px 110px rgba(0,0,0,0.5)",
              }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="p-6">
                <div className="w-14 h-14 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center mb-5 border border-red-500/20">
                  <Trash2 className="w-6 h-6" />
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">
                  Are you sure?
                </h3>

                <p className="text-sm text-slate-400 leading-relaxed mb-6">
                  This will permanently delete {getDeleteLabel(deleteTarget)}.
                </p>

                <div className="flex gap-3">
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => setDeleteTarget(null)}
                    className="flex-1 py-3 rounded-xl text-sm font-bold disabled:opacity-60 bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => deleteTargetItem(deleteTarget)}
                    className="flex-1 py-3 rounded-xl text-sm font-bold disabled:opacity-60 inline-flex items-center justify-center gap-2 text-white"
                    style={{
                      background: `linear-gradient(135deg, ${theme.danger}, #991B1B)`,
                      boxShadow: "0 8px 24px rgba(239,68,68,0.25)",
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

        {showAllNotices && (
          <motion.div
            className="fixed inset-0 z-[9998] flex items-center justify-center p-3 sm:p-5"
            style={{ background: "rgba(2,6,23,0.7)", backdropFilter: "blur(14px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAllNotices(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              className="w-full max-w-5xl rounded-[30px] overflow-hidden border"
              style={{
                background: "#1E293B",
                borderColor: "rgba(255,255,255,0.08)",
                boxShadow: "0 30px 90px rgba(0,0,0,0.5)",
              }}
              onClick={(event) => event.stopPropagation()}
            >
              <div
                className="p-5 flex items-center justify-between gap-4 border-b"
                style={{ borderColor: "rgba(255,255,255,0.08)" }}
              >
                <div>
                  <div className="text-xl font-bold text-white">
                    All Notices
                  </div>
                  <div className="text-sm text-slate-400">
                    Select one, many, or all notices to delete. Click edit to update any notice.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAllNotices(false)}
                  className="p-3 rounded-2xl hover:bg-white/10 transition-colors text-slate-400"
                  style={{ border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                  <button
                    type="button"
                    onClick={toggleSelectAll}
                    className="inline-flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-slate-300 hover:text-white"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    {allSelected ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                    {allSelected ? "Unselect All" : "Select All"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteTarget({ type: "bulkNotice", count: selectedNoticeIds.length })}
                    disabled={saving || selectedNoticeIds.length === 0}
                    className="inline-flex items-center gap-2 px-4 py-3 rounded-xl font-bold disabled:opacity-50 border border-red-500/20 text-red-400 bg-red-500/10"
                  >
                    <Trash2 className="w-5 h-5" />
                    Delete Selected ({selectedNoticeIds.length})
                  </button>
                </div>

                <div className="max-h-[62vh] overflow-y-auto pr-1 space-y-3">
                  {notices.length === 0 ? (
                    <div className="rounded-2xl p-10 text-center border" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                      <FileText className="w-12 h-12 mx-auto text-slate-500 mb-3" />
                      <div className="font-bold text-white">No notices available</div>
                    </div>
                  ) : (
                    notices.map((notice, index) => {
                      const checked = selectedNoticeIds.includes(notice.id);

                      return (
                        <div
                          key={notice.id}
                          className="w-full rounded-2xl p-4 flex items-start gap-4 transition-all hover:-translate-y-0.5 border"
                          style={{
                            background: checked
                              ? "rgba(167, 139, 250, 0.08)"
                              : "rgba(255,255,255,0.03)",
                            border: checked
                              ? "1px solid rgba(167, 139, 250, 0.3)"
                              : "rgba(255,255,255,0.06)",
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => toggleSelectedNotice(notice.id)}
                            className="mt-1"
                            style={{ color: checked ? colors.purple : "#475569" }}
                          >
                            {checked ? <CheckSquare className="w-6 h-6" /> : <Square className="w-6 h-6" />}
                          </button>

                          <button
                            type="button"
                            onClick={() => openEditor({ type: "notice", id: notice.id, index })}
                            className="min-w-0 flex-1 text-left"
                          >
                            <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500 mb-1">
                              Notice {index + 1}
                            </div>
                            <div className="font-bold text-white truncate">
                              {notice.title || "Untitled notice"}
                            </div>
                            <div className="text-sm text-slate-400">
                              {notice.category || "No category"} · {formatNoticeDate(notice.notice_date)}
                            </div>
                            <p className="text-sm text-slate-400 mt-2 line-clamp-2">
                              {notice.description || "No description"}
                            </p>
                          </button>

                          <button
                            type="button"
                            onClick={() => openEditor({ type: "notice", id: notice.id, index })}
                            className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeleteTarget({ type: "notice", id: notice.id, index })}
                            disabled={saving}
                            className="p-3 rounded-xl disabled:opacity-50 bg-red-500/10 text-red-400 border border-red-500/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}