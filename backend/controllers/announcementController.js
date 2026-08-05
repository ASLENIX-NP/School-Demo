import { supabase } from "../config/supabase.js";
import { getFallbackData, setFallbackData } from "../utils/storageHelper.js";

const DEFAULT_ANNOUNCEMENTS = [
  {
    id: 1,
    title: "Welcome to New Academic Session 2026",
    description: "Classes for the new academic year 2026/2083 will commence from Baisakh 5. All students are requested to be present in full uniform.",
    image_url: "",
    active: true,
    visible: true,
    show_on_homepage: true,
    popup_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Annual Sports Meet Registration Open",
    description: "Registration for track and field events, basketball, and football tournaments is now open at the physical education department.",
    image_url: "",
    active: true,
    visible: true,
    show_on_homepage: true,
    popup_order: 2,
    created_at: new Date().toISOString(),
  },
];

export const getAnnouncements = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .order("popup_order", { ascending: true, nullsFirst: false });

    if (!error && Array.isArray(data)) {
      return res.json({
        success: true,
        data,
      });
    }

    const announcements = getFallbackData("announcements", DEFAULT_ANNOUNCEMENTS);
    return res.json({
      success: true,
      data: announcements,
    });
  } catch (err) {
    const announcements = getFallbackData("announcements", DEFAULT_ANNOUNCEMENTS);
    return res.json({
      success: true,
      data: announcements,
    });
  }
};

export const createAnnouncement = async (req, res) => {
  const { title, description, image_url, active, visible, show_on_homepage, popup_order } = req.body;

  const announcements = getFallbackData("announcements", DEFAULT_ANNOUNCEMENTS);
  const newAnnouncement = {
    id: Date.now(),
    title: title || "Untitled Announcement",
    description: description || "",
    image_url: image_url || "",
    active: active !== undefined ? active : true,
    visible: visible !== undefined ? visible : true,
    show_on_homepage: show_on_homepage !== undefined ? show_on_homepage : true,
    popup_order: popup_order || announcements.length + 1,
    created_at: new Date().toISOString(),
  };

  try {
    const { data, error } = await supabase
      .from("announcements")
      .insert([newAnnouncement])
      .select();

    if (!error && data && data.length > 0) {
      setFallbackData("announcements", [...announcements, data[0]]);
      return res.status(201).json({
        success: true,
        message: "Announcement created successfully",
        data: data[0],
      });
    }
  } catch (err) {
    console.warn("Supabase insert announcement error:", err.message);
  }

  setFallbackData("announcements", [...announcements, newAnnouncement]);

  return res.status(201).json({
    success: true,
    message: "Announcement created successfully",
    data: newAnnouncement,
  });
};

export const updateAnnouncement = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const { data, error } = await supabase
      .from("announcements")
      .update(updates)
      .eq("id", id)
      .select();

    if (!error) {
      const announcements = getFallbackData("announcements", DEFAULT_ANNOUNCEMENTS);
      const updatedList = announcements.map((item) =>
        String(item.id) === String(id) ? { ...item, ...updates } : item
      );
      setFallbackData("announcements", updatedList);

      return res.json({
        success: true,
        message: "Announcement updated successfully",
        data: data?.[0] || { id, ...updates },
      });
    }
  } catch (err) {
    console.warn("Supabase update announcement error:", err.message);
  }

  const announcements = getFallbackData("announcements", DEFAULT_ANNOUNCEMENTS);
  const updatedList = announcements.map((item) =>
    String(item.id) === String(id) ? { ...item, ...updates } : item
  );
  setFallbackData("announcements", updatedList);

  return res.json({
    success: true,
    message: "Announcement updated successfully",
    data: { id, ...updates },
  });
};

export const deleteAnnouncement = async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from("announcements")
      .delete()
      .eq("id", id);

    if (!error) {
      const announcements = getFallbackData("announcements", DEFAULT_ANNOUNCEMENTS);
      const filtered = announcements.filter((item) => String(item.id) !== String(id));
      setFallbackData("announcements", filtered);

      return res.json({
        success: true,
        message: "Announcement deleted successfully",
      });
    }
  } catch (err) {
    console.warn("Supabase delete announcement error:", err.message);
  }

  const announcements = getFallbackData("announcements", DEFAULT_ANNOUNCEMENTS);
  const filtered = announcements.filter((item) => String(item.id) !== String(id));
  setFallbackData("announcements", filtered);

  return res.json({
    success: true,
    message: "Announcement deleted successfully",
  });
};

export const updatePopupOrder = async (req, res) => {
  const { orders } = req.body; // array of { id, popup_order }

  if (!Array.isArray(orders)) {
    return res.status(400).json({
      success: false,
      message: "Invalid orders array format",
    });
  }

  try {
    for (const order of orders) {
      await supabase
        .from("announcements")
        .update({ popup_order: order.popup_order })
        .eq("id", order.id);
    }
  } catch (err) {
    console.warn("Supabase popup order update error:", err.message);
  }

  const announcements = getFallbackData("announcements", DEFAULT_ANNOUNCEMENTS);
  const orderMap = new Map(orders.map((o) => [String(o.id), o.popup_order]));
  const updatedList = announcements.map((item) => {
    if (orderMap.has(String(item.id))) {
      return { ...item, popup_order: orderMap.get(String(item.id)) };
    }
    return item;
  });
  setFallbackData("announcements", updatedList);

  return res.json({
    success: true,
    message: "Popup order updated successfully",
  });
};
