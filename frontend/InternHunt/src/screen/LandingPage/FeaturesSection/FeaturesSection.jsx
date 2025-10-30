import React from "react";
import "./FeaturesSections.css";

export const FeaturesSection = () => {
  const featuresData = [
    {
      icon: "🔍",
      title: "Smart Matching",
      description:
        "AI-powered algorithm matches you with internships based on your skills, interests, and career goals.",
    },
    {
      icon: "👥",
      title: "Direct Connect",
      description:
        "Connect directly with hiring managers and team leads for faster application processes.",
    },
    {
      icon: "✅",
      title: "Skill Verification",
      description:
        "Showcase your abilities with verified skill badges and project portfolios.",
    },
    {
      icon: "🧑‍🏫",
      title: "Mentorship",
      description:
        "Get guidance from industry professionals and successful interns.",
    },
    {
      icon: "🛡️",
      title: "Secure Platform",
      description:
        "Your data is protected with enterprise-grade security and privacy measures.",
    },
    {
      icon: "⚡",
      title: "Quick Apply",
      description:
        "Apply to multiple internships with one click using your optimized profile.",
    },
  ];

  const FeatureCard = ({ icon, title, description }) => {
    return (
      <div className="feature-card">
        <div className="icon-box">
          <span className="icon-text">{icon}</span>
        </div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    );
  };
  
  return (
    <div>
      <div className="features-section-container" id="features-section-container">
        <div className="header-content">
          <h1>
            Everything You Need to <span>Succeed</span>
          </h1>
          <p>
            Our comprehensive platform provides all the tools and resources you
            need to find, apply for, and excel in your internship journey.
          </p>
        </div>

        <div className="features-grid">
          {featuresData.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
