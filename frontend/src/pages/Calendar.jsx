import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
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
  cream: "#FFF8EE",
  gold: "#FACC15",
  cyan: "#38BDF8",
  blue: "#1877F2",
  orange: "#F97316",
};

const API_URL = import.meta.env.VITE_API_URL || "https://school-website-backend-ixx2.onrender.com";
const REQUEST_TIMEOUT_MS = 12000;

async function fetchJsonWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

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
  notice: {
    label: "Notice",
    labelNp: "सूचना",
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
};

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
const FALLBACK_BS_MONTH_INDEX = 2;

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

  const clean = String(value || "").trim();
  const dateOnlyMatch = clean.match(/^(\d{4})-(\d{2})-(\d{2})/);

  if (dateOnlyMatch) {
    const [, year, month, day] = dateOnlyMatch;
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
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

function getDaysBetween(startDate, endDate) {
  const start = parseDateOnly(startDate);
  const end = parseDateOnly(endDate);

  if (!start || !end) return 0;

  return Math.round((end.getTime() - start.getTime()) / 86400000);
}

function toNepaliNumber(value) {
  const digits = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
  return String(value ?? "").replace(/\d/g, (digit) => digits[Number(digit)]);
}

function getBsYearStartDate(bsYear) {
  const data = BS_CALENDAR_DATA[bsYear];
  return data ? parseDateOnly(data.startAd) : null;
}

function getBsMonthLength(bsYear, bsMonthIndex) {
  return BS_CALENDAR_DATA[bsYear]?.months?.[bsMonthIndex] || 30;
}

function bsToAdDate(bsYear, bsMonthIndex, bsDay) {
  const data = BS_CALENDAR_DATA[bsYear];
  const startDate = getBsYearStartDate(bsYear);

  if (!data || !startDate) return null;

  const monthOffset = data.months
    .slice(0, bsMonthIndex)
    .reduce((total, days) => total + days, 0);

  return addDays(startDate, monthOffset + Number(bsDay || 1) - 1);
}

function adToBsDate(adValue) {
  const adDate = parseDateOnly(adValue);

  if (!adDate) return null;

  const supportedYears = Object.keys(BS_CALENDAR_DATA)
    .map(Number)
    .sort((a, b) => a - b);

  for (const bsYear of supportedYears) {
    const yearStart = getBsYearStartDate(bsYear);
    const nextYearStart = getBsYearStartDate(bsYear + 1);

    if (!yearStart) continue;

    const yearEnd = nextYearStart
      ? addDays(nextYearStart, -1)
      : addDays(yearStart, BS_CALENDAR_DATA[bsYear].months.reduce((sum, days) => sum + days, 0) - 1);

    if (adDate < yearStart || adDate > yearEnd) continue;

    let remainingDays = getDaysBetween(yearStart, adDate);
    const months = BS_CALENDAR_DATA[bsYear].months;

    for (let monthIndex = 0; monthIndex < months.length; monthIndex += 1) {
      if (remainingDays < months[monthIndex]) {
        return {
          year: bsYear,
          monthIndex,
          day: remainingDays + 1,
          adDate,
          adKey: formatDateKey(adDate),
        };
      }

      remainingDays -= months[monthIndex];
    }
  }

  return null;
}

function parseBsDateKey(value) {
  const clean = String(value || "").trim();
  const match = clean.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);

  if (!match) return null;

  const year = Number(match[1]);
  const monthIndex = Number(match[2]) - 1;
  const day = Number(match[3]);

  if (!BS_CALENDAR_DATA[year]) return null;
  if (monthIndex < 0 || monthIndex > 11) return null;
  if (day < 1 || day > getBsMonthLength(year, monthIndex)) return null;

  return { year, monthIndex, day };
}

function parseCalendarDateToAd(value) {
  const bsDate = parseBsDateKey(value);

  if (bsDate && bsDate.year >= 2070) {
    return bsToAdDate(bsDate.year, bsDate.monthIndex, bsDate.day);
  }

  return parseDateOnly(value);
}

function formatAdShort(dateValue) {
  const date = parseDateOnly(dateValue);

  if (!date) return "";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function formatAdMonthRange(startDate, endDate) {
  const start = parseDateOnly(startDate);
  const end = parseDateOnly(endDate);

  if (!start || !end) return "";

  const startMonth = start.toLocaleDateString("en-US", { month: "short" });
  const endMonth = end.toLocaleDateString("en-US", { month: "short" });
  const year = end.getFullYear();

  return startMonth === endMonth
    ? `${startMonth} ${year}`
    : `${startMonth}-${endMonth} ${year}`;
}

function formatBsFullDate(bsDate) {
  if (!bsDate) return "No date";

  return `${BS_MONTHS[bsDate.monthIndex]?.np || ""} ${toNepaliNumber(bsDate.day)}, ${toNepaliNumber(bsDate.year)} वि.सं.`;
}

export function formatCalendarDate(adDateKey) {
  const adDate = parseDateOnly(adDateKey);
  const bsDate = adToBsDate(adDate);

  if (!adDate || !bsDate) return adDateKey || "No date";

  return `${formatBsFullDate(bsDate)} · ${adDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`;
}

function getAdDateRangeKeys(startDate, endDate) {
  const start = parseCalendarDateToAd(startDate);
  const end = parseCalendarDateToAd(endDate || startDate);

  if (!start || !end) return [];

  const safeStart = start <= end ? start : end;
  const safeEnd = start <= end ? end : start;
  const keys = [];

  for (let current = safeStart; current <= safeEnd; current = addDays(current, 1)) {
    keys.push(formatDateKey(current));
  }

  return keys;
}

function inferCalendarEventType({ title = "", category = "", type = "" } = {}) {
  const explicitType = String(type || "").trim();

  if (["holiday", "event", "workingDay"].includes(explicitType)) {
    return explicitType;
  }

  const text = `${title} ${category}`.toLowerCase();

  if (text.includes("holiday") || text.includes("vacation") || text.includes("closed") || text.includes("बिदा")) {
    return "holiday";
  }

  if (text.includes("working") || text.includes("open saturday") || text.includes("कार्य दिन")) {
    return "workingDay";
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

      if (dateKeys.length === 0) return [];

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
    <div className="flex items-center gap-2 rounded-2xl bg-white/70 px-3 py-2 text-xs font-black text-slate-600 ring-1 ring-slate-100">
      <span className="h-2.5 w-2.5 rounded-full" style={{ background: style.color }} />
      {style.labelNp || style.label}
    </div>
  );
}

function CalendarCell({ cell, todayKey, selectedDateKey, eventMap, saturdayHoliday, editMode = false, onSelect, onAdminDateClick = () => {} }) {
  if (!cell) return <div className="h-12 rounded-2xl md:h-14" />;

  const dayEvents = eventMap[cell.adKey] || [];
  const hasWorkingDay = dayEvents.some((event) => event.type === "workingDay");
  const isSaturdayHoliday = saturdayHoliday && cell.adDate.getDay() === 6 && !hasWorkingDay;
  const isToday = cell.adKey === todayKey;
  const isSelected = cell.adKey === selectedDateKey;
  const visibleEvents = dayEvents.filter((event) => event.type !== "workingDay");
  const topEvents = visibleEvents.slice(0, 4);
  const hasHoliday = visibleEvents.some((event) => event.type === "holiday");

  return (
    <button
      type="button"
      onClick={() => {
        onSelect(cell.adKey);
        if (editMode) onAdminDateClick(cell);
      }}
      className="relative h-12 rounded-2xl p-1 text-center transition-all hover:-translate-y-0.5 md:h-14"
      style={{
        background: isSelected
          ? colors.dark
          : isSaturdayHoliday || hasHoliday
          ? "rgba(215,25,32,0.08)"
          : topEvents.length > 0
          ? "rgba(56,189,248,0.08)"
          : "rgba(15,23,42,0.035)",
        color: isSelected ? "#FFFFFF" : isSaturdayHoliday || hasHoliday ? colors.red : colors.dark,
        border: isToday
          ? `2px solid ${colors.green}`
          : isSelected
          ? `2px solid ${colors.dark}`
          : editMode
          ? "1px dashed rgba(56,189,248,0.35)"
          : "1px solid rgba(15,23,42,0.06)",
        cursor: editMode ? "copy" : "pointer",
      }}
    >
      <span className="block text-base font-black leading-tight md:text-lg">
        {toNepaliNumber(cell.bsDay)}
      </span>
      <span className="block text-[9px] font-bold leading-none opacity-60 md:text-[10px]">
        {cell.adDate.getDate()}
      </span>

      <div className="absolute bottom-0.5 left-1/2 flex -translate-x-1/2 gap-0.5">
        {(isSaturdayHoliday || hasHoliday) && (
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: isSelected ? "#FFFFFF" : colors.red }} />
        )}
        {topEvents.map((event) => (
          <span
            key={event.id}
            className="h-1.5 w-1.5 rounded-full"
            style={{
              background: isSelected ? "#FFFFFF" : event.type === "holiday" ? colors.red : colors.blue,
            }}
          />
        ))}
      </div>
    </button>
  );
}

function EventPill({ event }) {
  const style = calendarTypeStyles[event.type] || calendarTypeStyles.notice;

  return (
    <div
      className="rounded-2xl px-4 py-3"
      style={{
        background: style.background,
        color: style.color,
        border: `1px solid ${style.border}`,
      }}
    >
      <div className="text-xs font-black uppercase tracking-[0.12em] opacity-80">
        {style.labelNp || style.label}
      </div>
      <div className="text-base font-black text-slate-950">{event.title}</div>
      {event.description && (
        <p className="mt-1 text-sm leading-relaxed text-slate-500 line-clamp-3">
          {event.description}
        </p>
      )}
    </div>
  );
}

export function Calendar({ contentOverride = null, noticesOverride = null, editMode = false, onEditTarget = () => {}, onDateSelectForAdmin = () => {} }) {
  const [content, setContent] = useState(() => mergeCalendarContent(contentOverride || defaultCalendarContent));
  const [notices, setNotices] = useState(Array.isArray(noticesOverride) ? noticesOverride.map(normalizeNotice) : []);
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
        setContent(mergeCalendarContent(result?.data?.content || {}));
      } catch (error) {
        console.error("Calendar content load error:", error);
        if (alive) setContent(mergeCalendarContent(defaultCalendarContent));
      }
    };

    const loadNotices = async () => {
      try {
        const result = await fetchJsonWithTimeout(`${API_URL}/api/notices`);
        if (!alive) return;

        const rawNotices = Array.isArray(result)
          ? result
          : Array.isArray(result?.data)
          ? result.data
          : [];

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

  const manualEvents = useMemo(() => normalizeCalendarEvents(content.events, "manual"), [content.events]);
  const noticeEvents = useMemo(
    () => (content.show_notice_dates === false ? [] : getCalendarEventsFromNotices(notices)),
    [content.show_notice_dates, notices]
  );

  const allEvents = useMemo(
    () => [...manualEvents, ...noticeEvents],
    [manualEvents, noticeEvents]
  );

  const eventMap = useMemo(() => {
    return allEvents.reduce((map, event) => {
      if (!map[event.dateKey]) map[event.dateKey] = [];
      map[event.dateKey].push(event);
      return map;
    }, {});
  }, [allEvents]);

  const monthCells = useMemo(
    () => getBsMonthCells(calendarMonth.year, calendarMonth.monthIndex),
    [calendarMonth]
  );

  const selectedAdDate = parseDateOnly(selectedDateKey) || today;
  const selectedBsDate = adToBsDate(selectedAdDate);
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

  return (
    <>
      <section
        className="min-h-screen pt-24 pb-12 lg:pt-28 relative overflow-hidden"
        style={{
          background: `
            radial-gradient(circle at top right, rgba(75,46,131,0.12), transparent 34%),
            radial-gradient(circle at bottom left, rgba(22,138,58,0.10), transparent 32%),
            linear-gradient(180deg, #FFF8EE 0%, #F8FAFC 58%, #F1ECFF 100%)
          `,
        }}
      >
        <div className="absolute top-24 right-10 h-72 w-72 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(75,46,131,0.10), transparent 70%)", filter: "blur(10px)" }} />
        <div className="absolute bottom-16 left-8 h-72 w-72 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(22,138,58,0.09), transparent 70%)", filter: "blur(10px)" }} />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className={editMode ? "mb-6 relative group rounded-[28px] border border-dashed border-sky-300/70 p-4 -m-4" : "mb-6"}
          >
            <span
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-[0.14em] mb-4"
              style={{
                background: "rgba(215,25,32,0.08)",
                color: colors.red,
                border: "1px solid rgba(215,25,32,0.16)",
              }}
            >
              <Sparkles className="w-4 h-4" />
              {content.page_badge}
            </span>

            <div className="grid gap-5 lg:grid-cols-[1fr_320px] lg:items-end">
              <div>
                <h1
                  className="text-4xl md:text-5xl text-slate-950 leading-[0.95]"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 900,
                    letterSpacing: "-0.065em",
                  }}
                >
                  {content.page_title}
                </h1>

                <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-500">
                  {content.page_description}
                </p>
              </div>

              <div
                className="rounded-[24px] p-4"
                style={{
                  background: "linear-gradient(145deg, rgba(255,255,255,0.92), rgba(255,255,255,0.72))",
                  border: "1px solid rgba(15,23,42,0.08)",
                  boxShadow: "0 18px 46px rgba(15,23,42,0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
                  backdropFilter: "blur(18px)",
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-2xl flex items-center justify-center" style={{ background: "rgba(56,189,248,0.12)", color: colors.blue }}>
                    <CalendarDays className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Today</div>
                    <div className="text-lg font-black text-slate-950">{formatBsFullDate(todayBs)}</div>
                    <div className="text-xs font-bold text-slate-400">{today.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</div>
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
                className="absolute -top-4 -right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full shadow-xl transition-all group-hover:scale-105"
                style={{
                  background: `linear-gradient(135deg, ${colors.gold}, ${colors.cyan})`,
                  color: colors.dark,
                  border: "1px solid rgba(255,255,255,0.85)",
                }}
                title="Edit calendar heading"
              >
                <Pencil className="h-4 w-4" />
              </button>
            )}
          </motion.div>

          {editMode && (
            <div className="mb-4 rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm font-bold text-sky-700">
              Admin tip: click any calendar date to add a holiday, school event, or working day for that BS date.
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] items-start">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="rounded-[28px] overflow-hidden"
              style={{
                background: "linear-gradient(145deg, rgba(255,255,255,0.96), rgba(255,255,255,0.80))",
                border: "1px solid rgba(15,23,42,0.08)",
                boxShadow: "0 24px 70px rgba(15,23,42,0.10), inset 0 1px 0 rgba(255,255,255,0.9)",
                backdropFilter: "blur(18px)",
              }}
            >
              <div className="p-4 md:p-5">
                <div className="mb-4 flex flex-row items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => changeMonth(-1)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-2xl font-black transition-all hover:-translate-y-0.5"
                    style={{ background: "rgba(15,23,42,0.05)", color: colors.dark }}
                    aria-label="Previous BS month"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  <div className="text-center">
                    <div
                      className="text-2xl text-slate-950 md:text-3xl"
                      style={{ fontFamily: "var(--font-display)", fontWeight: 900, letterSpacing: "-0.045em" }}
                    >
                      {monthName.np} {toNepaliNumber(calendarMonth.year)}
                    </div>
                    <div className="mt-1 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                      {monthName.en} · {formatAdMonthRange(firstAdDate, lastAdDate)}
                    </div>
                    <button
                      type="button"
                      onClick={goToday}
                      className="mt-1 rounded-full px-3 py-0.5 text-[11px] font-black uppercase tracking-[0.14em]"
                      style={{ color: colors.green, background: "rgba(22,138,58,0.08)", border: "1px solid rgba(22,138,58,0.16)" }}
                    >
                      Today
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => changeMonth(1)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-2xl font-black transition-all hover:-translate-y-0.5"
                    style={{ background: "rgba(15,23,42,0.05)", color: colors.dark }}
                    aria-label="Next BS month"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1.5 text-center text-[11px] font-black uppercase tracking-[0.08em] text-slate-400">
                  {BS_WEEK_DAYS.map((day, index) => (
                    <div key={day} className="py-1" style={{ color: index === 6 ? colors.red : undefined }}>
                      {day}
                    </div>
                  ))}
                </div>

                <div className="mt-1.5 grid grid-cols-7 gap-1.5">
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

                <div className="mt-4 flex flex-wrap gap-2">
                  <LegendItem type="holiday" />
                  <LegendItem type="event" />
                </div>
              </div>
            </motion.div>

            <motion.aside
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:sticky lg:top-28 space-y-4"
            >
              <div
                className="rounded-[24px] p-4"
                style={{
                  background: "linear-gradient(145deg, rgba(255,255,255,0.96), rgba(255,255,255,0.80))",
                  border: "1px solid rgba(15,23,42,0.08)",
                  boxShadow: "0 18px 46px rgba(15,23,42,0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
                }}
              >
                <div className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Selected Date</div>
                <div className="mt-2 text-lg font-black text-slate-950">{formatCalendarDate(selectedDateKey)}</div>

                <div className="mt-3 space-y-2">
                  {isSelectedSaturdayHoliday && (
                    <div
                      className="rounded-2xl px-4 py-3 text-sm font-black"
                      style={{
                        background: calendarTypeStyles.holiday.background,
                        color: calendarTypeStyles.holiday.color,
                        border: `1px solid ${calendarTypeStyles.holiday.border}`,
                      }}
                    >
                      शनिबार बिदा
                    </div>
                  )}

                  {hasWorkingDay && (
                    <div
                      className="rounded-2xl px-4 py-3 text-sm font-black"
                      style={{
                        background: calendarTypeStyles.workingDay.background,
                        color: calendarTypeStyles.workingDay.color,
                        border: `1px solid ${calendarTypeStyles.workingDay.border}`,
                      }}
                    >
                      Special working day
                    </div>
                  )}

                  {visibleSelectedEvents.map((event) => (
                    <button key={event.id} type="button" onClick={() => setSelectedEvent(event)} className="block w-full text-left">
                      <EventPill event={event} />
                    </button>
                  ))}

                  {!isSelectedSaturdayHoliday && !hasWorkingDay && visibleSelectedEvents.length === 0 && (
                    <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-400">
                      No school event added for this date.
                    </div>
                  )}
                </div>
              </div>

              <div
                className="rounded-[24px] p-4"
                style={{
                  background: "linear-gradient(145deg, rgba(255,255,255,0.96), rgba(255,255,255,0.80))",
                  border: "1px solid rgba(15,23,42,0.08)",
                  boxShadow: "0 18px 46px rgba(15,23,42,0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
                }}
              >
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                  <Clock className="h-4 w-4" />
                  Upcoming Dates
                </div>

                <div className="mt-3 space-y-2">
                  {upcomingEvents.length > 0 ? (
                    upcomingEvents.map((event) => {
                      const style = calendarTypeStyles[event.type] || calendarTypeStyles.notice;

                      return (
                        <button
                          key={`upcoming-${event.id}`}
                          type="button"
                          onClick={() => {
                            setSelectedDateKey(event.dateKey);
                            setSelectedEvent(event);
                          }}
                          className="flex w-full gap-3 rounded-2xl bg-slate-50 p-3 text-left transition-all hover:-translate-y-0.5"
                        >
                          <div className="mt-1 h-3 w-3 shrink-0 rounded-full" style={{ background: style.color }} />
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-400">{formatCalendarDate(event.dateKey)}</div>
                            <div className="truncate text-sm font-black text-slate-900">{event.title}</div>
                            <div className="text-xs font-bold" style={{ color: style.color }}>{style.label}</div>
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-400">
                      No upcoming events added yet.
                    </div>
                  )}
                </div>
              </div>
            </motion.aside>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            style={{ background: "rgba(2,6,23,0.62)", backdropFilter: "blur(14px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              className="w-full max-w-lg rounded-[30px] bg-white overflow-hidden"
              style={{ boxShadow: "0 42px 110px rgba(0,0,0,0.32)", border: "1px solid rgba(255,255,255,0.75)" }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${colors.red}, ${colors.gold}, ${colors.green})` }} />
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">{formatCalendarDate(selectedEvent.dateKey)}</div>
                    <h3 className="mt-2 text-2xl font-black text-slate-950">{selectedEvent.title}</h3>
                  </div>
                  <button type="button" onClick={() => setSelectedEvent(null)} className="h-10 w-10 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                {selectedEvent.description && <p className="mt-4 whitespace-pre-line leading-relaxed text-slate-600">{selectedEvent.description}</p>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Calendar;
