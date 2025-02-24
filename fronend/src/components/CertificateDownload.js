import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Button, Spinner, Alert } from "react-bootstrap";

const CertificateDownload = ({ userId }) => {
  const [recycledCount, setRecycledCount] = useState(0);
  const [eligible, setEligible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecycledData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/ewaste/user/${userId}`);
        const totalRecycled = response.data
          .filter(item => item.status === "RECYCLED")
          .reduce((sum, item) => sum + item.quantity, 0);

        setRecycledCount(totalRecycled);
        setEligible(totalRecycled >= 100);
      } catch (err) {
        setError("Failed to fetch recycled count.");
        console.error("Error fetching recycled count:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecycledData();
  }, [userId]);

  const downloadCertificate = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/certificate/download/${userId}`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "Recycling-Certificate.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(link.href); // Clean up
    } catch (err) {
      console.error("Error downloading certificate:", err);
      setError("Failed to download certificate.");
    }
  };

  return (
    <Container className="text-center mt-4">
      <h3>Your Total Recycled Waste: {loading ? <Spinner animation="border" size="sm" /> : recycledCount} Units</h3>

      {error && <Alert variant="danger">{error}</Alert>}

      {eligible ? (
        <Button variant="success" onClick={downloadCertificate}>
          Download Certificate
        </Button>
      ) : (
        <Alert variant="warning">Recycle at least 1 units to earn a certificate!</Alert>
      )}
    </Container>
  );
};

export default CertificateDownload;
