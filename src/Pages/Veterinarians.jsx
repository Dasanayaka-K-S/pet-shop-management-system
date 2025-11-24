// src/pages/Veterinarians.jsx
import React, { useState, useEffect } from "react";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
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

  const columns = [
    { Header: "Name", accessor: "vet_name" },
    { Header: "Specialization", accessor: "specialization" },
    { Header: "Phone", accessor: "phone" },
    { Header: "Email", accessor: "email" },
    { Header: "Experience (Years)", accessor: "experience_years" },
    { Header: "Availability", accessor: "availability" },
  ];

  // Fetch veterinarians on component mount
  useEffect(() => {
    fetchVets();
  }, []);

  const fetchVets = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8080/api/app/getVets");
      if (!res.ok) throw new Error("Failed to fetch vets");
      const data = await res.json();
      setVets(data);
    } catch (err) {
      console.error("Failed to load vets", err);
      alert("Failed to load veterinarians. Please check if the backend is running.");
    } finally {
      setLoading(false);
    }
  };

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
    if (!window.confirm("Delete veterinarian?")) return;
    
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:8080/api/app/deleteVet/${item.vet_id}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) throw new Error("Failed to delete veterinarian");
      
      setVets(vets.filter((v) => v.vet_id !== item.vet_id));
      alert("Veterinarian deleted successfully!");
    } catch (err) {
      console.error("Failed to delete veterinarian", err);
      alert("Failed to delete veterinarian. Please add a DELETE endpoint in your Spring Boot controller.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    if (!form.vet_name.trim()) {
      alert("Veterinarian name is required");
      return;
    }

    try {
      setLoading(true);
      
      if (editing) {
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
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedVet),
        });

        if (!res.ok) throw new Error("Failed to update veterinarian");
        
        const data = await res.json();
        
        setVets(vets.map((v) => (v.vet_id === editing.vet_id ? data : v)));
        alert("Veterinarian updated successfully!");
      } else {
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
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newVet),
        });

        if (!res.ok) throw new Error("Failed to save veterinarian");
        
        const data = await res.json();
        
        setVets([...vets, data]);
        alert("Veterinarian added successfully!");
      }

      setModalOpen(false);
    } catch (err) {
      console.error("Failed to save veterinarian", err);
      alert("Failed to save veterinarian. Please check your backend connection.");
    } finally {
      setLoading(false);
    }
  };

  const filtered = vets.filter((v) =>
    Object.values(v).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="main-content page-container">
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
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '32px'
        }}>
          🩺
        </div>
        <div>
          <h2 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#1a1a2e',
            margin: '0'
          }}>Veterinarians</h2>
          <p style={{
            fontSize: '14px',
            color: '#6b7280',
            margin: '4px 0 0 0'
          }}>Manage veterinary staff and their specializations</p>
        </div>
      </div>

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