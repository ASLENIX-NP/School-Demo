import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../lib/api";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  Clock,
  Image as ImageIcon,
  Sparkles,
  Tag,
} from "lucide-react";
import {
  defaultBlogContent,
  formatBlogDate,
  getAuthorInfo,
  getReadTime,
  mergeBlogContent,
} from "./blogUtils";

const BENCHES_BG_IMAGE = "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1920&q=80";

const API_URL = import.meta.env.VITE_API_URL;

function BlogImage({ post, className = "" }) {
  if (post?.imageUrl) {
    return (
      <img
        src={post.imageUrl}
        alt={post.imageAlt || post.title}
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }

  return (
    <div className="flex h-full min-h-[360px] w-full items-center justify-center bg-slate-100 text-slate-300">
      <ImageIcon className="h-16 w-16" />
    </div>
  );
}

function splitContent(content = "") {
  const text = String(content || "").trim();
  if (!text) return [];
  return text.split(/\n{2,}/).map((part) => part.trim()).filter(Boolean);
}

function RelatedCard({ post }) {
  return (
    <Link
      to={`/blogs/${post.slug}`}
      className="group block rounded-2xl bg-white/85 backdrop-blur-md overflow-hidden shadow-lg border border-slate-200/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:bg-white"
    >
      <div className="h-40 overflow-hidden bg-slate-100 relative">
        <div className="absolute top-3 left-3 z-10">
          <span className="rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-800 shadow-sm border border-slate-200/60">
            {post.category}
          </span>
        </div>
        <BlogImage post={post} className="group-hover:scale-105 transition-transform duration-500" />
      </div>
      <div className="p-5">
        <h3 className="line-clamp-2 text-base font-extrabold text-[#0A1628] group-hover:text-blue-600 transition-colors leading-snug">
          {post.title}
        </h3>
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1 font-medium">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            {formatBlogDate(post.date)}
          </span>
          <span className="flex items-center gap-1 font-extrabold text-[#1E3A5F] group-hover:translate-x-0.5 transition-transform">
            Read <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function BlogDetail() {
  const { slug } = useParams();
  const [content, setContent] = useState(() => mergeBlogContent(defaultBlogContent));

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
        console.error("Blog detail load error:", error);
        if (alive) setContent(mergeBlogContent(defaultBlogContent));
      }
    };

    loadBlogs();

    return () => {
      alive = false;
    };
  }, []);

  const posts = useMemo(
    () => (content.posts || []).filter((post) => post.visible !== false),
    [content.posts]
  );

  const currentIndex = posts.findIndex((post) => post.slug === slug);
  const post = currentIndex >= 0 ? posts[currentIndex] : null;
  const previousPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const nextPost = currentIndex >= 0 && currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;
  const relatedPosts = post
    ? posts.filter((item) => item.id !== post.id && item.category === post.category).slice(0, 4)
    : [];

  if (!post) {
    return (
      <section className="min-h-screen pt-36 pb-24 bg-slate-50 flex items-center justify-center relative overflow-hidden">
        <div className="mx-auto max-w-xl px-6 text-center z-10">
          <h1 className="text-3xl font-extrabold text-[#0A1628]">Blog post not found</h1>
          <p className="mt-3 text-slate-500">The article you are looking for might have been moved or updated.</p>
          <Link
            to="/blogs"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#0A1628] px-6 py-3 text-sm font-bold text-white hover:bg-blue-950 transition-all shadow-lg"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Knowledge Hub
          </Link>
        </div>
      </section>
    );
  }

  const paragraphs = splitContent(post.content || post.excerpt);
  const { authorName, initial } = getAuthorInfo(post);
  const readTime = getReadTime(post.content, post.excerpt);

  return (
    <section className="min-h-screen relative pt-28 pb-24 overflow-hidden bg-slate-100">
      {/* Light Classroom Benches Background Image */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src={BENCHES_BG_IMAGE}
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

      <div className="mx-auto max-w-5xl px-6 relative z-10">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2.5 rounded-full bg-white/90 backdrop-blur-md px-5 py-2.5 text-xs font-black uppercase tracking-wider text-slate-800 border border-slate-200/80 shadow-md transition-all hover:bg-white hover:shadow-lg hover:-translate-y-0.5"
          >
            <ArrowLeft className="h-4 w-4 text-sky-600" /> Back to Knowledge Hub
          </Link>
        </div>

        {/* Highlighted Main Article Glass Card */}
        <motion.article
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-3xl bg-white/90 backdrop-blur-xl border border-white/90 shadow-2xl shadow-slate-900/10"
        >
          {/* Header Section */}
          <div className="p-7 sm:p-10 lg:p-12 border-b border-slate-100/80">
            {/* Category Tag & Meta */}
            <div className="mb-5 flex flex-wrap items-center gap-3 text-xs font-extrabold uppercase tracking-wider">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200/80 px-3.5 py-1 shadow-sm">
                <Tag className="w-3.5 h-3.5 text-sky-600" />
                {post.category}
              </span>
              <span className="text-slate-300">•</span>
              <span className="inline-flex items-center gap-1.5 text-slate-500 font-medium">
                <Calendar className="h-3.5 w-3.5 text-slate-400" /> {formatBlogDate(post.date)}
              </span>
              <span className="text-slate-300">•</span>
              <span className="inline-flex items-center gap-1.5 text-slate-500 font-medium">
                <Clock className="h-3.5 w-3.5 text-slate-400" /> {readTime}
              </span>
            </div>

            {/* Main Article Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0A1628] leading-[1.15] tracking-tight">
              {post.title}
            </h1>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl border-l-3 border-amber-400 pl-4 py-1">
                {post.excerpt}
              </p>
            )}

            {/* Author Info Bar */}
            <div className="mt-8 flex items-center gap-3 pt-6 border-t border-slate-100">
              <div className="w-10 h-10 rounded-full bg-[#1E3A5F] text-white font-extrabold text-sm flex items-center justify-center shadow-md">
                {initial}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800 leading-none">{authorName}</p>
                <p className="text-xs text-slate-500 mt-1">{post.authorRole || "Smriti School"}</p>
              </div>
            </div>
          </div>

          {/* Featured Image Container */}
          {post.imageUrl && (
            <div className="relative h-[280px] sm:h-[400px] lg:h-[460px] w-full overflow-hidden bg-slate-100">
              <BlogImage post={post} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Article Body Content */}
          <div className="p-7 sm:p-10 lg:p-12">
            <div className="space-y-6 text-base sm:text-lg leading-[1.95] text-slate-700">
              {paragraphs.map((paragraph, index) => (
                <p key={index} className="whitespace-pre-line leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </motion.article>

        {/* Previous / Next Article Navigation Bar */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {previousPost ? (
            <Link
              to={`/blogs/${previousPost.slug}`}
              className="group rounded-2xl bg-white/85 backdrop-blur-md border border-slate-200/80 p-5 transition-all hover:bg-white hover:shadow-xl shadow-md"
            >
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1.5 mb-1.5">
                <ArrowLeft className="w-3.5 h-3.5 text-sky-600" /> Previous Article
              </span>
              <p className="text-sm font-bold text-[#0A1628] group-hover:text-blue-600 transition-colors line-clamp-1">
                {previousPost.title}
              </p>
            </Link>
          ) : (
            <div />
          )}

          {nextPost && (
            <Link
              to={`/blogs/${nextPost.slug}`}
              className="group rounded-2xl bg-white/85 backdrop-blur-md border border-slate-200/80 p-5 text-right transition-all hover:bg-white hover:shadow-xl shadow-md sm:col-start-2"
            >
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 flex items-center justify-end gap-1.5 mb-1.5">
                Next Article <ArrowRight className="w-3.5 h-3.5 text-sky-600" />
              </span>
              <p className="text-sm font-bold text-[#0A1628] group-hover:text-blue-600 transition-colors line-clamp-1">
                {nextPost.title}
              </p>
            </Link>
          )}
        </div>

        {/* Related Posts Section */}
        {relatedPosts.length > 0 && (
          <div className="mt-14 pt-10 border-t border-slate-200/80">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h2 className="text-2xl font-extrabold text-[#0A1628] tracking-tight">Related Articles</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedPosts.map((relatedPost) => (
                <RelatedCard key={relatedPost.id} post={relatedPost} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

