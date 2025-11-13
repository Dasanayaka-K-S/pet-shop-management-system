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

  const [form, setForm] = useState({
    pet_id: "",
    vet_id: "",
    appointment_date: "",
    appointment_time: "",
    reason: "",
    status: "Scheduled",
  });

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/getAppointments`);
      const data = await response.json();
      setAppointments(data);
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
    const timeStr = now.toTimeString().slice(0, 5);
    
    setForm({
      pet_id: "",
      vet_id: "",
      appointment_date: dateStr,
      appointment_time: timeStr,
      reason: "",
      status: "Scheduled",
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
      pet_id: item.pet_id || "",
      vet_id: item.vet_id || "",
      appointment_date: dateStr,
      appointment_time: timeStr,
      reason: item.reason || "",
      status: item.status || "Scheduled",
    });
    
    const selectedPet = pets.find(p => p.pet_id === item.pet_id);
    const selectedVet = vets.find(v => v.vet_id === item.vet_id);
    setPetSearch(selectedPet ? selectedPet.pet_name : "");
    setVetSearch(selectedVet ? selectedVet.vet_name : "");
    setModalOpen(true);
  };

  const handleDelete = async (item) => {
    if (!window.confirm("Delete this appointment?")) return;
    
    try {
      await fetch(`${BASE_URL}/deleteAppointment/${item.appointment_id}`, {
        method: 'DELETE',
      });
      fetchAppointments();
    } catch (error) {
      console.error("Error deleting appointment:", error);
      alert("Failed to delete appointment");
    }
  };

  const handleStatusChange = async (appointment, newStatus) => {
    try {
      const datetime = appointment.appointment_date ? new Date(appointment.appointment_date) : new Date();
      const updatedAppointment = {
        appointment_id: appointment.appointment_id,
        pet_id: appointment.pet_id,
        vet_id: appointment.vet_id,
        appointment_date: datetime.toISOString().slice(0, 16),
        reason: appointment.reason,
        status: newStatus,
      };

      await fetch(`${BASE_URL}/updateAppointment`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedAppointment),
      });
      
      fetchAppointments();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };

  const handleSubmit = async () => {
    if (!form.pet_id || !form.vet_id || !form.appointment_date) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      
      const datetimeStr = `${form.appointment_date}T${form.appointment_time}`;
      
      const appointmentData = {
        pet_id: Number(form.pet_id),
        vet_id: Number(form.vet_id),
        appointment_date: datetimeStr,
        reason: form.reason,
        status: form.status,
      };

      if (editing) {
        appointmentData.appointment_id = editing.appointment_id;
        await fetch(`${BASE_URL}/updateAppointment`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(appointmentData),
        });
      } else {
        await fetch(`${BASE_URL}/addAppointment`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(appointmentData),
        });
      }
      
      setModalOpen(false);
      fetchAppointments();
    } catch (error) {
      console.error("Error saving appointment:", error);
      alert("Failed to save appointment");
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
      <h2 className="page-title">Appointments</h2>

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
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <button onClick={openAdd} className="btn-add">
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Add
              </button>
            </div>
          </div>
        </div>

        <div className="table-wrapper">
          {loading ? (
            <div style={{textAlign: 'center', padding: '3rem', color: '#64748b'}}>
              Loading appointments...
            </div>
          ) : filtered.length === 0 ? (
            <div style={{textAlign: 'center', padding: '3rem', color: '#64748b'}}>
              No appointments found
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Pet</th>
                  <th>Veterinarian</th>
                  <th>Date & Time</th>
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
                    <td>{appointment.vetName || "Unknown"}</td>
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
                    <td>{appointment.reason || "-"}</td>
                    <td>
                      <span className={`status-badge ${appointment.status.toLowerCase()}`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td>
                      {appointment.status === "Scheduled" && (
                        <>
                          <button
                            onClick={() => handleStatusChange(appointment, "Completed")}
                            className="btn-edit"
                            title="Complete"
                            style={{marginRight: '0.5rem', color: '#10b981'}}
                          >
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleStatusChange(appointment, "Cancelled")}
                            className="btn-delete"
                            title="Cancel"
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
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{editing ? "Edit Appointment" : "Add Appointment"}</h3>
            </div>
            <div className="modal-form">
              
              <div style={{position: 'relative'}}>
                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem'}}>
                  Pet Name *
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
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
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
                          background: form.pet_id === pet.pet_id ? '#eff6ff' : 'transparent'
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

              <div style={{position: 'relative'}}>
                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem'}}>
                  Veterinarian *
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search vet..."
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
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
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
                          background: form.vet_id === vet.vet_id ? '#eff6ff' : 'transparent'
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#f8fafc'}
                        onMouseLeave={(e) => e.target.style.background = form.vet_id === vet.vet_id ? '#eff6ff' : 'transparent'}
                      >
                        <div style={{fontWeight: '600', color: '#0f172a'}}>{vet.vet_name}</div>
                        <div style={{fontSize: '0.85rem', color: '#64748b'}}>
                          {vet.specialization}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem'}}>
                  Date *
                </label>
                <input
                  type="date"
                  className="form-input"
                  value={form.appointment_date}
                  onChange={(e) => setForm({ ...form, appointment_date: e.target.value })}
                />
              </div>

              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem'}}>
                  Time *
                </label>
                <input
                  type="time"
                  className="form-input"
                  value={form.appointment_time}
                  onChange={(e) => setForm({ ...form, appointment_time: e.target.value })}
                />
              </div>

              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem'}}>
                  Reason
                </label>
                <textarea
                  className="form-textarea"
                  placeholder="Reason for visit..."
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                />
              </div>

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
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="modal-buttons">
                <button onClick={() => setModalOpen(false)} className="btn-cancel" style={{flex: 1}}>
                  Cancel
                </button>
                <button onClick={handleSubmit} className="btn-submit" style={{flex: 1}} disabled={loading}>
                  {loading ? "Saving..." : editing ? "Update" : "Save"}
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