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
import Home from "./app/Home";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/students" element={<Students />} />
      <Route path="/teachers" element={<Teachers />} />
      <Route path="/classes" element={<Classes />} />
      <Route path="/subjects" element={<Subjects />} />
      <Route path="/attendance" element={<Attendance />} />
      <Route path="/fees" element={<Fees />} />
      <Route path="/exams" element={<Exams />} />
      <Route path="/students/add" element={<AddStudent />} />
      <Route path="/students/:id" element={<StudentDetails />} />
      <Route path="/teachers/add" element={<AddTeacher />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}

export default App;
