import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import { getData, saveData } from "../../services/storage";

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    grade: "",
    capacity: "",
    room: "",
    teacher: "",
    schedule: ""
  });
  const [subjectFormData, setSubjectFormData] = useState({
    name: "",
    code: "",
    department: "Science",
    credits: ""
  });
  const [isAddingClass, setIsAddingClass] = useState(false);
  const [isAddingSubject, setIsAddingSubject] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("classes");

  useEffect(() => {
    setClasses(getData("classes") || []);
    setSubjects(
      getData("subjects") || [
        { id: 1, name: "Mathematics", code: "MATH101", department: "Mathematics", credits: 3 },
        { id: 2, name: "Physics", code: "PHYS101", department: "Science", credits: 4 }
      ]
    );
  }, []);

  const handleClassChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubjectChange = (e) => {
    setSubjectFormData({ ...subjectFormData, [e.target.name]: e.target.value });
  };

  const addClass = () => {
    if (!formData.name || !formData.grade) {
      alert("Please fill in class name and grade!");
      return;
    }

    const newClass = {
      id: Date.now(),
      ...formData,
      capacity: parseInt(formData.capacity),
      students: 0,
      classId: `CLS${String(classes.length + 1).padStart(4, "0")}`,
      createdAt: new Date().toLocaleDateString("en-US")
    };

    const updated = [...classes, newClass];
    setClasses(updated);
    saveData("classes", updated);

    setFormData({ name: "", grade: "", capacity: "", room: "", teacher: "", schedule: "" });
    setIsAddingClass(false);
  };

  const addSubject = () => {
    if (!subjectFormData.name || !subjectFormData.code) {
      alert("Please fill in subject name and code!");
      return;
    }

    const newSubject = {
      id: Date.now(),
      ...subjectFormData,
      credits: parseInt(subjectFormData.credits),
      createdAt: new Date().toLocaleDateString("en-US")
    };

    const updated = [...subjects, newSubject];
    setSubjects(updated);
    saveData("subjects", updated);

    setSubjectFormData({ name: "", code: "", department: "Science", credits: "" });
    setIsAddingSubject(false);
  };

  const removeClass = (id) => {
    if (confirm("Are you sure you want to remove this class?")) {
      const updated = classes.filter((c) => c.id !== id);
      setClasses(updated);
      saveData("classes", updated);
    }
  };

  const removeSubject = (id) => {
    if (confirm("Are you sure you want to remove this subject?")) {
      const updated = subjects.filter((s) => s.id !== id);
      setSubjects(updated);
      saveData("subjects", updated);
    }
  };

  const filteredClasses = classes.filter(
    (cls) =>
      cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.grade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.teacher.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSubjects = subjects.filter(
    (subject) =>
      subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div style={{ padding: "24px", background: "#f8fafc", minHeight: "100vh" }}>

        {/* HEADER */}
        <h1 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "24px" }}>
          Classes & Subjects Management
        </h1>

        {/* TABS */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
          {["classes", "subjects"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "10px 20px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                background: activeTab === tab ? "#f59e0b" : "#e5e7eb",
                color: activeTab === tab ? "white" : "#374151"
              }}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {/* SEARCH + ADD */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px" }}>
          <input
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: "10px", width: "300px" }}
          />

          <button
            onClick={() =>
              activeTab === "classes"
                ? setIsAddingClass(true)
                : setIsAddingSubject(true)
            }
            style={{
              padding: "10px 20px",
              background: "#f59e0b",
              border: "none",
              color: "white",
              borderRadius: "8px"
            }}
          >
            Add {activeTab === "classes" ? "Class" : "Subject"}
          </button>
        </div>

        {/* CLASSES */}
        {activeTab === "classes" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
            {filteredClasses.map((cls) => (
              <div key={cls.id} style={{ background: "white", padding: "20px", borderRadius: "12px" }}>
                <h3>{cls.name}</h3>
                <p>Grade: {cls.grade}</p>
                <p>Teacher: {cls.teacher || "N/A"}</p>
                <p>
                  Students: {cls.students}/{cls.capacity}
                </p>
                <p style={{ fontSize: "12px", color: "#6b7280" }}>
                  Created {cls.createdAt}
                </p>

                <button onClick={() => removeClass(cls.id)} style={{ marginTop: "10px", color: "red" }}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}

        {/* SUBJECTS */}
        {activeTab === "subjects" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
            {filteredSubjects.map((subject) => (
              <div key={subject.id} style={{ background: "white", padding: "20px", borderRadius: "12px" }}>
                <h3>{subject.name}</h3>
                <p>Code: {subject.code}</p>
                <p>Department: {subject.department}</p>
                <p>Credits: {subject.credits}</p>

                <button onClick={() => removeSubject(subject.id)} style={{ marginTop: "10px", color: "red" }}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Classes;
