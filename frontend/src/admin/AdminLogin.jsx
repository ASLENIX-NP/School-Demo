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

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

// =====================================================
// COLOR PALETTE
// =====================================================

const colors = {
  primary: "#2563EB",
  secondary: "#0F172A",
  accent: "#38BDF8",
  success: "#22C55E",
  glass: "rgba(255,255,255,0.08)",
  white: "#FFFFFF",
};

// =====================================================
// AUTHENTICATION STORAGE
// =====================================================
//
// IMPORTANT:
//
// NEVER save the complete backend user object here.
//
// The backend may contain:
// - profile_photo
// - large base64 image data
// - other unnecessary fields
//
// Only save the small fields that the frontend actually
// needs for authentication and the admin UI.
//
// =====================================================

const AUTH_KEYS = [
  "isAuthenticated",
  "adminToken",
  "adminUser",
];

// =====================================================
// REMOVE OLD AUTHENTICATION
// =====================================================

function removeAuthKeys(storage) {
  if (!storage) return;

  AUTH_KEYS.forEach((key) => {
    try {
      storage.removeItem(key);
    } catch {
      // Ignore individual storage errors.
    }
  });
}

// =====================================================
// CREATE A SMALL ADMIN USER OBJECT
// =====================================================

function createSmallAdminUser(
  backendUser,
  fallbackEmail
) {
  const user =
    backendUser &&
    typeof backendUser === "object"
      ? backendUser
      : {};

  return {
    id:
      user.id ??
      user._id ??
      "admin-1",

    email:
      user.email ??
      fallbackEmail ??
      "admin@school.com",

    name:
      user.name ??
      user.fullName ??
      "School Administrator",

    username:
      user.username ??
      "admin",

    role:
      user.role ??
      "admin",
  };
}

// =====================================================
// SAVE AUTHENTICATION
// =====================================================
//
// Only three small values are stored:
//
// isAuthenticated
// adminToken
// adminUser
//
// profile_photo is intentionally NOT stored.
//
// =====================================================

function saveAuthentication(
  token,
  backendUser,
  fallbackEmail
) {
  if (!token) {
    throw new Error(
      "Authentication token was not returned by the server."
    );
  }

  const adminUser =
    createSmallAdminUser(
      backendUser,
      fallbackEmail
    );

  const userJson =
    JSON.stringify(adminUser);

  const tokenString =
    String(token);

  // ---------------------------------------------------
  // FIRST: REMOVE OLD AUTH KEYS
  // ---------------------------------------------------

  removeAuthKeys(
    window.localStorage
  );

  removeAuthKeys(
    window.sessionStorage
  );

  // ---------------------------------------------------
  // FIRST ATTEMPT
  // ---------------------------------------------------

  try {
    window.localStorage.setItem(
      "isAuthenticated",
      "true"
    );

    window.localStorage.setItem(
      "adminToken",
      tokenString
    );

    window.localStorage.setItem(
      "adminUser",
      userJson
    );

    return window.localStorage;
  } catch (firstError) {
    console.warn(
      "Admin localStorage write failed. Cleaning old site storage and retrying.",
      firstError
    );
  }

  // ---------------------------------------------------
  // SECOND ATTEMPT
  // ---------------------------------------------------
  //
  // At this point we know the authentication object is
  // very small. If this fails, the storage itself really
  // is unavailable/full.
  //
  // ---------------------------------------------------

  try {
    window.localStorage.clear();

    window.localStorage.setItem(
      "isAuthenticated",
      "true"
    );

    window.localStorage.setItem(
      "adminToken",
      tokenString
    );

    window.localStorage.setItem(
      "adminUser",
      userJson
    );

    return window.localStorage;
  } catch (secondError) {
    console.error(
      "localStorage is still unavailable:",
      secondError
    );
  }

  // ---------------------------------------------------
  // THIRD ATTEMPT
  // ---------------------------------------------------
  //
  // sessionStorage is only used as an emergency
  // fallback.
  //
  // ---------------------------------------------------

  try {
    window.sessionStorage.clear();

    window.sessionStorage.setItem(
      "isAuthenticated",
      "true"
    );

    window.sessionStorage.setItem(
      "adminToken",
      tokenString
    );

    window.sessionStorage.setItem(
      "adminUser",
      userJson
    );

    return window.sessionStorage;
  } catch (thirdError) {
    console.error(
      "sessionStorage is also unavailable:",
      thirdError
    );
  }

  // ---------------------------------------------------
  // NOTHING WORKED
  // ---------------------------------------------------

  throw new Error(
    "Login succeeded, but the browser could not store the authentication session. Please clear this site's stored data once and try again."
  );
}

// =====================================================
// ANIMATED BACKGROUND
// =====================================================

function AnimatedBackground() {
  const particles = Array.from(
    { length: 20 },
    (_, index) => ({
      id: index,

      left:
        `${(index * 37) % 100}%`,

      top:
        `${(index * 61) % 100}%`,

      size:
        2 + (index % 4),

      duration:
        4 + (index % 6),

      delay:
        index * 0.2,
    })
  );

  return (
    <div className="fixed inset-0 overflow-hidden -z-10">

      {/* Main background */}

      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(
              circle at 15% 20%,
              rgba(59,130,246,0.28),
              transparent 35%
            ),
            radial-gradient(
              circle at 85% 15%,
              rgba(168,85,247,0.20),
              transparent 30%
            ),
            radial-gradient(
              circle at 50% 80%,
              rgba(34,197,94,0.12),
              transparent 40%
            ),
            linear-gradient(
              135deg,
              #071224,
              #101D3A,
              #153B8A
            )
          `,
        }}
      />

      {/* Grid */}

      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(
              rgba(255,255,255,0.08) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255,255,255,0.08) 1px,
              transparent 1px
            )
          `,
          backgroundSize:
            "60px 60px",
        }}
      />

      {/* Glow */}

      <div
        className="
          absolute
          top-20
          left-24
          w-72
          h-72
          rounded-full
          bg-cyan-500/20
          blur-[120px]
          animate-pulse
        "
      />

      <div
        className="
          absolute
          bottom-24
          right-20
          w-96
          h-96
          rounded-full
          bg-blue-600/20
          blur-[160px]
          animate-pulse
        "
      />

      <div
        className="
          absolute
          top-1/2
          left-1/2
          -translate-x-1/2
          -translate-y-1/2
          w-56
          h-56
          rounded-full
          bg-purple-500/20
          blur-[100px]
          animate-pulse
        "
      />

      {/* Floating particles */}

      {particles.map(
        (particle) => (
          <motion.span
            key={particle.id}
            className="
              absolute
              rounded-full
              bg-cyan-300/40
            "
            style={{
              left:
                particle.left,

              top:
                particle.top,

              width:
                particle.size,

              height:
                particle.size,
            }}
            animate={{
              y: [
                0,
                -20,
                0,
              ],

              opacity: [
                0.15,
                0.65,
                0.15,
              ],
            }}
            transition={{
              duration:
                particle.duration,

              repeat:
                Infinity,

              delay:
                particle.delay,

              ease:
                "easeInOut",
            }}
          />
        )
      )}
    </div>
  );
}

// =====================================================
// MAIN LOGIN COMPONENT
// =====================================================

const LoginPage = () => {
  const [
    email,
    setEmail,
  ] = useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    rememberMe,
    setRememberMe,
  ] = useState(false);

  const [
    isLoading,
    setIsLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const navigate =
    useNavigate();

  // ===================================================
  // LOGIN
  // ===================================================

  const handleSubmit =
    async (event) => {
      event.preventDefault();

      setError("");
      setIsLoading(true);

      try {
        // ------------------------------------------------
        // CLEAN EMAIL
        // ------------------------------------------------

        const submittedEmail =
          email
            .trim()
            .toLowerCase();

        // ------------------------------------------------
        // VALIDATE
        // ------------------------------------------------

        if (
          !submittedEmail ||
          !password
        ) {
          setError(
            "Please enter your email and password."
          );

          return;
        }

        // ------------------------------------------------
        // BACKEND LOGIN
        // ------------------------------------------------

        const response =
          await fetch(
            `${API_URL}/api/admin/auth/login`,
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  email:
                    submittedEmail,

                  password:
                    password,
                }),
            }
          );

        // ------------------------------------------------
        // READ RESPONSE
        // ------------------------------------------------

        let data;

        try {
          data =
            await response.json();
        } catch (
          jsonError
        ) {
          console.error(
            "Invalid server response:",
            jsonError
          );

          throw new Error(
            "Server returned an invalid response."
          );
        }

        console.log(
          "Admin login response:",
          {
            success:
              data?.success,

            message:
              data?.message,

            hasToken:
              Boolean(
                data?.token
              ),

            hasUser:
              Boolean(
                data?.user
              ),
          }
        );

        // ------------------------------------------------
        // LOGIN FAILED
        // ------------------------------------------------

        if (
          !response.ok ||
          !data?.success
        ) {
          setError(
            data?.message ||
              "Invalid email or password. Please try again."
          );

          return;
        }

        // ------------------------------------------------
        // TOKEN CHECK
        // ------------------------------------------------

        if (
          !data?.token
        ) {
          console.error(
            "Backend login succeeded but no token was returned."
          );

          setError(
            "Login failed because the server did not return an authentication token."
          );

          return;
        }

        // ------------------------------------------------
        // SAVE ONLY SMALL USER DATA
        // ------------------------------------------------
        //
        // IMPORTANT:
        //
        // We do NOT do:
        //
        // const adminUser = data.user;
        //
        // and then save data.user directly.
        //
        // createSmallAdminUser() removes large fields
        // such as profile_photo.
        //
        // ------------------------------------------------

        const authStorage =
          saveAuthentication(
            data.token,
            data.user,
            submittedEmail
          );

        // ------------------------------------------------
        // SUCCESS
        // ------------------------------------------------

        console.log(
          "Admin authentication saved successfully."
        );

        console.log(
          "Authentication storage:",
          authStorage ===
          window.localStorage
            ? "localStorage"
            : "sessionStorage"
        );

        // ------------------------------------------------
        // DASHBOARD
        // ------------------------------------------------

        navigate(
          "/admin/dashboard",
          {
            replace: true,
          }
        );

      } catch (
        err
      ) {
        console.error(
          "Admin login error:",
          err
        );

        // ------------------------------------------------
        // CONNECTION ERROR
        // ------------------------------------------------

        if (
          err?.message ===
          "Failed to fetch"
        ) {
          setError(
            "Unable to connect to the server. Please make sure the backend is running."
          );

          return;
        }

        // ------------------------------------------------
        // STORAGE ERROR
        // ------------------------------------------------

        setError(
          err?.message ||
            "Unable to login. Please try again."
        );

      } finally {
        setIsLoading(false);
      }
    };

  // ===================================================
  // UI
  // ===================================================

  return (
    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
        p-4
        relative
        overflow-hidden
      "
    >

      <AnimatedBackground />

      {/* =================================================
          DECORATIVE ICONS
      ================================================= */}

      <div
        className="
          absolute
          top-10
          left-10
          text-white/5
          hidden
          xl:block
        "
      >
        <School
          size={140}
        />
      </div>

      <div
        className="
          absolute
          bottom-10
          right-10
          text-white/5
          hidden
          xl:block
        "
      >
        <BookOpen
          size={120}
        />
      </div>

      {/* =================================================
          MAIN CARD AREA
      ================================================= */}

      <div
        className="
          w-full
          max-w-6xl
          grid
          lg:grid-cols-2
          gap-12
          items-center
          relative
          z-10
        "
      >

        {/* =================================================
            LEFT SIDE
        ================================================= */}

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
          className="
            text-white
            hidden
            lg:block
          "
        >

          {/* SCHOOL BRAND */}

          <div
            className="
              flex
              items-center
              gap-3
              mb-12
            "
          >
            <div
              className="
                w-12
                h-12
                rounded-2xl
                flex
                items-center
                justify-center
              "
              style={{
                background:
                  colors.glass,
              }}
            >
              <School
                size={28}
                className="text-white"
              />
            </div>

            <span
              className="
                text-xl
                font-bold
                tracking-wide
              "
            >
              Red Rose School
            </span>
          </div>

          {/* SCHOOL ICON */}

          <div
            className="
              flex
              justify-center
              mb-10
            "
          >
            <div
              className="
                w-24
                h-24
                rounded-full
                bg-white/10
                flex
                items-center
                justify-center
                backdrop-blur-sm
                border
                border-white/10
                shadow-2xl
              "
            >
              <School
                className="
                  w-14
                  h-14
                  text-cyan-400
                "
              />
            </div>
          </div>

          {/* TITLE */}

          <h1
            className="
              text-4xl
              md:text-5xl
              font-bold
              mb-3
              leading-tight
            "
          >
            School Management
            <br />
            System
          </h1>

          <p
            className="
              text-white/60
              max-w-md
              leading-relaxed
            "
          >
            Manage students, teachers,
            admissions, academics,
            notices and all your
            school's administrative
            operations from one secure
            platform.
          </p>

          {/* FEATURES */}

          <div
            className="
              mt-8
              space-y-4
            "
          >

            <div
              className="
                flex
                items-center
                gap-3
                text-white/70
              "
            >
              <CheckCircle
                size={18}
                className="text-cyan-400"
              />

              <span>
                Secure administrator
                access
              </span>
            </div>

            <div
              className="
                flex
                items-center
                gap-3
                text-white/70
              "
            >
              <CheckCircle
                size={18}
                className="text-cyan-400"
              />

              <span>
                Complete school
                management
              </span>
            </div>

            <div
              className="
                flex
                items-center
                gap-3
                text-white/70
              "
            >
              <CheckCircle
                size={18}
                className="text-cyan-400"
              />

              <span>
                Centralized admin
                dashboard
              </span>
            </div>

          </div>
        </motion.div>

        {/* =================================================
            RIGHT SIDE LOGIN
        ================================================= */}

        <motion.div
          initial={{
            opacity: 0,
            x: 30,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.7,
          }}
          className="
            w-full
            max-w-md
            mx-auto
          "
        >

          <div
            className="
              rounded-3xl
              p-8
              sm:p-10
              border
              border-white/10
              shadow-2xl
              backdrop-blur-xl
            "
            style={{
              background:
                "linear-gradient(145deg, rgba(45,67,111,0.86), rgba(32,50,92,0.92))",

              boxShadow:
                "0 30px 80px rgba(0,0,0,0.35)",
            }}
          >

            {/* =================================================
                ICON
            ================================================= */}

            <div
              className="
                flex
                justify-center
                mb-5
              "
            >
              <div
                className="
                  w-14
                  h-14
                  rounded-2xl
                  flex
                  items-center
                  justify-center
                  shadow-lg
                "
                style={{
                  background:
                    "linear-gradient(135deg, #2563EB, #38BDF8)",
                }}
              >
                <School
                  size={30}
                  className="text-white"
                />
              </div>
            </div>

            {/* =================================================
                TITLE
            ================================================= */}

            <div
              className="
                text-center
                mb-7
              "
            >
              <h2
                className="
                  text-3xl
                  font-bold
                  text-white
                "
              >
                Welcome Back
              </h2>

              <p
                className="
                  mt-2
                  text-sm
                  text-white/60
                "
              >
                Welcome to the School
                Management Portal
              </p>
            </div>

            {/* =================================================
                ERROR
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
                  className="
                    mb-5
                    p-3
                    rounded-xl
                    text-sm
                  "
                  style={{
                    background:
                      "rgba(239,68,68,0.15)",

                    color:
                      "#EF4444",

                    border:
                      "1px solid rgba(239,68,68,0.22)",
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
              onSubmit={
                handleSubmit
              }
              className="
                space-y-5
              "
            >

              {/* =================================================
                  EMAIL
              ================================================= */}

              <div>

                <label
                  className="
                    block
                    text-sm
                    font-medium
                    text-white/70
                    mb-2
                  "
                >
                  Email Address
                </label>

                <div
                  className="
                    flex
                    items-center
                    gap-3
                    px-4
                    py-3
                    rounded-xl
                    transition-all
                    duration-200
                    focus-within:ring-2
                  "
                  style={{
                    background:
                      colors.glass,

                    border:
                      "1px solid rgba(255,255,255,0.06)",
                  }}
                >

                  <Mail
                    size={18}
                    className="
                      text-white/40
                      flex-shrink-0
                    "
                  />

                  <input
                    type="email"
                    value={
                      email
                    }
                    onChange={(
                      event
                    ) =>
                      setEmail(
                        event.target.value
                      )
                    }
                    placeholder="Enter admin email"
                    className="
                      w-full
                      bg-transparent
                      outline-none
                      text-white
                      placeholder-white/30
                      text-sm
                    "
                    required
                    autoComplete="email"
                  />

                </div>

              </div>

              {/* =================================================
                  PASSWORD
              ================================================= */}

              <div>

                <label
                  className="
                    block
                    text-sm
                    font-medium
                    text-white/70
                    mb-2
                  "
                >
                  Password
                </label>

                <div
                  className="
                    flex
                    items-center
                    gap-3
                    px-4
                    py-3
                    rounded-xl
                    transition-all
                    duration-200
                    focus-within:ring-2
                  "
                  style={{
                    background:
                      colors.glass,

                    border:
                      "1px solid rgba(255,255,255,0.06)",
                  }}
                >

                  <Lock
                    size={18}
                    className="
                      text-white/40
                      flex-shrink-0
                    "
                  />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={
                      password
                    }
                    onChange={(
                      event
                    ) =>
                      setPassword(
                        event.target.value
                      )
                    }
                    placeholder="••••••••"
                    className="
                      w-full
                      bg-transparent
                      outline-none
                      text-white
                      placeholder-white/30
                      text-sm
                    "
                    required
                    autoComplete="current-password"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (
                          previous
                        ) =>
                          !previous
                      )
                    }
                    className="
                      text-white/40
                      hover:text-white/70
                      transition-colors
                    "
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff
                        size={18}
                      />
                    ) : (
                      <Eye
                        size={18}
                      />
                    )}
                  </button>

                </div>

              </div>

              {/* =================================================
                  REMEMBER ME + FORGOT PASSWORD
              ================================================= */}

              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-4
                "
              >

                <label
                  className="
                    flex
                    items-center
                    gap-2
                    cursor-pointer
                    group
                  "
                >

                  <div
                    className="
                      w-4
                      h-4
                      rounded
                      flex
                      items-center
                      justify-center
                      transition-all
                      duration-200
                    "
                    style={{
                      background:
                        rememberMe
                          ? colors.primary
                          : colors.glass,

                      border:
                        `1px solid ${
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
                    checked={
                      rememberMe
                    }
                    onChange={(
                      event
                    ) =>
                      setRememberMe(
                        event.target
                          .checked
                      )
                    }
                    className="hidden"
                  />

                  <span
                    className="
                      text-sm
                      text-white/60
                      group-hover:text-white/80
                      transition-colors
                    "
                  >
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
                  className="
                    text-sm
                    font-medium
                    text-blue-400
                    hover:text-blue-300
                    hover:underline
                    transition-all
                    duration-200
                    cursor-pointer
                  "
                >
                  Forgot Password?
                </button>

              </div>

              {/* =================================================
                  LOGIN BUTTON
              ================================================= */}

              <motion.button
                type="submit"
                disabled={
                  isLoading
                }
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
                className="
                  w-full
                  py-3.5
                  rounded-xl
                  font-semibold
                  text-white
                  flex
                  items-center
                  justify-center
                  gap-2
                  transition-all
                  duration-300
                  group
                  relative
                  overflow-hidden
                  disabled:opacity-60
                  disabled:cursor-not-allowed
                "
                style={{
                  background:
                    "linear-gradient(135deg, #2563EB, #38BDF8)",

                  boxShadow:
                    "0 8px 30px rgba(37,99,235,0.3)",
                }}
              >

                <span
                  className="
                    relative
                    z-10
                    flex
                    items-center
                    gap-2
                  "
                >

                  {isLoading ? (
                    <>
                      <div
                        className="
                          w-5
                          h-5
                          border-2
                          border-white/30
                          border-t-white
                          rounded-full
                          animate-spin
                        "
                      />

                      Signing In...
                    </>
                  ) : (
                    <>
                      Sign In

                      <motion.span
                        animate={{
                          x: [
                            0,
                            4,
                            0,
                          ],
                        }}
                        transition={{
                          duration:
                            1.5,

                          repeat:
                            Infinity,
                        }}
                      >
                        <ArrowRight
                          size={18}
                        />
                      </motion.span>
                    </>
                  )}

                </span>

                <div
                  className="
                    absolute
                    inset-0
                    opacity-0
                    group-hover:opacity-100
                    transition-opacity
                    duration-300
                  "
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

            <div
              className="
                mt-8
                text-center
                text-xs
                text-white/40
              "
            >
              © 2026 Red Rose School.
              All Rights Reserved.
            </div>

          </div>

        </motion.div>

      </div>

    </div>
  );
};

export default LoginPage;