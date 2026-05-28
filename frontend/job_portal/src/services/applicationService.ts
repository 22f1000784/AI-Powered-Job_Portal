import { API_BASE_URL } from "../utils/api";
const BASE_URL = `${API_BASE_URL}/api/v1`;

export const getApplications = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/applications`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch applications");

  return res.json();
};

export const getJobApplicants = async (jobId: string) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/jobs/${jobId}/applicants`, {
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}` 
    },
  });
  if (!res.ok) throw new Error("Failed to load applicants");
  return res.json();
};

export const updateApplicationStatus = async (applicationId: string, status: string) => {
  const token = localStorage.getItem("token");
  
  const res = await fetch(`${BASE_URL}/applications/${applicationId}/status`, {
    method: "PATCH", 
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to update status");
  }

  return res.json();
};

export const getAllShortlisted = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/applications/shortlisted/all`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};