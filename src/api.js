// src/api.jsx
import axios from "axios";

export function setToken(token) {
  localStorage.setItem("authToken", token);
}

export function removeToken() {
  localStorage.removeItem("authToken");
}

export function getRoleFromToken() {
  const token = localStorage.getItem("authToken");
  if (!token) return "";
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role || payload.authorities || "";
  } catch {
    return "";
  }
}

export function isAdmin() {
  return getRoleFromToken() === "ADMIN";
}

// The backend returns a fresh token after a password change (older sessions are
// signed out), so keep it when present.
export function storeRefreshedToken(response) {
  const token = response?.headers?.["authorization"];
  if (token) setToken(token);
}

// Server-provided error message (e.g. "The demo account's profile ... can't be changed").
export function apiErrorMessage(error, fallback) {
  return error?.response?.data?.message || fallback;
}

export function getToken() {
  return localStorage.getItem("authToken");
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

// Pre-configured axios instance that always sends the JWT
const API_BASE_URL = `${API_URL}/api`;

export function authHeaders() {
  const token = getToken();
  return { headers: { Authorization: `Bearer ${token}` } };
}

export { API_BASE_URL, API_URL };
