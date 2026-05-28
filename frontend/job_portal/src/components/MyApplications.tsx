import { useEffect, useState } from "react";
import CandidateNavbar from "./candidateNavbar";
import { getApplications } from "../services/applicationService";

const MyApplications = () => {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getApplications();
        setApps(data);
      } catch (err) {
        console.error("Error fetching applications:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="dashboard">
      <CandidateNavbar />

      <div className="content">
        <h2 className="heading">My Applications</h2>
        <p className="sub-heading">Track the status of your submitted job applications</p>

        {loading ? (
          <div className="loading-state">
            <p className="pulse">Loading applications...</p>
          </div>
        ) : apps.length === 0 ? (
          <div className="no-data-box">
            <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>💼</div>
            <p>You haven't submitted any job applications yet.</p>
          </div>
        ) : (
          <div className="job-list-vertical">
            {apps.map((app) => (
              <div
                key={app.id}
                className="job-card"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "20px 28px",
                }}
              >
                <div>
                  <h3 style={{ fontSize: "1.25rem", marginBottom: "6px" }}>{app.job.jobTitle}</h3>
                  <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--text-muted)" }}>
                    Company: <strong style={{ color: "var(--text-main)" }}>{app.job.recruiter?.companyName || "N/A"}</strong>
                  </p>
                  <p style={{ margin: "4px 0 0 0", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    Applied on: {new Date(app.appliedAt).toLocaleDateString()}
                  </p>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                  <span className={`status-tag ${app.status.toLowerCase()}`}>
                    {app.status}
                  </span>
                  
                  {app.matchingScore !== undefined && (
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>AI Match Score</span>
                      <strong style={{ color: "var(--accent)" }}>{app.matchingScore.toFixed(0)}%</strong>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;