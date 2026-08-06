import { useEffect, useState } from "react";
import api from "../lib/api";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  Edit,
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
  X
} from "lucide-react";

export default function AdminAdmissions() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard"); // 'dashboard', 'settings', 'analytics'

  // Loading & notification states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Admission Settings State
  const [settings, setSettings] = useState({
    isOpen: true,
    academicSession: "2027–2028",
    startDate: "2027-01-01",
    endDate: "2027-04-30",
    heroBadgeText: "Admissions Open for 2027–2028",
    heroTitle: "Empowering Next Generation Leaders",
    heroDescription:
      "Join our vibrant learning community. We offer holistic education, state-of-the-art facilities, and an environment where every child excels.",
    countdownEnabled: true,
    applyButtonText: "Apply Now for Admission",
    prospectusUrl: "",
    feeStructureUrl: "",
    contactPhone: "+977 1-4567890 / +977 9851012345",
    contactEmail: "admissions@smritischool.edu.np",
    contactHours: "Sun - Fri: 8:00 AM - 4:00 PM",
    contactAddress: "Kathmandu, Nepal",
    eligibilityCriteria: [],
    requiredDocuments: [],
    faqs: []
  });

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

  // Selected Inquiry for Modal View/Edit
  const [viewInquiry, setViewInquiry] = useState(null);
  const [editInquiry, setEditInquiry] = useState(null);

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

      if (settingsRes.data?.data) setSettings(settingsRes.data.data);
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

  // Save Admission Settings
  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const res = await api.put("/api/admissions/settings", settings);
      if (res.data?.success) {
        showMessage("success", "Admission settings saved successfully!");
        fetchData();
      }
    } catch (err) {
      showMessage("error", err.response?.data?.message || "Failed to update settings.");
    } finally {
      setSaving(false);
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

  // Manage Dynamic Array Helper: Eligibility Criteria
  const addEligibility = () => {
    setSettings((prev) => ({
      ...prev,
      eligibilityCriteria: [
        ...(prev.eligibilityCriteria || []),
        { grade: "New Grade", age: "5+ years", requirements: "Pass entrance exam." }
      ]
    }));
  };

  const updateEligibility = (index, field, value) => {
    setSettings((prev) => {
      const updated = [...(prev.eligibilityCriteria || [])];
      updated[index][field] = value;
      return { ...prev, eligibilityCriteria: updated };
    });
  };

  const removeEligibility = (index) => {
    setSettings((prev) => ({
      ...prev,
      eligibilityCriteria: prev.eligibilityCriteria.filter((_, i) => i !== index)
    }));
  };

  // Manage Dynamic Array Helper: Documents
  const addDocument = () => {
    setSettings((prev) => ({
      ...prev,
      requiredDocuments: [
        ...(prev.requiredDocuments || []),
        { name: "Document Name", desc: "Document description", mandatory: true }
      ]
    }));
  };

  const updateDocument = (index, field, value) => {
    setSettings((prev) => {
      const updated = [...(prev.requiredDocuments || [])];
      updated[index][field] = value;
      return { ...prev, requiredDocuments: updated };
    });
  };

  const removeDocument = (index) => {
    setSettings((prev) => ({
      ...prev,
      requiredDocuments: prev.requiredDocuments.filter((_, i) => i !== index)
    }));
  };

  // Manage Dynamic Array Helper: FAQs
  const addFaq = () => {
    setSettings((prev) => ({
      ...prev,
      faqs: [
        ...(prev.faqs || []),
        { question: "New Frequently Asked Question?", answer: "Clear detailed answer here." }
      ]
    }));
  };

  const updateFaq = (index, field, value) => {
    setSettings((prev) => {
      const updated = [...(prev.faqs || [])];
      updated[index][field] = value;
      return { ...prev, faqs: updated };
    });
  };

  const removeFaq = (index) => {
    setSettings((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index)
    }));
  };

  // Manage Dynamic Array Helper: Important Dates
  const addImportantDate = () => {
    setSettings((prev) => ({
      ...prev,
      importantDates: [
        ...(prev.importantDates || []),
        { title: "New Milestone Event", date: "2027-05-01", desc: "Short description of milestone date." }
      ]
    }));
  };

  const updateImportantDate = (index, field, value) => {
    setSettings((prev) => {
      const updated = [...(prev.importantDates || [])];
      updated[index][field] = value;
      return { ...prev, importantDates: updated };
    });
  };

  const removeImportantDate = (index) => {
    setSettings((prev) => ({
      ...prev,
      importantDates: prev.importantDates.filter((_, i) => i !== index)
    }));
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
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-slate-400">Loading Admission Control Panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-30 bg-slate-900/90 border-b border-white/10 backdrop-blur-md px-4 sm:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-extrabold text-white tracking-tight">Admission Management Center</h1>
              <span
                className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                  settings.isOpen ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                }`}
              >
                {settings.isOpen ? "Admissions Open" : "Admissions Closed"}
              </span>
            </div>
            <p className="text-xs text-slate-400">Control real-world admission workflows, inquiries, settings & analytics.</p>
          </div>
        </div>

        {/* Tab Switcher & Quick Preview */}
        <div className="flex items-center gap-3">
          <a
            href="/admissions"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-300 hover:bg-amber-400/20 transition-colors text-xs font-bold flex items-center gap-2"
          >
            <Eye className="w-4 h-4" /> Live Website View
          </a>

          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-white/10">
            {[
              { id: "dashboard", label: "Inquiries Desk", icon: Users },
              { id: "settings", label: "Page Controls", icon: Settings },
              { id: "analytics", label: "Demand Analytics", icon: BarChart3 }
            ].map((tab) => {
              const TabIcon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    active ? "bg-amber-400 text-slate-950 shadow-md" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <TabIcon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Notifications */}
      {message.text && (
        <div
          className={`mx-4 sm:mx-8 mt-4 p-4 rounded-xl text-sm font-semibold border flex items-center justify-between ${
            message.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
              : "bg-rose-500/10 border-rose-500/20 text-rose-300"
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {message.text}
          </div>
          <button onClick={() => setMessage({ type: "", text: "" })}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ================= MAIN CONTENT ================= */}
      <main className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
        {/* ================= TAB 1: INQUIRIES DESK & TABLE ================= */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            {/* Metric Summary Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-6 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Inquiries</p>
                  <h3 className="text-3xl font-extrabold text-white">{analytics.total}</h3>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center font-bold">
                  <Users className="w-6 h-6" />
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Today's Received</p>
                  <h3 className="text-3xl font-extrabold text-white">{analytics.todayCount}</h3>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
                  <Clock className="w-6 h-6" />
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Converted Students</p>
                  <h3 className="text-3xl font-extrabold text-emerald-400">{analytics.convertedCount}</h3>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                  <UserCheck className="w-6 h-6" />
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Most Applied Class</p>
                  <h3 className="text-2xl font-extrabold text-amber-400">{analytics.mostAppliedClass}</h3>
                </div>
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
                  <GraduationCap className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Filter Controls & Export */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-1 flex-wrap items-center gap-3">
                {/* Search */}
                <div className="relative flex-1 min-w-[240px]">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search Student, Parent, ID or Phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs outline-none focus:border-amber-400"
                  />
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs outline-none focus:border-amber-400"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Approved">Approved</option>
                    <option value="Converted">Converted</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                {/* Class Filter */}
                <select
                  value={classFilter}
                  onChange={(e) => setClassFilter(e.target.value)}
                  className="px-3 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs outline-none focus:border-amber-400"
                >
                  <option value="All">All Classes</option>
                  {["Play Group", "Nursery", "LKG", "UKG", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9"].map(
                    (cls) => (
                      <option key={cls} value={cls}>{cls}</option>
                    )
                  )}
                </select>
              </div>

              <button
                onClick={handleExportCSV}
                className="px-4 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Export CSV
              </button>
            </div>

            {/* Inquiries Data Table */}
            <div className="rounded-2xl bg-slate-900 border border-white/10 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-950/80 border-b border-white/10 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      <th className="p-4">Inquiry ID</th>
                      <th className="p-4">Student & Class</th>
                      <th className="p-4">Parent Details</th>
                      <th className="p-4">Address / District</th>
                      <th className="p-4">Submission Date</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-xs text-slate-300">
                    {filteredInquiries.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-500">
                          No admission inquiries found.
                        </td>
                      </tr>
                    ) : (
                      filteredInquiries.map((item) => {
                        const statusColors = {
                          Pending: "bg-amber-500/20 text-amber-300 border-amber-500/30",
                          "Follow-up": "bg-blue-500/20 text-blue-300 border-blue-500/30",
                          Approved: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
                          Converted: "bg-purple-500/20 text-purple-300 border-purple-500/30",
                          Rejected: "bg-rose-500/20 text-rose-300 border-rose-500/30"
                        };

                        return (
                          <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="p-4 font-mono font-bold text-amber-400">{item.inquiryId || item.id}</td>
                            <td className="p-4">
                              <p className="font-bold text-white text-sm">{item.studentName}</p>
                              <span className="text-[10px] font-semibold text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                                {item.applyingClass}
                              </span>
                            </td>
                            <td className="p-4">
                              <p className="font-semibold text-slate-200">{item.parentName} ({item.relationship || "Parent"})</p>
                              <p className="text-slate-400 text-[11px]">{item.mobile} | {item.email}</p>
                            </td>
                            <td className="p-4 text-slate-300">
                              <p>{item.district || item.province || "N/A"}</p>
                              <p className="text-[10px] text-slate-500 truncate max-w-[150px]">{item.fullAddress}</p>
                            </td>
                            <td className="p-4 text-slate-400">
                              {new Date(item.createdAt).toLocaleDateString()}
                            </td>
                            <td className="p-4">
                              <select
                                value={item.status}
                                onChange={(e) => handleStatusChange(item.id, e.target.value)}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border outline-none cursor-pointer ${
                                  statusColors[item.status] || "bg-slate-800 text-slate-300 border-white/10"
                                }`}
                              >
                                <option value="Pending" className="bg-slate-900 text-amber-300">Pending</option>
                                <option value="Follow-up" className="bg-slate-900 text-blue-300">Follow-up</option>
                                <option value="Approved" className="bg-slate-900 text-emerald-300">Approved</option>
                                <option value="Converted" className="bg-slate-900 text-purple-300">Converted</option>
                                <option value="Rejected" className="bg-slate-900 text-rose-300">Rejected</option>
                              </select>
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => setViewInquiry(item)}
                                  title="View Details"
                                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
                                >
                                  <Eye className="w-4 h-4 text-amber-400" />
                                </button>

                                {item.status !== "Converted" && (
                                  <button
                                    onClick={() => handleConvertToStudent(item.id)}
                                    title="Convert to Student"
                                    className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-[11px] font-bold flex items-center gap-1 transition-colors"
                                  >
                                    <UserCheck className="w-3.5 h-3.5" /> Convert
                                  </button>
                                )}

                                <button
                                  onClick={() => handleDeleteInquiry(item.id)}
                                  title="Delete Inquiry"
                                  className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: PAGE CONTROLS & SETTINGS ================= */}
        {activeTab === "settings" && (
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="text-2xl font-extrabold text-white">Admission Page & System Controls</h2>
                <p className="text-xs text-slate-400">Manage admission dates, open/close state, hero banner, prospectus PDF, eligibility & FAQs.</p>
              </div>
              <button
                onClick={handleSaveSettings}
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-extrabold text-xs hover:bg-amber-300 transition-colors flex items-center gap-2 shadow-lg"
              >
                <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save All Changes"}
              </button>
            </div>

            {/* OPEN/CLOSE SWITCH & DATES */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-white/10 space-y-6">
              <h3 className="text-lg font-bold text-amber-400 flex items-center gap-2">
                <ToggleLeft className="w-5 h-5" /> 1. Admission Status & Cycle Dates
              </h3>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-4 rounded-xl bg-slate-950 border border-white/10 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-300">Admission Open/Closed</p>
                    <p className="text-[10px] text-slate-500">Toggle public application form</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSettings((prev) => ({ ...prev, isOpen: !prev.isOpen }))}
                    className={`text-2xl transition-colors ${settings.isOpen ? "text-emerald-400" : "text-slate-600"}`}
                  >
                    {settings.isOpen ? <ToggleRight className="w-10 h-10" /> : <ToggleLeft className="w-10 h-10" />}
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Academic Session</label>
                  <input
                    type="text"
                    value={settings.academicSession}
                    onChange={(e) => setSettings((prev) => ({ ...prev, academicSession: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={settings.startDate}
                    onChange={(e) => setSettings((prev) => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">End Date</label>
                  <input
                    type="date"
                    value={settings.endDate}
                    onChange={(e) => setSettings((prev) => ({ ...prev, endDate: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>

            {/* HERO BANNER & BUTTONS */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-white/10 space-y-6">
              <h3 className="text-lg font-bold text-amber-400 flex items-center gap-2">
                <Sparkles className="w-5 h-5" /> 2. Hero Banner & Action Controls
              </h3>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Hero Badge Text</label>
                  <input
                    type="text"
                    value={settings.heroBadgeText}
                    onChange={(e) => setSettings((prev) => ({ ...prev, heroBadgeText: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Apply Button Text</label>
                  <input
                    type="text"
                    value={settings.applyButtonText}
                    onChange={(e) => setSettings((prev) => ({ ...prev, applyButtonText: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs outline-none focus:border-amber-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Hero Title</label>
                  <input
                    type="text"
                    value={settings.heroTitle}
                    onChange={(e) => setSettings((prev) => ({ ...prev, heroTitle: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs outline-none focus:border-amber-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Hero Description</label>
                  <textarea
                    rows={2}
                    value={settings.heroDescription}
                    onChange={(e) => setSettings((prev) => ({ ...prev, heroDescription: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>

            {/* DOCUMENT UPLOADS */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-white/10 space-y-6">
              <h3 className="text-lg font-bold text-amber-400 flex items-center gap-2">
                <Upload className="w-5 h-5" /> 3. Prospectus & Fee Structure PDFs
              </h3>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="p-4 rounded-xl bg-slate-950 border border-white/10 space-y-3">
                  <p className="text-xs font-bold text-white">Prospectus PDF</p>
                  <p className="text-[11px] text-slate-400 truncate">{settings.prospectusUrl || "No file uploaded yet."}</p>
                  <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer hover:bg-amber-300 transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    {uploadingProspectus ? "Uploading..." : "Upload Prospectus PDF"}
                    <input type="file" accept="application/pdf" className="hidden" onChange={(e) => handleFileUpload(e, "prospectus")} />
                  </label>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-white/10 space-y-3">
                  <p className="text-xs font-bold text-white">Fee Structure PDF</p>
                  <p className="text-[11px] text-slate-400 truncate">{settings.feeStructureUrl || "No file uploaded yet."}</p>
                  <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer hover:bg-amber-300 transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    {uploadingFee ? "Uploading..." : "Upload Fee Structure PDF"}
                    <input type="file" accept="application/pdf" className="hidden" onChange={(e) => handleFileUpload(e, "feeStructure")} />
                  </label>
                </div>
              </div>
            </div>

            {/* DYNAMIC ELIGIBILITY CRITERIA */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-white/10 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-amber-400 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" /> 4. Manage Eligibility Criteria
                </h3>
                <button
                  type="button"
                  onClick={addEligibility}
                  className="px-3 py-1.5 rounded-lg bg-amber-400/10 text-amber-300 text-xs font-bold flex items-center gap-1 hover:bg-amber-400/20"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Grade Criteria
                </button>
              </div>

              <div className="space-y-4">
                {(settings.eligibilityCriteria || []).map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-white/10 grid sm:grid-cols-3 gap-3 items-center">
                    <input
                      type="text"
                      placeholder="Grade Level"
                      value={item.grade}
                      onChange={(e) => updateEligibility(idx, "grade", e.target.value)}
                      className="px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-white text-xs outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Age Limit"
                      value={item.age}
                      onChange={(e) => updateEligibility(idx, "age", e.target.value)}
                      className="px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-white text-xs outline-none"
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Requirements"
                        value={item.requirements}
                        onChange={(e) => updateEligibility(idx, "requirements", e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-white text-xs outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => removeEligibility(idx)}
                        className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* DYNAMIC FAQs */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-white/10 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-amber-400 flex items-center gap-2">
                  <FileText className="w-5 h-5" /> 5. Manage Admission FAQs
                </h3>
                <button
                  type="button"
                  onClick={addFaq}
                  className="px-3 py-1.5 rounded-lg bg-amber-400/10 text-amber-300 text-xs font-bold flex items-center gap-1 hover:bg-amber-400/20"
                >
                  <Plus className="w-3.5 h-3.5" /> Add FAQ
                </button>
              </div>

              <div className="space-y-4">
                {(settings.faqs || []).map((faq, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        placeholder="Question"
                        value={faq.question}
                        onChange={(e) => updateFaq(idx, "question", e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-white text-xs font-bold outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => removeFaq(idx)}
                        className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      placeholder="Answer"
                      value={faq.answer}
                      onChange={(e) => updateFaq(idx, "answer", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-white text-xs outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* DYNAMIC IMPORTANT DATES */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-white/10 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-amber-400 flex items-center gap-2">
                    <Calendar className="w-5 h-5" /> 6. Manage Important Dates & Deadlines Block
                  </h3>
                  <p className="text-xs text-slate-400">Add or remove key milestones. This block only shows on the website when dates are active.</p>
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      name="importantDatesEnabled"
                      checked={settings.importantDatesEnabled !== false}
                      onChange={handleSettingsChange}
                      className="w-4 h-4 text-amber-400 accent-amber-400"
                    />
                    Enable Block
                  </label>

                  <button
                    type="button"
                    onClick={addImportantDate}
                    className="px-3 py-1.5 rounded-lg bg-amber-400/10 text-amber-300 text-xs font-bold flex items-center gap-1 hover:bg-amber-400/20"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Milestone Date
                  </button>
                </div>
              </div>

              {settings.importantDatesEnabled !== false && (
                <div className="space-y-4">
                  {(!settings.importantDates || settings.importantDates.length === 0) ? (
                    <div className="p-6 text-center text-xs text-slate-500 rounded-xl bg-slate-950 border border-white/5">
                      No milestone dates added. The Important Dates block will be hidden on the website.
                    </div>
                  ) : (
                    (settings.importantDates || []).map((item, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-white/10 space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <input
                            type="text"
                            placeholder="Milestone Title (e.g. Admissions Open)"
                            value={item.title}
                            onChange={(e) => updateImportantDate(idx, "title", e.target.value)}
                            className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-white text-xs font-bold outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => removeImportantDate(idx)}
                            className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Date / Schedule (e.g. 2027-01-01 or May 2027)"
                            value={item.date}
                            onChange={(e) => updateImportantDate(idx, "date", e.target.value)}
                            className="px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-amber-400 text-xs font-semibold outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Description"
                            value={item.desc}
                            onChange={(e) => updateImportantDate(idx, "desc", e.target.value)}
                            className="px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-white text-xs outline-none"
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Sticky Save All Bar */}
            <div className="sticky bottom-6 z-30 p-4 rounded-2xl bg-slate-900/95 border border-amber-400/30 backdrop-blur-md shadow-2xl flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white">Unsaved Changes in Admission Page Controls?</p>
                <p className="text-[11px] text-slate-400">Click save to update the live public website and backend database.</p>
              </div>
              <button
                onClick={handleSaveSettings}
                disabled={saving}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 font-extrabold text-xs hover:shadow-lg hover:shadow-amber-500/25 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" /> {saving ? "Saving Changes..." : "Save All Admission Settings"}
              </button>
            </div>
          </div>
        )}

        {/* ================= TAB 3: DEMAND ANALYTICS ================= */}
        {activeTab === "analytics" && (
          <div className="space-y-8">
            <div className="border-b border-white/10 pb-4">
              <h2 className="text-2xl font-extrabold text-white">Admission Demand & Conversion Analytics</h2>
              <p className="text-xs text-slate-400">Statistical breakdown of student application trends, conversion rates & demographics.</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Conversion Rate Card */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-white/10 text-center space-y-3">
                <TrendingUp className="w-10 h-10 text-emerald-400 mx-auto" />
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Admission Conversion Rate</h3>
                <p className="text-4xl font-extrabold text-white">{analytics.conversionRate}%</p>
                <p className="text-xs text-slate-500">Ratio of total inquiries converted to active students.</p>
              </div>

              {/* Gender Breakdown */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-white/10 space-y-4">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Gender Distribution</h3>
                <div className="space-y-2">
                  {Object.entries(analytics.genderBreakdown || {}).map(([g, count]) => {
                    const pct = analytics.total > 0 ? ((count / analytics.total) * 100).toFixed(0) : 0;
                    return (
                      <div key={g} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold text-slate-300">
                          <span>{g}</span>
                          <span>{count} ({pct}%)</span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-950 overflow-hidden">
                          <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Most Applied Class */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-white/10 text-center space-y-3">
                <GraduationCap className="w-10 h-10 text-amber-400 mx-auto" />
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Top Requested Class</h3>
                <p className="text-3xl font-extrabold text-amber-400">{analytics.mostAppliedClass}</p>
                <p className="text-xs text-slate-500">Highest volume of student inquiries recorded.</p>
              </div>
            </div>

            {/* Class Breakdown Progress Bars */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-white/10 space-y-6">
              <h3 className="text-lg font-bold text-white">Inquiries Volume by Class</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {Object.entries(analytics.classBreakdown || {}).map(([cls, count]) => {
                  const pct = analytics.total > 0 ? ((count / analytics.total) * 100).toFixed(0) : 0;
                  return (
                    <div key={cls} className="p-4 rounded-xl bg-slate-950 border border-white/5 space-y-2">
                      <div className="flex justify-between text-xs font-bold text-white">
                        <span>{cls}</span>
                        <span className="text-amber-400">{count} Inquiries ({pct}%)</span>
                      </div>
                      <div className="h-2.5 rounded-full bg-slate-900 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full" style={{ width: `${pct}%` }}></div>
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-slate-900 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-xs font-mono font-bold text-amber-400">{viewInquiry.inquiryId || viewInquiry.id}</span>
                  <h3 className="text-xl font-extrabold text-white">{viewInquiry.studentName}</h3>
                </div>
                <button onClick={() => setViewInquiry(null)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Student Info */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Student Information</h4>
                <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950 p-4 rounded-xl border border-white/5">
                  <p><span className="text-slate-400">Applying Class:</span> <b className="text-white">{viewInquiry.applyingClass}</b></p>
                  <p><span className="text-slate-400">Academic Session:</span> <b className="text-white">{viewInquiry.academicSession}</b></p>
                  <p><span className="text-slate-400">Date of Birth:</span> <b className="text-white">{viewInquiry.dob || "N/A"}</b></p>
                  <p><span className="text-slate-400">Gender:</span> <b className="text-white">{viewInquiry.gender || "N/A"}</b></p>
                  <p className="col-span-2"><span className="text-slate-400">Previous School:</span> <b className="text-white">{viewInquiry.prevSchoolName || "None"}</b></p>
                </div>
              </div>

              {/* Parent Info */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Parent / Guardian Information</h4>
                <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950 p-4 rounded-xl border border-white/5">
                  <p><span className="text-slate-400">Parent Name:</span> <b className="text-white">{viewInquiry.parentName} ({viewInquiry.relationship})</b></p>
                  <p><span className="text-slate-400">Mobile Number:</span> <b className="text-white">{viewInquiry.mobile}</b></p>
                  <p><span className="text-slate-400">Email Address:</span> <b className="text-white">{viewInquiry.email}</b></p>
                  <p><span className="text-slate-400">Alt Contact:</span> <b className="text-white">{viewInquiry.altContact || "N/A"}</b></p>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Address Details</h4>
                <div className="text-xs bg-slate-950 p-4 rounded-xl border border-white/5 space-y-1">
                  <p><span className="text-slate-400">Full Address:</span> <b className="text-white">{viewInquiry.fullAddress}</b></p>
                  <p><span className="text-slate-400">District / Province:</span> <b className="text-white">{viewInquiry.district}, {viewInquiry.province}</b></p>
                </div>
              </div>

              {/* Additional Notes */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Additional Facilities</h4>
                <div className="flex gap-4 text-xs bg-slate-950 p-4 rounded-xl border border-white/5">
                  <span className={`px-3 py-1 rounded-full font-bold ${viewInquiry.transportRequired ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-800 text-slate-500"}`}>
                    Bus Transport: {viewInquiry.transportRequired ? "Yes" : "No"}
                  </span>
                  <span className={`px-3 py-1 rounded-full font-bold ${viewInquiry.hostelRequired ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-800 text-slate-500"}`}>
                    Hostel Required: {viewInquiry.hostelRequired ? "Yes" : "No"}
                  </span>
                </div>
              </div>

              {viewInquiry.message && (
                <div className="space-y-1 text-xs">
                  <span className="text-slate-400 font-semibold">Additional Parent Message:</span>
                  <p className="p-3 rounded-xl bg-slate-950 text-slate-200 border border-white/5">{viewInquiry.message}</p>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  onClick={() => setViewInquiry(null)}
                  className="px-5 py-2 rounded-xl bg-white/10 text-white font-bold text-xs hover:bg-white/20"
                >
                  Close
                </button>
                {viewInquiry.status !== "Converted" && (
                  <button
                    onClick={() => {
                      handleConvertToStudent(viewInquiry.id);
                      setViewInquiry(null);
                    }}
                    className="px-5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-extrabold text-xs hover:bg-emerald-400"
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