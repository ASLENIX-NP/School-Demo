import express from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { UAParser } from "ua-parser-js";

import { supabase } from "../config/supabase.js";
import { protectAdmin } from "../middleware/adminAuthMiddleware.js";

const router = express.Router();

// =====================================================
// ADMIN SESSION CONFIGURATION
// =====================================================

const MAX_ADMIN_DEVICES = 4;
const SESSION_DAYS = 7;

// =====================================================
// ADMIN CONFIGURATION
// =====================================================

const DEFAULT_ADMIN_EMAIL = "ebsredrose@gmail.com";
const DEFAULT_ADMIN_PASSWORD = "admin123";

// =====================================================
// GET CLIENT IP
// =====================================================

function getClientIp(req) {
  const forwarded = String(
    req.headers["x-forwarded-for"] || ""
  )
    .split(",")[0]
    .trim();

  return (
    forwarded ||
    req.ip ||
    req.socket?.remoteAddress ||
    ""
  );
}

// =====================================================
// GET LOCATION
// =====================================================

function getLocation(ip) {
  if (!ip) {
    return "Unknown";
  }

  if (
    ip === "127.0.0.1" ||
    ip === "::1" ||
    ip.startsWith("192.168.") ||
    ip.startsWith("10.") ||
    ip.startsWith("172.16.") ||
    ip.startsWith("172.17.") ||
    ip.startsWith("172.18.") ||
    ip.startsWith("172.19.") ||
    ip.startsWith("172.20.") ||
    ip.startsWith("172.21.") ||
    ip.startsWith("172.22.") ||
    ip.startsWith("172.23.") ||
    ip.startsWith("172.24.") ||
    ip.startsWith("172.25.") ||
    ip.startsWith("172.26.") ||
    ip.startsWith("172.27.") ||
    ip.startsWith("172.28.") ||
    ip.startsWith("172.29.") ||
    ip.startsWith("172.30.") ||
    ip.startsWith("172.31.")
  ) {
    return "Local network";
  }

  return "Unknown";
}

// =====================================================
// NORMALIZE ROLE
// =====================================================

function normalizeRole(role) {
  return String(role || "admin")
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ");
}

// =====================================================
// CHECK PASSWORD
// =====================================================
//
// Supports:
// 1. bcrypt passwords
// 2. legacy plaintext passwords
//
// After successful legacy login, the password is
// automatically converted to bcrypt.
//

async function verifyPassword(plainPassword, storedPassword) {
  const stored = String(storedPassword || "");
  const plain = String(plainPassword || "");

  if (!stored || !plain) {
    return false;
  }

  // bcrypt
  if (
    stored.startsWith("$2a$") ||
    stored.startsWith("$2b$") ||
    stored.startsWith("$2y$")
  ) {
    try {
      return await bcrypt.compare(plain, stored);
    } catch (error) {
      console.error(
        "bcrypt password verification error:",
        error
      );

      return false;
    }
  }

  // Legacy plaintext compatibility
  return plain === stored;
}

// =====================================================
// CREATE ADMIN JWT
// =====================================================

function createAdminToken({
  email,
  role,
  tokenId,
}) {
  if (!process.env.JWT_SECRET) {
    throw new Error(
      "JWT_SECRET is missing in backend .env."
    );
  }

  return jwt.sign(
    {
      email,
      role,
      tokenId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: `${SESSION_DAYS}d`,
    }
  );
}

// =====================================================
// ADMIN LOGIN
// =====================================================

router.post("/login", async (req, res) => {
  try {
    // -------------------------------------------------
    // Check JWT secret
    // -------------------------------------------------

    if (!process.env.JWT_SECRET) {
      console.error(
        "JWT_SECRET is missing in backend .env."
      );

      return res.status(500).json({
        success: false,
        message:
          "JWT_SECRET is missing in backend .env.",
      });
    }

    // -------------------------------------------------
    // Get submitted credentials
    // -------------------------------------------------

    const email = String(
      req.body?.email || ""
    )
      .trim()
      .toLowerCase();

    const password = String(
      req.body?.password || ""
    );

    // -------------------------------------------------
    // Validate credentials
    // -------------------------------------------------

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required.",
      });
    }

    // -------------------------------------------------
    // Find admin account
    //
    // IMPORTANT:
    // Your Supabase table uses:
    //
    // admin_email
    // password
    //
    // NOT:
    //
    // school_email
    // admin_password
    // -------------------------------------------------

    const { data: admin, error } =
      await supabase
        .from("admin_settings")
        .select("*")
        .eq("admin_email", email)
        .maybeSingle();

    // -------------------------------------------------
    // Database error
    // -------------------------------------------------

    if (error) {
      console.error(
        "Admin login database error:",
        error.message
      );

      return res.status(500).json({
        success: false,
        message:
          "Could not access the administrator account.",
      });
    }

    // -------------------------------------------------
    // Admin not found
    // -------------------------------------------------

    if (!admin) {
      console.log(
        `Admin account not found for email: ${email}`
      );

      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });
    }

    // -------------------------------------------------
    // Get password from database
    //
    // Your actual column is:
    // password
    // -------------------------------------------------

    const storedPassword =
      admin.password;

    if (!storedPassword) {
      console.error(
        "Admin account has no password stored."
      );

      return res.status(500).json({
        success: false,
        message:
          "Administrator password is not configured.",
      });
    }

    // -------------------------------------------------
    // Verify password
    // -------------------------------------------------

    const passwordMatches =
      await verifyPassword(
        password,
        storedPassword
      );

    if (!passwordMatches) {
      console.log(
        `Invalid password attempt for: ${email}`
      );

      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });
    }

    // -------------------------------------------------
    // Upgrade legacy plaintext password
    // -------------------------------------------------

    const isBcryptPassword =
      String(storedPassword).startsWith(
        "$2a$"
      ) ||
      String(storedPassword).startsWith(
        "$2b$"
      ) ||
      String(storedPassword).startsWith(
        "$2y$"
      );

    if (!isBcryptPassword) {
      try {
        const hashedPassword =
          await bcrypt.hash(
            password,
            12
          );

        const {
          error: passwordUpdateError,
        } = await supabase
          .from("admin_settings")
          .update({
            password: hashedPassword,
          })
          .eq("id", admin.id);

        if (passwordUpdateError) {
          console.warn(
            "Could not upgrade legacy password:",
            passwordUpdateError.message
          );
        }
      } catch (hashError) {
        console.warn(
          "Could not hash legacy password:",
          hashError.message
        );
      }
    }

    // =================================================
    // DEVICE / SESSION INFORMATION
    // =================================================

    const userAgent = String(
      req.headers["user-agent"] || ""
    );

    const ipAddress =
      getClientIp(req);

    // -------------------------------------------------
    // Re-login from same browser/IP
    // -------------------------------------------------

    await supabase
      .from("admin_sessions")
      .update({
        revoked_at:
          new Date().toISOString(),
      })
      .eq("admin_email", email)
      .eq("user_agent", userAgent)
      .eq("ip_address", ipAddress)
      .is("revoked_at", null);

    // -------------------------------------------------
    // Parse browser/device
    // -------------------------------------------------

    const parser =
      new UAParser(userAgent);

    const parsed =
      parser.getResult();

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

    const browser =
      parsed.browser?.name ||
      "Unknown Browser";

    const os =
      parsed.os?.name
        ? `${parsed.os.name}${
            parsed.os.version
              ? ` ${parsed.os.version}`
              : ""
          }`
        : "Unknown OS";

    // -------------------------------------------------
    // Generate session token ID
    // -------------------------------------------------

    const tokenId =
      crypto.randomUUID();

    // -------------------------------------------------
    // Session expiration
    // -------------------------------------------------

    const expiresAt =
      new Date(
        Date.now() +
          SESSION_DAYS *
            24 *
            60 *
            60 *
            1000
      ).toISOString();

    // =================================================
    // CREATE ADMIN SESSION
    // =================================================

    const {
      data: session,
      error: sessionError,
    } = await supabase.rpc(
      "create_admin_session",
      {
        p_admin_email: email,

        p_token_id: tokenId,

        p_device_type:
          deviceType,

        p_device_name:
          deviceName,

        p_browser:
          browser,

        p_os:
          os,

        p_user_agent:
          userAgent,

        p_ip_address:
          ipAddress,

        p_location:
          getLocation(ipAddress),

        p_expires_at:
          expiresAt,
      }
    );

    // -------------------------------------------------
    // Session creation error
    // -------------------------------------------------

    if (sessionError) {
      if (
        sessionError.message?.includes(
          "MAX_ADMIN_DEVICES"
        ) ||
        sessionError.code ===
          "P0001"
      ) {
        return res.status(403).json({
          success: false,
          message:
            `Maximum ${MAX_ADMIN_DEVICES} devices are already logged in. Log out another device first.`,
        });
      }

      console.error(
        "Admin session creation error:",
        sessionError
      );

      return res.status(500).json({
        success: false,
        message:
          "Could not create the admin session.",
      });
    }

    // =================================================
    // CREATE JWT
    // =================================================

    const role =
      normalizeRole(
        admin.role
      );

    const token =
      createAdminToken({
        email,
        role,
        tokenId,
      });

    // =================================================
    // SUCCESS RESPONSE
    // =================================================

    return res.json({
      success: true,

      message:
        "Login successful.",

      token,

      user: {
        id: admin.id,

        email,

        name:
          admin.admin_name ||
          "School Administrator",

        username:
          admin.username ||
          "admin",

        role,

        profile_photo:
          admin.profile_photo ||
          "",
      },

      session: {
        id:
          session?.id ||
          null,

        tokenId,
      },
    });
  } catch (error) {
    console.error(
      "Admin login error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to log in. Please try again.",
    });
  }
});

// =====================================================
// ADMIN LOGOUT
// =====================================================

router.post("/logout", async (req, res) => {
  try {
    const authorization =
      String(
        req.headers.authorization || ""
      );

    const token =
      authorization.startsWith(
        "Bearer "
      )
        ? authorization
            .slice(7)
            .trim()
        : "";

    // -------------------------------------------------
    // Revoke current session
    // -------------------------------------------------

    if (
      token &&
      process.env.JWT_SECRET
    ) {
      try {
        const decoded =
          jwt.verify(
            token,
            process.env.JWT_SECRET
          );

        if (decoded?.tokenId) {
          await supabase
            .from("admin_sessions")
            .update({
              revoked_at:
                new Date().toISOString(),
            })
            .eq(
              "token_id",
              decoded.tokenId
            );
        }
      } catch (error) {
        // Logout should remain idempotent.
        console.warn(
          "Logout token verification skipped."
        );
      }
    }

    return res.json({
      success: true,
      message:
        "Logged out successfully.",
    });
  } catch (error) {
    console.error(
      "Admin logout error:",
      error
    );

    return res.json({
      success: true,
      message:
        "Logged out.",
    });
  }
});

// =====================================================
// LOGOUT ALL DEVICES
// =====================================================

router.post(
  "/logout-all",
  protectAdmin,
  async (req, res) => {
    try {
      const adminEmail =
        req.admin?.email;

      if (!adminEmail) {
        return res.status(401).json({
          success: false,
          message:
            "Administrator session is invalid.",
        });
      }

      const {
        error,
      } = await supabase
        .from("admin_sessions")
        .update({
          revoked_at:
            new Date().toISOString(),
        })
        .eq(
          "admin_email",
          adminEmail
        )
        .is(
          "revoked_at",
          null
        );

      if (error) {
        throw error;
      }

      return res.json({
        success: true,
        message:
          "All admin devices have been logged out.",
      });
    } catch (error) {
      console.error(
        "Logout all devices error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Could not log out all devices.",
      });
    }
  }
);

// =====================================================
// CURRENT ADMIN
// =====================================================

router.get(
  "/me",
  protectAdmin,
  async (req, res) => {
    return res.json({
      success: true,

      admin: {
        id:
          req.admin?.id ||
          null,

        email:
          req.admin?.email ||
          "",

        role:
          req.admin?.role ||
          "admin",

        sessionId:
          req.admin?.sessionId ||
          null,
      },
    });
  }
);

// =====================================================
// EXPORT ROUTER
// =====================================================

export default router;