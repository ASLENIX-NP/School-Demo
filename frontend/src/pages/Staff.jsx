import { useEffect, useState, useRef, useCallback } from "react";
import api from "../lib/api";
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
  MapPin,
  Calendar,
} from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";

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
function TiltCard({ children, className = "", style = {}, ...props }) {
  const { ref, style: tiltStyle, handlers } = useTilt(15);
  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      style={{ ...style, ...tiltStyle, perspective: 1000 }}
      {...handlers}
      {...props}
    >
      {/* Glare Effect Overlay */}
      <div className="absolute inset-0 rounded-[inherit] pointer-events-none bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
      {children}
    </motion.div>
  );
}

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
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        style={getStaffImageStyle(staff)}
      />
    );
  }

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
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
    <div className="absolute -top-2 -right-2 z-50 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300">
      <button
        type="button"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onEditTarget(target);
        }}
        className="rounded-full w-8 h-8 flex items-center justify-center bg-white text-slate-900 shadow-lg border border-slate-200 hover:scale-110 transition-transform"
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
          className="rounded-full w-8 h-8 flex items-center justify-center bg-white text-red-600 shadow-lg border border-slate-200 hover:scale-110 hover:bg-red-50 transition-all"
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
      className="mt-12 mx-auto flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold bg-white text-slate-900 border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
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
          style={{ background: "rgba(10, 22, 40, 0.7)", backdropFilter: "blur(10px)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative w-full max-w-3xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-5 right-5 z-50 w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 transition-colors shadow-sm"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12 min-h-[400px]">
              {/* Image Area */}
              <div className="md:col-span-5 relative h-72 md:h-full bg-gradient-to-br from-slate-100 to-slate-200">
                {staff.imageUrl ? (
                  <img
                    src={staff.imageUrl}
                    alt={staff.name}
                    className="w-full h-full object-cover"
                    style={getStaffImageStyle(staff)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <UserRound className="w-20 h-20 text-slate-400" />
                  </div>
                )}
              </div>

              {/* Content Area */}
              <div className="md:col-span-7 p-8 md:p-10 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800">
                      {staff.position}
                    </span>
                    {staff.qualification && (
                      <span className="text-xs font-medium text-slate-500">{staff.qualification}</span>
                    )}
                  </div>
                  <h2 className="text-3xl font-extrabold text-slate-900 mb-4">{staff.name}</h2>

                  {staff.description && (
                    <p className="text-sm text-slate-600 leading-relaxed mb-6">
                      {staff.description}
                    </p>
                  )}
                </div>

                <div className="pt-6 border-t border-slate-100 flex flex-wrap gap-6">
                  {staff.phone && (
                    <a
                      href={`tel:${staff.phone}`}
                      className="flex items-center gap-2.5 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                        <Phone className="w-4 h-4 text-slate-500" />
                      </div>
                      <span>{staff.phone}</span>
                    </a>
                  )}

                  {staff.email && (
                    <a
                      href={`mailto:${staff.email}`}
                      className="flex items-center gap-2.5 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors break-all"
                    >
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                        <Mail className="w-4 h-4 text-slate-500" />
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
        const res = await api.get(
          "/api/site-content/staff",
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
    <section className="min-h-screen pt-28 pb-24 bg-gradient-to-br from-slate-50 via-white to-indigo-50 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 relative z-10">
        
        {/* ─── HEADER ─── */}
        <EditableWrap
          editMode={editMode}
          target={{ type: "pageHeader" }}
          onEditTarget={onEditTarget}
          label="Edit staff heading"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-900 text-white shadow-md mb-6">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              {content.badgeText || "Faculty & Team"}
            </span>

            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
              {content.title || "Our Staff Members"}
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto font-light">
              {content.subtitle ||
                "Meet the dedicated educators, department heads, and leaders guiding students at Smriti Secondary English Boarding School."}
            </p>
          </motion.div>
        </EditableWrap>

        {/* ─── STATS ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-20">
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
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="rounded-2xl p-6 md:p-8 text-center bg-white border border-slate-200/60 shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center"
                >
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center mb-4 shadow-md">
                    <Icon className="w-6 h-6 text-amber-400" />
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                    {stat.value}
                  </h3>
                  <p className="text-sm font-medium text-slate-500 mt-1">{stat.label}</p>
                </motion.div>
              </EditableWrap>
            );
          })}
        </div>

        {/* ─── 3D STAFF GRID ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleStaff.map((staff, index) => {
            const realIndex = content.staff.findIndex((m) => m.id === staff.id);

            return (
              <motion.div
                key={staff.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.08, type: "spring", bounce: 0.2 }}
                onClick={() => {
                  if (!editMode) setSelectedStaff(staff);
                }}
                className="group cursor-pointer"
              >
                <TiltCard
                  className="relative bg-white rounded-3xl border border-slate-200/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-300 overflow-hidden flex flex-col h-full"
                >
                  <ActionButtons
                    editMode={editMode}
                    target={{ type: "staffCard", index: realIndex }}
                    onEditTarget={onEditTarget}
                    onDeleteTarget={onDeleteTarget}
                    canDelete
                    label="Edit staff member"
                  />

                  {/* Image Area */}
                  <div className="relative h-64 w-full overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 shrink-0">
                    <StaffImage staff={staff} />
                    <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent z-10" />

                    {editMode && (
                      <button
                        type="button"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          onEditTarget({ type: "staffImage", index: realIndex });
                        }}
                        className="absolute top-4 left-4 z-20 h-9 w-9 rounded-full bg-white text-slate-800 flex items-center justify-center shadow-md border border-slate-200 hover:scale-105 transition-transform"
                        title="Change photo"
                      >
                        <Camera className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Content Area (3D pop-out effect applied) */}
                  <div className="p-6 flex-1 flex flex-col justify-between relative z-20" style={{ transform: "translateZ(40px)" }}>
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
                          {staff.position}
                        </span>
                        {staff.qualification && (
                          <span className="text-[11px] font-medium text-slate-400">
                            {staff.qualification}
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                        {staff.name}
                      </h3>

                      {staff.description && (
                        <p className="mt-2 text-sm text-slate-500 leading-relaxed line-clamp-3">
                          {staff.description}
                        </p>
                      )}
                    </div>

                    {/* Footer Action */}
                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-sm font-medium text-slate-600 group-hover:text-blue-600 transition-colors">
                      <span className="flex items-center gap-2">
                        <Mail className="w-4 h-4" /> Contact
                      </span>
                      <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        View Profile <span className="text-lg">↗</span>
                      </span>
                    </div>
                  </div>
                </TiltCard>
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