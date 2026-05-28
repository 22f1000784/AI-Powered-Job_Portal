const BASE_URL = "http://127.0.0.1:8080/api/v1";

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
  const res = await fetch(`http://127.0.0.1:8080/api/v1/jobs/${jobId}/applicants`, {
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
  
  const res = await fetch(`http://127.0.0.1:8080/api/v1/applications/${applicationId}/status`, {
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
  const res = await fetch(`http://127.0.0.1:8080/api/v1/applications/shortlisted/all`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};