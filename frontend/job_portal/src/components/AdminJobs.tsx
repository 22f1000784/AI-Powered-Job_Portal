import { useEffect, useState } from "react";
import { getAdminJobs, deleteAdminJob } from "../services/adminService";
import AdminNavbar from "./adminNavbar";

const AdminJobs = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchJobs = async () => {
    try {
      const data = await getAdminJobs();
      setJobs(data);
    } catch (err: any) {
      console.error(err);
      setError("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDeleteJob = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete job listing: "${title}"?`)) {
      try {
        await deleteAdminJob(id);
        setJobs(jobs.filter(j => j.id !== id));
      } catch (err: any) {
        console.error(err);
        alert(err.message || "Failed to delete job");
      }
    }
  };

  if (loading) return <div className="dashboard"><p className="pulse">Loading Global Jobs...</p></div>;

  return (
    <div className="dashboard">
      <AdminNavbar />
      <div className="content">
        <h2 className="heading">Global Job Listings</h2>
        
        {error && <div className="error-message" style={{ color: '#e74c3c', marginBottom: '20px' }}>{error}</div>}

        <div className="job-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {jobs.length === 0 ? (
            <p>No jobs posted on the platform.</p>
          ) : (
            jobs.map((job) => (
              <div key={job.id} className="job-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '20px' }}>
                <div>
                  <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem' }}>{job.jobTitle}</h3>
                  <p style={{ margin: '5px 0' }}><strong>Role:</strong> {job.role}</p>
                  <p style={{ margin: '5px 0' }}><strong>Work Type:</strong> {job.workType}</p>
                  <p style={{ margin: '5px 0', fontSize: '0.9rem', color: '#666' }}>
                    <strong>Recruiter:</strong> {job.recruiter?.companyName || "N/A"}
                  </p>
                  <p style={{ margin: '5px 0', fontSize: '0.85rem', color: '#888' }}>
                    <strong>Skills Required:</strong> {job.skills?.join(", ") || "None"}
                  </p>
                </div>
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button 
                    onClick={() => handleDeleteJob(job.id, job.jobTitle)} 
                    className="primary-btn" 
                    style={{ backgroundColor: '#e74c3c', padding: '8px 15px' }}
                  >
                    Delete Job
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminJobs;
