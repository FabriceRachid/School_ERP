import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Sidebar = () => {
  const { logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { path: "/admin/dashboard", icon: "📊", label: "Dashboard", badge: null },
    { path: "/admin/students", icon: "👥", label: "Students", badge: "120" },
    { path: "/admin/teachers", icon: "👨‍🏫", label: "Teachers", badge: "15" },
    { path: "/admin/classes", icon: "📚", label: "Classes", badge: "8" },
    { path: "/admin/payments", icon: "💰", label: "Payments", badge: "3" },
    { path: "/admin/reports", icon: "📈", label: "Reports", badge: null },
  ];

  return (
    <div style={{
      width: '260px',
      background: 'white',
      color: '#374151',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      borderRight: '1px solid #e5e7eb',
      boxShadow: '2px 0 4px rgba(0, 0, 0, 0.05)'
    }}>
      {/* Header */}
      <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb', background: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            fontWeight: 'bold',
            color: 'white',
            boxShadow: '0 4px 8px rgba(59, 130, 246, 0.3)'
          }}>
            SE
          </div>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: '700', margin: 0, lineHeight: '1.2', color: '#1e293b' }}>
              School ERP
            </h1>
            <p style={{ fontSize: '11px', color: '#6b7280', margin: 0 }}>
              Admin Panel
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '16px 12px' }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {menuItems.map((item) => (
            <li key={item.path} style={{ marginBottom: '2px' }}>
              <Link
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: location.pathname === item.path ? '#3b82f6' : '#6b7280',
                  background: location.pathname === item.path 
                    ? '#eff6ff' 
                    : 'transparent',
                  transition: 'all 0.2s ease',
                  fontSize: '14px',
                  fontWeight: location.pathname === item.path ? '600' : '500',
                  border: location.pathname === item.path 
                    ? '1px solid #bfdbfe' 
                    : '1px solid transparent'
                }}
                onMouseOver={(e) => {
                  if (location.pathname !== item.path) {
                    e.target.style.background = '#f9fafb';
                    e.target.style.color = '#374151';
                  }
                }}
                onMouseOut={(e) => {
                  if (location.pathname !== item.path) {
                    e.target.style.background = 'transparent';
                    e.target.style.color = '#6b7280';
                  }
                }}
              >
                <span style={{ fontSize: '16px' }}>{item.icon}</span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge && (
                  <span style={{
                    background: location.pathname === item.path 
                      ? '#dbeafe' 
                      : '#f3f4f6',
                    color: location.pathname === item.path ? '#1e40af' : '#6b7280',
                    padding: '2px 6px',
                    borderRadius: '10px',
                    fontSize: '10px',
                    fontWeight: '600'
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
      <div style={{ padding: '16px 12px', borderTop: '1px solid #e5e7eb' }}>
        <button
          onClick={logout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 12px',
            borderRadius: '8px',
            background: 'transparent',
            color: '#ef4444',
            border: '1px solid #fecaca',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
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
          <span style={{ fontSize: '16px' }}>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;