import React from "react";
import "./AccountPage.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export const AccountPage = ({ username, email }) => {
  const handleLogOut = () => {
    window.open("http://localhost:3000/logout", "_self");
  };
  console.log(username, email);

  return (
    <section className="account-hover">
      <div className="input1" aria-label="Account menu">
        <Link to="/account-open">
          <button className="value">
            <svg
              data-name="Layer 2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
            >
              <path
                d="m1.5 13v1a.5.5 0 0 0 .3379.4731 18.9718 18.9718 0 0 0 6.1621 1.0269 18.9629 18.9629 0 0 0 6.1621-1.0269.5.5 0 0 0 .3379-.4731v-1a6.5083 6.5083 0 0 0 -4.461-6.1676 3.5 3.5 0 1 0 -4.078 0 6.5083 6.5083 0 0 0 -4.461 6.1676zm4-9a2.5 2.5 0 1 1 2.5 2.5 2.5026 2.5026 0 0 1 -2.5-2.5zm2.5 3.5a5.5066 5.5066 0 0 1 5.5 5.5v.6392a18.08 18.08 0 0 1 -11 0v-.6392a5.5066 5.5066 0 0 1 5.5-5.5z"
                fill="#7D8590"
              />
            </svg>
            Public profile
          </button>
        </Link>
        <hr className="divider" />
        <div className="user-info">
          <div className="user-image" aria-hidden="true"></div>
          <div className="user-info1">
            <h1>{username}</h1>
            <p>{email}</p>
          </div>
        </div>
        <button className="value" onClick={handleLogOut}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 25"
            fill="none"
          >
            <path
              fillRule="evenodd"
              fill="#7D8590"
              d="m11.9572 4.31201c-3.35401 0-6.00906 2.59741-6.00906 5.67742v3.29037c0 .1986-.05916.3927-.16992.5576l-1.62529 2.4193-.01077.0157c-.18701.2673-.16653.5113-.07001.6868.10031.1825.31959.3528.67282.3528h14.52603c.2546 0 .5013-.1515.6391-.3968.1315-.2343.1117-.4475-.0118-.6093-.0065-.0085-.0129-.0171-.0191-.0258l-1.7269-2.4194c-.121-.1695-.186-.3726-.186-.5809v-3.29037c0-1.54561-.6851-3.023-1.7072-4.00431-1.1617-1.01594-2.6545-1.67311-4.3019-1.67311zm-8.00906 5.67742c0-4.27483 3.64294-7.67742 8.00906-7.67742 2.2055 0 4.1606.88547 5.6378 2.18455.01.00877.0198.01774.0294.02691 1.408 1.34136 2.3419 3.34131 2.3419 5.46596v2.97007l1.5325 2.1471c.6775.8999.6054 1.9859.1552 2.7877-.4464.795-1.3171 1.4177-2.383 1.4177h-14.52603c-2.16218 0-3.55087-2.302-2.24739-4.1777l1.45056-2.1593zm4.05187 11.32257c0-.5523.44772-1 1-1h5.99999c.5523 0 1 .4477 1 1s-.4477 1-1 1h-5.99999c-.55228 0-1-.4477-1-1z"
              clipRule="evenodd"
            />
          </svg>
          LogOut
        </button>
      </div>
    </section>
  );
};

export const AccountDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [currentUser, setCurrentUser] = useState([]);
  const [projectApplicants, setProjectApplicants] = useState([]);
  const [projectDetails, setProjectDetails] = useState([]);
  console.log("Applicants: ", projectApplicants);
  var userApplicationPending = projectApplicants.filter((applicants) => {
    if (applicants.application_status === "Pending") {
      return applicants;
    }
  });

  var projectApplicationPending = projectDetails.filter((project) => {
    return userApplicationPending.filter((applicant) => {
      if (project._id === applicant.project_id) {
        return project;
      }
    });
  });

  console.log("Pending Projects: ", projectApplicationPending);
  // var userApplicationApproved = projectApplicants.filter((applicants) => {
  //   if (currentUser?.username === applicants.user_name && applicants.application_status === "Approved") {
  //     return applicants;
  //   }
  // });
  console.log("Pending Applications: ", userApplicationPending);
  // console.log("Approved Applications:" ,userApplicationApproved);
  console.log("Details: ", projectDetails);

  useEffect(() => {
    const id = projectApplicants
      .filter((applicant) => currentUser?.username === applicant.user_name)
      .map((applicant) => applicant.project_id);

    id.forEach((element) => {
      if (element) {
        fetch(`http://localhost:3000/api/projects/${element}`, {
          method: "GET",
        })
          .then((res) => res.json())
          .then((data) => setProjectDetails((prev) => [...prev, data]))
          .catch(() => setProjectDetails((prev) => prev));
      }
    });
  }, [projectApplicants, currentUser]);

  useEffect(() => {
    fetch("http://localhost:3000/current-user", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setCurrentUser(data.user))
      .catch(() => setCurrentUser(null));
  }, []);

  const showTab = (tabName) => {
    setActiveTab(tabName);
  };

  useEffect(() => {
    fetch("http://localhost:3000/api/application", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => setProjectApplicants(data))
      .catch(() => setProjectApplicants(null));
  }, []);

  return (
    <div className="account-page-wrapper">
      {/* Main Content */}
      <main className="main-container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-content">
            <div className="profile-avatar">
              <div className="avatar-circle">{currentUser?.username}</div>
            </div>
            <div className="profile-info">
              <h1 className="profile-name">{currentUser?.username}</h1>
              <p className="profile-title">Yet to Be Filled</p>
              <p className="profile-contact">
                📧 {currentUser?.email} | 📱 Yet to be added
              </p>
              <p className="profile-location">📍 Yet to be added</p>
              <div className="profile-skills">
                <span className="skill-badge skill-blue">NF</span>
                <span className="skill-badge skill-green">NF</span>
                <span className="skill-badge skill-purple">NF</span>
                <span className="skill-badge skill-orange">NF</span>
              </div>
            </div>
            {/* <button className="btn btn-primary"> Edit Profile</button> */}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="tabs-container">
          <div className="tabs-header">
            <nav className="tabs-nav">
              <button
                onClick={() => showTab("overview")}
                className={`tab-button ${
                  activeTab === "overview" ? "active" : ""
                }`}
              >
                📊 Overview
              </button>
              <button
                onClick={() => showTab("certificates")}
                className={`tab-button ${
                  activeTab === "certificates" ? "active" : ""
                }`}
              >
                🏆 Certificates
              </button>
              <button
                onClick={() => showTab("internships")}
                className={`tab-button ${
                  activeTab === "internships" ? "active" : ""
                }`}
              >
                💼 Internships
              </button>
              <button
                onClick={() => showTab("personal")}
                className={`tab-button ${
                  activeTab === "personal" ? "active" : ""
                }`}
              >
                👤 Personal Details
              </button>
            </nav>
          </div>

          {/* Overview Tab */}
          <div
            className={`tab-content ${
              activeTab === "overview" ? "active" : ""
            }`}
          >
            <div className="stats-grid">
              <div className="stat-card stat-blue">
                <div className="stat-number"> </div>
                <div className="stat-label">Certificates Earned</div>
              </div>
              <div className="stat-card stat-green">
                <div className="stat-number"></div>
                <div className="stat-label">Completed Internships</div>
              </div>
              <div className="stat-card stat-purple">
                <div className="stat-number"></div>
                <div className="stat-label">Active Internship</div>
              </div>
              <div className="stat-card stat-orange">
                <div className="stat-number"></div>
                <div className="stat-label">Average Rating</div>
              </div>
            </div>

            {/* <div className="overview-grid">
              <div>
                <h3 className="section-title1">Recent Achievements</h3>
                <div className="achievements-list">
                  <div className="achievement-item achievement-green">
                    <div className="achievement-icon achievement-icon-green">
                      ✓
                    </div>
                    <div>
                      <div className="achievement-title">
                        AWS Cloud Practitioner
                      </div>
                      <div className="achievement-date">
                        Completed 2 days ago
                      </div>
                    </div>
                  </div>
                  <div className="achievement-item achievement-blue">
                    <div className="achievement-icon achievement-icon-blue">
                      🎯
                    </div>
                    <div>
                      <div className="achievement-title">
                        Started internship at TechCorp
                      </div>
                      <div className="achievement-date">1 week ago</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="section-title1">Upcoming Deadlines</h3>
                <div className="achievements-list">
                  <div className="achievement-item achievement-yellow">
                    <div className="achievement-icon achievement-icon-yellow">
                      ⏰
                    </div>
                    <div>
                      <div className="achievement-title">
                        Project Presentation
                      </div>
                      <div className="achievement-date">Due in 3 days</div>
                    </div>
                  </div>
                  <div className="achievement-item achievement-red">
                    <div className="achievement-icon achievement-icon-red">
                      📝
                    </div>
                    <div>
                      <div className="achievement-title">
                        Mid-term Evaluation
                      </div>
                      <div className="achievement-date">Due in 1 week</div>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
          </div>

          {/* Certificates Tab */}
          <div
            className={`tab-content ${
              activeTab === "certificates" ? "active" : ""
            }`}
          >
            <div className="tab-header">
              <h2 className="tab-title">My Certificates(Template)</h2>
              {/* <button className="btn btn-primary">Add Certificate</button> */}
            </div>

            <div className="certificates-grid">
              <div className="certificate-card">
                <div className="certificate-header">
                  <div className="certificate-icon certificate-icon-orange">
                    ☁️
                  </div>
                  <span className="badge badge-verified">Verified</span>
                </div>
                <h3 className="certificate-title">AWS Cloud Practitioner</h3>
                <p className="certificate-issuer">Amazon Web Services</p>
                <p className="certificate-date">
                  Issued: Dec 2024 • Expires: Dec 2027
                </p>
                <button className="btn btn-secondary btn-full">
                  View Certificate
                </button>
              </div>
            </div>
          </div>

          {/* Internships Tab */}
          <div
            className={`tab-content ${
              activeTab === "internships" ? "active" : ""
            }`}
          >
            <h2 className="tab-title">My Internships</h2>

            {/* Active Internship */}
            <div className="internship-section">
              {/* <h3 className="internship-section-title1">
                <span className="status-dot"></span>
                Currently Active:
              </h3> */}
              <div>
                {projectApplicationPending.slice(0, 4).map((appl) => (
                  <div className="internship-card" key={appl.id}>
                    <div className="internship-header">
                      <div>
                        <h4 className="internship-title">
                          {appl.project_title}
                        </h4>
                        <p className="internship-company">
                          {appl.company_name}
                        </p>
                        <p className="internship-duration">
                          {appl.time_duration}
                        </p>
                      </div>
                      <span className="badge badge-active">Pending</span>
                    </div>
                    <p className="internship-description">
                      {appl.project_description}
                    </p>
                    <div className="tags-container">
                      <span className="tag tag-blue">React</span>
                      <span className="tag tag-green">Node.js</span>
                      <span className="tag tag-purple">PostgreSQL</span>
                    </div>
                    <div className="internship-actions">
                      <button className="btn btn-secondary">
                        View Details
                      </button>
                      <button className="btn btn-secondary">
                        Submit Report
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pending Internship */}
            {/* <div className="internship-section">
              <h3 className="internship-section-title1">
                <span className="status-dot"></span>
                Pending Approvals:
              </h3>
              <div>
                {userApplicationPending.map((appl) => (
                  <div className="internship-card" key={appl.id}>
                    <div className="internship-header">
                      <div>
                        <h4 className="internship-title">
                          Software Engineering Intern
                        </h4>
                        <p className="internship-company">{appl.user_name}</p>
                        <p className="internship-duration">
                          Dec 2024 - Mar 2025 • Remote
                        </p>
                      </div>
                      <span className="badge badge-active">Active</span>
                    </div>
                    <p className="internship-description">
                      Working on full-stack web development projects using
                      React, Node.js, and PostgreSQL.
                    </p>
                    <div className="tags-container">
                      <span className="tag tag-blue">React</span>
                      <span className="tag tag-green">Node.js</span>
                      <span className="tag tag-purple">PostgreSQL</span>
                    </div>
                    <div className="internship-actions">
                      <button className="btn btn-secondary">
                        View Details
                      </button>
                      <button className="btn btn-secondary">
                        Submit Report
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div> */}

            {/* Completed Internships */}
            {/* <div className="internship-section">
              <h3 className="internship-section-title1">
                <span className="status-dot"></span>
                  Completed Internships
              </h3>
              <div>
                {userApplication.map((appl) => (
                  <div className="internship-card" key={appl.id}>
                    <div className="internship-header">
                      <div>
                        <h4 className="internship-title">
                          Software Engineering Intern
                        </h4>
                        <p className="internship-company">{appl.user_name}</p>
                        <p className="internship-duration">
                          Dec 2024 - Mar 2025 • Remote
                        </p>
                      </div>
                      <span className="badge badge-active">Active</span>
                    </div>
                    <p className="internship-description">
                      Working on full-stack web development projects using
                      React, Node.js, and PostgreSQL.
                    </p>
                    <div className="tags-container">
                      <span className="tag tag-blue">React</span>
                      <span className="tag tag-green">Node.js</span>
                      <span className="tag tag-purple">PostgreSQL</span>
                    </div>
                    <div className="internship-actions">
                      <button className="btn btn-secondary">
                        View Details
                      </button>
                      <button className="btn btn-secondary">
                        Submit Report
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div> */}
          </div>

          {/* Personal Details Tab */}
          <div
            className={`tab-content ${
              activeTab === "personal" ? "active" : ""
            }`}
          >
            <div className="overlay-text">In Work</div>
            <div className="personal-details-container">
              <div className="tab-header">
                <h2 className="tab-title">Personal Details</h2>
                <button className="btn btn-primary">Edit Information</button>
              </div>

              <div className="personal-grid">
                {/* Basic Information */}
                <div className="info-card">
                  <h3 className="info-card-title">Basic Information</h3>
                  <div className="info-items">
                    <div className="info-item">
                      <label className="info-label">Full Name</label>
                      <p className="info-value">Alex Johnson</p>
                    </div>
                    <div className="info-item">
                      <label className="info-label">Email</label>
                      <p className="info-value">alex.johnson@email.com</p>
                    </div>
                    <div className="info-item">
                      <label className="info-label">Phone</label>
                      <p className="info-value">(555) 123-4567</p>
                    </div>
                    <div className="info-item">
                      <label className="info-label">Date of Birth</label>
                      <p className="info-value">March 15, 2002</p>
                    </div>
                  </div>
                </div>

                {/* Education */}
                <div className="info-card">
                  <h3 className="info-card-title">Education</h3>
                  <div className="info-items">
                    <div className="info-item">
                      <label className="info-label">University</label>
                      <p className="info-value">Stanford University</p>
                    </div>
                    <div className="info-item">
                      <label className="info-label">Degree</label>
                      <p className="info-value">
                        Bachelor of Science in Computer Science
                      </p>
                    </div>
                    <div className="info-item">
                      <label className="info-label">Expected Graduation</label>
                      <p className="info-value">May 2025</p>
                    </div>
                    <div className="info-item">
                      <label className="info-label">GPA</label>
                      <p className="info-value">3.8/4.0</p>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="info-card">
                  <h3 className="info-card-title">Address</h3>
                  <div className="info-items">
                    <div className="info-item">
                      <label className="info-label">Street Address</label>
                      <p className="info-value">123 University Ave</p>
                    </div>
                    <div className="info-item">
                      <label className="info-label">City</label>
                      <p className="info-value">San Francisco</p>
                    </div>
                    <div className="info-item">
                      <label className="info-label">State</label>
                      <p className="info-value">California</p>
                    </div>
                    <div className="info-item">
                      <label className="info-label">ZIP Code</label>
                      <p className="info-value">94102</p>
                    </div>
                  </div>
                </div>

                {/* Professional Links */}
                <div className="info-card">
                  <h3 className="info-card-title">Professional Links</h3>
                  <div className="info-items">
                    <div className="info-item">
                      <label className="info-label">LinkedIn</label>
                      <a
                        href="https://linkedin.com/in/alexjohnson"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="info-link"
                      >
                        linkedin.com/in/alexjohnson
                      </a>
                    </div>
                    <div className="info-item">
                      <label className="info-label">GitHub</label>
                      <a
                        href="https://github.com/alexjohnson"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="info-link"
                      >
                        github.com/alexjohnson
                      </a>
                    </div>
                    <div className="info-item">
                      <label className="info-label">Portfolio</label>
                      <a
                        href="https://alexjohnson.dev"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="info-link"
                      >
                        alexjohnson.dev
                      </a>
                    </div>
                    <div className="info-item">
                      <label className="info-label">Resume</label>
                      <button className="info-link">Download PDF</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio Section */}
              <div className="bio-card">
                <h3 className="info-card-title">Bio</h3>
                <p className="bio-text">
                  Passionate computer science student with a strong foundation
                  in full-stack development and data analysis. I enjoy solving
                  complex problems and building innovative solutions that make a
                  real impact. Currently seeking opportunities to apply my
                  skills in machine learning and web development while
                  contributing to meaningful projects. In my free time, I enjoy
                  hiking, photography, and contributing to open-source projects.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
