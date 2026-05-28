import { useEffect, useState } from "react";
import { getAdminUsers, deleteAdminUser } from "../services/adminService";
import AdminNavbar from "./adminNavbar";

const AdminUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      const data = await getAdminUsers();
      setUsers(data);
    } catch (err: any) {
      console.error(err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id: string, email: string) => {
    if (window.confirm(`Are you sure you want to delete user: ${email}? This action is permanent and will delete all related records.`)) {
      try {
        await deleteAdminUser(id);
        setUsers(users.filter(u => u.id !== id));
      } catch (err: any) {
        console.error(err);
        alert(err.message || "Failed to delete user");
      }
    }
  };

  if (loading) return <div className="dashboard"><p className="pulse">Loading User Management...</p></div>;

  return (
    <div className="dashboard">
      <AdminNavbar />
      <div className="content">
        <h2 className="heading">User Management</h2>
        
        {error && <div className="error-message" style={{ color: '#e74c3c', marginBottom: '20px' }}>{error}</div>}

        <div className="job-list" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {users.length === 0 ? (
            <p>No users registered on the platform.</p>
          ) : (
            users.map((user) => (
              <div key={user.id} className="job-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px' }}>
                <div>
                  <h3 style={{ margin: '0 0 5px 0', fontSize: '1.1rem' }}>{user.email}</h3>
                  <span 
                    style={{ 
                      padding: '3px 8px', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      fontWeight: 'bold', 
                      color: '#fff',
                      backgroundColor: user.role === 'ADMIN' ? '#e74c3c' : user.role === 'RECRUITER' ? '#9b59b6' : '#2ecc71'
                    }}
                  >
                    {user.role}
                  </span>
                  <p style={{ margin: '8px 0 0 0', fontSize: '0.85rem', color: '#888' }}>
                    Created: {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {user.role !== 'ADMIN' && (
                  <button 
                    onClick={() => handleDeleteUser(user.id, user.email)} 
                    className="primary-btn" 
                    style={{ backgroundColor: '#e74c3c', padding: '8px 15px' }}
                  >
                    Delete User
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
