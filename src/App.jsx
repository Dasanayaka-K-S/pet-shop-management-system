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
import UserManagement from "./Pages/UserManagement";
import PetCareLogin from "./components/PetCareLogin";

import "./App.css";

const App = () => {
  // ✅ Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // ✅ IMPORTANT: Always start with Dashboard
  const [activePage, setActivePage] = useState("Dashboard");

  // --- States for all tables ---
  const [owners, setOwners] = useState([]);
  const [pets, setPets] = useState([]);
  const [vets, setVets] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [treatments, setTreatments] = useState([]);

  // Loading states
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Check if user is already logged in on page load
  useEffect(() => {
    const loggedIn = localStorage.getItem('isAuthenticated') === 'true';
    const username = localStorage.getItem('username');
    if (loggedIn && username) {
      setIsLoggedIn(true);
      setCurrentUser(username);
      setActivePage("Dashboard");
    }
  }, []);

  // ✅ Fetch data from backend when logged in
  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchBackendData = async () => {
      setIsLoading(true);
      
      try {
        // Fetch Owners
        try {
          const ownersRes = await fetch('http://localhost:8080/api/app/getOwners');
          if (ownersRes.ok) {
            const ownersData = await ownersRes.json();
            console.log('Owners data:', ownersData);
            setOwners(ownersData);
          } else {
            console.log('Failed to fetch owners:', ownersRes.status);
          }
        } catch (err) {
          console.log('Owners API error:', err.message);
        }

        // Fetch Pets
        try {
          const petsRes = await fetch('http://localhost:8080/api/app/getPets');
          if (petsRes.ok) {
            const petsData = await petsRes.json();
            console.log('Pets data:', petsData);
            setPets(petsData);
          } else {
            console.log('Failed to fetch pets:', petsRes.status);
          }
        } catch (err) {
          console.log('Pets API error:', err.message);
        }

        // Fetch Vets
        try {
          const vetsRes = await fetch('http://localhost:8080/api/app/getVets');
          if (vetsRes.ok) {
            const vetsData = await vetsRes.json();
            console.log('Vets data:', vetsData);
            setVets(vetsData);
          } else {
            console.log('Failed to fetch vets:', vetsRes.status);
          }
        } catch (err) {
          console.log('Vets API error:', err.message);
        }

        // Fetch Appointments
        try {
          const appointmentsRes = await fetch('http://localhost:8080/api/app/getAppointments');
          if (appointmentsRes.ok) {
            const appointmentsData = await appointmentsRes.json();
            console.log('Appointments data:', appointmentsData);
            setAppointments(appointmentsData);
          } else {
            console.log('Failed to fetch appointments:', appointmentsRes.status);
          }
        } catch (err) {
          console.log('Appointments API error:', err.message);
        }

        // Fetch Treatments
        try {
          const treatmentsRes = await fetch('http://localhost:8080/api/app/getTreatments');
          if (treatmentsRes.ok) {
            const treatmentsData = await treatmentsRes.json();
            console.log('Treatments data:', treatmentsData);
            setTreatments(treatmentsData);
          } else {
            console.log('Failed to fetch treatments:', treatmentsRes.status);
          }
        } catch (err) {
          console.log('Treatments API error:', err.message);
        }

      } catch (err) {
        console.log('General error fetching data:', err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBackendData();
  }, [isLoggedIn]);

  // Helper functions for Dashboard
  const getPetName = (id) => {
    const pet = pets.find((p) => p.petId === id || p.pet_id === id || p.id === id);
    return pet ? (pet.name || pet.pet_name || 'Unknown') : 'Unknown';
  };

  const getVetName = (id) => {
    const vet = vets.find((v) => v.vet_id === id || v.vetId === id || v.id === id);
    return vet ? (vet.name || vet.vet_name || 'Unknown') : 'Unknown';
  };

  // ✅ Handle successful login - FORCE DASHBOARD
  const handleLoginSuccess = (username) => {
    setIsLoggedIn(true);
    setCurrentUser(username);
    setActivePage("Dashboard");
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('username', username);
  };

  // ✅ Handle logout - RESET TO DASHBOARD
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setActivePage("Dashboard");
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('username');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('authCredentials');
    
    // Clear all data on logout
    setOwners([]);
    setPets([]);
    setVets([]);
    setAppointments([]);
    setTreatments([]);
  };

  // ✅ Navigation tabs with User Management added
  const pageButtons = [
    { id: "Dashboard", label: "📊 Dashboard" },
    { id: "Owners", label: "👤 Owners" },
    { id: "Pets", label: "🐾 Pets" },
    { id: "Veterinarians", label: "⚕️ Veterinarians" },
    { id: "Appointments", label: "📅 Appointments" },
    { id: "TreatmentPrescription", label: "💊 Treatment" },
    { id: "UserManagement", label: "👥 Users" },
  ];

  // ✅ If not logged in, show login page
  if (!isLoggedIn) {
    return <PetCareLogin onLoginSuccess={handleLoginSuccess} />;
  }

  // ✅ If logged in, show the main app
  return (
    <>
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .navigation {
          position: sticky;
          top: 0;
          z-index: 999;
          background: linear-gradient(-45deg, #0a0a0a, #1a0a2e, #16213e, #0f3460);
          background-size: 400% 400%;
          animation: gradientShift 15s ease infinite;
          padding: 0;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .nav-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .nav-tabs {
          display: flex;
          gap: 8px;
          padding: 16px 0;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
        }

        .nav-tab {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: rgba(255, 255, 255, 0.9);
          padding: 12px 24px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          letter-spacing: 0.3px;
          animation: slideIn 0.4s ease-out;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .nav-tab:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
          border-color: rgba(255, 255, 255, 0.25);
        }

        .nav-tab.active {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border-color: transparent;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
          transform: translateY(-2px);
        }

        .nav-tab.active:hover {
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
        }

        @media (max-width: 768px) {
          .nav-tabs {
            gap: 6px;
            padding: 12px 0;
          }

          .nav-tab {
            padding: 10px 16px;
            font-size: 13px;
          }

          .nav-container {
            padding: 0 1rem;
          }
        }
      `}</style>

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
        {isLoading && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            fontSize: '16px',
            color: '#64748b',
            background: 'white',
            margin: '32px',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
          }}>
            <div style={{
              fontSize: '48px',
              marginBottom: '16px'
            }}>⏳</div>
            <div style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#0f172a',
              marginBottom: '8px'
            }}>Loading your data...</div>
            <div style={{
              fontSize: '14px',
              color: '#94a3b8'
            }}>Please wait while we fetch your information</div>
          </div>
        )}

        {!isLoading && (
          <>
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
            {activePage === "UserManagement" && <UserManagement />}
          </>
        )}
      </main>

      <Footer />
    </>
  );
};

export default App;