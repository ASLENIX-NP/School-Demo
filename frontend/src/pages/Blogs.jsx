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
  BookOpen,
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
        className={`h-full w-full object-cover transition-transform duration-700 ${className}`}
      />
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-300">
      <ImageIcon className="h-10 w-10" />
    </div>
  );
}

/* =========================================================
   COMPACT 3D BLOG CARD
   Every post uses the same dimensions.
========================================================= */

function BlogCard({ post, index, featured = false }) {
  const { authorName, initial } = getAuthorInfo(post);
  const readTime = getReadTime(post.content, post.excerpt);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: 0.5,
        delay: Math.min(index * 0.05, 0.18),
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -5 }}
      className={`rr-blog-card ${featured ? "rr-blog-card-featured" : ""}`}
    >
      <Link to={`/blogs/${post.slug}`} className="rr-blog-card-link">
        <div className="rr-blog-card-image">
          <BlogImage post={post} className="group-hover:scale-[1.05]" />

          <div className="rr-blog-card-image-shade" />

          <div className="rr-blog-card-top">
            {featured && (
              <span className="rr-blog-featured">
                <Sparkles className="h-3 w-3" />
                Featured story
              </span>
            )}

            <span className="rr-blog-category">
              <Tag className="h-3 w-3" />
              {post.category || "School Life"}
            </span>
          </div>

          <div className="rr-blog-card-index">
            {String(index + 1).padStart(2, "0")}
          </div>

          <span className="rr-blog-open">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>

        <div className="rr-blog-card-body">
          <div className="rr-blog-meta">
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatBlogDate(post.date)}
            </span>
            <span className="rr-blog-meta-line" />
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {readTime}
            </span>
          </div>

          <h3 className="rr-blog-card-title">{post.title}</h3>

          <p className="rr-blog-card-excerpt">
            {getPlainExcerpt(post)}
          </p>

          <div className="rr-blog-card-footer">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="rr-blog-avatar">{initial}</div>
              <span className="truncate text-xs font-bold text-[#4D3C43]">
                {authorName}
              </span>
            </div>

            <span className="rr-blog-read">
              Read story
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

export default function Blogs() {
  const [content, setContent] = useState(() =>
    mergeBlogContent(defaultBlogContent)
  );

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  // =========================================================
  // 1. FETCH DATA (Moved outside of JSX)
  // =========================================================
  useEffect(() => {
    let alive = true;

    const loadBlogs = async () => {
      try {
        const res = await api.get("/api/site-content/blogs");

        if (!alive) return;

        setContent(
          mergeBlogContent(res.data?.data?.content || {})
        );
      } catch (error) {
        console.error("Blog content load error:", error);

        if (alive) {
          setContent(mergeBlogContent(defaultBlogContent));
        }
      }
    };

    loadBlogs();

    return () => {
      alive = false;
    };
  }, []);

  // =========================================================
  // 2. FILTER POSTS (Use useMemo for performance)
  // =========================================================
  const visiblePosts = useMemo(() => {
    const allPosts = content.posts || [];
    
    return allPosts.filter((post) => {
      const matchQuery = !query || 
        post.title?.toLowerCase().includes(query.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(query.toLowerCase()) ||
        post.content?.toLowerCase().includes(query.toLowerCase());
      
      const matchCategory = category === "All" || post.category === category;

      return matchQuery && matchCategory;
    });
  }, [content.posts, query, category]);

  // =========================================================
  // 3. JSX RENDERING (Return this OUTSIDE the useEffect)
  // =========================================================
  return (
    <>
      <style>{`
        /* =========================================================
           RED ROSE SCHOOL — BLOG
           Editorial / About-page visual system
        ========================================================= */

        .rr-blog-page {
          --rr-cream: #f4ecdf;
          --rr-paper: #fbf7ef;
          --rr-paper-white: #fffdf8;
          --rr-ink: #261520;
          --rr-burgundy: #2b1423;
          --rr-burgundy-2: #40172a;
          --rr-maroon: #a52b4a;
          --rr-gold: #c9963d;
          --rr-gold-light: #e8cf96;
          --rr-muted: #756a70;
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          padding: 44px 0 90px;
          background: var(--rr-cream);
          color: var(--rr-ink);
        }

        .rr-blog-page::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            radial-gradient(circle at 8% 22%, rgba(201,150,61,.11), transparent 28%),
            radial-gradient(circle at 94% 62%, rgba(165,43,74,.07), transparent 30%);
        }

        .rr-blog-wrap {
          position: relative;
          z-index: 2;
          width: min(1280px, calc(100% - 48px));
          margin: 0 auto;
        }

        /* HERO — same light-red visual system as About */
        .rr-blog-hero {
          position: relative;
          overflow: hidden;
          min-height: 445px;
          padding: 64px 64px 78px;
          border-radius: 0 0 38px 38px;
          background:
            radial-gradient(circle at 88% 20%, rgba(165,43,74,.12), transparent 31%),
            radial-gradient(circle at 12% 85%, rgba(201,150,61,.08), transparent 33%),
            linear-gradient(135deg, #FDEDEE 0%, #FBD9DC 56%, #F6C3C8 100%);
          box-shadow: 0 28px 70px rgba(165,43,74,.14);
          color: var(--rr-ink);
        }

        .rr-blog-hero::before {
          content: "";
          position: absolute;
          inset: 0;
          opacity: .20;
          pointer-events: none;
          background-image: radial-gradient(rgba(165,43,74,.13) .75px, transparent .75px);
          background-size: 22px 22px;
          mask-image: linear-gradient(to bottom, black 10%, transparent 95%);
        }

        .rr-blog-hero::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: -1px;
          height: 26px;
          background: var(--rr-cream);
          clip-path: polygon(
            0 40%, 2% 100%, 5% 40%, 8% 100%, 11% 40%, 14% 100%,
            17% 40%, 20% 100%, 23% 40%, 26% 100%, 29% 40%, 32% 100%,
            35% 40%, 38% 100%, 41% 40%, 44% 100%, 47% 40%, 50% 100%,
            53% 40%, 56% 100%, 59% 40%, 62% 100%, 65% 40%, 68% 100%,
            71% 40%, 74% 100%, 77% 40%, 80% 100%, 83% 40%, 86% 100%,
            89% 40%, 92% 100%, 95% 40%, 98% 100%, 100% 40%, 100% 100%, 0 100%
          );
        }

        .rr-blog-hero-grid {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: minmax(0, 1.35fr) minmax(250px, .65fr);
          gap: 48px;
          align-items: center;
        }

        .rr-blog-kicker {
          display: inline-flex;
          align-items: center;
          gap: 11px;
          color: var(--rr-maroon);
          font-size: 11px;
          font-weight: 900;
          letter-spacing: .22em;
          text-transform: uppercase;
        }

        .rr-blog-kicker::before {
          content: "";
          width: 38px;
          height: 1px;
          background: var(--rr-maroon);
        }

        .rr-blog-hero h1 {
          margin: 20px 0 0;
          max-width: 850px;
          font-family: var(--font-display);
          font-size: clamp(50px, 6vw, 82px);
          line-height: .93;
          font-weight: 900;
          letter-spacing: -.06em;
          color: var(--rr-ink);
        }

        .rr-blog-hero h1 span {
          color: var(--rr-maroon);
        }

        .rr-blog-hero-description {
          max-width: 760px;
          margin-top: 24px;
          color: var(--rr-muted);
          font-size: 16px;
          line-height: 1.75;
        }

        .rr-blog-hero-mark {
          position: relative;
          min-height: 230px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .rr-blog-hero-mark::before,
        .rr-blog-hero-mark::after {
          content: "";
          position: absolute;
          border: 1px solid rgba(165,43,74,.18);
          border-radius: 50%;
        }

        .rr-blog-hero-mark::before {
          width: 220px;
          height: 220px;
        }

        .rr-blog-hero-mark::after {
          width: 158px;
          height: 158px;
        }

        .rr-blog-mark-inner {
          position: relative;
          z-index: 2;
          width: 118px;
          height: 118px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(165,43,74,.38);
          border-radius: 50%;
          background: rgba(255,255,255,.24);
          box-shadow: inset 0 0 35px rgba(165,43,74,.06);
          color: var(--rr-maroon);
        }

        .rr-blog-mark-inner::before {
          content: "";
          position: absolute;
          inset: 10px;
          border: 1px dashed rgba(165,43,74,.22);
          border-radius: 50%;
        }

        .rr-blog-mark-inner svg {
          position: relative;
          z-index: 2;
        }

        .rr-blog-mark-caption {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          white-space: nowrap;
          color: rgba(43,20,35,.58);
          font-size: 9px;
          font-weight: 900;
          letter-spacing: .18em;
          text-transform: uppercase;
        }

        /* SEARCH / FILTERS */
        .rr-blog-tools {
          position: relative;
          z-index: 4;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 12px;
          margin-top: -2px;
          padding: 20px 22px;
          border: 1px solid #e7dac8;
          border-radius: 0 0 22px 22px;
          background: rgba(251,247,239,.96);
          box-shadow: 0 15px 35px rgba(69,48,38,.07);
        }

        .rr-blog-search {
          position: relative;
          width: min(390px, 100%);
        }

        .rr-blog-search input {
          width: 100%;
          height: 45px;
          padding: 0 40px 0 42px;
          border: 1px solid #ded2c2;
          border-radius: 999px;
          outline: none;
          background: #fffdf8;
          color: var(--rr-ink);
          font-size: 12px;
          transition: .2s ease;
        }

        .rr-blog-search input:focus {
          border-color: var(--rr-gold);
          box-shadow: 0 0 0 4px rgba(201,150,61,.10);
        }

        .rr-blog-search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #9b8e92;
        }

        .rr-blog-clear {
          position: absolute;
          right: 9px;
          top: 50%;
          transform: translateY(-50%);
          width: 27px;
          height: 27px;
          display: grid;
          place-items: center;
          border: 0;
          border-radius: 50%;
          background: #f0e8dc;
          color: #6f6268;
          cursor: pointer;
          font-weight: 900;
        }

        .rr-blog-filters {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }

        .rr-blog-filter {
          padding: 8px 13px;
          border: 1px solid #ded2c2;
          border-radius: 999px;
          background: #fffdf8;
          color: #756a70;
          font-size: 10px;
          font-weight: 900;
          cursor: pointer;
          transition: .2s ease;
        }

        .rr-blog-filter:hover {
          transform: translateY(-1px);
          border-color: var(--rr-gold);
          color: var(--rr-maroon);
        }

        .rr-blog-filter.active {
          border-color: var(--rr-burgundy);
          background: var(--rr-burgundy);
          color: #fff;
        }

        /* INTRO */
        .rr-blog-section-heading {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 20px;
          padding: 78px 0 30px;
        }

        .rr-blog-section-kicker {
          display: flex;
          align-items: center;
          gap: 12px;
          color: var(--rr-maroon);
          font-size: 10px;
          font-weight: 900;
          letter-spacing: .22em;
          text-transform: uppercase;
        }

        .rr-blog-section-kicker::before {
          content: "";
          width: 34px;
          height: 1px;
          background: var(--rr-gold);
        }

        .rr-blog-section-heading h2 {
          margin-top: 11px;
          font-family: var(--font-display);
          color: var(--rr-ink);
          font-size: clamp(38px, 4vw, 55px);
          line-height: 1;
          font-weight: 900;
          letter-spacing: -.05em;
        }

        .rr-blog-section-heading h2 span {
          color: var(--rr-maroon);
        }

        .rr-blog-section-heading p {
          max-width: 680px;
          margin-top: 12px;
          color: var(--rr-muted);
          font-size: 15px;
          line-height: 1.7;
        }

        .rr-blog-count {
          flex-shrink: 0;
          padding: 9px 14px;
          border: 1px solid #e1d5c4;
          border-radius: 999px;
          background: #fffaf3;
          color: #806f76;
          font-size: 10px;
          font-weight: 900;
        }

        /* FEATURED STORY */
        .rr-blog-feature {
          position: relative;
          overflow: hidden;
          display: grid;
          grid-template-columns: minmax(0, 1.08fr) minmax(0, .92fr);
          min-height: 410px;
          border: 1px solid #e3d5c2;
          border-radius: 28px;
          background: var(--rr-paper-white);
          box-shadow: 0 24px 55px rgba(69,48,38,.10);
        }

        .rr-blog-feature::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: -1px;
          height: 17px;
          background: var(--rr-cream);
          clip-path: polygon(
            0 35%, 3% 100%, 6% 35%, 9% 100%, 12% 35%, 15% 100%,
            18% 35%, 21% 100%, 24% 35%, 27% 100%, 30% 35%, 33% 100%,
            36% 35%, 39% 100%, 42% 35%, 45% 100%, 48% 35%, 51% 100%,
            54% 35%, 57% 100%, 60% 35%, 63% 100%, 66% 35%, 69% 100%,
            72% 35%, 75% 100%, 78% 35%, 81% 100%, 84% 35%, 87% 100%,
            90% 35%, 93% 100%, 96% 35%, 100% 100%, 100% 100%, 0 100%
          );
        }

        .rr-blog-feature-image {
          min-height: 410px;
          position: relative;
          overflow: hidden;
        }

        .rr-blog-feature-image img {
          transition: transform .7s cubic-bezier(.22,1,.36,1);
        }

        .rr-blog-feature:hover .rr-blog-feature-image img {
          transform: scale(1.045);
        }

        .rr-blog-feature-shade {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, rgba(24,11,21,.06), rgba(24,11,21,.35));
        }

        .rr-blog-feature-number {
          position: absolute;
          left: 24px;
          bottom: 28px;
          color: rgba(255,255,255,.9);
          font-family: var(--font-display);
          font-size: 54px;
          line-height: .8;
          font-weight: 900;
          letter-spacing: -.06em;
          text-shadow: 0 7px 24px rgba(0,0,0,.28);
        }

        .rr-blog-feature-content {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 42px;
        }

        .rr-blog-feature-label {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          width: fit-content;
          padding: 7px 11px;
          border-radius: 999px;
          background: #fff3d5;
          border: 1px solid #ead29c;
          color: #80601d;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: .13em;
          text-transform: uppercase;
        }

        .rr-blog-feature-content h3 {
          margin-top: 15px;
          color: var(--rr-ink);
          font-family: var(--font-display);
          font-size: clamp(28px, 3vw, 43px);
          line-height: 1.03;
          font-weight: 900;
          letter-spacing: -.045em;
        }

        .rr-blog-feature-content p {
          max-width: 580px;
          margin-top: 13px;
          color: var(--rr-muted);
          font-size: 13px;
          line-height: 1.7;
        }

        .rr-blog-feature-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 19px;
          color: #88797f;
          font-size: 10px;
          font-weight: 800;
        }

        .rr-blog-feature-author {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-top: 24px;
          padding-top: 17px;
          border-top: 1px solid #e9dece;
        }

        .rr-blog-feature-author-avatar,
        .rr-blog-avatar {
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: linear-gradient(145deg, #a52b4a, #2b1423);
          color: #fff;
          font-weight: 900;
          box-shadow: 0 7px 16px rgba(43,20,35,.16);
        }

        .rr-blog-feature-author-avatar {
          width: 31px;
          height: 31px;
          font-size: 9px;
        }

        .rr-blog-feature-read {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          margin-left: auto;
          color: var(--rr-maroon);
          font-size: 11px;
          font-weight: 900;
        }

        /* SMALL STORY GRID */
        .rr-blog-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 20px;
          margin-top: 24px;
        }

        .rr-blog-card {
          min-width: 0;
          height: 445px;
          overflow: hidden;
          border: 1px solid #e5d9c8;
          border-radius: 23px;
          background: var(--rr-paper-white);
          box-shadow: 0 16px 35px rgba(69,48,38,.075);
          transition: .3s ease;
        }

        .rr-blog-card:hover {
          border-color: #d2bd98;
          box-shadow: 0 25px 48px rgba(69,48,38,.12);
        }

        .rr-blog-card-link {
          display: flex;
          height: 100%;
          flex-direction: column;
        }

        .rr-blog-card-image {
          position: relative;
          height: 205px;
          flex: 0 0 205px;
          overflow: hidden;
          background: #e7ddd0;
        }

        .rr-blog-card-image img {
          transition: transform .7s cubic-bezier(.22,1,.36,1);
        }

        .rr-blog-card-image-shade {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(180deg, rgba(43,20,35,.04), transparent 50%),
            linear-gradient(0deg, rgba(43,20,35,.30), transparent 50%);
          pointer-events: none;
        }

        .rr-blog-card-top {
          position: absolute;
          z-index: 2;
          left: 14px;
          right: 14px;
          top: 14px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 7px;
        }

        .rr-blog-category,
        .rr-blog-featured {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 6px 9px;
          border-radius: 999px;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: .10em;
          text-transform: uppercase;
          box-shadow: 0 6px 16px rgba(0,0,0,.10);
        }

        .rr-blog-category {
          color: #553b45;
          border: 1px solid rgba(255,255,255,.72);
          background: rgba(255,251,245,.93);
        }

        .rr-blog-featured {
          color: #fffaf0;
          border: 1px solid rgba(255,255,255,.16);
          background: var(--rr-maroon);
        }

        .rr-blog-card-index {
          position: absolute;
          left: 15px;
          bottom: 13px;
          color: rgba(255,255,255,.9);
          font-family: var(--font-display);
          font-size: 29px;
          line-height: .8;
          font-weight: 900;
          text-shadow: 0 5px 18px rgba(0,0,0,.28);
        }

        .rr-blog-open {
          position: absolute;
          right: 14px;
          bottom: 13px;
          width: 37px;
          height: 37px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          color: #fff;
          background: var(--rr-maroon);
          box-shadow: 0 8px 19px rgba(43,20,35,.24);
          transition: .25s ease;
        }

        .rr-blog-card:hover .rr-blog-open {
          transform: translate(2px,-2px);
          background: var(--rr-gold);
          color: var(--rr-ink);
        }

        .rr-blog-card-body {
          display: flex;
          min-height: 0;
          flex: 1;
          flex-direction: column;
          padding: 18px 19px 17px;
          background:
            radial-gradient(circle at 100% 0%, rgba(201,150,61,.06), transparent 40%),
            #fffdf8;
        }

        .rr-blog-meta {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #93868b;
          font-size: 9px;
          font-weight: 800;
        }

        .rr-blog-meta-line {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: #c7b9bc;
        }

        .rr-blog-card-title {
          display: -webkit-box;
          overflow: hidden;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          margin-top: 9px;
          color: var(--rr-ink);
          font-family: var(--font-display);
          font-size: 20px;
          line-height: 1.08;
          font-weight: 900;
          letter-spacing: -.03em;
          transition: color .2s ease;
        }

        .rr-blog-card:hover .rr-blog-card-title {
          color: var(--rr-maroon);
        }

        .rr-blog-card-excerpt {
          display: -webkit-box;
          overflow: hidden;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
          margin-top: 9px;
          color: var(--rr-muted);
          font-size: 11px;
          line-height: 1.58;
        }

        .rr-blog-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-top: auto;
          padding-top: 13px;
          border-top: 1px solid #eadfcf;
        }

        .rr-blog-avatar {
          width: 28px;
          height: 28px;
          flex: 0 0 auto;
          font-size: 9px;
        }

        .rr-blog-read {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          flex-shrink: 0;
          color: var(--rr-maroon);
          font-size: 10px;
          font-weight: 900;
          transition: .2s ease;
        }

        .rr-blog-card:hover .rr-blog-read {
          transform: translateX(2px);
        }

        /* EMPTY */
        .rr-blog-empty {
          margin: 25px auto 70px;
          max-width: 540px;
          padding: 46px 28px;
          text-align: center;
          border: 1px solid #e5d9c8;
          border-radius: 24px;
          background: var(--rr-paper-white);
          box-shadow: 0 18px 40px rgba(69,48,38,.08);
        }

        /* RESPONSIVE */
        @media (max-width: 1050px) {
          .rr-blog-hero-grid {
            grid-template-columns: 1fr;
          }

          .rr-blog-hero-mark {
            display: none;
          }

          .rr-blog-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .rr-blog-feature {
            grid-template-columns: 1fr;
          }

          .rr-blog-feature-image {
            min-height: 280px;
          }
        }

        @media (max-width: 700px) {
          .rr-blog-page {
            padding-top: 24px;
          }

          .rr-blog-wrap {
            width: min(100% - 24px, 1280px);
          }

          .rr-blog-hero {
            min-height: 420px;
            padding: 44px 25px 66px;
            border-radius: 0 0 28px 28px;
          }

          .rr-blog-hero h1 {
            font-size: 46px;
          }

          .rr-blog-hero-description {
            font-size: 14px;
          }

          .rr-blog-tools {
            flex-direction: column;
            align-items: stretch;
            border-radius: 0 0 18px 18px;
            padding: 16px;
          }

          .rr-blog-search {
            width: 100%;
          }

          .rr-blog-filters {
            overflow-x: auto;
            flex-wrap: nowrap;
            padding-bottom: 2px;
          }

          .rr-blog-filter {
            flex: 0 0 auto;
          }

          .rr-blog-section-heading {
            padding-top: 55px;
            align-items: flex-start;
            flex-direction: column;
          }

          .rr-blog-section-heading h2 {
            font-size: 38px;
          }

          .rr-blog-count {
            display: none;
          }

          .rr-blog-feature {
            min-height: 0;
            border-radius: 22px;
          }

          .rr-blog-feature-image {
            min-height: 220px;
          }

          .rr-blog-feature-content {
            padding: 25px 21px 30px;
          }

          .rr-blog-feature-content h3 {
            font-size: 29px;
          }

          .rr-blog-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .rr-blog-card {
            height: 435px;
          }
        }
      `}</style>

      <section className="rr-blog-page">
        <div className="rr-blog-wrap">

          {/* =====================================================
              HERO — follows the light About-page visual system, with a journal /
              editorial identity of its own.
          ====================================================== */}
          <motion.header
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="rr-blog-hero"
          >
            <div className="rr-blog-hero-grid">
              <div>
                <div className="rr-blog-kicker">
                  {content.pageBadge || "School Journal"}
                </div>

                <h1>
                  {content.pageTitle || "Stories from"}{" "}
                  <span>Red Rose.</span>
                </h1>

                <p className="rr-blog-hero-description">
                  {content.pageDescription ||
                    "Explore school activities, academic achievements, student voices, competitions, celebrations, and the everyday moments that make our school community special."}
                </p>
              </div>

              <div className="rr-blog-hero-mark" aria-hidden="true">
                <div className="rr-blog-mark-inner">
                  <BookOpen className="h-10 w-10" strokeWidth={1.4} />
                </div>

                <div className="rr-blog-mark-caption">
                  Ideas · People · Moments
                </div>
              </div>
            </div>
          </motion.header>

          {/* SEARCH + CATEGORY BAR */}
          <div className="rr-blog-tools">
            <div className="rr-blog-search">
              <Search className="rr-blog-search-icon h-4 w-4" />

              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search stories, achievements, activities..."
                aria-label="Search blog articles"
              />

              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="rr-blog-clear"
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>

            <div className="rr-blog-filters">
              {(content.categories || ["All"]).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`rr-blog-filter ${
                    category === cat ? "active" : ""
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {visiblePosts.length > 0 && (
            <>
              <div className="rr-blog-section-heading">
                <div>
                  <div className="rr-blog-section-kicker">
                    From our school journal
                  </div>

                  <h2>
                    The latest <span>stories.</span>
                  </h2>

                  <p>
                    A collection of the people, achievements, activities,
                    ideas, and moments shaping life at Red Rose.
                  </p>
                </div>

                <div className="rr-blog-count">
                  {visiblePosts.length}{" "}
                  {visiblePosts.length === 1 ? "story" : "stories"}
                </div>
              </div>

              {/* =================================================
                  FEATURED STORY
                  First post gets a distinctive editorial layout.
              ================================================== */}
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.12 }}
                transition={{ duration: 0.5 }}
                className="rr-blog-feature"
              >
                {(() => {
                  const post = visiblePosts[0];
                  const { authorName, initial } = getAuthorInfo(post);
                  const readTime = getReadTime(
                    post.content,
                    post.excerpt
                  );

                  return (
                    <>
                      <Link
                        to={`/blogs/${post.slug}`}
                        className="rr-blog-feature-image"
                      >
                        <BlogImage post={post} />

                        <div className="rr-blog-feature-shade" />

                        <div className="absolute left-5 top-5 z-10">
                          <span className="rr-blog-feature-label">
                            <Sparkles className="h-3 w-3" />
                            Featured story
                          </span>
                        </div>

                        <div className="rr-blog-feature-number">
                          01
                        </div>
                      </Link>

                      <div className="rr-blog-feature-content">
                        <div className="rr-blog-feature-label">
                          <Tag className="h-3 w-3" />
                          {post.category || "School Life"}
                        </div>

                        <h3>{post.title}</h3>

                        <p>{getPlainExcerpt(post)}</p>

                        <div className="rr-blog-feature-meta">
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatBlogDate(post.date)}
                          </span>

                          <span>·</span>

                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {readTime}
                          </span>
                        </div>

                        <div className="rr-blog-feature-author">
                          <div className="rr-blog-feature-author-avatar">
                            {initial}
                          </div>

                          <div className="min-w-0">
                            <div className="text-[9px] font-black uppercase tracking-[0.13em] text-[#9A898F]">
                              Written by
                            </div>
                            <div className="truncate text-xs font-black text-[#2B1423]">
                              {authorName}
                            </div>
                          </div>

                          <span className="rr-blog-feature-read">
                            Read story
                            <ArrowRight className="h-3.5 w-3.5" />
                          </span>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </motion.article>

              {/* =================================================
                  REMAINING STORIES — compact, uniform cards.
              ================================================== */}
              {visiblePosts.length > 1 && (
                <div className="rr-blog-grid">
                  {visiblePosts.slice(1).map((post, index) => (
                    <BlogCard
                      key={post.id || post.slug}
                      post={post}
                      index={index + 1}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {visiblePosts.length === 0 && (
            <div className="rr-blog-empty">
              <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full bg-[#f3e8d8] text-[#A52B4A]">
                <Calendar className="h-6 w-6" />
              </div>

              <h2 className="font-display text-2xl font-black text-[#2B1423]">
                No stories found
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#756A70]">
                {query
                  ? `No articles match "${query}". Try different keywords.`
                  : "School news and blog posts will appear here once published."}
              </p>

              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="mt-5 rounded-full bg-[#2B1423] px-5 py-2.5 text-xs font-black text-white transition hover:-translate-y-0.5 hover:bg-[#A52B4A]"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}