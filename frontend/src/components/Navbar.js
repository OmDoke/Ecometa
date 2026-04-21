import React, { useEffect, useState } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function CustomNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [userRole, setUserRole] = useState(localStorage.getItem("role"));

  useEffect(() => {
    const checkLoginStatus = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
      setUserRole(localStorage.getItem("role"));
    };
    window.addEventListener("storage", checkLoginStatus);
    checkLoginStatus(); // Initial check
    return () => window.removeEventListener("storage", checkLoginStatus);
  }, [location]); // Re-check on navigation

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("userId");
      setIsLoggedIn(false);
      setUserRole(null);
      navigate("/");
    }
  };

  const getDashboardPath = () => {
    if (userRole?.toUpperCase() === 'RECYCLER') return "/recycler-home";
    return "/user-home";
  };

  const getDashboardLabel = () => {
    if (userRole?.toUpperCase() === 'RECYCLER') return "Partner Center";
    return "Member Home";
  };

  return (
    <Navbar expand="lg" className="navbar-premium sticky-top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold brand-logo">
          <span className="logo-icon">♻️</span> Ecometa
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-nav" className="custom-toggler" />

        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link as={Link} to="/" className={`nav-item-premium ${location.pathname === "/" ? "active" : ""}`}>
              Home
            </Nav.Link>

            {isLoggedIn ? (
              <>
                <Nav.Link 
                  as={Link} 
                  to={getDashboardPath()} 
                  className={`nav-item-premium ${location.pathname === getDashboardPath() ? "active" : ""}`}
                >
                  {getDashboardLabel()}
                </Nav.Link>

                {userRole?.toUpperCase() === 'USER' && (
                  <Nav.Link 
                    as={Link} 
                    to="/map" 
                    className={`nav-item-premium ${location.pathname === "/map" ? "active" : ""}`}
                  >
                    Nearby Recyclers
                  </Nav.Link>
                )}

                {userRole?.toUpperCase() === 'RECYCLER' && (
                  <Nav.Link 
                    as={Link} 
                    to="/recycler/profile" 
                    className={`nav-item-premium ${location.pathname === "/recycler/profile" ? "active" : ""}`}
                  >
                    Business Profile
                  </Nav.Link>
                )}

                <button className="btn-logout-premium" onClick={handleLogout}>
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="nav-item-premium">
                  Sign In
                </Nav.Link>
                <Nav.Link as={Link} to="/register" className="btn-navbar-cta">
                  Start Recycling
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>

      <style>{`
        .navbar-premium {
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding: 0.8rem 0;
        }

        .brand-logo {
          font-size: 1.6rem;
          color: var(--primary) !important;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s;
          text-decoration: none;
        }

        .brand-logo:hover {
          transform: scale(1.05);
          color: var(--secondary) !important;
        }

        .nav-item-premium {
          color: var(--text-main) !important;
          font-weight: 500;
          padding: 0.5rem 1.2rem !important;
          border-radius: 0.5rem;
          margin: 0 0.2rem;
          transition: all 0.2s ease;
          text-decoration: none;
        }

        .nav-item-premium:hover, .nav-item-premium.active {
          color: var(--primary) !important;
          background: rgba(16, 185, 129, 0.1);
        }

        .btn-navbar-cta {
          background-color: var(--primary);
          color: white !important;
          font-weight: 600;
          padding: 0.5rem 1.5rem !important;
          border-radius: 0.5rem;
          margin-left: 1rem;
          transition: all 0.3s;
          text-decoration: none;
        }

        .btn-navbar-cta:hover {
          background-color: var(--primary-dark);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
        }

        .btn-logout-premium {
          background: transparent;
          border: 1px solid rgba(239, 68, 68, 0.4);
          color: #ef4444;
          font-weight: 500;
          padding: 0.4rem 1.2rem;
          border-radius: 0.5rem;
          margin-left: 1rem;
          transition: all 0.2s;
        }

        .btn-logout-premium:hover {
          background: rgba(239, 68, 68, 0.1);
          border-color: #ef4444;
        }

        .custom-toggler {
          border: none;
          background: rgba(255, 255, 255, 0.1);
          padding: 0.25rem 0.5rem;
        }

        .custom-toggler:focus {
          box-shadow: none;
        }
      `}</style>
    </Navbar>
  );
}

export default CustomNavbar;
