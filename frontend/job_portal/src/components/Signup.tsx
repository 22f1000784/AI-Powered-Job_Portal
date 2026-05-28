import { useState } from "react";
import { api } from "../utils/api";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "../components/Toast";

const Signup = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("CANDIDATE");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    companyName: "",
    contactPerson: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        email: formData.email,
        password: formData.password,
        role,
        ...(role === "CANDIDATE" && { fullName: formData.fullName }),
        ...(role === "RECRUITER" && {
          companyName: formData.companyName,
          contactPerson: formData.contactPerson,
        }),
      };

      await api.post("/users/signup", payload);

      toast.success("Signup successful! Please login.");
      navigate("/login");
    } catch (err: any) {
      console.error(err);
      toast.error("Signup failed. Email might already be taken.");
    }
  };

  return (
    <div className="container" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", padding: "40px 20px" }}>
      <div className="form" style={{ margin: 0, maxWidth: "500px" }}>
        <h2 style={{ textAlign: "center", marginBottom: "8px", fontWeight: 800 }}>HireHub</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", textAlign: "center", marginBottom: "20px" }}>
          Create an account to get started
        </p>

        <div className="form-group">
          <label htmlFor="role">I want to register as a</label>
          <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="CANDIDATE">Job Seeker / Candidate</option>
            <option value="RECRUITER">Employer / Recruiter</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="name@company.com"
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="At least 6 characters"
            onChange={handleChange}
          />
        </div>

        {role === "CANDIDATE" && (
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="John Doe"
              onChange={handleChange}
            />
          </div>
        )}

        {role === "RECRUITER" && (
          <>
            <div className="form-group">
              <label htmlFor="companyName">Company Name</label>
              <input
                id="companyName"
                name="companyName"
                type="text"
                placeholder="Tech Solutions Inc."
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="contactPerson">Contact Person Name</label>
              <input
                id="contactPerson"
                name="contactPerson"
                type="text"
                placeholder="Jane Smith"
                onChange={handleChange}
              />
            </div>
          </>
        )}

        <button onClick={handleSubmit} style={{ width: "100%", marginTop: "10px" }}>
          Register Account
        </button>

        <p style={{ textAlign: "center", fontSize: "0.9rem", color: "var(--text-muted)", marginTop: "12px" }}>
          Already a user? <Link to="/login" style={{ fontWeight: 600 }}>Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;