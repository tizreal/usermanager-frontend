import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Helper to store the JWT token in localStorage
function setToken(token) {
  localStorage.setItem("authToken", token);
}

const Login = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ username: "", password: "" });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/api/user/login",
        user,
      );
      // JWT arrives in the response headers, not the body
      const token =
        response.headers["jwt-token"] || response.headers["authorization"];
      if (token) {
        setToken(token);
        navigate("/home");
      } else {
        console.warn("No token in headers:", response.headers);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div
      className="max-w-lg mx-auto mt-16 bg-white/90 shadow-2xl rounded-2xl p-10 border 
border-gray-200"
    >
      <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">
        Login
      </h2>
      <form onSubmit={handleLogin} className="space-y-7">
        {/* Username field */}
        <div>
          <label
            className="block text-base font-semibold mb-2 text-gray
700"
          >
            Username
          </label>
          <input
            type="text"
            name="username"
            value={user.username}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 
focus:ring-indigo-400"
            placeholder="Enter username"
          />
        </div>
        {/* Password field */}
        <div>
          <label
            className="block text-base font-semibold mb-2 text-gray
700"
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            value={user.password}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 
focus:ring-indigo-400"
            placeholder="Enter password"
          />
        </div>
        {/* Register link */}
        <div className="flex justify-center items-center pt-2">
          <span className="text-sm text-gray-600">
            Don't have an account?{" "}
            <a
              href="/register"
              className="text-blue-600 hover:underline font
semibold"
            >
              Register
            </a>
          </span>
        </div>
        {/* Submit */}
        <div className="flex gap-4 justify-center pt-4">
          <button
            type="submit"
            className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white px-8 py-3 
rounded-lg font-semibold shadow-lg"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
