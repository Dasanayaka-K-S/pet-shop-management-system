// src/Pages/Owners.jsx
import React, { useState, useEffect } from "react";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
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

  // Columns shown in table
  const columns = [
    { Header: "Name", accessor: "owner_name" },
    { Header: "Email", accessor: "owner_email" },
    { Header: "Phone", accessor: "owner_phone" },
    { Header: "Address", accessor: "owner_address" },
    { Header: "Created At", accessor: "created_at" },
  ];

  // Fetch owners on component mount
  useEffect(() => {
    fetchOwners();
  }, []);

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
    if (!window.confirm("Delete owner?")) return;
    
    try {
      setLoading(true);
      // Note: Your backend doesn't have a delete endpoint yet
      // You'll need to add this to your Spring Boot controller:
      // @DeleteMapping("/deleteOwner/{id}")
      // public void deleteOwner(@PathVariable Long id) { ownerService.deleteOwner(id); }
      
      const res = await fetch(`http://localhost:8080/api/app/deleteOwner/${item.owner_id}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) throw new Error("Failed to delete owner");
      
      // Update local state
      setOwners(owners.filter((o) => o.owner_id !== item.owner_id));
      alert("Owner deleted successfully!");
    } catch (err) {
      console.error("Failed to delete owner", err);
      alert("Failed to delete owner. Please add a DELETE endpoint in your Spring Boot controller.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    // Check if e exists and has preventDefault
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    if (!form.owner_name.trim()) {
      alert("Name is required");
      return;
    }

    try {
      setLoading(true);
      
      if (editing) {
        // Update existing owner
        const updatedOwner = {
          owner_id: editing.owner_id,
          owner_name: form.owner_name,
          owner_email: form.owner_email,
          owner_phone: form.owner_phone,
          owner_address: form.owner_address,
          created_at: editing.created_at,
          updated_at: new Date().toISOString().slice(0, 19).replace("T", " "),
        };

        const res = await fetch("http://localhost:8080/api/app/updateOwner", {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedOwner),
        });

        if (!res.ok) throw new Error("Failed to update owner");
        
        const data = await res.json();
        
        // Update local state
        setOwners(owners.map((o) => (o.owner_id === editing.owner_id ? data : o)));
        alert("Owner updated successfully!");
      } else {
        // Add new owner
        const newOwner = {
          owner_name: form.owner_name,
          owner_email: form.owner_email,
          owner_phone: form.owner_phone,
          owner_address: form.owner_address,
          created_at: new Date().toISOString().slice(0, 19).replace("T", " "),
        };

        const res = await fetch("http://localhost:8080/api/app/saveOwner", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newOwner),
        });

        if (!res.ok) throw new Error("Failed to save owner");
        
        const data = await res.json();
        
        // Update local state
        setOwners([...owners, data]);
        alert("Owner added successfully!");
      }

      setModalOpen(false);
    } catch (err) {
      console.error("Failed to save owner", err);
      alert("Failed to save owner. Please check your backend connection.");
    } finally {
      setLoading(false);
    }
  };

  // Search filter
  const filtered = owners.filter((o) =>
    Object.values(o).some((v) =>
      String(v).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="main-content page-container">
      <h2 className="page-title">Owners</h2>

      {loading && <div className="loading-indicator">Loading...</div>}

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
          name="owner_name"
          className="form-input"
          placeholder="Full Name"
          value={form.owner_name}
          onChange={(e) => setForm({ ...form, owner_name: e.target.value })}
          required
        />
        <input
          name="owner_email"
          type="email"
          className="form-input"
          placeholder="Email"
          value={form.owner_email}
          onChange={(e) => setForm({ ...form, owner_email: e.target.value })}
        />
        <input
          name="owner_phone"
          className="form-input"
          placeholder="Phone"
          value={form.owner_phone}
          onChange={(e) => setForm({ ...form, owner_phone: e.target.value })}
        />
        <input
          name="owner_address"
          className="form-input"
          placeholder="Address"
          value={form.owner_address}
          onChange={(e) => setForm({ ...form, owner_address: e.target.value })}
        />
      </Modal>
    </div>
  );
};

export default Owners;