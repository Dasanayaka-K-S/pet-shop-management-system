// src/Pages/TreatmentPrescription.jsx
import React, { useState } from "react";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import "../App.css";

const TreatmentPrescription = ({ treatments, setTreatments, appointments }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    appointment_id: "",
    description: "",
    medicine: "",
    cost: "",
    date: "",
  });

  // Table column configuration (for DataTable component)
  const columns = [
    { Header: "Appointment ID", accessor: "appointment_id" },
    { Header: "Description", accessor: "description" },
    { Header: "Medicine", accessor: "medicine" },
    { Header: "Cost (Rs)", accessor: "cost" },
    { Header: "Date", accessor: "date" },
  ];

  // --- Modal handlers ---
  const openAdd = () => {
    setEditing(null);
    setForm({
      appointment_id: "",
      description: "",
      medicine: "",
      cost: "",
      date: "",
    });
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      appointment_id: item.appointment_id,
      description: item.description,
      medicine: item.medicine,
      cost: item.cost,
      date: item.date,
    });
    setModalOpen(true);
  };

  const handleDelete = (item) => {
    if (!window.confirm("Delete this treatment record?")) return;
    setTreatments(treatments.filter((t) => t.treatment_id !== item.treatment_id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.appointment_id || !form.description || !form.medicine || !form.cost || !form.date) {
      alert("Please fill in all required fields.");
      return;
    }

    if (editing) {
      setTreatments(
        treatments.map((t) =>
          t.treatment_id === editing.treatment_id
            ? { ...t, ...form, cost: parseFloat(form.cost) }
            : t
        )
      );
    } else {
      setTreatments([
        ...treatments,
        { ...form, treatment_id: Date.now(), cost: parseFloat(form.cost) },
      ]);
    }
    setModalOpen(false);
  };

  // Filtered data for search
  const filtered = treatments.filter((t) =>
    Object.values(t)
      .some((v) => String(v).toLowerCase().includes(searchTerm.toLowerCase()))
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

      <DataTable
        title="Treatments"
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
        title={editing ? "Edit Treatment" : "Add Treatment"}
        onCancel={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      >
        {/* Appointment Dropdown */}
        <select
          name="appointment_id"
          className="form-input"
          value={form.appointment_id}
          onChange={(e) => setForm({ ...form, appointment_id: e.target.value })}
          required
        >
          <option value="">Select Appointment</option>
          {appointments.map((a) => (
            <option key={a.appointmentId} value={a.appointmentId}>
              #{a.appointmentId} — {a.petName}
            </option>
          ))}
        </select>

        <textarea
          name="description"
          className="form-input"
          placeholder="Treatment Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />

        <input
          name="medicine"
          className="form-input"
          placeholder="Prescribed Medicine"
          value={form.medicine}
          onChange={(e) => setForm({ ...form, medicine: e.target.value })}
          required
        />

        <input
          name="cost"
          type="number"
          step="0.01"
          className="form-input"
          placeholder="Treatment Cost (Rs)"
          value={form.cost}
          onChange={(e) => setForm({ ...form, cost: e.target.value })}
          required
        />

        <input
          name="date"
          type="date"
          className="form-input"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          required
        />
      </Modal>
    </div>
  );
};

export default TreatmentPrescription;