import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../lib/api";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  Clock3,
  Image as ImageIcon,
  Tag,
  BookOpen,
  Sparkles,
} from "lucide-react";

import {
  defaultBlogContent,
  formatBlogDate,
  getAuthorInfo,
  getReadTime,
  mergeBlogContent,
} from "./blogUtils";

/*
|--------------------------------------------------------------------------
| RED ROSE SCHOOL — BLOG DETAIL
|--------------------------------------------------------------------------
| Complete replacement for BlogDetail.jsx
|
| IMPORTANT CHANGE IN THIS VERSION:
| A clearly visible "← Back to Blog" button is placed ABOVE the
| article hero. It always links directly to /blogs.
|
| The button is intentionally large and high-contrast so it cannot
| disappear into the burgundy hero background.
|--------------------------------------------------------------------------
*/

function BlogImage({ post, className = "" }) {
  if (post?.imageUrl) {
    return (
      <img
        src={post.imageUrl}
        alt={post.imageAlt || post.title || "School blog"}
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }

  return (
    <div className="rr-blog-no-image">
      <ImageIcon size={52} />
    </div>
  );
}

function splitContent(content = "") {
  const text = String(content || "").trim();

  if (!text) return [];

  return text
    .split(/\n{2,}/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function SectionLabel({ children, light = false }) {
  return (
    <div
      className={`rr-blog-label ${light ? "rr-blog-label-light" : ""}`}
    >
      <span />
      {children}
    </div>
  );
}

function RelatedCard({ post }) {
  return (
    <Link
      to={`/blogs/${post.slug}`}
      className="rr-related-card"
    >
      <div className="rr-related-image">
        <BlogImage
          post={post}
          className="rr-related-image-img"
        />

        <span className="rr-related-category">
          {post.category || "School Life"}
        </span>

        <span className="rr-related-open">
          <ArrowUpRight size={15} />
        </span>
      </div>

      <div className="rr-related-body">
        <div className="rr-related-date">
          <Calendar size={13} />
          {formatBlogDate(post.date)}
        </div>

        <h3>{post.title}</h3>

        <span className="rr-related-read">
          Read story
          <ArrowRight size={13} />
        </span>
      </div>
    </Link>
  );
}

export default function BlogDetail() {
  const { slug } = useParams();

  const [content, setContent] = useState(() =>
    mergeBlogContent(defaultBlogContent)
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    async function loadBlogs() {
      try {
        const response = await api.get(
          "/api/site-content/blogs"
        );

        if (!alive) return;

        setContent(
          mergeBlogContent(
            response.data?.data?.content || {}
          )
        );
      } catch (error) {
        console.error(
          "Blog detail load error:",
          error
        );

        if (alive) {
          setContent(
            mergeBlogContent(defaultBlogContent)
          );
        }
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    }

    loadBlogs();

    return () => {
      alive = false;
    };
  }, []);

  const posts = useMemo(
    () =>
      (content.posts || []).filter(
        (post) => post.visible !== false
      ),
    [content.posts]
  );

  const currentIndex = posts.findIndex(
    (post) => post.slug === slug
  );

  const post =
    currentIndex >= 0
      ? posts[currentIndex]
      : null;

  const previousPost =
    currentIndex > 0
      ? posts[currentIndex - 1]
      : null;

  const nextPost =
    currentIndex >= 0 &&
    currentIndex < posts.length - 1
      ? posts[currentIndex + 1]
      : null;

  const relatedPosts = post
    ? posts
        .filter(
          (item) =>
            item.id !== post.id &&
            item.category === post.category
        )
        .slice(0, 4)
    : [];

  /* ----------------------------------------------------------
     LOADING
  ---------------------------------------------------------- */

  if (loading) {
    return (
      <main className="rr-blog-loading">
        <div className="rr-blog-spinner" />
        <p>Loading story...</p>

        <style>{`
          .rr-blog-loading {
            min-height: 70vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 12px;
            background: #f7eee2;
            color: #70666a;
            font-family: Inter, system-ui, sans-serif;
          }

          .rr-blog-spinner {
            width: 38px;
            height: 38px;
            border: 3px solid #e3d7c8;
            border-top-color: #b98a42;
            border-radius: 50%;
            animation: rr-blog-spin .8s linear infinite;
          }

          @keyframes rr-blog-spin {
            to {
              transform: rotate(360deg);
            }
          }

          .rr-blog-loading p {
            margin: 0;
            font-size: 11px;
            font-weight: 800;
          }
        `}</style>
      </main>
    );
  }

  /* ----------------------------------------------------------
     NOT FOUND
  ---------------------------------------------------------- */

  if (!post) {
    return (
      <main className="rr-blog-not-found">
        <div className="rr-blog-not-found-card">
          <div className="rr-blog-not-found-icon">
            <BookOpen size={25} />
          </div>

          <SectionLabel>
            School Journal
          </SectionLabel>

          <h1>Story not found</h1>

          <p>
            The article you are looking for may
            have been moved, unpublished, or
            updated.
          </p>

          <Link to="/blogs">
            <ArrowLeft size={16} />
            Back to Blog
          </Link>
        </div>

        <style>{`
          .rr-blog-not-found {
            min-height: 80vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 70px 18px;
            background: #f7eee2;
            color: #241a21;
          }

          .rr-blog-not-found-card {
            width: min(500px, 100%);
            padding: 42px 30px;
            text-align: center;
            border: 1px solid #e5d7c7;
            border-radius: 24px;
            background: #fffaf1;
            box-shadow: 0 20px 55px rgba(50,25,32,.09);
          }

          .rr-blog-not-found-icon {
            width: 55px;
            height: 55px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 18px;
            border-radius: 15px;
            color: #b98a42;
            background: #f1e4c9;
          }

          .rr-blog-not-found-card h1 {
            margin: 13px 0 8px;
            font-family: Georgia, "Times New Roman", serif;
            font-size: 35px;
          }

          .rr-blog-not-found-card p {
            margin: 0;
            color: #70666a;
            font-size: 12px;
            line-height: 1.75;
          }

          .rr-blog-not-found-card > a {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            margin-top: 23px;
            padding: 12px 17px;
            border-radius: 10px;
            color: white;
            background: #4a1830;
            text-decoration: none;
            font-size: 9px;
            font-weight: 900;
            transition: .2s ease;
          }

          .rr-blog-not-found-card > a:hover {
            transform: translateY(-2px);
            background: #6e1733;
          }
        `}</style>
      </main>
    );
  }

  const paragraphs = splitContent(
    post.content || post.excerpt
  );

  const { authorName, initial } =
    getAuthorInfo(post);

  const readTime = getReadTime(
    post.content,
    post.excerpt
  );

  return (
    <main className="rr-blog-detail">
      <style>{`
        /* =========================================================
           RED ROSE BLOG DETAIL — COMPLETE STYLES
        ========================================================= */

        .rr-blog-detail {
          --rr-burgundy: #4a1830;
          --rr-burgundy-dark: #24121f;
          --rr-rose: #a3294c;
          --rr-gold: #c89a36;
          --rr-gold-light: #e5c66f;
          --rr-cream: #f7eee2;
          --rr-paper: #fffaf1;
          --rr-ink: #241a21;
          --rr-muted: #70666a;
          --rr-line: #e5d7c7;

          min-height: 100vh;
          overflow-x: hidden;
          color: var(--rr-ink);
          background: var(--rr-cream);
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        .rr-blog-detail *,
        .rr-blog-detail *::before,
        .rr-blog-detail *::after {
          box-sizing: border-box;
        }

        .rr-blog-shell {
          width: min(1140px, calc(100% - 32px));
          margin: 0 auto;
        }

        /* =========================================================
           HERO
        ========================================================= */

        .rr-blog-hero {
          position: relative;
          overflow: hidden;
          padding: 28px 0 0;
          background:
            radial-gradient(
              circle at 8% 22%,
              rgba(201,150,61,.08),
              transparent 24%
            ),
            radial-gradient(
              circle at 92% 72%,
              rgba(165,43,74,.10),
              transparent 28%
            ),
            linear-gradient(
              135deg,
              #FDEDEE 0%,
              #FBD9DC 56%,
              #F6C3C8 100%
            );
        }

        .rr-blog-pattern {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: .16;
          background-image:
            radial-gradient(
              circle,
              rgba(165,43,74,.20) 1px,
              transparent 1.2px
            );
          background-size: 19px 19px;
        }

        .rr-blog-orbit {
          position: absolute;
          pointer-events: none;
          border: 1px solid rgba(165,43,74,.14);
          border-radius: 50%;
        }

        .rr-blog-orbit-one {
          width: 500px;
          height: 500px;
          left: -300px;
          top: -230px;
        }

        .rr-blog-orbit-two {
          width: 430px;
          height: 430px;
          right: -240px;
          bottom: -300px;
        }

        /*
         * ==========================================================
         * THE IMPORTANT BACK BUTTON
         * ==========================================================
         * This is deliberately NOT hidden.
         * It is placed above the article and has a gold border,
         * cream text and enough padding to remain clearly visible.
         */

        .rr-blog-back-button {
          position: fixed;
          z-index: 1000;

          /*
           * The button is intentionally fixed so users can return to
           * the Blog page from ANY scroll position. It no longer
           * disappears above the article when the user scrolls down.
           *
           * 105px keeps it below the main school navbar.
           */
          top: 105px;
          left: max(
            24px,
            calc((100vw - 1140px) / 2)
          );

          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;

          margin: 0;
          padding: 11px 17px;

          border: 1px solid rgba(165,43,74,.34);
          border-radius: 999px;

          color: #6E1733;
          background: rgba(255,253,248,.90);

          box-shadow:
            0 8px 22px rgba(165,43,74,.12),
            inset 0 1px 0 rgba(255,255,255,.82);

          text-decoration: none;

          font-size: 9px;
          font-weight: 900;
          letter-spacing: .14em;
          text-transform: uppercase;

          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);

          transition:
            transform .22s ease,
            background .22s ease,
            border-color .22s ease,
            color .22s ease,
            box-shadow .22s ease;
        }

        .rr-blog-back-button svg {
          flex: 0 0 auto;
          transition: transform .22s ease;
        }

        .rr-blog-back-button:hover {
          transform: translateY(-2px);
          border-color: #A52B4A;
          color: #4A1830;
          background: rgba(255,253,248,.94);
          box-shadow:
            0 12px 28px rgba(165,43,74,.14),
            0 0 0 3px rgba(165,43,74,.07);
        }

        .rr-blog-back-button:hover svg {
          transform: translateX(-3px);
        }

        .rr-blog-hero-card {
          position: relative;
          z-index: 5;

          display: grid;
          grid-template-columns:
            minmax(0, .90fr)
            minmax(0, 1.10fr);

          min-height: 555px;
          overflow: hidden;

          border-radius: 28px 28px 0 0;

          background: var(--rr-paper);

          box-shadow:
            0 28px 75px rgba(165,43,74,.16);
        }

        .rr-blog-hero-copy {
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          min-width: 0;
          padding: 44px 42px 37px;

          color: var(--rr-ink);

          background:
            radial-gradient(
              circle at 85% 8%,
              rgba(201,150,61,.08),
              transparent 25%
            ),
            linear-gradient(
              145deg,
              #FDEDEE 0%,
              #FBD9DC 58%,
              #F6C3C8 100%
            );
        }

        .rr-blog-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 26px;
        }

        .rr-blog-category-pill,
        .rr-blog-read-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;

          padding: 8px 10px;

          border-radius: 999px;

          font-size: 8px;
          font-weight: 900;
          letter-spacing: .10em;
          text-transform: uppercase;
        }

        .rr-blog-category-pill {
          color: #6E1733;
          border: 1px solid rgba(165,43,74,.28);
          background: rgba(255,253,248,.45);
        }

        .rr-blog-read-pill {
          color: #6F6268;
          border: 1px solid rgba(43,20,35,.12);
          background: rgba(255,253,248,.42);
        }

        .rr-blog-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;

          color: var(--rr-rose);

          font-size: 8px;
          font-weight: 900;
          letter-spacing: .22em;
          text-transform: uppercase;
        }

        .rr-blog-label > span {
          width: 28px;
          height: 1px;
          flex: 0 0 auto;
          background: var(--rr-gold);
        }

        .rr-blog-label-light {
          color: #6E1733;
        }

        .rr-blog-hero-copy h1 {
          max-width: 590px;
          margin: 14px 0 0;

          color: var(--rr-ink);

          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-size: clamp(42px, 5vw, 68px);
          font-weight: 700;
          line-height: .96;
          letter-spacing: -.045em;
        }

        .rr-blog-excerpt {
          max-width: 550px;

          margin: 22px 0 0;
          padding-left: 15px;

          border-left: 2px solid var(--rr-gold);

          color: #5F555A;

          font-size: 12px;
          line-height: 1.8;
        }

        .rr-blog-author {
          display: flex;
          align-items: center;
          gap: 11px;

          margin-top: 35px;
          padding-top: 20px;

          border-top: 1px solid rgba(43,20,35,.12);
        }

        .rr-blog-author-avatar {
          width: 43px;
          height: 43px;

          display: flex;
          align-items: center;
          justify-content: center;

          flex: 0 0 auto;

          border: 2px solid #A52B4A;
          border-radius: 50%;

          color: #fff;
          background: #A52B4A;

          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-size: 13px;
          font-weight: 900;
        }

        .rr-blog-author span,
        .rr-blog-author strong,
        .rr-blog-author small {
          display: block;
        }

        .rr-blog-author span {
          margin-bottom: 3px;
          color: #806F76;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: .13em;
          text-transform: uppercase;
        }

        .rr-blog-author strong {
          color: var(--rr-ink);
          font-size: 11px;
        }

        .rr-blog-author small {
          margin-top: 2px;
          color: #806F76;
          font-size: 8px;
        }

        .rr-blog-hero-image {
          position: relative;
          min-height: 555px;
          overflow: hidden;
          background: #e9ded0;
        }

        .rr-blog-main-image {
          transition: transform .7s ease;
        }

        .rr-blog-hero-card:hover
          .rr-blog-main-image {
          transform: scale(1.018);
        }

        .rr-blog-image-shade {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            linear-gradient(
              180deg,
              rgba(36,18,31,.01),
              rgba(36,18,31,.20)
            );
        }

        .rr-blog-featured {
          position: absolute;
          left: 21px;
          bottom: 21px;

          padding: 8px 11px;

          border: 1px solid rgba(255,255,255,.55);
          border-radius: 999px;

          color: #fff;
          background: rgba(74,24,48,.72);

          font-size: 8px;
          font-weight: 900;
          letter-spacing: .15em;
          text-transform: uppercase;

          backdrop-filter: blur(8px);
        }

        .rr-blog-image-arrow {
          position: absolute;
          right: 21px;
          bottom: 21px;

          width: 40px;
          height: 40px;

          display: flex;
          align-items: center;
          justify-content: center;

          border: 1px solid rgba(255,255,255,.32);
          border-radius: 50%;

          color: white;
          background: rgba(36,18,31,.44);

          backdrop-filter: blur(8px);
        }

        .rr-blog-no-image {
          width: 100%;
          height: 100%;
          min-height: 360px;

          display: flex;
          align-items: center;
          justify-content: center;

          color: #b6a99c;

          background:
            radial-gradient(
              circle,
              #eee1d2 1px,
              transparent 1.2px
            );
          background-size: 18px 18px;
        }

        /* =========================================================
           ZIG ZAG
        ========================================================= */

        .rr-blog-zigzag {
          position: relative;
          z-index: 10;

          height: 34px;
          margin-top: -1px;
          overflow: hidden;
        }

        .rr-blog-zigzag-inner {
          width: 100%;
          height: 100%;

          background: var(--rr-cream);

          clip-path:
            polygon(
              0 38%,
              4% 100%,
              8% 38%,
              12% 100%,
              16% 38%,
              20% 100%,
              24% 38%,
              28% 100%,
              32% 38%,
              36% 100%,
              40% 38%,
              44% 100%,
              48% 38%,
              52% 100%,
              56% 38%,
              60% 100%,
              64% 38%,
              68% 100%,
              72% 38%,
              76% 100%,
              80% 38%,
              84% 100%,
              88% 38%,
              92% 100%,
              96% 38%,
              100% 100%,
              100% 100%,
              0 100%
            );
        }

        /* =========================================================
           STORY
        ========================================================= */

        .rr-blog-story-section {
          padding: 70px 0 80px;

          background:
            radial-gradient(
              circle at 7% 15%,
              rgba(200,154,54,.07),
              transparent 23%
            ),
            var(--rr-cream);
        }

        .rr-blog-story-grid {
          display: grid;
          grid-template-columns:
            minmax(0, 1fr)
            235px;

          gap: 30px;
          align-items: start;
        }

        .rr-blog-story-card {
          overflow: hidden;

          border: 1px solid var(--rr-line);
          border-radius: 23px;

          background:
            linear-gradient(
              135deg,
              rgba(255,250,241,.96),
              rgba(255,247,237,.88)
            );

          box-shadow:
            0 17px 46px rgba(57,33,39,.06);
        }

        .rr-blog-story-heading {
          padding: 30px 35px 0;
        }

        .rr-blog-story-rule {
          width: 44px;
          height: 3px;

          margin-top: 12px;

          border-radius: 99px;

          background:
            linear-gradient(
              90deg,
              var(--rr-rose),
              var(--rr-gold)
            );
        }

        .rr-blog-story-content {
          padding: 27px 35px 34px;
        }

        .rr-blog-story-content p {
          max-width: 790px;

          margin: 0 0 23px;

          color: #51484c;

          font-size: 15px;
          line-height: 1.95;
        }

        .rr-blog-story-content p:last-child {
          margin-bottom: 0;
        }

        .rr-blog-story-content
          .rr-blog-lead::first-letter {
          float: left;

          margin:
            .08em .12em 0 0;

          color: var(--rr-rose);

          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-size: 4.2rem;
          line-height: .78;
          font-weight: 700;
        }

        .rr-blog-story-footer {
          display: grid;
          grid-template-columns:
            repeat(3, 1fr);

          border-top: 1px solid var(--rr-line);
          background: #f5eadc;
        }

        .rr-blog-story-footer-item {
          padding: 16px 20px;
          border-right: 1px solid var(--rr-line);
        }

        .rr-blog-story-footer-item:last-child {
          border-right: 0;
        }

        .rr-blog-story-footer-item span,
        .rr-blog-story-footer-item strong {
          display: block;
        }

        .rr-blog-story-footer-item span {
          margin-bottom: 4px;

          color: #9a8e88;

          font-size: 7px;
          font-weight: 900;
          letter-spacing: .13em;
          text-transform: uppercase;
        }

        .rr-blog-story-footer-item strong {
          color: var(--rr-ink);
          font-size: 9px;
        }

        /* =========================================================
           ARTICLE INFO
        ========================================================= */

        .rr-blog-info {
          position: sticky;
          top: 105px;
        }

        .rr-blog-info-card {
          padding: 22px 19px;

          border: 1px solid var(--rr-line);
          border-radius: 18px;

          background: rgba(255,250,241,.9);

          box-shadow:
            0 10px 30px rgba(57,33,39,.05);
        }

        .rr-blog-info-item {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          margin-top: 20px;
        }

        .rr-blog-info-icon {
          width: 33px;
          height: 33px;

          display: flex;
          align-items: center;
          justify-content: center;

          flex: 0 0 auto;

          border-radius: 10px;

          color: var(--rr-rose);
          background: #f1dce1;
        }

        .rr-blog-info-text small,
        .rr-blog-info-text strong {
          display: block;
        }

        .rr-blog-info-text small {
          margin-bottom: 3px;

          color: #9a8e88;

          font-size: 7px;
          font-weight: 900;
          letter-spacing: .12em;
          text-transform: uppercase;
        }

        .rr-blog-info-text strong {
          color: var(--rr-ink);
          font-size: 9px;
        }

        .rr-blog-info-divider {
          height: 1px;
          margin: 20px 0 17px;
          background: var(--rr-line);
        }

        .rr-blog-info-card > a {
          display: inline-flex;
          align-items: center;
          gap: 5px;

          color: var(--rr-rose);
          text-decoration: none;

          font-size: 9px;
          font-weight: 900;
        }

        /* =========================================================
           PREVIOUS / NEXT
        ========================================================= */

        .rr-blog-navigation {
          padding: 0 0 75px;
          background: var(--rr-cream);
        }

        .rr-blog-nav-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 13px;
        }

        .rr-blog-nav-card {
          min-height: 84px;

          display: flex;
          align-items: center;
          gap: 12px;

          padding: 15px 18px;

          border: 1px solid var(--rr-line);
          border-radius: 17px;

          color: var(--rr-ink);
          background: var(--rr-paper);

          text-decoration: none;

          transition:
            transform .23s ease,
            box-shadow .23s ease,
            border-color .23s ease;
        }

        .rr-blog-nav-card:hover {
          transform: translateY(-3px);
          border-color: #d5b77a;
          box-shadow:
            0 12px 28px rgba(57,33,39,.07);
        }

        .rr-blog-nav-card.next {
          justify-content: flex-end;
          text-align: right;

          color: white;
          border-color: transparent;

          background:
            linear-gradient(
              135deg,
              #301523,
              #4b1830
            );
        }

        .rr-blog-nav-icon {
          width: 39px;
          height: 39px;

          display: flex;
          align-items: center;
          justify-content: center;

          flex: 0 0 auto;

          border-radius: 50%;

          color: var(--rr-ink);
          background: #f2e8da;
        }

        .rr-blog-nav-card.next
          .rr-blog-nav-icon {
          color: #332316;
          background: #e9c95f;
        }

        .rr-blog-nav-card span {
          display: block;

          margin-bottom: 5px;

          color: #9a8e88;

          font-size: 7px;
          font-weight: 900;
          letter-spacing: .16em;
          text-transform: uppercase;
        }

        .rr-blog-nav-card strong {
          display: block;

          max-width: 390px;
          overflow: hidden;

          color: var(--rr-ink);

          font-size: 11px;
          line-height: 1.35;

          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .rr-blog-nav-card.next strong {
          color: white;
        }

        .rr-blog-nav-card.next:hover strong {
          color: #f0d475;
        }

        /* =========================================================
           RELATED STORIES
        ========================================================= */

        .rr-blog-related-section {
          padding: 78px 0 88px;

          background:
            linear-gradient(
              135deg,
              #f0e3d5,
              #f8efe3
            );
        }

        .rr-blog-related-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;

          gap: 20px;
          margin-bottom: 25px;
        }

        .rr-blog-related-heading h2 {
          margin: 10px 0 0;

          color: var(--rr-ink);

          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-size: 35px;
          line-height: 1;
          letter-spacing: -.04em;
        }

        .rr-blog-related-heading h2 span {
          color: var(--rr-rose);
        }

        .rr-blog-related-heading > a {
          display: inline-flex;
          align-items: center;
          gap: 5px;

          color: var(--rr-rose);

          text-decoration: none;

          font-size: 9px;
          font-weight: 900;
        }

        .rr-related-grid {
          display: grid;
          grid-template-columns:
            repeat(4, minmax(0, 1fr));
          gap: 14px;
        }

        .rr-related-card {
          overflow: hidden;

          border: 1px solid var(--rr-line);
          border-radius: 17px;

          color: inherit;
          background: var(--rr-paper);

          text-decoration: none;

          box-shadow:
            0 7px 24px rgba(57,33,39,.04);

          transition:
            transform .25s ease,
            box-shadow .25s ease,
            border-color .25s ease;
        }

        .rr-related-card:hover {
          transform: translateY(-5px);
          border-color: #d4bb88;

          box-shadow:
            0 16px 35px rgba(57,33,39,.09);
        }

        .rr-related-image {
          position: relative;

          height: 165px;
          overflow: hidden;

          background: #eadfd2;
        }

        .rr-related-image-img {
          transition: transform .55s ease;
        }

        .rr-related-card:hover
          .rr-related-image-img {
          transform: scale(1.05);
        }

        .rr-related-category {
          position: absolute;
          left: 10px;
          top: 10px;

          padding: 6px 8px;

          border: 1px solid rgba(255,255,255,.45);
          border-radius: 999px;

          color: #5b2838;
          background: rgba(255,248,237,.90);

          font-size: 7px;
          font-weight: 900;
          letter-spacing: .1em;
          text-transform: uppercase;

          backdrop-filter: blur(5px);
        }

        .rr-related-open {
          position: absolute;
          right: 10px;
          bottom: 10px;

          width: 32px;
          height: 32px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 50%;

          color: #2e201a;
          background: #e9c95f;
        }

        .rr-related-body {
          padding: 15px;
        }

        .rr-related-date {
          display: flex;
          align-items: center;
          gap: 5px;

          color: #9b8d86;

          font-size: 7px;
          font-weight: 800;
        }

        .rr-related-body h3 {
          display: -webkit-box;
          overflow: hidden;

          margin: 9px 0 12px;

          color: var(--rr-ink);

          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-size: 17px;
          line-height: 1.12;

          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
        }

        .rr-related-read {
          display: inline-flex;
          align-items: center;
          gap: 5px;

          color: var(--rr-rose);

          font-size: 8px;
          font-weight: 900;
        }

        /* =========================================================
           FINAL CTA
        ========================================================= */

        .rr-blog-final {
          position: relative;
          overflow: hidden;

          min-height: 300px;

          display: flex;
          align-items: center;
          justify-content: center;

          background:
            radial-gradient(
              circle at 15% 30%,
              rgba(229,198,111,.1),
              transparent 26%
            ),
            radial-gradient(
              circle at 88% 75%,
              rgba(163,41,76,.14),
              transparent 28%
            ),
            linear-gradient(
              135deg,
              #25121f,
              #4b1830
            );
        }

        .rr-blog-final-pattern {
          position: absolute;
          inset: 0;

          pointer-events: none;

          opacity: .09;

          background-image:
            radial-gradient(
              circle,
              #fff 1px,
              transparent 1.2px
            );

          background-size: 19px 19px;
        }

        .rr-blog-final-inner {
          position: relative;
          z-index: 2;

          width: min(
            700px,
            calc(100% - 32px)
          );

          padding: 60px 0;

          text-align: center;
          color: white;
        }

        .rr-blog-final-inner > svg {
          color: var(--rr-gold-light);
        }

        .rr-blog-final-inner h2 {
          margin: 13px 0 9px;

          color: white;

          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-size: 39px;
          line-height: 1;
          letter-spacing: -.04em;
        }

        .rr-blog-final-inner p {
          max-width: 570px;

          margin: 0 auto;

          color: rgba(255,255,255,.58);

          font-size: 11px;
          line-height: 1.75;
        }

        .rr-blog-final-inner > a {
          display: inline-flex;
          align-items: center;
          gap: 7px;

          margin-top: 22px;
          padding: 12px 17px;

          border: 1px solid #e2be57;
          border-radius: 10px;

          color: #2d2118;
          background: #efd06f;

          text-decoration: none;

          font-size: 9px;
          font-weight: 900;

          transition: .22s ease;
        }

        .rr-blog-final-inner > a:hover {
          transform: translateY(-2px);
          box-shadow:
            0 10px 25px rgba(0,0,0,.18);
        }

        /* =========================================================
           RESPONSIVE
        ========================================================= */

        @media (max-width: 980px) {
          .rr-blog-hero-card {
            grid-template-columns: 1fr;
          }

          .rr-blog-hero-copy {
            min-height: 470px;
          }

          .rr-blog-hero-image {
            min-height: 410px;
          }

          .rr-blog-story-grid {
            grid-template-columns: 1fr;
          }

          .rr-blog-info {
            position: static;
          }

          .rr-blog-info-card {
            max-width: 500px;
          }

          .rr-related-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 650px) {
          .rr-blog-shell {
            width: min(
              calc(100% - 24px),
              1140px
            );
          }

          .rr-blog-hero {
            padding-top: 20px;
          }

          /*
           * Mobile back button stays visible and easy to tap.
           */
          .rr-blog-back-button {
            top: 76px;
            left: 12px;

            width: auto;
            min-height: 43px;

            margin: 0;
            padding: 11px 15px;

            font-size: 8px;
          }

          .rr-blog-hero-card {
            border-radius: 20px 20px 0 0;
          }

          .rr-blog-hero-copy {
            min-height: 470px;
            padding: 31px 23px 27px;
          }

          .rr-blog-hero-copy h1 {
            font-size: 43px;
          }

          .rr-blog-excerpt {
            font-size: 11px;
          }

          .rr-blog-hero-image {
            min-height: 310px;
          }

          .rr-blog-story-section {
            padding: 53px 0;
          }

          .rr-blog-story-heading {
            padding: 25px 21px 0;
          }

          .rr-blog-story-content {
            padding: 22px 21px 27px;
          }

          .rr-blog-story-content p {
            font-size: 14px;
          }

          .rr-blog-story-footer {
            grid-template-columns: 1fr;
          }

          .rr-blog-story-footer-item {
            border-right: 0;
            border-bottom: 1px solid var(--rr-line);
          }

          .rr-blog-story-footer-item:last-child {
            border-bottom: 0;
          }

          .rr-blog-nav-grid {
            grid-template-columns: 1fr;
          }

          .rr-blog-related-heading {
            align-items: flex-start;
            flex-direction: column;
          }

          .rr-related-grid {
            grid-template-columns: 1fr;
          }

          .rr-blog-related-heading h2 {
            font-size: 31px;
          }

          .rr-blog-final-inner h2 {
            font-size: 34px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .rr-blog-detail *,
          .rr-blog-detail *::before,
          .rr-blog-detail *::after {
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: .01ms !important;
          }
        }
      `}</style>

      {/* =========================================================
          HERO
      ========================================================= */}

      <section className="rr-blog-hero">
        <div className="rr-blog-pattern" />

        <div className="rr-blog-orbit rr-blog-orbit-one" />
        <div className="rr-blog-orbit rr-blog-orbit-two" />

        <div className="rr-blog-shell">
          {/* ======================================================
              BACK TO BLOG — ALWAYS VISIBLE
          ====================================================== */}

          <Link
            to="/blogs"
            className="rr-blog-back-button"
            aria-label="Go back to Blog"
            title="Go back to Blog"
          >
            <ArrowLeft size={16} />
            Back to Blog
          </Link>

          <motion.article
            className="rr-blog-hero-card"
            initial={{
              opacity: 0,
              y: 22,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: .6,
              ease: "easeOut",
            }}
          >
            {/* LEFT — ARTICLE INFORMATION */}

            <div className="rr-blog-hero-copy">
              <div>
                <div className="rr-blog-pills">
                  <span className="rr-blog-category-pill">
                    <Tag size={13} />
                    {post.category || "School Life"}
                  </span>

                  <span className="rr-blog-read-pill">
                    <Clock3 size={13} />
                    {readTime}
                  </span>
                </div>

                <SectionLabel light>
                  School Journal ·{" "}
                  {formatBlogDate(post.date)}
                </SectionLabel>

                <h1>{post.title}</h1>

                {post.excerpt && (
                  <p className="rr-blog-excerpt">
                    {post.excerpt}
                  </p>
                )}
              </div>

              <div className="rr-blog-author">
                <div className="rr-blog-author-avatar">
                  {initial}
                </div>

                <div>
                  <span>Written by</span>

                  <strong>
                    {authorName}
                  </strong>

                  <small>
                    {post.authorRole ||
                      "Red Rose School"}
                  </small>
                </div>
              </div>
            </div>

            {/* RIGHT — IMAGE */}

            <div className="rr-blog-hero-image">
              <BlogImage
                post={post}
                className="rr-blog-main-image"
              />

              <div className="rr-blog-image-shade" />

              <span className="rr-blog-featured">
                Featured Story
              </span>

              <span className="rr-blog-image-arrow">
                <ArrowUpRight size={17} />
              </span>
            </div>
          </motion.article>
        </div>

        <div className="rr-blog-zigzag">
          <div className="rr-blog-zigzag-inner" />
        </div>
      </section>

      {/* =========================================================
          STORY
      ========================================================= */}

      <section className="rr-blog-story-section">
        <div className="rr-blog-shell">
          <div className="rr-blog-story-grid">
            <motion.article
              className="rr-blog-story-card"
              initial={{
                opacity: 0,
                y: 18,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: .5,
              }}
            >
              <div className="rr-blog-story-heading">
                <SectionLabel>
                  The Story
                </SectionLabel>

                <div className="rr-blog-story-rule" />
              </div>

              <div className="rr-blog-story-content">
                {paragraphs.length > 0 ? (
                  paragraphs.map(
                    (paragraph, index) => (
                      <p
                        key={index}
                        className={
                          index === 0
                            ? "rr-blog-lead"
                            : ""
                        }
                      >
                        {paragraph}
                      </p>
                    )
                  )
                ) : (
                  <p>
                    No additional article content
                    is available.
                  </p>
                )}
              </div>

              <div className="rr-blog-story-footer">
                <div className="rr-blog-story-footer-item">
                  <span>Category</span>
                  <strong>
                    {post.category ||
                      "School Life"}
                  </strong>
                </div>

                <div className="rr-blog-story-footer-item">
                  <span>Published</span>
                  <strong>
                    {formatBlogDate(
                      post.date
                    )}
                  </strong>
                </div>

                <div className="rr-blog-story-footer-item">
                  <span>Reading time</span>
                  <strong>{readTime}</strong>
                </div>
              </div>
            </motion.article>

            {/* ARTICLE INFO */}

            <aside className="rr-blog-info">
              <div className="rr-blog-info-card">
                <SectionLabel>
                  Article Details
                </SectionLabel>

                <div className="rr-blog-info-item">
                  <div className="rr-blog-info-icon">
                    <Calendar size={16} />
                  </div>

                  <div className="rr-blog-info-text">
                    <small>Published</small>
                    <strong>
                      {formatBlogDate(
                        post.date
                      )}
                    </strong>
                  </div>
                </div>

                <div className="rr-blog-info-item">
                  <div className="rr-blog-info-icon">
                    <Clock3 size={16} />
                  </div>

                  <div className="rr-blog-info-text">
                    <small>
                      Reading time
                    </small>
                    <strong>
                      {readTime}
                    </strong>
                  </div>
                </div>

                <div className="rr-blog-info-divider" />

                <Link to="/blogs">
                  Back to all stories
                  <ArrowRight size={14} />
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* =========================================================
          PREVIOUS / NEXT
      ========================================================= */}

      {(previousPost || nextPost) && (
        <section className="rr-blog-navigation">
          <div className="rr-blog-shell">
            <div className="rr-blog-nav-grid">
              {previousPost ? (
                <Link
                  to={`/blogs/${previousPost.slug}`}
                  className="rr-blog-nav-card"
                >
                  <div className="rr-blog-nav-icon">
                    <ArrowLeft size={16} />
                  </div>

                  <div>
                    <span>
                      Previous Story
                    </span>

                    <strong>
                      {previousPost.title}
                    </strong>
                  </div>
                </Link>
              ) : (
                <div />
              )}

              {nextPost ? (
                <Link
                  to={`/blogs/${nextPost.slug}`}
                  className="rr-blog-nav-card next"
                >
                  <div>
                    <span>
                      Next Story
                    </span>

                    <strong>
                      {nextPost.title}
                    </strong>
                  </div>

                  <div className="rr-blog-nav-icon">
                    <ArrowRight size={16} />
                  </div>
                </Link>
              ) : null}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================
          RELATED STORIES
      ========================================================= */}

      {relatedPosts.length > 0 && (
        <section className="rr-blog-related-section">
          <div className="rr-blog-shell">
            <div className="rr-blog-related-heading">
              <div>
                <SectionLabel>
                  Continue Reading
                </SectionLabel>

                <h2>
                  More from{" "}
                  <span>
                    {post.category}
                  </span>
                </h2>
              </div>

              <Link to="/blogs">
                View all stories
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="rr-related-grid">
              {relatedPosts.map(
                (relatedPost) => (
                  <RelatedCard
                    key={
                      relatedPost.id ||
                      relatedPost.slug
                    }
                    post={relatedPost}
                  />
                )
              )}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================
          FINAL CTA
      ========================================================= */}

      <section className="rr-blog-final">
        <div className="rr-blog-final-pattern" />

        <div className="rr-blog-final-inner">
          <Sparkles size={18} />

          <h2>
            Discover More School Stories
          </h2>

          <p>
            Explore announcements, achievements,
            activities, and moments from the Red
            Rose School community.
          </p>

          <Link to="/blogs">
            <BookOpen size={15} />
            Back to School Journal
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}
