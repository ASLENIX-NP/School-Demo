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

/* =========================================================
   THEME — Matches Hero / Stats design language
========================================================= */

const THEME = {
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
};

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

/* =========================================================
   GLOBAL STYLES — fonts + decorative animations
========================================================= */

function AnnouncementStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,500&family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');

      .rr-announce { font-family: 'Inter', system-ui, -apple-system, sans-serif; }
      .rr-announce .rr-serif { font-family: 'Fraunces', Georgia, 'Times New Roman', serif; }
      .rr-announce .rr-mono { font-family: 'Space Grotesk', 'IBM Plex Mono', monospace; }

      .rr-announce button:focus-visible {
        outline: 2px solid ${THEME.gold};
        outline-offset: 3px;
        border-radius: 8px;
      }

      @keyframes rr-a-float { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-8px) rotate(2deg); } }      @keyframes rr-a-pulse { 0%, 100% { opacity: 0.55; } 50% { opacity: 1; } }
      @keyframes rr-a-ring { 0% { transform: scale(0.85); opacity: 0.5; } 100% { transform: scale(1.6); opacity: 0; } }
      @keyframes rr-a-shine { 0% { transform: translateX(-130%) skewX(-14deg); } 100% { transform: translateX(230%) skewX(-14deg); } }
      .rr-a-emblem { animation: rr-a-float 6s ease-in-out infinite; }      .rr-a-pulse { animation: rr-a-pulse 2.4s ease-in-out infinite; }
      .rr-a-ring { animation: rr-a-ring 2.6s ease-out infinite; }
      .rr-a-shine-wrap { position: relative; overflow: hidden; }
      .rr-a-shine {
        position: absolute;
        top: -20%; left: 0;
        width: 34%; height: 140%;
        background: linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.30) 45%, transparent 90%);
        pointer-events: none;
        animation: rr-a-shine 4.5s ease-in-out infinite;
        animation-delay: 1s;
      }

      @media (prefers-reduced-motion: reduce) {
        .rr-announce *, .rr-announce *::before, .rr-announce *::after {
          animation-duration: 0.001ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.001ms !important;
        }
      }
    `}</style>
  );
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

  function goToIndex(index) {
    if (index === currentIndex) return;
    setImageError(false);
    setCurrentIndex(index);
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
  const hasMultiple = announcements.length > 1;

  return (
    <AnimatePresence>
      <div
        className="rr-announce fixed inset-0 z-[999999] flex items-center justify-center p-4 sm:p-6"
        style={{ background: "rgba(15,9,17,0.82)", backdropFilter: "blur(14px)" }}
        role="dialog"
        aria-modal="true"
        aria-label="School announcement"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            handleClose();
          }
        }}
      >
        <AnnouncementStyles />

        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 18, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 280, damping: 26 }}
          className="relative w-full max-w-3xl overflow-hidden rounded-[28px]"
          style={{
            background: THEME.card,
            boxShadow: `0 45px 110px rgba(15,9,17,0.45), 0 0 0 1px ${THEME.paperDeep}`,
          }}
          onMouseDown={(event) => event.stopPropagation()}
        >
          {/* Gold rim accent */}
          <div
            className="pointer-events-none absolute inset-0 rounded-[28px]"
            style={{ boxShadow: `inset 0 0 0 1px ${THEME.gold}30` }}
          />

          {/* CLOSE */}
          <motion.button
            type="button"
            onClick={handleClose}
            whileHover={{ scale: 1.08, rotate: 90 }}
            whileTap={{ scale: 0.94 }}
            className="absolute right-4 top-4 z-50 grid h-11 w-11 place-items-center rounded-full shadow-xl transition-colors cursor-pointer"
            style={{ background: `${THEME.white}F0`, color: THEME.ink }}
            aria-label="Close announcement"
          >
            <X size={20} />
          </motion.button>

          {/* COUNTER */}
          {hasMultiple && (
            <div
              className="absolute left-4 top-4 z-50 inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-black shadow-xl sm:left-5 sm:top-5"
              style={{ background: THEME.ink, color: THEME.white }}
            >
              <Megaphone size={14} style={{ color: THEME.goldSoft }} />
              <span>{currentIndex + 1}</span>
              <span style={{ color: "rgba(255,255,255,0.35)" }}>/</span>
              <span style={{ color: "rgba(255,255,255,0.6)" }}>{announcements.length}</span>
            </div>
          )}

          {/* HEADER */}
          <div
            className="relative overflow-hidden px-6 pb-9 pt-16 sm:px-9"
            style={{ background: THEME.gradInk }}
          >
            {/* Decorative glows */}
            <div
              className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl"
              style={{ background: `${THEME.rose}35` }}
            />
            <div
              className="pointer-events-none absolute -bottom-28 left-1/4 h-64 w-64 rounded-full blur-3xl"
              style={{ background: `${THEME.gold}22` }}
            />

            <div className="relative z-10">
              {/* Badge with pulsing ring */}
              <motion.div
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="relative inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[10px] font-black uppercase tracking-[0.22em]"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: `1px solid ${THEME.gold}40`,
                  color: THEME.goldSoft,
                }}
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span
                    className="rr-a-ring absolute inline-flex h-full w-full rounded-full"
                    style={{ background: THEME.goldSoft }}
                  />
                  <span
                    className="relative inline-flex h-2.5 w-2.5 rounded-full"
                    style={{ background: THEME.goldSoft }}
                  />
                </span>
                <Sparkles size={13} />
                School Announcement
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.08 }}
                className="rr-serif mt-5 max-w-3xl pr-10 text-2xl font-semibold leading-tight tracking-tight text-white sm:text-3xl md:text-[38px]"
              >
                {currentAnnouncement.title || "School Announcement"}
              </motion.h2>

              {dateText && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                  className="rr-mono mt-4 inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-bold"
                  style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.72)" }}
                >
                  <CalendarDays size={15} style={{ color: THEME.goldSoft }} />
                  {dateText}
                </motion.div>
              )}
            </div>

            {/* Bottom edge curve into card */}
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-8"
              style={{
                background: `linear-gradient(180deg, transparent 0%, ${THEME.card} 100%)`,
              }}
            />
          </div>

          {/* IMAGE */}
          {hasImage && (
            <div className="rr-a-shine-wrap relative" style={{ background: THEME.paperDeep }}>
              <div className="rr-a-shine" />
              <img
                src={imageUrl}
                alt={currentAnnouncement.title || "Announcement"}
                className="max-h-[360px] w-full object-cover"
                onError={() => setImageError(true)}
              />
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background: `linear-gradient(180deg, ${THEME.ink}00 65%, ${THEME.ink}18 100%)`,
                }}
              />
            </div>
          )}

          {/* CONTENT */}
          <div className="max-h-[42vh] overflow-y-auto px-6 py-7 sm:px-9 sm:py-8">
            {currentAnnouncement.description ? (
              <p
                className="whitespace-pre-line text-[15px] leading-7"
                style={{ color: THEME.text }}
              >
                {currentAnnouncement.description}
              </p>
            ) : (
              <p className="text-sm leading-6" style={{ color: THEME.textMuted }}>
                No additional details were provided for this announcement.
              </p>
            )}

            {pdfUrl && (
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                style={{ background: THEME.gradInk, color: THEME.white }}
              >
                <FileText size={17} style={{ color: THEME.goldSoft }} />
                View Attached Document
              </a>
            )}

            {/* Progress dots for multiple announcements */}
            {hasMultiple && (
              <div className="mt-6 flex items-center gap-2">
                {announcements.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => goToIndex(index)}
                    aria-label={`Go to announcement ${index + 1}`}
                    className="h-1.5 rounded-full transition-all duration-300 cursor-pointer"
                    style={{
                      width: index === currentIndex ? "26px" : "8px",
                      background: index === currentIndex ? THEME.rose : theme_dotInactive(),
                    }}
                  />
                ))}
              </div>
            )}

            <div
              className="mt-7 flex flex-col gap-4 border-t pt-5 sm:flex-row sm:items-center sm:justify-between"
              style={{ borderColor: THEME.paperDeep }}
            >
              <div className="rr-mono flex items-center gap-2 text-xs font-bold" style={{ color: THEME.textMuted }}>
                <span className="rr-a-pulse h-2 w-2 rounded-full" style={{ background: THEME.moss }} />
                Red Rose Secondary English School
              </div>

              <div className="flex flex-wrap gap-2">
                {hasPrevious && (
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-3 text-sm font-bold shadow-sm transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
                    style={{
                      background: THEME.white,
                      color: THEME.ink,
                      border: `1px solid ${THEME.paperDeep}`,
                    }}
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </button>
                )}

                {hasNext ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl cursor-pointer"
                    style={{ background: THEME.gradRose, color: THEME.white }}
                  >
                    Next Announcement
                    <ChevronRight size={16} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleClose}
                    className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl cursor-pointer"
                    style={{ background: THEME.gradGold, color: THEME.ink }}
                  >
                    Got it
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

/* Small helper kept local to avoid importing rgba utils for one usage */
function theme_dotInactive() {
  return "#E9DCC4";
}