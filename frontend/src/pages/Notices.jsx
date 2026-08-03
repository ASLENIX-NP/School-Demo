// Notices.jsx
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  X,
  Search,
  Filter,
  Calendar,
  Clock,
  FileText,
  Download,
  Pin,
  Star,
  ChevronRight,
  Bell,
  Megaphone,
  BookOpen,
  Users,
  Award,
  AlertCircle,
  CheckCircle,
  ExternalLink,
} from "lucide-react";

const API_URL = "https://school-website-backend-ixx2.onrender.com";
const REQUEST_TIMEOUT_MS = 12000;

// ============ COLOR PALETTE ============
const theme = {
  primary: "#2563EB", // Clean blue
  secondary: "#0F172A", // Dark slate
  accent: "#14B8A6", // Teal
  warning: "#F59E0B", // Amber
  light: "#F8FAFC", // Very light gray
  dark: "#0F172A",
  gray: "#64748B",
  lightGray: "#E2E8F0",
  white: "#FFFFFF",
  success: "#10B981",
  danger: "#EF4444",
  gradient1: "linear-gradient(135deg, #2563EB 0%, #14B8A6 100%)",
  gradient2: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
};

// ============ DEFAULT DATA ============
export const defaultNoticeSettings = {
  page_badge: "Official School Updates",
  page_title: "Stay Connected with School News",
};

export const formatNoticeDate = (dateValue) => {
  if (!dateValue) return "No date";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return dateValue;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

async function fetchJsonWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
    return await response.json();
  } finally {
    window.clearTimeout(timeoutId);
  }
}

function normalizeNotice(notice = {}) {
  return {
    id: notice.id || notice._id,
    title: notice.title || "",
    category: notice.category || "General",
    notice_date: notice.notice_date || notice.date || "",
    description: notice.description || "",
    pdf_url: notice.pdf_url || notice.pdfUrl || "",
    file_url: notice.file_url || notice.fileUrl || "",
    file_type: notice.file_type || notice.fileType || "",
    pinned: Boolean(notice.pinned),
    featured: Boolean(notice.featured),
    created_at: notice.created_at || notice.createdAt || "",
  };
}

// ============ NOTICES COMPONENT ============
export default function Notices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [filterPdfOnly, setFilterPdfOnly] = useState(false);

  const categories = ["All", "Admissions", "Exam", "Holiday", "Events", "Scholarship", "Results"];

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const result = await fetchJsonWithTimeout(`${API_URL}/api/notices`);
      const rawNotices = Array.isArray(result) ? result : Array.isArray(result?.data) ? result.data : [];
      const noticeList = rawNotices.map(normalizeNotice);
      setNotices(noticeList);
    } catch (error) {
      console.error("Fetch notices error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort notices
  const filteredNotices = useMemo(() => {
    let filtered = [...notices];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (n) =>
          n.title?.toLowerCase().includes(query) ||
          n.description?.toLowerCase().includes(query) ||
          n.category?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter((n) => n.category === selectedCategory);
    }

    // PDF filter
    if (filterPdfOnly) {
      filtered = filtered.filter((n) => n.pdf_url || n.file_url);
    }

    // Sort
    filtered.sort((a, b) => {
      const dateA = new Date(a.notice_date || a.created_at || 0);
      const dateB = new Date(b.notice_date || b.created_at || 0);
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [notices, searchQuery, selectedCategory, sortOrder, filterPdfOnly]);

  const featuredNotice = notices.find((n) => n.featured);
  const regularNotices = filteredNotices.filter((n) => !n.featured);
  const pinnedNotices = regularNotices.filter((n) => n.pinned);

  // Stats for dashboard cards
  const stats = {
    total: notices.length,
    important: notices.filter((n) => n.pinned).length,
    upcoming: notices.filter((n) => new Date(n.notice_date) > new Date()).length,
    downloads: notices.filter((n) => n.pdf_url || n.file_url).length,
  };

  return (
    <div style={styles.pageContainer}>
      {/* ===== DECORATIVE BACKGROUND ===== */}
      <div style={styles.bgDecorations}>
        <div style={{ ...styles.bgBlur, top: "-10%", right: "-5%", width: "500px", height: "500px" }} />
        <div style={{ ...styles.bgBlur, bottom: "-10%", left: "-5%", width: "400px", height: "400px", background: "rgba(20, 184, 166, 0.08)" }} />
        <div style={{ ...styles.bgBlur, top: "40%", left: "30%", width: "300px", height: "300px", background: "rgba(245, 158, 11, 0.06)" }} />
        <div style={styles.bgGrid} />
      </div>

      {/* ===== HERO SECTION ===== */}
      <section style={styles.heroSection}>
        <div style={styles.heroBackground}>
          <div style={styles.heroOverlay} />
        </div>
        <div style={styles.heroContent}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            style={styles.heroInner}
          >
            <span style={styles.heroBadge}>📢 {defaultNoticeSettings.page_badge}</span>
            <h1 style={styles.heroTitle}>
              Stay Connected
              <br />
              <span style={styles.heroTitleHighlight}>with Every Important School Announcement</span>
            </h1>
            <p style={styles.heroDescription}>
              All official notices, examinations, holidays, admissions, and circulars are published here.
            </p>
            <div style={styles.heroMeta}>
              <span style={styles.heroMetaItem}>
                <Calendar size={16} />
                {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </span>
              <span style={styles.heroMetaItem}>
                <FileText size={16} />
                {notices.length} Notices Published
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== STATS DASHBOARD ===== */}
      <section style={styles.statsSection}>
        <div style={styles.statsGrid}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            style={{ ...styles.statCard, borderTopColor: theme.primary }}
          >
            <div style={styles.statIcon}><FileText size={20} color={theme.primary} /></div>
            <div style={styles.statValue}>{stats.total}</div>
            <div style={styles.statLabel}>Official Notices</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            style={{ ...styles.statCard, borderTopColor: theme.danger }}
          >
            <div style={styles.statIcon}><AlertCircle size={20} color={theme.danger} /></div>
            <div style={styles.statValue}>{stats.important}</div>
            <div style={styles.statLabel}>Important Alerts</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            style={{ ...styles.statCard, borderTopColor: theme.warning }}
          >
            <div style={styles.statIcon}><Calendar size={20} color={theme.warning} /></div>
            <div style={styles.statValue}>{stats.upcoming}</div>
            <div style={styles.statLabel}>Upcoming Events</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            style={{ ...styles.statCard, borderTopColor: theme.accent }}
          >
            <div style={styles.statIcon}><Download size={20} color={theme.accent} /></div>
            <div style={styles.statValue}>{stats.downloads}</div>
            <div style={styles.statLabel}>Downloads</div>
          </motion.div>
        </div>
      </section>

      {/* ===== SEARCH & FILTERS ===== */}
      <section style={styles.filtersSection}>
        <div style={styles.filtersContainer}>
          <div style={styles.searchWrapper}>
            <Search size={18} color={theme.gray} style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search notices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                style={styles.searchClear}
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div style={styles.filtersRow}>
            <div style={styles.categoryPills}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    ...styles.categoryPill,
                    background: selectedCategory === cat ? theme.primary : "transparent",
                    color: selectedCategory === cat ? theme.white : theme.gray,
                    borderColor: selectedCategory === cat ? theme.primary : theme.lightGray,
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div style={styles.filterControls}>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                style={styles.filterSelect}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>

              <button
                onClick={() => setFilterPdfOnly(!filterPdfOnly)}
                style={{
                  ...styles.filterPdfButton,
                  background: filterPdfOnly ? `${theme.primary}15` : "transparent",
                  color: filterPdfOnly ? theme.primary : theme.gray,
                  borderColor: filterPdfOnly ? theme.primary : theme.lightGray,
                }}
              >
                <FileText size={14} />
                PDF Only
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURED NOTICE ===== */}
      {featuredNotice && (
        <section style={styles.featuredSection}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={styles.featuredCard}
            onClick={() => setSelectedNotice(featuredNotice)}
          >
            <div style={styles.featuredBadge}>
              <Star size={16} color={theme.white} />
              Featured Announcement
            </div>
            <h3 style={styles.featuredTitle}>{featuredNotice.title}</h3>
            <p style={styles.featuredDescription}>
              {featuredNotice.description || "Click to read the full announcement."}
            </p>
            <div style={styles.featuredMeta}>
              <span style={styles.featuredDate}>
                <Calendar size={14} />
                {formatNoticeDate(featuredNotice.notice_date)}
              </span>
              <span style={styles.featuredReadMore}>
                Read More <ChevronRight size={16} />
              </span>
            </div>
            <div style={styles.featuredGradient} />
          </motion.div>
        </section>
      )}

      {/* ===== NOTICES LIST ===== */}
      <section style={styles.noticesSection}>
        <div style={styles.noticesHeader}>
          <h2 style={styles.noticesTitle}>Recent Notices</h2>
          <span style={styles.noticesCount}>{regularNotices.length} notices</span>
        </div>

        {loading ? (
          <div style={styles.loadingState}>
            <div style={styles.loadingSpinner} />
            <p>Loading notices...</p>
          </div>
        ) : regularNotices.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📭</div>
            <h3 style={styles.emptyTitle}>No announcements have been published yet</h3>
            <p style={styles.emptyDescription}>
              Please check back later for official school updates.
            </p>
          </div>
        ) : (
          <div style={styles.noticesTimeline}>
            {regularNotices.map((notice, index) => {
              const isPinned = notice.pinned;
              const hasPdf = Boolean(notice.pdf_url || notice.file_url);
              const isImportant = isPinned || notice.category === "Exam" || notice.category === "Admissions";

              // Determine timeline color
              let timelineColor = theme.lightGray;
              if (isPinned) timelineColor = theme.primary;
              else if (notice.category === "Exam") timelineColor = theme.danger;
              else if (notice.category === "Holiday") timelineColor = theme.warning;
              else if (notice.category === "Admissions") timelineColor = theme.accent;

              return (
                <motion.div
                  key={notice.id || index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
                  style={styles.timelineItem}
                >
                  {/* Timeline line */}
                  <div style={{ ...styles.timelineLine, background: timelineColor }} />
                  <div style={{ ...styles.timelineDot, background: timelineColor }} />

                  <div
                    style={styles.noticeCard}
                    onClick={() => setSelectedNotice(notice)}
                  >
                    <div style={styles.noticeCardHeader}>
                      <div style={styles.noticeCardMeta}>
                        <span style={styles.noticeCardCategory}>{notice.category || "General"}</span>
                        {isPinned && (
                          <span style={styles.noticeCardPinned}>
                            <Pin size={12} /> Pinned
                          </span>
                        )}
                        {hasPdf && (
                          <span style={styles.noticeCardPdf}>
                            <FileText size={12} /> PDF
                          </span>
                        )}
                      </div>
                      <span style={styles.noticeCardDate}>
                        {formatNoticeDate(notice.notice_date)}
                      </span>
                    </div>

                    <h3 style={styles.noticeCardTitle}>{notice.title}</h3>
                    <p style={styles.noticeCardDescription}>
                      {notice.description || "Click to view full details."}
                    </p>

                    <div style={styles.noticeCardFooter}>
                      <span style={styles.noticeCardReadMore}>
                        View Details <ChevronRight size={16} />
                      </span>
                    </div>

                    {/* Gradient border effect */}
                    <div style={styles.noticeCardBorder} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* ===== NOTICE MODAL ===== */}
      <AnimatePresence>
        {selectedNotice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={styles.modalOverlay}
            onClick={() => setSelectedNotice(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              style={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedNotice(null)}
                style={styles.modalClose}
              >
                <X size={20} />
              </button>

              <div style={styles.modalHeader}>
                <div style={styles.modalBadges}>
                  <span style={styles.modalCategory}>{selectedNotice.category || "Notice"}</span>
                  {selectedNotice.pinned && (
                    <span style={styles.modalPinned}>📌 Pinned</span>
                  )}
                </div>
                <span style={styles.modalDate}>
                  <Calendar size={14} />
                  {formatNoticeDate(selectedNotice.notice_date)}
                </span>
              </div>

              <h2 style={styles.modalTitle}>{selectedNotice.title}</h2>

              {selectedNotice.description && (
                <p style={styles.modalDescription}>{selectedNotice.description}</p>
              )}

              {(selectedNotice.pdf_url || selectedNotice.file_url) && (
                <div style={styles.modalPdfSection}>
                  <div style={styles.modalPdfHeader}>
                    <FileText size={16} />
                    <span>Attachment</span>
                  </div>
                  <a
                    href={selectedNotice.pdf_url || selectedNotice.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.modalPdfLink}
                  >
                    <span>View PDF Document</span>
                    <ExternalLink size={16} />
                  </a>
                  <a
                    href={selectedNotice.pdf_url || selectedNotice.file_url}
                    download
                    style={styles.modalDownloadLink}
                  >
                    <Download size={14} />
                    Download File
                  </a>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============ STYLES ============
const styles = {
  pageContainer: {
    minHeight: "100vh",
    background: "#F8FAFC",
    paddingTop: "80px",
    position: "relative",
    overflowX: "hidden",
  },

  // Background Decorations
  bgDecorations: {
    position: "fixed",
    inset: 0,
    pointerEvents: "none",
    zIndex: 0,
    overflow: "hidden",
  },
  bgBlur: {
    position: "absolute",
    borderRadius: "50%",
    background: "rgba(37, 99, 235, 0.06)",
    filter: "blur(80px)",
  },
  bgGrid: {
    position: "absolute",
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(15, 23, 42, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(15, 23, 42, 0.03) 1px, transparent 1px)
    `,
    backgroundSize: "60px 60px",
  },

  // Hero
  heroSection: {
    position: "relative",
    padding: "24px 24px 32px",
    zIndex: 1,
  },
  heroBackground: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(135deg,#1E3A5F 0%,#29597A 35%,#234B69 70%,#16324C 100%)",
    borderRadius: "0 0 60px 60px",
},
heroOverlay: {
    position: "absolute",
    inset: 0,
    background: `
        radial-gradient(circle at 30% 20%, rgba(255,255,255,.08), transparent 35%),
        radial-gradient(circle at 80% 40%, rgba(255,255,255,.06), transparent 45%)
    `,
    borderRadius: "0 0 60px 60px",
},
  heroContent: {
    position: "relative",
    maxWidth: "1400px",
    margin: "0 auto",
    zIndex: 2,
  },
  heroInner: {
    maxWidth: "700px",
  },
  heroBadge: {
    display: "inline-block",
    padding: "6px 16px",
    borderRadius: "50px",
    fontSize: "13px",
    fontWeight: "600",
    color: "#14B8A6",
    background: "rgba(20, 184, 166, 0.12)",
    border: "1px solid rgba(20, 184, 166, 0.2)",
    marginBottom: "20px",
  },
  heroTitle: {
    fontSize: "clamp(2.5rem, 5vw, 3.8rem)",
    fontWeight: 900,
    color: "#FFFFFF",
    lineHeight: 1.05,
    letterSpacing: "-0.03em",
    marginBottom: "16px",
  },
  heroTitleHighlight: {
    fontSize: "clamp(1.8rem, 3vw, 2.8rem)",
    fontWeight: 600,
    color: "rgba(255,255,255,0.8)",
    display: "block",
    marginTop: "4px",
  },
  heroDescription: {
    fontSize: "clamp(1rem, 1.2vw, 1.15rem)",
    color: "rgba(255,255,255,0.65)",
    lineHeight: 1.7,
    maxWidth: "520px",
    marginBottom: "24px",
  },
  heroMeta: {
    display: "flex",
    gap: "24px",
    flexWrap: "wrap",
  },
  heroMetaItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    color: "rgba(255,255,255,0.5)",
    fontWeight: "500",
  },

  // Stats Dashboard
  statsSection: {
    padding: "30px 24px 0",
    position: "relative",
    zIndex: 1,
  },
  statsGrid: {
    maxWidth: "1400px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
  },
  statCard: {
    padding: "20px 24px",
    borderRadius: "16px",
    background: "#FFFFFF",
    borderTop: "3px solid",
    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
    transition: "all 0.3s ease",
    cursor: "default",
  },
  statIcon: {
    marginBottom: "8px",
  },
  statValue: {
    fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)",
    fontWeight: 800,
    color: "#0F172A",
    letterSpacing: "-0.02em",
  },
  statLabel: {
    fontSize: "14px",
    color: "#64748B",
    fontWeight: 500,
  },

  // Filters
  filtersSection: {
    padding: "30px 24px 20px",
    position: "relative",
    zIndex: 1,
  },
  filtersContainer: {
    maxWidth: "1400px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  searchWrapper: {
    position: "relative",
    flex: 1,
  },
  searchIcon: {
    position: "absolute",
    left: "16px",
    top: "50%",
    transform: "translateY(-50%)",
  },
  searchInput: {
    width: "100%",
    padding: "12px 16px 12px 44px",
    borderRadius: "12px",
    border: "1px solid #E2E8F0",
    fontSize: "15px",
    fontWeight: 500,
    color: "#0F172A",
    background: "#FFFFFF",
    outline: "none",
    transition: "all 0.3s ease",
  },
  searchClear: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    color: "#64748B",
    cursor: "pointer",
    padding: "4px",
  },
  filtersRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    alignItems: "center",
  },
  categoryPills: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    flex: 1,
  },
  categoryPill: {
    padding: "6px 16px",
    borderRadius: "50px",
    fontSize: "13px",
    fontWeight: "600",
    border: "1px solid",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  filterControls: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },
  filterSelect: {
    padding: "6px 12px",
    borderRadius: "8px",
    border: "1px solid #E2E8F0",
    fontSize: "13px",
    fontWeight: "500",
    color: "#0F172A",
    background: "#FFFFFF",
    cursor: "pointer",
    outline: "none",
  },
  filterPdfButton: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 14px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    border: "1px solid",
    cursor: "pointer",
    transition: "all 0.2s ease",
    background: "transparent",
  },

  // Featured
  featuredSection: {
    padding: "20px 24px",
    position: "relative",
    zIndex: 1,
  },
  featuredCard: {
    position: "relative",
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "32px 40px",
    borderRadius: "20px",
    background: "#FFFFFF",
    border: "1px solid rgba(37, 99, 235, 0.1)",
    boxShadow: "0 4px 20px rgba(37, 99, 235, 0.08)",
    cursor: "pointer",
    overflow: "hidden",
    transition: "all 0.3s ease",
  },
  featuredBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "4px 14px",
    borderRadius: "50px",
    fontSize: "12px",
    fontWeight: 600,
    color: "#FFFFFF",
    background: "linear-gradient(135deg, #2563EB 0%, #14B8A6 100%)",
    marginBottom: "12px",
  },
  featuredTitle: {
    fontSize: "clamp(1.4rem, 2vw, 1.8rem)",
    fontWeight: 800,
    color: "#0F172A",
    marginBottom: "8px",
    letterSpacing: "-0.02em",
  },
  featuredDescription: {
    fontSize: "15px",
    color: "#64748B",
    lineHeight: 1.6,
    maxWidth: "600px",
    marginBottom: "16px",
  },
  featuredMeta: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "12px",
  },
  featuredDate: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "14px",
    color: "#64748B",
  },
  featuredReadMore: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "14px",
    fontWeight: 600,
    color: "#2563EB",
  },
  featuredGradient: {
    position: "absolute",
    top: 0,
    right: 0,
    width: "200px",
    height: "100%",
    background: "linear-gradient(90deg, transparent, rgba(37, 99, 235, 0.03))",
    pointerEvents: "none",
  },

  // Notices List
  noticesSection: {
    padding: "20px 24px 60px",
    position: "relative",
    zIndex: 1,
  },
  noticesHeader: {
    maxWidth: "1400px",
    margin: "0 auto 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  noticesTitle: {
    fontSize: "clamp(1.4rem, 2vw, 1.8rem)",
    fontWeight: 800,
    color: "#0F172A",
    letterSpacing: "-0.02em",
  },
  noticesCount: {
    fontSize: "14px",
    color: "#64748B",
    fontWeight: 500,
  },

  // Timeline
  noticesTimeline: {
    maxWidth: "900px",
    margin: "0 auto",
    position: "relative",
  },
  timelineItem: {
    position: "relative",
    paddingLeft: "32px",
    marginBottom: "24px",
  },
  timelineLine: {
    position: "absolute",
    left: "8px",
    top: "20px",
    bottom: "-24px",
    width: "2px",
    opacity: 0.3,
  },
  timelineDot: {
    position: "absolute",
    left: "4px",
    top: "8px",
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    border: "2px solid #FFFFFF",
    boxShadow: "0 0 0 2px currentColor",
  },

  // Notice Card
  noticeCard: {
    padding: "24px 28px",
    borderRadius: "16px",
    background: "#FFFFFF",
    border: "1px solid #E2E8F0",
    cursor: "pointer",
    transition: "all 0.3s ease",
    position: "relative",
    overflow: "hidden",
  },
  noticeCardBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "4px",
    height: "100%",
    background: "linear-gradient(180deg, #2563EB 0%, #14B8A6 100%)",
    opacity: 0,
    transition: "opacity 0.3s ease",
  },
  noticeCardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "8px",
    marginBottom: "8px",
  },
  noticeCardMeta: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    alignItems: "center",
  },
  noticeCardCategory: {
    fontSize: "12px",
    fontWeight: 600,
    padding: "2px 12px",
    borderRadius: "50px",
    background: "#F1F5F9",
    color: "#64748B",
  },
  noticeCardPinned: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "11px",
    fontWeight: 600,
    color: "#2563EB",
    background: "rgba(37, 99, 235, 0.08)",
    padding: "2px 10px",
    borderRadius: "50px",
  },
  noticeCardPdf: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "11px",
    fontWeight: 600,
    color: "#14B8A6",
    background: "rgba(20, 184, 166, 0.08)",
    padding: "2px 10px",
    borderRadius: "50px",
  },
  noticeCardDate: {
    fontSize: "13px",
    color: "#94A3B8",
    fontWeight: 500,
    whiteSpace: "nowrap",
  },
  noticeCardTitle: {
    fontSize: "clamp(1.1rem, 1.3vw, 1.3rem)",
    fontWeight: 700,
    color: "#0F172A",
    marginBottom: "6px",
    letterSpacing: "-0.01em",
  },
  noticeCardDescription: {
    fontSize: "15px",
    color: "#64748B",
    lineHeight: 1.6,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  noticeCardFooter: {
    marginTop: "12px",
  },
  noticeCardReadMore: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "14px",
    fontWeight: 600,
    color: "#2563EB",
    transition: "gap 0.3s ease",
  },

  // Loading / Empty
  loadingState: {
    textAlign: "center",
    padding: "60px 20px",
    color: "#64748B",
  },
  loadingSpinner: {
    width: "40px",
    height: "40px",
    margin: "0 auto 16px",
    border: "3px solid #E2E8F0",
    borderTopColor: "#2563EB",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
    background: "#FFFFFF",
    borderRadius: "16px",
    border: "1px dashed #E2E8F0",
  },
  emptyIcon: {
    fontSize: "48px",
    marginBottom: "16px",
  },
  emptyTitle: {
    fontSize: "20px",
    fontWeight: 700,
    color: "#0F172A",
    marginBottom: "8px",
  },
  emptyDescription: {
    fontSize: "15px",
    color: "#64748B",
  },

  // Modal
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15, 23, 42, 0.6)",
    backdropFilter: "blur(8px)",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
  },
  modalContent: {
    position: "relative",
    maxWidth: "700px",
    width: "100%",
    maxHeight: "85vh",
    overflowY: "auto",
    background: "#FFFFFF",
    borderRadius: "24px",
    padding: "40px",
    boxShadow: "0 24px 80px rgba(0,0,0,0.2)",
  },
  modalClose: {
    position: "absolute",
    top: "16px",
    right: "16px",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    border: "none",
    background: "#F1F5F9",
    color: "#0F172A",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "12px",
    marginBottom: "16px",
  },
  modalBadges: {
    display: "flex",
    gap: "8px",
  },
  modalCategory: {
    fontSize: "13px",
    fontWeight: 600,
    padding: "4px 14px",
    borderRadius: "50px",
    background: "#F1F5F9",
    color: "#64748B",
  },
  modalPinned: {
    fontSize: "13px",
    fontWeight: 600,
    padding: "4px 14px",
    borderRadius: "50px",
    background: "rgba(37, 99, 235, 0.08)",
    color: "#2563EB",
  },
  modalDate: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "14px",
    color: "#94A3B8",
  },
  modalTitle: {
    fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
    fontWeight: 800,
    color: "#0F172A",
    marginBottom: "12px",
    letterSpacing: "-0.02em",
  },
  modalDescription: {
    fontSize: "16px",
    color: "#64748B",
    lineHeight: 1.8,
    marginBottom: "24px",
    whiteSpace: "pre-wrap",
  },
  modalPdfSection: {
    padding: "16px 20px",
    borderRadius: "12px",
    background: "#F8FAFC",
    border: "1px solid #E2E8F0",
  },
  modalPdfHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    fontWeight: 600,
    color: "#0F172A",
    marginBottom: "12px",
  },
  modalPdfLink: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 16px",
    borderRadius: "8px",
    background: "#FFFFFF",
    color: "#2563EB",
    textDecoration: "none",
    fontWeight: 500,
    border: "1px solid #E2E8F0",
    marginBottom: "8px",
    transition: "all 0.2s ease",
  },
  modalDownloadLink: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 16px",
    borderRadius: "8px",
    background: "#0F172A",
    color: "#FFFFFF",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: 500,
    transition: "all 0.2s ease",
  },
};

// Add keyframes for spinner
const spinnerStyles = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  .notice-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(0,0,0,0.06);
  }
  .notice-card:hover .notice-card-border {
    opacity: 1;
  }
  .notice-card:hover .notice-card-read-more {
    gap: 12px;
  }
  .stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.06);
  }
  .featured-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 35px rgba(37, 99, 235, 0.12);
  }
  .category-pill:hover {
    transform: scale(1.02);
  }
  .modal-close:hover {
    transform: rotate(90deg);
  }
`;

// Add styles to document
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = spinnerStyles;
  document.head.appendChild(styleSheet);
}