import { useState } from "react";
import AdminLayout from "../../../components/AdminLayout";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [schoolSettings, setSchoolSettings] = useState({
    schoolName: "Excellence Academy",
    schoolAddress: "123 Education Street, Learning City, LC 12345",
    schoolPhone: "+1 (555) 123-4567",
    schoolEmail: "info@excellenceacademy.edu",
    principalName: "Dr. Jane Smith",
    academicYear: "2024-2025",
    timezone: "America/New_York",
    currency: "USD",
    language: "English"
  });

  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    allowRegistrations: true,
    emailNotifications: true,
    smsNotifications: false,
    backupFrequency: "daily",
    sessionTimeout: "30",
    maxFileSize: "10",
    allowedFileTypes: "pdf,doc,docx,jpg,png"
  });

  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: "light",
    primaryColor: "#3b82f6",
    accentColor: "#f59e0b",
    sidebarCollapsed: false,
    compactMode: false,
    showAnimations: true
  });

  const handleSchoolChange = (e) => {
    setSchoolSettings({
      ...schoolSettings,
      [e.target.name]: e.target.value
    });
  };

  const handleSystemChange = (e) => {
    setSystemSettings({
      ...systemSettings,
      [e.target.name]: e.target.type === "checkbox" ? e.target.checked : e.target.value
    });
  };

  const handleAppearanceChange = (e) => {
    setAppearanceSettings({
      ...appearanceSettings,
      [e.target.name]: e.target.type === "checkbox" ? e.target.checked : e.target.value
    });
  };

  const saveSettings = () => {
    alert("Settings saved successfully!");
  };

  return (
    <AdminLayout>
      <div style={{ padding: '24px', background: '#f8fafc', minHeight: '100vh' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>
            System Settings
          </h1>
          <p style={{ color: '#64748b', fontSize: '14px' }}>
            Configure system-wide settings and preferences
          </p>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '32px',
          borderBottom: '1px solid #e5e7eb'
        }}>
          {[
            { id: "general", label: "General", icon: "⚙️" },
            { id: "school", label: "School Info", icon: "🏫" },
            { id: "system", label: "System", icon: "🖥️" },
            { id: "appearance", label: "Appearance", icon: "🎨" },
            { id: "backup", label: "Backup", icon: "💾" }
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

        {/* Tab Content */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '32px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}>
          {/* General Settings */}
          {activeTab === "general" && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b', marginBottom: '24px' }}>
                General Settings
              </h2>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '24px',
                marginBottom: '32px'
              }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Application Name
                  </label>
                  <input
                    type="text"
                    name="appName"
                    defaultValue="School ERP"
                    style={{
                      width: '100%',
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
                
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Default Language
                  </label>
                  <select
                    name="language"
                    value={schoolSettings.language}
                    onChange={handleSchoolChange}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      fontSize: '14px',
                      background: 'white',
                      outline: 'none'
                    }}
                  >
                    <option value="English">English</option>
                    <option value="French">French</option>
                    <option value="Spanish">Spanish</option>
                    <option value="Arabic">Arabic</option>
                  </select>
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Timezone
                  </label>
                  <select
                    name="timezone"
                    value={schoolSettings.timezone}
                    onChange={handleSchoolChange}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      fontSize: '14px',
                      background: 'white',
                      outline: 'none'
                    }}
                  >
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  </select>
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Currency
                  </label>
                  <select
                    name="currency"
                    value={schoolSettings.currency}
                    onChange={handleSchoolChange}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      fontSize: '14px',
                      background: 'white',
                      outline: 'none'
                    }}
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="XOF">XOF - CFA Franc</option>
                  </select>
                </div>
              </div>
              
              <button
                onClick={saveSettings}
                style={{
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
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
                  e.target.style.boxShadow = '0 4px 8px rgba(245, 158, 11, 0.3)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                💾 Save Settings
              </button>
            </div>
          )}

          {/* School Info */}
          {activeTab === "school" && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b', marginBottom: '24px' }}>
                School Information
              </h2>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '24px',
                marginBottom: '32px'
              }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    School Name
                  </label>
                  <input
                    type="text"
                    name="schoolName"
                    value={schoolSettings.schoolName}
                    onChange={handleSchoolChange}
                    style={{
                      width: '100%',
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
                
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    School Email
                  </label>
                  <input
                    type="email"
                    name="schoolEmail"
                    value={schoolSettings.schoolEmail}
                    onChange={handleSchoolChange}
                    style={{
                      width: '100%',
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
                
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    School Phone
                  </label>
                  <input
                    type="tel"
                    name="schoolPhone"
                    value={schoolSettings.schoolPhone}
                    onChange={handleSchoolChange}
                    style={{
                      width: '100%',
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
                
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Principal Name
                  </label>
                  <input
                    type="text"
                    name="principalName"
                    value={schoolSettings.principalName}
                    onChange={handleSchoolChange}
                    style={{
                      width: '100%',
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
                
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    School Address
                  </label>
                  <textarea
                    name="schoolAddress"
                    value={schoolSettings.schoolAddress}
                    onChange={handleSchoolChange}
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      fontSize: '14px',
                      outline: 'none',
                      resize: 'vertical'
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
              </div>
              
              <button
                onClick={saveSettings}
                style={{
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
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
                  e.target.style.boxShadow = '0 4px 8px rgba(245, 158, 11, 0.3)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                💾 Save School Info
              </button>
            </div>
          )}

          {/* System Settings */}
          {activeTab === "system" && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b', marginBottom: '24px' }}>
                System Configuration
              </h2>
              
              <div style={{ maxWidth: '600px' }}>
                {[
                  { key: 'maintenanceMode', label: 'Maintenance Mode', description: 'Put the system in maintenance mode' },
                  { key: 'allowRegistrations', label: 'Allow Registrations', description: 'Enable new user registrations' },
                  { key: 'emailNotifications', label: 'Email Notifications', description: 'Send system notifications via email' },
                  { key: 'smsNotifications', label: 'SMS Notifications', description: 'Send notifications via SMS' }
                ].map((setting) => (
                  <div
                    key={setting.key}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '16px 0',
                      borderBottom: '1px solid #f3f4f6'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: '#1e293b', marginBottom: '4px' }}>
                        {setting.label}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        {setting.description}
                      </div>
                    </div>
                    <button
                      name={setting.key}
                      checked={systemSettings[setting.key]}
                      onChange={handleSystemChange}
                      style={{
                        width: '48px',
                        height: '24px',
                        borderRadius: '12px',
                        border: 'none',
                        background: systemSettings[setting.key] ? '#10b981' : '#d1d5db',
                        cursor: 'pointer',
                        position: 'relative',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: 'white',
                        position: 'absolute',
                        top: '2px',
                        left: systemSettings[setting.key] ? '26px' : '2px',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                      }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Appearance */}
          {activeTab === "appearance" && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b', marginBottom: '24px' }}>
                Appearance Settings
              </h2>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '24px'
              }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Theme
                  </label>
                  <select
                    name="theme"
                    value={appearanceSettings.theme}
                    onChange={handleAppearanceChange}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      fontSize: '14px',
                      background: 'white',
                      outline: 'none'
                    }}
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Primary Color
                  </label>
                  <input
                    type="color"
                    name="primaryColor"
                    value={appearanceSettings.primaryColor}
                    onChange={handleAppearanceChange}
                    style={{
                      width: '100%',
                      height: '44px',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      cursor: 'pointer'
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Backup */}
          {activeTab === "backup" && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b', marginBottom: '24px' }}>
                Backup & Recovery
              </h2>
              
              <div style={{
                background: '#f8fafc',
                borderRadius: '12px',
                padding: '24px',
                marginBottom: '24px'
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', marginBottom: '16px' }}>
                  Last Backup
                </h3>
                <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>
                  December 10, 2024 at 2:30 AM
                </p>
                <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '20px' }}>
                  Size: 245.3 MB
                </p>
                <button
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
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
                  🔄 Create Backup Now
                </button>
              </div>
              
              <div style={{
                background: '#fef3c7',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid #f59e0b'
              }}>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#92400e', margin: '0 0 8px 0' }}>
                  💡 Backup Tip
                </h4>
                <p style={{ fontSize: '13px', color: '#78350f', margin: 0 }}>
                  Regular backups ensure your data is safe. Consider scheduling automatic backups during off-peak hours.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Settings;
