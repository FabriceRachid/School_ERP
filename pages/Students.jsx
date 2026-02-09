import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const Students = () => {
  const students = [
    { id: 'ST001', name: 'Adji', class: 'L3 Informatique', status: 'Inscrit' },
    { id: 'ST002', name: 'Camarade 1', class: 'L3 Informatique', status: 'Inscrit' },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-slate-800">Gestion des Étudiants</h2>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition-all">+ Nouvel Étudiant</button>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="p-4 font-bold text-slate-600">ID</th>
                  <th className="p-4 font-bold text-slate-600">Nom complet</th>
                  <th className="p-4 font-bold text-slate-600">Classe</th>
                  <th className="p-4 font-bold text-slate-600">Statut</th>
                </tr>
              </thead>
              <tbody>
                {students.map(s => (
                  <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-medium text-blue-600">{s.id}</td>
                    <td className="p-4 font-semibold text-slate-800">{s.name}</td>
                    <td className="p-4 text-slate-600">{s.class}</td>
                    <td className="p-4"><span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">{s.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Students;
