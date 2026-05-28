const BASE_URL = "http://127.0.0.1:8080/api/v1";

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