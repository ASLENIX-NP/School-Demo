// Facilities.jsx
import { useEffect, useState } from "react";
import api from "../lib/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bus,
  Camera,
  MapPin,
  Pencil,
  Plus,
  Trash2,
  X,
  School,
  Monitor,
  FlaskConical,
  Library,
  Trophy,
  Palette,
  Presentation,
  BusFront,
  ShieldCheck,
  Sparkles,
  HeartHandshake,
  Lightbulb,
  Brain,
  Users,
  HandHeart,
  Mic2,
} from "lucide-react";

// ---------------------------------------------------------------------
// Palette
// ---------------------------------------------------------------------
const palette = {
  primary: "#2A1023",
  secondary: "#3D6B54",
  accent: "#D7AD55",
  accent2: "#A92D4D",
  light: "#F6EFE2",
  dark: "#211523",
  gray: "#76686D",
  lightGray: "#E9DED0",
  white: "#FFFFFF",
  gradient1: "linear-gradient(135deg, #2A1023 0%, #42152C 100%)",
  gradient2: "linear-gradient(135deg, #D7AD55 0%, #EFD89B 100%)",
  gradient3: "linear-gradient(135deg, #A92D4D 0%, #2A1023 100%)",
};

const facilityTints = [
  palette.primary,
  palette.secondary,
  palette.accent2,
  "#8B5CF6",
  "#14B8A6",
  palette.primary,
];

// ---------------------------------------------------------------------
// Default content
// ---------------------------------------------------------------------
export const FACILITIES_CONTENT_VERSION = 2;

export const defaultFacilitiesContent = {
  facilitiesVersion: FACILITIES_CONTENT_VERSION,
  badgeText: "Our School",
  title: "Creating an environment where students can learn, explore, create, and grow.",
  highlightedText: "learn",
  subtitle:
    "At Red Rose English Boarding School, we strive to provide a safe, supportive, and stimulating learning environment where students can develop academically, physically, socially, and creatively. Our facilities are designed to complement classroom learning and encourage students to explore their interests and talents.",
  learnMoreText: "Learn More",
  highlightsTitle: "Facility Highlights",

  introBadge: "School Facilities",
  introTitle: "Spaces where learning comes to life.",
  introHighlightedText: "learning",
  introDescription:
    "Our facilities are more than buildings and equipment. They are spaces where learning comes to life. We continually work to improve our learning environment and provide students with opportunities to learn through experience, technology, creativity, collaboration, and participation.",

  sectionKicker: "Our Key Facilities",
  sectionTitle: "Facilities Designed For Student Growth",
  sectionHighlightedText: "Student Growth",
  sectionSubtitle:
    "Explore the facilities, learning opportunities, and supportive spaces that help our students learn, grow, create, communicate, and participate with confidence.",

  approachTitle: "Our Approach",
  approachDescription:
    "Facilities are more than buildings and equipment—they are spaces where learning comes to life. We continually work to improve our learning environment and provide students with opportunities to learn through experience, technology, creativity, collaboration, and participation.",

  facilities: [
    {
      id: 1,
      title: "Modern Classrooms",
      category: "Learning Spaces",
      description:
        "Bright, comfortable, and learning-focused classrooms that support interactive teaching and active participation.",
      details:
        "The classrooms provide a comfortable and supportive setting for everyday learning, encouraging students to participate actively, interact with lessons, and develop their understanding with confidence.",
      imageUrl: "",
      imageZoom: 1,
      imageOffsetX: 0,
      imageOffsetY: 0,
      visible: true,
      color: palette.primary,
    },
    {
      id: 2,
      title: "Computer & ICT Facilities",
      category: "Technology & Digital Learning",
      description:
        "Technology-supported learning spaces that help students develop essential digital skills.",
      details:
        "The computer and ICT facilities give students opportunities to use technology as part of their learning and build practical digital skills needed for study and everyday life.",
      imageUrl: "",
      imageZoom: 1,
      imageOffsetX: 0,
      imageOffsetY: 0,
      visible: true,
      color: palette.secondary,
    },
    {
      id: 3,
      title: "Science Laboratory",
      category: "Practical Learning",
      description:
        "Practical learning facilities where students can observe, experiment, and connect theoretical knowledge with real-world applications.",
      details:
        "The science laboratory allows students to observe scientific processes, carry out experiments, and connect what they learn in class with practical and real-world applications.",
      imageUrl: "",
      imageZoom: 1,
      imageOffsetX: 0,
      imageOffsetY: 0,
      visible: true,
      color: palette.accent2,
    },
    {
      id: 4,
      title: "Library & Reading Resources",
      category: "Knowledge & Reading",
      description:
        "A learning space that encourages reading, research, independent learning, and intellectual curiosity.",
      details:
        "The library and reading resources provide students with a dedicated space to read, research, study independently, explore information, and develop intellectual curiosity.",
      imageUrl: "",
      imageZoom: 1,
      imageOffsetX: 0,
      imageOffsetY: 0,
      visible: true,
      color: "#8B5CF6",
    },
    {
      id: 5,
      title: "Sports & Recreation",
      category: "Fitness & Recreation",
      description:
        "Facilities and spaces that encourage physical fitness, teamwork, discipline, and healthy competition.",
      details:
        "Sports and recreation facilities encourage students to stay physically active while developing teamwork, discipline, cooperation, confidence, and a healthy sense of competition.",
      imageUrl: "",
      imageZoom: 1,
      imageOffsetX: 0,
      imageOffsetY: 0,
      visible: true,
      color: "#14B8A6",
    },
    {
      id: 6,
      title: "Creative & Cultural Activities",
      category: "Arts & Culture",
      description:
        "Opportunities and spaces for art, music, cultural activities, performances, and creative expression.",
      details:
        "Students have opportunities to explore art, music, cultural activities, performances, and creative expression while discovering and developing their individual talents.",
      imageUrl: "",
      imageZoom: 1,
      imageOffsetX: 0,
      imageOffsetY: 0,
      visible: true,
      color: palette.primary,
    },
    {
      id: 7,
      title: "Multipurpose Spaces",
      category: "School Events",
      description:
        "Suitable spaces for assemblies, presentations, workshops, competitions, celebrations, and school events.",
      details:
        "Multipurpose spaces provide flexible venues for assemblies, presentations, workshops, competitions, celebrations, and other activities that bring the school community together.",
      imageUrl: "",
      imageZoom: 1,
      imageOffsetX: 0,
      imageOffsetY: 0,
      visible: true,
      color: palette.secondary,
    },
    {
      id: 8,
      title: "Transportation",
      category: "Safety & Convenience",
      description:
        "School transportation designed to support convenient and organized student travel.",
      details:
        "The school's transportation service is designed to support convenient and organized student travel and make daily journeys to and from school easier for students and families.",
      imageUrl: "",
      imageZoom: 1,
      imageOffsetX: 0,
      imageOffsetY: 0,
      visible: true,
      color: palette.accent2,
      // Official Bus Route-2083 routes supplied by the school.
      // These are defaults only: routes added/edited from Admin are preserved.
      busRoutes: [
        {
          id: "bus-1",
          name: "Bus 1",
          from: "School",
          to: "Ghyampe",
          stops: ["Ghyampe", "Sano Gangate"],
        },
        {
          id: "bus-2",
          name: "Bus 2",
          from: "School",
          to: "Buddha Chowk",
          stops: ["Buddha Chowk", "Gairi Gaun"],
        },
        {
          id: "bus-3",
          name: "Bus 3",
          from: "School",
          to: "Jatey",
          stops: ["Jatey", "Panesh"],
        },
        {
          id: "bus-4",
          name: "Bus 4",
          from: "School",
          to: "Hatilet",
          stops: ["Hatilet", "Jarung"],
        },
      ],
    },
    {
      id: 9,
      title: "Safety & Security",
      category: "Student Safety",
      description:
        "A secure school environment with appropriate safety measures to ensure students can learn with confidence.",
      details:
        "Safety and security are an important part of school life, with appropriate measures intended to provide students with a secure, supportive, and confident learning environment.",
      imageUrl: "",
      imageZoom: 1,
      imageOffsetX: 0,
      imageOffsetY: 0,
      visible: true,
      color: "#8B5CF6",
    },
    {
      id: 10,
      title: "Clean & Hygienic Environment",
      category: "Health & Wellbeing",
      description:
        "Well-maintained facilities that promote cleanliness, hygiene, and student well-being.",
      details:
        "A clean and hygienic environment helps maintain student wellbeing and provides comfortable, well-maintained spaces for learning and daily school activities.",
      imageUrl: "",
      imageZoom: 1,
      imageOffsetX: 0,
      imageOffsetY: 0,
      visible: true,
      color: "#14B8A6",
    },
    {
      id: 11,
      title: "Child-Friendly Environment",
      category: "Student Wellbeing",
      description:
        "A safe, caring, welcoming, and supportive atmosphere where every child feels respected, valued, and comfortable expressing themselves.",
      details:
        "The school aims to provide a safe and caring atmosphere where every child feels respected and valued and can express themselves comfortably and confidently.",
      imageUrl: "",
      imageZoom: 1,
      imageOffsetX: 0,
      imageOffsetY: 0,
      visible: true,
      color: palette.primary,
    },
    {
      id: 12,
      title: "Activity-Based Learning",
      category: "Learning Approach",
      description:
        "Learning through activities, experiments, projects, games, discussions, and practical experiences to make education engaging and meaningful.",
      details:
        "Activity-based learning allows students to learn through participation, experiments, projects, games, discussions, and practical experiences, making education more engaging and meaningful.",
      imageUrl: "",
      imageZoom: 1,
      imageOffsetX: 0,
      imageOffsetY: 0,
      visible: true,
      color: palette.secondary,
    },
    {
      id: 13,
      title: "Critical Thinking & Problem Solving",
      category: "Skills Development",
      description:
        "Classroom practices that encourage students to ask questions, analyze situations, find solutions, and think independently.",
      details:
        "Students are encouraged to ask questions, analyze situations, explore solutions, and think independently so they can approach challenges thoughtfully.",
      imageUrl: "",
      imageZoom: 1,
      imageOffsetX: 0,
      imageOffsetY: 0,
      visible: true,
      color: palette.accent2,
    },
    {
      id: 14,
      title: "Collaborative Learning",
      category: "Team Learning",
      description:
        "Group activities and peer interaction that develop communication, cooperation, leadership, and interpersonal skills.",
      details:
        "Collaborative learning gives students opportunities to work together, share ideas, communicate clearly, cooperate on tasks, and develop leadership and interpersonal skills.",
      imageUrl: "",
      imageZoom: 1,
      imageOffsetX: 0,
      imageOffsetY: 0,
      visible: true,
      color: "#8B5CF6",
    },
    {
      id: 15,
      title: "Values-Based Education",
      category: "Character & Values",
      description:
        "Emphasis on discipline, responsibility, respect, kindness, honesty, and other values that contribute to responsible citizenship.",
      details:
        "Values-based education emphasizes discipline, responsibility, respect, kindness, honesty, and other positive values that help students develop responsible and respectful character.",
      imageUrl: "",
      imageZoom: 1,
      imageOffsetX: 0,
      imageOffsetY: 0,
      visible: true,
      color: "#14B8A6",
    },
    {
      id: 16,
      title: "Presentation & Communication Opportunities",
      category: "Confidence & Communication",
      description:
        "Activities that help students build confidence, communication skills, leadership, and public-speaking abilities.",
      details:
        "Students receive opportunities to present ideas, communicate with others, build confidence, develop leadership skills, and become more comfortable with public speaking.",
      imageUrl: "",
      imageZoom: 1,
      imageOffsetX: 0,
      imageOffsetY: 0,
      visible: true,
      color: palette.primary,
    },
  ],
};

// ---------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------
function clampNumber(value, min, max, fallback) {
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue)) return fallback;
  return Math.min(max, Math.max(min, numberValue));
}

function getFacilityImageStyle(facility = {}) {
  const zoom = clampNumber(facility.imageZoom, 1, 3, 1);
  const x = clampNumber(facility.imageOffsetX, -60, 60, 0);
  const y = clampNumber(facility.imageOffsetY, -60, 60, 0);
  const objectX = Math.min(100, Math.max(0, 50 - x));
  const objectY = Math.min(100, Math.max(0, 50 - y));
  return {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: `${objectX}% ${objectY}%`,
    transform: `scale(${zoom})`,
    transformOrigin: "center center",
  };
}

function isTransportationFacility(facility = {}) {
  const title = String(facility?.title || "").trim().toLowerCase();

  return (
    title === "transportation" ||
    title === "school transport" ||
    title === "transport"
  );
}

function getDefaultTransportationRoutes() {
  const transportation = defaultFacilitiesContent.facilities.find(
    (facility) => facility.title === "Transportation"
  );

  return Array.isArray(transportation?.busRoutes)
    ? transportation.busRoutes
    : [];
}

function normalizeBusRoutes(routes) {
  if (!Array.isArray(routes)) return [];

  return routes
    .filter(Boolean)
    .map((route, index) => ({
      id: route?.id ?? `bus-${index + 1}`,
      name: String(route?.name || `Bus ${index + 1}`),
      from: String(route?.from || ""),
      to: String(route?.to || ""),
      stops: Array.isArray(route?.stops)
        ? route.stops.filter(Boolean).map((stop) => String(stop))
        : [],
    }));
}

function normalizeFacilities(facilities, options = {}) {
  const savedList = Array.isArray(facilities) ? facilities : [];
  const isCurrentVersion = options.isCurrentVersion !== false;

  // IMPORTANT:
  // - Current saved facilities are used exactly as saved.
  // - We do NOT map old records onto the new defaults. That was the reason
  //   deleted/old facilities could appear again.
  // - Old/legacy facility content is replaced by the new school content only
  //   when the stored content has not been migrated to version 2.
  const sourceList =
    isCurrentVersion && savedList.length > 0
      ? savedList
      : defaultFacilitiesContent.facilities;

  const normalizedList = sourceList.map((facility, index) => {
    const fallback = defaultFacilitiesContent.facilities.find(
      (item) =>
        String(item?.title || "").trim().toLowerCase() ===
        String(facility?.title || "").trim().toLowerCase()
    ) || defaultFacilitiesContent.facilities[index % defaultFacilitiesContent.facilities.length];

    return {
      ...fallback,
      ...(facility || {}),
      id: facility?.id ?? fallback.id ?? `facility-${index + 1}`,
      title: String(facility?.title || fallback.title),
      category: String(facility?.category || fallback.category),
      description: String(facility?.description || fallback.description),
      details: String(facility?.details || fallback.details),
      imageUrl: "",
      imageZoom: clampNumber(facility?.imageZoom, 1, 3, 1),
      imageOffsetX: clampNumber(facility?.imageOffsetX, -60, 60, 0),
      imageOffsetY: clampNumber(facility?.imageOffsetY, -60, 60, 0),
      visible: facility?.visible !== false,
      busRoutes: Array.isArray(facility?.busRoutes) ? facility.busRoutes : [],
      color:
        facility?.color ||
        fallback?.color ||
        facilityTints[index % facilityTints.length],
      busRoutes: isTransportationFacility(facility)
        ? normalizeBusRoutes(
            Array.isArray(facility?.busRoutes) && facility.busRoutes.length > 0
              ? facility.busRoutes
              : fallback?.busRoutes?.length
                ? fallback.busRoutes
                : getDefaultTransportationRoutes()
          )
        : [],
    };
  });

  return normalizedList;
}

export function mergeFacilitiesContent(saved = {}, options = {}) {
  const raw = saved || {};
  const currentVersion =
    Number(raw.facilitiesVersion) === FACILITIES_CONTENT_VERSION;

  const useSavedFacilities =
    options.forceDefaults !== true && currentVersion && Array.isArray(raw.facilities);

  return {
    ...defaultFacilitiesContent,
    ...raw,
    facilitiesVersion: FACILITIES_CONTENT_VERSION,
    facilities: normalizeFacilities(
      useSavedFacilities ? raw.facilities : defaultFacilitiesContent.facilities,
      { isCurrentVersion: useSavedFacilities }
    ),
    approachTitle:
      raw?.approachTitle || defaultFacilitiesContent.approachTitle,
    approachDescription:
      raw?.approachDescription || defaultFacilitiesContent.approachDescription,
  };
}

function HighlightedTitle({ title, highlightedText }) {
  if (!highlightedText || !title.includes(highlightedText)) return <>{title}</>;
  const [before, after] = title.split(highlightedText);
  return (
    <>
      {before}
      <span style={{ color: palette.accent }}>{highlightedText}</span>
      {after}
    </>
  );
}

// ---------------------------------------------------------------------
// Shared editing chrome
// ---------------------------------------------------------------------
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
      className="absolute -top-2 -right-2 z-[90] opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 rounded-full w-8 h-8 flex items-center justify-center shadow-lg"
      style={{ background: palette.gradient2, color: palette.dark, border: `2px solid ${palette.white}` }}
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
      style={{ background: "#FCE4E4", color: "#B3261E", border: `2px solid ${palette.white}` }}
      title={label}
    >
      <Trash2 className="w-3.5 h-3.5" />
    </button>
  );
}

// Edit + delete grouped into ONE absolutely-positioned row, exactly like the
// Staff page's ActionButtons. This is what the standalone EditIconButton /
// DeleteIconButton pair above could not guarantee: when they're two separate
// elements at "-right-2" and "-right-12", the delete button sits further
// outside the card's box — if any ancestor has overflow-hidden (as the
// facility card did), that delete button gets silently clipped off while the
// edit button (closer to the edge) still shows. Grouping them removes that
// class of bug entirely, and pairs with removing overflow-hidden from the
// card container below.
function CardActionButtons({
  editMode,
  target,
  onEditTarget,
  onDeleteTarget,
  canDelete = false,
  label = "Edit",
  icon: Icon = Pencil,
}) {
  if (!editMode) return null;

  return (
    <div className="absolute -top-2 -right-2 z-[95] flex items-center gap-1.5 opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onEditTarget(target);
        }}
        className="rounded-full w-8 h-8 flex items-center justify-center shadow-lg"
        style={{ background: palette.gradient2, color: palette.dark, border: `2px solid ${palette.white}` }}
        title={label}
      >
        <Icon className="w-3.5 h-3.5" />
      </button>

      {canDelete && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDeleteTarget(target);
          }}
          className="rounded-full w-8 h-8 flex items-center justify-center shadow-lg"
          style={{ background: "#FCE4E4", color: "#B3261E", border: `2px solid ${palette.white}` }}
          title="Delete"
        >
          <Trash2 className="w-3.5 h-3.5" />
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

function AddFacilityButton({ editMode, onAddTarget }) {
  if (!editMode) return null;
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onAddTarget("facility");
      }}
      className="mt-10 mx-auto flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5"
      style={{ color: palette.white, background: palette.gradient1, boxShadow: "0 8px 24px rgba(30,58,95,0.25)" }}
    >
      <Plus className="w-4 h-4" />
      Add Facility
    </button>
  );
}

// ---------------------------------------------------------------------
// Shared visual building blocks
// ---------------------------------------------------------------------
function SectionHeader({ badge, title, highlightedText, description }) {
  return (
    <div className="text-left max-w-3xl mb-12 md:mb-16">
      <span
        className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide mb-4"
        style={{ background: "rgba(30, 58, 95, 0.08)", color: palette.primary }}
      >
        {badge}
      </span>
      <h1
        className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5"
        style={{ color: palette.dark, fontFamily: "var(--font-display)", letterSpacing: "-0.02em", lineHeight: 1.08 }}
      >
        <HighlightedTitle title={title} highlightedText={highlightedText} />
      </h1>
      {description && (
        <p className="text-lg leading-relaxed" style={{ color: palette.gray }}>
          {description}
        </p>
      )}
      <div className="w-16 h-1 rounded-full mt-6" style={{ background: palette.gradient2 }} />
    </div>
  );
}

function DecorativeBackdrop() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-5" style={{ background: palette.primary }} />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-5" style={{ background: palette.secondary }} />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-[0.02]"
        style={{ background: palette.accent }}
      />
    </div>
  );
}

function FacilityVisual({ facility, tint, displayNumber }) {
  const visualMap = {
    "Modern Classrooms": { Icon: School, word: "LEARNING", accent: "#D7AD55" },
    "Computer & ICT Facilities": { Icon: Monitor, word: "ICT & DIGITAL", accent: "#8FC7A6" },
    "Science Laboratory": { Icon: FlaskConical, word: "DISCOVER", accent: "#F0C878" },
    "Library & Reading Resources": { Icon: Library, word: "READ • RESEARCH", accent: "#D9B8C8" },
    "Sports & Recreation": { Icon: Trophy, word: "FITNESS & TEAMWORK", accent: "#D7AD55" },
    "Creative & Cultural Activities": { Icon: Palette, word: "ARTS & CULTURE", accent: "#D7AD55" },
    "Multipurpose Spaces": { Icon: Presentation, word: "SCHOOL EVENTS", accent: "#EFD89B" },
    "Transportation": { Icon: BusFront, word: "SAFE TRAVEL", accent: "#D7AD55" },
    "Safety & Security": { Icon: ShieldCheck, word: "SAFETY", accent: "#EFD89B" },
    "Clean & Hygienic Environment": { Icon: Sparkles, word: "CLEAN & HYGIENIC", accent: "#9ED5C0" },
    "Child-Friendly Environment": { Icon: HeartHandshake, word: "CARE & BELONGING", accent: "#F0C878" },
    "Activity-Based Learning": { Icon: Lightbulb, word: "LEARN BY DOING", accent: "#D7AD55" },
    "Critical Thinking & Problem Solving": { Icon: Brain, word: "THINK • SOLVE", accent: "#EFD89B" },
    "Collaborative Learning": { Icon: Users, word: "TOGETHER", accent: "#A9D8C1" },
    "Values-Based Education": { Icon: HandHeart, word: "VALUES", accent: "#F0C878" },
    "Presentation & Communication Opportunities": { Icon: Mic2, word: "COMMUNICATION", accent: "#D7AD55" },
  };

  const visual = visualMap[facility.title] || {
    Icon: Sparkles,
    word: facility.category || "OUR SCHOOL",
    accent: "#D7AD55",
  };

  const Icon = visual.Icon;

  return (
    <div
      className="facility-art"
      style={{
        "--facility-tint": tint,
        "--facility-accent": visual.accent,
      }}
      aria-label={`${facility.title} illustration`}
    >
      <div className="facility-art-grid" />
      <div className="facility-art-orbit facility-art-orbit-one" />
      <div className="facility-art-orbit facility-art-orbit-two" />

      <div className="facility-art-topline">
        <span>{String(displayNumber ?? facility.id).padStart(2, "0")}</span>
        <span>{visual.word}</span>
      </div>

      <div className="facility-art-center">
        <div className="facility-art-icon-ring">
          <Icon strokeWidth={1.25} />
        </div>
        <div className="facility-art-title">{facility.title}</div>
      </div>

      <div className="facility-art-bottomline">
        <span>RED ROSE</span>
        <span>SECONDARY ENGLISH SCHOOL</span>
      </div>
    </div>
  );
}

function BusRoutesDisplay({ routes }) {
  if (!routes || routes.length === 0) return null;

  return (
    <div className="mt-5 space-y-3">
      <div className="flex items-center gap-2">
        <Bus className="w-4 h-4" style={{ color: palette.secondary }} />
        <h4 className="font-bold text-sm" style={{ color: palette.dark }}>
          Available Bus Routes
        </h4>
        <span
          className="text-xs px-2 py-0.5 rounded-full font-semibold"
          style={{ background: "rgba(45,106,79,0.1)", color: palette.secondary }}
        >
          {routes.length} routes
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {routes.map((route) => (
          <div key={route.id} className="rounded-xl p-3.5" style={{ background: palette.light, border: `1px solid ${palette.lightGray}` }}>
            <div className="font-bold text-xs mb-1.5" style={{ color: palette.dark }}>
              {route.name}
            </div>
            <div className="flex items-center gap-1.5 text-xs mb-2 flex-wrap" style={{ color: palette.gray }}>
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span>{route.from || "Not set"}</span>
              <span>→</span>
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span>{route.to || "Not set"}</span>
            </div>
            {route.stops && route.stops.length > 0 && (
              <div className="space-y-1">
                {route.stops.map((stop, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs" style={{ color: palette.gray }}>
                    <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: palette.secondary }} />
                    {stop}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------
// Facilities page
// ---------------------------------------------------------------------
export function Facilities({
  editMode = false,
  contentOverride = null,
  onEditTarget = () => {},
  onDeleteTarget = () => {},
  onAddTarget = () => {},
}) {
  const [content, setContent] = useState(
    contentOverride
      ? mergeFacilitiesContent(contentOverride)
      : null
  );
  const [contentLoading, setContentLoading] = useState(!contentOverride);
  const [selectedFacility, setSelectedFacility] = useState(null);

  useEffect(() => {
    if (contentOverride) {
      const overrideVersion = Number(contentOverride?.facilitiesVersion);
      setContent(
        mergeFacilitiesContent(contentOverride, {
          forceDefaults: overrideVersion !== FACILITIES_CONTENT_VERSION,
        })
      );
      setContentLoading(false);
      return undefined;
    }

    let alive = true;

    const loadFacilitiesContent = async () => {
      try {
        const res = await api.get("/api/site-content/facilities", {
          timeout: 10000,
        });

        if (!alive) return;

        const saved = res.data?.data?.content || {};
        const savedVersion = Number(saved?.facilitiesVersion);

        setContent(
          mergeFacilitiesContent(saved, {
            forceDefaults: savedVersion !== FACILITIES_CONTENT_VERSION,
          })
        );
      } catch (error) {
        console.error("Facilities content load error:", error);
        if (alive) {
          setContent(mergeFacilitiesContent(defaultFacilitiesContent, {
            forceDefaults: true,
          }));
        }
      } finally {
        if (alive) setContentLoading(false);
      }
    };

    loadFacilitiesContent();

    return () => {
      alive = false;
    };
  }, [contentOverride]);

  useEffect(() => {
    if (editMode) return undefined;

    document.body.style.overflow = selectedFacility ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedFacility, editMode]);

  if (contentLoading || !content) {
    return (
      <section className="facilities-page">
        <style>{`
          .facilities-loading {
            min-height: 100vh;
            display: grid;
            place-items: center;
            padding: 40px 24px;
            background: #f6efe2;
          }
          .facilities-loading-card {
            width: min(720px, 100%);
            min-height: 300px;
            border-radius: 28px;
            background: #fffaf1;
            border: 1px solid rgba(42,16,35,.08);
            box-shadow: 0 22px 55px rgba(42,16,35,.08);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 16px;
          }
          .facilities-loading-mark {
            width: 42px;
            height: 42px;
            border-radius: 50%;
            border: 3px solid rgba(169,45,77,.14);
            border-top-color: #a92d4d;
            animation: facilities-spin .8s linear infinite;
          }
          .facilities-loading-text {
            color: #76686d;
            font: 800 10px/1.2 Arial, sans-serif;
            letter-spacing: .2em;
            text-transform: uppercase;
          }
          @keyframes facilities-spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
        <div className="facilities-loading">
          <div className="facilities-loading-card" aria-label="Loading facilities">
            <div className="facilities-loading-mark" />
            <div className="facilities-loading-text">Loading School Facilities</div>
          </div>
        </div>
      </section>
    );
  }

  // Transportation and Library are displayed in each other's positions.
  // Their stored IDs are NOT changed. Because numbering follows the
  // displayed order, Transportation becomes 04 and Library becomes 08.
  const visibleFacilities = [...content.facilities].filter(
    (facility) => facility.visible !== false
  );

  const transportationIndex = visibleFacilities.findIndex(
    isTransportationFacility
  );
  const libraryIndex = visibleFacilities.findIndex(
    (facility) => facility?.title === "Library & Reading Resources"
  );

  if (
    transportationIndex >= 0 &&
    libraryIndex >= 0 &&
    transportationIndex !== libraryIndex
  ) {
    [visibleFacilities[transportationIndex], visibleFacilities[libraryIndex]] = [
      visibleFacilities[libraryIndex],
      visibleFacilities[transportationIndex],
    ];
  }

  const getFacilityDisplayNumber = (_facility, index) => index + 1;

  const getFacilityInitials = (title = "Facility") => {
    const words = title.trim().split(/\s+/).filter(Boolean);
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return `${words[0][0] || "F"}${words[1][0] || ""}`.toUpperCase();
  };

  return (
    <section className="facilities-page">
      <style>{`
        /* =========================================================
           RED ROSE FACILITIES PAGE
           Same visual family as About / Academics / Notices:
           cream background + burgundy hero + gold details.
        ========================================================= */

        .facilities-page {
          --rr-cream: #f6efe2;
          --rr-paper: #fffaf1;
          --rr-burgundy: #2a1023;
          --rr-burgundy-2: #42152c;
          --rr-red: #a92d4d;
          --rr-gold: #d7ad55;
          --rr-gold-light: #efd89b;
          --rr-ink: #211523;
          --rr-muted: #76686d;
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          background: var(--rr-cream);
          color: var(--rr-ink);
        }

        .facilities-page * {
          box-sizing: border-box;
        }

        .facilities-page::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: .22;
          background-image:
            radial-gradient(circle at 20% 10%, rgba(169,45,77,.08), transparent 26%),
            radial-gradient(circle at 90% 45%, rgba(215,173,85,.10), transparent 30%);
        }

        .facilities-shell {
          position: relative;
          z-index: 2;
          max-width: 1280px;
          margin: 0 auto;
          padding: 58px 24px 90px;
        }

        /* ================= HERO ================= */

        .facilities-hero {
          position: relative;
          min-height: 430px;
          overflow: hidden;
          border-radius: 0 0 34px 34px;
          padding: 70px 72px 88px;
          color: #211523;
          background:
            radial-gradient(circle at 85% 25%, rgba(169,45,77,.10), transparent 27%),
            radial-gradient(circle at 18% 80%, rgba(215,173,85,.10), transparent 30%),
            linear-gradient(135deg, #FDEDEE 0%, #FBD9DC 50%, #F6C3C8 100%);
          box-shadow: 0 26px 55px rgba(169,45,77,.14);
        }

        .facilities-hero::before {
          content: "";
          position: absolute;
          inset: 0;
          opacity: .30;
          pointer-events: none;
          background-image: radial-gradient(rgba(255,255,255,.18) 1px, transparent 1px);
          background-size: 15px 15px;
          mask-image: linear-gradient(to bottom, black, transparent 90%);
        }

        .facilities-hero::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: -1px;
          height: 28px;
          background: var(--rr-cream);
          clip-path: polygon(
            0 0, 2% 55%, 4% 0, 6% 55%, 8% 0, 10% 55%, 12% 0,
            14% 55%, 16% 0, 18% 55%, 20% 0, 22% 55%, 24% 0,
            26% 55%, 28% 0, 30% 55%, 32% 0, 34% 55%, 36% 0,
            38% 55%, 40% 0, 42% 55%, 44% 0, 46% 55%, 48% 0,
            50% 55%, 52% 0, 54% 55%, 56% 0, 58% 55%, 60% 0,
            62% 55%, 64% 0, 66% 55%, 68% 0, 70% 55%, 72% 0,
            74% 55%, 76% 0, 78% 55%, 80% 0, 82% 55%, 84% 0,
            86% 55%, 88% 0, 90% 55%, 92% 0, 94% 55%, 96% 0,
            98% 55%, 100% 0, 100% 100%, 0 100%
          );
        }

        .facilities-hero-inner {
          position: relative;
          z-index: 2;
          max-width: 820px;
        }

        .facilities-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          color: var(--rr-gold-light);
          font-size: 10px;
          font-weight: 900;
          letter-spacing: .24em;
          text-transform: uppercase;
        }

        .facilities-eyebrow::before {
          content: "";
          width: 42px;
          height: 1px;
          background: var(--rr-gold);
        }

        .facilities-hero h1 {
          margin: 22px 0 0;
          max-width: 800px;
          color: #211523;
          font-family: var(--font-display, Georgia, serif);
          font-size: clamp(48px, 7vw, 82px);
          font-weight: 700;
          line-height: .95;
          letter-spacing: -.045em;
        }

        .facilities-hero h1 .highlight {
          color: #A92D4D;
        }

        .facilities-hero-description {
          max-width: 720px;
          margin-top: 24px;
          color: #76686D;
          font-size: 16px;
          line-height: 1.75;
        }

        .facilities-hero-mark {
          position: absolute;
          z-index: 1;
          right: 8%;
          top: 50%;
          width: 185px;
          height: 185px;
          transform: translateY(-50%);
          display: grid;
          place-items: center;
          border: 1px solid rgba(215,173,85,.45);
          border-radius: 50%;
          color: var(--rr-gold-light);
          background: rgba(255,255,255,.025);
          box-shadow:
            inset 0 0 0 10px rgba(215,173,85,.045),
            inset 0 0 0 11px rgba(215,173,85,.22);
        }

        .facilities-hero-mark::before {
          content: "";
          position: absolute;
          inset: 17px;
          border: 1px dashed rgba(215,173,85,.35);
          border-radius: 50%;
        }

        .facilities-hero-mark strong {
          position: relative;
          z-index: 2;
          font-family: var(--font-display, Georgia, serif);
          font-size: 48px;
          letter-spacing: .05em;
        }

        .facilities-hero-mark span {
          position: absolute;
          bottom: 37px;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: .32em;
          text-transform: uppercase;
        }

        /* ================= INTRO ================= */

        .facilities-intro {
          display: grid;
          grid-template-columns: minmax(0, .8fr) minmax(0, 1.2fr);
          gap: 65px;
          align-items: center;
          padding: 82px 38px 72px;
        }

        .facilities-intro-label {
          color: var(--rr-red);
          font-size: 10px;
          font-weight: 900;
          letter-spacing: .22em;
          text-transform: uppercase;
        }

        .facilities-intro-title {
          margin-top: 14px;
          font-family: var(--font-display, Georgia, serif);
          font-size: clamp(34px, 4.3vw, 56px);
          line-height: 1;
          letter-spacing: -.04em;
          color: var(--rr-ink);
        }

        .facilities-intro-title span {
          color: var(--rr-red);
        }

        .facilities-intro-copy {
          color: var(--rr-muted);
          font-size: 16px;
          line-height: 1.85;
        }

        .facilities-intro-rule {
          width: 54px;
          height: 2px;
          margin-top: 22px;
          background: var(--rr-gold);
        }

        /* ================= FACILITY LIST ================= */

        .facilities-section-head {
          text-align: center;
          margin-bottom: 38px;
        }

        .facilities-section-kicker {
          color: var(--rr-red);
          font-size: 10px;
          font-weight: 900;
          letter-spacing: .24em;
          text-transform: uppercase;
        }

        .facilities-section-title {
          margin-top: 11px;
          color: var(--rr-ink);
          font-family: var(--font-display, Georgia, serif);
          font-size: clamp(34px, 4vw, 50px);
          line-height: 1;
          letter-spacing: -.04em;
        }

        .facilities-section-title span {
          color: var(--rr-red);
        }

        .facilities-section-subtitle {
          max-width: 650px;
          margin: 14px auto 0;
          color: var(--rr-muted);
          font-size: 14px;
          line-height: 1.7;
        }

        .facilities-list {
          display: flex;
          flex-direction: column;
          gap: 26px;
        }

        .facility-row {
          position: relative;
          display: grid;
          grid-template-columns: minmax(0, .95fr) minmax(0, 1.05fr);
          min-height: 310px;
          overflow: visible;
          border: 1px solid rgba(169,45,77,.13);
          border-radius: 28px;
          background: rgba(255,250,241,.82);
          box-shadow: 0 18px 40px rgba(56,31,43,.07);
          transition: transform .3s ease, box-shadow .3s ease;
        }

        .facility-row.reverse {
          grid-template-columns: minmax(0, 1.05fr) minmax(0, .95fr);
        }

        .facility-row:hover {
          transform: translateY(-5px);
          box-shadow: 0 25px 50px rgba(56,31,43,.11);
        }

        /*
         * The complete facility container is clickable on the public page.
         * Admin edit mode is excluded, so editing controls continue to work
         * normally without opening the details popup.
         */
        .facility-clickable {
          -webkit-tap-highlight-color: transparent;
        }

        .facility-clickable:focus-visible {
          outline: 3px solid rgba(215,173,85,.65);
          outline-offset: 4px;
        }

        .facility-row-image {
          position: relative;
          min-height: 310px;
          overflow: hidden;
          border-radius: 28px 0 0 28px;
          background: var(--rr-burgundy);
        }

        .facility-row.reverse .facility-row-image {
          order: 2;
          border-radius: 0 28px 28px 0;
        }

        .facility-row-image > div,
        .facility-row-image img {
          transition: transform .65s cubic-bezier(.22,1,.36,1);
        }

        /* =========================================================
           SIMPLE FACILITY VISUALS
           No bubbles, orbit rings, circles, or stock photographs.
        ========================================================= */

        .facility-art {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 310px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          background:
            linear-gradient(145deg,
              color-mix(in srgb, var(--facility-tint) 92%, #000 8%),
              color-mix(in srgb, var(--facility-tint) 58%, #211523 42%)
            );
        }

        .facility-art-grid,
        .facility-art-orbit {
          display: none;
        }

        .facility-art-topline,
        .facility-art-bottomline {
          position: absolute;
          z-index: 3;
          left: 24px;
          right: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: rgba(255,255,255,.72);
          font-size: 8px;
          font-weight: 900;
          letter-spacing: .18em;
          text-transform: uppercase;
        }

        .facility-art-topline { top: 22px; }
        .facility-art-bottomline { bottom: 21px; opacity: .62; }

        .facility-art-topline span:first-child {
          color: rgba(255,255,255,.92);
          font-family: Georgia, serif;
          font-size: 13px;
        }

        .facility-art-center {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 30px;
        }

        .facility-art-icon-ring {
          width: 78px;
          height: 78px;
          display: grid;
          place-items: center;
          border: 0;
          border-radius: 0;
          background: transparent;
          box-shadow: none;
        }

        .facility-art-icon-ring::before {
          display: none;
        }

        .facility-art-icon-ring svg {
          width: 62px;
          height: 62px;
          color: var(--facility-accent);
          filter: none;
        }

        .facility-art-title {
          max-width: 310px;
          margin-top: 17px;
          color: rgba(255,255,255,.92);
          font-family: var(--font-display, Georgia, serif);
          font-size: clamp(19px, 2.1vw, 26px);
          line-height: 1.08;
          letter-spacing: -.025em;
        }


        .facility-row-image::after {
          content: none;
        }

        .facility-row-badge {
          position: absolute;
          z-index: 4;
          left: 22px;
          top: 22px;
          padding: 8px 12px;
          border: 1px solid rgba(255,255,255,.28);
          border-radius: 999px;
          color: white;
          background: rgba(22,13,25,.65);
          backdrop-filter: blur(10px);
          font-size: 9px;
          font-weight: 900;
          letter-spacing: .14em;
          text-transform: uppercase;
        }

        .facility-row-number {
          position: absolute;
          z-index: 4;
          left: 22px;
          bottom: 20px;
          color: rgba(255,255,255,.75);
          font-family: var(--font-display, Georgia, serif);
          font-size: 44px;
          line-height: .8;
        }

        .facility-row-content {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 42px 48px;
        }

        .facility-row-content::before {
          content: "";
          position: absolute;
          left: 0;
          top: 42px;
          width: 3px;
          height: 60px;
          background: var(--rr-gold);
          border-radius: 0 4px 4px 0;
        }

        .facility-row.reverse .facility-row-content::before {
          left: auto;
          right: 0;
        }

        .facility-category {
          color: var(--rr-red);
          font-size: 9px;
          font-weight: 900;
          letter-spacing: .2em;
          text-transform: uppercase;
        }

        .facility-row-title {
          margin-top: 10px;
          color: var(--rr-ink);
          font-family: var(--font-display, Georgia, serif);
          font-size: clamp(27px, 3vw, 40px);
          line-height: 1.02;
          letter-spacing: -.035em;
        }

        .facility-row-description {
          margin-top: 15px;
          max-width: 560px;
          color: var(--rr-muted);
          font-size: 13px;
          line-height: 1.75;
        }

        .facility-bus-teaser {
          width: fit-content;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          margin-top: 14px;
          padding: 8px 11px;
          border: 1px solid rgba(169,45,77,.14);
          border-radius: 999px;
          color: var(--rr-red);
          background: rgba(169,45,77,.055);
          font-size: 9px;
          font-weight: 900;
          letter-spacing: .08em;
          text-transform: uppercase;
        }

        .facility-bus-teaser-arrow {
          color: var(--rr-gold);
          font-size: 12px;
        }

        .facility-learn {
          width: fit-content;
          margin-top: 21px;
          padding: 10px 0;
          border: 0;
          border-bottom: 1px solid rgba(169,45,77,.35);
          color: var(--rr-red);
          background: transparent;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: .13em;
          text-transform: uppercase;
          cursor: pointer;
          transition: .25s ease;
        }

        .facility-learn:hover {
          color: var(--rr-burgundy);
          border-color: var(--rr-gold);
          padding-right: 8px;
        }

        .facility-admin-image {
          position: absolute;
          z-index: 12;
          top: 16px;
          left: 16px;
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border: 0;
          border-radius: 50%;
          color: var(--rr-burgundy);
          background: white;
          box-shadow: 0 8px 20px rgba(0,0,0,.18);
          opacity: 0;
          transform: translateY(4px);
          cursor: pointer;
          transition: .22s ease;
        }

        .facility-row-image:hover .facility-admin-image,
        .facility-row-image:focus-within .facility-admin-image {
          opacity: 1;
          transform: translateY(0);
        }

        /* ================= OUR APPROACH ================= */

        .facilities-approach {
          position: relative;
          margin-top: 82px;
          padding: 58px 58px 62px;
          overflow: hidden;
          border: 1px solid rgba(169,45,77,.13);
          border-radius: 28px;
          background:
            radial-gradient(circle at 90% 20%, rgba(215,173,85,.13), transparent 30%),
            linear-gradient(135deg, #fffaf1 0%, #f5eadb 100%);
          box-shadow: 0 18px 42px rgba(56,31,43,.07);
        }

        .facilities-approach::after {
          content: "";
          position: absolute;
          right: -90px;
          bottom: -110px;
          width: 280px;
          height: 280px;
          border: 1px solid rgba(169,45,77,.12);
          border-radius: 50%;
          box-shadow:
            0 0 0 24px rgba(169,45,77,.025),
            0 0 0 48px rgba(215,173,85,.025);
          pointer-events: none;
        }

        .facilities-approach-kicker {
          position: relative;
          z-index: 2;
          color: var(--rr-red);
          font-size: 10px;
          font-weight: 900;
          letter-spacing: .24em;
          text-transform: uppercase;
        }

        .facilities-approach-title {
          position: relative;
          z-index: 2;
          max-width: 850px;
          margin-top: 14px;
          color: var(--rr-ink);
          font-family: var(--font-display, Georgia, serif);
          font-size: clamp(32px, 4vw, 52px);
          line-height: 1.04;
          letter-spacing: -.04em;
        }

        .facilities-approach-title span {
          color: var(--rr-red);
        }

        .facilities-approach-copy {
          position: relative;
          z-index: 2;
          max-width: 900px;
          margin-top: 20px;
          color: var(--rr-muted);
          font-size: 15px;
          line-height: 1.85;
        }

        /* ================= ADD BUTTON ================= */

        .facilities-add {
          display: flex;
          width: fit-content;
          align-items: center;
          gap: 8px;
          margin: 32px auto 0;
          padding: 13px 20px;
          border: 0;
          border-radius: 999px;
          color: white;
          background: var(--rr-burgundy);
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 12px 25px rgba(42,16,35,.18);
        }

        /* ================= MODAL ================= */

        .facility-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 22px;
          background: rgba(27,17,25,.78);
          backdrop-filter: blur(7px);
        }

        .facility-modal {
          position: relative;
          width: min(780px, 100%);
          max-height: 88vh;
          overflow-y: auto;
          border-radius: 0 0 28px 28px;
          background: var(--rr-paper);
          box-shadow: 0 40px 110px rgba(0,0,0,.38);
        }

        .facility-modal-header {
          position: relative;
          min-height: 205px;
          overflow: hidden;
          padding: 40px 52px 54px;
          color: white;
          background:
            radial-gradient(circle at 78% 22%, rgba(255,255,255,.10), transparent 20%),
            linear-gradient(135deg, #9d2848 0%, #c23859 55%, #8e2342 100%);
        }

        .facility-modal-header::before {
          content: "";
          position: absolute;
          inset: 0;
          opacity: .28;
          background-image: radial-gradient(rgba(255,255,255,.32) 1px, transparent 1px);
          background-size: 13px 13px;
        }

        .facility-modal-header::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: -1px;
          height: 30px;
          background: var(--rr-paper);
          clip-path: polygon(
            0 0, 2.5% 65%, 5% 0, 7.5% 65%, 10% 0, 12.5% 65%,
            15% 0, 17.5% 65%, 20% 0, 22.5% 65%, 25% 0, 27.5% 65%,
            30% 0, 32.5% 65%, 35% 0, 37.5% 65%, 40% 0, 42.5% 65%,
            45% 0, 47.5% 65%, 50% 0, 52.5% 65%, 55% 0, 57.5% 65%,
            60% 0, 62.5% 65%, 65% 0, 67.5% 65%, 70% 0, 72.5% 65%,
            75% 0, 77.5% 65%, 80% 0, 82.5% 65%, 85% 0, 87.5% 65%,
            90% 0, 92.5% 65%, 95% 0, 97.5% 65%, 100% 0,
            100% 100%, 0 100%
          );
        }

        .facility-modal-quote {
          position: absolute;
          top: 24px;
          left: 38px;
          color: rgba(255,255,255,.32);
          font-family: Georgia, serif;
          font-size: 58px;
          line-height: .5;
        }

        .facility-modal-kicker {
          position: relative;
          z-index: 2;
          color: rgba(255,255,255,.72);
          font-size: 9px;
          font-weight: 900;
          letter-spacing: .25em;
          text-transform: uppercase;
        }

        .facility-modal-profile {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 14px;
          margin-top: 23px;
        }

        .facility-modal-initials {
          display: grid;
          place-items: center;
          width: 58px;
          height: 58px;
          flex-shrink: 0;
          border: 3px solid rgba(255,255,255,.78);
          border-radius: 50%;
          color: var(--rr-burgundy);
          background: var(--rr-gold-light);
          font-family: Georgia, serif;
          font-size: 18px;
          font-weight: 900;
          box-shadow: 0 7px 18px rgba(54,13,30,.22);
        }

        .facility-modal-profile h3 {
          color: white;
          font-family: var(--font-display, Georgia, serif);
          font-size: 24px;
          line-height: 1;
          letter-spacing: -.02em;
        }

        .facility-modal-profile p {
          margin-top: 5px;
          color: rgba(255,255,255,.70);
          font-size: 9px;
          font-weight: 900;
          letter-spacing: .18em;
          text-transform: uppercase;
        }

        .facility-modal-close {
          position: absolute;
          z-index: 20;
          top: 16px;
          right: 18px;
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255,255,255,.35);
          border-radius: 50%;
          color: white;
          background: rgba(255,255,255,.12);
          cursor: pointer;
          transition: .25s ease;
        }

        .facility-modal-close:hover {
          background: rgba(255,255,255,.22);
          transform: rotate(90deg);
        }

        .facility-modal-body {
          position: relative;
          padding: 8px 48px 38px;
        }

        .facility-modal-title {
          color: var(--rr-ink);
          font-family: var(--font-display, Georgia, serif);
          font-size: clamp(30px, 4vw, 43px);
          line-height: 1.05;
          letter-spacing: -.04em;
        }

        .facility-modal-rule {
          width: 52px;
          height: 2px;
          margin: 13px 0 18px;
          background: var(--rr-gold);
        }

        .facility-modal-description {
          color: var(--rr-muted);
          font-size: 14px;
          line-height: 1.8;
        }

        .facility-modal-paper {
          margin-top: 22px;
          padding: 20px 22px;
          border: 1px solid rgba(169,45,77,.13);
          border-radius: 18px;
          background: #fbf4e8;
        }

        .facility-modal-paper-label {
          color: var(--rr-red);
          font-size: 9px;
          font-weight: 900;
          letter-spacing: .2em;
          text-transform: uppercase;
        }

        .facility-modal-paper p {
          margin-top: 8px;
          color: var(--rr-ink);
          font-size: 13px;
          line-height: 1.75;
        }

        .facility-routes {
          margin-top: 20px;
        }

        .facility-routes-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .facility-routes-title {
          color: var(--rr-red);
          font-size: 9px;
          font-weight: 900;
          letter-spacing: .2em;
          text-transform: uppercase;
        }

        .facility-routes-count {
          padding: 4px 8px;
          border-radius: 999px;
          color: #704c58;
          background: #f8eee4;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: .08em;
          text-transform: uppercase;
        }

        .facility-routes-note {
          margin-top: 5px;
          color: #927e84;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: .12em;
          text-transform: uppercase;
        }

        .facility-routes-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          margin-top: 10px;
        }

        .facility-route-card {
          padding: 15px;
          border: 1px solid rgba(169,45,77,.11);
          border-radius: 16px;
          background: white;
          box-shadow: 0 5px 14px rgba(42,16,35,.035);
        }

        .facility-route-name {
          color: var(--rr-ink);
          font-size: 12px;
          font-weight: 900;
          margin-bottom: 12px;
        }

        .facility-route-field {
          display: grid;
          grid-template-columns: 86px minmax(0, 1fr);
          gap: 8px;
          align-items: start;
          padding: 7px 0;
          border-top: 1px solid rgba(169,45,77,.07);
        }

        .facility-route-field:first-of-type {
          border-top: 0;
          padding-top: 0;
        }

        .facility-route-field-label {
          color: var(--rr-red);
          font-size: 8px;
          font-weight: 900;
          letter-spacing: .12em;
          text-transform: uppercase;
        }

        .facility-route-field-value {
          color: var(--rr-muted);
          font-size: 10px;
          font-weight: 700;
          line-height: 1.5;
          word-break: break-word;
        }

        .facility-route-stops {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
        }

        .facility-route-stop {
          padding: 4px 7px;
          border-radius: 999px;
          color: #704c58;
          background: #f8eee4;
          font-size: 8px;
          font-weight: 800;
        }

        .facility-modal-footer {
          margin-top: 25px;
          padding-top: 16px;
          border-top: 1px solid rgba(169,45,77,.12);
          color: #927e84;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: .12em;
          text-transform: uppercase;
        }

        /* ================= ADMIN EDIT OUTLINE ================= */

        .facilities-edit-card {
          border: 2px dashed rgba(169,45,77,.38) !important;
        }

        @media (max-width: 900px) {
          .facilities-shell {
            padding: 35px 18px 70px;
          }

          .facilities-hero {
            padding: 54px 36px 76px;
          }

          .facilities-hero-mark {
            right: 4%;
            width: 145px;
            height: 145px;
            opacity: .72;
          }

          .facilities-intro {
            grid-template-columns: 1fr;
            gap: 22px;
            padding: 60px 20px 52px;
          }

          .facility-row,
          .facility-row.reverse {
            grid-template-columns: 1fr;
          }

          .facility-row-image,
          .facility-row.reverse .facility-row-image {
            order: 0;
            min-height: 250px;
            border-radius: 28px 28px 0 0;
          }

          .facility-row-content {
            padding: 34px 32px 38px;
          }

          .facility-row.reverse .facility-row-content::before {
            left: 0;
            right: auto;
          }
        }

        @media (max-width: 620px) {
          .facilities-hero {
            min-height: 420px;
            padding: 45px 24px 70px;
            border-radius: 0 0 24px 24px;
          }

          .facilities-hero h1 {
            font-size: clamp(43px, 14vw, 62px);
          }

          .facilities-hero-description {
            max-width: 100%;
            font-size: 13px;
          }

          .facilities-hero-mark {
            width: 105px;
            height: 105px;
            top: auto;
            right: 24px;
            bottom: 60px;
            transform: none;
          }

          .facilities-hero-mark strong {
            font-size: 29px;
          }

          .facilities-hero-mark span {
            bottom: 20px;
            font-size: 5px;
          }

          .facilities-intro {
            padding: 48px 8px 40px;
          }

          .facilities-approach {
            margin-top: 55px;
            padding: 38px 24px 42px;
            border-radius: 22px;
          }


          .facilities-intro-title {
            font-size: 38px;
          }

          .facility-row {
            min-height: 0;
            border-radius: 22px;
          }

          .facility-row-image,
          .facility-row.reverse .facility-row-image {
            min-height: 230px;
            border-radius: 22px 22px 0 0;
          }

          .facility-art {
            min-height: 230px;
          }

          .facility-art-icon-ring {
            width: 70px;
            height: 70px;
          }

          .facility-art-icon-ring svg {
            width: 52px;
            height: 52px;
          }

          .facility-art-title {
            font-size: 17px;
          }

          .facility-row-content {
            padding: 30px 24px 32px;
          }

          .facility-row-title {
            font-size: 31px;
          }

          .facility-modal-backdrop {
            padding: 10px;
          }

          .facility-modal {
            max-height: 92vh;
            border-radius: 0 0 22px 22px;
          }

          .facility-modal-header {
            min-height: 205px;
            padding: 35px 25px 54px;
          }

          .facility-modal-quote {
            left: 22px;
          }

          .facility-modal-body {
            padding: 8px 24px 30px;
          }

          .facility-modal-profile h3 {
            font-size: 19px;
          }

          .facility-routes-grid {
            grid-template-columns: 1fr;
          }

          .facility-route-field {
            grid-template-columns: 82px minmax(0, 1fr);
          }
        }
      `}</style>

      <div className="facilities-shell">
        {/* ================= HERO ================= */}
        <EditableWrap
          editMode={editMode}
          target={{ type: "pageHeader" }}
          onEditTarget={onEditTarget}
          label="Edit facilities heading"
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            className="facilities-hero"
          >
            <div className="facilities-hero-inner">
              <div className="facilities-eyebrow">
                {content.badgeText || "Our School"}
              </div>

              <h1>
                {content.title?.includes(content.highlightedText) ? (
                  <HighlightedTitle
                    title={content.title}
                    highlightedText={content.highlightedText}
                  />
                ) : (
                  <>
                    {content.title || "Spaces Built For How Students Learn"}
                  </>
                )}
              </h1>

              <p className="facilities-hero-description">
                {content.subtitle ||
                  "Thoughtfully designed spaces that support learning, creativity, discovery, wellbeing, and everyday school life."}
              </p>
            </div>
          </motion.div>
        </EditableWrap>

        {/* ================= INTRO ================= */}
        <EditableWrap
          editMode={editMode}
          target={{ type: "pageIntro" }}
          onEditTarget={onEditTarget}
          label="Edit Life Beyond The Classroom"
        >
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6 }}
            className="facilities-intro"
          >
            <div>
              <div className="facilities-intro-label">
                {content.introBadge || "Life Beyond The Classroom"}
              </div>

              <h2 className="facilities-intro-title">
                {content.introTitle?.includes(content.introHighlightedText) ? (
                  <HighlightedTitle
                    title={content.introTitle}
                    highlightedText={content.introHighlightedText}
                  />
                ) : (
                  content.introTitle || "Places that make learning feel real."
                )}
              </h2>

              <div className="facilities-intro-rule" />
            </div>

            <p className="facilities-intro-copy">
              {content.introDescription ||
                "Our School is designed as more than a collection of rooms. Each space gives students an opportunity to read, experiment, create, perform, travel safely, stay active, and discover the confidence that comes from doing things for themselves."}
            </p>
          </motion.section>
        </EditableWrap>

        {/* ================= FACILITIES ================= */}
        <EditableWrap
          editMode={editMode}
          target={{ type: "facilitySectionHeader" }}
          onEditTarget={onEditTarget}
          label="Edit Facility Highlights heading"
        >
          <section>
            <div className="facilities-section-head">
              <div className="facilities-section-kicker">
                {content.sectionKicker || "Explore Our School"}
              </div>

              <h2 className="facilities-section-title">
                {content.sectionTitle?.includes(content.sectionHighlightedText) ? (
                  <HighlightedTitle
                    title={content.sectionTitle}
                    highlightedText={content.sectionHighlightedText}
                  />
                ) : (
                  content.sectionTitle || "Facility Highlights"
                )}
              </h2>

              <p className="facilities-section-subtitle">
                {content.sectionSubtitle ||
                  "Explore the spaces and services that support the academic, creative, physical, and social development of our students."}
              </p>
            </div>
          </section>
        </EditableWrap>

        <div className="facilities-list">
            {visibleFacilities.map((facility, i) => {
              const realIndex = content.facilities.findIndex(
                (item) => item.id === facility.id
              );
              const tint = facility.color || facilityTints[i % facilityTints.length];
              const reverse = i % 2 === 1;

              return (
                <motion.article
                  key={facility.id}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.55, delay: Math.min(i * 0.06, 0.25) }}
                  className={`facility-row ${reverse ? "reverse" : ""} ${
                    editMode ? "facilities-edit-card" : ""
                  } group ${!editMode ? "facility-clickable" : ""}`}
                  style={{
                    borderTopColor: `${tint}45`,
                    cursor: editMode ? "default" : "pointer",
                  }}
                  role={!editMode ? "button" : undefined}
                  tabIndex={!editMode ? 0 : undefined}
                  aria-label={
                    !editMode
                      ? `Open details for ${facility.title}`
                      : undefined
                  }
                  onClick={() => {
                    if (!editMode) {
                      setSelectedFacility(facility);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (
                      !editMode &&
                      (e.key === "Enter" || e.key === " ")
                    ) {
                      e.preventDefault();
                      setSelectedFacility(facility);
                    }
                  }}
                >
                  <CardActionButtons
                    editMode={editMode}
                    target={{ type: "facilityCard", index: realIndex }}
                    onEditTarget={onEditTarget}
                    onDeleteTarget={onDeleteTarget}
                    canDelete
                    label="Edit facility"
                  />

                  <div className="facility-row-image">
                    <div className="facility-row-badge">{facility.category}</div>

                    <div className="absolute inset-0">
                      <FacilityVisual
                        facility={facility}
                        tint={tint}
                        displayNumber={getFacilityDisplayNumber(facility, i)}
                      />
                    </div>

                    {editMode && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onEditTarget({
                            type: "facilityImage",
                            index: realIndex,
                          });
                        }}
                        className="facility-admin-image"
                        title="Change facility visual"
                      >
                        <Camera className="w-4 h-4" />
                      </button>
                    )}

                    <div className="facility-row-number">
                      {String(getFacilityDisplayNumber(facility, i)).padStart(2, "0")}
                    </div>
                  </div>

                  <div className="facility-row-content">
                    <div className="facility-category">{facility.category}</div>

                    <h3 className="facility-row-title">{facility.title}</h3>

                    <p className="facility-row-description">
                      {facility.description}
                    </p>

                    {isTransportationFacility(facility) &&
                      facility.busRoutes?.length > 0 && (
                        <div className="facility-bus-teaser">
                          <Bus className="w-3.5 h-3.5" />
                          <span>
                            {facility.busRoutes.length} bus routes available
                          </span>
                          <span className="facility-bus-teaser-arrow">→</span>
                        </div>
                      )}

                    <button
                      type="button"
                      className="facility-learn"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        if (!editMode) {
                          setSelectedFacility(facility);
                        }
                      }}
                    >
                      {content.learnMoreText || "Learn More"} →
                    </button>
                  </div>
                </motion.article>
              );
            })}
          </div>


        {/* ================= OUR APPROACH ================= */}
        <EditableWrap
          editMode={editMode}
          target={{ type: "pageApproach" }}
          onEditTarget={onEditTarget}
          label="Edit Our Approach"
        >
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6 }}
            className="facilities-approach"
          >
            <div className="facilities-approach-kicker">Our Approach</div>
            <h2 className="facilities-approach-title">
              Facilities are more than buildings and equipment—
              <span>they are spaces where learning comes to life.</span>
            </h2>
            <p className="facilities-approach-copy">
              {content.approachDescription ||
                "We continually work to improve our learning environment and provide students with opportunities to learn through experience, technology, creativity, collaboration, and participation."}
            </p>
          </motion.section>
        </EditableWrap>

        <AddFacilityButton editMode={editMode} onAddTarget={onAddTarget} />

        {/* ================= FACILITY DETAIL POPUP ================= */}
        <AnimatePresence>
          {!editMode && selectedFacility && (
            <motion.div
              className="facility-modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedFacility(null)}
            >
              <motion.div
                className="facility-modal"
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.97 }}
                transition={{ type: "spring", stiffness: 260, damping: 24 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="facility-modal-header">
                  <div className="facility-modal-quote">"</div>

                  <button
                    type="button"
                    className="facility-modal-close"
                    onClick={() => setSelectedFacility(null)}
                    aria-label="Close facility details"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="facility-modal-kicker">
                    {selectedFacility.category || "School Facility"}
                  </div>

                  <div className="facility-modal-profile">
                    <div className="facility-modal-initials">
                      {getFacilityInitials(selectedFacility.title)}
                    </div>

                    <div>
                      <h3>Red Rose School</h3>
                      <p>Facility Information</p>
                    </div>
                  </div>
                </div>

                <div className="facility-modal-body">
                  <h2 className="facility-modal-title">
                    {selectedFacility.title}
                  </h2>

                  <div className="facility-modal-rule" />

                  <p className="facility-modal-description">
                    {selectedFacility.description}
                  </p>


                  {selectedFacility.busRoutes &&
                    selectedFacility.busRoutes.length > 0 && (
                      <div className="facility-routes">
                        <div className="facility-routes-heading">
                          <div className="facility-routes-title">
                            Available Bus Routes
                          </div>
                          <span className="facility-routes-count">
                            {selectedFacility.busRoutes.length} routes
                          </span>
                        </div>

                        <div className="facility-routes-note">
                          Bus Route-2083
                        </div>

                        <div className="facility-routes-grid">
                          {selectedFacility.busRoutes.map((route) => (
                            <div className="facility-route-card" key={route.id}>
                              <div className="facility-route-name">
                                {route.name}
                              </div>

                              <div className="facility-route-field">
                                <div className="facility-route-field-label">
                                  Starting Point
                                </div>
                                <div className="facility-route-field-value">
                                  {route.from || "Not set"}
                                </div>
                              </div>

                              <div className="facility-route-field">
                                <div className="facility-route-field-label">
                                  Destination
                                </div>
                                <div className="facility-route-field-value">
                                  {route.to || "Not set"}
                                </div>
                              </div>

                              <div className="facility-route-field">
                                <div className="facility-route-field-label">
                                  Stops
                                </div>
                                <div className="facility-route-field-value">
                                  {route.stops?.length > 0 ? (
                                    <div className="facility-route-stops">
                                      {route.stops.map((stop, index) => (
                                        <span
                                          className="facility-route-stop"
                                          key={`${stop}-${index}`}
                                        >
                                          {stop}
                                        </span>
                                      ))}
                                    </div>
                                  ) : (
                                    "No stops added"
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  <div className="facility-modal-paper">
                    <div className="facility-modal-paper-label">
                      {content.highlightsTitle || "Facility Highlights"}
                    </div>
                    <p>
                      {selectedFacility.details ||
                        "This facility supports the everyday learning and development of Red Rose students."}
                    </p>
                  </div>

                  <div className="facility-modal-footer">
                    Red Rose Secondary English Boarding School · Hetauda
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

export default Facilities;