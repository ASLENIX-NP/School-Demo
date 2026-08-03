import { useEffect, useState } from "react";
import axios from "axios";
import {
  Award,
  BookOpen,
  Camera,
  FileText,
  GraduationCap,
  Mail,
  Pencil,
  Phone,
  Plus,
  Trash2,
  UserRound,
  Users,
  X,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const colors = {
  navy: "#0A1628",
  primary: "#1E3A5F",
  slate: "#475569",
  light: "#F8FAFC",
  white: "#FFFFFF",
};

const HARDCODED_STAFF_IMAGE_URLS = [
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
  "https://images.unsplash.com/photo-1504593811423-6dd665756598",
];

function isHardcodedStaffImageUrl(value = "") {
  const clean = String(value || "").trim();
  return HARDCODED_STAFF_IMAGE_URLS.some((url) => clean.startsWith(url));
}

export const defaultStaffContent = {
  badgeText: "Faculty & Team",
  title: "Our Staff Members",
  highlightedWord: "Staff Members",
  subtitle:
    "Meet the dedicated educators, department heads, and leaders guiding students at Smriti Secondary English Boarding School.",
  stats: [
    {
      id: "teachingStaff",
      value: "50+",
      label: "Teaching Staff",
      icon: "users",
    },
    {
      id: "expertFaculty",
      value: "240+",
      label: "Faculty Members",
      icon: "graduation",
    },
    {
      id: "yearsExcellence",
      value: "35+",
      label: "Years Excellence",
      icon: "award",
    },
  ],
  staff: [
    {
      id: 1,
      name: "Binod Subedi",
      position: "Principal",
      imageUrl: "",
      imageZoom: 1,
      imageOffsetX: 0,
      imageOffsetY: 0,
      qualification: "M.Ed in Educational Leadership",
      phone: "057-590144",
      email: "principal@smritischool.edu.np",
      description:
        "Mr. Binod Subedi has been leading Smriti Boarding School with vision and commitment for over a decade, driving academic rigor and holistic development.",
      visible: true,
    },
    {
      id: 2,
      name: "Amul Shrestha",
      position: "Vice Principal",
      imageUrl: "",
      imageZoom: 1,
      imageOffsetX: 0,
      imageOffsetY: 0,
      qualification: "M.Ed",
      phone: "057-590145",
      email: "viceprincipal@smritischool.edu.np",
      description:
        "Oversees daily academic administration, teacher development, and student welfare, maintaining high standards of discipline and achievement.",
      visible: true,
    },
    {
      id: 3,
      name: "Prem Hamal",
      position: "Science Dept Head",
      imageUrl: "",
      imageZoom: 1,
      imageOffsetX: 0,
      imageOffsetY: 0,
      qualification: "B.Sc, B.Ed",
      phone: "057-590146",
      email: "prem.science@smritischool.edu.np",
      description:
        "Passionate science educator bringing hands-on practical experiments in Physics, Chemistry, and Biology to secondary school students.",
      visible: true,
    },
    {
      id: 4,
      name: "Saraswati Sharma",
      position: "English Dept Head",
      imageUrl: "",
      imageZoom: 1,
      imageOffsetX: 0,
      imageOffsetY: 0,
      qualification: "M.A. English, B.Ed",
      phone: "057-590144",
      email: "saraswati.english@smritischool.edu.np",
      description:
        "Specializes in English literature and communication skills, fostering creative writing and debate programs across all grade levels.",
      visible: true,
    },
    {
      id: 5,
      name: "Ramesh Karki",
      position: "Mathematics Dept Head",
      imageUrl: "",
      imageZoom: 1,
      imageOffsetX: 0,
      imageOffsetY: 0,
      qualification: "M.Sc Mathematics",
      phone: "057-590145",
      email: "ramesh.math@smritischool.edu.np",
      description:
        "Dedicated to simplifying mathematics and encouraging logical thinking, problem-solving, and competitive Olympiad prep.",
      visible: true,
    },
    {
      id: 6,
      name: "Anita Adhikari",
      position: "Primary Level Coordinator",
      imageUrl: "",
      imageZoom: 1,
      imageOffsetX: 0,
      imageOffsetY: 0,
      qualification: "M.Ed in Child Psychology",
      phone: "057-590146",
      email: "anita.primary@smritischool.edu.np",
      description:
        "Guides primary educators to build a friendly, nurturing, activity-based foundation for young learners.",
      visible: true,
    },
  ],
};

function normalizeStats(stats) {
  if (!Array.isArray(stats) || stats.length === 0) {
    return defaultStaffContent.stats;
  }
  return stats.map((stat, index) => ({
    ...(defaultStaffContent.stats[index] || {}),
    ...stat,
    id: stat.id || `stat-${index}`,
    icon: stat.icon || defaultStaffContent.stats[index]?.icon || "users",
  }));
}

function clampNumber(value, min, max, fallback) {
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue)) return fallback;
  return Math.min(max, Math.max(min, numberValue));
}

function normalizeStaff(staff) {
  if (!Array.isArray(staff) || staff.length === 0) {
    return defaultStaffContent.staff;
  }
  return staff.map((member, index) => {
    const savedImageUrl = String(member.imageUrl || "").trim();
    const cleanImageUrl = isHardcodedStaffImageUrl(savedImageUrl) ? "" : savedImageUrl;

    return {
      ...(defaultStaffContent.staff[index] || {}),
      ...member,
      id: member.id || Date.now() + index,
      name: member.name || "Staff Member",
      position: member.position || "Teacher",
      imageUrl: cleanImageUrl,
      imageZoom: clampNumber(member.imageZoom, 1, 3, 1),
      imageOffsetX: clampNumber(member.imageOffsetX, -60, 60, 0),
      imageOffsetY: clampNumber(member.imageOffsetY, -60, 60, 0),
      qualification: member.qualification || "",
      phone: member.phone || "",
      email: member.email || "",
      description: member.description || "",
      visible: member.visible !== false,
    };
  });
}

export function mergeStaffContent(saved = {}) {
  return {
    ...defaultStaffContent,
    ...(saved || {}),
    stats: normalizeStats(saved?.stats),
    staff: normalizeStaff(saved?.staff),
  };
}

function getStatIcon(icon) {
  if (icon === "graduation") return GraduationCap;
  if (icon === "award") return Award;
  return Users;
}

function getStaffImageStyle(staff = {}) {
  const zoom = clampNumber(staff.imageZoom, 1, 3, 1);
  const x = clampNumber(staff.imageOffsetX, -60, 60, 0);
  const y = clampNumber(staff.imageOffsetY, -60, 60, 0);

  return {
    objectFit: "cover",
    objectPosition: "center",
    transform: `translate(${x}%, ${y}%) scale(${zoom})`,
    transformOrigin: "center center",
  };
}

function StaffImage({ staff }) {
  const src = staff?.imageUrl || "";
  const name = staff?.name || "Staff member";

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className="w-full h-64 object-cover transition-transform duration-300"
        style={getStaffImageStyle(staff)}
      />
    );
  }

  return (
    <div className="w-full h-64 bg-slate-100 flex items-center justify-center border-b border-slate-200/80">
      <UserRound className="w-16 h-16 text-slate-300" />
    </div>
  );
}

function ActionButtons({
  editMode,
  target,
  onEditTarget,
  onDeleteTarget,
  canDelete = false,
  label = "Edit",
  icon: Icon = Pencil,
}) {
  if (!editMode) return null;

  return (
    <div className="absolute -top-2 -right-2 z-[120] flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all">
      <button
        type="button"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onEditTarget(target);
        }}
        className="rounded-full w-8 h-8 flex items-center justify-center bg-[#0A1628] text-white shadow-md hover:bg-blue-900 transition-colors"
        title={label}
      >
        <Icon className="w-3.5 h-3.5" />
      </button>

      {canDelete && (
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onDeleteTarget(target);
          }}
          className="rounded-full w-8 h-8 flex items-center justify-center bg-red-600 text-white shadow-md hover:bg-red-700 transition-colors"
          title="Delete"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

function EditableWrap({
  editMode,
  target,
  onEditTarget,
  onDeleteTarget = () => {},
  canDelete = false,
  label = "Edit",
  icon = Pencil,
  className = "",
  children,
}) {
  if (!editMode) return children;

  return (
    <div className={`relative group ${className}`}>
      {children}
      <ActionButtons
        editMode={editMode}
        target={target}
        onEditTarget={onEditTarget}
        onDeleteTarget={onDeleteTarget}
        canDelete={canDelete}
        label={label}
        icon={icon}
      />
    </div>
  );
}

function AddStaffButton({ editMode, onAddTarget }) {
  if (!editMode) return null;

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onAddTarget("staffMember");
      }}
      className="mt-8 mx-auto flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-extrabold bg-[#0A1628] text-white hover:bg-blue-900 shadow-md transition-colors"
    >
      <Plus className="w-4 h-4" />
      Add Staff Member
    </button>
  );
}

function StaffPopup({ staff, onClose }) {
  return (
    <AnimatePresence>
      {staff && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto"
          style={{ background: "rgba(10, 22, 40, 0.75)", backdropFilter: "blur(8px)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 z-50 w-9 h-9 rounded-full bg-[#0A1628] text-white flex items-center justify-center hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-12">
              <div className="sm:col-span-5 relative h-64 sm:h-full bg-slate-100 min-h-[260px]">
                {staff.imageUrl ? (
                  <img
                    src={staff.imageUrl}
                    alt={staff.name}
                    className="w-full h-full object-cover"
                    style={getStaffImageStyle(staff)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <UserRound className="w-20 h-20 text-slate-300" />
                  </div>
                )}
              </div>

              <div className="sm:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <span className="inline-block px-3 py-1 rounded-md text-xs font-bold bg-slate-100 text-[#0A1628] mb-2">
                    {staff.position}
                  </span>
                  <h2 className="text-2xl font-extrabold text-[#0A1628] mb-1">{staff.name}</h2>
                  {staff.qualification && (
                    <p className="text-xs font-semibold text-slate-500 mb-4">{staff.qualification}</p>
                  )}

                  {staff.description && (
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                      {staff.description}
                    </p>
                  )}
                </div>

                <div className="space-y-2.5 pt-4 border-t border-slate-100">
                  {staff.phone && (
                    <a
                      href={`tel:${staff.phone}`}
                      className="flex items-center gap-2.5 text-xs font-bold text-[#0A1628] hover:text-blue-700 transition-colors"
                    >
                      <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                        <Phone className="w-3.5 h-3.5 text-[#0A1628]" />
                      </div>
                      <span>{staff.phone}</span>
                    </a>
                  )}

                  {staff.email && (
                    <a
                      href={`mailto:${staff.email}`}
                      className="flex items-center gap-2.5 text-xs font-bold text-[#0A1628] hover:text-blue-700 transition-colors break-all"
                    >
                      <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                        <Mail className="w-3.5 h-3.5 text-[#0A1628]" />
                      </div>
                      <span>{staff.email}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Staff({
  editMode = false,
  contentOverride = null,
  onEditTarget = () => {},
  onDeleteTarget = () => {},
  onAddTarget = () => {},
}) {
  const [content, setContent] = useState(() =>
    mergeStaffContent(contentOverride || defaultStaffContent)
  );
  const [selectedStaff, setSelectedStaff] = useState(null);

  useEffect(() => {
    if (contentOverride) {
      setContent(mergeStaffContent(contentOverride));
      return;
    }

    let alive = true;
    const loadStaffContent = async () => {
      try {
        const res = await axios.get(
          "https://school-website-backend-ixx2.onrender.com/api/site-content/staff",
          { timeout: 8000 }
        );
        if (!alive) return;
        setContent(mergeStaffContent(res.data?.data?.content || {}));
      } catch (error) {
        console.error("Staff content load error:", error);
        if (alive) setContent(mergeStaffContent(defaultStaffContent));
      }
    };

    loadStaffContent();
    return () => {
      alive = false;
    };
  }, [contentOverride]);

  useEffect(() => {
    if (editMode) return;
    if (selectedStaff) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedStaff, editMode]);

  const visibleStaff = content.staff.filter((staff) => staff.visible !== false);

  return (
    <section className="min-h-screen pt-28 pb-24 bg-slate-50 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 relative z-10">
        {/* Header Section - Clean & Reduced Font Size */}
        <EditableWrap
          editMode={editMode}
          target={{ type: "pageHeader" }}
          onEditTarget={onEditTarget}
          label="Edit staff heading"
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-[#0A1628] text-white shadow-sm mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              {content.badgeText || "Faculty & Team"}
            </span>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0A1628] tracking-tight leading-tight">
              {content.title || "Our Staff Members"}
            </h1>

            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
              {content.subtitle ||
                "Meet the dedicated educators, department heads, and leaders guiding students at Smriti Secondary English Boarding School."}
            </p>
          </motion.div>
        </EditableWrap>

        {/* 3 Simple Dual-Tone Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {content.stats.map((stat, index) => {
            const Icon = getStatIcon(stat.icon);
            return (
              <EditableWrap
                key={stat.id || index}
                editMode={editMode}
                target={{ type: "statCard", index }}
                onEditTarget={onEditTarget}
                label="Edit number card"
              >
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="rounded-2xl p-6 text-center bg-white border border-slate-200/90 shadow-sm hover:border-slate-300 transition-all flex flex-col items-center justify-center"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#0A1628] text-white flex items-center justify-center mb-3 shadow-sm">
                    <Icon className="w-5 h-5 text-amber-400" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0A1628]">
                    {stat.value}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500 mt-1">{stat.label}</p>
                </motion.div>
              </EditableWrap>
            );
          })}
        </div>

        {/* Staff Members 3-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {visibleStaff.map((staff, index) => {
            const realIndex = content.staff.findIndex((m) => m.id === staff.id);

            return (
              <motion.div
                key={staff.id}
                onClick={() => {
                  if (!editMode) setSelectedStaff(staff);
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: index * 0.04 }}
                className="group relative bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                <ActionButtons
                  editMode={editMode}
                  target={{ type: "staffCard", index: realIndex }}
                  onEditTarget={onEditTarget}
                  onDeleteTarget={onDeleteTarget}
                  canDelete
                  label="Edit staff member"
                />

                {/* Photo Frame */}
                <div className="relative overflow-hidden bg-slate-100">
                  <StaffImage staff={staff} />

                  {editMode && (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        onEditTarget({ type: "staffImage", index: realIndex });
                      }}
                      className="absolute top-3 left-3 z-20 h-8 w-8 rounded-full bg-[#0A1628] text-white flex items-center justify-center shadow-md hover:bg-blue-900 transition-colors"
                      title="Change photo"
                    >
                      <Camera className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Card Content Body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="inline-block px-2.5 py-1 rounded-md text-xs font-extrabold bg-slate-100 text-[#0A1628]">
                        {staff.position}
                      </span>
                      {staff.qualification && (
                        <span className="text-[11px] font-semibold text-slate-500">
                          {staff.qualification}
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-extrabold text-[#0A1628] group-hover:text-blue-950 transition-colors">
                      {staff.name}
                    </h3>

                    {staff.description && (
                      <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                        {staff.description}
                      </p>
                    )}
                  </div>

                  {/* Contact Links Bar */}
                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0A1628]">
                    {staff.phone ? (
                      <span className="inline-flex items-center gap-1.5 text-slate-700 hover:text-blue-700 transition-colors">
                        <Phone className="w-3.5 h-3.5 text-[#0A1628]" />
                        {staff.phone}
                      </span>
                    ) : (
                      <span className="text-slate-400 font-normal text-[11px]">Smriti Boarding</span>
                    )}

                    <span className="text-xs font-bold text-[#0A1628] group-hover:translate-x-0.5 transition-transform">
                      View Profile ↗
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <AddStaffButton editMode={editMode} onAddTarget={onAddTarget} />
      </div>

      {!editMode && (
        <StaffPopup staff={selectedStaff} onClose={() => setSelectedStaff(null)} />
      )}
    </section>
  );
}

export default Staff;
