import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import { supabase } from "../config/supabase.js";

import {
  getFallbackData,
} from "../utils/storageHelper.js";

dotenv.config();

// =====================================================
// JWT CONFIGURATION
// =====================================================

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "school_management_secret_2026";

// =====================================================
// ADMIN ACCOUNT
// =====================================================

const ADMIN_EMAIL = "admin@school.com";

const DEFAULT_ADMIN_PASSWORD = "admin123";

// =====================================================
// GET CURRENT ADMIN PASSWORD
// =====================================================
//
// IMPORTANT:
//
// The old code had:
//
// const ADMIN_PASSWORD = "admin123";
//
// That meant login ALWAYS checked "admin123".
//
// This function now gets the password that was saved
// by the password-reset system.
// =====================================================

const getCurrentAdminPassword = async () => {
  try {
    // -------------------------------------------------
    // First try Supabase
    // -------------------------------------------------

    const { data, error } = await supabase
      .from("admin_settings")
      .select("admin_password")
      .eq("id", 1)
      .maybeSingle();

    if (
      !error &&
      data &&
      data.admin_password
    ) {
      return data.admin_password;
    }
  } catch (error) {
    console.warn(
      "Could not get admin password from Supabase:",
      error.message
    );
  }

  // -------------------------------------------------
  // If Supabase does not contain it,
  // use fallback storage.
  // -------------------------------------------------

  const settings = getFallbackData(
    "admin_settings",
    {
      id: 1,
      school_email: ADMIN_EMAIL,
      admin_password:
        DEFAULT_ADMIN_PASSWORD,
    }
  );

  return (
    settings?.admin_password ||
    DEFAULT_ADMIN_PASSWORD
  );
};

// =====================================================
// ADMIN LOGIN
// =====================================================

export const adminLogin = async (
  req,
  res
) => {
  try {
    const {
      email,
      password,
    } = req.body;

    // -------------------------------------------------
    // Validate fields
    // -------------------------------------------------

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide email and password.",
      });
    }

    // -------------------------------------------------
    // Clean email
    // -------------------------------------------------

    const submittedEmail =
      email.trim().toLowerCase();

    // -------------------------------------------------
    // Get CURRENT password
    // -------------------------------------------------

    const currentAdminPassword =
      await getCurrentAdminPassword();

    // -------------------------------------------------
    // Check credentials
    // -------------------------------------------------

    if (
      submittedEmail !== ADMIN_EMAIL ||
      password !== currentAdminPassword
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password. Please try again.",
      });
    }

    // -------------------------------------------------
    // Create JWT token
    // -------------------------------------------------

    const token = jwt.sign(
      {
        id: "admin-1",
        email: ADMIN_EMAIL,
        role: "admin",
      },
      JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // -------------------------------------------------
    // Return successful login
    // -------------------------------------------------

    return res.json({
      success: true,

      message:
        "Login successful",

      token,

      user: {
        id: "admin-1",
        email: ADMIN_EMAIL,
        name: "School Administrator",
        role: "admin",
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
        "Unable to login. Please try again.",
    });
  }
};

// =====================================================
// ADMIN LOGOUT
// =====================================================

export const adminLogout = async (
  req,
  res
) => {
  return res.json({
    success: true,
    message:
      "Logged out successfully.",
  });
};