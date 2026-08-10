// AcademicsPage.jsx
import { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Users,
  Award,
  GraduationCap,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Target,
  Sparkles,
  Globe,
  Layout,
  FlaskConical,
  Heart,
  Trophy,
  Zap,
  Shield,
  CheckCircle,
  CheckCircle2,
  Brain,
  Lightbulb,
  Clock,
  FileText,
  Compass,
} from "lucide-react";

// ============ COLOR PALETTE ============
const theme = {
  primary: "#1A5276",
  secondary: "#1E8449",
  accent1: "#D4AC0D",
  accent2: "#E67E22",
  accent3: "#7D3C98",
  accent4: "#2E86C1",
  light: "#F8F6F0",
  dark: "#0A1628",
  gray: "#5D6D7E",
  lightGray: "#EAE5DE",
  white: "#FFFFFF",
  gradient1: "linear-gradient(135deg, #0A1628 0%, #1A5276 100%)",
  gradient2: "linear-gradient(135deg, #D4AC0D 0%, #E67E22 100%)",
  gradient3: "linear-gradient(135deg, #7D3C98 0%, #2E86C1 100%)",
  gradient4: "linear-gradient(135deg, #1E8449 0%, #2E86C1 100%)",
  gradient5: "linear-gradient(135deg, #FEF9E7 0%, #FDEBD0 100%)",
  gradient6: "linear-gradient(135deg, #E8F8F5 0%, #D4EFDF 100%)",
  gradient7: "linear-gradient(135deg, #F4ECF7 0%, #E8DAEF 100%)",
  gradient8: "linear-gradient(135deg, #EBF5FB 0%, #D4E6F1 100%)",
};

// ============ CLASS LEVELS & DETAILED CURRICULUM DATA ============
const classLevelsData = [
  {
    id: "pre-primary",
    name: "Pre-Primary / Early Years",
    shortBadge: "Early Childhood",
    span: "Play Group, Nursery, LKG, UKG",
    ageGroup: "3 – 5.5 Years",
    icon: Brain,
    color: "#D4AC0D",
    bgAccent: "rgba(212, 172, 13, 0.08)",
    borderAccent: "rgba(212, 172, 13, 0.25)",
    gradient: theme.gradient5,
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
    icon: BookOpen,
    color: "#1E8449",
    bgAccent: "rgba(30, 132, 73, 0.08)",
    borderAccent: "rgba(30, 132, 73, 0.25)",
    gradient: theme.gradient6,
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
    icon: Lightbulb,
    color: "#7D3C98",
    bgAccent: "rgba(125, 60, 152, 0.08)",
    borderAccent: "rgba(125, 60, 152, 0.25)",
    gradient: theme.gradient7,
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
    icon: GraduationCap,
    color: "#2E86C1",
    bgAccent: "rgba(46, 134, 193, 0.08)",
    borderAccent: "rgba(46, 134, 193, 0.25)",
    gradient: theme.gradient8,
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

// ============ CONTENT ============
const defaultAcademicsData = {
  hero: {
    badge: "Excellence in Education",
    title: "Empowering Minds Shaping Futures",
    subtitle: "Nurturing the next generation of thinkers, innovators, and leaders through quality education.",
    description:
      "At Red Rose Secondary English Boarding School, education extends beyond textbooks. Our comprehensive academic framework integrates intellectual rigor, creative exploration, ethical grounding, and real-world readiness from early childhood through secondary education.",
  },
  stats: [
    { value: "1500", suffix: "+", label: "Active Learners", color: theme.accent1 },
    { value: "85", suffix: "+", label: "Dedicated Educators", color: theme.accent2 },
    { value: "35", suffix: "+", label: "Years of Impact", color: theme.secondary },
    { value: "100", suffix: "%", label: "SEE Pass Rate", color: theme.primary },
  ],
  strengths: [
    {
      id: 1,
      title: "Innovation Hub",
      description: "State-of-the-art learning spaces with interactive technology and collaborative zones.",
      icon: Layout,
      color: theme.primary,
      gradient: theme.gradient5,
    },
    {
      id: 2,
      title: "STEM Excellence",
      description: "Robust science, technology, engineering, and mathematics programs with hands-on experimentation.",
      icon: FlaskConical,
      color: theme.secondary,
      gradient: theme.gradient6,
    },
    {
      id: 3,
      title: "Global Perspective",
      description: "Integrated curriculum emphasizing critical thinking and cross-cultural communication.",
      icon: Globe,
      color: theme.accent1,
      gradient: theme.gradient5,
    },
    {
      id: 4,
      title: "Arts & Expression",
      description: "Comprehensive arts education nurturing creativity through visual arts, music, and performance.",
      icon: Sparkles,
      color: theme.accent2,
      gradient: theme.gradient5,
    },
    {
      id: 5,
      title: "Character Development",
      description: "Values-based education cultivating integrity, empathy, and social responsibility.",
      icon: Heart,
      color: theme.accent3,
      gradient: theme.gradient7,
    },
    {
      id: 6,
      title: "Future Ready",
      description: "Career and college counseling with mentorship pathways and leadership development.",
      icon: Target,
      color: theme.accent4,
      gradient: theme.gradient8,
    },
  ],
  achievements: [
    {
      title: "Academic Excellence Awards",
      description: "Consistent top-tier SEE performance and regional academic honors in Makwanpur.",
      icon: Trophy,
      gradient: theme.gradient5,
    },
    {
      title: "Science & STEM Showcase",
      description: "Student science exhibition projects recognized at district and national youth fairs.",
      icon: Zap,
      gradient: theme.gradient6,
    },
    {
      title: "Community & Service",
      description: "Student-led service initiatives contributing to local literacy and environmental projects.",
      icon: Shield,
      gradient: theme.gradient7,
    },
    {
      title: "Co-Curricular Triumphs",
      description: "Championship trophies in inter-school football, athletics, and cultural dance competitions.",
      icon: Globe,
      gradient: theme.gradient8,
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

// ============ COMPONENT ============
const AcademicsPage = () => {
  const [data] = useState(defaultAcademicsData);
  const [activeLevelId, setActiveLevelId] = useState("primary");
  const [activeClassIndex, setActiveClassIndex] = useState(0);

  const statsRef = useRef(null);
  const isStatsInView = useInView(statsRef, { once: true, amount: 0.3 });

  const activeLevel = classLevelsData.find((lvl) => lvl.id === activeLevelId) || classLevelsData[1];
  const activeClass = activeLevel.classes[activeClassIndex] || activeLevel.classes[0];

  const handleSelectLevel = (levelId) => {
    setActiveLevelId(levelId);
    setActiveClassIndex(0);
  };

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

  return (
    <div className="academics-page" style={styles.pageContainer}>
      {/* ===== ACADEMICS INTRO SECTION ===== */}
      <section className="academics-intro-section" style={styles.heroSection}>
        <div className="academics-intro-container" style={styles.heroContainer}>
          <div style={styles.heroGlowOne} />
          <div style={styles.heroGlowTwo} />
          <div style={styles.heroOrbOne} />
          <div style={styles.heroOrbTwo} />

          <div className="academics-intro-content" style={styles.heroContent}>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              style={styles.heroText}
            >
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.1 }}
                style={styles.heroBadge}
              >
                <Sparkles size={15} />
                {data.hero.badge}
              </motion.div>

              <h1 style={styles.heroTitle}>
                Empowering Minds,
                <br />
                <span style={styles.heroTitleHighlight}>Shaping Futures.</span>
              </h1>

              <div style={styles.heroRule} />

              <div className="academics-intro-description" style={styles.heroDescriptionBlock}>
                <p style={styles.heroSubtitle}>{data.hero.subtitle}</p>
                <p style={styles.heroDescription}>{data.hero.description}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 35 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.75, delay: 0.15 }}
              className="academics-intro-message"
              style={styles.heroMessage}
            >
              <span style={styles.heroMessageNumber}>01</span>
              <span style={styles.heroMessageLabel}>ACADEMIC FOUNDATION</span>
              <div style={styles.heroMessageLine} />
              <p style={styles.heroMessageText}>
                A balanced academic journey built around knowledge,
                curiosity, creativity, confidence and character.
              </p>

              <div style={styles.heroMessageDots}>
                <span style={styles.heroMessageDotActive} />
                <span style={styles.heroMessageDot} />
                <span style={styles.heroMessageDot} />
              </div>
            </motion.div>
          </div>

          <div style={styles.heroBottomWave} />
          <div style={styles.heroGoldEdge} />
        </div>

        <style>{`
          @media (max-width: 900px) {
            .academics-intro-content {
              grid-template-columns: 1fr !important;
              gap: 28px !important;
              height: auto !important;
              min-height: 520px !important;
              height: auto !important;
              padding: 55px 28px !important;
            }

            .academics-intro-message {
              border-left: 0 !important;
              border-top: 1px solid rgba(255,255,255,0.2) !important;
              padding: 28px 0 0 !important;
            }

            .academics-intro-message {
              max-width: 100% !important;
              border-left: 0 !important;
              border-top: 1px solid rgba(255,255,255,0.22) !important;
              padding-left: 0 !important;
              padding-top: 24px !important;
            }
          }

          @media (max-width: 600px) {
            .academics-intro-section {
              padding: 25px 14px !important;
            }

            .academics-intro-container {
              border-radius: 25px !important;
            }

            .academics-intro-content {
              padding: 38px 25px !important;
            }

            .academics-intro-message {
              padding-top: 20px !important;
            }
          }
        `}</style>
      </section>

      {/* ===== STATS SECTION ===== */}
      <section ref={statsRef} style={styles.statsSection}>
        <div style={styles.statsContainer}>
          {data.stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isStatsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              style={{ ...styles.statCard, borderTopColor: stat.color }}
            >
              <div style={{ ...styles.statBar, background: stat.color }} />
              <div style={{ ...styles.statValue, color: stat.color }}>
                <Counter target={stat.value} suffix={stat.suffix} />
              </div>
              <div style={styles.statLabel}>{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== INTERACTIVE CLASS LEVELS & CURRICULUM EXPLORER ===== */}
      <section style={styles.levelsSection} id="class-levels">
        <div style={styles.sectionHeader}>
          <span style={styles.sectionBadge}>Academic Structure & Curriculum</span>
          <h2 style={styles.sectionTitle}>
            Explore Our <span style={styles.sectionTitleHighlight}>Class Levels</span>
          </h2>
          <p style={styles.sectionDescription}>
            Click on any academic level below to view the classes, subjects, weekly credit hours, curriculum highlights, and grading structure.
          </p>
          <div style={styles.sectionDivider} />
        </div>

        {/* 4 Class Level Cards Grid */}
        <div style={styles.levelsGrid}>
          {classLevelsData.map((level) => {
            const Icon = level.icon;
            const isActive = level.id === activeLevelId;

            return (
              <motion.button
                key={level.id}
                type="button"
                onClick={() => handleSelectLevel(level.id)}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  ...styles.levelCard,
                  background: isActive ? "#FFFFFF" : level.gradient,
                  border: isActive ? `2px solid ${level.color}` : "1px solid rgba(0,0,0,0.06)",
                  boxShadow: isActive ? `0 12px 32px ${level.color}25` : "0 4px 16px rgba(0,0,0,0.04)",
                }}
              >
                <div style={{ ...styles.levelCardTop, background: level.bgAccent }}>
                  <Icon size={26} color={level.color} />
                  <span style={{ ...styles.levelSpanTag, color: level.color, background: "#FFFFFF" }}>
                    {level.shortBadge}
                  </span>
                </div>

                <h3 style={{ ...styles.levelName, color: isActive ? level.color : theme.dark }}>
                  {level.name}
                </h3>
                <p style={styles.levelSpan}>{level.span}</p>
                <div style={styles.levelAgePill}>Age: {level.ageGroup}</div>

                <div
                  style={{
                    ...styles.levelSelectBtn,
                    background: isActive ? level.color : "transparent",
                    color: isActive ? "#FFFFFF" : level.color,
                    border: `1px solid ${level.color}`,
                  }}
                >
                  <span>{isActive ? "Viewing Curriculum" : "Click to Explore"}</span>
                  {isActive ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* EXPANDED CURRICULUM VIEWER PANEL */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeLevel.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4 }}
            style={{
              ...styles.curriculumPanel,
              borderTop: `4px solid ${activeLevel.color}`,
            }}
          >
            {/* Panel Header */}
            <div style={styles.panelHeader}>
              <div style={styles.panelHeaderLeft}>
                <span
                  style={{
                    ...styles.panelLevelBadge,
                    background: activeLevel.bgAccent,
                    color: activeLevel.color,
                    border: `1px solid ${activeLevel.borderAccent}`,
                  }}
                >
                  {activeLevel.name} • {activeLevel.span}
                </span>
                <h3 style={styles.panelTitle}>{activeLevel.tagline}</h3>
                <p style={styles.panelDescription}>{activeLevel.description}</p>
              </div>

              <div style={styles.panelHeaderRight}>
                <div style={{ ...styles.ageCard, borderColor: activeLevel.borderAccent }}>
                  <Clock size={18} color={activeLevel.color} />
                  <div>
                    <div style={styles.ageCardLabel}>Target Age</div>
                    <div style={styles.ageCardValue}>{activeLevel.ageGroup}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Class Selector Tabs */}
            {activeLevel.classes.length > 1 && (
              <div style={styles.classTabsContainer}>
                <span style={styles.classTabLabel}>Select Class / Stream:</span>
                <div style={styles.classTabsGroup}>
                  {activeLevel.classes.map((cls, idx) => (
                    <button
                      key={cls.id}
                      type="button"
                      onClick={() => setActiveClassIndex(idx)}
                      style={{
                        ...styles.classTabBtn,
                        background: activeClassIndex === idx ? activeLevel.color : "#FFFFFF",
                        color: activeClassIndex === idx ? "#FFFFFF" : theme.dark,
                        border: `1px solid ${activeClassIndex === idx ? activeLevel.color : "rgba(0,0,0,0.1)"}`,
                        fontWeight: activeClassIndex === idx ? "700" : "600",
                      }}
                    >
                      {cls.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Active Class Curriculum Content */}
            <div style={styles.curriculumContentGrid}>
              {/* Left Column: Subjects Breakdown */}
              <div style={styles.subjectsColumn}>
                <div style={styles.subColumnHeader}>
                  <BookOpen size={20} color={activeLevel.color} />
                  <h4 style={styles.subColumnTitle}>
                    Subject Breakdown & Credit Hours ({activeClass.name})
                  </h4>
                </div>

                <div style={styles.subjectsList}>
                  {activeClass.subjects.map((sub, idx) => (
                    <div key={idx} style={styles.subjectRow}>
                      <div style={styles.subjectRowLeft}>
                        <div
                          style={{
                            ...styles.subjectBullet,
                            background: activeLevel.color,
                          }}
                        />
                        <span style={styles.subjectName}>{sub.name}</span>
                      </div>

                      <div style={styles.subjectRowRight}>
                        <span
                          style={{
                            ...styles.subjectTypeTag,
                            background:
                              sub.type === "Compulsory" || sub.type === "Core" || sub.type === "Board Subject"
                                ? "rgba(26, 82, 118, 0.08)"
                                : "rgba(30, 132, 73, 0.08)",
                            color:
                              sub.type === "Compulsory" || sub.type === "Core" || sub.type === "Board Subject"
                                ? theme.primary
                                : theme.secondary,
                          }}
                        >
                          {sub.type}
                        </span>
                        <span style={styles.subjectHours}>{sub.hours}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Highlights & Assessment */}
              <div style={styles.detailsColumn}>
                {/* Highlights Card */}
                <div style={styles.detailsCard}>
                  <div style={styles.subColumnHeader}>
                    <Sparkles size={20} color={activeLevel.color} />
                    <h4 style={styles.subColumnTitle}>Curriculum & Learning Highlights</h4>
                  </div>
                  <ul style={styles.highlightsList}>
                    {activeClass.curriculumHighlights.map((hl, idx) => (
                      <li key={idx} style={styles.highlightItem}>
                        <CheckCircle2 size={16} color={activeLevel.color} style={{ flexShrink: 0 }} />
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Assessment Card */}
                <div style={styles.assessmentSchemeCard}>
                  <div style={styles.subColumnHeader}>
                    <Award size={20} color={activeLevel.color} />
                    <h4 style={styles.subColumnTitle}>Evaluation & Assessment Pattern</h4>
                  </div>
                  <p style={styles.assessmentText}>{activeClass.assessmentMethod}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ===== STRENGTHS SECTION ===== */}
      <section style={styles.strengthsSection}>
        <div style={styles.strengthsContainer}>
          <div style={styles.strengthsHeader}>
            <span style={styles.sectionBadge}>What Sets Us Apart</span>
            <h2 style={styles.sectionTitle}>
              Our <span style={styles.sectionTitleHighlight}>Academic Strengths</span>
            </h2>
            <p style={styles.sectionDescription}>
              A learning ecosystem built on innovation, expertise, and unwavering commitment to student success.
            </p>
            <div style={styles.sectionDivider} />
          </div>

          <div style={styles.strengthsGrid}>
            {data.strengths.map((strength, index) => {
              const Icon = strength.icon;
              return (
                <motion.div
                  key={strength.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.06 }}
                  style={{ ...styles.strengthCard, background: strength.gradient }}
                >
                  <div style={{ ...styles.strengthIconWrapper, background: `${strength.color}18` }}>
                    <Icon size={24} color={strength.color} />
                  </div>
                  <h4 style={styles.strengthTitle}>{strength.title}</h4>
                  <p style={styles.strengthDescription}>{strength.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== ACHIEVEMENTS SECTION ===== */}
      <section style={styles.achievementsSection}>
        <div style={styles.achievementsContainer}>
          <div style={styles.sectionHeader}>
            <span style={{ ...styles.sectionBadge, background: `${theme.accent1}18`, color: theme.accent1 }}>
              Our Milestones
            </span>
            <h2 style={{ ...styles.sectionTitle, color: theme.dark }}>
              Celebrating <span style={styles.sectionTitleHighlight}>Excellence</span>
            </h2>
            <p style={styles.sectionDescription}>
              A legacy of achievement that reflects our commitment to quality education and student empowerment.
            </p>
            <div style={styles.sectionDivider} />
          </div>

          <div style={styles.achievementsGrid}>
            {data.achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  style={{ ...styles.achievementCard, background: achievement.gradient }}
                >
                  <div style={{ ...styles.achievementIconWrapper, background: theme.accent1 }}>
                    <Icon size={24} color={theme.white} />
                  </div>
                  <h4 style={styles.achievementTitle}>{achievement.title}</h4>
                  <p style={styles.achievementDescription}>{achievement.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== ASSESSMENT SECTION ===== */}
      <section style={styles.assessmentSection}>
        <div style={styles.assessmentContainer}>
          <div style={styles.assessmentContent}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span style={styles.assessmentBadge}>Assessment & Growth</span>
              <h2 style={styles.assessmentTitle}>{data.assessment.title}</h2>
              <p style={styles.assessmentDescription}>{data.assessment.description}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={styles.assessmentMethods}
            >
              {data.assessment.methods.map((method, index) => (
                <div key={index} style={styles.assessmentMethod}>
                  <CheckCircle size={18} color={theme.accent1} />
                  <span>{method}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

// ============ STYLES ============
const styles = {
  pageContainer: {
    minHeight: "100vh",
    background: "#F8F6F0",
    overflowX: "hidden",
    paddingTop: "82px",
    boxSizing: "border-box",
  },
  heroSection: {
    position: "relative",
    padding: "0 0 55px",
    background: "linear-gradient(180deg, #F7FAFF 0%, #FFFFFF 100%)",
    boxSizing: "border-box",
    overflow: "hidden",
  },

  heroContainer: {
    position: "relative",
    width: "100%",
    maxWidth: "none",
    minHeight: "520px",
    height: "auto",
    margin: "0",
    overflow: "visible",
    borderRadius: "0 0 34px 34px",
    background:
      "linear-gradient(135deg, #104E78 0%, #176B99 48%, #2389B7 100%)",
    boxShadow:
      "0 30px 70px rgba(18, 82, 120, 0.22), 0 8px 25px rgba(15, 23, 42, 0.07)",
    border: "1px solid rgba(255,255,255,0.28)",
  },

  heroGlowOne: {
    position: "absolute",
    width: "520px",
    height: "520px",
    borderRadius: "50%",
    background: "rgba(255, 211, 74, 0.15)",
    filter: "blur(8px)",
    top: "-300px",
    right: "-120px",
  },

  heroGlowTwo: {
    position: "absolute",
    width: "420px",
    height: "420px",
    borderRadius: "50%",
    background: "rgba(117, 215, 255, 0.13)",
    filter: "blur(10px)",
    bottom: "-270px",
    left: "-130px",
  },

  heroOrbOne: {
    position: "absolute",
    width: "210px",
    height: "210px",
    borderRadius: "50%",
    border: "1px solid rgba(255,255,255,0.14)",
    right: "7%",
    top: "-90px",
  },

  heroOrbTwo: {
    position: "absolute",
    width: "115px",
    height: "115px",
    borderRadius: "50%",
    border: "1px solid rgba(255,220,110,0.2)",
    right: "38%",
    bottom: "-55px",
  },

  heroContent: {
    position: "relative",
    zIndex: 2,
    minHeight: "520px",
    height: "auto",
    width: "100%",
    maxWidth: "1440px",
    margin: "0 auto",
    padding: "72px clamp(40px, 7vw, 110px) 68px",
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.45fr) minmax(260px, 0.55fr)",
    alignItems: "center",
    gap: "clamp(35px, 5vw, 80px)",
  },

  heroText: {
    width: "100%",
    maxWidth: "820px",
  },

  heroBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "9px 18px",
    borderRadius: "50px",
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.28)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    color: "#FFE08A",
    fontSize: "12px",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: "0.14em",
    marginTop: "8px",
    marginBottom: "24px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
  },

  heroTitle: {
    fontSize: "clamp(3rem, 6vw, 5.4rem)",
    lineHeight: "0.98",
    fontWeight: "900",
    letterSpacing: "-0.055em",
    color: "#FFFFFF",
    margin: "0 0 24px",
  },

  heroTitleHighlight: {
    color: "#FFD85A",
  },

  heroRule: {
    width: "92px",
    height: "4px",
    borderRadius: "10px",
    background: "linear-gradient(90deg, #FFD85A, rgba(255,216,90,0.15))",
    marginBottom: "24px",
  },

  heroDescriptionBlock: {
    maxWidth: "800px",
  },

  heroSubtitle: {
    fontSize: "clamp(1.05rem, 1.6vw, 1.3rem)",
    color: "rgba(255,255,255,0.96)",
    fontWeight: "700",
    lineHeight: "1.55",
    maxWidth: "760px",
    margin: "0 0 13px",
  },

  heroDescription: {
    fontSize: "15px",
    color: "rgba(255,255,255,0.72)",
    lineHeight: "1.8",
    maxWidth: "760px",
    margin: 0,
  },

  heroMessage: {
    position: "relative",
    alignSelf: "stretch",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    paddingLeft: "38px",
    borderLeft: "1px solid rgba(255,255,255,0.2)",
  },

  heroMessageNumber: {
    display: "block",
    color: "#FFD85A",
    fontSize: "48px",
    lineHeight: "1",
    fontWeight: "900",
    letterSpacing: "-0.05em",
    marginBottom: "7px",
  },

  heroMessageLabel: {
    color: "rgba(255,255,255,0.65)",
    fontSize: "10px",
    fontWeight: "800",
    letterSpacing: "0.17em",
  },

  heroMessageLine: {
    width: "46px",
    height: "3px",
    borderRadius: "10px",
    background: "#FFD85A",
    margin: "24px 0 20px",
  },

  heroMessageText: {
    color: "rgba(255,255,255,0.78)",
    fontSize: "15px",
    lineHeight: "1.75",
    margin: 0,
    maxWidth: "250px",
  },

  heroMessageDots: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    marginTop: "30px",
  },

  heroMessageDotActive: {
    width: "30px",
    height: "6px",
    borderRadius: "20px",
    background: "#FFD85A",
  },

  heroMessageDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.45)",
  },

  heroBottomWave: {
    position: "absolute",
    width: "520px",
    height: "100px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.055)",
    left: "-110px",
    bottom: "-58px",
    transform: "rotate(-5deg)",
  },

  heroGoldEdge: {
    position: "absolute",
    width: "35%",
    height: "3px",
    right: "8%",
    bottom: 0,
    borderRadius: "10px 10px 0 0",
    background: "linear-gradient(90deg, transparent, #FFD85A, transparent)",
    opacity: 0.8,
  },

  statsSection: {
    padding: "40px 24px 60px",
    background: "#FFFFFF",
  },
  statsContainer: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "20px",
  },
  statCard: {
    position: "relative",
    padding: "28px 20px",
    borderRadius: "20px",
    textAlign: "center",
    background: "#F8F6F0",
    border: "1px solid rgba(0,0,0,0.04)",
    borderTop: "3px solid",
    transition: "all 0.3s ease",
    cursor: "default",
  },
  statBar: {
    position: "absolute",
    top: 0,
    left: "50%",
    transform: "translateX(-50%)",
    width: "40px",
    height: "3px",
    borderRadius: "0 0 4px 4px",
  },
  statValue: {
    fontSize: "clamp(2.2rem, 4vw, 3rem)",
    fontWeight: "800",
    letterSpacing: "-0.02em",
    marginBottom: "4px",
  },
  statLabel: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#5D6D7E",
    letterSpacing: "0.02em",
  },
  sectionHeader: {
    textAlign: "center",
    maxWidth: "700px",
    margin: "0 auto 48px",
  },
  sectionBadge: {
    display: "inline-block",
    padding: "5px 16px",
    borderRadius: "50px",
    fontSize: "12px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    background: "rgba(26, 82, 118, 0.08)",
    color: "#1A5276",
    marginBottom: "16px",
  },
  sectionTitle: {
    fontSize: "clamp(2rem, 3.5vw, 2.8rem)",
    fontWeight: "800",
    color: "#1C2833",
    marginBottom: "12px",
    letterSpacing: "-0.02em",
    lineHeight: 1.1,
  },
  sectionTitleHighlight: {
    color: "#D4AC0D",
  },
  sectionDescription: {
    fontSize: "clamp(0.95rem, 1.1vw, 1.1rem)",
    color: "#5D6D7E",
    lineHeight: 1.7,
    maxWidth: "600px",
    margin: "0 auto",
  },
  sectionDivider: {
    width: "60px",
    height: "3px",
    borderRadius: "4px",
    background: "linear-gradient(135deg, #D4AC0D 0%, #E67E22 100%)",
    margin: "20px auto 0",
  },
  levelsSection: {
    padding: "80px 24px",
    background: "#FFFFFF",
    maxWidth: "1240px",
    margin: "0 auto",
  },
  levelsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    marginBottom: "40px",
  },
  levelCard: {
    padding: "24px 20px",
    borderRadius: "20px",
    textAlign: "left",
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    flexDirection: "column",
    justify: "space-between",
  },
  levelCardTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 14px",
    borderRadius: "14px",
    marginBottom: "16px",
  },
  levelSpanTag: {
    fontSize: "11px",
    fontWeight: "700",
    padding: "4px 10px",
    borderRadius: "20px",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
  },
  levelName: {
    fontSize: "19px",
    fontWeight: "800",
    marginBottom: "4px",
    letterSpacing: "-0.01em",
  },
  levelSpan: {
    fontSize: "13px",
    color: "#5D6D7E",
    fontWeight: "600",
    marginBottom: "12px",
  },
  levelAgePill: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#1C2833",
    background: "rgba(0,0,0,0.04)",
    padding: "4px 10px",
    borderRadius: "8px",
    display: "inline-block",
    marginBottom: "20px",
    width: "fit-content",
  },
  levelSelectBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 16px",
    borderRadius: "12px",
    fontSize: "13px",
    fontWeight: "700",
    transition: "all 0.3s ease",
  },
  curriculumPanel: {
    background: "rgba(255, 255, 255, 0.85)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    borderRadius: "24px",
    padding: "36px 32px",
    boxShadow: "0 12px 40px rgba(15, 23, 42, 0.08)",
    border: "1px solid rgba(0, 0, 0, 0.06)",
  },
  panelHeader: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "24px",
    paddingBottom: "24px",
    borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
    marginBottom: "24px",
  },
  panelHeaderLeft: {
    maxWidth: "750px",
  },
  panelLevelBadge: {
    display: "inline-block",
    fontSize: "12px",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    padding: "6px 16px",
    borderRadius: "50px",
    marginBottom: "12px",
  },
  panelTitle: {
    fontSize: "26px",
    fontWeight: "900",
    color: "#0A1628",
    marginBottom: "8px",
    letterSpacing: "-0.02em",
  },
  panelDescription: {
    fontSize: "15px",
    color: "#5D6D7E",
    lineHeight: "1.7",
  },
  panelHeaderRight: {
    display: "flex",
    alignItems: "center",
  },
  ageCard: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 20px",
    borderRadius: "16px",
    background: "#FFFFFF",
    border: "1px solid rgba(0,0,0,0.08)",
    boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
  },
  ageCardLabel: {
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase",
    color: "#5D6D7E",
    letterSpacing: "0.08em",
  },
  ageCardValue: {
    fontSize: "15px",
    fontWeight: "800",
    color: "#0A1628",
  },
  classTabsContainer: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "16px",
    marginBottom: "28px",
    padding: "16px 20px",
    borderRadius: "16px",
    background: "rgba(0, 0, 0, 0.02)",
    border: "1px solid rgba(0, 0, 0, 0.04)",
  },
  classTabLabel: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#5D6D7E",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  classTabsGroup: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  },
  classTabBtn: {
    padding: "8px 18px",
    borderRadius: "12px",
    fontSize: "13px",
    cursor: "pointer",
    transition: "all 0.25s ease",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  },
  curriculumContentGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "28px",
  },
  subjectsColumn: {
    background: "#FFFFFF",
    padding: "24px",
    borderRadius: "20px",
    border: "1px solid rgba(0,0,0,0.06)",
    boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
  },
  subColumnHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "20px",
  },
  subColumnTitle: {
    fontSize: "17px",
    fontWeight: "800",
    color: "#0A1628",
  },
  subjectsList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  subjectRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 16px",
    borderRadius: "14px",
    background: "rgba(0, 0, 0, 0.02)",
    border: "1px solid rgba(0, 0, 0, 0.04)",
  },
  subjectRowLeft: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  subjectBullet: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    flexShrink: 0,
  },
  subjectName: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#1C2833",
  },
  subjectRowRight: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  subjectTypeTag: {
    fontSize: "11px",
    fontWeight: "700",
    padding: "3px 10px",
    borderRadius: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  subjectHours: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#5D6D7E",
  },
  detailsColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  detailsCard: {
    background: "#FFFFFF",
    padding: "24px",
    borderRadius: "20px",
    border: "1px solid rgba(0,0,0,0.06)",
    boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
  },
  highlightsList: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  highlightItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#2C3E50",
    lineHeight: "1.6",
  },
  assessmentSchemeCard: {
    background: "#FFFFFF",
    padding: "24px",
    borderRadius: "20px",
    border: "1px solid rgba(0,0,0,0.06)",
    boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
  },
  assessmentText: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#1A5276",
    background: "rgba(26, 82, 118, 0.06)",
    padding: "14px 18px",
    borderRadius: "14px",
    border: "1px solid rgba(26, 82, 118, 0.12)",
    lineHeight: "1.6",
  },
  strengthsSection: {
    padding: "80px 24px",
    background: "#F8F6F0",
  },
  strengthsContainer: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  strengthsHeader: {
    textAlign: "center",
    maxWidth: "700px",
    margin: "0 auto 48px",
  },
  strengthsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "20px",
  },
  strengthCard: {
    padding: "28px 24px",
    borderRadius: "20px",
    border: "1px solid rgba(0,0,0,0.04)",
    transition: "all 0.3s ease",
  },
  strengthIconWrapper: {
    width: "48px",
    height: "48px",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "16px",
  },
  strengthTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#1C2833",
    marginBottom: "8px",
  },
  strengthDescription: {
    fontSize: "14px",
    color: "#5D6D7E",
    lineHeight: 1.6,
  },
  achievementsSection: {
    padding: "80px 24px",
    background: "#FFFFFF",
  },
  achievementsContainer: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  achievementsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "24px",
  },
  achievementCard: {
    padding: "32px 24px",
    borderRadius: "24px",
    border: "1px solid rgba(0,0,0,0.04)",
    transition: "all 0.3s ease",
    textAlign: "center",
  },
  achievementIconWrapper: {
    width: "56px",
    height: "56px",
    borderRadius: "18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px",
    boxShadow: "0 8px 20px rgba(212, 172, 13, 0.3)",
  },
  achievementTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#1C2833",
    marginBottom: "8px",
  },
  achievementDescription: {
    fontSize: "14px",
    color: "#5D6D7E",
    lineHeight: 1.6,
  },
  assessmentSection: {
    padding: "80px 24px",
    background: "linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)",
    borderTop: "1px solid #E2E8F0",
    color: "#0F172A",
  },
  assessmentContainer: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  assessmentContent: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "48px",
    alignItems: "center",
  },
  assessmentBadge: {
    display: "inline-block",
    padding: "5px 16px",
    borderRadius: "50px",
    fontSize: "12px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    background: "rgba(26, 82, 118, 0.08)",
    color: "#1A5276",
    border: "1px solid rgba(26, 82, 118, 0.2)",
    marginBottom: "16px",
  },
  assessmentTitle: {
    fontSize: "clamp(2rem, 3.5vw, 2.8rem)",
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: "16px",
    letterSpacing: "-0.02em",
  },
  assessmentDescription: {
    fontSize: "16px",
    color: "#475569",
    lineHeight: 1.7,
  },
  assessmentMethods: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
  },
  assessmentMethod: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "16px 20px",
    borderRadius: "16px",
    background: "#FFFFFF",
    border: "1px solid #E2E8F0",
    boxShadow: "0 4px 14px rgba(0,0,0,0.03)",
    fontSize: "14px",
    fontWeight: "700",
    color: "#1E293B",
  },
};

const AcademicsPageWithStyles = () => (
  <>
    <AcademicsPage />
  </>
);

export default AcademicsPageWithStyles;