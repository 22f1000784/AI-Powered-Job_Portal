import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import RecruiterNavbar from "./recruiterNavbar";
import { getJobApplicants, updateApplicationStatus } from "../services/applicationService";
import { toast } from "./Toast";
import { API_BASE_URL } from "../utils/api";

const ApplicantsPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getJobApplicants(jobId!);
        setApplications(data);
      } catch (err) {
        console.error("Error loading applicants:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [jobId]);

  const onStatusUpdate = async (appId: string, newStatus: string) => {
    try {
      await updateApplicationStatus(appId, newStatus);
      
      setApplications((prev) =>
        prev.map((app) => 
          app.id === appId ? { ...app, status: newStatus } : app
        )
      );

      toast.success(`Candidate status updated to ${newStatus}`);
    } catch (err: any) {
      toast.error(`Update failed: ${err.message}`);
    }
  };

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

        <h2 className="heading">Job Applicants</h2>
        <p className="sub-heading">Review candidates, evaluate match scores, and update application pipelines</p>
        
        {loading ? (
          <div className="loading-state">
            <p className="pulse">Loading candidates...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="no-data-box">
            <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>👥</div>
            <p>No candidates have applied to this listing yet.</p>
          </div>
        ) : (
          <div className="job-list">
            {applications.map((app) => (
              <div key={app.id} className="job-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                    <span className={`status-tag ${app.status.toLowerCase()}`}>
                      {app.status}
                    </span>
                    <div className="match-badge" style={{ margin: 0, background: "linear-gradient(135deg, var(--accent) 0%, var(--primary) 100%)" }}>
                      Score: {app.matchingScore.toFixed(0)}%
                    </div>
                  </div>
                  
                  <h3 style={{ marginTop: "12px", marginBottom: "6px" }}>{app.candidate.fullName}</h3>
                  <p style={{ fontSize: "0.9rem", marginBottom: "4px" }}>
                    <strong>Email:</strong> {app.candidate.user.email}
                  </p>
                  <p style={{ fontSize: "0.9rem", marginBottom: "4px" }}>
                    <strong>Phone:</strong> {app.candidate.phone || "N/A"}
                  </p>
                  <p style={{ fontSize: "0.9rem", marginBottom: "4px" }}>
                    <strong>Education:</strong> {app.candidate.education || "N/A"}
                  </p>
                  <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", marginBottom: "12px" }}>
                    Applied on: {new Date(app.appliedAt).toLocaleDateString()}
                  </p>

                  {app.candidate.skills && app.candidate.skills.length > 0 && (
                    <div style={{ marginBottom: "20px" }}>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "4px", fontWeight: 600 }}>CANDIDATE SKILLS</p>
                      <div className="skills-list">
                        {app.candidate.skills.map((skill: string, idx: number) => (
                          <span key={idx} className="skill-tag" style={{ fontSize: "0.75rem" }}>{skill}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
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

                  <div className="button-group" style={{ display: "flex", gap: "10px" }}>
                    <button 
                      className="primary-btn" 
                      style={{ 
                        flex: 1, 
                        background: app.status === 'SHORTLISTED' ? 'var(--success)' : 'var(--primary)',
                      }}
                      onClick={() => onStatusUpdate(app.id, 'SHORTLISTED')}
                      disabled={app.status === 'SHORTLISTED' || app.status === 'REJECTED'}
                    >
                      {app.status === 'SHORTLISTED' ? 'Shortlisted ✓' : 'Shortlist'}
                    </button>
                    
                    <button 
                      className="primary-btn danger-btn" 
                      style={{ 
                        flex: 1, 
                        display: app.status === 'REJECTED' ? 'none' : 'inline-flex' 
                      }}
                      onClick={() => onStatusUpdate(app.id, 'REJECTED')}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicantsPage;