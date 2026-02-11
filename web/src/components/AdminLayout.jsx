import Sidebar from "./Sidebar";

const AdminLayout = ({ children }) => (
  <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
    <Sidebar />
    <div style={{ 
      flex: 1,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden"
    }}>
      {/* Top Header */}
      <header style={{
        background: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <div>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#1e293b',
            margin: 0
          }}>
            Admin Dashboard
          </h2>
          <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0 0' }}>
            Manage your school efficiently
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: '1px solid #d1d5db',
            background: 'white',
            color: '#6b7280',
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            🔔
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', margin: 0 }}>
                Admin User
              </p>
              <p style={{ fontSize: '12px', color: '#10b981', margin: 0 }}>
                ● Online
              </p>
            </div>
            <div style={{
              width: '36px',
              height: '36px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '14px',
              boxShadow: '0 2px 4px rgba(245, 158, 11, 0.3)'
            }}>
              A
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main style={{ flex: 1, overflow: 'auto' }}>
        {children}
      </main>
    </div>
  </div>
);

export default AdminLayout;
