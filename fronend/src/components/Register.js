import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
      setError("Password must be at least 6 characters, include a number & special character.");
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:8080/users/register", { name, email, password, role });
      alert("Registration successful!");
      navigate("/login");
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2 className="text-center text-dark">Create Account</h2>
        <p className="text-center text-muted">Join our recycling community 🌱</p>
        
        {error && <p className="text-danger text-center">{error}</p>}
        
        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control custom-input"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="email"
              className="form-control custom-input"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3 input-group">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control custom-input"
              placeholder="Create Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="btn btn-outline-secondary toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
          <div className="mb-3">
            <select className="form-select custom-input" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="USER">User</option>
              <option value="RECYCLER">Recycler</option>
            </select>
          </div>
          <button type="submit" className="btn btn-success w-100 register-btn" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>

      <style>{`
        /* Background */
        .register-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: linear-gradient(135deg, #00a859, #004d40);
        }

        /* Card Box */
        .register-box {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.3);
          width: 400px;
          text-align: center;
          transition: transform 0.3s ease-in-out;
        }

        .register-box:hover {
          transform: translateY(-5px);
        }

        /* Input Fields */
        .custom-input {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          padding: 12px;
          border-radius: 8px;
          color: white;
          transition: box-shadow 0.3s;
        }

        .custom-input::placeholder {
          color: rgba(255, 255, 255, 0.7);
        }

        .custom-input:focus {
          outline: none;
          box-shadow: 0px 0px 10px rgba(255, 255, 255, 0.7);
        }

        /* Toggle Password Button */
        .toggle-btn {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          transition: all 0.3s;
        }

        .toggle-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        /* Register Button */
        .register-btn {
          background: #ffeb3b;
          color: black;
          font-weight: bold;
          border-radius: 8px;
          transition: all 0.3s;
        }

        .register-btn:hover {
          background: #ffd600;
          transform: scale(1.05);
        }

        /* Responsive */
        @media (max-width: 500px) {
          .register-box {
            width: 90%;
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
}

export default Register;
