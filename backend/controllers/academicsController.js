import { supabase } from "../config/supabase.js";

export const getAcademics = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("academics")
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