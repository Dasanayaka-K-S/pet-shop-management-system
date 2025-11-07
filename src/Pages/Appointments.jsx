// src/pages/Appointments.jsx
import React, { useState } from "react";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import "../App.css";

const Appointments = ({ appointments, setAppointments, pets, vets }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    pet_id: "",
    vet_id: "",
    appointment_date: "",
    reason: "",
    status: "Scheduled",
  });

  const columns = [
    { Header: "Pet", accessor: "petName" },
    { Header: "Veterinarian", accessor: "vetName" },
    { Header: "Date / Time", accessor: "appointment_date" },
    { Header: "Reason", accessor: "reason" },
    { Header: "Status", accessor: "status" },
  ];

  const openAdd = () => {
    setEditing(null);
    setForm({
      pet_id: "",
      vet_id: "",
      appointment_date: "",
      reason: "",
      status: "Scheduled",
    });
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      pet_id: item.pet_id,
      vet_id: item.vet_id,
      appointment_date: item.appointment_date,
      reason: item.reason,
      status: item.status,
    });
    setModalOpen(true);
  };

  const handleDelete = (item) => {
    if (!window.confirm("Delete appointment?")) return;
    setAppointments(
      appointments.filter((a) => a.appointment_id !== item.appointment_id)
    );
  };

  const handleSubmit = () => {
    if (!form.pet_id || !form.vet_id || !form.appointment_date) return;

    const petName =
      pets.find((p) => p.petId === Number(form.pet_id))?.name || "Unknown";
    const vetName =
      vets.find((v) => v.vet_id === Number(form.vet_id))?.name || "Unknown";

    if (editing) {
      setAppointments(
        appointments.map((a) =>
          a.appointment_id === editing.appointment_id
            ? {
                ...a,
                ...form,
                pet_id: Number(form.pet_id),
                vet_id: Number(form.vet_id),
                petName,
                vetName,
              }
            : a
        )
      );
    } else {
      setAppointments([
        ...appointments,
        {
          ...form,
          appointment_id: Date.now(),
          pet_id: Number(form.pet_id),
          vet_id: Number(form.vet_id),
          petName,
          vetName,
        },
      ]);
    }
    setModalOpen(false);
  };

  const filtered = appointments.filter(
    (a) =>
      (a.petName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.vetName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.status || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="main-content page-container">
      <h2 className="page-title">Appointments</h2>

      <DataTable
        title="Appointments"
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
        title={editing ? "Edit Appointment" : "Add Appointment"}
        onCancel={() => setModalOpen(false)}
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <select
          className="form-select"
          value={form.pet_id}
          onChange={(e) => setForm({ ...form, pet_id: e.target.value })}
          required
        >
          <option value="">Select Pet</option>
          {pets.map((p) => (
            <option key={p.petId} value={p.petId}>
              {p.name}
            </option>
          ))}
        </select>

        <select
          className="form-select"
          value={form.vet_id}
          onChange={(e) => setForm({ ...form, vet_id: e.target.value })}
          required
        >
          <option value="">Select Veterinarian</option>
          {vets.map((v) => (
            <option key={v.vet_id} value={v.vet_id}>
              {v.name}
            </option>
          ))}
        </select>

        <input
          className="form-input"
          type="datetime-local"
          value={form.appointment_date}
          onChange={(e) =>
            setForm({ ...form, appointment_date: e.target.value })
          }
          required
        />

        <textarea
          className="form-textarea"
          rows="3"
          placeholder="Reason"
          value={form.reason}
          onChange={(e) => setForm({ ...form, reason: e.target.value })}
        />

        <select
          className="form-select"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <option value="Scheduled">Scheduled</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </Modal>
    </div>
  );
};

export default Appointments;
