import "dotenv/config";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { UAParser } from "ua-parser-js";
import { supabase } from "../config/supabase.js";

const SESSION_DAYS = 7;
const OTP_MINUTES = 10;

const MAIL_USER = process.env.MAIL_USER || "";
const MAIL_PASS = process.env.MAIL_PASS || "";

const transporter =
  MAIL_USER && MAIL_PASS
    ? nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: MAIL_USER,
          pass: MAIL_PASS,
        },
      })
    : null;

const otpStore = new Map();

const PUBLIC_SETTINGS_COLUMNS = `
  id,
  school_name,
  school_email,
  phone,
  address,
  institution_name,
  school_location,
  academic_session,
  timezone,
  admin_name,
  username,
  admin_email,
  profile_photo,
  lock_account,
  two_factor,
  session_timeout,
  max_login_attempts,
  created_at
`;

function sanitizeSettings(row) {
  if (!row) return null;
  const safe = { ...row };
  delete safe.password;
  delete safe.admin_password;
  return safe;
}

function serverError(res, message, error) {
  console.error(message, error);
  return res.status(500).json({
    success: false,
    message,
  });
}

function getClientIp(req) {
  return (
    String(req.headers["x-forwarded-for"] || "")
      .split(",")[0]
      .trim() ||
    req.ip ||
    req.socket?.remoteAddress ||
    ""
  );
}

function getLocation(ip) {
  if (!ip) return "Unknown";
  if (
    ip === "127.0.0.1" ||
    ip === "::1" ||
    ip.startsWith("192.168.") ||
    ip.startsWith("10.") ||
    ip.startsWith("172.")
  ) {
    return "Local network";
  }
  return "Unknown";
}

function isBcrypt(value) {
  const clean = String(value || "");
  return (
    clean.startsWith("$2a$") ||
    clean.startsWith("$2b$") ||
    clean.startsWith("$2y$")
  );
}

async function passwordMatches(plain, stored) {
  if (!stored) return false;
  if (isBcrypt(stored)) {
    return bcrypt.compare(String(plain), String(stored));
  }
  return String(plain) === String(stored);
}

function getDeviceData(req) {
  const userAgent = String(req.headers["user-agent"] || "");
  const parser = new UAParser(userAgent);
  const parsed = parser.getResult();

  const deviceType =
    parsed.device?.type === "mobile"
      ? "Mobile"
      : parsed.device?.type === "tablet"
        ? "Tablet"
        : "Desktop";

  const deviceName =
    parsed.device?.model ||
    parsed.os?.name ||
    "Unknown Device";

  const browser = parsed.browser?.name || "Unknown Browser";

  const os = parsed.os?.name
    ? `${parsed.os.name}${parsed.os.version ? ` ${parsed.os.version}` : ""}`
    : "Unknown OS";

  const ip = getClientIp(req);

  return {
    deviceType,
    deviceName,
    browser,
    os,
    ip,
    location: getLocation(ip),
  };
}

// ------------------------------------------------------------
// Simple in-memory cache for admin_settings.
//
// Why: EXPLAIN ANALYZE confirmed the actual Postgres query takes
// ~0.15ms — the slowness we were seeing (1-1.5s+) is entirely in the
// PostgREST/HTTPS round-trip to Supabase, not the query itself.
// admin_settings is a single row that only changes when the admin
// edits their profile/email/photo, so there is no need to make that
// round-trip on every page load. We cache the row for a short window
// and invalidate the cache immediately whenever it's updated.
// ------------------------------------------------------------
const ADMIN_SETTINGS_CACHE_TTL_MS = 30_000; // 30 seconds

let adminSettingsCache = {
  data: null,
  expiresAt: 0,
};

function setAdminSettingsCache(data) {
  adminSettingsCache = {
    data,
    expiresAt: Date.now() + ADMIN_SETTINGS_CACHE_TTL_MS,
  };
}

function clearAdminSettingsCache() {
  adminSettingsCache = { data: null, expiresAt: 0 };
}

export const getAdminSettings = async (req, res) => {
  try {
    if (
      adminSettingsCache.data &&
      adminSettingsCache.expiresAt > Date.now()
    ) {
      return res.json({
        success: true,
        data: sanitizeSettings(adminSettingsCache.data),
      });
    }

    const { data, error } = await supabase
      .from("admin_settings")
      .select(PUBLIC_SETTINGS_COLUMNS)
      .eq("id", 1)
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Administrator settings were not found.",
      });
    }

    setAdminSettingsCache(data);

    return res.json({
      success: true,
      data: sanitizeSettings(data),
    });
  } catch (error) {
    return serverError(
      res,
      "Unable to load administrator settings.",
      error
    );
  }
};

export const updateAdminSettings = async (req, res) => {
  try {
    const body = req.body || {};

    const updates = {};

    if (body.admin_name !== undefined) {
      const value = String(body.admin_name).trim();

      if (!value || value.length > 120) {
        return res.status(400).json({
          success: false,
          message: "Administrator name is invalid.",
        });
      }

      updates.admin_name = value;
    }

    if (body.username !== undefined) {
      const value = String(body.username).trim();

      if (!/^[a-zA-Z0-9._-]{3,40}$/.test(value)) {
        return res.status(400).json({
          success: false,
          message:
            "Username must be 3–40 characters and contain only letters, numbers, dots, underscores or hyphens.",
        });
      }

      updates.username = value;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid profile changes were provided.",
      });
    }

    const { data, error } = await supabase
      .from("admin_settings")
      .update(updates)
      .eq("id", 1)
      .select(PUBLIC_SETTINGS_COLUMNS)
      .single();

    if (error) throw error;

    clearAdminSettingsCache();

    return res.json({
      success: true,
      message: "Administrator profile updated successfully.",
      data: sanitizeSettings(data),
    });
  } catch (error) {
    return serverError(
      res,
      "Unable to update administrator profile.",
      error
    );
  }
};

export const updateAdminEmail = async (req, res) => {
  try {
    const email = String(
      req.body?.email ||
        req.body?.admin_email ||
        req.body?.school_email ||
        ""
    )
      .trim()
      .toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    const { data: existing, error: lookupError } = await supabase
      .from("admin_settings")
      .select("id")
      .eq("admin_email", email)
      .neq("id", 1)
      .limit(1);

    if (lookupError) throw lookupError;

    if (existing?.length) {
      return res.status(409).json({
        success: false,
        message: "That administrator email is already in use.",
      });
    }

    const { data, error } = await supabase
      .from("admin_settings")
      .update({
        admin_email: email,
        school_email: email,
      })
      .eq("id", 1)
      .select(PUBLIC_SETTINGS_COLUMNS)
      .single();

    if (error) throw error;

    // Existing sessions continue to work because their JWT carries
    // the old email. Revoke them so the admin must authenticate again
    // with the new email.
    await supabase
      .from("admin_sessions")
      .update({ revoked_at: new Date().toISOString() })
      .eq("admin_email", req.admin.email)
      .is("revoked_at", null);

    clearAdminSettingsCache();

    return res.json({
      success: true,
      message:
        "Administrator email updated. Please log in again with the new email.",
      data: sanitizeSettings(data),
      requiresLogin: true,
    });
  } catch (error) {
    return serverError(
      res,
      "Unable to update administrator email.",
      error
    );
  }
};

export const changeAdminPassword = async (req, res) => {
  try {
    const currentPassword = String(req.body?.currentPassword || "");
    const newPassword = String(req.body?.newPassword || "");

    if (!currentPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password is required.",
      });
    }

    if (!newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password is required.",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 8 characters.",
      });
    }

    if (newPassword.length > 128) {
      return res.status(400).json({
        success: false,
        message: "New password is too long.",
      });
    }

    if (newPassword === currentPassword) {
      return res.status(400).json({
        success: false,
        message:
          "New password must be different from your current password.",
      });
    }

    const { data: admin, error: readError } = await supabase
      .from("admin_settings")
      .select("id, password")
      .eq("id", 1)
      .single();

    if (readError) throw readError;

    const valid = await passwordMatches(
      currentPassword,
      admin.password
    );

    if (!valid) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    const now = new Date().toISOString();

    const { error: updateError } = await supabase
      .from("admin_settings")
      .update({ password: passwordHash })
      .eq("id", 1);

    if (updateError) throw updateError;

    // Password changes invalidate every other device immediately.
    await supabase
      .from("admin_sessions")
      .update({ revoked_at: now })
      .eq("admin_email", req.admin.email)
      .neq("token_id", req.admin.tokenId)
      .is("revoked_at", null);

    // Keep the current session alive and update it.
    await supabase
      .from("admin_sessions")
      .update({ last_seen_at: now })
      .eq("token_id", req.admin.tokenId)
      .is("revoked_at", null);

    return res.json({
      success: true,
      message:
        "Password changed successfully. Other devices were signed out for security.",
    });
  } catch (error) {
    return serverError(
      res,
      "Unable to change administrator password.",
      error
    );
  }
};

export const getLoginActivity = async (req, res) => {
  try {
    const now = new Date().toISOString();

    await supabase
      .from("admin_sessions")
      .update({ revoked_at: now })
      .eq("admin_email", req.admin.email)
      .is("revoked_at", null)
      .lte("expires_at", now);

    const { data, error } = await supabase
      .from("admin_sessions")
      .select(
        "id, admin_email, token_id, device_type, device_name, browser, os, user_agent, ip_address, location, created_at, last_seen_at, expires_at, revoked_at"
      )
      .eq("admin_email", req.admin.email)
      .is("revoked_at", null)
      .gt("expires_at", now)
      .order("last_seen_at", { ascending: false });

    if (error) throw error;

    const sessions = (data || []).map((session) => ({
      id: session.id,
      device_type: session.device_type,
      device: session.device_name,
      browser: session.browser,
      os: session.os,
      ip: session.ip_address || "",
      location: session.location || "Unknown",
      login_time: session.created_at,
      last_active: session.last_seen_at,
      expires_at: session.expires_at,
      is_active: true,
      is_current:
        String(session.token_id) === String(req.admin.tokenId),
      status:
        String(session.token_id) === String(req.admin.tokenId)
          ? "Current session"
          : "Active session",
    }));

    return res.json({
      success: true,
      data: sessions,
      current_session_id: req.admin.sessionId,
      max_devices: 4,
    });
  } catch (error) {
    return serverError(
      res,
      "Unable to load login sessions.",
      error
    );
  }
};

export const logoutDevice = async (req, res) => {
  try {
    const sessionId = String(req.params.id || "").trim();

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "Session id is required.",
      });
    }

    const { data: session, error: readError } = await supabase
      .from("admin_sessions")
      .select("id, admin_email, token_id, revoked_at")
      .eq("id", sessionId)
      .eq("admin_email", req.admin.email)
      .maybeSingle();

    if (readError) throw readError;

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found.",
      });
    }

    if (String(session.token_id) === String(req.admin.tokenId)) {
      return res.status(400).json({
        success: false,
        message:
          "You cannot log out the current device from this list.",
      });
    }

    if (session.revoked_at) {
      return res.json({
        success: true,
        message: "That device is already logged out.",
      });
    }

    const { error } = await supabase
      .from("admin_sessions")
      .update({ revoked_at: new Date().toISOString() })
      .eq("id", sessionId)
      .eq("admin_email", req.admin.email);

    if (error) throw error;

    return res.json({
      success: true,
      message: "Device logged out successfully.",
    });
  } catch (error) {
    return serverError(
      res,
      "Unable to log out the selected device.",
      error
    );
  }
};

export const logoutOtherDevices = async (req, res) => {
  try {
    const { error } = await supabase
      .from("admin_sessions")
      .update({ revoked_at: new Date().toISOString() })
      .eq("admin_email", req.admin.email)
      .neq("token_id", req.admin.tokenId)
      .is("revoked_at", null);

    if (error) throw error;

    return res.json({
      success: true,
      message: "All other devices have been logged out.",
    });
  } catch (error) {
    return serverError(
      res,
      "Unable to log out other devices.",
      error
    );
  }
};

export const uploadAdminPhoto = async (req, res) => {
  try {
    const photo = String(
      req.body?.photo_url ||
        req.body?.profile_photo ||
        req.body?.image ||
        ""
    ).trim();

    if (!photo) {
      return res.status(400).json({
        success: false,
        message: "Profile photo is required.",
      });
    }

    if (
      !photo.startsWith("http://") &&
      !photo.startsWith("https://") &&
      !photo.startsWith("data:image/")
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid profile photo format.",
      });
    }

    // Limit base64 uploads so a huge request cannot fill the database.
    if (photo.startsWith("data:image/") && photo.length > 8_000_000) {
      return res.status(413).json({
        success: false,
        message: "Profile photo is too large.",
      });
    }

    const { data, error } = await supabase
      .from("admin_settings")
      .update({ profile_photo: photo })
      .eq("id", 1)
      .select(PUBLIC_SETTINGS_COLUMNS)
      .single();

    if (error) throw error;

    clearAdminSettingsCache();

    return res.json({
      success: true,
      message: "Profile photo updated successfully.",
      data: sanitizeSettings(data),
    });
  } catch (error) {
    return serverError(
      res,
      "Unable to update profile photo.",
      error
    );
  }
};

// ------------------------------------------------------------
// OPTIONAL PASSWORD RECOVERY
// Kept because your current frontend/routes already use these.
// ------------------------------------------------------------

export const forgotPassword = async (req, res) => {
  const genericMessage =
    "If that administrator email exists, a verification code has been sent.";

  try {
    const email = String(req.body?.email || "")
      .trim()
      .toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid administrator email.",
      });
    }

    const { data: admin, error } = await supabase
      .from("admin_settings")
      .select("id, admin_email")
      .eq("admin_email", email)
      .maybeSingle();

    if (error) throw error;

    if (!admin) {
      return res.json({
        success: true,
        message: genericMessage,
      });
    }

    if (!transporter) {
      return res.status(500).json({
        success: false,
        message:
          "Email recovery is not configured. Set MAIL_USER and MAIL_PASS in .env.",
      });
    }

    const otp = crypto.randomInt(100000, 1000000).toString();

    otpStore.set(email, {
      hash: crypto
        .createHash("sha256")
        .update(otp)
        .digest("hex"),
      expiresAt: Date.now() + OTP_MINUTES * 60 * 1000,
      verified: false,
    });

    await transporter.sendMail({
      from: `"Red Rose School" <${MAIL_USER}>`,
      to: email,
      subject: "Red Rose School - Administrator Password Reset",
      text:
        `Your password reset verification code is ${otp}. ` +
        `It expires in ${OTP_MINUTES} minutes.`,
    });

    return res.json({
      success: true,
      message: genericMessage,
    });
  } catch (error) {
    return serverError(
      res,
      "Unable to start password recovery.",
      error
    );
  }
};

export const verifyForgotPasswordOtp = async (req, res) => {
  try {
    const email = String(req.body?.email || "")
      .trim()
      .toLowerCase();

    const otp = String(req.body?.otp || "").trim();

    const record = otpStore.get(email);

    if (!email || !otp || !record) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code.",
      });
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(email);

      return res.status(400).json({
        success: false,
        message: "Verification code has expired.",
      });
    }

    const hash = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    if (hash !== record.hash) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification code.",
      });
    }

    otpStore.set(email, {
      ...record,
      verified: true,
    });

    return res.json({
      success: true,
      message: "Verification code accepted.",
    });
  } catch (error) {
    return serverError(
      res,
      "Unable to verify the recovery code.",
      error
    );
  }
};

export const resetPassword = async (req, res) => {
  try {
    const email = String(req.body?.email || "")
      .trim()
      .toLowerCase();

    const newPassword = String(
      req.body?.newPassword ||
        req.body?.password ||
        ""
    );

    const record = otpStore.get(email);

    if (!record?.verified) {
      return res.status(400).json({
        success: false,
        message: "Verify the recovery code first.",
      });
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(email);

      return res.status(400).json({
        success: false,
        message: "Recovery session has expired.",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters.",
      });
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    const now = new Date().toISOString();

    const { error } = await supabase
      .from("admin_settings")
      .update({
        password: passwordHash,
        admin_email: email,
        school_email: email,
      })
      .eq("id", 1);

    if (error) throw error;

    await supabase
      .from("admin_sessions")
      .update({ revoked_at: now })
      .eq("admin_email", email)
      .is("revoked_at", null);

    otpStore.delete(email);

    return res.json({
      success: true,
      message:
        "Password reset successfully. Please log in again.",
    });
  } catch (error) {
    return serverError(
      res,
      "Unable to reset administrator password.",
      error
    );
  }
};