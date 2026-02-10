import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import { getData, saveData } from "../../services/storage";

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    setTeachers(getData("teachers"));
  }, []);

  const addTeacher = () => {
    if (!name) return;
    const updated = [...teachers, { id: Date.now(), name }];
    setTeachers(updated);
    saveData("teachers", updated);
    setName("");
  };

  const remove = (id) => {
    const updated = teachers.filter(t => t.id !== id);
    setTeachers(updated);
    saveData("teachers", updated);
  };

  return (
    <AdminLayout>
      <h2>Teachers Management</h2>
      <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
      <button onClick={addTeacher}>Add</button>

      <ul>
        {teachers.map(t => (
          <li key={t.id}>
            {t.name}
            <button onClick={() => remove(t.id)}>X</button>
          </li>
        ))}
      </ul>
    </AdminLayout>
  );
};

export default Teachers;
