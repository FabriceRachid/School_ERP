import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (role) => {
    login({ name: "User", role });
    navigate(role === "admin" ? "/admin/dashboard" : "/teacher/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">SE</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">School ERP</h1>
          <p className="text-slate-600">Système de gestion scolaire</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => handleLogin("admin")}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <div className="flex items-center justify-center gap-3">
              <span className="text-xl">👨‍💼</span>
              <span>Connexion Administrateur</span>
            </div>
          </button>

          <button
            onClick={() => handleLogin("teacher")}
            className="w-full bg-white border-2 border-slate-200 text-slate-700 py-3 px-6 rounded-xl font-semibold hover:bg-slate-50 transition-all duration-200"
          >
            <div className="flex items-center justify-center gap-3">
              <span className="text-xl">👨‍🏫</span>
              <span>Connexion Enseignant</span>
            </div>
          </button>
        </div>

        <div className="mt-8 text-center text-sm text-slate-500">
          <p>Démo : Cliquez sur un rôle pour accéder</p>
        </div>
      </div>
    </div>
  );
};

export default Login;