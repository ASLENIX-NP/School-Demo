import { useEffect, useState } from "react";
import api from "../../lib/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Calendar,
  Clock,
  FileText,
  Download,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  Award,
  Users,
  GraduationCap,
  Check,
  AlertCircle,
  HelpCircle,
  School,
  Send,
  Lock,
  X
} from "lucide-react";

export const defaultSettings = {
  isOpen: true,
  showAcademicSession: true,
  showStatusBadge: true,
  showDatesOnWebsite: true,
  hideWhenClosed: false,
  academicSession: "2027–2028",
  startDate: "2027-01-01",
  endDate: "2027-04-30",
  heroBadgeText: "Admissions Open for 2027–2028",
  heroTitle: "Empowering Next Generation Leaders",
  heroDescription:
    "Join our vibrant learning community. We offer holistic education, state-of-the-art facilities, and an environment where every student excels.",
  countdownEnabled: true,
  applyButtonText: "Apply Now for Admission",
  prospectusUrl: "",
  prospectusButtonText: "Download Prospectus",
  contactButtonText: "Contact Admissions",
  feeStructureUrl: "",
  feeButtonText: "Download Fee Structure PDF",
  feeRequestButtonText: "Request Fee Breakdown via Office",
  closedTitle: "Admissions Are Currently Closed",
  closedDescription: "Applications for this academic session have officially ended. The next admission cycle will be announced soon.",
  closedButtonText: "Contact Admissions Office",
  whyUsBadge: "Why Red Rose School",
  whyUsTitle: "Building a Foundation for Excellence",
  whyUsDescription: "We offer a comprehensive educational journey designed to foster academic rigor, leadership, and moral values.",
  whyUs: [
    {
      id: "why-1",
      icon: "Award",
      title: "Academic Excellence",
      desc: "Rigorous curriculum focused on conceptual clarity, critical thinking, and STEAM education."
    },
    {
      id: "why-2",
      icon: "Users",
      title: "Expert Educators",
      desc: "Passionate teachers dedicated to mentoring, inspiring, and bringing out the best in every child."
    },
    {
      id: "why-3",
      icon: "School",
      title: "World-Class Infrastructure",
      desc: "Smart classrooms, science & robotics labs, digital library, and comprehensive sports facilities."
    },
    {
      id: "why-4",
      icon: "ShieldCheck",
      title: "Safe & Nurturing Environment",
      desc: "CCTV-monitored campus, strict safety protocols, and caring staff ensuring student well-being."
    }
  ],
  processBadge: "Step-By-Step Workflow",
  processTitle: "Simple 5-Step Admission Process",
  processDescription: "A transparent, supportive, and hassle-free path to joining our school community.",
  timelineSteps: [
    {
      id: "step-1",
      number: "01",
      title: "Submit Inquiry",
      desc: "Fill out our online inquiry form with student & parent details."
    },
    {
      id: "step-2",
      number: "02",
      title: "Campus Interaction",
      desc: "Visit our campus to meet counselors and explore our learning environment."
    },
    {
      id: "step-3",
      number: "03",
      title: "Assessment",
      desc: "Child participates in an age-appropriate assessment and friendly interaction."
    },
    {
      id: "step-4",
      number: "04",
      title: "Verification",
      desc: "Submit required academic documents and birth record for verification."
    },
    {
      id: "step-5",
      number: "05",
      title: "Final Enrollment",
      desc: "Receive confirmation, complete fee payment, and welcome to Red Rose School!"
    }
  ],
  eligibilityBadge: "Requirements",
  eligibilityTitle: "Eligibility Criteria",
  eligibilityDescription: "Please ensure candidate meets age limits and academic prerequisites prior to applying.",
  eligibilityCriteria: [
    {
      id: "elig-1",
      grade: "Play Group & Nursery",
      age: "2.5 - 3.5 years",
      requirements: "Child birth certificate, medical immunization record."
    },
    {
      id: "elig-2",
      grade: "LKG & UKG",
      age: "4.0 - 5.0 years",
      requirements: "Basic interaction, previous school report card if attended."
    },
    {
      id: "elig-3",
      grade: "Grade 1 - 5 (Primary)",
      age: "6.0+ years",
      requirements: "Passed previous grade, Transfer Certificate (TC), marksheets."
    },
    {
      id: "elig-4",
      grade: "Grade 6 - 9 (Secondary)",
      age: "11.0+ years",
      requirements: "Passed entrance test, character certificate, grade report card."
    }
  ],
  feeBadge: "Transparent Pricing",
  feeTitle: "Fee Structure & Scholarship Policy",
  feeDescription: "We provide transparent fee schedules with no hidden charges. Merit scholarships and need-based financial aid options are available for eligible candidates.",
  faqsBadge: "Parent Assistance",
  faqsTitle: "Frequently Asked Questions",
  faqsDescription: "Got questions regarding admissions? We have answers.",
  faqs: [
    {
      id: "faq-1",
      question: "What is the admission procedure?",
      answer: "Fill out the online inquiry form or visit our campus. After submission, our admissions team will schedule an assessment and parent interaction session."
    },
    {
      id: "faq-2",
      question: "Is school transportation available?",
      answer: "Yes, we operate safe and modern bus services covering major routes across the city."
    },
    {
      id: "faq-3",
      question: "Are hostel / residential facilities provided?",
      answer: "Yes, we have separate well-equipped hostel facilities for boys and girls with 24/7 care and academic supervision."
    },
    {
      id: "faq-4",
      question: "What are the school hours?",
      answer: "Regular school hours are from 9:00 AM to 3:30 PM, Sunday through Friday."
    }
  ],
  contactBadge: "Direct Assistance",
  contactTitle: "Contact Admission Office",
  contactDescription: "Have questions? Reach out directly to our friendly admission counselors.",
  contactPhone: "057-590144, 057-590145",
  contactEmail: "inforedroseschool@gmail.com",
  contactHours: "Sun - Fri: 8:00 AM - 4:00 PM",
  contactAddress: "Basudev Marga, Hetauda-2, Makawanpur, Nepal",
  ctaTitle: "Give Your Child the Gift of World-Class Education",
  ctaDescription: "Take the first step towards a bright academic future with Red Rose Secondary English Boarding School.",
  ctaButtonText: "Start Admission Inquiry Now",
  ctaClosedButtonText: "Contact Us for Future Cycles"
};

export const defaultAdmissionsContent = defaultSettings;
export const defaultContent = defaultSettings;
export function mergeAdmissionsContent(saved = {}) {
  return { ...defaultSettings, ...saved };
}

const ICON_MAP = {
  Award,
  Users,
  School,
  ShieldCheck,
  Star: Sparkles,
  Sparkles,
  Trophy: Award,
  Heart: Sparkles,
  CheckCircle2,
  GraduationCap,
  Clock,
  Phone,
  Mail,
  MapPin,
  FileText,
  Calendar,
  HelpCircle,
  Send,
  Lock,
  Check,
  AlertCircle
};

function DynamicIcon({ name, className = "w-6 h-6", defaultIcon = Sparkles }) {
  const Component = ICON_MAP[name] || defaultIcon;
  return <Component className={className} />;
}

export default function AdmissionsPage({ previewData = null }) {
  const [settings, setSettings] = useState(previewData || defaultSettings);
  const [loading, setLoading] = useState(!previewData);
  const [openFaq, setOpenFaq] = useState(null);

  // Popup Form Modal State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    studentName: "",
    dob: "",
    gender: "Male",
    applyingClass: "Grade 1",
    academicSession: "",
    prevSchoolName: "",
    currentGrade: "",
    prevSchoolAddress: "",
    parentName: "",
    relationship: "Father",
    mobile: "",
    altContact: "",
    email: "",
    province: "Bagmati Province",
    district: "Kathmandu",
    city: "",
    ward: "",
    fullAddress: "",
    transportRequired: false,
    hostelRequired: false,
    referralSource: "Website",
    message: ""
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [submitError, setSubmitError] = useState("");

  const { isOpen } = settings;

  useEffect(() => {
    if (previewData) {
      setSettings(previewData);
      setLoading(false);
      return;
    }

    const fetchSettings = async () => {
      try {
        const res = await api.get("/api/admissions/settings");
        if (res.data?.data) {
          setSettings(res.data.data);
          if (res.data.data.academicSession) {
            setFormData((prev) => ({ ...prev, academicSession: res.data.data.academicSession }));
          }
        }
      } catch (err) {
        console.error("Failed to load admission settings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [previewData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitSuccess(null);
    setSubmitting(true);

    try {
      const res = await api.post("/api/admissions/inquiry", formData);
      if (res.data?.success) {
        setSubmitSuccess(res.data.message || "Your inquiry has been submitted successfully!");
        setFormData({
          studentName: "",
          dob: "",
          gender: "Male",
          applyingClass: "Grade 1",
          academicSession: settings.academicSession || "2027–2028",
          prevSchoolName: "",
          currentGrade: "",
          prevSchoolAddress: "",
          parentName: "",
          relationship: "Father",
          mobile: "",
          altContact: "",
          email: "",
          province: "Bagmati Province",
          district: "Kathmandu",
          city: "",
          ward: "",
          fullAddress: "",
          transportRequired: false,
          hostelRequired: false,
          referralSource: "Website",
          message: ""
        });
      } else {
        setSubmitError(res.data?.message || "Failed to submit inquiry.");
      }
    } catch (err) {
      setSubmitError(err.response?.data?.message || "An error occurred while submitting inquiry.");
    } finally {
      setSubmitting(false);
    }
  };

  const scrollToSection = (id) => {
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-slate-900">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold tracking-wide text-blue-950">Loading Admission Portal...</p>
        </div>
      </div>
    );
  }

  const whyUsList = settings.whyUs && settings.whyUs.length > 0 ? settings.whyUs : defaultSettings.whyUs;
  const timelineList = settings.timelineSteps && settings.timelineSteps.length > 0 ? settings.timelineSteps : defaultSettings.timelineSteps;
  const eligibilityList = settings.eligibilityCriteria && settings.eligibilityCriteria.length > 0 ? settings.eligibilityCriteria : defaultSettings.eligibilityCriteria;
  const faqsList = settings.faqs && settings.faqs.length > 0 ? settings.faqs : defaultSettings.faqs;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-amber-400 selection:text-slate-950 relative">
      {/* ================= 1. HERO BANNER ================= */}
      <section className="relative min-h-[80vh] flex items-center justify-center pt-32 pb-20 px-4 sm:px-6 overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-slate-50 border-b border-blue-100">
        {/* Soft Background Gradients */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-amber-400/10 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="relative max-w-6xl mx-auto text-center z-10">
          {/* Status Badge & Session */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            {settings.showStatusBadge !== false && (
              <span
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm border ${
                  isOpen
                    ? "bg-emerald-50 text-emerald-700 border-emerald-300 shadow-emerald-500/5"
                    : "bg-rose-50 text-rose-700 border-rose-300 shadow-rose-500/5"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isOpen ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`}></span>
                {isOpen ? settings.heroBadgeText || "Admissions Open" : "Admissions Closed"}
              </span>
            )}

            {settings.showAcademicSession !== false && settings.academicSession && (
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-blue-900/5 text-blue-950 border border-blue-900/15">
                <Calendar className="w-3.5 h-3.5 text-amber-500" />
                Session {settings.academicSession}
              </span>
            )}

            {settings.showDatesOnWebsite !== false && (settings.startDate || settings.endDate) && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                <Clock className="w-3 h-3 text-slate-500" />
                {settings.startDate && <span>From: {settings.startDate}</span>}
                {settings.startDate && settings.endDate && <span>•</span>}
                {settings.endDate && <span>Until: {settings.endDate}</span>}
              </span>
            )}
          </div>

          {/* Hero Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-blue-950 tracking-tight leading-[1.15] mb-6">
            {settings.heroTitle}
          </h1>

          {/* Description */}
          <p className="max-w-3xl mx-auto text-base sm:text-xl text-slate-600 font-normal leading-relaxed mb-10">
            {settings.heroDescription}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            {isOpen ? (
              <button
                onClick={() => setIsFormModalOpen(true)}
                className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-xl text-slate-950 font-extrabold text-base bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 shadow-xl shadow-amber-400/25 hover:shadow-amber-400/40 hover:-translate-y-1 transition-all duration-300 active:translate-y-0 cursor-pointer border border-amber-300"
              >
                <Sparkles className="w-5 h-5 text-slate-950 group-hover:rotate-12 transition-transform" />
                {settings.applyButtonText || "Apply Now for Admission"}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <div className="px-6 py-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-semibold flex items-center gap-2">
                <Lock className="w-4 h-4" /> Application Form Currently Locked
              </div>
            )}

            {settings.prospectusUrl && (
              <a
                href={settings.prospectusUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-4 rounded-xl text-blue-950 font-bold text-sm bg-white border border-blue-900/15 hover:bg-blue-50 hover:border-blue-300 hover:-translate-y-0.5 transition-all shadow-sm"
              >
                <Download className="w-4 h-4 text-amber-500" />
                {settings.prospectusButtonText || "Download Prospectus"}
              </a>
            )}

            <button
              onClick={() => scrollToSection("contact-admissions")}
              className="inline-flex items-center gap-2 px-6 py-4 rounded-xl text-blue-950 font-bold text-sm bg-white border border-blue-900/15 hover:bg-blue-50 hover:border-blue-300 hover:-translate-y-0.5 transition-all shadow-sm"
            >
              <Phone className="w-4 h-4 text-amber-500" />
              {settings.contactButtonText || "Contact Admissions"}
            </button>
          </div>
        </div>
      </section>

      {/* ================= CLOSED NOTICE BANNER (WHEN CLOSED) ================= */}
      {!isOpen && (
        <section className="py-12 bg-rose-50 border-y border-rose-200 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto border border-rose-300">
              <Lock className="w-8 h-8" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">{settings.closedTitle || "Admissions Are Currently Closed"}</h2>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              {settings.closedDescription || "Applications for this academic session have officially ended. The next admission cycle will be announced soon."}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button
                onClick={() => scrollToSection("contact-admissions")}
                className="px-6 py-3 rounded-xl bg-amber-400 text-slate-950 font-bold text-sm hover:bg-amber-300 transition-colors shadow-md"
              >
                {settings.closedButtonText || "Contact Admissions Office"}
              </button>
              {settings.prospectusUrl && (
                <a
                  href={settings.prospectusUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-xl bg-white text-blue-950 border border-slate-300 font-bold text-sm hover:bg-slate-50 transition-colors shadow-sm"
                >
                  {settings.prospectusButtonText || "Download Prospectus"}
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ================= 2. WHY CHOOSE OUR SCHOOL ================= */}
      {whyUsList.length > 0 && (
        <section className="py-24 px-4 sm:px-6 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase tracking-widest text-amber-600 font-extrabold bg-amber-100 px-3.5 py-1 rounded-full border border-amber-200">
              {settings.whyUsBadge || "Why Red Rose School"}
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-blue-950 tracking-tight">
              {settings.whyUsTitle || "Building a Foundation for Excellence"}
            </h2>
            <p className="text-slate-600 text-base">
              {settings.whyUsDescription || "We offer a comprehensive educational journey designed to foster academic rigor, leadership, and moral values."}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyUsList.map((item, idx) => (
              <div
                key={item.id || idx}
                className="p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-xl bg-blue-950 text-amber-400 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-amber-400 group-hover:text-slate-950 transition-all shadow-md">
                  <DynamicIcon name={item.icon} className="w-7 h-7" defaultIcon={Award} />
                </div>
                <h3 className="text-xl font-bold text-blue-950 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ================= 3. ADMISSION PROCESS TIMELINE ================= */}
      {timelineList.length > 0 && (
        <section className="py-24 px-4 sm:px-6 bg-slate-100/70 border-y border-slate-200/80">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <span className="text-xs uppercase tracking-widest text-blue-900 font-extrabold bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200">
                {settings.processBadge || "Step-By-Step Workflow"}
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-blue-950 tracking-tight">
                {settings.processTitle || "Simple 5-Step Admission Process"}
              </h2>
              <p className="text-slate-600 text-base">
                {settings.processDescription || "A transparent, supportive, and hassle-free path to joining our school community."}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 relative">
              {timelineList.map((step, idx) => (
                <div
                  key={step.id || idx}
                  className="relative p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-amber-400 hover:shadow-lg transition-all group"
                >
                  <span className="text-4xl font-black text-amber-500/30 group-hover:text-amber-500 transition-colors block mb-3">
                    {step.number || `0${idx + 1}`}
                  </span>
                  <h3 className="text-lg font-bold text-blue-950 mb-2">{step.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= 4. ELIGIBILITY CRITERIA ================= */}
      {eligibilityList.length > 0 && (
        <section className="py-24 px-4 sm:px-6 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase tracking-widest text-amber-600 font-extrabold bg-amber-100 px-3.5 py-1 rounded-full border border-amber-200">
              {settings.eligibilityBadge || "Requirements"}
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-blue-950 tracking-tight">
              {settings.eligibilityTitle || "Eligibility Criteria"}
            </h2>
            <p className="text-slate-600 text-base">
              {settings.eligibilityDescription || "Please ensure candidate meets age limits and academic prerequisites prior to applying."}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {eligibilityList.map((item, idx) => (
              <div
                key={item.id || idx}
                className="p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex gap-5"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-900/10 text-blue-900 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div className="space-y-2 flex-1">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <h3 className="text-xl font-bold text-blue-950">{item.grade}</h3>
                    {item.age && (
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                        Age: {item.age}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{item.requirements}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ================= 5. FEE STRUCTURE ================= */}
      <section className="py-24 px-4 sm:px-6 bg-slate-100/70 border-y border-slate-200">
        <div className="max-w-5xl mx-auto text-center space-y-8 p-10 sm:p-16 rounded-3xl bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900 text-white shadow-2xl border border-blue-900">
          <div className="w-16 h-16 rounded-2xl bg-amber-400/15 text-amber-400 flex items-center justify-center mx-auto border border-amber-400/30 shadow-md">
            <FileText className="w-8 h-8" />
          </div>
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
              {settings.feeBadge || "Transparent Pricing"}
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
              {settings.feeTitle || "Fee Structure & Scholarship Policy"}
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto text-base">
              {settings.feeDescription || "We provide transparent fee schedules with no hidden charges. Merit scholarships and need-based financial aid options are available for eligible candidates."}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {settings.feeStructureUrl ? (
              <a
                href={settings.feeStructureUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-extrabold text-base hover:bg-amber-300 shadow-xl shadow-amber-400/20 transition-all border border-amber-300"
              >
                <Download className="w-5 h-5" /> {settings.feeButtonText || "Download Fee Structure PDF"}
              </a>
            ) : (
              <button
                onClick={() => scrollToSection("contact-admissions")}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-amber-400 text-slate-950 font-extrabold text-base hover:bg-amber-300 transition-all shadow-lg"
              >
                <Phone className="w-5 h-5" /> {settings.feeRequestButtonText || "Request Fee Breakdown via Office"}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ================= 6. FREQUENTLY ASKED QUESTIONS ================= */}
      {faqsList.length > 0 && (
        <section className="py-24 px-4 sm:px-6 bg-slate-100/60 border-y border-slate-200">
          <div className="max-w-4xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <span className="text-xs uppercase tracking-widest text-amber-600 font-extrabold bg-amber-100 px-3.5 py-1 rounded-full border border-amber-200">
                {settings.faqsBadge || "Parent Assistance"}
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-blue-950 tracking-tight">
                {settings.faqsTitle || "Frequently Asked Questions"}
              </h2>
              <p className="text-slate-600 text-base">
                {settings.faqsDescription || "Got questions regarding admissions? We have answers."}
              </p>
            </div>

            <div className="space-y-4">
              {faqsList.map((faq, idx) => {
                const isOpenItem = openFaq === idx;
                return (
                  <div
                    key={faq.id || idx}
                    className="rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpenItem ? null : idx)}
                      className="w-full p-6 text-left flex items-center justify-between gap-4 font-bold text-lg text-blue-950 hover:text-amber-600 transition-colors"
                    >
                      <span className="flex items-center gap-3">
                        <HelpCircle className="w-5 h-5 text-amber-500 shrink-0" />
                        {faq.question}
                      </span>
                      <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpenItem ? "rotate-180" : ""}`} />
                    </button>
                    {isOpenItem && (
                      <div className="px-6 pb-6 pt-2 text-slate-600 text-sm leading-relaxed border-t border-slate-100">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ================= 7. CONTACT ADMISSIONS ================= */}
      <section id="contact-admissions" className="py-24 px-4 sm:px-6 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-amber-700 font-extrabold bg-amber-100 px-4 py-2 rounded-full border border-amber-200">
              <Phone className="w-3.5 h-3.5" />
              {settings.contactBadge || "Direct Assistance"}
            </span>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-blue-950 tracking-tight">
              {settings.contactTitle || "Talk to Our Admission Team"}
            </h2>

            <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              {settings.contactDescription ||
                "Have questions about admission? Contact Red Rose School directly and our team will be happy to help."}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">

            {/* PHONE - CLICK TO CALL */}
            <a
              href="tel:+97757590144"
              className="group p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-emerald-50 hover:border-emerald-300 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-lg cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Phone className="w-6 h-6" />
              </div>

              <h3 className="text-lg font-bold text-blue-950 mb-2">
                Call the School
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed">
                057-590144
              </p>

              <p className="text-sm text-slate-600 leading-relaxed">
                057-590145
              </p>

              <span className="inline-flex items-center gap-1 mt-4 text-xs font-bold text-emerald-700">
                Tap to call <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </a>

            {/* EMAIL - CLICK TO OPEN EMAIL */}
            <a
              href={`mailto:${settings.contactEmail || "inforedroseschool@gmail.com"}`}
              className="group p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-violet-50 hover:border-violet-300 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-lg cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Mail className="w-6 h-6" />
              </div>

              <h3 className="text-lg font-bold text-blue-950 mb-2">
                Email Admissions
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed break-all">
                {settings.contactEmail || "inforedroseschool@gmail.com"}
              </p>

              <span className="inline-flex items-center gap-1 mt-4 text-xs font-bold text-violet-700">
                Tap to email <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </a>

            {/* OFFICE HOURS */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-5">
                <Clock className="w-6 h-6" />
              </div>

              <h3 className="text-lg font-bold text-blue-950 mb-2">
                Office Hours
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed">
                {settings.contactHours || "Sun - Fri: 8:00 AM - 4:00 PM"}
              </p>

              <span className="inline-flex items-center gap-1 mt-4 text-xs font-bold text-amber-700">
                Admission support available
              </span>
            </div>

            {/* SCHOOL LOCATION - CLICK TO OPEN GOOGLE MAPS */}
            <a              href="https://www.google.com/maps/place/Red+Rose+English+Boarding+School/data=!4m2!3m1!1s0x0:0x7905f4bf995fafde?sa=X&ved=1t:2428&ictx=111"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-blue-50 hover:border-blue-300 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-lg cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <MapPin className="w-6 h-6" />
              </div>

              <h3 className="text-lg font-bold text-blue-950 mb-2">
                School Location
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed">
                Basudev Marga, Hetauda-2, Makawanpur, Nepal
              </p>

              <span className="inline-flex items-center gap-1 mt-4 text-xs font-bold text-blue-700">
                Open in Google Maps <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </a>

          </div>
        </div>
      </section>

      {/* ================= 8. FINAL CALL TO ACTION BANNER ================= */}
      <section className="py-20 px-4 sm:px-6 bg-gradient-to-br from-amber-50/80 via-white to-blue-50/80 text-slate-900 border-t border-slate-200">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-blue-950">
            {settings.ctaTitle || "Give Your Child the Gift of World-Class Education"}
          </h2>
          <p className="text-slate-600 text-base max-w-2xl mx-auto">
            {settings.ctaDescription || "Take the first step towards a bright academic future with Red Rose Secondary English Boarding School."}
          </p>

          {isOpen ? (
            <button
              onClick={() => setIsFormModalOpen(true)}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-extrabold text-base hover:bg-amber-300 transition-all shadow-xl shadow-amber-400/20 hover:scale-105 active:scale-95 cursor-pointer border border-amber-300"
            >
              {settings.ctaButtonText || "Start Admission Inquiry Now"} <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={() => scrollToSection("contact-admissions")}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-blue-950 text-white font-extrabold text-base hover:bg-blue-900 transition-all shadow-md"
            >
              {settings.ctaClosedButtonText || "Contact Us for Future Cycles"} <Phone className="w-5 h-5 text-amber-400" />
            </button>
          )}
        </div>
      </section>

      {/* ================= FLOATING APPLY NOW ACTION BUTTON (BOTTOM RIGHT) ================= */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed bottom-6 right-6 z-40"
        >
          <button
            onClick={() => setIsFormModalOpen(true)}
            className="group flex items-center gap-3 px-6 py-3.5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-extrabold text-sm shadow-2xl shadow-amber-400/40 hover:scale-105 hover:-translate-y-1 transition-all duration-300 border-2 border-yellow-300 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-slate-950 animate-pulse" />
            <span>Apply Now</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      )}

      {/* ================= POPUP FORM MODAL (LIGHT THEME) ================= */}
      <AnimatePresence>
        {isFormModalOpen && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 my-8 max-h-[90vh] overflow-y-auto text-slate-900"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="absolute top-6 right-6 p-2.5 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-2 pr-8">
                <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-700 border border-amber-200">
                  <Send className="w-3.5 h-3.5" /> Admission Inquiry Portal
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-blue-950">Student Admission Inquiry</h2>
                <p className="text-slate-600 text-xs sm:text-sm max-w-lg mx-auto">
                  Please provide the required student and parent details. Our admission team will contact you promptly.
                </p>
              </div>

              {submitSuccess ? (
                <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 space-y-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-300">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Inquiry Submitted Successfully!</h3>
                  <p className="text-sm text-slate-600 max-w-md mx-auto">{submitSuccess}</p>
                  <div className="pt-4 flex justify-center gap-4">
                    <button
                      onClick={() => setSubmitSuccess(null)}
                      className="px-5 py-2.5 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs hover:bg-emerald-200 transition-colors"
                    >
                      Submit Another Inquiry
                    </button>
                    <button
                      onClick={() => setIsFormModalOpen(false)}
                      className="px-5 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-extrabold text-xs hover:bg-amber-300 transition-colors shadow-md"
                    >
                      Close Window
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  {submitError && (
                    <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-3 text-sm font-medium">
                      <AlertCircle className="w-5 h-5 shrink-0" /> {submitError}
                    </div>
                  )}

                  {/* SECTION 1: STUDENT INFO */}
                  <div className="space-y-4">
                    <h3 className="text-base font-bold text-blue-950 border-b border-slate-200 pb-2 flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-amber-500" /> 1. Student Details
                    </h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Student Full Name *</label>
                        <input
                          type="text"
                          name="studentName"
                          required
                          value={formData.studentName}
                          onChange={handleChange}
                          placeholder="e.g. Aarav Sharma"
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-amber-500 focus:bg-white outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Date of Birth</label>
                        <input
                          type="date"
                          name="dob"
                          value={formData.dob}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-amber-500 focus:bg-white outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-amber-500 focus:bg-white outline-none transition-colors"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Applying for Class *</label>
                        <select
                          name="applyingClass"
                          required
                          value={formData.applyingClass}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-amber-500 focus:bg-white outline-none transition-colors"
                        >
                          {["Play Group", "Nursery", "LKG", "UKG", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9"].map(
                            (cls) => (
                              <option key={cls} value={cls}>{cls}</option>
                            )
                          )}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Academic Session</label>
                        <input
                          type="text"
                          name="academicSession"
                          value={formData.academicSession}
                          onChange={handleChange}
                          placeholder="2027–2028"
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-amber-500 focus:bg-white outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Previous School Name</label>
                        <input
                          type="text"
                          name="prevSchoolName"
                          value={formData.prevSchoolName}
                          onChange={handleChange}
                          placeholder="If applicable"
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-amber-500 focus:bg-white outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2: PARENT INFO */}
                  <div className="space-y-4">
                    <h3 className="text-base font-bold text-blue-950 border-b border-slate-200 pb-2 flex items-center gap-2">
                      <Users className="w-5 h-5 text-amber-500" /> 2. Parent / Guardian Details
                    </h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Parent Full Name *</label>
                        <input
                          type="text"
                          name="parentName"
                          required
                          value={formData.parentName}
                          onChange={handleChange}
                          placeholder="e.g. Ramesh Sharma"
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-amber-500 focus:bg-white outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Relationship</label>
                        <select
                          name="relationship"
                          value={formData.relationship}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-amber-500 focus:bg-white outline-none transition-colors"
                        >
                          <option value="Father">Father</option>
                          <option value="Mother">Mother</option>
                          <option value="Guardian">Guardian</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number *</label>
                        <input
                          type="tel"
                          name="mobile"
                          required
                          value={formData.mobile}
                          onChange={handleChange}
                          placeholder="+977 98XXXXXXXX"
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-amber-500 focus:bg-white outline-none transition-colors"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="parent@example.com"
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-amber-500 focus:bg-white outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SECTION 3: ADDRESS */}
                  <div className="space-y-4">
                    <h3 className="text-base font-bold text-blue-950 border-b border-slate-200 pb-2 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-amber-500" /> 3. Address Details
                    </h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">District</label>
                        <input
                          type="text"
                          name="district"
                          value={formData.district}
                          onChange={handleChange}
                          placeholder="Kathmandu"
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-amber-500 focus:bg-white outline-none transition-colors"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1">Full Street Address *</label>
                        <input
                          type="text"
                          name="fullAddress"
                          required
                          value={formData.fullAddress}
                          onChange={handleChange}
                          placeholder="Tole / House Number / Landmark"
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-amber-500 focus:bg-white outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SECTION 4: FACILITIES */}
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                        <input
                          type="checkbox"
                          name="transportRequired"
                          checked={formData.transportRequired}
                          onChange={handleChange}
                          className="w-4 h-4 text-amber-500 rounded accent-amber-500"
                        />
                        <span className="text-xs font-bold text-slate-800">School Bus Transport Required</span>
                      </label>

                      <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                        <input
                          type="checkbox"
                          name="hostelRequired"
                          checked={formData.hostelRequired}
                          onChange={handleChange}
                          className="w-4 h-4 text-amber-500 rounded accent-amber-500"
                        />
                        <span className="text-xs font-bold text-slate-800">Hostel Facility Required</span>
                      </label>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Additional Questions or Notes</label>
                      <textarea
                        name="message"
                        rows={2}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Write any specific query or message..."
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-amber-500 focus:bg-white outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setIsFormModalOpen(false)}
                      className="px-6 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-extrabold text-xs shadow-lg hover:shadow-amber-400/30 transition-all disabled:opacity-50 flex items-center gap-2 border border-amber-300 cursor-pointer"
                    >
                      {submitting ? "Submitting Inquiry..." : "Submit Admission Inquiry"}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );