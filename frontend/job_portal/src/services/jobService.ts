import { API_BASE_URL } from "../utils/api";
const BASE_URL = `${API_BASE_URL}/api/v1`;

export const getJobs = async (page = 1, limit = 10, search = "") => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `${BASE_URL}/jobs?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) throw new Error("Failed to fetch jobs");

  return res.json(); // returns array OR {jobs,...} depending backend
};

export const getRecommendedJobs = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/jobs/recommendations`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch recommended jobs");

  return res.json();
};

export const getJobById = async (id: string) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/jobs/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch job");

  return res.json();
};

export const applyToJob = async (jobId: string) => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `${BASE_URL}/applications/apply`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ jobId }),
    }
  );

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  return data;
};

export const getRecruiterJobs = async () => {
  const token = localStorage.getItem("token");
  
  const res = await fetch(`${BASE_URL}/jobs/recruiter/my-jobs`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to fetch your jobs");
  }

  return res.json();
};

/**
 * Fetches the ranked list of candidates for a specific job ID.
 * This triggers the keyword-matching logic on the backend.
 */
export const getShortlistedCandidates = async (jobId: string) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/recruiter/shortlist/${jobId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to fetch shortlisted candidates");
  }

  return res.json();
};

export const createJob = async (jobData: any) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/jobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(jobData),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to create job");
  }

  return res.json();
};