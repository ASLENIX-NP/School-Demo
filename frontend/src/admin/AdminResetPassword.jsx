import { useState } from "react";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, Lock, ShieldCheck } from "lucide-react";

const API_URL = "https://school-website-backend-ixx2.onrender.com";

const colors = {
  red: "#D71920",
  green: "#168A3A",
  purple: "#4B2E83",
  dark: "#0B1020",
  cyan: "#38BDF8",
  gold: "#FACC15",
};

export default function AdminResetPassword() {
  const [searchParams] = useSearchParams();

  const emailFromUrl = searchParams.get("email") || "";
  const tokenFromUrl = searchParams.get("token") || "";

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const resetLinkMissing = !emailFromUrl || !tokenFromUrl;

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    if (resetLinkMissing) {
      setError("Reset link is missing or invalid.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/api/admin/auth/reset-password`, {
        email: emailFromUrl,
        token: tokenFromUrl,
        password: form.password,
      });

      setSuccess(
        res.data?.message || "Password reset successfully. Please login again."
      );

      setForm({
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error("Reset password error:", err);

      setError(
        err.response?.data?.message ||
          "Could not reset password. Please request a new reset link."
      );
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
        <Link
          to="/admin/login"
          className="inline-flex items-center gap-2 text-sm font-bold mb-6 transition-colors hover:text-white"
          style={{ color: "rgba(255,255,255,0.72)" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>

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
            Reset Password
          </h1>

          <p className="text-sm" style={{ color: "rgba(255,255,255,0.62)" }}>
            Create a new admin password for the school dashboard.
          </p>
        </div>

        {resetLinkMissing && (
          <div
            className="mb-5 rounded-2xl px-4 py-3 text-sm font-medium"
            style={{
              background: "rgba(215,25,32,0.14)",
              border: "1px solid rgba(215,25,32,0.26)",
              color: "#FCA5A5",
            }}
          >
            Reset link is missing or invalid. Please request a new link.
          </div>
        )}

        {success && (
          <div
            className="mb-5 rounded-2xl px-4 py-3 text-sm font-medium"
            style={{
              background: "rgba(22,138,58,0.16)",
              border: "1px solid rgba(22,138,58,0.28)",
              color: "#BBF7D0",
            }}
          >
            {success}
          </div>
        )}

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

        {success ? (
          <Link
            to="/admin/login"
            className="w-full inline-flex items-center justify-center gap-3 py-4 rounded-2xl font-bold transition-all duration-300 hover:scale-[1.01]"
            style={{
              color: "#020617",
              background: `linear-gradient(135deg, ${colors.gold}, ${colors.cyan})`,
              boxShadow:
                "0 22px 52px rgba(56,189,248,0.28), inset 0 1px 0 rgba(255,255,255,0.45)",
            }}
          >
            Go to Login
            <ArrowRight className="w-5 h-5" />
          </Link>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
            <div>
              <label className="block text-sm font-semibold text-white/80 mb-2">
                New Password
              </label>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/42" />
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  autoComplete="new-password"
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
                Confirm New Password
              </label>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/42" />
                <input
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl outline-none text-white"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.14)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || resetLinkMissing}
              className="w-full inline-flex items-center justify-center gap-3 py-4 rounded-2xl font-bold transition-all duration-300 hover:scale-[1.01] disabled:opacity-60"
              style={{
                color: "#020617",
                background: `linear-gradient(135deg, ${colors.gold}, ${colors.cyan})`,
                boxShadow:
                  "0 22px 52px rgba(56,189,248,0.28), inset 0 1px 0 rgba(255,255,255,0.45)",
              }}
            >
              {loading ? "Resetting password..." : "Reset Password"}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        )}
      </motion.div>
    </section>
  );
}
