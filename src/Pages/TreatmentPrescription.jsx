import React, { useState, useEffect, useCallback } from "react";

const BASE_URL = "http://localhost:8080/api/app";

const TreatmentPrescription = () => {
  const [treatments, setTreatments] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [appointmentSearch, setAppointmentSearch] = useState("");
  const [showAppointmentDropdown, setShowAppointmentDropdown] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  const [form, setForm] = useState({
    appointment_id: "",
    diagnosis: "",
    prescription: "",
    treatment_date: "",
    follow_up_date: "",
    cost: "",
    notes: "",
  });

  // Show notification toast
  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 5000);
  };

  const fetchTreatments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/getTreatments`);
      const data = await response.json();
      
      if (data.success) {
        setTreatments(data.treatments || []);
      } else {
        setTreatments([]);
      }
    } catch (error) {
      console.error("Error fetching treatments:", error);
      setTreatments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAppointments = useCallback(async () => {
    try {
      const response = await fetch(`${BASE_URL}/getAppointments`);
      const data = await response.json();
      
      if (data.success) {
        // Only show completed appointments
        const completedAppointments = (data.appointments || []).filter(
          apt => apt.status === "Completed"
        );
        setAppointments(completedAppointments);
      } else {
        setAppointments([]);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setAppointments([]);
    }
  }, []);

  useEffect(() => {
    fetchTreatments();
    fetchAppointments();
  }, [fetchTreatments, fetchAppointments]);

  const openAdd = () => {
    setEditing(null);
    const today = new Date().toISOString().split('T')[0];
    
    setForm({
      appointment_id: "",
      diagnosis: "",
      prescription: "",
      treatment_date: today,
      follow_up_date: "",
      cost: "",
      notes: "",
    });
    setAppointmentSearch("");
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    
    setForm({
      appointment_id: item.appointment_id || item.appointmentIdForJson || "",
      diagnosis: item.diagnosis || "",
      prescription: item.prescription || "",
      treatment_date: item.treatment_date || "",
      follow_up_date: item.follow_up_date || "",
      cost: item.cost || "",
      notes: item.notes || "",
    });
    
    const selectedAppointment = appointments.find(
      a => a.appointment_id === (item.appointment_id || item.appointmentIdForJson)
    );
    
    if (selectedAppointment) {
      setAppointmentSearch(
        `${selectedAppointment.petName} - Dr. ${selectedAppointment.vetName}`
      );
    }
    
    setModalOpen(true);
  };

  const handleDelete = async (item) => {
    if (!window.confirm("Are you sure you want to delete this treatment record?")) return;
    
    try {
      const response = await fetch(`${BASE_URL}/deleteTreatment/${item.treatment_id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        showNotification("Treatment record deleted successfully", "success");
        fetchTreatments();
      } else {
        showNotification(data.message || "Failed to delete treatment record", "error");
      }
    } catch (error) {
      console.error("Error deleting treatment:", error);
      showNotification("Failed to delete treatment record", "error");
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!form.appointment_id) {
      showNotification("Please select an appointment", "error");
      return;
    }
    
    if (!form.diagnosis || form.diagnosis.trim() === "") {
      showNotification("Please enter a diagnosis", "error");
      return;
    }
    
    if (!form.treatment_date) {
      showNotification("Please select a treatment date", "error");
      return;
    }

    try {
      setLoading(true);
      
      const treatmentData = {
        appointment_id: Number(form.appointment_id),
        diagnosis: form.diagnosis,
        prescription: form.prescription,
        treatment_date: form.treatment_date,
        follow_up_date: form.follow_up_date || null,
        cost: form.cost ? Number(form.cost) : null,
        notes: form.notes,
      };

      let response;
      if (editing) {
        treatmentData.treatment_id = editing.treatment_id;
        response = await fetch(`${BASE_URL}/updateTreatment`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(treatmentData),
        });
      } else {
        response = await fetch(`${BASE_URL}/addTreatment`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(treatmentData),
        });
      }
      
      const data = await response.json();
      
      if (data.success) {
        showNotification(
          editing ? "✅ Treatment record updated successfully!" : "✅ Treatment record created successfully!",
          "success"
        );
        setModalOpen(false);
        fetchTreatments();
      } else {
        showNotification(data.message || "Failed to save treatment record", "error");
      }
    } catch (error) {
      console.error("Error saving treatment:", error);
      showNotification("Failed to save treatment record. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments = appointments.filter(a =>
    `${a.petName} ${a.vetName}`.toLowerCase().includes(appointmentSearch.toLowerCase())
  );

  const filtered = treatments.filter(t => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (t.petName || "").toLowerCase().includes(searchLower) ||
      (t.vetName || "").toLowerCase().includes(searchLower) ||
      (t.diagnosis || "").toLowerCase().includes(searchLower) ||
      (t.prescription || "").toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="main-content page-container">
<<<<<<< HEAD
      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .notification-toast {
          position: fixed;
          top: 20px;
          right: 20px;
          min-width: 320px;
          max-width: 500px;
          padding: 16px 20px;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
          z-index: 10000;
          animation: slideInRight 0.3s ease-out;
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 600;
          font-size: 14px;
          line-height: 1.5;
        }
        
        .notification-toast.success {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
        }
        
        .notification-toast.error {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
        }
        
        .notification-icon {
          font-size: 24px;
          flex-shrink: 0;
        }
        
        .notification-message {
          flex: 1;
        }
      `}</style>
=======
      {/* Updated Title Section with Icon */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '32px'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '32px'
        }}>
          💊
        </div>
        <div>
          <h2 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#1a1a2e',
            margin: '0'
          }}>Treatment & Prescription</h2>
          <p style={{
            fontSize: '14px',
            color: '#6b7280',
            margin: '4px 0 0 0'
          }}>Manage treatment records and prescribed medications</p>
        </div>
      </div>
>>>>>>> 29cf541a7f7b132c06dca9aadf53e59864437895

      {notification.show && (
        <div className={`notification-toast ${notification.type}`}>
          <span className="notification-icon">
            {notification.type === "success" && "✅"}
            {notification.type === "error" && "❌"}
          </span>
          <div className="notification-message">{notification.message}</div>
        </div>
      )}

      <h2 className="page-title">💊 Treatment & Prescription</h2>

      <div className="data-table">
        <div className="table-header">
          <div className="table-header-content">
            <h3 className="table-title">Manage Treatment Records</h3>
            <div className="table-actions">
              <div className="search-box">
                <svg className="search-icon" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search treatments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button onClick={openAdd} className="btn-add">
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Add Treatment
              </button>
            </div>
          </div>
        </div>

        <div className="table-wrapper">
          {loading ? (
            <div style={{textAlign: 'center', padding: '3rem', color: '#64748b'}}>
              <div style={{fontSize: '48px', marginBottom: '16px'}}>⏳</div>
              <div style={{fontSize: '16px', fontWeight: '600'}}>Loading treatment records...</div>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{textAlign: 'center', padding: '3rem', color: '#64748b'}}>
              <div style={{fontSize: '48px', marginBottom: '16px'}}>💊</div>
              <div style={{fontSize: '16px', fontWeight: '600'}}>No treatment records found</div>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Pet</th>
                  <th>Veterinarian</th>
                  <th>Treatment Date</th>
                  <th>Diagnosis</th>
                  <th>Prescription</th>
                  <th>Follow-Up</th>
                  <th>Cost</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((treatment) => (
                  <tr key={treatment.treatment_id}>
                    <td>
                      <strong>{treatment.petName || "Unknown"}</strong>
                      {treatment.ownerName && (
                        <div style={{fontSize: '12px', color: '#64748b', marginTop: '4px'}}>
                          Owner: {treatment.ownerName}
                        </div>
                      )}
                    </td>
                    <td>
                      <span style={{color: '#667eea', fontWeight: '600'}}>
                        Dr. {treatment.vetName || "Unknown"}
                      </span>
                    </td>
                    <td>
                      {treatment.treatment_date 
                        ? new Date(treatment.treatment_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })
                        : "-"}
                    </td>
                    <td>
                      <div style={{
                        maxWidth: '200px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {treatment.diagnosis || "-"}
                      </div>
                    </td>
                    <td>
                      <div style={{
                        maxWidth: '200px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {treatment.prescription || "-"}
                      </div>
                    </td>
                    <td>
                      {treatment.follow_up_date ? (
                        <span style={{
                          padding: '4px 8px',
                          background: '#fef3c7',
                          color: '#92400e',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          {new Date(treatment.follow_up_date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      ) : (
                        <span style={{color: '#94a3b8'}}>No follow-up</span>
                      )}
                    </td>
                    <td>
                      {treatment.cost ? (
                        <span style={{fontWeight: '600', color: '#0f172a'}}>
                          ${treatment.cost.toFixed(2)}
                        </span>
                      ) : (
                        <span style={{color: '#94a3b8'}}>-</span>
                      )}
                    </td>
                    <td>
                      <button onClick={() => openEdit(treatment)} className="btn-edit" title="Edit">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button onClick={() => handleDelete(treatment)} className="btn-delete" title="Delete">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{maxWidth: '700px'}}>
            <div className="modal-header">
              <h3 className="modal-title">
                {editing ? "✏️ Edit Treatment Record" : "💊 Add Treatment Record"}
              </h3>
            </div>
            <div className="modal-form">
              
              {/* Appointment Search */}
              <div style={{position: 'relative'}}>
                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem'}}>
                  Appointment <span style={{color: '#ef4444'}}>*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search completed appointments..."
                  value={appointmentSearch}
                  onChange={(e) => {
                    setAppointmentSearch(e.target.value);
                    setShowAppointmentDropdown(true);
                  }}
                  onFocus={() => setShowAppointmentDropdown(true)}
                  disabled={editing}
                />
                {showAppointmentDropdown && filteredAppointments.length > 0 && !editing && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    maxHeight: '250px',
                    overflowY: 'auto',
                    background: 'white',
                    border: '1px solid #e6eef6',
                    borderRadius: '0.6rem',
                    marginTop: '0.25rem',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                    zIndex: 100
                  }}>
                    {filteredAppointments.map((apt) => (
                      <div
                        key={apt.appointment_id}
                        onClick={() => {
                          setForm({ ...form, appointment_id: apt.appointment_id });
                          setAppointmentSearch(`${apt.petName} - Dr. ${apt.vetName}`);
                          setShowAppointmentDropdown(false);
                        }}
                        style={{
                          padding: '0.75rem',
                          cursor: 'pointer',
                          borderBottom: '1px solid #eef2f7',
                          background: form.appointment_id === apt.appointment_id ? '#eff6ff' : 'transparent',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#f8fafc'}
                        onMouseLeave={(e) => e.target.style.background = form.appointment_id === apt.appointment_id ? '#eff6ff' : 'transparent'}
                      >
                        <div style={{fontWeight: '600', color: '#0f172a'}}>
                          {apt.petName} - Dr. {apt.vetName}
                        </div>
                        <div style={{fontSize: '0.85rem', color: '#64748b'}}>
                          {new Date(apt.appointment_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })} • {apt.reason}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {appointments.length === 0 && (
                  <div style={{fontSize: '12px', color: '#ef4444', marginTop: '4px'}}>
                    No completed appointments available. Please complete an appointment first.
                  </div>
                )}
              </div>

              {/* Diagnosis */}
              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem'}}>
                  Diagnosis <span style={{color: '#ef4444'}}>*</span>
                </label>
                <textarea
                  className="form-textarea"
                  placeholder="E.g., Mild ear infection, requires antibiotics..."
                  value={form.diagnosis}
                  onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
                  rows="3"
                />
              </div>

              {/* Prescription */}
              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem'}}>
                  Prescription / Medication
                </label>
                <textarea
                  className="form-textarea"
                  placeholder="E.g., Amoxicillin 250mg twice daily for 7 days..."
                  value={form.prescription}
                  onChange={(e) => setForm({ ...form, prescription: e.target.value })}
                  rows="3"
                />
              </div>

              {/* Treatment Date and Follow-up Date */}
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem'}}>
                    Treatment Date <span style={{color: '#ef4444'}}>*</span>
                  </label>
                  <input
                    type="date"
                    className="form-input"
                    value={form.treatment_date}
                    onChange={(e) => setForm({ ...form, treatment_date: e.target.value })}
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem'}}>
                    Follow-Up Date
                  </label>
                  <input
                    type="date"
                    className="form-input"
                    value={form.follow_up_date}
                    onChange={(e) => setForm({ ...form, follow_up_date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              {/* Cost */}
              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem'}}>
                  Treatment Cost ($)
                </label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="0.00"
                  value={form.cost}
                  onChange={(e) => setForm({ ...form, cost: e.target.value })}
                  min="0"
                  step="0.01"
                />
              </div>

              {/* Notes */}
              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem'}}>
                  Additional Notes (Optional)
                </label>
                <textarea
                  className="form-textarea"
                  placeholder="Any additional observations or instructions..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows="2"
                />
              </div>

              {/* Buttons */}
              <div className="modal-buttons">
                <button 
                  onClick={() => setModalOpen(false)} 
                  className="btn-cancel" 
                  style={{flex: 1}}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSubmit} 
                  className="btn-submit" 
                  style={{flex: 1}} 
                  disabled={loading}
                >
                  {loading ? "⏳ Saving..." : (editing ? "Update Treatment" : "Add Treatment")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TreatmentPrescription;