import { useState } from "react";
import AdminLayout from "../../components/AdminLayout";

const Dashboard = () => {
  const [selectedSchool, setSelectedSchool] = useState("Lycée A");
  const schools = ["Lycée A", "Collège B", "Institut C"];

  const stats = [
    { label: "Étudiants", value: "1,248", change: "+12%", color: "#3b82f6", icon: "👥" },
    { label: "Enseignants", value: "89", change: "+5%", color: "#10b981", icon: "👨‍🏫" },
    { label: "Classes", value: "42", change: "+8%", color: "#f59e0b", icon: "📚" },
    { label: "Taux de réussite", value: "94%", change: "+3%", color: "#8b5cf6", icon: "📈" }
  ];

  const recentActivities = [
    { id: 1, user: "Marie Diop", action: "a ajouté un nouvel étudiant", time: "il y a 2 min", avatar: "👩‍🎓" },
    { id: 2, user: "Prof. Ba", action: "a soumis les notes", time: "il y a 15 min", avatar: "👨‍🏫" },
    { id: 3, user: "System", action: "Paiement reçu", time: "il y a 1 heure", avatar: "💰" },
    { id: 4, user: "Admin", action: "a créé une nouvelle classe", time: "il y a 2 heures", avatar: "⚙️" }
  ];

  return (
    <AdminLayout>
      <div style={{ maxWidth: '100%' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1e293b', marginBottom: '8px' }}>
            Tableau de bord
          </h1>
          <p style={{ color: '#64748b', fontSize: '16px' }}>
            Vue d'ensemble de votre établissement scolaire
          </p>
        </div>

        {/* School Selector */}
        <div style={{ marginBottom: '32px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
            Sélectionner l'établissement:
          </label>
          <select
            value={selectedSchool}
            onChange={(e) => setSelectedSchool(e.target.value)}
            style={{
              padding: '12px 16px',
              borderRadius: '12px',
              border: '1px solid #d1d5db',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              background: 'white',
              minWidth: '200px',
              cursor: 'pointer'
            }}
          >
            {schools.map(school => (
              <option key={school} value={school}>{school}</option>
            ))}
          </select>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}>
          {stats.map((stat, index) => (
            <div key={index} style={{
              background: 'white',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
              border: '1px solid #e5e7eb',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: `${stat.color}15`,
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px'
                }}>
                  {stat.icon}
                </div>
                <span style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: stat.color,
                  background: `${stat.color}15`,
                  padding: '4px 8px',
                  borderRadius: '6px'
                }}>
                  {stat.change}
                </span>
              </div>
              <div>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e293b', marginBottom: '4px' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '14px', color: '#64748b' }}>
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Two Column Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '24px'
        }}>
          {/* Chart Placeholder */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b', marginBottom: '16px' }}>
              Évolution des inscriptions
            </h3>
            <div style={{
              height: '300px',
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748b'
            }}>
              📊 Graphique des inscriptions
            </div>
          </div>

          {/* Recent Activities */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b', marginBottom: '16px' }}>
              Activités récentes
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentActivities.map((activity) => (
                <div key={activity.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  borderRadius: '8px',
                  background: '#f8fafc',
                  transition: 'all 0.2s ease'
                }}>
                  <div style={{ fontSize: '20px' }}>{activity.avatar}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '14px', color: '#1e293b', margin: 0 }}>
                      <strong>{activity.user}</strong> {activity.action}
                    </p>
                    <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;