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
    setSubjects(getData("subjects") || [
      { id: 1, name: "Mathematics", code: "MATH101", department: "Mathematics", credits: 3 },
      { id: 2, name: "Physics", code: "PHYS101", department: "Science", credits: 4 }
    ]);
  }, []);

  const handleClassChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubjectChange = (e) => {
    setSubjectFormData({
      ...subjectFormData,
      [e.target.name]: e.target.value
    });
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
      classId: `CLS${String(classes.length + 1).padStart(4, '0')}`,
      createdAt: new Date().toLocaleDateString('en-US')
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
      createdAt: new Date().toLocaleDateString('en-US')
    };
    
    const updated = [...subjects, newSubject];
    setSubjects(updated);
    saveData("subjects", updated);
    
    setSubjectFormData({ name: "", code: "", department: "Science", credits: "" });
    setIsAddingSubject(false);
  };

  const removeClass = (id) => {
    if (confirm("Are you sure you want to remove this class?")) {
      const updated = classes.filter(c => c.id !== id);
      setClasses(updated);
      saveData("classes", updated);
    }
  };

  const removeSubject = (id) => {
    if (confirm("Are you sure you want to remove this subject?")) {
      const updated = subjects.filter(s => s.id !== id);
      setSubjects(updated);
      saveData("subjects", updated);
    }
  };

  const filteredClasses = classes.filter(cls =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.grade.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.teacher.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSubjects = subjects.filter(subject =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div style={{ padding: '24px', background: '#f8fafc', minHeight: '100vh' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>
            Classes & Subjects Management
          </h1>
          <p style={{ color: '#64748b', fontSize: '14px' }}>
            Manage classes, subjects, and academic programs
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#3b82f6', marginBottom: '4px' }}>
              {classes.length}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Total Classes</div>
          </div>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#10b981', marginBottom: '4px' }}>
              {subjects.length}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Total Subjects</div>
          </div>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#f59e0b', marginBottom: '4px' }}>
              {classes.reduce((sum, cls) => sum + cls.students, 0)}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Total Students</div>
          </div>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#8b5cf6', marginBottom: '4px' }}>
              {classes.reduce((sum, cls) => sum + cls.capacity, 0)}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Total Capacity</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '32px',
          borderBottom: '1px solid #e5e7eb'
        }}>
          {[
            { id: "classes", label: "Classes", icon: "📚" },
            { id: "subjects", label: "Subjects", icon: "📖" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 20px',
                borderRadius: '8px 8px 0 0',
                border: 'none',
                background: activeTab === tab.id ? 'white' : 'transparent',
                color: activeTab === tab.id ? '#f59e0b' : '#6b7280',
                fontSize: '14px',
                fontWeight: activeTab === tab.id ? '600' : '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                borderBottom: activeTab === tab.id ? '2px solid #f59e0b' : '2px solid transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseOver={(e) => {
                if (activeTab !== tab.id) {
                  e.target.style.background = '#f3f4f6';
                }
              }}
              onMouseOut={(e) => {
                if (activeTab !== tab.id) {
                  e.target.style.background = 'transparent';
                }
              }}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Actions Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              fontSize: '14px',
              minWidth: '300px',
              outline: 'none'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#f59e0b';
              e.target.style.boxShadow = '0 0 0 3px rgba(245, 158, 11, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d1d5db';
              e.target.style.boxShadow = 'none';
            }}
          />
          
          <button
            onClick={() => activeTab === "classes" ? setIsAddingClass(true) : setIsAddingSubject(true)}
            style={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 4px rgba(245, 158, 11, 0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 4px 8px rgba(245, 158, 11, 0.3)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 4px rgba(245, 158, 11, 0.2)';
            }}
          >
            <span style={{ fontSize: '16px' }}>
              {activeTab === "classes" ? "➕" : "📖"}
            </span>
            Add {activeTab === "classes" ? "Class" : "Subject"}
          </button>
        </div>

        {/* Classes Tab */}
        {activeTab === "classes" && (
          <>
            {/* Add Class Form */}
            {isAddingClass && (
              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '24px',
                marginBottom: '24px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e5e7eb'
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', marginBottom: '20px' }}>
                  Add New Class
                </h3>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '16px',
                  marginBottom: '20px'
                }}>
                  <input
                    type="text"
                    name="name"
                    placeholder="Class Name *"
                    value={formData.name}
                    onChange={handleClassChange}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#f59e0b';
                      e.target.style.boxShadow = '0 0 0 3px rgba(245, 158, 11, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  
                  <input
                    type="text"
                    name="grade"
                    placeholder="Grade Level *"
                    value={formData.grade}
                    onChange={handleClassChange}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#f59e0b';
                      e.target.style.boxShadow = '0 0 0 3px rgba(245, 158, 11, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  
                  <input
                    type="number"
                    name="capacity"
                    placeholder="Capacity *"
                    value={formData.capacity}
                    onChange={handleClassChange}
                    min="1"
                    style={{
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#f59e0b';
                      e.target.style.boxShadow = '0 0 0 3px rgba(245, 158, 11, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  
                  <input
                    type="text"
                    name="room"
                    placeholder="Room Number"
                    value={formData.room}
                    onChange={handleClassChange}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#f59e0b';
                      e.target.style.boxShadow = '0 0 0 3px rgba(245, 158, 11, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  
                  <input
                    type="text"
                    name="teacher"
                    placeholder="Assigned Teacher"
                    value={formData.teacher}
                    onChange={handleClassChange}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#f59e0b';
                      e.target.style.boxShadow = '0 0 0 3px rgba(245, 158, 11, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  
                  <input
                    type="text"
                    name="schedule"
                    placeholder="Schedule (e.g., Mon-Wed-Fri 9AM)"
                    value={formData.schedule}
                    onChange={handleClassChange}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#f59e0b';
                      e.target.style.boxShadow = '0 0 0 3px rgba(245, 158, 11, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
                
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={addClass}
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'translateY(-1px)';
                      e.target.style.boxShadow = '0 4px 8px rgba(16, 185, 129, 0.3)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    ✅ Save Class
                  </button>
                  
                  <button
                    onClick={() => {
                      setIsAddingClass(false);
                      setFormData({ name: "", grade: "", capacity: "", room: "", teacher: "", schedule: "" });
                    }}
                    style={{
                      background: 'white',
                      color: '#6b7280',
                      border: '1px solid #d1d5db',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = '#f9fafb';
                      e.target.style.borderColor = '#9ca3af';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = 'white';
                      e.target.style.borderColor = '#d1d5db';
                    }}
                  >
                    ❌ Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Classes Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '20px'
            }}>
              {filteredClasses.map((cls) => (
                <div key={cls.id} style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '20px',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e5e7eb',
                  transition: 'all 0.2s ease'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '20px',
                      fontWeight: 'bold'
                    }}>
                      📚
                    </div>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '10px',
                      fontWeight: '600',
                      background: '#f3f4f6',
                      color: '#6b7280'
                    }}>
                      {cls.grade}
                    </span>
                  </div>
                  
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
                    {cls.name}
                  </h3>
                  
                  <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>
                    ID: {cls.classId}
                  </p>
                  
                  {cls.room && (
                    <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
                      📍 Room {cls.room}
                    </p>
                  )}
                  
                  {cls.teacher && (
                    <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
                      👨‍🏫 {cls.teacher}
                    </p>
                  )}
                  
                  {cls.schedule && (
                    <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '12px' }}>
                      ⏰ {cls.schedule}
                    </p>
                  )}
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>Students</div>
                      <div style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>
                        {cls.students}/{cls.capacity}
                      </div>
                    </div>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: cls.students < cls.capacity ? '#10b981' : '#f59e0b'
                    }} />
                  </div>
                  </div>
                  
                  <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '16px' }}>
                    Created {cls.createdAt}
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      style={{
                        flex: 1,
                        padding: '8px',
                        borderRadius: '6px',
                        border: '1px solid #d1d5db',
                        background: 'white',
                        color: '#6b7280',
                        fontSize: '12px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.background = '#f3f4f6';
                        e.target.style.borderColor = '#9ca3af';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = 'white';
                        e.target.style.borderColor = '#d1d5db';
                      }}
                    >
                      📝 Edit
                    </button>
                    <button
                      onClick={() => removeClass(cls.id)}
                      style={{
                        flex: 1,
                        padding: '8px',
                        borderRadius: '6px',
                        border: '1px solid #fecaca',
                        background: 'white',
                        color: '#ef4444',
                        fontSize: '12px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.background = '#fef2f2';
                        e.target.style.borderColor = '#fca5a5';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = 'white';
                        e.target.style.borderColor = '#fecaca';
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Subjects Tab */}
        {activeTab === "subjects" && (
          <>
            {/* Add Subject Form */}
            {isAddingSubject && (
              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '24px',
                marginBottom: '24px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e5e7eb'
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', marginBottom: '20px' }}>
                  Add New Subject
                </h3>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '16px',
                  marginBottom: '20px'
                }}>
                  <input
                    type="text"
                    name="name"
                    placeholder="Subject Name *"
                    value={subjectFormData.name}
                    onChange={handleSubjectChange}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#f59e0b';
                      e.target.style.boxShadow = '0 0 0 3px rgba(245, 158, 11, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  
                  <input
                    type="text"
                    name="code"
                    placeholder="Subject Code *"
                    value={subjectFormData.code}
                    onChange={handleSubjectChange}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#f59e0b';
                      e.target.style.boxShadow = '0 0 0 3px rgba(245, 158, 11, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  
                  <select
                    name="department"
                    value={subjectFormData.department}
                    onChange={handleSubjectChange}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      fontSize: '14px',
                      background: 'white',
                      outline: 'none'
                    }}
                  >
                    <option value="Science">Science</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Literature">Literature</option>
                    <option value="History">History</option>
                    <option value="Arts">Arts</option>
                  </select>
                  
                  <input
                    type="number"
                    name="credits"
                    placeholder="Credits *"
                    value={subjectFormData.credits}
                    onChange={handleSubjectChange}
                    min="1"
                    style={{
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#f59e0b';
                      e.target.style.boxShadow = '0 0 0 3px rgba(245, 158, 11, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
                
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={addSubject}
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'translateY(-1px)';
                      e.target.style.boxShadow = '0 4px 8px rgba(16, 185, 129, 0.3)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    ✅ Save Subject
                  </button>
                  
                  <button
                    onClick={() => {
                      setIsAddingSubject(false);
                      setSubjectFormData({ name: "", code: "", department: "Science", credits: "" });
                    }}
                    style={{
                      background: 'white',
                      color: '#6b7280',
                      border: '1px solid #d1d5db',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = '#f9fafb';
                      e.target.style.borderColor = '#9ca3af';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = 'white';
                      e.target.style.borderColor = '#d1d5db';
                    }}
                  >
                    ❌ Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Subjects Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '20px'
            }}>
              {filteredSubjects.map((subject) => (
                <div key={subject.id} style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '20px',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e5e7eb',
                  transition: 'all 0.2s ease'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '20px',
                      fontWeight: 'bold'
                    }}>
                      📖
                    </div>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '10px',
                      fontWeight: '600',
                      background: '#f3f4f6',
                      color: '#6b7280'
                    }}>
                      {subject.credits} Credits
                    </span>
                  </div>
                  
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
                    {subject.name}
                  </h3>
                  
                  <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
                    Code: {subject.code}
                  </p>
                  
                  <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '12px' }}>
                    Department: {subject.department}
                  </p>
                  
                  <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '16px' }}>
                    Created {subject.createdAt}
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      style={{
                        flex: 1,
                        padding: '8px',
                        borderRadius: '6px',
                        border: '1px solid #d1d5db',
                        background: 'white',
                        color: '#6b7280',
                        fontSize: '12px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.background = '#f3f4f6';
                        e.target.style.borderColor = '#9ca3af';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = 'white';
                        e.target.style.borderColor = '#d1d5db';
                      }}
                    >
                      📝 Edit
                    </button>
                    <button
                      onClick={() => removeSubject(subject.id)}
                      style={{
                        flex: 1,
                        padding: '8px',
                        borderRadius: '6px',
                        border: '1px solid #fecaca',
                        background: 'white',
                        color: '#ef4444',
                        fontSize: '12px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.background = '#fef2f2';
                        e.target.style.borderColor = '#fca5a5';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = 'white';
                        e.target.style.borderColor = '#fecaca';
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Empty State */}
        {((activeTab === "classes" && filteredClasses.length === 0) || 
          (activeTab === "subjects" && filteredSubjects.length === 0)) && (
          <div style={{
            textAlign: 'center',
            padding: '64px 32px',
            background: 'white',
            borderRadius: '12px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>
              {activeTab === "classes" ? "📚" : "📖"}
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
              No {activeTab} found
            </h3>
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>
              {searchTerm ? 'Try adjusting your search terms' : `Start by adding your first ${activeTab.slice(0, -1)}`}
            </p>
            {!searchTerm && (
              <button
                onClick={() => activeTab === "classes" ? setIsAddingClass(true) : setIsAddingSubject(true)}
                style={{
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                {activeTab === "classes" ? "📚" : "📖"} Add First {activeTab.slice(0, -1)}
              </button>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
