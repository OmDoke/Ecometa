import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Container, Alert, Spinner, Tabs, Tab, Badge, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaRecycle, FaCheckCircle, FaTimesCircle, FaTruck, FaMapMarkerAlt, FaInfoCircle, FaComments, FaCalendarAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import ChatDrawer from "./ChatDrawer";

function RecyclerDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [pickups, setPickups] = useState([]);
  const [processing, setProcessing] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");
  const [showChat, setShowChat] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  
  const navigate = useNavigate();
  const recyclerId = localStorage.getItem("userId");
  const userName = localStorage.getItem("name");
  const userEmail = localStorage.getItem("email");
  const userRole = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const openChat = (item) => {
    setSelectedItem(item);
    setShowChat(true);
  };

  useEffect(() => {
    if (localStorage.getItem("role") !== "RECYCLER") {
      navigate("/");
    }
  }, [navigate]);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";
    try {
      const [pendingRes, acceptedRes, collectedRes] = await Promise.all([
        axios.get(`${API_URL}/ewaste/recycler?status=SUBMITTED`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/ewaste/recycler?recyclerId=${recyclerId}&status=ACCEPTED`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/ewaste/recycler?recyclerId=${recyclerId}&status=COLLECTED`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      ]);
      setSubmissions(pendingRes.data);
      setPickups(acceptedRes.data);
      setProcessing(collectedRes.data);
    } catch (error) {
      setError("Failed to fetch dashboard data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (recyclerId && token) {
      fetchData();
    }
  }, [recyclerId, token]);

  const handleAccept = async (submissionId) => {
    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";
    try {
      await axios.put(`${API_URL}/ewaste/accept/${submissionId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData(); 
    } catch (error) {
      setError(error.response?.data?.message || "Failed to accept submission.");
    }
  };

  const handleCollect = async (submissionId) => {
    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";
    if (!window.confirm("Confirm visual verification and physical collection of this item? This will issue an official certificate to the user.")) return;

    try {
      await axios.put(`${API_URL}/ewaste/collect/${submissionId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to mark as collected.");
    }
  };

  const handleUpdateSchedule = async (submissionId, dateString) => {
    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";
    try {
      await axios.put(`${API_URL}/ewaste/schedule/${submissionId}`, { scheduledTime: dateString }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (error) {
      setError("Failed to update schedule.");
    }
  };

  const handleRecycle = async (submissionId) => {
    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";
    if (!window.confirm("Confirm item processing and awarding of EcoPoints to the user?")) return;

    try {
      await axios.put(`${API_URL}/ewaste/recycle/${submissionId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to finalize recycling.");
    }
  };

  const handleReject = async (submissionId) => {
    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";
    try {
      await axios.put(`${API_URL}/ewaste/reject/${submissionId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData();
    } catch (error) {
      setError("Failed to reject submission.");
    }
  };

  return (
    <div className="dashboard-wrapper py-5">
      <Container>
        <motion.div 
          className="glass-card p-4 p-md-5 mb-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
            <h2 className="mb-0 fw-bold text-white d-flex align-items-center gap-2">
              <FaRecycle /> Partner Command Center
            </h2>
          </div>

          {error && <Alert variant="danger" className="glass-card border-danger text-white mb-4">{error}</Alert>}

          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="custom-tabs mb-4"
          >
            <Tab eventKey="pending" title={`Pending Tasks (${submissions.length})`}>
              <div className="mt-4">
                <p className="text-white small mb-4 italic">
                  <FaInfoCircle className="me-1" /> New items waiting for collection. Accept to claim and see full details.
                </p>
                {loading ? <div className="text-center py-4"><Spinner animation="border" variant="primary" /></div> : (
                  <Table responsive className="custom-table-premium">
                    <thead>
                      <tr>
                        <th>Item Type</th>
                        <th>Condition</th>
                        <th>Qty</th>
                        <th>Location</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {submissions.length > 0 ? (
                        submissions.map((sub) => (
                          <tr key={sub.id}>
                            <td><span className="fw-bold text-dark">{sub.type}</span></td>
                            <td><Badge bg="dark" className="text-white border border-white border-opacity-25">{sub.condition}</Badge></td>
                            <td><span className="text-dark fw-bold">{sub.quantity}</span></td>
                            <td><span className="text-dark opacity-75">{sub.pickupAddress?.substring(0, 20)}...</span></td>
                            <td>
                              <div className="d-flex gap-2">
                                <Button variant="success" size="sm" className="btn-premium px-3 text-white" onClick={() => handleAccept(sub.id)}>
                                  <FaCheckCircle /> Accept
                                </Button>
                                <Button variant="outline-danger" size="sm" className="text-white" onClick={() => handleReject(sub.id)}>
                                  <FaTimesCircle />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan="5" className="text-center py-4 text-white opacity-75">Zero pending tasks.</td></tr>
                      )}
                    </tbody>
                  </Table>
                )}
              </div>
            </Tab>
            <Tab eventKey="pickups" title={`My Pickups (${pickups.length})`}>
              <div className="mt-4">
                <p className="text-white small mb-4 italic">
                  <FaTruck className="me-1" /> Items you've accepted. Coordinate with user and mark "Collected" once verified.
                </p>
                {loading ? <div className="text-center py-4"><Spinner animation="border" variant="primary" /></div> : (
                  <Table responsive className="custom-table-premium">
                    <thead>
                      <tr>
                        <th>Item Details</th>
                        <th>Connection & Coordination</th>
                        <th>Logistics</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pickups.length > 0 ? (
                        pickups.map((sub) => (
                          <tr key={sub.id}>
                            <td>
                              <div className="fw-bold text-dark">{sub.type} ({sub.quantity})</div>
                              <div className="small text-dark fw-medium">{sub.condition}</div>
                            </td>
                            <td>
                              <div className="mb-2">
                                <div className="fw-bold text-white">{sub.user?.name}</div>
                                <div className="small text-info">{sub.user?.email}</div>
                              </div>
                              <Button 
                                variant="info" 
                                size="sm" 
                                className="d-flex align-items-center gap-2 btn-chat-pulse"
                                onClick={() => openChat(sub)}
                              >
                                <FaComments /> Chat with User
                              </Button>
                            </td>
                            <td>
                              <div className="small mb-2 text-dark fw-bold"><FaMapMarkerAlt className="text-danger me-1" />{sub.pickupAddress}</div>
                              <Form.Group className="d-flex align-items-center gap-2">
                                <FaCalendarAlt className="text-primary" />
                                <Form.Control 
                                  type="datetime-local" 
                                  size="sm"
                                  className="bg-dark text-white border-secondary"
                                  value={sub.scheduledPickupTime ? new Date(sub.scheduledPickupTime).toISOString().slice(0, 16) : ""}
                                  onChange={(e) => handleUpdateSchedule(sub.id, e.target.value)}
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Button 
                                variant="primary" 
                                size="sm" 
                                className="btn-premium px-3 w-100 mb-2" 
                                onClick={() => handleCollect(sub.id)}
                                disabled={!sub.scheduledPickupTime}
                              >
                                <FaCheckCircle className="me-1" /> Collect
                              </Button>
                              <div className="text-center small opacity-50">
                                {!sub.scheduledPickupTime ? "Schedule first" : "Ready for collection"}
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan="4" className="text-center py-4 text-white opacity-75">No active pickups.</td></tr>
                      )}
                    </tbody>
                  </Table>
                )}
              </div>
            </Tab>
            <Tab eventKey="processing" title={`In-Facility (${processing.length})`}>
              <div className="mt-4">
                <p className="text-white small mb-4 italic">
                  <FaRecycle className="me-1 text-success" /> Processing collected items. Finalize recycling to award EcoPoints.
                </p>
                {loading ? <div className="text-center py-4"><Spinner animation="border" variant="primary" /></div> : (
                  <Table responsive className="custom-table-premium">
                    <thead>
                      <tr>
                        <th>Item Details</th>
                        <th>Donor</th>
                        <th>Collected On</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {processing.length > 0 ? (
                        processing.map((sub) => (
                          <tr key={sub.id}>
                            <td>
                              <div className="fw-bold text-dark">{sub.type} ({sub.quantity})</div>
                              <div className="small text-dark fw-medium">{sub.condition}</div>
                            </td>
                            <td>
                              <div className="fw-bold text-white">{sub.user?.name}</div>
                              <div className="small text-info">{sub.user?.email}</div>
                            </td>
                            <td className="text-dark fw-bold">
                              {sub.collectedAt ? new Date(sub.collectedAt).toLocaleDateString() : "Recently"}
                            </td>
                            <td>
                              <Button 
                                variant="success" 
                                size="sm" 
                                className="btn-premium px-3 w-100" 
                                onClick={() => handleRecycle(sub.id)}
                              >
                                <FaCheckCircle className="me-1" /> Finalize Recycle
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan="4" className="text-center py-4 text-white opacity-75">No items in processing.</td></tr>
                      )}
                    </tbody>
                  </Table>
                )}
              </div>
            </Tab>
          </Tabs>
        </motion.div>

        <ChatDrawer 
          show={showChat} 
          onHide={() => setShowChat(false)} 
          ewasteItem={selectedItem} 
          currentUser={{ id: recyclerId, name: userName, email: userEmail, role: userRole }}
        />
      </Container>
      
      <style>{`
        .dashboard-wrapper {
          background: radial-gradient(circle at top right, rgba(16, 185, 129, 0.05), transparent),
                      radial-gradient(circle at bottom left, rgba(14, 165, 233, 0.05), transparent);
          min-height: 90vh;
        }
        .custom-tabs .nav-link {
          color: white;
          opacity: 0.6;
          border: none;
          border-bottom: 2px solid transparent;
          padding: 10px 20px;
        }
        .custom-tabs .nav-link.active {
          background: transparent !important;
          color: var(--primary) !important;
          opacity: 1;
          border-bottom: 2px solid var(--primary);
        }
        .custom-table-premium {
          color: var(--text-main) !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
        }
        .custom-table-premium thead th {
          background: rgba(255, 255, 255, 0.05);
          border-bottom: 2px solid var(--primary);
          color: var(--primary);
          text-transform: uppercase;
          font-size: 0.75rem;
          padding: 1rem;
        }
        .custom-table-premium tbody td {
          padding: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          vertical-align: middle;
        }
        .btn-chat-pulse {
          box-shadow: 0 0 0 0 rgba(13, 202, 240, 0.7);
          animation: pulse-blue 2s infinite;
        }
        @keyframes pulse-blue {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(13, 202, 240, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(13, 202, 240, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(13, 202, 240, 0); }
        }
      `}</style>
    </div>
  );
}

export default RecyclerDashboard;
