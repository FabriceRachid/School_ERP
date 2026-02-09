import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const Grades = () => {
  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-8">Saisie des Notes</h2>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <select className="p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500">
                <option>Sélectionner une classe</option>
                <option>L3 Informatique</option>
              </select>
              <select className="p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500">
                <option>Sélectionner une matière</option>
                <option>Développement Web</option>
              </select>
              <button className="bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700">Afficher la liste</button>
            </div>
            <div className="text-center py-20 text-slate-400 italic border-2 border-dashed border-slate-100 rounded-2xl">
              Veuillez sélectionner les critères pour commencer la saisie.
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Grades;
