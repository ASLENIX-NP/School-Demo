import { useEffect, useMemo, useRef, useState } from "react";
import api from "../lib/api";
import { motion, AnimatePresence } from "motion/react";
import {
  AlertCircle,
  Camera,
  CheckCircle2,
  Eye,
  Image as ImageIcon,
  Pencil,
  Save,
  Trash2,
  UploadCloud,
  X,
  Plus,
} from "lucide-react";

import AcademicsPage from "../app/components/Academics";

// ============================================================
// DEFAULT CONTENT (matching AcademicsPage)
// ============================================================

const defaultHeroContent = {
  badge: "Excellence in Education",
  title: "Empowering Minds, Shaping Futures.",
  subtitle: "Nurturing the next generation of thinkers, innovators, and leaders through quality education.",
  description:
    "At Red Rose Secondary English Boarding School, education extends beyond textbooks. Our comprehensive academic framework integrates intellectual rigor, creative exploration, ethical grounding, and real-world readiness from early childhood through secondary education.",
};

const defaultStats = [
  { id: "stat-1", value: "1500", suffix: "+", label: "Active Learners", color: "#9C2748" },
  { id: "stat-2", value: "85", suffix: "+", label: "Dedicated Educators", color: "#B98A42" },
  { id: "stat-3", value: "55", suffix: "+", label: "Years of Impact", color: "#3F5B49" },
  { id: "stat-4", value: "100", suffix: "%", label: "SEE Pass Rate", color: "#4A2C6E" },
];

const defaultStrengths = [
  {
    id: "strength-1",
    title: "Innovation Hub",
    description: "State-of-the-art learning spaces with interactive technology and collaborative zones.",
    color: "#9C2748",
  },
  {
    id: "strength-2",
    title: "STEM Excellence",
    description: "Robust science, technology, engineering, and mathematics programs with hands-on experimentation.",
    color: "#3F5B49",
  },
  {
    id: "strength-3",
    title: "Global Perspective",
    description: "Integrated curriculum emphasizing critical thinking and cross-cultural communication.",
    color: "#B98A42",
  },
  {
    id: "strength-4",
    title: "Arts & Expression",
    description: "Comprehensive arts education nurturing creativity through visual arts, music, and performance.",
    color: "#C6486B",
  },
  {
    id: "strength-5",
    title: "Character Development",
    description: "Values-based education cultivating integrity, empathy, and social responsibility.",
    color: "#4A2C6E",
  },
  {
    id: "strength-6",
    title: "Future Ready",
    description: "Career and college counseling with mentorship pathways and leadership development.",
    color: "#2D6A4F",
  },
];

const defaultAchievements = [
  {
    id: "ach-1",
    title: "Academic Excellence Awards",
    description: "Consistent top-tier SEE performance and regional academic honors in Makwanpur.",
  },
  {
    id: "ach-2",
    title: "Science & STEM Showcase",
    description: "Student science exhibition projects recognized at district and national youth fairs.",
  },
  {
    id: "ach-3",
    title: "Community & Service",
    description: "Student-led service initiatives contributing to local literacy and environmental projects.",
  },
  {
    id: "ach-4",
    title: "Co-Curricular Triumphs",
    description: "Championship trophies in inter-school football, athletics, and cultural dance competitions.",
  },
];

const defaultAssessment = {
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
};

const defaultClassLevels = [
  {
    id: "pre-primary",
    name: "Pre-Primary / Early Years",
    shortBadge: "Early Childhood",
    span: "Play Group, Nursery, LKG, UKG",
    ageGroup: "3 – 5.5 Years",
    color: "#B98A42",
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
    color: "#9C2748",
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
    color: "#3F5B49",
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
// HELPERS
// ============================================================

function clampNumber(value, min, max, fallback) {
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue)) return fallback;
  return Math.min(max, Math.max(min, numberValue));
}

function getAuthHeaders() {
  const token = localStorage.getItem("adminToken");
  if (!token) return null;
  return { Authorization: `Bearer ${token}` };
}

function getUploadUrl(payload) {
  return (
    payload?.url ||
    payload?.imageUrl ||
    payload?.fileUrl ||
    payload?.data?.url ||
    payload?.data?.imageUrl ||
    payload?.data?.fileUrl ||
    payload?.data?.secure_url ||
    payload?.file?.url ||
    ""
  );
}

function clampImageOffset(value) {
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue)) return 0;
  return Math.min(60, Math.max(-60, numberValue));
}

function clampImageZoom(value) {
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue)) return 1;
  return Math.min(3, Math.max(1, numberValue));
}

// ============================================================
// FIELD COMPONENT (for modals)
// ============================================================

function Field({ label, value, onChange, placeholder = "", textarea = false, type = "text", rows = 3 }) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-700 mb-1">{label}</label>
      {textarea ? (
        <textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs outline-none focus:bg-white focus:border-amber-500 resize-none"
        />
      ) : (
        <input
          type={type}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs outline-none focus:bg-white focus:border-amber-500"
        />
      )}
    </div>
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="w-full flex items-center justify-between gap-4 rounded-xl px-4 py-2.5 text-left"
      style={{
        background: checked ? "rgba(22,138,58,0.08)" : "rgba(100,116,139,0.08)",
        border: checked ? "1px solid rgba(22,138,58,0.18)" : "1px solid rgba(100,116,139,0.18)",
      }}
    >
      <span className="text-xs font-bold text-slate-700">{label}</span>
      <span
        className="relative w-10 h-6 rounded-full transition-all"
        style={{ background: checked ? "#168A3A" : "#CBD5E1" }}
      >
        <span
          className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow"
          style={{ left: checked ? "20px" : "4px" }}
        />
      </span>
    </button>
  );
}

function ColorPicker({ label, value, onChange }) {
  const colors = [
    { label: "Rose", value: "#9C2748" },
    { label: "Gold", value: "#B98A42" },
    { label: "Moss", value: "#3F5B49" },
    { label: "Rose Bright", value: "#C6486B" },
    { label: "Plum", value: "#4A2C6E" },
    { label: "Forest Green", value: "#2D6A4F" },
    { label: "Deep Navy", value: "#1E2A4F" },
    { label: "Burgundy", value: "#6E1733" },
  ];

  return (
    <div>
      <label className="block text-xs font-bold text-slate-700 mb-1">{label}</label>
      <div className="flex flex-wrap gap-2">
        {colors.map((c) => (
          <button
            key={c.value}
            type="button"
            onClick={() => onChange(c.value)}
            className={`w-8 h-8 rounded-full border-2 transition-all ${
              value === c.value ? "border-slate-900 scale-110" : "border-transparent"
            }`}
            style={{ background: c.value }}
            title={c.label}
          />
        ))}
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#HEX"
          className="w-24 px-2 py-1 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs font-mono outline-none focus:border-amber-500"
        />
      </div>
    </div>
  );
}

// ============================================================
// EDITING CHROME (matching About page style)
// ============================================================

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
      className="absolute -top-2 -right-2 z-[90] opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 rounded-full w-8 h-8 flex items-center justify-center shadow-lg backdrop-blur-md"
      style={{ background: "rgba(255,255,255,0.9)", color: "#9C2748", border: "1px solid rgba(185,138,66,0.33)" }}
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
      className="absolute -top-2 -right-12 z-[90] opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 rounded-full w-8 h-8 flex items-center justify-center shadow-lg"
      style={{ background: "#FBE3E7", color: "#9C2748", border: "2px solid #FFFFFF" }}
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
    <div className={`relative group ${className}`}>
      {children}
      <EditIconButton editMode={editMode} target={target} onEditTarget={onEditTarget} icon={icon} label={label} />
      {canDelete && (
        <DeleteIconButton editMode={editMode} target={target} onDeleteTarget={onDeleteTarget} label="Delete" />
      )}
    </div>
  );
}

function SectionAddButton({ editMode, label, type, onAddTarget }) {
  if (!editMode) return null;
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onAddTarget(type);
      }}
      className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5"
      style={{ color: "#FFFFFF", background: "linear-gradient(135deg, #6E1733 0%, #9C2748 55%, #C6486B 100%)", boxShadow: "0 10px 24px rgba(156,39,72,0.25)" }}
    >
      <Plus className="w-4 h-4" />
      {label}
    </button>
  );
}

// ============================================================
// MAIN ADMIN COMPONENT
// ============================================================

export default function AdminAcademics() {
  // State - Added Headings
  const [form, setForm] = useState({
    hero: defaultHeroContent,
    stats: defaultStats,
    strengths: defaultStrengths,
    achievements: defaultAchievements,
    assessment: defaultAssessment,
    classLevels: defaultClassLevels,
    levelsHeading: {},
    strengthsHeading: {},
    achievementsHeading: {},
    assessmentHeading: {},
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [editingTarget, setEditingTarget] = useState(null);
  const [modalForm, setModalForm] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [imageAdjustOpen, setImageAdjustOpen] = useState(false);

  // Fetch data - FIXED DEEP MERGE
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await api.get("/api/site-content/academics", { timeout: 12000 });
        const saved = res.data?.data?.content || {};

        setForm({
          hero: {
            ...defaultHeroContent,
            ...(saved.hero || {})
          },
          stats: Array.isArray(saved.stats) ? saved.stats : defaultStats,
          strengths: Array.isArray(saved.strengths) ? saved.strengths : defaultStrengths,
          achievements: Array.isArray(saved.achievements) ? saved.achievements : defaultAchievements,
          assessment: {
            ...defaultAssessment,
            ...(saved.assessment || {}),
            methods: Array.isArray(saved.assessment?.methods) ? saved.assessment.methods : defaultAssessment.methods,
          },
          classLevels: Array.isArray(saved.classLevels) ? saved.classLevels : defaultClassLevels,
          levelsHeading: saved.levelsHeading || {},
          strengthsHeading: saved.strengthsHeading || {},
          achievementsHeading: saved.achievementsHeading || {},
          assessmentHeading: saved.assessmentHeading || {},
        });
      } catch (err) {
        console.error("Load academics error:", err);
        setError("Could not load saved content. Default content shown.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const saveContent = async (updatedForm, message) => {
    setSaving(true);
    setSuccess("");
    setError("");

    try {
      const headers = getAuthHeaders();
      if (!headers) {
        setError("Admin login expired. Please logout and login again.");
        return false;
      }

      await api.put(
        "/api/site-content/academics",
        { content: updatedForm },
        { headers }
      );

      setForm(updatedForm);
      setSuccess(message || "Academics content saved successfully!");
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save content.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // OPEN EDITOR - matches About page pattern
  // ============================================================

  const openEditor = (target) => {
    setSuccess("");
    setError("");
    setImageAdjustOpen(false);
    setEditingTarget(target);

    // Hero
    if (target.type === "hero") {
      setModalForm({
        badge: form.hero.badge || "",
        title: form.hero.title || "",
        subtitle: form.hero.subtitle || "",
        description: form.hero.description || "",
      });
      return;
    }

    // Stat
    if (target.type === "statsCard") {
      const stat = form.stats?.[target.index];
      setModalForm({
        value: stat?.value !== undefined ? stat.value : "",
        suffix: stat?.suffix || "",
        label: stat?.label || "",
        color: stat?.color || "#9C2748",
        visible: stat?.visible !== false,
      });
      return;
    }

    // Strength
    if (target.type === "strengthCard") {
      const strength = form.strengths?.[target.index];
      setModalForm({
        title: strength?.title || "",
        description: strength?.description || "",
        color: strength?.color || "#9C2748",
        visible: strength?.visible !== false,
      });
      return;
    }

    // Achievement
    if (target.type === "achievementCard") {
      const ach = form.achievements?.[target.index];
      setModalForm({
        title: ach?.title || "",
        description: ach?.description || "",
        visible: ach?.visible !== false,
      });
      return;
    }

    // Assessment
    if (target.type === "assessment") {
      setModalForm({
        title: form.assessment.title || "",
        description: form.assessment.description || "",
        methods: (form.assessment.methods || []).join("\n"),
      });
      return;
    }

    // Class Level
    if (target.type === "classLevel") {
      const level = form.classLevels?.[target.index];
      setModalForm({
        name: level?.name || "",
        shortBadge: level?.shortBadge || "",
        span: level?.span || "",
        ageGroup: level?.ageGroup || "",
        tagline: level?.tagline || "",
        description: level?.description || "",
        color: level?.color || "#9C2748",
        visible: level?.visible !== false,
      });
      return;
    }

    // Class (within a level)
    if (target.type === "classItem") {
      const level = form.classLevels?.[target.levelIndex];
      const cls = level?.classes?.[target.classIndex];
      setModalForm({
        name: cls?.name || "",
        focus: cls?.focus || "",
        subjects: cls?.subjects?.map((s) => `${s.name}|${s.type}|${s.hours}`).join("\n") || "",
        curriculumHighlights: cls?.curriculumHighlights?.join("\n") || "",
        assessmentMethod: cls?.assessmentMethod || "",
        visible: cls?.visible !== false,
      });
      return;
    }
  };

  // ============================================================
  // SAVE SELECTED PART
  // ============================================================

  const saveSelectedPart = async () => {
    if (!editingTarget) return;

    setSaving(true);
    setSuccess("");
    setError("");

    try {
      let nextForm = { ...form };

      // Hero
      if (editingTarget.type === "hero") {
        nextForm.hero = {
          badge: modalForm.badge || "",
          title: modalForm.title || "",
          subtitle: modalForm.subtitle || "",
          description: modalForm.description || "",
        };
      }

      // Stat
      if (editingTarget.type === "statsCard") {
        const stats = [...nextForm.stats];
        const updatedStat = {
          ...(stats[editingTarget.index] || {}),
          id: stats[editingTarget.index]?.id || `stat-${Date.now()}`,
          value: modalForm.value || "0",
          suffix: modalForm.suffix || "",
          label: modalForm.label || "",
          color: modalForm.color || "#9C2748",
          visible: modalForm.visible !== false,
        };
        stats[editingTarget.index] = updatedStat;
        nextForm.stats = stats;
      }

      // Strength
      if (editingTarget.type === "strengthCard") {
        const strengths = [...nextForm.strengths];
        strengths[editingTarget.index] = {
          ...(strengths[editingTarget.index] || {}),
          id: strengths[editingTarget.index]?.id || `strength-${Date.now()}`,
          title: modalForm.title || "",
          description: modalForm.description || "",
          color: modalForm.color || "#9C2748",
          visible: modalForm.visible !== false,
        };
        nextForm.strengths = strengths;
      }

      // Achievement
      if (editingTarget.type === "achievementCard") {
        const achievements = [...nextForm.achievements];
        achievements[editingTarget.index] = {
          ...(achievements[editingTarget.index] || {}),
          id: achievements[editingTarget.index]?.id || `ach-${Date.now()}`,
          title: modalForm.title || "",
          description: modalForm.description || "",
          visible: modalForm.visible !== false,
        };
        nextForm.achievements = achievements;
      }

      // Assessment
      if (editingTarget.type === "assessment") {
        const methods = modalForm.methods
          ? modalForm.methods.split("\n").filter((m) => m.trim())
          : defaultAssessment.methods;

        nextForm.assessment = {
          title: modalForm.title || "",
          description: modalForm.description || "",
          methods: methods.length ? methods : defaultAssessment.methods,
        };
      }

      // Class Level - FIXED TO PRESERVE CHILDREN
      if (editingTarget.type === "classLevel") {
        const levels = [...nextForm.classLevels];
        const existing = levels[editingTarget.index] || {};
        levels[editingTarget.index] = {
          ...existing,
          id: existing.id || `level-${Date.now()}`,
          name: modalForm.name || "",
          shortBadge: modalForm.shortBadge || "",
          span: modalForm.span || "",
          ageGroup: modalForm.ageGroup || "",
          tagline: modalForm.tagline || "",
          description: modalForm.description || "",
          color: modalForm.color || "#9C2748",
          bgAccent: `${modalForm.color || "#9C2748"}18`,
          borderAccent: `${modalForm.color || "#9C2748"}40`,
          visible: modalForm.visible !== false,
          classes: existing.classes || [],
        };
        nextForm.classLevels = levels;
      }

      // Class Item
      if (editingTarget.type === "classItem") {
        const levels = [...nextForm.classLevels];
        const level = { ...levels[editingTarget.levelIndex] };
        const classes = [...(level.classes || [])];
        const existing = classes[editingTarget.classIndex] || {};

        const subjectLines = modalForm.subjects
          ? modalForm.subjects.split("\n").filter((s) => s.trim())
          : [];
        const subjects = subjectLines.map((line) => {
          const parts = line.split("|").map((p) => p.trim());
          return {
            name: parts[0] || "Subject",
            type: parts[1] || "Core",
            hours: parts[2] || "5 hrs/wk",
          };
        });

        const highlights = modalForm.curriculumHighlights
          ? modalForm.curriculumHighlights.split("\n").filter((h) => h.trim())
          : [];

        classes[editingTarget.classIndex] = {
          id: existing.id || `class-${Date.now()}`,
          name: modalForm.name || "",
          focus: modalForm.focus || "",
          subjects: subjects.length ? subjects : existing.subjects || [],
          curriculumHighlights: highlights.length ? highlights : existing.curriculumHighlights || [],
          assessmentMethod: modalForm.assessmentMethod || "",
          visible: modalForm.visible !== false,
        };

        level.classes = classes;
        levels[editingTarget.levelIndex] = level;
        nextForm.classLevels = levels;
      }

      const saved = await saveContent(nextForm, "Selected item saved successfully.");
      if (saved) {
        setEditingTarget(null);
        setModalForm({});
      }
    } catch (err) {
      console.error("Save selected item error:", err);
      setError(err.response?.data?.message || "Could not save selected item.");
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // ADD ITEMS
  // ============================================================

  const addItem = async (target) => {
    setSaving(true);
    setSuccess("");
    setError("");

    try {
      let type = typeof target === "string" ? target : target?.type;
      const targetLevelIndex = typeof target === "object" && Number.isInteger(target?.levelIndex)
        ? target.levelIndex
        : 0;

      let nextForm = {
        ...form,
        stats: [...(form.stats || [])],
        strengths: [...(form.strengths || [])],
        achievements: [...(form.achievements || [])],
        classLevels: [...(form.classLevels || [])],
      };

      /* =========================
         ADD STAT
      ========================= */
      if (type === "stat") {
        nextForm.stats.push({
          id: `stat-${Date.now()}`,
          value: "100",
          suffix: "+",
          label: "New Statistic",
          color: "#9C2748",
          visible: true,
        });
      }

      /* =========================
         ADD STRENGTH
      ========================= */
      if (type === "strength") {
        nextForm.strengths.push({
          id: `strength-${Date.now()}`,
          title: "New Strength",
          description: "Describe the academic strength of the school.",
          color: "#9C2748",
          visible: true,
        });
      }

      /* =========================
         ADD ACHIEVEMENT
      ========================= */
      if (type === "achievement") {
        nextForm.achievements.push({
          id: `achievement-${Date.now()}`,
          title: "New Achievement",
          description: "Describe the achievement of the school.",
          visible: true,
        });
      }

      /* =========================
         ADD CLASS LEVEL
      ========================= */
      if (type === "classLevel") {
        nextForm.classLevels.push({
          id: `level-${Date.now()}`,
          name: "New Academic Level",
          shortBadge: "New",
          span: "Class Range",
          ageGroup: "Age Range",
          color: "#9C2748",
          bgAccent: "rgba(156,39,72,0.10)",
          borderAccent: "rgba(156,39,72,0.20)",
          tagline: "New Academic Level Tagline",
          description: "Write the description for this academic level.",
          visible: true,
          classes: [
            {
              id: `class-${Date.now()}`,
              name: "New Class",
              focus: "Class focus description",
              subjects: [{ name: "Subject Name", type: "Core", hours: "5 hrs/wk" }],
              curriculumHighlights: ["Curriculum highlight"],
              assessmentMethod: "Assessment method description",
              visible: true,
            },
          ],
        });
      }

      /* =========================
         ADD CLASS (TO SPECIFIC LEVEL)
      ========================= */
      if (type === "classItem") {
        const levels = [...nextForm.classLevels];
        const levelIndex = Number.isInteger(targetLevelIndex) && targetLevelIndex >= 0 && targetLevelIndex < levels.length
          ? targetLevelIndex
          : 0;

        const level = { ...levels[levelIndex] };
        level.classes = [
          ...(level.classes || []),
          {
            id: `class-${Date.now()}`,
            name: "New Class",
            focus: "Class focus description",
            subjects: [{ name: "Subject Name", type: "Core", hours: "5 hrs/wk" }],
            curriculumHighlights: ["Curriculum highlight"],
            assessmentMethod: "Assessment method description",
            visible: true,
          },
        ];

        levels[levelIndex] = level;
        nextForm.classLevels = levels;
      }

      await saveContent(nextForm, "New item added successfully.");
    } catch (err) {
      console.error("Add item error:", err);
      setError(err.response?.data?.message || "Could not add item.");
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // DELETE ITEMS
  // ============================================================

  const deleteTargetItem = async (target) => {
    if (!target) return;

    const deletableTypes = ["statsCard", "strengthCard", "achievementCard", "classLevel", "classItem"];
    if (!deletableTypes.includes(target.type)) return;

    setSaving(true);
    setSuccess("");
    setError("");

    try {
      let nextForm = { ...form };

      if (target.type === "statsCard") {
        if (nextForm.stats.length <= 1) {
          setError("Cannot delete the last statistic.");
          return;
        }
        nextForm.stats = nextForm.stats.filter((_, i) => i !== target.index);
      }

      if (target.type === "strengthCard") {
        if (nextForm.strengths.length <= 1) {
          setError("Cannot delete the last strength.");
          return;
        }
        nextForm.strengths = nextForm.strengths.filter((_, i) => i !== target.index);
      }

      if (target.type === "achievementCard") {
        if (nextForm.achievements.length <= 1) {
          setError("Cannot delete the last achievement.");
          return;
        }
        nextForm.achievements = nextForm.achievements.filter((_, i) => i !== target.index);
      }

      if (target.type === "classLevel") {
        if (nextForm.classLevels.length <= 1) {
          setError("Cannot delete the last class level.");
          return;
        }
        nextForm.classLevels = nextForm.classLevels.filter((_, i) => i !== target.index);
      }

      if (target.type === "classItem") {
        const levels = [...nextForm.classLevels];
        const level = { ...levels[target.levelIndex] };
        if ((level.classes || []).length <= 1) {
          setError("Cannot delete the last class in this level.");
          return;
        }
        level.classes = level.classes.filter((_, i) => i !== target.classIndex);
        levels[target.levelIndex] = level;
        nextForm.classLevels = levels;
      }

      await saveContent(nextForm, "Item deleted successfully.");
      setDeleteTarget(null);
      setEditingTarget(null);
      setModalForm({});
    } catch (err) {
      console.error("Delete item error:", err);
      setError(err.response?.data?.message || "Could not delete item.");
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // MODAL TITLE HELPER
  // ============================================================

  const modalTitle = useMemo(() => {
    if (!editingTarget) return "";

    const titles = {
      hero: "Edit Hero Banner",
      statsCard: "Edit Statistic",
      strengthCard: "Edit Strength",
      achievementCard: "Edit Achievement",
      assessment: "Edit Assessment Framework",
      classLevel: "Edit Class Level",
      classItem: "Edit Class",
    };

    return titles[editingTarget.type] || "Edit Item";
  }, [editingTarget]);

  const canDeleteSelected = useMemo(() => {
    if (!editingTarget) return false;
    return ["statsCard", "strengthCard", "achievementCard", "classLevel", "classItem"].includes(editingTarget.type);
  }, [editingTarget]);

  // ============================================================
  // RENDER
  // ============================================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-slate-600">Loading Academics Editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <style>
        {`
          @media (max-width: 767px) {
            .admin-academics-preview-frame .group .opacity-0,
            .admin-academics-preview-frame .group [class*="opacity-0"],
            .admin-academics-preview-frame .group [class*="group-hover:opacity"],
            .admin-academics-preview-frame [class*="group-hover:opacity"] {
              opacity: 1 !important;
              visibility: visible !important;
              pointer-events: auto !important;
            }

            .admin-academics-preview-frame .group .pointer-events-none,
            .admin-academics-preview-frame .group [class*="pointer-events-none"] {
              pointer-events: auto !important;
            }

            .admin-academics-preview-frame .group button[class*="opacity-0"],
            .admin-academics-preview-frame button[class*="group-hover:opacity"],
            .admin-academics-preview-frame button[class*="opacity-0"] {
              opacity: 1 !important;
              visibility: visible !important;
              pointer-events: auto !important;
            }

            .admin-academics-preview-frame .group .hidden,
            .admin-academics-preview-frame .group [class*="hidden"] {
              display: inline-flex !important;
            }

            .admin-academics-preview-frame [class*="absolute"] button,
            .admin-academics-preview-frame button[class*="rounded-full"] {
              min-width: 2.25rem !important;
              min-height: 2.25rem !important;
              max-width: calc(100vw - 2rem) !important;
              white-space: nowrap !important;
              z-index: 30 !important;
              pointer-events: auto !important;
            }

            .admin-academics-preview-frame [class*="absolute"][class*="z-50"],
            .admin-academics-preview-frame [class*="absolute"][class*="z-[50]"],
            .admin-academics-preview-frame [class*="absolute"][class*="z-[60]"],
            .admin-academics-preview-frame [class*="absolute"][class*="z-[70]"],
            .admin-academics-preview-frame [class*="absolute"][class*="z-[80]"],
            .admin-academics-preview-frame [class*="absolute"][class*="z-[90]"],
            .admin-academics-preview-frame [class*="absolute"][class*="z-[999]"] {
              z-index: 30 !important;
            }
          }
        `}
      </style>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[24px] p-4 sm:p-5 md:p-6"
        style={{
          background: "linear-gradient(135deg, #E8EDF5 0%, #DCE3EF 50%, #E8E0F0 100%)",
          border: "1px solid rgba(15,23,42,0.06)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black mb-3 bg-purple-50 text-purple-700 border border-purple-100">
              <Eye className="w-3.5 h-3.5" />
              Visual Academics Editor
            </div>

            <h2
              className="text-2xl md:text-3xl font-black text-slate-950"
              style={{
                fontFamily: "var(--font-display)",
                letterSpacing: "-0.04em",
              }}
            >
              Hover and Edit Academics Page
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Hover content to edit. Stats, strengths, achievements, assessment, and class levels are all editable.
            </p>
          </div>
        </div>

        {success && (
          <div className="mb-4 rounded-2xl px-4 py-3 flex items-center gap-2 font-semibold bg-green-50 text-green-700 border border-green-100">
            <CheckCircle2 className="w-4 h-4" />
            {success}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-2xl px-4 py-3 flex items-center gap-2 font-semibold bg-red-50 text-red-700 border border-red-100">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <div
          className="admin-academics-preview-frame rounded-[2rem] overflow-x-auto"
          style={{
            background: "radial-gradient(circle at top left, rgba(56,189,248,0.14), transparent 34%), linear-gradient(180deg, #FFF8EE 0%, #F1ECFF 100%)",
            border: "1px solid rgba(15,23,42,0.08)",
          }}
        >
          <div className="w-full min-w-0 bg-white">
            <AcademicsPage
              editMode
              contentOverride={form}
              onEditTarget={openEditor}
              onDeleteTarget={(target) => setDeleteTarget(target)}
              onAddTarget={addItem}
            />
          </div>
        </div>
      </motion.div>

      {/* ====================================================
          EDIT MODAL (matching About page style)
          ==================================================== */}
      <AnimatePresence>
        {editingTarget && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5"
            style={{ background: "rgba(2,6,23,0.55)", backdropFilter: "blur(12px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 130, damping: 16 }}
              className="w-full max-w-xl rounded-[28px] overflow-hidden max-h-[92vh] overflow-y-auto"
              style={{ background: "#FFFFFF", border: "1px solid rgba(255,255,255,0.75)", boxShadow: "0 42px 110px rgba(0,0,0,0.28)" }}
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <div className="h-1" style={{ background: "linear-gradient(90deg, #FACC15, #38BDF8, #168A3A)" }} />

              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg, rgba(250,204,21,0.18), rgba(56,189,248,0.18))", color: "#0B1020" }}
                    >
                      <Pencil className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-950">{modalTitle}</h3>
                      <p className="text-sm text-slate-500">Save only this selected item.</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingTarget(null)}
                    className="w-10 h-10 rounded-2xl flex items-center justify-center bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Hero */}
                  {editingTarget.type === "hero" && (
                    <>
                      <Field label="Badge" value={modalForm.badge} onChange={(v) => setModalForm({ ...modalForm, badge: v })} />
                      <Field label="Title" value={modalForm.title} onChange={(v) => setModalForm({ ...modalForm, title: v })} />
                      <Field label="Subtitle" value={modalForm.subtitle} onChange={(v) => setModalForm({ ...modalForm, subtitle: v })} textarea rows={2} />
                      <Field label="Description" value={modalForm.description} onChange={(v) => setModalForm({ ...modalForm, description: v })} textarea rows={3} />
                    </>
                  )}

                  {/* Stat */}
                  {editingTarget.type === "statsCard" && (
                    <>
                      <Field label="Value" value={modalForm.value} onChange={(v) => setModalForm({ ...modalForm, value: v })} placeholder="1500" />
                      <Field label="Suffix" value={modalForm.suffix} onChange={(v) => setModalForm({ ...modalForm, suffix: v })} placeholder="+" />
                      <Field label="Label" value={modalForm.label} onChange={(v) => setModalForm({ ...modalForm, label: v })} placeholder="Active Learners" />
                      <ColorPicker label="Color" value={modalForm.color} onChange={(v) => setModalForm({ ...modalForm, color: v })} />
                      <Toggle label="Show this statistic" checked={modalForm.visible !== false} onChange={(v) => setModalForm({ ...modalForm, visible: v })} />
                    </>
                  )}

                  {/* Strength */}
                  {editingTarget.type === "strengthCard" && (
                    <>
                      <Field label="Title" value={modalForm.title} onChange={(v) => setModalForm({ ...modalForm, title: v })} />
                      <Field label="Description" value={modalForm.description} onChange={(v) => setModalForm({ ...modalForm, description: v })} textarea rows={2} />
                      <ColorPicker label="Color" value={modalForm.color} onChange={(v) => setModalForm({ ...modalForm, color: v })} />
                      <Toggle label="Show this strength" checked={modalForm.visible !== false} onChange={(v) => setModalForm({ ...modalForm, visible: v })} />
                    </>
                  )}

                  {/* Achievement */}
                  {editingTarget.type === "achievementCard" && (
                    <>
                      <Field label="Title" value={modalForm.title} onChange={(v) => setModalForm({ ...modalForm, title: v })} />
                      <Field label="Description" value={modalForm.description} onChange={(v) => setModalForm({ ...modalForm, description: v })} textarea rows={2} />
                      <Toggle label="Show this achievement" checked={modalForm.visible !== false} onChange={(v) => setModalForm({ ...modalForm, visible: v })} />
                    </>
                  )}

                  {/* Assessment */}
                  {editingTarget.type === "assessment" && (
                    <>
                      <Field label="Title" value={modalForm.title} onChange={(v) => setModalForm({ ...modalForm, title: v })} />
                      <Field label="Description" value={modalForm.description} onChange={(v) => setModalForm({ ...modalForm, description: v })} textarea rows={2} />
                      <Field
                        label="Methods (one per line)"
                        value={modalForm.methods}
                        onChange={(v) => setModalForm({ ...modalForm, methods: v })}
                        textarea
                        rows={6}
                        placeholder="Continuous Assessment System (CAS)&#10;Laboratory Practical Examinations"
                      />
                    </>
                  )}

                  {/* Class Level */}
                  {editingTarget.type === "classLevel" && (
                    <>
                      <Field label="Level Name" value={modalForm.name} onChange={(v) => setModalForm({ ...modalForm, name: v })} />
                      <Field label="Short Badge" value={modalForm.shortBadge} onChange={(v) => setModalForm({ ...modalForm, shortBadge: v })} />
                      <Field label="Span / Classes" value={modalForm.span} onChange={(v) => setModalForm({ ...modalForm, span: v })} />
                      <Field label="Age Group" value={modalForm.ageGroup} onChange={(v) => setModalForm({ ...modalForm, ageGroup: v })} />
                      <Field label="Tagline" value={modalForm.tagline} onChange={(v) => setModalForm({ ...modalForm, tagline: v })} />
                      <Field label="Description" value={modalForm.description} onChange={(v) => setModalForm({ ...modalForm, description: v })} textarea rows={2} />
                      <ColorPicker label="Color" value={modalForm.color} onChange={(v) => setModalForm({ ...modalForm, color: v })} />
                      <Toggle label="Show this level" checked={modalForm.visible !== false} onChange={(v) => setModalForm({ ...modalForm, visible: v })} />
                    </>
                  )}

                  {/* Class Item */}
                  {editingTarget.type === "classItem" && (
                    <>
                      <Field label="Class Name" value={modalForm.name} onChange={(v) => setModalForm({ ...modalForm, name: v })} />
                      <Field label="Focus" value={modalForm.focus} onChange={(v) => setModalForm({ ...modalForm, focus: v })} />
                      <Field
                        label="Subjects (format: Name|Type|Hours per line)"
                        value={modalForm.subjects}
                        onChange={(v) => setModalForm({ ...modalForm, subjects: v })}
                        textarea
                        rows={4}
                        placeholder="English Grammar & Reader|Compulsory|6 hrs/wk"
                      />
                      <Field
                        label="Curriculum Highlights (one per line)"
                        value={modalForm.curriculumHighlights}
                        onChange={(v) => setModalForm({ ...modalForm, curriculumHighlights: v })}
                        textarea
                        rows={3}
                      />
                      <Field label="Assessment Method" value={modalForm.assessmentMethod} onChange={(v) => setModalForm({ ...modalForm, assessmentMethod: v })} textarea rows={2} />
                      <Toggle label="Show this class" checked={modalForm.visible !== false} onChange={(v) => setModalForm({ ...modalForm, visible: v })} />
                    </>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-7">
                  {canDeleteSelected && (
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(editingTarget)}
                      disabled={saving}
                      className="sm:w-auto px-5 py-3 rounded-2xl text-sm font-black transition-all hover:-translate-y-0.5 disabled:opacity-60 inline-flex items-center justify-center gap-2"
                      style={{ background: "rgba(215,25,32,0.08)", color: "#D71920", border: "1px solid rgba(215,25,32,0.18)" }}
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setEditingTarget(null)}
                    disabled={saving}
                    className="flex-1 py-3 rounded-2xl text-sm font-black transition-all hover:-translate-y-0.5 disabled:opacity-60"
                    style={{ background: "rgba(15,23,42,0.06)", color: "rgba(15,23,42,0.65)", border: "1px solid rgba(15,23,42,0.08)" }}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={saveSelectedPart}
                    disabled={saving}
                    className="flex-1 py-3 rounded-2xl text-sm font-black transition-all hover:-translate-y-0.5 disabled:opacity-60 inline-flex items-center justify-center gap-2"
                    style={{ background: "linear-gradient(135deg, #FACC15, #38BDF8)", color: "#020617", boxShadow: "0 16px 38px rgba(56,189,248,0.24)" }}
                  >
                    <Save className="w-4 h-4" />
                    {saving ? "Saving..." : "Save This Item"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====================================================
          DELETE CONFIRMATION
          ==================================================== */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-5"
            style={{ background: "rgba(2,6,23,0.62)", backdropFilter: "blur(14px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !saving && setDeleteTarget(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              className="w-full max-w-md rounded-[28px] bg-white overflow-hidden"
              style={{ boxShadow: "0 42px 110px rgba(0,0,0,0.32)", border: "1px solid rgba(255,255,255,0.75)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-5">
                  <Trash2 className="w-6 h-6" />
                </div>

                <h3 className="text-2xl font-black text-slate-950 mb-2">Are you sure?</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-6">
                  This will permanently delete this item from the Academics page.
                </p>

                <div className="flex gap-3">
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => setDeleteTarget(null)}
                    className="flex-1 py-3 rounded-2xl text-sm font-black disabled:opacity-60"
                    style={{ background: "rgba(15,23,42,0.06)", color: "rgba(15,23,42,0.68)", border: "1px solid rgba(15,23,42,0.08)" }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => {
                      const target = deleteTarget;
                      deleteTargetItem(target);
                    }}
                    className="flex-1 py-3 rounded-2xl text-sm font-black disabled:opacity-60 inline-flex items-center justify-center gap-2"
                    style={{ background: "linear-gradient(135deg, #D71920, #991B1B)", color: "#FFFFFF", boxShadow: "0 16px 38px rgba(215,25,32,0.24)" }}
                  >
                    <Trash2 className="w-4 h-4" />
                    {saving ? "Deleting..." : "Yes, Delete"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}