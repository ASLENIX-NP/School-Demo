import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Lock, Mail, ShieldCheck, ArrowRight } from "lucide-react";

const colors = {
  red: "#D71920",
  green: "#168A3A",
  purple: "#4B2E83",
  dark: "#0B1020",
  cyan: "#38BDF8",
  gold: "#FACC15",
};

export default function AdminLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        "https://school-website-backend-ixx2.onrender.com/api/admin/auth/login",
        form
      );

      localStorage.setItem("adminToken", res.data.token);
      localStorage.setItem("adminUser", JSON.stringify(res.data.admin));

      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Admin login error:", err);

      if (err.code === "ERR_NETWORK") {
        setError("Could not connect to backend. Please try again.");
      } else {
        setError(
          err.response?.data?.message || "Login failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="min-h-screen flex items-center justify-center px-6 py-12 relative overflow-hidden"
      style={{
        background: `
          radial-gradient(circle at top left, rgba(56,189,248,0.18), transparent 34%),
          radial-gradient(circle at bottom right, rgba(250,204,21,0.15), transparent 34%),
          linear-gradient(135deg, #020617 0%, #0F172A 50%, #111827 100%)
        `,
      }}
    >
      <div
        className="absolute top-0 right-0 w-[520px] h-[520px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(75,46,131,0.26), transparent 70%)",
          filter: "blur(10px)",
        }}
      />

      <div
        className="absolute bottom-0 left-0 w-[460px] h-[460px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(22,138,58,0.18), transparent 70%)",
          filter: "blur(10px)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 35, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md rounded-[2rem] p-8"
        style={{
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.14), rgba(255,255,255,0.06))",
          border: "1px solid rgba(255,255,255,0.16)",
          boxShadow:
            "0 35px 100px rgba(0,0,0,0.36), inset 0 1px 0 rgba(255,255,255,0.16)",
          backdropFilter: "blur(24px)",
        }}
      >
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-5"
            style={{
              background: `linear-gradient(135deg, ${colors.gold}, ${colors.cyan})`,
              boxShadow: "0 20px 48px rgba(56,189,248,0.26)",
            }}
          >
            <ShieldCheck className="w-8 h-8 text-slate-950" />
          </div>

          <h1
            className="text-3xl mb-2 text-white"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 850,
              letterSpacing: "-0.04em",
            }}
          >
            Admin Login
          </h1>

          <p className="text-sm" style={{ color: "rgba(255,255,255,0.62)" }}>
            Manage notices, gallery, messages, and school content.
          </p>
        </div>

        {error && (
          <div
            className="mb-5 rounded-2xl px-4 py-3 text-sm font-medium"
            style={{
              background: "rgba(215,25,32,0.14)",
              border: "1px solid rgba(215,25,32,0.26)",
              color: "#FCA5A5",
            }}
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleLogin}
          className="space-y-5"
          autoComplete="off"
        >
          <input
            type="text"
            name="fake-user"
            autoComplete="username"
            className="hidden"
            tabIndex="-1"
            aria-hidden="true"
          />
          <input
            type="password"
            name="fake-password"
            autoComplete="new-password"
            className="hidden"
            tabIndex="-1"
            aria-hidden="true"
          />

          <div>
            <label className="block text-sm font-semibold text-white/80 mb-2">
              Email Address
            </label>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/42" />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="off"
                inputMode="email"
                spellCheck="false"
                className="w-full pl-12 pr-4 py-4 rounded-2xl outline-none text-white"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.14)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
                }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-white/80 mb-2">
              Password
            </label>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/42" />
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
                spellCheck="false"
                className="w-full pl-12 pr-4 py-4 rounded-2xl outline-none text-white"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.14)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
                }}
              />
            </div>
          </div>

          <div className="flex items-center justify-end -mt-2">
            <Link
              to="/admin/forgot-password"
              className="text-sm font-bold transition-colors hover:text-white"
              style={{ color: "rgba(255,255,255,0.72)" }}
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-3 py-4 rounded-2xl font-bold transition-all duration-300 hover:scale-[1.01] disabled:opacity-60"
            style={{
              color: "#020617",
              background: `linear-gradient(135deg, ${colors.gold}, ${colors.cyan})`,
              boxShadow:
                "0 22px 52px rgba(56,189,248,0.28), inset 0 1px 0 rgba(255,255,255,0.45)",
            }}
          >
            {loading ? "Signing in..." : "Login to Dashboard"}
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </motion.div>
    </section>
  );
}
