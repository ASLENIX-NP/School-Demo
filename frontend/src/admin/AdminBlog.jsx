// AdminBlog.jsx
import { useEffect, useMemo, useState } from "react";
import api from "../lib/api";
import { motion, AnimatePresence } from "motion/react";
import { 
  AlertCircle, 
  BookOpen, 
  Calendar, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  Image as ImageIcon, 
  Newspaper, 
  Pencil, 
  Pin, 
  Plus, 
  Save, 
  Search, 
  Sparkles, 
  Tag, 
  Trash2, 
  UploadCloud, 
  X 
} from "lucide-react";

// NOTE: Since you didn't provide blogUtils.js, I have added fallbacks for these functions
// so the file doesn't crash. You should replace these with your actual imports if you have them.
const defaultBlogContent = { pageBadge: "School Journal", pageTitle: "Latest Stories", pageDescription: "Updates from our campus.", categories: ["All", "Events", "Academics", "Achievements"], posts: [] };
const formatBlogDate = (date) => { if (!date) return "TBD"; try { return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }); } catch { return date; } };
const makeBlogSlug = (title, id) => { return String(title || "post").toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + (id || Date.now()); };
const mergeBlogContent = (saved) => { return { ...defaultBlogContent, ...saved }; };
const normalizeBlogPost = (post, index) => { return { ...post, id: post.id || Date.now() + index }; };

const C = {
  cream: "#F4ECDF",
  paper: "#FFFDF8",
  paper2: "#FBF5EA",
  burgundy: "#2B1423",
  burgundy2: "#40172A",
  maroon: "#A52B4A",
  gold: "#C9963D",
  goldLight: "#E8CF96",
  ink: "#261520",
  muted: "#756A70",
  line: "#E5D8C8",
  green: "#168A3A",
  red: "#C62828"
};

const auth = () => {
  const t = localStorage.getItem("adminToken") || localStorage.getItem("token") || localStorage.getItem("admin_token") || "";
  return t ? { Authorization: `Bearer ${t}` } : {};
};

const uploadUrl = (p) => p?.url || p?.imageUrl || p?.fileUrl || p?.data?.url || p?.data?.imageUrl || p?.data?.fileUrl || p?.data?.secure_url || p?.file?.url || "";

const plain = (v) => String(v || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const excerpt = (p) => {
  const t = plain(p?.excerpt || p?.content);
  return t ? (t.length > 150 ? `${t.slice(0, 150).trim()}...` : t) : "No summary has been added for this story yet.";
};

function emptyPost() {
  const id = Date.now();
  const title = "New Blog Post";
  return {
    id,
    title,
    slug: makeBlogSlug(title, id),
    category: "Events",
    date: new Date().toISOString().slice(0, 10),
    excerpt: "Short summary for this blog post.",
    content: "Write the full blog content here.",
    imageUrl: "",
    imageAlt: "",
    pinned: false,
    visible: true,
    author: "Smriti Team",
    authorRole: "School Administration"
  };
}

function Field({ label, value, onChange, textarea = false, type = "text", rows = 5, placeholder = "" }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black uppercase tracking-[.12em]" style={{ color: C.muted }}>
        {label}
      </span>
      {textarea ? (
        <textarea
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          placeholder={placeholder}
          className="w-full resize-y rounded-2xl px-4 py-3.5 text-sm outline-none"
          style={{ background: C.paper, border: `1px solid ${C.line}`, color: C.ink }}
        />
      ) : (
        <input
          type={type}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-2xl px-4 py-3.5 text-sm outline-none"
          style={{ background: C.paper, border: `1px solid ${C.line}`, color: C.ink }}
        />
      )}
    </label>
  );
}

function Toggle({ checked, onChange, label, description }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 rounded-2xl p-4 text-left"
      style={{
        background: checked ? "rgba(22,138,58,.07)" : "rgba(117,106,112,.06)",
        border: `1px solid ${checked ? "rgba(22,138,58,.18)" : C.line}`
      }}
    >
      <span>
        <b className="block text-sm" style={{ color: C.ink }}>{label}</b>
        <small className="mt-1 block text-xs leading-5" style={{ color: C.muted }}>{description}</small>
      </span>
      <span className="relative h-7 w-12 shrink-0 rounded-full" style={{ background: checked ? C.green : "#D8D0C9" }}>
        <i className="absolute top-1 h-5 w-5 rounded-full bg-white shadow transition" style={{ left: checked ? 24 : 4 }} />
      </span>
    </button>
  );
}

function ImagePreview({ post }) {
  return post?.imageUrl ? (
    <img src={post.imageUrl} alt={post.imageAlt || post.title || "Blog"} className="h-full w-full object-cover" />
  ) : (
    <div className="flex h-full w-full items-center justify-center" style={{ background: "linear-gradient(135deg,#3B1C2D,#2B1423)", color: C.gold }}>
      <ImageIcon size={40} />
    </div>
  );
}

function Label({ children }) {
  return (
    <div className="mb-3 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[.22em]" style={{ color: C.gold }}>
      <span className="h-px w-7" style={{ background: C.gold }} />
      {children}
    </div>
  );
}

function Header({ onAdd }) {
  return (
    <div className="relative overflow-hidden rounded-[30px] px-6 py-8 md:px-9" style={{
      background: "radial-gradient(circle at 90% 10%,rgba(165,43,74,.32),transparent 34%),linear-gradient(135deg,#1B101C,#2B1423 58%,#40172A)",
      color: "white",
      boxShadow: "0 28px 65px rgba(43,20,35,.18)"
    }}>
      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Label>Blog Manager</Label>
          <h1 className="text-3xl font-black tracking-[-.045em] md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Manage your school journal.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/70">
            Edit the same stories, categories and page content visitors see on the public Blog page.
          </p>
        </div>
        <button
          onClick={onAdd}
          className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-black"
          style={{ background: `linear-gradient(135deg,${C.goldLight},${C.gold})`, color: C.burgundy }}
        >
          <Plus size={17} />
          Add Blog Post
        </button>
      </div>
    </div>
  );
}

function Settings({ form, setForm, onSave, saving }) {
  return (
    <section className="rounded-[26px] p-5 md:p-6" style={{ background: C.paper, border: `1px solid ${C.line}`, boxShadow: "0 18px 45px rgba(69,48,38,.07)" }}>
      <Label>Blog identity</Label>
      <h2 className="text-2xl font-black" style={{ color: C.ink, fontFamily: "var(--font-display)" }}>Page Settings</h2>
      <p className="mt-1 text-xs" style={{ color: C.muted }}>These values appear in the public Blog hero.</p>
      <div className="mt-5 space-y-4">
        <Field label="Page Badge" value={form.pageBadge} onChange={(v) => setForm((x) => ({ ...x, pageBadge: v }))} />
        <Field label="Page Title" value={form.pageTitle} onChange={(v) => setForm((x) => ({ ...x, pageTitle: v }))} />
        <Field label="Page Description" value={form.pageDescription} onChange={(v) => setForm((x) => ({ ...x, pageDescription: v }))} textarea />
        <Field label="Categories" value={form.categoriesText} onChange={(v) => setForm((x) => ({ ...x, categoriesText: v }))} placeholder="Events, Academics, Achievements, Sports, Notice" />
        <button
          disabled={saving}
          onClick={onSave}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-black disabled:opacity-60"
          style={{ background: `linear-gradient(135deg,${C.goldLight},${C.gold})`, color: C.burgundy }}
        >
          <Save size={16} />
          {saving ? "Saving..." : "Save Page Settings"}
        </button>
      </div>
    </section>
  );
}

function Card({ post, index, onEdit, onDelete, onToggle, onPin }) {
  return (
    <motion.article
      layout
      className="overflow-hidden rounded-[24px]"
      style={{ background: C.paper, border: `1px solid ${C.line}`, boxShadow: "0 16px 38px rgba(69,48,38,.07)" }}
    >
      <div className="grid md:grid-cols-[220px_minmax(0,1fr)]">
        <div className="relative h-48 overflow-hidden md:h-full md:min-h-[205px]">
          <ImagePreview post={post} />
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            <span className="rounded-full px-2.5 py-1 text-[10px] font-black" style={{ background: "rgba(255,253,248,.94)", color: C.burgundy }}>
              <Tag size={11} className="mr-1 inline" />
              {post.category || "School Life"}
            </span>
            {post.pinned && (
              <span className="rounded-full px-2.5 py-1 text-[10px] font-black" style={{ background: "rgba(232,207,150,.95)", color: C.burgundy }}>
                <Pin size={11} className="mr-1 inline" />
                Featured
              </span>
            )}
          </div>
          <span className="absolute bottom-4 left-4 text-[10px] font-black tracking-[.18em] text-white/75">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        <div className="flex min-w-0 flex-col p-5 md:p-6">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full px-2.5 py-1 text-[10px] font-black" style={{
              background: post.visible !== false ? "rgba(22,138,58,.09)" : "rgba(117,106,112,.08)",
              color: post.visible !== false ? C.green : C.muted
            }}>
              {post.visible !== false ? <Eye size={11} className="mr-1 inline" /> : <EyeOff size={11} className="mr-1 inline" />}
              {post.visible !== false ? "Published" : "Hidden"}
            </span>
            <span className="rounded-full px-2.5 py-1 text-[10px] font-bold" style={{ background: C.paper2, border: `1px solid ${C.line}`, color: C.muted }}>
              <Calendar size={11} className="mr-1 inline" />
              {formatBlogDate(post.date)}
            </span>
          </div>
          <h3 className="mt-3 line-clamp-2 text-xl font-black leading-tight" style={{ color: C.ink, fontFamily: "var(--font-display)" }}>
            {post.title || "Untitled Blog Post"}
          </h3>
          <p className="mt-2 line-clamp-3 text-sm leading-6" style={{ color: C.muted }}>{excerpt(post)}</p>
          <div className="mt-5 flex flex-wrap gap-2 border-t pt-4" style={{ borderColor: C.line }}>
            <button onClick={() => onEdit(post)} className="rounded-full border px-3.5 py-2 text-xs font-black" style={{ borderColor: C.line, color: C.burgundy }}>
              <Pencil size={13} className="mr-1 inline" />
              Edit
            </button>
            <button onClick={() => onToggle(post)} className="rounded-full border px-3.5 py-2 text-xs font-black" style={{ borderColor: C.line, color: C.burgundy }}>
              {post.visible === false ? <Eye size={13} className="mr-1 inline" /> : <EyeOff size={13} className="mr-1 inline" />}
              {post.visible === false ? "Publish" : "Hide"}
            </button>
            <button onClick={() => onPin(post)} className="rounded-full border px-3.5 py-2 text-xs font-black" style={{ borderColor: C.line, color: post.pinned ? C.gold : C.burgundy }}>
              <Pin size={13} className="mr-1 inline" />
              {post.pinned ? "Unfeature" : "Feature"}
            </button>
            <button onClick={() => onDelete(post)} className="ml-auto rounded-full border px-3.5 py-2 text-xs font-black" style={{ borderColor: "rgba(198,40,40,.16)", color: C.red }}>
              <Trash2 size={13} className="mr-1 inline" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function Editor({ post, categories, saving, uploading, onClose, onSave, onChange, onUpload }) {
  const isNew = !post?.id || post?.title === "New Blog Post";
  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5"
      style={{ background: "rgba(20,10,18,.62)", backdropFilter: "blur(10px)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: .97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="max-h-[94vh] w-full max-w-5xl overflow-y-auto rounded-[30px]"
        style={{ background: C.paper, boxShadow: "0 42px 120px rgba(0,0,0,.30)" }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="h-1.5" style={{ background: `linear-gradient(90deg,${C.gold},${C.maroon},${C.burgundy})` }} />
        <div className="flex items-start justify-between gap-4 border-b px-5 py-5 md:px-7" style={{ borderColor: C.line }}>
          <div>
            <Label>{isNew ? "New story" : "Edit story"}</Label>
            <h2 className="text-2xl font-black" style={{ color: C.ink, fontFamily: "var(--font-display)" }}>
              {isNew ? "Create a Blog Post" : "Edit Blog Post"}
            </h2>
            <p className="mt-1 text-xs" style={{ color: C.muted }}>Everything saved here appears on the public Blog page.</p>
          </div>
          <button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full" style={{ background: C.paper2, color: C.burgundy }}>
            <X size={18} />
          </button>
        </div>
        <div className="grid gap-6 p-5 md:p-7 lg:grid-cols-[1.15fr_.85fr]">
          <div className="space-y-5">
            <Field label="Title" value={post.title} onChange={(v) => onChange("title", v)} />
            <div className="grid gap-4 sm:grid-cols-2">
              <label>
                <span className="mb-2 block text-xs font-black uppercase" style={{ color: C.muted }}>Category</span>
                <select
                  value={post.category || ""}
                  onChange={(e) => onChange("category", e.target.value)}
                  className="w-full rounded-2xl px-4 py-3.5 text-sm"
                  style={{ background: C.paper, border: `1px solid ${C.line}`, color: C.ink }}
                >
                  {categories.filter((x) => x !== "All").map((x) => <option key={x}>{x}</option>)}
                </select>
              </label>
              <Field label="Publish Date" type="date" value={post.date} onChange={(v) => onChange("date", v)} />
            </div>
            <Field label="Short Summary" value={post.excerpt} onChange={(v) => onChange("excerpt", v)} textarea rows={4} />
            <Field label="Full Article" value={post.content} onChange={(v) => onChange("content", v)} textarea rows={13} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Author" value={post.author} onChange={(v) => onChange("author", v)} />
              <Field label="Author Role" value={post.authorRole} onChange={(v) => onChange("authorRole", v)} />
            </div>
            <Field label="Image Alt Text" value={post.imageAlt} onChange={(v) => onChange("imageAlt", v)} />
            <div className="grid gap-3 sm:grid-cols-2">
              <Toggle checked={post.visible !== false} onChange={(v) => onChange("visible", v)} label="Published" description="Visible to visitors on /blogs." />
              <Toggle checked={!!post.pinned} onChange={(v) => onChange("pinned", v)} label="Featured story" description="Show this story first." />
            </div>
          </div>
          <div className="space-y-5">
            <div className="overflow-hidden rounded-[26px]" style={{ border: `1px solid ${C.line}`, background: C.paper2 }}>
              <div className="aspect-[16/10]">
                <ImagePreview post={post} />
              </div>
              <div className="p-5">
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl px-4 py-3.5 text-sm font-black" style={{ background: C.burgundy, color: "white" }}>
                  <UploadCloud size={17} />
                  {uploading ? "Uploading..." : "Upload Image"}
                  <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => onUpload(e.target.files?.[0])} />
                </label>
                <p className="mt-3 text-xs" style={{ color: C.muted }}>PNG, JPG or WebP. Maximum 6 MB.</p>
                <Field label="Or use an image URL" value={post.imageUrl} onChange={(v) => onChange("imageUrl", v)} />
              </div>
            </div>
            <div className="rounded-[26px] p-5" style={{ background: `linear-gradient(135deg,${C.burgundy},${C.burgundy2})`, color: "white" }}>
              <Label>Preview information</Label>
              <h3 className="text-xl font-black" style={{ fontFamily: "var(--font-display)" }}>{post.title || "Untitled Blog Post"}</h3>
              <p className="mt-2 text-sm leading-6 text-white/70">{excerpt(post)}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col-reverse gap-3 border-t p-5 sm:flex-row sm:justify-end" style={{ borderColor: C.line }}>
          <button
            onClick={onClose}
            disabled={saving || uploading}
            className="rounded-full border px-5 py-3 text-sm font-black"
            style={{ borderColor: C.line, color: C.burgundy }}
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={saving || uploading}
            className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-black disabled:opacity-60"
            style={{ background: `linear-gradient(135deg,${C.goldLight},${C.gold})`, color: C.burgundy }}
          >
            <Save size={16} />
            {saving ? "Saving..." : isNew ? "Publish Blog Post" : "Save Changes"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function DeleteModal({ post, saving, onCancel, onConfirm }) {
  return (
    <motion.div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
      style={{ background: "rgba(20,10,18,.64)", backdropFilter: "blur(8px)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={onCancel}
    >
      <motion.div
        className="w-full max-w-md rounded-[28px] p-6"
        style={{ background: C.paper, border: `1px solid ${C.line}`, boxShadow: "0 35px 90px rgba(0,0,0,.28)" }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="grid h-12 w-12 place-items-center rounded-2xl" style={{ background: "rgba(198,40,40,.08)", color: C.red }}>
          <Trash2 size={20} />
        </div>
        <h3 className="mt-4 text-xl font-black" style={{ color: C.ink }}>Delete this blog post?</h3>
        <p className="mt-2 text-sm leading-6" style={{ color: C.muted }}>
          <b style={{ color: C.ink }}>{post?.title}</b> will be removed from the blog content.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onCancel} disabled={saving} className="rounded-full border px-5 py-2.5 text-sm font-black" style={{ borderColor: C.line, color: C.burgundy }}>
            Cancel
          </button>
          <button onClick={onConfirm} disabled={saving} className="rounded-full px-5 py-2.5 text-sm font-black text-white" style={{ background: C.red }}>
            {saving ? "Deleting..." : "Delete Post"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AdminBlog() {
  const [content, setContent] = useState(() => mergeBlogContent(defaultBlogContent));
  const [settings, setSettings] = useState(() => {
    const x = mergeBlogContent(defaultBlogContent);
    return {
      pageBadge: x.pageBadge || "",
      pageTitle: x.pageTitle || "",
      pageDescription: x.pageDescription || "",
      categoriesText: (x.categories || []).filter((x) => x !== "All").join(", ")
    };
  });
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const ok = (m) => { setSuccess(m); setError(""); setTimeout(() => setSuccess(""), 3500); };
  const bad = (m) => { setError(m); setSuccess(""); };

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await api.get("/api/site-content/blogs", { timeout: 15000 });
        if (!alive) return;
        const x = mergeBlogContent(r.data?.data?.content || {});
        setContent(x);
        setSettings({
          pageBadge: x.pageBadge || "",
          pageTitle: x.pageTitle || "",
          pageDescription: x.pageDescription || "",
          categoriesText: (x.categories || []).filter((x) => x !== "All").join(", ")
        });
      } catch (e) {
        console.error(e);
        if (alive) bad(e?.response?.data?.message || "Could not load saved blog content. Default content shown.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const categories = useMemo(() => {
    return ["All", ...(content.categories || []).filter((x) => x && x !== "All")].filter((x, i, a) => a.indexOf(x) === i);
  }, [content.categories]);

  const posts = useMemo(() => {
    return [...(content.posts || [])]
      .sort((a, b) => a.pinned !== b.pinned ? (a.pinned ? -1 : 1) : String(b.date || "").localeCompare(String(a.date || "")))
      .filter((p) => !query || [p.title, p.category, p.excerpt, p.content, p.author].join(" ").toLowerCase().includes(query.toLowerCase()));
  }, [content.posts, query]);

  const save = async (next, msg) => {
    const clean = mergeBlogContent(next);
    const r = await api.put("/api/site-content/blogs", { content: clean }, { timeout: 15000, headers: auth() });
    if (r.data?.success === false) throw new Error(r.data.message || "Save rejected");
    const x = mergeBlogContent(r.data?.data?.content || r.data?.data || clean);
    setContent(x);
    setSettings({
      pageBadge: x.pageBadge || "",
      pageTitle: x.pageTitle || "",
      pageDescription: x.pageDescription || "",
      categoriesText: (x.categories || []).filter((x) => x !== "All").join(", ")
    });
    window.dispatchEvent(new CustomEvent("rr-blog-updated", { detail: x }));
    ok(msg);
    return x;
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const cats = settings.categoriesText.split(",").map((x) => x.trim()).filter(Boolean);
      await save({
        ...content,
        pageBadge: settings.pageBadge.trim(),
        pageTitle: settings.pageTitle.trim(),
        pageDescription: settings.pageDescription.trim(),
        categories: ["All", ...cats.filter((x) => x.toLowerCase() !== "all")]
      }, "Blog page settings saved.");
    } catch (e) {
      bad(e?.response?.data?.message || e.message || "Could not save settings.");
    } finally {
      setSaving(false);
    }
  };

  const change = (f, v) => setEditing((p) => {
    const n = { ...(p || {}), [f]: v };
    if (f === "title") n.slug = makeBlogSlug(v, n.id);
    return n;
  });

  const upload = async (file) => {
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) return bad("Please upload PNG, JPG or WebP image.");
    if (file.size > 6 * 1024 * 1024) return bad("Image must be less than 6 MB.");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const r = await api.post("/api/upload", fd, { timeout: 30000, headers: { ...auth(), "Content-Type": "multipart/form-data" } });
      const u = uploadUrl(r.data);
      if (!u) throw new Error("Image uploaded but no URL was returned.");
      change("imageUrl", u);
      ok("Image uploaded. Save the blog post to keep it.");
    } catch (e) {
      bad(e?.response?.data?.message || e.message || "Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const savePost = async () => {
    if (!String(editing?.title || "").trim()) return bad("Blog title is required.");
    setSaving(true);
    try {
      const p = normalizeBlogPost({
        ...editing,
        title: String(editing.title).trim(),
        slug: makeBlogSlug(editing.title, editing.id),
        category: editing.category || categories[1] || "Events",
        date: editing.date || new Date().toISOString().slice(0, 10),
        imageAlt: editing.imageAlt || editing.title,
        visible: editing.visible !== false,
        pinned: !!editing.pinned,
        author: editing.author || "Smriti Team",
        authorRole: editing.authorRole || "School Administration"
      }, 0);
      const exists = (content.posts || []).some((x) => String(x.id) === String(p.id));
      const next = exists ? (content.posts || []).map((x) => String(x.id) === String(p.id) ? p : x) : [p, ...(content.posts || [])];
      await save({ ...content, posts: next }, exists ? "Blog post updated." : "Blog post added.");
      setEditing(null);
    } catch (e) {
      bad(e?.response?.data?.message || e.message || "Could not save blog post.");
    } finally {
      setSaving(false);
    }
  };

  const toggle = async (p) => {
    setSaving(true);
    try {
      await save({
        ...content,
        posts: (content.posts || []).map((x) => String(x.id) === String(p.id) ? { ...x, visible: x.visible === false } : x)
      }, p.visible === false ? "Blog post published." : "Blog post hidden.");
    } catch (e) {
      bad(e?.message || "Could not update visibility.");
    } finally {
      setSaving(false);
    }
  };

  const pin = async (p) => {
    setSaving(true);
    try {
      await save({
        ...content,
        posts: (content.posts || []).map((x) => String(x.id) === String(p.id) ? { ...x, pinned: !x.pinned } : x)
      }, p.pinned ? "Story removed from featured." : "Story marked as featured.");
    } catch (e) {
      bad(e?.message || "Could not update featured status.");
    } finally {
      setSaving(false);
    }
  };

  const del = async () => {
    if (!deleting) return;
    setSaving(true);
    try {
      await save({ ...content, posts: (content.posts || []).filter((x) => String(x.id) !== String(deleting.id)) }, "Blog post deleted.");
      setDeleting(null);
    } catch (e) {
      bad(e?.message || "Could not delete blog post.");
    } finally {
      setSaving(false);
    }
  };

  const pub = (content.posts || []).filter((x) => x.visible !== false).length;
  const hidden = (content.posts || []).filter((x) => x.visible === false).length;

  return (
    <div className="min-h-full px-3 py-4 sm:px-5 md:px-7 md:py-6" style={{
      background: "radial-gradient(circle at 4% 8%,rgba(201,150,61,.09),transparent 24%),radial-gradient(circle at 96% 25%,rgba(165,43,74,.08),transparent 26%),#F4ECDF"
    }}>
      <div className="mx-auto max-w-[1500px] space-y-5">
        <Header onAdd={() => setEditing(emptyPost())} />
        <AnimatePresence>
          {success && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="rounded-2xl px-4 py-3 text-sm font-bold" style={{ background: "rgba(22,138,58,.08)", border: "1px solid rgba(22,138,58,.16)", color: C.green }}>
              <CheckCircle2 size={17} className="mr-2 inline" />
              {success}
            </motion.div>
          )}
          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="rounded-2xl px-4 py-3 text-sm font-bold" style={{ background: "rgba(198,40,40,.07)", border: "1px solid rgba(198,40,40,.14)", color: C.red }}>
              <AlertCircle size={17} className="mr-2 inline" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>
        <div className="grid gap-5 xl:grid-cols-[340px_minmax(0,1fr)]">
          <div className="space-y-5">
            <Settings form={settings} setForm={setSettings} onSave={saveSettings} saving={saving} />
            <section className="rounded-[26px] p-5" style={{ background: C.burgundy, color: "white" }}>
              <Label>Journal overview</Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  [content.posts?.length || 0, "Total stories"],
                  [pub, "Published"],
                  [hidden, "Hidden"],
                  [(content.posts || []).filter((x) => x.pinned).length, "Featured"]
                ].map(([n, l]) => (
                  <div key={l} className="rounded-2xl bg-white/10 p-4">
                    <div className="text-2xl font-black">{n}</div>
                    <div className="mt-1 text-[10px] font-black uppercase tracking-[.12em] text-white/60">{l}</div>
                  </div>
                ))}
              </div>
            </section>
          </div>
          <section className="min-w-0 rounded-[26px] p-4 sm:p-5 md:p-6" style={{ background: "rgba(255,252,247,.82)", border: `1px solid ${C.line}`, boxShadow: "0 18px 45px rgba(69,48,38,.07)" }}>
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <Label>School journal</Label>
                <h2 className="text-2xl font-black md:text-3xl" style={{ color: C.ink, fontFamily: "var(--font-display)" }}>Blog Posts</h2>
                <p className="mt-1 text-xs md:text-sm" style={{ color: C.muted }}>Add, edit, publish, hide, feature or delete stories.</p>
              </div>
              <div className="relative w-full md:max-w-xs">
                <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: C.muted }} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search posts..."
                  className="w-full rounded-full py-3 pl-11 pr-4 text-sm outline-none"
                  style={{ background: C.paper, border: `1px solid ${C.line}`, color: C.ink }}
                />
              </div>
            </div>
            {loading ? (
              <div className="grid place-items-center py-20">
                <p className="text-sm font-bold" style={{ color: C.muted }}>Loading your school journal...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="mt-6 rounded-[26px] border border-dashed p-10 text-center" style={{ borderColor: C.line, background: C.paper }}>
                <BookOpen size={30} className="mx-auto" style={{ color: C.gold }} />
                <h3 className="mt-4 text-xl font-black" style={{ color: C.ink }}>No stories found</h3>
                <button onClick={() => setEditing(emptyPost())} className="mt-5 rounded-full px-5 py-3 text-sm font-black" style={{ background: C.burgundy, color: "white" }}>
                  Add Blog Post
                </button>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {posts.map((p, i) => (
                  <Card key={p.id || p.slug || i} post={p} index={i} onEdit={setEditing} onDelete={setDeleting} onToggle={toggle} onPin={pin} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
      <AnimatePresence>
        {editing && (
          <Editor post={editing} categories={categories} saving={saving} uploading={uploading} onClose={() => !saving && !uploading && setEditing(null)} onSave={savePost} onChange={change} onUpload={upload} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {deleting && (
          <DeleteModal post={deleting} saving={saving} onCancel={() => !saving && setDeleting(null)} onConfirm={del} />
        )}
      </AnimatePresence>
    </div>
  );
}