import React from "react";
import { FileText, Download } from "lucide-react";

export function SyllabusCard({ item }) {
  const { title, grade, fileSize, fileUrl } = item;

  return (
    <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200/90 bg-white shadow-sm hover:shadow-md hover:border-slate-300 transition-all">
      <div className="flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 border border-red-100 flex items-center justify-center shrink-0">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs sm:text-sm font-extrabold text-[#0A1628] leading-tight">
            {title}
          </h4>
          <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
            {grade} • {fileSize} • PDF Document
          </p>
        </div>
      </div>

      <a
        href={fileUrl || "#"}
        download
        aria-label={`Download syllabus for ${title}`}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-sky-200/80 bg-sky-50 hover:bg-sky-100 text-xs font-bold text-sky-800 transition-colors cursor-pointer shrink-0"
      >
        <Download className="w-3.5 h-3.5 text-sky-700" />
        <span className="hidden sm:inline">Download</span>
      </a>
    </div>
  );
}

export default SyllabusCard;
