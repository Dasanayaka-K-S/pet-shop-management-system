// src/pages/Dashboard.jsx
import React from "react";
import {
  Calendar,
  Activity,
  Users,
  PawPrint,
  Stethoscope,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import "../App.css";

const Dashboard = ({ owners, pets, vets, appointments, getPetName, getVetName }) => {
  const scheduledCount = appointments.filter((a) => a.status === "Scheduled").length;
  const completedCount = appointments.filter((a) => a.status === "Completed").length;
  const cancelledCount = appointments.filter((a) => a.status === "Cancelled").length;

  const stats = [
    { label: "Total Owners", value: owners.length, color: "blue", Icon: Users },
    { label: "Total Pets", value: pets.length, color: "green", Icon: PawPrint },
    { label: "Veterinarians", value: vets.length, color: "purple", Icon: Stethoscope },
    { label: "Appointments", value: appointments.length, color: "orange", Icon: Calendar },
  ];

  const upcomingAppointments = [...appointments]
    .sort((a, b) => new Date(a.appointment_date) - new Date(b.appointment_date))
    .slice(0, 5);

  return (
    <div className="main-content page-container">
      <h2 className="page-title">Dashboard</h2>

      {/* Top Stats */}
      <div className="stats-grid">
        {stats.map((s) => (
          <div key={s.label} className={`stat-card ${s.color}`}>
            <div className="stat-content">
              <div className="stat-text">
                <p>{s.label}</p>
                <p className="stat-number">{s.value}</p>
              </div>
              <s.Icon className="stat-icon" />
            </div>
          </div>
        ))}
      </div>

      {/* Appointment Overview */}
      <div className="dashboard-card large-card">
        <h3>
          <Calendar style={{ width: 20, height: 20, color: "#2563eb" }} />{" "}
          Appointment Overview
        </h3>

        <div className="appointment-overview">
          {/* Left side - Upcoming appointments */}
          <div className="upcoming-box">
            <h4>Upcoming Appointments</h4>
            <div className="appointment-list compact">
              {upcomingAppointments.length === 0 ? (
                <div className="empty-state">
                  <p>No upcoming appointments</p>
                </div>
              ) : (
                upcomingAppointments.map((apt) => (
                  <div className="appointment-item small" key={apt.appointment_id}>
                    <div className="appointment-info">
                      <p className="pet-name">{getPetName(apt.pet_id)}</p>
                      <p className="reason">{apt.reason}</p>
                      <p className="datetime">
                        {new Date(apt.appointment_date).toLocaleString()}
                      </p>
                      <span className={`status-badge ${apt.status.toLowerCase()}`}>
                        {apt.status}
                      </span>
                    </div>
                    <div className="appointment-vet">
                      <p>{getVetName(apt.vet_id)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right side - Status summary */}
          <div>
          <div className="status-summary-box">
            <h4>Appointment Status</h4>
            <div className="status-summary">
              <div className="status-item blue">
                <Clock size={18} />
                <div>
                  <p>Scheduled</p>
                  <strong>{scheduledCount}</strong>
                </div>
              </div>
              <div className="status-item green">
                <CheckCircle size={18} />
                <div>
                  <p>Completed</p>
                  <strong>{completedCount}</strong>
                </div>
              </div>
              <div className="status-item red">
                <XCircle size={18} />
                <div>
                  <p>Cancelled</p>
                  <strong>{cancelledCount}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>

      <br/>
      {/* Recent Activities */}
      <div className="dashboard-card">
        <h3>
          <Activity style={{ width: 20, height: 20, color: "#10b981" }} /> Recent Activities
        </h3>
        <div className="activity-list">
          <div className="activity-item green">
            <div className="activity-dot green"></div>
            <div className="activity-content">
              <p>New pet registered</p>
              <p>Max - Golden Retriever</p>
            </div>
          </div>

          <div className="activity-item blue">
            <div className="activity-dot blue"></div>
            <div className="activity-content">
              <p>Appointment scheduled</p>
              <p>Whiskers - Dental Cleaning</p>
            </div>
          </div>

          <div className="activity-item purple">
            <div className="activity-dot purple"></div>
            <div className="activity-content">
              <p>New owner registered</p>
              <p>Sarah Johnson</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
