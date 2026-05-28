import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import CandidateNavbar from "./candidateNavbar";
import { applyToJob, getJobById } from "../services/jobService";
import { toast } from "./Toast";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<any>(null);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const data = await getJobById(id!);
      setJob(data);
    };
    fetch();
  }, [id]);

  const handleApply = async () => {
    setApplying(true);
    try {
      await applyToJob(id!);
      toast.success("Applied successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to apply");
    } finally {
      setApplying(false);
    }
  };

  if (!job) {
    return (
      <div className="dashboard">
        <CandidateNavbar />
        <div className="content">
          <p className="pulse">Loading job details...</p>
        </div>
      </div>
    );
  }

  const getWorkTypeLabel = (type: string) => {
    return type ? type.replace("_", " ") : "Full Time";
  };

  return (
    <div className="dashboard">
      <CandidateNavbar />

      <div className="content">
        <button
          className="primary-btn secondary-btn"
          onClick={() => navigate(-1)}
          style={{ marginBottom: "24px" }}
        >
          ← Back to Jobs
        </button>

        <div className="job-card details-card" style={{ padding: "36px" }}>
          <div>
            <span className={`status-tag ${job.workType?.toLowerCase() || "full_time"}`} style={{ marginBottom: "16px" }}>
              {getWorkTypeLabel(job.workType)}
            </span>
            <h2 style={{ fontSize: "2rem", marginTop: "8px", marginBottom: "8px" }}>{job.jobTitle}</h2>
            <p style={{ fontSize: "1.1rem", color: "var(--text-muted)", marginBottom: "4px" }}>
              Company: <strong style={{ color: "var(--text-main)" }}>{job.recruiter?.companyName || "N/A"}</strong>
            </p>
            <p style={{ fontSize: "1rem", color: "var(--text-muted)" }}>
              Role: <strong style={{ color: "var(--text-main)" }}>{job.role}</strong>
            </p>
          </div>

          <section>
            <h4 style={{ color: "var(--text-main)", marginBottom: "10px", fontWeight: 600 }}>Job Description</h4>
            <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", lineHeight: 1.7, whiteSpace: "pre-line" }}>
              {job.description}
            </p>
          </section>

          {job.experienceRequired !== undefined && (
            <section>
              <h4 style={{ color: "var(--text-main)", marginBottom: "6px", fontWeight: 600 }}>Experience Required</h4>
              <p style={{ fontSize: "0.95rem", color: "var(--text-muted)" }}>
                {job.experienceRequired} {job.experienceRequired === 1 ? "year" : "years"} or equivalent
              </p>
            </section>
          )}

          {job.skills && job.skills.length > 0 && (
            <section>
              <h4 style={{ color: "var(--text-main)", marginBottom: "12px", fontWeight: 600 }}>Required Technical Skills</h4>
              <div className="skills-list">
                {job.skills.map((s: string, i: number) => (
                  <span key={i} className="skill-tag" style={{ padding: "6px 14px", fontSize: "0.9rem" }}>
                    {s}
                  </span>
                ))}
              </div>
            </section>
          )}

          <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.06)", paddingTop: "28px", marginTop: "12px" }}>
            <button
              className="primary-btn"
              onClick={handleApply}
              disabled={applying}
              style={{ width: "100%", padding: "16px" }}
            >
              {applying ? "Submitting Application..." : "Apply For This Job"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;