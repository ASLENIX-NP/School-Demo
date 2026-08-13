import { useEffect, useState } from "react";
import {
  X,
  Megaphone,
  CalendarDays,
  ArrowRight,
  Sparkles,
  ChevronRight,
  ExternalLink,
  FileText,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

/* =========================================================
   HELPERS
========================================================= */

function isEnabled(value) {
  if (value === true || value === 1) return true;

  if (value === false || value === 0) return false;

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();

    return (
      normalized === "true" ||
      normalized === "1" ||
      normalized === "yes" ||
      normalized === "active"
    );
  }

  return false;
}

function getImageUrl(item) {
  return (
    item?.image_url ||
    item?.imageUrl ||
    item?.image ||
    item?.photo_url ||
    item?.photoUrl ||
    ""
  );
}

function getPdfUrl(item) {
  return (
    item?.pdf_url ||
    item?.pdfUrl ||
    item?.file_url ||
    item?.fileUrl ||
    item?.document_url ||
    item?.documentUrl ||
    item?.attachment_url ||
    item?.attachmentUrl ||
    ""
  );
}

function getDateValue(item) {
  return (
    item?.created_at ||
    item?.createdAt ||
    item?.updated_at ||
    item?.updatedAt ||
    item?.date ||
    item?.publish_date ||
    item?.publishDate ||
    ""
  );
}

function formatDate(item) {
  const value = getDateValue(item);

  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getTime(item) {
  const value = getDateValue(item);

  if (!value) {
    return 0;
  }

  const time = new Date(value).getTime();

  return Number.isFinite(time) ? time : 0;
}

function getPopupOrder(item) {
  const value =
    item?.popup_order ??
    item?.popupOrder ??
    item?.display_order ??
    item?.displayOrder ??
    999999;

  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 999999;
}

function sortAnnouncements(list) {
  return [...list].sort((a, b) => {
    const orderA = getPopupOrder(a);
    const orderB = getPopupOrder(b);

    if (orderA !== orderB) {
      return orderA - orderB;
    }

    return getTime(b) - getTime(a);
  });
}

function getAnnouncementList(result) {
  if (Array.isArray(result)) {
    return result;
  }

  if (Array.isArray(result?.data)) {
    return result.data;
  }

  if (Array.isArray(result?.data?.data)) {
    return result.data.data;
  }

  if (Array.isArray(result?.announcements)) {
    return result.announcements;
  }

  if (Array.isArray(result?.data?.announcements)) {
    return result.data.announcements;
  }

  return [];
}

function getAnnouncementId(item, index) {
  return (
    item?.id ||
    item?._id ||
    item?.announcement_id ||
    item?.announcementId ||
    `${item?.title || "announcement"}-${index}`
  );
}

/* =========================================================
   HOMEPAGE FILTER
========================================================= */

function shouldShowOnHomepage(item) {
  const active =
    item?.active === undefined ||
    item?.active === null
      ? true
      : isEnabled(item.active);

  const visible =
    item?.visible === undefined ||
    item?.visible === null
      ? true
      : isEnabled(item.visible);

  const homepage =
    item?.show_on_homepage !== undefined &&
    item?.show_on_homepage !== null
      ? isEnabled(item.show_on_homepage)
      : item?.showOnHomepage !== undefined &&
        item?.showOnHomepage !== null
      ? isEnabled(item.showOnHomepage)
      : true;

  return active && visible && homepage;
}

/* =========================================================
   COMPONENT
========================================================= */

export default function HomeAnnouncementPopup() {
  const [announcements, setAnnouncements] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  /* =======================================================
     LOAD ANNOUNCEMENTS
  ======================================================= */

  useEffect(() => {
    let cancelled = false;

    async function loadAnnouncements() {
      try {
        const endpoint = `${API_URL}/api/announcements`;

        console.log(
          "[HomeAnnouncementPopup] Loading:",
          endpoint
        );

        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(
            `HTTP ${response.status}`
          );
        }

        const result = await response.json();

        console.log(
          "[HomeAnnouncementPopup] API response:",
          result
        );

        if (cancelled) {
          return;
        }

        const allAnnouncements =
          getAnnouncementList(result);

        console.log(
          "[HomeAnnouncementPopup] All announcements:",
          allAnnouncements
        );

        const homepageAnnouncements =
          allAnnouncements.filter(
            shouldShowOnHomepage
          );

        console.log(
          "[HomeAnnouncementPopup] Homepage announcements:",
          homepageAnnouncements
        );

        if (homepageAnnouncements.length === 0) {
          console.log(
            "[HomeAnnouncementPopup] No homepage announcements."
          );

          setAnnouncements([]);
          setOpen(false);

          return;
        }

        const sortedAnnouncements =
          sortAnnouncements(
            homepageAnnouncements
          );

        setAnnouncements(sortedAnnouncements);
        setCurrentIndex(0);
        setImageError(false);

        /*
         * Open popup after a small delay.
         * No localStorage.
         * No sessionStorage.
         * No global dismissed variable.
         */

        setTimeout(() => {
          if (!cancelled) {
            setOpen(true);
          }
        }, 400);
      } catch (error) {
        console.error(
          "[HomeAnnouncementPopup] Failed:",
          error
        );

        if (!cancelled) {
          setAnnouncements([]);
          setOpen(false);
        }
      }
    }

    loadAnnouncements();

    return () => {
      cancelled = true;
    };
  }, []);

  /* =======================================================
     LOCK BODY SCROLL
  ======================================================= */

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [open]);

  /* =======================================================
     CLOSE
  ======================================================= */

  function handleClose() {
    setOpen(false);
  }

  /* =======================================================
     NEXT
  ======================================================= */

  function handleNext() {
    if (
      currentIndex <
      announcements.length - 1
    ) {
      setCurrentIndex(
        (previous) => previous + 1
      );

      setImageError(false);
    } else {
      setOpen(false);
    }
  }

  /* =======================================================
     PREVIOUS
  ======================================================= */

  function handlePrevious() {
    if (currentIndex > 0) {
      setCurrentIndex(
        (previous) => previous - 1
      );

      setImageError(false);
    }
  }

  /* =======================================================
     KEYBOARD
  ======================================================= */

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        handleClose();
      }

      if (
        event.key === "ArrowRight" &&
        currentIndex <
          announcements.length - 1
      ) {
        handleNext();
      }

      if (
        event.key === "ArrowLeft" &&
        currentIndex > 0
      ) {
        handlePrevious();
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    open,
    currentIndex,
    announcements.length,
  ]);

  /* =======================================================
     CURRENT ANNOUNCEMENT
  ======================================================= */

  const announcement =
    announcements[currentIndex];

  if (!announcement || !open) {
    return null;
  }

  const imageUrl =
    getImageUrl(announcement);

  const pdfUrl =
    getPdfUrl(announcement);

  const hasImage =
    Boolean(imageUrl) && !imageError;

  const dateText =
    formatDate(announcement);

  const hasNext =
    currentIndex <
    announcements.length - 1;

  const hasPrevious =
    currentIndex > 0;

  /* =======================================================
     POPUP
  ======================================================= */

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="
            fixed
            inset-0
            z-[99999]
            flex
            items-center
            justify-center
            overflow-y-auto
            bg-slate-950/75
            p-3
            backdrop-blur-md
            sm:p-6
          "
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          transition={{
            duration: 0.25,
          }}
          onClick={handleClose}
        >
          {/* =================================================
              MAIN CONTAINER
          ================================================= */}

          <motion.div
            key={getAnnouncementId(
              announcement,
              currentIndex
            )}
            className="
              relative
              w-full
              max-w-[850px]
              overflow-hidden
              rounded-[30px]
              bg-white
              shadow-[0_35px_120px_rgba(0,0,0,0.45)]
            "
            initial={{
              opacity: 0,
              y: 45,
              scale: 0.94,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 25,
              scale: 0.97,
            }}
            transition={{
              type: "spring",
              stiffness: 220,
              damping: 24,
            }}
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {/* TOP COLOR LINE */}

            <div
              className="
                absolute
                left-0
                right-0
                top-0
                z-50
                h-1.5
              "
              style={{
                background:
                  "linear-gradient(90deg, #D71920 0%, #F4B400 50%, #168A3A 100%)",
              }}
            />

            {/* CLOSE BUTTON */}

            <motion.button
              type="button"
              onClick={handleClose}
              aria-label="Close announcement"
              whileHover={{
                scale: 1.08,
              }}
              whileTap={{
                scale: 0.94,
              }}
              className="
                absolute
                right-4
                top-4
                z-50
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-full
                border
                border-slate-200
                bg-white
                text-slate-600
                shadow-lg
                transition
                hover:bg-red-50
                hover:text-red-600
                sm:right-5
                sm:top-5
              "
            >
              <X className="h-5 w-5" />
            </motion.button>

            {/* COUNTER */}

            {announcements.length > 1 && (
              <div
                className="
                  absolute
                  left-4
                  top-4
                  z-50
                  flex
                  items-center
                  gap-2
                  rounded-full
                  bg-slate-950
                  px-3.5
                  py-2
                  text-xs
                  font-black
                  text-white
                  shadow-xl
                  sm:left-5
                  sm:top-5
                "
              >
                <Megaphone
                  className="
                    h-3.5
                    w-3.5
                    text-amber-300
                  "
                />

                <span>
                  {currentIndex + 1}
                </span>

                <span className="text-white/40">
                  /
                </span>

                <span className="text-white/60">
                  {announcements.length}
                </span>
              </div>
            )}

            {/* SCROLLABLE CONTENT */}

            <div className="max-h-[92vh] overflow-y-auto">
              {/* =================================================
                  HEADER
              ================================================= */}

              <div
                className="
                  relative
                  overflow-hidden
                  bg-slate-950
                  px-6
                  pb-8
                  pt-16
                  sm:px-9
                  sm:pt-16
                "
              >
                {/* DECORATION */}

                <div
                  className="
                    pointer-events-none
                    absolute
                    -right-20
                    -top-20
                    h-64
                    w-64
                    rounded-full
                    bg-red-500/10
                    blur-3xl
                  "
                />

                <div
                  className="
                    pointer-events-none
                    absolute
                    -bottom-24
                    left-1/3
                    h-56
                    w-56
                    rounded-full
                    bg-amber-400/10
                    blur-3xl
                  "
                />

                <div className="relative z-10">
                  {/* BADGE */}

                  <div
                    className="
                      inline-flex
                      items-center
                      gap-2
                      rounded-full
                      border
                      border-amber-300/20
                      bg-white/10
                      px-3.5
                      py-2
                      text-[10px]
                      font-black
                      uppercase
                      tracking-[0.18em]
                      text-amber-300
                    "
                  >
                    <Sparkles className="h-3.5 w-3.5" />

                    School Announcement
                  </div>

                  {/* TITLE */}

                  <h2
                    className="
                      mt-5
                      max-w-3xl
                      pr-10
                      text-2xl
                      font-black
                      leading-tight
                      tracking-tight
                      text-white
                      sm:text-3xl
                      md:text-[38px]
                    "
                  >
                    {announcement.title ||
                      "School Announcement"}
                  </h2>

                  {/* DATE */}

                  {dateText && (
                    <div
                      className="
                        mt-4
                        inline-flex
                        items-center
                        gap-2
                        rounded-full
                        bg-white/10
                        px-3
                        py-2
                        text-xs
                        font-semibold
                        text-white/70
                      "
                    >
                      <CalendarDays
                        className="
                          h-4
                          w-4
                          text-amber-300
                        "
                      />

                      {dateText}
                    </div>
                  )}
                </div>
              </div>

              {/* =================================================
                  IMAGE
              ================================================= */}

              {hasImage && (
                <div
                  className="
                    relative
                    overflow-hidden
                    bg-slate-100
                  "
                >
                  <img
                    src={imageUrl}
                    alt={
                      announcement.title ||
                      "School announcement"
                    }
                    onError={() =>
                      setImageError(true)
                    }
                    className="
                      block
                      max-h-[52vh]
                      min-h-[180px]
                      w-full
                      object-contain
                    "
                  />

                  <div
                    className="
                      pointer-events-none
                      absolute
                      bottom-0
                      left-0
                      right-0
                      h-20
                      bg-gradient-to-t
                      from-black/20
                      to-transparent
                    "
                  />
                </div>
              )}

              {/* =================================================
                  CONTENT
              ================================================= */}

              <div
                className="
                  bg-white
                  px-6
                  py-7
                  sm:px-9
                  sm:py-8
                "
              >
                {/* ICON IF NO IMAGE */}

                {!hasImage && (
                  <div
                    className="
                      mb-5
                      flex
                      h-14
                      w-14
                      items-center
                      justify-center
                      rounded-2xl
                      bg-red-50
                      text-red-600
                    "
                  >
                    <Megaphone className="h-6 w-6" />
                  </div>
                )}

                {/* DESCRIPTION */}

                {announcement.description && (
                  <p
                    className="
                      max-w-3xl
                      whitespace-pre-line
                      text-sm
                      font-medium
                      leading-7
                      text-slate-600
                      sm:text-[15px]
                      sm:leading-8
                    "
                  >
                    {announcement.description}
                  </p>
                )}

                {/* =================================================
                    PDF
                ================================================= */}

                {pdfUrl && (
                  <div
                    className="
                      mt-6
                      flex
                      flex-col
                      gap-4
                      rounded-2xl
                      border
                      border-slate-200
                      bg-slate-50
                      p-4
                      sm:flex-row
                      sm:items-center
                      sm:justify-between
                    "
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="
                          flex
                          h-11
                          w-11
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          bg-red-50
                          text-red-600
                        "
                      >
                        <FileText className="h-5 w-5" />
                      </div>

                      <div>
                        <p
                          className="
                            text-sm
                            font-black
                            text-slate-900
                          "
                        >
                          Attached document
                        </p>

                        <p
                          className="
                            text-xs
                            font-medium
                            text-slate-400
                          "
                        >
                          Official school notice PDF
                        </p>
                      </div>
                    </div>

                    <a
                      href={pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-emerald-700
                        px-5
                        py-3
                        text-sm
                        font-black
                        text-white
                        shadow-md
                        transition-all
                        hover:-translate-y-0.5
                        hover:bg-emerald-800
                      "
                    >
                      View Document

                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                )}

                {/* =================================================
                    FOOTER
                ================================================= */}

                <div
                  className="
                    mt-7
                    flex
                    flex-col
                    gap-4
                    border-t
                    border-slate-100
                    pt-5
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                  "
                >
                  {/* SCHOOL NAME */}

                  <div
                    className="
                      flex
                      items-center
                      gap-2
                      text-xs
                      font-bold
                      text-slate-400
                    "
                  >
                    <span
                      className="
                        h-2
                        w-2
                        rounded-full
                        bg-emerald-500
                      "
                    />

                    Red Rose Secondary English School
                  </div>

                  {/* BUTTONS */}

                  <div
                    className="
                      flex
                      flex-wrap
                      items-center
                      gap-2
                    "
                  >
                    {hasPrevious && (
                      <button
                        type="button"
                        onClick={
                          handlePrevious
                        }
                        className="
                          inline-flex
                          items-center
                          justify-center
                          gap-1.5
                          rounded-xl
                          border
                          border-slate-200
                          bg-white
                          px-4
                          py-3
                          text-sm
                          font-black
                          text-slate-700
                          shadow-sm
                          transition
                          hover:bg-slate-50
                        "
                      >
                        <ChevronRight
                          className="
                            h-4
                            w-4
                            rotate-180
                          "
                        />

                        Previous
                      </button>
                    )}

                    {hasNext ? (
                      <button
                        type="button"
                        onClick={handleNext}
                        className="
                          inline-flex
                          items-center
                          justify-center
                          gap-2
                          rounded-xl
                          bg-slate-950
                          px-5
                          py-3
                          text-sm
                          font-black
                          text-white
                          shadow-lg
                          transition
                          hover:bg-slate-800
                        "
                      >
                        Next Announcement

                        <ChevronRight className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleClose}
                        className="
                          inline-flex
                          items-center
                          justify-center
                          gap-2
                          rounded-xl
                          px-6
                          py-3
                          text-sm
                          font-black
                          text-slate-950
                          shadow-lg
                          transition
                          hover:-translate-y-0.5
                        "
                        style={{
                          background:
                            "linear-gradient(135deg, #FACC15, #F4B400)",
                        }}
                      >
                        Got It

                        <ArrowRight className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}