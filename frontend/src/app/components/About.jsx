// About.jsx
// Single-file About page: JSX + inline/Tailwind styling, matching the
// visual language established by HomePage.jsx / Stats.jsx (same palette,
// same card system, same decorative background treatment).

import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Award,
  Camera,
  Compass,
  Eye,
  Heart,
  ImageIcon,
  Lightbulb,
  Pencil,
  Plus,
  Quote,
  Sparkles,
  Target,
  Trash2,
  UserRound,
} from "lucide-react";

// ---------------------------------------------------------------------
// Palette — identical to HomePage.jsx / Stats.jsx so the About page reads
// as the same site, not a different theme.
// ---------------------------------------------------------------------
const palette = {
  primary: "#1E3A5F",
  secondary: "#2D6A4F",
  accent: "#E9C46A",
  accent2: "#F4A261",
  light: "#F8F9FA",
  dark: "#1A1A2E",
  gray: "#6C757D",
  lightGray: "#E9ECEF",
  white: "#FFFFFF",
  gradient1: "linear-gradient(135deg, #1E3A5F 0%, #2D6A4F 100%)",
  gradient2: "linear-gradient(135deg, #E9C46A 0%, #F4A261 100%)",
  gradient3: "linear-gradient(135deg, #2D6A4F 0%, #1E3A5F 100%)",
};

const API_URL = "https://school-website-backend-ixx2.onrender.com";

// ---------------------------------------------------------------------
// Default content
// ---------------------------------------------------------------------
export const defaultAboutContent = {
  pageBadge: "About Us",
  pageTitle: "The Story Behind Every Classroom",
  pageSubtitle:
    "Baljagriti Secondary English Boarding School has spent 35 years turning a single classroom in Hetauda-2, Makwanpur into a full academic community — from Play Group all the way to Grade 10.",

  storyBadge: "Our Story",
  storyTitle: "Built On Discipline, Grown By Community",
  storyParagraphs: [
    "Established with a vision to provide quality education in Makwanpur, Baljagriti Secondary English Boarding School has grown into one of Hetauda's most respected academic institutions. What began as a small classroom is now home to thousands of students working toward the same goal: a strong, honest education.",
    "That growth was never just about numbers. Every year, our teachers refine how they teach, our classrooms add what students need, and our results under the NEB SEE examinations reflect the same discipline we ask of our students — shown, not just spoken.",
  ],
  storyImageUrl:
    "https://images.unsplash.com/photo-1588072432836-e10032774350?w=1000&h=800&fit=crop&auto=format",
  storyImageZoom: 1,
  storyImageOffsetX: 0,
  storyImageOffsetY: 0,
  storyImageTopTitle: "Baljagriti School",
  storyImageTopSubtitle: "Hetauda-2, Makwanpur",
  storyImageBottomTitle: "Quality Education Since 2046 BS",
  storyImageBottomDescription: "Image and caption can be managed from the admin dashboard.",

  pillarBadge: "What We Value",
  pillarTitle: "Three Commitments Behind Every Lesson",
  pillarDescription:
    "These aren't slogans on a wall — they're the standard every teacher is held to, every day.",
  pillars: [
    {
      id: 1,
      icon: "award",
      label: "Academic Excellence",
      desc: "Structured, focused teaching from Play Group to Grade 10 that consistently produces top NEB SEE results and GPA 4.00 achievers.",
      visible: true,
    },
    {
      id: 2,
      icon: "heart",
      label: "Holistic Development",
      desc: "A nurturing, child-first environment where students grow socially, morally, and emotionally — not just academically.",
      visible: true,
    },
    {
      id: 3,
      icon: "lightbulb",
      label: "Creative & Practical Learning",
      desc: "Sports, arts, digital learning, and competitions give students room to discover strengths no exam alone could reveal.",
      visible: true,
    },
  ],

  leadershipBadge: "Leadership",
  leadershipTitle: "Messages From Our Leadership",
  leadershipDescription:
    "The people setting the standard for academic discipline, values, and care across every classroom.",
  messages: [
    {
      id: 1,
      name: "Principal",
      role: "Principal",
      title: "A Standard We Hold For Every Student",
      message:
        "Welcome to Baljagriti Secondary English Boarding School. Our goal has never been to make every student the same — it's to give each one the discipline, confidence, and values to become fully capable, on their own terms. Every policy we set and every lesson we plan is built around that goal.",
      image: "",
      imageZoom: 1,
      imageOffsetX: 0,
      imageOffsetY: 0,
      visible: true,
    },
    {
      id: 2,
      name: "Vice Principal",
      role: "Vice Principal",
      title: "Support Behind Every Result",
      message:
        "Strong SEE results don't happen in exam week — they happen in the months of steady classroom work before it. Our staff track each student's progress closely, so support arrives before a struggle becomes a pattern. That's the work behind our numbers.",
      image: "",
      imageZoom: 1,
      imageOffsetX: 0,
      imageOffsetY: 0,
      visible: true,
    },
  ],

  missionVisionBadge: "What Guides Us",
  missionVision: [
    {
      id: 1,
      icon: "target",
      title: "Our Mission",
      desc: "To provide a safe, nurturing, and academically rigorous learning environment that equips every student with the confidence, creativity, and responsibility to meet the challenges of a changing world.",
      visible: true,
    },
    {
      id: 2,
      icon: "eye",
      title: "Our Vision",
      desc: "To be Makwanpur's leading educational institution — recognized for academic excellence, holistic development, and graduates who lead with integrity wherever they go.",
      visible: true,
    },
  ],

  journeyBadge: "Our Journey",
  journeyTitle: "35 Years, Year By Year",
  journey: [
    {
      id: 1,
      year: "2046 BS",
      title: "School Founded",
      desc: "Baljagriti opens in Hetauda-2, Makwanpur with a single vision: quality English-medium education, close to home.",
      visible: true,
    },
    {
      id: 2,
      year: "Early Growth",
      title: "Expanded To Grade 10",
      desc: "Rising demand pushed the school to extend its academic structure from early learning through Grade 10.",
      visible: true,
    },
    {
      id: 3,
      year: "Academic Growth",
      title: "Consistent NEB SEE Results",
      desc: "Focused classroom teaching and steady discipline began producing some of the region's strongest SEE results.",
      visible: true,
    },
    {
      id: 4,
      year: "Today",
      title: "3,800+ Students Strong",
      desc: "A growing community of students, 240+ educators, and a shared focus on academic and personal excellence.",
      visible: true,
    },
  ],

  ctaTitle: "Come See What 35 Years Of Discipline Looks Like",
  ctaDescription:
    "Visit our campus in Hetauda-2, meet our teachers, and see the classrooms behind our SEE results for yourself.",
  ctaButtonText: "Plan A Visit",
  ctaButtonLink: "/contact",
};

// ---------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------
function clampNumber(value, min, max, fallback) {
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue)) return fallback;
  return Math.min(max, Math.max(min, numberValue));
}

function getAdjustedImageStyle(source = {}) {
  const zoom = clampNumber(source.imageZoom, 1, 3, 1);
  const x = clampNumber(source.imageOffsetX, -60, 60, 0);
  const y = clampNumber(source.imageOffsetY, -60, 60, 0);
  const objectX = Math.min(100, Math.max(0, 50 - x));
  const objectY = Math.min(100, Math.max(0, 50 - y));
  return {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: `${objectX}% ${objectY}%`,
    transform: `scale(${zoom})`,
    transformOrigin: "center center",
    transition: "transform 240ms ease-out, object-position 240ms ease-out",
  };
}

function normalizeArray(savedArray, defaultArray) {
  if (!Array.isArray(savedArray)) return defaultArray;
  return savedArray.map((item, index) => ({
    ...(defaultArray[index] || {}),
    ...item,
    id: item.id || Date.now() + index,
  }));
}

export function mergeAboutContent(saved = {}) {
  const messages = normalizeArray(saved.messages, defaultAboutContent.messages).map(
    (message) => ({
      ...message,
      imageZoom: clampNumber(message.imageZoom, 1, 3, 1),
      imageOffsetX: clampNumber(message.imageOffsetX, -60, 60, 0),
      imageOffsetY: clampNumber(message.imageOffsetY, -60, 60, 0),
    })
  );

  return {
    ...defaultAboutContent,
    ...(saved || {}),
    storyParagraphs: Array.isArray(saved.storyParagraphs)
      ? saved.storyParagraphs
      : defaultAboutContent.storyParagraphs,
    storyImageZoom: clampNumber(saved.storyImageZoom, 1, 3, 1),
    storyImageOffsetX: clampNumber(saved.storyImageOffsetX, -60, 60, 0),
    storyImageOffsetY: clampNumber(saved.storyImageOffsetY, -60, 60, 0),
    pillars: normalizeArray(saved.pillars, defaultAboutContent.pillars),
    messages,
    missionVision: normalizeArray(saved.missionVision, defaultAboutContent.missionVision),
    journey: normalizeArray(saved.journey, defaultAboutContent.journey),
  };
}

const ICONS = {
  award: Award,
  heart: Heart,
  lightbulb: Lightbulb,
  target: Target,
  eye: Eye,
};

// ---------------------------------------------------------------------
// Shared editing chrome (mirrors the pattern used in Stats.jsx)
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
      className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5"
      style={{ color: palette.white, background: palette.gradient1, boxShadow: "0 8px 20px rgba(30,58,95,0.22)" }}
    >
      <Plus className="w-4 h-4" />
      {label}
    </button>
  );
}

// ---------------------------------------------------------------------
// Shared visual building blocks (match Stats.jsx conventions)
// ---------------------------------------------------------------------
function SectionHeader({ badge, badgeColor = palette.primary, badgeBg = "rgba(30,58,95,0.08)", title, description }) {
  return (
    <div className="text-center max-w-3xl mx-auto mb-12">
      <span
        className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide mb-4"
        style={{ background: badgeBg, color: badgeColor }}
      >
        {badge}
      </span>
      <h2
        className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
        style={{ color: palette.dark, fontFamily: "var(--font-display)", letterSpacing: "-0.02em", lineHeight: 1.1 }}
      >
        {title}
      </h2>
      {description && (
        <p className="text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: palette.gray }}>
          {description}
        </p>
      )}
      <div className="w-16 h-1 rounded-full mx-auto mt-4" style={{ background: palette.gradient2 }} />
    </div>
  );
}

function DecorativeBackdrop() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-5" style={{ background: palette.primary }} />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-5" style={{ background: palette.secondary }} />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-[0.02]"
        style={{ background: palette.accent }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------
// About page
// ---------------------------------------------------------------------
export default function About({
  editMode = false,
  contentOverride = null,
  onEditTarget = () => {},
  onDeleteTarget = () => {},
  onAddTarget = () => {},
}) {
  const [content, setContent] = useState(() => mergeAboutContent(contentOverride || defaultAboutContent));
  const [selectedLeader, setSelectedLeader] = useState(null);

  useEffect(() => {
    if (contentOverride) {
      setContent(mergeAboutContent(contentOverride));
      return undefined;
    }
    let alive = true;
    const loadAboutContent = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/site-content/about`, { timeout: 10000 });
        if (!alive) return;
        const saved = res.data?.data?.content || {};
        setContent(mergeAboutContent(saved));
      } catch (error) {
        console.error("About content load error:", error);
        if (alive) setContent(mergeAboutContent(defaultAboutContent));
      }
    };
    loadAboutContent();
    return () => {
      alive = false;
    };
  }, [contentOverride]);

  const visiblePillars = (content.pillars || []).filter((p) => p.visible !== false);
  const visibleMessages = (content.messages || []).filter((m) => m.visible !== false);
  const visibleMissionVision = (content.missionVision || []).filter((mv) => mv.visible !== false);
  const visibleJourney = (content.journey || []).filter((j) => j.visible !== false);

  const cardTints = [palette.primary, palette.secondary, palette.accent2];
  const journeyColors = [palette.primary, palette.accent2, palette.accent, palette.secondary];

  return (
    <section className="relative overflow-hidden py-16 md:py-24" style={{ background: palette.light }}>
      <DecorativeBackdrop />

      <div className="relative z-10 max-w-[1400px] mx-auto px-5 sm:px-8">
        {/* ================= PAGE HEADER ================= */}
        <EditableWrap editMode={editMode} target={{ type: "pageHeader" }} onEditTarget={onEditTarget} label="Edit page header">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16 md:mb-24"
          >
            <span
              className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide mb-4"
              style={{ background: "rgba(30, 58, 95, 0.08)", color: palette.primary }}
            >
              {content.pageBadge}
            </span>
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5"
              style={{ color: palette.dark, fontFamily: "var(--font-display)", letterSpacing: "-0.02em", lineHeight: 1.08 }}
            >
              {content.pageTitle}
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: palette.gray }}>
              {content.pageSubtitle}
            </p>
            <div className="w-16 h-1 rounded-full mx-auto mt-6" style={{ background: palette.gradient2 }} />
          </motion.div>
        </EditableWrap>

        {/* ================= OUR STORY ================= */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center mb-16 md:mb-24"
        >
          <EditableWrap editMode={editMode} target={{ type: "storyImage" }} onEditTarget={onEditTarget} icon={Camera} label="Change story image">
            <div
              className="relative rounded-2xl overflow-hidden min-h-[300px] md:min-h-[420px]"
              style={{ background: palette.dark, boxShadow: "0 20px 60px rgba(0,0,0,0.12)" }}
            >
              {content.storyImageUrl ? (
                <img
                  src={content.storyImageUrl}
                  alt="Baljagriti school campus"
                  draggable={false}
                  className="absolute inset-0"
                  style={getAdjustedImageStyle(content)}
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                  <ImageIcon className="w-12 h-12 mb-2" />
                  <div className="text-xs font-bold uppercase tracking-wider">Add Story Image</div>
                </div>
              )}
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to top, rgba(26,26,46,0.65) 0%, rgba(26,26,46,0.1) 50%, rgba(26,26,46,0.3) 100%)" }}
              />
              <EditableWrap editMode={editMode} target={{ type: "storyImageText" }} onEditTarget={onEditTarget} label="Edit image caption" className="absolute inset-0">
                <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start">
                  <div className="text-white">
                    <div className="text-lg font-bold">{content.storyImageTopTitle}</div>
                    <div className="text-white/70 text-sm">{content.storyImageTopSubtitle}</div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="backdrop-blur-sm rounded-xl p-4" style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.15)" }}>
                    <div className="text-white text-lg font-bold">{content.storyImageBottomTitle}</div>
                    <div className="text-white/70 text-sm mt-1">{content.storyImageBottomDescription}</div>
                  </div>
                </div>
              </EditableWrap>
            </div>
          </EditableWrap>

          <EditableWrap editMode={editMode} target={{ type: "storyText" }} onEditTarget={onEditTarget} label="Edit story text">
            <div>
              <span
                className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide mb-4"
                style={{ background: "rgba(45, 106, 79, 0.1)", color: palette.secondary }}
              >
                {content.storyBadge}
              </span>
              <h2
                className="text-3xl md:text-4xl font-bold mb-4"
                style={{ color: palette.dark, fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
              >
                {content.storyTitle}
              </h2>
              <div className="space-y-4">
                {(content.storyParagraphs || []).map((text, idx) => (
                  <p key={idx} className="text-base md:text-lg leading-relaxed" style={{ color: palette.gray }}>
                    {text}
                  </p>
                ))}
              </div>
            </div>
          </EditableWrap>
        </motion.div>

        {/* ================= CORE VALUES / PILLARS ================= */}
        <div className="mb-16 md:mb-24">
          <SectionHeader
            badge={content.pillarBadge}
            title={content.pillarTitle}
            description={content.pillarDescription}
            badgeBg="rgba(233, 196, 106, 0.15)"
            badgeColor={palette.accent2}
          />

          <div className="flex justify-end mb-6">
            <SectionAddButton editMode={editMode} label="Add Value" type="pillar" onAddTarget={onAddTarget} />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {visiblePillars.map((p, i) => {
              const realIndex = content.pillars.findIndex((item) => item.id === p.id);
              const tint = cardTints[i % cardTints.length];

              return (
                <EditableWrap
                  key={p.id}
                  editMode={editMode}
                  target={{ type: "pillarCard", index: realIndex }}
                  onEditTarget={onEditTarget}
                  onDeleteTarget={onDeleteTarget}
                  canDelete
                  label="Edit value card"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="group relative overflow-hidden rounded-2xl p-6 md:p-8 h-full transition-all duration-300 hover:-translate-y-2"
                    style={{
                      background: `linear-gradient(160deg, ${tint}14 0%, ${palette.white} 55%)`,
                      border: `1px solid ${tint}2e`,
                      boxShadow: `0 4px 22px ${tint}1a`,
                    }}
                  >
                    <div
                      className="absolute -bottom-12 -right-12 w-40 h-40 rounded-full border-[10px] opacity-[0.07] pointer-events-none transition-transform duration-500 group-hover:scale-110"
                      style={{ borderColor: tint }}
                    />
                    <div className="absolute top-0 left-0 right-0 h-1.5 transition-all duration-300 group-hover:h-2" style={{ background: palette.gradient2 }} />

                    <div className="relative pt-4">
                      <h3 className="text-xl font-bold mb-2" style={{ color: palette.dark }}>
                        {p.label}
                      </h3>
                      <p className="text-sm leading-relaxed" style={{ color: palette.gray }}>
                        {p.desc}
                      </p>
                    </div>
                  </motion.div>
                </EditableWrap>
              );
            })}
          </div>
        </div>

        {/* ================= LEADERSHIP MESSAGES ================= */}
        <div className="mb-16 md:mb-24">
          <SectionHeader badge={content.leadershipBadge} title={content.leadershipTitle} description={content.leadershipDescription} />

          <div className="flex justify-end mb-6">
            <SectionAddButton editMode={editMode} label="Add Message" type="message" onAddTarget={onAddTarget} />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {visibleMessages.map((person, i) => {
              const realIndex = content.messages.findIndex((m) => m.id === person.id);
              const tint = i % 2 === 0 ? palette.primary : palette.secondary;

              return (
                <EditableWrap
                  key={person.id}
                  editMode={editMode}
                  target={{ type: "leadershipMessage", index: realIndex }}
                  onEditTarget={onEditTarget}
                  onDeleteTarget={onDeleteTarget}
                  canDelete
                  label="Edit leadership message"
                >
                  <div
                    onClick={() => setSelectedLeader(person)}
                    className="cursor-pointer"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.25 }}
                      transition={{ duration: 0.5, delay: i * 0.12 }}
                      className="relative rounded-2xl p-6 md:p-8 h-full"
                      style={{
                        background: palette.white,
                        border: `1px solid ${palette.lightGray}`,
                        boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                      }}
                    >
                      <Quote className="absolute right-6 top-6 w-10 h-10 opacity-10" style={{ color: tint }} />

                      <div className="flex items-center gap-4 mb-5">
                        <EditableWrap editMode={editMode} target={{ type: "leadershipPhoto", index: realIndex }} onEditTarget={onEditTarget} icon={Camera} label="Change photo">
                          <div
                            className="w-16 h-16 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0"
                            style={{ background: `linear-gradient(150deg, ${tint}, ${palette.dark})` }}
                          >
                            {person.image ? (
                              <img src={person.image} alt={person.name} style={getAdjustedImageStyle(person)} />
                            ) : (
                              <UserRound className="w-7 h-7" style={{ color: palette.white }} />
                            )}
                          </div>
                        </EditableWrap>
                        <div>
                          <div className="text-xs font-bold uppercase tracking-wider" style={{ color: tint }}>
                            {person.role}
                          </div>
                          <div className="text-lg font-bold" style={{ color: palette.dark }}>
                            {person.name}
                          </div>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold mb-3" style={{ color: palette.dark }}>
                        {person.title}
                      </h3>
                      <p className="text-sm md:text-base leading-relaxed" style={{ color: palette.gray }}>
                        {person.message.substring(0, 120)}...
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLeader(person);
                        }}
                        className="mt-5 text-blue-600 font-semibold"
                      >
                        Read More
                      </button>
                    </motion.div>
                  </div>
                </EditableWrap>
              );
            })}
          </div>
        </div>

        {/* ================= MISSION & VISION ================= */}
        <div className="mb-16 md:mb-24">
          <SectionHeader badge={content.missionVisionBadge} title="What Guides Every Decision We Make" badgeBg="rgba(45, 106, 79, 0.1)" badgeColor={palette.secondary} />

          <div className="flex justify-end mb-6">
            <SectionAddButton editMode={editMode} label="Add Card" type="missionVision" onAddTarget={onAddTarget} />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {visibleMissionVision.map((item, i) => {
              const realIndex = content.missionVision.findIndex((mv) => mv.id === item.id);
              const Icon = ICONS[item.icon] || Compass;
              const gradient = i === 0 ? palette.gradient1 : palette.gradient3;

              return (
                <EditableWrap
                  key={item.id}
                  editMode={editMode}
                  target={{ type: "missionVision", index: realIndex }}
                  onEditTarget={onEditTarget}
                  onDeleteTarget={onDeleteTarget}
                  canDelete
                  label="Edit mission or vision card"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="relative overflow-hidden rounded-2xl p-8 h-full"
                    style={{ background: gradient, color: palette.white, boxShadow: "0 20px 50px rgba(0,0,0,0.15)" }}
                  >
                    <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full opacity-10" style={{ background: palette.white }} />
                    <div className="relative">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: "rgba(255,255,255,0.16)" }}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                      <p className="leading-relaxed opacity-90">{item.desc}</p>
                    </div>
                  </motion.div>
                </EditableWrap>
              );
            })}
          </div>
        </div>

        {/* ================= OUR JOURNEY ================= */}
        <div className="mb-16 md:mb-24">
          <SectionHeader badge={content.journeyBadge} title={content.journeyTitle} badgeBg="rgba(244, 162, 97, 0.15)" badgeColor={palette.accent2} />

          <div className="flex justify-end mb-6">
            <SectionAddButton editMode={editMode} label="Add Milestone" type="journey" onAddTarget={onAddTarget} />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {visibleJourney.map((item, i) => {
              const realIndex = content.journey.findIndex((j) => j.id === item.id);
              const tint = journeyColors[i % journeyColors.length];

              return (
                <EditableWrap
                  key={item.id}
                  editMode={editMode}
                  target={{ type: "journeyItem", index: realIndex }}
                  onEditTarget={onEditTarget}
                  onDeleteTarget={onDeleteTarget}
                  canDelete
                  label="Edit journey milestone"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.45, delay: i * 0.08 }}
                    className="relative rounded-2xl p-6 h-full"
                    style={{ background: palette.white, border: `1px solid ${palette.lightGray}`, borderTopWidth: "4px", borderTopColor: tint, boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}
                  >
                    <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: tint }}>
                      {item.year}
                    </div>
                    <h3 className="text-lg font-bold mb-2" style={{ color: palette.dark }}>
                      {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: palette.gray }}>
                      {item.desc}
                    </p>
                  </motion.div>
                </EditableWrap>
              );
            })}
          </div>
        </div>

        {/* ================= CTA BAND ================= */}
        <EditableWrap editMode={editMode} target={{ type: "ctaBand" }} onEditTarget={onEditTarget} label="Edit call to action">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-2xl p-10 md:p-14 text-center"
            style={{ background: palette.gradient1, boxShadow: "0 30px 70px rgba(30,58,95,0.25)" }}
          >
            <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full opacity-10" style={{ background: palette.accent }} />
            <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full opacity-10" style={{ background: palette.white }} />

            <span
              className="relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide mb-5"
              style={{ background: "rgba(255,255,255,0.14)", color: palette.white }}
            >
              <Sparkles className="w-4 h-4" />
              Admissions Open
            </span>
            <h2 className="relative text-3xl md:text-4xl font-bold mb-4" style={{ color: palette.white, fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}>
              {content.ctaTitle}
            </h2>
            <p className="relative max-w-xl mx-auto mb-8" style={{ color: "rgba(255,255,255,0.82)" }}>
              {content.ctaDescription}
            </p>
            <Link
              to={content.ctaButtonLink || "/contact"}
              onClick={(e) => {
                if (editMode) {
                  e.preventDefault();
                  return;
                }
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="relative inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 hover:-translate-y-0.5"
              style={{ color: palette.dark, background: palette.gradient2, boxShadow: "0 10px 26px rgba(0,0,0,0.18)" }}
            >
              {content.ctaButtonText}
            </Link>
          </motion.div>
        </EditableWrap>
      </div>

      {/* ================= LEADERSHIP POPUP ================= */}
      {selectedLeader && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 relative">
            <button
              onClick={() => setSelectedLeader(null)}
              className="absolute top-4 right-4 text-xl"
            >
              ✕
            </button>

            {selectedLeader.image && (
              <img
                src={selectedLeader.image}
                alt={selectedLeader.name}
                className="w-40 h-40 rounded-xl object-cover mx-auto mb-6"
              />
            )}

            <h2 className="text-3xl font-bold text-center">
              {selectedLeader.name}
            </h2>

            <p className="text-center text-gray-500 mb-4">
              {selectedLeader.role}
            </p>

            <h3 className="text-xl font-semibold mb-4">
              {selectedLeader.title}
            </h3>

            <p className="leading-8">
              {selectedLeader.message}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}