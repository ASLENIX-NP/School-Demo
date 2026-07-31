import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { Pencil, Plus, Trash2 } from "lucide-react";

export const colors = {
  red: "#D71920",
  green: "#168A3A",
  purple: "#4B2E83",
  softPurple: "#7C5CC4",
  dark: "#0B1020",
  cream: "#FFF8EE",
};

export const stepColorOptions = [
  "#D71920",
  "#168A3A",
  "#7C5CC4",
  "#38BDF8",
  "#F97316",
  "#4B2E83",
];

export const defaultAdmissionsContent = {
  badgeText: "Admissions",
  title: "Your Journey Starts Here",
  highlightedText: "Starts Here",
  subtitle:
    "Baljagriti Secondary English Boarding School welcomes students through a clear admission process for Play Group, LKG, and classes up to Class IX.",
  steps: [
    {
      id: 1,
      icon: "message",
      step: "01",
      title: "Play Group Admission",
      desc: "Admission opens for Play Group in the month of Magh. Parents can contact the school administration for details.",
      color: "#D71920",
      visible: true,
    },
    {
      id: 2,
      icon: "map",
      step: "02",
      title: "LKG to Class IX",
      desc: "Admission for Lower Kindergarten to Class IX opens from the new academic year in Baishakh.",
      color: "#168A3A",
      visible: true,
    },
    {
      id: 3,
      icon: "file",
      step: "03",
      title: "Written Examination",
      desc: "Interested candidates are selected through a written examination followed by parents or guardians’ interview.",
      color: "#7C5CC4",
      visible: true,
    },
    {
      id: 4,
      icon: "check",
      step: "04",
      title: "Enrollment",
      desc: "Selected students complete enrollment by submitting required documents to the school administration.",
      color: "#168A3A",
      visible: true,
    },
  ],
  formTitle: "Admission Inquiry",
  formDescription:
    "Fill in the form and the school administration will contact you with admission details.",
  nameLabel: "Full Name",
  namePlaceholder: "Student or parent name",
  emailLabel: "Email Address",
  emailPlaceholder: "example@email.com",
  phoneLabel: "Phone Number",
  phonePlaceholder: "+977 98XXXXXXXX",
  gradeLabel: "Applying for Grade",
  gradePlaceholder: "Select grade",
  messageLabel: "Message",
  messagePlaceholder: "Write any admission question or note here...",
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
  successTitle: "Inquiry Submitted!",
  successMessage: "We will contact you soon with admission details.",
};

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
          step:
            step.step ?? String(index + 1).padStart(2, "0"),
          title: step.title ?? "",
          desc: step.desc ?? "",
          color:
            step.color ||
            stepColorOptions[index % stepColorOptions.length],
          visible: true,
        }))
      : defaultAdmissionsContent.steps,
    grades: hasSavedGrades
      ? saved.grades.map((grade) => String(grade ?? ""))
      : defaultAdmissionsContent.grades,
    messageLabel:
      saved.messageLabel ?? defaultAdmissionsContent.messageLabel,
    messagePlaceholder:
      saved.messagePlaceholder ??
      defaultAdmissionsContent.messagePlaceholder,
  };
}

function normalizePhone(phone = "") {
  return String(phone).replace(/[^\d+]/g, "").trim();
}

function isValidPhone(phone = "") {
  const cleaned = normalizePhone(phone);
  const digitsOnly = cleaned.replace(/\D/g, "");

  return digitsOnly.length >= 10 && digitsOnly.length <= 15;
}

function HighlightedTitle({ title, highlightedText }) {
  if (!highlightedText || !title.includes(highlightedText)) {
    return <>{title}</>;
  }

  const [before, after] = title.split(highlightedText);

  return (
    <>
      {before}
      <span style={{ color: colors.red }}>{highlightedText}</span>
      {after}
    </>
  );
}

function ErrorText({ children }) {
  if (!children) return null;

  return (
    <p className="text-xs font-semibold mt-2" style={{ color: colors.red }}>
      {children}
    </p>
  );
}

function AdminEditButton({ label, icon: Icon = Pencil, onClick, tone = "purple" }) {
  const palette = {
    purple: {
      background: "rgba(75,46,131,0.95)",
      color: "#FFFFFF",
    },
    green: {
      background: "rgba(22,138,58,0.95)",
      color: "#FFFFFF",
    },
    red: {
      background: "rgba(215,25,32,0.95)",
      color: "#FFFFFF",
    },
    dark: {
      background: "rgba(11,16,32,0.95)",
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
      className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black shadow-2xl transition-all hover:-translate-y-0.5 hover:scale-105"
      style={palette[tone] || palette.purple}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function EditShell({ editMode, children, className = "", style = {} }) {
  if (!editMode) return children;

  return (
    <div
      className={`relative rounded-[2rem] ${className}`}
      style={{
        outline: "2px dashed rgba(56,189,248,0.75)",
        outlineOffset: "8px",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Admissions({
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

  const content = contentOverride
    ? mergeAdmissionsContent(contentOverride)
    : loadedContent;

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
        const res = await axios.get(
          "https://school-website-backend-ixx2.onrender.com/api/site-content/admissions",
          {
            timeout: 12000,
          }
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
      await axios.post(
        "https://school-website-backend-ixx2.onrender.com/api/contact",
        {
          source: "admission",
          name: data.name,
          email: data.email,
          phone: cleanPhone,
          subject: `Admission Inquiry - ${grade}`,
          message: finalMessage,
        },
        {
          timeout: 15000,
        }
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

  return (
    <section
      id="admissions"
      className="pt-32 pb-28 relative overflow-hidden min-h-screen"
      style={{
        background: `
          radial-gradient(circle at top right, rgba(124,92,196,0.18), transparent 34%),
          radial-gradient(circle at bottom left, rgba(22,138,58,0.14), transparent 32%),
          linear-gradient(180deg, #FFF8EE 0%, #F1ECFF 100%)
        `,
      }}
    >
      <div
        className="absolute top-0 right-0 w-[520px] h-[520px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(75,46,131,0.12), transparent 70%)",
          filter: "blur(8px)",
        }}
      />

      <div
        className="absolute bottom-0 left-0 w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(22,138,58,0.11), transparent 70%)",
          filter: "blur(8px)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {editMode && (
          <div
            className="mb-10 rounded-[2rem] p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            style={{
              background:
                "linear-gradient(145deg, rgba(2,6,23,0.96), rgba(15,23,42,0.9))",
              border: "1px solid rgba(255,255,255,0.14)",
              boxShadow: "0 24px 70px rgba(11,16,32,0.22)",
            }}
          >
            <div>
              <div className="text-white font-black text-lg">
                Admin Admissions Editor Active
              </div>
              <div className="text-white/60 text-sm">
                Edit real page sections directly. Save changes from the admin top bar.
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <AdminEditButton label="Edit Heading" icon={Pencil} onClick={onEditHero} />
              <AdminEditButton label="Add Step" icon={Plus} tone="green" onClick={onAddStep} />
              <AdminEditButton label="Edit Form" icon={Pencil} tone="dark" onClick={onEditForm} />
            </div>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="text-center mb-16 relative group"
        >
          {editMode && (
            <div className="absolute right-0 top-0 z-30">
              <AdminEditButton label="Edit" icon={Pencil} onClick={onEditHero} />
            </div>
          )}

          <EditShell editMode={editMode}>
            <span
              className="inline-flex items-center px-5 py-2 rounded-full text-sm font-bold mb-5"
              style={{
                background: "rgba(215,25,32,0.08)",
                color: colors.red,
                border: "1px solid rgba(215,25,32,0.16)",
              }}
            >
              {content.badgeText}
            </span>

            <h1
              className="text-5xl md:text-7xl leading-tight"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 850,
                color: colors.dark,
                letterSpacing: "-0.055em",
              }}
            >
              <HighlightedTitle
                title={content.title}
                highlightedText={content.highlightedText}
              />
            </h1>

            <p className="max-w-3xl mx-auto mt-6 text-lg md:text-xl text-slate-600 leading-relaxed">
              {content.subtitle}
            </p>
          </EditShell>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {visibleSteps.map((step, index) => {
            const stepColor = step.color || colors.green;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                id={`admission-step-${step.id}`}
                className="relative group"
              >
                {index < visibleSteps.length - 1 && (
                  <div
                    className="hidden lg:block absolute top-12 left-full w-6 h-0.5 z-10"
                    style={{
                      background: `linear-gradient(90deg, ${stepColor}80, transparent)`,
                    }}
                  />
                )}

                {editMode && (
                  <div className="absolute right-4 top-4 z-30 flex flex-wrap gap-2">
                    <AdminEditButton
                      label="Edit"
                      icon={Pencil}
                      onClick={() => onEditStep(step)}
                    />
                    <AdminEditButton
                      label="Delete"
                      icon={Trash2}
                      tone="red"
                      onClick={() => onDeleteStep(step)}
                    />
                  </div>
                )}

                <div
                  className="p-6 rounded-3xl h-full transition-all duration-300 group-hover:-translate-y-2 cursor-default relative"
                  style={{
                    background:
                      "linear-gradient(145deg, rgba(255,255,255,0.97), rgba(255,255,255,0.82))",
                    border: editMode
                      ? `2px dashed ${stepColor}88`
                      : `1px solid ${stepColor}24`,
                    boxShadow:
                      "0 18px 48px rgba(11,16,32,0.075), inset 0 1px 0 rgba(255,255,255,0.85)",
                    backdropFilter: "blur(16px)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = `0 26px 64px rgba(11,16,32,0.14), 0 0 0 1px ${stepColor}22`;
                    e.currentTarget.style.borderColor = `${stepColor}88`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 18px 48px rgba(11,16,32,0.075), inset 0 1px 0 rgba(255,255,255,0.85)";
                    e.currentTarget.style.borderColor = editMode
                      ? `${stepColor}88`
                      : `${stepColor}24`;
                  }}
                >
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <span
                      className="text-sm font-black tracking-widest"
                      style={{ color: stepColor }}
                    >
                      {step.step || String(index + 1).padStart(2, "0")}
                    </span>

                    <div
                      className="w-14 h-1 rounded-full transition-all duration-300 group-hover:w-24"
                      style={{ background: stepColor }}
                    />
                  </div>

                  <h3
                    className="font-black text-2xl mb-4 text-slate-950 leading-tight"
                    style={{
                      fontFamily: "var(--font-display)",
                      letterSpacing: "-0.035em",
                    }}
                  >
                    {step.title}
                  </h3>

                  <p className="text-sm leading-relaxed text-slate-500">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 38 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          className="max-w-3xl mx-auto relative"
        >
          {editMode && (
            <div className="absolute right-4 top-4 z-30">
              <AdminEditButton label="Edit Form" icon={Pencil} onClick={onEditForm} />
            </div>
          )}

          <div
            className="group p-8 md:p-10 rounded-3xl transition-all duration-300"
            style={{
              background:
                "linear-gradient(145deg, rgba(255,255,255,0.97), rgba(255,255,255,0.82))",
              border: editMode
                ? "2px dashed rgba(56,189,248,0.75)"
                : "1px solid rgba(11,16,32,0.08)",
              backdropFilter: "blur(18px)",
              boxShadow:
                "0 24px 70px rgba(11,16,32,0.12), inset 0 1px 0 rgba(255,255,255,0.85)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow =
                "0 32px 86px rgba(11,16,32,0.16), 0 0 0 1px rgba(22,138,58,0.12)";
              e.currentTarget.style.borderColor = editMode
                ? "rgba(56,189,248,0.95)"
                : "rgba(22,138,58,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow =
                "0 24px 70px rgba(11,16,32,0.12), inset 0 1px 0 rgba(255,255,255,0.85)";
              e.currentTarget.style.borderColor = editMode
                ? "rgba(56,189,248,0.75)"
                : "rgba(11,16,32,0.08)";
            }}
          >
            <div
              className="w-20 h-1 rounded-full mb-7 transition-all duration-300 group-hover:w-36"
              style={{
                background: `linear-gradient(90deg, ${colors.red}, ${colors.green})`,
              }}
            />

            <h3
              className="text-3xl mb-2 text-slate-950"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 850,
                letterSpacing: "-0.035em",
              }}
            >
              {content.formTitle}
            </h3>

            <p className="text-sm mb-8 text-slate-500 leading-relaxed">
              {content.formDescription}
            </p>

            {submitted ? (
              <div
                className="py-8 text-center rounded-2xl"
                style={{
                  background: "rgba(22,138,58,0.1)",
                  border: "1px solid rgba(22,138,58,0.2)",
                  boxShadow: "0 16px 42px rgba(22,138,58,0.1)",
                }}
              >
                <div
                  className="w-16 h-1 rounded-full mx-auto mb-5"
                  style={{ background: colors.green }}
                />

                <div className="text-slate-950 font-black text-xl">
                  {content.successTitle}
                </div>

                <div className="text-sm mt-2 text-slate-500">
                  {submitMessage || content.successMessage}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setSubmitMessage("");
                    setSubmitError("");
                  }}
                  className="mt-6 px-5 py-3 rounded-xl font-bold text-white"
                  style={{
                    background: `linear-gradient(135deg, ${colors.purple}, ${colors.green})`,
                  }}
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form
                onSubmit={(event) => {
                  if (editMode) {
                    event.preventDefault();
                    return;
                  }

                  handleSubmit(onSubmit)(event);
                }}
                className="space-y-5"
              >
                {submitError && (
                  <div
                    className="p-4 rounded-xl text-sm font-semibold"
                    style={{
                      background: "rgba(215,25,32,0.1)",
                      color: colors.red,
                      border: "1px solid rgba(215,25,32,0.24)",
                    }}
                  >
                    {submitError}
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-2 text-slate-700">
                      {content.nameLabel}
                    </label>

                    <input
                      {...register("name", {
                        required: editMode ? false : "Name is required.",
                      })}
                      disabled={editMode}
                      placeholder={content.namePlaceholder}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all bg-white border border-slate-200 text-slate-900 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 disabled:opacity-75"
                    />
                    <ErrorText>{errors.name?.message}</ErrorText>
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2 text-slate-700">
                      {content.emailLabel}
                    </label>

                    <input
                      {...register("email", {
                        required: editMode ? false : "Email is required.",
                      })}
                      disabled={editMode}
                      type="email"
                      placeholder={content.emailPlaceholder}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all bg-white border border-slate-200 text-slate-900 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 disabled:opacity-75"
                    />
                    <ErrorText>{errors.email?.message}</ErrorText>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-2 text-slate-700">
                      {content.phoneLabel}
                    </label>

                    <input
                      {...register("phone", {
                        required: editMode ? false : "Phone number is required.",
                        validate: (value) =>
                          editMode ||
                          isValidPhone(value) ||
                          "Please enter a valid phone number.",
                      })}
                      disabled={editMode}
                      type="tel"
                      placeholder={content.phonePlaceholder}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all bg-white border border-slate-200 text-slate-900 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 disabled:opacity-75"
                    />
                    <ErrorText>{errors.phone?.message}</ErrorText>
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2 text-slate-700">
                      {content.gradeLabel}
                    </label>

                    <select
                      {...register("grade", {
                        required: editMode ? false : "Please select grade.",
                      })}
                      disabled={editMode}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all bg-white border border-slate-200 text-slate-900 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 disabled:opacity-75"
                    >
                      <option value="">{content.gradePlaceholder}</option>

                      {(content.grades || []).map((grade) => (
                        <option key={grade} value={grade}>
                          {grade}
                        </option>
                      ))}
                    </select>
                    <ErrorText>{errors.grade?.message}</ErrorText>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2 text-slate-700">
                    {content.messageLabel}
                  </label>

                  <textarea
                    {...register("message")}
                    disabled={editMode}
                    rows={4}
                    placeholder={content.messagePlaceholder}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all bg-white border border-slate-200 text-slate-900 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 resize-none disabled:opacity-75"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || editMode}
                  className="w-full py-4 rounded-xl font-bold text-white mt-2 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    background: `linear-gradient(135deg, ${colors.red}, ${colors.green})`,
                    boxShadow: "0 16px 38px rgba(215,25,32,0.22)",
                  }}
                >
                  {isSubmitting
                    ? content.submittingText
                    : content.submitButtonText}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export { Admissions };
export default Admissions;