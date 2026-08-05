import { supabase } from "../config/supabase.js";
import { getFallbackData, setFallbackData } from "../utils/storageHelper.js";

const DEFAULT_MESSAGES = [
  {
    id: 1,
    name: "Ram Shrestha",
    email: "ram.shrestha@example.com",
    phone: "+977 9841234567",
    subject: "Admission Inquiry",
    message: "I would like to inquire about Grade 1 admission process and fees for the academic year 2026.",
    is_read: false,
    source: "contact",
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 2,
    name: "Sita Sharma",
    email: "sita.sharma@example.com",
    phone: "+977 9851098765",
    subject: "Admission Application",
    message: "Submitted admission inquiry for Class 5. Please contact us back with details.",
    is_read: true,
    source: "admission",
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
];

export const getContactMessages = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && Array.isArray(data)) {
      return res.json({
        success: true,
        data,
      });
    }

    const messages = getFallbackData("contact_messages", DEFAULT_MESSAGES);
    return res.json({
      success: true,
      data: messages,
    });
  } catch (err) {
    const messages = getFallbackData("contact_messages", DEFAULT_MESSAGES);
    return res.json({
      success: true,
      data: messages,
    });
  }
};

export const createContactMessage = async (req, res) => {
  const { name, email, phone, subject, message, source } = req.body;

  const newMessage = {
    id: Date.now(),
    name: name || "Anonymous",
    email: email || "",
    phone: phone || "",
    subject: subject || "Inquiry",
    message: message || "",
    is_read: false,
    source: source || "contact",
    created_at: new Date().toISOString(),
  };

  try {
    const { data, error } = await supabase
      .from("contact_messages")
      .insert([newMessage])
      .select();

    if (!error && data && data.length > 0) {
      // Sync local fallback
      const messages = getFallbackData("contact_messages", DEFAULT_MESSAGES);
      setFallbackData("contact_messages", [data[0], ...messages]);

      return res.status(201).json({
        success: true,
        message: "Message sent successfully",
        data: data[0],
      });
    }
  } catch (err) {
    console.warn("Supabase insert contact_messages error:", err.message);
  }

  // Fallback
  const messages = getFallbackData("contact_messages", DEFAULT_MESSAGES);
  const updatedMessages = [newMessage, ...messages];
  setFallbackData("contact_messages", updatedMessages);

  return res.status(201).json({
    success: true,
    message: "Message sent successfully",
    data: newMessage,
  });
};

export const updateMessageReadStatus = async (req, res) => {
  const { id } = req.params;
  const is_read = req.body?.is_read !== undefined ? Boolean(req.body.is_read) : true;

  try {
    const { data, error } = await supabase
      .from("contact_messages")
      .update({ is_read })
      .eq("id", id)
      .select();

    if (!error) {
      // Update local storage too
      const messages = getFallbackData("contact_messages", DEFAULT_MESSAGES);
      const updated = messages.map((m) => (String(m.id) === String(id) ? { ...m, is_read } : m));
      setFallbackData("contact_messages", updated);

      return res.json({
        success: true,
        message: "Message status updated",
        data: data?.[0] || { id, is_read },
      });
    }
  } catch (err) {
    console.warn("Supabase update message status error:", err.message);
  }

  const messages = getFallbackData("contact_messages", DEFAULT_MESSAGES);
  const updated = messages.map((m) => (String(m.id) === String(id) ? { ...m, is_read } : m));
  setFallbackData("contact_messages", updated);

  return res.json({
    success: true,
    message: "Message status updated",
    data: { id, is_read },
  });
};

export const deleteContactMessage = async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from("contact_messages")
      .delete()
      .eq("id", id);

    if (!error) {
      const messages = getFallbackData("contact_messages", DEFAULT_MESSAGES);
      const filtered = messages.filter((m) => String(m.id) !== String(id));
      setFallbackData("contact_messages", filtered);

      return res.json({
        success: true,
        message: "Message deleted successfully",
      });
    }
  } catch (err) {
    console.warn("Supabase delete message error:", err.message);
  }

  const messages = getFallbackData("contact_messages", DEFAULT_MESSAGES);
  const filtered = messages.filter((m) => String(m.id) !== String(id));
  setFallbackData("contact_messages", filtered);

  return res.json({
    success: true,
    message: "Message deleted successfully",
  });
};
