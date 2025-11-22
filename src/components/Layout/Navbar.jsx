import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: "📊" },
    { name: "Journal", href: "/journal", icon: "📝" },
    { name: "Analytics", href: "/analytics", icon: "📈" },
    { name: "Profile", href: "/profile", icon: "👤" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <span className="logo-emoji">😊</span>
          Moodbuddy
        </Link>

        {user && (
          <>
            <button
              className="nav-toggle"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              ☰
            </button>

            <div className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`nav-link ${isActive(item.href) ? "active" : ""}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {item.name}
                </Link>
              ))}

              <button onClick={logout} className="nav-link logout-btn">
                <span className="nav-icon">🚪</span>
                Logout
              </button>
            </div>
          </>
        )}

        {!user && (
          <div className="nav-auth">
            <Link to="/login" className="btn btn-secondary">
              Login
            </Link>
            <Link to="/register" className="btn btn-primary">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
