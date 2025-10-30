import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { LoadingScreen } from "../../components/LoadingScreen/LoadingScreen";
import "./Signup.css";

function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState("User");
  const [showOTPForm, setShowOTPForm] = useState(false);
  // const [otp, setOTP] = useState("");
  const [showOTPVerify, setShowOTPVerify] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const openPopupOTP = () => {
    otpInputRef.current = ""; // Clear OTP input when opening popup
    setShowOTPVerify(true);
  };
  // const closePopupOTP = () => setShowOTPVerify(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: "",
    color: "#ddd",
    width: "0%",
  });
  const navigate = useNavigate();
  const otpInputRef = useRef("");

  // Generate random username
  const generateRandomUsername = () => {
    const adjectives = ["Swift", "Bright", "Calm", "Clever", "Lucky", "Brave"];
    const nouns = ["tiger", "eagle", "falcon", "panda", "lion", "dragon"];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const num = Math.floor(100 + Math.random() * 900);
    return `${adj}${noun}${num}`;
  };

  const handleGenerateUsername = (e) => {
    e.preventDefault();
    setFormData((prev) => ({
      ...prev,
      username: generateRandomUsername(),
    }));
  };

  const computePasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: "", color: "#ddd", width: "0%" };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[a-z]/.test(pwd)) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    const labels = [
      "Very Weak",
      "Weak",
      "Fair",
      "Good",
      "Strong",
      "Very Strong",
    ];
    const colors = [
      "#e0e0e0",
      "#ff4d4f",
      "#faad14",
      "#52c41a",
      "#389e0d",
      "#237804",
    ];
    const widths = ["0%", "20%", "40%", "60%", "80%", "100%"];
    const idx = Math.min(score, 5);
    return {
      score,
      label: labels[idx],
      color: colors[idx],
      width: widths[idx],
    };
  };

  // Validation functions
  const validateUsername = (username) => {
    if (!username.trim()) {
      return "Username is required";
    }
    if (username.length < 3) {
      return "Username must be at least 3 characters long";
    }
    if (username.length > 20) {
      return "Username must be less than 20 characters";
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return "Username can only contain letters, numbers, and underscores";
    }
    return null;
  };

  const validateEmail = (email) => {
    if (!email.trim()) {
      return "Email is required";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return null;
  };

  const validatePassword = (password) => {
    if (!password) {
      return "Password is required";
    }
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number";
    }
    return null;
  };

  const validateConfirmPassword = (password, confirmPassword) => {
    if (!confirmPassword) {
      return "Please confirm your password";
    }
    // if (password !== confirmPassword) {
    //   return "Passwords do not match";
    // }
    return null;
  };

  const validateForm = () => {
    const errors = {};
    
    const usernameError = validateUsername(formData.username);
    if (usernameError) errors.username = usernameError;
    
    const emailError = validateEmail(formData.email);
    if (emailError) errors.email = emailError;
    
    const passwordError = validatePassword(formData.password);
    if (passwordError) errors.password = passwordError;
    
    const confirmPasswordError = validateConfirmPassword(formData.password, formData.confirmPassword);
    if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;
    
    setValidationErrors(errors);
    const isValid = Object.keys(errors).length === 0;
    setIsFormValid(isValid);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    if (name === "password") {
      setPasswordStrength(computePasswordStrength(value));
    }
    
    // Clear validation error for this field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    // Re-validate form after a short delay
    setTimeout(() => {
      validateForm();
    }, 100);
  };

  // Step 1: Signup
  const handleSignup = async (event) => {
    event.preventDefault();
    
    // Validate form before proceeding
    if (!validateForm()) {
      alert("Please fix all validation errors before submitting");
      return;
    }

    const { username, email, password, confirmPassword } = formData;

    try {
      setLoading(true);
      
      const res = await axios.post("http://localhost:3000/signup", {
        username,
        email,
        password,
        userType,
      });
      
      console.log(res.data.message || "OTP sent to your email.");
      
      // Navigate to dedicated OTP verification page after signup
      setTimeout(() => {
        setLoading(false);
        navigate(`/verify-otp?email=${encodeURIComponent(email)}`);
      }, 800);
      
    } catch (err) {
      setLoading(false);
      alert(err.response?.data?.error || "Signup failed");
    }
  };

  // Step 2: Join OTP verification
  const handleOTPJoin = (value, index) => {
    if (value.length === 1) {
      otpInputRef.current =
        otpInputRef.current.substring(0, index) +
        value +
        otpInputRef.current.substring(index + 1);
    } else {
      otpInputRef.current =
        otpInputRef.current.substring(0, index) +
        otpInputRef.current.substring(index + 1);
    }
    console.log(otpInputRef.current);
  };

  // Step 3: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const otpValue = otpInputRef.current.trim();
    console.log("OTP Value:", otpValue);
    
    if (!otpValue) {
      console.log("No OTP value");
      return alert("Please enter the OTP");
    }

    try {
      setLoading(true);
      console.log("Hello");
      const res = await axios.post("http://localhost:3000/verify-otp", {
        email: formData.email,
        otp: otpValue,
      });
      alert(res.data.message || "Email verified successfully!");
      // if (userType === "Company") {
      //   navigate("/company-intro");
      // } else {
      //   navigate("/intro");
      // }
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  // Step 4: Resend OTP
  const handleResendOTP = async () => {
    try {
      const res = await axios.post("http://localhost:3000/resend-otp", {
        email: formData.email,
      });
      alert(res.data.message || "OTP resent successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to resend OTP");
    }
  };

  // Google sign-in
  const handleGoogleSignIn = () => {
    window.open(`http://localhost:3000/pre-google?userType=${userType}`, "_self");  
  };

  // function PopUpOTP({ showOTPVerify }) {
  //   if (!showOTPVerify) return null;
  //   return (
  //     <>
  //       <div className="otp-popup-container">
  //         <div className="otp-popup-overlay">
  //           <div className="otp-popup-content">
  //             <h1>Enter OTP</h1>
  //             <p>
  //               OTP has been sent to your email. Please verify to complete
  //               signup.
  //             </p>
  //             <form onSubmit={handleVerifyOTP}>
  //               <div className="otp-field">
  //                 <input
  //                   type="text"
  //                   maxLength={1}
  //                   onChange={(e) => {
  //                     handleOTPJoin(e.currentTarget.value, 0);
  //                   }}
  //                 />
  //                 <input
  //                   type="text"
  //                   maxLength={1}
  //                   onChange={(e) => {
  //                     handleOTPJoin(e.currentTarget.value, 1);
  //                   }}
  //                 />
  //                 <input
  //                   className="space"
  //                   type="text"
  //                   maxLength={1}
  //                   onChange={(e) => {
  //                     handleOTPJoin(e.currentTarget.value, 2);
  //                   }}
  //                 />
  //                 <input
  //                   type="text"
  //                   maxLength={1}
  //                   onChange={(e) => {
  //                     handleOTPJoin(e.currentTarget.value, 3);
  //                   }}
  //                 />
  //                 <input
  //                   type="text"
  //                   maxLength={1}
  //                   onChange={(e) => {
  //                     handleOTPJoin(e.currentTarget.value, 4);
  //                   }}
  //                 />
  //                 <input
  //                   type="text"
  //                   maxLength={1}
  //                   onChange={(e) => {
  //                     handleOTPJoin(e.currentTarget.value, 5);
  //                   }}
  //                 />
  //               </div>
  //               <button type="submit" className="sign-in-button" onClick={()=>{
  //                 console.log("Verify OTP button clicked");
  //                 console.log("Current OTP value:", otpInputRef.current);
  //                 handleVerifyOTP({ preventDefault: () => console.log("preventDefault called") });
  //               }}>
  //                 Verify OTP
  //               </button>
  //             </form>
  //             <button
  //               onClick={handleResendOTP}
  //               className="sign-in-button"
  //               style={{ marginTop: "10px", background: "#444" }}
  //             >
  //               Resend OTP
  //             </button>
  //           </div>
  //         </div>
  //       </div>
  //     </>
  //   );
  // }

  return (
    <>
      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(255, 255, 255, 0.8)",
            backgroundRepeat: "no-repeat",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <LoadingScreen />
        </div>
      )}
      <div className="sign-in-container">
        {/* Left side image */}
        <div className="image-wrapper">
          <img
            src="/images/about.jpg"
            alt="Office space"
            className="office-image"
          />
        </div>

        {/* Form wrapper */}
        <div className="form-wrapper">
          {/* {!showOTPForm ? ( 
          <> */}
          <h2 className="welcome-text">Welcome User!</h2>
          <p className="subtitle">Sign Up as: </p>

          <div className="radio-inputs">
            <label className="radio">
              <input
                type="radio"
                value="User"
                checked={userType === "User"}
                onChange={(e) => setUserType(e.target.value)}
              />
              <span className="name">User</span>
            </label>
            <label className="radio">
              <input
                type="radio"
                value="Company"
                checked={userType === "Company"}
                onChange={(e) => setUserType(e.target.value)}
              />
              <span className="name">Company</span>
            </label>
          </div>

          <form onSubmit={handleSignup}>
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <div className="input-inline">
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder=" "
                  required
                  className={validationErrors.username ? "error" : ""}
                />
                <button
                  className="generate-btn"
                  onClick={handleGenerateUsername}
                >
                  Generate
                </button>
              </div>
              {validationErrors.username && (
                <div className="error-message">{validationErrors.username}</div>
              )}
            </div>

            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={validationErrors.email ? "error" : ""}
              />
              {validationErrors.email && (
                <div className="error-message">{validationErrors.email}</div>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder=" "
                required
                autoComplete="off"
                className={validationErrors.password ? "error" : ""}
              />
              <div className="strength-meter">
                <div
                  className="strength-bar"
                  style={{
                    width: passwordStrength.width,
                    backgroundColor: passwordStrength.color,
                  }}
                ></div>
              </div>
              <div className="strength-label">{passwordStrength.label}</div>
              {validationErrors.password && (
                <div className="error-message">{validationErrors.password}</div>
              )}
            </div>

            <div className="input-group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                  className={validationErrors.confirmPassword ? "error" : ""}
              />
              {validationErrors.confirmPassword && (
                <div className="error-message">{validationErrors.confirmPassword}</div>
              )}
            </div>

            <button
              type="submit"
              className={`sign-in-button ${!isFormValid ? 'disabled' : ''}`}
              disabled={!isFormValid}
            >
              Sign Up
            </button>
          </form>

          <div className="divider">
            <span>OR</span>
          </div>

          <button
            className="google-sign-in-button"
            onClick={handleGoogleSignIn}
          >
            <img className="google" src="/images/search.png" alt="google" />{" "}
            Sign Up With Google
          </button>

          <p className="signup-link-text">
            Already have an Account?{" "}
            <Link to="/login" className="signup-link">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

export { Signup };
