import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaTree, FaEye, FaEyeSlash } from "react-icons/fa";
import { Container, Row, Col, Alert, Spinner } from "react-bootstrap";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";
      const response = await axios.post(`${API_URL}/users/login`, { email, password });

      const { token, role, userId } = response.data;

      if (!userId) {
        setError("Login failed: User ID missing.");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("userId", userId);

      navigate(role.toLowerCase() === "recycler" ? "/recycler-home" : "/user-home");
    } catch (error) {
      setError(error.response?.data?.message || "Invalid credentials!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <Container>
        <Row className="justify-content-center align-items-center min-vh-90">
          <Col md={6} lg={5}>
            <motion.div 
              className="glass-card p-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="text-center mb-4">
                <h2 className="fw-bold text-gradient">Welcome Back</h2>
                <p className="text-white">Sign in to continue your recycling journey</p>
              </div>

              {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}

              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label className="form-label small text-white">Email Address</label>
                  <input
                    type="email"
                    className="form-control bg-transparent text-white border-secondary"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
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
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-premium w-100 py-3 mb-3 d-flex align-items-center justify-content-center gap-2"
                  disabled={loading || !email || !password}
                >
                  {loading ? <Spinner size="sm" /> : <><FaTree /> Sign In</>}
                </button>
              </form>

              <p className="text-center mt-3 mb-0 small text-white">
                Don't have an account? <Link to="/register" className="text-primary fw-bold text-decoration-none">Create one here</Link>
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
        .form-control:focus {
          background: rgba(255,255,255,0.05);
          color: white;
          border-color: var(--primary);
          box-shadow: 0 0 0 0.25rem rgba(16, 185, 129, 0.25);
        }
      `}</style>
    </div>
  );
}

export default Login;
