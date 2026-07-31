import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { Pencil, Plus, Trash2, X } from "lucide-react";

const colors = {
  red: "#D71920",
  green: "#168A3A",
  purple: "#4B2E83",
  softPurple: "#7C5CC4",
  dark: "#0B1020",
  cream: "#FFF8EE",
  lightGreen: "#EAF7EF",
  lightPurple: "#F1ECFF",
};

const ACCENT_SEQUENCE = [
  colors.red,
  colors.green,
  colors.purple,
  colors.softPurple,
];

const gradeAccent = (index) => ACCENT_SEQUENCE[index % ACCENT_SEQUENCE.length];

export const defaultAcademicsContent = {
  heroBadge: "Nurturing Excellence",
  heroTitle: "Academics at Baljagriti",
  heroHighlight: "Baljagriti",
  heroDescription:
    "Comprehensive education from Play Group to Grade 12 under the National NEB Curriculum. We combine academic excellence, practical learning, critical thinking, and character development to prepare students for lifelong success.",

  programs: [
    {
      id: 1,
      level: "Pre-Primary Level",
      span: "Nursery – KG",
      badgeColor: colors.red,
      border: "rgba(215,25,32,0.15)",
      classes: [
        "English Readiness",
        "Nepali Readiness",
        "Numbers & Counting",
        "Creative Activities",
        "Rhymes & Storytelling",
      ],
      highlight:
        "Early childhood development focused on social, emotional, and cognitive learning.",
      visible: true,
    },
    {
      id: 2,
      level: "Primary Level",
      span: "Grade 1 – 5",
      badgeColor: colors.green,
      border: "rgba(22,138,58,0.15)",
      classes: ["English", "Nepali", "Mathematics", "Science", "Social Studies"],
      highlight:
        "Building deep core foundational understanding with regular continuous assessment.",
      visible: true,
    },
    {
      id: 3,
      level: "Lower Secondary Level",
      span: "Grade 6 – 8",
      badgeColor: colors.purple,
      border: "rgba(75,46,131,0.15)",
      classes: [
        "English",
        "Nepali",
        "Mathematics",
        "Science",
        "Computer Science",
        "Social Studies",
      ],
      highlight:
        "Transitioning into systematic academic paradigms, critical logic, and digital assets.",
      visible: true,
    },
    {
      id: 4,
      level: "Secondary Level",
      span: "Grade 9 – 12",
      badgeColor: colors.dark,
      border: "rgba(11,16,32,0.12)",
      classes: [
        "English",
        "Nepali",
        "Mathematics",
        "Science",
        "Computer Science",
        "Optional Mathematics",
      ],
      highlight:
        "Rigorous academic preparation for SEE and NEB Grade 11–12 learning pathways.",
      visible: true,
    },
  ],

  featuresTitle: "Why Choose Our Academics?",
  featuresDescription:
    "We focus on building balanced learning spaces through precise methodologies, institutional depth, and proven outcomes.",
  features: [
    {
      id: 1,
      emoji: "📚",
      title: "NEB Curriculum",
      desc: "Rigorous alignment with National Education Board standards for universal academic mobility.",
      color: colors.red,
      visible: true,
    },
    {
      id: 2,
      emoji: "💻",
      title: "Smart Classrooms",
      desc: "Equipped with specialized digital projection frameworks and interactive learning resources.",
      color: colors.purple,
      visible: true,
    },
    {
      id: 3,
      emoji: "🔬",
      title: "Science Laboratory",
      desc: "Practical hands-on exploration layouts helping convert theoretical principles into insight.",
      color: colors.green,
      visible: true,
    },
    {
      id: 4,
      emoji: "🖥",
      title: "Computer Lab",
      desc: "Individual system layouts ensuring modern digital literacy and localized computer education.",
      color: colors.purple,
      visible: true,
    },
    {
      id: 5,
      emoji: "👩‍🏫",
      title: "Qualified Teachers",
      desc: "Educators committed to personalized guidance, interactive methods, and high safety standards.",
      color: colors.green,
      visible: true,
    },
    {
      id: 6,
      emoji: "🏆",
      title: "Excellent SEE Results",
      desc: "A definitive history of high-tier performance, distinctions, and absolute GPA 4.0 targets.",
      color: colors.softPurple,
      visible: true,
    },
  ],

  stats: [
    {
      id: 1,
      value: "3800+",
      label: "Active Students",
      icon: "users",
      color: colors.purple,
      visible: true,
    },
    {
      id: 2,
      value: "240+",
      label: "Expert Teachers",
      icon: "graduation",
      color: colors.green,
      visible: true,
    },
    {
      id: 3,
      value: "35+",
      label: "Years Experience",
      icon: "milestone",
      color: colors.red,
      visible: true,
    },
    {
      id: 4,
      value: "98%",
      label: "SEE Pass Rate",
      icon: "award",
      color: colors.softPurple,
      visible: true,
    },
  ],

  examTitle: "Our Examination System",
  examDescription:
    "A comprehensive grading matrix consisting of critical terminal points combined with ongoing continuous assessment frameworks.",
  timelineTerms: [
    {
      id: 1,
      term: "First Terminal",
      timeframe: "Early Academic Session Evaluation",
      visible: true,
    },
    {
      id: 2,
      term: "Second Terminal",
      timeframe: "Mid-Session Progress Verification",
      visible: true,
    },
    {
      id: 4,
      term: "Final Examination",
      timeframe: "Comprehensive Session End Grading",
      visible: true,
    },
  ],
  continuousTitle: "Continuous Formative Evaluation",
  continuousDescription:
    "To prevent high-pressure examination variance, parameters are systematically logged week-over-week via the following modules:",
  ongoingAssessments: [
    "Monthly Tests",
    "Unit Tests",
    "Assignments",
    "Practical Assessment",
  ],

  ctaTitle: "Ready to Join Baljagriti?",
  ctaDescription:
    "Secure a placement in our upcoming academic track. Contact our admissions pipeline or drop by the main campus hub directly.",
  primaryButtonText: "Apply Now",
  primaryButtonLink: "/admissions",
  secondaryButtonText: "Contact Administration",
  secondaryButtonLink: "/contact",

  curriculum: {
    "Pre-Primary Level": [
      {
        grade: "Nursery",
        books: [
          { subject: "English Readiness", publication: "Ekta Publication" },
          { subject: "Nepali Readiness", publication: "Janak Publication" },
          { subject: "Numbers & Counting", publication: "Buddha Publication" },
          { subject: "Creative Activities", publication: "Creative Publication" },
          { subject: "Rhymes & Storytelling", publication: "Story Publication" },
        ],
      },
      {
        grade: "LKG",
        books: [
          { subject: "English Readiness", publication: "Ekta Publication" },
          { subject: "Nepali Readiness", publication: "Janak Publication" },
          { subject: "Numbers & Counting", publication: "Buddha Publication" },
        ],
      },
      {
        grade: "UKG",
        books: [
          { subject: "English Readiness", publication: "Ekta Publication" },
          { subject: "Nepali Readiness", publication: "Janak Publication" },
          { subject: "Numbers & Counting", publication: "Buddha Publication" },
        ],
      },
    ],
    "Primary Level": [
      {
        grade: "Grade 1",
        books: [
          { subject: "English", publication: "Ekta Publication" },
          { subject: "Nepali", publication: "Janak Publication" },
          { subject: "Mathematics", publication: "CDC" },
          { subject: "Science", publication: "CDC" },
          { subject: "Social Studies", publication: "CDC" },
        ],
      },
      {
        grade: "Grade 2",
        books: [
          { subject: "English", publication: "Ekta Publication" },
          { subject: "Nepali", publication: "Janak Publication" },
          { subject: "Mathematics", publication: "CDC" },
          { subject: "Science", publication: "CDC" },
          { subject: "Social Studies", publication: "CDC" },
        ],
      },
      {
        grade: "Grade 3",
        books: [
          { subject: "English", publication: "Ekta Publication" },
          { subject: "Nepali", publication: "Janak Publication" },
          { subject: "Mathematics", publication: "CDC" },
          { subject: "Science", publication: "CDC" },
          { subject: "Social Studies", publication: "CDC" },
        ],
      },
      {
        grade: "Grade 4",
        books: [
          { subject: "English", publication: "Ekta Publication" },
          { subject: "Nepali", publication: "Janak Publication" },
          { subject: "Mathematics", publication: "CDC" },
          { subject: "Science", publication: "CDC" },
          { subject: "Social Studies", publication: "CDC" },
        ],
      },
      {
        grade: "Grade 5",
        books: [
          { subject: "English", publication: "Ekta Publication" },
          { subject: "Nepali", publication: "Janak Publication" },
          { subject: "Mathematics", publication: "CDC" },
          { subject: "Science", publication: "CDC" },
          { subject: "Social Studies", publication: "CDC" },
        ],
      },
    ],
    "Lower Secondary Level": [
      {
        grade: "Grade 6",
        books: [
          { subject: "English", publication: "Ekta Publication" },
          { subject: "Nepali", publication: "Janak Publication" },
          { subject: "Mathematics", publication: "CDC" },
          { subject: "Science", publication: "CDC" },
          { subject: "Computer Science", publication: "CDC" },
          { subject: "Social Studies", publication: "CDC" },
        ],
      },
      {
        grade: "Grade 7",
        books: [
          { subject: "English", publication: "Ekta Publication" },
          { subject: "Nepali", publication: "Janak Publication" },
          { subject: "Mathematics", publication: "CDC" },
          { subject: "Science", publication: "CDC" },
          { subject: "Computer Science", publication: "CDC" },
          { subject: "Social Studies", publication: "CDC" },
        ],
      },
      {
        grade: "Grade 8",
        books: [
          { subject: "English", publication: "Ekta Publication" },
          { subject: "Nepali", publication: "Janak Publication" },
          { subject: "Mathematics", publication: "CDC" },
          { subject: "Science", publication: "CDC" },
          { subject: "Computer Science", publication: "CDC" },
          { subject: "Social Studies", publication: "CDC" },
        ],
      },
    ],
    "Secondary Level": [
      {
        grade: "Grade 9",
        books: [
          { subject: "English", publication: "Ekta Publication" },
          { subject: "Nepali", publication: "Janak Publication" },
          { subject: "Mathematics", publication: "CDC" },
          { subject: "Science", publication: "CDC" },
          { subject: "Computer Science", publication: "CDC" },
          { subject: "Optional Mathematics", publication: "CDC" },
        ],
      },
      {
        grade: "Grade 10",
        books: [
          { subject: "English", publication: "Ekta Publication" },
          { subject: "Nepali", publication: "Janak Publication" },
          { subject: "Mathematics", publication: "CDC" },
          { subject: "Science", publication: "CDC" },
          { subject: "Computer Science", publication: "CDC" },
          { subject: "Optional Mathematics", publication: "CDC" },
        ],
      },
      {
        grade: "Grade 11",
        books: [
          { subject: "English", publication: "NEB / CDC" },
          { subject: "Nepali", publication: "NEB / CDC" },
          { subject: "Accountancy / Science Stream Subject", publication: "NEB / CDC" },
          { subject: "Economics / Biology / Physics", publication: "NEB / CDC" },
          { subject: "Computer Science / Mathematics", publication: "NEB / CDC" },
        ],
      },
      {
        grade: "Grade 12",
        books: [
          { subject: "English", publication: "NEB / CDC" },
          { subject: "Nepali", publication: "NEB / CDC" },
          { subject: "Accountancy / Science Stream Subject", publication: "NEB / CDC" },
          { subject: "Economics / Biology / Physics", publication: "NEB / CDC" },
          { subject: "Computer Science / Mathematics", publication: "NEB / CDC" },
        ],
      },
    ],
  },
};

function isLegacyAcademicsContent(saved = {}) {
  return Number(saved._contentVersion || 0) < 2;
}

function normalizeLegacyHeroDescription(description, shouldMigrate) {
  const text = description ?? defaultAcademicsContent.heroDescription;

  if (!shouldMigrate) return text;

  return text
    .replace("Play Group to Grade 10", "Play Group to Grade 12")
    .replace("Play Group to Class 10", "Play Group to Class 12")
    .replace("up to Grade 10", "up to Grade 12")
    .replace("up to Class 10", "up to Class 12");
}

function normalizePrograms(programs = [], shouldMigrate = false) {
  return programs.map((program) => {
    const level = String(program.level || "").toLowerCase();

    if (!level.includes("secondary") || !shouldMigrate) {
      return {
        ...program,
        classes: Array.isArray(program.classes) ? program.classes : [],
      };
    }

    const currentSpan = String(program.span || "").trim();

    const isOldSecondarySpan =
      currentSpan === "" ||
      currentSpan === "Grade 9 – 10" ||
      currentSpan === "Grade 9 - 10" ||
      currentSpan === "9 – 10" ||
      currentSpan === "9 - 10";

    const oldHighlight =
      "Rigorous academic performance pipelines optimizing for exceptional SEE results.";

    return {
      ...program,
      span: isOldSecondarySpan ? "Grade 9 – 12" : program.span,
      highlight:
        !program.highlight || program.highlight === oldHighlight
          ? "Rigorous academic preparation for SEE and NEB Grade 11–12 learning pathways."
          : program.highlight,
      classes: Array.isArray(program.classes)
        ? program.classes
        : defaultAcademicsContent.programs[3].classes,
    };
  });
}

function normalizeCurriculum(curriculum, shouldMigrate = false) {
  const hasSavedCurriculum =
    curriculum &&
    typeof curriculum === "object" &&
    !Array.isArray(curriculum);

  if (!hasSavedCurriculum) {
    return { ...defaultAcademicsContent.curriculum };
  }

  const merged = shouldMigrate
    ? { ...defaultAcademicsContent.curriculum, ...curriculum }
    : { ...curriculum };

  if (!shouldMigrate) {
    return merged;
  }

  const secondaryGrades = Array.isArray(merged["Secondary Level"])
    ? [...merged["Secondary Level"]]
    : [...defaultAcademicsContent.curriculum["Secondary Level"]];

  const ensureGrade = (gradeName, books) => {
    const exists = secondaryGrades.some((item) => item.grade === gradeName);

    if (!exists) {
      secondaryGrades.push({
        grade: gradeName,
        books,
      });
    }
  };

  ensureGrade(
    "Grade 11",
    defaultAcademicsContent.curriculum["Secondary Level"][2].books
  );
  ensureGrade(
    "Grade 12",
    defaultAcademicsContent.curriculum["Secondary Level"][3].books
  );

  return {
    ...merged,
    "Secondary Level": secondaryGrades,
  };
}

export function mergeAcademicsContent(saved = {}) {
  const shouldMigrate = isLegacyAcademicsContent(saved);

  return {
    ...defaultAcademicsContent,
    ...saved,

    heroDescription: normalizeLegacyHeroDescription(
      saved.heroDescription,
      shouldMigrate
    ),

    curriculum: normalizeCurriculum(saved.curriculum, shouldMigrate),

    programs: normalizePrograms(
      Array.isArray(saved.programs)
        ? saved.programs
        : defaultAcademicsContent.programs,
      shouldMigrate
    ),

    features: Array.isArray(saved.features)
      ? saved.features
      : defaultAcademicsContent.features,

    stats: Array.isArray(saved.stats)
      ? saved.stats
      : defaultAcademicsContent.stats,

    timelineTerms: Array.isArray(saved.timelineTerms)
      ? saved.timelineTerms
      : defaultAcademicsContent.timelineTerms,

    ongoingAssessments: Array.isArray(saved.ongoingAssessments)
      ? saved.ongoingAssessments
      : defaultAcademicsContent.ongoingAssessments,
  };
}

function HighlightedTitle({ title, highlight }) {
  if (!highlight || !title.includes(highlight)) return <>{title}</>;

  const [before, after] = title.split(highlight);

  return (
    <>
      {before}
      <span style={{ color: colors.red }}>{highlight}</span>
      {after}
    </>
  );
}



function ActionButtons({
  editMode,
  target,
  onEditTarget,
  onDeleteTarget,
  canDelete = false,
}) {
  if (!editMode) return null;

  return (
    <div className="absolute -top-3 -right-3 z-[120] flex items-center gap-2 opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200">
      <button
        type="button"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onEditTarget(target);
        }}
        className="rounded-full w-9 h-9 flex items-center justify-center shadow-xl"
        style={{
          background: "linear-gradient(135deg, #FACC15, #38BDF8)",
          color: "#020617",
          border: "1px solid rgba(255,255,255,0.85)",
        }}
        title="Edit"
      >
        <Pencil className="w-4 h-4" />
      </button>

      {canDelete && (
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onDeleteTarget(target);
          }}
          className="rounded-full w-9 h-9 flex items-center justify-center shadow-xl"
          style={{
            background: "linear-gradient(135deg, #FEE2E2, #FCA5A5)",
            color: colors.red,
            border: "1px solid rgba(255,255,255,0.85)",
          }}
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

function EditableWrap({
  editMode,
  target,
  onEditTarget,
  onDeleteTarget,
  canDelete = false,
  className = "",
  children,
}) {
  if (!editMode) return children;

  return (
    <div className={`relative group ${className}`}>
      {children}
      <ActionButtons
        editMode={editMode}
        target={target}
        onEditTarget={onEditTarget}
        onDeleteTarget={onDeleteTarget}
        canDelete={canDelete}
      />
    </div>
  );
}

function SectionAddButton({ editMode, label, type, onAddTarget }) {
  if (!editMode) return null;

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onAddTarget(type);
      }}
      className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-black transition-all hover:-translate-y-0.5"
      style={{
        background: "linear-gradient(135deg, #FACC15, #38BDF8)",
        color: "#020617",
        boxShadow: "0 12px 30px rgba(56,189,248,0.20)",
      }}
    >
      <Plus className="w-4 h-4" />
      {label}
    </button>
  );
}

function CurriculumLedgerModal({ programLevel, curriculum, onClose }) {
  const grades = curriculum?.[programLevel] || [];
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [programLevel]);

  const currentGrade = grades[activeIndex];

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8"
      style={{
        background: "rgba(11,16,32,0.72)",
        backdropFilter: "blur(6px)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 18, scale: 0.98 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-6xl max-h-[88vh] overflow-hidden rounded-[28px] flex flex-col md:flex-row"
        style={{
          background: colors.cream,
          boxShadow: "0 50px 120px rgba(11,16,32,0.35)",
          border: "1px solid rgba(75,46,131,0.14)",
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close curriculum record"
          className="absolute top-5 right-5 z-50 flex w-10 h-10 items-center justify-center rounded-full transition-transform duration-300 hover:rotate-90"
          style={{
            background: colors.dark,
            color: "#fff",
            boxShadow: "0 12px 26px rgba(11,16,32,0.3)",
          }}
        >
          <X size={18} />
        </button>

        <div
          className="md:w-64 shrink-0 flex md:flex-col overflow-x-auto md:overflow-y-auto"
          style={{
            background: `linear-gradient(180deg, ${colors.dark} 0%, #1A1733 100%)`,
          }}
        >
          <div className="hidden md:block px-7 pt-9 pb-5">
            <div
              className="text-[10px] font-bold tracking-[0.3em] uppercase"
              style={{ color: "rgba(255,255,255,0.45)" }}
            >
              Curriculum Record
            </div>

            <h2
              className="text-[26px] font-black text-white mt-2 leading-[1.1]"
              style={{
                fontFamily: "var(--font-display)",
                letterSpacing: "-0.03em",
              }}
            >
              {programLevel}
            </h2>

            <div
              className="w-12 h-1 rounded-full mt-4"
              style={{
                background: "linear-gradient(90deg,#D71920,#168A3A)",
              }}
            />
          </div>

          {grades.map((grade, idx) => {
            const active = idx === activeIndex;
            const tabColor = gradeAccent(idx);

            return (
              <button
                key={`${grade.grade}-${idx}`}
                onClick={() => setActiveIndex(idx)}
                className="shrink-0 md:shrink text-left px-7 py-5 flex items-center gap-4 transition-all duration-300"
                style={{
                  background: active
                    ? "rgba(255,255,255,0.07)"
                    : "transparent",
                  borderLeft: active
                    ? `3px solid ${tabColor}`
                    : "3px solid transparent",
                }}
              >
                <span
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black shrink-0 transition-all duration-300"
                  style={{
                    background: active ? tabColor : "rgba(255,255,255,0.08)",
                    color: active ? "#fff" : "rgba(255,255,255,0.5)",
                  }}
                >
                  {String(idx + 1).padStart(2, "0")}
                </span>

                <span
                  className="font-bold text-sm whitespace-nowrap"
                  style={{
                    color: active ? "#fff" : "rgba(255,255,255,0.55)",
                  }}
                >
                  {grade.grade}
                </span>
              </button>
            );
          })}
        </div>

        <div
          className="flex-1 overflow-y-auto px-7 md:px-12 py-9 relative"
          style={{
            backgroundImage:
              "repeating-linear-gradient(180deg, transparent, transparent 43px, rgba(75,46,131,0.07) 44px)",
          }}
        >
          <div className="md:hidden mb-7">
            <div
              className="text-[10px] font-bold tracking-[0.3em] uppercase"
              style={{ color: colors.purple }}
            >
              Curriculum Record
            </div>

            <h2
              className="text-3xl font-black mt-1"
              style={{
                color: colors.dark,
                fontFamily: "var(--font-display)",
              }}
            >
              {programLevel}
            </h2>
          </div>

          <AnimatePresence mode="wait">
            {currentGrade && (
              <motion.div
                key={currentGrade.grade}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <div
                  className="flex items-baseline justify-between mb-7 pb-4"
                  style={{ borderBottom: `2px solid ${colors.dark}` }}
                >
                  <div>
                    <div
                      className="text-xs font-bold uppercase tracking-[0.2em]"
                      style={{ color: "#64748B" }}
                    >
                      Entry
                    </div>

                    <div
                      className="text-3xl font-black"
                      style={{
                        color: colors.dark,
                        fontFamily: "var(--font-display)",
                      }}
                    >
                      {currentGrade.grade}
                    </div>
                  </div>

                  <div
                    className="text-sm font-bold text-right"
                    style={{ color: colors.purple }}
                  >
                    {currentGrade.books.length}{" "}
                    {currentGrade.books.length === 1 ? "subject" : "subjects"}{" "}
                    on record
                  </div>
                </div>

                {currentGrade.books.length > 0 ? (
                  <div>
                    {currentGrade.books.map((book, i) => {
                      const rowColor = gradeAccent(i);

                      return (
                        <div
                          key={`${book.subject}-${i}`}
                          className="group flex items-center gap-4 md:gap-5 py-4 transition-colors duration-300 hover:bg-black/[0.015] rounded-xl px-2 -mx-2"
                          style={{
                            borderBottom: "1px solid rgba(15,23,42,0.08)",
                          }}
                        >
                          <span
                            className="text-xs font-black w-6 shrink-0"
                            style={{ color: "#94A3B8" }}
                          >
                            {String(i + 1).padStart(2, "0")}
                          </span>

                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ background: rowColor }}
                          />

                          <span className="font-bold text-slate-900 text-base md:text-lg">
                            {book.subject}
                          </span>

                          <span
                            className="hidden md:block flex-1 border-b border-dotted self-end mb-1.5"
                            style={{ borderColor: "rgba(15,23,42,0.2)" }}
                          />

                          <span
                            className="ml-auto md:ml-0 text-sm font-bold text-right shrink-0"
                            style={{ color: rowColor }}
                          >
                            {book.publication}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div
                    className="py-16 text-center rounded-2xl"
                    style={{
                      background: "rgba(75,46,131,0.04)",
                      border: "1px dashed rgba(75,46,131,0.22)",
                    }}
                  >
                    <p className="font-bold text-slate-600">
                      Curriculum details coming soon.
                    </p>

                    <p className="text-sm text-slate-400 mt-1">
                      Check back closer to the academic session.
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Academics({
  editMode = false,
  contentOverride = null,
  onEditTarget = () => {},
  onDeleteTarget = () => {},
  onAddTarget = () => {},
}) {
  const [content, setContent] = useState(
    mergeAcademicsContent(contentOverride || defaultAcademicsContent)
  );
  const [selectedProgram, setSelectedProgram] = useState(null);

  useEffect(() => {
    if (contentOverride) {
      setContent(mergeAcademicsContent(contentOverride));
      return;
    }

    const loadAcademicsContent = async () => {
      try {
        const res = await axios.get(
          "https://school-website-backend-ixx2.onrender.com/api/site-content/academics",
          {
            timeout: 12000,
          }
        );

        const savedContent = res.data?.data?.content || {};
        setContent(mergeAcademicsContent(savedContent));
      } catch (error) {
        console.error("Academics content load error:", error);
        setContent(defaultAcademicsContent);
      }
    };

    loadAcademicsContent();
  }, [contentOverride]);

  const visiblePrograms = content.programs || [];
  const visibleFeatures = content.features || [];
  const visibleStats = content.stats || [];
  const visibleTimeline = content.timelineTerms || [];

  return (
    <div
      className="min-h-screen relative overflow-hidden"
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

      <section className="pt-36 pb-16 relative z-10">
        <div className="max-w-4xl mx-auto text-center px-6">
          <EditableWrap
            editMode={editMode}
            target={{ type: "hero" }}
            onEditTarget={onEditTarget}
            onDeleteTarget={onDeleteTarget}
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="space-y-8"
            >
            <span
              className="inline-block px-5 py-2 rounded-full text-sm font-bold"
              style={{
                background: "rgba(215,25,32,0.08)",
                color: colors.red,
                border: "1px solid rgba(215,25,32,0.16)",
              }}
            >
              {content.heroBadge}
            </span>

            <h1
              className="text-5xl md:text-7xl font-black tracking-tight"
              style={{
                fontFamily: "var(--font-display)",
                color: colors.dark,
                letterSpacing: "-0.06em",
              }}
            >
              <HighlightedTitle
                title={content.heroTitle}
                highlight={content.heroHighlight}
              />
            </h1>

            <p className="text-xl md:text-2xl leading-relaxed text-slate-600 max-w-3xl mx-auto">
              {content.heroDescription}
            </p>
            </motion.div>
          </EditableWrap>
        </div>
      </section>

      <section className="pb-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-end mb-6">
            <SectionAddButton
              editMode={editMode}
              label="Add Program"
              type="program"
              onAddTarget={onAddTarget}
            />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {visiblePrograms.map((prog, i) => {
              const cardColor = prog.badgeColor || colors.green;
              const realIndex = content.programs.findIndex(
                (item) => item.id === prog.id
              );

              return (
                <EditableWrap
                  key={prog.id}
                  editMode={editMode}
                  target={{ type: "program", index: realIndex }}
                  onEditTarget={onEditTarget}
                  onDeleteTarget={onDeleteTarget}
                  canDelete
                >
                  <motion.div
                  key={prog.id}
                  onClick={() => setSelectedProgram(prog.level)}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="group p-6 rounded-3xl flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                  style={{
                    border: `1px solid ${cardColor}24`,
                    background:
                      "linear-gradient(145deg, rgba(255,255,255,0.98), rgba(248,250,252,0.9))",
                    boxShadow: "0 18px 42px rgba(11,16,32,0.08)",
                    backdropFilter: "blur(18px)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = `0 26px 64px rgba(11,16,32,0.14), 0 0 0 1px ${cardColor}22`;
                    e.currentTarget.style.borderColor = `${cardColor}55`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 18px 42px rgba(11,16,32,0.08)";
                    e.currentTarget.style.borderColor = `${cardColor}24`;
                  }}
                >
                  <div
                    className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700"
                    style={{
                      background: `${cardColor}12`,
                      filter: "blur(60px)",
                    }}
                  />

                  <div className="relative z-10">
                    <div
                      className="text-sm font-black tracking-widest mb-5"
                      style={{ color: cardColor }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </div>

                    <div
                      className="w-16 h-1 rounded-full mb-6 transition-all duration-300 group-hover:w-28"
                      style={{ background: cardColor }}
                    />

                    <span
                      className="text-xs font-bold uppercase tracking-[0.16em] mb-4 block"
                      style={{ color: "#64748B" }}
                    >
                      {prog.span}
                    </span>

                    <h3
                      className="text-2xl font-black mb-4 text-slate-950 leading-tight"
                      style={{
                        fontFamily: "var(--font-display)",
                        letterSpacing: "-0.035em",
                      }}
                    >
                      {prog.level}
                    </h3>

                    <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                      {prog.highlight}
                    </p>

                    <div className="space-y-2.5 border-t pt-5 border-slate-100">
                      <span className="text-xs font-bold text-slate-400 block uppercase tracking-[0.16em]">
                        Course Structure
                      </span>

                      {(prog.classes || []).map((item, classIndex) => (
                        <div
                          key={`${item}-${classIndex}`}
                          className="flex items-center gap-3 text-sm text-slate-700"
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ background: cardColor }}
                          />

                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  </motion.div>
                </EditableWrap>
              );
            })}
          </div>
        </div>
      </section>

     <section className="py-24 relative z-10">
  <div className="max-w-7xl mx-auto px-6">
    <EditableWrap
      editMode={editMode}
      target={{ type: "featuresHeader" }}
      onEditTarget={onEditTarget}
      onDeleteTarget={onDeleteTarget}
    >
      <motion.div
        initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.55 }}
      className="text-center mb-14"
    >
      <span
        className="inline-flex items-center rounded-full px-5 py-2 text-sm font-bold mb-5"
        style={{
          background: "rgba(22,138,58,0.08)",
          color: colors.green,
          border: "1px solid rgba(22,138,58,0.16)",
        }}
      >
        Academic Strengths
      </span>

      <h2
        className="text-4xl md:text-5xl font-black mb-4"
        style={{
          fontFamily: "var(--font-display)",
          color: colors.dark,
          letterSpacing: "-0.045em",
          lineHeight: 1.08,
        }}
      >
        {content.featuresTitle}
      </h2>

      <div
        className="w-20 h-1.5 rounded-full mx-auto mb-5"
        style={{
          background: "linear-gradient(90deg, #D71920, #FACC15, #168A3A)",
        }}
      />

      <p className="text-slate-600 max-w-3xl mx-auto leading-relaxed text-base md:text-lg">
        {content.featuresDescription}
      </p>
      </motion.div>
    </EditableWrap>

    <div className="flex justify-end mb-6">
      <SectionAddButton
        editMode={editMode}
        label="Add Feature"
        type="feature"
        onAddTarget={onAddTarget}
      />
    </div>

    <div className="grid md:grid-cols-2 gap-7">
      {visibleFeatures.map((feat, i) => {
        const featureColor = feat.color || colors.green;
        const realIndex = content.features.findIndex(
          (item) => item.id === feat.id
        );

        const cardStyles = [
          {
            bg: "linear-gradient(145deg, rgba(75,46,131,0.105), rgba(255,255,255,0.82))",
            border: "rgba(75,46,131,0.24)",
            glow: "rgba(75,46,131,0.14)",
          },
          {
            bg: "linear-gradient(145deg, rgba(22,138,58,0.105), rgba(255,255,255,0.82))",
            border: "rgba(22,138,58,0.24)",
            glow: "rgba(22,138,58,0.14)",
          },
          {
            bg: "linear-gradient(145deg, rgba(215,25,32,0.085), rgba(255,255,255,0.84))",
            border: "rgba(215,25,32,0.22)",
            glow: "rgba(215,25,32,0.13)",
          },
          {
            bg: "linear-gradient(145deg, rgba(124,92,196,0.11), rgba(255,255,255,0.82))",
            border: "rgba(124,92,196,0.24)",
            glow: "rgba(124,92,196,0.14)",
          },
        ];

        const styleSet = cardStyles[i % cardStyles.length];

        return (
          <EditableWrap
            key={feat.id}
            editMode={editMode}
            target={{ type: "feature", index: realIndex }}
            onEditTarget={onEditTarget}
            onDeleteTarget={onDeleteTarget}
            canDelete
          >
            <motion.div
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: i * 0.07 }}
            className="group relative overflow-hidden rounded-[2rem] p-8 md:p-10 transition-all duration-300 hover:-translate-y-2"
            style={{
              background: styleSet.bg,
              border: `1px solid ${styleSet.border}`,
              boxShadow:
                "0 22px 58px rgba(15,23,42,0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
              minHeight: "260px",
            }}
          >
            <div
              className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-80 transition-all duration-500 group-hover:scale-125"
              style={{
                background: styleSet.glow,
                filter: "blur(38px)",
              }}
            />

            <div
              className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                background: `linear-gradient(135deg, ${featureColor}10, transparent 55%)`,
              }}
            />

            <div className="relative z-10">
              <div className="mb-4 flex items-center gap-3">
                <span
                  className="text-xl font-black tracking-[0.14em]"
                  style={{ color: featureColor }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <span
                  className="text-2xl"
                  role="img"
                  aria-label={feat.title || "Academic feature"}
                >
                  {feat.emoji || "📘"}
                </span>
              </div>

              <div
                className="w-16 h-1.5 rounded-full mb-7 transition-all duration-300 group-hover:w-28"
                style={{ background: featureColor }}
              />

              <h3
                className="text-3xl md:text-4xl font-black mb-5 text-slate-950 leading-tight"
                style={{
                  fontFamily: "var(--font-display)",
                  letterSpacing: "-0.035em",
                }}
              >
                {feat.title}
              </h3>

              <p className="text-base md:text-lg leading-relaxed text-slate-600 max-w-xl">
                {feat.desc}
              </p>
            </div>
            </motion.div>
          </EditableWrap>
        );
      })}
    </div>
  </div>
</section>

      <section
        className="py-20 relative z-10"
        style={{
          background: "linear-gradient(180deg,#FFF8EE 0%,#F7F3FF 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-end mb-6">
            <SectionAddButton
              editMode={editMode}
              label="Add Stat"
              type="stat"
              onAddTarget={onAddTarget}
            />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {visibleStats.map((stat, i) => {
              const statColor = stat.color || colors.green;
              const realIndex = content.stats.findIndex(
                (item) => item.id === stat.id
              );

              return (
                <EditableWrap
                  key={stat.id}
                  editMode={editMode}
                  target={{ type: "stat", index: realIndex }}
                  onEditTarget={onEditTarget}
                  onDeleteTarget={onDeleteTarget}
                  canDelete
                >
                  <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="group relative overflow-hidden p-8 rounded-[32px] transition-all duration-300 hover:-translate-y-2 cursor-default"
                  style={{
                    background:
                      "linear-gradient(145deg, rgba(255,255,255,0.98), rgba(248,250,252,0.9))",
                    border: `1px solid ${statColor}24`,
                    boxShadow: "0 16px 42px rgba(11,16,32,0.08)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = `0 24px 58px rgba(11,16,32,0.13), 0 0 0 1px ${statColor}22`;
                    e.currentTarget.style.borderColor = `${statColor}55`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 16px 42px rgba(11,16,32,0.08)";
                    e.currentTarget.style.borderColor = `${statColor}24`;
                  }}
                >
                  <div
                    className="w-16 h-1 rounded-full mx-auto mb-6 transition-all duration-300 group-hover:w-24"
                    style={{ background: statColor }}
                  />

                  <div
                    className="text-4xl md:text-5xl font-black mb-3"
                    style={{
                      color: statColor,
                      fontFamily: "var(--font-display)",
                      letterSpacing: "-0.055em",
                    }}
                  >
                    {stat.value}
                  </div>

                  <div className="text-sm text-slate-600 font-bold tracking-wide uppercase">
                    {stat.label}
                  </div>
                  </motion.div>
                </EditableWrap>
              );
            })}
          </div>
        </div>
      </section>

     <section className="pb-24 relative z-10">
  <div className="max-w-7xl mx-auto px-6">
    <EditableWrap
      editMode={editMode}
      target={{ type: "examHeader" }}
      onEditTarget={onEditTarget}
      onDeleteTarget={onDeleteTarget}
    >
      <div className="text-center mb-10">
        <span
        className="inline-block px-5 py-2 rounded-full text-sm font-bold mb-5"
        style={{
          background: "rgba(75,46,131,0.08)",
          color: colors.purple,
          border: "1px solid rgba(75,46,131,0.14)",
        }}
      >
        Evaluation Framework
      </span>

      <h2
        className="text-4xl md:text-5xl font-black mb-4"
        style={{
          fontFamily: "var(--font-display)",
          color: colors.dark,
          letterSpacing: "-0.045em",
          lineHeight: 1.08,
        }}
      >
        {content.examTitle}
      </h2>

      <div
        className="w-20 h-1.5 rounded-full mx-auto mb-5"
        style={{
          background: "linear-gradient(90deg, #D71920, #FACC15, #168A3A)",
        }}
      />

      <p className="text-slate-600 max-w-2xl mx-auto leading-relaxed">
        {content.examDescription}
      </p>
      </div>
    </EditableWrap>

    <div className="flex justify-end mb-6">
      <SectionAddButton
        editMode={editMode}
        label="Add Exam Term"
        type="timeline"
        onAddTarget={onAddTarget}
      />
    </div>

    <div className="grid lg:grid-cols-12 gap-10 items-stretch">
      <div className="lg:col-span-7 space-y-5">
        {visibleTimeline.map((t, index) => {
            const realIndex = content.timelineTerms.findIndex(
              (item) => item.id === t.id
            );
            const termColor =
              index === 0
                ? colors.red
                : index === 1
                ? colors.green
                : colors.purple;

            return (
              <EditableWrap
                key={t.id}
                editMode={editMode}
                target={{ type: "timeline", index: realIndex }}
                onEditTarget={onEditTarget}
                onDeleteTarget={onDeleteTarget}
                canDelete
              >
                <motion.div
                initial={{ opacity: 0, x: -22 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
                className="group relative overflow-hidden rounded-[2rem] p-7 transition-all duration-300 hover:-translate-y-1"
                style={{
                  background:
                    index === 0
                      ? "linear-gradient(145deg, rgba(215,25,32,0.075), rgba(255,255,255,0.92))"
                      : index === 1
                      ? "linear-gradient(145deg, rgba(22,138,58,0.08), rgba(255,255,255,0.92))"
                      : "linear-gradient(145deg, rgba(75,46,131,0.085), rgba(255,255,255,0.92))",
                  border: `1px solid ${termColor}24`,
                  boxShadow:
                    "0 18px 48px rgba(15,23,42,0.07), inset 0 1px 0 rgba(255,255,255,0.9)",
                }}
              >
                <div
                  className="absolute -right-16 -top-16 h-44 w-44 rounded-full opacity-70 transition-all duration-500 group-hover:scale-125"
                  style={{
                    background: `${termColor}14`,
                    filter: "blur(36px)",
                  }}
                />

                <div className="relative z-10 flex items-center gap-6">
                  <div
                    className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-sm font-black text-white"
                    style={{
                      background: termColor,
                      boxShadow: `0 16px 34px ${termColor}35`,
                    }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div>
                    <div
                      className="mb-4 h-1.5 w-20 rounded-full transition-all duration-300 group-hover:w-32"
                      style={{ background: termColor }}
                    />

                    <h4
                      className="text-2xl md:text-3xl font-black text-slate-950"
                      style={{
                        fontFamily: "var(--font-display)",
                        letterSpacing: "-0.035em",
                      }}
                    >
                      {t.term}
                    </h4>

                    <p className="text-base text-slate-500 mt-2">
                      {t.timeframe}
                    </p>
                  </div>
                </div>
                </motion.div>
              </EditableWrap>
            );
          })}
      </div>

      <EditableWrap
        editMode={editMode}
        target={{ type: "continuous" }}
        onEditTarget={onEditTarget}
        onDeleteTarget={onDeleteTarget}
        className="lg:col-span-5 h-full"
      >
        <motion.div
          className="group lg:col-span-5 h-full min-h-[420px] rounded-[2rem] p-8 md:p-9 flex flex-col justify-between overflow-hidden relative"
        whileHover={{
          y: -6,
          scale: 1.01,
        }}
        style={{
          background:
            "radial-gradient(circle at top right, rgba(124,92,196,0.42), transparent 42%), linear-gradient(145deg, rgba(11,16,32,0.98), rgba(75,46,131,0.94))",
          border: "1px solid rgba(255,255,255,0.16)",
          boxShadow:
            "0 28px 74px rgba(11,16,32,0.22), inset 0 1px 0 rgba(255,255,255,0.14)",
        }}
      >
        <div
          className="absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-70"
          style={{
            background: "rgba(124,92,196,0.24)",
            filter: "blur(42px)",
          }}
        />

        <div
          className="absolute -left-20 bottom-0 h-56 w-56 rounded-full opacity-50"
          style={{
            background: "rgba(22,138,58,0.14)",
            filter: "blur(44px)",
          }}
        />

        <div className="relative z-10">
          <div
            className="w-24 h-1.5 rounded-full mb-8 transition-all duration-300 group-hover:w-40"
            style={{
              background:
                "linear-gradient(90deg, #D71920 0%, #FACC15 45%, #168A3A 100%)",
            }}
          />

          <h3
            className="font-black text-3xl md:text-4xl text-white leading-tight mb-6"
            style={{
              fontFamily: "var(--font-display)",
              letterSpacing: "-0.045em",
            }}
          >
            {content.continuousTitle}
          </h3>

          <p
            className="text-base leading-relaxed max-w-md"
            style={{ color: "rgba(255,255,255,0.72)" }}
          >
            {content.continuousDescription}
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-4 mt-8">
          {(content.ongoingAssessments || []).map((item, assessmentIndex) => (
            <div
              key={`${item}-${assessmentIndex}`}
              className="rounded-2xl p-4 text-center font-black text-sm transition-all duration-300 hover:-translate-y-1"
              style={{
                background:
                  "linear-gradient(145deg, rgba(255,255,255,0.16), rgba(255,255,255,0.08))",
                border: "1px solid rgba(255,255,255,0.16)",
                color: "rgba(255,255,255,0.9)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12)",
              }}
            >
              {item}
            </div>
          ))}
        </div>
        </motion.div>
      </EditableWrap>
    </div>
  </div>
</section>

      <section className="pt-10 pb-24 text-center relative z-10">
        <EditableWrap
          editMode={editMode}
          target={{ type: "cta" }}
          onEditTarget={onEditTarget}
          onDeleteTarget={onDeleteTarget}
          className="max-w-4xl mx-auto"
        >
          <motion.div
            className="group px-6 py-14 rounded-[36px] space-y-6 transition-all duration-300 cursor-default"
          whileHover={{
            y: -8,
            scale: 1.01,
          }}
          style={{
            background:
              "linear-gradient(145deg, rgba(255,255,255,0.96), rgba(255,255,255,0.78))",
            border: "1px solid rgba(15,23,42,0.08)",
            boxShadow: "0 24px 70px rgba(11,16,32,0.09)",
            backdropFilter: "blur(16px)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow =
              "0 34px 86px rgba(11,16,32,0.15), 0 0 0 1px rgba(22,138,58,0.12)";
            e.currentTarget.style.borderColor = "rgba(22,138,58,0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow =
              "0 24px 70px rgba(11,16,32,0.09)";
            e.currentTarget.style.borderColor = "rgba(15,23,42,0.08)";
          }}
        >
          <div
            className="w-20 h-1 rounded-full mx-auto transition-all duration-300 group-hover:w-36"
            style={{
              background: "linear-gradient(90deg, #D71920 0%, #168A3A 100%)",
            }}
          />

          <h2
            className="text-4xl md:text-5xl font-black text-slate-900"
            style={{
              fontFamily: "var(--font-display)",
              letterSpacing: "-0.055em",
            }}
          >
            {content.ctaTitle}
          </h2>

          <p className="text-slate-600 max-w-xl mx-auto text-base leading-relaxed">
            {content.ctaDescription}
          </p>

          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to={content.primaryButtonLink || "/admissions"}
              onClick={(event) => {
                if (editMode) event.preventDefault();
              }}
              className="px-8 py-4 rounded-xl text-base font-bold transition-all duration-300 hover:scale-105 hover:-translate-y-1 shadow-lg w-full sm:w-auto"
              style={{
                background: "linear-gradient(135deg, #FACC15 0%, #38BDF8 100%)",
                color: "#111827",
                boxShadow: "0 8px 20px rgba(56,189,248,0.2)",
              }}
            >
              {content.primaryButtonText}
            </Link>

            <Link
              to={content.secondaryButtonLink || "/contact"}
              onClick={(event) => {
                if (editMode) event.preventDefault();
              }}
              className="px-8 py-4 rounded-xl text-base font-bold text-slate-800 bg-white border border-slate-200 transition-all duration-300 hover:-translate-y-1 hover:bg-slate-50 w-full sm:w-auto shadow-sm hover:shadow-lg"
            >
              {content.secondaryButtonText}
            </Link>
          </div>
          </motion.div>
        </EditableWrap>
      </section>

      <AnimatePresence>
        {selectedProgram && (
          <CurriculumLedgerModal
            programLevel={selectedProgram}
            curriculum={content.curriculum}
            onClose={() => setSelectedProgram(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default Academics;