import jwt from "jsonwebtoken";
import { supabase } from "../config/supabase.js";

function getBearerToken(req) {
  const header = String(req.headers.authorization || "");

  if (!header.startsWith("Bearer ")) {
    return "";
  }

  return header.slice(7).trim();
}

export const protectAdmin = async (req, res, next) => {
  try {
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: "JWT_SECRET is missing in backend .env.",
      });
    }

    const token = getBearerToken(req);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (!decoded?.tokenId || !decoded?.email) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin session.",
      });
    }

    const now = new Date().toISOString();

    const { data: session, error } = await supabase
      .from("admin_sessions")
      .select(
        `
        id,
        admin_email,
        token_id,
        device_type,
        device_name,
        browser,
        os,
        ip_address,
        location,
        created_at,
        last_seen_at,
        expires_at,
        revoked_at
        `
      )
      .eq(
        "token_id",
        decoded.tokenId
      )
      .eq(
        "admin_email",
        String(decoded.email).toLowerCase()
      )
      .is(
        "revoked_at",
        null
      )
      .gt(
        "expires_at",
        now
      )
      .maybeSingle();

    if (error) {
      console.error(
        "Admin session validation error:",
        error.message
      );

      return res.status(500).json({
        success: false,
        message: "Could not validate admin session.",
      });
    }

    if (!session) {
      return res.status(401).json({
        success: false,
        message:
          "Admin session is expired or logged out.",
      });
    }

    // Update last activity time. This is fire-and-forget (no `await`)
    // so a slow or stuck Supabase write can never hang the response
    // that the client is waiting on. If it fails, we just log it —
    // it's a housekeeping field, not something the request depends on.
    supabase
      .from("admin_sessions")
      .update({
        last_seen_at: now,
      })
      .eq(
        "id",
        session.id
      )
      .then(({ error: updateError }) => {
        if (updateError) {
          console.error(
            "Failed to update last_seen_at:",
            updateError.message
          );
        }
      });

    req.admin = {
      email: String(
        decoded.email
      ).toLowerCase(),

      role:
        decoded.role ||
        "admin",

      tokenId:
        decoded.tokenId,

      sessionId:
        session.id,

      session,
    };

    next();
  } catch (error) {
    if (
      error?.name ===
        "TokenExpiredError" ||
      error?.name ===
        "JsonWebTokenError"
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Admin session is invalid or expired.",
      });
    }

    console.error(
      "Admin authentication error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to authenticate administrator.",
    });
  }
};