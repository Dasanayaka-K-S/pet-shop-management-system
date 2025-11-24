// src/Pages/Owners.jsx
import React, { useState, useEffect } from "react";
import "../App.css";

const Owners = ({ owners, setOwners }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    owner_name: "",
    owner_email: "",
    owner_phone: "",
    owner_address: "",
  });

  const fetchOwners = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8080/api/app/getOwners");
      if (!res.ok) throw new Error("Failed to fetch Owners");
      const data = await res.json();
      setOwners(data);
    } catch (err) {
      console.error("Failed to load Owners", err);
      alert("Failed to load owners. Please check if the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwners();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({
      owner_name: "",
      owner_email: "",
      owner_phone: "",
      owner_address: "",
    });
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      owner_name: item.owner_name,
      owner_email: item.owner_email,
      owner_phone: item.owner_phone,
      owner_address: item.owner_address,
    });
    setModalOpen(true);
  };

  const handleDelete = async (item) => {
    if (!window.confirm("Delete this owner?")) return;
    
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:8080/api/app/deleteOwner/${item.owner_id}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) throw new Error("Failed to delete owner");
      
      setOwners(owners.filter((o) => o.owner_id !== item.owner_id));
      alert("Owner deleted successfully!");
    } catch (err) {
      console.error("Failed to delete owner", err);
      alert("Failed to delete owner.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.owner_name.trim()) {
      alert("Name is required");
      return;
    }

    try {
      setLoading(true);
      
      if (editing) {
        const updatedOwner = {
          owner_id: editing.owner_id,
          owner_name: form.owner_name,
          owner_email: form.owner_email,
          owner_phone: form.owner_phone,
          owner_address: form.owner_address,
        };

        const res = await fetch("http://localhost:8080/api/app/updateOwner", {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedOwner),
        });

        if (!res.ok) throw new Error("Failed to update owner");
        const data = await res.json();
        setOwners(owners.map((o) => (o.owner_id === editing.owner_id ? data : o)));
        alert("Owner updated successfully!");
      } else {
        const newOwner = {
          owner_name: form.owner_name,
          owner_email: form.owner_email,
          owner_phone: form.owner_phone,
          owner_address: form.owner_address,
        };

        const res = await fetch("http://localhost:8080/api/app/saveOwner", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newOwner),
        });

        if (!res.ok) throw new Error("Failed to save owner");
        const data = await res.json();
        setOwners([...owners, data]);
        alert("Owner added successfully!");
      }

      setModalOpen(false);
    } catch (err) {
      console.error("Failed to save owner", err);
      alert("Failed to save owner.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED: Working search filter
  const filtered = owners.filter((owner) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (owner.owner_name || "").toLowerCase().includes(searchLower) ||
      (owner.owner_email || "").toLowerCase().includes(searchLower) ||
      (owner.owner_phone || "").toLowerCase().includes(searchLower) ||
      (owner.owner_address || "").toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="main-content page-container">
      <h2 className="page-title">👤 Owners</h2>

      <div className="data-table">
        <div className="table-header">
          <div className="table-header-content">
            <h3 className="table-title">Manage Owners</h3>
            <div className="table-actions">
              {/* ✅ SEARCH INPUT */}
              <div className="search-box">
                <svg className="search-icon" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search owners..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button onClick={openAdd} className="btn-add">
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Add Owner
              </button>
            </div>
          </div>
        </div>

        <div className="table-wrapper">
          {loading ? (
            <div style={{textAlign: 'center', padding: '3rem', color: '#64748b'}}>
              <div style={{fontSize: '48px', marginBottom: '16px'}}>⏳</div>
              <div style={{fontSize: '16px', fontWeight: '600'}}>Loading owners...</div>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{textAlign: 'center', padding: '3rem', color: '#64748b'}}>
              <div style={{fontSize: '48px', marginBottom: '16px'}}>👤</div>
              <div style={{fontSize: '16px', fontWeight: '600'}}>
                {searchTerm ? "No owners found matching your search" : "No owners found"}
              </div>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((owner) => (
                  <tr key={owner.owner_id}>
                    <td><strong>{owner.owner_name}</strong></td>
                    <td>{owner.owner_email || "-"}</td>
                    <td>{owner.owner_phone || "-"}</td>
                    <td>{owner.owner_address || "-"}</td>
                    <td>
                      <button onClick={() => openEdit(owner)} className="btn-edit" title="Edit">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button onClick={() => handleDelete(owner)} className="btn-delete" title="Delete">
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
                {editing ? "✏️ Edit Owner" : "➕ Add New Owner"}
              </h3>
            </div>
            <div className="modal-form">
              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem'}}>
                  Full Name <span style={{color: '#ef4444'}}>*</span>
                </label>
                <input
                  className="form-input"
                  placeholder="John Doe"
                  value={form.owner_name}
                  onChange={(e) => setForm({ ...form, owner_name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem'}}>
                  Email
                </label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="john@example.com"
                  value={form.owner_email}
                  onChange={(e) => setForm({ ...form, owner_email: e.target.value })}
                />
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem'}}>
                  Phone
                </label>
                <input
                  className="form-input"
                  placeholder="+1 234 567 8900"
                  value={form.owner_phone}
                  onChange={(e) => setForm({ ...form, owner_phone: e.target.value })}
                />
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem'}}>
                  Address
                </label>
                <textarea
                  className="form-textarea"
                  placeholder="123 Main St, City, State"
                  value={form.owner_address}
                  onChange={(e) => setForm({ ...form, owner_address: e.target.value })}
                  rows="3"
                />
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
                  {loading ? "Saving..." : (editing ? "Update Owner" : "Add Owner")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Owners;