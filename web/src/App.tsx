import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

import LoginPage from "./pages/LoginPage";
import SuperAdminDashboard from "./pages/super-admin/Dashboard";
import SchoolsPage from "./pages/super-admin/Schools";
import OverviewPage from "./pages/super-admin/Overview";
import AdminDashboard from "./pages/admin/Dashboard";
import StudentsPage from "./pages/admin/Students";
import TeachersPage from "./pages/admin/Teachers";
import ClassesPage from "./pages/admin/Classes";
import SubjectsPage from "./pages/admin/Subjects";
import PaymentsPage from "./pages/admin/Payments";
import TimetablePage from "./pages/admin/Timetable";
import BulletinsPage from "./pages/admin/Bulletins";
import ReportsPage from "./pages/admin/Reports";
import SettingsPage from "./pages/admin/Settings";
import TeacherDashboard from "./pages/teacher/Dashboard";
import TeacherClassesPage from "./pages/teacher/Classes";
import TeacherGradesPage from "./pages/teacher/Grades";
import TeacherAttendancePage from "./pages/teacher/Attendance";
import TeacherTimetablePage from "./pages/teacher/Timetable";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function RoleRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === "super_admin") return <Navigate to="/super-admin" replace />;
  if (user.role === "admin_school") return <Navigate to="/admin" replace />;
  return <Navigate to="/teacher" replace />;
}

function LoginGuard() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <LoginPage />;
}

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<LoginGuard />} />
    <Route path="/" element={<AuthGuard><RoleRedirect /></AuthGuard>} />

    {/* Super Admin */}
    <Route path="/super-admin" element={<AuthGuard><SuperAdminDashboard /></AuthGuard>} />
    <Route path="/super-admin/schools" element={<AuthGuard><SchoolsPage /></AuthGuard>} />
    <Route path="/super-admin/overview" element={<AuthGuard><OverviewPage /></AuthGuard>} />

    {/* Admin École */}
    <Route path="/admin" element={<AuthGuard><AdminDashboard /></AuthGuard>} />
    <Route path="/admin/students" element={<AuthGuard><StudentsPage /></AuthGuard>} />
    <Route path="/admin/teachers" element={<AuthGuard><TeachersPage /></AuthGuard>} />
    <Route path="/admin/classes" element={<AuthGuard><ClassesPage /></AuthGuard>} />
    <Route path="/admin/subjects" element={<AuthGuard><SubjectsPage /></AuthGuard>} />
    <Route path="/admin/payments" element={<AuthGuard><PaymentsPage /></AuthGuard>} />
    <Route path="/admin/timetable" element={<AuthGuard><TimetablePage /></AuthGuard>} />
    <Route path="/admin/bulletins" element={<AuthGuard><BulletinsPage /></AuthGuard>} />
    <Route path="/admin/reports" element={<AuthGuard><ReportsPage /></AuthGuard>} />
    <Route path="/admin/settings" element={<AuthGuard><SettingsPage /></AuthGuard>} />

    {/* Enseignant */}
    <Route path="/teacher" element={<AuthGuard><TeacherDashboard /></AuthGuard>} />
    <Route path="/teacher/classes" element={<AuthGuard><TeacherClassesPage /></AuthGuard>} />
    <Route path="/teacher/grades" element={<AuthGuard><TeacherGradesPage /></AuthGuard>} />
    <Route path="/teacher/attendance" element={<AuthGuard><TeacherAttendancePage /></AuthGuard>} />
    <Route path="/teacher/timetable" element={<AuthGuard><TeacherTimetablePage /></AuthGuard>} />

    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
