import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { API_URL } from "../api";

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");

  // Extract the token from the URL query string (?token=...)
  const getTokenFromQuery = () => {
    const params = new URLSearchParams(location.search);
    return params.get("token");
  };

  useEffect(() => {
    const token = getTokenFromQuery();
    if (!token) {
      setStatus("error");
      setMessage("Invalid or missing verification token.");
      return;
    }
    // Send token to backend in the Authorization header
    axios
      .get(`${API_URL}/api/user/verify/email`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setStatus("success");
        setMessage("Email verified! Redirecting to login...");
        setTimeout(() => navigate("/login"), 3000);
      })
      .catch((error) => {
        setStatus("error");
        setMessage(
          error.response?.data?.message ||
            "Verification failed. Link may have expired.",
        );
      });
  }, [location, navigate]);

  return (
    <div
      className="max-w-md mx-auto mt-24 bg-white/90 shadow-2xl rounded-2xl p-10 border 
border-gray-200 text-center"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Email Verification
      </h2>
      {status === "verifying" && <p>Verifying your email, please wait...</p>}
      {status === "success" && (
        <p className="text-green-600 font-semibold">{message}</p>
      )}
      {status === "error" && (
        <p className="text-red-600 font-semibold">{message}</p>
      )}
    </div>
  );
};

export default VerifyEmail;
