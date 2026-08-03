import { supabase } from "../config/supabase.js";

// Get Hero Data
export const getHero = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("hero")
      .select("*")
      .order("id", { ascending: true });

    if (error) throw error;

    res.status(200).json({
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