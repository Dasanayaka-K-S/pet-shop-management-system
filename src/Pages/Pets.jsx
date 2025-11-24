// src/Pages/Pets.jsx
import React, { useState, useEffect } from "react";
import "../App.css";

const Pets = ({ pets, setPets, owners }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    pet_name: "",
    species: "",
    breed: "",
    age: "",
    gender: "",
    owner_id: "",
  });

  const fetchPets = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8080/api/app/getPets");
      if (!res.ok) throw new Error("Failed to fetch Pets");
      const data = await res.json();
      console.log("📦 Fetched pets:", data);
      setPets(data);
    } catch (err) {
      console.error("Failed to load Pets", err);
      alert("Failed to load pets. Please check if the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({
      pet_name: "",
      species: "",
      breed: "",
      age: "",
      gender: "",
      owner_id: "",
    });
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      pet_name: item.pet_name,
      species: item.species,
      breed: item.breed,
      age: item.age || "",
      gender: item.gender,
      owner_id: item.owner?.owner_id || "",
    });
    setModalOpen(true);
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete ${item.pet_name}?`)) return;
    
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:8080/api/app/deletePet/${item.pet_id}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }
      
      // Remove from local state
      setPets(pets.filter((p) => p.pet_id !== item.pet_id));
      alert("✅ Pet deleted successfully!");
    } catch (err) {
      console.error("Failed to delete pet:", err);
      alert(`Failed to delete pet: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!form.pet_name.trim()) {
      alert("❌ Pet name is required!");
      return;
    }

    if (!form.owner_id) {
      alert("❌ Please select an owner!");
      return;
    }

    try {
      setLoading(true);
      
      // ✅ Prepare data to match backend Pet entity
      const petData = {
        pet_name: form.pet_name.trim(),
        species: form.species || null,
        breed: form.breed || null,
        age: form.age ? parseInt(form.age) : null,
        gender: form.gender || null,
        // Try all possible field names for owner
        owner_id: parseInt(form.owner_id),
        ownerId: parseInt(form.owner_id),
        ownerIdForJson: parseInt(form.owner_id),
      };

      if (editing) {
        // ✅ UPDATE: Include pet_id for update
        petData.pet_id = editing.pet_id;
        
        console.log("✏️ Updating pet:", petData);
        
        const res = await fetch("http://localhost:8080/api/app/updatePet", {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(petData),
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error("❌ Backend error:", errorText);
          throw new Error(`Update failed: ${errorText}`);
        }
        
        const updatedPet = await res.json();
        console.log("✅ Updated pet:", updatedPet);
        
        // Update local state
        setPets(pets.map((p) => (p.pet_id === editing.pet_id ? updatedPet : p)));
        alert("✅ Pet updated successfully!");
        setModalOpen(false);
        
      } else {
        // ✅ ADD NEW: Use /addPet endpoint (not /savePet)
        console.log("➕ Adding new pet:", petData);
        
        const res = await fetch("http://localhost:8080/api/app/addPet", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(petData),
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error("❌ Backend error:", errorText);
          throw new Error(`Save failed: ${errorText}`);
        }
        
        const savedPet = await res.json();
        console.log("✅ Saved pet:", savedPet);
        
        // Add to local state
        setPets([...pets, savedPet]);
        alert("🎉 Pet added successfully!");
        setModalOpen(false);
      }

      // Refresh pets list to get updated data from backend
      fetchPets();

    } catch (err) {
      console.error("❌ Error:", err);
      
      // User-friendly error messages
      if (err.message.includes("owner") || err.message.includes("Owner")) {
        alert("❌ Owner not found. Please select a valid owner.");
      } else if (err.message.includes("constraint")) {
        alert("❌ Database error. Please check your data.");
      } else {
        alert(`❌ Failed to save pet: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Working search filter
  const filtered = pets.filter((pet) => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    const ownerName = pet.owner?.owner_name || "";
    
    return (
      (pet.pet_name || "").toLowerCase().includes(searchLower) ||
      (pet.species || "").toLowerCase().includes(searchLower) ||
      (pet.breed || "").toLowerCase().includes(searchLower) ||
      (pet.gender || "").toLowerCase().includes(searchLower) ||
      ownerName.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="main-content page-container">
      <h2 className="page-title">🐾 Pets Management</h2>

      <div className="data-table">
        <div className="table-header">
          <div className="table-header-content">
            <h3 className="table-title">Manage Pets</h3>
            <div className="table-actions">
              {/* ✅ SEARCH INPUT */}
              <div className="search-box">
                <svg className="search-icon" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search pets by name, species, breed..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button onClick={openAdd} className="btn-add">
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Add Pet
              </button>
            </div>
          </div>
        </div>

        <div className="table-wrapper">
          {loading && !modalOpen ? (
            <div style={{textAlign: 'center', padding: '3rem', color: '#64748b'}}>
              <div style={{fontSize: '48px', marginBottom: '16px'}}>⏳</div>
              <div style={{fontSize: '16px', fontWeight: '600'}}>Loading pets...</div>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{textAlign: 'center', padding: '3rem', color: '#64748b'}}>
              <div style={{fontSize: '48px', marginBottom: '16px'}}>🐾</div>
              <div style={{fontSize: '16px', fontWeight: '600', marginBottom: '8px'}}>
                {searchTerm ? "No pets found matching your search" : "No pets found"}
              </div>
              {!searchTerm && (
                <button onClick={openAdd} className="btn-add" style={{marginTop: '16px'}}>
                  Add Your First Pet
                </button>
              )}
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Pet Name</th>
                  <th>Species</th>
                  <th>Breed</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Owner</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((pet) => (
                  <tr key={pet.pet_id}>
                    <td><span style={{color: '#94a3b8', fontSize: '13px'}}>#{pet.pet_id}</span></td>
                    <td><strong>{pet.pet_name}</strong></td>
                    <td>
                      <span style={{
                        padding: '4px 10px',
                        background: pet.species === 'Dog' ? '#dbeafe' : pet.species === 'Cat' ? '#fce7f3' : '#e0e7ff',
                        color: pet.species === 'Dog' ? '#1e40af' : pet.species === 'Cat' ? '#9f1239' : '#4338ca',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: '600'
                      }}>
                        {pet.species || "-"}
                      </span>
                    </td>
                    <td>{pet.breed || "-"}</td>
                    <td>{pet.age ? `${pet.age} years` : "-"}</td>
                    <td>
                      <span style={{
                        padding: '4px 10px',
                        background: pet.gender === 'Male' ? '#dbeafe' : '#fce7f3',
                        color: pet.gender === 'Male' ? '#1e40af' : '#9f1239',
                        borderRadius: '6px',
                        fontSize: '13px'
                      }}>
                        {pet.gender || "-"}
                      </span>
                    </td>
                    <td>
                      <span style={{color: '#667eea', fontWeight: '600'}}>
                        {pet.owner?.owner_name || "Unknown"}
                      </span>
                    </td>
                    <td>
                      <button 
                        onClick={() => openEdit(pet)} 
                        className="btn-edit" 
                        title="Edit"
                        disabled={loading}
                      >
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => handleDelete(pet)} 
                        className="btn-delete" 
                        title="Delete"
                        disabled={loading}
                      >
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
                {editing ? "✏️ Edit Pet" : "➕ Add New Pet"}
              </h3>
            </div>
            <div className="modal-form">
              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem'}}>
                  Pet Name <span style={{color: '#ef4444'}}>*</span>
                </label>
                <input
                  className="form-input"
                  placeholder="e.g. Max, Bella, Charlie"
                  value={form.pet_name}
                  onChange={(e) => setForm({ ...form, pet_name: e.target.value })}
                  required
                />
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem'}}>
                    Species
                  </label>
                  <select
                    className="form-select"
                    value={form.species}
                    onChange={(e) => setForm({ ...form, species: e.target.value })}
                  >
                    <option value="">Select Species</option>
                    <option value="Dog">🐕 Dog</option>
                    <option value="Cat">🐈 Cat</option>
                    <option value="Bird">🐦 Bird</option>
                    <option value="Rabbit">🐰 Rabbit</option>
                    <option value="Hamster">🐹 Hamster</option>
                    <option value="Fish">🐠 Fish</option>
                    <option value="Other">🐾 Other</option>
                  </select>
                </div>

                <div>
                  <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem'}}>
                    Breed
                  </label>
                  <input
                    className="form-input"
                    placeholder="e.g. Golden Retriever, Persian"
                    value={form.breed}
                    onChange={(e) => setForm({ ...form, breed: e.target.value })}
                  />
                </div>
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem'}}>
                    Age (years)
                  </label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="3"
                    value={form.age}
                    onChange={(e) => setForm({ ...form, age: e.target.value })}
                    min="0"
                    max="50"
                  />
                </div>

                <div>
                  <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem'}}>
                    Gender
                  </label>
                  <select
                    className="form-select"
                    value={form.gender}
                    onChange={(e) => setForm({ ...form, gender: e.target.value })}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">♂️ Male</option>
                    <option value="Female">♀️ Female</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem'}}>
                  Owner <span style={{color: '#ef4444'}}>*</span>
                </label>
                <select
                  className="form-select"
                  value={form.owner_id}
                  onChange={(e) => setForm({ ...form, owner_id: e.target.value })}
                  required
                >
                  <option value="">Select Owner</option>
                  {owners && owners.length > 0 ? (
                    owners.map((owner) => (
                      <option key={owner.owner_id} value={owner.owner_id}>
                        {owner.owner_name} {owner.owner_email ? `(${owner.owner_email})` : ''}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>No owners available</option>
                  )}
                </select>
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
                  {loading ? (
                    <>⏳ Saving...</>
                  ) : editing ? (
                    <>✏️ Update Pet</>
                  ) : (
                    <>➕ Add Pet</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pets;