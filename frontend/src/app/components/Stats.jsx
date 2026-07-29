import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Camera, Pencil, X, Calendar, Bell, FileText, ChevronRight, Award, CheckCircle2, Sparkles, BookOpen, ShieldCheck } from "lucide-react";
import PdfNoticePreview from "./PdfNoticePreview";
import HomeAnnouncementPopup from "./HomeAnnouncementPopup";

const palette = {
  blue: "#2563EB",
  red: "#EF4444",
  sky: "#38BDF8",
  crimson: "#DC2626",
};

const API_URL = "https://school-website-backend-ixx2.onrender.com";

export const defaultStatsSectionData = {
  eyebrow: "Smriti Highlights",
  title: "Numbers reflecting two decades of educational excellence.",
  description:
    "Smriti Secondary English School has been empowering young minds through dedicated faculty, modern digital infrastructure, practical science, and outstanding SEE results.",

  stats: [
    {
      value: "2500",
      suffix: "+",
      label: "Students Enrolled",
      note: "From PG to Grade 10",
      color: palette.blue,
    },
    {
      value: "140",
      suffix: "+",
      label: "Dedicated Educators",
      note: "Expert teaching faculty",
      color: palette.red,
    },
    {
      value: "20",
      suffix: " yrs",
      label: "Years of Excellence",
      note: "Empowering Nepal's youth",
      color: palette.sky,
    },
    {
      value: "99.2",
      suffix: "%",
      label: "SEE Board Pass Rate",
      note: "Top exam achievement",
      color: palette.crimson,
    },
  ],

  story: {
    badge: "About Smriti School",
    title: "Nurturing Character & Inspiring Academic Success",
    paragraphs: [
      "Founded with a mission to deliver quality education, Smriti Secondary English School has developed into a premier educational institution built on values, curiosity, and care.",
      "From Early Years to Grade 10, our school combines interactive digital learning, practical science labs, creative arts, and athletics to guide every student toward leadership.",
    ],
    buttonText: "Discover Our Journey",
    buttonLink: "#about",
    image:
      "https://images.unsplash.com/photo-1588072432836-e10032774350?w=1000&h=800&fit=crop&auto=format",
    imageZoom: 1,
    imageOffsetX: 0,
    imageOffsetY: 0,
    imageTopTitle: "Smriti School Campus",
    imageTopSubtitle: "Kathmandu / Hetauda, Nepal",
    imageBottomTitle: "Building Tomorrow's Leaders Today",
    imageBottomDescription:
      "Empowering young minds with modern digital computer learning, science experiments, and strong moral character.",
  },

  excellence: {
    title: "Academic & Co-Curricular Distinction",
    description:
      "Our students consistently achieve outstanding results in national examinations and regional competitions.",
    cards: [
      {
        title: "Top SEE Board Performance",
        description:
          "Consistently securing top pass rates and high distinction grades under the National Examination Board.",
      },
      {
        title: "GPA 4.00 Achievers",
        description:
          "Dedicated study programs and expert teacher mentorship produce top GPA achievers every academic session.",
      },
      {
        title: "Holistic Youth Development",
        description:
          "Combining digital literacy, science innovation, robotics clubs, sports, and leadership experiences.",
      },
    ],
  },

  notices: {
    title: "Official Notices & School Announcements",
    description: "Stay informed with school updates, examination schedules, and holiday notices.",
  },
};

export function mergeStatsSectionData(saved = {}) {
  const savedStats = saved || {};

  return {
    ...defaultStatsSectionData,
    ...savedStats,
    stats:
      Array.isArray(savedStats.stats) && savedStats.stats.length > 0
        ? defaultStatsSectionData.stats.map((item, index) => ({
            ...item,
            ...(savedStats.stats[index] || {}),
            color: item.color,
          }))
        : defaultStatsSectionData.stats,
    story: {
      ...defaultStatsSectionData.story,
      ...(savedStats.story || {}),
      paragraphs:
        Array.isArray(savedStats.story?.paragraphs) &&
        savedStats.story.paragraphs.length > 0
          ? [
              savedStats.story.paragraphs[0] || defaultStatsSectionData.story.paragraphs[0],
              savedStats.story.paragraphs[1] || defaultStatsSectionData.story.paragraphs[1],
            ]
          : defaultStatsSectionData.story.paragraphs,
    },
    excellence: {
      ...defaultStatsSectionData.excellence,
      ...(savedStats.excellence || {}),
    },
    notices: {
      ...defaultStatsSectionData.notices,
      ...(savedStats.notices || {}),
    },
  };
}

function Counter({ target, suffix, editMode = false }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const numericTarget = Number.parseFloat(String(target || "0")) || 0;

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
            const current = numericTarget % 1 === 0 ? Math.floor(numericTarget * eased) : (numericTarget * eased).toFixed(1);
            setCount(current);

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

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

const FALLBACK_NOTICES = [
  {
    _id: "1",
    title: "Admissions Open for Session 2083 - Smriti School",
    date: "2026-03-01",
    description: "Application forms for new admissions in Play Group to Grade 9 are now available online and at the front office.",
    category: "Admission"
  },
  {
    _id: "2",
    title: "SEE Examination Routine & Preparation Guidelines",
    date: "2026-02-24",
    description: "Routine and instructions for Grade 10 SEE candidates prepared by NEB academic coordinators.",
    category: "Exam"
  },
  {
    _id: "3",
    title: "Annual Sports Week & Science Fair 2083",
    date: "2026-02-18",
    description: "Student registration is open for inter-house athletics, science model displays, and cultural competitions.",
    category: "Event"
  }
];

export function Stats({ editMode = false, contentOverride = null, onEditTarget = () => {} }) {
  const [statsData, setStatsData] = useState(() => mergeStatsSectionData(contentOverride || defaultStatsSectionData));
  const [notices, setNotices] = useState(FALLBACK_NOTICES);
  const [selectedNotice, setSelectedNotice] = useState(null);

  useEffect(() => {
    if (contentOverride) {
      setStatsData(mergeStatsSectionData(contentOverride));
    }
  }, [contentOverride]);

  return (
    <>
      {!editMode && <HomeAnnouncementPopup />}

      <section id="about" className="py-16 sm:py-24 bg-slate-50 relative overflow-hidden">
        <div className="max-w-[1450px] mx-auto px-5 sm:px-8 relative z-10">
          {/* Highlights Header */}
          <div className="mb-14 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-red-600 bg-red-100/80 border border-red-200 mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{statsData.eyebrow}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                {statsData.title}
              </h2>
            </div>
            <p className="max-w-xl text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
              {statsData.description}
            </p>
          </div>

          {/* Stats grid cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {statsData.stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="rounded-3xl p-7 bg-white border border-slate-200/90 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 group"
              >
                <div className="w-12 h-1.5 rounded-full mb-6 transition-all duration-300 group-hover:w-20" style={{ background: stat.color }} />
                <div className="text-4xl sm:text-5xl font-black text-slate-950 mb-2 tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                  <Counter target={stat.value} suffix={stat.suffix} editMode={editMode} />
                </div>
                <div className="text-lg font-bold text-slate-800">{stat.label}</div>
                <div className="text-sm text-slate-500 font-medium mt-1">{stat.note}</div>
              </motion.div>
            ))}
          </div>

          {/* Story Card */}
          <div className="grid lg:grid-cols-2 gap-10 items-center mb-24">
            <div className="relative rounded-[2.5rem] overflow-hidden min-h-[350px] sm:min-h-[420px] bg-slate-900 border border-slate-200 shadow-2xl group">
              <img
                src={statsData.story.image}
                alt="Smriti School"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 p-6 rounded-3xl bg-slate-900/80 backdrop-blur-md border border-white/20 text-white">
                <div className="text-xs font-bold uppercase text-red-400 mb-1">{statsData.story.imageTopTitle}</div>
                <h4 className="text-xl font-black text-white">{statsData.story.imageBottomTitle}</h4>
                <p className="text-xs text-slate-300 mt-1">{statsData.story.imageBottomDescription}</p>
              </div>
            </div>

            <div>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-blue-700 bg-blue-100/80 border border-blue-200 mb-4">
                <ShieldCheck className="w-4 h-4" />
                <span>{statsData.story.badge}</span>
              </span>

              <h3 className="text-3xl sm:text-4xl font-black text-slate-950 mb-6 leading-tight" style={{ fontFamily: "var(--font-display)" }}>
                {statsData.story.title}
              </h3>

              <div className="space-y-4 text-slate-600 text-base sm:text-lg leading-relaxed font-medium mb-8">
                {statsData.story.paragraphs.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              <a
                href={statsData.story.buttonLink}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-white bg-slate-950 hover:bg-blue-600 transition-all duration-300 shadow-lg hover:scale-105 text-base"
              >
                <span>{statsData.story.buttonText}</span>
                <ArrowRight className="w-5 h-5 text-red-400" />
              </a>
            </div>
          </div>

          {/* Excellence Section */}
          <div className="mb-24">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-black uppercase tracking-widest text-red-600 bg-red-50 px-4 py-1.5 rounded-full border border-red-200 inline-block mb-3">
                Commitment to Success
              </span>
              <h3 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                {statsData.excellence.title}
              </h3>
              <p className="text-slate-600 text-base sm:text-lg mt-3">
                {statsData.excellence.description}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {statsData.excellence.cards.map((card, idx) => (
                <div
                  key={idx}
                  className="rounded-3xl p-7 bg-white border border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-6 font-bold group-hover:scale-110 transition-transform">
                    {idx === 0 ? <Award className="w-6 h-6" /> : idx === 1 ? <CheckCircle2 className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
                  </div>
                  <h4 className="text-xl font-bold text-slate-950 mb-3" style={{ fontFamily: "var(--font-display)" }}>
                    {card.title}
                  </h4>
                  <p className="text-slate-600 text-sm leading-relaxed font-medium">
                    {card.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Notices Section */}
          <div id="notices" className="rounded-3xl p-8 sm:p-12 bg-slate-900 text-white shadow-2xl relative overflow-hidden border border-slate-800">
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 border-b border-slate-800 pb-8">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-400 bg-red-950/70 px-3.5 py-1.5 rounded-full border border-red-800/60 mb-3">
                  <Bell className="w-3.5 h-3.5 text-red-400" />
                  <span>Stay Informed</span>
                </div>
                <h3 className="text-3xl sm:text-4xl font-black text-white" style={{ fontFamily: "var(--font-display)" }}>
                  {statsData.notices.title}
                </h3>
              </div>
              <p className="text-slate-400 text-sm max-w-md">
                {statsData.notices.description}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 relative z-10">
              {notices.map((notice) => (
                <div
                  key={notice._id || notice.title}
                  onClick={() => setSelectedNotice(notice)}
                  className="rounded-2xl p-6 bg-slate-800/90 border border-slate-700/80 hover:border-red-500/60 transition-all cursor-pointer group hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between text-xs text-blue-400 font-bold mb-3">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {notice.date}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800/60 text-[10px] uppercase">
                      {notice.category}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2 group-hover:text-red-400 transition-colors line-clamp-2">
                    {notice.title}
                  </h4>
                  <p className="text-slate-400 text-xs leading-relaxed line-clamp-3 mb-4">
                    {notice.description}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-red-400 group-hover:translate-x-1 transition-transform">
                    <span>Read Full Notice</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Selected Notice Modal */}
      {selectedNotice && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl text-slate-900 border border-slate-200">
            <button
              type="button"
              onClick={() => setSelectedNotice(null)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 px-3 py-1 rounded-full mb-3">
              <FileText className="w-4 h-4" />
              <span>Smriti School Notice</span>
            </div>

            <h3 className="text-2xl font-black text-slate-900 mb-2">
              {selectedNotice.title}
            </h3>

            <p className="text-xs font-bold text-slate-400 mb-6">
              Published: {selectedNotice.date}
            </p>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-6 text-sm text-slate-700 leading-relaxed">
              {selectedNotice.description}
            </div>

            <PdfNoticePreview title={selectedNotice.title} />

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedNotice(null)}
                className="px-6 py-2.5 rounded-xl font-bold bg-slate-950 text-white hover:bg-blue-600 transition-colors text-sm"
              >
                Close Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Stats;
