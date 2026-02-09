import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const Classes = () => {
  const classes = [
    { id: 1, name: 'L1 Informatique', students: 45, room: 'Salle A1' },
    { id: 2, name: 'L2 Informatique', students: 38, room: 'Salle B2' },
    { id: 3, name: 'L3 Informatique', students: 30, room: 'Salle C3' },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-8">Gestion des Classes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {classes.map(c => (
              <div key={c.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-bold mb-4">
                  {c.name.split(' ')[0]}
                </div>
                <h3 className="text-xl font-bold text-slate-800">{c.name}</h3>
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-slate-500 flex justify-between"><span>Effectif:</span> <span className="font-bold text-slate-700">{c.students}</span></p>
                  <p className="text-sm text-slate-500 flex justify-between"><span>Salle:</span> <span className="font-bold text-slate-700">{c.room}</span></p>
                </div>
                <button className="w-full mt-6 py-2 border border-slate-200 rounded-lg text-slate-600 font-bold hover:bg-slate-50 transition-all">Gérer la classe</button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Classes;
