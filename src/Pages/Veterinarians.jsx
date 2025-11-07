// src/pages/Veterinarians.jsx
import React, { useState } from "react";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import "../App.css";

const Veterinarians = ({ vets, setVets }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: "",
    specialization: "",
    phone: "",
    email: "",
    experience_years: "",
    availability: "",
  });

  const columns = [
    { Header: "Name", accessor: "name" },
    { Header: "Specialization", accessor: "specialization" },
    { Header: "Phone", accessor: "phone" },
    { Header: "Email", accessor: "email" },
    { Header: "Experience (Years)", accessor: "experience_years" },
    { Header: "Availability", accessor: "availability" },
  ];

  // --- Handlers ---
  const openAdd = () => {
    setEditing(null);
    setForm({
      name: "",
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
      name: item.name,
      specialization: item.specialization,
      phone: item.phone,
      email: item.email,
      experience_years: item.experience_years,
      availability: item.availability,
    });
    setModalOpen(true);
  };

  const handleDelete = (item) => {
    if (!window.confirm("Delete veterinarian?")) return;
    setVets(vets.filter((v) => v.vet_id !== item.vet_id));
  };

  const handleSubmit = () => {
    if (!form.name.trim()) return;

    if (editing) {
      setVets(
        vets.map((v) =>
          v.vet_id === editing.vet_id ? { ...v, ...form } : v
        )
      );
    } else {
      setVets([
        ...vets,
        { ...form, vet_id: Date.now() },
      ]);
    }

    setModalOpen(false);
  };

  const filtered = vets.filter((v) =>
    Object.values(v).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // --- UI ---
  return (
    <div className="main-content page-container">
      <h2 className="page-title">Veterinarians</h2>

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
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <input
          className="form-input"
          placeholder="Full Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
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
