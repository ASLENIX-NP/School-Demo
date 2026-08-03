import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "motion/react";
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
  Building,
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

const API_URL =
  import.meta.env.VITE_API_URL || "https://school-website-backend-ixx2.onrender.com";

export const defaultContactContent = {
  badgeText: "Get In Touch",
  title: "Contact Smriti School",
  highlightedText: "Smriti School",
  subtitle:
    "Have questions about admissions, curriculum, fee structure, or campus visits? Our team is here to help.",
  contactInfo: [
    {
      id: "address",
      icon: "map",
      label: "School Address",
      value: "Basudev Marga, Hetauda Sub-Metropolitan City, Ward No. 2, Makawanpur, Nepal",
      color: "#D71920",
    },
    {
      id: "phone",
      icon: "phone",
      label: "Phone Numbers",
      value: "057-590144, 057-590145, 057-590146",
      color: "#168A3A",
    },
    {
      id: "email",
      icon: "mail",
      label: "Email Address",
      value: "infosmritischool@gmail.com",
      color: "#1E3A5F",
    },
    {
      id: "school",
      icon: "clock",
      label: "School Office Hours",
      value: "Sunday - Friday: 9:00 AM - 4:00 PM (Saturday Closed)",
      color: "#2D6A4F",
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

export function Contact({ contentOverride = null }) {
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

  useEffect(() => {
    if (contentOverride) {
      setContent(mergeContactContent(contentOverride));
      return;
    }

    let alive = true;
    const loadContact = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/site-content/contact`, {
          timeout: 12000,
        });

        if (!alive) return;
        setContent(mergeContactContent(res.data?.data?.content || {}));
      } catch (error) {
        console.error("Contact content load error:", error);
        if (alive) setContent(mergeContactContent(defaultContactContent));
      }
    };

    loadContact();
    return () => {
      alive = false;
    };
  }, [contentOverride]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus({
        loading: false,
        success: false,
        error: "Please fill in your name, email, and message.",
      });
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

      setStatus({
        loading: false,
        success: true,
        error: "",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "Admissions Inquiry",
        message: "",
      });

      setTimeout(() => {
        setStatus((prev) => ({ ...prev, success: false }));
      }, 6000);
    } catch (err) {
      console.error("Contact message submission error:", err);
      setStatus({
        loading: false,
        success: false,
        error: "Message could not be sent. Please try again or call our office.",
      });
    }
  };

  const MAP_EMBED_URL =
    "https://maps.google.com/maps?q=Bal+Jagriti+Boarding+School+Hetauda+Nepal&t=&z=16&ie=UTF8&iwloc=&output=embed";

  return (
    <section className="min-h-screen bg-slate-50 pt-28 pb-24 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#0A1628] text-white shadow-sm mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            {content.badgeText || "Get In Touch"}
          </span>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0A1628] tracking-tight leading-[1.12]">
            {content.title || "Contact Baljagriti School"}
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            {content.subtitle ||
              "Have questions about admissions, curriculum, fee structure, or campus visits? Our administrative team is here to assist you."}
          </p>
        </motion.div>

        {/* 4 Unified Contact Information Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="rounded-2xl bg-white border border-slate-200/90 p-6 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-slate-300 transition-all group"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#0A1628] text-white flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition-transform">
                <MapPin className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-base font-extrabold text-[#0A1628] mb-1">School Location</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Basudev Marga, Hetauda-2, Makawanpur, Nepal
              </p>
            </div>
            <a
              href={normalizeExternalUrl(content.mapCard?.mapUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-[#1E3A5F] hover:text-blue-600 transition-colors"
            >
              <span>View Map</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="rounded-2xl bg-white border border-slate-200/90 p-6 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-slate-300 transition-all group"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#0A1628] text-white flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition-transform">
                <Phone className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-base font-extrabold text-[#0A1628] mb-1">Call Us Directly</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                057-590144, 057-590145, 057-590146
              </p>
            </div>
            <a
              href="tel:057590144"
              className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-[#1E3A5F] hover:text-blue-600 transition-colors"
            >
              <span>Call Reception</span>
              <Phone className="w-3.5 h-3.5" />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="rounded-2xl bg-white border border-slate-200/90 p-6 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-slate-300 transition-all group"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#0A1628] text-white flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition-transform">
                <Mail className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-base font-extrabold text-[#0A1628] mb-1">Email Inquiries</h3>
              <p className="text-sm text-slate-600 leading-relaxed break-all">
                infobjess2046@gmail.com
              </p>
            </div>
            <a
              href="mailto:infobjess2046@gmail.com"
              className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-[#1E3A5F] hover:text-blue-600 transition-colors"
            >
              <span>Send Email</span>
              <Mail className="w-3.5 h-3.5" />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="rounded-2xl bg-white border border-slate-200/90 p-6 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-slate-300 transition-all group"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#0A1628] text-white flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition-transform">
                <Clock className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-base font-extrabold text-[#0A1628] mb-1">Office Hours</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Sun - Fri: 9:00 AM - 4:00 PM
              </p>
              <p className="text-xs text-slate-400 mt-1">Saturday: Closed</p>
            </div>
            <span className="mt-5 text-xs font-bold text-slate-500">School Office Days</span>
          </motion.div>
        </div>

        {/* Main Grid: Contact Form (Left) & Google Maps Location (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column - Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 rounded-2xl bg-white border border-slate-200/90 p-8 sm:p-10 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#0A1628] text-white flex items-center justify-center font-bold">
                <MessageSquare className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-[#0A1628]">Send Us a Message</h2>
                <p className="text-xs text-slate-500">Fill out the form below and we will respond promptly.</p>
              </div>
            </div>

            {status.success && (
              <div className="mb-6 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-800 text-sm font-semibold flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Thank you! Your message has been sent successfully. We will get back to you soon.</span>
              </div>
            )}

            {status.error && (
              <div className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4 text-red-700 text-sm font-semibold flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                <span>{status.error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Ram Shrestha"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none focus:bg-white focus:border-[#0A1628] focus:ring-2 focus:ring-[#0A1628]/10 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="ram@example.com"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none focus:bg-white focus:border-[#0A1628] focus:ring-2 focus:ring-[#0A1628]/10 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="98XXXXXXXX"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none focus:bg-white focus:border-[#0A1628] focus:ring-2 focus:ring-[#0A1628]/10 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Inquiry Category
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:border-[#0A1628] focus:ring-2 focus:ring-[#0A1628]/10 transition-all cursor-pointer"
                  >
                    <option value="Admissions Inquiry">Admissions Inquiry</option>
                    <option value="Academic Programs">Academic Programs</option>
                    <option value="Facilities & Transportation">Facilities & Transportation</option>
                    <option value="Fee Structure">Fee Structure</option>
                    <option value="General Inquiry">General Inquiry</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message or inquiry here..."
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-sm text-slate-900 outline-none focus:bg-white focus:border-[#0A1628] focus:ring-2 focus:ring-[#0A1628]/10 transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={status.loading}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#0A1628] hover:bg-[#1E3A5F] px-8 py-3.5 text-sm font-bold text-white transition-all duration-200 shadow-md cursor-pointer disabled:opacity-60"
              >
                <span>{status.loading ? "Sending Message..." : "Send Message"}</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>

          {/* Right Column - Embedded Google Map Card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-5 flex flex-col gap-6"
          >
            {/* Map Container */}
            <div className="rounded-2xl bg-white border border-slate-200/90 p-6 shadow-sm flex flex-col justify-between overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <Building className="w-5 h-5 text-[#0A1628]" />
                  <h3 className="text-lg font-extrabold text-[#0A1628]">School Campus Map</h3>
                </div>
                <a
                  href={normalizeExternalUrl(content.mapCard?.mapUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#1E3A5F] hover:text-blue-600 transition-colors"
                >
                  <span>Open Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Responsive Google Maps Iframe */}
              <div className="relative w-full h-[320px] rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-inner">
                <iframe
                  title="Smriti Secondary English Boarding School Map"
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

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-extrabold text-[#0A1628]">Smriti Secondary English Boarding School</p>
                  <p className="text-xs text-slate-500 mt-0.5">Basudev Marga, Hetauda-2, Makawanpur, Nepal</p>
                </div>
                <a
                  href={normalizeExternalUrl(content.mapCard?.mapUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-[#0A1628] hover:bg-[#1E3A5F] text-white text-xs font-bold transition-colors shrink-0"
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

export default Contact;