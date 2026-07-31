import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "motion/react";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  Image as ImageIcon,
  Newspaper,
  Pencil,
  Plus,
  Save,
  Search,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import {
  defaultBlogContent,
  formatBlogDate,
  makeBlogSlug,
  mergeBlogContent,
  normalizeBlogPost,
} from "../pages/Blogs";

const colors = {
  red: "#D71920",
  green: "#168A3A",
  purple: "#4B2E83",
  dark: "#0B1020",
  cyan: "#38BDF8",
  gold: "#FACC15",
  orange: "#F97316",
};

const API_URL =
  import.meta.env.VITE_API_URL || "https://school-website-backend-ixx2.onrender.com";

const panelStyle = {
  background:
    "linear-gradient(135deg, rgba(255,255,255,0.96), rgba(248,244,255,0.95), rgba(238,247,255,0.95))",
  border: "1px solid rgba(75,46,131,0.12)",
  boxShadow: "0 18px 44px rgba(15,23,42,0.08)",
  backdropFilter: "blur(14px)",
};

function getAuthHeaders(json = false) {
  const token =
    localStorage.getItem("adminToken") ||
    localStorage.getItem("token") ||
    localStorage.getItem("admin_token") ||
    "";

  const headers = {};
  if (json) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

function getUploadUrl(payload) {
  return (
    payload?.url ||
    payload?.imageUrl ||
    payload?.fileUrl ||
    payload?.data?.url ||
    payload?.data?.imageUrl ||
    payload?.data?.fileUrl ||
    payload?.data?.secure_url ||
    payload?.file?.url ||
    ""
  );
}

function Field({ label, value, onChange, placeholder = "", textarea = false, type = "text", rows = 4 }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-black text-slate-700">{label}</label>
      {textarea ? (
        <textarea
          value={value || ""}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="w-full resize-none rounded-2xl px-4 py-3 text-sm outline-none"
          style={{ background: "rgba(255,255,255,0.92)", border: "1px solid rgba(75,46,131,0.16)", color: colors.dark }}
        />
      ) : (
        <input
          type={type}
          value={value || ""}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="w-full rounded-2xl px-4 py-3 text-sm outline-none"
          style={{ background: "rgba(255,255,255,0.92)", border: "1px solid rgba(75,46,131,0.16)", color: colors.dark }}
        />
      )}
    </div>
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 rounded-2xl px-4 py-3 text-left"
      style={{
        background: checked ? "rgba(22,138,58,0.08)" : "rgba(100,116,139,0.08)",
        border: checked ? "1px solid rgba(22,138,58,0.18)" : "1px solid rgba(100,116,139,0.18)",
      }}
    >
      <span className="text-sm font-black text-slate-700">{label}</span>
      <span className="relative h-7 w-12 rounded-full transition-all" style={{ background: checked ? colors.green : "#CBD5E1" }}>
        <span className="absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all" style={{ left: checked ? "24px" : "4px" }} />
      </span>
    </button>
  );
}

function createEmptyPost() {
  const id = Date.now();
  return {
    id,
    title: "New Blog Post",
    slug: makeBlogSlug("New Blog Post", id),
    category: "Events",
    date: new Date().toISOString().slice(0, 10),
    excerpt: "Short summary for this blog post.",
    content: "Write the full blog content here.",
    imageUrl: "",
    imageAlt: "",
    pinned: false,
    visible: true,
  };
}

function BlogImagePreview({ imageUrl }) {
  if (imageUrl) {
    return <img src={imageUrl} alt="Blog preview" className="h-full w-full object-cover" />;
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-slate-100">
      <ImageIcon className="h-10 w-10 text-slate-300" />
    </div>
  );
}

export default function AdminBlog() {
  const [content, setContent] = useState(() => mergeBlogContent(defaultBlogContent));
  const [settingsForm, setSettingsForm] = useState(() => mergeBlogContent(defaultBlogContent));
  const [editingPost, setEditingPost] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [query, setQuery] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    const loadBlogs = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/site-content/blogs`, {
          timeout: 12000,
        });

        if (!alive) return;
        const saved = mergeBlogContent(res.data?.data?.content || {});
        setContent(saved);
        setSettingsForm(saved);
      } catch (err) {
        console.error("Load blog content error:", err);
        if (alive) setError("Could not load saved blog content. Default content shown.");
      }
    };

    loadBlogs();

    return () => {
      alive = false;
    };
  }, []);

  const sortedPosts = useMemo(() => {
    const searchText = query.trim().toLowerCase();

    return [...(content.posts || [])]
      .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")))
      .filter((post) => {
        if (!searchText) return true;
        const haystack = `${post.title} ${post.category} ${post.excerpt} ${post.content}`.toLowerCase();
        return haystack.includes(searchText);
      });
  }, [content.posts, query]);

  const saveBlogContent = async (nextContent, message = "Blog saved successfully.") => {
    const cleanContent = mergeBlogContent(nextContent);

    await axios.put(
      `${API_URL}/api/site-content/blogs`,
      { content: cleanContent },
      { headers: getAuthHeaders(true), timeout: 15000 }
    );

    setContent(cleanContent);
    setSettingsForm(cleanContent);
    setSuccess(message);
    return cleanContent;
  };

  const saveSettings = async () => {
    setSaving(true);
    setSuccess("");
    setError("");

    try {
      const categories = String(settingsForm.categoriesText || settingsForm.categories?.join(", ") || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      await saveBlogContent(
        {
          ...content,
          pageBadge: settingsForm.pageBadge || "",
          pageTitle: settingsForm.pageTitle || "",
          pageDescription: settingsForm.pageDescription || "",
          categories: ["All", ...categories.filter((item) => item !== "All")],
        },
        "Blog page settings saved."
      );
    } catch (err) {
      console.error("Save blog settings error:", err);
      setError(err.response?.data?.message || "Could not save blog settings.");
    } finally {
      setSaving(false);
    }
  };

  const openNewPost = () => {
    setSuccess("");
    setError("");
    setEditingPost(createEmptyPost());
  };

  const openEditPost = (post) => {
    setSuccess("");
    setError("");
    setEditingPost({ ...post });
  };

  const closeEditor = () => {
    if (saving || uploading) return;
    setEditingPost(null);
  };

  const updateEditingPost = (name, value) => {
    setEditingPost((prev) => {
      const next = { ...(prev || {}), [name]: value };
      if (name === "title") {
        next.slug = makeBlogSlug(value, next.id);
      }
      return next;
    });
  };

  const uploadImage = async (file) => {
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSize = 6 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      setError("Please upload PNG, JPG, or WebP image.");
      return;
    }

    if (file.size > maxSize) {
      setError("Image must be less than 6 MB.");
      return;
    }

    setUploading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(`${API_URL}/api/upload`, formData, {
        headers: {
          ...getAuthHeaders(false),
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000,
      });

      const uploadedUrl = getUploadUrl(res.data);

      if (!uploadedUrl) {
        setError("Image uploaded but backend did not return URL.");
        return;
      }

      updateEditingPost("imageUrl", uploadedUrl);
      setSuccess("Image uploaded. Save the blog post to keep it.");
    } catch (err) {
      console.error("Blog image upload error:", err);
      setError(err.response?.data?.message || "Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const savePost = async () => {
    if (!String(editingPost?.title || "").trim()) {
      setError("Blog title is required.");
      return;
    }

    setSaving(true);
    setSuccess("");
    setError("");

    try {
      const cleanPost = normalizeBlogPost(
        {
          ...editingPost,
          slug: makeBlogSlug(editingPost.title, editingPost.id),
          imageAlt: editingPost.imageAlt || editingPost.title,
        },
        0
      );

      const exists = (content.posts || []).some((post) => post.id === cleanPost.id);
      const nextPosts = exists
        ? (content.posts || []).map((post) => (post.id === cleanPost.id ? cleanPost : post))
        : [cleanPost, ...(content.posts || [])];

      await saveBlogContent(
        {
          ...content,
          posts: nextPosts,
        },
        exists ? "Blog post updated." : "Blog post added."
      );

      setEditingPost(null);
    } catch (err) {
      console.error("Save blog post error:", err);
      setError(err.response?.data?.message || "Could not save blog post.");
    } finally {
      setSaving(false);
    }
  };

  const togglePostVisibility = async (post) => {
    setSaving(true);
    setSuccess("");
    setError("");

    try {
      const nextPosts = (content.posts || []).map((item) =>
        item.id === post.id ? { ...item, visible: item.visible === false } : item
      );

      await saveBlogContent({ ...content, posts: nextPosts }, "Blog visibility updated.");
    } catch (err) {
      console.error("Toggle blog visibility error:", err);
      setError(err.response?.data?.message || "Could not update visibility.");
    } finally {
      setSaving(false);
    }
  };

  const deletePost = async () => {
    if (!deleteTarget) return;

    setSaving(true);
    setSuccess("");
    setError("");

    try {
      const nextPosts = (content.posts || []).filter((post) => post.id !== deleteTarget.id);
      await saveBlogContent({ ...content, posts: nextPosts }, "Blog post deleted.");
      setDeleteTarget(null);
      if (editingPost?.id === deleteTarget.id) setEditingPost(null);
    } catch (err) {
      console.error("Delete blog post error:", err);
      setError(err.response?.data?.message || "Could not delete blog post.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[24px] p-4 sm:p-5 md:p-6"
        style={panelStyle}
      >
        <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-black text-indigo-700 border border-indigo-100">
              <Newspaper className="h-3.5 w-3.5" />
              Blog Manager
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-950" style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.04em" }}>
              Manage Blog / News & Events
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Add school event posts, upload images, write full article text, and publish or hide posts.
            </p>
          </div>

          <button
            type="button"
            onClick={openNewPost}
            className="inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-black transition-all hover:-translate-y-0.5"
            style={{ background: `linear-gradient(135deg, ${colors.gold}, ${colors.cyan})`, color: colors.dark }}
          >
            <Plus className="h-4 w-4" />
            Add Blog Post
          </button>
        </div>

        {success && (
          <div className="mb-4 flex items-center gap-2 rounded-2xl bg-green-50 px-4 py-3 font-semibold text-green-700 border border-green-100">
            <CheckCircle2 className="h-4 w-4" /> {success}
          </div>
        )}

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-2xl bg-red-50 px-4 py-3 font-semibold text-red-700 border border-red-100">
            <AlertCircle className="h-4 w-4" /> {error}
          </div>
        )}

        <div className="grid gap-5 xl:grid-cols-[380px_1fr]">
          <div className="space-y-5">
            <div className="rounded-[24px] bg-white p-5 border border-slate-100">
              <h3 className="mb-4 text-lg font-black text-slate-950">Page Settings</h3>
              <div className="space-y-4">
                <Field label="Page Badge" value={settingsForm.pageBadge} onChange={(value) => setSettingsForm((prev) => ({ ...prev, pageBadge: value }))} />
                <Field label="Page Title" value={settingsForm.pageTitle} onChange={(value) => setSettingsForm((prev) => ({ ...prev, pageTitle: value }))} />
                <Field label="Page Description" value={settingsForm.pageDescription} onChange={(value) => setSettingsForm((prev) => ({ ...prev, pageDescription: value }))} textarea />
                <Field
                  label="Categories"
                  value={settingsForm.categoriesText ?? (settingsForm.categories || []).filter((item) => item !== "All").join(", ")}
                  onChange={(value) => setSettingsForm((prev) => ({ ...prev, categoriesText: value }))}
                  placeholder="Events, Academics, Sports"
                />
                <button
                  type="button"
                  onClick={saveSettings}
                  disabled={saving}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-black disabled:opacity-60"
                  style={{ background: `linear-gradient(135deg, ${colors.gold}, ${colors.cyan})`, color: colors.dark }}
                >
                  <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Settings"}
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-[24px] bg-white p-5 border border-slate-100">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-lg font-black text-slate-950">Blog Posts</h3>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search posts..."
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-11 py-3 text-sm outline-none"
                />
              </div>
            </div>

            <div className="space-y-3">
              {sortedPosts.length > 0 ? (
                sortedPosts.map((post) => (
                  <div key={post.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
                      <div className="h-24 w-full overflow-hidden rounded-2xl bg-white lg:w-36 shrink-0">
                        <BlogImagePreview imageUrl={post.imageUrl} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-500 border border-slate-100">
                            {post.category}
                          </span>
                          <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-500 border border-slate-100">
                            {formatBlogDate(post.date)}
                          </span>
                          {post.visible === false && (
                            <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-black text-red-600 border border-red-100">
                              Hidden
                            </span>
                          )}
                        </div>

                        <div className="text-base font-black text-slate-950 line-clamp-2">{post.title}</div>
                        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-slate-500">{post.excerpt || post.content}</p>
                      </div>

                      <div className="flex flex-wrap gap-2 shrink-0">
                        <button type="button" onClick={() => openEditPost(post)} className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-xs font-black text-slate-600 border border-slate-200">
                          <Pencil className="h-3.5 w-3.5" /> Edit
                        </button>
                        <button type="button" onClick={() => togglePostVisibility(post)} disabled={saving} className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-xs font-black text-slate-600 border border-slate-200 disabled:opacity-60">
                          <Eye className="h-3.5 w-3.5" /> {post.visible === false ? "Show" : "Hide"}
                        </button>
                        <button type="button" onClick={() => setDeleteTarget(post)} className="inline-flex items-center gap-1.5 rounded-xl bg-red-50 px-3 py-2 text-xs font-black text-red-600 border border-red-100">
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm font-semibold text-slate-400">
                  No blog posts added yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {editingPost && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5"
            style={{ background: "rgba(2,6,23,0.55)", backdropFilter: "blur(12px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeEditor}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14, scale: 0.96 }}
              className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[28px] bg-white"
              style={{ border: "1px solid rgba(255,255,255,0.75)", boxShadow: "0 42px 110px rgba(0,0,0,0.28)" }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="h-1" style={{ background: `linear-gradient(90deg, ${colors.gold}, ${colors.cyan}, ${colors.green})` }} />
              <div className="p-6">
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-black text-slate-950">Edit Blog Post</h3>
                    <p className="text-sm text-slate-500">Save this post to update the public Blog page.</p>
                  </div>
                  <button type="button" onClick={closeEditor} className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="grid gap-5 lg:grid-cols-[230px_1fr]">
                  <div>
                    <div className="h-52 overflow-hidden rounded-3xl bg-slate-100 border border-slate-100">
                      <BlogImagePreview imageUrl={editingPost.imageUrl} />
                    </div>

                    <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-2xl px-4 py-3 font-black" style={{ background: `linear-gradient(135deg, ${colors.gold}, ${colors.cyan})`, color: colors.dark }}>
                      <UploadCloud className="h-4 w-4" /> {uploading ? "Uploading..." : "Upload Image"}
                      <input
                        type="file"
                        accept="image/*"
                        disabled={uploading}
                        onChange={(event) => {
                          uploadImage(event.target.files?.[0]);
                          event.target.value = "";
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="space-y-4">
                    <Field label="Title" value={editingPost.title} onChange={(value) => updateEditingPost("title", value)} />
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-black text-slate-700">Category</label>
                        <select
                          value={editingPost.category || "Events"}
                          onChange={(event) => updateEditingPost("category", event.target.value)}
                          className="w-full rounded-2xl px-4 py-3 text-sm outline-none"
                          style={{ background: "rgba(255,255,255,0.92)", border: "1px solid rgba(75,46,131,0.16)", color: colors.dark }}
                        >
                          {(content.categories || ["Events"]).filter((item) => item !== "All").map((item) => (
                            <option key={item} value={item}>{item}</option>
                          ))}
                        </select>
                      </div>
                      <Field label="Date" type="date" value={editingPost.date} onChange={(value) => updateEditingPost("date", value)} />
                    </div>
                    <Field label="Excerpt / Short Summary" value={editingPost.excerpt} onChange={(value) => updateEditingPost("excerpt", value)} textarea rows={3} />
                    <Field label="Full Content" value={editingPost.content} onChange={(value) => updateEditingPost("content", value)} textarea rows={9} />
                    <Field label="Image Alt Text" value={editingPost.imageAlt} onChange={(value) => updateEditingPost("imageAlt", value)} />
                    <Toggle label="Show this post on website" checked={editingPost.visible !== false} onChange={(value) => updateEditingPost("visible", value)} />
                    <Toggle label="Pin this post to top" checked={Boolean(editingPost.pinned)} onChange={(value) => updateEditingPost("pinned", value)} />
                  </div>
                </div>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <button type="button" onClick={() => setDeleteTarget(editingPost)} disabled={saving || uploading} className="rounded-2xl px-5 py-3 text-sm font-black disabled:opacity-60" style={{ background: "rgba(215,25,32,0.08)", color: colors.red, border: "1px solid rgba(215,25,32,0.18)" }}>
                    Delete
                  </button>
                  <button type="button" onClick={closeEditor} disabled={saving || uploading} className="flex-1 rounded-2xl px-5 py-3 text-sm font-black disabled:opacity-60" style={{ background: "rgba(15,23,42,0.06)", color: "rgba(15,23,42,0.65)", border: "1px solid rgba(15,23,42,0.08)" }}>
                    Cancel
                  </button>
                  <button type="button" onClick={savePost} disabled={saving || uploading} className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-black disabled:opacity-60" style={{ background: `linear-gradient(135deg, ${colors.gold}, ${colors.cyan})`, color: colors.dark }}>
                    <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Blog Post"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {deleteTarget && (
          <motion.div
            className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-5"
            style={{ background: "rgba(2,6,23,0.62)", backdropFilter: "blur(14px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              if (!saving) setDeleteTarget(null);
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              className="w-full max-w-md overflow-hidden rounded-[28px] bg-white"
              style={{ boxShadow: "0 42px 110px rgba(0,0,0,0.32)", border: "1px solid rgba(255,255,255,0.75)" }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="p-6">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                  <Trash2 className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-2xl font-black text-slate-950">Delete blog post?</h3>
                <p className="mb-6 text-sm leading-relaxed text-slate-500">
                  This will permanently delete <b>{deleteTarget.title}</b> from the Blog page.
                </p>
                <div className="flex gap-3">
                  <button type="button" disabled={saving} onClick={() => setDeleteTarget(null)} className="flex-1 rounded-2xl py-3 text-sm font-black disabled:opacity-60" style={{ background: "rgba(15,23,42,0.06)", color: "rgba(15,23,42,0.68)", border: "1px solid rgba(15,23,42,0.08)" }}>
                    Cancel
                  </button>
                  <button type="button" disabled={saving} onClick={deletePost} className="flex-1 rounded-2xl py-3 text-sm font-black text-white disabled:opacity-60" style={{ background: `linear-gradient(135deg, ${colors.red}, #991B1B)` }}>
                    {saving ? "Deleting..." : "Yes, Delete"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
