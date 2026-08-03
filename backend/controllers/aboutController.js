import { supabase } from "../config/supabase.js";

export const getAbout = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("about")
      .select("*");

    if (error) throw error;

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};