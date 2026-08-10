import { useEffect, useState } from "react";
import { X, Megaphone } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const API_URL = import.meta.env.VITE_API_URL;

const POPUP_STORAGE_KEY =
  "smriti_school_home_announcement_seen";

function getImageUrl(item) {
  return (
    item?.image_url ||
    item?.imageUrl ||
    item?.image ||
    ""
  );
}

function getTime(item) {
  const time = new Date(
    item?.created_at ||
    item?.createdAt ||
    0
  ).getTime();

  return Number.isNaN(time) ? 0 : time;
}

function sortAnnouncements(list) {
  return [...list].sort((a, b) => {
    const aOrder =
      a?.popup_order ??
      Number.MAX_SAFE_INTEGER;

    const bOrder =
      b?.popup_order ??
      Number.MAX_SAFE_INTEGER;

    if (Number(aOrder) !== Number(bOrder)) {
      return Number(aOrder) - Number(bOrder);
    }

    return getTime(b) - getTime(a);
  });
}

export default function HomeAnnouncementPopup() {
  const [announcements, setAnnouncements] =
    useState([]);

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const [open, setOpen] = useState(false);

  const [imageError, setImageError] =
    useState(false);

  useEffect(() => {
    let cancelled = false;

    // =====================================================
    // FIRST VISIT CHECK
    // =====================================================

    const alreadySeen =
      localStorage.getItem(
        POPUP_STORAGE_KEY
      );

    console.log(
      "Announcement popup already seen:",
      alreadySeen
    );

    // If the visitor has already seen the popup,
    // don't show it again.
    if (alreadySeen === "true") {
      console.log(
        "Announcement popup skipped - already shown."
      );

      return;
    }

    // =====================================================
    // LOAD ANNOUNCEMENTS
    // =====================================================

    async function loadAnnouncements() {
      try {
        const response = await fetch(
          `${API_URL}/api/announcements`
        );

        if (!response.ok) {
          throw new Error(
            `HTTP error ${response.status}`
          );
        }

        const result =
          await response.json();

        console.log(
          "Announcement API:",
          result
        );

        if (cancelled) {
          return;
        }

        // Your backend returns:
        //
        // {
        //   success: true,
        //   data: [...]
        // }

        const list = Array.isArray(
          result?.data
        )
          ? result.data
          : [];

        // =================================================
        // FILTER
        // =================================================

        const popupAnnouncements =
          list.filter(
            (item) =>
              item?.active === true &&
              item?.visible === true &&
              item?.show_on_homepage === true
          );

        console.log(
          "Homepage announcements:",
          popupAnnouncements
        );

        // =================================================
        // NOTHING TO SHOW
        // =================================================

        if (
          popupAnnouncements.length === 0
        ) {
          console.log(
            "No homepage announcement available."
          );

          return;
        }

        // =================================================
        // SORT
        // =================================================

        const sorted =
          sortAnnouncements(
            popupAnnouncements
          );

        // =================================================
        // SET STATE
        // =================================================

        setAnnouncements(sorted);
        setCurrentIndex(0);
        setImageError(false);

        // =================================================
        // IMPORTANT
        //
        // Mark as seen ONLY after we successfully
        // found an announcement.
        // =================================================

        localStorage.setItem(
          POPUP_STORAGE_KEY,
          "true"
        );

        console.log(
          "Announcement popup opened."
        );

        setOpen(true);
      } catch (error) {
        console.error(
          "Announcement popup error:",
          error
        );
      }
    }

    loadAnnouncements();

    return () => {
      cancelled = true;
    };
  }, []);

  // =======================================================
  // LOCK BODY SCROLL
  // =======================================================

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

  // =======================================================
  // NEXT / CLOSE
  // =======================================================

  const handleNext = () => {
    if (
      currentIndex <
      announcements.length - 1
    ) {
      setCurrentIndex(
        (previous) => previous + 1
      );

      setImageError(false);

      return;
    }

    setOpen(false);
  };

  const announcement =
    announcements[currentIndex];

  if (!announcement) {
    return null;
  }

  const imageUrl =
    getImageUrl(announcement);

  const hasImage =
    imageUrl && !imageError;

  const hasNext =
    currentIndex <
    announcements.length - 1;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          onClick={handleNext}
        >
          <motion.div
            key={
              announcement.id ||
              currentIndex
            }
            className="relative w-full max-w-4xl overflow-hidden rounded-[30px] bg-white shadow-[0_30px_100px_rgba(0,0,0,0.35)]"
            initial={{
              opacity: 0,
              scale: 0.9,
              y: 30,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: 20,
            }}
            transition={{
              duration: 0.25,
              ease: "easeOut",
            }}
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {/* ==========================================
                CLOSE BUTTON
            =========================================== */}

            <button
              type="button"
              onClick={handleNext}
              aria-label={
                hasNext
                  ? "Next announcement"
                  : "Close announcement"
              }
              className="absolute right-4 top-4 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-black text-white shadow-lg transition-all duration-200 hover:scale-110 hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>

            {/* ==========================================
                COUNTER
            =========================================== */}

            {announcements.length > 1 && (
              <div className="absolute left-4 top-4 z-30 rounded-full bg-black/80 px-4 py-2 text-xs font-bold text-white backdrop-blur">
                {currentIndex + 1} /{" "}
                {announcements.length}
              </div>
            )}

            {/* ==========================================
                CONTENT
            =========================================== */}

            <div className="max-h-[90vh] overflow-y-auto">

              {/* ========================================
                  IMAGE
              ========================================= */}

              {hasImage ? (
                <div className="bg-slate-100">
                  <img
                    src={imageUrl}
                    alt={
                      announcement.title ||
                      "School announcement"
                    }
                    onError={() =>
                      setImageError(true)
                    }
                    className="block max-h-[75vh] w-full object-contain"
                  />
                </div>
              ) : (
                /* ======================================
                   TEXT ONLY
                ====================================== */

                <div className="px-7 py-14 text-center sm:px-12 sm:py-16">

                  <motion.div
                    initial={{
                      scale: 0.7,
                      opacity: 0,
                    }}
                    animate={{
                      scale: 1,
                      opacity: 1,
                    }}
                    transition={{
                      delay: 0.1,
                      duration: 0.3,
                    }}
                    className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-[22px] bg-red-50 text-red-600"
                  >
                    <Megaphone className="h-9 w-9" />
                  </motion.div>

                  <h2 className="text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-4xl md:text-5xl">
                    {announcement.title ||
                      "School Announcement"}
                  </h2>

                  {announcement.description && (
                    <p className="mx-auto mt-6 max-w-3xl whitespace-pre-line text-base leading-8 text-slate-600 sm:text-lg">
                      {
                        announcement.description
                      }
                    </p>
                  )}
                </div>
              )}

              {/* ========================================
                  IMAGE DESCRIPTION
              ========================================= */}

              {hasImage &&
                (announcement.title ||
                  announcement.description) && (
                  <div className="border-t border-slate-100 bg-white px-6 py-6 sm:px-8">

                    {announcement.title && (
                      <h2 className="pr-14 text-xl font-black text-slate-950 sm:text-2xl">
                        {
                          announcement.title
                        }
                      </h2>
                    )}

                    {announcement.description && (
                      <p className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-600 sm:text-base">
                        {
                          announcement.description
                        }
                      </p>
                    )}
                  </div>
                )}

              {/* ========================================
                  NEXT BUTTON
              ========================================= */}

              {hasNext && (
                <div className="border-t border-slate-100 bg-white px-6 py-5 text-center">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="rounded-2xl bg-slate-950 px-7 py-3 text-sm font-black text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800"
                  >
                    Next Announcement
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}