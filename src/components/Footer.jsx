// src/components/Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <>
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .footer {
          background: linear-gradient(-45deg, #0a0a0a, #1a0a2e, #16213e, #0f3460);
          background-size: 400% 400%;
          animation: gradientShift 15s ease infinite;
          color: white;
          padding: 2rem 0;
          text-align: center;
          margin-top: auto;
          border-top: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 -4px 30px rgba(0, 0, 0, 0.1);
        }

        .footer-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .footer-content p {
          margin: 0.5rem 0;
          font-size: 14px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.9);
          letter-spacing: 0.3px;
        }

        .footer-content p:first-child {
          font-weight: 600;
          font-size: 15px;
        }

        .footer-content p:last-child {
          color: rgba(255, 255, 255, 0.7);
          font-size: 13px;
        }
      `}</style>
      
      <footer className="footer">
        <div className="footer-content">
          <p>© {new Date().getFullYear()} Pet Clinic Management System</p>
          <p>Built with ❤️ using React</p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
