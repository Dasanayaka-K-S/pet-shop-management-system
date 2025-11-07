// src/pages/Pets.jsx
import React, { useState } from "react";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import "../App.css";

const Pets = ({ pets, setPets, owners }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: "",
    species: "",
    breed: "",
    age: "",
    gender: "",
    ownerId: "",
    registered_date: "",
  });

  const columns = [
    { Header: "Pet Name", accessor: "name" },
    { Header: "Species", accessor: "species" },
    { Header: "Breed", accessor: "breed" },
    { Header: "Age", accessor: "age" },
    { Header: "Gender", accessor: "gender" },
    { Header: "Owner", accessor: "ownerName" },
    { Header: "Registered Date", accessor: "registered_date" },
  ];

  const openAdd = () => {
    setEditing(null);
    setForm({
      name: "",
      species: "",
      breed: "",
      age: "",
      gender: "",
      ownerId: "",
      registered_date: new Date().toISOString().split("T")[0],
    });
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      name: item.name,
      species: item.species,
      breed: item.breed,
      age: item.age,
      gender: item.gender,
      ownerId: item.ownerId,
      registered_date: item.registered_date,
    });
    setModalOpen(true);
  };

  const handleDelete = (item) => {
    if (!window.confirm("Delete this pet?")) return;
    setPets(pets.filter((p) => p.petId !== item.petId));
  };

  const handleSubmit = () => {
    if (!form.name.trim()) return;
    const ownerName =
      owners.find((o) => o.ownerId === Number(form.ownerId))?.name || "Unknown";

    if (editing) {
      // Update existing pet
      setPets(
        pets.map((p) =>
          p.petId === editing.petId
            ? { ...p, ...form, ownerId: Number(form.ownerId), ownerName }
            : p
        )
      );
    } else {
      // Add new pet
      setPets([
        ...pets,
        {
          ...form,
          petId: Date.now(),
          ownerId: Number(form.ownerId),
          ownerName,
        },
      ]);
    }
    setModalOpen(false);
  };

  const filtered = pets.filter((p) =>
    Object.values(p)
      .some((v) =>
        String(v).toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <div className="main-content page-container">
      <h2 className="page-title">Pets</h2>

      <DataTable
        title="Pets"
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
        title={editing ? "Edit Pet" : "Add Pet"}
        onCancel={() => setModalOpen(false)}
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <input
          className="form-input"
          placeholder="Pet name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          className="form-input"
          placeholder="Species"
          value={form.species}
          onChange={(e) => setForm({ ...form, species: e.target.value })}
        />
        <input
          className="form-input"
          placeholder="Breed"
          value={form.breed}
          onChange={(e) => setForm({ ...form, breed: e.target.value })}
        />
        <input
          className="form-input"
          placeholder="Age"
          type="number"
          value={form.age}
          onChange={(e) => setForm({ ...form, age: e.target.value })}
        />
        <select
          className="form-select"
          value={form.gender}
          onChange={(e) => setForm({ ...form, gender: e.target.value })}
          required
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <select
          className="form-select"
          value={form.ownerId}
          onChange={(e) => setForm({ ...form, ownerId: e.target.value })}
          required
        >
          <option value="">Select Owner</option>
          {owners.map((o) => (
            <option key={o.ownerId} value={o.ownerId}>
              {o.name}
            </option>
          ))}
        </select>
        <input
          className="form-input"
          type="date"
          value={form.registered_date}
          onChange={(e) => setForm({ ...form, registered_date: e.target.value })}
          required
        />
      </Modal>
    </div>
  );
};

export default Pets;
