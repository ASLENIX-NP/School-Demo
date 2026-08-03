import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, CalendarDays, Image as ImageIcon } from "lucide-react";
import {
  defaultBlogContent,
  formatBlogDate,
  mergeBlogContent,
} from "./Blogs";

const colors = {
  red: "#D71920",
  green: "#168A3A",
  purple: "#4B2E83",
  dark: "#0B1020",
  cream: "#FFF8EE",
  gold: "#FACC15",
  cyan: "#38BDF8",
};

const API_URL =
  import.meta.env.VITE_API_URL || "https://school-website-backend-ixx2.onrender.com";

function BlogImage({ post }) {
  if (post?.imageUrl) {
    return (
      <img
        src={post.imageUrl}
        alt={post.imageAlt || post.title}
        className="h-full w-full object-cover"
      />
    );
  }

  return (
    <div className="flex h-full min-h-[360px] w-full items-center justify-center bg-slate-100">
      <ImageIcon className="h-16 w-16 text-slate-300" />
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
    <Link to={`/blogs/${post.slug}`} className="group block rounded-[24px] bg-white overflow-hidden shadow-lg border border-slate-100 transition-all hover:-translate-y-1">
      <div className="h-40 overflow-hidden bg-slate-100">
        <BlogImage post={post} />
      </div>
      <div className="p-4">
        <h3 className="line-clamp-2 text-lg font-black text-slate-950">{post.title}</h3>
        <p className="mt-2 text-xs font-bold" style={{ color: colors.green }}>
          {post.category} / {formatBlogDate(post.date)}
        </p>
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
      <section className="min-h-screen pt-32 pb-24" style={{ background: "linear-gradient(180deg, #FFF8EE, #F1ECFF)" }}>
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-4xl font-black text-slate-950">Blog post not found</h1>
          <Link to="/blogs" className="mt-6 inline-flex rounded-full px-5 py-3 font-black" style={{ background: `linear-gradient(135deg, ${colors.gold}, ${colors.cyan})`, color: colors.dark }}>
            Back to Blog
          </Link>
        </div>
      </section>
    );
  }

  const paragraphs = splitContent(post.content || post.excerpt);

  return (
    <section
      className="min-h-screen pt-28 pb-24"
      style={{
        background: `
          radial-gradient(circle at top right, rgba(75,46,131,0.13), transparent 34%),
          radial-gradient(circle at bottom left, rgba(22,138,58,0.11), transparent 32%),
          linear-gradient(180deg, #FFF8EE 0%, #F8FAFC 50%, #F1ECFF 100%)
        `,
      }}
    >
      <div className="mx-auto max-w-6xl px-6">
        <Link
          to="/blogs"
          className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-black text-slate-700 shadow-lg border border-slate-100 transition-all hover:-translate-y-0.5"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </Link>

        <motion.article
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="overflow-hidden rounded-[34px] bg-white shadow-2xl border border-slate-100"
        >
          <div className="p-6 md:p-10 lg:p-12">
            <div className="mb-4 flex flex-wrap items-center gap-3 text-sm font-black">
              <span className="rounded-full px-4 py-1.5" style={{ background: "rgba(22,138,58,0.08)", color: colors.green }}>
                {post.category}
              </span>
              <span className="inline-flex items-center gap-2 text-slate-400">
                <CalendarDays className="h-4 w-4" /> {formatBlogDate(post.date)}
              </span>
            </div>

            <h1
              className="max-w-5xl text-4xl md:text-6xl text-slate-950"
              style={{ fontFamily: "var(--font-display)", fontWeight: 900, letterSpacing: "-0.065em", lineHeight: 0.96 }}
            >
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="mt-5 max-w-4xl text-lg leading-relaxed text-slate-500">
                {post.excerpt}
              </p>
            )}
          </div>

          <div className="mx-auto h-[280px] max-w-5xl overflow-hidden rounded-[28px] bg-slate-100 md:h-[440px]">
            <BlogImage post={post} />
          </div>

          <div className="mx-auto max-w-4xl px-6 py-10 md:px-10 md:py-12">
            <div className="space-y-6 text-lg leading-[1.95] text-slate-600">
              {paragraphs.map((paragraph, index) => (
                <p key={index} className="whitespace-pre-line text-justify">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </motion.article>

        <div className="mt-8 flex items-center justify-between gap-4 rounded-[28px] bg-white/75 p-5 shadow-xl border border-slate-100">
          {previousPost ? (
            <Link to={`/blogs/${previousPost.slug}`} className="font-black text-slate-700 hover:text-slate-950">
              ← Previous Post
            </Link>
          ) : (
            <span />
          )}

          {nextPost ? (
            <Link to={`/blogs/${nextPost.slug}`} className="inline-flex items-center gap-2 font-black text-slate-700 hover:text-slate-950">
              Next Post <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <span />
          )}
        </div>

        {relatedPosts.length > 0 && (
          <div className="mt-12 rounded-[30px] bg-white/80 p-6 md:p-8 shadow-xl border border-slate-100">
            <h2 className="mb-6 text-3xl font-black text-slate-950">Related Posts</h2>
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
