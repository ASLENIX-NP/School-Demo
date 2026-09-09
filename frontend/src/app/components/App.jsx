import { lazy, Suspense, useEffect, useRef } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import ScrollToTop from "./ScrollToTop";
import ProtectedAdminRoute from "../../admin/ProtectedAdminRoute";

// =========================================================
// PUBLIC COMPONENTS
// =========================================================

const Navbar = lazy(() => import("./Navbar"));
const Hero = lazy(() => import("./Hero"));
const Stats = lazy(() => import("./Stats"));
const About = lazy(() => import("./About"));
const Academics = lazy(() => import("./Academics"));
const Admissions = lazy(() => import("./Admissions"));
const Events = lazy(() => import("./Events"));
const Gallery = lazy(() => import("./Gallery"));
const Contact = lazy(() => import("./Contact"));
const Footer = lazy(() => import("./Footer"));

// =========================================================
// HOME ANNOUNCEMENT POPUP
// =========================================================

const HomeAnnouncementPopup = lazy(
  () => import("./HomeAnnouncementPopup")
);

// =========================================================
// PUBLIC PAGES
// =========================================================

const Notices = lazy(() => import("../../pages/Notices"));
const Calendar = lazy(() => import("../../pages/Calendar"));
const Blogs = lazy(() => import("../../pages/Blogs"));
const BlogDetail = lazy(() => import("../../pages/BlogDetail"));
const NoticeDetail = lazy(() => import("../../pages/NoticeDetail"));
const Staff = lazy(() => import("../../pages/Staff.jsx"));
const TeacherProfile = lazy(() => import("../../pages/TeacherProfile"));
const Facilities = lazy(() => import("../../pages/Facilities"));

// =========================================================
// ADMIN PAGES
// =========================================================

const AdminAbout = lazy(() => import("../../admin/AdminAbout"));
const AdminLogin = lazy(() => import("../../admin/AdminLogin"));
const AdminForgotPassword = lazy(
  () => import("../../admin/AdminForgotPassword")
);
const AdminResetPassword = lazy(
  () => import("../../admin/AdminResetPassword")
);
const AdminDashboard = lazy(() => import("../../admin/AdminDashboard"));
const AdminHome = lazy(() => import("../../admin/AdminHome"));
const AdminNotices = lazy(() => import("../../admin/AdminNotices"));
const AdminFacilities = lazy(
  () => import("../../admin/AdminFacilities")
);
const AdminNavbar = lazy(() => import("../../admin/AdminNavbar"));
const AdminStaff = lazy(() => import("../../admin/AdminStaff"));
const AdminAcademics = lazy(
  () => import("../../admin/AdminAcademics")
);
const AdminAdmissions = lazy(
  () => import("../../admin/AdminAdmissions")
);
const AdminFooter = lazy(() => import("../../admin/AdminFooter"));
const AdminGallery = lazy(() => import("../../admin/AdminGallery"));
const AdminSettings = lazy(() => import("../../admin/AdminSettings"));
const AdminContact = lazy(() => import("../../admin/AdminContact"));
const AdminContactMessages = lazy(
  () => import("../../admin/AdminContactMessages")
);
const AdminAddNotice = lazy(
  () => import("../../admin/AdminAddNotice")
);
const AdminAnnouncements = lazy(
  () => import("../../admin/AdminAnnouncements")
);
const AdminCalendar = lazy(
  () => import("../../admin/AdminCalendar")
);
const AdminBlog = lazy(() => import("../../admin/AdminBlog"));

// =========================================================
// PAGE LOADER
// =========================================================

function PageLoader() {
  return (
    <div
      className="min-h-[55vh] flex items-center justify-center px-6"
      style={{
        background:
          "linear-gradient(180deg, rgba(255,248,238,0.88), rgba(241,236,255,0.88))",
      }}
    >
      <div className="rounded-3xl bg-white/80 px-6 py-4 text-sm font-black text-slate-600 shadow-xl border border-slate-100">
        Loading page...
      </div>
    </div>
  );
}

// =========================================================
// HOME PAGE
// =========================================================
function HomePage({ showAnnouncement }) {
  return (
    <>
      {showAnnouncement && (
        <Suspense fallback={null}>
          <HomeAnnouncementPopup />
        </Suspense>
      )}

      <Hero />
      <Stats />
    </>
  );
}

// =========================================================
// PUBLIC PAGE WRAPPERS
// =========================================================

function AboutPage() {
  return <About />;
}

function FacilitiesPage() {
  return <Facilities />;
}

function AcademicsPage() {
  return <Academics />;
}

function AdmissionsPage() {
  return <Admissions />;
}

function EventsPage() {
  return <Events />;
}

function GalleryPage() {
  return <Gallery />;
}

function ContactPage() {
  return <Contact />;
}

function CalendarPage() {
  return <Calendar />;
}

function BlogsPage() {
  return <Blogs />;
}

// =========================================================
// PROTECTED ADMIN PAGE
// =========================================================

function ProtectedPage({ children }) {
  return (
    <ProtectedAdminRoute>
      {children}
    </ProtectedAdminRoute>
  );
}

// =========================================================
// MAIN APPLICATION
// =========================================================

function SchoolApp() {
  const location = useLocation();

  // ---------------------------------------------------------
  // HOME ANNOUNCEMENT BEHAVIOR
  //
  // Desired behavior:
  // 1. Fresh load/reload directly on "/"  -> SHOW
  // 2. Home -> About -> Home             -> HIDE
  // 3. Home -> Academics -> Home         -> HIDE
  // 4. Refresh while on "/"              -> SHOW again
  //
  // Refs survive React Router navigation, but are recreated
  // on a real browser refresh. Therefore we do NOT use
  // localStorage/sessionStorage for this behavior.
  // ---------------------------------------------------------
  const startedOnHomeRef = useRef(location.pathname === "/");
  const leftHomeRef = useRef(false);

  useEffect(() => {
    if (location.pathname !== "/") {
      leftHomeRef.current = true;
    }
  }, [location.pathname]);

  const shouldShowAnnouncement =
    location.pathname === "/" &&
    startedOnHomeRef.current &&
    !leftHomeRef.current;

  const isAdminRoute =
    location.pathname.startsWith("/admin");

  return (
    <div
      className="min-h-screen"
      style={{
        fontFamily: "var(--font-body)",
      }}
    >
      {/* Scroll to top on route change */}
      <ScrollToTop />

      {/* =====================================================
          PUBLIC NAVBAR
      ===================================================== */}

      {!isAdminRoute && (
        <Suspense fallback={null}>
          <Navbar />
        </Suspense>
      )}

      {/* =====================================================
          ROUTES
      ===================================================== */}

      <main>
        <Suspense fallback={<PageLoader />}>
          <Routes>

            {/* =================================================
                PUBLIC WEBSITE
            ================================================= */}

            <Route
              path="/"
              element={
                <HomePage
                  showAnnouncement={shouldShowAnnouncement}
                />
              }
            />

            <Route
              path="/about"
              element={<AboutPage />}
            />

            <Route
              path="/facilities"
              element={<FacilitiesPage />}
            />

            <Route
              path="/academics"
              element={<AcademicsPage />}
            />

            <Route
              path="/admissions"
              element={<AdmissionsPage />}
            />

            <Route
              path="/notices"
              element={<Notices />}
            />

            <Route
              path="/calendar"
              element={<CalendarPage />}
            />

            <Route
              path="/blogs"
              element={<BlogsPage />}
            />

            <Route
              path="/blogs/:slug"
              element={<BlogDetail />}
            />

            <Route
              path="/notices/:id"
              element={<NoticeDetail />}
            />

            <Route
              path="/staff"
              element={<Staff />}
            />

            <Route
              path="/staff/:id"
              element={<TeacherProfile />}
            />

            <Route
              path="/events"
              element={<EventsPage />}
            />

            <Route
              path="/gallery"
              element={<GalleryPage />}
            />

            <Route
              path="/contact"
              element={<ContactPage />}
            />

            {/* =================================================
                ADMIN AUTH
            ================================================= */}

            <Route
              path="/admin"
              element={
                <Navigate
                  to="/admin/dashboard"
                  replace
                />
              }
            />

            <Route
              path="/admin/login"
              element={<AdminLogin />}
            />

            <Route
              path="/admin/forgot-password"
              element={<AdminForgotPassword />}
            />

            <Route
              path="/admin/reset-password"
              element={<AdminResetPassword />}
            />

            {/* =================================================
                ADMIN DASHBOARD
            ================================================= */}

            <Route
              path="/admin/dashboard"
              element={
                <ProtectedPage>
                  <AdminDashboard />
                </ProtectedPage>
              }
            />

            {/* =================================================
                ADMIN HOME
            ================================================= */}

            <Route
              path="/admin/home"
              element={
                <ProtectedPage>
                  <AdminHome />
                </ProtectedPage>
              }
            />

            {/* =================================================
                ADMIN NAVBAR
            ================================================= */}

            <Route
              path="/admin/navbar"
              element={
                <ProtectedPage>
                  <AdminNavbar />
                </ProtectedPage>
              }
            />

            {/* =================================================
                ADMIN SETTINGS
            ================================================= */}

            <Route
              path="/admin/settings"
              element={
                <ProtectedPage>
                  <AdminSettings />
                </ProtectedPage>
              }
            />

            {/* =================================================
                ADMIN STAFF
            ================================================= */}

            <Route
              path="/admin/staff"
              element={
                <ProtectedPage>
                  <AdminStaff />
                </ProtectedPage>
              }
            />

            {/* =================================================
                ADMIN FACILITIES
            ================================================= */}

            <Route
              path="/admin/facilities"
              element={
                <ProtectedPage>
                  <AdminFacilities />
                </ProtectedPage>
              }
            />

            {/* =================================================
                ADMIN NOTICES
            ================================================= */}

            <Route
              path="/admin/notices"
              element={
                <ProtectedPage>
                  <AdminNotices />
                </ProtectedPage>
              }
            />

            {/* =================================================
                ADMIN CALENDAR
            ================================================= */}

            <Route
              path="/admin/calendar"
              element={
                <ProtectedPage>
                  <AdminCalendar />
                </ProtectedPage>
              }
            />

            {/* =================================================
                ADMIN BLOGS
            ================================================= */}

            <Route
              path="/admin/blogs"
              element={
                <ProtectedPage>
                  <AdminBlog />
                </ProtectedPage>
              }
            />

            {/* =================================================
                ADMIN ADD NOTICE
            ================================================= */}

            <Route
              path="/admin/notices/new"
              element={
                <ProtectedPage>
                  <AdminAddNotice />
                </ProtectedPage>
              }
            />

            {/* =================================================
                ADMIN CONTACT
            ================================================= */}

            <Route
              path="/admin/contact"
              element={
                <ProtectedPage>
                  <AdminContact />
                </ProtectedPage>
              }
            />

            {/* =================================================
                ADMIN ABOUT
            ================================================= */}

            <Route
              path="/admin/about"
              element={
                <ProtectedPage>
                  <AdminAbout />
                </ProtectedPage>
              }
            />

            {/* =================================================
                ADMIN ACADEMICS
            ================================================= */}

            <Route
              path="/admin/academics"
              element={
                <ProtectedPage>
                  <AdminAcademics />
                </ProtectedPage>
              }
            />

            {/* =================================================
                ADMIN ADMISSIONS
            ================================================= */}

            <Route
              path="/admin/admissions"
              element={
                <ProtectedPage>
                  <AdminAdmissions />
                </ProtectedPage>
              }
            />

            {/* =================================================
                ADMIN CONTACT MESSAGES
            ================================================= */}

            <Route
              path="/admin/contact-messages"
              element={
                <ProtectedPage>
                  <AdminContactMessages />
                </ProtectedPage>
              }
            />

            {/* =================================================
                ADMIN GALLERY
            ================================================= */}

            <Route
              path="/admin/gallery"
              element={
                <ProtectedPage>
                  <AdminGallery />
                </ProtectedPage>
              }
            />

            {/* =================================================
                ADMIN ANNOUNCEMENTS
            ================================================= */}

            <Route
              path="/admin/announcements"
              element={
                <ProtectedPage>
                  <AdminAnnouncements />
                </ProtectedPage>
              }
            />

            {/* =================================================
                ADMIN FOOTER
            ================================================= */}

            <Route
              path="/admin/footer"
              element={
                <ProtectedPage>
                  <AdminFooter />
                </ProtectedPage>
              }
            />

            {/* =================================================
                FALLBACK
            ================================================= */}

            <Route
              path="*"
              element={
                isAdminRoute ? (
                  <Navigate
                    to="/admin/dashboard"
                    replace
                  />
                ) : (
                  <HomePage
                    showAnnouncement={shouldShowAnnouncement}
                  />
                )
              }
            />

          </Routes>
        </Suspense>
      </main>

      {/* =====================================================
          PUBLIC FOOTER
      ===================================================== */}

      {!isAdminRoute && (
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      )}
    </div>
  );
}

export default SchoolApp;