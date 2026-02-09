import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { Users, GraduationCap, CreditCard, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { label: 'Total Étudiants', value: '1,250', icon: <GraduationCap className="text-blue-600" />, color: 'bg-blue-50' },
    { label: 'Enseignants', value: '48', icon: <Users className="text-purple-600" />, color: 'bg-purple-50' },
    { label: 'Paiements (Mois)', value: '2.5M FCFA', icon: <CreditCard className="text-green-600" />, color: 'bg-green-50' },
    { label: 'Taux de réussite', value: '85%', icon: <TrendingUp className="text-orange-600" />, color: 'bg-orange-50' },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-8">Vue d'ensemble</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                <div className={`p-4 rounded-xl ${stat.color}`}>{stat.icon}</div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 h-64 flex items-center justify-center text-slate-400 italic">
            Graphiques et activités récentes à venir...
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
