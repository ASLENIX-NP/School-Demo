import { supabase } from "../config/supabase.js";
import { getFallbackData, setFallbackData } from "../utils/storageHelper.js";

const DEFAULT_NOTICES = [
  {
    id: 1,
    title: "Admission Open 2026",
    description: "Admissions are now open for the academic year 2026 from Nursery to Class 9.",
    date: "2026-08-01",
    category: "General",
    image_url: "",
    is_important: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    title: "First Terminal Examination Schedule",
    description: "The first terminal examination for all classes will begin from September 10.",
    date: "2026-09-10",
    category: "Exam",
    image_url: "",
    is_important: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    title: "Parent Teacher Meeting (PTM)",
    description: "Parent teacher meeting will be held on August 20 from 10:00 AM to 2:00 PM.",
    date: "2026-08-20",
    category: "Meeting",
    image_url: "",
    is_important: false,
    created_at: new Date().toISOString(),
  },
];

const DEFAULT_NOTICE_SETTINGS = {
  show_notices_ticker: true,
  ticker_speed: 15,
  auto_popup: true,
  max_notices_display: 5,
};

export const getNotices = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("notices")
      .select("*")
      .order("date", { ascending: false });

    if (!error && Array.isArray(data)) {
      return res.json({
        success: true,
        data,
      });
    }

    const notices = getFallbackData("notices", DEFAULT_NOTICES);
    return res.json({
      success: true,
      data: notices,
    });
  } catch (err) {
    const notices = getFallbackData("notices", DEFAULT_NOTICES);
    return res.json({
      success: true,
      data: notices,
    });
  }
};

export const getNoticeById = async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from("notices")
      .select("*")
      .eq("id", id)
      .single();

    if (!error && data) {
      return res.json({
        success: true,
        data,
      });
    }
  } catch (err) {
    console.warn(`Supabase get notice by id ${id} error:`, err.message);
  }

  const notices = getFallbackData("notices", DEFAULT_NOTICES);
  const notice = notices.find((n) => String(n.id) === String(id));

  if (!notice) {
    return res.status(404).json({
      success: false,
      message: "Notice not found",
    });
  }

  return res.json({
    success: true,
    data: notice,
  });
};

export const createNotice = async (req, res) => {
  const { title, description, date, category, image_url, is_important } = req.body;

  const newNotice = {
    id: Date.now(),
    title: title || "Untitled Notice",
    description: description || "",
    date: date || new Date().toISOString().split("T")[0],
    category: category || "General",
    image_url: image_url || "",
    is_important: is_important !== undefined ? Boolean(is_important) : false,
    created_at: new Date().toISOString(),
  };

  try {
    const { data, error } = await supabase
      .from("notices")
      .insert([newNotice])
      .select();

    if (!error && data && data.length > 0) {
      const notices = getFallbackData("notices", DEFAULT_NOTICES);
      setFallbackData("notices", [data[0], ...notices]);

      return res.status(201).json({
        success: true,
        message: "Notice created successfully",
        data: data[0],
      });
    }
  } catch (err) {
    console.warn("Supabase create notice error:", err.message);
  }

  const notices = getFallbackData("notices", DEFAULT_NOTICES);
  setFallbackData("notices", [newNotice, ...notices]);

  return res.status(201).json({
    success: true,
    message: "Notice created successfully",
    data: newNotice,
  });
};

export const updateNotice = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const { data, error } = await supabase
      .from("notices")
      .update(updates)
      .eq("id", id)
      .select();

    if (!error) {
      const notices = getFallbackData("notices", DEFAULT_NOTICES);
      const updated = notices.map((n) => (String(n.id) === String(id) ? { ...n, ...updates } : n));
      setFallbackData("notices", updated);

      return res.json({
        success: true,
        message: "Notice updated successfully",
        data: data?.[0] || { id, ...updates },
      });
    }
  } catch (err) {
    console.warn("Supabase update notice error:", err.message);
  }

  const notices = getFallbackData("notices", DEFAULT_NOTICES);
  const updated = notices.map((n) => (String(n.id) === String(id) ? { ...n, ...updates } : n));
  setFallbackData("notices", updated);

  return res.json({
    success: true,
    message: "Notice updated successfully",
    data: { id, ...updates },
  });
};

export const deleteNotice = async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from("notices")
      .delete()
      .eq("id", id);

    if (!error) {
      const notices = getFallbackData("notices", DEFAULT_NOTICES);
      const filtered = notices.filter((n) => String(n.id) !== String(id));
      setFallbackData("notices", filtered);

      return res.json({
        success: true,
        message: "Notice deleted successfully",
      });
    }
  } catch (err) {
    console.warn("Supabase delete notice error:", err.message);
  }

  const notices = getFallbackData("notices", DEFAULT_NOTICES);
  const filtered = notices.filter((n) => String(n.id) !== String(id));
  setFallbackData("notices", filtered);

  return res.json({
    success: true,
    message: "Notice deleted successfully",
  });
};

export const getNoticeSettings = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("notice_settings")
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
    console.warn("Supabase notice_settings fetch error:", err.message);
  }

  const settings = getFallbackData("notice_settings", DEFAULT_NOTICE_SETTINGS);
  return res.json({
    success: true,
    data: settings,
  });
};

export const updateNoticeSettings = async (req, res) => {
  const newSettings = req.body;

  try {
    const { data, error } = await supabase
      .from("notice_settings")
      .upsert({ id: 1, ...newSettings })
      .select();

    if (!error) {
      const settings = getFallbackData("notice_settings", DEFAULT_NOTICE_SETTINGS);
      const merged = { ...settings, ...newSettings };
      setFallbackData("notice_settings", merged);

      return res.json({
        success: true,
        message: "Notice settings updated successfully",
        data: data?.[0] || merged,
      });
    }
  } catch (err) {
    console.warn("Supabase update notice settings error:", err.message);
  }

  const settings = getFallbackData("notice_settings", DEFAULT_NOTICE_SETTINGS);
  const merged = { ...settings, ...newSettings };
  setFallbackData("notice_settings", merged);

  return res.json({
    success: true,
    message: "Notice settings updated successfully",
    data: merged,
  });
};