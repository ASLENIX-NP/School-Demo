import defaultSchoolLogo from "../../assets/school-logo.jpeg";
import { useState, useEffect } from "react";
import api from "../../lib/api";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, Camera, Menu, Pencil, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

/* ============================================================
   RED ROSE SCHOOL — NAVBAR
   Same "Ledger" identity as the rest of the site: deep ink,
   brass gold + rose, Fraunces for the school name, Space
   Grotesk for the small tracked subtitle. Keep `theme` in sync
   with About.jsx / Hero.jsx / Stats.jsx / Footer.jsx if this
   ever gets centralized into a shared file.
============================================================ */

export const defaultNavbarContent = {
  logoUrl: "",
  schoolName: "Red Rose",
  schoolSubtitle: "Secondary English School",
  admissionButtonText: "Admission Open",
  admissionButtonLink: "/admissions",
  showAdmissionButton: true,
  links: [
    { id: "home", label: "Home", href: "/", visible: true },
    { id: "about", label: "About", href: "/about", visible: true },
    { id: "academics", label: "Academics", href: "/academics", visible: true },
    { id: "notices", label: "Notices", href: "/notices", visible: true },
    { id: "calendar", label: "Calendar", href: "/calendar", visible: true },
    { id: "blogs", label: "Blog", href: "/blogs", visible: true },
    { id: "facilities", label: "Facilities", href: "/facilities", visible: true },
    { id: "staff", label: "Staff", href: "/staff", visible: true },
    { id: "gallery", label: "Gallery", href: "/gallery", visible: true },
    { id: "contact", label: "Contact", href: "/contact", visible: true },
  ],
};

const theme = {
  ink: "#1E1420",
  inkSoft: "#2D1C2A",
  card: "#FBF7EE",
  rose: "#9C2748",
  roseBright: "#C6486B",
  gold: "#B98A42",
  goldSoft: "#E7CE9C",
  gradGold: "linear-gradient(135deg, #E7CE9C 0%, #B98A42 100%)",
};

export function mergeNavbarContent(saved = {}) {
  const savedLinks = Array.isArray(saved.links) ? saved.links : [];

  return {
    ...defaultNavbarContent,
    ...saved,
    links: defaultNavbarContent.links.map((defaultLink) => {
      const savedLink = savedLinks.find((link) => link.id === defaultLink.id);

      return {
        ...defaultLink,
        ...(savedLink || {}),
        visible: savedLink?.visible !== false,
      };
    }),
  };
}

/* =========================================================
   SCOPED STYLES
========================================================= */

function LedgerStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600;0,9..144,700&family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');

      .rr-nav { font-family: 'Inter', system-ui, -apple-system, sans-serif; }
      .rr-nav-serif { font-family: 'Fraunces', Georgia, serif; }
      .rr-nav-mono { font-family: 'Space Grotesk', 'IBM Plex Mono', monospace; }

      .rr-nav a:focus-visible,
      .rr-nav button:focus-visible {
        outline: 2px solid ${theme.gold};
        outline-offset: 3px;
        border-radius: 6px;
      }

      @media (prefers-reduced-motion: reduce) {
        .rr-nav *, .rr-nav *::before, .rr-nav *::after {
          animation-duration: 0.001ms !important;
          transition-duration: 0.001ms !important;
        }
      }
    `}</style>
  );
}

function HoverEditIcon({ icon: Icon = Pencil, label = "Edit" }) {
  return (
    <span
      className="pointer-events-none absolute -top-3 -right-3 z-[90] opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 rounded-full w-8 h-8 flex items-center justify-center shadow-xl"
      style={{
        background: theme.gradGold,
        color: theme.ink,
        border: "2px solid rgba(255,255,255,0.85)",
      }}
      title={label}
    >
      <Icon className="w-4 h-4" />
    </span>
  );
}

export function Navbar({
  editMode = false,
  contentOverride = null,
  onEditTarget = () => { },
}) {
  const [navbarContent, setNavbarContent] = useState(
    mergeNavbarContent(contentOverride || defaultNavbarContent)
  );
  const [scrolled, setScrolled] = useState(editMode);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (contentOverride) {
      setNavbarContent(mergeNavbarContent(contentOverride));
      return;
    }

    const loadNavbarContent = async () => {
      try {
        const res = await api.get(
          "/api/site-content/navbar"
        );

        const savedContent = res.data?.data?.content || {};
        setNavbarContent(mergeNavbarContent(savedContent));
      } catch (error) {
        console.error("Navbar content load error:", error);
      }
    };

    loadNavbarContent();
  }, [contentOverride]);

  useEffect(() => {
    if (editMode) {
      setScrolled(true);
      return;
    }

    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, [editMode]);

  const isActive = (href) => {
    if (editMode) return false;
    if (href === "/") return location.pathname === "/";
    return location.pathname === href;
  };

  const selectEditTarget = (event, target) => {
    if (!editMode) return;

    event.preventDefault();
    event.stopPropagation();
    onEditTarget(target);
  };

  const visibleLinks = navbarContent.links.filter((link) => link.visible);
  const logoSrc = navbarContent.logoUrl || defaultSchoolLogo;

  return (
    <div className="rr-nav">
      <LedgerStyles />

      <motion.header
        initial={editMode ? false : { y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={editMode ? "relative z-50 w-full" : "fixed top-0 left-0 right-0 z-50 w-full"}
        style={{
          background: scrolled
            ? `linear-gradient(180deg, ${theme.ink}F7 0%, ${theme.ink}F0 100%)`
            : `linear-gradient(180deg, ${theme.ink}D0 0%, ${theme.ink}80 100%)`,
          borderBottom: `1px solid rgba(185,138,66,${scrolled ? 0.32 : 0.14})`,
          backdropFilter: "blur(16px)",
        }}
      >
        <nav className="max-w-[1600px] w-full mx-auto h-[70px] md:h-[80px] px-5 md:px-9 lg:px-11 flex items-center justify-between">
          <Link
            to="/"
            onClick={(e) => {
              if (editMode) {
                e.preventDefault();
                return;
              }

              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
            className="flex items-center gap-4 group flex-shrink-0"
          >
            <div
              onClick={(e) => selectEditTarget(e, { type: "logo" })}
              className={
                editMode
                  ? "relative group cursor-pointer rounded-xl"
                  : "relative rounded-xl"
              }
              title={editMode ? "Change logo image" : ""}
            >
              <div
                className="rounded-xl overflow-hidden bg-white"
                style={{
                  width: "46px",
                  height: "46px",
                  border: `1.5px solid ${theme.gold}`,
                  boxShadow: `0 0 0 3px ${theme.gold}1F`,
                }}
              >
                <img
                  src={logoSrc}
                  alt="School Logo"
                  className="w-full h-full object-contain"
                />
              </div>

              {editMode && <HoverEditIcon icon={Camera} label="Change Logo" />}
            </div>

            <div className="hidden sm:block">
              <div
                onClick={(e) => selectEditTarget(e, { type: "schoolName" })}
                className={
                  editMode
                    ? "relative group cursor-pointer rounded-lg px-1"
                    : "relative"
                }
                title={editMode ? "Edit school name" : ""}
              >
                <div
                  className="rr-nav-serif font-semibold text-lg leading-tight"
                  style={{
                    color: "#FFFFFF",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {navbarContent.schoolName}
                </div>

                {editMode && <HoverEditIcon icon={Pencil} label="Edit Name" />}
              </div>

              <div
                onClick={(e) => selectEditTarget(e, { type: "schoolSubtitle" })}
                className={
                  editMode
                    ? "relative group cursor-pointer rounded-lg px-1"
                    : "relative"
                }
                title={editMode ? "Edit school subtitle" : ""}
              >
                <div
                  className="rr-nav-mono text-[10px] font-semibold uppercase tracking-[0.16em] leading-tight"
                  style={{ color: theme.goldSoft }}
                >
                  {navbarContent.schoolSubtitle}
                </div>

                {editMode && (
                  <HoverEditIcon icon={Pencil} label="Edit Subtitle" />
                )}
              </div>
            </div>
          </Link>

          <div className="hidden xl:flex items-center gap-3.5">
            {visibleLinks.map((link) => {
              const active = isActive(link.href);

              return (
                <Link
                  key={link.id}
                  to={link.href || "/"}
                  onClick={(e) => {
                    if (editMode) {
                      selectEditTarget(e, { type: "link", id: link.id });
                    }
                  }}
                  className={
                    editMode
                      ? "group relative px-3.5 py-2 text-sm font-medium transition-colors duration-300 cursor-pointer"
                      : "group relative px-3.5 py-2 text-sm font-medium transition-colors duration-300"
                  }
                  title={editMode ? `Edit ${link.label}` : ""}
                  style={{
                    color: active ? theme.goldSoft : "rgba(245,238,226,0.75)",
                  }}
                >
                  {link.label}
                  <span
                    className={`absolute left-4 right-4 -bottom-0.5 h-[2px] origin-left transition-transform duration-300 ${active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                      }`}
                    style={{ background: theme.rose }}
                  />
                  {editMode && <HoverEditIcon icon={Pencil} label="Edit Link" />}
                </Link>
              );
            })}
          </div>

          {navbarContent.showAdmissionButton && (
            <div className="hidden xl:flex items-center gap-3 flex-shrink-0">
              <Link
                to={navbarContent.admissionButtonLink || "/admissions"}
                onClick={(e) => {
                  if (editMode) {
                    selectEditTarget(e, { type: "admission" });
                  }
                }}
                className="group relative inline-flex items-center gap-2 px-5.5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  color: theme.ink,
                  background: theme.gradGold,
                  boxShadow: `0 10px 26px ${theme.gold}45`,
                }}
              >
                {navbarContent.admissionButtonText || "Admission Open"}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />

                {editMode && <HoverEditIcon icon={Pencil} label="Edit Button" />}
              </Link>
            </div>
          )}

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="xl:hidden p-2 rounded-lg transition-colors"
            style={{
              color: "#FFFFFF",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
            aria-label="Toggle navigation menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className={
              editMode
                ? "absolute top-[70px] left-0 right-0 z-40 xl:hidden"
                : "fixed top-[70px] left-0 right-0 z-40 xl:hidden"
            }
            style={{
              background: `linear-gradient(180deg, ${theme.ink}FA 0%, ${theme.ink}F5 100%)`,
              borderBottom: `1px solid rgba(185,138,66,0.25)`,
              backdropFilter: "blur(16px)",
            }}
          >
            <div className="max-w-[1700px] w-full mx-auto p-4 md:px-6 grid gap-1">
              {visibleLinks.map((link) => {
                const active = isActive(link.href);

                return (
                  <Link
                    key={link.id}
                    to={link.href || "/"}
                    onClick={(e) => {
                      if (editMode) {
                        selectEditTarget(e, { type: "link", id: link.id });
                      } else {
                        setOpen(false);
                      }
                    }}
                    className="px-4 py-3 rounded-lg text-sm font-medium transition-all border-l-2"
                    style={{
                      color: active ? theme.goldSoft : "rgba(245,238,226,0.8)",
                      background: active ? `${theme.rose}18` : "transparent",
                      borderColor: active ? theme.rose : "transparent",
                    }}
                  >
                    {link.label}
                  </Link>
                );
              })}

              {navbarContent.showAdmissionButton && (
                <Link
                  to={navbarContent.admissionButtonLink || "/admissions"}
                  onClick={(e) => {
                    if (editMode) {
                      selectEditTarget(e, { type: "admission" });
                    } else {
                      setOpen(false);
                      window.dispatchEvent(new CustomEvent("open-admission-inquiry"));
                    }
                  }}
                  className="mt-3 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-bold text-center transition-all hover:scale-105 hover:-translate-y-0.5 active:scale-95"
                  style={{
                    color: theme.ink,
                    background: theme.gradGold,
                    boxShadow: `0 10px 24px ${theme.gold}45`,
                  }}
                >
                  {navbarContent.admissionButtonText || "Admission Open"}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Navbar;