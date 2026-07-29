import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, Sparkles } from "lucide-react";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    grade: "PG / Play Group",
    message: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-16 sm:py-24 bg-slate-50 relative overflow-hidden">
      <div className="max-w-[1450px] mx-auto px-5 sm:px-8 relative z-10">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 items-start">
          {/* Contact Information */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-red-600 bg-red-100/80 border border-red-200 mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Contact Smriti School</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-950 leading-tight mb-6" style={{ fontFamily: "var(--font-display)" }}>
              Visit Our Campus or Send an Inquiry
            </h2>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-8 font-medium">
              We invite parents and prospective students to tour Smriti Secondary School. Reach out to our admissions helpdesk today.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-red-600/10 text-red-600 flex items-center justify-center shrink-0 font-bold">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-950">Campus Location</h4>
                  <p className="text-slate-600 text-sm mt-0.5">Kathmandu / Hetauda, Nepal</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center shrink-0 font-bold">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-950">Contact Phone</h4>
                  <p className="text-slate-600 text-sm mt-0.5">+977 01-XXXXXXX / +977 98XXXXXXXX</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-red-600/10 text-red-600 flex items-center justify-center shrink-0 font-bold">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-950">Email Address</h4>
                  <p className="text-slate-600 text-sm mt-0.5">info@smritischool.edu.np / admissions@smritischool.edu.np</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center shrink-0 font-bold">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-950">Office Operating Hours</h4>
                  <p className="text-slate-600 text-sm mt-0.5">Sunday - Friday: 9:00 AM - 4:30 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="rounded-3xl p-8 sm:p-10 bg-slate-900 text-white shadow-2xl border border-slate-800">
            {submitted ? (
              <div className="py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-white mb-2">Inquiry Received!</h3>
                <p className="text-slate-300 text-sm max-w-md mx-auto mb-6">
                  Thank you for contacting Smriti School. Our admissions team will get in touch with you shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 rounded-xl font-bold bg-slate-800 text-white hover:bg-slate-700 text-sm"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h3 className="text-2xl font-black text-white mb-1" style={{ fontFamily: "var(--font-display)" }}>
                    Send an Admission Inquiry
                  </h3>
                  <p className="text-slate-400 text-sm">
                    Fill out your details to receive syllabus information or schedule a campus visit.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Parent / Guardian Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Adhikari"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Contact Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 98XXXXXXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="e.g. parent@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Target Grade Level</label>
                    <select
                      value={formData.grade}
                      onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-red-500"
                    >
                      <option value="PG / Play Group">Play Group / Nursery</option>
                      <option value="KG">LKG / UKG</option>
                      <option value="Grade 1 - 5">Primary (Grade 1 - 5)</option>
                      <option value="Grade 6 - 8">Lower Secondary (Grade 6 - 8)</option>
                      <option value="Grade 9 - 10">Secondary (Grade 9 - 10)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Message / Specific Questions</label>
                  <textarea
                    rows={4}
                    placeholder="Describe your inquiry..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-red-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl font-black text-white bg-gradient-to-r from-red-600 via-red-500 to-blue-600 hover:from-red-500 hover:to-blue-500 shadow-lg hover:scale-[1.01] flex items-center justify-center gap-2 text-base transition-all"
                >
                  <Send className="w-5 h-5" />
                  <span>Submit Inquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
