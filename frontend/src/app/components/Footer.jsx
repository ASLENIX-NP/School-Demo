import { useEffect, useState } from "react";
import api from "../../lib/api";
import { Link } from "react-router-dom";
import {
    Check,
    Globe,
    Mail,
    Phone,
    MapPin,
    School,
    Pencil,
    UploadCloud,
  } from "lucide-react";
  
import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaLinkedin,
  FaXTwitter,
  FaTiktok,
  FaWhatsapp,
  FaTelegram,
  FaGithub,
  FaDiscord,
  FaThreads,
  FaPinterest,
  FaReddit,
  FaSnapchat,
} from "react-icons/fa6";

// Shared identity palette — same navy / forest-green / gold family used
// across the Hero and homepage sections, so the footer reads as part of
// the same site rather than a bolted-on dark-mode panel.
const palette = {
  navy: "#0A1628",
  primary: "#1E3A5F",
  secondary: "#2D6A4F",
  gold: "#C9A84C",
  goldLight: "#E8D5A3",
  crimson: "#8B0000",
};

export const defaultFooterContent = {
  logoUrl: "",
  schoolName: "Red Rose",
  schoolSubtitle: "Secondary English Boarding School",
  admissionBadgeText: "Admissions Open 2026",
  showAdmissionBadge: true,

  navLinks: [
    { id: 1, label: "About", href: "/about", visible: true },
    { id: 2, label: "Academics", href: "/academics", visible: true },
    { id: 3, label: "Facilities", href: "/facilities", visible: true },
    { id: 4, label: "Gallery", href: "/gallery", visible: true },
    { id: 5, label: "Contact", href: "/contact", visible: true },
  ],

  socials: [
    {
      id: 1,
      type: "facebook",
      href: "https://www.facebook.com/Red Roseesschool",
      label: "Facebook",
      visible: true,
    },
    {
      id: 2,
      type: "website",
      href: "https://Red Rose.edu.np/",
      label: "Website",
      visible: true,
    },
    {
      id: 3,
      type: "youtube",
      href: "https://www.youtube.com/@Red RoseEngSecondarySchool",
      label: "YouTube",
      visible: true,
    },
  ],

  contact: {
    address: "Basudev Marga, Hetauda-2, Makawanpur, Nepal",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Red Rose+English+Secondary+School+Hetauda",
    phones: ["057-590144", "057-590145", "057-590146"],
    email: "infobjess2046@gmail.com",
  },

  modalTitle: "Contact Red Rose School",
  modalHint: "Click any number to copy it.",
  copiedText: "Copied",
  closeButtonText: "Close",

  copyrightText:
    "© 2026 Red Rose Secondary English Boarding School. All rights reserved.",
};

export function mergeFooterContent(saved = {}) {
  return {
    ...defaultFooterContent,
    ...saved,
    navLinks: Array.isArray(saved.navLinks)
      ? saved.navLinks
      : defaultFooterContent.navLinks,
    socials: Array.isArray(saved.socials)
      ? saved.socials
      : defaultFooterContent.socials,
    contact: {
      ...defaultFooterContent.contact,
      ...(saved.contact || {}),
      phones: Array.isArray(saved.contact?.phones)
        ? saved.contact.phones
        : defaultFooterContent.contact.phones,
    },
  };
}

export function normalizeExternalUrl(value = "") {
  const cleanValue = String(value || "").trim();

  if (!cleanValue) return "#";
  if (cleanValue.startsWith("mailto:") || cleanValue.startsWith("tel:")) return cleanValue;
  if (cleanValue.startsWith("http://") || cleanValue.startsWith("https://")) return cleanValue;
  if (cleanValue.startsWith("/")) return cleanValue;
  if (cleanValue.startsWith("#")) return cleanValue;

  return `https://${cleanValue}`;
}

export function normalizeMapUrl(value = "", fallbackAddress = "") {
  const cleanValue = String(value || "").trim();
  const cleanAddress = String(fallbackAddress || "").trim();

  if (!cleanValue && cleanAddress) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cleanAddress)}`;
  }

  if (!cleanValue) return "#";
  if (cleanValue.startsWith("http://") || cleanValue.startsWith("https://")) return cleanValue;

  if (
    cleanValue.startsWith("www.") ||
    cleanValue.startsWith("maps.app.goo.gl") ||
    cleanValue.startsWith("goo.gl") ||
    cleanValue.startsWith("google.com")
  ) {
    return `https://${cleanValue}`;
  }

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cleanValue)}`;
}

export function getSocialIcon(socialOrType) {
  let type = "";
  let label = "";
  let href = "";

  if (typeof socialOrType === "string") {
    type = socialOrType.toLowerCase().trim();
  } else if (socialOrType && typeof socialOrType === "object") {
    type = (socialOrType.type || "").toLowerCase().trim();
    label = (socialOrType.label || "").toLowerCase().trim();
    href = (socialOrType.href || "").toLowerCase().trim();
  }

  // 1. Direct type matching
  if (type === "facebook" || type === "fb") return FaFacebook;
  if (type === "instagram" || type === "insta") return FaInstagram;
  if (type === "youtube" || type === "yt") return FaYoutube;
  if (type === "linkedin" || type === "linkdin") return FaLinkedin;
  if (type === "twitter" || type === "x" || type === "twitter_x") return FaXTwitter;
  if (type === "tiktok") return FaTiktok;
  if (type === "whatsapp") return FaWhatsapp;
  if (type === "telegram") return FaTelegram;
  if (type === "github") return FaGithub;
  if (type === "discord") return FaDiscord;
  if (type === "threads") return FaThreads;
  if (type === "pinterest") return FaPinterest;
  if (type === "reddit") return FaReddit;
  if (type === "snapchat") return FaSnapchat;

  // 2. Fallback to label keyword matching
  if (label.includes("facebook") || label.includes("fb")) return FaFacebook;
  if (label.includes("instagram") || label.includes("insta")) return FaInstagram;
  if (label.includes("youtube") || label.includes("yt")) return FaYoutube;
  if (label.includes("linkedin") || label.includes("linkdin")) return FaLinkedin;
  if (label.includes("twitter") || label === "x" || label.includes("x (twitter)")) return FaXTwitter;
  if (label.includes("tiktok")) return FaTiktok;
  if (label.includes("whatsapp")) return FaWhatsapp;
  if (label.includes("telegram")) return FaTelegram;
  if (label.includes("github")) return FaGithub;
  if (label.includes("discord")) return FaDiscord;
  if (label.includes("threads")) return FaThreads;
  if (label.includes("pinterest")) return FaPinterest;
  if (label.includes("reddit")) return FaReddit;
  if (label.includes("snapchat")) return FaSnapchat;

  // 3. Fallback to href / URL matching
  if (href.includes("facebook.com") || href.includes("fb.me") || href.includes("fb.com")) return FaFacebook;
  if (href.includes("instagram.com")) return FaInstagram;
  if (href.includes("youtube.com") || href.includes("youtu.be")) return FaYoutube;
  if (href.includes("linkedin.com")) return FaLinkedin;
  if (href.includes("twitter.com") || href.includes("x.com")) return FaXTwitter;
  if (href.includes("tiktok.com")) return FaTiktok;
  if (href.includes("whatsapp.com") || href.includes("wa.me")) return FaWhatsapp;
  if (href.includes("telegram.me") || href.includes("t.me") || href.includes("telegram.org")) return FaTelegram;
  if (href.includes("github.com")) return FaGithub;
  if (href.includes("discord.com") || href.includes("discord.gg")) return FaDiscord;
  if (href.includes("threads.net")) return FaThreads;
  if (href.includes("pinterest.com")) return FaPinterest;
  if (href.includes("reddit.com")) return FaReddit;
  if (href.includes("snapchat.com")) return FaSnapchat;

  return Globe;
}

function stopEditNavigation(event, editMode) {
  if (!editMode) return;
  event.preventDefault();
  event.stopPropagation();
}

function AdminPillButton({ icon: Icon, label, onClick, tone = "edit" }) {
  const toneStyles = {
    edit: {
      background: palette.gold,
      color: palette.navy,
    },
    add: {
      background: palette.secondary,
      color: "#FFFFFF",
    },
    delete: {
      background: palette.crimson,
      color: "#FFFFFF",
    },
    dark: {
      background: palette.navy,
      color: "#FFFFFF",
    },
  };

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onClick?.();
      }}
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[11px] font-bold shadow-lg transition-all hover:-translate-y-0.5"
      style={{
        ...(toneStyles[tone] || toneStyles.edit),
        border: "1px solid rgba(255,255,255,0.3)",
      }}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </button>
  );
}

function EditToolbar({ children, position = "top-right" }) {
  const positionClass =
    position === "top-left"
      ? "left-0 top-0 -translate-y-1/2"
      : position === "bottom-right"
      ? "right-0 bottom-0 translate-y-1/2"
      : "right-0 top-0 -translate-y-1/2";

  return (
    <div
      className={`absolute ${positionClass} z-[80] opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-200 flex flex-wrap gap-2`}
    >
      {children}
    </div>
  );
}

function FooterLabel({ children }) {
  return (
    <span
      className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.18em] uppercase mb-5"
      style={{ color: palette.goldLight }}
    >
      <span className="w-4 h-px" style={{ background: palette.gold }} />
      {children}
    </span>
  );
}

export function Footer({
  editMode = false,
  contentOverride = null,
  onEditTarget = () => {},
  onAddTarget = () => {},
  onDeleteTarget = () => {},
}) {
  const [content, setContent] = useState(
    mergeFooterContent(contentOverride || defaultFooterContent)
  );
  const [showContactModal, setShowContactModal] = useState(false);
  const [copied, setCopied] = useState("");

  const isMobile =
    typeof navigator !== "undefined" &&
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  useEffect(() => {
    if (contentOverride) {
      setContent(mergeFooterContent(contentOverride));
      return;
    }

    const loadFooterContent = async () => {
      try {
        const res = await api.get(
          "/api/site-content/footer",
          {
            timeout: 12000,
          }
        );
        const savedContent = res.data?.data?.content || {};
        setContent(mergeFooterContent(savedContent));
      } catch (error) {
        console.error("Footer content load error:", error);
        setContent(defaultFooterContent);
      }
    };

    loadFooterContent();
  }, [contentOverride]);

  const copyPhone = async (phone) => {
    try {
      await navigator.clipboard.writeText(phone);
      setCopied(phone);

      setTimeout(() => {
        setCopied("");
      }, 2000);
    } catch (error) {
      console.error("Phone copy failed:", error);
    }
  };

  const visibleLinks = content.navLinks.filter((link) => link.visible !== false);
  const visibleSocials = content.socials.filter(
    (social) => social.visible !== false
  );

  const mapHref = normalizeMapUrl(content.contact.mapUrl, content.contact.address);

  return (
    <footer
      className="relative overflow-hidden"
      style={{
        background: `linear-gradient(180deg, ${palette.navy} 0%, #071120 100%)`,
        borderTop: `3px solid ${palette.gold}`,
      }}
    >
      {editMode && (
        <div
          className="relative z-[90] mx-auto max-w-[1400px] px-6 pt-5"
          onClick={(event) => event.stopPropagation()}
        >
          <div
            className="rounded-xl px-5 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: `1px solid ${palette.gold}45`,
            }}
          >
            <div>
              <div className="text-white font-bold">Admin Footer Editor Active</div>
              <div className="text-xs text-white/55 mt-1">
                Hover footer areas to open the correct editor for logo, links, socials, contact details, and copyright.
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <AdminPillButton
                icon={Pencil}
                label="School Info"
                onClick={() => onEditTarget({ type: "identity" })}
              />
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 py-14 md:py-16">
        <div className="grid lg:grid-cols-[1.3fr_1fr_1.2fr] gap-10 lg:gap-8 pb-12">
          {/* Identity column */}
          <div
            className={editMode ? "relative group rounded-2xl p-3 -m-3" : ""}
            style={editMode ? { border: `1px dashed ${palette.gold}55` } : undefined}
          >
            {editMode && (
              <EditToolbar position="top-left">
                <AdminPillButton
                  icon={UploadCloud}
                  label="Logo/Text"
                  onClick={() => onEditTarget({ type: "identity" })}
                />
              </EditToolbar>
            )}

            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-12 h-12 rounded-xl bg-white overflow-hidden flex items-center justify-center flex-shrink-0"
                style={{ border: `1px solid ${palette.gold}55` }}
              >
                {content.logoUrl ? (
                  <img
                    src={content.logoUrl}
                    alt={content.schoolName}
                    className="w-full h-full object-contain p-1"
                  />
                ) : (
                  <School className="w-6 h-6" style={{ color: palette.navy }} />
                )}
              </div>

              <div>
                <div
                  className="text-white text-lg font-bold leading-tight"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {content.schoolName}
                </div>
                <div className="text-xs" style={{ color: palette.goldLight }}>
                  {content.schoolSubtitle}
                </div>
              </div>
            </div>

            {content.showAdmissionBadge && content.admissionBadgeText && (
              <div
                className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-6"
                style={{
                  background: "rgba(201,168,76,0.1)",
                  border: `1px solid ${palette.gold}35`,
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: palette.secondary }} />
                <span className="text-[11px] font-semibold" style={{ color: palette.goldLight }}>
                  {content.admissionBadgeText}
                </span>
              </div>
            )}

            <div
              className={`flex gap-2 ${
                editMode ? "relative group/social" : ""
              }`}
            >
              {editMode && (
                <div className="absolute -top-2 left-0 z-[80] opacity-0 group-hover/social:opacity-100 transition-all duration-200">
                  <AdminPillButton
                    icon={Pencil}
                    label="Edit Social"
                    onClick={() => onEditTarget({ type: "socials" })}
                  />
                </div>
              )}

              {visibleSocials.map((social) => {
                const Icon = getSocialIcon(social);

                return (
                  <a
                    key={social.id}
                    href={normalizeExternalUrl(social.href)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    onClick={(event) => stopEditNavigation(event, editMode)}
                    className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.12)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = palette.gold;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                    }}
                  >
                    <Icon className="w-3.5 h-3.5" style={{ color: palette.goldLight }} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Navigate column */}
          <div
            className={editMode ? "relative group rounded-2xl p-3 -m-3" : ""}
          >
            {editMode && (
              <EditToolbar>
                <AdminPillButton
                  icon={Pencil}
                  label="Edit Links"
                  onClick={() => onEditTarget({ type: "navLinks" })}
                />
              </EditToolbar>
            )}

            <FooterLabel>Navigate</FooterLabel>

            <div className="flex flex-col gap-3">
              {visibleLinks.map((link) => (
                <Link
                  key={link.id}
                  to={link.href || "/"}
                  onClick={(event) => stopEditNavigation(event, editMode)}
                  className="text-sm transition-colors duration-200 w-fit"
                  style={{ color: "rgba(226,232,240,0.68)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = palette.goldLight)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(226,232,240,0.68)")}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact column */}
          <div
            className={editMode ? "relative group rounded-2xl p-3 -m-3" : ""}
          >
            {editMode && (
              <EditToolbar>
                <AdminPillButton
                  icon={Pencil}
                  label="Contact"
                  onClick={() => onEditTarget({ type: "contact" })}
                />
                <AdminPillButton
                  icon={Pencil}
                  label="Popup"
                  tone="dark"
                  onClick={() => onEditTarget({ type: "phonePopup" })}
                />
              </EditToolbar>
            )}

            <FooterLabel>Get in Touch</FooterLabel>

            <div className="flex flex-col gap-4 text-sm" style={{ color: "rgba(226,232,240,0.72)" }}>
              <a
                href={mapHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(event) => stopEditNavigation(event, editMode)}
                className="flex items-start gap-2.5 transition-colors duration-200"
                onMouseEnter={(e) => (e.currentTarget.style.color = palette.goldLight)}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(226,232,240,0.72)")}
              >
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: palette.gold }} />
                <span>{content.contact.address}</span>
              </a>

              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: palette.gold }} />

                {isMobile && !editMode ? (
                  <span className="flex flex-wrap items-center gap-x-1">
                    {content.contact.phones.map((phone, index) => (
                      <span key={`${phone}-${index}`} className="inline-flex items-center gap-1">
                        <a
                          href={`tel:${phone.replace(/[^0-9+]/g, "")}`}
                          className="transition-colors duration-200"
                          onMouseEnter={(e) => (e.currentTarget.style.color = palette.goldLight)}
                          onMouseLeave={(e) => (e.currentTarget.style.color = "inherit")}
                        >
                          {phone}
                        </a>
                        {index < content.contact.phones.length - 1 && <span>,</span>}
                      </span>
                    ))}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowContactModal(true)}
                    className="text-left transition-colors duration-200"
                    onMouseEnter={(e) => (e.currentTarget.style.color = palette.goldLight)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "inherit")}
                  >
                    {content.contact.phones.join(", ")}
                  </button>
                )}
              </div>

              <a
                href={`mailto:${content.contact.email}`}
                onClick={(event) => stopEditNavigation(event, editMode)}
                className="flex items-center gap-2.5 break-all transition-colors duration-200"
                onMouseEnter={(e) => (e.currentTarget.style.color = palette.goldLight)}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(226,232,240,0.72)")}
              >
                <Mail className="w-4 h-4 flex-shrink-0" style={{ color: palette.gold }} />
                {content.contact.email}
              </a>
            </div>
          </div>
        </div>

        <div
          className={`pt-7 text-xs text-center ${
            editMode ? "relative group" : ""
          }`}
          style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            color: "rgba(226,232,240,0.42)",
          }}
        >
          {editMode && (
            <EditToolbar>
              <AdminPillButton
                icon={Pencil}
                label="Copyright"
                onClick={() => onEditTarget({ type: "copyright" })}
              />
            </EditToolbar>
          )}
          {content.copyrightText}
        </div>
      </div>

      {showContactModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/65 backdrop-blur-sm p-6">
          <div
            className="relative w-full max-w-md overflow-hidden rounded-2xl border shadow-2xl"
            style={{
              background: `linear-gradient(180deg, ${palette.navy} 0%, #0D1E36 100%)`,
              borderColor: `${palette.gold}35`,
            }}
          >
            <div className="h-1" style={{ background: palette.gold }} />

            {copied && (
              <div
                className="absolute top-5 right-5 z-50 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold"
                style={{
                  background: palette.secondary,
                  color: "#FFFFFF",
                }}
              >
                <Check className="w-3.5 h-3.5" /> {content.copiedText}
              </div>
            )}

            <div className="relative z-10 p-6">
              <div className="flex items-center gap-3 pb-4">
                <Phone className="w-5 h-5" style={{ color: palette.gold }} />
                <h3 className="text-xl font-bold text-white">
                  {content.modalTitle}
                </h3>
              </div>

              <div className="space-y-3">
                {content.contact.phones.map((phone, index) => (
                  <button
                    key={`${phone}-${index}`}
                    type="button"
                    onClick={() => copyPhone(phone)}
                    className="w-full text-left p-4 rounded-xl transition-all duration-300 hover:-translate-y-0.5"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    <span className="text-white text-lg">{phone}</span>
                  </button>
                ))}
              </div>

              <p className="text-xs mt-4" style={{ color: "rgba(226,232,240,0.5)" }}>
                {content.modalHint}
              </p>

              <button
                type="button"
                onClick={() => setShowContactModal(false)}
                className="mt-6 w-full py-3.5 rounded-xl text-sm font-bold transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  color: palette.navy,
                  background: `linear-gradient(135deg, ${palette.gold} 0%, ${palette.goldLight} 100%)`,
                }}
              >
                {content.closeButtonText}
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}

export default Footer;