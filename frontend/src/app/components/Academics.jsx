import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { ChevronDown, ChevronRight } from "lucide-react";

// ============================================================
// RED ROSE ACADEMICS PAGE
// Simple editorial design — matched to the About page
// ============================================================

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

      .rr-academics button:focus-visible {
        outline: 2px solid ${theme.gold};
        outline-offset: 3px;
      }

      .rr-academics-panel-grid {
        grid-template-columns: minmax(0, 1.05fr) minmax(300px, 0.95fr);
      }

      .rr-academics-hero-card::after {
        content: "";
        position: absolute;
        z-index: 3;
        left: 0;
        right: 0;
        bottom: -1px;
        height: 30px;
        background: ${theme.paper};
        clip-path: polygon(
          0 38%, 2% 72%, 4% 38%, 6% 72%, 8% 38%, 10% 72%,
          12% 38%, 14% 72%, 16% 38%, 18% 72%, 20% 38%, 22% 72%,
          24% 38%, 26% 72%, 28% 38%, 30% 72%, 32% 38%, 34% 72%,
          36% 38%, 38% 72%, 40% 38%, 42% 72%, 44% 38%, 46% 72%,
          48% 38%, 50% 72%, 52% 38%, 54% 72%, 56% 38%, 58% 72%,
          60% 38%, 62% 72%, 64% 38%, 66% 72%, 68% 38%, 70% 72%,
          72% 38%, 74% 72%, 76% 38%, 78% 72%, 80% 38%, 82% 72%,
          84% 38%, 86% 72%, 88% 38%, 90% 72%, 92% 38%, 94% 72%,
          96% 38%, 98% 72%, 100% 38%, 100% 100%, 0 100%
        );
      }

      .rr-strength-accent {
        position: absolute;
        top: 0;
        left: 32px;
        width: 42px;
        height: 7px;
        border-radius: 0 0 7px 7px;
        z-index: 3;
        transition: width 0.4s ease;
      }

      .rr-strength-card:hover .rr-strength-accent {
        width: 70px;
      }

      .rr-strength-letter {
        position: absolute;
        top: -12px;
        right: 16px;
        z-index: 1;
        color: rgba(156,39,72,0.055);
        font-family: 'Fraunces', Georgia, serif;
        font-size: 118px;
        line-height: 1;
        font-weight: 600;
        pointer-events: none;
        transition: all 0.5s ease;
      }

      .rr-strength-card:hover .rr-strength-letter {
        transform: scale(1.08) rotate(-2deg);
        opacity: 0.12;
      }

      .rr-achievement-card {
        transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
      }

      .rr-achievement-card:hover {
        transform: translateY(-6px);
        box-shadow: 0 20px 50px rgba(30,20,32,0.10);
        border-color: ${theme.gold}55;
      }

      .rr-achievement-card:hover .rr-achievement-line {
        width: 70px;
        opacity: 0.6;
      }

      .rr-achievement-line {
        transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);
      }

      .rr-level-card {
        transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
      }

      .rr-level-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 16px 40px rgba(30,20,32,0.08) !important;
      }

      .rr-level-card .rr-level-select {
        transition: all 0.3s ease;
      }

      .rr-level-card:hover .rr-level-select {
        transform: translateX(4px);
      }

      .rr-subject-row {
        transition: all 0.3s ease;
      }

      .rr-subject-row:hover {
        background: ${theme.paper};
        border-color: ${theme.gold}30;
        transform: translateX(4px);
      }

      .rr-strength-card {
        transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
      }

      .rr-strength-card:hover {
        transform: translateY(-6px);
        box-shadow: 0 20px 50px rgba(30,20,32,0.08);
      }

      .rr-strength-card:hover .rr-card-line {
        width: 70px;
      }

      .rr-card-line {
        transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);
      }

      .rr-assessment-method {
        transition: all 0.3s ease;
      }

      .rr-assessment-method:hover {
        background: ${theme.card};
        transform: translateX(4px);
        border-color: ${theme.gold}30;
      }

      .rr-class-tab {
        transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
      }

      .rr-class-tab:hover:not(.active) {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(30,20,32,0.06);
      }

      .rr-class-tab.active {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(156,39,72,0.20);
      }

      @media (max-width: 1000px) {
        .rr-academics-strengths-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      @media (max-width: 900px) {
        .rr-academics-panel-grid {
          grid-template-columns: 1fr;
        }

        .rr-academics-strengths-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      @media (max-width: 640px) {
        .rr-academics-hero {
          padding-top: 28px !important;
          padding-bottom: 48px !important;
        }

        .rr-academics-hero-card {
          min-height: 0 !important;
          border-radius: 0 0 24px 24px !important;
        }

        .rr-academics-hero-inner {
          padding: 54px 24px 72px !important;
        }

        .rr-academics-strengths-grid {
          grid-template-columns: 1fr !important;
        }

        .rr-academics-levels,
        .rr-academics-strengths,
        .rr-academics-achievements,
        .rr-academics-assessment {
          padding-left: 18px !important;
          padding-right: 18px !important;
        }

        .rr-academics-level-card {
          padding: 20px !important;
        }

        .rr-academics-curriculum {
          padding: 24px 18px !important;
        }

        .rr-academics-subject-row {
          align-items: flex-start !important;
          flex-direction: column !important;
          gap: 8px !important;
        }

        .rr-academics-subject-right {
          width: 100%;
          justify-content: space-between !important;
        }

        .rr-achievements-grid {
          grid-template-columns: 1fr !important;
        }
      }

      @media (max-width: 500px) {
        .rr-achievements-grid {
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
// CLASS LEVELS & CURRICULUM DATA
// ============================================================

const classLevelsData = [
  {
    id: "pre-primary",
    name: "Pre-Primary / Early Years",
    shortBadge: "Early Childhood",
    span: "Play Group, Nursery, LKG, UKG",
    ageGroup: "3 – 5.5 Years",
    color: theme.gold,
    bgAccent: "rgba(185, 138, 66, 0.12)",
    borderAccent: "rgba(185, 138, 66, 0.25)",
    tagline: "Foundation of Curiosity, Play-Based Learning & Motor Skills",
    description:
      "Our early childhood program nurtures young minds through playful exploration, sensory exercises, phonics, storytelling, and creative arts in a safe and supportive environment.",
    classes: [
      {
        id: "pg-nursery",
        name: "Play Group & Nursery",
        focus: "Sensory, Language Readiness & Social Interaction",
        subjects: [
          { name: "Phonics & Rhymes", type: "Core", hours: "5 hrs/wk" },
          { name: "Picture Reading & Storytelling", type: "Core", hours: "4 hrs/wk" },
          { name: "Number Games & Counting", type: "Core", hours: "4 hrs/wk" },
          { name: "Creative Arts & Craft", type: "Activity", hours: "5 hrs/wk" },
          { name: "Play & Motor Skills", type: "Activity", hours: "4 hrs/wk" },
        ],
        curriculumHighlights: [
          "Montessori-inspired tactile learning corners & play zones",
          "Daily storytelling sessions in conversational English & Nepali",
          "Zero exam pressure: Individual progress tracked via monthly milestone logs",
          "Basic color identification, pattern recognition, and fine motor development",
        ],
        assessmentMethod: "Continuous Activity Milestone Logs & Parent Progress Conferences",
      },
      {
        id: "lkg-ukg",
        name: "LKG & UKG",
        focus: "Early Literacy, Numeracy & Environmental Awareness",
        subjects: [
          { name: "English Reading & Writing", type: "Core", hours: "6 hrs/wk" },
          { name: "Nepali Barnamala & Words", type: "Core", hours: "5 hrs/wk" },
          { name: "Elementary Mathematics", type: "Core", hours: "5 hrs/wk" },
          { name: "General Knowledge & Nature", type: "Core", hours: "3 hrs/wk" },
          { name: "Drawing, Color & Music", type: "Activity", hours: "4 hrs/wk" },
        ],
        curriculumHighlights: [
          "Phonics-based English reading and neat print handwriting practice",
          "Nepali alphabet recognition and simple sentence formation",
          "Basic addition and subtraction concepts using visual counters",
          "Group activities encouraging confidence, manners, and team building",
        ],
        assessmentMethod: "Playful Classroom Assessments & Progress Evaluation Certificates",
      },
    ],
  },
  {
    id: "primary",
    name: "Primary Level",
    shortBadge: "Grades 1 – 5",
    span: "Class 1 to Class 5",
    ageGroup: "6 – 10 Years",
    color: theme.rose,
    bgAccent: "rgba(156, 39, 72, 0.10)",
    borderAccent: "rgba(156, 39, 72, 0.20)",
    tagline: "Core Academic Fundamentals & Integrated STEAM Activities",
    description:
      "Building strong intellectual foundations in languages, mathematics, general science, and social studies alongside computer literacy, art, and moral education.",
    classes: [
      {
        id: "grade-1-3",
        name: "Grade 1 – 3 (Lower Primary)",
        focus: "Foundational Literacy, Numeracy & Scientific Inquiry",
        subjects: [
          { name: "English Grammar & Reader", type: "Compulsory", hours: "6 hrs/wk" },
          { name: "Nepali Bhasa & Vyakaran", type: "Compulsory", hours: "6 hrs/wk" },
          { name: "Mathematics & Reasoning", type: "Compulsory", hours: "6 hrs/wk" },
          { name: "Our Surroundings (Science & Social)", type: "Compulsory", hours: "5 hrs/wk" },
          { name: "Computer Literacy & Drawing", type: "Practical", hours: "3 hrs/wk" },
        ],
        curriculumHighlights: [
          "Fully aligned with Government of Nepal CDC Primary Curriculum standards",
          "Equal mastery in English and Nepali written and oral communication",
          "Hands-on science experiments and interactive math manipulative kits",
          "Continuous Assessment System (CAS) with periodic diagnostic unit tests",
        ],
        assessmentMethod: "40% Continuous Assessment (CAS) + 60% Terminal Examinations",
      },
      {
        id: "grade-4-5",
        name: "Grade 4 – 5 (Upper Primary)",
        focus: "Analytical Reasoning, Science Exploration & Digital Basics",
        subjects: [
          { name: "English Language & Literature", type: "Compulsory", hours: "6 hrs/wk" },
          { name: "Nepali Bhasa & Vyakaran", type: "Compulsory", hours: "6 hrs/wk" },
          { name: "Mathematics & Geometry", type: "Compulsory", hours: "6 hrs/wk" },
          { name: "General Science & Environment", type: "Compulsory", hours: "5 hrs/wk" },
          { name: "Social Studies & Local Culture", type: "Compulsory", hours: "4 hrs/wk" },
          { name: "Computer Science & ICT Lab", type: "Practical", hours: "3 hrs/wk" },
        ],
        curriculumHighlights: [
          "Structured problem-solving in Arithmetic, Algebra, and Geometry",
          "Introductory computer lab sessions covering typing, MS Office, and internet safety",
          "Project work, chart presentations, and local educational excursions",
          "Inter-house spelling bee, speech contests, and science fair participation",
        ],
        assessmentMethod: "30% Practical/Project Work + 70% Terminal Examinations",
      },
    ],
  },
  {
    id: "middle",
    name: "Middle Level (Lower Secondary)",
    shortBadge: "Grades 6 – 8",
    span: "Class 6 to Class 8",
    ageGroup: "11 – 13 Years",
    color: theme.moss,
    bgAccent: "rgba(63, 91, 73, 0.10)",
    borderAccent: "rgba(63, 91, 73, 0.20)",
    tagline: "Critical Thinking, Laboratory Science & District BLE Exam Prep",
    description:
      "Empowering students to think analytically, conduct laboratory experiments, build digital applications, and prepare for district-level Basic Level Examinations (BLE).",
    classes: [
      {
        id: "grade-6-8",
        name: "Grade 6 – 8 (Class 6, 7 & 8)",
        focus: "Conceptual Mastery, Practical Science & BLE Board Readiness",
        subjects: [
          { name: "English Language & Composition", type: "Compulsory", hours: "6 hrs/wk" },
          { name: "Nepali Bhasa & Sahitya", type: "Compulsory", hours: "6 hrs/wk" },
          { name: "Compulsory Mathematics", type: "Compulsory", hours: "6 hrs/wk" },
          { name: "Science & Technology", type: "Lab & Theory", hours: "6 hrs/wk" },
          { name: "Social Studies & Population", type: "Compulsory", hours: "5 hrs/wk" },
          { name: "Health, Physical & Creative Arts", type: "Practical", hours: "3 hrs/wk" },
          { name: "Computer Science & Coding", type: "Lab", hours: "3 hrs/wk" },
        ],
        curriculumHighlights: [
          "Physics, Chemistry, and Biology lab experiments in dedicated science laboratories",
          "Basic computer programming, web concepts, and office productivity tools",
          "Grade 8 Basic Level Examination (BLE) district-level model test prep",
          "Inter-school debate competitions, science quizzes, and sports tournaments",
        ],
        assessmentMethod: "Grade 8 BLE Board Standards: 25% Practical/Internal + 75% Written Examinations",
      },
    ],
  },
  {
    id: "high",
    name: "High / Secondary Level",
    tagline: "SEE Examination Excellence, Electives & Career Guidance",
    shortBadge: "Grades 9 – 10 (SEE)",
    span: "Class 9 & Class 10",
    ageGroup: "14 – 16 Years",
    color: "#4A2C6E",
    bgAccent: "rgba(74, 44, 110, 0.10)",
    borderAccent: "rgba(74, 44, 110, 0.20)",
    tagline: "Secondary Education Examination (SEE) Prep & Specialized Electives",
    description:
      "Intensive academic preparation for the National Examination Board (NEB) Secondary Education Examination (SEE), featuring specialized electives, advanced science labs, and career counseling.",
    classes: [
      {
        id: "grade-9-10",
        name: "Grade 9 & Grade 10 (SEE Stream)",
        focus: "SEE Board Examination Mastery & Advanced Elective Options",
        subjects: [
          { name: "Compulsory English", type: "Board Subject", hours: "6 hrs/wk" },
          { name: "Compulsory Nepali", type: "Board Subject", hours: "6 hrs/wk" },
          { name: "Compulsory Mathematics", type: "Board Subject", hours: "6 hrs/wk" },
          { name: "Science & Technology (Phys, Chem, Bio)", type: "Lab & Board", hours: "6 hrs/wk" },
          { name: "Social Studies", type: "Board Subject", hours: "5 hrs/wk" },
          { name: "Optional Math (Opt. Math) / Economics", type: "Elective", hours: "5 hrs/wk" },
          { name: "Accountancy / Computer Science", type: "Elective Lab", hours: "4 hrs/wk" },
        ],
        curriculumHighlights: [
          "Rigorous SEE curriculum fully aligned with NEB CDC specifications",
          "Weekly SEE model examination series with detailed marking feedback",
          "Dedicated practical sessions for Science & Computer Science board evaluations",
          "Individual academic coaching, doubt-clearing clinics, and career counseling",
        ],
        assessmentMethod: "NEB SEE Board Pattern: 25% Internal Practical Assessment + 75% Final SEE Examination",
      },
    ],
  },
];

// ============================================================
// CONTENT
// ============================================================

const defaultAcademicsData = {
  hero: {
    badge: "Excellence in Education",
    title: "Empowering Minds, Shaping Futures.",
    subtitle: "Nurturing the next generation of thinkers, innovators, and leaders through quality education.",
    description:
      "At Red Rose Secondary English Boarding School, education extends beyond textbooks. Our comprehensive academic framework integrates intellectual rigor, creative exploration, ethical grounding, and real-world readiness from early childhood through secondary education.",
  },
  stats: [
    { value: "1500", suffix: "+", label: "Active Learners", color: theme.rose },
    { value: "85", suffix: "+", label: "Dedicated Educators", color: theme.gold },
    { value: "55", suffix: "+", label: "Years of Impact", color: theme.moss },
    { value: "100", suffix: "%", label: "SEE Pass Rate", color: "#4A2C6E" },
  ],
  strengths: [
    {
      id: 1,
      title: "Innovation Hub",
      description: "State-of-the-art learning spaces with interactive technology and collaborative zones.",
      color: theme.rose,
    },
    {
      id: 2,
      title: "STEM Excellence",
      description: "Robust science, technology, engineering, and mathematics programs with hands-on experimentation.",
      color: theme.moss,
    },
    {
      id: 3,
      title: "Global Perspective",
      description: "Integrated curriculum emphasizing critical thinking and cross-cultural communication.",
      color: theme.gold,
    },
    {
      id: 4,
      title: "Arts & Expression",
      description: "Comprehensive arts education nurturing creativity through visual arts, music, and performance.",
      color: "#C6486B",
    },
    {
      id: 5,
      title: "Character Development",
      description: "Values-based education cultivating integrity, empathy, and social responsibility.",
      color: "#4A2C6E",
    },
    {
      id: 6,
      title: "Future Ready",
      description: "Career and college counseling with mentorship pathways and leadership development.",
      color: "#2D6A4F",
    },
  ],
  achievements: [
    {
      title: "Academic Excellence Awards",
      description: "Consistent top-tier SEE performance and regional academic honors in Makwanpur.",
    },
    {
      title: "Science & STEM Showcase",
      description: "Student science exhibition projects recognized at district and national youth fairs.",
    },
    {
      title: "Community & Service",
      description: "Student-led service initiatives contributing to local literacy and environmental projects.",
    },
    {
      title: "Co-Curricular Triumphs",
      description: "Championship trophies in inter-school football, athletics, and cultural dance competitions.",
    },
  ],
  assessment: {
    title: "Holistic Assessment Framework",
    description: "Our evaluation system celebrates growth through multiple dimensions of student development.",
    methods: [
      "Continuous Assessment System (CAS)",
      "Laboratory Practical Examinations",
      "Project-Based & Group Presentations",
      "Periodic Diagnostic Unit Tests",
      "Terminal Examinations & SEE Model Series",
      "Co-curricular & Moral Progress Logs",
    ],
  },
};

// ============================================================
// SECTION INTRO
// ============================================================

function SectionIntro({ eyebrow, title, description, align = "left" }) {
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
// MAIN COMPONENT
// ============================================================

const AcademicsPage = () => {
  const [activeLevelId, setActiveLevelId] = useState("primary");
  const [activeClassIndex, setActiveClassIndex] = useState(0);

  const data = defaultAcademicsData;

  const activeLevel =
    classLevelsData.find((level) => level.id === activeLevelId) ||
    classLevelsData[1];

  const activeClass =
    activeLevel.classes[activeClassIndex] || activeLevel.classes[0];

  const handleSelectLevel = (levelId) => {
    setActiveLevelId(levelId);
    setActiveClassIndex(0);
  };

  return (
    <div className="rr-academics" style={styles.page}>
      <AcademicsStyles />

      {/* ======================================================
          HERO — compact single-container design like About page
      ====================================================== */}
      <section className="rr-academics-hero" style={styles.hero}>
        <motion.div
          className="rr-academics-hero-card"
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={styles.heroCard}
        >
          <div className="rr-academics-hero-inner" style={styles.heroInner}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={styles.eyebrow}
            >
              <span style={styles.eyebrowLine} />
              <span className="rr-mono">Excellence in Education</span>
            </motion.div>

            <motion.h1
              className="rr-serif"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              style={styles.heroTitle}
            >
              Empowering Minds,
              <br />
              <span style={{ color: theme.goldSoft }}>Shaping Futures.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              style={styles.heroLead}
            >
              {data.hero.subtitle}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              style={styles.heroDescription}
            >
              {data.hero.description}
            </motion.p>
          </div>
        </motion.div>
      </section>

      {/* ======================================================
          CLASS LEVELS
      ====================================================== */}
      <section
        id="class-levels"
        className="rr-academics-levels"
        style={styles.levelsSection}
      >
        <SectionIntro
          eyebrow="Academic Structure"
          title='Explore Our <span style="color: #9C2748;">Class Levels</span>'
          description="Explore each academic stage to see the classes, subjects, weekly learning hours, curriculum highlights, and assessment structure."
          align="center"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={styles.levelsGrid}
        >
          {classLevelsData.map((level, index) => {
            const isActive = level.id === activeLevelId;

            return (
              <motion.button
                key={level.id}
                type="button"
                className="rr-level-card"
                onClick={() => handleSelectLevel(level.id)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  ...styles.levelCard,
                  borderColor: isActive ? level.color : theme.paperDeep,
                  boxShadow: isActive
                    ? `0 12px 30px ${level.color}18`
                    : "0 5px 18px rgba(30,20,32,0.035)",
                }}
              >
                <div style={styles.levelCardNumber}>
                  <span
                    className="rr-mono"
                    style={{
                      color: isActive ? level.color : theme.textMuted,
                    }}
                  >
                    0{index + 1}
                  </span>

                  <span
                    style={{
                      ...styles.levelBadge,
                      color: level.color,
                      background: level.bgAccent,
                    }}
                  >
                    {level.shortBadge}
                  </span>
                </div>

                <h3
                  className="rr-serif"
                  style={{
                    ...styles.levelName,
                    color: isActive ? level.color : theme.ink,
                  }}
                >
                  {level.name}
                </h3>

                <p style={styles.levelSpan}>{level.span}</p>

                <span
                  style={{
                    ...styles.levelAgePill,
                    color: level.color,
                    background: level.bgAccent,
                  }}
                >
                  Age {level.ageGroup}
                </span>

                <div
                  className="rr-level-select"
                  style={{
                    ...styles.levelSelect,
                    color: isActive ? theme.white : level.color,
                    background: isActive ? level.color : "transparent",
                    borderColor: level.color,
                  }}
                >
                  <span>
                    {isActive ? "Viewing Curriculum" : "Explore Level"}
                  </span>
                  {isActive ? (
                    <ChevronDown size={15} />
                  ) : (
                    <ChevronRight size={15} />
                  )}
                </div>
              </motion.button>
            );
          })}
        </motion.div>

        {/* ====================================================
            CURRICULUM DETAIL
        ==================================================== */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeLevel.id}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.96 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="rr-academics-curriculum"
            style={{
              ...styles.curriculumPanel,
              borderTopColor: activeLevel.color,
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              style={styles.panelHeader}
            >
              <div style={styles.panelHeaderLeft}>
                <span
                  className="rr-mono"
                  style={{
                    ...styles.panelBadge,
                    color: activeLevel.color,
                    background: activeLevel.bgAccent,
                    borderColor: activeLevel.borderAccent,
                  }}
                >
                  {activeLevel.name} · {activeLevel.span}
                </span>

                <h3 className="rr-serif" style={styles.panelTitle}>
                  {activeLevel.tagline}
                </h3>

                <p style={styles.panelDescription}>
                  {activeLevel.description}
                </p>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                style={{
                  ...styles.ageCard,
                  borderColor: activeLevel.borderAccent,
                }}
              >
                <span
                  className="rr-mono"
                  style={{
                    color: theme.textMuted,
                    fontSize: "10px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                  }}
                >
                  Target Age                </span>
                <strong style={{ color: activeLevel.color }}>
                  {activeLevel.ageGroup}
                </strong>
              </motion.div>
            </motion.div>

            {activeLevel.classes.length > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                style={styles.classTabsContainer}
              >
                <span
                  className="rr-mono"
                  style={styles.classTabLabel}
                >
                  Select Class / Stream
                </span>

                <div style={styles.classTabsGroup}>
                  {activeLevel.classes.map((cls, index) => (
                    <motion.button
                      key={cls.id}
                      type="button"
                      className={`rr-class-tab ${activeClassIndex === index ? "active" : ""}`}
                      onClick={() => setActiveClassIndex(index)}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      style={{
                        ...styles.classTabBtn,
                        background:
                          activeClassIndex === index
                            ? activeLevel.color
                            : theme.card,
                        color:
                          activeClassIndex === index
                            ? theme.white
                            : theme.ink,
                        borderColor:
                          activeClassIndex === index
                            ? activeLevel.color
                            : theme.paperDeep,
                      }}
                    >
                      {cls.name}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rr-academics-panel-grid"
              style={styles.curriculumGrid}
            >
              {/* SUBJECTS */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                style={styles.innerCard}
              >
                <div style={styles.innerHeading}>
                  <span
                    style={{
                      ...styles.headingDot,
                      background: activeLevel.color,
                    }}
                  />
                  <div>
                    <span className="rr-mono" style={styles.headingEyebrow}>
                      Curriculum
                    </span>
                    <h4 style={styles.innerTitle}>
                      Subject Breakdown
                    </h4>
                  </div>
                </div>

                <p style={styles.innerSubtext}>{activeClass.name}</p>

                <div style={styles.subjectsList}>
                  {activeClass.subjects.map((subject, index) => (
                    <motion.div
                      key={index}
                      className="rr-subject-row"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                      style={styles.subjectRow}
                    >
                      <div style={styles.subjectLeft}>
                        <span
                          style={{
                            ...styles.subjectBullet,
                            background: activeLevel.color,
                          }}
                        />
                        <span style={styles.subjectName}>
                          {subject.name}
                        </span>
                      </div>

                      <div
                        className="rr-academics-subject-right"
                        style={styles.subjectRight}
                      >
                        <span
                          style={{
                            ...styles.subjectType,
                            color:
                              subject.type === "Practical" ||
                              subject.type === "Lab" ||
                              subject.type === "Lab & Theory" ||
                              subject.type === "Elective" ||
                              subject.type === "Elective Lab"
                                ? theme.moss
                                : theme.rose,
                            background:
                              subject.type === "Practical" ||
                              subject.type === "Lab" ||
                              subject.type === "Lab & Theory" ||
                              subject.type === "Elective" ||
                              subject.type === "Elective Lab"
                                ? `${theme.moss}0D`
                                : `${theme.rose}0D`,
                          }}
                        >
                          {subject.type}
                        </span>
                        <span style={styles.subjectHours}>
                          {subject.hours}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* HIGHLIGHTS + ASSESSMENT */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                style={styles.detailsColumn}
              >
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.35 }}
                  style={styles.innerCard}
                >
                  <div style={styles.innerHeading}>
                    <span
                      style={{
                        ...styles.headingDot,
                        background: activeLevel.color,
                      }}
                    />
                    <div>
                      <span className="rr-mono" style={styles.headingEyebrow}>
                        Learning Experience
                      </span>
                      <h4 style={styles.innerTitle}>
                        Curriculum Highlights
                      </h4>
                    </div>
                  </div>

                  <ul style={styles.highlightsList}>
                    {activeClass.curriculumHighlights.map((item, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.4 + index * 0.08 }}
                        style={styles.highlightItem}
                      >
                        <span
                          className="rr-mono"
                          style={{
                            ...styles.highlightNumber,
                            color: activeLevel.color,
                          }}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.45 }}
                  style={{
                    ...styles.assessmentCard,
                    borderLeftColor: activeLevel.color,
                  }}
                >
                  <span className="rr-mono" style={styles.headingEyebrow}>
                    Evaluation & Assessment
                  </span>
                  <p style={styles.assessmentText}>
                    {activeClass.assessmentMethod}
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ======================================================
          ACADEMIC STRENGTHS — About-page inspired cards
      ====================================================== */}
      <section
        className="rr-academics-strengths"
        style={styles.strengthsSection}
      >
        <div style={styles.sectionContainer}>
          <SectionIntro
            eyebrow="What Sets Us Apart"
            title='Our <span style="color: #9C2748;">Academic Strengths</span>'
            description="A learning ecosystem built on innovation, expertise, and unwavering commitment to student success."
            align="left"
          />

          <div className="rr-academics-strengths-grid" style={styles.strengthsGrid}>
            {data.strengths.map((strength, index) => (
              <motion.article
                key={strength.id}
                className="rr-strength-card"
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                style={styles.strengthCard}
              >
                <span
                  className="rr-strength-accent"
                  style={{ background: strength.color }}
                />

                <span
                  className="rr-strength-letter"
                  aria-hidden="true"
                >
                  {strength.title.charAt(0)}
                </span>

                <div style={styles.strengthContent}>
                  <h4 className="rr-serif" style={styles.strengthTitle}>
                    {strength.title}
                  </h4>

                  <p style={styles.strengthDescription}>
                    {strength.description}
                  </p>
                </div>

                <span
                  className="rr-card-line"
                  style={{
                    ...styles.cardLine,
                    background: strength.color,
                  }}
                />
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================
          ACHIEVEMENTS — Each in separate container/card, no arrow
      ====================================================== */}
      <section
        className="rr-academics-achievements"
        style={styles.achievementsSection}
      >
        <div style={styles.sectionContainer}>
          <SectionIntro
            eyebrow="Our Milestones"
            title='Celebrating <span style="color: #9C2748;">Excellence</span>'
            description="Achievements that reflect the effort of our students, teachers, and wider school community."
            align="center"
          />

          <div className="rr-achievements-grid" style={styles.achievementsGrid}>
            {data.achievements.map((achievement, index) => (
              <motion.article
                key={index}
                className="rr-achievement-card"
                initial={{ opacity: 0, y: 25, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                style={styles.achievementCard}
              >
                <motion.span
                  className="rr-mono"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 + 0.1 }}
                  style={styles.achievementNumber}
                >
                  {String(index + 1).padStart(2, "0")}
                </motion.span>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 + 0.15 }}
                  style={styles.achievementContent}
                >
                  <h4 className="rr-serif" style={styles.achievementTitle}>
                    {achievement.title}
                  </h4>
                  <p style={styles.achievementDescription}>
                    {achievement.description}
                  </p>
                </motion.div>

                <span
                  className="rr-achievement-line"
                  style={styles.achievementLine}
                />
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================
          ASSESSMENT
      ====================================================== */}
      <section
        className="rr-academics-assessment"
        style={styles.assessmentSection}
      >
        <div style={styles.sectionContainer}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            style={styles.assessmentContent}
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div style={styles.eyebrow}>
                <span style={styles.eyebrowLine} />
                <span className="rr-mono">Assessment & Growth</span>
              </div>

              <h2 className="rr-serif" style={styles.assessmentTitle}>
                Holistic Assessment Framework
              </h2>

              <p style={styles.assessmentDescription}>
                {data.assessment.description}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={styles.assessmentMethods}
            >
              {data.assessment.methods.map((method, index) => (
                <motion.div
                  key={index}
                  className="rr-assessment-method"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.06 }}
                  style={styles.assessmentMethod}
                >
                  <span
                    className="rr-mono"
                    style={{
                      color: theme.rose,
                      fontSize: "11px",
                      fontWeight: 700,
                    }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>{method}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

// ============================================================
// STYLES
// ============================================================

const styles = {
  page: {
    minHeight: "100vh",
    background: theme.paper,
    overflowX: "hidden",
    paddingTop: "82px",
  },

  // HERO
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
      "radial-gradient(circle at 85% 25%, rgba(156,39,72,0.28), transparent 28%), radial-gradient(circle at 15% 80%, rgba(185,138,66,0.08), transparent 24%), linear-gradient(135deg, #17101C 0%, #261521 55%, #341A2A 100%)",
    boxShadow: "0 24px 55px rgba(30,20,32,0.16)",
  },

  heroInner: {
    position: "relative",
    zIndex: 2,
    maxWidth: "800px",
    padding: "72px clamp(32px, 6vw, 76px) 92px",
  },

  heroTitle: {
    margin: "18px 0 20px",
    color: theme.white,
    fontSize: "clamp(2.7rem, 5vw, 4.7rem)",
    lineHeight: 1.01,
    fontWeight: 600,
    letterSpacing: "-0.045em",
  },

  heroLead: {
    maxWidth: "720px",
    margin: "0 0 13px",
    color: "rgba(255,255,255,0.88)",
    fontSize: "clamp(1rem, 1.5vw, 1.2rem)",
    fontWeight: 600,
    lineHeight: 1.65,
  },

  heroDescription: {
    maxWidth: "760px",
    margin: 0,
    color: "rgba(245,238,226,0.68)",
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
    background: theme.gold,
  },

  // LEVELS
  levelsSection: {
    background: theme.paper,
    padding: "82px 24px 90px",
    maxWidth: "1280px",
    margin: "0 auto",
  },

  levelsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(235px, 1fr))",
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
    transition: "border-color 0.25s ease, box-shadow 0.25s ease",
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

  // CURRICULUM PANEL
  curriculumPanel: {
    background: theme.card,
    border: `1px solid ${theme.paperDeep}`,
    borderTop: "4px solid",
    borderRadius: "22px",
    padding: "34px",
    boxShadow: "0 12px 35px rgba(30,20,32,0.055)",
  },

  panelHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "28px",
    paddingBottom: "26px",
    marginBottom: "26px",
    borderBottom: `1px solid ${theme.paperDeep}`,
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
    fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
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
    border: `1px solid ${theme.paperDeep}`,
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
    transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
  },

  curriculumGrid: {
    display: "grid",
    gap: "22px",
  },

  innerCard: {
    background: theme.paper,
    border: `1px solid ${theme.paperDeep}`,
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
    border: `1px solid ${theme.paperDeep}`,
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
    border: `1px solid ${theme.paperDeep}`,
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

  // STRENGTHS
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
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "22px",
    marginTop: "44px",
  },

  strengthCard: {
    position: "relative",
    minHeight: "230px",
    padding: "34px 28px 32px",
    overflow: "hidden",
    background: theme.card,
    border: `1px solid ${theme.paperDeep}`,
    borderRadius: "24px",
    boxShadow: "0 12px 30px rgba(30,20,32,0.055)",
    transition: "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
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
    transition: "all 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
  },

  // ACHIEVEMENTS
  achievementsSection: {
    background: theme.paper,
    padding: "84px 24px 90px",
  },

  achievementsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "24px",
    marginTop: "10px",
  },

  achievementCard: {
    position: "relative",
    padding: "32px 28px 28px",
    background: theme.card,
    border: `1px solid ${theme.paperDeep}`,
    borderRadius: "20px",
    boxShadow: "0 12px 30px rgba(30,20,32,0.055)",
    display: "flex",
    flexDirection: "column",
    minHeight: "180px",
    transition: "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
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
    maxWidth: "100%",
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

  // ASSESSMENT
  assessmentSection: {
    background: theme.paperDeep,
    padding: "84px 24px 90px",
    borderTop: `1px solid ${theme.paperDeep}`,
  },

  assessmentContent: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 0.9fr) minmax(320px, 1.1fr)",
    gap: "60px",
    alignItems: "start",
  },

  assessmentTitle: {
    margin: "18px 0 13px",
    color: theme.ink,
    fontSize: "clamp(2rem, 4vw, 3.2rem)",
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
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    borderTop: `1px solid rgba(30,20,32,0.14)`,
  },

  assessmentMethod: {
    display: "flex",
    alignItems: "flex-start",
    gap: "13px",
    padding: "17px 14px",
    borderBottom: `1px solid rgba(30,20,32,0.14)`,
    color: theme.text,
    fontSize: "13px",
    fontWeight: 600,
    lineHeight: 1.5,
    transition: "all 0.3s ease",
  },
};

export default AcademicsPage;