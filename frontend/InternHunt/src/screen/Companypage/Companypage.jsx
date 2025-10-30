import React, {useEffect, useState} from "react";
import { CompanyNavbar } from "../../components/CompanyNavbar/CompanyNavbar";
import { Link } from "react-router-dom";
import TextType from "/src/ReactBuilds/TextType/TextType";
import "./Companypage.css";
import "react-multi-carousel/lib/styles.css";

export const Companypage = () => {
  const [projectData, setProjectData] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [mentorData, setMentorData] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeInterns: 0,
    expertMentors: 0,
    successRate: 0,
    totalProjects: 0,
    pendingProjects: 0,
    approvedProjects: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch projects
        const projectsRes = await fetch("http://localhost:3000/api/projects");
        const projectsData = await projectsRes.json();
        setProjectData(projectsData);

        // Fetch mentors
        const mentorsRes = await fetch("http://localhost:3000/api/mentors");
        const mentorsData = await mentorsRes.json();
        setMentorData(mentorsData);

        // Fetch current user
        const userRes = await fetch("http://localhost:3000/current-user", {
          credentials: "include",
        });
        const userData = await userRes.json();
        setCurrentUser(userData.user);

        // Fetch applications for company's projects
        if (userData.user) {
          const companyProjects = projectsData.filter(project => 
            project.company_name?.toLowerCase() === userData.user?.username?.toLowerCase()
          );
          
          // Fetch applications for each project
          const allApplications = [];
          for (const project of companyProjects) {
            try {
              const appRes = await fetch(`http://localhost:3000/api/projects/${project._id}/applications`);
              const projectApplications = await appRes.json();
              allApplications.push(...projectApplications.map(app => ({
                ...app,
                project_title: project.project_title,
                project_id: project._id
              })));
            } catch (error) {
              console.error(`Error fetching applications for project ${project._id}:`, error);
            }
          }
          setApplications(allApplications);
        }

        // Calculate statistics
        const companyProjects = projectsData.filter(project => 
          project.company_name?.toLowerCase() === userData.user?.username?.toLowerCase()
        );
        
        const companyMentors = mentorsData.filter(mentor => 
          mentor.company_name?.toLowerCase() === userData.user?.username?.toLowerCase()
        );

        setStats({
          activeInterns: Math.floor(Math.random() * 50) + 20, // Mock data for now
          expertMentors: companyMentors.length,
          successRate: Math.floor(Math.random() * 20) + 80, // 80-100%
          totalProjects: companyProjects.length,
          pendingProjects: companyProjects.filter(p => p.projectApproval === "Pending").length,
          approvedProjects: companyProjects.filter(p => p.projectApproval === "Approved").length
        });

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get company's projects (filtered by company name)
  const companyProjects = projectData.filter(project => 
    project.company_name?.toLowerCase() === currentUser?.username?.toLowerCase()
  );

  // Get recent projects (last 6 projects)
  const recentProjects = companyProjects.slice(0, 3);

  // Application management functions
  const handleApplicationStatus = async (applicationId, status) => {
    try {
      const response = await fetch(`http://localhost:3000/api/applications/${applicationId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        // Update local state
        setApplications(prev => prev.map(app => 
          app._id === applicationId 
            ? { ...app, application_status: status }
            : app
        ));
        
        // Refresh project data to update applicant counts
        const projectsRes = await fetch("http://localhost:3000/api/projects");
        const projectsData = await projectsRes.json();
        setProjectData(projectsData);
        
        alert(`Application ${status.toLowerCase()} successfully!`);
      } else {
        alert('Failed to update application status');
      }
    } catch (error) {
      console.error('Error updating application status:', error);
      alert('Error updating application status');
    }
  };

  // Calculate application statistics
  const pendingApplications = applications.filter(app => app.application_status === 'Pending');
  const approvedApplications = applications.filter(app => app.application_status === 'Approved');
  const rejectedApplications = applications.filter(app => app.application_status === 'Rejected');

  // Enhanced stats array with real data
  const statsArray = [
    { 
      label: "Active Interns", 
      value: `${stats.activeInterns}+`, 
      colorClass: "primary",
      icon: "👥",
      trend: "+12%"
    },
    { 
      label: "Expert Mentors", 
      value: `${stats.expertMentors}+`, 
      colorClass: "accent",
      icon: "🎓",
      trend: "+5%"
    },
    { 
      label: "Success Rate", 
      value: `${stats.successRate}%`, 
      colorClass: "success",
      icon: "📈",
      trend: "+3%"
    },
    { 
      label: "Total Projects", 
      value: `${stats.totalProjects}`, 
      colorClass: "warning",
      icon: "🚀",
      trend: stats.pendingProjects > 0 ? `${stats.pendingProjects} pending` : "All approved"
    },
  ];

  if (loading) {
    return (
      <div>
        <CompanyNavbar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <CompanyNavbar />
      <div className="welcome-container1">
        <TextType
          text={[
            `Welcome Back ${currentUser?.username || 'Company'}, Manage your projects and track your progress`,
          ]}
          typingSpeed={75}
          pauseDuration={1500}
          showCursor={true}
          cursorCharacter="|"
        />
      </div>
      <main>
        {/* Stats Section */}
        {/* <section className="stats-section">
          <div className="stats-container">
            <div className="stats-header">
              <h2 className="stats-title">Company Dashboard</h2>
            </div>
            <div className="stats-grid">
              {statsArray.map((stat) => (
                <div key={stat.label} className="stat-card">
                  <div className="stat-card-content">
                    <div className="stat-icon-wrapper">
                      <span className="stat-icon">{stat.icon}</span>
                    </div>
                    <div className="stat-value">{stat.value}</div>
                    <div className="stat-label">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section> */}

        {/* Recent Projects Section */}
        <section className="projects-section">
          <div className="pro-container">
            <div className="projects-header">
              <h2 className="projects-title">Your Projects</h2>
              <p className="projects-subtitle">
                Manage and track your company's projects
              </p>
            </div>
            
            {recentProjects.length === 0 ? (
              <div className="no-projects">
                <div className="no-projects-icon">📋</div>
                <h3>No Projects Yet</h3>
                <p>Start by creating your first project to get started</p>
                <Link to="/projects">
                  <button className="btn-primary">Create Project</button>
                </Link>
              </div>
            ) : (
              <>
                <div className="projects-grid">
                  {recentProjects.map((project) => (
                    <div key={project._id} className="project-card">
                      <div className="project-card-header">
                        <div className="project-status-badge">
                          <span className={`status ${project.projectApproval?.toLowerCase()}`}>
                            {project.projectApproval || 'Draft'}
                          </span>
                        </div>
                        <h3 className="project-title-1">{project.project_title}</h3>
                        <p className="project-company">{project.company_name}</p>
                        <p className="project-desc">{project.project_description?.substring(0, 100)}...</p>
                      </div>
                      <div className="project-card-content">
                        <div className="project-meta">
                          <span className="project-salary">₹{project.salary?.toLocaleString()}</span>
                          <span className="project-duration">{project.time_duration}</span>
                        </div>
                        <div className="skills-list">
                          {project.skills_required?.slice(0, 3).map((skill) => (
                            <span key={skill} className="skill-badge">
                              {skill}
                            </span>
                          ))}
                          {project.skills_required?.length > 3 && (
                            <span className="skill-badge more">+{project.skills_required.length - 3} more</span>
                          )}
                        </div>
                        <div className="project-actions">
                          <Link to={`/projects/${project._id}`}>
                            <button className="project-btn">
                              View Details
                            </button>
                          </Link>
                          <button className="project-btn-secondary">
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="projects-viewall">
                  <Link to="/project-listings">
                    <button className="btn-lg">View All Projects</button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Applications Management Section */}
        <section className="applications-section">
          <div className="pro-container">
            <div className="applications-header">
              <h2 className="applications-title">Project Applications</h2>
              <p className="applications-subtitle">
                Review and manage applications for your projects
              </p>
            </div>
            
            {applications.length === 0 ? (
              <div className="no-applications">
                <div className="no-applications-icon">📝</div>
                <h3>No Applications Yet</h3>
                <p>Applications will appear here when users apply to your projects</p>
              </div>
            ) : (
              <>
                {/* Application Stats */}
                <div className="application-stats">
                  <div className="stat-item">
                    <span className="stat-number">{pendingApplications.length}</span>
                    <span className="stat-label">Pending Review</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{approvedApplications.length}</span>
                    <span className="stat-label">Approved</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{rejectedApplications.length}</span>
                    <span className="stat-label">Rejected</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{applications.length}</span>
                    <span className="stat-label">Total Applications</span>
                  </div>
                </div>

                {/* Applications List */}
                <div className="applications-list">
                  {applications.map((application) => (
                    <div key={application._id} className="application-card">
                      <div className="application-header">
                        <div className="application-user-info">
                          <div className="user-avatar">
                            {application.user_name?.charAt(0).toUpperCase()}
                          </div>
                          <div className="user-details">
                            <h4 className="user-name">{application.user_name}</h4>
                            <p className="user-email">{application.user_email}</p>
                          </div>
                        </div>
                        <div className="application-meta">
                          <span className="project-name">{application.project_title}</span>
                          <span className={`status-badge status-${application.application_status.toLowerCase()}`}>
                            {application.application_status}
                          </span>
                          <span className="application-date">
                            {new Date(application.application_date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="application-content">
                        {application.cover_letter && (
                          <div className="cover-letter">
                            <h5>Cover Letter:</h5>
                            <p>{application.cover_letter}</p>
                          </div>
                        )}
                        
                        {application.resume_url && (
                          <div className="resume-link">
                            <h5>Resume:</h5>
                            <a href={application.resume_url} target="_blank" rel="noopener noreferrer">
                              View Resume
                            </a>
                          </div>
                        )}
                        
                        {application.additional_notes && (
                          <div className="additional-notes">
                            <h5>Additional Notes:</h5>
                            <p>{application.additional_notes}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="application-actions">
                        {application.application_status === 'Pending' && (
                          <>
                            <button 
                              className="btn-approve"
                              onClick={() => handleApplicationStatus(application._id, 'Approved')}
                            >
                              ✓ Approve
                            </button>
                            <button 
                              className="btn-reject"
                              onClick={() => handleApplicationStatus(application._id, 'Rejected')}
                            >
                              ✗ Reject
                            </button>
                          </>
                        )}
                        {application.application_status === 'Approved' && (
                          <span className="status-message approved">✓ Application Approved</span>
                        )}
                        {application.application_status === 'Rejected' && (
                          <span className="status-message rejected">✗ Application Rejected</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};
