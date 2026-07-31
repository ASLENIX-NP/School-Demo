import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  UploadCloud,
  FileText,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const colors = {
  red: "#D71920",
  green: "#168A3A",
  purple: "#4B2E83",
  dark: "#0B1020",
  cyan: "#38BDF8",
  gold: "#FACC15",
};

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

function Field({ label, value, onChange, placeholder = "", type = "text" }) {
  return (
    <div>
      <label className="block text-sm font-bold mb-2 text-slate-700">
        {label}
      </label>

      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-2xl outline-none text-sm"
        style={{
          background: "rgba(255,255,255,0.9)",
          border: "1px solid rgba(75,46,131,0.16)",
          color: colors.dark,
        }}
      />
    </div>
  );
}

function TextArea({ label, value, onChange, placeholder = "", rows = 5 }) {
  return (
    <div>
      <label className="block text-sm font-bold mb-2 text-slate-700">
        {label}
      </label>

      <textarea
        rows={rows}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-2xl outline-none text-sm resize-none"
        style={{
          background: "rgba(255,255,255,0.9)",
          border: "1px solid rgba(75,46,131,0.16)",
          color: colors.dark,
        }}
      />
    </div>
  );
}

export default function AdminAddNotice() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    category: "General",
    notice_date: new Date().toISOString().slice(0, 10),
    description: "",
    pdf_url: "",
    pinned: false,
  });

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const updateField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
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

      updateField("pdf_url", uploadedUrl);
      setSuccess("PDF uploaded successfully.");
    } catch (err) {
      console.error("PDF upload error:", err);
      setError(err.message || "PDF upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const saveNotice = async () => {
    setSuccess("");
    setError("");

    if (!form.title.trim()) {
      setError("Notice title is required.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("https://school-website-backend-ixx2.onrender.com/api/notices", {
        method: "POST",
        headers: getAuthHeaders(true),
        body: JSON.stringify({
          title: form.title,
          category: form.category,
          notice_date: form.notice_date || null,
          description: form.description,
          pdf_url: form.pdf_url,
          pinned: form.pinned,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to create notice.");
      }

      setSuccess("Notice added successfully.");
      setTimeout(() => navigate("/admin/notices"), 700);
    } catch (err) {
      console.error("Create notice error:", err);
      setError(err.message || "Failed to create notice.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section
      className="min-h-screen relative overflow-hidden"
      style={{
        background: `
          radial-gradient(circle at top right, rgba(56,189,248,0.16), transparent 34%),
          radial-gradient(circle at bottom left, rgba(250,204,21,0.12), transparent 32%),
          linear-gradient(180deg, #FFF8EE 0%, #F1ECFF 100%)
        `,
      }}
    >
      <header
        className="sticky top-0 z-40"
        style={{
          background:
            "linear-gradient(145deg, rgba(2,6,23,0.96), rgba(15,23,42,0.88))",
          borderBottom: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 18px 52px rgba(0,0,0,0.22)",
          backdropFilter: "blur(22px)",
        }}
      >
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link
            to="/admin/notices"
            className="inline-flex items-center gap-2 text-white font-bold"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Notices
          </Link>

          <button
            type="button"
            onClick={saveNotice}
            disabled={saving || uploading}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-bold transition-all hover:scale-105 disabled:opacity-60"
            style={{
              color: "#020617",
              background: `linear-gradient(135deg, ${colors.gold}, ${colors.cyan})`,
              boxShadow:
                "0 18px 42px rgba(56,189,248,0.28), inset 0 1px 0 rgba(255,255,255,0.45)",
            }}
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Notice"}
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8">
          <span
            className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold mb-5"
            style={{
              background: "rgba(215,25,32,0.1)",
              color: colors.red,
              border: "1px solid rgba(215,25,32,0.2)",
            }}
          >
            Add New Notice
          </span>

          <h1
            className="text-4xl md:text-6xl mb-4"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 850,
              color: colors.dark,
              letterSpacing: "-0.045em",
            }}
          >
            Create Notice
          </h1>

          <p className="text-slate-500 max-w-3xl text-lg">
            Add a new notice with title, category, date, description, and optional PDF.
          </p>
        </div>

        {success && (
          <div
            className="mb-6 rounded-2xl px-5 py-4 flex items-center gap-3 font-semibold"
            style={{
              background: "rgba(22,138,58,0.1)",
              color: colors.green,
              border: "1px solid rgba(22,138,58,0.2)",
            }}
          >
            <CheckCircle2 className="w-5 h-5" />
            {success}
          </div>
        )}

        {error && (
          <div
            className="mb-6 rounded-2xl px-5 py-4 flex items-center gap-3 font-semibold"
            style={{
              background: "rgba(215,25,32,0.1)",
              color: colors.red,
              border: "1px solid rgba(215,25,32,0.2)",
            }}
          >
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        <div
          className="rounded-3xl p-6 md:p-8"
          style={{
            background:
              "linear-gradient(145deg, rgba(255,255,255,0.96), rgba(255,255,255,0.78))",
            border: "1px solid rgba(11,16,32,0.08)",
            boxShadow:
              "0 18px 48px rgba(11,16,32,0.075), inset 0 1px 0 rgba(255,255,255,0.85)",
          }}
        >
          <div className="grid gap-5">
            <Field
              label="Notice Title"
              value={form.title}
              onChange={(value) => updateField("title", value)}
              placeholder="Enter notice title"
            />

            <div className="grid md:grid-cols-2 gap-5">
              <Field
                label="Category"
                value={form.category}
                onChange={(value) => updateField("category", value)}
                placeholder="Exam / Holiday / Admission"
              />

              <Field
                label="Notice Date"
                type="date"
                value={form.notice_date}
                onChange={(value) => updateField("notice_date", value)}
              />
            </div>

            <TextArea
              label="Description"
              value={form.description}
              onChange={(value) => updateField("description", value)}
              placeholder="Write notice details"
            />

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Notice PDF
              </label>

              <label
                className="flex flex-col items-center justify-center gap-2 cursor-pointer rounded-2xl p-6 text-center transition"
                style={{
                  background: "rgba(255,255,255,0.72)",
                  border: "1px dashed rgba(75,46,131,0.28)",
                }}
              >
                <UploadCloud className="w-8 h-8" style={{ color: colors.purple }} />

                <span className="font-bold text-slate-800">
                  {uploading ? "Uploading PDF..." : "Upload PDF from device"}
                </span>

                <span className="text-xs text-slate-500 leading-relaxed">
                  PDF only, maximum 10 MB.
                </span>

                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  disabled={uploading}
                  onChange={(e) => {
                    uploadPdf(e.target.files?.[0]);
                    e.target.value = "";
                  }}
                  className="hidden"
                />
              </label>

              {form.pdf_url && (
                <div
                  className="mt-4 rounded-2xl px-4 py-4"
                  style={{
                    background: "rgba(22,138,58,0.08)",
                    border: "1px solid rgba(22,138,58,0.18)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="w-4 h-4" style={{ color: colors.green }} />
                    <span className="text-sm font-bold" style={{ color: colors.green }}>
                      PDF uploaded
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <a
                      href={form.pdf_url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-xl text-sm font-bold bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 transition"
                    >
                      View PDF
                    </a>

                    <button
                      type="button"
                      onClick={() => updateField("pdf_url", "")}
                      className="px-4 py-2 rounded-xl text-sm font-bold bg-white border border-red-100 hover:bg-red-500 hover:text-white transition"
                      style={{ color: colors.red }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>

            <label className="flex items-center gap-3 cursor-pointer select-none text-sm font-bold text-slate-700">
              <input
                type="checkbox"
                className="w-5 h-5"
                checked={form.pinned}
                onChange={(e) => updateField("pinned", e.target.checked)}
              />
              Pin this notice as important
            </label>

            <button
              type="button"
              onClick={saveNotice}
              disabled={saving || uploading}
              className="w-full py-4 rounded-2xl font-bold text-white transition-all hover:scale-[1.01] disabled:opacity-60"
              style={{
                background: `linear-gradient(135deg, ${colors.purple}, ${colors.green})`,
                boxShadow: "0 14px 34px rgba(75,46,131,0.22)",
              }}
            >
              {saving ? "Saving..." : "Create Notice"}
            </button>
          </div>
        </div>
      </main>
    </section>
  );
}
