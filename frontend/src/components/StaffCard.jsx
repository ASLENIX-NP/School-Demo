import React from "react";
import { Link } from "react-router-dom";
import { Mail, Clock, ArrowRight, BookOpen } from "lucide-react";

export function StaffCard({ teacher }) {
  const { id, name, title, subject, grades, officeHours, photo, email } = teacher;

  return (
    <div className="group h-full flex flex-col justify-between bg-white rounded-xl border border-slate-200/90 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div>
        {/* Headshot */}
        <div className="flex justify-center mb-4">
          <div className="relative overflow-hidden rounded-full p-1 border-2 border-slate-200/80 bg-slate-50 group-hover:border-[#0A1628] transition-colors duration-300">
            <img
              src={photo}
              alt={`Photo of ${name}, ${title}`}
              className="w-24 h-24 rounded-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </div>
        </div>

        {/* Info */}
        <div className="text-center mb-4">
          <h3 className="text-lg font-extrabold text-[#0A1628] leading-snug group-hover:text-blue-900 transition-colors">
            {name}
          </h3>
          <p className="text-xs font-bold text-[#1E3A5F] bg-sky-50 border border-sky-100 rounded-full px-3 py-0.5 inline-block mt-1">
            {title}
          </p>
        </div>

        {/* Subject & Grades */}
        <div className="space-y-2 mb-4 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-semibold">{subject}</span>
          </div>
          <div className="text-[11px] text-slate-400 pl-5">{grades}</div>

          {/* Office Hours */}
          {officeHours && (
            <div className="flex items-start gap-2 text-slate-500 pt-1">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span className="text-[11px]">{officeHours}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2.5 pt-4 border-t border-slate-100">
        <a
          href={`mailto:${email}`}
          aria-label={`Send email to ${name}`}
          className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
        >
          <Mail className="w-3.5 h-3.5 text-slate-600" />
          <span>Email</span>
        </a>

        <Link
          to={`/staff/${id}`}
          aria-label={`View full profile of ${name}`}
          className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-sky-200/80 bg-sky-50 hover:bg-sky-100 hover:border-sky-300 text-xs font-bold text-sky-800 transition-colors cursor-pointer"
        >
          <span>Profile</span>
          <ArrowRight className="w-3.5 h-3.5 text-sky-700" />
        </Link>
      </div>
    </div>
  );
}

export default StaffCard;
