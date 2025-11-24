import React from "react";

const Dashboard = ({ owners = [], pets = [], vets = [], appointments = [], getPetName, getVetName }) => {
  // ✅ Ensure appointments is always an array
  const safeAppointments = Array.isArray(appointments) ? appointments : [];
  
  const scheduledCount = safeAppointments.filter((a) => a.status === "Scheduled").length;
  const completedCount = safeAppointments.filter((a) => a.status === "Completed").length;
  const cancelledCount = safeAppointments.filter((a) => a.status === "Cancelled").length;

  const stats = [
    { 
      label: "Total Owners", 
      value: Array.isArray(owners) ? owners.length : 0, 
      icon: "👥",
      gradient: "linear-gradient(135deg, #0a0a0a 0%, #1a0a2e 100%)"
    },
    { 
      label: "Total Pets", 
      value: Array.isArray(pets) ? pets.length : 0, 
      icon: "🐾",
      gradient: "linear-gradient(135deg, #0f3460 0%, #16213e 100%)"
    },
    { 
      label: "Veterinarians", 
      value: Array.isArray(vets) ? vets.length : 0, 
      icon: "⚕️",
      gradient: "linear-gradient(135deg, #1a0a2e 0%, #0a0a0a 100%)"
    },
    { 
      label: "Appointments", 
      value: safeAppointments.length, 
      icon: "📅",
      gradient: "linear-gradient(135deg, #16213e 0%, #1a0a2e 100%)"
    },
  ];

  // ✅ Safe filtering with proper array handling
  const upcomingAppointments = safeAppointments
    .filter(a => a.status === "Scheduled" && a.appointment_date)
    .sort((a, b) => new Date(a.appointment_date) - new Date(b.appointment_date))
    .slice(0, 5);

  // ✅ Safe helper functions
  const safePetName = (petId) => {
    if (typeof getPetName === 'function') {
      return getPetName(petId);
    }
    const pet = Array.isArray(pets) ? pets.find(p => p.pet_id === petId) : null;
    return pet ? pet.pet_name : 'Unknown Pet';
  };

  const safeVetName = (vetId) => {
    if (typeof getVetName === 'function') {
      return getVetName(vetId);
    }
    const vet = Array.isArray(vets) ? vets.find(v => v.vet_id === vetId) : null;
    return vet ? vet.vet_name : 'Unknown Vet';
  };

  return (
    <div style={styles.container}>
      <style>{styles.css}</style>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.titleWrapper}>
          <div style={styles.iconWrapper}>
            <span style={styles.iconTitle}>📊</span>
          </div>
          <div>
            <h1 style={styles.pageTitle}>
              <span className="gradient-text">Dashboard</span>
            </h1>
            <p style={styles.pageSubtitle}>Welcome back! Here's what's happening today</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={styles.statsGrid}>
        {stats.map((stat, idx) => (
          <div key={stat.label} className="stat-card" style={{...styles.statCard, background: stat.gradient}}>
            <div style={styles.statHeader}>
              <div style={styles.statIconWrapper}>
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
                      <h4 style={styles.petName}>{safePetName(apt.pet_id)}</h4>
                      <p style={styles.reason}>{apt.reason || 'No reason specified'}</p>
                      <div style={styles.appointmentMeta}>
                        <span style={styles.metaItem}>
                          🕐 {new Date(apt.appointment_date).toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                        <span style={styles.metaItem}>
                          ⚕️ {safeVetName(apt.vet_id)}
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
              <div style={{...styles.statusIcon, background: 'rgba(102, 126, 234, 0.2)'}}>
                <span style={{fontSize: '28px'}}>🕐</span>
              </div>
              <div style={styles.statusContent}>
                <p style={styles.statusLabel}>Scheduled</p>
                <h3 style={styles.statusValue}>{scheduledCount}</h3>
              </div>
            </div>

            <div style={styles.statusItem}>
              <div style={{...styles.statusIcon, background: 'rgba(16, 185, 129, 0.2)'}}>
                <span style={{fontSize: '28px'}}>✅</span>
              </div>
              <div style={styles.statusContent}>
                <p style={styles.statusLabel}>Completed</p>
                <h3 style={styles.statusValue}>{completedCount}</h3>
              </div>
            </div>

            <div style={styles.statusItem}>
              <div style={{...styles.statusIcon, background: 'rgba(239, 68, 68, 0.2)'}}>
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

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }

    .gradient-text {
      background: linear-gradient(135deg, #1a0a2e 0%, #0a0a0a 100%);
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
      box-shadow: 0 12px 30px rgba(102, 126, 234, 0.4) !important;
    }
  `,
  container: {
    padding: '32px',
    maxWidth: '1600px',
    margin: '0 auto',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    animation: 'fadeIn 0.6s ease-out'
  },
  titleWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
  },
  iconWrapper: {
    width: '70px',
    height: '70px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, #0a0a0a, #1a0a2e)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.6)',
    animation: 'float 3s ease-in-out infinite',
    border: '2px solid rgba(255, 255, 255, 0.15)'
  },
  iconTitle: {
    fontSize: '36px'
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
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
    color: 'white'
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
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
  },
  statIcon: {
    fontSize: '28px'
  },
  statBody: {},
  statValue: {
    fontSize: '32px',
    fontWeight: '800',
    color: 'white',
    marginBottom: '4px',
    margin: '0 0 4px 0'
  },
  statLabel: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.9)',
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
    background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a2e 100%)',
    borderRadius: '16px',
    padding: '28px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
    color: 'white'
  },
  statusCard: {
    background: 'linear-gradient(135deg, #16213e 0%, #0f3460 100%)',
    borderRadius: '16px',
    padding: '28px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
    color: 'white'
  },
  cardHeader: {
    marginBottom: '24px'
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: 'white',
    marginBottom: '4px',
    margin: '0 0 4px 0'
  },
  cardSubtitle: {
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.7)',
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
    border: '1px solid rgba(255, 255, 255, 0.1)',
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
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
    color: 'white',
    marginBottom: '4px',
    margin: '0 0 4px 0'
  },
  reason: {
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.7)',
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
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '500'
  },
  appointmentRight: {},
  statusBadge: {
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '600',
    background: 'rgba(102, 126, 234, 0.2)',
    color: '#a5b4fc',
    border: '1px solid rgba(102, 126, 234, 0.3)'
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
    color: 'rgba(255, 255, 255, 0.7)',
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
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  },
  statusIcon: {
    width: '56px',
    height: '56px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  },
  statusContent: {
    flex: 1
  },
  statusLabel: {
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
    marginBottom: '4px',
    margin: '0 0 4px 0'
  },
  statusValue: {
    fontSize: '24px',
    fontWeight: '800',
    color: 'white',
    margin: 0
  },
  welcomeCard: {
    background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a2e 50%, #16213e 100%)',
    padding: '40px',
    borderRadius: '16px',
    color: 'white',
    boxShadow: '0 20px 60px rgba(102, 126, 234, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.1)'
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