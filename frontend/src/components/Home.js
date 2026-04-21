import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";


function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-hero">
      <Container className="py-5">
        <Row className="align-items-center min-vh-75">
          <Col lg={6} className="text-start pe-lg-5 animate__animated animate__fadeInLeft">
            <h1 className="display-3 fw-bold mb-4">
              <span className="text-gradient">Recycle</span> Today, <br />
              <span className="text-white">Save Tomorrow.</span>
            </h1>
            <p className="lead text-white mb-5 fs-4">
              Ecometa connects you with certified recyclers to ensure your electronic waste is handled responsibly. Earn rewards while protecting our planet.
            </p>
            <div className="d-flex gap-3">
              <Button className="btn-premium px-5 py-3" onClick={() => navigate("/register")}>
                Start Recycling Now
              </Button>
              <Button variant="outline-light" className="px-5 py-3" onClick={() => navigate("/map")}>
                View Nearby Map
              </Button>
            </div>
          </Col>
          <Col lg={6} className="d-none d-lg-block animate__animated animate__fadeInRight">
            <div className="hero-stats-card glass-card p-4">
              <h3 className="text-primary mb-3">Impact Checklist</h3>
              <ul className="list-unstyled">
                <li className="mb-3">✅ Zero-landfill policy for all e-waste</li>
                <li className="mb-3">✅ Certified recycling partners</li>
                <li className="mb-3">✅ Fair market value for your old devices</li>
                <li>✅ Verified ESG reporting for businesses</li>
              </ul>
            </div>
          </Col>
        </Row>

        <Row className="mt-5 g-4">
          <Col md={4}>
            <div className="glass-card p-4 h-100 feature-hover">
              <div className="feature-icon mb-3">♻️</div>
              <h4 className="fw-bold text-white">Smart Mapping</h4>
              <p className="text-white">Instantly find certified recycling hubs near you using our real-time geolocation map.</p>
            </div>
          </Col>
          <Col md={4}>
            <div className="glass-card p-4 h-100 feature-hover">
              <div className="feature-icon mb-3">📜</div>
              <h4 className="fw-bold text-white">Verified Certificates</h4>
              <p className="text-white">Receive official recycling certificates for every submission, perfect for tax and ESG compliance.</p>
            </div>
          </Col>
          <Col md={4}>
            <div className="glass-card p-4 h-100 feature-hover">
              <div className="feature-icon mb-3">💰</div>
              <h4 className="fw-bold text-white">Eco-Rewards</h4>
              <p className="text-white">Submit your waste and get credited. Sustainability has never been this rewarding.</p>
            </div>
          </Col>
        </Row>
      </Container>

      <style>{`
        .home-hero {
          background: radial-gradient(circle at 10% 20%, rgba(16, 185, 129, 0.05) 0%, transparent 40%),
                      radial-gradient(circle at 90% 80%, rgba(14, 165, 233, 0.05) 0%, transparent 40%);
          min-height: 90vh;
          display: flex;
          align-items: center;
        }

        .min-vh-75 { min-height: 75vh; }

        .hero-stats-card {
          border-left: 4px solid var(--primary);
        }

        .feature-icon {
          font-size: 2.5rem;
          background: rgba(16, 185, 129, 0.1);
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
        }

        .feature-hover {
          transition: transform 0.3s ease, border-color 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .feature-hover:hover {
          transform: translateY(-10px);
          border-color: var(--primary);
        }
      `}</style>
    </div>
  );
}

export default Home;
