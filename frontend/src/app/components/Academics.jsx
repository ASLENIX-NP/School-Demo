import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronRight, Pencil, Trash2, Plus } from "lucide-react";
import api from "../../lib/api";

const theme = {
  ink: "#1E1420",
  paper: "#F5EEE2",
  paperDeep: "#E9DCC4",
  card: "#FBF7EE",
  rose: "#9C2748",
  roseDeep: "#6E1733",
  roseBright: "#C6486B",
  gold: "#B98A42",
  goldSoft: "#E7CE9C",
  moss: "#3F5B49",
  text: "#2B1E23",
  textMuted: "#7C6B6F",
  white: "#FFFFFF",
};

const subject = (name, type = "Core", hours = "", sn = null) => ({
  name,
  type,
  hours,
  sn,
});

const defaultAcademicsData = {
  hero: {
    badge: "Excellence in Education",
    title: "Empowering Minds, Shaping Futures.",
    subtitle:
      "Nurturing the next generation of thinkers, innovators, and leaders through quality education.",
    description:
      "At Red Rose Secondary English Boarding School, education extends beyond textbooks. Our academic framework is designed to build strong foundations, practical knowledge, confidence, discipline, and lifelong learning from primary through secondary education.",
  },

  stats: [
    { id: "stat-1", value: "1500", suffix: "+", label: "Active Learners", color: "#9C2748", visible: true },
    { id: "stat-2", value: "85", suffix: "+", label: "Dedicated Educators", color: "#B98A42", visible: true },
    { id: "stat-3", value: "55", suffix: "+", label: "Years of Impact", color: "#3F5B49", visible: true },
    { id: "stat-4", value: "100", suffix: "%", label: "SEE Pass Rate", color: "#4A2C6E", visible: true },
  ],

  /*
   * ==========================================================
   * OFFICIAL SUBJECT STRUCTURE PROVIDED FOR THE SCHOOL
   * ==========================================================
   *
   * All previous academic subjects have been removed.
   * The class/subject lists below follow the supplied table:
   *
   * Class 1
   * Class 2/3
   * Class 4
   * Class 5
   * Class 6 & 7
   * Class 8
   * Class 9 & 10
   */
  classLevels: [
    {
      id: "primary",
      name: "Primary Level",
      shortBadge: "Classes 1 – 5",
      span: "Class 1 to Class 5",
      ageGroup: "6 – 10 Years",
      color: "#9C2748",
      bgAccent: "rgba(156, 39, 72, 0.10)",
      borderAccent: "rgba(156, 39, 72, 0.20)",
      tagline: "Strong Foundations Through a Balanced Primary Curriculum",
      description:
        "Classes 1 to 5 focus on foundational language, mathematics, science, social understanding, health, and local learning through the school's prescribed subjects.",
      visible: true,
      classes: [
        {
          id: "class-1",
          name: "Class 1",
          focus: "Foundational Learning",
          visible: true,
          subjects: [
            subject("NNER", "Core", "", 1),
            subject("Maths", "Core", "", 2),
            subject("Sungava Nepali Srinkhala", "Core", "", 3),
            subject("Science", "Core", "", 4),
            subject("Hamro serofero", "Core", "", 5),
            subject("Hamro Hetauda", "Core", "", 6),
          ],
          curriculumHighlights: [
            "NNER and language learning form the foundation of classroom learning.",
            "Mathematics and Science develop early reasoning and observation skills.",
            "Hamro serofero connects learning with the child's immediate surroundings.",
            "Hamro Hetauda introduces local knowledge and awareness.",
          ],
          assessmentMethod:
            "Regular classroom work, activities, exercises, and school examinations.",
        },
        {
          id: "class-2-3",
          name: "Class 2/3",
          focus: "Language, Numeracy & Local Learning",
          visible: true,
          subjects: [
            subject("NNER", "Core", "", 1),
            subject("Wisdom English Grammar", "Core", "", 2),
            subject("Maths", "Core", "", 3),
            subject("Sungava Nepali Srinkhala", "Core", "", 4),
            subject("Science", "Core", "", 5),
            subject("Hamro serofero", "Core", "", 6),
            subject("Hamro Hetauda", "Core", "", 7),
          ],
          curriculumHighlights: [
            "English grammar and Nepali learning continue alongside core subjects.",
            "Mathematics and Science strengthen conceptual understanding.",
            "Hamro serofero supports environmental and social awareness.",
            "Hamro Hetauda keeps local context connected to classroom learning.",
          ],
          assessmentMethod:
            "Regular classroom work, activities, exercises, and school examinations.",
        },
        {
          id: "class-4",
          name: "Class 4",
          focus: "Expanded Primary Curriculum",
          visible: true,
          subjects: [
            subject("NNER", "Core", "", 1),
            subject("Wisdom English Grammar", "Core", "", 2),
            subject("Maths", "Core", "", 3),
            subject("Rasilo Nepali", "Core", "", 4),
            subject("Science", "Core", "", 5),
            subject("Social Studies", "Core", "", 6),
            subject("Health & Physical", "Core", "", 7),
            subject("Hamro Hetauda", "Core", "", 8),
          ],
          curriculumHighlights: [
            "The curriculum expands into Social Studies and Health & Physical.",
            "Language, Mathematics, and Science remain central academic areas.",
            "Rasilo Nepali supports Nepali language development.",
            "Hamro Hetauda provides local and community-based learning.",
          ],
          assessmentMethod:
            "Regular class assessment, practical activities, assignments, and examinations.",
        },
        {
          id: "class-5",
          name: "Class 5",
          focus: "Upper Primary Preparation",
          visible: true,
          subjects: [
            subject("NNER", "Core", "", 1),
            subject("Wisdom English Grammar", "Core", "", 2),
            subject("Maths", "Core", "", 3),
            subject("Hamro Ramro Nepali", "Core", "", 4),
            subject("Science", "Core", "", 5),
            subject("Social Studies", "Core", "", 6),
            subject("Health & Physical", "Core", "", 8),
            subject("Hamro Hetauda", "Core", "", 9),
          ],
          curriculumHighlights: [
            "Students build stronger subject knowledge before entering the lower-secondary stage.",
            "English, Nepali, Mathematics, and Science remain key learning areas.",
            "Social Studies and Health & Physical broaden academic and personal development.",
            "Hamro Hetauda maintains a connection with local knowledge and community.",
          ],
          assessmentMethod:
            "Regular class assessment, assignments, activities, and school examinations.",
        },
      ],
    },

    {
      id: "middle",
      name: "Middle Level",
      shortBadge: "Classes 6 – 8",
      span: "Class 6 to Class 8",
      ageGroup: "11 – 13 Years",
      color: "#3F5B49",
      bgAccent: "rgba(63, 91, 73, 0.10)",
      borderAccent: "rgba(63, 91, 73, 0.20)",
      tagline: "Developing Stronger Academic and Practical Understanding",
      description:
        "Classes 6 to 8 introduce a broader subject structure with English, Nepali, Mathematics, Science, Social Studies, Computer, Health & Physical, grammar, and local learning.",
      visible: true,
      classes: [
        {
          id: "class-6-7",
          name: "Class 6 & 7",
          focus: "Core Middle-Level Subjects",
          visible: true,
          subjects: [
            subject("Our English", "Core", "", 1),
            subject("Nepali ", "Core", "", 2),
            subject("C.Maths", "Core", "", 3),
            subject("Science", "Core", "", 4),
            subject("Social Studies", "Core", "", 5),
            subject("Computer", "Core", "", 6),
            subject("Health & Physical", "Core", "", 7),
            subject("gk", "Core", "", 8),
            subject("Maxim Grammar", "Core", "", 9),
            subject("Hamro Hetauda", "Core", "", 10),
          ],
          curriculumHighlights: [
            "English and Nepali support language proficiency and communication.",
            "C.Maths and Science strengthen mathematical and scientific understanding.",
            "Computer introduces digital learning alongside Social Studies.",
            "Health & Physical, grammar, and Hamro Hetauda support broader development.",
          ],
          assessmentMethod:
            "Regular class assessment, assignments, practical activities, and school examinations.",
        },
        {
          id: "class-8",
          name: "Class 8",
          focus: "Advanced Middle-Level Subjects",
          visible: true,
          subjects: [
            subject("Our English", "Core", "", 1),
            subject("Nepali ", "Core", "", 2),
            subject("C.Maths", "Core", "", 3),
            subject("OPT. Math", "Core", "", 4),
            subject("Science", "Core", "", 5),
            subject("Social Studies", "Core", "", 6),
            subject("Computer", "Core", "", 7),
            subject("Health & Physical", "Core", "", 8),
            subject("g]kfnL Jofs/0f", "Core", "", 9),
            subject("Hamro Hetauda", "Core", "", 10),
          ],
          curriculumHighlights: [
            "Optional Mathematics is added to the Class 8 subject structure.",
            "Science, C.Maths, and language subjects support stronger academic preparation.",
            "Computer and Health & Physical maintain practical and personal development.",
            "Hamro Hetauda continues local learning and awareness.",
          ],
          assessmentMethod:
            "Regular class assessment, assignments, practical activities, and school examinations.",
        },
      ],
    },

    {
      id: "secondary",
      name: "Secondary Level",
      shortBadge: "Classes 9 – 10",
      span: "Class 9 & Class 10",
      ageGroup: "14 – 16 Years",
      color: "#4A2C6E",
      bgAccent: "rgba(74, 44, 110, 0.10)",
      borderAccent: "rgba(74, 44, 110, 0.20)",
      tagline: "Focused Preparation for Secondary-Level Study",
      description:
        "Classes 9 and 10 follow the supplied school subject structure, combining core academic subjects with Optional Mathematics, Computer, Environmental Science, and Nepali grammar.",
      visible: true,
      classes: [
        {
          id: "class-9-10",
          name: "Class 9 & 10",
          focus: "Secondary Academic Curriculum",
          visible: true,
          subjects: [
            subject("Our English", "Core", "", 1),
            subject("Nepali", "Core", "", 2),
            subject("C.Maths", "Core", "", 3),
            subject("Science (both)", "Core", "", 4),
            subject("Social Studies", "Core", "", 5),
            subject("OPT Math", "Core", "", 7),
            subject("Computer", "Core", "", 8),
            subject("Env. Science", "Core", "", 9),
            subject("g]kfnL Jofs/0f", "Core", "", 10),
          ],
          curriculumHighlights: [
            "English, Nepali, C.Maths, Science, and Social Studies form the core academic structure.",
            "OPT Math provides an additional mathematics pathway.",
            "Computer and Environmental Science broaden practical and applied learning.",
            "Nepali grammar supports language accuracy and written communication.",
          ],
          assessmentMethod:
            "Regular class assessment, assignments, practical activities, model examinations, and final school examinations.",
        },
      ],
    },
  ],

  strengths: [
    {
      id: "strength-1",
      title: "Strong Foundations",
      description:
        "A structured subject pathway builds knowledge progressively from Class 1 through Class 10.",
      color: "#9C2748",
      visible: true,
    },
    {
      id: "strength-2",
      title: "Language Development",
      description:
        "English, Nepali, grammar, and reading-focused subjects support communication and academic confidence.",
      color: "#3F5B49",
      visible: true,
    },
    {
      id: "strength-3",
      title: "Mathematical Thinking",
      description:
        "Maths, C.Maths, and OPT Math provide continued development of numerical and analytical skills.",
      color: "#B98A42",
      visible: true,
    },
    {
      id: "strength-4",
      title: "Science & Technology",
      description:
        "Science and Computer subjects introduce students to scientific understanding and digital skills.",
      color: "#C6486B",
      visible: true,
    },
    {
      id: "strength-5",
      title: "Social Awareness",
      description:
        "Social Studies, Hamro serofero, and Hamro Hetauda connect learning with society and the local environment.",
      color: "#4A2C6E",
      visible: true,
    },
    {
      id: "strength-6",
      title: "Holistic Growth",
      description:
        "Health & Physical and broader school activities support balanced academic and personal development.",
      color: "#2D6A4F",
      visible: true,
    },
  ],

  achievements: [
    {
      id: "ach-1",
      title: "Academic Excellence",
      description:
        "Students are supported through a structured academic pathway across primary, middle, and secondary levels.",
      visible: true,
    },
    {
      id: "ach-2",
      title: "Science & Learning",
      description:
        "Science and technology remain important parts of the academic journey from the primary stage onward.",
      visible: true,
    },
    {
      id: "ach-3",
      title: "Community & Local Learning",
      description:
        "Subjects such as Hamro serofero and Hamro Hetauda connect classroom learning with local context.",
      visible: true,
    },
    {
      id: "ach-4",
      title: "Secondary Preparation",
      description:
        "The Class 9 and 10 curriculum provides focused preparation across core and additional subject areas.",
      visible: true,
    },
  ],

  assessment: {
    title: "Assessment & Academic Growth",
    description:
      "Students are evaluated through regular classroom learning, assignments, activities, practical work, school examinations, and ongoing academic progress.",
    methods: [
      "Regular Classroom Assessment",
      "Assignments & Written Exercises",
      "Practical & Activity-Based Learning",
      "Periodic School Examinations",
      "Model Examinations for Secondary Classes",
      "Continuous Academic Progress Tracking",
    ],
  },

  levelsHeading: {
    eyebrow: "Academic Structure",
    title: 'Explore Our <span style="color: #9C2748;">Class Levels</span>',
    description:
      "Select a level to view the exact class-wise subjects provided by Red Rose Secondary English Boarding School.",
  },

  strengthsHeading: {
    eyebrow: "What Sets Us Apart",
    title: 'Our <span style="color: #9C2748;">Academic Strengths</span>',
    description:
      "A balanced academic structure supporting language, mathematics, science, technology, social understanding, and personal development.",
  },

  achievementsHeading: {
    eyebrow: "Academic Journey",
    title: 'Building <span style="color: #9C2748;">Student Success</span>',
    description:
      "A progressive curriculum helps students develop knowledge and confidence throughout their school years.",
  },

  assessmentHeading: {
    eyebrow: "Assessment & Growth",
    title: "Assessment & Academic Growth",
    description:
      "Regular evaluation helps teachers and students understand progress and areas for improvement.",
  },
};

/*
 * IMPORTANT:
 * The class/subject curriculum is intentionally authoritative here.
 *
 * The old Supabase academics record may still contain the previous
 * Pre-Primary / Early Years and High / Secondary Level structure.
 * We do NOT allow that old classLevels array to overwrite the official
 * curriculum supplied for this page.
 *
 * The exact structure is:
 *   Primary: Class 1, Class 2/3, Class 4, Class 5
 *   Middle: Class 6 & 7, Class 8
 *   Secondary: Class 9 & 10
 *
 * This keeps the public Academics page synchronized with the school
 * subject sheet even before the old database record is cleaned up.
 */
const mergeAcademicsContent = (saved = {}) => {
  const savedLevels = Array.isArray(saved.classLevels)
    ? saved.classLevels
    : [];

  // Preserve only non-curriculum metadata from matching official levels.
  // Subjects, classes, level names and visibility remain authoritative.
  const officialLevels = defaultAcademicsData.classLevels.map((officialLevel) => {
    const savedLevel = savedLevels.find(
      (level) => level?.id === officialLevel.id
    );

    return {
      ...officialLevel,
      ...(savedLevel || {}),
      id: officialLevel.id,
      name: officialLevel.name,
      shortBadge: officialLevel.shortBadge,
      span: officialLevel.span,
      ageGroup: officialLevel.ageGroup,
      color: officialLevel.color,
      bgAccent: officialLevel.bgAccent,
      borderAccent: officialLevel.borderAccent,
      visible: true,

      // The supplied school curriculum is authoritative.
      classes: officialLevel.classes.map((officialClass) => {
        const savedClass = Array.isArray(savedLevel?.classes)
          ? savedLevel.classes.find(
              (item) => item?.id === officialClass.id
            )
          : null;

        return {
          ...officialClass,
          ...(savedClass || {}),
          id: officialClass.id,
          name: officialClass.name,
          focus: officialClass.focus,
          visible: true,

          // Never let an old database subject list replace the supplied list.
          subjects: officialClass.subjects.map((officialSubject) => ({
            ...officialSubject,
          })),
        };
      }),
    };
  });

  return {
    ...defaultAcademicsData,
    ...saved,

    hero: {
      ...defaultAcademicsData.hero,
      ...(saved.hero || {}),
    },

    stats: Array.isArray(saved.stats)
      ? saved.stats
      : defaultAcademicsData.stats,

    // Always use the corrected official class structure.
    classLevels: officialLevels,

    strengths: Array.isArray(saved.strengths)
      ? saved.strengths
      : defaultAcademicsData.strengths,

    achievements: Array.isArray(saved.achievements)
      ? saved.achievements
      : defaultAcademicsData.achievements,

    assessment: {
      ...defaultAcademicsData.assessment,
      ...(saved.assessment || {}),
      methods: Array.isArray(saved.assessment?.methods)
        ? saved.assessment.methods
        : defaultAcademicsData.assessment.methods,
    },

    levelsHeading: {
      ...defaultAcademicsData.levelsHeading,
      ...(saved.levelsHeading || {}),
    },

    strengthsHeading: {
      ...defaultAcademicsData.strengthsHeading,
      ...(saved.strengthsHeading || {}),
    },

    achievementsHeading: {
      ...defaultAcademicsData.achievementsHeading,
      ...(saved.achievementsHeading || {}),
    },

    assessmentHeading: {
      ...defaultAcademicsData.assessmentHeading,
      ...(saved.assessmentHeading || {}),
    },
  };
};

// ============================================================
// GLOBAL STYLES
// ============================================================
function AcademicsStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700&family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');

      .rr-academics {
        font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
        color: ${theme.text};
        background: ${theme.paper};
      }

      .rr-academics *,
      .rr-academics *::before,
      .rr-academics *::after {
        box-sizing: border-box;
      }

      .rr-serif {
        font-family: 'Fraunces', Georgia, 'Times New Roman', serif;
      }

      .rr-mono {
        font-family: 'Space Grotesk', 'IBM Plex Mono', monospace;
      }

      .rr-level-card:hover {
        border-color: ${theme.rose} !important;
      }

      .rr-subject-row:hover {
        transform: translateX(3px);
        box-shadow: 0 7px 18px rgba(30, 20, 32, 0.055);
      }

      .rr-strength-card:hover,
      .rr-achievement-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 18px 38px rgba(30, 20, 32, 0.09);
      }

      .rr-class-tab:hover {
        transform: translateY(-1px);
      }

      @media (max-width: 900px) {
        .rr-academics-levels-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        }

        .rr-academics-panel-grid {
          grid-template-columns: 1fr !important;
        }

        .rr-academics-strengths-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        }

        .rr-achievements-grid {
          grid-template-columns: 1fr !important;
        }

        .rr-academics-assessment-content {
          grid-template-columns: 1fr !important;
          gap: 30px !important;
        }

        .rr-academics-assessment-methods {
          grid-template-columns: 1fr !important;
        }
      }

      @media (max-width: 640px) {
        .rr-academics {
          overflow-x: hidden;
        }

        .rr-academics-hero {
          padding-top: 24px !important;
          padding-bottom: 40px !important;
        }

        .rr-academics-hero-card {
          min-height: 0 !important;
          border-radius: 0 0 24px 24px !important;
        }

        .rr-academics-hero-inner {
          padding: 42px 24px 65px !important;
        }

        .rr-academics-hero-description {
          font-size: 13px !important;
        }

        .rr-academics-stats-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        }

        .rr-academics-levels,
        .rr-academics-strengths,
        .rr-academics-achievements,
        .rr-academics-assessment {
          padding-left: 16px !important;
          padding-right: 16px !important;
          padding-top: 50px !important;
          padding-bottom: 55px !important;
        }

        .rr-academics-levels-grid {
          grid-template-columns: 1fr !important;
          gap: 14px !important;
        }

        .rr-academics-strengths-grid {
          grid-template-columns: 1fr !important;
        }

        .rr-achievements-grid {
          grid-template-columns: 1fr !important;
          gap: 16px !important;
        }

        .rr-achievement-card {
          padding: 26px 22px !important;
          min-height: auto !important;
        }

        .rr-academics-curriculum {
          padding: 24px 18px !important;
          border-radius: 18px !important;
        }

        .rr-academics-panel-header {
          flex-direction: column !important;
          gap: 15px !important;
        }

        .rr-academics-age-card {
          min-width: 100% !important;
          flex-direction: row !important;
          justify-content: space-between !important;
        }

        .rr-academics-class-tabs {
          flex-direction: column !important;
          align-items: flex-start !important;
          gap: 10px !important;
        }

        .rr-academics-class-tabs-group {
          width: 100% !important;
        }

        .rr-academics-subject-row {
          align-items: flex-start !important;
          flex-direction: column !important;
          gap: 8px !important;
        }

        .rr-academics-subject-right {
          width: 100% !important;
          justify-content: space-between !important;
        }

        .rr-academics-subject-type {
          white-space: normal !important;
          text-align: center !important;
          flex: 1 !important;
        }

        .rr-academics-inner-card {
          padding: 18px !important;
        }

        .rr-academics-highlights-list {
          gap: 10px !important;
        }

        .rr-academics-assessment-methods {
          border-top: none !important;
          margin-top: 25px !important;
        }

        .rr-academics-assessment-method {
          padding: 15px 12px !important;
        }
      }

      @media (max-width: 500px) {
        .rr-academics-level-card {
          padding: 20px !important;
        }

        .rr-academics-stats-grid {
          grid-template-columns: 1fr !important;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .rr-academics *,
        .rr-academics *::before,
        .rr-academics *::after {
          animation-duration: 0.001ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.001ms !important;
        }
      }
    `}</style>
  );
}

// ============================================================
// EDIT / DELETE / ADD CONTROLS
// ============================================================
function EditIconButton({
  editMode,
  target,
  onEditTarget,
  icon: Icon = Pencil,
  label = "Edit",
}) {
  if (!editMode) return null;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onEditTarget(target);
      }}
      className="absolute -top-2 -right-2 z-[90] opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 rounded-full w-8 h-8 flex items-center justify-center shadow-lg backdrop-blur-md"
      style={{
        background: "rgba(255,255,255,0.94)",
        color: theme.rose,
        border: "1px solid rgba(185,138,66,0.33)",
      }}
      title={label}
      aria-label={label}
    >
      <Icon className="w-3.5 h-3.5" />
    </button>
  );
}

function DeleteIconButton({
  editMode,
  target,
  onDeleteTarget,
  label = "Delete",
}) {
  if (!editMode) return null;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onDeleteTarget(target);
      }}
      className="absolute -top-2 -right-12 z-[90] opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 rounded-full w-8 h-8 flex items-center justify-center shadow-lg"
      style={{
        background: "#FBE3E7",
        color: theme.rose,
        border: "2px solid #FFFFFF",
      }}
      title={label}
      aria-label={label}
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
    <div className={`relative group ${className}`}>
      {children}

      <EditIconButton
        editMode={editMode}
        target={target}
        onEditTarget={onEditTarget}
        icon={icon}
        label={label}
      />

      {canDelete && (
        <DeleteIconButton
          editMode={editMode}
          target={target}
          onDeleteTarget={onDeleteTarget}
          label="Delete"
        />
      )}
    </div>
  );
}

function SectionAddButton({
  editMode,
  label,
  type,
  target,
  onAddTarget,
}) {
  if (!editMode) return null;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onAddTarget(target || type);
      }}
      className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5"
      style={{
        color: "#FFFFFF",
        background:
          "linear-gradient(135deg, #6E1733 0%, #9C2748 55%, #C6486B 100%)",
        boxShadow: "0 10px 24px rgba(156,39,72,0.25)",
      }}
    >
      <Plus className="w-4 h-4" />
      {label}
    </button>
  );
}

// ============================================================
// SECTION INTRO
// ============================================================
function SectionIntro({
  eyebrow,
  title,
  description,
  align = "left",
}) {
  const centered = align === "center";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
      style={{
        maxWidth: centered ? "720px" : "760px",
        margin: centered ? "0 auto 42px" : "0 0 34px",
        textAlign: centered ? "center" : "left",
      }}
    >
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: centered ? "center" : "flex-start",
          gap: "12px",
          marginBottom: "14px",
        }}
      >
        <span
          style={{
            width: "34px",
            height: "1px",
            background: theme.gold,
          }}
        />

        <span
          className="rr-mono"
          style={{
            color: theme.rose,
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
          }}
        >
          {eyebrow}
        </span>
      </motion.div>

      <motion.h2
        className="rr-serif"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.15 }}
        style={{
          margin: 0,
          color: theme.ink,
          fontSize: "clamp(2rem, 4vw, 3.15rem)",
          lineHeight: 1.05,
          fontWeight: 600,
          letterSpacing: "-0.025em",
        }}
        dangerouslySetInnerHTML={{ __html: title }}
      />

      {description && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            margin: "16px auto 0",
            maxWidth: centered ? "650px" : "700px",
            color: theme.textMuted,
            fontSize: "15px",
            lineHeight: 1.75,
          }}
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  );
}

// ============================================================
// MAIN PAGE
// ============================================================
const AcademicsPage = ({
  editMode = false,
  contentOverride = null,
  onEditTarget = () => {},
  onDeleteTarget = () => {},
  onAddTarget = () => {},
}) => {
  const [activeLevelId, setActiveLevelId] = useState("primary");
  const [activeClassIndex, setActiveClassIndex] = useState(0);
  const [data, setData] = useState(
    mergeAcademicsContent(defaultAcademicsData)
  );

  useEffect(() => {
    let alive = true;

    if (contentOverride) {
      setData(mergeAcademicsContent(contentOverride));
      return () => {
        alive = false;
      };
    }

    const loadAcademics = async () => {
      try {
        const res = await api.get(
          "/api/site-content/academics",
          { timeout: 12000 }
        );

        if (!alive) return;

        const saved = res.data?.data?.content || {};
        setData(mergeAcademicsContent(saved));
      } catch (error) {
        console.error("Academics content load error:", error);

        if (alive) {
          setData(mergeAcademicsContent(defaultAcademicsData));
        }
      }
    };

    loadAcademics();

    return () => {
      alive = false;
    };
  }, [contentOverride]);

  useEffect(() => {
    const currentLevel = data.classLevels?.find(
      (level) => level.id === activeLevelId
    );

    if (!currentLevel) {
      const firstVisible = (data.classLevels || []).find(
        (level) => level.visible !== false
      );

      setActiveLevelId(firstVisible?.id || null);
      setActiveClassIndex(0);
      return;
    }

    if (
      !currentLevel.classes ||
      currentLevel.classes.length === 0
    ) {
      setActiveClassIndex(0);
      return;
    }

    if (
      activeClassIndex >= currentLevel.classes.length
    ) {
      setActiveClassIndex(0);
    }
  }, [data.classLevels, activeLevelId, activeClassIndex]);

  const classLevels = data.classLevels || [];

  const activeLevel = activeLevelId
    ? classLevels.find(
        (level) => level.id === activeLevelId
      ) || null
    : null;

  const visibleClasses =
    activeLevel?.classes?.filter(
      (cls) => cls.visible !== false
    ) || [];

  const activeClass =
    visibleClasses[activeClassIndex] ||
    visibleClasses[0] || {
      subjects: [],
      curriculumHighlights: [],
      assessmentMethod: "",
    };

  const handleSelectLevel = (levelId) => {
    if (activeLevelId === levelId) {
      setActiveLevelId(null);
      setActiveClassIndex(0);
      return;
    }

    setActiveLevelId(levelId);
    setActiveClassIndex(0);
  };

  const visibleStats = (data.stats || []).filter(
    (s) => s.visible !== false
  );

  const visibleStrengths = (data.strengths || []).filter(
    (s) => s.visible !== false
  );

  const visibleAchievements = (data.achievements || []).filter(
    (a) => a.visible !== false
  );

  const visibleClassLevels = classLevels.filter(
    (l) => l.visible !== false
  );

  return (
    <div
      className="rr-academics"
      style={globalStyles.page}
    >
      <AcademicsStyles />

      {/* =====================================================
          HERO
      ===================================================== */}
      <section
        className="rr-academics-hero"
        style={globalStyles.hero}
      >
        <EditableWrap
          editMode={editMode}
          target={{ type: "hero" }}
          onEditTarget={onEditTarget}
          label="Edit hero"
        >
          <motion.div
            className="rr-academics-hero-card"
            initial={{
              opacity: 0,
              y: 30,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={globalStyles.heroCard}
          >
            <div
              className="rr-academics-hero-inner"
              style={globalStyles.heroInner}
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.2,
                }}
                style={globalStyles.eyebrow}
              >
                <span style={globalStyles.eyebrowLine} />
                <span className="rr-mono" style={globalStyles.eyebrowText}>
                  {data.hero.badge ||
                    "Excellence in Education"}
                </span>
              </motion.div>

              <motion.h1
                className="rr-serif"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: 0.3,
                }}
                style={globalStyles.heroTitle}
              >
                {data.hero.title ||
                  "Empowering Minds, Shaping Futures."}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.4,
                }}
                style={globalStyles.heroLead}
              >
                {data.hero.subtitle ||
                  "Nurturing the next generation of thinkers, innovators, and leaders through quality education."}
              </motion.p>

              <motion.p
                className="rr-academics-hero-description"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.5,
                }}
                style={globalStyles.heroDescription}
              >
                {data.hero.description ||
                  "Our academic framework builds strong foundations, practical knowledge, confidence, discipline, and lifelong learning."}
              </motion.p>
            </div>
          </motion.div>
        </EditableWrap>
      </section>

      {/* =====================================================
          STATS
      ===================================================== */}
      <div
        style={{
          maxWidth: "1180px",
          margin: "-20px auto 0",
          padding: "0 24px",
          position: "relative",
          zIndex: 5,
        }}
      >
        {editMode && (
          <div className="flex justify-end mb-4">
            <SectionAddButton
              editMode={editMode}
              label="Add Stat"
              type="stat"
              onAddTarget={onAddTarget}
            />
          </div>
        )}

        <div
          className="rr-academics-stats-grid"
          style={globalStyles.statsGrid}
        >
          {visibleStats.map((stat, index) => (
            <EditableWrap
              key={stat.id || index}
              editMode={editMode}
              target={{
                type: "statsCard",
                index,
              }}
              onEditTarget={onEditTarget}
              onDeleteTarget={onDeleteTarget}
              canDelete={visibleStats.length > 1}
              label="Edit stat"
            >
              <motion.div
                initial={{
                  opacity: 0,
                  y: 14,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.06,
                }}
                style={{
                  ...globalStyles.statCard,
                  borderColor: stat.color
                    ? `${stat.color}40`
                    : theme.paperDeep,
                }}
              >
                <span
                  style={{
                    ...globalStyles.statValue,
                    color:
                      stat.color || theme.rose,
                  }}
                >
                  {stat.value}
                  {stat.suffix}
                </span>

                <span
                  style={globalStyles.statLabel}
                >
                  {stat.label}
                </span>
              </motion.div>
            </EditableWrap>
          ))}
        </div>
      </div>

      {/* =====================================================
          CLASS LEVELS
      ===================================================== */}
      <section
        id="class-levels"
        className="rr-academics-levels"
        style={globalStyles.levelsSection}
      >
        <SectionIntro
          eyebrow={
            data.levelsHeading?.eyebrow ||
            "Academic Structure"
          }
          title={
            data.levelsHeading?.title ||
            'Explore Our <span style="color: #9C2748;">Class Levels</span>'
          }
          description={
            data.levelsHeading?.description ||
            "Select a level to view the exact class-wise subjects."
          }
          align="center"
        />

        {editMode && (
          <div className="flex justify-end mb-4">
            <SectionAddButton
              editMode={editMode}
              label="Add Class Level"
              type="classLevel"
              onAddTarget={onAddTarget}
            />
          </div>
        )}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.1,
          }}
          transition={{
            duration: 0.6,
            delay: 0.1,
          }}
          className="rr-academics-levels-grid"
          style={globalStyles.levelsGrid}
        >
          {visibleClassLevels.map(
            (level, index) => {
              const realIndex =
                classLevels.findIndex(
                  (item) =>
                    item.id === level.id
                );

              const isActive =
                level.id === activeLevelId;

              const levelColor =
                level.color || theme.rose;

              return (
                <EditableWrap
                  key={level.id || index}
                  editMode={editMode}
                  target={{
                    type: "classLevel",
                    index:
                      realIndex >= 0
                        ? realIndex
                        : index,
                  }}
                  onEditTarget={onEditTarget}
                  onDeleteTarget={onDeleteTarget}
                  canDelete={
                    visibleClassLevels.length > 1
                  }
                  label="Edit academic level"
                  className="h-full"
                >
                  <motion.button
                    type="button"
                    className="rr-level-card rr-academics-level-card"
                    onClick={() =>
                      handleSelectLevel(
                        level.id
                      )
                    }
                    aria-expanded={isActive}
                    aria-controls={
                      isActive
                        ? "rr-active-curriculum-panel"
                        : undefined
                    }
                    whileHover={{ y: -5 }}
                    whileTap={{
                      scale: 0.99,
                    }}
                    style={{
                      ...globalStyles.levelCard,
                      width: "100%",
                      height: "100%",
                      borderColor: isActive
                        ? levelColor
                        : theme.paperDeep,
                      boxShadow: isActive
                        ? `0 12px 30px ${levelColor}18`
                        : "0 5px 18px rgba(30,20,32,0.035)",
                    }}
                  >
                    <div
                      style={
                        globalStyles.levelCardNumber
                      }
                    >
                      <span
                        className="rr-mono"
                        style={{
                          color: isActive
                            ? levelColor
                            : theme.textMuted,
                        }}
                      >
                        {String(index + 1).padStart(
                          2,
                          "0"
                        )}
                      </span>

                      <span
                        style={{
                          ...globalStyles.levelBadge,
                          color: levelColor,
                          background:
                            level.bgAccent ||
                            `${levelColor}18`,
                        }}
                      >
                        {level.shortBadge ||
                          "Level"}
                      </span>
                    </div>

                    <h3
                      className="rr-serif"
                      style={{
                        ...globalStyles.levelName,
                        color: isActive
                          ? levelColor
                          : theme.ink,
                      }}
                    >
                      {level.name ||
                        "New Level"}
                    </h3>

                    <p
                      style={
                        globalStyles.levelSpan
                      }
                    >
                      {level.span ||
                        "Class Range"}
                    </p>

                    {level.ageGroup && (
                      <span
                        style={{
                          ...globalStyles.levelAgePill,
                          color: levelColor,
                          background:
                            level.bgAccent ||
                            `${levelColor}18`,
                        }}
                      >
                        Age {level.ageGroup}
                      </span>
                    )}

                    <div
                      className="rr-level-select"
                      style={{
                        ...globalStyles.levelSelect,
                        color: isActive
                          ? theme.white
                          : levelColor,
                        background: isActive
                          ? levelColor
                          : "transparent",
                        borderColor: levelColor,
                      }}
                    >
                      <span>
                        {isActive
                          ? "Viewing Curriculum"
                          : "Explore Level"}
                      </span>

                      {isActive ? (
                        <ChevronDown size={15} />
                      ) : (
                        <ChevronRight size={15} />
                      )}
                    </div>
                  </motion.button>
                </EditableWrap>
              );
            }
          )}
        </motion.div>

        {/* ===================================================
            CURRICULUM PANEL
        =================================================== */}
        <AnimatePresence mode="wait">
          {activeLevel && (
            <motion.div
              key={activeLevel.id}
              initial={{
                opacity: 0,
                y: 20,
                scale: 0.98,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: -15,
                scale: 0.96,
              }}
              transition={{
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
              id="rr-active-curriculum-panel"
              className="rr-academics-curriculum"
              style={{
                ...globalStyles.curriculumPanel,
                borderTopColor:
                  activeLevel.color ||
                  theme.rose,
              }}
            >
              {/* PANEL HEADER */}
              <motion.div
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.4,
                  delay: 0.1,
                }}
                className="rr-academics-panel-header"
                style={globalStyles.panelHeader}
              >
                <EditableWrap
                  editMode={editMode}
                  target={{
                    type: "classLevel",
                    index:
                      classLevels.findIndex(
                        (level) =>
                          level.id ===
                          activeLevel.id
                      ),
                  }}
                  onEditTarget={onEditTarget}
                  onDeleteTarget={
                    onDeleteTarget
                  }
                  canDelete={
                    classLevels.length > 1
                  }
                  label="Edit academic level"
                >
                  <div
                    style={
                      globalStyles.panelHeaderLeft
                    }
                  >
                    <span
                      className="rr-mono"
                      style={{
                        ...globalStyles.panelBadge,
                        color:
                          activeLevel.color ||
                          theme.rose,
                        background:
                          activeLevel.bgAccent ||
                          "rgba(156,39,72,0.10)",
                        borderColor:
                          activeLevel.borderAccent ||
                          "rgba(156,39,72,0.20)",
                      }}
                    >
                      {activeLevel.name} ·{" "}
                      {activeLevel.span}
                    </span>

                    {activeLevel.tagline && (
                      <h3
                        className="rr-serif"
                        style={
                          globalStyles.panelTitle
                        }
                      >
                        {activeLevel.tagline}
                      </h3>
                    )}

                    {activeLevel.description && (
                      <p
                        style={
                          globalStyles.panelDescription
                        }
                      >
                        {activeLevel.description}
                      </p>
                    )}
                  </div>
                </EditableWrap>

                <motion.div
                  initial={{
                    opacity: 0,
                    x: 10,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    duration: 0.4,
                    delay: 0.2,
                  }}
                  className="rr-academics-age-card"
                  style={{
                    ...globalStyles.ageCard,
                    borderColor:
                      activeLevel.borderAccent ||
                      "rgba(156,39,72,0.20)",
                  }}
                >
                  <span
                    className="rr-mono"
                    style={{
                      color: theme.textMuted,
                      fontSize: "10px",
                      fontWeight: 700,
                      textTransform:
                        "uppercase",
                      letterSpacing:
                        "0.12em",
                    }}
                  >
                    Target Age
                  </span>

                  <strong
                    style={{
                      color:
                        activeLevel.color ||
                        theme.rose,
                    }}
                  >
                    {activeLevel.ageGroup ||
                      "N/A"}
                  </strong>
                </motion.div>
              </motion.div>

              {/* CLASS TABS */}
              {visibleClasses.length > 1 && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.4,
                    delay: 0.15,
                  }}
                  className="rr-academics-class-tabs"
                  style={
                    globalStyles.classTabsContainer
                  }
                >
                  <span
                    className="rr-mono"
                    style={
                      globalStyles.classTabLabel
                    }
                  >
                    Select Class
                  </span>

                  <div
                    className="rr-academics-class-tabs-group"
                    style={
                      globalStyles.classTabsGroup
                    }
                  >
                    {visibleClasses.map(
                      (cls, idx) => {
                        const isActive =
                          activeClassIndex ===
                          idx;

                        const realClassIndex =
                          (
                            activeLevel.classes ||
                            []
                          ).findIndex(
                            (item) =>
                              item.id ===
                              cls.id
                          );

                        return (
                          <EditableWrap
                            key={
                              cls.id || idx
                            }
                            editMode={
                              editMode
                            }
                            target={{
                              type: "classItem",
                              levelIndex:
                                classLevels.findIndex(
                                  (level) =>
                                    level.id ===
                                    activeLevel.id
                                ),
                              classIndex:
                                realClassIndex >=
                                0
                                  ? realClassIndex
                                  : idx,
                            }}
                            onEditTarget={
                              onEditTarget
                            }
                            onDeleteTarget={
                              onDeleteTarget
                            }
                            canDelete={
                              visibleClasses.length >
                              1
                            }
                            label="Edit class"
                          >
                            <button
                              type="button"
                              className="rr-class-tab"
                              onClick={() =>
                                setActiveClassIndex(
                                  idx
                                )
                              }
                              style={{
                                ...globalStyles.classTabBtn,
                                background:
                                  isActive
                                    ? activeLevel.color ||
                                      theme.rose
                                    : theme.card,
                                color: isActive
                                  ? theme.white
                                  : theme.ink,
                                borderColor:
                                  isActive
                                    ? activeLevel.color ||
                                      theme.rose
                                    : theme.paperDeep,
                              }}
                            >
                              {cls.name ||
                                "Class"}
                            </button>
                          </EditableWrap>
                        );
                      }
                    )}
                  </div>
                </motion.div>
              )}

              {/* ADD CLASS */}
              <div className="flex justify-end mb-4">
                <SectionAddButton
                  editMode={editMode}
                  label="Add Class"
                  type="classItem"
                  target={{
                    type: "classItem",
                    levelIndex:
                      classLevels.findIndex(
                        (level) =>
                          level.id ===
                          activeLevel.id
                      ),
                  }}
                  onAddTarget={
                    onAddTarget
                  }
                />
              </div>

              {/* CURRICULUM CONTENT */}
              <motion.div
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.5,
                  delay: 0.2,
                }}
                className="rr-academics-panel-grid"
                style={
                  globalStyles.curriculumGrid
                }
              >
                {/* SUBJECTS */}
                <motion.div
                  initial={{
                    opacity: 0,
                    x: -20,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: 0.25,
                  }}
                  className="rr-academics-inner-card"
                  style={globalStyles.innerCard}
                >
                  <div
                    style={
                      globalStyles.innerHeading
                    }
                  >
                    <span
                      style={{
                        ...globalStyles.headingDot,
                        background:
                          activeLevel.color ||
                          theme.rose,
                      }}
                    />

                    <div>
                      <span
                        className="rr-mono"
                        style={
                          globalStyles.headingEyebrow
                        }
                      >
                        Curriculum
                      </span>

                      <h4
                        style={
                          globalStyles.innerTitle
                        }
                      >
                        Subject Breakdown
                      </h4>
                    </div>
                  </div>

                  <p
                    style={
                      globalStyles.innerSubtext
                    }
                  >
                    {activeClass.name ||
                      "Class"}
                  </p>

                  <div
                    style={
                      globalStyles.subjectsList
                    }
                  >
                    {(activeClass.subjects ||
                      []).map(
                      (item, index) => (
                        <motion.div
                          key={`${item.name}-${index}`}
                          className="rr-subject-row"
                          initial={{
                            opacity: 0,
                            x: -10,
                          }}
                          animate={{
                            opacity: 1,
                            x: 0,
                          }}
                          transition={{
                            duration: 0.3,
                            delay:
                              0.3 +
                              index * 0.04,
                          }}
                          style={
                            globalStyles.subjectRow
                          }
                        >
                          <div
                            style={
                              globalStyles.subjectLeft
                            }
                          >
                            <span
                              className="rr-mono"
                              style={{
                                color:
                                  activeLevel.color ||
                                  theme.rose,
                                fontSize: "10px",
                                fontWeight: 700,
                                minWidth: "22px",
                              }}
                            >
                              {item.sn ?? index + 1}
                            </span>

                            <span
                              style={{
                                ...globalStyles.subjectBullet,
                                background:
                                  activeLevel.color ||
                                  theme.rose,
                              }}
                            />

                            <span
                              style={
                                globalStyles.subjectName
                              }
                            >
                              {item.name ||
                                "Subject"}
                            </span>
                          </div>

                          <div
                            className="rr-academics-subject-right"
                            style={
                              globalStyles.subjectRight
                            }
                          >
                            <span
                              className="rr-academics-subject-type"
                              style={{
                                ...globalStyles.subjectType,
                                color:
                                  item.type ===
                                    "Practical" ||
                                  item.type ===
                                    "Lab" ||
                                  item.type ===
                                    "Elective"
                                    ? theme.moss
                                    : theme.rose,
                                background:
                                  item.type ===
                                    "Practical" ||
                                  item.type ===
                                    "Lab" ||
                                  item.type ===
                                    "Elective"
                                    ? `${theme.moss}0D`
                                    : `${theme.rose}0D`,
                              }}
                            >
                              {item.type ||
                                "Core"}
                            </span>

                            {item.hours && (
                              <span
                                style={
                                  globalStyles.subjectHours
                                }
                              >
                                {item.hours}
                              </span>
                            )}
                          </div>
                        </motion.div>
                      )
                    )}
                  </div>
                </motion.div>

                {/* DETAILS */}
                <motion.div
                  initial={{
                    opacity: 0,
                    x: 20,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: 0.3,
                  }}
                  style={
                    globalStyles.detailsColumn
                  }
                >
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.4,
                      delay: 0.35,
                    }}
                    className="rr-academics-inner-card"
                    style={
                      globalStyles.innerCard
                    }
                  >
                    <div
                      style={
                        globalStyles.innerHeading
                      }
                    >
                      <span
                        style={{
                          ...globalStyles.headingDot,
                          background:
                            activeLevel.color ||
                            theme.rose,
                        }}
                      />

                      <div>
                        <span
                          className="rr-mono"
                          style={
                            globalStyles.headingEyebrow
                          }
                        >
                          Learning Experience
                        </span>

                        <h4
                          style={
                            globalStyles.innerTitle
                          }
                        >
                          Curriculum Highlights
                        </h4>
                      </div>
                    </div>

                    <ul
                      className="rr-academics-highlights-list"
                      style={
                        globalStyles.highlightsList
                      }
                    >
                      {(
                        activeClass.curriculumHighlights ||
                        []
                      ).map(
                        (item, index) => (
                          <motion.li
                            key={index}
                            initial={{
                              opacity: 0,
                              x: -10,
                            }}
                            animate={{
                              opacity: 1,
                              x: 0,
                            }}
                            transition={{
                              duration: 0.3,
                              delay:
                                0.4 +
                                index *
                                  0.08,
                            }}
                            style={
                              globalStyles.highlightItem
                            }
                          >
                            <span
                              className="rr-mono"
                              style={{
                                ...globalStyles.highlightNumber,
                                color:
                                  activeLevel.color ||
                                  theme.rose,
                              }}
                            >
                              {String(
                                index + 1
                              ).padStart(
                                2,
                                "0"
                              )}
                            </span>

                            <span>
                              {item}
                            </span>
                          </motion.li>
                        )
                      )}
                    </ul>
                  </motion.div>

                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.4,
                      delay: 0.45,
                    }}
                    style={{
                      ...globalStyles.assessmentCard,
                      borderLeftColor:
                        activeLevel.color ||
                        theme.rose,
                    }}
                  >
                    <span
                      className="rr-mono"
                      style={
                        globalStyles.headingEyebrow
                      }
                    >
                      Evaluation & Assessment
                    </span>

                    <p
                      style={
                        globalStyles.assessmentText
                      }
                    >
                      {activeClass.assessmentMethod ||
                        "Regular academic assessment and examinations."}
                    </p>
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* =====================================================
          STRENGTHS
      ===================================================== */}
      <section
        className="rr-academics-strengths"
        style={globalStyles.strengthsSection}
      >
        <div style={globalStyles.sectionContainer}>
          <SectionIntro
            eyebrow={
              data.strengthsHeading?.eyebrow ||
              "What Sets Us Apart"
            }
            title={
              data.strengthsHeading?.title ||
              'Our <span style="color: #9C2748;">Academic Strengths</span>'
            }
            description={
              data.strengthsHeading?.description ||
              "A balanced academic structure supporting student development."
            }
            align="left"
          />

          {editMode && (
            <div className="flex justify-end mb-4">
              <SectionAddButton
                editMode={editMode}
                label="Add Strength"
                type="strength"
                onAddTarget={onAddTarget}
              />
            </div>
          )}

          <div
            className="rr-academics-strengths-grid"
            style={globalStyles.strengthsGrid}
          >
            {visibleStrengths.map(
              (strength, index) => {
                const realIndex =
                  data.strengths.findIndex(
                    (s) =>
                      s.id === strength.id
                  );

                return (
                  <EditableWrap
                    key={
                      strength.id || index
                    }
                    editMode={editMode}
                    target={{
                      type: "strengthCard",
                      index:
                        realIndex >= 0
                          ? realIndex
                          : index,
                    }}
                    onEditTarget={
                      onEditTarget
                    }
                    onDeleteTarget={
                      onDeleteTarget
                    }
                    canDelete={
                      visibleStrengths.length >
                      1
                    }
                    label="Edit strength"
                  >
                    <motion.article
                      initial={{
                        opacity: 0,
                        y: 20,
                        scale: 0.96,
                      }}
                      whileInView={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                      }}
                      viewport={{
                        once: true,
                        amount: 0.15,
                      }}
                      transition={{
                        duration: 0.5,
                        delay:
                          index * 0.08,
                      }}
                      style={{
                        ...globalStyles.strengthCard,
                        minHeight: "230px",
                      }}
                    >
                      <span
                        style={{
                          position:
                            "absolute",
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: "4px",
                          background:
                            strength.color ||
                            theme.rose,
                        }}
                      />

                      <span
                        aria-hidden="true"
                        style={{
                          position:
                            "absolute",
                          right: "22px",
                          top: "16px",
                          fontFamily:
                            "Georgia, serif",
                          fontSize:
                            "70px",
                          lineHeight: 1,
                          color:
                            strength.color ||
                            theme.rose,
                          opacity: 0.08,
                          fontWeight: 700,
                        }}
                      >
                        {(strength.title ||
                          "S").charAt(0)}
                      </span>

                      <div
                        style={
                          globalStyles.strengthContent
                        }
                      >
                        <h4
                          className="rr-serif"
                          style={
                            globalStyles.strengthTitle
                          }
                        >
                          {strength.title ||
                            "New Strength"}
                        </h4>

                        <p
                          style={
                            globalStyles.strengthDescription
                          }
                        >
                          {strength.description ||
                            "Describe the academic strength of the school."}
                        </p>
                      </div>

                      <span
                        style={{
                          ...globalStyles.cardLine,
                          background:
                            strength.color ||
                            theme.rose,
                        }}
                      />
                    </motion.article>
                  </EditableWrap>
                );
              }
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          ACHIEVEMENTS
      ===================================================== */}
      <section
        className="rr-academics-achievements"
        style={
          globalStyles.achievementsSection
        }
      >
        <div
          style={globalStyles.sectionContainer}
        >
          <SectionIntro
            eyebrow={
              data.achievementsHeading
                ?.eyebrow ||
              "Academic Journey"
            }
            title={
              data.achievementsHeading
                ?.title ||
              'Building <span style="color: #9C2748;">Student Success</span>'
            }
            description={
              data.achievementsHeading
                ?.description ||
              "A progressive curriculum helps students grow throughout their school years."
            }
            align="center"
          />

          {editMode && (
            <div className="flex justify-end mb-4">
              <SectionAddButton
                editMode={editMode}
                label="Add Achievement"
                type="achievement"
                onAddTarget={
                  onAddTarget
                }
              />
            </div>
          )}

          <div
            className="rr-achievements-grid"
            style={
              globalStyles.achievementsGrid
            }
          >
            {visibleAchievements.map(
              (achievement, index) => {
                const realIndex =
                  data.achievements.findIndex(
                    (a) =>
                      a.id ===
                      achievement.id
                  );

                return (
                  <EditableWrap
                    key={
                      achievement.id ||
                      index
                    }
                    editMode={editMode}
                    target={{
                      type:
                        "achievementCard",
                      index:
                        realIndex >= 0
                          ? realIndex
                          : index,
                    }}
                    onEditTarget={
                      onEditTarget
                    }
                    onDeleteTarget={
                      onDeleteTarget
                    }
                    canDelete={
                      visibleAchievements.length >
                      1
                    }
                    label="Edit achievement"
                  >
                    <motion.article
                      initial={{
                        opacity: 0,
                        y: 25,
                        scale: 0.97,
                      }}
                      whileInView={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                      }}
                      viewport={{
                        once: true,
                        amount: 0.15,
                      }}
                      transition={{
                        duration: 0.5,
                        delay:
                          index * 0.08,
                      }}
                      style={
                        globalStyles.achievementCard
                      }
                    >
                      <span
                        className="rr-mono"
                        style={
                          globalStyles.achievementNumber
                        }
                      >
                        {String(
                          index + 1
                        ).padStart(
                          2,
                          "0"
                        )}
                      </span>

                      <div
                        style={
                          globalStyles.achievementContent
                        }
                      >
                        <h4
                          className="rr-serif"
                          style={
                            globalStyles.achievementTitle
                          }
                        >
                          {achievement.title ||
                            "New Achievement"}
                        </h4>

                        <p
                          style={
                            globalStyles.achievementDescription
                          }
                        >
                          {achievement.description ||
                            "Describe the academic achievement."}
                        </p>
                      </div>

                      <span
                        style={
                          globalStyles.achievementLine
                        }
                      />
                    </motion.article>
                  </EditableWrap>
                );
              }
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          ASSESSMENT
      ===================================================== */}
      <section
        className="rr-academics-assessment"
        style={
          globalStyles.assessmentSection
        }
      >
        <div
          style={globalStyles.sectionContainer}
        >
          <EditableWrap
            editMode={editMode}
            target={{
              type: "assessment",
            }}
            onEditTarget={
              onEditTarget
            }
            label="Edit assessment"
          >
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.2,
              }}
              transition={{
                duration: 0.6,
              }}
              className="rr-academics-assessment-content"
              style={
                globalStyles.assessmentContent
              }
            >
              <motion.div
                initial={{
                  opacity: 0,
                  x: -20,
                }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.5,
                  delay: 0.1,
                }}
              >
                <div
                  style={
                    globalStyles.eyebrow
                  }
                >
                  <span
                    style={
                      globalStyles.eyebrowLine
                    }
                  />

                  <span className="rr-mono">
                    {data.assessmentHeading
                      ?.eyebrow ||
                      "Assessment & Growth"}
                  </span>
                </div>

                <h2
                  className="rr-serif"
                  style={
                    globalStyles.assessmentTitle
                  }
                >
                  {data.assessment.title ||
                    data.assessmentHeading
                      ?.title ||
                    "Assessment & Academic Growth"}
                </h2>

                <p
                  style={
                    globalStyles.assessmentDescription
                  }
                >
                  {data.assessment.description ||
                    data.assessmentHeading
                      ?.description ||
                    "Regular evaluation helps teachers and students understand progress."}
                </p>
              </motion.div>

              <motion.div
                initial={{
                  opacity: 0,
                  x: 20,
                }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.5,
                  delay: 0.2,
                }}
                className="rr-academics-assessment-methods"
                style={
                  globalStyles.assessmentMethods
                }
              >
                {(
                  data.assessment.methods ||
                  []
                ).map(
                  (method, index) => (
                    <motion.div
                      key={index}
                      className="rr-assessment-method rr-academics-assessment-method"
                      initial={{
                        opacity: 0,
                        y: 10,
                      }}
                      whileInView={{
                        opacity: 1,
                        y: 0,
                      }}
                      viewport={{
                        once: true,
                      }}
                      transition={{
                        duration: 0.4,
                        delay:
                          0.3 +
                          index * 0.06,
                      }}
                      style={
                        globalStyles.assessmentMethod
                      }
                    >
                      <span
                        className="rr-mono"
                        style={{
                          color:
                            theme.rose,
                          fontSize:
                            "11px",
                          fontWeight: 700,
                        }}
                      >
                        {String(
                          index + 1
                        ).padStart(
                          2,
                          "0"
                        )}
                      </span>

                      <span>
                        {method}
                      </span>
                    </motion.div>
                  )
                )}
              </motion.div>
            </motion.div>
          </EditableWrap>
        </div>
      </section>
    </div>
  );
};

// ============================================================
// GLOBAL STYLES OBJECT
// ============================================================
const globalStyles = {
  page: {
    minHeight: "100vh",
    background: theme.paper,
    overflowX: "hidden",
    paddingTop: "82px",
  },

  hero: {
    background: theme.paper,
    padding: "48px 24px 74px",
  },

  heroCard: {
    position: "relative",
    maxWidth: "1180px",
    minHeight: "390px",
    margin: "0 auto",
    overflow: "hidden",
    borderRadius: "0 0 34px 34px",
    background:
      "linear-gradient(160deg, #FDEDEE 0%, #FBD9DC 55%, #F6C3C8 100%)",
    boxShadow:
      "0 24px 55px rgba(179,76,106,0.20)",
  },

  heroInner: {
    position: "relative",
    zIndex: 2,
    maxWidth: "800px",
    padding:
      "72px clamp(32px, 6vw, 76px) 92px",
  },

  heroTitle: {
    margin: "18px 0 20px",
    color: theme.ink,
    fontSize:
      "clamp(2.7rem, 5vw, 4.7rem)",
    lineHeight: 1.01,
    fontWeight: 600,
    letterSpacing: "-0.045em",
  },

  heroLead: {
    maxWidth: "720px",
    margin: "0 0 13px",
    color: theme.text,
    fontSize:
      "clamp(1rem, 1.5vw, 1.2rem)",
    fontWeight: 600,
    lineHeight: 1.65,
  },

  heroDescription: {
    maxWidth: "760px",
    margin: 0,
    color: theme.textMuted,
    fontSize: "14px",
    lineHeight: 1.8,
  },

  eyebrow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  eyebrowLine: {
    width: "34px",
    height: "1px",
    background: theme.roseDeep,
  },

  eyebrowText: {
    color: theme.roseDeep,
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.22em",
    textTransform: "uppercase",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, 1fr)",
    gap: "16px",
    maxWidth: "1180px",
    margin: "0 auto",
    padding: "0",
  },

  statCard: {
    padding: "20px 16px",
    textAlign: "center",
    background: theme.card,
    border: "1px solid",
    borderRadius: "16px",
    boxShadow:
      "0 12px 30px rgba(30,20,32,0.06)",
  },

  statValue: {
    fontSize: "28px",
    fontWeight: 700,
    fontFamily:
      "Georgia, 'Times New Roman', serif",
    display: "block",
  },

  statLabel: {
    fontSize: "11px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    color: theme.textMuted,
    marginTop: "4px",
    display: "block",
  },

  levelsSection: {
    background: theme.paper,
    padding: "82px 24px 90px",
    maxWidth: "1280px",
    margin: "0 auto",
  },

  levelsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, minmax(0, 1fr))",
    gap: "18px",
    marginBottom: "38px",
  },

  levelCard: {
    padding: "24px",
    borderRadius: "18px",
    border: "1px solid",
    background: theme.card,
    textAlign: "left",
    cursor: "pointer",
    transition:
      "border-color 0.25s ease, box-shadow 0.25s ease",
    color: theme.ink,
  },

  levelCardNumber: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
    marginBottom: "25px",
  },

  levelBadge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "5px 10px",
    borderRadius: "30px",
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },

  levelName: {
    margin: "0 0 8px",
    fontSize: "22px",
    lineHeight: 1.12,
    fontWeight: 600,
  },

  levelSpan: {
    margin: "0 0 15px",
    color: theme.textMuted,
    fontSize: "13px",
    fontWeight: 600,
    lineHeight: 1.5,
  },

  levelAgePill: {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: "8px",
    fontSize: "11px",
    fontWeight: 700,
    marginBottom: "22px",
  },

  levelSelect: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
    width: "100%",
    padding: "11px 14px",
    borderRadius: "11px",
    border: "1px solid",
    fontSize: "12px",
    fontWeight: 700,
    transition: "all 0.3s ease",
  },

  curriculumPanel: {
    background: theme.card,
    border: `1px solid ${theme.paperDeep}`,
    borderTop: "4px solid",
    borderRadius: "22px",
    padding: "34px",
    boxShadow:
      "0 12px 35px rgba(30,20,32,0.055)",
  },

  panelHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "28px",
    paddingBottom: "26px",
    marginBottom: "26px",
    borderBottom:
      `1px solid ${theme.paperDeep}`,
  },

  panelHeaderLeft: {
    maxWidth: "780px",
  },

  panelBadge: {
    display: "inline-block",
    padding: "6px 12px",
    border: "1px solid",
    borderRadius: "30px",
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "0.11em",
    textTransform: "uppercase",
    marginBottom: "14px",
  },

  panelTitle: {
    margin: "0 0 10px",
    color: theme.ink,
    fontSize:
      "clamp(1.75rem, 3vw, 2.5rem)",
    lineHeight: 1.1,
    fontWeight: 600,
  },

  panelDescription: {
    margin: 0,
    color: theme.textMuted,
    fontSize: "14px",
    lineHeight: 1.75,
  },

  ageCard: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    minWidth: "150px",
    padding: "14px 16px",
    border: "1px solid",
    borderRadius: "14px",
    background: theme.paper,
  },

  classTabsContainer: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "14px",
    padding: "13px 15px",
    marginBottom: "26px",
    border:
      `1px solid ${theme.paperDeep}`,
    borderRadius: "13px",
    background: theme.paper,
  },

  classTabLabel: {
    color: theme.textMuted,
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
  },

  classTabsGroup: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },

  classTabBtn: {
    padding: "8px 14px",
    border: "1px solid",
    borderRadius: "9px",
    fontSize: "12px",
    fontWeight: 700,
    cursor: "pointer",
    transition:
      "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
  },

  curriculumGrid: {
    display: "grid",
    gridTemplateColumns:
      "minmax(0, 1.1fr) minmax(300px, 0.9fr)",
    gap: "22px",
  },

  innerCard: {
    background: theme.paper,
    border:
      `1px solid ${theme.paperDeep}`,
    borderRadius: "17px",
    padding: "24px",
  },

  innerHeading: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    marginBottom: "6px",
  },

  headingDot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    marginTop: "7px",
    flexShrink: 0,
  },

  headingEyebrow: {
    display: "block",
    color: theme.textMuted,
    fontSize: "9px",
    fontWeight: 700,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    marginBottom: "4px",
  },

  innerTitle: {
    margin: 0,
    color: theme.ink,
    fontSize: "18px",
    lineHeight: 1.25,
    fontWeight: 800,
  },

  innerSubtext: {
    margin: "0 0 18px 19px",
    color: theme.textMuted,
    fontSize: "12px",
    fontWeight: 600,
  },

  subjectsList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  subjectRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "14px",
    padding: "12px 13px",
    borderRadius: "10px",
    background: theme.card,
    border:
      `1px solid ${theme.paperDeep}`,
    transition: "all 0.3s ease",
  },

  subjectLeft: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    minWidth: 0,
  },

  subjectBullet: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    flexShrink: 0,
  },

  subjectName: {
    color: theme.ink,
    fontSize: "13px",
    fontWeight: 700,
    lineHeight: 1.45,
  },

  subjectRight: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "10px",
    flexShrink: 0,
  },

  subjectType: {
    padding: "4px 8px",
    borderRadius: "7px",
    fontSize: "9px",
    fontWeight: 700,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    whiteSpace: "nowrap",
  },

  subjectHours: {
    color: theme.textMuted,
    fontSize: "11px",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },

  detailsColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "22px",
  },

  highlightsList: {
    listStyle: "none",
    padding: 0,
    margin: "20px 0 0",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  highlightItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    color: theme.text,
    fontSize: "13px",
    lineHeight: 1.65,
  },

  highlightNumber: {
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    paddingTop: "2px",
    flexShrink: 0,
  },

  assessmentCard: {
    padding: "21px 22px",
    background: theme.paper,
    border:
      `1px solid ${theme.paperDeep}`,
    borderLeft: "3px solid",
    borderRadius: "13px",
  },

  assessmentText: {
    margin: "8px 0 0",
    color: theme.rose,
    fontSize: "13px",
    fontWeight: 700,
    lineHeight: 1.65,
  },

  strengthsSection: {
    background: theme.paper,
    padding: "76px 24px 88px",
  },

  sectionContainer: {
    maxWidth: "1180px",
    margin: "0 auto",
  },

  strengthsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, minmax(0, 1fr))",
    gap: "22px",
    marginTop: "44px",
  },

  strengthCard: {
    position: "relative",
    minHeight: "230px",
    padding: "34px 28px 32px",
    overflow: "hidden",
    background: theme.card,
    border:
      `1px solid ${theme.paperDeep}`,
    borderRadius: "24px",
    boxShadow:
      "0 12px 30px rgba(30,20,32,0.055)",
    transition:
      "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
  },

  strengthContent: {
    position: "relative",
    zIndex: 2,
    maxWidth: "390px",
  },

  strengthTitle: {
    margin: "40px 0 12px",
    color: theme.ink,
    fontSize: "21px",
    lineHeight: 1.15,
    fontWeight: 600,
  },

  strengthDescription: {
    margin: 0,
    color: theme.textMuted,
    fontSize: "13.5px",
    lineHeight: 1.75,
    maxWidth: "370px",
  },

  cardLine: {
    position: "absolute",
    left: "28px",
    bottom: "22px",
    width: "40px",
    height: "3px",
    borderRadius: "4px",
  },

  achievementsSection: {
    background: theme.paper,
    padding: "84px 24px 90px",
  },

  achievementsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: "24px",
    marginTop: "10px",
  },

  achievementCard: {
    position: "relative",
    padding: "32px 28px 28px",
    background: theme.card,
    border:
      `1px solid ${theme.paperDeep}`,
    borderRadius: "20px",
    boxShadow:
      "0 12px 30px rgba(30,20,32,0.055)",
    display: "flex",
    flexDirection: "column",
    minHeight: "180px",
    transition:
      "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
  },

  achievementNumber: {
    color: theme.gold,
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.12em",
    marginBottom: "12px",
  },

  achievementContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },

  achievementTitle: {
    margin: "0 0 10px",
    color: theme.ink,
    fontSize: "20px",
    lineHeight: 1.2,
    fontWeight: 600,
  },

  achievementDescription: {
    margin: 0,
    color: theme.textMuted,
    fontSize: "14px",
    lineHeight: 1.7,
  },

  achievementLine: {
    position: "absolute",
    left: "28px",
    bottom: "0",
    width: "40px",
    height: "3px",
    borderRadius: "4px",
    background: theme.gold,
    opacity: 0.3,
  },

  assessmentSection: {
    background: theme.paperDeep,
    padding: "84px 24px 90px",
    borderTop:
      `1px solid ${theme.paperDeep}`,
  },

  assessmentContent: {
    display: "grid",
    gridTemplateColumns:
      "minmax(0, 0.9fr) minmax(320px, 1.1fr)",
    gap: "60px",
    alignItems: "start",
  },

  assessmentTitle: {
    margin: "18px 0 13px",
    color: theme.ink,
    fontSize:
      "clamp(2rem, 4vw, 3.2rem)",
    lineHeight: 1.04,
    fontWeight: 600,
    letterSpacing: "-0.03em",
  },

  assessmentDescription: {
    maxWidth: "500px",
    margin: 0,
    color: theme.textMuted,
    fontSize: "15px",
    lineHeight: 1.75,
  },

  assessmentMethods: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    borderTop:
      "1px solid rgba(30,20,32,0.14)",
  },

  assessmentMethod: {
    display: "flex",
    alignItems: "flex-start",
    gap: "13px",
    padding: "17px 14px",
    borderBottom:
      "1px solid rgba(30,20,32,0.14)",
    color: theme.text,
    fontSize: "13px",
    fontWeight: 600,
    lineHeight: 1.5,
  },
};

export default AcademicsPage;
