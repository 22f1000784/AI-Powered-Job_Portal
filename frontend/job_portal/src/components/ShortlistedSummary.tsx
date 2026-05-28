import { useEffect, useState } from "react";
import RecruiterNavbar from "./recruiterNavbar";
import { getAllShortlisted } from "../services/applicationService";
import { API_BASE_URL } from "../utils/api";

const ShortlistedSummary = () => {
  const [shortlisted, setShortlisted] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAllShortlisted();
        setShortlisted(data);
      } catch (err) {
        console.error("Failed to load shortlisted list", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="dashboard">
      <RecruiterNavbar />
      <div className="content">
        <h2 className="heading">Top Talent Shortlist</h2>
        <p className="sub-heading">Overview of all candidates you have shortlisted across your job listings</p>
        
        {loading ? (
          <div className="loading-state">
            <p className="pulse">Loading shortlist...</p>
          </div>
        ) : (
          <div className="job-list">
            {shortlisted.length === 0 ? (
              <div className="no-data-box" style={{ gridColumn: "1 / -1" }}>
                <p>You haven't shortlisted any candidates yet.</p>
              </div>
            ) : (
              shortlisted.map((app) => (
                <div key={app.id} className="job-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <h3 style={{ fontSize: "1.25rem", marginBottom: "12px" }}>{app.candidate.fullName}</h3>
                    <p style={{ fontSize: "0.9rem", marginBottom: "6px" }}>
                      <strong>Applying for:</strong> {app.job.jobTitle}
                    </p>
                    <p style={{ fontSize: "0.9rem", marginBottom: "16px" }}>
                      <strong>Email:</strong> {app.candidate.user.email}
                    </p>
                  </div>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "12px" }}>
                    {app.candidate.resumeUrl && (
                      <button
                        className="primary-btn secondary-btn"
                        onClick={() => {
                          const fileUrl = `${API_BASE_URL}/${app.candidate.resumeUrl.replace(/\\/g, "/")}`;
                          window.open(fileUrl, "_blank");
                        }}
                        style={{ width: "100%" }}
                      >
                        View Resume 📄
                      </button>
                    )}
                    
                    <button 
                      className="primary-btn" 
                      onClick={() => window.open(`mailto:${app.candidate.user.email}?subject=Interview Invitation for ${app.job.jobTitle}`)}
                      style={{ width: "100%" }}
                    >
                      Contact Candidate ✉️
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShortlistedSummary;