import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Eye,
  ListChecks,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";

import Calendar, {
  calendarTypeOptions,
  defaultCalendarContent,
  mergeCalendarContent,
} from "../pages/Calendar";

const colors = {
  red: "#D71920",
  green: "#168A3A",
  purple: "#4B2E83",
  dark: "#0B1020",
  cyan: "#38BDF8",
  blue: "#1877F2",
  gold: "#FACC15",
  orange: "#F97316",
};

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://school-website-backend-ixx2.onrender.com";

const lightAdminPanelStyle = {
  background:
    "linear-gradient(135deg, rgba(255,255,255,0.96), rgba(248,244,255,0.95), rgba(238,247,255,0.95))",
  border: "1px solid rgba(75,46,131,0.12)",
  boxShadow: "0 18px 44px rgba(15,23,42,0.08)",
  backdropFilter: "blur(14px)",
};

function Field({
  label,
  value,
  onChange,
  placeholder = "",
  textarea = false,
}) {
  return (
    <div>
      <label className="block text-sm font-black mb-2 text-slate-700">
        {label}
      </label>

      {textarea ? (
        <textarea
          value={value || ""}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          rows={4}
          className="w-full px-4 py-3 rounded-2xl outline-none text-sm resize-none"
          style={{
            background: "rgba(255,255,255,0.92)",
            border: "1px solid rgba(75,46,131,0.16)",
            color: colors.dark,
          }}
        />
      ) : (
        <input
          value={value || ""}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 rounded-2xl outline-none text-sm"
          style={{
            background: "rgba(255,255,255,0.92)",
            border: "1px solid rgba(75,46,131,0.16)",
            color: colors.dark,
          }}
        />
      )}
    </div>
  );
}

function SelectField({ label, value, onChange, children }) {
  return (
    <div>
      <label className="block text-sm font-black mb-2 text-slate-700">
        {label}
      </label>

      <select
        value={value || "event"}
        onChange={(event) => onChange(event.target.value)}
        className="w-full px-4 py-3 rounded-2xl outline-none text-sm"
        style={{
          background: "rgba(255,255,255,0.92)",
          border: "1px solid rgba(75,46,131,0.16)",
          color: colors.dark,
        }}
      >
        {children}
      </select>
    </div>
  );
}

function Toggle({ checked, onChange, label, description }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="w-full flex items-center justify-between gap-4 rounded-2xl px-4 py-3 text-left"
      style={{
        background: checked
          ? "rgba(22,138,58,0.08)"
          : "rgba(100,116,139,0.08)",
        border: checked
          ? "1px solid rgba(22,138,58,0.18)"
          : "1px solid rgba(100,116,139,0.18)",
      }}
    >
      <span>
        <span className="block text-sm font-black text-slate-700">{label}</span>
        {description && (
          <span className="mt-1 block text-xs font-semibold text-slate-400">
            {description}
          </span>
        )}
      </span>

      <span
        className="relative w-12 h-7 rounded-full transition-all shrink-0"
        style={{ background: checked ? colors.green : "#CBD5E1" }}
      >
        <span
          className="absolute top-1 w-5 h-5 rounded-full bg-white transition-all shadow"
          style={{ left: checked ? "24px" : "4px" }}
        />
      </span>
    </button>
  );
}

function getAuthHeaders(json = false) {
  const token =
    localStorage.getItem("adminToken") ||
    localStorage.getItem("token") ||
    localStorage.getItem("admin_token") ||
    "";

  const headers = {};

  if (json) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  return headers;
}

function createEmptyEvent(type = "event", bsDate = "") {
  return {
    id: Date.now(),
    title:
      type === "holiday"
        ? "School Holiday"
        : type === "workingDay"
        ? "Special Working Day"
        : "New School Event",
    type,
    start_bs: bsDate,
    end_bs: bsDate,
    description: "",
    visible: true,
  };
}

function sortEvents(events = []) {
  return [...events].sort((a, b) =>
    String(a.start_bs || "").localeCompare(String(b.start_bs || ""))
  );
}

function getTypeStyle(type) {
  if (type === "holiday") {
    return {
      label: "Holiday",
      color: colors.red,
      background: "rgba(215,25,32,0.08)",
      border: "rgba(215,25,32,0.16)",
    };
  }

  if (type === "workingDay") {
    return {
      label: "Working Day",
      color: colors.orange,
      background: "rgba(249,115,22,0.10)",
      border: "rgba(249,115,22,0.22)",
    };
  }

  return {
    label: "School Event",
    color: colors.blue || colors.cyan,
    background: "rgba(24,119,242,0.08)",
    border: "rgba(24,119,242,0.18)",
  };
}

function EventListItem({
  event,
  saving,
  onEdit,
  onToggleVisibility,
  onDelete,
}) {
  const style = getTypeStyle(event.type);

  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background:
          event.visible === false ? "rgba(248,250,252,0.7)" : "#FFFFFF",
        border: "1px solid rgba(15,23,42,0.08)",
      }}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span
              className="rounded-full px-3 py-1 text-xs font-black"
              style={{
                background: style.background,
                color: style.color,
                border: `1px solid ${style.border}`,
              }}
            >
              {style.label}
            </span>

            <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-black text-slate-500 border border-slate-100">
              {event.start_bs || "No date"}
              {event.end_bs && event.end_bs !== event.start_bs
                ? ` → ${event.end_bs}`
                : ""}
            </span>

            {event.visible === false && (
              <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-black text-red-600 border border-red-100">
                Hidden
              </span>
            )}
          </div>

          <div className="text-base font-black text-slate-950">
            {event.title}
          </div>

          {event.description && (
            <p className="mt-1 text-sm leading-relaxed text-slate-500 line-clamp-2">
              {event.description}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onEdit(event)}
            className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-black bg-white text-slate-600 border border-slate-200"
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit
          </button>

          <button
            type="button"
            onClick={() => onToggleVisibility(event)}
            disabled={saving}
            className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-black bg-white text-slate-600 border border-slate-200 disabled:opacity-60"
          >
            <Eye className="w-3.5 h-3.5" />
            {event.visible === false ? "Show" : "Hide"}
          </button>

          <button
            type="button"
            onClick={() => onDelete(event)}
            className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-black bg-red-50 text-red-600 border border-red-100"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminCalendar() {
  const [form, setForm] = useState(defaultCalendarContent);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [editorType, setEditorType] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [modalForm, setModalForm] = useState({});

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showEventsPanel, setShowEventsPanel] = useState(false);

  useEffect(() => {
    let alive = true;

    const loadCalendarContent = async () => {
      try {
        const response = await fetch(`${API_URL}/api/site-content/calendar`);
        const result = await response.json();

        if (!alive) return;

        const savedContent = mergeCalendarContent(result?.data?.content || {});
        setForm(savedContent);
      } catch (err) {
        console.error("Load calendar content error:", err);

        if (alive) {
          setError("Could not load saved calendar content. Default content shown.");
        }
      }
    };

    loadCalendarContent();

    return () => {
      alive = false;
    };
  }, []);

  const visibleEvents = useMemo(
    () => sortEvents(form.events || []),
    [form.events]
  );

  const saveCalendarContent = async (nextForm, message) => {
    const cleanContent = mergeCalendarContent(nextForm);

    const response = await fetch(`${API_URL}/api/site-content/calendar`, {
      method: "PUT",
      headers: getAuthHeaders(true),
      body: JSON.stringify({ content: cleanContent }),
    });

    const result = await response.json();

    if (!response.ok || result.success === false) {
      throw new Error(result.message || "Failed to save calendar content.");
    }

    setForm(cleanContent);
    setSuccess(message || "Calendar saved successfully.");
    return cleanContent;
  };

  const openSettingsEditor = () => {
    setSuccess("");
    setError("");
    setEditorType("settings");
    setEditingIndex(null);
    setModalForm({
      page_badge: form.page_badge || "",
      page_title: form.page_title || "",
      page_description: form.page_description || "",
      saturday_holiday: form.saturday_holiday !== false,
      show_notice_dates: form.show_notice_dates !== false,
    });
  };

  const openNewEvent = (type = "event", bsDate = "") => {
    setSuccess("");
    setError("");
    setEditorType("event");
    setEditingIndex("new");
    setModalForm(createEmptyEvent(type, bsDate));
  };

  const openDateEvent = (calendarDate) => {
    openNewEvent("event", calendarDate?.bsKey || "");
  };

  const openEditEvent = (event) => {
    const originalIndex = form.events.findIndex((item) => item.id === event.id);

    setSuccess("");
    setError("");
    setEditorType("event");
    setEditingIndex(originalIndex);
    setModalForm({ ...event });
  };

  const closeEditor = () => {
    if (saving) return;

    setEditorType(null);
    setEditingIndex(null);
    setModalForm({});
  };

  const updateModalField = (name, value) => {
    setModalForm((prev) => ({ ...prev, [name]: value }));
  };

  const saveSettings = async () => {
    setSaving(true);
    setSuccess("");
    setError("");

    try {
      await saveCalendarContent(
        {
          ...form,
          page_badge: modalForm.page_badge || "",
          page_title: modalForm.page_title || "",
          page_description: modalForm.page_description || "",
          saturday_holiday: modalForm.saturday_holiday !== false,
          show_notice_dates: modalForm.show_notice_dates !== false,
        },
        "Calendar heading/settings saved successfully."
      );

      closeEditor();
    } catch (err) {
      console.error("Save calendar settings error:", err);
      setError(err.message || "Could not save calendar settings.");
    } finally {
      setSaving(false);
    }
  };

  const saveEvent = async () => {
    if (!String(modalForm.title || "").trim()) {
      setError("Event title is required.");
      return;
    }

    if (!String(modalForm.start_bs || "").trim()) {
      setError("Start BS date is required. Example: 2083-03-24");
      return;
    }

    setSaving(true);
    setSuccess("");
    setError("");

    try {
      const cleanType = ["holiday", "event", "workingDay"].includes(
        modalForm.type
      )
        ? modalForm.type
        : "event";

      const cleanEvent = {
        ...modalForm,
        id: modalForm.id || Date.now(),
        type: cleanType,
        end_bs: modalForm.end_bs || modalForm.start_bs,
        visible: modalForm.visible !== false,
      };

      const nextEvents =
        editingIndex === "new"
          ? [...(form.events || []), cleanEvent]
          : (form.events || []).map((item, index) =>
              index === editingIndex ? cleanEvent : item
            );

      await saveCalendarContent(
        {
          ...form,
          events: nextEvents,
        },
        editingIndex === "new"
          ? "Calendar event added successfully."
          : "Calendar event saved successfully."
      );

      closeEditor();
    } catch (err) {
      console.error("Save calendar event error:", err);
      setError(err.message || "Could not save calendar event.");
    } finally {
      setSaving(false);
    }
  };

  const deleteEvent = async () => {
    if (!deleteTarget) return;

    setSaving(true);
    setSuccess("");
    setError("");

    try {
      const nextEvents = (form.events || []).filter(
        (item) => item.id !== deleteTarget.id
      );

      await saveCalendarContent(
        {
          ...form,
          events: nextEvents,
        },
        "Calendar event deleted successfully."
      );

      setDeleteTarget(null);
      closeEditor();
    } catch (err) {
      console.error("Delete calendar event error:", err);
      setError(err.message || "Could not delete calendar event.");
    } finally {
      setSaving(false);
    }
  };

  const toggleEventVisibility = async (event) => {
    setSaving(true);
    setSuccess("");
    setError("");

    try {
      const nextEvents = (form.events || []).map((item) =>
        item.id === event.id ? { ...item, visible: item.visible === false } : item
      );

      await saveCalendarContent(
        {
          ...form,
          events: nextEvents,
        },
        "Calendar event visibility updated."
      );
    } catch (err) {
      console.error("Toggle calendar event error:", err);
      setError(err.message || "Could not update calendar event.");
    } finally {
      setSaving(false);
    }
  };

  const editorTitle =
    editorType === "settings"
      ? "Edit Calendar Heading"
      : editingIndex === "new"
      ? "Add Calendar Event"
      : "Edit Calendar Event";

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[24px] p-4 sm:p-5 md:p-6"
        style={lightAdminPanelStyle}
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black mb-3 bg-sky-50 text-sky-700 border border-sky-100">
              <CalendarDays className="w-3.5 h-3.5" />
              Visual Calendar Manager
            </div>

            <h2
              className="text-2xl md:text-3xl font-black text-slate-950"
              style={{
                fontFamily: "var(--font-display)",
                letterSpacing: "-0.04em",
              }}
            >
              Hover and Edit School Calendar
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Click the pencil on the calendar heading to edit text. Click any
              BS date to add an event for that date. Holiday is red, school
              event is blue, and working day removes Saturday holiday color.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => openNewEvent("event")}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl font-black text-sm transition-all hover:-translate-y-0.5"
              style={{
                background: `linear-gradient(135deg, ${colors.gold}, ${colors.cyan})`,
                color: colors.dark,
              }}
            >
              <Plus className="w-4 h-4" />
              Add Event
            </button>

            <button
              type="button"
              onClick={() => openNewEvent("holiday")}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl font-black text-sm transition-all hover:-translate-y-0.5"
              style={{
                background: "rgba(215,25,32,0.08)",
                color: colors.red,
                border: "1px solid rgba(215,25,32,0.16)",
              }}
            >
              <Plus className="w-4 h-4" />
              Add Holiday Range
            </button>

            <button
              type="button"
              onClick={() => setShowEventsPanel(true)}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl font-black text-sm transition-all hover:-translate-y-0.5"
              style={{
                background: "rgba(255,255,255,0.86)",
                color: colors.purple,
                border: "1px solid rgba(75,46,131,0.18)",
              }}
            >
              <ListChecks className="w-4 h-4" />
              View Events ({visibleEvents.length})
            </button>

            <Link
              to="/admin/dashboard"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl font-black text-sm transition-all hover:-translate-y-0.5"
              style={{
                background: "rgba(15,23,42,0.06)",
                color: "rgba(15,23,42,0.72)",
                border: "1px solid rgba(15,23,42,0.08)",
              }}
            >
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </Link>
          </div>
        </div>

        {success && (
          <div className="mb-4 rounded-2xl px-4 py-3 flex items-center gap-2 font-semibold bg-green-50 text-green-700 border border-green-100">
            <CheckCircle2 className="w-4 h-4" />
            {success}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-2xl px-4 py-3 flex items-center gap-2 font-semibold bg-red-50 text-red-700 border border-red-100">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <div
          className="rounded-[2rem] overflow-x-auto"
          style={{
            background:
              "radial-gradient(circle at top left, rgba(56,189,248,0.14), transparent 34%), linear-gradient(180deg, #FFF8EE 0%, #F1ECFF 100%)",
            border: "1px solid rgba(15,23,42,0.08)",
          }}
        >
          <div className="min-w-0 bg-white">
            <Calendar
              editMode
              contentOverride={form}
              noticesOverride={[]}
              onEditTarget={openSettingsEditor}
              onDateSelectForAdmin={openDateEvent}
            />
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showEventsPanel && (
          <motion.div
            className="fixed inset-0 z-[9998] flex items-center justify-center p-3 sm:p-5"
            style={{
              background: "rgba(2,6,23,0.55)",
              backdropFilter: "blur(12px)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowEventsPanel(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 130, damping: 16 }}
              className="w-full max-w-5xl rounded-[28px] overflow-hidden max-h-[90vh] overflow-y-auto"
              style={{
                background: "#FFFFFF",
                border: "1px solid rgba(255,255,255,0.75)",
                boxShadow: "0 42px 110px rgba(0,0,0,0.28)",
              }}
              onClick={(event) => event.stopPropagation()}
            >
              <div
                className="h-1"
                style={{
                  background: `linear-gradient(90deg, ${colors.gold}, ${colors.cyan}, ${colors.green})`,
                }}
              />

              <div className="p-5 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-5">
                  <div>
                    <h3 className="text-2xl font-black text-slate-950">
                      Calendar Events
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                      Manage added holidays, school events, and working days.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => openNewEvent("event")}
                      className="inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-black"
                      style={{
                        background: `linear-gradient(135deg, ${colors.gold}, ${colors.cyan})`,
                        color: colors.dark,
                      }}
                    >
                      <Plus className="w-4 h-4" />
                      Add Event
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowEventsPanel(false)}
                      className="h-11 w-11 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {visibleEvents.length > 0 ? (
                    visibleEvents.map((event) => (
                      <EventListItem
                        key={event.id}
                        event={event}
                        saving={saving}
                        onEdit={openEditEvent}
                        onToggleVisibility={toggleEventVisibility}
                        onDelete={setDeleteTarget}
                      />
                    ))
                  ) : (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm font-semibold text-slate-400">
                      No calendar events added yet. Saturdays still appear
                      automatically as holidays.
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {editorType && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5"
            style={{
              background: "rgba(2,6,23,0.55)",
              backdropFilter: "blur(12px)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeEditor}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 130, damping: 16 }}
              className="w-full max-w-xl rounded-[28px] overflow-hidden max-h-[92vh] overflow-y-auto"
              style={{
                background: "#FFFFFF",
                border: "1px solid rgba(255,255,255,0.75)",
                boxShadow: "0 42px 110px rgba(0,0,0,0.28)",
              }}
              onClick={(event) => event.stopPropagation()}
            >
              <div
                className="h-1"
                style={{
                  background: `linear-gradient(90deg, ${colors.gold}, ${colors.cyan}, ${colors.green})`,
                }}
              />

              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(250,204,21,0.18), rgba(56,189,248,0.18))",
                        color: colors.dark,
                      }}
                    >
                      <CalendarDays className="w-5 h-5" />
                    </div>

                    <div>
                      <h3 className="text-xl font-black text-slate-950">
                        {editorTitle}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {editorType === "settings"
                          ? "Save only the visible calendar heading/settings."
                          : "Use BS date format: 2083-03-24."}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={closeEditor}
                    className="w-10 h-10 rounded-2xl flex items-center justify-center bg-slate-100 text-slate-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-5">
                  {editorType === "settings" && (
                    <>
                      <Field
                        label="Page Badge"
                        value={modalForm.page_badge}
                        onChange={(value) =>
                          updateModalField("page_badge", value)
                        }
                      />

                      <Field
                        label="Page Title"
                        value={modalForm.page_title}
                        onChange={(value) =>
                          updateModalField("page_title", value)
                        }
                      />

                      <Field
                        label="Page Description"
                        value={modalForm.page_description}
                        onChange={(value) =>
                          updateModalField("page_description", value)
                        }
                        textarea
                      />

                      <Toggle
                        label="Saturday is automatic holiday"
                        description="Saturdays stay red unless a Working Day is added."
                        checked={modalForm.saturday_holiday !== false}
                        onChange={(value) =>
                          updateModalField("saturday_holiday", value)
                        }
                      />

                      <Toggle
                        label="Show notice dates on calendar"
                        description="Notices with dates will appear as blue event markers."
                        checked={modalForm.show_notice_dates !== false}
                        onChange={(value) =>
                          updateModalField("show_notice_dates", value)
                        }
                      />
                    </>
                  )}

                  {editorType === "event" && (
                    <>
                      <Field
                        label="Title"
                        value={modalForm.title}
                        onChange={(value) => updateModalField("title", value)}
                        placeholder="First Terminal Exam / Sports Week / Dashain Holiday"
                      />

                      <SelectField
                        label="Type"
                        value={modalForm.type}
                        onChange={(value) => updateModalField("type", value)}
                      >
                        {calendarTypeOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </SelectField>

                      <div className="grid md:grid-cols-2 gap-4">
                        <Field
                          label="Start BS Date"
                          value={modalForm.start_bs}
                          onChange={(value) =>
                            updateModalField("start_bs", value)
                          }
                          placeholder="2083-03-24"
                        />

                        <Field
                          label="End BS Date"
                          value={modalForm.end_bs}
                          onChange={(value) => updateModalField("end_bs", value)}
                          placeholder="Optional. Same date for one day."
                        />
                      </div>

                      <Field
                        label="Description"
                        value={modalForm.description}
                        onChange={(value) =>
                          updateModalField("description", value)
                        }
                        placeholder="Optional details"
                        textarea
                      />

                      <Toggle
                        label="Show this item on calendar"
                        checked={modalForm.visible !== false}
                        onChange={(value) => updateModalField("visible", value)}
                      />
                    </>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-7">
                  {editorType === "event" && editingIndex !== "new" && (
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(modalForm)}
                      disabled={saving}
                      className="sm:w-auto px-5 py-3 rounded-2xl text-sm font-black transition-all hover:-translate-y-0.5 disabled:opacity-60 inline-flex items-center justify-center gap-2"
                      style={{
                        background: "rgba(215,25,32,0.08)",
                        color: colors.red,
                        border: "1px solid rgba(215,25,32,0.18)",
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={closeEditor}
                    disabled={saving}
                    className="flex-1 py-3 rounded-2xl text-sm font-black transition-all hover:-translate-y-0.5 disabled:opacity-60"
                    style={{
                      background: "rgba(15,23,42,0.06)",
                      color: "rgba(15,23,42,0.65)",
                      border: "1px solid rgba(15,23,42,0.08)",
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={editorType === "settings" ? saveSettings : saveEvent}
                    disabled={saving}
                    className="flex-1 py-3 rounded-2xl text-sm font-black transition-all hover:-translate-y-0.5 disabled:opacity-60 inline-flex items-center justify-center gap-2"
                    style={{
                      background: `linear-gradient(135deg, ${colors.gold}, ${colors.cyan})`,
                      color: "#020617",
                      boxShadow: "0 16px 38px rgba(56,189,248,0.24)",
                    }}
                  >
                    <Save className="w-4 h-4" />
                    {saving
                      ? "Saving..."
                      : editorType === "settings"
                      ? "Save Heading"
                      : "Save Event"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {deleteTarget && (
          <motion.div
            className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-5"
            style={{
              background: "rgba(2,6,23,0.62)",
              backdropFilter: "blur(14px)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              if (!saving) setDeleteTarget(null);
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              className="w-full max-w-md rounded-[28px] bg-white overflow-hidden"
              style={{
                boxShadow: "0 42px 110px rgba(0,0,0,0.32)",
                border: "1px solid rgba(255,255,255,0.75)",
              }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="p-6">
                <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-5">
                  <Trash2 className="w-6 h-6" />
                </div>

                <h3 className="text-2xl font-black text-slate-950 mb-2">
                  Delete calendar item?
                </h3>

                <p className="text-sm text-slate-500 leading-relaxed mb-6">
                  This will permanently remove <b>{deleteTarget.title}</b> from
                  the school calendar.
                </p>

                <div className="flex gap-3">
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => setDeleteTarget(null)}
                    className="flex-1 py-3 rounded-2xl text-sm font-black disabled:opacity-60"
                    style={{
                      background: "rgba(15,23,42,0.06)",
                      color: "rgba(15,23,42,0.68)",
                      border: "1px solid rgba(15,23,42,0.08)",
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    disabled={saving}
                    onClick={deleteEvent}
                    className="flex-1 py-3 rounded-2xl text-sm font-black disabled:opacity-60 inline-flex items-center justify-center gap-2"
                    style={{
                      background: `linear-gradient(135deg, ${colors.red}, #991B1B)`,
                      color: "#FFFFFF",
                      boxShadow: "0 16px 38px rgba(215,25,32,0.24)",
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                    {saving ? "Deleting..." : "Yes, Delete"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
