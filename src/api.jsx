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

export function getToken() {
  return localStorage.getItem("authToken");
}

// Pre-configured axios instance that always sends the JWT
const API_BASE = "http://localhost:8080/api";

export function authHeaders() {
  return { headers: { Authorization: getToken() } };
}

export { API_BASE };
