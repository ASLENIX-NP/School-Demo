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
  Star,
  Trash2,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const colors = {
  red: "#D71920",
  green: "#168A3A",
  purple: "#4B2E83",
  dark: "#0B1020",
  cyan: "#38BDF8",
  gold: "#FACC15",
};

const statColors = [colors.green, colors.purple, colors.red, colors.cyan];

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
  badgeText: "Our Faculty Team",
  title: "Our Staff & Members",
  highlightedWord: "Members",
  subtitle:
    "Meet the dedicated educators, mentors, and leaders who inspire excellence, character, and lifelong learning at Baljagriti Secondary English Boarding School.",
  stats: [
    {
      id: "teachingStaff",
      value: "50+",
      label: "Teaching Staff",
      icon: "users",
      color: colors.green,
    },
    {
      id: "expertFaculty",
      value: "240+",
      label: "Expert Faculty",
      icon: "graduation",
      color: colors.purple,
    },
    {
      id: "yearsExcellence",
      value: "35+",
      label: "Years Excellence",
      icon: "award",
      color: colors.red,
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
      qualification: "M.Ed",
      phone: "+977-9800000000",
      email: "",
      description:
        "Mr. Binod Subedi has been leading Baljagriti English Secondary School with vision and dedication for over a decade. His commitment to academic excellence and student welfare has transformed the school into a centre of quality education in the region.",
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
      phone: "+977-9800000000",
      email: "",
      description:
        "Mr. Amul Shrestha brings years of administrative and academic expertise to Baljagriti. As Vice Principal, he oversees daily operations, faculty coordination, and student discipline, ensuring a productive and inspiring learning environment.",
      visible: true,
    },
    {
      id: 3,
      name: "Prem Hamal",
      position: "Science Teacher",
      imageUrl: "",
      imageZoom: 1,
      imageOffsetX: 0,
      imageOffsetY: 0,
      qualification: "B.Sc, B.Ed",
      phone: "+977-9800000000",
      email: "",
      description:
        "Mr. Prem Hamal is a passionate science educator who brings curiosity and innovation into the classroom. With expertise in Physics, Chemistry, and Biology, he makes complex concepts accessible and exciting for every student.",
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
    id: stat.id || `stat-${Date.now()}-${index}`,
    icon: stat.icon || defaultStaffContent.stats[index]?.icon || "users",
    color: stat.color || statColors[index % statColors.length],
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
    const cleanImageUrl = isHardcodedStaffImageUrl(savedImageUrl)
      ? ""
      : savedImageUrl;

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
    stats: normalizeStats(saved.stats),
    staff: normalizeStaff(saved.staff),
  };
}

function getStatIcon(icon) {
  if (icon === "graduation") return GraduationCap;
  if (icon === "award") return Award;
  return Users;
}

function HighlightedTitle({ title, highlightedWord }) {
  if (!highlightedWord || !title || !title.includes(highlightedWord)) {
    return <>{title}</>;
  }

  const [before, after] = title.split(highlightedWord);

  return (
    <>
      {before}
      <span className="text-green-700">{highlightedWord}</span>
      {after}
    </>
  );
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
    backgroundColor: "#F8FAFC",
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
        className="w-full h-80 object-cover transition-transform duration-300 will-change-transform"
        style={getStaffImageStyle(staff)}
      />
    );
  }

  return (
    <div className="w-full h-80 bg-slate-100 flex items-center justify-center">
      <UserRound className="w-20 h-20 text-slate-300" />
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
    <div className="absolute -top-3 -right-3 z-[120] flex items-center gap-2 opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200">
      <button
        type="button"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onEditTarget(target);
        }}
        className="rounded-full w-10 h-10 flex items-center justify-center shadow-xl"
        style={{
          background: `linear-gradient(135deg, ${colors.gold}, ${colors.cyan})`,
          color: "#020617",
          border: "1px solid rgba(255,255,255,0.88)",
        }}
        title={label}
      >
        <Icon className="w-4 h-4" />
      </button>

      {canDelete && (
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onDeleteTarget(target);
          }}
          className="rounded-full w-10 h-10 flex items-center justify-center shadow-xl"
          style={{
            background: "linear-gradient(135deg, #FEE2E2, #FCA5A5)",
            color: colors.red,
            border: "1px solid rgba(255,255,255,0.88)",
          }}
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
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
      className="mt-10 mx-auto flex items-center gap-2 rounded-2xl px-6 py-4 text-sm font-black transition-all hover:-translate-y-1"
      style={{
        background: `linear-gradient(135deg, ${colors.gold}, ${colors.cyan})`,
        color: "#020617",
        boxShadow: "0 16px 38px rgba(56,189,248,0.24)",
      }}
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
          className="fixed inset-0 z-[9999] flex items-center justify-center p-2 md:p-8 overflow-y-auto"
          style={{
            background: "rgba(5,8,20,0.75)",
            backdropFilter: "blur(14px)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.82, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 30 }}
            transition={{ type: "spring", stiffness: 110, damping: 15 }}
            className="relative w-full max-w-[1800px] max-h-[95vh] overflow-y-auto rounded-[42px]"
            style={{
              background: "linear-gradient(145deg, #ffffff, #f8fafc)",
              boxShadow:
                "0 80px 160px rgba(0,0,0,0.35), 0 30px 60px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.8)",
            }}
          >
            <div
              className="absolute top-0 right-0 w-72 h-72 rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(22,138,58,0.10) 0%, transparent 70%)",
                transform: "translate(30%, -30%)",
              }}
            />
            <div
              className="absolute bottom-0 left-0 w-64 h-64 rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(215,25,32,0.08) 0%, transparent 70%)",
                transform: "translate(-30%, 30%)",
              }}
            />

            <motion.button
              type="button"
              onClick={onClose}
              whileHover={{ rotate: 180, scale: 1.15 }}
              transition={{ duration: 0.35 }}
              className="absolute top-5 right-5 z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-2xl"
              style={{ background: colors.red, color: "#fff" }}
            >
              <X className="w-5 h-5" strokeWidth={3} />
            </motion.button>

            <div className="grid grid-cols-1 md:grid-cols-[700px_1fr]">
              <div className="relative h-[320px] sm:h-[400px] md:h-[900px] overflow-hidden">
                {staff.imageUrl ? (
                  <img
                    src={staff.imageUrl}
                    alt={staff.name}
                    className="w-full h-full object-cover transition-transform duration-300 will-change-transform"
                    style={getStaffImageStyle(staff)}
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{
                      background:
                        "linear-gradient(145deg, rgba(11,16,32,0.96), rgba(75,46,131,0.9))",
                    }}
                  >
                    <UserRound className="w-32 h-32 text-white/30" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 md:hidden text-center">
                  <h2 className="text-3xl font-black text-white leading-tight">
                    {staff.name}
                  </h2>
                  <p className="text-green-400 font-bold mt-1">{staff.position}</p>
                </div>
                <div
                  className="absolute bottom-0 left-0 right-0 h-1"
                  style={{
                    background: `linear-gradient(90deg, ${colors.red}, ${colors.green})`,
                  }}
                />
              </div>

              <div className="p-6 sm:p-8 md:p-16 flex flex-col items-center md:justify-center relative z-10 text-center">
                <div
                  className="w-16 h-1 rounded-full mb-6 mx-auto"
                  style={{
                    background: `linear-gradient(90deg, ${colors.red}, ${colors.green})`,
                  }}
                />

                <span
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-4"
                  style={{
                    background: "rgba(22,138,58,0.10)",
                    color: colors.green,
                    border: "1px solid rgba(22,138,58,0.22)",
                  }}
                >
                  <Star className="w-3.5 h-3.5" fill={colors.green} />
                  {staff.position}
                </span>

                <h2
                  className="hidden md:block text-5xl lg:text-7xl font-black text-slate-950 leading-tight mb-2"
                  style={{
                    fontFamily: "var(--font-display)",
                    letterSpacing: "-0.05em",
                  }}
                >
                  {staff.name}
                </h2>

                {staff.description && (
                  <div
                    className="mt-8 p-8 rounded-3xl w-full"
                    style={{
                      background: "rgba(75,46,131,0.05)",
                      border: "1px solid rgba(75,46,131,0.10)",
                    }}
                  >
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <FileText className="w-4 h-4" style={{ color: colors.purple }} />
                      <p
                        className="text-xs font-bold uppercase tracking-widest"
                        style={{ color: colors.purple }}
                      >
                        About
                      </p>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                      {staff.description}
                    </p>
                  </div>
                )}

                <div
                  className="w-full h-px my-5"
                  style={{ background: "rgba(15,23,42,0.08)" }}
                />

                <div className="space-y-3 w-full">
                  {staff.qualification && (
                    <div
                      className="flex items-center gap-4 p-4 rounded-2xl"
                      style={{
                        background: "rgba(75,46,131,0.06)",
                        border: "1px solid rgba(75,46,131,0.12)",
                      }}
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: "rgba(75,46,131,0.12)" }}
                      >
                        <BookOpen className="w-5 h-5" style={{ color: colors.purple }} />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-0.5">
                          Qualification
                        </p>
                        <p className="font-bold text-slate-800">{staff.qualification}</p>
                      </div>
                    </div>
                  )}

                  {staff.phone && (
                    <div
                      className="flex items-center gap-4 p-4 rounded-2xl"
                      style={{
                        background: "rgba(22,138,58,0.06)",
                        border: "1px solid rgba(22,138,58,0.12)",
                      }}
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: "rgba(22,138,58,0.12)" }}
                      >
                        <Phone className="w-5 h-5" style={{ color: colors.green }} />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-0.5">
                          Contact
                        </p>
                        <p className="font-bold text-slate-800">{staff.phone}</p>
                      </div>
                    </div>
                  )}

                  {staff.email && (
                    <div
                      className="flex items-center gap-4 p-4 rounded-2xl"
                      style={{
                        background: "rgba(215,25,32,0.05)",
                        border: "1px solid rgba(215,25,32,0.10)",
                      }}
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: "rgba(215,25,32,0.10)" }}
                      >
                        <Mail className="w-5 h-5" style={{ color: colors.red }} />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-0.5">
                          Email
                        </p>
                        <p className="font-bold text-slate-800">{staff.email}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8 flex items-center justify-center gap-3">
                  <div className="h-1 w-8 rounded-full" style={{ background: colors.red }} />
                  <div className="h-1 w-16 rounded-full" style={{ background: colors.green }} />
                  <div className="h-1 w-4 rounded-full" style={{ background: colors.purple }} />
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
  const [loading] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  useEffect(() => {
    if (contentOverride) {
      setContent(mergeStaffContent(contentOverride));
      return undefined;
    }

    let alive = true;

    const loadStaffContent = async () => {
      try {
        const res = await axios.get(
          "https://school-website-backend-ixx2.onrender.com/api/site-content/staff",
          { timeout: 8000 }
        );

        if (!alive) return;

        const savedContent = res.data?.data?.content || {};
        setContent(mergeStaffContent(savedContent));
      } catch (error) {
        console.error("Staff content load error:", error);

        if (alive) {
          setContent(mergeStaffContent(defaultStaffContent));
        }
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
    <section
      className="min-h-screen pt-32 pb-24 relative overflow-hidden"
      style={{
        background: `
          radial-gradient(circle at top left, rgba(75,46,131,0.12), transparent 34%),
          radial-gradient(circle at top right, rgba(22,138,58,0.10), transparent 36%),
          radial-gradient(circle at bottom right, rgba(250,204,21,0.10), transparent 34%),
          linear-gradient(180deg, #FFF8EE 0%, #F8FAFC 100%)
        `,
      }}
    >
      <div className="absolute top-24 left-10 w-40 h-40 bg-green-500/10 rounded-full blur-3xl" />
      <div className="absolute top-72 right-16 w-52 h-52 bg-purple-500/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <EditableWrap
          editMode={editMode}
          target={{ type: "pageHeader" }}
          onEditTarget={onEditTarget}
          label="Edit staff heading"
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="text-center mb-16 rounded-[2rem]"
            style={{
              outline: editMode ? "1px dashed rgba(56,189,248,0.55)" : "none",
              outlineOffset: editMode ? "10px" : "0",
            }}
          >
            <div
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-6 font-semibold"
              style={{
                background: "rgba(22,138,58,0.08)",
                border: "1px solid rgba(22,138,58,0.18)",
                color: colors.green,
              }}
            >
              <Users size={16} />
              {content.badgeText}
            </div>

            <h1
              className="text-5xl md:text-7xl text-slate-950 leading-tight"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 850,
                letterSpacing: "-0.045em",
              }}
            >
              <HighlightedTitle
                title={content.title}
                highlightedWord={content.highlightedWord}
              />
            </h1>

            <p className="mt-6 text-lg md:text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              {content.subtitle}
            </p>
          </motion.div>
        </EditableWrap>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
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
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className="rounded-3xl p-8 text-center bg-white/90 backdrop-blur-xl"
                  style={{
                    border: editMode
                      ? "2px dashed rgba(56,189,248,0.55)"
                      : "1px solid rgba(15,23,42,0.08)",
                    boxShadow:
                      "0 22px 54px rgba(15,23,42,0.10), inset 0 1px 0 rgba(255,255,255,0.85)",
                  }}
                >
                  <Icon
                    className="mx-auto mb-4"
                    size={42}
                    style={{ color: stat.color || colors.green }}
                  />
                  <h3 className="text-4xl font-black text-slate-950">
                    {stat.value}
                  </h3>
                  <p className="text-slate-500 mt-1">{stat.label}</p>
                </motion.div>
              </EditableWrap>
            );
          })}
        </div>

        {loading ? (
          <div className="text-center text-slate-500 font-semibold">
            Loading staff members...
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {visibleStaff.map((staff, index) => {
              const realIndex = content.staff.findIndex(
                (member) => member.id === staff.id
              );

              return (
                <motion.div
                  key={staff.id}
                  onClick={() => {
                    if (!editMode) setSelectedStaff(staff);
                  }}
                  initial={{ opacity: 0, y: 26 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.45, delay: index * 0.05 }}
                  className="group relative bg-white rounded-[2rem] overflow-hidden transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                  style={{
                    border: editMode
                      ? "2px dashed rgba(56,189,248,0.55)"
                      : "1px solid rgba(15,23,42,0.08)",
                    boxShadow:
                      "0 22px 54px rgba(15,23,42,0.10), inset 0 1px 0 rgba(255,255,255,0.85)",
                  }}
                >
                  <ActionButtons
                    editMode={editMode}
                    target={{ type: "staffCard", index: realIndex }}
                    onEditTarget={onEditTarget}
                    onDeleteTarget={onDeleteTarget}
                    canDelete
                    label="Edit staff member"
                  />

                  <div className="relative overflow-hidden">
                    <StaffImage staff={staff} />

                    <button
                      type="button"
                      onClick={(event) => {
                        if (!editMode) return;
                        event.preventDefault();
                        event.stopPropagation();
                        onEditTarget({ type: "staffImage", index: realIndex });
                      }}
                      className={`absolute top-5 left-5 z-20 h-11 w-11 rounded-full items-center justify-center shadow-xl transition-all ${
                        editMode
                          ? "flex opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100"
                          : "hidden"
                      }`}
                      style={{
                        background: "rgba(255,255,255,0.92)",
                        color: colors.purple,
                        border: "1px solid rgba(255,255,255,0.88)",
                      }}
                      title="Change staff photo"
                    >
                      <Camera className="w-4 h-4" />
                    </button>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />
                  </div>

                  <div className="p-7">
                    <h3 className="text-2xl font-black text-slate-950">
                      {staff.name}
                    </h3>
                    <p className="text-green-700 font-bold mt-1">
                      {staff.position}
                    </p>

                    {staff.description && (
                      <p className="mt-3 text-slate-500 text-sm leading-relaxed line-clamp-2">
                        {staff.description}
                      </p>
                    )}

                    <div className="mt-5 space-y-3">
                      {staff.qualification && (
                        <div className="flex items-center gap-3 text-slate-600">
                          <BookOpen className="w-4 h-4 text-purple-700" />
                          <span>{staff.qualification}</span>
                        </div>
                      )}
                      {staff.phone && (
                        <div className="flex items-center gap-3 text-slate-600">
                          <Phone className="w-4 h-4 text-green-700" />
                          <span>{staff.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        <AddStaffButton editMode={editMode} onAddTarget={onAddTarget} />
      </div>

      {!editMode && (
        <StaffPopup staff={selectedStaff} onClose={() => setSelectedStaff(null)} />
      )}
    </section>
  );
}

export default Staff;


