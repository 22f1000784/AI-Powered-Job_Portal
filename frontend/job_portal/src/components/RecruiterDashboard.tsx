import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RecruiterNavbar from "./recruiterNavbar";
import { getRecruiterJobs } from "../services/jobService";

const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const data = await getRecruiterJobs();
        setJobs(data);
      } catch (err) {
        console.error("Integration Error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const getWorkTypeLabel = (type: string) => {
    return type ? type.replace("_", " ") : "Full Time";
  };

  return (
    <div className="dashboard">
      <RecruiterNavbar />
      <div className="content">
        {/* Header Section */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <div>
            <h2 className="heading" style={{ marginBottom: "6px" }}>Recruiter Workspace</h2>
            <p className="sub-heading" style={{ margin: 0 }}>Manage listings and track applicant matches</p>
          </div>
          <button className="primary-btn" onClick={() => navigate("/recruiter/post-job")}>
            + Post New Job
          </button>
        </div>

        {/* State Handling: Loading, Empty, or List */}
        {loading ? (
          <div className="loading-state">
            <p className="pulse">Loading your listings...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="no-data-box">
            <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>📋</div>
            <p>You haven't posted any job listings yet.</p>
            <button className="primary-btn" onClick={() => navigate("/recruiter/post-job")} style={{ marginTop: "16px" }}>
              Post Your First Job
            </button>
          </div>
        ) : (
          <div className="job-list">
            {jobs.map((job) => (
              <div key={job.id} className="job-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                    <span className={`status-tag ${job.workType?.toLowerCase() || "full_time"}`}>
                      {getWorkTypeLabel(job.workType)}
                    </span>
                  </div>

                  <h3 style={{ fontSize: "1.35rem", marginBottom: "8px" }}>{job.jobTitle}</h3>
                  <p style={{ fontSize: "0.95rem", marginBottom: "4px" }}>
                    <strong>Role:</strong> {job.role}
                  </p>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "16px" }}>
                    Posted on: {new Date(job.createdAt).toLocaleDateString()}
                  </p>
                  
                  {job.skills && job.skills.length > 0 && (
                    <div style={{ marginBottom: "20px" }}>
                      <div className="skills-list">
                        {job.skills.slice(0, 3).map((skill: string, idx: number) => (
                          <span key={idx} className="skill-tag" style={{ fontSize: "0.8rem", padding: "3px 10px" }}>{skill}</span>
                        ))}
                        {job.skills.length > 3 && (
                          <span className="skill-tag" style={{ fontSize: "0.8rem", padding: "3px 10px", background: "rgba(255, 255, 255, 0.02)" }}>+{job.skills.length - 3}</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="button-group" style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "12px" }}>
                  <button
                    className="primary-btn secondary-btn"
                    onClick={() => navigate(`/recruiter/applicants/${job.id}`)}
                    style={{ width: "100%", justifyContent: "center" }}
                  >
                    View Applicants 👥
                  </button>
                  
                  <button
                    className="primary-btn"
                    onClick={() => navigate(`/recruiter/shortlist/${job.id}`)}
                    style={{ width: "100%", justifyContent: "center" }}
                  >
                    AI Top Matches 🤖
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterDashboard;