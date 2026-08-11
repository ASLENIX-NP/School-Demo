import { useState } from "react";

import {
  Link,
  useSearchParams,
  useNavigate,
} from "react-router-dom";

import { motion } from "motion/react";

import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  ShieldCheck,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

export default function AdminResetPassword() {
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const emailFromUrl =
    searchParams.get("email") || "";

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState("");

  const [error, setError] =
    useState("");

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    setForm((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  // =====================================================
  // RESET PASSWORD
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // -----------------------------------------------
    // Email check
    // -----------------------------------------------

    if (!emailFromUrl) {
      setError(
        "Email information is missing. Please start the password recovery process again."
      );

      return;
    }

    // -----------------------------------------------
    // Password check
    // -----------------------------------------------

    if (form.password.length < 8) {
      setError(
        "Password must be at least 8 characters long."
      );

      return;
    }

    // -----------------------------------------------
    // Confirm password
    // -----------------------------------------------

    if (
      form.password !==
      form.confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );

      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/admin-settings/reset-password`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: emailFromUrl
              .trim()
              .toLowerCase(),

            password: form.password,
          }),
        }
      );

      const data = await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Could not reset password."
        );
      }

      setSuccess(
        data.message ||
          "Password reset successfully."
      );

      setForm({
        password: "",
        confirmPassword: "",
      });

      setShowPassword(false);
      setShowConfirmPassword(false);
    } catch (err) {
      console.error(
        "Reset password error:",
        err
      );

      setError(
        err.message ||
          "Could not reset password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="min-h-screen flex items-center justify-center px-6 py-12 relative overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at top left, rgba(56,189,248,0.18), transparent 34%), radial-gradient(circle at bottom right, rgba(37,99,235,0.20), transparent 34%), linear-gradient(135deg, #020617 0%, #0F172A 50%, #111827 100%)",
      }}
    >
      {/* =================================================
          BACKGROUND GLOW
      ================================================= */}

      <div
        className="absolute top-0 right-0 w-[520px] h-[520px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(37,99,235,0.25), transparent 70%)",
          filter: "blur(10px)",
        }}
      />

      <div
        className="absolute bottom-0 left-0 w-[460px] h-[460px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(56,189,248,0.15), transparent 70%)",
          filter: "blur(10px)",
        }}
      />

      {/* =================================================
          CARD
      ================================================= */}

      <motion.div
        initial={{
          opacity: 0,
          y: 35,
          scale: 0.96,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.6,
        }}
        className="relative z-10 w-full max-w-md rounded-[2rem] p-8"
        style={{
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.14), rgba(255,255,255,0.06))",

          border:
            "1px solid rgba(255,255,255,0.16)",

          boxShadow:
            "0 35px 100px rgba(0,0,0,0.36), inset 0 1px 0 rgba(255,255,255,0.16)",

          backdropFilter:
            "blur(24px)",
        }}
      >
        {/* =================================================
            BACK TO LOGIN
        ================================================= */}

        <Link
          to="/admin/login"
          className="inline-flex items-center gap-2 text-sm font-bold mb-6 transition-colors hover:text-white"
          style={{
            color:
              "rgba(255,255,255,0.72)",
          }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="text-center mb-8">
          <div
            className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-5"
            style={{
              background:
                "linear-gradient(135deg, #2563EB, #38BDF8)",

              boxShadow:
                "0 20px 48px rgba(56,189,248,0.26)",
            }}
          >
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>

          <h1 className="text-3xl mb-2 text-white font-bold">
            Reset Password
          </h1>

          <p
            className="text-sm"
            style={{
              color:
                "rgba(255,255,255,0.62)",
            }}
          >
            Create a new password for
            your admin account.
          </p>

          {emailFromUrl && (
            <p className="text-xs text-cyan-300 mt-3">
              Account: {emailFromUrl}
            </p>
          )}
        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div
            className="mb-5 rounded-2xl px-4 py-3 text-sm font-medium"
            style={{
              background:
                "rgba(215,25,32,0.14)",

              border:
                "1px solid rgba(215,25,32,0.26)",

              color: "#FCA5A5",
            }}
          >
            {error}
          </div>
        )}

        {/* =================================================
            SUCCESS
        ================================================= */}

        {success && (
          <div
            className="mb-5 rounded-2xl px-4 py-3 text-sm font-medium"
            style={{
              background:
                "rgba(22,138,58,0.16)",

              border:
                "1px solid rgba(22,138,58,0.28)",

              color: "#BBF7D0",
            }}
          >
            {success}
          </div>
        )}

        {/* =================================================
            SUCCESS SCREEN
        ================================================= */}

        {success ? (
          <button
            type="button"
            onClick={() =>
              navigate("/admin/login")
            }
            className="w-full inline-flex items-center justify-center gap-3 py-4 rounded-2xl font-bold transition-all duration-300 hover:scale-[1.01]"
            style={{
              color: "#020617",

              background:
                "linear-gradient(135deg, #FACC15, #38BDF8)",

              boxShadow:
                "0 22px 52px rgba(56,189,248,0.28)",
            }}
          >
            Go to Login

            <ArrowRight className="w-5 h-5" />
          </button>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
            autoComplete="off"
          >
            {/* =================================================
                NEW PASSWORD
            ================================================= */}

            <div>
              <label className="block text-sm font-semibold text-white/80 mb-2">
                New Password
              </label>

              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 pointer-events-none"
                />

                <input
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="Enter new password"
                  className="w-full pl-12 pr-14 py-4 rounded-2xl outline-none text-white placeholder:text-white/30"
                  style={{
                    background:
                      "rgba(255,255,255,0.08)",

                    border:
                      "1px solid rgba(255,255,255,0.14)",

                    boxShadow:
                      "inset 0 1px 0 rgba(255,255,255,0.08)",
                  }}
                />

                {/* Eye button */}

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (previous) =>
                        !previous
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-all"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* =================================================
                CONFIRM NEW PASSWORD
            ================================================= */}

            <div>
              <label className="block text-sm font-semibold text-white/80 mb-2">
                Confirm New Password
              </label>

              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 pointer-events-none"
                />

                <input
                  name="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={
                    form.confirmPassword
                  }
                  onChange={handleChange}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="Confirm new password"
                  className="w-full pl-12 pr-14 py-4 rounded-2xl outline-none text-white placeholder:text-white/30"
                  style={{
                    background:
                      "rgba(255,255,255,0.08)",

                    border:
                      "1px solid rgba(255,255,255,0.14)",

                    boxShadow:
                      "inset 0 1px 0 rgba(255,255,255,0.08)",
                  }}
                />

                {/* Eye button */}

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (previous) =>
                        !previous
                    )
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-all"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* =================================================
                PASSWORD REQUIREMENT
            ================================================= */}

            <div
              className="rounded-xl px-4 py-3 text-xs"
              style={{
                background:
                  "rgba(255,255,255,0.04)",

                border:
                  "1px solid rgba(255,255,255,0.08)",

                color:
                  "rgba(255,255,255,0.55)",
              }}
            >
              Password must contain at
              least 8 characters.
            </div>

            {/* =================================================
                RESET BUTTON
            ================================================= */}

            <button
              type="submit"
              disabled={
                loading ||
                !emailFromUrl
              }
              className="w-full inline-flex items-center justify-center gap-3 py-4 rounded-2xl font-bold transition-all duration-300 hover:scale-[1.01] disabled:opacity-60"
              style={{
                color: "#020617",

                background:
                  "linear-gradient(135deg, #FACC15, #38BDF8)",

                boxShadow:
                  "0 22px 52px rgba(56,189,248,0.28)",
              }}
            >
              {loading
                ? "Resetting Password..."
                : "Reset Password"}

              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        )}
      </motion.div>
    </section>
  );
}