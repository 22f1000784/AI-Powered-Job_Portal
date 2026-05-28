import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CandidateNavbar from "./candidateNavbar";
import { getRecommendedJobs } from "../services/jobService";

const RecommendedJobs = () => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const data = await getRecommendedJobs();
      setRecommendations(data);
    } catch (err) {
      console.error("Error fetching recommendations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const formatScore = (score: number) => (score * 100).toFixed(0) + "% Match";
  
  const getWorkTypeLabel = (type: string) => {
    return type ? type.replace("_", " ") : "Full Time";
  };

  return (
    <div className="dashboard">
      <CandidateNavbar />
      <div className="content">
        <h2 className="heading">AI-Powered Matches 🤖</h2>
        <p className="sub-heading">Personalized job recommendations computed based on your resume semantics and profile skills.</p>

        {loading ? (
          <div className="loading-state">
            <div style={{ fontSize: "3rem", marginBottom: "8px", animation: "pulseAnim 1.5s infinite" }}>🧠</div>
            <p className="pulse" style={{ fontSize: "1.2rem", fontWeight: 600 }}>Analyzing job postings against your profile...</p>
            <p className="sub-text" style={{ maxWidth: "450px" }}>This might take a brief moment as our system computes vector space embeddings for semantic indexing.</p>
          </div>
        ) : recommendations.length === 0 ? (
          <div className="no-data-box">
            <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>📁</div>
            <p>No matches found yet. Make sure your profile has a resume uploaded!</p>
            <button className="primary-btn" onClick={() => navigate("/candidate/profile")} style={{ marginTop: "16px" }}>
              Upload Resume
            </button>
          </div>
        ) : (
          <div className="job-list">
            {recommendations.map((job) => (
              <div key={job.id} className="job-card recommendation-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", border: "1px solid rgba(111, 76, 255, 0.2)", background: "rgba(111, 76, 255, 0.03)" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                    <span className={`status-tag ${job.workType?.toLowerCase() || "full_time"}`}>
                      {getWorkTypeLabel(job.workType)}
                    </span>
                    <div className="match-badge" style={{ margin: 0 }}>
                      {formatScore(job.score)}
                    </div>
                  </div>

                  <h3 style={{ marginTop: "8px", marginBottom: "6px" }}>{job.jobTitle}</h3>
                  <p style={{ fontSize: "0.95rem", marginBottom: "8px" }}>
                    <strong>Role:</strong> {job.role}
                  </p>
                  
                  {job.skills && job.skills.length > 0 && (
                    <div style={{ marginTop: "12px", marginBottom: "20px" }}>
                      <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "6px", fontWeight: 600 }}>REQUIRED SKILLS</p>
                      <div className="skills-list">
                        {job.skills.slice(0, 3).map((skill: string, idx: number) => (
                          <span key={idx} className="skill-tag" style={{ background: "rgba(255, 255, 255, 0.08)" }}>{skill}</span>
                        ))}
                        {job.skills.length > 3 && (
                          <span className="skill-tag" style={{ background: "rgba(255, 255, 255, 0.02)" }}>+{job.skills.length - 3} more</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  className="primary-btn"
                  onClick={() => navigate(`/candidate/job/${job.id}`)}
                  style={{ width: "100%" }}
                >
                  View Details & Match
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendedJobs;