import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const Teachers = () => {
  const teachers = [
    { id: 1, name: 'M. Traoré', subject: 'Mathématiques', email: 'traore@bit.bf' },
    { id: 2, name: 'Mme. Koné', subject: 'Informatique', email: 'kone@bit.bf' },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-slate-800">Gestion des Enseignants</h2>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition-all">+ Ajouter</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teachers.map(t => (
              <div key={t.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{t.name}</h3>
                  <p className="text-blue-600 font-medium">{t.subject}</p>
                  <p className="text-sm text-slate-500 mt-1">{t.email}</p>
                </div>
                <button className="text-slate-400 hover:text-blue-600 font-medium">Modifier</button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Teachers;
