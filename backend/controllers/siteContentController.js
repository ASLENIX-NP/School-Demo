import { supabase } from "../config/supabase.js";
import { getFallbackData, setFallbackData } from "../utils/storageHelper.js";

// =======================
// GET SITE CONTENT
// =======================
export const getSiteContent = async (req, res) => {
  const { section } = req.params;

  try {
    const { data, error } = await supabase
      .from("site_content")
      .select("*")
      .eq("section", section)
      .maybeSingle();

    if (error) {
      console.error("Supabase GET Error:", error);
    }

    if (!error && data) {
      console.log("Loaded section:", section);
      console.log(
        JSON.stringify(
          typeof data.content === "string"
            ? JSON.parse(data.content)
            : data.content,
          null,
          2
        )
      );

      return res.json({
        success: true,
        data: {
          section: data.section,
          content:
            typeof data.content === "string"
              ? JSON.parse(data.content)
              : data.content,
        },
      });
    }

    // ---------- Local fallback ----------
    const allSiteContent = getFallbackData("site_content", {});
    const sectionContent = allSiteContent[section] || {};

    console.log("Loaded fallback:", section);

    return res.json({
      success: true,
      data: {
        section,
        content: sectionContent,
      },
    });
  } catch (err) {
    console.error("GET Site Content Error:", err);

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

// =======================
// UPDATE SITE CONTENT
// =======================
export const updateSiteContent = async (req, res) => {
  const { section } = req.params;

  const newContent =
    req.body?.content !== undefined
      ? req.body.content
      : req.body;

  console.log("====================================");
  console.log("Saving Section:", section);
  console.log(JSON.stringify(newContent, null, 2));
  console.log("====================================");

  try {
    const { data, error } = await supabase
      .from("site_content")
      .upsert(
        {
          section,
          content:
            typeof newContent === "object"
              ? JSON.stringify(newContent)
              : newContent,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "section",
        }
      )
      .select();

    if (error) {
      console.error("Supabase UPDATE Error:");
      console.error(error);

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    console.log("Saved Successfully");
    console.log(data);

    // ---------- Local fallback ----------
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
    console.error("Controller Error:");
    console.error(err);

    const allSiteContent = getFallbackData("site_content", {});
    allSiteContent[section] = newContent;
    setFallbackData("site_content", allSiteContent);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};