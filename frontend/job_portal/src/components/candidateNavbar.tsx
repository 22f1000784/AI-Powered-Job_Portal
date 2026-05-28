import { Link, useNavigate, useLocation } from "react-router-dom";

const CandidateNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isActive = (path: string) =>
    location.pathname === path ? "active-link" : "";

  return (
    <div className="navbar">
      <div className="nav-left">
        <h2 className="logo" style={{ cursor: "pointer" }} onClick={() => navigate("/candidate/dashboard")}>HireHub</h2>

        <Link to="/candidate/dashboard" className={isActive("/candidate/dashboard")}>
          All Jobs
        </Link>

        <Link
          to="/candidate/recommendations"
          className={isActive("/candidate/recommendations")}
        >
          Recommended Jobs
        </Link>
        
        <Link to="/candidate/applications" className={isActive("/candidate/applications")}>
          My Applications
        </Link>

        <Link to="/candidate/profile" className={isActive("/candidate/profile")}>
          My Profile
        </Link>
      </div>

      <div className="nav-right">
        <button onClick={handleLogout} className="primary-btn secondary-btn" style={{ padding: "8px 16px", borderRadius: "8px" }}>Logout</button>
      </div>
    </div>
  );
};

export default CandidateNavbar;