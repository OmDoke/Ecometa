import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Button, Spinner, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaSignOutAlt, FaPlusCircle, FaQuoteLeft, FaQuoteRight, FaRecycle } from "react-icons/fa";
import CertificateDownload from "./CertificateDownload";

const Dashboard = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    if (!userId) {
      setError("User not logged in. Please log in to access the dashboard.");
      setLoading(false);
      return;
    }

    const fetchSubmissions = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/ewaste/user/${userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setSubmissions(response.data);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch submissions.");
        console.error("Error fetching submissions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [userId]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #004d40, #1b5e20, #a5d6a7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <Container>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="p-5 rounded-4 shadow-lg"
          style={{
            background: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(12px)",
            borderRadius: "20px",
            color: "white",
            textAlign: "center",
          }}
        >
          {/* Header */}
          <motion.h1
            className="text-center mb-4"
            style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#c8e6c9" }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <FaRecycle className="me-2 text-light" /> E-Waste Dashboard
          </motion.h1>

          {/* Quote Section */}
          <motion.blockquote
            className="text-center fw-bold"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              fontStyle: "italic",
              color: "#fff",
              fontSize: "1.2rem",
              background: "rgba(0, 0, 0, 0.3)",
              padding: "10px",
              borderRadius: "10px",
              display: "inline-block",
            }}
          >
            <FaQuoteLeft className="me-2 text-warning" />
            Recycling turns things into other things... which is like magic! 🌍♻️
            <FaQuoteRight className="ms-2 text-warning" />
          </motion.blockquote>

          {/* Logout Button */}
          <div className="text-end mb-4">
            <motion.button
              className="btn btn-danger px-4 py-2"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLogout}
            >
              Logout <FaSignOutAlt />
            </motion.button>
          </div>

          {/* Certificate Download */}
          <CertificateDownload userId={userId} />

          {/* Submit Button */}
          <div className="text-center mb-4">
            <Link to="/ewaste/submit">
              <motion.button
                className="btn btn-success px-4 py-2"
                whileHover={{ scale: 1.1, rotate: -3 }}
                whileTap={{ scale: 0.9 }}
              >
                Submit E-Waste <FaPlusCircle />
              </motion.button>
            </Link>
          </div>

          {/* Data Fetching Status */}
          {loading ? (
            <Spinner animation="border" variant="light" />
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : submissions.length > 0 ? (
            <Row>
              {submissions.map((submission, index) => (
                <Col md={4} key={submission.id} className="mb-4">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card
                      className="shadow-sm"
                      style={{
                        background: "rgba(255, 255, 255, 0.15)",
                        borderRadius: "15px",
                        color: "white",
                        overflow: "hidden",
                        backdropFilter: "blur(12px)",
                      }}
                    >
                      <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }}>
                        <Card.Img
                          variant="top"
                          src={submission.imageUrl || "https://via.placeholder.com/300"}
                          alt="E-Waste"
                          style={{
                            height: "200px",
                            objectFit: "cover",
                            transition: "transform 0.3s",
                          }}
                        />
                      </motion.div>
                      <Card.Body>
                        <Card.Title className="fw-bold">{submission.type}</Card.Title>
                        <Card.Text>
                          <strong>Condition:</strong> {submission.condition} <br />
                          <strong>Quantity:</strong> {submission.quantity} <br />
                          <strong>Status:</strong> {submission.status}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          ) : (
            <Alert variant="info" className="text-center text-light bg-dark">
              No e-waste submissions found. Start recycling today! ♻️
            </Alert>
          )}
        </motion.div>
      </Container>
    </motion.div>
  );
};

export default Dashboard;
