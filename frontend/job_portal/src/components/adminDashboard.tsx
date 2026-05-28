import { useEffect, useState } from "react";
import { getAdminDashboardStats } from "../services/adminService";
import AdminNavbar from "./adminNavbar"; // Assuming you have an admin navbar

const AdminDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAdminDashboardStats();
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="dashboard"><p className="pulse">Loading Admin Metrics...</p></div>;

  return (
    <div className="dashboard">
      <AdminNavbar />
      <div className="content">
        <h2 className="heading">System Overview</h2>
        
        {/* Platform Totals Grid */}
        <div className="job-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <StatCard title="Total Users" value={stats.totals.users} color="#3498db" />
          <StatCard title="Candidates" value={stats.totals.candidates} color="#2ecc71" />
          <StatCard title="Recruiters" value={stats.totals.recruiters} color="#9b59b6" />
          <StatCard title="Active Jobs" value={stats.totals.jobs} color="#e67e22" />
        </div>

        <h2 className="heading" style={{ marginTop: '40px' }}>Application Funnel</h2>
        
        {/* Application Stats Section */}
        <div className="job-card" style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
          <div>
            <h4 style={{ color: '#666' }}>Total Applications</h4>
            <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.totals.applications}</p>
          </div>
          <div>
            <h4 style={{ color: '#3498db' }}>New (Applied)</h4>
            <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.applicationStats.applied}</p>
          </div>
          <div>
            <h4 style={{ color: '#2ecc71' }}>Shortlisted</h4>
            <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.applicationStats.shortlisted}</p>
          </div>
          <div>
            <h4 style={{ color: '#e74c3c' }}>Rejected</h4>
            <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.applicationStats.rejected}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple internal component for the metric cards
const StatCard = ({ title, value, color }: { title: string, value: number, color: string }) => (
  <div className="job-card" style={{ borderLeft: `5px solid ${color}`, textAlign: 'center' }}>
    <h3 style={{ color: '#666', fontSize: '1rem' }}>{title}</h3>
    <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '10px 0' }}>{value}</p>
  </div>
);

export default AdminDashboard;