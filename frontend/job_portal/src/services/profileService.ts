import { API_BASE_URL } from "../utils/api";
const BASE_URL = `${API_BASE_URL}/api/v1`;

export const getProfile = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/candidate/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
};

export const updateProfile = async (payload: FormData) => { // Type changed to FormData
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/candidate/profile`, {
    method: "PUT",
    headers: {
      // IMPORTANT: Do NOT add 'Content-Type' here. 
      // The browser must set it automatically to include the boundary.
      Authorization: `Bearer ${token}`,
    },
    body: payload, // Send the FormData object directly
  });
alert("successful");
  return res.json();
};
