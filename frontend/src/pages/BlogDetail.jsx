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
      <ImageIcon className="h-16 w-16 text-[#9AA7B5]" />
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
      className="group block rounded-2xl bg-white/90 backdrop-blur-md overflow-hidden shadow-md border border-[#E9EDF1] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[#2D6A4F]/25 hover:bg-white"
    >
      <div className="h-40 overflow-hidden bg-slate-100 relative">
        <div className="absolute top-3 left-3 z-10">
          <span className="rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#173B5F] shadow-xs border border-[#E9EDF1]">
            {post.category}
          </span>
        </div>
        <BlogImage post={post} className="group-hover:scale-105 transition-transform duration-500" />
      </div>
      <div className="p-5">
        <h3 className="line-clamp-2 text-base font-extrabold text-[#173B5F] group-hover:text-[#2D6A4F] transition-colors leading-snug">
          {post.title}
        </h3>
        <div className="mt-3 flex items-center justify-between text-xs text-[#667085]">
          <span className="flex items-center gap-1 font-medium">
            <Calendar className="w-3.5 h-3.5 text-[#9AA7B5]" />
            {formatBlogDate(post.date)}
          </span>
          <span className="flex items-center gap-1 font-extrabold text-[#173B5F] group-hover:text-[#2D6A4F] group-hover:translate-x-0.5 transition-all">
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
        const res = await api.get("/api/site-content/blogs");
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
      <section className="min-h-screen pt-36 pb-24 bg-[#F6F8FA] flex items-center justify-center relative overflow-hidden">
        <div className="mx-auto max-w-xl px-6 text-center z-10">
          <h1 className="text-3xl font-black text-[#173B5F]">Blog post not found</h1>
          <p className="mt-3 text-[#667085]">The article you are looking for might have been moved or updated.</p>
          <Link
            to="/blogs"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#173B5F] to-[#2D6A4F] px-6 py-3 text-sm font-extrabold text-white hover:opacity-95 transition-all shadow-lg"
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
    <section
      className="min-h-screen relative pt-28 pb-24 overflow-hidden"
      style={{
        background: `
          radial-gradient(circle at 8% 15%, rgba(45, 106, 79, 0.08), transparent 30%),
          radial-gradient(circle at 92% 70%, rgba(233, 196, 106, 0.10), transparent 30%),
          linear-gradient(180deg, #FBFCF9 0%, #F3F8F5 100%)
        `,
      }}
    >
      <div className="mx-auto max-w-5xl px-6 relative z-10">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2.5 rounded-full bg-white/90 backdrop-blur-md px-5 py-2.5 text-xs font-black uppercase tracking-wider text-[#173B5F] border border-[#E9EDF1] shadow-xs transition-all hover:bg-white hover:text-[#2D6A4F] hover:shadow-md hover:-translate-y-0.5"
          >
            <ArrowLeft className="h-4 w-4 text-[#2D6A4F]" /> Back to Knowledge Hub
          </Link>
        </div>

        {/* Highlighted Main Article Glass Card */}
        <motion.article
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-3xl bg-white border border-[#E9EDF1] shadow-2xl shadow-[#0F172A]/5"
        >
          {/* Header Section */}
          <div className="p-7 sm:p-10 lg:p-12 border-b border-[#E9EDF1]">
            {/* Category Tag & Meta */}
            <div className="mb-5 flex flex-wrap items-center gap-3 text-xs font-extrabold uppercase tracking-wider">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#2D6A4F]/10 text-[#2D6A4F] border border-[#2D6A4F]/20 px-3.5 py-1 shadow-xs">
                <Tag className="w-3.5 h-3.5 text-[#2D6A4F]" />
                {post.category}
              </span>
              <span className="text-[#DCE3E9]">•</span>
              <span className="inline-flex items-center gap-1.5 text-[#667085] font-medium">
                <Calendar className="h-3.5 h-3.5 text-[#9AA7B5]" /> {formatBlogDate(post.date)}
              </span>
              <span className="text-[#DCE3E9]">•</span>
              <span className="inline-flex items-center gap-1.5 text-[#667085] font-medium">
                <Clock className="h-3.5 w-3.5 text-[#9AA7B5]" /> {readTime}
              </span>
            </div>

            {/* Main Article Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#173B5F] leading-[1.15] tracking-tight">
              {post.title}
            </h1>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="mt-5 text-base sm:text-lg text-[#475467] leading-relaxed max-w-3xl border-l-4 border-[#E9C46A] bg-[#FFF9ED]/60 rounded-r-xl pl-4 py-2">
                {post.excerpt}
              </p>
            )}

            {/* Author Info Bar */}
            <div className="mt-8 flex items-center gap-3 pt-6 border-t border-[#E9EDF1]">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#173B5F] to-[#2D6A4F] text-white font-extrabold text-sm flex items-center justify-center shadow-md">
                {initial}
              </div>
              <div>
                <p className="text-sm font-bold text-[#111827] leading-none">{authorName}</p>
                <p className="text-xs text-[#667085] mt-1">{post.authorRole || "Red Rose School"}</p>
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
            <div className="space-y-6 text-base sm:text-lg leading-[1.95] text-[#263244]">
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
              className="flex items-center gap-3 p-5 rounded-2xl bg-white border border-[#E9EDF1] shadow-md hover:shadow-lg hover:border-[#2D6A4F]/30 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#F6F8FA] group-hover:bg-[#2D6A4F]/10 text-[#173B5F] group-hover:text-[#2D6A4F] flex items-center justify-center shrink-0 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#667085]">Previous Article</span>
                <p className="text-sm font-bold text-[#173B5F] group-hover:text-[#2D6A4F] truncate mt-0.5">{previousPost.title}</p>
              </div>
            </Link>
          ) : <div />}

          {nextPost && (
            <Link
              to={`/blogs/${nextPost.slug}`}
              className="flex items-center justify-end text-right gap-3 p-5 rounded-2xl bg-white border border-[#E9EDF1] shadow-md hover:shadow-lg hover:border-[#2D6A4F]/30 transition-all group sm:col-start-2"
            >
              <div className="min-w-0">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#667085]">Next Article</span>
                <p className="text-sm font-bold text-[#173B5F] group-hover:text-[#2D6A4F] truncate mt-0.5">{nextPost.title}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#F6F8FA] group-hover:bg-[#2D6A4F]/10 text-[#173B5F] group-hover:text-[#2D6A4F] flex items-center justify-center shrink-0 transition-colors">
                <ArrowRight className="w-5 h-5" />
              </div>
            </Link>
          )}
        </div>

        {/* Related Posts Section */}
        {relatedPosts.length > 0 && (
          <div className="mt-16">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#2D6A4F]">More Stories</span>
                <h2 className="text-2xl font-black text-[#173B5F] mt-1">Related Articles</h2>
              </div>
              <Link to="/blogs" className="text-xs font-extrabold text-[#173B5F] hover:text-[#2D6A4F] inline-flex items-center gap-1">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedPosts.map((rPost) => (
                <RelatedCard key={rPost.id || rPost.slug} post={rPost} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
