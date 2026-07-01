import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { API_URL } from "../api";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("");

  const getTokenFromQuery = () => {
    return new URLSearchParams(location.search).get("token");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setStatus("Passwords do not match.");
      return;
    }
    const token = getTokenFromQuery();
    if (!token) {
      setStatus("Invalid or missing reset token.");
      return;
    }
    try {
      await axios.post(`${API_URL}/api/user/reset`, {
        password,
        token,
      });
      setStatus("Password reset successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      setStatus("Error resetting password. The link may have expired.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8" style={{ backgroundColor: "#f0effe" }}>
      <div className="w-full max-w-md bg-white/90 shadow-2xl rounded-2xl p-6 sm:p-10 border border-gray-200 text-center">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Reset Password</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="password"
            placeholder="New password"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm new password"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold shadow-lg"
          >
            Reset Password
          </button>
        </form>
        {status && <p className="mt-4 text-indigo-700">{status}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;
