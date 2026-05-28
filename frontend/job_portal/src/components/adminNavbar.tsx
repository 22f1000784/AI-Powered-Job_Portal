import { Link, useNavigate, useLocation } from "react-router-dom";

const AdminNavbar = () => {
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
        <h2 className="logo" style={{ cursor: "pointer" }} onClick={() => navigate("/admin/dashboard")}>
          HireHub <span style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--danger)", marginLeft: "4px" }}>(Admin)</span>
        </h2>
        
        <Link to="/admin/dashboard" className={isActive("/admin/dashboard")}>
          Overview
        </Link>
        
        <Link to="/admin/users" className={isActive("/admin/users")}>
          User Management
        </Link>
        
        <Link to="/admin/jobs" className={isActive("/admin/jobs")}>
          Global Jobs
        </Link>
      </div>

      <div className="nav-right" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
          System Admin
        </span>
        <button onClick={handleLogout} className="primary-btn secondary-btn" style={{ padding: "8px 16px", borderRadius: "8px" }}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;