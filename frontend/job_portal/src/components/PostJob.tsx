import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RecruiterNavbar from "./recruiterNavbar";
import { createJob } from "../services/jobService";
import { toast } from "./Toast";

const PostJob = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    jobTitle: "",
    role: "",
    description: "",
    qualifications: "",
    experienceRequired: 0,
    workType: "FULL_TIME",
    skills: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createJob(formData);
      toast.success("Job posted successfully!");
      navigate("/recruiter/dashboard");
    } catch (err: any) {
      toast.error(`Error: ${err.message}`);
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

        <h2 className="heading">Post a New Job</h2>
        <p className="sub-heading">Provide the details to begin candidate semantic matching</p>

        <form className="profile-card" onSubmit={handleSubmit} style={{ maxWidth: "700px", margin: "0 auto" }}>
          <div className="profile-grid">
            <div className="form-group">
              <label htmlFor="jobTitle">Job Title</label>
              <input id="jobTitle" type="text" name="jobTitle" required onChange={handleChange} placeholder="e.g. Senior Frontend Engineer" />
            </div>

            <div className="form-group">
              <label htmlFor="role">Functional Role</label>
              <input id="role" type="text" name="role" required onChange={handleChange} placeholder="e.g. UI Developer" />
            </div>

            <div className="form-group">
              <label htmlFor="workType">Work Type</label>
              <select id="workType" name="workType" value={formData.workType} onChange={handleChange}>
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="CONTRACT">Contract</option>
                <option value="TEMPORARY">Temporary</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="experienceRequired">Experience Required (Years)</label>
              <input id="experienceRequired" type="number" name="experienceRequired" min="0" onChange={handleChange} placeholder="0" />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: "20px" }}>
            <label htmlFor="skills">Required Skills (Comma separated)</label>
            <input 
              id="skills"
              type="text" 
              name="skills" 
              placeholder="e.g. React, Node.js, TypeScript, Docker" 
              onChange={handleChange} 
            />
          </div>

          <div className="form-group" style={{ marginBottom: "24px" }}>
            <label htmlFor="description">Job Description</label>
            <textarea 
              id="description"
              name="description" 
              required 
              onChange={handleChange} 
              rows={6} 
              placeholder="Outline responsibilities, daily operations, and qualification details..."
            />
          </div>

          <button type="submit" className="primary-btn" style={{ width: "100%" }}>
            Publish Job Listing
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostJob;