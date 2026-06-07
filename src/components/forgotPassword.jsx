import React, { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    try {
      await axios.get(
        `http://localhost:8080/api/user/reset/${encodeURIComponent(email)}`,
      );
      setStatus(
        "A password reset email has been sent if the email exists in our system.",
      );
    } catch (err) {
      setStatus("Error sending reset email. Please try again.");
    }
  };

  return (
    <div
      className="max-w-md mx-auto mt-24 bg-white/90 shadow-2xl rounded-2xl p-10 border 
border-gray-200 text-center"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Forgot Password</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="email"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 
focus:ring-indigo-400"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white px-8 py-3 
rounded-lg font-semibold shadow-lg"
        >
          Send Reset Email
        </button>
      </form>
      {status && <p className="mt-4 text-indigo-700">{status}</p>}
    </div>
  );
};

export default ForgotPassword;
