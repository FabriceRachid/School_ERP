import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

import AdminDashboard from "./pages/admin/Dashboard";
import Students from "./pages/admin/Students";
import Teachers from "./pages/admin/Teachers";
import Classes from "./pages/admin/Classes";
import Payments from "./pages/admin/Payments";
import Reports from "./pages/admin/Reports";
import Parents from "./pages/admin/Parents";
import Library from "./pages/admin/Library";
import Account from "./pages/admin/Account";
import Settings from "./pages/admin/Settings";

import TeacherDashboard from "./pages/teacher/Dashboard";
import Grades from "./pages/teacher/Grades";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/admin/dashboard" element={
          <ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>
        } />
        <Route path="/admin/students" element={
          <ProtectedRoute role="admin"><Students /></ProtectedRoute>
        } />
        <Route path="/admin/teachers" element={
          <ProtectedRoute role="admin"><Teachers /></ProtectedRoute>
        } />
        <Route path="/admin/classes" element={
          <ProtectedRoute role="admin"><Classes /></ProtectedRoute>
        } />
        <Route path="/admin/payments" element={
          <ProtectedRoute role="admin"><Payments /></ProtectedRoute>
        } />
        <Route path="/admin/reports" element={
          <ProtectedRoute role="admin"><Reports /></ProtectedRoute>
        } />
        <Route path="/admin/parents" element={
          <ProtectedRoute role="admin"><Parents /></ProtectedRoute>
        } />
        <Route path="/admin/library" element={
          <ProtectedRoute role="admin"><Library /></ProtectedRoute>
        } />
        <Route path="/admin/account" element={
          <ProtectedRoute role="admin"><Account /></ProtectedRoute>
        } />
        <Route path="/admin/settings" element={
          <ProtectedRoute role="admin"><Settings /></ProtectedRoute>
        } />

        <Route path="/teacher/dashboard" element={
          <ProtectedRoute role="teacher"><TeacherDashboard /></ProtectedRoute>
        } />
        <Route path="/teacher/grades" element={
          <ProtectedRoute role="teacher"><Grades /></ProtectedRoute>
        } />

        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
