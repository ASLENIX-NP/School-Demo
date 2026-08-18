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
  { value: "holiday", label: "Holiday", labelNp: "बिदा" },
  { value: "event", label: "School Event", labelNp: "कार्यक्रम" },
  { value: "workingDay", label: "Working Day", labelNp: "कार्य दिन" },
];

export const calendarTypeStyles = {
  holiday: {
    label: "Holiday",
    labelNp: "बिदा",
    color: colors.red,
    background: "rgba(215,25,32,0.08)",
    border: "rgba(215,25,32,0.18)",
    dotColor: colors.red,
  },
  exam: {
    label: "Exam",
    labelNp: "परीक्षा",
    color: colors.blue,
    background: "rgba(24,119,242,0.08)",
    border: "rgba(24,119,242,0.18)",
    dotColor: colors.blue,
  },
  event: {
    label: "Event",
    labelNp: "कार्यक्रम",
    color: colors.blue,
    background: "rgba(24,119,242,0.08)",
    border: "rgba(24,119,242,0.18)",
    dotColor: colors.blue,
  },
  admission: {
    label: "Admission",
    labelNp: "भर्ना",
    color: colors.blue,
    background: "rgba(24,119,242,0.08)",
    border: "rgba(24,119,242,0.18)",
    dotColor: colors.blue,
  },
  result: {
    label: "Result",
    labelNp: "नतिजा",
    color: colors.blue,
    background: "rgba(24,119,242,0.08)",
    border: "rgba(24,119,242,0.18)",
    dotColor: colors.blue,
  },
  workingDay: {
    label: "Working Day",
    labelNp: "कार्य दिन",
    color: colors.dark,
    background: "rgba(15,23,42,0.04)",
    border: "rgba(15,23,42,0.08)",
    dotColor: colors.orange,
  },
  notice: {
    label: "Notice",
    labelNp: "सूचना",
    color: colors.blue,
    background: "rgba(24,119,242,0.08)",
    border: "rgba(24,119,242,0.18)",
    dotColor: colors.blue,
  },
};

// Nepali calendar data
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

const BS_WEEK_DAYS = ["आइत", "सोम", "मंगल", "बुध", "बिहि", "शुक्र", "शनि"];

const BS_CALENDAR_DATA = {
  2082: { startAd: "2025-04-14", months: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30] },
  2083: { startAd: "2026-04-14", months: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30] },
  2084: { startAd: "2027-04-14", months: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30] },
};

const FALLBACK_BS_YEAR = 2083;
const FALLBACK_BS_MONTH_INDEX = 3;

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
    return new Date(value.getFullYear(), value.getMonth(), value.getDate());
  }
  const clean = String(value).trim();
  const match = clean.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    const [, year, month, day] = match;
    return new Date(Number(year), Number(month) - 1, Number(day));
  }
  const parsed = new Date(clean);
  if (Number.isNaN(parsed.getTime())) return null;
  return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
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
  const digits = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
  return String(value ?? "").replace(/\d/g, (digit) => digits[Number(digit)]);
}

function getBsMonthLength(year, monthIndex) {
  return BS_CALENDAR_DATA[year]?.months?.[monthIndex] || 30;
}

function getBsYearStartDate(year) {
  return parseDateOnly(BS_CALENDAR_DATA[year]?.startAd);
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
    const nextYearStart = getBsYearStartDate(numericYear + 1);
    if (date >= start && (!nextYearStart || date < nextYearStart)) {
      let remaining = Math.round((date.getTime() - start.getTime()) / 86400000);
      for (let monthIndex = 0; monthIndex < 12; monthIndex += 1) {
        const length = getBsMonthLength(numericYear, monthIndex);
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
  const month = BS_MONTHS[bsDate.monthIndex] || BS_MONTHS[0];
  return `${month.np} ${toNepaliNumber(bsDate.day)}, ${toNepaliNumber(bsDate.year)} वि.सं.`;
}

export function formatCalendarDate(adDateKey) {
  const adDate = parseDateOnly(adDateKey);
  const bsDate = adToBsDate(adDate);
  if (!adDate || !bsDate) {
    return adDateKey || "No date";
  }
  return `${formatBsFullDate(bsDate)} · ${adDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`;
}

function formatAdMonthRange(firstDate, lastDate) {
  if (!firstDate || !lastDate) return "";
  return `${firstDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })} – ${lastDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`;
}

function getAdDateRangeKeys(startBs, endBs) {
  // Calendar admin events are saved in BS format:
  // 2083-04-29, 2083-04-30, etc.
  // Convert those BS dates to AD before putting them into eventMap.
  if (!startBs) return [];

  const startMatch = String(startBs).trim().match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  const endMatch = String(endBs || startBs)
    .trim()
    .match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);

  if (!startMatch || !endMatch) return [];

  const startYear = Number(startMatch[1]);
  const startMonthIndex = Number(startMatch[2]) - 1;
  const startDay = Number(startMatch[3]);

  const endYear = Number(endMatch[1]);
  const endMonthIndex = Number(endMatch[2]) - 1;
  const endDay = Number(endMatch[3]);

  const start = bsToAdDate(startYear, startMonthIndex, startDay);
  const end = bsToAdDate(endYear, endMonthIndex, endDay);

  if (!start || !end) return [];

  const safeStart = start <= end ? start : end;
  const safeEnd = start <= end ? end : start;

  const keys = [];

  for (
    let current = new Date(safeStart);
    current <= safeEnd;
    current = addDays(current, 1)
  ) {
    keys.push(formatDateKey(current));
  }

  return keys;
}

function inferCalendarEventType({ title = "", category = "", type = "" } = {}) {
  const explicitType = String(type || "").trim();
  const normalizedExplicitType = explicitType.toLowerCase();

  if (normalizedExplicitType === "holiday") {
    return "holiday";
  }

  if (normalizedExplicitType === "event") {
    return "event";
  }

  if (
    normalizedExplicitType === "workingday" ||
    normalizedExplicitType === "working_day" ||
    normalizedExplicitType === "working day"
  ) {
    return "workingDay";
  }
  const text = `${title} ${category}`.toLowerCase();
  if (text.includes("holiday") || text.includes("vacation") || text.includes("closed") || text.includes("बिदा")) {
    return "holiday";
  }
  if (text.includes("working") || text.includes("open saturday") || text.includes("कार्य दिन")) {
    return "workingDay";
  }
  if (text.includes("exam") || text.includes("examination") || text.includes("परीक्षा")) {
    return "exam";
  }
  return "event";
}

export function normalizeCalendarEvent(event = {}, index = 0) {
  return {
    id: event.id || `${Date.now()}-${index}`,
    title: event.title || "School calendar item",
    type: inferCalendarEventType({
      title: event.title,
      category: event.category,
      type: event.type || event.event_type || event.eventType,
    }),
    start_bs: event.start_bs || event.startBs || event.bs_date || event.bsDate || "",
    end_bs: event.end_bs || event.endBs || event.start_bs || event.startBs || event.bs_date || event.bsDate || "",
    description: event.description || event.note || "",
    visible: event.visible !== false,
  };
}

export function mergeCalendarContent(saved = {}) {
  const rawEvents = parseJsonList(saved?.events || saved?.calendar_events || []);
  return {
    ...defaultCalendarContent,
    ...(saved || {}),
    saturday_holiday: saved?.saturday_holiday !== false,
    show_notice_dates: saved?.show_notice_dates !== false,
    events: rawEvents.map(normalizeCalendarEvent),
  };
}

function normalizeCalendarEvents(rawEvents = [], source = "manual") {
  const events = parseJsonList(rawEvents);
  return events
    .filter((event) => event && event.visible !== false)
    .flatMap((event, index) => {
      const item = normalizeCalendarEvent(event, index);
      const dateKeys = getAdDateRangeKeys(item.start_bs, item.end_bs || item.start_bs);
      if (!dateKeys.length) return [];
      return dateKeys.map((dateKey) => ({
        id: `${source}-${item.id || index}-${dateKey}`,
        title: item.title,
        type: item.type,
        dateKey,
        description: item.description || "",
        source,
      }));
    });
}

function getCalendarEventsFromNotices(notices = []) {
  return notices
    .filter((notice) => notice?.notice_date)
    .flatMap((notice, index) => {
      const dateKeys = getAdDateRangeKeys(
        notice.notice_date,
        notice.end_date || notice.endDate || notice.notice_date
      );
      return dateKeys.map((dateKey) => ({
        id: `notice-${notice.id || index}-${dateKey}`,
        title: notice.title || "School notice",
        type: "event",
        dateKey,
        description: notice.description || "",
        source: "notice",
      }));
    });
}

function getBsMonthCells(bsYear, bsMonthIndex) {
  const monthLength = getBsMonthLength(bsYear, bsMonthIndex);
  const firstAdDate = bsToAdDate(bsYear, bsMonthIndex, 1);
  const cells = [];
  if (!firstAdDate) return cells;
  for (let index = 0; index < firstAdDate.getDay(); index += 1) {
    cells.push(null);
  }
  for (let day = 1; day <= monthLength; day += 1) {
    const adDate = bsToAdDate(bsYear, bsMonthIndex, day);
    cells.push({
      bsYear,
      bsMonthIndex,
      bsDay: day,
      bsKey: `${bsYear}-${String(bsMonthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      adDate,
      adKey: formatDateKey(adDate),
    });
  }
  while (cells.length % 7 !== 0) {
    cells.push(null);
  }
  return cells;
}

function getPreviousBsMonth(monthState) {
  if (monthState.monthIndex === 0) {
    return { year: monthState.year - 1, monthIndex: 11 };
  }
  return { year: monthState.year, monthIndex: monthState.monthIndex - 1 };
}

function getNextBsMonth(monthState) {
  if (monthState.monthIndex === 11) {
    return { year: monthState.year + 1, monthIndex: 0 };
  }
  return { year: monthState.year, monthIndex: monthState.monthIndex + 1 };
}

function isSupportedBsMonth(monthState) {
  return Boolean(BS_CALENDAR_DATA[monthState.year]);
}

function normalizeNotice(notice = {}) {
  return {
    id: notice.id,
    title: notice.title || "",
    category: notice.category || "General",
    notice_date: notice.notice_date || notice.date || "",
    description: notice.description || "",
    pinned: Boolean(notice.pinned),
    created_at: notice.created_at || notice.createdAt || "",
  };
}

function LegendItem({ type }) {
  const style = calendarTypeStyles[type] || calendarTypeStyles.notice;
  return (
    <div
      className="flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold"
      style={{
        background: "rgba(255,255,255,0.72)",
        color: "#475569",
        border: "1px solid rgba(148,163,184,0.14)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.92)",
      }}
    >
      <span
        className="h-2.5 w-2.5 rounded-full"
        style={{ background: style.color }}
      />
      {style.labelNp || style.label}
    </div>
  );
}

// ============================================================
// FIXED CalendarCell - proper event detection and colors
// ============================================================
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
    return <div className="calendar-empty-cell" />;
  }

  const dayEvents = eventMap[cell.adKey] || [];

  const hasWorkingDay = dayEvents.some(
    (event) => event.type === "workingDay"
  );

  const isSaturday = cell.adDate.getDay() === 6;
  const isSaturdayHoliday =
    saturdayHoliday && isSaturday && !hasWorkingDay;

  const visibleEvents = dayEvents.filter(
    (event) => event.type !== "workingDay"
  );

  const hasHoliday = visibleEvents.some(
    (event) => event.type === "holiday"
  );

  const hasEvent = visibleEvents.some(
    (event) =>
      event.type === "event" ||
      event.type === "exam" ||
      event.type === "admission" ||
      event.type === "result" ||
      event.type === "notice"
  );

  const isToday = cell.adKey === todayKey;
  const isSelected = cell.adKey === selectedDateKey;

  let cellClass = "calendar-day";

  if (isSaturdayHoliday || hasHoliday) {
    cellClass += " calendar-day-holiday";
  } else if (hasEvent) {
    cellClass += " calendar-day-event";
  }

  if (isSelected) {
    cellClass += " calendar-day-selected";
  } else if (isToday) {
    cellClass += " calendar-day-today";
  }

  const eventDots = visibleEvents.slice(0, 4);

  return (
    <motion.button
      type="button"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => {
        onSelect(cell.adKey);

        if (editMode) {
          onAdminDateClick(cell);
        }
      }}
      className={cellClass}
      aria-label={`Select ${cell.adKey}`}
    >
      <span className="calendar-day-bs">{toNepaliNumber(cell.bsDay)}</span>

      <span className="calendar-day-ad">{cell.adDate.getDate()}</span>

      {eventDots.length > 0 && (
        <div className="calendar-event-dots">
          {eventDots.map((event, idx) => (
            <span
              key={`${event.id}-${idx}`}
              className="calendar-event-dot"
              style={{
                background:
                  event.type === "holiday"
                    ? "#A62B4B"
                    : "#1E5A78",
              }}
            />
          ))}
        </div>
      )}
    </motion.button>
  );
}

function EventPill({ event }) {
  const style =
    calendarTypeStyles[event.type] || calendarTypeStyles.notice;

  return (
    <div
      className="calendar-event-pill"
      style={{
        "--event-color": style.color,
        "--event-bg": style.background,
        "--event-border": style.border,
      }}
    >
      <div className="calendar-event-pill-label">
        {style.labelNp || style.label}
      </div>

      <div className="calendar-event-pill-title">
        {event.title}
      </div>

      {event.description && (
        <p className="calendar-event-pill-description">
          {event.description}
        </p>
      )}
    </div>
  );
}

// ============================================================
// Main Calendar Component
// ============================================================
export function Calendar({
  contentOverride = null,
  noticesOverride = null,
  editMode = false,
  onEditTarget = () => {},
  onDateSelectForAdmin = () => {},
}) {
  const [content, setContent] = useState(() =>
    mergeCalendarContent(contentOverride || defaultCalendarContent)
  );
  const [notices, setNotices] = useState(
    Array.isArray(noticesOverride) ? noticesOverride.map(normalizeNotice) : []
  );
  const [selectedEvent, setSelectedEvent] = useState(null);

  const today = useMemo(() => new Date(), []);
  const todayKey = formatDateKey(today);
  const todayBs = adToBsDate(today) || {
    year: FALLBACK_BS_YEAR,
    monthIndex: FALLBACK_BS_MONTH_INDEX,
    day: 1,
    adDate: today,
    adKey: todayKey,
  };

  const [calendarMonth, setCalendarMonth] = useState(() => ({
    year: todayBs.year,
    monthIndex: todayBs.monthIndex,
  }));

  const [selectedDateKey, setSelectedDateKey] = useState(todayBs.adKey || todayKey);

  useEffect(() => {
    if (contentOverride) {
      setContent(mergeCalendarContent(contentOverride));
      setNotices(Array.isArray(noticesOverride) ? noticesOverride.map(normalizeNotice) : []);
      return;
    }
    let alive = true;
    const loadCalendar = async () => {
      try {
        const result = await fetchJsonWithTimeout(`${API_URL}/api/site-content/calendar`);
        if (!alive) return;
        const savedContent = mergeCalendarContent(result?.data?.content || {});
        console.log("Loaded calendar content:", savedContent);
        setContent(savedContent);
      } catch (error) {
        console.error("Calendar content load error:", error);
        if (alive) {
          setContent(mergeCalendarContent(defaultCalendarContent));
        }
      }
    };
    const loadNotices = async () => {
      try {
        const result = await fetchJsonWithTimeout(`${API_URL}/api/notices`);
        if (!alive) return;
        const rawNotices = Array.isArray(result) ? result : Array.isArray(result?.data) ? result.data : [];
        setNotices(rawNotices.map(normalizeNotice));
      } catch (error) {
        console.error("Calendar notices load error:", error);
      }
    };
    loadCalendar();
    loadNotices();
    return () => {
      alive = false;
    };
  }, [contentOverride, noticesOverride]);

  const manualEvents = useMemo(() => {
    const events = normalizeCalendarEvents(content.events, "manual");
    console.log("Manual events:", events);
    return events;
  }, [content.events]);

  const noticeEvents = useMemo(
    () => (content.show_notice_dates === false ? [] : getCalendarEventsFromNotices(notices)),
    [content.show_notice_dates, notices]
  );

  const allEvents = useMemo(() => {
    const combined = [...manualEvents, ...noticeEvents];
    console.log("All events:", combined);
    return combined;
  }, [manualEvents, noticeEvents]);

  const eventMap = useMemo(() => {
    const map = {};
    allEvents.forEach((event) => {
      if (!map[event.dateKey]) {
        map[event.dateKey] = [];
      }
      map[event.dateKey].push(event);
    });
    console.log("Calendar eventMap (AD keys):", map);
    return map;
  }, [allEvents]);

  const monthCells = useMemo(
    () => getBsMonthCells(calendarMonth.year, calendarMonth.monthIndex),
    [calendarMonth]
  );

  const selectedAdDate = parseDateOnly(selectedDateKey) || today;
  const selectedDateEvents = eventMap[selectedDateKey] || [];
  const hasWorkingDay = selectedDateEvents.some((event) => event.type === "workingDay");
  const isSelectedSaturdayHoliday = content.saturday_holiday !== false && selectedAdDate.getDay() === 6 && !hasWorkingDay;
  const visibleSelectedEvents = selectedDateEvents.filter((event) => event.type !== "workingDay");

  const upcomingEvents = allEvents
    .filter((event) => event.type !== "workingDay" && event.dateKey >= todayKey)
    .sort((a, b) => a.dateKey.localeCompare(b.dateKey))
    .slice(0, 6);

  const firstAdDate = bsToAdDate(calendarMonth.year, calendarMonth.monthIndex, 1);
  const lastAdDate = bsToAdDate(
    calendarMonth.year,
    calendarMonth.monthIndex,
    getBsMonthLength(calendarMonth.year, calendarMonth.monthIndex)
  );
  const monthName = BS_MONTHS[calendarMonth.monthIndex] || BS_MONTHS[0];

  const changeMonth = (amount) => {
    setCalendarMonth((current) => {
      const next = amount > 0 ? getNextBsMonth(current) : getPreviousBsMonth(current);
      return isSupportedBsMonth(next) ? next : current;
    });
  };

  const goToday = () => {
    setCalendarMonth({ year: todayBs.year, monthIndex: todayBs.monthIndex });
    setSelectedDateKey(todayBs.adKey || todayKey);
  };

  const eventCount = content.events?.filter((event) => event.visible !== false && event.type !== "workingDay").length || 0;
  const holidayCount = content.events?.filter((event) => event.visible !== false && event.type === "holiday").length || 0;

  return (
    <>
      <style>{`
        /* =========================================================
           RED ROSE CALENDAR - ABOUT PAGE VISUAL SYSTEM
        ========================================================= */

        .rr-calendar-page {
          --rr-cream: #f5ede0;
          --rr-paper: #fbf7ef;
          --rr-paper-2: #fffaf2;
          --rr-burgundy: #2a1422;
          --rr-burgundy-2: #3b1728;
          --rr-maroon: #a62b4b;
          --rr-gold: #c9953d;
          --rr-gold-light: #ead4a4;
          --rr-text: #251725;
          --rr-muted: #756a70;
          min-height: 100vh;
          padding: 54px 0 90px;
          background: var(--rr-cream);
          color: var(--rr-text);
          position: relative;
          overflow: hidden;
        }

        .rr-calendar-page::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            radial-gradient(circle at 10% 18%, rgba(201,149,61,.08), transparent 28%),
            radial-gradient(circle at 92% 64%, rgba(166,43,75,.055), transparent 28%);
        }

        .rr-calendar-wrap {
          width: min(1280px, calc(100% - 48px));
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        /* HERO - deliberately follows the dark About-page section */
        .rr-calendar-hero {
          position: relative;
          overflow: hidden;
          min-height: 410px;
          padding: 64px 64px 78px;
          border-radius: 0 0 38px 38px;
          background:
            radial-gradient(circle at 88% 20%, rgba(166,43,75,.28), transparent 30%),
            radial-gradient(circle at 15% 85%, rgba(201,149,61,.09), transparent 32%),
            linear-gradient(135deg, #1b101c 0%, #2a1422 58%, #351725 100%);
          box-shadow: 0 28px 70px rgba(42,20,34,.18);
          color: white;
        }

        .rr-calendar-hero::before {
          content: "";
          position: absolute;
          inset: 0;
          opacity: .20;
          background-image:
            radial-gradient(rgba(255,255,255,.22) .8px, transparent .8px);
          background-size: 22px 22px;
          mask-image: linear-gradient(to bottom, black 10%, transparent 100%);
          pointer-events: none;
        }

        /* Zig-zag paper edge, matching the About/Academics sections */
        .rr-calendar-hero::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: -1px;
          height: 25px;
          background:
            linear-gradient(135deg, transparent 10px, var(--rr-cream) 0) 0 0 / 40px 25px repeat-x;
          clip-path: polygon(
            0 42%, 2% 100%, 5% 42%, 7% 100%, 10% 42%, 12% 100%,
            15% 42%, 17% 100%, 20% 42%, 22% 100%, 25% 42%, 27% 100%,
            30% 42%, 32% 100%, 35% 42%, 37% 100%, 40% 42%, 42% 100%,
            45% 42%, 47% 100%, 50% 42%, 52% 100%, 55% 42%, 57% 100%,
            60% 42%, 62% 100%, 65% 42%, 67% 100%, 70% 42%, 72% 100%,
            75% 42%, 77% 100%, 80% 42%, 82% 100%, 85% 42%, 87% 100%,
            90% 42%, 92% 100%, 95% 42%, 97% 100%, 100% 42%, 100% 100%, 0 100%
          );
        }

        .rr-calendar-hero-content {
          position: relative;
          z-index: 2;
          max-width: 900px;
        }

        .rr-calendar-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
          color: #e6c77e;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: .22em;
          text-transform: uppercase;
        }

        .rr-calendar-eyebrow::before {
          content: "";
          width: 40px;
          height: 1px;
          background: #c9953d;
        }

        .rr-calendar-hero h1 {
          margin: 0;
          max-width: 820px;
          font-family: var(--font-display);
          font-size: clamp(48px, 6vw, 78px);
          line-height: .98;
          font-weight: 900;
          letter-spacing: -.055em;
          color: #fffaf5;
        }

        .rr-calendar-hero h1 span {
          color: #e8c978;
        }

        .rr-calendar-hero-description {
          max-width: 800px;
          margin-top: 24px;
          color: rgba(255,248,241,.78);
          font-size: 17px;
          line-height: 1.75;
        }

        .rr-calendar-hero-bottom {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 14px;
          margin-top: 30px;
        }

        .rr-calendar-est {
          display: inline-flex;
          align-items: center;
          padding: 9px 15px;
          border: 1px solid rgba(232,201,120,.35);
          border-radius: 999px;
          color: #e8c978;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: .18em;
          text-transform: uppercase;
        }

        .rr-calendar-stats {
          display: inline-flex;
          align-items: stretch;
          border-left: 1px solid rgba(255,255,255,.14);
          margin-left: 4px;
        }

        .rr-calendar-stat {
          padding: 0 22px;
          border-right: 1px solid rgba(255,255,255,.12);
        }

        .rr-calendar-stat strong {
          display: block;
          color: #e8c978;
          font-family: var(--font-display);
          font-size: 25px;
          line-height: 1;
        }

        .rr-calendar-stat small {
          display: block;
          margin-top: 7px;
          color: rgba(255,255,255,.55);
          font-size: 9px;
          font-weight: 800;
          letter-spacing: .13em;
          text-transform: uppercase;
        }

        /* SECTION HEADING */
        .rr-calendar-section-heading {
          padding: 78px 0 30px;
        }

        .rr-calendar-section-kicker {
          display: flex;
          align-items: center;
          gap: 12px;
          color: var(--rr-maroon);
          font-size: 11px;
          font-weight: 900;
          letter-spacing: .23em;
          text-transform: uppercase;
        }

        .rr-calendar-section-kicker::before {
          content: "";
          width: 34px;
          height: 1px;
          background: var(--rr-gold);
        }

        .rr-calendar-section-heading h2 {
          margin: 12px 0 0;
          font-family: var(--font-display);
          font-size: clamp(38px, 4vw, 56px);
          line-height: 1.05;
          letter-spacing: -.045em;
          font-weight: 900;
          color: var(--rr-text);
        }

        .rr-calendar-section-heading h2 span {
          color: var(--rr-maroon);
        }

        .rr-calendar-section-heading p {
          max-width: 780px;
          margin-top: 12px;
          color: var(--rr-muted);
          font-size: 16px;
          line-height: 1.7;
        }

        /* MAIN CALENDAR - one long paper-like container */
        .rr-calendar-main-card {
          overflow: hidden;
          position: relative;
          background: var(--rr-paper);
          border: 1px solid #eadfcf;
          border-radius: 30px;
          box-shadow: 0 24px 55px rgba(69,48,38,.10);
        }

        .rr-calendar-main-card::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: -1px;
          height: 18px;
          background: var(--rr-cream);
          clip-path: polygon(
            0 35%, 2% 100%, 5% 35%, 8% 100%, 11% 35%, 14% 100%,
            17% 35%, 20% 100%, 23% 35%, 26% 100%, 29% 35%, 32% 100%,
            35% 35%, 38% 100%, 41% 35%, 44% 100%, 47% 35%, 50% 100%,
            53% 35%, 56% 100%, 59% 35%, 62% 100%, 65% 35%, 68% 100%,
            71% 35%, 74% 100%, 77% 35%, 80% 100%, 83% 35%, 86% 100%,
            89% 35%, 92% 100%, 95% 35%, 98% 100%, 100% 35%, 100% 100%, 0 100%
          );
        }

        .rr-calendar-controls {
          display: grid;
          grid-template-columns: 50px 1fr 50px;
          align-items: center;
          gap: 18px;
          padding: 30px 34px 24px;
          border-bottom: 1px solid #e9dece;
        }

        .rr-calendar-nav {
          width: 46px;
          height: 46px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #dfd2c0;
          border-radius: 50%;
          background: #fffaf3;
          color: var(--rr-text);
          cursor: pointer;
          transition: .2s ease;
        }

        .rr-calendar-nav:hover {
          transform: translateY(-2px);
          border-color: var(--rr-gold);
          color: var(--rr-maroon);
          box-shadow: 0 10px 20px rgba(69,48,38,.08);
        }

        .rr-calendar-month {
          text-align: center;
        }

        .rr-calendar-month-title {
          font-family: var(--font-display);
          font-size: 30px;
          line-height: 1;
          font-weight: 900;
          letter-spacing: -.04em;
          color: var(--rr-text);
        }

        .rr-calendar-month-range {
          margin-top: 7px;
          color: var(--rr-muted);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: .15em;
          text-transform: uppercase;
        }

        .rr-calendar-today {
          margin-top: 12px;
          padding: 8px 18px;
          border: 1px solid #dec17d;
          border-radius: 999px;
          background: #fff4d8;
          color: #76571e;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: .15em;
          text-transform: uppercase;
          cursor: pointer;
        }

        .rr-calendar-grid-wrap {
          padding: 24px 34px 34px;
        }

        .rr-calendar-weekdays {
          display: grid;
          grid-template-columns: repeat(7, minmax(0, 1fr));
          gap: 10px;
          margin-bottom: 10px;
        }

        .rr-calendar-weekday {
          padding: 8px 2px;
          text-align: center;
          color: #81747a;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: .08em;
          text-transform: uppercase;
        }

        .rr-calendar-weekday.saturday {
          color: var(--rr-maroon);
        }

        .rr-calendar-days {
          display: grid;
          grid-template-columns: repeat(7, minmax(0, 1fr));
          gap: 10px;
        }

        .calendar-empty-cell {
          min-height: 78px;
        }

        .calendar-day {
          position: relative;
          min-height: 78px;
          padding: 11px 7px;
          border: 1px solid #e5d9c8;
          border-radius: 14px;
          background: #fffdf8;
          color: var(--rr-text);
          cursor: pointer;
          transition: .2s ease;
        }

        .calendar-day:hover {
          border-color: #c9953d;
          background: #fffaf1;
          box-shadow: 0 9px 20px rgba(69,48,38,.08);
        }

        .calendar-day-bs {
          display: block;
          font-family: var(--font-display);
          font-size: 22px;
          line-height: 1;
          font-weight: 900;
        }

        .calendar-day-ad {
          display: block;
          margin-top: 6px;
          color: #8e8286;
          font-size: 10px;
          font-weight: 800;
        }

        .calendar-day-holiday {
          background: #fce8e8;
          border-color: #e8b8bf;
          color: #a62b4b;
        }

        .calendar-day-holiday:hover {
          background: #f9dfe2;
          border-color: #a62b4b;
        }

        .calendar-day-event {
          background: #edf4f7;
          border-color: #bfd2db;
          color: #1e5a78;
        }

        .calendar-day-event:hover {
          background: #e3eff3;
          border-color: #1e5a78;
        }

        .calendar-day-selected {
          outline: 3px solid rgba(201,149,61,.18);
          border: 2px solid #c9953d !important;
          box-shadow: 0 0 0 1px #c9953d, 0 12px 24px rgba(201,149,61,.15);
        }

        .calendar-day-today:not(.calendar-day-selected) {
          border: 2px solid #a62b4b;
        }

        .calendar-event-dots {
          position: absolute;
          left: 50%;
          bottom: 8px;
          transform: translateX(-50%);
          display: flex;
          gap: 4px;
        }

        .calendar-event-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
        }

        .rr-calendar-legend {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          padding-top: 20px;
          border-top: 1px solid #e9dece;
        }

        .rr-calendar-legend-item {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border: 1px solid #e3d7c5;
          border-radius: 999px;
          background: #fffaf2;
          color: #756a70;
          font-size: 11px;
          font-weight: 800;
        }

        .rr-calendar-legend-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        /* BELOW THE CALENDAR: same clean section rhythm as About */
        .rr-calendar-info-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 22px;
          margin-top: 28px;
        }

        .rr-calendar-info-card {
          position: relative;
          overflow: hidden;
          padding: 28px;
          background: var(--rr-paper);
          border: 1px solid #eadfcf;
          border-radius: 24px;
          box-shadow: 0 18px 42px rgba(69,48,38,.08);
        }

        .rr-calendar-info-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 32px;
          width: 42px;
          height: 6px;
          border-radius: 0 0 6px 6px;
          background: var(--rr-maroon);
        }

        .rr-calendar-info-card:nth-child(2)::before {
          background: var(--rr-gold);
        }

        .rr-calendar-info-label {
          margin-bottom: 9px;
          color: var(--rr-maroon);
          font-size: 10px;
          font-weight: 900;
          letter-spacing: .18em;
          text-transform: uppercase;
        }

        .rr-calendar-info-card:nth-child(2) .rr-calendar-info-label {
          color: #8a681e;
        }

        .rr-calendar-info-card h3 {
          margin: 0;
          font-family: var(--font-display);
          font-size: 28px;
          line-height: 1.05;
          font-weight: 900;
          letter-spacing: -.035em;
          color: var(--rr-text);
        }

        .rr-calendar-info-list {
          margin-top: 18px;
          display: grid;
          gap: 10px;
        }

        .rr-calendar-empty-message {
          padding: 15px 16px;
          border: 1px solid #eadfcf;
          border-radius: 14px;
          background: #fffaf3;
          color: #81747a;
          font-size: 13px;
          font-weight: 700;
          line-height: 1.55;
        }

        .rr-calendar-upcoming-item {
          width: 100%;
          display: flex;
          gap: 12px;
          padding: 14px;
          text-align: left;
          border: 1px solid #eadfcf;
          border-radius: 14px;
          background: #fffaf3;
          cursor: pointer;
          transition: .2s ease;
        }

        .rr-calendar-upcoming-item:hover {
          transform: translateY(-2px);
          border-color: #d7c29d;
          box-shadow: 0 9px 20px rgba(69,48,38,.07);
        }

        .rr-calendar-upcoming-dot {
          width: 9px;
          height: 9px;
          flex: 0 0 auto;
          margin-top: 6px;
          border-radius: 50%;
        }

        .rr-calendar-upcoming-date {
          color: #8a681e;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: .05em;
        }

        .rr-calendar-upcoming-title {
          margin-top: 3px;
          color: var(--rr-text);
          font-size: 14px;
          font-weight: 900;
        }

        .rr-calendar-upcoming-type {
          margin-top: 3px;
          font-size: 10px;
          font-weight: 800;
        }

        .rr-calendar-selected-event {
          width: 100%;
          text-align: left;
          border: 0;
          background: transparent;
          padding: 0;
          cursor: pointer;
        }

        .calendar-event-pill {
          padding: 15px 16px;
          border: 1px solid var(--event-border);
          border-left: 4px solid var(--event-color);
          border-radius: 14px;
          background: var(--event-bg);
        }

        .calendar-event-pill-label {
          color: var(--event-color);
          font-size: 9px;
          font-weight: 900;
          letter-spacing: .14em;
          text-transform: uppercase;
        }

        .calendar-event-pill-title {
          margin-top: 4px;
          color: var(--rr-text);
          font-size: 15px;
          font-weight: 900;
        }

        .calendar-event-pill-description {
          margin-top: 5px;
          color: #756a70;
          font-size: 12px;
          line-height: 1.55;
        }

        /* EDIT MODE */
        .rr-calendar-edit-tip {
          margin-top: 18px;
          padding: 14px 18px;
          border: 1px solid #dfc78f;
          border-radius: 12px;
          background: #fff8e7;
          color: #72591f;
          font-size: 13px;
          font-weight: 700;
        }

        /* MODAL */
        .rr-calendar-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: rgba(37,23,37,.58);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }

        .rr-calendar-modal {
          width: min(560px, 100%);
          overflow: hidden;
          border: 1px solid #e7dac8;
          border-radius: 24px;
          background: var(--rr-paper);
          box-shadow: 0 35px 90px rgba(37,23,37,.25);
        }

        .rr-calendar-modal-bar {
          height: 6px;
          background: linear-gradient(90deg, #a62b4b, #c9953d);
        }

        .rr-calendar-modal-body {
          padding: 28px;
        }

        .rr-calendar-modal-date {
          color: #8a681e;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: .15em;
          text-transform: uppercase;
        }

        .rr-calendar-modal h3 {
          margin-top: 8px;
          font-family: var(--font-display);
          font-size: 32px;
          line-height: 1.05;
          font-weight: 900;
          color: var(--rr-text);
        }

        .rr-calendar-modal-close {
          width: 40px;
          height: 40px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #e3d7c5;
          border-radius: 50%;
          background: #fffaf3;
          color: #756a70;
          cursor: pointer;
        }

        .rr-calendar-modal-type {
          margin-top: 20px;
          padding: 14px 16px;
          border: 1px solid #e5d6b9;
          border-radius: 14px;
          background: #fff4d8;
          color: #76571e;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: .12em;
          text-transform: uppercase;
        }

        .rr-calendar-modal-description {
          margin-top: 18px;
          color: #756a70;
          font-size: 14px;
          line-height: 1.75;
          white-space: pre-line;
        }

        @media (max-width: 900px) {
          .rr-calendar-hero {
            padding: 48px 38px 66px;
          }

          .rr-calendar-stats {
            margin-left: 0;
          }

          .rr-calendar-info-grid {
            grid-template-columns: 1fr;
          }

          .rr-calendar-grid-wrap {
            padding-left: 20px;
            padding-right: 20px;
          }

          .rr-calendar-controls {
            padding-left: 20px;
            padding-right: 20px;
          }

          .rr-calendar-days,
          .rr-calendar-weekdays {
            gap: 7px;
          }

          .calendar-day {
            min-height: 68px;
          }
        }

        @media (max-width: 640px) {
          .rr-calendar-page {
            padding-top: 25px;
          }

          .rr-calendar-wrap {
            width: min(100% - 24px, 1280px);
          }

          .rr-calendar-hero {
            min-height: 380px;
            padding: 40px 24px 62px;
            border-radius: 0 0 26px 26px;
          }

          .rr-calendar-hero h1 {
            font-size: 43px;
          }

          .rr-calendar-hero-description {
            font-size: 14px;
          }

          .rr-calendar-stats {
            width: 100%;
          }

          .rr-calendar-stat {
            padding: 0 14px;
          }

          .rr-calendar-stat strong {
            font-size: 21px;
          }

          .rr-calendar-section-heading {
            padding-top: 55px;
          }

          .rr-calendar-section-heading h2 {
            font-size: 38px;
          }

          .rr-calendar-main-card {
            border-radius: 22px;
          }

          .rr-calendar-controls {
            grid-template-columns: 42px 1fr 42px;
            gap: 8px;
            padding: 22px 12px 18px;
          }

          .rr-calendar-nav {
            width: 40px;
            height: 40px;
          }

          .rr-calendar-month-title {
            font-size: 24px;
          }

          .rr-calendar-month-range {
            font-size: 8px;
            letter-spacing: .08em;
          }

          .rr-calendar-grid-wrap {
            padding: 17px 10px 27px;
          }

          .rr-calendar-days,
          .rr-calendar-weekdays {
            gap: 4px;
          }

          .calendar-day {
            min-height: 61px;
            padding: 8px 2px;
            border-radius: 10px;
          }

          .calendar-day-bs {
            font-size: 17px;
          }

          .calendar-day-ad {
            font-size: 8px;
          }

          .calendar-event-dots {
            bottom: 5px;
          }

          .rr-calendar-weekday {
            font-size: 8px;
          }

          .rr-calendar-info-card {
            padding: 22px;
          }
        }
      `}</style>

      <section className="rr-calendar-page">
        <div className="rr-calendar-wrap">

          {/* =====================================================
              HERO - matches the dark burgundy About-page sections
          ====================================================== */}
          <motion.header
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="rr-calendar-hero"
          >
            <div className="rr-calendar-hero-content">
              <div className="rr-calendar-eyebrow">
                {content.page_badge}
              </div>

              <h1>
                Academic <span>Calendar.</span>
              </h1>

              <p className="rr-calendar-hero-description">
                {content.page_description}
              </p>

              <div className="rr-calendar-hero-bottom">
                <div className="rr-calendar-est">
                  School Year {toNepaliNumber(calendarMonth.year)}
                </div>

                <div className="rr-calendar-stats">
                  <div className="rr-calendar-stat">
                    <strong>{eventCount}</strong>
                    <small>Events</small>
                  </div>

                  <div className="rr-calendar-stat">
                    <strong>{holidayCount}</strong>
                    <small>Holidays</small>
                  </div>

                  <div className="rr-calendar-stat">
                    <strong>{notices.length}</strong>
                    <small>Notices</small>
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
                  onEditTarget({ type: "pageHeader" });
                }}
                className="absolute right-5 top-5 z-20 flex h-10 w-10 items-center justify-center rounded-full"
                style={{
                  background: "#e8c978",
                  color: "#251725",
                  border: "1px solid rgba(255,255,255,.55)",
                }}
                title="Edit calendar heading"
              >
                <Pencil className="h-4 w-4" />
              </button>
            )}
          </motion.header>

          {editMode && (
            <div className="rr-calendar-edit-tip">
              Admin tip: click any calendar date to add a holiday, school event, or working day for that BS date.
            </div>
          )}

          {/* =====================================================
              SECTION INTRO - same spacing as About/Academics
          ====================================================== */}
          <div className="rr-calendar-section-heading">
            <div className="rr-calendar-section-kicker">
              School Schedule
            </div>

            <h2>
              Plan the <span>Academic Year.</span>
            </h2>

            <p>
              View school holidays, examinations, programs, admission dates,
              results, notices, and important school activities in one place.
            </p>
          </div>

          {/* =====================================================
              ONE LONG CALENDAR CONTAINER
          ====================================================== */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="rr-calendar-main-card"
          >
            <div className="rr-calendar-controls">
              <button
                type="button"
                onClick={() => changeMonth(-1)}
                className="rr-calendar-nav"
                aria-label="Previous BS month"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div className="rr-calendar-month">
                <div className="rr-calendar-month-title">
                  {monthName.np} {toNepaliNumber(calendarMonth.year)}
                </div>

                <div className="rr-calendar-month-range">
                  {monthName.en} · {formatAdMonthRange(firstAdDate, lastAdDate)}
                </div>

                <button
                  type="button"
                  onClick={goToday}
                  className="rr-calendar-today"
                >
                  Today
                </button>
              </div>

              <button
                type="button"
                onClick={() => changeMonth(1)}
                className="rr-calendar-nav"
                aria-label="Next BS month"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <div className="rr-calendar-grid-wrap">
              <div className="rr-calendar-weekdays">
                {BS_WEEK_DAYS.map((day, index) => (
                  <div
                    key={day}
                    className={`rr-calendar-weekday ${
                      index === 6 ? "saturday" : ""
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="rr-calendar-days">
                {monthCells.map((cell, index) => (
                  <CalendarCell
                    key={cell?.adKey || `empty-${index}`}
                    cell={cell}
                    todayKey={todayKey}
                    selectedDateKey={selectedDateKey}
                    eventMap={eventMap}
                    saturdayHoliday={content.saturday_holiday !== false}
                    editMode={editMode}
                    onSelect={setSelectedDateKey}
                    onAdminDateClick={onDateSelectForAdmin}
                  />
                ))}
              </div>

              <div className="rr-calendar-legend">
                <div className="rr-calendar-legend-item">
                  <span
                    className="rr-calendar-legend-dot"
                    style={{ background: "#A62B4B" }}
                  />
                  Holiday
                </div>

                <div className="rr-calendar-legend-item">
                  <span
                    className="rr-calendar-legend-dot"
                    style={{ background: "#1E5A78" }}
                  />
                  School Event
                </div>

                <div className="rr-calendar-legend-item">
                  <span
                    className="rr-calendar-legend-dot"
                    style={{ background: "#F97316" }}
                  />
                  Working Day
                </div>
              </div>
            </div>
          </motion.div>

          {/* =====================================================
              SELECTED DATE + UPCOMING DATES
              No floating right sidebar; both sit below the main
              calendar like the content sections on About.
          ====================================================== */}
          <div className="rr-calendar-info-grid">

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rr-calendar-info-card"
            >
              <div className="rr-calendar-info-label">
                Selected Date
              </div>

              <h3>
                {formatCalendarDate(selectedDateKey)}
              </h3>

              <div className="rr-calendar-info-list">
                {isSelectedSaturdayHoliday && (
                  <div className="calendar-event-pill">
                    <div className="calendar-event-pill-label">
                      Holiday
                    </div>
                    <div className="calendar-event-pill-title">
                      शनिबार बिदा
                    </div>
                  </div>
                )}

                {hasWorkingDay && (
                  <div className="calendar-event-pill">
                    <div className="calendar-event-pill-label">
                      Working Day
                    </div>
                    <div className="calendar-event-pill-title">
                      Special working day
                    </div>
                  </div>
                )}

                {visibleSelectedEvents.map((event) => (
                  <button
                    key={event.id}
                    type="button"
                    className="rr-calendar-selected-event"
                    onClick={() => setSelectedEvent(event)}
                  >
                    <EventPill event={event} />
                  </button>
                ))}

                {!isSelectedSaturdayHoliday &&
                  !hasWorkingDay &&
                  visibleSelectedEvents.length === 0 && (
                    <div className="rr-calendar-empty-message">
                      No school event added for this date.
                    </div>
                  )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 }}
              className="rr-calendar-info-card"
            >
              <div className="rr-calendar-info-label">
                Upcoming Dates
              </div>

              <h3>
                What’s Coming Next
              </h3>

              <div className="rr-calendar-info-list">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event) => {
                    const style =
                      calendarTypeStyles[event.type] ||
                      calendarTypeStyles.notice;

                    return (
                      <button
                        key={`upcoming-${event.id}`}
                        type="button"
                        onClick={() => {
                          setSelectedDateKey(event.dateKey);
                          setSelectedEvent(event);
                        }}
                        className="rr-calendar-upcoming-item"
                      >
                        <span
                          className="rr-calendar-upcoming-dot"
                          style={{ background: style.color }}
                        />

                        <span>
                          <span className="rr-calendar-upcoming-date">
                            {formatCalendarDate(event.dateKey)}
                          </span>

                          <span className="rr-calendar-upcoming-title block">
                            {event.title}
                          </span>

                          <span
                            className="rr-calendar-upcoming-type block"
                            style={{ color: style.color }}
                          >
                            {style.label}
                          </span>
                        </span>
                      </button>
                    );
                  })
                ) : (
                  <div className="rr-calendar-empty-message">
                    No upcoming events added yet.
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================================
          EVENT DETAILS MODAL
      ========================================================= */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            className="rr-calendar-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              className="rr-calendar-modal"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="rr-calendar-modal-bar" />

              <div className="rr-calendar-modal-body">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="rr-calendar-modal-date">
                      {formatCalendarDate(selectedEvent.dateKey)}
                    </div>

                    <h3>{selectedEvent.title}</h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedEvent(null)}
                    className="rr-calendar-modal-close"
                    aria-label="Close event details"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="rr-calendar-modal-type">
                  <CalendarDays className="mr-2 inline h-4 w-4" />
                  {calendarTypeStyles[selectedEvent.type]?.label || "Event"}
                </div>

                {selectedEvent.description && (
                  <p className="rr-calendar-modal-description">
                    {selectedEvent.description}
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