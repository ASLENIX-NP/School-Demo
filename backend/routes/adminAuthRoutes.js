import express from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { UAParser } from "ua-parser-js";
import { supabase } from "../config/supabase.js";
import { protectAdmin } from "../middleware/adminAuthMiddleware.js";

const router = express.Router();

const MAX_ADMIN_DEVICES = 4;
const SESSION_DAYS = 7;

function getClientIp(req) {
  const forwarded = String(req.headers["x-forwarded-for"] || "")
    .split(",")[0]
    .trim();

  return forwarded || req.ip || req.socket?.remoteAddress || "";
}

function getLocation(ip) {
  if (!ip) return "Unknown";
  if (
    ip === "127.0.0.1" ||
    ip === "::1" ||
    ip.startsWith("192.168.") ||
    ip.startsWith("10.") ||
    ip.startsWith("172.16.") ||
    ip.startsWith("172.17.") ||
    ip.startsWith("172.18.") ||
    ip.startsWith("172.19.") ||
    ip.startsWith("172.2") ||
    ip.startsWith("172.30.") ||
    ip.startsWith("172.31.")
  ) {
    return "Local network";
  }
  return "Unknown";
}

function normalizeRole(role) {
  return String(role || "admin")
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ");
}

async function verifyPassword(plain, stored) {
  const value = String(stored || "");
  if (!value) return false;

  if (
    value.startsWith("$2a$") ||
    value.startsWith("$2b$") ||
    value.startsWith("$2y$")
  ) {
    return bcrypt.compare(String(plain || ""), value);
  }

  // One-time legacy compatibility.
  return String(plain || "") === value;
}

router.post("/login", async (req, res) => {
  try {
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: "JWT_SECRET is missing in backend .env.",
      });
    }

    const email = String(req.body?.email || "")
      .trim()
      .toLowerCase();

    const password = String(req.body?.password || "");

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const { data: admin, error } = await supabase
      .from("admin_settings")
      .select(
        "id, admin_name, username, admin_email, role, password, profile_photo"
      )
      .eq("admin_email", email)
      .maybeSingle();

    if (error) {
      console.error("Admin login database error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Could not access the administrator account.",
      });
    }

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const passwordMatches = await verifyPassword(password, admin.password);

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Upgrade a legacy plaintext password immediately.
    if (
      admin.password &&
      !String(admin.password).startsWith("$2a$") &&
      !String(admin.password).startsWith("$2b$") &&
      !String(admin.password).startsWith("$2y$")
    ) {
      const hashed = await bcrypt.hash(password, 12);

      await supabase
        .from("admin_settings")
        .update({ password: hashed })
        .eq("id", admin.id);
    }

    const userAgent = String(req.headers["user-agent"] || "");
    const ipAddress = getClientIp(req);

    // Re-login from the exact same browser/IP should replace the old
    // session instead of consuming another device slot.
    await supabase
      .from("admin_sessions")
      .update({ revoked_at: new Date().toISOString() })
      .eq("admin_email", email)
      .eq("user_agent", userAgent)
      .eq("ip_address", ipAddress)
      .is("revoked_at", null);

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
    const os =
      parsed.os?.name
        ? `${parsed.os.name}${parsed.os.version ? ` ${parsed.os.version}` : ""}`
        : "Unknown OS";

    const tokenId = crypto.randomUUID();
    const expiresAt = new Date(
      Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000
    ).toISOString();

    const { data: session, error: sessionError } = await supabase.rpc(
      "create_admin_session",
      {
        p_admin_email: email,
        p_token_id: tokenId,
        p_device_type: deviceType,
        p_device_name: deviceName,
        p_browser: browser,
        p_os: os,
        p_user_agent: userAgent,
        p_ip_address: ipAddress,
        p_location: getLocation(ipAddress),
        p_expires_at: expiresAt,
      }
    );

    if (sessionError) {
      if (
        sessionError.message?.includes("MAX_ADMIN_DEVICES") ||
        sessionError.code === "P0001"
      ) {
        return res.status(403).json({
          success: false,
          message:
            `Maximum ${MAX_ADMIN_DEVICES} devices are already logged in. Log out another device first.`,
        });
      }

      console.error("Admin session creation error:", sessionError);

      return res.status(500).json({
        success: false,
        message: "Could not create the admin session.",
      });
    }

    const token = jwt.sign(
      {
        email,
        role: normalizeRole(admin.role),
        tokenId,
      },
      process.env.JWT_SECRET,
      { expiresIn: `${SESSION_DAYS}d` }
    );

    return res.json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: admin.id,
        email,
        name: admin.admin_name || "School Administrator",
        username: admin.username || "admin",
        role: normalizeRole(admin.role),
        profile_photo: admin.profile_photo || "",
      },
      session: {
        id: session?.id || null,
        tokenId,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to log in. Please try again.",
    });
  }
});

router.post("/logout", async (req, res) => {
  try {
    const header = String(req.headers.authorization || "");
    const token = header.startsWith("Bearer ")
      ? header.slice(7).trim()
      : "";

    if (token && process.env.JWT_SECRET) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded?.tokenId) {
          await supabase
            .from("admin_sessions")
            .update({ revoked_at: new Date().toISOString() })
            .eq("token_id", decoded.tokenId);
        }
      } catch {
        // Logout remains idempotent.
      }
    }

    return res.json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch {
    return res.json({
      success: true,
      message: "Logged out.",
    });
  }
});

router.post("/logout-all", protectAdmin, async (req, res) => {
  try {
    const { error } = await supabase
      .from("admin_sessions")
      .update({ revoked_at: new Date().toISOString() })
      .eq("admin_email", req.admin.email)
      .is("revoked_at", null);

    if (error) throw error;

    return res.json({
      success: true,
      message: "All admin devices have been logged out.",
    });
  } catch (error) {
    console.error("Logout all devices error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not log out all devices.",
    });
  }
});

router.get("/me", protectAdmin, async (req, res) => {
  return res.json({
    success: true,
    admin: {
      email: req.admin.email,
      role: req.admin.role,
      sessionId: req.admin.sessionId,
    },
  });
});

export default router;