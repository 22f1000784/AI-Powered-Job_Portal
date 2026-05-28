import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CandidateNavbar from "./candidateNavbar";
import { getJobs } from "../services/jobService";

const CandidateDashboard = () => {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const fetchJobs = async () => {
    try {
      const data = await getJobs(page, 10, search);
      setJobs(data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [page, search]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Reset to page 1 on query change
  };

  const getWorkTypeLabel = (type: string) => {
    return type ? type.replace("_", " ") : "Full Time";
  };

  return (
    <div className="dashboard">
      <CandidateNavbar />

      <div className="content">
        <h2 className="heading">Explore Job Opportunities</h2>
        <p className="sub-heading">Find a matching role that fits your goals</p>

        {/* Search Bar */}
        <div style={{ marginBottom: "32px", display: "flex", gap: "12px", maxWidth: "600px" }}>
          <input
            type="text"
            placeholder="🔍 Search jobs by title, role, or keywords..."
            value={search}
            onChange={handleSearchChange}
          />
        </div>

        {jobs.length === 0 ? (
          <div className="no-data-box">
            <p>No job listings are currently available.</p>
          </div>
        ) : (
          <div className="job-list">
            {jobs.map((job) => (
              <div key={job.id} className="job-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <span className={`status-tag ${job.workType?.toLowerCase() || "full_time"}`} style={{ marginBottom: "12px" }}>
                    {getWorkTypeLabel(job.workType)}
                  </span>
                  
                  <h3 style={{ marginTop: "8px", marginBottom: "6px" }}>{job.jobTitle}</h3>
                  <p style={{ fontSize: "0.95rem", marginBottom: "8px" }}>
                    <strong>Role:</strong> {job.role}
                  </p>
                  
                  {job.skills && job.skills.length > 0 && (
                    <div style={{ marginTop: "12px", marginBottom: "20px" }}>
                      <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "6px", fontWeight: 600 }}>REQUIRED SKILLS</p>
                      <div className="skills-list">
                        {job.skills.slice(0, 3).map((skill: string, idx: number) => (
                          <span key={idx} className="skill-tag">{skill}</span>
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
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="pagination">
          <button
            className="primary-btn secondary-btn"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>

          <span>Page {page}</span>

          <button
            className="primary-btn secondary-btn"
            disabled={jobs.length < 10}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;