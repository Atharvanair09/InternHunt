import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./OtpVerify.css";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function OtpVerify() {
  const query = useQuery();
  const navigate = useNavigate();
  const emailFromQuery = query.get("email") || "";

  const [email, setEmail] = useState(emailFromQuery);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const inputsRef = useRef([]);
  const otpRef = useRef("      "); // 6 spaces placeholder

  useEffect(() => {
    if (!emailFromQuery) {
      setMessage("Enter your email to receive an OTP");
    } else {
      setMessage(`We sent a 6-digit code to ${emailFromQuery}`);
    }
  }, [emailFromQuery]);

  const handleInput = (value, index) => {
    const normalized = value.replace(/[^0-9]/g, "").slice(0, 1);
    const current = otpRef.current.split("");
    current[index] = normalized || " ";
    otpRef.current = current.join("");
    if (normalized && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
    setError("");
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleResend = async () => {
    if (!email) {
      setError("Please enter your email to resend the code.");
      return;
    }
    try {
      setSubmitting(true);
      const res = await axios.post("http://localhost:3000/resend-otp", {
        email,
      });
      setMessage(res.data.message || "OTP resent successfully!");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otpValue = otpRef.current.replace(/\s/g, "");
    if (!email) {
      setError("Email is required.");
      return;
    }
    if (otpValue.length !== 6) {
      setError("Please enter the 6-digit code.");
      return;
    }
    try {
      setSubmitting(true);
      const res = await axios.post("http://localhost:3000/verify-otp", {
        email,
        otp: otpValue,
      });
      setMessage(res.data.message || "Email verified successfully!");
      setError("");
      setTimeout(() => navigate("/login"), 900);
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="otp-page">
      <div className="otp-card slide-in">
        <div className="otp-illustration" />
        <div className="otp-content">
          <h1 className="otp-title">Verify your email</h1>
          <p className="otp-subtitle">{message}</p>

          <form onSubmit={handleVerify} className="otp-form">
            {!emailFromQuery && (
              <div className="otp-email-row">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
            )}

            <div className="otp-inputs" aria-label="Enter 6 digit code">
              {Array.from({ length: 6 }).map((_, i) => (
                <input
                  key={i}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  className="otp-box"
                  onChange={(e) => handleInput(e.target.value, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  ref={(el) => (inputsRef.current[i] = el)}
                />
              ))}
            </div>

            {error && <div className="otp-error">{error}</div>}

            <button disabled={submitting} className="otp-verify-btn" type="submit">
              {submitting ? "Verifying..." : "Verify"}
            </button>

            <button
              type="button"
              disabled={submitting}
              className="otp-resend-btn"
              onClick={handleResend}
            >
              Resend code
            </button>

            <div className="otp-footer">
              <span>Entered the wrong email? || </span>
              <Link to="/signup"> . <label>Go back to sign up</label></Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


