import { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export default function PdfNoticePreview({ fileUrl, title = "Notice PDF" }) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cleanUrl = typeof fileUrl === "string" ? fileUrl.trim() : "";

    if (!cleanUrl) {
      setLoading(false);
      setError("PDF URL is missing.");
      return;
    }

    let cancelled = false;
    let pdfDoc = null;
    let renderTask = null;

    async function renderPdf() {
      setLoading(true);
      setError("");

      try {
        const loadingTask = pdfjsLib.getDocument({
          url: cleanUrl,
          withCredentials: false,
        });

        pdfDoc = await loadingTask.promise;

        if (cancelled) return;

        const page = await pdfDoc.getPage(1);
        const canvas = canvasRef.current;
        const wrapper = wrapRef.current;

        if (!canvas || !wrapper || cancelled) return;

        const baseViewport = page.getViewport({ scale: 1 });
        const wrapperWidth = Math.max(wrapper.clientWidth || 900, 320);

        const scale = Math.max(
          1.4,
          Math.min(2.4, wrapperWidth / baseViewport.width)
        );

        const viewport = page.getViewport({ scale });

        const context = canvas.getContext("2d");
        const dpr = window.devicePixelRatio || 1;

        canvas.width = Math.floor(viewport.width * dpr);
        canvas.height = Math.floor(viewport.height * dpr);
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;

        context.setTransform(dpr, 0, 0, dpr, 0, 0);
        context.fillStyle = "#FFFFFF";
        context.fillRect(0, 0, viewport.width, viewport.height);

        renderTask = page.render({
          canvasContext: context,
          viewport,
        });

        await renderTask.promise;

        if (!cancelled) {
          setLoading(false);
        }
      } catch (err) {
        console.error("PDF preview render error:", err);

        if (!cancelled) {
          setError("PDF preview could not be loaded.");
          setLoading(false);
        }
      }
    }

    renderPdf();

    return () => {
      cancelled = true;

      if (renderTask) {
        try {
          renderTask.cancel();
        } catch {
          // ignore
        }
      }

      if (pdfDoc) {
        try {
          pdfDoc.destroy();
        } catch {
          // ignore
        }
      }
    };
  }, [fileUrl]);

  return (
    <div
      ref={wrapRef}
      className="relative h-full w-full overflow-auto rounded-[22px]"
      style={{
        background: "#F8FAFC",
        border: "1px solid rgba(15,23,42,0.10)",
      }}
    >
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white">
          <div className="text-sm font-black text-slate-500">
            Loading notice preview...
          </div>
        </div>
      )}

      {error ? (
        <div className="flex h-full min-h-[420px] items-center justify-center bg-white p-8 text-center">
          <div>
            <div className="text-xl font-black text-slate-950 mb-2">
              Preview unavailable
            </div>

            <div className="text-sm text-slate-500">
              PDF preview could not be opened inside the page.
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center p-4 md:p-6">
          <canvas
            ref={canvasRef}
            title={title}
            className="max-w-none rounded-xl bg-white shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}


