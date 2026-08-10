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

function RelatedCard({ post, index = 0 }) {
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
    ? posts
        .filter((item) => item.id !== post.id && item.category === post.category)
        .slice(0, 4)
    : [];

  if (!post) {
    return (
      <section className="min-h-screen pt-36 pb-24 bg-[#F7F9FC] flex items-center justify-center">
        <div className="mx-auto max-w-xl px-6 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-lg border border-slate-200">
            <Sparkles className="h-7 w-7 text-[#D5A72A]" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-[#0B1B33]">
            Blog post not found
          </h1>
          <p className="mt-3 text-slate-500">
            The article you are looking for might have been moved or updated.
          </p>
          <Link
            to="/blogs"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#0B1B33] px-6 py-3 text-sm font-extrabold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#15345A]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
        </div>
      </section>
    );
  }

  const paragraphs = splitContent(post.content || post.excerpt);
  const { authorName, initial } = getAuthorInfo(post);
  const readTime = getReadTime(post.content, post.excerpt);

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#F7F9FC] pb-24 pt-28 text-[#0B1B33]">
      {/* Soft editorial background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-24 h-96 w-96 rounded-full bg-[#E9C46A]/20 blur-3xl" />
        <div className="absolute -right-40 top-[38%] h-[34rem] w-[34rem] rounded-full bg-[#2A6F97]/10 blur-3xl" />
        <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full border border-[#D5A72A]/10" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1180px] px-5 sm:px-8">
        {/* Minimal navigation */}
        <div className="mb-7 flex items-center justify-between">
          <Link
            to="/blogs"
            className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/85 px-4 py-2.5 text-xs font-black uppercase tracking-[0.12em] text-[#0B1B33] shadow-sm backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-[#D5A72A]/50 hover:shadow-md"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            All stories
          </Link>

          <div className="hidden items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-[#D5A72A]" />
            Smriti School Journal
          </div>
        </div>

        {/* Distinctive split hero */}
        <motion.article
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="relative overflow-hidden rounded-[34px] border border-white/80 bg-white shadow-[0_30px_90px_rgba(11,27,51,0.12)]"
        >
          <div className="grid lg:grid-cols-[0.92fr_1.08fr]">
            {/* Story information */}
            <div className="relative flex min-h-[560px] flex-col justify-between overflow-hidden bg-[#0B1B33] p-7 text-white sm:p-10 lg:p-12">
              <div className="pointer-events-none absolute -right-28 -top-28 h-72 w-72 rounded-full border border-white/10" />
              <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-[#D5A72A]/10 blur-2xl" />

              <div className="relative z-10">
                <div className="mb-8 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#E9C46A]/30 bg-[#E9C46A]/10 px-3.5 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-[#F7D66A]">
                    <Tag className="h-3.5 w-3.5" />
                    {post.category}
                  </span>

                  <span className="rounded-full border border-white/10 bg-white/5 px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-300">
                    {readTime}
                  </span>
                </div>

                <p className="mb-5 text-[10px] font-black uppercase tracking-[0.28em] text-[#F7D66A]">
                  School journal · {formatBlogDate(post.date)}
                </p>

                <h1 className="max-w-3xl text-4xl font-black leading-[0.98] tracking-[-0.045em] sm:text-5xl lg:text-[4.2rem]">
                  {post.title}
                </h1>

                {post.excerpt && (
                  <p className="mt-7 max-w-xl border-l-2 border-[#D5A72A] pl-4 text-sm leading-7 text-slate-300 sm:text-base">
                    {post.excerpt}
                  </p>
                )}
              </div>

              <div className="relative z-10 mt-12 flex items-center gap-3 border-t border-white/10 pt-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F3C74F] text-sm font-black text-[#0B1B33] shadow-lg">
                  {initial}
                </div>
                <div>
                  <p className="text-sm font-extrabold text-white">{authorName}</p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {post.authorRole || "Red Rose School"}
                  </p>
                </div>
              </div>
            </div>

            {/* Image panel */}
            <div className="relative min-h-[380px] overflow-hidden bg-slate-200 lg:min-h-[560px]">
              {post.imageUrl ? (
                <BlogImage
                  post={post}
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.025]"
                />
              ) : (
                <div className="flex h-full min-h-[380px] items-center justify-center bg-slate-100">
                  <ImageIcon className="h-16 w-16 text-slate-300" />
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-[#071426]/35 via-transparent to-white/5" />

              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
                <span className="rounded-full border border-white/30 bg-[#0B1B33]/55 px-3.5 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-white backdrop-blur-md">
                  Featured story
                </span>

                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white backdrop-blur-md">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </div>
        </motion.article>

        {/* Reading area */}
        <div className="mx-auto mt-10 grid max-w-[1040px] gap-10 lg:grid-cols-[minmax(0,1fr)_220px]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="rounded-[28px] border border-slate-200/80 bg-white p-7 shadow-[0_18px_55px_rgba(11,27,51,0.06)] sm:p-10 lg:p-12"
          >
            <div className="mb-9 flex items-center gap-3">
              <span className="h-8 w-1 rounded-full bg-[#D5A72A]" />
              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">
                The story
              </span>
            </div>

            <div className="blog-detail-content space-y-7 text-[17px] leading-[1.95] text-[#334155] sm:text-[18px]">
              {paragraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className={index === 0 ? "first-paragraph" : ""}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </motion.div>

          {/* Small sticky article info rail */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[24px] border border-slate-200 bg-white/85 p-5 shadow-sm backdrop-blur-xl">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D5A72A]">
                Article info
              </p>

              <div className="mt-5 space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-[#2A6F97]" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Published</p>
                    <p className="mt-1 text-xs font-extrabold text-[#0B1B33]">{formatBlogDate(post.date)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[#2A6F97]" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Reading time</p>
                    <p className="mt-1 text-xs font-extrabold text-[#0B1B33]">{readTime}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 h-px bg-slate-100" />

              <Link
                to="/blogs"
                className="mt-5 inline-flex items-center gap-2 text-xs font-black text-[#0B1B33] transition hover:text-[#2A6F97]"
              >
                Explore more stories
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </aside>
        </div>

        {/* Previous / Next */}
        {(previousPost || nextPost) && (
          <div className="mx-auto mt-10 grid max-w-[1040px] grid-cols-1 gap-4 sm:grid-cols-2">
            {previousPost ? (
              <Link
                to={`/blogs/${previousPost.slug}`}
                className="group rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F5F7FA] text-[#0B1B33] transition group-hover:bg-[#0B1B33] group-hover:text-white">
                    <ArrowLeft className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-400">
                      Previous
                    </p>
                    <p className="mt-1 truncate text-sm font-extrabold text-[#0B1B33] group-hover:text-[#2A6F97]">
                      {previousPost.title}
                    </p>
                  </div>
                </div>
              </Link>
            ) : (
              <div />
            )}

            {nextPost && (
              <Link
                to={`/blogs/${nextPost.slug}`}
                className="group rounded-[22px] border border-slate-200 bg-[#0B1B33] p-5 text-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-center justify-end gap-3 text-right">
                  <div className="min-w-0">
                    <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-400">
                      Next
                    </p>
                    <p className="mt-1 truncate text-sm font-extrabold text-white group-hover:text-[#F7D66A]">
                      {nextPost.title}
                    </p>
                  </div>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition group-hover:bg-[#F3C74F] group-hover:text-[#0B1B33]">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            )}
          </div>
        )}

        {/* Related stories */}
        {relatedPosts.length > 0 && (
          <div className="mx-auto mt-16 max-w-[1040px]">
            <div className="mb-7 flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#D5A72A]">
                  Continue reading
                </p>
                <h2 className="mt-1 text-2xl font-black tracking-tight text-[#0B1B33]">
                  More from {post.category}
                </h2>
              </div>

              <Link
                to="/blogs"
                className="hidden items-center gap-1 text-xs font-black text-[#0B1B33] hover:text-[#2A6F97] sm:flex"
              >
                View all
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {relatedPosts.map((rPost, index) => (
                <RelatedCard key={rPost.id || rPost.slug} post={rPost} index={index} />
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .blog-detail-content .first-paragraph::first-letter {
          float: left;
          margin: 0.08em 0.12em 0 0;
          font-size: 4.2rem;
          line-height: 0.8;
          font-weight: 900;
          color: #D5A72A;
        }

        .blog-detail-content p {
          max-width: 760px;
        }
      `}</style>
    </section>
  );
}