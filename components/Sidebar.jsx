import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, GraduationCap, 
  BookOpen, ClipboardList, CreditCard, BarChart3 
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const menuItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Étudiants', path: '/students', icon: <GraduationCap size={20} /> },
    { name: 'Enseignants', path: '/teachers', icon: <Users size={20} /> },
    { name: 'Classes', path: '/classes', icon: <BookOpen size={20} /> },
    { name: 'Notes', path: '/grades', icon: <ClipboardList size={20} /> },
    { name: 'Paiements', path: '/payments', icon: <CreditCard size={20} /> },
    { name: 'Rapports', path: '/reports', icon: <BarChart3 size={20} /> },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white h-screen p-4 flex flex-col">
      <div className="text-2xl font-bold mb-10 text-blue-400 px-2">School ERP</div>
      <nav className="flex-1">
        {menuItems.map((item) => (
          <Link 
            key={item.path} 
            to={item.path}
            className={`flex items-center gap-3 p-3 rounded-lg mb-2 transition-all ${
              location.pathname === item.path ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-300'
            }`}
          >
            {item.icon}
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
