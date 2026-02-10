import AdminLayout from "../../components/AdminLayout";

const Reports = () => {
  return (
    <AdminLayout>
      <h2 className="text-2xl font-bold text-slate-800 mb-8">Rapports & Statistiques</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-6">Taux de réussite par classe</h3>
          <div className="flex items-end gap-4 h-48">
            <div className="flex-1 bg-blue-500 rounded-t-lg h-[80%]"></div>
            <div className="flex-1 bg-blue-400 rounded-t-lg h-[60%]"></div>
            <div className="flex-1 bg-blue-600 rounded-t-lg h-[95%]"></div>
          </div>
          <div className="flex justify-between mt-4 text-xs font-bold text-slate-400">
            <span>L1 INFO</span><span>L2 INFO</span><span>L3 INFO</span>
          </div>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center">
          <h3 className="font-bold text-slate-800 mb-6 w-full">Recouvrement des frais</h3>
          <div className="relative w-40 h-40">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path className="text-slate-100" strokeDasharray="100, 100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="text-blue-600" strokeDasharray="75, 100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-slate-800">75%</div>
          </div>
          <p className="mt-6 text-sm text-slate-500 font-medium">Objectif annuel : 100M FCFA</p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Reports;