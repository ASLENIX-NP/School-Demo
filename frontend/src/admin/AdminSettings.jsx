import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  RefreshCw,
  User,
  Mail,
  Lock,
  Camera,
  Pencil,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  X,
  Monitor,
  Smartphone,
  Tablet,
  LogOut,
  ShieldCheck,
  Loader2,
} from "lucide-react";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const MAX_DEVICES = 4;

const DEFAULT_SETTINGS = {
  id: 1,
  admin_name: "School Administrator",
  admin_email: "admin@school.com",
  username: "admin",
  role: "Administrator",
  profile_photo: "",
};

function getToken() {
  return (
    localStorage.getItem("adminToken") ||
    sessionStorage.getItem("adminToken") ||
    ""
  );
}

function getHeaders(json = false) {
  const headers = {};
  if (json) headers["Content-Type"] = "application/json";

  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  return headers;
}

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...getHeaders(options.body !== undefined),
      ...(options.headers || {}),
    },
  });

  const text = await response.text();

  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = {
      success: false,
      message: text || `Request failed (${response.status})`,
    };
  }

  if (!response.ok || data?.success === false) {
    const error = new Error(
      data?.message || `Request failed (${response.status})`
    );
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

function initials(name = "") {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "SA";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function formatDate(value) {
  if (!value) return "Unknown";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function relativeTime(value) {
  if (!value) return "Unknown";

  const time = new Date(value).getTime();
  if (Number.isNaN(time)) return String(value);

  const seconds = Math.max(0, Math.floor((Date.now() - time) / 1000));

  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hr ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
}

function DeviceIcon({ type }) {
  if (type === "Mobile") return <Smartphone size={20} />;
  if (type === "Tablet") return <Tablet size={20} />;
  return <Monitor size={20} />;
}

function Modal({ title, description, onClose, children, wide = false }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
      <div
        className={`max-h-[92vh] w-full overflow-y-auto rounded-[28px] bg-white shadow-2xl ${
          wide ? "max-w-2xl" : "max-w-lg"
        }`}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-100 bg-white px-6 py-5">
          <div>
            <h3 className="text-xl font-black text-slate-950">{title}</h3>
            {description && (
              <p className="mt-1 text-sm font-medium text-slate-500">
                {description}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"
            aria-label="Close"
          >
            <X size={19} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder = "" }) {
  return (
    <div>
      <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.08em] text-slate-500">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none focus:border-[#8f2d52] focus:ring-4 focus:ring-[#8f2d52]/10"
      />
    </div>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  visible,
  onToggle,
  placeholder,
}) {
  return (
    <div>
      <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.08em] text-slate-500">
        {label}
      </label>

      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-12 text-sm font-semibold text-slate-900 outline-none focus:border-[#8f2d52] focus:ring-4 focus:ring-[#8f2d52]/10"
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 hover:bg-slate-100"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>
    </div>
  );
}

function Section({ icon: Icon, title, description, action, children }) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#f7eaf0] text-[#8f2d52]">
            <Icon size={20} />
          </div>

          <div>
            <h2 className="text-lg font-black text-slate-950">{title}</h2>
            <p className="mt-1 text-xs font-medium text-slate-500">
              {description}
            </p>
          </div>
        </div>

        {action}
      </div>

      {children}
    </section>
  );
}

export default function AdminSettings() {
  const navigate = useNavigate();
  const photoInput = useRef(null);

  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState("");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [profileOpen, setProfileOpen] = useState(false);
  const [profileForm, setProfileForm] = useState(DEFAULT_SETTINGS);

  const [emailOpen, setEmailOpen] = useState(false);
  const [email, setEmail] = useState("");

  const [passwordOpen, setPasswordOpen] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [saving, setSaving] = useState(false);
  const [photoSaving, setPhotoSaving] = useState(false);
  const [sessionAction, setSessionAction] = useState(false);

  const activeSessions = useMemo(
    () => sessions.filter((session) => session.is_active !== false),
    [sessions]
  );

  const notify = (message) => {
    setError("");
    setSuccess(message);
    window.setTimeout(() => setSuccess(""), 3500);
  };

  const handleAuthFailure = (err) => {
    if (err?.status === 401) {
      ["adminToken", "isAuthenticated", "adminUser"].forEach((key) => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      });

      navigate("/admin/login", { replace: true });
      return true;
    }

    return false;
  };

  const load = async (silent = false) => {
    if (silent) setRefreshing(true);
    else setLoading(true);

    setError("");

    try {
      const [settingsResult, sessionsResult] = await Promise.all([
        apiRequest("/api/admin-settings"),
        apiRequest("/api/admin-settings/login-activity"),
      ]);

      const serverSettings = settingsResult?.data || {};

      const nextSettings = {
        ...DEFAULT_SETTINGS,
        ...serverSettings,
        admin_name:
          serverSettings.admin_name ||
          serverSettings.school_name ||
          DEFAULT_SETTINGS.admin_name,
        admin_email:
          serverSettings.admin_email ||
          serverSettings.school_email ||
          DEFAULT_SETTINGS.admin_email,
      };

      setSettings(nextSettings);
      setProfileForm(nextSettings);

      setSessions(
        Array.isArray(sessionsResult?.data)
          ? sessionsResult.data
          : []
      );

      setCurrentSessionId(
        String(sessionsResult?.current_session_id || "")
      );
    } catch (err) {
      console.error("Admin settings load error:", err);

      if (!handleAuthFailure(err)) {
        setError(
          err?.message ||
            "Could not load administrator settings."
        );
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const saveProfile = async () => {
    const name = String(profileForm.admin_name || "").trim();
    const username = String(profileForm.username || "").trim();

    if (!name) {
      setError("Administrator name is required.");
      return;
    }

    if (!/^[a-zA-Z0-9._-]{3,40}$/.test(username)) {
      setError(
        "Username must be 3–40 characters and use only letters, numbers, dots, underscores or hyphens."
      );
      return;
    }

    setSaving(true);
    setError("");

    try {
      const result = await apiRequest("/api/admin-settings", {
        method: "PUT",
        body: JSON.stringify({
          admin_name: name,
          username,
        }),
      });

      setSettings((previous) => ({
        ...previous,
        ...(result?.data || {}),
        admin_name: name,
        username,
      }));

      setProfileOpen(false);
      notify("Administrator profile updated successfully.");
    } catch (err) {
      if (!handleAuthFailure(err)) {
        setError(err?.message || "Could not update administrator profile.");
      }
    } finally {
      setSaving(false);
    }
  };

  const saveEmail = async () => {
    const value = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError("Please enter a valid email address.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const result = await apiRequest("/api/admin-settings/email", {
        method: "PUT",
        body: JSON.stringify({ email: value }),
      });

      setSettings((previous) => ({
        ...previous,
        ...(result?.data || {}),
        admin_email: value,
        school_email: value,
      }));

      setEmailOpen(false);
      notify("Email updated. Please log in again with the new email.");

      setTimeout(() => {
        ["adminToken", "isAuthenticated", "adminUser"].forEach((key) => {
          localStorage.removeItem(key);
          sessionStorage.removeItem(key);
        });
        navigate("/admin/login", { replace: true });
      }, 900);
    } catch (err) {
      if (!handleAuthFailure(err)) {
        setError(err?.message || "Could not update administrator email.");
      }
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    const currentPassword = passwords.currentPassword;
    const newPassword = passwords.newPassword;
    const confirmPassword = passwords.confirmPassword;

    if (!currentPassword) {
      setError("Please enter your current password.");
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }

    if (newPassword.length > 128) {
      setError("New password is too long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      await apiRequest("/api/admin-settings/change-password", {
        method: "PUT",
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setPasswordOpen(false);

      notify(
        "Password changed successfully. Other devices were signed out."
      );

      await load(true);
    } catch (err) {
      if (!handleAuthFailure(err)) {
        setError(err?.message || "Could not change password.");
      }
    } finally {
      setSaving(false);
    }
  };

  const uploadPhoto = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }

    if (file.size > 6 * 1024 * 1024) {
      setError("Profile image must be smaller than 6 MB.");
      return;
    }

    setPhotoSaving(true);
    setError("");

    try {
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ""));
        reader.onerror = () =>
          reject(new Error("Could not read the selected image."));
        reader.readAsDataURL(file);
      });

      const result = await apiRequest(
        "/api/admin-settings/upload-photo",
        {
          method: "POST",
          body: JSON.stringify({ photo_url: dataUrl }),
        }
      );

      setSettings((previous) => ({
        ...previous,
        ...(result?.data || {}),
        profile_photo:
          result?.data?.profile_photo || dataUrl,
      }));

      notify("Profile photo updated successfully.");
    } catch (err) {
      if (!handleAuthFailure(err)) {
        setError(err?.message || "Could not update profile photo.");
      }
    } finally {
      setPhotoSaving(false);
    }
  };

  const logoutDevice = async (session) => {
    if (
      !window.confirm(
        `Log out ${session.device || "this device"}?`
      )
    ) {
      return;
    }

    setSessionAction(true);
    setError("");

    try {
      await apiRequest(
        `/api/admin-settings/sessions/${encodeURIComponent(session.id)}`,
        { method: "DELETE" }
      );

      await load(true);
      notify("Device logged out successfully.");
    } catch (err) {
      if (!handleAuthFailure(err)) {
        setError(err?.message || "Could not log out that device.");
      }
    } finally {
      setSessionAction(false);
    }
  };

  const logoutOthers = async () => {
    if (
      !window.confirm(
        "Log out all other devices? This browser will stay signed in."
      )
    ) {
      return;
    }

    setSessionAction(true);
    setError("");

    try {
      await apiRequest(
        "/api/admin-settings/sessions/logout-others",
        { method: "POST" }
      );

      await load(true);
      notify("All other devices have been logged out.");
    } catch (err) {
      if (!handleAuthFailure(err)) {
        setError(err?.message || "Could not log out other devices.");
      }
    } finally {
      setSessionAction(false);
    }
  };

  const logout = async () => {
    try {
      await apiRequest("/api/admin/auth/logout", {
        method: "POST",
      });
    } catch {
      // Local cleanup still happens.
    }

    ["adminToken", "isAuthenticated", "adminUser"].forEach((key) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });

    navigate("/admin/login", { replace: true });
  };

  const openProfile = () => {
    setError("");
    setProfileForm({ ...settings });
    setProfileOpen(true);
  };

  const openEmail = () => {
    setError("");
    setEmail(settings.admin_email || "");
    setEmailOpen(true);
  };

  const openPassword = () => {
    setError("");
    setPasswords({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setShowCurrent(false);
    setShowNew(false);
    setShowConfirm(false);
    setPasswordOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-[#F3F1EF] p-6">
        <div className="mx-auto max-w-[1180px] animate-pulse space-y-5">
          <div className="h-14 rounded-2xl bg-white" />
          <div className="h-40 rounded-[28px] bg-white" />
          <div className="h-72 rounded-[28px] bg-white" />
          <div className="h-96 rounded-[28px] bg-white" />
        </div>
      </div>
    );
  }

  const adminName = settings.admin_name || "School Administrator";
  const adminEmail = settings.admin_email || "admin@school.com";

  return (
    <div className="min-h-screen bg-[#F3F1EF] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1180px] space-y-5">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate("/admin/dashboard")}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <ArrowLeft size={17} />
            Back to Dashboard
          </button>

          <button
            type="button"
            onClick={() => load(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-sm disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={refreshing ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {error && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError("")}
              className="ml-auto"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
            <CheckCircle2 size={18} />
            {success}
          </div>
        )}

        <section className="overflow-hidden rounded-[30px] bg-[#7F234A] px-6 py-7 text-white shadow-xl sm:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-[#F4D58A]">
                <ShieldCheck size={14} />
                Account & Security
              </div>

              <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
                Admin Settings
              </h1>

              <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-white/75">
                Manage your administrator identity, recovery email,
                password and signed-in devices.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-3xl border border-white/15 bg-white/10 p-3">
              <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-white/15 text-lg font-black">
                {settings.profile_photo ? (
                  <img
                    src={settings.profile_photo}
                    alt="Administrator"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initials(adminName)
                )}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-black">
                  {adminName}
                </p>
                <p className="truncate text-xs text-white/65">
                  {adminEmail}
                </p>
              </div>
            </div>
          </div>
        </section>

        <Section
          icon={User}
          title="Administrator Profile"
          description="Change the name and username shown in the admin panel."
          action={
            <button
              type="button"
              onClick={openProfile}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-black text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <Pencil size={15} />
              Edit
            </button>
          }
        >
          <div className="grid gap-5 p-6 lg:grid-cols-[150px_1fr]">
            <div className="relative mx-auto lg:mx-0">
              <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-[28px] bg-[#f7edf2] text-3xl font-black text-[#8f2d52]">
                {settings.profile_photo ? (
                  <img
                    src={settings.profile_photo}
                    alt="Administrator profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initials(adminName)
                )}
              </div>

              <button
                type="button"
                onClick={() => photoInput.current?.click()}
                disabled={photoSaving}
                className="absolute -bottom-2 -right-2 flex h-11 w-11 items-center justify-center rounded-2xl border-4 border-white bg-[#DDAE3F] text-[#3b2710] shadow-lg disabled:opacity-60"
                title="Change profile photo"
              >
                {photoSaving ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Camera size={18} />
                )}
              </button>

              <input
                ref={photoInput}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={uploadPhoto}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Name
                </p>
                <p className="mt-2 text-sm font-black text-slate-950">
                  {adminName}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Username
                </p>
                <p className="mt-2 text-sm font-black text-slate-950">
                  {settings.username || "admin"}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5 sm:col-span-2">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Role
                </p>
                <p className="mt-2 text-sm font-black text-slate-950">
                  {settings.role || "Administrator"}
                </p>
              </div>
            </div>
          </div>
        </Section>

        <div className="grid gap-5 lg:grid-cols-2">
          <Section
            icon={Lock}
            title="Password"
            description="Use a strong password and change it whenever needed."
            action={
              <button
                type="button"
                onClick={openPassword}
                className="inline-flex items-center gap-2 rounded-2xl bg-[#8f2d52] px-4 py-2.5 text-xs font-black text-white hover:bg-[#762341]"
              >
                <Lock size={15} />
                Change
              </button>
            }
          >
            <div className="p-6">
              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-sm font-black text-slate-900">
                  Password protected
                </p>
                <p className="mt-1 text-xs font-medium leading-5 text-slate-500">
                  Minimum 8 characters. Changing the password also signs
                  out every other active device.
                </p>
              </div>
            </div>
          </Section>

          <Section
            icon={Mail}
            title="Recovery Email"
            description="This email is used for administrator account recovery."
            action={
              <button
                type="button"
                onClick={openEmail}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-black text-slate-700 hover:bg-slate-50"
              >
                <Pencil size={15} />
                Edit
              </button>
            }
          >
            <div className="p-6">
              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Current email
                </p>
                <p className="mt-2 break-all text-sm font-black text-slate-900">
                  {adminEmail}
                </p>
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-black text-emerald-700">
                  <CheckCircle2 size={13} />
                  Administrator account
                </div>
              </div>
            </div>
          </Section>
        </div>

        <Section
          icon={Monitor}
          title="Logged-in Devices"
          description={`Maximum ${MAX_DEVICES} active devices. The limit is enforced by the backend.`}
          action={
            <button
              type="button"
              onClick={logoutOthers}
              disabled={
                sessionAction ||
                activeSessions.length <= 1
              }
              className="inline-flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-black text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <LogOut size={15} />
              Log Out Other Devices
            </button>
          }
        >
          <div className="p-6">
            <div className="mb-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-[#f7eaf0] p-4">
                <p className="text-[10px] font-black uppercase tracking-wider text-[#8f2d52]">
                  Active
                </p>
                <p className="mt-1 text-2xl font-black text-slate-950">
                  {activeSessions.length}
                  <span className="text-sm text-slate-400">
                    {" "}
                    / {MAX_DEVICES}
                  </span>
                </p>
              </div>

              <div className="rounded-2xl bg-emerald-50 p-4">
                <p className="text-[10px] font-black uppercase tracking-wider text-emerald-700">
                  Current
                </p>
                <p className="mt-1 text-2xl font-black text-slate-950">
                  {activeSessions.filter(
                    (s) =>
                      String(s.id) ===
                        String(currentSessionId) ||
                      s.is_current
                  ).length}
                </p>
              </div>

              <div className="rounded-2xl bg-amber-50 p-4">
                <p className="text-[10px] font-black uppercase tracking-wider text-amber-700">
                  Available
                </p>
                <p className="mt-1 text-2xl font-black text-slate-950">
                  {Math.max(
                    0,
                    MAX_DEVICES - activeSessions.length
                  )}
                </p>
              </div>
            </div>

            {activeSessions.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm font-bold text-slate-400">
                No active devices found.
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {activeSessions.map((session) => {
                  const current =
                    String(session.id) ===
                      String(currentSessionId) ||
                    session.is_current;

                  return (
                    <div
                      key={session.id}
                      className="rounded-2xl border border-slate-200 bg-white p-4 hover:border-[#caa15c] hover:shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                            current
                              ? "bg-[#f7eaf0] text-[#8f2d52]"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          <DeviceIcon type={session.device_type} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="truncate text-sm font-black text-slate-950">
                              {session.device || "Unknown device"}
                            </p>

                            <span
                              className={`rounded-full px-2 py-1 text-[9px] font-black uppercase tracking-wide ${
                                current
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {current ? "Current" : "Active"}
                            </span>
                          </div>

                          <p className="mt-1 text-xs font-bold text-slate-600">
                            {session.browser || "Browser"} ·{" "}
                            {session.os || "Unknown OS"}
                          </p>

                          <div className="mt-2 space-y-1 text-[11px] font-semibold text-slate-400">
                            <p>
                              {session.location || "Location unavailable"}
                            </p>

                            {session.ip && (
                              <p>IP: {session.ip}</p>
                            )}

                            <p>
                              Last active:{" "}
                              {relativeTime(session.last_active)}
                            </p>

                            <p>
                              Logged in:{" "}
                              {formatDate(session.login_time)}
                            </p>
                          </div>
                        </div>

                        {!current && (
                          <button
                            type="button"
                            disabled={sessionAction}
                            onClick={() =>
                              logoutDevice(session)
                            }
                            className="rounded-xl bg-red-50 p-2.5 text-red-600 hover:bg-red-100 disabled:opacity-40"
                            title="Log out this device"
                          >
                            <LogOut size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-xs font-medium leading-5 text-blue-800">
              <strong>4-device rule:</strong> the backend refuses a fifth
              active session. Logging out another device immediately frees
              that slot.
            </div>
          </div>
        </Section>

        <section className="flex flex-col gap-4 rounded-[28px] border border-red-100 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-black text-slate-950">
              Sign out of this admin account
            </p>
            <p className="mt-1 text-xs font-medium text-slate-500">
              This device will be logged out and its server session revoked.
            </p>
          </div>

          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-50 px-5 py-3 text-sm font-black text-red-600 hover:bg-red-100"
          >
            <LogOut size={17} />
            Log Out
          </button>
        </section>
      </div>

      {profileOpen && (
        <Modal
          title="Edit Administrator Profile"
          description="Changes are saved directly to your administrator account."
          onClose={() => !saving && setProfileOpen(false)}
        >
          <div className="space-y-5 p-6">
            <Field
              label="Administrator Name"
              value={profileForm.admin_name || ""}
              onChange={(e) =>
                setProfileForm((previous) => ({
                  ...previous,
                  admin_name: e.target.value,
                }))
              }
              placeholder="School Administrator"
            />

            <Field
              label="Username"
              value={profileForm.username || ""}
              onChange={(e) =>
                setProfileForm((previous) => ({
                  ...previous,
                  username: e.target.value,
                }))
              }
              placeholder="admin"
            />

            <div className="rounded-2xl bg-slate-50 p-4 text-xs font-medium text-slate-500">
              Role:{" "}
              <strong className="text-slate-900">
                {settings.role || "Administrator"}
              </strong>
              <br />
              The administrator role is not editable from this page.
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={saving}
                onClick={() => setProfileOpen(false)}
                className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={saving}
                onClick={saveProfile}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#8f2d52] px-5 py-3 text-sm font-black text-white disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <CheckCircle2 size={16} />
                )}
                Save Changes
              </button>
            </div>
          </div>
        </Modal>
      )}

      {emailOpen && (
        <Modal
          title="Change Administrator Email"
          description="Changing this email signs out the current session for security."
          onClose={() => !saving && setEmailOpen(false)}
        >
          <div className="space-y-5 p-6">
            <Field
              label="Administrator Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="admin@school.com"
            />

            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs font-medium leading-5 text-amber-800">
              After saving, you will be sent back to the login page and
              must log in with the new email address.
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={saving}
                onClick={() => setEmailOpen(false)}
                className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={saving}
                onClick={saveEmail}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#8f2d52] px-5 py-3 text-sm font-black text-white disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Mail size={16} />
                )}
                Save Email
              </button>
            </div>
          </div>
        </Modal>
      )}

      {passwordOpen && (
        <Modal
          title="Change Administrator Password"
          description="Enter your current password, then choose a new one."
          onClose={() => !saving && setPasswordOpen(false)}
        >
          <div className="space-y-5 p-6">
            <PasswordField
              label="Current Password"
              value={passwords.currentPassword}
              onChange={(e) =>
                setPasswords((previous) => ({
                  ...previous,
                  currentPassword: e.target.value,
                }))
              }
              visible={showCurrent}
              onToggle={() => setShowCurrent((value) => !value)}
              placeholder="Enter current password"
            />

            <PasswordField
              label="New Password"
              value={passwords.newPassword}
              onChange={(e) =>
                setPasswords((previous) => ({
                  ...previous,
                  newPassword: e.target.value,
                }))
              }
              visible={showNew}
              onToggle={() => setShowNew((value) => !value)}
              placeholder="At least 8 characters"
            />

            <PasswordField
              label="Confirm New Password"
              value={passwords.confirmPassword}
              onChange={(e) =>
                setPasswords((previous) => ({
                  ...previous,
                  confirmPassword: e.target.value,
                }))
              }
              visible={showConfirm}
              onToggle={() => setShowConfirm((value) => !value)}
              placeholder="Repeat the new password"
            />

            <div className="rounded-2xl bg-slate-50 p-4 text-xs font-medium leading-5 text-slate-600">
              Password requirements:
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>At least 8 characters.</li>
                <li>Must be different from the current password.</li>
                <li>The backend stores only a bcrypt password hash.</li>
                <li>All other devices are signed out after the change.</li>
              </ul>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={saving}
                onClick={() => setPasswordOpen(false)}
                className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={saving}
                onClick={changePassword}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#8f2d52] px-5 py-3 text-sm font-black text-white disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Lock size={16} />
                )}
                Change Password
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
