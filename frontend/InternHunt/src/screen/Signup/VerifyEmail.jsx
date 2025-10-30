import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function VerifyEmail() {
  const { token } = useParams();
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    fetch(`http://localhost:3000/verify/${token}`)
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(() => setMessage("Verification failed. Please try again."));
  }, [token]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>{message}</h2>
      {message.toLowerCase().includes("success") && (
        <Link to="/login" style={{ color: "blue", marginTop: "20px", display: "inline-block" }}>
          Go to Login
        </Link>
      )}
    </div>
  );
}

export default VerifyEmail;