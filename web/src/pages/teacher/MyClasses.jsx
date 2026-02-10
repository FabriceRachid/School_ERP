import TeacherLayout from "../../components/TeacherLayout";

const MyClasses = () => {
  const classes = [
    { id: 1, name: "L1 INFO", students: 25, schedule: "Lun/Mer/Ven 8h-10h" },
    { id: 2, name: "L2 INFO", students: 30, schedule: "Mar/Jeu 10h-12h" },
    { id: 3, name: "L3 INFO", students: 20, schedule: "Lun/Mer/Ven 14h-16h" }
  ];

  return (
    <TeacherLayout>
      <h2 className="text-2xl font-bold text-slate-800 mb-8">Mes Classes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map(cls => (
          <div key={cls.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4">{cls.name}</h3>
            <div className="space-y-2 text-sm">
              <p className="text-slate-600">
                <span className="font-medium">Étudiants:</span> {cls.students}
              </p>
              <p className="text-slate-600">
                <span className="font-medium">Emploi:</span> {cls.schedule}
              </p>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                Voir les étudiants
              </button>
              <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm hover:bg-slate-200">
                Notes
              </button>
            </div>
          </div>
        ))}
      </div>
    </TeacherLayout>
  );
};

export default MyClasses;