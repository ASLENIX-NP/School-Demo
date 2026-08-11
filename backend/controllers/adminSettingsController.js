import nodemailer from "nodemailer";
import { supabase } from "../config/supabase.js";
import { getFallbackData, setFallbackData } from "../utils/storageHelper.js";

// =====================================================
// EMAIL CONFIGURATION
// =====================================================
const MAIL_USER = process.env.MAIL_USER || "edutaskcalendar@gmail.com";
const MAIL_PASS = process.env.MAIL_PASS;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS,
  },
});

const ALLOWED_PASSWORD_RESET_EMAILS = [
  "admin@school.com",
  "admin@redroseschool.edu.np",
  "adhikarisonica88@gmail.com",
];

const otpStore = new Map();

// =====================================================
// DEFAULT ADMIN SETTINGS
// =====================================================
const DEFAULT_ADMIN_SETTINGS = {
  id: 1,
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
  two_factor: false,
  session_timeout: "30",
  max_login_attempts: "5",
  admin_password: "admin123",
};

// =====================================================
// DEFAULT LOGIN ACTIVITY
// =====================================================
const DEFAULT_LOGIN_ACTIVITY = [
  {
    id: 1,
    device: "Chrome / Windows 11",
    browser: "Chrome",
    ip: "127.0.0.1",
    location: "Hetauda, Nepal",
    login_time: new Date().toISOString(),
    status: "Active Session",
  },
  {
    id: 2,
    device: "Safari / iPhone 16",
    browser: "Safari",
    ip: "110.44.112.5",
    location: "Kathmandu, Nepal",
    login_time: new Date(Date.now() - 7200000).toISOString(),
    status: "Successful",
  },
];

// =====================================================
// GET ADMIN SETTINGS
// =====================================================
export const getAdminSettings = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("admin_settings")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (!error && data) {
      return res.json({
        success: true,
        data,
      });
    }
  } catch (err) {
    console.warn("Supabase admin_settings fetch error:", err.message);
  }

  const settings = getFallbackData("admin_settings", DEFAULT_ADMIN_SETTINGS);
  return res.json({
    success: true,
    data: settings,
  });
};

// =====================================================
// UPDATE ADMIN SETTINGS
// =====================================================
export const updateAdminSettings = async (req, res) => {
  const updates = req.body;

  try {
    const { data, error } = await supabase
      .from("admin_settings")
      .upsert({ id: 1, ...updates })
      .select();

    if (!error) {
      const settings = getFallbackData("admin_settings", DEFAULT_ADMIN_SETTINGS);
      const merged = { ...settings, ...updates };
      setFallbackData("admin_settings", merged);

      return res.json({
        success: true,
        message: "Admin settings updated successfully",
        data: data?.[0] || merged,
      });
    }
  } catch (err) {
    console.warn("Supabase update admin settings error:", err.message);
  }

  const settings = getFallbackData("admin_settings", DEFAULT_ADMIN_SETTINGS);
  const merged = { ...settings, ...updates };
  setFallbackData("admin_settings", merged);

  return res.json({
    success: true,
    message: "Admin settings updated successfully",
    data: merged,
  });
};

// =====================================================
// GET LOGIN ACTIVITY
// =====================================================
export const getLoginActivity = async (req, res) => {
  const activity = getFallbackData("login_activity", DEFAULT_LOGIN_ACTIVITY);
  return res.json({
    success: true,
    data: activity,
  });
};

// =====================================================
// UPLOAD ADMIN PHOTO
// =====================================================
export const uploadAdminPhoto = async (req, res) => {
  try {
    const { photo_url, image } = req.body;
    const url = photo_url || image;

    const settings = getFallbackData("admin_settings", DEFAULT_ADMIN_SETTINGS);
    const updated = {
      ...settings,
      profile_photo: url || settings.profile_photo,
      logo: url || settings.logo,
    };

    setFallbackData("admin_settings", updated);

    try {
      await supabase.from("admin_settings").upsert({
        id: 1,
        logo: url || settings.logo,
      });
    } catch (supabaseError) {
      console.warn("Could not save photo to Supabase:", supabaseError.message);
    }

    return res.json({
      success: true,
      message: "Admin photo updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Upload admin photo error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to update profile photo.",
    });
  }
};

// =====================================================
// UPDATE ADMIN EMAIL
// =====================================================
export const updateAdminEmail = async (req, res) => {
  try {
    const { school_email, email } = req.body;
    const newEmail = email || school_email;

    if (!newEmail) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    const settings = getFallbackData("admin_settings", DEFAULT_ADMIN_SETTINGS);
    const updated = {
      ...settings,
      school_email: newEmail,
      admin_email: newEmail,
    };

    setFallbackData("admin_settings", updated);

    try {
      await supabase.from("admin_settings").upsert({
        id: 1,
        school_email: newEmail,
      });
    } catch (supabaseError) {
      console.warn("Could not save email to Supabase:", supabaseError.message);
    }

    return res.json({
      success: true,
      message: "Email updated successfully.",
      data: updated,
    });
  } catch (error) {
    console.error("Update admin email error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to update email.",
    });
  }
};

// =====================================================
// CHANGE ADMIN PASSWORD
// =====================================================
export const changeAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, password } = req.body;
    const finalPassword = newPassword || password;

    if (!finalPassword) {
      return res.status(400).json({
        success: false,
        message: "New password is required.",
      });
    }

    if (finalPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long.",
      });
    }

    const settings = getFallbackData("admin_settings", DEFAULT_ADMIN_SETTINGS);
    const updated = {
      ...settings,
      admin_password: finalPassword,
    };

    setFallbackData("admin_settings", updated);

    try {
      await supabase.from("admin_settings").upsert({
        id: 1,
        admin_password: finalPassword,
      });
    } catch (supabaseError) {
      console.warn("Could not save password to Supabase:", supabaseError.message);
    }

    return res.json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    console.error("Change password error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to change password.",
    });
  }
};

// =====================================================
// FORGOT PASSWORD - SEND OTP
// =====================================================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Admin email address is required.",
      });
    }

    const submittedEmail = email.trim().toLowerCase();

    if (!ALLOWED_PASSWORD_RESET_EMAILS.includes(submittedEmail)) {
      return res.status(400).json({
        success: false,
        message: "This email is not registered for password recovery.",
      });
    }

    if (!MAIL_USER || !MAIL_PASS) {
      console.error("MAIL_USER or MAIL_PASS is missing.");
      return res.status(500).json({
        success: false,
        message: "Email service is not configured. Check MAIL_USER and MAIL_PASS in .env.",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000;

    otpStore.set(submittedEmail, {
      otp,
      expiresAt,
      verified: false,
    });

    console.log(`OTP generated for ${submittedEmail}: ${otp}`);

    await transporter.sendMail({
      from: `"Red Rose School" <${MAIL_USER}>`,
      to: submittedEmail,
      subject: "Red Rose School - Password Reset OTP",
      html: `
        <div style="margin:0;padding:40px 20px;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif;">
          <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.08);">
            <div style="padding:30px;text-align:center;color:white;background:linear-gradient(135deg,#2563eb,#38bdf8);">
              <h1 style="margin:0;font-size:28px;">Red Rose School</h1>
              <p style="margin:8px 0 0;opacity:0.9;">School Management Portal</p>
            </div>
            <div style="padding:35px;">
              <h2 style="color:#0f172a;margin-top:0;">Password Reset</h2>
              <p style="color:#475569;line-height:1.7;">We received a request to reset your administrator password.</p>
              <p style="color:#475569;">Your verification OTP is:</p>
              <div style="margin:25px 0;padding:20px;text-align:center;background:#eff6ff;border-radius:15px;border:1px solid #bfdbfe;">
                <span style="font-size:38px;font-weight:bold;letter-spacing:10px;color:#2563eb;">${otp}</span>
              </div>
              <p style="color:#64748b;line-height:1.6;">This OTP will expire in <strong>10 minutes</strong>.</p>
              <p style="color:#64748b;line-height:1.6;">If you did not request this, you can safely ignore this email.</p>
            </div>
            <div style="padding:20px;text-align:center;background:#f8fafc;color:#94a3b8;font-size:13px;">
              © 2026 Red Rose Secondary English Boarding School. All Rights Reserved.
            </div>
          </div>
        </div>
      `,
    });

    return res.json({
      success: true,
      message: `OTP has been sent to ${submittedEmail}.`,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to send OTP. Please check your email configuration.",
    });
  }
};

// =====================================================
// VERIFY OTP
// =====================================================
export const verifyForgotPasswordOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required.",
      });
    }

    const submittedEmail = email.trim().toLowerCase();
    const submittedOtp = otp.trim();

    if (!ALLOWED_PASSWORD_RESET_EMAILS.includes(submittedEmail)) {
      return res.status(400).json({
        success: false,
        message: "This email is not registered for password recovery.",
      });
    }

    const storedData = otpStore.get(submittedEmail);

    if (!storedData) {
      return res.status(400).json({
        success: false,
        message: "OTP not found. Please request a new OTP.",
      });
    }

    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(submittedEmail);
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new OTP.",
      });
    }

    if (storedData.otp !== submittedOtp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP.",
      });
    }

    storedData.verified = true;
    otpStore.set(submittedEmail, storedData);

    return res.json({
      success: true,
      message: "OTP verified successfully.",
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to verify OTP.",
    });
  }
};

// =====================================================
// RESET PASSWORD
// =====================================================
export const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and new password are required.",
      });
    }

    const submittedEmail = email.trim().toLowerCase();

    if (!ALLOWED_PASSWORD_RESET_EMAILS.includes(submittedEmail)) {
      return res.status(400).json({
        success: false,
        message: "This email is not registered for password recovery.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long.",
      });
    }

    const storedData = otpStore.get(submittedEmail);

    if (!storedData) {
      return res.status(400).json({
        success: false,
        message: "Password reset session not found. Please request a new OTP.",
      });
    }

    if (!storedData.verified) {
      return res.status(400).json({
        success: false,
        message: "Please verify the OTP before resetting your password.",
      });
    }

    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(submittedEmail);
      return res.status(400).json({
        success: false,
        message: "OTP session has expired. Please request a new OTP.",
      });
    }

    const settings = getFallbackData("admin_settings", DEFAULT_ADMIN_SETTINGS);
    const updatedSettings = {
      ...settings,
      admin_password: password,
    };

    setFallbackData("admin_settings", updatedSettings);

    try {
      await supabase.from("admin_settings").upsert({
        id: 1,
        admin_password: password,
      });
    } catch (supabaseError) {
      console.warn("Could not save new password to Supabase:", supabaseError.message);
    }

    otpStore.delete(submittedEmail);

    return res.json({
      success: true,
      message: "Password reset successful. You can now log in with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to reset password. Please try again.",
    });
  }
};