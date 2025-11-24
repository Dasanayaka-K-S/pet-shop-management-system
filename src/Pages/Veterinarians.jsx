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

  const handleSubmit = async (e) => {
    // Check if e exists and has preventDefault
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    if (!form.vet_name.trim()) {
      alert("Name is required");
      return;
    }

    try {
      setLoading(true);
      
      if (editing) {
        // Update existing veterinarian
        const updatedVet = {
          vet_id: editing.vet_id,
          vet_name: form.vet_name,
          specialization: form.specialization,
          phone: form.phone,
          email: form.email,
          experience_years: form.experience_years,
          availability: form.availability,
          created_at: editing.created_at,
          updated_at: new Date().toISOString().slice(0, 19).replace("T", " "),
        };

        const res = await fetch("http://localhost:8080/api/app/updateVet", {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(vetData),
        });

        if (!res.ok) throw new Error("Failed to update vet");
        const data = await res.json();
        
        // Update local state
        setVets(vets.map((v) => (v.vet_id === editing.vet_id ? data : v)));
        alert("Veterinarian updated successfully!");
      } else {
        // Add new veterinarian
        const newVet = {
          vet_name: form.vet_name,
          specialization: form.specialization,
          phone: form.phone,
          email: form.email,
          experience_years: form.experience_years,
          availability: form.availability,
          created_at: new Date().toISOString().slice(0, 19).replace("T", " "),
        };

        const res = await fetch("http://localhost:8080/api/app/addVet", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(vetData),
        });

        if (!res.ok) throw new Error("Failed to save vet");
        const data = await res.json();
        
        // Update local state
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
      <h2 className="page-title">Veterinarians</h2>

      {loading && <div className="loading-indicator">Loading...</div>}

      <DataTable
        title="Veterinarians"
        data={filtered}
        columns={columns}
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={handleDelete}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <Modal
        isOpen={modalOpen}
        title={editing ? "Edit Veterinarian" : "Add Veterinarian"}
        onCancel={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      >
        <input
          className="form-input"
          placeholder="Full Name"
          value={form.vet_name}
          onChange={(e) => setForm({ ...form, vet_name: e.target.value })}
          required
        />
        <input
          className="form-input"
          placeholder="Specialization (e.g. Surgery, Dental)"
          value={form.specialization}
          onChange={(e) =>
            setForm({ ...form, specialization: e.target.value })
          }
        />
        <input
          className="form-input"
          placeholder="Phone Number"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <input
          className="form-input"
          type="email"
          placeholder="Email Address (abc@gmail.com)"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          className="form-input"
          placeholder="Years of Experience"
          type="number"
          value={form.experience_years}
          onChange={(e) =>
            setForm({ ...form, experience_years: e.target.value })
          }
        />
        <input
          className="form-input"
          placeholder="Availability (e.g. Mon–Fri 9AM–5PM)"
          value={form.availability}
          onChange={(e) =>
            setForm({ ...form, availability: e.target.value })
          }
        />
      </Modal>
    </div>
  );
};

export default Veterinarians;