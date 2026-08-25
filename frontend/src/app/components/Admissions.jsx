import { useEffect, useState } from "react";
import api from "../../lib/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Calendar,
  Clock3,
  FileText,
  Download,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  Award,
  Users,
  GraduationCap,
  AlertCircle,
  HelpCircle,
  School,
  Send,
  Lock,
  X,
  Bus,
  Home,
  ClipboardCheck,
  HeartHandshake,
  CircleCheck,
  BookOpen,
  Pencil,
  Trash2,
  Plus,
} from "lucide-react";

export const defaultSettings = {
  isOpen: true,

  showAcademicSession: true,
  showStatusBadge: true,
  showDatesOnWebsite: true,
  hideWhenClosed: false,

  academicSession: "2027–2028",
  startDate: "2027-01-01",
  endDate: "2027-04-30",

  heroBadgeText: "Admissions Open for 2027–2028",
  heroTitle: "Empowering Next Generation Leaders",

  heroDescription:
    "Join our vibrant learning community. We offer holistic education, state-of-the-art facilities, and an environment where every student excels.",

  countdownEnabled: true,

  applyButtonText: "Apply Now for Admission",

  prospectusUrl: "",
  prospectusButtonText: "Download Prospectus",

  contactButtonText: "Contact Admissions",

  feeStructureUrl: "",
  feeButtonText: "Download Fee Structure PDF",
  feeRequestButtonText: "Request Fee Breakdown via Office",

  closedTitle: "Admissions Are Currently Closed",

  closedDescription:
    "Applications for this academic session have officially ended. The next admission cycle will be announced soon.",

  closedButtonText: "Contact Admissions Office",

  whyUsBadge: "Why Red Rose School",
  whyUsTitle: "Building a Foundation for Excellence",

  whyUsDescription:
    "We offer a comprehensive educational journey designed to foster academic rigor, leadership, and moral values.",

  whyUs: [
    {
      id: "why-1",
      icon: "Award",
      title: "Academic Excellence",
      desc:
        "Rigorous curriculum focused on conceptual clarity, critical thinking, and STEAM education.",
    },
    {
      id: "why-2",
      icon: "Users",
      title: "Expert Educators",
      desc:
        "Passionate teachers dedicated to mentoring, inspiring, and bringing out the best in every child.",
    },
    {
      id: "why-3",
      icon: "School",
      title: "Modern Learning Environment",
      desc:
        "Well-equipped classrooms and learning spaces designed for interactive and engaging education.",
    },
    {
      id: "why-4",
      icon: "ShieldCheck",
      title: "Safe & Nurturing Environment",
      desc:
        "A caring and secure school environment where children can learn, grow and develop confidence.",
    },
  ],

  processBadge: "Step-By-Step Workflow",
  processTitle: "Simple 5-Step Admission Process",

  processDescription:
    "A transparent, supportive, and hassle-free path to joining our school community.",

  timelineSteps: [
    {
      id: "step-1",
      number: "01",
      title: "Submit Inquiry",
      desc:
        "Fill out our online inquiry form with student and parent details.",
    },
    {
      id: "step-2",
      number: "02",
      title: "Campus Interaction",
      desc:
        "Visit our school to meet counselors and understand our learning environment.",
    },
    {
      id: "step-3",
      number: "03",
      title: "Assessment",
      desc:
        "The child participates in an age-appropriate assessment and friendly interaction.",
    },
    {
      id: "step-4",
      number: "04",
      title: "Verification",
      desc:
        "Complete the required admission verification process.",
    },
    {
      id: "step-5",
      number: "05",
      title: "Final Enrollment",
      desc:
        "Complete enrollment and welcome to Red Rose School!",
    },
  ],

  eligibilityBadge: "Requirements",
  eligibilityTitle: "Eligibility Criteria",

  eligibilityDescription:
    "Please ensure the candidate meets the age limits and academic prerequisites prior to applying.",

  eligibilityCriteria: [
    {
      id: "elig-1",
      grade: "Play Group & Nursery",
      age: "2.5 - 3.5 years",
      requirements:
        "Child birth certificate and basic admission information.",
    },
    {
      id: "elig-2",
      grade: "LKG & UKG",
      age: "4.0 - 5.0 years",
      requirements:
        "Basic interaction and previous school information if applicable.",
    },
    {
      id: "elig-3",
      grade: "Grade 1 - 5",
      age: "6.0+ years",
      requirements:
        "Previous academic information and admission assessment.",
    },
    {
      id: "elig-4",
      grade: "Grade 6 - 9",
      age: "11.0+ years",
      requirements:
        "Previous academic information and admission assessment.",
    },
  ],

  feeBadge: "Transparent Pricing",
  feeTitle: "Fee Structure & Scholarship Policy",

  feeDescription:
    "We provide transparent fee schedules with no hidden charges. Merit scholarships and financial assistance options may be available for eligible candidates.",

  faqsBadge: "Parent Assistance",
  faqsTitle: "Frequently Asked Questions",

  faqsDescription:
    "Got questions regarding admissions? We have answers.",

  faqs: [
    {
      id: "faq-1",
      question: "What is the admission procedure?",
      answer:
        "Fill out the online inquiry form or contact the school. Our admissions team will guide you through the next steps.",
    },
    {
      id: "faq-2",
      question: "Is school transportation available?",
      answer:
        "Yes. School transportation is available on selected routes. Please contact the school for route and availability information.",
    },
    {
      id: "faq-3",
      question: "Are hostel facilities available?",
      answer:
        "Please contact the school directly for current hostel availability and admission information.",
    },
    {
      id: "faq-4",
      question: "What are the school hours?",
      answer:
        "Regular school hours are from 9:00 AM to 3:30 PM, Sunday through Friday.",
    },
  ],

  contactBadge: "Direct Assistance",
  contactTitle: "Contact Admission Office",

  contactDescription:
    "Have questions? Reach out directly to our friendly admission counselors.",

  contactPhone: "057-590144, 057-590145",
  contactEmail: "inforedroseschool@gmail.com",
  contactHours: "Sun - Fri: 8:00 AM - 4:00 PM",

  contactAddress:
    "Basudev Marga, Hetauda-2, Makawanpur, Nepal",

  ctaTitle:
    "Give Your Child the Gift of Quality Education",

  ctaDescription:
    "Take the first step towards a bright academic future with Red Rose Secondary English Boarding School.",

  ctaButtonText: "Start Admission Inquiry Now",
  ctaClosedButtonText: "Contact Us for Future Cycles",
};

export const defaultAdmissionsContent = defaultSettings;
export const defaultContent = defaultSettings;

export function mergeAdmissionsContent(saved = {}) {
  const safeSaved = saved || {};

  return {
    ...defaultSettings,
    ...safeSaved,

    whyUs:
      Array.isArray(safeSaved.whyUs) &&
      safeSaved.whyUs.length
        ? safeSaved.whyUs
        : defaultSettings.whyUs,

    timelineSteps:
      Array.isArray(safeSaved.timelineSteps) &&
      safeSaved.timelineSteps.length
        ? safeSaved.timelineSteps
        : defaultSettings.timelineSteps,

    eligibilityCriteria:
      Array.isArray(safeSaved.eligibilityCriteria) &&
      safeSaved.eligibilityCriteria.length
        ? safeSaved.eligibilityCriteria
        : defaultSettings.eligibilityCriteria,

    faqs:
      Array.isArray(safeSaved.faqs) &&
      safeSaved.faqs.length
        ? safeSaved.faqs
        : defaultSettings.faqs,
  };
}

/* =========================================================
   ICON MAP
========================================================= */

const ICON_MAP = {
  Award,
  Users,
  School,
  ShieldCheck,
  Sparkles,
  GraduationCap,
  Clock3,
  Phone,
  Mail,
  MapPin,
  FileText,
  Calendar,
  HelpCircle,
  Send,
  Lock,
  CheckCircle2,
  AlertCircle,
  ClipboardCheck,
  HeartHandshake,
  BookOpen,
};

function DynamicIcon({
  name,
  size = 24,
  defaultIcon = Sparkles,
}) {
  const Component = ICON_MAP[name] || defaultIcon;
  return <Component size={size} />;
}

/* =========================================================
   EDITING CHROME

   Every editable block below is wrapped in <EditableWrap
   target={{ type: "..." }}>. AdminAdmissions.jsx's live-editor
   Modal switches on `target.type` to know which fields to show:

     status            → isOpen toggle, academicSession, startDate, endDate
     hero              → heroBadgeText, heroTitle, heroDescription,
                          applyButtonText, prospectusButtonText,
                          prospectusUrl, contactButtonText
     closedBanner      → closedTitle, closedDescription, closedButtonText
     whyUsHeader       → whyUsBadge, whyUsTitle, whyUsDescription
     whyUsCard(index)  → icon, title, desc
     processHeader     → processBadge, processTitle, processDescription
     processStep(index)→ number, title, desc
     eligibilityHeader → eligibilityBadge, eligibilityTitle, eligibilityDescription
     eligibilityCard   → grade, age, requirements
     fees              → feeBadge, feeTitle, feeDescription, feeButtonText,
                          feeRequestButtonText, feeStructureUrl
     faqHeader         → faqsBadge, faqsTitle, faqsDescription
     faqItem(index)    → question, answer
     contact           → contactBadge/Title/Description, contactPhone/Email/
                          Hours/Address, AND the final CTA
                          (ctaTitle/ctaDescription/ctaButtonText/ctaClosedButtonText)
                          — both the "Contact" section and the closing CTA
                          band share this one target so they save together.

   "+ Add" buttons call onAddTarget({ type }) with one of:
   "whyUs", "process", "eligibility", "faq".
========================================================= */

function EditIconButton({ editMode, target, onEditTarget, icon: Icon = Pencil, label = "Edit" }) {
  if (!editMode) return null;
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onEditTarget(target);
      }}
      className="absolute -top-2 -right-2 z-[9999] opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 rounded-full w-8 h-8 flex items-center justify-center shadow-lg"
      style={{ background: "rgba(255,255,255,1)", color: "#9C2748", border: "2px solid #9C2748" }}
      title={label}
    >
      <Icon className="w-3.5 h-3.5" />
    </button>
  );
}

function DeleteIconButton({ editMode, target, onDeleteTarget, label = "Delete" }) {
  if (!editMode) return null;
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onDeleteTarget(target);
      }}
      className="absolute -top-2 -right-12 z-[9999] opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 rounded-full w-8 h-8 flex items-center justify-center shadow-lg"
      style={{ background: "#FBE3E7", color: "#9C2748", border: "2px solid #9C2748" }}
      title={label}
    >
      <Trash2 className="w-3.5 h-3.5" />
    </button>
  );
}

function EditableWrap({
  editMode,
  target,
  onEditTarget,
  onDeleteTarget = () => {},
  icon = Pencil,
  label = "Edit",
  canDelete = false,
  className = "",
  children,
}) {
  if (!editMode) return children;
  return (
    <div className={`relative group ${className}`} style={{ position: "relative" }}>
      {children}
      <EditIconButton editMode={editMode} target={target} onEditTarget={onEditTarget} icon={icon} label={label} />
      {canDelete && (
        <DeleteIconButton editMode={editMode} target={target} onDeleteTarget={onDeleteTarget} label="Delete" />
      )}
    </div>
  );
}

// NOTE: onAddTarget is always called with an OBJECT — { type } — to match
// the shape AdminAdmissions.jsx's add() function expects (it reads `t.type`).
// A plain string here would silently break the "+ Add" buttons.
function SectionAddButton({ editMode, label, type, onAddTarget }) {
  if (!editMode) return null;
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onAddTarget({ type });
      }}
      className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5"
      style={{ color: "#FFFFFF", background: "linear-gradient(135deg, #6E1733 0%, #9C2748 55%, #C6486B 100%)", boxShadow: "0 10px 24px rgba(156,39,72,0.25)" }}
    >
      <Plus className="w-4 h-4" />
      {label}
    </button>
  );
}

/* =========================================================
   FORM
========================================================= */

const createInitialForm = (session = "") => ({
  studentName: "",
  dob: "",
  gender: "Male",
  applyingClass: "Grade 1",
  academicSession: session,

  prevSchoolName: "",

  parentName: "",
  relationship: "Father",

  mobile: "",
  email: "",

  district: "Makawanpur",
  city: "Hetauda",
  ward: "",
  fullAddress: "",

  transportRequired: false,
  hostelRequired: false,

  message: "",
});

/* =========================================================
   SECTION HEADING
========================================================= */

function SectionHeading({
  badge,
  title,
  description,
  light = false,
}) {
  return (
    <div className={`rr-admission-heading ${light ? "light" : ""}`}>
      <div className="rr-admission-small-label">
        <span />
        {badge}
      </div>

      <h2>{title}</h2>

      {description && <p>{description}</p>}
    </div>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function AdmissionsPage({
  // Legacy support for standalone preview
  previewData = null,

  // Admin Edit Mode Props
  editMode = false,
  contentOverride = null,
  onEditTarget = () => {},
  onDeleteTarget = () => {},
  onAddTarget = () => {},
}) {
  const [settings, setSettings] = useState(
    contentOverride
      ? mergeAdmissionsContent(contentOverride)
      : (previewData ? mergeAdmissionsContent(previewData) : defaultSettings)
  );

  const [loading, setLoading] = useState(!contentOverride && !previewData);
  const [openFaq, setOpenFaq] = useState(null);

  const [isFormModalOpen, setIsFormModalOpen] =
    useState(false);

  const [formData, setFormData] = useState(
    createInitialForm(
      (contentOverride || previewData || defaultSettings)?.academicSession ||
        defaultSettings.academicSession
    )
  );

  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] =
    useState(null);
  const [submitError, setSubmitError] = useState("");

  const { isOpen } = settings;

  // Data Loading Logic
  useEffect(() => {
    // ADMIN LIVE PREVIEW — AdminAdmissions.jsx passes its in-memory
    // `settings` object here as `contentOverride` after every save, so
    // this component always renders the latest edited content with no
    // extra network round trip.
    if (contentOverride) {
      const merged = mergeAdmissionsContent(contentOverride);
      setSettings(merged);
      setFormData(createInitialForm(merged.academicSession));
      setLoading(false);
      return;
    }

    // LEGACY PREVIEW (For custom usage)
    if (previewData) {
      const merged = mergeAdmissionsContent(previewData);
      setSettings(merged);
      setFormData(createInitialForm(merged.academicSession));
      setLoading(false);
      return;
    }

    // PUBLIC WEBSITE MODE — fetches whatever was last saved. Because the
    // admin's live editor saves each change immediately via
    // PUT /api/admissions/settings, this is always the latest published
    // content the next time a visitor loads the page.
    let alive = true;
    const fetchSettings = async () => {
      try {
        const response = await api.get("/api/admissions/settings");
        if (!alive) return;

        if (response.data?.data) {
          const loadedSettings = mergeAdmissionsContent(response.data.data);
          setSettings(loadedSettings);
          setFormData(createInitialForm(loadedSettings.academicSession));
        }
      } catch (error) {
        console.error("Failed to load admission settings:", error);
      } finally {
        if (alive) setLoading(false);
      }
    };

    fetchSettings();

    return () => { alive = false; };
  }, [contentOverride, previewData]);

  // Optional: if AdminAdmissions.jsx dispatches window "rr-admissions-updated"
  // after a save (it does), a real public tab left open in another window
  // can pick up the change without a full reload. This only runs in
  // public/standalone mode (never in the admin's own contentOverride mode).
  useEffect(() => {
    if (contentOverride || previewData) return undefined;

    const onLiveUpdate = (event) => {
      if (!event?.detail) return;
      const merged = mergeAdmissionsContent(event.detail);
      setSettings(merged);
    };

    window.addEventListener("rr-admissions-updated", onLiveUpdate);
    return () => window.removeEventListener("rr-admissions-updated", onLiveUpdate);
  }, [contentOverride, previewData]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (submitError) setSubmitError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError("");
    setSubmitSuccess(null);
    setSubmitting(true);

    try {
      const response = await api.post("/api/admissions/inquiry", formData);
      if (response.data?.success) {
        setSubmitSuccess(
          response.data.message || "Your admission inquiry has been submitted successfully!"
        );
        setFormData(createInitialForm(settings.academicSession || defaultSettings.academicSession));
      } else {
        setSubmitError(response.data?.message || "Failed to submit inquiry.");
      }
    } catch (error) {
      console.error("Admission inquiry error:", error);
      setSubmitError(error.response?.data?.message || "An error occurred while submitting the inquiry.");
    } finally {
      setSubmitting(false);
    }
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const openAdmissionForm = () => {
    if (!isOpen) return;
    setSubmitError("");
    setSubmitSuccess(null);
    setIsFormModalOpen(true);
  };

  if (loading) {
    return (
      <div className="rr-admission-loading">
        <div className="rr-admission-loader" />
        <p>Loading Admission Portal...</p>
      </div>
    );
  }

  const whyUsList = Array.isArray(settings.whyUs) && settings.whyUs.length ? settings.whyUs : defaultSettings.whyUs;
  const timelineList = Array.isArray(settings.timelineSteps) && settings.timelineSteps.length ? settings.timelineSteps : defaultSettings.timelineSteps;
  const eligibilityList = Array.isArray(settings.eligibilityCriteria) && settings.eligibilityCriteria.length ? settings.eligibilityCriteria : defaultSettings.eligibilityCriteria;
  const faqsList = Array.isArray(settings.faqs) && settings.faqs.length ? settings.faqs : defaultSettings.faqs;

  return (
    <main className="red-rose-admissions">
      
      {/* ======================================================
          ADD CSS FIX FOR THE PENCIL VISIBILITY
      ====================================================== */}
      <style>{`
        .rr-admission-hero-inner .group .absolute {
          z-index: 9999 !important;
          pointer-events: auto !important;
          opacity: 0 !important;
        }
        .rr-admission-hero-inner .group:hover .absolute {
          opacity: 1 !important;
        }
      `}</style>

      {/* ======================================================
          HERO
      ====================================================== */}

      <section className="rr-admission-hero">
        <div className="rr-admission-pattern" />
        <div className="rr-admission-glow glow-left" />
        <div className="rr-admission-glow glow-right" />

        <div className="rr-admission-hero-inner">
          <EditableWrap
            editMode={editMode}
            target={{ type: "hero" }}
            onEditTarget={onEditTarget}
            label="Edit Hero Banner"
          >
            <div className="rr-admission-hero-inner-content">
              <motion.div
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65 }}
                className="rr-admission-hero-kicker"
              >
                <span />
                Admissions
                <span />
              </motion.div>

              {/* Nested target: click here to toggle open/closed and edit
                  the academic session + dates, without touching the
                  headline text (handled by the outer "hero" target). */}
              <EditableWrap
                editMode={editMode}
                target={{ type: "status" }}
                onEditTarget={onEditTarget}
                label="Edit Admission Status"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.55, delay: 0.08 }}
                  className="rr-admission-status-row"
                >
                  {settings.showStatusBadge !== false && (
                    <span
                      className={`rr-admission-status ${isOpen ? "open" : "closed"}`}
                    >
                      <i className={isOpen ? "pulse" : ""} />
                      {isOpen
                        ? settings.heroBadgeText || "Admissions Open"
                        : "Admissions Closed"}
                    </span>
                  )}

                  {settings.showAcademicSession !== false && settings.academicSession && (
                    <span className="rr-admission-session">
                      <Calendar size={14} />
                      Session {settings.academicSession}
                    </span>
                  )}
                </motion.div>
              </EditableWrap>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.14 }}
                style={{ color: "#ffffff" }}
              >
                {settings.heroTitle}
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, scaleX: 0.5 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="rr-admission-title-rule"
              >
                <i />
                <span />
                <i />
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.3 }}
                style={{ color: "#ffffff" }}
              >
                {settings.heroDescription}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.4 }}
                className="rr-admission-hero-actions"
              >
                {isOpen ? (
                  <button
                    type="button"
                    onClick={openAdmissionForm}
                    className="rr-admission-primary-btn"
                  >
                    <Sparkles size={17} />
                    {settings.applyButtonText || "Apply Now for Admission"}
                    <ArrowRight size={17} />
                  </button>
                ) : (
                  <div className="rr-admission-locked-btn">
                    <Lock size={17} />
                    Application Form Currently Locked
                  </div>
                )}

                {settings.prospectusUrl && (
                  <a
                    href={settings.prospectusUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rr-admission-light-btn"
                  >
                    <Download size={16} />
                    {settings.prospectusButtonText || "Download Prospectus"}
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => scrollToSection("rr-admission-contact")}
                  className="rr-admission-outline-btn"
                >
                  <Phone size={16} />
                  {settings.contactButtonText || "Contact Admissions"}
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55 }}
                className="rr-admission-hero-foot"
              >
                <div>
                  <strong>RR</strong>
                  <span>RED ROSE SCHOOL</span>
                </div>
                <p>
                  <HeartHandshake size={15} />
                  A place to learn, grow and belong.
                </p>
              </motion.div>
            </div>
          </EditableWrap>
        </div>

        {/* Academic zig-zag edge */}
        <div className="rr-admission-zigzag">
          <div />
        </div>
      </section>

      {/* ======================================================
          CLOSED NOTICE
      ====================================================== */}

      {!isOpen && !settings.hideWhenClosed && (
        <section className="rr-admission-closed">
          <div className="rr-admission-shell">
            <EditableWrap
              editMode={editMode}
              target={{ type: "closedBanner" }}
              onEditTarget={onEditTarget}
              label="Edit Closed Banner"
            >
              <div className="rr-admission-closed-icon">
                <Lock size={25} />
              </div>

              <div>
                <div className="rr-admission-small-label">
                  <span />
                  Admission Status
                </div>
                <h2>{settings.closedTitle}</h2>
                <p>{settings.closedDescription}</p>
              </div>

              <button
                type="button"
                onClick={() => scrollToSection("rr-admission-contact")}
              >
                {settings.closedButtonText}
                <ArrowRight size={15} />
              </button>
            </EditableWrap>
          </div>
        </section>
      )}

      {/* ======================================================
          WHY RED ROSE
      ====================================================== */}

      <section className="rr-admission-section rr-admission-why">
        <div className="rr-admission-shell">
          <EditableWrap
            editMode={editMode}
            target={{ type: "whyUsHeader" }}
            onEditTarget={onEditTarget}
            label="Edit Why Us Headings"
          >
            <SectionHeading
              badge={settings.whyUsBadge}
              title={settings.whyUsTitle}
              description={settings.whyUsDescription}
            />
          </EditableWrap>

          <SectionAddButton
            editMode={editMode}
            type="whyUs"
            onAddTarget={onAddTarget}
            label="Add Why Us Card"
          />

          <div className="rr-admission-why-grid">
            {whyUsList.map((item, index) => (
              <EditableWrap
                key={item.id || index}
                editMode={editMode}
                target={{ type: "whyUsCard", index }}
                onEditTarget={onEditTarget}
                onDeleteTarget={onDeleteTarget}
                canDelete={whyUsList.length > 1}
                label="Edit Why Us card"
              >
                <motion.article
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.12 }}
                  transition={{ duration: 0.5, delay: index * 0.06 }}
                  className="rr-admission-feature"
                >
                  <div className="rr-admission-feature-number">
                    0{index + 1}
                  </div>

                  <div className="rr-admission-feature-icon">
                    <DynamicIcon name={item.icon} size={22} defaultIcon={Award} />
                  </div>

                  <h3>{item.title}</h3>

                  <p>{item.desc}</p>

                  <div className="rr-admission-feature-line" />
                </motion.article>
              </EditableWrap>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================
          ADMISSION PROCESS
      ====================================================== */}

      <section className="rr-admission-process">
        <div className="rr-admission-process-pattern" />

        <div className="rr-admission-shell">
          <EditableWrap
            editMode={editMode}
            target={{ type: "processHeader" }}
            onEditTarget={onEditTarget}
            label="Edit Process Headings"
          >
            <SectionHeading
              badge={settings.processBadge}
              title={settings.processTitle}
              description={settings.processDescription}
              light
            />
          </EditableWrap>

          <SectionAddButton
            editMode={editMode}
            type="process"
            onAddTarget={onAddTarget}
            label="Add Process Step"
          />

          <div className="rr-admission-timeline">
            {timelineList.map((step, index) => (
              <EditableWrap
                key={step.id || index}
                editMode={editMode}
                target={{ type: "processStep", index }}
                onEditTarget={onEditTarget}
                onDeleteTarget={onDeleteTarget}
                canDelete={timelineList.length > 1}
                label="Edit admission process step"
              >
                <motion.div
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.45, delay: index * 0.07 }}
                  className="rr-admission-step"
                >
                  <div className="rr-admission-step-number">
                    {step.number || `0${index + 1}`}
                  </div>

                  {index < timelineList.length - 1 && (
                    <div className="rr-admission-step-connector" />
                  )}

                  <div className="rr-admission-step-copy">
                    <span>STEP {index + 1}</span>
                    <h3>{step.title}</h3>
                    <p>{step.desc}</p>
                  </div>
                </motion.div>
              </EditableWrap>
            ))}
          </div>
        </div>

        <div className="rr-admission-process-zigzag">
          <div />
        </div>
      </section>

      {/* ======================================================
          ELIGIBILITY
      ====================================================== */}

      <section className="rr-admission-section rr-admission-eligibility">
        <div className="rr-admission-shell">
          <EditableWrap
            editMode={editMode}
            target={{ type: "eligibilityHeader" }}
            onEditTarget={onEditTarget}
            label="Edit Eligibility Headings"
          >
            <SectionHeading
              badge={settings.eligibilityBadge}
              title={settings.eligibilityTitle}
              description={settings.eligibilityDescription}
            />
          </EditableWrap>

          <SectionAddButton
            editMode={editMode}
            type="eligibility"
            onAddTarget={onAddTarget}
            label="Add Eligibility Card"
          />

          <div className="rr-admission-eligibility-grid">
            {eligibilityList.map((item, index) => (
              <EditableWrap
                key={item.id || index}
                editMode={editMode}
                target={{ type: "eligibilityCard", index }}
                onEditTarget={onEditTarget}
                onDeleteTarget={onDeleteTarget}
                canDelete={eligibilityList.length > 1}
                label="Edit eligibility"
              >
                <motion.article
                  initial={{ opacity: 0, x: index % 2 === 0 ? -18 : 18 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="rr-admission-eligibility-card"
                >
                  <div className="rr-admission-eligibility-icon">
                    <GraduationCap size={23} />
                  </div>

                  <div className="rr-admission-eligibility-copy">
                    <div className="rr-admission-grade-row">
                      <h3>{item.grade}</h3>
                      {item.age && <span>AGE {item.age}</span>}
                    </div>

                    <p>{item.requirements}</p>

                    <div className="rr-admission-check">
                      <CircleCheck size={14} />
                      Admission requirement
                    </div>
                  </div>
                </motion.article>
              </EditableWrap>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================
          FEES
      ====================================================== */}

      <section className="rr-admission-fees">
        <div className="rr-admission-shell">
          <EditableWrap
            editMode={editMode}
            target={{ type: "fees" }}
            onEditTarget={onEditTarget}
            label="Edit Fee Card"
          >
            <div className="rr-admission-fee-card">
              <div className="rr-admission-fee-decoration">
                <span />
                <span />
                <span />
              </div>

              <div className="rr-admission-fee-icon">
                <FileText size={25} />
              </div>

              <div className="rr-admission-small-label light">
                <span />
                {settings.feeBadge}
              </div>

              <h2>{settings.feeTitle}</h2>

              <p>{settings.feeDescription}</p>

              {settings.feeStructureUrl ? (
                <a
                  href={settings.feeStructureUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rr-admission-fee-btn"
                >
                  <Download size={17} />
                  {settings.feeButtonText}
                  <ArrowRight size={16} />
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => scrollToSection("rr-admission-contact")}
                  className="rr-admission-fee-btn"
                >
                  <Phone size={17} />
                  {settings.feeRequestButtonText}
                  <ArrowRight size={16} />
                </button>
              )}
            </div>
          </EditableWrap>
        </div>
      </section>

      {/* ======================================================
          FAQ
      ====================================================== */}

      <section className="rr-admission-section rr-admission-faq">
        <div className="rr-admission-shell">
          <EditableWrap
            editMode={editMode}
            target={{ type: "faqHeader" }}
            onEditTarget={onEditTarget}
            label="Edit FAQ Headings"
          >
            <SectionHeading
              badge={settings.faqsBadge}
              title={settings.faqsTitle}
              description={settings.faqsDescription}
            />
          </EditableWrap>

          <SectionAddButton
            editMode={editMode}
            type="faq"
            onAddTarget={onAddTarget}
            label="Add FAQ"
          />

          <div className="rr-admission-faq-list">
            {faqsList.map((faq, index) => {
              const expanded = openFaq === index;

              return (
                <EditableWrap
                  key={faq.id || index}
                  editMode={editMode}
                  target={{ type: "faqItem", index }}
                  onEditTarget={onEditTarget}
                  onDeleteTarget={onDeleteTarget}
                  canDelete={faqsList.length > 1}
                  label="Edit FAQ"
                >
                  <div className={`rr-admission-faq-item ${expanded ? "expanded" : ""}`}>
                    <button type="button" onClick={() => setOpenFaq(expanded ? null : index)}>
                      <span>
                        <HelpCircle size={18} />
                        {faq.question}
                      </span>
                      <ChevronDown size={18} className={expanded ? "rotate" : ""} />
                    </button>

                    <AnimatePresence initial={false}>
                      {expanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22 }}
                          className="rr-admission-faq-answer"
                        >
                          <p>{faq.answer}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </EditableWrap>
              );
            })}
          </div>
        </div>
      </section>

      {/* ======================================================
          CONTACT
      ====================================================== */}

      <section id="rr-admission-contact" className="rr-admission-contact">
        <div className="rr-admission-shell">
          <EditableWrap
            editMode={editMode}
            target={{ type: "contact" }}
            onEditTarget={onEditTarget}
            label="Edit Contact Section"
          >
            <SectionHeading
              badge={settings.contactBadge}
              title={settings.contactTitle}
              description={settings.contactDescription}
            />

            <div className="rr-admission-contact-grid">
              <a
                href="tel:+97757590144"
                className="rr-admission-contact-card"
              >
                <div className="rr-admission-contact-icon phone">
                  <Phone size={21} />
                </div>
                <span>Call the School</span>
                <h3>{settings.contactPhone || "057-590144, 057-590145"}</h3>
                <small>
                  Speak with our admissions office
                  <ArrowRight size={13} />
                </small>
              </a>

              <a
                href={`mailto:${settings.contactEmail || "inforedroseschool@gmail.com"}`}
                className="rr-admission-contact-card"
              >
                <div className="rr-admission-contact-icon email">
                  <Mail size={21} />
                </div>
                <span>Email Admissions</span>
                <h3 className="email-text">
                  {settings.contactEmail || "inforedroseschool@gmail.com"}
                </h3>
                <small>
                  Send us your questions
                  <ArrowRight size={13} />
                </small>
              </a>

              <div className="rr-admission-contact-card">
                <div className="rr-admission-contact-icon hours">
                  <Clock3 size={21} />
                </div>
                <span>Office Hours</span>
                <h3>{settings.contactHours || "Sun - Fri: 8:00 AM - 4:00 PM"}</h3>
                <small>Admissions support available</small>
              </div>

              <a
                href="https://www.google.com/maps/place/Red+Rose+English+Boarding+School/@27.3787422,85.0771236,983m/data=!3m1!1e3!4m14!1m7!3m6!1s0x39eb48cf3ad13d91:0x7905f4bf995fafde!2sRed+Rose+English+Boarding+School!8m2!3d27.3787422!4d85.0796985!16s%2Fg%2F11hc_dz_zg!3m5!1s0x39eb48cf3ad13d91:0x7905f4bf995fafde!8m2!3d27.3787422!4d85.0796985!16s%2Fg%2F11hc_dz_zg?entry=ttu"
                target="_blank"
                rel="noopener noreferrer"
                className="rr-admission-contact-card"
              >
                <div className="rr-admission-contact-icon location">
                  <MapPin size={21} />
                </div>
                <span>School Location</span>
                <h3>{settings.contactAddress || "Basudev Marga, Hetauda-2, Makawanpur, Nepal"}</h3>
                <small>
                  Open Google Maps
                  <ArrowRight size={13} />
                </small>
              </a>
            </div>
          </EditableWrap>
        </div>
      </section>

      {/* ======================================================
          FINAL CTA
          Shares the "contact" target with the section above — one
          save button publishes both the contact info and this
          closing call-to-action together.
      ====================================================== */}

      <section className="rr-admission-final">
        <div className="rr-admission-final-pattern" />

        <div className="rr-admission-final-inner">
          <EditableWrap
            editMode={editMode}
            target={{ type: "contact" }}
            onEditTarget={onEditTarget}
            label="Edit CTA Section"
          >
            <div className="rr-admission-final-badge">
              <BookOpen size={16} />
              Begin the Journey
            </div>

            <h2>{settings.ctaTitle}</h2>

            <p>{settings.ctaDescription}</p>

            {isOpen ? (
              <button
                type="button"
                onClick={openAdmissionForm}
                className="rr-admission-primary-btn final"
              >
                {settings.ctaButtonText}
                <ArrowRight size={17} />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => scrollToSection("rr-admission-contact")}
                className="rr-admission-final-contact-btn"
              >
                {settings.ctaClosedButtonText}
                <Phone size={16} />
              </button>
            )}
          </EditableWrap>
        </div>
      </section>

      {/* ======================================================
          FLOATING APPLY BUTTON
      ====================================================== */}

      {isOpen && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          type="button"
          onClick={openAdmissionForm}
          className="rr-admission-floating"
        >
          <Sparkles size={15} />
          Apply Now
          <ArrowRight size={15} />
        </motion.button>
      )}

      {/* ======================================================
          ADMISSION FORM MODAL
      ====================================================== */}

      <AnimatePresence>
        {isFormModalOpen && (
          <div className="rr-admission-modal-backdrop">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 18 }}
              transition={{ duration: 0.25 }}
              className="rr-admission-modal"
            >
              <button
                type="button"
                onClick={() => setIsFormModalOpen(false)}
                className="rr-admission-modal-close"
                aria-label="Close admission form"
              >
                <X size={18} />
              </button>

              <div className="rr-admission-modal-top">
                <div className="rr-admission-modal-mark">
                  <GraduationCap size={23} />
                </div>

                <div>
                  <div className="rr-admission-small-label">
                    <span />
                    Admission Inquiry
                  </div>

                  <h2>Student Admission Inquiry</h2>

                  <p>
                    Please provide the required student and parent information.
                    Our admission team will contact you.
                  </p>
                </div>
              </div>

              {submitSuccess ? (
                <div className="rr-admission-success">
                  <div>
                    <CheckCircle2 size={29} />
                  </div>

                  <h3>Inquiry Submitted Successfully!</h3>

                  <p>{submitSuccess}</p>

                  <div className="rr-admission-success-actions">
                    <button type="button" onClick={() => setSubmitSuccess(null)} className="secondary">Submit Another</button>
                    <button type="button" onClick={() => setIsFormModalOpen(false)} className="primary">Close</button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="rr-admission-form">
                  {submitError && (
                    <div className="rr-admission-form-error">
                      <AlertCircle size={18} />
                      {submitError}
                    </div>
                  )}

                  {/* STUDENT */}
                  <div className="rr-admission-form-section">
                    <div className="rr-admission-form-section-title">
                      <GraduationCap size={18} />
                      <span>Student Details</span>
                    </div>
                    <div className="rr-admission-form-grid three">
                      <label><span>Student Full Name *</span><input type="text" name="studentName" required value={formData.studentName} onChange={handleChange} placeholder="e.g. Aarav Sharma" /></label>
                      <label><span>Date of Birth</span><input type="date" name="dob" value={formData.dob} onChange={handleChange} /></label>
                      <label><span>Gender</span><select name="gender" value={formData.gender} onChange={handleChange}><option>Male</option><option>Female</option><option>Other</option></select></label>
                      <label><span>Applying for Class *</span><select name="applyingClass" required value={formData.applyingClass} onChange={handleChange}> {["Play Group","Nursery","LKG","UKG","Grade 1","Grade 2","Grade 3","Grade 4","Grade 5","Grade 6","Grade 7","Grade 8","Grade 9"].map((item) => <option key={item} value={item}>{item}</option>)} </select></label>
                      <label><span>Academic Session</span><input type="text" name="academicSession" value={formData.academicSession} onChange={handleChange} /></label>
                      <label><span>Previous School</span><input type="text" name="prevSchoolName" value={formData.prevSchoolName} onChange={handleChange} placeholder="If applicable" /></label>
                    </div>
                  </div>

                  {/* PARENT */}
                  <div className="rr-admission-form-section">
                    <div className="rr-admission-form-section-title">
                      <Users size={18} />
                      <span>Parent / Guardian Details</span>
                    </div>
                    <div className="rr-admission-form-grid three">
                      <label><span>Parent Full Name *</span><input type="text" name="parentName" required value={formData.parentName} onChange={handleChange} placeholder="Parent / Guardian name" /></label>
                      <label><span>Relationship</span><select name="relationship" value={formData.relationship} onChange={handleChange}><option>Father</option><option>Mother</option><option>Guardian</option></select></label>
                      <label><span>Mobile Number *</span><input type="tel" name="mobile" required value={formData.mobile} onChange={handleChange} placeholder="+977 98XXXXXXXX" /></label>
                      <label className="span-three"><span>Email Address *</span><input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="parent@example.com" /></label>
                    </div>
                  </div>

                  {/* ADDRESS */}
                  <div className="rr-admission-form-section">
                    <div className="rr-admission-form-section-title">
                      <MapPin size={18} />
                      <span>Address Details</span>
                    </div>
                    <div className="rr-admission-form-grid three">
                      <label><span>District</span><input type="text" name="district" value={formData.district} onChange={handleChange} /></label>
                      <label><span>City</span><input type="text" name="city" value={formData.city} onChange={handleChange} /></label>
                      <label><span>Ward</span><input type="text" name="ward" value={formData.ward} onChange={handleChange} /></label>
                      <label className="span-three"><span>Full Address *</span><input type="text" name="fullAddress" required value={formData.fullAddress} onChange={handleChange} placeholder="Tole / House Number / Landmark" /></label>
                    </div>
                  </div>

                  {/* OPTIONS */}
                  <div className="rr-admission-form-section">
                    <div className="rr-admission-form-section-title">
                      <HeartHandshake size={18} />
                      <span>Additional Information</span>
                    </div>
                    <div className="rr-admission-options">
                      <label><input type="checkbox" name="transportRequired" checked={formData.transportRequired} onChange={handleChange} /><Bus size={18} /><span>School Bus Transport Required</span></label>
                      <label><input type="checkbox" name="hostelRequired" checked={formData.hostelRequired} onChange={handleChange} /><Home size={18} /><span>Hostel Facility Required</span></label>
                    </div>
                    <label className="rr-admission-message-field">
                      <span>Questions or Message</span>
                      <textarea name="message" rows={4} value={formData.message} onChange={handleChange} placeholder="Write your question or message..." />
                    </label>
                  </div>

                  <div className="rr-admission-form-footer">
                    <div><ShieldCheck size={16} /> Your information is used only for admission communication.</div>
                    <div className="rr-admission-form-actions">
                      <button type="button" onClick={() => setIsFormModalOpen(false)} className="cancel">Cancel</button>
                      <button type="submit" disabled={submitting} className="submit">{submitting ? "Submitting..." : "Submit Admission Inquiry"}{!submitting && <ArrowRight size={16} />}</button>
                    </div>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================
          COMPLETE PAGE CSS
      ====================================================== */}

      <style>{`
        .red-rose-admissions {
          --rr-burgundy: #24131f;
          --rr-burgundy-2: #4b1c31;
          --rr-rose: #a62b4f;
          --rr-gold: #c79a3b;
          --rr-gold-light: #e5c878;
          --rr-cream: #fbf7ef;
          --rr-paper: #fffaf3;
          --rr-paper-2: #f2e8dc;
          --rr-text: #211824;
          --rr-muted: #786c72;
          --rr-line: #e3d7cb;

          min-height: 100vh;
          overflow-x: hidden;
          color: var(--rr-text);
          background: var(--rr-cream);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .rr-admission-shell {
          position: relative;
          width: min(1140px, calc(100% - 32px));
          margin: 0 auto;
        }

        .rr-admission-loading {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          color: var(--rr-burgundy);
          background: var(--rr-cream);
        }

        .rr-admission-loader {
          width: 40px;
          height: 40px;
          border: 4px solid #e6d8ca;
          border-top-color: var(--rr-gold);
          border-radius: 50%;
          animation: rrAdmissionSpin .8s linear infinite;
        }

        .rr-admission-loading p { margin: 0; font-size: 12px; font-weight: 800; }

        @keyframes rrAdmissionSpin { to { transform: rotate(360deg); } }

        /* HERO */
        .rr-admission-hero {
          position: relative;
          min-height: 650px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: radial-gradient(circle at 13% 30%, rgba(199,154,59,.14), transparent 25%), radial-gradient(circle at 86% 70%, rgba(166,43,79,.23), transparent 30%), linear-gradient(135deg, #24131f 0%, #361725 48%, #531f37 100%);
        }

        .rr-admission-pattern, .rr-admission-process-pattern, .rr-admission-final-pattern {
          position: absolute;
          inset: 0;
          opacity: .09;
          pointer-events: none;
          background-image: radial-gradient(circle, white 1px, transparent 1.2px);
          background-size: 19px 19px;
        }

        .rr-admission-hero::before {
          content: "";
          position: absolute;
          width: 520px;
          height: 520px;
          left: -270px;
          top: -230px;
          border: 1px solid rgba(229,200,120,.12);
          border-radius: 50%;
          box-shadow: 0 0 0 60px rgba(229,200,120,.025), 0 0 0 120px rgba(229,200,120,.018);
        }

        .rr-admission-hero::after {
          content: "";
          position: absolute;
          width: 570px;
          height: 570px;
          right: -290px;
          bottom: -350px;
          border: 1px solid rgba(229,200,120,.1);
          border-radius: 50%;
          box-shadow: 0 0 0 65px rgba(229,200,120,.025), 0 0 0 130px rgba(229,200,120,.015);
        }

        .rr-admission-glow { position: absolute; border-radius: 50%; pointer-events: none; filter: blur(8px); }
        .rr-admission-glow.glow-left { width: 260px; height: 260px; left: 12%; bottom: 5%; background: rgba(199,154,59,.05); box-shadow: 0 0 120px rgba(199,154,59,.15); }
        .rr-admission-glow.glow-right { width: 300px; height: 300px; right: 12%; top: 12%; background: rgba(166,43,79,.08); box-shadow: 0 0 140px rgba(166,43,79,.2); }

        .rr-admission-hero-inner { position: relative; z-index: 4; width: min(900px, calc(100% - 32px)); padding: 115px 0 105px; text-align: center; }

        .rr-admission-hero-kicker { display: flex; align-items: center; justify-content: center; gap: 11px; color: #e5cc91; font-size: 10px; font-weight: 900; letter-spacing: .24em; text-transform: uppercase; }
        .rr-admission-hero-kicker span { width: 28px; height: 1px; background: var(--rr-gold); }

        .rr-admission-status-row { display: flex; justify-content: center; align-items: center; flex-wrap: wrap; gap: 9px; margin-top: 22px; }
        .rr-admission-status, .rr-admission-session { display: inline-flex; align-items: center; gap: 8px; padding: 9px 13px; border-radius: 999px; font-size: 9px; font-weight: 900; letter-spacing: .09em; text-transform: uppercase; backdrop-filter: blur(10px); }
        .rr-admission-status { border: 1px solid rgba(113,196,143,.3); color: #bde8ca; background: rgba(42,112,67,.17); }
        .rr-admission-status.closed { border-color: rgba(230,117,133,.3); color: #ffc7d0; background: rgba(141,35,56,.2); }
        .rr-admission-status i { width: 7px; height: 7px; border-radius: 50%; background: #73d38d; }
        .rr-admission-status.closed i { background: #e97689; }
        .rr-admission-status i.pulse { animation: rrAdmissionPulse 1.6s ease-in-out infinite; }

        @keyframes rrAdmissionPulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(115,211,141,.35); } 50% { box-shadow: 0 0 0 6px rgba(115,211,141,0); } }

        .rr-admission-session { color: #e9d7a6; border: 1px solid rgba(229,200,120,.19); background: rgba(255,255,255,.045); }
        .rr-admission-session svg { color: var(--rr-gold-light); }

        .rr-admission-hero h1 { max-width: 880px; margin: 24px auto 0; color: white; font-family: Georgia, "Times New Roman", serif; font-size: clamp(49px, 7.4vw, 79px); line-height: .98; letter-spacing: -.055em; font-weight: 700; }
        .rr-admission-title-rule { display: flex; align-items: center; justify-content: center; gap: 7px; margin: 26px auto 0; }
        .rr-admission-title-rule i { width: 5px; height: 5px; border-radius: 50%; background: var(--rr-gold); }
        .rr-admission-title-rule span { width: 72px; height: 2px; background: linear-gradient(90deg, transparent, var(--rr-gold), transparent); }
        .rr-admission-hero-inner > p { max-width: 690px; margin: 25px auto 0; color: rgba(255,255,255,.68); font-size: 14px; line-height: 1.9; }

        .rr-admission-hero-actions { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 10px; margin-top: 34px; }
        .rr-admission-primary-btn, .rr-admission-light-btn, .rr-admission-outline-btn, .rr-admission-locked-btn { min-height: 47px; display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 0 18px; border-radius: 11px; font-size: 10px; font-weight: 900; text-decoration: none; cursor: pointer; transition: transform .2s ease, box-shadow .2s ease, background .2s ease; }
        .rr-admission-primary-btn { border: 1px solid #e2bb54; color: #2d2119; background: linear-gradient(135deg, #f3d47e, #c99b3d); box-shadow: 0 12px 28px rgba(0,0,0,.18); }
        .rr-admission-primary-btn:hover { transform: translateY(-2px); box-shadow: 0 16px 34px rgba(0,0,0,.24); }
        .rr-admission-light-btn { color: #2c1d25; background: #fffaf2; border: 1px solid #e8d9c8; box-shadow: 0 8px 20px rgba(0,0,0,.08); }
        .rr-admission-light-btn:hover, .rr-admission-outline-btn:hover { transform: translateY(-2px); }
        .rr-admission-outline-btn { color: #f7eee3; background: rgba(255,255,255,.045); border: 1px solid rgba(255,255,255,.18); backdrop-filter: blur(8px); }
        .rr-admission-outline-btn:hover { background: rgba(255,255,255,.08); }
        .rr-admission-locked-btn { color: #ffd3da; background: rgba(145,40,59,.25); border: 1px solid rgba(239,137,153,.22); cursor: not-allowed; }

        .rr-admission-hero-foot { display: flex; justify-content: center; align-items: center; gap: 19px; margin-top: 34px; }
        .rr-admission-hero-foot > div { display: flex; align-items: center; gap: 8px; color: #d7c38a; }
        .rr-admission-hero-foot strong { font-family: Georgia, "Times New Roman", serif; font-size: 26px; line-height: 1; }
        .rr-admission-hero-foot span { font-size: 8px; font-weight: 900; letter-spacing: .2em; }
        .rr-admission-hero-foot p { display: inline-flex; align-items: center; gap: 7px; margin: 0; color: rgba(255,255,255,.52); font-size: 9px; font-weight: 700; }
        .rr-admission-hero-foot p svg { color: var(--rr-gold-light); }

        .rr-admission-zigzag, .rr-admission-process-zigzag { position: absolute; z-index: 5; left: 0; right: 0; bottom: -1px; height: 34px; overflow: hidden; }
        .rr-admission-zigzag div, .rr-admission-process-zigzag div { width: 100%; height: 100%; background: var(--rr-cream); clip-path: polygon(0 40%, 4% 100%, 8% 40%, 12% 100%, 16% 40%, 20% 100%, 24% 40%, 28% 100%, 32% 40%, 36% 100%, 40% 40%, 44% 100%, 48% 40%, 52% 100%, 56% 40%, 60% 100%, 64% 40%, 68% 100%, 72% 40%, 76% 100%, 80% 40%, 84% 100%, 88% 40%, 92% 100%, 96% 40%, 100% 100%, 100% 100%, 0 100%); }

        /* COMMON HEADINGS */
        .rr-admission-heading { max-width: 710px; margin: 0 auto 48px; text-align: center; }
        .rr-admission-heading.light { color: white; }
        .rr-admission-small-label { display: inline-flex; align-items: center; gap: 8px; color: var(--rr-rose); font-size: 9px; font-weight: 900; letter-spacing: .2em; text-transform: uppercase; }
        .rr-admission-small-label span { width: 27px; height: 1px; background: var(--rr-gold); }
        .rr-admission-heading.light .rr-admission-small-label { color: #dbc58b; }
        .rr-admission-heading h2 { margin: 13px 0 13px; color: var(--rr-text); font-family: Georgia, "Times New Roman", serif; font-size: clamp(35px, 5vw, 51px); line-height: 1; letter-spacing: -.045em; }
        .rr-admission-heading.light h2 { color: white; }
        .rr-admission-heading p { max-width: 650px; margin: 0 auto; color: var(--rr-muted); font-size: 12px; line-height: 1.85; }
        .rr-admission-heading.light p { color: rgba(255,255,255,.6); }

        /* CLOSED */
        .rr-admission-closed { padding: 27px 0; border-bottom: 1px solid #e8d6da; background: #fff2f4; }
        .rr-admission-closed .rr-admission-shell { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 19px; }
        .rr-admission-closed-icon { width: 55px; height: 55px; display: flex; align-items: center; justify-content: center; border-radius: 16px; color: var(--rr-rose); background: #f8dfe4; }
        .rr-admission-closed h2 { margin: 6px 0 4px; color: var(--rr-text); font-family: Georgia, "Times New Roman", serif; font-size: 25px; }
        .rr-admission-closed p { margin: 0; max-width: 680px; color: var(--rr-muted); font-size: 11px; line-height: 1.6; }
        .rr-admission-closed button { display: inline-flex; align-items: center; gap: 7px; padding: 11px 15px; border: 1px solid #dcb2bc; border-radius: 10px; color: #6e2337; background: white; cursor: pointer; font-size: 9px; font-weight: 900; }

        /* SECTIONS */
        .rr-admission-section { position: relative; padding: 94px 0; background: var(--rr-cream); }
        .rr-admission-why { background: radial-gradient(circle at 7% 30%, rgba(166,43,79,.045), transparent 24%), radial-gradient(circle at 93% 72%, rgba(199,154,59,.07), transparent 25%), var(--rr-cream); }

        /* WHY CARDS */
        .rr-admission-why-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; }
        .rr-admission-feature { position: relative; min-height: 265px; overflow: hidden; padding: 25px 22px 23px; border: 1px solid var(--rr-line); border-radius: 19px; background: rgba(255,250,243,.88); box-shadow: 0 9px 30px rgba(50,35,30,.045); transition: transform .28s ease, box-shadow .28s ease, border-color .28s ease; }
        .rr-admission-feature:hover { transform: translateY(-6px); border-color: #d8c39d; box-shadow: 0 19px 45px rgba(50,35,30,.1); }
        .rr-admission-feature-number { position: absolute; right: 17px; top: 10px; color: #c9aa68; opacity: .18; font-family: Georgia, "Times New Roman", serif; font-size: 50px; font-weight: 700; }
        .rr-admission-feature-icon { width: 51px; height: 51px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; border-radius: 14px; color: white; background: linear-gradient(135deg, var(--rr-burgundy), var(--rr-burgundy-2)); box-shadow: 0 9px 19px rgba(36,19,31,.14); }
        .rr-admission-feature h3 { margin: 0 0 9px; color: var(--rr-text); font-family: Georgia, "Times New Roman", serif; font-size: 20px; line-height: 1.1; }
        .rr-admission-feature p { margin: 0; color: var(--rr-muted); font-size: 11px; line-height: 1.75; }
        .rr-admission-feature-line { width: 36px; height: 2px; margin-top: 20px; border-radius: 99px; background: linear-gradient(90deg, var(--rr-rose), var(--rr-gold)); }

        /* PROCESS */
        .rr-admission-process { position: relative; overflow: hidden; padding: 94px 0 104px; color: white; background: radial-gradient(circle at 15% 25%, rgba(199,154,59,.1), transparent 25%), radial-gradient(circle at 87% 75%, rgba(166,43,79,.18), transparent 29%), linear-gradient(135deg, #24131f, #431b2e); }
        .rr-admission-process::before { content: ""; position: absolute; width: 420px; height: 420px; left: -230px; top: 40px; border: 1px solid rgba(229,200,120,.08); border-radius: 50%; }
        .rr-admission-process .rr-admission-shell { z-index: 2; }
        .rr-admission-timeline { position: relative; display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 15px; }
        .rr-admission-step { position: relative; min-height: 220px; padding: 23px 18px; border: 1px solid rgba(255,255,255,.1); border-radius: 18px; background: rgba(255,255,255,.045); backdrop-filter: blur(8px); transition: transform .25s ease, background .25s ease, border-color .25s ease; }
        .rr-admission-step:hover { transform: translateY(-5px); background: rgba(255,255,255,.065); border-color: rgba(229,200,120,.25); }
        .rr-admission-step-number { width: 47px; height: 47px; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(229,200,120,.27); border-radius: 14px; color: var(--rr-gold-light); background: rgba(199,154,59,.08); font-family: Georgia, "Times New Roman", serif; font-size: 18px; font-weight: 700; }
        .rr-admission-step-copy { margin-top: 21px; }
        .rr-admission-step-copy > span { color: #bba97e; font-size: 8px; font-weight: 900; letter-spacing: .16em; }
        .rr-admission-step-copy h3 { margin: 7px 0 8px; color: white; font-family: Georgia, "Times New Roman", serif; font-size: 18px; line-height: 1.1; }
        .rr-admission-step-copy p { margin: 0; color: rgba(255,255,255,.56); font-size: 10px; line-height: 1.7; }
        .rr-admission-step-connector { position: absolute; top: 45px; right: -22px; width: 28px; height: 1px; z-index: 4; background: linear-gradient(90deg, rgba(199,154,59,.55), transparent); }

        /* ELIGIBILITY */
        .rr-admission-eligibility { background: linear-gradient(135deg, #fbf7ef, #f3e9dc); }
        .rr-admission-eligibility-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .rr-admission-eligibility-card { display: flex; gap: 15px; padding: 21px; border: 1px solid var(--rr-line); border-radius: 18px; background: rgba(255,250,243,.88); box-shadow: 0 8px 26px rgba(50,35,30,.04); transition: transform .25s ease, box-shadow .25s ease; }
        .rr-admission-eligibility-card:hover { transform: translateY(-4px); box-shadow: 0 15px 34px rgba(50,35,30,.08); }
        .rr-admission-eligibility-icon { flex: 0 0 auto; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; border-radius: 14px; color: var(--rr-rose); background: #f1dfe4; border: 1px solid #e6ccd3; }
        .rr-admission-eligibility-copy { min-width: 0; flex: 1; }
        .rr-admission-grade-row { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
        .rr-admission-grade-row h3 { margin: 0; color: var(--rr-text); font-family: Georgia, "Times New Roman", serif; font-size: 18px; }
        .rr-admission-grade-row span { flex: 0 0 auto; padding: 5px 8px; border: 1px solid #e5c878; border-radius: 999px; color: #805d1f; background: #fff6d9; font-size: 7px; font-weight: 900; letter-spacing: .07em; }
        .rr-admission-eligibility-copy > p { margin: 8px 0 11px; color: var(--rr-muted); font-size: 10px; line-height: 1.7; }
        .rr-admission-check { display: inline-flex; align-items: center; gap: 5px; color: #7e642f; font-size: 8px; font-weight: 800; }
        .rr-admission-check svg { color: var(--rr-gold); }

        /* FEES */
        .rr-admission-fees { padding: 92px 0; background: var(--rr-cream); }
        .rr-admission-fee-card { position: relative; overflow: hidden; padding: 58px 45px; text-align: center; border-radius: 27px; color: white; background: radial-gradient(circle at 12% 20%, rgba(199,154,59,.14), transparent 28%), radial-gradient(circle at 88% 78%, rgba(166,43,79,.2), transparent 30%), linear-gradient(135deg, #24131f, #4b1c31); box-shadow: 0 25px 60px rgba(45,26,35,.18); }
        .rr-admission-fee-card::before { content: ""; position: absolute; inset: 13px; border: 1px solid rgba(229,200,120,.13); border-radius: 20px; pointer-events: none; }
        .rr-admission-fee-decoration { position: absolute; right: 35px; top: 25px; display: flex; gap: 5px; opacity: .45; }
        .rr-admission-fee-decoration span { width: 5px; height: 5px; border-radius: 50%; background: var(--rr-gold-light); }
        .rr-admission-fee-icon { width: 58px; height: 58px; display: flex; align-items: center; justify-content: center; margin: 0 auto 21px; border: 1px solid rgba(229,200,120,.22); border-radius: 17px; color: var(--rr-gold-light); background: rgba(255,255,255,.055); }
        .rr-admission-fee-card > .rr-admission-small-label { color: #dbc58b; }
        .rr-admission-fee-card h2 { max-width: 700px; margin: 13px auto; color: white; font-family: Georgia, "Times New Roman", serif; font-size: clamp(34px, 5vw, 51px); line-height: 1; letter-spacing: -.04em; }
        .rr-admission-fee-card > p { max-width: 650px; margin: 0 auto; color: rgba(255,255,255,.58); font-size: 11px; line-height: 1.8; }
        .rr-admission-fee-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; margin-top: 28px; padding: 13px 18px; border: 1px solid #e1bb57; border-radius: 11px; color: #2d2119; background: #f0cf76; box-shadow: 0 10px 24px rgba(0,0,0,.15); cursor: pointer; font-size: 9px; font-weight: 900; text-decoration: none; transition: transform .2s ease, background .2s ease; }
        .rr-admission-fee-btn:hover { transform: translateY(-2px); background: #f5d987; }

        /* FAQ */
        .rr-admission-faq { background: radial-gradient(circle at 90% 20%, rgba(199,154,59,.07), transparent 23%), var(--rr-cream); }
        .rr-admission-faq-list { max-width: 840px; margin: 0 auto; display: flex; flex-direction: column; gap: 10px; }
        .rr-admission-faq-item { overflow: hidden; border: 1px solid var(--rr-line); border-radius: 15px; background: rgba(255,250,243,.85); transition: border-color .2s ease, box-shadow .2s ease; }
        .rr-admission-faq-item.expanded { border-color: #d9c39a; box-shadow: 0 12px 30px rgba(50,35,30,.06); }
        .rr-admission-faq-item > button { width: 100%; min-height: 61px; display: flex; align-items: center; justify-content: space-between; gap: 15px; padding: 15px 19px; border: 0; color: var(--rr-text); background: transparent; cursor: pointer; text-align: left; font-family: inherit; font-size: 11px; font-weight: 900; }
        .rr-admission-faq-item > button > span { display: flex; align-items: center; gap: 10px; }
        .rr-admission-faq-item > button svg:first-child { flex: 0 0 auto; color: var(--rr-rose); }
        .rr-admission-faq-item > button > svg:last-child { flex: 0 0 auto; color: #a79a94; transition: transform .2s ease; }
        .rr-admission-faq-item > button > svg.rotate { transform: rotate(180deg); color: var(--rr-gold); }
        .rr-admission-faq-answer { overflow: hidden; border-top: 1px solid #eee4da; }
        .rr-admission-faq-answer p { margin: 0; padding: 15px 19px 18px 48px; color: var(--rr-muted); font-size: 10px; line-height: 1.8; }

        /* CONTACT */
        .rr-admission-contact { position: relative; padding: 95px 0; background: linear-gradient(135deg, #f2e7da, #fbf7ef); }
        .rr-admission-contact-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; }
        .rr-admission-contact-card { min-height: 190px; display: flex; flex-direction: column; padding: 22px 20px; border: 1px solid var(--rr-line); border-radius: 17px; color: inherit; background: rgba(255,250,243,.9); box-shadow: 0 8px 25px rgba(50,35,30,.04); text-decoration: none; transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease; }
        .rr-admission-contact-card:hover { transform: translateY(-5px); border-color: #d6c29f; box-shadow: 0 16px 35px rgba(50,35,30,.08); }
        .rr-admission-contact-icon { width: 47px; height: 47px; display: flex; align-items: center; justify-content: center; margin-bottom: 17px; border-radius: 14px; }
        .rr-admission-contact-icon.phone { color: #3e7652; background: #e0f0e5; }
        .rr-admission-contact-icon.email { color: #754d6a; background: #eee2eb; }
        .rr-admission-contact-icon.hours { color: #856521; background: #f8edc9; }
        .rr-admission-contact-icon.location { color: var(--rr-rose); background: #f1dfe4; }
        .rr-admission-contact-card > span { color: #80736e; font-size: 8px; font-weight: 900; letter-spacing: .13em; text-transform: uppercase; }
        .rr-admission-contact-card h3 { margin: 7px 0 0; color: var(--rr-text); font-family: Georgia, "Times New Roman", serif; font-size: 16px; line-height: 1.35; }
        .rr-admission-contact-card h3.email-text { font-family: inherit; font-size: 11px; word-break: break-word; }
        .rr-admission-contact-card small { display: inline-flex; align-items: center; gap: 5px; margin-top: auto; padding-top: 15px; color: var(--rr-rose); font-size: 8px; font-weight: 900; }

        /* FINAL CTA */
        .rr-admission-final { position: relative; min-height: 370px; display: flex; align-items: center; justify-content: center; overflow: hidden; background: radial-gradient(circle at 15% 35%, rgba(199,154,59,.11), transparent 25%), radial-gradient(circle at 87% 68%, rgba(166,43,79,.16), transparent 28%), linear-gradient(135deg, #24131f, #4b1c31); }
        .rr-admission-final-inner { position: relative; z-index: 2; width: min(780px, calc(100% - 32px)); padding: 65px 0; text-align: center; }
        .rr-admission-final-badge { display: inline-flex; align-items: center; gap: 7px; color: #dbc58b; font-size: 9px; font-weight: 900; letter-spacing: .18em; text-transform: uppercase; }
        .rr-admission-final-badge svg { color: var(--rr-gold); }
        .rr-admission-final h2 { margin: 15px 0 13px; color: white; font-family: Georgia, "Times New Roman", serif; font-size: clamp(36px, 5vw, 54px); line-height: .98; letter-spacing: -.045em; }
        .rr-admission-final p { max-width: 620px; margin: 0 auto; color: rgba(255,255,255,.6); font-size: 12px; line-height: 1.8; }
        .rr-admission-primary-btn.final { margin-top: 25px; }
        .rr-admission-final-contact-btn { display: inline-flex; align-items: center; gap: 8px; margin-top: 25px; padding: 13px 18px; border: 1px solid rgba(255,255,255,.14); border-radius: 11px; color: white; background: rgba(255,255,255,.06); cursor: pointer; font-size: 9px; font-weight: 900; }

        /* FLOATING BUTTON */
        .rr-admission-floating { position: fixed; z-index: 50; right: 22px; bottom: 22px; display: flex; align-items: center; gap: 7px; min-height: 45px; padding: 0 16px; border: 2px solid #e7c75e; border-radius: 999px; color: #2b2118; background: linear-gradient(135deg, #f4d77e, #c99a3b); box-shadow: 0 13px 32px rgba(36,19,31,.2); cursor: pointer; font-size: 10px; font-weight: 900; transition: transform .2s ease, box-shadow .2s ease; }
        .rr-admission-floating:hover { transform: translateY(-3px); box-shadow: 0 17px 38px rgba(36,19,31,.26); }

        /* MODAL */
        .rr-admission-modal-backdrop { position: fixed; inset: 0; z-index: 99999; display: flex; align-items: center; justify-content: center; padding: 18px; overflow-y: auto; background: rgba(26,16,23,.7); backdrop-filter: blur(9px); }
        .rr-admission-modal { position: relative; width: min(920px, 100%); max-height: 92vh; overflow-y: auto; margin: auto; padding: 31px; border: 1px solid #e2d4c7; border-radius: 24px; background: #fffaf3; box-shadow: 0 30px 90px rgba(0,0,0,.28); }
        .rr-admission-modal::before { content: ""; position: absolute; top: 0; left: 45px; right: 45px; height: 3px; border-radius: 0 0 99px 99px; background: linear-gradient(90deg, var(--rr-rose), var(--rr-gold), var(--rr-rose)); }
        .rr-admission-modal-close { position: absolute; z-index: 4; right: 16px; top: 16px; width: 35px; height: 35px; display: flex; align-items: center; justify-content: center; border: 1px solid #e1d7cd; border-radius: 50%; color: #796d67; background: #f6eee6; cursor: pointer; transition: transform .2s ease, background .2s ease; }
        .rr-admission-modal-close:hover { transform: rotate(6deg); background: #eee2d8; }
        .rr-admission-modal-top { display: flex; align-items: flex-start; gap: 14px; padding-right: 48px; margin-bottom: 26px; }
        .rr-admission-modal-mark { flex: 0 0 auto; width: 51px; height: 51px; display: flex; align-items: center; justify-content: center; border-radius: 14px; color: white; background: linear-gradient(135deg, var(--rr-burgundy), var(--rr-burgundy-2)); }
        .rr-admission-modal-top h2 { margin: 7px 0 5px; color: var(--rr-text); font-family: Georgia, "Times New Roman", serif; font-size: 28px; line-height: 1.05; }
        .rr-admission-modal-top p { margin: 0; color: var(--rr-muted); font-size: 10px; line-height: 1.65; }

        .rr-admission-form { display: flex; flex-direction: column; gap: 24px; }
        .rr-admission-form-error { display: flex; align-items: flex-start; gap: 8px; padding: 12px 14px; border: 1px solid #edcdd2; border-radius: 11px; color: #8a3445; background: #fff0f2; font-size: 10px; font-weight: 700; line-height: 1.5; }
        .rr-admission-form-section { padding-top: 3px; }
        .rr-admission-form-section-title { display: flex; align-items: center; gap: 8px; padding-bottom: 11px; border-bottom: 1px solid #e8ddd3; color: var(--rr-text); font-family: Georgia, "Times New Roman", serif; font-size: 17px; font-weight: 700; }
        .rr-admission-form-section-title svg { color: var(--rr-rose); }
        .rr-admission-form-grid { display: grid; gap: 13px; margin-top: 15px; }
        .rr-admission-form-grid.three { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .rr-admission-form-grid label, .rr-admission-message-field { display: flex; flex-direction: column; gap: 6px; }
        .rr-admission-form-grid label > span, .rr-admission-message-field > span { color: #6e625e; font-size: 8px; font-weight: 900; letter-spacing: .11em; text-transform: uppercase; }
        .rr-admission-form-grid input, .rr-admission-form-grid select, .rr-admission-message-field textarea { width: 100%; box-sizing: border-box; min-height: 43px; padding: 0 11px; border: 1px solid #ded3c9; border-radius: 10px; outline: none; color: var(--rr-text); background: #fffdf9; font-family: inherit; font-size: 11px; transition: border-color .2s ease, box-shadow .2s ease; }
        .rr-admission-message-field textarea { min-height: 105px; padding: 11px; resize: vertical; line-height: 1.6; }
        .rr-admission-form-grid input::placeholder, .rr-admission-message-field textarea::placeholder { color: #b0a49e; }
        .rr-admission-form-grid input:focus, .rr-admission-form-grid select:focus, .rr-admission-message-field textarea:focus { border-color: #bd8e96; box-shadow: 0 0 0 4px rgba(166,43,79,.07); }
        .rr-admission-form-grid .span-three { grid-column: span 3; }
        .rr-admission-options { display: grid; grid-template-columns: 1fr 1fr; gap: 11px; margin-top: 15px; }
        .rr-admission-options label { display: flex; align-items: center; gap: 9px; min-height: 48px; padding: 0 12px; border: 1px solid #e2d7cd; border-radius: 10px; color: #5f5551; background: #f8f1e9; cursor: pointer; font-size: 9px; font-weight: 800; }
        .rr-admission-options input { width: 15px; height: 15px; accent-color: var(--rr-rose); }
        .rr-admission-options svg { color: var(--rr-rose); }
        .rr-admission-message-field { margin-top: 13px; }
        .rr-admission-form-footer { display: flex; align-items: center; justify-content: space-between; gap: 15px; padding-top: 17px; border-top: 1px solid #e7ddd4; }
        .rr-admission-form-footer > div:first-child { display: flex; align-items: center; gap: 7px; max-width: 300px; color: #91847e; font-size: 8px; line-height: 1.5; }
        .rr-admission-form-footer > div:first-child svg { flex: 0 0 auto; color: #6f8d70; }
        .rr-admission-form-actions { display: flex; align-items: center; gap: 8px; }
        .rr-admission-form-actions button { min-height: 42px; padding: 0 15px; border-radius: 10px; cursor: pointer; font-size: 9px; font-weight: 900; }
        .rr-admission-form-actions .cancel { border: 1px solid #ddd3ca; color: #6f6460; background: #f5eee7; }
        .rr-admission-form-actions .submit { display: inline-flex; align-items: center; gap: 7px; border: 1px solid #d9b34d; color: #2c2118; background: linear-gradient(135deg, #f2d477, #c9993b); }
        .rr-admission-form-actions .submit:disabled { opacity: .55; cursor: not-allowed; }

        /* SUCCESS */
        .rr-admission-success { padding: 55px 25px; text-align: center; border: 1px solid #cce3d1; border-radius: 18px; background: #f0f9f1; }
        .rr-admission-success > div:first-child { width: 61px; height: 61px; display: flex; align-items: center; justify-content: center; margin: 0 auto; border-radius: 50%; color: #3c8153; background: #dcefdf; }
        .rr-admission-success h3 { margin: 17px 0 7px; color: #2c4934; font-family: Georgia, "Times New Roman", serif; font-size: 24px; }
        .rr-admission-success p { max-width: 550px; margin: 0 auto; color: #617267; font-size: 11px; line-height: 1.7; }
        .rr-admission-success-actions { display: flex; justify-content: center; gap: 9px; margin-top: 23px; }
        .rr-admission-success-actions button { padding: 10px 14px; border-radius: 9px; cursor: pointer; font-size: 9px; font-weight: 900; }
        .rr-admission-success-actions .secondary { border: 1px solid #c4dcc9; color: #41654b; background: #e4f2e7; }
        .rr-admission-success-actions .primary { border: 1px solid #d7b350; color: #2e241a; background: #f0d176; }

        /* RESPONSIVE */
        @media (max-width: 1050px) {
          .rr-admission-why-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .rr-admission-timeline { grid-template-columns: repeat(3, minmax(0, 1fr)); }
          .rr-admission-step-connector { display: none; }
          .rr-admission-contact-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }

        @media (max-width: 820px) {
          .rr-admission-timeline { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .rr-admission-form-grid.three { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .rr-admission-form-grid .span-three { grid-column: span 2; }
          .rr-admission-closed .rr-admission-shell { grid-template-columns: auto 1fr; }
          .rr-admission-closed button { grid-column: 2; justify-self: start; }
        }

        @media (max-width: 680px) {
          .rr-admission-shell { width: min(100% - 24px, 1140px); }
          .rr-admission-hero { min-height: 620px; }
          .rr-admission-hero-inner { width: calc(100% - 24px); padding: 98px 0 85px; }
          .rr-admission-hero h1 { font-size: clamp(44px, 12vw, 64px); }
          .rr-admission-hero-inner > p { font-size: 12px; }
          .rr-admission-hero-actions { flex-direction: column; }
          .rr-admission-primary-btn, .rr-admission-light-btn, .rr-admission-outline-btn, .rr-admission-locked-btn { width: min(100%, 320px); }
          .rr-admission-hero-foot { flex-direction: column; }
          .rr-admission-section, .rr-admission-contact, .rr-admission-fees { padding: 70px 0; }
          .rr-admission-why-grid, .rr-admission-eligibility-grid, .rr-admission-contact-grid, .rr-admission-timeline { grid-template-columns: 1fr; }
          .rr-admission-feature { min-height: 220px; }
          .rr-admission-grade-row { align-items: flex-start; flex-direction: column; }
          .rr-admission-fee-card { padding: 48px 22px; border-radius: 20px; }
          .rr-admission-modal { padding: 24px 16px; border-radius: 18px; }
          .rr-admission-modal-top { padding-right: 32px; }
          .rr-admission-modal-top h2 { font-size: 23px; }
          .rr-admission-form-grid.three { grid-template-columns: 1fr; }
          .rr-admission-form-grid .span-three { grid-column: span 1; }
          .rr-admission-options { grid-template-columns: 1fr; }
          .rr-admission-form-footer { align-items: stretch; flex-direction: column; }
          .rr-admission-form-actions { width: 100%; }
          .rr-admission-form-actions button { flex: 1; }
          .rr-admission-closed .rr-admission-shell { grid-template-columns: 1fr; }
          .rr-admission-closed button { grid-column: auto; }
          .rr-admission-floating { right: 12px; bottom: 12px; }
        }

        @media (max-width: 430px) {
          .rr-admission-status-row { flex-direction: column; }
          .rr-admission-hero-foot { margin-top: 27px; }
          .rr-admission-heading h2 { font-size: 34px; }
          .rr-admission-contact-card { min-height: 170px; }
          .rr-admission-success-actions { flex-direction: column; }
          .rr-admission-success-actions button { width: 100%; }
        }

        @media (prefers-reduced-motion: reduce) {
          .red-rose-admissions *, .red-rose-admissions *::before, .red-rose-admissions *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; scroll-behavior: auto !important; }
        }
      `}</style>
    </main>
  );
}