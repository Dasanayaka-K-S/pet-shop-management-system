// src/pages/Pets.jsx
import React, { useState, useEffect } from "react";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
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
    registered_date: "",
  });

  const columns = [
    { Header: "Pet Name", accessor: "pet_name" },
    { Header: "Species", accessor: "species" },
    { Header: "Breed", accessor: "breed" },
    { Header: "Age", accessor: "age" },
    { Header: "Gender", accessor: "gender" },
    { Header: "Owner", accessor: "ownerName" },
    { Header: "Registered Date", accessor: "registered_date" },
  ];

  // Fetch pets on component mount
  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8080/api/app/getPets");
      if (!res.ok) throw new Error("Failed to fetch pets");
      const data = await res.json();
      
      console.log("Fetched pets:", data); // Debug log
      
      // Add owner_name to each pet for display
      const petsWithOwnerNames = data.map(pet => {
        const owner = owners.find(o => o.owner_id === pet.owner?.owner_id);
        return {
          ...pet,
          ownerName: owner ? owner.owner_name : "Unknown",
          // Format date for display
          registered_date: pet.registerd_date ? new Date(pet.registerd_date).toISOString().split("T")[0] : ""
        };
      });
      
      setPets(petsWithOwnerNames);
    } catch (err) {
      console.error("Failed to load pets", err);
      alert("Failed to load pets. Please check if the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditing(null);
    setForm({
      pet_name: "",
      species: "",
      breed: "",
      age: "",
      gender: "",
      owner_id: "",
      registered_date: new Date().toISOString().split("T")[0],
    });
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      pet_name: item.pet_name || "",
      species: item.species || "",
      breed: item.breed || "",
      age: item.age || "",
      gender: item.gender || "",
      owner_id: item.owner?.owner_id || "",
      registered_date: item.registered_date || "",
    });
    setModalOpen(true);
  };

  const handleDelete = async (item) => {
    if (!window.confirm("Delete this pet?")) return;
    
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:8080/api/app/deletePet/${item.pet_id}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) throw new Error("Failed to delete pet");
      
      // Update local state
      setPets(pets.filter((p) => p.pet_id !== item.pet_id));
      alert("Pet deleted successfully!");
    } catch (err) {
      console.error("Failed to delete pet", err);
      alert("Failed to delete pet. Please add a DELETE endpoint in your Spring Boot controller.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    // Check if e exists and has preventDefault
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    if (!form.pet_name.trim()) {
      alert("Pet name is required");
      return;
    }

    if (!form.owner_id) {
      alert("Please select an owner");
      return;
    }

    try {
      setLoading(true);
      
      // Find the owner object
      const selectedOwner = owners.find(o => o.owner_id === Number(form.owner_id));
      
      if (!selectedOwner) {
        alert("Invalid owner selected");
        return;
      }

      if (editing) {
        // Update existing pet
        const updatedPet = {
          pet_id: editing.pet_id,
          pet_name: form.pet_name,
          species: form.species,
          breed: form.breed,
          age: Number(form.age) || 0,
          gender: form.gender,
          registerd_date: form.registered_date,
          owner: {
            owner_id: selectedOwner.owner_id,
            owner_name: selectedOwner.owner_name,
            contact_number: selectedOwner.contact_number,
            email: selectedOwner.email,
            address: selectedOwner.address
          }
        };

        console.log("Updating pet:", updatedPet); // Debug log

        const res = await fetch("http://localhost:8080/api/app/updatePet", {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedPet),
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error("Update error:", errorText);
          throw new Error("Failed to update pet");
        }
        
        const data = await res.json();
        console.log("Updated pet response:", data); // Debug log
        
        // Add owner_name for display
        const petWithOwnerName = {
          ...data,
          ownerName: selectedOwner.owner_name,
          registered_date: data.registerd_date ? new Date(data.registerd_date).toISOString().split("T")[0] : ""
        };
        
        // Update local state
        setPets(pets.map((p) => (p.pet_id === editing.pet_id ? petWithOwnerName : p)));
        alert("Pet updated successfully!");
      } else {
        // Add new pet
        const newPet = {
          pet_name: form.pet_name,
          species: form.species,
          breed: form.breed,
          age: Number(form.age) || 0,
          gender: form.gender,
          registerd_date: form.registered_date,
          owner: {
            owner_id: selectedOwner.owner_id,
            owner_name: selectedOwner.owner_name,
            contact_number: selectedOwner.contact_number,
            email: selectedOwner.email,
            address: selectedOwner.address
          }
        };

        console.log("Adding pet:", newPet); // Debug log

        const res = await fetch("http://localhost:8080/api/app/addPet", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newPet),
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error("Add error:", errorText);
          throw new Error("Failed to save pet");
        }
        
        const data = await res.json();
        console.log("Added pet response:", data); // Debug log
        
        // Add owner_name for display
        const petWithOwnerName = {
          ...data,
          ownerName: selectedOwner.owner_name,
          registered_date: data.registerd_date ? new Date(data.registerd_date).toISOString().split("T")[0] : ""
        };
        
        // Update local state
        setPets([...pets, petWithOwnerName]);
        alert("Pet added successfully!");
      }

      setModalOpen(false);
    } catch (err) {
      console.error("Failed to save pet", err);
      alert("Failed to save pet. Please check your backend connection.");
    } finally {
      setLoading(false);
    }
  };

  const filtered = pets.filter((p) =>
    Object.values(p).some((v) =>
      String(v).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="main-content page-container">
      <h2 className="page-title">Pets</h2>

      {loading && <div className="loading-indicator">Loading...</div>}

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
        onSubmit={handleSubmit}
      >
        <input
          className="form-input"
          placeholder="Pet Name"
          value={form.pet_name}
          onChange={(e) => setForm({ ...form, pet_name: e.target.value })}
          required
        />
        <input
          className="form-input"
          placeholder="Species (e.g., Dog, Cat, Bird)"
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
          value={form.owner_id}
          onChange={(e) => setForm({ ...form, owner_id: e.target.value })}
          required
        >
          <option value="">Select Owner</option>
          {owners.map((o) => (
            <option key={o.owner_id} value={o.owner_id}>
              {o.owner_name}
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