import { useEffect, useState } from "react";
import CandidateNavbar from "./candidateNavbar";
import { getProfile, updateProfile } from "../services/profileService";
import { toast } from "./Toast";
import { API_BASE_URL } from "../utils/api";

const CandidateProfile = () => {
  const [form, setForm] = useState<any>({});

  useEffect(() => {
    const fetchData = async () => {
      const data = await getProfile();
      setForm(data);
    };
    fetchData();
  }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: any) => {
    setForm({ ...form, resume: e.target.files[0] });
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      formData.append("fullName", form.fullName || "");
      formData.append("phone", form.phone || "");
      formData.append("education", form.education || "");
      formData.append("experience_years", String(form.experience_years || 0));

      if (form.skills) {
        let skillsArray: string[] = [];
        if (typeof form.skills === "string") {
          skillsArray = form.skills.split(",").map((s: string) => s.trim());
        } else if (Array.isArray(form.skills)) {
          skillsArray = form.skills;
        }
        formData.append("skills", JSON.stringify(skillsArray));
      }

      if (form.resume) {
        formData.append("resume", form.resume);
      }

      await updateProfile(formData);
      toast.success("Profile updated successfully!");
      
      // Refresh details to update resume link
      const data = await getProfile();
      setForm(data);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to update profile");
    }
  };

  return (
    <div className="dashboard">
      <CandidateNavbar />

      <div className="content">
        <h2 className="heading">My Profile</h2>
        <p className="sub-heading">Update your professional details and resume for AI matching</p>

        <div className="profile-card">
          <div className="profile-grid">
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                name="fullName"
                value={form.fullName || ""}
                onChange={handleChange}
                placeholder="Full Name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                name="phone"
                value={form.phone || ""}
                onChange={handleChange}
                placeholder="Phone Number"
              />
            </div>

            <div className="form-group">
              <label htmlFor="education">Highest Education</label>
              <input
                id="education"
                name="education"
                value={form.education || ""}
                onChange={handleChange}
                placeholder="Degree, Institution"
              />
            </div>

            <div className="form-group">
              <label htmlFor="experience_years">Years of Experience</label>
              <input
                id="experience_years"
                name="experience_years"
                type="number"
                min="0"
                value={form.experience_years || ""}
                onChange={handleChange}
                placeholder="Experience (years)"
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: "24px" }}>
            <label htmlFor="skills">Technical Skills (Comma separated)</label>
            <input
              id="skills"
              name="skills"
              value={Array.isArray(form.skills) ? form.skills.join(", ") : form.skills || ""}
              onChange={handleChange}
              placeholder="e.g. React, Node.js, Python, SQL"
            />
          </div>

          <div className="form-group" style={{ padding: "20px", background: "rgba(255, 255, 255, 0.02)", border: "1px dashed rgba(255, 255, 255, 0.12)", borderRadius: "12px", marginBottom: "24px" }}>
            <label htmlFor="resume" style={{ marginBottom: "8px", display: "block", fontWeight: 600 }}>Upload PDF Resume</label>
            <input
              id="resume"
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
            />
            {form.resumeUrl && (
              <p style={{ marginTop: "12px", fontSize: "0.85rem", color: "var(--accent)", display: "flex", alignItems: "center", gap: "6px" }}>
                <span>📄</span> Current resume uploaded.{" "}
                <a
                  href={`${API_BASE_URL}/${form.resumeUrl.replace(/\\/g, "/")}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ textDecoration: "underline", color: "var(--accent)", fontWeight: 600 }}
                >
                  View Resume
                </a>
              </p>
            )}
          </div>

          <button className="primary-btn" onClick={handleSubmit} style={{ minWidth: "200px" }}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;