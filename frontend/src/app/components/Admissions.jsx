// AdmissionsPage.jsx
import { useEffect, useState, useRef } from "react";
import api from "../../lib/api";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import {
  Pencil,
  Plus,
  Trash2,
  ArrowRight,
  CheckCircle,
  Clock,
  FileText,
  UserCheck,
  Calendar,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Sparkles,
} from "lucide-react";

// ============ UNIQUE COLOR PALETTE ============
const theme = {
  primary: "#0A1628",
  secondary: "#1A5276",
  accent1: "#D4AC0D",
  accent2: "#E67E22",
  accent3: "#1E8449",
  accent4: "#7D3C98",
  light: "#F8F6F0",
  dark: "#0A1628",
  gray: "#5D6D7E",
  lightGray: "#EAE5DE",
  white: "#FFFFFF",
  gradient1: "linear-gradient(135deg, #0A1628 0%, #1A5276 100%)",
  gradient2: "linear-gradient(135deg, #D4AC0D 0%, #E67E22 100%)",
  gradient3: "linear-gradient(135deg, #1E8449 0%, #2E86C1 100%)",
  gradient4: "linear-gradient(135deg, #7D3C98 0%, #2E86C1 100%)",
};

// ============ CONTENT ============
const defaultAdmissionsContent = {
  heroBadge: "Begin Your Journey",
  heroTitle: "Your Future Starts Here",
  heroHighlight: "Starts Here",
  heroSubtitle:
    "Smriti Secondary English Boarding School welcomes students through a clear, transparent admission process designed to help every child thrive.",
  heroDescription:
    "From Play Group to Class IX, we guide families through every step — from inquiry to enrollment — with care, clarity, and a commitment to your child's success.",

  steps: [
    {
      id: 1,
      step: "01",
      title: "Explore & Inquire",
      desc: "Discover our programs and get your questions answered. Contact our admission office or fill out an inquiry form to begin.",
      color: theme.accent1,
      icon: "search",
      visible: true,
    },
    {
      id: 2,
      step: "02",
      title: "Application & Assessment",
      desc: "Complete the application form and schedule a written assessment. We evaluate readiness and potential, not just test scores.",
      color: theme.accent2,
      icon: "clipboard",
      visible: true,
    },
    {
      id: 3,
      step: "03",
      title: "Parent Interview",
      desc: "Meet with our admission team to discuss your child's needs, aspirations, and how we can support their unique journey.",
      color: theme.accent3,
      icon: "users",
      visible: true,
    },
    {
      id: 4,
      step: "04",
      title: "Enrollment & Welcome",
      desc: "Complete the enrollment process, submit required documents, and join the Smriti School community.",
      color: theme.accent4,
      icon: "check",
      visible: true,
    },
  ],

  stats: [
    { value: "98%", label: "Parent Satisfaction", color: theme.accent1 },
    { value: "15+", label: "Years of Excellence", color: theme.accent2 },
    { value: "1000+", label: "Students Enrolled", color: theme.accent3 },
    { value: "40+", label: "Dedicated Faculty", color: theme.accent4 },
  ],

  formTitle: "Start Your Admission Journey",
  formDescription:
    "Complete the form below and our admission team will reach out within 24 hours to guide you through the next steps.",
  nameLabel: "Full Name",
  namePlaceholder: "Enter student or parent name",
  emailLabel: "Email Address",
  emailPlaceholder: "you@example.com",
  phoneLabel: "Phone Number",
  phonePlaceholder: "+977 98XXXXXXXX",
  gradeLabel: "Applying for Grade",
  gradePlaceholder: "Select grade",
  messageLabel: "Additional Notes",
  messagePlaceholder: "Any specific questions or requirements...",
  grades: [
    "Play Group",
    "LKG",
    "UKG",
    "Grade 1",
    "Grade 2",
    "Grade 3",
    "Grade 4",
    "Grade 5",
    "Grade 6",
    "Grade 7",
    "Grade 8",
    "Grade 9",
  ],
  submitButtonText: "Submit Inquiry",
  submittingText: "Submitting...",
  successTitle: "Application Received! 🎉",
  successMessage:
    "Thank you for choosing Smriti School. Our admission team will contact you within 24 hours with next steps.",
};

// ============ MERGE FUNCTION ============
export function mergeAdmissionsContent(saved = {}) {
  const hasSavedSteps = Array.isArray(saved.steps);
  const hasSavedGrades = Array.isArray(saved.grades);

  return {
    ...defaultAdmissionsContent,
    ...saved,
    steps: hasSavedSteps
      ? saved.steps.map((step, index) => ({
          ...step,
          id: step.id ?? `admission-step-${index + 1}`,
          step: step.step ?? String(index + 1).padStart(2, "0"),
          title: step.title ?? "",
          desc: step.desc ?? "",
          color: step.color || [theme.accent1, theme.accent2, theme.accent3, theme.accent4][index % 4],
          visible: true,
        }))
      : defaultAdmissionsContent.steps,
    grades: hasSavedGrades
      ? saved.grades.map((grade) => String(grade ?? ""))
      : defaultAdmissionsContent.grades,
  };
}

// ============ HELPERS ============
function normalizePhone(phone = "") {
  return String(phone).replace(/[^\d+]/g, "").trim();
}

function isValidPhone(phone = "") {
  const cleaned = normalizePhone(phone).replace(/\D/g, "");
  return cleaned.length >= 10 && cleaned.length <= 15;
}

function HighlightedTitle({ title, highlightedText }) {
  if (!highlightedText || !title.includes(highlightedText)) return <>{title}</>;
  const [before, after] = title.split(highlightedText);
  return (
    <>
      {before}
      <span style={{ color: theme.accent1 }}>{highlightedText}</span>
      {after}
    </>
  );
}

// ============ COUNTER COMPONENT ============
const Counter = ({ target, suffix, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = parseInt(target) || 0;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isInView, target, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
};

// ============ ADMIN BUTTONS ============
function AdminEditButton({ label, icon: Icon = Pencil, onClick, tone = "gold" }) {
  const palette = {
    gold: { background: theme.accent1, color: theme.dark },
    green: { background: theme.accent3, color: theme.white },
    red: { background: "#DC2626", color: theme.white },
    dark: { background: theme.dark, color: theme.white },
  };

  return (
    <button
      type="button"
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClick?.(); }}
      className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black shadow-2xl transition-all hover:-translate-y-0.5 hover:scale-105"
      style={palette[tone] || palette.gold}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

// ============ MAIN COMPONENT ============
export default function AdmissionsPage({
  editMode = false,
  contentOverride = null,
  onEditHero = () => {},
  onEditStep = () => {},
  onAddStep = () => {},
  onDeleteStep = () => {},
  onEditForm = () => {},
} = {}) {
  const [loadedContent, setLoadedContent] = useState(
    mergeAdmissionsContent(contentOverride || defaultAdmissionsContent)
  );
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const content = contentOverride ? mergeAdmissionsContent(contentOverride) : loadedContent;

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
  } = useForm();

  useEffect(() => {
    if (contentOverride) return;
    const loadAdmissionsContent = async () => {
      try {
        const res = await api.get(
          "/api/site-content/admissions",
          { timeout: 12000 }
        );
        const savedContent = res.data?.data?.content || {};
        setLoadedContent(mergeAdmissionsContent(savedContent));
      } catch (error) {
        console.error("Admissions content load error:", error);
        setLoadedContent(defaultAdmissionsContent);
      }
    };
    loadAdmissionsContent();
  }, [contentOverride]);

  const onSubmit = async (data) => {
    if (editMode) return;
    setSubmitMessage("");
    setSubmitError("");
    setSubmitted(false);

    const cleanPhone = normalizePhone(data.phone);
    const grade = data.grade || "";
    const extraMessage = String(data.message || "").trim();
    const finalMessage = extraMessage
      ? `Admission inquiry for ${grade}.\n\nMessage: ${extraMessage}`
      : `Admission inquiry for ${grade}.`;

    try {
      await api.post(
        "/api/contact",
        {
          source: "admission",
          name: data.name,
          email: data.email,
          phone: cleanPhone,
          subject: `Admission Inquiry - ${grade}`,
          message: finalMessage,
        },
        { timeout: 15000 }
      );
      setSubmitMessage(content.successMessage);
      setSubmitted(true);
      reset();
    } catch (error) {
      console.error("Admission inquiry submit error:", error);
      setSubmitError(
        error.response?.data?.message ||
          "Inquiry could not be submitted. Please contact the school office directly."
      );
    }
  };

  const visibleSteps = content.steps || [];

  // Get step icon
  const getStepIcon = (iconName) => {
    const icons = {
      search: <FileText size={24} />,
      clipboard: <FileText size={24} />,
      users: <UserCheck size={24} />,
      check: <CheckCircle size={24} />,
    };
    return icons[iconName] || <Clock size={24} />;
  };

  return (
    <section
      className="min-h-screen pt-32 pb-28 relative overflow-hidden"
      style={{ background: theme.light }}
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-[0.04]" style={{ background: theme.secondary }} />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-[0.04]" style={{ background: theme.accent3 }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-[0.02]" style={{ background: theme.accent1 }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* ===== HERO SECTION - DARK THEME ===== */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="relative rounded-3xl p-12 md:p-16 mb-16 overflow-hidden"
          style={{ background: theme.gradient1 }}
        >
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 right-20 w-64 h-64 rounded-full" style={{ background: theme.accent1, filter: "blur(80px)" }} />
            <div className="absolute bottom-20 left-20 w-64 h-64 rounded-full" style={{ background: theme.accent3, filter: "blur(80px)" }} />
          </div>

          <div className="relative z-10 max-w-3xl">
            <span
              className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold mb-5"
              style={{ background: "rgba(212,172,13,0.15)", color: theme.accent1, border: "1px solid rgba(212,172,13,0.3)" }}
            >
              <Sparkles className="w-4 h-4 inline mr-2" />
              {content.heroBadge}
            </span>

            <h1
              className="text-5xl md:text-6xl font-bold leading-tight"
              style={{ color: theme.white, fontFamily: "var(--font-display)", letterSpacing: "-0.03em" }}
            >
              <HighlightedTitle title={content.heroTitle} highlightedText={content.heroHighlight} />
            </h1>

            <p className="text-lg mt-4" style={{ color: "rgba(255,255,255,0.85)" }}>
              {content.heroSubtitle}
            </p>

            <p className="text-base mt-2" style={{ color: "rgba(255,255,255,0.6)" }}>
              {content.heroDescription}
            </p>
          </div>
        </motion.div>

        {/* ===== STATS SECTION ===== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {content.stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="rounded-2xl p-6 text-center bg-white border"
              style={{ borderColor: `${stat.color}20`, boxShadow: "0 4px 22px rgba(0,0,0,0.04)" }}
            >
              <div
                className="text-3xl md:text-4xl font-bold mb-1"
                style={{ color: stat.color }}
              >
                <Counter target={stat.value} suffix="" />
              </div>
              <div className="text-sm font-medium" style={{ color: theme.gray }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* ===== STEPS SECTION ===== */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <span
              className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide mb-4"
              style={{ background: "rgba(26,82,118,0.08)", color: theme.secondary }}
            >
              <Calendar className="w-4 h-4 inline mr-2" />
              Admission Process
            </span>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ color: theme.dark, fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}>
              Your Journey <span style={{ color: theme.accent1 }}>in 4 Steps</span>
            </h2>
            <div className="w-16 h-1 rounded-full mx-auto mt-4" style={{ background: theme.gradient2 }} />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {visibleSteps.map((step, index) => {
              const stepColor = step.color || theme.accent1;
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="relative group"
                >
                  {index < visibleSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-16 left-full w-8 h-0.5" style={{ background: `${stepColor}30` }} />
                  )}

                  <div
                    className="p-6 rounded-2xl h-full transition-all duration-300 hover:-translate-y-2"
                    style={{
                      background: theme.white,
                      border: `1px solid ${stepColor}20`,
                      boxShadow: "0 4px 22px rgba(0,0,0,0.04)",
                    }}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold flex-shrink-0"
                        style={{ background: `${stepColor}15`, color: stepColor }}
                      >
                        {step.step}
                      </div>
                      <div
                        className="flex-1 h-0.5 rounded-full"
                        style={{ background: `linear-gradient(90deg, ${stepColor}, ${stepColor}20)` }}
                      />
                    </div>

                    <h3 className="text-lg font-bold mb-2" style={{ color: theme.dark }}>{step.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: theme.gray }}>{step.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ===== FORM SECTION ===== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <div className="rounded-3xl p-8 md:p-10 bg-white border" style={{ borderColor: theme.lightGray, boxShadow: "0 4px 30px rgba(0,0,0,0.04)" }}>
            <div className="text-center mb-8">
              <span
                className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide mb-4"
                style={{ background: "rgba(212,172,13,0.12)", color: theme.accent1 }}
              >
                <GraduationCap className="w-4 h-4 inline mr-2" />
                Get Started
              </span>
              <h3 className="text-2xl md:text-3xl font-bold" style={{ color: theme.dark, fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}>
                {content.formTitle}
              </h3>
              <p className="text-sm mt-2" style={{ color: theme.gray }}>{content.formDescription}</p>
            </div>

            {submitted ? (
              <div className="py-8 text-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: `${theme.accent3}15` }}>
                  <CheckCircle size={40} style={{ color: theme.accent3 }} />
                </div>
                <h4 className="text-xl font-bold mb-2" style={{ color: theme.dark }}>{content.successTitle}</h4>
                <p className="text-sm" style={{ color: theme.gray }}>{submitMessage || content.successMessage}</p>
                <button
                  type="button"
                  onClick={() => { setSubmitted(false); setSubmitMessage(""); setSubmitError(""); }}
                  className="mt-6 px-6 py-3 rounded-xl font-bold text-white transition-all hover:-translate-y-0.5"
                  style={{ background: theme.gradient2 }}
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={(e) => { if (editMode) { e.preventDefault(); return; } handleSubmit(onSubmit)(e); }} className="space-y-5">
                {submitError && (
                  <div className="p-4 rounded-xl text-sm font-semibold" style={{ background: "rgba(220,38,38,0.08)", color: "#DC2626", border: "1px solid rgba(220,38,38,0.15)" }}>
                    {submitError}
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: theme.dark }}>{content.nameLabel}</label>
                    <input
                      {...register("name", { required: editMode ? false : "Name is required." })}
                      disabled={editMode}
                      placeholder={content.namePlaceholder}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all bg-white border focus:ring-4 disabled:opacity-75"
                      style={{ borderColor: theme.lightGray, color: theme.dark }}
                    />
                    {errors.name?.message && <p className="text-xs font-semibold mt-1" style={{ color: "#DC2626" }}>{errors.name.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: theme.dark }}>{content.emailLabel}</label>
                    <input
                      {...register("email", { required: editMode ? false : "Email is required." })}
                      disabled={editMode}
                      type="email"
                      placeholder={content.emailPlaceholder}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all bg-white border focus:ring-4 disabled:opacity-75"
                      style={{ borderColor: theme.lightGray, color: theme.dark }}
                    />
                    {errors.email?.message && <p className="text-xs font-semibold mt-1" style={{ color: "#DC2626" }}>{errors.email.message}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: theme.dark }}>{content.phoneLabel}</label>
                    <input
                      {...register("phone", {
                        required: editMode ? false : "Phone number is required.",
                        validate: (value) => editMode || isValidPhone(value) || "Please enter a valid phone number.",
                      })}
                      disabled={editMode}
                      type="tel"
                      placeholder={content.phonePlaceholder}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all bg-white border focus:ring-4 disabled:opacity-75"
                      style={{ borderColor: theme.lightGray, color: theme.dark }}
                    />
                    {errors.phone?.message && <p className="text-xs font-semibold mt-1" style={{ color: "#DC2626" }}>{errors.phone.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: theme.dark }}>{content.gradeLabel}</label>
                    <select
                      {...register("grade", { required: editMode ? false : "Please select grade." })}
                      disabled={editMode}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all bg-white border focus:ring-4 disabled:opacity-75"
                      style={{ borderColor: theme.lightGray, color: theme.dark }}
                    >
                      <option value="">{content.gradePlaceholder}</option>
                      {(content.grades || []).map((grade) => (
                        <option key={grade} value={grade}>{grade}</option>
                      ))}
                    </select>
                    {errors.grade?.message && <p className="text-xs font-semibold mt-1" style={{ color: "#DC2626" }}>{errors.grade.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: theme.dark }}>{content.messageLabel}</label>
                  <textarea
                    {...register("message")}
                    disabled={editMode}
                    rows={4}
                    placeholder={content.messagePlaceholder}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all bg-white border focus:ring-4 disabled:opacity-75 resize-none"
                    style={{ borderColor: theme.lightGray, color: theme.dark }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || editMode}
                  className="w-full py-4 rounded-xl font-bold text-white mt-2 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ background: theme.gradient2, boxShadow: "0 8px 30px rgba(212,172,13,0.3)" }}
                >
                  {isSubmitting ? content.submittingText : content.submitButtonText}
                  <ArrowRight size={18} />
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}