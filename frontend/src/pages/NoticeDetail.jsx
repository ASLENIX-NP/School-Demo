import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import PdfNoticePreview from "../app/components/PdfNoticePreview";

const API_URL = "https://school-website-backend-ixx2.onrender.com";
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

function formatNoticeDate(dateValue) {
  if (!dateValue) return "No date";

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return dateValue;

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function NoticeDetail() {
  const { id } = useParams();

  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let alive = true;

    async function loadNotice() {
      if (!id) {
        setLoading(false);
        setErrorMessage("Notice not found.");
        return;
      }

      setLoading(true);
      setErrorMessage("");

      try {
        const result = await fetchJsonWithTimeout(`${API_URL}/api/notices/${id}`);
        const loadedNotice =
          result?.success === false ? null : result?.data || result || null;

        if (!alive) return;

        setNotice(loadedNotice);
      } catch (error) {
        if (!alive) return;

        console.error("Notice detail load error:", error);
        setErrorMessage("Notice could not be loaded right now.");
      } finally {
        if (alive) setLoading(false);
      }
    }

    loadNotice();

    return () => {
      alive = false;
    };
  }, [id]);

  if (loading) {
    return (
      <section
        className="min-h-screen pt-32 pb-24 px-6"
        style={{
          background:
            "linear-gradient(180deg, #FFF8EE 0%, #F8FAFC 58%, #F1ECFF 100%)",
        }}
      >
        <div className="max-w-5xl mx-auto">
          <Link
            to="/notices"
            className="inline-flex mb-6 rounded-2xl px-5 py-3 text-sm font-black"
            style={{
              background: "#FFFFFF",
              color: "#0B1020",
              border: "1px solid rgba(15,23,42,0.10)",
            }}
          >
            ← Back to Notices
          </Link>

          <div
            className="rounded-[32px] p-8 md:p-10 text-center"
            style={{
              background: "#FFFFFF",
              border: "1px solid rgba(15,23,42,0.08)",
              boxShadow: "0 22px 58px rgba(15,23,42,0.10)",
            }}
          >
            <div
              className="mx-auto mb-5 h-1.5 w-24 rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, #D71920, #FACC15, #168A3A)",
              }}
            />

            <h1 className="text-3xl font-black text-slate-950">
              Opening notice...
            </h1>

            <p className="mt-3 text-slate-500">
              The notice page is ready while the latest data loads.
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (!notice) {
    return (
      <section
        className="min-h-screen pt-32 pb-24 px-6"
        style={{
          background:
            "linear-gradient(180deg, #FFF8EE 0%, #F8FAFC 58%, #F1ECFF 100%)",
        }}
      >
        <div className="max-w-5xl mx-auto">
          <Link
            to="/notices"
            className="inline-flex mb-6 rounded-2xl px-5 py-3 text-sm font-black"
            style={{
              background: "#FFFFFF",
              color: "#0B1020",
              border: "1px solid rgba(15,23,42,0.10)",
            }}
          >
            ← Back to Notices
          </Link>

          <div
            className="rounded-[32px] p-8 md:p-10 text-center"
            style={{
              background: "#FFFFFF",
              border: "1px solid rgba(15,23,42,0.08)",
              boxShadow: "0 22px 58px rgba(15,23,42,0.10)",
            }}
          >
            <h1 className="text-3xl font-black text-slate-950 mb-4">
              Notice not found
            </h1>

            <p className="text-slate-500">
              {errorMessage || "This notice may have been removed or is unavailable."}
            </p>
          </div>
        </div>
      </section>
    );
  }

  const fileUrl =
    notice.pdf_url || notice.pdfUrl || notice.file_url || notice.fileUrl || "";
  const fileType = String(notice.file_type || notice.fileType || "").toLowerCase();
  const isImageFile =
    fileType === "image" ||
    /\.(png|jpe?g|gif|webp|avif)(\?.*)?$/i.test(fileUrl || "");

  return (
    <section
      className="min-h-screen pt-32 pb-24 px-6"
      style={{
        background:
          "linear-gradient(180deg, #FFF8EE 0%, #F8FAFC 58%, #F1ECFF 100%)",
      }}
    >
      <div className="max-w-6xl mx-auto">
        <Link
          to="/notices"
          className="inline-flex mb-6 rounded-2xl px-5 py-3 text-sm font-black"
          style={{
            background: "#FFFFFF",
            color: "#0B1020",
            border: "1px solid rgba(15,23,42,0.10)",
          }}
        >
          ← Back to Notices
        </Link>

        <div
          className="rounded-[32px] overflow-hidden"
          style={{
            background: "#FFFFFF",
            border: "1px solid rgba(15,23,42,0.08)",
            boxShadow: "0 22px 58px rgba(15,23,42,0.10)",
          }}
        >
          <div
            className="h-2 w-full"
            style={{
              background:
                "linear-gradient(90deg, #D71920, #FACC15, #168A3A)",
            }}
          />

          <div className="p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span
                className="rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-[0.14em]"
                style={{
                  background: "rgba(22,138,58,0.09)",
                  color: "#168A3A",
                  border: "1px solid rgba(22,138,58,0.18)",
                }}
              >
                {notice.category || "Notice"}
              </span>

              <span className="text-sm font-bold text-slate-400">
                {formatNoticeDate(notice.notice_date || notice.date)}
              </span>
            </div>

            <h1
              className="text-4xl md:text-6xl text-slate-950 leading-tight mb-5"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 850,
                letterSpacing: "-0.05em",
              }}
            >
              {notice.title || "School Notice"}
            </h1>

            {notice.description && (
              <p className="text-lg leading-relaxed text-slate-600 mb-7 whitespace-pre-line">
                {notice.description}
              </p>
            )}

            {fileUrl ? (
              <>
                {isImageFile ? (
                  <div className="rounded-[24px] overflow-hidden bg-slate-100">
                    <img
                      src={fileUrl}
                      alt={notice.title || "Notice attachment"}
                      className="w-full max-h-[75vh] object-contain"
                    />
                  </div>
                ) : (
                  <div className="h-[75vh] rounded-[24px] overflow-hidden">
                    <PdfNoticePreview
                      fileUrl={fileUrl}
                      title={notice.title || "Notice PDF"}
                    />
                  </div>
                )}
              </>
            ) : (
              <div
                className="rounded-[24px] p-6"
                style={{
                  background: "rgba(15,23,42,0.035)",
                  border: "1px solid rgba(15,23,42,0.08)",
                }}
              >
                <p className="text-lg text-slate-600">
                  No PDF attached for this notice.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}


