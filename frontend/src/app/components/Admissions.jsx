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
  BookOpen,
  GraduationCap,
  Bus,
  Home,
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
  academicSession: "2027–2028",
  startDate: "2027-01-01",
  endDate: "2027-04-30",
  heroBadgeText: "Admissions Open for 2027–2028",
  heroTitle: "Empowering Next Generation Leaders",
  heroDescription:
    "Join our vibrant learning community. We offer holistic education, state-of-the-art facilities, and an environment where every child excels.",
  countdownEnabled: false,
  applyButtonText: "Apply Now for Admission",
  prospectusUrl: "",
  feeStructureUrl: "",
  contactPhone: "+977 1-4567890 / +977 9851012345",
  contactEmail: "admissions@smritischool.edu.np",
  contactHours: "Sun - Fri: 8:00 AM - 4:00 PM",
  contactAddress: "Kathmandu, Nepal",
  eligibilityCriteria: [
    { grade: "Play Group & Nursery", age: "2.5 - 3.5 years", requirements: "Child birth certificate, medical immunization record." },
    { grade: "LKG & UKG", age: "4.0 - 5.0 years", requirements: "Basic interaction, previous school report card if attended." },
    { grade: "Grade 1 - 5 (Primary)", age: "6.0+ years", requirements: "Passed previous grade, Transfer Certificate (TC), marksheets." },
    { grade: "Grade 6 - 9 (Secondary)", age: "11.0+ years", requirements: "Passed entrance test, character certificate, grade report card." }
  ],
  requiredDocuments: [
    { name: "Birth Certificate", desc: "Official copy issued by local municipality", mandatory: true },
    { name: "Transfer Certificate (TC)", desc: "Original TC from previous school", mandatory: true },
    { name: "Previous Grade Marksheet", desc: "Copy of last annual examination progress report", mandatory: true },
    { name: "Passport Size Photographs", desc: "4 recent color photographs of student & 2 of parents", mandatory: true },
    { name: "Parent Citizenship / ID Proof", desc: "Copy of Citizenship or Passport", mandatory: true },
    { name: "Character Certificate", desc: "For Grade 6 and above", mandatory: false }
  ],
  importantDatesEnabled: true,
  importantDates: [
    { title: "Admissions Open", date: "2027-01-01", desc: "Online inquiry submission portal opens." },
    { title: "Application Deadline", date: "2027-04-30", desc: "Last date to submit inquiry & register." },
    { title: "Entrance Assessment", date: "Scheduled upon Inquiry", desc: "Interactive student evaluation sessions." },
    { title: "Academic Session Starts", date: "May 2027", desc: "Official orientation and session commencement." }
  ],
  faqs: [
    { question: "What is the admission procedure?", answer: "Fill out the online inquiry form or visit our campus. After submission, our admissions team will schedule an assessment and parent interaction session." },
    { question: "Is school transportation available?", answer: "Yes, we operate safe and modern bus services covering major routes across the city." },
    { question: "Are hostel / residential facilities provided?", answer: "Yes, we have separate well-equipped hostel facilities for boys and girls with 24/7 care and academic supervision." },
    { question: "What are the school hours?", answer: "Regular school hours are from 9:00 AM to 3:30 PM, Sunday through Friday." }
  ]
};

export const defaultAdmissionsContent = defaultSettings;
export const defaultContent = defaultSettings;
export function mergeAdmissionsContent(saved = {}) {
  return { ...defaultSettings, ...saved };
}

const whyUs = [
  { icon: Award, title: "Academic Excellence", desc: "Rigorous curriculum focused on conceptual clarity, critical thinking, and STEAM education." },
  { icon: Users, title: "Expert Educators", desc: "Passionate teachers dedicated to mentoring, inspiring, and bringing out the best in every child." },
  { icon: School, title: "World-Class Infrastructure", desc: "Smart classrooms, science & robotics labs, digital library, and comprehensive sports facilities." },
  { icon: ShieldCheck, title: "Safe & Nurturing Environment", desc: "CCTV-monitored campus, strict safety protocols, and caring staff ensuring student well-being." }
];

const timelineSteps = [
  { number: "01", title: "Submit Inquiry", desc: "Fill out our online inquiry form with student & parent details." },
  { number: "02", title: "Campus Interaction", desc: "Visit our campus to meet counselors and explore our learning environment." },
  { number: "03", title: "Assessment", desc: "Child participates in an age-appropriate assessment and friendly interaction." },
  { number: "04", title: "Verification", desc: "Submit required academic documents and birth record for verification." },
  { number: "05", title: "Final Enrollment", desc: "Receive confirmation, complete fee payment, and welcome to Smriti School!" }
];

const facilitiesList = [
  { title: "Smart Classrooms", desc: "Interactive digital displays & multimedia learning.", icon: BookOpen },
  { title: "Science & Computer Labs", desc: "Advanced hands-on practical learning environments.", icon: School },
  { title: "School Transport", desc: "Safe GPS-tracked buses across major city routes.", icon: Bus },
  { title: "Student Hostel", desc: "Comfortable residential boarding with round-the-clock security.", icon: Home }
];

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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-amber-400 selection:text-slate-950 relative">
      {/* ================= 1. HERO BANNER (70% White, 20% Blue, 10% Yellow) ================= */}
      <section className="relative min-h-[80vh] flex items-center justify-center pt-32 pb-20 px-4 sm:px-6 overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-slate-50 border-b border-blue-100">
        {/* Soft Background Gradients */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-amber-400/10 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="relative max-w-6xl mx-auto text-center z-10">
          {/* Status Badge & Session */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
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

            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-blue-900/5 text-blue-950 border border-blue-900/15">
              <Calendar className="w-3.5 h-3.5 text-amber-500" />
              Session {settings.academicSession}
            </span>
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
                Download Prospectus
              </a>
            )}

            <button
              onClick={() => scrollToSection("contact-admissions")}
              className="inline-flex items-center gap-2 px-6 py-4 rounded-xl text-blue-950 font-bold text-sm bg-white border border-blue-900/15 hover:bg-blue-50 hover:border-blue-300 hover:-translate-y-0.5 transition-all shadow-sm"
            >
              <Phone className="w-4 h-4 text-amber-500" />
              Contact Admissions
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
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Admissions Are Currently Closed</h2>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Applications for this academic session have officially ended. The next admission cycle will be announced soon.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button
                onClick={() => scrollToSection("contact-admissions")}
                className="px-6 py-3 rounded-xl bg-amber-400 text-slate-950 font-bold text-sm hover:bg-amber-300 transition-colors shadow-md"
              >
                Contact Admissions Office
              </button>
              {settings.prospectusUrl && (
                <a
                  href={settings.prospectusUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-xl bg-white text-blue-950 border border-slate-300 font-bold text-sm hover:bg-slate-50 transition-colors shadow-sm"
                >
                  Download Prospectus
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ================= 2. WHY CHOOSE OUR SCHOOL ================= */}
      <section className="py-24 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-widest text-amber-600 font-extrabold bg-amber-100 px-3.5 py-1 rounded-full border border-amber-200">
            Why Smriti School
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-blue-950 tracking-tight">
            Building a Foundation for Excellence
          </h2>
          <p className="text-slate-600 text-base">
            We offer a comprehensive educational journey designed to foster academic rigor, leadership, and moral values.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyUs.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-xl bg-blue-950 text-amber-400 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-amber-400 group-hover:text-slate-950 transition-all shadow-md">
                  <IconComponent className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-blue-950 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= 3. ADMISSION PROCESS TIMELINE ================= */}
      <section className="py-24 px-4 sm:px-6 bg-slate-100/70 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase tracking-widest text-blue-900 font-extrabold bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200">
              Step-By-Step Workflow
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-blue-950 tracking-tight">
              Simple 5-Step Admission Process
            </h2>
            <p className="text-slate-600 text-base">
              A transparent, supportive, and hassle-free path to joining our school community.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 relative">
            {timelineSteps.map((step, idx) => (
              <div
                key={idx}
                className="relative p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-amber-400 hover:shadow-lg transition-all group"
              >
                <span className="text-4xl font-black text-amber-500/30 group-hover:text-amber-500 transition-colors block mb-3">
                  {step.number}
                </span>
                <h3 className="text-lg font-bold text-blue-950 mb-2">{step.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 4. ELIGIBILITY CRITERIA ================= */}
      <section className="py-24 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-widest text-amber-600 font-extrabold bg-amber-100 px-3.5 py-1 rounded-full border border-amber-200">
            Requirements
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-blue-950 tracking-tight">
            Eligibility Criteria
          </h2>
          <p className="text-slate-600 text-base">
            Please ensure candidate meets age limits and academic prerequisites prior to applying.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {(settings.eligibilityCriteria || defaultSettings.eligibilityCriteria).map((item, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex gap-5"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-900/10 text-blue-900 flex items-center justify-center shrink-0">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-xl font-bold text-blue-950">{item.grade}</h3>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                    Age: {item.age}
                  </span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{item.requirements}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= 5. REQUIRED DOCUMENTS ================= */}
      <section className="py-24 px-4 sm:px-6 bg-blue-950/5 border-y border-blue-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase tracking-widest text-blue-900 font-extrabold bg-blue-100 px-3.5 py-1 rounded-full border border-blue-200">
              Checklist
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-blue-950 tracking-tight">
              Required Documents
            </h2>
            <p className="text-slate-600 text-base">
              Documents to be presented during the final verification stage.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(settings.requiredDocuments || defaultSettings.requiredDocuments).map((doc, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-blue-300 transition-all flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-1">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-blue-950">{doc.name}</h3>
                    {doc.mandatory && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-700 uppercase">
                        Mandatory
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{doc.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 6. IMPORTANT DATES (DYNAMIC & ADMIN-CONTROLLABLE) ================= */}
      {settings.importantDatesEnabled !== false && Array.isArray(settings.importantDates) && settings.importantDates.length > 0 && (
        <section className="py-24 px-4 sm:px-6 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase tracking-widest text-amber-600 font-extrabold bg-amber-100 px-3.5 py-1 rounded-full border border-amber-200">
              Schedule
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-blue-950 tracking-tight">
              Important Dates & Deadlines
            </h2>
            <p className="text-slate-600 text-base">
              Keep track of key milestones for academic session {settings.academicSession}.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {settings.importantDates.map((item, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm text-center space-y-3 hover:border-amber-400 hover:shadow-md transition-all">
                <Calendar className="w-8 h-8 text-amber-500 mx-auto" />
                <h3 className="text-lg font-bold text-blue-950">{item.title}</h3>
                <p className="text-amber-600 font-bold text-sm">{item.date}</p>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ================= 7. FEE STRUCTURE (20% Royal Blue Card, 10% Yellow CTA) ================= */}
      <section className="py-24 px-4 sm:px-6 bg-slate-100/70 border-y border-slate-200">
        <div className="max-w-5xl mx-auto text-center space-y-8 p-10 sm:p-16 rounded-3xl bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900 text-white shadow-2xl border border-blue-900">
          <div className="w-16 h-16 rounded-2xl bg-amber-400/15 text-amber-400 flex items-center justify-center mx-auto border border-amber-400/30 shadow-md">
            <FileText className="w-8 h-8" />
          </div>
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">Transparent Pricing</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white">Fee Structure & Scholarship Policy</h2>
            <p className="text-slate-300 max-w-2xl mx-auto text-base">
              We provide transparent fee schedules with no hidden charges. Merit scholarships and need-based financial aid options are available for eligible candidates.
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
                <Download className="w-5 h-5" /> Download Fee Structure PDF
              </a>
            ) : (
              <button
                onClick={() => scrollToSection("contact-admissions")}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-amber-400 text-slate-950 font-extrabold text-base hover:bg-amber-300 transition-all shadow-lg"
              >
                <Phone className="w-5 h-5" /> Request Fee Breakdown via Office
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ================= 8. SCHOOL FACILITIES ================= */}
      <section className="py-24 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-widest text-blue-900 font-extrabold bg-blue-100 px-3.5 py-1 rounded-full border border-blue-200">
            Campus Infrastructure
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-blue-950 tracking-tight">
            Facilities for Comprehensive Growth
          </h2>
          <p className="text-slate-600 text-base">
            Equipped with modern amenities to ensure safety, comfort, and interactive learning.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {facilitiesList.map((fac, idx) => {
            const IconComp = fac.icon;
            return (
              <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 hover:border-blue-300 transition-all">
                <div className="w-12 h-12 rounded-xl bg-blue-900/10 text-blue-900 flex items-center justify-center">
                  <IconComp className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-blue-950">{fac.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{fac.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= 9. FREQUENTLY ASKED QUESTIONS ================= */}
      <section className="py-24 px-4 sm:px-6 bg-slate-100/60 border-y border-slate-200">
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase tracking-widest text-amber-600 font-extrabold bg-amber-100 px-3.5 py-1 rounded-full border border-amber-200">
              Parent Assistance
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-blue-950 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 text-base">
              Got questions regarding admissions? We have answers.
            </p>
          </div>

          <div className="space-y-4">
            {(settings.faqs || defaultSettings.faqs).map((faq, idx) => {
              const isOpenItem = openFaq === idx;
              return (
                <div
                  key={idx}
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

      {/* ================= 10. CONTACT ADMISSIONS ================= */}
      <section id="contact-admissions" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-widest text-blue-900 font-extrabold bg-blue-100 px-3.5 py-1 rounded-full border border-blue-200">
            Direct Assistance
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-blue-950 tracking-tight">
            Contact Admission Office
          </h2>
          <p className="text-slate-600 text-base">
            Have questions? Reach out directly to our friendly admission counselors.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3">
            <Phone className="w-8 h-8 text-blue-900" />
            <h3 className="text-lg font-bold text-blue-950">Phone Support</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{settings.contactPhone}</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3">
            <Mail className="w-8 h-8 text-blue-900" />
            <h3 className="text-lg font-bold text-blue-950">Email Address</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{settings.contactEmail}</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3">
            <Clock className="w-8 h-8 text-blue-900" />
            <h3 className="text-lg font-bold text-blue-950">Office Hours</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{settings.contactHours}</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3">
            <MapPin className="w-8 h-8 text-blue-900" />
            <h3 className="text-lg font-bold text-blue-950">Campus Location</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{settings.contactAddress}</p>
          </div>
        </div>
      </section>

      {/* ================= 11. FINAL CALL TO ACTION BANNER (20% Royal Blue, 10% Yellow Button) ================= */}
      <section className="py-20 px-4 sm:px-6 bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 text-white border-t border-blue-900">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
            Give Your Child the Gift of World-Class Education
          </h2>
          <p className="text-slate-300 text-base max-w-2xl mx-auto">
            Take the first step towards a bright academic future with Smriti Secondary English Boarding School.
          </p>

          {isOpen ? (
            <button
              onClick={() => setIsFormModalOpen(true)}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-extrabold text-base hover:bg-amber-300 transition-all shadow-xl shadow-amber-400/20 hover:scale-105 active:scale-95 cursor-pointer border border-amber-300"
            >
              Start Admission Inquiry Now <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={() => scrollToSection("contact-admissions")}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-white/10 text-white font-extrabold text-base hover:bg-white/20 transition-all border border-white/20"
            >
              Contact Us for Future Cycles <Phone className="w-5 h-5 text-amber-400" />
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
}