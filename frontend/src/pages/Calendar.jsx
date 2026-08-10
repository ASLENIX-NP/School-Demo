// ============================================================
// Calendar.jsx
// Modern light / glassmorphism school calendar
// ============================================================
// Main changes:
// 1. Light, bright background instead of dark.
// 2. Glassmorphism cards with soft animated ambient effects.
// 3. Selected Date and Upcoming Dates use the SAME
//    soft golden/cream shade as the selected calendar date.
// 4. Calendar cells have subtle 3D hover effects.
// 5. Existing API, notice integration, admin edit mode,
//    event selection and month navigation are preserved.
// ============================================================

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  Pencil,
  Sparkles,
  X,
  FileText,
  Bell,
  Award,
} from "lucide-react";

const colors = {
  red: "#D71920",
  green: "#168A3A",
  purple: "#4B2E83",
  dark: "#0B1020",
  gold: "#F4C95D",
  goldLight: "#FFF3C4",
  goldSoft: "#FFF8DC",
  cyan: "#38BDF8",
  blue: "#1877F2",
  orange: "#F97316",
};

const API_URL = import.meta.env.VITE_API_URL;
const REQUEST_TIMEOUT_MS = 12000;

// ------------------------------------------------------------
// API helper
// ------------------------------------------------------------

async function fetchJsonWithTimeout(url, options = {}) {
  const controller = new AbortController();

  const timeoutId = window.setTimeout(
    () => controller.abort(),
    REQUEST_TIMEOUT_MS
  );

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return await response.json();
  } finally {
    window.clearTimeout(timeoutId);
  }
}

// ------------------------------------------------------------
// Default content
// ------------------------------------------------------------

export const defaultCalendarContent = {
  page_badge: "School Calendar",
  page_title: "Academic Calendar",
  page_description:
    "View school holidays, exam schedules, programs, sports week, admission dates, results, and other important academic events.",
  saturday_holiday: true,
  show_notice_dates: true,
  events: [],
};

export const calendarTypeOptions = [
  {
    value: "holiday",
    label: "Holiday",
    labelNp: "बिदा",
  },
  {
    value: "event",
    label: "School Event",
    labelNp: "कार्यक्रम",
  },
  {
    value: "workingDay",
    label: "Working Day",
    labelNp: "कार्य दिन",
  },
];

export const calendarTypeStyles = {
  holiday: {
    label: "Holiday",
    labelNp: "बिदा",
    color: colors.red,
    background: "rgba(215,25,32,0.08)",
    border: "rgba(215,25,32,0.18)",
  },

  exam: {
    label: "Exam",
    labelNp: "परीक्षा",
    color: colors.blue,
    background: "rgba(24,119,242,0.08)",
    border: "rgba(24,119,242,0.18)",
  },

  event: {
    label: "Event",
    labelNp: "कार्यक्रम",
    color: colors.blue,
    background: "rgba(24,119,242,0.08)",
    border: "rgba(24,119,242,0.18)",
  },

  admission: {
    label: "Admission",
    labelNp: "भर्ना",
    color: colors.blue,
    background: "rgba(24,119,242,0.08)",
    border: "rgba(24,119,242,0.18)",
  },

  result: {
    label: "Result",
    labelNp: "नतिजा",
    color: colors.blue,
    background: "rgba(24,119,242,0.08)",
    border: "rgba(24,119,242,0.18)",
  },

  workingDay: {
    label: "Working Day",
    labelNp: "कार्य दिन",
    color: colors.dark,
    background: "rgba(15,23,42,0.04)",
    border: "rgba(15,23,42,0.08)",
  },

  notice: {
    label: "Notice",
    labelNp: "सूचना",
    color: colors.blue,
    background: "rgba(24,119,242,0.08)",
    border: "rgba(24,119,242,0.18)",
  },
};

// ------------------------------------------------------------
// Nepali calendar data
// ------------------------------------------------------------

const BS_MONTHS = [
  { en: "Baisakh", np: "वैशाख" },
  { en: "Jestha", np: "जेठ" },
  { en: "Ashadh", np: "असार" },
  { en: "Shrawan", np: "साउन" },
  { en: "Bhadra", np: "भदौ" },
  { en: "Ashwin", np: "असोज" },
  { en: "Kartik", np: "कार्तिक" },
  { en: "Mangsir", np: "मंसिर" },
  { en: "Poush", np: "पौष" },
  { en: "Magh", np: "माघ" },
  { en: "Falgun", np: "फागुन" },
  { en: "Chaitra", np: "चैत" },
];

const BS_WEEK_DAYS = [
  "आइत",
  "सोम",
  "मंगल",
  "बुध",
  "बिहि",
  "शुक्र",
  "शनि",
];

// Keep the same BS calendar range used by the project.
const BS_CALENDAR_DATA = {
  2082: {
    startAd: "2025-04-14",
    months: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  },

  2083: {
    startAd: "2026-04-14",
    months: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  },

  2084: {
    startAd: "2027-04-14",
    months: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  },
};

const FALLBACK_BS_YEAR = 2083;
const FALLBACK_BS_MONTH_INDEX = 3;

// ------------------------------------------------------------
// Basic helpers
// ------------------------------------------------------------

function parseJsonList(value) {
  if (Array.isArray(value)) return value;

  if (typeof value !== "string") return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Calendar JSON parse error:", error);
    return [];
  }
}

function parseDateOnly(value) {
  if (!value) return null;

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return new Date(
      value.getFullYear(),
      value.getMonth(),
      value.getDate()
    );
  }

  const clean = String(value).trim();

  const match = clean.match(/^(\d{4})-(\d{2})-(\d{2})/);

  if (match) {
    const [, year, month, day] = match;

    return new Date(
      Number(year),
      Number(month) - 1,
      Number(day)
    );
  }

  const parsed = new Date(clean);

  if (Number.isNaN(parsed.getTime())) return null;

  return new Date(
    parsed.getFullYear(),
    parsed.getMonth(),
    parsed.getDate()
  );
}

function formatDateKey(date) {
  if (!date || Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function toNepaliNumber(value) {
  const digits = [
    "०",
    "१",
    "२",
    "३",
    "४",
    "५",
    "६",
    "७",
    "८",
    "९",
  ];

  return String(value ?? "").replace(
    /\d/g,
    (digit) => digits[Number(digit)]
  );
}

function getBsMonthLength(year, monthIndex) {
  return (
    BS_CALENDAR_DATA[year]?.months?.[monthIndex] || 30
  );
}

function getBsYearStartDate(year) {
  return parseDateOnly(
    BS_CALENDAR_DATA[year]?.startAd
  );
}

function bsToAdDate(year, monthIndex, day) {
  const yearStart = getBsYearStartDate(year);

  if (!yearStart) return null;

  let offset = 0;

  for (let i = 0; i < monthIndex; i += 1) {
    offset += getBsMonthLength(year, i);
  }

  offset += day - 1;

  return addDays(yearStart, offset);
}

function adToBsDate(adDate) {
  const date = parseDateOnly(adDate);

  if (!date) return null;

  for (const year of Object.keys(BS_CALENDAR_DATA)) {
    const numericYear = Number(year);
    const start = getBsYearStartDate(numericYear);

    if (!start) continue;

    const nextYearStart =
      getBsYearStartDate(numericYear + 1);

    if (
      date >= start &&
      (!nextYearStart || date < nextYearStart)
    ) {
      let remaining = Math.round(
        (date.getTime() - start.getTime()) /
          86400000
      );

      for (
        let monthIndex = 0;
        monthIndex < 12;
        monthIndex += 1
      ) {
        const length = getBsMonthLength(
          numericYear,
          monthIndex
        );

        if (remaining < length) {
          return {
            year: numericYear,
            monthIndex,
            day: remaining + 1,
            adDate: date,
            adKey: formatDateKey(date),
          };
        }

        remaining -= length;
      }
    }
  }

  return null;
}

function formatBsFullDate(bsDate) {
  if (!bsDate) return "No date";

  const month =
    BS_MONTHS[bsDate.monthIndex] ||
    BS_MONTHS[0];

  return `${month.np} ${toNepaliNumber(
    bsDate.day
  )}, ${toNepaliNumber(bsDate.year)} वि.सं.`;
}

export function formatCalendarDate(adDateKey) {
  const adDate = parseDateOnly(adDateKey);
  const bsDate = adToBsDate(adDate);

  if (!adDate || !bsDate) {
    return adDateKey || "No date";
  }

  return `${formatBsFullDate(bsDate)} · ${adDate.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  )}`;
}

function formatAdMonthRange(firstDate, lastDate) {
  if (!firstDate || !lastDate) return "";

  return `${firstDate.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  )} – ${lastDate.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  )}`;
}

function getAdDateRangeKeys(startDate, endDate) {
  const start = parseDateOnly(startDate);
  const end = parseDateOnly(
    endDate || startDate
  );

  if (!start || !end) return [];

  const safeStart = start <= end ? start : end;
  const safeEnd = start <= end ? end : start;

  const keys = [];

  for (
    let current = safeStart;
    current <= safeEnd;
    current = addDays(current, 1)
  ) {
    keys.push(formatDateKey(current));
  }

  return keys;
}

// ------------------------------------------------------------
// Event normalization
// ------------------------------------------------------------

function inferCalendarEventType({
  title = "",
  category = "",
  type = "",
} = {}) {
  const explicitType = String(type || "").trim();

  if (
    ["holiday", "event", "workingDay"].includes(
      explicitType
    )
  ) {
    return explicitType;
  }

  const text =
    `${title} ${category}`.toLowerCase();

  if (
    text.includes("holiday") ||
    text.includes("vacation") ||
    text.includes("closed") ||
    text.includes("बिदा")
  ) {
    return "holiday";
  }

  if (
    text.includes("working") ||
    text.includes("open saturday") ||
    text.includes("कार्य दिन")
  ) {
    return "workingDay";
  }

  if (
    text.includes("exam") ||
    text.includes("examination") ||
    text.includes("परीक्षा")
  ) {
    return "exam";
  }

  return "event";
}

export function normalizeCalendarEvent(
  event = {},
  index = 0
) {
  return {
    id:
      event.id ||
      `${Date.now()}-${index}`,

    title:
      event.title ||
      "School calendar item",

    type: inferCalendarEventType({
      title: event.title,
      category: event.category,
      type:
        event.type ||
        event.event_type ||
        event.eventType,
    }),

    start_bs:
      event.start_bs ||
      event.startBs ||
      event.bs_date ||
      event.bsDate ||
      "",

    end_bs:
      event.end_bs ||
      event.endBs ||
      event.start_bs ||
      event.startBs ||
      event.bs_date ||
      event.bsDate ||
      "",

    description:
      event.description ||
      event.note ||
      "",

    visible:
      event.visible !== false,
  };
}

export function mergeCalendarContent(
  saved = {}
) {
  const rawEvents = parseJsonList(
    saved?.events ||
      saved?.calendar_events ||
      []
  );

  return {
    ...defaultCalendarContent,
    ...(saved || {}),

    saturday_holiday:
      saved?.saturday_holiday !== false,

    show_notice_dates:
      saved?.show_notice_dates !== false,

    events: rawEvents.map(
      normalizeCalendarEvent
    ),
  };
}

function normalizeCalendarEvents(
  rawEvents = [],
  source = "manual"
) {
  const events = parseJsonList(rawEvents);

  return events
    .filter(
      (event) =>
        event &&
        event.visible !== false
    )
    .flatMap((event, index) => {
      const item =
        normalizeCalendarEvent(
          event,
          index
        );

      const dateKeys =
        getAdDateRangeKeys(
          item.start_bs,
          item.end_bs ||
            item.start_bs
        );

      if (!dateKeys.length) return [];

      return dateKeys.map(
        (dateKey) => ({
          id: `${source}-${item.id || index}-${dateKey}`,
          title: item.title,
          type: item.type,
          dateKey,
          description:
            item.description || "",
          source,
        })
      );
    });
}

function getCalendarEventsFromNotices(
  notices = []
) {
  return notices
    .filter(
      (notice) => notice?.notice_date
    )
    .flatMap((notice, index) => {
      const dateKeys =
        getAdDateRangeKeys(
          notice.notice_date,
          notice.end_date ||
            notice.endDate ||
            notice.notice_date
        );

      return dateKeys.map(
        (dateKey) => ({
          id: `notice-${
            notice.id || index
          }-${dateKey}`,

          title:
            notice.title ||
            "School notice",

          type: "event",

          dateKey,

          description:
            notice.description || "",

          source: "notice",
        })
      );
    });
}

function getBsMonthCells(
  bsYear,
  bsMonthIndex
) {
  const monthLength =
    getBsMonthLength(
      bsYear,
      bsMonthIndex
    );

  const firstAdDate =
    bsToAdDate(
      bsYear,
      bsMonthIndex,
      1
    );

  const cells = [];

  if (!firstAdDate) return cells;

  for (
    let index = 0;
    index < firstAdDate.getDay();
    index += 1
  ) {
    cells.push(null);
  }

  for (
    let day = 1;
    day <= monthLength;
    day += 1
  ) {
    const adDate =
      bsToAdDate(
        bsYear,
        bsMonthIndex,
        day
      );

    cells.push({
      bsYear,
      bsMonthIndex,
      bsDay: day,

      bsKey: `${bsYear}-${String(
        bsMonthIndex + 1
      ).padStart(2, "0")}-${String(
        day
      ).padStart(2, "0")}`,

      adDate,

      adKey:
        formatDateKey(adDate),
    });
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return cells;
}

function getPreviousBsMonth(
  monthState
) {
  if (monthState.monthIndex === 0) {
    return {
      year: monthState.year - 1,
      monthIndex: 11,
    };
  }

  return {
    year: monthState.year,
    monthIndex:
      monthState.monthIndex - 1,
  };
}

function getNextBsMonth(
  monthState
) {
  if (monthState.monthIndex === 11) {
    return {
      year: monthState.year + 1,
      monthIndex: 0,
    };
  }

  return {
    year: monthState.year,
    monthIndex:
      monthState.monthIndex + 1,
  };
}

function isSupportedBsMonth(
  monthState
) {
  return Boolean(
    BS_CALENDAR_DATA[
      monthState.year
    ]
  );
}

function normalizeNotice(
  notice = {}
) {
  return {
    id: notice.id,
    title: notice.title || "",
    category:
      notice.category ||
      "General",

    notice_date:
      notice.notice_date ||
      notice.date ||
      "",

    description:
      notice.description || "",

    pinned:
      Boolean(notice.pinned),

    created_at:
      notice.created_at ||
      notice.createdAt ||
      "",
  };
}

// ------------------------------------------------------------
// Small visual components
// ------------------------------------------------------------

function LegendItem({ type }) {
  const style =
    calendarTypeStyles[type] ||
    calendarTypeStyles.notice;

  return (
    <div
      className="flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold"
      style={{
        background:
          "rgba(255,255,255,0.72)",
        color: "#475569",
        border:
          "1px solid rgba(148,163,184,0.14)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.92)",
      }}
    >
      <span
        className="h-2.5 w-2.5 rounded-full"
        style={{
          background: style.color,
        }}
      />

      {style.labelNp ||
        style.label}
    </div>
  );
}

function CalendarCell({
  cell,
  todayKey,
  selectedDateKey,
  eventMap,
  saturdayHoliday,
  editMode = false,
  onSelect,
  onAdminDateClick = () => {},
}) {
  if (!cell) {
    return (
      <div className="h-12 rounded-2xl md:h-14" />
    );
  }

  const dayEvents =
    eventMap[cell.adKey] || [];

  const hasWorkingDay =
    dayEvents.some(
      (event) =>
        event.type === "workingDay"
    );

  const isSaturdayHoliday =
    saturdayHoliday &&
    cell.adDate.getDay() === 6 &&
    !hasWorkingDay;

  const isToday =
    cell.adKey === todayKey;

  const isSelected =
    cell.adKey === selectedDateKey;

  const visibleEvents =
    dayEvents.filter(
      (event) =>
        event.type !== "workingDay"
    );

  const topEvents =
    visibleEvents.slice(0, 4);

  const hasHoliday =
    visibleEvents.some(
      (event) =>
        event.type === "holiday"
    );

  return (
    <motion.button
      type="button"
      whileHover={{
        y: -3,
        scale: 1.015,
      }}
      whileTap={{
        scale: 0.98,
      }}
      onClick={() => {
        onSelect(cell.adKey);

        if (editMode) {
          onAdminDateClick(cell);
        }
      }}
      className="relative h-12 rounded-2xl p-1 text-center transition-all md:h-14"
      style={{
        background: isSelected
          ? "linear-gradient(145deg, #FFF0B8 0%, #F7D77B 100%)"
          : isSaturdayHoliday ||
            hasHoliday
          ? "rgba(254,226,226,0.72)"
          : topEvents.length > 0
          ? "rgba(224,247,255,0.80)"
          : "rgba(255,255,255,0.72)",

        color: isSelected
          ? "#765400"
          : isSaturdayHoliday ||
            hasHoliday
          ? "#C53030"
          : "#172033",

        border: isToday
          ? `2px solid ${colors.cyan}`
          : isSelected
          ? "2px solid #E7B93E"
          : editMode
          ? "1px dashed rgba(166,106,0,0.32)"
          : "1px solid rgba(148,163,184,0.16)",

        boxShadow: isSelected
          ? "0 14px 30px rgba(231,185,62,0.22), inset 0 1px 0 rgba(255,255,255,0.95)"
          : "0 8px 20px rgba(51,65,85,0.07), inset 0 1px 0 rgba(255,255,255,0.95)",

        cursor:
          editMode
            ? "copy"
            : "pointer",
      }}
    >
      <span className="block text-base font-black leading-tight md:text-lg">
        {toNepaliNumber(
          cell.bsDay
        )}
      </span>

      <span className="block text-[9px] font-bold leading-none opacity-60 md:text-[10px]">
        {cell.adDate.getDate()}
      </span>

      <div className="absolute bottom-0.5 left-1/2 flex -translate-x-1/2 gap-0.5">
        {(isSaturdayHoliday ||
          hasHoliday) && (
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{
              background:
                isSelected
                  ? "#FFFFFF"
                  : colors.red,
            }}
          />
        )}

        {topEvents.map(
          (event) => (
            <span
              key={event.id}
              className="h-1.5 w-1.5 rounded-full"
              style={{
                background:
                  isSelected
                    ? "#FFFFFF"
                    : event.type ===
                      "holiday"
                    ? colors.red
                    : colors.blue,
              }}
            />
          )
        )}
      </div>
    </motion.button>
  );
}

function EventPill({
  event,
}) {
  const style =
    calendarTypeStyles[
      event.type
    ] ||
    calendarTypeStyles.notice;

  return (
    <div
      className="rounded-2xl px-4 py-3 transition-all hover:-translate-y-0.5"
      style={{
        background:
          style.background,
        color: style.color,
        border: `1px solid ${style.border}`,
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.72)",
      }}
    >
      <div className="text-xs font-bold uppercase tracking-[0.12em] opacity-80">
        {style.labelNp ||
          style.label}
      </div>

      <div className="text-base font-black text-slate-950">
        {event.title}
      </div>

      {event.description && (
        <p className="mt-1 line-clamp-3 text-sm leading-relaxed text-slate-500">
          {event.description}
        </p>
      )}
    </div>
  );
}

// ------------------------------------------------------------
// Main Calendar
// ------------------------------------------------------------

export function Calendar({
  contentOverride = null,
  noticesOverride = null,
  editMode = false,
  onEditTarget = () => {},
  onDateSelectForAdmin = () => {},
}) {
  const [content, setContent] =
    useState(() =>
      mergeCalendarContent(
        contentOverride ||
          defaultCalendarContent
      )
    );

  const [notices, setNotices] =
    useState(
      Array.isArray(
        noticesOverride
      )
        ? noticesOverride.map(
            normalizeNotice
          )
        : []
    );

  const [selectedEvent, setSelectedEvent] =
    useState(null);

  const today = useMemo(
    () => new Date(),
    []
  );

  const todayKey =
    formatDateKey(today);

  const todayBs =
    adToBsDate(today) || {
      year: FALLBACK_BS_YEAR,
      monthIndex:
        FALLBACK_BS_MONTH_INDEX,
      day: 1,
      adDate: today,
      adKey: todayKey,
    };

  const [
    calendarMonth,
    setCalendarMonth,
  ] = useState(() => ({
    year: todayBs.year,
    monthIndex:
      todayBs.monthIndex,
  }));

  const [
    selectedDateKey,
    setSelectedDateKey,
  ] = useState(
    todayBs.adKey ||
      todayKey
  );

  useEffect(() => {
    if (contentOverride) {
      setContent(
        mergeCalendarContent(
          contentOverride
        )
      );

      setNotices(
        Array.isArray(
          noticesOverride
        )
          ? noticesOverride.map(
              normalizeNotice
            )
          : []
      );

      return;
    }

    let alive = true;

    const loadCalendar =
      async () => {
        try {
          const result =
            await fetchJsonWithTimeout(
              `${API_URL}/api/site-content/calendar`
            );

          if (!alive) return;

          setContent(
            mergeCalendarContent(
              result?.data?.content ||
                {}
            )
          );
        } catch (error) {
          console.error(
            "Calendar content load error:",
            error
          );

          if (alive) {
            setContent(
              mergeCalendarContent(
                defaultCalendarContent
              )
            );
          }
        }
      };

    const loadNotices =
      async () => {
        try {
          const result =
            await fetchJsonWithTimeout(
              `${API_URL}/api/notices`
            );

          if (!alive) return;

          const rawNotices =
            Array.isArray(result)
              ? result
              : Array.isArray(
                  result?.data
                )
              ? result.data
              : [];

          setNotices(
            rawNotices.map(
              normalizeNotice
            )
          );
        } catch (error) {
          console.error(
            "Calendar notices load error:",
            error
          );
        }
      };

    loadCalendar();
    loadNotices();

    return () => {
      alive = false;
    };
  }, [
    contentOverride,
    noticesOverride,
  ]);

  const manualEvents =
    useMemo(
      () =>
        normalizeCalendarEvents(
          content.events,
          "manual"
        ),
      [content.events]
    );

  const noticeEvents =
    useMemo(
      () =>
        content.show_notice_dates ===
        false
          ? []
          : getCalendarEventsFromNotices(
              notices
            ),
      [
        content.show_notice_dates,
        notices,
      ]
    );

  const allEvents =
    useMemo(
      () => [
        ...manualEvents,
        ...noticeEvents,
      ],
      [
        manualEvents,
        noticeEvents,
      ]
    );

  const eventMap =
    useMemo(() => {
      return allEvents.reduce(
        (map, event) => {
          if (
            !map[event.dateKey]
          ) {
            map[event.dateKey] =
              [];
          }

          map[event.dateKey].push(
            event
          );

          return map;
        },
        {}
      );
    }, [allEvents]);

  const monthCells =
    useMemo(
      () =>
        getBsMonthCells(
          calendarMonth.year,
          calendarMonth.monthIndex
        ),
      [calendarMonth]
    );

  const selectedAdDate =
    parseDateOnly(
      selectedDateKey
    ) || today;

  const selectedDateEvents =
    eventMap[
      selectedDateKey
    ] || [];

  const hasWorkingDay =
    selectedDateEvents.some(
      (event) =>
        event.type ===
        "workingDay"
    );

  const isSelectedSaturdayHoliday =
    content.saturday_holiday !==
      false &&
    selectedAdDate.getDay() ===
      6 &&
    !hasWorkingDay;

  const visibleSelectedEvents =
    selectedDateEvents.filter(
      (event) =>
        event.type !==
        "workingDay"
    );

  const upcomingEvents =
    allEvents
      .filter(
        (event) =>
          event.type !==
            "workingDay" &&
          event.dateKey >=
            todayKey
      )
      .sort((a, b) =>
        a.dateKey.localeCompare(
          b.dateKey
        )
      )
      .slice(0, 6);

  const firstAdDate =
    bsToAdDate(
      calendarMonth.year,
      calendarMonth.monthIndex,
      1
    );

  const lastAdDate =
    bsToAdDate(
      calendarMonth.year,
      calendarMonth.monthIndex,
      getBsMonthLength(
        calendarMonth.year,
        calendarMonth.monthIndex
      )
    );

  const monthName =
    BS_MONTHS[
      calendarMonth.monthIndex
    ] || BS_MONTHS[0];

  const changeMonth =
    (amount) => {
      setCalendarMonth(
        (current) => {
          const next =
            amount > 0
              ? getNextBsMonth(
                  current
                )
              : getPreviousBsMonth(
                  current
                );

          return isSupportedBsMonth(
            next
          )
            ? next
            : current;
        }
      );
    };

  const goToday = () => {
    setCalendarMonth({
      year: todayBs.year,
      monthIndex:
        todayBs.monthIndex,
    });

    setSelectedDateKey(
      todayBs.adKey ||
        todayKey
    );
  };

  const eventCount =
    content.events?.filter(
      (event) =>
        event.visible !== false &&
        event.type !==
          "workingDay"
    ).length || 0;

  const holidayCount =
    content.events?.filter(
      (event) =>
        event.visible !== false &&
        event.type ===
          "holiday"
    ).length || 0;

  return (
    <>
      <style>{`
        .calendar-glass-card {
          transition:
            transform .35s ease,
            box-shadow .35s ease,
            border-color .35s ease;
        }

        .calendar-glass-card:hover {
          transform: translateY(-2px);
          box-shadow:
            0 28px 70px rgba(51,65,85,.12),
            inset 0 1px 0 rgba(255,255,255,.98);
        }

        .calendar-shimmer {
          position: relative;
          overflow: hidden;
        }

        .calendar-shimmer::after {
          content: "";
          position: absolute;
          inset: 0;
          transform: translateX(-120%);
          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(255,255,255,.28),
              transparent
            );
          animation: calendarShimmer 7s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes calendarShimmer {
          0%, 60% {
            transform: translateX(-120%);
          }
          85%, 100% {
            transform: translateX(120%);
          }
        }
      `}</style>

      <section
        className="relative min-h-screen overflow-hidden pt-24 pb-16 lg:pt-28"
        style={{
          background:
            "linear-gradient(135deg, #F8FBFF 0%, #FFFDF8 46%, #F1FAF8 100%)",
        }}
      >
        {/* ======================================================
            LIGHT AMBIENT BACKGROUND
        ====================================================== */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -left-24 -top-24 h-[380px] w-[380px] rounded-full blur-3xl"
            style={{
              background:
                "rgba(244,201,93,0.22)",
            }}
            animate={{
              x: [0, 35, 0],
              y: [0, 18, 0],
              scale: [1, 1.08, 1],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <motion.div
            className="absolute -right-28 top-[28%] h-[430px] w-[430px] rounded-full blur-3xl"
            style={{
              background:
                "rgba(56,189,248,0.16)",
            }}
            animate={{
              x: [0, -25, 0],
              y: [0, 30, 0],
              scale: [1, 1.06, 1],
            }}
            transition={{
              duration: 14,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <motion.div
            className="absolute bottom-0 left-[38%] h-[330px] w-[330px] rounded-full blur-3xl"
            style={{
              background:
                "rgba(216,193,255,0.18)",
            }}
            animate={{
              x: [0, -20, 0],
              y: [0, -22, 0],
            }}
            transition={{
              duration: 11,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <div
            className="absolute inset-0 opacity-[0.18]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(100,116,139,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(100,116,139,0.06) 1px, transparent 1px)",
              backgroundSize:
                "56px 56px",
              maskImage:
                "linear-gradient(to bottom, black, transparent 72%)",
            }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-[1400px] px-5 sm:px-8">
          {/* ====================================================
              HEADER
          ==================================================== */}
          <motion.div
            initial={{
              opacity: 0,
              y: 24,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.55,
            }}
            className="relative mb-6"
          >
            <div
              className="calendar-glass-card calendar-shimmer relative overflow-hidden rounded-[30px] p-6 md:p-8"
              style={{
                background:
                  "rgba(255,255,255,0.70)",
                backdropFilter:
                  "blur(22px)",
                WebkitBackdropFilter:
                  "blur(22px)",
                border:
                  "1px solid rgba(255,255,255,0.92)",
                boxShadow:
                  "0 24px 70px rgba(51,65,85,0.10), inset 0 1px 0 rgba(255,255,255,0.95)",
              }}
            >
              <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-end">
                <div>
                  <div
                    className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.15em]"
                    style={{
                      background:
                        "rgba(244,201,93,0.16)",
                      color:
                        "#8A6A1F",
                      border:
                        "1px solid rgba(244,201,93,0.40)",
                    }}
                  >
                    <Sparkles className="h-4 w-4" />
                    {content.page_badge}
                  </div>

                  <h1
                    className="text-4xl leading-[0.95] text-slate-950 md:text-5xl"
                    style={{
                      fontFamily:
                        "var(--font-display)",
                      fontWeight: 900,
                      letterSpacing:
                        "-0.065em",
                    }}
                  >
                    {content.page_title}
                  </h1>

                  <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600">
                    {content.page_description}
                  </p>
                </div>

                {/* STATS */}
                <div
                  className="rounded-[24px] p-5"
                  style={{
                    background:
                      "rgba(255,255,255,0.72)",
                    backdropFilter:
                      "blur(18px)",
                    WebkitBackdropFilter:
                      "blur(18px)",
                    border:
                      "1px solid rgba(255,255,255,0.92)",
                    boxShadow:
                      "0 18px 50px rgba(51,65,85,0.08), inset 0 1px 0 rgba(255,255,255,0.95)",
                  }}
                >
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center">
                      <div className="text-2xl font-black text-slate-950">
                        {eventCount}
                      </div>
                      <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Events
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-2xl font-black text-slate-950">
                        {holidayCount}
                      </div>
                      <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Holidays
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-2xl font-black text-slate-950">
                        {notices.length}
                      </div>
                      <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Notices
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {editMode && (
                <button
                  type="button"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    onEditTarget({
                      type: "pageHeader",
                    });
                  }}
                  className="absolute right-5 top-5 z-20 flex h-10 w-10 items-center justify-center rounded-2xl shadow-lg transition-all hover:scale-105"
                  style={{
                    background:
                      "linear-gradient(135deg, #F4C95D, #8ED8EA)",
                    color:
                      colors.dark,
                    border:
                      "1px solid rgba(255,255,255,0.90)",
                  }}
                  title="Edit calendar heading"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              )}
            </div>
          </motion.div>

          {editMode && (
            <motion.div
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="mb-5 rounded-2xl px-5 py-4 text-sm font-bold text-slate-600"
              style={{
                background:
                  "rgba(255,255,255,0.64)",
                backdropFilter:
                  "blur(16px)",
                border:
                  "1px solid rgba(244,201,93,0.30)",
                boxShadow:
                  "0 14px 35px rgba(51,65,85,0.06)",
              }}
            >
              Admin tip: click any calendar date to add a holiday, school event, or working day for that BS date.
            </motion.div>
          )}

          {/* ====================================================
              CALENDAR + SIDE PANELS
          ==================================================== */}
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
            {/* MAIN CALENDAR */}
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.55,
                delay: 0.08,
              }}
              className="calendar-glass-card overflow-hidden rounded-[30px]"
              style={{
                background:
                  "rgba(255,255,255,0.74)",
                backdropFilter:
                  "blur(20px)",
                WebkitBackdropFilter:
                  "blur(20px)",
                border:
                  "1px solid rgba(255,255,255,0.94)",
                boxShadow:
                  "0 28px 75px rgba(51,65,85,0.10), inset 0 1px 0 rgba(255,255,255,0.96)",
              }}
            >
              <div className="p-4 md:p-6">
                {/* MONTH NAVIGATION */}
                <div className="mb-5 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      changeMonth(-1)
                    }
                    className="inline-flex h-11 w-11 items-center justify-center rounded-2xl font-black transition-all hover:-translate-y-1"
                    style={{
                      background:
                        "rgba(255,255,255,0.86)",
                      color:
                        "#334155",
                      border:
                        "1px solid rgba(148,163,184,0.18)",
                      boxShadow:
                        "0 10px 24px rgba(51,65,85,0.08)",
                    }}
                    aria-label="Previous BS month"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  <div className="text-center">
                    <div
                      className="text-2xl text-slate-950 md:text-3xl"
                      style={{
                        fontFamily:
                          "var(--font-display)",
                        fontWeight: 900,
                        letterSpacing:
                          "-0.045em",
                      }}
                    >
                      {monthName.np}{" "}
                      {toNepaliNumber(
                        calendarMonth.year
                      )}
                    </div>

                    <div className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                      {monthName.en} ·{" "}
                      {formatAdMonthRange(
                        firstAdDate,
                        lastAdDate
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={
                        goToday
                      }
                      className="mt-2 rounded-full px-4 py-1 text-[11px] font-black uppercase tracking-[0.14em] transition-all hover:-translate-y-0.5"
                      style={{
                        color:
                          "#7C5700",
                        background:
                          colors.goldLight,
                        border:
                          "1px solid rgba(244,201,93,0.55)",
                        boxShadow:
                          "0 8px 20px rgba(244,201,93,0.20)",
                      }}
                    >
                      Today
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      changeMonth(1)
                    }
                    className="inline-flex h-11 w-11 items-center justify-center rounded-2xl font-black transition-all hover:-translate-y-1"
                    style={{
                      background:
                        "rgba(255,255,255,0.86)",
                      color:
                        "#334155",
                      border:
                        "1px solid rgba(148,163,184,0.18)",
                      boxShadow:
                        "0 10px 24px rgba(51,65,85,0.08)",
                    }}
                    aria-label="Next BS month"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>

                {/* WEEKDAYS */}
                <div className="grid grid-cols-7 gap-1.5 text-center text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">
                  {BS_WEEK_DAYS.map(
                    (day, index) => (
                      <div
                        key={day}
                        className="py-1"
                        style={{
                          color:
                            index === 6
                              ? colors.red
                              : undefined,
                        }}
                      >
                        {day}
                      </div>
                    )
                  )}
                </div>

                {/* DAYS */}
                <div className="mt-1.5 grid grid-cols-7 gap-1.5">
                  {monthCells.map(
                    (cell, index) => (
                      <CalendarCell
                        key={
                          cell?.adKey ||
                          `empty-${index}`
                        }
                        cell={cell}
                        todayKey={
                          todayKey
                        }
                        selectedDateKey={
                          selectedDateKey
                        }
                        eventMap={
                          eventMap
                        }
                        saturdayHoliday={
                          content.saturday_holiday !==
                          false
                        }
                        editMode={
                          editMode
                        }
                        onSelect={
                          setSelectedDateKey
                        }
                        onAdminDateClick={
                          onDateSelectForAdmin
                        }
                      />
                    )
                  )}
                </div>

                {/* LEGEND */}
                <div className="mt-5 flex flex-wrap gap-2">
                  <LegendItem type="holiday" />
                  <LegendItem type="event" />
                  <LegendItem type="workingDay" />
                </div>
              </div>
            </motion.div>

            {/* ==================================================
                SIDE PANELS
                SAME GOLDEN SHADE AS SELECTED DATE
            ================================================== */}
            <motion.aside
              initial={{
                opacity: 0,
                x: 24,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.5,
              }}
              className="space-y-4 lg:sticky lg:top-28"
            >
              {/* SELECTED DATE */}
              <div
                className="calendar-glass-card relative overflow-hidden rounded-[26px] p-5 backdrop-blur-xl"
                style={{
                  background:
                    "linear-gradient(145deg, rgba(255,248,220,0.92), rgba(255,241,190,0.78))",
                  backdropFilter:
                    "blur(20px)",
                  WebkitBackdropFilter:
                    "blur(20px)",
                  border:
                    "1px solid rgba(244,201,93,0.48)",
                  boxShadow:
                    "0 24px 60px rgba(244,201,93,0.16), 0 6px 20px rgba(51,65,85,0.06), inset 0 1px 0 rgba(255,255,255,0.95)",
                }}
              >
                <div
                  className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full blur-3xl"
                  style={{
                    background:
                      "rgba(255,255,255,0.55)",
                  }}
                />

                <div className="relative z-10">
                  <div className="text-xs font-black uppercase tracking-[0.16em] text-[#8A6A1F]">
                    Selected Date
                  </div>

                  <div className="mt-2 text-lg font-black leading-snug text-slate-950">
                    {formatCalendarDate(
                      selectedDateKey
                    )}
                  </div>

                  <div className="mt-3 space-y-2">
                    {isSelectedSaturdayHoliday && (
                      <div
                        className="rounded-xl px-4 py-3 text-sm font-bold"
                        style={{
                          background:
                            "rgba(215,25,32,0.08)",
                          color:
                            "#B4232C",
                          border:
                            "1px solid rgba(215,25,32,0.16)",
                        }}
                      >
                        शनिबार बिदा
                      </div>
                    )}

                    {hasWorkingDay && (
                      <div
                        className="rounded-xl px-4 py-3 text-sm font-bold"
                        style={{
                          background:
                            "rgba(255,255,255,0.58)",
                          color:
                            "#475569",
                          border:
                            "1px solid rgba(148,163,184,0.20)",
                        }}
                      >
                        Special working day
                      </div>
                    )}

                    {visibleSelectedEvents.map(
                      (event) => (
                        <button
                          key={event.id}
                          type="button"
                          onClick={() =>
                            setSelectedEvent(
                              event
                            )
                          }
                          className="block w-full text-left"
                        >
                          <EventPill
                            event={
                              event
                            }
                          />
                        </button>
                      )
                    )}

                    {!isSelectedSaturdayHoliday &&
                      !hasWorkingDay &&
                      visibleSelectedEvents.length ===
                        0 && (
                        <div
                          className="rounded-2xl px-4 py-4 text-sm font-semibold text-slate-500"
                          style={{
                            background:
                              "rgba(255,255,255,0.52)",
                            border:
                              "1px solid rgba(244,201,93,0.24)",
                          }}
                        >
                          No school event added for this date.
                        </div>
                      )}
                  </div>
                </div>
              </div>

              {/* UPCOMING DATES */}
              <div
                className="calendar-glass-card relative overflow-hidden rounded-[26px] p-5 backdrop-blur-xl"
                style={{
                  background:
                    "linear-gradient(145deg, rgba(255,248,220,0.92), rgba(255,241,190,0.78))",
                  backdropFilter:
                    "blur(20px)",
                  WebkitBackdropFilter:
                    "blur(20px)",
                  border:
                    "1px solid rgba(244,201,93,0.48)",
                  boxShadow:
                    "0 24px 60px rgba(244,201,93,0.16), 0 6px 20px rgba(51,65,85,0.06), inset 0 1px 0 rgba(255,255,255,0.95)",
                }}
              >
                <div
                  className="pointer-events-none absolute -bottom-16 -left-16 h-36 w-36 rounded-full blur-3xl"
                  style={{
                    background:
                      "rgba(255,255,255,0.48)",
                  }}
                />

                <div className="relative z-10">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[#8A6A1F]">
                    <Clock className="h-4 w-4" />
                    Upcoming Dates
                  </div>

                  <div className="mt-3 space-y-2">
                    {upcomingEvents.length >
                    0 ? (
                      upcomingEvents.map(
                        (event) => {
                          const style =
                            calendarTypeStyles[
                              event.type
                            ] ||
                            calendarTypeStyles.notice;

                          return (
                            <button
                              key={`upcoming-${event.id}`}
                              type="button"
                              onClick={() => {
                                setSelectedDateKey(
                                  event.dateKey
                                );
                                setSelectedEvent(
                                  event
                                );
                              }}
                              className="flex w-full gap-3 rounded-2xl p-3.5 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                              style={{
                                background:
                                  "rgba(255,255,255,0.58)",
                                border:
                                  "1px solid rgba(244,201,93,0.24)",
                                boxShadow:
                                  "inset 0 1px 0 rgba(255,255,255,0.82)",
                              }}
                            >
                              <div
                                className="mt-1 h-3 w-3 shrink-0 rounded-full"
                                style={{
                                  background:
                                    style.color,
                                }}
                              />

                              <div className="min-w-0">
                                <div className="text-xs font-bold text-[#8A6A1F]">
                                  {formatCalendarDate(
                                    event.dateKey
                                  )}
                                </div>

                                <div className="truncate text-sm font-black text-slate-950">
                                  {
                                    event.title
                                  }
                                </div>

                                <div
                                  className="text-xs font-bold"
                                  style={{
                                    color:
                                      style.color,
                                  }}
                                >
                                  {
                                    style.label
                                  }
                                </div>
                              </div>
                            </button>
                          );
                        }
                      )
                    ) : (
                      <div
                        className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-500"
                        style={{
                          background:
                            "rgba(255,255,255,0.52)",
                          border:
                            "1px solid rgba(244,201,93,0.24)",
                        }}
                      >
                        No upcoming events added yet.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.aside>
          </div>
        </div>
      </section>

      {/* ========================================================
          EVENT DETAIL MODAL
      ======================================================== */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            style={{
              background:
                "rgba(15,23,42,0.32)",
              backdropFilter:
                "blur(14px)",
              WebkitBackdropFilter:
                "blur(14px)",
            }}
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
              setSelectedEvent(
                null
              )
            }
          >
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
                scale: 0.94,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: 12,
                scale: 0.96,
              }}
              className="w-full max-w-lg overflow-hidden rounded-[28px] bg-white"
              style={{
                boxShadow:
                  "0 42px 110px rgba(15,23,42,0.22)",
                border:
                  "1px solid rgba(255,255,255,0.92)",
              }}
              onClick={(event) =>
                event.stopPropagation()
              }
            >
              <div
                className="h-1.5"
                style={{
                  background:
                    "linear-gradient(90deg, #F4C95D, #8ED8EA, #D8C1FF)",
                }}
              />

              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                      {formatCalendarDate(
                        selectedEvent.dateKey
                      )}
                    </div>

                    <h3 className="mt-2 text-2xl font-black text-slate-950">
                      {
                        selectedEvent.title
                      }
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedEvent(
                        null
                      )
                    }
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition hover:bg-slate-200"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div
                  className="mt-5 rounded-2xl p-4"
                  style={{
                    background:
                      "linear-gradient(145deg, #FFF8DC, #FFF1BE)",
                    border:
                      "1px solid rgba(244,201,93,0.30)",
                  }}
                >
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-[#8A6A1F]">
                    <CalendarDays className="h-4 w-4" />
                    {calendarTypeStyles[
                      selectedEvent
                        .type
                    ]?.label ||
                      "Event"}
                  </div>
                </div>

                {selectedEvent.description && (
                  <p className="mt-4 whitespace-pre-line leading-relaxed text-slate-600">
                    {
                      selectedEvent.description
                    }
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Calendar;
