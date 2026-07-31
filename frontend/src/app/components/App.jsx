import { lazy, Suspense } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import ScrollToTop from "./ScrollToTop";
import ProtectedAdminRoute from "../../admin/ProtectedAdminRoute";

const lazyNamed = (loader, exportName) =>
  lazy(() =>
    loader().then((module) => ({
      default: module[exportName],
    }))
  );

const Navbar = lazyNamed(() => import("./Navbar"), "Navbar");
const Hero = lazyNamed(() => import("./Hero"), "Hero");
const Stats = lazyNamed(() => import("./Stats"), "Stats");
const About = lazyNamed(() => import("./About"), "About");
const Academics = lazyNamed(() => import("./Academics"), "Academics");
const Admissions = lazyNamed(() => import("./Admissions"), "Admissions");
const Events = lazyNamed(() => import("./Events"), "Events");
const Gallery = lazyNamed(() => import("./Gallery"), "Gallery");
const Contact = lazyNamed(() => import("./Contact"), "Contact");
const Footer = lazyNamed(() => import("./Footer"), "Footer");

const Notices = lazy(() => import("../../pages/Notices"));
const Calendar = lazy(() => import("../../pages/Calendar"));
const Blogs = lazy(() => import("../../pages/Blogs"));
const BlogDetail = lazy(() => import("../../pages/BlogDetail"));
const NoticeDetail = lazy(() => import("../../pages/NoticeDetail"));
const Staff = lazy(() => import("../../pages/Staff"));
const Facilities = lazy(() => import("../../pages/Facilities"));

const AdminAbout = lazy(() => import("../../admin/AdminAbout"));
const AdminLogin = lazy(() => import("../../admin/AdminLogin"));
const AdminForgotPassword = lazy(() => import("../../admin/AdminForgotPassword"));
const AdminResetPassword = lazy(() => import("../../admin/AdminResetPassword"));
const AdminDashboard = lazy(() => import("../../admin/AdminDashboard"));
const AdminHome = lazy(() => import("../../admin/AdminHome"));
const AdminNotices = lazy(() => import("../../admin/AdminNotices"));
const AdminFacilities = lazy(() => import("../../admin/AdminFacilities"));
const AdminNavbar = lazy(() => import("../../admin/AdminNavbar"));
const AdminStaff = lazy(() => import("../../admin/AdminStaff"));
const AdminAcademics = lazy(() => import("../../admin/AdminAcademics"));
const AdminAdmissions = lazy(() => import("../../admin/AdminAdmissions"));
const AdminFooter = lazy(() => import("../../admin/AdminFooter"));
const AdminGallery = lazy(() => import("../../admin/AdminGallery"));
const AdminSettings = lazy(() => import("../../admin/AdminSettings"));
const AdminGalleryImages = lazy(() => import("../../admin/AdminGalleryImages"));
const AdminContact = lazy(() => import("../../admin/AdminContact"));
const AdminContactMessages = lazy(() => import("../../admin/AdminContactMessages"));
const AdminAddNotice = lazy(() => import("../../admin/AdminAddNotice"));
const AdminAnnouncements = lazy(() => import("../../admin/AdminAnnouncements"));
const AdminCalendar = lazy(() => import("../../admin/AdminCalendar"));
const AdminBlog = lazy(() => import("../../admin/AdminBlog"));

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

function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
    </>
  );
}

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

function ProtectedPage({ children }) {
  return <ProtectedAdminRoute>{children}</ProtectedAdminRoute>;
}

function SchoolApp() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen" style={{ fontFamily: "var(--font-body)" }}>
      <ScrollToTop />

      {!isAdminRoute && (
        <Suspense fallback={null}>
          <Navbar />
        </Suspense>
      )}

      <main>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Website Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/facilities" element={<FacilitiesPage />} />
            <Route path="/academics" element={<AcademicsPage />} />
            <Route path="/admissions" element={<AdmissionsPage />} />
            <Route path="/notices" element={<Notices />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/blogs" element={<BlogsPage />} />
            <Route path="/blogs/:slug" element={<BlogDetail />} />
            <Route path="/notices/:id" element={<NoticeDetail />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* Admin Auth */}
            <Route
              path="/admin"
              element={<Navigate to="/admin/dashboard" replace />}
            />

            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
            <Route path="/admin/reset-password" element={<AdminResetPassword />} />

            <Route
              path="/admin/dashboard"
              element={
                <ProtectedPage>
                  <AdminDashboard />
                </ProtectedPage>
              }
            />

            {/* Built Admin Editors */}
            <Route
              path="/admin/home"
              element={
                <ProtectedPage>
                  <AdminHome />
                </ProtectedPage>
              }
            />

            <Route
              path="/admin/navbar"
              element={
                <ProtectedPage>
                  <AdminNavbar />
                </ProtectedPage>
              }
            />

            <Route
              path="/admin/settings"
              element={
                <ProtectedPage>
                  <AdminSettings />
                </ProtectedPage>
              }
            />

            <Route
              path="/admin/staff"
              element={
                <ProtectedPage>
                  <AdminStaff />
                </ProtectedPage>
              }
            />

            <Route
              path="/admin/facilities"
              element={
                <ProtectedPage>
                  <AdminFacilities />
                </ProtectedPage>
              }
            />

            <Route
              path="/admin/notices"
              element={
                <ProtectedPage>
                  <AdminNotices />
                </ProtectedPage>
              }
            />

            <Route
              path="/admin/calendar"
              element={
                <ProtectedPage>
                  <AdminCalendar />
                </ProtectedPage>
              }
            />

            <Route
              path="/admin/blogs"
              element={
                <ProtectedPage>
                  <AdminBlog />
                </ProtectedPage>
              }
            />

            <Route
              path="/admin/notices/new"
              element={
                <ProtectedPage>
                  <AdminAddNotice />
                </ProtectedPage>
              }
            />

            <Route
              path="/admin/contact"
              element={
                <ProtectedPage>
                  <AdminContact />
                </ProtectedPage>
              }
            />

            <Route
              path="/admin/about"
              element={
                <ProtectedPage>
                  <AdminAbout />
                </ProtectedPage>
              }
            />

            <Route
              path="/admin/academics"
              element={
                <ProtectedPage>
                  <AdminAcademics />
                </ProtectedPage>
              }
            />

            <Route
              path="/admin/admissions"
              element={
                <ProtectedPage>
                  <AdminAdmissions />
                </ProtectedPage>
              }
            />

            <Route
              path="/admin/contact-messages"
              element={
                <ProtectedPage>
                  <AdminContactMessages />
                </ProtectedPage>
              }
            />

            <Route
              path="/admin/gallery"
              element={
                <ProtectedPage>
                  <AdminGallery />
                </ProtectedPage>
              }
            />

            <Route
              path="/admin/gallery-images"
              element={
                <ProtectedPage>
                  <AdminGalleryImages />
                </ProtectedPage>
              }
            />

            <Route
              path="/admin/announcements"
              element={
                <ProtectedPage>
                  <AdminAnnouncements />
                </ProtectedPage>
              }
            />

            <Route
              path="/admin/footer"
              element={
                <ProtectedPage>
                  <AdminFooter />
                </ProtectedPage>
              }
            />

            {/* Fallback */}
            <Route
              path="*"
              element={
                isAdminRoute ? (
                  <Navigate to="/admin/dashboard" replace />
                ) : (
                  <HomePage />
                )
              }
            />
          </Routes>
        </Suspense>
      </main>

      {!isAdminRoute && (
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      )}
    </div>
  );
}

export default SchoolApp;
