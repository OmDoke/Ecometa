import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Container, Spinner, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

function RecyclerDetails() {
  const [recycler, setRecycler] = useState(null);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect non-recyclers
    if (localStorage.getItem("role") !== "RECYCLER") {
      navigate("/");
    }

    const fetchRecyclerDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/recyclers/${userId}`, {

          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setRecycler(response.data);
      } catch (error) {
        console.error("Error fetching recycler details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecyclerDetails();
  }, [userId, navigate]);

  return (
    <Container>
      <Button variant="secondary" className="mb-3" onClick={() => navigate("/recycler-home")}>
        <FaArrowLeft /> Back to Dashboard
      </Button>
      <Card>
        <Card.Body>
          <h2>Recycler Profile</h2>
          {loading ? (
            <Spinner animation="border" />
          ) : recycler ? (
            <div>
              <p><strong>Shop Name:</strong> {recycler.shopName}</p>
              <p><strong>GST ID:</strong> {recycler.gstId}</p>
              <p><strong>Region:</strong> {recycler.region}</p>
              <p><strong>Collection Regions:</strong> {recycler.collectionRegions}</p>
            </div>
          ) : (
            <p>No recycler details found.</p>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default RecyclerDetails;
