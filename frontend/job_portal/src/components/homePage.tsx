import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="home-container" style={{ justifyContent: "center", alignItems: "center", padding: "40px 24px", minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      {/* Decorative Blur Orbs */}
      <div style={{ position: "absolute", top: "20%", left: "15%", width: "300px", height: "300px", background: "rgba(111, 76, 255, 0.15)", borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none" }}></div>
      <div style={{ position: "absolute", bottom: "15%", right: "10%", width: "350px", height: "350px", background: "rgba(244, 63, 94, 0.12)", borderRadius: "50%", filter: "blur(90px)", pointerEvents: "none" }}></div>
      
      <div style={{ maxWidth: "800px", textAlign: "center", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* Logo Badge */}
        <div style={{ background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.08)", padding: "6px 16px", borderRadius: "100px", display: "inline-flex", gap: "8px", alignItems: "center", marginBottom: "20px" }}>
          <span style={{ color: "var(--accent)" }}>●</span>
          <span style={{ fontSize: "0.85rem", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>AI-Powered Recruitment</span>
        </div>

        <h1 className="heading" style={{ fontSize: "4rem", lineHeight: 1.1, marginBottom: "16px", letterSpacing: "-0.02em" }}>
          HireHub
        </h1>

        <p className="sub-heading" style={{ fontSize: "1.25rem", maxWidth: "600px", color: "var(--text-muted)", marginBottom: "36px" }}>
          Find your dream role or top talent instantly through intelligent resume screening and semantic matching.
        </p>

        <div style={{ display: "flex", gap: "16px", marginBottom: "60px" }}>
          <Link to="/login" className="primary-btn" style={{ padding: "14px 36px", fontSize: "1rem" }}>
            Sign In to Account
          </Link>
          <Link to="/signup" className="primary-btn secondary-btn" style={{ padding: "14px 36px", fontSize: "1rem" }}>
            Create Account
          </Link>
        </div>

        {/* Feature Highlights Grid */}
        <div className="job-list" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", width: "100%", gap: "20px" }}>
          <div className="job-card" style={{ padding: "24px", textAlign: "left" }}>
            <div style={{ fontSize: "2rem", marginBottom: "12px" }}>🤖</div>
            <h4 style={{ fontSize: "1.1rem", marginBottom: "8px" }}>AI Candidate Matching</h4>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: 0 }}>Semantic profile analysis scores matches against real-time job requisites.</p>
          </div>
          
          <div className="job-card" style={{ padding: "24px", textAlign: "left" }}>
            <div style={{ fontSize: "2rem", marginBottom: "12px" }}>📄</div>
            <h4 style={{ fontSize: "1.1rem", marginBottom: "8px" }}>Resume Parsing</h4>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: 0 }}>Upload a PDF resume to populate skills automatically for instantaneous matching.</p>
          </div>

          <div className="job-card" style={{ padding: "24px", textAlign: "left" }}>
            <div style={{ fontSize: "2rem", marginBottom: "12px" }}>🛡️</div>
            <h4 style={{ fontSize: "1.1rem", marginBottom: "8px" }}>Role Management</h4>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: 0 }}>Dedicated interfaces for Candidates, Recruiters, and System Administrators.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;