import { useState } from "react";
import AdminLayout from "../../../components/AdminLayout";

const Account = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState({
    firstName: "Admin",
    lastName: "User",
    email: "admin@schoolerp.com",
    phone: "+1 234 567 8900",
    role: "Super Administrator",
    department: "IT Administration",
    bio: "Experienced school administrator with over 10 years of experience in educational management systems."
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    weeklyReports: true,
    criticalAlerts: true
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleNotificationChange = (key) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key]
    });
  };

  const saveProfile = () => {
    alert("Profile updated successfully!");
  };

  const changePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    alert("Password changed successfully!");
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const saveNotifications = () => {
    alert("Notification preferences saved!");
  };

  return (
    <AdminLayout>
      <div style={{ padding: '24px', background: '#f8fafc', minHeight: '100vh' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>
            Account Settings
          </h1>
          <p style={{ color: '#64748b', fontSize: '14px' }}>
            Manage your account settings and preferences
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
            { id: "profile", label: "Profile", icon: "👤" },
            { id: "security", label: "Security", icon: "🔒" },
            { id: "notifications", label: "Notifications", icon: "🔔" },
            { id: "billing", label: "Billing", icon: "💳" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 20px',
                borderRadius: '8px 8px 0 0',
                border: 'none',
                background: activeTab === tab.id ? 'white' : 'transparent',
                color: activeTab === tab.id ? '#3b82f6' : '#6b7280',
                fontSize: '14px',
                fontWeight: activeTab === tab.id ? '600' : '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                borderBottom: activeTab === tab.id ? '2px solid #3b82f6' : '2px solid transparent',
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
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b', marginBottom: '24px' }}>
                Profile Information
              </h2>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '24px',
                marginBottom: '32px'
              }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#3b82f6';
                      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#3b82f6';
                      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#3b82f6';
                      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#3b82f6';
                      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Role
                  </label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#3b82f6';
                      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Department
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#3b82f6';
                      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>
              
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
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
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              
              <button
                onClick={saveProfile}
                style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
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
                  e.target.style.boxShadow = '0 4px 8px rgba(59, 130, 246, 0.3)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                💾 Save Profile
              </button>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b', marginBottom: '24px' }}>
                Change Password
              </h2>
              
              <div style={{ maxWidth: '500px' }}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#3b82f6';
                      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
                
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#3b82f6';
                      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
                
                <div style={{ marginBottom: '32px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#3b82f6';
                      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
                
                <button
                  onClick={changePassword}
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
                  🔐 Change Password
                </button>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b', marginBottom: '24px' }}>
                Notification Preferences
              </h2>
              
              <div style={{ maxWidth: '600px' }}>
                {Object.entries(notifications).map(([key, value]) => (
                  <div
                    key={key}
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
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        {key === 'emailNotifications' && 'Receive email updates about your account'}
                        {key === 'smsNotifications' && 'Get SMS alerts for important notifications'}
                        {key === 'pushNotifications' && 'Browser push notifications for real-time updates'}
                        {key === 'weeklyReports' && 'Weekly summary reports every Monday'}
                        {key === 'criticalAlerts' && 'Immediate alerts for critical system events'}
                      </div>
                    </div>
                    <button
                      onClick={() => handleNotificationChange(key)}
                      style={{
                        width: '48px',
                        height: '24px',
                        borderRadius: '12px',
                        border: 'none',
                        background: value ? '#10b981' : '#d1d5db',
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
                        left: value ? '26px' : '2px',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                      }} />
                    </button>
                  </div>
                ))}
                
                <div style={{ marginTop: '32px' }}>
                  <button
                    onClick={saveNotifications}
                    style={{
                      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
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
                      e.target.style.boxShadow = '0 4px 8px rgba(59, 130, 246, 0.3)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    💾 Save Preferences
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Billing Tab */}
          {activeTab === "billing" && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b', marginBottom: '24px' }}>
                Billing Information
              </h2>
              
              <div style={{
                background: '#f8fafc',
                borderRadius: '12px',
                padding: '24px',
                marginBottom: '32px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', margin: 0 }}>
                      Current Plan
                    </h3>
                    <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 0 0' }}>
                      Professional Plan - $99/month
                    </p>
                  </div>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    background: '#10b981',
                    color: 'white'
                  }}>
                    Active
                  </span>
                </div>
                
                <div style={{ fontSize: '14px', color: '#4b5563' }}>
                  <p>Next billing date: January 15, 2025</p>
                  <p>Auto-renewal: Enabled</p>
                </div>
              </div>
              
              <div style={{
                background: '#fef3c7',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid #f59e0b'
              }}>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#92400e', margin: '0 0 8px 0' }}>
                  💡 Upgrade Available
                </h4>
                <p style={{ fontSize: '13px', color: '#78350f', margin: 0 }}>
                  Upgrade to Enterprise Plan for unlimited users and advanced features.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Account;
