import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, Construction, LayoutDashboard } from "lucide-react";

const colors = {
  dark: "#0B1020",
  cyan: "#38BDF8",
  gold: "#FACC15",
  purple: "#4B2E83",
};

export default function AdminComingSoon({ title, description }) {
  const navigate = useNavigate();

  return (
    <section
      className="min-h-screen"
      style={{
        background: `
          radial-gradient(circle at top right, rgba(56,189,248,0.16), transparent 34%),
          radial-gradient(circle at bottom left, rgba(250,204,21,0.12), transparent 32%),
          linear-gradient(180deg, #FFF8EE 0%, #F1ECFF 100%)
        `,
      }}
    >
      <header
        className="sticky top-0 z-40"
        style={{
          background:
            "linear-gradient(145deg, rgba(2,6,23,0.96), rgba(15,23,42,0.88))",
          borderBottom: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 18px 52px rgba(0,0,0,0.22)",
          backdropFilter: "blur(22px)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/admin/dashboard")}
            className="inline-flex items-center gap-2 text-white font-bold"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/dashboard")}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-bold transition-all hover:scale-105"
            style={{
              color: "#020617",
              background: `linear-gradient(135deg, ${colors.gold}, ${colors.cyan})`,
              boxShadow:
                "0 18px 42px rgba(56,189,248,0.28), inset 0 1px 0 rgba(255,255,255,0.45)",
            }}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="rounded-[2rem] p-10 md:p-14 text-center"
          style={{
            background:
              "linear-gradient(145deg, rgba(255,255,255,0.96), rgba(255,255,255,0.76))",
            border: "1px solid rgba(11,16,32,0.08)",
            boxShadow:
              "0 24px 70px rgba(11,16,32,0.1), inset 0 1px 0 rgba(255,255,255,0.85)",
            backdropFilter: "blur(16px)",
          }}
        >
          <div
            className="w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-8"
            style={{
              background: "rgba(75,46,131,0.1)",
              border: "1px solid rgba(75,46,131,0.18)",
            }}
          >
            <Construction className="w-10 h-10" style={{ color: colors.purple }} />
          </div>

          <h1
            className="text-4xl md:text-6xl mb-5"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 850,
              color: colors.dark,
              letterSpacing: "-0.045em",
            }}
          >
            //change
            {title}
          </h1>

          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            {description ||
              "This admin editor is not built yet. We will create this section next."}
          </p>
        </motion.div>
      </main>
    </section>
  );
}
