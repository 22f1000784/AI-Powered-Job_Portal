import { Link, useNavigate, useLocation } from "react-router-dom";

const RecruiterNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path ? "active-link" : "";

  return (
    <nav className="navbar">
      <div className="nav-left">
        <h2 className="logo" style={{ cursor: "pointer" }} onClick={() => navigate("/recruiter/dashboard")}>
          HireHub <span style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--text-muted)", marginLeft: "4px" }}>(Recruiter)</span>
        </h2>
        
        <Link to="/recruiter/dashboard" className={isActive("/recruiter/dashboard")}>
          Dashboard
        </Link>
        
        <Link to="/recruiter/shortlisted-summary" className={isActive("/recruiter/shortlisted-summary")}>
          Shortlisted Summary
        </Link>
        
        <Link to="/recruiter/post-job" className={isActive("/recruiter/post-job")}>
          Post a Job
        </Link>
      </div>

      <div className="nav-right">
        <button onClick={handleLogout} className="primary-btn secondary-btn" style={{ padding: "8px 16px", borderRadius: "8px" }}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default RecruiterNavbar;