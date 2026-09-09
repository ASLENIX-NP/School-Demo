import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Camera,
  Clock3,
  GraduationCap,
  Mail,
  Pencil,
  Plus,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const ACCENTS = [
  { name: "burgundy", solid: "#A62B4F", soft: "rgba(166,43,79,0.14)" },
  { name: "gold", solid: "#C79A3B", soft: "rgba(199,154,59,0.14)" },
  { name: "green", solid: "#3F6652", soft: "rgba(63,102,82,0.14)" },
  { name: "plum", solid: "#5C3B52", soft: "rgba(92,59,82,0.14)" },
  { name: "rose", solid: "#B64A63", soft: "rgba(182,74,99,0.14)" },
];

export function accentFor(index = 0) {
  return ACCENTS[index % ACCENTS.length];
}

export const colors = {
  navy: "#15111A",
  primary: "#A62B4F",
  slate: "#786C72",
  light: "#F5EEE2",
  white: "#FFFFFF",
  burgundy: "#24131F",
  gold: "#C79A3B",
  cream: "#FBF7EF",
  text: "#211824",
};

export const defaultStaffContent = {
  badgeText: "Our Faculty",
  title: "The People Behind Every Student's Journey",
  highlightedWord: "Student's Journey",
  subtitle:
    "Meet the teachers and school leaders who help our students learn with confidence, curiosity, and purpose.",
  staff: [
    {
      id: 1, name: "Sarita Bhandari Dahal", position: "Principal", category: "School Leadership",
      imageUrl: "", imageZoom: 1, imageOffsetX: 0, imageOffsetY: 0,
      email: "", subjects: "School Leadership", grades: "All Grades", experience: "",
      philosophy: "Every student deserves patient guidance, high expectations, and the confidence to grow.",
      description: "Sarita Bhandari Dahal leads the school community with a focus on strong learning, student care, teacher collaboration, and a positive school culture.", visible: true, accentColor: ""
    },
    {
      id: 2, name: "Ashwin Sigdel", position: "Teacher", category: "Computer & Technology Department",
      imageUrl: "", imageZoom: 1, imageOffsetX: 0, imageOffsetY: 0,
      email: "", subjects: "Computer", grades: "Grades 6–10", experience: "",
      philosophy: "Technology becomes meaningful when students learn to use it creatively, confidently, and responsibly.",
      description: "Ashwin helps students develop practical computer knowledge and digital skills through clear lessons connected to everyday technology.", visible: true, accentColor: ""
    },
    {
      id: 3, name: "Pradip Acharya", position: "Teacher", category: "Social Studies Department",
      imageUrl: "", imageZoom: 1, imageOffsetX: 0, imageOffsetY: 0,
      email: "", subjects: "Samajik and Hamro Hetauda", grades: "Grades 8–10", experience: "",
      philosophy: "Learning about society should help students understand their community and become thoughtful citizens.",
      description: "Pradip connects Social Studies with local community life, helping students explore society, citizenship, culture, and the world around them.", visible: true, accentColor: ""
    },
    {
      id: 4, name: "Purnima Pokhrel", position: "Teacher", category: "Science Department",
      imageUrl: "", imageZoom: 1, imageOffsetX: 0, imageOffsetY: 0,
      email: "", subjects: "Science and Environment Science", grades: "Grades 6–7 and 9–10", experience: "",
      philosophy: "Science is best understood when students observe carefully, ask questions, and connect ideas with the real world.",
      description: "Purnima encourages students to explore scientific ideas through observation, explanation, practical thinking, and connections to the environment.", visible: true, accentColor: ""
    },
    {
      id: 5, name: "Nikita Phayal", position: "Teacher", category: "English Department",
      imageUrl: "", imageZoom: 1, imageOffsetX: 0, imageOffsetY: 0,
      email: "", subjects: "Our English", grades: "Grades 7–10", experience: "",
      philosophy: "Strong language skills give students the confidence to communicate clearly and express their ideas.",
      description: "Nikita supports students in developing English language skills, clear communication, reading ability, and confident expression.", visible: true, accentColor: ""
    },
    {
      id: 6, name: "Samjhana Sharma", position: "Teacher", category: "English Department",
      imageUrl: "", imageZoom: 1, imageOffsetX: 0, imageOffsetY: 0,
      email: "", subjects: "NNER and Wisdom English grammar", grades: "Grades 3–4", experience: "",
      philosophy: "Young learners gain confidence when language lessons are clear, engaging, and encouraging.",
      description: "Samjhana helps younger learners strengthen English grammar and language foundations through approachable lessons and regular practice.", visible: true, accentColor: ""
    },
    {
      id: 7, name: "Sumitra Shrestha", position: "Teacher", category: "Mathematics Department",
      imageUrl: "", imageZoom: 1, imageOffsetX: 0, imageOffsetY: 0,
      email: "", subjects: "Mathematics", grades: "Grades 2–4", experience: "",
      philosophy: "Mathematics should build curiosity, logical thinking, and confidence step by step.",
      description: "Sumitra builds strong early mathematics foundations by helping young learners understand numbers, patterns, calculations, and problem-solving.", visible: true, accentColor: ""
    },
    {
      id: 8, name: "Salina Rai", position: "Teacher", category: "Social Studies Department",
      imageUrl: "", imageZoom: 1, imageOffsetX: 0, imageOffsetY: 0,
      email: "", subjects: "Maths, Social, Hamro Hetauda", grades: "Class 5 Maths & Social; Class 6 Social; Class 7 Social & Hamro Hetauda", experience: "",
      philosophy: "Children learn deeply when lessons connect classroom ideas with the community and everyday life.",
      description: "Salina teaches across Mathematics and Social Studies while helping students connect classroom concepts with their community and local environment.", visible: true, accentColor: ""
    },
    {
      id: 9, name: "Sabita Thing", position: "Teacher", category: "English Department",
      imageUrl: "", imageZoom: 1, imageOffsetX: 0, imageOffsetY: 0,
      email: "", subjects: "Our English, Maxim Grammar and NNER", grades: "Class 6 Our English & Maxim Grammar; Class 5 NNER", experience: "",
      philosophy: "Good language learning grows through practice, understanding, and the confidence to communicate.",
      description: "Sabita supports students in English language and grammar while strengthening reading, communication, and classroom language skills.", visible: true, accentColor: ""
    },
    {
      id: 10, name: "Panjita Dulal", position: "Teacher", category: "Primary Department",
      imageUrl: "", imageZoom: 1, imageOffsetX: 0, imageOffsetY: 0,
      email: "", subjects: "LKG Grade Teaching", grades: "LKG", experience: "",
      philosophy: "Early learning should feel safe, joyful, active, and full of encouragement.",
      description: "Panjita creates a supportive early-learning environment where young children can develop classroom habits, confidence, and foundational skills.", visible: true, accentColor: ""
    },
    {
      id: 11, name: "Sujita Rumba", position: "Teacher", category: "English Department",
      imageUrl: "", imageZoom: 1, imageOffsetX: 0, imageOffsetY: 0,
      email: "", subjects: "Wisdom English grammar and NNER", grades: "Grades 2–3", experience: "",
      philosophy: "Young students learn language best when grammar is practiced naturally through meaningful classroom activities.",
      description: "Sujita strengthens English grammar and foundational language skills for younger learners through structured practice and engaging activities.", visible: true, accentColor: ""
    },
    {
      id: 12, name: "Muna Maya Lama", position: "Teacher", category: "Science Department",
      imageUrl: "", imageZoom: 1, imageOffsetX: 0, imageOffsetY: 0,
      email: "", subjects: "Hamro Serophero and Science", grades: "Grades 2–3 Hamro Serophero; Grade 2 Science", experience: "",
      philosophy: "Children become curious learners when they can discover how the world around them works.",
      description: "Muna Maya Lama introduces young learners to science and their surrounding environment through simple explanations, observation, and everyday examples.", visible: true, accentColor: ""
    },
    {
      id: 13, name: "Nirjala Adhikari", position: "Teacher", category: "Language Department",
      imageUrl: "", imageZoom: 1, imageOffsetX: 0, imageOffsetY: 0,
      email: "", subjects: "Nepali and Hamro Hetauda", grades: "Grades 2–3 Nepali; Grades 4–5 Hamro Hetauda", experience: "",
      philosophy: "Language helps children understand their culture, community, and own voice.",
      description: "Nirjala develops Nepali language skills and supports learning about the local community through Hamro Hetauda.", visible: true, accentColor: ""
    },
    {
      id: 14, name: "Jeebika Kathayat", position: "Teacher", category: "Primary Department",
      imageUrl: "", imageZoom: 1, imageOffsetX: 0, imageOffsetY: 0,
      email: "", subjects: "UKG Grade Teaching", grades: "UKG", experience: "",
      philosophy: "A caring early classroom gives children the confidence to explore, participate, and learn.",
      description: "Jeebika supports UKG learners through age-appropriate classroom activities that build communication, independence, and foundational learning skills.", visible: true, accentColor: ""
    },
    {
      id: 15, name: "Nisha Devkota", position: "Teacher", category: "Primary Department",
      imageUrl: "", imageZoom: 1, imageOffsetX: 0, imageOffsetY: 0,
      email: "", subjects: "Nursery Grade Teaching", grades: "Nursery", experience: "",
      philosophy: "The earliest school experiences should make children feel secure, curious, and excited to learn.",
      description: "Nisha nurtures nursery learners through playful and supportive classroom experiences that help children begin their school journey with confidence.", visible: true, accentColor: ""
    },
    {
      id: 16, name: "Pratima Thapa", position: "Teacher", category: "Primary Department",
      imageUrl: "", imageZoom: 1, imageOffsetX: 0, imageOffsetY: 0,
      email: "", subjects: "Nursery Grade Teaching", grades: "Nursery", experience: "",
      philosophy: "Young children learn through care, repetition, exploration, and positive encouragement.",
      description: "Pratima supports nursery learners with a caring approach that encourages participation, early communication, classroom routines, and discovery.", visible: true, accentColor: ""
    },
    {
      id: 17, name: "Kalpana Ghimire", position: "Teacher", category: "Social Studies Department",
      imageUrl: "", imageZoom: 1, imageOffsetX: 0, imageOffsetY: 0,
      email: "", subjects: "Nepali and Social Studies", grades: "Grades 4–6 Nepali; Grade 5 Social Studies", experience: "",
      philosophy: "Students understand society better when learning encourages curiosity about people, culture, and community.",
      description: "Kalpana combines language and Social Studies learning to help students build communication skills and understand their community and society.", visible: true, accentColor: ""
    },
    {
      id: 18, name: "Kiran Dhital", position: "Teacher", category: "Primary Department",
      imageUrl: "", imageZoom: 1, imageOffsetX: 0, imageOffsetY: 0,
      email: "", subjects: "UKG Grade Teaching", grades: "UKG", experience: "",
      philosophy: "Young learners grow when classrooms combine structure, kindness, activity, and encouragement.",
      description: "Kiran supports UKG students as they develop early academic foundations, communication skills, independence, and positive classroom habits.", visible: true, accentColor: ""
    },
    {
      id: 19, name: "Shreejana Khatiwada", position: "Teacher", category: "English Department",
      imageUrl: "", imageZoom: 1, imageOffsetX: 0, imageOffsetY: 0,
      email: "", subjects: "Health, Hamro Hetauda, Our English and Maxim Grammar", grades: "Grade 8 Health; Grade 6 Hamro Hetauda; Grade 7 Our English & Maxim Grammar", experience: "",
      philosophy: "Students learn best when language and life skills are connected to meaningful situations.",
      description: "Shreejana teaches English and grammar alongside Health and Hamro Hetauda, helping students build communication skills and practical understanding.", visible: true, accentColor: ""
    },
    {
      id: 20, name: "Roseeka Subedi", position: "Teacher", category: "Science Department",
      imageUrl: "", imageZoom: 1, imageOffsetX: 0, imageOffsetY: 0,
      email: "", subjects: "Science and Mathematics", grades: "Grades 4–6 Science; Grade 5 Mathematics", experience: "",
      philosophy: "Learning becomes stronger when students can reason, investigate, and apply ideas across subjects.",
      description: "Roseeka teaches Science and Mathematics with an emphasis on clear understanding, practical examples, logical thinking, and problem-solving.", visible: true, accentColor: ""
    },
    {
      id: 21, name: "Hira Thakur", position: "Teacher", category: "Science Department",
      imageUrl: "", imageZoom: 1, imageOffsetX: 0, imageOffsetY: 0,
      email: "", subjects: "Health and Science", grades: "Grades 4–6 Health; Grade 4 Science", experience: "",
      philosophy: "Health and science learning should help children understand themselves and the world around them.",
      description: "Hira combines Health and Science lessons to help students develop practical knowledge, curiosity, and awareness of healthy everyday choices.", visible: true, accentColor: ""
    },
    {
      id: 22, name: "Ambika Silwal", position: "Teacher", category: "Language Department",
      imageUrl: "", imageZoom: 1, imageOffsetX: 0, imageOffsetY: 0,
      email: "", subjects: "Nepali", grades: "Grades 6–10", experience: "",
      philosophy: "Language education should strengthen expression, cultural understanding, creativity, and confidence.",
      description: "Ambika helps students develop strong Nepali language skills through reading, writing, communication, and appreciation of language and literature.", visible: true, accentColor: ""
    },
    {
      id: 23, name: "Susmita Humagain", position: "Teacher", category: "Social Studies Department",
      imageUrl: "", imageZoom: 1, imageOffsetX: 0, imageOffsetY: 0,
      email: "", subjects: "Social Studies and Nepali", grades: "Grades 4–5 Social; Grade 4 Nepali", experience: "",
      philosophy: "Students become thoughtful learners when they can connect language, society, and everyday experience.",
      description: "Susmita supports students in Social Studies and Nepali while encouraging discussion, communication, cultural awareness, and understanding of community life.", visible: true, accentColor: ""
    },
    {
      id: 24, name: "Monika Praja", position: "Teacher", category: "Science Department",
      imageUrl: "", imageZoom: 1, imageOffsetX: 0, imageOffsetY: 0,
      email: "", subjects: "Science and Health", grades: "Grades 8–10 Science; Grades 6–7 Health", experience: "",
      philosophy: "Scientific knowledge becomes valuable when students can use it to understand real situations and make informed choices.",
      description: "Monika teaches Science and Health, helping students understand scientific concepts and apply learning to health, environment, and everyday life.", visible: true, accentColor: ""
    },
    {
      id: 25, name: "Sabina Lama", position: "Teacher", category: "Primary Department",
      imageUrl: "", imageZoom: 1, imageOffsetX: 0, imageOffsetY: 0,
      email: "", subjects: "LKG Grade Teaching", grades: "LKG", experience: "",
      philosophy: "Children learn confidently when early classrooms are welcoming, active, and consistent.",
      description: "Sabina supports LKG learners through age-appropriate activities that strengthen early academic, social, and communication foundations.", visible: true, accentColor: ""
    },
    {
      id: 26, name: "Rajanee Adhikari", position: "Teacher", category: "Mathematics Department",
      imageUrl: "", imageZoom: 1, imageOffsetX: 0, imageOffsetY: 0,
      email: "", subjects: "Mathematics", grades: "Grades 6–8", experience: "",
      philosophy: "Mathematics should encourage students to reason carefully, solve problems, and learn from mistakes.",
      description: "Rajanee develops students' mathematical reasoning and problem-solving skills through clear explanations, practice, and purposeful application.", visible: true, accentColor: ""
    },
    {
      id: 27, name: "Saarika Balami", position: "Teacher", category: "English Department",
      imageUrl: "", imageZoom: 1, imageOffsetX: 0, imageOffsetY: 0,
      email: "", subjects: "NNER, Wisdom English Grammar and Mathematics", grades: "Grades 4–5 NNER; Grade 2 Wisdom English Grammar; Grade 2 Mathematics", experience: "",
      philosophy: "Strong foundations across language and numeracy help children become confident independent learners.",
      description: "Saarika supports young learners across English, NNER, and Mathematics, building essential language, grammar, numeracy, and classroom learning skills.", visible: true, accentColor: ""
    },
    {
      id: 28, name: "Saraswati Mainali", position: "Teacher", category: "Primary Department",
      imageUrl: "", imageZoom: 1, imageOffsetX: 0, imageOffsetY: 0,
      email: "", subjects: "Grade 1 Teaching", grades: "Grade 1", experience: "",
      philosophy: "A strong first-grade foundation grows from patience, encouragement, curiosity, and consistent support.",
      description: "Saraswati helps Grade 1 learners establish strong early foundations while developing confidence, classroom routines, communication, and curiosity.", visible: true, accentColor: ""
    },
    {
      id: 29, name: "Jenisha Chuni Magar", position: "Teacher", category: "Science Department",
      imageUrl: "", imageZoom: 1, imageOffsetX: 0, imageOffsetY: 0,
      email: "", subjects: "Hamro Hetauda and Science", grades: "Grades 2–3 Hamro Hetauda; Grade 3 Science", experience: "",
      philosophy: "Children learn naturally when lessons help them explore the people, places, and world around them.",
      description: "Jenisha introduces young learners to Science and Hamro Hetauda through familiar examples, observation, discussion, and activities.", visible: true, accentColor: ""
    },
    {
      id: 30, name: "Laxmi Upreti", position: "Teacher", category: "Primary Department",
      imageUrl: "", imageZoom: 1, imageOffsetX: 0, imageOffsetY: 0,
      email: "", subjects: "Grade 1 Teaching", grades: "Grade 1", experience: "",
      philosophy: "Children flourish when their first learning experiences are caring, structured, and encouraging.",
      description: "Laxmi supports Grade 1 students as they build early academic skills, confidence, independence, and positive learning habits.", visible: true, accentColor: ""
    },
  ],
};

function clampNumber(value, min, max, fallback) {
  const numberValue = Number(value);

  if (!Number.isFinite(numberValue)) return fallback;

  return Math.min(max, Math.max(min, numberValue));
}

function getCategory(member = {}) {
  const savedCategory = String(member.category || "").trim();
  const legacyCategories = new Set([
    "Senior Teachers & Department Heads",
    "Primary & Junior Faculty",
    "Faculty Members",
  ]);

  /*
   * Keep newly created/admin-edited department names.
   * If the database still contains one of the old generic categories,
   * derive the correct school department from the teacher's position
   * and subjects instead of displaying the old grouping.
   */
  if (savedCategory && !legacyCategories.has(savedCategory)) {
    return savedCategory;
  }

  const text = `${member.position || ""} ${member.subjects || ""}`.toLowerCase();

  if (
    text.includes("principal") ||
    text.includes("administrator") ||
    text.includes("director") ||
    text.includes("leadership")
  ) {
    return "School Leadership";
  }

  if (text.includes("science") || text.includes("physics") || text.includes("chemistry")) {
    return "Science Department";
  }

  if (text.includes("math") || text.includes("mathematics")) {
    return "Mathematics Department";
  }

  if (text.includes("english")) {
    return "English Department";
  }

  if (text.includes("nepali") || text.includes("language") || text.includes("literature")) {
    return "Language Department";
  }

  if (
    text.includes("social") ||
    text.includes("history") ||
    text.includes("civics") ||
    text.includes("population")
  ) {
    return "Social Studies Department";
  }

  if (
    text.includes("computer") ||
    text.includes("technology") ||
    text.includes("ict")
  ) {
    return "Computer & Technology Department";
  }

  if (text.includes("primary") || text.includes("junior") || text.includes("child")) {
    return "Primary Department";
  }

  if (
    text.includes("support") ||
    text.includes("counsell") ||
    text.includes("counsel") ||
    text.includes("coordinator")
  ) {
    return "Student Support & Administration";
  }

  return "Faculty Members";
}

function normalizeStaff(staff) {
  if (!Array.isArray(staff) || staff.length === 0) {
    return defaultStaffContent.staff;
  }

  return staff.map((member, index) => ({
    ...(defaultStaffContent.staff[index] || {}),
    ...member,
    id: member.id || Date.now() + index,
    name: member.name || "Staff Member",
    position: member.position || "Teacher",
    category: getCategory(member),
    imageUrl: String(member.imageUrl || "").trim(),
    imageZoom: clampNumber(member.imageZoom, 1, 3, 1),
    imageOffsetX: clampNumber(member.imageOffsetX, -60, 60, 0),
    imageOffsetY: clampNumber(member.imageOffsetY, -60, 60, 0),
    email: member.email || "",
    subjects: member.subjects || "",
    grades: member.grades || "",
    experience: member.experience || "",
    philosophy: member.philosophy || "",
    description: member.description || "",
    visible: member.visible !== false,
    accentColor:
      typeof member.accentColor === "string"
        ? member.accentColor.trim()
        : "",
  }));
}

export function mergeStaffContent(saved = {}) {
  return {
    ...defaultStaffContent,
    ...(saved || {}),
    staff: normalizeStaff(saved?.staff),
  };
}

function getStaffImageStyle(staff = {}) {
  const zoom = clampNumber(staff.imageZoom, 1, 3, 1);
  const x = clampNumber(staff.imageOffsetX, -60, 60, 0);
  const y = clampNumber(staff.imageOffsetY, -60, 60, 0);

  return {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center",
    transform: `translate(${x}%, ${y}%) scale(${zoom})`,
    transformOrigin: "center center",
  };
}

function StaffImage({ staff, className = "" }) {
  const src = String(staff?.imageUrl || "").trim();
  const name = staff?.name || "Staff member";

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`w-full h-full object-cover ${className}`}
        style={getStaffImageStyle(staff)}
        loading="lazy"
      />
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center bg-[#E9DED0]">
      <UserRound className="w-16 h-16 text-[#BBAFA7]" />
    </div>
  );
}

function HeroPattern() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        opacity: 0.13,
        backgroundImage:
          "radial-gradient(circle, rgba(255,255,255,0.65) 1px, transparent 1.2px)",
        backgroundSize: "18px 18px",
        maskImage:
          "linear-gradient(to bottom, black 0%, black 65%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, black 0%, black 65%, transparent 100%)",
      }}
    />
  );
}

function SectionLabel({ children, light = false }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span
        className="w-10 h-px"
        style={{ background: light ? "#DDBE76" : colors.gold }}
      />
      <span
        className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.22em]"
        style={{ color: light ? "#E8CF98" : colors.primary }}
      >
        {children}
      </span>
    </div>
  );
}

function ActionButtons({
  editMode,
  target,
  onEditTarget,
  onDeleteTarget,
  canDelete = false,
  label = "Edit",
}) {
  if (!editMode) return null;

  return (
    <div className="absolute -top-2 -right-2 z-50 flex items-center gap-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300">
      <button
        type="button"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onEditTarget(target);
        }}
        className="rounded-full w-9 h-9 flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        style={{
          background: colors.white,
          color: colors.text,
          border: "1px solid #E5D8C8",
        }}
        title={label}
        aria-label={label}
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
          className="rounded-full w-9 h-9 flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          style={{
            background: "#FCE7E7",
            color: "#B3261E",
            border: "1px solid #F3CCCC",
          }}
          title="Delete"
          aria-label="Delete"
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
  onDeleteTarget = () => {},
  canDelete = false,
  label = "Edit",
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
        label={label}
      />
    </div>
  );
}

function AddStaffButton({ editMode, onAddTarget }) {
  if (!editMode) return null;

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onAddTarget("staffMember");
      }}
      className="mt-10 mx-auto flex items-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-bold shadow-lg hover:-translate-y-0.5 transition-all"
      style={{
        background: "linear-gradient(135deg, #24131F, #4A1C2E)",
        color: colors.white,
      }}
    >
      <Plus className="w-4 h-4" />
      Add Staff Member
    </button>
  );
}

const CATEGORY_ORDER = [
  "Science Department",
  "Mathematics Department",
  "English Department",
  "Language Department",
  "Social Studies Department",
  "Computer & Technology Department",
  "Primary Department",
  "School Leadership",
  "Student Support & Administration",
  "Support Staff",
];

const CATEGORY_DESCRIPTIONS = {
  "Science Department":
    "Exploring the world through experiments, observation, scientific thinking, and practical learning.",
  "Mathematics Department":
    "Building logical thinking, problem-solving skills, numerical confidence, and mathematical reasoning.",
  "English Department":
    "Developing strong communication, reading, writing, literature, and confident expression.",
  "Language Department":
    "Strengthening language, literature, creativity, cultural understanding, and communication.",
  "Social Studies Department":
    "Helping students understand society, history, geography, citizenship, culture, and their responsibilities.",
  "Computer & Technology Department":
    "Preparing students with digital literacy, computing skills, responsible technology use, and problem-solving.",
  "Primary Department":
    "Creating joyful, nurturing foundations where younger learners develop confidence and curiosity.",
  "School Leadership":
    "Leading the school community with vision, responsibility, care, and a commitment to student success.",
  "Student Support & Administration":
    "Supporting student wellbeing, communication, activities, and the systems that keep school life organised.",
  "Support Staff":
    "The people who help keep our school welcoming, organised, safe, and ready for learning.",
};
function groupStaffByCategory(staff) {
  const groups = new Map();

  staff.forEach((member) => {
    const category = getCategory(member);

    if (!groups.has(category)) {
      groups.set(category, []);
    }

    groups.get(category).push(member);
  });

  return [...groups.entries()].sort(([a], [b]) => {
    const ai = CATEGORY_ORDER.indexOf(a);
    const bi = CATEGORY_ORDER.indexOf(b);

    if (ai === -1 && bi === -1) return a.localeCompare(b);
    if (ai === -1) return 1;
    if (bi === -1) return -1;

    return ai - bi;
  });
}

function CategoryHeading({ category, count }) {
  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2.5">
            <span
              className="w-8 h-1 rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, #A62B4F, #C79A3B)",
              }}
            />

            <span
              className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em]"
              style={{ color: colors.primary }}
            >
              Faculty Directory
            </span>
          </div>

          <h3
            className="text-2xl sm:text-3xl leading-tight font-bold"
            style={{
              color: colors.text,
              fontFamily: "Georgia, 'Times New Roman', serif",
            }}
          >
            {category}
          </h3>

          <p
            className="mt-2.5 max-w-2xl text-sm leading-6"
            style={{ color: colors.slate }}
          >
            {CATEGORY_DESCRIPTIONS[category] ||
              "Meet the people who help our students learn, grow, and thrive."}
          </p>
        </div>

        <span
          className="shrink-0 rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-[0.15em]"
          style={{
            background: "#F1E5D5",
            color: "#806A5B",
            border: "1px solid #E3D5C3",
          }}
        >
          {count} {count === 1 ? "Member" : "Members"}
        </span>
      </div>
    </div>
  );
}

/* ============================================================
   CATEGORY FILTER BAR
   ------------------------------------------------------------
   Lets a visitor pick a department (Leadership, Math, English,
   etc.) and see just that group — like the reference screenshot
   — instead of scrolling past every category.
   ============================================================ */

function CategoryFilterBar({ categories, active, onSelect }) {
  return (
    <div className="rr-staff-filter-scroll flex items-center gap-2.5 overflow-x-auto pb-1">
      {categories.map(({ key, label, count }) => {
        const isActive = active === key;

        return (
          <button
            key={key}
            type="button"
            onClick={() => onSelect(key)}
            className="shrink-0 inline-flex items-center gap-2 rounded-full px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-bold tracking-wide transition-all duration-300 whitespace-nowrap"
            style={
              isActive
                ? {
                    background:
                      "linear-gradient(135deg, #8F2345, #B82E53)",
                    color: colors.white,
                    boxShadow: "0 10px 26px rgba(166,43,79,0.28)",
                  }
                : {
                    background: colors.white,
                    color: colors.text,
                    border: "1px solid #E7DCCF",
                  }
            }
          >
            {label}

            <span
              className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-black"
              style={
                isActive
                  ? {
                      background: "rgba(255,255,255,0.22)",
                      color: colors.white,
                    }
                  : { background: "#F1E5D5", color: "#806A5B" }
              }
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ============================================================
   STAFF POPUP
   ------------------------------------------------------------
   IMPORTANT:
   - This remains a popup/modal, UNCHANGED.
   - There is NO separate /staff/:id page.
   - Phone number has been removed from the popup.
   - Education/qualification has been removed from the popup.
   - Email remains clickable.
   - The popup itself owns the body scroll lock.
   ============================================================ */

function StaffPopup({ staff, onClose }) {
  useEffect(() => {
    if (!staff) return undefined;

    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;

    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
    };
  }, [staff, onClose]);

  const profile = staff
    ? {
        subjects:
          staff.subjects ||
          (getCategory(staff) === "Science Department"
            ? "Science"
            : getCategory(staff) === "Mathematics Department"
              ? "Mathematics"
              : getCategory(staff) === "English Department"
                ? "English Language & Literature"
                : "School Education"),
        grades: staff.grades || "Multiple Grades",
        experience: staff.experience || "Experienced educator",
        philosophy:
          staff.philosophy ||
          "Helping every student learn with confidence, curiosity, and purpose.",
      }
    : null;

  return (
    <AnimatePresence>
      {staff && (
        <motion.div
          className="fixed inset-0 z-[9999] overflow-y-auto overscroll-contain"
          style={{
            background: "rgba(24,17,23,0.78)",
            backdropFilter: "blur(9px)",
            WebkitBackdropFilter: "blur(9px)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <div className="min-h-full flex items-center justify-center p-3 sm:p-6">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={`${staff.name} profile`}
              onMouseDown={(event) => event.stopPropagation()}
              initial={{ opacity: 0, scale: 0.96, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 15 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 24,
              }}
              className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto overscroll-contain rounded-[28px] shadow-[0_35px_100px_rgba(0,0,0,0.35)]"
              style={{
                background: colors.cream,
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <button
                type="button"
                onClick={onClose}
                className="absolute right-4 top-4 z-30 w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
                style={{
                  background: "rgba(255,255,255,0.94)",
                  color: colors.text,
                }}
                aria-label="Close profile"
              >
                <X className="w-5 h-5" />
              </button>

              <div
                className="relative overflow-hidden px-6 sm:px-9 pt-7 sm:pt-8 pb-10"
                style={{
                  background:
                    "linear-gradient(135deg, #8F2345 0%, #B82E53 58%, #8E2746 100%)",
                }}
              >
                <div
                  className="absolute inset-0 opacity-[0.16]"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1.5px)",
                    backgroundSize: "17px 17px",
                  }}
                />

                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-5 pr-10">
                  <div
                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-[24px] overflow-hidden shrink-0"
                    style={{
                      background: "rgba(255,255,255,0.12)",
                      border: "2px solid rgba(255,255,255,0.55)",
                      boxShadow: "0 16px 35px rgba(0,0,0,0.18)",
                    }}
                  >
                    <StaffImage staff={staff} />
                  </div>

                  <div>
                    <div
                      className="inline-flex rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em]"
                      style={{
                        color: "#F0D99B",
                        background: "rgba(255,255,255,0.10)",
                        border: "1px solid rgba(255,255,255,0.16)",
                      }}
                    >
                      {getCategory(staff)}
                    </div>

                    <h2
                      className="mt-3 text-3xl sm:text-4xl font-bold"
                      style={{
                        color: "#FFFFFF",
                        fontFamily: "Georgia, 'Times New Roman', serif",
                      }}
                    >
                      {staff.name}
                    </h2>

                    <p
                      className="mt-1 text-sm sm:text-base font-semibold"
                      style={{ color: "rgba(255,255,255,0.78)" }}
                    >
                      {staff.position}
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-6 sm:px-9 py-7 sm:py-8">
                <div
                  className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6"
                >
                  <div
                    className="rounded-2xl p-4"
                    style={{
                      background: "#FFF9F0",
                      border: "1px solid #E9DCCB",
                    }}
                  >
                    <BookOpen
                      className="w-5 h-5 mb-2"
                      style={{ color: colors.primary }}
                    />
                    <p
                      className="text-[10px] font-black uppercase tracking-[0.16em]"
                      style={{ color: colors.slate }}
                    >
                      Subjects
                    </p>
                    <p
                      className="mt-1 text-sm font-bold leading-5"
                      style={{ color: colors.text }}
                    >
                      {profile.subjects}
                    </p>
                  </div>

                  <div
                    className="rounded-2xl p-4"
                    style={{
                      background: "#FFF9F0",
                      border: "1px solid #E9DCCB",
                    }}
                  >
                    <GraduationCap
                      className="w-5 h-5 mb-2"
                      style={{ color: colors.gold }}
                    />
                    <p
                      className="text-[10px] font-black uppercase tracking-[0.16em]"
                      style={{ color: colors.slate }}
                    >
                      Grades
                    </p>
                    <p
                      className="mt-1 text-sm font-bold leading-5"
                      style={{ color: colors.text }}
                    >
                      {profile.grades}
                    </p>
                  </div>

                  <div
                    className="rounded-2xl p-4"
                    style={{
                      background: "#FFF9F0",
                      border: "1px solid #E9DCCB",
                    }}
                  >
                    <Clock3
                      className="w-5 h-5 mb-2"
                      style={{ color: "#6B7F67" }}
                    />
                    <p
                      className="text-[10px] font-black uppercase tracking-[0.16em]"
                      style={{ color: colors.slate }}
                    >
                      Experience
                    </p>
                    <p
                      className="mt-1 text-sm font-bold leading-5"
                      style={{ color: colors.text }}
                    >
                      {profile.experience}
                    </p>
                  </div>
                </div>


                {staff.description && (
                  <div
                    className="rounded-2xl px-5 py-4 mb-5"
                    style={{
                      background: "#F7F0E6",
                      border: "1px solid #E9DCCB",
                    }}
                  >
                    <p
                      className="text-[10px] font-black uppercase tracking-[0.2em] mb-2"
                      style={{ color: colors.primary }}
                    >
                      About the Teacher
                    </p>
                    <p
                      className="text-sm sm:text-base leading-7"
                      style={{ color: "#6F6268" }}
                    >
                      {staff.description}
                    </p>
                  </div>
                )}

                <div
                  className="rounded-2xl px-5 py-4 mb-5"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(166,43,79,0.07), rgba(199,154,59,0.08))",
                    border: "1px solid #E9DCCB",
                  }}
                >
                  <p
                    className="text-[10px] font-black uppercase tracking-[0.2em] mb-2"
                    style={{ color: colors.primary }}
                  >
                    Teaching Philosophy
                  </p>
                  <p
                    className="text-sm sm:text-base leading-7"
                    style={{ color: colors.text }}
                  >
                    “{profile.philosophy}”
                  </p>
                </div>

                {/* EMAIL ONLY — phone number intentionally omitted from the popup. */}
                {staff.email && (
                  <div
                    className="rounded-2xl p-5"
                    style={{
                      background: "#FFF9F0",
                      border: "1px solid #E9DCCB",
                    }}
                  >
                    <p
                      className="text-[10px] font-black uppercase tracking-[0.2em] mb-3"
                      style={{ color: colors.primary }}
                    >
                      Contact
                    </p>

                    <a
                      href={`mailto:${staff.email}`}
                      className="flex items-center gap-3 p-3 rounded-xl hover:-translate-y-0.5 transition-transform"
                      style={{
                        background: "#F5EEE3",
                        color: colors.text,
                      }}
                    >
                      <span
                        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                        style={{
                          background: "#F0E1BE",
                          color: "#8A681E",
                        }}
                      >
                        <Mail className="w-4 h-4" />
                      </span>

                      <span className="text-sm font-medium break-all">
                        {staff.email}
                      </span>
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
/* ============================================================
   STAFF GRID CARD
   ------------------------------------------------------------
   Compact photo card used inside the filtered directory grid —
   replaces the old full-width alternating card layout with a
   tidy, scannable grid (matches the "pick a department, browse
   photos" pattern from the reference screenshot).
   ============================================================ */

function StaffGridCard({
  staff,
  realIndex,
  editMode,
  onEditTarget,
  onDeleteTarget,
  onOpenProfile,
}) {
  const accent = staff.accentColor || accentFor(realIndex).solid;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4 }}
      className="group relative"
    >
      <div
        onClick={() => {
          if (!editMode) onOpenProfile(staff);
        }}
        role={!editMode ? "button" : undefined}
        tabIndex={!editMode ? 0 : undefined}
        onKeyDown={(event) => {
          if (!editMode && (event.key === "Enter" || event.key === " ")) {
            event.preventDefault();
            onOpenProfile(staff);
          }
        }}
        className={`relative overflow-hidden rounded-[22px] bg-white border transition-all duration-300 ${
          !editMode
            ? "cursor-pointer hover:-translate-y-1.5 hover:shadow-[0_20px_45px_rgba(54,39,31,0.16)]"
            : ""
        }`}
        style={{
          borderColor: "#E7DCCF",
          boxShadow: "0 10px 28px rgba(54,39,31,0.07)",
        }}
      >
        <div className="relative aspect-[4/5] overflow-hidden">
          <StaffImage
            staff={staff}
            className="transition-transform duration-500 group-hover:scale-105"
          />

          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(24,14,20,0.74) 0%, rgba(24,14,20,0.08) 52%, transparent 72%)",
            }}
          />

          <div className="absolute left-0 right-0 bottom-0 p-3.5 sm:p-4">
            <span
              className="inline-block h-[3px] w-7 rounded-full mb-2"
              style={{ background: accent }}
            />

            <h4
              className="text-white text-sm sm:text-base font-bold leading-tight"
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
              }}
            >
              {staff.name}
            </h4>

            <p
              className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.1em] truncate"
              style={{ color: "#F1D58E" }}
            >
              {staff.position}
            </p>
          </div>

          {editMode && (
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();

                onEditTarget({
                  type: "staffImage",
                  index: realIndex,
                });
              }}
              className="absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
              style={{
                background: colors.white,
                color: colors.text,
                border: "1px solid #E5D8C8",
              }}
              title="Change staff photo"
              aria-label="Change staff photo"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          )}

          <ActionButtons
            editMode={editMode}
            target={{ type: "staffCard", index: realIndex }}
            onEditTarget={onEditTarget}
            onDeleteTarget={onDeleteTarget}
            canDelete
            label="Edit staff member"
          />
        </div>

      </div>
    </motion.div>
  );
}

export function Staff({
  editMode = false,
  contentOverride = null,
  onEditTarget = () => {},
  onDeleteTarget = () => {},
  onAddTarget = () => {},
}) {
  const [content, setContent] = useState(() =>
    mergeStaffContent(
      contentOverride || defaultStaffContent
    )
  );

  const [selectedStaff, setSelectedStaff] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    /*
     * STAFF DATA IS KEPT DIRECTLY IN THIS FILE.
     *
     * The public Staff page no longer fetches /api/site-content/staff.
     * This prevents old database/default records from replacing the
     * teacher list defined above.
     *
     * contentOverride is still supported so the existing admin editor
     * can temporarily provide edited content without changing the
     * public page architecture.
     */
    setContent(
      mergeStaffContent(
        contentOverride || defaultStaffContent
      )
    );
  }, [contentOverride]);

  /*
   * IMPORTANT:
   * There is intentionally NO second body-scroll-lock effect here.
   *
   * Previously Staff itself locked body overflow while selectedStaff
   * was open, while StaffPopup also locked it. Both effects restored
   * document.body.style.overflow independently, which could leave
   * the page stuck at overflow:hidden after closing the popup.
   *
   * StaffPopup is now the single owner of the scroll lock.
   */

  const visibleStaff = useMemo(
    () =>
      content.staff.filter(
        (staff) => staff.visible !== false
      ),
    [content.staff]
  );

  const groupedStaff = useMemo(
    () => groupStaffByCategory(visibleStaff),
    [visibleStaff]
  );

  /* Reset the filter if the currently selected category no longer
     exists (e.g. an admin renamed/removed it while editing). */
  useEffect(() => {
    if (activeCategory === "All") return;

    const stillExists = groupedStaff.some(
      ([category]) => category === activeCategory
    );

    if (!stillExists) {
      setActiveCategory("All");
    }
  }, [groupedStaff, activeCategory]);

  const filterCategories = useMemo(() => {
    const items = groupedStaff.map(([category, members]) => ({
      key: category,
      label: category,
      count: members.length,
    }));

    return [
      { key: "All", label: "All Staff", count: visibleStaff.length },
      ...items,
    ];
  }, [groupedStaff, visibleStaff.length]);

  const displayedGroups = useMemo(() => {
    /*
     * IMPORTANT:
     * "All Staff" must be one single directory/grid.
     *
     * Do NOT render one section per department while All Staff is
     * selected. Departments are only separated after the visitor
     * clicks a specific department filter.
     */
    if (activeCategory === "All") {
      return [["All Staff", visibleStaff]];
    }

    return groupedStaff.filter(
      ([category]) => category === activeCategory
    );
  }, [groupedStaff, visibleStaff, activeCategory]);

  const title =
    content.title ||
    "The People Behind Every Student's Journey";

  const highlight =
    content.highlightedWord &&
    title.includes(content.highlightedWord)
      ? content.highlightedWord
      : null;

  const titleParts = highlight
    ? title.split(highlight)
    : [title, ""];

  const titleBefore = titleParts[0] || "";
  const titleAfter = titleParts[1] || "";

  return (
    <section
      className={`relative overflow-hidden ${
        editMode
          ? "py-8 px-3 sm:px-6"
          : "pt-24 pb-24 sm:pt-28"
      }`}
      style={{ background: colors.cream }}
    >
      <style>
        {`
          @media (max-width: 767px) {
            .staff-page-safe {
              overflow-x: hidden;
            }
          }

          .rr-staff-filter-scroll::-webkit-scrollbar {
            display: none;
          }

          .rr-staff-filter-scroll {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }

          @media (prefers-reduced-motion: reduce) {
            .staff-page-safe *,
            .staff-page-safe *::before,
            .staff-page-safe *::after {
              animation-duration: 0.001ms !important;
              transition-duration: 0.001ms !important;
            }
          }
        `}
      </style>

      <div className="staff-page-safe">
        <div className="relative z-10 max-w-[1260px] mx-auto px-4 sm:px-7">
          {/* ========================================================
              HERO
             ======================================================== */}
          <EditableWrap
            editMode={editMode}
            target={{ type: "pageHeader" }}
            onEditTarget={onEditTarget}
            label="Edit staff heading"
          >
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="relative overflow-hidden rounded-[34px] min-h-[430px] sm:min-h-[470px] flex items-center"
              style={{
                background:
                  "linear-gradient(135deg, #FDEDEE 0%, #FBD9DC 50%, #F6C3C8 100%)",
                boxShadow:
                  "0 28px 70px rgba(169,45,77,0.14)",
              }}
            >
              <HeroPattern />

              <div className="relative z-10 w-full px-7 sm:px-12 lg:px-16 py-14 sm:py-16">
                <div className="max-w-[900px]">
                  <SectionLabel>
                    {content.badgeText || "Our Faculty"}
                  </SectionLabel>

                  <h1
                    className="text-4xl sm:text-5xl lg:text-[64px] leading-[1.02] tracking-[-0.035em] font-bold"
                    style={{
                      color: "#211523",
                      fontFamily:
                        "Georgia, 'Times New Roman', serif",
                    }}
                  >
                    {titleBefore}

                    {highlight && (
                      <span style={{ color: "#A92D4D" }}>
                        {highlight}
                      </span>
                    )}

                    {titleAfter}
                  </h1>

                  <p
                    className="mt-7 max-w-2xl text-base sm:text-lg leading-8"
                    style={{
                      color: "#76686D",
                    }}
                  >
                    {content.subtitle}
                  </p>

                  <div
                    className="mt-8 inline-flex items-center gap-2 rounded-full px-4 py-2 border"
                    style={{
                      borderColor:
                        "rgba(169,45,77,0.22)",
                      background:
                        "rgba(255,255,255,0.38)",
                    }}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ background: "#A92D4D" }}
                    />

                    <span
                      className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em]"
                      style={{ color: "#8B5361" }}
                    >
                      Dedicated to every learner
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </EditableWrap>

          {/* ========================================================
              OUR PEOPLE — NO STATISTICS
             ======================================================== */}
          <div className="max-w-[1050px] mx-auto pt-24 sm:pt-32 pb-10">
            <SectionLabel>Our People</SectionLabel>

            <div className="max-w-[800px]">
              <h2
                className="text-3xl sm:text-4xl lg:text-5xl leading-[1.08] font-bold"
                style={{
                  color: colors.text,
                  fontFamily:
                    "Georgia, 'Times New Roman', serif",
                }}
              >
                Educators who make a difference{" "}
                <span style={{ color: colors.primary }}>
                  every day.
                </span>
              </h2>

              <p
                className="mt-5 max-w-2xl text-sm sm:text-base leading-7"
                style={{ color: colors.slate }}
              >
                Browse our school team by department. Select a department above to quickly find its teachers and leaders.
              </p>
            </div>
          </div>

          {/* ========================================================
              DEPARTMENT FILTER — pick a group to browse
             ======================================================== */}
          <div className="max-w-[1050px] mx-auto pb-10 sm:pb-12">
            <CategoryFilterBar
              categories={filterCategories}
              active={activeCategory}
              onSelect={setActiveCategory}
            />
          </div>

          {/* ========================================================
              STAFF DIRECTORY
              --------------------------------------------------------
              All Staff = one combined grid.
              A department = that department's grid only.
             ======================================================== */}
          <div className="max-w-[1050px] mx-auto space-y-16 sm:space-y-20">
            {displayedGroups.map(
              ([category, members]) => (
                <section key={category}>
                  {activeCategory === "All" ? (
                    <div className="mb-6 sm:mb-8">
                      <div className="flex flex-wrap items-end justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2.5">
                            <span
                              className="w-8 h-1 rounded-full"
                              style={{
                                background:
                                  "linear-gradient(90deg, #A62B4F, #C79A3B)",
                              }}
                            />

                            <span
                              className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em]"
                              style={{ color: colors.primary }}
                            >
                              Faculty Directory
                            </span>
                          </div>

                          <h3
                            className="text-2xl sm:text-3xl leading-tight font-bold"
                            style={{
                              color: colors.text,
                              fontFamily: "Georgia, 'Times New Roman', serif",
                            }}
                          >
                            All Staff
                          </h3>

                          <p
                            className="mt-2.5 max-w-2xl text-sm leading-6"
                            style={{ color: colors.slate }}
                          >
                            Meet the teachers, leaders, and support team who
                            make up our school community.
                          </p>
                        </div>

                        <span
                          className="shrink-0 rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-[0.15em]"
                          style={{
                            background: "#F1E5D5",
                            color: "#806A5B",
                            border: "1px solid #E3D5C3",
                          }}
                        >
                          {members.length}{" "}
                          {members.length === 1 ? "Member" : "Members"}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <CategoryHeading
                      category={category}
                      count={members.length}
                    />
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {members.map((staff, index) => {
                      const realIndex =
                        content.staff.findIndex(
                          (member) =>
                            String(member.id) ===
                            String(staff.id)
                        );

                      return (
                        <StaffGridCard
                          key={staff.id}
                          staff={staff}
                          realIndex={
                            realIndex === -1
                              ? index
                              : realIndex
                          }
                          editMode={editMode}
                          onEditTarget={onEditTarget}
                          onDeleteTarget={onDeleteTarget}
                          onOpenProfile={setSelectedStaff}
                        />
                      );
                    })}
                  </div>
                </section>
              )
            )}

            {displayedGroups.length === 0 && (
              <div
                className="rounded-3xl p-12 text-center"
                style={{
                  background: colors.white,
                  border: "1px solid #E7DCCF",
                }}
              >
                <p
                  className="text-sm font-semibold"
                  style={{ color: colors.slate }}
                >
                  No staff members in this department yet.
                </p>
              </div>
            )}
          </div>

          <AddStaffButton
            editMode={editMode}
            onAddTarget={onAddTarget}
          />

          {/* ========================================================
              CLOSING STATEMENT
             ======================================================== */}
          {!editMode && (
            <div
              className="max-w-[1050px] mx-auto mt-20 sm:mt-28 rounded-[30px] p-9 sm:p-12 text-center relative overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, #24131F 0%, #431B2D 100%)",
                boxShadow:
                  "0 22px 55px rgba(45,25,36,0.16)",
              }}
            >
              <HeroPattern />

              <div className="relative z-10">
                <div
                  className="text-4xl mb-3"
                  style={{
                    color: "#DABF79",
                    fontFamily:
                      "Georgia, 'Times New Roman', serif",
                  }}
                >
                  “
                </div>

                <h3
                  className="text-2xl sm:text-3xl font-bold"
                  style={{
                    color: colors.white,
                    fontFamily:
                      "Georgia, 'Times New Roman', serif",
                  }}
                >
                  Every student deserves someone who believes in them.
                </h3>

                <p
                  className="mt-4 max-w-2xl mx-auto text-sm sm:text-base leading-7"
                  style={{
                    color: "rgba(255,255,255,0.68)",
                  }}
                >
                  That is the standard we bring to our classrooms,
                  corridors, activities, and every student interaction.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Popup stays on THIS page. No separate teacher page. Unchanged. */}
      {!editMode && (
        <StaffPopup
          staff={selectedStaff}
          onClose={() => setSelectedStaff(null)}
        />
      )}
    </section>
  );
}

export default Staff;