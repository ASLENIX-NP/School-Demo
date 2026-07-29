import { Routes, Route } from "react-router-dom";

import Login from "./admin/Login";
import Dashboard from "./admin/Dashboard";
import Students from "./admin/Students";
import Teachers from "./admin/Teachers";
import Classes from "./admin/Classes";
import Subjects from "./admin/Subjects";
import Attendance from "./admin/Attendance";
import Fees from "./admin/Fees";
import Exams from "./admin/Exams";
import AddStudent from "./admin/AddStudent";
import AddTeacher from "./admin/AddTeacher";
import ForgotPassword from "./admin/ForgotPassword";
import ResetPassword from "./admin/ResetPassword";
import Profile from "./admin/Profile";
import Settings from "./admin/Settings";
import StudentDetails from "./admin/StudentDetails";
import ProtectedRoute from "./admin/ProtectedRoute";

import Home from "./app/Home";
import AboutPage from "./app/AboutPage";
import AcademicsPage from "./app/AcademicsPage";
import FacilitiesPage from "./app/FacilitiesPage";
import NoticesPage from "./app/NoticesPage";
import ContactPage from "./app/ContactPage";
import Admissions from "./app/Admissions";
import ScrollToTop from "./app/components/ScrollToTop";

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/academics" element={<AcademicsPage />} />
        <Route path="/facilities" element={<FacilitiesPage />} />
        <Route path="/notices" element={<NoticesPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/admissions" element={<Admissions />} />

        {/* Public Login Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected Admin Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/students" element={<ProtectedRoute><Students /></ProtectedRoute>} />
        <Route path="/students/add" element={<ProtectedRoute><AddStudent /></ProtectedRoute>} />
        <Route path="/students/:id" element={<ProtectedRoute><StudentDetails /></ProtectedRoute>} />
        <Route path="/teachers" element={<ProtectedRoute><Teachers /></ProtectedRoute>} />
        <Route path="/teachers/add" element={<ProtectedRoute><AddTeacher /></ProtectedRoute>} />
        <Route path="/classes" element={<ProtectedRoute><Classes /></ProtectedRoute>} />
        <Route path="/subjects" element={<ProtectedRoute><Subjects /></ProtectedRoute>} />
        <Route path="/attendance" element={<ProtectedRoute><Attendance /></ProtectedRoute>} />
        <Route path="/fees" element={<ProtectedRoute><Fees /></ProtectedRoute>} />
        <Route path="/exams" element={<ProtectedRoute><Exams /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

export default App;
