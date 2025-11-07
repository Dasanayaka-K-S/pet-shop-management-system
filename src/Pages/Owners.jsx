// src/Pages/Owners.jsx
import React, { useState } from "react";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import "../App.css";

const Owners = ({ owners, setOwners }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
  });

  // Columns shown in table
  const columns = [
    { Header: "First Name", accessor: "first_name" },
    { Header: "Last Name", accessor: "last_name" },
    { Header: "Email", accessor: "email" },
    { Header: "Phone", accessor: "phone" },
    { Header: "Address", accessor: "address" },
    { Header: "City", accessor: "city" },
    { Header: "Created At", accessor: "created_at" },
  ];

  const openAdd = () => {
    setEditing(null);
    setForm({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
    });
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      first_name: item.first_name,
      last_name: item.last_name,
      email: item.email,
      phone: item.phone,
      address: item.address,
      city: item.city,
    });
    setModalOpen(true);
  };

  const handleDelete = (item) => {
    if (!window.confirm("Delete owner?")) return;
    setOwners(owners.filter((o) => o.owner_id !== item.owner_id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.first_name.trim() || !form.last_name.trim()) {
      alert("First and Last Name are required");
      return;
    }

    const now = new Date().toISOString().slice(0, 19).replace("T", " ");

    if (editing) {
      setOwners(
        owners.map((o) =>
          o.owner_id === editing.owner_id ? { ...o, ...form } : o
        )
      );
    } else {
      setOwners([
        ...owners,
        { ...form, owner_id: Date.now(), created_at: now },
      ]);
    }

    setModalOpen(false);
  };

  // Search filter
  const filtered = owners.filter((o) =>
    Object.values(o)
      .some((v) => String(v).toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="main-content page-container">
      <h2 className="page-title">Owners</h2>

      <DataTable
        title="Owners"
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
        title={editing ? "Edit Owner" : "Add Owner"}
        onCancel={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      >
        <input
          name="first_name"
          className="form-input"
          placeholder="First Name"
          value={form.first_name}
          onChange={(e) => setForm({ ...form, first_name: e.target.value })}
          required
        />
        <input
          name="last_name"
          className="form-input"
          placeholder="Last Name"
          value={form.last_name}
          onChange={(e) => setForm({ ...form, last_name: e.target.value })}
          required
        />
        <input
          name="email"
          className="form-input"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          name="phone"
          className="form-input"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <input
          name="address"
          className="form-input"
          placeholder="Address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />
        <input
          name="city"
          className="form-input"
          placeholder="City"
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
        />
      </Modal>
    </div>
  );
};

export default Owners;
