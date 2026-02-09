import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const Payments = () => {
  const payments = [
    { id: 1, student: 'Adji', amount: '250 000 FCFA', date: '01/02/2026', status: 'Payé' },
    { id: 2, student: 'Camarade 1', amount: '150 000 FCFA', date: '03/02/2026', status: 'En attente' },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-8">Suivi des Paiements</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="p-4 font-bold text-slate-600">Étudiant</th>
                  <th className="p-4 font-bold text-slate-600">Montant</th>
                  <th className="p-4 font-bold text-slate-600">Date</th>
                  <th className="p-4 font-bold text-slate-600">Statut</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(p => (
                  <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-semibold text-slate-800">{p.student}</td>
                    <td className="p-4 font-bold text-blue-600">{p.amount}</td>
                    <td className="p-4 text-slate-500">{p.date}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        p.status === 'Payé' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {p.status}
                      </span>
                    </td>
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

export default Payments;
