import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Form, Badge, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaDirections, FaRecycle, FaStar, FaMapMarkerAlt, FaSearch, FaArrowLeft, FaFilter } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

// Fix Leaflet marker icon issues - Execute inside the component or keep at top level carefully
if (typeof window !== 'undefined') {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  });
}

function getMarkerIcon(rating) {
  let color = '#10b981'; // Primary Emerald
  if (rating >= 4.7) color = '#059669'; // Deeper emerald
  else if (rating < 4.0) color = '#0ea5e9'; // Blue accent

  return new L.DivIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: 32px; height: 32px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 2px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.3); display:flex; align-items:center; justify-content:center;"><div style="transform: rotate(45deg); width:10px; height:10px; background:white; border-radius:50%;"></div></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
}

function FlyToLocation({ destination }) {
  const map = useMap();
  useEffect(() => {
    if (destination) {
      map.flyTo([destination.lat, destination.lng], 15, { animate: true, duration: 1.5 });
    }
  }, [destination, map]);
  return null;
}

export default function RecyclerMap() {
  const [userLocation, setUserLocation] = useState(null);
  const [recyclers, setRecyclers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState([]);
  const [radiusKm, setRadiusKm] = useState(10);
  const [selectedRecycler, setSelectedRecycler] = useState(null);
  const navigate = useNavigate();

  const deviceTypes = ["Phones", "Laptops", "Batteries", "TVs", "Appliances"];

  const fetchNearbyRecyclers = useCallback(async (lat, lng) => {
    setLoading(true);
    try {
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/api/map/recyclers`, {
        params: {
          lat,
          lng,
          radiusKm,
          deviceTypes: activeFilters.length > 0 ? activeFilters.join(",") : null
        },
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecyclers(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to load nearby hubs. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }, [radiusKm, activeFilters]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLocation(loc);
          fetchNearbyRecyclers(loc.lat, loc.lng);
        },
        (err) => {
          setError("Location access denied. Please enter your city manually.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation not supported by your browser.");
      setLoading(false);
    }
  }, [fetchNearbyRecyclers]);

  const filteredRecyclers = useMemo(() => {
    return recyclers.filter(r => 
      r.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [recyclers, searchQuery]);

  const handleFilterClick = (type) => {
    if (type === "All") {
      setActiveFilters([]);
    } else {
      setActiveFilters(prev => 
        prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
      );
    }
  };

  const handleRecyclerSelect = (r) => {
    setSelectedRecycler(r);
    const element = document.getElementById(`card-${r.id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  if (loading && !userLocation) {
    return (
      <div className="vh-100 d-flex flex-column justify-content-center align-items-center bg-emerald-deep text-white">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
        >
          <FaRecycle size={60} className="text-primary opacity-50" />
        </motion.div>
        <p className="mt-4 fw-bold tracking-widest text-uppercase small opacity-75">Locating nearest hubs...</p>
      </div>
    );
  }

  return (
    <Container fluid className="vh-100 p-0 overflow-hidden bg-emerald-deep">
      <Row className="g-0 h-100">
        {/* Left Sidebar: Glassmorphic Explorer */}
        <Col md={4} lg={3} className="h-100 d-flex flex-column explorer-sidebar">
          <motion.div 
            className="p-3 border-bottom border-white-10"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <div className="d-flex align-items-center gap-2 mb-3">
              <Button variant="link" className="p-0 text-white opacity-50" onClick={() => navigate('/user-home')}>
                <FaArrowLeft />
              </Button>
              <h4 className="fw-bold m-0 text-gradient">Hub Explorer</h4>
            </div>
            
            <div className="premium-search-box mb-3">
              <FaSearch className="search-icon" />
              <Form.Control 
                placeholder="Search centers..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-0 text-white shadow-none"
              />
            </div>

            <div className="d-flex flex-wrap gap-2">
              <Badge 
                role="button"
                className={`filter-badge ${activeFilters.length === 0 ? 'active' : ''}`}
                onClick={() => handleFilterClick("All")}
              >
                All
              </Badge>
              {deviceTypes.map(type => (
                <Badge 
                  key={type} 
                  role="button"
                  className={`filter-badge ${activeFilters.includes(type) ? 'active' : ''}`}
                  onClick={() => handleFilterClick(type)}
                >
                  {type}
                </Badge>
              ))}
            </div>
          </motion.div>

          <div className="flex-grow-1 overflow-auto p-3 scrollbar-hidden">
            <AnimatePresence>
              {error && (
                <motion.div key="error-alert" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <Alert variant="warning" className="glass-card border-warning text-white small p-2">
                    <FaMapMarkerAlt className="me-2" />
                    {error}
                  </Alert>
                </motion.div>
              )}

              {filteredRecyclers.length === 0 && !loading && (
                <div key="no-results" className="text-center py-5 opacity-50 text-white small uppercase tracking-widest">
                  No hubs found in your area.
                </div>
              )}

              {filteredRecyclers.map((r, index) => (
                <motion.div 
                  key={r.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card 
                    id={`card-${r.id}`}
                    className={`hub-card mb-3 glass-card ${selectedRecycler?.id === r.id ? 'active' : ''}`}
                    onClick={() => handleRecyclerSelect(r)}
                  >
                    <Card.Body className="p-3">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="fw-bold m-0 text-white">{r.name}</h6>
                        <Badge className={`badge-status ${r.openNow ? 'bg-success' : 'bg-white-10'}`}>
                          {r.openNow ? "Open" : "Closed"}
                        </Badge>
                      </div>
                      <div className="small text-white-50 mb-3 d-flex align-items-center gap-1">
                        <FaMapMarkerAlt className="text-primary" /> {r.distanceKm} km away
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <span className="text-warning small me-1"><FaStar /></span>
                          <span className="text-white fw-bold small">{r.rating}</span>
                          <span className="text-white-50 small ms-1">({r.reviewCount})</span>
                        </div>
                        <div className="d-flex gap-1">
                           {r.acceptedDeviceTypes?.slice(0, 2).map(t => (
                             <Badge key={t} className="device-mini-badge">{t}</Badge>
                           ))}
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {selectedRecycler && (
              <motion.div 
                className="selection-overlay p-4"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
              >
                <div className="selection-pull-bar" onClick={() => setSelectedRecycler(null)} />
                <h5 className="fw-bold text-white mb-1">{selectedRecycler.name}</h5>
                <p className="small text-white-50 mb-3">{selectedRecycler.address}</p>
                
                <div className="d-flex flex-wrap gap-2 mb-4">
                  {selectedRecycler.acceptedDeviceTypes?.map(t => (
                    <Badge key={t} className="device-tag">{t}</Badge>
                  ))}
                </div>

                <div className="d-grid gap-2">
                  <Button 
                    className="btn-premium py-2"
                    onClick={() => navigate(`/ewaste/submit?recycler=${selectedRecycler.userId}`)}
                  >
                    <FaRecycle className="me-2" /> Start Submission
                  </Button>
                  <Button 
                    variant="outline-light" 
                    className="border-white-10 py-2 opacity-75"
                    href={`https://www.google.com/maps/dir/?api=1&destination=${selectedRecycler.latitude},${selectedRecycler.longitude}`}
                    target="_blank"
                  >
                    <FaDirections className="me-2" /> Get Directions
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Col>

        <Col md={8} lg={9} className="h-100 position-relative">
          {userLocation ? (
            <MapContainer 
              center={[userLocation.lat, userLocation.lng]} 
              zoom={13} 
              className="h-100 w-100 leaflet-premium"
              zoomControl={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap'
              />
              <Circle 
                center={[userLocation.lat, userLocation.lng]}
                radius={radiusKm * 1000}
                pathOptions={{ dashArray: '8, 12', color: '#10b981', weight: 1, fillColor: '#10b981', fillOpacity: 0.05 }}
              />
              <Marker 
                position={[userLocation.lat, userLocation.lng]}
                icon={new L.Icon({
                  iconUrl: 'https://cdn-icons-png.flaticon.com/512/1042/1042308.png',
                  iconSize: [38, 38],
                  iconAnchor: [19, 38]
                })}
              >
                <Popup className="glass-popup">You are here</Popup>
              </Marker>
              {filteredRecyclers.map(r => (
                <Marker 
                  key={r.id} 
                  position={[r.latitude, r.longitude]} 
                  icon={getMarkerIcon(r.rating)}
                  eventHandlers={{
                    click: () => handleRecyclerSelect(r),
                  }}
                >
                  <Popup className="glass-popup">
                    <div className="text-center p-1">
                      <strong className="d-block text-white pb-1">{r.name}</strong>
                      <Button 
                        variant="link" 
                        size="sm"
                        className="p-0 text-primary fw-bold text-decoration-none" 
                        onClick={() => handleRecyclerSelect(r)}
                      >
                        View Details
                      </Button>
                    </div>
                  </Popup>
                </Marker>
              ))}
              <FlyToLocation destination={selectedRecycler ? {lat: selectedRecycler.latitude, lng: selectedRecycler.longitude} : null} />
            </MapContainer>
          ) : (
            <div className="h-100 d-flex align-items-center justify-content-center">
              <Spinner animation="grow" variant="success" />
            </div>
          )}
          
          <div className="map-overlay-controls position-absolute top-0 end-0 m-4 shadow-lg rounded-3">
             <div className="glass-card d-flex align-items-center gap-3 px-3 py-2">
                <FaFilter className="text-primary small" />
                <span className="small text-white opacity-75 fw-bold">RADIUS:</span>
                <Form.Select 
                  size="sm" 
                  value={radiusKm} 
                  onChange={(e) => setRadiusKm(Number(e.target.value))}
                  className="bg-transparent border-0 text-white fw-bold p-0 ps-1 shadow-none"
                  style={{ width: '65px', fontSize: '0.85rem' }}
                >
                  <option value={5} className="text-dark">5km</option>
                  <option value={10} className="text-dark">10km</option>
                  <option value={20} className="text-dark">20km</option>
                  <option value={50} className="text-dark">50km</option>
                </Form.Select>
             </div>
          </div>
        </Col>
      </Row>

      <style>{`
        .bg-emerald-deep {
          background-color: #042f2e;
          background-image: 
            radial-gradient(at 0% 0%, rgba(16, 185, 129, 0.1) 0, transparent 50%), 
            radial-gradient(at 50% 0%, rgba(14, 165, 233, 0.1) 0, transparent 50%);
        }
        .explorer-sidebar {
          background: rgba(4, 47, 46, 0.6);
          backdrop-filter: blur(20px);
          border-right: 1px solid rgba(255, 255, 255, 0.1);
          z-index: 1001;
        }
        .border-white-10 { border-color: rgba(255, 255, 255, 0.1) !important; }
        .premium-search-box {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          display: flex;
          align-items: center;
          padding: 2px 12px;
          transition: all 0.3s ease;
        }
        .premium-search-box:focus-within {
          border-color: var(--primary);
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
        }
        .search-icon { color: rgba(255,255,255,0.3); font-size: 0.9rem; }
        .filter-badge {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 8px 14px;
          font-weight: 500;
          letter-spacing: 0.02rem;
          transition: all 0.2s ease;
        }
        .filter-badge.active { background: var(--primary); color: white; border-color: transparent; }
        .hub-card { transition: all 0.3s ease; border: 1px solid transparent; }
        .hub-card:hover { transform: translateY(-3px); background: rgba(255,255,255,0.08); }
        .hub-card.active { border-color: var(--primary); background: rgba(16, 185, 129, 0.05); }
        .badge-status { font-size: 0.65rem; text-transform: uppercase; padding: 4px 8px; border-radius: 6px; }
        .device-mini-badge { background: rgba(14, 165, 233, 0.1); color: #0ea5e9; border: 1px solid rgba(14, 165, 233, 0.2); font-weight: normal; font-size: 0.65rem; }
        .selection-overlay {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          background: #042f2e;
          border-top: 1px solid rgba(255,255,255,0.1);
          border-radius: 30px 30px 0 0;
          box-shadow: 0 -10px 40px rgba(0,0,0,0.5);
          z-index: 1002;
        }
        .selection-pull-bar {
          width: 40px; height: 4px; background: rgba(255,255,255,0.2);
          margin: 0 auto 20px auto; border-radius: 2px; cursor: pointer;
        }
        .device-tag { background: rgba(16, 185, 129, 0.1); color: var(--primary); border: 1px solid rgba(16, 185, 129, 0.2); padding: 8px 12px; }
        .leaflet-premium { filter: hue-rotate(10deg) brightness(0.9) contrast(1.1); }
        .glass-popup .leaflet-popup-content-wrapper { 
          background: rgba(4, 47, 46, 0.9); 
          color: white; 
          backdrop-filter: blur(10px); 
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
        }
        .glass-popup .leaflet-popup-tip { background: rgba(4, 47, 46, 0.9); }
        .scrollbar-hidden::-webkit-scrollbar { display: none; }
        .scrollbar-hidden { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </Container>
  );
}
