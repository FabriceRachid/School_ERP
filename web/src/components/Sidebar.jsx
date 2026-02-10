import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Sidebar = () => {
  const { logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { path: "/admin/dashboard", icon: "📊", label: "Tableau de bord", badge: null },
    { path: "/admin/students", icon: "👥", label: "Étudiants", badge: "120" },
    { path: "/admin/teachers", icon: "👨‍🏫", label: "Enseignants", badge: "15" },
    { path: "/admin/classes", icon: "📚", label: "Classes", badge: "8" },
    { path: "/admin/payments", icon: "💰", label: "Paiements", badge: "3" },
  ];

  return (
    <div style={{
      width: '280px',
      background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
      color: 'white',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      borderRight: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      {/* Header */}
      <div style={{ padding: '24px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            fontWeight: 'bold',
            boxShadow: '0 8px 16px rgba(59, 130, 246, 0.3)'
          }}>
            SE
          </div>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0, lineHeight: '1.2' }}>
              School ERP
            </h1>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
              Panel Administrateur
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
                  color: location.pathname === item.path ? 'white' : '#cbd5e1',
                  background: location.pathname === item.path 
                    ? 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' 
                    : 'transparent',
                  transition: 'all 0.3s ease',
                  fontSize: '14px',
                  fontWeight: location.pathname === item.path ? '600' : '500',
                  boxShadow: location.pathname === item.path 
                    ? '0 4px 12px rgba(59, 130, 246, 0.3)' 
                    : 'none'
                }}
                onMouseOver={(e) => {
                  if (location.pathname !== item.path) {
                    e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.target.style.color = 'white';
                  }
                }}
                onMouseOut={(e) => {
                  if (location.pathname !== item.path) {
                    e.target.style.background = 'transparent';
                    e.target.style.color = '#cbd5e1';
                  }
                }}
              >
                <span style={{ fontSize: '18px' }}>{item.icon}</span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge && (
                  <span style={{
                    background: location.pathname === item.path 
                      ? 'rgba(255, 255, 255, 0.2)' 
                      : 'rgba(59, 130, 246, 0.2)',
                    color: location.pathname === item.path ? 'white' : '#3b82f6',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: 'bold'
                  }}>
                    {item.badge}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div style={{ padding: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
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
            border: '1px solid rgba(239, 68, 68, 0.2)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontSize: '14px',
            fontWeight: '500'
          }}
          onMouseOver={(e) => {
            e.target.style.background = 'rgba(239, 68, 68, 0.1)';
            e.target.style.borderColor = 'rgba(239, 68, 68, 0.4)';
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'transparent';
            e.target.style.borderColor = 'rgba(239, 68, 68, 0.2)';
          }}
        >
          <span style={{ fontSize: '18px' }}>🚪</span>
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;