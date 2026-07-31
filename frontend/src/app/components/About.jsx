import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "motion/react";
import {
  Camera,
  Image as ImageIcon,
  Pencil,
  Plus,
  Quote,
  Sparkles,
  Trash2,
  UserRound,
} from "lucide-react";

const colors = {
  red: "#1E3A5F",
  green: "#2D6A4F",
  purple: "#C9A84C",
  softPurple: "#E8D5A3",
  dark: "#1A1A2E",
  cream: "#FFF8EE",
  lightGreen: "#EAF7EF",
  lightPurple: "#FBF3DF",
  gold: "#C9A84C",
  cyan: "#E8D5A3",
  orange: "#F4A261",
};

export const defaultAboutContent = {
  pageTitle: "About Us",
  pageSubtitle:
    "Learn about Baljagriti English Secondary School, our values, and our commitment to quality education.",

  storyBadge: "Our Story",
  storyTitle: "Building Tomorrow's Leaders Today",
  storyParagraphs: [
    "Baljagriti English Secondary School, located in the heart of Makwanpur, Nepal, has been a beacon of quality education for many years. What began as a small school with a strong vision has grown into a thriving institution serving students from Play Group to Grade 10.",
    "We take pride in our dedicated team of experienced educators who work tirelessly to ensure every child receives the attention, guidance, and learning environment they need to grow academically and personally.",
  ],
 
    
  storyImageAlt: "School campus",
  storyImageTitle: "School Campus",
  storyImageSubtitle: "Image can later be managed from admin dashboard",
  storyImageZoom: 1,
  storyImageOffsetX: 0,
  storyImageOffsetY: 0,

  pillarBadge: "Our Core Values",
  pillarTitle: "What Makes Us Different",
  pillars: [
    {
      id: 1,
      icon: "award",
      label: "Academic Excellence",
      desc: "Focused classroom learning that helps students build a strong academic foundation from early years to Grade 10.",
      color: "#1E3A5F",
      visible: true,
    },
    {
      id: 2,
      icon: "heart",
      label: "Holistic Development",
      desc: "A nurturing and child-friendly environment where students grow academically, personally, socially, and morally.",
      color: "#2D6A4F",
      visible: true,
    },
    {
      id: 3,
      icon: "lightbulb",
      label: "Creative & Practical Learning",
      desc: "Extra-curricular activities, competitions, sports, arts, and school programs help students explore their talents.",
      color: "#C9A84C",
      visible: true,
    },
  ],

  leadershipBadge: "Leadership Messages",
  leadershipTitle: "Messages From Leadership",
  leadershipDescription:
    "Words from school leadership guiding students toward academic excellence, discipline, values, and lifelong learning.",
  messages: [
    {
      id: 1,
      name: "Principal",
      role: "Principal",
      title: "Principal's Message",
      message:
        "Welcome to Baljagriti English Secondary School. We are committed to nurturing every child into a confident, capable, disciplined, and compassionate individual. Our goal is to provide quality education with strong values, creativity, and academic excellence.",
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
      title: "Vice Principal's Message",
      message:
        "Our team works tirelessly to provide a safe, inspiring, and academically rigorous environment for every student. We believe every child deserves care, guidance, and opportunities to grow academically, socially, and personally.",
      image: "",
      imageZoom: 1,
      imageOffsetX: 0,
      imageOffsetY: 0,
      visible: true,
    },
  ],

  missionVision: [
    {
      id: 1,
      icon: "target",
      title: "Our Mission",
      desc: "To provide a safe, nurturing, and academically rigorous learning environment that empowers students to become confident, creative, and responsible citizens equipped for the challenges of the modern world.",
      color: "#C9A84C",
      visible: true,
    },
    {
      id: 2,
      icon: "eye",
      title: "Our Vision",
      desc: "To be a leading educational institution in Makwanpur, recognized for academic excellence, holistic development, and producing leaders who contribute positively to society and the nation.",
      color: "#2D6A4F",
      visible: true,
    },
  ],

  timelineBadge: "Timeline",
  journeyTitle: "Our Journey",
  journey: [
    {
      id: 1,
      year: "2046 BS",
      title: "School Founded",
      desc: "Baljagriti English Secondary School was established in Makwanpur with a vision to provide quality English-medium education.",
      visible: true,
    },
    {
      id: 2,
      year: "Secondary Level",
      title: "Expanded to Grade 10",
      desc: "The school expanded its academic structure to support students from early learning levels up to Grade 10.",
      visible: true,
    },
    {
      id: 3,
      year: "Academic Growth",
      title: "Strong SEE Foundation",
      desc: "Students continued building strong academic results through focused classroom teaching, discipline, and guided learning.",
      visible: true,
    },
    {
      id: 4,
      year: "Today",
      title: "Growing Learning Community",
      desc: "The school community continues to grow with dedicated educators, modern facilities, and a focus on holistic student development.",
      visible: true,
    },
  ],
};

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
  const messages = normalizeArray(
    saved.messages,
    defaultAboutContent.messages
  ).map((message) => ({
    ...message,
    imageZoom: clampNumber(message.imageZoom, 1, 3, 1),
    imageOffsetX: clampNumber(message.imageOffsetX, -60, 60, 0),
    imageOffsetY: clampNumber(message.imageOffsetY, -60, 60, 0),
  }));

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
    missionVision: normalizeArray(
      saved.missionVision,
      defaultAboutContent.missionVision
    ),
    journey: normalizeArray(saved.journey, defaultAboutContent.journey),
  };
}

function ActionButtons({
  editMode,
  target,
  onEditTarget,
  onDeleteTarget,
  icon: Icon = Pencil,
  label = "Edit",
  canDelete = false,
}) {
  if (!editMode) return null;

  return (
    <div className="absolute -top-3 -right-3 z-[120] flex items-center gap-2 opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200">
      <button
        type="button"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onEditTarget(target);
        }}
        className="rounded-full w-9 h-9 flex items-center justify-center shadow-xl"
        style={{
          background: `linear-gradient(135deg, ${colors.gold}, ${colors.cyan})`,
          color: "#020617",
          border: "1px solid rgba(255,255,255,0.85)",
        }}
        title={label}
      >
        <Icon className="w-4 h-4" />
      </button>

      {canDelete && (
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onDeleteTarget(target);
          }}
          className="rounded-full w-9 h-9 flex items-center justify-center shadow-xl"
          style={{
            background: "linear-gradient(135deg, #FEE2E2, #FCA5A5)",
            color: colors.red,
            border: "1px solid rgba(255,255,255,0.85)",
          }}
          title="Delete"
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
      <ActionButtons
        editMode={editMode}
        target={target}
        onEditTarget={onEditTarget}
        onDeleteTarget={onDeleteTarget}
        icon={icon}
        label={label}
        canDelete={canDelete}
      />
    </div>
  );
}

function SectionAddButton({ editMode, label, type, onAddTarget }) {
  if (!editMode) return null;

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onAddTarget(type);
      }}
      className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-black transition-all hover:-translate-y-0.5"
      style={{
        background: `linear-gradient(135deg, ${colors.gold}, ${colors.cyan})`,
        color: "#020617",
        boxShadow: "0 12px 30px rgba(201,168,76,0.20)",
      }}
    >
      <Plus className="w-4 h-4" />
      {label}
    </button>
  );
}

function AboutImage({ src, alt, imageData = {} }) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover will-change-transform"
        style={getAdjustedImageStyle(imageData)}
      />
    );
  }

  return (
    <div className="w-full h-full bg-slate-100 flex items-center justify-center">
      <ImageIcon className="w-20 h-20 text-slate-300" />
    </div>
  );
}

function LeadershipImagePanel({ person, index, editMode, onEditTarget }) {
  return (
    <div
      className="w-full md:w-[320px] lg:w-[360px] flex-shrink-0 relative"
      style={{
        background:
          "linear-gradient(145deg, rgba(255,248,238,0.96), rgba(250,240,214,0.82))",
        borderRight: "1px solid rgba(11,16,32,0.08)",
      }}
    >
      <EditableWrap
        editMode={editMode}
        target={{ type: "leadershipPhoto", index }}
        onEditTarget={onEditTarget}
        icon={Camera}
        label="Change leadership photo"
        className="h-full"
      >
        <div className="h-full min-h-[280px] md:min-h-[360px] overflow-hidden">
          {person.image ? (
            <img
              src={person.image}
              alt={person.name}
              className="w-full h-full object-cover will-change-transform"
              style={getAdjustedImageStyle(person)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-100">
              <UserRound className="w-16 h-16 text-slate-300" />
            </div>
          )}
        </div>
      </EditableWrap>
    </div>
  );
}

function shouldShowReadMore(message = "") {
  return String(message || "").trim().length > 170;
}

function getLeadershipMessageUrl(person = {}, index = 0) {
  const id = encodeURIComponent(String(person.id || index));
  return `/about?message=${id}`;
}

function LeadershipSignature({ person, editMode = false }) {
  const name = String(person?.name || "").trim();
  const role = String(person?.role || "").trim();

  if (!name && !role && !editMode) return null;

  return (
    <div className="mt-1 text-right">
      <div className="text-base md:text-lg font-black text-slate-950">
        - {name || "Name not set"}
      </div>

      <div className="mt-1 text-xs md:text-sm font-black uppercase tracking-[0.16em] text-slate-400">
        {role || "Post not set"}
      </div>
    </div>
  );
}

function LeadershipMessageDetailPage({ person }) {
  return (
    <section
      className="pt-28 pb-24 relative overflow-hidden min-h-screen"
      style={{
        background: `
          radial-gradient(circle at top right, rgba(201,168,76,0.16), transparent 34%),
          radial-gradient(circle at bottom left, rgba(45,106,79,0.12), transparent 32%),
          linear-gradient(180deg, #FFF8EE 0%, #FBF3DF 100%)
        `,
      }}
    >
      <div
        className="absolute top-0 right-0 w-[520px] h-[520px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(201,168,76,0.12), transparent 70%)",
          filter: "blur(8px)",
        }}
      />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <a
          href="/about"
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black mb-8 transition-all hover:-translate-y-0.5"
          style={{
            background: "rgba(255,255,255,0.78)",
            color: colors.dark,
            border: "1px solid rgba(11,16,32,0.08)",
            boxShadow: "0 12px 32px rgba(11,16,32,0.07)",
          }}
        >
          ← Back to About
        </a>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-[34px] overflow-hidden"
          style={{
            background:
              "linear-gradient(145deg, rgba(255,255,255,0.97), rgba(255,255,255,0.84))",
            border: "1px solid rgba(11,16,32,0.08)",
            boxShadow:
              "0 28px 80px rgba(11,16,32,0.10), inset 0 1px 0 rgba(255,255,255,0.85)",
            backdropFilter: "blur(18px)",
          }}
        >
          <div className="relative p-6 md:p-8 lg:p-10">
            <Quote
              className="absolute right-8 top-8 w-16 h-16 opacity-10"
              style={{ color: colors.purple }}
            />

            <div className="flex flex-col gap-7 md:flex-row md:items-start">
              <div className="shrink-0">
                <div
                  className="h-[220px] w-[220px] overflow-hidden rounded-[28px] md:h-[250px] md:w-[250px]"
                  style={{
                    background:
                      "linear-gradient(145deg, rgba(255,248,238,0.96), rgba(250,240,214,0.82))",
                    border: "1px solid rgba(11,16,32,0.08)",
                    boxShadow: "0 18px 42px rgba(11,16,32,0.10)",
                  }}
                >
                  {person.image ? (
                    <img
                      src={person.image}
                      alt={person.name || person.title || "Leadership"}
                      className="h-full w-full object-cover will-change-transform"
                      style={getAdjustedImageStyle(person)}
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-slate-100">
                      <UserRound className="w-16 h-16 text-slate-300" />
                    </div>
                  )}
                </div>
              </div>

              <div className="min-w-0 flex-1 pt-1 md:pt-4">
                {person.role && (
                  <div
                    className="inline-flex items-center rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-[0.16em] mb-5"
                    style={{
                      background: "rgba(30,58,95,0.08)",
                      color: colors.red,
                      border: "1px solid rgba(30,58,95,0.16)",
                    }}
                  >
                    {person.role}
                  </div>
                )}

                <h1
                  className="text-4xl md:text-5xl mb-6"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 850,
                    color: colors.dark,
                    letterSpacing: "-0.045em",
                    lineHeight: 1.05,
                  }}
                >
                  {person.title || "Leadership Message"}
                </h1>

                <LeadershipSignature person={person} />
              </div>
            </div>

            <div
              className="about-long-text whitespace-pre-line mt-8 rounded-[28px] p-5 text-base leading-[1.9] text-slate-600 md:p-7 md:text-lg"
              style={{
                background: "rgba(248,250,252,0.78)",
                border: "1px solid rgba(15,23,42,0.06)",
              }}
            >
              {person.message}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function MessageCard({
  person,
  index,
  editMode,
  onEditTarget,
  onDeleteTarget,
}) {
  const messageText = String(person.message || "").trim();
  const isLongMessage = shouldShowReadMore(messageText);

  return (
    <EditableWrap
      editMode={editMode}
      target={{ type: "leadershipMessage", index }}
      onEditTarget={onEditTarget}
      onDeleteTarget={onDeleteTarget}
      canDelete
      label="Edit leadership message"
    >
      <motion.div
        initial={{ opacity: 0, y: 34 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: index * 0.12 }}
        className="rounded-3xl overflow-hidden flex flex-col md:flex-row"
        style={{
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.96), rgba(255,255,255,0.78))",
          border: editMode
            ? "1px dashed rgba(201,168,76,0.65)"
            : "1px solid rgba(11,16,32,0.08)",
          boxShadow:
            "0 22px 62px rgba(11,16,32,0.08), inset 0 1px 0 rgba(255,255,255,0.85)",
          backdropFilter: "blur(18px)",
        }}
      >
        <LeadershipImagePanel
          person={person}
          index={index}
          editMode={editMode}
          onEditTarget={onEditTarget}
        />

        <div className="relative flex-1 p-8 md:p-10 lg:p-12">
          <Quote
            className="absolute right-8 top-8 w-12 h-12 opacity-10"
            style={{ color: colors.purple }}
          />

          <h2
            className="text-3xl md:text-4xl mb-5"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 850,
              color: colors.dark,
              letterSpacing: "-0.035em",
            }}
          >
            {person.title || (editMode ? "Message title is empty" : "")}
          </h2>

          <p
            className="about-long-text text-base md:text-lg leading-[1.85] text-slate-500 max-w-5xl"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              maxHeight: "5.55em",
            }}
          >
            {messageText ||
              (editMode
                ? "Message text is empty. Click edit to add message."
                : "")}
          </p>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              {isLongMessage && !editMode && (
                <a
                  href={getLeadershipMessageUrl(person, index)}
                  className="inline-flex items-center rounded-full px-5 py-2.5 text-sm font-black transition-all hover:-translate-y-0.5"
                  style={{
                    background: `linear-gradient(135deg, ${colors.gold}, ${colors.cyan})`,
                    color: colors.dark,
                    boxShadow: "0 14px 34px rgba(201,168,76,0.22)",
                  }}
                >
                  Read More
                </a>
              )}
            </div>

            <LeadershipSignature person={person} editMode={editMode} />
          </div>
        </div>
      </motion.div>
    </EditableWrap>
  );
}

export function About({
  editMode = false,
  contentOverride = null,
  onEditTarget = () => {},
  onDeleteTarget = () => {},
  onAddTarget = () => {},
}) {
  const [content, setContent] = useState(() =>
    mergeAboutContent(contentOverride || defaultAboutContent)
  );

  useEffect(() => {
    if (contentOverride) {
      setContent(mergeAboutContent(contentOverride));
      return undefined;
    }

    let alive = true;

    const loadAboutContent = async () => {
      try {
        const res = await axios.get(
          "https://school-website-backend-ixx2.onrender.com/api/site-content/about",
          { timeout: 8000 }
        );

        if (!alive) return;

        const savedContent = res.data?.data?.content || {};
        setContent(mergeAboutContent(savedContent));
      } catch (error) {
        console.error("About content load error:", error);

        if (alive) {
          setContent(mergeAboutContent(defaultAboutContent));
        }
      }
    };

    loadAboutContent();

    return () => {
      alive = false;
    };
  }, [contentOverride]);

  const visiblePillars = (content.pillars || []).filter(
    (item) => item.visible !== false
  );
  const visibleMissionVision = (content.missionVision || []).filter(
    (item) => item.visible !== false
  );
  const visibleJourney = (content.journey || []).filter(
    (item) => item.visible !== false
  );
  const visibleMessages = (content.messages || []).filter(
    (item) => item.visible !== false
  );

  const selectedMessageId =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("message")
      : "";

  const selectedMessage =
    !editMode && selectedMessageId
      ? visibleMessages.find(
          (person, index) =>
            String(person.id || index) === String(selectedMessageId)
        )
      : null;

  if (selectedMessage) {
    return <LeadershipMessageDetailPage person={selectedMessage} />;
  }

  return (
    <section
      id="about"
      className="pt-28 pb-28 relative overflow-hidden min-h-screen"
      style={{
        background: `
          radial-gradient(circle at top right, rgba(201,168,76,0.18), transparent 34%),
          radial-gradient(circle at bottom left, rgba(45,106,79,0.14), transparent 32%),
          linear-gradient(180deg, #FFF8EE 0%, #FBF3DF 100%)
        `,
      }}
    >

      <style>{`
        .about-long-text {
          text-align: justify;
          text-justify: inter-word;
          overflow-wrap: break-word;
          word-break: normal;
          hyphens: auto;
        }

        @media (max-width: 640px) {
          .about-long-text {
            text-align: left;
            hyphens: none;
          }
        }
      `}</style>

      <div
        className="absolute top-0 right-0 w-[520px] h-[520px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(201,168,76,0.12), transparent 70%)",
          filter: "blur(8px)",
        }}
      />

      <div
        className="absolute bottom-0 left-0 w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(45,106,79,0.11), transparent 70%)",
          filter: "blur(8px)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <EditableWrap
          editMode={editMode}
          target={{ type: "pageHeader" }}
          onEditTarget={onEditTarget}
          label="Edit page heading"
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            className="text-center mb-16 rounded-3xl"
            style={{
              outline: editMode
                ? "1px dashed rgba(201,168,76,0.5)"
                : "none",
              outlineOffset: editMode ? "8px" : "0",
            }}
          >
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-5"
              style={{
                background: "rgba(30,58,95,0.07)",
                color: colors.red,
                border: "1px solid rgba(30,58,95,0.14)",
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: colors.red }}
              />
              School Profile
            </div>

            <h1
              className="text-5xl md:text-6xl mb-4"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 850,
                color: colors.dark,
                letterSpacing: "-0.045em",
              }}
            >
              {content.pageTitle}
            </h1>

            <div
              className="w-24 h-1.5 rounded-full mx-auto mb-5"
              style={{
                background: `linear-gradient(90deg, ${colors.red}, ${colors.gold}, ${colors.green})`,
              }}
            />

            <p className="max-w-3xl mx-auto text-base md:text-lg text-slate-500 leading-[1.8]">
              {content.pageSubtitle}
            </p>
          </motion.div>
        </EditableWrap>

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <EditableWrap
            editMode={editMode}
            target={{ type: "storyText" }}
            onEditTarget={onEditTarget}
            label="Edit story text"
          >
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="rounded-3xl"
              style={{
                outline: editMode
                  ? "1px dashed rgba(201,168,76,0.5)"
                  : "none",
                outlineOffset: editMode ? "8px" : "0",
              }}
            >
              <span
                className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-5"
                style={{
                  background: "rgba(201,168,76,0.09)",
                  color: colors.purple,
                  border: "1px solid rgba(201,168,76,0.18)",
                }}
              >
                {content.storyBadge}
              </span>

              <h2
                className="text-4xl md:text-5xl mb-6"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 850,
                  color: colors.dark,
                  lineHeight: 1.1,
                  letterSpacing: "-0.045em",
                }}
              >
                {content.storyTitle}
              </h2>

              <div className="space-y-5">
                {(content.storyParagraphs || []).map((text, idx) => (
                  <p key={idx} className="about-long-text text-base md:text-lg leading-[1.85] text-slate-500">
                    {text}
                  </p>
                ))}
              </div>
            </motion.div>
          </EditableWrap>

          <EditableWrap
            editMode={editMode}
            target={{ type: "storyImage" }}
            onEditTarget={onEditTarget}
            icon={Camera}
            label="Change story image"
          >
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="relative rounded-3xl overflow-hidden h-[460px]"
              style={{
                boxShadow: "0 24px 60px rgba(11,16,32,0.15)",
                border: editMode
                  ? "1px dashed rgba(201,168,76,0.7)"
                  : "none",
              }}
            >
              <AboutImage
                src={content.storyImageUrl}
                alt={content.storyImageAlt}
                imageData={{
                  imageZoom: content.storyImageZoom,
                  imageOffsetX: content.storyImageOffsetX,
                  imageOffsetY: content.storyImageOffsetY,
                }}
              />

              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(11,16,32,0.65) 0%, transparent 60%)",
                }}
              />

              <EditableWrap
                editMode={editMode}
                target={{ type: "storyImageText" }}
                onEditTarget={onEditTarget}
                label="Edit image caption"
                className="absolute bottom-6 left-6 right-6"
              >
                <div
                  className="rounded-2xl p-5"
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    backdropFilter: "blur(18px)",
                    border: editMode
                      ? "1px dashed rgba(255,255,255,0.8)"
                      : "1px solid rgba(255,255,255,0.25)",
                  }}
                >
                  <div
                    className="w-16 h-1 rounded-full mb-4"
                    style={{
                      background: `linear-gradient(90deg, ${colors.gold}, ${colors.cyan})`,
                    }}
                  />

                  <div className="text-white font-bold text-xl">
                    {content.storyImageTitle}
                  </div>

                  <div className="text-white/70 text-sm">
                    {content.storyImageSubtitle}
                  </div>
                </div>
              </EditableWrap>
            </motion.div>
          </EditableWrap>
        </div>

        <div className="mb-24">
          <EditableWrap
            editMode={editMode}
            target={{ type: "pillarHeader" }}
            onEditTarget={onEditTarget}
            label="Edit core values heading"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-8 rounded-3xl"
              style={{
                outline: editMode
                  ? "1px dashed rgba(201,168,76,0.5)"
                  : "none",
                outlineOffset: editMode ? "8px" : "0",
              }}
            >
              <span
                className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
                style={{
                  background: "rgba(45,106,79,0.08)",
                  color: colors.green,
                  border: "1px solid rgba(45,106,79,0.14)",
                }}
              >
                {content.pillarBadge}
              </span>

              <h2
                className="text-4xl md:text-5xl"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 850,
                  color: colors.dark,
                  letterSpacing: "-0.045em",
                }}
              >
                {content.pillarTitle}
              </h2>

              <div
                className="w-20 h-1 rounded-full mx-auto mt-4"
                style={{
                  background: `linear-gradient(90deg, ${colors.red}, ${colors.green}, ${colors.purple})`,
                }}
              />
            </motion.div>
          </EditableWrap>

          <div className="flex justify-end mb-6">
            <SectionAddButton
              editMode={editMode}
              label="Add Core Value"
              type="pillar"
              onAddTarget={onAddTarget}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {visiblePillars.map((p, index) => {
              const cardColor = p.color || colors.green;
              const realIndex = content.pillars.findIndex(
                (item) => item.id === p.id
              );

              return (
                <EditableWrap
                  key={p.id}
                  editMode={editMode}
                  target={{ type: "pillarCard", index: realIndex }}
                  onEditTarget={onEditTarget}
                  onDeleteTarget={onDeleteTarget}
                  canDelete
                  label="Edit core value card"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group p-8 rounded-3xl transition-all duration-300 hover:-translate-y-3 cursor-default"
                    style={{
                      background:
                        "linear-gradient(145deg, rgba(255,255,255,0.96), rgba(255,255,255,0.82))",
                      border: editMode
                        ? "2px dashed rgba(201,168,76,0.55)"
                        : `2px solid ${cardColor}22`,
                      boxShadow: "0 16px 42px rgba(11,16,32,0.08)",
                      backdropFilter: "blur(14px)",
                    }}
                  >
                    <div
                      className="text-3xl font-black tracking-widest mb-4 transition-all duration-300 group-hover:scale-110"
                      style={{ color: cardColor }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <div
                      className="w-16 h-1 rounded-full mb-5 transition-all duration-300 group-hover:w-28"
                      style={{ background: cardColor }}
                    />

                    <div
                      className="font-bold text-2xl mb-3"
                      style={{ color: colors.dark }}
                    >
                      {p.label}
                    </div>

                    <div className="about-long-text text-base text-slate-500 leading-[1.8]">
                      {p.desc}
                    </div>
                  </motion.div>
                </EditableWrap>
              );
            })}
          </div>
        </div>

        <div className="mb-24">
          <EditableWrap
            editMode={editMode}
            target={{ type: "leadershipHeader" }}
            onEditTarget={onEditTarget}
            label="Edit leadership heading"
          >
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-8 rounded-3xl"
              style={{
                outline: editMode
                  ? "1px dashed rgba(201,168,76,0.5)"
                  : "none",
                outlineOffset: editMode ? "8px" : "0",
              }}
            >
              <span
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-5"
                style={{
                  background: "rgba(30,58,95,0.08)",
                  color: colors.red,
                  border: "1px solid rgba(30,58,95,0.16)",
                }}
              >
                <Sparkles className="w-4 h-4" />
                {content.leadershipBadge}
              </span>

              <h2
                className="text-4xl md:text-5xl mb-4"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 850,
                  color: colors.dark,
                  letterSpacing: "-0.045em",
                }}
              >
                {content.leadershipTitle}
              </h2>

              <p className="about-long-text max-w-3xl mx-auto text-base md:text-lg leading-[1.8] text-slate-500 text-left md:text-justify">
                {content.leadershipDescription}
              </p>
            </motion.div>
          </EditableWrap>

          <div className="flex justify-end mb-6">
            <SectionAddButton
              editMode={editMode}
              label="Add Message"
              type="message"
              onAddTarget={onAddTarget}
            />
          </div>

          <div className="space-y-10">
            {visibleMessages.map((person, index) => {
              const realIndex = content.messages.findIndex(
                (item) => item.id === person.id
              );

              return (
                <MessageCard
                  key={person.id || index}
                  person={person}
                  index={realIndex}
                  editMode={editMode}
                  onEditTarget={onEditTarget}
                  onDeleteTarget={onDeleteTarget}
                />
              );
            })}
          </div>
        </div>

        <div className="mb-6 flex justify-end">
          <SectionAddButton
            editMode={editMode}
            label="Add Mission / Vision Card"
            type="missionVision"
            onAddTarget={onAddTarget}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-24">
          {visibleMissionVision.map((item, index) => {
            const realIndex = content.missionVision.findIndex(
              (mv) => mv.id === item.id
            );
            const mvColor = item.color || colors.green;
            const gradientColors =
              index === 0
                ? `linear-gradient(135deg, ${colors.purple}15, ${colors.softPurple}08)`
                : `linear-gradient(135deg, ${colors.green}15, ${colors.lightGreen}08)`;
            const borderColors = index === 0 ? colors.purple : colors.green;

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
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.65, delay: index * 0.1 }}
                  className="group rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2 cursor-default"
                  style={{
                    background: gradientColors,
                    border: editMode
                      ? "2px dashed rgba(201,168,76,0.55)"
                      : `2px solid ${borderColors}22`,
                    boxShadow: "0 18px 48px rgba(11,16,32,0.06)",
                  }}
                >
                  <div
                    className="text-2xl font-black tracking-widest mb-4 transition-all duration-300 group-hover:scale-110"
                    style={{ color: mvColor }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div
                    className="w-20 h-1 rounded-full mb-6 transition-all duration-300 group-hover:w-32"
                    style={{ background: mvColor }}
                  />

                  <h3
                    className="text-3xl mb-4"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 850,
                      color: colors.dark,
                      letterSpacing: "-0.035em",
                    }}
                  >
                    {item.title}
                  </h3>

                  <p className="about-long-text text-base leading-[1.8] text-slate-600">
                    {item.desc}
                  </p>
                </motion.div>
              </EditableWrap>
            );
          })}
        </div>

        <div>
          <EditableWrap
            editMode={editMode}
            target={{ type: "journeyHeader" }}
            onEditTarget={onEditTarget}
            label="Edit journey heading"
          >
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65 }}
              className="text-center mb-8 rounded-3xl"
              style={{
                outline: editMode
                  ? "1px dashed rgba(201,168,76,0.5)"
                  : "none",
                outlineOffset: editMode ? "8px" : "0",
              }}
            >
              <span
                className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
                style={{
                  background: "rgba(30,58,95,0.08)",
                  color: colors.red,
                  border: "1px solid rgba(30,58,95,0.14)",
                }}
              >
                {content.timelineBadge}
              </span>

              <h2
                className="text-4xl md:text-5xl"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 850,
                  color: colors.dark,
                  letterSpacing: "-0.045em",
                }}
              >
                {content.journeyTitle}
              </h2>

              <div
                className="w-20 h-1 rounded-full mx-auto mt-4"
                style={{
                  background: `linear-gradient(90deg, ${colors.red}, ${colors.orange}, ${colors.gold})`,
                }}
              />
            </motion.div>
          </EditableWrap>

          <div className="flex justify-end mb-6">
            <SectionAddButton
              editMode={editMode}
              label="Add Journey"
              type="journey"
              onAddTarget={onAddTarget}
            />
          </div>

          <div className="relative max-w-5xl mx-auto">
            {/* Dashed center rail — only meaningful once the columns split on desktop */}
            <div
              className="hidden md:block absolute left-1/2 -translate-x-1/2 top-2 bottom-2 w-px"
              style={{
                backgroundImage: `repeating-linear-gradient(180deg, ${colors.gold} 0px, ${colors.gold} 10px, transparent 10px, transparent 20px)`,
              }}
            />

            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-x-6 gap-y-6 md:gap-y-10">
              {visibleJourney.map((item, index) => {
                const realIndex = content.journey.findIndex(
                  (j) => j.id === item.id
                );
                const journeyColors = [
                  colors.red,
                  colors.orange,
                  colors.gold,
                  colors.green,
                ];
                const journeyColor =
                  journeyColors[index % journeyColors.length];
                const isLeft = index % 2 === 0;

                const cardEl = (
                  <EditableWrap
                    editMode={editMode}
                    target={{ type: "journeyItem", index: realIndex }}
                    onEditTarget={onEditTarget}
                    onDeleteTarget={onDeleteTarget}
                    canDelete
                    label="Edit journey item"
                  >
                    <motion.div
                      initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.55, delay: index * 0.08 }}
                      className="rounded-2xl p-6 md:p-7 transition-all duration-300 hover:-translate-y-1"
                      style={{
                        background:
                          "linear-gradient(145deg, rgba(255,255,255,0.97), rgba(255,255,255,0.82))",
                        border: editMode
                          ? "2px dashed rgba(201,168,76,0.55)"
                          : `1px solid ${journeyColor}25`,
                        boxShadow: "0 14px 38px rgba(11,16,32,0.06)",
                      }}
                    >
                      <div
                        className="text-xs font-black tracking-widest uppercase mb-2"
                        style={{ color: journeyColor }}
                      >
                        {item.year}
                      </div>

                      <h3
                        className="text-2xl mb-2"
                        style={{
                          fontFamily: "var(--font-display)",
                          fontWeight: 850,
                          color: colors.dark,
                          letterSpacing: "-0.025em",
                        }}
                      >
                        {item.title}
                      </h3>

                      <p className="about-long-text text-base leading-[1.8] text-slate-500">
                        {item.desc}
                      </p>
                    </motion.div>
                  </EditableWrap>
                );

                return (
                  <div key={item.id} className="contents">
                    <div className={isLeft ? "" : "hidden md:block"}>
                      {isLeft && cardEl}
                    </div>

                    <div className="flex md:flex-col items-center justify-center gap-2 order-first md:order-none">
                      <div
                        className="w-10 h-10 md:w-12 md:h-12 rotate-45 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{
                          background: `linear-gradient(135deg, ${journeyColor}, ${colors.dark})`,
                          boxShadow: `0 10px 26px ${journeyColor}55`,
                        }}
                      >
                        <span className="-rotate-45 text-white text-xs font-black">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                    </div>

                    <div className={!isLeft ? "" : "hidden md:block"}>
                      {!isLeft && cardEl}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;