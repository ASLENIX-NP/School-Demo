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
  ExternalLink,
  FileText,
  Megaphone,
  Pin,
  Search,
  Sparkles,
  X,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;
const REQUEST_TIMEOUT_MS = 12000;

export const defaultNoticeSettings = {
  page_badge: "Official School Updates",
  page_title: "Stay Connected with School News",
  page_description:
    "Important notices, announcements, examinations, holidays, admissions and school updates — all in one place.",
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

  if (value.includes("exam")) return "#C2414B";
  if (value.includes("admission")) return "#B7791F";
  if (value.includes("holiday")) return "#2F7D5B";
  if (value.includes("event")) return "#2F6F8F";
  if (value.includes("result")) return "#7056A3";
  if (value.includes("meeting")) return "#8B5E34";
  if (value.includes("general knowledge")) return "#39736A";

  return "#1F6B4F";
}

function EditBadge({
  onClick,
  children = "Edit",
}) {
  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        onClick?.();
      }}
      className="absolute right-4 top-4 z-30 rounded-full bg-white px-3 py-2 text-xs font-black text-slate-800 shadow-lg ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-xl"
    >
      ✎ {children}
    </button>
  );
}

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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.45,
        delay: Math.min(index * 0.05, 0.25),
      }}
      whileHover={{ y: -6 }}
      className="group relative"
    >
      <div
        className="relative h-full overflow-hidden rounded-[30px] bg-white p-6 sm:p-7"
        style={{
          border: `1px solid ${color}30`,
          boxShadow:
            "0 20px 55px rgba(15,23,42,.08), 0 4px 14px rgba(15,23,42,.04)",
        }}
        onClick={() => {
          if (!editMode) onClick?.();
        }}
      >
        <div
          className="absolute inset-x-0 top-0 h-1.5"
          style={{
            background:
              `linear-gradient(90deg, ${color} 0%, #D9A441 52%, #4E9AA8 100%)`,
          }}
        />

        <div
          className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full blur-3xl"
          style={{ background: `${color}18` }}
        />

        <div className="pointer-events-none absolute -bottom-20 -left-12 h-36 w-36 rounded-full bg-emerald-100/50 blur-3xl" />

        {editMode && (
          <div className="absolute right-4 top-4 z-20 flex gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEditTarget?.({ type: "notice", id: notice.id });
              }}
              className="rounded-xl bg-slate-950 px-3 py-2 text-xs font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-800"
            >
              Edit
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteTarget?.({ type: "notice", id: notice.id });
              }}
              className="rounded-xl bg-red-50 px-3 py-2 text-xs font-black text-red-600 shadow-lg transition hover:-translate-y-0.5 hover:bg-red-100"
            >
              Delete
            </button>
          </div>
        )}

        <div className="relative z-10 flex items-start justify-between gap-4">
          <div className="flex flex-wrap gap-2 pr-20">
            <span
              className="rounded-full border px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[.14em]"
              style={{
                background: `${color}12`,
                borderColor: `${color}25`,
                color,
              }}
            >
              {notice.category || "General"}
            </span>

            {notice.pinned && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[.08em] text-amber-700">
                <Pin size={12} />
                Important
              </span>
            )}

            {hasPdf && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[.08em] text-rose-700">
                <FileText size={12} />
                PDF
              </span>
            )}
          </div>

          <div className="shrink-0 rounded-2xl bg-slate-50 px-3 py-2 text-right text-[11px] font-bold text-slate-400">
            <CalendarDays
              size={15}
              className="ml-auto mb-1 text-emerald-600"
            />
            {formatNoticeDate(notice.notice_date)}
          </div>
        </div>

        <h3 className="relative z-10 mt-6 max-w-2xl text-[22px] font-black leading-tight tracking-[-.04em] text-slate-950 sm:text-[25px]">
          {notice.title || "School Notice"}
        </h3>

        <p className="relative z-10 mt-3 line-clamp-3 whitespace-pre-line text-sm leading-7 text-slate-500 sm:text-[15px]">
          {notice.description || "Click to read the complete notice."}
        </p>

        <div className="relative z-10 mt-7 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
          {!editMode ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClick?.();
              }}
              className="group/read inline-flex w-fit items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-black transition-all hover:-translate-y-0.5"
              style={{
                background: `${color}0D`,
                color,
              }}
            >
              Read full notice
              <ArrowUpRight
                size={16}
                className="transition-transform group-hover/read:translate-x-0.5 group-hover/read:-translate-y-0.5"
              />
            </button>
          ) : (
            <span className="text-xs font-bold text-slate-400">
              Admin editing mode
            </span>
          )}

          {hasPdf && !editMode && (
            <a
              href={notice.pdf_url || notice.file_url}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex w-fit items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-black text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-rose-700 hover:shadow-lg"
            >
              <FileText size={14} />
              View PDF
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export default function Notices({
  editMode = false,
  noticesOverride = null,
  announcementsOverride = null,
  settingsOverride = null,
  loadingOverride = false,
  onEditTarget = () => {},
  onDeleteTarget = () => {},
  onAddNotice = () => {},
  onViewAllNotices = () => {},
}) {
  const [notices, setNotices] = useState([]);
  const [announcements, setAnnouncements] =
    useState([]);

  const [settings, setSettings] = useState(
    defaultNoticeSettings
  );

  const [loading, setLoading] = useState(
    !editMode && !loadingOverride
  );

  const [query, setQuery] = useState("");
  const [category, setCategory] =
    useState("All");

  const [pdfOnly, setPdfOnly] =
    useState(false);

  const [selectedNotice, setSelectedNotice] =
    useState(null);

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

      setAnnouncements(
        announcementsOverride || []
      );

      setSettings({
        ...defaultNoticeSettings,
        ...(settingsOverride || {}),
      });

      setLoading(Boolean(loadingOverride));

      return;
    }

    let alive = true;

    async function load() {
      setLoading(true);

      try {
        const [
          noticeResult,
          announcementResult,
          settingsResult,
        ] = await Promise.all([
          fetchJson(
            `${API_URL}/api/notices`
          ),

          fetchJson(
            `${API_URL}/api/announcements`
          ),

          fetchJson(
            `${API_URL}/api/notice-settings`
          ).catch(() => null),
        ]);

        if (!alive) return;

        const rawNotices =
          Array.isArray(noticeResult)
            ? noticeResult
            : noticeResult?.data || [];

        const rawAnnouncements =
          Array.isArray(
            announcementResult
          )
            ? announcementResult
            : announcementResult?.data || [];

        setNotices(
          sortNoticesNewestFirst(
            rawNotices.map(
              normalizeNotice
            )
          )
        );

        setAnnouncements(
          rawAnnouncements
            .filter(
              (item) =>
                item?.active !== false &&
                item?.visible !== false
            )
            .sort((a, b) => {
              if (
                Boolean(
                  a.show_on_homepage
                ) !==
                Boolean(
                  b.show_on_homepage
                )
              ) {
                return a.show_on_homepage
                  ? -1
                  : 1;
              }

              return (
                new Date(
                  b.created_at ||
                    b.createdAt ||
                    0
                ).getTime() -
                new Date(
                  a.created_at ||
                    a.createdAt ||
                    0
                ).getTime()
              );
            })
        );

        setSettings({
          ...defaultNoticeSettings,
          ...(settingsResult?.data ||
            settingsResult ||
            {}),
        });
      } catch (error) {
        console.error(
          "Notice page load error:",
          error
        );
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      alive = false;
    };
  }, [
    editMode,
    noticesOverride,
    announcementsOverride,
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
  // PAGE
  // ==========================================================

  return (
    <main
      className="min-h-screen overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at 8% 8%, rgba(45,106,79,.12), transparent 25%), radial-gradient(circle at 92% 20%, rgba(217,164,65,.13), transparent 28%), linear-gradient(180deg,#F8FBF9 0%,#EEF5F1 48%,#F7F4EE 100%)",
      }}
    >
      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative px-4 pb-14 pt-24 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-[8%] top-20 h-40 w-40 rounded-full bg-emerald-300/20 blur-3xl" />

          <div className="absolute right-[8%] top-10 h-56 w-56 rounded-full bg-amber-200/30 blur-3xl" />

          <div
            className="absolute inset-0 opacity-[.22]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(15,23,42,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(15,23,42,.04) 1px,transparent 1px)",
              backgroundSize:
                "42px 42px",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl">
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="relative overflow-hidden rounded-[40px] p-7 text-white shadow-2xl sm:p-10 lg:p-14"
            style={{
              background:
                "linear-gradient(135deg,#173E2D 0%,#2D6A4F 48%,#315D55 100%)",

              boxShadow:
                "0 30px 80px rgba(23,62,45,.28), inset 0 1px rgba(255,255,255,.12)",

              transformStyle:
                "preserve-3d",
            }}
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

            <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />

            <div className="absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-amber-300/10 blur-3xl" />

            <div className="relative max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[.16em] text-emerald-100 backdrop-blur">
                <Bell size={14} />

                {settings.page_badge}
              </span>

              <h1 className="mt-6 text-4xl font-black leading-[.98] tracking-[-.055em] sm:text-6xl lg:text-7xl">
                {settings.page_title}
              </h1>

              <p className="mt-6 max-w-2xl text-sm leading-7 text-white/75 sm:text-lg">
                {settings.page_description}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
                  <div className="text-2xl font-black">
                    {notices.length}
                  </div>

                  <div className="text-xs font-bold text-white/65">
                    Official notices
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
                  <div className="text-2xl font-black">
                    {importantCount}
                  </div>

                  <div className="text-xs font-bold text-white/65">
                    Important
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
                  <div className="text-2xl font-black">
                    {pdfCount}
                  </div>

                  <div className="text-xs font-bold text-white/65">
                    Documents
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          ANNOUNCEMENTS
      ====================================================== */}

      {announcements.length > 0 && (
        <section className="relative px-4 pb-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-black text-rose-700 shadow-sm">
                  <Megaphone size={14} />
                  Announcements
                </span>

                <h2 className="mt-3 text-2xl font-black tracking-[-.04em] text-slate-950 sm:text-3xl">
                  Latest school announcements
                </h2>
              </div>

              <span className="hidden rounded-full bg-white px-4 py-2 text-xs font-black text-slate-500 shadow-sm ring-1 ring-slate-200 sm:block">
                {announcements.length} active
              </span>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              {announcements
                .slice(0, 4)
                .map(
                  (
                    announcement,
                    index
                  ) => (
                    <motion.article
                      key={
                        announcement.id ||
                        index
                      }
                      initial={{
                        opacity: 0,
                        y: 25,
                      }}
                      whileInView={{
                        opacity: 1,
                        y: 0,
                      }}
                      viewport={{
                        once: true,
                      }}
                      transition={{
                        delay:
                          index * 0.06,
                      }}
                      whileHover={{
                        y: -5,
                      }}
                      className="relative overflow-hidden rounded-[28px] bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,.08)] ring-1 ring-slate-200/70"
                    >
                      {announcement.image_url && (
                        <div className="mb-5 h-48 overflow-hidden rounded-2xl bg-slate-100">
                          <img
                            src={
                              announcement.image_url
                            }
                            alt={
                              announcement.title ||
                              "Announcement"
                            }
                            className="h-full w-full object-cover transition duration-700 hover:scale-105"
                          />
                        </div>
                      )}

                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                          <Megaphone
                            size={22}
                          />
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[11px] font-black uppercase tracking-[.15em] text-slate-400">
                              School Announcement
                            </span>

                            {announcement.show_on_homepage && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-black text-amber-700">
                                <Pin size={11} />
                                Home
                              </span>
                            )}
                          </div>

                          <h3 className="mt-2 text-xl font-black text-slate-950">
                            {announcement.title ||
                              "School Announcement"}
                          </h3>

                          {announcement.description && (
                            <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-500">
                              {
                                announcement.description
                              }
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.article>
                  )
                )}
            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          SEARCH + FILTER
      ====================================================== */}

      <section className="relative px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-7 rounded-[30px] bg-white/80 p-4 shadow-[0_15px_45px_rgba(15,23,42,.06)] ring-1 ring-slate-200/70 backdrop-blur">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative flex-1">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />

                <input
                  value={query}
                  onChange={(e) =>
                    setQuery(
                      e.target.value
                    )
                  }
                  placeholder="Search notices..."
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm font-semibold outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {categories.map(
                  (item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() =>
                        setCategory(item)
                      }
                      className="rounded-xl px-4 py-2.5 text-xs font-black transition hover:-translate-y-0.5"
                      style={{
                        background:
                          category === item
                            ? "#173E2D"
                            : "#F4F7F5",

                        color:
                          category === item
                            ? "#FFFFFF"
                            : "#64748B",
                      }}
                    >
                      {item}
                    </button>
                  )
                )}

                <button
                  type="button"
                  onClick={() =>
                    setPdfOnly(
                      (value) => !value
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 px-4 py-2.5 text-xs font-black transition hover:-translate-y-0.5 hover:shadow-sm"
                  style={{
                    background: pdfOnly
                      ? "#DFF5EE"
                      : "#F4F7F5",

                    color: pdfOnly
                      ? "#2D6A4F"
                      : "#64748B",
                  }}
                >
                  <FileText size={14} />
                  PDF
                </button>
              </div>
            </div>
          </div>

          {/* =================================================
              ADMIN CONTROLS
          ================================================== */}

          {editMode && (
            <div className="mb-7 flex flex-wrap gap-3 rounded-[24px] border border-emerald-200 bg-emerald-50 p-4">
              <button
                type="button"
                onClick={onAddNotice}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-emerald-800"
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
                className="rounded-xl bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                Edit Info Card
              </button>

              <button
                type="button"
                onClick={onViewAllNotices}
                className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-black text-emerald-800 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-100 hover:shadow-md"
              >
                <ArrowUpRight
                  size={16}
                />
                Manage All Notices
              </button>
            </div>
          )}

          {/* =================================================
              IMPORTANT NOTICES
          ================================================== */}

          {pinned.length > 0 && (
            <div className="mb-10">
              <div className="mb-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-amber-200" />

                <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-xs font-black text-amber-700">
                  <Pin size={14} />
                  Important Notices
                </span>

                <div className="h-px flex-1 bg-amber-200" />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {pinned.map(
                  (notice, index) => (
                    <NoticeCard
                      key={
                        notice.id ||
                        index
                      }
                      notice={notice}
                      index={index}
                      editMode={
                        editMode
                      }
                      onEditTarget={
                        onEditTarget
                      }
                      onDeleteTarget={
                        onDeleteTarget
                      }
                      onClick={() =>
                        setSelectedNotice(
                          notice
                        )
                      }
                    />
                  )
                )}
              </div>
            </div>
          )}

          {/* =================================================
              RECENT UPDATES
          ================================================== */}

          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <span className="text-xs font-black uppercase tracking-[.18em] text-emerald-700">
                Official notices
              </span>

              <h2 className="mt-2 text-3xl font-black tracking-[-.05em] text-slate-950">
                Recent Updates
              </h2>
            </div>

            <span className="rounded-full bg-white px-4 py-2 text-xs font-black text-slate-500 shadow-sm ring-1 ring-slate-200">
              {filteredNotices.length}{" "}
              shown
            </span>
          </div>

          {/* =================================================
              LOADING
          ================================================== */}

          {loading ? (
            <div className="rounded-[30px] bg-white p-16 text-center shadow-xl">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />

              <p className="mt-4 font-bold text-slate-500">
                Loading notices...
              </p>
            </div>
          ) : regular.length ===
            0 ? (
            <div className="rounded-[30px] border border-dashed border-slate-300 bg-white/80 p-16 text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-slate-300" />

              <h3 className="mt-4 text-2xl font-black text-slate-900">
                No notices found
              </h3>

              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
                New school notices will appear here once they are added from the admin panel.
              </p>

              {editMode && (
                <button
                  type="button"
                  onClick={
                    onAddNotice
                  }
                  className="mt-6 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-black text-white transition hover:bg-emerald-800"
                >
                  Add First Notice
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-5 lg:grid-cols-2">
              {regular.map(
                (notice, index) => (
                  <NoticeCard
                    key={
                      notice.id ||
                      index
                    }
                    notice={notice}
                    index={index}
                    editMode={
                      editMode
                    }
                    onEditTarget={
                      onEditTarget
                    }
                    onDeleteTarget={
                      onDeleteTarget
                    }
                    onClick={() =>
                      setSelectedNotice(
                        notice
                      )
                    }
                  />
                )
              )}
            </div>
          )}

          {/* =================================================
              FOOTER INFO
          ================================================== */}

          {!editMode && (
            <div
              className="relative mt-12 overflow-hidden rounded-[30px] p-7 text-white shadow-2xl sm:p-9"
              style={{
                background:
                  "linear-gradient(135deg,#173E2D,#2D6A4F 55%,#4E9AA8)",
              }}
            >
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />

              <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
                <div>
                  <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[.15em] text-emerald-100">
                    <Sparkles size={14} />
                    Stay updated
                  </span>

                  <h3 className="mt-2 text-2xl font-black">
                    {settings.sidebar_title}
                  </h3>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">
                    {
                      settings.sidebar_description
                    }
                  </p>
                </div>

                <Link
                  to={
                    settings.sidebar_button_link ||
                    "/calendar"
                  }
                  className="group inline-flex shrink-0 items-center justify-center gap-3 rounded-2xl bg-[#F4C95D] px-6 py-3.5 text-sm font-black text-[#173E2D] shadow-[0_12px_30px_rgba(244,201,93,.28)] ring-1 ring-[#FFE6A3] transition-all duration-200 hover:-translate-y-1 hover:bg-[#FFD66F] hover:shadow-[0_16px_35px_rgba(244,201,93,.38)]"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/80 text-[#173E2D]">
                    <CalendarDays size={17} />
                  </span>

                  <span>
                    {settings.sidebar_button_text ||
                      "View Calendar"}
                  </span>

                  <ChevronRight
                    size={17}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          NOTICE POPUP
      ====================================================== */}

      <AnimatePresence>
        {selectedNotice &&
          !editMode && (
            <motion.div
              className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              onClick={() =>
                setSelectedNotice(
                  null
                )
              }
            >
              <motion.div
                initial={{
                  opacity: 0,
                  y: 25,
                  scale: 0.94,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  y: 15,
                  scale: 0.96,
                }}
                className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[32px] bg-white shadow-2xl"
                onClick={(e) =>
                  e.stopPropagation()
                }
              >
                {/* POPUP TOP LINE */}
                <div
                  className="h-2"
                  style={{
                    background:
                      "linear-gradient(90deg,#2D6A4F,#D9A441,#4E9AA8)",
                  }}
                />

                <div className="p-6 sm:p-9">
                  {/* CLOSE */}
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedNotice(
                        null
                      )
                    }
                    className="float-right rounded-full bg-slate-100 p-3 text-slate-500 transition-all hover:rotate-90 hover:bg-red-50 hover:text-red-600"
                  >
                    <X size={18} />
                  </button>

                  {/* CATEGORY */}
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700">
                      {selectedNotice.category ||
                        "Notice"}
                    </span>

                    {selectedNotice.pinned && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-black text-amber-700">
                        <Pin size={12} />
                        Important
                      </span>
                    )}
                  </div>

                  {/* TITLE */}
                  <h2 className="mt-5 text-3xl font-black tracking-[-.05em] text-slate-950 sm:text-5xl">
                    {
                      selectedNotice.title
                    }
                  </h2>

                  {/* DATE */}
                  <div className="mt-4 flex items-center gap-2 text-sm font-bold text-slate-400">
                    <CalendarDays
                      size={16}
                    />

                    {formatNoticeDate(
                      selectedNotice.notice_date
                    )}
                  </div>

                  {/* DESCRIPTION */}
                  {selectedNotice.description && (
                    <p className="mt-7 whitespace-pre-line text-base leading-8 text-slate-600">
                      {
                        selectedNotice.description
                      }
                    </p>
                  )}

                  {/* =================================================
                      PDF SECTION
                  ================================================== */}

                  {(selectedNotice.pdf_url ||
                    selectedNotice.file_url) && (
                    <div className="mt-8 overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50/80 via-white to-amber-50/60 p-5 shadow-sm sm:p-6">
                      {/* PDF HEADER */}
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600 shadow-sm">
                          <FileText
                            size={22}
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="font-black text-slate-900">
                            Attached document
                          </div>

                          <div className="truncate text-xs font-semibold text-slate-400">
                            Official school notice PDF
                          </div>
                        </div>
                      </div>

                      {/* BUTTONS */}
                      <div className="mt-5 flex flex-wrap gap-3">
                        {/* VIEW DOCUMENT */}
                        <a
                          href={
                            selectedNotice.pdf_url ||
                            selectedNotice.file_url
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-black text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-800 hover:shadow-lg"
                        >
                          <ExternalLink
                            size={15}
                          />
                          View Document
                        </a>

                        {/* DOWNLOAD */}
                        <a
                          href={
                            selectedNotice.pdf_url ||
                            selectedNotice.file_url
                          }
                          download
                          className="inline-flex items-center gap-2 rounded-xl border border-amber-300 bg-[#FFF7DD] px-5 py-3 text-sm font-black text-amber-900 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#FFEFB5] hover:shadow-md"
                        >
                          <Download
                            size={15}
                          />
                          Download
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
      </AnimatePresence>
    </main>
  );
}