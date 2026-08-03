import React, { useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Phone,
  Clock,
  GraduationCap,
  BookOpen,
  FileText,
  Bell,
  Award,
  Building,
} from "lucide-react";
import { staffData } from "../data/staffData";
import SyllabusCard from "../components/SyllabusCard";
import AnnouncementBoard from "../components/AnnouncementBoard";

export function TeacherProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const teacher = useMemo(() => {
    if (!id) return staffData[0];

    const cleanId = String(id).trim().toLowerCase();

    // 1. Direct ID match
    const directMatch = staffData.find((t) => String(t.id).toLowerCase() === cleanId);
    if (directMatch) return directMatch;

    // 2. Name / Slug match
    const nameMatch = staffData.find(
      (t) =>
        t.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === cleanId ||
        t.name.toLowerCase().includes(cleanId)
    );
    if (nameMatch) return nameMatch;

    // 3. Numerical index fallback
    const num = parseInt(cleanId, 10);
    if (!isNaN(num) && num >= 1 && num <= staffData.length) {
      return staffData[num - 1];
    }

    return null;
  }, [id]);

  if (!teacher) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-slate-50 flex items-center justify-center">
        <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center max-w-md shadow-sm">
          <h2 className="text-xl font-extrabold text-[#0A1628]">Faculty Member Not Found</h2>
          <p className="text-xs text-slate-500 mt-2 mb-6">
            The profile you are looking for does not exist or has been relocated.
          </p>
          <Link
            to="/staff"
            className="px-6 py-2.5 rounded-xl bg-[#0A1628] text-white text-xs font-bold hover:bg-blue-900 transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Faculty Directory
          </Link>
        </div>
      </div>
    );
  }

  const {
    name,
    title,
    department,
    subject,
    grades,
    email,
    phone,
    officeHours,
    photo,
    bio,
    education,
    experience,
    syllabus,
    announcements,
  } = teacher;

  return (
    <section className="min-h-screen pt-28 pb-24 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Navigation Link */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/staff")}
            aria-label="Back to Faculty & Staff Directory"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#0A1628] bg-white border border-slate-200/90 rounded-full px-4 py-2 shadow-sm transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Staff Directory</span>
          </button>
        </div>

        {/* Hero Profile Header Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-10 shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Photo Column */}
            <div className="md:col-span-4 flex justify-center">
              <div className="relative p-1.5 rounded-3xl bg-slate-100 border-2 border-slate-200 shadow-md overflow-hidden">
                <img
                  src={photo}
                  alt={`Photo of ${name}, ${title}`}
                  className="w-48 h-48 sm:w-56 sm:h-56 rounded-2xl object-cover"
                />
              </div>
            </div>

            {/* Profile Info Column */}
            <div className="md:col-span-8 space-y-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="inline-block px-3 py-1 rounded-md text-xs font-extrabold bg-sky-50 text-sky-800 border border-sky-200/80">
                    {department} Department
                  </span>
                  {experience && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      <Award className="w-3.5 h-3.5 text-slate-700" />
                      {experience}
                    </span>
                  )}
                </div>

                <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0A1628]">
                  {name}
                </h1>
                <p className="text-sm font-bold text-[#1E3A5F] mt-1">{title}</p>
              </div>

              {/* Subject & Office Hours Quick Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <BookOpen className="w-5 h-5 text-[#0A1628] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                      Subject & Grades
                    </p>
                    <p className="text-xs font-bold text-[#0A1628]">{subject}</p>
                    <p className="text-[11px] text-slate-500">{grades}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <Clock className="w-5 h-5 text-[#0A1628] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                      Office Hours
                    </p>
                    <p className="text-xs font-bold text-[#0A1628]">{officeHours}</p>
                  </div>
                </div>
              </div>

              {/* Direct Contact Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href={`mailto:${email}`}
                  aria-label={`Email ${name}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-800 transition-colors cursor-pointer"
                >
                  <Mail className="w-4 h-4 text-slate-600" />
                  <span>Send Email ({email})</span>
                </a>

                {phone && (
                  <a
                    href={`tel:${phone}`}
                    aria-label={`Call ${name}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-800 transition-colors cursor-pointer"
                  >
                    <Phone className="w-4 h-4 text-slate-600" />
                    <span>{phone}</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column (Bio & Education) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Biography Card */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
              <h3 className="text-lg font-extrabold text-[#0A1628] mb-4 flex items-center gap-2">
                <Building className="w-5 h-5 text-[#0A1628]" />
                Biography & Teaching Philosophy
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {bio}
              </p>
            </div>

            {/* Education Section */}
            {education && education.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
                <h3 className="text-lg font-extrabold text-[#0A1628] mb-5 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-[#0A1628]" />
                  Education & Qualifications
                </h3>

                <div className="space-y-4">
                  {education.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start justify-between"
                    >
                      <div>
                        <h4 className="text-xs sm:text-sm font-extrabold text-[#0A1628]">
                          {item.degree}
                        </h4>
                        <p className="text-xs font-semibold text-slate-500 mt-0.5">
                          {item.institution}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-slate-400 bg-white px-2.5 py-1 rounded-md border border-slate-200 shrink-0">
                        {item.year}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column (Syllabus & Announcements) */}
          <div className="lg:col-span-5 space-y-8">
            {/* Class Syllabus Download Section */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
              <h3 className="text-lg font-extrabold text-[#0A1628] mb-5 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#0A1628]" />
                Class Syllabus & Downloads
              </h3>

              {syllabus && syllabus.length > 0 ? (
                <div className="space-y-3">
                  {syllabus.map((item) => (
                    <SyllabusCard key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500 font-semibold">
                  No downloadable syllabus documents currently listed.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TeacherProfile;
