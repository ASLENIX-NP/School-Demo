import { useEffect, useMemo, useRef, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  FileText,
  Megaphone,
  Sparkles,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const GLOBAL_KEY = "__RED_ROSE_ANNOUNCEMENT_POPUP_OWNER__";

function getId(item) {
  return item?.id ?? item?._id ?? item?.announcement_id ?? item?.announcementId ?? null;
}

function getDateValue(item) {
  return item?.created_at ?? item?.createdAt ?? item?.updated_at ?? item?.updatedAt ?? "";
}

function getTime(item) {
  const value = getDateValue(item);
  const time = value ? new Date(value).getTime() : 0;
  return Number.isFinite(time) ? time : 0;
}

function getPopupOrder(item) {
  const value =
    item?.popup_order ??
    item?.popupOrder ??
    item?.display_order ??
    item?.displayOrder;

  const number = Number(value);
  return Number.isFinite(number) ? number : 999999;
}

function getAnnouncementList(result) {
  if (Array.isArray(result)) return result;
  if (Array.isArray(result?.data)) return result.data;
  if (Array.isArray(result?.data?.data)) return result.data.data;
  if (Array.isArray(result?.announcements)) return result.announcements;
  if (Array.isArray(result?.data?.announcements)) return result.data.announcements;
  return [];
}

function isEnabled(value) {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();

    if (["false", "0", "no", "off", "inactive", "hidden"].includes(normalized)) {
      return false;
    }

    if (["true", "1", "yes", "on", "active", "visible"].includes(normalized)) {
      return true;
    }
  }

  return Boolean(value);
}

function shouldShowOnHomepage(item) {
  const active =
    item?.active === undefined || item?.active === null
      ? true
      : isEnabled(item.active);

  const visible =
    item?.visible === undefined || item?.visible === null
      ? true
      : isEnabled(item.visible);

  const homepage =
    item?.show_on_homepage !== undefined && item?.show_on_homepage !== null
      ? isEnabled(item.show_on_homepage)
      : item?.showOnHomepage !== undefined && item?.showOnHomepage !== null
      ? isEnabled(item.showOnHomepage)
      : true;

  return active && visible && homepage;
}

/*
 * This is deliberately stricter than ID-only de-duplication.
 * A backend can accidentally return the same announcement twice with two
 * different IDs. In that case title + description + image identify the same
 * visible announcement.
 */
function dedupeAnnouncements(list = []) {
  const seenIds = new Set();
  const seenContent = new Set();

  return list.filter((item) => {
    const id = getId(item);

    if (id !== null && id !== undefined && String(id).trim() !== "") {
      const idKey = String(id);
      if (seenIds.has(idKey)) return false;
      seenIds.add(idKey);
    }

    const title = String(item?.title || "").trim().toLowerCase();
    const description = String(item?.description || "").trim().toLowerCase();
    const image = String(
      item?.image_url ||
        item?.imageUrl ||
        item?.image ||
        item?.banner_url ||
        item?.bannerUrl ||
        ""
    ).trim();

    const contentKey = `${title}|||${description}|||${image}`;

    if (title || description || image) {
      if (seenContent.has(contentKey)) return false;
      seenContent.add(contentKey);
    }

    return true;
  });
}

function sortAnnouncements(list = []) {
  return [...list].sort((a, b) => {
    const orderA = getPopupOrder(a);
    const orderB = getPopupOrder(b);

    if (orderA !== orderB) return orderA - orderB;
    return getTime(b) - getTime(a);
  });
}

function getImageUrl(item) {
  return (
    item?.image_url ||
    item?.imageUrl ||
    item?.image ||
    item?.banner_url ||
    item?.bannerUrl ||
    ""
  );
}

function getPdfUrl(item) {
  return (
    item?.pdf_url ||
    item?.pdfUrl ||
    item?.file_url ||
    item?.fileUrl ||
    ""
  );
}

function formatDate(item) {
  const value = getDateValue(item);
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function claimPopupOwner() {
  if (typeof window === "undefined") return null;

  const current = window[GLOBAL_KEY];

  if (current) {
    return null;
  }

  const token = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  window[GLOBAL_KEY] = token;

  return token;
}

function releasePopupOwner(token) {
  if (typeof window === "undefined") return;

  if (window[GLOBAL_KEY] === token) {
    delete window[GLOBAL_KEY];
  }
}

export default function HomeAnnouncementPopup() {
  const [announcements, setAnnouncements] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const ownerTokenRef = useRef(null);
  const openTimerRef = useRef(null);
  const mountedRef = useRef(false);

  const currentAnnouncement = useMemo(
    () => announcements[currentIndex] || null,
    [announcements, currentIndex]
  );

  /*
   * LOAD ONCE
   *
   * Important:
   * We do not use localStorage/sessionStorage to control the popup.
   * The popup can therefore show normally after a page refresh, while the
   * module-level/window-level owner prevents duplicate instances.
   */
  useEffect(() => {
    mountedRef.current = true;

    const owner = claimPopupOwner();

    if (!owner) {
      mountedRef.current = false;
      return () => {};
    }

    ownerTokenRef.current = owner;

    let cancelled = false;

    async function loadAnnouncements() {
      try {
        const response = await fetch(`${API_URL}/api/announcements`, {
          method: "GET",
          headers: { Accept: "application/json" },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const result = await response.json();

        if (cancelled || !mountedRef.current) return;

        const all = getAnnouncementList(result);

        const filtered = all.filter(shouldShowOnHomepage);

        const clean = dedupeAnnouncements(filtered);

        const sorted = sortAnnouncements(clean);

        if (!sorted.length) {
          setAnnouncements([]);
          setOpen(false);
          return;
        }

        setAnnouncements(sorted);
        setCurrentIndex(0);
        setImageError(false);

        /*
         * StrictMode-safe timer.
         * Cleanup always clears the timer before the development remount.
         */
        openTimerRef.current = window.setTimeout(() => {
          if (!cancelled && mountedRef.current) {
            setOpen(true);
          }
        }, 450);
      } catch (error) {
        console.error("Homepage announcement popup error:", error);

        if (!cancelled && mountedRef.current) {
          setAnnouncements([]);
          setOpen(false);
        }
      }
    }

    loadAnnouncements();

    return () => {
      cancelled = true;
      mountedRef.current = false;

      if (openTimerRef.current) {
        window.clearTimeout(openTimerRef.current);
        openTimerRef.current = null;
      }

      releasePopupOwner(ownerTokenRef.current);
      ownerTokenRef.current = null;
    };
  }, []);

  /*
   * Body scroll lock while the popup is open.
   */
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  /*
   * Keyboard navigation.
   */
  useEffect(() => {
    if (!open) return;

    function onKeyDown(event) {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }

      if (event.key === "ArrowRight") {
        setCurrentIndex((previous) => {
          if (previous < announcements.length - 1) {
            setImageError(false);
            return previous + 1;
          }
          return previous;
        });
      }

      if (event.key === "ArrowLeft") {
        setCurrentIndex((previous) => {
          if (previous > 0) {
            setImageError(false);
            return previous - 1;
          }
          return previous;
        });
      }
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, announcements.length]);

  function handleClose() {
    setOpen(false);
  }

  function handleNext() {
    setCurrentIndex((previous) => {
      if (previous < announcements.length - 1) {
        setImageError(false);
        return previous + 1;
      }

      setOpen(false);
      return previous;
    });
  }

  function handlePrevious() {
    setCurrentIndex((previous) => {
      if (previous > 0) {
        setImageError(false);
        return previous - 1;
      }

      return previous;
    });
  }

  if (!open || !currentAnnouncement) {
    return null;
  }

  const imageUrl = getImageUrl(currentAnnouncement);
  const pdfUrl = getPdfUrl(currentAnnouncement);
  const dateText = formatDate(currentAnnouncement);

  const hasNext = currentIndex < announcements.length - 1;
  const hasPrevious = currentIndex > 0;
  const hasImage = Boolean(imageUrl) && !imageError;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[999999] flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-md sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-label="School announcement"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            handleClose();
          }
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 18, scale: 0.98 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-3xl overflow-hidden rounded-[30px] bg-white shadow-[0_35px_100px_rgba(0,0,0,.32)]"
          onMouseDown={(event) => event.stopPropagation()}
        >
          {/* CLOSE */}
          <button
            type="button"
            onClick={handleClose}
            className="absolute right-4 top-4 z-50 grid h-11 w-11 place-items-center rounded-full bg-white/95 text-slate-700 shadow-xl transition hover:scale-105 hover:bg-white"
            aria-label="Close announcement"
          >
            <X size={20} />
          </button>

          {/* COUNTER */}
          {announcements.length > 1 && (
            <div className="absolute left-4 top-4 z-50 inline-flex items-center gap-2 rounded-full bg-slate-950 px-3.5 py-2 text-xs font-black text-white shadow-xl sm:left-5 sm:top-5">
              <Megaphone size={14} className="text-amber-300" />
              <span>{currentIndex + 1}</span>
              <span className="text-white/40">/</span>
              <span className="text-white/60">{announcements.length}</span>
            </div>
          )}

          {/* HEADER */}
          <div className="relative overflow-hidden bg-slate-950 px-6 pb-8 pt-16 sm:px-9">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-rose-500/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-amber-400/10 blur-3xl" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-white/10 px-3.5 py-2 text-[10px] font-black uppercase tracking-[.18em] text-amber-300">
                <Sparkles size={14} />
                School Announcement
              </div>

              <h2 className="mt-5 max-w-3xl pr-10 text-2xl font-black leading-tight tracking-tight text-white sm:text-3xl md:text-[38px]">
                {currentAnnouncement.title || "School Announcement"}
              </h2>

              {dateText && (
                <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs font-semibold text-white/70">
                  <CalendarDays size={15} className="text-amber-300" />
                  {dateText}
                </div>
              )}
            </div>
          </div>

          {/* IMAGE */}
          {hasImage && (
            <div className="relative bg-slate-100">
              <img
                src={imageUrl}
                alt={currentAnnouncement.title || "Announcement"}
                className="max-h-[360px] w-full object-cover"
                onError={() => setImageError(true)}
              />
            </div>
          )}

          {/* CONTENT */}
          <div className="max-h-[42vh] overflow-y-auto px-6 py-7 sm:px-9 sm:py-8">
            {currentAnnouncement.description ? (
              <p className="whitespace-pre-line text-[15px] leading-7 text-slate-600">
                {currentAnnouncement.description}
              </p>
            ) : (
              <p className="text-sm leading-6 text-slate-400">
                No additional details were provided for this announcement.
              </p>
            )}

            {pdfUrl && (
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-black text-white transition hover:bg-slate-800"
              >
                <FileText size={17} />
                View Attached Document
              </a>
            )}

            <div className="mt-7 flex flex-col gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Red Rose Secondary English School
              </div>

              <div className="flex flex-wrap gap-2">
                {hasPrevious && (
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50"
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </button>
                )}

                {hasNext ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-lg transition hover:bg-slate-800"
                  >
                    Next Announcement
                    <ChevronRight size={16} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleClose}
                    className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-black text-slate-950 shadow-lg transition hover:-translate-y-0.5"
                    style={{
                      background:
                        "linear-gradient(135deg,#FACC15,#E7CE9C,#67C7E8)",
                    }}
                  >
                    Close
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}