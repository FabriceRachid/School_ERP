import { useAuth } from "../hooks/useAuth";
import { Link, useLocation } from "react-router-dom";

const TeacherLayout = ({ children }) => {
  const { logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { path: "/teacher/dashboard", icon: "📊", label: "Dashboard" },
    { path: "/teacher/grades", icon: "📝", label: "Notes" },
    { path: "/teacher/classes", icon: "📚", label: "Mes Classes" },
    { path: "/teacher/students", icon: "👥", label: "Étudiants" },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-slate-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">TC</span>
            </div>
            <div>
              <h1 className="font-bold text-lg text-slate-800">Teacher Panel</h1>
              <p className="text-slate-500 text-xs">Espace Enseignant</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    location.pathname === item.path
                      ? "bg-green-100 text-green-700 font-semibold"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200"
          >
            <span className="text-xl">🚪</span>
            <span>Déconnexion</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                {menuItems.find(item => item.path === location.pathname)?.label || "Tableau de bord"}
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-800">Professeur</p>
                <p className="text-xs text-slate-500">En ligne</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">P</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default TeacherLayout;