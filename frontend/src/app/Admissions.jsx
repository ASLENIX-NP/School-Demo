import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Send, Sparkles, Calendar, Phone } from "lucide-react";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function Admissions() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    studentName: "",
    dob: "",
    gender: "Male",
    grade: "Play Group (PG)",
    parentName: "",
    parentPhone: "",
    parentEmail: "",
    address: "",
    previousSchool: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Header />

      <main className="flex-1 pt-28 pb-20">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-red-600 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold text-red-800 bg-red-100 border border-red-200 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-red-600" />
              <span>Smriti Secondary School Admissions 2083</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black text-slate-950 tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
              Student Admission Application
            </h1>

            <p className="text-slate-600 text-base sm:text-lg mt-3 font-medium">
              Join Smriti School. Please complete the student details below to initiate the enrollment process.
            </p>
          </div>

          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10">
            {/* Checklist */}
            <div className="space-y-6">
              <div className="rounded-3xl p-8 bg-slate-900 text-white shadow-xl border border-slate-800">
                <h3 className="text-2xl font-black text-white mb-4" style={{ fontFamily: "var(--font-display)" }}>
                  Admission Requirements
                </h3>

                <div className="space-y-3 text-sm text-slate-300">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <span>Copy of Student Birth Certificate</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <span>2 Passport size photographs of student</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <span>Previous Grade Marksheet (Grade 1 & above)</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <span>School Transfer Certificate (TC) if applicable</span>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl p-8 bg-white border border-slate-200 shadow-md">
                <h4 className="text-xl font-bold text-slate-950 mb-3">Admission Helpdesk</h4>
                <div className="space-y-2 text-sm font-semibold text-slate-800">
                  <p className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-blue-600" /> +977 01-XXXXXXX / 98XXXXXXXX
                  </p>
                  <p className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-red-600" /> Sun - Fri: 9:00 AM - 4:30 PM
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="rounded-3xl p-8 sm:p-10 bg-white border border-slate-200 shadow-xl">
              {submitted ? (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4 font-bold">
                    <CheckCircle2 className="w-10 h-10 text-blue-600" />
                  </div>
                  <h3 className="text-3xl font-black text-slate-950 mb-2" style={{ fontFamily: "var(--font-display)" }}>
                    Application Submitted!
                  </h3>
                  <p className="text-slate-600 text-sm max-w-md mx-auto mb-6">
                    Thank you, <strong>{formData.parentName}</strong>. Application for student <strong>{formData.studentName}</strong> ({formData.grade}) has been received by Smriti School.
                  </p>
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-slate-950 text-white hover:bg-red-600 transition-colors text-sm"
                  >
                    Return to Homepage
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h3 className="text-2xl font-black text-slate-950 border-b border-slate-100 pb-3" style={{ fontFamily: "var(--font-display)" }}>
                    Student Application Form
                  </h3>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Student Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Child's full name"
                        value={formData.studentName}
                        onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Date of Birth *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 2077-04-12"
                        value={formData.dob}
                        onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Applying for Grade *</label>
                      <select
                        value={formData.grade}
                        onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-red-500"
                      >
                        <option value="Play Group (PG)">Play Group (PG)</option>
                        <option value="Nursery">Nursery</option>
                        <option value="LKG">LKG</option>
                        <option value="UKG">UKG</option>
                        <option value="Grade 1">Grade 1</option>
                        <option value="Grade 2">Grade 2</option>
                        <option value="Grade 3">Grade 3</option>
                        <option value="Grade 4">Grade 4</option>
                        <option value="Grade 5">Grade 5</option>
                        <option value="Grade 6">Grade 6</option>
                        <option value="Grade 7">Grade 7</option>
                        <option value="Grade 8">Grade 8</option>
                        <option value="Grade 9">Grade 9</option>
                        <option value="Grade 10">Grade 10</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Gender *</label>
                      <select
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-red-500"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Parent / Guardian Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Father's / Mother's name"
                        value={formData.parentName}
                        onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="Primary phone number"
                        value={formData.parentPhone}
                        onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-2xl font-black text-white bg-gradient-to-r from-red-600 via-red-500 to-blue-600 hover:from-red-500 hover:to-blue-500 shadow-xl transition-transform hover:scale-[1.01] flex items-center justify-center gap-2 text-base"
                  >
                    <Send className="w-5 h-5" />
                    <span>Submit Application</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
