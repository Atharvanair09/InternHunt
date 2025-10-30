import React, { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import "./ProjectListings.css";

export const ProjectAdd = ({ mentorList }) => {
  const [basicReqs, setBasicReqs] = useState([""]);
  const [milestones, setMilestones] = useState([""]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [projectTitle, setProjectTitle] = useState();
  const [stipend, setStipend] = useState();
  const [projectDescription, setProjectDescription] = useState();
  const [timeDuration, setTimeDuration] = useState({
    startDate: "",
    endDate: "",
  });
  const [selectedMentors, setSelectedMentors] = useState([]);
  const [projectStatus, setProjectStatus] = useState();
  const selected = [];
  const [visible, setVisible] = useState(false);
  console.log("ProjectAdd: ", mentorList);

  const postProject = async (formData) => {
    try {
      var startDate = new Date(formData.timeDuration.startDate);
      var endDate = new Date(formData.timeDuration.endDate);
      const diffInMs = endDate - startDate;
      var diffInDays = diffInMs / (1000 * 60 * 60 * 24);
      var diffInMonths = diffInDays / 30.44 + " months";
      if (!Number.isInteger(diffInMonths)) {
        diffInMonths = diffInDays + " days";
      }
      // Transform formData to match backend schema
      const projectData = {
        project_title: formData.projectTitle,
        project_description: formData.projectDescription,
        company_name: formData.company_name,
        skills_required: formData.selectedSkills,
        basic_requirements: formData.basicReqs.filter(
          (req) => req.trim() !== ""
        ), // Remove empty requirements
        salary: parseInt(formData.stipend),
        project_status: "Upcoming",
        time_duration: `${diffInMonths} `,
        number_of_applicants_starts_on: formData.timeDuration.endDate,
        project_milestones: formData.milestones.filter(
          (milestone) => milestone.trim() !== ""
        ), // Remove empty milestones
        mentor:
          formData.selectedMentors.length > 0
            ? mentorList.find(
                (mentor) =>
                  (mentor._id || mentor.mentor_name) ===
                  formData.selectedMentors[0]
              )
            : null,
      };

      console.log("Sending project data to backend:", projectData);

      const response = await fetch("http://localhost:3000/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies for authentication
        body: JSON.stringify(projectData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Project created successfully:", result);
        alert("Project posted successfully!");
        // Reset form or redirect
        window.location.reload(); // Simple refresh for now
      } else {
        const error = await response.json();
        console.error("Error creating project:", error);
        alert("Failed to create project. Please try again.");
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Network error. Please check your connection and try again.");
    }
  };

  function handleProjectSubmit(e) {
    e.preventDefault();

    // Get company_name from the first mentor (since all mentors belong to the same company)
    const company_name =
      mentorList.length > 0 ? mentorList[0].company_name : "";

    const formData = {
      projectTitle,
      projectDescription,
      selectedSkills,
      basicReqs,
      stipend,
      projectStatus,
      timeDuration,
      milestones,
      selectedMentors,
      company_name,
    };
    console.log("Project Add Data: ", formData);
    postProject(formData);
  }

  function handleAddBasicReq() {
    setBasicReqs((prev) => [...prev, ""]);
  }
  function handleBasicReqChange(e, idx) {
    const updated = [...basicReqs];
    updated[idx] = e.target.value;
    setBasicReqs(updated);
  }
  function handleAddMilestone() {
    setMilestones((prev) => [...prev, ""]);
  }
  function handleMilestoneChange(e, idx) {
    const updated = [...milestones];
    updated[idx] = e.target.value;
    setMilestones(updated);
  }
  function handleSkillsChange(e) {
    const options = e.target.options;
    for (let i = 0; i < options.length; i++)
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    var previousSelected = selectedSkills;
    setSelectedSkills([...previousSelected, ...selected]);
  }
  function removeListItem(idx) {
    if (basicReqs.length > 1) {
      const updated = [...basicReqs];
      updated.splice(idx, 1);
      setBasicReqs(updated);
    }
  }
  function removeProjectItems(idx) {
    if (milestones.length > 1) {
      const updated = [...milestones];
      updated.splice(idx, 1);
      setMilestones(updated);
    }
  }

  // Time duration handlers
  function handleStartDateChange(e) {
    const todayDate = new Date();
    if (
      new Date(e.target.value) === todayDate ||
      new Date(e.target.value) > todayDate
    ) {
      setTimeDuration((prev) => ({
        ...prev,
        startDate: e.target.value,
      }));
    } else {
      alert("Enter a proper Date");
    }
  }

  function handleEndDateChange(e) {
    const startingDate = timeDuration.startDate;
    console.log(startingDate);
    if (new Date(e.target.value) > new Date(startingDate)) {
      setTimeDuration((prev) => ({
        ...prev,
        endDate: e.target.value,
      }));
    } else {
      alert("You cannot have the End Date be equal to/less than starting date");
    }
  }

  // Mentor selection handlers
  function handleMentorSelection(mentorId, isSelected) {
    if (isSelected) {
      setSelectedMentors((prev) => [...prev, mentorId]);
    } else {
      setSelectedMentors((prev) => prev.filter((id) => id !== mentorId));
    }
  }

  function handleConfirmMentorSelection() {
    console.log("Selected mentors:", selectedMentors);
    setShowPopup(false);
  }

  function PopUpMentor({ showPopup, closePopup }) {
    if (!showPopup) return null;
    return (
      <div className="app-container">
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Choose Mentors For This Project</h2>
            <div className="mentor-list">
              {mentorList.map((mentor, index) => (
                <div className="mentor-item" key={mentor._id || index}>
                  <div className="mentor-item-1">
                    <input
                      type="checkbox"
                      id={`mentor-${mentor._id || index}`}
                      name={`mentor-${mentor._id || index}`}
                      value={mentor._id || mentor.mentor_name}
                      checked={selectedMentors.includes(
                        mentor._id || mentor.mentor_name
                      )}
                      onChange={(e) =>
                        handleMentorSelection(
                          mentor._id || mentor.mentor_name,
                          e.target.checked
                        )
                      }
                    />
                    <div className="mentor-image"></div>
                    <label htmlFor={`mentor-${mentor._id || index}`}>
                      {mentor.mentor_name}
                    </label>
                  </div>
                  <div className="mentor-item-2">
                    <label htmlFor={`mentor-${mentor._id || index}`}>
                      {mentor.designation}
                    </label>
                    <label htmlFor={`mentor-${mentor._id || index}`}>
                      {mentor.email}
                    </label>
                    <label htmlFor={`mentor-${mentor._id || index}`}>
                      {mentor.number}
                    </label>
                  </div>
                </div>
              ))}
            </div>
            <button className="close-btn" onClick={closePopup}>
              Close
            </button>
            <button
              className="confirm-btn"
              onClick={handleConfirmMentorSelection}
            >
              Confirm Selection
            </button>
          </div>
        </div>
      </div>
    );
  }

  const [showPopup, setShowPopup] = useState(false);
  const openPopup = () => setShowPopup(true);
  const closePopup = () => setShowPopup(false);

  return (
    <div className="project-formcontainer">
      <div className="project-formarea">
        <h1 className="project-formtitle">Post Your Project</h1>
        <form onSubmit={handleProjectSubmit}>
          <div className="project-formgrid">
            <div>
              <div className="project-formgroup">
                <label htmlFor="projecttitle" className="project-formlabel">
                  Project Title
                </label>
                <input
                  placeholder="Enter project title"
                  id="projecttitle"
                  className="project-forminput"
                  type="text"
                  onChange={(e) => {
                    setProjectTitle(e.currentTarget.value);
                  }}
                  required
                />
              </div>
              <div className="project-formgroup">
                <label
                  htmlFor="projectdescription"
                  className="project-formlabel"
                >
                  Project Description
                </label>
                <input
                  placeholder="Enter project description"
                  id="projectdescription"
                  className="project-forminput"
                  type="text"
                  onChange={(e) => {
                    setProjectDescription(e.currentTarget.value);
                  }}
                  required
                />
              </div>
              <div className="project-formgroup">
                <label htmlFor="skillsrequired" className="project-formlabel">
                  Skills Required
                </label>
                <select
                  id="skillsrequired"
                  className="project-forminput"
                  multiple
                  size={5}
                  onChange={handleSkillsChange}
                  required
                >
                  <option value="Python">Python</option>
                  <option value="JavaScript">JavaScript</option>
                  <option value="Java">Java</option>
                  <option value="C++">C++</option>
                  <option value="C#">C#</option>
                  <option value="Ruby">Ruby</option>
                  <option value="Swift">Swift</option>
                  <option value="Kotlin">Kotlin</option>
                  <option value="PHP">PHP</option>
                  <option value="Go">Go</option>
                  <option value="TypeScript">TypeScript</option>
                  <option value="SQL">SQL</option>
                  <option value="Rust">Rust</option>
                  <option value="Dart">Dart</option>
                  <option value="Scala">Scala</option>
                  <option value="Elixir">Elixir</option>
                  <option value="Haskell">Haskell</option>
                  <option value="Lua">Lua</option>
                  <option value="Perl">Perl</option>
                  <option value="MATLAB">MATLAB</option>
                  <option value="Objective-C">Objective-C</option>
                  <option value="Bash">Bash</option>
                  <option value="PowerShell">PowerShell</option>
                  <option value="Elm">Elm</option>
                  <option value="Clojure">Clojure</option>
                  <option value="F#">F#</option>
                  <option value="Groovy">Groovy</option>
                  <option value="CoffeeScript">CoffeeScript</option>
                  <option value="VB.NET">VB.NET</option>
                  <option value="Julia">Julia</option>
                  <option value="Crystal">Crystal</option>
                  <option value="Nim">Nim</option>
                  <option value="Erlang">Erlang</option>
                  <option value="Solidity">Solidity</option>
                  <option value="Apex">Apex</option>
                </select>
                {selectedSkills.length > 0 && (
                  <div className="pp-skill-tags">
                    {selectedSkills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="pp-skill-tag"
                        style={{
                          color: "white",
                          backgroundColor: "#3a9ed3",
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="project-formgroup">
                <label className="project-formlabel">Basic Requirements</label>
                <div className="list-remove-button">
                  {basicReqs.map((req, idx) => (
                    <>
                      <input
                        key={idx}
                        value={req}
                        onChange={(e) => handleBasicReqChange(e, idx)}
                        placeholder="Enter a basic requirement"
                        className="project-forminput"
                        type="text"
                        required
                      />
                      <button
                        onClick={() => {
                          removeListItem(idx);
                        }}
                      >
                        ❌
                      </button>
                    </>
                  ))}
                </div>
                <button
                  type="button"
                  className="project-formgroupbutton"
                  onClick={handleAddBasicReq}
                >
                  Add More
                </button>
              </div>
            </div>
            <div>
              <div className="project-formgroup">
                <label htmlFor="salary" className="project-formlabel">
                  Salary
                </label>
                <input
                  placeholder="Enter salary (e.g., 15000)"
                  id="salary"
                  className="project-forminput"
                  type="number"
                  onChange={(e) => {
                    setStipend(e.currentTarget.value);
                  }}
                  required
                />
              </div>
              <div className="project-formgroup">
                <label htmlFor="timeduration" className="project-formlabel">
                  Time Duration
                </label>
                <label>From: </label>
                <input
                  id="startdate"
                  className="project-forminput"
                  type="date"
                  value={timeDuration.startDate}
                  onChange={handleStartDateChange}
                  required
                />
                <label>To: </label>
                <input
                  id="enddate"
                  className="project-forminput"
                  type="date"
                  value={timeDuration.endDate}
                  onChange={handleEndDateChange}
                  required
                />
              </div>
              <div className="project-formgroup">
                <label className="project-formlabel">Project Milestones</label>
                <div className="list-remove-button">
                  {milestones.map((ms, idx) => (
                    <>
                      <input
                        key={idx}
                        value={ms}
                        onChange={(e) => handleMilestoneChange(e, idx)}
                        placeholder="Enter a milestone"
                        className="project-forminput"
                        type="text"
                        required
                      />
                      <button
                        onClick={() => {
                          removeProjectItems(idx);
                        }}
                      >
                        ❌
                      </button>
                    </>
                  ))}
                </div>
                <button
                  type="button"
                  className="project-formgroupbutton"
                  onClick={handleAddMilestone}
                >
                  Add More
                </button>
              </div>
              <div className="project-formgroup">
                <label htmlFor="mentorname" className="project-formlabel">
                  Mentor Assignment :
                </label>
                <button id="mentorname" onClick={openPopup}>
                  Assign Mentors
                </button>
                {selectedMentors.length > 0 && (
                  <div className="selected-mentors">
                    <h4>Selected Mentors:</h4>
                    {selectedMentors.map((mentorId, index) => {
                      const mentor = mentorList.find(
                        (m) => (m._id || m.mentor_name) === mentorId
                      );
                      return (
                        <span key={index} className="selected-mentor-tag">
                          {mentor ? mentor.mentor_name : mentorId}
                        </span>
                      );
                    })}
                  </div>
                )}
                <PopUpMentor showPopup={showPopup} closePopup={closePopup} />
              </div>
            </div>
          </div>
          <div>
            <button className="project-formbutton" type="submit">
              SUBMIT
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ProjectListings = () => {
  const [projectData, setProjectData] = useState([]);
  const [mentorData, setMentorData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [currentUser, setCurrentUser] = useState(null);
  const [showProjectAddForm, setShowProjectAddForm] = useState(false);
  const [searchParams] = useSearchParams();
  const companyFilter = searchParams.get("company");
  const statusOptions = ["All", "Active", "Upcoming"];
  console.log(currentUser);
  const mentorList = projectData;
  var company_mentors = [];
  company_mentors = mentorData.filter((mentor) => {
    return (
      mentor.company_name &&
      currentUser?.username &&
      mentor.company_name.toLowerCase() === currentUser.username.toLowerCase()
    );
  });
  console.log("Mentor-Data", company_mentors);
  console.log("Mentor: ", mentorList.length);
  console.log(showProjectAddForm);

  var companyProjects = [];
  companyProjects = projectData.filter((proj) => {
    return (
      proj.company_name.toLowerCase() === currentUser?.username.toLowerCase()
    );
  });
  var constantProject = [];

  console.log("Projects: ", companyProjects);

  useEffect(() => {
    fetch("http://localhost:3000/api/projects")
      .then((res) => res.json())
      .then((data) => setProjectData(data))
      .catch((err) => console.error("Error fetching projects:", err));
  }, []);

  useEffect(() => {
    console.log("🔍 Fetching mentors from API...");
    fetch("http://localhost:3000/api/mentors")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setMentorData(data);
      })
      .catch((err) => {
        console.error("❌ Error fetching mentors:", err);
        console.error("❌ Error details:", err.message);
      });
  }, []);

  // Remember to check on Monday(27th)
  useEffect(() => {
    projectData.forEach((element) => {
      var currentDate = new Date().toISOString().split("T")[0];
      var projectDate = new Date(element.number_of_applicants_starts_on)
        .toISOString()
        .split("T")[0];
      console.log(currentDate, projectDate);
      console.log("Fetching status for project id:", element._id);
      if (currentDate === projectDate) {
        console.log("Fetcher status for project id:", element._id);
        if (element._id) {
          console.log("Fetched status for project id:", element._id);
          fetch(`http://localhost:3000/api/projects/${element._id}/status`, {
            method: "PATCH",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify({ status: "Active" }),
          })
            .then((response) => response.json())
            .then((data) => {
              console.log("Data: ", data);
            })
            .catch((err) =>
              console.error("Failed to fecth project status: ", err)
            );
        }
      }
    });
  }, [projectData]);

  useEffect(() => {
    fetch("http://localhost:3000/current-user", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setCurrentUser(data.user))
      .catch(() => setCurrentUser(null));
  }, []);

  const filteredProjects = useMemo(() => {
    if (!projectData) return [];
    if (currentUser?.userType === "Company") {
      constantProject = companyProjects;
    } else if (currentUser?.userType === "User") {
      constantProject = projectData;
    }
    const query = searchQuery.trim().toLowerCase();
    return constantProject.filter((p) => {
      const title = (p.project_title || p.title || "").toLowerCase();
      const description = (
        p.project_description ||
        p.description ||
        ""
      ).toLowerCase();
      const statusValue = p.project_status;
      const companyName = (p.company_name || "").toLowerCase();

      const matchesQuery =
        !query || title.includes(query) || description.includes(query);
      const matchesStatus =
        activeFilter === "All" || statusValue === activeFilter;
      const matchesCompany =
        !companyFilter || companyName.includes(companyFilter.toLowerCase());

      return matchesQuery && matchesStatus && matchesCompany;
    });
    // console.log("Current Projects: " constantProject);
  }, [
    projectData,
    searchQuery,
    activeFilter,
    companyProjects,
    constantProject,
    companyFilter,
  ]);

  console.log("Filtered Projects: ", filteredProjects);

  var displayedProjects = filteredProjects.filter((proj)=>{
    return proj.projectApproval === "Approved"
  });
  console.log("Displayed Projects: ", displayedProjects);

  return (
    <div
      style={{
        margin: "0 auto",
        padding: "5rem",
        backgroundColor: "#ffffff",
        color: "#00000",
        minHeight: "100vh",
        fontFamily: "Instrument Serif, sans-serif",
      }}
    >
      {showProjectAddForm &&
        mentorList.length > 0 &&
        currentUser?.userStatus === "Approved" && (
          <ProjectAdd mentorList={company_mentors} />
        )}
      {/* Header */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
          flexWrap: "wrap",
          gap: "1rem",
          marginTop: "3rem",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "5rem",
              margin: 0,
              color: "#00000",
            }}
          >
            Project Listings
          </h1>
          <p
            style={{
              fontSize: "1.75rem",
              margin: 0,
              color: "#8b949e",
            }}
          >
            Manage your project listings
          </p>
        </div>
        <button
          className="cssbuttons-io-button"
          hidden={currentUser?.userType !== "Company"}
          onClick={() => {
            setShowProjectAddForm(true);
          }}
        >
          Post a Project
          <div className="icon">
            <svg
              height="24"
              width="24"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0 0h24v24H0z" fill="none"></path>
              <path
                d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
                fill="currentColor"
              ></path>
            </svg>
          </div>
        </button>
        {/* </Link> */}
      </header>

      {/* Filter Bar */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          flexWrap: "wrap",
          marginBottom: "2rem",
        }}
      >
        <div style={{ flexGrow: 1 }}>
          <input
            type="text"
            placeholder="Search Projects By Title or Description..."
            style={{
              width: "98%",
              padding: "10px",
              backgroundColor: "#fffff",
              border: "1px solid gray",
              borderRadius: "6px",
              color: "#00000",
              outline: "none",
              fontSize: "20px",
              height: "60px",
            }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {statusOptions.map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                style={{
                  backgroundColor: isActive ? "#2196f3" : "#161b22",
                  color: isActive ? "white" : "#8b949e",
                  padding: "10px 15px",
                  border: `1px solid ${isActive ? "#2196f3" : "#30363d"}`,
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "1.5rem",
                  fontWeight: "300",
                }}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </div>

      {/* Company Filter Indicator */}
      {companyFilter && (
        <div
          style={{
            backgroundColor: "#e3f2fd",
            border: "1px solid #2196f3",
            borderRadius: "8px",
            padding: "1rem",
            marginBottom: "2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "1.2rem", color: "#1976d2" }}>
              🔍 Filtered by company:
            </span>
            <span
              style={{
                fontSize: "1.2rem",
                fontWeight: "600",
                color: "#1976d2",
                textTransform: "capitalize",
              }}
            >
              {companyFilter}
            </span>
          </div>
          <button
            onClick={() => window.history.back()}
            style={{
              backgroundColor: "#2196f3",
              color: "white",
              border: "none",
              borderRadius: "4px",
              padding: "0.5rem 1rem",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            Clear Filter
          </button>
        </div>
      )}

      {/* Project Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(500px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {displayedProjects.map((project) => (
          <div
            key={project._id}
            style={{
              border: "1px solid gray",
              borderRadius: "12px",
              padding: "1.5rem",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
            }}
          >
            {/* Status Badges */}
            <div
              style={{
                display: "flex",
                gap: "8px",
                marginBottom: "1rem",
              }}
            >
              <span
                style={{
                  backgroundColor: "#22c55e",
                  color: "#fff",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontSize: "1rem",
                  fontWeight: "300",
                }}
              >
                Paid
              </span>
              <span
                style={{
                  backgroundColor:
                    project.status === "Active" ? "#22c55e" : "#f59e0b",
                  color: "#fff",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontSize: "1rem",
                  fontWeight: "300",
                }}
              >
                {project.project_status}
              </span>
            </div>

            {/* Title */}
            <h3
              style={{
                fontSize: "1.75rem",
                fontWeight: "600",
                marginBottom: "0.5rem",
                color: "#00000",
              }}
            >
              {project.project_title}
            </h3>

            {/* Company Name */}
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: "500",
                marginBottom: "0.5rem",
                color: "#00000",
              }}
            >
              {project.company_name}
            </h3>

            {/* Description */}
            <p
              style={{
                fontSize: "1.25rem",
                color: "#8b949e",
                lineHeight: "1.4",
                marginBottom: "1rem",
              }}
            >
              {project.project_description}
            </p>

            {/* Details Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
                fontSize: "1.25rem",
                marginBottom: "1.5rem",
              }}
            >
              <div>
                <span style={{ color: "#00000", fontWeight: "600" }}>
                  {project.salary || "₹0"}
                </span>
                <span style={{ color: "#8b949e" }}> /month</span>
              </div>
              <div>
                <span style={{ color: "#8b949e" }}>Duration: </span>
                <span style={{ color: "#00000", fontWeight: "600" }}>
                  {project.time_duration}
                </span>
              </div>
              <div>
                <span style={{ color: "#00000", fontWeight: "600" }}>
                  {project.applicants}
                </span>
                <span style={{ color: "#8b949e" }}> applications</span>
              </div>
              <div>
                <span style={{ color: "#00000", fontWeight: "600" }}>
                  {project.selected_applicants}
                </span>
                <span style={{ color: "#8b949e" }}> selected</span>
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <span style={{ color: "#8b949e" }}>Deadline: </span>
                <span style={{ color: "#00000" }}>
                  {new Date(
                    project.number_of_applicants_starts_on
                  ).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
              }}
            >
              <button
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#2196f3",
                  color: "#fff",
                  border: "1px solid #2196f3",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "300",
                  fontSize: "1.25rem",
                }}
              >
                <a
                  href={`/projects/${project._id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  Manage
                </a>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectListings;
