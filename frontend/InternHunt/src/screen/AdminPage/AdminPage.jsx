import React, { useState, useMemo, useEffect } from "react";
import "./AdminPage.css";
import axios from "axios";

const TrashIcon = ({ size = "1rem" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="trash-icon"
    aria-hidden="true"
  >
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

const CheckIcon = ({ size = "1rem" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="check-icon"
    aria-hidden="true"
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const XIcon = ({ size = "1rem" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="x-icon"
    aria-hidden="true"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

function SectionHeader({ title, children }) {
  return (
    <div className="section-header">
      <h2 className="section-title">
        <span>{title}</span>
      </h2>
    </div>
  );
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showRejectAlert, setshowRejectAlert] = useState(false);
  const [feedbackData , setFeedbackData] = useState([]);
  const pendingUsers = users.filter(
    (user) => user.userStatus === "Pending" && user.userType === "User"
  );
  const approvedUsers = users.filter(
    (user) => user.userStatus === "Approved" && user.userType === "User"
  );
  const pendingCompanies = users.filter(
    (user) => user.userStatus === "Pending" && user.userType === "Company"
  );
  const approvedCompanies = users.filter(
    (user) => user.userStatus === "Approved" && user.userType === "Company"
  );
  const pendingProjects = projects.filter(
    (project) => project.projectApproval === "Pending"
  );
  const approvedProjects = projects.filter(
    (project) => project.projectApproval === "Approved"
  );
  const usernumber = users.length;
  const pendingapprovals = pendingUsers.length || 0;

  // Calculate real-time stats
  const calculateApprovalRate = () => {
    const totalUsers = users.length;
    const approvedUsers = users.filter(
      (user) => user.userStatus === "Approved"
    ).length;
    return totalUsers > 0 ? Math.round((approvedUsers / totalUsers) * 100) : 0;
  };

  const calculateAvgResponseTime = () => {
    // Mock calculation - in real app, this would be based on actual approval timestamps
    const baseTime = 2.4;
    const variation = Math.random() * 0.8 - 0.4; // ±0.4 hours variation
    return (baseTime + variation).toFixed(1);
  };

  const getActiveProjectsCount = () => {
    return approvedProjects.length;
  };

  // Generate recent activity from real data
  const generateRecentActivity = () => {
    const activities = [];
    const now = new Date();

    // Add recent user registrations
    users.slice(0, 3).forEach((user, index) => {
      const timeAgo = new Date(now.getTime() - (index + 1) * 15 * 60 * 1000); // 15 min intervals
      activities.push({
        type: "user_registration",
        message: "New user registration",
        detail: user.username,
        time: timeAgo,
        icon: "👤",
      });
    });

    // Add recent project submissions
    pendingProjects.slice(0, 2).forEach((project, index) => {
      const timeAgo = new Date(now.getTime() - (index + 1) * 30 * 60 * 1000); // 30 min intervals
      activities.push({
        type: "project_submission",
        message: "Project submitted for approval",
        detail: project.company_name,
        time: timeAgo,
        icon: "📋",
      });
    });

    // Add recent approvals
    approvedUsers.slice(0, 2).forEach((user, index) => {
      const timeAgo = new Date(now.getTime() - (index + 1) * 60 * 60 * 1000); // 1 hour intervals
      activities.push({
        type: "user_approval",
        message: "User approved",
        detail: user.username,
        time: timeAgo,
        icon: "✅",
      });
    });

    // Add recent project approvals
    approvedProjects.slice(0, 1).forEach((project, index) => {
      const timeAgo = new Date(
        now.getTime() - (index + 1) * 2 * 60 * 60 * 1000
      ); // 2 hour intervals
      activities.push({
        type: "project_approval",
        message: "Project approved",
        detail: project.project_title,
        time: timeAgo,
        icon: "🚀",
      });
    });

    // Sort by time (most recent first) and take first 5
    return activities.sort((a, b) => b.time - a.time).slice(0, 5);
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} day${days > 1 ? "s" : ""} ago`;
    }
  };

  useEffect(() => {
    axios.get("http://localhost:3000/api/users").then((response) => {
      setUsers(response.data);
    });
    axios.get("http://localhost:3000/api/projects").then((response) => {
      setProjects(response.data);
    });

    axios.get("http://localhost:3000/api/feedback").then((response) => {
      setFeedbackData(response.data);
    });

    // Notifications initial fetch + polling
    const fetchNotifications = () => {
      axios
        .get("http://localhost:3000/api/notifications")
        .then((res) => setNotifications(res.data || []))
        .catch(() => setNotifications([]));
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchUsers = async () => {
    const response = await axios.get("http://localhost:3000/api/users");
    setUsers(response.data);
  };

  const fetchProjects = async () => {
    const response = await axios.get("http://localhost:3000/api/projects");
    setProjects(response.data);
  };

  const removeUser = (id) => {
    console.log(`Frontend action: Button clicked to remove user ID: ${id}`);
    axios.delete("http://localhost:3000/api/users/" + id).then((response) => {
      console.log(response.data);
      setUsers(users.filter((user) => user._id !== id));
    });
  };

  const SuccessAlert = () => (
    <div
      className="alert bg-green-100 dark:bg-green-900 border-l-4 border-green-500 dark:border-green-700 text-green-900 dark:text-green-100 hover:bg-green-200 dark:hover:bg-green-800"
      style={{
        padding: "1rem",
        marginBottom: "1rem",
        borderRadius: "0.25rem",
        backgroundColor: "#dcfce7", // Light green background
        borderLeft: "4px solid #10b981", // Green border
        color: "#065f46", // Dark green text
        display: "flex",
        alignItems: "center",
        position: "fixed", // Position fixed to float above content
        top: "20px",
        right: "20px",
        zIndex: "100",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      }}
    >
      {/* SVG Icon for Checkmark/Info (You might need to define this if it's not already) */}
      <svg
        className="h-5 w-5 flex-shrink-0 mr-2"
        style={{
          color: "#10b981",
          height: "1.25rem",
          width: "1.25rem",
          marginRight: "0.5rem",
        }}
        stroke="currentColor"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
      <p className="text-xs font-semibold">User has been approved!</p>
    </div>
  );

  const RejectAlert = () => (
    <div className="alert bg-red-100 dark:bg-red-900 border-l-4 border-red-500 dark:border-red-700 text-red-900 dark:text-red-100 hover:bg-red-200 dark:hover:bg-red-800">
      <svg
        className="h-5 w-5 flex-shrink-0 mr-2 text-red-600"
        stroke="currentColor"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
      <p className="text-xs font-semibold">User has been rejected</p>
    </div>
  );

  const handleApprove = async (userId) => {
    try {
      await axios.patch(`http://localhost:3000/api/users/${userId}`, {
        userStatus: "Approved",
      });
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, userStatus: "Approved" } : user
        )
      );
      setShowSuccessAlert(true);
      setTimeout(() => {
        setShowSuccessAlert(false);
      }, 3000);
      await fetchUsers();
    } catch (err) {
      console.error("Failed to update user status", err);
    }
  };

  const handleReject = async (userId) => {
    try {
      await axios.patch(`http://localhost:3000/api/users/${userId}`, {
        userStatus: "Rejected",
      });
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, userStatus: "Rejected" } : user
        )
      );
      setshowRejectAlert(true);
      setTimeout(() => {
        setshowRejectAlert(false);
      }, 3000);
      await fetchUsers();
      await removeUser(userId);
    } catch (err) {
      console.error("Failed to update user status", err);
    }
  };

  // Project handlers
  const handleProjectApprove = async (projectId) => {
    try {
      await axios.patch(
        `http://localhost:3000/api/projects/${projectId}/approve`
      );
      setShowSuccessAlert(true);
      setTimeout(() => {
        setShowSuccessAlert(false);
      }, 3000);
      await fetchProjects();
    } catch (err) {
      console.error("Failed to approve project", err);
    }
  };

  const handleProjectReject = async (projectId) => {
    try {
      await axios.patch(
        `http://localhost:3000/api/projects/${projectId}/reject`
      );
      setshowRejectAlert(true);
      setTimeout(() => {
        setshowRejectAlert(false);
      }, 3000);
      await fetchProjects();
    } catch (err) {
      console.error("Failed to reject project", err);
    }
  };

  const removeProject = (projectId) => {
    console.log(
      `Frontend action: Button clicked to remove project ID: ${projectId}`
    );
    axios
      .delete("http://localhost:3000/api/projects/" + projectId)
      .then((response) => {
        console.log(response.data);
        setProjects(projects.filter((project) => project._id !== projectId));
      });
  };

  return (
    <div className="admin-page-container">
      {showSuccessAlert && <SuccessAlert />}
      {showRejectAlert && <RejectAlert />}
      <div className="content-card">
        {/* Tab Navigation */}
        <div className="tab-container">
          <button
            onClick={() => setActiveTab("overview")}
            className={`tab-button ${
              activeTab === "overview" ? "active" : "inactive"
            }`}
          >
            <span>Overview</span>
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`tab-button ${
              activeTab === "users" ? "active" : "inactive"
            }`}
          >
            <span>Users</span>
          </button>
          <button
            onClick={() => setActiveTab("companies")}
            className={`tab-button ${
              activeTab === "companies" ? "active" : "inactive"
            }`}
          >
            <span>Companies</span>
          </button>
          <button
            onClick={() => setActiveTab("projects")}
            className={`tab-button ${
              activeTab === "projects" ? "active" : "inactive"
            }`}
          >
            <span>Projects</span>
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`tab-button ${
              activeTab === "reviews" ? "active" : "inactive"
            }`}
          >
            <span>Reviews</span>
          </button>
        </div>

        {activeTab === "overview" && (
          <div>
            <div className="dashboard-container">
              {/* <h1 className="dashboard-title">Dashboard Overview</h1> */}
              <SectionHeader title="Dashbaord Overview" />
              <p className="dashboard-subtitle">
                Welcome back! Here's what's happening with InternHunt today.
              </p>

              <div className="dashboard-cards">
                <div className="dashboard-card">
                  <span className="card-title">Total Users</span>
                  <span className="card-value">{usernumber}</span>
                  {/* <span className="card-growth">+12%</span> */}
                </div>
                <div className="dashboard-card">
                  <span className="card-title">Pending Approvals</span>
                  <span className="card-value">{pendingapprovals}</span>
                  {/* <span className="card-description">8 users, 15 projects</span> */}
                </div>
                <div className="dashboard-card">
                  <span className="card-title">Active Companies</span>
                  <span className="card-value">{approvedCompanies.length}</span>
                  {/* <span className="card-growth">+8%</span> */}
                </div>
                <div className="dashboard-card">
                  <span className="card-title">Total Projects</span>
                  <span className="card-value">{approvedProjects.length}</span>
                  {/* <span className="card-growth">+23%</span> */}
                </div>
              </div>

              <div className="dashboard-main">
                <div className="quick-stats">
                  <h2>Quick Stats</h2>
                  <div className="stat-item">
                    <span>Approval Rate</span>
                    <span className="stat-value green">
                      {calculateApprovalRate()}%
                    </span>
                  </div>
                  <div className="stat-item">
                    <span>Avg. Response Time</span>
                    <span className="stat-value blue">
                      {calculateAvgResponseTime()} hours
                    </span>
                  </div>
                  <div className="stat-item">
                    <span>Active Projects</span>
                    <span className="stat-value purple">
                      {getActiveProjectsCount()}
                    </span>
                  </div>
                </div>
                <div className="recent-activity">
                  <h2>Recent Activity</h2>
                  <ul>
                    {(notifications.length
                      ? notifications.map((n) => ({
                          icon:
                            n.type === "user_registration"
                              ? "👤"
                              : n.type === "project_submission"
                              ? "📋"
                              : n.type === "project_approval"
                              ? "🚀"
                              : "ℹ️",
                          message: n.message,
                          detail: n.detail,
                          time: new Date(n.createdAt),
                          _id: n._id,
                        }))
                      : generateRecentActivity()
                    ).map((activity, index) => (
                      <li key={activity._id || index}>
                        <span className="dot">{activity.icon}</span>
                        <span>{activity.message}</span>
                        <span className="activity-detail">{activity.detail}</span>
                        <span className="activity-time">{formatTimeAgo(activity.time)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div>
            {loading ? (
              <p className="loading-text">
                <span>Loading…</span>
              </p>
            ) : (
              <>
                <SectionHeader title="Pending For Approval" />
                <div className="table-wrapper">
                  <table className="user-table">
                    <thead>
                      <tr className="table-header-row">
                        <th className="table-heading">
                          <span>Name</span>
                        </th>
                        <th className="table-heading">
                          <span>Email</span>
                        </th>
                        <th className="table-heading">
                          <span>Role</span>
                        </th>
                        <th className="table-heading">
                          <span>Status</span>
                        </th>
                        <th className="table-heading">
                          <span>Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingUsers.map((u) => (
                        <tr key={u.id} className="table-body-row">
                          <td className="table-data">
                            <span className="name-table">{u.username}</span>
                          </td>
                          <td className="table-data">
                            <span>{u.email}</span>
                          </td>
                          <td className="table-data">
                            <span>{u.userType}</span>
                          </td>
                          <td className="table-data">
                            <span>{u.userStatus}</span>
                          </td>
                          <td className="table-data">
                            <div className="approval-buttons-container">
                              <button
                                className="approval-btn approve"
                                onClick={() => {
                                  handleApprove(u._id);
                                }}
                              >
                                <CheckIcon size="1.25rem" />
                                <span>Approve</span>
                              </button>
                              <button
                                className="approval-btn reject"
                                onClick={() => handleReject(u._id)}
                              >
                                <XIcon size="1.25rem" />
                                <span>Reject</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <hr />

                <SectionHeader title="All Users" />
                <div className="table-wrapper">
                  <table className="user-table">
                    <thead>
                      <tr className="table-header-row">
                        <th className="table-heading">
                          <span>Name</span>
                        </th>
                        <th className="table-heading">
                          <span>Email</span>
                        </th>
                        <th className="table-heading">
                          <span>Role</span>
                        </th>
                        <th className="table-heading">
                          <span>Status</span>
                        </th>
                        <th className="table-heading">
                          <span>Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {approvedUsers.map((u) => (
                        <tr key={u.id} className="table-body-row">
                          <td className="table-data">
                            <span className="name-table">{u.username}</span>
                          </td>
                          <td className="table-data">
                            <span>{u.email}</span>
                          </td>
                          <td className="table-data">
                            <span>{u.userType}</span>
                          </td>
                          <td className="table-data">
                            <span>{u.userStatus}</span>
                          </td>
                          <td className="table-data">
                            <button
                              onClick={() => removeUser(u._id)}
                              className="action-button"
                            >
                              <TrashIcon size="1rem" />
                              <span>Remove</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === "companies" && (
          <div>
            {loading ? (
              <p className="loading-text">
                <span>Loading…</span>
              </p>
            ) : (
              <>
                <SectionHeader title="Pending For Approval" />
                <div className="table-wrapper">
                  <table className="user-table">
                    <thead>
                      <tr className="table-header-row">
                        <th className="table-heading">
                          <span>Name</span>
                        </th>
                        <th className="table-heading">
                          <span>Email</span>
                        </th>
                        <th className="table-heading">
                          <span>Role</span>
                        </th>
                        <th className="table-heading">
                          <span>Status</span>
                        </th>
                        <th className="table-heading">
                          <span>Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingCompanies.map((u) => (
                        <tr key={u.id} className="table-body-row">
                          <td className="table-data">
                            <span className="name-table">{u.username}</span>
                          </td>
                          <td className="table-data">
                            <span>{u.email}</span>
                          </td>
                          <td className="table-data">
                            <span>{u.userType}</span>
                          </td>
                          <td className="table-data">
                            <span>{u.userStatus}</span>
                          </td>
                          <td className="table-data">
                            <div className="approval-buttons-container">
                              <button
                                className="approval-btn approve"
                                onClick={() => {
                                  handleApprove(u._id);
                                }}
                              >
                                <CheckIcon size="1.25rem" />
                                <span>Approve</span>
                              </button>
                              <button
                                className="approval-btn reject"
                                onClick={() => handleReject(u._id)}
                              >
                                <XIcon size="1.25rem" />
                                <span>Reject</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <hr />

                <SectionHeader title="All Companies" />
                <div className="table-wrapper">
                  <table className="user-table">
                    <thead>
                      <tr className="table-header-row">
                        <th className="table-heading">
                          <span>Name</span>
                        </th>
                        <th className="table-heading">
                          <span>Email</span>
                        </th>
                        <th className="table-heading">
                          <span>Role</span>
                        </th>
                        <th className="table-heading">
                          <span>Status</span>
                        </th>
                        <th className="table-heading">
                          <span>Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {approvedCompanies.map((u) => (
                        <tr key={u.id} className="table-body-row">
                          <td className="table-data">
                            <span className="name-table">{u.username}</span>
                          </td>
                          <td className="table-data">
                            <span>{u.email}</span>
                          </td>
                          <td className="table-data">
                            <span>{u.userType}</span>
                          </td>
                          <td className="table-data">
                            <span>{u.userStatus}</span>
                          </td>
                          <td className="table-data">
                            <button
                              onClick={() => removeUser(u._id)}
                              className="action-button"
                            >
                              <TrashIcon size="1rem" />
                              <span>Remove</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === "projects" && (
          <div>
            {loading ? (
              <p className="loading-text">
                <span>Loading…</span>
              </p>
            ) : (
              <>
                <SectionHeader title="Pending For Approval" />
                <div className="project-stats">
                  <div className="stat-card">
                    <span className="stat-number">
                      {pendingProjects.length}
                    </span>
                    <span className="stat-label">Pending Projects</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-number">
                      {approvedProjects.length}
                    </span>
                    <span className="stat-label">Approved Projects</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-number">
                      ₹
                      {approvedProjects
                        .reduce((sum, p) => sum + (p.salary || 0) * 0.1, 0)
                        .toLocaleString("en-IN", { maximumFractionDigits: 1 })}
                    </span>
                    <span className="stat-label">Total Commission</span>
                  </div>
                </div>
                <div className="table-wrapper">
                  <table className="user-table">
                    <thead>
                      <tr className="table-header-row">
                        <th className="table-heading">
                          <span>Project Title</span>
                        </th>
                        <th className="table-heading">
                          <span>Company</span>
                        </th>
                        <th className="table-heading">
                          <span>Status</span>
                        </th>
                        <th className="table-heading">
                          <span>Commission</span>
                        </th>
                        <th className="table-heading">
                          <span>Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingProjects.map((project) => (
                        <tr key={project._id} className="table-body-row">
                          <td className="table-data">
                            <div className="project-info">
                              <div className="project-avatar">
                                {project.company_name === "Microsoft" && (
                                  <img
                                    src="/images/microsoft (1).png"
                                    alt="Microsoft"
                                  />
                                )}
                                {project.company_name === "Google" && (
                                  <img src="/images/search.png" alt="Google" />
                                )}
                                {project.company_name === "Capgemini" && (
                                  <img src="/images/capegemini.jpg" />
                                )}
                                {project.company_name === "Amazon" && (
                                  <img src="/images/aws.png" alt="Amazon" />
                                )}
                                {project.company_name === "Apple" && (
                                  <img
                                    src="/images/apple-logo.png"
                                    alt="Apple"
                                  />
                                )}
                                {project.company_name === "Meta" && (
                                  <img src="/images/meta (2).png" alt="Meta" />
                                )}
                                {project.company_name === "Netflix" && (
                                  <img
                                    src="/images/netflix.png"
                                    alt="Netflix"
                                  />
                                )}
                                {project.company_name ===
                                  "Tata Consultancy Services" && (
                                  <img src="/images/tata-logo.jpg" alt="Tata" />
                                )}
                                {![
                                  "Microsoft",
                                  "Google",
                                  "Amazon",
                                  "Apple",
                                  "Meta",
                                  "Netflix",
                                ].includes(project.company_name) && (
                                  <div className="default-company-avatar">
                                    {project.company_name.charAt(0)}
                                  </div>
                                )}
                              </div>
                              <div className="project-details">
                                <span className="name-table">
                                  {project.project_title}
                                </span>
                                <span className="project-description">
                                  {project.project_description ||
                                    "No description available"}
                                </span>
                                <div className="project-meta">
                                  <span className="project-duration">
                                    ⏱️ {project.time_duration}
                                  </span>
                                  {project.skills_required &&
                                    project.skills_required.length > 0 && (
                                      <span className="project-skills">
                                        {project.skills_required
                                          .slice(0, 2)
                                          .join(", ")}
                                      </span>
                                    )}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="table-data">
                            <div className="company-info">
                              <span className="company-name">
                                {project.company_name}
                              </span>
                              <span className="company-type">Tech Company</span>
                            </div>
                          </td>
                          <td className="table-data">
                            <span className={`status-badge pending`}>
                              {project.projectApproval}
                            </span>
                          </td>
                          <td className="table-data">
                            <span className="commission-amount">
                              ₹
                              {((project.salary || 0) * 0.1).toLocaleString(
                                "en-IN",
                                { maximumFractionDigits: 0 }
                              )}
                            </span>
                            <span className="commission-note">
                              10% of ₹
                              {(project.salary || 0).toLocaleString("en-IN")}
                            </span>
                          </td>
                          <td className="table-data">
                            <div className="approval-buttons-container">
                              <button
                                className="approval-btn approve"
                                onClick={() => {
                                  handleProjectApprove(project._id);
                                }}
                              >
                                <CheckIcon size="1.25rem" />
                                <span>Approve</span>
                              </button>
                              <button
                                className="approval-btn reject"
                                onClick={() => handleProjectReject(project._id)}
                              >
                                <XIcon size="1.25rem" />
                                <span>Reject</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <hr />

                <SectionHeader title="All Projects" />
                <div className="table-wrapper">
                  <table className="user-table">
                    <thead>
                      <tr className="table-header-row">
                        <th className="table-heading">
                          <span>Project Title</span>
                        </th>
                        <th className="table-heading">
                          <span>Company</span>
                        </th>
                        <th className="table-heading">
                          <span>Status</span>
                        </th>
                        <th className="table-heading">
                          <span>Commission</span>
                        </th>
                        <th className="table-heading">
                          <span>Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {approvedProjects.map((project) => (
                        <tr key={project._id} className="table-body-row">
                          <td className="table-data">
                            <div className="project-info">
                              <div className="project-avatar">
                                {project.company_name === "Microsoft" && (
                                  <img
                                    src="/images/microsoft (1).png"
                                    alt="Microsoft"
                                  />
                                )}
                                {project.company_name === "Google" && (
                                  <img src="/images/search.png" alt="Google" />
                                )}
                                {project.company_name === "Capgemini" && (
                                  <img src="/images/capegemini.jpg" />
                                )}
                                {project.company_name === "Amazon" && (
                                  <img src="/images/aws.png" alt="Amazon" />
                                )}
                                {project.company_name === "Apple" && (
                                  <img
                                    src="/images/apple-logo.png"
                                    alt="Apple"
                                  />
                                )}
                                {project.company_name === "Meta" && (
                                  <img src="/images/meta (2).png" alt="Meta" />
                                )}
                                {project.company_name === "Netflix" && (
                                  <img
                                    src="/images/netflix.png"
                                    alt="Netflix"
                                  />
                                )}
                                {project.company_name ===
                                  "Tata Consultancy Services" && (
                                  <img src="/images/tata-logo.jpg" alt="Tata" />
                                )}
                                {![
                                  "Microsoft",
                                  "Google",
                                  "Amazon",
                                  "Apple",
                                  "Meta",
                                  "Netflix",
                                ].includes(project.company_name) && (
                                  <div className="default-company-avatar">
                                    {project.company_name.charAt(0)}
                                  </div>
                                )}
                              </div>
                              <div className="project-details">
                                <span className="name-table">
                                  {project.project_title}
                                </span>
                                <span className="project-description">
                                  {project.project_description ||
                                    "No description available"}
                                </span>
                                <div className="project-meta">
                                  <span className="project-duration">
                                    ⏱️ {project.time_duration}
                                  </span>
                                  {project.skills_required &&
                                    project.skills_required.length > 0 && (
                                      <span className="project-skills">
                                        {project.skills_required
                                          .slice(0, 2)
                                          .join(", ")}
                                      </span>
                                    )}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="table-data">
                            <div className="company-info">
                              <span className="company-name">
                                {project.company_name}
                              </span>
                              <span className="company-type">Tech Company</span>
                            </div>
                          </td>
                          <td className="table-data">
                            <span className={`status-badge approved`}>
                              {project.projectApproval}
                            </span>
                          </td>
                          <td className="table-data">
                            <span className="commission-amount">
                              ₹
                              {((project.salary || 0) * 0.1).toLocaleString(
                                "en-IN",
                                { maximumFractionDigits: 0 }
                              )}
                            </span>
                            <span className="commission-note">
                              10% of ₹
                              {(project.salary || 0).toLocaleString("en-IN")}
                            </span>
                          </td>
                          <td className="table-data">
                            <button
                              onClick={() => removeProject(project._id)}
                              className="action-button"
                            >
                              <TrashIcon size="1rem" />
                              <span>Remove</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === "reviews" && (
          <div>
            {loading ? (
              <p className="loading-text">
                <span>Loading…</span>
              </p>
            ) : (
              <>
                <SectionHeader title="Reviews...." />
                {feedbackData.map((feedback) => (
                  <div class="ui-card" key={feedback._id}>
                  <div class="ui-header">
                    <span class="dot-red"></span>
                    <span class="dot-yellow"></span>
                    <span class="dot-green"></span>
                  </div>
                  <span class="ui-title">{feedback.reviewer_name}</span>
                  <p class="ui-text">
                    {feedback.source} || {(new Date(feedback.updatedAt)).toLocaleDateString()}
                  </p>
                  <div class="ui-editor">
                    <h1>{feedback.review_text}</h1>
                  </div>
                </div>
                )
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
