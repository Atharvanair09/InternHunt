import React from "react";
import "./CompanyNavbar.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { AccountPage } from "../../screen/AccountPage/AccountPage";

export const CompanyNavbar = () => {
  const [showAccount, setShowAccount] = React.useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const handleProfileClick = () => {
    setShowAccount(true);
  };

  const handleCloseAccount = () => {
    setShowAccount(false);
  };

  useEffect(() => {
    fetch("http://localhost:3000/current-user", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setCurrentUser(data.user))
      .catch(() => setCurrentUser(null));
  }, []);

  return (
    <section className="user-navbar">
      <h2
        className="user-title"
        onClick={handleProfileClick}
        style={{ cursor: "pointer" }}
      >
        InternHunt
      </h2>
      <div className="user-contain">
        <Link to="/company-intro">
          <p className="user-links">Dashboard</p>
        </Link>
        <Link to="/project-listings">
          <p className="user-links">Projects</p>
        </Link>
        <Link to="/mentor-list">
          <p className="user-links">Mentors</p>
        </Link>
        <Link to="/under-work">
          <p className="user-links">Progress</p>
        </Link>
        <button className="spotify-btn" onClick={handleProfileClick}>
          <div className="spotify-btn__shine"></div>
          <div className="spotify-btn__icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 496 512"
              className="spotify-icon"
            >
              <path d="M248 8C111.1 8 0 119.1 0 256s111.1 248 248 248 248-111.1 248-248S384.9 8 248 8zm0 96c39.8 0 72 32.2 72 72s-32.2 72-72 72-72-32.2-72-72 32.2-72 72-72zm0 360c-52.9 0-100.9-25.6-130.1-65.2 2.0-43.7 86.7-67.8 130.1-67.8s128.1 24.1 130.1 67.8C348.9 438.4 300.9 464 248 464z"></path>
            </svg>
          </div>
        </button>
      </div>
      {showAccount && (
        <div className="account-overlay" onClick={handleCloseAccount}>
          <div className="account-panel" onClick={(e) => e.stopPropagation()}>
            <AccountPage
              onLogout={() => {
                handleCloseAccount();
              }}
              username={currentUser?.username}
              email={currentUser?.email}
            />
          </div>
        </div>
      )}
    </section>
  );
};
