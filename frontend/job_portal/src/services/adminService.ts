const BASE_URL = "http://127.0.0.1:8080/api/v1";

export const getAdminDashboardStats = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/admin/stats`, {
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}` 
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch admin statistics");
  }
  return res.json();
};

export const getAdminUsers = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/admin/users`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
};

export const deleteAdminUser = async (id: string) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/admin/users/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error("Failed to delete user");
  return res.json();
};

export const getAdminJobs = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/admin/jobs`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error("Failed to fetch jobs");
  return res.json();
};

export const deleteAdminJob = async (id: string) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/admin/jobs/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error("Failed to delete job");
  return res.json();
};