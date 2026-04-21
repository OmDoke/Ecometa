import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Container, Spinner, Button, Form, Row, Col, Alert, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaSave, FaMapMarkerAlt, FaClock, FaCheck, FaBuilding, FaPhone, FaEnvelope } from "react-icons/fa";
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { motion } from "framer-motion";

// Fix Leaflet marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

function LocationPicker({ position, onPositionChange }) {
  useMapEvents({
    click(e) {
      onPositionChange(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position} />
  );
}

function RecyclerDetails() {
  const [recycler, setRecycler] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    acceptedDeviceTypes: [],
    operatingHours: {
      monday: { open: "09:00", close: "18:00" },
      tuesday: { open: "09:00", close: "18:00" },
      wednesday: { open: "09:00", close: "18:00" },
      thursday: { open: "09:00", close: "18:00" },
      friday: { open: "09:00", close: "18:00" },
      saturday: { open: "10:00", close: "15:00" },
      sunday: null
    },
    location: null
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  const deviceOptions = ["Phones", "Laptops", "Batteries", "TVs", "Appliances"];

  useEffect(() => {
    if (localStorage.getItem("role") !== "RECYCLER") {
      navigate("/");
    }

    const fetchRecyclerDetails = async () => {
      try {
        const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";
        const response = await axios.get(`${API_URL}/api/recyclers/${userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = response.data;
        setRecycler(prev => ({
          ...prev,
          ...data,
          location: data.location ? { lat: data.location.y, lng: data.location.x } : null
        }));
      } catch (error) {
        console.error("Error fetching recycler details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecyclerDetails();
  }, [userId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";
      const payload = {
        ...recycler,
        location: recycler.location ? { type: "Point", coordinates: [recycler.location.lng, recycler.location.lat] } : null
      };

      await axios.put(`${API_URL}/api/recyclers/${userId}`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (error) {
      setMessage({ type: "danger", text: "Failed to update profile." });
    } finally {
      setSaving(false);
    }
  };

  const handleDeviceToggle = (type) => {
    setRecycler(prev => ({
      ...prev,
      acceptedDeviceTypes: prev.acceptedDeviceTypes?.includes(type)
        ? prev.acceptedDeviceTypes.filter(t => t !== type)
        : [...(prev.acceptedDeviceTypes || []), type]
    }));
  };

  if (loading) return (
    <div className="vh-100 d-flex justify-content-center align-items-center bg-emerald-details">
      <Spinner animation="border" variant="primary" />
    </div>
  );

  return (
    <div className="bg-emerald-details py-5 min-vh-100">
      <Container>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="d-flex justify-content-between align-items-center mb-5 flex-wrap gap-3">
            <div>
              <h2 className="fw-bold text-gradient m-0">Partner Center Settings</h2>
              <p className="text-white-50 m-0">Manage your facility details and availability</p>
            </div>
            <Button variant="outline-light" className="border-white-10 text-white-50 px-4 py-2" onClick={() => navigate("/recycler-home")}>
              <FaArrowLeft className="me-2" /> Back Home
            </Button>
          </div>

          {message && (
            <Alert variant={message.type} className="glass-card border-white-10 text-white shadow-lg mb-4" dismissible onClose={() => setMessage(null)}>
              {message.type === 'success' && <FaCheck className="me-2 text-success" />}
              {message.text}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Row className="g-4">
              <Col lg={7}>
                {/* Basic Information */}
                <Card className="glass-card mb-4 border-white-10">
                  <Card.Body className="p-4 p-md-5">
                    <h5 className="fw-bold text-white mb-4 d-flex align-items-center gap-2">
                       <FaBuilding className="text-primary" /> Basic Information
                    </h5>
                    <Row className="mb-4">
                      <Col md={12}>
                        <Form.Group className="mb-4">
                          <Form.Label className="text-white-50 small fw-bold">Business Name</Form.Label>
                          <Form.Control 
                            className="form-control-premium"
                            value={recycler.name || recycler.shopName || ""} 
                            onChange={e => setRecycler({...recycler, name: e.target.value})}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="text-white-50 small fw-bold">Email Address</Form.Label>
                          <Form.Control 
                            type="email"
                            className="form-control-premium"
                            value={recycler.email || ""} 
                            onChange={e => setRecycler({...recycler, email: e.target.value})}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="text-white-50 small fw-bold">Phone Number</Form.Label>
                          <Form.Control 
                            className="form-control-premium"
                            value={recycler.phone || ""} 
                            onChange={e => setRecycler({...recycler, phone: e.target.value})}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Form.Group className="mb-4">
                      <Form.Label className="text-white-50 small fw-bold">Business Address</Form.Label>
                      <Form.Control 
                        as="textarea"
                        rows={2}
                        className="form-control-premium"
                        value={recycler.address || ""} 
                        onChange={e => setRecycler({...recycler, address: e.target.value})}
                      />
                    </Form.Group>

                    <h6 className="mt-4 mb-3 text-white-50 small fw-bold text-uppercase tracking-wider">Accepted Device Types</h6>
                    <div className="d-flex flex-wrap gap-3">
                      {deviceOptions.map(type => (
                        <div 
                          key={type} 
                          onClick={() => handleDeviceToggle(type)}
                          className={`device-toggle-pill ${recycler.acceptedDeviceTypes?.includes(type) ? 'active' : ''}`}
                        >
                          {recycler.acceptedDeviceTypes?.includes(type) ? <FaCheck className="icon-s" /> : <div className="circle-s" />}
                          {type}
                        </div>
                      ))}
                    </div>
                  </Card.Body>
                </Card>

                {/* Operating Hours */}
                <Card className="glass-card border-white-10">
                  <Card.Body className="p-4 p-md-5">
                    <h5 className="fw-bold text-white mb-4 d-flex align-items-center gap-2">
                       <FaClock className="text-primary" /> Operating Hours
                    </h5>
                    <div className="hours-grid">
                      {days.map(day => (
                        <div key={day} className="hours-row py-3 border-bottom border-white-10 d-flex align-items-center flex-wrap gap-3">
                          <div className="text-capitalize text-white fw-bold" style={{ width: '100px' }}>{day}</div>
                          <div className="d-flex align-items-center gap-3 flex-grow-1">
                            <Form.Check 
                              type="switch" 
                              id={`switch-${day}`}
                              className="premium-switch"
                              label={recycler.operatingHours[day] ? "Open" : "Closed"}
                              checked={!!recycler.operatingHours[day]}
                              onChange={(e) => {
                                const newHours = {...recycler.operatingHours};
                                if (e.target.checked) {
                                  newHours[day] = { open: "09:00", close: "18:00" };
                                } else {
                                  newHours[day] = null;
                                }
                                setRecycler({...recycler, operatingHours: newHours});
                              }}
                            />
                            {recycler.operatingHours[day] && (
                              <div className="d-flex align-items-center gap-2 slide-in-left">
                                <Form.Control 
                                  type="time" 
                                  size="sm"
                                  className="form-control-premium time-input"
                                  value={recycler.operatingHours[day].open}
                                  onChange={e => {
                                    const newHours = {...recycler.operatingHours};
                                    newHours[day].open = e.target.value;
                                    setRecycler({...recycler, operatingHours: newHours});
                                  }}
                                />
                                <span className="text-white-50 small">to</span>
                                <Form.Control 
                                  type="time" 
                                  size="sm"
                                  className="form-control-premium time-input"
                                  value={recycler.operatingHours[day].close}
                                  onChange={e => {
                                    const newHours = {...recycler.operatingHours};
                                    newHours[day].close = e.target.value;
                                    setRecycler({...recycler, operatingHours: newHours});
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              <Col lg={5}>
                {/* Map Location */}
                <Card className="glass-card border-white-10 h-100 d-flex flex-column">
                  <Card.Body className="p-4 p-md-5 d-flex flex-column h-100">
                    <h5 className="fw-bold text-white mb-3 d-flex align-items-center gap-2">
                       <FaMapMarkerAlt className="text-primary" /> Map Pinpoint
                    </h5>
                    <p className="small text-white-50 mb-4">Click anywhere on the map to precisely update your facility's location for the user map.</p>
                    
                    <div className="flex-grow-1 map-container-premium mb-4">
                      <MapContainer 
                        center={recycler.location || [18.5204, 73.8567]} 
                        zoom={13} 
                        style={{ height: '100%', width: '100%' }}
                      >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <LocationPicker 
                          position={recycler.location} 
                          onPositionChange={(pos) => setRecycler({...recycler, location: pos})} 
                        />
                      </MapContainer>
                    </div>

                    {recycler.location && (
                      <div className="location-info-p p-3 rounded-3 mb-4 d-flex justify-content-between">
                        <span className="small text-white-50">LAT: {recycler.location.lat.toFixed(6)}</span>
                        <span className="small text-white-50">LNG: {recycler.location.lng.toFixed(6)}</span>
                      </div>
                    )}

                    <div className="mt-auto">
                      <Button 
                        className="btn-premium w-100 py-3 shadow-lg"
                        type="submit" 
                        disabled={saving}
                      >
                        {saving ? <Spinner animation="border" size="sm" /> : <><FaSave className="me-2" /> Commit Profile Changes</>}
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Form>
        </motion.div>
      </Container>

      <style>{`
        .bg-emerald-details {
          background-color: #022c22;
          background-image: 
            radial-gradient(at 0% 0%, rgba(16, 185, 129, 0.05) 0, transparent 50%), 
            radial-gradient(at 100% 100%, rgba(14, 165, 233, 0.05) 0, transparent 50%);
        }

        .border-white-10 { border-color: rgba(255, 255, 255, 0.1) !important; }

        .form-control-premium {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          padding: 12px 16px;
          color: white !important;
          transition: all 0.3s ease;
        }
        .form-control-premium:focus {
          background: rgba(255, 255, 255, 0.07);
          border-color: var(--primary);
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
          outline: none;
        }

        .device-toggle-pill {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.6);
          padding: 10px 18px;
          border-radius: 30px;
          cursor: pointer;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: all 0.2s ease;
        }
        .device-toggle-pill.active {
          background: rgba(16, 185, 129, 0.15);
          border-color: var(--primary);
          color: white;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.2);
        }
        .icon-s { font-size: 0.8rem; color: var(--primary); }
        .circle-s { width: 8px; height: 8px; background: rgba(255,255,255,0.2); border-radius: 50%; }

        .premium-switch .form-check-input {
          background-color: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.2);
          width: 3rem;
          height: 1.5rem;
        }
        .premium-switch .form-check-input:checked {
          background-color: var(--primary);
          border-color: var(--primary);
        }
        .premium-switch .form-check-label { color: rgba(255,255,255,0.5); font-size: 0.85rem; padding-left: 0.5rem; }

        .time-input { width: 120px; text-align: center; font-weight: bold; }

        .map-container-premium {
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.1);
          filter: contrast(1.1) brightness(0.9) hue-rotate(5deg);
        }

        .location-info-p {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
        }

        .slide-in-left { animation: slideLeft 0.3s ease-out; }
        @keyframes slideLeft {
          from { opacity: 0; transform: translateX(10px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

export default RecyclerDetails;
