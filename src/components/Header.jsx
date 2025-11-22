import React, { useState, useEffect } from 'react';

const Header = ({ currentUser, onLogout }) => {
  const [scrolled, setScrolled] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }

        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }

        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(102, 126, 234, 0.3); }
          50% { box-shadow: 0 0 30px rgba(118, 75, 162, 0.5), 0 0 40px rgba(102, 126, 234, 0.3); }
        }

        .premium-header {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: linear-gradient(-45deg, #667eea, #764ba2, #f093fb, #4facfe);
          background-size: 400% 400%;
          animation: gradientShift 15s ease infinite;
          padding: 1.5rem 0;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }

        .premium-header.scrolled {
          padding: 1rem 0;
          box-shadow: 0 8px 40px rgba(0, 0, 0, 0.15);
        }

        .header-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          animation: slideInDown 0.6s ease-out;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .logo-wrapper {
          position: relative;
          animation: float 3s ease-in-out infinite;
        }

        .logo-icon {
          width: 60px;
          height: 60px;
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(10px);
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          animation: glow 3s ease-in-out infinite;
        }

        .scrolled .logo-icon {
          width: 50px;
          height: 50px;
          font-size: 28px;
        }

        .logo-icon:hover {
          transform: rotate(10deg) scale(1.1);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
        }

        .logo-glow {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.2);
          filter: blur(15px);
          z-index: -1;
          animation: pulse 2s ease-in-out infinite;
        }

        .header-title-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .header-title {
          font-size: 1.8rem;
          font-weight: 800;
          margin: 0;
          color: white;
          letter-spacing: -0.5px;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .scrolled .header-title {
          font-size: 1.5rem;
        }

        .header-subtitle {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.9);
          font-weight: 500;
          letter-spacing: 0.5px;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .notification-btn {
          position: relative;
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 20px;
        }

        .notification-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .notification-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: linear-gradient(135deg, #ff6b6b, #ee5a6f);
          color: white;
          font-size: 10px;
          font-weight: 700;
          padding: 3px 7px;
          border-radius: 10px;
          border: 2px solid white;
          animation: pulse 2s ease-in-out infinite;
        }

        .user-profile {
          position: relative;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 16px;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          border-radius: 14px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .user-info:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: 700;
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.5);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .user-details {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .user-welcome {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.9);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .user-name {
          font-size: 0.95rem;
          color: white;
          font-weight: 700;
          letter-spacing: -0.2px;
        }

        .dropdown-arrow {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.8);
          transition: transform 0.3s ease;
        }

        .user-info:hover .dropdown-arrow {
          transform: translateY(2px);
        }

        .dropdown-menu {
          position: absolute;
          top: calc(100% + 12px);
          right: 0;
          background: white;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          padding: 8px;
          min-width: 220px;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-10px);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid rgba(0, 0, 0, 0.05);
        }

        .dropdown-menu.show {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 14px;
          font-weight: 500;
          color: #475569;
          border: none;
          background: transparent;
          width: 100%;
          text-align: left;
        }

        .dropdown-item:hover {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
          color: #667eea;
          transform: translateX(4px);
        }

        .dropdown-item.logout {
          color: #ef4444;
        }

        .dropdown-item.logout:hover {
          background: rgba(239, 68, 68, 0.1);
          color: #dc2626;
        }

        .dropdown-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
          margin: 8px 0;
        }

        .logout-button {
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(10px);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
          padding: 10px 24px;
          border-radius: 12px;
          font-size: 0.9rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          letter-spacing: 0.3px;
          text-transform: uppercase;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .logout-button:hover {
          background: rgba(255, 255, 255, 0.35);
          border-color: rgba(255, 255, 255, 0.5);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .logout-button:active {
          transform: translateY(0);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .header-container {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }

          .header-left {
            flex-direction: column;
            gap: 1rem;
          }

          .header-title {
            font-size: 1.4rem;
          }

          .header-subtitle {
            display: none;
          }

          .user-details {
            display: none;
          }

          .notification-btn {
            width: 40px;
            height: 40px;
          }
        }

        /* Floating particles background */
        .header-particles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          pointer-events: none;
          opacity: 0.3;
        }

        .particle {
          position: absolute;
          background: rgba(255, 255, 255, 0.4);
          border-radius: 50%;
        }
      `}</style>

      <header className={`premium-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="header-particles">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 5 + 10}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
        </div>

        <div className="header-container">
          <div className="header-left">
            <div className="logo-wrapper">
              <div className="logo-glow"></div>
              <div className="logo-icon">🐾</div>
            </div>
            <div className="header-title-group">
              <h1 className="header-title">Pet Care Management</h1>
              <span className="header-subtitle">Professional Veterinary Care System</span>
            </div>
          </div>

          {currentUser && (
            <div className="header-right">
              <button className="notification-btn">
                🔔
                <span className="notification-badge">3</span>
              </button>

              <div className="user-profile">
                <div 
                  className="user-info"
                  onClick={() => setShowProfile(!showProfile)}
                >
                  <div className="user-avatar">
                    {currentUser.charAt(0).toUpperCase()}
                  </div>
                  <div className="user-details">
                    <span className="user-welcome">Welcome Back</span>
                    <span className="user-name">{currentUser}</span>
                  </div>
                  <span className="dropdown-arrow">▼</span>
                </div>

                <div className={`dropdown-menu ${showProfile ? 'show' : ''}`}>
                  <button className="dropdown-item">
                    <span>👤</span>
                    <span>My Profile</span>
                  </button>
                  <button className="dropdown-item">
                    <span>⚙️</span>
                    <span>Settings</span>
                  </button>
                  <button className="dropdown-item">
                    <span>❓</span>
                    <span>Help & Support</span>
                  </button>
                  <div className="dropdown-divider"></div>
                  <button 
                    className="dropdown-item logout"
                    onClick={onLogout}
                  >
                    <span>🚪</span>
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;