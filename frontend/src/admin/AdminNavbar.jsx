import defaultSchoolLogo from "../assets/school-logo.jpeg";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "motion/react";
import {
  AlertCircle,
  Camera,
  CheckCircle2,
  Eye,
  Image as ImageIcon,
  Link as LinkIcon,
  Pencil,
  Save,
  UploadCloud,
  X,
} from "lucide-react";

import {
  Navbar,
  defaultNavbarContent,
  mergeNavbarContent,
} from "../app/components/Navbar";

const colors = {
  red: "#D71920",
  green: "#168A3A",
  purple: "#4B2E83",
  dark: "#0B1020",
  cyan: "#38BDF8",
  gold: "#FACC15",
};

function Field({ label, value, onChange, placeholder = "" }) {
  return (
    <div>
      <label className="block text-sm font-black mb-2 text-slate-700">
        {label}
      </label>

      <input
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
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

export default function AdminNavbar() {
  const [form, setForm] = useState(defaultNavbarContent);
  const [loading, setLoading] = useState(false);
  const [editingTarget, setEditingTarget] = useState(null);
  const [modalForm, setModalForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  function getAdminToken() {
  return (
    localStorage.getItem("adminToken") ||
    localStorage.getItem("token") ||
    localStorage.getItem("admin_token") ||
    ""
  );
}

function getAuthHeaders() {
  const token = getAdminToken();

  if (!token) {
    return null;
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

  useEffect(() => {
    let alive = true;

    const loadNavbarContent = async () => {
      try {
        const res = await axios.get(
          "https://school-website-backend-ixx2.onrender.com/api/site-content/navbar",
          { timeout: 20000 }
        );

        if (!alive) return;

        const savedContent = res.data?.data?.content || {};
        setForm(mergeNavbarContent(savedContent));
      } catch (err) {
        console.error("Load navbar content error:", err);

        if (alive) {
          setError("Could not load saved navbar content. Default content shown.");
        }
      } finally {
        if (alive) setLoading(false);
      }
    };

    loadNavbarContent();

    return () => {
      alive = false;
    };
  }, []);

  const selectedLink = useMemo(() => {
    if (editingTarget?.type !== "link") return null;
    return form.links.find((link) => link.id === editingTarget.id) || null;
  }, [editingTarget, form.links]);

  const openEditor = (target) => {
    setSuccess("");
    setError("");
    setEditingTarget(target);

    if (target.type === "logo") {
      setModalForm({
        logoUrl: form.logoUrl || "",
      });
      return;
    }

    if (target.type === "schoolName") {
      setModalForm({
        schoolName: form.schoolName || "",
      });
      return;
    }

    if (target.type === "schoolSubtitle") {
      setModalForm({
        schoolSubtitle: form.schoolSubtitle || "",
      });
      return;
    }

    if (target.type === "admission") {
      setModalForm({
        admissionButtonText: form.admissionButtonText || "",
        admissionButtonLink: form.admissionButtonLink || "/admissions",
        showAdmissionButton: form.showAdmissionButton !== false,
      });
      return;
    }

    if (target.type === "link") {
      const link = form.links.find((item) => item.id === target.id);

      setModalForm({
        label: link?.label || "",
        href: link?.href || "/",
        visible: link?.visible !== false,
      });
    }
  };

  const closeEditor = () => {
    if (saving || uploadingLogo) return;
    setEditingTarget(null);
    setModalForm({});
  };

  const updateModalField = (name, value) => {
    setModalForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const uploadLogoImage = async (file) => {
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSize = 6 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      setError("Please upload only PNG, JPG, or WebP image.");
      return;
    }

    if (file.size > maxSize) {
      setError("Logo image must be less than 6 MB.");
      return;
    }

    setSuccess("");
    setError("");
    setUploadingLogo(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const authHeaders = getAuthHeaders();

if (!authHeaders) {
  setError("Admin login expired. Please logout and login again.");
  return;
}

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

      updateModalField("logoUrl", uploadedUrl);
      setSuccess("Logo uploaded. Click Save Logo to publish it.");
    } catch (err) {
      console.error("Logo upload error:", err);
      setError(err.response?.data?.message || "Logo upload failed.");
    } finally {
      setUploadingLogo(false);
    }
  };

  const saveSelectedPart = async () => {
    if (!editingTarget) return;

    setSaving(true);
    setSuccess("");
    setError("");

    try {
      let nextForm = mergeNavbarContent(form);

      if (editingTarget.type === "logo") {
        nextForm = {
          ...nextForm,
          logoUrl: modalForm.logoUrl || "",
        };
      }

      if (editingTarget.type === "schoolName") {
        nextForm = {
          ...nextForm,
          schoolName: modalForm.schoolName || "",
        };
      }

      if (editingTarget.type === "schoolSubtitle") {
        nextForm = {
          ...nextForm,
          schoolSubtitle: modalForm.schoolSubtitle || "",
        };
      }

      if (editingTarget.type === "admission") {
        nextForm = {
          ...nextForm,
          admissionButtonText: modalForm.admissionButtonText || "",
          admissionButtonLink: modalForm.admissionButtonLink || "/admissions",
          showAdmissionButton: modalForm.showAdmissionButton !== false,
        };
      }

      if (editingTarget.type === "link") {
        nextForm = {
          ...nextForm,
          links: nextForm.links.map((link) =>
            link.id === editingTarget.id
              ? {
                  ...link,
                  label: modalForm.label || "",
                  href: modalForm.href || "/",
                  visible: modalForm.visible !== false,
                }
              : link
          ),
        };
      }

      const cleanContent = mergeNavbarContent(nextForm);

      const authHeaders = getAuthHeaders();

if (!authHeaders) {
  setError("Admin login expired. Please logout and login again.");
  setSaving(false);
  return;
}

await axios.put(
  "https://school-website-backend-ixx2.onrender.com/api/site-content/navbar",
  {
    content: cleanContent,
  },
  {
    headers: authHeaders,
  }
);

      setForm(cleanContent);
      setEditingTarget(null);
      setModalForm({});
      setSuccess("Selected navbar item saved successfully.");
    } catch (err) {
      console.error("Save selected navbar item error:", err);
      if (err.response?.status === 401) {
  setError("Admin login expired or token is invalid. Please logout and login again.");
} else {
  setError(err.response?.data?.message || "Could not save selected item.");
}
    } finally {
      setSaving(false);
    }
  };

  const modalTitle = useMemo(() => {
    if (!editingTarget) return "";

    if (editingTarget.type === "logo") return "Change School Logo";
    if (editingTarget.type === "schoolName") return "Edit School Name";
    if (editingTarget.type === "schoolSubtitle") return "Edit School Subtitle";
    if (editingTarget.type === "admission") return "Edit Admission Button";
    if (editingTarget.type === "link") {
      return selectedLink ? `Edit Menu: ${selectedLink.label}` : "Edit Menu Link";
    }

    return "Edit Navbar";
  }, [editingTarget, selectedLink]);

  const modalIcon = useMemo(() => {
    if (!editingTarget) return Pencil;
    if (editingTarget.type === "logo") return Camera;
    if (editingTarget.type === "link") return LinkIcon;
    return Pencil;
  }, [editingTarget]);

  const saveButtonText = useMemo(() => {
    if (!editingTarget) return "Save";

    if (editingTarget.type === "logo") return "Save Logo";
    if (editingTarget.type === "schoolName") return "Save Name";
    if (editingTarget.type === "schoolSubtitle") return "Save Subtitle";
    if (editingTarget.type === "admission") return "Save Button";
    if (editingTarget.type === "link") return "Save Menu Link";

    return "Save";
  }, [editingTarget]);

  const ModalIcon = modalIcon;

  if (loading) {
    return (
      <div className="py-16 flex items-center justify-center">
        <div className="text-slate-600 font-semibold">
          Loading navbar editor...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <style>
        {`
          @media (max-width: 767px) {
            .admin-navbar-preview-frame [class*="opacity-0"] {
              opacity: 1 !important;
            }

            .admin-navbar-preview-frame [class*="group-hover:opacity"] {
              opacity: 1 !important;
            }

            .admin-navbar-preview-frame [class*="z-50"],
            .admin-navbar-preview-frame [class*="z-[50]"],
            .admin-navbar-preview-frame [class*="z-[60]"],
            .admin-navbar-preview-frame [class*="z-[70]"],
            .admin-navbar-preview-frame [class*="z-[80]"],
            .admin-navbar-preview-frame [class*="z-[90]"],
            .admin-navbar-preview-frame [class*="z-[999]"] {
              z-index: 20 !important;
            }
          }
        `}
      </style>

      <style>
        {`
          @media (max-width: 767px) {
            .admin-navbar-preview-frame {
              overflow: visible !important;
            }

            .admin-navbar-preview-frame .group .opacity-0,
            .admin-navbar-preview-frame .group [class*="opacity-0"],
            .admin-navbar-preview-frame .group [class*="group-hover:opacity"],
            .admin-navbar-preview-frame [class*="group-hover:opacity"],
            .admin-navbar-preview-frame button[class*="opacity-0"],
            .admin-navbar-preview-frame button[class*="group-hover:opacity"] {
              opacity: 1 !important;
              visibility: visible !important;
              pointer-events: auto !important;
            }

            .admin-navbar-preview-frame .group .pointer-events-none,
            .admin-navbar-preview-frame .group [class*="pointer-events-none"] {
              pointer-events: auto !important;
            }

            .admin-navbar-preview-frame [class*="absolute"] button,
            .admin-navbar-preview-frame button[class*="rounded-full"] {
              min-width: 2.25rem !important;
              min-height: 2.25rem !important;
              z-index: 30 !important;
              pointer-events: auto !important;
            }

            .admin-navbar-preview-frame [class*="absolute"][class*="z-50"],
            .admin-navbar-preview-frame [class*="absolute"][class*="z-[50]"],
            .admin-navbar-preview-frame [class*="absolute"][class*="z-[60]"],
            .admin-navbar-preview-frame [class*="absolute"][class*="z-[70]"],
            .admin-navbar-preview-frame [class*="absolute"][class*="z-[80]"],
            .admin-navbar-preview-frame [class*="absolute"][class*="z-[90]"],
            .admin-navbar-preview-frame [class*="absolute"][class*="z-[999]"] {
              z-index: 30 !important;
            }
          }
        `}
      </style>


      <style>
        {`
          @media (max-width: 767px) {
            .admin-navbar-preview-frame {
              position: relative !important;
              overflow: hidden !important;
              isolation: isolate !important;
            }

            .admin-navbar-preview-frame nav,
            .admin-navbar-preview-frame header {
              position: relative !important;
              z-index: 60 !important;
            }

            .admin-navbar-preview-frame [class*="fixed"] {
              position: absolute !important;
              inset: 4.25rem 0 auto 0 !important;
              width: 100% !important;
              max-width: 100% !important;
              height: auto !important;
              max-height: 360px !important;
              overflow-y: auto !important;
              border-radius: 1.5rem !important;
              z-index: 35 !important;
            }

            .admin-navbar-preview-frame [class*="fixed"][class*="inset-0"],
            .admin-navbar-preview-frame [class*="fixed"][class*="inset"] {
              inset: 4.25rem 0 auto 0 !important;
            }

            .admin-navbar-preview-frame [class*="fixed"]::before,
            .admin-navbar-preview-frame [class*="fixed"]::after {
              display: none !important;
            }

            .admin-navbar-preview-frame button,
            .admin-navbar-preview-frame a {
              pointer-events: auto !important;
            }

            .admin-navbar-preview-frame button[aria-label],
            .admin-navbar-preview-frame button[type="button"] {
              position: relative !important;
              z-index: 70 !important;
            }

            .admin-navbar-preview-frame .group .opacity-0,
            .admin-navbar-preview-frame .group [class*="opacity-0"],
            .admin-navbar-preview-frame .group [class*="group-hover:opacity"],
            .admin-navbar-preview-frame [class*="group-hover:opacity"],
            .admin-navbar-preview-frame button[class*="opacity-0"],
            .admin-navbar-preview-frame button[class*="group-hover:opacity"] {
              opacity: 1 !important;
              visibility: visible !important;
              pointer-events: auto !important;
            }

            .admin-navbar-preview-frame [class*="absolute"] button,
            .admin-navbar-preview-frame button[class*="rounded-full"] {
              min-width: 2.25rem !important;
              min-height: 2.25rem !important;
              z-index: 75 !important;
              pointer-events: auto !important;
            }

            .admin-navbar-preview-frame [class*="z-50"],
            .admin-navbar-preview-frame [class*="z-[50]"],
            .admin-navbar-preview-frame [class*="z-[60]"],
            .admin-navbar-preview-frame [class*="z-[70]"],
            .admin-navbar-preview-frame [class*="z-[80]"],
            .admin-navbar-preview-frame [class*="z-[90]"],
            .admin-navbar-preview-frame [class*="z-[999]"] {
              z-index: 35 !important;
            }

            .admin-navbar-preview-frame nav [class*="z-50"],
            .admin-navbar-preview-frame nav [class*="z-[50]"],
            .admin-navbar-preview-frame nav [class*="z-[60]"],
            .admin-navbar-preview-frame nav [class*="z-[70]"],
            .admin-navbar-preview-frame nav [class*="z-[80]"],
            .admin-navbar-preview-frame nav [class*="z-[90]"],
            .admin-navbar-preview-frame nav [class*="z-[999]"] {
              z-index: 70 !important;
            }
          }
        `}
      </style>


      <style>
        {`
          @media (max-width: 767px) {
            .admin-navbar-preview-frame {
              min-height: 430px !important;
              overflow: hidden !important;
            }

            .admin-navbar-preview-frame [class*="fixed"] {
              position: absolute !important;
              top: 4.25rem !important;
              left: 0.75rem !important;
              right: 0.75rem !important;
              bottom: auto !important;
              width: auto !important;
              max-width: calc(100% - 1.5rem) !important;
              height: auto !important;
              max-height: 320px !important;
              overflow-y: auto !important;
              border-radius: 1.5rem !important;
              z-index: 45 !important;
            }

            .admin-navbar-preview-frame [class*="fixed"][class*="inset-0"],
            .admin-navbar-preview-frame [class*="fixed"][class*="inset"] {
              inset: 4.25rem 0.75rem auto 0.75rem !important;
            }

            .admin-navbar-preview-frame nav,
            .admin-navbar-preview-frame header {
              position: relative !important;
              z-index: 80 !important;
            }

            .admin-navbar-preview-frame nav button,
            .admin-navbar-preview-frame header button {
              position: relative !important;
              z-index: 90 !important;
              pointer-events: auto !important;
            }
          }
        `}
      </style>


      <style>
        {`
          @media (max-width: 767px) {
            .admin-navbar-preview-frame {
              min-height: 660px !important;
              overflow: hidden !important;
              position: relative !important;
            }

            .admin-navbar-preview-frame [class*="fixed"] {
              position: absolute !important;
              top: 4.25rem !important;
              left: 0.75rem !important;
              right: 0.75rem !important;
              bottom: auto !important;
              width: auto !important;
              max-width: calc(100% - 1.5rem) !important;
              height: auto !important;
              min-height: auto !important;
              max-height: none !important;
              overflow: visible !important;
              border-radius: 1.5rem !important;
              z-index: 45 !important;
            }

            .admin-navbar-preview-frame [class*="fixed"][class*="inset-0"],
            .admin-navbar-preview-frame [class*="fixed"][class*="inset"] {
              inset: 4.25rem 0.75rem auto 0.75rem !important;
            }

            .admin-navbar-preview-frame [class*="fixed"] > div,
            .admin-navbar-preview-frame [class*="fixed"] ul,
            .admin-navbar-preview-frame [class*="fixed"] li {
              max-height: none !important;
              overflow: visible !important;
            }

            .admin-navbar-preview-frame nav,
            .admin-navbar-preview-frame header {
              position: relative !important;
              z-index: 80 !important;
            }

            .admin-navbar-preview-frame nav button,
            .admin-navbar-preview-frame header button {
              position: relative !important;
              z-index: 90 !important;
              pointer-events: auto !important;
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
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black mb-3 bg-sky-50 text-sky-700 border border-sky-100">
              <Eye className="w-3.5 h-3.5" />
              Visual Navbar Editor
            </div>

            <h2
              className="text-2xl md:text-3xl font-black text-slate-950"
              style={{
                fontFamily: "var(--font-display)",
                letterSpacing: "-0.04em",
              }}
            >
              Hover and Edit Navbar
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Hover logo, school name, menu links, or admission button. Click
              the edit icon and save only that selected item.
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
  className="admin-navbar-preview-frame rounded-[2rem] p-3 sm:p-4 md:p-6 overflow-hidden"
  style={{
    background:
      "radial-gradient(circle at top left, rgba(56,189,248,0.14), transparent 34%), linear-gradient(180deg, #FFF8EE 0%, #F1ECFF 100%)",
    border: "1px solid rgba(15,23,42,0.08)",
    minHeight: "170px",
  }}
>
  <div className="w-full min-w-0">
    <Navbar editMode contentOverride={form} onEditTarget={openEditor} />
  </div>
</div>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="rounded-2xl p-4 bg-white border border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center mb-3">
            <Camera className="w-5 h-5" />
          </div>
          <div className="font-black text-slate-950">Logo</div>
          <div className="text-sm text-slate-500 mt-1">
            Hover the school logo and click camera icon.
          </div>
        </div>

        <div className="rounded-2xl p-4 bg-white border border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-3">
            <Pencil className="w-5 h-5" />
          </div>
          <div className="font-black text-slate-950">Text</div>
          <div className="text-sm text-slate-500 mt-1">
            Hover school name or subtitle and click edit icon.
          </div>
        </div>

        <div className="rounded-2xl p-4 bg-white border border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
            <LinkIcon className="w-5 h-5" />
          </div>
          <div className="font-black text-slate-950">Menu</div>
          <div className="text-sm text-slate-500 mt-1">
            Hover any menu item or admission button to edit.
          </div>
        </div>
      </div>

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
            onClick={closeEditor}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 130, damping: 16 }}
              className="w-full max-w-lg rounded-[28px] overflow-hidden"
              style={{
                background: "#FFFFFF",
                border: "1px solid rgba(255,255,255,0.75)",
                boxShadow: "0 42px 110px rgba(0,0,0,0.28)",
              }}
              onClick={(e) => e.stopPropagation()}
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
                        Save only this selected navbar item.
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
                  {editingTarget.type === "logo" && (
                    <>
                      <div
                        className="rounded-3xl p-5"
                        style={{
                          background:
                            "linear-gradient(145deg, rgba(15,23,42,0.96), rgba(30,41,59,0.92))",
                          border: "1px solid rgba(255,255,255,0.12)",
                        }}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-24 h-24 rounded-2xl bg-white overflow-hidden flex items-center justify-center">
                            {modalForm.logoUrl ? (
                              <img
                                src={modalForm.logoUrl}
                                alt="Logo preview"
                                className="w-full h-full object-contain p-1"
                              />
                            ) : (
                              <img
                                src={defaultSchoolLogo}
                                alt="Default logo"
                                className="w-full h-full object-contain p-1"
                              />
                            )}
                          </div>

                          <div>
                            <div className="text-white font-black">
                              Logo Preview
                            </div>
                            <div className="text-white/55 text-sm mt-1 leading-relaxed">
                              Recommended: 512×512 square, PNG/JPG/WebP, max 6 MB.
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
                          {uploadingLogo ? "Uploading..." : "Upload New Logo"}
                          <input
                            type="file"
                            accept="image/*"
                            disabled={uploadingLogo}
                            onChange={(e) => {
                              uploadLogoImage(e.target.files?.[0]);
                              e.target.value = "";
                            }}
                            className="hidden"
                          />
                        </label>

                        {modalForm.logoUrl && (
                          <button
                            type="button"
                            onClick={() => updateModalField("logoUrl", "")}
                            className="mt-3 w-full px-4 py-3 rounded-2xl text-sm font-black"
                            style={{
                              background: "rgba(215,25,32,0.12)",
                              color: "#FFFFFF",
                              border: "1px solid rgba(255,255,255,0.12)",
                            }}
                          >
                            Use Default Logo
                          </button>
                        )}
                      </div>

                      <Field
                        label="Logo Image URL"
                        value={modalForm.logoUrl}
                        onChange={(value) => updateModalField("logoUrl", value)}
                        placeholder="Image URL appears after upload"
                      />
                    </>
                  )}

                  {editingTarget.type === "schoolName" && (
                    <Field
                      label="School Name"
                      value={modalForm.schoolName}
                      onChange={(value) =>
                        updateModalField("schoolName", value)
                      }
                      placeholder="Baljagriti"
                    />
                  )}

                  {editingTarget.type === "schoolSubtitle" && (
                    <Field
                      label="School Subtitle"
                      value={modalForm.schoolSubtitle}
                      onChange={(value) =>
                        updateModalField("schoolSubtitle", value)
                      }
                      placeholder="Secondary English School"
                    />
                  )}

                  {editingTarget.type === "admission" && (
                    <>
                      <Toggle
                        checked={modalForm.showAdmissionButton !== false}
                        onChange={(value) =>
                          updateModalField("showAdmissionButton", value)
                        }
                        label="Show admission button"
                      />

                      <Field
                        label="Button Text"
                        value={modalForm.admissionButtonText}
                        onChange={(value) =>
                          updateModalField("admissionButtonText", value)
                        }
                        placeholder="Admission Open"
                      />

                      <Field
                        label="Button Link"
                        value={modalForm.admissionButtonLink}
                        onChange={(value) =>
                          updateModalField("admissionButtonLink", value)
                        }
                        placeholder="/admissions"
                      />
                    </>
                  )}

                  {editingTarget.type === "link" && (
                    <>
                      <Toggle
                        checked={modalForm.visible !== false}
                        onChange={(value) => updateModalField("visible", value)}
                        label="Show this menu item"
                      />

                      <Field
                        label="Menu Label"
                        value={modalForm.label}
                        onChange={(value) => updateModalField("label", value)}
                        placeholder="Home"
                      />

                      <Field
                        label="Menu Link"
                        value={modalForm.href}
                        onChange={(value) => updateModalField("href", value)}
                        placeholder="/about"
                      />

                      <div className="rounded-2xl p-4 bg-slate-50 border border-slate-200 text-slate-600 text-sm">
                        Fixed Link ID:{" "}
                        <span className="font-black text-slate-900">
                          {editingTarget.id}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex gap-3 mt-7">
                  <button
                    type="button"
                    onClick={closeEditor}
                    disabled={saving || uploadingLogo}
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
                    disabled={saving || uploadingLogo}
                    className="flex-1 py-3 rounded-2xl text-sm font-black transition-all hover:-translate-y-0.5 disabled:opacity-60 inline-flex items-center justify-center gap-2"
                    style={{
                      background: `linear-gradient(135deg, ${colors.gold}, ${colors.cyan})`,
                      color: "#020617",
                      boxShadow: "0 16px 38px rgba(56,189,248,0.24)",
                    }}
                  >
                    <Save className="w-4 h-4" />
                    {saving ? "Saving..." : saveButtonText}
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
