// AdminLogin.jsx
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
  ArrowRight
} from "lucide-react";

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
  // Create 20 random particles
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
          `
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
          backgroundSize: "60px 60px"
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Demo credentials
    if (email === "admin@school.com" && password === "admin123") {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("adminToken", "demo-token");
      localStorage.setItem(
        "adminUser",
        JSON.stringify({
          email,
          name: "Administrator",
          role: "admin",
        })
      ); navigate("/admin/dashboard");
    } else {
      setError("Invalid email or password. Please try again.");
    }
    setIsLoading(false);
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
        {/* ===== LEFT SIDE - WELCOME ===== */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-white hidden lg:block"
        >
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: colors.glass }}>
              <School size={28} className="text-white" />
            </div>
            <span className="text-xl font-bold tracking-wide">Smriti School</span>
          </div>

          <div className="flex justify-center mb-10">
            <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/10 shadow-2xl">
              <School className="w-14 h-14 text-cyan-400" />
            </div>
          </div>

          {/* Upgraded Professional Left Section */}
          <h1 className="text-4xl md:text-5xl font-bold mb-3 leading-tight">
            School Management System
          </h1>

          <p className="text-xl leading-9 text-white/80 max-w-lg mb-6">
            Modern, secure, and centralized administration platform for managing
            students, teachers, admissions, notices, galleries, and school information.
          </p>

          <div className="mt-6 flex items-center gap-2 text-sm text-white/40">
            <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse mr-1" />
            System Online
          </div>
        </motion.div>

        {/* ===== RIGHT SIDE - LOGIN CARD ===== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto"
        >
          {/* Upgraded Glassmorphism Card */}
          <div
            className="rounded-[32px] p-8 md:p-10 border relative overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.06)",
              borderColor: "rgba(255,255,255,0.12)",
              boxShadow: "0 25px 80px rgba(0,0,0,0.45), 0 0 60px rgba(37,99,235,0.18)",
              backdropFilter: "blur(35px)",
              WebkitBackdropFilter: "blur(35px)",
            }}
          >
            {/* Logo & Title */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, #2563EB, #38BDF8)",
                    boxShadow: "0 8px 30px rgba(37, 99, 235, 0.3)",
                  }}
                >
                  <School size={32} className="text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white">Welcome Back</h2>

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

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 p-3 rounded-xl text-sm"
                  style={{
                    background: "rgba(239, 68, 68, 0.15)",
                    color: "#EF4444",
                    border: "1px solid rgba(239, 68, 68, 0.2)",
                  }}
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Email Address
                </label>
                <div
                  className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 focus-within:ring-2"
                  style={{
                    background: colors.glass,
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <Mail size={18} className="text-white/40" />
                  {/* ✅ FIX: Removed the placeholder="admin@school.com" so the email is no longer shown */}
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent outline-none text-white placeholder-white/30 text-sm"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Password
                </label>
                <div
                  className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 focus-within:ring-2"
                  style={{
                    background: colors.glass,
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <Lock size={18} className="text-white/40" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-transparent outline-none text-white placeholder-white/30 text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-white/40 hover:text-white/70 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div
                    className="w-4 h-4 rounded flex items-center justify-center transition-all duration-200"
                    style={{
                      background: rememberMe ? colors.primary : colors.glass,
                      border: `1px solid ${rememberMe ? colors.primary : "rgba(255,255,255,0.15)"}`,
                    }}
                  >
                    {rememberMe && <CheckCircle size={12} className="text-white" />}
                  </div>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="hidden"
                  />
                  <span className="text-sm text-white/60 group-hover:text-white/80 transition-colors">
                    Remember me
                  </span>
                </label>
                <button
                  type="button"
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Login Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all duration-300 group relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, #2563EB, #38BDF8)",
                  boxShadow: "0 8px 30px rgba(37, 99, 235, 0.3)",
                }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Sign In
                      <motion.span
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRight size={18} />
                      </motion.span>
                    </>
                  )}
                </span>
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: "linear-gradient(135deg, #1D4ED8, #38BDF8)",
                  }}
                />
              </motion.button>
            </form>

            {/* Clean Footer */}
            <div className="mt-8 text-center text-xs text-white/40">
              © 2026 Smriti School. All Rights Reserved.
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;