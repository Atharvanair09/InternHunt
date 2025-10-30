import React, { useEffect, useState } from "react";
import "./MentorList.css";

export const MentorList = () => {
  const [projectData, setProjectData] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  console.log(projectData);
  var company_mentors = [];

  // Use the property that actually exists, e.g., 'company'
  company_mentors = projectData.filter(
    (mentor) =>
      mentor.company_name &&
      currentUser?.username &&
      mentor.company_name.toLowerCase() === currentUser.username.toLowerCase()
  );

  console.log("currentUser:", currentUser);

  useEffect(() => {
    console.log("🔍 Fetching mentors from API...");
    fetch("http://localhost:3000/api/mentors")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setProjectData(data);
      })
      .catch((err) => {
        console.error("❌ Error fetching mentors:", err);
        console.error("❌ Error details:", err.message);
      });
  }, []);

  useEffect(() => {
    fetch("http://localhost:3000/current-user", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setCurrentUser(data.user))
      .catch(() => setCurrentUser(null));
  }, []);

  return (
    <div className="mentorListPage">
      <main className="mentorListMain">
        <div className="mentorListHeader">
          <h1 className="mentorListTitle">Expert Mentors</h1>
          <p className="mentorListSubtitle">
            Connect with industry professionals who will guide your journey
          </p>
        </div>
        <div className="mentorGrid">
          {company_mentors.map((mentor) => {
            const initials = (mentor?.mentor_name || "?")
              .split(" ")
              .filter(Boolean)
              .map((n) => n[0])
              .join("")
              .toUpperCase();

            const expertise = Array.isArray(mentor?.expertise_areas)
              ? mentor.expertise_areas
              : [];

            return (
              <div key={mentor?._id || mentor?.id} className="mentorCard">
                <div style={{ textAlign: "center", marginBottom: 12 }}>
                  <div className="mentorAvatar">
                    {mentor?.mentor_image ? (
                      <img
                        src={mentor.mentor_image}
                        alt={mentor.mentor_name}
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: "50%",
                        }}
                      />
                    ) : (
                      initials
                    )}
                  </div>
                  <div className="mentorName">{mentor?.mentor_name}</div>
                  <div className="mentorRole">{mentor?.designation}</div>
                  {mentor?.email && (
                    <div className="mentorCompany">{mentor.email}</div>
                  )}
                </div>

                <div className="mentorExpertiseContainer">
                  <h4 className="mentorExpertiseTitle">Expertise</h4>
                  <div className="mentorExpertiseList">
                    {expertise.length > 0 ? (
                      expertise.map((skill) => (
                        <span key={skill} className="mentorExpertiseItem">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="mentorExpertiseItem">No tags</span>
                    )}
                  </div>
                </div>

                <div className="mentorStats">
                  {typeof mentor?.years_of_experience === "number" && (
                    <span>{mentor.years_of_experience}+ years</span>
                  )}
                </div>

                <div className="mentorActionButtons">
                  <button className="mentorContactButton">✉️ Contact</button>
                  <a
                    href="#"
                    aria-label="LinkedIn"
                    className="mentorLinkedInLink"
                  >
                    in
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};
