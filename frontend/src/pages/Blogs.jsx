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
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: 0.45,
        delay: Math.min(index * 0.05, 0.2),
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -7 }}
      className={`blog-card-3d group ${featured ? "is-featured" : ""}`}
    >
      <Link to={`/blogs/${post.slug}`} className="flex h-full flex-col">
        <div className="blog-card-image">
          <BlogImage
            post={post}
            className="h-full w-full object-cover group-hover:scale-[1.07]"
          />

          <div className="blog-card-image-overlay" />

          <div className="absolute left-4 top-4 z-10 flex items-center gap-2">
            {featured && (
              <span className="blog-featured-pill">
                <Sparkles className="h-3 w-3" />
                Featured
              </span>
            )}

            <span className="blog-card-category">
              <Tag className="h-3 w-3" />
              {post.category || "School Life"}
            </span>
          </div>

          <span className="blog-card-open">
            <ArrowUpRight className="h-4 w-4" />
          </span>

          <div className="blog-card-number">
            {String(index + 1).padStart(2, "0")}
          </div>
        </div>

        <div className="blog-card-content">
          <div className="blog-card-meta">
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatBlogDate(post.date)}
            </span>

            <span className="blog-dot">•</span>

            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {readTime}
            </span>
          </div>

          <h3 className="blog-card-title">
            {post.title}
          </h3>

          <p className="blog-card-excerpt">
            {getPlainExcerpt(post)}
          </p>

          <div className="blog-card-footer">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="blog-small-avatar">{initial}</div>

              <span className="truncate text-xs font-bold text-slate-700">
                {authorName}
              </span>
            </div>

            <span className="blog-explore">
              Explore
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

  const visiblePosts = useMemo(() => {
    const searchText = query.trim().toLowerCase();

    return (content.posts || [])
      .filter((post) => post.visible !== false)
      .sort((a, b) => {
        if (a.pinned !== b.pinned) {
          return a.pinned ? -1 : 1;
        }

        return String(b.date || "").localeCompare(
          String(a.date || "")
        );
      })
      .filter(
        (post) =>
          category === "All" ||
          post.category === category
      )
      .filter((post) => {
        if (!searchText) return true;

        const haystack = `
          ${post.title}
          ${post.category}
          ${post.excerpt}
          ${post.content}
        `.toLowerCase();

        return haystack.includes(searchText);
      });
  }, [content.posts, category, query]);

  return (
    <>
      <style>{`
        /* =====================================================
           SMRITI SCHOOL BLOG
           Compact + Uniform + Colorful 3D Editorial Cards
        ===================================================== */

        .blog-page {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          background:
            radial-gradient(circle at 8% 10%, rgba(234, 190, 70, .12), transparent 25%),
            radial-gradient(circle at 94% 25%, rgba(36, 160, 210, .10), transparent 28%),
            linear-gradient(180deg, #f8fbff 0%, #ffffff 48%, #f4f8fb 100%);
        }

        .blog-page::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: .28;
          background-image:
            linear-gradient(rgba(15,23,42,.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(15,23,42,.025) 1px, transparent 1px);
          background-size: 46px 46px;
          mask-image: linear-gradient(to bottom, black, transparent 72%);
        }

        .blog-orb {
          position: absolute;
          border-radius: 999px;
          pointer-events: none;
        }

        .blog-orb-one {
          width: 320px;
          height: 320px;
          top: 280px;
          left: -180px;
          background: radial-gradient(circle, rgba(234,190,70,.16), rgba(234,190,70,0));
        }

        .blog-orb-two {
          width: 420px;
          height: 420px;
          right: -220px;
          top: 680px;
          background: radial-gradient(circle, rgba(36,160,210,.12), rgba(36,160,210,0));
        }

        /* ================= HERO ================= */

        .blog-hero {
          position: relative;
          /*
            The site navbar sits above the page content. Keep the
            blog hero safely below it so the eyebrow/title is never
            hidden underneath the navbar.
          */
          padding-top: 104px;
          padding-bottom: 42px;
        }

        .blog-hero-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.45fr) minmax(250px, .55fr);
          gap: 42px;
          align-items: end;
        }

        .blog-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          border-radius: 999px;
          color: #12638b;
          background: rgba(255,255,255,.82);
          border: 1px solid rgba(56,189,248,.25);
          box-shadow: 0 8px 24px rgba(15,23,42,.055);
          backdrop-filter: blur(12px);
          font-size: 10px;
          font-weight: 900;
          letter-spacing: .18em;
          text-transform: uppercase;
        }

        .blog-main-title {
          margin-top: 18px;
          max-width: 850px;
          font-size: clamp(45px, 6vw, 78px);
          line-height: .94;
          letter-spacing: -.065em;
          font-weight: 950;
          color: #0a1628;
        }

        .blog-main-title span {
          display: block;
          color: #c69222;
        }

        .blog-hero-description {
          max-width: 720px;
          margin-top: 20px;
          font-size: 16px;
          line-height: 1.7;
          color: #52647b;
        }

        .blog-hero-note {
          padding: 20px;
          border-radius: 24px;
          background: linear-gradient(145deg, rgba(255,255,255,.92), rgba(242,247,251,.82));
          border: 1px solid rgba(255,255,255,.96);
          box-shadow:
            0 18px 45px rgba(15,23,42,.07),
            inset 0 1px 0 white;
          backdrop-filter: blur(16px);
        }

        .blog-hero-note-line {
          width: 38px;
          height: 4px;
          margin-bottom: 13px;
          border-radius: 99px;
          background: linear-gradient(90deg, #c69222, #f4d36f);
        }

        .blog-hero-note-title {
          color: #0a1628;
          font-size: 18px;
          font-weight: 900;
        }

        .blog-hero-note-text {
          margin-top: 7px;
          color: #64748b;
          font-size: 12px;
          line-height: 1.55;
        }

        .blog-search-row {
          margin-top: 26px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 12px;
        }

        .blog-search {
          position: relative;
          width: min(390px, 100%);
        }

        .blog-search input {
          width: 100%;
          height: 48px;
          border-radius: 15px;
          border: 1px solid rgba(148,163,184,.22);
          background: rgba(255,255,255,.88);
          box-shadow:
            0 10px 26px rgba(15,23,42,.055),
            inset 0 1px 0 white;
          backdrop-filter: blur(12px);
          padding: 0 42px;
          outline: none;
          color: #0f172a;
          font-size: 13px;
          transition: .25s ease;
        }

        .blog-search input:focus {
          border-color: rgba(56,189,248,.55);
          box-shadow:
            0 12px 30px rgba(15,23,42,.08),
            0 0 0 4px rgba(56,189,248,.09);
        }

        .blog-search-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }

        .blog-search-clear {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          width: 25px;
          height: 25px;
          border: 0;
          border-radius: 50%;
          background: #edf2f7;
          color: #64748b;
          cursor: pointer;
          font-size: 12px;
          font-weight: 900;
        }

        .blog-filter-row {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }

        .blog-filter {
          border: 1px solid rgba(148,163,184,.22);
          background: rgba(255,255,255,.78);
          color: #52647b;
          padding: 9px 14px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 800;
          cursor: pointer;
          backdrop-filter: blur(10px);
          transition: .22s ease;
        }

        .blog-filter:hover {
          transform: translateY(-2px);
          background: white;
          color: #0a1628;
          box-shadow: 0 7px 18px rgba(15,23,42,.06);
        }

        .blog-filter.active {
          color: white;
          background: #0a1628;
          border-color: #0a1628;
          box-shadow: 0 8px 20px rgba(10,22,40,.15);
        }

        /* ================= STORIES HEADER ================= */

        .blog-stories-section {
          padding-bottom: 70px;
        }

        .blog-section-heading {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 22px;
        }

        .blog-section-kicker {
          margin-bottom: 5px;
          color: #c69222;
          font-size: 9px;
          font-weight: 950;
          letter-spacing: .22em;
          text-transform: uppercase;
        }

        .blog-section-title {
          color: #0a1628;
          font-size: 28px;
          line-height: 1;
          font-weight: 950;
          letter-spacing: -.04em;
        }

        .blog-story-count {
          border-radius: 999px;
          padding: 8px 13px;
          background: white;
          border: 1px solid #e4eaf0;
          color: #64748b;
          font-size: 10px;
          font-weight: 800;
          box-shadow: 0 6px 16px rgba(15,23,42,.045);
        }

        /* ================= UNIFORM GRID ================= */

        .blog-uniform-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 20px;
          align-items: stretch;
        }

        /*
          IMPORTANT:
          Every card has the same height.
          This removes the large/masonry look from the old page.
        */

        .blog-card-3d {
          --card-accent: #c69222;
          position: relative;
          min-width: 0;
          height: 470px;
          overflow: hidden;
          border-radius: 24px;
          background: white;
          border: 1px solid rgba(226,232,240,.92);
          border-top: 4px solid var(--card-accent);
          box-shadow:
            0 14px 32px rgba(15,23,42,.065),
            0 2px 7px rgba(15,23,42,.025),
            inset 0 1px 0 rgba(255,255,255,1);
          transform-style: preserve-3d;
          transition:
            transform .32s ease,
            box-shadow .32s ease,
            border-color .32s ease;
        }

        /* Different accent colors create visual variety
           without changing card dimensions. */

        .blog-card-3d:nth-child(3n + 1) {
          --card-accent: #d4a72c;
        }

        .blog-card-3d:nth-child(3n + 2) {
          --card-accent: #2584a9;
        }

        .blog-card-3d:nth-child(3n + 3) {
          --card-accent: #3d8c63;
        }

        /* =====================================================
           MAIN FEATURED STORY
           One full-width editorial card. Smaller posts stay
           compact 3-column cards underneath.
        ===================================================== */

        .blog-card-3d.is-featured {
          grid-column: 1 / -1;
          height: 430px;
          --card-accent: #d4a72c;

          background:
            linear-gradient(135deg, #fffdf6 0%, #ffffff 52%, #f7fbff 100%);

          border: 1px solid rgba(212,167,44,.38);
          border-top: 4px solid #d4a72c;

          box-shadow:
            0 24px 55px rgba(15,23,42,.09),
            0 10px 25px rgba(212,167,44,.10),
            inset 0 1px 0 rgba(255,255,255,1);

          transform-style: preserve-3d;
        }

        .blog-card-3d.is-featured > a {
          display: grid !important;
          grid-template-columns: minmax(0, 1.08fr) minmax(0, .92fr);
          height: 100%;
        }

        .blog-card-3d.is-featured .blog-card-image {
          height: 100%;
          min-height: 0;
          border-radius: 0;
        }

        .blog-card-3d.is-featured .blog-card-content {
          min-width: 0;
          justify-content: center;
          padding: 34px 42px;
        }

        .blog-card-3d.is-featured .blog-card-title {
          max-width: 620px;
          margin-top: 14px;
          font-size: clamp(26px, 3vw, 43px);
          line-height: 1.02;
          letter-spacing: -.045em;
        }

        .blog-card-3d.is-featured .blog-card-excerpt {
          max-width: 570px;
          margin-top: 14px;
          font-size: 13px;
          line-height: 1.65;
          -webkit-line-clamp: 4;
        }

        .blog-card-3d.is-featured .blog-card-footer {
          margin-top: 26px;
        }

        .blog-card-3d.is-featured .blog-card-image img {
          transform: scale(1.02);
          transition:
            transform .7s cubic-bezier(.22,1,.36,1),
            filter .4s ease;
        }

        .blog-card-3d.is-featured:hover {
          transform: translateY(-8px);
          border-color: rgba(212,167,44,.62);
          box-shadow:
            0 34px 70px rgba(15,23,42,.12),
            0 14px 35px rgba(212,167,44,.16),
            inset 0 1px 0 rgba(255,255,255,1);
        }

        .blog-card-3d.is-featured:hover .blog-card-image img {
          transform: scale(1.07);
        }

        .blog-card-3d.is-featured::before {
          content: "";
          position: absolute;
          z-index: -1;
          inset: 16px -10px -14px;
          border-radius: 32px;
          background:
            radial-gradient(
              circle at 50% 100%,
              rgba(212,167,44,.22),
              transparent 62%
            );
          filter: blur(20px);
          opacity: .65;
          transition: opacity .35s ease;
          pointer-events: none;
        }

        .blog-card-3d.is-featured:hover::before {
          opacity: 1;
        }

        .blog-card-3d.is-featured .blog-featured-pill {
          padding: 8px 12px;
          color: #172033;
          background:
            linear-gradient(135deg, #ffe58a, #d4a72c);
          border: 1px solid rgba(255,255,255,.8);
          box-shadow:
            0 8px 22px rgba(212,167,44,.30),
            inset 0 1px 0 rgba(255,255,255,.7);
          font-size: 8px;
          letter-spacing: .14em;
        }

        .blog-card-3d.is-featured .blog-card-category {
          color: #8a6512;
          background: rgba(255,250,226,.94);
          border-color: rgba(212,167,44,.20);
        }

        .blog-card-3d.is-featured .blog-card-title {
          color: #0a1628;
        }

        .blog-card-3d.is-featured:hover .blog-card-title {
          color: #b47f09;
        }

        .blog-card-3d.is-featured .blog-card-open {
          background:
            linear-gradient(135deg, #f9dc6a, #d4a72c);
          box-shadow:
            0 10px 25px rgba(212,167,44,.30),
            inset 0 1px 0 rgba(255,255,255,.65);
        }

        .blog-card-3d:hover {
          transform:
            translateY(-7px)
            rotateX(1deg)
            rotateY(-1deg);
          border-color: color-mix(in srgb, var(--card-accent) 30%, #e2e8f0);
          box-shadow:
            0 26px 52px rgba(15,23,42,.12),
            0 8px 20px color-mix(in srgb, var(--card-accent) 12%, transparent),
            inset 0 1px 0 white;
        }

        .blog-card-3d::after {
          content: "";
          position: absolute;
          width: 150px;
          height: 150px;
          right: -85px;
          bottom: -85px;
          border-radius: 50%;
          background: color-mix(in srgb, var(--card-accent) 9%, transparent);
          pointer-events: none;
          transition: .35s ease;
        }

        .blog-card-3d:hover::after {
          transform: scale(1.35);
        }

        .blog-card-image {
          position: relative;
          height: 190px;
          overflow: hidden;
          background: #e8eef3;
        }

        .blog-card-image img {
          transform: scale(1.015);
        }

        .blog-card-image-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(180deg, rgba(10,22,40,.05), transparent 52%),
            linear-gradient(0deg, rgba(10,22,40,.28), transparent 42%);
          pointer-events: none;
        }

        .blog-card-category {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          border-radius: 999px;
          padding: 6px 9px;
          color: #173d62;
          background: rgba(255,255,255,.92);
          border: 1px solid rgba(255,255,255,.85);
          box-shadow: 0 6px 16px rgba(15,23,42,.10);
          backdrop-filter: blur(10px);
          font-size: 8px;
          font-weight: 950;
          letter-spacing: .11em;
          text-transform: uppercase;
        }

        .blog-featured-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          border-radius: 999px;
          padding: 6px 9px;
          color: #132238;
          background: #f7d56d;
          box-shadow: 0 7px 18px rgba(0,0,0,.13);
          font-size: 8px;
          font-weight: 950;
          letter-spacing: .1em;
          text-transform: uppercase;
        }

        .blog-card-open {
          position: absolute;
          right: 14px;
          bottom: 14px;
          z-index: 3;
          display: grid;
          place-items: center;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          color: #0a1628;
          background: var(--card-accent);
          box-shadow:
            0 9px 22px rgba(0,0,0,.17),
            inset 0 1px 0 rgba(255,255,255,.45);
          transition: .25s ease;
        }

        .blog-card-3d:hover .blog-card-open {
          transform: translate(2px,-2px) rotate(5deg) scale(1.05);
        }

        .blog-card-number {
          position: absolute;
          left: 15px;
          bottom: 11px;
          z-index: 2;
          color: rgba(255,255,255,.88);
          font-size: 29px;
          font-weight: 950;
          line-height: .8;
          letter-spacing: -.06em;
          text-shadow: 0 4px 15px rgba(0,0,0,.22);
        }

        .blog-card-content {
          display: flex;
          flex: 1;
          min-height: 0;
          flex-direction: column;
          padding: 18px 19px 17px;
          background:
            radial-gradient(circle at 100% 0%, color-mix(in srgb, var(--card-accent) 7%, transparent), transparent 42%),
            #ffffff;
        }

        .blog-card-meta {
          display: flex;
          align-items: center;
          gap: 7px;
          min-height: 16px;
          color: #8a98a8;
          font-size: 9px;
          font-weight: 700;
        }

        .blog-dot {
          color: #cbd5e1;
        }

        .blog-card-title {
          margin-top: 9px;
          display: -webkit-box;
          overflow: hidden;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          color: #0a1628;
          font-size: 18px;
          line-height: 1.12;
          letter-spacing: -.025em;
          font-weight: 950;
          transition: color .22s ease;
        }

        .blog-card-3d:hover .blog-card-title {
          color: var(--card-accent);
        }

        .blog-card-excerpt {
          margin-top: 9px;
          display: -webkit-box;
          overflow: hidden;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
          color: #64748b;
          font-size: 11px;
          line-height: 1.55;
        }

        .blog-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-top: auto;
          padding-top: 13px;
          border-top: 1px solid #edf1f4;
        }

        .blog-small-avatar {
          display: grid;
          flex-shrink: 0;
          place-items: center;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          color: white;
          background: linear-gradient(145deg, #214b70, #0a1628);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.18),
            0 5px 12px rgba(10,22,40,.13);
          font-size: 9px;
          font-weight: 900;
        }

        .blog-explore {
          display: inline-flex;
          flex-shrink: 0;
          align-items: center;
          gap: 4px;
          color: var(--card-accent);
          font-size: 10px;
          font-weight: 950;
          transition: .22s ease;
        }

        .blog-card-3d:hover .blog-explore {
          transform: translateX(2px);
        }

        /* ================= EMPTY ================= */

        .blog-empty {
          margin: 25px auto 70px;
          max-width: 500px;
          border-radius: 25px;
          padding: 45px 25px;
          text-align: center;
          background: rgba(255,255,255,.9);
          border: 1px solid #e2e8f0;
          box-shadow: 0 20px 45px rgba(15,23,42,.07);
        }

        /* ================= RESPONSIVE ================= */

        @media (max-width: 1100px) {
          .blog-uniform-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .blog-card-3d.is-featured {
            grid-column: 1 / -1;
          }

          .blog-hero-grid {
            grid-template-columns: 1fr;
          }

          .blog-hero-note {
            max-width: 520px;
          }
        }

        @media (max-width: 680px) {
          .blog-hero {
            padding-top: 84px;
            padding-bottom: 32px;
          }

          .blog-main-title {
            font-size: clamp(43px, 14vw, 64px);
          }

          .blog-hero-description {
            font-size: 14px;
          }

          .blog-uniform-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .blog-card-3d {
            height: 455px;
          }

          .blog-card-3d.is-featured {
            grid-column: auto;
            height: 455px;
          }

          .blog-card-3d.is-featured > a {
            display: flex !important;
            flex-direction: column;
          }

          .blog-card-3d.is-featured .blog-card-image {
            height: 205px;
            flex: 0 0 205px;
          }

          .blog-card-3d.is-featured .blog-card-content {
            padding: 18px 19px 17px;
          }

          .blog-card-3d.is-featured .blog-card-title {
            font-size: 23px;
          }

          .blog-card-3d.is-featured .blog-card-excerpt {
            font-size: 11px;
            line-height: 1.55;
            -webkit-line-clamp: 3;
          }

          .blog-card-image {
            height: 190px;
          }

          .blog-section-heading {
            align-items: flex-start;
            flex-direction: column;
            margin-bottom: 17px;
          }

          .blog-story-count {
            display: none;
          }

          .blog-search {
            width: 100%;
          }

          .blog-filter-row {
            width: 100%;
          }
        }
      `}</style>

      <section className="blog-page">
        <div className="blog-orb blog-orb-one" />
        <div className="blog-orb blog-orb-two" />

        <div className="relative z-10 mx-auto max-w-[1320px] px-5 sm:px-8">
          {/* ================= HERO ================= */}

          <motion.header
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="blog-hero"
          >
            <div className="blog-hero-grid">
              <div>
                <div className="blog-eyebrow">
                  <Sparkles className="h-3.5 w-3.5" />
                  {content.pageBadge || "Knowledge Hub"}
                </div>

                <h1 className="blog-main-title">
                  {content.pageTitle || "School Blog"}
                  <span>& Insights.</span>
                </h1>

                <p className="blog-hero-description">
                  {content.pageDescription ||
                    "Explore school activities, academic excellence, student achievements, competitions, and important educational updates."}
                </p>
              </div>

              <div className="blog-hero-note">
                <div className="blog-hero-note-line" />

                <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.18em] text-slate-400">
                  <BookOpen className="h-3.5 w-3.5 text-[#C69222]" />
                  From the school desk
                </div>

                <h2 className="blog-hero-note-title">
                  Stories that stay with us.
                </h2>

                <p className="blog-hero-note-text">
                  Discover the people, moments and ideas shaping
                  our school community.
                </p>
              </div>
            </div>

            <div className="blog-search-row">
              <div className="blog-search">
                <Search className="blog-search-icon h-4 w-4" />

                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search stories, events, achievements..."
                  aria-label="Search blog articles"
                />

                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="blog-search-clear"
                    aria-label="Clear search"
                  >
                    ×
                  </button>
                )}
              </div>

              <div className="blog-filter-row">
                {(content.categories || ["All"]).map((cat) => {
                  const isActive = category === cat;

                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`blog-filter ${
                        isActive ? "active" : ""
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.header>

          {/* ================= ALL STORIES ================= */}

          {visiblePosts.length > 0 && (
            <section className="blog-stories-section">
              <div className="blog-section-heading">
                <div>
                  <p className="blog-section-kicker">
                    School journal
                  </p>

                  <h2 className="blog-section-title">
                    Latest stories.
                  </h2>
                </div>

                <div className="blog-story-count">
                  {visiblePosts.length}{" "}
                  {visiblePosts.length === 1 ? "story" : "stories"}
                </div>
              </div>

              <div className="blog-uniform-grid">
                {visiblePosts.map((post, index) => (
                  <BlogCard
                    key={post.id || post.slug}
                    post={post}
                    index={index}
                    featured={index === 0}
                  />
                ))}
              </div>
            </section>
          )}

          {/* ================= EMPTY STATE ================= */}

          {visiblePosts.length === 0 && (
            <div className="blog-empty">
              <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-400">
                <Calendar className="h-6 w-6" />
              </div>

              <h2 className="text-2xl font-black text-[#0A1628]">
                No stories found
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {query
                  ? `No articles match "${query}". Try different keywords.`
                  : "School news and blog posts will appear here once published."}
              </p>

              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="mt-5 rounded-full bg-[#0A1628] px-5 py-2.5 text-xs font-black text-white transition hover:-translate-y-0.5 hover:bg-[#173d62]"
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