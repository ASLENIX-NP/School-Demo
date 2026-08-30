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

const mergeAcademicsContent = (saved = {}) => {
  return {
    ...defaultAcademicsData,
    ...saved,
    hero: { ...defaultAcademicsData.hero, ...(saved.hero || {}) },
    stats: Array.isArray(saved.stats) ? saved.stats : defaultAcademicsData.stats,
    strengths: Array.isArray(saved.strengths) ? saved.strengths : defaultAcademicsData.strengths,
    achievements: Array.isArray(saved.achievements) ? saved.achievements : defaultAcademicsData.achievements,
    assessment: {
      ...defaultAcademicsData.assessment,
      ...(saved.assessment || {}),
      methods: Array.isArray(saved.assessment?.methods) ? saved.assessment.methods : defaultAcademicsData.assessment.methods,
    },
    classLevels: Array.isArray(saved.classLevels) ? saved.classLevels : defaultAcademicsData.classLevels,
    levelsHeading: { ...defaultAcademicsData.levelsHeading, ...(saved.levelsHeading || {}) },
    strengthsHeading: { ...defaultAcademicsData.strengthsHeading, ...(saved.strengthsHeading || {}) },
    achievementsHeading: { ...defaultAcademicsData.achievementsHeading, ...(saved.achievementsHeading || {}) },
    assessmentHeading: { ...defaultAcademicsData.assessmentHeading, ...(saved.assessmentHeading || {}) },
  };
};

// ============================================================
// GLOBAL STYLES (MOBILE FIXED)
// ============================================================
function AcademicsStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700&family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');

      .rr-academics { font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif; color: ${theme.text}; background: ${theme.paper}; }
      .rr-academics *, .rr-academics *::before, .rr-academics *::after { box-sizing: border-box; }
      .rr-serif { font-family: 'Fraunces', Georgia, 'Times New Roman', serif; }
      .rr-mono { font-family: 'Space Grotesk', 'IBM Plex Mono', monospace; }

      /* HERO CARD */
      .rr-academics-hero-card::after {
        content: ""; position: absolute; z-index: 3; left: 0; right: 0; bottom: -1px; height: 30px;
        background: ${theme.paper};
        clip-path: polygon(0 38%, 2% 72%, 4% 38%, 6% 72%, 8% 38%, 10% 72%, 12% 38%, 14% 72%, 16% 38%, 18% 72%, 20% 38%, 22% 72%, 24% 38%, 26% 72%, 28% 38%, 30% 72%, 32% 38%, 34% 72%, 36% 38%, 38% 72%, 40% 38%, 42% 72%, 44% 38%, 46% 72%, 48% 38%, 50% 72%, 52% 38%, 54% 72%, 56% 38%, 58% 72%, 60% 38%, 62% 72%, 64% 38%, 66% 72%, 68% 38%, 70% 72%, 72% 38%, 74% 72%, 76% 38%, 78% 72%, 80% 38%, 82% 72%, 84% 38%, 86% 72%, 88% 38%, 90% 72%, 92% 38%, 94% 72%, 96% 38%, 98% 72%, 100% 38%, 100% 100%, 0 100%);
      }

      /* MOBILE-SPECIFIC OVERRIDES */
      @media (max-width: 900px) {
        .rr-academics-panel-grid { grid-template-columns: 1fr !important; }
        .rr-academics-strengths-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
        .rr-achievements-grid { grid-template-columns: 1fr !important; }
        .rr-academics-assessment-content { grid-template-columns: 1fr !important; gap: 30px !important; }
        .rr-academics-assessment-methods { grid-template-columns: 1fr !important; }
      }

      @media (max-width: 640px) {
        .rr-academics-hero { padding-top: 24px !important; padding-bottom: 40px !important; }
        .rr-academics-hero-card { min-height: 0 !important; border-radius: 0 0 24px 24px !important; }
        .rr-academics-hero-inner { padding: 42px 24px 65px !important; }
        .rr-academics-hero-description { font-size: 13px !important; }

        .rr-academics-levels, .rr-academics-strengths, .rr-academics-achievements, .rr-academics-assessment {
          padding-left: 16px !important; padding-right: 16px !important; padding-top: 50px !important; padding-bottom: 55px !important;
        }

        .rr-academics-strengths-grid { grid-template-columns: 1fr !important; }
        .rr-achievements-grid { grid-template-columns: 1fr !important; gap: 16px !important; }
        .rr-achievement-card { padding: 26px 22px !important; min-height: auto !important; }

        .rr-academics-levels-grid { grid-template-columns: 1fr !important; gap: 14px !important; margin-bottom: 25px !important; }
        .rr-academics-curriculum { padding: 24px 18px !important; border-radius: 18px !important; }

        .rr-academics-panel-header { flex-direction: column !important; gap: 15px !important; }
        .rr-academics-age-card { min-width: 100% !important; flex-direction: row !important; justify-content: space-between !important; }

        .rr-academics-class-tabs { flex-direction: column !important; align-items: flex-start !important; gap: 10px !important; }
        .rr-academics-class-tabs-group { width: 100% !important; }

        .rr-academics-subject-row { align-items: flex-start !important; flex-direction: column !important; gap: 8px !important; width: 100% !important; }
        .rr-academics-subject-right { width: 100% !important; justify-content: space-between !important; gap: 5px !important; }
        .rr-academics-subject-type { white-space: normal !important; text-align: center !important; flex: 1 !important; }

        .rr-academics-inner-card { padding: 18px !important; }
        .rr-academics-highlights-list { gap: 10px !important; }

        .rr-academics-assessment-methods { border-top: none !important; margin-top: 25px !important; }
        .rr-academics-assessment-method { padding: 15px 12px !important; }
      }

      @media (max-width: 500px) {
        .rr-academics-level-card { padding: 20px !important; }
      }

      @media (prefers-reduced-motion: reduce) {
        .rr-academics *, .rr-academics *::before, .rr-academics *::after {
          animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; transition-duration: 0.001ms !important;
        }
      }
    `}</style>
  );
}

// ============================================================
// COMPONENTS
// ============================================================
function EditIconButton({ editMode, target, onEditTarget, icon: Icon = Pencil, label = "Edit" }) {
  if (!editMode) return null;
  return (
    <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEditTarget(target); }}
      className="absolute -top-2 -right-2 z-[90] opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 rounded-full w-8 h-8 flex items-center justify-center shadow-lg backdrop-blur-md"
      style={{ background: "rgba(255,255,255,0.9)", color: "#9C2748", border: "1px solid rgba(185,138,66,0.33)" }} title={label}>
      <Icon className="w-3.5 h-3.5" />
    </button>
  );
}

function DeleteIconButton({ editMode, target, onDeleteTarget, label = "Delete" }) {
  if (!editMode) return null;
  return (
    <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDeleteTarget(target); }}
      className="absolute -top-2 -right-12 z-[90] opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 rounded-full w-8 h-8 flex items-center justify-center shadow-lg"
      style={{ background: "#FBE3E7", color: "#9C2748", border: "2px solid #FFFFFF" }} title={label}>
      <Trash2 className="w-3.5 h-3.5" />
    </button>
  );
}

function EditableWrap({ editMode, target, onEditTarget, onDeleteTarget = () => {}, icon = Pencil, label = "Edit", canDelete = false, className = "", children }) {
  if (!editMode) return children;
  return (
    <div className={`relative group ${className}`}>
      {children}
      <EditIconButton editMode={editMode} target={target} onEditTarget={onEditTarget} icon={icon} label={label} />
      {canDelete && <DeleteIconButton editMode={editMode} target={target} onDeleteTarget={onDeleteTarget} label="Delete" />}
    </div>
  );
}

function SectionAddButton({ editMode, label, type, target, onAddTarget }) {
  if (!editMode) return null;
  return (
    <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onAddTarget(target || type); }}
      className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5"
      style={{ color: "#FFFFFF", background: "linear-gradient(135deg, #6E1733 0%, #9C2748 55%, #C6486B 100%)", boxShadow: "0 10px 24px rgba(156,39,72,0.25)" }}>
      <Plus className="w-4 h-4" /> {label}
    </button>
  );
}

function SectionIntro({ eyebrow, title, description, align = "left" }) {
  const centered = align === "center";
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }}
      style={{ maxWidth: centered ? "720px" : "760px", margin: centered ? "0 auto 42px" : "0 0 34px", textAlign: centered ? "center" : "left" }}>
      <motion.div initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
        style={{ display: "flex", alignItems: "center", justifyContent: centered ? "center" : "flex-start", gap: "12px", marginBottom: "14px" }}>
        <span style={{ width: "34px", height: "1px", background: theme.gold }} />
        <span className="rr-mono" style={{ color: theme.rose, fontSize: "11px", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase" }}>{eyebrow}</span>
      </motion.div>
      <motion.h2 className="rr-serif" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.15 }}
        style={{ margin: 0, color: theme.ink, fontSize: "clamp(2rem, 4vw, 3.15rem)", lineHeight: 1.05, fontWeight: 600, letterSpacing: "-0.025em" }} dangerouslySetInnerHTML={{ __html: title }} />
      {description && (
        <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}
          style={{ margin: "16px auto 0", maxWidth: centered ? "650px" : "700px", color: theme.textMuted, fontSize: "15px", lineHeight: 1.75 }}>{description}</motion.p>
      )}
    </motion.div>
  );
}

// ============================================================
// MAIN PAGE COMPONENT
// ============================================================
const AcademicsPage = ({ editMode = false, contentOverride = null, onEditTarget = () => {}, onDeleteTarget = () => {}, onAddTarget = () => {} }) => {
  const [activeLevelId, setActiveLevelId] = useState("primary");
  const [activeClassIndex, setActiveClassIndex] = useState(0);
  const [data, setData] = useState(mergeAcademicsContent(defaultAcademicsData));

  useEffect(() => {
    let alive = true;
    if (contentOverride) { setData(mergeAcademicsContent(contentOverride)); return () => { alive = false; }; }
    const loadAcademics = async () => {
      try {
        const res = await api.get("/api/site-content/academics", { timeout: 12000 });
        if (!alive) return;
        const saved = res.data?.data?.content || {};
        setData(mergeAcademicsContent(saved));
      } catch (error) {
        console.error("Academics content load error:", error);
        if (alive) setData(mergeAcademicsContent(defaultAcademicsData));
      }
    };
    loadAcademics();
    return () => { alive = false; };
  }, [contentOverride]);

  const classLevels = data.classLevels || [];

  // The selected level is intentionally nullable.
  // Clicking the currently-open level again closes the curriculum panel.
  const activeLevel = activeLevelId
    ? classLevels.find((level) => level.id === activeLevelId) || null
    : null;

  const activeClass = activeLevel?.classes?.[activeClassIndex]
    || activeLevel?.classes?.[0]
    || { subjects: [], curriculumHighlights: [], assessmentMethod: "" };

  const handleSelectLevel = (levelId) => {
    // Same card clicked again -> close the curriculum panel.
    if (activeLevelId === levelId) {
      setActiveLevelId(null);
      setActiveClassIndex(0);
      return;
    }

    // Different card -> open that level and reset to its first class.
    setActiveLevelId(levelId);
    setActiveClassIndex(0);
  };

  const visibleStats = (data.stats || []).filter((s) => s.visible !== false);
  const visibleStrengths = (data.strengths || []).filter((s) => s.visible !== false);
  const visibleAchievements = (data.achievements || []).filter((a) => a.visible !== false);
  const visibleClassLevels = classLevels.filter((l) => l.visible !== false);

  const styles = { ...globalStyles }; // Referencing the styles object below

  return (
    <div className="rr-academics" style={styles.page}>
      <AcademicsStyles />

      {/* HERO */}
      <section className="rr-academics-hero" style={styles.hero}>
        <EditableWrap editMode={editMode} target={{ type: "hero" }} onEditTarget={onEditTarget} label="Edit hero">
          <motion.div className="rr-academics-hero-card" initial={{ opacity: 0, y: 30, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} style={styles.heroCard}>
            <div className="rr-academics-hero-inner" style={styles.heroInner}>
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} style={styles.eyebrow}>
                <span style={styles.eyebrowLine} />
                <span className="rr-mono">{data.hero.badge || "Excellence in Education"}</span>
              </motion.div>
              <motion.h1 className="rr-serif" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }} style={styles.heroTitle}
                dangerouslySetInnerHTML={{ __html: data.hero.title || "Empowering Minds,<br/><span style='color: #E7CE9C;'>Shaping Futures.</span>" }} />
              <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} style={styles.heroLead}>
                {data.hero.subtitle || "Nurturing the next generation of thinkers, innovators, and leaders through quality education."}
              </motion.p>
              <motion.p className="rr-academics-hero-description" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} style={styles.heroDescription}>
                {data.hero.description || "At Red Rose Secondary English Boarding School, education extends beyond textbooks. Our comprehensive academic framework integrates intellectual rigor, creative exploration, ethical grounding, and real-world readiness from early childhood through secondary education."}
              </motion.p>
            </div>
          </motion.div>
        </EditableWrap>
      </section>

      {/* STATS */}
      <div style={{ maxWidth: "1180px", margin: "-20px auto 0", padding: "0 24px", position: "relative", zIndex: 5 }}>
        {editMode && <div className="flex justify-end mb-4"><SectionAddButton editMode={editMode} label="Add Stat" type="stat" onAddTarget={onAddTarget} /></div>}
        <div className="rr-academics-stats-grid" style={styles.statsGrid}>
          {visibleStats.map((stat, index) => (
            <EditableWrap key={stat.id || index} editMode={editMode} target={{ type: "statsCard", index }} onEditTarget={onEditTarget} onDeleteTarget={onDeleteTarget} canDelete={visibleStats.length > 1} label="Edit stat">
              <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: index * 0.06 }} style={{ ...styles.statCard, borderColor: stat.color ? `${stat.color}40` : "#E9DCC4" }}>
                <span style={{ ...styles.statValue, color: stat.color || "#9C2748" }}>{stat.value}{stat.suffix}</span>
                <span style={styles.statLabel}>{stat.label}</span>
              </motion.div>
            </EditableWrap>
          ))}
        </div>
      </div>

      {/* CLASS LEVELS */}
      <section id="class-levels" className="rr-academics-levels" style={styles.levelsSection}>
        <SectionIntro eyebrow={data.levelsHeading?.eyebrow || "Academic Structure"} title={data.levelsHeading?.title || 'Explore Our <span style="color: #9C2748;">Class Levels</span>'} description={data.levelsHeading?.description || "Explore each academic stage to see the classes, subjects, weekly learning hours, curriculum highlights, and assessment structure."} align="center" />
        {editMode && <div className="flex justify-end mb-4"><SectionAddButton editMode={editMode} label="Add Class Level" type="classLevel" onAddTarget={onAddTarget} /></div>}

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.6, delay: 0.1 }} className="rr-academics-levels-grid" style={styles.levelsGrid}>
          {visibleClassLevels.map((level, index) => {
            const realIndex = classLevels.findIndex((item) => item.id === level.id);
            const isActive = level.id === activeLevelId;
            const levelColor = level.color || "#9C2748";
            return (
              <EditableWrap key={level.id || index} editMode={editMode} target={{ type: "classLevel", index: realIndex >= 0 ? realIndex : index }} onEditTarget={onEditTarget} onDeleteTarget={onDeleteTarget} canDelete={visibleClassLevels.length > 1} label="Edit academic level" className="h-full">
                <motion.button
                  type="button"
                  className="rr-level-card"
                  onClick={() => handleSelectLevel(level.id)}
                  aria-expanded={isActive}
                  aria-controls={isActive ? "rr-active-curriculum-panel" : undefined}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.99 }}
                  style={{
                    ...styles.levelCard,
                    width: "100%",
                    height: "100%",
                    borderColor: isActive ? levelColor : theme.paperDeep,
                    boxShadow: isActive
                      ? `0 12px 30px ${levelColor}18`
                      : "0 5px 18px rgba(30,20,32,0.035)",
                  }}
                >
                  <div style={styles.levelCardNumber}>
                    <span className="rr-mono" style={{ color: isActive ? levelColor : theme.textMuted }}>{String(index + 1).padStart(2, "0")}</span>
                    <span style={{ ...styles.levelBadge, color: levelColor, background: level.bgAccent || `${levelColor}18` }}>{level.shortBadge || "Level"}</span>
                  </div>
                  <h3 className="rr-serif" style={{ ...styles.levelName, color: isActive ? levelColor : theme.ink }}>{level.name || "New Level"}</h3>
                  <p style={styles.levelSpan}>{level.span || "Class Range"}</p>
                  {level.ageGroup && <span style={{ ...styles.levelAgePill, color: levelColor, background: level.bgAccent || `${levelColor}18` }}>Age {level.ageGroup}</span>}
                  <div className="rr-level-select" style={{ ...styles.levelSelect, color: isActive ? theme.white : levelColor, background: isActive ? levelColor : "transparent", borderColor: levelColor }}>
                    <span>{isActive ? "Viewing Curriculum" : "Explore Level"}</span>
                    {isActive ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                  </div>
                </motion.button>
              </EditableWrap>
            );
          })}
        </motion.div>

        <AnimatePresence mode="wait">
          {activeLevel && (
            <motion.div
              key={activeLevel.id}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.96 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              id="rr-active-curriculum-panel"
              className="rr-academics-curriculum"
              style={{
                ...styles.curriculumPanel,
                borderTopColor: activeLevel.color || "#9C2748",
              }}
            >
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="rr-academics-panel-header" style={styles.panelHeader}>
              <EditableWrap editMode={editMode} target={{ type: "classLevel", index: classLevels.findIndex((level) => level.id === activeLevel.id) }} onEditTarget={onEditTarget} onDeleteTarget={onDeleteTarget} canDelete={classLevels.length > 1} label="Edit academic level">
                <div style={styles.panelHeaderLeft}>
                  <span className="rr-mono" style={{ ...styles.panelBadge, color: activeLevel.color || "#9C2748", background: activeLevel.bgAccent || "rgba(156,39,72,0.10)", borderColor: activeLevel.borderAccent || "rgba(156,39,72,0.20)" }}>{activeLevel.name} · {activeLevel.span}</span>
                  {activeLevel.tagline && <h3 className="rr-serif" style={styles.panelTitle}>{activeLevel.tagline}</h3>}
                  {activeLevel.description && <p style={styles.panelDescription}>{activeLevel.description}</p>}
                </div>
              </EditableWrap>
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="rr-academics-age-card" style={{ ...styles.ageCard, borderColor: activeLevel.borderAccent || "rgba(156,39,72,0.20)" }}>
                <span className="rr-mono" style={{ color: theme.textMuted, fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em" }}>Target Age</span>
                <strong style={{ color: activeLevel.color || "#9C2748" }}>{activeLevel.ageGroup || "N/A"}</strong>
              </motion.div>
            </motion.div>

            {activeLevel.classes && activeLevel.classes.length > 1 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }} className="rr-academics-class-tabs" style={styles.classTabsContainer}>
                <span className="rr-mono" style={styles.classTabLabel}>Select Class / Stream</span>
                <div className="rr-academics-class-tabs-group" style={styles.classTabsGroup}>
                  {(activeLevel.classes || []).filter((cls) => cls.visible !== false).map((cls, idx) => {
                    const realClassIndex = activeLevel.classes.findIndex((item) => item.id === cls.id);
                    const isActive = activeClassIndex === (realClassIndex >= 0 ? realClassIndex : idx);
                    return (
                      <EditableWrap key={cls.id || idx} editMode={editMode} target={{ type: "classItem", levelIndex: classLevels.findIndex((level) => level.id === activeLevel.id), classIndex: realClassIndex >= 0 ? realClassIndex : idx }} onEditTarget={onEditTarget} onDeleteTarget={onDeleteTarget} canDelete={(activeLevel.classes || []).length > 1} label="Edit class">
                        <button type="button" className={`rr-class-tab ${isActive ? "active" : ""}`} onClick={() => setActiveClassIndex(realClassIndex >= 0 ? realClassIndex : idx)} style={{ ...styles.classTabBtn, background: isActive ? activeLevel.color || "#9C2748" : theme.card, color: isActive ? theme.white : theme.ink, borderColor: isActive ? activeLevel.color || "#9C2748" : theme.paperDeep }}>
                          {cls.name || "Class"}
                        </button>
                      </EditableWrap>
                    );
                  })}
                </div>
              </motion.div>
            )}

            <div className="flex justify-end mb-4">
              <SectionAddButton editMode={editMode} label="Add Class" type="classItem" target={{ type: "classItem", levelIndex: classLevels.findIndex((level) => level.id === activeLevel.id) }} onAddTarget={onAddTarget} />
            </div>

            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="rr-academics-panel-grid" style={styles.curriculumGrid}>
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.25 }} className="rr-academics-inner-card" style={styles.innerCard}>
                <div style={styles.innerHeading}>
                  <span style={{ ...styles.headingDot, background: activeLevel.color || "#9C2748" }} />
                  <div><span className="rr-mono" style={styles.headingEyebrow}>Curriculum</span><h4 style={styles.innerTitle}>Subject Breakdown</h4></div>
                </div>
                <p style={styles.innerSubtext}>{activeClass.name || "Class"}</p>
                <div style={styles.subjectsList}>
                  {(activeClass.subjects || []).map((subject, index) => (
                    <motion.div key={index} className="rr-subject-row" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }} style={styles.subjectRow}>
                      <div style={styles.subjectLeft}>
                        <span style={{ ...styles.subjectBullet, background: activeLevel.color || "#9C2748" }} />
                        <span style={styles.subjectName}>{subject.name || "Subject"}</span>
                      </div>
                      <div className="rr-academics-subject-right" style={styles.subjectRight}>
                        <span className="rr-academics-subject-type" style={{ ...styles.subjectType, color: subject.type === "Practical" || subject.type === "Lab" || subject.type === "Lab & Theory" || subject.type === "Elective" || subject.type === "Elective Lab" ? theme.moss : theme.rose, background: subject.type === "Practical" || subject.type === "Lab" || subject.type === "Lab & Theory" || subject.type === "Elective" || subject.type === "Elective Lab" ? `${theme.moss}0D` : `${theme.rose}0D` }}>{subject.type || "Core"}</span>
                        <span style={styles.subjectHours}>{subject.hours || "5 hrs/wk"}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }} style={styles.detailsColumn}>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.35 }} className="rr-academics-inner-card" style={styles.innerCard}>
                  <div style={styles.innerHeading}>
                    <span style={{ ...styles.headingDot, background: activeLevel.color || "#9C2748" }} />
                    <div><span className="rr-mono" style={styles.headingEyebrow}>Learning Experience</span><h4 style={styles.innerTitle}>Curriculum Highlights</h4></div>
                  </div>
                  <ul className="rr-academics-highlights-list" style={styles.highlightsList}>
                    {(activeClass.curriculumHighlights || []).map((item, index) => (
                      <motion.li key={index} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.4 + index * 0.08 }} style={styles.highlightItem}>
                        <span className="rr-mono" style={{ ...styles.highlightNumber, color: activeLevel.color || "#9C2748" }}>{String(index + 1).padStart(2, "0")}</span>
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.45 }} style={{ ...styles.assessmentCard, borderLeftColor: activeLevel.color || "#9C2748" }}>
                  <span className="rr-mono" style={styles.headingEyebrow}>Evaluation & Assessment</span>
                  <p style={styles.assessmentText}>{activeClass.assessmentMethod || "Assessment method description"}</p>
                </motion.div>
              </motion.div>
            </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* STRENGTHS */}
      <section className="rr-academics-strengths" style={styles.strengthsSection}>
        <div style={styles.sectionContainer}>
          <SectionIntro eyebrow={data.strengthsHeading?.eyebrow || "What Sets Us Apart"} title={data.strengthsHeading?.title || 'Our <span style="color: #9C2748;">Academic Strengths</span>'} description={data.strengthsHeading?.description || "A learning ecosystem built on innovation, expertise, and unwavering commitment to student success."} align="left" />
          {editMode && <div className="flex justify-end mb-4"><SectionAddButton editMode={editMode} label="Add Strength" type="strength" onAddTarget={onAddTarget} /></div>}
          <div className="rr-academics-strengths-grid" style={styles.strengthsGrid}>
            {visibleStrengths.map((strength, index) => {
              const realIndex = data.strengths.findIndex((s) => s.id === strength.id);
              return (
                <EditableWrap key={strength.id || index} editMode={editMode} target={{ type: "strengthCard", index: realIndex >= 0 ? realIndex : index }} onEditTarget={onEditTarget} onDeleteTarget={onDeleteTarget} canDelete={visibleStrengths.length > 1} label="Edit strength">
                  <motion.article className="rr-strength-card" initial={{ opacity: 0, y: 20, scale: 0.96 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }} style={styles.strengthCard}>
                    <span className="rr-strength-accent" style={{ background: strength.color || "#9C2748" }} />
                    <span className="rr-strength-letter" aria-hidden="true">{(strength.title || "S").charAt(0)}</span>
                    <div style={styles.strengthContent}>
                      <h4 className="rr-serif" style={styles.strengthTitle}>{strength.title || "New Strength"}</h4>
                      <p style={styles.strengthDescription}>{strength.description || "Describe the academic strength of the school."}</p>
                    </div>
                    <span className="rr-card-line" style={{ ...styles.cardLine, background: strength.color || "#9C2748" }} />
                  </motion.article>
                </EditableWrap>
              );
            })}
          </div>
        </div>
      </section>

      {/* ACHIEVEMENTS */}
      <section className="rr-academics-achievements" style={styles.achievementsSection}>
        <div style={styles.sectionContainer}>
          <SectionIntro eyebrow={data.achievementsHeading?.eyebrow || "Our Milestones"} title={data.achievementsHeading?.title || 'Celebrating <span style="color: #9C2748;">Excellence</span>'} description={data.achievementsHeading?.description || "Achievements that reflect the effort of our students, teachers, and wider school community."} align="center" />
          {editMode && <div className="flex justify-end mb-4"><SectionAddButton editMode={editMode} label="Add Achievement" type="achievement" onAddTarget={onAddTarget} /></div>}
          <div className="rr-achievements-grid" style={styles.achievementsGrid}>
            {visibleAchievements.map((achievement, index) => {
              const realIndex = data.achievements.findIndex((a) => a.id === achievement.id);
              return (
                <EditableWrap key={achievement.id || index} editMode={editMode} target={{ type: "achievementCard", index: realIndex >= 0 ? realIndex : index }} onEditTarget={onEditTarget} onDeleteTarget={onDeleteTarget} canDelete={visibleAchievements.length > 1} label="Edit achievement">
                  <motion.article className="rr-achievement-card" initial={{ opacity: 0, y: 25, scale: 0.97 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }} style={styles.achievementCard}>
                    <motion.span className="rr-mono" initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: index * 0.08 + 0.1 }} style={styles.achievementNumber}>{String(index + 1).padStart(2, "0")}</motion.span>
                    <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: index * 0.08 + 0.15 }} style={styles.achievementContent}>
                      <h4 className="rr-serif" style={styles.achievementTitle}>{achievement.title || "New Achievement"}</h4>
                      <p style={styles.achievementDescription}>{achievement.description || "Describe the achievement of the school."}</p>
                    </motion.div>
                    <span className="rr-achievement-line" style={styles.achievementLine} />
                  </motion.article>
                </EditableWrap>
              );
            })}
          </div>
        </div>
      </section>

      {/* ASSESSMENT */}
      <section className="rr-academics-assessment" style={styles.assessmentSection}>
        <div style={styles.sectionContainer}>
          <EditableWrap editMode={editMode} target={{ type: "assessment" }} onEditTarget={onEditTarget} label="Edit assessment">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }} className="rr-academics-assessment-content" style={styles.assessmentContent}>
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
                <div style={styles.eyebrow}><span style={styles.eyebrowLine} /><span className="rr-mono">Assessment & Growth</span></div>
                <h2 className="rr-serif" style={styles.assessmentTitle}>{data.assessment.title || "Holistic Assessment Framework"}</h2>
                <p style={styles.assessmentDescription}>{data.assessment.description || "Our evaluation system celebrates growth through multiple dimensions of student development."}</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }} className="rr-academics-assessment-methods" style={styles.assessmentMethods}>
                {(data.assessment.methods || defaultAcademicsData.assessment.methods).map((method, index) => (
                  <motion.div key={index} className="rr-assessment-method" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.3 + index * 0.06 }} style={styles.assessmentMethod}>
                    <span className="rr-mono" style={{ color: theme.rose, fontSize: "11px", fontWeight: 700 }}>{String(index + 1).padStart(2, "0")}</span>
                    <span>{method}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </EditableWrap>
        </div>
      </section>
    </div>
  );
};

// ============================================================
// DEFAULT DATA
// ============================================================
const defaultAcademicsData = {
  hero: { badge: "Excellence in Education", title: "Empowering Minds, Shaping Futures.", subtitle: "Nurturing the next generation of thinkers, innovators, and leaders through quality education.", description: "At Red Rose Secondary English Boarding School, education extends beyond textbooks. Our comprehensive academic framework integrates intellectual rigor, creative exploration, ethical grounding, and real-world readiness from early childhood through secondary education." },
  stats: [
    { id: "stat-1", value: "1500", suffix: "+", label: "Active Learners", color: "#9C2748", visible: true },
    { id: "stat-2", value: "85", suffix: "+", label: "Dedicated Educators", color: "#B98A42", visible: true },
    { id: "stat-3", value: "55", suffix: "+", label: "Years of Impact", color: "#3F5B49", visible: true },
    { id: "stat-4", value: "100", suffix: "%", label: "SEE Pass Rate", color: "#4A2C6E", visible: true },
  ],
  strengths: [
    { id: "strength-1", title: "Innovation Hub", description: "State-of-the-art learning spaces with interactive technology and collaborative zones.", color: "#9C2748", visible: true },
    { id: "strength-2", title: "STEM Excellence", description: "Robust science, technology, engineering, and mathematics programs with hands-on experimentation.", color: "#3F5B49", visible: true },
    { id: "strength-3", title: "Global Perspective", description: "Integrated curriculum emphasizing critical thinking and cross-cultural communication.", color: "#B98A42", visible: true },
    { id: "strength-4", title: "Arts & Expression", description: "Comprehensive arts education nurturing creativity through visual arts, music, and performance.", color: "#C6486B", visible: true },
    { id: "strength-5", title: "Character Development", description: "Values-based education cultivating integrity, empathy, and social responsibility.", color: "#4A2C6E", visible: true },
    { id: "strength-6", title: "Future Ready", description: "Career and college counseling with mentorship pathways and leadership development.", color: "#2D6A4F", visible: true },
  ],
  achievements: [
    { id: "ach-1", title: "Academic Excellence Awards", description: "Consistent top-tier SEE performance and regional academic honors in Makwanpur.", visible: true },
    { id: "ach-2", title: "Science & STEM Showcase", description: "Student science exhibition projects recognized at district and national youth fairs.", visible: true },
    { id: "ach-3", title: "Community & Service", description: "Student-led service initiatives contributing to local literacy and environmental projects.", visible: true },
    { id: "ach-4", title: "Co-Curricular Triumphs", description: "Championship trophies in inter-school football, athletics, and cultural dance competitions.", visible: true },
  ],
  assessment: { title: "Holistic Assessment Framework", description: "Our evaluation system celebrates growth through multiple dimensions of student development.", methods: ["Continuous Assessment System (CAS)", "Laboratory Practical Examinations", "Project-Based & Group Presentations", "Periodic Diagnostic Unit Tests", "Terminal Examinations & SEE Model Series", "Co-curricular & Moral Progress Logs"] },
  classLevels: [
    { id: "pre-primary", name: "Pre-Primary / Early Years", shortBadge: "Early Childhood", span: "Play Group, Nursery, LKG, UKG", ageGroup: "3 – 5.5 Years", color: "#B98A42", bgAccent: "rgba(185, 138, 66, 0.12)", borderAccent: "rgba(185, 138, 66, 0.25)", tagline: "Foundation of Curiosity, Play-Based Learning & Motor Skills", description: "Our early childhood program nurtures young minds through playful exploration, sensory exercises, phonics, storytelling, and creative arts in a safe and supportive environment.", visible: true, classes: [
      { id: "pg-nursery", name: "Play Group & Nursery", focus: "Sensory, Language Readiness & Social Interaction", visible: true, subjects: [{ name: "Phonics & Rhymes", type: "Core", hours: "5 hrs/wk" }, { name: "Picture Reading & Storytelling", type: "Core", hours: "4 hrs/wk" }, { name: "Number Games & Counting", type: "Core", hours: "4 hrs/wk" }, { name: "Creative Arts & Craft", type: "Activity", hours: "5 hrs/wk" }, { name: "Play & Motor Skills", type: "Activity", hours: "4 hrs/wk" }], curriculumHighlights: ["Montessori-inspired tactile learning corners & play zones", "Daily storytelling sessions in conversational English & Nepali", "Zero exam pressure: Individual progress tracked via monthly milestone logs", "Basic color identification, pattern recognition, and fine motor development"], assessmentMethod: "Continuous Activity Milestone Logs & Parent Progress Conferences" },
      { id: "lkg-ukg", name: "LKG & UKG", focus: "Early Literacy, Numeracy & Environmental Awareness", visible: true, subjects: [{ name: "English Reading & Writing", type: "Core", hours: "6 hrs/wk" }, { name: "Nepali Barnamala & Words", type: "Core", hours: "5 hrs/wk" }, { name: "Elementary Mathematics", type: "Core", hours: "5 hrs/wk" }, { name: "General Knowledge & Nature", type: "Core", hours: "3 hrs/wk" }, { name: "Drawing, Color & Music", type: "Activity", hours: "4 hrs/wk" }], curriculumHighlights: ["Phonics-based English reading and neat print handwriting practice", "Nepali alphabet recognition and simple sentence formation", "Basic addition and subtraction concepts using visual counters", "Group activities encouraging confidence, manners, and team building"], assessmentMethod: "Playful Classroom Assessments & Progress Evaluation Certificates" },
    ] },
    { id: "primary", name: "Primary Level", shortBadge: "Grades 1 – 5", span: "Class 1 to Class 5", ageGroup: "6 – 10 Years", color: "#9C2748", bgAccent: "rgba(156, 39, 72, 0.10)", borderAccent: "rgba(156, 39, 72, 0.20)", tagline: "Core Academic Fundamentals & Integrated STEAM Activities", description: "Building strong intellectual foundations in languages, mathematics, general science, and social studies alongside computer literacy, art, and moral education.", visible: true, classes: [
      { id: "grade-1-3", name: "Grade 1 – 3 (Lower Primary)", focus: "Foundational Literacy, Numeracy & Scientific Inquiry", visible: true, subjects: [{ name: "English Grammar & Reader", type: "Compulsory", hours: "6 hrs/wk" }, { name: "Nepali Bhasa & Vyakaran", type: "Compulsory", hours: "6 hrs/wk" }, { name: "Mathematics & Reasoning", type: "Compulsory", hours: "6 hrs/wk" }, { name: "Our Surroundings (Science & Social)", type: "Compulsory", hours: "5 hrs/wk" }, { name: "Computer Literacy & Drawing", type: "Practical", hours: "3 hrs/wk" }], curriculumHighlights: ["Fully aligned with Government of Nepal CDC Primary Curriculum standards", "Equal mastery in English and Nepali written and oral communication", "Hands-on science experiments and interactive math manipulative kits", "Continuous Assessment System (CAS) with periodic diagnostic unit tests"], assessmentMethod: "40% Continuous Assessment (CAS) + 60% Terminal Examinations" },
      { id: "grade-4-5", name: "Grade 4 – 5 (Upper Primary)", focus: "Analytical Reasoning, Science Exploration & Digital Basics", visible: true, subjects: [{ name: "English Language & Literature", type: "Compulsory", hours: "6 hrs/wk" }, { name: "Nepali Bhasa & Vyakaran", type: "Compulsory", hours: "6 hrs/wk" }, { name: "Mathematics & Geometry", type: "Compulsory", hours: "6 hrs/wk" }, { name: "General Science & Environment", type: "Compulsory", hours: "5 hrs/wk" }, { name: "Social Studies & Local Culture", type: "Compulsory", hours: "4 hrs/wk" }, { name: "Computer Science & ICT Lab", type: "Practical", hours: "3 hrs/wk" }], curriculumHighlights: ["Structured problem-solving in Arithmetic, Algebra, and Geometry", "Introductory computer lab sessions covering typing, MS Office, and internet safety", "Project work, chart presentations, and local educational excursions", "Inter-house spelling bee, speech contests, and science fair participation"], assessmentMethod: "30% Practical/Project Work + 70% Terminal Examinations" },
    ] },
    { id: "middle", name: "Middle Level (Lower Secondary)", shortBadge: "Grades 6 – 8", span: "Class 6 to Class 8", ageGroup: "11 – 13 Years", color: "#3F5B49", bgAccent: "rgba(63, 91, 73, 0.10)", borderAccent: "rgba(63, 91, 73, 0.20)", tagline: "Critical Thinking, Laboratory Science & District BLE Exam Prep", description: "Empowering students to think analytically, conduct laboratory experiments, build digital applications, and prepare for district-level Basic Level Examinations (BLE).", visible: true, classes: [
      { id: "grade-6-8", name: "Grade 6 – 8 (Class 6, 7 & 8)", focus: "Conceptual Mastery, Practical Science & BLE Board Readiness", visible: true, subjects: [{ name: "English Language & Composition", type: "Compulsory", hours: "6 hrs/wk" }, { name: "Nepali Bhasa & Sahitya", type: "Compulsory", hours: "6 hrs/wk" }, { name: "Compulsory Mathematics", type: "Compulsory", hours: "6 hrs/wk" }, { name: "Science & Technology", type: "Lab & Theory", hours: "6 hrs/wk" }, { name: "Social Studies & Population", type: "Compulsory", hours: "5 hrs/wk" }, { name: "Health, Physical & Creative Arts", type: "Practical", hours: "3 hrs/wk" }, { name: "Computer Science & Coding", type: "Lab", hours: "3 hrs/wk" }], curriculumHighlights: ["Physics, Chemistry, and Biology lab experiments in dedicated science laboratories", "Basic computer programming, web concepts, and office productivity tools", "Grade 8 Basic Level Examination (BLE) district-level model test prep", "Inter-school debate competitions, science quizzes, and sports tournaments"], assessmentMethod: "Grade 8 BLE Board Standards: 25% Practical/Internal + 75% Written Examinations" },
    ] },
    { id: "high", name: "High / Secondary Level", shortBadge: "Grades 9 – 10 (SEE)", span: "Class 9 & Class 10", ageGroup: "14 – 16 Years", color: "#4A2C6E", bgAccent: "rgba(74, 44, 110, 0.10)", borderAccent: "rgba(74, 44, 110, 0.20)", tagline: "Secondary Education Examination (SEE) Prep & Specialized Electives", description: "Intensive academic preparation for the National Examination Board (NEB) Secondary Education Examination (SEE), featuring specialized electives, advanced science labs, and career counseling.", visible: true, classes: [
      { id: "grade-9-10", name: "Grade 9 & Grade 10 (SEE Stream)", focus: "SEE Board Examination Mastery & Advanced Elective Options", visible: true, subjects: [{ name: "Compulsory English", type: "Board Subject", hours: "6 hrs/wk" }, { name: "Compulsory Nepali", type: "Board Subject", hours: "6 hrs/wk" }, { name: "Compulsory Mathematics", type: "Board Subject", hours: "6 hrs/wk" }, { name: "Science & Technology (Phys, Chem, Bio)", type: "Lab & Board", hours: "6 hrs/wk" }, { name: "Social Studies", type: "Board Subject", hours: "5 hrs/wk" }, { name: "Optional Math (Opt. Math) / Economics", type: "Elective", hours: "5 hrs/wk" }, { name: "Accountancy / Computer Science", type: "Elective Lab", hours: "4 hrs/wk" }], curriculumHighlights: ["Rigorous SEE curriculum fully aligned with NEB CDC specifications", "Weekly SEE model examination series with detailed marking feedback", "Dedicated practical sessions for Science & Computer Science board evaluations", "Individual academic coaching, doubt-clearing clinics, and career counseling"], assessmentMethod: "NEB SEE Board Pattern: 25% Internal Practical Assessment + 75% Final SEE Examination" },
    ] },
  ],
  levelsHeading: { eyebrow: "Academic Structure", title: 'Explore Our <span style="color: #9C2748;">Class Levels</span>', description: "Explore each academic stage to see the classes, subjects, weekly learning hours, curriculum highlights, and assessment structure." },
  strengthsHeading: { eyebrow: "What Sets Us Apart", title: 'Our <span style="color: #9C2748;">Academic Strengths</span>', description: "A learning ecosystem built on innovation, expertise, and unwavering commitment to student success." },
  achievementsHeading: { eyebrow: "Our Milestones", title: 'Celebrating <span style="color: #9C2748;">Excellence</span>', description: "Achievements that reflect the effort of our students, teachers, and wider school community." },
  assessmentHeading: { eyebrow: "Assessment & Growth", title: "Holistic Assessment Framework", description: "Our evaluation system celebrates growth through multiple dimensions of student development." }
};

// ============================================================
// STYLES (MOBILE FIXED)
// ============================================================
const globalStyles = {
  page: { minHeight: "100vh", background: theme.paper, overflowX: "hidden", paddingTop: "82px" },
  hero: { background: theme.paper, padding: "48px 24px 74px" },
  heroCard: { position: "relative", maxWidth: "1180px", minHeight: "390px", margin: "0 auto", overflow: "hidden", borderRadius: "0 0 34px 34px", background: "radial-gradient(circle at 85% 25%, rgba(156,39,72,0.28), transparent 28%), radial-gradient(circle at 15% 80%, rgba(185,138,66,0.08), transparent 24%), linear-gradient(135deg, #17101C 0%, #261521 55%, #341A2A 100%)", boxShadow: "0 24px 55px rgba(30,20,32,0.16)" },
  heroInner: { position: "relative", zIndex: 2, maxWidth: "800px", padding: "72px clamp(32px, 6vw, 76px) 92px" },
  heroTitle: { margin: "18px 0 20px", color: theme.white, fontSize: "clamp(2.7rem, 5vw, 4.7rem)", lineHeight: 1.01, fontWeight: 600, letterSpacing: "-0.045em" },
  heroLead: { maxWidth: "720px", margin: "0 0 13px", color: "rgba(255,255,255,0.88)", fontSize: "clamp(1rem, 1.5vw, 1.2rem)", fontWeight: 600, lineHeight: 1.65 },
  heroDescription: { maxWidth: "760px", margin: 0, color: "rgba(245,238,226,0.68)", fontSize: "14px", lineHeight: 1.8 },
  eyebrow: { display: "flex", alignItems: "center", gap: "12px" },
  eyebrowLine: { width: "34px", height: "1px", background: theme.gold },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", maxWidth: "1180px", margin: "0 auto", padding: "0 24px" },
  statCard: { padding: "20px 16px", textAlign: "center", background: theme.card, border: "1px solid", borderRadius: "16px", boxShadow: "0 12px 30px rgba(30,20,32,0.06)" },
  statValue: { fontSize: "28px", fontWeight: 700, fontFamily: "Georgia, 'Times New Roman', serif", display: "block" },
  statLabel: { fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: theme.textMuted, marginTop: "4px", display: "block" },
  levelsSection: { background: theme.paper, padding: "82px 24px 90px", maxWidth: "1280px", margin: "0 auto" },
  levelsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(235px, 1fr))", gap: "18px", marginBottom: "38px" },
  levelCard: { padding: "24px", borderRadius: "18px", border: "1px solid", background: theme.card, textAlign: "left", cursor: "pointer", transition: "border-color 0.25s ease, box-shadow 0.25s ease", color: theme.ink },
  levelCardNumber: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", marginBottom: "25px" },
  levelBadge: { display: "inline-flex", alignItems: "center", padding: "5px 10px", borderRadius: "30px", fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" },
  levelName: { margin: "0 0 8px", fontSize: "22px", lineHeight: 1.12, fontWeight: 600 },
  levelSpan: { margin: "0 0 15px", color: theme.textMuted, fontSize: "13px", fontWeight: 600, lineHeight: 1.5 },
  levelAgePill: { display: "inline-block", padding: "6px 10px", borderRadius: "8px", fontSize: "11px", fontWeight: 700, marginBottom: "22px" },
  levelSelect: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", width: "100%", padding: "11px 14px", borderRadius: "11px", border: "1px solid", fontSize: "12px", fontWeight: 700, transition: "all 0.3s ease" },
  curriculumPanel: { background: theme.card, border: `1px solid ${theme.paperDeep}`, borderTop: "4px solid", borderRadius: "22px", padding: "34px", boxShadow: "0 12px 35px rgba(30,20,32,0.055)" },
  panelHeader: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "28px", paddingBottom: "26px", marginBottom: "26px", borderBottom: `1px solid ${theme.paperDeep}` },
  panelHeaderLeft: { maxWidth: "780px" },
  panelBadge: { display: "inline-block", padding: "6px 12px", border: "1px solid", borderRadius: "30px", fontSize: "10px", fontWeight: 700, letterSpacing: "0.11em", textTransform: "uppercase", marginBottom: "14px" },
  panelTitle: { margin: "0 0 10px", color: theme.ink, fontSize: "clamp(1.75rem, 3vw, 2.5rem)", lineHeight: 1.1, fontWeight: 600 },
  panelDescription: { margin: 0, color: theme.textMuted, fontSize: "14px", lineHeight: 1.75 },
  ageCard: { display: "flex", flexDirection: "column", gap: "5px", minWidth: "150px", padding: "14px 16px", border: "1px solid", borderRadius: "14px", background: theme.paper },
  classTabsContainer: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: "14px", padding: "13px 15px", marginBottom: "26px", border: `1px solid ${theme.paperDeep}`, borderRadius: "13px", background: theme.paper },
  classTabLabel: { color: theme.textMuted, fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" },
  classTabsGroup: { display: "flex", flexWrap: "wrap", gap: "8px" },
  classTabBtn: { padding: "8px 14px", border: "1px solid", borderRadius: "9px", fontSize: "12px", fontWeight: 700, cursor: "pointer", transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)" },
  curriculumGrid: { display: "grid", gap: "22px" },
  innerCard: { background: theme.paper, border: `1px solid ${theme.paperDeep}`, borderRadius: "17px", padding: "24px" },
  innerHeading: { display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "6px" },
  headingDot: { width: "7px", height: "7px", borderRadius: "50%", marginTop: "7px", flexShrink: 0 },
  headingEyebrow: { display: "block", color: theme.textMuted, fontSize: "9px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "4px" },
  innerTitle: { margin: 0, color: theme.ink, fontSize: "18px", lineHeight: 1.25, fontWeight: 800 },
  innerSubtext: { margin: "0 0 18px 19px", color: theme.textMuted, fontSize: "12px", fontWeight: 600 },
  subjectsList: { display: "flex", flexDirection: "column", gap: "8px" },
  subjectRow: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "14px", padding: "12px 13px", borderRadius: "10px", background: theme.card, border: `1px solid ${theme.paperDeep}`, transition: "all 0.3s ease" },
  subjectLeft: { display: "flex", alignItems: "center", gap: "10px", minWidth: 0 },
  subjectBullet: { width: "6px", height: "6px", borderRadius: "50%", flexShrink: 0 },
  subjectName: { color: theme.ink, fontSize: "13px", fontWeight: 700, lineHeight: 1.45 },
  subjectRight: { display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "10px", flexShrink: 0 },
  subjectType: { padding: "4px 8px", borderRadius: "7px", fontSize: "9px", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", whiteSpace: "nowrap" },
  subjectHours: { color: theme.textMuted, fontSize: "11px", fontWeight: 700, whiteSpace: "nowrap" },
  detailsColumn: { display: "flex", flexDirection: "column", gap: "22px" },
  highlightsList: { listStyle: "none", padding: 0, margin: "20px 0 0", display: "flex", flexDirection: "column", gap: "14px" },
  highlightItem: { display: "flex", alignItems: "flex-start", gap: "12px", color: theme.text, fontSize: "13px", lineHeight: 1.65 },
  highlightNumber: { fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", paddingTop: "2px", flexShrink: 0 },
  assessmentCard: { padding: "21px 22px", background: theme.paper, border: `1px solid ${theme.paperDeep}`, borderLeft: "3px solid", borderRadius: "13px" },
  assessmentText: { margin: "8px 0 0", color: theme.rose, fontSize: "13px", fontWeight: 700, lineHeight: 1.65 },
  strengthsSection: { background: theme.paper, padding: "76px 24px 88px" },
  sectionContainer: { maxWidth: "1180px", margin: "0 auto" },
  strengthsGrid: { display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "22px", marginTop: "44px" },
  strengthCard: { position: "relative", minHeight: "230px", padding: "34px 28px 32px", overflow: "hidden", background: theme.card, border: `1px solid ${theme.paperDeep}`, borderRadius: "24px", boxShadow: "0 12px 30px rgba(30,20,32,0.055)", transition: "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)" },
  strengthContent: { position: "relative", zIndex: 2, maxWidth: "390px" },
  strengthTitle: { margin: "40px 0 12px", color: theme.ink, fontSize: "21px", lineHeight: 1.15, fontWeight: 600 },
  strengthDescription: { margin: 0, color: theme.textMuted, fontSize: "13.5px", lineHeight: 1.75, maxWidth: "370px" },
  cardLine: { position: "absolute", left: "28px", bottom: "22px", width: "40px", height: "3px", borderRadius: "4px", transition: "all 0.5s cubic-bezier(0.22, 1, 0.36, 1)" },
  achievementsSection: { background: theme.paper, padding: "84px 24px 90px" },
  achievementsGrid: { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "24px", marginTop: "10px" },
  achievementCard: { position: "relative", padding: "32px 28px 28px", background: theme.card, border: `1px solid ${theme.paperDeep}`, borderRadius: "20px", boxShadow: "0 12px 30px rgba(30,20,32,0.055)", display: "flex", flexDirection: "column", minHeight: "180px", transition: "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)" },
  achievementNumber: { color: theme.gold, fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", marginBottom: "12px" },
  achievementContent: { flex: 1, display: "flex", flexDirection: "column" },
  achievementTitle: { margin: "0 0 10px", color: theme.ink, fontSize: "20px", lineHeight: 1.2, fontWeight: 600 },
  achievementDescription: { margin: 0, color: theme.textMuted, fontSize: "14px", lineHeight: 1.7, maxWidth: "100%" },
  achievementLine: { position: "absolute", left: "28px", bottom: "0", width: "40px", height: "3px", borderRadius: "4px", background: theme.gold, opacity: 0.3 },
  assessmentSection: { background: theme.paperDeep, padding: "84px 24px 90px", borderTop: `1px solid ${theme.paperDeep}` },
  assessmentContent: { display: "grid", gridTemplateColumns: "minmax(0, 0.9fr) minmax(320px, 1.1fr)", gap: "60px", alignItems: "start" },
  assessmentTitle: { margin: "18px 0 13px", color: theme.ink, fontSize: "clamp(2rem, 4vw, 3.2rem)", lineHeight: 1.04, fontWeight: 600, letterSpacing: "-0.03em" },
  assessmentDescription: { maxWidth: "500px", margin: 0, color: theme.textMuted, fontSize: "15px", lineHeight: 1.75 },
  assessmentMethods: { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", borderTop: `1px solid rgba(30,20,32,0.14)` },
  assessmentMethod: { display: "flex", alignItems: "flex-start", gap: "13px", padding: "17px 14px", borderBottom: `1px solid rgba(30,20,32,0.14)`, color: theme.text, fontSize: "13px", fontWeight: 600, lineHeight: 1.5, transition: "all 0.3s ease" },
};

export default AcademicsPage;