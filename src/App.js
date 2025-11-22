// src/App.jsx
import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Dashboard from "./Pages/Dashboard";
import Owners from "./Pages/Owners";
import Pets from "./Pages/Pets";
import Veterinarians from "./Pages/Veterinarians";
import Appointments from "./Pages/Appointments";
import TreatmentPrescription from "./Pages/TreatmentPrescription";
import PetCareLogin from "./components/PetCareLogin"; // ✅ Import Login component

import "./App.css";

const App = () => {
  // ✅ Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const [activePage, setActivePage] = useState("Dashboard");

  // --- States for all tables ---
  const [owners, setOwners] = useState([]);
  const [pets, setPets] = useState([]);
  const [vets, setVets] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [treatments, setTreatments] = useState([]);

  // ✅ Check if user is already logged in on page load
  useEffect(() => {
    const loggedIn = localStorage.getItem('isAuthenticated') === 'true';
    const username = localStorage.getItem('username');
    if (loggedIn && username) {
      setIsLoggedIn(true);
      setCurrentUser(username);
    }
  }, []);

  // --- Demo Data ---
  useEffect(() => {
    if (!isLoggedIn) return; // Only load data after login

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
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) return; // Only fetch after login

    const fetchBackendData = async () => {
      try {
        const [ownersRes, petsRes, vetsRes] = await Promise.all([
          fetch('/api/app/getOwners'),
          fetch('/api/app/getPets'),
          fetch('/api/app/getVets'),
        ]);

        if (!ownersRes.ok || !petsRes.ok || !vetsRes.ok) {
          throw new Error('One or more API requests failed');
        }

        const [ownersData, petsData, vetsData] = await Promise.all([
          ownersRes.json(),
          petsRes.json(),
          vetsRes.json(),
        ]);

        const mappedOwners = ownersData.map(o => ({
          ownerId: o.ownerId ?? o.owner_id ?? o.id,
          name: o.name ?? `${o.first_name ?? ''} ${o.last_name ?? ''}`.trim(),
          ...o,
        }));

        const mappedPets = petsData.map(p => ({
          petId: p.petId ?? p.id,
          ownerId: p.ownerId ?? p.owner_id,
          ownerName: p.ownerName ?? p.ownerName,
          ...p,
        }));

        setOwners(mappedOwners);
        setPets(mappedPets);
        setVets(vetsData);
      } catch (err) {
        console.error('Failed to load backend data', err);
      }
    };

    fetchBackendData();
  }, [isLoggedIn]);

  const getPetName = (id) => pets.find((p) => p.petId === id)?.name || "Unknown";
  const getVetName = (id) => vets.find((v) => v.vet_id === id)?.name || "Unknown";

  // ✅ Handle successful login
  const handleLoginSuccess = (username) => {
    setIsLoggedIn(true);
    setCurrentUser(username);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('username', username);
  };

  // ✅ Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('username');
    setActivePage("Dashboard"); // Reset to dashboard
  };

  const pageButtons = [
    { id: "Dashboard", label: "Dashboard" },
    { id: "Owners", label: "Owners" },
    { id: "Pets", label: "Pets" },
    { id: "Veterinarians", label: "Veterinarians" },
    { id: "Appointments", label: "Appointments" },
    { id: "TreatmentPrescription", label: "Treatment / Prescription" },
  ];

  // ✅ If not logged in, show login page
  if (!isLoggedIn) {
    return <PetCareLogin onLoginSuccess={handleLoginSuccess} />;
  }

  // ✅ If logged in, show the main app
  return (
    <>
      <Header currentUser={currentUser} onLogout={handleLogout} />

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