import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
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
  Laptop,
  LogOut,
  ShieldCheck,
  KeyRound,
  Loader2,
  Users,
  Settings as SettingsIcon,
} from "lucide-react";

/*
|--------------------------------------------------------------------------
| RED ROSE SCHOOL — ADMIN SETTINGS
|--------------------------------------------------------------------------
| FULL REPLACEMENT
|
| Correction made:
| - Removed window.confirm() completely.
| - "Log out this device" now opens an in-page confirmation modal.
| - "Log out other devices" now opens the same in-page confirmation modal.
| - Backend logout routes are unchanged.
| - No browser localhost alert is used anywhere in this file.
| - API connection now uses VITE_API_URL, then localhost:8080, then 5000.
| - Failed connection automatically falls back to the next configured port.
| - Main settings load independently from login activity.
| - Login activity can never keep the entire page stuck in loading.
| - The full-page loading skeleton was removed; the Settings UI renders immediately.
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| API
|--------------------------------------------------------------------------
| Use the same shared API client as the rest of the application.
| This keeps AdminSettings on the project's configured backend.
|--------------------------------------------------------------------------
*/
const MAX_DEVICES = 4;

const DEFAULT_SETTINGS = {
  id: 1,
  admin_name: "School Administrator",
  admin_email: "admin@school.com",
  username: "admin",
  role: "Administrator",
  profile_photo: "",
  school_name: "Red Rose Secondary English Boarding School",
  school_email: "admin@school.com",
  session_timeout: 30,
  max_login_attempts: 5,
  lock_account: true,
  two_factor: false,
};

function getToken() {
  return (
    localStorage.getItem("adminToken") ||
    sessionStorage.getItem("adminToken") ||
    ""
  );
}

function getAuthHeaders(withJson = true) {
  const headers = {};

  if (withJson) {
    headers["Content-Type"] = "application/json";
  }

  const token = getToken();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function apiRequest(path, options = {}) {
  const method =
    String(options.method || "GET").toUpperCase();

  const requestConfig = {
    url: path,
    method,
    withCredentials: true,
    timeout: 12000,
    headers: {
      ...getAuthHeaders(
        options.body !== undefined
      ),
      ...(options.headers || {}),
    },
  };

  /*
   * Existing AdminSettings actions use `body`.
   * Convert JSON strings to axios `data`.
   */
  if (options.body !== undefined) {
    try {
      requestConfig.data =
        typeof options.body === "string"
          ? JSON.parse(options.body)
          : options.body;
    } catch {
      requestConfig.data = options.body;
    }
  }

  try {
    const response =
      await api.request(requestConfig);

    const data =
      response?.data ?? {};

    if (data?.success === false) {
      const error = new Error(
        data?.message ||
          "The server rejected the request."
      );

      error.status =
        response?.status;

      error.data = data;

      throw error;
    }

    return data;
  } catch (err) {
    const responseData =
      err?.response?.data;

    const error = new Error(
      responseData?.message ||
        responseData?.error ||
        err?.message ||
        "Could not load administrator settings."
    );

    error.status =
      err?.response?.status;

    error.data = responseData;
    error.code = err?.code;

    throw error;
  }
}

function getInitials(name = "School Administrator") {
  const parts = String(name)
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!parts.length) return "SA";

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function formatDate(value) {
  if (!value) return "Unknown";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString();
}

function relativeTime(value) {
  if (!value) return "Unknown";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  const seconds = Math.floor(
    (Date.now() - date.getTime()) / 1000
  );

  if (seconds < 60) return "Just now";

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return `${minutes} min ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} hr ago`;
  }

  return `${Math.floor(hours / 24)} day(s) ago`;
}

function DeviceIcon({ type = "", device = "" }) {
  const value = `${type} ${device}`.toLowerCase();

  if (
    value.includes("iphone") ||
    value.includes("android") ||
    value.includes("mobile")
  ) {
    return <Smartphone size={20} />;
  }

  if (
    value.includes("ipad") ||
    value.includes("tablet")
  ) {
    return <Tablet size={20} />;
  }

  if (
    value.includes("mac") ||
    value.includes("windows") ||
    value.includes("linux") ||
    value.includes("desktop")
  ) {
    return <Laptop size={20} />;
  }

  return <Monitor size={20} />;
}

function Section({
  icon: Icon,
  title,
  description,
  action,
  children,
}) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#f7eaf0] text-[#8f2d52]">
            <Icon size={20} />
          </div>

          <div>
            <h2 className="text-lg font-black text-slate-950">
              {title}
            </h2>

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

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  disabled = false,
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.08em] text-slate-500">
        {label}
      </span>

      <input
        type={type}
        value={value || ""}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-[#8f2d52] focus:ring-4 focus:ring-[#8f2d52]/10 disabled:cursor-not-allowed disabled:bg-slate-50"
      />
    </label>
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

function Modal({
  title,
  description,
  onClose,
  children,
  wide = false,
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className={`max-h-[90vh] w-full overflow-y-auto rounded-[28px] bg-white shadow-2xl ${
          wide ? "max-w-2xl" : "max-w-lg"
        }`}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-100 bg-white px-6 py-5">
          <div>
            <h3 className="text-xl font-extrabold text-slate-950">
              {title}
            </h3>

            {description && (
              <p className="mt-1 text-sm font-medium text-slate-500">
                {description}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
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

function PrimaryButton({
  children,
  onClick,
  disabled = false,
  type = "button",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#8f2d52] px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-[#8f2d52]/15 transition hover:bg-[#772341] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {children}
    </button>
  );
}

function SecondaryButton({
  children,
  onClick,
  disabled = false,
  type = "button",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-extrabold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {children}
    </button>
  );
}

/*
|--------------------------------------------------------------------------
| IMPORTANT FIX
|--------------------------------------------------------------------------
| This modal replaces window.confirm().
| Nothing here calls window.confirm().
*/
function LogoutConfirmModal({
  type,
  session,
  busy,
  onCancel,
  onConfirm,
}) {
  if (!type) return null;

  const isOthers = type === "others";

  const deviceName =
    session?.device ||
    session?.browser ||
    "this device";

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !busy
        ) {
          onCancel();
        }
      }}
    >
      <div className="w-full max-w-[430px] overflow-hidden rounded-[30px] border border-white/60 bg-white shadow-[0_30px_90px_rgba(15,23,42,.28)]">
        <div className="flex justify-center pt-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#8f2d52]/10 text-[#8f2d52]">
            <LogOut size={28} />
          </div>
        </div>

        <div className="px-7 pb-7 pt-5 text-center">
          <h3 className="text-xl font-black tracking-tight text-slate-950">
            {isOthers
              ? "Log out other devices?"
              : "Log out this device?"}
          </h3>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            {isOthers
              ? "All other devices currently signed in to this administrator account will be logged out. This device will remain signed in."
              : `Are you sure you want to log out ${deviceName}?`}
          </p>

          {!isOthers && session && (
            <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-left">
              <p className="text-sm font-black text-slate-900">
                {deviceName}
              </p>

              <p className="mt-1 text-xs font-semibold text-slate-500">
                {session.browser || "Browser"}{" "}
                {session.os
                  ? `· ${session.os}`
                  : ""}
              </p>

              {session.location && (
                <p className="mt-1 text-xs font-medium text-slate-400">
                  {session.location}
                </p>
              )}
            </div>
          )}

          <div className="mt-7 flex gap-3">
            <button
              type="button"
              disabled={busy}
              onClick={onCancel}
              className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-extrabold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={busy}
              onClick={onConfirm}
              className="flex-1 rounded-2xl bg-[#8f2d52] px-4 py-3 text-sm font-extrabold text-white shadow-lg shadow-[#8f2d52]/20 transition hover:bg-[#772341] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                  Logging out...
                </span>
              ) : (
                "Log out"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminSettings() {
  const navigate = useNavigate();
  const photoInput = useRef(null);

  const [settings, setSettings] =
    useState(DEFAULT_SETTINGS);

  const [sessions, setSessions] =
    useState([]);

  const [currentSessionId, setCurrentSessionId] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [profileOpen, setProfileOpen] =
    useState(false);

  const [profileForm, setProfileForm] =
    useState(DEFAULT_SETTINGS);

  const [emailOpen, setEmailOpen] =
    useState(false);

  const [email, setEmail] =
    useState("");

  const [passwordOpen, setPasswordOpen] =
    useState(false);

  const [passwords, setPasswords] =
    useState({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

  const [showCurrent, setShowCurrent] =
    useState(false);

  const [showNew, setShowNew] =
    useState(false);

  const [showConfirm, setShowConfirm] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [photoSaving, setPhotoSaving] =
    useState(false);

  const [sessionAction, setSessionAction] =
    useState(false);

  /*
  |--------------------------------------------------------------------------
  | NEW STATE FOR THE CUSTOM LOGOUT MODAL
  |--------------------------------------------------------------------------
  */
  const [logoutConfirm, setLogoutConfirm] =
    useState({
      type: "",
      session: null,
    });

  const activeSessions = useMemo(
    () =>
      sessions.filter(
        (session) =>
          session.is_active !== false
      ),
    [sessions]
  );

  const adminName =
    settings.admin_name ||
    settings.school_name ||
    DEFAULT_SETTINGS.admin_name;

  const adminEmail =
    settings.admin_email ||
    settings.school_email ||
    DEFAULT_SETTINGS.admin_email;

  const initials = getInitials(adminName);

  const notify = (message) => {
    setError("");
    setSuccess(message);

    window.setTimeout(() => {
      setSuccess("");
    }, 3500);
  };

  const handleAuthFailure = (err) => {
    if (err?.status === 401) {
      [
        "adminToken",
        "isAuthenticated",
        "adminUser",
      ].forEach((key) => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      });

      navigate("/admin/login", {
        replace: true,
      });

      return true;
    }

    return false;
  };

  const load = async (silent = false) => {
    if (silent) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      /*
       * Load the main Settings record first. The page is no longer
       * blocked by the secondary login-activity endpoint.
       */
      const settingsResult =
        await apiRequest("/api/admin-settings");

      const serverSettings =
        settingsResult?.data || {};

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

      // Render the full Settings UI immediately.
      setLoading(false);

      /*
       * Login activity is secondary. If it fails, Settings still works.
       */
      try {
        const sessionsResult =
          await apiRequest(
            "/api/admin-settings/login-activity"
          );

        setSessions(
          Array.isArray(
            sessionsResult?.data
          )
            ? sessionsResult.data
            : []
        );

        setCurrentSessionId(
          String(
            sessionsResult?.current_session_id ||
              ""
          )
        );
      } catch (sessionError) {
        console.warn(
          "Login activity could not be loaded:",
          sessionError
        );

        setSessions([]);
        setCurrentSessionId("");
      }
    } catch (err) {
      console.error(
        "Admin settings load error:",
        err
      );

      if (!handleAuthFailure(err)) {
        setError(
          err?.message ||
            "Could not load administrator settings."
        );
      }

      // Never leave the page permanently stuck on the skeleton.
      setLoading(false);
    } finally {
      setRefreshing(false);
    }
  };
  useEffect(() => {
    let mounted = true;

    const initialLoad = async () => {
      if (!mounted) return;
      await load();
    };

    initialLoad();

    return () => {
      mounted = false;
    };
  }, []);

  const openProfile = () => {
    setError("");
    setProfileForm({
      ...settings,
    });
    setProfileOpen(true);
  };

  const saveProfile = async () => {
    const name =
      String(
        profileForm.admin_name || ""
      ).trim();

    const username =
      String(
        profileForm.username || ""
      ).trim();

    if (!name) {
      setError(
        "Administrator name is required."
      );
      return;
    }

    if (
      !/^[a-zA-Z0-9._-]{3,40}$/.test(
        username
      )
    ) {
      setError(
        "Username must be 3–40 characters and use only letters, numbers, dots, underscores or hyphens."
      );
      return;
    }

    setSaving(true);
    setError("");

    try {
      const result =
        await apiRequest(
          "/api/admin-settings",
          {
            method: "PUT",
            body: JSON.stringify({
              admin_name: name,
              username,
            }),
          }
        );

      setSettings(
        (previous) => ({
          ...previous,
          ...(result?.data || {}),
          admin_name: name,
          username,
        })
      );

      setProfileOpen(false);

      notify(
        "Administrator profile updated successfully."
      );
    } catch (err) {
      if (!handleAuthFailure(err)) {
        setError(
          err?.message ||
            "Could not update administrator profile."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const openEmail = () => {
    setError("");

    setEmail(
      settings.admin_email ||
        settings.school_email ||
        DEFAULT_SETTINGS.admin_email
    );

    setEmailOpen(true);
  };

  const saveEmail = async () => {
    const value =
      email.trim().toLowerCase();

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        value
      )
    ) {
      setError(
        "Please enter a valid email address."
      );
      return;
    }

    setSaving(true);
    setError("");

    try {
      const result =
        await apiRequest(
          "/api/admin-settings/email",
          {
            method: "PUT",
            body: JSON.stringify({
              email: value,
            }),
          }
        );

      setSettings(
        (previous) => ({
          ...previous,
          ...(result?.data || {}),
          admin_email: value,
          school_email: value,
        })
      );

      setEmailOpen(false);

      notify(
        "Email updated. Please log in again with the new email."
      );

      window.setTimeout(() => {
        [
          "adminToken",
          "isAuthenticated",
          "adminUser",
        ].forEach((key) => {
          localStorage.removeItem(key);
          sessionStorage.removeItem(key);
        });

        navigate("/admin/login", {
          replace: true,
        });
      }, 900);
    } catch (err) {
      if (!handleAuthFailure(err)) {
        setError(
          err?.message ||
            "Could not update administrator email."
        );
      }
    } finally {
      setSaving(false);
    }
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

  const changePassword = async () => {
    const currentPassword =
      passwords.currentPassword;

    const newPassword =
      passwords.newPassword;

    const confirmPassword =
      passwords.confirmPassword;

    if (!currentPassword) {
      setError(
        "Please enter your current password."
      );
      return;
    }

    if (newPassword.length < 8) {
      setError(
        "New password must be at least 8 characters."
      );
      return;
    }

    if (newPassword.length > 128) {
      setError(
        "New password is too long."
      );
      return;
    }

    if (
      newPassword === currentPassword
    ) {
      setError(
        "New password must be different from the current password."
      );
      return;
    }

    if (
      newPassword !== confirmPassword
    ) {
      setError(
        "New password and confirmation do not match."
      );
      return;
    }

    setSaving(true);
    setError("");

    try {
      await apiRequest(
        "/api/admin-settings/change-password",
        {
          method: "PUT",
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

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
        setError(
          err?.message ||
            "Could not change password."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const uploadPhoto = async (event) => {
    const file =
      event.target.files?.[0];

    event.target.value = "";

    if (!file) return;

    if (
      !file.type.startsWith("image/")
    ) {
      setError(
        "Please choose an image file."
      );
      return;
    }

    if (
      file.size >
      6 * 1024 * 1024
    ) {
      setError(
        "Profile image must be smaller than 6 MB."
      );
      return;
    }

    setPhotoSaving(true);
    setError("");

    try {
      const dataUrl =
        await new Promise(
          (resolve, reject) => {
            const reader =
              new FileReader();

            reader.onload = () =>
              resolve(
                String(
                  reader.result || ""
                )
              );

            reader.onerror = () =>
              reject(
                new Error(
                  "Could not read the selected image."
                )
              );

            reader.readAsDataURL(
              file
            );
          }
        );

      const result =
        await apiRequest(
          "/api/admin-settings/upload-photo",
          {
            method: "POST",
            body: JSON.stringify({
              photo_url: dataUrl,
            }),
          }
        );

      setSettings(
        (previous) => ({
          ...previous,
          ...(result?.data || {}),
          profile_photo:
            result?.data?.profile_photo ||
            dataUrl,
        })
      );

      notify(
        "Profile photo updated successfully."
      );
    } catch (err) {
      if (!handleAuthFailure(err)) {
        setError(
          err?.message ||
            "Could not update profile photo."
        );
      }
    } finally {
      setPhotoSaving(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | IMPORTANT:
  | Clicking a device logout button ONLY opens our React modal.
  | It does NOT perform the logout yet.
  |--------------------------------------------------------------------------
  */
  const logoutDevice = (session) => {
    setError("");

    setLogoutConfirm({
      type: "single",
      session,
    });
  };

  const logoutOthers = () => {
    setError("");

    setLogoutConfirm({
      type: "others",
      session: null,
    });
  };

  const closeLogoutConfirm = () => {
    if (sessionAction) return;

    setLogoutConfirm({
      type: "",
      session: null,
    });
  };

  /*
  |--------------------------------------------------------------------------
  | Actual logout operation after user presses "Log out"
  |--------------------------------------------------------------------------
  */
  const confirmLogoutAction = async () => {
    const type =
      logoutConfirm.type;

    const session =
      logoutConfirm.session;

    if (!type) return;

    setSessionAction(true);
    setError("");

    try {
      if (type === "single") {
        if (!session?.id) {
          throw new Error(
            "The selected device does not have a valid session ID."
          );
        }

        await apiRequest(
          `/api/admin-settings/sessions/${encodeURIComponent(
            session.id
          )}`,
          {
            method: "DELETE",
          }
        );

        setLogoutConfirm({
          type: "",
          session: null,
        });

        await load(true);

        notify(
          "Device logged out successfully."
        );
      } else if (type === "others") {
        await apiRequest(
          "/api/admin-settings/sessions/logout-others",
          {
            method: "POST",
          }
        );

        setLogoutConfirm({
          type: "",
          session: null,
        });

        await load(true);

        notify(
          "All other devices have been logged out."
        );
      }
    } catch (err) {
      if (!handleAuthFailure(err)) {
        setError(
          err?.message ||
            "Could not complete the logout action."
        );
      }
    } finally {
      setSessionAction(false);
    }
  };

  const logout = async () => {
    try {
      await apiRequest(
        "/api/admin/auth/logout",
        {
          method: "POST",
        }
      );
    } catch {
      // Local cleanup still happens.
    }

    [
      "adminToken",
      "isAuthenticated",
      "adminUser",
    ].forEach((key) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });

    navigate("/admin/login", {
      replace: true,
    });
  };

  return (
    <div className="min-h-screen bg-[#F3F1EF] px-4 py-5 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1200px]">
        {loading && (
          <div className="mb-4 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-500 shadow-sm">
            <Loader2 size={16} className="animate-spin" />
            Loading administrator settings…
          </div>
        )}
        {/* HEADER */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() =>
              navigate("/admin/dashboard")
            }
            className="inline-flex w-fit items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <ArrowLeft size={17} />
            Dashboard
          </button>

          <button
            type="button"
            onClick={() => load(true)}
            disabled={refreshing}
            className="inline-flex w-fit items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />
            Refresh
          </button>
        </div>

        {/* TITLE */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#8f2d52] text-white shadow-lg shadow-[#8f2d52]/20">
              <SettingsIcon size={22} />
            </div>

            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                Administrator Settings
              </h1>

              <p className="mt-1 text-sm font-medium text-slate-500">
                Manage your administrator account, security and logged-in devices.
              </p>
            </div>
          </div>
        </div>

        {/* GLOBAL MESSAGE */}
        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
            <AlertCircle
              size={18}
              className="mt-0.5 shrink-0"
            />
            <span>{error}</span>

            <button
              type="button"
              onClick={() => setError("")}
              className="ml-auto rounded-lg p-1 hover:bg-red-100"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {success && (
          <div className="mb-5 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
            <CheckCircle2 size={18} />
            <span>{success}</span>
          </div>
        )}

        {/* ADMIN PROFILE */}
        <Section
          icon={User}
          title="Administrator Profile"
          description="Manage the name, username and profile photo associated with your administrator account."
          action={
            <button
              type="button"
              onClick={openProfile}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-3.5 py-2.5 text-xs font-black text-slate-700 transition hover:bg-slate-200"
            >
              <Pencil size={14} />
              Edit Profile
            </button>
          }
        >
          <div className="p-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="relative shrink-0">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-[26px] bg-[#f7eaf0] text-2xl font-black text-[#8f2d52]">
                  {settings.profile_photo ? (
                    <img
                      src={settings.profile_photo}
                      alt="Administrator"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initials
                  )}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    photoInput.current?.click()
                  }
                  disabled={photoSaving}
                  className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-[#8f2d52] text-white shadow-lg disabled:opacity-50"
                  title="Change profile photo"
                >
                  {photoSaving ? (
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
                  ) : (
                    <Camera size={16} />
                  )}
                </button>

                <input
                  ref={photoInput}
                  type="file"
                  accept="image/*"
                  onChange={uploadPhoto}
                  className="hidden"
                />
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="text-xl font-black text-slate-950">
                  {adminName}
                </h2>

                <p className="mt-1 text-sm font-semibold text-slate-500">
                  {adminEmail}
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-[#f7eaf0] px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-[#8f2d52]">
                    {settings.role ||
                      "Administrator"}
                  </span>

                  <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-emerald-700">
                    Account Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* ACCOUNT SECURITY */}
        <div className="mt-5">
          <Section
            icon={ShieldCheck}
            title="Account Security"
            description="Manage the credentials used to protect your administrator account."
          >
            <div className="grid gap-4 p-6 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#8f2d52] shadow-sm">
                    <Mail size={18} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Administrator Email
                    </p>

                    <p className="mt-1 truncate text-sm font-black text-slate-900">
                      {adminEmail}
                    </p>

                    <button
                      type="button"
                      onClick={openEmail}
                      className="mt-3 text-xs font-black text-[#8f2d52] hover:underline"
                    >
                      Change email
                    </button>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#8f2d52] shadow-sm">
                    <Lock size={18} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Password
                    </p>

                    <p className="mt-1 text-sm font-black text-slate-900">
                      Your password is protected.
                    </p>

                    <button
                      type="button"
                      onClick={openPassword}
                      className="mt-3 text-xs font-black text-[#8f2d52] hover:underline"
                    >
                      Change password
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Section>
        </div>

        {/* LOGGED-IN DEVICES */}
        <div className="mt-5">
          <Section
            icon={Monitor}
            title="Logged-in Devices"
            description={`Maximum ${MAX_DEVICES} active devices per administrator account.`}
            action={
              <button
                type="button"
                disabled={
                  sessionAction ||
                  activeSessions.length <= 1
                }
                onClick={logoutOthers}
                className="inline-flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-3.5 py-2.5 text-xs font-black text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <LogOut size={14} />
                Log Out Other Devices
              </button>
            }
          >
            <div className="p-6">
              <div className="mb-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-[#F3E8EE] p-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#7B294E]">
                    Active
                  </p>

                  <p className="mt-1 text-2xl font-black">
                    {activeSessions.length}
                    <span className="text-sm text-slate-400">
                      {" "}
                      / {MAX_DEVICES}
                    </span>
                  </p>
                </div>

                <div className="rounded-2xl bg-emerald-50 p-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700">
                    Current
                  </p>

                  <p className="mt-1 text-2xl font-black">
                    {
                      activeSessions.filter(
                        (session) =>
                          String(
                            session.id
                          ) ===
                            String(
                              currentSessionId
                            ) ||
                          session.is_current
                      ).length
                    }
                  </p>
                </div>

                <div className="rounded-2xl bg-amber-50 p-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-amber-700">
                    Available
                  </p>

                  <p className="mt-1 text-2xl font-black">
                    {Math.max(
                      0,
                      MAX_DEVICES -
                        activeSessions.length
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
                  {activeSessions.map(
                    (session) => {
                      const current =
                        String(
                          session.id
                        ) ===
                          String(
                            currentSessionId
                          ) ||
                        session.is_current;

                      return (
                        <div
                          key={session.id}
                          className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-[#caa15c] hover:shadow-sm"
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                                current
                                  ? "bg-[#f7eaf0] text-[#8f2d52]"
                                  : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              <DeviceIcon
                                type={
                                  session.device_type
                                }
                                device={
                                  session.device
                                }
                              />
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="truncate text-sm font-black text-slate-950">
                                  {session.device ||
                                    "Unknown device"}
                                </p>

                                <span
                                  className={`rounded-full px-2 py-1 text-[9px] font-black uppercase tracking-wide ${
                                    current
                                      ? "bg-emerald-50 text-emerald-700"
                                      : "bg-slate-100 text-slate-600"
                                  }`}
                                >
                                  {current
                                    ? "Current"
                                    : "Active"}
                                </span>
                              </div>

                              <p className="mt-1 text-xs font-bold text-slate-600">
                                {session.browser ||
                                  "Browser"}{" "}
                                ·{" "}
                                {session.os ||
                                  "Unknown OS"}
                              </p>

                              <div className="mt-2 space-y-1 text-[11px] font-semibold text-slate-400">
                                <p>
                                  {session.location ||
                                    "Location unavailable"}
                                </p>

                                {session.ip && (
                                  <p>
                                    IP:{" "}
                                    {
                                      session.ip
                                    }
                                  </p>
                                )}

                                <p>
                                  Last active:{" "}
                                  {relativeTime(
                                    session.last_active ||
                                      session.login_time
                                  )}
                                </p>

                                <p>
                                  Logged in:{" "}
                                  {formatDate(
                                    session.login_time
                                  )}
                                </p>
                              </div>
                            </div>

                            {!current && (
                              <button
                                type="button"
                                disabled={
                                  sessionAction
                                }
                                onClick={() =>
                                  logoutDevice(
                                    session
                                  )
                                }
                                className="rounded-xl bg-red-50 p-2.5 text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40"
                                title="Log out this device"
                              >
                                <LogOut
                                  size={16}
                                />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              )}

              <div className="mt-5 flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-xs font-medium leading-5 text-blue-800">
                <Users
                  size={17}
                  className="mt-0.5 shrink-0"
                />

                <p>
                  <strong>
                    4-device rule:
                  </strong>{" "}
              You can stay signed in on up to 4 devices. Sign out from another device to make room for a new one.
                </p>
              </div>
            </div>
          </Section>
        </div>

        {/* LOGOUT */}
        <div className="mt-5">
          <Section
            icon={LogOut}
            title="Sign Out"
            description="Sign out of the administrator account on this browser."
          >
            <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-black text-slate-900">
                  Sign out of this browser
                </p>

                <p className="mt-1 text-xs font-medium text-slate-500">
                  You will need to enter your administrator credentials again.
                </p>
              </div>

              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#8f2d52] px-5 py-3 text-sm font-black text-white shadow-lg shadow-[#8f2d52]/15 transition hover:bg-[#772341]"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </Section>
        </div>
      </div>

      {/* PROFILE MODAL */}
      {profileOpen && (
        <Modal
          title="Edit Administrator Profile"
          description="Update your administrator name and username."
          onClose={() =>
            !saving &&
            setProfileOpen(false)
          }
        >
          <div className="space-y-5 p-6">
            <Field
              label="Administrator Name"
              value={
                profileForm.admin_name
              }
              onChange={(value) =>
                setProfileForm(
                  (previous) => ({
                    ...previous,
                    admin_name: value,
                  })
                )
              }
            />

            <Field
              label="Username"
              value={
                profileForm.username
              }
              onChange={(value) =>
                setProfileForm(
                  (previous) => ({
                    ...previous,
                    username: value,
                  })
                )
              }
            />

            <div className="rounded-2xl bg-slate-50 p-4 text-xs font-medium leading-5 text-slate-500">
              <strong>
                Role:
              </strong>{" "}
              {settings.role ||
                "Administrator"}
              <br />
              The administrator role cannot be changed from this page.
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
              <SecondaryButton
                onClick={() =>
                  setProfileOpen(false)
                }
                disabled={saving}
              >
                Cancel
              </SecondaryButton>

              <PrimaryButton
                onClick={saveProfile}
                disabled={saving}
              >
                {saving ? (
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                ) : (
                  <CheckCircle2
                    size={16}
                  />
                )}
                Save Changes
              </PrimaryButton>
            </div>
          </div>
        </Modal>
      )}

      {/* EMAIL MODAL */}
      {emailOpen && (
        <Modal
          title="Change Administrator Email"
          description="Changing this email signs you out so the new email can be used for login."
          onClose={() =>
            !saving &&
            setEmailOpen(false)
          }
        >
          <div className="space-y-5 p-6">
            <Field
              label="Administrator Email"
              value={email}
              onChange={setEmail}
              type="email"
              placeholder="admin@school.com"
            />

            <div className="rounded-2xl bg-amber-50 p-4 text-xs font-semibold leading-5 text-amber-800">
              After saving, you will be returned to the login page and must sign in with the new email address.
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
              <SecondaryButton
                onClick={() =>
                  setEmailOpen(false)
                }
                disabled={saving}
              >
                Cancel
              </SecondaryButton>

              <PrimaryButton
                onClick={saveEmail}
                disabled={saving}
              >
                {saving ? (
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                ) : (
                  <Mail size={16} />
                )}
                Save Email
              </PrimaryButton>
            </div>
          </div>
        </Modal>
      )}

      {/* PASSWORD MODAL */}
      {passwordOpen && (
        <Modal
          title="Change Administrator Password"
          description="Enter your current password and choose a new password."
          onClose={() =>
            !saving &&
            setPasswordOpen(false)
          }
        >
          <div className="space-y-5 p-6">
            <PasswordField
              label="Current Password"
              value={
                passwords.currentPassword
              }
              onChange={(event) =>
                setPasswords(
                  (previous) => ({
                    ...previous,
                    currentPassword:
                      event.target.value,
                  })
                )
              }
              visible={showCurrent}
              onToggle={() =>
                setShowCurrent(
                  (value) => !value
                )
              }
              placeholder="Enter current password"
            />

            <PasswordField
              label="New Password"
              value={
                passwords.newPassword
              }
              onChange={(event) =>
                setPasswords(
                  (previous) => ({
                    ...previous,
                    newPassword:
                      event.target.value,
                  })
                )
              }
              visible={showNew}
              onToggle={() =>
                setShowNew(
                  (value) => !value
                )
              }
              placeholder="At least 8 characters"
            />

            <PasswordField
              label="Confirm New Password"
              value={
                passwords.confirmPassword
              }
              onChange={(event) =>
                setPasswords(
                  (previous) => ({
                    ...previous,
                    confirmPassword:
                      event.target.value,
                  })
                )
              }
              visible={showConfirm}
              onToggle={() =>
                setShowConfirm(
                  (value) => !value
                )
              }
              placeholder="Repeat the new password"
            />

            <div className="rounded-2xl bg-slate-50 p-4 text-xs font-medium leading-5 text-slate-600">
              <div className="flex items-start gap-3">
                <ShieldCheck
                  size={18}
                  className="mt-0.5 shrink-0 text-emerald-600"
                />

                <div>
                  <p className="font-black text-slate-800">
                    Password requirements
                  </p>

                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    <li>
                      At least 8 characters.
                    </li>
                    <li>
                      Must be different from the current password.
                    </li>
                    <li>
                      Other active devices are signed out after a successful password change.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
              <SecondaryButton
                onClick={() =>
                  setPasswordOpen(false)
                }
                disabled={saving}
              >
                Cancel
              </SecondaryButton>

              <PrimaryButton
                onClick={changePassword}
                disabled={saving}
              >
                {saving ? (
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                ) : (
                  <KeyRound
                    size={16}
                  />
                )}
                Change Password
              </PrimaryButton>
            </div>
          </div>
        </Modal>
      )}

      {/* CUSTOM LOGOUT CONFIRMATION MODAL */}
      <LogoutConfirmModal
        type={logoutConfirm.type}
        session={logoutConfirm.session}
        busy={sessionAction}
        onCancel={closeLogoutConfirm}
        onConfirm={confirmLogoutAction}
      />
    </div>
  );
}
