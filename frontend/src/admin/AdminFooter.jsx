import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Footprints,
  Pencil,
  Plus,
  Trash2,
  UploadCloud,
  X,
  Image as ImageIcon,
  Link as LinkIcon,
  Share2,
  Phone,
  Copyright,
  Eye,
  EyeOff,
} from "lucide-react";

import {
  Footer,
  defaultFooterContent,
  mergeFooterContent,
  normalizeExternalUrl,
  normalizeMapUrl,
} from "../app/components/Footer";

const colors = {
  green: "#168A3A",
  purple: "#4B2E83",
  red: "#D71920",
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

  if (!token) return null;

  return {
    Authorization: `Bearer ${token}`,
  };
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
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
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

function SelectField({ label, value, onChange, children }) {
  return (
    <div>
      <label className="block text-sm font-black mb-2 text-slate-700">
        {label}
      </label>

      <select
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
        className="w-full px-4 py-3 rounded-2xl outline-none text-sm"
        style={{
          background: "rgba(255,255,255,0.92)",
          border: "1px solid rgba(75,46,131,0.16)",
          color: colors.dark,
        }}
      >
        {children}
      </select>
    </div>
  );
}

function ConfirmDialog({ target, onCancel, onConfirm }) {
  if (!target) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-5"
      style={{ background: "rgba(2,6,23,0.62)", backdropFilter: "blur(14px)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onCancel}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 14, scale: 0.96 }}
        className="w-full max-w-md rounded-[28px] bg-white overflow-hidden"
        style={{ boxShadow: "0 42px 110px rgba(0,0,0,0.32)" }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="h-1" style={{ background: `linear-gradient(90deg, ${colors.red}, ${colors.gold})` }} />
        <div className="p-7">
          <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-5">
            <Trash2 className="w-6 h-6" />
          </div>

          <h3 className="text-2xl font-black text-slate-950 mb-2">
            Are you sure?
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            {target.message || "This item will be removed when you save this section."}
          </p>

          <div className="flex gap-3 mt-7">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 rounded-2xl text-sm font-black"
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
              onClick={onConfirm}
              className="flex-1 py-3 rounded-2xl text-sm font-black text-white"
              style={{ background: `linear-gradient(135deg, ${colors.red}, #9B1117)` }}
            >
              Delete
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AdminFooter() {
  const navigate = useNavigate();

  const [form, setForm] = useState(defaultFooterContent);
  const [loading, setLoading] = useState(false);
  const [editingTarget, setEditingTarget] = useState(null);
  const [modalForm, setModalForm] = useState({});
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadFooterContent = async () => {
      try {
        const res = await axios.get("https://school-website-backend-ixx2.onrender.com/api/site-content/footer");
        const savedContent = res.data?.data?.content || {};
        setForm(mergeFooterContent(savedContent));
      } catch (err) {
        console.error("Load footer content error:", err);
        setError("Could not load saved footer content. Default content shown.");
      } finally {
        setLoading(false);
      }
    };

    loadFooterContent();
  }, []);

  const selectedNavLink = useMemo(() => {
    if (editingTarget?.type !== "navLink") return null;
    return form.navLinks.find((link) => link.id === editingTarget.id) || null;
  }, [editingTarget, form.navLinks]);

  const selectedSocial = useMemo(() => {
    if (editingTarget?.type !== "social") return null;
    return form.socials.find((social) => social.id === editingTarget.id) || null;
  }, [editingTarget, form.socials]);

  const openEditor = (target) => {
    setSuccess("");
    setError("");
    setEditingTarget(target);

    if (target.type === "identity") {
      setModalForm({
        logoUrl: form.logoUrl || "",
        schoolName: form.schoolName || "",
        schoolSubtitle: form.schoolSubtitle || "",
        admissionBadgeText: form.admissionBadgeText || "",
        showAdmissionBadge: form.showAdmissionBadge !== false,
      });
      return;
    }

    if (target.type === "navLinks") {
      setModalForm({
        navLinks: (form.navLinks || []).map((link) => ({
          id: link.id || Date.now() + Math.random(),
          label: link.label || "",
          href: link.href || "/",
          visible: link.visible !== false,
        })),
      });
      return;
    }

    if (target.type === "navLink") {
      const link = form.navLinks.find((item) => item.id === target.id);
      setModalForm({
        label: link?.label || "",
        href: link?.href || "/",
        visible: link?.visible !== false,
      });
      return;
    }

    if (target.type === "socials") {
      setModalForm({
        socials: (form.socials || []).map((social) => ({
          id: social.id || Date.now() + Math.random(),
          label: social.label || "",
          type: social.type || "website",
          href: social.href || "",
          visible: social.visible !== false,
        })),
      });
      return;
    }

    if (target.type === "social") {
      const social = form.socials.find((item) => item.id === target.id);
      setModalForm({
        label: social?.label || "",
        type: social?.type || "website",
        href: social?.href || "",
        visible: social?.visible !== false,
      });
      return;
    }

    if (target.type === "contact") {
      setModalForm({
        address: form.contact?.address || "",
        mapUrl: form.contact?.mapUrl || "",
        email: form.contact?.email || "",
        phones: Array.isArray(form.contact?.phones) ? form.contact.phones : [],
      });
      return;
    }

    if (target.type === "phonePopup") {
      setModalForm({
        modalTitle: form.modalTitle || "",
        modalHint: form.modalHint || "",
        copiedText: form.copiedText || "",
        closeButtonText: form.closeButtonText || "",
      });
      return;
    }

    if (target.type === "copyright") {
      setModalForm({
        copyrightText: form.copyrightText || "",
      });
    }
  };

  const closeEditor = () => {
    if (saving || uploadingLogo) return;
    setEditingTarget(null);
    setModalForm({});
  };

  const updateModalField = (name, value) => {
    setModalForm((prev) => ({ ...prev, [name]: value }));
  };

  const updateModalPhone = (index, value) => {
    setModalForm((prev) => ({
      ...prev,
      phones: (prev.phones || []).map((phone, phoneIndex) =>
        phoneIndex === index ? value : phone
      ),
    }));
  };

  const addModalPhone = () => {
    setModalForm((prev) => ({
      ...prev,
      phones: [...(prev.phones || []), ""],
    }));
  };

  const deleteModalPhone = (index) => {
    setModalForm((prev) => ({
      ...prev,
      phones: (prev.phones || []).filter((_, phoneIndex) => phoneIndex !== index),
    }));
  };


  const updateModalListItem = (listName, index, field, value) => {
    setModalForm((prev) => ({
      ...prev,
      [listName]: (prev[listName] || []).map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addModalNavLink = () => {
    setModalForm((prev) => ({
      ...prev,
      navLinks: [
        ...(prev.navLinks || []),
        {
          id: Date.now(),
          label: "New Link",
          href: "/",
          visible: true,
        },
      ],
    }));
  };

  const deleteModalNavLink = (index) => {
    const links = modalForm.navLinks || [];

    if (links.length <= 1) {
      setError("At least one footer navigation link is required.");
      return;
    }

    const label = links[index]?.label || "this footer link";

    setConfirmTarget({
      type: "modalNavLink",
      index,
      message: `Delete "${label}" from footer links? Click Save Section to publish the deletion.`,
    });
  };

  const addModalSocial = () => {
    setModalForm((prev) => ({
      ...prev,
      socials: [
        ...(prev.socials || []),
        {
          id: Date.now(),
          label: "Website",
          type: "website",
          href: "",
          visible: true,
        },
      ],
    }));
  };

  const deleteModalSocial = (index) => {
    const socials = modalForm.socials || [];

    if (socials.length <= 1) {
      setError("At least one social link is required.");
      return;
    }

    const label = socials[index]?.label || "this social link";

    setConfirmTarget({
      type: "modalSocial",
      index,
      message: `Delete "${label}" from social links? Click Save Section to publish the deletion.`,
    });
  };

  const uploadLogo = async (file) => {
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

    const authHeaders = getAuthHeaders();

    if (!authHeaders) {
      setError("Admin login expired. Please logout and login again.");
      return;
    }

    setSuccess("");
    setError("");
    setUploadingLogo(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post("https://school-website-backend-ixx2.onrender.com/api/upload", formData, {
        headers: {
          ...authHeaders,
          "Content-Type": "multipart/form-data",
        },
      });

      const uploadedUrl = getUploadUrl(res.data);

      if (!uploadedUrl) {
        setError("Logo uploaded but backend did not return image URL.");
        return;
      }

      updateModalField("logoUrl", uploadedUrl);
      setSuccess("Footer logo uploaded. Click Save Section to publish.");
    } catch (err) {
      console.error("Footer logo upload error:", err);
      setError(err.response?.data?.message || "Footer logo upload failed.");
    } finally {
      setUploadingLogo(false);
    }
  };

  const addTarget = (type) => {
    setSuccess("");
    setError("");

    if (type === "navLink") {
      const newLink = {
        id: Date.now(),
        label: "New Link",
        href: "/",
        visible: true,
      };

      setForm((prev) => ({
        ...prev,
        navLinks: [...prev.navLinks, newLink],
      }));
      setSuccess("New footer link added. Edit it and click Save Section.");
      setTimeout(() => openEditor({ type: "navLink", id: newLink.id }), 80);
      return;
    }

    if (type === "social") {
      const newSocial = {
        id: Date.now(),
        type: "website",
        label: "Website",
        href: "",
        visible: true,
      };

      setForm((prev) => ({
        ...prev,
        socials: [...prev.socials, newSocial],
      }));
      setSuccess("New social link added. Edit it and click Save Section.");
      setTimeout(() => openEditor({ type: "social", id: newSocial.id }), 80);
    }
  };

  const requestDelete = (target) => {
    if (target.type === "navLink" && form.navLinks.length <= 1) {
      setError("At least one footer navigation link is required.");
      return;
    }

    if (target.type === "social" && form.socials.length <= 1) {
      setError("At least one social link is required.");
      return;
    }

    const label =
      target.type === "navLink"
        ? form.navLinks.find((item) => item.id === target.id)?.label
        : form.socials.find((item) => item.id === target.id)?.label;

    setConfirmTarget({
      ...target,
      message: `Delete "${label || "this item"}" from the footer? Save this section to publish the deletion.`,
    });
  };

  const confirmDelete = () => {
    if (!confirmTarget) return;

    if (confirmTarget.type === "navLink") {
      setForm((prev) => ({
        ...prev,
        navLinks: prev.navLinks.filter((link) => link.id !== confirmTarget.id),
      }));
      setSuccess("Footer link removed. Save this section to publish.");
    }

    if (confirmTarget.type === "social") {
      setForm((prev) => ({
        ...prev,
        socials: prev.socials.filter((social) => social.id !== confirmTarget.id),
      }));
      setSuccess("Social link removed. Save this section to publish.");
    }

    if (confirmTarget.type === "modalNavLink") {
      setModalForm((prev) => ({
        ...prev,
        navLinks: (prev.navLinks || []).filter(
          (_, itemIndex) => itemIndex !== confirmTarget.index
        ),
      }));
      setSuccess("Footer link removed. Click Save Section to publish.");
    }

    if (confirmTarget.type === "modalSocial") {
      setModalForm((prev) => ({
        ...prev,
        socials: (prev.socials || []).filter(
          (_, itemIndex) => itemIndex !== confirmTarget.index
        ),
      }));
      setSuccess("Social link removed. Click Save Section to publish.");
    }

    setConfirmTarget(null);
  };

  const buildCleanFooterContent = (sourceForm) => {
    const cleanForm = mergeFooterContent({
      ...sourceForm,
      socials: (sourceForm.socials || []).map((social) => ({
        ...social,
        href: normalizeExternalUrl(social.href),
      })),
      contact: {
        ...(sourceForm.contact || {}),
        mapUrl: normalizeMapUrl(sourceForm.contact?.mapUrl, sourceForm.contact?.address),
        phones: Array.isArray(sourceForm.contact?.phones)
          ? sourceForm.contact.phones.map((phone) => String(phone || "").trim()).filter(Boolean)
          : [],
      },
    });

    if (!cleanForm.contact.phones.length) {
      cleanForm.contact.phones = ["057-590144"];
    }

    return cleanForm;
  };

  const saveSelectedPart = async () => {
    if (!editingTarget) return;

    const authHeaders = getAuthHeaders();

    if (!authHeaders) {
      setError("Admin login expired. Please logout and login again.");
      return;
    }

    setSuccess("");
    setError("");
    setSaving(true);

    try {
      let nextForm = mergeFooterContent(form);

      if (editingTarget.type === "identity") {
        nextForm = {
          ...nextForm,
          logoUrl: modalForm.logoUrl || "",
          schoolName: modalForm.schoolName || "",
          schoolSubtitle: modalForm.schoolSubtitle || "",
          admissionBadgeText: modalForm.admissionBadgeText || "",
          showAdmissionBadge: modalForm.showAdmissionBadge !== false,
        };
      }

      if (editingTarget.type === "navLinks") {
        const cleanedLinks = (modalForm.navLinks || [])
          .map((link) => ({
            id: link.id || Date.now() + Math.random(),
            label: String(link.label || "").trim() || "New Link",
            href: String(link.href || "/").trim() || "/",
            visible: link.visible !== false,
          }))
          .filter((link) => link.label || link.href);

        nextForm = {
          ...nextForm,
          navLinks: cleanedLinks.length ? cleanedLinks : defaultFooterContent.navLinks,
        };
      }

      if (editingTarget.type === "navLink") {
        nextForm = {
          ...nextForm,
          navLinks: nextForm.navLinks.map((link) =>
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

      if (editingTarget.type === "socials") {
        const cleanedSocials = (modalForm.socials || [])
          .map((social) => ({
            id: social.id || Date.now() + Math.random(),
            label: String(social.label || "").trim() || "Website",
            type: social.type || "website",
            href: normalizeExternalUrl(String(social.href || "").trim()),
            visible: social.visible !== false,
          }))
          .filter((social) => social.label || social.href);

        nextForm = {
          ...nextForm,
          socials: cleanedSocials.length ? cleanedSocials : defaultFooterContent.socials,
        };
      }

      if (editingTarget.type === "social") {
        nextForm = {
          ...nextForm,
          socials: nextForm.socials.map((social) =>
            social.id === editingTarget.id
              ? {
                  ...social,
                  label: modalForm.label || "",
                  type: modalForm.type || "website",
                  href: normalizeExternalUrl(modalForm.href || ""),
                  visible: modalForm.visible !== false,
                }
              : social
          ),
        };
      }

      if (editingTarget.type === "contact") {
        nextForm = {
          ...nextForm,
          contact: {
            ...nextForm.contact,
            address: modalForm.address || "",
            mapUrl: normalizeMapUrl(modalForm.mapUrl || "", modalForm.address || ""),
            email: modalForm.email || "",
            phones: (modalForm.phones || []).map((phone) => phone.trim()).filter(Boolean),
          },
        };

        if (nextForm.contact.phones.length === 0) {
          nextForm.contact.phones = ["057-590144"];
        }
      }

      if (editingTarget.type === "phonePopup") {
        nextForm = {
          ...nextForm,
          modalTitle: modalForm.modalTitle || "",
          modalHint: modalForm.modalHint || "",
          copiedText: modalForm.copiedText || "Copied",
          closeButtonText: modalForm.closeButtonText || "Close",
        };
      }

      if (editingTarget.type === "copyright") {
        nextForm = {
          ...nextForm,
          copyrightText: modalForm.copyrightText || "",
        };
      }

      const cleanForm = buildCleanFooterContent(nextForm);

      await axios.put(
        "https://school-website-backend-ixx2.onrender.com/api/site-content/footer",
        { content: cleanForm },
        { headers: authHeaders }
      );

      setForm(cleanForm);
      setEditingTarget(null);
      setModalForm({});
      setSuccess("Footer section saved successfully.");
    } catch (err) {
      console.error("Save footer section error:", err);
      setError(err.response?.data?.message || "Could not save this footer section.");
    } finally {
      setSaving(false);
    }
  };

  const modalTitle = useMemo(() => {
    if (!editingTarget) return "";

    if (editingTarget.type === "identity") return "Edit Footer School Info";
    if (editingTarget.type === "navLinks") return "Edit Footer Links";
    if (editingTarget.type === "navLink") return selectedNavLink ? `Edit Link: ${selectedNavLink.label}` : "Edit Footer Link";
    if (editingTarget.type === "socials") return "Edit Social Links";
    if (editingTarget.type === "social") return selectedSocial ? `Edit Social: ${selectedSocial.label}` : "Edit Social Link";
    if (editingTarget.type === "contact") return "Edit Footer Contact Details";
    if (editingTarget.type === "phonePopup") return "Edit Phone Popup";
    if (editingTarget.type === "copyright") return "Edit Copyright";

    return "Edit Footer";
  }, [editingTarget, selectedNavLink, selectedSocial]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#FFF8EE" }}>
        <div className="text-slate-600 font-semibold">Loading footer editor...</div>
      </div>
    );
  }

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
      <style>
  {`
    .admin-footer-preview-frame {
      overflow: hidden !important;
      position: relative !important;
      z-index: 0 !important;
    }

    .admin-footer-preview-frame .bg-slate-950 {
      background: linear-gradient(135deg, rgba(255,255,255,0.96), rgba(248,244,255,0.95), rgba(238,247,255,0.95)) !important;
      color: #0F172A !important;
      border: 1px solid rgba(75,46,131,0.12) !important;
      box-shadow: 0 18px 44px rgba(15,23,42,0.08) !important;
    }

    .admin-footer-preview-frame .bg-slate-950 [class*="text-white"] {
      color: #0F172A !important;
    }

    .admin-footer-preview-frame .bg-slate-950 [class*="text-white/45"],
    .admin-footer-preview-frame .bg-slate-950 [class*="text-white/55"],
    .admin-footer-preview-frame .bg-slate-950 [class*="text-white/70"] {
      color: #64748B !important;
    }

    @media (max-width: 767px) {
      .admin-footer-preview-frame .group .md\\:opacity-0,
      .admin-footer-preview-frame [class*="group-hover:opacity"] {
        opacity: 1 !important;
      }

      .admin-footer-preview-frame [class*="z-40"],
      .admin-footer-preview-frame [class*="z-50"],
      .admin-footer-preview-frame [class*="z-[40]"],
      .admin-footer-preview-frame [class*="z-[50]"],
      .admin-footer-preview-frame [class*="z-[60]"],
      .admin-footer-preview-frame [class*="z-[70]"],
      .admin-footer-preview-frame [class*="z-[80]"],
      .admin-footer-preview-frame [class*="z-[90]"],
      .admin-footer-preview-frame [class*="z-[999]"] {
        z-index: 20 !important;
      }

      .admin-footer-preview-frame [class*="absolute"][class*="right-"],
      .admin-footer-preview-frame [class*="absolute"][class*="-right"] {
        right: 0.5rem !important;
        max-width: calc(100% - 1rem) !important;
      }

      .admin-footer-preview-frame [class*="absolute"] button {
        min-width: 2.25rem !important;
        width: auto !important;
        min-height: 2.25rem !important;
        padding: 0.5rem 0.75rem !important;
        white-space: normal !important;
      }
    }
  `}
</style>
     <header
  className="relative z-0"
  style={{
    background:
      "linear-gradient(135deg, rgba(255,255,255,0.96), rgba(248,244,255,0.95), rgba(238,247,255,0.95))",
    borderBottom: "1px solid rgba(75,46,131,0.12)",
    boxShadow: "0 14px 36px rgba(15,23,42,0.08)",
    backdropFilter: "blur(18px)",
  }}
>
  <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
    <button
      type="button"
      onClick={() => navigate("/admin/dashboard")}
      className="inline-flex w-fit items-center gap-2 font-black transition-all hover:-translate-x-1"
      style={{ color: colors.dark }}
    >
      <ArrowLeft className="w-5 h-5" />
      Back to Dashboard
    </button>

    <div className="flex flex-wrap items-center gap-3">
      <a
        href="/"
        target="_blank"
        rel="noreferrer"
        className="hidden md:inline-flex items-center gap-2 px-4 py-3 rounded-2xl font-black transition-all hover:scale-105"
        style={{
          color: colors.dark,
          background: "rgba(255,255,255,0.72)",
          border: "1px solid rgba(75,46,131,0.12)",
          boxShadow: "0 10px 26px rgba(15,23,42,0.06)",
        }}
      >
        <ExternalLink className="w-4 h-4" />
        View Website
      </a>
    </div>
  </div>
</header>

      <main className="max-w-[1600px] mx-auto px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-5"
            style={{
              background: "rgba(22,138,58,0.1)",
              color: colors.green,
              border: "1px solid rgba(22,138,58,0.2)",
            }}
          >
            <Footprints className="w-4 h-4" />
            Visual Footer Editor
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
            Edit Footer
          </h1>

          <p className="text-slate-500 max-w-3xl text-lg">
            Edit directly from the real footer preview. Each popup saves its own section immediately, so there is no separate final Save Changes button.
          </p>
        </motion.div>

        {success && (
          <div className="mb-6 rounded-2xl px-5 py-4 flex items-center gap-3 font-semibold bg-green-50 text-green-700 border border-green-100">
            <CheckCircle2 className="w-5 h-5" />
            {success}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-2xl px-5 py-4 flex items-center gap-3 font-semibold bg-red-50 text-red-700 border border-red-100">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        <div
  className="admin-footer-preview-frame rounded-[24px] sm:rounded-[32px] p-3 sm:p-4 md:p-6"
  style={{
    background:
      "linear-gradient(145deg, rgba(255,255,255,0.96), rgba(255,255,255,0.78))",
    border: "1px solid rgba(11,16,32,0.08)",
    boxShadow:
      "0 18px 48px rgba(11,16,32,0.075), inset 0 1px 0 rgba(255,255,255,0.85)",
  }}
>
          <Footer
            editMode
            contentOverride={form}
            onEditTarget={openEditor}
            onAddTarget={addTarget}
            onDeleteTarget={requestDelete}
          />
        </div>

        <div className="grid md:grid-cols-4 gap-4 mt-8">
          <button
            type="button"
            onClick={() => openEditor({ type: "identity" })}
            className="rounded-2xl p-5 text-left bg-white border border-slate-100 hover:-translate-y-1 transition-all"
          >
            <UploadCloud className="w-5 h-5 mb-3" style={{ color: colors.purple }} />
            <div className="font-black text-slate-950">Logo & School Info</div>
            <div className="text-sm text-slate-500 mt-1">Logo, name, subtitle, admission badge.</div>
          </button>

          <button
            type="button"
            onClick={() => openEditor({ type: "navLinks" })}
            className="rounded-2xl p-5 text-left bg-white border border-slate-100 hover:-translate-y-1 transition-all"
          >
            <LinkIcon className="w-5 h-5 mb-3" style={{ color: colors.gold }} />
            <div className="font-black text-slate-950">Edit Footer Links</div>
            <div className="text-sm text-slate-500 mt-1">Add, edit, hide, or delete footer links.</div>
          </button>

          <button
            type="button"
            onClick={() => openEditor({ type: "socials" })}
            className="rounded-2xl p-5 text-left bg-white border border-slate-100 hover:-translate-y-1 transition-all"
          >
            <Share2 className="w-5 h-5 mb-3" style={{ color: colors.green }} />
            <div className="font-black text-slate-950">Edit Social Links</div>
            <div className="text-sm text-slate-500 mt-1">Add, edit, hide, or delete social links.</div>
          </button>

          <button
            type="button"
            onClick={() => openEditor({ type: "contact" })}
            className="rounded-2xl p-5 text-left bg-white border border-slate-100 hover:-translate-y-1 transition-all"
          >
            <Phone className="w-5 h-5 mb-3" style={{ color: colors.red }} />
            <div className="font-black text-slate-950">Contact Details</div>
            <div className="text-sm text-slate-500 mt-1">Address, map URL, phones, email.</div>
          </button>
        </div>
      </main>

      <AnimatePresence>
        {editingTarget && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-5"
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
              className="w-full max-w-2xl rounded-[28px] overflow-hidden max-h-[92vh] overflow-y-auto"
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
                      <Pencil className="w-5 h-5" />
                    </div>

                    <div>
                      <h3 className="text-xl font-black text-slate-950">{modalTitle}</h3>
                      <p className="text-sm text-slate-500">Click Save Section to publish immediately.</p>
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
                  {editingTarget.type === "identity" && (
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
                              <img src={modalForm.logoUrl} alt="Footer logo preview" className="w-full h-full object-contain p-2" />
                            ) : (
                              <ImageIcon className="w-12 h-12 text-slate-300" />
                            )}
                          </div>

                          <div>
                            <div className="text-white font-black">Footer Logo Preview</div>
                            <div className="text-white/55 text-sm mt-1 leading-relaxed">
                              Recommended: 512×512 square, PNG/JPG/WebP, max 6 MB.
                            </div>
                          </div>
                        </div>

                        <label
                          className="mt-5 flex items-center justify-center gap-2 rounded-2xl px-4 py-3 font-black cursor-pointer"
                          style={{ background: `linear-gradient(135deg, ${colors.gold}, ${colors.cyan})`, color: colors.dark }}
                        >
                          <UploadCloud className="w-4 h-4" />
                          {uploadingLogo ? "Uploading..." : "Upload Footer Logo"}
                          <input
                            type="file"
                            accept="image/*"
                            disabled={uploadingLogo}
                            onChange={(event) => {
                              uploadLogo(event.target.files?.[0]);
                              event.target.value = "";
                            }}
                            className="hidden"
                          />
                        </label>

                        {modalForm.logoUrl && (
                          <button
                            type="button"
                            onClick={() => updateModalField("logoUrl", "")}
                            className="mt-3 w-full px-4 py-3 rounded-2xl text-sm font-black text-white"
                            style={{ background: "rgba(215,25,32,0.28)", border: "1px solid rgba(255,255,255,0.12)" }}
                          >
                            Remove Logo
                          </button>
                        )}
                      </div>

                      <Field label="Logo URL" value={modalForm.logoUrl} onChange={(value) => updateModalField("logoUrl", value)} />
                      <Field label="School Name" value={modalForm.schoolName} onChange={(value) => updateModalField("schoolName", value)} />
                      <Field label="School Subtitle" value={modalForm.schoolSubtitle} onChange={(value) => updateModalField("schoolSubtitle", value)} />
                      <Field label="Admission Badge Text" value={modalForm.admissionBadgeText} onChange={(value) => updateModalField("admissionBadgeText", value)} />
                      <Toggle checked={modalForm.showAdmissionBadge !== false} onChange={(value) => updateModalField("showAdmissionBadge", value)} label="Show admission badge" />
                    </>
                  )}

                  {editingTarget.type === "navLinks" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <div className="font-black text-slate-950">Footer Links</div>
                          <div className="text-sm text-slate-500">Manage every footer navigation link from one place.</div>
                        </div>

                        <button
                          type="button"
                          onClick={addModalNavLink}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black text-white"
                          style={{ background: `linear-gradient(135deg, ${colors.purple}, ${colors.green})` }}
                        >
                          <Plus className="w-4 h-4" />
                          Add Link
                        </button>
                      </div>

                      {(modalForm.navLinks || []).map((link, index) => (
                        <div
                          key={link.id || index}
                          className="rounded-3xl p-5 space-y-4"
                          style={{ background: "rgba(15,23,42,0.04)", border: "1px solid rgba(15,23,42,0.08)" }}
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <div className="font-black text-slate-950">Link {index + 1}</div>
                              <div className="text-sm text-slate-500">{link.label || "New Link"}</div>
                            </div>

                            <button
                              type="button"
                              onClick={() => deleteModalNavLink(index)}
                              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-black"
                              style={{ background: "rgba(215,25,32,0.09)", color: colors.red, border: "1px solid rgba(215,25,32,0.18)" }}
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>

                          <Toggle
                            checked={link.visible !== false}
                            onChange={(value) => updateModalListItem("navLinks", index, "visible", value)}
                            label="Show this footer link"
                          />

                          <div className="grid md:grid-cols-2 gap-4">
                            <Field
                              label="Label"
                              value={link.label}
                              onChange={(value) => updateModalListItem("navLinks", index, "label", value)}
                              placeholder="About"
                            />

                            <Field
                              label="Link"
                              value={link.href}
                              onChange={(value) => updateModalListItem("navLinks", index, "href", value)}
                              placeholder="/about"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {editingTarget.type === "navLink" && (
                    <>
                      <Toggle checked={modalForm.visible !== false} onChange={(value) => updateModalField("visible", value)} label="Show this footer link" />
                      <Field label="Label" value={modalForm.label} onChange={(value) => updateModalField("label", value)} placeholder="About" />
                      <Field label="Link" value={modalForm.href} onChange={(value) => updateModalField("href", value)} placeholder="/about" />
                    </>
                  )}

                  {editingTarget.type === "socials" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <div className="font-black text-slate-950">Social Links</div>
                          <div className="text-sm text-slate-500">Manage every social icon from one place.</div>
                        </div>

                        <button
                          type="button"
                          onClick={addModalSocial}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black text-white"
                          style={{ background: `linear-gradient(135deg, ${colors.purple}, ${colors.green})` }}
                        >
                          <Plus className="w-4 h-4" />
                          Add Social
                        </button>
                      </div>

                      {(modalForm.socials || []).map((social, index) => (
                        <div
                          key={social.id || index}
                          className="rounded-3xl p-5 space-y-4"
                          style={{ background: "rgba(15,23,42,0.04)", border: "1px solid rgba(15,23,42,0.08)" }}
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <div className="font-black text-slate-950">Social {index + 1}</div>
                              <div className="text-sm text-slate-500">{social.label || "Website"}</div>
                            </div>

                            <button
                              type="button"
                              onClick={() => deleteModalSocial(index)}
                              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-black"
                              style={{ background: "rgba(215,25,32,0.09)", color: colors.red, border: "1px solid rgba(215,25,32,0.18)" }}
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>

                          <Toggle
                            checked={social.visible !== false}
                            onChange={(value) => updateModalListItem("socials", index, "visible", value)}
                            label="Show this social link"
                          />

                          <div className="grid md:grid-cols-2 gap-4">
                            <Field
                              label="Label"
                              value={social.label}
                              onChange={(value) => updateModalListItem("socials", index, "label", value)}
                              placeholder="Facebook"
                            />

                            <SelectField
                              label="Type"
                              value={social.type}
                              onChange={(value) => updateModalListItem("socials", index, "type", value)}
                            >
                              <option value="facebook">Facebook</option>
                              <option value="youtube">YouTube</option>
                              <option value="website">Website</option>
                            </SelectField>
                          </div>

                          <Field
                            label="URL"
                            value={social.href}
                            onChange={(value) => updateModalListItem("socials", index, "href", value)}
                            placeholder="https://..."
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {editingTarget.type === "social" && (
                    <>
                      <Toggle checked={modalForm.visible !== false} onChange={(value) => updateModalField("visible", value)} label="Show this social link" />
                      <Field label="Label" value={modalForm.label} onChange={(value) => updateModalField("label", value)} placeholder="Facebook" />
                      <SelectField label="Type" value={modalForm.type} onChange={(value) => updateModalField("type", value)}>
                        <option value="facebook">Facebook</option>
                        <option value="youtube">YouTube</option>
                        <option value="website">Website</option>
                      </SelectField>
                      <Field label="URL" value={modalForm.href} onChange={(value) => updateModalField("href", value)} placeholder="https://..." />
                    </>
                  )}

                  {editingTarget.type === "contact" && (
                    <>
                      <Field label="Address" value={modalForm.address} onChange={(value) => updateModalField("address", value)} />
                      <TextArea label="Google Map URL or Address" value={modalForm.mapUrl} onChange={(value) => updateModalField("mapUrl", value)} rows={3} />
                      <Field label="Email" value={modalForm.email} onChange={(value) => updateModalField("email", value)} placeholder="school@email.com" />

                      <div>
                        <div className="flex items-center justify-between gap-4 mb-3">
                          <label className="block text-sm font-black text-slate-700">Phone Numbers</label>
                          <button
                            type="button"
                            onClick={addModalPhone}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black text-white"
                            style={{ background: `linear-gradient(135deg, ${colors.purple}, ${colors.green})` }}
                          >
                            <Plus className="w-4 h-4" />
                            Add Phone
                          </button>
                        </div>

                        <div className="space-y-3">
                          {(modalForm.phones || []).map((phone, index) => (
                            <div key={index} className="flex gap-3">
                              <input
                                value={phone}
                                onChange={(event) => updateModalPhone(index, event.target.value)}
                                placeholder="Phone number"
                                className="w-full px-4 py-3 rounded-2xl outline-none text-sm"
                                style={{
                                  background: "rgba(255,255,255,0.92)",
                                  border: "1px solid rgba(75,46,131,0.16)",
                                  color: colors.dark,
                                }}
                              />

                              <button
                                type="button"
                                onClick={() => deleteModalPhone(index)}
                                className="px-4 rounded-2xl"
                                style={{ background: "rgba(215,25,32,0.09)", color: colors.red }}
                                title="Delete phone"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {editingTarget.type === "phonePopup" && (
                    <>
                      <Field label="Popup Title" value={modalForm.modalTitle} onChange={(value) => updateModalField("modalTitle", value)} />
                      <Field label="Popup Hint" value={modalForm.modalHint} onChange={(value) => updateModalField("modalHint", value)} />
                      <Field label="Copied Text" value={modalForm.copiedText} onChange={(value) => updateModalField("copiedText", value)} />
                      <Field label="Close Button Text" value={modalForm.closeButtonText} onChange={(value) => updateModalField("closeButtonText", value)} />
                    </>
                  )}

                  {editingTarget.type === "copyright" && (
                    <TextArea label="Copyright Text" value={modalForm.copyrightText} onChange={(value) => updateModalField("copyrightText", value)} rows={4} />
                  )}
                </div>

                <div className="flex gap-3 mt-7">
                  <button
                    type="button"
                    onClick={closeEditor}
                    disabled={saving || uploadingLogo}
                    className="flex-1 py-3 rounded-2xl text-sm font-black disabled:opacity-60"
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
                    className="flex-1 py-3 rounded-2xl text-sm font-black inline-flex items-center justify-center gap-2 disabled:opacity-60"
                    style={{
                      background: `linear-gradient(135deg, ${colors.gold}, ${colors.cyan})`,
                      color: "#020617",
                      boxShadow: "0 16px 38px rgba(56,189,248,0.24)",
                    }}
                  >
                    <Save className="w-4 h-4" />
                    Save Section
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        <ConfirmDialog
          target={confirmTarget}
          onCancel={() => setConfirmTarget(null)}
          onConfirm={confirmDelete}
        />
      </AnimatePresence>
    </section>
  );
}

