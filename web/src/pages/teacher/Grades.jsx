import { useState } from "react";
import TeacherLayout from "../../components/TeacherLayout";
import { getData, saveData } from "../../services/storage";

const Grades = () => {
  const [student, setStudent] = useState("");
  const [grade, setGrade] = useState("");
  const grades = getData("grades");

  const saveGrade = () => {
    if (!student || !grade) return;
    saveData("grades", [...grades, { student, grade }]);
    setStudent(""); setGrade("");
  };

  return (
    <TeacherLayout>
      <h2>Enter Grades</h2>
      <input placeholder="Student name" value={student} onChange={e => setStudent(e.target.value)} />
      <input placeholder="Grade" value={grade} onChange={e => setGrade(e.target.value)} />
      <button onClick={saveGrade}>Save</button>

      <ul>
        {grades.map((g, i) => (
          <li key={i}>{g.student} : {g.grade}</li>
        ))}
      </ul>
    </TeacherLayout>
  );
};

export default Grades;
