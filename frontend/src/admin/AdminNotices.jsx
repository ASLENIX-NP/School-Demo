import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
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

import Notices, {
  defaultNoticeSettings,
  formatNoticeDate,
  normalizeNotice,
  sortNoticesNewestFirst,
} from "../pages/Notices";

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

function Field({ label, value, onChange, placeholder = "", type = "text" }) {
  return (
    <div>
      <label className="block text-sm font-black mb-2 text-slate-700">
        {label}
      </label>
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
        rows={rows}
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-2xl outline-none text-sm resize-none"
        style={{
          background: "rgba(255,255,255,0.92)",
          border: "1px solid rgba(75,46,131,0.16)",
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
        style={{ background: checked ? colors.green : "#CBD5E1" }}
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
      const response = await fetch("https://school-website-backend-ixx2.onrender.com/api/notices");
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
      const response = await fetch("https://school-website-backend-ixx2.onrender.com/api/notice-settings");
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

    const response = await fetch("https://school-website-backend-ixx2.onrender.com/api/notice-settings", {
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

        const response = await fetch("https://school-website-backend-ixx2.onrender.com/api/notices", {
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
          `https://school-website-backend-ixx2.onrender.com/api/notices/${editingTarget.id}`,
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

      const response = await fetch("https://school-website-backend-ixx2.onrender.com/api/upload", {
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
      const response = await fetch(`https://school-website-backend-ixx2.onrender.com/api/notices/${target.id}`, {
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
        const response = await fetch(`https://school-website-backend-ixx2.onrender.com/api/notices/${id}`, {
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
      <div className="py-16 flex items-center justify-center">
        <div className="text-slate-600 font-semibold">
          Loading visual notice editor...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <style>
        {`
          .admin-notices-preview-frame .bg-slate-950 {
            background: linear-gradient(135deg, rgba(255,255,255,0.96), rgba(248,244,255,0.95), rgba(238,247,255,0.95)) !important;
            color: #0F172A !important;
            border: 1px solid rgba(75,46,131,0.12) !important;
            box-shadow: 0 18px 44px rgba(15,23,42,0.08) !important;
          }

          .admin-notices-preview-frame .bg-slate-950 [class*="text-white"] {
            color: #0F172A !important;
          }

          .admin-notices-preview-frame .bg-slate-950 [class*="text-white/"] {
            color: #64748B !important;
          }

          /* Mobile fix: Only make admin edit buttons visible on mobile */
          @media (max-width: 767px) {
            .admin-notices-preview-frame .group button[class*="absolute"],
            .admin-notices-preview-frame .group [class*="absolute"] button,
            .admin-notices-preview-frame .group .opacity-0,
            .admin-notices-preview-frame .group [class*="opacity-0"],
            .admin-notices-preview-frame .group .md\\:opacity-0,
            .admin-notices-preview-frame .group [class*="md:opacity-0"],
            .admin-notices-preview-frame .group [class*="group-hover:opacity"],
            .admin-notices-preview-frame [class*="group-hover:opacity"] {
              opacity: 1 !important;
              visibility: visible !important;
              pointer-events: auto !important;
            }

            .admin-notices-preview-frame .group button {
              min-width: 2rem !important;
              min-height: 2rem !important;
            }
          }
        `}
      </style>
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[24px] p-4 sm:p-5 md:p-6"
        style={lightAdminPanelStyle}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black mb-3 bg-purple-50 text-purple-700 border border-purple-100">
              <Eye className="w-3.5 h-3.5" />
              Visual Notice Editor
            </div>

            <h2
              className="text-2xl md:text-3xl font-black text-slate-950"
              style={{
                fontFamily: "var(--font-display)",
                letterSpacing: "-0.04em",
              }}
            >
              Hover and Edit Notice Page
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Hover page heading and notice cards. Add Notice is inside the notice board. Only two notices are shown here; use View All for bulk delete.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => openEditor({ type: "newNotice" })}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl font-black text-sm transition-all hover:-translate-y-0.5"
              style={{
                background: `linear-gradient(135deg, ${colors.gold}, ${colors.cyan})`,
                color: colors.dark,
              }}
            >
              <Plus className="w-4 h-4" />
              Add Notice
            </button>

            <button
              type="button"
              onClick={() => setShowAllNotices(true)}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl font-black text-sm transition-all hover:-translate-y-0.5"
              style={{
                background: "rgba(255,255,255,0.86)",
                color: colors.purple,
                border: "1px solid rgba(75,46,131,0.18)",
              }}
            >
              <ListChecks className="w-4 h-4" />
              View All Notices ({notices.length})
            </button>

            <Link
              to="/admin/dashboard"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl font-black text-sm transition-all hover:-translate-y-0.5"
              style={{
                background: "rgba(15,23,42,0.06)",
                color: "rgba(15,23,42,0.72)",
                border: "1px solid rgba(15,23,42,0.08)",
              }}
            >
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </Link>
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
          className="admin-notices-preview-frame rounded-[2rem] overflow-x-auto"
          style={{
            background:
              "radial-gradient(circle at top left, rgba(56,189,248,0.14), transparent 34%), linear-gradient(180deg, #FFF8EE 0%, #F1ECFF 100%)",
            border: "1px solid rgba(15,23,42,0.08)",
          }}
        >
          <div className="admin-notices-preview-frame w-full min-w-0 bg-white">
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
            style={{ background: "rgba(2,6,23,0.55)", backdropFilter: "blur(12px)" }}
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
              className="w-full max-w-xl rounded-[28px] overflow-hidden max-h-[92vh] overflow-y-auto"
              style={{
                background: "#FFFFFF",
                border: "1px solid rgba(255,255,255,0.75)",
                boxShadow: "0 42px 110px rgba(0,0,0,0.28)",
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
                        background:
                          "linear-gradient(135deg, rgba(250,204,21,0.18), rgba(56,189,248,0.18))",
                        color: colors.dark,
                      }}
                    >
                      {isNoticeEditor ? <FileText className="w-5 h-5" /> : <Pencil className="w-5 h-5" />}
                    </div>

                    <div>
                      <h3 className="text-xl font-black text-slate-950">
                        {modalTitle}
                      </h3>
                      <p className="text-sm text-slate-500">
                        Save only this selected notice-page item.
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
                  {editingTarget.type === "pageHeader" && (
                    <>
                      <Field
                        label="Page Badge"
                        value={modalForm.page_badge}
                        onChange={(value) => updateModalField("page_badge", value)}
                      />
                      <Field
                        label="Page Title"
                        value={modalForm.page_title}
                        onChange={(value) => updateModalField("page_title", value)}
                      />
                      <TextArea
                        label="Page Description"
                        value={modalForm.page_description}
                        onChange={(value) => updateModalField("page_description", value)}
                        rows={4}
                      />
                    </>
                  )}

                  {editingTarget.type === "sidebar" && (
                    <>
                      <Field
                        label="Sidebar Title"
                        value={modalForm.sidebar_title}
                        onChange={(value) => updateModalField("sidebar_title", value)}
                      />
                      <TextArea
                        label="Sidebar Description"
                        value={modalForm.sidebar_description}
                        onChange={(value) => updateModalField("sidebar_description", value)}
                        rows={4}
                      />
                      <Field
                        label="Button Text"
                        value={modalForm.sidebar_button_text}
                        onChange={(value) => updateModalField("sidebar_button_text", value)}
                      />
                      <Field
                        label="Button Link"
                        value={modalForm.sidebar_button_link}
                        onChange={(value) => updateModalField("sidebar_button_link", value)}
                      />
                    </>
                  )}

                  {isNoticeEditor && (
                    <>
                      <Field
                        label="Notice Title"
                        value={modalForm.title}
                        onChange={(value) => updateModalField("title", value)}
                        placeholder="Enter notice title"
                      />
                      <div className="grid md:grid-cols-2 gap-4">
                        <Field
                          label="Category"
                          value={modalForm.category}
                          onChange={(value) => updateModalField("category", value)}
                          placeholder="Exam / Holiday / Admission"
                        />
                        <Field
                          label="Notice Date"
                          type="date"
                          value={modalForm.notice_date}
                          onChange={(value) => updateModalField("notice_date", value)}
                        />
                      </div>
                      <TextArea
                        label="Description"
                        value={modalForm.description}
                        onChange={(value) => updateModalField("description", value)}
                        rows={5}
                        placeholder="Write notice details"
                      />

                      <div
                        className="rounded-3xl p-5"
                        style={lightAdminPanelStyle}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-24 h-20 rounded-2xl bg-white overflow-hidden flex items-center justify-center">
                            {modalForm.pdf_url ? (
                              <FileText className="w-9 h-9 text-green-600" />
                            ) : (
                              <ImageIcon className="w-8 h-8 text-slate-300" />
                            )}
                          </div>

                          <div>
                            <div className="font-black text-slate-950">Notice PDF</div>
                            <div className="text-slate-500 text-sm mt-1 leading-relaxed">
                              PDF only, maximum 10 MB.
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
                          {uploading ? "Uploading..." : "Upload PDF"}
                          <input
                            type="file"
                            accept="application/pdf,.pdf"
                            disabled={uploading}
                            onChange={(event) => {
                              uploadPdf(event.target.files?.[0]);
                              event.target.value = "";
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>

                      <Field
                        label="PDF URL"
                        value={modalForm.pdf_url}
                        onChange={(value) => updateModalField("pdf_url", value)}
                        placeholder="Uploaded PDF URL will appear here"
                      />

                      {modalForm.pdf_url && (
                        <div className="flex flex-wrap gap-2">
                          <a
                            href={modalForm.pdf_url}
                            target="_blank"
                            rel="noreferrer"
                            className="px-4 py-2 rounded-xl text-sm font-bold bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 transition"
                          >
                            View PDF
                          </a>
                          <button
                            type="button"
                            onClick={() => updateModalField("pdf_url", "")}
                            className="px-4 py-2 rounded-xl text-sm font-bold bg-red-50 border border-red-100 transition"
                            style={{ color: colors.red }}
                          >
                            Remove PDF
                          </button>
                        </div>
                      )}

                      <Toggle
                        label="Pin this notice as important"
                        checked={modalForm.pinned === true}
                        onChange={(value) => updateModalField("pinned", value)}
                      />
                    </>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-7">
                  {editingTarget.type === "notice" && (
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(editingTarget)}
                      disabled={saving || uploading}
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
                    disabled={saving || uploading}
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
                    disabled={saving || uploading}
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

        {deleteTarget && (
          <motion.div
            className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-5"
            style={{ background: "rgba(2,6,23,0.62)", backdropFilter: "blur(14px)" }}
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
                  This will permanently delete {getDeleteLabel(deleteTarget)}.
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

        {showAllNotices && (
          <motion.div
            className="fixed inset-0 z-[9998] flex items-center justify-center p-3 sm:p-5"
            style={{ background: "rgba(2,6,23,0.72)", backdropFilter: "blur(14px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAllNotices(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              className="w-full max-w-5xl rounded-[30px] overflow-hidden"
              style={{
                background:
                  "linear-gradient(145deg, rgba(255,255,255,0.98), rgba(248,250,252,0.94))",
                border: "1px solid rgba(255,255,255,0.18)",
                boxShadow: "0 30px 90px rgba(0,0,0,0.35)",
              }}
              onClick={(event) => event.stopPropagation()}
            >
              <div
                className="p-5 flex items-center justify-between gap-4"
                style={{
                  ...lightAdminPanelStyle,
                  borderLeft: "0",
                  borderRight: "0",
                  borderTop: "0",
                  borderRadius: "0",
                  boxShadow: "0 12px 30px rgba(15,23,42,0.08)",
                }}
              >
                <div>
                  <div className="text-xl font-black" style={{ color: colors.dark }}>
                    All Notices
                  </div>
                  <div className="text-sm text-slate-500">
                    Select one, many, or all notices to delete. Click edit to update any notice.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAllNotices(false)}
                  className="p-3 rounded-2xl bg-slate-100 text-slate-600"
                  style={{
                    border: "1px solid rgba(15,23,42,0.08)",
                  }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                  <button
                    type="button"
                    onClick={toggleSelectAll}
                    className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl font-black"
                    style={{
                      background: "rgba(75,46,131,0.08)",
                      color: colors.purple,
                      border: "1px solid rgba(75,46,131,0.18)",
                    }}
                  >
                    {allSelected ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                    {allSelected ? "Unselect All" : "Select All"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteTarget({ type: "bulkNotice", count: selectedNoticeIds.length })}
                    disabled={saving || selectedNoticeIds.length === 0}
                    className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl font-black disabled:opacity-50"
                    style={{
                      background: "rgba(215,25,32,0.1)",
                      color: colors.red,
                      border: "1px solid rgba(215,25,32,0.2)",
                    }}
                  >
                    <Trash2 className="w-5 h-5" />
                    Delete Selected ({selectedNoticeIds.length})
                  </button>
                </div>

                <div className="max-h-[62vh] overflow-y-auto pr-1 space-y-3">
                  {notices.length === 0 ? (
                    <div className="rounded-3xl p-10 text-center border border-slate-200">
                      <FileText className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                      <div className="font-black text-slate-900">No notices available</div>
                    </div>
                  ) : (
                    notices.map((notice, index) => {
                      const checked = selectedNoticeIds.includes(notice.id);

                      return (
                        <div
                          key={notice.id}
                          className="w-full rounded-3xl p-4 flex items-start gap-4 transition-all hover:-translate-y-0.5"
                          style={{
                            background: checked
                              ? "rgba(75,46,131,0.09)"
                              : "rgba(255,255,255,0.84)",
                            border: checked
                              ? "1px solid rgba(75,46,131,0.28)"
                              : "1px solid rgba(15,23,42,0.08)",
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => toggleSelectedNotice(notice.id)}
                            className="mt-1"
                            style={{ color: checked ? colors.purple : "#94A3B8" }}
                          >
                            {checked ? <CheckSquare className="w-6 h-6" /> : <Square className="w-6 h-6" />}
                          </button>

                          <button
                            type="button"
                            onClick={() => openEditor({ type: "notice", id: notice.id, index })}
                            className="min-w-0 flex-1 text-left"
                          >
                            <div className="text-xs font-black uppercase tracking-[0.16em] text-slate-400 mb-1">
                              Notice {index + 1}
                            </div>
                            <div className="font-black text-slate-950 truncate">
                              {notice.title || "Untitled notice"}
                            </div>
                            <div className="text-sm text-slate-500">
                              {notice.category || "No category"} · {formatNoticeDate(notice.notice_date)}
                            </div>
                            <p className="text-sm text-slate-500 mt-2 line-clamp-2">
                              {notice.description || "No description"}
                            </p>
                          </button>

                          <button
                            type="button"
                            onClick={() => openEditor({ type: "notice", id: notice.id, index })}
                            className="p-3 rounded-xl"
                            style={{
                              background: "rgba(75,46,131,0.08)",
                              color: colors.purple,
                              border: "1px solid rgba(75,46,131,0.18)",
                            }}
                          >
                            <Pencil className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeleteTarget({ type: "notice", id: notice.id, index })}
                            disabled={saving}
                            className="p-3 rounded-xl disabled:opacity-50"
                            style={{
                              background: "rgba(215,25,32,0.09)",
                              color: colors.red,
                              border: "1px solid rgba(215,25,32,0.18)",
                            }}
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
