import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";


function Home() {
  const navigate = useNavigate();

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center text-center text-light"
      style={{
        minHeight: "100vh",
        padding: "50px",
        background: "linear-gradient(-45deg, #002b36, #004d40, #00695c, #00796b)",
        backgroundSize: "400% 400%",
        animation: "gradientBG 10s ease infinite",
      }}
    >
      {/* Background Animation */}
      <style>
        {`
          @keyframes gradientBG {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>

      {/* Page Title */}
      <h1 className="display-4 text-warning fw-bold animate__animated animate__fadeInDown">
        Ecometa: A Sustainable E-Waste Initiative ♻️
      </h1>

      {/* Inspiring Quote */}
      <p className="lead mt-3 fst-italic animate__animated animate__fadeIn">
        "Recycling today for a better tomorrow." 🌍
      </p>

      <p className="lead mt-3 animate__animated animate__fadeInUp">
        Join us in reducing electronic waste. <strong>Recycle, Earn, and Protect the Planet.</strong>
      </p>

      {/* Info Sections */}
      <div className="row mt-5 w-75">
        {/* About Us */}
        <div className="col-md-4 mb-4 p-4 rounded shadow animate__animated animate__zoomIn" style={{ backgroundColor: "#1b5e20" }}>
          <h3>
            <i className="bi bi-info-circle-fill text-warning"></i> About Us
          </h3>
          <p>We connect individuals and businesses with certified recyclers for responsible e-waste management.</p>
        </div>

        {/* How It Works */}
        <div className="col-md-4 mb-4 p-4 rounded shadow animate__animated animate__zoomIn animate__delay-1s" style={{ backgroundColor: "#0a192f" }}>
          <h3>
            <i className="bi bi-recycle text-success"></i> How It Works
          </h3>
          <p>Submit your e-waste, recyclers process it, and you earn rewards. <strong>Every small step matters!</strong></p>
        </div>

        {/* Get Started */}
        <div className="col-md-4 p-4 rounded shadow animate__animated animate__zoomIn animate__delay-2s" style={{ backgroundColor: "#2e7d32" }}>
          <h3>
            <i className="bi bi-person-check-fill text-warning"></i> Get Started
          </h3>
          <button
            className="btn btn-warning btn-lg mt-3 animate__animated animate__pulse animate__infinite"
            onClick={() => navigate("/login")}
          >
            Login & Recycle Now!
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
