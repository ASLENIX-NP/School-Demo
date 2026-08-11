import nodemailer from "nodemailer";

import { supabase } from "../config/supabase.js";

import {
  getFallbackData,
  setFallbackData,
} from "../utils/storageHelper.js";

// =====================================================
// EMAIL CONFIGURATION
// =====================================================

const MAIL_USER =
  process.env.MAIL_USER ||
  "edutaskcalendar@gmail.com";

const MAIL_PASS =
  process.env.MAIL_PASS;

// =====================================================
// NODEMAILER
// =====================================================

const transporter =
  nodemailer.createTransport({
    service: "gmail",

    auth: {
      user: MAIL_USER,
      pass: MAIL_PASS,
    },
  });

// =====================================================
// PASSWORD RECOVERY EMAILS
// =====================================================

const ALLOWED_PASSWORD_RESET_EMAILS = [
  "admin@school.com",
  "adhikarisonica88@gmail.com",
];

// =====================================================
// OTP STORAGE
// =====================================================

const otpStore = new Map();

// =====================================================
// DEFAULT ADMIN SETTINGS
// =====================================================

const DEFAULT_ADMIN_SETTINGS = {
  id: 1,
<<<<<<< HEAD
  school_name: "Red Rose Secondary English Boarding School",
  institution_name: "Red Rose Secondary English Boarding School",
  campus_location: "Basudev Marga, Hetauda-2, Makwanpur",
  address: "Basudev Marga, Hetauda-2, Makwanpur",
  academic_session: "2081 / 2082 B.S.",
  timezone: "Asia/Kathmandu (UTC +05:45)",
  school_email: "admin@redroseschool.edu.np",
  phone: "+977 057-590146",
  logo: "",
  lock_account: true,
=======

  school_name:
    "Red Rose English Boarding School",

  school_email:
    "admin@school.com",

  phone:
    "+977 9800000000",

  address:
    "Itahari, Sunsari, Nepal",

  logo: "",

  lock_account: false,

>>>>>>> 1abc8cf (Update admin password recovery and settings)
  two_factor: false,

  session_timeout: "30",

  max_login_attempts: "5",

  // DEFAULT PASSWORD
  admin_password: "admin123",
};

// =====================================================
// DEFAULT LOGIN ACTIVITY
// =====================================================

const DEFAULT_LOGIN_ACTIVITY = [
  {
    id: 1,
<<<<<<< HEAD
    device: "Chrome / Windows 11",
    browser: "Chrome",
    ip: "127.0.0.1",
    location: "Hetauda, Nepal",
    login_time: new Date().toISOString(),
    status: "Active Session",
=======

    device:
      "Chrome / Windows 11",

    ip:
      "127.0.0.1",

    location:
      "Itahari, Nepal",

    time:
      "Just now",

    status:
      "Active Session",
>>>>>>> 1abc8cf (Update admin password recovery and settings)
  },

  {
    id: 2,
<<<<<<< HEAD
    device: "Safari / iPhone 16",
    browser: "Safari",
    ip: "110.44.112.5",
    location: "Kathmandu, Nepal",
    login_time: new Date(Date.now() - 7200000).toISOString(),
    status: "Successful",
=======

    device:
      "Safari / iPhone 15",

    ip:
      "110.44.112.5",

    location:
      "Kathmandu, Nepal",

    time:
      "2 hours ago",

    status:
      "Successful",
>>>>>>> 1abc8cf (Update admin password recovery and settings)
  },
];

// =====================================================
// GET ADMIN SETTINGS
// =====================================================

export const getAdminSettings =
  async (req, res) => {
    try {
      const {
        data,
        error,
      } = await supabase
        .from("admin_settings")
        .select("*")
        .eq("id", 1)
        .maybeSingle();

      if (!error && data) {
        return res.json({
          success: true,
          data,
        });
      }
    } catch (error) {
      console.warn(
        "Supabase admin settings fetch error:",
        error.message
      );
    }

    const settings =
      getFallbackData(
        "admin_settings",
        DEFAULT_ADMIN_SETTINGS
      );

    return res.json({
      success: true,
      data: settings,
    });
  };

// =====================================================
// UPDATE ADMIN SETTINGS
// =====================================================

export const updateAdminSettings =
  async (req, res) => {
    const updates =
      req.body || {};

    try {
      const {
        data,
        error,
      } = await supabase
        .from("admin_settings")
        .upsert({
          id: 1,
          ...updates,
        })
        .select();

      if (!error) {
        const currentSettings =
          getFallbackData(
            "admin_settings",
            DEFAULT_ADMIN_SETTINGS
          );

        const merged = {
          ...currentSettings,
          ...updates,
        };

        setFallbackData(
          "admin_settings",
          merged
        );

        return res.json({
          success: true,

          message:
            "Admin settings updated successfully.",

          data:
            data?.[0] ||
            merged,
        });
      }
    } catch (error) {
      console.warn(
        "Supabase update admin settings error:",
        error.message
      );
    }

    // Fallback storage

    const settings =
      getFallbackData(
        "admin_settings",
        DEFAULT_ADMIN_SETTINGS
      );

    const merged = {
      ...settings,
      ...updates,
    };

    setFallbackData(
      "admin_settings",
      merged
    );

    return res.json({
      success: true,

      message:
        "Admin settings updated successfully.",

      data: merged,
    });
  };

// =====================================================
// GET LOGIN ACTIVITY
// =====================================================

export const getLoginActivity =
  async (req, res) => {
    const activity =
      getFallbackData(
        "login_activity",
        DEFAULT_LOGIN_ACTIVITY
      );

    return res.json({
      success: true,
      data: activity,
    });
  };

// =====================================================
// UPLOAD ADMIN PHOTO
// =====================================================

export const uploadAdminPhoto =
  async (req, res) => {
    try {
      const {
        photo_url,
      } = req.body;

      const settings =
        getFallbackData(
          "admin_settings",
          DEFAULT_ADMIN_SETTINGS
        );

      const updated = {
        ...settings,

        logo:
          photo_url ||
          settings.logo,
      };

      setFallbackData(
        "admin_settings",
        updated
      );

      return res.json({
        success: true,

        message:
          "Admin photo updated successfully.",

        data: updated,
      });
    } catch (error) {
      console.error(
        "Upload admin photo error:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Unable to update admin photo.",
      });
    }
  };

// =====================================================
// UPDATE ADMIN EMAIL
// =====================================================

export const updateAdminEmail =
  async (req, res) => {
    try {
      const {
        school_email,
        email,
      } = req.body;

      const newEmail =
        email ||
        school_email;

<<<<<<< HEAD
export const uploadAdminPhoto = async (req, res) => {
  const { photo_url, image } = req.body;
  const url = photo_url || image;
  const settings = getFallbackData("admin_settings", DEFAULT_ADMIN_SETTINGS);
  const updated = { ...settings, profile_photo: url || settings.profile_photo, logo: url || settings.logo };
  setFallbackData("admin_settings", updated);
=======
      if (!newEmail) {
        return res.status(400).json({
          success: false,
>>>>>>> 1abc8cf (Update admin password recovery and settings)

          message:
            "Email is required.",
        });
      }

      const settings =
        getFallbackData(
          "admin_settings",
          DEFAULT_ADMIN_SETTINGS
        );

<<<<<<< HEAD
  const settings = getFallbackData("admin_settings", DEFAULT_ADMIN_SETTINGS);
  const updated = { ...settings, school_email: newEmail, admin_email: newEmail };
  setFallbackData("admin_settings", updated);
=======
      const updated = {
        ...settings,
>>>>>>> 1abc8cf (Update admin password recovery and settings)

        school_email:
          newEmail,
      };

      setFallbackData(
        "admin_settings",
        updated
      );

      return res.json({
        success: true,

        message:
          "Email updated successfully.",

        data: updated,
      });
    } catch (error) {
      console.error(
        "Update admin email error:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Unable to update email.",
      });
    }
  };

// =====================================================
// NORMAL CHANGE PASSWORD
// =====================================================

export const changeAdminPassword =
  async (req, res) => {
    try {
      const {
        password,
      } = req.body;

      if (!password) {
        return res.status(400).json({
          success: false,

          message:
            "New password is required.",
        });
      }

      if (password.length < 8) {
        return res.status(400).json({
          success: false,

          message:
            "Password must be at least 8 characters long.",
        });
      }

      const settings =
        getFallbackData(
          "admin_settings",
          DEFAULT_ADMIN_SETTINGS
        );

      const updated = {
        ...settings,

        admin_password:
          password,
      };

      // Save fallback
      setFallbackData(
        "admin_settings",
        updated
      );

      // Save Supabase
      try {
        await supabase
          .from("admin_settings")
          .upsert({
            id: 1,

            admin_password:
              password,
          });
      } catch (supabaseError) {
        console.warn(
          "Could not save password to Supabase:",
          supabaseError.message
        );
      }

      return res.json({
        success: true,

        message:
          "Password changed successfully.",
      });
    } catch (error) {
      console.error(
        "Change password error:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Unable to change password.",
      });
    }
  };

// =====================================================
// FORGOT PASSWORD
// SEND OTP
// =====================================================

export const forgotPassword =
  async (req, res) => {
    try {
      const {
        email,
      } = req.body;

      // -------------------------------------------------
      // Validate email
      // -------------------------------------------------

      if (!email) {
        return res.status(400).json({
          success: false,

          message:
            "Admin email address is required.",
        });
      }

      const submittedEmail =
        email
          .trim()
          .toLowerCase();

      // -------------------------------------------------
      // Check allowed email
      // -------------------------------------------------

      if (
        !ALLOWED_PASSWORD_RESET_EMAILS.includes(
          submittedEmail
        )
      ) {
        return res.status(400).json({
          success: false,

          message:
            "This email is not registered for password recovery.",
        });
      }

      // -------------------------------------------------
      // Check mail configuration
      // -------------------------------------------------

      if (
        !MAIL_USER ||
        !MAIL_PASS
      ) {
        console.error(
          "MAIL_USER or MAIL_PASS is missing."
        );

        return res.status(500).json({
          success: false,

          message:
            "Email service is not configured. Check MAIL_USER and MAIL_PASS.",
        });
      }

      // -------------------------------------------------
      // Generate OTP
      // -------------------------------------------------

      const otp =
        Math.floor(
          100000 +
            Math.random() *
              900000
        ).toString();

      // -------------------------------------------------
      // Expire after 10 minutes
      // -------------------------------------------------

      const expiresAt =
        Date.now() +
        10 * 60 * 1000;

      // -------------------------------------------------
      // Save OTP
      // -------------------------------------------------

      otpStore.set(
        submittedEmail,
        {
          otp,

          expiresAt,

          verified: false,
        }
      );

      console.log(
        `OTP generated for ${submittedEmail}: ${otp}`
      );

      // -------------------------------------------------
      // Send email
      // -------------------------------------------------

      await transporter.sendMail({
        from:
          `"Red Rose School" <${MAIL_USER}>`,

        to:
          submittedEmail,

        subject:
          "Red Rose School - Password Reset OTP",

        html: `
          <div style="
            margin:0;
            padding:40px 20px;
            background:#f1f5f9;
            font-family:Arial,Helvetica,sans-serif;
          ">

            <div style="
              max-width:600px;
              margin:auto;
              background:#ffffff;
              border-radius:20px;
              overflow:hidden;
              box-shadow:0 10px 30px rgba(0,0,0,0.08);
            ">

              <div style="
                padding:30px;
                text-align:center;
                color:white;
                background:linear-gradient(
                  135deg,
                  #2563eb,
                  #38bdf8
                );
              ">

                <h1 style="
                  margin:0;
                  font-size:28px;
                ">
                  Red Rose School
                </h1>

                <p style="
                  margin:8px 0 0;
                  opacity:0.9;
                ">
                  School Management Portal
                </p>

              </div>

              <div style="
                padding:35px;
              ">

                <h2 style="
                  color:#0f172a;
                  margin-top:0;
                ">
                  Password Reset
                </h2>

                <p style="
                  color:#475569;
                  line-height:1.7;
                ">
                  We received a request to reset
                  your administrator password.
                </p>

                <p style="
                  color:#475569;
                ">
                  Your verification OTP is:
                </p>

                <div style="
                  margin:25px 0;
                  padding:20px;
                  text-align:center;
                  background:#eff6ff;
                  border-radius:15px;
                  border:1px solid #bfdbfe;
                ">

                  <span style="
                    font-size:38px;
                    font-weight:bold;
                    letter-spacing:10px;
                    color:#2563eb;
                  ">
                    ${otp}
                  </span>

                </div>

                <p style="
                  color:#64748b;
                  line-height:1.6;
                ">
                  This OTP will expire in
                  <strong>10 minutes</strong>.
                </p>

                <p style="
                  color:#64748b;
                  line-height:1.6;
                ">
                  If you did not request this,
                  you can safely ignore this email.
                </p>

              </div>

              <div style="
                padding:20px;
                text-align:center;
                background:#f8fafc;
                color:#94a3b8;
                font-size:13px;
              ">
                © 2026 Red Rose School.
                All Rights Reserved.
              </div>

            </div>
          </div>
        `,
      });

      return res.json({
        success: true,

        message:
          `OTP has been sent to ${submittedEmail}.`,
      });
    } catch (error) {
      console.error(
        "Forgot password error:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Unable to send OTP. Please check your email configuration.",
      });
    }
  };

// =====================================================
// VERIFY OTP
// =====================================================

export const verifyForgotPasswordOtp =
  async (req, res) => {
    try {
      const {
        email,
        otp,
      } = req.body;

      // -------------------------------------------------
      // Validate
      // -------------------------------------------------

      if (!email || !otp) {
        return res.status(400).json({
          success: false,

          message:
            "Email and OTP are required.",
        });
      }

      const submittedEmail =
        email
          .trim()
          .toLowerCase();

      const submittedOtp =
        otp.trim();

      // -------------------------------------------------
      // Check allowed email
      // -------------------------------------------------

      if (
        !ALLOWED_PASSWORD_RESET_EMAILS.includes(
          submittedEmail
        )
      ) {
        return res.status(400).json({
          success: false,

          message:
            "This email is not registered for password recovery.",
        });
      }

      // -------------------------------------------------
      // Get OTP
      // -------------------------------------------------

      const storedData =
        otpStore.get(
          submittedEmail
        );

      if (!storedData) {
        return res.status(400).json({
          success: false,

          message:
            "OTP not found. Please request a new OTP.",
        });
      }

      // -------------------------------------------------
      // Check expiry
      // -------------------------------------------------

      if (
        Date.now() >
        storedData.expiresAt
      ) {
        otpStore.delete(
          submittedEmail
        );

        return res.status(400).json({
          success: false,

          message:
            "OTP has expired. Please request a new OTP.",
        });
      }

      // -------------------------------------------------
      // Check OTP
      // -------------------------------------------------

      if (
        storedData.otp !==
        submittedOtp
      ) {
        return res.status(400).json({
          success: false,

          message:
            "Invalid OTP.",
        });
      }

      // -------------------------------------------------
      // Mark verified
      // -------------------------------------------------

      storedData.verified =
        true;

      otpStore.set(
        submittedEmail,
        storedData
      );

      return res.json({
        success: true,

        message:
          "OTP verified successfully.",
      });
    } catch (error) {
      console.error(
        "OTP verification error:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Unable to verify OTP.",
      });
    }
  };

// =====================================================
// RESET PASSWORD
// =====================================================

export const resetPassword =
  async (req, res) => {
    try {
      const {
        email,
        password,
      } = req.body;

      // -------------------------------------------------
      // Validate
      // -------------------------------------------------

      if (!email || !password) {
        return res.status(400).json({
          success: false,

          message:
            "Email and new password are required.",
        });
      }

      const submittedEmail =
        email
          .trim()
          .toLowerCase();

      // -------------------------------------------------
      // Check allowed email
      // -------------------------------------------------

      if (
        !ALLOWED_PASSWORD_RESET_EMAILS.includes(
          submittedEmail
        )
      ) {
        return res.status(400).json({
          success: false,

          message:
            "This email is not registered for password recovery.",
        });
      }

      // -------------------------------------------------
      // Password length
      // -------------------------------------------------

      if (password.length < 8) {
        return res.status(400).json({
          success: false,

          message:
            "Password must be at least 8 characters long.",
        });
      }

      // -------------------------------------------------
      // Get OTP session
      // -------------------------------------------------

      const storedData =
        otpStore.get(
          submittedEmail
        );

      if (!storedData) {
        return res.status(400).json({
          success: false,

          message:
            "Password reset session not found. Please request a new OTP.",
        });
      }

      // -------------------------------------------------
      // OTP must be verified
      // -------------------------------------------------

      if (
        !storedData.verified
      ) {
        return res.status(400).json({
          success: false,

          message:
            "Please verify the OTP before resetting your password.",
        });
      }

      // -------------------------------------------------
      // Check expiry
      // -------------------------------------------------

      if (
        Date.now() >
        storedData.expiresAt
      ) {
        otpStore.delete(
          submittedEmail
        );

        return res.status(400).json({
          success: false,

          message:
            "OTP session has expired. Please request a new OTP.",
        });
      }

      // =================================================
      // GET CURRENT SETTINGS
      // =================================================

      const settings =
        getFallbackData(
          "admin_settings",
          DEFAULT_ADMIN_SETTINGS
        );

      // =================================================
      // CREATE UPDATED SETTINGS
      // =================================================

      const updatedSettings = {
        ...settings,

        // THIS IS THE NEW PASSWORD
        admin_password:
          password,
      };

      // =================================================
      // SAVE TO FALLBACK STORAGE
      // =================================================

      setFallbackData(
        "admin_settings",
        updatedSettings
      );

      // =================================================
      // SAVE TO SUPABASE
      // =================================================
      //
      // This is important so that the password is not
      // only stored temporarily in the Node process.
      // =================================================

      const {
        error: supabaseError,
      } = await supabase
        .from("admin_settings")
        .upsert({
          id: 1,

          admin_password:
            password,
        });

      if (supabaseError) {
        console.warn(
          "Could not save new password to Supabase:",
          supabaseError.message
        );
      }

      // =================================================
      // REMOVE OTP
      // =================================================

      otpStore.delete(
        submittedEmail
      );

      console.log(
        `Password successfully changed for ${submittedEmail}`
      );

      // =================================================
      // SUCCESS
      // =================================================

      return res.json({
        success: true,

        message:
          "Password reset successful. You can now log in with your new password.",
      });
    } catch (error) {
      console.error(
        "Reset password error:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Unable to reset password. Please try again.",
      });
    }
  };