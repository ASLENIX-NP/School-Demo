import { supabase } from "./config/supabase.js";
import { getFallbackData } from "./utils/storageHelper.js";

function serializeDescription({ text, category, pdf_url, pinned, is_important }) {
  const meta = {
    category: category || "General",
    pdf_url: pdf_url || "",
    pinned: Boolean(pinned || is_important),
    is_important: Boolean(pinned || is_important),
  };
  return `<!--meta:${JSON.stringify(meta)}-->${text || ""}`;
}

async function syncAllToSupabase() {
  console.log("=== Syncing existing local notices to Supabase ===");
  const localNotices = getFallbackData("notices", []);
  console.log(`Found ${localNotices.length} local notices`);

  for (const n of localNotices) {
    // Check if notice with this title or id already in Supabase
    const { data: existing } = await supabase
      .from("notices")
      .select("id, title")
      .eq("title", n.title);

    if (existing && existing.length > 0) {
      console.log(`Notice '${n.title}' already in Supabase (id=${existing[0].id}), updating...`);
      await supabase
        .from("notices")
        .update({
          description: serializeDescription({
            text: n.description,
            category: n.category,
            pdf_url: n.pdf_url || n.image_url,
            pinned: n.pinned || n.is_important,
          }),
          date: n.notice_date || n.date || new Date().toISOString().slice(0, 10),
        })
        .eq("id", existing[0].id);
    } else {
      console.log(`Inserting '${n.title}' into Supabase...`);
      const { data: inserted, error: insertErr } = await supabase
        .from("notices")
        .insert([{
          title: n.title,
          description: serializeDescription({
            text: n.description,
            category: n.category,
            pdf_url: n.pdf_url || n.image_url,
            pinned: n.pinned || n.is_important,
          }),
          date: n.notice_date || n.date || new Date().toISOString().slice(0, 10),
        }])
        .select();

      if (insertErr) {
        console.error(`Error inserting '${n.title}':`, insertErr.message);
      } else {
        console.log(`Inserted '${n.title}' with id=${inserted[0]?.id}`);
      }
    }
  }

  const { data: finalRows } = await supabase.from("notices").select("*");
  console.log(`Total rows in Supabase notices table now: ${finalRows?.length}`);
}

syncAllToSupabase().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
