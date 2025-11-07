// src/App.jsx
import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Dashboard from "./Pages/Dashboard";
import Owners from "./Pages/Owners";
import Pets from "./Pages/Pets";
import Veterinarians from "./Pages/Veterinarians";
import Appointments from "./Pages/Appointments";
import TreatmentPrescription from "./Pages/TreatmentPrescription"; // ✅ new page import
import "./App.css";

const App = () => {
  const [activePage, setActivePage] = useState("Dashboard");

  // --- States for all tables ---
  const [owners, setOwners] = useState([]);
  const [pets, setPets] = useState([]);
  const [vets, setVets] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [treatments, setTreatments] = useState([]); // ✅ treatments state

  // --- Demo Data ---
  useEffect(() => {
    setOwners([
      {
        owner_id: 1,
        first_name: "John",
        last_name: "Smith",
        email: "john@email.com",
        phone: "555-0101",
        address: "123 Main St",
        city: "New York",
        created_at: "2025-11-01 10:30:00",
      },
      {
        owner_id: 2,
        first_name: "Sarah",
        last_name: "Johnson",
        email: "sarah@email.com",
        phone: "555-0102",
        address: "456 Oak Ave",
        city: "Los Angeles",
        created_at: "2025-11-02 14:45:00",
      },
    ]);

    setPets([
      {
        petId: 1,
        name: "Max",
        species: "Dog",
        breed: "Golden Retriever",
        age: 3,
        gender: "Male",
        ownerId: 1,
        ownerName: "John Smith",
        registered_date: "2025-10-20",
      },
      {
        petId: 2,
        name: "Whiskers",
        species: "Cat",
        breed: "Persian",
        age: 2,
        gender: "Female",
        ownerId: 2,
        ownerName: "Sarah Johnson",
        registered_date: "2025-10-22",
      },
    ]);

    setVets([
      {
        vet_id: 1,
        name: "Dr. Emily Brown",
        specialization: "General Practice",
        phone: "555-0201",
        email: "emily@petclinic.com",
        experience_years: 5,
        availability: "Mon–Fri 9AM–5PM",
      },
      {
        vet_id: 2,
        name: "Dr. Michael Chen",
        specialization: "Surgery",
        phone: "555-0202",
        email: "michael@petclinic.com",
        experience_years: 8,
        availability: "Tue–Sat 10AM–6PM",
      },
    ]);

    // ✅ Updated appointment data (new schema)
    setAppointments([
      {
        appointment_id: 1,
        pet_id: 1,
        vet_id: 1,
        petName: "Max",
        vetName: "Dr. Emily Brown",
        appointment_date: "2025-11-10T10:00",
        reason: "Annual Checkup",
        status: "Scheduled",
      },
      {
        appointment_id: 2,
        pet_id: 2,
        vet_id: 2,
        petName: "Whiskers",
        vetName: "Dr. Michael Chen",
        appointment_date: "2025-11-11T14:30",
        reason: "Dental Cleaning",
        status: "Completed",
      },
    ]);

    // ✅ Treatment / Prescription demo data
    setTreatments([
      {
        treatment_id: 1,
        appointment_id: 1,
        description: "Rabies vaccination",
        medicine: "Anti-rabies",
        cost: 50.0,
        date: "2025-11-10",
      },
      {
        treatment_id: 2,
        appointment_id: 2,
        description: "Dental cleaning and polishing",
        medicine: "None",
        cost: 80.0,
        date: "2025-11-11",
      },
    ]);
  }, []);

  const getPetName = (id) => pets.find((p) => p.petId === id)?.name || "Unknown";
  const getVetName = (id) => vets.find((v) => v.vet_id === id)?.name || "Unknown";

  const pageButtons = [
    { id: "Dashboard", label: "Dashboard" },
    { id: "Owners", label: "Owners" },
    { id: "Pets", label: "Pets" },
    { id: "Veterinarians", label: "Veterinarians" },
    { id: "Appointments", label: "Appointments" },
    { id: "TreatmentPrescription", label: "Treatment / Prescription" }, // ✅ new nav tab
  ];

  return (
    <>
      <Header />

      {/* Sticky navigation bar */}
      <div className="navigation">
        <div className="nav-container">
          <div className="nav-tabs" role="tablist" aria-label="Main navigation">
            {pageButtons.map((btn) => (
              <button
                key={btn.id}
                className={`nav-tab ${activePage === btn.id ? "active" : ""}`}
                onClick={() => setActivePage(btn.id)}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="main-content">
        {activePage === "Dashboard" && (
          <Dashboard
            owners={owners}
            pets={pets}
            vets={vets}
            appointments={appointments}
            getPetName={getPetName}
            getVetName={getVetName}
          />
        )}
        {activePage === "Owners" && <Owners owners={owners} setOwners={setOwners} />}
        {activePage === "Pets" && <Pets pets={pets} setPets={setPets} owners={owners} />}
        {activePage === "Veterinarians" && <Veterinarians vets={vets} setVets={setVets} />}
        {activePage === "Appointments" && (
          <Appointments
            appointments={appointments}
            setAppointments={setAppointments}
            pets={pets}
            vets={vets}
          />
        )}
        {activePage === "TreatmentPrescription" && (
          <TreatmentPrescription
            treatments={treatments}
            setTreatments={setTreatments}
            appointments={appointments}
          />
        )}
      </main>

      <Footer />
    </>
  );
};

export default App;
