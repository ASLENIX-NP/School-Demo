import { useEffect, useState } from "react";
const API_URL = import.meta.env.VITE_API_URL;
import {
  User,
  Shield,
  Mail,
  Lock,
  Camera,
  Save,
  CheckCircle2,
  AlertCircle,
  Clock,
  Check,
  X,
  Sliders,
  Bell,
  Monitor,
  Building2,
  Pencil,
  Zap,
  Smartphone,
  Laptop,
  Globe,
  Settings as SettingsIcon,
  ChevronDown,
  Image as ImageIcon,
} from "lucide-react";

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    admin_name: "Admin",
    admin_email: "",
    username: "admin",
    role: "Administrator",
    profile_photo: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  // Institution Form State
  const [institutionName, setInstitutionName] = useState("Red Rose Secondary English Boarding School");
  const [campusLocation, setCampusLocation] = useState("Basudev Marga, Hetauda-2, Makwanpur");
  const [academicSession, setAcademicSession] = useState("2081 / 2082 B.S.");
  const [timezone, setTimezone] = useState("Asia/Kathmandu (UTC +05:45)");
  const [isEditingInfo, setIsEditingInfo] = useState(false);

  // States mapping to backend database columns
  const [lockAccount, setLockAccount] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [maxAttempts, setMaxAttempts] = useState("5");
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [activity, setActivity] = useState([]);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // Additional ERP Preferences (Client-side)
  const [emailAlertsLogin, setEmailAlertsLogin] = useState(true);
  const [admissionAlerts, setAdmissionAlerts] = useState(true);
  const [noticeAlerts, setNoticeAlerts] = useState(true);
  const [themeMode, setThemeMode] = useState("light");
  const [compactDensity, setCompactDensity] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin-settings`);
      const result = await res.json();

      if (result.data) {
        setSettings((prev) => ({ ...prev, ...result.data }));
        if (result.data.school_name || result.data.institution_name) {
          setInstitutionName(result.data.school_name || result.data.institution_name);
        }
        if (result.data.campus_location || result.data.address) {
          setCampusLocation(result.data.campus_location || result.data.address);
        }
        if (result.data.academic_session) {
          setAcademicSession(result.data.academic_session);
        }
        if (result.data.timezone) {
          setTimezone(result.data.timezone);
        }
      }
      const loginRes = await fetch(
        `${API_URL}/api/admin-settings/login-activity`
      );

      const loginData = await loginRes.json();

      if (loginData.success) {
        setActivity(loginData.data || []);
      }

      if (result.data) {
        setLockAccount(Boolean(result.data.lock_account));
        setTwoFactor(Boolean(result.data.two_factor));
        setSessionTimeout(String(result.data.session_timeout || "30"));
        setMaxAttempts(String(result.data.max_login_attempts || "5"));
      }
    } catch (err) {
      console.error("Fetch settings error:", err);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = "success") => {
    setNotification({
      show: true,
      message,
      type,
    });

    setTimeout(() => {
      setNotification((prev) => ({
        ...prev,
        show: false,
      }));
    }, 3500);
  };

  const handleProfileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(
        `${API_URL}/api/admin-settings/upload-photo`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (data.success) {
        await fetchSettings();
        showNotification("Profile photo updated successfully");
      } else {
        showNotification(data.message || "Failed to upload photo", "error");
      }
    } catch (err) {
      console.error("Upload error:", err);
      showNotification("An error occurred during upload.", "error");
    }
  };

  const handleSaveChanges = async () => {
    const payload = {
      school_name: institutionName,
      institution_name: institutionName,
      campus_location: campusLocation,
      address: campusLocation,
      academic_session: academicSession,
      timezone: timezone,
      session_timeout: Number(sessionTimeout),
      max_login_attempts: Number(maxAttempts),
      two_factor: twoFactor,
      lock_account: lockAccount,
    };

    try {
      setSaving(true);

      const res = await fetch(`${API_URL}/api/admin-settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        await fetchSettings();
        setIsEditingInfo(false);
        showNotification("Settings saved successfully");
        setSaved(true);
        setTimeout(() => {
          setSaved(false);
        }, 3000);
      } else {
        showNotification("Failed to save settings", "error");
      }
    } catch (err) {
      console.error("Error saving settings:", err);
      showNotification("An error occurred while saving.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateEmail = async () => {
    if (!newEmail.trim()) {
      showNotification("Please enter a valid email address.", "error");
      return;
    }

    try {
      const res = await fetch(
        `${API_URL}/api/admin-settings/email`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: newEmail.trim(),
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        showNotification("Email updated successfully");
        setSettings((prev) => ({
          ...prev,
          admin_email: newEmail.trim(),
        }));
        setShowEmailModal(false);
      } else {
        showNotification(data.message || "Failed to update email", "error");
      }
    } catch (error) {
      console.error("Update email error:", error);
      showNotification("Error updating email.", "error");
    }
  };

  const handlePasswordChange = async () => {
    if (!currentPassword) {
      showNotification("Current password is required", "error");
      return;
    }
    if (newPassword.length < 6) {
      showNotification("New password must be at least 6 characters", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      showNotification("Passwords do not match", "error");
      return;
    }

    try {
      const res = await fetch(
        `${API_URL}/api/admin-settings/change-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        showNotification("Password updated successfully");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setShowPasswordModal(false);
      } else {
        showNotification(data.message || "Could not update password.", "error");
      }
    } catch (err) {
      console.error("Change password error:", err);
      showNotification("Error updating password.", "error");
    }
  };

  const navItems = [
    { id: "general", label: "General", icon: Sliders },
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "appearance", label: "Appearance", icon: Monitor },
  ];

  // Helper for safe date parsing
  const formatTime = (timeStr) => {
    if (!timeStr) return "Recent";
    const d = new Date(timeStr);
    return isNaN(d.getTime()) ? "Recent" : d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  if (loading) {
    return (
      <div className="w-full min-h-[420px] flex items-center justify-center p-8 bg-[#F3F5F9] rounded-3xl">
        <div className="flex items-center gap-2.5 text-slate-500 font-medium text-xs">
          <div className="w-4 h-4 border-2 border-slate-300 border-t-[#4B2E83] rounded-full animate-spin" />
          Loading settings...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#F3F5F9] text-[#0F172A] rounded-3xl p-5 sm:p-7 md:p-8 space-y-6 shadow-sm border border-slate-200/70 font-sans">
      {/* ─── 1. TOP HEADER (EXACT MOCKUP) ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#EDE9FE] text-[#5B21B6] flex items-center justify-center shrink-0 shadow-xs">
            <SettingsIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-[26px] font-black text-[#0F172A] tracking-tight">Settings</h1>
            <p className="text-xs sm:text-sm font-medium text-[#64748B] mt-0.5">
              Manage your administrator account and system preferences.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSaveChanges}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#4B2E83] hover:bg-[#3D256B] active:bg-[#321E57] text-white shadow-sm disabled:opacity-60 transition-all cursor-pointer shrink-0"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </>
          ) : saved ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              Saved ✓
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </div>

      {/* ─── 2. MAIN 3-COLUMN GRID LAYOUT (MATCHING MOCKUP) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* ── LEFT COLUMN: SIDEBAR NAVIGATION (Col span: 2.5) ── */}
        <div className="lg:col-span-3 xl:col-span-2">
          <nav className="bg-white rounded-2xl p-2.5 border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex lg:flex-col gap-1.5 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs sm:text-sm font-medium transition-all text-left whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "bg-[#F3E8FF] text-[#581C87] font-bold shadow-xs"
                      : "text-[#475569] hover:bg-slate-50 hover:text-[#0F172A]"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#581C87]" : "text-slate-500"}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* ── MIDDLE COLUMN: INSTITUTION & SECURITY CARDS (Col span: 6.5) ── */}
        <div className="lg:col-span-5 xl:col-span-6 space-y-5">
          {/* TAB: GENERAL (MATCHING MOCKUP EXACTLY) */}
          {activeTab === "general" && (
            <>
              {/* CARD 1: INSTITUTION INFORMATION */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)] space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#EDE9FE] text-[#5B21B6] flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-sm sm:text-base font-bold text-[#0F172A]">Institution Information</h2>
                      <p className="text-xs text-[#64748B]">Update school details and system information.</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsEditingInfo(!isEditingInfo)}
                    className="w-8 h-8 rounded-lg bg-[#F8FAFC] hover:bg-slate-100 border border-[#E2E8F0] text-[#64748B] flex items-center justify-center transition-colors cursor-pointer"
                    title="Edit Information"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Institution Name */}
                  <div>
                    <label className="block text-xs font-semibold text-[#334155] mb-1.5">
                      Institution Name
                    </label>
                    <input
                      type="text"
                      disabled={!isEditingInfo}
                      value={institutionName}
                      onChange={(e) => setInstitutionName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E2E8F0] bg-white text-[#0F172A] font-medium disabled:bg-[#F8FAFC] disabled:text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#DDD6FE] focus:border-[#7C3AED] transition"
                    />
                  </div>

                  {/* 2-col: Campus Location & Academic Session */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#334155] mb-1.5">
                        Campus Location
                      </label>
                      <input
                        type="text"
                        disabled={!isEditingInfo}
                        value={campusLocation}
                        onChange={(e) => setCampusLocation(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E2E8F0] bg-white text-[#0F172A] font-medium disabled:bg-[#F8FAFC] disabled:text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#DDD6FE] focus:border-[#7C3AED] transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#334155] mb-1.5">
                        Current Academic Session
                      </label>
                      <div className="relative">
                        <select
                          disabled={!isEditingInfo}
                          value={academicSession}
                          onChange={(e) => setAcademicSession(e.target.value)}
                          className="w-full appearance-none px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E2E8F0] bg-white text-[#0F172A] font-medium disabled:bg-[#F8FAFC] disabled:text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#DDD6FE] focus:border-[#7C3AED] transition pr-9"
                        >
                          <option value="2081 / 2082 B.S.">2081 / 2082 B.S.</option>
                          <option value="2082 / 2083 B.S.">2082 / 2083 B.S.</option>
                          <option value="2080 / 2081 B.S.">2080 / 2081 B.S.</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* 2-col: System Timezone & Portal Version */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#334155] mb-1.5">
                        System Timezone
                      </label>
                      <div className="relative">
                        <select
                          disabled={!isEditingInfo}
                          value={timezone}
                          onChange={(e) => setTimezone(e.target.value)}
                          className="w-full appearance-none px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E2E8F0] bg-white text-[#0F172A] font-medium disabled:bg-[#F8FAFC] disabled:text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#DDD6FE] focus:border-[#7C3AED] transition pr-9"
                        >
                          <option value="Asia/Kathmandu (UTC +05:45)">Asia/Kathmandu (UTC +05:45)</option>
                          <option value="Asia/Kolkata (UTC +05:30)">Asia/Kolkata (UTC +05:30)</option>
                          <option value="UTC (UTC +00:00)">UTC (UTC +00:00)</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#334155] mb-1.5">
                        Portal Version
                      </label>
                      <div className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-[#475569] font-mono flex items-center">
                        v2.4.0-stable
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 2: SECURITY SETTINGS */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)] space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#EDE9FE] text-[#5B21B6] flex items-center justify-center shrink-0">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-bold text-[#0F172A]">Security Settings</h2>
                    <p className="text-xs text-[#64748B]">Configure global platform security rules.</p>
                  </div>
                </div>

                <div className="space-y-4 divide-y divide-slate-100">
                  {/* Session Timeout */}
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-[#475569] shrink-0" />
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-[#0F172A]">Session Timeout</div>
                        <div className="text-[11px] sm:text-xs text-[#64748B]">Auto logout after inactivity</div>
                      </div>
                    </div>
                    <div className="relative w-full sm:w-40">
                      <select
                        value={sessionTimeout}
                        onChange={(e) => setSessionTimeout(e.target.value)}
                        className="w-full appearance-none px-3 py-2 text-xs font-semibold rounded-xl border border-[#E2E8F0] bg-white text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#DDD6FE] focus:border-[#7C3AED] pr-8"
                      >
                        <option value="30">30 Minutes</option>
                        <option value="60">60 Minutes</option>
                        <option value="120">120 Minutes</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Maximum Login Attempts */}
                  <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Shield className="w-4 h-4 text-[#475569] shrink-0" />
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-[#0F172A]">Maximum Login Attempts</div>
                        <div className="text-[11px] sm:text-xs text-[#64748B]">Lock account after failed attempts</div>
                      </div>
                    </div>
                    <div className="relative w-full sm:w-40">
                      <select
                        value={maxAttempts}
                        onChange={(e) => setMaxAttempts(e.target.value)}
                        className="w-full appearance-none px-3 py-2 text-xs font-semibold rounded-xl border border-[#E2E8F0] bg-white text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#DDD6FE] focus:border-[#7C3AED] pr-8"
                      >
                        <option value="5">5 Attempts</option>
                        <option value="10">10 Attempts</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Lock Account Toggle */}
                  <div className="pt-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Lock className="w-4 h-4 text-[#475569] shrink-0" />
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-[#0F172A]">Lock Account After Failed Attempts</div>
                        <div className="text-[11px] sm:text-xs text-[#64748B]">Prevent brute force login attempts</div>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={lockAccount}
                        onChange={(e) => setLockAccount(e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4B2E83]"></div>
                    </label>
                  </div>

                  {/* Two Factor Authentication Toggle */}
                  <div className="pt-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-4 h-4 text-[#475569] shrink-0" />
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-[#0F172A]">Two Factor Authentication</div>
                        <div className="text-[11px] sm:text-xs text-[#64748B]">Add an extra layer of security</div>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={twoFactor}
                        onChange={(e) => setTwoFactor(e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4B2E83]"></div>
                    </label>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TAB: PROFILE */}
          {activeTab === "profile" && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)] space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EDE9FE] text-[#5B21B6] flex items-center justify-center shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-[#0F172A]">Administrator Profile</h2>
                  <p className="text-xs text-[#64748B]">Manage account information, contact email, and credentials.</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-[#F8FAFC] rounded-2xl border border-slate-200/80">
                <img
                  src={settings?.profile_photo || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120"}
                  alt="Admin"
                  className="w-14 h-14 rounded-2xl object-cover border border-white shadow-xs"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-[#0F172A] truncate">{settings?.admin_name || "Admin"}</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0]">Active</span>
                  </div>
                  <p className="text-xs text-[#475569] truncate">{settings?.admin_email || "admin@redroseschool.edu.np"}</p>
                  <p className="text-[11px] text-slate-400">@{settings?.username || "admin"} • {settings?.role || "Administrator"}</p>
                </div>
              </div>

              <div className="space-y-4 divide-y divide-slate-100">
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-[#0F172A]">Administrator Email</h4>
                    <p className="text-xs text-[#64748B]">{settings?.admin_email || "admin@redroseschool.edu.np"}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setNewEmail(settings?.admin_email || "");
                      setShowEmailModal(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-[#1E293B] hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    Change Email
                  </button>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-[#0F172A]">Password</h4>
                    <p className="text-xs text-[#64748B]">Secure administrator portal login password.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-[#1E293B] hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5 text-slate-500" />
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: SECURITY TAB */}
          {activeTab === "security" && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)] space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EDE9FE] text-[#5B21B6] flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-[#0F172A]">Platform Security Policy</h2>
                  <p className="text-xs text-[#64748B]">Adjust authentication limits and login protections.</p>
                </div>
              </div>

              <div className="space-y-4 divide-y divide-slate-100">
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-[#0F172A]">Session Inactivity Timeout</div>
                    <div className="text-xs text-[#64748B]">Automatically logout after idle duration</div>
                  </div>
                  <select
                    value={sessionTimeout}
                    onChange={(e) => setSessionTimeout(e.target.value)}
                    className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-[#0F172A]"
                  >
                    <option value="30">30 Minutes</option>
                    <option value="60">60 Minutes</option>
                    <option value="120">120 Minutes</option>
                  </select>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-[#0F172A]">Maximum Failed Login Attempts</div>
                    <div className="text-xs text-[#64748B]">Lock account threshold</div>
                  </div>
                  <select
                    value={maxAttempts}
                    onChange={(e) => setMaxAttempts(e.target.value)}
                    className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-[#0F172A]"
                  >
                    <option value="5">5 Attempts</option>
                    <option value="10">10 Attempts</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB: NOTIFICATIONS */}
          {activeTab === "notifications" && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)] space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EDE9FE] text-[#5B21B6] flex items-center justify-center shrink-0">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-[#0F172A]">Notification Alerts</h2>
                  <p className="text-xs text-[#64748B]">Configure email and internal system alerts.</p>
                </div>
              </div>

              <div className="space-y-4 divide-y divide-slate-100">
                <div className="pt-2 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-[#0F172A]">Login Security Alerts</div>
                    <div className="text-xs text-[#64748B]">Alert on new device or location sign-ins</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={emailAlertsLogin}
                      onChange={(e) => setEmailAlertsLogin(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4B2E83]"></div>
                  </label>
                </div>

                <div className="pt-4 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-[#0F172A]">Admission Form Inquiries</div>
                    <div className="text-xs text-[#64748B]">Notify admin on new parent inquiry submission</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={admissionAlerts}
                      onChange={(e) => setAdmissionAlerts(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4B2E83]"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB: APPEARANCE */}
          {activeTab === "appearance" && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)] space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EDE9FE] text-[#5B21B6] flex items-center justify-center shrink-0">
                  <Monitor className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-[#0F172A]">Appearance & Theme</h2>
                  <p className="text-xs text-[#64748B]">Customize the dashboard workspace visual appearance.</p>
                </div>
              </div>

              <div className="space-y-4 divide-y divide-slate-100">
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-[#0F172A]">Color Theme</div>
                    <div className="text-xs text-[#64748B]">Select dashboard theme preference</div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setThemeMode("light")}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold border transition ${
                        themeMode === "light"
                          ? "bg-purple-50 text-[#4B2E83] border-purple-200"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      Light (Default)
                    </button>
                    <button
                      type="button"
                      onClick={() => setThemeMode("system")}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold border transition ${
                        themeMode === "system"
                          ? "bg-purple-50 text-[#4B2E83] border-purple-200"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      Match System
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT COLUMN: QUICK ACTIONS & RECENT ACTIVITY (Col span: 4) ── */}
        <div className="lg:col-span-4 space-y-5">
          {/* QUICK ACTIONS CARD */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)] space-y-3.5">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#4B2E83]" />
              <h3 className="text-sm font-bold text-[#0F172A]">Quick Actions</h3>
            </div>

            <div className="space-y-2.5">
              {/* Change Password */}
              <button
                type="button"
                onClick={() => setShowPasswordModal(true)}
                className="w-full py-2.5 px-4 rounded-xl bg-[#4B2E83] hover:bg-[#3D256B] text-white flex items-center justify-center gap-2 text-xs font-bold shadow-xs transition-all cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                Change Password
              </button>

              {/* Change Email */}
              <button
                type="button"
                onClick={() => {
                  setNewEmail(settings?.admin_email || "");
                  setShowEmailModal(true);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-50 border border-[#E2E8F0] text-[#1E293B] flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5 text-slate-600" />
                Change Email
              </button>

              {/* Update Profile Photo */}
              <input
                id="rightProfilePhotoInput"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfileUpload}
              />
              <button
                type="button"
                onClick={() => document.getElementById("rightProfilePhotoInput")?.click()}
                className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-50 border border-[#E2E8F0] text-[#1E293B] flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer"
              >
                <ImageIcon className="w-3.5 h-3.5 text-slate-600" />
                Update Profile Photo
              </button>
            </div>
          </div>

          {/* RECENT LOGIN ACTIVITY CARD */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)] space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#4B2E83]" />
                <h3 className="text-xs font-bold text-[#0F172A]">Recent Login Activity</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowActivityModal(true)}
                className="text-[11px] font-bold text-[#5B21B6] hover:underline cursor-pointer"
              >
                View All
              </button>
            </div>

            <div className="space-y-2.5">
              {activity.length === 0 ? (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-[#F8FAFC]">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <Laptop className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-[#0F172A] truncate">Chrome / Windows 11</div>
                        <div className="text-[10px] text-[#64748B]">Itahari, Nepal • Recent</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0] shrink-0">
                      Active Session
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-[#F8FAFC]">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                        <Smartphone className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-[#0F172A] truncate">Safari / iPhone 16</div>
                        <div className="text-[10px] text-[#64748B]">Kathmandu, Nepal • Recent</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0] shrink-0">
                      Successful
                    </span>
                  </div>
                </div>
              ) : (
                activity.slice(0, 3).map((item, idx) => (
                  <div key={item.id || idx} className="flex items-center justify-between gap-2 p-2 rounded-xl bg-[#F8FAFC]">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-[#EDE9FE] text-[#5B21B6] flex items-center justify-center shrink-0">
                        {item.device?.toLowerCase().includes("mobile") || item.device?.toLowerCase().includes("phone") ? (
                          <Smartphone className="w-4 h-4" />
                        ) : (
                          <Laptop className="w-4 h-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-[#0F172A] truncate">{item.browser || "Browser"} / {item.device || "Device"}</div>
                        <div className="text-[10px] text-[#64748B] truncate">{item.location || "Nepal"} • {formatTime(item.login_time)}</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0] shrink-0">
                      {item.status || "Successful"}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ─── FOOTER (MATCHING MOCKUP) ─── */}
      <div className="pt-6 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-medium text-[#64748B]">
        <div>© 2026 Red Rose Secondary English Boarding School. All rights reserved.</div>
        <div className="flex items-center gap-4">
          <span className="hover:text-[#0F172A] transition-colors cursor-pointer">Privacy</span>
          <span>|</span>
          <span className="hover:text-[#0F172A] transition-colors cursor-pointer">Terms</span>
          <span>|</span>
          <span className="hover:text-[#0F172A] transition-colors cursor-pointer">Support</span>
        </div>
      </div>

      {/* ─── MODALS ─── */}

      {/* CHANGE EMAIL MODAL */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-[#0F172A]">Change Administrator Email</h3>
              <button
                type="button"
                onClick={() => setShowEmailModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label htmlFor="modalEmailInput" className="block text-xs font-semibold text-[#334155] mb-1.5">
                New Email Address
              </label>
              <input
                id="modalEmailInput"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="admin@redroseschool.edu.np"
                className="w-full px-3.5 py-2.5 border border-[#E2E8F0] rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#DDD6FE] focus:border-[#7C3AED]"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowEmailModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-[#E2E8F0] rounded-xl hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpdateEmail}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#4B2E83] hover:bg-[#3D256B] rounded-xl shadow-xs cursor-pointer"
              >
                Update Email
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CHANGE PASSWORD MODAL */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-[#0F172A]">Change Password</h3>
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1">Current Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-[#E2E8F0] rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#DDD6FE] focus:border-[#7C3AED]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1">New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-[#E2E8F0] rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#DDD6FE] focus:border-[#7C3AED]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-[#E2E8F0] rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#DDD6FE] focus:border-[#7C3AED]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-[#E2E8F0] rounded-xl hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePasswordChange}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#4B2E83] hover:bg-[#3D256B] rounded-xl shadow-xs cursor-pointer"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ALL LOGIN ACTIVITY MODAL */}
      {showActivityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] shadow-xl flex flex-col overflow-hidden border border-slate-200">
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 bg-[#F8FAFC]">
              <div>
                <h3 className="text-sm font-bold text-[#0F172A]">All Login Activity Records</h3>
                <p className="text-xs text-[#64748B]">History of administrator sessions and IP events.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowActivityModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto p-4 sm:p-6 flex-1">
              {activity.length === 0 ? (
                <p className="text-center text-xs text-slate-400 py-6">No login logs available.</p>
              ) : (
                <div className="border border-slate-200/80 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#F8FAFC] border-b border-slate-200/80 text-[#475569] font-semibold">
                        <th className="p-3">Device / Browser</th>
                        <th className="p-3">Location</th>
                        <th className="p-3">Timestamp</th>
                        <th className="p-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {activity.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/70">
                          <td className="p-3 font-medium text-[#0F172A]">
                            {item.browser} {item.device}
                          </td>
                          <td className="p-3 text-[#64748B]">{item.location || "Local Network"}</td>
                          <td className="p-3 text-[#64748B]">
                            {formatTime(item.login_time)}
                          </td>
                          <td className="p-3 text-right">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0]">
                              {item.status || "Success"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="p-3 sm:p-4 border-t border-slate-100 bg-[#F8FAFC] flex justify-end">
              <button
                type="button"
                onClick={() => setShowActivityModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-[#E2E8F0] rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── TOAST NOTIFICATION ─── */}
      {notification.show && (
        <div
          className={`fixed bottom-5 right-5 z-[9999] flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg border text-xs font-semibold ${
            notification.type === "success"
              ? "bg-[#DCFCE7] border-[#BBF7D0] text-[#15803D]"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}
    </div>
  );
}