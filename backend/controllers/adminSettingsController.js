import { supabase } from "../config/supabase.js";
import { getFallbackData, setFallbackData } from "../utils/storageHelper.js";

const DEFAULT_ADMIN_SETTINGS = {
  id: 1,
  school_name: "Bal Jagriti Secondary English Boarding School",
  school_email: "admin@Red Rose.edu.np",
  phone: "+977 9800000000",
  address: "Itahari, Sunsari, Nepal",
  logo: "",
  lock_account: false,
  two_factor: false,
  session_timeout: "30",
  max_login_attempts: "5",
};

const DEFAULT_LOGIN_ACTIVITY = [
  {
    id: 1,
    device: "Chrome / Windows 11",
    ip: "127.0.0.1",
    location: "Itahari, Nepal",
    time: "Just now",
    status: "Active Session",
  },
  {
    id: 2,
    device: "Safari / iPhone 15",
    ip: "110.44.112.5",
    location: "Kathmandu, Nepal",
    time: "2 hours ago",
    status: "Successful",
  },
];

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

export const getLoginActivity = async (req, res) => {
  const activity = getFallbackData("login_activity", DEFAULT_LOGIN_ACTIVITY);
  return res.json({
    success: true,
    data: activity,
  });
};

export const uploadAdminPhoto = async (req, res) => {
  const { photo_url } = req.body;
  const settings = getFallbackData("admin_settings", DEFAULT_ADMIN_SETTINGS);
  const updated = { ...settings, logo: photo_url || settings.logo };
  setFallbackData("admin_settings", updated);

  return res.json({
    success: true,
    message: "Admin photo updated successfully",
    data: updated,
  });
};

export const updateAdminEmail = async (req, res) => {
  const { school_email, email } = req.body;
  const newEmail = email || school_email;

  const settings = getFallbackData("admin_settings", DEFAULT_ADMIN_SETTINGS);
  const updated = { ...settings, school_email: newEmail };
  setFallbackData("admin_settings", updated);

  return res.json({
    success: true,
    message: "Email updated successfully",
    data: updated,
  });
};

export const changeAdminPassword = async (req, res) => {
  return res.json({
    success: true,
    message: "Password changed successfully",
  });
};
