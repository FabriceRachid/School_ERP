import TeacherLayout from "../../components/TeacherLayout";
import { useState } from "react";

const Students = () => {
  const [selectedClass, setSelectedClass] = useState("all");
  
  const students = [
    { id: 1, name: "Adji Diop", class: "L1 INFO", grade: 15.5, attendance: "95%" },
    { id: 2, name: "Baba Fall", class: "L1 INFO", grade: 12.0, attendance: "88%" },
    { id: 3, name: "Coumba Ba", class: "L2 INFO", grade: 17.2, attendance: "92%" },
    { id: 4, name: "Demba Sarr", class: "L2 INFO", grade: 14.8, attendance: "78%" },
    { id: 5, name: "Fatou Ndiaye", class: "L3 INFO", grade: 16.5, attendance: "98%" }
  ];

  const filteredStudents = selectedClass === "all" 
    ? students 
    : students.filter(s => s.class === selectedClass);

  return (
    <TeacherLayout>
      <h2 className="text-2xl font-bold text-slate-800 mb-8">Gestion des Étudiants</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Filtrer par classe:
        </label>
        <select 
          value={selectedClass} 
          onChange={(e) => setSelectedClass(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">Toutes les classes</option>
          <option value="L1 INFO">L1 INFO</option>
          <option value="L2 INFO">L2 INFO</option>
          <option value="L3 INFO">L3 INFO</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="p-4 text-left font-bold text-slate-600">Nom</th>
              <th className="p-4 text-left font-bold text-slate-600">Classe</th>
              <th className="p-4 text-left font-bold text-slate-600">Moyenne</th>
              <th className="p-4 text-left font-bold text-slate-600">Présence</th>
              <th className="p-4 text-left font-bold text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map(student => (
              <tr key={student.id} className="border-b border-slate-50 hover:bg-slate-50">
                <td className="p-4 font-semibold text-slate-800">{student.name}</td>
                <td className="p-4 text-slate-600">{student.class}</td>
                <td className="p-4">
                  <span className={`font-bold ${
                    student.grade >= 15 ? 'text-green-600' : 
                    student.grade >= 12 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {student.grade}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    parseInt(student.attendance) >= 90 ? 'bg-green-100 text-green-700' : 
                    parseInt(student.attendance) >= 80 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {student.attendance}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200">
                      Voir
                    </button>
                    <button className="px-3 py-1 bg-slate-100 text-slate-700 rounded text-sm hover:bg-slate-200">
                      Noter
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </TeacherLayout>
  );
};

export default Students;