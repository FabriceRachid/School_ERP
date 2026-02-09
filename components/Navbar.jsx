import { useAuth } from '../hooks/useAuth';
import { LogOut, User, Bell } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <div className="h-16 bg-white border-b flex items-center justify-between px-8 shadow-sm">
      <div className="text-slate-500 font-medium">
        Tableau de bord / <span className="text-slate-800">Aperçu</span>
      </div>
      <div className="flex items-center gap-6">
        <button className="text-slate-400 hover:text-slate-600"><Bell size={20} /></button>
        <div className="flex items-center gap-6 border-l pl-6">
          <div className="text-right">
            <div className="text-sm font-bold text-slate-800">{user?.name || 'Utilisateur'}</div>
            <div className="text-xs text-slate-500 capitalize">{user?.role || 'Admin'}</div>
          </div>
          <button 
            onClick={logout}
            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
            title="Déconnexion"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
