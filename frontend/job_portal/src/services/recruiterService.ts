import { API_BASE_URL } from "../utils/api";
const BASE_URL = `${API_BASE_URL}/api/v1`;

export const getShortlistedCandidates = async (jobId: string) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/recruiter/shortlist/${jobId}`, {
    headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}` 
    },
  });
  if (!res.ok) throw new Error("Failed to fetch shortlist");
  return res.json();
};