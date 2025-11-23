import React from "react";

const Dashboard = ({ owners, pets, vets, appointments, getPetName, getVetName }) => {
  const scheduledCount = appointments?.filter((a) => a.status === "Scheduled").length || 0;
  const completedCount = appointments?.filter((a) => a.status === "Completed").length || 0;
  const cancelledCount = appointments?.filter((a) => a.status === "Cancelled").length || 0;

  const stats = [
    { 
      label: "Total Owners", 
      value: owners?.length || 0, 
      icon: "👥",
      color: "#667eea"
    },
    { 
      label: "Total Pets", 
      value: pets?.length || 0, 
      icon: "🐾",
      color: "#10b981"
    },
    { 
      label: "Veterinarians", 
      value: vets?.length || 0, 
      icon: "⚕️",
      color: "#8b5cf6"
    },
    { 
      label: "Appointments", 
      value: appointments?.length || 0, 
      icon: "📅",
      color: "#f59e0b"
    },
  ];

  const upcomingAppointments = [...(appointments || [])]
    .filter(a => a.status === "Scheduled")
    .sort((a, b) => new Date(a.appointment_date) - new Date(b.appointment_date))
    .slice(0, 5);

  return (
    <div style={styles.container}>
      <style>{styles.css}</style>

      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>
            <span className="gradient-text">📊 Dashboard</span>
          </h1>
          <p style={styles.pageSubtitle}>Welcome back! Here's what's happening today</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={styles.statsGrid}>
        {stats.map((stat, idx) => (
          <div key={stat.label} className="stat-card" style={styles.statCard}>
            <div style={styles.statHeader}>
              <div style={{...styles.statIconWrapper, background: stat.color}}>
                <span style={styles.statIcon}>{stat.icon}</span>
              </div>
            </div>
            <div style={styles.statBody}>
              <h3 style={styles.statValue}>{stat.value}</h3>
              <p style={styles.statLabel}>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div style={styles.contentGrid}>
        {/* Appointments Section */}
        <div style={styles.largeCard}>
          <div style={styles.cardHeader}>
            <div>
              <h3 style={styles.cardTitle}>📅 Upcoming Appointments</h3>
              <p style={styles.cardSubtitle}>{scheduledCount} scheduled</p>
            </div>
          </div>

          <div style={styles.appointmentsList}>
            {upcomingAppointments.length === 0 ? (
              <div style={styles.emptyState}>
                <span style={styles.emptyIcon}>📅</span>
                <p style={styles.emptyText}>No upcoming appointments</p>
              </div>
            ) : (
              upcomingAppointments.map((apt) => (
                <div key={apt.appointment_id} style={styles.appointmentCard}>
                  <div style={styles.appointmentLeft}>
                    <div style={styles.appointmentDate}>
                      <div style={styles.dateDay}>
                        {new Date(apt.appointment_date).getDate()}
                      </div>
                      <div style={styles.dateMonth}>
                        {new Date(apt.appointment_date).toLocaleString('default', { month: 'short' })}
                      </div>
                    </div>
                    <div style={styles.appointmentInfo}>
                      <h4 style={styles.petName}>{getPetName?.(apt.pet_id) || 'Unknown Pet'}</h4>
                      <p style={styles.reason}>{apt.reason}</p>
                      <div style={styles.appointmentMeta}>
                        <span style={styles.metaItem}>
                          🕐 {new Date(apt.appointment_date).toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                        <span style={styles.metaItem}>
                          ⚕️ {getVetName?.(apt.vet_id) || 'Unknown Vet'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div style={styles.appointmentRight}>
                    <span style={styles.statusBadge}>
                      {apt.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Status Summary */}
        <div style={styles.statusCard}>
          <div style={styles.cardHeader}>
            <div>
              <h3 style={styles.cardTitle}>📊 Status Overview</h3>
              <p style={styles.cardSubtitle}>All appointments</p>
            </div>
          </div>

          <div style={styles.statusList}>
            <div style={styles.statusItem}>
              <div style={{...styles.statusIcon, background: 'rgba(59, 130, 246, 0.1)'}}>
                <span style={{fontSize: '28px'}}>🕐</span>
              </div>
              <div style={styles.statusContent}>
                <p style={styles.statusLabel}>Scheduled</p>
                <h3 style={styles.statusValue}>{scheduledCount}</h3>
              </div>
            </div>

            <div style={styles.statusItem}>
              <div style={{...styles.statusIcon, background: 'rgba(16, 185, 129, 0.1)'}}>
                <span style={{fontSize: '28px'}}>✅</span>
              </div>
              <div style={styles.statusContent}>
                <p style={styles.statusLabel}>Completed</p>
                <h3 style={styles.statusValue}>{completedCount}</h3>
              </div>
            </div>

            <div style={styles.statusItem}>
              <div style={{...styles.statusIcon, background: 'rgba(239, 68, 68, 0.1)'}}>
                <span style={{fontSize: '28px'}}>❌</span>
              </div>
              <div style={styles.statusContent}>
                <p style={styles.statusLabel}>Cancelled</p>
                <h3 style={styles.statusValue}>{cancelledCount}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Card */}
      <div style={styles.welcomeCard}>
        <h2 style={styles.welcomeTitle}>👋 Welcome to Pet Care Management System</h2>
        <p style={styles.welcomeText}>
          Your centralized platform for managing pet care operations. Use the navigation menu above to explore different sections.
        </p>
      </div>
    </div>
  );
};

const styles = {
  css: `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .gradient-text {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .stat-card {
      animation: fadeIn 0.6s ease-out forwards;
      transition: all 0.3s ease;
    }
    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12) !important;
    }
  `,
  container: {
    padding: '32px',
    maxWidth: '1400px',
    margin: '0 auto',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px'
  },
  pageTitle: {
    fontSize: '36px',
    fontWeight: '800',
    marginBottom: '8px',
    letterSpacing: '-0.5px'
  },
  pageSubtitle: {
    fontSize: '15px',
    color: '#64748b',
    fontWeight: '500'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '24px',
    marginBottom: '32px'
  },
  statCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
  },
  statHeader: {
    marginBottom: '16px'
  },
  statIconWrapper: {
    width: '56px',
    height: '56px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  },
  statIcon: {
    fontSize: '28px'
  },
  statBody: {},
  statValue: {
    fontSize: '32px',
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: '4px',
    margin: '0 0 4px 0'
  },
  statLabel: {
    fontSize: '14px',
    color: '#64748b',
    fontWeight: '600',
    margin: 0
  },
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 400px',
    gap: '24px',
    marginBottom: '24px'
  },
  largeCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '28px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
  },
  statusCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '28px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
  },
  cardHeader: {
    marginBottom: '24px'
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '4px',
    margin: '0 0 4px 0'
  },
  cardSubtitle: {
    fontSize: '13px',
    color: '#94a3b8',
    fontWeight: '500',
    margin: 0
  },
  appointmentsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  appointmentCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    borderRadius: '12px',
    border: '1px solid #f1f5f9',
    background: '#fafafa',
    transition: 'all 0.3s'
  },
  appointmentLeft: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
    flex: 1
  },
  appointmentDate: {
    width: '56px',
    height: '56px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
  },
  dateDay: {
    fontSize: '20px',
    fontWeight: '800',
    lineHeight: '1'
  },
  dateMonth: {
    fontSize: '10px',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginTop: '2px'
  },
  appointmentInfo: {
    flex: 1
  },
  petName: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '4px',
    margin: '0 0 4px 0'
  },
  reason: {
    fontSize: '13px',
    color: '#64748b',
    marginBottom: '6px',
    fontWeight: '500',
    margin: '0 0 6px 0'
  },
  appointmentMeta: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap'
  },
  metaItem: {
    fontSize: '12px',
    color: '#94a3b8',
    fontWeight: '500'
  },
  appointmentRight: {},
  statusBadge: {
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '600',
    background: 'rgba(59, 130, 246, 0.1)',
    color: '#2563eb'
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px 20px'
  },
  emptyIcon: {
    fontSize: '48px',
    display: 'block',
    marginBottom: '12px'
  },
  emptyText: {
    fontSize: '14px',
    color: '#64748b',
    fontWeight: '600',
    margin: 0
  },
  statusList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  statusItem: {
    display: 'flex',
    gap: '16px',
    padding: '16px',
    borderRadius: '12px',
    background: '#fafafa'
  },
  statusIcon: {
    width: '56px',
    height: '56px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  statusContent: {
    flex: 1
  },
  statusLabel: {
    fontSize: '13px',
    color: '#64748b',
    fontWeight: '600',
    marginBottom: '4px',
    margin: '0 0 4px 0'
  },
  statusValue: {
    fontSize: '24px',
    fontWeight: '800',
    color: '#0f172a',
    margin: 0
  },
  welcomeCard: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '40px',
    borderRadius: '16px',
    color: 'white',
    boxShadow: '0 20px 60px rgba(102, 126, 234, 0.4)'
  },
  welcomeTitle: {
    fontSize: '28px',
    fontWeight: '800',
    marginBottom: '12px',
    margin: '0 0 12px 0'
  },
  welcomeText: {
    fontSize: '16px',
    opacity: 0.9,
    lineHeight: '1.6',
    margin: 0
  }
};

export default Dashboard;