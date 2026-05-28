import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/authService";
import { jwtDecode } from "jwt-decode";
import { toast } from "../components/Toast";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      const res = await loginUser(formData);

      // store token
      localStorage.setItem("token", res.token);

      // decode token
      const decoded: any = jwtDecode(res.token);

      toast.success("Welcome back!");

      // role-based redirect
      if (decoded.role === "CANDIDATE") {
        navigate("/candidate/dashboard");
      } else if (decoded.role === "RECRUITER") {
        navigate("/recruiter/dashboard");
      } else if (decoded.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (err: any) {
      toast.error(err.message || "Login failed");
    }
  };

  return (
    <div className="container" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", padding: "20px" }}>
      <div className="form" style={{ margin: 0 }}>
        <h2 style={{ textAlign: "center", marginBottom: "8px", fontWeight: 800 }}>HireHub</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", textAlign: "center", marginBottom: "20px" }}>
          Sign in to access your portal
        </p>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            onChange={handleChange}
          />
        </div>

        <button onClick={handleSubmit} style={{ width: "100%", marginTop: "10px" }}>
          Login
        </button>

        <p style={{ textAlign: "center", fontSize: "0.9rem", color: "var(--text-muted)", marginTop: "12px" }}>
          New to HireHub? <Link to="/signup" style={{ fontWeight: 600 }}>Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;