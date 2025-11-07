// src/components/Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>© {new Date().getFullYear()} Pet Clinic Management System</p>
        <p>Built with ❤️ using React</p>
      </div>
    </footer>
  );
};

export default Footer;
