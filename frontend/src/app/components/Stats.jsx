// HomePage.jsx
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  Camera, 
  Pencil, 
  X, 
  BookOpen, 
  Users, 
  Award, 
  Calendar, 
  ChevronRight,
  GraduationCap,
  School,
  Sparkles,
  Star,
  Heart,
  Globe,
  TrendingUp,
  Clock
} from "lucide-react";
import PdfNoticePreview from "./PdfNoticePreview";
import HomeAnnouncementPopup from "./HomeAnnouncementPopup";

// New modern color palette
const palette = {
  primary: "#1E3A5F",      // Deep navy
  secondary: "#2D6A4F",    // Forest green
  accent: "#E9C46A",       // Warm gold
  accent2: "#F4A261",      // Warm orange
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

export const defaultStatsSectionData = {
  eyebrow: "Our Impact",
  title: "Creating Futures, One Student at a Time",
  description: "Real numbers that reflect our commitment to excellence and holistic education in the Makwanpur region.",
  stats: [
    {
      value: "3800",
      suffix: "+",
      label: "Students Enrolled",
      note: "Across school programs",
      color: palette.primary,
    },
    {
      value: "240",
      suffix: "+",
      label: "Expert Teachers",
      note: "Academic and support team",
      color: palette.secondary,
    },
    {
      value: "35",
      suffix: " yrs",
      label: "Years of Excellence",
      note: "Serving Makwanpur",
      color: palette.accent,
    },
    {
      value: "98",
      suffix: "%",
      label: "Success Rate",
      note: "Academic performance",
      color: palette.accent2,
    },
  ],
  story: {
    badge: "Our Story",
    title: "Building Tomorrow's Leaders Today",
    paragraphs: [
      "Established with a vision to provide quality education in Makawanpur, Smriti Secondary English Boarding School has grown as one of Hetauda's respected academic institutions.",
      "With students from Play Group to Grade 10, the school focuses on academic discipline, values, creativity, digital learning, and holistic student development.",
    ],
    buttonText: "Read Our Story",
    buttonLink: "/about",
    image: "https://images.unsplash.com/photo-1588072432836-e10032774350?w=1000&h=800&fit=crop&auto=format",
    imageZoom: 1,
    imageOffsetX: 0,
    imageOffsetY: 0,
    imageTopTitle: "Smriti School",
    imageTopSubtitle: "Hetauda-2, Makwanpur",
    imageBottomTitle: "Quality Education Since 2046 BS",
    imageBottomDescription: "This image and text can later come from the admin dashboard.",
  },
  excellence: {
    title: "Academic Excellence",
    description: "Our students consistently achieve outstanding results in the SEE examinations under NEB.",
    cards: [
      {
        title: "Best SEE Results",
        description: "Consistently achieving top results in the Secondary Education Examination under the National Examination Board.",
      },
      {
        title: "GPA 4.00 Achievers",
        description: "Our brightest students attain a perfect GPA of 4.00, a testament to our teaching quality and student dedication.",
      },
      {
        title: "Holistic Development",
        description: "Beyond academics, we foster creativity, leadership, and sportsmanship through diverse extracurricular programs.",
      },
    ],
  },
  notices: {
    title: "Latest Notices",
    description: "Stay informed with the latest announcements.",
  },
};

export function mergeStatsSectionData(saved = {}) {
  const savedStats = saved || {};
  return {
    ...defaultStatsSectionData,
    ...savedStats,
    stats: Array.isArray(savedStats.stats) && savedStats.stats.length > 0
      ? defaultStatsSectionData.stats.map((item, index) => ({
          ...item,
          ...(savedStats.stats[index] || {}),
          color: item.color,
        }))
      : defaultStatsSectionData.stats,
    story: {
      ...defaultStatsSectionData.story,
      ...(savedStats.story || {}),
      paragraphs: Array.isArray(savedStats.story?.paragraphs) && savedStats.story.paragraphs.length > 0
        ? [savedStats.story.paragraphs[0] || "", savedStats.story.paragraphs[1] || ""]
        : defaultStatsSectionData.story.paragraphs,
      imageZoom: clampStoryImageZoom(savedStats.story?.imageZoom),
      imageOffsetX: clampStoryImageOffset(savedStats.story?.imageOffsetX),
      imageOffsetY: clampStoryImageOffset(savedStats.story?.imageOffsetY),
    },
    excellence: {
      ...defaultStatsSectionData.excellence,
      ...(savedStats.excellence || {}),
      cards: Array.isArray(savedStats.excellence?.cards) && savedStats.excellence.cards.length > 0
        ? defaultStatsSectionData.excellence.cards.map((item, index) => ({
            ...item,
            ...(savedStats.excellence.cards[index] || {}),
          }))
        : defaultStatsSectionData.excellence.cards,
    },
    notices: {
      ...defaultStatsSectionData.notices,
      ...(savedStats.notices || {}),
    },
  };
}

function clampStoryImageOffset(value) {
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue)) return 0;
  return Math.min(60, Math.max(-60, numberValue));
}

function clampStoryImageZoom(value) {
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue)) return 1;
  return Math.min(3, Math.max(1, numberValue));
}

function getStoryImageCropStyle(story = {}) {
  const zoom = clampStoryImageZoom(story.imageZoom);
  const x = clampStoryImageOffset(story.imageOffsetX);
  const y = clampStoryImageOffset(story.imageOffsetY);
  return {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center",
    transform: `translate(${x}%, ${y}%) scale(${zoom})`,
    transformOrigin: "center center",
    opacity: 0.85,
  };
}

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
      style={{
        background: palette.gradient2,
        color: palette.dark,
        border: `2px solid ${palette.white}`,
      }}
      title={label}
    >
      <Icon className="w-3.5 h-3.5" />
    </button>
  );
}

function EditableWrap({ editMode, target, onEditTarget, icon = Pencil, label = "Edit", className = "", children }) {
  if (!editMode) return children;
  return (
    <div className={`relative group ${className}`}>
      {children}
      <EditIconButton editMode={editMode} target={target} onEditTarget={onEditTarget} icon={icon} label={label} />
    </div>
  );
}

function Counter({ target, suffix, editMode = false }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const numericTarget = Number.parseInt(String(target || "0"), 10) || 0;

  useEffect(() => {
    if (editMode) {
      setCount(numericTarget);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCount(0);
          const duration = 1500;
          const start = performance.now();
          const animate = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(numericTarget * eased));
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [numericTarget, editMode]);

  return <span ref={ref}>{count}{suffix}</span>;
}

const formatNoticeDate = (dateValue) => {
  if (!dateValue) return "No date";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return dateValue;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getNoticeExcerpt = (notice) => {
  const text = notice?.description || notice?.content || "Click to read the full school notice and important update.";
  return text.length > 110 ? `${text.slice(0, 110)}...` : text;
};

// Modern card component with gradient accents
function ModernCard({ children, className = "", gradient = false, hover = true }) {
  return (
    <div
      className={`rounded-2xl p-6 transition-all duration-300 ${hover ? 'hover:-translate-y-1 hover:shadow-2xl' : ''} ${className}`}
      style={{
        background: gradient ? palette.gradient1 : palette.white,
        boxShadow: "0 4px 20px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)",
        border: `1px solid ${palette.lightGray}`,
      }}
    >
      {children}
    </div>
  );
}

// Section header component
function SectionHeader({ badge, title, description, editMode, onEditTarget }) {
  return (
    <EditableWrap editMode={editMode} target={{ type: "sectionHeader" }} onEditTarget={onEditTarget} label="Edit section header">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span 
          className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide mb-4"
          style={{
            background: "rgba(30, 58, 95, 0.08)",
            color: palette.primary,
          }}
        >
          {badge}
        </span>
        <h2 
          className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
          style={{ 
            color: palette.dark,
            fontFamily: "var(--font-display)",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
          }}
        >
          {title}
        </h2>
        {description && (
          <p 
            className="text-lg leading-relaxed max-w-2xl mx-auto"
            style={{ color: palette.gray }}
          >
            {description}
          </p>
        )}
        <div 
          className="w-16 h-1 rounded-full mx-auto mt-4"
          style={{ background: palette.gradient2 }}
        />
      </div>
    </EditableWrap>
  );
}

function Stats({ editMode = false, contentOverride = null, onEditTarget = () => {} }) {
  const [statsData, setStatsData] = useState(() =>
    mergeStatsSectionData(contentOverride || defaultStatsSectionData)
  );
  const [notices, setNotices] = useState([]);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const storyImageUrl = String(statsData.story?.image || "").trim();

  useEffect(() => {
    if (contentOverride) {
      setStatsData(mergeStatsSectionData(contentOverride));
      return;
    }
    let alive = true;
    const loadStatsContent = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/site-content/home`, { timeout: 10000 });
        if (!alive) return;
        const savedStats = res.data?.data?.content?.statsSection;
        setStatsData(mergeStatsSectionData(savedStats || defaultStatsSectionData));
      } catch (error) {
        console.error("Stats content load error:", error);
        if (alive) {
          setStatsData(mergeStatsSectionData(defaultStatsSectionData));
        }
      }
    };
    loadStatsContent();
    return () => { alive = false; };
  }, [contentOverride]);

  useEffect(() => {
    if (editMode) return undefined;
    let alive = true;
    fetch(`${API_URL}/api/notices`)
      .then((res) => res.json())
      .then((data) => {
        if (!alive) return;
        const noticeList = Array.isArray(data) ? data : data?.data || [];
        setNotices(noticeList.slice(0, 3));
      })
      .catch((err) => console.log(err));
    return () => { alive = false; };
  }, [editMode]);

  return (
    <>
      {!editMode && <HomeAnnouncementPopup />}
      
      <section className="relative overflow-hidden py-16 md:py-24" style={{ background: palette.light }}>
        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div 
            className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-5"
            style={{ background: palette.primary }}
          />
          <div 
            className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-5"
            style={{ background: palette.secondary }}
          />
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-[0.02]"
            style={{ background: palette.accent }}
          />
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-5 sm:px-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-16 md:mb-24">
            {statsData.stats.map((stat, i) => {
              return (
              <EditableWrap
                key={`${stat.label}-${i}`}
                editMode={editMode}
                target={{ type: "statsCard", index: i }}
                onEditTarget={onEditTarget}
                label="Edit number card"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="group relative overflow-hidden rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-2"
                  style={{
                    background: `linear-gradient(160deg, ${stat.color}17 0%, ${palette.white} 60%)`,
                    border: `1px solid ${stat.color}30`,
                    boxShadow: `0 4px 22px ${stat.color}1f`,
                  }}
                >
                  <div
                    className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-[0.10] transition-transform duration-300 group-hover:scale-125"
                    style={{ background: stat.color }}
                  />
                  <div 
                    className="absolute top-0 left-0 right-0 h-1 transition-all duration-300 group-hover:h-1.5"
                    style={{ background: stat.color }}
                  />
                  <div className="relative pt-2">
                    <div 
                      className="text-4xl md:text-5xl font-bold mb-1"
                      style={{ color: palette.dark }}
                    >
                      <Counter target={stat.value} suffix={stat.suffix} editMode={editMode} />
                    </div>
                    <div className="text-sm font-semibold" style={{ color: palette.primary }}>
                      {stat.label}
                    </div>
                    <div className="text-xs mt-1" style={{ color: palette.gray }}>
                      {stat.note}
                    </div>
                  </div>
                </motion.div>
              </EditableWrap>
              );
            })}
          </div>

          {/* Story Section - New Layout */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center mb-16 md:mb-24"
          >
            <EditableWrap
              editMode={editMode}
              target={{ type: "storyImage" }}
              onEditTarget={onEditTarget}
              icon={Camera}
              label="Change story image"
            >
              <div 
                className="relative rounded-2xl overflow-hidden min-h-[300px] md:min-h-[400px]"
                style={{
                  background: palette.dark,
                  boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
                }}
              >
                {storyImageUrl ? (
                  <img
                    key={storyImageUrl}
                    src={storyImageUrl}
                    alt="Smriti school"
                    draggable={false}
                    className="absolute inset-0"
                    style={getStoryImageCropStyle(statsData.story)}
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 text-gray-400">
                    <Camera className="w-12 h-12 mb-2" />
                    <div className="text-xs font-bold uppercase tracking-wider">Add Story Image</div>
                  </div>
                )}
                <div 
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(to top, rgba(26,26,46,0.6) 0%, rgba(26,26,46,0.1) 50%, rgba(26,26,46,0.3) 100%)",
                  }}
                />
                <EditableWrap
                  editMode={editMode}
                  target={{ type: "storyImageText" }}
                  onEditTarget={onEditTarget}
                  label="Edit image text"
                  className="absolute inset-0"
                >
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div 
                      className="backdrop-blur-sm rounded-xl p-4"
                      style={{
                        background: "rgba(255,255,255,0.12)",
                        border: "1px solid rgba(255,255,255,0.15)",
                      }}
                    >
                      <div className="text-white text-lg font-bold">
                        {statsData.story.imageBottomTitle}
                      </div>
                      <div className="text-white/70 text-sm mt-1">
                        {statsData.story.imageBottomDescription}
                      </div>
                    </div>
                  </div>
                </EditableWrap>
              </div>
            </EditableWrap>

            <div>
              <EditableWrap
                editMode={editMode}
                target={{ type: "storyText" }}
                onEditTarget={onEditTarget}
                label="Edit story text"
              >
                <div>
                  <span 
                    className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide mb-4"
                    style={{
                      background: "rgba(45, 106, 79, 0.1)",
                      color: palette.secondary,
                    }}
                  >
                    {statsData.story.badge}
                  </span>
                  <h2 
                    className="text-3xl md:text-4xl font-bold mb-4"
                    style={{ 
                      color: palette.dark,
                      fontFamily: "var(--font-display)",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {statsData.story.title}
                  </h2>
                  <div className="space-y-4 mb-6">
                    {statsData.story.paragraphs.map((text, index) => (
                      <p 
                        key={index} 
                        className="text-base md:text-lg leading-relaxed"
                        style={{ color: palette.gray }}
                      >
                        {text}
                      </p>
                    ))}
                  </div>
                </div>
              </EditableWrap>
              <EditableWrap
                editMode={editMode}
                target={{ type: "storyButton" }}
                onEditTarget={onEditTarget}
                label="Edit story button"
                className="inline-block"
              >
                <Link
                  to={statsData.story.buttonLink || "/about"}
                  onClick={(e) => {
                    if (editMode) {
                      e.preventDefault();
                      return;
                    }
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 hover:gap-3 hover:-translate-y-0.5 group"
                  style={{
                    color: palette.white,
                    background: palette.gradient1,
                    boxShadow: "0 8px 24px rgba(30, 58, 95, 0.25)",
                  }}
                >
                  {statsData.story.buttonText}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </EditableWrap>
            </div>
          </motion.div>

          {/* Excellence Cards - Redesigned */}
          <div className="mb-16 md:mb-24">
            <SectionHeader
              badge="Academic Focus"
              title={statsData.excellence.title}
              description={statsData.excellence.description}
              editMode={editMode}
              onEditTarget={onEditTarget}
            />

            <div className="grid md:grid-cols-3 gap-6">
              {statsData.excellence.cards.map((card, i) => {
                const gradients = [
                  "linear-gradient(135deg, #1E3A5F 0%, #2D6A4F 100%)",
                  "linear-gradient(135deg, #2D6A4F 0%, #1E3A5F 100%)",
                  "linear-gradient(135deg, #E9C46A 0%, #F4A261 100%)",
                ];
                const cardTints = [palette.primary, palette.secondary, palette.accent2];
                const tint = cardTints[i % cardTints.length];
                
                return (
                  <EditableWrap
                    key={`${card.title}-${i}`}
                    editMode={editMode}
                    target={{ type: "excellenceCard", index: i }}
                    onEditTarget={onEditTarget}
                    label="Edit excellence card"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false, amount: 0.25 }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      className="group relative overflow-hidden rounded-2xl p-6 md:p-8 transition-all duration-300 hover:-translate-y-2"
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
                      <div 
                        className="absolute top-0 left-0 right-0 h-1.5 transition-all duration-300 group-hover:h-2"
                        style={{ background: gradients[i % gradients.length] }}
                      />
                      <div className="relative pt-4">
                        <h3 
                          className="text-xl font-bold mb-2"
                          style={{ color: palette.dark }}
                        >
                          {card.title}
                        </h3>
                        <p className="text-sm leading-relaxed" style={{ color: palette.gray }}>
                          {card.description}
                        </p>
                      </div>
                    </motion.div>
                  </EditableWrap>
                );
              })}
            </div>
          </div>

          {/* Notices Section - Redesigned */}
          {!editMode && (
            <div>
              <div className="flex items-center justify-between gap-6 mb-8">
                <div>
                  <span 
                    className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide mb-3"
                    style={{
                      background: "rgba(233, 196, 106, 0.15)",
                      color: palette.accent2,
                    }}
                  >
                    School Notice Board
                  </span>
                  <h2 
                    className="text-2xl md:text-3xl font-bold"
                    style={{ color: palette.dark }}
                  >
                    {statsData.notices.title}
                  </h2>
                  <p className="text-sm" style={{ color: palette.gray }}>
                    {statsData.notices.description}
                  </p>
                </div>
                <Link
                  to="/notices"
                  className="hidden md:inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-300 hover:gap-3"
                  style={{
                    color: palette.white,
                    background: palette.gradient1,
                    boxShadow: "0 8px 20px rgba(30, 58, 95, 0.2)",
                  }}
                >
                  View All <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {notices.length === 0 ? (
                <div 
                  className="rounded-2xl p-10 text-center"
                  style={{
                    background: palette.white,
                    border: `2px dashed ${palette.lightGray}`,
                  }}
                >
                  <Calendar className="w-12 h-12 mx-auto mb-3" style={{ color: palette.gray }} />
                  <h3 className="text-xl font-bold mb-1" style={{ color: palette.dark }}>
                    No notices available right now
                  </h3>
                  <p className="text-sm" style={{ color: palette.gray }}>
                    New school notices will appear here once added from the admin panel.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {notices.map((notice, i) => {
                    const noticeId = notice.id || notice._id;
                    const noticeDate = notice.notice_date || notice.date;
                    const hasPdf = Boolean(notice.pdf_url || notice.pdfUrl);
                    const colors = [palette.primary, palette.secondary, palette.accent2];

                    return (
                      <motion.div
                        key={noticeId || notice.title || i}
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, amount: 0.25 }}
                        transition={{ duration: 0.4, delay: i * 0.06 }}
                      >
                        <button
                          type="button"
                          onClick={() => setSelectedNotice(notice)}
                          className="group w-full text-left transition-all duration-300 hover:-translate-y-0.5"
                        >
                          <div 
                            className="rounded-2xl p-5 md:p-6 transition-all duration-300 group-hover:shadow-lg"
                            style={{
                              background: `linear-gradient(120deg, ${colors[i % colors.length]}12 0%, ${palette.white} 65%)`,
                              border: `1px solid ${palette.lightGray}`,
                              borderLeftWidth: "4px",
                              borderLeftColor: colors[i % colors.length],
                              boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
                            }}
                          >
                            <div className="flex flex-col md:flex-row md:items-center gap-4">
                              <div 
                                className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                                style={{
                                  background: colors[i % colors.length],
                                  color: palette.white,
                                }}
                              >
                                <Calendar className="w-5 h-5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                  <span 
                                    className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
                                    style={{
                                      background: "rgba(30, 58, 95, 0.08)",
                                      color: palette.primary,
                                    }}
                                  >
                                    {notice.category || "Notice"}
                                  </span>
                                  {hasPdf && (
                                    <span 
                                      className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
                                      style={{
                                        background: "rgba(233, 196, 106, 0.2)",
                                        color: palette.accent2,
                                      }}
                                    >
                                      PDF
                                    </span>
                                  )}
                                </div>
                                <h3 
                                  className="text-lg font-bold truncate"
                                  style={{ color: palette.dark }}
                                >
                                  {notice.title || "School Notice"}
                                </h3>
                                <p className="text-sm line-clamp-1" style={{ color: palette.gray }}>
                                  {getNoticeExcerpt(notice)}
                                </p>
                              </div>
                              <div className="flex-shrink-0 text-right">
                                <div className="text-xs font-semibold" style={{ color: palette.gray }}>
                                  {formatNoticeDate(noticeDate)}
                                </div>
                                <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: palette.primary }} />
                              </div>
                            </div>
                          </div>
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Notice Modal */}
        {selectedNotice && (
          <div
            className="fixed inset-0 z-[200] flex items-center justify-center px-4 py-5"
            style={{
              background: "rgba(26,26,46,0.8)",
              backdropFilter: "blur(12px)",
            }}
            onClick={() => setSelectedNotice(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-3xl rounded-2xl overflow-hidden"
              style={{
                background: palette.white,
                boxShadow: "0 40px 100px rgba(0,0,0,0.3)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div 
                className="h-1.5"
                style={{ background: palette.gradient1 }}
              />
              <div className="p-6 md:p-8">
                <button
                  type="button"
                  onClick={() => setSelectedNotice(null)}
                  className="absolute right-4 top-4 z-20 w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-105"
                  style={{
                    background: palette.lightGray,
                    color: palette.dark,
                  }}
                >
                  <X className="w-4 h-4" />
                </button>
                <h2 
                  className="text-2xl md:text-3xl font-bold mb-3 pr-8"
                  style={{ color: palette.dark }}
                >
                  {selectedNotice.title || "School Notice"}
                </h2>
                <div className="flex items-center gap-3 mb-4">
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{
                      background: "rgba(30, 58, 95, 0.08)",
                      color: palette.primary,
                    }}
                  >
                    {selectedNotice.category || "Notice"}
                  </span>
                  <span className="text-xs" style={{ color: palette.gray }}>
                    {formatNoticeDate(selectedNotice.notice_date || selectedNotice.date)}
                  </span>
                </div>
                <div 
                  className="rounded-xl p-5"
                  style={{
                    background: palette.light,
                    border: `1px solid ${palette.lightGray}`,
                  }}
                >
                  <p className="text-base leading-relaxed whitespace-pre-line" style={{ color: palette.dark }}>
                    {selectedNotice.description || selectedNotice.content || "No description added for this notice."}
                  </p>
                </div>
                {(selectedNotice.pdf_url || selectedNotice.pdfUrl) && (
                  <div className="mt-4">
                    <PdfNoticePreview
                      fileUrl={selectedNotice.pdf_url || selectedNotice.pdfUrl}
                      title={selectedNotice.title || "Notice PDF"}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </section>
    </>
  );
}

export { Stats };
export default Stats;