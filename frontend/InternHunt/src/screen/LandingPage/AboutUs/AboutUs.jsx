  import React, { useEffect } from "react";
import "./AboutUs.css";
import DarkVeil from "../DarkVeil";
import { FeaturesSection } from "../FeaturesSection/FeaturesSection";
import { useNavigate } from "react-router-dom";
import InfiniteIconSlider from "../InfiniteIconSlider/InfiniteIconSlider";
import FAQ from "../FAQ/FAQ";
import Feedback from "../Feedback/Feedback";

export const AboutUs = () => {
  const navigate = useNavigate();

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
    isAuthenticated().then((auth) => {
      if (auth) {
        navigate("/intro", { replace: true });
      }
    });
  });

  return (
    <>
      <div style={{ width: "100%", height: "100vh", position: "relative" }} id="about-section">
        <DarkVeil />
        <div className="about-container">
          <p className="about-para">
            Launch Your Career. Connect With Real Internships and Top Companies
            - All in One Place.
          </p>
          <div className="project-title">InternHunt</div>
        </div>
      </div>
      <div id="features-section">
        <FeaturesSection />
      </div>
      <section className="internship-options-section" id="internship-options-section">
        <header className="internship-options-header">
          <h1>
            Internship <span>Duration</span> Options
          </h1>
          <p>
            Choose the program length that fits your schedule and career goals.
            All our internship durations are designed to provide valuable
            experience and professional growth.
          </p>
        </header>
        <div className="options-container">
          <div className="option-card">
            <div className="icon-placeholder">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-zap"
              >
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
            </div>
            <h2>Standard Internships</h2>
            <p className="duration">3-6 months</p>
            <p className="description">
              Our most popular option offering comprehensive experience across
              multiple departments and projects.
            </p>
            <ul className="features-list">
              <li>
                <span className="check-icon">✓</span> Comprehensive training
              </li>
              <li>
                <span className="check-icon">✓</span> Mentorship programs
              </li>
              <li>
                <span className="check-icon">✓</span> Network building
              </li>
            </ul>
          </div>

          {/* Standard Internships Card (Most Popular) */}
          <div className="option-card most-popular">
            <span className="popular-tag">Most Popular</span>
            <div className="icon-placeholder">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-calendar"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <h2>Short-term Programs</h2>
            <p className="duration">1-3 weeks</p>
            <p className="description">
              Perfect for students with limited time or specific project goals.
              Get hands-on experience in focused, intensive programs.
            </p>
            <ul className="features-list">
              <li>
                <span className="check-icon">✓</span> Project-based learning
              </li>
              <li>
                <span className="check-icon">✓</span> Flexible scheduling
              </li>
              <li>
                <span className="check-icon">✓</span> Quick skill development
              </li>
            </ul>
          </div>

          {/* Extended Programs Card */}
          <div className="option-card">
            <div className="icon-placeholder">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-trending-up"
              >
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                <polyline points="17 6 23 6 23 12"></polyline>
              </svg>
            </div>
            <h2>Extended Programs</h2>
            <p className="duration">6-12 months</p>
            <p className="description">
              Deep-dive into your field with extended programs that offer the
              most comprehensive professional development.
            </p>
            <ul className="features-list">
              <li>
                <span className="check-icon">✓</span> Advanced responsibilities
              </li>
              <li>
                <span className="check-icon">✓</span> Leadership opportunities
              </li>
              <li>
                <span className="check-icon">✓</span> Career pathway planning
              </li>
            </ul>
          </div>
        </div>
      </section>
      <InfiniteIconSlider />
      <FAQ/>  
      <Feedback/>
    </>
  );
};
