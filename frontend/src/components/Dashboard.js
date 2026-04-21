import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Button, Spinner, Alert, Badge } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaSignOutAlt, FaPlusCircle, FaQuoteLeft, FaQuoteRight, FaRecycle, FaMapMarkerAlt, FaComments, FaCalendarAlt } from "react-icons/fa";
import dayjs from "dayjs";
import CertificateDownload from "./CertificateDownload";
import ChatDrawer from "./ChatDrawer";

const Dashboard = () => {
  const [submissions, setSubmissions] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("name");
  const userEmail = localStorage.getItem("email");
  const userRole = localStorage.getItem("role");

  const openChat = (item) => {
    setSelectedItem(item);
    setShowChat(true);
  };

  useEffect(() => {
    if (!userId) {
      setError("User not logged in. Please log in to access the dashboard.");
      setLoading(false);
      return;
    }

    const fetchSubmissions = async () => {
      try {
        const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";
        const response = await axios.get(`${API_URL}/ewaste/user/${userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setSubmissions(response.data);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch submissions.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();

    const fetchUserData = async () => {
      try {
        const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";
        const response = await axios.get(`${API_URL}/users/${userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setUserData(response.data);
      } catch (error) {
        console.error("Failed to fetch user data");
      }
    };
    fetchUserData();
  }, [userId]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="dashboard-wrapper py-5"
    >
      <Container>
        <div className="glass-card p-4 p-md-5 mb-5 text-center">
          <motion.h1
            className="mb-2 text-gradient"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <FaRecycle className="me-2" /> E-Waste Dashboard
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-4 d-inline-block"
          >
            <Badge bg="success" className="p-2 px-3 rounded-pill shadow-sm d-flex align-items-center gap-2" style={{ fontSize: '1.1rem' }}>
              <div className="bg-white text-success rounded-circle p-1 d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px' }}>
                ⭐
              </div>
              EcoPoints: {userData?.ecoPoints || 0}
            </Badge>
          </motion.div>

          <motion.blockquote
            className="mb-4 d-inline-block p-3 rounded"
            style={{ background: 'rgba(255,255,255,0.05)', fontStyle: 'italic' }}
          >
            <FaQuoteLeft className="me-2 text-primary" />
            Recycling turns things into other things... which is like magic! 🌍♻️
            <FaQuoteRight className="ms-2 text-primary" />
          </motion.blockquote>

          <div className="d-flex justify-content-center gap-3 flex-wrap mb-4">
            <Button 
              className="btn-premium d-flex align-items-center gap-2" 
              onClick={() => navigate("/ewaste/submit")}
            >
              <FaPlusCircle /> Submit E-Waste
            </Button>
            <Button 
              variant="outline-info" 
              className="d-flex align-items-center gap-2"
              onClick={() => navigate("/map")}
            >
              <FaMapMarkerAlt /> Find Recyclers
            </Button>
          </div>

          <CertificateDownload userId={userId} />
        </div>

        <h3 className="mb-4 fw-bold text-white">Recent Submissions</h3>
        
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : error ? (
          <Alert variant="danger" className="glass-card border-danger">{error}</Alert>
        ) : submissions.length > 0 ? (
          <Row g={4}>
            {submissions.map((submission, index) => (
              <Col md={6} lg={4} key={submission.id} className="mb-4">
                <motion.div
                  whileHover={{ y: -5 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="glass-card h-100 border-0 overflow-hidden">
                    <Card.Img
                      variant="top"
                      src={submission.imageUrl || "https://images.unsplash.com/photo-1532187875605-1ef64ef4fdb5?auto=format&fit=crop&q=80&w=400"}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <Card.Title className="fw-bold mb-0 text-truncate text-white" style={{maxWidth: '150px'}}>{submission.type}</Card.Title>
                        <Badge bg={
                          submission.status === 'SUBMITTED' ? 'warning' :
                          submission.status === 'ACCEPTED' ? 'info' :
                          submission.status === 'COLLECTED' ? 'primary' :
                          submission.status === 'RECYCLED' ? 'success' : 'secondary'
                        }>
                          {submission.status}
                        </Badge>
                      </div>
                      <Card.Text className="text-white small opacity-100">
                        <strong>Condition:</strong> {submission.condition} <br />
                        <strong>Qty:</strong> {submission.quantity} <br />
                        <strong>Date:</strong> {submission.createdAt ? new Date(submission.createdAt).toLocaleDateString() : 'N/A'}
                      </Card.Text>

                      {submission.scheduledPickupTime && (
                        <div className="p-2 mb-2 rounded border border-white border-opacity-25" style={{background: 'rgba(255, 255, 255, 0.1)'}}>
                          <div className="small fw-bold text-white mb-1">
                            <FaCalendarAlt className="me-1" /> Scheduled Pickup:
                          </div>
                          <div className="small text-white opacity-100">
                            {dayjs(submission.scheduledPickupTime).format('MMM D, YYYY [at] h:mm A')}
                          </div>
                        </div>
                      )}
                      
                      {submission.status === 'ACCEPTED' && (
                        <Button 
                          variant="info" 
                          size="sm" 
                          className="w-100 d-flex align-items-center justify-content-center gap-2 btn-chat-pulse"
                          onClick={() => openChat(submission)}
                        >
                          <FaComments /> Chat with Recycler
                        </Button>
                      )}
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        ) : (
          <div className="glass-card p-5 text-center text-white">
            <p className="fs-5 text-white">No submissions found yet.</p>
            <Button variant="link" className="text-info p-0" onClick={() => navigate("/ewaste/submit")}>
              Start your first recycling request today! ♻️
            </Button>
          </div>
        )}

        <ChatDrawer 
          show={showChat} 
          onHide={() => setShowChat(false)} 
          ewasteItem={selectedItem} 
          currentUser={{ id: userId, name: userName, email: userEmail, role: userRole }}
        />
      </Container>

      <style>{`
        .dashboard-wrapper {
          background: radial-gradient(circle at top right, rgba(16, 185, 129, 0.05), transparent),
                      radial-gradient(circle at bottom left, rgba(14, 165, 233, 0.05), transparent);
          min-height: 90vh;
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
    </motion.div>
  );
};

export default Dashboard;
