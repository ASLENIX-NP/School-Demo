import { supabase } from "../config/supabase.js";
import { getFallbackData, setFallbackData } from "../utils/storageHelper.js";

export const getSiteContent = async (req, res) => {
  const { section } = req.params;

  try {
    const { data, error } = await supabase
      .from("site_content")
      .select("*")
      .eq("section", section)
      .maybeSingle();

    if (!error && data) {
      return res.json({
        success: true,
        data: {
          section: data.section,
          content: typeof data.content === "string" ? JSON.parse(data.content) : data.content,
        },
      });
    }

    // Fallback to local file
    const allSiteContent = getFallbackData("site_content", {});
    const sectionContent = allSiteContent[section] || {};

    return res.json({
      success: true,
      data: {
        section,
        content: sectionContent,
      },
    });
  } catch (err) {
    const allSiteContent = getFallbackData("site_content", {});
    return res.json({
      success: true,
      data: {
        section,
        content: allSiteContent[section] || {},
      },
    });
  }
};

export const updateSiteContent = async (req, res) => {
  const { section } = req.params;
  const newContent = req.body?.content !== undefined ? req.body.content : req.body;

  try {
    const { data, error } = await supabase
      .from("site_content")
      .upsert(
        {
          section,
          content: typeof newContent === "object" ? JSON.stringify(newContent) : newContent,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "section" }
      )
      .select();

    if (error) {
      console.warn(`Supabase upsert site_content error for ${section}:`, error.message);
    }

    // Always update local fallback
    const allSiteContent = getFallbackData("site_content", {});
    allSiteContent[section] = newContent;
    setFallbackData("site_content", allSiteContent);

    return res.json({
      success: true,
      message: `Site content for ${section} updated successfully`,
      data: {
        section,
        content: newContent,
      },
    });
  } catch (err) {
    // Update local fallback
    const allSiteContent = getFallbackData("site_content", {});
    allSiteContent[section] = newContent;
    setFallbackData("site_content", allSiteContent);

    return res.json({
      success: true,
      message: `Site content for ${section} updated successfully (fallback)`,
      data: {
        section,
        content: newContent,
      },
    });
  }
};
