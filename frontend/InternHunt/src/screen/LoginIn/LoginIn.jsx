import React, { useState, useEffect } from "react";
import axios from "axios";
import { LoadingScreen } from "../../components/LoadingScreen/LoadingScreen";
import { Link, useNavigate } from "react-router-dom";
import "./LoginIn.css";

export const LoginIn = () => {
  const isAuthenticated = async () => {
    try {
      const response = await fetch("http://localhost:3000/current-user", {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        console.log("User is authenticated:", data);
        return true;
      } else {
        console.log("User is not authenticated");
        return false;
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
      return false;
    }
  };

  useEffect(() => {
    // isAuthenticated().then((auth) => {
    //   if (auth) {
    //     if (userType === "User") {
    //       navigate("/intro", { replace: true });
    //     }
    //     else if(userType === "Company"){
    //       navigate("/company-intro", { replace: true });
    //     }
    //   }
    // });

    // Check authentication and not allow to move back if already logged in
  });

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState("user");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:3000/login",
        { ...formData, userType },
        {
          withCredentials: true,
        }
      );

      // alert("✅ Login successful");
      console.log("User data:", res.data);

      // Redirect after success
      // navigate("/intro");
      if (userType === "User") {
        // window.location.href = "/intro";
        navigate("/intro", { replace: true });
      } else if (userType === "Company") {
        // window.location.href = "/company-intro";
        navigate("/company-intro", { replace: true });
        console.log("Company Login");
      }
    } catch (err) {
      if (err.response) {
        alert(err.response.data.error || "❌ Login failed");
      } else {
        alert("⚠️ Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    window.open("http://localhost:3000/auth/google", "_self");
    // Google SignIn logic
  };

  return (
    <div className="login-container">
      {loading && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(255,255,255,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <LoadingScreen />
        </div>
      )}

      <div className="login-form-wrapper">
        <h1 className="login-welcome-text">Sign In To Get Started</h1>
        <p className="login-sub">Log In as: </p>
        <div class="radio-inputs1">
          <label class="radio1">
            <input
              type="radio"
              name="radio"
              value="User"
              checked={userType === "User"}
              onChange={(e) => setUserType(e.target.value)}
            />
            <span class="name">User</span>
          </label>
          <label class="radio1">
            <input
              type="radio"
              name="radio"
              value="Company"
              checked={userType === "Company"}
              onChange={(e) => setUserType(e.target.value)}
            />
            <span class="name">Company</span>
          </label>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="login-input-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
            />
          </div>

          <div className="login-input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
            />
          </div>

          <div className="login-input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Password"
            />
          </div>

          <button type="submit" className="login-sign-in-button">
            Sign In
          </button>
        </form>

        <div className="login-divider">OR</div>

        <button
          className="login-google-sign-in-button"
          onClick={handleGoogleSignIn}
        >
          <img
            src="/images/search.png"
            alt="Google"
            className="login-google-icon"
          />
          Sign in with Google
        </button>

        <p className="login-subtitle">
          Don't have an Account?{" "}
          <Link to="/signup" className="login-signup-link">
            Sign Up
          </Link>
        </p>
      </div>

      <div className="login-image-wrapper">
        <img
          src="/images/about.jpg"
          alt="Office"
          className="login-office-image"
        />
      </div>
    </div>
  );
};
