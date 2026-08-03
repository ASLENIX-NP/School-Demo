import defaultSchoolLogo from "../../assets/school-logo.jpeg";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, Camera, Menu, Pencil, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const defaultNavbarContent = {
  logoUrl: "",
  schoolName: "Smriti",
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

// Shared identity palette — same navy / forest-green / gold family used
// across the Hero and homepage sections, so the whole site reads as one place.
const palette = {
  navy: "#0A1628",
  primary: "#1E3A5F",
  secondary: "#2D6A4F",
  gold: "#C9A84C",
  goldLight: "#E8D5A3",
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

function HoverEditIcon({ icon: Icon = Pencil, label = "Edit" }) {
  return (
    <span
      className="pointer-events-none absolute -top-3 -right-3 z-[90] opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 rounded-full w-8 h-8 flex items-center justify-center shadow-xl"
      style={{
        background: palette.gold,
        color: palette.navy,
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
  onEditTarget = () => {},
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
        const res = await axios.get(
          "https://school-website-backend-ixx2.onrender.com/api/site-content/navbar"
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

  const quickLinks = ["home", "academics", "notices"]
    .map((id) => navbarContent.links.find((link) => link.id === id))
    .filter(Boolean)
    .filter((link) => link.visible !== false);

  return (
    <>
      <motion.header
        initial={editMode ? false : { y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={editMode ? "relative z-50 w-full" : "fixed top-0 left-0 right-0 z-50 w-full"}
        style={{
          background: scrolled
            ? "linear-gradient(180deg, rgba(10,22,40,0.97) 0%, rgba(10,22,40,0.94) 100%)"
            : "linear-gradient(180deg, rgba(10,22,40,0.82) 0%, rgba(10,22,40,0.5) 100%)",
          borderBottom: `1px solid rgba(201,168,76,${scrolled ? 0.32 : 0.14})`,
          backdropFilter: "blur(16px)",
        }}
      >
        <nav className="max-w-[1400px] mx-auto h-[70px] md:h-[80px] px-5 md:px-8 flex items-center justify-between">
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
            className="flex items-center gap-3 group flex-shrink-0"
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
                className="rounded-xl bg-[#0A1628] text-amber-400 font-extrabold text-base flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-md"
                style={{
                  width: "42px",
                  height: "42px",
                  border: `1.5px solid ${palette.gold}`,
                  boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
                  fontFamily: "var(--font-display)",
                }}
              >
                SB
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
                  className="font-bold text-lg leading-tight"
                  style={{
                    color: "#FFFFFF",
                    fontFamily: "var(--font-display)",
                    letterSpacing: "-0.02em",
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
                  className="text-[11px] font-medium tracking-wide leading-tight"
                  style={{ color: palette.goldLight }}
                >
                  {navbarContent.schoolSubtitle}
                </div>

                {editMode && (
                  <HoverEditIcon icon={Pencil} label="Edit Subtitle" />
                )}
              </div>
            </div>
          </Link>

          <div className="hidden xl:flex items-center gap-0.5">
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
                    color: active ? palette.goldLight : "rgba(255,255,255,0.78)",
                  }}
                >
                  {link.label}
                  <span
                    className={`absolute left-3.5 right-3.5 -bottom-0.5 h-[2px] origin-left transition-transform duration-300 ${
                      active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                    style={{ background: palette.gold }}
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
                className={
                  editMode
                    ? "group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
                    : "group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5"
                }
                title={editMode ? "Edit admission button" : ""}
                style={{
                  color: palette.navy,
                  background: `linear-gradient(135deg, ${palette.gold} 0%, ${palette.goldLight} 100%)`,
                  boxShadow: "0 10px 26px rgba(201,168,76,0.32)",
                }}
              >
                {navbarContent.admissionButtonText}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />

                {editMode && <HoverEditIcon icon={Pencil} label="Edit Button" />}
              </Link>
            </div>
          )}

          <div className="xl:hidden flex items-center gap-1.5 ml-auto mr-2">
            {quickLinks.map((link) => (
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
                className="px-2.5 py-2 rounded-lg text-[11px] font-semibold leading-none transition-all"
                style={{
                  color: isActive(link.href) ? palette.navy : "rgba(255,255,255,0.85)",
                  background: isActive(link.href) ? palette.gold : "rgba(255,255,255,0.06)",
                  border: `1px solid ${isActive(link.href) ? palette.gold : "rgba(255,255,255,0.12)"}`,
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

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
              background: "linear-gradient(180deg, rgba(10,22,40,0.98) 0%, rgba(10,22,40,0.96) 100%)",
              borderBottom: `1px solid rgba(201,168,76,0.25)`,
              backdropFilter: "blur(16px)",
            }}
          >
            <div className="max-w-[1400px] mx-auto p-4 grid gap-1">
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
                      color: active ? palette.goldLight : "rgba(255,255,255,0.82)",
                      background: active ? "rgba(201,168,76,0.08)" : "transparent",
                      borderColor: active ? palette.gold : "transparent",
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
                    }
                  }}
                  className="mt-3 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-center"
                  style={{
                    color: palette.navy,
                    background: `linear-gradient(135deg, ${palette.gold} 0%, ${palette.goldLight} 100%)`,
                    boxShadow: "0 10px 24px rgba(201,168,76,0.28)",
                  }}
                >
                  {navbarContent.admissionButtonText}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;