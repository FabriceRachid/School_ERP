import { useEffect, useState } from "react";
import AdminLayout from "../../../components/AdminLayout";
import { getData, saveData } from "../../../services/storage";

const Parents = () => {
  const [parents, setParents] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    studentName: "",
    relationship: "Father"
  });
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setParents(getData("parents") || []);
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const addParent = () => {
    if (!formData.name || !formData.studentName) {
      alert("Please fill in parent name and student name!");
      return;
    }
    
    const newParent = {
      id: Date.now(),
      ...formData,
      registrationDate: new Date().toLocaleDateString('en-US'),
      parentId: `PR${String(parents.length + 1).padStart(4, '0')}`
    };
    
    const updated = [...parents, newParent];
    setParents(updated);
    saveData("parents", updated);
    
    setFormData({ name: "", email: "", phone: "", studentName: "", relationship: "Father" });
    setIsAdding(false);
  };

  const removeParent = (id) => {
    if (confirm("Are you sure you want to remove this parent?")) {
      const updated = parents.filter(p => p.id !== id);
      setParents(updated);
      saveData("parents", updated);
    }
  };

  const filteredParents = parents.filter(parent =>
    parent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    parent.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    parent.parentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div style={{ padding: '24px', background: '#f8fafc', minHeight: '100vh' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>
            Parents Management
          </h1>
          <p style={{ color: '#64748b', fontSize: '14px' }}>
            Manage parent information and communication
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
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#f59e0b', marginBottom: '4px' }}>
              {parents.length}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Total Parents</div>
          </div>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#10b981', marginBottom: '4px' }}>
              {parents.filter(p => p.email).length}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Email Verified</div>
          </div>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#8b5cf6', marginBottom: '4px' }}>
              {new Set(parents.map(p => p.studentName)).size}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Unique Students</div>
          </div>
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
            placeholder="Search parents..."
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
            onClick={() => setIsAdding(true)}
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
            <span style={{ fontSize: '16px' }}>👨‍👩‍👧‍👦</span>
            Add Parent
          </button>
        </div>

        {/* Add Parent Form */}
        {isAdding && (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', marginBottom: '20px' }}>
              Add New Parent
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
                placeholder="Parent Name *"
                value={formData.name}
                onChange={handleInputChange}
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
                name="studentName"
                placeholder="Student Name *"
                value={formData.studentName}
                onChange={handleInputChange}
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
                name="relationship"
                value={formData.relationship}
                onChange={handleInputChange}
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  fontSize: '14px',
                  background: 'white',
                  outline: 'none'
                }}
              >
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Guardian">Guardian</option>
              </select>
              
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
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
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleInputChange}
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
                onClick={addParent}
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
                ✅ Save Parent
              </button>
              
              <button
                onClick={() => {
                  setIsAdding(false);
                  setFormData({ name: "", email: "", phone: "", studentName: "", relationship: "Father" });
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

        {/* Parents Table */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e5e7eb' }}>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                    Parent
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                    Parent ID
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                    Student
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                    Relationship
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                    Email
                  </th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                    Phone
                  </th>
                  <th style={{ padding: '16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredParents.map((parent) => (
                  <tr key={parent.id} style={{ borderBottom: '1px solid #f3f4f6', transition: 'all 0.2s ease' }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '16px'
                        }}>
                          {parent.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>
                            {parent.name}
                          </div>
                          <div style={{ fontSize: '12px', color: '#6b7280' }}>
                            Joined {parent.registrationDate}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px', fontSize: '14px', color: '#4b5563', fontWeight: '500' }}>
                      {parent.parentId}
                    </td>
                    <td style={{ padding: '16px', fontSize: '14px', color: '#4b5563' }}>
                      {parent.studentName}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        background: '#fef3c7',
                        color: '#92400e'
                      }}>
                        {parent.relationship}
                      </span>
                    </td>
                    <td style={{ padding: '16px', fontSize: '14px', color: '#4b5563' }}>
                      {parent.email || '-'}
                    </td>
                    <td style={{ padding: '16px', fontSize: '14px', color: '#4b5563' }}>
                      {parent.phone || '-'}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button
                          style={{
                            padding: '8px',
                            borderRadius: '8px',
                            border: '1px solid #d1d5db',
                            background: 'white',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            fontSize: '14px'
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
                          ✏️
                        </button>
                        <button
                          onClick={() => removeParent(parent.id)}
                          style={{
                            padding: '8px',
                            borderRadius: '8px',
                            border: '1px solid #fecaca',
                            background: 'white',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            fontSize: '14px'
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
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredParents.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '64px 32px',
            background: 'white',
            borderRadius: '12px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>👨‍👩‍👧‍👦</div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
              No parents found
            </h3>
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>
              {searchTerm ? 'Try adjusting your search terms' : 'Start by adding your first parent'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setIsAdding(true)}
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
                👨‍👩‍👧‍👦 Add First Parent
              </button>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Parents;
