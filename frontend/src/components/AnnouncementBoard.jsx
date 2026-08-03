import React from "react";
import { Bell, Calendar, Tag } from "lucide-react";

export function AnnouncementBoard({ announcements }) {
  if (!announcements || announcements.length === 0) {
    return (
      <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500 font-semibold">
        No recent class announcements.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {announcements.map((item) => (
        <div
          key={item.id}
          className="p-5 rounded-xl border border-slate-200/90 bg-white shadow-sm hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200/80">
              <Tag className="w-3 h-3 text-sky-600" />
              {item.tag || "Notice"}
            </span>

            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{item.date}</span>
            </div>
          </div>

          <h4 className="text-sm font-extrabold text-[#0A1628] mb-1">
            {item.title}
          </h4>

          <p className="text-xs text-slate-600 leading-relaxed">
            {item.content}
          </p>
        </div>
      ))}
    </div>
  );
}

export default AnnouncementBoard;
