import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "motion/react";
import {
  ArrowRight,
  CalendarDays,
  Image as ImageIcon,
  Search,
  Sparkles,
} from "lucide-react";

const colors = {
  red: "#D71920",
  green: "#168A3A",
  purple: "#4B2E83",
  dark: "#0B1020",
  cream: "#FFF8EE",
  gold: "#FACC15",
  cyan: "#38BDF8",
  blue: "#1877F2",
};

const API_URL =
  import.meta.env.VITE_API_URL || "https://school-website-backend-ixx2.onrender.com";

export const defaultBlogContent = {
  pageBadge: "News & Events",
  pageTitle: "School Blog & Events",
  pageDescription:
    "Read school activities, programs, student achievements, competitions, and important event updates.",
  categories: ["All", "Events", "Academics", "Achievements", "Sports", "Notice"],
  posts: [],
};

function normalizeArray(value, fallback = []) {
  return Array.isArray(value) ? value : fallback;
}

export function makeBlogSlug(title = "post", id = "") {
  const base = String(title || "post")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u0900-\u097F]+/g, "-")
    .replace(/^-+|-+$/g, "") || "post";

  return id ? `${base}-${id}` : base;
}

export function normalizeBlogPost(post = {}, index = 0) {
  const id = post.id || Date.now() + index;
  const title = post.title || "Untitled Blog Post";

  return {
    id,
    title,
    slug: post.slug || makeBlogSlug(title, id),
    category: post.category || "Events",
    date: post.date || post.created_at || new Date().toISOString().slice(0, 10),
    excerpt: post.excerpt || "",
    content: post.content || "",
    imageUrl: post.imageUrl || post.image_url || post.image || "",
    imageAlt: post.imageAlt || post.image_alt || title,
    pinned: Boolean(post.pinned),
    visible: post.visible !== false,
  };
}

export function mergeBlogContent(saved = {}) {
  const savedCategories = normalizeArray(saved.categories, defaultBlogContent.categories);
  const cleanedCategories = Array.from(
    new Set(["All", ...savedCategories.filter(Boolean).filter((item) => item !== "All")])
  );

  return {
    ...defaultBlogContent,
    ...(saved || {}),
    categories: cleanedCategories,
    posts: normalizeArray(saved.posts, []).map(normalizeBlogPost),
  };
}

export function formatBlogDate(value) {
  if (!value) return "Date not set";

  try {
    return new Date(value).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return value;
  }
}

function getPlainExcerpt(post = {}) {
  const text = String(post.excerpt || post.content || "")
    .replace(/\s+/g, " ")
    .trim();

  if (!text) return "Read this school update.";
  return text.length > 145 ? `${text.slice(0, 145).trim()}...` : text;
}

function BlogImage({ post, className = "" }) {
  if (post.imageUrl) {
    return (
      <img
        src={post.imageUrl}
        alt={post.imageAlt || post.title}
        className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${className}`}
      />
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-slate-100">
      <ImageIcon className="h-12 w-12 text-slate-300" />
    </div>
  );
}

function BlogCard({ post, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.05 }}
      className="group overflow-hidden rounded-[28px] bg-white shadow-xl transition-all duration-300 hover:-translate-y-1"
      style={{
        border: "1px solid rgba(15,23,42,0.08)",
        boxShadow: "0 18px 44px rgba(15,23,42,0.08)",
      }}
    >
      <Link to={`/blogs/${post.slug}`} className="block">
        <div className="h-56 overflow-hidden bg-slate-100">
          <BlogImage post={post} />
        </div>

        <div className="p-6">
          <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-black uppercase tracking-[0.12em]">
            <span
              className="rounded-full px-3 py-1"
              style={{ background: "rgba(22,138,58,0.08)", color: colors.green }}
            >
              {post.category}
            </span>
            <span className="text-slate-400">{formatBlogDate(post.date)}</span>
          </div>

          <h2
            className="line-clamp-2 text-2xl text-slate-950"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 850,
              letterSpacing: "-0.035em",
              lineHeight: 1.08,
            }}
          >
            {post.title}
          </h2>

          <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-slate-500">
            {getPlainExcerpt(post)}
          </p>

          <div
            className="mt-5 inline-flex items-center gap-2 text-sm font-black"
            style={{ color: colors.green }}
          >
            Read More <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

export default function Blogs() {
  const [content, setContent] = useState(() => mergeBlogContent(defaultBlogContent));
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    let alive = true;

    const loadBlogs = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/site-content/blogs`, {
          timeout: 12000,
        });

        if (!alive) return;
        setContent(mergeBlogContent(res.data?.data?.content || {}));
      } catch (error) {
        console.error("Blog content load error:", error);
        if (alive) setContent(mergeBlogContent(defaultBlogContent));
      }
    };

    loadBlogs();

    return () => {
      alive = false;
    };
  }, []);

  const visiblePosts = useMemo(() => {
    const searchText = query.trim().toLowerCase();

    return (content.posts || [])
      .filter((post) => post.visible !== false)
      .sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        return String(b.date || "").localeCompare(String(a.date || ""));
      })
      .filter((post) => category === "All" || post.category === category)
      .filter((post) => {
        if (!searchText) return true;
        const haystack = `${post.title} ${post.category} ${post.excerpt} ${post.content}`.toLowerCase();
        return haystack.includes(searchText);
      });
  }, [content.posts, category, query]);

  const featuredPosts = visiblePosts.slice(0, 3);

  return (
    <section
      className="min-h-screen overflow-hidden pt-28 pb-24 relative"
      style={{
        background: `
          radial-gradient(circle at top right, rgba(75,46,131,0.14), transparent 34%),
          radial-gradient(circle at bottom left, rgba(22,138,58,0.12), transparent 32%),
          linear-gradient(180deg, #FFF8EE 0%, #F8FAFC 54%, #F1ECFF 100%)
        `,
      }}
    >
      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="mb-10 grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end"
        >
          <div>
            <span
              className="mb-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black uppercase tracking-[0.14em]"
              style={{
                background: "rgba(215,25,32,0.08)",
                color: colors.red,
                border: "1px solid rgba(215,25,32,0.16)",
              }}
            >
              <Sparkles className="h-4 w-4" />
              {content.pageBadge}
            </span>

            <h1
              className="text-5xl md:text-6xl text-slate-950"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                letterSpacing: "-0.065em",
                lineHeight: 0.95,
              }}
            >
              {content.pageTitle}
            </h1>

            <p className="mt-5 max-w-3xl text-base md:text-lg leading-relaxed text-slate-500">
              {content.pageDescription}
            </p>
          </div>

          <div
            className="rounded-[28px] bg-white/80 p-5 shadow-xl"
            style={{ border: "1px solid rgba(15,23,42,0.08)", backdropFilter: "blur(18px)" }}
          >
            <label className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-slate-400">
              Search Posts
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search blog..."
                  className="w-full rounded-2xl border border-slate-200 bg-white px-11 py-3 text-sm outline-none"
                />
              </div>
            </div>

            <label className="mb-2 mt-4 block text-xs font-black uppercase tracking-[0.14em] text-slate-400">
              Category
            </label>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 outline-none"
            >
              {(content.categories || ["All"]).map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {featuredPosts.length > 0 && (
          <div className="mb-10 grid gap-6 lg:grid-cols-3">
            {featuredPosts.map((post, index) => (
              <BlogCard key={post.id || post.slug} post={post} index={index} />
            ))}
          </div>
        )}

        {visiblePosts.length > featuredPosts.length && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visiblePosts.slice(featuredPosts.length).map((post, index) => (
              <BlogCard key={post.id || post.slug} post={post} index={index + featuredPosts.length} />
            ))}
          </div>
        )}

        {visiblePosts.length === 0 && (
          <div className="rounded-[30px] bg-white/85 p-10 text-center shadow-xl border border-slate-100">
            <CalendarDays className="mx-auto mb-4 h-12 w-12 text-slate-300" />
            <h2 className="text-2xl font-black text-slate-950">No blog posts available</h2>
            <p className="mt-2 text-slate-500">School news and events will appear here once added from admin panel.</p>
          </div>
        )}
      </div>
    </section>
  );
}
