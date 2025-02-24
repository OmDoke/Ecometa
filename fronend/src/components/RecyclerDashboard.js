import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Container, Alert, Spinner, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaRecycle, FaSignOutAlt, FaCheckCircle, FaTimesCircle, FaUser } from "react-icons/fa";
import "../resources/css/RecyclerDashboard.css";

function RecyclerDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const recyclerId = localStorage.getItem("userId");

  // Redirect if user is not a recycler
  useEffect(() => {
    if (localStorage.getItem("role") !== "RECYCLER") {
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const goToProfile = () => {
    navigate("/recycler/profile");
  };

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/ewaste/recycler/${recyclerId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setSubmissions(response.data);
      } catch (error) {
        setError("Failed to fetch submissions. Please try again later.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (recyclerId) {
      fetchSubmissions();
    }
  }, [recyclerId]);

  const handleAccept = async (submissionId, userId) => {
    try {
      await axios.put(
        `http://localhost:8080/ewaste/accept/${submissionId}`,
        { recyclerId, userId },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setSubmissions(submissions.filter((sub) => sub.id !== submissionId));
    } catch (error) {
      setError("Failed to accept submission.");
      console.error(error);
    }
  };

  const handleReject = async (submissionId) => {
    try {
      await axios.delete(`http://localhost:8080/ewaste/reject/${submissionId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setSubmissions(submissions.filter((sub) => sub.id !== submissionId));
    } catch (error) {
      setError("Failed to reject submission.");
      console.error(error);
    }
  };

  return (
    <Container className="recycler-dashboard">
      <Card className="dashboard-card">
        <Card.Body>
          <h2 className="text-center mb-4">
            <FaRecycle className="recycle-icon" /> Recycler Dashboard
          </h2>
          <div className="text-end mb-4">
            <Button variant="info" className="profile-btn me-3" onClick={goToProfile}>
              Profile <FaUser />
            </Button>
            <Button variant="danger" className="logout-btn" onClick={handleLogout}>
              Logout <FaSignOutAlt />
            </Button>
          </div>
          {error && <Alert variant="danger">{error}</Alert>}
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" variant="light" />
              <p>Loading submissions...</p>
            </div>
          ) : (
            <Table responsive bordered hover className="custom-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Type</th>
                  <th>Condition</th>
                  <th>Quantity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.length > 0 ? (
                  submissions.map((submission, index) => (
                    <tr key={submission.id} className="table-row">
                      <td>{index + 1}</td>
                      <td>{submission.type}</td>
                      <td>{submission.condition}</td>
                      <td>{submission.quantity}</td>
                      <td>
                        <Button
                          variant="success"
                          size="sm"
                          className="accept-btn"
                          onClick={() => handleAccept(submission.id, submission.user.id)}
                        >
                          Accept <FaCheckCircle />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          className="reject-btn ms-2"
                          onClick={() => handleReject(submission.id)}
                        >
                          Reject <FaTimesCircle />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No pending submissions.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default RecyclerDashboard;
