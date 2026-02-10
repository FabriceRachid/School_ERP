import { useAuth } from "../hooks/useAuth";
import { Link, useLocation } from "react-router-dom";

const TeacherLayout = ({ children }) => {
  const { logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { path: "/teacher/dashboard", icon: "📊", label: "Tableau de bord" },
    { path: "/teacher/grades", icon: "📝", label: "Notes" },
    { path: "/teacher/classes", icon: "📚", label: "Mes Classes" },
    { path: "/teacher/students", icon: "👥", label: "Étudiants" },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f8fafc' }}>
      {/* Sidebar */}
      <div style={{
        width: '280px',
        background: 'white',
        borderRight: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              fontWeight: 'bold',
              color: 'white',
              boxShadow: '0 8px 16px rgba(16, 185, 129, 0.3)'
            }}>
              TC
            </div>
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0, color: '#1e293b', lineHeight: '1.2' }}>
                Teacher Panel
              </h1>
              <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
                Espace Enseignant
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '16px' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {menuItems.map((item) => (
              <li key={item.path} style={{ marginBottom: '4px' }}>
                <Link
                  to={item.path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    color: location.pathname === item.path ? '#059669' : '#64748b',
                    background: location.pathname === item.path 
                      ? 'rgba(16, 185, 129, 0.1)' 
                      : 'transparent',
                    transition: 'all 0.3s ease',
                    fontSize: '14px',
                    fontWeight: location.pathname === item.path ? '600' : '500',
                    border: location.pathname === item.path 
                      ? '1px solid rgba(16, 185, 129, 0.2)' 
                      : '1px solid transparent'
                  }}
                  onMouseOver={(e) => {
                    if (location.pathname !== item.path) {
                      e.target.style.background = '#f1f5f9';
                      e.target.style.color = '#1e293b';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (location.pathname !== item.path) {
                      e.target.style.background = 'transparent';
                      e.target.style.color = '#64748b';
                    }
                  }}
                >
                  <span style={{ fontSize: '18px' }}>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div style={{ padding: '16px', borderTop: '1px solid #e2e8f0' }}>
          <button
            onClick={logout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '12px',
              background: 'transparent',
              color: '#ef4444',
              border: '1px solid #fecaca',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '14px',
              fontWeight: '500'
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#fef2f2';
              e.target.style.borderColor = '#fca5a5';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.borderColor = '#fecaca';
            }}
          >
            <span style={{ fontSize: '18px' }}>🚪</span>
            <span>Déconnexion</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top Header */}
        <header style={{
          background: 'white',
          borderBottom: '1px solid #e2e8f0',
          padding: '16px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#1e293b',
              margin: 0
            }}>
              {menuItems.find(item => item.path === location.pathname)?.label || "Tableau de bord"}
            </h2>
            <p style={{ fontSize: '14px', color: '#64748b', margin: '4px 0 0 0' }}>
              Bienvenue dans votre espace de travail
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', margin: 0 }}>
                Professeur
              </p>
              <p style={{ fontSize: '12px', color: '#10b981', margin: 0 }}>
                ● En ligne
              </p>
            </div>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '16px',
              boxShadow: '0 4px 8px rgba(16, 185, 129, 0.3)'
            }}>
              P
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, overflow: 'auto', padding: '32px' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default TeacherLayout;