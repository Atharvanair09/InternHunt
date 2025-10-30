import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ProjectPage.css";

function ProjectPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [projectData, setProjectData] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [applicationStatus, setApplicationStatus] = useState({
    hasApplied: false,
    status: null,
  });

  const [isApplying, setIsApplying] = useState(false);

  console.log(currentUser);

  useEffect(() => {
    if (!id) return;
    axios.get(`http://localhost:3000/api/projects/${id}`).then((response) => {
      setProjectData(response.data);
    });
  }, [id]);

  // Get current user
  useEffect(() => {
    fetch("http://localhost:3000/current-user", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setCurrentUser(data.user))
      .catch(() => setCurrentUser(null));
  }, []);

  // Check application status
  useEffect(() => {
    if (currentUser && projectData) {
      fetch(
        `http://localhost:3000/api/applications/status/${currentUser._id}/${projectData._id}`
      )
        .then((res) => res.json())
        .then((data) => setApplicationStatus(data))
        .catch(() => setApplicationStatus({ hasApplied: false, status: null }));
    }
  }, [currentUser, projectData]);

  function getInitialNames(name) {
    const names = name.split(" ");
    const title_initials = names[0];
    const first_initial =
      names.length > 1 ? names[1].charAt(0).toUpperCase() : "";
    const second_initial =
      names.length > 2 ? names[2].charAt(0).toUpperCase() : "";
    const initials = title_initials + first_initial + second_initial;
    return initials;
  }

  const initials = getInitialNames(
    projectData ? projectData.mentor.mentor_name : ""
  );

  const handleSubmitApplication = async () => {
    if (!currentUser) {
      alert("Please login to apply for this project");
      return;
    }

    if (applicationStatus.hasApplied) {
      alert(
        `You have already applied to this project. Status: ${applicationStatus.status}`
      );
      return;
    }

    setIsApplying(true);
    try {
      const response = await fetch("http://localhost:3000/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          user_id: currentUser._id,
          project_id: projectData._id,
          user_name: currentUser.username,
          user_email: currentUser.email,
          cover_letter:
            "I am interested in this project and would like to contribute.",
          resume_url: "",
          additional_notes: "",
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Application submitted successfully!");
        setApplicationStatus({ hasApplied: true, status: "Pending" });
        // Refresh project data to get updated applicant count
        const updatedProject = await axios.get(
          `http://localhost:3000/api/projects/${id}`
        );
        setProjectData(updatedProject.data);
      } else {
        alert(result.error || "Failed to submit application");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Network error. Please try again.");
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div>
      {!projectData ? null : (
        <div key={projectData._id} className="pp-container">
          <div className="pp-main-content">
            <div className="pp-header">
              <button
                className="pp-back-button"
                onClick={() => {
                  navigate(-1);
                }}
              >
                ← Back to Projects
              </button>
              <div className="pp-project-title-section">
                <h1>{projectData.project_title}</h1>
                <span className="pp-status-tag">
                  {projectData.project_status}
                </span>
              </div>
              <p className="pp-company-name">{projectData.company_name}</p>
            </div>

            {/* About Project Section */}
            <div className="pp-section pp-about-project">
              <h2>
                <b>About the Project :</b>
              </h2>
              <p>{projectData.project_description}</p>
            </div>

            {/* Skills Section */}
            <div className="pp-section pp-skills-section">
              <h2>Skills You'll Learn :</h2>
              <div className="pp-skill-tags">
                {(projectData.skills_required || []).map((skill) => (
                  <span key={skill} className="pp-skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Requirements Section */}
            <div className="pp-section pp-requirements-section">
              <h2>Requirements :</h2>
              <ul className="pp-requirements-list">
                {(projectData.basic_requirements || []).map((req, index) => (
                  <li key={index}>
                    <span className="pp-requirement-icon">✔</span> {req}
                  </li>
                ))}
              </ul>
            </div>

            {/* Project Info Section (Duration, Applicants, Start Date) */}
            <div className="pp-project-info-section">
              <div className="pp-info-item">
                <span className="pp-info-icon">🕒</span>{" "}
                {projectData.time_duration}
              </div>
              <div className="pp-info-item">
                <span className="pp-info-icon">👥</span>{" "}
                {projectData.applicants || 0} applicants
              </div>
              <div className="pp-info-item">
                <span className="pp-info-icon">🗓️</span> Starts{" "}
                {new Date(
                  projectData.number_of_applicants_starts_on
                ).toLocaleDateString()}
              </div>
            </div>

            {/* Project Milestones Section */}
            <div className="pp-section pp-project-milestones-section">
              <h2>Project Milestones :</h2>
              <p className="pp-progress-text">
                Track progress through key project phases
              </p>
              <ul className="pp-milestones-list">
                {(projectData.project_milestones || []).map(
                  (milestone, index) => (
                    <li key={index}>
                      <span className="pp-milestone-status-icon">⚪</span>
                      <span className="pp-milestone-name">{milestone}</span>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="pp-sidebar">
            {/* Apply Now Card */}
            <div className="pp-mentor-card">
              <h3>Mentor Onboard</h3>
              <p className="pp-mentor-guidance">
                Need guidance for this project? Contact your mentor.
              </p>
              <div className="pp-mentor-details">
                <div className="pp-mentor-avatar">{initials}</div>
                <div>
                  <p className="pp-mentor-name">
                    {projectData.mentor.mentor_name}
                  </p>
                  <p className="pp-mentor-title">
                    {projectData.mentor.designation}
                  </p>
                  <p className="pp-mentor-title1">{projectData.mentor.email}</p>
                  <p className="pp-mentor-title1">
                    {projectData.mentor.number}
                  </p>
                </div>
              </div>
              <button className="pp-contact-mentor-button">
                <span className="pp-icon">📞</span> Contact Mentor
              </button>
            </div>
            <hr className="horizontal-line" />
            
            {currentUser?.userType !== "Company" && (
              <div className="pp-apply-now-card pp-card">
                <h3>Apply Now</h3>
                <p className="pp-apply-text">Join this exciting project</p>

                {applicationStatus.hasApplied &&
                currentUser?.userType === "Company" ? (
                  <div className="pp-application-status">
                    <div
                      className={`pp-status-badge pp-status-${applicationStatus.status.toLowerCase()}`}
                    >
                      {applicationStatus.status}
                    </div>
                    <p className="pp-status-text">
                      {applicationStatus.status === "Pending" &&
                        "Your application is under review"}
                      {applicationStatus.status === "Approved" &&
                        "Congratulations! You've been accepted" &&
                        window.open(
                          "https://github.com/Atharvanair09/RetroGameX.git"
                        )}
                      {applicationStatus.status === "Rejected" &&
                        "Unfortunately, your application was not selected"}
                    </p>
                  </div>
                ) : (
                  <>
                    <button
                      className="pp-submit-application-button"
                      onClick={handleSubmitApplication}
                      disabled={!currentUser || isApplying}
                    >
                      {!currentUser
                        ? "Login to Apply"
                        : isApplying
                        ? "Submitting..."
                        : "Submit Application"}
                    </button>
                    {/* <button className="pp-save-for-later-button">
                    Save for Later
                  </button> */}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectPage;
