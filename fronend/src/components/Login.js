import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaTree, FaEye, FaEyeSlash } from "react-icons/fa"; // Icons
import "bootstrap/dist/css/bootstrap.min.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const role = localStorage.getItem("role");
      navigate(role?.toLowerCase() === "recycler" ? "/recycler-home" : "/user-home");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://localhost:8080/users/login", { email, password });

      console.log("Login Response:", response.data);

      const { token, role, userId } = response.data;

      if (!userId) {
        setError("Login failed: User ID missing. Please contact support.");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("userId", userId);

      alert("Login successful!");

      navigate(role.toLowerCase() === "recycler" ? "/recycler-home" : "/user-home");
    } catch (error) {
      setError(error.response?.data?.message || "Invalid credentials or something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="quote fadeIn">
        <h1>"Waste isn’t waste until we waste it!"</h1>
        <p>Join us in making a sustainable future. 🌍♻️</p>
      </div>

      <div className="login-box slideIn">
        <h2 className="text-center text-success">Login</h2>
        {error && <p className="text-danger text-center">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <input
              type="email"
              className="form-control input-glow"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3 input-group">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control input-glow"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <button
            type="submit"
            className="btn btn-success w-100 btn-glow"
            disabled={loading || !email || !password}
          >
            <FaTree className="me-2" /> {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-center mt-3">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>

      {/* Floating Leaves Animation */}
      <div className="leaves">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="leaf"></div>
        ))}
      </div>

      {/* Internal Styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes float {
          0% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(-20px); opacity: 0.8; }
          100% { transform: translateY(0); opacity: 1; }
        }

        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: linear-gradient(to right, #004d40, #1b5e20);
          position: relative;
          color: white;
          overflow: hidden;
        }

        .quote {
          position: absolute;
          top: 10%;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          width: 80%;
          max-width: 500px;
          animation: fadeIn 1s ease-in-out;
        }

        .quote h1 {
          font-size: 2rem;
          font-weight: bold;
          color: #ffeb3b;
        }

        .quote p {
          font-size: 1.2rem;
          font-style: italic;
        }

        .login-box {
          background: white;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.3);
          width: 400px;
          animation: slideIn 1s ease-in-out;
        }

        .input-glow {
          transition: box-shadow 0.3s ease-in-out;
        }

        .input-glow:focus {
          box-shadow: 0px 0px 10px rgba(72, 239, 128, 0.8);
        }

        .btn-glow {
          transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-glow:hover {
          transform: scale(1.05);
          box-shadow: 0px 4px 10px rgba(0, 255, 0, 0.5);
        }

        /* Floating Leaves Effect */
        .leaves {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          pointer-events: none;
        }

        .leaf {
          position: absolute;
          width: 30px;
          height: 30px;
          background: rgba(34, 139, 34, 0.5);
          border-radius: 50%;
          animation: float 5s infinite ease-in-out;
        }

        .leaf:nth-child(1) { top: 20%; left: 10%; animation-duration: 6s; }
        .leaf:nth-child(2) { top: 40%; left: 20%; animation-duration: 7s; }
        .leaf:nth-child(3) { top: 10%; left: 50%; animation-duration: 5s; }
        .leaf:nth-child(4) { top: 60%; left: 30%; animation-duration: 6s; }
        .leaf:nth-child(5) { top: 80%; left: 40%; animation-duration: 7s; }
      `}</style>
    </div>
  );
}

export default Login;
