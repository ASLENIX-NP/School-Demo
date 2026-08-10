import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  FileText,
  Megaphone,
  Pencil,
  Pin,
  Plus,
  Save,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";

import Notices, {
  defaultNoticeSettings,
  normalizeNotice,
  sortNoticesNewestFirst,
} from "../pages/Notices";

const API_URL = import.meta.env.VITE_API_URL;

function authHeaders(json = false) {
  const token = localStorage.getItem("adminToken");
  const headers = {};

  if (json) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  return headers;
}

function getUploadUrl(result) {
  return (
    result?.url ||
    result?.imageUrl ||
    result?.fileUrl ||
    result?.data?.url ||
    result?.data?.imageUrl ||
    result?.data?.fileUrl ||
    result?.data?.secure_url ||
    result?.file?.url ||
    ""
  );
}

function payloadFromForm(form) {
  return {
    title: String(form.title || "").trim(),
    category: String(form.category || "General").trim(),
    notice_date: form.notice_date || null,
    description: String(form.description || "").trim(),
    pdf_url: form.pdf_url || "",
    pinned: Boolean(form.pinned),
  };
}

const blankNotice = () => ({
  title: "",
  category: "General",
  notice_date: new Date().toISOString().slice(0, 10),
  description: "",
  pdf_url: "",
  pinned: false,
});

function Input({ label, value, onChange, type = "text", placeholder }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-slate-700">
        {label}
      </span>
      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-semibold text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
      />
    </label>
  );
}

function Area({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-slate-700">
        {label}
      </span>
      <textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={5}
        className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-semibold leading-6 text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
      />
    </label>
  );
}

function Switch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-left"
    >
      <div>
        <div className="text-sm font-black text-slate-800">{label}</div>
        <div className="mt-1 text-xs text-slate-500">
          Important notices are shown at the top of the public page.
        </div>
      </div>
      <span
        className="relative h-7 w-12 shrink-0 rounded-full transition"
        style={{ background: checked ? "#2D6A4F" : "#CBD5E1" }}
      >
        <span
          className="absolute top-1 h-5 w-5 rounded-full bg-white shadow transition"
          style={{ left: checked ? 24 : 4 }}
        />
      </span>
    </button>
  );
}

function EditorModal({ form, setForm, mode, saving, uploading, onClose, onSave, onUpload, onDelete }) {
  const update = (key, value) =>
    setForm((previous) => ({ ...previous, [key]: value }));

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[32px] bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="h-2"
          style={{
            background:
              "linear-gradient(90deg,#2D6A4F,#D9A441,#4E9AA8)",
          }}
        />

        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700">
                <FileText size={14} />
                {mode === "new" ? "NEW NOTICE" : "EDIT NOTICE"}
              </span>
              <h2 className="mt-3 text-3xl font-black tracking-[-.05em] text-slate-950">
                {mode === "new" ? "Add a new notice" : "Edit this notice"}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Everything for the notice can be changed here.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={saving || uploading}
              className="rounded-full bg-slate-100 p-3 text-slate-500 hover:bg-slate-200"
            >
              <X size={18} />
            </button>
          </div>

          <div className="mt-7 space-y-5">
            <Input
              label="Notice Title *"
              value={form.title}
              onChange={(value) => update("title", value)}
              placeholder="Example: Final Examination Routine"
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                label="Category"
                value={form.category}
                onChange={(value) => update("category", value)}
                placeholder="Exam, Holiday, Admission..."
              />
              <Input
                label="Notice Date"
                type="date"
                value={form.notice_date}
                onChange={(value) => update("notice_date", value)}
              />
            </div>

            <Area
              label="Description"
              value={form.description}
              onChange={(value) => update("description", value)}
              placeholder="Write the complete notice details..."
            />

            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
                  <FileText size={20} />
                </div>
                <div>
                  <div className="font-black text-slate-900">PDF Attachment</div>
                  <div className="text-xs text-slate-500">
                    Upload a PDF up to 10 MB.
                  </div>
                </div>
              </div>

              <label className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3.5 text-sm font-black text-white transition hover:-translate-y-0.5">
                <UploadCloud size={17} />
                {uploading ? "Uploading..." : "Upload PDF"}
                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  disabled={uploading}
                  className="hidden"
                  onChange={(e) => {
                    onUpload(e.target.files?.[0]);
                    e.target.value = "";
                  }}
                />
              </label>

              {form.pdf_url && (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <a
                    href={form.pdf_url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl bg-white px-4 py-2 text-xs font-black text-slate-700 ring-1 ring-slate-200"
                  >
                    View PDF
                  </a>
                  <button
                    type="button"
                    onClick={() => update("pdf_url", "")}
                    className="rounded-xl bg-red-50 px-4 py-2 text-xs font-black text-red-600"
                  >
                    Remove PDF
                  </button>
                </div>
              )}
            </div>

            <Switch
              checked={Boolean(form.pinned)}
              onChange={(value) => update("pinned", value)}
              label="Pin this notice as important"
            />
          </div>

          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            {mode === "edit" ? (
              <button
                type="button"
                onClick={onDelete}
                disabled={saving || uploading}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-50 px-5 py-3.5 text-sm font-black text-red-600 disabled:opacity-50"
              >
                <Trash2 size={16} /> Delete
              </button>
            ) : (
              <div />
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={saving || uploading}
                className="rounded-2xl bg-slate-100 px-5 py-3.5 text-sm font-black text-slate-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onSave}
                disabled={saving || uploading}
                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-700 px-6 py-3.5 text-sm font-black text-white shadow-lg shadow-emerald-700/20 disabled:opacity-50"
              >
                <Save size={16} />
                {saving ? "Saving..." : "Save Notice"}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminNotices() {
  const [notices, setNotices] = useState([]);
  const [settings, setSettings] = useState(defaultNoticeSettings);
  const [loading, setLoading] = useState(true);

  const [editorOpen, setEditorOpen] = useState(false);
  const [editorMode, setEditorMode] = useState("new");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(blankNotice());

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsForm, setSettingsForm] = useState(defaultNoticeSettings);

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const load = async () => {
    setLoading(true);
    try {
      const [noticeResponse, settingsResponse] = await Promise.all([
        fetch(`${API_URL}/api/notices`),
        fetch(`${API_URL}/api/notice-settings`).catch(() => null),
      ]);

      const noticeResult = await noticeResponse.json();
      const settingsResult = settingsResponse
        ? await settingsResponse.json()
        : null;

      const raw = Array.isArray(noticeResult)
        ? noticeResult
        : noticeResult?.data || [];

      setNotices(sortNoticesNewestFirst(raw.map(normalizeNotice)));

      setSettings({
        ...defaultNoticeSettings,
        ...(settingsResult?.data || settingsResult || {}),
      });
    } catch (error) {
      console.error("Admin notices load error:", error);
      setMessage({
        type: "error",
        text: "Could not load notices.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const notify = (type, text) => {
    setMessage({ type, text });
    window.setTimeout(() => setMessage({ type: "", text: "" }), 4500);
  };

  const openNew = () => {
    setEditorMode("new");
    setEditingId(null);
    setForm(blankNotice());
    setEditorOpen(true);
  };

  const openEdit = (target) => {
    const notice = notices.find((item) => item.id === target?.id);
    if (!notice) return;

    setEditorMode("edit");
    setEditingId(notice.id);
    setForm({
      title: notice.title || "",
      category: notice.category || "General",
      notice_date: notice.notice_date || "",
      description: notice.description || "",
      pdf_url: notice.pdf_url || notice.file_url || "",
      pinned: Boolean(notice.pinned),
    });
    setEditorOpen(true);
  };

  const closeEditor = () => {
    if (saving || uploading) return;
    setEditorOpen(false);
    setEditingId(null);
  };

  const uploadPdf = async (file) => {
    if (!file) return;

    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      notify("error", "Please upload a PDF file only.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      notify("error", "PDF must be smaller than 10 MB.");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_URL}/api/upload`, {
        method: "POST",
        headers: authHeaders(false),
        body: formData,
      });

      const result = await response.json();
      const url = getUploadUrl(result);

      if (!response.ok || !url) {
        throw new Error(result?.message || "PDF upload failed.");
      }

      setForm((previous) => ({ ...previous, pdf_url: url }));
      notify("success", "PDF uploaded. Save the notice to publish it.");
    } catch (error) {
      console.error("PDF upload error:", error);
      notify("error", error.message || "PDF upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const saveNotice = async () => {
    if (!form.title.trim()) {
      notify("error", "Notice title is required.");
      return;
    }

    setSaving(true);

    try {
      const isEdit = editorMode === "edit";
      const url = isEdit
        ? `${API_URL}/api/notices/${editingId}`
        : `${API_URL}/api/notices`;

      const response = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: authHeaders(true),
        body: JSON.stringify(payloadFromForm(form)),
      });

      const result = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(result.message || "Could not save notice.");
      }

      notify(
        "success",
        isEdit ? "Notice updated successfully." : "Notice added successfully."
      );

      setEditorOpen(false);
      setEditingId(null);
      await load();
    } catch (error) {
      console.error("Save notice error:", error);
      notify("error", error.message || "Could not save notice.");
    } finally {
      setSaving(false);
    }
  };

  const deleteNotice = async () => {
    if (!editingId) return;

    const confirmed = window.confirm(
      "Delete this notice permanently? This cannot be undone."
    );

    if (!confirmed) return;

    setSaving(true);

    try {
      const response = await fetch(`${API_URL}/api/notices/${editingId}`, {
        method: "DELETE",
        headers: authHeaders(false),
      });

      const result = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(result.message || "Could not delete notice.");
      }

      notify("success", "Notice deleted successfully.");
      setEditorOpen(false);
      setEditingId(null);
      await load();
    } catch (error) {
      console.error("Delete notice error:", error);
      notify("error", error.message || "Could not delete notice.");
    } finally {
      setSaving(false);
    }
  };

  const openSettings = () => {
    setSettingsForm({
      ...defaultNoticeSettings,
      ...settings,
    });
    setSettingsOpen(true);
  };

  const saveSettings = async () => {
    setSaving(true);

    try {
      const response = await fetch(`${API_URL}/api/notice-settings`, {
        method: "PUT",
        headers: authHeaders(true),
        body: JSON.stringify(settingsForm),
      });

      const result = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(result.message || "Could not save page settings.");
      }

      setSettings(settingsForm);
      setSettingsOpen(false);
      notify("success", "Notice page settings updated.");
    } catch (error) {
      console.error("Save notice settings error:", error);
      notify("error", error.message || "Could not save page settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(circle at 10% 5%, rgba(45,106,79,.10), transparent 24%), radial-gradient(circle at 90% 15%, rgba(217,164,65,.12), transparent 28%), #F1F6F3",
      }}
    >
      <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link
            to="/admin/dashboard"
            className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-sm ring-1 ring-slate-200"
          >
            <ArrowLeft size={17} /> Dashboard
          </Link>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={openSettings}
              className="rounded-2xl bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-sm ring-1 ring-slate-200"
            >
              Edit Page Design
            </button>

            <Link
              to="/admin/announcements"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-sm ring-1 ring-slate-200"
            >
              <Megaphone size={16} /> Manage Announcements
            </Link>

            <button
              type="button"
              onClick={openNew}
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-black text-white shadow-lg shadow-emerald-700/20"
            >
              <Plus size={17} /> Add Notice
            </button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-[30px] bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,.07)] ring-1 ring-slate-200/70 sm:p-8"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <Pencil size={24} />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-[.18em] text-emerald-700">
                Admin Notice Manager
              </span>
              <h1 className="mt-2 text-3xl font-black tracking-[-.05em] text-slate-950 sm:text-4xl">
                Edit everything from here
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500">
                Add, edit, delete, pin and attach PDFs to notices. The large preview below is the same design visitors see on the public Notices page.
              </p>
            </div>
          </div>
        </motion.div>

        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-5 flex items-center gap-2 rounded-2xl px-5 py-4 text-sm font-black ${
              message.type === "error"
                ? "border border-red-200 bg-red-50 text-red-700"
                : "border border-emerald-200 bg-emerald-50 text-emerald-700"
            }`}
          >
            {message.type === "error" ? (
              <AlertCircle size={18} />
            ) : (
              <CheckCircle2 size={18} />
            )}
            {message.text}
          </motion.div>
        )}

        <div className="overflow-hidden rounded-[34px] bg-white shadow-[0_25px_80px_rgba(15,23,42,.10)] ring-1 ring-slate-200/70">
          {loading ? (
            <div className="p-20 text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />
              <p className="mt-4 font-bold text-slate-500">Loading notice editor...</p>
            </div>
          ) : (
            <Notices
              editMode
              noticesOverride={notices}
              announcementsOverride={[]}
              settingsOverride={settings}
              onEditTarget={openEdit}
              onDeleteTarget={openEdit}
              onAddNotice={openNew}
              onViewAllNotices={() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })}
            />
          )}
        </div>
      </div>

      <AnimatePresence>
        {editorOpen && (
          <EditorModal
            form={form}
            setForm={setForm}
            mode={editorMode}
            saving={saving}
            uploading={uploading}
            onClose={closeEditor}
            onSave={saveNotice}
            onUpload={uploadPdf}
            onDelete={deleteNotice}
          />
        )}

        {settingsOpen && (
          <div
            className="fixed inset-0 z-[99998] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md"
            onClick={() => !saving && setSettingsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[32px] bg-white p-6 shadow-2xl sm:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-black uppercase tracking-[.16em] text-emerald-700">
                    Page Settings
                  </span>
                  <h2 className="mt-2 text-3xl font-black tracking-[-.05em] text-slate-950">
                    Edit Notice Page
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setSettingsOpen(false)}
                  className="rounded-full bg-slate-100 p-3 text-slate-500"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mt-7 space-y-5">
                <Input
                  label="Page Badge"
                  value={settingsForm.page_badge}
                  onChange={(value) =>
                    setSettingsForm((p) => ({ ...p, page_badge: value }))
                  }
                />
                <Input
                  label="Page Title"
                  value={settingsForm.page_title}
                  onChange={(value) =>
                    setSettingsForm((p) => ({ ...p, page_title: value }))
                  }
                />
                <Area
                  label="Page Description"
                  value={settingsForm.page_description}
                  onChange={(value) =>
                    setSettingsForm((p) => ({
                      ...p,
                      page_description: value,
                    }))
                  }
                />

                <div className="border-t border-slate-100 pt-5">
                  <div className="mb-4 text-sm font-black text-slate-900">
                    Bottom Information Card
                  </div>

                  <div className="space-y-4">
                    <Input
                      label="Card Title"
                      value={settingsForm.sidebar_title}
                      onChange={(value) =>
                        setSettingsForm((p) => ({
                          ...p,
                          sidebar_title: value,
                        }))
                      }
                    />
                    <Area
                      label="Card Description"
                      value={settingsForm.sidebar_description}
                      onChange={(value) =>
                        setSettingsForm((p) => ({
                          ...p,
                          sidebar_description: value,
                        }))
                      }
                    />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Input
                        label="Button Text"
                        value={settingsForm.sidebar_button_text}
                        onChange={(value) =>
                          setSettingsForm((p) => ({
                            ...p,
                            sidebar_button_text: value,
                          }))
                        }
                      />
                      <Input
                        label="Button Link"
                        value={settingsForm.sidebar_button_link}
                        onChange={(value) =>
                          setSettingsForm((p) => ({
                            ...p,
                            sidebar_button_link: value,
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-7 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSettingsOpen(false)}
                  className="rounded-2xl bg-slate-100 px-5 py-3.5 text-sm font-black text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveSettings}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-2xl bg-emerald-700 px-6 py-3.5 text-sm font-black text-white disabled:opacity-50"
                >
                  <Save size={16} />
                  {saving ? "Saving..." : "Save Page"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
