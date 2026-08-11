import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { motion } from "motion/react";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

export default function AdminForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [step, setStep] = useState("email");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =====================================================
  // SEND OTP
  // =====================================================

  const handleSendOtp = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError("Please enter your admin email address.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/admin-settings/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: cleanEmail,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to send OTP."
        );
      }

      setEmail(cleanEmail);

      setSuccess(
        data.message ||
          "OTP has been sent to your email."
      );

      setStep("otp");
    } catch (err) {
      console.error(
        "Forgot password error:",
        err
      );

      setError(
        err.message ||
          "Unable to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // VERIFY OTP
  // =====================================================

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.trim();

    if (!cleanOtp) {
      setError("Please enter the OTP.");
      return;
    }

    if (!/^\d{6}$/.test(cleanOtp)) {
      setError("OTP must be exactly 6 digits.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/admin-settings/verify-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: cleanEmail,
            otp: cleanOtp,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Invalid OTP."
        );
      }

      setSuccess("OTP verified successfully.");

      // Go to reset password page
      setTimeout(() => {
        navigate(
          `/admin/reset-password?email=${encodeURIComponent(
            cleanEmail
          )}`
        );
      }, 700);
    } catch (err) {
      console.error(
        "OTP verification error:",
        err
      );

      setError(
        err.message ||
          "Unable to verify OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // RESEND OTP
  // =====================================================

  const handleResendOtp = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const cleanEmail = email.trim().toLowerCase();

      const response = await fetch(
        `${API_URL}/api/admin-settings/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: cleanEmail,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to resend OTP."
        );
      }

      setSuccess("A new OTP has been sent.");
      setOtp("");
    } catch (err) {
      console.error(
        "Resend OTP error:",
        err
      );

      setError(
        err.message ||
          "Unable to resend OTP."
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
      {/* Background glow */}

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
            "radial-gradient(circle, rgba(14,165,233,0.15), transparent 70%)",
          filter: "blur(10px)",
        }}
      />

      {/* Main Card */}

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
          backdropFilter: "blur(24px)",
        }}
      >
        {/* Back to Login */}

        <Link
          to="/admin/login"
          className="inline-flex items-center gap-2 text-sm font-bold mb-7 transition-colors hover:text-white"
          style={{
            color:
              "rgba(255,255,255,0.72)",
          }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>

        {/* Header */}

        <div className="text-center mb-7">
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

          <h1 className="text-3xl text-white font-bold">
            {step === "email"
              ? "Forgot Password?"
              : "Verify OTP"}
          </h1>

          <p
            className="text-sm mt-3"
            style={{
              color:
                "rgba(255,255,255,0.62)",
            }}
          >
            {step === "email"
              ? "Enter your registered admin email and we will send you a verification OTP."
              : `Enter the 6-digit OTP sent to ${email}`}
          </p>
        </div>

        {/* Error */}

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

        {/* Success */}

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
            EMAIL STEP
        ================================================= */}

        {step === "email" && (
          <form
            onSubmit={handleSendOtp}
            className="space-y-5"
          >
            <div>
              <label className="block text-sm font-semibold text-white/80 mb-2">
                Admin Email Address
              </label>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 pointer-events-none" />

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="Enter your admin email"
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-2xl outline-none text-white placeholder:text-white/35"
                  style={{
                    background:
                      "rgba(255,255,255,0.08)",
                    border:
                      "1px solid rgba(255,255,255,0.14)",
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-3 py-4 rounded-2xl font-bold disabled:opacity-60 transition-all hover:scale-[1.01]"
              style={{
                color: "white",
                background:
                  "linear-gradient(135deg, #2563EB, #38BDF8)",
                boxShadow:
                  "0 22px 52px rgba(56,189,248,0.28)",
              }}
            >
              {loading
                ? "Sending OTP..."
                : "Send OTP"}

              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        )}

        {/* =================================================
            OTP STEP
        ================================================= */}

        {step === "otp" && (
          <form
            onSubmit={handleVerifyOtp}
            className="space-y-5"
          >
            <div>
              <label className="block text-sm font-semibold text-white/80 mb-2">
                Verification OTP
              </label>

              <input
                type="text"
                value={otp}
                onChange={(e) =>
                  setOtp(
                    e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 6)
                  )
                }
                placeholder="Enter 6-digit OTP"
                inputMode="numeric"
                maxLength={6}
                required
                className="w-full py-4 px-4 rounded-2xl outline-none text-white text-center text-2xl tracking-[0.5em] placeholder:text-white/35"
                style={{
                  background:
                    "rgba(255,255,255,0.08)",
                  border:
                    "1px solid rgba(255,255,255,0.14)",
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-3 py-4 rounded-2xl font-bold disabled:opacity-60 transition-all hover:scale-[1.01]"
              style={{
                color: "white",
                background:
                  "linear-gradient(135deg, #2563EB, #38BDF8)",
                boxShadow:
                  "0 22px 52px rgba(56,189,248,0.28)",
              }}
            >
              {loading
                ? "Verifying..."
                : "Verify OTP"}

              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={handleResendOtp}
              disabled={loading}
              className="w-full text-sm font-semibold text-sky-300 hover:text-white"
            >
              Resend OTP
            </button>

            <button
              type="button"
              onClick={() => {
                setStep("email");
                setOtp("");
                setError("");
                setSuccess("");
              }}
              className="w-full text-sm text-white/60 hover:text-white"
            >
              Change email
            </button>
          </form>
        )}

        {/* Security Info */}

        <div
          className="mt-6 rounded-2xl p-4"
          style={{
            background:
              "rgba(255,255,255,0.04)",
            border:
              "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div className="flex gap-3">
            <ShieldCheck className="w-5 h-5 text-cyan-400 mt-0.5" />

            <div>
              <p className="text-sm font-semibold text-white">
                Secure recovery
              </p>

              <p className="text-xs text-white/50 mt-1">
                Your password is never
                displayed or sent through
                the recovery page.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}