import { useEffect, useState, useRef, useCallback } from "react";
import api from "../../lib/api";
import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  Clock3,
  Send,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  MessageSquare,
  Building2,
  Pencil,
  Trash2,
  Plus,
  Compass,
  ArrowRight,
  Sparkles,
  Navigation,
} from "lucide-react";



export const colors = {
  burgundy: "#24131F",
  burgundy2: "#451B2D",
  rose: "#A62B4F",
  gold: "#C79A3B",
  goldLight: "#E5C878",
  cream: "#FBF7EF",
  paper: "#FFF9F0",
  paperDark: "#F1E6D8",
  text: "#211824",
  muted: "#786C72",
  line: "#E5D9CD",
};

export const defaultContactContent = {
  badgeText: "Get In Touch",
  title: "Let's Connect",
  highlightedText: "Connect",
  subtitle:
    "Have questions about admissions, curriculum, or school life? Our team is ready to help you with the information you need.",

  contactInfo: [
    {
      id: "address",
      icon: "map",
      label: "School Address",
      value: "Basudev Marga, Hetauda-2, Makawanpur, Nepal",
      color: "#A62B4F",
    },
    {
      id: "phone",
      icon: "phone",
      label: "Call Us Directly",
      value: "057-590144, 057-590145",
      color: "#8C6A24",
    },
    {
      id: "email",
      icon: "mail",
      label: "Email Inquiries",
      value: "inforedroseschool@gmail.com",
      color: "#6D4057",
    },
    {
      id: "hours",
      icon: "clock",
      label: "Office Hours",
      value: "Sun - Fri: 9:00 AM - 4:00 PM",
      color: "#9A7040",
    },
  ],

  mapCard: {
    title: "Red Rose Secondary English Boarding School",
    address: "Basudev Marga, Hetauda-2, Makawanpur, Nepal",
    buttonText: "Open in Google Maps",
    mapUrl:
      "https://www.google.com/maps/place/Red+Rose+English+Boarding+School/@27.3787422,85.0771236,983m/data=!3m1!1e3!4m14!1m7!3m6!1s0x39eb48cf3ad13d91:0x7905f4bf995fafde!2sRed+Rose+English+Boarding+School!8m2!3d27.3787422!4d85.0796985!16s%2Fg%2F11hc_dz_zg!3m5!1s0x39eb48cf3ad13d91:0x7905f4bf995fafde!8m2!3d27.3787422!4d85.0796985!16s%2Fg%2F11hc_dz_zg?entry=ttu",
  },

  form: {
    title: "Send Us a Message",
    nameLabel: "Full Name",
    namePlaceholder: "e.g. Ram Shrestha",
    emailLabel: "Email Address",
    emailPlaceholder: "ram@example.com",
    phoneLabel: "Phone Number",
    phonePlaceholder: "98XXXXXXXX",
    subjectLabel: "Inquiry Category",
    subjectPlaceholder: "Admissions Inquiry",
    messageLabel: "Your Message",
    messagePlaceholder:
      "Write your message or inquiry details here...",
    buttonText: "Send Message",
  },
};

export function mergeContactContent(saved = {}) {
  const safeSaved = saved || {};

  return {
    ...defaultContactContent,
    ...safeSaved,

    contactInfo:
      Array.isArray(safeSaved.contactInfo) &&
      safeSaved.contactInfo.length
        ? safeSaved.contactInfo.map((item, index) => ({
            id: item.id || `contact-${index}`,
            icon: item.icon || "map",
            label: item.label || "Contact",
            value: item.value || "",
            color:
              item.color ||
              defaultContactContent.contactInfo[
                index %
                  defaultContactContent.contactInfo.length
              ].color,
          }))
        : defaultContactContent.contactInfo,

    mapCard: {
      ...defaultContactContent.mapCard,
      ...(safeSaved.mapCard || {}),
    },

    form: {
      ...defaultContactContent.form,
      ...(safeSaved.form || {}),
    },
  };
}

export function normalizeExternalUrl(url = "") {
  const cleanUrl = String(url || "").trim();

  if (!cleanUrl) return "#";

  if (/^(https?:|mailto:|tel:|sms:)/i.test(cleanUrl)) {
    return cleanUrl;
  }

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    cleanUrl
  )}`;
}

function HighlightedTitle({ title, highlightedText }) {
  const safeTitle = title || "Let's Connect";
  const highlight = highlightedText || "Connect";

  if (!highlight || !safeTitle.includes(highlight)) {
    return <>{safeTitle}</>;
  }

  const [before, after] = safeTitle.split(highlight);

  return (
    <>
      {before}
      <em>{highlight}</em>
      {after}
    </>
  );
}

function getContactIcon(icon) {
  switch (icon) {
    case "phone":
      return Phone;
    case "mail":
      return Mail;
    case "clock":
      return Clock3;
    case "map":
    default:
      return MapPin;
  }
}

function EditCircleButton({ onClick, label = "Edit" }) {
  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        event.preventDefault();
        onClick();
      }}
      className="rr-contact-edit-button"
      title={label}
      aria-label={label}
    >
      <Pencil size={13} />
    </button>
  );
}

function DeleteCircleButton({ onClick, label = "Delete" }) {
  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        event.preventDefault();
        onClick();
      }}
      className="rr-contact-delete-button"
      title={label}
      aria-label={label}
    >
      <Trash2 size={13} />
    </button>
  );
}

function useInViewOnce() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(element);
        }
      },
      { threshold: 0.08 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return { ref, inView };
}

export default function Contact({
  editMode = false,
  contentOverride = null,
  onEditHero = () => {},
  onEditContactInfo = () => {},
  onDeleteContactInfo = () => {},
  onAddContactInfo = () => {},
  onEditMap = () => {},
  onEditForm = () => {},
  onEditTarget = () => {},
}) {
  const [content, setContent] = useState(() =>
    mergeContactContent(
      contentOverride || defaultContactContent
    )
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Admissions Inquiry",
    message: "",
  });

  const [status, setStatus] = useState({
    loading: false,
    success: false,
    error: "",
  });

  // Contact-card interactions
  const [phoneModalOpen, setPhoneModalOpen] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState("");

  const RED_ROSE_MAP_URL =
    "https://www.google.com/maps?cid=8720645357221949406&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAMYASAF&hl=en&source=embed";

  const PHONE_NUMBERS = [
    "057-590144",
    "057-590145",
    "057-590146",
  ];

  const handlePhoneClick = (event) => {
    if (editMode) return;

    event.preventDefault();
    event.stopPropagation();
    setCopiedPhone("");
    setPhoneModalOpen(true);
  };

  const handleCopyPhone = async (phone) => {
    try {
      await navigator.clipboard.writeText(phone);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = phone;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand("copy");
      textArea.remove();
    }

    setCopiedPhone(phone);
    window.setTimeout(() => {
      setCopiedPhone((current) => (current === phone ? "" : current));
    }, 1800);
  };

  const handleContactCardClick = (event, info) => {
    if (editMode) {
      handleContactInfoEdit(info.id);
      return;
    }

    const type = String(info.id || info.icon || "").toLowerCase();

    if (type.includes("address") || type === "map" || info.icon === "map") {
      event.preventDefault();
      window.open(RED_ROSE_MAP_URL, "_blank", "noopener,noreferrer");
      return;
    }

    if (type.includes("phone") || info.icon === "phone") {
      handlePhoneClick(event);
      return;
    }

    if (type.includes("email") || info.icon === "mail") {
      event.preventDefault();
      window.location.href = `mailto:${String(
        info.value || "inforedroseschool@gmail.com"
      )
        .split(",")[0]
        .trim()}`;
    }
  };

  const {
    ref: heroRef,
    inView: heroInView,
  } = useInViewOnce();

  const {
    ref: contactCardsRef,
    inView: contactCardsInView,
  } = useInViewOnce();

  const handleHeroEdit = () => {
    onEditHero();
    onEditTarget({ type: "hero" });
  };

  const handleContactInfoEdit = (id) => {
    onEditContactInfo(id);
    onEditTarget({
      type: "contactInfo",
      id,
    });
  };

  const handleContactInfoDelete = (id) => {
    onDeleteContactInfo(id);
    onEditTarget({
      type: "deleteContactInfo",
      id,
    });
  };

  const handleAddContactInfo = () => {
    onAddContactInfo();
    onEditTarget({
      type: "addContactInfo",
    });
  };

  const handleMapEdit = () => {
    onEditMap();
    onEditTarget({
      type: "mapCard",
    });
  };

  const handleFormEdit = () => {
    onEditForm();
    onEditTarget({
      type: "form",
    });
  };

  useEffect(() => {
    if (contentOverride) {
      setContent(
        mergeContactContent(contentOverride)
      );
      return;
    }

    let alive = true;

    const loadContact = async () => {
      try {
        const response = await api.get(
          "/api/site-content/contact",
          { timeout: 12000 }
        );

        if (!alive) return;

        setContent(
          mergeContactContent(
            response.data?.data?.content || {}
          )
        );
      } catch (error) {
        console.error(
          "Contact content load error:",
          error
        );

        if (alive) {
          setContent(
            mergeContactContent(
              defaultContactContent
            )
          );
        }
      }
    };

    loadContact();

    return () => {
      alive = false;
    };
  }, [contentOverride]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (status.error) {
      setStatus((previous) => ({
        ...previous,
        error: "",
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (editMode) return;

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.message.trim()
    ) {
      setStatus({
        loading: false,
        success: false,
        error:
          "Please fill in your name, email, and message.",
      });
      return;
    }

    setStatus({
      loading: true,
      success: false,
      error: "",
    });

    try {
      await api.post("/api/contact-messages", {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        subject: formData.subject,
        message: formData.message.trim(),
      });

      setStatus({
        loading: false,
        success: true,
        error: "",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "Admissions Inquiry",
        message: "",
      });

      setTimeout(() => {
        setStatus((previous) => ({
          ...previous,
          success: false,
        }));
      }, 6000);
    } catch (error) {
      console.error(
        "Contact message submission error:",
        error
      );

      setStatus({
        loading: false,
        success: false,
        error:
          "Message could not be sent. Please try again.",
      });
    }
  };

  const RED_ROSE_EMBED_URL =
    "https://maps.google.com/maps?q=Red%20Rose%20English%20Boarding%20School%2C%20Hetauda%2C%20Nepal&ll=27.3787422%2C85.0796985&z=17&hl=en&output=embed";

  const savedMapUrl = String(
    content.mapCard?.mapUrl || ""
  ).trim();

  const isOldBalJagritiUrl =
    /bal[+%20_-]*jagriti|27\.4312792|85\.0379093/i.test(
      savedMapUrl
    );

  const DISPLAY_MAP_URL =
    isOldBalJagritiUrl || !savedMapUrl
      ? RED_ROSE_MAP_URL
      : normalizeExternalUrl(savedMapUrl);

  const MAP_EMBED_URL = RED_ROSE_EMBED_URL;

  return (
    <main
      className={`red-rose-contact ${
        editMode ? "rr-contact-edit-mode" : ""
      }`}
    >
      {/* ============================================================
          HERO
          ============================================================ */}

      <section className="rr-contact-hero">
        <div className="rr-contact-hero-pattern" />
        <div className="rr-contact-hero-glow rr-glow-one" />
        <div className="rr-contact-hero-glow rr-glow-two" />

        <div
          ref={heroRef}
          className="rr-contact-hero-inner"
        >
          {editMode && (
            <div className="rr-contact-hero-edit">
              <EditCircleButton
                onClick={handleHeroEdit}
                label="Edit Heading"
              />
            </div>
          )}

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={
              heroInView || editMode
                ? {
                    opacity: 1,
                    y: 0,
                  }
                : {}
            }
            transition={{
              duration: 0.65,
            }}
            className="rr-contact-kicker"
          >
            <span />
            {content.badgeText || "Get In Touch"}
          </motion.div>

          <motion.h1
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={
              heroInView || editMode
                ? {
                    opacity: 1,
                    y: 0,
                  }
                : {}
            }
            transition={{
              duration: 0.7,
              delay: 0.08,
            }}
          >
            <HighlightedTitle
              title={
                content.title || "Let's Connect"
              }
              highlightedText={
                content.highlightedText ||
                "Connect"
              }
            />
          </motion.h1>

          <motion.div
            initial={{
              opacity: 0,
              scaleX: 0.6,
            }}
            animate={
              heroInView || editMode
                ? {
                    opacity: 1,
                    scaleX: 1,
                  }
                : {}
            }
            transition={{
              duration: 0.55,
              delay: 0.2,
            }}
            className="rr-contact-title-rule"
          >
            <i />
            <span />
            <i />
          </motion.div>

          <motion.p
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={
              heroInView || editMode
                ? {
                    opacity: 1,
                    y: 0,
                  }
                : {}
            }
            transition={{
              duration: 0.6,
              delay: 0.26,
            }}
          >
            {content.subtitle}
          </motion.p>

          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={
              heroInView || editMode
                ? {
                    opacity: 1,
                    y: 0,
                  }
                : {}
            }
            transition={{
              duration: 0.6,
              delay: 0.34,
            }}
            className="rr-contact-hero-bottom"
          >
            <div className="rr-contact-hero-mark">
              <strong>RR</strong>
              <span>RED ROSE</span>
            </div>

            <div className="rr-contact-hero-note">
              <MessageSquare size={16} />
              <span>We would love to hear from you.</span>
            </div>
          </motion.div>
        </div>

        <div className="rr-contact-hero-wave">
          <div />
        </div>
      </section>

      {/* ============================================================
          CONTACT INFORMATION
          ============================================================ */}

      <section className="rr-contact-info-section">
        <div className="rr-contact-shell">
          <div className="rr-contact-section-intro">
            <div className="rr-contact-small-label">
              <span />
              Contact Information
            </div>

            <h2>
              Find the right way to
              <em> reach us.</em>
            </h2>

            <p>
              Whether you are planning a visit, asking
              about admissions, or simply need more
              information, our school office is here to
              assist.
            </p>
          </div>

          <div
            ref={contactCardsRef}
            className="rr-contact-info-grid"
          >
            {content.contactInfo.map(
              (info, index) => {
                const Icon = getContactIcon(
                  info.icon
                );

                return (
                  <motion.article
                    key={info.id}
                    initial={{
                      opacity: 0,
                      y: 22,
                    }}
                    animate={
                      contactCardsInView || editMode
                        ? {
                            opacity: 1,
                            y: 0,
                          }
                        : {}
                    }
                    transition={{
                      duration: 0.5,
                      delay: index * 0.07,
                    }}
                    className={`rr-contact-info-card ${
                      editMode
                        ? "rr-editable-card"
                        : ""
                    } ${
                      !editMode &&
                      (info.icon === "map" ||
                        info.icon === "phone" ||
                        info.icon === "mail")
                        ? "rr-contact-clickable"
                        : ""
                    }`}
                    onClick={(event) =>
                      handleContactCardClick(event, info)
                    }
                    onKeyDown={(event) => {
                      if (
                        event.key === "Enter" ||
                        event.key === " "
                      ) {
                        handleContactCardClick(event, info);
                      }
                    }}
                    role={
                      !editMode &&
                      (info.icon === "map" ||
                        info.icon === "phone" ||
                        info.icon === "mail")
                        ? "button"
                        : undefined
                    }
                    tabIndex={
                      !editMode &&
                      (info.icon === "map" ||
                        info.icon === "phone" ||
                        info.icon === "mail")
                        ? 0
                        : undefined
                    }
                  >
                    {editMode && (
                      <div className="rr-contact-card-actions">
                        <EditCircleButton
                          onClick={() =>
                            handleContactInfoEdit(
                              info.id
                            )
                          }
                          label={`Edit ${info.label}`}
                        />

                        {content.contactInfo.length >
                          1 && (
                          <DeleteCircleButton
                            onClick={() =>
                              handleContactInfoDelete(
                                info.id
                              )
                            }
                            label={`Delete ${info.label}`}
                          />
                        )}
                      </div>
                    )}

                    <div
                      className="rr-contact-icon"
                      style={{
                        "--icon-color":
                          info.color ||
                          colors.rose,
                      }}
                    >
                      <Icon size={22} />
                    </div>

                    <div className="rr-contact-info-copy">
                      <span>{info.label}</span>
                      <p>{info.value}</p>
                    </div>

                    <div className="rr-contact-card-line" />
                  </motion.article>
                );
              }
            )}
          </div>

          {editMode && (
            <div className="rr-contact-add-row">
              <button
                type="button"
                onClick={handleAddContactInfo}
              >
                <Plus size={16} />
                Add Contact Card
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ============================================================
          FORM + MAP
          ============================================================ */}

      <section className="rr-contact-main">
        <div className="rr-contact-shell">
          <div className="rr-contact-main-grid">
            {/* FORM */}

            <motion.div
              initial={{
                opacity: 0,
                x: -25,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
                amount: 0.12,
              }}
              transition={{
                duration: 0.65,
              }}
              className={`rr-contact-form-card ${
                editMode
                  ? "rr-editable-card"
                  : ""
              }`}
              onClick={
                editMode
                  ? handleFormEdit
                  : undefined
              }
            >
              {editMode && (
                <div className="rr-contact-form-edit">
                  <EditCircleButton
                    onClick={handleFormEdit}
                    label="Edit Form Text"
                  />
                </div>
              )}

              <div className="rr-contact-form-heading">
                <div className="rr-contact-form-icon">
                  <MessageSquare size={21} />
                </div>

                <div>
                  <div className="rr-contact-small-label">
                    <span />
                    Write to us
                  </div>

                  <h2>
                    {content.form?.title ||
                      "Send Us a Message"}
                  </h2>

                  <p>
                    Fill out the form and our team
                    will get back to you.
                  </p>
                </div>
              </div>

              {status.success && (
                <div className="rr-contact-alert success">
                  <CheckCircle2 size={19} />
                  <span>
                    Thank you! Your message has
                    been sent successfully. We will
                    get back to you soon.
                  </span>
                </div>
              )}

              {status.error && (
                <div className="rr-contact-alert error">
                  <AlertCircle size={19} />
                  <span>{status.error}</span>
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="rr-contact-form"
              >
                <div className="rr-contact-field-grid">
                  <label>
                    <span>
                      {content.form?.nameLabel ||
                        "Full Name"}{" "}
                      <b>*</b>
                    </span>

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={
                        content.form
                          ?.namePlaceholder ||
                        "e.g. Ram Shrestha"
                      }
                      required
                      disabled={editMode}
                    />
                  </label>

                  <label>
                    <span>
                      {content.form?.emailLabel ||
                        "Email Address"}{" "}
                      <b>*</b>
                    </span>

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={
                        content.form
                          ?.emailPlaceholder ||
                        "ram@example.com"
                      }
                      required
                      disabled={editMode}
                    />
                  </label>
                </div>

                <div className="rr-contact-field-grid">
                  <label>
                    <span>
                      {content.form?.phoneLabel ||
                        "Phone Number"}
                    </span>

                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder={
                        content.form
                          ?.phonePlaceholder ||
                        "98XXXXXXXX"
                      }
                      disabled={editMode}
                    />
                  </label>

                  <label>
                    <span>
                      {content.form?.subjectLabel ||
                        "Inquiry Category"}
                    </span>

                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      disabled={editMode}
                    >
                      <option value="Admissions Inquiry">
                        Admissions Inquiry
                      </option>
                      <option value="Academic Programs">
                        Academic Programs
                      </option>
                      <option value="Fee Structure">
                        Fee Structure
                      </option>
                      <option value="General Inquiry">
                        General Inquiry
                      </option>
                    </select>
                  </label>
                </div>

                <label className="rr-contact-message-field">
                  <span>
                    {content.form?.messageLabel ||
                      "Your Message"}{" "}
                    <b>*</b>
                  </span>

                  <textarea
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={
                      content.form
                        ?.messagePlaceholder ||
                      "Write your message or inquiry details here..."
                    }
                    required
                    disabled={editMode}
                  />
                </label>

                <div className="rr-contact-submit-row">
                  <button
                    type="submit"
                    disabled={
                      status.loading || editMode
                    }
                    className="rr-contact-submit"
                  >
                    <span>
                      {status.loading
                        ? "Sending Message..."
                        : content.form?.buttonText ||
                          "Send Message"}
                    </span>

                    <Send size={16} />
                  </button>

                  <small>
                    We normally respond during
                    office hours.
                  </small>
                </div>
              </form>
            </motion.div>

            {/* MAP */}

            <motion.div
              initial={{
                opacity: 0,
                x: 25,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
                amount: 0.12,
              }}
              transition={{
                duration: 0.65,
                delay: 0.1,
              }}
              className={`rr-contact-map-card ${
                editMode
                  ? "rr-editable-card"
                  : ""
              }`}
              onClick={
                editMode
                  ? handleMapEdit
                  : undefined
              }
            >
              {editMode && (
                <div className="rr-contact-map-edit">
                  <EditCircleButton
                    onClick={handleMapEdit}
                    label="Edit Map & Location"
                  />
                </div>
              )}

              <div className="rr-contact-map-heading">
                <div className="rr-contact-map-icon">
                  <Navigation size={19} />
                </div>

                <div>
                  <div className="rr-contact-small-label">
                    <span />
                    Visit Our School
                  </div>

                  <h2>Find Us</h2>
                </div>
              </div>

              <div className="rr-contact-map-frame">
                <iframe
                  title="Red Rose School Map"
                  src={MAP_EMBED_URL}
                  width="100%"
                  height="100%"
                  style={{
                    border: 0,
                  }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rr-contact-map-iframe"
                />

                <div className="rr-contact-map-overlay">
                  <div className="rr-contact-map-pin">
                    <MapPin size={18} />
                  </div>
                  <span>Red Rose School</span>
                </div>
              </div>

              <div className="rr-contact-location-copy">
                <div>
                  <h3>
                    {content.mapCard?.title ||
                      "Red Rose Secondary English Boarding School"}
                  </h3>

                  <p>
                    <MapPin size={13} />
                    {content.mapCard?.address ||
                      "Basudev Marga, Hetauda-2, Makawanpur, Nepal"}
                  </p>
                </div>

                <a
                  href={DISPLAY_MAP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(event) =>
                    editMode &&
                    event.stopPropagation()
                  }
                  className="rr-contact-map-button"
                >
                  <Compass size={15} />
                  <span>
                    {content.mapCard?.buttonText ||
                      "Open in Google Maps"}
                  </span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================================
          OFFICE HOURS / FINAL CTA
          ============================================================ */}

      <section className="rr-contact-visit">
        <div className="rr-contact-visit-pattern" />

        <div className="rr-contact-visit-inner">
          <div className="rr-contact-visit-icon">
            <Clock3 size={22} />
          </div>

          <div>
            <div className="rr-contact-small-label light">
              <span />
              Office Hours
            </div>

            <h2>
              We are here when you
              <em> need us.</em>
            </h2>

            <p>
              Sun - Fri: 9:00 AM - 4:00 PM
            </p>
          </div>

          <div className="rr-contact-visit-divider" />

          <div className="rr-contact-visit-note">
            <Sparkles size={17} />
            <span>
              We look forward to hearing from you.
            </span>
          </div>
        </div>
      </section>

      {/* ============================================================
          PHONE NUMBER MODAL
          ============================================================ */}

      {phoneModalOpen && !editMode && (
        <div
          className="rr-contact-phone-modal-backdrop"
          role="presentation"
          onClick={() => setPhoneModalOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.22 }}
            className="rr-contact-phone-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="rr-contact-phone-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="rr-contact-phone-modal-top-line" />

            <div className="rr-contact-phone-modal-header">
              <div className="rr-contact-phone-modal-title">
                <Phone size={19} />
                <h2 id="rr-contact-phone-title">
                  Contact Red Rose School
                </h2>
              </div>

              <button
                type="button"
                className="rr-contact-phone-close"
                onClick={() => setPhoneModalOpen(false)}
                aria-label="Close phone numbers"
              >
                ×
              </button>
            </div>

            <div className="rr-contact-phone-list">
              {PHONE_NUMBERS.map((phone) => (
                <button
                  type="button"
                  key={phone}
                  className="rr-contact-phone-number"
                  onClick={() => handleCopyPhone(phone)}
                  title="Click to copy"
                >
                  <span>{phone}</span>
                  {copiedPhone === phone && (
                    <span className="rr-contact-copied">
                      Copied
                    </span>
                  )}
                </button>
              ))}
            </div>

            <p className="rr-contact-phone-hint">
              Click any number to copy it.
            </p>

            <button
              type="button"
              className="rr-contact-phone-close-main"
              onClick={() => setPhoneModalOpen(false)}
            >
              Close
            </button>
          </motion.div>
        </div>
      )}

      <style>{`
        /* ============================================================
           RED ROSE CONTACT — COMPLETE PAGE STYLES
           ============================================================ */

        .red-rose-contact {
          --burgundy: ${colors.burgundy};
          --burgundy-2: ${colors.burgundy2};
          --rose: ${colors.rose};
          --gold: ${colors.gold};
          --gold-light: ${colors.goldLight};
          --cream: ${colors.cream};
          --paper: ${colors.paper};
          --paper-dark: ${colors.paperDark};
          --text: ${colors.text};
          --muted: ${colors.muted};
          --line: ${colors.line};

          min-height: 100vh;
          overflow-x: hidden;
          color: var(--text);
          background: var(--cream);
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        .rr-contact-shell {
          width: min(1140px, calc(100% - 32px));
          margin: 0 auto;
        }

        /* ============================================================
           HERO
           ============================================================ */

        .rr-contact-hero {
          position: relative;
          min-height: 620px;
          display: flex;
          align-items: center;
          overflow: hidden;
          background:
            radial-gradient(
              circle at 14% 25%,
              rgba(199,154,59,.14),
              transparent 24%
            ),
            radial-gradient(
              circle at 87% 72%,
              rgba(166,43,79,.25),
              transparent 31%
            ),
            linear-gradient(
              135deg,
              #24131F 0%,
              #351725 50%,
              #512036 100%
            );
        }

        .rr-contact-hero-pattern {
          position: absolute;
          inset: 0;
          opacity: .09;
          background-image:
            radial-gradient(
              circle,
              white 1px,
              transparent 1.25px
            );
          background-size: 19px 19px;
          mask-image:
            linear-gradient(
              to bottom,
              black,
              transparent 90%
            );
        }

        .rr-contact-hero::before {
          content: "";
          position: absolute;
          width: 430px;
          height: 430px;
          top: -190px;
          left: -170px;
          border: 1px solid rgba(229,200,120,.12);
          border-radius: 50%;
          box-shadow:
            0 0 0 55px rgba(229,200,120,.025),
            0 0 0 110px rgba(229,200,120,.018);
        }

        .rr-contact-hero::after {
          content: "";
          position: absolute;
          width: 520px;
          height: 520px;
          right: -260px;
          bottom: -300px;
          border: 1px solid rgba(229,200,120,.11);
          border-radius: 50%;
          box-shadow:
            0 0 0 60px rgba(229,200,120,.022),
            0 0 0 120px rgba(229,200,120,.015);
        }

        .rr-contact-hero-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(6px);
          pointer-events: none;
        }

        .rr-glow-one {
          width: 230px;
          height: 230px;
          left: 11%;
          bottom: 10%;
          background: rgba(199,154,59,.06);
          box-shadow:
            0 0 120px rgba(199,154,59,.12);
        }

        .rr-glow-two {
          width: 300px;
          height: 300px;
          right: 9%;
          top: 15%;
          background: rgba(166,43,79,.09);
          box-shadow:
            0 0 130px rgba(166,43,79,.18);
        }

        .rr-contact-hero-inner {
          position: relative;
          z-index: 3;
          width: min(880px, calc(100% - 32px));
          margin: 0 auto;
          padding: 115px 0 95px;
          text-align: center;
        }

        .rr-contact-hero-edit {
          position: absolute;
          right: 0;
          top: 92px;
          opacity: 0;
          transition: opacity .2s ease;
        }

        .rr-contact-hero-inner:hover
          .rr-contact-hero-edit {
          opacity: 1;
        }

        .rr-contact-kicker,
        .rr-contact-small-label {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          color: var(--rose);
          font-size: 10px;
          font-weight: 900;
          letter-spacing: .2em;
          text-transform: uppercase;
        }

        .rr-contact-kicker {
          color: #e5cc91;
        }

        .rr-contact-kicker span,
        .rr-contact-small-label span {
          width: 28px;
          height: 1px;
          background: var(--gold);
        }

        .rr-contact-hero h1 {
          margin: 22px auto 0;
          color: #fff;
          font-family:
            Georgia,
            "Times New Roman",
            serif;
          font-size: clamp(52px, 8vw, 84px);
          line-height: 1;
          letter-spacing: -.055em;
          font-weight: 700;
        }

        .rr-contact-hero h1 em {
          color: var(--gold-light);
          font-style: normal;
        }

        .rr-contact-title-rule {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          margin: 25px auto 0;
        }

        .rr-contact-title-rule i {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--gold);
        }

        .rr-contact-title-rule span {
          width: 65px;
          height: 2px;
          background:
            linear-gradient(
              90deg,
              transparent,
              var(--gold),
              transparent
            );
        }

        .rr-contact-hero-inner > p {
          max-width: 670px;
          margin: 24px auto 0;
          color: rgba(255,255,255,.67);
          font-size: 15px;
          line-height: 1.85;
        }

        .rr-contact-hero-bottom {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-top: 36px;
        }

        .rr-contact-hero-mark {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #dbc88f;
        }

        .rr-contact-hero-mark strong {
          font-family:
            Georgia,
            "Times New Roman",
            serif;
          font-size: 29px;
          line-height: 1;
        }

        .rr-contact-hero-mark span {
          font-size: 8px;
          font-weight: 900;
          letter-spacing: .2em;
        }

        .rr-contact-hero-note {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          border: 1px solid rgba(255,255,255,.12);
          border-radius: 999px;
          color: rgba(255,255,255,.63);
          background: rgba(255,255,255,.045);
          backdrop-filter: blur(10px);
          font-size: 10px;
          font-weight: 700;
        }

        .rr-contact-hero-note svg {
          color: var(--gold-light);
        }

        .rr-contact-hero-wave {
          position: absolute;
          z-index: 4;
          left: 0;
          right: 0;
          bottom: -1px;
          height: 34px;
          overflow: hidden;
        }

        .rr-contact-hero-wave div {
          width: 100%;
          height: 100%;
          background: var(--cream);
          clip-path:
            polygon(
              0 40%,
              4% 100%,
              8% 40%,
              12% 100%,
              16% 40%,
              20% 100%,
              24% 40%,
              28% 100%,
              32% 40%,
              36% 100%,
              40% 40%,
              44% 100%,
              48% 40%,
              52% 100%,
              56% 40%,
              60% 100%,
              64% 40%,
              68% 100%,
              72% 40%,
              76% 100%,
              80% 40%,
              84% 100%,
              88% 40%,
              92% 100%,
              96% 40%,
              100% 100%,
              100% 100%,
              0 100%
            );
        }

        /* ============================================================
           CONTACT INFORMATION
           ============================================================ */

        .rr-contact-info-section {
          position: relative;
          padding: 88px 0 94px;
          background:
            radial-gradient(
              circle at 8% 20%,
              rgba(166,43,79,.045),
              transparent 24%
            ),
            radial-gradient(
              circle at 94% 70%,
              rgba(199,154,59,.08),
              transparent 27%
            ),
            var(--cream);
        }

        .rr-contact-section-intro {
          max-width: 680px;
          margin: 0 auto 42px;
          text-align: center;
        }

        .rr-contact-section-intro h2 {
          margin: 14px 0 12px;
          color: var(--text);
          font-family:
            Georgia,
            "Times New Roman",
            serif;
          font-size: clamp(35px, 5vw, 53px);
          line-height: 1;
          letter-spacing: -.045em;
        }

        .rr-contact-section-intro h2 em {
          color: var(--rose);
          font-style: normal;
        }

        .rr-contact-section-intro p {
          max-width: 610px;
          margin: 0 auto;
          color: var(--muted);
          font-size: 13px;
          line-height: 1.85;
        }

        .rr-contact-info-grid {
          display: grid;
          grid-template-columns:
            repeat(4, minmax(0, 1fr));
          gap: 16px;
        }

        .rr-contact-info-card {
          position: relative;
          min-height: 185px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          padding: 24px 22px 21px;
          border: 1px solid #e4d8cc;
          border-radius: 19px;
          background: rgba(255,249,240,.86);
          box-shadow:
            0 8px 28px rgba(50,35,30,.045);
          transition:
            transform .28s ease,
            box-shadow .28s ease,
            border-color .28s ease;
        }

        .rr-contact-info-card:hover {
          transform: translateY(-5px);
          border-color: #d6c2a2;
          box-shadow:
            0 18px 42px rgba(50,35,30,.09);
        }

        .rr-contact-icon {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 18px;
          border-radius: 14px;
          color: var(--icon-color);
          background:
            color-mix(
              in srgb,
              var(--icon-color) 10%,
              white
            );
          border: 1px solid
            color-mix(
              in srgb,
              var(--icon-color) 20%,
              white
            );
        }

        .rr-contact-info-copy {
          position: relative;
          z-index: 1;
        }

        .rr-contact-info-copy > span {
          color: var(--text);
          font-size: 13px;
          font-weight: 900;
        }

        .rr-contact-info-copy p {
          margin: 7px 0 0;
          color: var(--muted);
          font-size: 11px;
          line-height: 1.7;
          white-space: pre-line;
        }

        .rr-contact-card-line {
          width: 35px;
          height: 2px;
          margin-top: auto;
          padding-top: 0;
          border-radius: 99px;
          background:
            linear-gradient(
              90deg,
              var(--rose),
              var(--gold)
            );
        }

        .rr-contact-card-actions {
          position: absolute;
          z-index: 5;
          right: 10px;
          top: 10px;
          display: flex;
          gap: 5px;
          opacity: 0;
          transition: opacity .2s ease;
        }

        .rr-editable-card:hover
          .rr-contact-card-actions {
          opacity: 1;
        }

        .rr-contact-add-row {
          display: flex;
          justify-content: center;
          margin-top: 25px;
        }

        .rr-contact-add-row button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 11px 17px;
          border: 0;
          border-radius: 11px;
          color: #33241d;
          background: var(--gold-light);
          box-shadow:
            0 8px 22px rgba(199,154,59,.18);
          cursor: pointer;
          font-size: 10px;
          font-weight: 900;
          transition:
            transform .2s ease,
            box-shadow .2s ease;
        }

        .rr-contact-add-row button:hover {
          transform: translateY(-2px);
          box-shadow:
            0 12px 28px rgba(199,154,59,.25);
        }

        /* ============================================================
           MAIN
           ============================================================ */

        .rr-contact-main {
          position: relative;
          padding: 100px 0 112px;
          background:
            linear-gradient(
              135deg,
              #f4ebdf 0%,
              #fbf7ef 50%,
              #f0e4d7 100%
            );
        }

        .rr-contact-main::before {
          content: "";
          position: absolute;
          inset: 0;
          opacity: .32;
          pointer-events: none;
          background-image:
            radial-gradient(
              #d7c9bc .8px,
              transparent .8px
            );
          background-size: 25px 25px;
        }

        .rr-contact-main-grid {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns:
            minmax(0, 1.15fr)
            minmax(390px, .85fr);
          gap: 25px;
          align-items: stretch;
        }

        /* ============================================================
           FORM CARD
           ============================================================ */

        .rr-contact-form-card {
          position: relative;
          padding: 34px;
          border: 1px solid #e2d6c9;
          border-radius: 24px;
          background:
            rgba(255,250,243,.93);
          box-shadow:
            0 18px 50px rgba(54,38,29,.075);
        }

        .rr-contact-form-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 38px;
          right: 38px;
          height: 3px;
          border-radius: 0 0 99px 99px;
          background:
            linear-gradient(
              90deg,
              var(--rose),
              var(--gold),
              var(--rose)
            );
        }

        .rr-contact-form-edit,
        .rr-contact-map-edit {
          position: absolute;
          z-index: 10;
          right: 14px;
          top: 14px;
          opacity: 0;
          transition: opacity .2s ease;
        }

        .rr-editable-card:hover
          .rr-contact-form-edit,
        .rr-editable-card:hover
          .rr-contact-map-edit {
          opacity: 1;
        }

        .rr-contact-form-heading {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          margin-bottom: 27px;
        }

        .rr-contact-form-icon,
        .rr-contact-map-icon {
          flex: 0 0 auto;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          color: var(--rose);
          background: #f1dfe4;
          border: 1px solid #ead0d8;
        }

        .rr-contact-form-heading h2,
        .rr-contact-map-heading h2 {
          margin: 7px 0 3px;
          color: var(--text);
          font-family:
            Georgia,
            "Times New Roman",
            serif;
          font-size: 28px;
          line-height: 1.05;
        }

        .rr-contact-form-heading p {
          margin: 0;
          color: var(--muted);
          font-size: 11px;
          line-height: 1.6;
        }

        .rr-contact-alert {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          margin-bottom: 18px;
          padding: 12px 14px;
          border-radius: 12px;
          font-size: 11px;
          line-height: 1.55;
          font-weight: 700;
        }

        .rr-contact-alert.success {
          color: #346449;
          border: 1px solid #c9e3d0;
          background: #eff8f1;
        }

        .rr-contact-alert.error {
          color: #8a3c43;
          border: 1px solid #efd0d4;
          background: #fff1f2;
        }

        .rr-contact-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .rr-contact-field-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .rr-contact-form label {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .rr-contact-form label > span {
          color: #6e6268;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: .13em;
          text-transform: uppercase;
        }

        .rr-contact-form label > span b {
          color: var(--rose);
        }

        .rr-contact-form input,
        .rr-contact-form select,
        .rr-contact-form textarea {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid #ded3c9;
          border-radius: 11px;
          outline: none;
          color: var(--text);
          background: #fffdf9;
          font-family: inherit;
          font-size: 12px;
          transition:
            border-color .2s ease,
            box-shadow .2s ease,
            background .2s ease;
        }

        .rr-contact-form input,
        .rr-contact-form select {
          height: 47px;
          padding: 0 13px;
        }

        .rr-contact-form textarea {
          min-height: 138px;
          resize: vertical;
          padding: 13px;
          line-height: 1.65;
        }

        .rr-contact-form input::placeholder,
        .rr-contact-form textarea::placeholder {
          color: #b0a6a1;
        }

        .rr-contact-form input:focus,
        .rr-contact-form select:focus,
        .rr-contact-form textarea:focus {
          border-color: #bd8e96;
          box-shadow:
            0 0 0 4px rgba(166,43,79,.07);
          background: white;
        }

        .rr-contact-form input:disabled,
        .rr-contact-form select:disabled,
        .rr-contact-form textarea:disabled {
          cursor: not-allowed;
          background: #f5eee7;
        }

        .rr-contact-submit-row {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-top: 2px;
        }

        .rr-contact-submit {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          min-height: 47px;
          padding: 0 20px;
          border: 0;
          border-radius: 11px;
          color: white;
          background:
            linear-gradient(
              135deg,
              var(--burgundy),
              var(--burgundy-2)
            );
          box-shadow:
            0 10px 25px rgba(36,19,31,.16);
          cursor: pointer;
          font-size: 10px;
          font-weight: 900;
          transition:
            transform .2s ease,
            box-shadow .2s ease;
        }

        .rr-contact-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow:
            0 14px 30px rgba(36,19,31,.22);
        }

        .rr-contact-submit:disabled {
          opacity: .55;
          cursor: not-allowed;
        }

        .rr-contact-submit-row small {
          color: #a0928d;
          font-size: 9px;
          line-height: 1.5;
        }

        /* ============================================================
           MAP
           ============================================================ */

        .rr-contact-map-card {
          position: relative;
          overflow: hidden;
          padding: 27px;
          border: 1px solid #e2d6c9;
          border-radius: 24px;
          background:
            rgba(255,250,243,.93);
          box-shadow:
            0 18px 50px rgba(54,38,29,.075);
        }

        .rr-contact-map-heading {
          display: flex;
          align-items: center;
          gap: 13px;
          margin-bottom: 20px;
        }

        .rr-contact-map-heading h2 {
          font-size: 27px;
        }

        .rr-contact-map-frame {
          position: relative;
          height: 365px;
          overflow: hidden;
          border: 1px solid #ded2c6;
          border-radius: 16px;
          background: #e4dbd2;
          box-shadow:
            inset 0 0 0 1px rgba(255,255,255,.45);
        }

        .rr-contact-map-iframe {
          display: block;
          width: 100%;
          height: 100%;
          border: 0;
        }

        .rr-contact-map-overlay {
          position: absolute;
          left: 14px;
          top: 14px;
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 7px 10px 7px 7px;
          border: 1px solid rgba(255,255,255,.7);
          border-radius: 10px;
          color: var(--text);
          background: rgba(255,250,243,.92);
          box-shadow:
            0 8px 22px rgba(40,25,20,.12);
          backdrop-filter: blur(7px);
          font-size: 9px;
          font-weight: 900;
        }

        .rr-contact-map-pin {
          width: 25px;
          height: 25px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          color: white;
          background: var(--rose);
        }

        .rr-contact-location-copy {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          margin-top: 18px;
          padding-top: 17px;
          border-top: 1px solid #e9ded4;
        }

        .rr-contact-location-copy h3 {
          margin: 0;
          color: var(--text);
          font-size: 12px;
          font-weight: 900;
        }

        .rr-contact-location-copy p {
          display: flex;
          align-items: center;
          gap: 5px;
          margin: 5px 0 0;
          color: var(--muted);
          font-size: 10px;
          line-height: 1.55;
        }

        .rr-contact-location-copy p svg {
          flex: 0 0 auto;
          color: var(--rose);
        }

        .rr-contact-map-button {
          flex: 0 0 auto;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 10px 12px;
          border: 1px solid #dfbd62;
          border-radius: 10px;
          color: #3d2c1d;
          background: #f7df99;
          box-shadow:
            0 7px 17px rgba(199,154,59,.14);
          font-size: 9px;
          font-weight: 900;
          text-decoration: none;
          transition:
            transform .2s ease,
            background .2s ease;
        }

        .rr-contact-map-button:hover {
          transform: translateY(-2px);
          background: #f0d17c;
        }

        /* ============================================================
           VISIT / CTA
           ============================================================ */

        .rr-contact-visit {
          position: relative;
          min-height: 270px;
          display: flex;
          align-items: center;
          overflow: hidden;
          background:
            radial-gradient(
              circle at 20% 30%,
              rgba(199,154,59,.12),
              transparent 27%
            ),
            linear-gradient(
              135deg,
              var(--burgundy),
              var(--burgundy-2)
            );
        }

        .rr-contact-visit-pattern {
          position: absolute;
          inset: 0;
          opacity: .09;
          background-image:
            radial-gradient(
              circle,
              white 1px,
              transparent 1.25px
            );
          background-size: 18px 18px;
        }

        .rr-contact-visit-inner {
          position: relative;
          z-index: 1;
          width: min(1000px, calc(100% - 32px));
          margin: 0 auto;
          display: grid;
          grid-template-columns: auto 1fr auto auto;
          align-items: center;
          gap: 25px;
          padding: 58px 0;
        }

        .rr-contact-visit-icon {
          width: 58px;
          height: 58px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(229,200,120,.25);
          border-radius: 17px;
          color: var(--gold-light);
          background: rgba(255,255,255,.05);
        }

        .rr-contact-small-label.light {
          color: #d9c387;
        }

        .rr-contact-visit-inner h2 {
          margin: 9px 0 5px;
          color: white;
          font-family:
            Georgia,
            "Times New Roman",
            serif;
          font-size: clamp(27px, 4vw, 39px);
          line-height: 1;
          letter-spacing: -.035em;
        }

        .rr-contact-visit-inner h2 em {
          color: var(--gold-light);
          font-style: normal;
        }

        .rr-contact-visit-inner p {
          margin: 0;
          color: rgba(255,255,255,.57);
          font-size: 11px;
          font-weight: 700;
        }

        .rr-contact-visit-divider {
          width: 1px;
          height: 58px;
          background: rgba(255,255,255,.13);
        }

        .rr-contact-visit-note {
          display: flex;
          align-items: center;
          gap: 7px;
          color: rgba(255,255,255,.62);
          font-size: 10px;
          font-weight: 700;
          white-space: nowrap;
        }

        .rr-contact-visit-note svg {
          color: var(--gold-light);
        }

        /* ============================================================
           CLICKABLE CONTACT CARDS
           ============================================================ */

        .rr-contact-clickable {
          cursor: pointer;
        }

        .rr-contact-clickable:focus-visible {
          outline: 2px solid var(--gold);
          outline-offset: 4px;
        }

        .rr-contact-clickable:hover .rr-contact-card-line {
          width: 58px;
        }

        /* ============================================================
           PHONE NUMBER MODAL
           ============================================================ */

        .rr-contact-phone-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: rgba(18, 9, 15, .76);
          backdrop-filter: blur(10px);
        }

        .rr-contact-phone-modal {
          position: relative;
          width: min(450px, 100%);
          overflow: hidden;
          padding: 29px 24px 24px;
          border: 1px solid rgba(229, 200, 120, .18);
          border-radius: 18px;
          background:
            linear-gradient(
              145deg,
              #171019 0%,
              #241622 55%,
              #321b2b 100%
            );
          box-shadow:
            0 30px 90px rgba(0,0,0,.42);
        }

        .rr-contact-phone-modal-top-line {
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          height: 3px;
          background:
            linear-gradient(
              90deg,
              var(--gold-light),
              var(--gold),
              var(--gold-light)
            );
        }

        .rr-contact-phone-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 21px;
        }

        .rr-contact-phone-modal-title {
          display: flex;
          align-items: center;
          gap: 11px;
          color: var(--gold-light);
        }

        .rr-contact-phone-modal-title h2 {
          margin: 0;
          color: #fff;
          font-family:
            Georgia,
            "Times New Roman",
            serif;
          font-size: 21px;
          line-height: 1.2;
        }

        .rr-contact-phone-close {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 auto;
          border: 1px solid rgba(255,255,255,.12);
          border-radius: 50%;
          color: rgba(255,255,255,.72);
          background: rgba(255,255,255,.06);
          cursor: pointer;
          font-size: 22px;
          line-height: 1;
          transition: .2s ease;
        }

        .rr-contact-phone-close:hover {
          color: white;
          background: rgba(255,255,255,.12);
          transform: rotate(90deg);
        }

        .rr-contact-phone-list {
          display: flex;
          flex-direction: column;
          gap: 11px;
        }

        .rr-contact-phone-number {
          width: 100%;
          min-height: 62px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 0 16px;
          border: 1px solid rgba(255,255,255,.11);
          border-radius: 14px;
          color: #fff;
          background: rgba(255,255,255,.045);
          cursor: pointer;
          text-align: left;
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            sans-serif;
          font-size: 17px;
          font-weight: 800;
          transition:
            background .2s ease,
            border-color .2s ease,
            transform .2s ease;
        }

        .rr-contact-phone-number:hover {
          border-color: rgba(229,200,120,.32);
          background: rgba(255,255,255,.08);
          transform: translateY(-1px);
        }

        .rr-contact-copied {
          color: var(--gold-light);
          font-size: 10px;
          font-weight: 900;
          letter-spacing: .08em;
          text-transform: uppercase;
        }

        .rr-contact-phone-hint {
          margin: 14px 0 20px;
          color: rgba(255,255,255,.5);
          font-size: 11px;
        }

        .rr-contact-phone-close-main {
          width: 100%;
          height: 53px;
          border: 0;
          border-radius: 13px;
          color: #1e1720;
          background:
            linear-gradient(
              135deg,
              #f0d797,
              #c7953d
            );
          cursor: pointer;
          font-size: 14px;
          font-weight: 700;
          transition:
            transform .2s ease,
            box-shadow .2s ease;
        }

        .rr-contact-phone-close-main:hover {
          transform: translateY(-1px);
          box-shadow:
            0 9px 24px rgba(199,154,59,.2);
        }

        /* ============================================================
           EDIT BUTTONS
           ============================================================ */

        .rr-contact-edit-button,
        .rr-contact-delete-button {
          width: 31px;
          height: 31px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid white;
          border-radius: 50%;
          cursor: pointer;
          transition:
            transform .2s ease,
            box-shadow .2s ease;
        }

        .rr-contact-edit-button {
          color: #2d2218;
          background:
            linear-gradient(
              135deg,
              #f4c95d,
              #f29a32
            );
          box-shadow:
            0 4px 13px rgba(245,158,11,.27);
        }

        .rr-contact-delete-button {
          color: white;
          background:
            linear-gradient(
              135deg,
              #b73b4e,
              #8f2338
            );
          box-shadow:
            0 4px 13px rgba(143,35,56,.25);
        }

        .rr-contact-edit-button:hover,
        .rr-contact-delete-button:hover {
          transform: scale(1.1);
        }

        /* ============================================================
           RESPONSIVE
           ============================================================ */

        @media (max-width: 1000px) {
          .rr-contact-info-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }

          .rr-contact-main-grid {
            grid-template-columns: 1fr;
          }

          .rr-contact-map-frame {
            height: 390px;
          }

          .rr-contact-visit-inner {
            grid-template-columns: auto 1fr;
          }

          .rr-contact-visit-divider {
            display: none;
          }
        }

        @media (max-width: 700px) {
          .rr-contact-shell {
            width: min(100% - 24px, 1140px);
          }

          .rr-contact-hero {
            min-height: 570px;
          }

          .rr-contact-hero-inner {
            width: calc(100% - 24px);
            padding: 100px 0 80px;
          }

          .rr-contact-hero h1 {
            font-size: clamp(45px, 13vw, 66px);
          }

          .rr-contact-hero-inner > p {
            font-size: 13px;
          }

          .rr-contact-hero-bottom {
            flex-direction: column;
          }

          .rr-contact-hero-edit {
            right: 4px;
            top: 80px;
          }

          .rr-contact-info-section,
          .rr-contact-main {
            padding: 70px 0;
          }

          .rr-contact-info-grid {
            grid-template-columns: 1fr;
          }

          .rr-contact-info-card {
            min-height: 160px;
          }

          .rr-contact-form-card,
          .rr-contact-map-card {
            padding: 24px 18px;
            border-radius: 19px;
          }

          .rr-contact-field-grid {
            grid-template-columns: 1fr;
          }

          .rr-contact-submit-row {
            align-items: flex-start;
            flex-direction: column;
          }

          .rr-contact-submit {
            width: 100%;
          }

          .rr-contact-map-frame {
            height: 330px;
          }

          .rr-contact-location-copy {
            align-items: flex-start;
            flex-direction: column;
          }

          .rr-contact-map-button {
            width: 100%;
          }

          .rr-contact-visit-inner {
            grid-template-columns: 1fr;
            text-align: center;
            justify-items: center;
          }

          .rr-contact-visit-note {
            white-space: normal;
          }
        }

        @media (max-width: 430px) {
          .rr-contact-phone-modal {
            padding: 25px 17px 18px;
            border-radius: 16px;
          }

          .rr-contact-phone-modal-title h2 {
            font-size: 18px;
          }

          .rr-contact-phone-number {
            min-height: 58px;
            font-size: 15px;
          }

          .rr-contact-form-heading {
            gap: 10px;
          }

          .rr-contact-form-heading h2,
          .rr-contact-map-heading h2 {
            font-size: 24px;
          }

          .rr-contact-map-frame {
            height: 285px;
          }

          .rr-contact-hero-note {
            font-size: 9px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .red-rose-contact *,
          .red-rose-contact *::before,
          .red-rose-contact *::after {
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: .01ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </main>
  );
}
