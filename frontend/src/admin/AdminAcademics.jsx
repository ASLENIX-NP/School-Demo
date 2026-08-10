import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Eye,
  Save,
  X,
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  BookOpen,
  Award,
  Sparkles,
  CheckCircle2 as CheckCircle2Icon,
  Brain,
  Lightbulb,
  GraduationCap,
  Layout,
  FlaskConical,
  Globe,
  Heart,
  Target,
  Trophy,
  Zap,
  Shield,
  Clock,
  ChevronRight,
  ChevronDown,
  Layers,
} from "lucide-react";

// ─── Small helpers ───
function withAlpha(hex, alpha) {
  if (!hex) return `rgba(26,82,118,${alpha})`;
  const h = hex.replace("#", "");
  const bigint = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function slugify(str) {
  return (str || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function uniqueId(prefix, existingIds = []) {
  let base = slugify(prefix) || "item";
  let id = base;
  let n = 1;
  while (existingIds.includes(id)) {
    id = `${base}-${n}`;
    n += 1;
  }
  return id;
}

function deepClone(obj) {
  return typeof structuredClone === "function"
    ? structuredClone(obj)
    : JSON.parse(JSON.stringify(obj));
}

// Icons are React components and cannot be persisted to the database.
// Map level id -> icon here, with a safe fallback for newly created levels.
const LEVEL_ICON_MAP = {
  "pre-primary": Brain,
  primary: BookOpen,
  middle: Lightbulb,
  high: GraduationCap,
};
function getLevelIcon(levelId) {
  return LEVEL_ICON_MAP[levelId] || Layers;
}

// ─── Admin Editing Helpers ───
function Field({ label, value, onChange, placeholder = "", textarea = false, type = "text", rows = 4 }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-slate-300">{label}</label>
      {textarea ? (
        <textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="w-full px-4 py-3 rounded-xl outline-none text-sm resize-none transition-all focus:ring-2"
          style={{ background: "rgba(30, 41, 59, 0.8)", border: "1px solid rgba(255,255,255,0.08)", color: "#F8FAFC" }}
        />
      ) : (
        <input
          type={type}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 rounded-xl outline-none text-sm transition-all focus:ring-2"
          style={{ background: "rgba(30, 41, 59, 0.8)", border: "1px solid rgba(255,255,255,0.08)", color: "#F8FAFC" }}
        />
      )}
    </div>
  );
}

function ModalShell({ title, onClose, children, onSave, saving, saveLabel = "Save" }) {
  if (!onSave) return null;
  return (
    <motion.div className="fixed inset-0 z-[9999] flex items-center justify-center p-5" style={{ background: "rgba(2,6,23,0.7)", backdropFilter: "blur(14px)" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div initial={{ opacity: 0, y: 24, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 14, scale: 0.96 }} className="w-full max-w-2xl rounded-[30px] overflow-hidden max-h-[85vh] flex flex-col" style={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 42px 110px rgba(0,0,0,0.5)" }} onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-white/10 flex justify-between shrink-0">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <button onClick={onClose} disabled={saving} className="text-white/60 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 overflow-y-auto">{children}</div>
        <div className="p-6 border-t border-white/10 flex gap-3 shrink-0">
          <button onClick={onClose} disabled={saving} className="flex-1 py-3 rounded-xl text-sm font-bold bg-white/5 text-white/70 hover:text-white disabled:opacity-60">Cancel</button>
          <button onClick={onSave} disabled={saving} className="flex-1 py-3 rounded-xl text-sm font-bold bg-blue-600 text-white disabled:opacity-60 flex justify-center gap-2 items-center">
            <Save className="w-4 h-4" /> {saving ? "Saving..." : saveLabel}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function EditableWrap({ editMode, target, onEditTarget, onDeleteTarget, canDelete = false, children }) {
  if (!editMode) return children;
  return (
    <div className="relative group cursor-pointer">
      {children}
      <div className="absolute -top-2 -right-2 z-40 opacity-0 group-hover:opacity-100 transition-all duration-200 flex gap-1.5">
        <button onClick={(e) => { e.stopPropagation(); onEditTarget(target); }} className="p-1.5 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700">
          <Pencil className="w-3.5 h-3.5" />
        </button>
        {canDelete && (
          <button onClick={(e) => { e.stopPropagation(); onDeleteTarget(target); }} className="p-1.5 rounded-full bg-red-600 text-white shadow-lg hover:bg-red-700">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

// A small standalone "Add" button used outside of EditableWrap (not tied to an existing item)
function AddButton({ editMode, label, onClick }) {
  if (!editMode) return null;
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold border-2 border-dashed transition-all hover:bg-blue-50"
      style={{ borderColor: "#1A5276", color: "#1A5276" }}
    >
      <Plus size={16} /> {label}
    </button>
  );
}

// ─── THE ACTUAL ACADEMICS PAGE (Embedded directly to fix import errors) ───
const theme = {
  primary: "#1A5276", secondary: "#1E8449", accent1: "#D4AC0D", accent2: "#E67E22",
  accent3: "#7D3C98", accent4: "#2E86C1", light: "#F8F6F0", dark: "#0A1628", gray: "#5D6D7E",
  white: "#FFFFFF",
};

// This is now only a SEED / FALLBACK. Once the backend has saved `classLevels`,
// the live page reads exclusively from the saved database content — never from
// this constant. It exists so a brand-new site has sensible starting content.
const classLevelsData = [
  {
    id: "pre-primary", name: "Pre-Primary / Early Years", shortBadge: "Early Childhood", span: "Play Group, Nursery, LKG, UKG", ageGroup: "3 – 5.5 Years", color: "#D4AC0D",
    tagline: "Foundation of Curiosity, Play-Based Learning", description: "Our early childhood program nurtures young minds through playful exploration, phonics, storytelling, and creative arts.",
    classes: [
      {
        id: "pg-nursery", name: "Play Group & Nursery", focus: "Sensory, Language Readiness & Social Interaction",
        subjects: [{ name: "Phonics & Rhymes", type: "Core", hours: "5 hrs/wk" }, { name: "Picture Reading & Storytelling", type: "Core", hours: "4 hrs/wk" }, { name: "Number Games & Counting", type: "Core", hours: "4 hrs/wk" }, { name: "Creative Arts & Craft", type: "Activity", hours: "5 hrs/wk" }, { name: "Play & Motor Skills", type: "Activity", hours: "4 hrs/wk" }],
        curriculumHighlights: ["Montessori-inspired tactile learning corners", "Daily storytelling sessions in English & Nepali", "Zero exam pressure", "Color & pattern recognition"],
        assessmentMethod: "Continuous Activity Milestone Logs"
      },
      {
        id: "lkg-ukg", name: "LKG & UKG", focus: "Early Literacy, Numeracy & Environmental Awareness",
        subjects: [{ name: "English Reading & Writing", type: "Core", hours: "6 hrs/wk" }, { name: "Nepali Barnamala & Words", type: "Core", hours: "5 hrs/wk" }, { name: "Elementary Mathematics", type: "Core", hours: "5 hrs/wk" }, { name: "General Knowledge & Nature", type: "Core", hours: "3 hrs/wk" }, { name: "Drawing, Color & Music", type: "Activity", hours: "4 hrs/wk" }],
        curriculumHighlights: ["Phonics-based English reading", "Nepali alphabet recognition", "Basic addition & subtraction", "Group & team building activities"],
        assessmentMethod: "Playful Classroom Assessments & Progress Certificates"
      },
    ],
  },
  {
    id: "primary", name: "Primary Level", shortBadge: "Grades 1 – 5", span: "Class 1 to Class 5", ageGroup: "6 – 10 Years", color: "#1E8449",
    tagline: "Core Academic Fundamentals & STEAM", description: "Building strong intellectual foundations in languages, mathematics, and science alongside computer literacy.",
    classes: [
      {
        id: "grade-1-3", name: "Grade 1 – 3 (Lower Primary)", focus: "Foundational Literacy, Numeracy & Scientific Inquiry",
        subjects: [{ name: "English Grammar & Reader", type: "Compulsory", hours: "6 hrs/wk" }, { name: "Nepali Bhasa & Vyakaran", type: "Compulsory", hours: "6 hrs/wk" }, { name: "Mathematics & Reasoning", type: "Compulsory", hours: "6 hrs/wk" }, { name: "Our Surroundings (Science & Social)", type: "Compulsory", hours: "5 hrs/wk" }, { name: "Computer Literacy & Drawing", type: "Practical", hours: "3 hrs/wk" }],
        curriculumHighlights: ["Aligned with CDC Primary Curriculum", "Equal mastery in English and Nepali", "Hands-on science experiments", "Continuous Assessment System (CAS)"],
        assessmentMethod: "40% CAS + 60% Terminal Examinations"
      },
      {
        id: "grade-4-5", name: "Grade 4 – 5 (Upper Primary)", focus: "Analytical Reasoning, Science Exploration & Digital Basics",
        subjects: [{ name: "English Language & Literature", type: "Compulsory", hours: "6 hrs/wk" }, { name: "Nepali Bhasa & Vyakaran", type: "Compulsory", hours: "6 hrs/wk" }, { name: "Mathematics & Geometry", type: "Compulsory", hours: "6 hrs/wk" }, { name: "General Science & Environment", type: "Compulsory", hours: "5 hrs/wk" }, { name: "Social Studies & Local Culture", type: "Compulsory", hours: "4 hrs/wk" }, { name: "Computer Science & ICT Lab", type: "Practical", hours: "3 hrs/wk" }],
        curriculumHighlights: ["Structured problem-solving in Arithmetic & Geometry", "Introductory computer lab sessions", "Project work & chart presentations", "Inter-house competitions"],
        assessmentMethod: "30% Practical/Project Work + 70% Terminal Examinations"
      },
    ],
  },
  {
    id: "middle", name: "Middle Level (Lower Secondary)", shortBadge: "Grades 6 – 8", span: "Class 6 to Class 8", ageGroup: "11 – 13 Years", color: "#7D3C98",
    tagline: "Critical Thinking, Laboratory Science & BLE Prep", description: "Empowering students to think analytically, conduct laboratory experiments, and build digital applications.",
    classes: [
      {
        id: "grade-6-8", name: "Grade 6 – 8 (Class 6, 7 & 8)", focus: "Conceptual Mastery, Practical Science & BLE Board Readiness",
        subjects: [{ name: "English Language & Composition", type: "Compulsory", hours: "6 hrs/wk" }, { name: "Nepali Bhasa & Sahitya", type: "Compulsory", hours: "6 hrs/wk" }, { name: "Compulsory Mathematics", type: "Compulsory", hours: "6 hrs/wk" }, { name: "Science & Technology", type: "Lab & Theory", hours: "6 hrs/wk" }, { name: "Social Studies & Population", type: "Compulsory", hours: "5 hrs/wk" }, { name: "Health, Physical & Creative Arts", type: "Practical", hours: "3 hrs/wk" }, { name: "Computer Science & Coding", type: "Lab", hours: "3 hrs/wk" }],
        curriculumHighlights: ["Physics, Chemistry, and Biology lab experiments", "Basic computer programming", "Grade 8 BLE district-level model test prep", "Science quizzes and debates"],
        assessmentMethod: "Grade 8 BLE: 25% Practical/Internal + 75% Written Examinations"
      },
    ],
  },
  {
    id: "high", name: "High / Secondary Level", shortBadge: "Grades 9 – 10 (SEE)", span: "Class 9 & Class 10", ageGroup: "14 – 16 Years", color: "#2E86C1",
    tagline: "SEE Exam Excellence, Electives & Career Guidance", description: "Intensive academic preparation for the SEE examination with specialized electives and science labs.",
    classes: [
      {
        id: "grade-9-10", name: "Grade 9 & Grade 10 (SEE Stream)", focus: "SEE Board Examination Mastery",
        subjects: [{ name: "Compulsory English", type: "Board Subject", hours: "6 hrs/wk" }, { name: "Compulsory Nepali", type: "Board Subject", hours: "6 hrs/wk" }, { name: "Compulsory Mathematics", type: "Board Subject", hours: "6 hrs/wk" }, { name: "Science & Technology (Phys, Chem, Bio)", type: "Lab & Board", hours: "6 hrs/wk" }, { name: "Social Studies", type: "Board Subject", hours: "5 hrs/wk" }, { name: "Optional Math / Economics", type: "Elective", hours: "5 hrs/wk" }, { name: "Accountancy / Computer Science", type: "Elective Lab", hours: "4 hrs/wk" }],
        curriculumHighlights: ["Rigorous SEE curriculum aligned with NEB", "Weekly SEE model examination series", "Dedicated practical sessions for Science & Computer Science", "Career counseling"],
        assessmentMethod: "NEB SEE: 25% Internal Practical + 75% Final SEE Examination"
      },
    ],
  },
];

function AcademicsPage({
  adminEditMode = false,
  contentOverride = null,
  onEditTarget = () => {},
  onDeleteTarget = () => {},
  onAddLevel = () => {},
  onAddClass = () => {},
  onAddStrength = () => {},
  onAddAchievement = () => {},
}) {
  const data = contentOverride || defaultAcademicsContent;
  const levels = Array.isArray(data.classLevels) && data.classLevels.length ? data.classLevels : classLevelsData;

  const [activeLevelId, setActiveLevelId] = useState(levels[1]?.id || levels[0]?.id);
  const [activeClassIndex, setActiveClassIndex] = useState(0);

  // Keep the selected level valid if content changes underneath us (e.g. after a save/delete)
  useEffect(() => {
    if (!levels.find((lvl) => lvl.id === activeLevelId)) {
      setActiveLevelId(levels[0]?.id);
      setActiveClassIndex(0);
    }
  }, [levels, activeLevelId]);

  const activeLevel = levels.find((lvl) => lvl.id === activeLevelId) || levels[0];
  const activeClass = activeLevel?.classes?.[activeClassIndex] || activeLevel?.classes?.[0];

  const handleSelectLevel = (levelId) => { setActiveLevelId(levelId); setActiveClassIndex(0); };

  if (!activeLevel || !activeClass) {
    return (
      <div className="min-h-screen bg-[#F8F6F0] flex items-center justify-center p-10">
        {adminEditMode ? (
          <AddButton editMode={adminEditMode} label="Add the first Class Level" onClick={onAddLevel} />
        ) : (
          <p className="text-[#5D6D7E]">Academic content coming soon.</p>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F6F0] overflow-x-hidden">
      {/* Hero */}
      <section className="relative pt-[80px] min-h-[85vh] flex items-center overflow-hidden" style={{ background: "linear-gradient(135deg, #0A1628 0%, #1A5276 50%, #0A1628 100%)" }}>
        <div className="relative w-full max-w-[1200px] mx-auto px-6 z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-[700px]">
            <EditableWrap editMode={adminEditMode} target={{ type: "hero" }} onEditTarget={onEditTarget}>
              <div className="inline-block px-5 py-1.5 rounded-full text-sm font-bold uppercase tracking-widest bg-[rgba(212,172,13,0.15)] text-[#D4AC0D] border border-[rgba(212,172,13,0.3)] mb-6">
                {data.hero.badge}
              </div>
              <h1 className="text-[clamp(2.8rem,6vw,4.5rem)] font-extrabold leading-[1.05] text-white mb-5">
                <span className="font-normal opacity-85">Empowering Minds</span><br />
                <span className="bg-gradient-to-r from-[#D4AC0D] to-[#E67E22] bg-clip-text text-transparent">Shaping Futures</span>
              </h1>
              <p className="text-[clamp(1.1rem,1.8vw,1.4rem)] text-white/90 font-medium mb-4">{data.hero.subtitle}</p>
              <p className="text-[clamp(0.95rem,1.2vw,1.1rem)] text-white/70 leading-relaxed max-w-[560px]">{data.hero.description}</p>
            </EditableWrap>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 px-6 bg-white">
        <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-5">
          {data.stats.map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: i * 0.1 }} className="relative p-7 rounded-2xl text-center bg-[#F8F6F0] border border-black/5" style={{ borderTop: `3px solid ${stat.color || theme.accent1}` }}>
              <EditableWrap editMode={adminEditMode} target={{ type: "stat", index: i }} onEditTarget={onEditTarget}>
                <div className="text-[clamp(2.2rem,4vw,3rem)] font-extrabold tracking-tight mb-1" style={{ color: stat.color || theme.accent1 }}>
                  <Counter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm font-semibold text-[#5D6D7E]">{stat.label}</div>
              </EditableWrap>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Levels */}
      <section className="py-20 px-6 bg-white max-w-[1240px] mx-auto">
        <EditableWrap editMode={adminEditMode} target={{ type: "levelsHeading" }} onEditTarget={onEditTarget}>
          <div className="text-center max-w-[700px] mx-auto mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[rgba(26,82,118,0.08)] text-[#1A5276] mb-4">Academic Structure</span>
            <h2 className="text-[clamp(2rem,3.5vw,2.8rem)] font-extrabold text-[#1C2833] mb-3">Explore Our <span className="text-[#D4AC0D]">Class Levels</span></h2>
            <p className="text-[#5D6D7E] leading-relaxed">Click on any academic level below to view the classes, subjects, curriculum, and grading structure.</p>
            <div className="w-[60px] h-1 mx-auto mt-5 rounded-full bg-gradient-to-r from-[#D4AC0D] to-[#E67E22]" />
          </div>
        </EditableWrap>

        {/* All 4+ Class Cards are fully editable and driven by saved data */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
          {levels.map((level, index) => {
            const Icon = getLevelIcon(level.id);
            const isActive = level.id === activeLevelId;
            return (
              <EditableWrap key={level.id} editMode={adminEditMode} target={{ type: "levelCard", index }} onEditTarget={onEditTarget} canDelete={true} onDeleteTarget={onDeleteTarget}>
                <motion.button onClick={() => handleSelectLevel(level.id)} whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }} className="w-full p-6 rounded-2xl text-left flex flex-col justify-between transition-all" style={{ borderColor: isActive ? level.color : "transparent", border: `2px solid ${isActive ? level.color : "transparent"}`, background: isActive ? "#FFFFFF" : withAlpha(level.color, 0.06), boxShadow: isActive ? "0 12px 30px rgba(0,0,0,0.08)" : "none" }}>
                  <div className="flex justify-between items-center p-3 rounded-xl mb-4" style={{ background: withAlpha(level.color, 0.12) }}>
                    <Icon size={26} color={level.color} />
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white uppercase tracking-wider" style={{ color: level.color }}>{level.shortBadge}</span>
                  </div>
                  <h3 className="text-[19px] font-extrabold mb-1" style={{ color: isActive ? level.color : theme.dark }}>{level.name}</h3>
                  <p className="text-[13px] font-semibold text-[#5D6D7E] mb-3">{level.span}</p>
                  <div className="text-[12px] font-semibold bg-black/5 px-3 py-1.5 rounded-lg inline-block w-fit mb-5 text-[#1C2833]">Age: {level.ageGroup}</div>
                  <div className={`flex justify-between items-center px-4 py-2.5 rounded-xl text-[13px] font-bold transition-all ${isActive ? "text-white" : "text-[#5D6D7E]"}`} style={{ background: isActive ? level.color : "transparent", border: `1px solid ${isActive ? level.color : "rgba(0,0,0,0.1)"}` }}>
                    <span>{isActive ? "Viewing Curriculum" : "Click to Explore"}</span>
                    {isActive ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </div>
                </motion.button>
              </EditableWrap>
            );
          })}
        </div>

        <div className="flex justify-center mb-10">
          <AddButton editMode={adminEditMode} label="Add Class Level" onClick={onAddLevel} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeLevel.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="bg-white/85 backdrop-blur-md rounded-3xl p-8 shadow-lg border border-black/5" style={{ borderTop: `4px solid ${activeLevel.color}` }}>

            <EditableWrap editMode={adminEditMode} target={{ type: "curriculumPanel", levelId: activeLevel.id }} onEditTarget={onEditTarget}>
              <div className="flex flex-wrap justify-between gap-6 pb-6 border-b border-black/5 mb-6">
                <div className="max-w-[750px]">
                  <span className="inline-block text-[12px] font-extrabold uppercase tracking-wider px-4 py-1.5 rounded-full mb-3" style={{ background: withAlpha(activeLevel.color, 0.1), color: activeLevel.color, border: `1px solid ${withAlpha(activeLevel.color, 0.25)}` }}>{activeLevel.name} • {activeLevel.span}</span>
                  <h3 className="text-[26px] font-black text-[#0A1628] mb-2">{activeLevel.tagline}</h3>
                  <p className="text-[15px] text-[#5D6D7E] leading-relaxed">{activeLevel.description}</p>
                </div>
                <div className="flex items-center p-3 rounded-2xl bg-white border border-black/5 shadow-sm gap-3">
                  <Clock size={18} color={activeLevel.color} />
                  <div><div className="text-[11px] font-bold uppercase tracking-wider text-[#5D6D7E]">Target Age</div><div className="text-[15px] font-bold text-[#0A1628]">{activeLevel.ageGroup}</div></div>
                </div>
              </div>
            </EditableWrap>

            <div className="flex flex-wrap items-center gap-4 p-4 rounded-2xl bg-black/5 border border-black/5 mb-6">
              <span className="text-[13px] font-bold text-[#5D6D7E] uppercase tracking-wider">Select Class:</span>
              <div className="flex flex-wrap gap-2 items-center">
                {activeLevel.classes.map((cls, idx) => (
                  <EditableWrap key={cls.id} editMode={adminEditMode} target={{ type: "className", levelId: activeLevel.id, classId: cls.id }} onEditTarget={onEditTarget} canDelete={activeLevel.classes.length > 1} onDeleteTarget={onDeleteTarget}>
                    <button onClick={() => setActiveClassIndex(idx)} className="px-4 py-2 rounded-xl text-[13px] font-bold transition-all shadow-sm" style={{ background: activeClassIndex === idx ? activeLevel.color : "#FFFFFF", color: activeClassIndex === idx ? "#FFFFFF" : "#0A1628", border: `1px solid ${activeClassIndex === idx ? activeLevel.color : "rgba(0,0,0,0.1)"}` }}>{cls.name}</button>
                  </EditableWrap>
                ))}
                <AddButton editMode={adminEditMode} label="Add Class" onClick={() => onAddClass(activeLevel.id)} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-7">

              <EditableWrap editMode={adminEditMode} target={{ type: "subjectBreakdown", levelId: activeLevel.id, classId: activeClass.id }} onEditTarget={onEditTarget}>
                <div className="bg-white p-6 rounded-2xl border border-black/5">
                  <div className="flex items-center gap-3 mb-5"><BookOpen size={20} color={activeLevel.color} /><h4 className="text-[17px] font-extrabold text-[#0A1628]">Subject Breakdown ({activeClass.name})</h4></div>
                  <div className="flex flex-col gap-3">
                    {activeClass.subjects.map((sub, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-black/5 border border-black/5">
                        <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full" style={{ background: activeLevel.color }} /><span className="text-[14px] font-bold text-[#1C2833]">{sub.name}</span></div>
                        <div className="flex items-center gap-2"><span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-xl" style={{ background: sub.type === "Compulsory" || sub.type === "Core" || sub.type === "Board Subject" ? "rgba(26,82,118,0.08)" : "rgba(30,132,73,0.08)", color: sub.type === "Compulsory" || sub.type === "Core" || sub.type === "Board Subject" ? theme.primary : theme.secondary }}>{sub.type}</span><span className="text-[12px] font-semibold text-[#5D6D7E]">{sub.hours}</span></div>
                      </div>
                    ))}
                  </div>
                </div>
              </EditableWrap>

              <EditableWrap editMode={adminEditMode} target={{ type: "highlightsAndAssessment", levelId: activeLevel.id, classId: activeClass.id }} onEditTarget={onEditTarget}>
                <div className="flex flex-col gap-6">
                  <div className="bg-white p-6 rounded-2xl border border-black/5">
                    <div className="flex items-center gap-3 mb-4"><Sparkles size={20} color={activeLevel.color} /><h4 className="text-[17px] font-extrabold text-[#0A1628]">Learning Highlights</h4></div>
                    <ul className="flex flex-col gap-3">
                      {activeClass.curriculumHighlights.map((hl, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-[14px] font-semibold text-[#2C3E50] leading-relaxed"><CheckCircle2Icon size={16} color={activeLevel.color} className="shrink-0 mt-1" /><span>{hl}</span></li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-black/5">
                    <div className="flex items-center gap-3 mb-3"><Award size={20} color={activeLevel.color} /><h4 className="text-[17px] font-extrabold text-[#0A1628]">Assessment Pattern</h4></div>
                    <p className="text-[14px] font-bold text-[#1A5276] bg-[rgba(26,82,118,0.06)] p-4 rounded-xl border border-[rgba(26,82,118,0.12)] leading-relaxed">{activeClass.assessmentMethod}</p>
                  </div>
                </div>
              </EditableWrap>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* Strengths */}
      <section className="py-20 px-6 bg-[#F8F6F0]">
        <EditableWrap editMode={adminEditMode} target={{ type: "strengthsHeading" }} onEditTarget={onEditTarget}>
          <div className="max-w-[1200px] mx-auto text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[rgba(26,82,118,0.08)] text-[#1A5276] mb-4">What Sets Us Apart</span>
            <h2 className="text-[clamp(2rem,3.5vw,2.8rem)] font-extrabold text-[#1C2833] mb-3">Our <span className="text-[#D4AC0D]">Academic Strengths</span></h2>
            <p className="text-[#5D6D7E] leading-relaxed max-w-[600px] mx-auto">A learning ecosystem built on innovation, expertise, and unwavering commitment to student success.</p>
            <div className="w-[60px] h-1 mx-auto mt-5 rounded-full bg-gradient-to-r from-[#D4AC0D] to-[#E67E22]" />
          </div>
        </EditableWrap>
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.strengths.map((item, i) => {
            const Icon = item.icon === "Layout" ? Layout : item.icon === "FlaskConical" ? FlaskConical : item.icon === "Globe" ? Globe : item.icon === "Sparkles" ? Sparkles : item.icon === "Heart" ? Heart : Target;
            return (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: i * 0.06 }} className="p-7 rounded-2xl border border-black/5" style={{ background: withAlpha(item.color || theme.primary, 0.06) }}>
                <EditableWrap editMode={adminEditMode} target={{ type: "strength", index: i }} onEditTarget={onEditTarget} canDelete={data.strengths.length > 1} onDeleteTarget={onDeleteTarget}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: `${item.color || theme.primary}18` }}><Icon size={24} color={item.color || theme.primary} /></div>
                  <h4 className="text-[18px] font-bold text-[#1C2833] mb-2">{item.title}</h4>
                  <p className="text-[14px] text-[#5D6D7E] leading-relaxed">{item.description}</p>
                </EditableWrap>
              </motion.div>
            );
          })}
        </div>
        <div className="max-w-[1200px] mx-auto mt-8 flex justify-center">
          <AddButton editMode={adminEditMode} label="Add Academic Strength" onClick={onAddStrength} />
        </div>
      </section>

      {/* Achievements */}
      <section className="py-20 px-6 bg-white">
        <EditableWrap editMode={adminEditMode} target={{ type: "achievementsHeading" }} onEditTarget={onEditTarget}>
          <div className="max-w-[1200px] mx-auto text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[rgba(212,172,13,0.1)] text-[#D4AC0D] mb-4">Our Milestones</span>
            <h2 className="text-[clamp(2rem,3.5vw,2.8rem)] font-extrabold text-[#1C2833] mb-3">Celebrating <span className="text-[#D4AC0D]">Excellence</span></h2>
            <p className="text-[#5D6D7E] leading-relaxed max-w-[600px] mx-auto">A legacy of achievement that reflects our commitment to quality education.</p>
            <div className="w-[60px] h-1 mx-auto mt-5 rounded-full bg-gradient-to-r from-[#D4AC0D] to-[#E67E22]" />
          </div>
        </EditableWrap>
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
          {data.achievements.map((item, i) => {
            const Icon = i === 0 ? Trophy : i === 1 ? Zap : i === 2 ? Shield : Globe;
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.08 }} className="p-8 rounded-3xl text-center border border-black/5" style={{ background: withAlpha(theme.primary, 0.05) }}>
                <EditableWrap editMode={adminEditMode} target={{ type: "achievement", index: i }} onEditTarget={onEditTarget} canDelete={data.achievements.length > 1} onDeleteTarget={onDeleteTarget}>
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-5 shadow-lg" style={{ background: theme.accent1, boxShadow: "0 8px 20px rgba(212,172,13,0.3)" }}><Icon size={24} color={theme.white} /></div>
                  <h4 className="text-[18px] font-bold text-[#1C2833] mb-2">{item.title}</h4>
                  <p className="text-[14px] text-[#5D6D7E] leading-relaxed">{item.description}</p>
                </EditableWrap>
              </motion.div>
            );
          })}
        </div>
        <div className="max-w-[1200px] mx-auto mt-8 flex justify-center">
          <AddButton editMode={adminEditMode} label="Add Achievement" onClick={onAddAchievement} />
        </div>
      </section>

      {/* Assessment */}
      <section className="py-20 px-6" style={{ background: "linear-gradient(135deg, #0A1628 0%, #1A5276 100%)" }}>
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <EditableWrap editMode={adminEditMode} target={{ type: "assessment" }} onEditTarget={onEditTarget}>
              <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[rgba(212,172,13,0.15)] text-[#D4AC0D] border border-[rgba(212,172,13,0.3)] mb-4">Assessment & Growth</span>
              <h2 className="text-[clamp(2rem,3.5vw,2.8rem)] font-extrabold text-white mb-4">{data.assessment.title}</h2>
              <p className="text-[16px] text-white/75 leading-relaxed">{data.assessment.description}</p>
            </EditableWrap>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.assessment.methods.map((m, i) => (
              <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-white/10 border border-white/20"><CheckCircle2Icon size={18} color={theme.accent1} /><span className="text-[14px] font-semibold text-white">{m}</span></div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function Counter({ target, suffix, duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  useEffect(() => {
    if (!isInView) return;
    let start = 0; const end = parseInt(target) || 0; const increment = end / (duration / 16);
    const timer = setInterval(() => { start += increment; if (start >= end) { setCount(end); clearInterval(timer); } else { setCount(Math.floor(start)); } }, 16);
    return () => clearInterval(timer);
  }, [isInView, target, duration]);
  return <span ref={ref}>{count}{suffix}</span>;
}

// ── DEFAULT DATA ──
const defaultAcademicsContent = {
  hero: { badge: "Excellence in Education", title: "Empowering Minds Shaping Futures", subtitle: "Nurturing the next generation of thinkers.", description: "At Smriti Secondary English Boarding School, education extends beyond textbooks." },
  levelsHeading: {
    badge: "Academic Structure",
    title: "Explore Our Class Levels",
    description: "Click on any academic level below to view the classes, subjects, curriculum, and grading structure.",
  },
  strengthsHeading: {
    badge: "What Sets Us Apart",
    title: "Our Academic Strengths",
    description: "A learning ecosystem built on innovation, expertise, and unwavering commitment to student success.",
  },
  achievementsHeading: {
    badge: "Our Milestones",
    title: "Celebrating Excellence",
    description: "A legacy of achievement that reflects our commitment to quality education.",
  },
  stats: [
    { value: "1500", suffix: "+", label: "Active Learners", color: "#D4AC0D" },
    { value: "85", suffix: "+", label: "Dedicated Educators", color: "#E67E22" },
    { value: "35", suffix: "+", label: "Years of Impact", color: "#1E8449" },
    { value: "100", suffix: "%", label: "SEE Pass Rate", color: "#1A5276" },
  ],
  strengths: [
    { id: 1, title: "Innovation Hub", description: "State-of-the-art learning spaces with interactive technology.", color: "#1A5276" },
    { id: 2, title: "STEM Excellence", description: "Robust science, technology, and engineering programs.", color: "#1E8449" },
    { id: 3, title: "Global Perspective", description: "Integrated curriculum emphasizing critical thinking.", color: "#D4AC0D" },
    { id: 4, title: "Arts & Expression", description: "Comprehensive arts education nurturing creativity.", color: "#E67E22" },
    { id: 5, title: "Character Development", description: "Values-based education cultivating integrity.", color: "#7D3C98" },
    { id: 6, title: "Future Ready", description: "Career and college counseling with mentorship.", color: "#2E86C1" },
  ],
  achievements: [
    { id: 1, title: "Academic Excellence Awards", description: "Consistent top-tier SEE performance." },
    { id: 2, title: "Science & STEM Showcase", description: "Student science exhibition projects." },
    { id: 3, title: "Community & Service", description: "Student-led service initiatives." },
    { id: 4, title: "Co-Curricular Triumphs", description: "Championship trophies in inter-school football." },
  ],
  assessment: { title: "Holistic Assessment Framework", description: "Our evaluation system celebrates growth through multiple dimensions.", methods: ["Continuous Assessment System (CAS)", "Laboratory Practical Examinations", "Project-Based & Group Presentations", "Periodic Diagnostic Unit Tests", "Terminal Examinations & SEE Model Series", "Co-curricular & Moral Progress Logs"] },
  classLevels: deepClone(classLevelsData),
};

function mergeAcademicsContent(saved = {}) {
  return {
    ...defaultAcademicsContent,
    ...(saved || {}),
    hero: { ...defaultAcademicsContent.hero, ...(saved?.hero || {}) },
    levelsHeading: { ...defaultAcademicsContent.levelsHeading, ...(saved?.levelsHeading || {}) },
    strengthsHeading: { ...defaultAcademicsContent.strengthsHeading, ...(saved?.strengthsHeading || {}) },
    achievementsHeading: { ...defaultAcademicsContent.achievementsHeading, ...(saved?.achievementsHeading || {}) },
    stats: Array.isArray(saved?.stats) && saved.stats.length ? saved.stats : defaultAcademicsContent.stats,
    strengths: Array.isArray(saved?.strengths) && saved.strengths.length ? saved.strengths : defaultAcademicsContent.strengths,
    achievements: Array.isArray(saved?.achievements) && saved.achievements.length ? saved.achievements : defaultAcademicsContent.achievements,
    assessment: { ...defaultAcademicsContent.assessment, ...(saved?.assessment || {}) },
    classLevels: Array.isArray(saved?.classLevels) && saved.classLevels.length ? saved.classLevels : deepClone(classLevelsData),
  };
}

function getAuthHeaders() {
  const token = localStorage.getItem("adminToken");
  return token ? { Authorization: `Bearer ${token}` } : null;
}

// ─── ADMIN DASHBOARD ENTRY ───
export default function AdminAcademics() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [form, setForm] = useState(defaultAcademicsContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [editingTarget, setEditingTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [modalForm, setModalForm] = useState({});

  // ── Load Data ──
  useEffect(() => {
    const loadContent = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/site-content/academics`, { timeout: 12000 });
        const savedContent = res.data?.data?.content || {};
        setForm(mergeAcademicsContent(savedContent));
      } catch (err) {
        console.error("Load academics content error:", err);
        setError("Could not load saved content. Default content shown.");
      } finally { setLoading(false); }
    };
    loadContent();
  }, []);

  // ── Save Logic ──
  const saveToBackend = async (nextContent, message) => {
    const authHeaders = getAuthHeaders();
    if (!authHeaders) { setError("Admin login expired."); return false; }
    try {
      await axios.put(`${API_URL}/api/site-content/academics`, { content: nextContent }, { headers: authHeaders });
      setForm(nextContent);
      setSuccess(message || "Academics page updated successfully.");
      return true;
    } catch (err) {
      console.error("Save error:", err);
      setError(err.response?.data?.message || "Could not save content.");
      return false;
    }
  };

  // Parses "Subject Name - Type - Hours" lines into structured subject objects.
  // Returns { subjects, invalidLines } so the caller can warn about malformed rows.
  const parseSubjectsText = (text) => {
    const invalidLines = [];
    const subjects = (text || "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const parts = line.split(" - ").map((s) => s.trim());
        if (parts.length !== 3 || parts.some((p) => !p)) {
          invalidLines.push(line);
          return null;
        }
        const [name, type, hours] = parts;
        return { name, type, hours };
      })
      .filter(Boolean);
    return { subjects, invalidLines };
  };

  const saveSelectedPart = async () => {
    if (!editingTarget) return;

    let nextForm = mergeAcademicsContent(form);

    if (editingTarget.type === "hero") {
      nextForm.hero = {
        badge: modalForm.badge || defaultAcademicsContent.hero.badge,
        title: modalForm.title || defaultAcademicsContent.hero.title,
        subtitle: modalForm.subtitle || defaultAcademicsContent.hero.subtitle,
        description: modalForm.description || defaultAcademicsContent.hero.description,
      };
    }

    if (editingTarget.type === "levelsHeading") {
      nextForm.levelsHeading = {
        badge: modalForm.badge || defaultAcademicsContent.levelsHeading.badge,
        title: modalForm.title || defaultAcademicsContent.levelsHeading.title,
        description: modalForm.description || defaultAcademicsContent.levelsHeading.description,
      };
    }

    if (editingTarget.type === "strengthsHeading") {
      nextForm.strengthsHeading = {
        badge: modalForm.badge || defaultAcademicsContent.strengthsHeading.badge,
        title: modalForm.title || defaultAcademicsContent.strengthsHeading.title,
        description: modalForm.description || defaultAcademicsContent.strengthsHeading.description,
      };
    }

    if (editingTarget.type === "achievementsHeading") {
      nextForm.achievementsHeading = {
        badge: modalForm.badge || defaultAcademicsContent.achievementsHeading.badge,
        title: modalForm.title || defaultAcademicsContent.achievementsHeading.title,
        description: modalForm.description || defaultAcademicsContent.achievementsHeading.description,
      };
    }

    if (editingTarget.type === "stat") {
      const idx = editingTarget.index;
      nextForm.stats[idx] = {
        ...nextForm.stats[idx],
        value: modalForm.value || "",
        suffix: modalForm.suffix || "",
        label: modalForm.label || "",
      };
    }

    if (editingTarget.type === "strength") {
      const idx = editingTarget.index;
      if (editingTarget.isNew) {
        nextForm.strengths.push({ id: Date.now(), title: modalForm.title, description: modalForm.description, icon: "Sparkles", color: "#1A5276" });
      } else {
        nextForm.strengths[idx] = { ...nextForm.strengths[idx], title: modalForm.title, description: modalForm.description };
      }
    }

    if (editingTarget.type === "achievement") {
      const idx = editingTarget.index;
      if (editingTarget.isNew) {
        nextForm.achievements.push({ id: Date.now(), title: modalForm.title, description: modalForm.description });
      } else {
        nextForm.achievements[idx] = { ...nextForm.achievements[idx], title: modalForm.title, description: modalForm.description };
      }
    }

    if (editingTarget.type === "assessment") {
      nextForm.assessment = {
        title: modalForm.title || defaultAcademicsContent.assessment.title,
        description: modalForm.description || defaultAcademicsContent.assessment.description,
        methods: (modalForm.methodsText || "").split("\n").map((s) => s.trim()).filter(Boolean),
      };
    }

    // ── Class Level card: name, badge, span, age group, description ──
    if (editingTarget.type === "levelCard") {
      if (!modalForm.name || !modalForm.name.trim()) {
        setError("Class Level name is required.");
        return;
      }
      if (editingTarget.isNew) {
        const existingIds = nextForm.classLevels.map((l) => l.id);
        const newLevel = {
          id: uniqueId(modalForm.name, existingIds),
          name: modalForm.name.trim(),
          shortBadge: modalForm.shortBadge || "",
          span: modalForm.span || "",
          ageGroup: modalForm.ageGroup || "",
          color: modalForm.color || "#1A5276",
          tagline: modalForm.tagline || "",
          description: modalForm.description || "",
          classes: [
            {
              id: "class-1",
              name: "New Class",
              focus: "",
              subjects: [],
              curriculumHighlights: [],
              assessmentMethod: "",
            },
          ],
        };
        nextForm.classLevels.push(newLevel);
      } else {
        const idx = editingTarget.index;
        nextForm.classLevels[idx] = {
          ...nextForm.classLevels[idx],
          name: modalForm.name.trim(),
          shortBadge: modalForm.shortBadge || "",
          span: modalForm.span || "",
          ageGroup: modalForm.ageGroup || "",
          color: modalForm.color || nextForm.classLevels[idx].color,
          description: modalForm.description || "",
        };
      }
    }

    // ── Curriculum panel: tagline + description for a specific level ──
    if (editingTarget.type === "curriculumPanel") {
      const level = nextForm.classLevels.find((l) => l.id === editingTarget.levelId);
      if (level) {
        level.tagline = modalForm.tagline || "";
        level.description = modalForm.description || "";
      }
    }

    // ── Class name (from the Class Selector tabs), scoped to a level+class ──
    if (editingTarget.type === "className") {
      if (!modalForm.name || !modalForm.name.trim()) {
        setError("Class name is required.");
        return;
      }
      const level = nextForm.classLevels.find((l) => l.id === editingTarget.levelId);
      if (level) {
        if (editingTarget.isNew) {
          const existingIds = level.classes.map((c) => c.id);
          level.classes.push({
            id: uniqueId(modalForm.name, existingIds),
            name: modalForm.name.trim(),
            focus: "",
            subjects: [],
            curriculumHighlights: [],
            assessmentMethod: "",
          });
        } else {
          const cls = level.classes.find((c) => c.id === editingTarget.classId);
          if (cls) cls.name = modalForm.name.trim();
        }
      }
    }

    // ── Subject Breakdown: class name + subjects list, scoped to a level+class ──
    if (editingTarget.type === "subjectBreakdown") {
      const level = nextForm.classLevels.find((l) => l.id === editingTarget.levelId);
      const cls = level?.classes.find((c) => c.id === editingTarget.classId);
      if (cls) {
        const { subjects, invalidLines } = parseSubjectsText(modalForm.subjectsText);
        if (invalidLines.length) {
          setError(`Could not parse: "${invalidLines[0]}". Use the format: Subject Name - Type - Hours`);
          return;
        }
        cls.name = modalForm.className && modalForm.className.trim() ? modalForm.className.trim() : cls.name;
        cls.subjects = subjects;
      }
    }

    // ── Learning Highlights + Assessment Pattern, scoped to a level+class ──
    if (editingTarget.type === "highlightsAndAssessment") {
      const level = nextForm.classLevels.find((l) => l.id === editingTarget.levelId);
      const cls = level?.classes.find((c) => c.id === editingTarget.classId);
      if (cls) {
        cls.curriculumHighlights = (modalForm.highlightsText || "")
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean);
        cls.assessmentMethod = modalForm.assessmentMethod || "";
      }
    }

    setSaving(true);
    const saved = await saveToBackend(nextForm, "Selected item saved successfully.");
    if (saved) { setEditingTarget(null); setModalForm({}); }
    setSaving(false);
  };

  const deleteTargetItem = async (target) => {
    if (!target) return;
    setSaving(true);
    let nextForm = mergeAcademicsContent(form);

    if (target.type === "strength") {
      if (nextForm.strengths.length <= 1) {
        setError("At least one Strength must remain.");
        setSaving(false);
        return;
      }
      nextForm.strengths = nextForm.strengths.filter((_, i) => i !== target.index);
    } else if (target.type === "achievement") {
      if (nextForm.achievements.length <= 1) {
        setError("At least one Achievement must remain.");
        setSaving(false);
        return;
      }
      nextForm.achievements = nextForm.achievements.filter((_, i) => i !== target.index);
    } else if (target.type === "levelCard") {
      if (nextForm.classLevels.length <= 1) {
        setError("At least one Class Level must remain.");
        setSaving(false);
        return;
      }
      nextForm.classLevels = nextForm.classLevels.filter((_, i) => i !== target.index);
    } else if (target.type === "className") {
      const level = nextForm.classLevels.find((l) => l.id === target.levelId);
      if (level) {
        if (level.classes.length <= 1) {
          setError("At least one Class must remain in this level.");
          setSaving(false);
          return;
        }
        level.classes = level.classes.filter((c) => c.id !== target.classId);
      }
    }

    const saved = await saveToBackend(nextForm, "Item deleted successfully.");
    if (saved) setDeleteTarget(null);
    setSaving(false);
  };

  const openEditor = (target) => {
    setSuccess(""); setError(""); setEditingTarget(target);

    if (target.type === "hero") {
      setModalForm({ badge: form.hero.badge || "", title: form.hero.title || "", subtitle: form.hero.subtitle || "", description: form.hero.description || "" });
    } else if (target.type === "levelsHeading") {
      const heading = form.levelsHeading || defaultAcademicsContent.levelsHeading;
      setModalForm({
        badge: heading.badge || "Academic Structure",
        title: heading.title || "Explore Our Class Levels",
        description: heading.description || "Click on any academic level below to view the classes, subjects, curriculum, and grading structure.",
      });
    } else if (target.type === "strengthsHeading") {
      const heading = form.strengthsHeading || defaultAcademicsContent.strengthsHeading;
      setModalForm({
        badge: heading.badge || "What Sets Us Apart",
        title: heading.title || "Our Academic Strengths",
        description: heading.description || "A learning ecosystem built on innovation, expertise, and unwavering commitment to student success.",
      });
    } else if (target.type === "achievementsHeading") {
      const heading = form.achievementsHeading || defaultAcademicsContent.achievementsHeading;
      setModalForm({
        badge: heading.badge || "Our Milestones",
        title: heading.title || "Celebrating Excellence",
        description: heading.description || "A legacy of achievement that reflects our commitment to quality education.",
      });
    } else if (target.type === "stat") {
      const s = form.stats[target.index];
      setModalForm({ value: s.value, suffix: s.suffix, label: s.label });
    } else if (target.type === "strength" || target.type === "achievement") {
      const item = target.type === "strength" ? form.strengths[target.index] : form.achievements[target.index];
      setModalForm({ title: item?.title || "", description: item?.description || "" });
    } else if (target.type === "assessment") {
      setModalForm({ title: form.assessment.title || "", description: form.assessment.description || "", methodsText: (form.assessment.methods || []).join("\n") });
    } else if (target.type === "levelCard") {
      if (target.isNew) {
        setModalForm({ name: "", shortBadge: "", span: "", ageGroup: "", description: "", color: "#1A5276" });
      } else {
        const level = form.classLevels[target.index];
        setModalForm({
          name: level.name || "",
          shortBadge: level.shortBadge || "",
          span: level.span || "",
          ageGroup: level.ageGroup || "",
          description: level.description || "",
          color: level.color || "#1A5276",
        });
      }
    } else if (target.type === "curriculumPanel") {
      const level = form.classLevels.find((l) => l.id === target.levelId);
      setModalForm({ tagline: level?.tagline || "", description: level?.description || "" });
    } else if (target.type === "className") {
      if (target.isNew) {
        setModalForm({ name: "" });
      } else {
        const level = form.classLevels.find((l) => l.id === target.levelId);
        const cls = level?.classes.find((c) => c.id === target.classId);
        setModalForm({ name: cls?.name || "" });
      }
    } else if (target.type === "subjectBreakdown") {
      const level = form.classLevels.find((l) => l.id === target.levelId);
      const cls = level?.classes.find((c) => c.id === target.classId);
      setModalForm({
        className: cls?.name || "",
        subjectsText: (cls?.subjects || []).map((s) => `${s.name} - ${s.type} - ${s.hours}`).join("\n"),
      });
    } else if (target.type === "highlightsAndAssessment") {
      const level = form.classLevels.find((l) => l.id === target.levelId);
      const cls = level?.classes.find((c) => c.id === target.classId);
      setModalForm({
        highlightsText: (cls?.curriculumHighlights || []).join("\n"),
        assessmentMethod: cls?.assessmentMethod || "",
      });
    }
  };

  const closeEditor = () => { if (saving) return; setEditingTarget(null); setModalForm({}); };

  const openAddLevel = () => openEditor({ type: "levelCard", index: form.classLevels.length, isNew: true });
  const openAddClass = (levelId) => openEditor({ type: "className", levelId, isNew: true });
  const openAddStrength = () => openEditor({ type: "strength", index: form.strengths.length, isNew: true });
  const openAddAchievement = () => openEditor({ type: "achievement", index: form.achievements.length, isNew: true });

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#0B0E14] text-white">Loading Academics Editor...</div>;

  const titleForTarget = (t) => {
    const labels = {
      hero: "Hero Section",
      levelsHeading: "Class Levels Heading",
      strengthsHeading: "Academic Strengths Heading",
      achievementsHeading: "Achievements Heading",
      stat: "Stat",
      strength: t?.isNew ? "New Academic Strength" : "Academic Strength",
      achievement: t?.isNew ? "New Achievement" : "Achievement",
      assessment: "Assessment Section",
      levelCard: t?.isNew ? "New Class Level" : "Class Level",
      curriculumPanel: "Curriculum Panel",
      className: t?.isNew ? "New Class" : "Class Name",
      subjectBreakdown: "Subject Breakdown",
      highlightsAndAssessment: "Learning Highlights & Assessment",
    };
    return labels[t?.type] || "Item";
  };

  return (
    <div className="space-y-6 min-h-screen p-6" style={{ background: "#0B0E14" }}>
      <style>{`.admin-edit-hidden { display: none; } .group:hover .admin-edit-hidden { display: flex; }`}</style>

      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-[24px] p-6 backdrop-blur-xl border" style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)" }}>

        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-3 bg-blue-500/10 text-blue-300 border border-blue-500/20">
              <Eye className="w-3.5 h-3.5" /> Visual Academics Editor
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Hover and Edit Academics Page</h2>
            <p className="text-sm text-slate-400 mt-1">Hover any block to edit. Changes save directly to the public website.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate("/admin/dashboard")} className="px-4 py-2 rounded-xl text-sm text-slate-300 hover:text-white bg-white/5 border border-white/10 transition">Dashboard</button>
            <button onClick={async () => { setSaving(true); await saveToBackend(form, "All content saved successfully."); setSaving(false); }} disabled={saving} className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md transition">
              {saving ? "Saving..." : "Save All Changes"}
            </button>
          </div>
        </div>

        {success && <div className="mb-4 rounded-xl px-4 py-3 flex items-center gap-2 font-medium bg-green-500/10 text-green-400 border border-green-500/20"><CheckCircle2 className="w-4 h-4" />{success}</div>}
        {error && <div className="mb-4 rounded-xl px-4 py-3 font-medium bg-red-500/10 text-red-400 border border-red-500/20"><AlertCircle className="w-4 h-4 inline mr-2" />{error}</div>}

        <div className="rounded-[2rem] overflow-hidden border border-white/10 bg-white shadow-2xl relative">
          <AcademicsPage
            adminEditMode={true}
            contentOverride={form}
            onEditTarget={openEditor}
            onDeleteTarget={(t) => { setDeleteTarget(t); deleteTargetItem(t); }}
            onAddLevel={openAddLevel}
            onAddClass={openAddClass}
            onAddStrength={openAddStrength}
            onAddAchievement={openAddAchievement}
          />
        </div>
      </motion.div>

      <AnimatePresence>
        {editingTarget && (
          <ModalShell title={`Edit ${titleForTarget(editingTarget)}`} onClose={closeEditor} onSave={saveSelectedPart} saving={saving}>

            {editingTarget.type === "hero" && (
              <div className="space-y-4">
                <Field label="Badge Text" value={modalForm.badge} onChange={(v) => setModalForm({ ...modalForm, badge: v })} />
                <Field label="Title" value={modalForm.title} onChange={(v) => setModalForm({ ...modalForm, title: v })} />
                <Field label="Subtitle" value={modalForm.subtitle} onChange={(v) => setModalForm({ ...modalForm, subtitle: v })} textarea rows={2} />
                <Field label="Description" value={modalForm.description} onChange={(v) => setModalForm({ ...modalForm, description: v })} textarea rows={4} />
              </div>
            )}

            {editingTarget.type === "levelsHeading" && (
              <div className="space-y-4">
                <Field label="Badge Text" value={modalForm.badge} onChange={(v) => setModalForm({ ...modalForm, badge: v })} />
                <Field label="Title" value={modalForm.title} onChange={(v) => setModalForm({ ...modalForm, title: v })} />
                <Field label="Description" value={modalForm.description} onChange={(v) => setModalForm({ ...modalForm, description: v })} textarea rows={4} />
              </div>
            )}

            {editingTarget.type === "strengthsHeading" && (
              <div className="space-y-4">
                <Field label="Badge Text" value={modalForm.badge} onChange={(v) => setModalForm({ ...modalForm, badge: v })} />
                <Field label="Title" value={modalForm.title} onChange={(v) => setModalForm({ ...modalForm, title: v })} />
                <Field label="Description" value={modalForm.description} onChange={(v) => setModalForm({ ...modalForm, description: v })} textarea rows={4} />
              </div>
            )}

            {editingTarget.type === "achievementsHeading" && (
              <div className="space-y-4">
                <Field label="Badge Text" value={modalForm.badge} onChange={(v) => setModalForm({ ...modalForm, badge: v })} />
                <Field label="Title" value={modalForm.title} onChange={(v) => setModalForm({ ...modalForm, title: v })} />
                <Field label="Description" value={modalForm.description} onChange={(v) => setModalForm({ ...modalForm, description: v })} textarea rows={4} />
              </div>
            )}

            {editingTarget.type === "stat" && (
              <div className="space-y-4">
                <Field label="Value (e.g. 1500)" value={modalForm.value} onChange={(v) => setModalForm({ ...modalForm, value: v })} />
                <Field label="Suffix (e.g. + or %)" value={modalForm.suffix} onChange={(v) => setModalForm({ ...modalForm, suffix: v })} />
                <Field label="Label (e.g. Active Learners)" value={modalForm.label} onChange={(v) => setModalForm({ ...modalForm, label: v })} />
              </div>
            )}

            {(editingTarget.type === "strength" || editingTarget.type === "achievement") && (
              <div className="space-y-4">
                <Field label="Title" value={modalForm.title} onChange={(v) => setModalForm({ ...modalForm, title: v })} />
                <Field label="Description" value={modalForm.description} onChange={(v) => setModalForm({ ...modalForm, description: v })} textarea rows={4} />
              </div>
            )}

            {editingTarget.type === "assessment" && (
              <div className="space-y-4">
                <Field label="Assessment Title" value={modalForm.title} onChange={(v) => setModalForm({ ...modalForm, title: v })} />
                <Field label="Assessment Description" value={modalForm.description} onChange={(v) => setModalForm({ ...modalForm, description: v })} textarea rows={3} />
                <Field label="Methods (One per line)" value={modalForm.methodsText} onChange={(v) => setModalForm({ ...modalForm, methodsText: v })} textarea rows={6} />
              </div>
            )}

            {editingTarget.type === "levelCard" && (
              <div className="space-y-4">
                <Field label="Level Name" value={modalForm.name} onChange={(v) => setModalForm({ ...modalForm, name: v })} placeholder="e.g. Pre-Primary / Early Years" />
                <Field label="Short Badge" value={modalForm.shortBadge} onChange={(v) => setModalForm({ ...modalForm, shortBadge: v })} placeholder="e.g. Early Childhood" />
                <Field label="Span" value={modalForm.span} onChange={(v) => setModalForm({ ...modalForm, span: v })} placeholder="e.g. Play Group, Nursery, LKG, UKG" />
                <Field label="Age Group" value={modalForm.ageGroup} onChange={(v) => setModalForm({ ...modalForm, ageGroup: v })} placeholder="e.g. 3 – 5.5 Years" />
                <Field label="Accent Color (hex)" value={modalForm.color} onChange={(v) => setModalForm({ ...modalForm, color: v })} placeholder="#1A5276" />
                <Field label="Card Description" value={modalForm.description} onChange={(v) => setModalForm({ ...modalForm, description: v })} textarea rows={3} />
              </div>
            )}

            {editingTarget.type === "curriculumPanel" && (
              <div className="space-y-4">
                <Field label="Curriculum Tagline" value={modalForm.tagline} onChange={(v) => setModalForm({ ...modalForm, tagline: v })} />
                <Field label="Curriculum Description" value={modalForm.description} onChange={(v) => setModalForm({ ...modalForm, description: v })} textarea rows={4} />
              </div>
            )}

            {editingTarget.type === "className" && (
              <div className="space-y-4">
                <Field label="Class Name" value={modalForm.name} onChange={(v) => setModalForm({ ...modalForm, name: v })} placeholder="e.g. Grade 1 – 3 (Lower Primary)" />
              </div>
            )}

            {editingTarget.type === "subjectBreakdown" && (
              <div className="space-y-4">
                <Field label="Class Name" value={modalForm.className} onChange={(v) => setModalForm({ ...modalForm, className: v })} />
                <Field
                  label="Subjects (one per line: Subject Name - Type - Hours)"
                  value={modalForm.subjectsText}
                  onChange={(v) => setModalForm({ ...modalForm, subjectsText: v })}
                  textarea
                  rows={10}
                  placeholder={"Mathematics - Core - 6 hrs/wk\nEnglish - Compulsory - 6 hrs/wk"}
                />
              </div>
            )}

            {editingTarget.type === "highlightsAndAssessment" && (
              <div className="space-y-4">
                <Field
                  label="Learning Highlights (one per line)"
                  value={modalForm.highlightsText}
                  onChange={(v) => setModalForm({ ...modalForm, highlightsText: v })}
                  textarea
                  rows={6}
                />
                <Field label="Assessment Pattern" value={modalForm.assessmentMethod} onChange={(v) => setModalForm({ ...modalForm, assessmentMethod: v })} textarea rows={3} />
              </div>
            )}

          </ModalShell>
        )}
      </AnimatePresence>
    </div>
  );
}