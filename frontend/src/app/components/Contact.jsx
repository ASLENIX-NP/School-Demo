// Contact.jsx
import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
  MessageSquare,
  Building2,
} from "lucide-react";

export const colors = {
  navy: "#0A1628",
  primary: "#1E3A5F",
  secondary: "#2D6A4F",
  gold: "#C9A84C",
  red: "#D71920",
  green: "#168A3A",
  purple: "#4B2E83",
  cyan: "#38BDF8",
};

const API_URL = import.meta.env.VITE_API_URL;

export const defaultContactContent = {
  badgeText: "Get In Touch",
  title: "Let's Connect",
  highlightedText: "Smriti School",
  subtitle:
    "Have questions about admissions, curriculum, or tuition? Our team is ready to assist you with any inquiry.",

  contactInfo: [
    {
      id: "address",
      icon: "map",
      label: "School Address",
      value: "Basudev Marga, Hetauda-2, Makawanpur, Nepal",
      color: "#2563EB",
    },
    {
      id: "phone",
      icon: "phone",
      label: "Call Us Directly",
      value: "057-590144, 057-590145",
      color: "#16A34A",
    },
    {
      id: "email",
      icon: "mail",
      label: "Email Inquiries",
      value: "infosmritischool@gmail.com",
      color: "#7C3AED",
    },
    {
      id: "hours",
      icon: "clock",
      label: "Office Hours",
      value: "Sun - Fri: 9:00 AM - 4:00 PM",
      color: "#EA580C",
    },
  ],
  mapCard: {
    title: "Smriti Secondary English Boarding School",
    address: "Basudev Marga, Hetauda-2, Makawanpur, Nepal",
    buttonText: "Open in Google Maps",
    mapUrl:
      "https://www.google.com/maps/place/Bal+Jagriti+Boarding+School/@27.4312792,85.0379093,19z/data=!4m6!3m5!1s0x39eb4991159e4289:0x8707a51c9add8d8e!8m2!3d27.4312792!4d85.0379093!16s%2Fg%2F11bw3f8rbl",
  },
  form: {
    title: "Send a Message",
    nameLabel: "Full Name",
    namePlaceholder: "e.g. Ram Shrestha",
    emailLabel: "Email Address",
    emailPlaceholder: "ram@example.com",
    phoneLabel: "Phone Number",
    phonePlaceholder: "98XXXXXXXX",
    subjectLabel: "Inquiry Type",
    messageLabel: "Your Message",
    messagePlaceholder: "Write your message or inquiry details here...",
    buttonText: "Send Message",
  },
};

export function mergeContactContent(saved = {}) {
  return {
    ...defaultContactContent,
    ...(saved || {}),
    contactInfo:
      Array.isArray(saved?.contactInfo) && saved.contactInfo.length
        ? saved.contactInfo.map((item, index) => ({
            id: item.id || `contact-${index}`,
            icon: item.icon || "map",
            label: item.label || "Contact",
            value: item.value || "",
            color: item.color || colors.primary,
          }))
        : defaultContactContent.contactInfo,
    mapCard: {
      ...defaultContactContent.mapCard,
      ...(saved?.mapCard || {}),
    },
    form: {
      ...defaultContactContent.form,
      ...(saved?.form || {}),
    },
  };
}

export function normalizeExternalUrl(url = "") {
  const cleanUrl = String(url || "").trim();
  if (!cleanUrl) return "#";
  if (/^(https?:|mailto:|tel:|sms:)/i.test(cleanUrl)) return cleanUrl;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cleanUrl)}`;
}

// ─── 3D TILT HOOK (Reused for contact cards) ───
const useTilt = (max = 12) => {
  const ref = useRef(null);
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(y, [0, 1], [max, -max]), { stiffness: 250, damping: 20 });
  const rotateY = useSpring(useTransform(x, [0, 1], [-max, max]), { stiffness: 250, damping: 20 });

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

// ─── 3D TILT CARD COMPONENT ───
function TiltCard({ children, className = "", style = {}, ...props }) {
  const { ref, style: tiltStyle, handlers } = useTilt(12);
  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      style={{ ...style, ...tiltStyle, perspective: 1000 }}
      {...handlers}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// ─── CUSTOM INTERSECTION OBSERVER HOOK (Replaces react-intersection-observer) ───
function useInViewOnce() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, inView };
}

// ─── CONTACT COMPONENT ───
export default function Contact({ contentOverride = null }) {
  const [content, setContent] = useState(() =>
    mergeContactContent(contentOverride || defaultContactContent)
  );
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Admissions Inquiry",
    message: "",
  });
  const [status, setStatus] = useState({
    loading: false,
    success: false,
    error: "",
  });

  // Custom Hook usage
  const { ref: headerRef, inView: headerInView } = useInViewOnce();
  const { ref: cardsRef, inView: cardsInView } = useInViewOnce();

  useEffect(() => {
    if (contentOverride) {
      setContent(mergeContactContent(contentOverride));
      return;
    }
    let alive = true;
    const loadContact = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/site-content/contact`, { timeout: 12000 });
        if (!alive) return;
        setContent(mergeContactContent(res.data?.data?.content || {}));
      } catch (error) {
        console.error("Contact content load error:", error);
        if (alive) setContent(mergeContactContent(defaultContactContent));
      }
    };
    loadContact();
    return () => { alive = false; };
  }, [contentOverride]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus({ loading: false, success: false, error: "Please fill in your name, email, and message." });
      return;
    }
    setStatus({ loading: true, success: false, error: "" });
    try {
      await axios.post(`${API_URL}/api/site-content/contact/messages`, {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        subject: formData.subject,
        message: formData.message.trim(),
      });
      setStatus({ loading: false, success: true, error: "" });
      setFormData({ name: "", email: "", phone: "", subject: "Admissions Inquiry", message: "" });
      setTimeout(() => setStatus((prev) => ({ ...prev, success: false })), 6000);
    } catch (err) {
      console.error("Contact message submission error:", err);
      setStatus({ loading: false, success: false, error: "Message could not be sent. Please try again." });
    }
  };

  const MAP_EMBED_URL =
    "https://maps.google.com/maps?q=Bal+Jagriti+Boarding+School+Hetauda+Nepal&t=&z=16&ie=UTF8&iwloc=&output=embed";

  return (
    <section className="min-h-screen pt-28 pb-24 relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-slate-50">
      
      {/* Ambient Background Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[800px] h-[800px] rounded-full bg-blue-400/10 blur-[120px]" />
        <div className="absolute bottom-40 -left-40 w-[600px] h-[600px] rounded-full bg-purple-400/10 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full bg-cyan-400/5 blur-[100px]" />
      </div>

      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 relative z-10">
        
        {/* ─── HEADER ─── */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <motion.div 
            initial={{ scale: 0.95 }}
            animate={headerInView ? { scale: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 bg-blue-100/80 text-blue-700 border border-blue-200/50 shadow-sm backdrop-blur-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {content.badgeText || "Get In Touch"}
          </motion.div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 tracking-tight text-slate-900 leading-[1.1]">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 block">
              {content.title || "Let's Connect"}
            </span>
          </h1>

          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed font-light">
            {content.subtitle || "Have questions about admissions, curriculum, or tuition? Our team is ready to assist you with any inquiry."}
          </p>
        </motion.div>

        {/* ─── 4 CONTACT CARDS GRID (3D TILT) ─── */}
        <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {content.contactInfo.map((info, i) => {
            const Icon = info.icon === "map" ? MapPin : info.icon === "phone" ? Phone : info.icon === "mail" ? Mail : Clock;
            return (
              <motion.div
                key={info.id}
                initial={{ opacity: 0, y: 20 }}
                animate={cardsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <TiltCard
                  className="h-full group relative rounded-2xl p-7 bg-white/60 backdrop-blur-lg border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.08)] transition-all duration-300"
                >
                  {/* Floating Glow under icon */}
                  <div 
                    className="absolute -inset-1 rounded-full blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                    style={{ background: info.color }}
                  />

                  <div className="relative z-10 flex flex-col h-full">
                    <div 
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform duration-300"
                      style={{ 
                        background: `linear-gradient(135deg, ${info.color}20, ${info.color}05)`,
                        border: `1px solid ${info.color}30`,
                        transform: "translateZ(30px)"
                      }}
                    >
                      <Icon className="w-6 h-6" style={{ color: info.color }} />
                    </div>

                    <h3 className="text-sm font-bold text-slate-800 mb-1.5" style={{ transform: "translateZ(15px)" }}>
                      {info.label}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed flex-1" style={{ transform: "translateZ(10px)" }}>
                      {info.value}
                    </p>
                  </div>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>

        {/* ─── MAIN FORM & MAP GRID ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: 3D CONTACT FORM */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 rounded-3xl p-8 sm:p-10 bg-white/70 backdrop-blur-md border border-white/50 shadow-xl shadow-slate-200/50 relative overflow-hidden"
          >
            {/* Glossy highlight bar at top */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shadow-sm">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">{content.form.title || "Send Us a Message"}</h2>
                <p className="text-xs text-slate-400">Fill out the form below and we will respond promptly.</p>
              </div>
            </div>

            {status.success && (
              <div className="mb-6 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-700 text-sm font-medium flex items-center gap-3 shadow-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Thank you! Your message has been sent successfully. We will get back to you soon.</span>
              </div>
            )}

            {status.error && (
              <div className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4 text-red-600 text-sm font-medium flex items-center gap-3 shadow-sm">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                <span>{status.error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="group">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Ram Shrestha"
                    required
                    className="w-full rounded-xl border border-slate-200/80 bg-white px-4 py-3.5 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm"
                  />
                </div>
                <div className="group">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="ram@example.com"
                    required
                    className="w-full rounded-xl border border-slate-200/80 bg-white px-4 py-3.5 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="98XXXXXXXX"
                    className="w-full rounded-xl border border-slate-200/80 bg-white px-4 py-3.5 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Inquiry Category
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200/80 bg-white px-4 py-3.5 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer shadow-sm"
                  >
                    <option value="Admissions Inquiry">Admissions Inquiry</option>
                    <option value="Academic Programs">Academic Programs</option>
                    <option value="Fee Structure">Fee Structure</option>
                    <option value="General Inquiry">General Inquiry</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Message <span className="text-red-400">*</span>
                </label>
                <textarea
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message or inquiry details here..."
                  required
                  className="w-full rounded-xl border border-slate-200/80 bg-white p-4 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none shadow-sm"
                />
              </div>

              <button
                type="submit"
                disabled={status.loading}
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-8 py-4 text-sm font-bold text-white transition-all duration-200 shadow-lg shadow-blue-600/20 hover:shadow-xl hover:-translate-y-0.5 cursor-pointer disabled:opacity-60"
              >
                <span>{status.loading ? "Sending Message..." : "Send Message"}</span>
                <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </motion.div>

          {/* RIGHT: 3D MAP CARD */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 flex flex-col gap-6"
          >
            <div
              className="rounded-3xl p-6 bg-white/70 backdrop-blur-md border border-white/50 shadow-xl shadow-slate-200/50 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <Building2 className="w-5 h-5 text-slate-700" />
                  <h3 className="text-lg font-bold text-slate-800">School Campus Map</h3>
                </div>
                <a
                  href={normalizeExternalUrl(content.mapCard?.mapUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <span>Open Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="relative w-full h-[350px] rounded-xl overflow-hidden bg-slate-200 border border-slate-200/80 shadow-inner">
                <iframe
                  title="School Map"
                  src={MAP_EMBED_URL}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>

              <div className="mt-5 pt-5 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-800">Smriti Secondary English Boarding School</p>
                  <p className="text-xs text-slate-500 mt-0.5">Basudev Marga, Hetauda-2, Makawanpur, Nepal</p>
                </div>
                <a
                  href={normalizeExternalUrl(content.mapCard?.mapUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold transition-colors shadow-md shrink-0"
                >
                  Directions ↗
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}