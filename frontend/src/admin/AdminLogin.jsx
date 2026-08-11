import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  School,
  BookOpen,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

const API_URL = "http://localhost:5000";

// ============ COLOR PALETTE ============
const colors = {
  primary: "#2563EB",
  secondary: "#0F172A",
  accent: "#38BDF8",
  success: "#22C55E",
  warning: "#FACC15",
  glass: "rgba(255,255,255,0.08)",
  white: "#FFFFFF",
  dark: "#0F172A",
  lightGray: "#E2E8F0",
  gray: "#94A3B8",
};

// ============ ANIMATED BACKGROUND ============
const AnimatedBackground = () => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 2 + Math.random() * 4,
    duration: 4 + Math.random() * 6,
    delay: Math.random() * 5,
  }));

  return (
    <div className="fixed inset-0 overflow-hidden -z-10">
      {/* Rich Layered Background Gradients */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 15% 20%, rgba(59,130,246,0.28), transparent 35%),
            radial-gradient(circle at 85% 15%, rgba(168,85,247,0.20), transparent 30%),
            radial-gradient(circle at 50% 80%, rgba(34,197,94,0.15), transparent 40%),
            linear-gradient(135deg, #071224, #101D3A, #153B8A)
          `,
        }}
      />

      {/* Subtle Grid Pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Animated Glowing Circles */}
      <div className="absolute top-20 left-24 w-72 h-72 rounded-full bg-cyan-500/20 blur-[120px] animate-pulse" />

      <div className="absolute bottom-24 right-20 w-96 h-96 rounded-full bg-blue-600/20 blur-[160px] animate-pulse" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full bg-purple-500/20 blur-[100px] animate-pulse" />

      {/* Animated Floating Particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-cyan-300/40"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// ============ MAIN LOGIN COMPONENT ============
const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // =====================================================
  // ADMIN LOGIN
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      // -------------------------------------------------
      // CLEAR OLD AUTHENTICATION
      // -------------------------------------------------

      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");

      sessionStorage.removeItem("isAuthenticated");
      sessionStorage.removeItem("adminToken");
      sessionStorage.removeItem("adminUser");

      // -------------------------------------------------
      // VALIDATE FIELDS
      // -------------------------------------------------

      const submittedEmail = email.trim().toLowerCase();

      if (!submittedEmail || !password) {
        setError("Please enter your email and password.");
        setIsLoading(false);
        return;
      }

      // -------------------------------------------------
      // CALL BACKEND LOGIN API
      // -------------------------------------------------

      const response = await fetch(
        `${API_URL}/api/admin/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: submittedEmail,
            password: password,
          }),
        }
      );

      // -------------------------------------------------
      // READ SERVER RESPONSE
      // -------------------------------------------------

      let data;

      try {
        data = await response.json();
      } catch (jsonError) {
        console.error("Invalid server response:", jsonError);

        throw new Error(
          "Server returned an invalid response."
        );
      }

      console.log(
        "Admin login response:",
        data
      );

      // -------------------------------------------------
      // BACKEND REJECTED LOGIN
      // -------------------------------------------------

      if (!response.ok || !data.success) {
        setError(
          data?.message ||
            "Invalid email or password. Please try again."
        );

        setIsLoading(false);
        return;
      }

      // -------------------------------------------------
      // CHECK TOKEN
      // -------------------------------------------------

      if (!data.token) {
        console.error(
          "Backend login succeeded but no token was returned:",
          data
        );

        setError(
          "Login failed because the server did not return an authentication token."
        );

        setIsLoading(false);
        return;
      }

      // =================================================
      // IMPORTANT AUTHENTICATION FIX
      // =================================================
      //
      // Always store authentication in LOCAL STORAGE.
      //
      // Your ProtectedAdminRoute must be able to find
      // the token after navigate("/admin/dashboard").
      //
      // =================================================

      localStorage.setItem(
        "isAuthenticated",
        "true"
      );

      localStorage.setItem(
        "adminToken",
        data.token
      );

      localStorage.setItem(
        "adminUser",
        JSON.stringify(
          data.user || {
            id: "admin-1",
            email: submittedEmail,
            name: "School Administrator",
            role: "admin",
          }
        )
      );

      // -------------------------------------------------
      // DEBUG LOGS
      // -------------------------------------------------

      console.log(
        "Authentication saved successfully."
      );

      console.log(
        "isAuthenticated:",
        localStorage.getItem(
          "isAuthenticated"
        )
      );

      console.log(
        "adminToken:",
        localStorage.getItem(
          "adminToken"
        )
      );

      console.log(
        "adminUser:",
        localStorage.getItem(
          "adminUser"
        )
      );

      // -------------------------------------------------
      // GO TO ADMIN DASHBOARD
      // -------------------------------------------------

      navigate("/admin/dashboard", {
        replace: true,
      });

    } catch (err) {
      console.error(
        "Admin login error:",
        err
      );

      setError(
        err.message === "Failed to fetch"
          ? "Unable to connect to the server. Please make sure the backend is running."
          : err.message ||
            "Unable to login. Please try again."
      );

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <AnimatedBackground />

      {/* Decorative floating elements */}

      <div className="absolute top-10 left-10 text-white/5 hidden xl:block">
        <School size={140} />
      </div>

      <div className="absolute bottom-10 right-10 text-white/5 hidden xl:block">
        <BookOpen size={120} />
      </div>

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center relative z-10">

        {/* =====================================================
            LEFT SIDE - WELCOME
        ===================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            x: -30,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.7,
            delay: 0.2,
          }}
          className="text-white hidden lg:block"
        >
          <div className="flex items-center gap-3 mb-12">

            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{
                background: colors.glass,
              }}
            >
              <School
                size={28}
                className="text-white"
              />
            </div>

            <span className="text-xl font-bold tracking-wide">
              Red Rose School
            </span>

          </div>

          <div className="flex justify-center mb-10">

            <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/10 shadow-2xl">

              <School
                className="w-14 h-14 text-cyan-400"
              />

            </div>

          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-3 leading-tight">
            School Management System
          </h1>

          <p className="text-xl leading-9 text-white/80 max-w-lg mb-6">
            Modern, secure, and centralized administration
            platform for managing students, teachers,
            admissions, notices, galleries, and school
            information.
          </p>

          <div className="mt-6 flex items-center gap-2 text-sm text-white/40">

            <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse mr-1" />

            System Online

          </div>

        </motion.div>

        {/* =====================================================
            RIGHT SIDE - LOGIN CARD
        ===================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
          }}
          className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto"
        >

          <div
            className="rounded-[32px] p-8 md:p-10 border relative overflow-hidden"
            style={{
              background:
                "rgba(255,255,255,0.06)",

              borderColor:
                "rgba(255,255,255,0.12)",

              boxShadow:
                "0 25px 80px rgba(0,0,0,0.45), 0 0 60px rgba(37,99,235,0.18)",

              backdropFilter:
                "blur(35px)",

              WebkitBackdropFilter:
                "blur(35px)",
            }}
          >

            {/* =================================================
                LOGO & TITLE
            ================================================= */}

            <div className="text-center mb-8">

              <div className="flex justify-center mb-4">

                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, #2563EB, #38BDF8)",

                    boxShadow:
                      "0 8px 30px rgba(37, 99, 235, 0.3)",
                  }}
                >

                  <School
                    size={32}
                    className="text-white"
                  />

                </div>

              </div>

              <h2 className="text-2xl font-bold text-white">
                Welcome Back
              </h2>

              <p
                className="mt-2 text-sm font-medium tracking-wide"
                style={{
                  color: "#93C5FD",
                  letterSpacing: "0.08em",
                }}
              >
                Welcome to the School Management Portal
              </p>

            </div>

            {/* =================================================
                ERROR MESSAGE
            ================================================= */}

            <AnimatePresence>

              {error && (

                <motion.div
                  initial={{
                    opacity: 0,
                    height: 0,
                  }}
                  animate={{
                    opacity: 1,
                    height: "auto",
                  }}
                  exit={{
                    opacity: 0,
                    height: 0,
                  }}
                  className="mb-4 p-3 rounded-xl text-sm"
                  style={{
                    background:
                      "rgba(239, 68, 68, 0.15)",

                    color: "#EF4444",

                    border:
                      "1px solid rgba(239, 68, 68, 0.2)",
                  }}
                >
                  {error}
                </motion.div>

              )}

            </AnimatePresence>

            {/* =================================================
                LOGIN FORM
            ================================================= */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* EMAIL */}

              <div>

                <label className="block text-sm font-medium text-white/70 mb-2">
                  Email Address
                </label>

                <div
                  className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 focus-within:ring-2"
                  style={{
                    background:
                      colors.glass,

                    border:
                      "1px solid rgba(255,255,255,0.06)",
                  }}
                >

                  <Mail
                    size={18}
                    className="text-white/40"
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(
                        e.target.value
                      )
                    }
                    placeholder="Enter admin email"
                    className="w-full bg-transparent outline-none text-white placeholder-white/30 text-sm"
                    required
                    autoComplete="email"
                  />

                </div>

              </div>

              {/* PASSWORD */}

              <div>

                <label className="block text-sm font-medium text-white/70 mb-2">
                  Password
                </label>

                <div
                  className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 focus-within:ring-2"
                  style={{
                    background:
                      colors.glass,

                    border:
                      "1px solid rgba(255,255,255,0.06)",
                  }}
                >

                  <Lock
                    size={18}
                    className="text-white/40"
                  />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(e) =>
                      setPassword(
                        e.target.value
                      )
                    }
                    placeholder="••••••••"
                    className="w-full bg-transparent outline-none text-white placeholder-white/30 text-sm"
                    required
                    autoComplete="current-password"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className="text-white/40 hover:text-white/70 transition-colors"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>

                </div>

              </div>

              {/* =================================================
                  REMEMBER ME + FORGOT PASSWORD
              ================================================= */}

              <div className="flex items-center justify-between">

                <label className="flex items-center gap-2 cursor-pointer group">

                  <div
                    className="w-4 h-4 rounded flex items-center justify-center transition-all duration-200"
                    style={{
                      background:
                        rememberMe
                          ? colors.primary
                          : colors.glass,

                      border: `1px solid ${
                        rememberMe
                          ? colors.primary
                          : "rgba(255,255,255,0.15)"
                      }`,
                    }}
                  >

                    {rememberMe && (
                      <CheckCircle
                        size={12}
                        className="text-white"
                      />
                    )}

                  </div>

                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) =>
                      setRememberMe(
                        e.target.checked
                      )
                    }
                    className="hidden"
                  />

                  <span className="text-sm text-white/60 group-hover:text-white/80 transition-colors">
                    Remember me
                  </span>

                </label>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      "/admin/forgot-password"
                    )
                  }
                  className="text-sm font-medium text-blue-400 hover:text-blue-300 hover:underline transition-all duration-200 cursor-pointer"
                >
                  Forgot Password?
                </button>

              </div>

              {/* =================================================
                  LOGIN BUTTON
              ================================================= */}

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{
                  scale:
                    isLoading
                      ? 1
                      : 1.02,
                }}
                whileTap={{
                  scale:
                    isLoading
                      ? 1
                      : 0.98,
                }}
                className="w-full py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all duration-300 group relative overflow-hidden disabled:opacity-60"
                style={{
                  background:
                    "linear-gradient(135deg, #2563EB, #38BDF8)",

                  boxShadow:
                    "0 8px 30px rgba(37, 99, 235, 0.3)",
                }}
              >

                <span className="relative z-10 flex items-center gap-2">

                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />

                      Signing In...
                    </>
                  ) : (
                    <>
                      Sign In

                      <motion.span
                        animate={{
                          x: [0, 4, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                        }}
                      >
                        <ArrowRight size={18} />
                      </motion.span>
                    </>
                  )}

                </span>

                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background:
                      "linear-gradient(135deg, #1D4ED8, #38BDF8)",
                  }}
                />

              </motion.button>

            </form>

            {/* =================================================
                FOOTER
            ================================================= */}

            <div className="mt-8 text-center text-xs text-white/40">
              © 2026 Red Rose School. All Rights Reserved.
            </div>

          </div>

        </motion.div>

      </div>

    </div>
  );
};

export default LoginPage;