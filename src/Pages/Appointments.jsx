import React, { useState, useEffect, useCallback } from "react";

const BASE_URL = "http://localhost:8080/api/app";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [pets, setPets] = useState([]);
  const [vets, setVets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [petSearch, setPetSearch] = useState("");
  const [vetSearch, setVetSearch] = useState("");
  const [showPetDropdown, setShowPetDropdown] = useState(false);
  const [showVetDropdown, setShowVetDropdown] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  const [form, setForm] = useState({
    pet_id: "",
    vet_id: "",
    appointment_date: "",
    appointment_time: "",
    duration_minutes: 30,
    reason: "",
    status: "Scheduled",
    notes: "",
  });

  // ✅ Show notification toast
  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 5000);
  };

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/getAppointments`);
      const data = await response.json();
      
      if (data.success) {
        setAppointments(data.appointments || []);
      } else {
        setAppointments(data || []);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPets = useCallback(async () => {
    try {
      const response = await fetch(`${BASE_URL}/getPets`);
      const data = await response.json();
      setPets(data);
    } catch (error) {
      console.error("Error fetching pets:", error);
    }
  }, []);

  const fetchVets = useCallback(async () => {
    try {
      const response = await fetch(`${BASE_URL}/getVets`);
      const data = await response.json();
      setVets(data);
    } catch (error) {
      console.error("Error fetching vets:", error);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
    fetchPets();
    fetchVets();
  }, [fetchAppointments, fetchPets, fetchVets]);

  const openAdd = () => {
    setEditing(null);
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = "09:00";
    
    setForm({
      pet_id: "",
      vet_id: "",
      appointment_date: dateStr,
      appointment_time: timeStr,
      duration_minutes: 30,
      reason: "",
      status: "Scheduled",
      notes: "",
    });
    setPetSearch("");
    setVetSearch("");
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    const datetime = item.appointment_date ? new Date(item.appointment_date) : new Date();
    const dateStr = datetime.toISOString().split('T')[0];
    const timeStr = datetime.toTimeString().slice(0, 5);
    
    setForm({
      pet_id: item.pet_id || item.petIdForJson || "",
      vet_id: item.vet_id || item.vetIdForJson || "",
      appointment_date: dateStr,
      appointment_time: timeStr,
      duration_minutes: item.duration_minutes || 30,
      reason: item.reason || "",
      status: item.status || "Scheduled",
      notes: item.notes || "",
    });
    
    const selectedPet = pets.find(p => p.pet_id === (item.pet_id || item.petIdForJson));
    const selectedVet = vets.find(v => v.vet_id === (item.vet_id || item.vetIdForJson));
    setPetSearch(selectedPet ? selectedPet.pet_name : "");
    setVetSearch(selectedVet ? selectedVet.vet_name : "");
    setModalOpen(true);
  };

  const handleDelete = async (item) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
    
    try {
      const response = await fetch(`${BASE_URL}/deleteAppointment/${item.appointment_id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        showNotification("Appointment cancelled successfully", "success");
        fetchAppointments();
      } else {
        showNotification(data.message || "Failed to cancel appointment", "error");
      }
    } catch (error) {
      console.error("Error deleting appointment:", error);
      showNotification("Failed to cancel appointment", "error");
    }
  };

  // ✅ FIXED: Status change function
  const handleStatusChange = async (appointment, newStatus) => {
    try {
      // ✅ Properly preserve the original datetime without timezone conversion
      let datetimeStr;
      
      if (appointment.appointment_date) {
        const datetime = new Date(appointment.appointment_date);
        const year = datetime.getFullYear();
        const month = String(datetime.getMonth() + 1).padStart(2, '0');
        const day = String(datetime.getDate()).padStart(2, '0');
        const hours = String(datetime.getHours()).padStart(2, '0');
        const minutes = String(datetime.getMinutes()).padStart(2, '0');
        const seconds = String(datetime.getSeconds()).padStart(2, '0');
        
        datetimeStr = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
      } else {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        datetimeStr = `${year}-${month}-${day}T09:00:00`;
      }
      
      const updatedAppointment = {
        appointment_id: appointment.appointment_id,
        pet_id: appointment.pet_id || appointment.petIdForJson,
        vet_id: appointment.vet_id || appointment.vetIdForJson,
        appointment_date: datetimeStr,
        duration_minutes: appointment.duration_minutes || 30,
        reason: appointment.reason,
        status: newStatus,
        notes: appointment.notes || "",
      };

      console.log('Sending status update:', updatedAppointment);

      const response = await fetch(`${BASE_URL}/updateAppointment`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedAppointment),
      });
      
      const data = await response.json();
      
      if (data.success) {
        showNotification(`✅ Appointment marked as ${newStatus}`, "success");
        fetchAppointments();
      } else {
        showNotification(data.message || "Failed to update status", "error");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      showNotification("Failed to update status", "error");
    }
  };

  // ✅ Validate time is within business hours
  const validateBusinessHours = (time) => {
    if (!time) return false;
    
    const [hours, minutes] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    
    const businessStart = 9 * 60;
    const businessEnd = 17 * 60;
    
    return totalMinutes >= businessStart && totalMinutes < businessEnd;
  };

  const handleSubmit = async () => {
    if (!form.pet_id) {
      showNotification("Please select a pet", "error");
      return;
    }
    
    if (!form.vet_id) {
      showNotification("Please select a veterinarian", "error");
      return;
    }
    
    if (!form.appointment_date) {
      showNotification("Please select a date", "error");
      return;
    }
    
    if (!form.appointment_time) {
      showNotification("Please select a time", "error");
      return;
    }

    if (!validateBusinessHours(form.appointment_time)) {
      showNotification("⏰ Appointments can only be booked between 9:00 AM and 5:00 PM", "error");
      return;
    }

    const selectedDateTime = new Date(`${form.appointment_date}T${form.appointment_time}`);
    const now = new Date();
    
    if (selectedDateTime < now) {
      showNotification("Cannot book appointments in the past. Please select a future date and time.", "error");
      return;
    }

    try {
      setLoading(true);
      
      const datetimeStr = `${form.appointment_date}T${form.appointment_time}:00`;
      
      const appointmentData = {
        pet_id: Number(form.pet_id),
        vet_id: Number(form.vet_id),
        appointment_date: datetimeStr,
        duration_minutes: Number(form.duration_minutes) || 30,
        reason: form.reason,
        status: form.status,
        notes: form.notes,
      };

      let response;
      if (editing) {
        appointmentData.appointment_id = editing.appointment_id;
        response = await fetch(`${BASE_URL}/updateAppointment`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(appointmentData),
        });
      } else {
        response = await fetch(`${BASE_URL}/addAppointment`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(appointmentData),
        });
      }
      
      const data = await response.json();
      
      if (data.success) {
        showNotification(
          editing ? "✅ Appointment updated successfully!" : "✅ Appointment booked successfully!",
          "success"
        );
        setModalOpen(false);
        fetchAppointments();
      } else {
        showNotification(data.message || "Failed to save appointment", "error");
      }
    } catch (error) {
      console.error("Error saving appointment:", error);
      showNotification("Failed to save appointment. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const filteredPets = pets.filter(p => 
    p.pet_name?.toLowerCase().includes(petSearch.toLowerCase())
  );

  const filteredVets = vets.filter(v => 
    v.vet_name?.toLowerCase().includes(vetSearch.toLowerCase())
  );

  const filtered = appointments.filter(a => {
    const matchesSearch = 
      (a.petName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.vetName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.reason || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "All" || a.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="main-content page-container">
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
        
        .duration-selector {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          margin-top: 8px;
        }
        
        .duration-option {
          padding: 12px;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 600;
          font-size: 14px;
          background: white;
        }
        
        .duration-option:hover {
          border-color: #667eea;
          background: #f8fafc;
          transform: translateY(-2px);
        }
        
        .duration-option.active {
          border-color: #667eea;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }
        
        .time-warning {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          background: #fef3c7;
          border: 1px solid #fbbf24;
          border-radius: 8px;
          margin-top: 8px;
          font-size: 13px;
          color: #92400e;
          font-weight: 600;
        }
        
        .time-input-wrapper {
          position: relative;
        }
        
        .time-input-wrapper.invalid input {
          border-color: #ef4444;
          background: #fef2f2;
        }
      `}</style>

      {notification.show && (
        <div className={`notification-toast ${notification.type}`}>
          <span className="notification-icon">
            {notification.type === "success" && "✅"}
            {notification.type === "error" && "❌"}
          </span>
          <div className="notification-message">{notification.message}</div>
        </div>
      )}

      <h2 className="page-title">📅 Appointments</h2>

      <div className="data-table">
        <div className="table-header">
          <div className="table-header-content">
            <h3 className="table-title">Manage Appointments</h3>
            <div className="table-actions">
              <div className="search-box">
                <svg className="search-icon" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search appointments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="form-select"
              >
                <option value="All">All Status</option>
                <option value="Scheduled">Scheduled</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <button onClick={openAdd} className="btn-add">
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Book Appointment
              </button>
            </div>
          </div>
        </div>

        <div className="table-wrapper">
          {loading ? (
            <div style={{textAlign: 'center', padding: '3rem', color: '#64748b'}}>
              <div style={{fontSize: '48px', marginBottom: '16px'}}>⏳</div>
              <div style={{fontSize: '16px', fontWeight: '600'}}>Loading appointments...</div>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{textAlign: 'center', padding: '3rem', color: '#64748b'}}>
              <div style={{fontSize: '48px', marginBottom: '16px'}}>📅</div>
              <div style={{fontSize: '16px', fontWeight: '600'}}>No appointments found</div>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Pet</th>
                  <th>Veterinarian</th>
                  <th>Date & Time</th>
                  <th>Duration</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((appointment) => (
                  <tr key={appointment.appointment_id}>
                    <td>
                      <strong>{appointment.petName || "Unknown"}</strong>
                    </td>
                    <td>
                      <span style={{color: '#667eea', fontWeight: '600'}}>
                        Dr. {appointment.vetName || "Unknown"}
                      </span>
                    </td>
                    <td>
                      {appointment.appointment_date 
                        ? new Date(appointment.appointment_date).toLocaleString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : "Not set"}
                    </td>
                    <td>
                      <span style={{
                        padding: '4px 10px',
                        background: '#f1f5f9',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: '600'
                      }}>
                        {appointment.duration_minutes || 30} min
                      </span>
                    </td>
                    <td>{appointment.reason || "-"}</td>
                    <td>
                      <span className={`status-badge ${appointment.status.toLowerCase().replace(' ', '-')}`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td>
                      {appointment.status === "Scheduled" && (
                        <>
                          <button
                            onClick={() => handleStatusChange(appointment, "Completed")}
                            className="btn-edit"
                            title="Mark as Completed"
                            style={{marginRight: '0.5rem', color: '#10b981'}}
                          >
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleStatusChange(appointment, "Cancelled")}
                            className="btn-delete"
                            title="Cancel Appointment"
                            style={{marginRight: '0.5rem'}}
                          >
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </>
                      )}
                      <button onClick={() => openEdit(appointment)} className="btn-edit" title="Edit">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button onClick={() => handleDelete(appointment)} className="btn-delete" title="Delete">
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
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{maxWidth: '600px'}}>
            <div className="modal-header">
              <h3 className="modal-title">
                {editing ? "✏️ Edit Appointment" : "📅 Book New Appointment"}
              </h3>
            </div>
            <div className="modal-form">
              
              {/* Pet Search */}
              <div style={{position: 'relative'}}>
                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem'}}>
                  Pet Name <span style={{color: '#ef4444'}}>*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search pet..."
                  value={petSearch}
                  onChange={(e) => {
                    setPetSearch(e.target.value);
                    setShowPetDropdown(true);
                  }}
                  onFocus={() => setShowPetDropdown(true)}
                />
                {showPetDropdown && filteredPets.length > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    maxHeight: '200px',
                    overflowY: 'auto',
                    background: 'white',
                    border: '1px solid #e6eef6',
                    borderRadius: '0.6rem',
                    marginTop: '0.25rem',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                    zIndex: 100
                  }}>
                    {filteredPets.slice(0, 10).map((pet) => (
                      <div
                        key={pet.pet_id}
                        onClick={() => {
                          setForm({ ...form, pet_id: pet.pet_id });
                          setPetSearch(pet.pet_name);
                          setShowPetDropdown(false);
                        }}
                        style={{
                          padding: '0.75rem',
                          cursor: 'pointer',
                          borderBottom: '1px solid #eef2f7',
                          background: form.pet_id === pet.pet_id ? '#eff6ff' : 'transparent',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#f8fafc'}
                        onMouseLeave={(e) => e.target.style.background = form.pet_id === pet.pet_id ? '#eff6ff' : 'transparent'}
                      >
                        <div style={{fontWeight: '600', color: '#0f172a'}}>{pet.pet_name}</div>
                        <div style={{fontSize: '0.85rem', color: '#64748b'}}>
                          {pet.species} • {pet.breed}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Vet Search */}
              <div style={{position: 'relative'}}>
                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem'}}>
                  Veterinarian <span style={{color: '#ef4444'}}>*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search veterinarian..."
                  value={vetSearch}
                  onChange={(e) => {
                    setVetSearch(e.target.value);
                    setShowVetDropdown(true);
                  }}
                  onFocus={() => setShowVetDropdown(true)}
                />
                {showVetDropdown && filteredVets.length > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    maxHeight: '200px',
                    overflowY: 'auto',
                    background: 'white',
                    border: '1px solid #e6eef6',
                    borderRadius: '0.6rem',
                    marginTop: '0.25rem',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                    zIndex: 100
                  }}>
                    {filteredVets.slice(0, 10).map((vet) => (
                      <div
                        key={vet.vet_id}
                        onClick={() => {
                          setForm({ ...form, vet_id: vet.vet_id });
                          setVetSearch(vet.vet_name);
                          setShowVetDropdown(false);
                        }}
                        style={{
                          padding: '0.75rem',
                          cursor: 'pointer',
                          borderBottom: '1px solid #eef2f7',
                          background: form.vet_id === vet.vet_id ? '#eff6ff' : 'transparent',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#f8fafc'}
                        onMouseLeave={(e) => e.target.style.background = form.vet_id === vet.vet_id ? '#eff6ff' : 'transparent'}
                      >
                        <div style={{fontWeight: '600', color: '#0f172a'}}>Dr. {vet.vet_name}</div>
                        <div style={{fontSize: '0.85rem', color: '#64748b'}}>
                          {vet.specialization}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Date and Time */}
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem'}}>
                    Date <span style={{color: '#ef4444'}}>*</span>
                  </label>
                  <input
                    type="date"
                    className="form-input"
                    value={form.appointment_date}
                    onChange={(e) => setForm({ ...form, appointment_date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem'}}>
                    Time <span style={{color: '#ef4444'}}>*</span>
                  </label>
                  <div className={`time-input-wrapper ${form.appointment_time && !validateBusinessHours(form.appointment_time) ? 'invalid' : ''}`}>
                    <input
                      type="time"
                      className="form-input"
                      value={form.appointment_time}
                      onChange={(e) => setForm({ ...form, appointment_time: e.target.value })}
                      min="09:00"
                      max="17:00"
                      step="900"
                    />
                  </div>
                  {form.appointment_time && !validateBusinessHours(form.appointment_time) && (
                    <div className="time-warning">
                      <span>⚠️</span>
                      <span>Time must be between 9:00 AM - 5:00 PM</span>
                    </div>
                  )}
                  {(!form.appointment_time || validateBusinessHours(form.appointment_time)) && (
                    <div style={{fontSize: '12px', color: '#10b981', marginTop: '4px', fontWeight: '600'}}>
                      ✓ Business hours: 9:00 AM - 5:00 PM
                    </div>
                  )}
                </div>
              </div>

              {/* Duration */}
              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem'}}>
                  Appointment Duration
                </label>
                <div className="duration-selector">
                  {[15, 30, 45, 60].map((duration) => (
                    <div
                      key={duration}
                      className={`duration-option ${form.duration_minutes === duration ? 'active' : ''}`}
                      onClick={() => setForm({ ...form, duration_minutes: duration })}
                    >
                      {duration} min
                    </div>
                  ))}
                </div>
              </div>

              {/* Reason */}
              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem'}}>
                  Reason for Visit
                </label>
                <textarea
                  className="form-textarea"
                  placeholder="E.g., Annual checkup, vaccination, dental cleaning..."
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  rows="3"
                />
              </div>

              {/* Notes */}
              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem'}}>
                  Additional Notes (Optional)
                </label>
                <textarea
                  className="form-textarea"
                  placeholder="Any special instructions or concerns..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows="2"
                />
              </div>

              {/* Status - only show when editing */}
              {editing && (
                <div>
                  <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem'}}>
                    Status
                  </label>
                  <select
                    className="form-select"
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              )}

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
                  disabled={loading || (form.appointment_time && !validateBusinessHours(form.appointment_time))}
                >
                  {loading ? "⏳ Saving..." : (editing ? "Update Appointment" : "Book Appointment")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;