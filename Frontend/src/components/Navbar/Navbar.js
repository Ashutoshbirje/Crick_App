import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div>
      <nav className="navbar">
        <div className="navbar1">
          <div className="navbar-left">
            <div className="logo">
              <div className="Inner">
                <h1 className="no-margin">MAHARASHTRA POLICE</h1>
                <h4 className="no-margin">सद्रक्षणाय खलनिग्रहणाय</h4>
              </div>
            </div>
          </div>
          <div className="navbar-right">
            <ul className="navbar-menu">
              <li className="navbar-item1" onClick={() => navigate("/")}>
                Home
              </li>
              <li className="navbar-item1" onClick={() => navigate("/station")}>
                Police-Station
              </li>
              <li className="navbar-item1" onClick={() => navigate("/fir")}>
                FIR
              </li>
              <li className="navbar-item1" onClick={() => navigate("/AllReport")}>
                Report
              </li>
              <li className="navbar-item1" onClick={() => navigate("/contact")}>
                Contact
              </li>
            </ul>

            <div className="hamburger" onClick={toggleMenu}>
              <i className="icon1 fas fa-bars"></i>
            </div>

            {isLoggedIn && (
              <button className="logout-btn" onClick={handleLogout}>
                Log Out
              </button>
            )}
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div className={`hamburger-menu-container ${menuOpen ? "active" : ""}`}>
          <ul className="hamburger-menu">
            <li className="navbar-item" onClick={() => { navigate("/"); toggleMenu(); }}>
              Home
            </li>
            <li className="navbar-item" onClick={() => { navigate("/station"); toggleMenu(); }}>
              Police-Station
            </li>
            <li className="navbar-item" onClick={() => { navigate("/fir"); toggleMenu(); }}>
              FIR
            </li>
            <li className="navbar-item" onClick={() => { navigate("/AllReport"); toggleMenu(); }}>
              Report
            </li>
            <li className="navbar-item" onClick={() => { navigate("/contact"); toggleMenu(); }}>
              Contact
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
