// src/Pages/Veterinarians.jsx
import React, { useState, useEffect } from "react";
import "../App.css";

const Veterinarians = ({ vets, setVets }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    vet_name: "",
    specialization: "",
    phone: "",
    email: "",
    experience_years: "",
    availability: "",
  });

  const fetchVets = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8080/api/app/getVets");
      if (!res.ok) throw new Error("Failed to fetch Vets");
      const data = await res.json();
      setVets(data);
    } catch (err) {
      console.error("Failed to load Vets", err);
      alert("Failed to load veterinarians.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVets();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({
      vet_name: "",
      specialization: "",
      phone: "",
      email: "",
      experience_years: "",
      availability: "",
    });
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      vet_name: item.vet_name,
      specialization: item.specialization,
      phone: item.phone,
      email: item.email,
      experience_years: item.experience_years,
      availability: item.availability,
    });
    setModalOpen(true);
  };

  const handleDelete = async (item) => {
    if (!window.confirm("Delete this veterinarian?")) return;
    
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:8080/api/app/deleteVet/${item.vet_id}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) throw new Error("Failed to delete vet");
      
      setVets(vets.filter((v) => v.vet_id !== item.vet_id));
      alert("Veterinarian deleted successfully!");
    } catch (err) {
      console.error("Failed to delete vet", err);
      alert("Failed to delete veterinarian.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.vet_name.trim()) {
      alert("Name is required");
      return;
    }

    try {
      setLoading(true);
      
      const vetData = {
        vet_name: form.vet_name,
        specialization: form.specialization,
        phone: form.phone,
        email: form.email,
        experience_years: form.experience_years ? parseInt(form.experience_years) : 0,
        availability: form.availability,
      };

      if (editing) {
        vetData.vet_id = editing.vet_id;
        
        const res = await fetch("http://localhost:8080/api/app/updateVet", {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(vetData),
        });

        if (!res.ok) throw new Error("Failed to update vet");
        const data = await res.json();
        setVets(vets.map((v) => (v.vet_id === editing.vet_id ? data : v)));
        alert("Veterinarian updated successfully!");
      } else {
        const res = await fetch("http://localhost:8080/api/app/addVet", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(vetData),
        });

        if (!res.ok) throw new Error("Failed to save vet");
        const data = await res.json();
        setVets([...vets, data]);
        alert("Veterinarian added successfully!");
      }

      setModalOpen(false);
    } catch (err) {
      console.error("Failed to save vet", err);
      alert("Failed to save veterinarian.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED: Working search filter
  const filtered = vets.filter((vet) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (vet.vet_name || "").toLowerCase().includes(searchLower) ||
      (vet.specialization || "").toLowerCase().includes(searchLower) ||
      (vet.email || "").toLowerCase().includes(searchLower) ||
      (vet.phone || "").toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="main-content page-container">
      <h2 className="page-title">⚕️ Veterinarians</h2>

      <div className="data-table">
        <div className="table-header">
          <div className="table-header-content">
            <h3 className="table-title">Manage Veterinarians</h3>
            <div className="table-actions">
              {/* ✅ SEARCH INPUT */}
              <div className="search-box">
                <svg className="search-icon" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search veterinarians..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button onClick={openAdd} className="btn-add">
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Add Veterinarian
              </button>
            </div>
          </div>
        </div>

        <div className="table-wrapper">
          {loading ? (
            <div style={{textAlign: 'center', padding: '3rem', color: '#64748b'}}>
              <div style={{fontSize: '48px', marginBottom: '16px'}}>⏳</div>
              <div style={{fontSize: '16px', fontWeight: '600'}}>Loading veterinarians...</div>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{textAlign: 'center', padding: '3rem', color: '#64748b'}}>
              <div style={{fontSize: '48px', marginBottom: '16px'}}>⚕️</div>
              <div style={{fontSize: '16px', fontWeight: '600'}}>
                {searchTerm ? "No veterinarians found matching your search" : "No veterinarians found"}
              </div>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Specialization</th>
                  <th>Experience</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Availability</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((vet) => (
                  <tr key={vet.vet_id}>
                    <td><strong>Dr. {vet.vet_name}</strong></td>
                    <td>{vet.specialization || "-"}</td>
                    <td>{vet.experience_years ? `${vet.experience_years} years` : "-"}</td>
                    <td>{vet.phone || "-"}</td>
                    <td>{vet.email || "-"}</td>
                    <td>
                      <span style={{
                        padding: '4px 10px',
                        background: vet.availability === 'Available' ? '#dcfce7' : '#fee2e2',
                        color: vet.availability === 'Available' ? '#15803d' : '#b91c1c',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: '600'
                      }}>
                        {vet.availability || "Unknown"}
                      </span>
                    </td>
                    <td>
                      <button onClick={() => openEdit(vet)} className="btn-edit" title="Edit">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button onClick={() => handleDelete(vet)} className="btn-delete" title="Delete">
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

      {/* Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {editing ? "✏️ Edit Veterinarian" : "➕ Add New Veterinarian"}
              </h3>
            </div>
            <div className="modal-form">
              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem'}}>
                  Full Name <span style={{color: '#ef4444'}}>*</span>
                </label>
                <input
                  className="form-input"
                  placeholder="John Smith"
                  value={form.vet_name}
                  onChange={(e) => setForm({ ...form, vet_name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem'}}>
                  Specialization
                </label>
                <input
                  className="form-input"
                  placeholder="Surgery, Dentistry, etc."
                  value={form.specialization}
                  onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                />
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem'}}>
                    Phone
                  </label>
                  <input
                    className="form-input"
                    placeholder="+1 234 567 8900"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem'}}>
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="doctor@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem'}}>
                    Experience (years)
                  </label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="5"
                    value={form.experience_years}
                    onChange={(e) => setForm({ ...form, experience_years: e.target.value })}
                    min="0"
                  />
                </div>

                <div>
                  <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem'}}>
                    Availability
                  </label>
                  <select
                    className="form-select"
                    value={form.availability}
                    onChange={(e) => setForm({ ...form, availability: e.target.value })}
                  >
                    <option value="">Select Status</option>
                    <option value="Available">Available</option>
                    <option value="Busy">Busy</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>
              </div>

              <div className="modal-buttons">
                <button 
                  onClick={() => setModalOpen(false)} 
                  className="btn-cancel"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSubmit} 
                  className="btn-submit"
                  disabled={loading}
                >
                  {loading ? "Saving..." : (editing ? "Update Veterinarian" : "Add Veterinarian")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Veterinarians;