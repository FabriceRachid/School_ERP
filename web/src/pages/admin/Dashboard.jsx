import { useState } from "react";
import AdminLayout from "../../components/AdminLayout";

const Dashboard = () => {
  const [selectedSchool, setSelectedSchool] = useState("Lycée A");
  const schools = ["Lycée A", "Collège B", "Institut C"];

  const stats = [
    { label: "Total Students", value: "2,543", change: "+12%", color: "#3b82f6", icon: "👥", detail: "Active now" },
    { label: "Total Teachers", value: "145", change: "+5%", color: "#10b981", icon: "👨‍🏫", detail: "8 departments" },
    { label: "Total Courses", value: "42", change: "+8%", color: "#f59e0b", icon: "📚", detail: "12 categories" },
    { label: "New Students", value: "94", change: "+3%", color: "#8b5cf6", icon: "📈", detail: "This month" }
  ];

  const recentActivities = [
    { id: 1, user: "Bajrang Singh", action: "Added new student", time: "2 min ago", avatar: "👨‍🎓", status: "success" },
    { id: 2, user: "Sara Taylor", action: "Submitted grades", time: "15 min ago", avatar: "👩‍🏫", status: "info" },
    { id: 3, user: "System", action: "Payment received", time: "1 hour ago", avatar: "💰", status: "success" },
    { id: 4, user: "Admin", action: "Created new class", time: "2 hours ago", avatar: "⚙️", status: "warning" }
  ];

  const upcomingEvents = [
    { id: 1, title: "Parent Teacher Meeting", date: "Dec 15, 2024", time: "10:00 AM", type: "meeting" },
    { id: 2, title: "Annual Science Fair", date: "Dec 20, 2024", time: "9:00 AM", type: "event" },
    { id: 3, title: "Winter Break Begins", date: "Dec 23, 2024", time: "All Day", type: "holiday" }
  ];

  return (
    <AdminLayout>
      <div style={{ maxWidth: '100%', padding: '24px', background: '#f8fafc', minHeight: '100vh' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>
            Dashboard
          </h1>
          <p style={{ color: '#64748b', fontSize: '14px' }}>
            Welcome to School ERP Management System
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}>
          {stats.map((stat, index) => (
            <div key={index} style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb',
              transition: 'all 0.2s ease',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: `${stat.color}15`,
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px'
                }}>
                  {stat.icon}
                </div>
                <span style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  color: stat.color === "#10b981" ? "#10b981" : "#64748b",
                  background: stat.color === "#10b981" ? "#d1fae5" : "#f3f4f6",
                  padding: '2px 6px',
                  borderRadius: '4px'
                }}>
                  {stat.change}
                </span>
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b', marginBottom: '2px' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '2px' }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: '10px', color: '#9ca3af' }}>
                  {stat.detail}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '20px'
        }}>
          {/* Chart Section */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', margin: 0 }}>
                Students Overview
              </h3>
              <select style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                fontSize: '12px',
                color: '#6b7280',
                background: 'white'
              }}>
                <option>This Week</option>
                <option>This Month</option>
                <option>This Year</option>
              </select>
            </div>
            <div style={{
              height: '280px',
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748b',
              fontSize: '14px'
            }}>
              📊 Chart visualization area
            </div>
          </div>

          {/* Recent Activities */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', marginBottom: '16px' }}>
              Recent Activities
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentActivities.map((activity) => (
                <div key={activity.id} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '12px',
                  borderRadius: '8px',
                  background: '#f8fafc',
                  transition: 'all 0.2s ease'
                }}>
                  <div style={{ 
                    fontSize: '16px',
                    width: '32px',
                    height: '32px',
                    background: 'white',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {activity.avatar}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '13px', color: '#1e293b', margin: 0, lineHeight: '1.4' }}>
                      <strong style={{ color: '#374151' }}>{activity.user}</strong> {activity.action}
                    </p>
                    <p style={{ fontSize: '11px', color: '#9ca3af', margin: '4px 0 0 0' }}>
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Info Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          marginTop: '20px'
        }}>
          {/* Upcoming Events */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', marginBottom: '16px' }}>
              Upcoming Events
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {upcomingEvents.map((event) => (
                <div key={event.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  borderRadius: '8px',
                  background: '#f8fafc',
                  borderLeft: `3px solid ${event.type === 'meeting' ? '#3b82f6' : event.type === 'event' ? '#f59e0b' : '#10b981'}`
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: event.type === 'meeting' ? '#3b82f6' : event.type === 'event' ? '#f59e0b' : '#10b981',
                    flexShrink: 0
                  }}></div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '13px', color: '#1e293b', margin: 0, fontWeight: '500' }}>
                      {event.title}
                    </p>
                    <p style={{ fontSize: '11px', color: '#6b7280', margin: '2px 0 0 0' }}>
                      {event.date} • {event.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', marginBottom: '16px' }}>
              Quick Stats
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                <div style={{ fontSize: '18px', fontWeight: '700', color: '#3b82f6', marginBottom: '4px' }}>
                  85%
                </div>
                <div style={{ fontSize: '11px', color: '#6b7280' }}>
                  Attendance Rate
                </div>
              </div>
              <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                <div style={{ fontSize: '18px', fontWeight: '700', color: '#10b981', marginBottom: '4px' }}>
                  92%
                </div>
                <div style={{ fontSize: '11px', color: '#6b7280' }}>
                  Pass Rate
                </div>
              </div>
              <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                <div style={{ fontSize: '18px', fontWeight: '700', color: '#f59e0b', marginBottom: '4px' }}>
                  18
                </div>
                <div style={{ fontSize: '11px', color: '#6b7280' }}>
                  Classes Today
                </div>
              </div>
              <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                <div style={{ fontSize: '18px', fontWeight: '700', color: '#8b5cf6', marginBottom: '4px' }}>
                  156
                </div>
                <div style={{ fontSize: '11px', color: '#6b7280' }}>
                  Assignments
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;