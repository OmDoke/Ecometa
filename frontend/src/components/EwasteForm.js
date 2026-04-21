import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Container, Form, Button, Alert, Row, Col, Spinner } from "react-bootstrap";
import { FaRecycle, FaCheckCircle, FaArrowLeft, FaMapMarkerAlt, FaAlignLeft } from "react-icons/fa";
import { motion } from "framer-motion";

function EwasteForm() {
  const [ewaste, setEwaste] = useState({ 
    type: "", 
    condition: "", 
    quantity: "", 
    pickupAddress: "", 
    description: "" 
  });
  const [selectedRecycler, setSelectedRecycler] = useState(null);
  const [message, setMessage] = useState(null);
  const [variant, setVariant] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const recyclerId = params.get("recycler");
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    // Fetch user profile to pre-fill address
    const fetchProfile = async () => {
      if (userId && token) {
        try {
          const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";
          const res = await axios.get(`${API_URL}/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.data.address) {
            setEwaste(prev => ({ ...prev, pickupAddress: res.data.address }));
          }
        } catch (err) {
          console.error("Failed to fetch profile for pre-fill", err);
        }
      }
    };

    if (recyclerId) {
      const fetchRecycler = async () => {
        try {
          const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";
          const res = await axios.get(`${API_URL}/api/recyclers/${recyclerId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setSelectedRecycler(res.data);
        } catch (err) {
          setSelectedRecycler({ id: recyclerId, name: "Selected Partner Center" });
        }
      };
      fetchRecycler();
    }
    fetchProfile();
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Session expired. Please log in again.");
      setVariant("danger");
      return;
    }

    const quantityNum = Number(ewaste.quantity);
    if (!ewaste.type || !ewaste.condition || !ewaste.pickupAddress || quantityNum <= 0) {
      setMessage("Please fill all required fields correctly.");
      setVariant("danger");
      return;
    }

    const requestData = {
      type: ewaste.type.toUpperCase(),
      condition: ewaste.condition.toUpperCase(),
      quantity: quantityNum,
      pickupAddress: ewaste.pickupAddress,
      description: ewaste.description,
      recycler: selectedRecycler ? { id: new URLSearchParams(location.search).get("recycler") || selectedRecycler.id } : null,
    };

    setLoading(true);
    try {
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";
      await axios.post(`${API_URL}/ewaste/submit`, requestData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });

      setMessage("Item submitted to recycler successfully! You will be notified when they accept it.");
      setVariant("success");
      setEwaste({ type: "", condition: "", quantity: "", pickupAddress: "", description: "" });
      setTimeout(() => navigate("/user-home"), 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Submission failed. Please try again.");
      setVariant("danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ewaste-page-wrapper py-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={7}>
            <motion.div 
              className="glass-card p-4 p-md-5"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="text-center mb-4">
                <h2 className="fw-bold text-gradient d-flex align-items-center justify-content-center gap-3">
                  <FaRecycle /> Recycler Submission
                </h2>
                <p className="text-white opacity-75 mt-2">Every piece of electronic waste recycled is a step towards a greener Earth. 🌍♻️</p>
              </div>

              {selectedRecycler && (
                <div className="selected-partner-banner mb-4 p-3 rounded-3 d-flex align-items-center gap-3">
                  <div className="partner-icon-pulse"><FaMapMarkerAlt /></div>
                  <div className="flex-grow-1">
                    <div className="small text-white-50">Selected Partner</div>
                    <div className="fw-bold text-white">{selectedRecycler.name}</div>
                  </div>
                  <Button 
                    variant="link" 
                    className="text-primary text-decoration-none p-0 fw-bold" 
                    onClick={() => navigate("/map")}
                  >
                    Change
                  </Button>
                </div>
              )}

              {message && (
                <Alert variant={variant} className={`glass-card border-${variant} text-white mb-4 shadow-lg text-center`}>
                  {variant === "success" && <FaCheckCircle className="me-2 text-success" />}
                  {message}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <div className="mb-3">
                      <label className="form-label text-white small fw-bold">Electronic Type *</label>
                      <Form.Select 
                        className="form-control-premium text-white"
                        value={ewaste.type}
                        onChange={(e) => setEwaste({ ...ewaste, type: e.target.value })}
                        required
                      >
                        <option value="" className="text-dark">Select category...</option>
                        <option value="PHONE" className="text-dark">Mobile Phones / Tablets</option>
                        <option value="LAPTOP" className="text-dark">Laptops / PCs</option>
                        <option value="BATTERY" className="text-dark">Batteries / UPS</option>
                        <option value="TV" className="text-dark">Televisions / Monitors</option>
                        <option value="APPLIANCE" className="text-dark">Large Appliances</option>
                      </Form.Select>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <label className="form-label text-white small fw-bold">Quantity (Units) *</label>
                      <input
                        type="number"
                        className="form-control-premium text-white"
                        placeholder="E.g. 1"
                        min="1"
                        value={ewaste.quantity}
                        onChange={(e) => setEwaste({ ...ewaste, quantity: e.target.value })}
                        required
                      />
                    </div>
                  </Col>
                </Row>

                <div className="mb-3">
                  <label className="form-label text-white small fw-bold">Physical Condition *</label>
                  <Form.Select
                    className="form-control-premium text-white"
                    value={ewaste.condition}
                    onChange={(e) => setEwaste({ ...ewaste, condition: e.target.value })}
                    required
                  >
                    <option value="" className="text-dark">Select condition...</option>
                    <option value="WORKING" className="text-dark">Working (Mint/Good)</option>
                    <option value="PARTIALLY_WORKING" className="text-dark">Partially Working (Damaged)</option>
                    <option value="NON_FUNCTIONAL" className="text-dark">Dead (Non-Functional)</option>
                    <option value="SCRAP" className="text-dark">Scrap / Bare Components</option>
                  </Form.Select>
                </div>

                <div className="mb-3">
                  <label className="form-label text-white small fw-bold"><FaMapMarkerAlt className="me-1" /> Pickup Address *</label>
                  <input
                    type="text"
                    className="form-control-premium text-white"
                    placeholder="Enter full address for pickup"
                    value={ewaste.pickupAddress}
                    onChange={(e) => setEwaste({ ...ewaste, pickupAddress: e.target.value })}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label text-white small fw-bold"><FaAlignLeft className="me-1" /> Additional Notes (Optional)</label>
                  <textarea
                    className="form-control-premium text-white"
                    rows="2"
                    placeholder="E.g. Item is in a box, call before arriving..."
                    value={ewaste.description}
                    onChange={(e) => setEwaste({ ...ewaste, description: e.target.value })}
                  />
                </div>

                <div className="d-grid gap-3">
                  <button
                    type="submit"
                    className="btn-premium py-3 d-flex align-items-center justify-content-center gap-2"
                    disabled={loading}
                  >
                    {loading ? <Spinner animation="border" size="sm" /> : <><FaCheckCircle /> Confirm Submission</>}
                  </button>
                  <Button 
                    variant="outline-secondary" 
                    className="py-2 border-0 text-white-50 d-flex align-items-center justify-content-center gap-2"
                    onClick={() => navigate("/user-home")}
                  >
                    <FaArrowLeft /> View My Dashboard
                  </Button>
                </div>
              </Form>
            </motion.div>
          </Col>
        </Row>
      </Container>

      <style>{`
        .ewaste-page-wrapper {
          background: radial-gradient(circle at top right, rgba(16, 185, 129, 0.08), transparent),
                      radial-gradient(circle at bottom left, rgba(14, 165, 233, 0.08), transparent);
          min-height: 90vh;
        }
        .form-control-premium {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          padding: 12px 16px;
          transition: all 0.3s ease;
          width: 100%;
        }
        .form-control-premium:focus {
          background: rgba(255, 255, 255, 0.07);
          border-color: var(--primary);
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.15);
          outline: none;
        }
      `}</style>
    </div>
  );
}

export default EwasteForm;
