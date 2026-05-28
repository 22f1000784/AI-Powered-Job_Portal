import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import RecruiterNavbar from "./recruiterNavbar";
import { getShortlistedCandidates } from "../services/recruiterService";
import { API_BASE_URL } from "../utils/api";

const ShortlistPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!jobId) return;
      try {
        const data = await getShortlistedCandidates(jobId);
        setCandidates(data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [jobId]);

  return (
    <div className="dashboard">
      <RecruiterNavbar />
      <div className="content">
        <button
          className="primary-btn secondary-btn"
          onClick={() => navigate(-1)}
          style={{ marginBottom: "24px" }}
        >
          ← Back to Dashboard
        </button>
        
        <h2 className="heading">AI-Ranked Recommendations 🤖</h2>
        <p className="sub-heading">Semantic applicant ranking based on resume matching and job requirements</p>

        {loading ? (
          <div className="loading-state">
            <p className="pulse">Scanning applicant database...</p>
          </div>
        ) : candidates.length === 0 ? (
          <div className="no-data-box">
            <p className="no-data">No applicants found matching this job's criteria.</p>
          </div>
        ) : (
          <div className="job-list">
            {candidates.map((candidate) => (
              <div key={candidate.id} className="job-card recommendation-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                    <div className="match-badge" style={{ margin: 0 }}>
                      {(candidate.score * 100).toFixed(0)}% Match
                    </div>
                  </div>
                  
                  <h3 style={{ fontSize: "1.25rem", marginBottom: "10px" }}>{candidate.fullName}</h3>
                  
                  {candidate.skills && candidate.skills.length > 0 ? (
                    <div style={{ marginBottom: "20px" }}>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "4px", fontWeight: 600 }}>CANDIDATE SKILLS</p>
                      <div className="skills-list">
                        {candidate.skills.map((skill: string, idx: number) => (
                          <span key={idx} className="skill-tag" style={{ fontSize: "0.75rem" }}>{skill}</span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>No skills listed</p>
                  )}
                </div>
                
                {candidate.resumeUrl ? (
                  <button
                    className="primary-btn"
                    onClick={() => {
                      const fileUrl = `${API_BASE_URL}/${candidate.resumeUrl.replace(/\\/g, "/")}`;
                      window.open(fileUrl, "_blank");
                    }}
                    style={{ width: "100%" }}
                  >
                    View Resume 📄
                  </button>
                ) : (
                  <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", display: "block", textAlign: "center", padding: "10px", background: "rgba(255, 255, 255, 0.02)", borderRadius: "8px" }}>
                    No Resume Uploaded
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShortlistPage;