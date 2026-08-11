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

  if (json) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

/* ---------------------------------------------
   RESPONSE HELPERS
--------------------------------------------- */

function extractData(result) {
  if (Array.isArray(result)) return result;

  if (Array.isArray(result?.data)) {
    return result.data;
  }

  if (Array.isArray(result?.notices)) {
    return result.notices;
  }

  if (Array.isArray(result?.data?.notices)) {
    return result.data.notices;
  }

  return [];
}

function extractSingleNotice(result) {
  if (!result) return null;

  if (result.data && !Array.isArray(result.data)) {
    return result.data;
  }

  if (result.notice) {
    return result.notice;
  }

  return result;
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

/* ---------------------------------------------
   NOTICE PAYLOAD
--------------------------------------------- */

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

function blankNotice() {
  return {
    title: "",
    category: "General",
    notice_date: new Date().toISOString().slice(0, 10),
    description: "",
    pdf_url: "",
    pinned: false,
  };
}

/* ---------------------------------------------
   INPUT
--------------------------------------------- */

function Input({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-slate-700">
        {label}
      </span>

      <input
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-semibold text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
      />
    </label>
  );
}

/* ---------------------------------------------
   TEXTAREA
--------------------------------------------- */

function Area({
  label,
  value,
  onChange,
  placeholder = "",
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-slate-700">
        {label}
      </span>

      <textarea
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={5}
        className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-semibold leading-6 text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
      />
    </label>
  );
}

/* ---------------------------------------------
   SWITCH
--------------------------------------------- */

function Switch({
  checked,
  onChange,
  label,
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-left"
    >
      <div>
        <div className="text-sm font-black text-slate-800">
          {label}
        </div>

        <div className="mt-1 text-xs text-slate-500">
          Important notices are shown at the top of the public page.
        </div>
      </div>

      <span
        className="relative h-7 w-12 shrink-0 rounded-full transition"
        style={{
          background: checked ? "#2D6A4F" : "#CBD5E1",
        }}
      >
        <span
          className="absolute top-1 h-5 w-5 rounded-full bg-white shadow transition"
          style={{
            left: checked ? 24 : 4,
          }}
        />
      </span>
    </button>
  );
}

/* ---------------------------------------------
   EDITOR MODAL
--------------------------------------------- */

function EditorModal({
  form,
  setForm,
  mode,
  saving,
  uploading,
  onClose,
  onSave,
  onUpload,
  onDelete,
}) {
  const update = (key, value) => {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{
          opacity: 0,
          y: 25,
          scale: 0.95,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[32px] bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-2 bg-emerald-700" />

        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700">
                <FileText size={14} />

                {mode === "new"
                  ? "NEW NOTICE"
                  : "EDIT NOTICE"}
              </span>

              <h2 className="mt-3 text-3xl font-black tracking-[-.05em] text-slate-950">
                {mode === "new"
                  ? "Add a new notice"
                  : "Edit this notice"}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Add or update the notice information.
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
              onChange={(value) =>
                update("title", value)
              }
              placeholder="Example: Final Examination Routine"
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                label="Category"
                value={form.category}
                onChange={(value) =>
                  update("category", value)
                }
                placeholder="Exam, Holiday, Admission..."
              />

              <Input
                label="Notice Date"
                type="date"
                value={form.notice_date}
                onChange={(value) =>
                  update("notice_date", value)
                }
              />
            </div>

            <Area
              label="Description"
              value={form.description}
              onChange={(value) =>
                update("description", value)
              }
              placeholder="Write the complete notice details..."
            />

            {/* PDF */}
            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
                  <FileText size={20} />
                </div>

                <div>
                  <div className="font-black text-slate-900">
                    PDF Attachment
                  </div>

                  <div className="text-xs text-slate-500">
                    Upload a PDF up to 10 MB.
                  </div>
                </div>
              </div>

              <label className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3.5 text-sm font-black text-white">
                <UploadCloud size={17} />

                {uploading
                  ? "Uploading..."
                  : "Upload PDF"}

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
                <div className="mt-4 flex flex-wrap gap-2">
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
                    onClick={() =>
                      update("pdf_url", "")
                    }
                    className="rounded-xl bg-red-50 px-4 py-2 text-xs font-black text-red-600"
                  >
                    Remove PDF
                  </button>
                </div>
              )}
            </div>

            <Switch
              checked={Boolean(form.pinned)}
              onChange={(value) =>
                update("pinned", value)
              }
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
                <Trash2 size={16} />
                Delete
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
                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-700 px-6 py-3.5 text-sm font-black text-white disabled:opacity-50"
              >
                <Save size={16} />

                {saving
                  ? "Saving..."
                  : "Save Notice"}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ---------------------------------------------
   MAIN
--------------------------------------------- */

export default function AdminNotices() {
  const [notices, setNotices] = useState([]);

  const [settings, setSettings] = useState(
    defaultNoticeSettings
  );

  const [loading, setLoading] = useState(true);

  const [editorOpen, setEditorOpen] =
    useState(false);

  const [editorMode, setEditorMode] =
    useState("new");

  const [editingId, setEditingId] =
    useState(null);

  const [form, setForm] =
    useState(blankNotice());

  const [saving, setSaving] =
    useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  const [message, setMessage] =
    useState({
      type: "",
      text: "",
    });

  /* ---------------------------------------------
     LOAD NOTICES
  --------------------------------------------- */

  const loadNotices = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/notices`,
        {
          headers: authHeaders(false),
        }
      );

      const result = await response.json();

      console.log(
        "GET /api/notices:",
        result
      );

      if (!response.ok) {
        throw new Error(
          result?.message ||
          "Could not load notices."
        );
      }

      const rawNotices = extractData(result);

      const normalized = rawNotices.map(
        normalizeNotice
      );

      setNotices(
        sortNoticesNewestFirst(normalized)
      );

      return normalized;
    } catch (error) {
      console.error(
        "Load notices error:",
        error
      );

      notify(
        "error",
        error.message ||
        "Could not load notices."
      );

      return [];
    }
  };

  /* ---------------------------------------------
     LOAD SETTINGS
  --------------------------------------------- */

  const loadSettings = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/notice-settings`
      );

      if (!response.ok) return;

      const result = await response.json();

      setSettings({
        ...defaultNoticeSettings,
        ...(result?.data || result || {}),
      });
    } catch (error) {
      console.error(
        "Load notice settings error:",
        error
      );
    }
  };

  /* ---------------------------------------------
     INITIAL LOAD
  --------------------------------------------- */

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);

      await Promise.all([
        loadNotices(),
        loadSettings(),
      ]);

      setLoading(false);
    };

    initialize();
  }, []);

  /* ---------------------------------------------
     MESSAGE
  --------------------------------------------- */

  const notify = (type, text) => {
    setMessage({
      type,
      text,
    });

    window.setTimeout(() => {
      setMessage({
        type: "",
        text: "",
      });
    }, 4500);
  };

  /* ---------------------------------------------
     NEW NOTICE
  --------------------------------------------- */

  const openNew = () => {
    setEditorMode("new");
    setEditingId(null);
    setForm(blankNotice());
    setEditorOpen(true);
  };

  /* ---------------------------------------------
     EDIT NOTICE
  --------------------------------------------- */

  const openEdit = (target) => {
    const targetId =
      target?.id ||
      target?._id;

    const notice = notices.find(
      (item) =>
        String(item.id) ===
        String(targetId)
    );

    if (!notice) {
      console.error(
        "Notice not found:",
        target
      );
      return;
    }

    setEditorMode("edit");

    setEditingId(
      notice.id || notice._id
    );

    setForm({
      title: notice.title || "",
      category:
        notice.category || "General",
      notice_date:
        notice.notice_date || "",
      description:
        notice.description || "",
      pdf_url:
        notice.pdf_url ||
        notice.file_url ||
        "",
      pinned: Boolean(
        notice.pinned
      ),
    });

    setEditorOpen(true);
  };

  /* ---------------------------------------------
     CLOSE EDITOR
  --------------------------------------------- */

  const closeEditor = () => {
    if (saving || uploading) return;

    setEditorOpen(false);
    setEditingId(null);
  };

  /* ---------------------------------------------
     PDF UPLOAD
  --------------------------------------------- */

  const uploadPdf = async (file) => {
    if (!file) return;

    if (
      file.type !==
      "application/pdf" &&
      !file.name
        .toLowerCase()
        .endsWith(".pdf")
    ) {
      notify(
        "error",
        "Please upload a PDF file only."
      );

      return;
    }

    if (
      file.size >
      10 * 1024 * 1024
    ) {
      notify(
        "error",
        "PDF must be smaller than 10 MB."
      );

      return;
    }

    setUploading(true);

    try {
      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      const response =
        await fetch(
          `${API_URL}/api/upload`,
          {
            method: "POST",
            headers:
              authHeaders(false),
            body: formData,
          }
        );

      const result =
        await response.json();

      console.log(
        "PDF upload response:",
        result
      );

      const url =
        getUploadUrl(result);

      if (
        !response.ok ||
        !url
      ) {
        throw new Error(
          result?.message ||
          "PDF upload failed."
        );
      }

      setForm(
        (previous) => ({
          ...previous,
          pdf_url: url,
        })
      );

      notify(
        "success",
        "PDF uploaded. Save the notice to publish it."
      );
    } catch (error) {
      console.error(
        "PDF upload error:",
        error
      );

      notify(
        "error",
        error.message ||
        "PDF upload failed."
      );
    } finally {
      setUploading(false);
    }
  };

  /* ---------------------------------------------
     SAVE NOTICE
  --------------------------------------------- */

  const saveNotice = async () => {
    if (!form.title.trim()) {
      notify(
        "error",
        "Notice title is required."
      );

      return;
    }

    setSaving(true);

    try {
      const isEdit =
        editorMode === "edit";

      const noticeId =
        editingId;

      const url = isEdit
        ? `${API_URL}/api/notices/${noticeId}`
        : `${API_URL}/api/notices`;

      const payload =
        payloadFromForm(form);

      console.log(
        "Saving notice:",
        {
          method: isEdit
            ? "PUT"
            : "POST",
          url,
          payload,
        }
      );

      const response =
        await fetch(url, {
          method: isEdit
            ? "PUT"
            : "POST",
          headers:
            authHeaders(true),
          body: JSON.stringify(
            payload
          ),
        });

      const result =
        await response.json();

      console.log(
        "Save notice response:",
        result
      );

      if (
        !response.ok ||
        result?.success === false
      ) {
        throw new Error(
          result?.message ||
          "Could not save notice."
        );
      }

      /*
        Get the notice returned
        by the backend.
      */
      const returned =
        extractSingleNotice(
          result
        );

      let returnedNotice = null;

      try {
        if (
          returned &&
          typeof returned ===
          "object" &&
          (returned.title ||
            returned.id ||
            returned._id)
        ) {
          returnedNotice =
            normalizeNotice(
              returned
            );
        }
      } catch (error) {
        console.warn(
          "Could not normalize returned notice:",
          error
        );
      }

      /*
        Immediately update the
        Admin UI.
      */
      if (returnedNotice) {
        setNotices(
          (previous) => {
            if (isEdit) {
              return sortNoticesNewestFirst(
                previous.map(
                  (item) =>
                    String(
                      item.id
                    ) ===
                      String(
                        returnedNotice.id
                      )
                      ? returnedNotice
                      : item
                )
              );
            }

            const alreadyExists =
              previous.some(
                (item) =>
                  String(
                    item.id
                  ) ===
                  String(
                    returnedNotice.id
                  )
              );

            if (alreadyExists) {
              return previous;
            }

            return sortNoticesNewestFirst(
              [
                returnedNotice,
                ...previous,
              ]
            );
          }
        );
      }

      notify(
        "success",
        isEdit
          ? "Notice updated successfully."
          : "Notice added successfully."
      );

      setEditorOpen(false);
      setEditingId(null);

      /*
        IMPORTANT:
        Fetch the database again.
      */
      await loadNotices();
    } catch (error) {
      console.error(
        "Save notice error:",
        error
      );

      notify(
        "error",
        error.message ||
        "Could not save notice."
      );
    } finally {
      setSaving(false);
    }
  };

  /* ---------------------------------------------
     DELETE
  --------------------------------------------- */

  const openDeleteConfirm = () => {
    if (!editingId) return;
    setShowDeleteConfirm(true);
  };

  const confirmDeleteNotice = async () => {
    if (!editingId) return;

    setSaving(true);

    try {
      const response =
        await fetch(
          `${API_URL}/api/notices/${editingId}`,
          {
            method: "DELETE",
            headers:
              authHeaders(false),
          }
        );

      const result =
        await response.json();

      if (
        !response.ok ||
        result?.success === false
      ) {
        throw new Error(
          result?.message ||
          "Could not delete notice."
        );
      }

      /*
        Remove immediately
        from Admin UI.
      */
      setNotices(
        (previous) =>
          previous.filter(
            (item) =>
              String(
                item.id
              ) !==
              String(
                editingId
              )
          )
      );

      notify(
        "success",
        "Notice deleted successfully."
      );

      setShowDeleteConfirm(false);
      setEditorOpen(false);
      setEditingId(null);

      await loadNotices();
    } catch (error) {
      console.error(
        "Delete notice error:",
        error
      );

      notify(
        "error",
        error.message ||
        "Could not delete notice."
      );
    } finally {
      setSaving(false);
    }
  };

  /* ---------------------------------------------
     RENDER
  --------------------------------------------- */

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">

        {/* HEADER */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">

          <Link
            to="/admin/dashboard"
            className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-sm ring-1 ring-slate-200"
          >
            <ArrowLeft size={17} />
            Dashboard
          </Link>

          <button
            type="button"
            onClick={openNew}
            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-black text-white shadow-lg shadow-emerald-700/20"
          >
            <Plus size={17} />
            Add Notice
          </button>
        </div>

        {/* TITLE */}
        <div className="mb-6 rounded-[30px] bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <Pencil size={24} />
            </div>

            <div>
              <span className="text-xs font-black uppercase tracking-[.18em] text-emerald-700">
                Admin Notice Manager
              </span>

              <h1 className="mt-2 text-3xl font-black text-slate-950">
                Manage Notices
              </h1>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500">
                Add, edit, delete, pin and attach PDFs to notices.
              </p>
            </div>
          </div>
        </div>

        {/* MESSAGE */}
        {message.text && (
          <motion.div
            initial={{
              opacity: 0,
              y: -8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className={`mb-5 flex items-center gap-2 rounded-2xl px-5 py-4 text-sm font-black ${message.type === "error"
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

        {/* NOTICES */}
        <div className="overflow-hidden rounded-[30px] bg-white shadow-sm ring-1 ring-slate-200">
          {loading ? (
            <div className="p-20 text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />

              <p className="mt-4 font-bold text-slate-500">
                Loading notices...
              </p>
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
            />
          )}
        </div>
      </div>

      {/* EDITOR */}
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
            onDelete={openDeleteConfirm}
          />
        )}

        {/* CENTERED DELETE CONFIRMATION MODAL */}
        {showDeleteConfirm && (
          <div
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm"
            onClick={() => !saving && setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="w-full max-w-md overflow-hidden rounded-[28px] bg-white p-6 sm:p-7 text-center shadow-2xl border border-slate-100"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <Trash2 size={26} />
              </div>

              <h3 className="text-xl font-black text-slate-950 tracking-tight">
                Delete this notice?
              </h3>

              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-500">
                Are you sure you want to permanently delete this notice? This action cannot be undone.
              </p>

              <div className="mt-6 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={saving}
                  className="w-1/2 rounded-2xl bg-slate-100 hover:bg-slate-200 px-4 py-3 text-xs sm:text-sm font-bold text-slate-700 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={confirmDeleteNotice}
                  disabled={saving}
                  className="w-1/2 inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 hover:bg-red-700 px-4 py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-red-600/20 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {saving ? "Deleting..." : "Delete Notice"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}