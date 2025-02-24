import React, { useEffect, useState } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function CustomNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const checkLoginStatus = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };
    window.addEventListener("storage", checkLoginStatus);
    return () => window.removeEventListener("storage", checkLoginStatus);
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("userId");
      setIsLoggedIn(false);
      navigate("/login");
    }
  };

  return (
    <Navbar expand="lg" className="custom-navbar px-4 py-3 shadow-lg">
      <Container>
        {/* Brand Logo */}
        <Navbar.Brand
          as={Link}
          to="/"
          className="fw-bold text-light custom-logo"
        >
          ♻️ Ecometa
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          className="border-0 text-white"
        />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {/* Home Link */}
            <Nav.Link
              as={Link}
              to="/"
              className={`nav-link-custom ${
                location.pathname === "/" ? "active" : ""
              }`}
            >
              Home
            </Nav.Link>

            {/* Conditional Links */}
            {isLoggedIn ? (
              <>
                <Nav.Link
                  as={Link}
                  to="/user-home"
                  className={`nav-link-custom ${
                    location.pathname === "/user-home" ? "active" : ""
                  }`}
                >
                  Dashboard
                </Nav.Link>
                <button className="btn btn-glow ms-3" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Nav.Link
                  as={Link}
                  to="/login"
                  className={`nav-link-custom ${
                    location.pathname === "/login" ? "active" : ""
                  }`}
                >
                  Login
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/register"
                  className={`nav-link-custom ${
                    location.pathname === "/register" ? "active" : ""
                  }`}
                >
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>

      {/* Custom Styles */}
      <style jsx>{`
        .custom-navbar {
          background-color: #2c3e50; /* Dark Charcoal for contrast */
          transition: background-color 0.3s ease-in-out;
        }

        .custom-logo {
          font-size: 1.8rem;
          letter-spacing: 2px;
          color: #8e44ad; /* Purple/Light Violet for the logo */
          transition: transform 0.3s ease-in-out, color 0.3s ease-in-out;
        }
        .custom-logo:hover {
          transform: scale(1.15);
          color: #f39c12; /* Golden Yellow on hover */
        }

        .nav-link-custom {
          color: #ecf0f1 !important; /* Light Gray for text */
          font-weight: bold;
          padding: 8px 16px;
          border-radius: 8px;
          transition: color 0.3s ease-in-out, transform 0.3s ease-in-out, background-color 0.3s ease;
        }
        .nav-link-custom:hover {
          color: #2ecc71 !important; /* Lime Green on hover */
          background-color: #34495e; /* Slightly lighter charcoal */
          transform: scale(1.05);
        }

        .active {
          color: #f39c12 !important;
          text-decoration: underline;
        }

        .btn-glow {
          background-color: #f39c12; /* Bright Yellow */
          color: #34495e; /* Charcoal for contrast */
          font-weight: bold;
          padding: 8px 16px;
          border-radius: 8px;
          border: none;
          transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
        }
        .btn-glow:hover {
          transform: scale(1.1);
          background-color: #e67e22; /* Darker Orange on hover */
          box-shadow: 0px 0px 12px rgba(255, 155, 0, 0.8);
        }

        /* Animations for Navbar Collapse */
        .navbar-collapse {
          animation: slideIn 0.5s ease-out;
        }

        @keyframes slideIn {
          0% {
            transform: translateY(-20px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </Navbar>
  );
}

export default CustomNavbar;
