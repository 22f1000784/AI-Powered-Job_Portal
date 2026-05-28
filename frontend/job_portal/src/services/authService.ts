import { API_BASE_URL } from "../utils/api";
const BASE_URL = `${API_BASE_URL}/api/v1`;

export const loginUser = async (payload: any) => {
  const res = await fetch(`${BASE_URL}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
};