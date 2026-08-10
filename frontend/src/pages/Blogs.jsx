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

/* Gallery-aligned design tokens */
const palette = {
  navy: "#123A63",
  blue: "#2387C9",
  sky: "#63C7E8",
  gold: "#F2C14E",
  coral: "#F28C6B",
  mint: "#6FCF97",
  cream: "#FFF9E9",
  paper: "#F7FBFF",
  ink: "#14253D",
  muted: "#62748A",
  white: "#FFFFFF",
  border: "#DCE8F2",
};

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
        className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-[0.7deg] ${className}`}
      />
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-300">
      <ImageIcon className="h-12 w-12 text-[#9AA7B5]" />
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
      className="group relative mb-14 overflow-hidden rounded-[32px] border border-white/80 bg-white/85 backdrop-blur-xl shadow-[0_25px_70px_rgba(18,58,99,0.12)] transition-all duration-500 hover:-translate-y-2 hover:[transform:rotateX(1deg)_rotateY(-1deg)] hover:shadow-[0_35px_90px_rgba(18,58,99,0.20)]"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
        {/* Left Featured Image */}
        <div className="relative lg:col-span-6 min-h-[300px] sm:min-h-[380px] lg:min-h-[440px] overflow-hidden bg-[#EAF7FD] [transform:translateZ(0)]">
          <div className="absolute top-4 left-4 z-20">
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#123A63]/90 text-white backdrop-blur-md px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider shadow-lg border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-[#E9C46A]" />
              Featured
            </span>
          </div>

          <BlogImage post={post} className="h-full w-full object-cover" />
        </div>

        {/* Right Featured Content */}
        <div className="lg:col-span-6 p-7 sm:p-10 lg:p-12 flex flex-col justify-between bg-gradient-to-br from-white via-white to-[#FFF9E9]/70">
          <div>
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-[#2D6A4F] mb-3">
              <Tag className="w-3.5 h-3.5 text-[#2D6A4F]" />
              <span>{post.category}</span>
            </div>

            <Link to={`/blogs/${post.slug}`}>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#173B5F] leading-tight tracking-tight hover:text-[#2D6A4F] transition-colors line-clamp-2">
                {post.title}
              </h2>
            </Link>

            <p className="mt-4 text-[#667085] text-sm sm:text-base leading-relaxed line-clamp-3">
              {getPlainExcerpt(post)}
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-[#E9EDF1] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#173B5F] to-[#2D6A4F] text-white font-bold text-sm flex items-center justify-center shadow-inner">
                {initial}
              </div>
              <div>
                <p className="text-sm font-bold text-[#111827] leading-none">{authorName}</p>
                <div className="flex items-center gap-3 text-xs text-[#667085] mt-1 font-medium">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#9AA7B5]" />
                    {formatBlogDate(post.date)}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#9AA7B5]" />
                    {readTime}
                  </span>
                </div>
              </div>
            </div>

            <Link
              to={`/blogs/${post.slug}`}
              className="inline-flex items-center gap-2 text-sm font-extrabold text-[#173B5F] hover:text-[#2D6A4F] transition-all group/btn"
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
      className="group relative rounded-[26px] bg-white/90 backdrop-blur-xl border border-white shadow-[0_14px_35px_rgba(18,58,99,0.09)] hover:shadow-[0_28px_55px_rgba(18,58,99,0.18)] hover:-translate-y-3 hover:[transform:rotateX(2deg)_rotateY(-2deg)_translateZ(8px)] transition-all duration-500 overflow-hidden flex flex-col justify-between"
    >
      <Link to={`/blogs/${post.slug}`} className="block flex-1 flex flex-col">
        {/* Category Overlay Badge on top of Image */}
        <div className="relative h-52 sm:h-56 overflow-hidden bg-slate-100">
          <div className="absolute top-3.5 left-3.5 z-10">
            <span className="rounded-full bg-white/95 backdrop-blur-md px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#173B5F] shadow-sm border border-[#E9EDF1]">
              {post.category}
            </span>
          </div>

          <BlogImage post={post} />
        </div>

        {/* Card Content Body */}
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#667085] font-medium mb-2.5">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#9AA7B5]" />
                {formatBlogDate(post.date)}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#9AA7B5]" />
                {readTime}
              </span>
            </div>

            <h3 className="text-lg font-extrabold text-[#173B5F] leading-snug hover:text-[#2D6A4F] transition-colors line-clamp-2">
              {post.title}
            </h3>

            <p className="mt-3 text-[#667085] text-sm line-clamp-3 leading-relaxed">
              {getPlainExcerpt(post)}
            </p>
          </div>

          {/* Footer Metadata */}
          <div className="mt-6 pt-4 border-t border-[#E9EDF1] flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#173B5F] to-[#2D6A4F] text-white font-bold text-xs flex items-center justify-center shrink-0">
                {initial}
              </div>
              <span className="text-xs font-semibold text-[#334155] truncate max-w-[130px]">
                {authorName}
              </span>
            </div>

            <span className="inline-flex items-center gap-1 text-xs font-extrabold text-[#173B5F] hover:text-[#2D6A4F] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0">
              Read <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
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
        const res = await api.get("/api/site-content/blogs");
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

  const featuredPost = visiblePosts.length > 0 ? visiblePosts[0] : null;
  const gridPosts = visiblePosts.length > 0 ? visiblePosts.slice(1) : [];

  return (
    <section
      className="min-h-screen relative pt-28 pb-24 overflow-hidden"
      style={{
        perspective: "1400px",
        background: `
  radial-gradient(circle at 5% 10%, rgba(238, 194, 67, 0.13), transparent 28%),
  radial-gradient(circle at 95% 12%, rgba(72, 169, 213, 0.13), transparent 28%),
  radial-gradient(circle at 50% 100%, rgba(238, 194, 67, 0.08), transparent 32%),
  linear-gradient(180deg, #FFFFFF 0%, #FCFCFA 52%, #F7FAFC 100%)
`,
      }}
    >
      <div className="pointer-events-none absolute -top-16 -left-20 h-64 w-64 rounded-full bg-[#63C7E8]/15 blur-3xl" />
      <div className="pointer-events-none absolute top-24 -right-24 h-72 w-72 rounded-full bg-[#F2C14E]/18 blur-3xl" />
      <div className="pointer-events-none absolute bottom-16 left-1/3 h-48 w-48 rounded-full bg-[#F28C6B]/10 blur-3xl" />
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 relative z-10">
        {/* Header / Hero Section matching Gallery styling */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          {/* Top Badge */}
          <div className="mb-4">
            <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest bg-white/85 text-[#123A63] border border-[#F2C14E]/45 shadow-[0_8px_25px_rgba(18,58,99,0.08)] backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#E9C46A]" />
              {content.pageBadge || "Knowledge Hub"}
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#123A63] tracking-tight leading-[1.04] drop-shadow-[0_3px_0_rgba(242,193,78,0.16)]">
            {content.pageTitle || "School Blog & Insights"}
          </h1>

          {/* Subtitle */}
          <p className="mt-4 text-base sm:text-lg text-[#667085] max-w-3xl leading-relaxed">
            {content.pageDescription ||
              "Explore school activities, academic excellence, student achievements, competitions, and important educational updates."}
          </p>

          {/* Search Bar & Category Filter Pills */}
          <div className="mt-8 flex flex-col gap-6">
            {/* Search Input Box */}
            <div className="relative max-w-md w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9AA7B5] pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles..."
                className="w-full rounded-xl border border-[#DCE8F2] bg-white/90 backdrop-blur-md py-3.5 shadow-[0_10px_30px_rgba(18,58,99,0.07)] pl-11 pr-10 text-sm text-[#111827] placeholder-[#9AA7B5] outline-none shadow-xs focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 transition-all"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9AA7B5] hover:text-[#173B5F] text-xs font-bold bg-slate-100 rounded-full w-5 h-5 flex items-center justify-center cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Filter Pills Row (matching gallery tabs) */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              {(content.categories || ["All"]).map((cat) => {
                const isActive = category === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`relative rounded-xl px-5 py-2.5 text-xs sm:text-sm font-extrabold transition-all duration-200 cursor-pointer ${isActive
                      ? "bg-gradient-to-r from-[#123A63] via-[#2387C9] to-[#63C7E8] text-white shadow-[0_10px_28px_rgba(35,135,201,0.30)] border border-transparent"
                      : "bg-white text-[#263244] border border-[#E7EBEF] hover:border-[#2D6A4F]/30 hover:text-[#173B5F] hover:shadow-xs"
                      }`}
                  >
                    {cat}
                    {isActive && (
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#E9C46A]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Featured Post Card */}
        {featuredPost && <FeaturedPostCard post={featuredPost} />}

        {/* Blog Cards Grid */}
        {gridPosts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gridPosts.map((post, index) => (
              <BlogCard key={post.id || post.slug} post={post} index={index} />
            ))}
          </div>
        )}

        {/* Empty State when no posts match */}
        {visiblePosts.length === 0 && (
          <div className="rounded-[30px] bg-white/90 backdrop-blur-xl p-12 text-center shadow-[0_20px_55px_rgba(18,58,99,0.10)] border border-white max-w-lg mx-auto my-12">
            <div className="w-14 h-14 rounded-2xl bg-[#F6F8FA] text-[#9AA7B5] flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-7 w-7 text-[#9AA7B5]" />
            </div>
            <h2 className="text-xl font-black text-[#173B5F]">No articles found</h2>
            <p className="mt-2 text-sm text-[#667085]">
              {query
                ? `No articles match "${query}". Try searching with different keywords.`
                : "School news and blog posts will appear here once published."}
            </p>
            {query && (
              <button
                onClick={() => setQuery("")}
                className="mt-5 rounded-full bg-gradient-to-r from-[#173B5F] to-[#2D6A4F] px-6 py-2.5 text-xs font-extrabold text-white hover:opacity-95 transition-opacity shadow-md"
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