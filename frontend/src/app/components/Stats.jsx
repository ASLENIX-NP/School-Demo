// HomePage.jsx
import { useEffect, useRef, useState, useCallback } from "react";
// Keep axios imported in case you set up the backend later
import axios from "axios";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { 
  ArrowRight, 
  BookOpen, 
  Calendar, 
  Users, 
  Award, 
  Sparkles,
  FileText,
  Download,
  Monitor,
  Target,
  Layers,
  X,
  MessageCircle
} from "lucide-react";
import PdfNoticePreview from "./PdfNoticePreview";
import HomeAnnouncementPopup from "./HomeAnnouncementPopup";

// Fallback to standard port if env variable is missing
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ─── 1. ADVANCED 3D TILT HOOK ───
const useTilt = (max = 15) => {
  const ref = useRef(null);
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  
  const rotateX = useSpring(useTransform(y, [0, 1], [max, -max]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [0, 1], [-max, max]), { stiffness: 300, damping: 30 });

  const handleMouseMove = useCallback((e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  }, [x, y]);

  const handleMouseLeave = useCallback(() => {
    x.set(0.5);
    y.set(0.5);
  }, [x, y]);

  return { ref, style: { rotateX, rotateY, transformStyle: "preserve-3d" }, handlers: { onMouseMove: handleMouseMove, onMouseLeave: handleMouseLeave } };
};

// ─── 2. 3D TILT CARD COMPONENT ───
function TiltCard({ children, className = "", max = 15, style = {}, ...props }) {
  const { ref, style: tiltStyle, handlers } = useTilt(max);
  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      style={{ ...style, ...tiltStyle, perspective: 1000 }}
      {...handlers}
      {...props}
    >
      {/* Glare effect overlay */}
      <div className="absolute inset-0 rounded-[inherit] pointer-events-none bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      {children}
    </motion.div>
  );
}

// ─── 3. DYNAMIC FLOATING BACKGROUND PARTICLES ───
function FloatingBackground() {
  const shapes = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 4 + Math.random() * 8,
    duration: 15 + Math.random() * 25,
    delay: Math.random() * 10,
    color: i % 2 === 0 ? "rgba(233, 196, 106, 0.15)" : "rgba(30, 58, 95, 0.1)"
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className="absolute rounded-full"
          style={{
            width: shape.size,
            height: shape.size,
            left: `${shape.x}%`,
            top: `${shape.y}%`,
            background: shape.color,
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, Math.random() * 20 - 10, 0],
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.8, 0.4]
          }}
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            delay: shape.delay,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}

// ─── 4. MAIN STATS SECTION ───
export default function Stats({ editMode = false }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notices, setNotices] = useState([]);
  const [selectedNotice, setSelectedNotice] = useState(null);

  // Fetch Home Content (Mock Data to prevent 404 Crash)
  useEffect(() => {
    setTimeout(() => {
      setData({
        eyebrow: "Our Impact",
        title: "Creating Futures, One Student at a Time",
        description: "Real numbers that reflect our commitment to excellence and holistic education in the Makwanpur region.",
        stats: [
          { value: "3800", suffix: "+", label: "Students Enrolled", note: "Across school programs", color: "#2563EB" },
          { value: "240", suffix: "+", label: "Expert Teachers", note: "Academic support team", color: "#16A34A" },
          { value: "35", suffix: " yrs", label: "Years of Excellence", note: "Serving Makwanpur", color: "#F59E0B" },
          { value: "98", suffix: "%", label: "Success Rate", note: "Academic performance", color: "#F97316" }
        ],
        story: {
          badge: "Our Story",
          title: "Building Tomorrow's Leaders Today",
          imageTopTitle: "Our Campus",
          imageTopSubtitle: "Hetauda-2",
          paragraphs: [
            "Established with a vision to provide quality education in Makawanpur, Smriti Secondary English Boarding School has grown as one of Hetauda's respected academic institutions.",
            "With students from Play Group to Grade 10, the school focuses on academic discipline, values, creativity, digital learning, and holistic student development."
          ],
          image: "https://images.unsplash.com/photo-1588072432836-e10032774350?w=1000&h=800&fit=crop&auto=format",
          buttonText: "Read Our Story"
        },
        excellence: {
          title: "Academic Focus",
          description: "Our students consistently achieve outstanding results in the SEE examinations.",
          cards: [
            { title: "Best SEE Results", description: "Achieving top results in the Secondary Education Examination." },
            { title: "GPA 4.00 Achievers", description: "Our brightest students attain a perfect GPA of 4.00." },
            { title: "Holistic Development", description: "Fostering creativity, leadership, and sportsmanship." }
          ]
        }
      });
      setLoading(false);
    }, 800); // Simulated network delay

    // Fetch Notices
    fetch(`${API_URL}/api/notices`)
      .then((res) => res.json())
      .then((json) => {
        const list = Array.isArray(json) ? json : json?.data || [];
        setNotices(list.slice(0, 3));
      })
      .catch(console.error);
  }, []);

  if (loading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-400/30 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-sm font-medium tracking-widest text-slate-400">LOADING EXPERIENCE</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {!editMode && <HomeAnnouncementPopup />}
      
      <section className="relative min-h-screen bg-gradient-to-br from-indigo-50 via-white to-amber-50/30 overflow-hidden py-20 md:py-28">
        <FloatingBackground />

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
          
          {/* ─── 5. HERO HEADER (3D FLOATING TEXT) ─── */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center max-w-4xl mx-auto mb-20"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 bg-indigo-100 text-indigo-700 border border-indigo-200 backdrop-blur-sm shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" /> {data.eyebrow || "Our Impact"}
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tight text-slate-900 leading-[1.1]">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-slate-700 block">{data.title}</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-light">
              {data.description}
            </p>
          </motion.div>

          {/* ─── 6. 3D STATS GRID ─── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-24 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-100/30 to-transparent blur-3xl -z-10 rounded-full" />
            
            {data.stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1, type: "spring", bounce: 0.2 }}
                className="group"
              >
                <TiltCard 
                  max={12}
                  className="relative p-6 md:p-8 text-center bg-white/70 backdrop-blur-lg rounded-2xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.12)] transition-all duration-300"
                >
                  {/* Depth Layer 1: Background Accent */}
                  <div 
                    className="absolute -inset-0.5 rounded-2xl bg-gradient-to-br opacity-20 group-hover:opacity-40 transition-opacity blur-sm"
                    style={{ background: stat.color }}
                  />
                  
                  {/* Depth Layer 2: Floating Icon */}
                  <motion.div 
                    className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-4 text-white shadow-lg relative z-10"
                    style={{ 
                      background: stat.color,
                      transform: "translateZ(40px)"
                    }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    {i === 0 ? <Users className="w-7 h-7" /> :
                     i === 1 ? <Award className="w-7 h-7" /> :
                     i === 2 ? <Calendar className="w-7 h-7" /> :
                     <Target className="w-7 h-7" />}
                  </motion.div>

                  {/* Depth Layer 3: Count */}
                  <div className="relative z-10" style={{ transform: "translateZ(20px)" }}>
                    <div className="text-4xl md:text-5xl font-black text-slate-900 mb-1 tracking-tight">
                      {stat.value}{stat.suffix}
                    </div>
                    <div className="text-sm font-bold text-slate-700">{stat.label}</div>
                    <div className="text-xs text-slate-500 mt-1">{stat.note}</div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>

          {/* ─── 7. STORY SECTION (Modern & Light) ─── */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative grid lg:grid-cols-2 gap-12 md:gap-16 items-center mb-24"
          >
            {/* 3D Floating Image Card */}
            <motion.div
              whileHover={{ y: -10 }}
              transition={{ duration: 0.4, type: "spring", bounce: 0.4 }}
              className="relative rounded-3xl overflow-hidden shadow-2xl bg-indigo-900 aspect-[4/3] w-full group"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/80 via-indigo-900/40 to-transparent z-10" />
              <img
                src={data.story.image}
                alt="School story"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                <div className="backdrop-blur-md bg-white/10 p-4 rounded-2xl border border-white/20 inline-block shadow-lg">
                  <div className="text-white text-xl font-bold">{data.story.imageTopTitle || "Our Campus"}</div>
                  <div className="text-white/80 text-sm">{data.story.imageTopSubtitle || "Hetauda-2"}</div>
                </div>
              </div>
            </motion.div>

            {/* Text Content */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold uppercase tracking-widest text-amber-600">{data.story.badge}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight leading-tight">
                {data.story.title}
              </h2>
              <div className="space-y-4 text-slate-600 leading-relaxed text-base md:text-lg mb-8">
                {data.story.paragraphs.map((p, idx) => <p key={idx}>{p}</p>)}
              </div>
              
              {/* LIGHTER, BRIGHTER BUTTON */}
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-white font-semibold shadow-[0_8px_20px_rgba(251,146,60,0.4)] hover:shadow-[0_12px_28px_rgba(251,146,60,0.5)] hover:-translate-y-1 transition-all bg-gradient-to-r from-orange-400 to-amber-500 group"
              >
                {data.story.buttonText || "Read Our Story"}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* ─── 8. EXCELLENCE CARDS ─── */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mb-24"
          >
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold tracking-widest uppercase mb-4">
                {data.excellence.title || "Academic Focus"}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Excellence in Every Subject</h2>
              <p className="text-slate-500 max-w-2xl mx-auto mt-2">{data.excellence.description}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {data.excellence.cards.map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="relative group bg-white rounded-2xl p-8 shadow-sm hover:shadow-2xl transition-all duration-300 border border-slate-100 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-900 text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                      {i === 0 ? <Monitor className="w-6 h-6" /> :
                       i === 1 ? <Award className="w-6 h-6" /> :
                       <Layers className="w-6 h-6" />}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{card.title}</h3>
                    <p className="text-slate-500 leading-relaxed text-sm">{card.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ─── 9. NOTICE BOARD (LIGHT, GLASSY, ATTRACTIVE) ─── */}
          {!editMode && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="bg-gradient-to-br from-indigo-50/90 via-white to-purple-50/90 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-xl border border-white/50 relative overflow-hidden"
            >
              {/* Colorful decorative blobs */}
              <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-indigo-200/30 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-amber-200/30 blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
                <div>
                  <div className="inline-flex items-center gap-3 mb-2 border border-indigo-200 bg-indigo-50/50 rounded-full px-4 py-1.5 text-indigo-700 text-xs font-bold uppercase tracking-widest backdrop-blur-sm">
                    <BookOpen className="w-3.5 h-3.5" /> Notice Board
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-800">Latest Updates</h2>
                </div>
                <Link 
                  to="/notices"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-900 text-white font-bold hover:shadow-lg hover:scale-105 transition-all active:scale-95 shadow-md"
                >
                  View All <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {notices.length === 0 ? (
                <div className="border border-indigo-200 rounded-2xl p-12 text-center bg-white/50 backdrop-blur-sm">
                  <Calendar className="w-16 h-16 mx-auto mb-4 text-indigo-300" />
                  <h3 className="text-xl font-bold text-slate-500">No notices available</h3>
                </div>
              ) : (
                <div className="space-y-4 relative z-10">
                  {notices.map((notice, i) => {
                    const colors = ["border-indigo-400", "border-amber-400", "border-emerald-400"];
                    return (
                      <motion.div
                        key={notice.id || notice._id || i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <button
                          onClick={() => setSelectedNotice(notice)}
                          className="w-full text-left group"
                        >
                          <div className={`p-5 md:p-6 rounded-2xl bg-white/70 backdrop-blur-sm border-l-4 ${colors[i % colors.length]} hover:bg-white/90 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}>
                            <div className="flex flex-col md:flex-row md:items-center gap-4">
                              <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest border border-indigo-200 px-2 py-0.5 rounded-full">
                                    {notice.category || "Notice"}
                                  </span>
                                  {notice.pdf_url && (
                                    <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                                      <Download className="w-3 h-3" /> PDF
                                    </span>
                                  )}
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 line-clamp-1">{notice.title}</h3>
                                <p className="text-sm text-slate-500 line-clamp-1 mt-1">{notice.description || "Click to read more."}</p>
                              </div>
                              <div className="flex-shrink-0 flex items-center gap-4">
                                <span className="text-xs text-slate-500 font-medium">{new Date(notice.date).toLocaleDateString()}</span>
                                <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                                  <ArrowRight className="w-3.5 h-3.5 text-indigo-600 group-hover:text-indigo-800 transition-colors" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* ─── 10. NOTICE MODAL ─── */}
        {selectedNotice && (
          <div
            className="fixed inset-0 z-[200] flex items-center justify-center px-4 bg-slate-900/70 backdrop-blur-md"
            onClick={() => setSelectedNotice(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm p-6 border-b border-slate-100 flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{selectedNotice.title}</h2>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                    <Calendar className="w-3 h-3" />
                    {new Date(selectedNotice.date).toLocaleDateString()}
                  </div>
                </div>
                <button onClick={() => setSelectedNotice(null)} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1">
                <div className="prose max-w-none text-slate-700">
                  <p className="whitespace-pre-line">{selectedNotice.description || selectedNotice.content}</p>
                </div>
                {selectedNotice.pdf_url && (
                  <div className="mt-6">
                    <PdfNoticePreview fileUrl={selectedNotice.pdf_url} title={selectedNotice.title} />
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