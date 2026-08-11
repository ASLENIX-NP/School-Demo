import { supabase } from "../config/supabase.js";
import { getFallbackData, setFallbackData } from "../utils/storageHelper.js";

const DEFAULT_NOTICES = [
  {
    id: 1,
    title: "Admission Open 2026",
    description: "Admissions are now open for the academic year 2026 from Nursery to Class 9.",
    date: "2026-08-01",
    notice_date: "2026-08-01",
    category: "General",
    pdf_url: "",
    file_url: "",
    is_important: true,
    pinned: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    title: "First Terminal Examination Schedule",
    description: "The first terminal examination for all classes will begin from September 10.",
    date: "2026-09-10",
    notice_date: "2026-09-10",
    category: "Exam",
    pdf_url: "",
    file_url: "",
    is_important: false,
    pinned: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    title: "Parent Teacher Meeting (PTM)",
    description: "Parent teacher meeting will be held on August 20 from 10:00 AM to 2:00 PM.",
    date: "2026-08-20",
    notice_date: "2026-08-20",
    category: "Meeting",
    pdf_url: "",
    file_url: "",
    is_important: false,
    pinned: false,
    created_at: new Date().toISOString(),
  },
];

const DEFAULT_NOTICE_SETTINGS = {
  show_notices_ticker: true,
  ticker_speed: 15,
  auto_popup: true,
  max_notices_display: 5,
};

function serializeDescription({ text = "", category = "General", pdf_url = "", pinned = false, is_important = false }) {
  const isPinned = Boolean(pinned || is_important);
  const meta = {
    category: String(category || "General").trim(),
    pdf_url: String(pdf_url || "").trim(),
    pinned: isPinned,
    is_important: isPinned,
  };
  return `<!--meta:${JSON.stringify(meta)}-->${text || ""}`;
}

export function parseNoticeRow(row) {
  if (!row) return null;

  let category = row.category || "General";
  let description = row.description || "";
  let pdf_url = row.pdf_url || row.file_url || row.image_url || "";
  let is_important = Boolean(row.is_important || row.pinned);
  let pinned = Boolean(row.pinned || row.is_important);

  if (typeof row.description === "string" && row.description) {
    try {
      if (row.description.includes("<!--meta:")) {
        const match = row.description.match(/<!--meta:(.*?)-->/);
        if (match && match[1]) {
          const meta = JSON.parse(match[1]);
          category = meta.category || category;
          pdf_url = meta.pdf_url || meta.file_url || pdf_url;
          is_important = Boolean(meta.is_important || meta.pinned);
          pinned = Boolean(meta.pinned || meta.is_important);
          description = row.description.replace(/<!--meta:.*?-->/, "").trim();
        }
      } else if (row.description.trim().startsWith("{") && row.description.trim().endsWith("}")) {
        const parsed = JSON.parse(row.description);
        if (parsed && typeof parsed === "object") {
          description = parsed.text !== undefined ? parsed.text : (parsed.description || "");
          category = parsed.category || category;
          pdf_url = parsed.pdf_url || parsed.file_url || pdf_url;
          is_important = Boolean(parsed.is_important || parsed.pinned);
          pinned = Boolean(parsed.pinned || parsed.is_important);
        }
      }
    } catch (e) {
      // Keep description as string
    }
  }

  const noticeDate = row.date || row.notice_date || (row.created_at ? row.created_at.split("T")[0] : new Date().toISOString().split("T")[0]);

  return {
    id: row.id,
    title: row.title || "",
    description,
    date: noticeDate,
    notice_date: noticeDate,
    category,
    pdf_url,
    file_url: pdf_url,
    is_important,
    pinned,
    created_at: row.created_at || new Date().toISOString(),
  };
}

export const getNotices = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("notices")
      .select("*")
      .order("date", { ascending: false });

    if (!error && Array.isArray(data)) {
      const parsed = data.map(parseNoticeRow);
      // Sync to fallback storage for offline redundancy
      setFallbackData("notices", parsed);

      return res.json({
        success: true,
        data: parsed,
      });
    }
  } catch (err) {
    console.warn("Supabase fetch notices error:", err.message);
  }

  const notices = getFallbackData("notices", DEFAULT_NOTICES);
  const normalized = notices.map(parseNoticeRow);
  return res.json({
    success: true,
    data: normalized,
  });
};

export const getNoticeById = async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from("notices")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (!error && data) {
      return res.json({
        success: true,
        data: parseNoticeRow(data),
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
    data: parseNoticeRow(notice),
  });
};

export const createNotice = async (req, res) => {
  const {
    title,
    description,
    date,
    notice_date,
    category,
    pdf_url,
    file_url,
    image_url,
    is_important,
    pinned,
  } = req.body;

  if (!title || !String(title).trim()) {
    return res.status(400).json({
      success: false,
      message: "Notice title is required",
    });
  }

  const cleanTitle = String(title).trim();
  const cleanDescription = String(description || "").trim();
  const cleanDate = String(notice_date || date || new Date().toISOString().split("T")[0]).trim();
  const cleanCategory = String(category || "General").trim();
  const cleanPdfUrl = String(pdf_url || file_url || image_url || "").trim();
  const isPinned = Boolean(pinned || is_important);

  const serializedDesc = serializeDescription({
    text: cleanDescription,
    category: cleanCategory,
    pdf_url: cleanPdfUrl,
    pinned: isPinned,
    is_important: isPinned,
  });

  const supabaseRecord = {
    title: cleanTitle,
    description: serializedDesc,
    date: cleanDate,
  };

  try {
    const { data, error } = await supabase
      .from("notices")
      .insert([supabaseRecord])
      .select();

    if (!error && data && data.length > 0) {
      const createdNotice = parseNoticeRow(data[0]);

      // Update fallback storage
      const notices = getFallbackData("notices", DEFAULT_NOTICES);
      setFallbackData("notices", [createdNotice, ...notices.filter((n) => String(n.id) !== String(createdNotice.id))]);

      return res.status(201).json({
        success: true,
        message: "Notice created successfully",
        data: createdNotice,
      });
    }

    if (error) {
      console.error("Supabase create notice insert error:", error);
    }
  } catch (err) {
    console.warn("Supabase create notice error:", err.message);
  }

  // Local fallback if Supabase is unavailable
  const fallbackNotice = {
    id: Date.now(),
    title: cleanTitle,
    description: cleanDescription,
    date: cleanDate,
    notice_date: cleanDate,
    category: cleanCategory,
    pdf_url: cleanPdfUrl,
    file_url: cleanPdfUrl,
    is_important: isPinned,
    pinned: isPinned,
    created_at: new Date().toISOString(),
  };

  const notices = getFallbackData("notices", DEFAULT_NOTICES);
  setFallbackData("notices", [fallbackNotice, ...notices]);

  return res.status(201).json({
    success: true,
    message: "Notice created successfully",
    data: fallbackNotice,
  });
};

export const updateNotice = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    date,
    notice_date,
    category,
    pdf_url,
    file_url,
    image_url,
    is_important,
    pinned,
  } = req.body;

  const cleanTitle = title !== undefined ? String(title).trim() : undefined;
  const cleanDescription = description !== undefined ? String(description).trim() : undefined;
  const cleanDate = (notice_date || date) !== undefined ? String(notice_date || date).trim() : undefined;
  const cleanCategory = category !== undefined ? String(category).trim() : undefined;
  const cleanPdfUrl = (pdf_url || file_url || image_url) !== undefined ? String(pdf_url || file_url || image_url).trim() : undefined;
  const isPinned = pinned !== undefined || is_important !== undefined ? Boolean(pinned || is_important) : undefined;

  // Retrieve current notice to merge fields if needed
  const notices = getFallbackData("notices", DEFAULT_NOTICES);
  const current = notices.find((n) => String(n.id) === String(id)) || {};

  const finalTitle = cleanTitle !== undefined ? cleanTitle : (current.title || "");
  const finalText = cleanDescription !== undefined ? cleanDescription : (current.description || "");
  const finalCategory = cleanCategory !== undefined ? cleanCategory : (current.category || "General");
  const finalPdfUrl = cleanPdfUrl !== undefined ? cleanPdfUrl : (current.pdf_url || current.file_url || "");
  const finalPinned = isPinned !== undefined ? isPinned : Boolean(current.pinned || current.is_important);
  const finalDate = cleanDate !== undefined ? cleanDate : (current.date || current.notice_date || new Date().toISOString().split("T")[0]);

  const serializedDesc = serializeDescription({
    text: finalText,
    category: finalCategory,
    pdf_url: finalPdfUrl,
    pinned: finalPinned,
    is_important: finalPinned,
  });

  const updateFields = {
    title: finalTitle,
    description: serializedDesc,
    date: finalDate,
  };

  try {
    const { data, error } = await supabase
      .from("notices")
      .update(updateFields)
      .eq("id", id)
      .select();

    if (!error && data && data.length > 0) {
      const updatedNotice = parseNoticeRow(data[0]);

      const updatedList = notices.map((n) => (String(n.id) === String(id) ? updatedNotice : n));
      setFallbackData("notices", updatedList);

      return res.json({
        success: true,
        message: "Notice updated successfully",
        data: updatedNotice,
      });
    }
  } catch (err) {
    console.warn("Supabase update notice error:", err.message);
  }

  const updatedFallback = {
    id: isNaN(Number(id)) ? id : Number(id),
    title: finalTitle,
    description: finalText,
    date: finalDate,
    notice_date: finalDate,
    category: finalCategory,
    pdf_url: finalPdfUrl,
    file_url: finalPdfUrl,
    is_important: finalPinned,
    pinned: finalPinned,
    created_at: current.created_at || new Date().toISOString(),
  };

  const updatedList = notices.map((n) => (String(n.id) === String(id) ? updatedFallback : n));
  setFallbackData("notices", updatedList);

  return res.json({
    success: true,
    message: "Notice updated successfully",
    data: updatedFallback,
  });
};

export const deleteNotice = async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from("notices")
      .delete()
      .eq("id", id);

    if (error) {
      console.warn("Supabase delete notice warning:", error.message);
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
      .from("site_content")
      .select("*")
      .eq("section", "notice_settings")
      .maybeSingle();

    if (!error && data?.content) {
      const content = typeof data.content === "string" ? JSON.parse(data.content) : data.content;
      return res.json({
        success: true,
        data: { ...DEFAULT_NOTICE_SETTINGS, ...content },
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
      .from("site_content")
      .upsert(
        {
          section: "notice_settings",
          content: JSON.stringify(newSettings),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "section" }
      )
      .select();

    if (!error) {
      const settings = getFallbackData("notice_settings", DEFAULT_NOTICE_SETTINGS);
      const merged = { ...settings, ...newSettings };
      setFallbackData("notice_settings", merged);

      return res.json({
        success: true,
        message: "Notice settings updated successfully",
        data: merged,
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