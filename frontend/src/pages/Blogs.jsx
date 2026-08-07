import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";
import { motion } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  Calendar,
  Clock,
  Image as ImageIcon,
  Search,
  Sparkles,
  Tag,
} from "lucide-react";
import {
  defaultBlogContent,
  formatBlogDate,
  getAuthorInfo,
  getReadTime,
  makeBlogSlug,
  mergeBlogContent,
  normalizeBlogPost,
} from "./blogUtils";

export {
  defaultBlogContent,
  formatBlogDate,
  makeBlogSlug,
  mergeBlogContent,
  normalizeBlogPost,
};

const colors = {
  navy: "#0A1628",
  primary: "#1E3A5F",
  secondary: "#2D6A4F",
  gold: "#C9A84C",
  red: "#D71920",
  green: "#168A3A",
  cyan: "#38BDF8",
};

const API_URL = import.meta.env.VITE_API_URL;

function getPlainExcerpt(post = {}) {
  const text = String(post.excerpt || post.content || "")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!text) return "Read this school update and explore the latest insights.";
  return text.length > 145 ? `${text.slice(0, 145).trim()}...` : text;
}

function BlogImage({ post, className = "" }) {
  if (post?.imageUrl) {
    return (
      <img
        src={post.imageUrl}
        alt={post.imageAlt || post.title}
        className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${className}`}
      />
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-300">
      <ImageIcon className="h-12 w-12" />
    </div>
  );
}

function FeaturedPostCard({ post }) {
  if (!post) return null;
  const { authorName, initial } = getAuthorInfo(post);
  const readTime = getReadTime(post.content, post.excerpt);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group relative mb-14 overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/40 transition-all duration-300 hover:shadow-2xl"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
        {/* Left Featured Image */}
        <div className="relative lg:col-span-6 min-h-[300px] sm:min-h-[380px] lg:min-h-[440px] overflow-hidden bg-slate-100">
          <div className="absolute top-4 left-4 z-20">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#0A1628]/90 text-white backdrop-blur-md px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider shadow-lg border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Featured
            </span>
          </div>

          <BlogImage post={post} className="h-full w-full object-cover" />
        </div>

        {/* Right Featured Content */}
        <div className="lg:col-span-6 p-7 sm:p-10 lg:p-12 flex flex-col justify-between bg-white">
          <div>
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-sky-600 mb-3">
              <Tag className="w-3.5 h-3.5 text-sky-500" />
              <span>{post.category}</span>
            </div>

            <Link to={`/blogs/${post.slug}`}>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A1628] leading-tight tracking-tight hover:text-blue-600 transition-colors line-clamp-2">
                {post.title}
              </h2>
            </Link>

            <p className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed line-clamp-3">
              {getPlainExcerpt(post)}
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1E3A5F] text-white font-bold text-sm flex items-center justify-center shadow-inner">
                {initial}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800 leading-none">{authorName}</p>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 font-medium">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {formatBlogDate(post.date)}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {readTime}
                  </span>
                </div>
              </div>
            </div>

            <Link
              to={`/blogs/${post.slug}`}
              className="inline-flex items-center gap-2 text-sm font-extrabold text-[#1E3A5F] hover:text-blue-600 transition-all group/btn"
            >
              <span>Read Article</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function BlogCard({ post, index }) {
  const { authorName, initial } = getAuthorInfo(post);
  const readTime = getReadTime(post.content, post.excerpt);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative rounded-2xl bg-white border border-slate-200/80 shadow-md shadow-slate-100 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col justify-between"
    >
      <Link to={`/blogs/${post.slug}`} className="block flex-1 flex flex-col">
        {/* Category Overlay Badge on top of Image */}
        <div className="relative h-52 sm:h-56 overflow-hidden bg-slate-100">
          <div className="absolute top-3.5 left-3.5 z-10">
            <span className="rounded-full bg-white/95 backdrop-blur-md px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-slate-800 shadow-sm border border-slate-200/60">
              {post.category}
            </span>
          </div>

          <BlogImage post={post} />
        </div>

        {/* Card Content Body */}
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-2.5">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {formatBlogDate(post.date)}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {readTime}
              </span>
            </div>

            <h3 className="text-lg font-extrabold text-[#0A1628] leading-snug hover:text-blue-600 transition-colors line-clamp-2">
              {post.title}
            </h3>

            <p className="mt-3 text-slate-600 text-sm line-clamp-3 leading-relaxed">
              {getPlainExcerpt(post)}
            </p>
          </div>

          {/* Footer Metadata */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-full bg-[#1E3A5F] text-white font-bold text-xs flex items-center justify-center shrink-0">
                {initial}
              </div>
              <span className="text-xs font-semibold text-slate-700 truncate max-w-[130px]">
                {authorName}
              </span>
            </div>

            <span className="inline-flex items-center gap-1 text-xs font-extrabold text-[#1E3A5F] hover:text-blue-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0">
              Read <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

const BENCHES_BG_IMAGE = "http://localhost:5000/api/blogs"

export default function Blogs() {
  const [content, setContent] = useState(() => mergeBlogContent(defaultBlogContent));
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    let alive = true;

    const loadBlogs = async () => {
      try {
        const res = await api.get("/api/site-content/blogs");
        if (!alive) return;
        setContent(mergeBlogContent(res.data?.data?.content || {}));

        console.log("API Response:", res.data);
        console.log("Posts:", res.data?.data?.content?.posts);

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

  const featuredPost = visiblePosts.length > 0 ? visiblePosts[0] : null;
  const gridPosts = visiblePosts.length > 0 ? visiblePosts.slice(1) : [];

  return (
    <section className="min-h-screen relative pt-28 pb-24 overflow-hidden bg-slate-100">
      {/* Light Classroom Benches Background Image */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src={content.heroBackgroundImage}
          alt="Classroom Benches Background"
          className="w-full h-full object-cover"
          style={{
            filter: "brightness(0.92) contrast(0.92) saturate(0.95)",
          }}
        />
        {/* Light Glassy Gradient Overlay over the Benches image */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(248,250,252,0.88) 50%, rgba(241,245,249,0.92) 100%),
              radial-gradient(circle at 50% 20%, rgba(201,168,76,0.12) 0%, transparent 60%)
            `,
            backdropFilter: "blur(14px)",
          }}
        />
      </div>
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 relative z-10">
        {/* Header / Hero Section matching Image 1 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          {/* Top Badge */}
          <div className="mb-4">
            <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest bg-sky-50 text-sky-700 border border-sky-200/80 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              {content.pageBadge || "Knowledge Hub"}
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0A1628] tracking-tight leading-[1.08]">
            {content.pageTitle || "School Blog & Insights"}
          </h1>

          {/* Subtitle */}
          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
            {content.pageDescription ||
              "Explore school activities, academic excellence, student achievements, competitions, and important educational updates."}
          </p>

          {/* Search Bar & Category Filter Pills */}
          <div className="mt-8 flex flex-col gap-6">
            {/* Search Input Box */}
            <div className="relative max-w-md w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles..."
                className="w-full rounded-xl border border-slate-200/90 bg-white py-3.5 pl-11 pr-10 text-sm text-slate-800 placeholder-slate-400 outline-none shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold bg-slate-100 rounded-full w-5 h-5 flex items-center justify-center cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Filter Pills Row */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              {(content.categories || ["All"]).map((cat) => {
                const isActive = category === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`rounded-full px-5 py-2 text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${isActive
                      ? "bg-[#0A1628] text-white shadow-md shadow-slate-900/10 border border-[#0A1628]"
                      : "bg-white text-slate-600 border border-slate-200/90 hover:bg-slate-50 hover:border-slate-300"
                      }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Featured Post Card (Image 2 design) */}
        {featuredPost && <FeaturedPostCard post={featuredPost} />}

        {/* Blog Cards Grid (Image 3 design) */}
        {gridPosts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gridPosts.map((post, index) => (
              <BlogCard key={post.id || post.slug} post={post} index={index} />
            ))}
          </div>
        )}

        {/* Empty State when no posts match */}
        {visiblePosts.length === 0 && (
          <div className="rounded-3xl bg-white p-12 text-center shadow-lg border border-slate-200/70 max-w-lg mx-auto my-12">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-7 w-7 text-slate-400" />
            </div>
            <h2 className="text-xl font-extrabold text-[#0A1628]">No articles found</h2>
            <p className="mt-2 text-sm text-slate-500">
              {query
                ? `No articles match "${query}". Try searching with different keywords.`
                : "School news and blog posts will appear here once published."}
            </p>
            {query && (
              <button
                onClick={() => setQuery("")}
                className="mt-5 rounded-full bg-[#0A1628] px-6 py-2.5 text-xs font-bold text-white hover:bg-blue-900 transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

