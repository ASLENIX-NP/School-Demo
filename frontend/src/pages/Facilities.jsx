import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "motion/react";
import { Camera, Pencil, Plus, Trash2, X, MapPin, Bus } from "lucide-react";

const colors = {
  red: "#D71920",
  green: "#168A3A",
  purple: "#4B2E83",
  dark: "#0B1020",
  cyan: "#38BDF8",
  gold: "#FACC15",
};

const facilityColors = [
  colors.red,
  colors.purple,
  colors.green,
  "#F59E0B",
  colors.cyan,
  "#8B5CF6",
  "#14B8A6",
];

export const defaultFacilitiesContent = {
  badgeText: "School Facilities",
  title: "Learning Beyond Classrooms",
  highlightedText: "Classrooms",
  subtitle:
    "Baljagriti provides modern facilities that create an engaging, practical, and technology-driven learning environment for every student.",
  learnMoreText: "Learn More",
  highlightsTitle: "Facility Highlights",
  facilities: [
    {
      id: 1,
      emoji: "📚",
      title: "E-Library",
      category: "Digital Learning",
      description:
        "Access thousands of digital books, journals, educational resources and online learning platforms.",
      details:
        "Students can access e-books, research journals, academic databases, digital resources, and online learning platforms from school.",
      imageUrl: "",
      imageZoom: 1,
      imageOffsetX: 0,
      imageOffsetY: 0,
      color: colors.red,
      visible: true,
    },
    {
      id: 2,
      emoji: "💻",
      title: "Computer Lab",
      category: "Technology",
      description:
        "Modern computer laboratory equipped with internet access and updated software for practical learning.",
      details:
        "40+ modern computers with internet access, programming tools, office applications, and multimedia software.",
      imageUrl: "",
      imageZoom: 1,
      imageOffsetX: 0,
      imageOffsetY: 0,
      color: colors.purple,
      visible: true,
    },
    {
      id: 3,
      emoji: "🔬",
      title: "Science Laboratory",
      category: "Practical Education",
      description:
        "Physics, Chemistry and Biology practical experiments with modern laboratory equipment and safety measures.",
      details:
        "Fully equipped separate labs for Physics, Chemistry, and Biology, providing hands-on experimental learning and top-tier safety gear.",
      imageUrl: "",
      imageZoom: 1,
      imageOffsetX: 0,
      imageOffsetY: 0,
      color: colors.green,
      visible: true,
    },
    {
      id: 4,
      emoji: "🚌",
      title: "Bus Facility",
      category: "Transportation",
      description:
        "Safe and reliable transportation service covering multiple routes.",
      details:
        "Baljagriti provides safe transportation with experienced drivers, route management, student safety monitoring, and comfortable buses for daily travel.",
      imageUrl: "",
      imageZoom: 1,
      imageOffsetX: 0,
      imageOffsetY: 0,
      color: "#F59E0B",
      visible: true,
      busRoutes: [
        {
          id: 1,
          name: "Route 1",
          from: "Hetauda - New Bus Park",
          to: "School Campus",
          stops: ["New Bus Park", "Chandranagar", "Bhanu Chowk", "School Campus"]
        },
        {
          id: 2,
          name: "Route 2",
          from: "Hetauda - Old Bus Park",
          to: "School Campus",
          stops: ["Old Bus Park", "Milan Chowk", "Bishnupur", "School Campus"]
        }
      ]
    },
    {
      id: 5,
      emoji: "🎭",
      title: "Auditorium",
      category: "Events & Activities",
      description:
        "Spacious auditorium for seminars, cultural events, presentations, and school programs.",
      details:
        "A state-of-the-art auditorium with advanced audio-visual technology, comfortable seating, and staging for hosting all major school events and presentations.",
      imageUrl: "",
      imageZoom: 1,
      imageOffsetX: 0,
      imageOffsetY: 0,
      color: colors.red,
      visible: true,
    },
    {
      id: 6,
      emoji: "⚽",
      title: "Sports Ground",
      category: "Physical Development",
      description:
        "Indoor and outdoor sports facilities encouraging fitness, teamwork, and healthy competition.",
      details:
        "Expansive playgrounds and courts facilitating football, basketball, cricket, and various indoor games under expert physical guidance.",
      imageUrl: "",
      imageZoom: 1,
      imageOffsetX: 0,
      imageOffsetY: 0,
      color: colors.green,
      visible: true,
    },
  ],
};


function clampNumber(value, min, max, fallback) {
  const numberValue = Number(value);

  if (!Number.isFinite(numberValue)) return fallback;

  return Math.min(max, Math.max(min, numberValue));
}

function getFacilityImageStyle(facility = {}) {
  const zoom = clampNumber(facility.imageZoom, 1, 3, 1);
  const x = clampNumber(facility.imageOffsetX, -60, 60, 0);
  const y = clampNumber(facility.imageOffsetY, -60, 60, 0);
  const objectX = Math.min(100, Math.max(0, 50 - x));
  const objectY = Math.min(100, Math.max(0, 50 - y));

  return {
    objectFit: "cover",
    objectPosition: `${objectX}% ${objectY}%`,
    transform: `scale(${zoom})`,
    transformOrigin: "center center",
    backgroundColor: "#0F172A",
  };
}

function normalizeFacilities(facilities) {
  if (!Array.isArray(facilities)) return defaultFacilitiesContent.facilities;

  return facilities.map((facility, index) => ({
    ...(defaultFacilitiesContent.facilities[index] || {}),
    ...facility,
    id: facility.id || Date.now() + index,
    color: facility.color || facilityColors[index % facilityColors.length],
    imageZoom: clampNumber(facility.imageZoom, 1, 3, 1),
    imageOffsetX: clampNumber(facility.imageOffsetX, -60, 60, 0),
    imageOffsetY: clampNumber(facility.imageOffsetY, -60, 60, 0),
    visible: facility.visible !== false,
    busRoutes: facility.busRoutes || [],
  }));
}

export function mergeFacilitiesContent(saved = {}) {
  return {
    ...defaultFacilitiesContent,
    ...(saved || {}),
    facilities: normalizeFacilities(saved.facilities),
  };
}

function HighlightedTitle({ title, highlightedText }) {
  if (!highlightedText || !title.includes(highlightedText)) {
    return <>{title}</>;
  }

  const [before, after] = title.split(highlightedText);

  return (
    <>
      {before}
      <span style={{ color: colors.red }}>{highlightedText}</span>
      {after}
    </>
  );
}

function ActionButtons({
  editMode,
  target,
  onEditTarget,
  onDeleteTarget,
  icon: Icon = Pencil,
  canDelete = false,
  label = "Edit",
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
  icon = Pencil,
  label = "Edit",
  canDelete = false,
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
        icon={icon}
        label={label}
        canDelete={canDelete}
      />
    </div>
  );
}

function AddFacilityButton({ editMode, onAddTarget }) {
  if (!editMode) return null;

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onAddTarget("facility");
      }}
      className="mt-10 mx-auto flex items-center gap-2 rounded-2xl px-6 py-4 text-sm font-black transition-all hover:-translate-y-1"
      style={{
        background: `linear-gradient(135deg, ${colors.gold}, ${colors.cyan})`,
        color: "#020617",
        boxShadow: "0 16px 38px rgba(56,189,248,0.24)",
      }}
    >
      <Plus className="w-4 h-4" />
      Add Facility
    </button>
  );
}

function FacilityVisual({ facility, className = "" }) {
  const facilityColor = facility.color || colors.green;

  if (facility.imageUrl) {
    return (
      <img
        src={facility.imageUrl}
        alt={facility.title}
        className={`w-full h-full ${className}`}
        style={getFacilityImageStyle(facility)}
      />
    );
  }

  return (
    <div
      className={`w-full h-full flex items-center justify-center ${className}`}
      style={{
        background: `
          radial-gradient(circle at top right, ${facilityColor}24, transparent 36%),
          linear-gradient(145deg, rgba(11,16,32,0.96), rgba(75,46,131,0.9))
        `,
      }}
    >
      <div className="text-center px-8">
        <div
          className="w-20 h-1 rounded-full mx-auto mb-5"
          style={{
            background: `linear-gradient(90deg, ${colors.red}, ${colors.green})`,
          }}
        />

        <div
          className="text-xs font-bold uppercase tracking-[0.2em] mb-3"
          style={{ color: "rgba(255,255,255,0.58)" }}
        >
          {facility.category}
        </div>

        <div
          className="text-3xl font-black text-white leading-tight"
          style={{
            fontFamily: "var(--font-display)",
            letterSpacing: "-0.045em",
          }}
        >
          {facility.title}
        </div>
      </div>
    </div>
  );
}

function BusRoutesDisplay({ routes }) {
  if (!routes || routes.length === 0) return null;

  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center gap-2">
        <Bus className="w-5 h-5" style={{ color: colors.green }} />
        <h4 className="font-bold text-slate-800">Available Bus Routes</h4>
        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
          {routes.length} routes
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {routes.map((route) => (
          <div
            key={route.id}
            className="rounded-2xl p-4 border"
            style={{
              background: "rgba(255,255,255,0.8)",
              borderColor: "rgba(75,46,131,0.12)",
            }}
          >
            <div className="font-bold text-slate-800 text-sm mb-2">{route.name}</div>
            <div className="flex items-center gap-2 text-xs text-slate-600 mb-2">
              <MapPin className="w-3 h-3" />
              <span>{route.from || "Not set"}</span>
              <span className="text-slate-400">→</span>
              <MapPin className="w-3 h-3" />
              <span>{route.to || "Not set"}</span>
            </div>
            {route.stops && route.stops.length > 0 && (
              <div className="space-y-1">
                {route.stops.map((stop, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    {stop}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function Facilities({
  editMode = false,
  contentOverride = null,
  onEditTarget = () => {},
  onDeleteTarget = () => {},
  onAddTarget = () => {},
}) {
  const [content, setContent] = useState(
    mergeFacilitiesContent(contentOverride || defaultFacilitiesContent)
  );
  const [selectedFacility, setSelectedFacility] = useState(null);

  useEffect(() => {
    if (contentOverride) {
      setContent(mergeFacilitiesContent(contentOverride));
      return undefined;
    }

    let alive = true;

    const loadFacilitiesContent = async () => {
      try {
        const res = await axios.get(
          "https://school-website-backend-ixx2.onrender.com/api/site-content/facilities",
          { timeout: 8000 }
        );

        if (!alive) return;

        const savedContent = res.data?.data?.content || {};
        setContent(mergeFacilitiesContent(savedContent));
      } catch (error) {
        console.error("Facilities content load error:", error);

        if (alive) {
          setContent(mergeFacilitiesContent(defaultFacilitiesContent));
        }
      }
    };

    loadFacilitiesContent();

    return () => {
      alive = false;
    };
  }, [contentOverride]);

  useEffect(() => {
    if (editMode) return;

    if (selectedFacility) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedFacility, editMode]);

  const visibleFacilities = content.facilities.filter(
    (facility) => facility.visible !== false
  );

  return (
    <div
      className="min-h-screen pt-32 pb-24 relative overflow-hidden"
      style={{
        background: `
          radial-gradient(circle at top left, rgba(75,46,131,0.12), transparent 34%),
          radial-gradient(circle at bottom right, rgba(22,138,58,0.10), transparent 34%),
          linear-gradient(180deg,#FFF8EE 0%,#F8FAFC 100%)
        `,
      }}
    >
      <div className="absolute top-20 left-8 w-48 h-48 rounded-full bg-purple-500/10 blur-3xl" />
      <div className="absolute bottom-20 right-10 w-56 h-56 rounded-full bg-green-500/10 blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <EditableWrap
          editMode={editMode}
          target={{ type: "pageHeader" }}
          onEditTarget={onEditTarget}
          label="Edit facilities heading"
        >
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="text-center mb-20 rounded-[2rem]"
            style={{
              outline: editMode
                ? "1px dashed rgba(56,189,248,0.55)"
                : "none",
              outlineOffset: editMode ? "10px" : "0",
            }}
          >
            <span
              className="px-5 py-2 rounded-full text-sm font-bold inline-flex items-center"
              style={{
                background: "rgba(22,138,58,0.08)",
                color: colors.green,
                border: "1px solid rgba(22,138,58,0.18)",
              }}
            >
              {content.badgeText}
            </span>

            <h1
              className="text-5xl md:text-7xl mt-6 text-slate-950 leading-tight"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 850,
                letterSpacing: "-0.055em",
              }}
            >
              <HighlightedTitle
                title={content.title}
                highlightedText={content.highlightedText}
              />
            </h1>

            <p className="max-w-3xl mx-auto mt-6 text-lg md:text-xl text-slate-600 leading-relaxed">
              {content.subtitle}
            </p>
          </motion.div>
        </EditableWrap>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleFacilities.map((facility, index) => {
            const facilityColor = facility.color || colors.green;
            const realIndex = content.facilities.findIndex(
              (item) => item.id === facility.id
            );

            return (
              <motion.div
                key={facility.id || facility.title}
                onClick={() => {
                  if (!editMode) setSelectedFacility(facility);
                }}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
                className="group relative rounded-[2rem] overflow-hidden transition-all duration-300 cursor-pointer"
                style={{
                  minHeight: "760px",
                  background:
                    "linear-gradient(145deg, rgba(255,255,255,0.97), rgba(255,255,255,0.82))",
                  border: editMode
                    ? "2px dashed rgba(56,189,248,0.55)"
                    : `1px solid ${facilityColor}24`,
                  boxShadow:
                    "0 22px 54px rgba(15,23,42,0.09), inset 0 1px 0 rgba(255,255,255,0.82)",
                  backdropFilter: "blur(16px)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-10px)";
                  e.currentTarget.style.boxShadow = `0 30px 72px rgba(15,23,42,0.16), 0 0 0 1px ${facilityColor}22`;
                  if (!editMode) e.currentTarget.style.borderColor = `${facilityColor}55`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 22px 54px rgba(15,23,42,0.09), inset 0 1px 0 rgba(255,255,255,0.82)";
                  if (!editMode) e.currentTarget.style.borderColor = `${facilityColor}24`;
                }}
              >
                <ActionButtons
                  editMode={editMode}
                  target={{ type: "facilityCard", index: realIndex }}
                  onEditTarget={onEditTarget}
                  onDeleteTarget={onDeleteTarget}
                  canDelete
                  label="Edit facility"
                />

                <div className="h-96 relative overflow-hidden bg-slate-900">
                  <FacilityVisual
                    facility={facility}
                    className="transition-transform duration-500 group-hover:scale-105"
                  />

                  <button
                    type="button"
                    onClick={(event) => {
                      if (!editMode) return;
                      event.preventDefault();
                      event.stopPropagation();
                      onEditTarget({ type: "facilityImage", index: realIndex });
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
                    title="Change facility image"
                  >
                    <Camera className="w-4 h-4" />
                  </button>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />

                  <div className="absolute bottom-5 left-5 right-5">
                    <div
                      className="w-16 h-1 rounded-full mb-4 transition-all duration-300 group-hover:w-28"
                      style={{
                        background: facilityColor,
                      }}
                    />

                    <div
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold"
                      style={{
                        background: "rgba(255,255,255,0.9)",
                        color: facilityColor,
                        border: `1px solid ${facilityColor}22`,
                      }}
                    >
                      {facility.category}
                    </div>
                  </div>
                </div>

                <div className="p-8 flex flex-col">
                  <h3
                    className="text-[2rem] leading-tight font-black text-slate-950"
                    style={{
                      fontFamily: "var(--font-display)",
                      letterSpacing: "-0.04em",
                    }}
                  >
                    {facility.title}
                  </h3>

                  <p className="mt-4 text-slate-600 leading-relaxed">
                    {facility.description}
                  </p>

                  {/* REMOVED: Bus routes are no longer shown on the card */}
                  {/* Only shown in the popup/modal */}

                  <div
                    className="mt-6 inline-flex items-center font-bold transition-all duration-300 group-hover:tracking-wide"
                    style={{ color: facilityColor }}
                  >
                    {content.learnMoreText}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <AddFacilityButton editMode={editMode} onAddTarget={onAddTarget} />
      </div>

      {!editMode && selectedFacility && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-2 md:p-8 overflow-y-auto"
          style={{
            background: "rgba(0,0,0,0.48)",
            backdropFilter: "blur(12px)",
          }}
          onClick={() => setSelectedFacility(null)}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{
              opacity: 0,
              scale: 0.86,
              y: 40,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            transition={{
              type: "spring",
              stiffness: 120,
              damping: 16,
            }}
            className="relative w-full max-w-[1800px] max-h-[95vh] overflow-y-auto rounded-[42px]"
            style={{
              background:
                "linear-gradient(145deg, rgba(255,255,255,0.98), rgba(248,250,252,0.95))",
              boxShadow:
                "0 60px 120px rgba(0,0,0,0.28), 0 25px 50px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.7)",
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `
                  radial-gradient(circle at top right,
                  ${selectedFacility.color || colors.green}24,
                  transparent 40%)
                `,
              }}
            />

            <button
              type="button"
              onClick={() => setSelectedFacility(null)}
              className="absolute top-5 right-5 z-[99999] w-12 h-12 md:w-16 md:h-16 rounded-full bg-white shadow-2xl cursor-pointer font-bold hover:bg-red-500 hover:text-white hover:rotate-180 hover:scale-110 transition-all duration-500 flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-[700px_1fr] relative z-10">
              <div className="h-[320px] sm:h-[400px] md:h-[900px] relative overflow-hidden bg-slate-900">
                <FacilityVisual facility={selectedFacility} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
              </div>

              <div className="p-6 sm:p-8 md:p-16 flex flex-col justify-center">
                <div
                  className="w-20 h-1 rounded-full mb-6"
                  style={{
                    background: selectedFacility.color || colors.green,
                  }}
                />

                <span
                  className="px-4 py-2 rounded-full text-sm font-bold inline-block w-fit"
                  style={{
                    background: `${selectedFacility.color || colors.green}12`,
                    color: selectedFacility.color || colors.green,
                    border: `1px solid ${
                      selectedFacility.color || colors.green
                    }22`,
                  }}
                >
                  {selectedFacility.category}
                </span>

                <h2
                  className="text-4xl sm:text-5xl md:text-7xl font-black mt-5 text-slate-950 leading-tight"
                  style={{
                    fontFamily: "var(--font-display)",
                    letterSpacing: "-0.055em",
                  }}
                >
                  {selectedFacility.title}
                </h2>

                <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-600 leading-relaxed">
                  {selectedFacility.description}
                </p>

                {/* Bus routes displayed here in the popup */}
                {selectedFacility.title === "Bus Facility" && selectedFacility.busRoutes && selectedFacility.busRoutes.length > 0 && (
                  <div className="mt-6">
                    <BusRoutesDisplay routes={selectedFacility.busRoutes} />
                  </div>
                )}

                <div
                  className="mt-8 md:mt-10 p-6 sm:p-8 rounded-3xl"
                  style={{
                    background: `${selectedFacility.color || colors.green}08`,
                    border: `1px solid ${
                      selectedFacility.color || colors.green
                    }20`,
                  }}
                >
                  <h4 className="font-bold text-slate-950 mb-3">
                    {content.highlightsTitle}
                  </h4>

                  <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                    {selectedFacility.details}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default Facilities;
