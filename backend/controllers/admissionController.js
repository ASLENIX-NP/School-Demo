import { supabase } from "../config/supabase.js";
import { getFallbackData, setFallbackData } from "../utils/storageHelper.js";

// Default Admission Settings
const defaultSettings = {
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
  whyUsBadge: "Why Smriti School",
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
      desc: "Receive confirmation, complete fee payment, and welcome to Smriti School!"
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
  documentsBadge: "Checklist",
  documentsTitle: "Required Documents",
  documentsDescription: "Documents to be presented during the final verification stage.",
  requiredDocuments: [
    {
      id: "doc-1",
      name: "Birth Certificate",
      desc: "Official copy issued by local municipality",
      mandatory: true
    },
    {
      id: "doc-2",
      name: "Transfer Certificate (TC)",
      desc: "Original TC from previous school",
      mandatory: true
    },
    {
      id: "doc-3",
      name: "Previous Grade Marksheet",
      desc: "Copy of last annual examination progress report",
      mandatory: true
    },
    {
      id: "doc-4",
      name: "Passport Size Photographs",
      desc: "4 recent color photographs of student & 2 of parents",
      mandatory: true
    },
    {
      id: "doc-5",
      name: "Parent Citizenship / ID Proof",
      desc: "Copy of Citizenship or Passport",
      mandatory: true
    },
    {
      id: "doc-6",
      name: "Character Certificate",
      desc: "For Grade 6 and above",
      mandatory: false
    }
  ],
  importantDatesEnabled: true,
  datesBadge: "Schedule",
  datesTitle: "Important Dates & Deadlines",
  datesDescription: "Keep track of key milestones for academic session.",
  importantDates: [
    {
      id: "date-1",
      title: "Admissions Open",
      date: "2027-01-01",
      desc: "Online inquiry submission portal opens."
    },
    {
      id: "date-2",
      title: "Application Deadline",
      date: "2027-04-30",
      desc: "Last date to submit inquiry & register."
    },
    {
      id: "date-3",
      title: "Entrance Assessment",
      date: "Scheduled upon Inquiry",
      desc: "Interactive student evaluation sessions."
    },
    {
      id: "date-4",
      title: "Academic Session Starts",
      date: "May 2027",
      desc: "Official orientation and session commencement."
    }
  ],
  feeBadge: "Transparent Pricing",
  feeTitle: "Fee Structure & Scholarship Policy",
  feeDescription: "We provide transparent fee schedules with no hidden charges. Merit scholarships and need-based financial aid options are available for eligible candidates.",
  facilitiesBadge: "Campus Infrastructure",
  facilitiesTitle: "Facilities for Comprehensive Growth",
  facilitiesDescription: "Equipped with modern amenities to ensure safety, comfort, and interactive learning.",
  facilitiesList: [
    {
      id: "fac-1",
      icon: "BookOpen",
      title: "Smart Classrooms",
      desc: "Interactive digital displays & multimedia learning."
    },
    {
      id: "fac-2",
      icon: "School",
      title: "Science & Computer Labs",
      desc: "Advanced hands-on practical learning environments."
    },
    {
      id: "fac-3",
      icon: "Bus",
      title: "School Transport",
      desc: "Safe GPS-tracked buses across major city routes."
    },
    {
      id: "fac-4",
      icon: "Home",
      title: "Student Hostel",
      desc: "Comfortable residential boarding with round-the-clock security."
    }
  ],
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
  contactPhone: "+977 1-4567890 / +977 9851012345",
  contactEmail: "admissions@smritischool.edu.np",
  contactHours: "Sun - Fri: 8:00 AM - 4:00 PM",
  contactAddress: "Kathmandu, Nepal",
  ctaTitle: "Give Your Child the Gift of World-Class Education",
  ctaDescription: "Take the first step towards a bright academic future with Smriti Secondary English Boarding School.",
  ctaButtonText: "Start Admission Inquiry Now",
  ctaClosedButtonText: "Contact Us for Future Cycles"
};

// GET Admission Settings
export const getAdmissionSettings = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("site_content")
      .select("*")
      .in("section", ["admission_settings", "admissions"])
      .maybeSingle();

    if (!error && data) {
      const content = typeof data.content === "string" ? JSON.parse(data.content) : data.content;
      return res.json({
        success: true,
        data: { ...defaultSettings, ...content }
      });
    }

    const fallbackSettings = getFallbackData("admission_settings", null);
    const fallbackAdmissions = getFallbackData("admissions", null);
    const fallback = fallbackSettings || fallbackAdmissions || {};

    return res.json({
      success: true,
      data: { ...defaultSettings, ...fallback }
    });
  } catch (err) {
    const fallbackSettings = getFallbackData("admission_settings", null);
    const fallbackAdmissions = getFallbackData("admissions", null);
    const fallback = fallbackSettings || fallbackAdmissions || {};
    return res.json({
      success: true,
      data: { ...defaultSettings, ...fallback }
    });
  }
};

// UPDATE Admission Settings
export const updateAdmissionSettings = async (req, res) => {
  const newSettings = req.body;
  try {
    await supabase
      .from("site_content")
      .upsert(
        {
          section: "admission_settings",
          content: JSON.stringify(newSettings),
          updated_at: new Date().toISOString()
        },
        { onConflict: "section" }
      );

    setFallbackData("admission_settings", newSettings);
    setFallbackData("admissions", newSettings);

    return res.json({
      success: true,
      message: "Admission settings updated successfully",
      data: newSettings
    });
  } catch (err) {
    setFallbackData("admission_settings", newSettings);
    setFallbackData("admissions", newSettings);
    return res.json({
      success: true,
      message: "Admission settings updated successfully (fallback)",
      data: newSettings
    });
  }
};

// SUBMIT Admission Inquiry
export const createAdmissionInquiry = async (req, res) => {
  try {
    const settings = getFallbackData("admission_settings", defaultSettings);
    if (!settings.isOpen) {
      return res.status(400).json({
        success: false,
        message: "Admissions are currently closed. Applications for this academic session have ended."
      });
    }

    const {
      studentName,
      dob,
      gender,
      applyingClass,
      academicSession,
      prevSchoolName,
      currentGrade,
      prevSchoolAddress,
      parentName,
      relationship,
      mobile,
      altContact,
      email,
      province,
      district,
      city,
      ward,
      fullAddress,
      transportRequired,
      hostelRequired,
      referralSource,
      message
    } = req.body;

    if (!studentName || !applyingClass || !parentName || !mobile || !email || !fullAddress) {
      return res.status(400).json({
        success: false,
        message: "Please fill out all required fields marked with *."
      });
    }

    const inquiryId = `INQ-${Date.now().toString().slice(-6)}`;
    const newInquiry = {
      id: inquiryId,
      inquiryId,
      studentName: studentName.trim(),
      dob: dob || "",
      gender: gender || "Not Specified",
      applyingClass: applyingClass.trim(),
      academicSession: academicSession || settings.academicSession || "2027–2028",
      prevSchoolName: prevSchoolName ? prevSchoolName.trim() : "",
      currentGrade: currentGrade ? currentGrade.trim() : "",
      prevSchoolAddress: prevSchoolAddress ? prevSchoolAddress.trim() : "",
      parentName: parentName.trim(),
      relationship: relationship || "Parent",
      mobile: mobile.trim(),
      altContact: altContact ? altContact.trim() : "",
      email: email.trim().toLowerCase(),
      province: province || "",
      district: district || "",
      city: city || "",
      ward: ward || "",
      fullAddress: fullAddress.trim(),
      transportRequired: Boolean(transportRequired),
      hostelRequired: Boolean(hostelRequired),
      referralSource: referralSource || "Website",
      message: message ? message.trim() : "",
      status: "Pending", // Pending, Follow-up, Approved, Converted, Rejected
      createdAt: new Date().toISOString()
    };

    // Try Supabase first
    try {
      await supabase.from("admission_inquiries").insert([newInquiry]);
    } catch (e) {
      console.warn("Supabase insert inquiry error:", e.message);
    }

    // Always append to local fallback
    const inquiries = getFallbackData("admission_inquiries", []);
    inquiries.unshift(newInquiry);
    setFallbackData("admission_inquiries", inquiries);

    return res.status(201).json({
      success: true,
      message: "Admission inquiry submitted successfully! Our team will contact you shortly.",
      data: newInquiry
    });
  } catch (err) {
    console.error("Create admission inquiry error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to submit inquiry. Please try again later.",
      error: err.message
    });
  }
};

// GET All Admission Inquiries (Filterable & Searchable)
export const getAdmissionInquiries = async (req, res) => {
  try {
    let inquiries = getFallbackData("admission_inquiries", []);

    // Try fetching from Supabase if available
    try {
      const { data, error } = await supabase
        .from("admission_inquiries")
        .select("*")
        .order("createdAt", { ascending: false });
      if (!error && data && data.length > 0) {
        inquiries = data;
      }
    } catch (e) {
      // Fallback
    }

    const { search, status, applyingClass } = req.query;

    let filtered = [...inquiries];

    if (search) {
      const term = search.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.studentName?.toLowerCase().includes(term) ||
          item.parentName?.toLowerCase().includes(term) ||
          item.inquiryId?.toLowerCase().includes(term) ||
          item.mobile?.includes(term) ||
          item.email?.toLowerCase().includes(term)
      );
    }

    if (status && status !== "All") {
      filtered = filtered.filter((item) => item.status === status);
    }

    if (applyingClass && applyingClass !== "All") {
      filtered = filtered.filter((item) => item.applyingClass === applyingClass);
    }

    return res.json({
      success: true,
      count: filtered.length,
      data: filtered
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch admission inquiries",
      error: err.message
    });
  }
};

// UPDATE Inquiry Status or Details
export const updateAdmissionInquiry = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    let inquiries = getFallbackData("admission_inquiries", []);
    const index = inquiries.findIndex((item) => item.id === id || item.inquiryId === id);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: "Admission inquiry not found"
      });
    }

    inquiries[index] = {
      ...inquiries[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    setFallbackData("admission_inquiries", inquiries);

    try {
      await supabase
        .from("admission_inquiries")
        .update({ ...updates, updatedAt: new Date().toISOString() })
        .eq("id", id);
    } catch (e) {}

    return res.json({
      success: true,
      message: "Inquiry updated successfully",
      data: inquiries[index]
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to update inquiry",
      error: err.message
    });
  }
};

// DELETE Inquiry
export const deleteAdmissionInquiry = async (req, res) => {
  const { id } = req.params;

  try {
    let inquiries = getFallbackData("admission_inquiries", []);
    const updated = inquiries.filter((item) => item.id !== id && item.inquiryId !== id);

    setFallbackData("admission_inquiries", updated);

    try {
      await supabase.from("admission_inquiries").delete().eq("id", id);
    } catch (e) {}

    return res.json({
      success: true,
      message: "Inquiry deleted successfully"
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete inquiry",
      error: err.message
    });
  }
};

// CONVERT Inquiry to Student
export const convertInquiryToStudent = async (req, res) => {
  const { id } = req.params;

  try {
    let inquiries = getFallbackData("admission_inquiries", []);
    const index = inquiries.findIndex((item) => item.id === id || item.inquiryId === id);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: "Admission inquiry not found"
      });
    }

    const inquiry = inquiries[index];

    // Create Student Record
    const studentId = `STU-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const studentRecord = {
      id: studentId,
      studentId,
      inquiryId: inquiry.inquiryId,
      name: inquiry.studentName,
      dob: inquiry.dob,
      gender: inquiry.gender,
      grade: inquiry.applyingClass,
      academicSession: inquiry.academicSession,
      parentName: inquiry.parentName,
      relationship: inquiry.relationship,
      phone: inquiry.mobile,
      email: inquiry.email,
      address: inquiry.fullAddress,
      district: inquiry.district,
      province: inquiry.province,
      transportRequired: inquiry.transportRequired,
      hostelRequired: inquiry.hostelRequired,
      enrollmentDate: new Date().toISOString(),
      status: "Active"
    };

    // Save to students list
    const students = getFallbackData("students", []);
    students.unshift(studentRecord);
    setFallbackData("students", students);

    // Update inquiry status
    inquiries[index].status = "Converted";
    inquiries[index].convertedAt = new Date().toISOString();
    inquiries[index].assignedStudentId = studentId;
    setFallbackData("admission_inquiries", inquiries);

    try {
      await supabase.from("students").insert([studentRecord]);
      await supabase
        .from("admission_inquiries")
        .update({ status: "Converted", convertedAt: new Date().toISOString(), assignedStudentId: studentId })
        .eq("id", id);
    } catch (e) {}

    return res.json({
      success: true,
      message: `Inquiry successfully converted to Student (${studentId})!`,
      data: {
        student: studentRecord,
        inquiry: inquiries[index]
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to convert inquiry to student",
      error: err.message
    });
  }
};

// GET Admission Analytics & Insights
export const getAdmissionAnalytics = async (req, res) => {
  try {
    const inquiries = getFallbackData("admission_inquiries", []);
    const settings = getFallbackData("admission_settings", defaultSettings);

    const total = inquiries.length;
    const todayStr = new Date().toISOString().split("T")[0];
    const todayCount = inquiries.filter((item) => item.createdAt && item.createdAt.startsWith(todayStr)).length;

    const pendingCount = inquiries.filter((item) => item.status === "Pending").length;
    const followUpCount = inquiries.filter((item) => item.status === "Follow-up").length;
    const approvedCount = inquiries.filter((item) => item.status === "Approved").length;
    const convertedCount = inquiries.filter((item) => item.status === "Converted").length;
    const rejectedCount = inquiries.filter((item) => item.status === "Rejected").length;

    // Inquiries by Class
    const classMap = {};
    inquiries.forEach((item) => {
      const cls = item.applyingClass || "Unassigned";
      classMap[cls] = (classMap[cls] || 0) + 1;
    });

    let mostAppliedClass = "N/A";
    let maxClassCount = 0;
    Object.entries(classMap).forEach(([cls, count]) => {
      if (count > maxClassCount) {
        maxClassCount = count;
        mostAppliedClass = cls;
      }
    });

    // Gender breakdown
    const genderMap = { Male: 0, Female: 0, Other: 0 };
    inquiries.forEach((item) => {
      const g = item.gender || "Other";
      if (genderMap[g] !== undefined) genderMap[g]++;
      else genderMap.Other++;
    });

    // District breakdown
    const districtMap = {};
    inquiries.forEach((item) => {
      const d = item.district || item.province || "Other";
      if (d) districtMap[d] = (districtMap[d] || 0) + 1;
    });

    // Conversion rate
    const conversionRate = total > 0 ? ((convertedCount / total) * 100).toFixed(1) : "0.0";

    return res.json({
      success: true,
      data: {
        total,
        todayCount,
        isOpen: settings.isOpen,
        pendingCount,
        followUpCount,
        approvedCount,
        convertedCount,
        rejectedCount,
        mostAppliedClass,
        conversionRate,
        classBreakdown: classMap,
        genderBreakdown: genderMap,
        districtBreakdown: districtMap
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch analytics",
      error: err.message
    });
  }
};
