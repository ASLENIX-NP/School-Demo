import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  AlertCircle,
  ArrowUpRight,
  Bell,
  CalendarDays,
  ChevronRight,
  Download,
  FileText,
  Pin,
  Search,
  Sparkles,
  X,
  Eye,
  BookOpen,
  Clock,
} from "lucide-react";

// ============================================================
// THEME — Matches About page
// ============================================================

const theme = {
  ink: "#1E1420",
  inkSoft: "#2D1C2A",
  paper: "#F5EEE2",
  paperDeep: "#E9DCC4",
  card: "#FBF7EE",
  rose: "#9C2748",
  roseDeep: "#6E1733",
  roseBright: "#C6486B",
  gold: "#B98A42",
  goldSoft: "#E7CE9C",
  moss: "#3F5B49",
  mossDeep: "#2C4234",
  text: "#2B1E23",
  textMuted: "#7C6B6F",
  white: "#FFFFFF",
  gradRose: "linear-gradient(135deg, #6E1733 0%, #9C2748 55%, #C6486B 100%)",
  gradInk: "linear-gradient(160deg, #17101C 0%, #2A1826 55%, #3A2130 100%)",
  gradGold: "linear-gradient(135deg, #E7CE9C 0%, #B98A42 100%)",
  gradMoss: "linear-gradient(135deg, #2C4234 0%, #3F5B49 55%, #6E8F76 100%)",
};

// ============================================================
// GLOBAL STYLES
// ============================================================

function NoticesStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700&family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');

      .rr-notices {
        font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
        color: ${theme.text};
        background: ${theme.paper};
      }

      .rr-notices *,
      .rr-notices *::before,
      .rr-notices *::after {
        box-sizing: border-box;
      }

      .rr-serif {
        font-family: 'Fraunces', Georgia, 'Times New Roman', serif;
      }

      .rr-mono {
        font-family: 'Space Grotesk', 'IBM Plex Mono', monospace;
      }

      .rr-notices button:focus-visible {
        outline: 2px solid ${theme.gold};
        outline-offset: 3px;
      }

      .rr-notice-card {
        transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        position: relative;
      }

      .rr-notice-card:hover {
        transform: translateY(-8px);
      }

      .rr-notice-card:hover .rr-notice-accent {
        width: 80px;
      }

      .rr-notice-card:hover .rr-notice-glow {
        opacity: 1;
      }

      .rr-notice-accent {
        transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);
      }

      .rr-notice-glow {
        opacity: 0;
        transition: opacity 0.6s ease;
      }

      .rr-notice-card .rr-read-btn {
        transition: all 0.3s ease;
      }

      .rr-notice-card:hover .rr-read-btn {
        transform: translateX(6px);
      }

      .rr-filter-btn {
        transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
      }

      .rr-filter-btn:hover {
        transform: translateY(-3px);
      }

      .rr-search-input:focus {
        border-color: ${theme.gold};
        box-shadow: 0 0 0 4px rgba(185,138,66,0.12);
      }

      .rr-popup-content {
        scrollbar-width: thin;
        scrollbar-color: ${theme.gold} ${theme.paper};
      }

      .rr-popup-content::-webkit-scrollbar {
        width: 6px;
      }

      .rr-popup-content::-webkit-scrollbar-track {
        background: ${theme.paper};
        border-radius: 10px;
      }

      .rr-popup-content::-webkit-scrollbar-thumb {
        background: ${theme.gold};
        border-radius: 10px;
      }

      .rr-popup-close {
        flex-shrink: 0;
        appearance: none;
        -webkit-appearance: none;
      }

      .rr-popup-close:hover {
        background: ${theme.roseDeep} !important;
        box-shadow: 0 12px 30px rgba(156,39,72,0.38) !important;
      }

      .rr-popup-close:focus-visible {
        outline: 3px solid ${theme.goldSoft};
        outline-offset: 3px;
      }

      .rr-popup-close {
        transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
      }

      .rr-popup-close:hover {
        transform: rotate(90deg) scale(1.1);
        background: ${theme.rose};
        color: white;
      }

      .rr-pdf-btn {
        transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
      }

      .rr-pdf-btn:hover {
        transform: translateY(-3px);
        box-shadow: 0 12px 28px rgba(156,39,72,0.25);
      }

      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }

      .rr-float {
        animation: float 6s ease-in-out infinite;
      }

      /* Hero bottom edge — same cream zigzag language as Academics */
      .rr-notices-hero-card::after {
        content: "";
        position: absolute;
        left: -1px;
        right: -1px;
        bottom: -1px;
        height: 24px;
        z-index: 5;
        pointer-events: none;
        background: ${theme.paper};
        clip-path: polygon(
          0 100%,
          2% 0, 4% 100%,
          6% 0, 8% 100%,
          10% 0, 12% 100%,
          14% 0, 16% 100%,
          18% 0, 20% 100%,
          22% 0, 24% 100%,
          26% 0, 28% 100%,
          30% 0, 32% 100%,
          34% 0, 36% 100%,
          38% 0, 40% 100%,
          42% 0, 44% 100%,
          46% 0, 48% 100%,
          50% 0, 52% 100%,
          54% 0, 56% 100%,
          58% 0, 60% 100%,
          62% 0, 64% 100%,
          66% 0, 68% 100%,
          70% 0, 72% 100%,
          74% 0, 76% 100%,
          78% 0, 80% 100%,
          82% 0, 84% 100%,
          86% 0, 88% 100%,
          90% 0, 92% 100%,
          94% 0, 96% 100%,
          98% 0, 100% 100%
        );
      }

      /* Zigzag at bottom of card */
      .rr-card-zigzag {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 20px;
        background: ${theme.card};
        clip-path: polygon(
          0 100%,
          2% 0, 4% 100%,
          6% 0, 8% 100%,
          10% 0, 12% 100%,
          14% 0, 16% 100%,
          18% 0, 20% 100%,
          22% 0, 24% 100%,
          26% 0, 28% 100%,
          30% 0, 32% 100%,
          34% 0, 36% 100%,
          38% 0, 40% 100%,
          42% 0, 44% 100%,
          46% 0, 48% 100%,
          50% 0, 52% 100%,
          54% 0, 56% 100%,
          58% 0, 60% 100%,
          62% 0, 64% 100%,
          66% 0, 68% 100%,
          70% 0, 72% 100%,
          74% 0, 76% 100%,
          78% 0, 80% 100%,
          82% 0, 84% 100%,
          86% 0, 88% 100%,
          90% 0, 92% 100%,
          94% 0, 96% 100%,
          98% 0, 100% 100%
        );
      }

      /* Full-width zigzag edge for the notices hero — matches Academics */
      .rr-hero-zigzag {
        position: absolute;
        z-index: 6;
        left: 0;
        right: 0;
        bottom: -1px;
        height: 30px;
        background: ${theme.paper};
        clip-path: polygon(
          0 0, 2% 100%, 4% 0, 6% 100%, 8% 0, 10% 100%,
          12% 0, 14% 100%, 16% 0, 18% 100%, 20% 0, 22% 100%,
          24% 0, 26% 100%, 28% 0, 30% 100%, 32% 0, 34% 100%,
          36% 0, 38% 100%, 40% 0, 42% 100%, 44% 0, 46% 100%,
          48% 0, 50% 100%, 52% 0, 54% 100%, 56% 0, 58% 100%,
          60% 0, 62% 100%, 64% 0, 66% 100%, 68% 0, 70% 100%,
          72% 0, 74% 100%, 76% 0, 78% 100%, 80% 0, 82% 100%,
          84% 0, 86% 100%, 88% 0, 90% 100%, 92% 0, 94% 100%,
          96% 0, 98% 100%, 100% 0, 100% 100%, 0 100%
        );
      }

      .rr-popup-zigzag {
        height: 22px;
        margin: 0 -1px -1px;
        background: ${theme.paper};
        clip-path: polygon(
          0 100%,
          2% 0, 4% 100%,
          6% 0, 8% 100%,
          10% 0, 12% 100%,
          14% 0, 16% 100%,
          18% 0, 20% 100%,
          22% 0, 24% 100%,
          26% 0, 28% 100%,
          30% 0, 32% 100%,
          34% 0, 36% 100%,
          38% 0, 40% 100%,
          42% 0, 44% 100%,
          46% 0, 48% 100%,
          50% 0, 52% 100%,
          54% 0, 56% 100%,
          58% 0, 60% 100%,
          62% 0, 64% 100%,
          66% 0, 68% 100%,
          70% 0, 72% 100%,
          74% 0, 76% 100%,
          78% 0, 80% 100%,
          82% 0, 84% 100%,
          86% 0, 88% 100%,
          90% 0, 92% 100%,
          94% 0, 96% 100%,
          98% 0, 100% 100%
        );
      }

      @media (max-width: 640px) {
        .rr-popup-content {
          max-height: 96vh !important;
          border-radius: 24px 24px 0 0 !important;
        }

        .rr-popup-header {
          flex-direction: column;
        }

        .rr-notices-hero {
          padding: 16px 12px 32px !important;
        }

        .rr-notices-hero-card {
          padding: 28px 18px 54px !important;
          border-radius: 0 0 16px 16px !important;
        }

        .rr-notices-grid {
          grid-template-columns: 1fr !important;
        }

        .rr-popup-inner {
          padding: 24px 18px 22px !important;
        }

        .rr-pdf-preview {
          height: 340px !important;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .rr-notices *,
        .rr-notices *::before,
        .rr-notices *::after {
          animation-duration: 0.001ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.001ms !important;
        }
      }
    `}</style>
  );
}

// ============================================================
// HELPERS
// ============================================================

const API_URL = import.meta.env.VITE_API_URL;
const REQUEST_TIMEOUT_MS = 12000;

export const defaultNoticeSettings = {
  page_badge: "Official School Updates",
  page_title: "Stay Connected with School News",
  page_description:
    "Important notices, examinations, holidays, admissions and school updates — all in one place.",
  sidebar_title: "Stay informed",
  sidebar_description:
    "Check this page regularly for the latest official school information.",
  sidebar_button_text: "View Calendar",
  sidebar_button_link: "/calendar",
};

export const formatNoticeDate = (value) => {
  if (!value) return "No date";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export function normalizeNotice(notice = {}) {
  return {
    ...notice,
    id: notice.id || notice._id,
    title: notice.title || "",
    category: notice.category || "General",
    notice_date: notice.notice_date || notice.date || "",
    description: notice.description || "",
    pdf_url: notice.pdf_url || notice.pdfUrl || "",
    file_url: notice.file_url || notice.fileUrl || "",
    file_type: notice.file_type || notice.fileType || "",
    pinned: Boolean(notice.pinned),
    featured: Boolean(notice.featured),
    created_at: notice.created_at || notice.createdAt || "",
  };
}

export function sortNoticesNewestFirst(list = []) {
  return [...list].sort((a, b) => {
    if (Boolean(a.pinned) !== Boolean(b.pinned)) {
      return a.pinned ? -1 : 1;
    }

    const da = new Date(
      a.notice_date || a.created_at || 0
    ).getTime();

    const db = new Date(
      b.notice_date || b.created_at || 0
    ).getTime();

    return db - da;
  });
}

async function fetchJson(url) {
  const controller = new AbortController();

  const timeout = window.setTimeout(
    () => controller.abort(),
    REQUEST_TIMEOUT_MS
  );

  try {
    const response = await fetch(url, {
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(
        `Request failed: ${response.status}`
      );
    }

    return await response.json();
  } finally {
    window.clearTimeout(timeout);
  }
}

function getCategoryColor(category) {
  const value = String(category || "").toLowerCase();

  if (value.includes("exam")) return theme.rose;
  if (value.includes("admission")) return theme.gold;
  if (value.includes("holiday")) return theme.moss;
  if (value.includes("event")) return "#2F6F8F";
  if (value.includes("result")) return "#7056A3";
  if (value.includes("meeting")) return "#8B5E34";
  if (value.includes("general knowledge")) return "#39736A";

  return theme.moss;
}

function EditBadge({ onClick, children = "Edit" }) {
  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        onClick?.();
      }}
      className="absolute right-4 top-4 z-30 rounded-full px-3 py-2 text-xs font-black shadow-lg ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-xl"
      style={{ background: theme.white, color: theme.rose }}
    >
      ✎ {children}
    </button>
  );
}

// ============================================================
// SECTION INTRO — Matches About page
// ============================================================

function SectionIntro({ eyebrow, title, description, align = "left" }) {
  const centered = align === "center";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
      style={{
        maxWidth: centered ? "720px" : "760px",
        margin: centered ? "0 auto 42px" : "0 0 34px",
        textAlign: centered ? "center" : "left",
      }}
    >
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: centered ? "center" : "flex-start",
          gap: "12px",
          marginBottom: "14px",
        }}
      >
        <span
          style={{
            width: "34px",
            height: "1px",
            background: theme.gold,
          }}
        />
        <span
          className="rr-mono"
          style={{
            color: theme.rose,
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
          }}
        >
          {eyebrow}
        </span>
      </motion.div>

      <motion.h2
        className="rr-serif"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.15 }}
        style={{
          margin: 0,
          color: theme.ink,
          fontSize: "clamp(2rem, 4vw, 3.15rem)",
          lineHeight: 1.05,
          fontWeight: 600,
          letterSpacing: "-0.025em",
        }}
        dangerouslySetInnerHTML={{ __html: title }}
      />

      {description && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            margin: "16px auto 0",
            maxWidth: centered ? "650px" : "700px",
            color: theme.textMuted,
            fontSize: "15px",
            lineHeight: 1.75,
          }}
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  );
}

// ============================================================
// NOTICE CARD — Enhanced with zigzag at bottom
// ============================================================

function NoticeCard({
  notice,
  index,
  editMode,
  onEditTarget,
  onDeleteTarget,
  onClick,
}) {
  const color = getCategoryColor(notice.category);
  const hasPdf = Boolean(notice.pdf_url || notice.file_url);
  return (
    <motion.article
      className="rr-notice-card"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{
        duration: 0.6,
        delay: Math.min(index * 0.06, 0.3),
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{
        ...styles.noticeCard,
      }}
    >
      <div
        className="relative flex h-full min-h-[320px] flex-col overflow-hidden rounded-[28px] p-6 sm:p-7 pb-9 cursor-pointer"
        style={{
          background: theme.card,
          border: `1px solid ${theme.paperDeep}`,
          boxShadow: "0 12px 30px rgba(30,20,32,0.055)",
        }}
        onClick={() => {
          if (!editMode) onClick?.();
        }}
      >
        {/* Zigzag at bottom */}
        <div className="rr-card-zigzag" aria-hidden="true" />

        {/* Glow effect on hover */}
        <div
          className="rr-notice-glow pointer-events-none absolute inset-0 rounded-[28px] transition-opacity duration-600"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${color}15, transparent 70%)`,
          }}
        />

        {/* Accent line */}
        <div
          className="rr-notice-accent absolute left-0 top-0 h-1.5"
          style={{
            background: `linear-gradient(90deg, ${color}, ${theme.gold})`,
            width: "40px",
          }}
        />

        {/* Decorative number */}
        <span
          className="rr-serif pointer-events-none absolute -right-4 -top-2 text-[80px] font-bold opacity-[0.04]"
          style={{ color: theme.ink }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        {editMode && (
          <div className="absolute right-4 top-4 z-20 flex gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEditTarget?.({ type: "notice", id: notice.id });
              }}
              className="rounded-xl px-3 py-2 text-xs font-black text-white shadow-lg transition hover:-translate-y-0.5"
              style={{ background: theme.rose }}
            >
              Edit
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteTarget?.({ type: "notice", id: notice.id });
              }}
              className="rounded-xl px-3 py-2 text-xs font-black shadow-lg transition hover:-translate-y-0.5"
              style={{ background: "#FEE2E2", color: "#DC2626" }}
            >
              Delete
            </button>
          </div>
        )}

        <div className="relative z-10 flex items-start justify-between gap-4">
          <div className="flex flex-wrap gap-2 pr-20">
            <span
              className="rr-mono rounded-full border px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[.14em]"
              style={{
                background: `${color}10`,
                borderColor: `${color}20`,
                color,
              }}
            >
              {notice.category || "General"}
            </span>

            {notice.pinned && (
              <span className="rr-mono inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[.08em] text-amber-700">
                <Pin size={12} />
                Important
              </span>
            )}

            {hasPdf && (
              <span className="rr-mono inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[.08em] text-rose-700">
                <FileText size={12} />
                PDF
              </span>
            )}
          </div>

          <div className="rr-mono shrink-0 rounded-2xl bg-white px-3 py-2 text-right text-[11px] font-bold" style={{ color: theme.textMuted }}>
            <CalendarDays
              size={15}
              className="ml-auto mb-1"
              style={{ color: theme.gold }}
            />
            {formatNoticeDate(notice.notice_date)}
          </div>
        </div>

        <h3
          className="rr-serif relative z-10 mt-5 max-w-2xl text-[21px] font-semibold leading-tight tracking-[-.02em] sm:text-[24px]"
          style={{ color: theme.ink }}
        >
          {notice.title || "School Notice"}
        </h3>

        <p
          className="relative z-10 mt-3 line-clamp-3 whitespace-pre-line text-sm leading-7 sm:text-[15px]"
          style={{ color: theme.textMuted }}
        >
          {notice.description || "Click to read the complete notice."}
        </p>

        <div className="relative z-10 mt-6 flex flex-col gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: theme.paperDeep }}>
          {!editMode ? (
            <button
              type="button"
              className="rr-read-btn inline-flex w-fit items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-black transition-all hover:-translate-y-0.5"
              style={{
                background: `${color}0D`,
                color,
              }}
              onClick={(e) => {
                e.stopPropagation();
                onClick?.();
              }}
            >
              <Eye size={15} />
              Read full notice
              <ArrowUpRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </button>
          ) : (
            <span className="rr-mono text-xs font-bold" style={{ color: theme.textMuted }}>
              Admin editing mode
            </span>
          )}

          {hasPdf && !editMode && (
            <span
              className="inline-flex w-fit items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black"
              style={{
                background: "#FEE2E2",
                color: "#B42318",
              }}
            >
              <FileText size={14} />
              Document attached
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function Notices({
  editMode = false,
  noticesOverride = null,
  settingsOverride = null,
  loadingOverride = false,
  onEditTarget = () => {},
  onDeleteTarget = () => {},
  onAddNotice = () => {},
  onViewAllNotices = () => {},
}) {
  const [notices, setNotices] = useState([]);
  const [settings, setSettings] = useState(defaultNoticeSettings);
  const [loading, setLoading] = useState(!editMode && !loadingOverride);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [pdfOnly, setPdfOnly] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [isClosingNotice, setIsClosingNotice] = useState(false);

  const handleCloseNotice = () => {
    if (!selectedNotice || isClosingNotice) return;

    setIsClosingNotice(true);

    window.setTimeout(() => {
      setSelectedNotice(null);
      setIsClosingNotice(false);
    }, 220);
  };

  useEffect(() => {
    if (!selectedNotice || editMode) return undefined;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        handleCloseNotice();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [selectedNotice, editMode, isClosingNotice]);

  // ==========================================================
  // LOAD DATA
  // ==========================================================

  useEffect(() => {
    if (editMode) {
      setNotices(
        sortNoticesNewestFirst(
          (noticesOverride || []).map(
            normalizeNotice
          )
        )
      );


      setSettings({
        ...defaultNoticeSettings,
        ...(settingsOverride || {}),
      });

      setLoading(Boolean(loadingOverride));

      return;
    }

    let alive = true;

    setLoading(true);

    fetchJson(
      `${API_URL}/api/notices`
    )
      .then((noticeResult) => {
        if (!alive) return;

        const rawNotices =
          Array.isArray(noticeResult)
            ? noticeResult
            : noticeResult?.data || [];

        setNotices(
          sortNoticesNewestFirst(
            rawNotices.map(
              normalizeNotice
            )
          )
        );
      })
      .catch((error) => {
        if (alive) {
          console.error(
            "Notice page load error:",
            error
          );
        }
      })
      .finally(() => {
        if (alive) {
          setLoading(false);
        }
      });

    fetchJson(
      `${API_URL}/api/notice-settings`
    )
      .then((settingsResult) => {
        if (!alive) return;

        setSettings({
          ...defaultNoticeSettings,
          ...(settingsResult?.data ||
            settingsResult ||
            {}),
        });
      })
      .catch((error) => {
        if (alive) {
          console.error(
            "Notice settings load error:",
            error
          );
        }
      });

    return () => {
      alive = false;
    };
  }, [
    editMode,
    noticesOverride,
    settingsOverride,
    loadingOverride,
  ]);

  // ==========================================================
  // CATEGORIES
  // ==========================================================

  const categories = useMemo(() => {
    const values = notices
      .map((item) => item.category)
      .filter(Boolean);

    return [
      "All",
      ...Array.from(new Set(values)),
    ];
  }, [notices]);

  // ==========================================================
  // FILTER
  // ==========================================================

  const filteredNotices = useMemo(() => {
    const q = query.trim().toLowerCase();

    return notices.filter((notice) => {
      const matchesSearch =
        !q ||
        `${notice.title} ${notice.description} ${notice.category}`
          .toLowerCase()
          .includes(q);

      const matchesCategory =
        category === "All" ||
        notice.category === category;

      const matchesPdf =
        !pdfOnly ||
        Boolean(
          notice.pdf_url ||
            notice.file_url
        );

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPdf
      );
    });
  }, [
    notices,
    query,
    category,
    pdfOnly,
  ]);

  const pinned =
    filteredNotices.filter(
      (item) => item.pinned
    );

  const regular =
    filteredNotices.filter(
      (item) => !item.pinned
    );

  const importantCount =
    notices.filter(
      (item) => item.pinned
    ).length;

  const pdfCount =
    notices.filter(
      (item) =>
        item.pdf_url ||
        item.file_url
    ).length;

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <main className="rr-notices" style={styles.page}>
      <NoticesStyles />

      {/* =====================================================
          HERO — Matches About page
      ====================================================== */}

      <section className="rr-notices-hero" style={styles.hero}>
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="rr-notices-hero-card"
          style={styles.heroCard}
        >
          {editMode && (
            <EditBadge
              onClick={() =>
                onEditTarget({
                  type: "pageHeader",
                })
              }
            >
              Edit Heading
            </EditBadge>
          )}

          <div style={styles.heroGlowOne} />
          <div style={styles.heroGlowTwo} />

          <div style={styles.heroContent}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={styles.heroBadge}
            >
              <Bell size={14} />
              <span className="rr-mono">{settings.page_badge}</span>
            </motion.div>

            <motion.h1
              className="rr-serif"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              style={styles.heroTitle}
            >
              {settings.page_title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              style={styles.heroDescription}
            >
              {settings.page_description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              style={styles.heroStats}
            >
              <div style={styles.heroStat}>
                <span className="rr-serif" style={styles.heroStatValue}>
                  {notices.length}
                </span>
                <span className="rr-mono" style={styles.heroStatLabel}>
                  Official notices
                </span>
              </div>

              <div style={styles.heroStatDivider} />

              <div style={styles.heroStat}>
                <span className="rr-serif" style={styles.heroStatValue}>
                  {importantCount}
                </span>
                <span className="rr-mono" style={styles.heroStatLabel}>
                  Important
                </span>
              </div>

              <div style={styles.heroStatDivider} />

              <div style={styles.heroStat}>
                <span className="rr-serif" style={styles.heroStatValue}>
                  {pdfCount}
                </span>
                <span className="rr-mono" style={styles.heroStatLabel}>
                  Documents
                </span>
              </div>
            </motion.div>
          </div>

          {/* Full-width zigzag edge, matching the Academics hero */}
          <div className="rr-hero-zigzag" aria-hidden="true" />
        </motion.div>
      </section>

      {/* =====================================================
          SEARCH + FILTER
      ====================================================== */}

      <section style={styles.noticesSection}>
        <div style={styles.sectionContainer}>
          <SectionIntro
            eyebrow="Official Notices"
            title='Recent <span style="color: #9C2748;">Updates</span>'
            description="Search and filter through all official school notices and updates."
            align="left"
          />

          {/* Search + Filter */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={styles.filterBar}
          >
            <div style={styles.searchWrapper}>
              <Search size={18} style={styles.searchIcon} />
              <input
                className="rr-search-input"
                value={query}
                onChange={(e) =>
                  setQuery(e.target.value)
                }
                placeholder="Search notices..."
                style={styles.searchInput}
              />
            </div>

            <div style={styles.filterGroup}>
              {categories.map(
                (item) => (
                  <button
                    key={item}
                    type="button"
                    className="rr-filter-btn"
                    onClick={() =>
                      setCategory(item)
                    }
                    style={{
                      ...styles.filterBtn,
                      background:
                        category === item
                          ? theme.rose
                          : theme.card,
                      color:
                        category === item
                          ? theme.white
                          : theme.textMuted,
                      borderColor:
                        category === item
                          ? theme.rose
                          : theme.paperDeep,
                    }}
                  >
                    {item}
                  </button>
                )
              )}

              <button
                type="button"
                className="rr-filter-btn"
                onClick={() =>
                  setPdfOnly(
                    (value) => !value
                  )
                }
                style={{
                  ...styles.filterBtn,
                  background: pdfOnly
                    ? theme.rose
                    : theme.card,
                  color: pdfOnly
                    ? theme.white
                    : theme.textMuted,
                  borderColor: pdfOnly
                    ? theme.rose
                    : theme.paperDeep,
                }}
              >
                <FileText size={14} />
                PDF
              </button>
            </div>
          </motion.div>

          {/* =================================================
              ADMIN CONTROLS
          ================================================== */}

          {editMode && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={styles.adminControls}
            >
              <button
                type="button"
                onClick={onAddNotice}
                style={styles.adminAddBtn}
              >
                + Add Notice
              </button>

              <button
                type="button"
                onClick={() =>
                  onEditTarget({
                    type: "sidebar",
                  })
                }
                style={styles.adminEditBtn}
              >
                Edit Info Card
              </button>

              <button
                type="button"
                onClick={onViewAllNotices}
                style={styles.adminManageBtn}
              >
                <ArrowUpRight size={16} />
                Manage All Notices
              </button>
            </motion.div>
          )}

          {/* =================================================
              LOADING
          ================================================== */}

          {loading ? (
            <div style={styles.loadingState}>
              <div style={styles.loadingSpinner} />
              <p className="rr-mono" style={styles.loadingText}>
                Loading notices...
              </p>
            </div>
          ) : regular.length === 0 && pinned.length === 0 ? (
            <div style={styles.emptyState}>
              <AlertCircle size={48} style={styles.emptyIcon} />
              <h3 className="rr-serif" style={styles.emptyTitle}>
                No notices found
              </h3>
              <p style={styles.emptyDesc}>
                New school notices will appear here once they are added from the admin panel.
              </p>
              {editMode && (
                <button
                  type="button"
                  onClick={onAddNotice}
                  style={styles.emptyBtn}
                >
                  Add First Notice
                </button>
              )}
            </div>
          ) : (
            /* =================================================
                NOTICES GRID — Zigzag layout
            ================================================== */

            <div>
              {/* Important Notices */}
              {pinned.length > 0 && (
                <div style={styles.pinnedSection}>
                  <div style={styles.pinnedHeader}>
                    <Pin size={16} style={styles.pinnedIcon} />
                    <span className="rr-mono" style={styles.pinnedLabel}>
                      Important Notices
                    </span>
                  </div>

                  <div className="rr-notices-grid" style={styles.noticesGrid}>
                    {pinned.map(
                      (notice, index) => (
                        <NoticeCard
                          key={notice.id || index}
                          notice={notice}
                          index={index}
                          editMode={editMode}
                          onEditTarget={onEditTarget}
                          onDeleteTarget={onDeleteTarget}
                          onClick={() =>
                            setSelectedNotice(notice)
                          }
                        />
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Regular Notices - Zigzag */}
              {regular.length > 0 && (
                <div style={styles.regularSection}>
                  {pinned.length > 0 && (
                    <div style={styles.regularDivider} />
                  )}

                  <div className="rr-notices-grid" style={styles.noticesGrid}>
                    {regular.map(
                      (notice, index) => (
                        <NoticeCard
                          key={notice.id || index}
                          notice={notice}
                          index={index}
                          editMode={editMode}
                          onEditTarget={onEditTarget}
                          onDeleteTarget={onDeleteTarget}
                          onClick={() =>
                            setSelectedNotice(notice)
                          }
                        />
                      )
                    )}
                  </div>

                  <div style={styles.noticesCount}>
                    <span className="rr-mono" style={styles.countText}>
                      Showing {regular.length} notices
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =================================================
              SIDEBAR / CTA — Matches About page
          ================================================== */}

          {!editMode && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
              style={styles.ctaSection}
            >
              <div style={styles.ctaGlow} />
              <div style={styles.ctaContent}>
                <div>
                  <span className="rr-mono" style={styles.ctaBadge}>
                    <Sparkles size={14} />
                    Stay updated
                  </span>

                  <h3 className="rr-serif" style={styles.ctaTitle}>
                    {settings.sidebar_title}
                  </h3>

                  <p style={styles.ctaDescription}>
                    {settings.sidebar_description}
                  </p>
                </div>

                <Link
                  to={settings.sidebar_button_link || "/calendar"}
                  style={styles.ctaButton}
                >
                  <span style={styles.ctaButtonIcon}>
                    <CalendarDays size={17} />
                  </span>
                  <span>{settings.sidebar_button_text || "View Calendar"}</span>
                  <ChevronRight size={17} style={styles.ctaButtonArrow} />
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* =====================================================
          NOTICE POPUP — Enhanced and attractive
      ====================================================== */}

      <AnimatePresence>
        {selectedNotice && !editMode && (
          <motion.div
            style={styles.popupOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseNotice}
          >
            <motion.div
              className="rr-popup-content"
              initial={{ opacity: 0, y: 30, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              style={styles.popupContent}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Decorative top bar */}
              <div style={styles.popupAccentBar}>
                <div style={styles.popupAccentGradient} />
                <div style={styles.popupAccentDot} />
              </div>

              <div style={styles.popupInner}>
                {/* Sticky close button — stays visible while the notice/PDF is scrolled */}
                <motion.button
                  type="button"
                  className="rr-popup-close"
                  aria-label="Close notice"
                  title="Close notice"
                  onClick={handleCloseNotice}
                  animate={{
                    rotate: isClosingNotice ? 180 : 0,
                    backgroundColor: isClosingNotice ? theme.roseDeep : theme.rose,
                    scale: isClosingNotice ? 0.94 : 1,
                  }}
                  whileHover={{ rotate: 90, scale: 1.06 }}
                  whileTap={{ rotate: 180, scale: 0.92 }}
                  transition={{ type: "spring", stiffness: 320, damping: 18 }}
                  style={styles.popupClose}
                >
                  <X size={21} strokeWidth={2.5} />
                </motion.button>

                {/* Header with category and date */}
                <div style={styles.popupHeader}>
                  <div style={styles.popupTags}>
                    <span
                      className="rr-mono"
                      style={{
                        ...styles.popupCategory,
                        background: `${getCategoryColor(selectedNotice.category)}10`,
                        color: getCategoryColor(selectedNotice.category),
                      }}
                    >
                      {selectedNotice.category || "Notice"}
                    </span>

                    {selectedNotice.pinned && (
                      <span className="rr-mono" style={styles.popupPinned}>
                        <Pin size={12} />
                        Important
                      </span>
                    )}

                    {selectedNotice.pdf_url && (
                      <span className="rr-mono" style={styles.popupPdfTag}>
                        <FileText size={12} />
                        PDF Attached
                      </span>
                    )}
                  </div>

                  <div style={styles.popupDateWrap}>
                    <CalendarDays size={16} color={theme.gold} />
                    <span className="rr-mono" style={styles.popupDate}>
                      {formatNoticeDate(selectedNotice.notice_date)}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h2 className="rr-serif" style={styles.popupTitle}>
                  {selectedNotice.title}
                </h2>

                {/* Divider */}
                <div style={styles.popupDivider} />

                {/* Description - full view without needing to click */}
                {selectedNotice.description && (
                  <div style={styles.popupDescriptionWrap}>
                    <BookOpen size={18} color={theme.gold} style={{ flexShrink: 0 }} />
                    <p style={styles.popupDescription}>
                      {selectedNotice.description}
                    </p>
                  </div>
                )}

                {/* PDF Section — shown directly inside the notice page */}
                {(selectedNotice.pdf_url || selectedNotice.file_url) && (
                  <div style={styles.popupPdfSection}>
                    <div style={styles.popupPdfHeader}>
                      <div style={styles.popupPdfIcon}>
                        <FileText size={24} color="#DC2626" />
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={styles.popupPdfTitle}>
                          Attached Document
                        </div>
                        <div style={styles.popupPdfSubtitle}>
                          Read the official school notice below without opening another page.
                        </div>
                      </div>

                      <a
                        href={selectedNotice.pdf_url || selectedNotice.file_url}
                        download
                        className="rr-pdf-btn"
                        style={styles.popupPdfDownloadBtn}
                      >
                        <Download size={16} />
                        Download
                      </a>
                    </div>

                    <div className="rr-pdf-preview" style={styles.pdfPreviewFrame}>
                      <iframe
                        src={`${selectedNotice.pdf_url || selectedNotice.file_url}#toolbar=1&navpanes=0&scrollbar=1`}
                        title={`${selectedNotice.title || "School Notice"} document`}
                        style={styles.pdfIframe}
                      />
                    </div>

                    <p style={styles.pdfPreviewNote}>
                      If the document does not load in the preview, use the Download button above.
                    </p>
                  </div>
                )}

                {/* Same zig-zag edge used across the Academics design */}
                <div className="rr-popup-zigzag" aria-hidden="true" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

// ============================================================
// STYLES
// ============================================================

const styles = {
  page: {
    minHeight: "100vh",
    background: theme.paper,
    overflowX: "hidden",
    paddingTop: "82px",
  },

  // HERO
  hero: {
    padding: "24px 24px 50px",
  },

  heroCard: {
    position: "relative",
    maxWidth: "1180px",
    margin: "0 auto",
    overflow: "hidden",
    borderRadius: "30px",
    padding: "60px clamp(32px, 6vw, 76px) 88px",
    background: "linear-gradient(135deg, #F9E8EA 0%, #F6D2D6 55%, #F1BCC4 100%)",
    boxShadow: "0 24px 55px rgba(156,39,72,0.12)",
    border: "1px solid rgba(156,39,72,0.10)",
  },

  heroGlowOne: {
    position: "absolute",
    width: "520px",
    height: "520px",
    borderRadius: "50%",
    background: "rgba(185, 138, 66, 0.08)",
    filter: "blur(80px)",
    top: "-300px",
    right: "-120px",
  },

  heroGlowTwo: {
    position: "absolute",
    width: "420px",
    height: "420px",
    borderRadius: "50%",
    background: "rgba(156, 39, 72, 0.06)",
    filter: "blur(80px)",
    bottom: "-270px",
    left: "-130px",
  },

  heroContent: {
    position: "relative",
    zIndex: 2,
    maxWidth: "800px",
  },

  heroBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    padding: "8px 20px",
    borderRadius: "50px",
    background: "rgba(255,255,255,0.38)",
    border: "1px solid rgba(156,39,72,0.14)",
    backdropFilter: "blur(14px)",
    color: theme.roseDeep,
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
  },

  eyebrowText: {
    color: theme.roseDeep,
  },

  heroTitle: {
    margin: "24px 0 18px",
    color: theme.ink,
    fontSize: "clamp(2.7rem, 5vw, 4.7rem)",
    lineHeight: 1.01,
    fontWeight: 600,
    letterSpacing: "-0.045em",
  },

  heroDescription: {
    maxWidth: "720px",
    margin: "0 0 28px",
    color: theme.text,
    fontSize: "15px",
    lineHeight: 1.8,
  },

  heroStats: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    paddingTop: "20px",
    borderTop: "1px solid rgba(156,39,72,0.14)",
  },

  heroStat: {
    display: "flex",
    flexDirection: "column",
  },

  heroStatValue: {
    fontSize: "28px",
    fontWeight: 600,
    color: theme.goldSoft,
  },

  heroStatLabel: {
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: theme.textMuted,
    marginTop: "2px",
  },

  heroStatDivider: {
    width: "1px",
    background: "rgba(156,39,72,0.14)",
  },

  // NOTICES SECTION
  noticesSection: {
    padding: "20px 24px 80px",
    background: theme.paper,
  },

  // FILTER BAR
  filterBar: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    padding: "20px 24px",
    marginBottom: "32px",
    background: theme.card,
    border: `1px solid ${theme.paperDeep}`,
    borderRadius: "20px",
    boxShadow: "0 8px 24px rgba(30,20,32,0.04)",
  },

  searchWrapper: {
    position: "relative",
    flex: 1,
  },

  searchIcon: {
    position: "absolute",
    left: "14px",
    top: "50%",
    transform: "translateY(-50%)",
    color: theme.textMuted,
  },

  searchInput: {
    width: "100%",
    padding: "12px 14px 12px 44px",
    borderRadius: "14px",
    border: `1px solid ${theme.paperDeep}`,
    background: theme.paper,
    fontSize: "14px",
    fontWeight: 600,
    color: theme.ink,
    outline: "none",
    transition: "all 0.3s ease",
  },

  filterGroup: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },

  filterBtn: {
    padding: "8px 16px",
    borderRadius: "12px",
    border: "1px solid",
    fontSize: "12px",
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
  },

  // ADMIN CONTROLS
  adminControls: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    padding: "16px 20px",
    marginBottom: "28px",
    background: `${theme.rose}06`,
    border: `1px solid ${theme.rose}15`,
    borderRadius: "16px",
  },

  adminAddBtn: {
    padding: "10px 20px",
    borderRadius: "12px",
    border: "none",
    fontSize: "13px",
    fontWeight: 700,
    color: theme.white,
    background: theme.gradRose,
    cursor: "pointer",
    transition: "all 0.3s ease",
  },

  adminEditBtn: {
    padding: "10px 20px",
    borderRadius: "12px",
    border: `1px solid ${theme.paperDeep}`,
    fontSize: "13px",
    fontWeight: 700,
    color: theme.ink,
    background: theme.card,
    cursor: "pointer",
    transition: "all 0.3s ease",
  },

  adminManageBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 20px",
    borderRadius: "12px",
    border: `1px solid ${theme.rose}20`,
    fontSize: "13px",
    fontWeight: 700,
    color: theme.rose,
    background: `${theme.rose}06`,
    cursor: "pointer",
    transition: "all 0.3s ease",
  },

  // NOTICES GRID - Zigzag
  noticesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gridAutoRows: "1fr",
    alignItems: "stretch",
    gap: "24px",
  },

  noticeCard: {
    height: "100%",
  },

  pinnedSection: {
    marginBottom: "40px",
  },

  pinnedHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "18px",
    padding: "10px 16px",
    background: "#FEF3C7",
    borderRadius: "12px",
    width: "fit-content",
  },

  pinnedIcon: {
    color: "#92400E",
  },

  pinnedLabel: {
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#92400E",
  },

  regularSection: {
    marginTop: "8px",
  },

  regularDivider: {
    height: "1px",
    margin: "0 0 32px",
    background: `linear-gradient(90deg, ${theme.gold}30, transparent)`,
  },

  noticesCount: {
    marginTop: "24px",
    textAlign: "center",
  },

  countText: {
    fontSize: "13px",
    color: theme.textMuted,
    fontWeight: 600,
  },

  // LOADING
  loadingState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
    padding: "60px 20px",
    background: theme.card,
    borderRadius: "20px",
    border: `1px solid ${theme.paperDeep}`,
  },

  loadingSpinner: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    border: "4px solid",
    borderColor: `${theme.gold}20`,
    borderTopColor: theme.gold,
    animation: "spin 0.8s linear infinite",
  },

  loadingText: {
    fontSize: "13px",
    fontWeight: 600,
    color: theme.textMuted,
  },

  // EMPTY
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
    padding: "60px 20px",
    background: theme.card,
    borderRadius: "20px",
    border: `1px dashed ${theme.paperDeep}`,
  },

  emptyIcon: {
    color: theme.textMuted,
    opacity: 0.3,
  },

  emptyTitle: {
    fontSize: "24px",
    fontWeight: 600,
    color: theme.ink,
    margin: 0,
  },

  emptyDesc: {
    fontSize: "14px",
    color: theme.textMuted,
    maxWidth: "400px",
    textAlign: "center",
    margin: 0,
  },

  emptyBtn: {
    marginTop: "8px",
    padding: "10px 24px",
    borderRadius: "12px",
    border: "none",
    fontSize: "13px",
    fontWeight: 700,
    color: theme.white,
    background: theme.rose,
    cursor: "pointer",
    transition: "all 0.3s ease",
  },

  // CTA
  ctaSection: {
    position: "relative",
    marginTop: "48px",
    padding: "40px 48px",
    borderRadius: "24px",
    overflow: "hidden",
    background: theme.gradInk,
    border: "1px solid rgba(255,255,255,0.06)",
    boxShadow: "0 24px 55px rgba(30,20,32,0.16)",
  },

  ctaGlow: {
    position: "absolute",
    width: "300px",
    height: "300px",
    borderRadius: "50%",
    background: "rgba(185,138,66,0.06)",
    filter: "blur(80px)",
    top: "-150px",
    right: "-100px",
  },

  ctaContent: {
    position: "relative",
    zIndex: 2,
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  ctaBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "4px 14px",
    borderRadius: "50px",
    background: "rgba(255,255,255,0.06)",
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: theme.goldSoft,
  },

  ctaTitle: {
    fontSize: "24px",
    fontWeight: 600,
    color: theme.white,
    margin: "8px 0 0",
  },

  ctaDescription: {
    fontSize: "14px",
    lineHeight: 1.7,
    color: "rgba(255,255,255,0.6)",
    maxWidth: "500px",
    margin: "4px 0 0",
  },

  ctaButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 24px",
    borderRadius: "14px",
    fontSize: "14px",
    fontWeight: 700,
    color: theme.ink,
    background: theme.gradGold,
    boxShadow: "0 12px 30px rgba(185,138,66,0.25)",
    textDecoration: "none",
    transition: "all 0.3s ease",
    marginTop: "4px",
  },

  ctaButtonIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "32px",
    height: "32px",
    borderRadius: "10px",
    background: "rgba(255,255,255,0.3)",
  },

  ctaButtonArrow: {
    transition: "transform 0.3s ease",
  },

  // POPUP — Enhanced
  popupOverlay: {
    position: "fixed",
    inset: 0,
    zIndex: 99999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    background: "rgba(30,20,32,0.75)",
    backdropFilter: "blur(12px)",
  },

  popupContent: {
    maxHeight: "94vh",
    width: "100%",
    maxWidth: "900px",
    overflowY: "auto",
    borderRadius: "32px 32px 0 0",
    background: theme.card,
    boxShadow: "0 60px 120px rgba(30,20,32,0.35)",
    border: "1px solid rgba(255,255,255,0.1)",
  },

  popupAccentBar: {
    position: "relative",
    height: "6px",
    borderRadius: "32px 32px 0 0",
    overflow: "hidden",
  },

  popupAccentGradient: {
    width: "100%",
    height: "100%",
    background: `linear-gradient(90deg, ${theme.rose}, ${theme.gold}, ${theme.moss}, ${theme.gold}, ${theme.rose})`,
    backgroundSize: "300% 100%",
    animation: "gradientMove 4s ease infinite",
  },

  popupAccentDot: {
    position: "absolute",
    right: "20px",
    top: "50%",
    transform: "translateY(-50%)",
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background: theme.goldSoft,
    boxShadow: "0 0 20px rgba(185,138,66,0.4)",
  },

  popupInner: {
    padding: "34px 40px 30px",
  },

  popupClose: {
    position: "sticky",
    top: "14px",
    zIndex: 50,
    marginLeft: "auto",
    marginBottom: "-48px",
    width: "42px",
    height: "42px",
    padding: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    border: `2px solid ${theme.roseBright}`,
    background: theme.rose,
    color: theme.white,
    cursor: "pointer",
    boxShadow: "0 10px 24px rgba(156,39,72,0.28)",
    transition: "background 0.25s ease, box-shadow 0.25s ease",
  },

  popupHeader: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "12px",
    marginBottom: "16px",
  },

  popupTags: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },

  popupCategory: {
    padding: "4px 14px",
    borderRadius: "50px",
    fontSize: "11px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },

  popupPinned: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    padding: "4px 14px",
    borderRadius: "50px",
    fontSize: "11px",
    fontWeight: 700,
    textTransform: "uppercase",
    background: "#FEF3C7",
    color: "#92400E",
  },

  popupPdfTag: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    padding: "4px 14px",
    borderRadius: "50px",
    fontSize: "11px",
    fontWeight: 700,
    textTransform: "uppercase",
    background: "#FEE2E2",
    color: "#DC2626",
  },

  popupDateWrap: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "6px 14px",
    borderRadius: "50px",
    background: theme.paper,
    border: `1px solid ${theme.paperDeep}`,
  },

  popupDate: {
    fontSize: "12px",
    fontWeight: 600,
    color: theme.textMuted,
  },

  popupTitle: {
    fontSize: "clamp(2rem, 4vw, 3.2rem)",
    fontWeight: 600,
    color: theme.ink,
    margin: "0 0 16px",
    lineHeight: 1.08,
    letterSpacing: "-0.02em",
  },

  popupDivider: {
    width: "60px",
    height: "3px",
    borderRadius: "4px",
    background: `linear-gradient(90deg, ${theme.gold}, transparent)`,
    marginBottom: "20px",
  },

  popupDescriptionWrap: {
    display: "flex",
    gap: "14px",
    padding: "20px 24px",
    borderRadius: "16px",
    background: `${theme.rose}04`,
    border: `1px solid ${theme.paperDeep}`,
    marginBottom: "24px",
  },

  popupDescription: {
    fontSize: "16px",
    lineHeight: 1.9,
    color: theme.text,
    whiteSpace: "pre-line",
    margin: 0,
  },

  popupPdfSection: {
    padding: "24px",
    borderRadius: "20px",
    background: `linear-gradient(135deg, ${theme.paper} 0%, ${theme.card} 100%)`,
    border: `1px solid ${theme.paperDeep}`,
    marginBottom: "24px",
    boxShadow: "0 4px 16px rgba(30,20,32,0.04)",
  },

  popupPdfHeader: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    marginBottom: "18px",
    flexWrap: "wrap",
  },

  popupPdfIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "50px",
    height: "50px",
    borderRadius: "15px",
    background: "#FEE2E2",
    flexShrink: 0,
  },

  popupPdfTitle: {
    fontSize: "16px",
    fontWeight: 700,
    color: theme.ink,
  },

  popupPdfSubtitle: {
    fontSize: "12px",
    lineHeight: 1.55,
    fontWeight: 600,
    color: theme.textMuted,
    marginTop: "2px",
  },

  pdfPreviewFrame: {
    width: "100%",
    height: "560px",
    overflow: "hidden",
    borderRadius: "16px",
    border: `1px solid ${theme.paperDeep}`,
    background: "#E8E0D4",
    boxShadow: "inset 0 0 0 1px rgba(30,20,32,0.02)",
  },

  pdfIframe: {
    display: "block",
    width: "100%",
    height: "100%",
    border: "0",
    background: "#FFFFFF",
  },

  pdfPreviewNote: {
    margin: "10px 2px 0",
    fontSize: "11px",
    lineHeight: 1.5,
    color: theme.textMuted,
  },

  popupPdfDownloadBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "9px",
    padding: "10px 17px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: 700,
    color: "#92400E",
    background: "#FEF3C7",
    textDecoration: "none",
    boxShadow: "0 8px 20px rgba(185,138,66,0.15)",
    transition: "all 0.3s ease",
    whiteSpace: "nowrap",
  },

};

// Add keyframes for animations
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @keyframes gradientMove {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`;
document.head.appendChild(styleSheet);