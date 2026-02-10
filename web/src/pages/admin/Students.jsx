import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import { getData, saveData } from "../../services/storage";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [classe, setClasse] = useState("");

  useEffect(() => {
    setStudents(getData("students"));
  }, []);

  const addStudent = () => {
    if (!name || !classe) return;
    const updated = [...students, { id: Date.now(), name, classe }];
    setStudents(updated);
    saveData("students", updated);
    setName(""); setClasse("");
  };

  const remove = (id) => {
    const updated = students.filter(s => s.id !== id);
    setStudents(updated);
    saveData("students", updated);
  };

  return (
    <AdminLayout>
      <h2>Students Management</h2>
      <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
      <input placeholder="Class" value={classe} onChange={e => setClasse(e.target.value)} />
      <button onClick={addStudent}>Add</button>

      <ul>
        {students.map(s => (
          <li key={s.id}>
            {s.name} - {s.classe}
            <button onClick={() => remove(s.id)}>X</button>
          </li>
        ))}
      </ul>
    </AdminLayout>
  );
};

export default Students;
