import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Container, Row, Col, Alert, Spinner } from "react-bootstrap";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) =>
    password.length >= 6 && /[0-9]/.test(password) && /[!@#$%^&*]/.test(password);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("Please fill out all fields.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Invalid email format.");
      return;
    }
    if (!validatePassword(password)) {
      setError("Password must be at least 6 characters with numbers and symbols.");
      return;
    }

    setLoading(true);
    try {
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";
      await axios.post(`${API_URL}/users/register`, { name, email, password, role });
      navigate("/login");
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper py-5">
      <Container>
        <Row className="justify-content-center align-items-center min-vh-90">
          <Col md={7} lg={5}>
            <motion.div 
              className="glass-card p-4 p-md-5"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="text-center mb-4">
                <h2 className="fw-bold text-gradient">Join Ecometa</h2>
                <p className="text-white">Create an account to start recycling responsibly</p>
              </div>

              {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}

              <form onSubmit={handleRegister}>
                <div className="mb-3">
                  <label className="form-label small text-white">Full Name</label>
                  <input
                    type="text"
                    className="form-control bg-transparent text-white border-secondary"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label small text-white">Email Address</label>
                  <input
                    type="email"
                    className="form-control bg-transparent text-white border-secondary"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small text-white">Account Type</label>
                  <select 
                    className="form-select bg-transparent text-white border-secondary"
                    value={role} 
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="USER" className="text-dark">Standard User (Recycler)</option>
                    <option value="RECYCLER" className="text-dark">Business Partner (Recycling Hub)</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="form-label small text-white">Password</label>
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control bg-transparent text-white border-secondary border-end-0"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary border-start-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                  <div className="form-text small text-white" style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                    Min 6 chars, 1 number, 1 special char.
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-premium w-100 py-3 mb-3 d-flex align-items-center justify-content-center gap-2"
                  disabled={loading}
                >
                  {loading ? <Spinner size="sm" /> : "Create Account"}
                </button>
              </form>

              <p className="text-center mt-3 mb-0 small text-white">
                Already have an account? <Link to="/login" className="text-primary fw-bold text-decoration-none">Sign in here</Link>
              </p>
            </motion.div>
          </Col>
        </Row>
      </Container>

      <style>{`
        .auth-wrapper {
          background: radial-gradient(circle at top right, rgba(16, 185, 129, 0.08), transparent),
                      radial-gradient(circle at bottom left, rgba(14, 165, 233, 0.08), transparent);
          min-height: 90vh;
        }
        .min-vh-90 { min-height: 90vh; }
        .form-control:focus, .form-select:focus {
          background: rgba(255,255,255,0.05);
          color: white;
          border-color: var(--primary);
          box-shadow: 0 0 0 0.25rem rgba(16, 185, 129, 0.25);
        }
        .form-select option {
          background-color: white;
          color: black;
        }
      `}</style>
    </div>
  );
}

export default Register;
