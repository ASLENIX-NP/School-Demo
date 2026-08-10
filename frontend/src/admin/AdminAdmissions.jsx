import { useEffect, useState } from "react";
import api from "../lib/api";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AdmissionsPage, { defaultSettings } from "../app/components/Admissions";
import {
  ArrowLeft,
  Settings,
  Users,
  BarChart3,
  ToggleLeft,
  ToggleRight,
  Save,
  Upload,
  Plus,
  Trash2,
  Edit3,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Phone,
  Mail,
  Search,
  Filter,
  Download,
  UserCheck,
  Building,
  GraduationCap,
  Sparkles,
  FileText,
  AlertCircle,
  Calendar,
  Layers,
  TrendingUp,
  MapPin,
  X,
  RefreshCw,
  Award,
  BookOpen,
  Bus,
  Home,
  ShieldCheck,
  HelpCircle,
  ExternalLink,
  ChevronDown
} from "lucide-react";

const ICON_OPTIONS = [
  { label: "Award / Excellence", value: "Award" },
  { label: "Users / Educators", value: "Users" },
  { label: "School / Campus", value: "School" },
  { label: "Shield / Safety", value: "ShieldCheck" },
  { label: "Book / Classroom", value: "BookOpen" },
  { label: "Bus / Transport", value: "Bus" },
  { label: "Home / Hostel", value: "Home" },
  { label: "Sparkles / Star", value: "Sparkles" },
  { label: "Graduation Cap", value: "GraduationCap" },
  { label: "Clock / Time", value: "Clock" },
  { label: "Phone / Support", value: "Phone" },
  { label: "Mail / Email", value: "Mail" },
  { label: "Map Pin / Location", value: "MapPin" },
  { label: "File / Document", value: "FileText" },
  { label: "Calendar / Schedule", value: "Calendar" },
  { label: "Help / FAQ", value: "HelpCircle" },
  { label: "Checkmark", value: "CheckCircle2" }
];

export default function AdminAdmissions() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("settings"); // 'settings', 'preview', 'dashboard', 'analytics'

  // Loading & notification states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Admission Settings State
  const [settings, setSettings] = useState(defaultSettings);

  // Inquiries & Analytics State
  const [inquiries, setInquiries] = useState([]);
  const [analytics, setAnalytics] = useState({
    total: 0,
    todayCount: 0,
    isOpen: true,
    pendingCount: 0,
    followUpCount: 0,
    approvedCount: 0,
    convertedCount: 0,
    rejectedCount: 0,
    mostAppliedClass: "N/A",
    conversionRate: "0.0",
    classBreakdown: {},
    genderBreakdown: {},
    districtBreakdown: {}
  });

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [classFilter, setClassFilter] = useState("All");

  // Selected Inquiry for Modal View
  const [viewInquiry, setViewInquiry] = useState(null);

  // File Uploading Indicators
  const [uploadingProspectus, setUploadingProspectus] = useState(false);
  const [uploadingFee, setUploadingFee] = useState(false);

  // Fetch initial data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [settingsRes, inquiriesRes, analyticsRes] = await Promise.all([
        api.get("/api/admissions/settings"),
        api.get("/api/admissions/inquiries"),
        api.get("/api/admissions/analytics")
      ]);

      if (settingsRes.data?.data) {
        setSettings({ ...defaultSettings, ...settingsRes.data.data });
      }
      if (inquiriesRes.data?.data) setInquiries(inquiriesRes.data.data);
      if (analyticsRes.data?.data) setAnalytics(analyticsRes.data.data);
    } catch (err) {
      console.error("Error fetching admin admission data:", err);
      showMessage("error", "Failed to load admission data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 4000);
  };

  // General field updater for simple scalar settings
  const handleFieldChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  // Save Admission Settings
  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const res = await api.put("/api/admissions/settings", settings);
      if (res.data?.success) {
        showMessage("success", "Admission settings & content saved successfully!");
        fetchData();
      }
    } catch (err) {
      showMessage("error", err.response?.data?.message || "Failed to update settings.");
    } finally {
      setSaving(false);
    }
  };

  // Reset to Defaults
  const handleResetToDefaults = () => {
    if (window.confirm("Are you sure you want to reset all admission page content to default values?")) {
      setSettings(defaultSettings);
      showMessage("success", "Reset to default template. Click 'Save All Changes' to apply.");
    }
  };

  // Upload PDF files
  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    if (type === "prospectus") setUploadingProspectus(true);
    else setUploadingFee(true);

    try {
      const res = await api.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      const url = res.data?.url || res.data?.imageUrl || res.data?.data?.url;
      if (url) {
        setSettings((prev) => ({
          ...prev,
          [type === "prospectus" ? "prospectusUrl" : "feeStructureUrl"]: url
        }));
        showMessage("success", `${type === "prospectus" ? "Prospectus" : "Fee Structure"} uploaded successfully!`);
      }
    } catch (err) {
      showMessage("error", "Failed to upload file.");
    } finally {
      if (type === "prospectus") setUploadingProspectus(false);
      else setUploadingFee(false);
    }
  };

  // --- Dynamic Array Helpers: Why Us ---
  const addWhyUs = () => {
    setSettings((prev) => ({
      ...prev,
      whyUs: [
        ...(prev.whyUs || []),
        { id: `why-${Date.now()}`, icon: "Award", title: "New Highlight Feature", desc: "Detailed description of why parents and students should choose our school." }
      ]
    }));
  };

  const updateWhyUs = (index, field, value) => {
    setSettings((prev) => {
      const list = [...(prev.whyUs || [])];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, whyUs: list };
    });
  };

  const removeWhyUs = (index) => {
    setSettings((prev) => ({
      ...prev,
      whyUs: (prev.whyUs || []).filter((_, i) => i !== index)
    }));
  };

  // --- Dynamic Array Helpers: Timeline Steps ---
  const addProcessStep = () => {
    const currentLen = (settings.timelineSteps || []).length;
    const nextNum = currentLen < 9 ? `0${currentLen + 1}` : `${currentLen + 1}`;
    setSettings((prev) => ({
      ...prev,
      timelineSteps: [
        ...(prev.timelineSteps || []),
        { id: `step-${Date.now()}`, number: nextNum, title: "New Step", desc: "Explain the action required by parent/student." }
      ]
    }));
  };

  const updateProcessStep = (index, field, value) => {
    setSettings((prev) => {
      const list = [...(prev.timelineSteps || [])];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, timelineSteps: list };
    });
  };

  const removeProcessStep = (index) => {
    setSettings((prev) => ({
      ...prev,
      timelineSteps: (prev.timelineSteps || []).filter((_, i) => i !== index)
    }));
  };

  // --- Dynamic Array Helpers: Eligibility Criteria ---
  const addEligibility = () => {
    setSettings((prev) => ({
      ...prev,
      eligibilityCriteria: [
        ...(prev.eligibilityCriteria || []),
        { id: `elig-${Date.now()}`, grade: "New Grade / Class", age: "6.0+ years", requirements: "Passed entrance test & previous academic records." }
      ]
    }));
  };

  const updateEligibility = (index, field, value) => {
    setSettings((prev) => {
      const list = [...(prev.eligibilityCriteria || [])];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, eligibilityCriteria: list };
    });
  };

  const removeEligibility = (index) => {
    setSettings((prev) => ({
      ...prev,
      eligibilityCriteria: (prev.eligibilityCriteria || []).filter((_, i) => i !== index)
    }));
  };

  // --- Dynamic Array Helpers: Required Documents ---
  const addDocument = () => {
    setSettings((prev) => ({
      ...prev,
      requiredDocuments: [
        ...(prev.requiredDocuments || []),
        { id: `doc-${Date.now()}`, name: "New Document Requirement", desc: "Official copy to be verified during enrollment.", mandatory: true }
      ]
    }));
  };

  const updateDocument = (index, field, value) => {
    setSettings((prev) => {
      const list = [...(prev.requiredDocuments || [])];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, requiredDocuments: list };
    });
  };

  const removeDocument = (index) => {
    setSettings((prev) => ({
      ...prev,
      requiredDocuments: (prev.requiredDocuments || []).filter((_, i) => i !== index)
    }));
  };

  // --- Dynamic Array Helpers: Important Dates ---
  const addImportantDate = () => {
    setSettings((prev) => ({
      ...prev,
      importantDates: [
        ...(prev.importantDates || []),
        { id: `date-${Date.now()}`, title: "New Milestone Event", date: "2027-05-01", desc: "Key timeline date for parents." }
      ]
    }));
  };

  const updateImportantDate = (index, field, value) => {
    setSettings((prev) => {
      const list = [...(prev.importantDates || [])];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, importantDates: list };
    });
  };

  const removeImportantDate = (index) => {
    setSettings((prev) => ({
      ...prev,
      importantDates: (prev.importantDates || []).filter((_, i) => i !== index)
    }));
  };

  // --- Dynamic Array Helpers: Facilities ---
  const addFacility = () => {
    setSettings((prev) => ({
      ...prev,
      facilitiesList: [
        ...(prev.facilitiesList || []),
        { id: `fac-${Date.now()}`, icon: "BookOpen", title: "New Campus Facility", desc: "Modern infrastructure to support student growth." }
      ]
    }));
  };

  const updateFacility = (index, field, value) => {
    setSettings((prev) => {
      const list = [...(prev.facilitiesList || [])];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, facilitiesList: list };
    });
  };

  const removeFacility = (index) => {
    setSettings((prev) => ({
      ...prev,
      facilitiesList: (prev.facilitiesList || []).filter((_, i) => i !== index)
    }));
  };

  // --- Dynamic Array Helpers: FAQs ---
  const addFaq = () => {
    setSettings((prev) => ({
      ...prev,
      faqs: [
        ...(prev.faqs || []),
        { id: `faq-${Date.now()}`, question: "New Frequently Asked Question?", answer: "Clear, helpful answer explaining the procedure." }
      ]
    }));
  };

  const updateFaq = (index, field, value) => {
    setSettings((prev) => {
      const list = [...(prev.faqs || [])];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, faqs: list };
    });
  };

  const removeFaq = (index) => {
    setSettings((prev) => ({
      ...prev,
      faqs: (prev.faqs || []).filter((_, i) => i !== index)
    }));
  };

  // Inquiry Status Change
  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await api.put(`/api/admissions/inquiries/${id}`, { status: newStatus });
      if (res.data?.success) {
        showMessage("success", `Status updated to ${newStatus}`);
        fetchData();
      }
    } catch (err) {
      showMessage("error", "Failed to update status.");
    }
  };

  // Convert Inquiry to Student
  const handleConvertToStudent = async (id) => {
    if (!window.confirm("Are you sure you want to convert this inquiry into an active Student Record?")) return;

    try {
      const res = await api.post(`/api/admissions/inquiries/${id}/convert`);
      if (res.data?.success) {
        showMessage("success", res.data.message || "Successfully converted to Student!");
        fetchData();
      }
    } catch (err) {
      showMessage("error", err.response?.data?.message || "Failed to convert student.");
    }
  };

  // Delete Inquiry
  const handleDeleteInquiry = async (id) => {
    if (!window.confirm("Are you sure you want to delete this admission inquiry?")) return;

    try {
      const res = await api.delete(`/api/admissions/inquiries/${id}`);
      if (res.data?.success) {
        showMessage("success", "Inquiry deleted successfully!");
        fetchData();
      }
    } catch (err) {
      showMessage("error", "Failed to delete inquiry.");
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (!inquiries || inquiries.length === 0) return;

    const headers = ["Inquiry ID", "Student Name", "Applying Class", "Parent Name", "Mobile", "Email", "District", "Status", "Submission Date"];
    const rows = inquiries.map((item) => [
      item.inquiryId || item.id,
      `"${item.studentName}"`,
      `"${item.applyingClass}"`,
      `"${item.parentName}"`,
      `"${item.mobile}"`,
      `"${item.email}"`,
      `"${item.district || item.fullAddress}"`,
      `"${item.status}"`,
      `"${new Date(item.createdAt).toLocaleDateString()}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Admission_Inquiries_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter inquiries
  const filteredInquiries = inquiries.filter((item) => {
    const matchesSearch =
      searchTerm === "" ||
      item.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.parentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.inquiryId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.mobile?.includes(searchTerm) ||
      item.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "All" || item.status === statusFilter;
    const matchesClass = classFilter === "All" || item.applyingClass === classFilter;

    return matchesSearch && matchesStatus && matchesClass;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-900">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-bold text-slate-600">Loading Admission Control Panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* ================= COMPACT LIGHT HEADER BAR ================= */}
      <header className="sticky top-0 z-40 bg-white/95 border-b border-slate-200 backdrop-blur-md px-4 sm:px-6 py-2.5 sm:py-3 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/admin/dashboard")}
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-50 border border-slate-300 px-2.5 py-1.5 text-xs sm:text-sm font-bold text-slate-700 transition hover:bg-slate-100"
            >
              <ArrowLeft size={16} />
              Dashboard
            </button>

            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-black text-slate-900">Admissions Manager</span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  settings.isOpen ? "bg-emerald-100 text-emerald-800 border border-emerald-300" : "bg-rose-100 text-rose-800 border border-rose-300"
                }`}
              >
                {settings.isOpen ? "Open" : "Closed"}
              </span>
            </div>
          </div>

          {/* Tab Switcher & Action Buttons */}
          <div className="flex items-center flex-wrap gap-2">
            <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200">
              {[
                { id: "settings", label: "Page Editor", icon: Settings },
                { id: "preview", label: "Live Preview", icon: Eye },
                { id: "dashboard", label: "Inquiries Desk", icon: Users },
                { id: "analytics", label: "Analytics", icon: BarChart3 }
              ].map((tab) => {
                const TabIcon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      active ? "bg-amber-400 text-slate-950 shadow-sm" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <TabIcon size={14} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <a
              href="/admissions"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 text-xs font-bold transition shadow-xs"
            >
              <ExternalLink size={14} /> View Public
            </a>

            {activeTab === "settings" && (
              <button
                type="button"
                onClick={handleSaveSettings}
                disabled={saving}
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 px-3.5 py-1.5 text-xs sm:text-sm font-black text-slate-950 shadow-sm transition hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                <Save size={14} />
                {saving ? "Saving..." : "Save All"}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Notifications Toast */}
      {message.text && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 mt-3">
          <div
            className={`p-3 rounded-xl text-xs sm:text-sm font-bold border flex items-center justify-between ${
              message.type === "success"
                ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                : "bg-rose-50 border-rose-300 text-rose-800"
            }`}
          >
            <div className="flex items-center gap-2">
              {message.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
              {message.text}
            </div>
            <button type="button" onClick={() => setMessage({ type: "", text: "" })}>
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* ================= MAIN CONTENT ================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-6">

        {/* ================= TAB 1: VISUAL PAGE EDITOR ================= */}
        {activeTab === "settings" && (
          <div className="space-y-6">

            {/* Quick Actions / Reset Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm">
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900">Full Admission Page Editor</h2>
                <p className="text-xs text-slate-500">Edit any heading, card, workflow step, requirement, document, date, FAQ, or contact info.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetToDefaults}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
                >
                  <RefreshCw size={13} /> Reset Defaults
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("preview")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700 hover:bg-blue-100 transition"
                >
                  <Eye size={13} /> Preview Live Changes
                </button>
              </div>
            </div>

            {/* 1. ADMISSION CYCLE & STATUS */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm sm:text-base font-black text-blue-950 flex items-center gap-2">
                    <Sparkles size={16} className="text-amber-500" /> 1. Admission Status & Academic Session
                  </h3>
                  <p className="text-xs text-slate-500">Control application status, academic session dates, and what is visible on the website.</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700">
                    {settings.isOpen ? "Applications Open" : "Applications Closed"}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleFieldChange("isOpen", !settings.isOpen)}
                    className={`transition-colors ${settings.isOpen ? "text-emerald-600" : "text-slate-400"}`}
                    title={settings.isOpen ? "Click to lock / close admissions" : "Click to open admissions"}
                  >
                    {settings.isOpen ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                  </button>
                </div>
              </div>

              {/* Website Visibility Controls */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-black uppercase tracking-wider text-blue-950">Website Display & Visibility Options</p>
                  <span className="text-[10px] text-slate-500 font-medium">Hide/Show info on the live website</span>
                </div>

                <div className="grid sm:grid-cols-3 gap-3">
                  {/* Toggle: Academic Session Year */}
                  <label className="flex items-center justify-between gap-2 p-3 rounded-xl bg-white border border-slate-200 cursor-pointer hover:border-slate-300 transition shadow-xs">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-900 block">Academic Session</span>
                      <span className="text-[10px] text-slate-500 block">Show Session {settings.academicSession || ""}</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.showAcademicSession !== false}
                      onChange={(e) => handleFieldChange("showAcademicSession", e.target.checked)}
                      className="w-4 h-4 text-amber-500 accent-amber-500 cursor-pointer"
                    />
                  </label>

                  {/* Toggle: Status Badge */}
                  <label className="flex items-center justify-between gap-2 p-3 rounded-xl bg-white border border-slate-200 cursor-pointer hover:border-slate-300 transition shadow-xs">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-900 block">Status Badge</span>
                      <span className="text-[10px] text-slate-500 block">Show Open/Closed badge</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.showStatusBadge !== false}
                      onChange={(e) => handleFieldChange("showStatusBadge", e.target.checked)}
                      className="w-4 h-4 text-amber-500 accent-amber-500 cursor-pointer"
                    />
                  </label>

                  {/* Toggle: Session Dates */}
                  <label className="flex items-center justify-between gap-2 p-3 rounded-xl bg-white border border-slate-200 cursor-pointer hover:border-slate-300 transition shadow-xs">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-900 block">Session Dates</span>
                      <span className="text-[10px] text-slate-500 block">Show Start & Deadline dates</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.showDatesOnWebsite !== false}
                      onChange={(e) => handleFieldChange("showDatesOnWebsite", e.target.checked)}
                      className="w-4 h-4 text-amber-500 accent-amber-500 cursor-pointer"
                    />
                  </label>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Academic Session</label>
                  <input
                    type="text"
                    value={settings.academicSession || ""}
                    onChange={(e) => handleFieldChange("academicSession", e.target.value)}
                    placeholder="e.g. 2027–2028"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-semibold outline-none focus:bg-white focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={settings.startDate || ""}
                    onChange={(e) => handleFieldChange("startDate", e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-semibold outline-none focus:bg-white focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">End Date / Deadline</label>
                  <input
                    type="date"
                    value={settings.endDate || ""}
                    onChange={(e) => handleFieldChange("endDate", e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-semibold outline-none focus:bg-white focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* 2. HERO BANNER & PRIMARY ACTIONS */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm sm:text-base font-black text-blue-950 flex items-center gap-2 border-b border-slate-100 pb-3">
                <Sparkles size={16} className="text-amber-500" /> 2. Hero Banner & Buttons
              </h3>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Hero Badge Text</label>
                  <input
                    type="text"
                    value={settings.heroBadgeText || ""}
                    onChange={(e) => handleFieldChange("heroBadgeText", e.target.value)}
                    placeholder="e.g. Admissions Open for 2027–2028"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-semibold outline-none focus:bg-white focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Apply Button Text</label>
                  <input
                    type="text"
                    value={settings.applyButtonText || ""}
                    onChange={(e) => handleFieldChange("applyButtonText", e.target.value)}
                    placeholder="e.g. Apply Now for Admission"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-semibold outline-none focus:bg-white focus:border-amber-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Hero Main Title</label>
                  <input
                    type="text"
                    value={settings.heroTitle || ""}
                    onChange={(e) => handleFieldChange("heroTitle", e.target.value)}
                    placeholder="e.g. Empowering Next Generation Leaders"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-bold outline-none focus:bg-white focus:border-amber-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Hero Subtitle / Description</label>
                  <textarea
                    rows={2}
                    value={settings.heroDescription || ""}
                    onChange={(e) => handleFieldChange("heroDescription", e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-normal outline-none focus:bg-white focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Prospectus Button Text</label>
                  <input
                    type="text"
                    value={settings.prospectusButtonText || ""}
                    onChange={(e) => handleFieldChange("prospectusButtonText", e.target.value)}
                    placeholder="Download Prospectus"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs outline-none focus:bg-white focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Contact Button Text</label>
                  <input
                    type="text"
                    value={settings.contactButtonText || ""}
                    onChange={(e) => handleFieldChange("contactButtonText", e.target.value)}
                    placeholder="Contact Admissions"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs outline-none focus:bg-white focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* 3. CLOSED NOTICE BANNER (WHEN ADMISSIONS ARE CLOSED) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm sm:text-base font-black text-rose-800 flex items-center gap-2 border-b border-slate-100 pb-3">
                <AlertCircle size={16} className="text-rose-600" /> 3. Closed Notice Banner (Active When Admissions Are Closed)
              </h3>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Closed Banner Heading</label>
                  <input
                    type="text"
                    value={settings.closedTitle || ""}
                    onChange={(e) => handleFieldChange("closedTitle", e.target.value)}
                    placeholder="Admissions Are Currently Closed"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-bold outline-none focus:bg-white focus:border-rose-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Closed CTA Button Text</label>
                  <input
                    type="text"
                    value={settings.closedButtonText || ""}
                    onChange={(e) => handleFieldChange("closedButtonText", e.target.value)}
                    placeholder="Contact Admissions Office"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs outline-none focus:bg-white focus:border-rose-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Closed Notice Message</label>
                  <textarea
                    rows={2}
                    value={settings.closedDescription || ""}
                    onChange={(e) => handleFieldChange("closedDescription", e.target.value)}
                    placeholder="Applications for this academic session have ended..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs outline-none focus:bg-white focus:border-rose-400"
                  />
                </div>
              </div>
            </div>

            {/* 4. PROSPECTUS & FEE PDF UPLOADS */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm sm:text-base font-black text-blue-950 flex items-center gap-2 border-b border-slate-100 pb-3">
                <Upload size={16} className="text-amber-500" /> 4. Prospectus & Fee Structure PDF Documents
              </h3>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-900">School Prospectus PDF</p>
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer hover:bg-amber-300 transition shadow-xs">
                      <Upload size={13} />
                      {uploadingProspectus ? "Uploading..." : "Upload File"}
                      <input type="file" accept="application/pdf" className="hidden" onChange={(e) => handleFileUpload(e, "prospectus")} />
                    </label>
                  </div>
                  <input
                    type="text"
                    value={settings.prospectusUrl || ""}
                    onChange={(e) => handleFieldChange("prospectusUrl", e.target.value)}
                    placeholder="PDF URL or uploaded path..."
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs font-mono outline-none"
                  />
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-900">Fee Structure PDF</p>
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer hover:bg-amber-300 transition shadow-xs">
                      <Upload size={13} />
                      {uploadingFee ? "Uploading..." : "Upload File"}
                      <input type="file" accept="application/pdf" className="hidden" onChange={(e) => handleFileUpload(e, "feeStructure")} />
                    </label>
                  </div>
                  <input
                    type="text"
                    value={settings.feeStructureUrl || ""}
                    onChange={(e) => handleFieldChange("feeStructureUrl", e.target.value)}
                    placeholder="PDF URL or uploaded path..."
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs font-mono outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 5. WHY CHOOSE US (WHY RED ROSE SCHOOL) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm sm:text-base font-black text-blue-950 flex items-center gap-2">
                    <Award size={16} className="text-amber-500" /> 5. Why Choose Us / Highlights Section
                  </h3>
                  <p className="text-xs text-slate-500">Add, edit, or delete any highlight card with customizable icons.</p>
                </div>
                <button
                  type="button"
                  onClick={addWhyUs}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition"
                >
                  <Plus size={14} /> Add Why Us Card
                </button>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Section Badge</label>
                  <input
                    type="text"
                    value={settings.whyUsBadge || ""}
                    onChange={(e) => handleFieldChange("whyUsBadge", e.target.value)}
                    placeholder="Why Red Rose School"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs outline-none focus:bg-white focus:border-amber-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Section Title</label>
                  <input
                    type="text"
                    value={settings.whyUsTitle || ""}
                    onChange={(e) => handleFieldChange("whyUsTitle", e.target.value)}
                    placeholder="Building a Foundation for Excellence"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-bold outline-none focus:bg-white focus:border-amber-500"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Section Description</label>
                  <textarea
                    rows={2}
                    value={settings.whyUsDescription || ""}
                    onChange={(e) => handleFieldChange("whyUsDescription", e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs outline-none focus:bg-white focus:border-amber-500"
                  />
                </div>
              </div>

              {/* List of Why Us Cards */}
              <div className="space-y-3 pt-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Cards List ({(settings.whyUs || []).length})</p>
                {(settings.whyUs || []).map((item, idx) => (
                  <div key={item.id || idx} className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-bold text-blue-950">Card #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeWhyUs(idx)}
                        className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition"
                        title="Delete Card"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Card Icon</label>
                        <select
                          value={item.icon || "Award"}
                          onChange={(e) => updateWhyUs(idx, "icon", e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs font-bold outline-none"
                        >
                          {ICON_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Card Title</label>
                        <input
                          type="text"
                          value={item.title || ""}
                          onChange={(e) => updateWhyUs(idx, "title", e.target.value)}
                          placeholder="e.g. Academic Excellence"
                          className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs font-bold outline-none"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Card Description</label>
                        <textarea
                          rows={2}
                          value={item.desc || ""}
                          onChange={(e) => updateWhyUs(idx, "desc", e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. STEP-BY-STEP ADMISSION PROCESS TIMELINE */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm sm:text-base font-black text-blue-950 flex items-center gap-2">
                    <Layers size={16} className="text-amber-500" /> 6. Admission Process Steps
                  </h3>
                  <p className="text-xs text-slate-500">Manage the step-by-step workflow for parents and students.</p>
                </div>
                <button
                  type="button"
                  onClick={addProcessStep}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition"
                >
                  <Plus size={14} /> Add Process Step
                </button>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Section Badge</label>
                  <input
                    type="text"
                    value={settings.processBadge || ""}
                    onChange={(e) => handleFieldChange("processBadge", e.target.value)}
                    placeholder="Step-By-Step Workflow"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs outline-none focus:bg-white focus:border-amber-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Section Title</label>
                  <input
                    type="text"
                    value={settings.processTitle || ""}
                    onChange={(e) => handleFieldChange("processTitle", e.target.value)}
                    placeholder="Simple 5-Step Admission Process"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-bold outline-none focus:bg-white focus:border-amber-500"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Section Description</label>
                  <textarea
                    rows={2}
                    value={settings.processDescription || ""}
                    onChange={(e) => handleFieldChange("processDescription", e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs outline-none focus:bg-white focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Steps List */}
              <div className="space-y-3 pt-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Steps List ({(settings.timelineSteps || []).length})</p>
                {(settings.timelineSteps || []).map((step, idx) => (
                  <div key={step.id || idx} className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-bold text-blue-950">Step #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeProcessStep(idx)}
                        className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition"
                        title="Delete Step"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="grid sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Step Number</label>
                        <input
                          type="text"
                          value={step.number || ""}
                          onChange={(e) => updateProcessStep(idx, "number", e.target.value)}
                          placeholder="e.g. 01"
                          className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-blue-900 text-xs font-black outline-none"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Step Title</label>
                        <input
                          type="text"
                          value={step.title || ""}
                          onChange={(e) => updateProcessStep(idx, "title", e.target.value)}
                          placeholder="e.g. Submit Inquiry"
                          className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs font-bold outline-none"
                        />
                      </div>

                      <div className="sm:col-span-4">
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Step Description</label>
                        <textarea
                          rows={2}
                          value={step.desc || ""}
                          onChange={(e) => updateProcessStep(idx, "desc", e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 7. ELIGIBILITY CRITERIA */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm sm:text-base font-black text-blue-950 flex items-center gap-2">
                    <GraduationCap size={16} className="text-amber-500" /> 7. Eligibility Criteria
                  </h3>
                  <p className="text-xs text-slate-500">Configure grade-level age requirements and academic prerequisites.</p>
                </div>
                <button
                  type="button"
                  onClick={addEligibility}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition"
                >
                  <Plus size={14} /> Add Grade Criteria
                </button>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Section Badge</label>
                  <input
                    type="text"
                    value={settings.eligibilityBadge || ""}
                    onChange={(e) => handleFieldChange("eligibilityBadge", e.target.value)}
                    placeholder="Requirements"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs outline-none focus:bg-white focus:border-amber-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Section Title</label>
                  <input
                    type="text"
                    value={settings.eligibilityTitle || ""}
                    onChange={(e) => handleFieldChange("eligibilityTitle", e.target.value)}
                    placeholder="Eligibility Criteria"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-bold outline-none focus:bg-white focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Criteria List */}
              <div className="space-y-3 pt-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Grade Items ({(settings.eligibilityCriteria || []).length})</p>
                {(settings.eligibilityCriteria || []).map((item, idx) => (
                  <div key={item.id || idx} className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-bold text-blue-950">Criteria #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeEligibility(idx)}
                        className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition"
                        title="Delete Criteria"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Grade / Class Name</label>
                        <input
                          type="text"
                          value={item.grade || ""}
                          onChange={(e) => updateEligibility(idx, "grade", e.target.value)}
                          placeholder="e.g. Play Group & Nursery"
                          className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs font-bold outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Age Limit / Requirement</label>
                        <input
                          type="text"
                          value={item.age || ""}
                          onChange={(e) => updateEligibility(idx, "age", e.target.value)}
                          placeholder="e.g. 2.5 - 3.5 years"
                          className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-amber-700 text-xs font-semibold outline-none"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Prerequisites / Requirements</label>
                        <textarea
                          rows={2}
                          value={item.requirements || ""}
                          onChange={(e) => updateEligibility(idx, "requirements", e.target.value)}
                          placeholder="e.g. Child birth certificate, medical immunization record..."
                          className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 8. REQUIRED DOCUMENTS CHECKLIST */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm sm:text-base font-black text-blue-950 flex items-center gap-2">
                    <FileText size={16} className="text-amber-500" /> 8. Required Documents Checklist
                  </h3>
                  <p className="text-xs text-slate-500">Specify mandatory or optional documents required for verification.</p>
                </div>
                <button
                  type="button"
                  onClick={addDocument}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition"
                >
                  <Plus size={14} /> Add Document
                </button>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Section Badge</label>
                  <input
                    type="text"
                    value={settings.documentsBadge || ""}
                    onChange={(e) => handleFieldChange("documentsBadge", e.target.value)}
                    placeholder="Checklist"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs outline-none focus:bg-white focus:border-amber-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Section Title</label>
                  <input
                    type="text"
                    value={settings.documentsTitle || ""}
                    onChange={(e) => handleFieldChange("documentsTitle", e.target.value)}
                    placeholder="Required Documents"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-bold outline-none focus:bg-white focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Documents List */}
              <div className="space-y-3 pt-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Documents List ({(settings.requiredDocuments || []).length})</p>
                {(settings.requiredDocuments || []).map((doc, idx) => (
                  <div key={doc.id || idx} className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-blue-950">Doc #{idx + 1}</span>
                        <label className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={doc.mandatory !== false}
                            onChange={(e) => updateDocument(idx, "mandatory", e.target.checked)}
                            className="w-3.5 h-3.5 text-amber-500 accent-amber-500"
                          />
                          <span>Mandatory</span>
                        </label>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeDocument(idx)}
                        className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition"
                        title="Delete Document"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Document Name</label>
                        <input
                          type="text"
                          value={doc.name || ""}
                          onChange={(e) => updateDocument(idx, "name", e.target.value)}
                          placeholder="e.g. Birth Certificate"
                          className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs font-bold outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Description / Notes</label>
                        <input
                          type="text"
                          value={doc.desc || ""}
                          onChange={(e) => updateDocument(idx, "desc", e.target.value)}
                          placeholder="e.g. Official copy issued by local municipality"
                          className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 9. IMPORTANT DATES & DEADLINES */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm sm:text-base font-black text-blue-950 flex items-center gap-2">
                    <Calendar size={16} className="text-amber-500" /> 9. Important Dates & Deadlines Block
                  </h3>
                  <p className="text-xs text-slate-500">Milestone schedule for upcoming academic terms.</p>
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.importantDatesEnabled !== false}
                      onChange={(e) => handleFieldChange("importantDatesEnabled", e.target.checked)}
                      className="w-4 h-4 text-amber-500 accent-amber-500"
                    />
                    Enable Block
                  </label>

                  <button
                    type="button"
                    onClick={addImportantDate}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition"
                  >
                    <Plus size={14} /> Add Milestone Date
                  </button>
                </div>
              </div>

              {settings.importantDatesEnabled !== false && (
                <div className="space-y-3">
                  <div className="grid sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Section Badge</label>
                      <input
                        type="text"
                        value={settings.datesBadge || ""}
                        onChange={(e) => handleFieldChange("datesBadge", e.target.value)}
                        placeholder="Schedule"
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs outline-none focus:bg-white focus:border-amber-500"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">Section Title</label>
                      <input
                        type="text"
                        value={settings.datesTitle || ""}
                        onChange={(e) => handleFieldChange("datesTitle", e.target.value)}
                        placeholder="Important Dates & Deadlines"
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-bold outline-none focus:bg-white focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {/* Milestone Dates List */}
                  <div className="space-y-3 pt-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Milestones List ({(settings.importantDates || []).length})</p>
                    {(settings.importantDates || []).map((item, idx) => (
                      <div key={item.id || idx} className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-xs font-bold text-blue-950">Milestone #{idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => removeImportantDate(idx)}
                            className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition"
                            title="Delete Milestone"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        <div className="grid sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Event Title</label>
                            <input
                              type="text"
                              value={item.title || ""}
                              onChange={(e) => updateImportantDate(idx, "title", e.target.value)}
                              placeholder="e.g. Admissions Open"
                              className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs font-bold outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Date / Month</label>
                            <input
                              type="text"
                              value={item.date || ""}
                              onChange={(e) => updateImportantDate(idx, "date", e.target.value)}
                              placeholder="e.g. 2027-01-01 or May 2027"
                              className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-amber-800 text-xs font-bold outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Description</label>
                            <input
                              type="text"
                              value={item.desc || ""}
                              onChange={(e) => updateImportantDate(idx, "desc", e.target.value)}
                              placeholder="e.g. Online portal opens"
                              className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 10. CAMPUS FACILITIES */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm sm:text-base font-black text-blue-950 flex items-center gap-2">
                    <Building size={16} className="text-amber-500" /> 10. Campus Facilities Showcase
                  </h3>
                  <p className="text-xs text-slate-500">Manage highlights of school infrastructure on the admissions page.</p>
                </div>
                <button
                  type="button"
                  onClick={addFacility}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition"
                >
                  <Plus size={14} /> Add Facility Card
                </button>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Section Badge</label>
                  <input
                    type="text"
                    value={settings.facilitiesBadge || ""}
                    onChange={(e) => handleFieldChange("facilitiesBadge", e.target.value)}
                    placeholder="Campus Infrastructure"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs outline-none focus:bg-white focus:border-amber-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Section Title</label>
                  <input
                    type="text"
                    value={settings.facilitiesTitle || ""}
                    onChange={(e) => handleFieldChange("facilitiesTitle", e.target.value)}
                    placeholder="Facilities for Comprehensive Growth"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-bold outline-none focus:bg-white focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Facilities List */}
              <div className="space-y-3 pt-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Facilities List ({(settings.facilitiesList || []).length})</p>
                {(settings.facilitiesList || []).map((fac, idx) => (
                  <div key={fac.id || idx} className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-bold text-blue-950">Facility #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeFacility(idx)}
                        className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition"
                        title="Delete Facility"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Icon</label>
                        <select
                          value={fac.icon || "BookOpen"}
                          onChange={(e) => updateFacility(idx, "icon", e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs font-bold outline-none"
                        >
                          {ICON_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Facility Title</label>
                        <input
                          type="text"
                          value={fac.title || ""}
                          onChange={(e) => updateFacility(idx, "title", e.target.value)}
                          placeholder="e.g. Smart Classrooms"
                          className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs font-bold outline-none"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Description</label>
                        <input
                          type="text"
                          value={fac.desc || ""}
                          onChange={(e) => updateFacility(idx, "desc", e.target.value)}
                          placeholder="Interactive digital displays & multimedia learning."
                          className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 11. FREQUENTLY ASKED QUESTIONS (FAQS) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm sm:text-base font-black text-blue-950 flex items-center gap-2">
                    <HelpCircle size={16} className="text-amber-500" /> 11. Frequently Asked Questions (FAQs)
                  </h3>
                  <p className="text-xs text-slate-500">Add, edit, or delete questions and answers for prospective parents.</p>
                </div>
                <button
                  type="button"
                  onClick={addFaq}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition"
                >
                  <Plus size={14} /> Add FAQ
                </button>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Section Badge</label>
                  <input
                    type="text"
                    value={settings.faqsBadge || ""}
                    onChange={(e) => handleFieldChange("faqsBadge", e.target.value)}
                    placeholder="Parent Assistance"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs outline-none focus:bg-white focus:border-amber-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Section Title</label>
                  <input
                    type="text"
                    value={settings.faqsTitle || ""}
                    onChange={(e) => handleFieldChange("faqsTitle", e.target.value)}
                    placeholder="Frequently Asked Questions"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-bold outline-none focus:bg-white focus:border-amber-500"
                  />
                </div>
              </div>

              {/* FAQs List */}
              <div className="space-y-3 pt-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Questions ({(settings.faqs || []).length})</p>
                {(settings.faqs || []).map((faq, idx) => (
                  <div key={faq.id || idx} className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-bold text-blue-950">FAQ #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeFaq(idx)}
                        className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition"
                        title="Delete FAQ"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <input
                        type="text"
                        value={faq.question || ""}
                        onChange={(e) => updateFaq(idx, "question", e.target.value)}
                        placeholder="e.g. What is the admission procedure?"
                        className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs font-bold outline-none focus:border-amber-500"
                      />
                      <textarea
                        rows={2}
                        value={faq.answer || ""}
                        onChange={(e) => updateFaq(idx, "answer", e.target.value)}
                        placeholder="Detailed answer for parents..."
                        className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 12. CONTACT OFFICE & CTA SECTION */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm sm:text-base font-black text-blue-950 flex items-center gap-2 border-b border-slate-100 pb-3">
                <Phone size={16} className="text-amber-500" /> 12. Contact Office Details & Final Call To Action
              </h3>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Numbers</label>
                  <input
                    type="text"
                    value={settings.contactPhone || ""}
                    onChange={(e) => handleFieldChange("contactPhone", e.target.value)}
                    placeholder="+977 1-4567890 / +977 9851012345"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs outline-none focus:bg-white focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="text"
                    value={settings.contactEmail || ""}
                    onChange={(e) => handleFieldChange("contactEmail", e.target.value)}
                    placeholder="admissions@redroseschool.edu.np"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs outline-none focus:bg-white focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Office Hours</label>
                  <input
                    type="text"
                    value={settings.contactHours || ""}
                    onChange={(e) => handleFieldChange("contactHours", e.target.value)}
                    placeholder="Sun - Fri: 8:00 AM - 4:00 PM"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs outline-none focus:bg-white focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Campus Location</label>
                  <input
                    type="text"
                    value={settings.contactAddress || ""}
                    onChange={(e) => handleFieldChange("contactAddress", e.target.value)}
                    placeholder="Kathmandu, Nepal"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs outline-none focus:bg-white focus:border-amber-500"
                  />
                </div>

                <div className="sm:col-span-2 pt-2 border-t border-slate-100">
                  <p className="text-xs font-bold text-blue-950 mb-2">Bottom Call to Action Banner</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">CTA Heading</label>
                      <input
                        type="text"
                        value={settings.ctaTitle || ""}
                        onChange={(e) => handleFieldChange("ctaTitle", e.target.value)}
                        placeholder="Give Your Child the Gift of World-Class Education"
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-bold outline-none focus:bg-white focus:border-amber-500"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">CTA Description</label>
                      <textarea
                        rows={2}
                        value={settings.ctaDescription || ""}
                        onChange={(e) => handleFieldChange("ctaDescription", e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs outline-none focus:bg-white focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">CTA Button (When Open)</label>
                      <input
                        type="text"
                        value={settings.ctaButtonText || ""}
                        onChange={(e) => handleFieldChange("ctaButtonText", e.target.value)}
                        placeholder="Start Admission Inquiry Now"
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs outline-none focus:bg-white focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">CTA Button (When Closed)</label>
                      <input
                        type="text"
                        value={settings.ctaClosedButtonText || ""}
                        onChange={(e) => handleFieldChange("ctaClosedButtonText", e.target.value)}
                        placeholder="Contact Us for Future Cycles"
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs outline-none focus:bg-white focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* STICKY SAVE BAR */}
            <div className="sticky bottom-4 z-40 p-3.5 sm:p-4 rounded-2xl bg-white/95 border border-amber-300 backdrop-blur-md shadow-xl flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-slate-900">Save Changes to Public Admissions Portal</p>
                <p className="text-[11px] text-slate-500">All modifications update instantly on the live website and database.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("preview")}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition"
                >
                  Preview First
                </button>
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black text-xs shadow-md transition hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  <Save size={14} /> {saving ? "Saving Changes..." : "Save All Changes"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: LIVE PREVIEW ================= */}
        {activeTab === "preview" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm">
              <div>
                <h3 className="text-sm sm:text-base font-black text-slate-900">Live Admissions Page Preview</h3>
                <p className="text-xs text-slate-500">This interactive preview reflects your current in-editor changes in real-time.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("settings")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition"
                >
                  <Edit3 size={14} /> Back to Editor
                </button>
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-black text-xs hover:bg-amber-300 transition shadow-sm"
                >
                  <Save size={14} /> {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>

            {/* Embedded Live Preview Container */}
            <div className="rounded-2xl border border-slate-300 bg-white overflow-hidden shadow-xl">
              <AdmissionsPage previewData={settings} />
            </div>
          </div>
        )}

        {/* ================= TAB 3: INQUIRIES DESK ================= */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* Metric Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Total Inquiries</p>
                  <h3 className="text-2xl font-black text-slate-900">{analytics.total}</h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <Users size={18} />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Today's Received</p>
                  <h3 className="text-2xl font-black text-slate-900">{analytics.todayCount}</h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <Clock size={18} />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Converted</p>
                  <h3 className="text-2xl font-black text-emerald-600">{analytics.convertedCount}</h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <UserCheck size={18} />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Pending</p>
                  <h3 className="text-2xl font-black text-amber-600">{analytics.pendingCount}</h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <Filter size={18} />
                </div>
              </div>
            </div>

            {/* Inquiries Filter Bar */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-1 items-center gap-2 min-w-[240px]">
                <div className="relative flex-1">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by student, parent, ID or phone..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs outline-none focus:bg-white focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-bold outline-none focus:bg-white"
                >
                  <option value="All">All Statuses</option>
                  <option value="New">New</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Approved">Approved</option>
                  <option value="Converted">Converted</option>
                  <option value="Rejected">Rejected</option>
                </select>

                <select
                  value={classFilter}
                  onChange={(e) => setClassFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-bold outline-none focus:bg-white"
                >
                  <option value="All">All Classes</option>
                  <option value="Play Group">Play Group</option>
                  <option value="Nursery">Nursery</option>
                  <option value="LKG">LKG</option>
                  <option value="UKG">UKG</option>
                  {[...Array(10)].map((_, i) => (
                    <option key={i} value={`Grade ${i + 1}`}>Grade {i + 1}</option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 text-slate-700 border border-slate-300 text-xs font-bold hover:bg-slate-200 transition"
                >
                  <Download size={13} /> Export CSV
                </button>
              </div>
            </div>

            {/* Inquiries Table */}
            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-bold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">Inquiry ID</th>
                      <th className="px-4 py-3">Student Name</th>
                      <th className="px-4 py-3">Class</th>
                      <th className="px-4 py-3">Parent Info</th>
                      <th className="px-4 py-3">Location</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredInquiries.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                          No admission inquiries found matching your filters.
                        </td>
                      </tr>
                    ) : (
                      filteredInquiries.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/80 transition">
                          <td className="px-4 py-3 font-mono font-bold text-amber-700">
                            {item.inquiryId || item.id}
                          </td>
                          <td className="px-4 py-3 font-bold text-slate-900">
                            {item.studentName}
                            <span className="block text-[10px] text-slate-500 font-normal">
                              {item.gender} • {item.dob}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-semibold text-slate-700">
                            {item.applyingClass}
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-bold text-slate-900">{item.parentName}</span>
                            <span className="block text-[10px] text-slate-500">{item.mobile}</span>
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            {item.district || item.fullAddress || "N/A"}
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={item.status || "New"}
                              onChange={(e) => handleStatusChange(item.id, e.target.value)}
                              className="px-2 py-1 rounded-lg bg-slate-50 border border-slate-300 text-[11px] font-bold text-slate-900 outline-none"
                            >
                              <option value="New">New</option>
                              <option value="Follow-up">Follow-up</option>
                              <option value="Under Review">Under Review</option>
                              <option value="Approved">Approved</option>
                              <option value="Converted">Converted</option>
                              <option value="Rejected">Rejected</option>
                            </select>
                          </td>
                          <td className="px-4 py-3 text-right space-x-1.5">
                            <button
                              type="button"
                              onClick={() => setViewInquiry(item)}
                              className="p-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100"
                              title="View Details"
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteInquiry(item.id)}
                              className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100"
                              title="Delete Inquiry"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 4: DEMAND ANALYTICS ================= */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-lg font-black text-slate-900">Admission Demand & Conversion Analytics</h2>
              <p className="text-xs text-slate-500">Statistical breakdown of student application trends and conversion metrics.</p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              {/* Conversion Rate Card */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm text-center space-y-2">
                <TrendingUp size={32} className="text-emerald-600 mx-auto" />
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Conversion Rate</h3>
                <p className="text-3xl font-black text-slate-900">{analytics.conversionRate}%</p>
                <p className="text-[11px] text-slate-500">Inquiries converted to active enrolled students.</p>
              </div>

              {/* Gender Breakdown */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Gender Distribution</h3>
                <div className="space-y-2">
                  {Object.entries(analytics.genderBreakdown || {}).map(([g, count]) => {
                    const pct = analytics.total > 0 ? ((count / analytics.total) * 100).toFixed(0) : 0;
                    return (
                      <div key={g} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold text-slate-700">
                          <span>{g}</span>
                          <span>{count} ({pct}%)</span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Most Applied Class */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm text-center space-y-2">
                <GraduationCap size={32} className="text-amber-600 mx-auto" />
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Top Requested Class</h3>
                <p className="text-2xl font-black text-amber-700">{analytics.mostAppliedClass}</p>
                <p className="text-[11px] text-slate-500">Highest volume of student inquiries recorded.</p>
              </div>
            </div>

            {/* Class Breakdown Progress Bars */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Inquiries Volume by Class</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {Object.entries(analytics.classBreakdown || {}).map(([cls, count]) => {
                  const pct = analytics.total > 0 ? ((count / analytics.total) * 100).toFixed(0) : 0;
                  return (
                    <div key={cls} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-slate-800">
                        <span>{cls}</span>
                        <span className="text-amber-700">{count} Inquiries ({pct}%)</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full" style={{ width: `${pct}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ================= MODAL: VIEW INQUIRY DETAILS ================= */}
      <AnimatePresence>
        {viewInquiry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl p-5 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-xs font-mono font-bold text-amber-700">{viewInquiry.inquiryId || viewInquiry.id}</span>
                  <h3 className="text-lg font-black text-slate-900">{viewInquiry.studentName}</h3>
                </div>
                <button type="button" onClick={() => setViewInquiry(null)} className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600">
                  <X size={16} />
                </button>
              </div>

              {/* Student Info */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wider">Student Information</h4>
                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <p><span className="text-slate-500">Class:</span> <b className="text-slate-900">{viewInquiry.applyingClass}</b></p>
                  <p><span className="text-slate-500">Session:</span> <b className="text-slate-900">{viewInquiry.academicSession}</b></p>
                  <p><span className="text-slate-500">Date of Birth:</span> <b className="text-slate-900">{viewInquiry.dob || "N/A"}</b></p>
                  <p><span className="text-slate-500">Gender:</span> <b className="text-slate-900">{viewInquiry.gender || "N/A"}</b></p>
                  <p className="col-span-2"><span className="text-slate-500">Previous School:</span> <b className="text-slate-900">{viewInquiry.prevSchoolName || "None"}</b></p>
                </div>
              </div>

              {/* Parent Info */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wider">Parent / Guardian Information</h4>
                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <p><span className="text-slate-500">Parent:</span> <b className="text-slate-900">{viewInquiry.parentName} ({viewInquiry.relationship})</b></p>
                  <p><span className="text-slate-500">Mobile:</span> <b className="text-slate-900">{viewInquiry.mobile}</b></p>
                  <p><span className="text-slate-500">Email:</span> <b className="text-slate-900">{viewInquiry.email}</b></p>
                  <p><span className="text-slate-500">Alt Contact:</span> <b className="text-slate-900">{viewInquiry.altContact || "N/A"}</b></p>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wider">Address Details</h4>
                <div className="text-xs bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                  <p><span className="text-slate-500">Full Address:</span> <b className="text-slate-900">{viewInquiry.fullAddress}</b></p>
                  <p><span className="text-slate-500">District / Province:</span> <b className="text-slate-900">{viewInquiry.district}, {viewInquiry.province}</b></p>
                </div>
              </div>

              {/* Additional Facilities */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wider">Facilities Requested</h4>
                <div className="flex gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className={`px-2.5 py-1 rounded-full font-bold ${viewInquiry.transportRequired ? "bg-emerald-100 text-emerald-800 border border-emerald-300" : "bg-slate-200 text-slate-600"}`}>
                    Bus: {viewInquiry.transportRequired ? "Yes" : "No"}
                  </span>
                  <span className={`px-2.5 py-1 rounded-full font-bold ${viewInquiry.hostelRequired ? "bg-emerald-100 text-emerald-800 border border-emerald-300" : "bg-slate-200 text-slate-600"}`}>
                    Hostel: {viewInquiry.hostelRequired ? "Yes" : "No"}
                  </span>
                </div>
              </div>

              {viewInquiry.message && (
                <div className="space-y-1 text-xs">
                  <span className="text-slate-500 font-semibold">Parent Message:</span>
                  <p className="p-2.5 rounded-xl bg-slate-50 text-slate-800 border border-slate-200">{viewInquiry.message}</p>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setViewInquiry(null)}
                  className="px-4 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200"
                >
                  Close
                </button>
                {viewInquiry.status !== "Converted" && (
                  <button
                    type="button"
                    onClick={() => {
                      handleConvertToStudent(viewInquiry.id);
                      setViewInquiry(null);
                    }}
                    className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white font-black text-xs hover:bg-emerald-700 shadow-sm"
                  >
                    Convert to Active Student
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}