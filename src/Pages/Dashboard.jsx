import React, { useState, useEffect } from "react";
import {
  Calendar,
  Activity,
  Users,
  PawPrint,
  Stethoscope,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Bell,
  Search,
  Filter,
  ChevronRight,
  Heart
} from "lucide-react";

// Icon wrapper component for consistent sizing
const Icon = ({ children, size = 20 }) => (
  <span style={{ 
    display: 'inline-flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    fontSize: size,
    lineHeight: 1
  }}>
    {children}
  </span>
);

const Dashboard = ({ owners, pets, vets, appointments, getPetName, getVetName }) => {
  const [mounted, setMounted] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    setMounted(true);
  }, []);

  const scheduledCount = appointments?.filter((a) => a.status === "Scheduled").length || 0;
  const completedCount = appointments?.filter((a) => a.status === "Completed").length || 0;
  const cancelledCount = appointments?.filter((a) => a.status === "Cancelled").length || 0;

  const stats = [
    { 
      label: "Total Owners", 
      value: owners?.length || 0, 
      color: "from-blue-500 to-blue-600", 
      bg: "bg-blue-50",
      icon: "👥",
      trend: "+12%",
      subtitle: "vs last month"
    },
    { 
      label: "Total Pets", 
      value: pets?.length || 0, 
      color: "from-green-500 to-green-600", 
      bg: "bg-green-50",
      icon: "🐾",
      trend: "+8%",
      subtitle: "new registrations"
    },
    { 
      label: "Veterinarians", 
      value: vets?.length || 0, 
      color: "from-purple-500 to-purple-600", 
      bg: "bg-purple-50",
      icon: "⚕️",
      trend: "+2",
      subtitle: "active staff"
    },
    { 
      label: "Appointments", 
      value: appointments?.length || 0, 
      color: "from-orange-500 to-orange-600", 
      bg: "bg-orange-50",
      icon: "📅",
      trend: "+24%",
      subtitle: "this week"
    },
  ];

  const upcomingAppointments = [...(appointments || [])]
    .filter(a => a.status === "Scheduled")
    .sort((a, b) => new Date(a.appointment_date) - new Date(b.appointment_date))
    .slice(0, 5);

  const recentActivities = [
    { type: "pet", title: "New pet registered", detail: "Max - Golden Retriever", time: "2 hours ago", color: "green" },
    { type: "appointment", title: "Appointment scheduled", detail: "Whiskers - Dental Cleaning", time: "4 hours ago", color: "blue" },
    { type: "owner", title: "New owner registered", detail: "Sarah Johnson", time: "Yesterday", color: "purple" },
    { type: "completed", title: "Checkup completed", detail: "Buddy - Annual Checkup", time: "Yesterday", color: "orange" },
  ];

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .stat-card {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }
        .stat-card:nth-child(1) { animation-delay: 0.1s; }
        .stat-card:nth-child(2) { animation-delay: 0.2s; }
        .stat-card:nth-child(3) { animation-delay: 0.3s; }
        .stat-card:nth-child(4) { animation-delay: 0.4s; }
        .card {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
          animation-delay: 0.5s;
        }
        .activity-item {
          animation: slideIn 0.4s ease-out forwards;
          opacity: 0;
        }
        .activity-item:nth-child(1) { animation-delay: 0.7s; }
        .activity-item:nth-child(2) { animation-delay: 0.8s; }
        .activity-item:nth-child(3) { animation-delay: 0.9s; }
        .activity-item:nth-child(4) { animation-delay: 1s; }
        .hover-lift {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .hover-lift:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
        }
        .gradient-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .status-badge {
          display: inline-flex;
          align-items: center;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          gap: 6px;
        }
        .status-badge.scheduled {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(37, 99, 235, 0.15));
          color: #2563eb;
          border: 1px solid rgba(59, 130, 246, 0.3);
        }
        .status-badge.completed {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.15));
          color: #059669;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }
        .status-badge.cancelled {
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(220, 38, 38, 0.15));
          color: #dc2626;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }
        .appointment-card {
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .appointment-card:hover {
          transform: translateX(8px);
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05));
        }
      `}</style>

      {/* Header Section */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>
            <span className="gradient-text">Dashboard</span>
          </h1>
          <p style={styles.pageSubtitle}>Welcome back! Here's what's happening today</p>
        </div>
        <div style={styles.headerActions}>
          <button style={styles.iconButton}>
            <Icon size={20}>🔔</Icon>
            <span style={styles.badge}>3</span>
          </button>
          <button style={styles.searchButton}>
            <Icon size={18}>🔍</Icon>
            <span>Search...</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={styles.statsGrid}>
        {stats.map((stat, idx) => (
          <div key={stat.label} className="stat-card hover-lift" style={styles.statCard}>
            <div style={styles.statHeader}>
              <div style={{...styles.statIconWrapper, background: `linear-gradient(135deg, ${stat.color})`}}>
                <Icon size={28}>{stat.icon}</Icon>
              </div>
              <div style={styles.trendBadge}>
                <Icon size={14}>📈</Icon>
                <span>{stat.trend}</span>
              </div>
            </div>
            <div style={styles.statBody}>
              <h3 style={styles.statValue}>{stat.value}</h3>
              <p style={styles.statLabel}>{stat.label}</p>
              <p style={styles.statSubtitle}>{stat.subtitle}</p>
            </div>
            <div style={styles.statFooter}>
              <div style={{...styles.progressBar, background: `linear-gradient(90deg, ${stat.color})`}}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div style={styles.contentGrid}>
        {/* Appointments Section */}
        <div className="card" style={styles.largeCard}>
          <div style={styles.cardHeader}>
            <div style={styles.cardTitle}>
              <div style={{...styles.cardIconWrapper, background: 'linear-gradient(135deg, #3b82f6, #2563eb)'}}>
                <Icon size={22}>📅</Icon>
              </div>
              <div>
                <h3 style={styles.cardTitleText}>Upcoming Appointments</h3>
                <p style={styles.cardSubtitle}>{scheduledCount} scheduled for this week</p>
              </div>
            </div>
            <button style={styles.filterButton}>
              <Icon size={16}>🔽</Icon>
              <span>Filter</span>
            </button>
          </div>

          <div style={styles.appointmentsList}>
            {upcomingAppointments.length === 0 ? (
              <div style={styles.emptyState}>
                <Icon size={48}>📅</Icon>
                <p style={styles.emptyText}>No upcoming appointments</p>
                <p style={styles.emptySubtext}>All appointments are up to date</p>
              </div>
            ) : (
              upcomingAppointments.map((apt) => (
                <div key={apt.appointment_id} className="appointment-card" style={styles.appointmentCard}>
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
                          <Icon size={14}>🕐</Icon>
                          {new Date(apt.appointment_date).toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                        <span style={styles.metaItem}>
                          <Icon size={14}>⚕️</Icon>
                          {getVetName?.(apt.vet_id) || 'Unknown Vet'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div style={styles.appointmentRight}>
                    <span className={`status-badge ${apt.status.toLowerCase()}`}>
                      <Icon size={12}>🕐</Icon>
                      {apt.status}
                    </span>
                    <Icon size={20}>›</Icon>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Status Summary */}
        <div className="card" style={styles.statusCard}>
          <div style={styles.cardHeader}>
            <div style={styles.cardTitle}>
              <div style={{...styles.cardIconWrapper, background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)'}}>
                <Icon size={22}>📊</Icon>
              </div>
              <div>
                <h3 style={styles.cardTitleText}>Appointment Status</h3>
                <p style={styles.cardSubtitle}>Overview of all appointments</p>
              </div>
            </div>
          </div>

          <div style={styles.statusList}>
            <div style={{...styles.statusItem, borderLeft: '4px solid #3b82f6'}}>
              <div style={{...styles.statusIcon, background: 'rgba(59, 130, 246, 0.1)'}}>
                <Icon size={28}>🕐</Icon>
              </div>
              <div style={styles.statusContent}>
                <p style={styles.statusLabel}>Scheduled</p>
                <h3 style={styles.statusValue}>{scheduledCount}</h3>
                <p style={styles.statusTrend}>
                  <Icon size={12}>📈</Icon>
                  <span>+12% from last week</span>
                </p>
              </div>
            </div>

            <div style={{...styles.statusItem, borderLeft: '4px solid #10b981'}}>
              <div style={{...styles.statusIcon, background: 'rgba(16, 185, 129, 0.1)'}}>
                <Icon size={28}>✅</Icon>
              </div>
              <div style={styles.statusContent}>
                <p style={styles.statusLabel}>Completed</p>
                <h3 style={styles.statusValue}>{completedCount}</h3>
                <p style={styles.statusTrend}>
                  <Icon size={12}>📈</Icon>
                  <span>+8% completion rate</span>
                </p>
              </div>
            </div>

            <div style={{...styles.statusItem, borderLeft: '4px solid #ef4444'}}>
              <div style={{...styles.statusIcon, background: 'rgba(239, 68, 68, 0.1)'}}>
                <Icon size={28}>❌</Icon>
              </div>
              <div style={styles.statusContent}>
                <p style={styles.statusLabel}>Cancelled</p>
                <h3 style={styles.statusValue}>{cancelledCount}</h3>
                <p style={styles.statusTrend}>
                  <Icon size={12}>📉</Icon>
                  <span>-3% from last week</span>
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div style={styles.quickStats}>
            <div style={styles.quickStatItem}>
              <Icon size={16}>❤️</Icon>
              <div>
                <p style={styles.quickStatValue}>98%</p>
                <p style={styles.quickStatLabel}>Satisfaction</p>
              </div>
            </div>
            <div style={styles.quickStatDivider}></div>
            <div style={styles.quickStatItem}>
              <Icon size={16}>👥</Icon>
              <div>
                <p style={styles.quickStatValue}>2.5k</p>
                <p style={styles.quickStatLabel}>Total Visits</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="card" style={styles.activityCard}>
        <div style={styles.cardHeader}>
          <div style={styles.cardTitle}>
            <div style={{...styles.cardIconWrapper, background: 'linear-gradient(135deg, #10b981, #059669)'}}>
              <Icon size={22}>⚡</Icon>
            </div>
            <div>
              <h3 style={styles.cardTitleText}>Recent Activities</h3>
              <p style={styles.cardSubtitle}>Latest updates from your clinic</p>
            </div>
          </div>
          <button style={{...styles.textButton, color: '#667eea'}}>
            View All
            <Icon size={16}>›</Icon>
          </button>
        </div>

        <div style={styles.activityList}>
          {recentActivities.map((activity, idx) => (
            <div key={idx} className="activity-item" style={styles.activityItem}>
              <div style={{
                ...styles.activityDot,
                background: activity.color === 'green' ? '#10b981' :
                           activity.color === 'blue' ? '#3b82f6' :
                           activity.color === 'purple' ? '#8b5cf6' : '#f97316'
              }}>
                <div style={styles.activityPulse}></div>
                <Icon size={18}>
                  {activity.color === 'green' ? '🐾' :
                   activity.color === 'blue' ? '📅' :
                   activity.color === 'purple' ? '👤' : '✅'}
                </Icon>
              </div>
              <div style={styles.activityContent}>
                <h4 style={styles.activityTitle}>{activity.title}</h4>
                <p style={styles.activityDetail}>{activity.detail}</p>
              </div>
              <span style={styles.activityTime}>{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '32px',
    maxWidth: '1400px',
    margin: '0 auto',
    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
    minHeight: '100vh',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    flexWrap: 'wrap',
    gap: '16px'
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
  headerActions: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center'
  },
  iconButton: {
    width: '48px',
    height: '48px',
    borderRadius: '14px',
    background: 'white',
    border: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s',
    position: 'relative',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
  },
  badge: {
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
    color: 'white',
    fontSize: '10px',
    fontWeight: '700',
    padding: '2px 6px',
    borderRadius: '10px',
    border: '2px solid white'
  },
  searchButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 20px',
    borderRadius: '14px',
    background: 'white',
    border: '1px solid #e2e8f0',
    cursor: 'pointer',
    transition: 'all 0.3s',
    fontSize: '14px',
    color: '#94a3b8',
    fontWeight: '500',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
    marginBottom: '32px'
  },
  statCard: {
    background: 'white',
    borderRadius: '20px',
    padding: '24px',
    border: '1px solid #f1f5f9',
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
    position: 'relative',
    overflow: 'hidden'
  },
  statHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px'
  },
  statIconWrapper: {
    width: '56px',
    height: '56px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
  },
  trendBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    background: 'rgba(16, 185, 129, 0.1)',
    color: '#059669',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '700'
  },
  statBody: {
    marginBottom: '16px'
  },
  statValue: {
    fontSize: '32px',
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: '4px',
    letterSpacing: '-0.5px'
  },
  statLabel: {
    fontSize: '14px',
    color: '#64748b',
    fontWeight: '600',
    marginBottom: '4px'
  },
  statSubtitle: {
    fontSize: '12px',
    color: '#94a3b8',
    fontWeight: '500'
  },
  statFooter: {
    height: '4px',
    background: '#f1f5f9',
    borderRadius: '2px',
    overflow: 'hidden'
  },
  progressBar: {
    height: '100%',
    width: '75%',
    borderRadius: '2px',
    transition: 'width 1s ease'
  },
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 400px',
    gap: '24px',
    marginBottom: '24px'
  },
  largeCard: {
    background: 'white',
    borderRadius: '20px',
    padding: '28px',
    border: '1px solid #f1f5f9',
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
  },
  statusCard: {
    background: 'white',
    borderRadius: '20px',
    padding: '28px',
    border: '1px solid #f1f5f9',
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px'
  },
  cardTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  cardIconWrapper: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  },
  cardTitleText: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '2px'
  },
  cardSubtitle: {
    fontSize: '13px',
    color: '#94a3b8',
    fontWeight: '500'
  },
  filterButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    borderRadius: '10px',
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    color: '#475569',
    transition: 'all 0.2s'
  },
  textButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.2s'
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
    padding: '20px',
    borderRadius: '16px',
    border: '1px solid #f1f5f9',
    background: 'white'
  },
  appointmentLeft: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
    flex: 1
  },
  appointmentDate: {
    width: '60px',
    height: '60px',
    borderRadius: '14px',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)'
  },
  dateDay: {
    fontSize: '24px',
    fontWeight: '800',
    lineHeight: '1'
  },
  dateMonth: {
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginTop: '2px'
  },
  appointmentInfo: {
    flex: 1
  },
  petName: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '4px'
  },
  reason: {
    fontSize: '14px',
    color: '#64748b',
    marginBottom: '8px',
    fontWeight: '500'
  },
  appointmentMeta: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap'
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    color: '#94a3b8',
    fontWeight: '500'
  },
  appointmentRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px'
  },
  emptyText: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#64748b'
  },
  emptySubtext: {
    fontSize: '14px',
    color: '#94a3b8'
  },
  statusList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    marginBottom: '24px'
  },
  statusItem: {
    display: 'flex',
    gap: '16px',
    padding: '20px',
    borderRadius: '14px',
    background: '#fafafa',
    transition: 'all 0.3s'
  },
  statusIcon: {
    width: '56px',
    height: '56px',
    borderRadius: '14px',
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
    marginBottom: '6px'
  },
  statusValue: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: '6px',
    letterSpacing: '-0.5px'
  },
  statusTrend: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    color: '#10b981',
    fontWeight: '600'
  },
  quickStats: {
    display: 'flex',
    padding: '20px',
    borderRadius: '14px',
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05))',
    border: '1px solid rgba(102, 126, 234, 0.1)',
    gap: '20px'
  },
  quickStatItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flex: 1
  },
  quickStatDivider: {
    width: '1px',
    background: '#e2e8f0'
  },
  quickStatValue: {
    fontSize: '18px',
    fontWeight: '800',
    color: '#0f172a',
    lineHeight: '1.2'
  },
  quickStatLabel: {
    fontSize: '12px',
    color: '#64748b',
    fontWeight: '600'
  },
  activityCard: {
    background: 'white',
    borderRadius: '20px',
    padding: '28px',
    border: '1px solid #f1f5f9',
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
  },
  activityList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0'
  },
  activityItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    padding: '20px 0',
    borderBottom: '1px solid #f1f5f9',
    transition: 'all 0.3s'
  },
  activityDot: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    flexShrink: 0
  },
  activityPulse: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: '12px',
    background: 'currentColor',
    opacity: '0.3',
    animation: 'pulse 2s infinite'
  },
  activityContent: {
    flex: 1
  },
  activityTitle: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '4px'
  },
  activityDetail: {
    fontSize: '14px',
    color: '#64748b',
    fontWeight: '500'
  },
  activityTime: {
    fontSize: '13px',
    color: '#94a3b8',
    fontWeight: '600',
    whiteSpace: 'nowrap'
  }
};

export default Dashboard;