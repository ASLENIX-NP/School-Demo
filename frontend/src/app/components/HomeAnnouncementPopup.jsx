import { useEffect, useState } from "react";
import { X, Megaphone } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const API_URL = "https://school-website-backend-ixx2.onrender.com";

function getImageUrl(item) {
  return item?.image_url || item?.imageUrl || item?.image || "";
}

function getTime(item) {
  const time = new Date(item?.created_at || item?.createdAt || 0).getTime();
  return Number.isNaN(time) ? 0 : time;
}

function hasManualOrder(list) {
  return list.some(
    (item) => item.popup_order !== null && item.popup_order !== undefined
  );
}

function sortPopupAnnouncements(list) {
  const items = [...list];

  if (hasManualOrder(items)) {
    return items.sort((a, b) => {
      const aOrder =
        a.popup_order === null || a.popup_order === undefined
          ? Number.MAX_SAFE_INTEGER
          : Number(a.popup_order);

      const bOrder =
        b.popup_order === null || b.popup_order === undefined
          ? Number.MAX_SAFE_INTEGER
          : Number(b.popup_order);

      if (aOrder !== bOrder) return aOrder - bOrder;
      return getTime(b) - getTime(a);
    });
  }

  return items.sort((a, b) => getTime(b) - getTime(a));
}

export default function HomeAnnouncementPopup() {
  const [announcements, setAnnouncements] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    let mounted = true;

    fetch(`${API_URL}/api/announcements`)
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;

        const list = Array.isArray(data?.data) ? data.data : [];

        const popupList = sortPopupAnnouncements(
          list.filter(
            (item) =>
              item.active !== false &&
              item.visible !== false &&
              item.show_on_homepage === true
          )
        );

        if (popupList.length > 0) {
          setAnnouncements(popupList);
          setCurrentIndex(0);
          setOpen(true);
        }
      })
      .catch((err) => {
        console.error("Announcement popup load error:", err);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = oldOverflow;
    };
  }, [open]);

  const closeCurrentPopup = () => {
    if (currentIndex < announcements.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setImageError(false);
      return;
    }

    setOpen(false);
  };

  const announcement = announcements[currentIndex];

  if (!announcement) return null;

  const imageUrl = getImageUrl(announcement);
  const hasImage = imageUrl && !imageError;
  const hasNext = currentIndex < announcements.length - 1;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-3 sm:p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeCurrentPopup}
        >
          <motion.div
            key={announcement.id || currentIndex}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[28px] bg-white shadow-2xl"
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.22 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeCurrentPopup}
              aria-label={hasNext ? "Next announcement" : "Close announcement"}
              className="absolute right-3 top-3 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-black text-white shadow-xl transition-all hover:scale-105"
            >
              <X size={22} />
            </button>

            {announcements.length > 1 && (
              <div className="absolute left-3 top-3 z-30 rounded-full bg-black/80 px-3 py-1.5 text-xs font-black text-white shadow-lg">
                {currentIndex + 1} / {announcements.length}
              </div>
            )}

            <div className="max-h-[90vh] overflow-y-auto">
              {hasImage ? (
                <div className="bg-slate-100">
                  <img
                    src={imageUrl}
                    alt={announcement.title || "School announcement"}
                    onError={() => setImageError(true)}
                    className="block w-full max-h-[78vh] object-contain"
                  />
                </div>
              ) : (
                <div className="px-6 py-12 sm:px-10 sm:py-14 text-center">
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                    <Megaphone className="h-8 w-8" />
                  </div>

                  <h2 className="text-3xl sm:text-4xl font-black text-slate-950 leading-tight">
                    {announcement.title || "School Announcement"}
                  </h2>

                  {announcement.description && (
                    <p className="mx-auto mt-5 max-w-2xl whitespace-pre-line text-base sm:text-lg leading-relaxed text-slate-600">
                      {announcement.description}
                    </p>
                  )}
                </div>
              )}

              {(announcement.title || announcement.description || hasNext) &&
                hasImage && (
                  <div className="px-5 py-5 sm:px-7 bg-white border-t border-slate-100">
                    {announcement.title && (
                      <h2 className="pr-12 text-xl sm:text-2xl font-black text-slate-950 leading-tight">
                        {announcement.title}
                      </h2>
                    )}

                    {announcement.description && (
                      <p className="mt-2 whitespace-pre-line text-sm sm:text-base leading-relaxed text-slate-600">
                        {announcement.description}
                      </p>
                    )}

                    {hasNext && (
                      <button
                        type="button"
                        onClick={closeCurrentPopup}
                        className="mt-4 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white"
                      >
                        Next Announcement
                      </button>
                    )}
                  </div>
                )}

              {!hasImage && hasNext && (
                <div className="px-6 pb-8 text-center">
                  <button
                    type="button"
                    onClick={closeCurrentPopup}
                    className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white"
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