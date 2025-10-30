import React from "react";
import "./Footer.css";

export const Footer = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <footer id="footer" className="footer">
      <div className="footer-content">
        <div className="footer-top">
          <div className="fade-in delay-200">
            <div>
              <form className="form">
                <span className="title">Subscribe to our newsletter.</span>
                <p className="description">
                  Nostrud amet eu ullamco nisi aute in ad minim nostrud
                  adipisicing velit quis. Duis tempor incididunt dolore.
                </p>
                <div>
                  <input
                    placeholder="Enter your email"
                    type="email"
                    name="email"
                    id="email-address"
                  />
                  <button type="submit">Subscribe</button>
                </div>
              </form>
            </div>
          </div>
          <div className="fade-in delay-400">
            <div className="nav-links">
              <a onClick={() => scrollToSection('about-section')}>Welcome</a>
              <a onClick={() => scrollToSection('features-section')}>Features</a>
              <a onClick={() => scrollToSection('internship-options-section')}>Durations</a>
              <a onClick={() => scrollToSection('icon-slider-section')}>Companies</a>
              <a onClick={() => scrollToSection('faq-section')}>How to Apply/Work</a>
              <a onClick={() => scrollToSection('faq-section')}>FAQ</a>
              <a onClick={() => scrollToSection('carousel-section')}>Feedback</a>
            </div>
          </div>
          <div className="fade-in delay-600">
            <div className="social-links">
              <a>Instagram</a>
              <a>Youtube</a>
              <a>Linkedin</a>
              <a>GitHub</a>
            </div>
          </div>
        </div>
        <div className="fade-in delay-1000 large-title">InternHunt</div>
        <div className="fade-in delay-800 copyright">
          © 2025 All rights reserved
        </div>
      </div>
    </footer>
  );
};
