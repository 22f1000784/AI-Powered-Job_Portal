import axios from "axios";

const isProd = import.meta.env.PROD;
export const API_BASE_URL = isProd ? window.location.origin : "http://127.0.0.1:8080";

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
});