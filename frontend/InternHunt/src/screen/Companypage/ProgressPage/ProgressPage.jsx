import React from "react";
import "./ProgressPage.css";

const ProgressPage = () => {
  return (
    <div className="progressPage">
      <main className="progressContainer">
        <div className="progressHeader">
          <h1 className="progressTitle">Progress Tracker</h1>
          <p className="progressSubtitle">
            Monitor your daily achievements and project milestones
          </p>
        </div>

        <div className="progressStatsGrid">
          <div className="progressStatCard">
            <div className="progressStatHeader">
              <div className="progressStatDescription">Overall Progress</div>
            </div>
            <div className="progressStatContent">
              {/* <span className="progressStatIcon textPrimary">📈</span> */}
              <div style={{ flex: 1 }}>
                <div className="progressStatValue">45%</div>
                <div className="progressBar">
                  <div
                    className="progressBarFill progressBarPrimary"
                    style={{ width: "45%" }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="progressStatCard">
            <div className="progressStatHeader">
              <div className="progressStatDescription">Completed Tasks</div>
            </div>
            <div className="progressStatContent">
              {/* <span className="progressStatIcon textSuccess">✅</span> */}
              <div style={{ flex: 1 }}>
                <div className="progressStatValue">18</div>
                <div className="progressStatLabel">this month</div>
              </div>
            </div>
          </div>
          <div className="progressStatCard">
            <div className="progressStatHeader">
              <div className="progressStatDescription">Time Spent</div>
            </div>
            <div className="progressStatContent">
              {/* <span className="progressStatIcon textAccent">⏱️</span> */}
              <div style={{ flex: 1 }}>
                <div className="progressStatValue">32h</div>
                <div className="progressStatLabel">last 7 days</div>
              </div>
            </div>
          </div>
        </div>

        <div className="progressMainGrid">
          <div className="dailyActivityCard">
            <div className="dailyActivityTitle">Daily Activity</div>
            <div className="dailyActivityDescription">
              Your progress over the last 5 days
            </div>
            <div className="dailyActivityItem">
              <div className="dailyActivityHeader">
                <div className="dailyActivityDate">
                  {/* <span className="dailyActivityDateIcon">📅</span> */}
                  Mon, 29 Sep
                </div>
                <div className="dailyActivityStats">3 tasks • 2h 30m</div>
              </div>
              <div className="progressBar" style={{ marginTop: 8 }}>
                <div className="progressBarFill progressBarAccent" style={{ width: "60%" }} />
              </div>
            </div>
            <div className="dailyActivityItem">
              <div className="dailyActivityHeader">
                <div className="dailyActivityDate">
                  {/* <span className="dailyActivityDateIcon">📅</span> */}
                  Tue, 30 Sep
                </div>
                <div className="dailyActivityStats">4 tasks • 3h 10m</div>
              </div>
              <div className="progressBar" style={{ marginTop: 8 }}>
                <div className="progressBarFill progressBarPrimary" style={{ width: "75%" }} />
              </div>
            </div>
          </div>

          <div className="currentTasksCard">
            <div className="currentTasksTitle">Current Tasks</div>
            <div className="currentTasksDescription">What you're working on now</div>

            <div className="taskItem" style={{ marginBottom: 12 }}>
              <span className="taskStatusIndicator taskStatusInProgress" />
              <div className="taskContent">
                <p className="taskTitle">Implement authentication guard for dashboard</p>
                <div className="taskBadges">
                  <span className="badge badgeOutline">auth</span>
                  <span className="badge badgeSecondary">backend</span>
                </div>
              </div>
            </div>

            <div className="taskItem" style={{ marginBottom: 12 }}>
              <span className="taskStatusIndicator taskStatusPending" />
              <div className="taskContent">
                <p className="taskTitle">Wire up project milestones API</p>
                <div className="taskBadges">
                  <span className="badge badgeOutline">api</span>
                  <span className="badge badgeDefault">milestones</span>
                </div>
              </div>
            </div>

            <div className="taskItem">
              <span className="taskStatusIndicator taskStatusCompleted" />
              <div className="taskContent">
                <p className="taskTitle taskTitleCompleted">Refactor ProjectPage styles</p>
                <div className="taskBadges">
                  <span className="badge badgeDestructive">ui</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProgressPage;
