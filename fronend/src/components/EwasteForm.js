import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Form, Button, Alert, Card } from "react-bootstrap";
import { FaRecycle, FaCheckCircle, FaArrowLeft } from "react-icons/fa";
import Dashboard from "./Dashboard";
function EwasteForm() {
  const [ewaste, setEwaste] = useState({ type: "", condition: "", quantity: "" });
  const [message, setMessage] = useState(null);
  const [variant, setVariant] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    const userId = localStorage.getItem("userId");

    if (!userId || isNaN(parseInt(userId, 10))) {
      setMessage("User ID missing. Please re-login.");
      setVariant("danger");
      return;
    }

    const quantityNum = Number(ewaste.quantity);
    if (!ewaste.type || !ewaste.condition || quantityNum <= 0 || isNaN(quantityNum)) {
      setMessage("Please fill in all fields with valid data.");
      setVariant("danger");
      return;
    }

    const requestData = {
      type: ewaste.type.toUpperCase(),
      condition: ewaste.condition.toUpperCase(),
      quantity: quantityNum,
      user: { id: parseInt(userId, 10) },
    };

    setLoading(true);
    try {
      await axios.post("http://localhost:8080/ewaste/submit", requestData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, "Content-Type": "application/json" },
      });

      setMessage("E-waste submitted successfully!");
      setVariant("success");
      setEwaste({ type: "", condition: "", quantity: "" });
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to submit e-waste!");
      setVariant("danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="ewaste-form">
      <Card className="form-card">
        <Card.Body>
          <h2 className="text-center mb-4">
            <FaRecycle /> Submit Your E-Waste
          </h2>

          {/* Motivational Recycling Message */}
          <div className="recycling-message">
            "One step towards a cleaner planet! Your small action makes a big impact. 🌍♻️"
          </div>

          {message && <Alert variant={variant} className="text-center">{message}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Type of E-Waste</Form.Label>
              <Form.Select value={ewaste.type} onChange={(e) => setEwaste({ ...ewaste, type: e.target.value })}>
                <option value="">Select Type</option>
                <option value="LAPTOP">Laptop</option>
                <option value="PHONE">Phone</option>
                <option value="BATTERY">Battery</option>
                <option value="OTHER">Other</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Condition</Form.Label>
              <Form.Select value={ewaste.condition} onChange={(e) => setEwaste({ ...ewaste, condition: e.target.value })}>
                <option value="">Select Condition</option>
                <option value="WORKING">Working</option>
                <option value="BROKEN">Broken</option>
                <option value="UNKNOWN">Unknown</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                min="1"
                placeholder="Enter quantity"
                value={ewaste.quantity}
                onChange={(e) => setEwaste({ ...ewaste, quantity: e.target.value })}
              />
            </Form.Group>

            <Button variant="success" type="submit" className="w-100 submit-btn mb-3" disabled={loading}>
              {loading ? "Submitting..." : "Submit"} <FaCheckCircle />
            </Button>
          </Form>

          {/* Back to Dashboard Button */}
          <Button variant="secondary" className="w-100 back-btn" onClick={() => navigate("/dashboard")}>
            <FaArrowLeft className="me-2" /> Back to Dashboard
          </Button>
        </Card.Body>
      </Card>

      {/* Custom CSS */}
      <style>{`
        /* Background Styling */
        .ewaste-form {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: linear-gradient(to right, #00695c, #004d40);
          padding: 20px;
        }

        /* Card Styling */
        .form-card {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.3);
          width: 100%;
          max-width: 500px;
          text-align: center;
          color: white;
          transition: transform 0.3s ease-in-out;
        }

        .form-card:hover {
          transform: translateY(-5px);
        }

        /* Recycling Message */
        .recycling-message {
          font-size: 1rem;
          font-style: italic;
          text-align: center;
          background: rgba(255, 255, 255, 0.2);
          padding: 10px;
          border-radius: 8px;
          margin-bottom: 15px;
          box-shadow: 0px 5px 15px rgba(255, 255, 255, 0.3);
        }

        /* Submit & Back Button */
        .submit-btn, .back-btn {
          font-size: 1.1rem;
          font-weight: bold;
          transition: all 0.3s ease-in-out;
        }

        .submit-btn:hover {
          transform: scale(1.05);
        }

        .back-btn:hover {
          background: #444;
          transform: scale(1.05);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .form-card {
            width: 90%;
          }
        }
      `}</style>
    </Container>
  );
}

export default EwasteForm;
