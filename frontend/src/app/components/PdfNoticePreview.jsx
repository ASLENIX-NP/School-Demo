import { FileText, Download, ExternalLink } from "lucide-react";

export default function PdfNoticePreview({ title = "Official School Notice Attachment", fileUrl }) {
  return (
    <div className="rounded-2xl p-4 bg-slate-900 text-white border border-slate-800 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 font-bold">
          <FileText className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-bold text-white truncate">{title}</h4>
          <p className="text-xs text-slate-400">PDF Document • Official School Document</p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <a
          href={fileUrl || "#"}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => {
            if (!fileUrl) {
              e.preventDefault();
              alert("Notice document attachment preview loaded.");
            }
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-sky-600 text-white hover:bg-sky-500 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download</span>
        </a>
      </div>
    </div>
  );
}
