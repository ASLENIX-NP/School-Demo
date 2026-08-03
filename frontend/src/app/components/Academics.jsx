// AcademicsPage.jsx
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Users,
  Award,
  GraduationCap,
  ChevronRight,
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
  Brain,
  Lightbulb,
} from "lucide-react";

// ============ DARK THEME COLOR PALETTE ============
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
  gradient5: "linear-gradient(135deg, #FDEBD0 0%, #FAD7A0 100%)",
  gradient6: "linear-gradient(135deg, #D4EFDF 0%, #A9DFBF 100%)",
  gradient7: "linear-gradient(135deg, #EBDEF0 0%, #D2B4DE 100%)",
  gradient8: "linear-gradient(135deg, #D6EAF8 0%, #AED6F1 100%)",
};

// ============ CONTENT ============
const defaultAcademicsData = {
  hero: {
    badge: "Excellence in Education",
    title: "Empowering Minds, Shaping Futures",
    subtitle: "Nurturing the next generation of thinkers, innovators, and leaders through world-class education.",
    description:
      "At our institution, we believe education extends beyond textbooks. Our comprehensive academic framework integrates intellectual rigor, creative exploration, ethical grounding, and real-world readiness from early childhood through secondary education.",
  },
  stats: [
    { value: "4500", suffix: "+", label: "Active Learners", color: theme.accent1 },
    { value: "280", suffix: "+", label: "Dedicated Educators", color: theme.accent2 },
    { value: "40", suffix: "+", label: "Years of Impact", color: theme.secondary },
    { value: "99", suffix: "%", label: "Excellence Rate", color: theme.primary },
  ],
  programs: [
    {
      id: 1,
      level: "Early Years",
      span: "Pre-K & Kindergarten",
      description: "Foundational development through play-based learning, sensory exploration, and early literacy building blocks.",
      icon: Brain,
      color: theme.accent1,
      gradient: theme.gradient5,
    },
    {
      id: 2,
      level: "Primary",
      span: "Grades 1-5",
      description: "Core knowledge acquisition with integrated arts, technology, and character education for holistic growth.",
      icon: BookOpen,
      color: theme.secondary,
      gradient: theme.gradient6,
    },
    {
      id: 3,
      level: "Middle School",
      span: "Grades 6-8",
      description: "Transitional phase fostering critical thinking, collaborative projects, and digital citizenship skills.",
      icon: Lightbulb,
      color: theme.accent3,
      gradient: theme.gradient7,
    },
    {
      id: 4,
      level: "Secondary",
      span: "Grades 9-12",
      description: "College-preparatory curriculum with advanced coursework, research opportunities, and career exploration.",
      icon: GraduationCap,
      color: theme.accent4,
      gradient: theme.gradient8,
    },
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
      description: "International curriculum integration and cross-cultural exchange opportunities.",
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
      description: "Career and college counseling with internship pathways and leadership development.",
      icon: Target,
      color: theme.accent4,
      gradient: theme.gradient8,
    },
  ],
  achievements: [
    {
      title: "Academic Excellence Awards",
      description: "Consistent top-tier performance in regional and national academic competitions.",
      icon: Trophy,
      gradient: theme.gradient5,
    },
    {
      title: "Innovation Showcase",
      description: "Student-led research projects recognized at international science fairs.",
      icon: Zap,
      gradient: theme.gradient6,
    },
    {
      title: "Community Impact",
      description: "Service-learning initiatives contributing to local development and sustainability.",
      icon: Shield,
      gradient: theme.gradient7,
    },
    {
      title: "Global Connections",
      description: "Partnerships with international schools for cultural and academic exchange.",
      icon: Globe,
      gradient: theme.gradient8,
    },
  ],
  assessment: {
    title: "Holistic Assessment Framework",
    description: "Our evaluation system celebrates growth through multiple dimensions of student development.",
    methods: [
      "Performance-Based Assessments",
      "Portfolio Reviews",
      "Collaborative Projects",
      "Self-Reflection & Goal Setting",
      "Standardized Benchmarks",
      "Real-World Application Tasks",
    ],
  },
};

// ============ COMPONENT ============
const AcademicsPage = () => {
  const [data] = useState(defaultAcademicsData);
  const statsRef = useRef(null);
  const isStatsInView = useInView(statsRef, { once: true, amount: 0.3 });

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
      {/* ===== HERO SECTION - DARK LIKE GALLERY ===== */}
      <section style={styles.heroSection}>
        <div style={styles.heroBackground}>
          <div style={styles.heroOverlay} />
          <div style={styles.heroPattern} />
        </div>

        <div style={styles.heroContent}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            style={styles.heroInner}
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              style={styles.heroBadge}
            >
              {data.hero.badge}
            </motion.div>
            <h1 style={styles.heroTitle}>
              <span style={styles.heroTitleLight}>{data.hero.title.split(" ").slice(0, 2).join(" ")}</span>
              <br />
              <span style={styles.heroTitleHighlight}>
                {data.hero.title.split(" ").slice(2).join(" ")}
              </span>
            </h1>
            <p style={styles.heroSubtitle}>{data.hero.subtitle}</p>
            <p style={styles.heroDescription}>{data.hero.description}</p>
          </motion.div>
        </div>
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

      {/* ===== PROGRAMS SECTION ===== */}
      <section style={styles.programsSection}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionBadge}>Academic Pathways</span>
          <h2 style={styles.sectionTitle}>Our Educational <span style={styles.sectionTitleHighlight}>Programs</span></h2>
          <p style={styles.sectionDescription}>
            A progressive educational journey designed to nurture curious minds, develop critical thinkers, and inspire lifelong learners.
          </p>
          <div style={styles.sectionDivider} />
        </div>

        <div style={styles.programsGrid}>
          {data.programs.map((program, index) => {
            const Icon = program.icon;
            return (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                style={{ ...styles.programCard, background: program.gradient }}
              >
                <div style={{ ...styles.programAccent, background: program.color }} />
                <div style={{ ...styles.programIconWrapper, background: `${program.color}20` }}>
                  <Icon size={28} color={program.color} />
                </div>
                <div style={styles.programNumber}>{String(index + 1).padStart(2, "0")}</div>
                <h3 style={styles.programLevel}>{program.level}</h3>
                <span style={{ ...styles.programSpan, color: program.color }}>{program.span}</span>
                <p style={styles.programDescription}>{program.description}</p>
                <div style={{ ...styles.programLink, color: program.color }}>
                  Explore <ChevronRight size={16} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ===== STRENGTHS SECTION ===== */}
      <section style={styles.strengthsSection}>
        <div style={styles.strengthsContainer}>
          <div style={styles.strengthsHeader}>
            <span style={styles.sectionBadge}>What Sets Us Apart</span>
            <h2 style={styles.sectionTitle}>Our <span style={styles.sectionTitleHighlight}>Academic Strengths</span></h2>
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
            <h2 style={{ ...styles.sectionTitle, color: theme.dark }}>Celebrating <span style={styles.sectionTitleHighlight}>Excellence</span></h2>
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
  },
  heroSection: {
    position: "relative",
    paddingTop: "80px",
    minHeight: "85vh",
    display: "flex",
    alignItems: "center",
    overflow: "hidden",
  },
  heroBackground: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(135deg, #0A1628 0%, #1A5276 50%, #0A1628 100%)",
  },
  heroOverlay: {
    position: "absolute",
    inset: 0,
    background: "radial-gradient(circle at 30% 50%, rgba(212, 172, 13, 0.15), transparent 60%)",
  },
  heroPattern: {
    position: "absolute",
    inset: 0,
    backgroundImage: `radial-gradient(circle at 20px 20px, rgba(255,255,255,0.04) 1px, transparent 1px)`,
    backgroundSize: "40px 40px",
  },
  heroContent: {
    position: "relative",
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 24px",
    zIndex: 2,
  },
  heroInner: {
    maxWidth: "700px",
  },
  heroBadge: {
    display: "inline-block",
    padding: "6px 20px",
    borderRadius: "50px",
    fontSize: "13px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.15em",
    background: "rgba(212, 172, 13, 0.15)",
    color: theme.accent1,
    border: "1px solid rgba(212, 172, 13, 0.3)",
    marginBottom: "24px",
  },
  heroTitle: {
    fontSize: "clamp(2.8rem, 6vw, 4.5rem)",
    fontWeight: "800",
    lineHeight: 1.05,
    color: "#FFFFFF",
    marginBottom: "20px",
    letterSpacing: "-0.03em",
  },
  heroTitleLight: {
    fontWeight: "400",
    opacity: 0.85,
  },
  heroTitleHighlight: {
    background: "linear-gradient(135deg, #D4AC0D 0%, #E67E22 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  heroSubtitle: {
    fontSize: "clamp(1.1rem, 1.8vw, 1.4rem)",
    color: "rgba(255,255,255,0.92)",
    fontWeight: "500",
    marginBottom: "16px",
    lineHeight: 1.5,
  },
  heroDescription: {
    fontSize: "clamp(0.95rem, 1.2vw, 1.1rem)",
    color: "rgba(255,255,255,0.7)",
    lineHeight: 1.8,
    maxWidth: "560px",
    marginBottom: "32px",
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
  programsSection: {
    padding: "80px 24px",
    background: "#FFFFFF",
  },
  programsGrid: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "24px",
  },
  programCard: {
    position: "relative",
    padding: "32px 24px",
    borderRadius: "24px",
    border: "1px solid rgba(0,0,0,0.04)",
    transition: "all 0.4s ease",
    cursor: "pointer",
    overflow: "hidden",
  },
  programAccent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "4px",
    borderRadius: "4px 4px 0 0",
  },
  programIconWrapper: {
    width: "56px",
    height: "56px",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "16px",
  },
  programNumber: {
    position: "absolute",
    top: "16px",
    right: "20px",
    fontSize: "32px",
    fontWeight: "800",
    color: "rgba(0,0,0,0.04)",
    letterSpacing: "-0.02em",
  },
  programLevel: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#1C2833",
    marginBottom: "4px",
  },
  programSpan: {
    fontSize: "13px",
    fontWeight: "600",
    display: "block",
    marginBottom: "12px",
  },
  programDescription: {
    fontSize: "14px",
    color: "#5D6D7E",
    lineHeight: 1.6,
    marginBottom: "16px",
  },
  programLink: {
    fontSize: "14px",
    fontWeight: "600",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    transition: "gap 0.3s ease",
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
    textAlign: "center",
    transition: "all 0.4s ease",
    cursor: "default",
  },
  strengthIconWrapper: {
    width: "52px",
    height: "52px",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 14px",
  },
  strengthTitle: {
    fontSize: "17px",
    fontWeight: "700",
    color: "#1C2833",
    marginBottom: "6px",
  },
  strengthDescription: {
    fontSize: "14px",
    color: "#5D6D7E",
    lineHeight: 1.6,
  },
  achievementsSection: {
    padding: "80px 24px",
    background: "#FFFFFF",
    position: "relative",
  },
  achievementsContainer: {
    maxWidth: "1200px",
    margin: "0 auto",
    position: "relative",
    zIndex: 2,
  },
  achievementsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "20px",
  },
  achievementCard: {
    padding: "28px 24px",
    borderRadius: "20px",
    border: "1px solid rgba(0,0,0,0.04)",
    textAlign: "center",
    transition: "all 0.4s ease",
    cursor: "default",
  },
  achievementIconWrapper: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 14px",
  },
  achievementTitle: {
    fontSize: "17px",
    fontWeight: "700",
    color: "#1C2833",
    marginBottom: "6px",
  },
  achievementDescription: {
    fontSize: "14px",
    color: "#5D6D7E",
    lineHeight: 1.6,
  },
  assessmentSection: {
    padding: "80px 24px",
    background: "#F8F6F0",
  },
  assessmentContainer: {
    maxWidth: "1000px",
    margin: "0 auto",
  },
  assessmentContent: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
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
    background: "rgba(125, 60, 152, 0.08)",
    color: "#7D3C98",
    marginBottom: "12px",
  },
  assessmentTitle: {
    fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
    fontWeight: "800",
    color: "#1C2833",
    marginBottom: "12px",
    letterSpacing: "-0.02em",
  },
  assessmentDescription: {
    fontSize: "1rem",
    color: "#5D6D7E",
    lineHeight: 1.7,
  },
  assessmentMethods: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },
  assessmentMethod: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 16px",
    borderRadius: "12px",
    background: "#FFFFFF",
    fontSize: "14px",
    fontWeight: "500",
    color: "#1C2833",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  },
};

// ============ HOVER EFFECTS ============
const hoverStyles = `
  .academics-page .stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.06);
  }
  .academics-page .program-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 50px rgba(0,0,0,0.08);
  }
  .academics-page .strength-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.06);
  }
  .academics-page .achievement-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.06);
  }
  .academics-page .program-link:hover {
    gap: 12px;
  }
`;

// ============ EXPORT ============
const AcademicsPageWithStyles = () => (
  <>
    <style>{hoverStyles}</style>
    <AcademicsPage />
  </>
);

export default AcademicsPageWithStyles;